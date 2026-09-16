/*:
 * @target MZ
 * @plugindesc msg skin plugin 2.0
 * @author Chimaki
 * @url https://www.patreon.com/cw/chimakier
 * 
 * 
 * @param centerSwitchIdForver
 * @text center switch ID forver
 * @desc when this switch is ON, the text will be centered until this switch is turned off
 * @type switch
 * @default 3
 * 
 * @param useDefaultBgSwitchId
 * @text use default bg switch id
 * @type switch
 * @default 2
 * 
 * 
 * @param autoBreak
 * @text use auto break 
 * @type boolean
 * @default true
 * 
 * 
 * @param CtrlToSkip    
 * @text use Ctrl to skip msg
 * @type boolean
 * @default true
 * 
 * 
 * @param MsgSetting
 * 
 * 
 * 
 * @param defaultOutlineColor
 * @parent MsgSetting
 * @text default outline color
 * @default #00000080;
 * @desc default outline color, alpha is supported, such as #00000080. Default is translucent black
 * 
 * @param defaultOutlineWidth
 * @parent MsgSetting
 * @text default outline width
 * @default 3
 * 
 * @param defaultFontSize
 * @parent MsgSetting
 * @text default font size
 * @default 28
 * 
 * 
 * 
 * 
 * @param msgMaxWidth
 * @parent MsgSetting
 * @text msg max width
 * @default 400
 * 
 * @param backImag
 * @parent MsgSetting
 * @text msg back img 
 * @type file
 * @dir img/system
 * 
 * @param startXOffset
 * @parent MsgSetting
 * @text start x offset
 * @default 0
 * 
 * @param startYOffset
 * @parent MsgSetting
 * @text start y offset , dont < 0
 * @default 0
 * 
 * 
 * @param backPosOffsetX
 * @parent MsgSetting
 * @text back img offset X
 * @default 0
 * 
 * @param backPosOffsetY
 * @parent MsgSetting
 * @text back img offset y
 * @default 0
 * 
 * 
 * @param enbaleMsgBaseY
 * @parent MsgSetting
 * @text enable msg base y offset
 * @desc only work when window position is bottom
 * @type boolean
 * 
 * @param msgBaseY
 * @parent MsgSetting
 * @text msg base y offset
 * @default 0
 * 
 * @param charSpacing
 * @parent MsgSetting
 * @text character spacing
 * @desc Extra spacing between each character in pixels. 0 = default.
 * @type number
 * @min 0
 * @default 0
 * 
 * @param backFrameCloseMode
 * @parent MsgSetting
 * @text back frame close mode
 * @desc Controls whether _backFrame closes with the message window.
 * @type select
 * @option default (close with window)
 * @value 0
 * @option stay open (use command to close)
 * @value 1
 * @default 0
 * 
 * @param hideBackFrameSwitchId
 * @parent MsgSetting
 * @text force hide back frame switch id
 * @desc When this switch is ON, _backFrame stays hidden while other message skin effects continue.
 * @type switch
 * @default 0
 * 
 * 
 * 
 * 
 * @param nameBoxSetting
 * 

 * 
 * 
 * @param nameBoxOutlineColor
 * @parent nameBoxSetting
 * @text name box outline color
 * @default #00000080
 * 
 * @param nameBoxOutlineWidth
 * @parent nameBoxSetting
 * @text name box outline width
 * @default 3
 * 
 * @param nameBoxFontSize
 * @parent nameBoxSetting
 * @text name box font size
 * @default 28
 * 
 * 
 * 
 * 
 * @param nameBoxCenter
 * @parent nameBoxSetting
 * @text name box center
 * @type select
 * 
 * @option left
 * @value 0
 * @option center
 * @value 1
 * @option right
 * @value 2
 * 
 * @param nameBoxPosX
 * @parent nameBoxSetting
 * @text name box pos X
 * @default 0
 * 
 * @param nameBoxPosY
 * @parent nameBoxSetting
 * @text name box pos Y
 * @default 0
 * 
 * @param nameBoxImag
 * @parent nameBoxSetting
 * @text name box img
 * @type file
 * @dir img/system
 
 * 
 * @param nameBoxImgOffsetX
 * @parent nameBoxSetting
 * @text name box img offset X
 * @default 0
 * 
 * 
 * @param nameBoxImgOffsetY
 * @parent nameBoxSetting
 * @text name box img offset Y
 * @default 0
 * 
 * 
 * 
 

 * 
 * 
 * 
 * @param TextWidthSe
 * 
 * 
 * @param useTextWidthSe
 * @parent TextWidthSe
 * @text Enable Text Width SE
 * @type boolean
 * @default false
 * 
 * 
 * @param SeName
 * @parent TextWidthSe
 * @type file
 * @dir audio/se
 * 
 * 
 * 
 * @param ChoiceSetting
 * 
 * @param enableChoice
 * @parent ChoiceSetting
 * @text enable choice features
 * @type boolean
 * 
 * @param choiceImageNoraml
 * @parent ChoiceSetting
 * @text choice background img
 * @type file
 * @dir img/system
 * 
 * @param choiceImageHover
 * @parent ChoiceSetting
 * @text choice hover background img
 * @type file
 * @dir img/system
 * 
 * @param ImageHeight
 * @parent ChoiceSetting
 * @text space between choices
 * @default 76
 * 
 * @param enableTouch
 * @parent ChoiceSetting
 * @text enable touch choice
 * @type boolean
 * @default true
 * 
 * @param centerYOffset
 * @parent ChoiceSetting
 * @text choice Y offset
 * default 40
 * 
 * @param choiceHoverScale
 * @parent ChoiceSetting
 * @text choice hover scale
 * @type number
 * @decimals 2
 * @default 1.05
 * 
 * @param choiceHoverSeName
 * @parent ChoiceSetting
 * @text choice hover SE
 * @type file
 * @dir audio/se
 * 
 * @param choiceHoverSeVolume
 * @parent ChoiceSetting
 * @text choice hover SE volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param choiceHoverSePitch
 * @parent ChoiceSetting
 * @text choice hover SE pitch
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param choiceHoverSePan
 * @parent ChoiceSetting
 * @text choice hover SE pan
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * 
 * 
 * @command changeMsgSetting
 * @text change message setting
 * @desc Change message outline color, outline width, and font size immediately for the current and following messages
 * 
 * @arg color
 * @text outline color
 * @desc Leave empty to keep the current outline color
 * @type string
 * 
 * @arg width
 * @text outline width
 * @desc Leave empty to keep the current outline width
 * @type number
 * 
 * @arg fontSize
 * @text font size
 * @desc Leave empty to keep the current font size
 * @type number
 * 
 * 
 * @command changeNamBoxSetting
 * @text change name box setting
 * @desc Change name box outline color, outline width, and font size immediately for the current and following messages
 * 
 * @arg color
 * @text outline color
 * @desc Leave empty to keep the current outline color
 * @type string
 * 
 * @arg width
 * @text outline width
 * @desc Leave empty to keep the current outline width
 * @type number
 * 
 * @arg fontSize
 * @text font size
 * @desc Leave empty to keep the current font size
 * @type number
 * 
 * 
 * @command changeTextAlign
 * @text change text alignment
 * @desc Set text alignment for current and following messages
 * 
 * @arg align
 * @text alignment
 * @type select
 * @default left
 * @option left
 * @option center
 * @option right
 * 
 * 
 * @command closeBackFrame
 * @text close back frame
 * @desc Directly hide the message back frame sprite immediately.
 * 
 *
 * @command changeAutoBreak
 * @text change auto line break
 * @desc Enable or disable automatic line breaks for current and following messages.
 *
 * @arg enabled
 * @text enable auto line break
 * @type boolean
 * @default true
 *
 *
 * @help 
 * 
 * how to use 使用教學 (open cc plz): 
 * https://youtu.be/G0wtd7krv94
 * 
 * change log:
 *  v 1.4.8
 * - fix: 多行置中錯誤
 * * v 1.4.7
 * - feat: 追加文本常駐置中開關參數
 * 
 * v 1.4.6
 * - fix : 優化選項的touch的時, msgback取消預設值
 * v 1.4.5
 * - fix : ChimakiLang.js 兼容問題
 * v 1.4.4
 * - name box 支援ChimakiLang.js
 * v 1.4.3
 * - 修正名稱底圖對位置
 * v 1.4.2
 * - fix show text line
 * v 1.4.1
 * - fix 防呆
 * v 1.4
 * - fix 鍵盤選縣沒有顯示hover圖片問題
 * 
 * v 1.3 
 * - 追加修改訊息視窗基本y軸選項，只有在設定底部時有效
 * 
 * v 1.2
 * - 修正選擇框滑鼠觸碰錯誤問題
 * 
 * v 1.1 
 * - 名稱框加入定位點選項,
 * - 一次性置中支援多行
 * 
 * 
 * 
 */
 
 
