/*:
 * @target MZ
 * @plugindesc 인물 표정 일러스트를 그림(Picture) 방식으로 화면에 띄우고 표정을 바꾸는 시스템입니다.
 * @author 이지원 / 메마른 약속
 *
 * @param baseY
 * @text 인물 세로 위치(Y)
 * @desc 인물 그림이 놓이는 화면 세로 좌표(중앙 기준). 기본 816x624 해상도에서 360 권장.
 * @type number
 * @default 360
 *
 * @param scale
 * @text 확대율(%)
 * @desc 인물 그림 크기. 100이면 원본 크기. 너무 크면 90~95로 줄이세요.
 * @type number
 * @default 100
 *
 * @param dimOpacity
 * @text 듣는 인물 흐림 값
 * @desc 두 명이 있을 때 말하지 않는 인물을 얼마나 흐리게 할지(0~255). 180 권장.
 * @type number
 * @default 180
 *
 * @command show
 * @text 인물 등장 / 표정 변경
 * @desc 인물을 화면에 띄웁니다. 같은 위치에 다시 부르면 그 자리에서 표정만 바뀝니다.
 *
 * @arg character
 * @text 인물
 * @type select
 * @option 붉은머리남1
 * @value 붉은머리남1
 * @option 붉은머리남2
 * @value 붉은머리남2
 * @option 백발노인
 * @value 백발노인
 * @option 분홍머리여성
 * @value 분홍머리여성
 * @option 금발여성
 * @value 금발여성
 * @option 갈색머리소녀
 * @value 갈색머리소녀
 * @option 콧수염남
 * @value 콧수염남
 * @option 노랑머리소녀
 * @value 노랑머리소녀
 * @default 붉은머리남1
 *
 * @arg emotion
 * @text 표정 번호
 * @desc 원본 격자 순서(왼→오, 위→아래) 1~6번.
 * @type select
 * @option 1
 * @value 1
 * @option 2
 * @value 2
 * @option 3
 * @value 3
 * @option 4
 * @value 4
 * @option 5
 * @value 5
 * @option 6
 * @value 6
 * @default 1
 *
 * @arg position
 * @text 위치
 * @type select
 * @option 왼쪽
 * @value left
 * @option 가운데
 * @value center
 * @option 오른쪽
 * @value right
 * @default center
 *
 * @arg opacity
 * @text 불투명도(0~255)
 * @desc 255면 또렷함. 비워두면 255. 듣는 인물은 흐림 값 사용을 권장.
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @command hide
 * @text 인물 퇴장
 * @desc 화면의 인물을 지웁니다.
 *
 * @arg position
 * @text 위치
 * @type select
 * @option 왼쪽
 * @value left
 * @option 가운데
 * @value center
 * @option 오른쪽
 * @value right
 * @option 전체
 * @value all
 * @default all
 *
 * @help
 * ─────────────────────────────────────────────
 *  인물표정표시 플러그인 사용법
 * ─────────────────────────────────────────────
 * 1) img/pictures 폴더에 표정 PNG들을 넣습니다.
 *    (파일명 예: 붉은머리남1_1, 붉은머리남1_2 …)
 *
 * 2) 이벤트에서 [플러그인 명령] → 이 플러그인을 고르면
 *    "인물 등장 / 표정 변경" 과 "인물 퇴장" 명령이 나옵니다.
 *
 * 3) 인물 등장: 인물 / 표정 / 위치를 골라 부르면 등장합니다.
 *    표정 변경: 같은 위치에 다시 "인물 등장"을 부르되 표정 번호만
 *    바꾸면, 자리는 그대로 두고 표정만 즉시 교체됩니다.
 *
 * 4) 인물 퇴장: 위치(또는 전체)를 골라 지웁니다.
 *
 * ● 위치별 그림 번호(자동 배정)
 *    왼쪽·가운데 = 그림 1번 / 오른쪽 = 그림 2번
 *    → 왼쪽 인물과 오른쪽 인물을 동시에 띄울 수 있습니다.
 *
 * ● 화자 강조
 *    말하는 인물은 불투명도 255, 듣는 인물은 흐림 값(기본 180)으로
 *    다시 "인물 등장"을 불러주면 자연스럽게 강조됩니다.
 * ─────────────────────────────────────────────
 */

(() => {
    "use strict";

    const pluginName = decodeURIComponent(
        document.currentScript.src.split("/").pop().replace(/\.js$/, "")
    );
    const params = PluginManager.parameters(pluginName);
    const BASE_Y = Number(params.baseY || 360);
    const SCALE  = Number(params.scale || 100);
    const DIM    = Number(params.dimOpacity || 180);

    // 위치 → 그림번호 / X좌표 매핑
    const POS = {
        left:   { pic: 1, x: 250 },
        center: { pic: 1, x: 408 },
        right:  { pic: 2, x: 560 }
    };

    PluginManager.registerCommand(pluginName, "show", args => {
        const p = POS[args.position] || POS.center;
        const name = String(args.character) + "_" + String(args.emotion);
        const opacity = args.opacity === "" || args.opacity == null
            ? 255 : Number(args.opacity);
        // showPicture(그림번호, 파일명, 원점(1=중앙), x, y, 확대X, 확대Y, 불투명도, 합성(0=통상))
        $gameScreen.showPicture(p.pic, name, 1, p.x, BASE_Y, SCALE, SCALE, opacity, 0);
    });

    PluginManager.registerCommand(pluginName, "hide", args => {
        if (args.position === "all") {
            $gameScreen.erasePicture(1);
            $gameScreen.erasePicture(2);
        } else {
            const p = POS[args.position] || POS.center;
            $gameScreen.erasePicture(p.pic);
        }
    });

    // 참고용: 듣는 인물 흐림 값을 다른 곳에서도 쓸 수 있게 노출
    window.$인물흐림 = DIM;
})();
