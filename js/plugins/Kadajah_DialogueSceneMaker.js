/*:
 * @target MZ
 * @plugindesc v7.1 - Ultimate Dialogue & Scene Engine. Robust Move_To natively implemented.
 * @author Kadajah
 *
 * @help
 * ============================================================================
 * Kadajah_DialogueSceneMaker.js v7.1
 * ============================================================================
 * 
 * 1. OVERVIEW
 * ============================================================================
 * This plugin transforms external text files into full cutscenes.
 * It controls dialogue, visuals, audio, and offers deep control over
 * Map Events and Character Busts.
 *
 * ============================================================================
 * 2. SETUP
 * ============================================================================
 * 1. Create folder: YourProject/data/dialogues/
 * 2. Place .txt scripts there.
 * 3. Configure "Speaker Presets".
 *
 * ============================================================================
 * 3. TARGETING SYSTEM (MAP EVENTS)
 * ============================================================================
 * 1. PLAYER      -> The main character.
 * 2. THIS        -> The event running the code.
 * 3. SpeakerID   -> ID defined in Plugin Parameters.
 * 4. Event Name  -> Searches map for an event with this specific Name.
 * 5. Event ID    -> Specific Number (e.g. 15).
 *
 * ============================================================================
 * 4. BUST CONTROLS (ADVANCED)
 * ============================================================================
 * You can now control how busts appear using arguments in the [BUST] command.
 * 
 * Syntax: [BUST SpeakerID (MIRROR) (ANIMATION)]
 * 
 * MIRROR Option:
 *   - NORMAL: Standard orientation (Default).
 *   - MIRROR: Flips the image horizontally.
 * 
 * ANIMATION Options:
 *   - FADE:        Standard fade in (Default).
 *   - SLIDE_LEFT:  Slides in from the right to the left.
 *   - SLIDE_RIGHT: Slides in from the left to the right.
 *   - SLIDE_UP:    Slides up from the bottom.
 *   - POP:         Expands from 0% scale to 100%.
 *   - INSTANT:     Appears immediately.
 * 
 * Examples:
 *   [BUST Hero]                    (Standard Fade)
 *   [BUST Hero MIRROR]             (Flipped, Standard Fade)
 *   [BUST Hero SLIDE_UP]           (Normal, Slides up)
 *   [BUST Hero MIRROR SLIDE_LEFT]  (Flipped, Slides left)
 * 
 * ============================================================================
 * 5. COMMAND REFERENCE
 * ============================================================================
 * 
 * --- MOVEMENT & POSITION ---
 * [MOVE target direction]
 *    Directions: UP, DOWN, LEFT, RIGHT, TOWARD, AWAY, BACK, FORWARD.
 *    Example: [MOVE Rick LEFT]
 *
 * [TURN target direction]
 *    Directions: UP, DOWN, LEFT, RIGHT, TOWARD, AWAY, R, L, 180.
 *    Example: [TURN Rick TOWARD]
 *
 * [JUMP target x y]
 *    Example: [JUMP Rick 0 0]
 *
 * [MOVE_TO target x y WAIT]
 *    Example: [MOVE_TO 2 11 3 WAIT]
 *
 * [TELEPORT target x y]
 *    Example: [TELEPORT PLAYER 10 15]
 *
 * --- CHARACTER CONFIGURATION ---
 * [SPEED target value] (1-6)
 * [FREQ target value] (1-5)
 * [OPACITY target value] (0-255)
 * [WALK_ANIME target state] (ON/OFF)
 * [STEP_ANIME target state] (ON/OFF)
 * [DIR_FIX target state] (ON/OFF)
 * [THROUGH target state] (ON/OFF)
 * [TRANSPARENT target state] (ON/OFF)
 *
 * --- VISUALS ---
 * [ANIM id target wait]
 *    Example: [ANIM 4 Rick TRUE]
 *
 * --- DIALOGUE ---
 * SpeakerID: Text
 *    Example: Hero: Hello world!
 *
 * --- TIMING ---
 * [WAIT frames]
 * [PAUSE]
 *
 * --- FLOW CONTROL ---
 * [LABEL name]
 * [GOTO name]
 * [CHOICE Label1 "Text1" Label2 "Text2"]
 *
 * --- BUSTS ---
 * [BUST SpeakerID options]
 * [HIDE_BUSTS]
 *
 * --- SCREEN ---
 * [FADEOUT duration]
 * [FADEIN duration]
 * [TINT r g b gray duration]
 * [SHAKE power speed duration]
 * [FLASH r g b intensity duration]
 * [WEATHER type power duration]
 *
 * --- AUDIO ---
 * [BGM name vol pitch pan]
 * [BGS name vol pitch pan]
 * [SE name vol pitch pan]
 *
 * --- LOGIC ---
 * [SWITCH id ON/OFF]
 * [VAR id value]
 * [CE id]
 * [SCRIPT code]
 *
 * @param speakerPresets
 * @text Speaker Presets
 * @desc Configuration for IDs, Faces, Busts, and Map Events.
 * @type struct<Speaker>[]
 * @default []
 *
 * @param autoDim
 * @text Auto Dim Busts
 * @desc If true, characters who are not speaking will be darkened.
 * @type boolean
 * @default true
 *
 * @param clearBustsAfterText
 * @text Clear Busts After Text
 * @desc If true, busts initiated by a message will be hidden when the text box closes.
 * @type boolean
 * @default false
 *
 * @param bustFadeTime
 * @text Bust Fade Duration
 * @desc Frames for bust fade in/out/tint.
 * @type number
 * @default 20
 *
 * @command loadDialogueFile
 * @text Load Dialogue File
 * @desc Loads and plays a script file from data/dialogues/.
 *
 * @arg filename
 * @text Filename
 * @desc The name of the file (without .txt).
 * @type string
 * @default intro
 *
 * @command startDialogue
 * @text Process Manual Text
 * @desc (Legacy) Parses text entered directly here.
 *
 * @arg scriptText
 * @text Script Text
 * @desc The dialogue script.
 * @type note
 * @default ""
 *
 */

