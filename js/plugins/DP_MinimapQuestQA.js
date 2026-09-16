/*:
 * @target MZ
 * @plugindesc 메마른 약속 v17 - Portal 엄격분리, 블링킹/포탈 QA, 고가시성 화살표, CG 중 미니맵 숨김
 * @author Dry Promise QA
 * @help
 * 반드시 DP_RescueFlowGuard 등 기존 길안내/미니맵 보정 플러그인보다 아래에 둡니다.
 *
 * 처리 내용
 * 1) 현재 퀘스트의 목표_S01_* 이벤트는 빈 이벤트여도 미니맵에 보이는 블링킹 아이콘으로 표시
 * 2) 현재 맵에 직접 목표가 없으면 data.zip의 실제 맵 이동 그래프를 따라 다음 이동 포탈을 블링킹
 * 3) 플레이어가 실제로 밟아 이동 가능한 포탈은 출구 묶음당 하나만 Portal로 표시
 * 4) 지난 퀘스트의 blinking / GUIDE_* 잔존 표시는 숨김
 * 5) 화면 화살표 모양/크기는 그대로 두고 색만 고가시성 노랑 + 검정 테두리로 교체
 * 6) 전체화면 CG가 떠 있는 동안만 미니맵/접기 탭을 숨기고 CG 종료 시 원래 상태 복원
 *    예외: CG_pheme_broadcast_dilemma (페메 취재 노트 장면)
 */
