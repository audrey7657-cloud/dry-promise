/*:
 * @target MZ
 * @plugindesc 메마른 약속 - 태블릿/모바일 가상 방향키 + 결정/메뉴 버튼, 맵 터치 자동이동 차단
 * @author Dry Promise
 *
 * @param ButtonSize
 * @text 버튼 크기
 * @type number
 * @min 40
 * @max 120
 * @default 64
 *
 * @param Opacity
 * @text 버튼 투명도
 * @type number
 * @min 20
 * @max 100
 * @default 58
 *
 * @param DisableMapTouchMove
 * @text 맵 터치 자동이동 차단
 * @type boolean
 * @default true
 *
 * @param ShowMenuButton
 * @text 메뉴 버튼 표시
 * @type boolean
 * @default true
 *
 * @param ForceShow
 * @text PC에서도 테스트용 표시
 * @type boolean
 * @default false
 *
 * @help
 * 터치 기기에서만 가상 방향키와 결정/메뉴 버튼을 표시합니다.
 * 맵을 직접 터치했을 때 목적지까지 자동이동하는 기능은 차단합니다.
 *
 * 방향키/결정/취소는 RPG Maker MZ의 Input 상태를 사용하므로
 * Synrec_QTE의 방향키 QTE(Input.isTriggered)와 호환됩니다.
 * DP_EchoRoute의 연타 QTE는 결정 버튼 연타로 동작합니다.
 */
(() => {
    'use strict';

    const pluginName = 'DP_TouchControls';
    const p = PluginManager.parameters(pluginName);
    const SIZE = Math.max(40, Number(p.ButtonSize || 64));
    const OPACITY = Math.max(0.2, Math.min(1, Number(p.Opacity || 58) / 100));
    const DISABLE_MAP_TOUCH = String(p.DisableMapTouchMove || 'true') === 'true';
    const SHOW_MENU = String(p.ShowMenuButton || 'true') === 'true';
    const FORCE_SHOW = String(p.ForceShow || 'false') === 'true';

    const isTouchDevice = () => FORCE_SHOW || (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    );

    // 맵 바닥 터치 -> 목적지 자동이동만 차단한다.
    // Window/선택지/그림 터치 등 RPG Maker의 일반 터치 UI는 그대로 둔다.
    const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        if (DISABLE_MAP_TOUCH && isTouchDevice()) {
            if ($gameTemp && $gameTemp.clearDestination) $gameTemp.clearDestination();
            return;
        }
        _Scene_Map_processMapTouch.call(this);
    };

    let root = null;
    const held = Object.create(null);

    function setInput(name, value) {
        if (!Input || !Input._currentState) return;
        held[name] = !!value;
        Input._currentState[name] = !!value;
    }

    function releaseAll() {
        for (const key of Object.keys(held)) {
            if (held[key]) Input._currentState[key] = false;
            held[key] = false;
        }
    }

    function makeButton(label, keyName, style, title) {
        const b = document.createElement('div');
        b.textContent = label;
        if (title) b.setAttribute('aria-label', title);
        Object.assign(b.style, {
            position: 'fixed',
            width: SIZE + 'px',
            height: SIZE + 'px',
            lineHeight: SIZE + 'px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            fontWeight: '700',
            fontSize: Math.floor(SIZE * 0.42) + 'px',
            color: '#fff',
            background: `rgba(20,20,20,${OPACITY})`,
            border: '2px solid rgba(255,255,255,0.72)',
            borderRadius: Math.floor(SIZE * 0.24) + 'px',
            boxSizing: 'border-box',
            zIndex: '2147483000',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'none',
            pointerEvents: 'auto',
            ...style
        });

        const down = e => {
            e.preventDefault();
            e.stopPropagation();
            try { b.setPointerCapture(e.pointerId); } catch (_) {}
            setInput(keyName, true);
            b.style.background = `rgba(255,255,255,${Math.min(0.38, OPACITY)})`;
        };
        const up = e => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
                try { b.releasePointerCapture(e.pointerId); } catch (_) {}
            }
            setInput(keyName, false);
            b.style.background = `rgba(20,20,20,${OPACITY})`;
        };

        b.addEventListener('pointerdown', down, {passive:false});
        b.addEventListener('pointerup', up, {passive:false});
        b.addEventListener('pointercancel', up, {passive:false});
        b.addEventListener('lostpointercapture', up, {passive:false});
        return b;
    }

    function createControls() {
        if (!isTouchDevice() || root) return;

        root = document.createElement('div');
        root.id = 'dp-touch-controls';
        Object.assign(root.style, {
            position: 'fixed',
            left: '0', top: '0', right: '0', bottom: '0',
            pointerEvents: 'none',
            zIndex: '2147482999',
            display: 'none'
        });

        const gap = Math.max(5, Math.round(SIZE * 0.10));
        const margin = Math.max(14, Math.round(SIZE * 0.30));
        const step = SIZE + gap;

        // 왼쪽 D-pad: 십자형 배치
        root.appendChild(makeButton('▲', 'up', {
            left: (margin + step) + 'px',
            bottom: (margin + step * 2) + 'px'
        }, '위'));
        root.appendChild(makeButton('◀', 'left', {
            left: margin + 'px',
            bottom: (margin + step) + 'px'
        }, '왼쪽'));
        root.appendChild(makeButton('▶', 'right', {
            left: (margin + step * 2) + 'px',
            bottom: (margin + step) + 'px'
        }, '오른쪽'));
        root.appendChild(makeButton('▼', 'down', {
            left: (margin + step) + 'px',
            bottom: margin + 'px'
        }, '아래'));

        // 오른쪽 결정 버튼
        const okSize = Math.round(SIZE * 1.12);
        const ok = makeButton('●', 'ok', {
            right: margin + 'px',
            bottom: (margin + step) + 'px',
            width: okSize + 'px',
            height: okSize + 'px',
            lineHeight: okSize + 'px',
            borderRadius: '50%'
        }, '결정');
        root.appendChild(ok);

        // 메뉴/취소 버튼. 맵에서는 메뉴, 선택지/메뉴에서는 취소로 작동.
        if (SHOW_MENU) {
            const menu = makeButton('☰', 'cancel', {
                right: (margin + Math.round(SIZE * 0.15)) + 'px',
                bottom: (margin + step * 2 + Math.round(SIZE * 0.35)) + 'px',
                width: Math.round(SIZE * 0.82) + 'px',
                height: Math.round(SIZE * 0.72) + 'px',
                lineHeight: Math.round(SIZE * 0.68) + 'px',
                fontSize: Math.floor(SIZE * 0.34) + 'px'
            }, '메뉴 / 취소');
            root.appendChild(menu);
        }

        document.body.appendChild(root);
    }

    function syncVisibility() {
        if (!root) return;
        const scene = SceneManager && SceneManager._scene;
        const shouldShow = isTouchDevice() && scene instanceof Scene_Map;
        root.style.display = shouldShow ? 'block' : 'none';
        if (!shouldShow) releaseAll();
    }

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        createControls();
        syncVisibility();
    };

    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        _SceneManager_updateMain.call(this);
        if (!root && document.body) createControls();
        syncVisibility();
    };

    window.addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) releaseAll();
    });
})();
