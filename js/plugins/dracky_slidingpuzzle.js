//=============================================================================
// Dracky Plugins - Sliding Puzzle
// dracky_slidingpuzzle.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0] Sliding tile puzzle minigame
 * @author Dracky Plugins
 * @url http://drackyplugins.itch.io/
 *
 * @param tileSize
 * @text Tile Size
 * @desc Size of each tile in pixels
 * @type number
 * @min 64
 * @max 256
 * @default 128
 *
 * @param tileSpacing
 * @text Tile Spacing
 * @desc Spacing between tiles in pixels
 * @type number
 * @min 0
 * @max 20
 * @default 4
 *
 * @param slideAnimationSpeed
 * @text Slide Animation Speed
 * @desc Speed of slide animation in frames (lower = faster)
 * @type number
 * @min 3
 * @max 20
 * @default 8
 *
 * @param shuffleMoves
 * @text Shuffle Moves
 * @desc Number of random moves to shuffle the puzzle
 * @type number
 * @min 20
 * @max 200
 * @default 100
 *
 * @param allowExit
 * @text Allow Exit
 * @desc Allow player to exit puzzle with Cancel button
 * @type boolean
 * @default true
 *
 * @param showNumbers
 * @text Show Numbers
 * @desc Show numbers on tiles (useful when no image is set)
 * @type boolean
 * @default true
 *
 * @param selectorPulse
 * @text Selector Pulse Effect
 * @desc Enable pulsing animation on selector
 * @type boolean
 * @default true
 *
 * @param pulseSpeed
 * @text Pulse Speed
 * @desc Speed of pulse animation (lower = faster)
 * @type number
 * @min 10
 * @max 100
 * @default 30
 *
 * @param pulseIntensity
 * @text Pulse Intensity
 * @desc Scale variation (10-100, lower = subtle)
 * @type number
 * @min 10
 * @max 100
 * @default 30
 *
 * @param allowCancel
 * @text Allow Cancel
 * @desc Allow player to exit puzzle with ESC/Cancel/Right-click
 * @type boolean
 * @default true
 *
 * @param movePointCost
 * @text Points per Move
 * @desc Points deducted for each move (negative number)
 * @type number
 * @default -10
 *
 * @param Debug
 * @text Debug Mode
 * @desc Enable console logging for debugging
 * @type boolean
 * @default false
 *
 * @param allowCancel
 * @text Allow Cancel/Exit
 * @desc Allow player to exit puzzle with ESC/X/Cancel/Right Click
 * @type boolean
 * @default true
 *
 * @param seSlide
 * @text SE: Slide
 * @desc Sound effect when sliding tiles
 * @type struct<SoundEffect>
 * @default {"name":"Book1","volume":"90","pitch":"150","pan":"0"}
 *
 * @param seInvalidMove
 * @text SE: Invalid Move
 * @desc Sound effect when trying invalid move
 * @type struct<SoundEffect>
 * @default {"name":"Buzzer2","volume":"60","pitch":"100","pan":"0"}
 *
 * @param seSuccess
 * @text SE: Success
 * @desc Sound effect when puzzle is completed
 * @type struct<SoundEffect>
 * @default {"name":"Decision5","volume":"90","pitch":"100","pan":"0"}
 *
 * @param seMove
 * @text SE: Move Cursor
 * @desc Sound effect when moving cursor
 * @type struct<SoundEffect>
 * @default {"name":"Cursor1","volume":"90","pitch":"100","pan":"0"}
 *
 * @command easy
 * @text Easy Mode (3x3)
 * @desc 3x3 sliding puzzle (8 tiles + 1 empty)
 *
 * @arg imageFile
 * @text Image File
 * @desc Image to use for puzzle (optional, leave blank for numbered tiles)
 * @type file
 * @dir img/pictures
 * @default
 *
 * @arg maxMoves
 * @text Max Moves
 * @desc Maximum moves allowed (0 = unlimited)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg timeLimit
 * @text Time Limit (seconds)
 * @desc Time limit in seconds (0 = unlimited)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg successSwitch
 * @text Success Switch
 * @desc Switch to turn ON when puzzle completed
 * @type switch
 * @default 1
 *
 * @arg failSwitch
 * @text Fail Switch
 * @desc Switch to turn ON when puzzle failed
 * @type switch
 * @default 2
 *
 * @arg scoreVariable
 * @text Score Variable
 * @desc Variable to store final score
 * @type variable
 * @default 1
 *
 * @arg movesVariable
 * @text Moves Variable
 * @desc Variable to store number of moves made
 * @type variable
 * @default 2
 *
 * @arg allowCancel
 * @text Allow Cancel
 * @desc Allow player to exit puzzle (leave blank to use default setting)
 * @type boolean
 * @default true
 *
 * @command normal
 * @text Normal Mode (4x4)
 * @desc 4x4 sliding puzzle (15 tiles + 1 empty)
 *
 * @arg imageFile
 * @text Image File
 * @desc Image to use for puzzle (optional, leave blank for numbered tiles)
 * @type file
 * @dir img/pictures
 * @default
 *
 * @arg maxMoves
 * @text Max Moves
 * @desc Maximum moves allowed (0 = unlimited)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg timeLimit
 * @text Time Limit (seconds)
 * @desc Time limit in seconds (0 = unlimited)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg successSwitch
 * @text Success Switch
 * @desc Switch to turn ON when puzzle completed
 * @type switch
 * @default 1
 *
 * @arg failSwitch
 * @text Fail Switch
 * @desc Switch to turn ON when puzzle failed
 * @type switch
 * @default 2
 *
 * @arg scoreVariable
 * @text Score Variable
 * @desc Variable to store final score
 * @type variable
 * @default 1
 *
 * @arg movesVariable
 * @text Moves Variable
 * @desc Variable to store number of moves made
 * @type variable
 * @default 2
 *
 * @arg allowCancel
 * @text Allow Cancel
 * @desc Allow player to exit puzzle (leave blank to use default setting)
 * @type boolean
 * @default true
 *
 * @command hard
 * @text Hard Mode (5x5)
 * @desc 5x5 sliding puzzle (24 tiles + 1 empty)
 *
 * @arg imageFile
 * @text Image File
 * @desc Image to use for puzzle (optional, leave blank for numbered tiles)
 * @type file
 * @dir img/pictures
 * @default
 *
 * @arg maxMoves
 * @text Max Moves
 * @desc Maximum moves allowed (0 = unlimited)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg timeLimit
 * @text Time Limit (seconds)
 * @desc Time limit in seconds (0 = unlimited)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg successSwitch
 * @text Success Switch
 * @desc Switch to turn ON when puzzle completed
 * @type switch
 * @default 1
 *
 * @arg failSwitch
 * @text Fail Switch
 * @desc Switch to turn ON when puzzle failed
 * @type switch
 * @default 2
 *
 * @arg scoreVariable
 * @text Score Variable
 * @desc Variable to store final score
 * @type variable
 * @default 1
 *
 * @arg movesVariable
 * @text Moves Variable
 * @desc Variable to store number of moves made
 * @type variable
 * @default 2
 *
 * @arg allowCancel
 * @text Allow Cancel
 * @desc Allow player to exit puzzle (leave blank to use default setting)
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 * Dracky Plugins - Sliding Puzzle v1.0
 * ============================================================================
 * Author: Dracky Plugins
 * URL: http://drackyplugins.itch.io/
 *
 * Classic sliding tile puzzle game. Arrange tiles in correct order by sliding
 * them into the empty space!
 *
 * ----------------------------------------------------------------------------
 * HOW TO PLAY
 * ----------------------------------------------------------------------------
 * - One tile is missing, creating an empty space
 * - Click or select a tile adjacent to the empty space to slide it
 * - Continue sliding tiles until the image/numbers are in correct order
 * - Complete the puzzle to win!
 *
 * ----------------------------------------------------------------------------
 * DIFFICULTY LEVELS
 * ----------------------------------------------------------------------------
 * Easy (3x3):   8 tiles + 1 empty space
 * Normal (4x4): 15 tiles + 1 empty space
 * Hard (5x5):   24 tiles + 1 empty space
 *
 * ----------------------------------------------------------------------------
 * OPTIONAL ASSETS (place in img/pictures/)
 * ----------------------------------------------------------------------------
 * You can use any image file for the puzzle. The plugin will automatically
 * slice it into tiles based on the difficulty level.
 *
 * Recommended image sizes:
 * - 3x3: 384x384 pixels or larger
 * - 4x4: 512x512 pixels or larger
 * - 5x5: 640x640 pixels or larger
 *
 * If no image is provided, numbered tiles will be used instead.
 *
 * slide_bg.png - Background (optional)
 * slide_selector.png - Selection indicator (optional)
 *
 * ----------------------------------------------------------------------------
 * PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 * Easy Mode - 3x3 puzzle
 * Normal Mode - 4x4 puzzle
 * Hard Mode - 5x5 puzzle
 *
 * ----------------------------------------------------------------------------
 * CONTROLS
 * ----------------------------------------------------------------------------
 * Keyboard:
 *   Arrow Keys: Navigate grid
 *   OK/Enter/Z: Slide selected tile (if adjacent to empty space)
 *   ESC/X: Quit puzzle
 *
 * Mouse:
 *   Click: Slide tile directly (if adjacent to empty space)
 *
 * ----------------------------------------------------------------------------
 * SCORING
 * ----------------------------------------------------------------------------
 * - Starting score: 1000 points
 * - Points deducted per move: Set in parameters (default: -10)
 * - Final score stored in Score Variable
 * - Total moves stored in Moves Variable
 *
 * ----------------------------------------------------------------------------
 * TIPS FOR GAME DESIGNERS
 * ----------------------------------------------------------------------------
 * - Use custom images to hide clues or reveal story elements
 * - Combine with other puzzles for multi-stage challenges
 * - Use time limits for extra pressure
 * - Set move limits for additional difficulty
 * - Grant rewards based on final score (fewer moves = better reward)
 *
 * ============================================================================
 */

