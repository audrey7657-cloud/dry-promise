/*:
 * @target MZ
 * @plugindesc v1.0.1 MK_Minimap의 지도 이름 글자만 작게 표시합니다.
 * @author OpenAI
 * @base MK_Minimap
 * @orderAfter MK_Minimap
 *
 * @param FontSize
 * @text 글자 크기
 * @desc 미니맵 아래에 표시되는 지도 이름의 글자 크기입니다.
 * @type number
 * @min 12
 * @max 36
 * @default 16
 *
 * @param YOffset
 * @text 세로 위치 보정
 * @desc 양수는 아래로, 음수는 위로 움직입니다.
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param BoxOpacity
 * @text 검정 박스 투명도
 * @desc 0은 완전 투명, 255는 불투명입니다.
 * @type number
 * @min 0
 * @max 255
 * @default 150
 *
 * @param BoxHeight
 * @text 검정 박스 높이
 * @desc 글자 뒤에 표시되는 검정 박스의 높이입니다.
 * @type number
 * @min 18
 * @max 40
 * @default 26
 *
 * @help
 * 플러그인 관리에서 MK_Minimap 바로 아래에 배치하세요.
 *
 * 이 플러그인은 미니맵 아래의 지도 이름에만 적용됩니다.
 * 대사창과 메뉴 등 다른 글자의 크기는 바꾸지 않습니다.
 */

(() => {
  "use strict";

  const pluginName = "MK_Minimap_CleanName";
  const parameters = PluginManager.parameters(pluginName);
  const fontSize = Number(parameters.FontSize || 16);
  const yOffset = Number(parameters.YOffset || 0);
  const boxOpacity = Number(parameters.BoxOpacity || 150);
  const boxHeight = Number(parameters.BoxHeight || 26);

  const originalDrawText = Window_Base.prototype.drawText;

  Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    const scene = SceneManager._scene;
    const minimapSprite = scene && scene._minimapSprite;
    const mapId = typeof $gameMap !== "undefined" && $gameMap
      ? $gameMap.mapId()
      : 0;
    const mapInfo = typeof $dataMapInfos !== "undefined"
      ? $dataMapInfos[mapId]
      : null;
    const editorName = mapInfo ? String(mapInfo.name || "").trim() : "";
    const displayName =
      typeof $gameMap !== "undefined" && $gameMap &&
      typeof $dataMap !== "undefined" && $dataMap
        ? String($gameMap.displayName() || "").trim()
        : "";
    const mapName = editorName || displayName;

    // MK_Minimap의 버전과 창 디자인 설정에 따라 실제 창 좌표가 달라질
    // 수 있으므로, 지도 장면에서 현재 지도 이름을 그릴 때를 기준으로 잡는다.
    const isMinimapName =
      minimapSprite &&
      mapName &&
      String(text) === String(mapName);

    if (!isMinimapName || !this.contents) {
      return originalDrawText.call(this, text, x, y, maxWidth, align);
    }

    const previousFontSize = this.contents.fontSize;
    const previousTextColor = this.contents.textColor;
    const previousOutlineColor = this.contents.outlineColor;

    const boxY = Math.max(0, y + yOffset);
    const visibleBoxHeight = Math.min(boxHeight, this.contentsHeight() - boxY);
    const alpha = Math.max(0, Math.min(255, boxOpacity)) / 255;

    if (visibleBoxHeight > 0) {
      this.contents.fillRect(
        0,
        boxY,
        this.contentsWidth(),
        visibleBoxHeight,
        `rgba(0, 0, 0, ${alpha})`
      );
    }

    this.contents.fontSize = fontSize;
    this.contents.textColor = "#ffffff";
    this.contents.outlineColor = "rgba(0, 0, 0, 0.85)";

    const result = originalDrawText.call(
      this,
      text,
      x,
      y + yOffset,
      maxWidth,
      align
    );

    this.contents.fontSize = previousFontSize;
    this.contents.textColor = previousTextColor;
    this.contents.outlineColor = previousOutlineColor;
    return result;
  };
})();
