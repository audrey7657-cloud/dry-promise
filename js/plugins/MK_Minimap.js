/*:
 * @target MZ
 * @author Aerosys
 * @plugindesc [Tier 1] [Version 1.3.6] [MV & MZ]
 * 
 * @help
 * 
 * ----------------------------------------------------------------------------
 * Rules
 * ----------------------------------------------------------------------------
 * 
 * 1. <not applicable>
 * 
 * 2. You may not redistribute, sell, or make this Plugin available on any
 *    website, platform, or any other distribution channel on a standalone
 *    basis. You may also not claim the Plugin as your own.
 * 
 * 3. You may modify this Plugin to suit your needs, but Rule 2 also applies
 *    for modified versions of this Plugin.
 * 
 * 4. You may create a Plugin that requires this Plugin to function, but you
 *    may not redistribute, sell, or make your Plugin available on any website,
 *    platform, or any other distribution channel on a standalone basis, even
 *    if it is not a direct violation of Rule 2. Your Plugin can only be
 *    shipped as part of your game.
 * 
 * 5. You may send this Plugin to another person when you hire them for
 *    personal modifications.
 * 
 * 6. When multiple people work on the project, purchasing a license for every
 *    team member is not required.
 * 
 * 
 * NEED SUPPORT?
 * Contact me: mail<at>aerosys.blog
 * 
 * ----------------------------------------------------------------------------
 * Notetags
 * ----------------------------------------------------------------------------
 * 
 * - the following Notetags can be applied on Maps
 * 
 * <Minimap>
 * - shows the Minimap on this Map
 * 
 * <No Minimap>
 * - hides the Minimap on this Map
 * 
 * <Minimap Parallax>
 * - shows the Parallax on the Minimap
 * 
 * <Minimap No Parallax>
 * - hides the Parallax on the Minimap
 * 
 * <Minimap Fog of War>
 * - activates the Fog of War for this Map
 * 
 * <Minimap No Fog of War>
 * - disables the Fog of War for this Map
 * 
 * <Minimap Zoom: x>
 * - overrides Minimap Zoom
 * - 0.0: display full map
 * - 1.0: display what the player sees right now
 * - x: shows x-times as much as the player sees right now
 * 
 * ----------------------------------------------------------------------------
 * More Notetags
 * ----------------------------------------------------------------------------
 * 
 * <Minimap Icon: x>
 * - can be applied on Actors
 * - When this Actor is the leader AND the Render Mode for the Player on the
 *   Minimap is set to "Icon", then this Icon is rendered on the Map
 * 
 * <Minimap Picture: x>
 * - can be applied on Actors
 * - When this Actor is the leader AND the Render Mode for the Player on the
 *   Minimap is set to "Picture", then this Picture is rendered on the Map
 * 
 * 
 * @command changeVisibility
 * @text Change Visibility
 * @desc "Hide" forcefully hides the Minimap. "Show" depends on the player's Options. Remains until the next Map Transfer.
 * 
 * @arg mode
 * @text Mode
 * @type select
 * @option Show
 * @option Hide
 * @option Toggle
 * @default Show
 * 
 * 
 * @command changeVisibilityOption
 * @text Change Visibility in the Options Menu
 * @desc Changes the player's setting in the Options Menu. Works both with and without Visustella Options Core.
 * 
 * @arg mode
 * @text Mode
 * @type select
 * @option Show
 * @option Hide
 * @option Toggle
 * @default Toggle
 * 
 * 
 * @command forceShow
 * @text Force Show
 * @desc Shows the Minimap regardless of player's setting in the Options Menu. Useful for cutscenes.
 * 
 * @arg mode
 * @text Mode
 * @type boolean
 * @default true
 * 
 * 
 * @command expandMinimap
 * @text Expand/Collapse Minimap
 * 
 * @arg mode
 * @text Mode
 * @type select
 * @option Expand
 * @option Collapse
 * @option Toggle
 * @default Expand
 * 
 * 
 * @command revealMap
 * @text Fog of War - (Un)reveal Map
 * @desc Fog of War. Reveal or unreveal the current map.
 * 
 * @arg mode
 * @text Mode
 * @type select
 * @option Reveal
 * @option Unreveal
 * @default Reveal
 * 
 * 
 * @command event
 * @text (Event Command) Displaying
 * @desc Put this command on an event page.
 * 
 * @arg template
 * @text Template
 * @type combo
 * @option Monster
 * @option Portal
 * @option Weapon Smith
 * @option Armor Shop
 * @option Item Shop
 * @option Inn
 * @option Chest
 * @option Harvestable
 * @option Ore
 * @option blinking
 * @option hidden
 * @default Monster
 * 
 * 
 * @param common
 * @text Common
 * 
 * @param isVisible
 * @parent common
 * @text Visible by default?
 * @type boolean
 * @default true
 * @desc You can situationally override through Notetags/Plugin Commands. "Show" depends on player's choice in Options.
 * 
 * @param map
 * @parent common
 * @text Map Position & Appearance
 * @type struct<Map>
 * @default {"position":"top left","xEval":"\"const position = arguments[0];\\nconst width = arguments[1];\\n\\nreturn position == 'top left' || position == 'bottom left'\\n    ? (Graphics.width - Graphics.boxWidth) / 2\\n    : Graphics.boxWidth - width + ((Graphics.width - Graphics.boxWidth) / 2);\"","yEval":"\"const position = arguments[0];\\nconst height = arguments[1];\\n\\nlet result = position == 'top left' || position == 'top right'\\n    ? (Graphics.height - Graphics.boxHeight) / 2\\n    : Graphics.boxHeight + ((Graphics.height - Graphics.boxHeight) / 2) - height;\\n\\nif (position == 'top right' && this.buttonAreaHeight) {\\n    result = result + this.buttonAreaHeight();\\n}\\nreturn result;\"","widthEval":"Graphics.boxWidth * 0.3","heightEval":"Graphics.boxHeight * 0.3","opacityEval":"192","showParallax":"true"}
 * 
 * 
 * @param whenExpanded
 * @parent map
 * @text when expanded
 * @type struct<Expanded>
 * @default {"xEval":"\"const width = arguments[0];\\n\\nreturn Math.floor((Graphics.width / 2) - (width / 2));\"","yEval":"\"const height = arguments[0];\\n\\nreturn Math.floor((Graphics.height / 2) - (height / 2));\"","widthEval":"Graphics.boxWidth * 0.9","heightEval":"Graphics.boxHeight * 0.9","opacityEval":"255"}
 * 
 * 
 * @param background
 * @parent common
 * @text Background
 * @type struct<Background>
 * @default {"design":"Window","picture":"battlebacks1/Ship","overridePadding":"false","padding":"12"}
 * 
 * 
 * @param foreground
 * @parent common
 * @text Foreground
 * @type struct<Foreground>
 * @default {"show":"true","picture":"titles2/Medieval","opacity":"255"}
 * 
 * 
 * @param fogOfWar
 * @parent common
 * @text Fog of War
 * @type struct<FogOfWar>
 * @default {"active":"true","color":"15","sightRanges":"","sightRangeScaleDefault":"1.0","sightRangeScaleWhenRidingBoat":"1.0","sightRangeScaleWhenRidingShip":"1.5","sightRangeScaleWhenRidingAirship":"2.0"}
 * 
 * 
 * @param zoomSettings
 * @parent common
 * @text Zoom Settings
 * @type struct<ZoomSettings>
 * @default {"defaultZoomValue":"2.0","zoomValueWhenExpanded":"0.0"}
 * 
 * 
 * @param bottomWindow
 * @parent common
 * @text Map Name Window
 * @type struct<BottomWindow>
 * @default {"isVisibleEval":"\"return MK.Minimap.isVisible() && $gameMap.displayName()\"","rectangleEval":"\"const scene = this;\\n\\nconst x = scene._minimapSprite.x;\\nconst y = scene._minimapSprite.y\\n        + scene._minimapSprite.height;\\n\\nconst width = scene._minimapSprite.width;\\n\\nconst height = Utils.RPGMAKER_NAME == 'MZ'\\n        ? scene.calcWindowHeight(1, true)\\n        : new Window_Base(0, 0, 0, 0).fittingHeight(1);\\n\\nreturn new Rectangle(x, y, width, height);\"","textEval":"\"return $gameMap.displayName()\"","align":"Center","design":"Window","picture":"","opacity":"255"}
 * 
 * 
 * @param bottomWindowWhenExpanded
 * @parent bottomWindow
 * @text when expanded
 * @type struct<BottomWindowWhenExpanded>
 * @default {"isVisibleEval":"\"return MK.Minimap.isVisible() && !!$gameMap.displayName()\"","rectangleEval":"\"const scene = this;\\n\\nconst width = Math.floor(Graphics.boxWidth / 2);\\n\\nconst height = Utils.RPGMAKER_NAME == 'MZ'\\n        ? scene.calcWindowHeight(1, true)\\n        : new Window_Base(0, 0, 0, 0).fittingHeight(1);\\n\\nconst x = Math.floor((Graphics.width / (2) - width / 2));\\nconst y = (Graphics.height - Graphics.boxHeight) / 2;\\n\\nreturn new Rectangle(x, y, width, height);\"","textEval":"\"return $gameMap.displayName() || ''\"","align":"Center","opacity":"255"}
 * 
 * 
 * @param a
 * @text _
 * 
 * 
 * @param objects
 * @text Player & Vehicles
 * 
 * @param player
 * @parent objects
 * @text Player
 * @type struct<Player>
 * @default {"mode":"Icon","iconIndex":"82","picture":"","color":"18","scale":"1.0","scaleWithMinimap":"false","opacity":"255","blinking":"true","rotate":"false"}
 * 
 * @param vehicles
 * @parent objects
 * @text Vehicles
 * @type struct<Vehicles>
 * @default {"mode":"Dot","boat":"","boatIconIndex":"","boatPicture":"","boatColor":"23","ship":"","shipIconIndex":"","shipPicture":"","shipColor":"22","airship":"","airshipIconIndex":"","airshipPicture":"","airshipColor":"27","scale":"0.6","scaleWithMinimap":"false","opacity":"192","blinking":"true","rotate":"false","breakFogOfWar":"true","sticksOnEdge":"true","priority":"Vehicle"}
 * 
 * @param eventTemplates
 * @parent objects
 * @text Event Templates
 * @type struct<Event>[]
 * @default ["{\"name\":\"Monster\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"5\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"true\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Portal\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"79\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Weapon Smith\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"97\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Armor Shop\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"128\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Item Shop\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"176\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Inn\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"8\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Chest\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"210\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Harvestable\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"122\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"Ore\",\"a\":\"\",\"mode\":\"Icon\",\"iconIndex\":\"301\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3.0\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"blinking\",\"a\":\"\",\"mode\":\"Sprite\",\"iconIndex\":\"\",\"picture\":\"\",\"color\":\"\",\"scale\":\"1.0\",\"opacity\":\"255\",\"blinking\":\"true\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}","{\"name\":\"hidden\",\"a\":\"\",\"mode\":\"don't show\",\"iconIndex\":\"\",\"picture\":\"\",\"color\":\"\",\"scale\":\"3\",\"opacity\":\"255\",\"blinking\":\"false\",\"rotate\":\"false\",\"breakFogOfWar\":\"false\"}"]
 * 
 * 
 * @param b
 * @text _
 * 
 * 
 * @param performance
 * @text Performance
 * 
 * @param getDownscaleFactorEval
 * @parent performance
 * @text Mipmapping: get factor
 * @type note
 * @default "if (!$gameMap) return 1; // Escape Route\n\nconst y = Math.max(\n  $gameMap.width() * $gameMap.tileWidth() / 500,\n  $gameMap.height() * $gameMap.tileHeight() / 500,\n);\nreturn [1, 2, 4, 8, 12, 16]\n  .find(value => y < value) || 16;"
 * 
 * @param shouldDisplayDownscaleFactor
 * @parent getDownscaleFactorEval
 * @text Display? (Testplay)
 * @type boolean
 * @default true
 * @desc Displays the factor for analysis - Testplay only
 * 
 * @param updateEventsInterval
 * @parent performance
 * @text Update Events Interval
 * @type number
 * @default 1
 * @desc Update each Event every x-th frame. 1 = update every frame, 2 = update every 2nd frame, ...
 * 
 * @param listenForMapChanges
 * @parent performance
 * @text Listen for Map Changes?
 * @type boolean
 * @default false
 * @desc Minimap will react on Map modifications (Shaz TileChanger, Random Maps, ...). Disabling may save performance.
 * 
 * @param listenForSpawnedEvents
 * @parent performance
 * @text Check for Spawned Events?
 * @type boolean
 * @default true
 * @desc Minimap will check for Events that spawn dynamically. Disabling may save performance.
 * 
 * @param showWalkAnimation
 * @parent performance
 * @text Show Walk Animations?
 * @type boolean
 * @default true
 * @desc Show walk animations for Sprite-based icons on the Minimap. Disabling may save performance.
 * 
 * @param c
 * @text _
 * 
 * 
 * @param misc
 * @text Miscellaneous
 * 
 * @param addToOptions
 * @parent misc
 * @text Add to Options?
 * @type boolean
 * @default true
 * @desc Add Setting to the Options Menu
 * 
 * @param hotkeys
 * @parent misc
 * @text Hotkeys
 * @type struct<Hotkeys>
 * @desc All Hotkeys may be empty. You can get the Key Code from e.g. http://keyjs.dev.
 * @default {"showHide":"77","expandCollapse":"78"}
 * 
 * @param vocabulary
 * @parent misc
 * @text Vocabulary
 * @type struct<Vocabulary>
 * @default {"optionsMenuText":"Show Minimap"}
 * 
 * @param blinkingEval
 * @parent misc
 * @text JS: Blinking
 * @type note
 * @default "const t = Date.now() / 400;\nreturn 0.5 * Math.abs(Math.sin(t)) * 255 + 128"
 * 
 */

/*~struct~Map:
 *
 * @param position
 * @text Position
 * @type select
 * @option top left
 * @option top right
 * @option bottom left
 * @option bottom right
 * @default top left
 * 
 * @param xEval
 * @text X Position
 * @type note
 * @default "const position = arguments[0];\nconst width = arguments[1];\n\nreturn position == 'top left' || position == 'bottom left'\n    ? (Graphics.width - Graphics.boxWidth) / 2\n    : Graphics.boxWidth - width + ((Graphics.width - Graphics.boxWidth) / 2);"
 * 
 * @param yEval
 * @text Y Position
 * @type note
 * @default "const position = arguments[0];\nconst height = arguments[1];\n\nlet result = position == 'top left' || position == 'top right'\n    ? (Graphics.height - Graphics.boxHeight) / 2\n    : Graphics.boxHeight + ((Graphics.height - Graphics.boxHeight) / 2) - height;\n\nif (position == 'top right' && this.buttonAreaHeight) {\n    result = result + this.buttonAreaHeight();\n}\nreturn result;"
 *
 * @param widthEval
 * @text Width
 * @desc You may use JavaScript
 * @default Graphics.boxWidth * 0.3
 * 
 * @param heightEval
 * @text Height
 * @desc You may use JavaScript
 * @default Graphics.boxHeight * 0.3
 * 
 * @param opacityEval
 * @text Opacity
 * @desc You may use JavaScript
 * @default 192
 * 
 * @param showParallax
 * @text Parallax?
 * @type boolean
 * @default true
 * @desc Can be enabled/disabled with Map Note Tags <Minimap Parallax> and <Minimap No Parallax>
 * 
 */

