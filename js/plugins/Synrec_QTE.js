/*:
 * @author Synrec / Kylestclr
 * @plugindesc v1.9 Allows for a quick time multi-tap event on map scene
 * @url https://synrec.itch.io/
 * @target MZ
 * 
 * @command Begin QTE
 * @desc Starts Quick Time Event
 * 
 * @arg Screen X
 * @desc Position X on screen
 * @type number
 * @default 0
 * 
 * @arg Screen Y
 * @desc Position Y on screen
 * @type number
 * @default 0
 * 
 * @arg Duration
 * @desc How long the QTE lasts in frames
 * @type number
 * @default 60
 * 
 * @arg Duration Penalty
 * @desc The penalty applied to duration for incorrect input
 * @type number
 * @default 60
 * 
 * @arg Buttons
 * @desc The buttons to use for input
 * @type select[]
 * @option ok
 * @option cancel
 * @option up
 * @option down
 * @option left
 * @option right
 * @option pageup
 * @option pagedown
 * @default []
 * 
 * @arg Randomize Buttons
 * @parent Buttons
 * @desc Button order randomized every time
 * @type boolean
 * @default false
 * 
 * @arg Hide Gauge
 * @desc Hide the gauge used to remaining duration for the timer.
 * @type boolean
 * @default false
 * 
 * @arg Hide Timer
 * @desc Hide the text timer used to display duration for button push.
 * @type boolean
 * @default false
 * 
 * @arg Valid Sound
 * @desc Play custom valid input sound
 * @type struct<qteSe>
 * 
 * @arg Invalid Sound
 * @desc Play custom valid input sound
 * @type struct<qteSe>
 * 
 * @arg Button Offset X
 * @desc Offset buttons on horizontal axis
 * @type number
 * @min -999999
 * @default 32
 * 
 * @arg Button Offset Y
 * @desc Offset buttons on vertical axis
 * @type number
 * @min -999999
 * @default 32
 * 
 * @arg Gauge Configuration
 * @desc Setup the gauge graphics
 * @type struct<gauge>
 * 
 * @arg Button Up Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @arg Button Down Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @arg Button Left Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @arg Button Right Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @arg Button Ok Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @arg Button Cancel Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @arg Button Pageup Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @arg Button Pagedown Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @help
 * 
 * Please setup the graphic parameters for the QTE buttons.
 * 
 * The QTE switch is automatically set to false when QTE begins.
 * 
 * MV Plugin Commands
 * 
 * > qteButtons button button button button
 * - Valid buttons are: up, down, left, right, ok, cancel, pageup, pagedown
 * - Format: qteButtons up up ok down left
 * 
 * > qteRandom
 * - No arguments
 * - Randomizes buttons
 * - Format: qteRandom
 * 
 * > qteLocate x y
 * - Positions the gauge on screen
 * - Takes two evaluated number arguments
 * - Format: qteLocate 100 400
 * 
 * > qteStart duration penalty hide_gauge hide_timer
 * - Starts the QTE
 * - Takes four arguments evaluated to numbers (duration, penalty)
 * - Format: qteStart duration penalty hide_gauge hide_timer
 * 
 * > qteCustomize command filename value_1 value_2
 * - Customizes the QTE based on the command chosen
 * -- Valid commands are: offset, gauge, up_btn, down_btn, 
 * left_btn, right_btn, ok_btn, cancel_btn, pageup_btn, pagedown_btn
 * --- up_btn, down_btn, left_btn, right_btn, ok_btn, cancel_btn, 
 * pageup_btn, pagedown_btn use filename for button graphics,
 * value_1 for number of frames and value_2 for frame update rate.
 * --- offset uses only value_1 and value_2 and as such any text must
 * be used for the filename
 * --- guage uses only filename for gauge background and value_1 for the
 * duration.
 * 
 * @param QTE Switch
 * @desc The switch used for QTE
 * @type switch
 * @default 1
 * 
 * @param Preload QTE Buttons
 * @desc Will not work for event set custom buttons.
 * @type boolean
 * @default true
 * 
 * @param Button Offset X
 * @desc Offset buttons on horizontal axis
 * @type number
 * @min -999999
 * @default 32
 * 
 * @param Button Offset Y
 * @desc Offset buttons on vertical axis
 * @type number
 * @min -999999
 * @default 32
 * 
 * @param Gauge Configuration
 * @desc Setup the gauge graphics
 * @type struct<gauge>
 * 
 * @param Button Up Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @param Button Down Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @param Button Left Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @param Button Right Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @param Button Ok Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @param Button Cancel Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @param Button Pageup Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 * @param Button Pagedown Graphics
 * @desc Graphics used for the buttons
 * @type struct<graphic>
 * @default {}
 * 
 */
