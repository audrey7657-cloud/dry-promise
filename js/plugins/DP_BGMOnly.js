/*:
 * @target MZ
 * @plugindesc Dry Promise - BGM only: Verdict scenes use "Verdict Core" and restore the previous BGM on return.
 * @author Dry Promise
 * @help Audio only. No switches, variables, dialogue, movement, quests, or Verdict logic are changed.
 */
(() => {
  'use strict';
  let depth = 0;
  let savedBgm = null;
  function beginVerdictBgm() {
    if (depth === 0) {
      savedBgm = AudioManager.saveBgm();
      AudioManager.playBgm({ name: 'Verdict Core', volume: 70, pitch: 100, pan: 0 }, 0);
    }
    depth++;
  }
  function endVerdictBgm() {
    depth = Math.max(0, depth - 1);
    if (depth === 0) {
      if (savedBgm && savedBgm.name) AudioManager.replayBgm(savedBgm);
      else AudioManager.stopBgm();
      savedBgm = null;
    }
  }
  function hookScene(klass) {
    if (!klass || !klass.prototype || klass.prototype._dpBgmOnlyHooked) return;
    klass.prototype._dpBgmOnlyHooked = true;
    const _start = klass.prototype.start;
    const _terminate = klass.prototype.terminate;
    klass.prototype.start = function() {
      if (_start) _start.call(this);
      beginVerdictBgm();
    };
    klass.prototype.terminate = function() {
      endVerdictBgm();
      if (_terminate) _terminate.call(this);
    };
  }
  [window.Scene_VerdictCaseFile,window.Scene_VerdictCrossExam,window.Scene_VerdictBoard,window.Scene_VerdictDeduction,window.Scene_EchoLiteracyVerdict,window.Scene_IsmeneTestimonyAccuracy].forEach(hookScene);
})();
