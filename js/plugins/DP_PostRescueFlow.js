/*:
 * @target MZ
 * @plugindesc Dry Promise - post-rescue public hearing, Verdict Core, and ending flow.
 * @author OpenAI
 */
(() => {
  'use strict';

  const SW = {
    plaza:322, temple:323, hearingEntry:325,
    vc1Done:326, vc2Done:327, vc3Done:328, ismeneDone:329, agamemnonDone:330, finalDone:331,
    vote:332, endingA:333, endingB:334, endingC:335, epilogueDone:336, archive:337, archiveDone:338,
    vc1Active:339, vc2Active:340, vc3Active:341, finalActive:342,
    routeA:343, routeB:344, routeC:345, routeD:346, hearingVisible:347
  };
  const STAGE = {
    part1:{active:SW.vc1Active,done:SW.vc1Done},
    part2:{active:SW.vc2Active,done:SW.vc2Done},
    part3:{active:SW.vc3Active,done:SW.vc3Done},
    final:{active:SW.finalActive,done:SW.finalDone}
  };
  const on = id => !!($gameSwitches && $gameSwitches.value(id));
  const set = (id,v) => { if ($gameSwitches) $gameSwitches.setValue(id,!!v); };
  const POST_GAME_STAGES = ['part1','part2','part3'];
  const isPostGameStage = stage => POST_GAME_STAGES.includes(stage);

  function markRoute(key) {
    [SW.routeA,SW.routeB,SW.routeC,SW.routeD].forEach(id=>set(id,false));
    const map={A:SW.routeA,B:SW.routeB,C:SW.routeC,D:SW.routeD};
    if (map[key]) set(map[key],true);
    [186,187,188,189,190,191,192,198,205,238,263,314,321].forEach(id=>set(id,false));
    if ($gameSystem) $gameSystem._dpPostRescueRoute=key;
    return key;
  }
  function routeKey() {
    if (on(SW.routeA)) return 'A';
    if (on(SW.routeB)) return 'B';
    if (on(SW.routeC)) return 'C';
    if (on(SW.routeD)) return 'D';
    if ($gameSystem && /^[ABCD]$/.test($gameSystem._dpPostRescueRoute||'')) return $gameSystem._dpPostRescueRoute;
    if (on(292)) return 'D';
    if (on(291)) return 'B';
    if (on(290)) return on(222)?'A':'C';
    return 'B';
  }
  function routeWitness() {
    const r=routeKey();
    if (r==='A') return {
      witness:{id:'pan_witness',name:'판의 목격',kind:'증언',summary:'병사들이 두 사람을 창고로 데려감',detail:'판은 병사들이 안티고네와 이스메네를 시청 뒤 창고로 데려가는 장면을 직접 봤다.',facts:['escort_seen']},
      confirm:{id:'bia_lock',name:'비아의 현장 확인',kind:'현장',summary:'창고 밖 잠금 상태 확인',detail:'비아는 창고 바깥에서 잠금장치와 출입 제한 상태를 직접 확인했다.',facts:['outside_lock']},
      target:'안티고네와 이스메네'
    };
    if (r==='C') return {
      witness:{id:'pan_witness',name:'판의 목격',kind:'증언',summary:'병사들이 안티고네를 창고로 데려감',detail:'판은 병사들이 안티고네를 시청 뒤 창고로 데려가는 장면을 직접 봤다.',facts:['escort_seen']},
      confirm:{id:'bia_lock',name:'비아의 현장 확인',kind:'현장',summary:'창고 밖 잠금 상태 확인',detail:'비아는 안티고네가 있던 창고 바깥에서 잠금장치와 출입 제한 상태를 직접 확인했다.',facts:['outside_lock']},
      target:'안티고네'
    };
    if (r==='D') return {
      witness:{id:'echo_witness',name:'에코의 목격',kind:'증언',summary:'병사들이 안티고네를 창고로 데려감',detail:'에코는 병사들이 안티고네를 시청 뒤 창고로 데려가는 장면을 직접 봤다.',facts:['escort_seen']},
      confirm:{id:'ismene_rescue',name:'이스메네의 현장 확인',kind:'현장',summary:'혼자 나오기 어려운 상태 확인',detail:'이스메네는 구조 과정에서 안티고네가 스스로 나오기 어려운 상태였음을 직접 확인했다.',facts:['rescue_confirmed']},
      target:'안티고네'
    };
    return {
      witness:{id:'echo_witness',name:'에코의 목격',kind:'증언',summary:'병사들이 두 사람을 창고로 데려감',detail:'에코는 병사들이 안티고네와 이스메네를 시청 뒤 창고로 데려가는 장면을 직접 봤다.',facts:['escort_seen']},
      confirm:{id:'pheme_confirm',name:'페메의 현장 확인',kind:'현장',summary:'자유롭게 나오기 어려움 확인',detail:'페메는 창고 주변과 이동 경로를 확인해 두 사람이 자유롭게 나오기 어려운 상태였음을 확인했다.',facts:['route_confirmed']},
      target:'안티고네와 이스메네'
    };
  }

  function defs(stage) {
    if (stage==='part1') return {
      id:'dp_post_part1_v3', title:'공청회 1부 — 왜 아랫마을의 물이 줄었을까?',
      exhibits:[
        {id:'r17flow',name:'R-17 기록',kind:'기록',summary:'20/60 → 40/40\n전체 80통 그대로',detail:'R-17은 전체 물의 양보다 윗마을과 아랫마을에 나누는 양이 바뀌었는지 보여 주는 기록이다.',facts:['allocation_changed']},
        {id:'springflow',name:'첫샘 전체 물 기록',kind:'기록',summary:'최근 약 80통\n큰 감소 없음',detail:'첫샘 전체 물의 양이 갑자기 크게 줄었는지 확인할 때 보는 기록이다.',facts:['spring_stable']},
        {id:'taloscheck',name:'탈로스 점검표',kind:'점검',summary:'관·밸브·누수\n이상 없음',detail:'물길의 고장 여부를 확인할 때 쓰는 점검표다.',facts:['no_mechanical_fault']}
      ],
      links:[
        {id:'p1a',a:'exhibit:r17flow',b:'exhibit:springflow',conclusion:'전체 물이 줄어든 것은 아니다.\n같은 80통을 나누는 방법이 20과 60에서 40과 40으로 바뀌었다.',facts:['p1a']}
      ]
    };
    if (stage==='part2') return {
      id:'dp_post_part2_v3', title:'공청회 2부 — 같은 40통이면 정말 같은 조건일까?',
      exhibits:[
        {id:'usage',name:'마을별 물 사용표',kind:'자료',summary:'윗마을 40명 / 40통\n아랫마을 160명 / 40통',detail:'두 지역이 같은 40통을 받아도, 그 물을 나누어 쓰는 사람 수가 같은지는 이 자료로 확인한다.',facts:['population_difference']},
        {id:'r17order',name:'R-17 검토 기록',kind:'기록',summary:'사람 수 검토 없음\n시민회의 없음',detail:'R-17을 정하기 전에 사람 수와 필요를 살폈는지, 시민에게 먼저 물었는지 보여 주는 기록이다.',facts:['no_review','no_prior_hearing']},
        {id:'promise',name:'첫샘의 약속',kind:'원칙',summary:'중요한 정보는 알리고\n시민과 함께 정한다',detail:'공동 자원에 관한 큰 결정은 시민과 함께 정한다는 도시의 기본 약속이다.',facts:['shared_decision_principle']}
      ],
      links:[
        {id:'p2a',a:'exhibit:usage',b:'exhibit:r17order',conclusion:'두 마을 모두 40통을 받았다.\n하지만 사람 수는 40명과 160명으로 달랐고, 이 차이를 살펴본 기록은 없다.',facts:['p2a']}
      ]
    };
    if (stage==='part3') {
      const rw=routeWitness();
      return {
        id:'dp_post_part3_v3_'+routeKey().toLowerCase(), title:'공청회 3부 — 창고에서는 실제로 무슨 일이 있었을까?',
        exhibits:[
          rw.witness,
          {id:'confinement',name:'테미스 확인표',kind:'기록',summary:'발표 전까지 대기 · 경비\n잠금 이유·허락 없음',detail:rw.target+'에게 발표 전까지 기다리게 하고 경비를 두었다는 기록은 있다. 그러나 문을 잠근 이유와 허락은 적혀 있지 않다.',facts:['wait_order','guard_assigned','lock_reason_missing']},
          rw.confirm
        ],
        links:[
          {id:'p3a',a:'exhibit:confinement',b:'exhibit:'+rw.confirm.id,conclusion:'기록에는 창고에서 기다리게 하고 경비를 세웠다고 적혀 있다.\n현장에서는 스스로 나오기 어려운 상태가 확인됐다.\n다만 문을 잠근 이유와 허락은 기록에 없다.',facts:['p3a']}
        ]
      };
    }
    return {
      id:'dp_post_final_optional_v3', title:'공청회 정리',
      exhibits:[
        {id:'summary',name:'확인된 사실',kind:'정리',summary:'물 배분 변경\n같은 40통의 한계\n창고 출입 제한 확인',detail:'청문회에서 확인된 핵심 사실을 정리한 카드다.',facts:['summary']},
        {id:'answer',name:'아가멤논의 설명',kind:'설명',summary:'40/40이 공평하다고 판단\n시민에게 묻는 과정 생략 인정',detail:'아가멤논이 시민 앞에서 직접 밝힌 설명이다.',facts:['answer']}
      ],
      links:[
        {id:'f1',a:'exhibit:summary',b:'exhibit:answer',conclusion:'확인된 사실과 대표자의 설명이 한자리에 정리되었다.',facts:['f1']}
      ]
    };
  }

  function openVerdict(stage) {
    if (!STAGE[stage]) return;
    if (typeof VerdictCore==='undefined' || typeof window.Scene_VerdictBoard!=='function') {
      throw new Error('Dry Promise: Verdict Core 또는 VerdictCaseFile이 활성화되어 있지 않습니다.');
    }
    const raw=defs(stage);
    const same=!!($gameSystem._verdict && $gameSystem._verdict.caseId===raw.id);
    if (!same) {
      $gameSystem._verdict=null;
      $gameSystem._verdictState=null;
    }
    const def=VerdictCore.setDefinition(raw);
    let st=VerdictCore.live();
    if (!same || !st || st.caseId!==def.id) {
      st=VerdictCore.Investigation.start(def,{credibility:5,wrongPenalty:0,nearPenalty:0,breakReward:0,seed:20260907});
      $gameSystem._verdictState=st;
      for (const e of def.exhibits) VerdictCore.Investigation.give(st,e.id);
      VerdictCore.persist();
    }
    $gameTemp._dpPostVerdictStage=stage;
    SceneManager.push(window.Scene_VerdictBoard);
  }
  function completeStage(stage) {
    const s=STAGE[stage]; if(!s) return;
    set(s.active,false); set(s.done,true);
  }
  function endingScore() {
    return (on(229)?1:0)+(on(230)?1:0)+(on(231)?1:0);
  }
  function applyEndingBranch() {
    [SW.endingA,SW.endingB,SW.endingC].forEach(id=>set(id,false));
    const score=endingScore();
    let code=3;
    let result='C';
    if (score<=1) { set(SW.endingA,true); code=1; result='A'; }
    else if (score===2) { set(SW.endingB,true); code=2; result='B'; }
    else { set(SW.endingC,true); code=3; result='C'; }
    if ($gameVariables) {
      $gameVariables.setValue(44, score);
      $gameVariables.setValue(45, code);
    }
    return result;
  }
  function revealEvent(id,name,index,x,y,dir) {
    const e=$gameMap && $gameMap.event(id); if(!e) return;
    e.locate(x,y); e.setImage(name,index); e.setDirection(dir||2); e.setThrough(true); e.setTransparent(false);
  }
  function hideEvent(id) {
    const e=$gameMap && $gameMap.event(id); if(!e) return;
    e.setTransparent(true); e.setImage('',0); e.setThrough(true);
  }
  function hidePlayer() {
    if (!$gamePlayer) return;
    $gamePlayer.setThrough(true); $gamePlayer.setTransparent(true); $gamePlayer.followers().hide();
  }
  function showPlayer() {
    if (!$gamePlayer) return;
    $gamePlayer.setTransparent(false); $gamePlayer.setThrough(false); $gamePlayer.followers().hide();
  }

  const POST_STAGE_META = {
    part1:{progress:'1 / 3',question:'왜 아랫마을의 물이 줄었을까?',guide:'이번 질문에 꼭 필요한 자료 두 개를 연결하세요.'},
    part2:{progress:'2 / 3',question:'같은 40통이면 정말 같은 조건일까?',guide:'사람 수와 검토 여부를 보여 주는 두 자료를 찾으세요.'},
    part3:{progress:'3 / 3',question:'창고에서는 실제로 무슨 일이 있었을까?',guide:'기록에 적힌 것과 현장에서 확인된 것을 비교해 보세요.'},
    final:{progress:'정리',question:'청문회 정리',guide:'확인된 사실을 정리합니다.'}
  };
  const POST_STAGE_COMPLETE = {
    part1:'물이 부족해진 것이 아니라, 나누는 방법이 바뀐 것이었습니다.\n확인 키를 누르면 계속합니다.',
    part2:'같은 40통이라도 나눠 쓰는 사람 수가 다르면 같은 조건이 아닙니다.\n확인 키를 누르면 계속합니다.',
    part3:'기록에 적힌 대기 지시, 스스로 나오기 어려웠던 상태, 그리고 기록에 없는 잠금 이유까지 확인했습니다.\n확인 키를 누르면 계속합니다.',
    final:'정리가 끝났습니다. 확인 키를 누르면 계속합니다.'
  };

  function pairKey(a,b) {
    return [String(a||''), String(b||'')].sort().join('|');
  }
  function postStageWrongMessage(stage, a, b, wrongCount) {
    const key = pairKey(a,b);
    const first = Math.min(3, Math.max(1, wrongCount||1));
    if (stage==='part1') {
      if (key===pairKey('exhibit:r17flow','exhibit:taloscheck')) {
        return first === 1
          ? '이 두 자료는 나누는 방법이 바뀐 것과 시설에 고장이 없다는 것을 보여 줍니다.\n하지만 전체 물의 양이 줄었는지는 알 수 없습니다.'
          : '「첫샘 전체 물 기록」을 넣어 보세요. 전체 물의 양부터 확인해야 합니다.';
      }
      if (key===pairKey('exhibit:springflow','exhibit:taloscheck')) {
        return first === 1
          ? '이 두 자료는 전체 물의 양과 고장 여부를 보여 줍니다.\n하지만 물을 나누는 방법이 바뀌었는지는 알 수 없습니다.'
          : '「R-17 기록」을 넣어 보세요. 나누는 방법이 어떻게 바뀌었는지 봐야 합니다.';
      }
      return first === 1
        ? '전체 물의 양과 나누는 방법, 두 가지를 함께 보여 주는 자료를 찾아보세요.'
        : '「R-17 기록」과 「첫샘 전체 물 기록」을 연결해 보세요.';
    }
    if (stage==='part2') {
      if (key===pairKey('exhibit:usage','exhibit:promise')) {
        return first === 1
          ? '이 두 자료는 사람 수 차이와 첫샘의 약속을 보여 줍니다.\n하지만 그 차이를 결정 전에 살펴봤는지는 알 수 없습니다.'
          : '「R-17 검토 기록」을 넣어 보세요. 사람 수를 살펴봤는지 확인해야 합니다.';
      }
      if (key===pairKey('exhibit:r17order','exhibit:promise')) {
        return first === 1
          ? '이 두 자료는 검토 기록과 첫샘의 약속을 보여 줍니다.\n하지만 두 마을의 사람 수가 얼마나 다른지는 알 수 없습니다.'
          : '「마을별 물 사용표」를 넣어 보세요. 사람 수 차이부터 확인해야 합니다.';
      }
      return first === 1
        ? '같은 40통을 몇 명이 나눠 쓰는지, 그리고 그 차이를 살펴봤는지가 핵심입니다.'
        : '「마을별 물 사용표」와 「R-17 검토 기록」을 다시 확인해 보세요.';
    }
    if (stage==='part3') {
      if (key===pairKey('exhibit:'+routeWitness().witness.id,'exhibit:confinement')) {
        return first === 1
          ? '이 두 자료는 창고로 데려간 장면과 기록에 적힌 조치를 보여 줍니다.\n하지만 실제로 나올 수 있었는지는 알 수 없습니다.'
          : '「현장 확인」 자료를 넣어 보세요.';
      }
      if (key===pairKey('exhibit:'+routeWitness().witness.id,'exhibit:'+routeWitness().confirm.id)) {
        return first === 1
          ? '이 두 자료는 목격한 장면과 현장 상태를 보여 줍니다.\n하지만 기록에 무엇이 적혀 있었는지는 알 수 없습니다.'
          : '가운데를 이어 주는 「테미스 확인표」를 넣어 보세요.';
      }
      return first === 1
        ? '기록에 적힌 것과 현장에서 확인된 것을 함께 보는 것이 핵심입니다.'
        : '「테미스 확인표」와 「현장 확인」 자료를 다시 보세요.';
    }
    return '이 두 자료는 지금 질문에 직접 답해 주지 않습니다. 다른 조합을 시도해 보세요.';
  }

  // ---------------------------------------------------------------------------
  // Dedicated hearing UI. We still use VerdictCore for the investigation/link
  // rules, but do not force the generic corkboard scene to carry a classroom-
  // readability layout it was never designed for.
  // ---------------------------------------------------------------------------

  function hearingStage() {
    return $gameTemp && $gameTemp._dpPostVerdictStage;
  }
  function hearingMeta(stage) {
    return POST_STAGE_META[stage] || POST_STAGE_META.part1;
  }
  function mainFont() {
    return ($gameSystem && $gameSystem.mainFontFace) ? $gameSystem.mainFontFace() : 'sans-serif';
  }
  function hearingBodyFont() {
    return '"Malgun Gothic", "Noto Sans KR", sans-serif';
  }
  function useHearingBodyFont(win, size) {
    win.contents.fontFace = hearingBodyFont();
    win.contents.fontBold = false;
    win.contents.fontSize = size;
    win.contents.outlineWidth = 0;
  }
  function useHearingSectionFont(win, size) {
    win.contents.fontFace = hearingBodyFont();
    win.contents.fontBold = false;
    win.contents.fontSize = size;
    win.contents.outlineWidth = 1;
  }

  function drawWrapped(win, text, x, y, width, lineHeight, maxLines) {
    const source = String(text || '').replace(/\r/g, '').split('\n');
    const lines = [];
    for (const raw of source) {
      if (!raw) { lines.push(''); continue; }
      let line = '';
      for (const ch of raw) {
        const probe = line + ch;
        if (win.textWidth(probe) > width && line) {
          lines.push(line);
          line = ch;
        } else {
          line = probe;
        }
      }
      if (line) lines.push(line);
    }
    const count = Math.min(lines.length, maxLines || lines.length);
    for (let i = 0; i < count; i++) win.drawText(lines[i], x, y + i * lineHeight, width, 'left');
    return count;
  }

  function Window_DPHearingHeader() { this.initialize.apply(this, arguments); }
  Window_DPHearingHeader.prototype = Object.create(Window_Base.prototype);
  Window_DPHearingHeader.prototype.constructor = Window_DPHearingHeader;
  Window_DPHearingHeader.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 255;
    this.backOpacity = 255;
    this.refresh();
  };
  Window_DPHearingHeader.prototype.refresh = function() {
    this.contents.clear();
    const meta = hearingMeta(hearingStage());

    // 메인 질문만 강하게
    this.contents.fontFace = mainFont();
    this.contents.fontBold = true;
    this.contents.fontSize = 30;
    this.contents.outlineWidth = 2;
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(meta.question, 8, 2, this.innerWidth - 150, 'left');

    // 진행도는 굵게 하지 않음
    useHearingSectionFont(this, 22);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(meta.progress, this.innerWidth - 130, 4, 120, 'right');

    // 보조 설명
    useHearingBodyFont(this, 19);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(meta.guide, 8, 48, this.innerWidth - 16, 'left');

    this.resetTextColor();
    this.contents.outlineWidth = 3;
  };

  function Window_DPHearingCards() { this.initialize.apply(this, arguments); }
  Window_DPHearingCards.prototype = Object.create(Window_Selectable.prototype);
  Window_DPHearingCards.prototype.constructor = Window_DPHearingCards;
  Window_DPHearingCards.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.padding = 8;
    this._ids = [];
    this._pickedIndex = -1;
    this.createContents();
    this.refreshData();
    this.select(0);
    this.activate();
  };
  Window_DPHearingCards.prototype.maxItems = function() { return this._ids.length; };
  Window_DPHearingCards.prototype.itemHeight = function() { return 162; };
  Window_DPHearingCards.prototype.maxCols = function() { return 1; };
  Window_DPHearingCards.prototype.currentId = function() { return this._ids[this.index()] || null; };
  Window_DPHearingCards.prototype.pickedId = function() { return this._ids[this._pickedIndex] || null; };
  Window_DPHearingCards.prototype.pickCurrent = function() { this._pickedIndex = this.index(); this.refresh(); };
  Window_DPHearingCards.prototype.clearPick = function() { this._pickedIndex = -1; this.refresh(); };
  Window_DPHearingCards.prototype.refreshData = function() {
    const st = VerdictCore.live();
    this._ids = st ? st.held.slice(0, 3) : [];
    this.refresh();
  };
  Window_DPHearingCards.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
    if (this._detailWindow) this._detailWindow.setExhibit(this.currentId());
  };
  Window_DPHearingCards.prototype.setDetailWindow = function(win) {
    this._detailWindow = win;
    this.callUpdateHelp();
  };
  Window_DPHearingCards.prototype.drawItem = function(index) {
    const st = VerdictCore.live();
    if (!st) return;
    const id = this._ids[index];
    const e = VerdictCore.CaseFile.exhibit(st.def, id);
    if (!e) return;
    const rect = this.itemRect(index);
    const picked = index === this._pickedIndex;
    const x = rect.x + 14;
    const y = rect.y + 2;
    const w = rect.width - 28;
    const h = rect.height - 12;
    const bg = picked ? 'rgba(243,226,185,0.98)' : 'rgba(250,244,229,0.96)';
    this.contents.fillRect(x, y, w, h, bg);
    this.contents.strokeRect(x, y, w, h, picked ? '#b74635' : '#8a7659');
    if (picked) this.contents.strokeRect(x + 3, y + 3, w - 6, h - 6, '#b74635');

    useHearingBodyFont(this, 16);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(e.kind || '자료', x + 14, y + 10, w - 28, 'left');

    useHearingBodyFont(this, 27);
    this.changeTextColor('#2b2118');
    this.drawText(e.name || '', x + 14, y + 38, w - 28, 'left');

    useHearingBodyFont(this, 20);
    this.changeTextColor('#5b4935');
    drawWrapped(this, e.summary || '', x + 14, y + 78, w - 28, 26, 2);

    this.resetTextColor();
    this.contents.outlineWidth = 3;
  };


  const HEARING_PREVIEWS = {
    part1:{
      r17flow:{picture:'KakaoTalk_20260830_200409139_01', label:'R-17 기록 원본'},
      springflow:{type:'water', label:'첫샘 전체 물 기록'},
      taloscheck:{type:'check', label:'탈로스 점검표'}
    },
    part2:{
      usage:{picture:'CG_water_use_table_antigone_ismene', label:'마을별 물 사용표'},
      r17order:{picture:'KakaoTalk_20260830_200409139_01', label:'R-17 기록 원본'},
      promise:{picture:'CG_firstspring_principles', label:'첫샘의 약속'}
    },
    part3:{
      confinement:{picture:'PR_ConfinementCert', label:'테미스 확인표'},
      pan_witness:{type:'testimony', label:'판의 증언'},
      echo_witness:{type:'testimony', label:'에코의 증언'},
      bia_lock:{type:'field', label:'비아의 현장 확인'},
      pheme_confirm:{type:'field', label:'페메의 현장 확인'},
      ismene_rescue:{type:'field', label:'이스메네의 현장 확인'}
    }
  };

  function hearingPreviewSpec(id) {
    const stage = hearingStage();
    const group = HEARING_PREVIEWS[stage] || {};
    return group[id] || {type:'document', label:'자료 미리보기'};
  }

  function drawPreviewPlaceholder(win, spec, e, x, y, w, h) {
    win.contents.fillRect(x, y, w, h, 'rgba(248,241,222,0.98)');
    win.contents.strokeRect(x, y, w, h, '#8a7659');
    win.contents.fillRect(x, y, w, 4, '#8a7659');

    win.contents.fontFace = mainFont();
    win.contents.fontBold = true;
    win.contents.fontSize = 18;
    win.changeTextColor(ColorManager.systemColor());
    win.drawText(spec.label || '자료 미리보기', x + 12, y + 8, w - 24, 'center');

    if (spec.type === 'water') {
      win.contents.fontBold = true;
      win.contents.fontSize = 54;
      win.changeTextColor('#2b2118');
      win.drawText('약 80통', x + 12, y + 54, w - 24, 'center');
      win.contents.fontBold = false;
      win.contents.fontSize = 24;
      win.changeTextColor('#5b4935');
      win.drawText('R-17 전후 큰 감소 없음', x + 12, y + 122, w - 24, 'center');
      win.contents.fillRect(x + 34, y + 172, w - 68, 14, 'rgba(69,103,132,0.25)');
      win.contents.fillRect(x + 34, y + 172, Math.floor((w - 68) * 0.82), 14, 'rgba(69,103,132,0.85)');
    } else if (spec.type === 'check') {
      win.contents.fontBold = false;
      win.contents.fontSize = 27;
      win.changeTextColor('#2b2118');
      win.drawText('✓ 관 파손 없음', x + 28, y + 58, w - 56, 'left');
      win.drawText('✓ 밸브 이상 없음', x + 28, y + 98, w - 56, 'left');
      win.drawText('✓ 누수 없음', x + 28, y + 138, w - 56, 'left');
    } else if (spec.type === 'testimony') {
      win.contents.fontBold = true;
      win.contents.fontSize = 52;
      win.changeTextColor('#7a654b');
      win.drawText('“ ”', x + 12, y + 48, w - 24, 'center');
      win.contents.fontSize = 28;
      win.changeTextColor('#2b2118');
      win.drawText(e ? e.name : '목격 증언', x + 12, y + 112, w - 24, 'center');
      win.contents.fontBold = false;
      win.contents.fontSize = 19;
      win.changeTextColor('#5b4935');
      win.drawText('직접 본 범위만 기록', x + 12, y + 154, w - 24, 'center');
    } else if (spec.type === 'field') {
      win.contents.fontBold = true;
      win.contents.fontSize = 32;
      win.changeTextColor('#2b2118');
      win.drawText('현장 확인', x + 12, y + 58, w - 24, 'center');
      win.contents.fontBold = false;
      win.contents.fontSize = 22;
      win.changeTextColor('#5b4935');
      drawWrapped(win, e ? e.summary : '', x + 24, y + 108, w - 48, 28, 3);
    } else {
      win.contents.fontBold = true;
      win.contents.fontSize = 30;
      win.changeTextColor('#2b2118');
      win.drawText(e ? e.name : '자료', x + 12, y + 70, w - 24, 'center');
      win.contents.fontBold = false;
      win.contents.fontSize = 21;
      win.changeTextColor('#5b4935');
      drawWrapped(win, e ? e.summary : '', x + 24, y + 118, w - 48, 27, 3);
    }
    win.resetTextColor();
  }

  function drawPreviewImage(win, name, label, x, y, w, h) {
    win.contents.fillRect(x, y, w, h, 'rgba(248,241,222,0.98)');
    win.contents.strokeRect(x, y, w, h, '#8a7659');

    const bmp = ImageManager.loadPicture(name);
    if (!bmp || !bmp.isReady()) {
      win.contents.fontFace = mainFont();
      win.contents.fontBold = false;
      win.contents.fontSize = 20;
      win.changeTextColor(ColorManager.systemColor());
      win.drawText('자료 그림 불러오는 중…', x + 12, y + Math.floor(h / 2) - 14, w - 24, 'center');
      win.resetTextColor();

      if (bmp && win._waitingPreviewName !== name) {
        win._waitingPreviewName = name;
        bmp.addLoadListener(() => {
          if (win._waitingPreviewName === name) {
            win._waitingPreviewName = '';
            win.refresh();
          }
        });
      }
      return;
    }

    const pad = 10;
    const availW = w - pad * 2;
    const availH = h - pad * 2 - 28;
    const scale = Math.min(availW / Math.max(1, bmp.width), availH / Math.max(1, bmp.height));
    const dw = Math.max(1, Math.floor(bmp.width * scale));
    const dh = Math.max(1, Math.floor(bmp.height * scale));
    const dx = x + Math.floor((w - dw) / 2);
    const dy = y + 8 + Math.floor((availH - dh) / 2);
    win.contents.blt(bmp, 0, 0, bmp.width, bmp.height, dx, dy, dw, dh);

    win.contents.fillRect(x, y + h - 28, w, 28, 'rgba(45,34,24,0.78)');
    win.contents.fontFace = mainFont();
    win.contents.fontBold = true;
    win.contents.fontSize = 17;
    win.changeTextColor('#ffffff');
    win.drawText(label || '자료 원본', x + 8, y + h - 28, w - 16, 'center');
    win.resetTextColor();
  }

  const HEARING_FOCUS = {
    part1:{
      title:'이번 질문에서 볼 것',
      lines:[
        '① 전체 물의 양이 정말 줄었을까?',
        '② 물을 나누는 방법이 바뀌었을까?'
      ],
      tip:'고른 두 자료가 이 두 가지를 하나씩 보여 주는지 확인하세요.'
    },
    part2:{
      title:'이번 질문에서 볼 것',
      lines:[
        '① 두 마을의 사람 수는 같을까?',
        '② 그 차이를 결정하기 전에 살펴봤을까?'
      ],
      tip:'숫자보다, 그 물을 몇 명이 나눠 쓰는지 확인하세요.'
    },
    part3:{
      title:'이번 질문에서 볼 것',
      lines:[
        '① 기록에는 무엇이 적혀 있을까?',
        '② 창고에서 실제로 나올 수 있었을까?'
      ],
      tip:'기록에 적힌 것과 현장에서 본 것을 따로 나누어 보세요.'
    }
  };

  function Window_DPHearingDetail() { this.initialize.apply(this, arguments); }
  Window_DPHearingDetail.prototype = Object.create(Window_Base.prototype);
  Window_DPHearingDetail.prototype.constructor = Window_DPHearingDetail;
  Window_DPHearingDetail.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._resultText = '';
    this.refresh();
  };
  // 카드 선택에 따라 오른쪽 내용이 바뀌지 않는다.
  // 오른쪽은 "선택 자료 확대"가 아니라 질문의 초점과 확인 결과를 계속 보여 준다.
  Window_DPHearingDetail.prototype.setExhibit = function(id) {};
  Window_DPHearingDetail.prototype.setResult = function(text) {
    this._resultText = String(text || '');
    this.refresh();
  };
  Window_DPHearingDetail.prototype.refresh = function() {
    this.contents.clear();
    const stage = hearingStage();
    const focus = HEARING_FOCUS[stage] || HEARING_FOCUS.part1;

    // 상단: 이번 질문의 초점
    useHearingSectionFont(this, 26);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(focus.title, 10, 4, this.innerWidth - 20, 'left');

    useHearingBodyFont(this, 21);
    this.changeTextColor(ColorManager.normalColor());
    let y = 54;
    for (const line of focus.lines) {
      drawWrapped(this, line, 14, y, this.innerWidth - 28, 27, 2);
      y += 48;
    }

    useHearingBodyFont(this, 18);
    this.changeTextColor('#6a5540');
    drawWrapped(this, focus.tip, 14, y + 2, this.innerWidth - 28, 23, 3);

    // 가운데 구분
    const dividerY = Math.floor(this.innerHeight * 0.44);
    this.contents.fillRect(10, dividerY, this.innerWidth - 20, 2, ColorManager.systemColor());

    // 하단: 확인 결과
    useHearingSectionFont(this, 25);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText('이번 단계에서 확인한 사실', 10, dividerY + 16, this.innerWidth - 20, 'left');

    if (this._resultText) {
      // 성공 후에는 결론을 큰 글씨로 강조
      const boxY = dividerY + 62;
      const boxH = this.innerHeight - boxY - 14;
      this.contents.fillRect(10, boxY, this.innerWidth - 20, boxH, 'rgba(250,244,229,0.72)');
      this.contents.strokeRect(10, boxY, this.innerWidth - 20, boxH, '#8a7659');

      useHearingBodyFont(this, 21);
      this.changeTextColor('#2b2118');
      drawWrapped(this, this._resultText, 24, boxY + 18, this.innerWidth - 48, 28, 7);
    } else {
      useHearingBodyFont(this, 20);
      this.changeTextColor(ColorManager.normalColor());
      drawWrapped(
        this,
        '아직 확인한 사실이 없습니다.\n왼쪽 자료 세 개 중에서 두 개를 골라 연결해 보세요.',
        14,
        dividerY + 68,
        this.innerWidth - 28,
        29,
        5
      );
    }
    this.resetTextColor();
    this.contents.outlineWidth = 3;
  };

  function Window_DPHearingGuide() { this.initialize.apply(this, arguments); }
  Window_DPHearingGuide.prototype = Object.create(Window_Base.prototype);
  Window_DPHearingGuide.prototype.constructor = Window_DPHearingGuide;
  Window_DPHearingGuide.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._label = '';
    this._text = '';
    this.refresh();
  };
  Window_DPHearingGuide.prototype.say = function(label, text) {
    this._label = String(label || '');
    this._text = String(text || '');
    this.refresh();
  };
  Window_DPHearingGuide.prototype.refresh = function() {
    this.contents.clear();

    useHearingSectionFont(this, 20);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(this._label, 8, 2, 180, 'left');

    useHearingBodyFont(this, 19);
    this.changeTextColor(ColorManager.normalColor());
    drawWrapped(this, this._text, 8, 34, this.innerWidth - 16, 28, 3);

    this.resetTextColor();
    this.contents.outlineWidth = 3;
  };

  function Scene_DPHearingVerdict() { this.initialize.apply(this, arguments); }
  Scene_DPHearingVerdict.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_DPHearingVerdict.prototype.constructor = Scene_DPHearingVerdict;
  Scene_DPHearingVerdict.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    const bmp = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
    if (window.VerdictSkin && window.VerdictSkin.cork) {
      const cork = window.VerdictSkin.cork(Graphics.boxWidth, Graphics.boxHeight);
      bmp.blt(cork, 0, 0, Graphics.boxWidth, Graphics.boxHeight, 0, 0);
    } else {
      bmp.fillRect(0, 0, Graphics.boxWidth, Graphics.boxHeight, '#4a3824');
    }
    this._backgroundSprite.bitmap = bmp;
    this.addChild(this._backgroundSprite);
  };
  Scene_DPHearingVerdict.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    const W = Graphics.boxWidth;
    const H = Graphics.boxHeight;
    const margin = 18;
    const headerH = 106;
    const guideH = 142;
    const bodyY = margin + headerH + 4;
    const bodyH = H - bodyY - guideH - margin - 4;
    const leftW = Math.min(650, Math.floor(W * 0.54));

    this._headerWindow = new Window_DPHearingHeader(new Rectangle(margin, margin, W - margin * 2, headerH));
    this.addWindow(this._headerWindow);

    this._cardsWindow = new Window_DPHearingCards(new Rectangle(margin, bodyY - 8, leftW, bodyH + 10));
    this._cardsWindow.setHandler('ok', this.onCardOk.bind(this));
    this._cardsWindow.setHandler('cancel', this.onCancel.bind(this));
    this.addWindow(this._cardsWindow);

    this._detailWindow = new Window_DPHearingDetail(new Rectangle(margin + leftW + 10, bodyY, W - margin * 2 - leftW - 10, bodyH));
    this.addWindow(this._detailWindow);
    this._cardsWindow.setDetailWindow(this._detailWindow);

    this._guideWindow = new Window_DPHearingGuide(new Rectangle(margin, H - guideH - margin, W - margin * 2, guideH));
    this.addWindow(this._guideWindow);
    this._guideWindow.say('조작 방법', '먼저 자료를 하나 고르세요.\n그다음, 지금 질문에 함께 답해 주는 자료를 하나 더 고르세요.');

    this._wrongCount = 0;
    this._complete = false;
    this._cardsWindow.activate();
  };
  Scene_DPHearingVerdict.prototype.onCardOk = function() {
    const stage = hearingStage();
    const st = VerdictCore.live();
    if (!stage || !st) return;
    if (this._complete) {
      if ($gameTemp) $gameTemp._dpPostVerdictStage = null;
      SoundManager.playOk();
      this.popScene();
      return;
    }
    const current = this._cardsWindow.currentId();
    const picked = this._cardsWindow.pickedId();
    if (!picked) {
      this._cardsWindow.pickCurrent();
      this._guideWindow.say('첫 번째 자료 선택', '이제 이 자료와 함께 봐야 할 자료를 하나 더 고르세요.');
      this._cardsWindow.activate();
      return;
    }
    if (picked === current) {
      this._cardsWindow.clearPick();
      this._guideWindow.say('선택 해제', '같은 자료끼리는 연결할 수 없습니다. 처음부터 다시 골라 보세요.');
      this._cardsWindow.activate();
      return;
    }
    const a = 'exhibit:' + picked;
    const b = 'exhibit:' + current;
    const r = VerdictCore.Investigation.link(st, a, b);
    VerdictCore.persist();
    this._cardsWindow.clearPick();
    if (r.kind === 'insight') {
      this._wrongCount = 0;
      this._detailWindow.setResult(r.conclusion);
      if (st.insights.length >= st.def.links.length) {
        completeStage(stage);
        this._complete = true;
        this._guideWindow.say('단계 완료', POST_STAGE_COMPLETE[stage] || '확인이 끝났습니다. 확인 키를 누르면 계속합니다.');
      } else {
        this._guideWindow.say('확인!', r.conclusion);
      }
      SoundManager.playOk();
    } else if (r.kind === 'known') {
      this._detailWindow.setResult(r.conclusion);
      this._guideWindow.say('이미 확인한 연결', '이 두 자료는 이미 연결해서 확인했습니다.');
    } else {
      this._wrongCount += 1;
      const why = postStageWrongMessage(stage, a, b, this._wrongCount);
      this._guideWindow.say('왜 아닐까?', why);
      SoundManager.playBuzzer();
    }
    this._cardsWindow.activate();
  };
  Scene_DPHearingVerdict.prototype.onCancel = function() {
    if (this._complete) {
      if ($gameTemp) $gameTemp._dpPostVerdictStage = null;
      SoundManager.playOk();
      this.popScene();
      return;
    }
    if (this._cardsWindow.pickedId()) {
      this._cardsWindow.clearPick();
      this._guideWindow.say('선택 해제', '선택을 취소했습니다. 처음부터 다시 골라 보세요.');
      this._cardsWindow.activate();
    } else {
      if ($gameTemp) $gameTemp._dpPostVerdictStage = null;
      SoundManager.playCancel();
      this.popScene();
    }
  };

  window.Scene_DPHearingVerdict = Scene_DPHearingVerdict;
  window.Window_DPHearingHeader = Window_DPHearingHeader;
  window.Window_DPHearingCards = Window_DPHearingCards;
  window.Window_DPHearingDetail = Window_DPHearingDetail;
  window.Window_DPHearingGuide = Window_DPHearingGuide;

  // Replace only the public-hearing board scene. VerdictCore remains the rules engine.
  const _openVerdictOriginal = openVerdict;
  openVerdict = function(stage) {
    if (!STAGE[stage]) return;
    if (typeof VerdictCore === 'undefined') throw new Error('Dry Promise: Verdict Core가 활성화되어 있지 않습니다.');
    const raw = defs(stage);
    const same = !!($gameSystem._verdict && $gameSystem._verdict.caseId === raw.id);
    if (!same) {
      $gameSystem._verdict = null;
      $gameSystem._verdictState = null;
    }
    const def = VerdictCore.setDefinition(raw);
    let st = VerdictCore.live();
    if (!same || !st || st.caseId !== def.id) {
      st = VerdictCore.Investigation.start(def, {credibility:5,wrongPenalty:0,nearPenalty:0,breakReward:0,seed:20260907});
      $gameSystem._verdictState = st;
      for (const e of def.exhibits) VerdictCore.Investigation.give(st, e.id);
      VerdictCore.persist();
    }
    $gameTemp._dpPostVerdictStage = stage;
    if (isPostGameStage(stage)) SceneManager.push(Scene_DPHearingVerdict);
    else if (typeof window.Scene_VerdictBoard === 'function') SceneManager.push(window.Scene_VerdictBoard);
  };

  window.DPPostRescue={
    SW, markRoute, routeKey, routeWitness, openVerdict, completeStage,
    endingScore, applyEndingBranch, revealEvent, hideEvent, hidePlayer, showPlayer
  };
})();