/*~struct~SoundEffect:
 * @param name
 * @text Filename
 * @desc Sound effect filename (without extension)
 * @type file
 * @dir audio/se
 * @default Cursor1
 *
 * @param volume
 * @text Volume
 * @desc Volume (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text Pitch
 * @desc Pitch (50-150)
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text Pan
 * @desc Pan (-100 to 100)
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

(function() {
    'use strict';

    var pluginName = 'dracky_slidingpuzzle';
    
    // Parameter parsing
    var parameters = PluginManager.parameters(pluginName);
    var tileSize = Number(parameters['tileSize'] || 128);
    var tileSpacing = Number(parameters['tileSpacing'] || 4);
    var slideAnimationSpeed = Number(parameters['slideAnimationSpeed'] || 8);
    var shuffleMoves = Number(parameters['shuffleMoves'] || 100);
    var showNumbers = parameters['showNumbers'] === 'true';
    var selectorPulse = parameters['selectorPulse'] !== 'false'; // Default true
    var pulseSpeed = Number(parameters['pulseSpeed'] || 30);
    var pulseIntensity = Number(parameters['pulseIntensity'] || 30);
    var allowCancel = parameters['allowCancel'] !== 'false'; // Default true
    var movePointCost = Number(parameters['movePointCost'] || -10);
    var debugMode = parameters['Debug'] === 'true';
    
    function parseSE(paramString) {
        if (!paramString) return { name: '', volume: 90, pitch: 100, pan: 0 };
        try {
            var obj = JSON.parse(paramString);
            return {
                name: obj.name || '',
                volume: Number(obj.volume) || 90,
                pitch: Number(obj.pitch) || 100,
                pan: Number(obj.pan) || 0
            };
        } catch (e) {
            return { name: '', volume: 90, pitch: 100, pan: 0 };
        }
    }
    
    var seSlide = parseSE(parameters['seSlide']);
    var seInvalidMove = parseSE(parameters['seInvalidMove']);
    var seSuccess = parseSE(parameters['seSuccess']);
    var seMove = parseSE(parameters['seMove']);
    
    function playSE(seData) {
        if (seData && seData.name) {
            AudioManager.playSe(seData);
        }
    }
    
    // Register plugin commands for MZ
    PluginManager.registerCommand(pluginName, 'easy', function(args) {
        startSlidingPuzzle(3, args);
    });
    
    PluginManager.registerCommand(pluginName, 'normal', function(args) {
        startSlidingPuzzle(4, args);
    });
    
    PluginManager.registerCommand(pluginName, 'hard', function(args) {
        startSlidingPuzzle(5, args);
    });
    
    function startSlidingPuzzle(gridSize, args) {
        if (debugMode) {
            console.log('=== Starting Sliding Puzzle ===');
            console.log('Grid Size:', gridSize + 'x' + gridSize);
            console.log('Args:', args);
        }
        
        $gameTemp._slidingPuzzleGridSize = gridSize;
        $gameTemp._slidingPuzzleImageFile = args.imageFile || '';
        $gameTemp._slidingPuzzleMaxMoves = Number(args.maxMoves) || 0;
        $gameTemp._slidingPuzzleTimeLimit = Number(args.timeLimit) || 0;
        $gameTemp._slidingPuzzleSuccessSwitch = Number(args.successSwitch) || 0;
        $gameTemp._slidingPuzzleFailSwitch = Number(args.failSwitch) || 0;
        $gameTemp._slidingPuzzleScoreVar = Number(args.scoreVariable) || 0;
        $gameTemp._slidingPuzzleMovesVar = Number(args.movesVariable) || 0;
        
        // Use command arg if specified, otherwise use default parameter
        if (args.allowCancel === 'true' || args.allowCancel === 'false') {
            $gameTemp._slidingPuzzleAllowCancel = args.allowCancel === 'true';
        } else {
            $gameTemp._slidingPuzzleAllowCancel = allowCancel;
        }
        
        SceneManager.push(Scene_SlidingPuzzle);
    }
    
    // Scene_SlidingPuzzle
    function Scene_SlidingPuzzle() {
        this.initialize(...arguments);
    }
    
    Scene_SlidingPuzzle.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SlidingPuzzle.prototype.constructor = Scene_SlidingPuzzle;
    
    Scene_SlidingPuzzle.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_SlidingPuzzle.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        
        this._gridSize = $gameTemp._slidingPuzzleGridSize || 4;
        this._imageFile = $gameTemp._slidingPuzzleImageFile || '';
        this._maxMoves = $gameTemp._slidingPuzzleMaxMoves || 0;
        this._timeLimit = $gameTemp._slidingPuzzleTimeLimit || 0;
        this._allowCancel = $gameTemp._slidingPuzzleAllowCancel !== false; // Default true
        this._moveCount = 0;
        this._score = 1000;
        this._gameOver = false;
        this._isAnimating = false;
        this._animatingTile = null;
        this._animationFrame = 0;
        this._pulseFrame = 0;
        
        this.createBackground();
        this.createPuzzleGrid();
        this.createInfoWindow();
        this.createSelector();
        
        if (debugMode) console.log('Puzzle created with grid size:', this._gridSize);
    };
    
    Scene_SlidingPuzzle.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._backgroundSprite.bitmap.fillRect(0, 0, Graphics.width, Graphics.height, '#1a1a2e');
        this.addChild(this._backgroundSprite);
        
        // Try to load optional background
        var bgBitmap = ImageManager.loadPicture('slide_bg');
        if (bgBitmap) {
            bgBitmap.addLoadListener(function() {
                this._backgroundSprite.bitmap = bgBitmap;
            }.bind(this));
        }
    };
    
    Scene_SlidingPuzzle.prototype.createPuzzleGrid = function() {
        var totalSize = this._gridSize * tileSize + (this._gridSize - 1) * tileSpacing;
        this._calculatedTileSize = tileSize;
        
        // Scale down if too large for screen
        if (totalSize > Graphics.width - 100 || totalSize > Graphics.height - 200) {
            var maxWidth = Graphics.width - 100;
            var maxHeight = Graphics.height - 200;
            var maxSize = Math.min(maxWidth, maxHeight);
            this._calculatedTileSize = Math.floor((maxSize - (this._gridSize - 1) * tileSpacing) / this._gridSize);
            totalSize = this._gridSize * this._calculatedTileSize + (this._gridSize - 1) * tileSpacing;
        }
        
        this._gridOffsetX = (Graphics.width - totalSize) / 2;
        this._gridOffsetY = (Graphics.height - totalSize) / 2 + 30;
        
        // Initialize grid
        this._tiles = [];
        this._tileSprites = [];
        
        // Create solved state
        for (var i = 0; i < this._gridSize * this._gridSize; i++) {
            this._tiles.push(i);
        }
        
        // Load image if specified
        if (this._imageFile) {
            this._puzzleImage = ImageManager.loadPicture(this._imageFile);
            this._puzzleImage.addLoadListener(this.onImageLoaded.bind(this));
        } else {
            this.createTileSprites();
            this.shufflePuzzle();
        }
    };
    
    Scene_SlidingPuzzle.prototype.onImageLoaded = function() {
        if (debugMode) console.log('Image loaded:', this._imageFile);
        this.createTileSprites();
        this.shufflePuzzle();
        
        // Move selector to top after tiles are created
        if (this._selectorSprite) {
            this.removeChild(this._selectorSprite);
            this.addChild(this._selectorSprite);
        }
    };
    
    Scene_SlidingPuzzle.prototype.createTileSprites = function() {
        this._tileSprites = [];
        
        for (var i = 0; i < this._gridSize * this._gridSize; i++) {
            var sprite = new Sprite();
            sprite.bitmap = this.createTileBitmap(i);
            this.addChild(sprite);
            this._tileSprites.push(sprite);
        }
        
        this.updateTilePositions(false);
    };
    
    Scene_SlidingPuzzle.prototype.createTileBitmap = function(tileIndex) {
        var bitmap = new Bitmap(this._calculatedTileSize, this._calculatedTileSize);
        
        if (tileIndex === this._gridSize * this._gridSize - 1) {
            // Empty tile (invisible)
            return bitmap;
        }
        
        if (this._puzzleImage && this._puzzleImage.isReady()) {
            // Slice from image
            var row = Math.floor(tileIndex / this._gridSize);
            var col = tileIndex % this._gridSize;
            
            var sourceWidth = this._puzzleImage.width / this._gridSize;
            var sourceHeight = this._puzzleImage.height / this._gridSize;
            var sx = col * sourceWidth;
            var sy = row * sourceHeight;
            
            bitmap.blt(this._puzzleImage, sx, sy, sourceWidth, sourceHeight, 0, 0, this._calculatedTileSize, this._calculatedTileSize);
        } else {
            // Numbered tile
            bitmap.fillRect(0, 0, this._calculatedTileSize, this._calculatedTileSize, '#4a5568');
            bitmap.fillRect(2, 2, this._calculatedTileSize - 4, this._calculatedTileSize - 4, '#2d3748');
            
            if (showNumbers) {
                bitmap.fontSize = Math.floor(this._calculatedTileSize * 0.4);
                bitmap.textColor = '#ffffff';
                bitmap.drawText(tileIndex + 1, 0, this._calculatedTileSize / 2 - bitmap.fontSize / 2, this._calculatedTileSize, bitmap.fontSize, 'center');
            }
        }
        
        // Add border
        bitmap.strokeRect(0, 0, this._calculatedTileSize, this._calculatedTileSize, '#1a202c', 2);
        
        return bitmap;
    };
    
    Scene_SlidingPuzzle.prototype.createSelector = function() {
        this._selectedRow = 0;
        this._selectedCol = 0;
        
        this._selectorSprite = new Sprite();
        this._selectorSprite.bitmap = new Bitmap(this._calculatedTileSize, this._calculatedTileSize);
        this._selectorSprite.bitmap.strokeRect(0, 0, this._calculatedTileSize, this._calculatedTileSize, '#ffd700', 4);
        this.addChild(this._selectorSprite);
        
        // Try to load optional selector image
        var selectorBitmap = ImageManager.loadPicture('slide_selector');
        if (selectorBitmap) {
            selectorBitmap.addLoadListener(function() {
                this._selectorSprite.bitmap = selectorBitmap;
            }.bind(this));
        }
        
        this.updateSelectorPosition();
    };
    
    Scene_SlidingPuzzle.prototype.updateSelectorPosition = function() {
        var x = this._gridOffsetX + this._selectedCol * (this._calculatedTileSize + tileSpacing);
        var y = this._gridOffsetY + this._selectedRow * (this._calculatedTileSize + tileSpacing);
        this._selectorSprite.x = x;
        this._selectorSprite.y = y;
    };
    
    Scene_SlidingPuzzle.prototype.createInfoWindow = function() {
        var windowWidth = 300;
        var windowHeight = 120;
        
        this._infoWindow = new Window_Base(new Rectangle(
            (Graphics.width - windowWidth) / 2,
            10,
            windowWidth,
            windowHeight
        ));
        this.addChild(this._infoWindow);
        
        this.updateInfoWindow();
    };
    
    Scene_SlidingPuzzle.prototype.updateInfoWindow = function() {
        if (!this._infoWindow) return;
        
        this._infoWindow.contents.clear();
        
        var y = 0;
        var lineHeight = 36;
        
        this._infoWindow.drawText('움직인 횟수: ' + this._moveCount, 0, y, this._infoWindow.width - 32, 'left');
        
        if (this._maxMoves > 0) {
            this._infoWindow.drawText('/ ' + this._maxMoves, 0, y, this._infoWindow.width - 32, 'right');
        }
        
        y += lineHeight;
        this._infoWindow.drawText('점수: ' + this._score, 0, y, this._infoWindow.width - 32, 'left');
    };
    
    Scene_SlidingPuzzle.prototype.shufflePuzzle = function() {
        if (debugMode) console.log('Shuffling puzzle...');
        
        var emptyIndex = this._tiles.indexOf(this._gridSize * this._gridSize - 1);
        
        for (var i = 0; i < shuffleMoves; i++) {
            var neighbors = this.getAdjacentTiles(emptyIndex);
            var randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            // Swap
            var temp = this._tiles[emptyIndex];
            this._tiles[emptyIndex] = this._tiles[randomNeighbor];
            this._tiles[randomNeighbor] = temp;
            
            emptyIndex = randomNeighbor;
        }
        
        this.updateTilePositions(false);
        
        if (debugMode) console.log('Puzzle shuffled. Current state:', this._tiles);
    };
    
    Scene_SlidingPuzzle.prototype.getAdjacentTiles = function(index) {
        var row = Math.floor(index / this._gridSize);
        var col = index % this._gridSize;
        var neighbors = [];
        
        if (row > 0) neighbors.push(index - this._gridSize); // Up
        if (row < this._gridSize - 1) neighbors.push(index + this._gridSize); // Down
        if (col > 0) neighbors.push(index - 1); // Left
        if (col < this._gridSize - 1) neighbors.push(index + 1); // Right
        
        return neighbors;
    };
    
    Scene_SlidingPuzzle.prototype.updateTilePositions = function(animate) {
        for (var i = 0; i < this._tiles.length; i++) {
            var tileValue = this._tiles[i];
            var sprite = this._tileSprites[tileValue];
            
            if (!sprite) continue;
            
            var row = Math.floor(i / this._gridSize);
            var col = i % this._gridSize;
            var targetX = this._gridOffsetX + col * (this._calculatedTileSize + tileSpacing);
            var targetY = this._gridOffsetY + row * (this._calculatedTileSize + tileSpacing);
            
            if (animate && sprite.x !== targetX || sprite.y !== targetY) {
                sprite.targetX = targetX;
                sprite.targetY = targetY;
                sprite.isSliding = true;
                sprite.slideFrame = 0;
            } else if (!animate) {
                sprite.x = targetX;
                sprite.y = targetY;
                sprite.targetX = targetX;
                sprite.targetY = targetY;
                sprite.isSliding = false;
            }
            
            // Hide empty tile
            sprite.visible = (tileValue !== this._gridSize * this._gridSize - 1);
        }
    };
    
    Scene_SlidingPuzzle.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        
        if (this._gameOver) return;
        
        this.updateSlideAnimations();
        this.updateSelectorPulse();
        
        if (!this._isAnimating) {
            this.updateInput();
        }
    };
    
    Scene_SlidingPuzzle.prototype.updateSelectorPulse = function() {
        if (!selectorPulse || !this._selectorSprite) return;
        
        this._pulseFrame++;
        
        // Calculate pulse using sine wave for smooth animation
        var progress = (this._pulseFrame % pulseSpeed) / pulseSpeed;
        var sine = Math.sin(progress * Math.PI * 2);
        
        // Map sine wave (-1 to 1) to scale range
        var scaleVariation = pulseIntensity / 1000; // Convert to decimal (30 becomes 0.03)
        var scale = 1.0 + (sine * scaleVariation);
        
        this._selectorSprite.scale.x = scale;
        this._selectorSprite.scale.y = scale;
        
        // Adjust position to keep pulse centered
        var offset = (this._calculatedTileSize * (1 - scale)) / 2;
        var baseX = this._gridOffsetX + this._selectedCol * (this._calculatedTileSize + tileSpacing);
        var baseY = this._gridOffsetY + this._selectedRow * (this._calculatedTileSize + tileSpacing);
        
        this._selectorSprite.x = baseX + offset;
        this._selectorSprite.y = baseY + offset;
    };
    
    Scene_SlidingPuzzle.prototype.updateSlideAnimations = function() {
        var anySliding = false;
        
        for (var i = 0; i < this._tileSprites.length; i++) {
            var sprite = this._tileSprites[i];
            if (!sprite || !sprite.isSliding) continue;
            
            anySliding = true;
            sprite.slideFrame++;
            
            var progress = sprite.slideFrame / slideAnimationSpeed;
            if (progress >= 1) {
                sprite.x = sprite.targetX;
                sprite.y = sprite.targetY;
                sprite.isSliding = false;
                sprite.slideFrame = 0;
            } else {
                var startX = sprite.x;
                var startY = sprite.y;
                sprite.x = startX + (sprite.targetX - startX) * progress;
                sprite.y = startY + (sprite.targetY - startY) * progress;
            }
        }
        
        this._isAnimating = anySliding;
    };
    
    Scene_SlidingPuzzle.prototype.updateInput = function() {
        if (Input.isRepeated('up')) {
            this._selectedRow--;
            if (this._selectedRow < 0) this._selectedRow = this._gridSize - 1;
            this.updateSelectorPosition();
            playSE(seMove);
            return;
        }
        if (Input.isRepeated('down')) {
            this._selectedRow++;
            if (this._selectedRow >= this._gridSize) this._selectedRow = 0;
            this.updateSelectorPosition();
            playSE(seMove);
            return;
        }
        if (Input.isRepeated('left')) {
            this._selectedCol--;
            if (this._selectedCol < 0) this._selectedCol = this._gridSize - 1;
            this.updateSelectorPosition();
            playSE(seMove);
            return;
        }
        if (Input.isRepeated('right')) {
            this._selectedCol++;
            if (this._selectedCol >= this._gridSize) this._selectedCol = 0;
            this.updateSelectorPosition();
            playSE(seMove);
            return;
        }
        
        if (Input.isTriggered('ok')) {
            this.trySlide(this._selectedRow, this._selectedCol);
            return;
        }
        
        if (TouchInput.isTriggered()) {
            var mx = TouchInput.x;
            var my = TouchInput.y;
            
            for (var row = 0; row < this._gridSize; row++) {
                for (var col = 0; col < this._gridSize; col++) {
                    var x = this._gridOffsetX + col * (this._calculatedTileSize + tileSpacing);
                    var y = this._gridOffsetY + row * (this._calculatedTileSize + tileSpacing);
                    
                    if (mx >= x && mx < x + this._calculatedTileSize &&
                        my >= y && my < y + this._calculatedTileSize) {
                        this._selectedRow = row;
                        this._selectedCol = col;
                        this.updateSelectorPosition();
                        this.trySlide(row, col);
                        return;
                    }
                }
            }
        }
        
        // Check for cancel input (ESC/X or right-click)
        if (this._allowCancel && (Input.isTriggered('cancel') || TouchInput.isCancelled())) {
            SoundManager.playCancel();
            this.popScene();
        }
    };
    
    Scene_SlidingPuzzle.prototype.trySlide = function(row, col) {
        var clickedIndex = row * this._gridSize + col;
        var emptyIndex = this._tiles.indexOf(this._gridSize * this._gridSize - 1);
        
        var neighbors = this.getAdjacentTiles(emptyIndex);
        
        if (neighbors.indexOf(clickedIndex) === -1) {
            playSE(seInvalidMove);
            if (debugMode) console.log('Invalid move: tile not adjacent to empty space');
            return;
        }
        
        // Valid move - swap tiles
        var temp = this._tiles[emptyIndex];
        this._tiles[emptyIndex] = this._tiles[clickedIndex];
        this._tiles[clickedIndex] = temp;
        
        this._moveCount++;
        this._score += movePointCost;
        if (this._score < 0) this._score = 0;
        
        playSE(seSlide);
        this.updateTilePositions(true);
        this.updateInfoWindow();
        
        if (debugMode) console.log('Move', this._moveCount, '- Tiles swapped:', clickedIndex, '<->', emptyIndex);
        
        // Check win condition after animation completes
        var self = this;
        setTimeout(function() {
            if (self.checkWin()) {
                self.onGameOver(true);
            } else if (self._maxMoves > 0 && self._moveCount >= self._maxMoves) {
                self.onGameOver(false);
            }
        }, slideAnimationSpeed * 16.67); // Convert frames to ms
    };
    
    Scene_SlidingPuzzle.prototype.checkWin = function() {
        for (var i = 0; i < this._tiles.length; i++) {
            if (this._tiles[i] !== i) {
                return false;
            }
        }
        return true;
    };
    
    Scene_SlidingPuzzle.prototype.onGameOver = function(success) {
        if (this._gameOver) return;
        
        if (debugMode) {
            console.log('=== Game Over ===');
            console.log('Success:', success, 'Score:', this._score, 'Moves:', this._moveCount);
        }
        
        this._gameOver = true;
        
        var successSwitch = $gameTemp._slidingPuzzleSuccessSwitch;
        var failSwitch = $gameTemp._slidingPuzzleFailSwitch;
        var scoreVar = $gameTemp._slidingPuzzleScoreVar;
        var movesVar = $gameTemp._slidingPuzzleMovesVar;
        
        if (success) {
            if (successSwitch) {
                $gameSwitches.setValue(successSwitch, true);
            }
            playSE(seSuccess);

            // Show the complete source image after solving.
            // The sliding puzzle uses one invisible empty tile, so this final
            // preview lets the player read the entire restored document.
            if (this._puzzleImage && this._puzzleImage.isReady()) {
                if (this._tileSprites) {
                    this._tileSprites.forEach(function(sprite) {
                        if (sprite) sprite.visible = false;
                    });
                }
                if (this._selectorSprite) this._selectorSprite.visible = false;
                if (this._infoWindow) this._infoWindow.visible = false;

                var previewSize = this._gridSize * this._calculatedTileSize +
                    (this._gridSize - 1) * tileSpacing;
                this._completePreviewSprite = new Sprite(this._puzzleImage);
                this._completePreviewSprite.x = this._gridOffsetX;
                this._completePreviewSprite.y = this._gridOffsetY;
                this._completePreviewSprite.scale.x = previewSize / this._puzzleImage.width;
                this._completePreviewSprite.scale.y = previewSize / this._puzzleImage.height;
                this.addChild(this._completePreviewSprite);
            }
        } else {
            if (failSwitch) {
                $gameSwitches.setValue(failSwitch, true);
            }
        }
        
        if (scoreVar) {
            $gameVariables.setValue(scoreVar, this._score);
        }
        if (movesVar) {
            $gameVariables.setValue(movesVar, this._moveCount);
        }
        
        var self = this;
        setTimeout(function() {
            self.popScene();
        }, 1500);
    };
    
    Scene_SlidingPuzzle.prototype.terminate = function() {
        Scene_MenuBase.prototype.terminate.call(this);
        
        $gameTemp._slidingPuzzleGridSize = null;
        $gameTemp._slidingPuzzleImageFile = null;
        $gameTemp._slidingPuzzleMaxMoves = null;
        $gameTemp._slidingPuzzleTimeLimit = null;
        $gameTemp._slidingPuzzleSuccessSwitch = null;
        $gameTemp._slidingPuzzleFailSwitch = null;
        $gameTemp._slidingPuzzleScoreVar = null;
        $gameTemp._slidingPuzzleMovesVar = null;
        $gameTemp._slidingPuzzleAllowCancel = null;
        
        if (debugMode) console.log('=== Sliding Puzzle Terminated ===');
    };
    
    window.Scene_SlidingPuzzle = Scene_SlidingPuzzle;

})();