/*~struct~qteSe:
 * 
 * @param name
 * @text Name
 * @desc The Sound effect file used
 * @dir /audio/se/
 * @type file
 * 
 * @param volume
 * @text Volume
 * @desc Sound Loudness
 * @type number
 * @default 90
 * 
 * @param pitch
 * @text Pitch
 * @desc Tone of the sound
 * @type number
 * @default 100
 * 
 * @param pan
 * @text Pan
 * @desc Set the sound balance
 * @type number
 * @default 0
 * 
 */
/*~struct~gauge:
 * 
 * @param Gauge Background 
 * @desc File used for background
 * @type file
 * @dir img/pictures/
 * 
 * @param Gauge Duration
 * @desc File used for gauge duration
 * @type file
 * @dir img/pictures/
 * 
 */
/*~struct~graphic:
 * 
 * @param File
 * @desc File used
 * @type file
 * @dir img/pictures/
 * 
 * @param Frames
 * @desc Number of slice
 * @type number
 * @default 1
 * @min 1
 * 
 * @param Frame Rate
 * @desc The rate at which frames update (Higher = slower)
 * @type number
 * @default 1
 * 
 */
const QTE_MZ_MODE = Utils.RPGMAKER_NAME == "MZ";

const Syn_QTE = {};
Syn_QTE.Plugin = PluginManager.parameters(`Synrec_QTE`);

Syn_QTE.Switch = eval(Syn_QTE.Plugin['QTE Switch']);
Syn_QTE.Preload = eval(Syn_QTE.Plugin['Preload QTE Buttons']);

Syn_QTE.BTN_X = eval(Syn_QTE.Plugin['Button Offset X']) || 0;
Syn_QTE.BTN_Y = eval(Syn_QTE.Plugin['Button Offset Y']) || 0;

Syn_QTE.Gauge = {};
try{
    const gauge = JSON.parse(Syn_QTE.Plugin['Gauge Configuration']);
    Syn_QTE.Gauge = gauge;
}catch(e){
    console.error(`Failed to parse QTE Gauge Configuration. ${e}`);
}

function QTE_BUTTON_PARSER(btn){
    try{
        btn = JSON.parse(btn);
        if(
            btn['File'] && 
            Syn_QTE.Preload &&
            Utils.isOptionValid("test")
        )ImageManager.loadPicture(btn['File']);
        btn['Frames'] = eval(btn['Frames']);
        btn['Frame Rate'] = eval(btn['Frame Rate']);
    }catch(e){
        console.error(`Failed to parse QTE btn: ${btn}, ${e}`);
        btn = {};
        btn['File'] = '';
        btn['Frames'] = 1;
        btn['Frame Rate'] = Infinity;
    }
    return btn;
}

Syn_QTE.Up = {};
try{
    Syn_QTE.Up = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Up Graphics']);
}catch(e){
    console.error(`Failed to parse up button graphic. ${e}`);
}

Syn_QTE.Down = {};
try{
    Syn_QTE.Down = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Down Graphics']);
}catch(e){
    console.error(`Failed to parse down button graphic. ${e}`);
}

Syn_QTE.Left = {};
try{
    Syn_QTE.Left = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Left Graphics']);
}catch(e){
    console.error(`Failed to parse left button graphic. ${e}`);
}

Syn_QTE.Right = {};
try{
    Syn_QTE.Right = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Right Graphics']);
}catch(e){
    console.error(`Failed to parse right button graphic. ${e}`);
}

