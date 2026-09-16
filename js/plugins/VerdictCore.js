//=============================================================================
// VerdictCore.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] Investigation & deduction engine — exhibits establish facts, testimony carries claims, and presenting the wrong one costs you.
 * @author CSAF — Core Systems Asset Factory
 * @url https://csaf.itch.io/verdict-core
 *
 * @param exhibits
 * @text Exhibits
 * @type struct<Exhibit>[]
 * @desc Every piece of evidence in the game. An exhibit ESTABLISHES facts; it never holds an opinion.
 * @default []
 *
 * @param testimonies
 * @text Testimonies
 * @type struct<Testimony>[]
 * @desc A witness account. Each one is a list of statements the player can press and contradict.
 * @default []
 *
 * @param deductions
 * @text Deductions
 * @type struct<Deduction>[]
 * @desc Fill-in-the-blank accusations. The player builds a sentence out of facts they have proven.
 * @default []
 *
 * @param links
 * @text Case-board links
 * @type struct<LinkRule>[]
 * @desc Two nodes that mean something together. Linking them on the board reveals a conclusion.
 * @default []
 *
 * @param credibilityMax
 * @text Credibility
 * @type number
 * @min 1
 * @max 20
 * @desc How many wrong presentations the player survives. Drawn as notches, never as a number.
 * @default 5
 *
 * @param wrongPenalty
 * @text Cost of a wrong presentation
 * @type number
 * @min 0
 * @max 20
 * @desc Credibility lost when an exhibit contradicts nothing at all.
 * @default 1
 *
 * @param nearPenalty
 * @text Cost of a near miss
 * @type number
 * @min 0
 * @max 20
 * @desc Cost when the exhibit DOES contradict this testimony — just not this statement. 0 = a free nudge.
 * @default 0
 *
 * @param breakReward
 * @text Credibility regained per break
 * @type number
 * @min 0
 * @max 20
 * @default 0
 *
 * @param collapseSwitch
 * @text Switch set when credibility hits zero
 * @type switch
 * @desc Turned ON the moment the player runs out. Your event decides what a collapse means.
 * @default 0
 *
 * @param seed
 * @text Deterministic seed
 * @type number
 * @min 1
 * @desc Every random flourish in this plugin comes from here. Same seed, same result, forever.
 * @default 20260809
 *
 * @command startCase
 * @text Start case
 * @desc Opens an investigation. Exhibits, testimonies and deductions belonging to it become available.
 * @arg caseId
 * @text Case id
 * @type string
 *
 * @command giveExhibit
 * @text Give exhibit
 * @desc Puts an exhibit in the Case File. Its facts become known immediately.
 * @arg exhibitId
 * @type string
 *
 * @command revokeExhibit
 * @text Take exhibit away
 * @arg exhibitId
 * @type string
 *
 * @command learnFact
 * @text Learn a fact directly
 * @desc For facts established by a conversation rather than an object.
 * @arg factId
 * @type string
 *
 * @command startTestimony
 * @text Start cross-examination
 * @desc Opens the cross-examination scene on a testimony.
 * @arg testimonyId
 * @type string
 *
 * @command openCaseFile
 * @text Open the Case File
 *
 * @command openCaseBoard
 * @text Open the Case Board
 * @desc The corkboard. Pin two things together and see whether they mean something.
 *
 * @command openDeduction
 * @text Open a deduction
 * @arg deductionId
 * @type string
 *
 * @command setCredibility
 * @text Set credibility
 * @arg value
 * @type number
 *
 * @command readFactKnown
 * @text Is a fact known? -> switch
 * @arg factId
 * @type string
 * @arg switchId
 * @type switch
 *
 * @command readTestimonyBroken
 * @text Testimony fully broken? -> switch
 * @arg testimonyId
 * @type string
 * @arg switchId
 * @type switch
 *
 * @command readCredibility
 * @text Credibility -> variable
 * @arg variableId
 * @type variable
 *
 * @command readBreakCount
 * @text Statements broken so far -> variable
 * @arg variableId
 * @type variable
 *
 * @help
 * ============================================================================
 * Verdict Core — what it actually is
 * ============================================================================
 *
 * RPG Maker has a shop, a battle system and a quest log. It has no model of
 * being RIGHT. Every mystery game built in it fakes deduction with a Conditional
 * Branch on an item id — which works exactly once, cannot express "close, but
 * not about that", and turns into unmaintainable event spaghetti the moment a
 * case has more than three clues.
 *
 * This plugin supplies the missing model, and it is three ideas:
 *
 *   1. AN EXHIBIT ESTABLISHES FACTS. A bloodstained glove is not evidence of
 *      guilt. It is evidence that BLOOD WAS SPILLED INDOORS. Facts are the only
 *      currency the engine trades in, so one exhibit can break four different
 *      lies and a new exhibit can never break a statement by accident.
 *
 *   2. A STATEMENT CARRIES CLAIMS. "I never went inside" claims
 *      `suspect_stayed_outside`. It is contradicted by any fact that cannot be
 *      true alongside that claim. The author lists those facts; the engine does
 *      the matching.
 *
 *   3. BEING WRONG HAS THREE FLAVOURS, NOT TWO. Presenting the murder weapon
 *      against the wrong line is not the same mistake as presenting a laundry
 *      receipt. The first is a NEAR MISS — the exhibit does contradict this
 *      testimony, just not here — and the engine says so without charging you
 *      for it. That single distinction is why the genre feels fair, and it is
 *      the reason this is an engine rather than a switch.
 *
 * ============================================================================
 * The three scenes
 * ============================================================================
 *
 *   Case File   every exhibit, what it establishes, and your credibility.
 *   Cross-Exam  the testimony. Press a line, or present an exhibit against it.
 *   Case Board  a corkboard. Pin two things together with string; if they mean
 *               something, a conclusion card appears and the fact becomes yours.
 *
 * All three are drawn by VerdictCaseFile.js, which is a separate file so you
 * can replace the entire look without touching a line of the logic here.
 *
 * ============================================================================
 * Authoring a case, in the order you will actually do it
 * ============================================================================
 *
 * 1. WRITE THE LIE FIRST. Decide what the witness says that is not true.
 * 2. Name the fact that makes it impossible — `blood_was_indoors`.
 * 3. Create the exhibit that establishes that fact.
 * 4. List the fact under that statement's "Contradicted by".
 *
 * That order matters. Authors who start from the evidence end up with exhibits
 * that establish nothing and statements nothing can touch.
 *
 * Fact ids are plain lowercase strings you invent. They are never shown to the
 * player — every screen shows the exhibit's name and the statement's text.
 *
 * ============================================================================
 * Script calls (Conditional Branch, Control Variables)
 * ============================================================================
 *
 *   Verdict.knows('blood_was_indoors')        -> true / false
 *   Verdict.holds('bloodied_glove')           -> true / false
 *   Verdict.broken('t_maid', 's_never_inside')-> true / false
 *   Verdict.testimonyBroken('t_maid')         -> true / false
 *   Verdict.credibility()                     -> number
 *   Verdict.insights()                        -> array of conclusion strings
 *
 * ============================================================================
 * Compatibility
 * ============================================================================
 *
 * Verdict Core adds scenes; it replaces none. Every core method it touches is
 * extended with the original saved and called, so it coexists with menu,
 * message and battle plugins. It writes one key on $gameSystem and nothing else,
 * so its save data round-trips through any other plugin's save handling.
 *
 * Works alongside CSAF Chronicle Core: break a statement, set a world-state
 * flag, and the consequence engine takes it from there.
 *
 * ============================================================================
 * Terms
 * ============================================================================
 *
 * Free for use in commercial and non-commercial RPG Maker MZ projects.
 * Do not redistribute the plugin itself. Credit appreciated, never required.
 */

