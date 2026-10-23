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

  // The notebook contains only conversations actually completed in the council.
  // Keep this independent of VerdictCore: other investigation games use that engine.
  const NOTE_IDS = {20:'hestia',21:'talos',22:'pheme',23:'palamedes',24:'ergane',25:'household',26:'pan',34:'bia'};
  function catalog() {
    const r=routeKey();
    const notes={
      talos:{name:'탈로스',title:'물길을 점검한 결과',kind:'점검 결과',text:'물관과 밸브, 누수에는 이상이 없었어. 시설 고장 때문에 아랫마을의 물이 줄어든 것은 아니야.',topics:['part1']},
      palamedes:{name:'팔라메데스',title:'R-17의 배분 변경',kind:'기록 확인',text:'R-17에는 윗마을 20통·아랫마을 60통을 각각 40통으로 바꾼 내용이 있습니다. 사람 수와 공장 필요량을 검토한 기록, 시민회의 기록은 없습니다.',topics:['part1','part2']},
      ergane:{name:'에르가네',title:'공장에 필요했던 물',kind:'공장 기록',text:'윗마을 40명과 아랫마을 160명이 같은 40통을 나눠 쓰고 있어. 공장 기록을 보면 사고가 나기 전부터 물이 줄었어. 기계는 물 부족으로 멈췄지. 아랫마을에 필요한 양을 정할 때는 공장에 쓰는 물도 살펴야 해.',topics:['part2']},
      household:{name:'탈로스 부인',title:'물이 줄어든 집의 생활',kind:'생활 경험',text:'나는 집에서 물이 줄었을 때 생활이 어떻게 달라졌는지 말하려고 해. 점검표에는 고장이 없다고 적혀 있어도, 사람들의 하루는 달라졌으니까.',topics:['part2']},
      hestia:{name:'헤스티아',title:'결정하기 전에 지킬 약속',kind:'첫샘의 약속',text:'알리고, 묻고, 함께 정하고, 기록하는 것. 물을 나눌 때는 그 물을 쓰는 사람들의 사정부터 들어야 한단다.',topics:['part2']}
    };
    if(r==='A') {
      notes.bia={name:'비아',title:'탈로스와 맞춘 확인표',kind:'공식 기록 확인',text:'탈로스 씨와 맞춘 확인표에는 대기 지시는 있었지만, 가둔 이유와 문 잠금 허락은 없었어. 그 기록으로 문제를 제기했고 대표자가 문을 열라고 했어.',topics:['part3'],picture:'A_route_record_puzzle'};
      notes.pheme={name:'페메',title:'공식 확인 과정을 취재한 메모',kind:'취재 메모',text:'비아와 탈로스가 맞춘 테미스 확인표에 가둔 이유와 문 잠금 허락이 없었다는 내용을 적어 뒀어. 대표자가 왜 그런 조치를 했는지는 직접 물을 거야.',topics:['part3']};
    } else if(r==='B') {
      notes.pheme={name:'페메',title:'에코와 창고에서 확인한 일',kind:'구출 경험',text:'에코가 본 호송과 내가 직접 확인한 일을 나눠 적었어. 창고 뒤 기자 반출문의 잠금을 풀고, 안의 두 사람이 수레를 밀어야 나올 수 있었어.',topics:['part3']};
    } else if(r==='C') {
      notes.pan={name:'판',title:'병사들이 데려가는 모습',kind:'직접 목격',text:'병사들이 안티고네 씨를 창고로 데려가는 것을 봤습니다. 이유는 듣지 못했습니다. 제가 본 범위만 말하겠습니다.',topics:['part3']};
      notes.bia={name:'비아',title:'창고 밖의 잠금장치',kind:'현장 확인',text:'판의 안내로 옛 운반 통로를 지나갔습니다. 창고 밖 잠금을 직접 풀었고, 안티고네가 안의 수레를 치운 뒤에야 나올 수 있었습니다.',topics:['part3']};
      notes.pheme={name:'페메',title:'목격과 구조 과정을 나눈 메모',kind:'취재 메모',text:'판의 목격, 비아가 확인한 외부 잠금, 창고 안에서 나온 증언을 따로 적었어. 누가 왜 감금을 지시했는지는 당사자에게 물을 거야.',topics:['part3']};
    } else {
      notes.pheme={name:'페메',title:'창고와 연결한 연락선',kind:'통신·구출 경험',text:'이스메네가 지하 중계선을 살리고 내가 방송국에서 창고로 연결했어. 나는 안티고네에게 수레 뒤 운반문을 알려 줬어. 창고 안을 직접 본 것은 아니야.',topics:['part3']};
    }
    return notes;
  }
  function notebook() {
    const route=routeKey();
    let book=$gameSystem._dpHearingNotebook;
    if(!book||book.route!==route||book.version!==1) {
      book=$gameSystem._dpHearingNotebook={version:1,route,clues:{},answers:{}};
      // Upgrade saves using actual completed-dialogue flags, never the route alone.
      const notes=catalog();
      for(const [event,id] of Object.entries(NOTE_IDS)) {
        if(notes[id]&&$gameSelfSwitches.value([14,Number(event),'A']))
          book.clues[id]={map:14,event:Number(event),route,source:'시민회의장 · 저장된 준비 대화'};
      }
    }
    return book;
  }
  function collect(id) {
    if(!catalog()[id])return false;
    const book=notebook();
    const event=Number(Object.keys(NOTE_IDS).find(k=>NOTE_IDS[k]===id));
    book.clues[id]={map:14,event,route:routeKey(),source:'시민회의장 · '+catalog()[id].name+'와의 대화'};
    return true;
  }
  function heldNotes() {
    const book=notebook(),notes=catalog();
    return Object.entries(notes).filter(([id])=>book.clues[id]).map(([id,n])=>({id,...n,source:book.clues[id].source}));
  }
  function stageInfo(stage) {
    return ({
      part1:{label:'1 / 3 · 물의 행방',question:'아랫마을의 물은 왜 줄었을까요?',hint:'물길 점검이나 물을 나눈 기록에서 단서를 찾아보세요.',ask:'왜 물 배분을 바꾸었고, 시민에게 알리지 않았나요?'},
      part2:{label:'2 / 3 · 시민의 생활',question:'물을 나누기 전에 무엇을 살펴야 할까요?',hint:'물의 쓰임, 생활의 변화, 시민에게 묻는 약속을 살펴보세요.',ask:'사람 수와 생활에 필요한 양을 살피고, 시민에게 먼저 물었나요?'},
      part3:{label:'3 / 3 · 창고에서 있었던 일',question:'창고에서 무슨 일이 있었나요?',hint:'이 길에서 만난 사람이 보고, 확인하고, 도운 일을 찾아보세요.',ask:'왜 창고에서 기다리게 했나요? 왜 자유롭게 나올 수 없었나요?'}
    })[stage];
  }
  function resultFor(stage) {
    const related=heldNotes().filter(n=>n.topics.includes(stage));
    const conclusion=stage==='part1'
      ? '물길에는 이상이 없었고, R-17로 윗마을 20통·아랫마을 60통이 각각 40통으로 바뀌었습니다.'
      : stage==='part2'
      ? '숫자를 똑같이 나누기 전에 사람들의 생활과 필요한 양을 살피고 물어야 합니다. R-17에는 그 검토와 시민회의 기록이 없습니다.'
      : routeKey()==='A'
      ? '비아와 탈로스는 가둔 근거가 기록에 없음을 확인하고 정식으로 문제를 제기했습니다. 이후 대표자의 명령으로 문이 열렸습니다.'
      : routeKey()==='B'
      ? '에코가 호송을 목격했고 페메가 밖의 잠금을 풀었습니다. 안티고네와 이스메네는 안의 수레를 치운 뒤 나왔습니다.'
      : routeKey()==='C'
      ? '판은 호송을 보았고 비아는 밖의 잠금을 풀었습니다. 안티고네는 안의 수레를 치운 뒤 나왔습니다.'
      : '이스메네와 페메가 연락선을 복구했습니다. 안티고네는 연락으로 탈출 방법을 듣고 수레 뒤 운반문으로 나왔습니다. 밖의 사람은 창고 안을 직접 본 것이 아닙니다.';
    return {related,conclusion,ask:stageInfo(stage).ask};
  }
  function canPresent(stage,id) {
    const n=heldNotes().find(n=>n.id===id);
    return !!(n&&n.topics.includes(stage));
  }
  function completeStage(stage) {
    const s=STAGE[stage];if(!s)return;
    set(s.active,false);set(s.done,true);
  }
  function openVerdict(stage) {
    if(stage==='final'){completeStage(stage);return;}
    if(!stageInfo(stage))return;
    notebook();$gameTemp._dpPostVerdictStage=stage;
    SceneManager.push(Scene_DPHearingVerdict);
  }
  const clearHearingInput=()=>{Input.clear();TouchInput.clear();$gameTemp.clearDestination();};
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  const css=el('style');css.textContent=`
  body.dp-hearing-open #dp-touch-controls{visibility:hidden!important;pointer-events:none!important}
  #dp-hearing{position:fixed;inset:0;z-index:2147483500;display:grid;place-items:center;padding:12px;box-sizing:border-box;background:#17110885;touch-action:manipulation}
  #dp-hearing *{box-sizing:border-box}
  .dph-panel{width:min(1140px,100%);height:min(770px,100%);padding:26px;display:flex;flex-direction:column;gap:12px;background-size:100% 100%;filter:drop-shadow(0 6px 14px #0008);min-height:0}
  .dph-header{display:flex;gap:12px;align-items:center;justify-content:space-between;flex:none}
  .dph-header p{font-size:16px;color:#73521f;margin:0 0 6px}.dph-header h1{font-size:27px;margin:0;font-weight:normal}
  #dp-hearing button{font-size:20px;min-height:48px;padding:10px 16px;cursor:pointer;touch-action:manipulation;flex-shrink:0}
  .dph-hint{font-size:18px;margin:0;color:#634b2d}
  .dph-body{display:grid;grid-template-columns:40% 1fr;gap:20px;flex:1;min-height:0}
  .dph-list-title{font-size:16px;margin:0 0 4px;color:#634b2d;flex:none}
  .dph-list{overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;display:flex;flex-direction:column;gap:8px;padding:4px}
  #dp-hearing .dph-card{display:block;text-align:left;min-height:75px;white-space:normal}
  .dph-card span{display:block;font-size:17px;margin-top:5px}
  #dp-hearing .dph-card[aria-pressed=true]{outline:3px solid #ad7930;outline-offset:0;background-image:var(--dp-selected)!important;color:var(--dp-ink)!important;text-shadow:none}
  .dph-detail{display:flex;flex-direction:column;min-height:0;gap:12px}
  .dph-scroll{overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;min-height:0;flex:1;padding:14px 18px;background:#fff8e59c;border:1px solid #b59660}
  .dph-scroll h2{font-size:25px;margin:0 0 12px;font-weight:normal}
  .dph-scroll p{font-size:22px;line-height:1.65;margin:8px 0;word-break:keep-all;overflow-wrap:anywhere}
  .dph-scroll .dph-source{font-size:16px;color:#745525}.dph-scroll .dph-kind{font-size:16px;color:#745525}
  .dph-scroll .dph-support{font-size:19px;padding-top:10px;border-top:1px solid #baa378}
  .dph-scroll img{max-width:100%;height:auto;display:block;margin:10px auto}
  .dph-feedback{font-size:18px;line-height:1.5;min-height:28px;margin:0;color:#664214}
  .dph-actions{display:flex;gap:8px;justify-content:flex-end;flex:none}
  @media(max-height:650px){.dph-panel{padding:20px;gap:8px}.dph-header h1{font-size:24px}.dph-scroll p{font-size:20px}.dph-header p{margin:0}.dph-body{gap:12px}#dp-hearing .dph-card{min-height:65px}.dph-scroll{padding:10px 14px}}
  @media(max-width:650px){.dph-panel{padding:18px}.dph-body{grid-template-columns:1fr;grid-template-rows:30% 1fr}.dph-list{display:grid;grid-template-columns:1fr 1fr}.dph-header h1{font-size:21px}.dph-header{gap:6px}#dp-hearing button{font-size:18px}.dph-scroll p{font-size:19px}.dph-hint{font-size:16px}}
  `;document.head.append(css);

  function Scene_DPHearingVerdict(){this.initialize.apply(this,arguments);}
  Scene_DPHearingVerdict.prototype=Object.create(Scene_MenuBase.prototype);
  Scene_DPHearingVerdict.prototype.constructor=Scene_DPHearingVerdict;
  Scene_DPHearingVerdict.prototype.create=function(){
    Scene_MenuBase.prototype.create.call(this);
    this._stage=$gameTemp._dpPostVerdictStage;
    this._selected=null;this._solved=false;this._leaving=false;
    const root=this._root=el('div');root.id='dp-hearing';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','dph-title');
    for(const type of ['pointerdown','pointerup','pointermove','pointercancel','mousedown','mouseup','touchstart','touchend','touchmove','click','wheel','keydown','keyup'])
      root.addEventListener(type,e=>e.stopPropagation());
    root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();this.leave(false);}});
    this._panel=el('section','','dph-panel');root.append(this._panel);document.body.append(root);document.body.classList.add('dp-hearing-open');
    clearHearingInput();
    this.renderNotebook();
    this._disposeTheme=DP_GameUI.decorate(root,'.dph-panel');
  };
  Scene_DPHearingVerdict.prototype.renderNotebook=function(){
    const info=stageInfo(this._stage),box=this._panel;box.replaceChildren();
    const header=el('header','','dph-header'),titles=el('div');
    const title=el('h1',info.question);title.id='dph-title';titles.append(el('p','공청회 · '+info.label),title);
    const back=el('button','잠깐 나가기');back.id='dph-back';back.onclick=()=>this.leave(false);header.append(titles,back);box.append(header);
    box.append(el('p','사람의 이름을 눌러 메모를 읽고, 질문에 맞는 단서 하나로 발언하세요.','dph-hint'));
    const body=el('div','','dph-body'),list=el('nav','','dph-list');list.setAttribute('aria-label','시민회의장에서 모은 단서');body.append(list);
    const notes=heldNotes();
    list.append(el('p',`단서 ${notes.length}개 · 위아래로 넘겨 보기`,'dph-list-title'));
    for(const n of notes){
      const b=el('button',n.name,'dph-card');b.dataset.clue=n.id;b.setAttribute('aria-pressed',String(n.id===this._selected));b.append(el('span',n.title));b.onclick=()=>this.selectNote(n.id);list.append(b);
    }
    if(!notes.length)list.append(el('p','아직 모은 단서가 없어요. 시민회의장에서 준비 대화를 먼저 들어 보세요.'));
    this._detail=el('div','','dph-detail');body.append(this._detail);box.append(body);
    this._feedback=el('p','','dph-feedback');this._feedback.setAttribute('role','status');box.append(this._feedback);
    this.renderDetail();
    if(!this._selected)back.focus({preventScroll:true});
  };
  Scene_DPHearingVerdict.prototype.selectNote=function(id){
    this._selected=id;
    this._root.querySelectorAll('[data-clue]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.clue===id)));
    this.renderDetail();
    if(!this._solved)this._feedback.textContent='메모를 읽은 뒤 아래의 ‘이 단서로 발언하기’를 누르세요.';
  };
  Scene_DPHearingVerdict.prototype.renderDetail=function(){
    const detail=this._detail;detail.replaceChildren();
    const scroll=el('article','','dph-scroll');scroll.tabIndex=0;detail.append(scroll);
    if(this._solved){
      const result=resultFor(this._stage);
      scroll.append(el('h2','시민들의 이야기를 함께 보니'),el('p',result.conclusion));
      for(const n of result.related)scroll.append(el('p',n.name+' · '+n.text,'dph-support'));
      scroll.append(el('p','대표자에게 물을 질문','dph-kind'),el('p',result.ask));
    }else{
      const n=heldNotes().find(n=>n.id===this._selected);
      if(n){
        scroll.append(el('p',n.source,'dph-source'),el('h2',n.name+' · '+n.title),el('p',n.kind+'을 적은 메모','dph-kind'),el('p',n.text));
        if(n.picture){
          const toggle=el('button','그때 맞춘 서류 보기');toggle.id='dph-document';
          toggle.onclick=()=>{const existing=scroll.querySelector('img');if(existing){existing.remove();toggle.textContent='그때 맞춘 서류 보기';}else{const img=el('img');img.src='img/pictures/'+n.picture+'.png';img.alt='비아와 탈로스가 맞춘 테미스 확인표';scroll.append(img);toggle.textContent='서류 그림 접기';}};
          scroll.append(toggle);
        }
      }else scroll.append(el('h2','시민회의장에서 들은 이야기'),el('p',stageInfo(this._stage).hint),el('p','왼쪽에서 메모를 골라 보세요. 말한 사람과 실제로 확인한 내용을 함께 읽을 수 있어요.'));
    }
    const actions=el('div','','dph-actions'),b=el('button',this._solved?'다음으로':'이 단서로 발언하기');b.id='dph-present';b.disabled=!this._solved&&!this._selected;
    b.onclick=()=>this._solved?this.leave(true):this.present();actions.append(b);detail.append(actions);
  };
  Scene_DPHearingVerdict.prototype.present=function(){
    if(this._leaving||this._solved)return;
    if(!canPresent(this._stage,this._selected)){
      const n=heldNotes().find(n=>n.id===this._selected);
      this._feedback.textContent=(n?'이 메모는 ‘'+n.title+'’에 관한 이야기예요. ':'')+stageInfo(this._stage).hint;
      SoundManager.playBuzzer();return;
    }
    // The council preparation normally supplies these. Do not fabricate an
    // unheard corroborating source in a partial or older save.
    const required=this._stage==='part1'?['talos','palamedes']:this._stage==='part2'?['ergane','household','hestia','palamedes']:routeKey()==='A'?['bia']:routeKey()==='C'?['pan','bia']:['pheme'];
    const missing=required.filter(id=>!notebook().clues[id]);
    if(missing.length){this._feedback.textContent='함께 확인할 메모가 더 필요해요: '+missing.map(id=>catalog()[id].name).join(', ')+'. 시민회의장의 준비 대화를 확인해 주세요.';return;}
    notebook().answers[this._stage]={clue:this._selected};this._solved=true;
    this._feedback.textContent='이 단서가 질문에 도움이 됩니다. 함께 모은 이야기와 질문을 읽고 다음으로 가세요.';
    this.renderDetail();this._root.querySelector('#dph-present').focus({preventScroll:true});SoundManager.playOk();
  };
  Scene_DPHearingVerdict.prototype.leave=function(done){
    if(this._leaving)return;this._leaving=true;
    if(done&&this._solved)completeStage(this._stage);
    $gameTemp._dpPostVerdictStage=null;clearHearingInput();this.popScene();
  };
  Scene_DPHearingVerdict.prototype.terminate=function(){
    if(this._disposeTheme)this._disposeTheme();
    if(this._root)this._root.remove();document.body.classList.remove('dp-hearing-open');clearHearingInput();
    Scene_MenuBase.prototype.terminate.call(this);
  };
  window.Scene_DPHearingVerdict=Scene_DPHearingVerdict;

  window.DPPostRescue={
    SW, markRoute, routeKey, openVerdict, completeStage,
    endingScore, applyEndingBranch, revealEvent, hideEvent, hidePlayer, showPlayer,
    collect, notebook, heldNotes, catalog, canPresent, resultFor
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
        if ($gameSwitches.value(345)) show(14, '윗마을 정원', 5, 12, 11, 4); // Pan witnessed the C route
        else hide(14); // The A rescue uses Bia and Talos's official challenge.
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
