//=============================================================================
// VerdictCaseFile.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] Verdict Core's look — the Case File, the Cross-Examination and the corkboard Case Board. Nothing here uses a windowskin.
 * @author CSAF — Core Systems Asset Factory
 * @url https://csaf.itch.io/verdict-core
 * @base VerdictCore
 * @orderAfter VerdictCore
 *
 * @param paperLight
 * @text Paper highlight
 * @desc Top of the paper gradient.
 * @default #f3e9d2
 *
 * @param paperDark
 * @text Paper shadow
 * @default #d9c7a2
 *
 * @param ink
 * @text Ink
 * @default #26201a
 *
 * @param inkFaded
 * @text Faded ink
 * @desc Annotations, labels, anything secondary.
 * @default #7d6a52
 *
 * @param sealRed
 * @text Seal red
 * @desc Stamps, the string on the board, and every "you were wrong" signal.
 * @default #9c2b22
 *
 * @param proofGreen
 * @text Proof green
 * @default #3f6b40
 *
 * @param corkColour
 * @text Corkboard
 * @default #9a7b4f
 *
 * @param displayFont
 * @text Display typeface
 * @desc The single loudest "this is RPG Maker" signal is the default font. This is the heading stack.
 * @default Georgia, "Times New Roman", serif
 *
 * @param typewriterFont
 * @text Typewriter typeface
 * @desc Body text and everything the witness says.
 * @default "Courier New", Courier, monospace
 *
 * @param motion
 * @text Motion
 * @type boolean
 * @desc Cards deal in, stamps slam, string draws itself. Off = instant, for accessibility.
 * @default true
 *
 * @help
 * ============================================================================
 * Why this is a separate file
 * ============================================================================
 *
 * VerdictCore.js is the rules. This is the look. They are split so you can
 * throw this file away and draw the whole thing yourself without touching a
 * line of logic — and so that a bug in a draw routine can never corrupt a case.
 *
 * ============================================================================
 * What it draws, and what it refuses to draw
 * ============================================================================
 *
 * There is NO WINDOWSKIN. Not a recoloured one — none at all. Every surface in
 * these three scenes is drawn procedurally into a Bitmap: the paper's fibre,
 * its torn edge, the cork, the pins, the sag in the string, the scuffing on a
 * rubber stamp. That is deliberate. A windowskin is a shared asset, and every
 * product that recolours the same PNG ends up looking like every other one.
 *
 * Nothing here is random. Every flourish is drawn from VerdictCore's seeded
 * generator, so the same case renders identically on every machine and on
 * every load.
 *
 * ============================================================================
 * Scenes
 * ============================================================================
 *
 *   Scene_VerdictCaseFile   exhibits down the left as index cards, the selected
 *                           one opened as a dossier sheet on the right, and
 *                           your credibility as notches rather than a number.
 *   Scene_VerdictCrossExam  the testimony. Left/Right walks the statements,
 *                           OK presses, Shift presents an exhibit.
 *   Scene_VerdictBoard      the corkboard. Pick two things, draw the string.
 *   Scene_VerdictDeduction  the accusation, typeset as a sentence with ruled
 *                           blanks in it. Every option says whether you have
 *                           actually established that fact — and lets you pick
 *                           it anyway.
 *
 * ============================================================================
 * Controls
 * ============================================================================
 *
 *   Cross-examination   ← →   walk the testimony
 *                       OK    press this statement
 *                       Shift present an exhibit against it
 *                       Cancel leave
 *
 *   Case Board          arrows move between pinned cards
 *                       OK    pick this card, then pick a second to link
 *                       Cancel drop the current pick, then leave
 *
 *   Deduction           ← →   choose which blank to fill
 *                       OK    fill it from the facts on offer
 *                       Shift commit to the accusation
 *                       Cancel leave without committing
 *
 * ============================================================================
 * Compatibility
 * ============================================================================
 *
 * Only classes defined by THIS file are themed. Window_Help, Window_Gold and
 * every other shared class are left exactly as your project draws them —
 * theming a shared class on its prototype would silently restyle the buyer's
 * whole game, which is a refund rather than a feature.
 */

var VerdictSkin = VerdictSkin || {};