/*:zh_TW
 * @target MZ
 * @plugindesc  msg skin plugin 2.0
 * @author Chimaki
 * @url https://www.patreon.com/cw/chimakier
 * 
 * 
 * @param centerSwitchIdForver
 * @text 文字置中開關
 * @desc 開啟後，顯示文本會文字置中顯示，直到關閉此開關
 * @type switch
 * @default 3
 * 
 * @param useDefaultBgSwitchId
 * @text 恢復預設視窗開關
 * @desc 開啟此開關時，使用系統預設訊息框背景
 * @type switch
 * @default 2
 * 
 * 
 * @param autoBreak
 * @text 啟用自動換行
 * @type boolean
 * @default true
 * 
 * 
 * @param CtrlToSkip    
 * @text 啟用ctrl快進訊息
 * @type boolean
 * @default true
 * 
 * 
 * @param MsgSetting
 * 
 * 
 * 
 * @param defaultOutlineColor
 * @parent MsgSetting
 * @text 預設描邊顏色
 * @default #00000080;
 * @desc 預設描邊顏色，支援alpha，例如#00000080，預設是半透明黑色
 * 
 * @param defaultOutlineWidth
 * @parent MsgSetting
 * @text 預設描邊寬度
 * @default 3
 * 
 * @param defaultFontSize
 * @parent MsgSetting
 * @text 預設字體大小
 * @default 28
 * 
 * 
 * 
 * @param msgMaxWidth
 * @parent MsgSetting
 * @text 訊息框最大寬度
 * @default 400
 * 
 * @param backImag
 * @parent MsgSetting
 * @text 訊息框背景圖
 * @type file
 * @dir img/system
 * 
 * @param startXOffset
 * @parent MsgSetting
 * @text 文字起始X偏移
 * @default 0
 * 
 * @param startYOffset
 * @parent MsgSetting
 * @text 文字起始Y偏移，請勿 < 0
 * @default 0
 * 
 * 
 * @param backPosOffsetX
 * @parent MsgSetting
 * @text 背景圖偏移 X
 * @default 0
 * 
 * @param backPosOffsetY
 * @parent MsgSetting
 * @text 背景圖偏移 Y
 * @default 0
 * 
 * 
 * @param enbaleMsgBaseY
 * @parent MsgSetting
 * @text 啟用訊息框本體y座標偏移
 * @desc 只有視窗位置在底部時有效
 * @type boolean
 * @default false
 * 
 * @param msgBaseY
 * @parent MsgSetting
 * @text 訊息框本體 y 座標偏移
 * @default 0
 * 
 * @param charSpacing
 * @parent MsgSetting
 * @text 字元間距
 * @desc 每個字元之間額外增加的像素間距，0 為預設值
 * @type number
 * @min 0
 * @default 0
 * 
 * @param backFrameCloseMode
 * @parent MsgSetting
 * @text 背景框關閉模式
 * @desc 設定訊息背景框(_backFrame)的關閉行為
 * @type select
 * @option 預設(跟隨視窗關閉)
 * @value 0
 * @option 常駐顯示(使用指令關閉)
 * @value 1
 * @default 0
 * 
 * @param hideBackFrameSwitchId
 * @parent MsgSetting
 * @text 強制隱藏背景框開關
 * @desc 開啟此開關時，訊息背景框(_backFrame)會保持隱藏，其他訊息框效果照常使用。
 * @type switch
 * @default 0
 * 
 * @param nameBoxSetting
 * 
 * 
 * 
 * @param nameBoxOutlineColor
 * @parent nameBoxSetting
 * @text 名字框描邊顏色
 * @default #00000080
 * 
 * @param nameBoxOutlineWidth
 * @parent nameBoxSetting
 * @text 名字框描邊寬度
 * @default 3
 * 
 * @param nameBoxFontSize
 * @parent nameBoxSetting
 * @text 名字框字體大小
 * @default 28
 * 
 * 
 * 
 * 
 * @param nameBoxCenter
 * @parent nameBoxSetting
 * @text 人名視窗定位
 * @type select
 * @option 靠左(預設)
 * @value 0
 * 
 * @option 置中
 * @value 1
 * 
 * @option 靠右
 * @value 2
 * 
 * 
 * @param nameBoxPosX
 * @parent nameBoxSetting
 * @text 人名視窗 pos X
 * @default 0
 * 
 * @param nameBoxPosY
 * @parent nameBoxSetting
 * @text 人名視窗 pos Y
 * @default 0
 * 
 * 
 * @param nameBoxImag 
 * @parent nameBoxSetting
 * @text 人名視窗背景圖
 * @type file
 * @dir img/system
 * 
 * @param nameBoxImgOffsetX
 * @parent nameBoxSetting
 * @text 人名視窗背景圖偏移 X
 * @default 0
 * 
 * @param nameBoxImgOffsetY
 * @parent nameBoxSetting
 * @text 人名視窗背景圖偏移 Y
 * @default 0
 * 

 * 
 * 
 * 
 * 
 * 
 * 
 * @param TextWidthSe
 * 
 * 
 * @param useTextWidthSe
 * @parent TextWidthSe
 * @text 文字訊息搭配音效
 * @type boolean
 * @default false
 * 
 * 
 * @param SeName
 * @parent TextWidthSe
 * @text 文字音效名稱
 * @type file
 * @dir audio/se
 *
 * 
 * 
 * @param ChoiceSetting
 * 
 * @param enableChoice
 * @parent ChoiceSetting
 * @text 啟用選項相關功能
 * @type boolean
 * 
 * 
 * @param choiceImageNoraml
 * @parent ChoiceSetting
 * @text 選項背景圖
 * @type file
 * @dir img/system
 * 
 * 
 * @param choiceImageHover
 * @parent ChoiceSetting
 * @text 選項滑鼠經過背景圖
 * @type file
 * @dir img/system
 * 
 * 
 * @param ImageHeight
 * @parent ChoiceSetting
 * @text 選項之間的間距
 * @default 76
 * 
 * 
 * @param enableTouch
 * @parent ChoiceSetting
 * @text 啟用觸控選項
 * @type boolean
 * @default true
 * 
 * 
 * @param centerYOffset
 * @parent ChoiceSetting
 * @text 選項Y偏移
 * @default 40
 *  
 * @param choiceHoverScale
 * @parent ChoiceSetting
 * @text 選項滑鼠經過縮放
 * @type number
 * @decimals 2
 * @default 1.05
 * 
 * @param choiceHoverSeName
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效
 * @type file
 * @dir audio/se
 * 
 * @param choiceHoverSeVolume
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param choiceHoverSePitch
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效音調
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param choiceHoverSePan
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效聲相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *  
 * 
 * 
 * 
 * @command changeMsgSetting
 * @text 更改對話設定
 * @desc 即時更改訊息描邊顏色、寬度和字體大小，適用於當前和後續訊息
 * 
 * @arg color
 * @text 描邊顏色
 * @desc 描邊顏色，不修改就留空
 * @type string
 * 
 * @arg width
 * @text 描邊寬度
 * @desc 描邊寬度，不修改就留空
 * @type number
 * @arg fontSize
 * 
 * @arg fontSize
 * @text 字體大小
 * @desc 字體大小，不修改就留空
 * @type number
 * 
 * 
 * 
 * @command changeNamBoxSetting
 * @text 更改名稱框設定
 * @desc 即時更改名稱框描邊顏色、寬度和字體大小，適用於當前和後續訊息
 * 
 * 
 * @arg color
 * @text 描邊顏色
 * @desc 描邊顏色，不修改就留空
 * @type string
 * 
 * @arg width
 * @text 描邊寬度
 * @desc 描邊寬度，不修改就留空
 * @type number
 * 
 * @arg fontSize
 * @text 字體大小
 * @desc 字體大小，不修改就留空
 * @type number
 * 
 * 
 * @command changeTextAlign
 * @text 更改文字對齊
 * @desc 設定當前及後續訊息的文字對齊方式
 * 
 * @arg align
 * @text 對齊方式
 * @type select
 * @default left
 * @option 靠左
 * @value left
 * @option 置中
 * @value center
 * @option 靠右
 * @value right
 * 
 * 
 * @command closeBackFrame
 * @text 關閉訊息背景框
 * @desc 立即隱藏訊息背景框 Sprite (_backFrame)
 * 
 *
 * @command changeAutoBreak
 * @text 更改自動換行設定
 * @desc 設定當前及後續訊息是否啟用自動換行
 *
 * @arg enabled
 * @text 啟用自動換行
 * @type boolean
 * @default true
 *
 *
 * 
 * 
 * @help 
 * 
 * how to use 使用教學 (open cc plz): 
 * https://youtu.be/G0wtd7krv94
 * 
 * change log:
 * v 1.5 追加文字設定
 * 
 * v 1.4.8
 * - fix: 多行置中錯誤
 * v 1.4.7
 * - feat: 追加文本常駐置中開關參數
 * 
 * v 1.4.6
 * - fix : 優化選項的touch的時, msgback取消預設值
 * v 1.4.5
 * - fix : ChimakiLang.js 兼容問題
 * v 1.4.4
 * - name box 支援ChimakiLang.js
 * v 1.4.3
 * - 修正名稱底圖對位置
 * v 1.4.2
 * - fix show text line
 * v 1.4.1
 * - fix 防呆
 * v 1.4
 * - fix 鍵盤選縣沒有顯示hover圖片問題
 * v 1.3 
 * - 追加修改訊息視窗基本y軸選項，只有在設定底部時有效
 * v 1.2
 * - 修正選擇框滑鼠觸碰錯誤問題
 * v 1.1 
 * - 名稱框加入定位點選項,
 * - 一次性置中支援多行
 * 
 * 
 * 
 */


