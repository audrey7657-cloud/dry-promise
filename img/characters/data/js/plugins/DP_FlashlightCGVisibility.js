/*:
 * @target MZ
 * @plugindesc 손전등 탐색 중 전체화면 CG가 어두워지지 않도록 조명을 자동 전환합니다.
 * @author Dry Promise
 * @help
 * Map021/Map022에서 손전등이 켜진 동안 CG_로 시작하는 전체화면
 * 일러스트가 표시되면 손전등 마스크와 암전을 잠시 해제합니다.
 * CG가 닫히면 어두운 탐색 조명을 자동으로 복원합니다.
 */

(() => {
    'use strict';

    const LIGHT_SWITCH = 295;
    const OVERLAY_PICTURE_ID = 90;
    const EXPLORE_TONE = [-135, -135, -120, 0];
    const CONTROL_MAPS = [21, 22];

    const isControlMap = () =>
        typeof $gameMap !== 'undefined' && CONTROL_MAPS.includes($gameMap.mapId());

    const isCgPicture = picture =>
        picture && typeof picture.name === 'function' && /^CG_/i.test(picture.name());

    const hasCgPicture = screen =>
        screen._pictures && screen._pictures.some(isCgPicture);

    const _erasePicture = Game_Screen.prototype.erasePicture;
    const _showPicture = Game_Screen.prototype.showPicture;

    Game_Screen.prototype.showPicture = function(pictureId, name) {
        if (/^CG_/i.test(String(name || '')) && isControlMap() &&
                typeof $gameSwitches !== 'undefined' && $gameSwitches.value(LIGHT_SWITCH)) {
            this._dpResumeFlashlightAfterCg = true;
            $gameSwitches.setValue(LIGHT_SWITCH, false);
            _erasePicture.call(this, OVERLAY_PICTURE_ID);
            this.startTint([0, 0, 0, 0], 0);
        }
        _showPicture.apply(this, arguments);
    };

    Game_Screen.prototype.erasePicture = function(pictureId) {
        const wasCg = isCgPicture(this.picture(pictureId));
        _erasePicture.call(this, pictureId);
        if (wasCg && this._dpResumeFlashlightAfterCg && !hasCgPicture(this)) {
            this._dpResumeFlashlightAfterCg = false;
            if (isControlMap() && typeof $gameSwitches !== 'undefined') {
                $gameSwitches.setValue(LIGHT_SWITCH, true);
                _showPicture.call(
                    this,
                    OVERLAY_PICTURE_ID,
                    'DP_flashlight_overlay',
                    1,
                    $gamePlayer.screenX(),
                    $gamePlayer.screenY() - 24,
                    100,
                    100,
                    255,
                    0
                );
                this.startTint(EXPLORE_TONE, 0);
            }
        }
    };
})();
