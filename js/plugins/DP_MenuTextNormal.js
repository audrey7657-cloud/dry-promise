/*:
 * @target MZ
 * @plugindesc Uses RPG Maker MZ's normal text style (\C[0]) for menu-related scenes. Dialogue text is untouched.
 * @author OpenAI
 *
 * @help
 * Place BELOW CustomMenu / other menu UI plugins.
 *
 * Menu text will use the same style as normal text:
 * - Text color: Color 0 (\C[0])
 * - Outline color: RPG Maker default outline
 * - Outline width: 3
 *
 * Applies to Scene_MenuBase descendants:
 * main menu, item/evidence, options, save/load, game end, etc.
 *
 * Dialogue/message text on Scene_Map is not changed.
 *
 * Turn OFF older DP_SaveLoadTextColor, DP_MenuTextColor,
 * DP_MenuTextReadable, and DP_MenuTextDark plugins.
 */

(() => {
    "use strict";

    function isMenuScene() {
        const scene = SceneManager._scene;
        return !!scene &&
            typeof Scene_MenuBase !== "undefined" &&
            scene instanceof Scene_MenuBase;
    }

    function isDialogueWindow(win) {
        if (typeof Window_Message !== "undefined" && win instanceof Window_Message) return true;
        if (typeof Window_NameBox !== "undefined" && win instanceof Window_NameBox) return true;
        if (typeof Window_ChoiceList !== "undefined" && win instanceof Window_ChoiceList) return true;
        return false;
    }

    function applyNormalStyle(win) {
        if (!win || !win.contents) return;
        win.contents.textColor = ColorManager.normalColor();
        win.contents.outlineColor = ColorManager.outlineColor();
        win.contents.outlineWidth = 3;
    }

    const _resetTextColor = Window_Base.prototype.resetTextColor;
    Window_Base.prototype.resetTextColor = function() {
        if (isMenuScene() && !isDialogueWindow(this)) {
            applyNormalStyle(this);
        } else {
            _resetTextColor.call(this);
        }
    };

    const _changeTextColor = Window_Base.prototype.changeTextColor;
    Window_Base.prototype.changeTextColor = function(color) {
        if (isMenuScene() && !isDialogueWindow(this)) {
            applyNormalStyle(this);
        } else {
            _changeTextColor.call(this, color);
        }
    };

    const _resetFontSettings = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _resetFontSettings.call(this);
        if (isMenuScene() && !isDialogueWindow(this)) {
            applyNormalStyle(this);
        }
    };

    const _createContents = Window_Base.prototype.createContents;
    Window_Base.prototype.createContents = function() {
        _createContents.call(this);
        if (isMenuScene() && !isDialogueWindow(this)) {
            applyNormalStyle(this);
        }
    };
})();
