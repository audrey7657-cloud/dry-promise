/*:
 * @target MZ
 * @plugindesc v1.0.2 현재 목표 바와 선택식 화면 방향 화살표를 표시합니다.
 * @author OpenAI
 *
 * @param QuestList
 * @text 퀘스트 문장 목록
 * @desc 퀘스트 ID와 화면에 표시할 목표 문장을 한곳에서 관리합니다.
 * @type struct<Quest>[]
 * @default []
 *
 * @param TargetPrefix
 * @text 목표 이벤트 이름 앞부분
 * @desc 목표 이벤트 이름은 이 값_퀘스트ID_장소 형식으로 만듭니다.
 * @type string
 * @default 목표
 *
 * @param HudPosition
 * @text 목표 바 위치
 * @type select
 * @option 화면 아래
 * @value bottom
 * @option 화면 위
 * @value top
 * @default bottom
 *
 * @param HudWidth
 * @text 목표 바 너비
 * @type number
 * @min 360
 * @max 760
 * @default 560
 *
 * @param HudHeight
 * @text 목표 바 높이
 * @type number
 * @min 36
 * @max 64
 * @default 44
 *
 * @param HudMargin
 * @text 화면 가장자리 여백
 * @type number
 * @min 0
 * @max 40
 * @default 12
 *
 * @param FontSize
 * @text 목표 글자 크기
 * @type number
 * @min 12
 * @max 24
 * @default 16
 *
 * @param BackgroundOpacity
 * @text 목표 바 검정 배경 투명도
 * @desc 0은 완전 투명, 255는 불투명입니다.
 * @type number
 * @min 0
 * @max 255
 * @default 165
 *
 * @param HideDuringEvents
 * @text 이벤트 중 목표 바 숨김
 * @desc 대사와 컷신이 진행되는 동안 목표 바와 화살표를 숨깁니다.
 * @type boolean
 * @on 숨김
 * @off 계속 표시
 * @default true
 *
 * @param ArrowSize
 * @text 화살표 크기
 * @type number
 * @min 24
 * @max 64
 * @default 38
 *
 * @param ArrowColor
 * @text 화살표 색상
 * @type string
 * @default #E8D8B5
 *
 * @param ArrowOutlineColor
 * @text 화살표 외곽선 색상
 * @type string
 * @default #5F4A3A
 *
 * @param ArrowOpacity
 * @text 화살표 투명도
 * @type number
 * @min 0
 * @max 255
 * @default 225
 *
 * @param AvoidMinimapTab
 * @text 미니맵 이름표 피하기
 * @desc 화살표가 미니맵 이름표와 겹치면 가장 가까운 빈 곳으로 옮깁니다.
 * @type boolean
 * @on 피하기
 * @off 겹쳐도 그대로 표시
 * @default true
 *
 * @param AvoidUiGap
 * @text 미니맵과 화살표 간격
 * @desc 미니맵 이름표와 화살표 사이에 둘 간격입니다.
 * @type number
 * @min 0
 * @max 40
 * @default 10
 *
 * @command StartQuest
 * @text 퀘스트 시작
 * @desc 목표 바를 표시하고 해당 퀘스트의 목표 이벤트를 찾습니다.
 *
 * @arg QuestId
 * @text 퀘스트 ID
 * @desc 퀘스트 문장 목록에 등록한 ID입니다. 예: S01_01
 * @type string
 * @default S01_01
 *
 * @command CompleteQuest
 * @text 퀘스트 완료
 * @desc 현재 목표 바와 길안내 화살표를 닫습니다.
 *
 * @command SetGuide
 * @text 길안내 상태 변경
 * @desc 길안내 화살표를 켜거나 끕니다.
 *
 * @arg State
 * @text 상태
 * @type select
 * @option 켜기
 * @value on
 * @option 끄기
 * @value off
 * @option 반대로 전환
 * @value toggle
 * @default toggle
 *
 * @help
 * ---------------------------------------------------------------------------
 * 기본 사용법
 * ---------------------------------------------------------------------------
 * 1. 플러그인 관리의 '퀘스트 문장 목록'에 ID와 목표 문장을 등록합니다.
 * 2. 목표로 삼을 맵 이벤트의 이름을 아래처럼 만듭니다.
 *
 *      목표_S01_01_중앙광장출구
 *
 *    '목표_' 다음의 S01_01이 퀘스트 ID입니다. 마지막 장소 이름은 사람이
 *    알아보기 위한 설명이므로 자유롭게 정할 수 있습니다.
 * 3. 이벤트에서 플러그인 명령 '퀘스트 시작'을 실행합니다.
 * 4. 플레이어는 G키 또는 목표 바 오른쪽의 길안내 버튼을 눌러 화살표를
 *    켜고 끌 수 있습니다.
 * 5. 퀘스트가 끝나면 '퀘스트 완료' 명령을 실행합니다.
 *
 * 같은 퀘스트가 여러 맵을 거칠 때는 각 맵에 같은 퀘스트 ID를 가진 목표
 * 이벤트를 하나씩 두면 됩니다.
 *
 * 예시:
 *   아랫마을      목표_S01_01_중앙광장출구
 *   중앙 광장     목표_S01_01_연설장
 *
 * 목표 이벤트에는 이미지나 실행 명령이 없어도 됩니다. MK_Minimap의 표시
 * 전용 이벤트와 같은 이벤트를 함께 사용해도 됩니다.
 *
 * 플러그인 순서 권장:
 *   MK_Minimap
 *   MK_Minimap_CleanName
 *   MM_QuestGuide
 */