(() => {
  'use strict';

  const ROUTE_NEXT = {"S01_01":{"1":23,"5":23,"7":23,"8":23,"24":23,"25":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"4":7,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_010":{"11":1,"23":1,"10":11,"5":23,"7":23,"8":23,"24":23,"25":23,"3":5,"15":5,"19":5,"30":5,"4":7,"16":9,"13":3,"12":3,"14":3,"21":15,"35":19,"20":19,"18":16,"2":13,"34":35,"17":18},"S01_01H":{"11":1,"23":1,"10":11,"5":23,"7":23,"8":23,"24":23,"25":23,"3":5,"15":5,"19":5,"30":5,"4":7,"16":9,"13":3,"12":3,"14":3,"21":15,"35":19,"20":19,"18":16,"2":13,"34":35,"17":18},"S01_01P":{"3":5,"9":5,"15":5,"19":5,"23":5,"30":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"34":35,"4":7,"17":18},"S01_02":{"1":23,"5":23,"7":23,"24":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"4":7,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_03":{"4":7,"1":23,"5":23,"8":23,"24":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_04":{"23":8,"1":23,"5":23,"7":23,"24":23,"25":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"4":7,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_05":{"23":8,"1":23,"5":23,"7":23,"24":23,"25":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"4":7,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_06":{"23":8,"1":23,"5":23,"7":23,"24":23,"25":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"4":7,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_07":{"23":7,"1":23,"5":23,"8":23,"24":23,"25":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_08":{"3":5,"9":5,"15":5,"35":19,"20":19,"1":23,"8":23,"24":23,"25":23,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"34":35,"11":1,"2":13,"18":16,"17":18},"S01_08A":{"3":5,"9":5,"15":5,"19":5,"23":5,"30":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"34":35,"4":7,"17":18},"S01_08C":{"19":30,"5":30,"35":19,"20":19,"3":5,"9":5,"15":5,"23":5,"34":35,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_08D":{"35":19,"20":19,"5":19,"30":19,"34":35,"3":5,"9":5,"15":5,"23":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_08E":{"3":5,"9":5,"15":5,"23":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"34":35,"4":7,"17":18},"S01_08E2":{"35":19,"20":19,"34":35,"3":5,"9":5,"15":5,"23":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_08F":{"35":19,"20":19,"5":19,"30":19,"34":35,"3":5,"9":5,"15":5,"23":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_08G":{"34":35,"5":19,"30":19,"3":5,"9":5,"15":5,"23":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_08H":{"34":35,"5":19,"30":19,"3":5,"9":5,"15":5,"23":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_08I":{"34":35,"5":19,"30":19,"3":5,"9":5,"15":5,"23":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_08J":{"34":35,"3":5,"9":5,"15":5,"4":7,"1":23,"8":23,"24":23,"25":23,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"11":1,"2":13,"18":16,"17":18},"S01_08K":{"3":5,"19":5,"30":5,"4":7,"16":9,"1":23,"8":23,"24":23,"25":23,"13":3,"12":3,"14":3,"21":15,"35":19,"20":19,"18":16,"22":16,"2":13,"34":35,"17":18},"S01_08L":{"16":9,"10":9,"21":15,"3":5,"19":5,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"13":3,"12":3,"14":3,"35":19,"20":19,"4":7,"17":18,"2":13,"34":35},"S01_08M":{"3":5,"19":5,"30":5,"10":9,"17":18,"1":23,"7":23,"8":23,"24":23,"25":23,"13":3,"12":3,"14":3,"35":19,"20":19,"4":7,"2":13,"34":35},"S01_08M2":{"12":3,"14":3,"19":5,"23":5,"30":5,"10":9,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"11":10,"34":35,"4":7},"S01_08N2":{"2":32,"13":2,"3":13,"12":3,"5":3,"14":3,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_08NB":{"2":32,"13":2,"3":13,"12":3,"5":3,"14":3,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_08P1":{"9":15,"21":15,"30":15,"10":9,"22":21,"19":30,"18":16,"11":10,"3":5,"23":5,"35":19,"20":19,"17":18,"13":3,"12":3,"14":3,"1":23,"7":23,"8":23,"24":23,"25":23,"34":35,"2":13,"4":7},"S01_08P2":{"9":15,"21":15,"30":15,"10":9,"22":21,"19":30,"18":16,"11":10,"3":5,"23":5,"35":19,"20":19,"17":18,"13":3,"12":3,"14":3,"1":23,"7":23,"8":23,"24":23,"25":23,"34":35,"2":13,"4":7},"S01_08P3":{"16":9,"10":9,"35":19,"20":19,"3":5,"23":5,"18":16,"22":16,"11":10,"21":15,"34":35,"13":3,"12":3,"14":3,"1":23,"7":23,"8":23,"24":23,"25":23,"17":18,"2":13,"4":7},"S01_08P4":{"16":9,"10":9,"35":19,"20":19,"3":5,"23":5,"18":16,"22":16,"11":10,"21":15,"34":35,"13":3,"12":3,"14":3,"1":23,"7":23,"8":23,"24":23,"25":23,"17":18,"2":13,"4":7},"S01_08P5":{"9":15,"21":15,"30":15,"10":9,"22":21,"19":30,"18":16,"11":10,"3":5,"23":5,"35":19,"20":19,"17":18,"13":3,"12":3,"14":3,"1":23,"7":23,"8":23,"24":23,"25":23,"34":35,"2":13,"4":7},"S01_08P6":{"11":1,"35":19,"20":19,"3":5,"9":5,"15":5,"7":23,"8":23,"24":23,"25":23,"34":35,"13":3,"12":3,"14":3,"16":9,"21":15,"4":7,"2":13,"18":16,"17":18},"S01_08P7":{"11":1,"5":23,"7":23,"8":23,"24":23,"25":23,"10":11,"3":5,"9":5,"15":5,"19":5,"30":5,"4":7,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_08P8":{"1":23,"5":23,"7":23,"8":23,"25":23,"11":1,"3":5,"9":5,"15":5,"19":5,"30":5,"4":7,"13":3,"12":3,"14":3,"16":9,"21":15,"35":19,"20":19,"2":13,"18":16,"34":35,"17":18},"S01_08Q":{"16":18,"17":18,"22":18,"9":16,"21":22,"10":9,"5":9,"15":9,"11":10,"3":5,"19":5,"23":5,"13":3,"12":3,"14":3,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"34":35,"4":7},"S01_08R1":{"16":22,"21":22,"9":16,"18":16,"10":9,"5":9,"15":9,"17":18,"11":10,"3":5,"19":5,"23":5,"13":3,"12":3,"14":3,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"34":35,"4":7},"S01_08S":{"16":21,"22":21,"9":16,"18":16,"10":9,"5":9,"15":9,"17":18,"11":10,"3":5,"19":5,"23":5,"13":3,"12":3,"14":3,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"34":35,"4":7},"S01_08T":{"9":16,"18":16,"10":9,"5":9,"15":9,"17":18,"11":10,"3":5,"19":5,"23":5,"13":3,"12":3,"14":3,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"34":35,"4":7},"S01_08W":{"12":3,"5":3,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_08X":{"10":9,"17":18,"3":5,"19":5,"23":5,"30":5,"11":10,"13":3,"12":3,"14":3,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"34":35,"4":7},"S01_08Y":{"13":3,"12":3,"9":5,"15":5,"19":5,"23":5,"30":5,"2":13,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_08Y1":{"12":3,"5":3,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_08Z2":{"2":13,"3":13,"12":3,"5":3,"14":3,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_08Z3":{"16":18,"17":18,"22":18,"9":16,"21":22,"10":9,"5":9,"15":9,"11":10,"3":5,"19":5,"23":5,"13":3,"12":3,"14":3,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"34":35,"4":7},"S01_08Z4":{"9":15,"21":15,"30":15,"10":9,"22":21,"19":30,"18":16,"11":10,"3":5,"23":5,"35":19,"20":19,"17":18,"13":3,"12":3,"14":3,"1":23,"7":23,"8":23,"24":23,"25":23,"34":35,"2":13,"4":7},"S01_08Z5":{"35":34,"20":35,"3":5,"9":5,"15":5,"19":5,"23":5,"30":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"4":7,"17":18},"S01_A_ASK_AGAMEMNON":{"12":3,"5":3,"14":3,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_ECHO_CART_INSIDE":{"2":32,"13":2,"3":13,"12":3,"5":3,"14":3,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18},"S01_ECHO_FIND_PHEME":{"12":3,"14":3,"19":5,"23":5,"16":9,"10":9,"2":13,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"11":10,"34":35,"4":7,"17":18},"S01_ECHO_PRESS_DOOR":{"5":36,"3":5,"9":5,"15":5,"19":5,"23":5,"30":5,"13":3,"12":3,"14":3,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"2":13,"18":16,"34":35,"4":7,"17":18},"S01_ECHO_TRACE_ROUTE":{"16":9,"10":9,"3":5,"19":5,"23":5,"21":15,"18":16,"11":10,"13":3,"12":3,"14":3,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"17":18,"2":13,"34":35,"4":7},"S01_POST_HEARING_BOARD":{"3":12,"13":3,"5":3,"14":3,"2":13,"9":5,"15":5,"19":5,"23":5,"30":5,"16":9,"10":9,"21":15,"35":19,"20":19,"1":23,"7":23,"8":23,"24":23,"25":23,"18":16,"34":35,"4":7,"17":18}};
  const NO_FORCE_QUESTS = new Set([
    'S01_08Q',                 // 첫샘 네 약속: 직접 순서 찾기
    'S01_08R1',                // 손전등 탐색: 위치 노출 금지
    'S01_RESCUE_CONTROL_SEARCH',
    'S01_08T',
    'S01_ECHO_CART_MASH'
  ]);
  const GOAL_TEMPLATE = 'DP_QABlink';
  const BRIGHT_ARROW = '#FF0000';
  const BRIGHT_ARROW_OUTLINE = '#111111';

  const questId = () => ($gameSystem && $gameSystem.questGuideId)
    ? String($gameSystem.questGuideId() || '').trim() : '';
  const mapId = () => ($gameMap && $gameMap.mapId) ? Number($gameMap.mapId()) : 0;
  const manhattan = (a,b) => Math.abs(a.x-b.x)+Math.abs(a.y-b.y);

  function eventName(e) {
    const d = e && e.event ? e.event() : null;
    return d ? String(d.name || '') : '';
  }
  function declaredTemplate(e) {
    const list = e && e.list ? e.list() : [];
    if (!Array.isArray(list)) return '';
    const cmd = list.find(c => c && c.code === 357 && c.parameters &&
      c.parameters[0] === 'MK_Minimap' && c.parameters[1] === 'event');
    const arg = cmd && cmd.parameters ? cmd.parameters[cmd.parameters.length-1] : null;
    return arg && arg.template ? String(arg.template) : '';
  }
  function transferDestination(e) {
    if (!e || e._erased || !e.page || !e.page()) return 0;
    const page = e.page();
    if (Number(page.trigger) > 2) return 0;
    const list = e.list ? e.list() : [];
    if (!Array.isArray(list)) return 0;
    const cmd = list.find(c => c && c.code === 201 && Number(c.indent || 0) === 0);
    return cmd && cmd.parameters ? Number(cmd.parameters[1] || 0) : 0;
  }
  function currentTargets(q) {
    if (!q || !$gameMap || !$gameMap.events) return [];
    const prefix = `목표_${q}_`;
    return $gameMap.events().filter(e => e && !e._erased && e.page && e.page() &&
      eventName(e).startsWith(prefix));
  }
  function nearbyTransferMarkerScore(e) {
    if (!$gameMap || !$gameMap.events) return 99;
    let best=99;
    for (const x of $gameMap.events()) {
      if (!x || x._erased || !x.page || !x.page() || manhattan(e,x)>1) continue;
      if (!transferDestination(x)) continue;
      const t=declaredTemplate(x);
      if (t==='blinking' || t==='quest') best=Math.min(best,2);
      else if (t==='Portal') best=Math.min(best,3);
    }
    return best;
  }
  function targetStageScore(e) {
    const t=declaredTemplate(e);
    if (t==='blinking' || t==='quest') return 0;
    if (t==='Portal') return 1;
    const near=nearbyTransferMarkerScore(e);
    if (near<99) return near;
    if (t==='hidden') return 20;
    return 10;
  }
  function stageTargets(q) {
    const all=currentTargets(q);
    if (!all.length) return [];
    const scored=all.map(e=>({e,score:targetStageScore(e)}));
    const best=Math.min(...scored.map(x=>x.score));
    // 강한 현재단계 신호(blinking/Portal 또는 같은 출구의 물리 마커)가 있으면
    // 그 단계만 남긴다. 강한 신호가 전혀 없을 때만 같은 점수의 fallback을 쓴다.
    return scored
      .filter(x => best<=3 ? x.score<=3 : x.score===best)
      .map(x=>x.e);
  }
  function normalizedTargetName(name) {
    return String(name || '')
      .replace(/_(?:0?1|0?2|0?3)$/i, '')
      .replace(/_(?:왼쪽|오른쪽)$/i, '');
  }
  function sameTargetCluster(a,b) {
    if (!a || !b || manhattan(a,b) > 2) return false;
    const da=transferDestination(a), db=transferDestination(b);
    if (da && db && da===db) return true;
    if (a.x===b.x && a.y===b.y) return true;
    return normalizedTargetName(eventName(a)) === normalizedTargetName(eventName(b));
  }
  function chooseByCenter(events) {
    if (!events.length) return null;
    return events.slice().sort((a,b) => {
      const aDeclared = declaredTemplate(a);
      const bDeclared = declaredTemplate(b);
      const pri = t => t === 'blinking' ? 0 : t === 'Portal' ? 1 : t === 'quest' ? 2 : 3;
      const dp = pri(aDeclared)-pri(bDeclared);
      if (dp) return dp;
      const sa=events.reduce((s,x)=>s+manhattan(a,x),0);
      const sb=events.reduce((s,x)=>s+manhattan(b,x),0);
      return sa-sb || a.eventId()-b.eventId();
    })[0];
  }
  function targetRepresentative(e,q) {
    const all=stageTargets(q);
    const group=all.filter(x => sameTargetCluster(e,x));
    return chooseByCenter(group.length ? group : [e]);
  }
  function activeTransfersTo(dest) {
    if (!dest || !$gameMap || !$gameMap.events) return [];
    return $gameMap.events().filter(e => transferDestination(e)===Number(dest));
  }
  function transferComponent(seed, events) {
    const out=[]; const queue=[seed]; const seen=new Set();
    while(queue.length) {
      const e=queue.shift();
      if (!e || seen.has(e.eventId())) continue;
      seen.add(e.eventId()); out.push(e);
      for (const x of events) {
        if (!seen.has(x.eventId()) && manhattan(e,x) <= 2) queue.push(x);
      }
    }
    return out;
  }
  function transferRepresentative(e) {
    const dest=transferDestination(e);
    if (!dest) return null;
    const all=activeTransfersTo(dest);
    const comp=transferComponent(e,all);
    return chooseByCenter(comp);
  }
  function routeNextMap(q) {
    const perQuest = ROUTE_NEXT[q];
    if (!perQuest) return 0;
    return Number(perQuest[String(mapId())] || perQuest[mapId()] || 0);
  }
  function routeTransferTarget(q) {
    const next=routeNextMap(q);
    if (!next) return null;
    const events=activeTransfersTo(next);
    if (!events.length) return null;
    // 같은 목적지로 가는 출구가 여러 곳이면 플레이어에게 가까운 출구 묶음을 선택.
    const reps=[]; const visited=new Set();
    for (const e of events) {
      if (visited.has(e.eventId())) continue;
      const comp=transferComponent(e,events);
      comp.forEach(x=>visited.add(x.eventId()));
      const rep=chooseByCenter(comp);
      if (rep) reps.push(rep);
    }
    return reps.sort((a,b) =>
      $gameMap.distance($gamePlayer.x,$gamePlayer.y,a.x,a.y) -
      $gameMap.distance($gamePlayer.x,$gamePlayer.y,b.x,b.y)
    )[0] || null;
  }
  function hasNearbyQuestTarget(e,q) {
    return stageTargets(q).some(t => t.eventId() !== e.eventId() && manhattan(t,e) <= 1);
  }
  function inProtectedRescueState() {
    if (!$gameSwitches) return false;
    const m=mapId();
    const rescueMap=[21,22,32,33,34,35,36].includes(m);
    return rescueMap && [224,225,291,292].some(id=>$gameSwitches.value(id));
  }

  // ---------------------------------------------------------------------------
  // Minimap marker QA
  // ---------------------------------------------------------------------------
  if (typeof MK !== 'undefined' && MK.Minimap && typeof Sprite_Minimap_Event !== 'undefined') {
    // v17: Portal 모양은 실제 Transfer Player(201) 이동 이벤트에만 사용합니다.
    // GOAL_TEMPLATE은 "실제 이동 출구를 현재 퀘스트 경로로 강조"할 때만 쓰는
    // blinking Portal 템플릿입니다. NPC/시민 목표에는 절대 적용하지 않습니다.
    const portal = MK.Minimap.eventTemplates && MK.Minimap.eventTemplates.Portal;
    if (portal) {
      MK.Minimap.eventTemplates[GOAL_TEMPLATE] = Object.assign({}, portal, {
        isBlinking:true,
        opacity:255,
        scale:Math.max(Number(portal.scale || 0.6), 0.6),
        scaleWithMinimap:false,
        sticksOnEdge:true
      });
    }

    const oldFind = Sprite_Minimap_Event.prototype.findTemplateName;
    Sprite_Minimap_Event.prototype.findTemplateName = function() {
      const original = oldFind.call(this);
      const e=this.event;
      if (!e || !e.page || !e.page() || e._erased) return 'hidden';
      const q=questId();
      const name=eventName(e);

      // 기존 구조구간 전용 판단은 우선 존중합니다.
      if (String(original || '').startsWith('DP_Rescue')) return original;

      // 위치를 직접 찾는 퍼즐/탐색 구간은 의도적으로 노출하지 않습니다.
      if (q && NO_FORCE_QUESTS.has(q)) {
        if (name.startsWith(`목표_${q}_`) || name.startsWith('GUIDE_')) return 'hidden';
        return original;
      }

      if (q) {
        const prefix=`목표_${q}_`;
        if (name.startsWith(prefix)) {
          const activeStage=stageTargets(q);
          if (!activeStage.some(x=>x.eventId()===e.eventId())) return 'hidden';
          const rep=targetRepresentative(e,q);
          if (!rep || rep.eventId()!==e.eventId()) return 'hidden';
          // 실제 이동 이벤트만 Portal 모양으로 강조.
          // 시민/NPC/상호작용 대상은 캐릭터 스프라이트 자체를 blinking.
          return transferDestination(e) ? GOAL_TEMPLATE : 'blinking';
        }

        // 현재 맵에 직접 목표가 없을 때만 다음 맵으로 가는 실제 출구를 안내합니다.
        if (currentTargets(q).length===0) {
          const routeTarget=routeTransferTarget(q);
          if (routeTarget && routeTarget.eventId()===e.eventId()) return GOAL_TEMPLATE;
        }

        // 예전 퀘스트의 helper/blinking 잔존 제거.
        if (name.startsWith('목표_S01_') || name.startsWith('GUIDE_')) {
          if (original==='blinking' || original==='quest' || original===GOAL_TEMPLATE) return 'hidden';
        }
      } else if (name.startsWith('GUIDE_') && (original==='blinking' || original==='quest')) {
        return 'hidden';
      }

      const dest=transferDestination(e);

      // v17 strict Portal guard:
      // Portal 템플릿은 현재 페이지에 실제 Transfer Player(201)가 없으면 무조건 숨깁니다.
      // NPC/시민/연출/빈 helper 이벤트에 Portal이 남는 일을 차단합니다.
      if (!dest && original==='Portal') return 'hidden';

      if (dest) {
        // 목표 helper가 같은 출구에 있으면 실제 문/이동 타일의 Portal은 숨겨 겹침 방지.
        if (q && hasNearbyQuestTarget(e,q)) return 'hidden';
        const rep=transferRepresentative(e);
        if (rep && rep.eventId()===e.eventId()) return 'Portal';
        return 'hidden';
      }

      // 현재 퀘스트와 무관한 낡은 blinking은 숨깁니다.
      if (q && (original==='blinking' || original==='quest')) return 'hidden';
      return original;
    };

    const oldRefresh = Sprite_Minimap_Event.prototype.requiresRefresh;
    Sprite_Minimap_Event.prototype.requiresRefresh = function() {
      const sig=`${questId()}:${mapId()}:${$gamePlayer ? $gamePlayer.x+','+$gamePlayer.y : ''}`;
      const changed=this._dpQaSig!==sig;
      this._dpQaSig=sig;
      return oldRefresh.call(this) || changed;
    };
  }

  // ---------------------------------------------------------------------------
  // Screen quest arrow fallback: current map has no 목표_<QuestId>_* helper ->
  // shortest unambiguous map route's real transfer event.
  // ---------------------------------------------------------------------------
  if (Scene_Map.prototype.questGuideTarget) {
    const oldTarget=Scene_Map.prototype.questGuideTarget;
    const rescueOwned = q => /^S01_RESCUE_/.test(q) || [
      'S01_08Z1','S01_08X','S01_08N2','S01_08NB','S01_08Z3','S01_08Z4','S01_08Z5',
      'S01_08T','S01_08T2','S01_ECHO_CART_MASH'
    ].includes(q);
    Scene_Map.prototype.questGuideTarget=function() {
      const q=questId();
      const original=oldTarget.call(this);
      if (!q || NO_FORCE_QUESTS.has(q)) return original;
      if (original && rescueOwned(q)) return original;

      const stage=stageTargets(q);
      if (stage.length) {
        const reps=[];
        const seen=new Set();
        for (const e of stage) {
          if (seen.has(e.eventId())) continue;
          const group=stage.filter(x=>sameTargetCluster(e,x));
          group.forEach(x=>seen.add(x.eventId()));
          const rep=chooseByCenter(group);
          if (rep) reps.push(rep);
        }
        if (reps.length) {
          return reps.sort((a,b)=>
            $gameMap.distance($gamePlayer.x,$gamePlayer.y,a.x,a.y)-
            $gameMap.distance($gamePlayer.x,$gamePlayer.y,b.x,b.y)
          )[0];
        }
      }
      if (original) return original;
      return routeTransferTarget(q);
    };
  }

  // ---------------------------------------------------------------------------
  // Arrow: shape / size unchanged, color only.
  // ---------------------------------------------------------------------------
  function brightArrowBitmap(size) {
    const bitmap=new Bitmap(size,size);
    const context=bitmap.context;
    const center=size/2;
    const scale=size/40;
    context.save();
    context.translate(center,center);
    context.scale(scale,scale);
    context.beginPath();
    context.moveTo(0,-17);
    context.quadraticCurveTo(1,-17,2,-16);
    context.lineTo(15,-3);
    context.quadraticCurveTo(17,-1,14,0);
    context.lineTo(7,1);
    context.lineTo(7,13);
    context.quadraticCurveTo(7,16,4,16);
    context.lineTo(-4,16);
    context.quadraticCurveTo(-7,16,-7,13);
    context.lineTo(-7,1);
    context.lineTo(-14,0);
    context.quadraticCurveTo(-17,-1,-15,-3);
    context.lineTo(-2,-16);
    context.quadraticCurveTo(-1,-17,0,-17);
    context.closePath();
    context.fillStyle=BRIGHT_ARROW;
    context.strokeStyle=BRIGHT_ARROW_OUTLINE;
    context.lineWidth=2.5;
    context.lineJoin='round';
    context.lineCap='round';
    context.fill();
    context.stroke();
    context.restore();
    bitmap.baseTexture.update();
    return bitmap;
  }
  const oldCreateSpriteset=Scene_Map.prototype.createSpriteset;
  Scene_Map.prototype.createSpriteset=function() {
    oldCreateSpriteset.call(this);
    const s=this._questGuideArrow;
    if (s && s.bitmap) s.bitmap=brightArrowBitmap(s.bitmap.width || 38);
  };

  // ---------------------------------------------------------------------------
  // CG only: minimap hidden. Pheme notebook illustration is explicitly excluded.
  // ---------------------------------------------------------------------------
  const PHEME_NOTE_EXACT = new Set(['CG_pheme_broadcast_dilemma']);
  function isPhemeNote(name) {
    const s=String(name || '');
    if (PHEME_NOTE_EXACT.has(s)) return true;
    return /(?:pheme|페메).*(?:note|memo|notebook|취재.?노트|취재.?메모)|(?:note|memo|notebook|노트|메모).*(?:pheme|페메)/i.test(s);
  }
  function isCgPictureName(name) {
    const s=String(name || '').trim();
    if (!s || isPhemeNote(s) || s==='DP_flashlight_overlay') return false;
    // 현재 data.zip의 Show Picture는 CG/일러스트/투표용지/단서 이미지로만 사용됩니다.
    // 파일명이 숫자(프롤로그 3/4)인 이미지도 놓치지 않도록 이름 형식에 의존하지 않습니다.
    return true;
  }
  function cgActive() {
    if (!$gameScreen || !$gameScreen._pictures) return false;
    return $gameScreen._pictures.some(p => p && isCgPictureName(p.name ? p.name() : p._name));
  }
  const oldSceneUpdate=Scene_Map.prototype.update;
  Scene_Map.prototype.update=function() {
    oldSceneUpdate.call(this);
    if (typeof MK==='undefined' || !MK.Minimap || !$gameSystem) return;
    const active=cgActive();
    if (active) {
      if (!this._dpCgMiniSaved) {
        this._dpCgMiniSaved={
          showMinimap:!!$gameSystem.showMinimap,
          forceShowMinimap:!!$gameSystem.forceShowMinimap,
          tabVisible:this._minimapCollapseTab ? !!this._minimapCollapseTab.visible : null
        };
      }
      $gameSystem.forceShowMinimap=false;
      MK.Minimap.hide();
      if (this._minimapCollapseTab) this._minimapCollapseTab.visible=false;
    } else if (this._dpCgMiniSaved) {
      const saved=this._dpCgMiniSaved;
      $gameSystem.showMinimap=!!saved.showMinimap;
      $gameSystem.forceShowMinimap=!!saved.forceShowMinimap;
      if (this._minimapCollapseTab && saved.tabVisible !== null) {
        const suppressed=!!$gameSystem._mmTabSuppressed;
        const noMinimap=!!($dataMap && $dataMap.meta && Object.prototype.hasOwnProperty.call($dataMap.meta,'No Minimap'));
        this._minimapCollapseTab.visible=!!saved.tabVisible && !suppressed && !noMinimap;
        if (this._minimapCollapseTab.refresh) this._minimapCollapseTab.refresh();
      }
      this._dpCgMiniSaved=null;
    }
  };
})();
