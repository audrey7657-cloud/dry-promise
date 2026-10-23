/*:
 * @target MZ
 * @plugindesc 기존 Window 스킨과 게임 글꼴을 사용하는 조작 안내 UI
 * @author Dry Promise
 * @help DP_QTEGuide와 DP_PlayHelp보다 위에 둡니다.
 */
(() => {
  'use strict';
  function skin(width,height,row=false,selected=false) {
    const w=Math.max(1,Math.ceil(width)),h=Math.max(1,Math.ceil(height));
    const win=new Window_Base(new Rectangle(0,0,w,h));
    if(row){
      win.padding=0;win.frameVisible=false;win.backOpacity=0;win.createContents();
      win.contentsBack.gradientFillRect(0,0,w,h,ColorManager.itemBackColor1(),ColorManager.itemBackColor2(),true);
      win.contentsBack.strokeRect(0,0,w,h,ColorManager.itemBackColor1());
      if(selected){win.setCursorRect(0,0,w,h);win.active=true;}
    } else {
      const p=PluginManager.parameters('CustomMenu');
      if(p.WindowTintEnabled==='true'){
        const c=(p.WindowTintColor||'#efe4d1').replace('#','');
        win.setTone(...[0,2,4].map(i=>parseInt(c.slice(i,i+2),16)-128));
      }
    }
    const url=Graphics._app.renderer.plugins.extract.canvas(win).toDataURL();win.destroy();return url;
  }
  function decorate(root,panelSelector,buttonSelector='button') {
    root.style.setProperty('--dp-font',$gameSystem.mainFontFace());
    root.style.setProperty('--dp-ink',ColorManager.normalColor());
    root.style.setProperty('--dp-light',PluginManager.parameters('CustomMenu').ThemeTextColor||'#F2E6D0');
    root.classList.add('dp-game-ui');
    const cache=new Map();let closed=false;
    const bg=(w,h,row,sel)=>{
      const key=[w,h,row,sel].join(':');
      if(!cache.has(key))cache.set(key,skin(w,h,row,sel));
      return `url("${cache.get(key)}")`;
    };
    const render=()=>{
      if(closed||!root.isConnected||!ImageManager.loadSystem('Window').isReady())return;
      for(const node of root.querySelectorAll(panelSelector)){
        if(node.offsetWidth&&node.offsetHeight)node.style.backgroundImage=bg(node.offsetWidth,node.offsetHeight,false,false);
      }
      for(const node of root.querySelectorAll(buttonSelector)){
        if(!node.offsetWidth||!node.offsetHeight)continue;
        node.style.setProperty('--dp-row',bg(node.offsetWidth,node.offsetHeight,true,false));
        node.style.setProperty('--dp-selected',bg(node.offsetWidth,node.offsetHeight,true,true));
      }
    };
    const ro=new ResizeObserver(render);ro.observe(root);
    const mo=new MutationObserver(()=>{for(const n of root.querySelectorAll(panelSelector))ro.observe(n);render();});
    mo.observe(root,{childList:true,subtree:true,characterData:true});
    ImageManager.loadSystem('Window').addLoadListener(render);
    return ()=>{closed=true;ro.disconnect();mo.disconnect();cache.clear();};
  }
  const css=document.createElement('style');
  css.textContent=`.dp-game-ui{font-family:var(--dp-font);color:var(--dp-ink)}
  .dp-game-ui button{font-family:inherit!important;font-weight:normal!important;border:0!important;border-radius:0!important;background-color:transparent!important;background-image:var(--dp-row)!important;background-size:100% 100%!important;color:var(--dp-light)!important;text-shadow:0 1px 2px #0008}
  .dp-game-ui button:hover,.dp-game-ui button:focus-visible{background-image:var(--dp-selected)!important;color:var(--dp-ink)!important;text-shadow:none}
  .dp-game-ui button:focus-visible{outline:2px solid #b78c39;outline-offset:2px}
  .dp-game-ui button:disabled{opacity:.5;cursor:default}`;
  document.head.append(css);
  window.DP_GameUI={skin,decorate};
})();