/*~struct~Exhibit:
 * @param id
 * @text Exhibit id
 * @desc Internal name. Letters, numbers, _ and - only.
 *
 * @param name
 * @text Display name
 *
 * @param kind
 * @text Kind
 * @type select
 * @option Physical
 * @value physical
 * @option Document
 * @value document
 * @option Account
 * @value account
 * @option Person
 * @value person
 * @default physical
 *
 * @param summary
 * @text One-line summary
 * @desc Shown under the name in the Case File list.
 *
 * @param detail
 * @text Full description
 * @type note
 *
 * @param iconIndex
 * @text Icon
 * @type number
 * @default 0
 *
 * @param facts
 * @text Establishes these facts
 * @type string[]
 * @desc Fact ids. THIS is what makes the exhibit useful — an exhibit with no facts can contradict nothing.
 * @default []
 */

/*~struct~Statement:
 * @param id
 * @text Statement id
 *
 * @param text
 * @text What the witness says
 * @type note
 *
 * @param claims
 * @text Claims (for your own notes)
 * @type string[]
 * @default []
 *
 * @param contradictedBy
 * @text Contradicted by these facts
 * @type string[]
 * @desc Present an exhibit establishing any one of these and the statement breaks.
 * @default []
 *
 * @param pressText
 * @text If pressed, the witness says
 * @type note
 *
 * @param pressFacts
 * @text Pressing establishes
 * @type string[]
 * @default []
 *
 * @param pressAdds
 * @text Pressing adds this statement
 * @desc Id of a statement in this same testimony that stays hidden until this one is pressed.
 *
 * @param hidden
 * @text Starts hidden
 * @type boolean
 * @default false
 *
 * @param breakText
 * @text On break, the witness says
 * @type note
 *
 * @param breakFacts
 * @text Breaking establishes
 * @type string[]
 * @default []
 */

/*~struct~Testimony:
 * @param id
 * @text Testimony id
 *
 * @param title
 * @text Title
 * @desc Shown as the case heading during cross-examination.
 *
 * @param speaker
 * @text Speaker
 *
 * @param statements
 * @text Statements
 * @type struct<Statement>[]
 * @default []
 *
 * @param requireAll
 * @text Must break every statement
 * @type boolean
 * @desc OFF means breaking any one statement completes the testimony.
 * @default false
 */

/*~struct~Slot:
 * @param label
 * @text Slot label
 *
 * @param options
 * @text Options
 * @type string[]
 * @desc Fact ids offered for this blank. Wrong ones should be plausible.
 * @default []
 *
 * @param correct
 * @text Correct fact
 */

/*~struct~Deduction:
 * @param id
 * @text Deduction id
 *
 * @param prompt
 * @text Sentence
 * @type note
 * @desc Use {0}, {1}, {2} where the blanks go.
 *
 * @param slots
 * @text Blanks
 * @type struct<Slot>[]
 * @default []
 *
 * @param solvedSwitch
 * @text Switch on solve
 * @type switch
 * @default 0
 *
 * @param solvedFacts
 * @text Solving establishes
 * @type string[]
 * @default []
 */

/*~struct~LinkRule:
 * @param id
 * @text Link id
 *
 * @param a
 * @text First node
 * @desc exhibit:<id> or statement:<id>
 *
 * @param b
 * @text Second node
 * @desc exhibit:<id> or statement:<id>
 *
 * @param conclusion
 * @text Conclusion
 * @type note
 * @desc The card that appears on the board when the string is drawn.
 *
 * @param facts
 * @text Establishes
 * @type string[]
 * @default []
 */

var VerdictCore = VerdictCore || {};