// ---------------------------------------------------------------------------
// HARD FIX: Map012 public-hearing attendees must remain visible while
// S01_POST_HEARING_BOARD is the active quest, regardless of stale save switches
// or event-page transparency state.
// ---------------------------------------------------------------------------
(() => {
  'use strict';
  const _Scene_Map_update_DP_HearingForceRender = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update_DP_HearingForceRender.call(this);
    try {
      if (!$gameMap || !$gameMap.mapId || $gameMap.mapId() !== 12 || !$gameSystem) return;
      const q = $gameSystem.questGuideId ? String($gameSystem.questGuideId() || '') : String($gameSystem._questGuideId || '');
      if (q !== 'S01_POST_HEARING_BOARD') return;

      const show = (id, name, index, x, y, dir) => {
        const e = $gameMap.event ? $gameMap.event(id) : null;
        if (!e) return;
        e._erased = false;
        e.locate(x, y);
        e.setImage(name, index);
        e.setDirection(dir || 2);
        e.setOpacity(255);
        e.setBlendMode(0);
        e.setTransparent(false);
        e.setThrough(false);
      };
      const hide = id => {
        const e = $gameMap.event ? $gameMap.event(id) : null;
        if (!e) return;
        e.setTransparent(true);
        e.setThrough(true);
      };

      // Core attendees: always present during the public-hearing quest.
      show(3,  '주인공1', 0,  9,  8, 2); // Agamemnon
      show(5,  'NPC',     4, 12, 14, 4); // Hestia
      show(6,  '시민1',   6, 12, 10, 4); // Upper-town citizen
      show(7,  '시민2',   7,  6, 14, 6); // Lower-town citizen
      show(8,  '시민1',   3, 12, 13, 4); // City staff
      show(24, '주인공1', 4,  6, 12, 6); // Pheme
      show(26, '주인공1', 6,  6, 10, 6); // Talos

      // Route-specific witnesses.
      const ac = $gameSwitches && ($gameSwitches.value(343) || $gameSwitches.value(345));
      const bd = $gameSwitches && ($gameSwitches.value(344) || $gameSwitches.value(346));
      if (ac) {
        show(4,  '윗마을 정원', 0, 12, 12, 4); // Bia
        show(14, '윗마을 정원', 5, 12, 11, 4); // Pan
        hide(25);
      } else if (bd) {
        show(25, '프롤로그 공장시민', 0, 6, 13, $gameSwitches.value(346) ? 2 : 6); // Echo
        hide(4); hide(14);
      }
    } catch (e) {
      console.warn('[DP Hearing Force Render Fix]', e);
    }
  };
})();
