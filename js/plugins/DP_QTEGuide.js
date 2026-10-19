/*:
 * @target MZ
 * @plugindesc QTE 시작 전 조작 설명과 영상 기반 시범·연습 연결 v1.0
 * @author Dry Promise
 * @help
 * 플러그인 목록의 맨 아래에 둡니다. tutorial/index.html을 함께 배포하세요.
 * Synrec_QTE와 두 수레 연타 시작 함수를 감싸며 원작 판정은 변경하지 않습니다.
 * 안내 중에는 이벤트와 맵 업데이트를 멈춥니다. 연습 결과는 게임에 반영하지 않습니다.
 * 영상으로 확인한 9개 상황만 해당 시범으로 연결합니다. 그 밖의 QTE는 실제
 * 시작 인자의 버튼·제한 시간으로 설명하며 다른 상황의 영상을 대신 보여주지 않습니다.
 */
(() => {
    'use strict';
    const LABEL = {left:'왼쪽 ◀',right:'오른쪽 ▶',up:'위 ▲',down:'아래 ▼',ok:'결정 ●',cancel:'메뉴 ☰',pageup:'Page Up',pagedown:'Page Down'};
    const profiles = [
        {id:'canal',map:19,event:22,page:0,command:15,keys:['left','right','up'],frames:210,penalty:45,title:'수로를 점검해요'},
        {id:'door',map:19,event:12,page:0,command:19,keys:Array(8).fill('ok'),frames:210,penalty:18,title:'잠긴 문을 열어요'},
        {id:'crossing',map:30,event:14,page:0,command:7,keys:['right','up','right'],frames:165,penalty:40,title:'좁은 수로를 건너요'},
        {id:'relay',map:21,event:5,page:3,command:6,keys:['left','up','right','down','up'],frames:180,penalty:30,title:'중계기를 켜요'},
        {id:'cartSolo',map:32,event:4,page:1,command:37,keys:['left','right','up','down','right'],frames:195,penalty:15,title:'혼자 수레를 밀어요'},
        {id:'cartTogether',map:32,event:4,page:4,command:8,keys:['left','right','up','down','right'],frames:240,penalty:15,title:'함께 수레를 밀어요'},
        {id:'latch',map:34,event:1,page:0,command:11,keys:Array(8).fill('ok'),frames:180,penalty:10,title:'바깥 잠금장치를 풀어요'},
        {id:'cartInside',map:32,event:8,page:0,command:24,keys:['left','up','right','down'],frames:240,penalty:15,title:'문 앞 수레를 옮겨요'}
    ];
    let active = null;
    let executing = null;
    const signalRuns = new WeakSet();
    const keysDown = new Set();
    const pointersDown = new Set();
    const engineKeys = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyZ','KeyX','Enter','Space','Escape','PageUp','PageDown']);

    function clearInput() {
        Input.clear();
        TouchInput.clear();
        if ($gameTemp) $gameTemp.clearDestination();
    }
    function context() {
        const map = $gameMap.mapId();
        const event = executing ? executing.eventId() : 0;
        const mapEvent = $gameMap.event(event);
        return {map,event,page:mapEvent ? mapEvent._pageIndex : -1,command:executing ? executing._index : -1,interpreter:executing};
    }
    function descriptor(args,ctx) {
        const [buttons,random,frames,penalty] = args;
        const matches = p => ctx.map===p.map && ctx.event===p.event && ctx.page===p.page && ctx.command===p.command &&
            !random && Number(frames)===p.frames && Number(penalty)===p.penalty && JSON.stringify(buttons)===JSON.stringify(p.keys);
        const profile = profiles.find(matches);
        const signalIndex = [18,31,44,57,70].indexOf(ctx.command);
        const signalKeys = ['right','left','up','down','right'];
        const signals = ctx.map===15 && ctx.event===31 && ctx.page===0 && signalIndex>=0 && !random &&
            frames===75 && penalty===15 && buttons.length===1 && buttons[0]===signalKeys[signalIndex];
        if (signals && signalIndex>0 && signalRuns.has(ctx.interpreter)) return null;
        if (signals) signalRuns.add(ctx.interpreter);
        const repeat = buttons.length>1 && buttons.every(k=>k==='ok');
        return {
            lesson: signals ? 'signals' : profile ? profile.id : null,
            title: signals ? '하나씩 뜨는 신호를 맞혀요' : profile ? profile.title : repeat ? '결정 버튼을 누르고 떼요' : '표시와 같은 방향을 눌러요',
            keys:buttons.slice(),frames,penalty,random,repeat,signals,
            goal: signals ? '화살표가 하나 뜰 때마다 같은 방향을 맞혀요.' : repeat ? 'OK 표시를 모두 없애요.' : '맨 왼쪽 표시부터 순서대로 맞혀요.',
            instruction: signals ? '화살표가 뜨면 같은 방향키를 바로 한 번 누르고 손을 떼세요.' : repeat ? `OK가 보이면 오른쪽 ●를 한 번 누르고 손을 떼세요. ${buttons.length}번 반복해요.` : '화살표가 뜨면 같은 방향키를 한 번 누르고 손을 떼세요. 다음 표시도 차례로 눌러요.',
            tip: signals ? '‘신호 일치’가 나오면 ●를 한 번 눌러 다음 신호를 보세요. 다섯 신호를 맞혀요.' : repeat ? '길게 누르고 있으면 한 번만 세어요. 톡, 손 떼기! 다시 톡, 손 떼기!' : '남은 표시가 맨 왼쪽으로 옮겨 와요. 여러 버튼을 한꺼번에 누르지 마세요.'
        };
    }
    function element(tag,className,text) {
        const e=document.createElement(tag);
        if(className)e.className=className;
        if(text)e.textContent=text;
        return e;
    }
    function installStyle() {
        if(document.getElementById('dp-qte-guide-style'))return;
        const css=element('style');css.id='dp-qte-guide-style';
        css.textContent=`
        body.dp-qte-guide-open #dp-touch-controls{visibility:hidden!important;pointer-events:none!important}
        #dp-qte-guide{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;background:#0b191ce6;color:#173c39;font-family:system-ui,-apple-system,'Malgun Gothic',sans-serif;touch-action:none;user-select:none;box-sizing:border-box;padding:22px}
        #dp-qte-guide *{box-sizing:border-box}
        #dp-qte-guide [hidden]{display:none!important}
        .dq-panel{width:min(880px,100%);max-height:100%;overflow:auto;background:#f5f4ed;border:2px solid #e4dabf;border-radius:22px;padding:26px 32px;box-shadow:0 20px 60px #0008;touch-action:pan-y}
        .dq-kicker{font-size:14px;font-weight:800;color:#16664e;margin:0 0 7px}
        .dq-title{font-size:30px;line-height:1.25;margin:0 0 12px;letter-spacing:-.04em}
        .dq-goal{font-size:21px;font-weight:750;margin:0 0 16px}
        .dq-signals{display:flex;gap:7px;align-items:center;padding:12px 16px;background:#e4ece0;border-radius:12px;margin:0 0 14px;flex-wrap:wrap}
        .dq-signals img{width:48px;height:48px;object-fit:contain}
        .dq-signals span{font-size:18px;font-weight:700}
        .dq-copy{font-size:21px;line-height:1.6;margin:10px 0;word-break:keep-all}
        .dq-tip{font-size:17px;line-height:1.55;color:#49615a;margin:8px 0 12px;word-break:keep-all}
        .dq-time{font-size:15px;line-height:1.5;border-top:1px solid #cbd7c6;padding-top:12px;color:#52655c;margin:0}
        .dq-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}
        #dp-qte-guide button{font:700 18px system-ui,sans-serif;min-height:50px;padding:10px 22px;border:1px solid #b7c7b1;border-radius:12px;background:#fff;color:#173c39;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
        #dp-qte-guide button:focus-visible{outline:4px solid #eab94b;outline-offset:3px}
        #dp-qte-guide .dq-start{background:#16664e;color:white;border-color:#16664e}
        .dq-ready{font-size:60px;text-align:center;font-weight:800;margin:20px 0}
        .dq-ready-note{text-align:center;font-size:21px;line-height:1.5;margin:10px 0}
        .dq-frame{position:absolute;inset:0;border:0;width:100%;height:100%;background:#f5f4ed}
        #dp-qte-guide .dq-return{position:absolute;right:20px;top:5px;z-index:1;font-size:14px;min-height:44px;padding:8px 14px}
        @media(max-height:650px){#dp-qte-guide{padding:12px}.dq-panel{padding:16px 24px}.dq-title{font-size:26px;margin-bottom:8px}.dq-goal{font-size:19px;margin-bottom:10px}.dq-copy{font-size:19px;margin:7px 0}.dq-tip{font-size:16px}.dq-signals{padding:8px 12px;margin-bottom:8px}.dq-actions{margin-top:12px}.dq-time{padding-top:8px}}
        `;
        document.head.append(css);
    }
    function showGuide(info,resume) {
        if(active)throw new Error('A second QTE cannot start while its guide is open.');
        installStyle();
        const root=element('div');root.id='dp-qte-guide';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label',info.title+' 조작 안내');
        const panel=element('section','dq-panel');root.append(panel);
        active={info,resume,root,panel,phase:'intro',timer:0,frame:null,scene:SceneManager._scene,temp:$gameTemp};
        clearInput();
        document.body.classList.add('dp-qte-guide-open');
        document.body.append(root);
        for(const event of ['pointerdown','pointerup','pointermove','pointercancel','click','touchstart','touchend','touchmove','wheel'])root.addEventListener(event,e=>e.stopPropagation());
        renderIntro();
    }
    function renderIntro() {
        if(!active)return;
        const a=active;clearTimeout(a.timer);a.phase='intro';a.panel.hidden=false;a.panel.replaceChildren();
        if(a.frame){a.frame.remove();a.frame=null;}
        a.root.querySelector('.dq-return')?.remove();
        const i=a.info;
        a.panel.append(element('p','dq-kicker','시작하기 전에 · 조작 방법'),element('h1','dq-title',i.title),element('p','dq-goal',i.goal));
        const signals=element('div','dq-signals');
        if(i.mash)signals.append(element('span','',`● 누르고 떼기 × ${i.goalCount}번`));
        else if(i.signals||i.random)signals.append(element('span','',i.signals?'화살표 하나 → 같은 방향키 → 손 떼기':'화면에 뜨는 표시를 보고 눌러요'));
        else for(const key of i.keys){
            if(['up','down','left','right','ok'].includes(key)){
                const image=element('img');image.src=`img/pictures/button_${key}2.png`;image.alt=LABEL[key];signals.append(image);
            }else signals.append(element('span','',LABEL[key]||key));
        }
        a.panel.append(signals,element('p','dq-copy',i.instruction),element('p','dq-tip',i.tip));
        const limit=Number((i.frames/60).toFixed(2));
        const time=i.mash?`시작 후 ${limit}초 안에 ${i.goalCount}번 눌러요.`:`${i.signals?'신호 하나마다':'전체 표시를'} ${limit}초 안에 맞혀요.${i.penalty>0?' 다른 버튼을 누르면 남은 시간이 줄어요.':''}`;
        a.panel.append(element('p','dq-time',time+' 설명·연습 중에는 게임 시간이 흐르지 않아요.'));
        const actions=element('div','dq-actions');
        if(i.lesson){const practice=element('button','','시범·연습 보기');practice.id='dp-qte-practice';practice.onclick=openPractice;actions.append(practice);}
        const start=element('button','dq-start','준비됐어요 · 게임 시작');start.id='dp-qte-start';start.onclick=beginCountdown;actions.append(start);a.panel.append(actions);start.focus({preventScroll:true});
    }
    function openPractice() {
        if(!active||!active.info.lesson)return;
        const a=active;a.phase='practice';a.panel.hidden=true;
        const frame=element('iframe','dq-frame');frame.id='dp-qte-practice-frame';frame.title=a.info.title+' 시범과 연습';
        frame.src=`tutorial/index.html?embed=1&lesson=${encodeURIComponent(a.info.lesson)}`;
        a.frame=frame;a.root.append(frame);
        const back=element('button','dq-return','게임 설명으로 돌아가기');back.id='dp-qte-return';back.onclick=renderIntro;a.root.append(back);
        frame.addEventListener('error',renderIntro);
    }
    function beginCountdown() {
        if(!active||active.phase!=='intro')return;
        const a=active;a.phase='countdown';a.panel.replaceChildren(element('h1','dq-title',a.info.title));
        const count=element('div','dq-ready','3');count.setAttribute('role','status');const note=element('p','dq-ready-note','손을 떼고 기다리세요. 표시가 뜨면 눌러요.');
        const back=element('button','','설명 다시 보기');back.onclick=renderIntro;
        a.panel.append(count,note,back);let n=3;
        const step=()=>{
            if(active!==a||a.phase!=='countdown')return;
            if(document.hidden){renderIntro();return;}
            if(n>1){count.textContent=String(--n);a.timer=setTimeout(step,650);return;}
            if(keysDown.size||pointersDown.size){count.textContent='손 떼기';note.textContent='누르고 있는 버튼에서 손을 떼면 시작해요.';a.timer=setTimeout(step,80);return;}
            finishGuide(a);
        };
        a.timer=setTimeout(step,650);
    }
    function finishGuide(a) {
        if(active!==a)return;
        clearTimeout(a.timer);a.root.remove();document.body.classList.remove('dp-qte-guide-open');active=null;
        clearInput();
        // Do not carry the confirmation touch or keyboard trigger into the first QTE.
        if(SceneManager._scene===a.scene&&$gameTemp===a.temp)a.resume();
        Graphics._canvas?.focus({preventScroll:true});
    }
    function discardGuide() {
        if(!active)return;
        clearTimeout(active.timer);active.root.remove();active=null;
        document.body.classList.remove('dp-qte-guide-open');clearInput();
    }
    const executeCommand=Game_Interpreter.prototype.executeCommand;
    Game_Interpreter.prototype.executeCommand=function(){
        const previous=executing;executing=this;
        try{return executeCommand.call(this);}finally{executing=previous;}
    };
    const updateWait=Game_Interpreter.prototype.updateWait;
    Game_Interpreter.prototype.updateWait=function(){return !!active||updateWait.call(this);};
    const updateScene=SceneManager.updateScene;
    SceneManager.updateScene=function(){
        if(active){
            if(this._scene!==active.scene||$gameTemp!==active.temp){discardGuide();}
            else return;
        }
        updateScene.call(this);
    };
    const beginQTE=Game_Temp.prototype.beginQTE;
    Game_Temp.prototype.beginQTE=function(...args){
        if(!(SceneManager._scene instanceof Scene_Map)||!Array.isArray(args[0])||args[0].length===0)return beginQTE.apply(this,args);
        const info=descriptor(args,context());
        if(!info)return beginQTE.apply(this,args);
        const temp=this;const copy=args.slice();copy[0]=args[0].slice();
        showGuide(info,()=>beginQTE.apply(temp,copy));
    };
    function wrapMash(api,method,stateKey) {
        if(!api||typeof api[method]!=='function')return;
        const original=api[method];
        api[method]=function(...args){
            // Initialize the original state to read its actual, possibly retry-adjusted goal.
            // Its first update is blocked until the guide closes; arming starts the clock then.
            const result=original.apply(this,args);const s=$gameTemp[stateKey];
            if(!s||!s.active)return result;
            showGuide({mash:true,lesson:null,title:'수레를 힘껏 밀어요',frames:s.total,goalCount:s.goal,
                goal:`오른쪽 ●를 ${s.goal}번 누르고 떼요.`,
                instruction:`시작하면 ● 결정 버튼을 한 번 누르고 손을 떼세요. ${s.goal}번 빠르게 반복해요.`,
                tip:'길게 누르면 한 번만 세어요. 화면의 횟수가 올라가는지 보면서 톡, 손 떼기를 반복해요.'},()=>{});
            return result;
        };
    }
    wrapMash(window.DPRescue,'startEchoCartMash','_dpEchoCartMash');
    wrapMash(window.DP_EchoRoute,'startMash','_dpEchoRouteMash');
    window.addEventListener('message',e=>{
        if(active?.frame&&e.source===active.frame.contentWindow&&e.data?.type==='DP_QTE_TUTORIAL_CLOSE')renderIntro();
    });
    window.addEventListener('keydown',e=>{
        if(engineKeys.has(e.code))keysDown.add(e.code);
        if(!active)return;
        if(e.key==='Tab'){
            const buttons=[...active.root.querySelectorAll('button')].filter(b=>b.offsetParent!==null);
            if(buttons.length){e.preventDefault();const n=buttons.indexOf(document.activeElement);buttons[(n+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}
        }else if(engineKeys.has(e.code)){
            e.preventDefault();
            if((e.code==='Enter'||e.code==='Space')&&!e.repeat&&document.activeElement?.tagName==='BUTTON')document.activeElement.click();
        }
        e.stopPropagation();
    },true);
    window.addEventListener('keyup',e=>{keysDown.delete(e.code);if(active&&engineKeys.has(e.code)){e.preventDefault();e.stopPropagation();}},true);
    window.addEventListener('pointerdown',e=>{pointersDown.add(e.pointerId);},true);
    for(const event of ['pointerup','pointercancel'])window.addEventListener(event,e=>pointersDown.delete(e.pointerId),true);
    function interrupted(){keysDown.clear();pointersDown.clear();if(active?.phase==='countdown')renderIntro();}
    window.addEventListener('blur',interrupted);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)interrupted();});
    // Read-only inspection for integration checks; it cannot start or complete a QTE.
    window.DP_QTEGuide={state:()=>active?{phase:active.phase,lesson:active.info.lesson,title:active.info.title}:null};
})();
