/*:
 * @target MZ
 * @plugindesc Dry Promise — Echo rescue redesign support (B/D shared testimony-accuracy literacy Verdict, quest text, rapid mash)
 * @author Dry Promise
 * @help
 * Load order: MM_QuestGuide -> VerdictCore -> VerdictCaseFile -> DP_EchoRoute
 * This plugin only activates while the redesigned Echo rescue switches are ON.
 * B route uses Echo/Pheme source classification -> timeline -> cause hypothesis. D route uses Ismene testimony review. Both save V56 = testimony accuracy (0-3).
 */
(() => {
'use strict';
const Q={
  S01_ECHO_FIND_PHEME:'방송국으로 가서 페메에게 직접 본 일을 알리자.',
  S01_ECHO_TRACE_ROUTE:'퀘스트 안내를 따라 테미스 뒤 창고 입구로 가자.',
  S01_ECHO_PRESS_DOOR:'창고 뒤편을 조사해 오래된 기자 반출문을 찾아보자.',
  S01_ECHO_PRESS_LOCK:'표식의 순서대로 오래된 잠금장치를 해제하자.',
  S01_ECHO_CART_INSIDE:'결정키를 빠르게 연타해 문 앞 수레를 밀어내자.',
  S01_ECHO_RETURN_LOBBY:'구조가 끝났다. 확인한 사실을 시민들과 함께 정리하자.'
};
const oldQT=Game_System.prototype.questGuideText;
Game_System.prototype.questGuideText=function(){
  const id=this.questGuideId ? this.questGuideId() : '';
  return Q[id] || (oldQT ? oldQT.call(this) : id);
};


function dpEchoRestorePhemeEchoFormation(){
  if(!$gamePlayer||!$gameParty)return;
  const members=Array.isArray($gameParty._actors)?$gameParty._actors:[];
  if(members[0]!==9||members[1]!==10)return;

  const fs=$gamePlayer.followers();
  if(!fs)return;
  fs.show();
  fs._visible=true;
  fs._gathering=false;
  if(fs.refresh)fs.refresh();

  const echo=fs.follower?fs.follower(0):null;
  if(!echo)return;
  if(echo.refresh)echo.refresh();
  echo.setTransparent(false);
  echo.setOpacity(255);
  echo.setBlendMode(0);
  echo.setThrough(true);
  echo.setMoveSpeed($gamePlayer.moveSpeed());

  const d=$gamePlayer.direction();
  let x=$gamePlayer.x,y=$gamePlayer.y;
  if(d===2)y-=1;
  else if(d===8)y+=1;
  else if(d===4)x+=1;
  else if(d===6)x-=1;

  if($gameMap){
    x=Math.max(0,Math.min($gameMap.width()-1,x));
    y=Math.max(0,Math.min($gameMap.height()-1,y));
  }
  echo.locate(x,y);
  echo.setDirection(d);
}

// MZ는 맵 전송 때 follower를 리더와 같은 칸에 겹쳐 놓는다.
// B루트 추적 중에는 전송 직후 에코를 다시 페메 뒤에 배치한다.
const _DP_Echo_performTransfer=Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer=function(){
  const wasTransferring=this.isTransferring();
  _DP_Echo_performTransfer.call(this);
  if(wasTransferring&&$gameSwitches&&$gameSwitches.value(314)){
    dpEchoRestorePhemeEchoFormation();
  }
};

window.DP_EchoRoute={
  setWarehouseParty(){
    $gameParty._actors.slice().forEach(id=>$gameParty.removeActor(id));
    $gameParty.addActor(1);
    if($gameSwitches.value(222))$gameParty.addActor(2);
    $gameParty._actors=$gameSwitches.value(222)?[1,2]:[1];
    $gamePlayer.refresh();$gamePlayer.followers().show();$gamePlayer.followers().synchronize($gamePlayer.x,$gamePlayer.y,$gamePlayer.direction());
  },
  setPhemeEchoParty(){
    $gameParty._actors.slice().forEach(id=>$gameParty.removeActor(id));
    $gameParty.addActor(9);$gameParty.addActor(10);$gameParty._actors=[9,10];
    $gamePlayer.refresh();$gamePlayer.setTransparent(false);$gamePlayer.setThrough(false);
    dpEchoRestorePhemeEchoFormation();
    if($gameMap&&$gameMap.mapId&&$gameMap.mapId()===15){
      const pe=$gameMap.event(4);
      if(pe){pe.setTransparent(true);pe.setThrough(true);}
    }
  },
  setMainParty(){
    $gameParty._actors.slice().forEach(id=>$gameParty.removeActor(id));
    $gameParty.addActor(1);if($gameSwitches.value(222))$gameParty.addActor(2);
    $gameParty._actors=$gameSwitches.value(222)?[1,2]:[1];
    $gamePlayer.refresh();$gamePlayer.followers().show();$gamePlayer.followers().synchronize($gamePlayer.x,$gamePlayer.y,$gamePlayer.direction());
  },
  startMash(){
    $gameSwitches.setValue(159,false);
    const retry=Number($gameVariables.value(54)||0);
    const goal=Math.max(8,12-Math.min(4,retry*2));
    $gameTemp._dpEchoRouteMash={active:true,armed:false,count:0,goal,frames:240,total:240,startFrame:0,lastFrame:-1};
    Input.clear(); if(window.TouchInput)TouchInput.clear();
  },
  updateMash(){
    const s=$gameTemp._dpEchoRouteMash;if(!s||!s.active||s.lastFrame===Graphics.frameCount)return;
    s.lastFrame=Graphics.frameCount;
    const touch=typeof TouchInput!=='undefined';
    if(!s.armed){if(!Input.isPressed('ok')&&!(touch&&TouchInput.isPressed())){s.armed=true;s.startFrame=Graphics.frameCount;}return;}
    s.frames=Math.max(0,s.total-(Graphics.frameCount-s.startFrame));
    if(s.frames===0){s.active=false;return;}
    if(Input.isTriggered('ok')||(touch&&TouchInput.isTriggered()))s.count++;
    if(s.count>=s.goal){$gameSwitches.setValue(159,true);s.active=false;}
  },
  finishMash(){delete $gameTemp._dpEchoRouteMash;if($gameScreen&&$gameScreen.clearShake)$gameScreen.clearShake();}
};

// While the redesigned Echo route is active, keep the old First Spring/Echo rescue switches off.
// This prevents older rescue-recovery plugins from restoring the obsolete temple blinking route.
const _dpEchoRedesignActive=()=>[312,314,315,316,317,318,321].some(id=>$gameSwitches.value(id));
const _dpEchoSceneMapUpdate=Scene_Map.prototype.update;
Scene_Map.prototype.update=function(){
  _dpEchoSceneMapUpdate.call(this);
  if(_dpEchoRedesignActive()){
    if($gameSwitches.value(277))$gameSwitches.setValue(277,false);
    if($gameSwitches.value(291))$gameSwitches.setValue(291,false);
  }
};

const EchoVerdict=window.DP_EchoVerdict={
  active:false,
  solved:false,
  previousDef:null,
  testimonyAccuracy:0,
  broadcastAccuracy:0,
  questions:[],
  startTutorial(){
    if(!window.VerdictSkin)throw new Error('Echo literacy Verdict requires VerdictCaseFile above DP_EchoRoute.');
    this.active=true;this.solved=false;this.testimonyAccuracy=0;this.broadcastAccuracy=0;this.questions=[];
    $gameSwitches.setValue(313,false);
    $gameVariables.setValue(56,0);
    $gameSystem._dpTestimonyAccuracy=0;
    $gameSystem._dpTestimonySource='B';
    $gameSystem._dpTestimonyQuestions=[];
    // Legacy aliases kept only so older saves/scripts do not break.
    $gameSystem._dpEchoBroadcastAccuracy=0;
    $gameSystem._dpEchoQuestions=[];
  },
  openBoard(){SceneManager.push(window.Scene_EchoLiteracyVerdict);},
  finishTutorial(){this.active=false;this.solved=false;},
  addQuestion(q){
    if(!q||this.questions.includes(q))return;
    this.questions.push(q);
    $gameSystem._dpTestimonyQuestions=this.questions.slice();
    $gameSystem._dpEchoQuestions=this.questions.slice();
  }
};

// ============================================================================
// Echo literacy Verdict — B route only
// 1) classify source  2) arrange timeline / find a gap
// 3) infer the most supportable cause hypothesis
// ============================================================================
const ECHO_BG='#8f6b43', ECHO_PAPER='#fbf2d8', ECHO_INK='#211912', ECHO_MUTED='#4a3828';

function dpEchoPaper(b,x,y,w,h,selected){
  b.fillRect(x+5,y+7,w,h,'rgba(42,28,16,0.30)');
  b.fillRect(x,y,w,h,selected?'#f6ebc9':ECHO_PAPER);
  b.strokeRect(x,y,w,h,selected?'#5c8459':'#8b7456');
  if(selected)b.strokeRect(x+3,y+3,w-6,h-6,'#5c8459');
}
function dpEchoWrap(b,text,x,y,w,lh,max){
  const words=String(text||'').split(/\s+/);let line='',lines=[];
  for(const word of words){const t=line?line+' '+word:word;if(b.measureTextWidth(t)>w&&line){lines.push(line);line=word;}else line=t;}
  if(line)lines.push(line);if(max)lines=lines.slice(0,max);
  lines.forEach((t,i)=>b.drawText(t,x,y+i*lh,w,lh,'left'));
  return lines.length*lh;
}
function dpEchoShuffle(a){
  const r=Array.isArray(a)?a.slice():[];
  // deterministic-enough per open, but not fixed visually every run
  for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}
  return r;
}

function Window_EchoLiteracyBoard(){this.initialize.apply(this,arguments);}
Window_EchoLiteracyBoard.prototype=Object.create(Window_Base.prototype);
Window_EchoLiteracyBoard.prototype.constructor=Window_EchoLiteracyBoard;
Window_EchoLiteracyBoard.prototype.initialize=function(rect){
  Window_Base.prototype.initialize.call(this,rect);this.opacity=0;this._scene=null;
};
Window_EchoLiteracyBoard.prototype.setScene=function(scene){this._scene=scene;this.refresh();};
Window_EchoLiteracyBoard.prototype.refresh=function(){
  const b=this.contents;b.clear();if(!this._scene)return;
  const s=this._scene;
  b.fillRect(0,0,this.innerWidth,this.innerHeight,ECHO_BG);
  // High-contrast header: dark text should never sit directly on the cork background.
  b.fillRect(12,8,this.innerWidth-24,126,'rgba(252,244,220,0.98)');
  b.strokeRect(12,8,this.innerWidth-24,126,'#5f4933');
  VerdictSkin.type(b,'label');b.fontSize=21;b.textColor='#6d3b2f';b.fontBold=true;
  b.drawText(s.stageLabel(),32,18,this.innerWidth-64,28,'left');
  VerdictSkin.type(b,'display');b.fontSize=34;b.textColor=ECHO_INK;b.fontBold=false;
  b.drawText(s.stageTitle(),32,48,this.innerWidth-64,42,'left');
  b.fillRect(32,91,this.innerWidth-64,2,'rgba(70,50,30,0.50)');
  VerdictSkin.type(b,'body');b.fontSize=22;b.textColor='#2b2118';
  dpEchoWrap(b,s.stageInstruction(),32,98,this.innerWidth-64,30,2);

  if(s.phase==='classify')this.drawClassify(b,s);
  else if(s.phase==='timeline'||s.phase==='gap')this.drawTimeline(b,s);
  else if(s.phase==='hypothesis')this.drawHypothesis(b,s);
  else if(s.phase==='message'||s.phase==='final')this.drawMessage(b,s);

  this.drawQuestionBox(b,s);
};
Window_EchoLiteracyBoard.prototype.drawMessage=function(b,s){
  const x=70,y=150,w=this.innerWidth-140,h=Math.max(250,this.innerHeight-172);
  b.fillRect(x+6,y+8,w,h,'rgba(42,28,16,0.30)');
  b.fillRect(x,y,w,h,'rgba(253,246,225,0.99)');
  b.strokeRect(x,y,w,h,'#5f4933');
  b.strokeRect(x+4,y+4,w-8,h-8,'#b69a6d');
  VerdictSkin.type(b,'label');b.fontSize=22;b.textColor='#6d3b2f';b.fontBold=true;
  b.drawText(s.messageTitle||'추론 정리',x+26,y+20,w-52,32,'left');
  b.fillRect(x+24,y+61,w-48,2,'rgba(90,65,40,0.35)');
  VerdictSkin.type(b,'body');b.fontSize=24;b.textColor=ECHO_INK;b.fontBold=false;
  const raw=String(s.messageBody||'').replace(/\\n/g,'\n');
  const paras=raw.split(/\n+/).map(t=>t.trim()).filter(Boolean);
  let yy=y+78;
  for(const para of paras){
    yy+=dpEchoWrap(b,para,x+28,yy,w-56,34,3)+14;
    if(yy>y+h-62)break;
  }
  VerdictSkin.type(b,'label');b.fontSize=18;b.textColor='#4a3828';b.fontBold=false;
  b.drawText('결정키(Enter/Z)  :  계속',x+26,y+h-44,w-52,26,'right');
};
Window_EchoLiteracyBoard.prototype.drawQuestionBox=function(b,s){
  // Questions are preserved in EchoVerdict.questions for later scenes, but never drawn
  // over the literacy exercise. This prevents the memo box from obscuring results/cards.
  return;
};
Window_EchoLiteracyBoard.prototype.drawClassify=function(b,s){
  const list=Array.isArray(s.s1)?s.s1:[];const st=list[s.s1Index];if(!st)return;
  const x=64,y=154,w=this.innerWidth-128,h=170;dpEchoPaper(b,x,y,w,h,true);
  VerdictSkin.type(b,'label');b.fontSize=19;b.textColor=ECHO_MUTED;
  b.drawText(`에코의 진술 ${s.s1Index+1}/${list.length}`,x+20,y+15,w-40,25,'left');
  VerdictSkin.type(b,'display');b.fontSize=31;b.textColor=ECHO_INK;
  dpEchoWrap(b,'“'+st.text+'”',x+24,y+50,w-48,40,2);
  VerdictSkin.type(b,'body');b.fontSize=18;b.textColor=ECHO_MUTED;
  b.drawText('이 문장의 출처를 생각하세요.',x+20,y+h-35,w-40,24,'right');
  // progress bins
  const labels=[['봤다',s.s1Counts.seen],['들었다',s.s1Counts.heard],['그런 것 같다',s.s1Counts.guess]];
  labels.forEach((it,i)=>{const bw=190,bx=64+i*(bw+18),by=344;b.fillRect(bx,by,bw,48,'rgba(239,226,190,0.85)');b.strokeRect(bx,by,bw,48,'#8b7456');VerdictSkin.type(b,'label');b.fontSize=15;b.textColor=ECHO_INK;b.drawText(`${it[0]}  ${it[1]}개`,bx+8,by+10,bw-16,24,'center');});
};
Window_EchoLiteracyBoard.prototype.drawTimeline=function(b,s){
  const x=62,y=138,w=this.innerWidth-124;
  const placed=Array.isArray(s.timelinePlaced)?s.timelinePlaced:[];
  const gapReady=placed.length>=2;
  const rows=[
    {text:placed[0]||'첫 번째 사건 카드를 놓으세요',empty:!placed[0]},
    {text:placed[1]||'두 번째 사건 카드를 놓으세요',empty:!placed[1]},
    {text:'?',gap:true},
    {text:placed[2]||'세 번째 사건 카드를 놓으세요',empty:!placed[2]},
    {text:placed[3]||'마지막 사건 카드를 놓으세요',empty:!placed[3]}
  ];
  const avail=Math.max(238,this.innerHeight-y-6);
  const rowH=Math.max(44,Math.min(54,Math.floor(avail/5)));
  const boxH=Math.max(40,rowH-8);
  rows.forEach((row,i)=>{
    const yy=y+i*rowH,isGap=!!row.gap,isEmpty=!!row.empty;
    const numW=58;

    // 번호와 내용을 한 덩어리로 읽을 수 있게 대비를 분리한다.
    b.fillRect(x,yy,numW,boxH,isGap?'rgba(142,58,45,0.98)':'rgba(104,79,52,0.98)');
    b.fillRect(
      x+numW,yy,w-numW,boxH,
      isGap?'rgba(238,218,184,0.99)':(isEmpty?'rgba(240,231,210,0.99)':'rgba(253,247,228,0.99)')
    );
    b.strokeRect(x,yy,w,boxH,isGap?'#87352d':'#66513a');

    VerdictSkin.type(b,'label');
    b.fontSize=23;b.fontBold=true;b.textColor='#fff7df';
    b.drawText(['①','②','③','④','⑤'][i],x+4,yy+Math.max(4,(boxH-30)/2),numW-8,30,'center');

    VerdictSkin.type(b,isGap?'label':'body');
    b.fontSize=isGap?21:(isEmpty?20:22);
    b.fontBold=isGap;
    b.textColor=isGap?'#742b24':(isEmpty?'#5e5142':ECHO_INK);
    const ty=yy+Math.max(4,Math.floor((boxH-30)/2));
    b.drawText(row.text,x+numW+18,ty,w-numW-36,30,isEmpty?'center':'left');

    if(i<4){
      VerdictSkin.type(b,'label');
      b.fontSize=19;b.fontBold=true;b.textColor='#4b3526';
      b.drawText('↓',x+numW/2-12,yy+boxH-2,24,18,'center');
    }
  });
};
Window_EchoLiteracyBoard.prototype.drawHypothesis=function(b,s){
  const x=62,y=154,w=this.innerWidth-124,h=158;dpEchoPaper(b,x,y,w,h,true);
  VerdictSkin.type(b,'label');b.fontSize=20;b.textColor='#3f6544';b.drawText('페메의 추론',x+22,y+15,w-44,26,'left');
  VerdictSkin.type(b,'display');b.fontSize=32;b.textColor=ECHO_INK;
  dpEchoWrap(b,'안티고네는 왜 붙잡혔을 가능성이 가장 높을까?',x+24,y+50,w-48,42,2);
  VerdictSkin.type(b,'body');b.fontSize=18;b.textColor=ECHO_MUTED;
  b.drawText('확정이 아니라, 지금 가장 근거가 많은 가설을 고르세요.',x+22,y+h-34,w-44,24,'right');
};

function Window_EchoLiteracyChoices(){this.initialize.apply(this,arguments);}
Window_EchoLiteracyChoices.prototype=Object.create(Window_Selectable.prototype);
Window_EchoLiteracyChoices.prototype.constructor=Window_EchoLiteracyChoices;
Window_EchoLiteracyChoices.prototype.initialize=function(rect){
  // Window_Selectable may call maxItems()/maxCols() during its own initialize.
  // Prepare backing fields BEFORE the parent initialize to avoid undefined.length.
  this._items=[];this._cols=3;this._rows=1;
  Window_Selectable.prototype.initialize.call(this,rect);this.opacity=0;
};
Window_EchoLiteracyChoices.prototype.setItems=function(items,cols){
  this._items=Array.isArray(items)?items:[];
  this._cols=cols||Math.min(3,Math.max(1,this._items.length));
  this.refresh();
  if(this._items.length>0){this.select(0);this.activate();}else{this.deselect();this.deactivate();}
};
Window_EchoLiteracyChoices.prototype.maxItems=function(){return Array.isArray(this._items)?this._items.length:0;};
Window_EchoLiteracyChoices.prototype.maxCols=function(){return Math.max(1,Number(this._cols)||1);};
Window_EchoLiteracyChoices.prototype.itemHeight=function(){return Math.floor(this.innerHeight/Math.max(1,Math.ceil(this.maxItems()/this.maxCols())));};
Window_EchoLiteracyChoices.prototype.itemRect=function(index){
  const cols=this.maxCols(),rows=Math.max(1,Math.ceil(this.maxItems()/cols));
  const gap=18,w=Math.floor((this.innerWidth-gap*(cols-1))/cols),h=Math.floor((this.innerHeight-gap*(rows-1))/rows);
  const col=index%cols,row=Math.floor(index/cols);return new Rectangle(col*(w+gap),row*(h+gap),w,h);
};
Window_EchoLiteracyChoices.prototype.drawItem=function(index){
  const item=this._items[index];if(!item)return;const r=this.itemRect(index),b=this.contents;dpEchoPaper(b,r.x+3,r.y+3,r.width-8,r.height-8,index===this.index());
  VerdictSkin.type(b,'label');b.fontSize=17;b.textColor=item.tagColor||ECHO_MUTED;b.fontBold=true;if(item.tag)b.drawText(item.tag,r.x+18,r.y+11,r.width-36,22,'left');
  VerdictSkin.type(b,'display');b.fontSize=item.fontSize||25;b.textColor=ECHO_INK;b.fontBold=false;
  const manual=Array.isArray(item.lines)?item.lines.filter(Boolean):null;
  if(manual&&manual.length){
    const lineH=27, bodyY=r.y+(item.tag?36:21), max=Math.min(2,manual.length);
    for(let i=0;i<max;i++)b.drawText(manual[i],r.x+18,bodyY+i*lineH,r.width-40,lineH,'left');
  }else{
    dpEchoWrap(b,item.text,r.x+18,r.y+(item.tag?42:26),r.width-40,34,item.maxLines||4);
  }
};
Window_EchoLiteracyChoices.prototype.refreshCursor=function(){Window_Selectable.prototype.refreshCursor.call(this);this.refresh();};
Window_EchoLiteracyChoices.prototype.currentItem=function(){return this._items[this.index()];};

function Window_EchoLiteracyFooter(){this.initialize.apply(this,arguments);}
Window_EchoLiteracyFooter.prototype=Object.create(Window_Base.prototype);
Window_EchoLiteracyFooter.prototype.constructor=Window_EchoLiteracyFooter;
Window_EchoLiteracyFooter.prototype.initialize=function(rect){Window_Base.prototype.initialize.call(this,rect);this.opacity=0;this._label='';this._text='';};
Window_EchoLiteracyFooter.prototype.say=function(label,text){this._label=label||'';this._text=text||'';this.refresh();};
Window_EchoLiteracyFooter.prototype.refresh=function(){
  const b=this.contents;b.clear();
  b.fillRect(0,0,this.innerWidth,this.innerHeight,'rgba(248,237,207,0.99)');
  b.strokeRect(0,0,this.innerWidth,this.innerHeight,'#705a3e');
  VerdictSkin.type(b,'label');b.fontSize=19;b.textColor='#3b2c20';b.fontBold=true;
  b.drawText(this._label,18,7,this.innerWidth-36,24,'left');
  VerdictSkin.type(b,'body');b.fontSize=21;b.textColor=ECHO_INK;b.fontBold=false;
  const bodyY=35,lineH=28;
  const maxLines=Math.max(1,Math.floor((this.innerHeight-bodyY-10)/lineH));
  dpEchoWrap(b,this._text,18,bodyY,this.innerWidth-36,lineH,maxLines);
};

function Scene_EchoLiteracyVerdict(){this.initialize.apply(this,arguments);}
Scene_EchoLiteracyVerdict.prototype=Object.create(Scene_MenuBase.prototype);
Scene_EchoLiteracyVerdict.prototype.constructor=Scene_EchoLiteracyVerdict;
Scene_EchoLiteracyVerdict.prototype.initialize=function(){
  Scene_MenuBase.prototype.initialize.call(this);
  this.phase='classify';this.s1Index=0;this.s1Counts={seen:0,heard:0,guess:0};
  this.timelinePlaced=[];this.timelineExpected=0;this.timelinePool=[];this.classifyErrors=0;this.timelineErrors=0;this.hypothesisErrors=0;
  this.messageTitle='';this.messageBody='';this.nextAction=null;
  this.s1=[
    {text:'병사들이 두 누나를 데려갔다',answer:'seen',why:'복도에서 직접 본 장면.'},
    {text:'창고 문을 밖에서 잠갔다',answer:'seen',why:'테미스 뒤에서 직접 본 행동.'},
    {text:'한참 기다렸는데 문이 열리지 않았다',answer:'seen',why:'문이 다시 열리는지 기다리며 직접 확인.'},
    {text:'경비병이 “창고로 가는 거다”라고 말했다',answer:'heard',why:'경비병에게 직접 들은 말.'},
    {text:'경비병이 “잠깐 있다 보내 준다”고 말했다',answer:'heard',why:'같은 사람에게 들은 설명.'},
    {text:'누나들이 뭘 잘못한 것 같다',answer:'guess',why:'아무도 그렇게 설명하지 않은 에코의 짐작.'}
  ];
  this.timeline=[
    {id:'r17check',text:'① 안티고네가 R-17을 확인했다'},
    {id:'r17take',text:'② 안티고네가 기록을 가지고 나왔다'},
    {id:'escort',text:'④ 병사들이 두 사람을 데려갔다'},
    {id:'lock',text:'⑤ 창고 문이 밖에서 잠겼다'}
  ];
  this.hypotheses=[
    {id:'r17_related',correct:true,tag:'가장 근거 있음',tagColor:'#4f7255',text:'R-17을 확인하고 기록을 가져온 일이 붙잡힘과 관련됐을 가능성이 있다.',lines:['R-17을 확인하고 기록을 가져온 일이','붙잡힘과 관련됐을 가능성이 있다.']},
    {id:'punishment',tag:'에코의 짐작',tagColor:'#8a5148',text:'두 사람이 어떤 잘못을 해서 벌을 받은 것이다.',lines:['두 사람이 어떤 잘못을 해서','벌을 받은 것이다.']},
    {id:'election',tag:'동기 추측',tagColor:'#8a5148',text:'대표자가 선거에서 질까 봐 안티고네를 가둔 것이다.',lines:['대표자가 선거에서 질까 봐','안티고네를 가둔 것이다.']},
    {id:'water_damage',tag:'확인 사실과 충돌',tagColor:'#8a5148',text:'안티고네가 물길을 망가뜨려서 붙잡힌 것이다.',lines:['안티고네가 물길을 망가뜨려서','붙잡힌 것이다.']}
  ];
};
Scene_EchoLiteracyVerdict.prototype.createBackground=function(){
  this._backgroundSprite=new Sprite();const w=Graphics.width,h=Graphics.height,bmp=new Bitmap(w,h),ctx=bmp.context;
  ctx.fillStyle='#2e2419';ctx.fillRect(0,0,w,h);ctx.fillStyle='#9a784e';ctx.fillRect(22,22,w-44,h-44);
  // cork noise
  let seed=4242;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<2200;i++){ctx.fillStyle=`rgba(65,45,28,${0.03+rand()*0.06})`;ctx.fillRect(22+rand()*(w-44),22+rand()*(h-44),1,1);}
  bmp._baseTexture.update();this._backgroundSprite.bitmap=bmp;this.addChild(this._backgroundSprite);
};
Scene_EchoLiteracyVerdict.prototype.create=function(){
  Scene_MenuBase.prototype.create.call(this);const W=Graphics.boxWidth,H=Graphics.boxHeight;
  this._board=new Window_EchoLiteracyBoard(new Rectangle(34,18,W-68,438));this._board.setScene(this);this.addWindow(this._board);
  this._choices=new Window_EchoLiteracyChoices(new Rectangle(52,470,W-104,210));this._choices.setHandler('ok',this.onChoice.bind(this));this._choices.setHandler('cancel',this.onCancel.bind(this));this.addWindow(this._choices);
  this._footer=new Window_EchoLiteracyFooter(new Rectangle(34,H-144,W-68,128));this.addWindow(this._footer);
  this.refreshPhase();
};
Scene_EchoLiteracyVerdict.prototype.applyLayout=function(){
  const W=Graphics.boxWidth,H=Graphics.boxHeight;
  const footerH=128,footerY=H-footerH-16;
  const fit=(win,x,y,w,h)=>{
    if(!win)return;
    const resized=win.width!==w||win.height!==h;
    win.move(x,y,w,h);
    // Window.move changes the frame size, but Window_Base contents can keep the old
    // bitmap dimensions. Recreate it whenever height/width changes to prevent clipping.
    if(resized&&win.createContents)win.createContents();
  };
  if(this.phase==='message'||this.phase==='final'){
    fit(this._board,34,18,W-68,footerY-30);
    this._choices.hide();this._choices.deactivate();
    fit(this._footer,34,footerY,W-68,footerH);
  }else{
    let choiceH=Math.min(210,Math.max(180,Math.floor(H*0.263)));
    if(this.phase==='classify'||this.phase==='gap')choiceH=Math.min(170,Math.max(150,Math.floor(H*0.213)));
    else if(this.phase==='hypothesis')choiceH=Math.min(248,Math.max(210,Math.floor(H*0.31)));
    const choiceY=footerY-choiceH-10;
    const boardH=Math.max(330,choiceY-28);
    fit(this._board,34,18,W-68,boardH);
    fit(this._choices,52,choiceY,W-104,choiceH);
    this._choices.show();
    fit(this._footer,34,footerY,W-68,footerH);
  }
  if(this._board)this._board.refresh();
  if(this._choices)this._choices.refresh();
  if(this._footer)this._footer.refresh();
};
Scene_EchoLiteracyVerdict.prototype.stageLabel=function(){
  if(this.phase==='classify')return '1단계 · 분류';
  if(this.phase==='timeline'||this.phase==='gap')return '2단계 · 시간순 배열';
  if(this.phase==='hypothesis')return '3단계 · 원인 추론';
  return '페메의 취재 정리';
};
Scene_EchoLiteracyVerdict.prototype.stageTitle=function(){
  if(this.phase==='classify')return '어디까지가 네가 본 거야?';
  if(this.phase==='timeline'||this.phase==='gap')return '그 전에 무슨 일이 있었지?';
  if(this.phase==='hypothesis')return '안티고네는 왜 붙잡혔을까?';
  return this.messageTitle||'추론 정리';
};
Scene_EchoLiteracyVerdict.prototype.stageInstruction=function(){
  if(this.phase==='classify')return '에코의 말을 읽고 ‘봤다 / 들었다 / 그런 것 같다’ 중 어디에 들어가는지 분류하세요.';
  if(this.phase==='timeline')return '아래 사건 카드 중 가장 먼저 일어난 것부터 하나씩 골라 시간순으로 놓으세요.';
  if(this.phase==='gap')return '② 기록 반출과 ④ 호송 사이의 ??? 구간에서 집무실 안에 무슨 일이 있었는지, 현재 페메와 에코가 가진 정보만으로 알 수 있는지 판단하세요.';
  if(this.phase==='hypothesis')return '앞에서 확인한 사실과 시간 순서를 바탕으로, 지금 가장 근거 있는 가설 하나를 고르세요.';
  return '확인키를 눌러 계속하세요.';
};
Scene_EchoLiteracyVerdict.prototype.refreshPhase=function(){
  this.applyLayout();
  this._board.refresh();
  if(this.phase==='classify'){
    this._choices.show();this._choices.setItems([
      {id:'seen',tag:'직접 관찰',tagColor:'#52745b',text:'봤다',fontSize:27},
      {id:'heard',tag:'누군가의 말',tagColor:'#526a85',text:'들었다',fontSize:27},
      {id:'guess',tag:'내 생각',tagColor:'#8b5d55',text:'그런 것 같다',fontSize:27}
    ],3);this._footer.say('페메','거짓말 찾기가 아니야. 같은 정보라도 어디서 왔는지 먼저 구별해 보자.');
  }else if(this.phase==='timeline'){
    if(!Array.isArray(this.timelinePool))this.timelinePool=[];
    if(this.timelinePool.length===0&&this.timelineExpected===0)this.timelinePool=dpEchoShuffle(Array.isArray(this.timeline)?this.timeline:[]);
    this._choices.show();this._choices.setItems(this.timelinePool.map(x=>({id:x.id,text:x.text.replace(/^\S+\s/,''),tag:'사건 카드',fontSize:24,maxLines:2})),2);
    this._footer.say('페메',`가장 먼저 있었던 사건을 고르자. 현재 ${(Array.isArray(this.timelinePlaced)?this.timelinePlaced.length:0)}/4개를 놓았어.`);
  }else if(this.phase==='gap'){
    this._choices.show();this._choices.setItems([
      {id:'yes',text:'알 수 있다',tag:'집무실 안 상황',fontSize:27},
      {id:'no',text:'현재는 알 수 없다',tag:'집무실 안 상황',fontSize:27}
    ],2);
    this._footer.say('페메','에코가 본 건 호송 이후야. 내가 취재한 내용만으로도 집무실 안의 대화까지는 알 수 없어.');
  }else if(this.phase==='hypothesis'){
    this._choices.show();this._choices.setItems(this.hypotheses.map(x=>({id:x.id,text:x.text,lines:x.lines,tag:x.tag,tagColor:x.tagColor,fontSize:22,maxLines:2})),2);
    this._footer.say('페메','정답 원인을 이미 아는 게 아니야. 지금 가진 정보로 가장 가능성이 높은 설명을 골라 보자.');
  }else{
    this._choices.hide();this._choices.deactivate();this._footer.say('','결정키를 눌러 계속하세요.');
  }
};
Scene_EchoLiteracyVerdict.prototype.onChoice=function(){
  const item=this._choices.currentItem();if(!item)return;
  if(this.phase==='classify')return this.onClassify(item.id);
  if(this.phase==='timeline')return this.onTimeline(item.id);
  if(this.phase==='gap')return this.onGap(item.id);
  if(this.phase==='hypothesis')return this.onHypothesis(item.id);
};
Scene_EchoLiteracyVerdict.prototype.feedback=function(label,text,bad){if(bad)SoundManager.playBuzzer();else SoundManager.playOk();this._footer.say(label,text);this._choices.activate();};
Scene_EchoLiteracyVerdict.prototype.onClassify=function(id){
  const st=this.s1[this.s1Index];
  if(id!==st.answer){
    const fb=id==='seen'?'직접 눈으로 확인했는지 다시 생각해 보자.':id==='heard'?'누군가 실제로 말한 문장인지 확인해 보자.':'네 생각이 섞인 문장인지 확인해 보자.';
    this.classifyErrors++;return this.feedback('분류 다시 보기',fb,true);
  }
  this.s1Counts[id]++;
  if(st.answer==='guess')EchoVerdict.addQuestion('두 사람이 어떤 잘못을 했다고 판단된 것인가?');
  this.s1Index++;
  if(this.s1Index<(Array.isArray(this.s1)?this.s1.length:0)){this.feedback('분류 완료',st.why,false);this.refreshPhase();return;}
  this.showMessage('1단계 완료','에코: “……이건 제가 그냥 그렇게 생각한 거예요.”\n페메: “응. 그걸 아는 게 제일 어려운 거야. 추측은 버리는 게 아니라, 다음에 물어볼 질문으로 남겨 두면 돼.”',()=>{this.phase='timeline';this.timelinePool=[];this.timelineExpected=0;this.refreshPhase();});
};
Scene_EchoLiteracyVerdict.prototype.onTimeline=function(id){
  const expected=this.timeline[this.timelineExpected];
  if(id!==expected.id){
    let msg='앞뒤를 다시 읽어 보자.';
    if(id==='lock')msg='문이 잠기려면 먼저 두 사람이 창고 안으로 들어가야 해.';
    else if(id==='escort'&&this.timelineExpected<2)msg='호송 전에 R-17을 확인하고 기록을 가지고 나온 일이 있었어.';
    else if(id==='r17take'&&this.timelineExpected===0)msg='기록을 가지고 나오기 전에 먼저 그 기록을 확인했어.';
    this.timelineErrors++;return this.feedback('순서가 맞지 않아',msg,true);
  }
  this.timelinePlaced.push(expected.text);this.timelineExpected++;
  this.timelinePool=this.timelinePool.filter(x=>x.id!==id);
  if(this.timelineExpected>=4){this.phase='gap';this.refreshPhase();return;}
  SoundManager.playOk();this.refreshPhase();
};
Scene_EchoLiteracyVerdict.prototype.onGap=function(id){
  if(id!=='no'){
    this.timelineErrors++;
    return this.feedback('현재 정보만으로는 알 수 없어','에코는 두 사람이 호송되는 장면부터 봤고, 페메도 그때 집무실 안에 없었어. 그래서 ②와 ④ 사이에 어떤 대화와 결정이 있었는지는 아직 확인할 수 없어.',true);
  }
  this.showMessage('2단계 완료','에코: “그럼 누나들이 끌려가기 바로 전에는 무슨 일이 있었는지 모르는 거예요?”\n페메: “맞아. 그 부분은 비어 있어. 대신 앞뒤에서 확인한 사실을 연결하면, 왜 붙잡혔을 가능성이 큰지는 조심스럽게 추측해 볼 수 있어.”',()=>{this.phase='hypothesis';this.refreshPhase();});
};
Scene_EchoLiteracyVerdict.prototype.onHypothesis=function(id){
  const h=this.hypotheses.find(x=>x.id===id);if(!h)return;
  if(!h.correct){
    this.hypothesisErrors++;
    if(id==='punishment')return this.feedback('에코의 짐작이야','에코가 “뭘 잘못했나?”라고 생각했을 뿐, 누가 벌을 받는다고 설명한 적은 없어.',true);
    if(id==='election'){
      EchoVerdict.addQuestion('아가멤논은 왜 안티고네를 창고에 머물게 했는가? 재신임 투표와 관련이 있었는가?');
      return this.feedback('동기는 아직 몰라','재신임 투표가 가까운 건 사실이지만, 선거 때문에 가뒀다는 이유는 확인하지 못했어. 이건 나중에 직접 물어볼 질문이야.',true);
    }
    if(id==='water_damage')return this.feedback('앞선 조사와 맞지 않아','물길에는 고장이 없다는 사실을 이미 확인했어. 안티고네가 물길을 망가뜨렸다는 근거도 없어.',true);
    return this.feedback('다시 생각해 보자','1·2단계에서 확인한 사실과 시간 순서에 가장 잘 맞는 설명을 찾아보자.',true);
  }

  const score=(this.classifyErrors<=1?1:0)+(this.timelineErrors<=1?1:0)+(this.hypothesisErrors===0?1:0);
  EchoVerdict.testimonyAccuracy=score;EchoVerdict.broadcastAccuracy=score;
  $gameVariables.setValue(56,score);$gameSystem._dpTestimonyAccuracy=score;$gameSystem._dpTestimonySource='B';$gameSystem._dpEchoBroadcastAccuracy=score;
  EchoVerdict.addQuestion('누가 감금을 지시했고, 정확히 왜 그런 판단을 했는가?');
  EchoVerdict.solved=true;$gameSwitches.setValue(313,true);
  this.showMessage('현재 가장 타당한 가설',
    '페메: “R-17을 확인하고 기록을 가져온 일이 붙잡힌 일과 관련됐을 가능성이 가장 커 보여.”\n\n' +
    '페메: “하지만 집무실 안에서 무슨 일이 있었는지는 아직 몰라. R-17 때문이라고 확정할 수는 없어.”\n\n' +
    '페메: “정확한 이유는 나중에 직접 확인하자.”',
    ()=>{this.popScene();});
};
Scene_EchoLiteracyVerdict.prototype.showMessage=function(title,body,next){this.phase='message';this.messageTitle=title;this.messageBody=body;this.nextAction=next;this.refreshPhase();};
Scene_EchoLiteracyVerdict.prototype.update=function(){
  Scene_MenuBase.prototype.update.call(this);
  if((this.phase==='message'||this.phase==='final')&&(Input.isTriggered('ok')||TouchInput.isTriggered())){
    SoundManager.playOk();const n=this.nextAction;this.nextAction=null;if(n)n();
  }
};
Scene_EchoLiteracyVerdict.prototype.onCancel=function(){
  // Do not accidentally abandon the exercise in the middle; only cancel the current selection window sound.
  SoundManager.playBuzzer();this._choices.activate();
};
window.Scene_EchoLiteracyVerdict=Scene_EchoLiteracyVerdict;


