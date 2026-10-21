/*:
 * @target MZ
 * @plugindesc 1부·2부 시작, 추격전 뒤 완료 기록, 기록 없는 2부의 사본 선택.
 * @author Dry Promise
 * @orderAfter MainMenuCustomization
 * @orderAfter DP_QTEGuide
 * @orderAfter DP_GameDefaults
 * @help
 * 플러그인 목록의 마지막에 배치합니다.
 * Map030 / 이벤트 15의 추격 종료 대화 뒤, 페메 소개 직전에 1부를 마칩니다.
 * 완료 기록은 dp_part2_checkpoint_v1에 저장하여 일반 저장과 분리합니다.
 * 2부 시작은 이 기록을 사용하며, 기록이 없으면 사본 선택을 묻습니다.
 * 새 1부 시작과 질문으로 시작은 기존 완료 기록을 삭제하지 않습니다.
 */
(() => {
  'use strict';
  const KEY = 'dp_part2_checkpoint_v1';
  let view = null;
  const label = take => take ? 'R-17 사본을 가져갔어요.' : '내용만 적고 사본은 제자리에 두었어요.';
  const clearInput = () => { Input.clear(); TouchInput.clear(); if ($gameTemp) $gameTemp.clearDestination(); };
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  function close() {
    if (view) view.root.remove();
    view = null;
    document.body.classList.remove('dp-chapters-open');
    clearInput();
  }
  function panel(kind, title, text) {
    close();
    if (!document.getElementById('dp-chapters-style')) {
      const style = el('style'); style.id = 'dp-chapters-style';
      style.textContent = `
        body.dp-chapters-open #dp-touch-controls{display:none!important}
        #dp-chapters{position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;background:rgba(12,20,25,.88);font-family:system-ui,sans-serif;touch-action:manipulation;color:#fff;overflow:auto}
        #dp-chapters[data-kind=title]{background:linear-gradient(90deg,transparent 32%,rgba(9,18,23,.7));justify-content:flex-end;align-items:flex-end;padding:4vh 6vw}
        .dc-panel{width:min(640px,92vw);padding:28px;box-sizing:border-box;border:1px solid #b6a77c;border-radius:20px;background:#f5efdf;color:#292c2c;box-shadow:0 12px 60px #0007}
        [data-kind=title] .dc-panel{width:min(380px,46vw);padding:22px}
        #dp-chapters h1{font-size:clamp(25px,3vw,34px);margin:0 0 16px;line-height:1.3}
        #dp-chapters p{font-size:clamp(17px,2vw,21px);line-height:1.65;white-space:pre-line;margin:10px 0 18px}
        #dp-chapters .dc-note{font-size:15px;color:#596064;margin:10px 0}
        .dc-actions{display:grid;gap:10px;margin-top:18px}
        #dp-chapters button{font:600 clamp(17px,2vw,21px)/1.4 system-ui,sans-serif;min-height:54px;padding:12px 18px;border:2px solid #456356;border-radius:12px;background:#fffdf6;color:#253c32;cursor:pointer;touch-action:manipulation}
        #dp-chapters button:first-child{background:#285447;color:white}
        #dp-chapters button:focus-visible{outline:4px solid #d68b21;outline-offset:2px}
        #dp-chapters button:disabled{opacity:.55;cursor:wait}
        @media(max-height:560px){#dp-chapters{padding:10px}.dc-panel{padding:18px}#dp-chapters h1{margin-bottom:8px}#dp-chapters p{margin:6px 0;font-size:17px}.dc-actions{gap:7px;margin-top:10px}#dp-chapters button{min-height:46px;padding:9px 14px}[data-kind=title] .dc-panel{padding:16px}}
        @media(max-width:600px){#dp-chapters[data-kind=title]{justify-content:center;padding:16px}[data-kind=title] .dc-panel{width:100%}}
      `;
      document.head.append(style);
    }
    const root = el('div'); root.id = 'dp-chapters'; root.dataset.kind = kind;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'dc-heading');
    const box = el('section', '', 'dc-panel'), heading = el('h1', title), copy = el('p', text);
    heading.id = 'dc-heading';
    const actions = el('div', '', 'dc-actions');
    box.append(heading, copy, actions); root.append(box);
    for (const type of ['pointerdown','pointerup','pointermove','pointercancel','touchstart','touchend','touchmove',
      'mousedown','mouseup','mousemove','click','dblclick','contextmenu','wheel']) {
      root.addEventListener(type, e => e.stopPropagation());
    }
    document.body.append(root); document.body.classList.add('dp-chapters-open');
    view = { root, box, actions, kind, scene: SceneManager._scene };
    return view;
  }
  function button(v, id, text, fn) {
    const b = el('button', text); b.id = id; b.type = 'button';
    b.onclick = () => { if (view === v && !b.disabled) fn(); };
    v.actions.append(b);
    return b;
  }
  function titleMenu() {
    const v = panel('title', '어디에서 시작할까요?', '한 번에 한 부씩 진행할 수 있어요.');
    button(v, 'dc-part1', '1부 시작', () => {
      close(); AudioManager.stopBgm(); DataManager.setupNewGame(); SceneManager.goto(Scene_Map);
    });
    button(v, 'dc-part2', '2부 시작', openPart2);
    button(v, 'dc-load', '저장한 곳부터 이어하기', () => { close(); SceneManager.push(Scene_Load); });
    button(v, 'dc-options', '설정', () => { close(); SceneManager.push(Scene_Options); });
  }
  function question(note = '') {
    const v = panel('question', '1부에서 어떻게 했나요?', '안티고네가 R-17 기록을 확인했을 때의 선택을 골라 주세요.');
    if (note) v.box.insertBefore(el('p', note, 'dc-note'), v.actions);
    button(v, 'dc-take', 'R-17 사본을 가져갔어요', () => recap(true, () => startPreset(true), question));
    button(v, 'dc-leave', '내용만 적고 사본은 제자리에 두었어요', () => recap(false, () => startPreset(false), question));
    button(v, 'dc-back', '처음 화면으로', titleMenu);
  }
  function recap(take, start, back, note) {
    const v = panel('recap', '2부 · 페메의 취재',
      '아랫마을의 물이 줄어들자 안티고네와 이스메네는 정원을 조사했어요.\n정원으로 가는 물이 20에서 40으로 바뀐 기록을 발견했고, 비아도 그 사실을 확인하기로 했어요.\n이제 페메가 되어 현장의 이야기를 들어봐요.');
    v.box.insertBefore(el('p', '1부의 선택: ' + label(take), 'dc-note'), v.actions);
    if (note) v.box.insertBefore(el('p', note, 'dc-note'), v.actions);
    button(v, 'dc-begin', '2부 시작하기', () => { close(); start(); });
    if (back) button(v, 'dc-reselect', '선택 화면으로', back);
  }
  function valid(record) {
    const c = record && record.contents;
    return record?.version === 1 && typeof record.take === 'boolean' &&
      c?.system instanceof Game_System && c.map instanceof Game_Map &&
      c.player instanceof Game_Player && c.switches instanceof Game_Switches &&
      c.variables instanceof Game_Variables && c.selfSwitches instanceof Game_SelfSwitches &&
      c.actors instanceof Game_Actors && c.party instanceof Game_Party &&
      c.screen instanceof Game_Screen && c.timer instanceof Game_Timer &&
      c.map.mapId() === 30 && c.map._interpreter?._eventId === 15 &&
      c.system._dpPart1Complete === true && c.switches.value(101) &&
      c.switches.value(216) === record.take && c.switches.value(217) !== record.take;
  }
  async function openPart2() {
    const v = panel('loading', '2부 준비 중', '1부 완료 기록을 확인하고 있어요.');
    try {
      const record = await StorageManager.loadObject(KEY);
      if (view !== v) return;
      if (!valid(record)) throw new Error('Invalid chapter checkpoint');
      const date = new Date(record.savedAt).toLocaleString('ko-KR');
      recap(record.take, () => {
        DataManager.createGameObjects(); DataManager.extractSaveContents(record.contents);
        DataManager.correctDataErrors(); $gameSystem.onAfterLoad();
        SceneManager.goto(Scene_Map);
      }, () => question('다른 선택으로 시작해도 기존 1부 완료 기록은 남아 있어요.'),
      `${date}에 저장한 1부 완료 기록으로 시작해요.`);
    } catch (_) {
      if (view === v) question('이 기기에서 사용할 수 있는 1부 완료 기록이 없어요. 이전 선택을 골라 시작할 수 있어요.');
    }
  }
  function completePart1(interpreter) {
    $gameSystem._dpPart1Complete = true;
    $gameSystem._dpChapter = 2;
    $gameSystem.onBeforeSave();
    // executeCommand has not run the Pheme introduction yet. Its index is kept:
    // restoring the snapshot resumes the original event exactly once.
    const record = { version: 1, savedAt: Date.now(), take: $gameSwitches.value(216),
      contents: JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())) };
    const v = panel('saving', '1부 완료', '선택과 진행 상황을 저장하고 있어요.');
    const save = async () => {
      v.actions.replaceChildren();
      v.box.querySelector('p').textContent = '선택과 진행 상황을 저장하고 있어요.';
      try {
        await StorageManager.saveObject(KEY, record);
        // Read back before claiming the checkpoint is safely available.
        const readBack = await StorageManager.loadObject(KEY);
        if (!valid(readBack) || readBack.savedAt !== record.savedAt) throw new Error('Checkpoint verification failed');
        if (view !== v) return;
        v.root.dataset.kind = 'complete';
        v.box.querySelector('p').textContent = '1부 완료 기록을 저장했어요.\n다음에는 처음 화면에서 ‘2부 시작’을 누르면 돼요.\n\n나의 선택: ' + label(record.take);
        button(v, 'dc-finish', '오늘은 여기까지', () => { close(); SceneManager.goto(Scene_Title); });
        button(v, 'dc-next', '2부 바로 시작', () => recap(record.take, () => {}, null));
      } catch (_) {
        if (view !== v) return;
        v.root.dataset.kind = 'save-error';
        v.box.querySelector('p').textContent = '완료 기록을 저장하지 못했어요. 다시 저장해 주세요.\n지금 2부를 시작할 수도 있지만, 게임을 닫으면 이 기록으로 이어갈 수 없어요.';
        button(v, 'dc-retry', '다시 저장', save);
        button(v, 'dc-next', '저장 없이 2부 바로 시작', () => recap(record.take, () => {}, null));
      }
    };
    save();
  }

  function startPreset(take) {
    DataManager.setupNewGame();
    // Canonical completed first-act state, from the source events in maps
    // 001/004/005/007/008/019/020/023/025/030. Only mandatory discoveries are
    // included. Future investigation, Ismene and broadcast decisions stay unset.
    const done = [1,2,3,6,7,8,9,13,17,27,28,33,34,35,36,38,39,40,44,45,46,47,
      50,51,52,53,54,55,56,61,62,73,75,76,77,78,79,80,81,82,83,84,90,91,
      93,94,95,96,97,98,101,106,112,252,260];
    done.forEach(id => $gameSwitches.setValue(id, true));
    // Map020 event4 choice and Map030 event15's subsequent Bia response.
    for (const [id, value] of [[216,take],[217,!take],[218,!take],[219,take],
      [228,!take],[231,!take],[99,take]]) $gameSwitches.setValue(id, value);
    for (const [id, value] of [[1,1],[4,6],[7,3],[16,3],[17,3],[18,3],[22,3],[28,5],[31,4]]) {
      $gameVariables.setValue(id, value);
    }
    const completedEvents = {
      1: [3,4,12,13], 4: [11], 5: [12,14,15,16,22,24,25,29,30],
      8: [16], 19: [13,35,39,51], 20: [7,12], 23: [12], 25: [2],
      30: [1,11,13,14,16,17]
    };
    for (const [map, events] of Object.entries(completedEvents)) {
      events.forEach(id => $gameSelfSwitches.setValue([Number(map),id,'A'],true));
    }
    $gameSelfSwitches.setValue([20,11,'C'],true);
    // The two documents obtained in Map004 remain available in later scenes.
    for (const id of [5,6]) $gameParty.gainItem($dataItems[id],1);
    $gameParty.members().slice().forEach(actor => $gameParty.removeActor(actor.actorId()));
    $gameParty.addActor(9);
    $gameSystem._dpPart1Complete = true; $gameSystem._dpChapter = 2;
    $gameSystem._dpChapterOrigin = 'question';
    $gameSystem.completeQuestGuide();
    $gamePlayer.setMoveSpeed(4.5); $gamePlayer.setTransparent(false); $gamePlayer.setThrough(false);
    $gamePlayer.reserveTransfer(15,9,14,8,2);
    AudioManager.stopBgm(); SceneManager.goto(Scene_Map);
  }
  const setup = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    setup.call(this); $gameSystem._dpChapter = 1; $gameSystem._dpPart1Complete = false;
  };
  const execute = Game_Interpreter.prototype.executeCommand;
  Game_Interpreter.prototype.executeCommand = function() {
    if (!view && !$gameSystem._dpPart1Complete && this._mapId === 30 && this._eventId === 15 &&
        this.currentCommand()?.code === 101 && this._list[this._index+1]?.code === 401 &&
        this._list[this._index+1].parameters[0] === '같은 시각, 재신임 투표를 앞둔 방송국에서는 페메가 현장 취재를 준비하고 있었다.') {
      completePart1(this); return false;
    }
    return execute.call(this);
  };
  const wait = Game_Interpreter.prototype.updateWait;
  Game_Interpreter.prototype.updateWait = function() { return !!view || wait.call(this); };
  const sceneUpdate = SceneManager.updateScene;
  SceneManager.updateScene = function() {
    if (view && view.scene !== this._scene) close();
    if (view && view.kind !== 'title') return;
    sceneUpdate.call(this);
  };
  const titleStart = Scene_Title.prototype.start;
  Scene_Title.prototype.start = function() { titleStart.call(this); titleMenu(); };
  const titleUpdate = Scene_Title.prototype.update;
  Scene_Title.prototype.update = function() {
    titleUpdate.call(this);
    for (const b of this._customMenuButtons || []) { b.visible = false; }
    if (this._selectionArrow) this._selectionArrow.visible = false;
    if (this._commandWindow) { this._commandWindow.hide(); this._commandWindow.deactivate(); }
  };
  const titleTerminate = Scene_Title.prototype.terminate;
  Scene_Title.prototype.terminate = function() { close(); titleTerminate.call(this); };
  for (const type of ['keydown','keyup']) window.addEventListener(type, e => {
    if (!view) return;
    // Keep native button activation and Tab focus, but do not feed the game.
    e.stopPropagation();
  }, true);
  window.addEventListener('blur', clearInput);
  window.DP_Chapters = { state: () => view ? view.root.dataset.kind : null };
})();
