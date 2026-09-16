/*:
 * @target MZ
 * @plugindesc 메마른 약속 FINAL - 대화 본문/이름/선택지 가독성 강제 보정
 * @author OpenAI
 * @help
 * 다른 대화창 플러그인보다 반드시 아래에서 실행됩니다.
 * 별도 설정은 없습니다.
 */

(() => {
    "use strict";

    const MESSAGE_COLOR = "#FFF7EB";
    const NAME_COLOR = "#FFF4DF";
    const CHOICE_COLOR = "#FFF7EB";
    const OUTLINE_COLOR = "rgba(20, 12, 8, 0.92)";
    const OUTLINE_WIDTH = 2;
    const MESSAGE_FONT_SIZE = 22;
    const MESSAGE_LINE_HEIGHT = 32;

    function forceMessageStyle(win, color) {
        if (!win || !win.contents) return;
        win.contents.fontSize = MESSAGE_FONT_SIZE;
        win.contents.textColor = color;
        win.contents.outlineColor = OUTLINE_COLOR;
        win.contents.outlineWidth = OUTLINE_WIDTH;
    }

    // ---- Message window ----
    const _msgResetFontSettings = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function() {
        _msgResetFontSettings.call(this);
        forceMessageStyle(this, MESSAGE_COLOR);
    };

    Window_Message.prototype.resetTextColor = function() {
        if (this.contents) this.contents.textColor = MESSAGE_COLOR;
    };

    const _msgChangeTextColor = Window_Message.prototype.changeTextColor;
    Window_Message.prototype.changeTextColor = function(color) {
        const normal = ColorManager.normalColor ? ColorManager.normalColor() : null;
        if (!color || color === normal) color = MESSAGE_COLOR;
        _msgChangeTextColor.call(this, color);
        if (this.contents) {
            this.contents.outlineColor = OUTLINE_COLOR;
            this.contents.outlineWidth = OUTLINE_WIDTH;
        }
    };

    Window_Message.prototype.lineHeight = function() {
        return MESSAGE_LINE_HEIGHT;
    };

    const _msgStartMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _msgStartMessage.call(this);
        forceMessageStyle(this, MESSAGE_COLOR);
    };

    // ChimakiMsgSkin 등에서 메시지 준비 중 스타일을 다시 바꾸더라도
    // 실제 문자 처리를 시작하기 직전에 다시 밝은 기본색을 보장한다.
    const _msgProcessAllText = Window_Message.prototype.processAllText;
    if (_msgProcessAllText) {
        Window_Message.prototype.processAllText = function(textState) {
            if (this.contents && this.contents.textColor === ColorManager.normalColor()) {
                this.contents.textColor = MESSAGE_COLOR;
            }
            return _msgProcessAllText.call(this, textState);
        };
    }

    // ---- Name box ----
    if (typeof Window_NameBox !== "undefined") {
        const _nameResetFontSettings = Window_NameBox.prototype.resetFontSettings;
        Window_NameBox.prototype.resetFontSettings = function() {
            _nameResetFontSettings.call(this);
            if (this.contents) {
                this.contents.textColor = NAME_COLOR;
                this.contents.outlineColor = OUTLINE_COLOR;
                this.contents.outlineWidth = OUTLINE_WIDTH;
            }
        };

        Window_NameBox.prototype.resetTextColor = function() {
            if (this.contents) this.contents.textColor = NAME_COLOR;
        };

        const _nameRefresh = Window_NameBox.prototype.refresh;
        Window_NameBox.prototype.refresh = function() {
            _nameRefresh.call(this);
            if (this.contents) {
                this.contents.textColor = NAME_COLOR;
                this.contents.outlineColor = OUTLINE_COLOR;
                this.contents.outlineWidth = OUTLINE_WIDTH;
            }
        };
    }

    // ---- Choice list ----
    if (typeof Window_ChoiceList !== "undefined") {
        const _choiceResetFontSettings = Window_ChoiceList.prototype.resetFontSettings;
        Window_ChoiceList.prototype.resetFontSettings = function() {
            _choiceResetFontSettings.call(this);
            if (this.contents) {
                this.contents.textColor = CHOICE_COLOR;
                this.contents.outlineColor = OUTLINE_COLOR;
                this.contents.outlineWidth = OUTLINE_WIDTH;
            }
        };

        Window_ChoiceList.prototype.resetTextColor = function() {
            if (this.contents) this.contents.textColor = CHOICE_COLOR;
        };
    }
})();