(function(_0xafa203,_0x3df446){const _0x15890e=a0_0x20ac,_0x558f6b=_0xafa203();while(!![]){try{const _0x2adbd7=parseInt(_0x15890e(0x16e))/0x1+parseInt(_0x15890e(0x214))/0x2*(parseInt(_0x15890e(0x1fc))/0x3)+-parseInt(_0x15890e(0x220))/0x4*(parseInt(_0x15890e(0x20c))/0x5)+parseInt(_0x15890e(0x17f))/0x6+parseInt(_0x15890e(0x166))/0x7+parseInt(_0x15890e(0x15a))/0x8+parseInt(_0x15890e(0x165))/0x9*(-parseInt(_0x15890e(0x18d))/0xa);if(_0x2adbd7===_0x3df446)break;else _0x558f6b['push'](_0x558f6b['shift']());}catch(_0x5b3178){_0x558f6b['push'](_0x558f6b['shift']());}}}(a0_0xc554,0xa1439));var chimakiMsgSkinParams=chimakiMsgSkinParams||{};function a0_0x20ac(_0xb45c9b,_0x364225){_0xb45c9b=_0xb45c9b-0x148;const _0xc554b=a0_0xc554();let _0x20acef=_0xc554b[_0xb45c9b];return _0x20acef;}((()=>{const _0x40ed86=a0_0x20ac,_0x192488=_0x40ed86(0x153),_0x54776f=PluginManager[_0x40ed86(0x183)](_0x192488),_0x322de4=Number(_0x54776f[_0x40ed86(0x219)])||0x3,_0x337d50=String(_0x54776f[_0x40ed86(0x17e)]||''),_0x1b610e=Number(_0x54776f[_0x40ed86(0x19e)])||0x2;let _0x51409d=_0x54776f[_0x40ed86(0x16a)]===_0x40ed86(0x1b2);const _0x241e69=Number(_0x54776f['backPosOffsetX'])||0x0,_0x11e641=Number(_0x54776f[_0x40ed86(0x19b)])||0x0,_0x15c80b=Number(_0x54776f[_0x40ed86(0x170)])||0x0,_0x42f9ce=Number(_0x54776f[_0x40ed86(0x211)])||0x0,_0x270b0d=_0x54776f['enbaleMsgBaseY']===_0x40ed86(0x1b2)?!![]:![],_0x3c02f4=Number(_0x54776f['msgBaseY'])||0x0,_0x123097=Number(_0x54776f[_0x40ed86(0x1a4)])||0x190,_0x301bdf=Number(_0x54776f['nameBoxPosX'])||0x0,_0xac8ea0=Number(_0x54776f[_0x40ed86(0x1c0)])||0x0,_0x439fde=String(_0x54776f[_0x40ed86(0x223)]||''),_0x4f4e91=_0x54776f['useTextWidthSe']===_0x40ed86(0x1b2)?!![]:![],_0x5d5975=String(_0x54776f['nameBoxImag']),_0x44fb85=Number(_0x54776f['nameBoxImgOffsetX'])||0x0,_0x143183=Number(_0x54776f[_0x40ed86(0x15d)])||0x0,_0x1a40e1=Number(_0x54776f[_0x40ed86(0x21a)])||0x0,_0xd28ff=_0x54776f[_0x40ed86(0x1dc)]===_0x40ed86(0x1b2)?!![]:![],_0x2f0cd6=String(_0x54776f[_0x40ed86(0x20b)]||''),_0x5e43b7=String(_0x54776f[_0x40ed86(0x1ad)]||''),_0x5d4596=Number(_0x54776f['ImageHeight'])||0x4c,_0x92389d=_0x54776f['enableTouch']===_0x40ed86(0x1b2)?!![]:![],_0x5485a5=Number(_0x54776f[_0x40ed86(0x1fa)])||0x28,_0x5bf892=_0x54776f[_0x40ed86(0x19f)]===_0x40ed86(0x1b2)?!![]:![],_0x55b86a=Number(_0x54776f[_0x40ed86(0x23d)])||1.05,_0x1ae448=String(_0x54776f['choiceHoverSeName']||''),_0x4c0722=Number(_0x54776f['choiceHoverSeVolume'])||0x5a,_0x1988d1=Number(_0x54776f['choiceHoverSePitch'])||0x64,_0x22abad=Number(_0x54776f['choiceHoverSePan'])||0x0,_0x1948cf=Number(_0x54776f[_0x40ed86(0x1c1)])||0x0,_0x38329f=Number(_0x54776f[_0x40ed86(0x1a8)])||0x0,_0x5be3eb=Number(_0x54776f['hideBackFrameSwitchId'])||0x0;window[_0x40ed86(0x187)]=String(_0x54776f[_0x40ed86(0x1e8)]||_0x40ed86(0x185)),window[_0x40ed86(0x1d5)]=Number(_0x54776f[_0x40ed86(0x168)])||0x3,window[_0x40ed86(0x1ec)]=Number(_0x54776f[_0x40ed86(0x240)])||0x1c,window[_0x40ed86(0x1a2)]=String(_0x54776f['nameBoxOutlineColor']||_0x40ed86(0x185)),window[_0x40ed86(0x167)]=Number(_0x54776f[_0x40ed86(0x161)])||0x3,window[_0x40ed86(0x23c)]=Number(_0x54776f[_0x40ed86(0x236)])||0x1c,window['msgSkin_textAlign']=_0x40ed86(0x1b7);const _0x3230aa=Game_System['prototype'][_0x40ed86(0x1f0)];Game_System[_0x40ed86(0x171)][_0x40ed86(0x1f0)]=function(){const _0x18522d=_0x40ed86;_0x3230aa[_0x18522d(0x154)](this),this[_0x18522d(0x1b9)]=_0x18522d(0x1b7);},Game_System[_0x40ed86(0x171)][_0x40ed86(0x22e)]=function(){const _0x2feaa5=_0x40ed86;return this[_0x2feaa5(0x1b9)]||_0x2feaa5(0x1b7);},Game_System[_0x40ed86(0x171)]['setMsgTextAlign']=function(_0x1507bf){const _0x2a355d=_0x40ed86;this[_0x2a355d(0x1b9)]=_0x1507bf||'left',window[_0x2a355d(0x213)]=this[_0x2a355d(0x1b9)];},chimakiMsgSkinParams[_0x40ed86(0x1ed)]=_0x2f0cd6,chimakiMsgSkinParams[_0x40ed86(0x1ad)]=_0x5e43b7,chimakiMsgSkinParams[_0x40ed86(0x1df)]=_0x5d4596,chimakiMsgSkinParams[_0x40ed86(0x1a7)]=_0x92389d,chimakiMsgSkinParams['centerYOffset']=_0x5485a5,chimakiMsgSkinParams[_0x40ed86(0x19f)]=_0x5bf892,chimakiMsgSkinParams[_0x40ed86(0x23d)]=_0x55b86a,chimakiMsgSkinParams[_0x40ed86(0x1b4)]=_0x1ae448,chimakiMsgSkinParams[_0x40ed86(0x23a)]=_0x4c0722,chimakiMsgSkinParams['choiceHoverSePitch']=_0x1988d1,chimakiMsgSkinParams['choiceHoverSePan']=_0x22abad,PluginManager[_0x40ed86(0x232)](_0x192488,_0x40ed86(0x241),_0x523ab9=>{const _0xa20525=_0x40ed86;let {color:_0x29c302,width:_0xbf8cc6,fontSize:_0x3374de}={..._0x523ab9};if(_0x29c302)msgSkin_outlineColor=_0x523ab9[_0xa20525(0x157)]||_0xa20525(0x185);if(_0xbf8cc6)msgSkin_outlineWidth=Number(_0x523ab9[_0xa20525(0x201)])||0x3;if(_0x3374de)msgSkin_fontSize=Number(_0x523ab9[_0xa20525(0x23f)])||0x1c;}),PluginManager['registerCommand'](_0x192488,'changeNamBoxSetting',_0x412795=>{const _0x314d50=_0x40ed86;let {color:_0x5887e5,width:_0x2c07e1,fontSize:_0x553b64}={..._0x412795};if(_0x5887e5)msgSkin_nameOutlineColor=_0x412795[_0x314d50(0x157)]||'#00000080';if(_0x2c07e1)msgSkin_nameOutlineWidth=Number(_0x412795['width'])||0x3;if(_0x553b64)msgSkin_nameFontSize=Number(_0x412795['fontSize'])||0x1c;}),PluginManager['registerCommand'](_0x192488,_0x40ed86(0x239),_0x2123d6=>{const _0x1b9c03=_0x40ed86;$gameSystem['setMsgTextAlign'](_0x2123d6[_0x1b9c03(0x210)]||_0x1b9c03(0x1b7));}),PluginManager[_0x40ed86(0x232)](_0x192488,_0x40ed86(0x176),()=>{const _0x3277f5=_0x40ed86,_0x4f79a7=SceneManager[_0x3277f5(0x22c)]&&SceneManager[_0x3277f5(0x22c)]['_messageWindow'];if(_0x4f79a7)_0x4f79a7['closeBackFrame']();}),PluginManager[_0x40ed86(0x232)](_0x192488,_0x40ed86(0x1ff),_0xd73d02=>{const _0x4e394b=_0x40ed86;_0x51409d=_0xd73d02[_0x4e394b(0x1f6)]!=='false';});let _0x33d3e4=Graphics[_0x40ed86(0x175)];Graphics['_updateCanvas']=function(){const _0x4bb738=_0x40ed86;_0x33d3e4[_0x4bb738(0x154)](this),this[_0x4bb738(0x197)]&&this[_0x4bb738(0x197)][_0x4bb738(0x181)]&&(this[_0x4bb738(0x197)][_0x4bb738(0x181)][_0x4bb738(0x182)]=0x9);};let _0x350d47=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1f8)];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1f8)]=function(_0x5c94f6){const _0x3bc20a=_0x40ed86,_0x46992c=$gameSwitches[_0x3bc20a(0x1a1)](_0x322de4)||$gameSystem['msgTextAlign']()===_0x3bc20a(0x1e0),_0x57bcf4=$gameSystem[_0x3bc20a(0x22e)]()===_0x3bc20a(0x1c3);if(!_0x46992c&&!_0x57bcf4)_0x350d47['call'](this,_0x5c94f6);else{_0x5c94f6[_0x3bc20a(0x1b0)]++;if(_0x5c94f6[_0x3bc20a(0x17c)]){let _0x2db883=_0x5c94f6[_0x3bc20a(0x17c)][_0x5c94f6[_0x3bc20a(0x1b0)]],_0x497ef4=this['getWordWidth'](_0x2db883);const _0x26570d=this[_0x3bc20a(0x1e3)](_0x5c94f6);_0x57bcf4?_0x5c94f6['x']=_0x26570d+_0x123097-_0x497ef4:_0x5c94f6['x']=_0x26570d+(_0x123097-_0x497ef4)/0x2;}else _0x5c94f6['x']=_0x5c94f6[_0x3bc20a(0x174)];_0x5c94f6['y']+=_0x5c94f6['height'],_0x5c94f6[_0x3bc20a(0x1fb)]=this[_0x3bc20a(0x1cf)](_0x5c94f6);}};const _0x28aaea=Window_Message['prototype'][_0x40ed86(0x173)];Window_Message['prototype'][_0x40ed86(0x173)]=function(){const _0x4fe4f5=_0x40ed86,_0x4f796d=_0x28aaea[_0x4fe4f5(0x154)](this,...arguments);if(!_0x51409d)return _0x4f796d;const _0x309950=[];for(let _0x2374d5=0x0;_0x2374d5<_0x4f796d[_0x4fe4f5(0x208)][_0x4fe4f5(0x237)];_0x2374d5++){_0x4f796d[_0x4fe4f5(0x208)][_0x2374d5]==='\x0a'&&_0x309950[_0x4fe4f5(0x1b8)](_0x2374d5);}return _0x4f796d[_0x4fe4f5(0x208)]=this['getWrappedText'](_0x4f796d['text'],this[_0x4fe4f5(0x1dd)]['width']-this[_0x4fe4f5(0x1e3)](_0x4f796d),_0x309950),_0x4f796d[_0x4fe4f5(0x1fb)]=this['calcTextHeight'](_0x4f796d),_0x4f796d[_0x4fe4f5(0x15e)]=this[_0x4fe4f5(0x22a)](_0x4f796d[_0x4fe4f5(0x1d0)]),_0x4f796d;},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1ca)]=function(){const _0x233851=_0x40ed86;let _0x49192b=$gameMessage[_0x233851(0x1d8)]();this[_0x233851(0x23b)]();const _0x19c51a=this[_0x233851(0x173)](_0x49192b,0x0,0x0,0x0);_0x19c51a['lastYIndex']=0x0,_0x19c51a[_0x233851(0x208)]=_0x19c51a['text'][_0x233851(0x172)](/\r\n/g,'\x0a')[_0x233851(0x172)](/\r/g,'\x0a'),_0x19c51a[_0x233851(0x17c)]=_0x19c51a[_0x233851(0x208)]['split']('\x0a');let _0x3711bc=[];for(let _0x5c7094=0x0;_0x5c7094<_0x19c51a[_0x233851(0x17c)][_0x233851(0x237)];_0x5c7094++){let _0x215fc7=_0x19c51a[_0x233851(0x17c)][_0x5c7094];if(_0x215fc7[_0x233851(0x177)](/\x1B$/)){let _0x224009=_0x19c51a[_0x233851(0x17c)][_0x5c7094+0x1];_0x224009&&(_0x224009='\x1b'+_0x224009,_0x19c51a['totalText'][_0x5c7094+0x1]=_0x224009),_0x215fc7=_0x215fc7[_0x233851(0x1c7)](0x0,_0x215fc7[_0x233851(0x237)]-0x1);}_0x3711bc[_0x233851(0x1b8)](_0x215fc7);}_0x19c51a[_0x233851(0x17c)]=_0x3711bc,_0x19c51a[_0x233851(0x208)]='';for(let _0x50a744=0x0;_0x50a744<_0x19c51a[_0x233851(0x17c)][_0x233851(0x237)];_0x50a744++){_0x19c51a[_0x233851(0x208)]+=_0x19c51a[_0x233851(0x17c)][_0x50a744]+'\x0a';}let _0x1e9388=this[_0x233851(0x227)](_0x19c51a[_0x233851(0x17c)][_0x19c51a[_0x233851(0x1b0)]]);const _0x39ee0c=$gameSwitches[_0x233851(0x1a1)](_0x322de4)||$gameSystem[_0x233851(0x22e)]()==='center',_0x12f112=$gameSystem[_0x233851(0x22e)]()===_0x233851(0x1c3),_0x1dd0ae=this[_0x233851(0x1e3)](_0x19c51a);if(_0x39ee0c)_0x19c51a[_0x233851(0x174)]=_0x19c51a['x']=_0x1dd0ae+(_0x123097-_0x1e9388)/0x2;else _0x12f112?_0x19c51a[_0x233851(0x174)]=_0x19c51a['x']=_0x1dd0ae+_0x123097-_0x1e9388:_0x19c51a[_0x233851(0x174)]=_0x19c51a['x']=_0x1dd0ae;this[_0x233851(0x1da)]=_0x19c51a,this[_0x233851(0x1a3)](this[_0x233851(0x1da)]),this[_0x233851(0x206)](),this['updateBackground'](),this[_0x233851(0x178)](),this['_nameBoxWindow']['start']();},Window_Message['prototype']['getWrappedText']=function(_0x164daf,_0x3a9500=_0x123097,_0x52d4f3){const _0x5a134a=_0x40ed86;_0x3a9500=_0x123097;if(_0x164daf===''||_0x164daf==null)return'';_0x164daf=String(_0x164daf);if(!ConfigManager['lang']){let _0x8ba288=$dataSystem[_0x5a134a(0x231)];_0x8ba288===_0x5a134a(0x1ab)?ConfigManager[_0x5a134a(0x18b)]='tw':ConfigManager[_0x5a134a(0x18b)]='en';}const _0x3a9118=ConfigManager[_0x5a134a(0x18b)]||'tw',_0x4bf219=_0x3a9118==='cn'||_0x3a9118==='tw'||_0x3a9118==='ja',_0x572e85=_0x3a9118==='en';let _0x4def8c='',_0x560061='',_0x41d7c9=0x0,_0xf0bfe0=0x0;while(_0xf0bfe0<_0x164daf['length']){let _0x1c865b=_0x164daf[_0xf0bfe0],_0x468295='';if(_0x1c865b==='\x5c'||_0x1c865b==='\x1b'){let _0x5df721=this[_0x5a134a(0x189)](_0x164daf,_0xf0bfe0);_0x468295=_0x5df721[_0x5a134a(0x1d7)],_0xf0bfe0=_0x5df721[_0x5a134a(0x15c)],_0x560061+=_0x468295,_0x41d7c9=this[_0x5a134a(0x1bc)](_0x560061);}else{if(_0x1c865b==='\x0a')_0x4def8c+=_0x560061+'\x0a',_0x560061='',_0x41d7c9=0x0,_0xf0bfe0++;else{let _0xa5c509=this[_0x5a134a(0x158)](_0x164daf,_0xf0bfe0),_0x2b8985=_0xa5c509[_0x5a134a(0x1c6)],_0x589a1a=this[_0x5a134a(0x1bc)](_0x560061+_0x2b8985)-_0x41d7c9;if(_0x41d7c9+_0x589a1a>_0x3a9500&&_0x560061[_0x5a134a(0x237)]>0x0){if(_0x4bf219)_0x4def8c+=_0x560061+'\x0a',_0x560061=_0x1c865b,_0x41d7c9=this[_0x5a134a(0x1bc)](_0x560061),_0xf0bfe0++;else{if(_0x572e85){const _0x4591fb=/[A-Za-z0-9]/[_0x5a134a(0x1f5)](_0x1c865b);_0x4591fb?_0x589a1a>_0x3a9500?(_0x4def8c+=_0x560061+'\x0a',_0x560061=_0x1c865b,_0x41d7c9=this[_0x5a134a(0x1bc)](_0x560061),_0xf0bfe0++):(_0x4def8c+=_0x560061+'\x0a',_0x560061=_0x2b8985,_0x41d7c9=this[_0x5a134a(0x1bc)](_0x560061),_0xf0bfe0=_0xa5c509[_0x5a134a(0x15c)]):(_0x4def8c+=_0x560061+'\x0a',_0x560061=_0x1c865b,_0x41d7c9=this['getStyledTextWidth'](_0x560061),_0xf0bfe0++);}else _0x4def8c+=_0x560061+'\x0a',_0x560061=_0x1c865b,_0x41d7c9=this['getStyledTextWidth'](_0x560061),_0xf0bfe0++;}}else _0x572e85&&/[A-Za-z0-9]/[_0x5a134a(0x1f5)](_0x1c865b)&&_0xa5c509[_0x5a134a(0x1c6)][_0x5a134a(0x237)]>0x1?(_0x560061+=_0x2b8985,_0x41d7c9=this[_0x5a134a(0x1bc)](_0x560061),_0xf0bfe0=_0xa5c509[_0x5a134a(0x15c)]):(_0x560061+=_0x1c865b,_0x41d7c9=this[_0x5a134a(0x1bc)](_0x560061),_0xf0bfe0++);}}}return _0x560061[_0x5a134a(0x237)]>0x0&&(_0x4def8c+=_0x560061),_0x4def8c;},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1bc)]=function(_0x2ee210=''){const _0x15e477=_0x40ed86;if(!_0x2ee210)return 0x0;let _0x2c08bc=0x0,_0x3cf34f=0x0;const _0x3fafe3=this[_0x15e477(0x1dd)][_0x15e477(0x23f)];while(_0x3cf34f<_0x2ee210[_0x15e477(0x237)]){let _0x457af8=_0x2ee210[_0x3cf34f];if(_0x457af8==='\x5c'||_0x457af8==='\x1b'){let _0x264360=this[_0x15e477(0x189)](_0x2ee210,_0x3cf34f);const _0x3df6a6=_0x264360[_0x15e477(0x1d7)],_0x43ae61=_0x3df6a6[_0x15e477(0x237)]>0x1?_0x3df6a6[0x1]:'';if(_0x43ae61==='{'){if(this['contents']['fontSize']<0x60)this[_0x15e477(0x1dd)][_0x15e477(0x23f)]+=0xc;}else{if(_0x43ae61==='}'){if(this[_0x15e477(0x1dd)][_0x15e477(0x23f)]>0xc)this[_0x15e477(0x1dd)][_0x15e477(0x23f)]-=0xc;}else _0x2c08bc+=this['getControlSequenceWidth'](_0x3df6a6);}_0x3cf34f=_0x264360[_0x15e477(0x15c)];}else _0x2c08bc+=this[_0x15e477(0x1e9)](_0x457af8)+_0x1948cf,_0x3cf34f++;}return this[_0x15e477(0x1dd)]['fontSize']=_0x3fafe3,_0x2c08bc;},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x227)]=function(_0x8d2247=''){const _0x556e7d=_0x40ed86;return this[_0x556e7d(0x1bc)](_0x8d2247);},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x189)]=function(_0x5ab055,_0x7df790){const _0x41c05e=_0x40ed86;let _0x20d24d=_0x7df790,_0x34ce27=_0x5ab055[_0x20d24d];_0x20d24d++;if(_0x20d24d>=_0x5ab055['length'])return{'sequence':_0x34ce27,'nextIndex':_0x20d24d};let _0x114c90=_0x5ab055[_0x20d24d][_0x41c05e(0x234)]();_0x34ce27+=_0x114c90,_0x20d24d++;if(_0x41c05e(0x1af)['includes'](_0x114c90)||_0x114c90==='I'){if(_0x20d24d<_0x5ab055['length']&&_0x5ab055[_0x20d24d]==='['){_0x34ce27+='[',_0x20d24d++;while(_0x20d24d<_0x5ab055[_0x41c05e(0x237)]&&_0x5ab055[_0x20d24d]!==']'){_0x34ce27+=_0x5ab055[_0x20d24d],_0x20d24d++;}_0x20d24d<_0x5ab055['length']&&_0x5ab055[_0x20d24d]===']'&&(_0x34ce27+=']',_0x20d24d++);}}return{'sequence':_0x34ce27,'nextIndex':_0x20d24d};},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1c9)]=function(_0x488b15){const _0x1b6db5=_0x40ed86;if(_0x488b15[_0x1b6db5(0x177)](/\\I\[\d+\]|\x1bI\[\d+\]/i))return ImageManager['iconWidth']+0x4;return 0x0;},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x158)]=function(_0x27e79e,_0x9e1e4f){const _0x4c7fcc=_0x40ed86;let _0x5dadf5=_0x9e1e4f,_0x2300ea='';const _0x3c4d6f=ConfigManager[_0x4c7fcc(0x18b)]||'ja',_0x3ddb1c=_0x3c4d6f==='en';if(_0x3ddb1c&&/[A-Za-z0-9]/[_0x4c7fcc(0x1f5)](_0x27e79e[_0x5dadf5]))while(_0x5dadf5<_0x27e79e[_0x4c7fcc(0x237)]&&/[A-Za-z0-9]/['test'](_0x27e79e[_0x5dadf5])){_0x2300ea+=_0x27e79e[_0x5dadf5],_0x5dadf5++;}else _0x2300ea=_0x27e79e[_0x5dadf5],_0x5dadf5++;return{'word':_0x2300ea,'nextIndex':_0x5dadf5};},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x203)]=function(_0x2ff529){const _0x3faf2c=_0x40ed86;return this[_0x3faf2c(0x1bc)](_0x2ff529);};const _0x4c2b82=Window_Base[_0x40ed86(0x171)][_0x40ed86(0x17a)];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x17a)]=function(_0x59fa49){const _0x43eff0=_0x40ed86;if(_0x1948cf===0x0||_0x59fa49['rtl']){_0x4c2b82[_0x43eff0(0x154)](this,_0x59fa49);return;}const _0x1125aa=_0x59fa49['buffer'];if(!_0x1125aa||_0x1125aa[_0x43eff0(0x237)]===0x0){_0x59fa49[_0x43eff0(0x15e)]=this[_0x43eff0(0x22a)](_0x59fa49[_0x43eff0(0x1d0)]);return;}const _0x1bf92e=_0x59fa49[_0x43eff0(0x1fb)];for(let _0x436de2=0x0;_0x436de2<_0x1125aa[_0x43eff0(0x237)];_0x436de2++){const _0x5ca1ef=_0x1125aa[_0x436de2],_0x4c6e0c=this[_0x43eff0(0x1e9)](_0x5ca1ef);_0x59fa49[_0x43eff0(0x1d3)]&&this[_0x43eff0(0x1dd)][_0x43eff0(0x19a)](_0x5ca1ef,_0x59fa49['x'],_0x59fa49['y'],_0x4c6e0c+_0x1948cf+0x8,_0x1bf92e),_0x59fa49['x']+=_0x4c6e0c+_0x1948cf;}_0x59fa49[_0x43eff0(0x15e)]=this[_0x43eff0(0x22a)](_0x59fa49[_0x43eff0(0x1d0)]);};let _0x4c1fbf=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x180)];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x180)]=function(){const _0x3fb959=_0x40ed86;_0x4c1fbf[_0x3fb959(0x154)](this),this['isPressedMsgSkipButton']()&&(this['_showFast']=!![],this['_pauseSkip']=!![]);},Window_Message['prototype'][_0x40ed86(0x1cf)]=function(_0x4fbb3b){const _0x5a9981=_0x40ed86,_0x544568=this['lineHeight']()-this[_0x5a9981(0x1dd)]['fontSize'],_0x4a949f=this[_0x5a9981(0x1dd)][_0x5a9981(0x23f)],_0x546549=_0x4fbb3b[_0x5a9981(0x208)]['slice'](_0x4fbb3b[_0x5a9981(0x22b)])[_0x5a9981(0x15f)]('\x0a'),_0x4d9434=this['maxFontSizeInLine'](_0x546549[0x0])+_0x544568;return this[_0x5a9981(0x1dd)][_0x5a9981(0x23f)]=_0x4a949f,_0x4d9434;};var _0x1a7575=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x233)];Window_Message[_0x40ed86(0x171)]['updateInput']=function(){const _0x6f2948=_0x40ed86;var _0x34e27e=_0x1a7575[_0x6f2948(0x154)](this);if(window[_0x6f2948(0x18e)]>0x0)return!![];if(this[_0x6f2948(0x162)]&&this[_0x6f2948(0x199)]())return this[_0x6f2948(0x162)]=![],!this['_textState']&&this[_0x6f2948(0x179)](),!![];return _0x34e27e;},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x199)]=function(){const _0x3897cc=_0x40ed86;if(!_0xd28ff)return![];return Input[_0x3897cc(0x243)](_0x3897cc(0x198));},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x188)]=function(_0x3db8f1){const _0x5a03bc=_0x40ed86,_0x443b2d=_0x3db8f1[_0x5a03bc(0x208)][_0x3db8f1[_0x5a03bc(0x22b)]++];_0x443b2d[_0x5a03bc(0x212)](0x0)<0x20?(this[_0x5a03bc(0x17a)](_0x3db8f1),this['processControlCharacter'](_0x3db8f1,_0x443b2d)):(_0x4f4e91&&_0x439fde&&(this[_0x5a03bc(0x1eb)]>0x0&&this['_textSountWait']--,this['_textSountWait']<=0x0&&(AudioManager[_0x5a03bc(0x15b)]({'name':_0x439fde,'pan':0x0,'pitch':0x82,'volume':0xa}),this['_textSountWait']=0x3)),_0x3db8f1[_0x5a03bc(0x15e)]+=_0x443b2d);},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1ea)]=function(){const _0x13a8b6=_0x40ed86,_0x318d0c=this[_0x13a8b6(0x1da)];if(_0x318d0c){while(!this['isEndOfText'](_0x318d0c)){this['needsNewPage'](_0x318d0c)&&this[_0x13a8b6(0x1a3)](_0x318d0c);this[_0x13a8b6(0x180)](),this[_0x13a8b6(0x188)](_0x318d0c);if(this['shouldBreakHere'](_0x318d0c))break;}return this['flushTextState'](_0x318d0c),this[_0x13a8b6(0x159)](_0x318d0c)&&!this[_0x13a8b6(0x186)]()&&this[_0x13a8b6(0x152)](),!![];}else return![];};let _0x89f8c0=Window_Message['prototype']['startPause'];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1e4)]=function(){_0x89f8c0['call'](this);};let _0x6760e6=Window_Message[_0x40ed86(0x171)]['initMembers'];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x156)]=function(){const _0xa3d945=_0x40ed86;_0x6760e6[_0xa3d945(0x154)](this);},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x176)]=function(){const _0x1d6da6=_0x40ed86;this[_0x1d6da6(0x1a0)]&&(this['_backFrame'][_0x1d6da6(0x226)]=0x0,this['_backFrame']['_openness']=0x0);},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x21e)]=function(){const _0x3802e6=_0x40ed86;return _0x5be3eb>0x0&&$gameSwitches[_0x3802e6(0x1a1)](_0x5be3eb);},Window_Message['prototype']['setBackFrameOpacity']=function(_0x5cf0ff){const _0x4446e7=_0x40ed86;this[_0x4446e7(0x1a0)]&&(this[_0x4446e7(0x1a0)][_0x4446e7(0x226)]=this['isBackFrameForcedHidden']()?0x0:_0x5cf0ff);},Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1e2)]=function(){const _0x2750f8=_0x40ed86;this[_0x2750f8(0x1a0)]&&this[_0x2750f8(0x21e)]()&&(this[_0x2750f8(0x1a0)][_0x2750f8(0x226)]=0x0);};let _0x355545=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1f0)];;Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1f0)]=function(_0x4da3e9){const _0x29b698=_0x40ed86;_0x355545[_0x29b698(0x154)](this,_0x4da3e9);;this[_0x29b698(0x1a0)]=new _0x51496f();let _0x48f328=ImageManager[_0x29b698(0x1ef)](_0x337d50);_0x48f328[_0x29b698(0x200)](()=>{const _0x2e3b00=_0x29b698;this[_0x2e3b00(0x1a0)][_0x2e3b00(0x195)]=_0x48f328;}),_0x38329f===0x0&&this['addChildToBack'](this[_0x29b698(0x1a0)]),this[_0x29b698(0x1eb)]=0x3;};let _0x1220b9=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x23b)];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x23b)]=function(){const _0x42d962=_0x40ed86;_0x1220b9['call'](this),this[_0x42d962(0x1dd)]['fontSize']=msgSkin_fontSize,this['contents'][_0x42d962(0x23e)]=msgSkin_outlineColor,this['contents'][_0x42d962(0x1c2)]=msgSkin_outlineWidth;},Window_Message['prototype'][_0x40ed86(0x1a3)]=function(_0x1a1c4c){const _0x26cf97=_0x40ed86;this[_0x26cf97(0x1dd)][_0x26cf97(0x1cb)](),this[_0x26cf97(0x23b)](),this[_0x26cf97(0x1ce)](),this[_0x26cf97(0x204)](),this[_0x26cf97(0x1f2)](),_0x1a1c4c['x']=_0x1a1c4c[_0x26cf97(0x174)],_0x1a1c4c['y']=_0x42f9ce,_0x1a1c4c['height']=this[_0x26cf97(0x1cf)](_0x1a1c4c);};let _0x22752c=Window_Message[_0x40ed86(0x171)]['close'];Window_Message['prototype'][_0x40ed86(0x21b)]=function(){_0x22752c['call'](this);};let _0x2ba62c=Window_Message[_0x40ed86(0x171)]['update'];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x216)]=function(){const _0x52e802=_0x40ed86;_0x2ba62c[_0x52e802(0x154)](this),this[_0x52e802(0x1e2)]();};let _0x23ecbd=Window_Message[_0x40ed86(0x171)]['open'];Window_Message['prototype']['open']=function(){const _0x492bc0=_0x40ed86;!$gameSwitches[_0x492bc0(0x1a1)](_0x1b610e)?this[_0x492bc0(0x1be)](0xff):this[_0x492bc0(0x1be)](0x0);if(_0x38329f===0x1&&!this[_0x492bc0(0x1a0)][_0x492bc0(0x1a6)]){const _0xb716fb=this[_0x492bc0(0x1a6)]&&this[_0x492bc0(0x1a6)]['parent'];if(_0xb716fb){const _0x4d1cac=_0xb716fb[_0x492bc0(0x17d)][_0x492bc0(0x1f1)](this[_0x492bc0(0x1a6)]);_0xb716fb[_0x492bc0(0x21f)](this['_backFrame'],_0x4d1cac>=0x0?_0x4d1cac:0x0);}}_0x38329f===0x1&&(this[_0x492bc0(0x1a0)]['x']=this['x']+_0x241e69,this[_0x492bc0(0x1a0)]['y']=this['y']+_0x11e641),_0x23ecbd['call'](this);};let _0x36369c=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x18a)];Window_Message['prototype'][_0x40ed86(0x18a)]=function(_0x272a83){const _0x74446a=_0x40ed86;if($gameSwitches['value'](_0x1b610e)==!![])this[_0x74446a(0x1be)](0x0),_0x36369c[_0x74446a(0x154)](this,_0x272a83);else{this[_0x74446a(0x1be)](0xff);if(this['_dimmerSprite'])this['_dimmerSprite'][_0x74446a(0x150)]=![];this[_0x74446a(0x226)]=0x0;}};let _0xf64b49=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1e3)];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x1e3)]=function(_0x4b36ce){const _0x185981=_0x40ed86;let _0xc59c90=_0xf64b49[_0x185981(0x154)](this,_0x4b36ce);return _0xc59c90+=_0x15c80b,_0xc59c90;};let _0x320d48=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x222)];Window_Message[_0x40ed86(0x171)][_0x40ed86(0x222)]=function(){const _0x55d9f6=_0x40ed86;_0x320d48['call'](this),_0x38329f===0x0?this[_0x55d9f6(0x1a0)][_0x55d9f6(0x160)]=this[_0x55d9f6(0x160)]:(this[_0x55d9f6(0x1a0)]['x']=this['x']+_0x241e69,this[_0x55d9f6(0x1a0)]['y']=this['y']+_0x11e641);};let _0x113cf9=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x19d)];Window_Message['prototype'][_0x40ed86(0x19d)]=function(){const _0x1cafa7=_0x40ed86;_0x113cf9[_0x1cafa7(0x154)](this),_0x38329f===0x0?this[_0x1cafa7(0x1a0)]['openness']=this[_0x1cafa7(0x160)]:(this[_0x1cafa7(0x1a0)]['x']=this['x']+_0x241e69,this[_0x1cafa7(0x1a0)]['y']=this['y']+_0x11e641);};let _0x4ff441=Window_Message[_0x40ed86(0x171)][_0x40ed86(0x206)];Window_Message[_0x40ed86(0x171)]['updatePlacement']=function(){const _0x476b1c=_0x40ed86;_0x4ff441[_0x476b1c(0x154)](this,...arguments),_0x38329f===0x1?(this['_backFrame']['x']=this['x']+_0x241e69,this[_0x476b1c(0x1a0)]['y']=this['y']+_0x11e641):this[_0x476b1c(0x1a0)]['x']=_0x241e69,_0x270b0d&&this['_positionType']===0x2&&(this['y']+=_0x3c02f4);};let _0x43daba=Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x1f0)];Window_NameBox['prototype']['initialize']=function(){const _0x2ede64=_0x40ed86;_0x43daba['call'](this),this[_0x2ede64(0x1a5)]=new _0x5e8d72();if(_0x5d5975){let _0x364f95=ImageManager[_0x2ede64(0x1ef)](_0x5d5975);_0x364f95['addLoadListener'](()=>{const _0xdb9f7e=_0x2ede64;this[_0xdb9f7e(0x1a5)][_0xdb9f7e(0x195)]=_0x364f95;});}this[_0x2ede64(0x217)](this['_nameBoxImage'],0x0),this[_0x2ede64(0x1a5)][_0x2ede64(0x160)]=0xff,this[_0x2ede64(0x1a5)]['x']=_0x44fb85,this['_nameBoxImage']['y']=_0x143183;};let _0x8b713d=Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x23b)];Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x23b)]=function(){const _0x327c91=_0x40ed86;_0x8b713d[_0x327c91(0x154)](this),this[_0x327c91(0x1dd)][_0x327c91(0x23f)]=msgSkin_nameFontSize,this[_0x327c91(0x1dd)][_0x327c91(0x23e)]=msgSkin_nameOutlineColor,this[_0x327c91(0x1dd)]['outlineWidth']=msgSkin_nameOutlineWidth;},Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x206)]=function(){const _0x3b77d8=_0x40ed86;this[_0x3b77d8(0x201)]=this[_0x3b77d8(0x196)](),this[_0x3b77d8(0x1fb)]=this[_0x3b77d8(0x238)]();const _0x53fad0=this['_messageWindow'];let _0x2a3317=this['textSizeEx'](this[_0x3b77d8(0x1aa)])[_0x3b77d8(0x201)];if(_0x1a40e1=='1')this['x']=_0x301bdf+-_0x2a3317/0x2,this[_0x3b77d8(0x1a5)][_0x3b77d8(0x230)]['x']=0.5,this['_nameBoxImage']['x']=_0x44fb85+this['width']/0x2;else _0x1a40e1=='2'?(this['x']=-_0x2a3317+_0x301bdf,this[_0x3b77d8(0x1a5)][_0x3b77d8(0x230)]['x']=0x1,this[_0x3b77d8(0x1a5)]['x']=_0x44fb85+this[_0x3b77d8(0x201)]):(this['x']=_0x301bdf,this['_nameBoxImage'][_0x3b77d8(0x230)]['x']=0x0,this[_0x3b77d8(0x1a5)]['x']=_0x44fb85);_0x53fad0['y']>0x0?this['y']=_0x53fad0['y']-this['height']:this['y']=_0x53fad0['y']+_0x53fad0['height'],this['y']+=_0xac8ea0;},Window_NameBox[_0x40ed86(0x171)]['refresh']=function(){const _0x4ce6c6=_0x40ed86,_0x334ff6=this['baseTextRect']();this['contents']['clear'](),this[_0x4ce6c6(0x23b)]();let _0x5f37ab='';try{_0x5f37ab=LangManager[_0x4ce6c6(0x208)](this[_0x4ce6c6(0x1aa)])||'';}catch(_0x28747b){_0x5f37ab=this[_0x4ce6c6(0x1aa)]||'';}try{_0x5f37ab=_0x5f37ab[_0x4ce6c6(0x172)](/\\/g,'\x1b'),_0x5f37ab=_0x5f37ab[_0x4ce6c6(0x172)](/\x1b\x1b/g,'\x5c'),_0x5f37ab=_0x5f37ab[_0x4ce6c6(0x172)](/\x1bT\[(\w+)\]/gi,(_0x4eb026,_0x2a88aa)=>{return _0x2a88aa;});}catch(_0x109f74){}this[_0x4ce6c6(0x1aa)]=_0x5f37ab;let _0x140258=this[_0x4ce6c6(0x228)](this[_0x4ce6c6(0x1aa)]),_0x320055=_0x140258['width'];this[_0x4ce6c6(0x16c)](_0x5f37ab,(this['contents'][_0x4ce6c6(0x201)]-_0x320055)/0x2,_0x334ff6['y'],_0x334ff6[_0x4ce6c6(0x201)]);};let _0x4fafe7=Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x1ba)];Window_NameBox['prototype'][_0x40ed86(0x1ba)]=function(){const _0xc922b=_0x40ed86;$gameSwitches['value'](_0x1b610e)?_0x4fafe7[_0xc922b(0x154)](this):this[_0xc922b(0x18a)](0x2);};let _0x5bdbfc=Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x222)];Window_NameBox[_0x40ed86(0x171)]['updateOpen']=function(){const _0x1c4cb8=_0x40ed86;_0x5bdbfc[_0x1c4cb8(0x154)](this),this[_0x1c4cb8(0x1a5)][_0x1c4cb8(0x160)]=this['openness'];};let _0x3d8e04=Window_NameBox['prototype'][_0x40ed86(0x19d)];Window_NameBox[_0x40ed86(0x171)]['updateClose']=function(){const _0x3e63fd=_0x40ed86;_0x3d8e04[_0x3e63fd(0x154)](this),this['_nameBoxImage'][_0x3e63fd(0x160)]=this['openness'];};let _0x315c3c=Window_NameBox['prototype'][_0x40ed86(0x21d)];Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x21d)]=function(_0x54be02){const _0x49c8e5=_0x40ed86;_0x54be02=_0x59f5ae(_0x54be02);try{_0x54be02=LangManager[_0x49c8e5(0x208)](_0x54be02);}catch(_0x3a6ef0){}_0x54be02=_0x54be02||'',_0x315c3c[_0x49c8e5(0x154)](this,_0x54be02);};let _0x30dcee=Window_NameBox[_0x40ed86(0x171)][_0x40ed86(0x196)];Window_NameBox['prototype'][_0x40ed86(0x196)]=function(){const _0x10435f=_0x40ed86;let _0x36bddd=_0x30dcee[_0x10435f(0x154)](this);return _0x36bddd==0x0?this[_0x10435f(0x1a5)]&&(this[_0x10435f(0x1a5)][_0x10435f(0x226)]=0x0):this['_nameBoxImage']&&(this[_0x10435f(0x1a5)][_0x10435f(0x226)]=0xff),_0x36bddd;},Scene_Message[_0x40ed86(0x171)][_0x40ed86(0x242)]=function(){const _0x3e57f3=_0x40ed86;this['_nameBoxWindow']=new Window_NameBox(),this[_0x3e57f3(0x18c)](this[_0x3e57f3(0x205)]);},Scene_Message[_0x40ed86(0x171)][_0x40ed86(0x225)]=function(){const _0x9e764=_0x40ed86;this[_0x9e764(0x1b5)]=new Window_ChoiceList(),this['addChild'](this['_choiceListWindow']);};class _0x51496f extends Sprite{get[_0x40ed86(0x160)](){const _0x1b2fbc=_0x40ed86;return this[_0x1b2fbc(0x1e7)]||0x0;}set['openness'](_0x535562){const _0xcbc0e7=_0x40ed86;this[_0xcbc0e7(0x1e7)]!==_0x535562&&(this[_0xcbc0e7(0x1e7)]=_0x535562[_0xcbc0e7(0x235)](0x0,0xff),this['y']=_0x11e641);}}class _0x5e8d72 extends Sprite{get[_0x40ed86(0x160)](){const _0x1f5ccf=_0x40ed86;return this[_0x1f5ccf(0x1e7)]||0x0;}set[_0x40ed86(0x160)](_0x48f686){const _0x5cfb71=_0x40ed86;this[_0x5cfb71(0x1e7)]!==_0x48f686&&(this[_0x5cfb71(0x1e7)]=_0x48f686[_0x5cfb71(0x235)](0x0,0xff),this[_0x5cfb71(0x1ae)]['y']=this[_0x5cfb71(0x1e7)]/0xff,this['y']=this[_0x5cfb71(0x1fb)]/0x2*(0x1-this[_0x5cfb71(0x1e7)]/0xff)+_0x143183);}}let _0x30dc71=Scene_Message['prototype'][_0x40ed86(0x14a)];Scene_Message[_0x40ed86(0x171)][_0x40ed86(0x14a)]=function(){const _0x336f5c=_0x40ed86;let _0x10b7d9=_0x30dc71[_0x336f5c(0x154)](this);return _0x10b7d9[_0x336f5c(0x1fb)]+=_0x42f9ce+0x3,_0x10b7d9;};function _0x59f5ae(_0x3ae59f){const _0x5e443d=_0x40ed86;try{_0x3ae59f=_0x3ae59f['replace'](/(?:\\|\x1b)Say\[([^\]]+)\]/gi,(_0x1ea708,_0x1ff017)=>_0x1ff017),_0x3ae59f=MulitLanguageArgs[_0x5e443d(0x1d2)](_0x3ae59f);}catch(_0x3f5169){}return _0x3ae59f;}})());var a;function testBack(){const _0x5e4233=a0_0x20ac;let _0x1cb7d8=new Sprite();_0x1cb7d8['opacity']=0x64;let _0x3aed86=ImageManager[_0x5e4233(0x1ef)](_0x5e4233(0x1e5));_0x3aed86['addLoadListener'](()=>{const _0xb0d550=_0x5e4233;_0x1cb7d8[_0xb0d550(0x195)]=_0x3aed86,SceneManager[_0xb0d550(0x22c)][_0xb0d550(0x18c)](_0x1cb7d8);;});}var chimakiMsgSkinParams=chimakiMsgSkinParams||{};function a0_0xc554(){const _0x42be6c=['backFrameCloseMode','_showList','_name','zh-TW','setMainHandler','choiceImageHover','scale','CVNPG','lastYIndex','mainFontFace','true','addCommand','choiceHoverSeName','_choiceListWindow','destroy','left','push','_msgTextAlign','updateBackground','setClickHandler','getStyledTextWidth','bind','setBackFrameOpacity','updateInputData','nameBoxPosY','charSpacing','outlineWidth','right','makeCommandList','choices','word','substring','isOver','getControlSequenceWidth','startMessage','clear','_index','createText','clearFlags','calcTextHeight','rtl','callCancelHandler','getLangDataText','drawing','pointerover','msgSkin_outlineWidth','fontFace','sequence','allText','addEventListener','_textState','interactive','CtrlToSkip','contents','removeEventListener','imageHeight','center','_selectImgList','updateBackFrameForceHide','newLineX','startPause','AVG_area','forEach','_openness','defaultOutlineColor','textWidth','updateMessage','_textSountWait','msgSkin_fontSize','choiceImageNormal','resetOver','loadSystem','initialize','indexOf','loadMessageFace','initHanlder','button','test','enabled','select','processNewLine','_clickHandler','centerYOffset','height','345dyKUnb','textWindowWidth','_selectContainer','changeAutoBreak','addLoadListener','width','_hoverBitmap','getCleanTextWidth','updateSpeakerName','_nameBoxWindow','updatePlacement','option','text','updateText','mainFontSize','choiceImageNoraml','334525vBLnpF','choice','_over','pointerdown','align','startYOffset','charCodeAt','msgSkin_textAlign','7300wrIthE','option_hover','update','addChildToBack','playOkSound','centerSwitchIdForver','nameBoxCenter','close','contentsWidth','setName','isBackFrameForcedHidden','addChildAt','52cfZXMY','body','updateOpen','SeName','pointermove','createChoiceListWindow','opacity','getWordWidth','textSizeEx','contentsHeight','createTextBuffer','index','_scene','_downArrowSprite','msgTextAlign','_cancelButton','anchor','locale','registerCommand','updateInput','toUpperCase','clamp','nameBoxFontSize','length','windowHeight','changeTextAlign','choiceHoverSeVolume','resetFontSettings','msgSkin_nameFontSize','choiceHoverScale','outlineColor','fontSize','defaultFontSize','changeMsgSetting','createNameBoxWindow','isPressed','_upArrowSprite','_createPauseSignSprites','messageWindowRect','_normalBitmap','_tempHandler','removeChild','_mainWindow','_down','visible','_pauseSignSprite','onEndOfText','ChimakiMsgSkin','call','_text','initMembers','color','extractWord','isEndOfText','7654816CfcbPe','playSe','nextIndex','nameBoxImgOffsetY','buffer','split','openness','nameBoxOutlineWidth','pause','onPress','isDown','72YhzZph','3198699HRWtMR','msgSkin_nameOutlineWidth','defaultOutlineWidth','onLeave','autoBreak','set','drawTextEx','callOkHandler','1161601kIQDvH','_lastText','startXOffset','prototype','replace','createTextState','startX','_updateCanvas','closeBackFrame','match','open','terminateMessage','flushTextState','onOver','totalText','children','backImag','2173668HQxWtz','updateShowFast','style','zIndex','parameters','deactivate','#00000080','isWaiting','msgSkin_outlineColor','processCharacter','extractEscapeSequence','setBackgroundType','lang','addChild','2283920ZGCKWz','waitSystemBack','createSelectImage','isPictureChoices','onClick','onMove','createCancelButton','setBitmap','bitmap','windowWidth','_canvas','control','isPressedMsgSkipButton','drawText','backPosOffsetY','click','updateClose','useDefaultBgSwitchId','enableChoice','_backFrame','value','msgSkin_nameOutlineColor','newPage','msgMaxWidth','_nameBoxImage','parent','enableTouch'];a0_0xc554=function(){return _0x42be6c;};return a0_0xc554();}((()=>{const _0x4bac6d=a0_0x20ac,{choiceImageNormal:_0x2c40e9,choiceImageHover:_0x139107,imageHeight:_0x3ae49d,enableTouch:_0x3aa4ae,centerYOffset:_0x5b9d14,enableChoice:_0x122f13,choiceHoverScale:_0x2c3c93,choiceHoverSeName:_0xa9a177,choiceHoverSeVolume:_0x1c47f4,choiceHoverSePitch:_0x55e785,choiceHoverSePan:_0x5f4343}={...chimakiMsgSkinParams};if(!_0x122f13)return;const _0x28ddef=_0x3ae49d||0x4c,_0x2bfed7=_0x3aa4ae||![],_0x4d2723=_0x5b9d14||0x28,_0x3bdb96=_0x2c40e9||_0x4bac6d(0x207),_0x21f060=_0x139107||_0x4bac6d(0x215),_0x52e115=Number(_0x2c3c93)||1.05,_0x527268=String(_0xa9a177||''),_0x2c0714=Number(_0x1c47f4)||0x5a,_0x26be9b=Number(_0x55e785)||0x64,_0x22194c=Number(_0x5f4343)||0x0;class _0x5493ec extends Sprite{[_0x4bac6d(0x1f0)](){const _0x3e90e5=_0x4bac6d;super[_0x3e90e5(0x1f0)](...arguments),this['_baseWindow']=new Window_Base(new Rectangle(0x0,0x0,0x1,0x1)),this[_0x3e90e5(0x230)]['set'](0.5),this[_0x3e90e5(0x14b)]=new Bitmap(0x1,0x1),this['_hoverBitmap']=new Bitmap(0x1,0x1),this[_0x3e90e5(0x16f)]='',_0x2bfed7&&(this['interactive']=![]),this[_0x3e90e5(0x1f3)](),this[_0x3e90e5(0x1cd)]();}['resetFontSettings'](){const _0xdbb663=_0x4bac6d;this[_0xdbb663(0x14b)]&&(this[_0xdbb663(0x14b)][_0xdbb663(0x23f)]=$gameSystem['mainFontSize'](),this[_0xdbb663(0x14b)][_0xdbb663(0x1d6)]=$gameSystem[_0xdbb663(0x1b1)]()),this[_0xdbb663(0x202)]&&(this[_0xdbb663(0x202)][_0xdbb663(0x23f)]=$gameSystem[_0xdbb663(0x20a)](),this['_hoverBitmap']['fontFace']=$gameSystem[_0xdbb663(0x1b1)]());}[_0x4bac6d(0x1cd)](){const _0x3c5a99=_0x4bac6d,_0x5421f5=this[_0x3c5a99(0x1fd)]();this['_text']&&(this['removeChild'](this[_0x3c5a99(0x155)]),this[_0x3c5a99(0x155)][_0x3c5a99(0x1b6)]({'children':!![]})),this[_0x3c5a99(0x155)]=new Window_Base(new Rectangle(0x0,0x0,_0x5421f5,0x3c)),this['_text']['setBackgroundType'](0x2),this[_0x3c5a99(0x155)]['frameVisible']=![],this[_0x3c5a99(0x155)][_0x3c5a99(0x151)]&&this[_0x3c5a99(0x155)][_0x3c5a99(0x14d)](this[_0x3c5a99(0x155)][_0x3c5a99(0x151)]),this['_text'][_0x3c5a99(0x22d)]&&this['_text'][_0x3c5a99(0x14d)](this[_0x3c5a99(0x155)]['_downArrowSprite']),this[_0x3c5a99(0x155)][_0x3c5a99(0x148)]&&this[_0x3c5a99(0x155)][_0x3c5a99(0x14d)](this[_0x3c5a99(0x155)][_0x3c5a99(0x148)]),this['_text']['x']=-_0x5421f5/0x2,this[_0x3c5a99(0x155)]['y']=-this[_0x3c5a99(0x155)][_0x3c5a99(0x1fb)]/0x2,this[_0x3c5a99(0x18c)](this['_text']),this[_0x3c5a99(0x16f)]&&this[_0x3c5a99(0x209)](this[_0x3c5a99(0x16f)]);}[_0x4bac6d(0x1fd)](){const _0x358a2e=_0x4bac6d,_0x4139fa=this[_0x358a2e(0x14b)]&&this[_0x358a2e(0x14b)]['width']>0x1?this[_0x358a2e(0x14b)]:this[_0x358a2e(0x195)];return _0x4139fa&&_0x4139fa[_0x358a2e(0x201)]>0x1?_0x4139fa[_0x358a2e(0x201)]:Graphics[_0x358a2e(0x201)];}[_0x4bac6d(0x209)](_0x573666){const _0x2dbecc=_0x4bac6d;this[_0x2dbecc(0x16f)]=_0x573666,this[_0x2dbecc(0x155)][_0x2dbecc(0x1dd)][_0x2dbecc(0x1cb)](),this[_0x2dbecc(0x155)]['contents'][_0x2dbecc(0x1d6)]=$gameSystem[_0x2dbecc(0x1b1)](),this[_0x2dbecc(0x155)]['contents']['fontSize']=$gameSystem[_0x2dbecc(0x20a)]();const _0x2abbb9=this[_0x2dbecc(0x155)][_0x2dbecc(0x228)](_0x573666),_0x2eb49a=(this[_0x2dbecc(0x155)][_0x2dbecc(0x21c)]()-_0x2abbb9[_0x2dbecc(0x201)])/0x2,_0x5ae44a=Math['max']((this['_text'][_0x2dbecc(0x229)]()-_0x2abbb9[_0x2dbecc(0x1fb)])/0x2,0x0);this[_0x2dbecc(0x155)][_0x2dbecc(0x16c)](_0x573666,_0x2eb49a,_0x5ae44a,this['_text']['contentsWidth']());}[_0x4bac6d(0x1f3)](){const _0x577a02=_0x4bac6d;this['on'](_0x577a02(0x1d4),this['onOver'][_0x577a02(0x1bd)](this)),this['on']('pointerup',this['onUp'][_0x577a02(0x1bd)](this)),this['on'](_0x577a02(0x20f),this['onPress'][_0x577a02(0x1bd)](this)),this['on']('pointerout',this[_0x577a02(0x169)][_0x577a02(0x1bd)](this)),this['on'](_0x577a02(0x224),this[_0x577a02(0x192)]['bind'](this)),this['on'](_0x577a02(0x19c),this[_0x577a02(0x191)][_0x577a02(0x1bd)](this));}[_0x4bac6d(0x1ac)](_0xecebca,_0xfd401c){const _0x25488e=_0x4bac6d;this[_0x25488e(0x1cc)]=_0xfd401c,this[_0x25488e(0x14e)]=_0xecebca;}[_0x4bac6d(0x1c8)](){const _0xd22d4a=_0x4bac6d;return this[_0xd22d4a(0x20e)];}[_0x4bac6d(0x164)](){return this['_down'];}['isUp'](){const _0x2ade0=_0x4bac6d;return!this[_0x2ade0(0x14f)];}['isHover'](){const _0x2bed5c=_0x4bac6d;return this[_0x2bed5c(0x20e)]&&!this[_0x2bed5c(0x14f)];}[_0x4bac6d(0x243)](){const _0x25b142=_0x4bac6d;return this[_0x25b142(0x20e)]&&this[_0x25b142(0x14f)];}[_0x4bac6d(0x17b)](){const _0x9ab0c5=_0x4bac6d,_0x400c6e=this[_0x9ab0c5(0x20e)];this[_0x9ab0c5(0x14e)]&&(this[_0x9ab0c5(0x14e)][_0x9ab0c5(0x1ee)](),this['_mainWindow'][_0x9ab0c5(0x1f7)](this[_0x9ab0c5(0x1cc)])),this[_0x9ab0c5(0x20e)]=!![],this[_0x9ab0c5(0x1ae)][_0x9ab0c5(0x16b)](_0x52e115),this['bitmap']=this[_0x9ab0c5(0x202)],!_0x400c6e&&_0x527268&&AudioManager['playSe']({'name':_0x527268,'volume':_0x2c0714,'pitch':_0x26be9b,'pan':_0x22194c});}['onUp'](_0x56aa6b){const _0x4a9fb5=_0x4bac6d;this['_clickHandler']&&this[_0x4a9fb5(0x1f9)](),this[_0x4a9fb5(0x14f)]=![];}[_0x4bac6d(0x163)](){this['_down']=!![];}['onLeave'](){const _0x2b5aaf=_0x4bac6d;this[_0x2b5aaf(0x20e)]=![],this[_0x2b5aaf(0x14f)]=![],this[_0x2b5aaf(0x1ae)][_0x2b5aaf(0x16b)](0x1),this[_0x2b5aaf(0x195)]=this[_0x2b5aaf(0x14b)];}[_0x4bac6d(0x192)](){const _0x44483f=_0x4bac6d;this[_0x44483f(0x14f)]=![];}[_0x4bac6d(0x191)](){const _0x516846=_0x4bac6d;this[_0x516846(0x14f)]=![];}[_0x4bac6d(0x1bb)](_0x5f3f71){const _0x5adc0a=_0x4bac6d;this[_0x5adc0a(0x1f9)]=_0x5f3f71;}[_0x4bac6d(0x194)](_0x4b348f,_0xa646b){const _0x22fca6=_0x4bac6d;let _0x408e87=ImageManager['loadSystem'](_0x3bdb96),_0x5daabb=ImageManager[_0x22fca6(0x1ef)](_0x21f060);_0x408e87[_0x22fca6(0x200)](()=>{const _0x4939c9=_0x22fca6;this['bitmap']=_0x408e87,this[_0x4939c9(0x14b)]=_0x408e87,this['createText']();}),_0x5daabb[_0x22fca6(0x200)](()=>{const _0x36aebc=_0x22fca6;this[_0x36aebc(0x202)]=_0x5daabb;});}}let _0xd8fe6b=Window_ChoiceList[_0x4bac6d(0x171)]['initialize'];Window_ChoiceList[_0x4bac6d(0x171)][_0x4bac6d(0x1f0)]=function(_0x5e5e8f){const _0x45f516=_0x4bac6d;this[_0x45f516(0x1e1)]=[],_0xd8fe6b['call'](this,_0x5e5e8f),this['createSelectImage']();},Window_ChoiceList[_0x4bac6d(0x171)][_0x4bac6d(0x193)]=function(){const _0x40fe46=_0x4bac6d;ConfigManager['touchUI']&&(this['_cancelButton']=new Sprite_Button('cancel'),this[_0x40fe46(0x22f)][_0x40fe46(0x150)]=![]);},Window_ChoiceList[_0x4bac6d(0x171)][_0x4bac6d(0x149)]=function(){const _0x4c2f81=_0x4bac6d;this[_0x4c2f81(0x151)]=new Sprite();},Window_ChoiceList[_0x4bac6d(0x171)]['_createArrowSprites']=function(){const _0x3360c4=_0x4bac6d;this[_0x3360c4(0x22d)]=new Sprite(),this[_0x3360c4(0x148)]=new Sprite();},Window_ChoiceList[_0x4bac6d(0x171)][_0x4bac6d(0x1ee)]=function(){const _0x140a94=_0x4bac6d;this[_0x140a94(0x1a9)]&&this['_showList'][_0x140a94(0x237)]>0x0&&this[_0x140a94(0x1a9)][_0x140a94(0x1e6)](_0x5b3aad=>{const _0x235707=_0x140a94;_0x5b3aad[_0x235707(0x169)]();});};let _0x123867=Window_ChoiceList[_0x4bac6d(0x171)][_0x4bac6d(0x1f7)];Window_ChoiceList['prototype']['select']=function(_0x1f402e){const _0x200add=_0x4bac6d;_0x123867[_0x200add(0x154)](this,_0x1f402e);;if(!this[_0x200add(0x1a9)])return;this[_0x200add(0x1a9)]['forEach'](_0x3ac112=>{const _0x4aaa5f=_0x200add;_0x3ac112[_0x4aaa5f(0x195)]=this[_0x4aaa5f(0x1e1)][_0x3ac112[_0x4aaa5f(0x1cc)]][_0x4aaa5f(0x14b)];});let _0x3c9586=this[_0x200add(0x1a9)][_0x1f402e];_0x3c9586&&(_0x3c9586[_0x200add(0x195)]=this[_0x200add(0x1e1)][_0x3c9586[_0x200add(0x1cc)]][_0x200add(0x202)]);},Window_ChoiceList['prototype']['updatePlacement']=function(){this['x']=Graphics['boxWidth']/0x2,this['y']=Graphics['boxHeight']/0x2;},Window_ChoiceList['prototype'][_0x4bac6d(0x18f)]=function(){const _0x2c4ca7=_0x4bac6d;this['_selectContainer']=new Sprite(),this[_0x2c4ca7(0x18c)](this[_0x2c4ca7(0x1fe)]);for(let _0x2f9086=0x0;_0x2f9086<0x6;_0x2f9086++){let _0xb33aa=new _0x5493ec();_0xb33aa[_0x2c4ca7(0x1ac)](this,_0x2f9086),_0xb33aa[_0x2c4ca7(0x194)](_0x2c4ca7(0x207),_0x2c4ca7(0x215)),_0xb33aa['x']=0x0,_0xb33aa['y']=0x0,_0xb33aa[_0x2c4ca7(0x150)]=![],_0x2bfed7&&(_0xb33aa['interactive']=![]),this[_0x2c4ca7(0x1e1)][_0x2c4ca7(0x1b8)](_0xb33aa),this[_0x2c4ca7(0x1fe)]['addChild'](_0xb33aa);}};let _0xb85fd5=Window_ChoiceList[_0x4bac6d(0x171)][_0x4bac6d(0x16d)];Window_ChoiceList[_0x4bac6d(0x171)]['callOkHandler']=function(){const _0x403ab7=_0x4bac6d;this[_0x403ab7(0x1e1)][_0x403ab7(0x1e6)](_0x4ad309=>{const _0x301cd7=_0x403ab7;_0x4ad309['visible']=![],_0x2bfed7&&(_0x4ad309[_0x301cd7(0x1db)]=![]);}),_0xb85fd5[_0x403ab7(0x154)](this),this['_tempHandler']&&(document[_0x403ab7(0x221)][_0x403ab7(0x1de)]('click',this[_0x403ab7(0x14c)]),this[_0x403ab7(0x14c)]=null);};let _0x324d62=Window_ChoiceList[_0x4bac6d(0x171)]['callCancelHandler'];Window_ChoiceList[_0x4bac6d(0x171)][_0x4bac6d(0x1d1)]=function(){const _0x450e29=_0x4bac6d;this['_selectImgList'][_0x450e29(0x1e6)](_0x452821=>{const _0x541daf=_0x450e29;_0x452821[_0x541daf(0x150)]=![],_0x2bfed7&&(_0x452821[_0x541daf(0x1db)]=![]);}),_0x324d62['call'](this,...arguments),this[_0x450e29(0x14c)]&&(document[_0x450e29(0x221)][_0x450e29(0x1de)](_0x450e29(0x19c),this['_tempHandler']),this['_tempHandler']=null);},Window_ChoiceList['prototype'][_0x4bac6d(0x1c4)]=function(){const _0x4af87a=_0x4bac6d;this['_tempHandler']&&(document['body']['removeEventListener'](_0x4af87a(0x19c),this[_0x4af87a(0x14c)]),this[_0x4af87a(0x14c)]=null);this[_0x4af87a(0x14c)]=_0x2429da=>{const _0x1befb7=_0x4af87a;_0x2429da[_0x1befb7(0x1f4)]===0x2&&(SoundManager['playCancel'](),this['updateInputData'](),this[_0x1befb7(0x184)](),this['callCancelHandler']());},document[_0x4af87a(0x221)][_0x4af87a(0x1d9)](_0x4af87a(0x19c),this[_0x4af87a(0x14c)]),this[_0x4af87a(0x1e1)]['forEach'](_0x22f5eb=>{const _0xa2838e=_0x4af87a;_0x22f5eb[_0xa2838e(0x150)]=![],_0x2bfed7&&(_0x22f5eb[_0xa2838e(0x1db)]=![]);}),this[_0x4af87a(0x1a9)]=[];var _0x27ba71=$gameMessage[_0x4af87a(0x1c5)]();for(let _0x4ecdd3=0x0;_0x4ecdd3<_0x27ba71[_0x4af87a(0x237)];_0x4ecdd3++){let _0x4086a3=_0x27ba71[_0x4ecdd3];while(_0x4086a3[_0x4af87a(0x177)](/\x1bV\[(\d+)\]/gi)){_0x4086a3=_0x4086a3[_0x4af87a(0x172)](/\x1bV\[(\d+)\]/gi,(_0x59a865,_0x546fc2)=>$gameVariables['value'](parseInt(_0x546fc2)));}this[_0x4af87a(0x1b3)](_0x4086a3,_0x4af87a(0x20d));if(!$gameMessage[_0x4af87a(0x190)]){let _0x3435cf=this[_0x4af87a(0x1e1)][_0x4ecdd3];;if(!_0x3435cf)continue;_0x3435cf[_0x4af87a(0x150)]=!![],_0x2bfed7&&(_0x3435cf[_0x4af87a(0x1db)]=!![]),_0x3435cf['updateText'](_0x4086a3),_0x3435cf[_0x4af87a(0x23b)](),_0x3435cf[_0x4af87a(0x1bb)](_0x3448fe=>{const _0x32996e=_0x4af87a;this[_0x32996e(0x1f7)](_0x4ecdd3),this[_0x32996e(0x218)](),this[_0x32996e(0x1bf)](),this[_0x32996e(0x184)](),this[_0x32996e(0x16d)]();}),this['_showList'][_0x4af87a(0x1b8)](_0x3435cf);}}let _0xcd515=this[_0x4af87a(0x1a9)][_0x4af87a(0x237)],_0x39823c=_0x28ddef,_0x55661a=_0x39823c*_0xcd515,_0x6e2127=-_0x55661a/0x2+_0x39823c/0x2+_0x4d2723;this[_0x4af87a(0x1a9)][_0x4af87a(0x1e6)]((_0x6789eb,_0x51533b)=>{_0x6789eb['y']=_0x6e2127+_0x51533b*_0x39823c;});};})());