Syn_QTE.Ok = {};
try{
    Syn_QTE.Ok = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Ok Graphics']);
}catch(e){
    console.error(`Failed to parse ok button graphic. ${e}`);
}

Syn_QTE.Cancel = {};
try{
    Syn_QTE.Cancel = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Cancel Graphics']);
}catch(e){
    console.error(`Failed to parse cancel button graphic. ${e}`);
}

Syn_QTE.Pageup = {};
try{
    Syn_QTE.Pageup = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Pageup Graphics']);
}catch(e){
    console.error(`Failed to parse pageup button graphic. ${e}`);
}

Syn_QTE.Pagedown = {};
try{
    Syn_QTE.Pagedown = QTE_BUTTON_PARSER(Syn_QTE.Plugin['Button Pagedown Graphics']);
}catch(e){
    console.error(`Failed to parse pagedown button graphic. ${e}`);
}

Syn_QTE.BUTTONS = [
    Syn_QTE.Up, 
    Syn_QTE.Down, 
    Syn_QTE.Left, 
    Syn_QTE.Right,
    Syn_QTE.Ok,
    Syn_QTE.Cancel,
    Syn_QTE.Pageup,
    Syn_QTE.Pagedown
]

if(QTE_MZ_MODE){
    PluginManager.registerCommand(`Synrec_QTE`, 'Begin QTE', (obj)=>{
        $gameTemp.clearSeQTE();
        const valid_se = obj['Valid Sound'];
        const invalid_se = obj['Invalid Sound'];
        $gameTemp.setValidSeQTE(valid_se);
        $gameTemp.setInvalidSeQTE(invalid_se);
        const x = eval(obj['Screen X']);
        const y = eval(obj['Screen Y']);
        const duration = eval(obj['Duration']);
        const penalty = eval(obj['Duration Penalty']);
        const hide_gauge = eval(obj['Hide Gauge']);
        const hide_timer = eval(obj['Hide Timer']);
        const custom_button_offset_x = eval(obj['Button Offset X']);
        const custom_button_offset_y = eval(obj['Button Offset Y']);
        const custom_gauge_config = JSON.parse(obj['Gauge Configuration'] || []);
        const custom_up_btn_gfx = QTE_BUTTON_PARSER(obj['Button Up Graphics']);
        const custom_dn_btn_gfx = QTE_BUTTON_PARSER(obj['Button Down Graphics']);
        const custom_lt_btn_gfx = QTE_BUTTON_PARSER(obj['Button Left Graphics']);
        const custom_rt_btn_gfx = QTE_BUTTON_PARSER(obj['Button Right Graphics']);
        const custom_ok_btn_gfx = QTE_BUTTON_PARSER(obj['Button Ok Graphics']);
        const custom_cn_btn_gfx = QTE_BUTTON_PARSER(obj['Button Cancel Graphics']);
        const custom_pup_btn_gfx = QTE_BUTTON_PARSER(obj['Button Pageup Graphics']);
        const custom_pdn_btn_gfx = QTE_BUTTON_PARSER(obj['Button Pagedown Graphics']);
        $gameTemp.setBtnOffsetQTE(custom_button_offset_x, custom_button_offset_y);
        $gameTemp.setCustomGaugeQTE(custom_gauge_config);
        $gameTemp.setUpBtnQTE(custom_up_btn_gfx);
        $gameTemp.setDownBtnQTE(custom_dn_btn_gfx);
        $gameTemp.setLeftBtnQTE(custom_lt_btn_gfx);
        $gameTemp.setRightBtnQTE(custom_rt_btn_gfx);
        $gameTemp.setOkBtnQTE(custom_ok_btn_gfx);
        $gameTemp.setCancelBtnQTE(custom_cn_btn_gfx);
        $gameTemp.setPageupBtnQTE(custom_pup_btn_gfx);
        $gameTemp.setPagedownBtnQTE(custom_pdn_btn_gfx);
        try{
            const buttons = JSON.parse(obj['Buttons']);
            const randomize = eval(obj['Randomize Buttons']);
            $gameTemp.beginQTE(
                buttons, 
                randomize, 
                duration, 
                penalty, 
                x, 
                y,
                hide_gauge,
                hide_timer
            );
        }catch(e){
            console.error(`Failed to load QTE. ${e}`)
        }
    })
}

