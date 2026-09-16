/*:
 * @target MZ
 * @plugindesc v1.0.1 MK_Minimap을 지도 이름표로 접어 두고, 이름표 클릭으로 펼치거나 접습니다.
 * @author OpenAI
 * @base MK_Minimap
 * @orderAfter MK_Minimap
 *
 * @param StartCollapsed
 * @text 새 지도에서 접힌 상태로 시작
 * @type boolean
 * @on 접기
 * @off 펼치기
 * @default true
 *
 * @param Position
 * @text 이름표 위치
 * @type select
 * @option 왼쪽 위
 * @value topLeft
 * @option 오른쪽 위
 * @value topRight
 * @default topLeft
 *
 * @param MarginX
 * @text 가로 여백
 * @type number
 * @min 0
 * @default 12
 *
 * @param MarginY
 * @text 세로 여백
 * @type number
 * @min 0
 * @default 12
 *
 * @param TabWidth
 * @text 이름표 너비
 * @type number
 * @min 120
 * @default 230
 *
 * @param TabHeight
 * @text 이름표 높이
 * @type number
 * @min 32
 * @default 42
 *
 * @param FontSize
 * @text 글자 크기
 * @type number
 * @min 12
 * @max 30
 * @default 17
 *
 * @param BackgroundOpacity
 * @text 이름표 배경 진하기
 * @type number
 * @min 0
 * @max 255
 * @default 175
 *
 * @param ShowHint
 * @text 펼치기·접기 표시
 * @type boolean
 * @on 표시
 * @off 숨김
 * @default true
 *
 * @command Expand
 * @text 미니맵 펼치기
 *
 * @command Collapse
 * @text 미니맵 접기
 *
 * @command Toggle
 * @text 미니맵 펼치기/접기 전환
 *
 * @command HideTab
 * @text 미니맵과 이름표 완전히 숨기기
 *
 * @command ShowTab
 * @text 미니맵 이름표 다시 표시
 *
 * @help
 * [배치 순서]
 *   MK_Minimap
 *   MK_Minimap_CleanName (사용 중일 때)
 *   MK_Minimap_CollapsibleTab
 *
 * 평소에는 작은 지도 이름표만 표시됩니다.
 * 이름표를 클릭하거나 터치하면 미니맵이 펼쳐집니다.
 * 다시 이름표를 누르면 미니맵이 접힙니다.
 *
 * 새 지도에 들어갈 때는 기본적으로 접힌 상태로 시작합니다.
 * 메뉴를 열었다가 돌아올 때에는 기존 상태가 유지됩니다.
 * 대화나 자동 실행 이벤트가 진행 중일 때에는 실수로 눌리지 않습니다.
 *
 * [프롤로그에서 완전히 숨기는 방법]
 * 프롤로그 시작 이벤트에서 플러그인 명령
 * '미니맵과 이름표 완전히 숨기기'를 실행하세요.
 * 프롤로그가 끝난 뒤에는 '미니맵 이름표 다시 표시'를 실행하세요.
 * 다시 표시할 때에는 미니맵이 펼쳐지지 않고 작은 이름표만 나타납니다.
 *
 * 중요:
 * MK_Minimap의 기존 'Map Name Window'는 끄는 것을 권장합니다.
 * 이 플러그인의 이름표가 지도 이름을 대신 표시하기 때문입니다.
 * 기존 Map Name Window가 켜져 있더라도 같은 지도 이름은 중복 표시하지 않습니다.
 *
 * 지도 메모에 <No Minimap>이 있으면 이름표도 표시하지 않습니다.
 */