window.DP_IsmeneTestimony={
  start(){
    $gameVariables.setValue(56,0);
    $gameSystem._dpTestimonyAccuracy=0;
    $gameSystem._dpTestimonySource='D';
    $gameSystem._dpTestimonyQuestions=[];
    $gameSystem._dpIsmeneTestimonyDone=false;
  },
  openBoard(){SceneManager.push(window.Scene_IsmeneTestimonyAccuracy);}
};

function Window_IsmeneTestimonyBoard(){this.initialize.apply(this,arguments);}
Window_IsmeneTestimonyBoard.prototype=Object.create(Window_Base.prototype);
Window_IsmeneTestimonyBoard.prototype.constructor=Window_IsmeneTestimonyBoard;
Window_IsmeneTestimonyBoard.prototype.initialize=function(rect){Window_Base.prototype.initialize.call(this,rect);this.opacity=0;this._scene=null;};
Window_IsmeneTestimonyBoard.prototype.setScene=function(scene){this._scene=scene;this.refresh();};
Window_IsmeneTestimonyBoard.prototype.refresh=function(){
  const b=this.contents,s=this._scene;b.clear();if(!s)return;
  b.fillRect(0,0,this.innerWidth,this.innerHeight,ECHO_BG);
  VerdictSkin.type(b,'label');b.fontSize=17;b.textColor='#6b5841';b.fontBold=true;
  b.drawText('공통 지표 · 증언 정확도',22,12,this.innerWidth-44,28,'left');
  VerdictSkin.type(b,'display');b.fontSize=26;b.textColor=ECHO_INK;b.fontBold=false;
  b.drawText('이스메네의 증언 정리',22,42,this.innerWidth-44,38,'left');
  b.fillRect(22,84,this.innerWidth-44,2,'rgba(70,50,30,0.35)');
  VerdictSkin.type(b,'body');b.fontSize=18;b.textColor=ECHO_MUTED;
  dpEchoWrap(b,'죄책감과 사실을 섞지 말고, 내가 직접 한 일과 확인한 일만 정확하게 말해 보자.',22,94,this.innerWidth-44,25,2);
  if(s.phase==='question'){
    const q=s.questions[s.index],x=70,y=158,w=this.innerWidth-140,h=185;dpEchoPaper(b,x,y,w,h,true);
    VerdictSkin.type(b,'label');b.fontSize=16;b.textColor='#8b5d55';
    b.drawText(`증언 문장 ${s.index+1}/3`,x+20,y+15,w-40,25,'left');
    VerdictSkin.type(b,'display');b.fontSize=25;b.textColor=ECHO_INK;
    dpEchoWrap(b,q.prompt,x+20,y+56,w-40,34,3);
    VerdictSkin.type(b,'body');b.fontSize=16;b.textColor=ECHO_MUTED;
    b.drawText('가장 정확한 문장을 고르세요.',x+20,y+h-36,w-40,24,'right');
  }else{
    const x=70,y=150,w=this.innerWidth-140,h=250;dpEchoPaper(b,x,y,w,h,true);
    VerdictSkin.type(b,'display');b.fontSize=25;b.textColor=ECHO_INK;
    b.drawText(s.messageTitle||'',x+22,y+16,w-44,34,'left');
    VerdictSkin.type(b,'body');b.fontSize=20;b.textColor=ECHO_INK;
    dpEchoWrap(b,s.messageBody||'',x+22,y+62,w-44,29,6);
    VerdictSkin.type(b,'label');b.fontSize=14;b.textColor=ECHO_MUTED;
    b.drawText('결정키(Enter/Z) : 계속',x+22,y+h-34,w-44,24,'right');
  }
};