(function () {
  'use strict';

  if (typeof PluginManager === 'undefined') return;   // Node: nothing to draw.

  const PLUGIN = 'VerdictCaseFile';
  const P = PluginManager.parameters(PLUGIN);

  /** Palette. Every colour is a parameter so a buyer can re-skin without editing code. */
  const C = {
    paperLight: String(P.paperLight || '#f3e9d2'),
    paperDark: String(P.paperDark || '#d9c7a2'),
    ink: String(P.ink || '#26201a'),
    inkFaded: String(P.inkFaded || '#7d6a52'),
    // A third ink, between `ink` and `inkFaded`. Secondary lines set in `inkFaded` measured too
    // low-contrast to read at row size against the paper — legible in a mock-up, a grey smear in
    // the real frame. Derived rather than exposed as a parameter so a buyer's palette stays two
    // decisions, not three.
    inkSoft: String(P.inkSoft || '#5d4c39'),
    seal: String(P.sealRed || '#9c2b22'),
    proof: String(P.proofGreen || '#3f6b40'),
    cork: String(P.corkColour || '#9a7b4f')
  };

  const FONT = {
    display: String(P.displayFont || 'Georgia, "Times New Roman", serif'),
    typewriter: String(P.typewriterFont || '"Courier New", Courier, monospace')
  };

  const MOTION = String(P.motion || 'true') === 'true';

  /** @returns {object} The core's seeded generator state, created on first use. */
  let rng = null;
  function seeded() {
    if (!rng) rng = VerdictCore.Rng.create((VerdictCore.cfg && VerdictCore.cfg.seed) || 20260809);
    return rng;
  }

  /**
   * A deterministic value in [-1,1] derived from a string key.
   *
   * Used for the tilt on a pinned card and the scuff on a stamp. Keyed by the
   * card's own id rather than pulled from a running stream, so a card keeps the
   * same tilt no matter what order the scene draws things in — which is what
   * makes a capture reproducible frame for frame.
   *
   * @param {string} key Stable key, normally an id.
   * @param {number} [salt] Vary to get a second independent value from one key.
   * @returns {number} Value in [-1,1].
   */
  function jitter(key, salt) {
    let h = 2166136261 ^ (salt || 0);
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (((h >>> 0) % 20000) / 10000) - 1;
  }
  VerdictSkin.jitter = jitter;

  //===========================================================================
  // Surfaces
  //===========================================================================

  const paperCache = new Map();

  /**
   * Paper: a warm gradient, deterministic fibre, a darkened rim and a torn edge.
   *
   * The fibre is the point. A flat cream rectangle reads as "a window someone
   * recoloured"; a few hundred one-pixel strokes at varying alpha reads as a
   * material, and it costs one draw because the bitmap is cached by size.
   *
   * @param {number} w Width.
   * @param {number} h Height.
   * @returns {Bitmap} Cached paper bitmap.
   */
  VerdictSkin.paper = function (w, h) {
    if (!(w > 1) || !(h > 1)) return new Bitmap(Math.max(1, w | 0), Math.max(1, h | 0));
    const key = 'p' + w + 'x' + h;
    const hit = paperCache.get(key);
    if (hit) return hit;

    const bmp = new Bitmap(w, h);
    const ctx = bmp.context;
    const r = VerdictCore.Rng.create(((w * 73856093) ^ (h * 19349663)) | 0 || 7);

    const g = ctx.createLinearGradient(0, 0, w * 0.35, h);
    g.addColorStop(0, C.paperLight);
    g.addColorStop(1, C.paperDark);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Fibre. Density scales with area so a small card is not a scribble.
    const strokes = Math.min(900, Math.max(60, Math.floor((w * h) / 320)));
    for (let i = 0; i < strokes; i++) {
      const x = VerdictCore.Rng.next(r) * w;
      const y = VerdictCore.Rng.next(r) * h;
      const len = 2 + VerdictCore.Rng.next(r) * 9;
      const dark = VerdictCore.Rng.next(r) > 0.55;
      ctx.strokeStyle = dark ? 'rgba(90,70,45,0.10)' : 'rgba(255,250,235,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + (VerdictCore.Rng.next(r) - 0.5) * 2);
      ctx.stroke();
    }

    // Rim shading — a sheet of paper is never uniformly lit at its edges.
    const rim = ctx.createLinearGradient(0, 0, 0, h);
    rim.addColorStop(0, 'rgba(120,95,60,0.20)');
    rim.addColorStop(0.08, 'rgba(120,95,60,0)');
    rim.addColorStop(0.92, 'rgba(120,95,60,0)');
    rim.addColorStop(1, 'rgba(90,68,40,0.28)');
    ctx.fillStyle = rim;
    ctx.fillRect(0, 0, w, h);

    // Torn right edge. Two pixels of irregularity is the whole difference
    // between "a document" and "a rectangle".
    ctx.clearRect(w - 3, 0, 3, h);
    ctx.fillStyle = C.paperDark;
    for (let y = 0; y < h; y += 2) {
      const bite = Math.floor(VerdictCore.Rng.next(r) * 3);
      ctx.fillRect(w - 3, y, 3 - bite, 2);
    }

    bmp._baseTexture.update();
    paperCache.set(key, bmp);
    return bmp;
  };

  const corkCache = new Map();

  /**
   * Corkboard: a granular brown surface with a darkened vignette.
   * @param {number} w Width.
   * @param {number} h Height.
   * @returns {Bitmap} Cached cork bitmap.
   */
  VerdictSkin.cork = function (w, h) {
    if (!(w > 1) || !(h > 1)) return new Bitmap(Math.max(1, w | 0), Math.max(1, h | 0));
    const key = 'c' + w + 'x' + h;
    const hit = corkCache.get(key);
    if (hit) return hit;

    const bmp = new Bitmap(w, h);
    const ctx = bmp.context;
    const r = VerdictCore.Rng.create(((w * 2654435761) ^ h) | 0 || 11);

    ctx.fillStyle = C.cork;
    ctx.fillRect(0, 0, w, h);

    const grains = Math.min(6000, Math.floor((w * h) / 42));
    for (let i = 0; i < grains; i++) {
      const x = VerdictCore.Rng.next(r) * w;
      const y = VerdictCore.Rng.next(r) * h;
      const s = 1 + VerdictCore.Rng.next(r) * 2.2;
      const v = VerdictCore.Rng.next(r);
      ctx.fillStyle = v > 0.5
        ? `rgba(70,48,24,${0.06 + v * 0.18})`
        : `rgba(206,170,116,${0.05 + v * 0.14})`;
      ctx.fillRect(x, y, s, s);
    }

    // Vignette. Without it the board reads flat and the cards look pasted on.
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(20,12,4,0.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    bmp._baseTexture.update();
    corkCache.set(key, bmp);
    return bmp;
  };

  /**
   * Replacement for `Window.prototype._refreshBack` — paper instead of a skin.
   *
   * Mirrors CSAFTheme.refreshBack, including the TilingSprite child fix: MZ's
   * `_backSprite` owns a tiling CHILD pointed at the windowskin's pattern
   * region, and leaving it behind renders a shrunken hatched patch inside the
   * panel. Invisible on prototype-themed windows and very visible on
   * per-instance ones, which is why it survived a whole catalogue.
   *
   * @returns {void}
   */
  VerdictSkin.refreshBack = function () {
    const w = Math.max(0, this._width - this._margin * 2);
    const h = Math.max(0, this._height - this._margin * 2);
    const sprite = this._backSprite;
    sprite.bitmap = VerdictSkin.paper(w, h);
    sprite.setFrame(0, 0, w, h);
    sprite.move(this._margin, this._margin);
    sprite.scale.x = 1;
    sprite.scale.y = 1;
    const tiling = sprite.children && sprite.children[0];
    if (tiling) { tiling.bitmap = null; tiling.visible = false; }
  };

  /** @returns {void} Suppress the stock frame; the paper carries its own edge. */
  VerdictSkin.refreshFrame = function () { this._frameSprite.bitmap = null; };

  /**
   * Adopt the case-file skin on a window class.
   *
   * ⚠️ Deferred to Scene_Boot by the caller, never run at load time. Plugin load
   * order is the buyer's choice, and a theme that tests `typeof` at load is a
   * coin flip that silently no-ops when it loses — shipping a product that
   * looks stock with no error anywhere.
   *
   * @param {Function} klass Window class to skin.
   * @returns {void}
   */
  VerdictSkin.adopt = function (klass) {
    klass.prototype._refreshBack = VerdictSkin.refreshBack;
    klass.prototype._refreshFrame = VerdictSkin.refreshFrame;
    klass.prototype._refreshCursor = function () { this._cursorSprite.bitmap = null; };
    // MZ multiplies the back sprite by backOpacity, which defaults to 192. A
    // hand-drawn surface then comes out washed with the map bleeding through —
    // and this single value is most of why a themed window still reads as RPG
    // Maker.
    klass.prototype.updateBackOpacity = function () { this.backOpacity = 255; };

    // ⚠️ THE STOCK ARTEFACT THAT SURVIVES A COMPLETE THEME, and it is invisible in code review.
    //
    // `Window_Selectable.prototype.drawItemBackground` fills `contentsBack` — a SECOND bitmap
    // behind `contents`, which nothing above touches — with a gradient between
    // `ColorManager.itemBackColor1()` and `itemBackColor2()`. Those come off the windowskin, so a
    // window with a hand-drawn paper back, no frame, no cursor and forced opacity still renders a
    // grey RPG Maker slab behind every single row. Measured on Verdict Core 2026-08-10: the
    // exhibit list and the option shelf both read grey against a cream dossier in the same frame,
    // which is exactly the "you could have made this" signal Gate 1 exists to remove.
    //
    // Rows here carry their own drawn accents, so the honest answer is to paint nothing and let
    // the paper show. Guarded because `adopt` is also called on plain `Window_Base` subclasses.
    if (klass.prototype.drawItemBackground) {
      klass.prototype.drawItemBackground = function () { /* the paper is the background */ };
    }
  };

  //===========================================================================
  // Marks — the things a windowskin cannot give you
  //===========================================================================

  /**
   * Apply a type role. Four roles, one stack each, and never MZ's own face.
   *
   * @param {Bitmap} bmp Target bitmap.
   * @param {'display'|'lede'|'body'|'label'|'hand'} role Role name.
   * @returns {void}
   */
  VerdictSkin.type = function (bmp, role) {
    switch (role) {
      case 'display':
        bmp.fontFace = FONT.display; bmp.fontSize = 30; bmp.fontBold = false; bmp.fontItalic = false; break;
      case 'lede':
        bmp.fontFace = FONT.display; bmp.fontSize = 21; bmp.fontBold = false; bmp.fontItalic = true; break;
      case 'label':
        bmp.fontFace = FONT.typewriter; bmp.fontSize = 13; bmp.fontBold = true; bmp.fontItalic = false; break;
      case 'hand':
        bmp.fontFace = FONT.display; bmp.fontSize = 18; bmp.fontBold = false; bmp.fontItalic = true; break;
      default:
        bmp.fontFace = FONT.typewriter; bmp.fontSize = 17; bmp.fontBold = false; bmp.fontItalic = false;
    }
    // Ink on paper does not glow. MZ's default 4px black outline is drawn for
    // white text on a dark window and looks like a mistake on cream.
    bmp.outlineWidth = 0;
    bmp.outlineColor = 'rgba(0,0,0,0)';
    bmp.textColor = C.ink;
  };

  /**
   * Draw text wrapped to a width, returning the height it used.
   *
   * MZ has no wrapping primitive at all — `drawText` scales glyphs down to fit,
   * which turns a long statement into unreadable condensed type. Every line of
   * testimony in this product is wrapped by hand for that reason.
   *
   * @param {Bitmap} bmp Target.
   * @param {string} text Text to draw.
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} w Wrap width.
   * @param {number} lh Line height.
   * @param {number} [maxLines] Truncate with an ellipsis beyond this.
   * @returns {number} Height consumed.
   */
  VerdictSkin.wrap = function (bmp, text, x, y, w, lh, maxLines) {
    const words = String(text || '').split(/\s+/);
    let line = '';
    let ly = y;
    let lines = 0;
    const limit = maxLines || 99;
    for (let i = 0; i < words.length; i++) {
      const probe = line ? line + ' ' + words[i] : words[i];
      if (bmp.measureTextWidth(probe) > w && line) {
        if (lines + 1 >= limit && i < words.length) {
          bmp.drawText(line + '…', x, ly, w, lh, 'left');
          return (ly + lh) - y;
        }
        bmp.drawText(line, x, ly, w, lh, 'left');
        ly += lh; lines++;
        line = words[i];
      } else {
        line = probe;
      }
    }
    if (line) { bmp.drawText(line, x, ly, w, lh, 'left'); ly += lh; }
    return ly - y;
  };

  /**
   * Truncate a single line to a measured width, with an ellipsis.
   *
   * ⚠️ NOT the same as passing a width to `Bitmap.drawText`. MZ forwards that width to canvas
   * `fillText(text, x, y, maxWidth)`, and the canvas spec says maxWidth CONDENSES the glyphs to
   * fit — it does not clip and it does not ellipsise. So an over-long row summary renders as a
   * horizontally squashed, unreadable smear at exactly the right width, which reads as a font bug
   * rather than as truncation. Measured on the exhibit list, 2026-08-10.
   *
   * @param {Bitmap} bmp Target bitmap, already carrying the intended font.
   * @param {string} text Text to fit.
   * @param {number} w Available width in px.
   * @returns {string} Text that measures at or under `w`.
   */
  VerdictSkin.clip = function (bmp, text, w) {
    const s = String(text || '');
    if (!s || bmp.measureTextWidth(s) <= w) return s;
    let lo = 0;
    let hi = s.length;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (bmp.measureTextWidth(s.slice(0, mid) + '…') <= w) lo = mid; else hi = mid - 1;
    }
    return s.slice(0, lo).replace(/[\s,;:.]+$/, '') + '…';
  };

  /**
   * A pushpin: a coloured dome with a specular highlight and a cast shadow.
   * @param {Bitmap} bmp Target.
   * @param {number} x Centre x.
   * @param {number} y Centre y.
   * @param {string} colour Head colour.
   * @returns {void}
   */
  VerdictSkin.pin = function (bmp, x, y, colour) {
    const ctx = bmp.context;
    ctx.save();
    ctx.beginPath(); ctx.arc(x + 1.5, y + 2.5, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = colour; ctx.fill();
    ctx.beginPath(); ctx.arc(x - 2, y - 2.2, 2.1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
    ctx.restore();
  };

  /**
   * Red string between two pins, with sag and a cast shadow.
   *
   * The sag is what sells it. A straight line between two points is a diagram;
   * a quadratic with its control point pushed downward is a thread under its
   * own weight, and the shadow beneath it puts the thread in front of the cork
   * rather than printed on it.
   *
   * @param {Bitmap} bmp Target.
   * @param {number} x1 Start x.
   * @param {number} y1 Start y.
   * @param {number} x2 End x.
   * @param {number} y2 End y.
   * @param {number} [t] Draw progress 0..1, for the animated reveal.
   * @returns {void}
   */
  VerdictSkin.string = function (bmp, x1, y1, x2, y2, t) {
    const p = t == null ? 1 : Math.max(0, Math.min(1, t));
    if (p <= 0) return;
    const ex = x1 + (x2 - x1) * p;
    const ey = y1 + (y2 - y1) * p;
    const sag = Math.min(46, Math.hypot(x2 - x1, y2 - y1) * 0.18);
    const cx = (x1 + ex) / 2;
    const cy = (y1 + ey) / 2 + sag;
    const ctx = bmp.context;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1 + 2, y1 + 3); ctx.quadraticCurveTo(cx + 2, cy + 3, ex + 2, ey + 3);
    ctx.strokeStyle = 'rgba(0,0,0,0.32)'; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, ex, ey);
    ctx.strokeStyle = C.seal; ctx.lineWidth = 2.6; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1 - 0.7); ctx.quadraticCurveTo(cx, cy - 0.7, ex, ey - 0.7);
    ctx.strokeStyle = 'rgba(255,160,150,0.35)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  };

  /**
   * A rubber stamp: double ring, letterpress type, rotated, and scuffed so it
   * looks pressed rather than printed.
   *
   * @param {Bitmap} bmp Target.
   * @param {number} cx Centre x.
   * @param {number} cy Centre y.
   * @param {string} text Stamp text.
   * @param {number} angle Radians.
   * @param {string} colour Ink colour.
   * @param {number} [scale] 1 = final size; the slam animation drives this above 1.
   * @param {number} [alpha] 0..1.
   * @returns {void}
   */
  VerdictSkin.stamp = function (bmp, cx, cy, text, angle, colour, scale, alpha) {
    const s = scale == null ? 1 : scale;
    const a = alpha == null ? 1 : alpha;
    if (a <= 0.01) return;
    const ctx = bmp.context;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(s, s);
    ctx.globalAlpha = a * 0.88;

    ctx.font = `bold 26px ${FONT.display}`;
    const w = Math.max(150, ctx.measureText(text).width + 44);
    const h = 52;

    ctx.strokeStyle = colour;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);

    ctx.fillStyle = colour;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 1);

    // Scuffing: knock holes in the ink so it reads as pressed. Deterministic,
    // keyed off the text, so the same stamp scuffs identically every run.
    const r = VerdictCore.Rng.create((text.length * 7919) | 0 || 3);
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 26; i++) {
      const px = (VerdictCore.Rng.next(r) - 0.5) * w;
      const py = (VerdictCore.Rng.next(r) - 0.5) * h;
      ctx.globalAlpha = 0.25 + VerdictCore.Rng.next(r) * 0.5;
      ctx.fillRect(px, py, 1 + VerdictCore.Rng.next(r) * 5, 1 + VerdictCore.Rng.next(r) * 3);
    }
    ctx.restore();
  };

  /**
   * Credibility, as notches rather than a number.
   *
   * This is the change that did the most work on Bazaar Core, applied again:
   * ask what number is the whole point and make it a shape. "4/5" is what the
   * stock engine produces. Five ink notches with the spent ones struck through
   * is read at a glance and, unlike a fraction, it gets tense as it empties.
   *
   * @param {Bitmap} bmp Target.
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} value Remaining.
   * @param {number} max Total.
   * @returns {void}
   */
  VerdictSkin.notches = function (bmp, x, y, value, max) {
    const ctx = bmp.context;
    const gap = 15;
    ctx.save();
    for (let i = 0; i < max; i++) {
      const nx = x + i * gap;
      const spent = i >= value;
      ctx.strokeStyle = spent ? 'rgba(120,100,74,0.55)' : C.ink;
      ctx.lineWidth = spent ? 2 : 3.4;
      ctx.beginPath();
      ctx.moveTo(nx + 2, y + 20);
      ctx.lineTo(nx + 7, y);
      ctx.stroke();
      if (spent) {
        ctx.strokeStyle = C.seal;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nx - 2, y + 4);
        ctx.lineTo(nx + 12, y + 17);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  /**
   * A tilted index card drawn straight onto a surface, with a shadow and a pin.
   *
   * Rotation is the single biggest "this is not RPG Maker" signal available,
   * because MZ's own drawing has no concept of it: every stock window is
   * axis-aligned. A card at 2.4 degrees with a shadow underneath reads as a
   * physical object.
   *
   * @param {Bitmap} bmp Target surface.
   * @param {object} card `{x, y, w, h, tilt, title, body, tone, selected, picked}`.
   * @returns {void}
   */
  /**
   * Canvas-context twin of `VerdictSkin.clip`, for the board's raw 2D drawing.
   *
   * The board does not go through `Bitmap.drawText` at all — it rotates the context per card — so
   * it needs `ctx.measureText` rather than `bmp.measureTextWidth`. Same binary search, same
   * contract; kept beside its caller because a card is the only thing that draws this way.
   *
   * @param {CanvasRenderingContext2D} ctx Context with the intended font already set.
   * @param {string} text Text to fit.
   * @param {number} w Available width in px.
   * @returns {string} Text that measures at or under `w`.
   */
  function measuredClip(ctx, text, w) {
    const s = String(text || '');
    if (!s || ctx.measureText(s).width <= w) return s;
    let lo = 0;
    let hi = s.length;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (ctx.measureText(s.slice(0, mid) + '…').width <= w) lo = mid; else hi = mid - 1;
    }
    return s.slice(0, lo).replace(/[\s,;:.]+$/, '') + '…';
  }

  VerdictSkin.card = function (bmp, card) {
    const ctx = bmp.context;
    const { x, y, w, h } = card;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(card.tilt || 0);

    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.fillRect(-w / 2 + 4, -h / 2 + 6, w, h);

    const paper = VerdictSkin.paper(w, h);
    ctx.drawImage(paper.canvas || paper._canvas, -w / 2, -h / 2);

    if (card.tone === 'proof') {
      ctx.fillStyle = C.proof; ctx.fillRect(-w / 2, -h / 2, w, 5);
    } else if (card.tone === 'lie') {
      ctx.fillStyle = C.seal; ctx.fillRect(-w / 2, -h / 2, w, 5);
    } else {
      ctx.fillStyle = 'rgba(60,48,32,0.55)'; ctx.fillRect(-w / 2, -h / 2, w, 3);
    }

    if (card.picked) {
      ctx.strokeStyle = C.seal; ctx.lineWidth = 3;
      ctx.strokeRect(-w / 2 - 2, -h / 2 - 2, w + 4, h + 4);
    } else if (card.selected) {
      ctx.strokeStyle = 'rgba(255,246,214,0.95)'; ctx.lineWidth = 2.5;
      ctx.strokeRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6);
      ctx.strokeStyle = 'rgba(255,246,214,0.30)'; ctx.lineWidth = 6;
      ctx.strokeRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10);
    }

    ctx.fillStyle = C.ink;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `13px ${FONT.typewriter}`;
    ctx.fillStyle = C.inkFaded;
    ctx.fillText(String(card.kicker || '').toUpperCase(), -w / 2 + 10, -h / 2 + 10);

    ctx.font = `17px ${FONT.display}`;
    ctx.fillStyle = C.ink;
    // ⚠️ "The caller trims" was the old comment here and it was wrong in the only way that shows.
    // Callers trimmed by CHARACTER COUNT, and this is a proportional display face on a rotated
    // card, so a statement title overran the card edge and was drawn straight onto the corkboard —
    // visible in the store screenshot, invisible in the source. Measure here, where the width is
    // actually known.
    ctx.fillText(measuredClip(ctx, card.title || '', w - 20), -w / 2 + 10, -h / 2 + 28);

    if (card.body) {
      ctx.font = `13px ${FONT.typewriter}`;
      ctx.fillStyle = C.inkFaded;
      const words = String(card.body).split(/\s+/);
      let line = '';
      // Start below the title only when there IS a title. The conclusion card has none, so a fixed
      // 52 px offset threw away the top third of a card that was already tight, and its text ran
      // out of room mid-sentence — visible in the store shot, invisible in the code.
      let ly = -h / 2 + (card.title ? 52 : 30);
      for (let i = 0; i < words.length && ly < h / 2 - 14; i++) {
        const probe = line ? line + ' ' + words[i] : words[i];
        if (ctx.measureText(probe).width > w - 20 && line) {
          ctx.fillText(line, -w / 2 + 10, ly); ly += 16; line = words[i];
        } else { line = probe; }
      }
      if (line && ly < h / 2 - 10) ctx.fillText(line, -w / 2 + 10, ly);
    }
    ctx.restore();

    VerdictSkin.pin(bmp, x + w / 2, y + 8, card.tone === 'lie' ? '#b8352a' : '#2f5d8c');
  };

  //===========================================================================
  // Motion
  //===========================================================================

  /**
   * Ease a window in as though the sheet were laid down on the desk.
   * @param {Window_Base} win Window.
   * @param {number} [delay] Frames to wait before starting.
   * @returns {void}
   */
  VerdictSkin.deal = function (win, delay) {
    if (!MOTION) return;
    const y = win.y;
    win.y = y + 26;
    win.opacity = 0;
    win.contentsOpacity = 0;
    win._vcDealDelay = delay || 0;
    win._vcDealTo = y;
  };

  /**
   * Advance a dealt window's entrance by one frame.
   * @param {Window_Base} win Window.
   * @returns {void}
   */
  VerdictSkin.updateDeal = function (win) {
    if (win._vcDealTo == null) return;
    if (win._vcDealDelay > 0) { win._vcDealDelay--; return; }
    // Constant-factor approach, no allocation, no tween objects. 0.22 lands in
    // roughly 14 frames, which is a beat rather than an animation.
    const dy = win._vcDealTo - win.y;
    if (Math.abs(dy) < 0.6 && win.opacity > 250) {
      win.y = win._vcDealTo; win.opacity = 255; win.contentsOpacity = 255; win._vcDealTo = null;
      return;
    }
    win.y += dy * 0.22;
    win.opacity = Math.min(255, win.opacity + 26);
    win.contentsOpacity = Math.min(255, win.contentsOpacity + 26);
  };

  //===========================================================================
  // Windows
  //===========================================================================

  /* ------------------------------------------------------------ case header */

  /**
   * Case heading: title, speaker, and credibility as notches.
   * @class
   */
  function Window_VerdictHeader() { this.initialize.apply(this, arguments); }
  Window_VerdictHeader.prototype = Object.create(Window_Base.prototype);
  Window_VerdictHeader.prototype.constructor = Window_VerdictHeader;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictHeader.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._title = '';
    this._sub = '';
    this.refresh();
  };

  /**
   * @param {string} title Heading.
   * @param {string} sub Sub-heading.
   * @returns {void}
   */
  Window_VerdictHeader.prototype.setHeading = function (title, sub) {
    this._title = title; this._sub = sub; this.refresh();
  };

  /** @returns {void} Redraw. */
  Window_VerdictHeader.prototype.refresh = function () {
    const b = this.contents;
    b.clear();
    VerdictSkin.type(b, 'display');
    b.drawText(this._title || '', 4, 0, this.innerWidth - 200, 36, 'left');

    VerdictSkin.type(b, 'lede');
    b.textColor = C.inkFaded;
    b.drawText(this._sub || '', 6, 36, this.innerWidth - 200, 26, 'left');

    const st = VerdictCore.live();
    if (st) {
      VerdictSkin.type(b, 'label');
      b.textColor = C.inkFaded;
      const label = 'CREDIBILITY';
      const lw = b.measureTextWidth(label);
      const nx = this.innerWidth - 14 - st.credibilityMax * 15;
      b.drawText(label, nx - lw - 14, 20, lw + 4, 20, 'left');
      VerdictSkin.notches(b, nx, 16, st.credibility, st.credibilityMax);
      b._baseTexture.update();
    }
  };

  /* ------------------------------------------------------- exhibit list */

  /**
   * The exhibit column. Not a `Window_Selectable` grid: each row is an index
   * card with a kind tag and a fact count, and the selected one is marked with
   * an ink bar rather than MZ's cursor rectangle.
   * @class
   */
  function Window_VerdictExhibits() { this.initialize.apply(this, arguments); }
  Window_VerdictExhibits.prototype = Object.create(Window_Selectable.prototype);
  Window_VerdictExhibits.prototype.constructor = Window_VerdictExhibits;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictExhibits.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._ids = [];
    this._detail = null;
  };

  /** @returns {number} Row height, floored to whole rows so the last one is never sliced. */
  Window_VerdictExhibits.prototype.itemHeight = function () {
    const want = 68;
    const rows = Math.max(1, Math.floor(this.innerHeight / want));
    return Math.floor(this.innerHeight / rows);
  };

  /** @returns {number} Row count. */
  Window_VerdictExhibits.prototype.maxItems = function () { return this._ids.length; };

  /**
   * @param {Window_Base} w Detail pane to drive.
   * @returns {void}
   */
  Window_VerdictExhibits.prototype.setDetailWindow = function (w) { this._detail = w; this.callUpdateHelp(); };

  /**
   * Populate from the live investigation.
   * @param {number} [index] Row to select.
   * @returns {void}
   */
  Window_VerdictExhibits.prototype.reload = function (index) {
    const st = VerdictCore.live();
    this._ids = st ? st.held.slice() : [];
    // Set the index BEFORE the draw. `select()` only refreshes the cursor, so
    // selecting afterwards draws every row with index === -1 and the selected
    // row never gets its marker.
    this._index = Math.min(index == null ? this._index : index, Math.max(0, this._ids.length - 1));
    this.refresh();
    this.callUpdateHelp();
  };

  /** @returns {string|null} The selected exhibit id. */
  Window_VerdictExhibits.prototype.currentId = function () { return this._ids[this.index()] || null; };

  /**
   * @param {number} index Row index.
   * @returns {void}
   */
  Window_VerdictExhibits.prototype.drawItem = function (index) {
    const st = VerdictCore.live();
    if (!st) return;
    const e = VerdictCore.CaseFile.exhibit(st.def, this._ids[index]);
    if (!e) return;
    const r = this.itemRect(index);
    const b = this.contents;
    const on = index === this.index();

    if (on) {
      b.fillRect(r.x, r.y + 2, 4, r.height - 8, C.seal);
      b.paintOpacity = 40;
      b.fillRect(r.x + 4, r.y + 2, r.width - 6, r.height - 8, C.inkFaded);
      b.paintOpacity = 255;
    }

    VerdictSkin.type(b, 'label');
    b.textColor = C.inkFaded;
    b.drawText(String(e.kind).toUpperCase(), r.x + 14, r.y + 4, r.width - 20, 18, 'left');

    VerdictSkin.type(b, 'body');
    b.textColor = C.ink;
    b.drawText(VerdictSkin.clip(b, e.name, r.width - 76), r.x + 14, r.y + 20, r.width - 70, 24, 'left');

    VerdictSkin.type(b, 'label');
    b.textColor = e.facts.length ? C.proof : C.inkFaded;
    b.drawText(e.facts.length ? `${e.facts.length} ✓` : '—', r.x + r.width - 52, r.y + 22, 40, 20, 'right');

    VerdictSkin.type(b, 'hand');
    b.textColor = C.inkSoft;
    b.drawText(VerdictSkin.clip(b, e.summary || '', r.width - 32), r.x + 14, r.y + 42, r.width - 24, 20, 'left');

    b.paintOpacity = 60;
    b.fillRect(r.x + 8, r.y + r.height - 5, r.width - 16, 1, C.inkFaded);
    b.paintOpacity = 255;
  };

  /** @returns {void} Push the selection into the detail pane. */
  Window_VerdictExhibits.prototype.callUpdateHelp = function () {
    if (this._detail) this._detail.setExhibit(this.currentId());
  };

  /* ------------------------------------------------------ exhibit detail */

  /**
   * The dossier sheet: the opened exhibit, and what it PROVES — which is the
   * only thing about an exhibit the engine cares about.
   * @class
   */
  function Window_VerdictDossier() { this.initialize.apply(this, arguments); }
  Window_VerdictDossier.prototype = Object.create(Window_Base.prototype);
  Window_VerdictDossier.prototype.constructor = Window_VerdictDossier;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictDossier.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._id = null;
    this.refresh();
  };

  /**
   * @param {string|null} id Exhibit id.
   * @returns {void}
   */
  Window_VerdictDossier.prototype.setExhibit = function (id) {
    if (this._id === id) return;
    this._id = id;
    this.refresh();
  };

  /** @returns {void} Redraw. */
  Window_VerdictDossier.prototype.refresh = function () {
    const b = this.contents;
    b.clear();
    const st = VerdictCore.live();
    const e = st && this._id ? VerdictCore.CaseFile.exhibit(st.def, this._id) : null;
    if (!e) {
      VerdictSkin.type(b, 'lede');
      b.textColor = C.inkFaded;
      b.drawText('No exhibit selected.', 8, 12, this.innerWidth - 16, 28, 'left');
      return;
    }

    VerdictSkin.type(b, 'label');
    b.textColor = C.seal;
    b.drawText('EXHIBIT', 8, 2, 200, 18, 'left');

    VerdictSkin.type(b, 'display');
    b.textColor = C.ink;
    b.drawText(e.name, 8, 18, this.innerWidth - 16, 38, 'left');

    b.paintOpacity = 90;
    b.fillRect(8, 60, this.innerWidth - 16, 1, C.inkFaded);
    b.paintOpacity = 255;

    VerdictSkin.type(b, 'body');
    b.textColor = C.ink;
    const used = VerdictSkin.wrap(b, e.detail || e.summary || '', 8, 70, this.innerWidth - 16, 24, 5);

    let y = 70 + used + 12;
    VerdictSkin.type(b, 'label');
    b.textColor = C.inkFaded;
    b.drawText('THIS ESTABLISHES', 8, y, 300, 18, 'left');
    y += 22;

    if (!e.facts.length) {
      VerdictSkin.type(b, 'hand');
      b.textColor = C.inkFaded;
      b.drawText('Nothing. It is only a thing.', 14, y, this.innerWidth - 20, 22, 'left');
      return;
    }
    for (const f of e.facts) {
      const ctx = b.context;
      ctx.save();
      ctx.strokeStyle = C.proof; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(16, y + 13); ctx.lineTo(20, y + 18); ctx.lineTo(28, y + 6); ctx.stroke();
      ctx.restore();
      VerdictSkin.type(b, 'body');
      b.textColor = C.ink;
      b.drawText(VerdictSkin.humanise(f), 36, y, this.innerWidth - 44, 24, 'left');
      y += 26;
      if (y > this.innerHeight - 24) break;
    }
    b._baseTexture.update();
  };

  /**
   * Turn a fact id into something a player can read.
   *
   * Fact ids are the author's internal vocabulary and were never meant to reach
   * a player — Chronicle Core shipped a journal that showed raw internal flag
   * names and it looked like a bug, because it was one.
   *
   * @param {string} id Fact id.
   * @returns {string} Sentence-cased words.
   */
  VerdictSkin.humanise = function (id) {
    const s = String(id).replace(/[_-]+/g, ' ').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  /* -------------------------------------------------------- cross-examination */

  /**
   * The testimony. Statements as sheets of a transcript, the broken ones struck
   * through and stamped.
   * @class
   */
  function Window_VerdictTestimony() { this.initialize.apply(this, arguments); }
  Window_VerdictTestimony.prototype = Object.create(Window_Selectable.prototype);
  Window_VerdictTestimony.prototype.constructor = Window_VerdictTestimony;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictTestimony.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._testimonyId = null;
    this._rows = [];
    this._flash = 0;
    this._stampText = '';
    this._stampRow = -1;
    this._stampT = 0;
  };

  /** @returns {number} Row height, floored to whole rows. */
  Window_VerdictTestimony.prototype.itemHeight = function () {
    const want = 84;
    const rows = Math.max(1, Math.floor(this.innerHeight / want));
    return Math.floor(this.innerHeight / rows);
  };

  /** @returns {number} Visible statement count. */
  Window_VerdictTestimony.prototype.maxItems = function () { return this._rows.length; };

  /**
   * @param {string} testimonyId Testimony to display.
   * @param {number} [index] Row to select.
   * @returns {void}
   */
  Window_VerdictTestimony.prototype.setTestimony = function (testimonyId, index) {
    this._testimonyId = testimonyId;
    this.reload(index);
  };

  /**
   * Re-read the visible statements from the investigation.
   * @param {number} [index] Row to select.
   * @returns {void}
   */
  Window_VerdictTestimony.prototype.reload = function (index) {
    const st = VerdictCore.live();
    this._rows = st && this._testimonyId ? VerdictCore.Investigation.visible(st, this._testimonyId) : [];
    this._index = Math.max(0, Math.min(index == null ? this._index : index, this._rows.length - 1));
    this.refresh();
  };

  /** @returns {object|null} Selected statement definition. */
  Window_VerdictTestimony.prototype.currentStatement = function () { return this._rows[this.index()] || null; };

  /**
   * Slam a stamp onto a row.
   * @param {number} row Row index.
   * @param {string} text Stamp text.
   * @returns {void}
   */
  Window_VerdictTestimony.prototype.slam = function (row, text) {
    this._stampRow = row;
    this._stampText = text;
    this._stampT = MOTION ? 0 : 1;
    this.refresh();
  };

  /** @returns {void} Per-frame update; advances the stamp slam. */
  Window_VerdictTestimony.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (this._stampRow >= 0 && this._stampT < 1) {
      this._stampT = Math.min(1, this._stampT + 0.14);
      this.refresh();
    }
  };

  /**
   * @param {number} index Row index.
   * @returns {void}
   */
  Window_VerdictTestimony.prototype.drawItem = function (index) {
    const st = VerdictCore.live();
    if (!st) return;
    const s = this._rows[index];
    if (!s) return;
    const r = this.itemRect(index);
    const b = this.contents;
    const broken = VerdictCore.Investigation.isBroken(st, this._testimonyId, s.id);
    const on = index === this.index();

    // The sheet. Each statement is its own slip of paper, indented when
    // selected — a transcript being leafed through, not a list box.
    const px = r.x + (on ? 10 : 0);
    b.paintOpacity = broken ? 120 : 210;
    b.blt(VerdictSkin.paper(r.width - 14, r.height - 12), 0, 0, r.width - 14, r.height - 12, px, r.y + 4);
    b.paintOpacity = 255;

    if (on) b.fillRect(px, r.y + 4, 5, r.height - 12, C.seal);

    VerdictSkin.type(b, 'label');
    b.textColor = broken ? C.seal : C.inkFaded;
    b.drawText(`STATEMENT ${index + 1}`, px + 16, r.y + 10, 220, 18, 'left');

    VerdictSkin.type(b, 'body');
    b.textColor = broken ? C.inkFaded : C.ink;
    const used = VerdictSkin.wrap(b, '“' + (s.text || '') + '”', px + 16, r.y + 30, r.width - 60, 23, 2);

    if (broken) {
      // Struck through. The strike is drawn across the measured text, not the
      // whole row, so it reads as an edit rather than a border.
      const ctx = b.context;
      ctx.save();
      ctx.strokeStyle = C.seal;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 14, r.y + 30 + used / 2);
      ctx.lineTo(px + r.width - 46, r.y + 30 + used / 2);
      ctx.stroke();
      ctx.restore();
    }

    if (this._stampRow === index && this._stampText) {
      const t = this._stampT;
      const scale = MOTION ? 1 + (1 - t) * (1 - t) * 1.6 : 1;
      VerdictSkin.stamp(b, px + r.width / 2, r.y + r.height / 2,
        this._stampText, -0.12 + jitter(this._stampText, 3) * 0.05,
        this._stampText === 'CONTRADICTION' ? C.seal : C.inkFaded, scale, Math.min(1, t * 1.4));
    }
    b._baseTexture.update();
  };

  /* --------------------------------------------------------- present picker */

  /**
   * The exhibit you are about to throw at a statement.
   * @class
   */
  function Window_VerdictPresent() { this.initialize.apply(this, arguments); }
  Window_VerdictPresent.prototype = Object.create(Window_Selectable.prototype);
  Window_VerdictPresent.prototype.constructor = Window_VerdictPresent;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictPresent.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._ids = [];
    this.openness = 0;
  };

  /** @returns {number} Row height. */
  Window_VerdictPresent.prototype.itemHeight = function () {
    const rows = Math.max(1, Math.floor(this.innerHeight / 44));
    return Math.floor(this.innerHeight / rows);
  };

  /** @returns {number} Row count. */
  Window_VerdictPresent.prototype.maxItems = function () { return this._ids.length; };

  /** @returns {string|null} Selected exhibit id. */
  Window_VerdictPresent.prototype.currentId = function () { return this._ids[this.index()] || null; };

  /**
   * @param {number} [index] Row to select.
   * @returns {void}
   */
  Window_VerdictPresent.prototype.reload = function (index) {
    const st = VerdictCore.live();
    this._ids = st ? st.held.slice() : [];
    this._index = Math.max(0, Math.min(index == null ? this._index : index, this._ids.length - 1));
    this.refresh();
  };

  /**
   * @param {number} index Row index.
   * @returns {void}
   */
  Window_VerdictPresent.prototype.drawItem = function (index) {
    const st = VerdictCore.live();
    if (!st) return;
    const e = VerdictCore.CaseFile.exhibit(st.def, this._ids[index]);
    if (!e) return;
    const r = this.itemRect(index);
    const b = this.contents;
    const on = index === this.index();
    if (on) {
      b.fillRect(r.x, r.y + 3, 4, r.height - 8, C.seal);
      b.paintOpacity = 45;
      b.fillRect(r.x + 4, r.y + 3, r.width - 6, r.height - 8, C.inkFaded);
      b.paintOpacity = 255;
    }
    VerdictSkin.type(b, 'body');
    b.textColor = C.ink;
    b.drawText(e.name, r.x + 14, r.y + 6, r.width - 90, r.height - 12, 'left');
    VerdictSkin.type(b, 'label');
    b.textColor = C.inkFaded;
    b.drawText(String(e.kind).toUpperCase(), r.x + r.width - 84, r.y + 10, 78, 18, 'right');
  };

  /* -------------------------------------------------------------- verdict bar */

  /**
   * The line that tells the player what just happened. It is the whole feedback
   * loop of the genre, so it gets its own surface and its own colour.
   * @class
   */
  function Window_VerdictSay() { this.initialize.apply(this, arguments); }
  Window_VerdictSay.prototype = Object.create(Window_Base.prototype);
  Window_VerdictSay.prototype.constructor = Window_VerdictSay;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictSay.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._label = '';
    this._text = '';
    this._tone = 'neutral';
    this.refresh();
  };

  /**
   * @param {string} label Short tag, e.g. CONTRADICTION.
   * @param {string} text Sentence.
   * @param {'good'|'bad'|'near'|'neutral'} tone Colour role.
   * @returns {void}
   */
  Window_VerdictSay.prototype.say = function (label, text, tone) {
    this._label = label; this._text = text; this._tone = tone || 'neutral';
    this.refresh();
  };

  /** @returns {void} Redraw. */
  Window_VerdictSay.prototype.refresh = function () {
    const b = this.contents;
    b.clear();
    const colour = this._tone === 'good' ? C.proof
      : this._tone === 'bad' ? C.seal
        : this._tone === 'near' ? '#a8761f' : C.inkFaded;
    if (this._label) {
      b.fillRect(0, 6, 5, this.innerHeight - 12, colour);
      VerdictSkin.type(b, 'label');
      b.textColor = colour;
      b.drawText(this._label, 14, 2, 300, 20, 'left');
    }
    VerdictSkin.type(b, 'body');
    b.textColor = C.ink;
    // ⚠️ Derive the line budget from the box, never hard-code it. A fixed `maxLines: 2` against a
    // 52 px inner height at a 22 px line height drew the second line half outside the window, and
    // MZ clips contents to the inner rect — so the result was a sentence with its bottom sliced
    // off, which reads as a rendering bug. Measured on the cross-examination footer, 2026-08-10.
    const top = this._label ? 22 : 8;
    const lh = 22;
    const lines = Math.max(1, Math.floor((this.innerHeight - top) / lh));
    VerdictSkin.wrap(b, this._text, 14, top, this.innerWidth - 24, lh, lines);
  };

  /* ---------------------------------------------------------------- the board */

  /**
   * The corkboard. One window, one bitmap, no rows — every card is placed and
   * tilted, and the strings are drawn between them.
   *
   * This is deliberately NOT a `Window_Selectable`: there is no grid to index
   * into, and forcing one would produce exactly the screen this product exists
   * to avoid.
   * @class
   */
  function Window_VerdictBoard() { this.initialize.apply(this, arguments); }
  Window_VerdictBoard.prototype = Object.create(Window_Base.prototype);
  Window_VerdictBoard.prototype.constructor = Window_VerdictBoard;

  /** Card footprint on the board. */
  const CARD = { w: 212, h: 100 };

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictBoard.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._nodes = [];
    this._index = 0;
    this._picked = -1;
    this._stringT = 0;
    this._newInsight = null;
    this.rebuild();
  };

  /**
   * Lay the board out from the live investigation.
   *
   * Positions are deterministic: a column of exhibits down the left, the
   * statements of every started testimony down the right, and conclusions in
   * the middle where the strings meet. Tilt comes from the node's own id, so a
   * card never moves between frames or between runs.
   *
   * @returns {void}
   */
  Window_VerdictBoard.prototype.rebuild = function () {
    const st = VerdictCore.live();
    this._nodes.length = 0;
    if (!st) { this.refresh(); return; }

    const colL = 24;
    const colR = this.innerWidth - CARD.w - 24;

    // ⚠️ Derive the pitch from the board, never from a constant. The exhibit column had no
    // height guard at all and the statement column had `break`, so shortening the board by 26 px
    // produced one column running off the bottom edge and the other silently dropping its last
    // card — two different wrong answers to the same question, in the same frame, from the same
    // change. Both columns now share one capacity and one evenly distributed pitch, so the board
    // reflows instead of overflowing or truncating.
    const top = 14;
    const capacity = Math.max(1, Math.floor((this.innerHeight - top) / (CARD.h + 14)));
    const slack = this.innerHeight - top - (capacity * CARD.h);
    const pitch = CARD.h + (capacity > 1 ? Math.min(26, slack / (capacity - 1)) : 0);

    let row = 0;
    for (const id of st.held) {
      if (row >= capacity) break;
      const e = VerdictCore.CaseFile.exhibit(st.def, id);
      if (!e) continue;
      this._nodes.push({
        key: 'exhibit:' + id, kicker: e.kind, title: e.name, body: e.summary,
        x: colL, y: Math.round(top + row * pitch), w: CARD.w, h: CARD.h,
        tilt: jitter(id, 1) * 0.045, tone: 'evidence'
      });
      row++;
    }

    row = 0;
    for (const t of st.def.testimonies) {
      for (const s of VerdictCore.Investigation.visible(st, t.id)) {
        if (row >= capacity) break;
        this._nodes.push({
          key: 'statement:' + s.id, kicker: t.speaker || 'account',
          // The full line, clipped by MEASUREMENT inside VerdictSkin.card. A character slice here
          // was the old answer and it cannot know the card width or the face's metrics.
          title: s.text || '',
          body: '', x: colR, y: Math.round(top + row * pitch), w: CARD.w, h: CARD.h,
          tilt: jitter(s.id, 2) * 0.045,
          tone: VerdictCore.Investigation.isBroken(st, t.id, s.id) ? 'lie' : 'account'
        });
        row++;
      }
    }
    this._index = Math.max(0, Math.min(this._index, this._nodes.length - 1));
    this.refresh();
  };

  /** @returns {number} Node count. */
  Window_VerdictBoard.prototype.nodeCount = function () { return this._nodes.length; };

  /** @returns {number} Selected node index. */
  Window_VerdictBoard.prototype.index = function () { return this._index; };

  /**
   * @param {number} i Node index.
   * @returns {void}
   */
  Window_VerdictBoard.prototype.select = function (i) {
    if (!this._nodes.length) return;
    this._index = (i + this._nodes.length) % this._nodes.length;
    this.refresh();
  };

  /** @returns {string|null} Selected node key. */
  Window_VerdictBoard.prototype.currentKey = function () {
    const n = this._nodes[this._index];
    return n ? n.key : null;
  };

  /** @returns {string|null} The key currently held as the first half of a link. */
  Window_VerdictBoard.prototype.pickedKey = function () {
    const n = this._nodes[this._picked];
    return n ? n.key : null;
  };

  /** @returns {void} Hold the selected node as the first end of a string. */
  Window_VerdictBoard.prototype.pick = function () { this._picked = this._index; this.refresh(); };

  /** @returns {void} Drop the held node. */
  Window_VerdictBoard.prototype.unpick = function () { this._picked = -1; this.refresh(); };

  /**
   * Begin the animated draw of a newly discovered string.
   * @param {string} ruleId Link rule id.
   * @returns {void}
   */
  Window_VerdictBoard.prototype.drawNew = function (ruleId) {
    this._newInsight = ruleId;
    this._stringT = MOTION ? 0 : 1;
    this.refresh();
  };

  /** @returns {void} Per-frame update; advances the string draw. */
  Window_VerdictBoard.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._newInsight && this._stringT < 1) {
      this._stringT = Math.min(1, this._stringT + 0.07);
      this.refresh();
    }
  };

  /**
   * Where a node's pin sits, in contents coordinates.
   * @param {object} n Node.
   * @returns {{x:number,y:number}} Pin position.
   */
  function pinOf(n) { return { x: n.x + n.w / 2, y: n.y + 8 }; }

  /**
   * Find a node by key.
   * @param {object[]} nodes Node list.
   * @param {string} key Node key.
   * @returns {object|null} Node or null.
   */
  function nodeByKey(nodes, key) {
    for (let i = 0; i < nodes.length; i++) if (nodes[i].key === key) return nodes[i];
    return null;
  }

  /** @returns {void} Redraw the whole board. */
  Window_VerdictBoard.prototype.refresh = function () {
    const b = this.contents;
    b.clear();
    b.blt(VerdictSkin.cork(this.innerWidth, this.innerHeight), 0, 0, this.innerWidth, this.innerHeight, 0, 0);

    const st = VerdictCore.live();
    if (!st) { b._baseTexture.update(); return; }

    // Strings first: a thread runs BEHIND the cards it joins, which is what
    // makes the board read as physical depth rather than as a diagram.
    for (const ruleId of st.insights) {
      const rule = st.def.links.find((r) => r.id === ruleId);
      if (!rule) continue;
      const a = nodeByKey(this._nodes, rule.a);
      const c = nodeByKey(this._nodes, rule.b);
      if (!a || !c) continue;
      const pa = pinOf(a);
      const pc = pinOf(c);
      VerdictSkin.string(b, pa.x, pa.y, pc.x, pc.y, ruleId === this._newInsight ? this._stringT : 1);
    }

    for (let i = 0; i < this._nodes.length; i++) {
      const n = this._nodes[i];
      VerdictSkin.card(b, {
        x: n.x, y: n.y, w: n.w, h: n.h, tilt: n.tilt,
        kicker: n.kicker, title: n.title, body: n.body, tone: n.tone,
        selected: i === this._index, picked: i === this._picked
      });
    }

    // Conclusions live in the middle column, where the strings cross.
    // Sized for THREE wrapped lines of the longest authored conclusion plus a stamp that does not
    // land on top of them. The old 236x96 fitted one and a half lines and printed PROVEN across
    // the second — a card that argued the product could not lay out its own text.
    const NOTE = { w: 262, h: 126 };
    const conclusions = VerdictCore.Investigation.conclusions(st);
    let cy = 34;
    const cx = Math.round((this.innerWidth - NOTE.w) / 2);
    for (const text of conclusions) {
      if (cy + NOTE.h > this.innerHeight) break;
      VerdictSkin.card(b, {
        x: cx, y: cy, w: NOTE.w, h: NOTE.h, tilt: jitter(text, 5) * 0.03,
        kicker: 'conclusion', title: '', body: text, tone: 'proof', selected: false, picked: false
      });
      VerdictSkin.stamp(b, cx + NOTE.w - 58, cy + NOTE.h - 24, 'PROVEN', -0.24, C.proof, 0.52, 0.95);
      cy += NOTE.h + 16;
    }
    b._baseTexture.update();
  };

  /* ------------------------------------------------------- the accusation sheet */

  /**
   * The accusation, typeset as a sentence with ruled blanks in it.
   *
   * This is the one screen in the product that MZ genuinely cannot approximate.
   * `drawText` places a string in a box; there is no inline layout anywhere in
   * the engine, so a sentence whose middle is a fill-in-the-blank rule has to be
   * measured and flowed word by word. That is what `layout()` does, and it is
   * why this reads as a legal form rather than as a menu.
   *
   * Not a `Window_Selectable`. The selectable thing here is a blank sitting
   * inside a paragraph, at an arbitrary x/y with an arbitrary width — there is
   * no row grid to index into, and forcing one would produce a list box, which
   * is the exact screen this product exists to avoid.
   * @class
   */
  function Window_VerdictAccusation() { this.initialize.apply(this, arguments); }
  Window_VerdictAccusation.prototype = Object.create(Window_Base.prototype);
  Window_VerdictAccusation.prototype.constructor = Window_VerdictAccusation;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictAccusation.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._deductionId = null;
    this._slot = 0;
    this._tokens = [];      // flowed layout, rebuilt only when something changes
    this._wrong = null;     // slot indices marked wrong by the last submission
    this._stampText = '';
    this._stampT = 0;
    this._writeSlot = -1;   // slot whose answer is currently being inked in
    this._writeT = 1;
    this.refresh();
  };

  /**
   * @param {string} deductionId Deduction to display.
   * @returns {void}
   */
  Window_VerdictAccusation.prototype.setDeduction = function (deductionId) {
    this._deductionId = deductionId;
    this._slot = 0;
    this._wrong = null;
    this._stampText = '';
    this.refresh();
  };

  /** @returns {object|null} The deduction definition, or null. */
  Window_VerdictAccusation.prototype.deduction = function () {
    const st = VerdictCore.live();
    if (!st || !this._deductionId) return null;
    return VerdictCore.CaseFile.deduction(st.def, this._deductionId);
  };

  /** @returns {number} Index of the selected blank. */
  Window_VerdictAccusation.prototype.slot = function () { return this._slot; };

  /**
   * Move the selection between blanks.
   * @param {number} delta -1 or 1.
   * @returns {void}
   */
  Window_VerdictAccusation.prototype.shiftSlot = function (delta) {
    const d = this.deduction();
    if (!d) return;
    const n = d.slots.length;
    this._slot = ((this._slot + delta) % n + n) % n;
    this.refresh();
  };

  /** @returns {string|null} The fact currently written into the selected blank. */
  Window_VerdictAccusation.prototype.answerAt = function (slot) {
    const st = VerdictCore.live();
    if (!st || !this._deductionId) return null;
    return st.answers[this._deductionId + '/' + slot] || null;
  };

  /** @returns {boolean} Is every blank filled? */
  Window_VerdictAccusation.prototype.complete = function () {
    const d = this.deduction();
    if (!d) return false;
    for (let i = 0; i < d.slots.length; i++) if (!this.answerAt(i)) return false;
    return true;
  };

  /**
   * Ink an answer into a blank, with a short write-on animation.
   * @param {number} slot Blank index.
   * @returns {void}
   */
  Window_VerdictAccusation.prototype.inked = function (slot) {
    this._writeSlot = slot;
    this._writeT = MOTION ? 0 : 1;
    this._wrong = null;      // a fresh answer retracts the last verdict's marks
    this._stampText = '';
    this.refresh();
  };

  /**
   * Stamp the sheet with a verdict.
   * @param {string} text Stamp text.
   * @param {number[]} [wrongSlots] Blanks to mark as wrong.
   * @returns {void}
   */
  Window_VerdictAccusation.prototype.slam = function (text, wrongSlots) {
    this._stampText = text;
    this._wrong = wrongSlots && wrongSlots.length ? wrongSlots : null;
    this._stampT = MOTION ? 0 : 1;
    this.refresh();
  };

  /** @returns {void} Per-frame: advance the two bounded animations. */
  Window_VerdictAccusation.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    // Both animations are BOUNDED — roughly 8 and 10 frames — and each ends by
    // clamping to 1, after which nothing redraws. A per-frame refresh of a
    // flowed paragraph is far too expensive to leave running for an idle glow,
    // which is why the selected blank is marked statically instead.
    if (this._stampText && this._stampT < 1) {
      this._stampT = Math.min(1, this._stampT + 0.14);
      this.refresh();
    } else if (this._writeT < 1) {
      this._writeT = Math.min(1, this._writeT + 0.11);
      this.refresh();
    }
  };

  /** Minimum width of an empty ruled blank, in pixels. */
  const BLANK_MIN = 168;

  /**
   * Flow the prompt into positioned tokens.
   *
   * The prompt is authored as plain text with `{0}`, `{1}` … marking the blanks,
   * so a writer never touches layout. Words and blanks are measured in their own
   * typefaces and wrapped at the window width.
   *
   * Runs on refresh — a state change — never per frame.
   *
   * @returns {void}
   */
  Window_VerdictAccusation.prototype.layout = function () {
    this._tokens.length = 0;
    const d = this.deduction();
    if (!d) return;
    const b = this.contents;
    const maxW = this.innerWidth - 24;
    const lh = 34;
    let x = 12;
    let y = 54;

    const parts = String(d.prompt || '').split(/(\{\d+\})/);
    for (let p = 0; p < parts.length; p++) {
      const part = parts[p];
      if (!part) continue;
      const hit = part.match(/^\{(\d+)\}$/);

      if (hit) {
        const slot = Number(hit[1]);
        const fact = this.answerAt(slot);
        VerdictSkin.type(b, 'hand');
        const label = fact ? VerdictSkin.humanise(fact) : '';
        const w = Math.max(BLANK_MIN, b.measureTextWidth(label) + 26);
        if (x + w > maxW && x > 12) { x = 12; y += lh; }
        this._tokens.push({ kind: 'blank', slot, text: label, x, y, w });
        x += w + 8;
        continue;
      }

      VerdictSkin.type(b, 'body');
      const words = part.split(/(\s+)/);
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word || /^\s+$/.test(word)) continue;
        const w = b.measureTextWidth(word);
        if (x + w > maxW && x > 12) { x = 12; y += lh; }
        this._tokens.push({ kind: 'word', text: word, x, y, w });
        x += w + b.measureTextWidth(' ');
      }
    }
  };

  /** @returns {void} Redraw the sheet. */
  Window_VerdictAccusation.prototype.refresh = function () {
    const b = this.contents;
    b.clear();
    const d = this.deduction();

    VerdictSkin.type(b, 'label');
    b.textColor = C.seal;
    b.drawText('THE ACCUSATION', 12, 8, 320, 20, 'left');

    if (!d) {
      VerdictSkin.type(b, 'body');
      b.textColor = C.inkFaded;
      b.drawText('No deduction is open.', 12, 40, this.innerWidth - 24, 26, 'left');
      b._baseTexture.update();
      return;
    }

    VerdictSkin.type(b, 'label');
    b.textColor = C.inkFaded;
    b.drawText(`${d.slots.length} BLANKS`, this.innerWidth - 172, 8, 160, 20, 'right');

    this.layout();
    const ctx = b.context;

    for (let i = 0; i < this._tokens.length; i++) {
      const t = this._tokens[i];
      if (t.kind === 'word') {
        VerdictSkin.type(b, 'body');
        b.textColor = C.ink;
        b.drawText(t.text, t.x, t.y, t.w + 4, 30, 'left');
        continue;
      }

      const on = t.slot === this._slot;
      const wrong = !!(this._wrong && this._wrong.indexOf(t.slot) >= 0);
      const ruleY = t.y + 27;

      // The rule. A selected blank is inked heavier and in seal red, which is
      // legible without motion — an idle pulse would cost a full paragraph
      // redraw every frame for the whole time the scene is open.
      ctx.save();
      ctx.strokeStyle = wrong ? C.seal : on ? C.seal : 'rgba(60,48,32,0.62)';
      ctx.lineWidth = on ? 3 : 1.6;
      ctx.beginPath();
      ctx.moveTo(t.x, ruleY);
      ctx.lineTo(t.x + t.w, ruleY);
      ctx.stroke();
      if (on) {
        // A nib mark at the head of the line the player is about to fill.
        ctx.fillStyle = C.seal;
        ctx.beginPath();
        ctx.moveTo(t.x - 9, ruleY - 6);
        ctx.lineTo(t.x - 2, ruleY);
        ctx.lineTo(t.x - 9, ruleY + 6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      if (t.text) {
        // Answers are written in the hand role — an italic serif over a ruled
        // line reads as something filled in, where a second monospace run would
        // read as more of the same printed form.
        const writing = t.slot === this._writeSlot && this._writeT < 1;
        VerdictSkin.type(b, 'hand');
        b.textColor = wrong ? C.seal : C.ink;
        b.paintOpacity = writing ? Math.floor(60 + this._writeT * 195) : 255;
        b.drawText(t.text, t.x + 8, t.y + (writing ? (1 - this._writeT) * 6 : 0), t.w - 12, 30, 'left');
        b.paintOpacity = 255;

        if (wrong) {
          ctx.save();
          ctx.strokeStyle = C.seal;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(t.x + 4, t.y + 15);
          ctx.lineTo(t.x + t.w - 6, t.y + 13);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        VerdictSkin.type(b, 'label');
        b.textColor = C.inkFaded;
        const hint = String(d.slots[t.slot].label || '').toUpperCase();
        if (hint) b.drawText(hint, t.x + 8, t.y + 4, t.w - 12, 22, 'left');
      }
    }

    if (this._stampText) {
      const scale = MOTION ? 1 + (1 - this._stampT) * (1 - this._stampT) * 1.9 : 1;
      VerdictSkin.stamp(b, this.innerWidth / 2, this.innerHeight - 44,
        this._stampText, -0.09 + jitter(this._stampText, 5) * 0.06,
        this._stampText === 'CASE MADE' ? C.proof : C.seal,
        scale, Math.min(1, this._stampT * 1.4));
    }
    b._baseTexture.update();
  };

  /* --------------------------------------------------------- the option shelf */

  /**
   * The facts offered for one blank.
   *
   * Each row says whether the player has actually ESTABLISHED that fact. The
   * engine lets you write an unproven fact into a blank and be wrong for it, so
   * showing which options are backed by evidence is the difference between a
   * deduction and a guess — and it is the only place in the product where the
   * fact ledger becomes visible as a thing you spend.
   * @class
   */
  function Window_VerdictOptions() { this.initialize.apply(this, arguments); }
  Window_VerdictOptions.prototype = Object.create(Window_Selectable.prototype);
  Window_VerdictOptions.prototype.constructor = Window_VerdictOptions;

  /**
   * @param {Rectangle} rect Window rect.
   * @returns {void}
   */
  Window_VerdictOptions.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._facts = [];
  };

  /** @returns {number} Row height, floored to whole rows (trap 4). */
  Window_VerdictOptions.prototype.itemHeight = function () {
    const rows = Math.max(1, Math.floor(this.innerHeight / 46));
    return Math.floor(this.innerHeight / rows);
  };

  /** @returns {number} Row count. */
  Window_VerdictOptions.prototype.maxItems = function () { return this._facts.length; };

  /** @returns {string|null} Selected fact id. */
  Window_VerdictOptions.prototype.currentFact = function () { return this._facts[this.index()] || null; };

  /**
   * Load the options for one blank.
   * @param {string} deductionId Deduction id.
   * @param {number} slot Blank index.
   * @returns {void}
   */
  Window_VerdictOptions.prototype.setSlot = function (deductionId, slot) {
    const st = VerdictCore.live();
    const d = st && deductionId ? VerdictCore.CaseFile.deduction(st.def, deductionId) : null;
    const s = d && d.slots[slot];
    this._facts = s ? s.options.slice() : [];
    // ⚠️ Set the index BEFORE drawing. `select()` refreshes the cursor and not
    // the items, so selecting after a refresh draws every row with index -1 —
    // trap 5, and it has cost this wing a session before.
    this._index = 0;
    this.refresh();
  };

  /**
   * @param {number} index Row index.
   * @returns {void}
   */
  Window_VerdictOptions.prototype.drawItem = function (index) {
    const st = VerdictCore.live();
    const fact = this._facts[index];
    if (!st || !fact) return;
    const r = this.itemRect(index);
    const b = this.contents;
    const on = index === this.index();
    const known = VerdictCore.Investigation.knows(st, fact);

    if (on) {
      b.fillRect(r.x, r.y + 3, 4, r.height - 8, C.seal);
      b.paintOpacity = 45;
      b.fillRect(r.x + 4, r.y + 3, r.width - 6, r.height - 8, C.inkFaded);
      b.paintOpacity = 255;
    }

    VerdictSkin.type(b, 'body');
    b.textColor = known ? C.ink : C.inkFaded;
    b.drawText(VerdictSkin.humanise(fact), r.x + 16, r.y + 4, r.width - 132, r.height - 10, 'left');

    VerdictSkin.type(b, 'label');
    b.textColor = known ? C.proof : C.inkFaded;
    b.drawText(known ? 'ESTABLISHED' : 'UNPROVEN', r.x + r.width - 122, r.y + 10, 112, 20, 'right');

    if (!known) {
      // A dotted rule under an unproven option: visible at a glance, and it does
      // not stop the player choosing it. Being allowed to be wrong is the point.
      const ctx = b.context;
      ctx.save();
      ctx.strokeStyle = 'rgba(120,100,74,0.75)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(r.x + 16, r.y + r.height - 11);
      ctx.lineTo(r.x + r.width - 130, r.y + r.height - 11);
      ctx.stroke();
      ctx.restore();
    }
    b._baseTexture.update();
  };

  //===========================================================================
  // Scenes
  //===========================================================================

  /**
   * Base for the four Verdict scenes: a paper desk background rather than the
   * blurred map snapshot MZ uses, which is the other thing that instantly says
   * "RPG Maker menu".
   * @class
   */
  function Scene_VerdictBase() { this.initialize.apply(this, arguments); }
  Scene_VerdictBase.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_VerdictBase.prototype.constructor = Scene_VerdictBase;

  /** @returns {void} Set up. */
  Scene_VerdictBase.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  /** @returns {void} Replace the blurred-map backdrop with a desk. */
  Scene_VerdictBase.prototype.createBackground = function () {
    this._backgroundSprite = new Sprite();
    const w = Graphics.width;
    const h = Graphics.height;
    const bmp = new Bitmap(w, h);
    const ctx = bmp.context;
    const g = ctx.createLinearGradient(0, 0, w * 0.4, h);
    g.addColorStop(0, '#2f2419');
    g.addColorStop(1, '#171009');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const r = VerdictCore.Rng.create(4242);
    for (let i = 0; i < 2400; i++) {
      const x = VerdictCore.Rng.next(r) * w;
      const y = VerdictCore.Rng.next(r) * h;
      ctx.fillStyle = `rgba(255,226,170,${VerdictCore.Rng.next(r) * 0.05})`;
      ctx.fillRect(x, y, 1, 1);
    }
    const vg = ctx.createRadialGradient(w / 2, h * 0.4, 40, w / 2, h / 2, w * 0.8);
    vg.addColorStop(0, 'rgba(255,220,150,0.10)');
    vg.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    bmp._baseTexture.update();
    this._backgroundSprite.bitmap = bmp;
    this.addChild(this._backgroundSprite);
  };

  /**
   * Replace MZ's stock cancel button with a paper tab.
   *
   * ⚠️ THE LAST STOCK PIXEL ON THE SCREEN, and it sat in the corner of every store screenshot.
   * `Scene_MenuBase.createCancelButton` builds a `Sprite_Button` framed out of `img/system/
   * ButtonSet.png` — the dark rounded rectangle with the white arrow that every MZ player
   * recognises instantly. Four scenes could be themed to the last window and a buyer would still
   * see one unmistakable piece of RPG Maker furniture, because it is a Sprite rather than a
   * Window and no windowskin work touches it.
   *
   * The button is REPLACED, not deleted: touch and mouse players need the affordance, and
   * removing it would trade one defect for another. Only its skin changes.
   *
   * @returns {void}
   */
  Scene_VerdictBase.prototype.createCancelButton = function () {
    Scene_MenuBase.prototype.createCancelButton.call(this);
    const btn = this._cancelButton;
    const w = 104;
    const h = 38;
    // ⚠️ THE SHEET MUST BE AT LEAST `blockWidth() * 11` = 528px WIDE, even though only 96 is drawn.
    // `Sprite_Button.prototype.checkBitmap` THROWS "ButtonSet image is too small" below that — a
    // guard meant to catch an MV-sized ButtonSet, which fires just as happily on a custom sheet.
    // And the throw lands inside `WindowLayer.update`, which abandons the rest of that frame's
    // update: EVERY window in the scene then stops receiving update() and sits at whatever opacity
    // it was constructed with. Measured 2026-08-10 — four scenes of entirely invisible windows,
    // with the only evidence a console error nothing was reading.
    //
    // The multiplier is 11, not the 4 this was first written against. Read `rmmz_sprites.js`; a
    // remembered constant cost a whole rebuild-and-reprobe cycle here.
    const sheetW = Sprite_Button.prototype.blockWidth.call(btn) * 11;
    const bmp = new Bitmap(sheetW, h * 2);       // cold on top, hot underneath — MZ's own convention
    for (let state = 0; state < 2; state++) {
      const oy = state * h;
      const ctx = bmp.context;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(3, oy + 4, w - 6, h - 8);
      const paper = VerdictSkin.paper(w - 6, h - 8);
      ctx.drawImage(paper.canvas || paper._canvas, 2, oy + 2);
      ctx.fillStyle = state ? C.seal : 'rgba(60,48,32,0.55)';
      ctx.fillRect(2, oy + 2, w - 6, 3);
      ctx.restore();
      bmp.fontFace = FONT.typewriter;
      bmp.fontSize = 13;
      bmp.textColor = state ? C.seal : C.inkSoft;
      // Centred in the PAPER (oy+2 .. oy+h-6), not in the frame — the drop shadow occupies the
      // bottom rows, so centring on the frame pushes the word up into the accent bar.
      bmp.drawText('CLOSE', 2, oy + 10, w - 6, 20, 'center');
    }
    bmp._baseTexture.update();
    btn.bitmap = bmp;
    btn.setColdFrame(0, 0, w, h);
    btn.setHotFrame(0, h, w, h);
    btn.updateFrame();
    btn.x = Graphics.boxWidth - w - 16;
    btn.y = 18;
    // MZ dims an un-pressed button to 192. That is right for its own chrome and wrong for a sheet
    // of paper, which does not fade because nobody is touching it.
    btn.updateOpacity = function () { this.opacity = 255; };
    btn.opacity = 255;
  };

  /** @returns {void} Per-frame: advance every dealt window's entrance. */
  Scene_VerdictBase.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._windowLayer) {
      const kids = this._windowLayer.children;
      for (let i = 0; i < kids.length; i++) VerdictSkin.updateDeal(kids[i]);
    }
  };

  /* --------------------------------------------------------- Scene: Case File */

  /**
   * The Case File: exhibits on the left, the opened dossier on the right.
   * @class
   */
  function Scene_VerdictCaseFile() { this.initialize.apply(this, arguments); }
  Scene_VerdictCaseFile.prototype = Object.create(Scene_VerdictBase.prototype);
  Scene_VerdictCaseFile.prototype.constructor = Scene_VerdictCaseFile;

  /** @returns {void} Build the scene. */
  Scene_VerdictCaseFile.prototype.create = function () {
    Scene_VerdictBase.prototype.create.call(this);
    const W = Graphics.boxWidth;
    const H = Graphics.boxHeight;

    this._header = new Window_VerdictHeader(new Rectangle(16, 12, W - 32, 84));
    this.addWindow(this._header);
    const st = VerdictCore.live();
    this._header.setHeading('Case File', st ? `${st.held.length} exhibits · ${VerdictCore.Investigation.facts(st).length} facts established` : 'No case open');

    const listW = Math.floor((W - 44) * 0.42);
    this._list = new Window_VerdictExhibits(new Rectangle(16, 104, listW, H - 124));
    this._dossier = new Window_VerdictDossier(new Rectangle(28 + listW, 104, W - listW - 44, H - 124));
    this.addWindow(this._list);
    this.addWindow(this._dossier);

    this._list.setDetailWindow(this._dossier);
    this._list.setHandler('cancel', this.popScene.bind(this));
    this._list.reload(0);
    this._list.activate();

    VerdictSkin.deal(this._header, 0);
    VerdictSkin.deal(this._list, 3);
    VerdictSkin.deal(this._dossier, 6);
  };

  /* --------------------------------------------------- Scene: Cross-Examination */

  /**
   * The cross-examination.
   * @class
   */
  function Scene_VerdictCrossExam() { this.initialize.apply(this, arguments); }
  Scene_VerdictCrossExam.prototype = Object.create(Scene_VerdictBase.prototype);
  Scene_VerdictCrossExam.prototype.constructor = Scene_VerdictCrossExam;

  /**
   * @param {string} testimonyId Testimony to examine.
   * @returns {void}
   */
  Scene_VerdictCrossExam.prototype.prepare = function (testimonyId) { this._testimonyId = testimonyId; };

  /** @returns {void} Build the scene. */
  Scene_VerdictCrossExam.prototype.create = function () {
    Scene_VerdictBase.prototype.create.call(this);
    const W = Graphics.boxWidth;
    const H = Graphics.boxHeight;
    const st = VerdictCore.live();
    const t = st && this._testimonyId ? VerdictCore.CaseFile.testimony(st.def, this._testimonyId) : null;

    this._header = new Window_VerdictHeader(new Rectangle(16, 12, W - 32, 84));
    this.addWindow(this._header);
    this._header.setHeading(t ? t.title : 'Cross-Examination', t ? `Testimony of ${t.speaker}` : '');

    this._testimony = new Window_VerdictTestimony(new Rectangle(16, 104, W - 32, H - 214));
    this.addWindow(this._testimony);
    this._testimony.setHandler('ok', this.onPress.bind(this));
    this._testimony.setHandler('cancel', this.popScene.bind(this));
    this._testimony.setTestimony(this._testimonyId, 0);
    this._testimony.activate();

    this._say = new Window_VerdictSay(new Rectangle(16, H - 102, W - 32, 90));
    this.addWindow(this._say);
    this._say.say('', t ? 'OK presses the statement. Shift presents an exhibit against it.' : 'No testimony loaded.', 'neutral');

    this._present = new Window_VerdictPresent(new Rectangle(Math.floor(W * 0.28), 140, Math.floor(W * 0.44), 260));
    this.addWindow(this._present);
    this._present.setHandler('ok', this.onPresentOk.bind(this));
    this._present.setHandler('cancel', this.onPresentCancel.bind(this));
    this._present.hide();
    this._present.deactivate();

    VerdictSkin.deal(this._header, 0);
    VerdictSkin.deal(this._testimony, 3);
    VerdictSkin.deal(this._say, 7);
  };

  /** @returns {void} Per-frame: watch for the present key. */
  Scene_VerdictCrossExam.prototype.update = function () {
    Scene_VerdictBase.prototype.update.call(this);
    if (this._testimony.active && Input.isTriggered('shift')) this.openPresent();
  };

  /** @returns {void} Press the selected statement. */
  Scene_VerdictCrossExam.prototype.onPress = function () {
    const st = VerdictCore.live();
    const s = this._testimony.currentStatement();
    if (!st || !s) { this._testimony.activate(); return; }
    const r = VerdictCore.Investigation.press(st, this._testimonyId, s.id);
    VerdictCore.persist();
    const extra = r.added ? ' The witness adds something.' : '';
    this._say.say('PRESSED', (r.text || 'They repeat themselves.') + extra, 'neutral');
    if (r.added) this._testimony.reload(this._testimony.index());
    this._header.refresh();
    this._testimony.activate();
  };

  /** @returns {void} Open the exhibit picker. */
  Scene_VerdictCrossExam.prototype.openPresent = function () {
    const st = VerdictCore.live();
    if (!st || !st.held.length) { this._say.say('NOTHING TO PRESENT', 'You are holding no exhibits.', 'bad'); return; }
    this._testimony.deactivate();
    this._present.reload(0);
    this._present.show();
    this._present.open();
    this._present.activate();
  };

  /** @returns {void} Close the picker without presenting. */
  Scene_VerdictCrossExam.prototype.onPresentCancel = function () {
    this._present.close();
    this._present.deactivate();
    this._testimony.activate();
  };

  /** @returns {void} Present the chosen exhibit against the selected statement. */
  Scene_VerdictCrossExam.prototype.onPresentOk = function () {
    const st = VerdictCore.live();
    const s = this._testimony.currentStatement();
    const id = this._present.currentId();
    this._present.close();
    this._present.deactivate();
    if (!st || !s || !id) { this._testimony.activate(); return; }

    const r = VerdictCore.applyResult(VerdictCore.Investigation.present(st, this._testimonyId, s.id, id));
    this.reportVerdict(r, s);
    this._testimony.reload(this._testimony.index());
    this._header.refresh();
    this._testimony.activate();
  };

  /**
   * Turn an engine result into words and a stamp.
   * @param {object} r Result from `Investigation.present`.
   * @param {object} s The statement it was presented against.
   * @returns {void}
   */
  Scene_VerdictCrossExam.prototype.reportVerdict = function (r, s) {
    const row = this._testimony.index();
    if (r.kind === 'break') {
      this._say.say('CONTRADICTION', r.text || `That statement cannot survive ${VerdictSkin.humanise(r.factId).toLowerCase()}.`, 'good');
      this._testimony.slam(row, 'CONTRADICTION');
    } else if (r.kind === 'near') {
      // The result that no other plugin models. Naming the line it DOES
      // contradict is the difference between a hint and a shrug.
      const other = this._testimony._rows.findIndex((x) => x.id === r.statementId);
      this._say.say('CLOSE', `That evidence matters here — but not against this line. Look again at statement ${other + 1}.`, 'near');
    } else if (r.kind === 'already') {
      this._say.say('ALREADY BROKEN', 'You have already taken that line apart.', 'neutral');
    } else {
      this._say.say('IRRELEVANT', 'That has nothing to do with what they said. Your credibility suffers.', 'bad');
      this._testimony.slam(row, 'REJECTED');
    }
    if (r.collapsed) this._say.say('CREDIBILITY GONE', 'The court will not hear you again today.', 'bad');
  };

  /* ------------------------------------------------------------ Scene: Board */

  /**
   * The corkboard.
   * @class
   */
  function Scene_VerdictBoard() { this.initialize.apply(this, arguments); }
  Scene_VerdictBoard.prototype = Object.create(Scene_VerdictBase.prototype);
  Scene_VerdictBoard.prototype.constructor = Scene_VerdictBoard;

  /** @returns {void} Build the scene. */
  Scene_VerdictBoard.prototype.create = function () {
    Scene_VerdictBase.prototype.create.call(this);
    const W = Graphics.boxWidth;
    const H = Graphics.boxHeight;

    this._board = new Window_VerdictBoard(new Rectangle(8, 8, W - 16, H - 110));
    this.addWindow(this._board);

    this._say = new Window_VerdictSay(new Rectangle(8, H - 98, W - 16, 90));
    this.addWindow(this._say);
    this._say.say('', 'Pick a card, then pick a second. If they mean something together, the string stays.', 'neutral');

    VerdictSkin.deal(this._board, 0);
    VerdictSkin.deal(this._say, 5);
  };

  /** @returns {void} Per-frame input handling. Not a Window_Selectable, so the scene drives it. */
  Scene_VerdictBoard.prototype.update = function () {
    Scene_VerdictBase.prototype.update.call(this);
    const n = this._board.nodeCount();
    if (!n) return;
    if (Input.isRepeated('down')) this._board.select(this._board.index() + 1);
    else if (Input.isRepeated('up')) this._board.select(this._board.index() - 1);
    else if (Input.isRepeated('right') || Input.isRepeated('left')) {
      // Left and right jump between the two columns rather than stepping, which
      // is what the layout actually means.
      this._board.select(this._board.index() + Math.ceil(n / 2));
    } else if (Input.isTriggered('ok')) this.onOk();
    else if (Input.isTriggered('cancel')) this.onCancel();
  };

  /** @returns {void} Pick, or complete a link. */
  Scene_VerdictBoard.prototype.onOk = function () {
    const st = VerdictCore.live();
    if (!st) return;
    const held = this._board.pickedKey();
    const here = this._board.currentKey();
    if (!held) {
      this._board.pick();
      this._say.say('HOLDING', 'Now choose what it connects to.', 'neutral');
      return;
    }
    if (held === here) { this._board.unpick(); this._say.say('', 'Dropped.', 'neutral'); return; }

    const r = VerdictCore.Investigation.link(st, held, here);
    VerdictCore.persist();
    this._board.unpick();
    if (r.kind === 'insight') {
      this._board.rebuild();
      this._board.drawNew(r.ruleId);
      this._say.say('CONNECTION', r.conclusion, 'good');
    } else if (r.kind === 'known') {
      this._say.say('ALREADY PINNED', r.conclusion, 'neutral');
    } else {
      this._say.say('NOTHING THERE', 'Those two do not say anything to each other.', 'near');
    }
  };

  /** @returns {void} Drop the held card, or leave. */
  Scene_VerdictBoard.prototype.onCancel = function () {
    if (this._board.pickedKey()) {
      this._board.unpick();
      this._say.say('', 'Dropped.', 'neutral');
    } else {
      SoundManager.playCancel();
      this.popScene();
    }
  };

  //===========================================================================
  // Adoption — deferred to boot, never at load time
  //===========================================================================
  //
  // Plugin load order is the buyer's choice. A theme that checks `typeof
  // VerdictSkin` at load time is a coin flip, and when it loses it no-ops in
  // silence and the product ships looking like stock RPG Maker with no error
  // anywhere. That has happened to this catalogue before.
  //
  // Only classes defined in THIS file are skinned. Window_Help, Window_Gold and
  // friends appear all over a buyer's project; theming them on the prototype
  // would restyle someone's whole game from installing an investigation plugin.

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    for (const k of [Window_VerdictHeader, Window_VerdictExhibits, Window_VerdictDossier,
      Window_VerdictTestimony, Window_VerdictPresent, Window_VerdictSay, Window_VerdictBoard,
      Window_VerdictAccusation, Window_VerdictOptions]) {
      VerdictSkin.adopt(k);
    }
  };

  /* ------------------------------------------------------ Scene: the accusation */

  /**
   * The deduction. A sentence with blanks in it, and a stamp at the end of it.
   *
   * The scene the whole engine has been building toward: everything the player
   * established in the Case File, broke in the Cross-Examination and connected on
   * the Board exists so that this sentence can be completed correctly.
   * @class
   */
  function Scene_VerdictDeduction() { this.initialize.apply(this, arguments); }
  Scene_VerdictDeduction.prototype = Object.create(Scene_VerdictBase.prototype);
  Scene_VerdictDeduction.prototype.constructor = Scene_VerdictDeduction;

  /**
   * @param {string} deductionId Deduction to argue.
   * @returns {void}
   */
  Scene_VerdictDeduction.prototype.prepare = function (deductionId) { this._deductionId = deductionId; };

  /** @returns {void} Build the scene. */
  Scene_VerdictDeduction.prototype.create = function () {
    Scene_VerdictBase.prototype.create.call(this);
    const W = Graphics.boxWidth;
    const H = Graphics.boxHeight;
    const st = VerdictCore.live();
    const d = st && this._deductionId ? VerdictCore.CaseFile.deduction(st.def, this._deductionId) : null;

    this._header = new Window_VerdictHeader(new Rectangle(16, 12, W - 32, 84));
    this.addWindow(this._header);
    this._header.setHeading('The Deduction', d ? 'Fill every blank, then commit to it' : 'No deduction open');

    const sheetH = Math.floor((H - 210) * 0.58) + 96;
    this._sheet = new Window_VerdictAccusation(new Rectangle(16, 104, W - 32, sheetH));
    this.addWindow(this._sheet);
    this._sheet.setDeduction(this._deductionId);

    const shelfY = 104 + sheetH + 10;
    this._options = new Window_VerdictOptions(new Rectangle(16, shelfY, W - 32, H - shelfY - 116));
    this.addWindow(this._options);
    this._options.setHandler('ok', this.onPick.bind(this));
    this._options.setHandler('cancel', this.onPickCancel.bind(this));
    this._options.setSlot(this._deductionId, 0);
    this._options.deactivate();

    this._say = new Window_VerdictSay(new Rectangle(16, H - 102, W - 32, 90));
    this.addWindow(this._say);
    this.prompt();

    // The sheet is not a Window_Selectable, so the scene drives its keys. Its
    // handlers still go through Window_Base's own active flag so that MZ's
    // cancel sound and scene-pop behave exactly as a player expects.
    this._sheet.activate();

    VerdictSkin.deal(this._header, 0);
    VerdictSkin.deal(this._sheet, 3);
    VerdictSkin.deal(this._options, 7);
    VerdictSkin.deal(this._say, 10);
  };

  /** @returns {void} Say what the player can do from here. */
  Scene_VerdictDeduction.prototype.prompt = function () {
    if (!this._sheet.deduction()) {
      this._say.say('', 'No deduction is open. Use the Open Deduction plugin command.', 'neutral');
      return;
    }
    if (this._sheet.complete()) {
      this._say.say('READY', 'Every blank is filled. Shift commits to the accusation — and a wrong one costs you.', 'near');
    } else {
      this._say.say('', '← → choose a blank.  OK fills it from the evidence.  Shift commits.', 'neutral');
    }
  };

  /** @returns {void} Per-frame: the sheet's own key handling. */
  Scene_VerdictDeduction.prototype.update = function () {
    Scene_VerdictBase.prototype.update.call(this);
    if (!this._sheet.active) return;
    if (Input.isRepeated('right')) {
      SoundManager.playCursor();
      this._sheet.shiftSlot(1);
    } else if (Input.isRepeated('left')) {
      SoundManager.playCursor();
      this._sheet.shiftSlot(-1);
    } else if (Input.isTriggered('shift')) {
      this.onSubmit();
    } else if (Input.isTriggered('ok')) {
      this.openOptions();
    } else if (Input.isTriggered('cancel')) {
      SoundManager.playCancel();
      this.popScene();
    }
  };

  /** @returns {void} Open the option shelf for the selected blank. */
  Scene_VerdictDeduction.prototype.openOptions = function () {
    if (!this._sheet.deduction()) return;
    SoundManager.playOk();
    this._sheet.deactivate();
    this._options.setSlot(this._deductionId, this._sheet.slot());
    this._options.activate();
  };

  /** @returns {void} Leave the shelf without choosing. */
  Scene_VerdictDeduction.prototype.onPickCancel = function () {
    this._options.deactivate();
    this._sheet.activate();
    this.prompt();
  };

  /** @returns {void} Write the chosen fact into the selected blank. */
  Scene_VerdictDeduction.prototype.onPick = function () {
    const st = VerdictCore.live();
    const fact = this._options.currentFact();
    const slot = this._sheet.slot();
    this._options.deactivate();
    this._sheet.activate();
    if (!st || !fact) { this.prompt(); return; }

    VerdictCore.Investigation.answer(st, this._deductionId, slot, fact);
    VerdictCore.persist();
    this._sheet.inked(slot);

    // Move to the next EMPTY blank rather than the next one. Walking onto a
    // blank that is already filled is the small friction that makes a form feel
    // like a form.
    const d = this._sheet.deduction();
    for (let i = 1; i <= d.slots.length; i++) {
      const probe = (slot + i) % d.slots.length;
      if (!this._sheet.answerAt(probe)) { this._sheet._slot = probe; this._sheet.refresh(); break; }
    }
    this.prompt();
  };

  /** @returns {void} Commit to the accusation. */
  Scene_VerdictDeduction.prototype.onSubmit = function () {
    const st = VerdictCore.live();
    if (!st || !this._sheet.deduction()) return;

    const r = VerdictCore.applyResult(
      VerdictCore.Investigation.submit(st, this._deductionId));

    if (r.kind === 'incomplete') {
      SoundManager.playBuzzer();
      this._say.say('NOT YET', 'You have left a blank. An accusation with a hole in it is not an accusation.', 'bad');
      return;
    }
    if (r.kind === 'wrong') {
      SoundManager.playBuzzer();
      // Naming HOW MANY blanks were wrong without naming WHICH would be a shrug;
      // marking them on the sheet is the whole feedback loop of the genre.
      this._sheet.slam('OVERRULED', r.wrongSlots);
      const n = r.wrongSlots.length;
      this._say.say('OVERRULED',
        // Agreement matters: the plural branch reads "N parts ... do not", never "does not".
        `${n === 1 ? 'One part of that does' : `${n} parts of that do`} not follow from what you have proved. The struck lines are the ones that failed.`,
        'bad');
      if (r.collapsed) this._say.say('CREDIBILITY GONE', 'The court will not hear you again today.', 'bad');
      this._header.refresh();
      return;
    }

    SoundManager.playOk();
    this._sheet.slam('CASE MADE', null);
    this._say.say('CASE MADE', r.facts.length
      ? `It holds. ${VerdictSkin.humanise(r.facts[0])} is now on the record.`
      : 'It holds. Every line follows from something you proved.', 'good');
    this._header.refresh();
    this._options.refresh();
  };

  //===========================================================================
  // Scene commands are NOT registered here — and that is the fix, not an omission
  //===========================================================================
  //
  // They used to be, under the name 'VerdictCaseFile', and all four were dead.
  // MZ keys a plugin command as `<declaring file>:<command>`, and the scene
  // commands are declared in VerdictCore.js's @command block, so the editor
  // writes "VerdictCore" into the event and the runtime looks up
  // `VerdictCore:openCaseFile`. `PluginManager.callCommand` has no else branch,
  // so the mismatch was four dropdown entries that did nothing at all, silently.
  //
  // VerdictCore.js registers them and resolves the scene class off `window` at
  // CALL time, which is what lets the logic plugin own the command while this
  // file owns the drawing. The scene exports at the bottom of this file are what
  // makes that lookup work — they are load-bearing, not convenience.

  //===========================================================================
  // Exports
  //===========================================================================

  window.VerdictSkin = VerdictSkin;
  window.Window_VerdictHeader = Window_VerdictHeader;
  window.Window_VerdictExhibits = Window_VerdictExhibits;
  window.Window_VerdictDossier = Window_VerdictDossier;
  window.Window_VerdictTestimony = Window_VerdictTestimony;
  window.Window_VerdictPresent = Window_VerdictPresent;
  window.Window_VerdictSay = Window_VerdictSay;
  window.Window_VerdictBoard = Window_VerdictBoard;
  window.Window_VerdictAccusation = Window_VerdictAccusation;
  window.Window_VerdictOptions = Window_VerdictOptions;
  window.Scene_VerdictCaseFile = Scene_VerdictCaseFile;
  window.Scene_VerdictCrossExam = Scene_VerdictCrossExam;
  window.Scene_VerdictBoard = Scene_VerdictBoard;
  // Load-bearing, not convenience: VerdictCore.js resolves these off `window` at
  // command time, which is what lets the logic plugin own the plugin command
  // while this file owns the drawing.
  window.Scene_VerdictDeduction = Scene_VerdictDeduction;
})();
