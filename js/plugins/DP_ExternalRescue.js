/*:
 * @target MZ
 * @plugindesc v16 판·비아 정원 경비 완전 비활성·관리실/상자통로 구조
 * @author Dry Promise
 * @help DP_RescueFlowGuard 다음에 배치합니다. 기존 에코/이스메네 구조는 변경하지 않습니다.
 */
(() => {
    'use strict';
    const on=n=>$gameSwitches.value(n), set=(n,v)=>$gameSwitches.setValue(n,v);
    const m=()=>$gameMap.mapId();
    const active=()=>on(290)&&!on(203)&&!on(233)&&!on(276);
    const party=ids=>{
        $gameParty._actors.slice().forEach(id=>{if(!ids.includes(id))$gameParty.removeActor(id);});
        ids.forEach(id=>$gameParty.addActor(id));$gameParty._actors=ids.slice();$gamePlayer.refresh();
        // Pan/Bia must become real party followers, not remain as frozen garden NPCs.
        if($gamePlayer.followers){const fs=$gamePlayer.followers();if(fs.show)fs.show();if(fs.synchronize)fs.synchronize($gamePlayer.x,$gamePlayer.y,$gamePlayer.direction());}
    };
    const quest=id=>$gameSystem.startQuestGuide(id);
    const boxes=()=>$gameMap.events().filter(e=>e&&/^밀기상자/.test(e.event().name));
    const gardenGuardIds=[4,5,6,7,8,10,11,12,19,20,40,41,42,43];
    const neutralizeGarden=()=>{
        if(m()!==19||!active())return;
        for(const id of gardenGuardIds){
            const e=$gameMap.event(id);
            if(e){e.setThrough(true);e.setTransparent(true);}
        }
        // Hide the old static Pan NPC while Pan is the playable rescuer/follower.
        const oldPan=$gameMap.event(18);
        if(oldPan){oldPan.setThrough(true);oldPan.setTransparent(true);}
    };
    Object.assign(DPRescue,{
        startExternal(){
            set(142,false);set(290,true);[275,276,277,278,291,292,295,300,305].forEach(id=>set(id,false));
            const solo=on(222);set(274,!solo);party(solo?[11]:[3,11]);
            $gameSystem._dpRescueRoute=solo?'A':'C';
            $gameSystem._dpRescuePhase=solo?'external_report':'external_manager';
            $gameSystem._dpExternalPassageOpen=false;
            $gameSystem._dpExternalBoxes=null;
            $gameSystem._dpExternalVersion=15;
            quest(solo?'S01_PAN_FIND_BIA':'S01_PAN_MANAGER');
        },
        joinExternal(){
            if(!active())return;
            set(274,true);party([3,11]);$gameSystem._dpRescuePhase='external_manager';quest('S01_PAN_MANAGER');
        },
        openExternalPassage(){
            $gameSystem._dpExternalPassageOpen=true;$gameSystem._dpRescuePhase='external_passage';quest('S01_PAN_PASSAGE');
        },
        enterExternal(){
            set(290,true);set(275,true);set(274,true);party([3,11]);
            $gameSystem._dpRescuePhase='external_boxes';quest('S01_PAN_BOXES');
        },
        completeExternal(){
            set(276,true);DPRescue.prepareWarehouse(true);quest('S01_08NB');
            $gameSystem._dpExternalBoxes=null;
        },
        rememberExternalBoxes(){
            if(m()!==34||!active())return;
            $gameSystem._dpExternalBoxes=boxes().map(e=>({id:e.eventId(),x:e.x,y:e.y}));
        },
        restoreExternalBoxes(){
            if(m()!==34||!active())return;
            const saved=$gameSystem._dpExternalBoxes;
            if(!Array.isArray(saved))return;
            for(const pos of saved){const e=$gameMap.event(pos.id);if(e&&/^밀기상자/.test(e.event().name))e.locate(pos.x,pos.y);}
        },
        resetExternalBoxes(){
            if(m()!==34)return;
            for(const e of boxes())e.locate(e.event().x,e.event().y);
            $gamePlayer.locate(8,20);$gamePlayer.setDirection(8);
            DPRescue.rememberExternalBoxes();quest('S01_PAN_BOXES');
            if(typeof AudioManager!=='undefined')AudioManager.playSe({name:'Move1',volume:75,pitch:100,pan:0});
        }
    });
    const targetIds=()=>{
        if(!active())return null;
        const id=$gameSystem.questGuideId(),map=m();
        if(!/^S01_PAN_/.test(id))return null;
        if(map===13)return[1];if(map===3)return[2];if(map===5)return[1];
        if(map===19)return[on(274)?21:60];
        if(map===20||map===35)return[42];if(map===34)return[1];
        return[];
    };
    const target=Scene_Map.prototype.questGuideTarget;
    Scene_Map.prototype.questGuideTarget=function(){const ids=targetIds();return ids===null?target.call(this):ids.map(id=>$gameMap.event(id)).find(e=>e&&e.page()&&!e._erased)||null;};
    if(typeof Sprite_Minimap_Event!=='undefined'){
        const template=Sprite_Minimap_Event.prototype.findTemplateName;
        Sprite_Minimap_Event.prototype.findTemplateName=function(){
            const ids=targetIds(),base=template.call(this);if(ids===null)return base;
            const e=this.event;if(!e||!e.page()||e._erased)return'hidden';
            if(ids.includes(e.eventId()))return e.list().some(c=>c.code===201)?'DP_RescuePortal':'DP_RescueGoal';
            if(['blinking','quest','DP_RescueGoal','DP_RescuePortal'].includes(base))return'hidden';return base;
        };
    }
    const display=Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects=function(){
        // Recover saves made on the older direct-rescue route before the garden
        // events choose their pages. Never infer a rescue from a visit alone.
        // S224 itself is the story decision for the Pan/Bia rescue.  Recover old
        // saves even when actor 11 was not correctly inserted into the party.
        if([13,3,5,19,20,31,34,35].includes(m()) && !on(203)&&!on(233)&&!on(276)&&!on(291)&&!on(292) &&
            on(224))set(290,true);
        if(m()===34&&on(275)&&!on(276)&&!on(233)&&!on(203)&&
            (on(224)||['A','C'].includes($gameSystem._dpRescueRoute)))set(290,true);
        if(active()&&[13,3,5,19,20,31,34,35].includes(m())){
            // Legacy v11 saves can enter an external map without the new sub-stage.
            if($gameSystem._dpExternalVersion!==15){
                $gameSystem._dpExternalVersion=15;
                if($gameParty._actors.includes(3)||[20,35,34].includes(m())||!on(222))set(274,true);
                else set(274,false);
            }
            party(on(274)?[3,11]:[11]);
            if([13,3,5,31].includes(m()))quest(on(274)?'S01_PAN_MANAGER':'S01_PAN_FIND_BIA');
            if(m()===19)quest(on(274)?'S01_PAN_MANAGER':'S01_PAN_FIND_BIA');
            if(m()===20)quest('S01_PAN_CRATE');
            if(m()===35){$gameSystem._dpExternalPassageOpen=true;quest('S01_PAN_PASSAGE');}
            if(m()===34){party([3,11]);set(274,true);DPRescue.restoreExternalBoxes();quest('S01_PAN_BOXES');}
            if(typeof MK!=='undefined'&&MK.Minimap)MK.Minimap.show();
            if($gameMap.refresh)$gameMap.refresh();
            neutralizeGarden();
        }
        display.call(this);
    };
    const mapRefresh=Game_Map.prototype.refresh;
    Game_Map.prototype.refresh=function(){
        mapRefresh.call(this);
        neutralizeGarden();
    };
    const terminate=Scene_Map.prototype.terminate;
    if(terminate)Scene_Map.prototype.terminate=function(){DPRescue.rememberExternalBoxes();return terminate.call(this);};
    if(typeof DataManager!=='undefined'&&DataManager.makeSaveContents){
        const save=DataManager.makeSaveContents;
        DataManager.makeSaveContents=function(){DPRescue.rememberExternalBoxes();return save.call(this);};
    }
})();