Game_Temp.prototype.setBtnOffsetQTE = function(x, y){
    this._qte_x = x;
    this._qte_y = y;
}

Game_Temp.prototype.buttonOffsetQTE = function(){
    const x = isNaN(this._qte_x) ? Syn_QTE.BTN_X : this._qte_x;
    const y = isNaN(this._qte_y) ? Syn_QTE.BTN_Y : this._qte_y;
    return [x, y];
}

Game_Temp.prototype.setCustomGaugeQTE = function(gauge_data){
    this._qte_gauge = gauge_data;
}

Game_Temp.prototype.customGaugeQTE = function(){
    return typeof this._qte_gauge == 'object' ? this._qte_gauge : Syn_QTE.Gauge;
}

Game_Temp.prototype.setUpBtnQTE = function(btn_data){
    this._qte_up_btn = btn_data;
}

Game_Temp.prototype.upButtonQTE = function(){
    if(this._qte_up_btn){
        return this._qte_up_btn['File'] ? this._qte_up_btn : Syn_QTE.Up;
    }
    return Syn_QTE.Up;
}

Game_Temp.prototype.setDownBtnQTE = function(btn_data){
    this._qte_dn_btn = btn_data;
}

Game_Temp.prototype.downButtonQTE = function(){
    if(this._qte_dn_btn){
        return this._qte_dn_btn['File'] ? this._qte_dn_btn : Syn_QTE.Down;
    }
    return Syn_QTE.Down;
}

Game_Temp.prototype.setLeftBtnQTE = function(btn_data){
    this._qte_lt_btn = btn_data;
}

Game_Temp.prototype.leftButtonQTE = function(){
    if(this._qte_lt_btn){
        return this._qte_lt_btn['File'] ? this._qte_lt_btn : Syn_QTE.Left;
    }
    return Syn_QTE.Left
}

Game_Temp.prototype.setRightBtnQTE = function(btn_data){
    this._qte_rt_btn = btn_data;
}

Game_Temp.prototype.rightButtonQTE = function(){
    if(this._qte_rt_btn){
        return this._qte_rt_btn['File'] ? this._qte_rt_btn : Syn_QTE.Right;
    }
    return Syn_QTE.Right;
}

Game_Temp.prototype.setOkBtnQTE = function(btn_data){
    this._qte_ok_btn = btn_data;
}

Game_Temp.prototype.okButtonQTE = function(){
    if(this._qte_ok_btn){
        return this._qte_ok_btn['File'] ? this._qte_ok_btn : Syn_QTE.Ok;
    }
    return Syn_QTE.Ok;
}

Game_Temp.prototype.setCancelBtnQTE = function(btn_data){
    this._qte_cn_btn = btn_data;
}

Game_Temp.prototype.cancelButtonQTE = function(){
    if(this._qte_cn_btn){
        return this._qte_cn_btn['File'] ? this._qte_cn_btn : Syn_QTE.Cancel;
    }
    return Syn_QTE.Cancel;
}

Game_Temp.prototype.setPageupBtnQTE = function(btn_data){
    this._qte_pup_btn = btn_data;
}

Game_Temp.prototype.pageupButtonQTE = function(){
    if(this._qte_pup_btn){
        return this._qte_pup_btn['File'] ? this._qte_pup_btn : Syn_QTE.Pageup;
    }
    return Syn_QTE.Pageup;
}

Game_Temp.prototype.setPagedownBtnQTE = function(btn_data){
    this._qte_pdn_btn = btn_data;
}

Game_Temp.prototype.pagedownButtonQTE = function(){
    if(this._qte_pdn_btn){
        return this._qte_pdn_btn['File'] ? this._qte_pdn_btn : Syn_QTE.Pagedown;
    }
    return Syn_QTE.Pagedown;
}

