/*:
 * @target MZ
 * @plugindesc 메마른 약속 최종 QA - 4줄 대화 마지막 줄 잘림 방지용 행간 보정
 * @author OpenAI
 * @help 대화 글자 크기는 유지하고 행 높이만 32px로 조정합니다.
 */
(() => {
  "use strict";
  if (typeof Window_Message !== "undefined") {
    Window_Message.prototype.lineHeight = function() { return 32; };
  }
  if (typeof Window_NameBox !== "undefined") {
    Window_NameBox.prototype.lineHeight = function() { return 32; };
  }
})();
