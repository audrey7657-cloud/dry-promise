/*:
 * @target MZ
 * @plugindesc 첫 이동 전 기본 안내 · 기록 조각 퍼즐 재시작 · 옵션 뒤로가기
 * @author Dry Promise
 * @orderAfter DP_Chapters
 * @orderAfter DP_GameUI
 * @help Map001 이벤트 4의 마지막 대사와 목표 안내가 끝난 뒤 한 번 표시합니다.
 * 퍼즐 재시작은 해당 시도의 처음 배치를 복원하며 이야기의 선택은 바꾸지 않습니다.
 */
(() => {
  'use strict';
  let guide=null,actions=null,settled=0;
  const clear=()=>{Input.clear();TouchInput.clear();$gameTemp?.clearDestination();};
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
  const block=root=>{for(const t of ['pointerdown','pointerup','pointermove','pointercancel','mousedown','mouseup','touchstart','touchend','touchmove','click','wheel'])root.addEventListener(t,e=>e.stopPropagation());};
  const css=node('style');css.textContent=`
  body.dp-basic-open #dp-touch-controls{visibility:hidden!important;pointer-events:none!important}
  #dp-basic-help{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:18px;background:#0008;box-sizing:border-box;overflow:auto;touch-action:pan-y}
  .dh-panel{width:min(720px,100%);padding:30px;background-size:100% 100%;box-sizing:border-box;filter:drop-shadow(0 8px 18px #0008)}
  .dh-panel h1{font-size:28px;font-weight:normal;margin:10px 0 18px;text-align:center}
  .dh-panel p{font-size:22px;line-height:1.6;word-break:keep-all;margin:14px 0}
  .dh-panel .dh-count{font-size:16px;margin:0;color:#755220;text-align:center}
  .dh-example{display:flex;justify-content:center;align-items:center;gap:28px;min-height:100px}
  .dh-example img{max-width:100%;object-fit:contain;image-rendering:auto}
  .dh-example figure{margin:0;text-align:center}.dh-example figcaption{font-size:16px;margin-top:7px}
  .dh-buttons{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}
  #dp-basic-help button,#dp-scene-actions button{min-height:52px;padding:10px 22px;font-size:21px;cursor:pointer;touch-action:manipulation}
  #dp-scene-actions{position:fixed;right:20px;top:18px;z-index:2147483500;min-width:154px;padding:12px;background-size:100% 100%;box-sizing:border-box}
  #dp-scene-actions button{width:100%}
  @media(max-height:600px){.dh-panel{padding:24px}.dh-panel h1{font-size:24px;margin:6px 0 12px}.dh-panel p{font-size:19px;margin:8px 0}.dh-example{min-height:60px}.dh-example img{max-height:120px}.dh-buttons{margin-top:10px}#dp-basic-help button{min-height:46px}}
  `;document.head.append(css);
  function sample(bitmap,sx,sy,w,h,scale=2){
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    canvas.getContext('2d').drawImage(bitmap.canvas,sx,sy,w,h,0,0,w,h);
    const img=node('img');img.src=canvas.toDataURL();img.style.width=w*scale+'px';img.style.height=h*scale+'px';img.alt='게임에서 사용하는 표시';return img;
  }
  function closeHelp(done=false){
    if(!guide)return;
    guide.dispose();guide.root.remove();guide=null;document.body.classList.remove('dp-basic-open');clear();
    if(done){$gameSystem._dpBasicHelpDone=true;$gameSystem._dpBasicHelpPending=false;}
  }
  function showHelp(){
    const root=node('div');root.id='dp-basic-help';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');
    const box=node('section','','dh-panel');root.append(box);block(root);document.body.append(root);
    document.body.classList.add('dp-basic-open');clear();
    guide={root,box,index:0,scene:SceneManager._scene,temp:$gameTemp,dispose:DP_GameUI.decorate(root,'.dh-panel')};
    render();
  }
  function render(){
    const g=guide,box=g.box;box.replaceChildren();g.root.dataset.step=g.index;
    const titles=['미니맵에서 목표를 찾아요','빨간 화살표를 따라가요','조사할 곳의 표시를 찾아요','가까이 가서 ●를 눌러요'];
    const copies=[
      '왼쪽 위 작은 지도가 미니맵이에요. 말풍선 표시가 있는 곳이 목표예요. 지도가 접혀 있으면 위쪽 장소 이름을 눌러 펼쳐요.',
      '빨간 화살표가 보이면 그쪽으로 방향키를 눌러 이동하세요. 지금 해야 할 일은 화면 아래의 ‘현재 목표’에서 확인해요.',
      '물음표 말풍선이나 말풍선 표시가 보이면, 그 물건이나 사람에게 다가가 확인해 보세요.',
      '방향키로 다가가 물건이나 사람 쪽을 바라보세요. 오른쪽 ● 결정 버튼을 한 번 누르고 손을 떼면 조사하거나 대화해요. 이제 부엌 수도를 확인하러 가 볼까요?'
    ];
    box.append(node('p',`게임 조작 안내 · ${g.index+1} / 4`,'dh-count'),node('h1',titles[g.index]));
    const example=node('div','','dh-example');box.append(example);
    if(g.index===0){
      const img=node('img');img.src='tutorial/help/minimap.jpg';img.alt='플레이 영상 속 왼쪽 위 미니맵과 목표 말풍선';img.style.height='165px';
      const fig=node('figure');fig.append(img,node('figcaption','플레이 영상 속 미니맵'));example.append(fig);
      const icons=ImageManager.loadSystem('IconSet');icons.addLoadListener(()=>{if(guide===g&&g.index===0)example.append(sample(icons,4*32,0,32,32,2));});
    }else if(g.index===1){
      const arrow=g.scene._questGuideArrow?.bitmap;
      if(arrow)example.append(sample(arrow,0,0,arrow.width,arrow.height,2));
      example.append(node('p','▲  ◀  ▶  ▼'));
    }else if(g.index===2){
      const balloon=ImageManager.loadSystem('Balloon'),icons=ImageManager.loadSystem('IconSet');
      balloon.addLoadListener(()=>{if(guide===g&&g.index===2){const fig=node('figure');fig.append(sample(balloon,3*48,48,48,48,2),node('figcaption','물음표 말풍선'));example.append(fig);}});
      icons.addLoadListener(()=>{if(guide===g&&g.index===2){const fig=node('figure');fig.append(sample(icons,4*32,0,32,32,2),node('figcaption','미니맵의 말풍선'));example.append(fig);}});
    }else{
      const actual=document.querySelector('#dp-touch-controls [aria-label="결정"]');
      if(actual){const copy=actual.cloneNode(true);Object.assign(copy.style,{position:'static',pointerEvents:'none',flexShrink:'0'});example.append(copy);}
      else example.append(node('p','● 결정 버튼'));
      example.append(node('p','한 번 톡 → 손 떼기'));
    }
    box.append(node('p',copies[g.index]));const buttons=node('div','','dh-buttons');box.append(buttons);
    if(g.index){const prev=node('button','이전');prev.id='dh-prev';prev.onclick=()=>{g.index--;render();};buttons.append(prev);}
    const next=node('button',g.index===3?'부엌 수도 확인하러 가기':'다음');next.id='dh-next';
    next.onclick=()=>{if(g.index===3)closeHelp(true);else{g.index++;render();}};buttons.append(next);
    next.focus({preventScroll:true});
  }
  const execute=Game_Interpreter.prototype.executeCommand;
  Game_Interpreter.prototype.executeCommand=function(){
    if(this._mapId===1&&this._eventId===4&&!$gameSystem._dpBasicHelpDone&&
      this.currentCommand()?.code===123&&this.currentCommand().parameters[0]==='A'&&this.currentCommand().parameters[1]===0){
      $gameSystem._dpBasicHelpPending=true;
    }
    return execute.call(this);
  };
  function syncActions(){
    const scene=SceneManager._scene,name=scene?.constructor.name;
    const puzzle=name==='Scene_SlidingPuzzle'&&!scene._gameOver;
    const options=name==='Scene_Options'||name==='Scene_AudioOptions';
    if(actions&&(actions.scene!==scene||(!puzzle&&!options))){actions.dispose();actions.root.remove();actions=null;}
    if(!actions&&(puzzle||options)&&scene.isActive()){
      const root=node('div');root.id='dp-scene-actions';block(root);const b=node('button',puzzle?'다시 시작':'← 뒤로가기');
      b.id=puzzle?'dp-puzzle-restart':'dp-options-back';root.append(b);document.body.append(root);
      // The container itself uses the original frame; the inner section allows
      // the common theme renderer to observe its natural size.
      const outer=node('div');root.replaceWith(outer);outer.append(root);
      actions={root:outer,scene,dispose:DP_GameUI.decorate(outer,'#dp-scene-actions')};
      b.onclick=()=>{clear();if(puzzle){scene.restartPuzzle();}else{b.disabled=true;SoundManager.playCancel();
        if(name==='Scene_AudioOptions')scene.onAudioCancel();else scene.popScene();}};
    }
    if(actions&&puzzle)actions.root.querySelector('button').disabled=!scene._dpInitialTiles||scene._gameOver;
  }
  const update=SceneManager.updateScene;
  SceneManager.updateScene=function(){
    if(guide){if(guide.scene!==this._scene||guide.temp!==$gameTemp)closeHelp();else return;}
    update.call(this);syncActions();
    // Also cover an older save made after the monologue but before inspecting
    // the first tap. Later saves and chapter-2 starts have switch 1 already ON.
    if($gameSystem&&!$gameSystem._dpBasicHelpDone&&$gameMap.mapId()===1&&
      $gameSelfSwitches.value([1,4,'A'])&&$gameSwitches.value(13)&&!$gameSwitches.value(1)&&
      $gameSystem.questGuideId()==='S01_010')$gameSystem._dpBasicHelpPending=true;
    if($gameSystem?._dpBasicHelpPending&&!$gameSystem._dpBasicHelpDone&&this._scene instanceof Scene_Map&&
      this._scene.isActive()&&!this._scene.isBusy()&&!$gameMessage.isBusy()&&!$gameMap.isEventRunning()&&ImageManager.isReady()){
      if(++settled>=3){settled=0;showHelp();}
    }else settled=0;
  };
  for(const type of ['keydown','keyup'])window.addEventListener(type,e=>{if(guide)e.stopPropagation();},true);
  window.DP_PlayHelp={state:()=>guide?guide.index:null};
})();