/*~struct~Speaker:
 * @param id
 * @text ID (Script Key)
 * @desc Used in script (e.g. "Hero").
 * @type string
 *
* @param associatedEventName
 * @text Associated Map Event Name
 * @desc Optional. Links this SpeakerID to a specific Event Name.
 * @type string
 * @default
 *
 * @param name
 * @text Display Name
 * @type string
 *
 * @param nameColor
 * @text Name Color
 * @type number
 * @default 0
 *
 * @param faceFile
 * @text Face Image
 * @type file
 * @dir img/faces
 *
 * @param faceIndex
 * @text Face Index
 * @type number
 * @default 0
 *
 * @param bustSettings
 * @text --- Bust / Tachie ---
 *
 * @param bustFile
 * @parent bustSettings
 * @text Bust Image
 * @type file
 * @dir img/pictures
 *
 * @param picId
 * @parent bustSettings
 * @text Picture ID
 * @type number
 * @default 1
 *
 * @param bustX
 * @parent bustSettings
 * @text Position X
 * @type number
 * @default 400
 *
 * @param bustY
 * @parent bustSettings
 * @text Position Y
 * @type number
 * @default 600
 *
 * @param bustScale
 * @parent bustSettings
 * @text Scale %
 * @type number
 * @default 100
 *
 * @param windowSettings
 * @text --- Window ---
 *
 * @param background
 * @parent windowSettings
 * @text Background
 * @type select
 * @option Window
 * @value 0
 * @option Dim
 * @value 1
 * @option Transparent
 * @value 2
 * @default 0
 *
 * @param position
 * @parent windowSettings
 * @text Position
 * @type select
 * @option Top
 * @value 0
 * @option Middle
 * @value 1
 * @option Bottom
 * @value 2
 * @default 2
 */