/*~struct~Expanded:
 *
 * @param xEval
 * @text X Position
 * @type note
 * @default "const width = arguments[0];\n\nreturn Math.floor((Graphics.width / 2) - (width / 2));"
 * 
 * @param yEval
 * @text Y Position
 * @type note
 * @default "const height = arguments[0];\n\nreturn Math.floor((Graphics.height / 2) - (height / 2));"
 *
 * @param widthEval
 * @text Width
 * @desc You may use JavaScript
 * @default Graphics.boxWidth * 0.9
 * 
 * @param heightEval
 * @text Height
 * @desc You may use JavaScript
 * @default Graphics.boxHeight * 0.9
 * 
 * @param opacityEval
 * @text Opacity
 * @desc You may use JavaScript
 * @default 255
 * 
 */

/*~struct~Background:
 *
 * @param design
 * @text Design
 * @type select
 * @option Picture
 * @option Window
 * @option No Background
 * @default Window
 * 
 * @param picture
 * @text when "Picture": File
 * @type file
 * @dir img
 * @require 1
 * @default titles2/Medieval
 * 
 * @param overridePadding
 * @text Override Padding?
 * @type boolean
 * @default false
 * 
 * @param padding
 * @parent overridePadding
 * @text Padding
 * @type number
 * @default 12
 * 
 */

/*~struct~Foreground:
 *
 * @param show
 * @text Show?
 * @type boolean
 * @default true
 * 
 * @param picture
 * @text Picture
 * @type file
 * @dir img
 * @require 1
 * @default titles2/Medieval
 * 
 * @param opacity
 * @text Opacity
 * @type number
 * @default 255
 * 
 */

/*~struct~BottomWindow:
 * 
 * @param isVisibleEval
 * @text JS: is visible?
 * @type note
 * @default "return MK.Minimap.isVisible() && $gameMap.displayName()"
 * 
 * @param rectangleEval
 * @text JS: Position & Sizes
 * @type note
 * @default "const scene = this;\n\nconst x = scene._minimapSprite.x;\nconst y = scene._minimapSprite.y\n        + scene._minimapSprite.height;\n\nconst width = scene._minimapSprite.width;\n\nconst height = Utils.RPGMAKER_NAME == 'MZ'\n        ? scene.calcWindowHeight(1, true)\n        : new Window_Base(0, 0, 0, 0).fittingHeight(1);\n\nreturn new Rectangle(x, y, width, height);"
 * 
 * @param textEval
 * @text JS: Text
 * @type note
 * @default "return $gameMap.displayName() || ''"
 * 
 * @param align
 * @text Text Align
 * @type select
 * @option Left
 * @option Center
 * @option Right
 * @default Center
 * 
 * @param design
 * @text Design
 * @type select
 * @option Same as Minimap
 * @option Window
 * @option Picture
 * @option No Background
 * @default Same as Minimap
 * 
 * @param picture
 * @parent design
 * @text when "Picture": File
 * @type file
 * @dir img
 * @require 1
 * @default battlebacks1/Ship
 * 
 * @param opacity
 * @text Opacity
 * @type number
 * @default 255
 * 
 */

/*~struct~BottomWindowWhenExpanded:
 * 
 * @param isVisibleEval
 * @text JS: is visible?
 * @type note
 * @default "return MK.Minimap.isVisible() && $gameMap.displayName()"
 * 
 * @param rectangleEval
 * @text JS: Position & Sizes
 * @type note
 * @default "const scene = this;\n\nconst width = Math.floor(Graphics.boxWidth / 2);\n\nconst height = Utils.RPGMAKER_NAME == 'MZ'\n        ? scene.calcWindowHeight(1, true)\n        : new Window_Base(0, 0, 0, 0).fittingHeight(1);\n\nconst x = Math.floor((Graphics.width / (2) - width / 2));\nconst y = (Graphics.height - Graphics.boxHeight) / 2;\n\nreturn new Rectangle(x, y, width, height);"
 * 
 * @param textEval
 * @text JS: Text
 * @type note
 * @default "return $gameMap.displayName() || ''"
 * 
 * @param align
 * @text Text Align
 * @type select
 * @option Left
 * @option Center
 * @option Right
 * @default Center
 * 
 * @param opacity
 * @text Opacity
 * @type number
 * @default 255
 * 
 */

/*~struct~FogOfWar:
 *
 * @param active
 * @text Is active?
 * @type boolean
 * @default true
 * @desc You may enable/disable this setting through Map Notetags
 * 
 * @param color
 * @parent style
 * @text Color
 * @type color
 * @default 15
 * 
 * @param sightRanges
 * @text Sight Range Scales
 * 
 * @param sightRangeScaleDefault
 * @parent sightRanges
 * @text Default
 * @type number
 * @decimals 1
 * @default 1.0
 * 
 * @param sightRangeScaleWhenRidingBoat
 * @parent sightRanges
 * @text when riding Boat
 * @type number
 * @decimals 1
 * @default 1.0
 * 
 * @param sightRangeScaleWhenRidingShip
 * @parent sightRanges
 * @text when riding Ship
 * @type number
 * @decimals 1
 * @default 1.5
 * 
 * @param sightRangeScaleWhenRidingAirship
 * @parent sightRanges
 * @text when riding Airship
 * @type number
 * @decimals 1
 * @default 2.0
 * 
 */

/*~struct~ZoomSettings:
 *
 * @param defaultZoomValue
 * @text Zoom Value (default)
 * @type number
 * @min 0
 * @decimals 1
 * @default 0
 * @desc 0.0: Full Map. 1.0: What the Player sees. 1.1 or higher: Higher Field of View
 * 
 * @param zoomValueWhenExpanded
 * @text Zoom Value (when Expanded)
 * @type number
 * @min 0
 * @decimals 1
 * @default 0
 * @desc 0.0: Full Map. 1.0: What the Player sees. 1.1 or higher: Higher Field of View
 * 
 */

/*~struct~Player:
 *
 * @param mode
 * @text Mode
 * @type select
 * @option Square
 * @option Dot
 * @option Icon
 * @option Picture
 * @option Sprite
 * @option don't show
 * @default Icon
 * 
 * @param iconIndex
 * @parent mode
 * @text when Icon: Icon Index
 * @type icon
 * @default 82
 * 
 * @param picture
 * @parent mode
 * @text when Picture: File
 * @type file
 * @dir img/pictures/
 * @require 1
 * 
 * @param color
 * @text Color
 * @type color
 * @desc Message Color Code. Not used when using a Picture.
 * @default 18
 * 
 * @param scale
 * @text Scale
 * @type number
 * @decimals 1
 * @default 1
 * 
 * @param scaleWithMinimap
 * @text Scale with Minimap?
 * @type boolean
 * @default false
 * @desc When true, this object scales with the Minimap's scaling. When false, this object has a fixed size.
 * 
 * @param opacity
 * @text Opacity
 * @type number
 * @desc This value is not used when "blinking" is selected
 * @default 192
 * 
 * @param blinking
 * @text Blinking?
 * @type boolean
 * @default true
 * 
 * @param rotate
 * @text Rotate?
 * @type boolean
 * @default false
 * 
 */


/*~struct~Vehicles:
 *
 * @param mode
 * @text Mode
 * @type select
 * @option Square
 * @option Dot
 * @option Icon
 * @option Picture
 * @option Sprite
 * @option don't show
 * @default Dot
 * 
 * @param boat
 * @text Boat Settings
 * 
 * @param boatIconIndex
 * @parent boat
 * @text Icon
 * @type icon
 * 
 * @param boatPicture
 * @parent boat
 * @text Picture File
 * @type file
 * @dir img/pictures/
 * @require 1
 * 
 * @param boatColor
 * @parent boat
 * @text Color
 * @type color
 * @desc Message Color Code
 * 
 * @param ship
 * @text Ship Settings
 * 
 * @param shipIconIndex
 * @parent ship
 * @text Icon
 * @type icon
 * 
 * @param shipPicture
 * @parent ship
 * @text Picture File
 * @type file
 * @dir img/pictures/
 * @require 1
 * 
 * @param shipColor
 * @parent ship
 * @text Color
 * @type color
 * @desc Message Color Code
 * 
 * @param airship
 * @text Airship Settings
 * 
 * @param airshipIconIndex
 * @parent airship
 * @text Icon
 * @type icon
 * 
 * @param airshipPicture
 * @parent airship
 * @text Picture File
 * @type file
 * @dir img/pictures/
 * @require 1
 * 
 * @param airshipColor
 * @parent airship
 * @text Color
 * @type color
 * @desc Message Color Code
 * 
 * @param scale
 * @text Scale
 * @type number
 * @decimals 1
 * @default 0.6
 * 
 * @param scaleWithMinimap
 * @text Scale with Minimap?
 * @type boolean
 * @default false
 * @desc When true, this object scales with the Minimap's scaling. When false, this object has a fixed size.
 * 
 * @param opacity
 * @text Opacity
 * @type number
 * @desc This value is not used when "blinking" is selected
 * @default 192
 * 
 * @param blinking
 * @text Blinking?
 * @type boolean
 * @default true
 * 
 * @param rotate
 * @text Rotate?
 * @type boolean
 * @default false
 * 
 * @param breakFogOfWar
 * @text Break through Fog of War?
 * @type boolean
 * @default true
 * @desc When true, this Event will be displayed even when it is covered by the fog of war
 * 
 * @param sticksOnEdge
 * @text Sticks on Edge?
 * @type boolean
 * @default true
 * @desc When true, this Event will stick on the Minimap's edge when moving too far away from player's field of view
 * 
 * @param priority
 * @text Priority when riding
 * @type select
 * @option Player
 * @option Vehicle
 * @default Vehicle
 * @desc Configures what is rendered when the Player is riding a Vehicle
 *
 */


/*~struct~Event:
 *
 * @param name
 * @text Name
 * @default REQUIRED
 * 
 * @param a
 * @text _
 * 
 * @param mode
 * @text Mode
 * @type select
 * @option Square
 * @option Dot
 * @option Icon
 * @option Picture
 * @option Sprite
 * @option don't show
 * @default Sprite
 * 
 * @param iconIndex
 * @parent mode
 * @text when Icon: Icon Index
 * @type icon
 * 
 * @param picture
 * @parent mode
 * @text when Picture: File
 * @type file
 * @dir img/pictures/
 * @require 1
 * 
 * @param freeze
 * @parent mode
 * @text when Sprite: Freeze?
 * @type boolean
 * @desc When true, no stepping animation is shown. Useful for e.g. animated waterfalls
 * 
 * @param color
 * @text Color
 * @type color
 * @desc Message Color Code
 * 
 * @param scale
 * @text Scale
 * @type number
 * @decimals 1
 * @default 2
 * 
 * @param scaleWithMinimap
 * @text Scale with Minimap?
 * @type boolean
 * @default true
 * @desc When true, this object scales with the Minimap's scaling. When false, this object has a fixed size.
 * 
 * @param opacity
 * @text Opacity
 * @type number
 * @desc This value is not used when "blinking" is selected
 * @default 255
 * 
 * @param blinking
 * @text Blinking?
 * @type boolean
 * @default false
 * 
 * @param rotate
 * @text Rotate?
 * @type boolean
 * @default false
 * 
 * @param breakFogOfWar
 * @text Break through Fog of War?
 * @type boolean
 * @default false
 * @desc When true, this Event will be displayed even when it is covered by the fog of war
 * 
 * @param sticksOnEdge
 * @text Sticks on Edge?
 * @type boolean
 * @default false
 * @desc When true, this Event will stick on the Minimap's edge when moving too far away from player's field of view
 * 
 */

/*~struct~Hotkeys:
 *
 * @param keyboard
 * @text Keyboard
 * 
 * @param showHide
 * @parent keyboard
 * @text Show/Hide
 * @type number
 * @default 77
 * @desc May be empty. You can get the Key Code from e.g. http://keyjs.dev. Default is 77 which is the letter M.
 * 
 * @param expandCollapse
 * @parent keyboard
 * @text Expand/Collapse
 * @type number
 * @default 78
 * @desc May be empty. You can get the Key Code from e.g. http://keyjs.dev. Default is 78 which is the letter N.
 * 
 * @param gamepad
 * @text Gamepad
 * 
 * @param showHide2
 * @parent gamepad
 * @text Show/Hide
 * @type number
 * @desc May be empty. E.g. 6 is LR2 on a PS5 controller.
 * 
 * @param expandCollapse2
 * @parent gamepad
 * @text Expand/Collapse
 * @type number
 * @desc May be empty. E.g. 6 is LR2 on a PS5 controller.
 */

/*~struct~Vocabulary:
 *
 * @param optionsMenuText
 * @text Options Menu: enable Minimap?
 * @default Show Minimap
 * 
 */


var MK = MK || { };
MK.Minimap = { };

// Spriteset Minimap
function Spriteset_Minimap() {
    this.initialize(...arguments);
}

if (typeof Sprite_Clickable !== 'undefined') {
    Spriteset_Minimap.prototype = Object.create(Sprite_Clickable.prototype);
    Spriteset_Minimap.prototype.constructor = Sprite_Clickable;
} else {
    Spriteset_Minimap.prototype = Object.create(Sprite.prototype);
    Spriteset_Minimap.prototype.constructor = Sprite;
}

// Sprite Minimap
function Sprite_Minimap() {
    this.initialize(...arguments);
}

Sprite_Minimap.prototype = Object.create(Sprite.prototype);
Sprite_Minimap.prototype.constructor = Sprite;

// Sprite Minimap Character
function Sprite_Minimap_Character() {
    this.initialize(...arguments);
}

Sprite_Minimap_Character.prototype = Object.create(Sprite.prototype);
Sprite_Minimap_Character.prototype.constructor = Sprite;

// Sprite Minimap Event
function Sprite_Minimap_Event() {
    this.initialize(...arguments);
}

Sprite_Minimap_Event.prototype = Object.create(Sprite_Minimap_Character.prototype);
Sprite_Minimap_Event.prototype.constructor = Sprite_Minimap_Character;

// Sprite Minimap Player
function Sprite_Minimap_Player() {
    this.initialize(...arguments);
}

Sprite_Minimap_Player.prototype = Object.create(Sprite_Minimap_Character.prototype);
Sprite_Minimap_Player.prototype.constructor = Sprite_Minimap_Character;

// Sprite Minimap Vehicle
function Sprite_Minimap_Vehicle() {
    this.initialize(...arguments);
}

Sprite_Minimap_Vehicle.prototype = Object.create(Sprite_Minimap_Character.prototype);
Sprite_Minimap_Vehicle.prototype.constructor = Sprite_Minimap_Character;

// Sprite Minimap Parallax
function Sprite_Minimap_Parallax() {
    this.initialize(...arguments);
}

Sprite_Minimap_Parallax.prototype = Object.create(Sprite.prototype);
Sprite_Minimap_Parallax.prototype.constructor = Sprite;

// Sprite Minimap Bottom
function Window_Minimap_Bottom() {
    this.initialize(...arguments);
}

Window_Minimap_Bottom.prototype = Object.create(Window_Base.prototype);
Window_Minimap_Bottom.prototype.constructor = Window_Base;

// Sprite Minimap Bottom Background
function Sprite_Minimap_Bottom_Background() {
    this.initialize(...arguments);
}

Sprite_Minimap_Bottom_Background.prototype = Object.create(Sprite.prototype);
Sprite_Minimap_Bottom_Background.prototype.constructor = Sprite;