Game_Temp.prototype.locateQTE = function(x,y){
    if(isNaN(x))x = 0;
    if(isNaN(y))y = 0;
    this._qtePos = [x,y];
}

Game_Temp.prototype.buttonsQTE = function(buttons){
    if(!Array.isArray(buttons))buttons = [];
    this._qteBtns = buttons;
}

Game_Temp.prototype.randomQTE = function(){
    this._qteRndm = true;
}

Game_Temp.prototype.initQTE = function(dura, pena, hide_gauge, hide_timer){
    if(!Array.isArray(this._qtePos))this.locateQTE(0, 0);
    if(isNaN(dura))dura = 0;
    if(isNaN(pena))pena = 0;
    const duration = dura;
    const penalty = pena;
    const randomize = this._qteRndm ? true : false;
    const btns = this._qteBtns;
    const pos_x = this._qtePos[0];
    const pos_y = this._qtePos[1];
    this.beginQTE(
        btns,
        randomize,
        duration,
        penalty,
        pos_x,
        pos_y,
        hide_gauge,
        hide_timer
    )
    this._qteRndm = false;
}

Game_Temp.prototype.beginQTE = function(
    buttons,
    randomize,
    duration,
    penalty,
    pos_x,
    pos_y,
    no_gauge,
    no_timer
){
    const data = {};
    data.buttons = buttons;
    data.random = randomize;
    data.duration = duration;
    data.penalty = penalty;
    data.pos_x = pos_x;
    data.pos_y = pos_y;
    const scene = SceneManager._scene;
    const gauge = new Sprite_TimerGauge(data, no_gauge, no_timer);
    scene.addChild(gauge);
    this._qte = gauge;
}

Game_Temp.prototype.setValidSeQTE = function(obj){
    if(obj){
        if(typeof obj == 'string'){
            try{
                obj = JSON.parse(obj);
                obj.volume = Number(obj.volume);
                obj.pitch = Number(obj.pitch);
                obj.pan = Number(obj.pan);
                this._validSeQTE = obj;
            }catch(e){
                console.error(`Failed to parse valid se: ${obj}, ${e}`);
            }
        }else if(typeof obj == 'object'){
            this._validSeQTE = obj;
        }
    }
}

Game_Temp.prototype.setInvalidSeQTE = function(obj){
    if(obj){
        if(typeof obj == 'string'){
            try{
                obj = JSON.parse(obj);
                obj.volume = Number(obj.volume);
                obj.pitch = Number(obj.pitch);
                obj.pan = Number(obj.pan);
                this._invalidSeQTE = obj;
            }catch(e){
                console.error(`Failed to parse invalid se: ${obj}, ${e}`);
            }
        }else if(typeof obj == 'object'){
            this._invalidSeQTE = obj;
        }
    }
}

Game_Temp.prototype.clearSeQTE = function(){
    this._validSeQTE = null;
    this._invalidSeQTE = null;
}

Game_Temp.prototype.qteRunning = function(){
    if(this._qte){
        return true;
    }
    return false;
}

Syn_QTE_GmIntrpr_UpdtWait = Game_Interpreter.prototype.updateWait;
Game_Interpreter.prototype.updateWait = function() {
    return Syn_QTE_GmIntrpr_UpdtWait.call(this) || $gameTemp.qteRunning();
}