(() => {
  "use strict";

  const pluginName = "MK_Minimap_CollapsibleTab";
  const params = PluginManager.parameters(pluginName);

  const startCollapsed = String(params.StartCollapsed || "true") === "true";
  const position = String(params.Position || "topLeft");
  const marginX = Number(params.MarginX || 12);
  const marginY = Number(params.MarginY || 12);
  const tabWidth = Number(params.TabWidth || 230);
  const tabHeight = Number(params.TabHeight || 42);
  const fontSize = Number(params.FontSize || 17);
  const backgroundOpacity = Number(params.BackgroundOpacity || 175);
  const showHint = String(params.ShowHint || "true") === "true";

  const minimapApi = () => {
    if (typeof MK === "undefined" || !MK.Minimap) return null;
    return MK.Minimap;
  };

  const mapForbidsMinimap = () => {
    if (!$dataMap || !$dataMap.meta) return false;
    return Object.prototype.hasOwnProperty.call($dataMap.meta, "No Minimap");
  };

  const ensureState = () => {
    if (!$gameSystem) return;
    if ($gameSystem._mmTabExpanded === undefined) {
      $gameSystem._mmTabExpanded = !startCollapsed;
    }
    if ($gameSystem._mmTabMapId === undefined) {
      $gameSystem._mmTabMapId = 0;
    }
    if ($gameSystem._mmTabSuppressed === undefined) {
      $gameSystem._mmTabSuppressed = false;
    }
  };

  const isSuppressed = () => {
    ensureState();
    return !!($gameSystem && $gameSystem._mmTabSuppressed);
  };

  const isExpanded = () => {
    ensureState();
    return !!($gameSystem && $gameSystem._mmTabExpanded);
  };

  const currentMapName = () => {
    const mapId = $gameMap ? $gameMap.mapId() : 0;
    const mapInfo = typeof $dataMapInfos !== "undefined"
      ? $dataMapInfos[mapId]
      : null;
    const editorName = mapInfo ? String(mapInfo.name || "").trim() : "";
    if (editorName) return editorName;

    const displayName = $gameMap && $dataMap
      ? String($gameMap.displayName() || "").trim()
      : "";
    return displayName || "현재 지도";
  };

  const allCurrentMapNames = () => {
    const names = [currentMapName()];
    const displayName = $gameMap && $dataMap
      ? String($gameMap.displayName() || "").trim()
      : "";
    if (displayName) names.push(displayName);
    return [...new Set(names.filter(Boolean))];
  };

  const applyVisibility = expanded => {
    const api = minimapApi();
    if (!api || mapForbidsMinimap()) return;
    if (isSuppressed()) {
      api.hide();
    } else if (expanded) {
      api.show();
    } else {
      api.hide();
    }
  };

  const setExpanded = expanded => {
    ensureState();
    if (!$gameSystem || mapForbidsMinimap() || isSuppressed()) return;
    $gameSystem._mmTabExpanded = !!expanded;
    applyVisibility($gameSystem._mmTabExpanded);

    const scene = SceneManager._scene;
    if (scene && scene._minimapCollapseTab) {
      scene._minimapCollapseTab.refresh();
    }
  };

  const toggleExpanded = () => setExpanded(!isExpanded());

  const hideTab = () => {
    ensureState();
    if (!$gameSystem) return;
    $gameSystem._mmTabSuppressed = true;

    const api = minimapApi();
    if (api) api.hide();

    const scene = SceneManager._scene;
    if (scene && scene._minimapCollapseTab) {
      scene._minimapCollapseTab.visible = false;
    }
  };

  const showTab = () => {
    ensureState();
    if (!$gameSystem) return;
    $gameSystem._mmTabSuppressed = false;
    $gameSystem._mmTabExpanded = false;
    applyVisibility(false);

    const scene = SceneManager._scene;
    if (scene && scene._minimapCollapseTab) {
      scene._minimapCollapseTab.visible = !mapForbidsMinimap();
      scene._minimapCollapseTab.refresh();
    }
  };

  PluginManager.registerCommand(pluginName, "Expand", () => setExpanded(true));
  PluginManager.registerCommand(pluginName, "Collapse", () => setExpanded(false));
  PluginManager.registerCommand(pluginName, "Toggle", () => toggleExpanded());
  PluginManager.registerCommand(pluginName, "HideTab", () => hideTab());
  PluginManager.registerCommand(pluginName, "ShowTab", () => showTab());

  class Window_MinimapCollapseTab extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this.opacity = 0;
      this.backOpacity = 0;
      this.padding = 0;
      this.createContents();
      this._lastSignature = "";
      this.refresh();
    }

    mapName() {
      return currentMapName();
    }

    signature() {
      return `${this.mapName()}|${isExpanded() ? "1" : "0"}`;
    }

    refresh() {
      if (!this.contents) return;
      this.contents.clear();

      const width = this.contentsWidth();
      const height = this.contentsHeight();
      const alpha = Math.max(0, Math.min(255, backgroundOpacity)) / 255;

      this.contents.fillRect(0, 0, width, height, `rgba(0, 0, 0, ${alpha})`);
      this.contents.fontFace = $gameSystem
        ? $gameSystem.mainFontFace()
        : "sans-serif";
      this.contents.fontSize = fontSize;
      this.contents.textColor = "#ffffff";
      this.contents.outlineColor = "rgba(0, 0, 0, 0.85)";
      this.contents.outlineWidth = 3;

      const hint = showHint ? (isExpanded() ? "  ▲" : "  ▼") : "";
      this.drawText(`${this.mapName()}${hint}`, 12, 0, width - 24, "center");
      this._lastSignature = this.signature();
    }

    update() {
      super.update();
      const signature = this.signature();
      if (signature !== this._lastSignature) this.refresh();
    }

    containsScreenPoint(x, y) {
      return this.visible &&
        x >= this.x && x < this.x + this.width &&
        y >= this.y && y < this.y + this.height;
    }
  }

  // 이 플러그인의 이름표가 지도 이름 표시를 대신하므로 RPG Maker의
  // 기본 지도 이름 창은 열지 않는다. MK_Minimap이 별도의 이름 창을
  // 사용하더라도 같은 이름을 다시 그리지 않도록 함께 막는다.
  if (typeof Window_MapName !== "undefined") {
    Window_MapName.prototype.open = function() {
      this.close();
      if (this.contents) this.contents.clear();
    };
  }

  const _Window_Base_drawText = Window_Base.prototype.drawText;
  Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    const scene = SceneManager._scene;
    const mapNames = allCurrentMapNames();
    const drawnText = String(text || "").trim();
    const isOurTab = this instanceof Window_MinimapCollapseTab;
    const isDuplicateMapName =
      scene instanceof Scene_Map &&
      !isOurTab &&
      mapNames.includes(drawnText);

    if (isDuplicateMapName) return;
    return _Window_Base_drawText.call(this, text, x, y, maxWidth, align);
  };

  const tabRect = () => {
    const width = Math.min(tabWidth, Graphics.boxWidth - marginX * 2);
    const height = tabHeight;
    const x = position === "topRight"
      ? Graphics.boxWidth - width - marginX
      : marginX;
    return new Rectangle(x, marginY, width, height);
  };

  const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function() {
    _Scene_Map_createAllWindows.call(this);
    this._minimapCollapseTab = new Window_MinimapCollapseTab(tabRect());
    this.addWindow(this._minimapCollapseTab);
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    ensureState();

    const mapId = $gameMap ? $gameMap.mapId() : 0;
    const enteredNewMap = $gameSystem._mmTabMapId !== mapId;
    if (enteredNewMap) {
      $gameSystem._mmTabMapId = mapId;
      $gameSystem._mmTabExpanded = !startCollapsed;
    }

    if (mapForbidsMinimap() || isSuppressed()) {
      if (this._minimapCollapseTab) this._minimapCollapseTab.visible = false;
      if (isSuppressed()) {
        const api = minimapApi();
        if (api) api.hide();
      }
      return;
    }

    applyVisibility(isExpanded());
    if (this._minimapCollapseTab) {
      this._minimapCollapseTab.visible = true;
      this._minimapCollapseTab.refresh();
    }
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);

    const tab = this._minimapCollapseTab;
    if (isSuppressed()) return;
    if (!tab || !tab.visible || !TouchInput.isTriggered()) return;
    if ($gameMessage && $gameMessage.isBusy()) return;
    if ($gameMap && $gameMap.isEventRunning()) return;

    if (tab.containsScreenPoint(TouchInput.x, TouchInput.y)) {
      toggleExpanded();
      $gameTemp.clearDestination();
      SoundManager.playCursor();
    }
  };
})();
