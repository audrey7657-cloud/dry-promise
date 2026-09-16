/*:
 * @target MZ
 * @plugindesc v1.0.5 에코 연타 진행 표시·사원 외부 진입·목표 복구
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

  // The editor may reset QuestList when a plugin is re-added. Keep the game's
  // shipped text here as a fallback; valid editor entries still take precedence.
  const defaultQuestText = {
  "S01_01": "이스메네와 중앙 광장으로 가자.",
  "S01_02": "탈로스의 집에 찾아가자.",
  "S01_03": "물길 관리소에 있는 탈로스에게 약초 파스를 전해주자.",
  "S01_01A": "아랫마을 시민들의 이야기를 들어 보자.",
  "S01_01B": "공장에서 일어난 사고를 확인하자.",
  "S01_01C": "공장의 물 사용 기록을 찾아보자.",
  "S01_01P": "중앙 광장의 시민 세 명에게 이야기를 들어 보자.",
  "S01_01S": "연설을 들을 자리로 가자.",
  "S01_04": "공장 안에서 기계, 물관, 작업 기록을 확인하자.",
  "S01_05": "확인한 사실을 에르가네에게 알려 주자.",
  "S01_06": "에르가네에게 안전하게 조사할 수 있는지 물어보자.",
  "S01_07": "물길 기록실에서 아랫마을 물길 기록을 찾아보자.",
  "S01_08": "윗마을 정원 관리인에게 물 공급 기록에 관해 물어보자.",
  "S01_01H": "집 밖으로 나가자. ",
  "S01_09": "정원에서 실제로 사용되는 물의 양을 확인하자.",
  "S01_010": "부엌 수도를 확인하자",
  "S01_011": "확인한 내용을 정원 관리인에게 알려 주자.",
  "S01_12": "관리실에서 정원에 들어온 물 기록과 물 보내기 지시서를 확인하자.",
  "S01_13": "테미스 기록보관소에서 누가 물의 양을 정하고 허락했는지 확인하자.",
  "S01_08A": "중앙광장 시민들에게 정원으로 가는 다른 길을 물어보자.",
  "S01_08B": "광장 위쪽 골목으로 가자.",
  "S01_08C": "오래된 관리길을 따라 정원 뒤쪽으로 가자.",
  "S01_08D": "경비에게 들키지 않고 정원 안쪽을 살펴보자.",
  "S01_08E": "정원 뒷길의 관리복 상자를 확인하자.",
  "S01_08F": "관리복을 입고 정원의 물 상태를 확인하자.",
  "S01_08G": "정원 관리실에서 급수 기록을 확인하자.",
  "S01_08H": "수상한 두 사람을 찾아 관리실로 가자.",
  "S01_08I": "정원 관리실에서 R-17 전송 기록을 확인하자.",
  "S01_08J": "물길 관리소에서 탈로스에게 현장 상황을 확인하자.",
  "S01_08K": "기록 보관소에서 팔라메데스의 안내를 받아 R-17 원본을 찾자.",
  "S01_08O0": "도시 방송국에서 오늘 아침 원본 메모와 최종 공지를 비교하자.",
  "S01_08L": "열린샘 사람들과 R-17 사본을 함께 확인하자.",
  "S01_08M": "첫샘 사원에서 시민들의 이야기를 듣고 헤스티아를 만나자.",
  "S01_08N": "창고의 연락 장치로 들어오는 구조 신호를 확인하자.",
  "S01_08N2": "문서 수레를 옮기고 숨은 운반문으로 탈출하자.",
  "S01_08O": "페메가 있는 도시 방송국으로 가자.",
  "S01_08P": "방송에 넣을 시민 요구 세 가지를 정하자.",
  "S01_08M2": "대표자 집무실에서 R-17을 결정한 까닭과 공개를 미룬 이유를 묻자.",
  "S01_08X": "첫샘 사원으로 달려가 헤스티아에게 도움을 요청하자.",
  "S01_08Q": "첫샘 기록실에서 물을 함께 쓰던 네 가지 약속을 찾아보자.",
  "S01_08R": "지하 물길에서 세 분기 계기판의 물 배분을 확인하자.",
  "S01_08S": "지하 물길 조절실에서 실제 물 배분 기록을 확인하자.",
  "S01_08T": "손전등으로 조절실을 살펴 붉은 중계 손잡이를 찾아 켜자.",
  "S01_08T2": "중계선을 복구했다. 입구 계단으로 돌아가자.",
  "S01_08U": "열린샘의 안내에 따라 세 수문을 열고 지하에서 빠져나가자.",
  "S01_08V": "도시 방송국에서 확인된 사실과 시민 요구를 공개하자.",
  "S01_08W": "공청회에서 질문에 맞는 자료를 골라 결정 과정을 확인하자.",
  "S01_08Y": "모두가 기다리는 시민회의장으로 가자.",
  "S01_08Y1": "아가멤논에게 공청회 참석을 요청하러 대표자 집무실로 가자.",
  "S01_08Y0": "중앙광장에서 이스메네와 만나자.",
  "S01_08P1": "방송국에서 확인된 사실을 지금 알릴지, 대표자 답변까지 기다릴지 결정하자.",
  "S01_08P2": "페메로 윗마을 거리로 가서 재신임 투표를 앞둔 주민들의 이야기를 직접 취재하자.",
  "S01_08P3": "윗마을 거리에서 주민 네 명의 이야기를 모두 듣자.",
  "S01_08P4": "중앙광장을 지나 윗마을 정원에서 젊은 관리인 판을 직접 만나자.",
  "S01_08P5": "방송국에서 취재 노트와 공식 기록을 다시 비교해 사실과 추측을 구분하자.",
  "S01_08NB": "창고 안쪽에서 비아와 판이 풀어 준 문을 밀어 밖으로 나가자.",
  "S01_08P0": "첫샘 수동 우회선 신호를 방송국 증폭기로 살려 창고 연락 장치와 연결하자.",
  "S01_08P6": "아랫마을로 가서 안티고네에게 정원에서 본 일과 R-17에 대해 직접 확인하자.",
  "S01_08P7": "이스메네의 집으로 가서 같은 사건을 어떻게 봤는지 확인하자.",
  "S01_08P8": "중앙광장으로 돌아가며 취재 메모를 정리하자.",
  "S01_08Z1": "에코가 직접 본 감금 상황을 헤스티아에게 알리고 도움을 요청하자.",
  "S01_08Z2": "페메로 에코와 함께 투표소 뒤편을 확인해 두 사람이 들어간 장소를 특정하자.",
  "S01_08Z3": "에코로 사원 안의 안전 표식 두 개를 찾고 수동 비상 접속함을 복구하자.",
  "S01_08Z4": "방송국에서 첫샘 수동 우회선의 약한 신호를 세 단계로 증폭해 창고와 연결하자.",
  "S01_08Z5": "비아와 판이 창고 밖 잠금장치를 해제하자.",
  "S01_08R1": "미니맵 없이 손전등 불빛만 따라 방향 표식과 비상 통신 경로 세 곳을 확인하자.",
  "S01_RESCUE_TEMPLE_EXIT": "손전등을 챙겼다. 사원 밖으로 나가자.",
  "S01_ECHO_CART_MASH": "결정키를 4초 안에 12번 눌러 문서 수레를 밀자.",
  "S01_RESCUE_CONTROL_ENTRY": "사원 밖 오른쪽 입구로 들어가 지하 물길 조절실로 내려가자.",
  "S01_RESCUE_TEMPLE_REPORT": "사원 안으로 돌아가 헤스티아에게 중계선 복구를 알리자.",
  "S01_RESCUE_CONTROL_SEARCH": "손전등으로 조절실을 살펴 붉은 중계 손잡이를 찾아 켜자.",
  "S01_RESCUE_CONTROL_RETURN": "중계선을 복구했다. 입구 계단으로 돌아가자.",
  "S01_08Z5A": "판으로 윗마을 정원의 비아를 찾아 감금 상황을 알리자.",
  "S01_08Z5B": "비아와 함께 창고로 이어지는 통로를 찾아가자.",
  "S01_08Z6A": "비아와 함께 창고로 이어지는 통로를 찾아가자.",
  "S01_08Z6C": "외부 창고에서 상자를 밀어 문까지 길을 만들자.",
  "S01_08Z6D": "창고 문 앞의 외부 잠금장치를 해제하자.",
  "S01_PAN_FIND_BIA": "윗마을 정원에서 비아를 찾아 목격한 일을 알리자.",
  "S01_PAN_MANAGER": "비아·판과 함께 정원 관리실로 가자.",
  "S01_PAN_CRATE": "관리실의 씨앗 상자를 밀어 오래된 통로를 열자.",
  "S01_PAN_PASSAGE": "상자 뒤 열린 통로로 들어가 창고 뒤편으로 가자.",
  "S01_PAN_BOXES": "상자를 밀어 문까지 길을 만들고 외부 잠금을 풀자.",
  "S01_PAN_UNLOCK": "결정키 또는 화면을 연타해 외부 잠금장치를 풀자.",
  "S01_ECHO_FIND_PHEME": "도시 방송국으로 가서 페메를 찾아 도움을 요청하자.",
  "S01_ECHO_TRACE_ROUTE": "페메로 에코가 본 길을 따라 시청 뒤 창고까지 확인하자.",
  "S01_ECHO_PRESS_DOOR": "창고 뒤편의 여섯 단서를 조사하고 PRESS 네 자리 비밀번호를 찾아보자.",
  "S01_ECHO_CART_INSIDE": "창고 안에서 문서 수레를 밀어 기자 반출문을 열자.",
  "S01_ECHO_RETURN_LOBBY": "구조가 끝났다. 확인한 사실을 시민들과 함께 정리하자.",
  "S01_POST_HEARING_BOARD": "공청회에서 질문에 맞는 자료를 골라 결정 과정을 확인하자.",
  "S01_A_FIND_TALOS": "탈로스를 찾아가자.",
  "S01_A_RETURN_THEMIS": "테미스로 돌아가 기록을 확인하자.",
  "S01_A_ASK_AGAMEMNON": "대표자에게 기록을 보여 주자."
};
  const decode = value => {
    for (let depth = 0; depth < 3 && typeof value === "string"; depth++) {
      value = JSON.parse(value || "null");
    }
    return value;
  };
  const parseQuestList = raw => {
    let entries;
    try { entries = decode(raw || "[]"); }
    catch (error) {
      console.warn("[MM_QuestGuide] 문장 목록 형식 오류: 기본 문장을 사용합니다.", error);
      return [];
    }
    if (!Array.isArray(entries)) return [];
    const result = [];
    for (const entry of entries) {
      try {
        const data = decode(entry);
        if (!data || typeof data !== "object") continue;
        const id = String(data.Id || "").trim();
        const text = String(data.Text || "").trim();
        if (id && text) result.push({ id, text });
      } catch (error) {
        // One damaged entry must not discard every other quest's display text.
        console.warn("[MM_QuestGuide] 잘못된 문장 항목을 건너뜁니다.", error);
      }
    }
    return result;
  };

  const questList = parseQuestList(params.QuestList);
  const questDatabase = new Map(Object.entries(defaultQuestText).map(([id, text]) => [id.trim(), text.trim()]));
  for (const quest of questList) questDatabase.set(quest.id, quest.text);
  questDatabase.set("S01_A_FIND_TALOS", "탈로스를 찾아가자.");
  questDatabase.set("S01_A_RETURN_THEMIS", "테미스로 돌아가 기록을 확인하자.");
  questDatabase.set("S01_A_ASK_AGAMEMNON", "대표자에게 기록을 보여 주자.");
  // Upgrade the previous shipped wording without replacing user-authored text.
  if (questDatabase.get('S01_RESCUE_CONTROL_ENTRY') === '사원 출입구의 계단으로 걸어가 지하 물길 조절실로 내려가자.') {
    questDatabase.set('S01_RESCUE_CONTROL_ENTRY', defaultQuestText.S01_RESCUE_CONTROL_ENTRY);
  }
  Game_System.prototype.questGuideText = function() {
    const id = this.questGuideId();
    return questDatabase.get(id) || (id ? `퀘스트 ${id}` : "");
  };
  const targetPrefix = String(params.TargetPrefix || "목표").trim();
  const hudPosition = String(params.HudPosition || "bottom");
  const hudWidth = Number(params.HudWidth || 560);
  const hudHeight = Number(params.HudHeight || 44);
  const hudMargin = Number(params.HudMargin || 12);
  const fontSize = Number(params.FontSize || 16);
  const backgroundOpacity = Number(params.BackgroundOpacity || 165);
  const hideDuringEvents = String(params.HideDuringEvents || "true") === "true";
  const arrowSize = Number(params.ArrowSize || 38);
  const arrowColor = String(params.ArrowColor || "#FF2020");
  const arrowOutlineColor = String(params.ArrowOutlineColor || "#000000");
  const arrowOpacity = Number(params.ArrowOpacity || 225);
  const avoidMinimapTab = String(params.AvoidMinimapTab || "true") === "true";
  const avoidUiGap = Number(params.AvoidUiGap || 10);
  const echoMash = () => typeof $gameTemp !== 'undefined' && $gameTemp._dpEchoCartMash?.active
    ? $gameTemp._dpEchoCartMash : null;

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
      const mash = echoMash();
      if(mash) return mash.armed
        ? `수레 밀기 ${mash.count}/${mash.goal} · 남은 ${(mash.frames/60).toFixed(1)}초`
        : '결정키에서 손을 떼면 시작합니다.';
      return $gameSystem ? $gameSystem.questGuideText() : "";
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
        echoMash() ? "결정키 연타" : guideOn ? "G  안내 끄기" : "G  길안내",
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
        this.objectiveText(),
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

    // Dry Promise P6 route hard target:
    // On Map019, S01_08P6 means leave the garden toward Central Plaza.
    // Use the real exit event (ID 2) instead of relying on a helper objective event.
    if ($gameMap.mapId && $gameMap.mapId() === 19 && id === 'S01_08P6') {
      const exitEvent = $gameMap.event ? $gameMap.event(2) : null;
      if (exitEvent && !exitEvent._erased && exitEvent.page && exitEvent.page()) {
        return exitEvent;
      }
    }

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
    // Movement-only fallback:
    // If a citizen/NPC/investigation target already has an active blinking marker,
    // preserve the original target selection. Only when there is no active
    // blinking target do we fall back to a map/location movement target.
    const isMovementTargetName = name => {
      const value = String(name || "");
      if (!value.startsWith(`${targetPrefix}_`)) return false;
      if (value.includes("벽의 오래된 방향 표식")) return false;
      return [
        "입구", "출구", "가는길", "가는 길", "돌아가기", "방향",
        "계단", "출입문", "시민회의장", "청문회장",
        "집무실문", "집무실가는길", "정면자리", "연설자리",
        "안티고네집", "이스메네집", "탈로스집"
      ].some(token => value.includes(token));
    };

    const movementTargets = namedTargets.filter(event => {
      const data = event && event.event ? event.event() : null;
      return data && isMovementTargetName(data.name);
    });

    const candidates = activeTargets.length
      ? activeTargets
      : (movementTargets.length ? movementTargets : namedTargets);

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
    if (echoMash()) return true;
    if (hideDuringEvents && $gameMap && $gameMap.isEventRunning()) return false;
    return true;
  };

  Scene_Map.prototype.updateQuestGuideWindow = function() {
    if (!this._questGuideWindow) return;
    this._questGuideWindow.visible = this.isQuestGuideUiAllowed();
  };

  Scene_Map.prototype.updateQuestGuideInput = function() {
    if (echoMash()) return;
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