Syn_QTE_GmIntrpr_PlugCmd = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Syn_QTE_GmIntrpr_PlugCmd.call(this, command, args);
    if(command == 'qteCustomize'){
        const cmd = args[0];
        const filename = args[1]; //!No filename spaces can be used, MV Limitation!!
        const value_1 = eval(args[2]);
        const value_2 = eval(args[3]);
        if(cmd == 'offset'){
            $gameTemp.setBtnOffsetQTE(value_1, value_2);
        }
        if(cmd == 'gauge'){
            const obj = {};
            obj['Gauge Background'] = filename;
            obj['Gauge Duration'] = value_1;
            $gameTemp.setCustomGaugeQTE(obj);
        }
        if(cmd == 'up_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setUpBtnQTE(obj);
        }
        if(cmd == 'down_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setDownBtnQTE(obj);
        }
        if(cmd == 'left_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setLeftBtnQTE(obj);
        }
        if(cmd == 'right_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setRightBtnQTE(obj);
        }
        if(cmd == 'ok_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setOkBtnQTE(obj);
        }
        if(cmd == 'cancel_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setCancelBtnQTE(obj);
        }
        if(cmd == 'pageup_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setPageupBtnQTE(obj);
        }
        if(cmd == 'pagedown_btn'){
            const obj = {};
            obj['File'] = filename;
            obj['Frames'] = value_1 || 1;
            obj['Frame Rate'] = value_2 || Infinity;
            $gameTemp.setPagedownBtnQTE(obj);
        }
    }
    if(command == 'qteRandom')$gameTemp.randomQTE();
    if(command == 'qteLocate'){
        const x = eval(args[0]);
        const y = eval(args[1]);
        $gameTemp.locateQTE(x, y);
    }
    if(command == 'qteButtons'){
        const buttons = args.map((btn)=>{
            if(!btn)return;
            const button = btn.toLowerCase();
            const valid = ['up', 'down', 'left', 'right', 'ok', 'cancel', 'pageup', 'pagedown'];
            if(valid.includes(button)){
                return button
            }
        }).filter(Boolean);
        $gameTemp.buttonsQTE(buttons);
    }
    if(command == 'qteStart'){
        const duration = eval(args[0]);
        const penalty = eval(args[1]);
        const hide_gauge = args[2] == 'hide_gauge' ? true : false;
        const hide_timer = args[3] == 'hide_timer' ? true : false;
        $gameTemp.initQTE(duration, penalty, hide_gauge, hide_timer);
    }
}

function Sprite_TimerButton(){
    this.initialize(...arguments);
}

Sprite_TimerButton.prototype = Object.create(Sprite.prototype);
Sprite_TimerButton.prototype.constructor = Sprite_TimerButton;

Sprite_TimerButton.prototype.initialize = function(data){
    Sprite.prototype.initialize.call(this);
    this._data = data;
    this.bitmap = ImageManager.loadPicture(data['File']);
    this._cur_frame = 0;
    this._max_frames = data['Frames'];
    this._cur_rate = 0;
    this._rate_frame = data['Frame Rate'];
}

Sprite_TimerButton.prototype.update = function(){
    Sprite.prototype.update.call(this);
    this.updateFrame();
}

Sprite_TimerButton.prototype.updateFrame = function(){
    const b = this.bitmap;
    const bw = b.width;
    const bh = b.height;
    const cur_frame = this._cur_frame;
    const max_frames = this._max_frames;
    const w = bw / max_frames;
    const h = bh;
    const y = 0;
    const x = cur_frame * w;
    this.setFrame(x,y,w,h);
    if(this._cur_rate >= this._rate_frame){
        this._cur_rate = 0;
        this._cur_frame++;
        if(this._cur_frame >= this._max_frames){
            this._cur_frame = 0;
        }
    }else this._cur_rate++;
}

function Sprite_TimerGauge(){
    this.initialize(...arguments);
}

Sprite_TimerGauge.prototype = Object.create(Sprite.prototype);
Sprite_TimerGauge.prototype.constructor = Sprite_TimerGauge;

Sprite_TimerGauge.prototype.initialize = function(data, hide_gauge, hide_timer){
    Sprite.prototype.initialize.call(this);
    const switch_id = Syn_QTE.Switch;
    $gameSwitches.setValue(switch_id, false);
    this._buttons = data.buttons;
    this._randomize = data.random;
    this._duration = JsonEx.makeDeepCopy(data.duration);
    this._max_duration = JsonEx.makeDeepCopy(data.duration);
    this._penalty = JsonEx.makeDeepCopy(data.penalty);
    this._curGauge = JsonEx.makeDeepCopy(data.duration);
    this._maxGauge = JsonEx.makeDeepCopy(data.duration);
    this._hide_gauge = hide_gauge;
    this._hide_timer = hide_timer;
    this._data = data;
    const x = data.pos_x || 0;
    const y = data.pos_y || 0;
    this.createChildSprites();
    this.setData();
    this.move(x, y);
}