function Scene_IsmeneTestimonyAccuracy(){this.initialize.apply(this,arguments);}
Scene_IsmeneTestimonyAccuracy.prototype=Object.create(Scene_MenuBase.prototype);
Scene_IsmeneTestimonyAccuracy.prototype.constructor=Scene_IsmeneTestimonyAccuracy;
Scene_IsmeneTestimonyAccuracy.prototype.initialize=function(){
  Scene_MenuBase.prototype.initialize.call(this);this.phase='question';this.index=0;this.score=0;this.nextAction=null;this.messageTitle='';this.messageBody='';
  this.questions=[
    {prompt:'내가 직접 한 일은 무엇이라고 말해야 할까?',correct:'location',options:[
      {id:'location',tag:'내가 한 행동',text:'대표자에게 안티고네의 위치를 알렸다.',fontSize:19,maxLines:3},
      {id:'caused',tag:'죄책감 섞임',text:'내가 안티고네를 붙잡아 창고로 보냈다.',fontSize:19,maxLines:3},
      {id:'tricked',tag:'미확인 의도',text:'대표자가 나를 속여 위치를 말하게 했다.',fontSize:19,maxLines:3}],
      good:'내가 실제로 한 행동까지만 말하면 돼. 그 뒤의 결정까지 내 행동으로 바꾸면 사실보다 커져.',
      bad:{caused:'안티고네를 데려가고 가둔 행동은 병사들이 했다. 죄책감이 크다고 해서 그 행동까지 내가 한 일이 되지는 않아.',tricked:'대표자가 어떤 의도로 부탁했는지는 아직 직접 확인하지 못했어. 의도를 사실처럼 말하면 안 돼.'}},
    {prompt:'내가 직접 확인하고 행동한 일은 무엇일까?',correct:'relay',options:[
      {id:'relay',tag:'직접 한 행동',text:'지하 중계선을 복구해 안티고네가 나올 길을 도왔다.',fontSize:18,maxLines:3},
      {id:'election',tag:'동기 추측',text:'아가멤논은 선거 때문에 안티고네를 가뒀다.',fontSize:18,maxLines:3},
      {id:'order',tag:'보지 못한 일',text:'경비병이 대표자의 감금 명령서를 보여 줬다.',fontSize:18,maxLines:3}],
      good:'지하에서 내가 직접 한 행동은 확실히 말할 수 있어. 반대로 감금의 정치적 동기는 아직 확인하지 못했어.',
      bad:{election:'재신임 투표와 사건 시점이 가깝더라도 동기는 당사자에게 확인해야 해.',order:'그런 명령서를 본 적은 없어. 없던 장면을 기억처럼 말하면 증언 전체가 약해져.'}},
    {prompt:'공청회에서는 이 일을 어떻게 말하는 게 가장 정확할까?',correct:'sequence',options:[
      {id:'blame_self',tag:'과도한 자기책임',text:'내가 안티고네를 잡히게 했다.',fontSize:19,maxLines:3},
      {id:'sequence',tag:'사실의 순서',text:'내가 안티고네의 위치를 알렸고, 그 뒤 안티고네가 감금됐다.',fontSize:18,maxLines:4},
      {id:'used',tag:'의도 단정',text:'대표자가 나를 이용해 안티고네를 감금했다.',fontSize:18,maxLines:3}],
      good:'내 행동과 그 뒤에 일어난 일을 모두 숨기지 않으면서도, 확인하지 않은 인과와 의도는 단정하지 않았어.',
      bad:{blame_self:'책임을 인정하는 것과 모든 원인을 내 탓으로 만드는 것은 달라. 실제로 한 행동과 이후 사건을 나눠 말하자.',used:'그럴 가능성을 질문할 수는 있지만, 대표자가 나를 이용하려 했다는 의도는 아직 확인하지 못했어.'}}
  ];
};
Scene_IsmeneTestimonyAccuracy.prototype.createBackground=function(){
  this._backgroundSprite=new Sprite();const w=Graphics.width,h=Graphics.height,bmp=new Bitmap(w,h),ctx=bmp.context;
  ctx.fillStyle='#2e2419';ctx.fillRect(0,0,w,h);ctx.fillStyle='#9a784e';ctx.fillRect(22,22,w-44,h-44);
  let seed=815;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<2200;i++){ctx.fillStyle=`rgba(65,45,28,${0.03+rand()*0.06})`;ctx.fillRect(22+rand()*(w-44),22+rand()*(h-44),1,1);}
  bmp._baseTexture.update();this._backgroundSprite.bitmap=bmp;this.addChild(this._backgroundSprite);
};
Scene_IsmeneTestimonyAccuracy.prototype.create=function(){
  Scene_MenuBase.prototype.create.call(this);const W=Graphics.boxWidth,H=Graphics.boxHeight;
  this._board=new Window_IsmeneTestimonyBoard(new Rectangle(34,28,W-68,H-330));this._board.setScene(this);this.addWindow(this._board);
  this._choices=new Window_EchoLiteracyChoices(new Rectangle(52,H-292,W-104,176));this._choices.setHandler('ok',this.onChoice.bind(this));this._choices.setHandler('cancel',this.onCancel.bind(this));this.addWindow(this._choices);
  this._footer=new Window_EchoLiteracyFooter(new Rectangle(34,H-108,W-68,84));this.addWindow(this._footer);this.refreshPhase();
};
Scene_IsmeneTestimonyAccuracy.prototype.refreshPhase=function(){
  this._board.refresh();
  if(this.phase==='question'){
    const q=this.questions[this.index];this._choices.show();this._choices.setItems(q.options,3);
    this._footer.say('이스메네',this.index===0?'내가 한 일은 숨기지 않을게. 하지만 확인하지 않은 일까지 내 잘못이라고 말하지도 않을 거야.':'죄책감보다 사실을 먼저 보자. 내가 직접 한 일과 확인한 일만 정확하게 말하면 돼.');
  }else{this._choices.hide();this._choices.deactivate();this._footer.say('','결정키를 눌러 계속하세요.');}
};
Scene_IsmeneTestimonyAccuracy.prototype.onChoice=function(){
  const item=this._choices.currentItem(),q=this.questions[this.index];if(!item||!q)return;
  const ok=item.id===q.correct;if(ok)this.score++;
  if(ok)SoundManager.playOk();else SoundManager.playBuzzer();
  const body=ok?q.good:(q.bad[item.id]||'내가 직접 확인한 범위와 문장의 강도를 다시 구분해 보자.');
  const nextIndex=this.index+1;
  this.showMessage(ok?'표현 적절':'표현 주의',body,()=>{
    this.index=nextIndex;
    if(this.index<3){this.phase='question';this.refreshPhase();}
    else this.finishResult();
  });
};
Scene_IsmeneTestimonyAccuracy.prototype.finishResult=function(){
  $gameVariables.setValue(56,this.score);$gameSystem._dpTestimonyAccuracy=this.score;$gameSystem._dpTestimonySource='D';$gameSystem._dpIsmeneTestimonyDone=true;
  const grade=this.score===3?'내가 한 행동, 확인한 사실, 아직 모르는 의도를 정확히 구분했다.':`3문장 중 ${this.score}문장이 근거의 범위와 정확히 맞았다. 죄책감 때문에 사실보다 크게 말한 부분은 공청회에서 다시 조심해야 한다.`;
  this.showMessage(`증언 정확도 ${this.score}/3`,grade+'\n\n이스메네: “내가 한 일은 숨기지 않을게. 하지만 내가 확인하지 않은 것까지 내 잘못이라고 말하지도 않을 거야.”',()=>{this.popScene();});
};
Scene_IsmeneTestimonyAccuracy.prototype.showMessage=function(title,body,next){this.phase='message';this.messageTitle=title;this.messageBody=body;this.nextAction=next;this.refreshPhase();this._board.refresh();};
Scene_IsmeneTestimonyAccuracy.prototype.update=function(){
  Scene_MenuBase.prototype.update.call(this);
  if(this.phase==='message'&&(Input.isTriggered('ok')||TouchInput.isTriggered())){SoundManager.playOk();const n=this.nextAction;this.nextAction=null;if(n)n();}
};
Scene_IsmeneTestimonyAccuracy.prototype.onCancel=function(){SoundManager.playBuzzer();this._choices.activate();};
window.Scene_IsmeneTestimonyAccuracy=Scene_IsmeneTestimonyAccuracy;

})();
