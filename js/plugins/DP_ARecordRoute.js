/*:
 * @target MZ
 * @plugindesc Dry Promise A route — official record verification mini-game and route support.
 * @author OpenAI
 * @help
 * A route only. Draws the 960x800 record-verification mini-game without external PNG assets.
 */
(() => {
  'use strict';
  const SW_RECORD_DONE = 351;
  const QUEST_TEXT = {
    S01_A_FIND_TALOS: '탈로스를 찾아가자.',
    S01_A_RETURN_THEMIS: '테미스로 돌아가 감금 기록을 확인하자.',
    S01_A_ASK_AGAMEMNON: '아가멤논에게 빠진 과정을 묻자.'
  };

  const _questGuideText = Game_System.prototype.questGuideText;
  Game_System.prototype.questGuideText = function() {
    const id = this.questGuideId ? this.questGuideId() : '';
    if (QUEST_TEXT[id]) return QUEST_TEXT[id];
    return _questGuideText ? _questGuideText.call(this) : (id ? `퀘스트 ${id}` : '');
  };

  const _updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function() {
    if (this._waitMode === 'dpARecordCheck') {
      if ($gameTemp && $gameTemp._dpARecordCheckActive) return true;
      this._waitMode = '';
      return false;
    }
    return _updateWaitMode.call(this);
  };

  const COLORS = {
    bg:'#17130f', panel:'#2a241d', panel2:'#332a21', edge:'#8b785d',
    text:'#fff8ec', sub:'#d8c9b3', gold:'#e7c77f', accent:'#c86b52',
    good:'#9ac49a', muted:'#7f776d', stamp:'#d74b42', black:'#0d0b09'
  };

  function rect(x,y,w,h){ return new Rectangle(x,y,w,h); }
  function contains(r,x,y){ return x>=r.x && y>=r.y && x<r.x+r.width && y<r.y+r.height; }
  function shuffle(arr){
    const a=arr.slice();
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  class Scene_ARecordCheck extends Scene_Base {
    create(){
      super.create();
      $gameTemp._dpARecordCheckActive = true;
      this._stage=1;
      this._order=[];
      this._cards=shuffle([
        {id:'A',text:'아가멤논이 둘에게 발표 때까지 기다리라고 했다.'},
        {id:'B',text:'비아가 이동을 막는 조치라고 반대했다.'},
        {id:'C',text:'비아가 집행을 거부하자 아가멤논이 경비에게 명령했다.'},
        {id:'D',text:'경비가 둘을 데려가 창고 문을 밖에서 잠갔다.'}
      ]);
      this._selectedMissing=[];
      this._feedback='';
      this._stampCount=0;
      this._stampTimer=0;
      this._locked=false;
      this._buttons=[];
      this._root=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));
      this.addChild(this._root);
      this.redraw();
    }

    update(){
      super.update();
      if(this._locked && this._stage===3){
        this._stampTimer++;
        if(this._stampCount<2 && this._stampTimer>=18){
          this._stampTimer=0;
          this._stampCount++;
          AudioManager.playSe({name:'Decision1',volume:80,pitch:95,pan:0});
          this.redraw();
          if(this._stampCount>=2){ this._locked=false; this.redraw(); }
        }
      }
      if(TouchInput.isTriggered()){
        const x=TouchInput.x, y=TouchInput.y;
        for(const b of this._buttons){
          if(b.enabled!==false && contains(b.rect,x,y)){ b.action(); return; }
        }
      }
    }

    bitmap(){ return this._root.bitmap; }
    clear(){ this.bitmap().clear(); this._buttons=[]; }
    fill(r,color){ this.bitmap().fillRect(r.x,r.y,r.width,r.height,color); }
    panel(r,fill=COLORS.panel,edge=COLORS.edge){
      this.fill(r,edge); this.fill(rect(r.x+2,r.y+2,r.width-4,r.height-4),fill);
    }
    text(t,x,y,w,h=36,size=22,color=COLORS.text,align='left',bold=false){
      const b=this.bitmap(); b.fontFace=$gameSystem.mainFontFace(); b.fontSize=size; b.fontBold=bold;
      b.textColor=color; b.outlineColor='rgba(0,0,0,0.78)'; b.outlineWidth=3;
      b.drawText(String(t),x,y,w,h,align); b.fontBold=false;
    }
    wrapped(t,r,size=20,color=COLORS.text,lineH=30,align='left'){
      const b=this.bitmap(); b.fontFace=$gameSystem.mainFontFace(); b.fontSize=size; b.textColor=color;
      b.outlineColor='rgba(0,0,0,0.78)'; b.outlineWidth=3;
      const words=String(t).split(' '); const lines=[]; let line='';
      for(const word of words){
        const test=line ? `${line} ${word}` : word;
        if(b.measureTextWidth(test)>r.width && line){ lines.push(line); line=word; }
        else line=test;
      }
      if(line) lines.push(line);
      lines.slice(0,Math.floor(r.height/lineH)).forEach((ln,i)=>b.drawText(ln,r.x,r.y+i*lineH,r.width,lineH,align));
    }
    button(label,r,action,enabled=true,fill=COLORS.panel2){
      this.panel(r,enabled?fill:'#27231f',enabled?COLORS.gold:COLORS.muted);
      this.text(label,r.x,r.y+(r.height-36)/2,r.width,36,20,enabled?COLORS.text:COLORS.muted,'center',true);
      this._buttons.push({rect:r,action,enabled});
    }
    header(label,title,instruction){
      this.text(label,38,22,300,36,20,COLORS.gold,'left',true);
      this.text(title,38,58,884,54,34,COLORS.text,'left',true);
      this.wrapped(instruction,rect(40,112,880,64),20,COLORS.sub,30,'left');
    }
    feedback(){
      if(!this._feedback) return;
      const r=rect(60,704,840,54); this.panel(r,'#3a2520',COLORS.accent);
      this.text(this._feedback,r.x+14,r.y+8,r.width-28,36,18,'#ffe2d9','center',false);
    }

    redraw(){
      this.clear(); this.fill(rect(0,0,Graphics.boxWidth,Graphics.boxHeight),COLORS.bg);
      if(this._stage===1) this.drawStage1();
      else if(this._stage===2) this.drawStage2();
      else if(this._stage===3) this.drawStage3();
      else if(this._stage===4) this.drawStage4();
      else this.drawComplete();
      this.feedback();
    }

    drawStage1(){
      this.header('1단계 · 과정 재구성','비아가 직접 본 순서를 맞춰 보자.','아래 네 카드를 실제로 일어난 순서대로 1 → 2 → 3 → 4 슬롯에 넣으세요.');
      const slotY=182, slotW=205, gap=16, startX=46;
      for(let i=0;i<4;i++){
        const r=rect(startX+i*(slotW+gap),slotY,slotW,96); this.panel(r,'#24201b','#6f614e');
        this.text(String(i+1),r.x+10,r.y+8,32,30,19,COLORS.gold,'center',true);
        const id=this._order[i];
        if(id){ const card=this._cards.find(c=>c.id===id); this.wrapped(card.text,rect(r.x+40,r.y+12,r.width-50,r.height-18),17,COLORS.text,24,'left'); }
        else this.text('빈 슬롯',r.x+40,r.y+30,r.width-52,30,17,COLORS.muted,'center');
      }
      const y=318, cardW=205, cardH=205;
      this._cards.forEach((card,i)=>{
        const used=this._order.includes(card.id); const r=rect(startX+i*(cardW+gap),y,cardW,cardH);
        this.panel(r,used?'#24211e':COLORS.panel2,used?'#514a42':COLORS.edge);
        this.text(card.id,r.x+12,r.y+10,30,32,20,used?COLORS.muted:COLORS.gold,'center',true);
        this.wrapped(card.text,rect(r.x+18,r.y+52,r.width-36,118),18,used?COLORS.muted:COLORS.text,28,'center');
        if(!used) this._buttons.push({rect:r,enabled:true,action:()=>{ if(this._order.length<4){this._order.push(card.id);this._feedback='';this.redraw();} }});
      });
      this.button('초기화',rect(288,552,170,50),()=>{this._order=[];this._feedback='';this.redraw();});
      this.button('확인',rect(502,552,170,50),()=>this.checkStage1(),this._order.length===4,'#403426');
    }
    checkStage1(){
      if(this._order.join('')==='ABCD'){
        this._feedback='비아가 직접 본 과정이 정리되었습니다.'; this._stage=2; this.redraw();
      } else {
        this._feedback='탈로스: 비아가 반대한 건 경비에게 명령하기 전이었어.'; this._order=[]; this.redraw();
      }
    }

    drawStage2(){
      this.header('2단계 · 기록 비교','실제로 있었던 일과 공식 기록을 비교하자.','양쪽을 읽어 보고, 공식 기록이 실제 과정을 충분히 담고 있는지 확인하세요.');
      const left=rect(44,182,420,454), right=rect(496,182,420,454);
      this.panel(left,'#25211c','#75644e'); this.panel(right,'#25211c','#75644e');
      this.text('실제로 있었던 일',left.x+18,left.y+14,left.width-36,38,23,COLORS.gold,'center',true);
      const actual=['발표 전까지 기다리라고 함','비아가 조치에 반대함','비아가 집행을 거부함','경비에게 대신 집행시킴','창고 문을 밖에서 잠금'];
      actual.forEach((t,i)=>{this.text('✓',left.x+24,left.y+72+i*62,32,34,22,COLORS.good,'center',true);this.wrapped(t,rect(left.x+62,left.y+70+i*62,left.width-86,48),19,COLORS.text,26,'left');});
      this.text('테미스 공식 기록',right.x+18,right.y+14,right.width-36,38,23,COLORS.gold,'center',true);
      this.text('「임시 대기 조치」',right.x+24,right.y+68,right.width-48,42,24,COLORS.text,'center',true);
      const rows=[['목적','발표 전 혼란 방지'],['결정','대표자'],['집행','경비'],['종료','발표 후']];
      rows.forEach((row,i)=>{const yy=right.y+142+i*64;this.text(row[0],right.x+28,yy,92,34,18,COLORS.sub,'left',true);this.text(row[1],right.x+126,yy,right.width-154,34,19,COLORS.text,'left');});
      this.wrapped('이 기록에는 실제 과정 중 일부가 보이지 않습니다.',rect(right.x+30,right.y+410,right.width-60,40),18,COLORS.accent,28,'center');
      this.button('빠진 과정 찾기',rect(360,658,240,52),()=>{this._stage=3;this._feedback='';this.redraw();},true,'#403426');
    }

    drawStage3(){
      this.header('3단계 · 누락 찾기','무엇이 공식 기록에서 빠졌을까요?','아래 네 항목 중 공식 기록에 빠진 중요한 사실 두 개를 고르세요.');
      const opts=[
        {id:1,text:'대표자가 지시했다'},
        {id:2,text:'발표 뒤 끝날 예정이었다'},
        {id:3,text:'비아가 반대하고 집행을 거부했다'},
        {id:4,text:'창고 문을 밖에서 잠갔다'}
      ];
      const positions=[rect(62,204,398,145),rect(500,204,398,145),rect(62,378,398,145),rect(500,378,398,145)];
      opts.forEach((o,i)=>{
        const sel=this._selectedMissing.includes(o.id); const r=positions[i];
        this.panel(r,sel?'#3b3124':COLORS.panel2,sel?COLORS.gold:COLORS.edge);
        this.text(String(o.id),r.x+14,r.y+12,34,34,21,sel?COLORS.gold:COLORS.sub,'center',true);
        this.wrapped(o.text,rect(r.x+58,r.y+26,r.width-82,80),20,sel?COLORS.text:COLORS.sub,30,'center');
        if(this._stampCount>0 && o.id===3) this.drawStamp(r);
        if(this._stampCount>1 && o.id===4) this.drawStamp(r);
        if(!this._locked && this._stampCount<2) this._buttons.push({rect:r,enabled:true,action:()=>this.toggleMissing(o.id)});
      });
      if(this._stampCount>=2){
        this.wrapped('공식 기록에는 실제 과정의 중요한 부분이 빠져 있었습니다.',rect(110,552,740,50),22,COLORS.gold,32,'center');
        this.button('마지막 판단',rect(360,622,240,52),()=>{this._stage=4;this._feedback='';this.redraw();},!this._locked,'#403426');
      } else {
        this.button('선택 초기화',rect(274,574,190,50),()=>{this._selectedMissing=[];this._feedback='';this.redraw();},!this._locked);
        this.button('확인',rect(496,574,190,50),()=>this.checkMissing(),this._selectedMissing.length===2 && !this._locked,'#403426');
      }
    }
    toggleMissing(id){
      const idx=this._selectedMissing.indexOf(id);
      if(idx>=0) this._selectedMissing.splice(idx,1);
      else if(this._selectedMissing.length<2) this._selectedMissing.push(id);
      this._feedback=''; this.redraw();
    }
    checkMissing(){
      const s=this._selectedMissing.slice().sort((a,b)=>a-b).join(',');
      if(s==='3,4'){
        this._feedback=''; this._locked=true; this._stampCount=0; this._stampTimer=0; this.redraw();
      } else {
        this._feedback='기록에 이미 적힌 내용과 실제 과정에서 빠진 내용을 다시 비교해 보자.'; this._selectedMissing=[]; this.redraw();
      }
    }
    drawStamp(r){
      const sr=rect(r.x+r.width-132,r.y+r.height-52,114,36); this.fill(sr,'rgba(115,20,20,0.82)');
      this.text('기록 누락',sr.x,sr.y+2,sr.width,30,18,'#ffd9d6','center',true);
    }

    drawStage4(){
      this.header('마지막 판단','이 기록만 읽은 시민은 실제로 어떤 일이 있었는지 제대로 알 수 있을까요?','가장 알맞은 답을 하나 고르세요.');
      const r1=rect(118,260,320,116), r2=rect(522,260,320,116);
      this.button('① 알 수 있다',r1,()=>this.answerJudgement(1),true,'#312a23');
      this.button('② 알기 어렵다',r2,()=>this.answerJudgement(2),true,'#312a23');
      this.panel(rect(116,430,728,150),'#24201b','#6e604e');
      this.wrapped('기록은 시민이 나중에 과정을 확인할 수 있게 하는 장치입니다. 중요한 반대와 실제 집행 방식이 빠지면 같은 일을 다르게 이해할 수 있습니다.',rect(144,462,672,92),20,COLORS.sub,31,'center');
    }
    answerJudgement(v){
      if(v===2){ this._stage=5; this._feedback=''; this.redraw(); }
      else { this._feedback='공식 기록에 빠져 있던 두 사실이 시민의 이해를 어떻게 바꾸는지 다시 생각해 보자.'; this.redraw(); }
    }

    drawComplete(){
      this.header('기록 검증 완료','빠진 과정을 찾았습니다.','비아가 직접 본 과정과 공식 기록을 비교해, 기록에서 빠진 중요한 사실을 확인했습니다.');
      this.panel(rect(96,220,768,310),'#28221c','#867154');
      this.text('확인된 기록 누락',130,250,700,42,26,COLORS.gold,'center',true);
      this.text('• 비아의 공식 반대·집행 거부',150,328,660,42,23,COLORS.text,'left');
      this.text('• 창고 문 외부 잠금',150,390,660,42,23,COLORS.text,'left');
      this.wrapped('좋은 뜻으로 한 결정이어도, 실제로 어떤 과정을 거쳤는지는 기록되고 확인되어야 합니다.',rect(130,458,700,60),20,COLORS.sub,30,'center');
      this.button('테미스로 돌아가기',rect(336,590,288,58),()=>this.finishGame(),true,'#403426');
    }

    finishGame(){
      $gameSwitches.setValue(SW_RECORD_DONE,true);
      $gameSystem._dpARecordCheckResult={order:['A','B','C','D'],missing:[3,4],judgement:2};
      $gameTemp._dpARecordCheckActive=false;
      SceneManager.pop();
    }
  }

  window.DP_ARecordRoute = {
    openRecordCheck(interpreter){
      $gameTemp._dpARecordCheckActive=true;
      if(interpreter && interpreter.setWaitMode) interpreter.setWaitMode('dpARecordCheck');
      SceneManager.push(Scene_ARecordCheck);
    }
  };
})();
