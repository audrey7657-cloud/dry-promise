/*:
 * @target MZ
 * @plugindesc v16 구조루트 분기복구·이스메네 수동진입·에코 연타QTE 보호
 * @author Dry Promise
 * @help
 * MM_QuestGuide, MK_Minimap, 대화 일러스트 플러그인 다음에 배치합니다.
 * 구조 구간의 실제 이동 이벤트를 화살표와 미니맵이 함께 참조합니다.
 * 조절실 탐색은 목표 스위치 위치를 노출하지 않고, 복구 후 출구만 안내합니다.
 */
(() => {
    'use strict';
    const ENTRY = 'S01_RESCUE_CONTROL_ENTRY';
    const EXIT = 'S01_RESCUE_TEMPLE_EXIT';
    const REPORT = 'S01_RESCUE_TEMPLE_REPORT';
    const SEARCH = 'S01_RESCUE_CONTROL_SEARCH';
    const RETURN = 'S01_RESCUE_CONTROL_RETURN';
    const DARK = [-255, -255, -255, 0];
    const DIM = [-135, -135, -120, 0];
    const on = id => typeof $gameSwitches !== 'undefined' && $gameSwitches && $gameSwitches.value(id);
    const mapId = () => typeof $gameMap !== 'undefined' && $gameMap ? $gameMap.mapId() : 0;
    const control = () => mapId() === 21 && on(292);
    const questId = () => typeof $gameSystem !== 'undefined' && $gameSystem && $gameSystem.questGuideId ? $gameSystem.questGuideId() : '';
    const set = (id, value) => $gameSwitches.setValue(id, value);
    const phase = () => $gameSystem._dpRescuePhase || '';
    const party = ids => {
        $gameParty._actors.slice().forEach(id => { if (!ids.includes(id)) $gameParty.removeActor(id); });
        ids.forEach(id => $gameParty.addActor(id));
        // The leading actor is the playable character, not an old follower.
        $gameParty._actors = ids.slice();
        $gamePlayer.refresh();
        // Rescue routes switch the playable actor several times.  Always restore
        // follower visibility and place the new followers on the player so they
        // do not remain frozen at a previous map coordinate after a transfer.
        if ($gamePlayer.followers) {
            const fs = $gamePlayer.followers();
            if (fs.show) fs.show();
            if (fs.synchronize) fs.synchronize($gamePlayer.x, $gamePlayer.y, $gamePlayer.direction());
        }
    };
    const terminal = () => phase() === 'escaped' || on(203);
    const approaching = () => on(292) && on(285) && !on(211) && !terminal() && phase() !== 'warehouse';
    const entryTile = (x, y) => x === 16 && (y === 19 || y === 20);
    // Resolve from the actual story-branch switches first.  A stale save value must
    // never send the Echo route back to the generic directional-QTE branch.
    const route = () => {
        if (on(224)) return on(222) ? 'A' : 'C';
        if (on(225)) return on(222) ? 'B' : 'D';
        if (on(291) && on(222)) return 'B';
        if (on(292)) return 'D';
        if (on(291) || on(222)) return 'B';
        return $gameSystem._dpRescueRoute || 'D';
    };
    const clearRequest = () => [142,195,277,278,279,280,281,282,287,297,311].forEach(id => set(id,false));
    const armManual = () => {
        $gamePlayer._dpRescueInputReady = false;
        $gamePlayer._dpRescueManualMove = false;
        if (typeof $gameTemp !== 'undefined' && $gameTemp.clearDestination) $gameTemp.clearDestination();
    };
    const api = globalThis.DPRescue = {
        startEchoCartMash() {
            $gameSwitches.setValue(159, false);
            $gameTemp._dpEchoCartMash = {active:true, armed:false, count:0, goal:12,
                frames:240, total:240, startFrame:0, lastFrame:-1};
            $gameSystem.startQuestGuide('S01_ECHO_CART_MASH');
        },
        updateEchoCartMash() {
            const s = $gameTemp._dpEchoCartMash;
            if (!s || !s.active || s.lastFrame === Graphics.frameCount) return;
            s.lastFrame = Graphics.frameCount;
            const touch = typeof TouchInput !== 'undefined';
            if (!s.armed) {
                if (!Input.isPressed('ok') && !(touch && TouchInput.isPressed())) {
                    s.armed = true;s.startFrame = Graphics.frameCount;
                }
                return;
            }
            s.frames = Math.max(0, s.total - (Graphics.frameCount - s.startFrame));
            if (s.frames === 0) {s.active = false;return;}
            if (Input.isTriggered('ok') || (touch && TouchInput.isTriggered())) s.count++;
            if (s.count >= s.goal) {
                $gameSwitches.setValue(159, true);s.active = false;
            }
        },
        finishEchoCartMash() {
            delete $gameTemp._dpEchoCartMash;
            $gameScreen.clearShake();
        },
        beginOutsideControl(eventId) {
            if (!approaching() || mapId() !== 16 || ![5,6].includes(eventId) ||
                !entryTile($gamePlayer.x, $gamePlayer.y)) return false;
            api.ensureIsmeneSolo();
            $gameSystem._dpRescuePhase = 'control';
            // The player has physically reached the outside emergency-stair tile.
            // Do not black out or start the search objective until Map021 is loaded.
            set(287, true);set(204, false);set(295, false);
            eraseDialoguePictures($gameScreen);
            $gameScreen.erasePicture(90);$gameScreen.clearFlash();$gameScreen.clearShake();
            return true;
        },
        ensureIsmeneSolo() {
            if (!on(292) || terminal() || phase() === 'warehouse') return;
            $gameSystem._dpRescueRoute = 'D';
            set(291, false);set(222, false);
            if ($gameParty._actors.length !== 1 || $gameParty._actors[0] !== 2) party([2]);
        },
        restoreIsmeneObjective() {
            if (!on(292) || terminal() || phase() === 'warehouse') return;
            const m = mapId();
            if (![3,5,9,13,16,18,21,22].includes(m)) return;
            api.ensureIsmeneSolo();
            // Recover an empty/stale ID after loading, without replaying dialogue.
            let id;
            if (m === 21) {
                // On first arrival, Map021 event 17 performs the blackout and only
                // then starts SEARCH.  Save/load after that event may restore it.
                const arrived = $gameSelfSwitches.value([21,17,'A']);
                id = on(211) ? RETURN : (arrived ? SEARCH : null);
            } else if (on(211) && [16,18].includes(m)) id = REPORT;
            else if (!on(211)) id = on(285) ? (m === 18 ? EXIT : ENTRY) : 'S01_08X';
            if (id && questId() !== id) $gameSystem.startQuestGuide(id);
        },
        begin() {
            const r=on(224)?(on(222)?'A':'C'):(on(222)?'B':'D');
            $gameSystem._dpRescueRoute=r;
            $gameSystem._dpRescuePhase='request';
            [142,207,210,211,212,233,275,276,277,278,279,280,281,282,283,285,287,290,291,292,293,295,296,297,311].forEach(id=>set(id,false));
            set(290,r==='A'||r==='C');set(291,r==='B');set(292,r==='D');
            $gameSelfSwitches.setValue([32,2,'A'],true);
        },
        beginLegacyRequest() {
            $gameSystem._dpRescueRoute='D';
            set(292,true);set(291,false);set(195,false);set(142,false);
            api.ensureIsmeneSolo();
            if(on(285)) api.handoff();
            else {set(277,true);set(278,false);$gameSelfSwitches.setValue([18,9,'A'],false);}
        },
        handoff() {
            if(terminal())return;
            $gameSystem._dpRescueRoute='D';$gameSystem._dpRescuePhase='approach';
            clearRequest();set(292,true);set(291,false);set(311,true);set(207,true);
            set(290,false);set(275,false);party([2]);armManual();
            $gameSystem.startQuestGuide(mapId() === 18 ? EXIT : ENTRY);
        },
        recoverTemple() {
            if(terminal() || phase()==='warehouse')return;
            if(on(292)) {
                api.ensureIsmeneSolo();
                set(291,false);set(142,false);
                if(on(211)) {clearRequest();party([2]);return;}
                if(on(285)) {api.handoff();$gameSelfSwitches.setValue([18,9,'A'],true);}
                else {set(277,true);set(278,false);set(311,false);$gameSelfSwitches.setValue([18,9,'A'],false);}
            } else if(on(291)&&![279,280,281,283,296,237].some(on)) {
                set(277,true);set(278,false);$gameSelfSwitches.setValue([18,9,'A'],false);
            }
        },
        prepareWarehouse(direct) {
            const r=route();$gameSystem._dpRescueRoute=r;$gameSystem._dpRescuePhase='warehouse';
            clearRequest();[207,210,236,237,275,290,295].forEach(id=>set(id,false));
            set(291,r==='B');set(292,r==='D');set(222,r==='A'||r==='B');
            set(233,!!direct);set(212,!direct);
            $gameSelfSwitches.setValue([32,2,'A'],true);
            if(r==='D')$gameSelfSwitches.setValue([18,17,'A'],true);
            party(on(222)?[1,2]:[1]);
            $gameScreen.erasePicture(90);$gameScreen.startTint([0,0,0,0],0);set(204,false);
        },
        finish() {
            $gameSystem._dpRescuePhase='escaped';
            clearRequest();[207,210,212,236,237,275,290,291,292,295,297].forEach(id=>set(id,false));
            // Once the imprisonment is resolved, Antigone and Ismene are reunited
            // regardless of whether Ismene was inside the warehouse or rescued from outside.
            party([1,2]);
        }
    };
    // Use stage-specific IDs even if an older event still requests an old objective.
    const oldQuest = Game_System.prototype.startQuestGuide;
    Game_System.prototype.startQuestGuide = function(id) {
        if(on(292)&&!terminal()) {
            if([18,16].includes(mapId())&&on(285)&&!on(211)&&
                [EXIT,ENTRY,'S01_08R','S01_08R1','S01_08S','S01_08T','S01_08Z1','S01_08X'].includes(id))id=mapId()===18?EXIT:ENTRY;
            if(control()&&['S01_08R','S01_08R1','S01_08S','S01_08T',EXIT,ENTRY].includes(id))id=on(211)?RETURN:SEARCH;
            if(control()&&id==='S01_08T2')id=RETURN;
        }
        return oldQuest.call(this,id);
    };
    // A held dialogue-dismissal key or queued mouse destination is not a new walk input.
    const oldMoveInput=Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput=function() {
        if(mapId()===18&&on(292)&&on(285)&&!on(211)&&!terminal()) {
            if(!$gameMap.isEventRunning()&&!$gameMessage.isBusy()) {
                const pressed=!!Input.dir4 || (Input.isPressed&&Input.isPressed('ok')) ||
                    (typeof TouchInput!=='undefined'&&TouchInput.isPressed&&TouchInput.isPressed());
                if(!this._dpRescueInputReady) {
                    if(!pressed)this._dpRescueInputReady=true;
                    if(typeof $gameTemp!=='undefined'&&$gameTemp.clearDestination)$gameTemp.clearDestination();
                    return;
                }
                if(Input.dir4 || (typeof $gameTemp!=='undefined'&&$gameTemp.isDestinationValid&&$gameTemp.isDestinationValid()))this._dpRescueManualMove=true;
            }
        }
        return oldMoveInput.call(this);
    };
    const oldEventStart=Game_Event.prototype.start;
    const oldConditions=Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions=function(page) {
        if(this._mapId===18) {
            if([9,10,14,19].includes(this.eventId())&&page.trigger===3&&terminal())return false;
            if([10,14].includes(this.eventId())&&on(292))return false;
            if(this.eventId()===9&&page.trigger===3&&(on(211)&&on(292)||phase()==='warehouse'))return false;
            if(this.eventId()===19&&page.conditions.switch1Id===291&&on(292))return false;
        }
        if(this._mapId===32&&this.eventId()===2&&page.trigger===3&&
            (on(212)||on(143)||on(233)||(on(292)&&on(211))||phase()==='warehouse'||terminal()))return false;
        return oldConditions.call(this,page);
    };
    Game_Event.prototype.start=function() {
        if(mapId()===18&&this.eventId()===1&&on(292)&&on(285)&&!on(211)&&!$gamePlayer._dpRescueManualMove)return;
        return oldEventStart.call(this);
    };
    // Open just these two normally blocked stair tiles during the rescue.
    // All other tiles and all other story routes keep their original collision.
    const oldPassable = Game_Map.prototype.isPassable;
    Game_Map.prototype.isPassable = function(x, y, direction) {
        if (this.mapId() === 16 && approaching() && entryTile(x, y)) return true;
        return oldPassable.call(this, x, y, direction);
    };
    const oldTransferCommand=Game_Interpreter.prototype.command201;
    Game_Interpreter.prototype.command201=function(params) {
        const dest=params[0]===0?params[1]:$gameVariables.value(params[1]);
        if(mapId()===18 && approaching() && this._eventId===1 && dest===16 && !$gamePlayer._dpRescueManualMove) {
            this._index=this._list.length;
            return true;
        }
        if(mapId()===18&&on(292)&&[21,22].includes(dest)) {
                // A saved legacy dialogue may contain its own transfer command.
                api.handoff();
                $gameScreen.erasePicture(90);set(295,false);set(204,false);
                $gameScreen.startTint([0,0,0,0],0);$gameScreen.startFadeIn(1);
                if(typeof MK!=='undefined'&&MK.Minimap)MK.Minimap.show();
                // Do not execute the old post-transfer blackout/party commands either.
                this._index=this._list.length;
                return true;
        }
        if(mapId()===16&&on(292)&&[21,22].includes(dest)) {
            if(!approaching() || ![5,6].includes(this._eventId) || !entryTile($gamePlayer.x,$gamePlayer.y)) {
                this._index=this._list.length;
                return true;
            }
            $gameSystem._dpRescuePhase='control';
        }
        return oldTransferCommand.call(this,params);
    };
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
        if(id === 'S01_ECHO_CART_MASH') return [];
        if (id === EXIT) return m === 18 ? [1] : m === 16 ? [5,6] : [];
        if (id === REPORT && on(292)) return m === 16 ? [4] : m === 18 ? [3] : [];
        if (id === ENTRY || (id === 'S01_08R' && on(292) && on(285))) {
            if (on(211)) return [];
            if (m === 16) return [5,6];
            const ids = {3:2, 5:4, 9:2, 13:1, 16:5, 18:1};
            return ids[m] ? [ids[m]] : [];
        }
        if (id === 'S01_08Z1' || id === 'S01_08X') {
            const ids = {3:2, 5:4, 9:2, 13:1, 16:id === 'S01_08X' ? 4 : 33, 18:3};
            return ids[m] ? [ids[m]] : [];
        }
        if ([SEARCH,'S01_08T'].includes(id) && control()) return [];
        if ([RETURN,'S01_08T2'].includes(id) && control()) return on(211) ? [2] : [];
        if (id === 'S01_08N2') return mapId()===32?[4]:mapId()===33?[3]:[];
        if (id === 'S01_08NB') return mapId()===32?[1]:[];
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
        // Current rescue destinations should look exactly like quest goals,
        // not like an oversized Portal icon. Keep separate template names only
        // for route logic, but render both with the normal blinking quest marker.
        templates.DP_RescuePortal = Object.assign({}, templates.blinking, {
            isBlinking: true, scale: 0.7, scaleWithMinimap: false, opacity: 255, sticksOnEdge: true
        });
        templates.DP_RescueGoal = Object.assign({}, templates.blinking, {
            isBlinking: true, scale: 0.7, scaleWithMinimap: false, opacity: 255, sticksOnEdge: true
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
            // Picture 90 is shared by the rescue flashlight overlay and ending CGs.
            // Only the flashlight should rotate with the player's facing direction.
            const isFlashlight = String(name) === 'DP_flashlight_overlay';
            this.picture(id)._angle = isFlashlight
                ? ({2:0,4:90,6:270,8:180}[$gamePlayer.direction()] || 0)
                : 0;
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
            $gameSwitches.setValue(204, false);
            $gameSelfSwitches.setValue([21, 17, 'A'], false);
            eraseDialoguePictures($gameScreen);
            $gameScreen.erasePicture(90);
            $gameScreen.clearFlash();
            $gameScreen.clearShake();
            // Darkness is applied by Map021 after the transfer, not here.
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
        api.restoreIsmeneObjective();
        // Repair a return-save before the initial-imprisonment autorun can run.
        if(mapId()===32&&!terminal()&&(on(212)||on(143)||on(233)||
            (on(292)&&on(211))||phase()==='warehouse'))api.prepareWarehouse(on(233));
        if(mapId()===18&&on(292)&&on(285)&&!on(211)&&!terminal()&&phase()!=='warehouse')api.handoff();
        if(mapId()===18&&on(292)&&on(211)&&!terminal()&&phase()!=='warehouse') {
            clearRequest();set(291,false);party([2]);
        }
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
