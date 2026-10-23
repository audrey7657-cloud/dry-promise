/*:
 * @target MZ
 * @plugindesc 대시 기능을 제거하고 새 게임의 미니맵을 ON으로 시작합니다.
 * @author Dry Promise
 * @orderAfter MK_Minimap
 * @orderAfter MK_Minimap_CollapsibleTab
 * @orderAfter CustomMenu
 * @help
 * 플러그인 목록의 마지막에 배치하세요.
 * Shift, 터치 목적지 이동, 항상 대시 설정으로 달릴 수 없게 합니다.
 * 옵션의 항상 대시 항목도 제거합니다. 이벤트의 이동 속도는 유지합니다.
 * 새 게임에서만 미니맵 옵션을 ON으로 초기화합니다.
 * CG 숨김/복귀, 수동 접기, 저장한 게임의 미니맵 상태는 유지합니다.
 */
(() => {
  "use strict";

  // Old saves may still contain _dashing=true. Ignore it even before the
  // first movement update, including while already moving.
  Game_Player.prototype.isDashing = function() {
    return false;
  };
  Game_Player.prototype.isDashButtonPressed = function() {
    return false;
  };
  Game_Player.prototype.updateDashing = function() {
    this._dashing = false;
  };

  ConfigManager.alwaysDash = false;
  const applyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    applyData.call(this, config);
    this.alwaysDash = false;
  };
  const makeData = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    const config = makeData.call(this);
    config.alwaysDash = false;
    return config;
  };

  const addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    addGeneralOptions.call(this);
    this._list = this._list.filter(option => option.symbol !== "alwaysDash");
  };
  const maxCommands = Scene_Options.prototype.maxCommands;
  Scene_Options.prototype.maxCommands = function() {
    return maxCommands.call(this) - 1;
  };

  // Reset only when starting a new game, never on scene updates or save load.
  // The existing CG checks can still hide the minimap temporarily.
  const setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    setupNewGame.call(this);
    ConfigManager.showMinimap = true;
    $gameSystem.showMinimap = true;
    $gameSystem._mmTabExpanded = true;
  };
})();