(function() {

const PLUGIN_NAME = 'MK_Minimap';

const reject = (reason) => {
    const message = (
        "An Error has occurred in the Plugin %1: %2 " +
        "If the problem persists, contact the Plugin Creator."
    ).format(PLUGIN_NAME, reason);
    throw Error(message);
}

if (!PluginManager._parameters[PLUGIN_NAME.toLowerCase()]) {
    reject((
        "Please check that this plugin's filename is \"%1.js\". " +
        "Subdirectories (e.g.: js/plugins/xy/thisPlugin.js) are not allowed."
    ).format(PLUGIN_NAME));
}

const structure = (serialized, parameterName) => {
    if (!serialized) {
        reject((
            "The Plugin Parameter \"%1\" is missing. " +
            "Please check it in the Plugin Manager. It may help to re-install this Plugin (i.e.: remove, re-add)."
        ).format(parameterName));
    }
    try {
        return JSON.parse(serialized);
    
    } catch (e) {
        reject((
            "The Plugin Parameter \"%1\" is corrupted. " +
            "Please check it in the Plugin Manager. It may help to re-install this Plugin (i.e.: remove, re-add)."
        ).format(parameterName));
    }
}

const customFunction = (body, parameterName) => {
    if (!body) {
        reject((
            "The Plugin Parameter \"%1\" is missing. " +
            "Please check it in the Plugin Manager. It may help to re-install this Plugin (i.e.: remove, re-add)."
        ).format(parameterName));
    }
    try {
        return new Function(JSON.parse(body));
    
    } catch (e) {
        reject((
            "The Plugin Parameter \"%1\" contains an error and could not be interpreted. " +
            "Please check it in the Plugin Manager. It may also help to re-install this Plugin (i.e.: remove, re-add). " +
            "Cause: %2"
        ).format(parameterName, e));
    }
}

const params = PluginManager.parameters(PLUGIN_NAME);

const mapParams                         = structure(params.map, 'Map');
MK.Minimap.map                          = { }
MK.Minimap.isVisibleDefault             = 'true' == params.isVisible;
MK.Minimap.map.position                 = mapParams.position;
MK.Minimap.map.xEval                    = customFunction(mapParams.xEval, 'X Eval');
MK.Minimap.map.yEval                    = customFunction(mapParams.yEval, 'Y Eval');
MK.Minimap.map.widthEval                = mapParams.widthEval;
MK.Minimap.map.heightEval               = mapParams.heightEval;
MK.Minimap.map.opacityEval              = mapParams.opacityEval;
MK.Minimap.map.showParallax             = 'true' == mapParams.showParallax;

const whenExpandedParams                = structure(params.whenExpanded, 'when expanded');
MK.Minimap.whenExpanded                 = { };
MK.Minimap.whenExpanded.xEval           = customFunction(whenExpandedParams.xEval, 'when expanded -> X Eval');
MK.Minimap.whenExpanded.yEval           = customFunction(whenExpandedParams.yEval, 'when expanded: Y Eval');
MK.Minimap.whenExpanded.widthEval       = whenExpandedParams.widthEval;
MK.Minimap.whenExpanded.heightEval      = whenExpandedParams.heightEval;
MK.Minimap.whenExpanded.opacityEval     = whenExpandedParams.opacityEval;

const backgroundParams                  = structure(params.background, 'Background');
MK.Minimap.background                   = { };
MK.Minimap.background.design            = backgroundParams.design;
MK.Minimap.background.picture           = backgroundParams.picture;
MK.Minimap.background.overridePadding   = 'true' == backgroundParams.overridePadding;
MK.Minimap.background.padding           = Number(backgroundParams.padding) || 0;

const foregroundParams                  = structure(params.foreground, 'Foreground');
MK.Minimap.foreground                   = { };
MK.Minimap.foreground.show              = 'true' == foregroundParams.show;
MK.Minimap.foreground.picture           = foregroundParams.picture;
MK.Minimap.foreground.opacity           = Number(foregroundParams.opacity);

const bottomWindowParams                = structure(params.bottomWindow, 'Map Name Window');
MK.Minimap.bottomWindow                 = { };
MK.Minimap.bottomWindow.isVisibleEval   = customFunction(bottomWindowParams.isVisibleEval, 'Map Name Window -> is visible?');
MK.Minimap.bottomWindow.rectangleEval   = customFunction(bottomWindowParams.rectangleEval, 'Map Name Window: Rectangle');
MK.Minimap.bottomWindow.textEval        = customFunction(bottomWindowParams.textEval, 'Map Name Window -> Text');
MK.Minimap.bottomWindow.align           = bottomWindowParams.align.toLowerCase();
MK.Minimap.bottomWindow.design          = bottomWindowParams.design;
if ('Same as Map' == bottomWindowParams.design || 'Same as Minimap' == bottomWindowParams.design) {
    MK.Minimap.bottomWindow.design = MK.Minimap.background.design;
}
MK.Minimap.bottomWindow.picture         = bottomWindowParams.picture;
MK.Minimap.bottomWindow.opacity         = Number(bottomWindowParams.opacity);

const bottomWindowWhenExpandedParams                = structure(params.bottomWindowWhenExpanded, 'Map Name Window when expanded');
MK.Minimap.bottomWindowWhenExpanded                 = { };
MK.Minimap.bottomWindowWhenExpanded.isVisibleEval   = customFunction(bottomWindowWhenExpandedParams.isVisibleEval, 'Map Name Window when expanded -> is visible?');
MK.Minimap.bottomWindowWhenExpanded.rectangleEval   = customFunction(bottomWindowWhenExpandedParams.rectangleEval, 'Map Name Window when expanded -> Rectangle');
MK.Minimap.bottomWindowWhenExpanded.textEval        = customFunction(bottomWindowWhenExpandedParams.textEval, 'Map Name Window when expanded -> Text');
MK.Minimap.bottomWindowWhenExpanded.align           = bottomWindowWhenExpandedParams.align.toLowerCase();
MK.Minimap.bottomWindowWhenExpanded.opacity         = Number(bottomWindowWhenExpandedParams.opacity);

const fogOfWarParams                                = structure(params.fogOfWar, 'Fog of War');
MK.Minimap.fogOfWar                                 = { };
MK.Minimap.fogOfWar.active                          = 'true' == fogOfWarParams.active;
MK.Minimap.fogOfWar.color                           = Number(fogOfWarParams.color);
MK.Minimap.fogOfWar.sightRangeScales                = { };
MK.Minimap.fogOfWar.sightRangeScales.player         = Number(fogOfWarParams.sightRangeScaleDefault);
MK.Minimap.fogOfWar.sightRangeScales.boat           = Number(fogOfWarParams.sightRangeScaleWhenRidingBoat);
MK.Minimap.fogOfWar.sightRangeScales.ship           = Number(fogOfWarParams.sightRangeScaleWhenRidingShip);
MK.Minimap.fogOfWar.sightRangeScales.airship        = Number(fogOfWarParams.sightRangeScaleWhenRidingAirship);

const zoomParams                            = structure(params.zoomSettings, 'Zoom Settings');
MK.Minimap.zoomSettings                     = { };
MK.Minimap.zoomSettings.defaultValue        = Number(zoomParams.defaultZoomValue) || 0;
MK.Minimap.zoomSettings.valueWhenExpanded   = Number(zoomParams.zoomValueWhenExpanded) || 0;

const playerParams                      = structure(params.player, 'Player');
MK.Minimap.player                       = { };
MK.Minimap.player.mode                  = playerParams.mode;
MK.Minimap.player.color                 = Number(playerParams.color) || 0;
MK.Minimap.player.iconIndex             = Number(playerParams.iconIndex) || 0;
MK.Minimap.player.picture               = playerParams.picture;
MK.Minimap.player.scale                 = Number(playerParams.scale);
MK.Minimap.player.scaleWithMinimap      = 'true' == playerParams.scaleWithMinimap;
MK.Minimap.player.opacity               = Number(playerParams.opacity) || 0;
MK.Minimap.player.isBlinking            = 'true' == playerParams.blinking;
MK.Minimap.player.isRotate              = 'true' == playerParams.rotate;

const vehicleParams                     = structure(params.vehicles, 'Vehicles');
MK.Minimap.vehicles                     = { };
MK.Minimap.vehicles.mode                = vehicleParams.mode;
MK.Minimap.vehicles.scale               = Number(vehicleParams.scale || 1);
MK.Minimap.vehicles.scaleWithMinimap    = 'true' == vehicleParams.scaleWithMinimap;
MK.Minimap.vehicles.opacity             = Number(vehicleParams.opacity);
MK.Minimap.vehicles.isBlinking          = 'true' == vehicleParams.blinking;
MK.Minimap.vehicles.isRotate            = 'true' == vehicleParams.rotate;
MK.Minimap.vehicles.breakFogOfWar       = 'true' == vehicleParams.breakFogOfWar;
MK.Minimap.vehicles.sticksOnEdge        = 'true' == vehicleParams.sticksOnEdge;
MK.Minimap.vehicles.priorityWhenRiding  = vehicleParams.priority || 'Vehicle';

['boat', 'ship', 'airship'].forEach(type => {
    MK.Minimap[type]                    = { };
    MK.Minimap[type].iconIndex          = Number(vehicleParams[type + 'IconIndex'] || 0);
    MK.Minimap[type].picture            = vehicleParams[type + 'Picture'];
    MK.Minimap[type].color              = Number(vehicleParams[type + 'Color'] || 0);
});

const eventTemplateParams               = structure(params.eventTemplates, 'Event Templates').map(JSON.parse);
MK.Minimap.eventTemplates               = { };

for (const templateParams of eventTemplateParams) {
    const template                      = { };
    template.mode                       = templateParams.mode;
    template.iconIndex                  = Number(templateParams.iconIndex);
    template.picture                    = templateParams.picture;
    template.color                      = Number(templateParams.color) || 0;
    template.scale                      = Number(templateParams.scale);
    template.scaleWithMinimap           = 'true' == (templateParams.scaleWithMinimap || 'true');
    template.opacity                    = Number(templateParams.opacity) || 0;
    template.isBlinking                 = 'true' == templateParams.blinking;
    template.breakFogOfWar              = 'true' == templateParams.breakFogOfWar;
    template.isRotate                   = 'true' == templateParams.rotate;
    template.sticksOnEdge               = 'true' == templateParams.sticksOnEdge;
    template.freeze                     = 'true' == templateParams.freeze;
    MK.Minimap.eventTemplates[templateParams.name] = template;
}

// performance
MK.Minimap.getDownscaleFactorEval       = customFunction(params.getDownscaleFactorEval, 'Mipmapping, get Factor');
MK.Minimap.shouldDisplayDownscaleFactor = 'true' == params.shouldDisplayDownscaleFactor;
MK.Minimap.updateEventsInterval         = Number(params.updateEventsInterval) || 1;
MK.Minimap.listenForMapChanges          = 'true' == params.listenForMapChanges;
MK.Minimap.listenForSpawnedEvents       = 'true' == params.listenForSpawnedEvents;
MK.Minimap.showWalkAnimation            = 'false' !== params.showWalkAnimation;

// misc
MK.Minimap.addToOptions                 = 'true' == params.addToOptions;
MK.Minimap.blinkingEval                 = customFunction(params.blinkingEval, 'Blinking Eval');

const hotkeyParams                      = structure(params.hotkeys, 'Hotkeys');
MK.Minimap.hotkeys                      = { };
MK.Minimap.hotkeys.showHide             = Number(hotkeyParams.showHide);
MK.Minimap.hotkeys.expandCollapse       = Number(hotkeyParams.expandCollapse);
MK.Minimap.gamepadKeys                  = { };
MK.Minimap.gamepadKeys.showHide         = Number(hotkeyParams.showHide2);
MK.Minimap.gamepadKeys.expandCollapse   = Number(hotkeyParams.expandCollapse2);

const vocabularyParams                  = structure(params.vocabulary, 'Vocabulary');
MK.Minimap.vocabulary                   = { };
MK.Minimap.vocabulary.optionsMenuText   = vocabularyParams.optionsMenuText;


const colorCache = [ ];
function getColor(v) {
    if (!colorCache[v] && 'MZ' == Utils.RPGMAKER_NAME) {
        colorCache[v] = ColorManager.textColor(v);
    }
    if (!colorCache[v] && 'MV' == Utils.RPGMAKER_NAME) {
        colorCache[v] = new Window_Base(0, 0, 0, 0).textColor(v);
    }
    return colorCache[v];
}

function extractFolderAndFilename(path) {
    const splitted = path.split('/');
    return {
        folder: splitted.slice(0, splitted.length - 1).join('/') + '/',
        filename: splitted.pop(),
    };
}

function createList(n, initialValue) {
    return new Array(n).fill(initialValue);
}


// =====================================================================================
// Image Manager
// =====================================================================================

console.log(
    (
        "%1: Error messages such as \"File not found\" may appear. " +
        "You can safely ignore them. " +
        "For more info, visit: https://aerosys.blog/Minimap"
    ).format(PLUGIN_NAME)
);

const imageCache = { };

function safelyLoadBitmap(folder, name, factor) {
    const key = makeKey(folder, name, factor);

    if (imageCache[key]) {
        return imageCache[key];
    }

    if (shouldLoadBitmap(factor)) {
        const url = makeUrl(folder, name, factor);
        const bitmap = Bitmap.load(url);
        bitmap._callLoadListenersWhenError = true; // custom mod
        imageCache[key] = bitmap;
        
        return bitmap;
    }
    return null;
}

function shouldLoadBitmap(factor) {
    return 'MZ' == Utils.RPGMAKER_NAME || factor == 1 || !factor;
}

function getBitmap(folder, name, factor) {
    const key = makeKey(folder, name, factor);
    return imageCache[key];
}

function addBitmapToCache(folder, name, factor, bitmap) {
    const key = makeKey(folder, name, factor);
    imageCache[key] = bitmap;
}

function makeKey(folder, name, factor) {
    return '%1/%2_%3x'.format(folder, name, factor);
}

function makeUrl(folder, name, factor) {
    return factor > 1
        ? '%1_%2x/%3.png'.format(folder, factor, encode(name))
        : '%1/%2.png'.format(folder, encode(name));
}

function encode(name) {
    return 'MZ' == Utils.RPGMAKER_NAME
        ? Utils.encodeURI(name)
        : encodeURIComponent(name);
}

function areImagesReady() {
    return Object
        .values(imageCache)
        .filter(Boolean)
        .every(bitmap => bitmap.isReady() || bitmap.isError());
}

function downscaleBitmap(bitmap, factor) {
    if (factor == 1) return bitmap;

    const source = bitmap._canvas || bitmap._image;
    const toReturn = new Bitmap(bitmap.width / factor, bitmap.height / factor);

    toReturn.clearRect(0, 0, toReturn.width, toReturn.height);
    toReturn.context.globalCompositeOperation = 'source-over';

    toReturn.context.drawImage(
        source,
        0,
        0,
        bitmap.width,
        bitmap.height,
        0,
        0,
        bitmap.width / factor,
        bitmap.height / factor,
    );
    return toReturn;
}


// =====================================================================================
// Custom Bitmap
// =====================================================================================

const alias_Bitmap_onError = Bitmap.prototype._onError;
Bitmap.prototype._onError = function() {
    alias_Bitmap_onError.call(this);
    
    if (this._callLoadListenersWhenError) {
        this._callLoadListeners();
    }
}


// =====================================================================================
// Scene Boot
// =====================================================================================

const alias_SceneBoot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    alias_SceneBoot_start.call(this);

    const reject = (message) => { throw Error(message); }

    const extractTier = (pluginDescription) => {
        const match = /\[Tier\s+\d+\]/g.exec(pluginDescription);
        if (match && match[0]) {
            const number = /\d+/.exec(match[0])[0];
            return Number(number);
        }
        return null;
    }

    const isListSorted = (list) => {
        if (list && list.length > 1) {
            for (let i = 1; i < list.length; i++) {
                if (list[i] < list[i - 1]) {
                    return false;
                }
            }
        }
        return true;
    }

    const mkTiers = $plugins
        .filter(plugin => plugin && plugin.status && plugin.name.startsWith('MK_'))
        .map(plugin => extractTier(plugin.description))
        .filter(tier => tier === 0 || tier > 0);
    
    if (!isListSorted(mkTiers)) {
        reject("MK Plugins are not in correct order. "
            + "Please go into the Plugin Manager and sort all the Plugins starting with \"MK\" "
            + "according to their tiers (Tier 0, Tier 1, ...)"
        );
    }

    // Hot Keys
    if (MK.Minimap.hotkeys.showHide || MK.Minimap.hotkeys.showHide === 0) {
        Input.keyMapper[MK.Minimap.hotkeys.showHide] = 'showHideMinimap';
    }
    if (MK.Minimap.hotkeys.expandCollapse || MK.Minimap.hotkeys.expandCollapse === 0) {
        Input.keyMapper[MK.Minimap.hotkeys.expandCollapse] = 'expandCollapseMinimap';
    }

    // Controller Support
    if (MK.Minimap.gamepadKeys.showHide || MK.Minimap.gamepadKeys.showHide === 0) {
        Input.gamepadMapper[MK.Minimap.gamepadKeys.showHide] = 'showHideMinimap';
    }
    if (MK.Minimap.gamepadKeys.expandCollapse || MK.Minimap.gamepadKeys.expandCollapse === 0) {
        Input.gamepadMapper[MK.Minimap.gamepadKeys.expandCollapse] = 'expandCollapseMinimap';
    }
}


// =====================================================================================
// Spriteset Minimap
// =====================================================================================

Spriteset_Minimap.prototype.initialize = function(width, height) {
    if (typeof Sprite_Clickable !== 'undefined') {
        Sprite_Clickable.prototype.initialize.call(this);
    } else {
        Sprite.prototype.initialize.call(this);
    }

    this.visible = false;
    this.width = width;
    this.height = height;

    MK.Minimap.updateDownscaleFactor();
    MK.Minimap.updateZoomFactor();
    
    this.createBackground();
    this.createParallax();
    this.createMap();
    this.createEvents();
    this.createForeground();
    this.createDownscaleFactorWindow();
    this.update();
}

Spriteset_Minimap.prototype.createMap = function() {
    this.mapSprite = new Sprite_Minimap(
        ($gameMap.width() * $gameMap.tileWidth()) / MK.Minimap.downscaleFactor(),
        ($gameMap.height() * $gameMap.tileHeight()) / MK.Minimap.downscaleFactor(),
    );
    this.addChild(this.mapSprite);
}

Spriteset_Minimap.prototype.createEvents = function() {
    $gameMap.events()
        .map(event => new Sprite_Minimap_Event(event))
        .forEach(sprite => this.mapSprite.addChild(sprite));
    
    this.mapSprite.addChild(new Sprite_Minimap_Vehicle($gameMap.boat(), 'boat'));
    this.mapSprite.addChild(new Sprite_Minimap_Vehicle($gameMap.ship(), 'ship'));
    this.mapSprite.addChild(new Sprite_Minimap_Vehicle($gameMap.airship(), 'airship'));
    this.mapSprite.addChild(new Sprite_Minimap_Player());
}

Spriteset_Minimap.prototype.createBackground = function() {
    
    if ('Window' == MK.Minimap.background.design) {
        if ('MZ' == Utils.RPGMAKER_NAME) {
            const rectangle = new Rectangle(0, 0, this.width, this.height);
            this.background = new Window_Base(rectangle);
        } else {
            this.background = new Window_Base(0, 0, this.width, this.height);
        }
        this.addChild(this.background);
    }
    if ('Picture' == MK.Minimap.background.design && MK.Minimap.background.picture) {
        const path      = MK.Minimap.background.picture;
        const folder    = 'img/' + extractFolderAndFilename(path).folder;
        const filename  = extractFolderAndFilename(path).filename;
        const bitmap    = ImageManager.loadBitmap(folder, filename);
    
        this.background = new Sprite(bitmap);
        this.addChild(this.background);
    }
}

Spriteset_Minimap.prototype.createParallax = function() {
    if (this.isParallaxVisible()) {
        this.parallax = new Sprite_Minimap_Parallax();
        this.addChild(this.parallax);
    }
}

Spriteset_Minimap.prototype.isParallaxVisible = function() {
    return (
        $dataMap &&
        $dataMap.meta &&
        ($dataMap.meta['Minimap Parallax'] || MK.Minimap.map.showParallax) &&
        !$dataMap.meta['Minimap No Parallax']
    );
}

Spriteset_Minimap.prototype.createForeground = function() {
    if (MK.Minimap.foreground.show && MK.Minimap.foreground.picture) {
        const path      = MK.Minimap.foreground.picture;
        const folder    = 'img/' + extractFolderAndFilename(path).folder;
        const filename  = extractFolderAndFilename(path).filename;
        const bitmap    = ImageManager.loadBitmap(folder, filename);

        this.foreground = new Sprite(bitmap);
        this.addChild(this.foreground);
    }
}

Spriteset_Minimap.prototype.createDownscaleFactorWindow = function() {
    if (!MK.Minimap.shouldDisplayDownscaleFactor) return;
    if (!$gameTemp.isPlaytest()) return;

    if ('MZ' == Utils.RPGMAKER_NAME) {
        const rectangle = new Rectangle(0, 0, this.width, this.height);
        const window = new Window_DownscaleFactor(rectangle);
        this.addChild(window);
    }
    if ('MV' == Utils.RPGMAKER_NAME) {
        const window = new Window_DownscaleFactor(0, 0, this.width, this.height);
        this.addChild(window);
    }
}

Spriteset_Minimap.prototype.update = function() {
    this.updateMain();
    this.updateMapScaleAndPosition();

    if (MK.Minimap.listenForSpawnedEvents) {
        this.updateEvents();
    }

    typeof Sprite_Clickable !== 'undefined'
        ? Sprite_Clickable.prototype.update.call(this)
        : Sprite.prototype.update.call(this);

    if (this.parallax) {
        this.parallax.scale.x = (this.mapSprite.width * this.mapSprite.scale.x)
                                    / this.parallax.width;
        this.parallax.scale.y = (this.mapSprite.height * this.mapSprite.scale.y)
                                    / this.parallax.height;
        this.parallax.move(this.mapSprite.x, this.mapSprite.y);
    }

    if (this.background) {
        this.background.scale.x = this.width / this.background.width;
        this.background.scale.y = this.height / this.background.height;
    }

    if (this.foreground) {
        this.foreground.scale.x = this.width / this.foreground.width;
        this.foreground.scale.y = this.height / this.foreground.height;
    }
}

Spriteset_Minimap.prototype.updateMain = function() {
    const scene = SceneManager._scene;
    const targetWidth = MK.Minimap.isExpanded()
        ? eval(MK.Minimap.whenExpanded.widthEval)
        : eval(MK.Minimap.map.widthEval);
    const targetHeight = MK.Minimap.isExpanded()
        ? eval(MK.Minimap.whenExpanded.heightEval)
        : eval(MK.Minimap.map.heightEval);
    
    if (isNaN(targetWidth)) rejectParameterValue('Minimap width', targetWidth);
    if (isNaN(targetHeight)) rejectParameterValue('Minimap height', targetHeight);

    const x = MK.Minimap.isExpanded()
        ? MK.Minimap.whenExpanded.xEval.call(scene, targetWidth)
        : MK.Minimap.map.xEval.call(scene, MK.Minimap.map.position, targetWidth);
    const y = MK.Minimap.isExpanded()
        ? MK.Minimap.whenExpanded.yEval.call(scene, targetHeight)
        : MK.Minimap.map.yEval.call(scene, MK.Minimap.map.position, targetHeight);
    const opacity = MK.Minimap.isExpanded()
        ? Number(eval(MK.Minimap.whenExpanded.opacityEval))
        : Number(eval(MK.Minimap.map.opacityEval));

    if (isNaN(x)) rejectParameterValue('Minimap x', x);
    if (isNaN(y)) rejectParameterValue('Minimap y', y);
    if (isNaN(opacity)) rejectParameterValue('Minimap opacity', opacity);
    
    this.move(x, y);
    this.width = targetWidth;
    this.height = targetHeight;
    this.opacity = opacity;
    this.visible = MK.Minimap.isVisible();
}

Spriteset_Minimap.prototype.updateMapScaleAndPosition = function() {
    const zoom              = MK.Minimap.zoomValue();
    const scale             = this.getScale();
    const downscaleFactor   = MK.Minimap.downscaleFactor();
    const mapWidth          = this.mapSprite.width * scale;
    const mapHeight         = this.mapSprite.height * scale;
    
    this.mapSprite.move(
        ((this.width - 2 * this.padding()) - mapWidth) / 2 + this.padding(),
        ((this.height - 2 * this.padding()) - mapHeight) / 2 + this.padding(),
    );
    this.mapSprite.scale.x = scale;
    this.mapSprite.scale.y = scale;
    
    if (zoom) {
        const frameWidth    = Graphics.width * zoom / downscaleFactor;
        const frameHeight   = Graphics.height * zoom / downscaleFactor;
        const xFrame        = $gamePlayer._realX * $gameMap.tileWidth() / downscaleFactor - 0.5 * this.mapSprite.width + 0.5 * $gameMap.tileWidth() / downscaleFactor;
        const yFrame        = $gamePlayer._realY * $gameMap.tileHeight() / downscaleFactor - 0.5 * this.mapSprite.height + 0.5 * $gameMap.tileHeight() / downscaleFactor;
        const xMax          = $gameMap.width() * $gameMap.tileWidth() / downscaleFactor - frameWidth;
        const yMax          = $gameMap.height() * $gameMap.tileHeight() / downscaleFactor - frameHeight;
        
        this.mapSprite.setFrame(
            xFrame.clamp(0, xMax),
            yFrame.clamp(0, yMax),
            frameWidth,
            frameHeight,
        );
    } else {
        this.mapSprite.setFrame(
            0,
            0,
            $gameMap.width() * $gameMap.tileWidth() / downscaleFactor,
            $gameMap.height() * $gameMap.tileHeight() / downscaleFactor,
        );
    }
}

Spriteset_Minimap.prototype.updateEvents = function() {
    const gameEventIds = $gameMap.events().map(event => event.eventId());
    const spriteEventIds = this.mapSprite.children
        .filter(sprite => sprite && sprite.event && sprite.event.eventId)
        .map(sprite => sprite.event.eventId());
    
    // add new Events
    $gameMap.events()
        .filter(event => !spriteEventIds.includes(event.eventId()))
        .map(event => new Sprite_Minimap_Event(event))
        .forEach(sprite => this.mapSprite.addChild(sprite));
    
    // remove expired Events
    this.mapSprite.children
        .filter(sprite => sprite && sprite.event && sprite.event.eventId)
        .filter(sprite => !gameEventIds.includes(sprite.event.eventId()))
        .forEach(sprite => this.mapSprite.removeChild(sprite));
}

Spriteset_Minimap.prototype.getScale = function() {
    return (MK.Minimap.zoomValue()
        ? Math.min(
            ((this.width - (2 * this.padding())) / Graphics.width) / MK.Minimap.zoomValue(),
            ((this.height - (2 * this.padding())) / Graphics.height) / MK.Minimap.zoomValue(),
        )
        : Math.min(
            (this.width - (2 * this.padding())) / ($gameMap.width() * $gameMap.tileWidth()),
            (this.height - (2 * this.padding())) / ($gameMap.height() * $gameMap.tileHeight()),
        )
    ) * MK.Minimap.downscaleFactor();
}

Spriteset_Minimap.prototype.onClick = function() {
    MK.Minimap.toggleExpand();
}

Spriteset_Minimap.prototype.padding = function() {
    if (MK.Minimap.background.overridePadding) {
        return MK.Minimap.background.padding;
    }
    if ('Window' == MK.Minimap.background.design && 'MZ' == Utils.RPGMAKER_NAME) {
        return $gameSystem.windowPadding();
    }
    if ('Window' == MK.Minimap.background.design && 'MV' == Utils.RPGMAKER_NAME) {
        return Window_Base.prototype.standardPadding.call(this);
    }
    return 0;
}


// =====================================================================================
// Sprite Minimap
// =====================================================================================

const hash = (values, updateInterval, size) => {
    const a = Math.floor(values.length / size) * updateInterval;
    const b = Math.floor(values.length / size) * (updateInterval + 1);
    return values.slice(a, b).reduce((total, v) => (31 * total + v) % 2347, 1);
}

Sprite_Minimap.prototype.initialize = function(width, height) {
    if (MK.Minimap._cachedBitmap && !this.requiresRedraw()) {
        Sprite.prototype.initialize.call(this, MK.Minimap._cachedBitmap);
        this._isReady = true;
    } else {
        MK.Minimap._cachedBitmap = new Bitmap(width, height);
        Sprite.prototype.initialize.call(this, MK.Minimap._cachedBitmap);
        this._isReady = false;
        this._requiresRefresh = true;
    }
    this.loadSourceBitmaps();
}

Sprite_Minimap.prototype.loadSourceBitmaps = function() {
    const factor                    = MK.Minimap.downscaleFactor();
    const tilesetData               = $dataTilesets[$gameMap.tilesetId()];
    const tilesetNames              = tilesetData && tilesetData.tilesetNames
                                        ? tilesetData.tilesetNames.filter(Boolean)
                                        : [ ];
    const bitmapsToLoad             = [ ];
    this._sourceBitmapsOrganized    = false;

    tilesetNames.forEach(name => {
        const bitmap1 = safelyLoadBitmap('img/tilesets', name, 1);
        bitmapsToLoad.push(bitmap1);
        
        if (factor > 1) {
            const bitmap2 = safelyLoadBitmap('img/tilesets', name, factor);
            bitmapsToLoad.push(bitmap2);
        }
    });
    bitmapsToLoad
        .filter(Boolean)
        .forEach(bitmap => bitmap.addLoadListener(this.onTilesetBitmapLoaded.bind(this)));

    if (!bitmapsToLoad.length) {
        this.organizeSourceBitmaps();
    }
}

Sprite_Minimap.prototype.onTilesetBitmapLoaded = function() {
    if (areImagesReady() && !this._sourceBitmapsOrganized) {
        this._sourceBitmapsOrganized = true;
        this.organizeSourceBitmaps();
    }
}

Sprite_Minimap.prototype.organizeSourceBitmaps = function() {
    const factor            = MK.Minimap.downscaleFactor();
    const tilesetData       = $dataTilesets[$gameMap.tilesetId()];
    const tilesetNames      = tilesetData ? tilesetData.tilesetNames : [ ];
    this.tilesetBitmaps     = tilesetNames.map(() => null);
    
    tilesetNames.forEach((name, index) => {

        if (name) {
            if (factor > 1) {
                const bitmap1 = getBitmap('img/tilesets', name, 1);
                const bitmap2 = getBitmap('img/tilesets', name, factor);

                if (bitmap2 && bitmap2.isReady() && !bitmap2.isError()) {
                    this.tilesetBitmaps[index] = bitmap2;
                } else {
                    this.tilesetBitmaps[index] = downscaleBitmap(bitmap1, factor);
                    addBitmapToCache('img/tilesets', name, factor, this.tilesetBitmaps[index]);
                }
            } else {
                this.tilesetBitmaps[index] = getBitmap('img/tilesets', name, 1);
            }
        } else {
            this.tilesetBitmaps[index] = null;
        }
    });
    this._isReady = true;
}

Sprite_Minimap.prototype.update = function() {
    Sprite.prototype.update.call(this);

    if (this.isReady() && this.requiresRedraw()) {
        this._requiresRefresh = false;
        MK.Minimap._cachedMapId = $gameMap.mapId();
        MK.Minimap._cachedTilesetId = $gameMap.tilesetId();
        
        this._hashes = [ ];
        for (let i = 0; MK.Minimap.listenForMapChanges && i < 50; i++) {
            this._hashes[i] = hash($dataMap.data, i, 50);
        }
        
        if (MK.Minimap._cachedTilesetId != $gameMap.tilesetId()) {
            this.loadSourceBitmaps();
        }
        this.performDraw();
    }
}

Sprite_Minimap.prototype.requiresRedraw = function() {
    return (
        this._requiresRefresh ||
        MK.Minimap._cachedMapId != $gameMap.mapId() ||
        MK.Minimap._cachedTilesetId != $gameMap.tilesetId() ||
        (MK.Minimap.listenForMapChanges && this.hasMapBeenManipulated())
    );
}

Sprite_Minimap.prototype.hasMapBeenManipulated = function() {
    this._updateInterval = ((this._updateInterval || 0) + 1).mod(50);

    return (
        !this._hashes ||
        this._hashes[this._updateInterval] != hash($gameMap.data(), this._updateInterval, 50)
    );
}

Sprite_Minimap.prototype.performDraw = function() {
    this.bitmap.clear();
    
    for (let x = 0; x < $gameMap.width(); x++) {
        for (let y = 0; y < $gameMap.height(); y++) {
            this.drawSpot(x, y);
        }
    }
}

Sprite_Minimap.prototype.drawSpot = function(x, y) {
    if (this.isSpotVisible(x, y)) {
        this.drawDiscoveredSpot(x, y);
    } else {
        this.drawCoveredSpot(x, y);
    }
}

Sprite_Minimap.prototype.isSpotVisible = function(x, y) {
    return (
        !MK.Minimap.fogOfWar.shouldShow() ||
        MK.Minimap.fogOfWar.isDiscovered(x, y)
    );
}

Sprite_Minimap.prototype.drawDiscoveredSpot = function(x, y) {
    const f = MK.Minimap.downscaleFactor();
    
    this.bitmap.clearRect(
        x * $gameMap.tileWidth() / f,
        y * $gameMap.tileHeight() / f,
        $gameMap.tileWidth() / f,
        $gameMap.tileHeight() / f,
    );
    for (let z = 0; z < 4; z++) {
        const tileId = $gameMap.tileId(x, y, z);

        if      (Tilemap.isTileA5(tileId))      this.drawTileA5(tileId, x, y);
        else if (Tilemap.isAutotile(tileId))    this.drawAutotile(tileId, x, y);
        else if (tileId)                        this.drawBTile(tileId, x, y);
    }
}

Sprite_Minimap.prototype.drawAutotile = function(tileId, x, y) {
    const w = $gameMap.tileWidth();
    const h = $gameMap.tileHeight();
    const w1 = w / 2;
    const h1 = h / 2;
    const kind = Tilemap.getAutotileKind(tileId);
    const shape = Tilemap.getAutotileShape(tileId);
    const tx = kind % 8;
    const ty = Math.floor(kind / 8);
    let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    let tilesetNumber, bx, by;

    if (Tilemap.isTileA1(tileId)) {
        tilesetNumber = 0;

        if (kind == 0) {
            bx = 0;
            by = 0;
        }
        else if (kind == 1) {
            bx = 0;
            by = 3;
        }
        else if (kind == 2) {
            bx = 6;
            by = 0;
        }
        else if (kind == 3) {
            bx = 6;
            by = 3;
        }
        else {
            bx = Math.floor(tx / 4) * 8;
            by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;

            if (kind % 2 != 0) {
                bx += 6;
                autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
            }
        }
    }
    if (Tilemap.isTileA2(tileId)) {
        tilesetNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
    }
    if (Tilemap.isTileA3(tileId)) {
        tilesetNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    }
    if (Tilemap.isTileA4(tileId)) {
        tilesetNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
    }
    
    for (let i = 0; i < 4; i++) {
        const qsx = autotileTable[shape][i][0];
        const qsy = autotileTable[shape][i][1];
        const sx  = (bx * 2 + qsx) * w1;
        const sy  = (by * 2 + qsy) * h1;
        const dx  = (i % 2) * w1 + (w * x);
        const dy  = Math.floor(i / 2) * h1 + (h * y);
        
        this.blt(
            tilesetNumber,
            sx,
            sy,
            w1,
            h1,
            dx,
            dy,
        );
    }
}

Sprite_Minimap.prototype.drawTileA5 = function(tileId, x, y) {
    this.drawNormalTile(4, tileId, x, y);
}

Sprite_Minimap.prototype.drawBTile = function(tileId, x, y) {
    const tilesetNumber = Math.floor(tileId / 256) + 5;
    this.drawNormalTile(tilesetNumber, tileId, x, y);
}

Sprite_Minimap.prototype.drawNormalTile = function(tilesetNumber, tileId, x, y) {
    const w = $gameMap.tileWidth();
    const h = $gameMap.tileHeight();
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * w;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * h;
    
    this.blt(
        tilesetNumber,
        sx,
        sy,
        w,
        h,
        w * x,
        h * y,
    );
}

Sprite_Minimap.prototype.drawCoveredSpot = function(x, y) {
    const f = MK.Minimap.downscaleFactor();
    
    this.bitmap.fillRect(
        x * $gameMap.tileWidth() / f,
        y * $gameMap.tileHeight() / f,
        $gameMap.tileWidth() / f,
        $gameMap.tileHeight() / f,
        getColor(MK.Minimap.fogOfWar.color),
    );
}

Sprite_Minimap.prototype.blt = function(tilesetNumber, sx, sy, w, h, dx, dy) {
    const f = MK.Minimap.downscaleFactor();
    const tilesetBitmap = this.tilesetBitmaps[tilesetNumber];
    
    if (tilesetBitmap) {
        this.bitmap.blt(
            tilesetBitmap,
            sx / f,
            sy / f,
            w / f,
            h / f,
            dx / f,
            dy / f,
        );
    }
    else {
        this.bitmap.clearRect(
            dx / f,
            dy / f,
            w / f,
            h / f,
        );
    }
}

Sprite_Minimap.prototype.isReady = function() {
    return this._isReady;
}

const findLastIndex = (list, f) => {
    if (list.length == 0) return -1;
    
    for (let i = list.length - 1; i >= 0; i--) {
        if (f.call(this, list[i])) {
            return i + 1;
        }
    }
    return -1;
}

Sprite_Minimap.prototype.addChild = function(sprite) {
    sprite.z = sprite.z || 0;
    const index = findLastIndex(this.children, _sprite => _sprite.z <= sprite.z)
    
    this.addChildAt(sprite, index != -1 ? index : 0);
}

// VS Compatibility
Sprite_Minimap.prototype.destroyCoreEngineMarkedBitmaps = function() { }


// =====================================================================================
// Sprite Character
// =====================================================================================

Sprite_Minimap_Character.prototype.initialize = function(event) {
    this.event = event;
    Sprite.prototype.initialize.call(this, new Bitmap());
}

Sprite_Minimap_Character.prototype.update = function() {
    this.visible = this.isVisible();
    this._updateCounter = ((this._updateCounter || 0) + 1).mod(MK.Minimap.updateEventsInterval);

    if (this._updateCounter == 0 && this.isVisible) {
        Sprite.prototype.update.call(this);

        this.updateModeIfRequired();
        
        if (MK.Minimap.showWalkAnimation || (this.direction != this.event.direction())) {
            this.direction = this.event.direction();

            this.updateFrame();
        }
        this.updatePosition();
        
        this.z = this.getZ();
        this.scale.x = this.getScale();
        this.scale.y = this.getScale();
        this.opacity = this.getOpacity();
        this.rotation = this.getRotation();
    }
}

Sprite_Minimap_Character.prototype.updateModeIfRequired = function() {
    if (this.requiresRefresh()) {
        this.mode           = this.getMode();
        this.iconIndex      = this.getIconIndex();
        this.tilesetId      = $gameMap.tilesetId();
        this.tileId         = this.event.tileId();
        this.characterName  = this.event.characterName();
        this.characterIndex = this.event.characterIndex();
        this.pictureName    = this.getPicture();
        
        this.updateBitmap();
        this.updateFrame();
    }
}

Sprite_Minimap_Character.prototype.requiresRefresh = function() {
    return this.mode != this.getMode()
        || this.iconIndex != this.getIconIndex()
        || this.tilesetId != $gameMap.tilesetId()
        || this.tileId != this.event.tileId()
        || this.characterName != this.event.characterName()
        || this.characterIndex != this.event.characterIndex()
        || this.pictureName != this.getPicture();
}

Sprite_Minimap_Character.prototype.updateBitmap = function() {
    if ('Square' == this.mode) {
        const s = $gameMap.tileWidth();
        this.bitmap = new Bitmap(s, s);
        this.bitmap.fillRect(
            0,
            0,
            s,
            s,
            getColor(this.getColor()),
        );
    }
    else if ('Dot' == this.mode) {
        const s = $gameMap.tileWidth();
        this.bitmap = new Bitmap(s, s);
        this.bitmap.drawCircle(
            s / 2,
            s / 2,
            s / 2,
            getColor(this.getColor()),
        );
    }
    else if ('Icon' == this.mode) {
        this.bitmap = ImageManager.loadSystem('IconSet');
    }
    else if ('Picture' == this.mode) {
        const pictureName = this.getPicture();
        this.bitmap = ImageManager.loadPicture(pictureName);
    }
    else if ('Sprite' == this.mode && this.characterName) {
        this.bitmap = ImageManager.loadCharacter(this.characterName);
        this.isBigCharacter = ImageManager.isBigCharacter(this.characterName);
    }
    else if ('Sprite' == this.mode && this.tileId) {
        const tileset       = $gameMap.tileset();
        const setNumber     = Math.floor(this.tileId / 256) + 5;
        const tilesetName   = tileset.tilesetNames[setNumber];
        this.bitmap         = ImageManager.loadTileset(tilesetName);
    }
    else {
        this.bitmap = new Bitmap();
    }

    this.anchor.x = 0.5;
    this.anchor.y = 'Sprite' == this.mode ? 1.0 : 0.5;

    if (!MK.Minimap.showWalkAnimation) {
        this.bitmap.addLoadListener(() => this.updateFrame());
    }
}

Sprite_Minimap_Character.prototype.updateFrame = function() {
    if ('Sprite' == this.mode && this.tileId) {
        const pw = $gameMap.tileWidth();
        const ph = $gameMap.tileHeight();
        const sx = ((Math.floor(this.tileId / 128) % 2) * 8 + (this.tileId % 8)) * pw;
        const sy = (Math.floor((this.tileId % 256) / 8) % 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }
    if ('Sprite' == this.mode && this.characterName) {
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
        const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
        this.setFrame(sx, sy, pw, ph);
    }
    if ('Picture' == this.mode) {
        this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
    }
    if ('Icon' == this.mode) {
        const pw = ImageManager.iconWidth || Window_Base._iconWidth;
        const ph = ImageManager.iconHeight || Window_Base._iconHeight;
        const sx = (this.getIconIndex() % 16) * pw;
        const sy = Math.floor(this.getIconIndex() / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }
    if ('Square' == this.mode || 'Dot' == this.mode) {
        this.setFrame(0, 0, $gameMap.tileWidth(), $gameMap.tileHeight());
    }
}

Sprite_Minimap_Character.prototype.updatePosition = function() {
    this.move(
        this.getUnclampedXPosition().clamp(this.xMin(), this.xMax()),
        this.getUnclampedYPosition().clamp(this.yMin(), this.yMax()),
    );
}

Sprite_Minimap_Character.prototype.getUnclampedXPosition = function() {
    if (MK.Minimap.zoomValue()) {
        const screenTileX = Math.round((Graphics.width / $gameMap.tileWidth()) * 16) / 16 * MK.Minimap.zoomValue();
        const centerX = (screenTileX - 1) / 2;
        const endX = $gameMap.width() - screenTileX;
        const displayX = endX < 0 ? endX / 2 : ($gamePlayer._realX - centerX).clamp(0, endX);
        const scrolledX = this.mapX() - displayX;
        return (scrolledX + this.anchor.x) * $gameMap.tileWidth() / MK.Minimap.downscaleFactor();
    } else {
        return (this.mapX() + this.anchor.x) * $gameMap.tileWidth() / MK.Minimap.downscaleFactor();
    }
}

Sprite_Minimap_Character.prototype.mapX = function() {
    return this.event._realX;
}

Sprite_Minimap_Character.prototype.getUnclampedYPosition = function() {
    if (MK.Minimap.zoomValue()) {
        const screenTileY = Math.round((Graphics.height / $gameMap.tileHeight()) * 16) / 16 * MK.Minimap.zoomValue();
        const centerY = (screenTileY - 1) / 2;
        const endY = $gameMap.height() - screenTileY;
        const displayY = endY < 0 ? endY / 2 : ($gamePlayer._realY - centerY).clamp(0, endY);
        const scrolledY = this.mapY() - displayY;
        return (scrolledY + this.anchor.y) * $gameMap.tileHeight() / MK.Minimap.downscaleFactor();
    } else {
        return (this.mapY() + this.anchor.y) * $gameMap.tileHeight() / MK.Minimap.downscaleFactor();
    }
}

Sprite_Minimap_Character.prototype.mapY = function() {
    return this.event._realY;
}

Sprite_Minimap_Character.prototype.xMin = function() {
    return 0;
}

Sprite_Minimap_Character.prototype.yMin = function() {
    return 0;
}

Sprite_Minimap_Character.prototype.xMax = function() {
    return MK.Minimap.zoomValue()
        ? Graphics.width * MK.Minimap.zoomValue() / MK.Minimap.downscaleFactor()
        : $gameMap.width() * $gameMap.tileWidth() / MK.Minimap.downscaleFactor();
}

Sprite_Minimap_Character.prototype.yMax = function() {
    return MK.Minimap.zoomValue()
        ? Graphics.height * MK.Minimap.zoomValue() / MK.Minimap.downscaleFactor()
        : $gameMap.height() * $gameMap.tileHeight() / MK.Minimap.downscaleFactor();
}

Sprite_Minimap_Character.prototype.patternWidth = function() {
    return this.bitmap.width / (this.isBigCharacter ? 3 : 12);
}

Sprite_Minimap_Character.prototype.patternHeight = function() {
    return this.bitmap.height / (this.isBigCharacter ? 4 : 8);
}

Sprite_Minimap_Character.prototype.characterPatternX = function() {
    return MK.Minimap.showWalkAnimation && this.showStepAnimation()
        ? this.event.pattern()
        : 1;
}

Sprite_Minimap_Character.prototype.showStepAnimation = function() {
    return true;
}

Sprite_Minimap_Character.prototype.characterPatternY = function() {
    return (this.event.direction() - 2) / 2;
}

Sprite_Minimap_Character.prototype.characterBlockX = function() {
    return this.isBigCharacter
        ? 0
        : Math.floor(this.event.characterIndex() % 4) * 3;
}

Sprite_Minimap_Character.prototype.characterBlockY = function() {
    return this.isBigCharacter
        ? 0
        : Math.floor(this.event.characterIndex() / 4) * 4;
}

Sprite_Minimap_Character.prototype.getMode = function() {
    return 'Sprite';
}

Sprite_Minimap_Character.prototype.getIconIndex = function() {
    return 0;
}

Sprite_Minimap_Character.prototype.getPicture = function() {
    return null;
}

Sprite_Minimap_Character.prototype.getColor = function() {
    return 0;
}

Sprite_Minimap_Character.prototype.getZ = function() {
    return 'Sprite' == this.mode
        ? this.event.screenZ()
        : 10;
}

Sprite_Minimap_Character.prototype.getScale = function() {
    const parent = SceneManager._scene ? SceneManager._scene._minimapSprite : null;
    if (!parent) {
        return 0.0;
    }
    return this.scaleWithMinimap()
        ? this.getScaleValue() / MK.Minimap.downscaleFactor()
        : this.getScaleValue() / parent.mapSprite.scale.x
}

Sprite_Minimap_Character.prototype.getScaleValue = function() {
    return 1.0;
}

Sprite_Minimap_Character.prototype.scaleWithMinimap = function() {
    return false; // !!
}

Sprite_Minimap_Character.prototype.getOpacity = function() {
    return this.isBlinking()
        ? MK.Minimap.blinkingEval.call(this)
        : this.getOriginalOpacity();
}

Sprite_Minimap_Character.prototype.getOriginalOpacity = function() {
    return 255;
}

Sprite_Minimap_Character.prototype.isBlinking = function() {
    return false;
}

Sprite_Minimap_Character.prototype.isVisible = function() {
    return (
        (
            MK.Minimap.fogOfWar.isDiscovered(this.event.x, this.event.y) ||
            this.breakFogOfWar()
        ) &&
        ['Square', 'Dot', 'Sprite', 'Icon', 'Picture'].includes(this.mode) &&
        (this.sticksOnEdge() || this.isInFrame())
    );
}

Sprite_Minimap_Character.prototype.breakFogOfWar = function() {
    return false;
}

Sprite_Minimap_Character.prototype.getRotation = function() {
    if (this.isRotate()) {
        switch (this.event.direction()) {
            case 2: return 1.0 * Math.PI;
            case 4: return 1.5 * Math.PI;
            case 6: return 0.5 * Math.PI;
            case 8: return 0;
        }
    }
    return 0;
}

Sprite_Minimap_Character.prototype.isRotate = function() {
    return false;
}

Sprite_Minimap_Character.prototype.isInFrame = function() {
    const x1 = this.width / MK.Minimap.zoomValue() / 2
    const y1 = this.height / MK.Minimap.zoomValue() / 2

    return !MK.Minimap.zoomValue() || (
           this.xMin() < this.getUnclampedXPosition() - x1
        && this.yMin() < this.getUnclampedYPosition() - y1
        && this.getUnclampedXPosition() + x1 < this.xMax()
        && this.getUnclampedYPosition() + y1 < this.yMax()
    );
}

Sprite_Minimap_Character.prototype.sticksOnEdge = function() {
    return false;
}


// =====================================================================================
// Sprite Event
// =====================================================================================

Sprite_Minimap_Event.prototype.initialize = function(event) {
    this.event = event;
    this.scanForAnnotation();
    Sprite_Minimap_Character.prototype.initialize.call(this, event);
}

Sprite_Minimap_Event.prototype.update = function() {
    if (this.requiresRefresh()) {
        this.scanForAnnotation();
    }
    Sprite_Minimap_Character.prototype.update.call(this);

    this.pageIndex = this.event._pageIndex;
    this._dpLastQuestGuideId = ($gameSystem && $gameSystem.questGuideId)
        ? String($gameSystem.questGuideId() || '')
        : '';
}

Sprite_Minimap_Event.prototype.requiresRefresh = function() {
    const questId = ($gameSystem && $gameSystem.questGuideId)
        ? String($gameSystem.questGuideId() || '')
        : '';

    return (
        Sprite_Minimap_Character.prototype.requiresRefresh.call(this) ||
        this.pageIndex !== this.event._pageIndex ||
        this._dpLastQuestGuideId !== questId
    );
}

Sprite_Minimap_Event.prototype.getMode = function() {
    return this.annotation
        ? this.annotation.mode
        : Sprite_Minimap_Character.prototype.getMode.call(this);
}

Sprite_Minimap_Event.prototype.scanForAnnotation = function() {
    const templateName = this.findTemplateName();
    this.annotation = templateName ? MK.Minimap.eventTemplates[templateName] : null;
}

// Dry Promise movement-only marker helpers.
// These helpers recognize only map/location movement objectives. Citizen/NPC
// conversations, Talos, Pheme reporting, puzzles, etc. keep their old logic.
const DP_MOVE_TARGET_TOKENS = [
    '입구', '출구', '가는길', '가는 길', '돌아가기', '방향',
    '계단', '출입문', '시민회의장', '청문회장',
    '집무실문', '집무실가는길', '정면자리', '연설자리',
    '안티고네집', '이스메네집', '탈로스집'
];

const dpIsMovementTargetName = function(name) {
    const value = String(name || '');
    if (!value.startsWith('목표_')) return false;
    if (value.includes('벽의 오래된 방향 표식')) return false;
    return DP_MOVE_TARGET_TOKENS.some(token => value.includes(token));
};

const dpSelectedQuestTarget = function() {
    const scene = (typeof SceneManager !== 'undefined') ? SceneManager._scene : null;
    return scene && scene.questGuideTarget ? scene.questGuideTarget() : null;
};

const dpSameOrNearEvent = function(a, b, distance) {
    if (!a || !b || !$gameMap) return false;
    const d = $gameMap.distance
        ? $gameMap.distance(a.x, a.y, b.x, b.y)
        : Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return d <= distance;
};

Sprite_Minimap_Event.prototype.findTemplateName = function() {
    if (this.event.page() && this.event.list()) {
        let templateName;

        // MZ
        const command = this.event.list()
            .find(command => (
                command &&
                command.code == 357 &&
                command.parameters &&
                command.parameters[0] == PLUGIN_NAME &&
                command.parameters[1] == 'event'
            ));

        if (command) {
            templateName = command.parameters[command.parameters.length - 1].template;
        } else {
            // MV
            const match = this.event.list()
                .filter(command => command.code == 108)
                .map(command => /<Minimap Event:\s?(.+)>/gi.exec(command.parameters[0]))
                .find(match => match && match[1]);
            templateName = match ? match[1] : undefined;
        }

        // Dry Promise final QA guard:
        // MM_QuestGuide already identifies a target by the exact event-name prefix
        //   목표_<QuestId>_...
        // Use the same rule on the minimap. This prevents a current objective
        // from appearing as a large static Portal and suppresses stale blinking
        // markers left alive by old route switches. Normal Portal markers remain.
        const eventData = this.event.event ? this.event.event() : null;
        const eventName = eventData ? String(eventData.name || '') : '';
        const questId = ($gameSystem && $gameSystem.questGuideId)
            ? String($gameSystem.questGuideId() || '').trim()
            : '';
        const isManagedObjective = eventName.startsWith('목표_S01_');
        const exactPrefix = questId ? `목표_${questId}_` : '';
        const isCurrentObjective = !!exactPrefix && eventName.startsWith(exactPrefix);
        const isMovementObjective = isCurrentObjective && dpIsMovementTargetName(eventName);
        const selectedTarget = dpSelectedQuestTarget();
        const selectedData = selectedTarget && selectedTarget.event ? selectedTarget.event() : null;
        const selectedName = selectedData ? String(selectedData.name || '') : '';
        const selectedIsMovement = !!selectedTarget && dpIsMovementTargetName(selectedName);

        // Old FORCE helpers were temporary movement-marker workarounds.
        // Keep their event logic but never draw a second minimap marker.
        if (eventName.startsWith('GUIDE_') && eventName.includes('FORCE')) {
            return 'hidden';
        }

        // For a current movement objective, exactly one selected 목표_<QuestId>_*
        // event is the blinking source. This intentionally overrides explicit
        // hidden/no-annotation on that selected movement target.
        if (isMovementObjective && questId !== 'S01_08R1') {
            if (
                selectedTarget &&
                selectedTarget.eventId &&
                this.event.eventId &&
                selectedTarget.eventId() === this.event.eventId()
            ) {
                return 'blinking';
            }
            return 'hidden';
        }

        // Hide a physical Portal/old blinking marker beside the selected movement
        // target. This removes Portal+blinking stacks at doors and map exits.
        if (
            selectedIsMovement &&
            selectedTarget !== this.event &&
            (templateName === 'Portal' || templateName === 'blinking' || templateName === 'quest') &&
            dpSameOrNearEvent(this.event, selectedTarget, 2)
        ) {
            return 'hidden';
        }

        // Dry Promise P6 route hard target:
        // After Pheme finishes interviewing Pan in Map019, quest S01_08P6 must
        // point to the real Central Plaza exit (event 2). The generic QA guard
        // would otherwise hide that exit because its legacy name is S01_08J.
        // Force exactly one marker on the real exit and suppress the helper marker.
        if ($gameMap && $gameMap.mapId && $gameMap.mapId() === 19 && questId === 'S01_08P6') {
            if (this.event && this.event.eventId && this.event.eventId() === 2) {
                return 'blinking';
            }
            if (eventName.startsWith('목표_S01_08P6_')) {
                return 'hidden';
            }
        }

        if (isManagedObjective) {
            // S01_08R1 is intentionally a no-minimap flashlight section.
            if (questId === 'S01_08R1' && isCurrentObjective) {
                return 'hidden';
            }

            if (isCurrentObjective) {
                // Explicit hidden pages are respected. Existing quest/portal
                // annotations are normalized to the same blinking quest marker.
                if (templateName === 'hidden') return 'hidden';
                if (templateName === 'Portal' || templateName === 'blinking' || templateName === 'quest') {
                    return 'blinking';
                }

                // Some older targets have no minimap annotation at all. Do not
                // blindly mark every same-quest helper (two-tile doors would then
                // create duplicate icons). If this map already has a statically
                // annotated target for the current quest, leave unannotated helpers
                // alone. Otherwise show only MM_QuestGuide's selected fallback target.
                const hasStaticTarget = ($gameMap && $gameMap.events)
                    ? $gameMap.events().some(ev => {
                        if (!ev || ev._erased || !ev.event || !ev.page || !ev.page()) return false;
                        const data = ev.event();
                        if (!data || !String(data.name || '').startsWith(exactPrefix)) return false;
                        const list = ev.list ? ev.list() : [];
                        return Array.isArray(list) && list.some(c => (
                            c && c.code === 357 && c.parameters &&
                            c.parameters[0] === PLUGIN_NAME && c.parameters[1] === 'event' &&
                            c.parameters[c.parameters.length - 1] &&
                            ['Portal', 'blinking', 'quest'].includes(c.parameters[c.parameters.length - 1].template)
                        ));
                    })
                    : false;

                if (!hasStaticTarget) {
                    const scene = (typeof SceneManager !== 'undefined') ? SceneManager._scene : null;
                    const target = scene && scene.questGuideTarget ? scene.questGuideTarget() : null;
                    if (target && target.eventId && target.eventId() === this.event.eventId()) {
                        return 'blinking';
                    }
                }

                return templateName;
            }

            // If another quest (or no quest) is active, old blinking markers
            // from S01-managed objective events must not remain on the minimap.
            // Static Portal markers are retained as ordinary navigation markers.
            if (templateName === 'blinking' || templateName === 'quest') {
                return 'hidden';
            }
        }

        return templateName;
    }
}

Sprite_Minimap_Event.prototype.getIconIndex = function() {
    return this.annotation
        ? this.annotation.iconIndex
        : Sprite_Minimap_Character.prototype.getIconIndex.call(this);
}

Sprite_Minimap_Event.prototype.getColor = function() {
    return this.annotation
        ? this.annotation.color
        : Sprite_Minimap_Character.prototype.getColor.call(this);
}

Sprite_Minimap_Event.prototype.getScaleValue = function() {
    return this.annotation
        ? this.annotation.scale
        : Sprite_Minimap_Character.prototype.getScaleValue.call(this);
}

Sprite_Minimap_Event.prototype.scaleWithMinimap = function() {
    return !this.annotation || this.annotation.scaleWithMinimap;
}

Sprite_Minimap_Event.prototype.getOriginalOpacity = function() {
    return this.annotation
        ? this.annotation.opacity
        : Sprite_Minimap_Character.prototype.getOriginalOpacity.call(this);
}

Sprite_Minimap_Event.prototype.isVisible = function() {
    return (
        Sprite_Minimap_Character.prototype.isVisible.call(this) &&
        ('Sprite' != this.mode || this.tileId || this.characterName) &&
        !(this.event.isTransparent && this.event.isTransparent()) &&
        !this.event._erased
    );
}

Sprite_Minimap_Event.prototype.breakFogOfWar = function() {
    return this.annotation && this.annotation.breakFogOfWar;
}

Sprite_Minimap_Event.prototype.isBlinking = function() {
    return this.annotation
        ? this.annotation.isBlinking
        : Sprite_Minimap_Character.prototype.isBlinking.call(this);
}

Sprite_Minimap_Event.prototype.isRotate = function() {
    return this.annotation
        ? this.annotation.isRotate
        : Sprite_Minimap_Character.prototype.isRotate.call(this);
}

Sprite_Minimap_Event.prototype.sticksOnEdge = function() {
    return this.annotation && this.annotation.sticksOnEdge;
}

Sprite_Minimap_Event.prototype.showStepAnimation = function() {
    return !(this.annotation && this.annotation.freeze);
}


// =====================================================================================
// Sprite Player
// =====================================================================================

Sprite_Minimap_Player.prototype.initialize = function() {
    Sprite_Minimap_Character.prototype.initialize.call(
        this,
        $gamePlayer,
    );
}

Sprite_Minimap_Player.prototype.getMode = function() {
    return MK.Minimap.player.mode;
}

Sprite_Minimap_Player.prototype.getIconIndex = function() {
    const leader = $gameParty.leader() ? $gameParty.leader().actor() : null;
    
    return leader && leader.meta && leader.meta['Minimap Icon']
        ? Number(leader.meta['Minimap Icon'])
        : MK.Minimap.player.iconIndex;
}

Sprite_Minimap_Player.prototype.getPicture = function() {
    const leader = $gameParty.leader() ? $gameParty.leader().actor() : null;
    
    return leader && leader.meta && leader.meta['Minimap Picture']
        ? leader.meta['Minimap Picture'].trim()
        : MK.Minimap.player.picture;
}

Sprite_Minimap_Player.prototype.getColor = function() {
    return MK.Minimap.player.color;
}

Sprite_Minimap_Player.prototype.getScaleValue = function() {
    return MK.Minimap.player.scale;
}

Sprite_Minimap_Player.prototype.scaleWithMinimap = function() {
    return MK.Minimap.player.scaleWithMinimap;
}

Sprite_Minimap_Player.prototype.getOriginalOpacity = function() {
    return MK.Minimap.player.opacity;
}

Sprite_Minimap_Player.prototype.isVisible = function() {
    return (
        'don\'t show' != this.getMode() &&
        ('Player' == MK.Minimap.vehicles.priorityWhenRiding || !$gamePlayer.vehicle())
    );
}

Sprite_Minimap_Player.prototype.breakFogOfWar = function() {
    return true;
}

Sprite_Minimap_Player.prototype.isBlinking = function() {
    return MK.Minimap.player.isBlinking;
}

Sprite_Minimap_Player.prototype.isRotate = function() {
    return MK.Minimap.player.isRotate
}

Sprite_Minimap_Player.prototype.sticksOnEdge = function() {
    return true;
}


// =====================================================================================
// Sprite Vehicle
// =====================================================================================

Sprite_Minimap_Vehicle.prototype.initialize = function(vehicle, type) {
    this.type = type;
    
    Sprite_Minimap_Character.prototype.initialize.call(this, vehicle);
}

Sprite_Minimap_Vehicle.prototype.getMode = function() {
    return MK.Minimap.vehicles.mode;
}

Sprite_Minimap_Vehicle.prototype.getIconIndex = function() {
    return MK.Minimap[this.type].iconIndex;
}

Sprite_Minimap_Vehicle.prototype.getPicture = function() {
    return MK.Minimap[this.type].picture;
}

Sprite_Minimap_Vehicle.prototype.getColor = function() {
    return MK.Minimap[this.type].color;
}

Sprite_Minimap_Vehicle.prototype.getScaleValue = function() {
    return MK.Minimap.vehicles.scale;
}

Sprite_Minimap_Vehicle.prototype.scaleWithMinimap = function() {
    return MK.Minimap.vehicles.scaleWithMinimap;
}

Sprite_Minimap_Vehicle.prototype.getOriginalOpacity = function() {
    return MK.Minimap.vehicles.opacity;
}

Sprite_Minimap_Vehicle.prototype.isVisible = function() {
    return (
        Sprite_Minimap_Character.prototype.isVisible.call(this) &&
        this.event._mapId == $gameMap.mapId() && 
        (
            'Vehicle' == MK.Minimap.vehicles.priorityWhenRiding ||
            $gamePlayer.vehicle() != $gameMap.vehicle(['boat', 'ship', 'airship'].indexOf(this.type))
        )
    );
}

Sprite_Minimap_Vehicle.prototype.breakFogOfWar = function() {
    return MK.Minimap.vehicles.breakFogOfWar;
}

Sprite_Minimap_Vehicle.prototype.isBlinking = function() {
    return MK.Minimap.vehicles.isBlinking;
}

Sprite_Minimap_Vehicle.prototype.isRotate = function() {
    return MK.Minimap.vehicles.isRotate;
}

Sprite_Minimap_Vehicle.prototype.sticksOnEdge = function() {
    return MK.Minimap.vehicles.sticksOnEdge;
}


// =====================================================================================
// Minimap Parallax
// =====================================================================================

Sprite_Minimap_Parallax.prototype.initialize = function() {
    this.name = $gameMap.parallaxName();
    const bitmap = ImageManager.loadParallax(this.name);

    Sprite.prototype.initialize.call(this, bitmap);
}

Sprite_Minimap_Parallax.prototype.update = function() {
    Sprite.prototype.update.call(this);

    if (this.requiresRefresh()) {
        this.name = $gameMap.parallaxName();
        this.bitmap = this.name ? ImageManager.loadParallax(this.name) : new Bitmap();
        this.visible = !!this.name;
    }
}

Sprite_Minimap_Parallax.prototype.requiresRefresh = function() {
    return $gameMap.parallaxName() != this.name;
}


// =====================================================================================
// Window Map Name
// =====================================================================================

const frameRectangle = (rectangle) => {
    rectangle.x = Math.round(rectangle.x);
    rectangle.y = Math.round(rectangle.y);
    rectangle.width = Math.round(rectangle.width);
    rectangle.height = Math.round(rectangle.height);
    return rectangle;
}

Window_Minimap_Bottom.prototype.initialize = function() {
    Window_Base.prototype.initialize.apply(this, arguments);
    this.visible = false;

    this._rectangle1 = MK.Minimap.bottomWindow.rectangleEval.call(SceneManager._scene);
    this._rectangle2 = MK.Minimap.bottomWindowWhenExpanded.rectangleEval.call(SceneManager._scene);

    const isRectangle = (object) => object
                                    && !isNaN(object.x) && !isNaN(object.y)
                                    && !isNaN(object.width) && !isNaN(object.height);
    
    if (!isRectangle(this._rectangle1)) {
        throw Error(
            'Parameter "minimapBottomWindowRectEval" must return a Rectangle, but was: '
            + this._rectangle1
        );
    }
    if (!isRectangle(this._rectangle2)) {
        throw Error(
            'Parameter "minimapBottomWindowWhenExpandedRectEval" must return a Rectangle, but was: '
            + this._rectangle2
        );
    }
    frameRectangle(this._rectangle1);
    frameRectangle(this._rectangle2);
}

Window_Minimap_Bottom.prototype.update = function() {
    Window_Base.prototype.update.call(this);

    this.contents.clear();
    this.updatePosition();
    this.updateOpacity();
    this.drawContent();

    this.visible = MK.Minimap.bottomWindow.isVisible();
}

Window_Minimap_Bottom.prototype.drawContent = function() {
    this.drawText(
        this.text(),
        0,
        this.contentsHeight() / 2 - this.lineHeight() / 2,
        this.contentsWidth(),
        this.textAlign(),
    );
}

Window_Minimap_Bottom.prototype.text = function() {
    return MK.Minimap.isExpanded()
        ? MK.Minimap.bottomWindowWhenExpanded.textEval.call(this)
        : MK.Minimap.bottomWindow.textEval.call(this);
}

Window_Minimap_Bottom.prototype.textAlign = function() {
    return ((MK.Minimap.isExpanded()
        ? MK.Minimap.bottomWindowWhenExpanded.align
        : MK.Minimap.bottomWindow.align) || 'center').toLowerCase();
}

Window_Minimap_Bottom.prototype.updatePosition = function() {
    const rectangle = MK.Minimap.isExpanded() ? this._rectangle2 : this._rectangle1;
    
    if (this.x != rectangle.x || this.y != rectangle.y || this.width != rectangle.width || this.height != rectangle.height) {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;
    }
}

Window_Minimap_Bottom.prototype.updateOpacity = function() {
    if ('Window' == MK.Minimap.bottomWindow.design && MK.Minimap.isExpanded()) {
        this.opacity = MK.Minimap.bottomWindowWhenExpanded.opacity;
    }
    else if ('Window' == MK.Minimap.bottomWindow.design) {
        this.opacity = MK.Minimap.bottomWindow.opacity;
    }
    else {
        this.opacity = 0;
    }
}


// =====================================================================================
// Bottom Window Background
// =====================================================================================

Sprite_Minimap_Bottom_Background.prototype.update = function() {
    Sprite.prototype.update.call(this);

    const bottomWindow = SceneManager._scene._minimapBottomWindow;
    if (bottomWindow) {
        this.x = bottomWindow.x;
        this.y = bottomWindow.y;
        this.scale.x = bottomWindow.width / this.bitmap.width;
        this.scale.y = bottomWindow.height / this.bitmap.height;
        this.opacity = MK.Minimap.isExpanded()
                        ? MK.Minimap.bottomWindowWhenExpanded.opacity
                        : MK.Minimap.bottomWindow.opacity;
        this.visible = bottomWindow.visible;
    } else {
        this.visible = false;
    }
}


// =====================================================================================
// Window Map Name
// =====================================================================================

const alias_WindowMapName_update = Window_MapName.prototype.update;
Window_MapName.prototype.update = function() {
    alias_WindowMapName_update.call(this);
    
    if (MK.Minimap.bottomWindow.isVisible()) {
        this.visible = false;
    }
}


// =====================================================================================
// Window Downscale Factor Window
// =====================================================================================

function Window_DownscaleFactor() {
    this.initialize(...arguments);
}

Window_DownscaleFactor.prototype = Object.create(Window_Base.prototype);
Window_DownscaleFactor.prototype.constructor = Window_DownscaleFactor;

Window_DownscaleFactor.prototype.initialize = function(/* arguments */) {
    Window_Base.prototype.initialize.apply(this, arguments);

    this.setBackgroundType(2);
    this.updatePadding(2);
    this.makeFontSmaller();
    this.drawText(
        'Downscale Factor: %1x'.format(MK.Minimap.downscaleFactor()),
        0,
        -10,
        this.width,
        this.height,
    );
}


// =====================================================================================
// Scene Map
// =====================================================================================

const rejectParameterValue = (param, value) => {
    const message = "MK Minimap: The parameter '%1' did not return a valid value, but %2".format(param, value);
    throw Error(message);
}


const alias_SceneMap_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    alias_SceneMap_createDisplayObjects.call(this);
    
    this.setupFogOfWar();
    this.createMinimap();
    this.createMinimapBottomBackground();
    this.createMinimapBottomWindow();
}

Scene_Map.prototype.createMinimap = function() {
    const targetWidth = eval(MK.Minimap.map.widthEval);
    const targetHeight = eval(MK.Minimap.map.heightEval);
    if (isNaN(targetWidth)) rejectParameterValue('Minimap width', targetWidth);
    if (isNaN(targetHeight)) rejectParameterValue('Minimap height', targetHeight);
    
    new Promise(() => {
        this._minimapSprite = new Spriteset_Minimap(targetWidth, targetHeight);
        this.addChild(this._minimapSprite);
    });
}

Scene_Map.prototype.createMinimapBottomBackground = function() {
    if ('Picture' == MK.Minimap.bottomWindow.design) {
        const rectangle         = this.minimapBottomWindowRect();
        const path              = MK.Minimap.bottomWindow.picture;
        const folder            = 'img/' + extractFolderAndFilename(path).folder;
        const filename          = extractFolderAndFilename(path).filename;
        const background        = ImageManager.loadBitmap(folder, filename);
        const backgroundSprite  = new Sprite_Minimap_Bottom_Background(background);
        
        backgroundSprite.move(rectangle.x, rectangle.y);
        this.addChild(backgroundSprite);
    }
}

Scene_Map.prototype.createMinimapBottomWindow = function() {
    const rectangle = this.minimapBottomWindowRect();

    if ('MZ' == Utils.RPGMAKER_NAME) {
        this._minimapBottomWindow = new Window_Minimap_Bottom(rectangle);
    } else {
        this._minimapBottomWindow = new Window_Minimap_Bottom(
            rectangle.x,
            rectangle.y,
            rectangle.width,
            rectangle.height,
        );
    }
    this._minimapBottomWindow.setBackgroundType('Window' == MK.Minimap.bottomWindow.design ? 0 : 2);
    this.addChild(this._minimapBottomWindow);
}

Scene_Map.prototype.minimapBottomWindowRect = function() {
    const isRectangle = (object) => object
                                    && !isNaN(object.x) && !isNaN(object.y)
                                    && !isNaN(object.width) && !isNaN(object.height);
    
    const rectangle = MK.Minimap.bottomWindowWhenExpanded.rectangleEval.call(this);
    if (!isRectangle(rectangle)) {
        throw Error(
            'Parameter "minimapBottomWindowRectEval" must return a Rectangle, but was: '
            + rectangle
        );
    }
    return rectangle;
}

Scene_Map.prototype.setupFogOfWar = function() {
    MK.Minimap.fogOfWar.xPlayer = -1;
    MK.Minimap.fogOfWar.yPlayer = -1;
    MK.Minimap.fogOfWar.isRiding = null;
    MK.Minimap.fogOfWar._requiresRefresh = true;
}

const alias_SceneMap_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    alias_SceneMap_update.call(this);
    
    if (MK.Minimap.fogOfWar.shouldShow()) {
        MK.Minimap.fogOfWar.update();
    }

    if (!$gameMap.isEventRunning()) {
        this.updateMinimapHotkeys();
    }
}

Scene_Map.prototype.updateMinimapHotkeys = function() {
    if (MK.Minimap.hotkeys.showHide && Input.isTriggered('showHideMinimap') && !$gameSystem.forceShowMinimap) {
        ConfigManager.showMinimap = !ConfigManager.showMinimap;
    }
    if (MK.Minimap.hotkeys.expandCollapse && Input.isTriggered('expandCollapseMinimap')) {
        MK.Minimap.toggleExpand();
    }
}

const alias_SceneMap_isAnyButtonPressed = Scene_Map.prototype.isAnyButtonPressed;
Scene_Map.prototype.isAnyButtonPressed = function() {
    return (
           alias_SceneMap_isAnyButtonPressed.call(this)
        || (this._minimapSprite && this._minimapSprite.isPressed())
    );
}


// =====================================================================================
// MK
// =====================================================================================

// Hide the minimap while full illustration/CG pictures are on screen.
// Pheme's field interview notebook is intentionally excluded.
MK.Minimap.isPhemeNotebookPicture = function(name) {
    const value = String(name || '');
    return (
        value === 'ChatGPT Image 2026년 8월 31일 오후 11_40_43' ||
        /Pheme.*(?:Note|Notebook)/i.test(value) ||
        /페메.*취재.*노트/.test(value)
    );
}

MK.Minimap.isBlockingCgPicture = function(name) {
    const value = String(name || '');
    if (!value || MK.Minimap.isPhemeNotebookPicture(value)) return false;

    // Puzzle clues and voting UI are not illustration CGs.
    if (/^EchoClue_/i.test(value) || /^DP_Vote/i.test(value)) return false;

    return (
        /^(?:CG_|PR_|PROLOGUE_|DP_EP_|DP_END|DP_EndingCard|DP_EndCard)/i.test(value) ||
        /^KakaoTalk_/i.test(value) ||
        /^ChatGPT Image /i.test(value) ||
        value === '3' ||
        value === '4'
    );
}

MK.Minimap.isCgBlocking = function() {
    if (!$gameScreen || !$gameScreen._pictures) return false;
    return $gameScreen._pictures.some(picture => {
        if (!picture) return false;
        const name = picture.name ? picture.name() : picture._name;
        return MK.Minimap.isBlockingCgPicture(name);
    });
}

MK.Minimap.isVisible = function() {
    if (!$dataMap) return false;
    if (MK.Minimap.isCgBlocking()) return false;

    return $gameSystem.forceShowMinimap || (
        $gameSystem.showMinimap && ConfigManager.showMinimap
    );
}

MK.Minimap.show = function() {
    $gameSystem.showMinimap = true;
}

MK.Minimap.hide = function() {
    $gameSystem.showMinimap = false;
}

MK.Minimap.toggle = function() {
    $gameSystem.showMinimap = !$gameSystem.showMinimap;
}

MK.Minimap.forceShow = function(b) {
    $gameSystem.forceShowMinimap = b;
}

const alias_GamePlayer_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {

    if ($dataMap && $dataMap.meta) {
        $gameSystem.showMinimap = $dataMap.meta['Minimap']
            || (!$dataMap.meta['No Minimap'] && MK.Minimap.isVisibleDefault);
    } else {

        // fallback
        $gameSystem.showMinimap = MK.Minimap.isVisibleDefault;
    }
    alias_GamePlayer_performTransfer.call(this);
}

MK.Minimap.bottomWindow.isVisible = function() {
    return MK.Minimap.isExpanded()
        ? MK.Minimap.bottomWindowWhenExpanded.isVisibleEval.call(this)
        : MK.Minimap.bottomWindow.isVisibleEval.call(this);
}

MK.Minimap.isExpanded = function() {
    return !!$gameTemp.expandMinimap;
}

MK.Minimap.expand = function() {
    $gameTemp.expandMinimap = true;
    MK.Minimap.updateZoomFactor();
}

MK.Minimap.collapse = function() {
    $gameTemp.expandMinimap = false;
    MK.Minimap.updateZoomFactor();
}

MK.Minimap.toggleExpand = function() {
    $gameTemp.expandMinimap = !$gameTemp.expandMinimap;
    MK.Minimap.updateZoomFactor();
}

MK.Minimap.refresh = function() {
    if (SceneManager._scene._minimapSprite) {
        SceneManager._scene._minimapSprite.mapSprite._requiresRefresh = true;
    }
}


// =====================================================================================
// Fog of War
// =====================================================================================

MK.Minimap.fogOfWar.shouldShow = function() {
    return (
        $dataMap &&
        $dataMap.meta &&
        ($dataMap.meta['Minimap Fog of War'] || MK.Minimap.fogOfWar.active) &&
        !$dataMap.meta['Minimap No Fog of War']
    );
}

MK.Minimap.fogOfWar.getData = function() {
    $gameSystem.fogOfWarData = $gameSystem.fogOfWarData || { };
    const key = MK.Minimap.fogOfWar.getKey();
    
    if (!$gameSystem.fogOfWarData[key]) {
        $gameSystem.fogOfWarData[key] = createList($gameMap.width() * $gameMap.height(), false);
    }
    return $gameSystem.fogOfWarData[key];
}

MK.Minimap.fogOfWar.getKey = function() {
    return '_' + $gameMap.mapId();
}

MK.Minimap.fogOfWar.isDiscovered = function(x, y) {
    const index = MK.Minimap.fogOfWar.index(x, y);
    return !MK.Minimap.fogOfWar.shouldShow() || MK.Minimap.fogOfWar.getData()[index];
}

MK.Minimap.fogOfWar.isCovered = function(x, y) {
    return !MK.Minimap.fogOfWar.isDiscovered(x, y);
}

MK.Minimap.fogOfWar.update = function() {
    const spriteSet = SceneManager._scene._minimapSprite;
    const mapSprite = spriteSet ? spriteSet.mapSprite : undefined;

    if (mapSprite && mapSprite.isReady() && MK.Minimap.fogOfWar.requiresRefresh()) {
        const data = MK.Minimap.fogOfWar.getData();

        MK.Minimap.fogOfWar.xPlayer = Math.round($gamePlayer.x);
        MK.Minimap.fogOfWar.yPlayer = Math.round($gamePlayer.y);
        MK.Minimap.fogOfWar.isRiding = !!$gamePlayer.vehicle();
        MK.Minimap.fogOfWar._requiresRefresh = false;

        const index = MK.Minimap.fogOfWar.index(Math.round($gamePlayer.x), Math.round($gamePlayer.y));
        $gameMap._fogOfWarAlreadyVisitedData[index] = true;

        MK.Minimap.fogOfWar.getNewFieldOfViewPoints().forEach(point => {
            const index = MK.Minimap.fogOfWar.index(point.x, point.y);
            data[index] = true;

            mapSprite.drawSpot(point.x, point.y);
        });
    }
}

MK.Minimap.fogOfWar.requiresRefresh = function() {
    if (MK.Minimap.fogOfWar._requiresRefresh) {
        return true;
    }
    if (!!$gamePlayer.vehicle() !== MK.Minimap.fogOfWar.isRiding) {
        return true;
    }
    const xPlayer = Math.round($gamePlayer.x);
    const yPlayer = Math.round($gamePlayer.y);
    const index = MK.Minimap.fogOfWar.index(xPlayer, yPlayer);

    $gameMap._fogOfWarAlreadyVisitedData = $gameMap._fogOfWarAlreadyVisitedData ||
        createList($gameMap.width() * $gameMap.height(), false);

    return !$gameMap._fogOfWarAlreadyVisitedData[index] && (
        MK.Minimap.fogOfWar.xPlayer !== xPlayer ||
        MK.Minimap.fogOfWar.yPlayer !== yPlayer
    );
}

const _GameMap_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(/* arguments */) {
    _GameMap_setup.apply(this, arguments);

    this._fogOfWarAlreadyVisitedData = createList(this.width() * this.height(), false);
}

MK.Minimap.fogOfWar.getNewFieldOfViewPoints = function() {
    const toReturn = [ ];
    const originalWidth = Math.ceil((Graphics.width / $gameMap.tileWidth()) / 2);
    const originalHeight = Math.ceil((Graphics.height / $gameMap.tileHeight()) / 2);
    const range = Math.max(
        originalWidth * MK.Minimap.fogOfWar.sightRangeScale(),
        originalHeight * MK.Minimap.fogOfWar.sightRangeScale(),
    );
    const xPlayer = Math.round($gamePlayer.x);
    const yPlayer = Math.round($gamePlayer.y);

    for (let x = xPlayer - range; x <= xPlayer + range; x++) {
        for (let y = yPlayer - range; y <= yPlayer + range; y++) {
            if (MK.Minimap.fogOfWar.isValid(x, y) &&
                MK.Minimap.fogOfWar.isCovered(x, y) && 
                MK.Minimap.fogOfWar.isSeen(x, y)
            ) {
                toReturn.push({x: x, y: y});
            }
        }
    }
    return toReturn;
}

MK.Minimap.fogOfWar.isSeen = function(x, y) {
    const originalWidth = Math.ceil((Graphics.width / $gameMap.tileWidth()) / 2);
    const originalHeight = Math.ceil((Graphics.height / $gameMap.tileHeight()) / 2);

    const range = Math.max(
        originalWidth * MK.Minimap.fogOfWar.sightRangeScale(),
        originalHeight * MK.Minimap.fogOfWar.sightRangeScale(),
    );

    return (
        MK.Minimap.fogOfWar.distance($gamePlayer.x, $gamePlayer.y, x, y) <= range || (
            Math.abs($gamePlayer.x - x) <= originalWidth &&
            Math.abs($gamePlayer.y - y) <= originalHeight
        )
    );
}

MK.Minimap.fogOfWar.sightRangeScale = function() {
    if ($gamePlayer.vehicle() == $gameMap.vehicle(0)) return MK.Minimap.fogOfWar.sightRangeScales.boat;
    if ($gamePlayer.vehicle() == $gameMap.vehicle(1)) return MK.Minimap.fogOfWar.sightRangeScales.ship;
    if ($gamePlayer.vehicle() == $gameMap.vehicle(2)) return MK.Minimap.fogOfWar.sightRangeScales.airship;
    return MK.Minimap.fogOfWar.sightRangeScales.player;
}

MK.Minimap.fogOfWar.distance = function(x1, y1, x2, y2) {
    const a = $gameMap.deltaX(x1, x2);
    const b = $gameMap.deltaY(y1, y2);
    return Math.sqrt((a * a) + (b * b));
}

MK.Minimap.fogOfWar.index = function(x, y) {
    return $gameMap.width() * Math.round(y) + Math.round(x);
}

MK.Minimap.fogOfWar.isValid = function(x, y) {
    return 0 <= x && x < $gameMap.width() && 0 <= y && y < $gameMap.height();
}

MK.Minimap.fogOfWar.revealMap = function() {
    MK.Minimap.fogOfWar.bulkModify(true);
}

MK.Minimap.fogOfWar.unrevealMap = function() {
    MK.Minimap.fogOfWar.bulkModify(false);
}

MK.Minimap.fogOfWar.bulkModify = function(value) {
    const data = MK.Minimap.fogOfWar.getData();
    for (let i = 0; i < data.length; i++) { data[i] = value };

    const alreadyVisitedData = $gameMap._fogOfWarAlreadyVisitedData || createList($gameMap.width() * $gameMap.height(), false);
    for (let i = 0; i < alreadyVisitedData.length; i++) { alreadyVisitedData[i] = value }

    MK.Minimap.refresh();
}

MK.Minimap.fogOfWar.forceRefresh = function() {
    MK.Minimap.fogOfWar._requiresRefresh = true;
}


// =====================================================================================
// Zoom
// =====================================================================================

MK.Minimap.zoomValue = function() {
    return MK.Minimap._zoomValue;
}

MK.Minimap.updateZoomFactor = function() {
    let zoom;
    if (MK.Minimap.isExpanded()) {
        zoom = MK.Minimap.zoomSettings.valueWhenExpanded;
    }
    else if ('Minimap Zoom' in $dataMap.meta) {
        zoom = Number($dataMap.meta['Minimap Zoom']) || 0;
    }
    else {
        zoom = MK.Minimap.zoomSettings.defaultValue;
    }
    MK.Minimap._zoomValue = Math.min(
        zoom,
        $gameMap.width() * $gameMap.tileWidth() / Graphics.width,
        $gameMap.height() * $gameMap.tileHeight() / Graphics.height,
    );
}


// =====================================================================================
// Downscale Factor
// =====================================================================================

MK.Minimap.downscaleFactor = function() {
    return MK.Minimap._downscaleFactor;
}

MK.Minimap.updateDownscaleFactor = function() {
    if (!$dataMap || !$gameMap) {
        MK.Minimap._downscaleFactor = 1;
    } else {
        MK.Minimap._downscaleFactor = MK.Minimap.getDownscaleFactorEval.call(this) || 1;
    }
}


// =====================================================================================
// Config Manager
// =====================================================================================

ConfigManager.showMinimap = true;

if (MK.Minimap.addToOptions) {
    
    const alias_ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = alias_ConfigManager_makeData.call(this);
        config.showMinimap = this.showMinimap;
        return config;
    }

    const alias_ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        alias_ConfigManager_applyData.call(this, config);
        
        this.showMinimap = config.showMinimap || !('showMinimap' in config);
    }

    const alias_WindowOptions_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        alias_WindowOptions_addGeneralOptions.call(this);

        this.addCommand(MK.Minimap.vocabulary.optionsMenuText, 'showMinimap');
    }

    const alias_SceneOptions_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        return alias_SceneOptions_maxCommands.call(this) + 1;
    }
}