(function () {
  'use strict';

  //===========================================================================
  // Identifiers
  //===========================================================================
  //
  // Ids arrive from the Plugin Manager, which is a text box, and then get used
  // as object keys. That is exactly how this wing previously shipped a flag
  // named `__proto__` that set the prototype instead of storing a value and
  // then read back false forever — and the follow-on fix was worse, because
  // JsonEx reads `value.constructor.name` and throws on a null-prototype
  // object, which would have made EVERY SAVE IN EVERY BUYER'S GAME fail.
  //
  // So ids are validated at the door and the three poisonous names are refused
  // by name. A plain `{}` is then safe to use as a map.

  /** Ids must look like ids. Anything else is an authoring mistake worth shouting about. */
  const ID_SHAPE = /^[A-Za-z0-9_-]{1,64}$/;

  /** Names that mutate an object's prototype chain instead of storing a value. */
  const POISON = ['__proto__', 'constructor', 'prototype'];

  /**
   * Validate an identifier coming from author data.
   *
   * @param {string} id Candidate id.
   * @param {string} what Human label used in the error.
   * @returns {string} The id, unchanged.
   * @throws {Error} When the id is malformed or is a prototype-poisoning name.
   */
  function assertId(id, what) {
    if (typeof id !== 'string' || !ID_SHAPE.test(id)) {
      throw new Error(`Verdict Core: ${what} id must be 1-64 chars of A-Z a-z 0-9 _ - (got ${JSON.stringify(id)})`);
    }
    if (POISON.indexOf(id) >= 0) {
      throw new Error(`Verdict Core: "${id}" cannot be used as a ${what} id — it would rewrite an object's prototype.`);
    }
    return id;
  }

  /**
   * Coerce author input into a clean, de-duplicated array of fact ids.
   *
   * Accepts an array, a JSON array string (what the Plugin Manager hands back),
   * a comma-separated string, or nothing at all.
   *
   * @param {*} value Raw author input.
   * @returns {string[]} Validated fact ids, order preserved, duplicates dropped.
   */
  function factList(value) {
    let raw = value;
    if (raw === undefined || raw === null || raw === '') return [];
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed.charAt(0) === '[') {
        try { raw = JSON.parse(trimmed); } catch (e) { raw = trimmed.split(','); }
      } else {
        raw = trimmed.split(',');
      }
    }
    if (!Array.isArray(raw)) raw = [raw];
    const out = [];
    for (let i = 0; i < raw.length; i++) {
      const f = String(raw[i]).trim();
      if (!f) continue;
      assertId(f, 'fact');
      if (out.indexOf(f) < 0) out.push(f);
    }
    return out;
  }

  //===========================================================================
  // Deterministic randomness
  //===========================================================================
  //
  // Never Math.random(). Every flourish this product draws — the fibre in the
  // paper, the scuff on a stamp, the sag in a string — is seeded, because a
  // store capture has to produce the identical PNG on every run or the whole
  // unattended capture pipeline is a lie.

  const Rng = {
    /**
     * Create a seeded xorshift32 generator.
     * @param {number} seed Any non-zero integer.
     * @returns {{s:number}} Generator state.
     */
    create(seed) {
      const s = (Number(seed) | 0) || 20260809;
      return { s: s === 0 ? 20260809 : s };
    },

    /**
     * Next float in [0,1).
     * @param {{s:number}} r Generator state.
     * @returns {number} Pseudo-random float.
     */
    next(r) {
      let x = r.s;
      x ^= x << 13; x |= 0;
      x ^= x >>> 17;
      x ^= x << 5; x |= 0;
      r.s = x;
      return ((x >>> 0) % 100000) / 100000;
    },

    /**
     * Next integer in [0,n).
     * @param {{s:number}} r Generator state.
     * @param {number} n Exclusive upper bound.
     * @returns {number} Pseudo-random integer.
     */
    int(r, n) { return Math.floor(Rng.next(r) * n); }
  };

  //===========================================================================
  // Definitions — the immutable half
  //===========================================================================

  const Exhibit = {
    /**
     * Define an exhibit.
     *
     * @param {object} spec Author data.
     * @param {string} spec.id Unique id.
     * @param {string} spec.name Display name.
     * @param {string} [spec.kind] physical | document | account | person.
     * @param {string} [spec.summary] One-line summary for the list.
     * @param {string} [spec.detail] Full description.
     * @param {number} [spec.iconIndex] MZ icon index.
     * @param {string[]} [spec.facts] Facts this exhibit establishes.
     * @returns {object} Frozen exhibit definition.
     */
    define(spec) {
      const e = {
        id: assertId(spec && spec.id, 'exhibit'),
        name: String((spec && spec.name) || spec.id),
        kind: String((spec && spec.kind) || 'physical'),
        summary: String((spec && spec.summary) || ''),
        detail: String((spec && spec.detail) || ''),
        iconIndex: Number((spec && spec.iconIndex) || 0),
        facts: factList(spec && spec.facts)
      };
      return e;
    }
  };

  const Statement = {
    /**
     * Define a single line of testimony.
     *
     * @param {object} spec Author data.
     * @returns {object} Statement definition.
     */
    define(spec) {
      return {
        id: assertId(spec && spec.id, 'statement'),
        text: String((spec && spec.text) || ''),
        claims: factList(spec && spec.claims),
        contradictedBy: factList(spec && spec.contradictedBy),
        pressText: String((spec && spec.pressText) || ''),
        pressFacts: factList(spec && spec.pressFacts),
        pressAdds: spec && spec.pressAdds ? assertId(spec.pressAdds, 'statement') : null,
        hidden: spec ? spec.hidden === true || spec.hidden === 'true' : false,
        breakText: String((spec && spec.breakText) || ''),
        breakFacts: factList(spec && spec.breakFacts)
      };
    }
  };

  const Testimony = {
    /**
     * Define a witness account.
     *
     * @param {object} spec Author data. `statements` may be raw specs or already-defined statements.
     * @returns {object} Testimony definition.
     */
    define(spec) {
      // ⚠️ ALWAYS re-define. An earlier draft tried to detect "already defined"
      // objects and pass them through — `Array.isArray(s.contradictedBy) && s.id
      // && s.pressFacts` — and it let raw author data straight into the engine
      // whenever an author happened to fill those three fields. `present()` then
      // threw `s.breakFacts is not iterable` from deep inside the break path,
      // pointing at a statement that looked perfectly well-formed. Every
      // `define` in this file is idempotent instead, which is a property rather
      // than a guess.
      const statements = ((spec && spec.statements) || []).map((s) => Statement.define(s));
      const seen = {};
      for (const s of statements) {
        if (seen[s.id]) throw new Error(`Verdict Core: testimony "${spec.id}" repeats statement id "${s.id}"`);
        seen[s.id] = true;
      }
      return {
        id: assertId(spec && spec.id, 'testimony'),
        title: String((spec && spec.title) || spec.id),
        speaker: String((spec && spec.speaker) || ''),
        statements,
        requireAll: spec ? spec.requireAll === true || spec.requireAll === 'true' : false
      };
    },

    /**
     * Find a statement by id.
     * @param {object} t Testimony definition.
     * @param {string} statementId Statement id.
     * @returns {object|null} The statement, or null.
     */
    statement(t, statementId) {
      for (let i = 0; i < t.statements.length; i++) if (t.statements[i].id === statementId) return t.statements[i];
      return null;
    }
  };

  const Deduction = {
    /**
     * Define a fill-in-the-blank accusation.
     * @param {object} spec Author data.
     * @returns {object} Deduction definition.
     */
    define(spec) {
      const slots = ((spec && spec.slots) || []).map((s, i) => {
        const options = factList(s && s.options);
        const correct = assertId(s && s.correct, 'fact');
        if (options.indexOf(correct) < 0) {
          throw new Error(`Verdict Core: deduction "${spec.id}" slot ${i} lists correct fact "${correct}" that is not among its options.`);
        }
        return { label: String((s && s.label) || ''), options, correct };
      });
      if (!slots.length) throw new Error(`Verdict Core: deduction "${spec && spec.id}" has no blanks to fill.`);
      return {
        id: assertId(spec && spec.id, 'deduction'),
        prompt: String((spec && spec.prompt) || ''),
        slots,
        solvedSwitch: Number((spec && spec.solvedSwitch) || 0),
        solvedFacts: factList(spec && spec.solvedFacts)
      };
    }
  };

  /** A board node is `exhibit:<id>` or `statement:<id>`. Free-form strings would silently never match. */
  const NODE_SHAPE = /^(exhibit|statement):[A-Za-z0-9_-]{1,64}$/;

  const LinkRule = {
    /**
     * Define a meaningful pairing on the case board.
     * @param {object} spec Author data.
     * @returns {object} Link rule definition.
     */
    define(spec) {
      const a = String((spec && spec.a) || '');
      const b = String((spec && spec.b) || '');
      for (const n of [a, b]) {
        if (!NODE_SHAPE.test(n)) {
          throw new Error(`Verdict Core: link "${spec && spec.id}" node must be exhibit:<id> or statement:<id> (got ${JSON.stringify(n)})`);
        }
      }
      if (a === b) throw new Error(`Verdict Core: link "${spec.id}" joins a node to itself.`);
      return {
        id: assertId(spec && spec.id, 'link'),
        a,
        b,
        conclusion: String((spec && spec.conclusion) || ''),
        facts: factList(spec && spec.facts)
      };
    },

    /**
     * Does this rule join these two nodes, in either order?
     * @param {object} rule Link rule.
     * @param {string} x First node.
     * @param {string} y Second node.
     * @returns {boolean} True when the pair matches.
     */
    joins(rule, x, y) {
      return (rule.a === x && rule.b === y) || (rule.a === y && rule.b === x);
    }
  };

  const CaseFile = {
    /**
     * Assemble a case from its parts.
     *
     * @param {object} spec `{ id, title, exhibits, testimonies, deductions, links }`.
     * @returns {object} Case definition with lookup maps.
     */
    define(spec) {
      const def = {
        id: assertId((spec && spec.id) || 'case', 'case'),
        title: String((spec && spec.title) || ''),
        // Every definer is idempotent, so this runs unconditionally. See the
        // note on Testimony.define: the "is it already defined?" shortcut this
        // replaced silently admitted raw author data and the failure surfaced
        // three call levels away.
        exhibits: ((spec && spec.exhibits) || []).map((e) => Exhibit.define(e)),
        testimonies: ((spec && spec.testimonies) || []).map((t) => Testimony.define(t)),
        deductions: ((spec && spec.deductions) || []).map((d) => Deduction.define(d)),
        links: ((spec && spec.links) || []).map((l) => LinkRule.define(l))
      };
      def._exhibitById = {};
      for (const e of def.exhibits) def._exhibitById[e.id] = e;
      def._testimonyById = {};
      for (const t of def.testimonies) def._testimonyById[t.id] = t;
      def._deductionById = {};
      for (const d of def.deductions) def._deductionById[d.id] = d;
      return def;
    },

    /**
     * Look up an exhibit.
     * @param {object} def Case definition.
     * @param {string} id Exhibit id.
     * @returns {object|null} Exhibit or null.
     */
    exhibit(def, id) { return def._exhibitById[id] || null; },

    /**
     * Look up a testimony.
     * @param {object} def Case definition.
     * @param {string} id Testimony id.
     * @returns {object|null} Testimony or null.
     */
    testimony(def, id) { return def._testimonyById[id] || null; },

    /**
     * Look up a deduction.
     * @param {object} def Case definition.
     * @param {string} id Deduction id.
     * @returns {object|null} Deduction or null.
     */
    deduction(def, id) { return def._deductionById[id] || null; }
  };

  //===========================================================================
  // Investigation — the mutable half
  //===========================================================================

  const Investigation = {
    /**
     * Begin an investigation into a case.
     *
     * @param {object} def Case definition.
     * @param {object} [opts] `{ credibility, wrongPenalty, nearPenalty, breakReward, seed }`.
     * @returns {object} Live investigation state.
     */
    start(def, opts) {
      const o = opts || {};
      const max = Math.max(1, Number(o.credibility != null ? o.credibility : 5));
      return {
        caseId: def.id,
        def,
        held: [],                 // exhibit ids, in the order the player got them
        learned: [],              // facts learned directly, not via an exhibit
        broken: {},               // "<testimonyId>/<statementId>" -> true
        revealed: {},             // hidden statements the player has surfaced
        insights: [],             // link rule ids, in discovery order
        answers: {},              // "<deductionId>/<slot>" -> factId
        solved: {},               // deduction ids
        credibility: max,
        credibilityMax: max,
        wrongPenalty: Number(o.wrongPenalty != null ? o.wrongPenalty : 1),
        nearPenalty: Number(o.nearPenalty != null ? o.nearPenalty : 0),
        breakReward: Number(o.breakReward != null ? o.breakReward : 0),
        breaks: 0,
        rng: Rng.create(o.seed || 20260809)
      };
    },

    /**
     * Put an exhibit in the case file.
     * @param {object} st Investigation state.
     * @param {string} exhibitId Exhibit id.
     * @returns {boolean} True when it was newly added.
     */
    give(st, exhibitId) {
      assertId(exhibitId, 'exhibit');
      if (!CaseFile.exhibit(st.def, exhibitId)) {
        throw new Error(`Verdict Core: no exhibit "${exhibitId}" in case "${st.caseId}".`);
      }
      if (st.held.indexOf(exhibitId) >= 0) return false;
      st.held.push(exhibitId);
      return true;
    },

    /**
     * Remove an exhibit from the case file.
     * @param {object} st Investigation state.
     * @param {string} exhibitId Exhibit id.
     * @returns {boolean} True when it was present and removed.
     */
    revoke(st, exhibitId) {
      const i = st.held.indexOf(exhibitId);
      if (i < 0) return false;
      st.held.splice(i, 1);
      return true;
    },

    /** @param {object} st State. @param {string} id Exhibit id. @returns {boolean} Held? */
    holds(st, id) { return st.held.indexOf(id) >= 0; },

    /**
     * Establish a fact without an exhibit — a confession, a look at a room.
     * @param {object} st Investigation state.
     * @param {string} factId Fact id.
     * @returns {boolean} True when newly learned.
     */
    learn(st, factId) {
      assertId(factId, 'fact');
      if (st.learned.indexOf(factId) >= 0) return false;
      st.learned.push(factId);
      return true;
    },

    /**
     * Every fact the player can currently prove.
     *
     * Deliberately recomputed rather than cached: an exhibit can be taken away
     * mid-case, and a cached fact set would leave the player able to contradict
     * a statement with something they no longer have.
     *
     * @param {object} st Investigation state.
     * @returns {string[]} Fact ids.
     */
    facts(st) {
      const out = st.learned.slice();
      for (const id of st.held) {
        const e = CaseFile.exhibit(st.def, id);
        if (!e) continue;
        for (const f of e.facts) if (out.indexOf(f) < 0) out.push(f);
      }
      return out;
    },

    /** @param {object} st State. @param {string} factId Fact. @returns {boolean} Known? */
    knows(st, factId) { return Investigation.facts(st).indexOf(factId) >= 0; },

    /**
     * The statements currently visible in a testimony.
     *
     * Hidden statements are the ones a witness only volunteers under pressure.
     * The UI must never index into `t.statements` directly, because it would
     * show lines the witness has not said yet.
     *
     * @param {object} st Investigation state.
     * @param {string} testimonyId Testimony id.
     * @returns {object[]} Visible statement definitions, in order.
     */
    visible(st, testimonyId) {
      const t = CaseFile.testimony(st.def, testimonyId);
      if (!t) return [];
      const out = [];
      for (const s of t.statements) {
        if (!s.hidden || st.revealed[testimonyId + '/' + s.id]) out.push(s);
      }
      return out;
    },

    /** @param {object} st State. @param {string} tId Testimony. @param {string} sId Statement. @returns {boolean} Broken? */
    isBroken(st, tId, sId) { return st.broken[tId + '/' + sId] === true; },

    /**
     * Press a statement. The witness elaborates, and sometimes gives something away.
     *
     * Pressing is always free. A genre where asking a question can lose the case
     * teaches players to stop asking questions.
     *
     * @param {object} st Investigation state.
     * @param {string} testimonyId Testimony id.
     * @param {string} statementId Statement id.
     * @returns {{kind:string, text:string, facts:string[], added:string|null}} What happened.
     */
    press(st, testimonyId, statementId) {
      const t = CaseFile.testimony(st.def, testimonyId);
      if (!t) throw new Error(`Verdict Core: no testimony "${testimonyId}".`);
      const s = Testimony.statement(t, statementId);
      if (!s) throw new Error(`Verdict Core: testimony "${testimonyId}" has no statement "${statementId}".`);

      const gained = [];
      for (const f of s.pressFacts) if (Investigation.learn(st, f)) gained.push(f);

      let added = null;
      if (s.pressAdds && !st.revealed[testimonyId + '/' + s.pressAdds]) {
        if (!Testimony.statement(t, s.pressAdds)) {
          throw new Error(`Verdict Core: statement "${statementId}" adds "${s.pressAdds}", which is not in testimony "${testimonyId}".`);
        }
        st.revealed[testimonyId + '/' + s.pressAdds] = true;
        added = s.pressAdds;
      }
      return { kind: 'press', text: s.pressText, facts: gained, added };
    },

    /**
     * Present an exhibit against a statement. This is the whole product.
     *
     * Four outcomes, and the third is the one no other plugin models:
     *
     *   break   the exhibit establishes a fact this statement cannot survive
     *   already the statement is broken; presenting again is not a mistake
     *   near    the exhibit contradicts this testimony — just not this line.
     *           Charged at `nearPenalty`, which defaults to nothing. Without
     *           this case the genre degenerates into presenting every exhibit
     *           against every line until something sticks.
     *   wrong   it contradicts nothing here. Costs credibility.
     *
     * @param {object} st Investigation state.
     * @param {string} testimonyId Testimony id.
     * @param {string} statementId Statement id.
     * @param {string} exhibitId Exhibit id.
     * @returns {object} Result: `{ kind, factId, statementId, penalty, text, facts, collapsed }`.
     */
    present(st, testimonyId, statementId, exhibitId) {
      const t = CaseFile.testimony(st.def, testimonyId);
      if (!t) throw new Error(`Verdict Core: no testimony "${testimonyId}".`);
      const s = Testimony.statement(t, statementId);
      if (!s) throw new Error(`Verdict Core: testimony "${testimonyId}" has no statement "${statementId}".`);
      const e = CaseFile.exhibit(st.def, exhibitId);
      if (!e) throw new Error(`Verdict Core: no exhibit "${exhibitId}".`);
      if (!Investigation.holds(st, exhibitId)) {
        throw new Error(`Verdict Core: the player does not hold exhibit "${exhibitId}" and cannot present it.`);
      }

      if (Investigation.isBroken(st, testimonyId, statementId)) {
        return { kind: 'already', factId: null, statementId, penalty: 0, text: '', facts: [], collapsed: false };
      }

      const hit = firstShared(e.facts, s.contradictedBy);
      if (hit) {
        st.broken[testimonyId + '/' + s.id] = true;
        st.breaks++;
        const gained = [];
        for (const f of s.breakFacts) if (Investigation.learn(st, f)) gained.push(f);
        st.credibility = Math.min(st.credibilityMax, st.credibility + st.breakReward);
        return { kind: 'break', factId: hit, statementId, penalty: 0, text: s.breakText, facts: gained, collapsed: false };
      }

      // Near miss: right evidence, wrong line. Report WHICH line, because the
      // point of a near miss is to teach, and "somewhere in this testimony" is
      // not a lesson.
      for (const other of Investigation.visible(st, testimonyId)) {
        if (other.id === s.id) continue;
        if (Investigation.isBroken(st, testimonyId, other.id)) continue;
        if (firstShared(e.facts, other.contradictedBy)) {
          st.credibility -= st.nearPenalty;
          return {
            kind: 'near', factId: null, statementId: other.id, penalty: st.nearPenalty,
            text: '', facts: [], collapsed: st.credibility <= 0
          };
        }
      }

      st.credibility -= st.wrongPenalty;
      const collapsed = st.credibility <= 0;
      if (collapsed) st.credibility = 0;
      return { kind: 'wrong', factId: null, statementId, penalty: st.wrongPenalty, text: '', facts: [], collapsed };
    },

    /**
     * How far through a testimony the player is.
     * @param {object} st Investigation state.
     * @param {string} testimonyId Testimony id.
     * @returns {{broken:number, breakable:number, total:number, complete:boolean}} Progress.
     */
    progress(st, testimonyId) {
      const t = CaseFile.testimony(st.def, testimonyId);
      if (!t) return { broken: 0, breakable: 0, total: 0, complete: false };
      let broken = 0;
      let breakable = 0;
      for (const s of t.statements) {
        if (s.contradictedBy.length) breakable++;
        if (Investigation.isBroken(st, testimonyId, s.id)) broken++;
      }
      const complete = t.requireAll ? (breakable > 0 && broken >= breakable) : broken > 0;
      return { broken, breakable, total: t.statements.length, complete };
    },

    /**
     * Pin two nodes together on the case board.
     *
     * @param {object} st Investigation state.
     * @param {string} nodeA `exhibit:<id>` or `statement:<id>`.
     * @param {string} nodeB The other node.
     * @returns {{kind:string, ruleId:string|null, conclusion:string, facts:string[]}} What the string revealed.
     */
    link(st, nodeA, nodeB) {
      if (nodeA === nodeB) return { kind: 'nothing', ruleId: null, conclusion: '', facts: [] };
      for (const rule of st.def.links) {
        if (!LinkRule.joins(rule, nodeA, nodeB)) continue;
        if (st.insights.indexOf(rule.id) >= 0) {
          return { kind: 'known', ruleId: rule.id, conclusion: rule.conclusion, facts: [] };
        }
        st.insights.push(rule.id);
        const gained = [];
        for (const f of rule.facts) if (Investigation.learn(st, f)) gained.push(f);
        return { kind: 'insight', ruleId: rule.id, conclusion: rule.conclusion, facts: gained };
      }
      return { kind: 'nothing', ruleId: null, conclusion: '', facts: [] };
    },

    /**
     * The conclusions the board has produced, in discovery order.
     * @param {object} st Investigation state.
     * @returns {string[]} Conclusion texts.
     */
    conclusions(st) {
      const out = [];
      for (const id of st.insights) {
        for (const rule of st.def.links) if (rule.id === id) out.push(rule.conclusion);
      }
      return out;
    },

    /**
     * Fill one blank in a deduction.
     *
     * Answering is not scored until every blank is filled — a half-built
     * sentence is thinking out loud, not an accusation.
     *
     * @param {object} st Investigation state.
     * @param {string} deductionId Deduction id.
     * @param {number} slotIndex Which blank.
     * @param {string} factId Chosen fact.
     * @returns {{kind:string, filled:number, of:number}} Progress after the choice.
     */
    answer(st, deductionId, slotIndex, factId) {
      const d = CaseFile.deduction(st.def, deductionId);
      if (!d) throw new Error(`Verdict Core: no deduction "${deductionId}".`);
      const slot = d.slots[slotIndex];
      if (!slot) throw new Error(`Verdict Core: deduction "${deductionId}" has no blank ${slotIndex}.`);
      if (slot.options.indexOf(factId) < 0) {
        throw new Error(`Verdict Core: "${factId}" is not offered for blank ${slotIndex} of "${deductionId}".`);
      }
      st.answers[deductionId + '/' + slotIndex] = factId;
      let filled = 0;
      for (let i = 0; i < d.slots.length; i++) if (st.answers[deductionId + '/' + i]) filled++;
      return { kind: 'filled', filled, of: d.slots.length };
    },

    /**
     * Submit a completed deduction.
     *
     * `solvedSwitch` is REPORTED rather than applied. This half of the file runs
     * in plain Node with no `$gameSwitches` in sight, and an engine call buried
     * in the rules would make the rules untestable — so the result carries the
     * switch number out to `applyResult`, which owns every engine side effect.
     * Before this existed, `solvedSwitch` was a documented ~struct~ field that
     * was parsed, stored, and read by absolutely nothing.
     *
     * @param {object} st Investigation state.
     * @param {string} deductionId Deduction id.
     * @returns {{kind:string, wrongSlots:number[], facts:string[], collapsed:boolean, solvedSwitch:number}} Verdict.
     */
    submit(st, deductionId) {
      const d = CaseFile.deduction(st.def, deductionId);
      if (!d) throw new Error(`Verdict Core: no deduction "${deductionId}".`);
      const wrongSlots = [];
      for (let i = 0; i < d.slots.length; i++) {
        const given = st.answers[deductionId + '/' + i];
        if (given == null) {
          return { kind: 'incomplete', wrongSlots: [], facts: [], collapsed: false, solvedSwitch: 0 };
        }
        if (given !== d.slots[i].correct) wrongSlots.push(i);
      }
      if (wrongSlots.length) {
        st.credibility -= st.wrongPenalty;
        const collapsed = st.credibility <= 0;
        if (collapsed) st.credibility = 0;
        return { kind: 'wrong', wrongSlots, facts: [], collapsed, solvedSwitch: 0 };
      }
      st.solved[deductionId] = true;
      const gained = [];
      for (const f of d.solvedFacts) if (Investigation.learn(st, f)) gained.push(f);
      return { kind: 'solved', wrongSlots: [], facts: gained, collapsed: false, solvedSwitch: d.solvedSwitch };
    },

    /**
     * Directly set credibility, clamped to the case's range.
     * @param {object} st Investigation state.
     * @param {number} value New value.
     * @returns {number} The clamped value actually stored.
     */
    setCredibility(st, value) {
      st.credibility = Math.max(0, Math.min(st.credibilityMax, Number(value) | 0));
      return st.credibility;
    }
  };

  /**
   * First element of `a` that also appears in `b`.
   *
   * Written as an indexed loop on purpose. This runs inside `present`, which the
   * cross-examination scene can call on a keypress, and `.filter().find()` would
   * allocate two arrays every time for a set that is almost always under five
   * items (CLAUDE.md: zero allocation in hot paths).
   *
   * @param {string[]} a First list.
   * @param {string[]} b Second list.
   * @returns {string|null} The shared value, or null.
   */
  function firstShared(a, b) {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) if (a[i] === b[j]) return a[i];
    }
    return null;
  }

  //===========================================================================
  // Save / load
  //===========================================================================
  //
  // Only ids and counters are stored. The case DEFINITION is never serialised:
  // it lives in the Plugin Manager, so a developer who fixes a typo in a
  // statement after release does not have to invalidate every player's save.

  const Save = {
    /** Bump this and add a migration below whenever the shape changes. */
    VERSION: 1,

    /**
     * Serialise an investigation into save data.
     * @param {object} st Investigation state.
     * @returns {object} Plain JSON-safe object.
     */
    dump(st) {
      return {
        v: Save.VERSION,
        caseId: st.caseId,
        held: st.held.slice(),
        learned: st.learned.slice(),
        broken: Object.keys(st.broken).filter((k) => st.broken[k]),
        revealed: Object.keys(st.revealed).filter((k) => st.revealed[k]),
        insights: st.insights.slice(),
        answers: Object.assign({}, st.answers),
        solved: Object.keys(st.solved).filter((k) => st.solved[k]),
        credibility: st.credibility,
        credibilityMax: st.credibilityMax,
        breaks: st.breaks,
        rng: st.rng.s
      };
    },

    /**
     * Rebuild an investigation from save data against a case definition.
     *
     * Unknown ids are DROPPED rather than throwing. A save from a build where an
     * exhibit still existed must still load in the build where it was cut —
     * refusing to load a save is the worst possible response to a content edit.
     *
     * @param {object} raw Save data from `dump`.
     * @param {object} def Case definition to rebind against.
     * @param {object} [opts] Same options as `Investigation.start`.
     * @returns {object} Restored investigation state.
     */
    restore(raw, def, opts) {
      const st = Investigation.start(def, opts);
      if (!raw || typeof raw !== 'object') return st;
      const data = Save.migrate(raw);

      for (const id of data.held || []) if (CaseFile.exhibit(def, id)) st.held.push(id);
      for (const f of data.learned || []) if (ID_SHAPE.test(f) && POISON.indexOf(f) < 0) st.learned.push(f);
      for (const k of data.broken || []) if (typeof k === 'string' && k.indexOf('/') > 0) st.broken[k] = true;
      for (const k of data.revealed || []) if (typeof k === 'string' && k.indexOf('/') > 0) st.revealed[k] = true;
      for (const id of data.insights || []) if (def.links.some((r) => r.id === id)) st.insights.push(id);
      for (const k of Object.keys(data.answers || {})) {
        if (typeof k === 'string' && POISON.indexOf(k) < 0) st.answers[k] = String(data.answers[k]);
      }
      for (const id of data.solved || []) if (CaseFile.deduction(def, id)) st.solved[id] = true;

      if (typeof data.credibilityMax === 'number') st.credibilityMax = data.credibilityMax;
      if (typeof data.credibility === 'number') {
        st.credibility = Math.max(0, Math.min(st.credibilityMax, data.credibility));
      }
      st.breaks = Number(data.breaks || 0);
      if (typeof data.rng === 'number' && data.rng !== 0) st.rng.s = data.rng;
      return st;
    },

    /**
     * Bring older save data up to the current version.
     *
     * There is exactly one version today and this function is therefore a
     * no-op — which is the point. The seam exists before it is needed, because
     * adding one after players have saves is how a plugin ships a save-breaking
     * update.
     *
     * @param {object} raw Save data of any version.
     * @returns {object} Data at `Save.VERSION`.
     */
    migrate(raw) {
      const v = Number(raw.v || 0);
      if (v === Save.VERSION) return raw;
      if (v < 1) return Object.assign({ v: 1 }, raw);
      return raw;
    }
  };

  //===========================================================================
  // Namespace
  //===========================================================================

  VerdictCore.Rng = Rng;
  VerdictCore.Exhibit = Exhibit;
  VerdictCore.Statement = Statement;
  VerdictCore.Testimony = Testimony;
  VerdictCore.Deduction = Deduction;
  VerdictCore.LinkRule = LinkRule;
  VerdictCore.CaseFile = CaseFile;
  VerdictCore.Investigation = Investigation;
  VerdictCore.Save = Save;
  VerdictCore.assertId = assertId;
  VerdictCore.factList = factList;

  //===========================================================================
  // RPG Maker MZ integration
  //===========================================================================
  //
  // Everything above this line runs in plain Node with no engine present, which
  // is what makes the headless suite possible. Everything below only runs
  // inside MZ.

  if (typeof PluginManager === 'undefined') {
    if (typeof module !== 'undefined' && module.exports) module.exports = VerdictCore;
    return;
  }

  const PLUGIN = 'VerdictCore';
  const raw = PluginManager.parameters(PLUGIN);

  /**
   * Parse a Plugin Manager `struct[]` parameter into plain objects.
   *
   * The Plugin Manager hands back a JSON array of JSON STRINGS, and nested
   * structs are nested strings, so a single JSON.parse gets you an array of
   * text. This walks one level and then lets each definer coerce its own
   * fields.
   *
   * @param {string} text Raw parameter value.
   * @returns {object[]} Parsed entries; malformed ones are skipped, loudly.
   */
  function structList(text) {
    if (!text) return [];
    let arr;
    try { arr = JSON.parse(text); } catch (e) {
      console.error(`Verdict Core: could not parse a parameter list — ${e.message}`);
      return [];
    }
    const out = [];
    for (const item of arr) {
      try { out.push(typeof item === 'string' ? JSON.parse(item) : item); } catch (e) {
        console.error(`Verdict Core: skipped a malformed entry — ${e.message}`);
      }
    }
    return out;
  }

  /**
   * Unwrap a `@type note` field, which arrives as a JSON string with escapes.
   * @param {*} v Raw value.
   * @returns {string} Readable text.
   */
  function noteText(v) {
    if (v == null) return '';
    const s = String(v);
    if (s.charAt(0) !== '"') return s;
    try { return JSON.parse(s); } catch (e) { return s; }
  }

  const CFG = {
    credibilityMax: Number(raw.credibilityMax || 5),
    wrongPenalty: Number(raw.wrongPenalty || 1),
    nearPenalty: Number(raw.nearPenalty || 0),
    breakReward: Number(raw.breakReward || 0),
    collapseSwitch: Number(raw.collapseSwitch || 0),
    seed: Number(raw.seed || 20260809)
  };
  VerdictCore.cfg = CFG;

  /**
   * Build the case definition from plugin parameters.
   *
   * Built once, lazily, and cached — parsing every struct on every scene open
   * would be pure waste, and the parameters cannot change at runtime.
   *
   * @returns {object} Case definition.
   */
  let cachedDef = null;
  function definition() {
    if (cachedDef) return cachedDef;
    const exhibits = structList(raw.exhibits).map((e) => Exhibit.define({
      id: e.id, name: e.name, kind: e.kind, summary: e.summary,
      detail: noteText(e.detail), iconIndex: e.iconIndex, facts: e.facts
    }));
    const testimonies = structList(raw.testimonies).map((t) => Testimony.define({
      id: t.id, title: t.title, speaker: t.speaker, requireAll: t.requireAll,
      statements: structList(t.statements).map((s) => ({
        id: s.id, text: noteText(s.text), claims: s.claims, contradictedBy: s.contradictedBy,
        pressText: noteText(s.pressText), pressFacts: s.pressFacts, pressAdds: s.pressAdds,
        hidden: s.hidden, breakText: noteText(s.breakText), breakFacts: s.breakFacts
      }))
    }));
    const deductions = structList(raw.deductions).map((d) => Deduction.define({
      id: d.id, prompt: noteText(d.prompt), solvedSwitch: d.solvedSwitch, solvedFacts: d.solvedFacts,
      slots: structList(d.slots).map((s) => ({ label: s.label, options: s.options, correct: s.correct }))
    }));
    const links = structList(raw.links).map((l) => LinkRule.define({
      id: l.id, a: l.a, b: l.b, conclusion: noteText(l.conclusion), facts: l.facts
    }));
    cachedDef = CaseFile.define({ id: 'case', title: '', exhibits, testimonies, deductions, links });
    return cachedDef;
  }
  VerdictCore.definition = definition;

  /**
   * Replace the parameter-derived case at runtime.
   *
   * Exists for two reasons: a developer generating cases from their own data,
   * and the factory's own capture pipeline, which needs a rich case without
   * hand-typing 40 nested structs into a JSON parameter.
   *
   * @param {object} spec Case spec, as accepted by `CaseFile.define`.
   * @returns {object} The new definition.
   */
  VerdictCore.setDefinition = function (spec) {
    cachedDef = CaseFile.define(spec);
    if ($gameSystem && $gameSystem._verdict) {
      $gameSystem._verdictState = Save.restore($gameSystem._verdict, cachedDef, CFG);
    }
    return cachedDef;
  };

  /* -------------------------------------------------------- state on the save */

  // Extend, never clobber. A plugin that overwrites Game_System.initialize is
  // the single most common cause of "your two plugins do not work together".
  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._verdict = null;        // serialised, travels in the save
    this._verdictState = null;   // live object, rebuilt on demand
  };

  /**
   * The live investigation, restored from the save if this is the first touch
   * since a load.
   * @returns {object|null} Investigation state, or null when no case is open.
   */
  function live() {
    if (!$gameSystem) return null;
    if (!$gameSystem._verdictState && $gameSystem._verdict) {
      $gameSystem._verdictState = Save.restore($gameSystem._verdict, definition(), CFG);
    }
    return $gameSystem._verdictState || null;
  }

  /**
   * Persist the live investigation back onto the save-bearing object.
   * @returns {void}
   */
  function persist() {
    if ($gameSystem && $gameSystem._verdictState) {
      $gameSystem._verdict = Save.dump($gameSystem._verdictState);
    }
  }
  VerdictCore.live = live;
  VerdictCore.persist = persist;

  /**
   * Apply a result's side effects to the engine: switches, then the save.
   *
   * This is the ONLY place in the plugin that touches `$gameSwitches` on the
   * back of a result. Keeping it in one function is what lets the whole rules
   * half be exercised in Node with no engine present.
   *
   * @param {object} result Result from present/submit/press.
   * @returns {object} The same result, for chaining.
   */
  function applyResult(result) {
    if (result && result.collapsed && CFG.collapseSwitch > 0) {
      setSwitch(CFG.collapseSwitch, 'Collapse Switch (plugin parameter)');
    }
    // Per-deduction switch, authored on the deduction itself. `submit` reports
    // it; nothing else in the codebase knows this number exists.
    if (result && result.solvedSwitch > 0) {
      setSwitch(result.solvedSwitch, 'solvedSwitch on a deduction');
    }
    persist();
    return result;
  }

  /**
   * Turn a switch on, and SAY SO when the engine refuses.
   *
   * ⚠️ `Game_Switches.setValue` is bounds-checked against `$dataSystem.switches.length` and does
   * nothing at all outside it — no error, no warning, no return value:
   *
   *     Game_Switches.prototype.setValue = function(switchId, value) {
   *         if (switchId > 0 && switchId < $dataSystem.switches.length) { … }
   *     };
   *
   * So an author who types `solvedSwitch: 31` into a project whose Database defines 20 switches
   * gets silence, and every reasonable person blames the plugin. Found by in-engine verification,
   * where a switch of 31 in the blank test project (21 switches) simply never flipped.
   *
   * @param {number} switchId 1-based switch id.
   * @param {string} where Human description of where the number came from.
   * @returns {boolean} True when the engine accepted it.
   */
  function setSwitch(switchId, where) {
    const id = Number(switchId) | 0;
    const max = ($dataSystem && $dataSystem.switches) ? $dataSystem.switches.length - 1 : 0;
    if (id < 1 || id > max) {
      console.error(
        `Verdict Core: ${where} asks for switch ${id}, but this project's Database defines ` +
        `switches 1-${max}. RPG Maker ignores out-of-range switches silently, so nothing would ` +
        'have happened and nothing would have explained why. Add the switch in Database > System, ' +
        'or point it at one that exists.');
      return false;
    }
    $gameSwitches.setValue(id, true);
    return true;
  }
  VerdictCore.setSwitch = setSwitch;
  VerdictCore.applyResult = applyResult;

  /* ------------------------------------------------------------- short façade */

  const Verdict = {
    /** @returns {object|null} Live investigation state. */
    state: () => live(),
    /** @param {string} f Fact id. @returns {boolean} Known? */
    knows: (f) => { const st = live(); return !!st && Investigation.knows(st, f); },
    /** @param {string} e Exhibit id. @returns {boolean} Held? */
    holds: (e) => { const st = live(); return !!st && Investigation.holds(st, e); },
    /** @param {string} t Testimony id. @param {string} s Statement id. @returns {boolean} Broken? */
    broken: (t, s) => { const st = live(); return !!st && Investigation.isBroken(st, t, s); },
    /** @param {string} t Testimony id. @returns {boolean} Complete? */
    testimonyBroken: (t) => { const st = live(); return !!st && Investigation.progress(st, t).complete; },
    /** @returns {number} Current credibility. */
    credibility: () => { const st = live(); return st ? st.credibility : 0; },
    /** @returns {string[]} Conclusions found on the board. */
    insights: () => { const st = live(); return st ? Investigation.conclusions(st) : []; },
    /** @param {string} d Deduction id. @returns {boolean} Solved? */
    solved: (d) => { const st = live(); return !!st && st.solved[d] === true; }
  };
  VerdictCore.Verdict = Verdict;

  /* ---------------------------------------------------------- plugin commands */

  PluginManager.registerCommand(PLUGIN, 'startCase', (args) => {
    const def = definition();
    $gameSystem._verdictState = Investigation.start(def, CFG);
    $gameSystem._verdictState.caseId = String(args.caseId || def.id);
    persist();
  });

  PluginManager.registerCommand(PLUGIN, 'giveExhibit', (args) => {
    const st = live(); if (!st) return;
    Investigation.give(st, String(args.exhibitId).trim());
    persist();
  });

  PluginManager.registerCommand(PLUGIN, 'revokeExhibit', (args) => {
    const st = live(); if (!st) return;
    Investigation.revoke(st, String(args.exhibitId).trim());
    persist();
  });

  PluginManager.registerCommand(PLUGIN, 'learnFact', (args) => {
    const st = live(); if (!st) return;
    Investigation.learn(st, String(args.factId).trim());
    persist();
  });

  PluginManager.registerCommand(PLUGIN, 'setCredibility', (args) => {
    const st = live(); if (!st) return;
    Investigation.setCredibility(st, Number(args.value));
    persist();
  });

  PluginManager.registerCommand(PLUGIN, 'readFactKnown', (args) => {
    $gameSwitches.setValue(Number(args.switchId), Verdict.knows(String(args.factId).trim()));
  });

  PluginManager.registerCommand(PLUGIN, 'readTestimonyBroken', (args) => {
    $gameSwitches.setValue(Number(args.switchId), Verdict.testimonyBroken(String(args.testimonyId).trim()));
  });

  PluginManager.registerCommand(PLUGIN, 'readCredibility', (args) => {
    $gameVariables.setValue(Number(args.variableId), Verdict.credibility());
  });

  PluginManager.registerCommand(PLUGIN, 'readBreakCount', (args) => {
    const st = live();
    $gameVariables.setValue(Number(args.variableId), st ? st.breaks : 0);
  });

  /* ------------------------------------------------------- the scene commands */
  //
  // These four open scenes that VerdictCaseFile.js defines, and they are
  // registered HERE, in the file whose @command block declares them. That is not
  // a style choice — MZ dispatches on the DECLARING file:
  //
  //     Game_Interpreter.command357:
  //         const pluginName = Utils.extractFileName(params[0]);   // "VerdictCore"
  //         PluginManager.callCommand(this, pluginName, params[1], params[3]);
  //     PluginManager.callCommand:
  //         const func = this._commands[pluginName + ":" + commandName];
  //         if (typeof func === "function") { func.bind(self)(args); }
  //
  // `params[0]` is whatever file the editor listed the command under, and there
  // is no `else`. Registering these under 'VerdictCaseFile' — which this file
  // did until it was caught by a static contract test — produced four dropdown
  // entries that dispatched to nothing, forever, with nothing in the console.
  //
  // The instinct that put them in the other file was still right: the logic
  // plugin must not silently do nothing when the UI plugin is off. So the guard
  // moved into the callback, where it can be LOUD instead.

  /**
   * Push a scene owned by VerdictCaseFile.js, or say plainly why it cannot.
   *
   * Resolved at call time rather than at registration time, because this file
   * loads BEFORE the UI plugin — at registration the class does not exist yet
   * even when everything is installed correctly.
   *
   * @param {string} className Global scene class name.
   * @param {string} [prepare] Argument passed to `prepareNextScene`.
   * @returns {void}
   */
  function pushScene(className, prepare) {
    const klass = typeof window !== 'undefined' ? window[className] : null;
    if (typeof klass !== 'function') {
      // A missing UI plugin is a setup mistake with an obvious fix, and the one
      // thing it must never do is look like the player pressed nothing.
      throw new Error(
        `Verdict Core: ${className} is not defined. VerdictCaseFile.js draws every ` +
        'Verdict scene — enable it in the Plugin Manager, below VerdictCore.js.');
    }
    SceneManager.push(klass);
    if (prepare !== undefined) SceneManager.prepareNextScene(prepare);
  }

  PluginManager.registerCommand(PLUGIN, 'openCaseFile', () => {
    pushScene('Scene_VerdictCaseFile');
  });

  PluginManager.registerCommand(PLUGIN, 'openCaseBoard', () => {
    pushScene('Scene_VerdictBoard');
  });

  PluginManager.registerCommand(PLUGIN, 'startTestimony', (args) => {
    pushScene('Scene_VerdictCrossExam', String(args.testimonyId).trim());
  });

  PluginManager.registerCommand(PLUGIN, 'openDeduction', (args) => {
    pushScene('Scene_VerdictDeduction', String(args.deductionId).trim());
  });

  //===========================================================================
  // Exports
  //===========================================================================

  if (typeof module !== 'undefined' && module.exports) module.exports = VerdictCore;
  if (typeof window !== 'undefined') {
    window.VerdictCore = VerdictCore;
    // `Verdict` is a second global on purpose. A Conditional Branch is a
    // one-line text box, and `VerdictCore.Verdict.knows('x')` in one is a
    // usability defect rather than a naming preference.
    window.Verdict = Verdict;
  }
})();

if (typeof module !== 'undefined' && module.exports && !module.exports.Investigation) {
  module.exports = VerdictCore;
}