(() => {
    const pluginName = "Kadajah_DialogueSceneMaker";
    const parameters = PluginManager.parameters(pluginName);

    const autoDimBusts = (parameters["autoDim"] === "true");
    const clearBustsAfterText = (parameters["clearBustsAfterText"] === "true");
    const bustFadeTime = Number(parameters["bustFadeTime"] || 20);

    const speakerPresets = {};
    const rawPresets = JSON.parse(parameters["speakerPresets"] || "[]");

    rawPresets.forEach(json => {
        const data = JSON.parse(json);
        speakerPresets[data.id] = {
            id: data.id,
            eventName: data.associatedEventName || "",
            name: data.name,
            nameColor: Number(data.nameColor || 0),
            faceName: data.faceFile,
            faceIndex: Number(data.faceIndex || 0),
            bustFile: data.bustFile || "",
            picId: Number(data.picId || 1),
            bustX: Number(data.bustX || 400),
            bustY: Number(data.bustY || 600),
            bustScale: Number(data.bustScale || 100),
            background: Number(data.background || 0),
            positionType: Number(data.position || 2)
        };
    });

    let dummyWindow = null;
    function getDummyWindow() {
        if (!dummyWindow) {
            dummyWindow = new Window_Base(new Rectangle(0, 0, 1, 1));
            dummyWindow.padding = 0;
        }
        return dummyWindow;
    }

    function stripCodes(text) {
        text = text.replace(/\\C\[\d+\]/gi, "");
        text = text.replace(/\\I\[\d+\]/gi, "");
        text = text.replace(/\\\{/g, "").replace(/\\\}/g, "");
        text = text.replace(/\|\d+\|/g, "");
        return text;
    }

    function measureTextWidth(text) {
        const win = getDummyWindow();
        return win.textSizeEx(stripCodes(text)).width;
    }

    function wrapText(text, hasFace) {
        const maxWidth = Graphics.boxWidth - 40 - (hasFace ? 168 : 0);
        const words = text.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + " " + word;
            if (measureTextWidth(testLine) < maxWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    function parseScript(text) {
        const lines = text.split(/[\r\n]+/);
        const segments = [];
        let currentSpeakerID = null;
        let currentBuffer = [];

        const commandRegex = /^\[(WAIT|PAUSE|SE|CE|SWITCH|VAR|BGM|BGS|ME|SCRIPT|LABEL|GOTO|CHOICE|BUST|BUST_OVR|HIDE_BUSTS|FADEOUT|FADEIN|TINT|SHAKE|FLASH|WEATHER|MOVE_TO|MOVE|TURN|JUMP|ANIM|OPACITY|STEP_ANIME|TELEPORT|SPEED|FREQ|WALK_ANIME|DIR_FIX|THROUGH|TRANSPARENT|SCROLL|CAMERA_RESET)\s*(.*)\]$/i;

        const flushBuffer = () => {
            if (currentBuffer.length > 0) {
                segments.push({
                    type: "MSG",
                    speakerID: currentSpeakerID,
                    text: currentBuffer.join(" ")
                });
                currentBuffer = [];
            }
        };

        lines.forEach(line => {
            line = line.trim();
            if (line.length === 0 || line.startsWith("//")) return;

            const cmdMatch = line.match(commandRegex);
            if (cmdMatch) {
                flushBuffer();
                segments.push({
                    type: "CMD",
                    code: cmdMatch[1].toUpperCase(),
                    argsString: cmdMatch[2],
                    argsArray: parseArgs(cmdMatch[2])
                });
                return;
            }

            const speakerMatch = line.match(/^([^:]+):\s*(.*)/);
            if (speakerMatch && speakerPresets[speakerMatch[1]]) {
                flushBuffer();
                currentSpeakerID = speakerMatch[1];
                if (speakerMatch[2].length > 0) {
                    currentBuffer.push(speakerMatch[2]);
                }
            } else {
                currentBuffer.push(line);
            }
        });

        flushBuffer();
        return segments;
    }

    function parseArgs(str) {
        const args = [];
        let current = "";
        let inQuote = false;

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ' ' && !inQuote) {
                if (current.length > 0) args.push(current);
                current = "";
            } else {
                current += char;
            }
        }
        if (current.length > 0) args.push(current);
        return args;
    }

    function processPagination(segments) {
        const finalQueue = [];

        segments.forEach(seg => {
            if (seg.type === "CMD") {
                finalQueue.push(seg);
                return;
            }

            const preset = speakerPresets[seg.speakerID];
            const hasFace = preset && preset.faceName !== "";

            const rawLines = seg.text.split(/\\n/);
            let wrappedLines = [];

            rawLines.forEach(rLine => {
                wrappedLines = wrappedLines.concat(wrapText(rLine, hasFace));
            });

            while (wrappedLines.length > 0) {
                const chunk = wrappedLines.splice(0, 4);
                finalQueue.push({
                    type: "MSG",
                    speaker: preset,
                    text: chunk.join("\n")
                });
            }
        });

        return finalQueue;
    }

    function resolveTarget(interpreter, targetStr) {
        if (!targetStr) return null;

        const upper = String(targetStr).trim().toUpperCase();
        console.log(`[Kadajah] Resolving target identifier for: ${upper}`);

        if (upper === "PLAYER" || upper === "-1") {
            return $gamePlayer;
        }

        if (upper === "THIS" || upper === "0") {
            return $gameMap.event(interpreter.eventId());
        }

        const presetKey = Object.keys(speakerPresets).find(k => k.toUpperCase() === upper);
        if (presetKey && speakerPresets[presetKey].eventName) {
            const evName = speakerPresets[presetKey].eventName.toUpperCase();
            for (const ev of $gameMap.events()) {
                if (ev.event() && ev.event().name && ev.event().name.toUpperCase() === evName) {
                    return ev;
                }
            }
        }

        const events = $gameMap.events();
        for (const ev of events) {
            if (ev.event() && ev.event().name && ev.event().name.toUpperCase() === upper) {
                return ev;
            }
        }

        const id = parseInt(targetStr);
        if (!isNaN(id) && id > 0) {
            return $gameMap.event(id);
        }

        return null;
    }

    const _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function () {
        _Sprite_Picture_update.call(this);
        if (this.picture() && this.picture()._kadajahEffect) {
            const eff = this.picture()._kadajahEffect;
            const time = Graphics.frameCount;
            if (eff === 'FLOAT') {
                this.y += Math.sin(time * 0.05) * 10;
            } else if (eff === 'PULSE') {
                const s = 1 + Math.sin(time * 0.1) * 0.05;
                this.scale.x *= s; this.scale.y *= s;
            } else if (eff === 'GHOST') {
                const baseOp = this.picture().opacity() / 255;
                this.opacity = (128 + Math.sin(time * 0.05) * 127) * baseOp;
                this.blendMode = 1;
            } else if (eff === 'SHAKE') {
                this.x += (Math.random() - 0.5) * 10;
            }
        }
    };

    const _Game_CharacterBase_updateStop = Game_CharacterBase.prototype.updateStop;
    Game_CharacterBase.prototype.updateStop = function () {
        _Game_CharacterBase_updateStop.call(this);
        if (this._kadajahTargetX !== undefined && this._kadajahTargetY !== undefined) {
            if (this.x === this._kadajahTargetX && this.y === this._kadajahTargetY) {
                console.log(`[Kadajah] MOVE_TO Completed! Event reached (${this.x}, ${this.y}).`);
                this._kadajahTargetX = undefined;
                this._kadajahTargetY = undefined;
                this._kadajahStuck = 0;
            } else if (!this.isMoveRouteForcing()) {
                let d = this.findDirectionTo(this._kadajahTargetX, this._kadajahTargetY);
                if (d === 0) {
                    let dx = this.x - this._kadajahTargetX;
                    let dy = this.y - this._kadajahTargetY;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        d = dx > 0 ? 4 : 6;
                    } else if (dy !== 0) {
                        d = dy > 0 ? 8 : 2;
                    }
                }

                if (d > 0) {
                    console.log(`[Kadajah] Event moving towards direction ${d}. (Route target: ${this._kadajahTargetX}, ${this._kadajahTargetY})`);
                    this.moveStraight(d);
                }

                if (!this.isMovementSucceeded()) {
                    this._kadajahStuck = (this._kadajahStuck || 0) + 1;
                    if (this._kadajahStuck % 60 === 0) console.warn(`[Kadajah] Event stuck on map for ${this._kadajahStuck} attempts...`);
                    if (this._kadajahStuck > 300) {
                        console.error(`[Kadajah] MOVE_TO cancelled! Event cannot reach coordinates (${this._kadajahTargetX}, ${this._kadajahTargetY}).`);
                        this._kadajahTargetX = undefined;
                        this._kadajahTargetY = undefined;
                        this._kadajahStuck = 0;
                    }
                } else {
                    this._kadajahStuck = 0;
                }
            }
        }
    };

    PluginManager.registerCommand(pluginName, "startDialogue", function (args) {
        const fullText = JSON.parse(args.scriptText || '""');
        if (!fullText) return;
        startProcessing.call(this, fullText);
    });

    PluginManager.registerCommand(pluginName, "loadDialogueFile", function (args) {
        const filename = args.filename;
        const xhr = new XMLHttpRequest();
        const url = `data/dialogues/${filename}.txt`;

        this._waitMode = 'kadajah_file_loading';

        xhr.open('GET', url);
        xhr.overrideMimeType('text/plain');
        xhr.onload = () => {
            if (xhr.status < 400) {
                startProcessing.call(this, xhr.responseText);
            } else {
                console.error(`Kadajah Dialogue: File not found (${url})`);
                this._waitMode = '';
            }
        };
        xhr.onerror = () => {
            console.error(`Kadajah Dialogue: Error loading (${url})`);
            this._waitMode = '';
        };
        xhr.send();
    });

    function startProcessing(text) {
        const queue = parseScript(text);
        this._kadajahDialogueQueue = processPagination(queue);
        this._kadajahAnimWait = false;
        this._kadajahAnimTarget = null;
        this._kadajahWaitingForText = false;
        this._waitMode = "kadajah_dialogue";
    }

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'kadajah_file_loading') {
            return true;
        }

        if (this._waitMode === "kadajah_dialogue") {
            if (this._waitCount > 0) {
                return true;
            }

            const isMessageBusy = $gameMessage.isBusy() || $gameMessage.isChoice();

            if (this._kadajahWaitingForText) {
                if (isMessageBusy) {
                    return true;
                } else {
                    if (clearBustsAfterText) {
                        hideAllBusts();
                    }
                    this._kadajahWaitingForText = false;
                }
            } else {
                if (isMessageBusy) return true;
            }

            if (this._kadajahAnimWait) {
                if (this._kadajahAnimTarget && typeof this._kadajahAnimTarget.isAnimationPlaying === 'function') {
                    if (this._kadajahAnimTarget.isAnimationPlaying()) {
                        return true;
                    }
                }
                this._kadajahAnimWait = false;
                this._kadajahAnimTarget = null;
            }

            if (this._kadajahScrollWait) {
                if ($gameMap.isScrolling()) return true;
                this._kadajahScrollWait = false;
            }

            if (this._kadajahMoveWait) {
                if (this._kadajahMoveTarget && (this._kadajahMoveTarget.isMoveRouteForcing() || this._kadajahMoveTarget._kadajahTargetX !== undefined)) {
                    return true;
                }
                console.log(`[Kadajah] Event movement completed. Exiting WAIT time.`);
                this._kadajahMoveWait = false;
                this._kadajahMoveTarget = null;
            }

            let safetyLoop = 0;
            while (this._kadajahDialogueQueue && this._kadajahDialogueQueue.length > 0) {
                if (safetyLoop++ > 100) {
                    console.error("Kadajah Dialogue: Infinite Loop detected.");
                    return false;
                }

                const node = this._kadajahDialogueQueue[0];

                if (node.type === "MSG") {
                    console.log(`[Kadajah] Processing MSG - Speaker: ${node.speaker ? node.speaker.name : "Narrator"}`);
                    this._kadajahDialogueQueue.shift();
                    const speaker = node.speaker;

                    for (const i of [21, 22]) {
                        if (!speaker || i !== speaker.picId) {
                            const p = $gameScreen.picture(i);
                            if (p && p.name() && p.opacity() > 0) {
                                p.move(p.origin(), p.x(), p.y(), p.scaleX(), p.scaleY(), 0, p.blendMode(), bustFadeTime);
                                p._kadajahEffect = null;
                            }
                        }
                    }

                    setupMessageWindow(speaker, node.text);
                    if (speaker) {
                        updateBusts(speaker, []);
                    }
                    this._kadajahWaitingForText = true;
                    return true;
                } else if (node.type === "CMD") {
                    console.log(`[Kadajah] Processing CMD - Code read: [${node.code} ${node.argsString}]`);
                    this._kadajahDialogueQueue.shift();
                    const shouldWait = executeInlineCommand.call(this, node);
                    if (shouldWait) {
                        return true;
                    }
                }
            }

            this._waitMode = "";
            return false;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };

    function setupMessageWindow(speaker, text) {
        text = text.replace(/\|(\d+)\|/g, (_, frames) => {
            const waits = Math.floor(Number(frames) / 15);
            return "\\.".repeat(waits || 1);
        });

        if (speaker) {
            const finalFace = speaker.tempFace !== undefined && speaker.tempFace !== "" ? speaker.tempFace : speaker.faceName;
            const finalFaceIdx = speaker.tempFaceIdx !== undefined && speaker.tempFaceIdx !== "" ? Number(speaker.tempFaceIdx) : speaker.faceIndex;

            $gameMessage.setFaceImage(finalFace, finalFaceIdx);

            speaker.tempFace = "";
            speaker.tempFaceIdx = "";
            $gameMessage.setBackground(speaker.background);
            $gameMessage.setPositionType(speaker.positionType);

            let nameText = speaker.name;
            if (speaker.nameColor > 0) {
                nameText = `\\C[${speaker.nameColor}]${nameText}\\C[0]`;
            }
            $gameMessage.setSpeakerName(nameText);
        } else {
            $gameMessage.setFaceImage("", 0);
            $gameMessage.setSpeakerName("");
            $gameMessage.setBackground(0);
            $gameMessage.setPositionType(2);
        }

        $gameMessage.add(text);
    }

    function updateBusts(activeSpeaker, extraArgs) {
        const finalBust = activeSpeaker.tempBust !== undefined && activeSpeaker.tempBust !== "" ? activeSpeaker.tempBust : activeSpeaker.bustFile;
        if (!activeSpeaker || !finalBust) return;

        const isDialogueCall = (!extraArgs || extraArgs.length === 0);
        if (isDialogueCall && activeSpeaker._lastBustUpdateFrame === Graphics.frameCount) {
            return;
        }
        activeSpeaker._lastBustUpdateFrame = Graphics.frameCount;

        const pId = activeSpeaker.picId;
        const pic = $gameScreen.picture(pId);

        let isMirror = false;
        let animType = "FADE";

        let duration = bustFadeTime;
        if (extraArgs && extraArgs.length > 0) {
            extraArgs.forEach(arg => {
                const upper = arg.toUpperCase();
                if (upper === "MIRROR") isMirror = true;
                else if (["SLIDE_LEFT", "SLIDE_RIGHT", "SLIDE_UP", "POP", "INSTANT", "FADE", "SHAKE", "HIT", "FLOAT", "PULSE", "GHOST"].includes(upper)) {
                    animType = upper;
                }
                else if (!isNaN(parseInt(arg))) {
                    duration = parseInt(arg);
                }
            });
        }

        let isSameImage = pic && pic.name() === finalBust;
        let existingEffect = null;

        if (isSameImage && (!extraArgs || extraArgs.length === 0)) {
            if (['FLOAT', 'PULSE', 'GHOST'].includes(pic._kadajahEffect)) {
                existingEffect = pic._kadajahEffect;
            }
            isMirror = pic.scaleX() < 0;
        }

        const scaleX = activeSpeaker.bustScale * (isMirror ? -1 : 1);
        const scaleY = activeSpeaker.bustScale;
        const targetX = activeSpeaker.bustX;
        const targetY = activeSpeaker.bustY;

        let startX = targetX;
        let startY = targetY;
        let startScaleX = scaleX;
        let startScaleY = scaleY;
        let startOpacity = 0;

        if (isSameImage && (!extraArgs || extraArgs.length === 0)) {
            startX = pic.x();
            startY = pic.y();
            startScaleX = pic.scaleX();
            startScaleY = pic.scaleY();
            startOpacity = pic.opacity();
        }

        if (animType === "SLIDE_LEFT") startX = targetX + 50;
        if (animType === "SLIDE_RIGHT") startX = targetX - 50;
        if (animType === "SLIDE_UP") startY = targetY + 50;
        if (animType === "POP") {
            startScaleX = 0;
            startScaleY = 0;
        }
        if (animType === "INSTANT") duration = 1;

        $gameScreen.showPicture(
            pId,
            finalBust,
            1,
            startX,
            startY,
            startScaleX,
            startScaleY,
            startOpacity,
            0
        );

        activeSpeaker.tempBust = "";

        const p = $gameScreen.picture(pId);
        if (p) {
            p.move(1, targetX, targetY, scaleX, scaleY, 255, 0, duration);
        }

        if (extraArgs && extraArgs.length > 0) {
            if (["FLOAT", "PULSE", "GHOST", "SHAKE"].includes(animType)) {
                p._kadajahEffect = animType;
            } else if (animType === "HIT") {
                p._kadajahEffect = null;
                $gameScreen.tintPicture(pId, [255, 255, 255, 170], 5);
                setTimeout(() => $gameScreen.tintPicture(pId, [0, 0, 0, 0], 10), 100);
            } else {
                p._kadajahEffect = null;
            }
        } else {
            p._kadajahEffect = existingEffect;
        }

        if (autoDimBusts) {
            for (const i of [21, 22]) {
                const pDim = $gameScreen.picture(i);
                if (pDim && pDim.name()) {
                    if (i === pId) {
                        $gameScreen.tintPicture(i, [0, 0, 0, 0], duration);
                    } else {
                        $gameScreen.tintPicture(i, [-80, -80, -80, 0], duration);
                    }
                }
            }
        }
    }

    function hideAllBusts() {
        for (const i of [21, 22]) {
            const p = $gameScreen.picture(i);
            if (p && p.name() && p.opacity() > 0) {
                p.move(p.origin(), p.x(), p.y(), p.scaleX(), p.scaleY(), 0, p.blendMode(), bustFadeTime);
                p._kadajahEffect = null;
            }
        }
    }

    function jumpToLabel(labelName) {
        const queue = this._kadajahDialogueQueue;
        const index = queue.findIndex(node => node.type === "CMD" && node.code === "LABEL" && node.argsString === labelName);

        if (index !== -1) {
            queue.splice(0, index + 1);
        }
    }

    function executeInlineCommand(node) {
        const args = node.argsArray;
        const rawArgs = node.argsString;

        switch (node.code) {
            case "WAIT":
                this.wait(parseInt(args[0]));
                return true;
            case "PAUSE":
                this.wait(1);
                return true;
            case "LABEL":
                return false;
            case "GOTO":
                jumpToLabel.call(this, args[0]);
                return false;

            case "CHOICE":
                const choices = [];
                const jumpLabels = [];
                for (let i = 0; i < args.length; i += 2) {
                    jumpLabels.push(args[i]);
                    choices.push(args[i + 1]);
                }
                $gameMessage.setChoices(choices, 0, -1);
                $gameMessage.setBackground(0);
                $gameMessage.setPositionType(1);
                $gameMessage.setChoiceCallback((n) => {
                    const label = jumpLabels[n];
                    if (label) jumpToLabel.call(this, label);
                });
                return true;

            case "MOVE":
                const mTarget = resolveTarget(this, args[0]);
                const mDirStr = (args[1] || "").toUpperCase();
                const mWait = args.some(a => String(a).toUpperCase() === "WAIT");
                if (mTarget) {
                    let code = 0;
                    if (mDirStr === "UP") code = 4;
                    else if (mDirStr === "DOWN") code = 1;
                    else if (mDirStr === "LEFT") code = 2;
                    else if (mDirStr === "RIGHT") code = 3;
                    else if (mDirStr === "TOWARD") code = 10;
                    else if (mDirStr === "AWAY") code = 11;
                    else if (mDirStr === "FORWARD") code = 12;
                    else if (mDirStr === "BACK") code = 13;

                    if (code > 0) {
                        mTarget.forceMoveRoute({ list: [{ code: code }, { code: 0 }], repeat: false, skippable: true, wait: false });
                        if (mWait) {
                            this._kadajahMoveTarget = mTarget;
                            this._kadajahMoveWait = true;
                            return true;
                        }
                    }
                }
                return false;

            case "MOVE_TO":
                const mTarget2 = resolveTarget(this, args[0]);
                const toX = parseInt(args[1]);
                const toY = parseInt(args[2]);
                const mtWait = args.some(a => String(a).toUpperCase() === "WAIT");

                if (mTarget2 && !isNaN(toX) && !isNaN(toY)) {
                    console.log(`[Kadajah] MOVE_TO Command processed -> Target: ${args[0]} | Coordinates X:${toX} Y:${toY} | Wait: ${mtWait}`);
                    mTarget2._kadajahTargetX = toX;
                    mTarget2._kadajahTargetY = toY;
                    mTarget2._kadajahStuck = 0;

                    if (mtWait) {
                        this._kadajahMoveTarget = mTarget2;
                        this._kadajahMoveWait = true;
                        return true;
                    }
                } else {
                    console.error(`[Kadajah] MOVE_TO Command failed: Target '${args[0]}' not found or coordinates are invalid.`);
                }
                return false;

            case "TURN":
                const tTarget = resolveTarget(this, args[0]);
                const tDirStr = (args[1] || "").toUpperCase();
                if (tTarget) {
                    if (tDirStr === "UP") tTarget.setDirection(8);
                    else if (tDirStr === "DOWN") tTarget.setDirection(2);
                    else if (tDirStr === "LEFT") tTarget.setDirection(4);
                    else if (tDirStr === "RIGHT") tTarget.setDirection(6);
                    else if (tDirStr === "TOWARD") tTarget.turnTowardPlayer();
                    else if (tDirStr === "AWAY") tTarget.turnAwayFromPlayer();
                    else if (tDirStr === "180") tTarget.turn180();
                    else if (tDirStr === "R") tTarget.turnRight90();
                    else if (tDirStr === "L") tTarget.turnLeft90();
                }
                return false;

            case "JUMP":
                const jTarget = resolveTarget(this, args[0]);
                const jTargetX = parseInt(args[1] || 0);
                const jTargetY = parseInt(args[2] || 0);
                const jWait = args.some(a => String(a).toUpperCase() === "WAIT");
                if (jTarget) {
                    const offsetX = jTargetX - jTarget.x;
                    const offsetY = jTargetY - jTarget.y;
                    jTarget.forceMoveRoute({ list: [{ code: 14, parameters: [offsetX, offsetY] }, { code: 0 }], repeat: false, skippable: true, wait: false });
                    if (jWait) {
                        this._kadajahMoveTarget = jTarget;
                        this._kadajahMoveWait = true;
                        return true;
                    }
                }
                return false;

            case "TELEPORT":
                const tpTarget = resolveTarget(this, args[0]);
                const tpX = parseInt(args[1] || 0);
                const tpY = parseInt(args[2] || 0);
                if (tpTarget) {
                    tpTarget.locate(tpX, tpY);
                }
                return false;

            case "SPEED":
                const spTarget = resolveTarget(this, args[0]);
                const spVal = parseInt(args[1]);
                if (spTarget && !isNaN(spVal)) {
                    spTarget.setMoveSpeed(spVal);
                }
                return false;

            case "FREQ":
                const frTarget = resolveTarget(this, args[0]);
                const frVal = parseInt(args[1]);
                if (frTarget && !isNaN(frVal)) {
                    frTarget.setMoveFrequency(frVal);
                }
                return false;

            case "OPACITY":
                const oTarget = resolveTarget(this, args[0]);
                const oVal = parseInt(args[1]);
                if (oTarget && !isNaN(oVal)) {
                    oTarget.setOpacity(oVal);
                }
                return false;

            case "WALK_ANIME":
                const waTarget = resolveTarget(this, args[0]);
                const waState = (args[1] || "").toUpperCase() === "ON";
                if (waTarget) {
                    waTarget.setWalkAnime(waState);
                }
                return false;

            case "STEP_ANIME":
                const saTarget = resolveTarget(this, args[0]);
                const saState = (args[1] || "").toUpperCase() === "ON";
                if (saTarget) {
                    saTarget.setStepAnime(saState);
                }
                return false;

            case "DIR_FIX":
                const dfTarget = resolveTarget(this, args[0]);
                const dfState = (args[1] || "").toUpperCase() === "ON";
                if (dfTarget) {
                    dfTarget.setDirectionFix(dfState);
                }
                return false;

            case "THROUGH":
                const thTarget = resolveTarget(this, args[0]);
                const thState = (args[1] || "").toUpperCase() === "ON";
                if (thTarget) {
                    thTarget.setThrough(thState);
                }
                return false;

            case "TRANSPARENT":
                const trTarget = resolveTarget(this, args[0]);
                const trState = (args[1] || "").toUpperCase() === "ON";
                if (trTarget) {
                    trTarget.setTransparent(trState);
                }
                return false;

            case "ANIM":
                const animId = parseInt(args[0]);
                const aTarget = resolveTarget(this, args[1]);
                const aWait = (args[2] || "").toUpperCase() === "TRUE";
                if (aTarget) {
                    $gameTemp.requestAnimation([aTarget], animId);
                    if (aWait) {
                        this._kadajahAnimTarget = aTarget;
                        this._kadajahAnimWait = true;
                        return true;
                    }
                }
                return false;

            case "FADEOUT":
                const foDur = parseInt(args[0]) || 60;
                $gameScreen.startFadeOut(foDur);
                this.wait(foDur);
                return true;
            case "FADEIN":
                const fiDur = parseInt(args[0]) || 60;
                $gameScreen.startFadeIn(fiDur);
                this.wait(fiDur);
                return true;
            case "TINT":
                const tR = parseInt(args[0]) || 0;
                const tG = parseInt(args[1]) || 0;
                const tB = parseInt(args[2]) || 0;
                const tGr = parseInt(args[3]) || 0;
                const tDur = parseInt(args[4]) || 60;
                $gameScreen.startTint([tR, tG, tB, tGr], tDur);
                return false;
            case "SHAKE":
                $gameScreen.startShake(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
                return false;
            case "FLASH":
                $gameScreen.startFlash([parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), parseInt(args[3])], parseInt(args[4]));
                return false;
            case "WEATHER":
                $gameScreen.changeWeather(args[0].toLowerCase(), parseInt(args[1]), parseInt(args[2]));
                return false;

            case "SE":
                AudioManager.playSe({ name: args[0], volume: parseInt(args[1] || 90), pitch: parseInt(args[2] || 100), pan: parseInt(args[3] || 0) });
                return false;
            case "BGM":
                if (args[0].toUpperCase() === "STOP") AudioManager.stopBgm();
                else AudioManager.playBgm({ name: args[0], volume: parseInt(args[1] || 90), pitch: parseInt(args[2] || 100), pan: parseInt(args[3] || 0) });
                return false;
            case "BGS":
                if (args[0].toUpperCase() === "STOP") AudioManager.stopBgs();
                else AudioManager.playBgs({ name: args[0], volume: parseInt(args[1] || 90), pitch: parseInt(args[2] || 100), pan: parseInt(args[3] || 0) });
                return false;

            case "SWITCH":
                $gameSwitches.setValue(parseInt(args[0]), (args[1] || "").toUpperCase() === "ON");
                return false;
            case "VAR":
                $gameVariables.setValue(parseInt(args[0]), Number(args[1]));
                return false;
            case "CE":
                const commonEvent = $dataCommonEvents[parseInt(args[0])];
                if (commonEvent) {
                    this.setupChild(commonEvent.list, 0);
                    return true;
                }
                return false;
            case "SCRIPT":
                try { eval(rawArgs); } catch (e) { console.error(e); }
                return false;
            case "BUST":
                const preset = speakerPresets[args[0]];
                if (preset) updateBusts(preset, args.slice(1));
                return false;
            case "FACE_OVR":
                if (speakerPresets[args[0]]) {
                    speakerPresets[args[0]].tempFace = args[1];
                    speakerPresets[args[0]].tempFaceIdx = args[2] || 0;
                }
                return false;
            case "BUST_OVR":
                if (speakerPresets[args[0]]) {
                    speakerPresets[args[0]].tempBust = args[1];
                }
                return false;
            case "HIDE_BUSTS":
                hideAllBusts();
                return false;

            case "SCROLL":
                const sDirStr = (args[0] || "").toUpperCase();
                let sDir = 2;
                if (sDirStr === "UP") sDir = 8;
                else if (sDirStr === "DOWN") sDir = 2;
                else if (sDirStr === "LEFT") sDir = 4;
                else if (sDirStr === "RIGHT") sDir = 6;

                const sDist = parseInt(args[1] || 5);
                const sSpeed = parseInt(args[2] || 4);
                const sWait = args.some(a => String(a).toUpperCase() === "WAIT");

                $gameMap.startScroll(sDir, sDist, sSpeed);
                if (sWait) {
                    this._kadajahScrollWait = true;
                    return true;
                }
                return false;

            case "CAMERA_RESET":
                $gamePlayer.center($gamePlayer.x, $gamePlayer.y);
                return false;
        }
        return false;
    }


    // =========================================================================
    // Skinny Promise - Existing Show Text -> Kadajah Auto Bust Bridge v2
    // =========================================================================
    // IMPORTANT:
    // The visual HTML editor only writes presets into js/plugins.js when its
    // DOWNLOAD ZIP output is applied. To prevent partial preset state from
    // causing only one character to appear, this bridge uses the user's
    // confirmed per-character values below as the authoritative layout.
    // =========================================================================

    const _spBustSpeakerAliases = {
        "안티고네": "Antigone",
        "이스메네": "Ismene",
        "비아": "Bia",
        "탈로스": "Talos",
        "아가멤논": "Agamemnon",
        "탈로스 부인": "Taloswife",
        "페메": "peme",
        "헤스티아": "Hestia",
        "에르가네": "Ergane",
        "팔라메데스": "Palamedes",
        "판": "Pan",
        "에코": "Echo"
};

    const _spBustEmotionMap = {
        "Antigone": {
                "0": "Antigone_neutral",
                "1": "Antigone_excited",
                "2": "Antigone_angry_determined",
                "3": "Antigone_surprised",
                "4": "Antigone_uncertain",
                "5": "Antigone_worried",
                "6": "Antigone_thinking",
                "7": "Antigone_sad"
        },
        "Ismene": {
                "0": "Ismene_neutral",
                "1": "Ismene_awkward_smile",
                "2": "Ismene_embarrassed",
                "3": "Ismene_panicked_stop",
                "4": "Ismene_surprised",
                "5": "Ismene_sad",
                "6": "Ismene_pleading",
                "7": "Ismene_thinking"
        },
        "Bia": {
                "0": "Bia_stern",
                "1": "Bia_thinking",
                "2": "Bia_surprised",
                "3": "Bia_shouting_stop",
                "4": "Bia_dejected",
                "5": "Bia_annoyed"
        },
        "Talos": {
                "0": "Talos_neutral",
                "1": "Talos_relieved",
                "2": "Talos_angry",
                "3": "Talos_embarrassed",
                "4": "Talos_earnest",
                "5": "Talos_apologetic",
                "6": "Talos_shocked"
        },
        "Agamemnon": {
                "0": "Agamemnon_neutral",
                "1": "Agamemnon_reassuring",
                "2": "Agamemnon_angry_accusing",
                "3": "Agamemnon_worried",
                "4": "Agamemnon_thinking",
                "5": "Agamemnon_remorseful",
                "6": "Agamemnon_worried"
        },
        "Taloswife": {
                "0": "Taloswife_gentle_smile",
                "2": "Taloswife_firm_instructing",
                "3": "Taloswife_surprised",
                "4": "Taloswife_worried",
                "5": "Taloswife_gentle_smile"
        },
        "peme": {
                "0": "Peme_neutral",
                "1": "Peme_thinking",
                "2": "Peme_stern",
                "3": "Peme_shocked",
                "4": "Peme_earnest",
                "5": "Peme_explaining",
                "6": "Peme_thinking"
        },
        "Hestia": {
                "0": "Hestia_neutral",
                "1": "Hestia_surprised",
                "2": "Hestia_reassuring",
                "3": "Hestia_worried",
                "4": "Hestia_reassuring",
                "5": "Hestia_worried"
        },
        "Ergane": {
                "0": "Ergane_assertive",
                "1": "Ergane_instructing",
                "2": "Ergane_angry_accusing",
                "3": "Ergane_surprised",
                "5": "Ergane_exasperated"
        },
        "Palamedes": {
                "0": "Palamedes_neutral",
                "1": "Palamedes_calm",
                "2": "Palamedes_stern"
        },
        "Pan": {
                "0": "Pan_neutral",
                "1": "Pan_shy",
                "2": "Pan_explaining",
                "3": "Pan_panicked",
                "4": "Pan_worried"
        },
        "Echo": {
                "0": "Echo_excited",
                "1": "Echo_tearful",
                "2": "Echo_neutral",
                "3": "Echo_panicked",
                "4": "Echo_cheerful",
                "5": "Echo_worried",
                "6": "Echo_crying"
        }
};

    const _spBustGardenEmotionMap = {
        "Antigone": {
            "0":"Antigone_garden_guarded",
            "1":"Antigone_garden_confident",
            "2":"Antigone_garden_determined",
            "3":"Antigone_garden_panicked",
            "4":"Antigone_garden_thinking",
            "5":"Antigone_garden_pleading",
            "6":"Antigone_garden_thinking"
        },
        "Ismene": {
            "0":"Ismene_garden_neutral",
            "1":"Ismene_garden_awkward_smile",
            "2":"Ismene_garden_awkward_smile",
            "3":"Ismene_garden_panicked_stop",
            "4":"Ismene_garden_surprised",
            "5":"Ismene_garden_pleading",
            "6":"Ismene_garden_pleading",
            "7":"Ismene_garden_anxious"
        }
    };

    function _spBustUseGardenCostume(speakerId) {
        if (speakerId !== "Antigone" && speakerId !== "Ismene") return false;
        if (typeof $gameSwitches === "undefined" || !$gameSwitches) return false;
        // 92: 정원 관리복 변장중 / 101: 비아 발각 장면 완료
        return $gameSwitches.value(92) && !$gameSwitches.value(101);
    }

    const _spBustPresetOverrides = {
        "Antigone": {
                "picId": 21,
                "x": 900,
                "y": 500,
                "scale": 75
        },
        "Ismene": {
                "picId": 21,
                "x": 900,
                "y": 500,
                "scale": 75
        },
        "Bia": {
                "picId": 22,
                "x": 900,
                "y": 564,
                "scale": 100
        },
        "Talos": {
                "picId": 22,
                "x": 900,
                "y": 494,
                "scale": 99
        },
        "Agamemnon": {
                "picId": 22,
                "x": 900,
                "y": 530,
                "scale": 105
        },
        "Taloswife": {
                "picId": 22,
                "x": 900,
                "y": 534,
                "scale": 85
        },
        "peme": {
                "picId": 22,
                "x": 900,
                "y": 631,
                "scale": 115
        },
        "Hestia": {
                "picId": 22,
                "x": 900,
                "y": 562,
                "scale": 60
        },
        "Ergane": {
                "picId": 22,
                "x": 900,
                "y": 600,
                "scale": 110
        },
        "Palamedes": {
                "picId": 22,
                "x": 900,
                "y": 520,
                "scale": 100
        },
        "Pan": {
                "picId": 22,
                "x": 900,
                "y": 520,
                "scale": 95
        },
        "Echo": {
                "picId": 22,
                "x": 900,
                "y": 500,
                "scale": 78
        }
};

    const _spBustState = {
        picId: 0,
        speakerId: "",
        pendingHideFrames: 0,
        pendingErasePicId: 0,
        pendingEraseFrames: 0
    };

    // CG/문서 전체화면 장면에서 자동 큰 일러스트를 일시 중지하는 스위치.
    // 204 ON: 현재 자동 Bust를 닫고 새 Bust 표시를 막음.
    // 204 OFF: 다음 일반 대사부터 다시 자동 표시.
    const _spBustDisableSwitchId = 204;

    function _spBustAutoDisabled() {
        return _spBustDisableSwitchId > 0 &&
               typeof $gameSwitches !== "undefined" &&
               $gameSwitches &&
               $gameSwitches.value(_spBustDisableSwitchId);
    }

    function _spBustResolveSpeaker(params) {
        if (!params) return null;

        const speakerName = String(params[4] || "").trim();
        const faceName = String(params[0] || "").trim();
        let speakerId = _spBustSpeakerAliases[speakerName];

        if (!speakerId) speakerId = _spBustSpeakerAliases[faceName];
        if (!speakerId) return null;

        const layout = _spBustPresetOverrides[speakerId];
        if (!layout) return null;

        return {
            speakerId: speakerId,
            faceIndex: Number(params[1] || 0),
            layout: layout
        };
    }

    function _spBustCancelPendingErase() {
        _spBustState.pendingErasePicId = 0;
        _spBustState.pendingEraseFrames = 0;
    }

    function _spBustErasePreviousIfNeeded(newPicId) {
        if (_spBustState.picId > 0 && _spBustState.picId !== newPicId) {
            $gameScreen.erasePicture(_spBustState.picId);
        }

        if (_spBustState.pendingErasePicId > 0 &&
            _spBustState.pendingErasePicId !== newPicId) {
            $gameScreen.erasePicture(_spBustState.pendingErasePicId);
        }

        _spBustCancelPendingErase();
    }


    const _spBustInlineTagRegex = /\[\[\s*BUST\s*:\s*([^\]]+?)\s*\]\]/ig;

    function _spBustParseInlineOverrideValue(rawValue) {
        const value = String(rawValue || "").trim();
        if (!value) return null;

        const upper = value.toUpperCase();
        if (["AUTO", "RESET", "DEFAULT"].includes(upper)) {
            return { mode: "auto", value: "" };
        }
        if (["NONE", "OFF", "HIDE"].includes(upper)) {
            return { mode: "hide", value: "" };
        }
        return { mode: "file", value: value };
    }

    function _spBustPatchMessageLinesForInlineBust(interpreter) {
        if (!interpreter || !interpreter._list) {
            return { override: null, changes: [] };
        }

        const changes = [];
        let override = null;
        let idx = interpreter._index + 1;

        while (idx < interpreter._list.length) {
            const command = interpreter._list[idx];
            if (!command || command.code !== 401 || !command.parameters) break;

            const originalText = String(command.parameters[0] || "");
            let cleanedText = originalText;
            let match;

            _spBustInlineTagRegex.lastIndex = 0;
            while ((match = _spBustInlineTagRegex.exec(originalText)) !== null) {
                if (!override) {
                    override = _spBustParseInlineOverrideValue(match[1]);
                }
            }

            cleanedText = cleanedText.replace(_spBustInlineTagRegex, "");
            cleanedText = cleanedText.replace(/^\s+/, "").replace(/\s+$/, "");

            if (cleanedText !== originalText) {
                changes.push({ command: command, originalText: originalText });
                command.parameters[0] = cleanedText;
            }

            idx += 1;
        }

        return { override: override, changes: changes };
    }

    function _spBustRestorePatchedMessageLines(patchInfo) {
        if (!patchInfo || !patchInfo.changes) return;
        for (const change of patchInfo.changes) {
            if (change && change.command && change.command.parameters) {
                change.command.parameters[0] = change.originalText;
            }
        }
    }

    function _spBustShow(resolved) {
        if (!resolved) return;

        const imageMap = _spBustUseGardenCostume(resolved.speakerId)
            ? (_spBustGardenEmotionMap[resolved.speakerId] || {})
            : (_spBustEmotionMap[resolved.speakerId] || {});
        const bustFile = resolved.directBustFile
            ? String(resolved.directBustFile).trim()
            : imageMap[String(resolved.faceIndex)];
        if (!bustFile) return;

        const layout = resolved.layout;
        const picId = Number(layout.picId);
        const x = Number(layout.x);
        const y = Number(layout.y);
        const scale = Number(layout.scale);

        _spBustErasePreviousIfNeeded(picId);
        _spBustState.pendingHideFrames = 0;

        const oldPic = $gameScreen.picture(picId);
        const sameImage = oldPic && oldPic.name() === bustFile && oldPic.opacity() > 0;
        const startX = sameImage ? x : x + 60;
        const opacity = sameImage ? oldPic.opacity() : 0;

        $gameScreen.showPicture(
            picId,
            bustFile,
            1,
            startX,
            y,
            scale,
            scale,
            opacity,
            0
        );

        const pic = $gameScreen.picture(picId);
        if (pic) {
            pic.move(
                1,
                x,
                y,
                scale,
                scale,
                255,
                0,
                sameImage ? 1 : bustFadeTime
            );
        }

        _spBustState.picId = picId;
        _spBustState.speakerId = resolved.speakerId;
    }

    function _spBustBeginHide() {
        const picId = Number(_spBustState.picId || 0);
        if (picId <= 0) return;

        const pic = $gameScreen.picture(picId);
        if (pic && pic.opacity() > 0) {
            pic.move(
                pic.origin(),
                pic.x(),
                pic.y(),
                pic.scaleX(),
                pic.scaleY(),
                0,
                pic.blendMode(),
                bustFadeTime
            );

            _spBustState.pendingErasePicId = picId;
            _spBustState.pendingEraseFrames = Math.max(2, bustFadeTime + 2);
        }

        _spBustState.picId = 0;
        _spBustState.speakerId = "";
        _spBustState.pendingHideFrames = 0;
    }

    const _spBust_GameInterpreter_command101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function(params) {
        const inlineBustPatch = _spBustPatchMessageLinesForInlineBust(this);
        const inlineOverride = inlineBustPatch.override;
        const resolved = _spBustResolveSpeaker(params);

        try {
            if (resolved) {
                if (_spBustAutoDisabled()) {
                    if (_spBustState.picId > 0) {
                        _spBustBeginHide();
                    }
                    const messageParams = params.slice();
                    messageParams[0] = "";
                    return _spBust_GameInterpreter_command101.call(this, messageParams);
                }

                if (inlineOverride && inlineOverride.mode === "hide") {
                    if (_spBustState.picId > 0) {
                        _spBustBeginHide();
                    }
                } else if (inlineOverride && inlineOverride.mode === "file") {
                    const directResolved = Object.assign({}, resolved, {
                        directBustFile: inlineOverride.value
                    });
                    _spBustShow(directResolved);
                } else {
                    _spBustShow(resolved);
                }

                const messageParams = params.slice();
                messageParams[0] = "";
                return _spBust_GameInterpreter_command101.call(this, messageParams);
            } else if (_spBustState.picId > 0) {
                _spBustBeginHide();
            }

            return _spBust_GameInterpreter_command101.call(this, params);
        } finally {
            _spBustRestorePatchedMessageLines(inlineBustPatch);
        }
    };

    const _spBust_WindowMessage_terminateMessage =
        Window_Message.prototype.terminateMessage;

    Window_Message.prototype.terminateMessage = function() {
        _spBust_WindowMessage_terminateMessage.call(this);

        if (_spBustState.picId > 0) {
            _spBustState.pendingHideFrames = 3;
        }
    };

    const _spBust_SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _spBust_SceneMap_update.call(this);

        if (_spBustAutoDisabled() && _spBustState.picId > 0) {
            _spBustBeginHide();
        }

        if (_spBustState.pendingHideFrames > 0) {
            _spBustState.pendingHideFrames--;

            if (_spBustState.pendingHideFrames <= 0 &&
                !$gameMessage.isBusy()) {
                _spBustBeginHide();
            }
        }

        if (_spBustState.pendingEraseFrames > 0) {
            _spBustState.pendingEraseFrames--;

            if (_spBustState.pendingEraseFrames <= 0) {
                const eraseId = _spBustState.pendingErasePicId;

                if (eraseId > 0 && eraseId !== _spBustState.picId) {
                    $gameScreen.erasePicture(eraseId);
                }

                _spBustCancelPendingErase();
            }
        }
    };

    const _spBust_GameInterpreter_command201 = Game_Interpreter.prototype.command201;
    Game_Interpreter.prototype.command201 = function(params) {
        if (_spBustState.picId > 0) {
            $gameScreen.erasePicture(_spBustState.picId);
        }

        if (_spBustState.pendingErasePicId > 0) {
            $gameScreen.erasePicture(_spBustState.pendingErasePicId);
        }

        _spBustState.picId = 0;
        _spBustState.speakerId = "";
        _spBustState.pendingHideFrames = 0;
        _spBustCancelPendingErase();

        return _spBust_GameInterpreter_command201.call(this, params);
    };

})();