/*~struct~Quest:
 * @param Id
 * @text 퀘스트 ID
 * @desc 다른 퀘스트와 겹치지 않는 ID입니다. 예: S01_01
 * @type string
 * @default S01_01
 *
 * @param Text
 * @text 목표 문장
 * @desc 화면의 현재 목표 바에 표시할 문장입니다.
 * @type string
 * @default 이스메네와 중앙 광장으로 가자.
 */

(() => {
  "use strict";

  const pluginName = "MM_QuestGuide";
  const params = PluginManager.parameters(pluginName);

  const parseQuestList = raw => {
    try {
      return JSON.parse(raw || "[]").map(entry => {
        const data = JSON.parse(entry || "{}");
        return {
          id: String(data.Id || "").trim(),
          text: String(data.Text || "").trim(),
        };
      }).filter(quest => quest.id);
    } catch (error) {
      console.error("[MM_QuestGuide] 퀘스트 문장 목록을 읽지 못했습니다.", error);
      return [];
    }
  };

  const questList = parseQuestList(params.QuestList);
  const questDatabase = new Map(questList.map(quest => [quest.id, quest.text]));
  const targetPrefix = String(params.TargetPrefix || "목표").trim();
  const hudPosition = String(params.HudPosition || "bottom");
  const hudWidth = Number(params.HudWidth || 560);
  const hudHeight = Number(params.HudHeight || 44);
  const hudMargin = Number(params.HudMargin || 12);
  const fontSize = Number(params.FontSize || 16);
  const backgroundOpacity = Number(params.BackgroundOpacity || 165);
  const hideDuringEvents = String(params.HideDuringEvents || "true") === "true";
  const arrowSize = Number(params.ArrowSize || 38);
  const arrowColor = String(params.ArrowColor || "#E8D8B5");
  const arrowOutlineColor = String(params.ArrowOutlineColor || "#5F4A3A");
  const arrowOpacity = Number(params.ArrowOpacity || 225);
  const avoidMinimapTab = String(params.AvoidMinimapTab || "true") === "true";
  const avoidUiGap = Number(params.AvoidUiGap || 10);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // G키를 길안내 전환 키로 사용합니다.
  Input.keyMapper[71] = "questGuide";

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
    this.initQuestGuide();
  };

  Game_System.prototype.initQuestGuide = function() {
    this._questGuideId = "";
    this._questGuideEnabled = false;
  };

  Game_System.prototype.ensureQuestGuide = function() {
    if (this._questGuideId === undefined) this.initQuestGuide();
  };

  Game_System.prototype.startQuestGuide = function(questId) {
    this.ensureQuestGuide();
    this._questGuideId = String(questId || "").trim();
    // 퀘스트가 시작되거나 같은 퀘스트가 다시 지정되었을 때 길안내가
    // 갑자기 꺼지지 않도록 기본적으로 함께 켭니다.
    this._questGuideEnabled = !!this._questGuideId;
  };

  Game_System.prototype.completeQuestGuide = function() {
    this.ensureQuestGuide();
    this._questGuideId = "";
    this._questGuideEnabled = false;
  };

  Game_System.prototype.questGuideId = function() {
    this.ensureQuestGuide();
    return this._questGuideId;
  };

  Game_System.prototype.isQuestGuideEnabled = function() {
    this.ensureQuestGuide();
    return !!this._questGuideEnabled;
  };

  Game_System.prototype.setQuestGuideEnabled = function(enabled) {
    this.ensureQuestGuide();
    this._questGuideEnabled = !!enabled;
  };

  Game_System.prototype.toggleQuestGuide = function() {
    this.setQuestGuideEnabled(!this.isQuestGuideEnabled());
  };

  PluginManager.registerCommand(pluginName, "StartQuest", args => {
    $gameSystem.startQuestGuide(args.QuestId);
  });

  PluginManager.registerCommand(pluginName, "CompleteQuest", () => {
    $gameSystem.completeQuestGuide();
  });

  PluginManager.registerCommand(pluginName, "SetGuide", args => {
    const state = String(args.State || "toggle");
    if (state === "on") {
      $gameSystem.setQuestGuideEnabled(true);
    } else if (state === "off") {
      $gameSystem.setQuestGuideEnabled(false);
    } else {
      $gameSystem.toggleQuestGuide();
    }
  });

  class Window_QuestGuide extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this.opacity = 0;
      this.backOpacity = 0;
      this.padding = 0;
      this.createContents();
      this._lastSignature = "";
      this._buttonRect = new Rectangle(0, 0, 0, 0);
      this.refresh();
    }

    objectiveText() {
      const id = $gameSystem ? $gameSystem.questGuideId() : "";
      return questDatabase.get(id) || (id ? `퀘스트 ${id}` : "");
    }

    refresh() {
      if (!this.contents) return;
      this.contents.clear();

      const width = this.contentsWidth();
      const height = this.contentsHeight();
      const alpha = clamp(backgroundOpacity, 0, 255) / 255;
      const buttonWidth = 118;
      const gap = 8;

      this.contents.fillRect(0, 0, width, height, `rgba(18, 12, 8, ${Math.max(alpha, 0.82)})`);

      this.contents.fontFace = $gameSystem ? $gameSystem.mainFontFace() : "sans-serif";
      this.contents.fontSize = fontSize;
      this.contents.outlineWidth = 2;
      this.contents.outlineColor = "rgba(0, 0, 0, 0.92)";

      const labelWidth = 92;
      this.changeTextColor("#F2D79A");
      this.drawText("현재 목표", 14, 0, labelWidth, "left");

      this.changeTextColor("#FFF8EC");
      const textWidth = Math.max(80, width - labelWidth - buttonWidth - 42);
      this.drawText(this.objectiveText(), 14 + labelWidth, 0, textWidth, "left");

      const buttonX = width - buttonWidth - 8;
      const buttonY = 6;
      const buttonHeight = Math.max(24, height - 12);
      this._buttonRect = new Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);

      const guideOn = $gameSystem && $gameSystem.isQuestGuideEnabled();
      const buttonAlpha = guideOn ? 0.44 : 0.28;
      this.contents.fillRect(
        buttonX,
        buttonY,
        buttonWidth,
        buttonHeight,
        `rgba(232, 216, 181, ${buttonAlpha})`
      );

      this.changeTextColor(guideOn ? "#FFF4D7" : "#EEDDBB");
      this.drawText(
        guideOn ? "G  안내 끄기" : "G  길안내",
        buttonX,
        0,
        buttonWidth,
        "center"
      );
      this.resetTextColor();
    }

    signature() {
      if (!$gameSystem) return "";
      return [
        $gameSystem.questGuideId(),
        $gameSystem.isQuestGuideEnabled() ? "1" : "0",
      ].join("|");
    }

    update() {
      super.update();
      const signature = this.signature();
      if (signature !== this._lastSignature) {
        this._lastSignature = signature;
        this.refresh();
      }
    }

    isButtonTouched() {
      if (!this.visible || !this._buttonRect) return false;
      const localX = TouchInput.x - this.x;
      const localY = TouchInput.y - this.y;
      return this._buttonRect.contains(localX, localY);
    }
  }

  const createArrowBitmap = size => {
    const bitmap = new Bitmap(size, size);
    const context = bitmap.context;
    const center = size / 2;
    const scale = size / 40;

    context.save();
    context.translate(center, center);
    context.scale(scale, scale);
    context.beginPath();
    context.moveTo(0, -17);
    context.quadraticCurveTo(1, -17, 2, -16);
    context.lineTo(15, -3);
    context.quadraticCurveTo(17, -1, 14, 0);
    context.lineTo(7, 1);
    context.lineTo(7, 13);
    context.quadraticCurveTo(7, 16, 4, 16);
    context.lineTo(-4, 16);
    context.quadraticCurveTo(-7, 16, -7, 13);
    context.lineTo(-7, 1);
    context.lineTo(-14, 0);
    context.quadraticCurveTo(-17, -1, -15, -3);
    context.lineTo(-2, -16);
    context.quadraticCurveTo(-1, -17, 0, -17);
    context.closePath();
    context.fillStyle = arrowColor;
    context.strokeStyle = arrowOutlineColor;
    context.lineWidth = 2.5;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.fill();
    context.stroke();
    context.restore();
    bitmap.baseTexture.update();
    return bitmap;
  };

  const questHudRect = () => {
    const width = Math.min(hudWidth, Graphics.boxWidth - 24);
    const height = hudHeight;
    const x = Math.floor((Graphics.boxWidth - width) / 2);
    const y = hudPosition === "top"
      ? hudMargin
      : Graphics.boxHeight - height - hudMargin;
    return new Rectangle(x, y, width, height);
  };

  const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
  Scene_Map.prototype.createSpriteset = function() {
    _Scene_Map_createSpriteset.call(this);
    this._questGuideArrow = new Sprite(createArrowBitmap(arrowSize));
    this._questGuideArrow.anchor.set(0.5, 0.5);
    this._questGuideArrow.opacity = arrowOpacity;
    this._questGuideArrow.visible = false;
    this._spriteset.addChild(this._questGuideArrow);
  };

  const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function() {
    _Scene_Map_createAllWindows.call(this);
    this._questGuideWindow = new Window_QuestGuide(questHudRect());
    this.addWindow(this._questGuideWindow);
  };

  Scene_Map.prototype.questGuideTarget = function() {
    if (!$gameSystem || !$gameMap || !$gamePlayer) return null;
    const id = $gameSystem.questGuideId();
    if (!id) return null;
    const prefix = `${targetPrefix}_${id}_`;
    const namedTargets = $gameMap.events().filter(event => {
      if (!event || event._erased || !event.event() || !event.page()) return false;
      return String(event.event().name || "").startsWith(prefix);
    });
    if (!namedTargets.length) return null;

    // 현재 페이지가 실제 목표로 켜진 이벤트를 먼저 고릅니다.
    // 완료 페이지에는 blinking 명령이 없으므로 이미 확인한 장소로
    // 화살표가 되돌아가는 문제를 막을 수 있습니다.
    const activeTargets = namedTargets.filter(event => {
      const list = event.list ? event.list() : [];
      return Array.isArray(list) && list.some(command => (
        command &&
        command.code === 357 &&
        command.parameters &&
        command.parameters[0] === "MK_Minimap" &&
        command.parameters[1] === "event" &&
        command.parameters[command.parameters.length - 1] &&
        command.parameters[command.parameters.length - 1].template === "blinking"
      ));
    });
    const candidates = activeTargets.length ? activeTargets : namedTargets;

    // 한 맵에 같은 퀘스트 목표가 여러 개면 플레이어에게 가장 가까운
    // 목표를 고릅니다. 벽 너머의 먼 출구를 먼저 가리키는 일을 막습니다.
    return candidates.reduce((best, event) => {
      if (!best) return event;
      const bestDistance = $gameMap.distance(
        $gamePlayer.x, $gamePlayer.y, best.x, best.y
      );
      const eventDistance = $gameMap.distance(
        $gamePlayer.x, $gamePlayer.y, event.x, event.y
      );
      return eventDistance < bestDistance ? event : best;
    }, null);
  };

  Scene_Map.prototype.isQuestGuideUiAllowed = function() {
    if (!$gameSystem || !$gameSystem.questGuideId()) return false;
    if ($gameMessage && $gameMessage.isBusy()) return false;
    if (hideDuringEvents && $gameMap && $gameMap.isEventRunning()) return false;
    return true;
  };

  Scene_Map.prototype.updateQuestGuideWindow = function() {
    if (!this._questGuideWindow) return;
    this._questGuideWindow.visible = this.isQuestGuideUiAllowed();
  };

  Scene_Map.prototype.updateQuestGuideInput = function() {
    if (!this.isQuestGuideUiAllowed()) return;
    let toggled = false;

    if (Input.isTriggered("questGuide")) {
      toggled = true;
    } else if (
      TouchInput.isTriggered() &&
      this._questGuideWindow &&
      this._questGuideWindow.isButtonTouched()
    ) {
      toggled = true;
      $gameTemp.clearDestination();
    }

    if (toggled) {
      $gameSystem.toggleQuestGuide();
      SoundManager.playCursor();
    }
  };

  Scene_Map.prototype.moveQuestGuideArrowOutsideMinimapTab = function(
    sprite,
    targetX,
    targetY,
    bounds
  ) {
    if (!avoidMinimapTab || !sprite || !bounds) return;

    const tab = this._minimapCollapseTab;
    if (!tab || !tab.visible || tab.width <= 0 || tab.height <= 0) return;

    const radius = Math.max(arrowSize * 0.72, 20);
    const gap = Math.max(0, avoidUiGap);
    const tabLeft = tab.x;
    const tabRight = tab.x + tab.width;
    const tabTop = tab.y;
    const tabBottom = tab.y + tab.height;

    const overlaps =
      sprite.x + radius > tabLeft - gap &&
      sprite.x - radius < tabRight + gap &&
      sprite.y + radius > tabTop - gap &&
      sprite.y - radius < tabBottom + gap;

    if (!overlaps) return;

    const originalX = sprite.x;
    const originalY = sprite.y;
    const candidates = [
      { x: tabLeft - gap - radius, y: originalY },
      { x: tabRight + gap + radius, y: originalY },
      { x: originalX, y: tabTop - gap - radius },
      { x: originalX, y: tabBottom + gap + radius },
    ].filter(point =>
      point.x >= bounds.left && point.x <= bounds.right &&
      point.y >= bounds.top && point.y <= bounds.bottom
    );

    if (candidates.length === 0) return;

    candidates.sort((a, b) => {
      const distanceA = (a.x - originalX) ** 2 + (a.y - originalY) ** 2;
      const distanceB = (b.x - originalX) ** 2 + (b.y - originalY) ** 2;
      return distanceA - distanceB;
    });

    sprite.x = candidates[0].x;
    sprite.y = candidates[0].y;
    sprite.rotation = Math.atan2(targetY - sprite.y, targetX - sprite.x) + Math.PI / 2;
  };

  Scene_Map.prototype.updateQuestGuideArrow = function() {
    const sprite = this._questGuideArrow;
    if (!sprite) return;

    const allowed = this.isQuestGuideUiAllowed();
    const enabled = $gameSystem && $gameSystem.isQuestGuideEnabled();
    const target = allowed && enabled ? this.questGuideTarget() : null;

    if (!target) {
      sprite.visible = false;
      return;
    }

    const targetX = target.screenX();
    const targetY = target.screenY() - 24;
    const screenWidth = Graphics.width;
    const screenHeight = Graphics.height;
    const margin = Math.max(arrowSize, 42);
    const bottomReserved = hudPosition === "bottom" ? hudHeight + hudMargin + 8 : 0;
    const topReserved = hudPosition === "top" ? hudHeight + hudMargin + 8 : 0;

    const left = margin;
    const right = screenWidth - margin;
    const top = margin + topReserved;
    const bottom = screenHeight - margin - bottomReserved;

    const onScreen =
      targetX >= left && targetX <= right &&
      targetY >= top && targetY <= bottom;

    sprite.visible = true;
    sprite.opacity = arrowOpacity;

    if (onScreen) {
      const bob = Math.sin(Graphics.frameCount / 10) * 4;
      sprite.x = targetX;
      sprite.y = targetY - 34 + bob;
      sprite.rotation = Math.PI;
      this.moveQuestGuideArrowOutsideMinimapTab(sprite, targetX, targetY, {
        left,
        right,
        top,
        bottom,
      });
      return;
    }

    const centerX = screenWidth / 2;
    const centerY = (top + bottom) / 2;
    const deltaX = targetX - centerX;
    const deltaY = targetY - centerY;
    const safeX = Math.abs(deltaX) < 0.001 ? 0.001 : deltaX;
    const safeY = Math.abs(deltaY) < 0.001 ? 0.001 : deltaY;
    const scaleX = deltaX === 0
      ? Number.POSITIVE_INFINITY
      : (deltaX > 0 ? right - centerX : centerX - left) / Math.abs(safeX);
    const scaleY = deltaY === 0
      ? Number.POSITIVE_INFINITY
      : (deltaY > 0 ? bottom - centerY : centerY - top) / Math.abs(safeY);
    const scale = Math.min(scaleX, scaleY);

    sprite.x = centerX + deltaX * scale;
    sprite.y = centerY + deltaY * scale;
    sprite.rotation = Math.atan2(deltaY, deltaX) + Math.PI / 2;
    this.moveQuestGuideArrowOutsideMinimapTab(sprite, targetX, targetY, {
      left,
      right,
      top,
      bottom,
    });
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    this.updateQuestGuideWindow();
    this.updateQuestGuideInput();
    this.updateQuestGuideArrow();
  };
})();