Sprite_TimerGauge.prototype.isRunning = function(){
    this._duration > 0;
}

Sprite_TimerGauge.prototype.createChildSprites = function(){
    this.createButtonBackSprite();
    this.createButtonGaugeSprite();
    this.createButtonCountDownSprite();
}

Sprite_TimerGauge.prototype.setData = function(){
    const randomize = this._randomize;
    const buttons = [];
    for(let i = 0; i < this._buttons.length; i++){
        const index = Math.randomInt(this._buttons.length);
        const btn = randomize ? this._buttons[index] : this._buttons[i];
        buttons.push(btn);
    }
    this._inputButtons = buttons;
    this.createPressButtons();
}

Sprite_TimerGauge.prototype.createPressButtons = function(){
    let x = this._gauge.x;
    const y = $gameTemp.buttonOffsetQTE()[1] || 0;
    const gauge = this;
    this._inputButtons = this._inputButtons.map((btn)=>{
        const btn_data = gauge.getBtnData(btn);
        if(btn_data){
            const sprite = new Sprite_TimerButton(btn_data);
            sprite._button = btn;
            sprite.move(x,y);
            gauge.addChild(sprite);
            x += $gameTemp.buttonOffsetQTE()[0] || 0;
            return sprite;
        }
    }).filter(Boolean);
}

Sprite_TimerGauge.prototype.createButtonBackSprite = function(){
    const data = $gameTemp.customGaugeQTE();
    const bitmap_name = data['Gauge Background'];
    const bitmap = ImageManager.loadPicture(bitmap_name);
    const sprite = new Sprite();
    sprite.bitmap = bitmap;
    this.addChild(sprite);
    this._background = sprite;
    if(this._hide_gauge){
        sprite.alpha = 0;
    }
}

Sprite_TimerGauge.prototype.createButtonGaugeSprite = function(){
    const data = $gameTemp.customGaugeQTE();
    const bitmap_name = data['Gauge Duration'];
    const bitmap = ImageManager.loadPicture(bitmap_name);
    const sprite = new Sprite();
    sprite.bitmap = bitmap;
    this._background.addChild(sprite);
    this._gauge = sprite;
    if(this._hide_gauge){
        sprite.alpha = 0;
    }
}

Sprite_TimerGauge.prototype.createButtonCountDownSprite = function(){
    const sprite = new Sprite();
    sprite.bitmap = new Bitmap(64,64)
    this.addChild(sprite);
    this._timer = sprite;
    if(this._hide_timer){
        sprite.alpha = 0;
    }
}

Sprite_TimerGauge.prototype.getBtnData = function(name){
    switch(name){
        case 'up': return $gameTemp.upButtonQTE();
        case 'down': return $gameTemp.downButtonQTE();
        case 'left': return $gameTemp.leftButtonQTE();
        case 'right': return $gameTemp.rightButtonQTE();
        case 'ok': return $gameTemp.okButtonQTE();
        case 'cancel': return $gameTemp.cancelButtonQTE();
        case 'pageup': return $gameTemp.pageupButtonQTE();
        case 'pagedown': return $gameTemp.pagedownButtonQTE();
    }
}

Sprite_TimerGauge.prototype.update = function(){
    Sprite.prototype.update.call(this);
    this.updateBtnPos();
    if(this._duration > 0){
        this.updateGauge();
        this.updateCheckInput();
    }else this.updateDelete();
}

Sprite_TimerGauge.prototype.updateBtnPos = function(){
    const y = this._gauge.y + this._gauge.height;
    this._inputButtons.forEach((btn)=>{
        if(btn)btn.y = y;
    })
}

