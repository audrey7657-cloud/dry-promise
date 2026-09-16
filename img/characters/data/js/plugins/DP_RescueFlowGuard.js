/*:
 * @target MZ
 * @plugindesc 구조 루트 대화·목표 표시 동기화 / 조절실 첫 프레임 조명 보호 v10
 * @author Dry Promise
 * @help
 * MM_QuestGuide, MK_Minimap, 대화 일러스트 플러그인 다음에 배치합니다.
 * 구조 구간의 실제 이동 이벤트를 화살표와 미니맵이 함께 참조합니다.
 * 조절실 탐색은 목표 스위치 위치를 노출하지 않고, 복구 후 출구만 안내합니다.
 */
(() => {
    'use strict';
    const ENTRY = 'S01_RESCUE_CONTROL_ENTRY';
    const DARK = [-255, -255, -255, 0];
    const DIM = [-135, -135, -120, 0];
    const on = id => typeof $gameSwitches !== 'undefined' && $gameSwitches && $gameSwitches.value(id);
    const mapId = () => typeof $gameMap !== 'undefined' && $gameMap ? $gameMap.mapId() : 0;
    const control = () => mapId() === 21 && on(292);
    const questId = () => typeof $gameSystem !== 'undefined' && $gameSystem && $gameSystem.questGuideId ? $gameSystem.questGuideId() : '';
    const validEvent = id => {
        const event = $gameMap.event(id);
        return event && !event._erased && event.page() ? event : null;
    };
    const firstDoorTo = destination => {
        const event = $gameMap.events().find(e => e && !e._erased && e.page() &&
            e.page().trigger <= 2 && e.list().some(c => c.code === 201 && c.indent === 0 && c.parameters[1] === destination));
        return event ? [event.eventId()] : [];
    };
    // null: ordinary story quest, unchanged. []: intentional exploration, no guide target.
    function targetIds() {
        const id = questId(), m = mapId();
        if (id === ENTRY || (id === 'S01_08R' && on(292) && on(285))) {
            if (on(211)) return [];
            const ids = {3:2, 5:4, 9:2, 13:1, 16:5, 18:1};
            return ids[m] ? [ids[m]] : [];
        }
        if (id === 'S01_08Z1' || id === 'S01_08X') {
            const ids = {3:2, 5:4, 9:2, 13:1, 16:id === 'S01_08X' ? 4 : 33, 18:3};
            return ids[m] ? [ids[m]] : [];
        }
        if (id === 'S01_08T' && control()) return [];
        if (id === 'S01_08T2' && control()) return on(211) ? [2] : [];
        if (id === 'S01_08Z3' && on(291)) {
            if (m !== 18 || on(296)) return [];
            if ($gameVariables.value(50) >= 2) return [13];
            return [11, 12].filter(i => !$gameSelfSwitches.value([18, i, 'A']));
        }
        if (id === 'S01_08Z4' && on(291)) {
            if (m === 15) return [20];
            if (m === 9) return [4];
            if (m === 18) return [1];
            if (m === 16 || m === 5) return firstDoorTo(9);
            return [];
        }
        if (id === 'S01_08Z5') return m === 34 ? [43] : [];
        return null;
    }
    function nearestTarget() {
        const ids = targetIds();
        if (ids === null) return undefined;
        return ids.map(validEvent).filter(Boolean).reduce((best, event) => {
            if (!best) return event;
            return $gameMap.distance($gamePlayer.x, $gamePlayer.y, event.x, event.y) <
                $gameMap.distance($gamePlayer.x, $gamePlayer.y, best.x, best.y) ? event : best;
        }, null);
    }
    if (Scene_Map.prototype.questGuideTarget) {
        const original = Scene_Map.prototype.questGuideTarget;
        Scene_Map.prototype.questGuideTarget = function() {
            const target = nearestTarget();
            return target === undefined ? original.call(this) : target;
        };
    }
    if (typeof MK !== 'undefined' && MK.Minimap && typeof Sprite_Minimap_Event !== 'undefined') {
        // CollapsibleTab calls show() during Scene_Map.start; prevent a one-frame
        // minimap reveal regardless of which visibility command ran first.
        const oldVisible = MK.Minimap.isVisible;
        if (oldVisible) MK.Minimap.isVisible = function() {
            return control() ? false : oldVisible.apply(this, arguments);
        };
        const templates = MK.Minimap.eventTemplates;
        templates.DP_RescuePortal = Object.assign({}, templates.Portal, {
            isBlinking: true, scale: 0.9, scaleWithMinimap: false, opacity: 255, sticksOnEdge: true
        });
        templates.DP_RescueGoal = Object.assign({}, templates.blinking, {
            scale: 0.9, scaleWithMinimap: false, opacity: 255, sticksOnEdge: true
        });
        const oldTemplate = Sprite_Minimap_Event.prototype.findTemplateName;
        Sprite_Minimap_Event.prototype.findTemplateName = function() {
            const ids = targetIds();
            const original = oldTemplate.call(this);
            if (ids === null) return original;
            const e = this.event;
            if (!e || !e.page() || e._erased) return 'hidden';
            const isDoor = e.page().trigger <= 2 && e.list().some(c => c.code === 201 && c.indent === 0);
            if (ids.includes(e.eventId())) return isDoor ? 'DP_RescuePortal' : 'DP_RescueGoal';
            // Remove obsolete or overlapping goal helpers, not ordinary portal icons.
            if (original === 'blinking' || original === 'quest') return isDoor ? 'Portal' : 'hidden';
            return original;
        };
        const oldRefresh = Sprite_Minimap_Event.prototype.requiresRefresh;
        Sprite_Minimap_Event.prototype.requiresRefresh = function() {
            const signature = `${questId()}:${(targetIds() || []).join(',')}`;
            const changed = this._dpRescueSignature !== signature;
            this._dpRescueSignature = signature;
            return oldRefresh.call(this) || changed;
        };
    }
    function eraseDialoguePictures(screen) {
        screen._dpResumeFlashlightAfterCg = false;
        [21, 22, 50].forEach(id => screen.erasePicture(id));
    }
    const oldPicture = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function(id, name) {
        if (control() && ([21, 22].includes(Number(id)) || /^CG_/i.test(String(name)))) {
            this.erasePicture(id);
            return;
        }
        const result = oldPicture.apply(this, arguments);
        if (Number(id) === 90 && this.picture(id)) {
            this.picture(id)._angle = {2:0,4:90,6:270,8:180}[$gamePlayer.direction()] || 0;
        }
        return result;
    };
    const oldMessage = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function(params) {
        if (control()) {
            const copy = params.slice();
            copy[0] = '';
            eraseDialoguePictures($gameScreen);
            return oldMessage.call(this, copy);
        }
        return oldMessage.call(this, params);
    };
    // This happens before the destination scene can be rendered, not a later autorun.
    const oldReserve = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(destination, x, y, direction, fadeType) {
        if (on(292) && on(285) && destination === 22) {
            destination = 21; x = 15; y = 25; direction = 8;
            $gameSwitches.setValue(287, true);
        }
        if (on(292) && destination === 21) {
            $gameSwitches.setValue(295, false);
            $gameSwitches.setValue(204, true);
            $gameSelfSwitches.setValue([21, 17, 'A'], false);
            eraseDialoguePictures($gameScreen);
            $gameScreen.erasePicture(90);
            $gameScreen.clearFlash();
            $gameScreen.clearShake();
            $gameScreen.startTint(DARK, 0);
        }
        return oldReserve.call(this, destination, x, y, direction, fadeType);
    };
    const oldCreate = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        if (mapId() === 22 && on(292) && on(285) && !$gamePlayer.isTransferring()) {
            $gamePlayer.reserveTransfer(21, 15, 25, 8, 2);
            $gameSwitches.setValue(287, true);
        }
        oldCreate.call(this);
    };
    const oldDisplay = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        if (control()) {
            eraseDialoguePictures($gameScreen);
            $gameSwitches.setValue(204, true);
            // Save/load during exploration keeps the already-lit flashlight.
            if ($gameSelfSwitches.value([21, 17, 'A'])) $gameSwitches.setValue(295, true);
            $gameScreen.startTint(on(295) ? DIM : DARK, 0);
            if (on(295) && !$gameScreen.picture(90)) {
                $gameScreen.showPicture(90, 'DP_flashlight_overlay', 1,
                    $gamePlayer.screenX(), $gamePlayer.screenY() - 24, 100, 100, 255, 0);
            }
            if (typeof MK !== 'undefined' && MK.Minimap) MK.Minimap.hide();
        } else if (on(292) && on(285) && !on(211) && ['S01_08R','S01_08R1'].includes(questId())) {
            $gameSystem.startQuestGuide(ENTRY);
        }
        oldDisplay.call(this);
    };
    const oldStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        oldStart.call(this);
        if (control()) {
            if (typeof MK !== 'undefined' && MK.Minimap) MK.Minimap.hide();
            if (this._minimapCollapseTab) this._minimapCollapseTab.visible = false;
        }
    };
})();