// =====================================================================================
// Plugin Manager
// =====================================================================================

if (PluginManager && PluginManager.registerCommand) {

    PluginManager.registerCommand(PLUGIN_NAME, 'changeVisibility', args => {
        if ('Show' == args.mode)    MK.Minimap.show();
        if ('Hide' == args.mode)    MK.Minimap.hide();
        if ('Toggle' == args.mode)  MK.Minimap.toggle();
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'forceShow', args => {
        MK.Minimap.forceShow('true' == args.mode);
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'changeVisibilityOption', args => {
        if ('Show' == args.mode)    ConfigManager.showMinimap = true;
        if ('Hide' == args.mode)    ConfigManager.showMinimap = false;
        if ('Toggle' == args.mode)  ConfigManager.showMinimap = !ConfigManager.showMinimap;
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'expandMinimap', args => {
        if ('Expand' == args.mode)      MK.Minimap.expand();
        if ('Collapse' == args.mode)    MK.Minimap.collapse();
        if ('Toggle' == args.mode)      MK.Minimap.toggleExpand();
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'revealMap', args => {
        if ('Reveal' == args.mode)      MK.Minimap.fogOfWar.revealMap();
        if ('Unreveal' == args.mode)    MK.Minimap.fogOfWar.unrevealMap();
    });
}


})();


// =====================================================================================
// Compatibility
// =====================================================================================

(function() {

const alias_SpriteMinimap_initialize = Sprite_Minimap.prototype.initialize;
Sprite_Minimap.prototype.initialize = function(/* arguments */) {
    alias_SpriteMinimap_initialize.apply(this, arguments);

    this._roofSprites = [ ];
}

const alias_SpriteMinimap_update = Sprite_Minimap.prototype.update;
Sprite_Minimap.prototype.update = function() {
    alias_SpriteMinimap_update.call(this);

    this.updateFloatingRoofs();
}

Sprite_Minimap.prototype.updateFloatingRoofs = function() {
    const spritesetMap = SceneManager._scene && SceneManager._scene._spriteset;

    const ownsRoofSprite = (roofSprite) => (
        this._roofSprites.find(item => item.sx == roofSprite.sx && item.sy == roofSprite.sy)
    );

    if (spritesetMap) {
        spritesetMap._tilemap.children
            .filter(sprite => isRoofSprite(sprite))
            .filter(roofSprite => !ownsRoofSprite(roofSprite))
            .forEach(roofSprite => {
                this._roofSprites.push({ sx: roofSprite.sx, sy: roofSprite.sy });
                this.addChild(new Sprite_Minimap_Roof(roofSprite));
            });
    }
}

function isRoofSprite(object) {
    return (
        object &&
        'region' in object &&
        'regionId' in object &&
        'sx' in object &&
        'sy' in object &&
        'lastUpdate' in object &&
        object.drawTiles
    );
}


function Sprite_Minimap_Roof() {
    this.initialize(...arguments);
}

Sprite_Minimap_Roof.prototype = Object.create(Sprite.prototype);
Sprite_Minimap_Roof.prototype.constructor = Sprite_Minimap_Roof;

const copyBitmap = (source, factor = 1.0) => {
    const bitmap = new Bitmap(
        Math.floor(source.width / factor),
        Math.floor(source.height / factor),
    );
    bitmap.blt(
        source,
        0,
        0,
        source.width,
        source.height,
        0,
        0,
        source.width / factor,
        source.height / factor,
    );
    return bitmap;
}

Sprite_Minimap_Roof.prototype.initialize = function(roofSprite) {
    this.roofSprite = roofSprite;

    const bitmap = copyBitmap(roofSprite.bitmap, MK.Minimap.downscaleFactor());
    Sprite.prototype.initialize.call(this, bitmap);
}

Sprite_Minimap_Roof.prototype.update = function() {
    Sprite.prototype.update.call(this);

    const x = this.getUnclampedXPosition();
    const y = this.getUnclampedYPosition();

    const dx1 = Math.max(-x, 0) / this.scale.x;
    const dx2 = Math.max(this.bitmap.width * this.scale.x - (this.xMax() - x), 0) / this.scale.x;
    const dy1 = Math.max(-y, 0) / this.scale.y;
    const dy2 = Math.max(this.bitmap.height * this.scale.y - (this.yMax() - y), 0) / this.scale.y;
    
    this.setFrame(dx1, dy1, this.bitmap.width - dx2, this.bitmap.height - dy2);
    this.move(
        x + dx1 * this.scale.x,
        y + dy1 * this.scale.y,
    );

    this.visible = this.roofSprite.visible;
    this.opacity = this.roofSprite.opacity;
    this.alpha = this.roofSprite.alpha;
}

Sprite_Minimap_Roof.prototype.getUnclampedXPosition = function() {
    return Sprite_Minimap_Character.prototype.getUnclampedXPosition.call(this);
}

Sprite_Minimap_Roof.prototype.getUnclampedYPosition = function() {
    return Sprite_Minimap_Character.prototype.getUnclampedYPosition.call(this);
}

Sprite_Minimap_Roof.prototype.mapX = function() {
    return this.roofSprite.sx;
}

Sprite_Minimap_Roof.prototype.mapY = function() {
    return this.roofSprite.sy;
}

Sprite_Minimap_Roof.prototype.xMin = function() {
    return 0;
}

Sprite_Minimap_Roof.prototype.yMin = function() {
    return 0;
}

Sprite_Minimap_Roof.prototype.xMax = function() {
    return Sprite_Minimap_Character.prototype.xMax.call(this);
}

Sprite_Minimap_Roof.prototype.yMax = function() {
    return Sprite_Minimap_Character.prototype.yMax.call(this);
}

})();