Sprite_TimerGauge.prototype.updateGauge = function(){
    const buttons = this._inputButtons;
    if(this._duration > 0){
        if(isNaN(this._blendFix) || this._blendFix <= 0){
            this._blendFix = 128;
        }else this._blendFix -= 7;
        if(buttons[0]){
            const blend_arr = [255, 255, 255, this._blendFix];
            buttons[0].setBlendColor(blend_arr);
        }
        this._duration--;
        this._timer.bitmap.clear();
        this._timer.bitmap.drawText(this._duration, 0, 0, 48, 48, 'center');
        this._gauge.scale.x = Math.max(0, this._duration / this._max_duration);
    }
}

Sprite_TimerGauge.prototype.updateCheckInput = function(){
    const switch_id = Syn_QTE.Switch;
    const btns = this._inputButtons;
    if(!Array.isArray(btns))return false;
    if(btns.length <= 0){
        this._duration = 0;
        $gameSwitches.setValue(switch_id, true);
        return;
    }
    const btn = btns[0];
    const valid_btn = btn._button;
    let valid_input = false;
    let bad_input = false;
    if(Input.isTriggered('ok') && valid_btn == 'ok'){
        valid_input = true;
    }else if(Input.isTriggered('ok')){
        bad_input = true
    }
    if(Input.isTriggered('cancel') && valid_btn == 'cancel'){
        valid_input = true;
    }else if(Input.isTriggered('cancel')){
        bad_input = true
    }
    if(Input.isTriggered('up') && valid_btn == 'up'){
        valid_input = true;
    }else if(Input.isTriggered('up')){
        bad_input = true
    }
    if(Input.isTriggered('down') && valid_btn == 'down'){
        valid_input = true;
    }else if(Input.isTriggered('down')){
        bad_input = true
    }
    if(Input.isTriggered('left') && valid_btn == 'left'){
        valid_input = true;
    }else if(Input.isTriggered('left')){
        bad_input = true
    }
    if(Input.isTriggered('right') && valid_btn == 'right'){
        valid_input = true;
    }else if(Input.isTriggered('right')){
        bad_input = true
    }
    if(Input.isTriggered('pageup') && valid_btn == 'pageup'){
        valid_input = true;
    }else if(Input.isTriggered('pageup')){
        bad_input = true
    }
    if(Input.isTriggered('pagedown') && valid_btn == 'pagedown'){
        valid_input = true;
    }else if(Input.isTriggered('pagedown')){
        bad_input = true
    }
    if(bad_input){
        if($gameTemp._invalidSeQTE){
            AudioManager.playSe($gameTemp._invalidSeQTE);
        }else{
            SoundManager.playBuzzer();
        }
        this._duration -= this._penalty;
    }else if(valid_input){
        if($gameTemp._invalidSeQTE){
            AudioManager.playSe($gameTemp._validSeQTE);
        }else{
            SoundManager.playOk();
        }
        const button = this._inputButtons[0];
        if(button.parent){
            button.parent.removeChild(button);
        }
        this._inputButtons.forEach((btn)=>{
            if(!btn)return;
            if(!button)return;
            btn.x -= button.width;
        })
        if(button.destroy)button.destroy();
        delete button;
        this._inputButtons.shift();
        this._blendFix = 0;
        if(this._inputButtons.length <= 0){
            this._duration = 0;
            $gameSwitches.setValue(switch_id, true);
            this._valid = true;
        }
    }
}

Sprite_TimerGauge.prototype.updateDelete = function(){
    if(this.parent){
        this.parent.removeChild(this);
    }
    if(!this._valid){
        const switch_id = Syn_QTE.Switch;
        $gameSwitches.setValue(switch_id, false);
    }
    delete $gameTemp._qte;
    delete this;
}

Syn_QTE_ScnTit_Init = Scene_Title.prototype.initialize;
Scene_Title.prototype.initialize = function() {
    Syn_QTE_ScnTit_Init.call(this);
    if(Syn_QTE.Preload && !Utils.isOptionValid("test")){
        this.preloadButtonsQTE();
    }
}

Scene_Title.prototype.preloadButtonsQTE = function(){
    const buttons = Syn_QTE.BUTTONS;
    buttons.forEach((button)=>{
        if(button['File']){
            ImageManager.loadPicture(button['File']);
        }
    })
}