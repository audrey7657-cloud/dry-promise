/*:
 * @target MZ
 * @plugindesc Custom Title Menu with Draggable Buttons v1.0.1
 * @author BitQuest Studio
 * @version 1.0.1
 * 
 * @param customButtons
 * @text Custom Buttons
 * @type struct<CustomButton>[]
 * @default []
 * @desc Define custom buttons for the title menu
 * 
 * @param socialMediaButtons
 * @text Social Media Buttons
 * @type struct<SocialMediaButton>[]
 * @default []
 * @desc Define social media buttons that open external links
 * 
 * @param socialMediaHoverEffects
 * @text Social Media Hover Effects
 * @type struct<SocialMediaHoverEffects>
 * @default {"hoverSlideEnabled":"true","hoverSlideX":"3","hoverSlideY":"0","hoverPopOutEnabled":"true","hoverPopOutScale":"1.05","hoverOpacityEnabled":"false","hoverOpacityValue":"0.9","hoverToneEnabled":"false","hoverToneRed":"0","hoverToneGreen":"0","hoverToneBlue":"0","hoverToneGray":"0","hoverAnimationSpeed":"0.15"}
 * @desc Configure hover effects specifically for social media buttons
 * 
 * @param buttonHoverEffects
 * @text Button Hover Effects
 * @type struct<ButtonHoverEffects>
 * @default {"hoverSlideEnabled":"true","hoverSlideX":"5","hoverSlideY":"0","hoverPopOutEnabled":"true","hoverPopOutScale":"1.1","hoverOpacityEnabled":"false","hoverOpacityValue":"0.8","hoverToneEnabled":"false","hoverToneRed":"0","hoverToneGreen":"0","hoverToneBlue":"0","hoverToneGray":"0","hoverAnimationSpeed":"0.2"}
 * @desc Configure hover effects for buttons
 * 
 * @param logo
 * @text Logo Settings
 * @type struct<Logo>
 * @default {"enabled":"false","imageName":"","x":"50","y":"50","width":"200","height":"100","draggable":"true","savePosition":"true"}
 * @desc Configure logo display and positioning
 * 
 * @param logoHoverEffects
 * @text Logo Hover Effects
 * @type struct<LogoHoverEffects>
 * @default {"hoverSlideEnabled":"true","hoverSlideX":"3","hoverSlideY":"0","hoverPopOutEnabled":"true","hoverPopOutScale":"1.05","hoverOpacityEnabled":"false","hoverOpacityValue":"0.9","hoverToneEnabled":"false","hoverToneRed":"0","hoverToneGreen":"0","hoverToneBlue":"0","hoverToneGray":"0","hoverAnimationSpeed":"0.15"}
 * @desc Configure hover effects specifically for the logo
 * 
 * @param enableAlignment
 * @text Enable Alignment
 * @type boolean
 * @default true
 * @desc Enable snap-to-grid alignment when dragging buttons
 * 
 * @param gridSize
 * @text Grid Size
 * @type number
 * @default 20
 * @min 5
 * @max 100
 * @desc Size of the alignment grid in pixels
 * 
 * @param alignmentType
 * @text Alignment Type
 * @type select
 * @option Both
 * @option Horizontal Only
 * @option Vertical Only
 * @default Both
 * @desc Which directions to align buttons
 * 
 * @param showGrid
 * @text Show Grid
 * @type boolean
 * @default false
 * @desc Show visual grid lines for alignment (for debugging)
 * 
 * @param hoverSE
 * @text Hover Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when hovering over buttons or moving arrow
 * 
 * @param selectionSE
 * @text Selection Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when clicking or selecting buttons
 * 
 * @param enableDragAndDrop
 * @text Enable Drag and Drop
 * @type boolean
 * @default true
 * @desc Allow dragging buttons and logo during playtest (disabled in deployed games)
 * 
 * @param enableKeyboardNavigation
 * @text Enable Keyboard Navigation
 * @type boolean
 * @default true
 * @desc Enable arrow key/WASD navigation between buttons
 * 
 * @param arrowFollowsMouse
 * @text Arrow Follows Mouse
 * @type boolean
 * @default true
 * @desc Selection arrow moves to button when mouse hovers over it
 * 
 * @param showSelectionArrow
 * @text Show Selection Arrow
 * @type boolean
 * @default true
 * @desc Show visual arrow indicator for keyboard navigation
 * 
 * @param selectionArrowDirection
 * @text Arrow Direction
 * @type select
 * @option Up
 * @option Down
 * @option Left
 * @option Right
 * @default Left
 * @desc Direction the arrow points (when using preset arrows)
 * 
 * @param selectionArrowImage
 * @text Selection Arrow Image
 * @type file
 * @dir img/pictures/
 * @desc Custom image for the selection arrow (optional - overrides preset)
 * 
 * @param selectionArrowOffsetX
 * @text Arrow X Offset
 * @type number
 * @default -30
 * @desc Horizontal offset of selection arrow from button
 * 
 * @param selectionArrowOffsetY
 * @text Arrow Y Offset
 * @type number
 * @default 0
 * @desc Vertical offset of selection arrow from button
 * 
 * @help
 * =============================================================================
 * Title Menu Customization v1.0.1
 * =============================================================================
 * 
 * This plugin replaces the default RPG Maker MZ title menu window with
 * customizable draggable buttons. Features include:
 * 
 * - Custom buttons for New Game, Load Game, Options, or Common Events
 * - Social media buttons that open external links
 * - Drag and drop placement with persistent position saving (playtest only)
 * - Hover and press visual feedback
 * - Snap-to-grid alignment system for precise button positioning
 * - Button-to-button alignment (edges, centers)
 * - Advanced button hover effects with smooth animations
 * - Customizable logo with drag and drop positioning
 * - Logo hover effects (separate from button hover effects)
 * - Keyboard navigation with arrow keys or WASD
 * - Visual selection arrow for keyboard navigation
 * - New arrow direction presets (Up, Down, Left, Right)
 * - Hover effects triggered by keyboard selection
 * - Sound effects for hover and selection actions
 * 
 * Each button supports:
 * - Command: newGame, loadGame, options, commonEvent, or credits
 * - CommonEventId (if applicable)
 * - Custom dimensions and screen position
 * - Custom images for default and hover states
 * 
 * Social Media Buttons:
 * - Direct URL opening in new tab/window
 * - Same drag and drop functionality as regular buttons
 * - Separate hover effects from regular buttons
 * - Persistent position saving
 * - Custom images and text support
 * 
 * Alignment Features:
 * - Grid snapping: Buttons snap to a configurable grid
 * - Button alignment: Buttons align to other buttons' edges and centers
 * - Visual grid: Optional grid lines for precise positioning
 * - Alignment types: Both directions, horizontal only, or vertical only
 * 
 * Button Hover Effects:
 * - Slide effect: Buttons can slide in any direction on hover
 * - Pop-out effect: Buttons can scale up/down on hover
 * - Opacity effect: Buttons can change transparency on hover
 * - Tone effect: Buttons can change color tone on hover
 * - Smooth animations: All effects use configurable animation speed
 * - Individual control: Each effect can be enabled/disabled separately
 * - Separate from logo and social media hover effects
 * 
 * Social Media Hover Effects:
 * - Slide effect: Social media buttons can slide in any direction on hover
 * - Pop-out effect: Social media buttons can scale up/down on hover
 * - Opacity effect: Social media buttons can change transparency on hover
 * - Tone effect: Social media buttons can change color tone on hover
 * - Smooth animations: All effects use configurable animation speed
 * - Individual control: Each effect can be enabled/disabled separately
 * - Separate from regular button and logo hover effects
 * 
 * Logo Features:
 * - Custom logo image display
 * - Draggable positioning during playtest
 * - Persistent position saving
 * - Configurable size and position
 * - Grid alignment support
 * - Independent hover effects (separate from buttons)
 * 
 * Keyboard Navigation:
 * - Arrow keys or WASD to navigate between buttons
 * - Enter/Space to activate selected button
 * - Visual selection arrow indicator
 * - Four arrow direction presets (Up, Down, Left, Right)
 * - Custom arrow image support (overrides presets)
 * - Configurable arrow positioning
 * - Hover effects and hover images triggered by keyboard selection
 * - Selection arrow follows mouse hover for seamless interaction
 * 
 * Sound Effects:
 * - Hover SE: Plays when moving mouse between buttons or using arrow keys
 * - Selection SE: Plays when clicking buttons or pressing Enter/Space
 * - Both sound effects are optional and can be disabled by leaving them empty
 * - Sound files should be placed in the audio/se/ folder
 * 
 * Deployment Behavior:
 * - Drag and drop is automatically disabled in deployed games
 * - Button and logo positions are saved to JSON files in the data/ folder
 * - Position files are automatically included when you deploy your game
 * - Players see the exact button layout you configured during development
 * - Sound effects, hover effects, and keyboard navigation work in all versions
 * - Social media links open in the player's default browser
 * 
 * =============================================================================
 * INSTRUCTIONS
 * =============================================================================
 * 
 * SETUP:
 * 1. Install this plugin in your RPG Maker MZ project
 * 2. Place it after PluginCommonBase in the plugin list
 * 3. Configure the parameters as needed
 * 4. Test in playtest mode to position your buttons
 * 
 * CUSTOM BUTTONS:
 * - Add buttons for New Game, Load Game, Options, or Common Events
 * - Each button can have custom images for default and hover states
 * - Buttons can trigger common events for custom functionality
 * - Use the "Button Text" field if you don't have button images
 * 
 * SOCIAL MEDIA BUTTONS:
 * - Add buttons that open external websites
 * - URLs open in the player's default browser
 * - Perfect for Discord, Twitter, YouTube, or website links
 * - Same customization options as regular buttons
 * 
 * HOVER EFFECTS:
 * - Configure separate hover effects for buttons, social media, and logo
 * - Effects include slide, pop-out, opacity, and tone changes
 * - Each effect can be enabled/disabled individually
 * - Animation speed is configurable for smooth transitions
 * 
 * ALIGNMENT SYSTEM:
 * - Enable grid snapping for precise button positioning
 * - Buttons can align to other buttons' edges and centers
 * - Visual grid can be enabled for debugging
 * - Choose horizontal, vertical, or both alignment types
 * 
 * KEYBOARD NAVIGATION:
 * - Use arrow keys or WASD to navigate between buttons
 * - Enter or Space to activate selected button
 * - Visual selection arrow shows current selection
 * - Arrow follows mouse hover for seamless interaction
 * 
 * SOUND EFFECTS:
 * - Add hover sounds for button interactions
 * - Add selection sounds for button clicks
 * - Sound files go in the audio/se/ folder
 * - Leave empty to disable sound effects
 * 
 * LOGO DISPLAY:
 * - Add a custom logo to your title menu
 * - Logo can be positioned and resized
 * - Supports hover effects and drag positioning
 * - Position is saved persistently
 * 
 * DRAG AND DROP:
 * - During playtest: Drag buttons and logo to position them
 * - Positions are saved to JSON files in the data/ folder
 * - These files deploy with your game automatically
 * - In deployed games: Drag and drop is automatically disabled
 * - Players see your exact button layout from development
 * - Files: data/MainMenuPositions.json and data/MainMenuLogoPosition.json
 * 
 * FILE REQUIREMENTS:
 * - Button images: Place in img/pictures/ folder
 * - Sound effects: Place in audio/se/ folder
 * - Logo images: Place in img/pictures/ folder
 * - Use PNG or JPG format for images
 * - Use OGG format for sounds
 * 
 * TROUBLESHOOTING:
 * - If buttons don't appear: Check image file paths
 * - If sounds don't play: Check audio file paths and use OGG format
 * - If positions don't save: Check that you're in playtest mode
 * - If drag doesn't work: Ensure you're in playtest mode
 * - If deployed positions are wrong: Check data/ folder for JSON files
 * - Position files should be included automatically when deploying
 * 
 * =============================================================================
 * CHANGELOG
 * =============================================================================
 * 
 * v1.0.1 - Bug Fixes & Stability Update
 * - MAJOR FIX: Positions now save to JSON files that deploy with your game
 * - Button positions you set during playtest now appear in deployed games
 * - Added data/MainMenuPositions.json for button positions
 * - Added data/MainMenuLogoPosition.json for logo position
 * - Load priority: JSON file → localStorage → plugin parameters
 * - Files only write during playtest, preventing player modifications
 * - Fixed critical bug where buttons would stack in one spot in deployed games
 * - Fixed coordinate parsing to handle all edge cases properly
 * - Improved default position handling for buttons, social media buttons, and logo
 * - Buttons now consistently use fallback positions when plugin parameters are invalid
 * - Fixed position 0 being incorrectly treated as unset (buttons can now be at x=0 or y=0)
 * - Fixed logo saving incorrect position when hover effects are active
 * - Fixed logo drag bounds using constants instead of actual sprite dimensions
 * - Fixed inconsistent RGB to hex conversion for tone effects
 * - Fixed missing error handling for external URL opening
 * - Fixed scene state checks to prevent null reference errors
 * - Fixed image loading with proper error handling and duplicate load prevention
 * - Fixed child index assumptions for proper sprite rendering order
 * - Added validation for loaded positions to prevent off-screen buttons
 * - Added localStorage quota exceeded detection and warnings
 * - Added save throttling to prevent excessive localStorage writes
 * - Added proper cleanup of timeouts on scene termination
 * - Replaced unsafe setTimeout with frame-based timing
 * - Corrected documentation (removed M4A, only OGG supported)
 * 
 * v1.0.0 - Initial Release
 * 
 */

/*~struct~CustomButton:
 * @param name
 * @text Button Name
 * @type string
 * @desc Internal name for the button
 * 
 * @param text
 * @text Button Text
 * @type string
 * @desc Text displayed on the button
 * 
 * @param command
 * @text Command Type
 * @type select
 * @option newGame
 * @option loadGame
 * @option options
 * @option commonEvent
 * @option credits
 * @desc What action the button performs
 * 
 * @param commonEventId
 * @text Common Event ID
 * @type common_event
 * @desc ID of common event to trigger (only for commonEvent)
 * 
 * @param x
 * @text Default X
 * @type number
 * @default 100
 * 
 * @param y
 * @text Default Y
 * @type number
 * @default 100
 * 
 * @param width
 * @text Button Width
 * @type number
 * @default 120
 * 
 * @param height
 * @text Button Height
 * @type number
 * @default 40
 * 
 * @param imageName
 * @text Button Image
 * @type file
 * @dir img/pictures/
 * @desc Image file for button background (optional)
 * 
 * @param hoverImageName
 * @text Hover Image
 * @type file
 * @dir img/pictures/
 * @desc Image file for button when hovered (optional)
 */

/*~struct~SocialMediaButton:
 * @param name
 * @text Button Name
 * @type string
 * @desc Internal name for the button
 * 
 * @param text
 * @text Button Text
 * @type string
 * @desc Text displayed on the button (optional if image is provided)
 * 
 * @param url
 * @text URL
 * @type string
 * @desc URL to open when button is clicked
 * 
 * @param x
 * @text Default X
 * @type number
 * @default 100
 * 
 * @param y
 * @text Default Y
 * @type number
 * @default 100
 * 
 * @param width
 * @text Button Width
 * @type number
 * @default 120
 * 
 * @param height
 * @text Button Height
 * @type number
 * @default 40
 * 
 * @param imageName
 * @text Button Image
 * @type file
 * @dir img/pictures/
 * @desc Image file for button background (optional)
 * 
 * @param hoverImageName
 * @text Hover Image
 * @type file
 * @dir img/pictures/
 * @desc Image file for button when hovered (optional)
 */

/*~struct~ButtonHoverEffects:
 * @param hoverSlideEnabled
 * @text Enable Slide Effect
 * @type boolean
 * @default true
 * @desc Enable sliding animation on hover
 * 
 * @param hoverSlideX
 * @text Slide X Offset
 * @type number
 * @default 5
 * @min -50
 * @max 50
 * @desc Horizontal slide distance in pixels
 * 
 * @param hoverSlideY
 * @text Slide Y Offset
 * @type number
 * @default 0
 * @min -50
 * @max 50
 * @desc Vertical slide distance in pixels
 * 
 * @param hoverPopOutEnabled
 * @text Enable Pop-Out Effect
 * @type boolean
 * @default true
 * @desc Enable scaling/pop-out effect on hover
 * 
 * @param hoverPopOutScale
 * @text Pop-Out Scale
 * @type number
 * @default 1.1
 * @min 1.0
 * @max 2.0
 * @decimals 2
 * @desc Scale factor for pop-out effect
 * 
 * @param hoverOpacityEnabled
 * @text Enable Opacity Effect
 * @type boolean
 * @default false
 * @desc Enable opacity change on hover
 * 
 * @param hoverOpacityValue
 * @text Hover Opacity
 * @type number
 * @default 0.8
 * @min 0.1
 * @max 1.0
 * @decimals 2
 * @desc Opacity value when hovering (1.0 = fully opaque)
 * 
 * @param hoverToneEnabled
 * @text Enable Tone Effect
 * @type boolean
 * @default false
 * @desc Enable color tone change on hover
 * 
 * @param hoverToneRed
 * @text Tone Red
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Red tone adjustment on hover
 * 
 * @param hoverToneGreen
 * @text Tone Green
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Green tone adjustment on hover
 * 
 * @param hoverToneBlue
 * @text Tone Blue
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Blue tone adjustment on hover
 * 
 * @param hoverToneGray
 * @text Tone Gray
 * @type number
 * @default 0
 * @min 0
 * @max 255
 * @desc Gray tone adjustment on hover
 * 
 * @param hoverAnimationSpeed
 * @text Animation Speed
 * @type number
 * @default 0.2
 * @min 0.05
 * @max 1.0
 * @decimals 2
 * @desc Speed of hover animations (lower = faster)
 */

/*~struct~SocialMediaHoverEffects:
 * @param hoverSlideEnabled
 * @text Enable Slide Effect
 * @type boolean
 * @default true
 * @desc Enable sliding animation on hover
 * 
 * @param hoverSlideX
 * @text Slide X Offset
 * @type number
 * @default 3
 * @min -50
 * @max 50
 * @desc Horizontal slide distance in pixels
 * 
 * @param hoverSlideY
 * @text Slide Y Offset
 * @type number
 * @default 0
 * @min -50
 * @max 50
 * @desc Vertical slide distance in pixels
 * 
 * @param hoverPopOutEnabled
 * @text Enable Pop-Out Effect
 * @type boolean
 * @default true
 * @desc Enable scaling/pop-out effect on hover
 * 
 * @param hoverPopOutScale
 * @text Pop-Out Scale
 * @type number
 * @default 1.05
 * @min 1.0
 * @max 2.0
 * @decimals 2
 * @desc Scale factor for pop-out effect
 * 
 * @param hoverOpacityEnabled
 * @text Enable Opacity Effect
 * @type boolean
 * @default false
 * @desc Enable opacity change on hover
 * 
 * @param hoverOpacityValue
 * @text Hover Opacity
 * @type number
 * @default 0.9
 * @min 0.1
 * @max 1.0
 * @decimals 2
 * @desc Opacity value when hovering (1.0 = fully opaque)
 * 
 * @param hoverToneEnabled
 * @text Enable Tone Effect
 * @type boolean
 * @default false
 * @desc Enable color tone change on hover
 * 
 * @param hoverToneRed
 * @text Tone Red
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Red tone adjustment on hover
 * 
 * @param hoverToneGreen
 * @text Tone Green
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Green tone adjustment on hover
 * 
 * @param hoverToneBlue
 * @text Tone Blue
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Blue tone adjustment on hover
 * 
 * @param hoverToneGray
 * @text Tone Gray
 * @type number
 * @default 0
 * @min 0
 * @max 255
 * @desc Gray tone adjustment on hover
 * 
 * @param hoverAnimationSpeed
 * @text Animation Speed
 * @type number
 * @default 0.15
 * @min 0.05
 * @max 1.0
 * @decimals 2
 * @desc Speed of hover animations (lower = faster)
 */

/*~struct~Logo:
 * @param enabled
 * @text Enable Logo
 * @type boolean
 * @default false
 * @desc Enable logo display on the title menu
 * 
 * @param imageName
 * @text Logo Image
 * @type file
 * @dir img/pictures/
 * @desc Image file for the logo
 * 
 * @param x
 * @text Default X Position
 * @type number
 * @default 50
 * @desc Default horizontal position of the logo
 * 
 * @param y
 * @text Default Y Position
 * @type number
 * @default 50
 * @desc Default vertical position of the logo
 * 
 * @param width
 * @text Logo Width
 * @type number
 * @default 200
 * @desc Width of the logo in pixels
 * 
 * @param height
 * @text Logo Height
 * @type number
 * @default 100
 * @desc Height of the logo in pixels
 * 
 * @param draggable
 * @text Draggable
 * @type boolean
 * @default true
 * @desc Allow dragging the logo during playtest
 * 
 * @param savePosition
 * @text Save Position
 * @type boolean
 * @default true
 * @desc Save logo position between sessions
 * 
 * @param enableHoverEffects
 * @text Enable Logo Hover Effects
 * @type boolean
 * @default true
 * @desc Enable hover effects for the logo (uses same settings as buttons)
 */

/*~struct~LogoHoverEffects:
 * @param hoverSlideEnabled
 * @text Enable Slide Effect
 * @type boolean
 * @default true
 * @desc Enable sliding animation on hover
 * 
 * @param hoverSlideX
 * @text Slide X Offset
 * @type number
 * @default 3
 * @min -50
 * @max 50
 * @desc Horizontal slide distance in pixels
 * 
 * @param hoverSlideY
 * @text Slide Y Offset
 * @type number
 * @default 0
 * @min -50
 * @max 50
 * @desc Vertical slide distance in pixels
 * 
 * @param hoverPopOutEnabled
 * @text Enable Pop-Out Effect
 * @type boolean
 * @default true
 * @desc Enable scaling/pop-out effect on hover
 * 
 * @param hoverPopOutScale
 * @text Pop-Out Scale
 * @type number
 * @default 1.05
 * @min 1.0
 * @max 2.0
 * @decimals 2
 * @desc Scale factor for pop-out effect
 * 
 * @param hoverOpacityEnabled
 * @text Enable Opacity Effect
 * @type boolean
 * @default false
 * @desc Enable opacity change on hover
 * 
 * @param hoverOpacityValue
 * @text Hover Opacity
 * @type number
 * @default 0.9
 * @min 0.1
 * @max 1.0
 * @decimals 2
 * @desc Opacity value when hovering (1.0 = fully opaque)
 * 
 * @param hoverToneEnabled
 * @text Enable Tone Effect
 * @type boolean
 * @default false
 * @desc Enable color tone change on hover
 * 
 * @param hoverToneRed
 * @text Tone Red
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Red tone adjustment on hover
 * 
 * @param hoverToneGreen
 * @text Tone Green
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Green tone adjustment on hover
 * 
 * @param hoverToneBlue
 * @text Tone Blue
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * @desc Blue tone adjustment on hover
 * 
 * @param hoverToneGray
 * @text Tone Gray
 * @type number
 * @default 0
 * @min 0
 * @max 255
 * @desc Gray tone adjustment on hover
 * 
 * @param hoverAnimationSpeed
 * @text Animation Speed
 * @type number
 * @default 0.15
 * @min 0.05
 * @max 1.0
 * @decimals 2
 * @desc Speed of hover animations (lower = faster)
 */

(() => {
    const pluginName = "MainMenuCustomization";
    const parameters = PluginManager.parameters(pluginName);
    
    // Drag and drop settings (disabled in deployed games)
    const ENABLE_DRAG_AND_DROP = Utils.isNwjs() && Utils.isOptionValid('test') && parameters['enableDragAndDrop'] !== 'false';
    const SAVE_POSITIONS = true;
    const ENABLE_INTERACTION = true;
    const STORAGE_KEY = 'MainMenuButtonPositions';
    const POSITION_FILE = 'data/MainMenuPositions.json';

    // Button hover effect settings
    const BUTTON_HOVER_EFFECTS_CONFIG = JSON.parse(parameters['buttonHoverEffects'] || '{"hoverSlideEnabled":"true","hoverSlideX":"5","hoverSlideY":"0","hoverPopOutEnabled":"true","hoverPopOutScale":"1.1","hoverOpacityEnabled":"false","hoverOpacityValue":"0.8","hoverToneEnabled":"false","hoverToneRed":"0","hoverToneGreen":"0","hoverToneBlue":"0","hoverToneGray":"0","hoverAnimationSpeed":"0.2"}');
    const HOVER_EFFECTS = BUTTON_HOVER_EFFECTS_CONFIG;
    const HOVER_SLIDE_ENABLED = HOVER_EFFECTS.hoverSlideEnabled !== 'false';
    const HOVER_SLIDE_X = Number(HOVER_EFFECTS.hoverSlideX || 5);
    const HOVER_SLIDE_Y = Number(HOVER_EFFECTS.hoverSlideY || 0);
    const HOVER_POPOUT_ENABLED = HOVER_EFFECTS.hoverPopOutEnabled !== 'false';
    const HOVER_POPOUT_SCALE = Number(HOVER_EFFECTS.hoverPopOutScale || 1.1);
    const HOVER_OPACITY_ENABLED = HOVER_EFFECTS.hoverOpacityEnabled === 'true';
    const HOVER_OPACITY_VALUE = Number(HOVER_EFFECTS.hoverOpacityValue || 0.8);
    const HOVER_TONE_ENABLED = HOVER_EFFECTS.hoverToneEnabled === 'true';
    const HOVER_TONE_RED = Number(HOVER_EFFECTS.hoverToneRed || 0);
    const HOVER_TONE_GREEN = Number(HOVER_EFFECTS.hoverToneGreen || 0);
    const HOVER_TONE_BLUE = Number(HOVER_EFFECTS.hoverToneBlue || 0);
    const HOVER_TONE_GRAY = Number(HOVER_EFFECTS.hoverToneGray || 0);
    const HOVER_ANIMATION_SPEED = Number(HOVER_EFFECTS.hoverAnimationSpeed || 0.2);

    // Social media hover effect settings
    const SOCIAL_MEDIA_HOVER_EFFECTS_CONFIG = JSON.parse(parameters['socialMediaHoverEffects'] || '{"hoverSlideEnabled":"true","hoverSlideX":"3","hoverSlideY":"0","hoverPopOutEnabled":"true","hoverPopOutScale":"1.05","hoverOpacityEnabled":"false","hoverOpacityValue":"0.9","hoverToneEnabled":"false","hoverToneRed":"0","hoverToneGreen":"0","hoverToneBlue":"0","hoverToneGray":"0","hoverAnimationSpeed":"0.15"}');
    const SOCIAL_MEDIA_HOVER_EFFECTS = SOCIAL_MEDIA_HOVER_EFFECTS_CONFIG;
    const SOCIAL_MEDIA_HOVER_SLIDE_ENABLED = SOCIAL_MEDIA_HOVER_EFFECTS.hoverSlideEnabled !== 'false';
    const SOCIAL_MEDIA_HOVER_SLIDE_X = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverSlideX || 3);
    const SOCIAL_MEDIA_HOVER_SLIDE_Y = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverSlideY || 0);
    const SOCIAL_MEDIA_HOVER_POPOUT_ENABLED = SOCIAL_MEDIA_HOVER_EFFECTS.hoverPopOutEnabled !== 'false';
    const SOCIAL_MEDIA_HOVER_POPOUT_SCALE = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverPopOutScale || 1.05);
    const SOCIAL_MEDIA_HOVER_OPACITY_ENABLED = SOCIAL_MEDIA_HOVER_EFFECTS.hoverOpacityEnabled === 'true';
    const SOCIAL_MEDIA_HOVER_OPACITY_VALUE = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverOpacityValue || 0.9);
    const SOCIAL_MEDIA_HOVER_TONE_ENABLED = SOCIAL_MEDIA_HOVER_EFFECTS.hoverToneEnabled === 'true';
    const SOCIAL_MEDIA_HOVER_TONE_RED = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverToneRed || 0);
    const SOCIAL_MEDIA_HOVER_TONE_GREEN = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverToneGreen || 0);
    const SOCIAL_MEDIA_HOVER_TONE_BLUE = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverToneBlue || 0);
    const SOCIAL_MEDIA_HOVER_TONE_GRAY = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverToneGray || 0);
    const SOCIAL_MEDIA_HOVER_ANIMATION_SPEED = Number(SOCIAL_MEDIA_HOVER_EFFECTS.hoverAnimationSpeed || 0.15);

    // Logo settings
    const LOGO_CONFIG = JSON.parse(parameters['logo'] || '{"enabled":"false","imageName":"","x":"50","y":"50","width":"200","height":"100","draggable":"true","savePosition":"true","enableHoverEffects":"true"}');
    const LOGO_ENABLED = LOGO_CONFIG.enabled === 'true';
    const LOGO_IMAGE_NAME = String(LOGO_CONFIG.imageName || '');
    const parseLogoCoord = (value, defaultValue) => {
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    };
    const LOGO_X = parseLogoCoord(LOGO_CONFIG.x, 50);
    const LOGO_Y = parseLogoCoord(LOGO_CONFIG.y, 50);
    const LOGO_WIDTH = Number(LOGO_CONFIG.width || 200);
    const LOGO_HEIGHT = Number(LOGO_CONFIG.height || 100);
    const LOGO_DRAGGABLE = ENABLE_DRAG_AND_DROP && LOGO_CONFIG.draggable !== 'false';
    const LOGO_SAVE_POSITION = LOGO_CONFIG.savePosition !== 'false';
    const LOGO_ENABLE_HOVER_EFFECTS = LOGO_CONFIG.enableHoverEffects !== 'false';
    const LOGO_STORAGE_KEY = 'MainMenuLogoPosition';

    // Logo hover effects settings
    const LOGO_HOVER_EFFECTS_CONFIG = JSON.parse(parameters['logoHoverEffects'] || '{"hoverSlideEnabled":"true","hoverSlideX":"3","hoverSlideY":"0","hoverPopOutEnabled":"true","hoverPopOutScale":"1.05","hoverOpacityEnabled":"false","hoverOpacityValue":"0.9","hoverToneEnabled":"false","hoverToneRed":"0","hoverToneGreen":"0","hoverToneBlue":"0","hoverToneGray":"0","hoverAnimationSpeed":"0.15"}');
    const LOGO_HOVER_EFFECTS = LOGO_HOVER_EFFECTS_CONFIG;
    const LOGO_HOVER_SLIDE_ENABLED = LOGO_HOVER_EFFECTS.hoverSlideEnabled !== 'false';
    const LOGO_HOVER_SLIDE_X = Number(LOGO_HOVER_EFFECTS.hoverSlideX || 3);
    const LOGO_HOVER_SLIDE_Y = Number(LOGO_HOVER_EFFECTS.hoverSlideY || 0);
    const LOGO_HOVER_POPOUT_ENABLED = LOGO_HOVER_EFFECTS.hoverPopOutEnabled !== 'false';
    const LOGO_HOVER_POPOUT_SCALE = Number(LOGO_HOVER_EFFECTS.hoverPopOutScale || 1.05);
    const LOGO_HOVER_OPACITY_ENABLED = LOGO_HOVER_EFFECTS.hoverOpacityEnabled === 'true';
    const LOGO_HOVER_OPACITY_VALUE = Number(LOGO_HOVER_EFFECTS.hoverOpacityValue || 0.9);
    const LOGO_HOVER_TONE_ENABLED = LOGO_HOVER_EFFECTS.hoverToneEnabled === 'true';
    const LOGO_HOVER_TONE_RED = Number(LOGO_HOVER_EFFECTS.hoverToneRed || 0);
    const LOGO_HOVER_TONE_GREEN = Number(LOGO_HOVER_EFFECTS.hoverToneGreen || 0);
    const LOGO_HOVER_TONE_BLUE = Number(LOGO_HOVER_EFFECTS.hoverToneBlue || 0);
    const LOGO_HOVER_TONE_GRAY = Number(LOGO_HOVER_EFFECTS.hoverToneGray || 0);
    const LOGO_HOVER_ANIMATION_SPEED = Number(LOGO_HOVER_EFFECTS.hoverAnimationSpeed || 0.15);

    // Alignment settings
    const ENABLE_ALIGNMENT = parameters['enableAlignment'] !== 'false';
    const GRID_SIZE = parameters['gridSize'] !== undefined && parameters['gridSize'] !== null && parameters['gridSize'] !== '' ? Number(parameters['gridSize']) : 20;
    const ALIGNMENT_TYPE = String(parameters['alignmentType'] || 'Both');
    const SHOW_GRID = parameters['showGrid'] === 'true';

    // Sound effect settings
    const HOVER_SE = String(parameters['hoverSE'] || '');
    const SELECTION_SE = String(parameters['selectionSE'] || '');

    // Keyboard navigation settings
    const ENABLE_KEYBOARD_NAVIGATION = parameters['enableKeyboardNavigation'] !== 'false';
    const ARROW_FOLLOWS_MOUSE = parameters['arrowFollowsMouse'] !== 'false';
    const SHOW_SELECTION_ARROW = parameters['showSelectionArrow'] !== 'false';
    const SELECTION_ARROW_DIRECTION = String(parameters['selectionArrowDirection'] || 'Left');
    const SELECTION_ARROW_IMAGE = String(parameters['selectionArrowImage'] || '');
    const SELECTION_ARROW_OFFSET_X = parameters['selectionArrowOffsetX'] !== undefined && parameters['selectionArrowOffsetX'] !== null && parameters['selectionArrowOffsetX'] !== '' ? Number(parameters['selectionArrowOffsetX']) : -30;
    const SELECTION_ARROW_OFFSET_Y = parameters['selectionArrowOffsetY'] !== undefined && parameters['selectionArrowOffsetY'] !== null && parameters['selectionArrowOffsetY'] !== '' ? Number(parameters['selectionArrowOffsetY']) : 0;

    const CUSTOM_BUTTONS = [];
    try {
        const rawData = JSON.parse(parameters['customButtons'] || "[]");
        rawData.forEach((entry, index) => {
            const cfg = JSON.parse(entry);
            const parseCoord = (value, defaultValue) => {
                if (value === undefined || value === null || value === '') {
                    return defaultValue;
                }
                const num = Number(value);
                return isNaN(num) ? defaultValue : num;
            };
            CUSTOM_BUTTONS.push({
                name: String(cfg.name || `Button_${index}`),
                text: String(cfg.text || ''),
                command: String(cfg.command || 'commonEvent'),
                commonEventId: Number(cfg.commonEventId || 0),
                x: parseCoord(cfg.x, 100),
                y: parseCoord(cfg.y, 100 + (index * 50)),
                width: Number(cfg.width || 120),
                height: Number(cfg.height || 40),
                imageName: String(cfg.imageName || ''),
                hoverImageName: String(cfg.hoverImageName || '')
            });
        });
    } catch (e) {
        console.error('customButtons parse failed:', e);
    }
 
     // If no custom buttons are configured, create default ones
     if (CUSTOM_BUTTONS.length === 0) {
         CUSTOM_BUTTONS.push(
             { name: 'NewGame', text: 'New Game', command: 'newGame', commonEventId: 0, x: 100, y: 100, width: 120, height: 40, imageName: '', hoverImageName: '' },
             { name: 'LoadGame', text: 'Load Game', command: 'loadGame', commonEventId: 0, x: 100, y: 160, width: 120, height: 40, imageName: '', hoverImageName: '' },
             { name: 'Options',  text: 'Options',  command: 'options',  commonEventId: 0, x: 100, y: 220, width: 120, height: 40, imageName: '', hoverImageName: '' }
         );
     }

    // Parse social media buttons
    const SOCIAL_MEDIA_BUTTONS = [];
    try {
        const rawSocialData = JSON.parse(parameters['socialMediaButtons'] || "[]");
        rawSocialData.forEach((entry, index) => {
            const cfg = JSON.parse(entry);
            const parseCoord = (value, defaultValue) => {
                if (value === undefined || value === null || value === '') {
                    return defaultValue;
                }
                const num = Number(value);
                return isNaN(num) ? defaultValue : num;
            };
            SOCIAL_MEDIA_BUTTONS.push({
                name: String(cfg.name || `SocialButton_${index}`),
                text: String(cfg.text || ''),
                url: String(cfg.url || ''),
                x: parseCoord(cfg.x, 100),
                y: parseCoord(cfg.y, 100 + (index * 50)),
                width: Number(cfg.width || 120),
                height: Number(cfg.height || 40),
                imageName: String(cfg.imageName || ''),
                hoverImageName: String(cfg.hoverImageName || '')
            });
        });
    } catch (e) {
        console.error('socialMediaButtons parse failed:', e);
    }

    // File system helper functions
    function savePositionsToFile(positions) {
        if (!Utils.isNwjs()) return;
        try {
            const fs = require('fs');
            const path = require('path');
            const base = path.dirname(process.mainModule.filename);
            const filePath = path.join(base, POSITION_FILE);
            fs.writeFileSync(filePath, JSON.stringify(positions, null, 2));
            console.log('Positions saved to file:', filePath);
        } catch (e) {
            console.error('Failed to save positions to file:', e);
        }
    }

    function loadPositionsFromFile() {
        if (!Utils.isNwjs()) return null;
        try {
            const fs = require('fs');
            const path = require('path');
            const base = path.dirname(process.mainModule.filename);
            const filePath = path.join(base, POSITION_FILE);
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Failed to load positions from file:', e);
        }
        return null;
    }

    // Alignment helper functions
    function snapToGrid(value, gridSize) {
        return Math.round(value / gridSize) * gridSize;
    }

    function alignToOtherButtons(x, y, currentButton, allButtons) {
        let alignedX = x;
        let alignedY = y;
        
        if (!currentButton || !currentButton.width || !currentButton.height) {
            return { x: alignedX, y: alignedY };
        }
        
        allButtons.forEach(btn => {
            if (btn === currentButton || !btn || !btn.width || !btn.height) return;
            
            if (ALIGNMENT_TYPE === 'Both' || ALIGNMENT_TYPE === 'Horizontal Only') {
                if (Math.abs(x - btn.x) < GRID_SIZE) {
                    alignedX = btn.x;
                }
                if (Math.abs((x + currentButton.width/2) - (btn.x + btn.width/2)) < GRID_SIZE) {
                    alignedX = (btn.x + btn.width/2) - currentButton.width/2;
                }
                if (Math.abs((x + currentButton.width) - (btn.x + btn.width)) < GRID_SIZE) {
                    alignedX = (btn.x + btn.width) - currentButton.width;
                }
            }
            
            if (ALIGNMENT_TYPE === 'Both' || ALIGNMENT_TYPE === 'Vertical Only') {
                if (Math.abs(y - btn.y) < GRID_SIZE) {
                    alignedY = btn.y;
                }
                if (Math.abs((y + currentButton.height/2) - (btn.y + btn.height/2)) < GRID_SIZE) {
                    alignedY = (btn.y + btn.height/2) - currentButton.height/2;
                }
                if (Math.abs((y + currentButton.height) - (btn.y + btn.height)) < GRID_SIZE) {
                    alignedY = (btn.y + btn.height) - currentButton.height;
                }
            }
        });
        
        return { x: alignedX, y: alignedY };
    }

    // Sound effect helper functions
    function playHoverSE() {
        if (HOVER_SE && HOVER_SE.trim() !== '') {
            AudioManager.playSe({ name: HOVER_SE, pan: 0, pitch: 100, volume: 90 });
        }
    }

    function playSelectionSE() {
        if (SELECTION_SE && SELECTION_SE.trim() !== '') {
            AudioManager.playSe({ name: SELECTION_SE, pan: 0, pitch: 100, volume: 90 });
        }
    }

     class Logo extends PIXI.Container {
         constructor(config) {
             super();
             this._config = config;

             // Make this container interactive if draggable or has hover effects
             if (LOGO_DRAGGABLE || LOGO_ENABLE_HOVER_EFFECTS) {
                 this.interactive = true;
                 this.buttonMode = true;
             }

             // State flags
             this._isDragging = false;
             this._dragOffset = { x: 0, y: 0 };

             // Hover effect properties (same as buttons)
             this._baseX = 0;
             this._baseY = 0;
             this._baseScale = { x: 1, y: 1 };
             this._baseAlpha = 1;
             this._baseTone = [0, 0, 0, 0];
             this._hoverProgress = 0;
             this._isAnimating = false;
             this._isHovered = false;

             // Create sprite
             this._sprite = null;
             this.createLogoSprite();


         }

         createLogoSprite() {
             if (LOGO_IMAGE_NAME && LOGO_IMAGE_NAME.trim() !== '') {
                 const bitmap = ImageManager.loadPicture(LOGO_IMAGE_NAME);
                 bitmap.addLoadListener(() => {
                     if (this._sprite) return;
                     try {
                         const texture = PIXI.Texture.from(bitmap.canvas);
                         this._sprite = new PIXI.Sprite(texture);
                         this._sprite.width = LOGO_WIDTH;
                         this._sprite.height = LOGO_HEIGHT;
                         this._sprite.x = 0;
                         this._sprite.y = 0;
                         this.addChild(this._sprite);
                     } catch (e) {
                         console.error('Failed to load logo image:', LOGO_IMAGE_NAME, e);
                     }
                 });
             }
         }

         update() {
             if (!LOGO_DRAGGABLE && !LOGO_ENABLE_HOVER_EFFECTS) return;

             const mouseX = TouchInput.x;
             const mouseY = TouchInput.y;
             const isOverLogo = this.containsPoint(mouseX, mouseY);

             // Handle hover effects
             if (LOGO_ENABLE_HOVER_EFFECTS) {
                 if (isOverLogo && !this._isHovered) {
                     this._isHovered = true;
                 } else if (!isOverLogo && this._isHovered) {
                     this._isHovered = false;
                 }
                 this.updateHoverEffects();
             }

             // Handle drag
             if (LOGO_DRAGGABLE && isOverLogo && TouchInput.isPressed() && !this._isDragging) {
                 this._isDragging = true;
                 this._dragOffset.x = mouseX - this.x;
                 this._dragOffset.y = mouseY - this.y;
            } else if (this._isDragging && TouchInput.isPressed()) {
                const width = this._sprite ? this._sprite.width : LOGO_WIDTH;
                const height = this._sprite ? this._sprite.height : LOGO_HEIGHT;
                let newX = Math.max(0, Math.min(Graphics.width - width, mouseX - this._dragOffset.x));
                let newY = Math.max(0, Math.min(Graphics.height - height, mouseY - this._dragOffset.y));

                if (ENABLE_ALIGNMENT) {
                    newX = snapToGrid(newX, GRID_SIZE);
                    newY = snapToGrid(newY, GRID_SIZE);
                }

                this.setBasePosition(newX, newY);
             } else if (this._isDragging && TouchInput.isReleased()) {
                 // Save position when drag ends
                 if (LOGO_SAVE_POSITION) {
                     this.savePosition();
                 }
                 this._isDragging = false;
             }
         }

         containsPoint(x, y) {
             const width = this._sprite ? this._sprite.width : LOGO_WIDTH;
             const height = this._sprite ? this._sprite.height : LOGO_HEIGHT;
             return x >= this.x && x <= this.x + width &&
                    y >= this.y && y <= this.y + height;
         }

         savePosition() {
             try {
                 const position = { x: this._baseX, y: this._baseY };
                 localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(position));
                 
                 if (ENABLE_DRAG_AND_DROP && Utils.isNwjs()) {
                     try {
                         const fs = require('fs');
                         const path = require('path');
                         const base = path.dirname(process.mainModule.filename);
                         const filePath = path.join(base, 'data/MainMenuLogoPosition.json');
                         fs.writeFileSync(filePath, JSON.stringify(position, null, 2));
                     } catch (fileError) {
                         console.error('Failed to save logo position to file:', fileError);
                     }
                 }
             } catch (e) {
                 console.error('Logo position save error:', e);
                 if (e.name === 'QuotaExceededError') {
                     console.warn('localStorage quota exceeded. Logo position not saved.');
                 }
             }
         }

         loadPosition() {
             if (!LOGO_SAVE_POSITION) return { x: LOGO_X, y: LOGO_Y };

             try {
                 let position = null;
                 
                 if (Utils.isNwjs()) {
                     try {
                         const fs = require('fs');
                         const path = require('path');
                         const base = path.dirname(process.mainModule.filename);
                         const filePath = path.join(base, 'data/MainMenuLogoPosition.json');
                         if (fs.existsSync(filePath)) {
                             const data = fs.readFileSync(filePath, 'utf8');
                             position = JSON.parse(data);
                         }
                     } catch (fileError) {
                         console.log('No logo position file found, trying localStorage');
                     }
                 }
                 
                 if (!position) {
                     const saved = localStorage.getItem(LOGO_STORAGE_KEY);
                     if (saved) {
                         position = JSON.parse(saved);
                     }
                 }
                 
                 if (position) {
                     let x = typeof position.x === 'number' ? position.x : LOGO_X;
                     let y = typeof position.y === 'number' ? position.y : LOGO_Y;
                     
                     x = Math.max(0, Math.min(Graphics.width - LOGO_WIDTH, x));
                     y = Math.max(0, Math.min(Graphics.height - LOGO_HEIGHT, y));
                     
                     return { x: x, y: y };
                 }
             } catch (e) {
                 console.error('Logo position load error:', e);
             }
             return { x: LOGO_X, y: LOGO_Y };
         }

         updateHoverEffects() {
             if (!LOGO_ENABLE_HOVER_EFFECTS) return;

             const targetProgress = this._isHovered ? 1 : 0;
             
             if (this._hoverProgress !== targetProgress) {
                 this._isAnimating = true;
                 
                 if (targetProgress > this._hoverProgress) {
                     this._hoverProgress = Math.min(1, this._hoverProgress + LOGO_HOVER_ANIMATION_SPEED);
                 } else {
                     this._hoverProgress = Math.max(0, this._hoverProgress - LOGO_HOVER_ANIMATION_SPEED);
                 }
                 
                 if (this._hoverProgress === targetProgress) {
                     this._isAnimating = false;
                 }
             }

             this.applyHoverEffects();
         }

         applyHoverEffects() {
             if (!LOGO_ENABLE_HOVER_EFFECTS) return;

             // Slide effect
             if (LOGO_HOVER_SLIDE_ENABLED) {
                 this.x = this._baseX + (LOGO_HOVER_SLIDE_X * this._hoverProgress);
                 this.y = this._baseY + (LOGO_HOVER_SLIDE_Y * this._hoverProgress);
             }

             // Pop-out effect
             if (LOGO_HOVER_POPOUT_ENABLED) {
                 const scale = 1 + ((LOGO_HOVER_POPOUT_SCALE - 1) * this._hoverProgress);
                 this.scale.x = this._baseScale.x * scale;
                 this.scale.y = this._baseScale.y * scale;
             }

             // Opacity effect
             if (LOGO_HOVER_OPACITY_ENABLED) {
                 const alpha = this._baseAlpha + ((LOGO_HOVER_OPACITY_VALUE - this._baseAlpha) * this._hoverProgress);
                 this.alpha = alpha;
             }

             // Tone effect
             if (LOGO_HOVER_TONE_ENABLED) {
                 const tone = [
                     this._baseTone[0] + (LOGO_HOVER_TONE_RED * this._hoverProgress),
                     this._baseTone[1] + (LOGO_HOVER_TONE_GREEN * this._hoverProgress),
                     this._baseTone[2] + (LOGO_HOVER_TONE_BLUE * this._hoverProgress),
                     this._baseTone[3] + (LOGO_HOVER_TONE_GRAY * this._hoverProgress)
                 ];
                 this.tint = this.rgbToHex(tone);
             }
         }

         rgbToHex(tone) {
             const r = Math.max(0, Math.min(255, tone[0]));
             const g = Math.max(0, Math.min(255, tone[1]));
             const b = Math.max(0, Math.min(255, tone[2]));
             return (r << 16) | (g << 8) | b;
         }

         setBasePosition(x, y) {
             this._baseX = x;
             this._baseY = y;
             this.x = x;
             this.y = y;
         }
     }

     class SelectionArrow extends PIXI.Container {
         constructor() {
             super();
             this._sprite = null;
             this._currentButtonIndex = 0;
             this._buttons = [];
             this._visible = false;
             
             this.createArrowSprite();
         }

         createArrowSprite() {
             if (SELECTION_ARROW_IMAGE && SELECTION_ARROW_IMAGE.trim() !== '') {
                 // Use custom image
                 const bitmap = ImageManager.loadPicture(SELECTION_ARROW_IMAGE);
                 bitmap.addLoadListener(() => {
                     const texture = PIXI.Texture.from(bitmap.canvas);
                     this._sprite = new PIXI.Sprite(texture);
                     this._sprite.anchor.set(0.5);
                     this.addChild(this._sprite);
                 });
             } else {
                 // Create preset directional arrow
                 this._sprite = new PIXI.Graphics();
                 this.createPresetArrow();
                 this.addChild(this._sprite);
             }
         }

         createPresetArrow() {
             this._sprite.clear();
             
             // Arrow styling
             const fillColor = 0xffffff;
             const borderColor = 0x000000;
             const borderWidth = 2;
             
             this._sprite.lineStyle(borderWidth, borderColor);
             this._sprite.beginFill(fillColor);
             
             switch (SELECTION_ARROW_DIRECTION) {
                 case 'Up':
                     this._sprite.moveTo(0, -15);
                     this._sprite.lineTo(-12, 5);
                     this._sprite.lineTo(-6, 5);
                     this._sprite.lineTo(-6, 15);
                     this._sprite.lineTo(6, 15);
                     this._sprite.lineTo(6, 5);
                     this._sprite.lineTo(12, 5);
                     this._sprite.lineTo(0, -15);
                     break;
                     
                 case 'Down':
                     this._sprite.moveTo(0, 15);
                     this._sprite.lineTo(-12, -5);
                     this._sprite.lineTo(-6, -5);
                     this._sprite.lineTo(-6, -15);
                     this._sprite.lineTo(6, -15);
                     this._sprite.lineTo(6, -5);
                     this._sprite.lineTo(12, -5);
                     this._sprite.lineTo(0, 15);
                     break;
                     
                 case 'Left':
                     this._sprite.moveTo(-15, 0);
                     this._sprite.lineTo(5, -12);
                     this._sprite.lineTo(5, -6);
                     this._sprite.lineTo(15, -6);
                     this._sprite.lineTo(15, 6);
                     this._sprite.lineTo(5, 6);
                     this._sprite.lineTo(5, 12);
                     this._sprite.lineTo(-15, 0);
                     break;
                     
                 case 'Right':
                 default:
                     this._sprite.moveTo(15, 0);
                     this._sprite.lineTo(-5, -12);
                     this._sprite.lineTo(-5, -6);
                     this._sprite.lineTo(-15, -6);
                     this._sprite.lineTo(-15, 6);
                     this._sprite.lineTo(-5, 6);
                     this._sprite.lineTo(-5, 12);
                     this._sprite.lineTo(15, 0);
                     break;
             }
             
             this._sprite.endFill();
         }

         setButtons(buttons) {
             this._buttons = buttons;
             this._currentButtonIndex = 0;
             this.updatePosition();
             // Don't trigger hover effect on initial button to avoid conflicts
             // The hover effect will be triggered by mouse or keyboard navigation
         }

         updatePosition() {
             if (this._buttons.length === 0 || this._currentButtonIndex >= this._buttons.length) {
                 this.visible = false;
                 return;
             }

             const button = this._buttons[this._currentButtonIndex];
             if (button) {
                 this.x = button.x + SELECTION_ARROW_OFFSET_X;
                 this.y = button.y + (button.height / 2) + SELECTION_ARROW_OFFSET_Y;
                 this.visible = true;
             }
         }

         nextButton() {
             if (this._buttons.length === 0) return;
             this._currentButtonIndex = (this._currentButtonIndex + 1) % this._buttons.length;
             this.updatePosition();
             this.triggerHoverEffect();
         }

         previousButton() {
             if (this._buttons.length === 0) return;
             this._currentButtonIndex = this._currentButtonIndex === 0 ? 
                 this._buttons.length - 1 : this._currentButtonIndex - 1;
             this.updatePosition();
             this.triggerHoverEffect();
         }

         triggerHoverEffect() {
             // The button's update method will handle the hover state based on keyboard selection
             // We just need to ensure the hover effects are applied immediately
             this._buttons.forEach((btn, index) => {
                 if (index === this._currentButtonIndex) {
                     // Force immediate hover effect update for selected button
                     btn.updateHoverEffects();
                 }
             });
         }

         getCurrentButton() {
             return this._buttons[this._currentButtonIndex] || null;
         }

         update() {
             // Update arrow position if buttons have moved
             this.updatePosition();
         }
     }

    const _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.call(this);
        this.createCustomMenuButtons();
        // Reset hover effects after buttons are created
        this.resetAllButtonHoverEffects();
        // Ensure clean state when returning from submenus
        this.ensureCleanState();
    };

    const _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        // Ensure clean state when scene starts (returning from submenus)
        if (this._customMenuButtons) {
            this.ensureCleanState();
        }
    };

    Scene_Title.prototype.resetAllButtonHoverEffects = function() {
        if (this._customMenuButtons) {
            this._customMenuButtons.forEach((btn, index) => {
                if (btn && btn.resetHoverEffects) {
                    btn.resetHoverEffects();
                }
            });
        }
        
        // Also reset selection arrow if it exists
        if (this._selectionArrow) {
            this._selectionArrow._currentButtonIndex = 0;
            this._selectionArrow.updatePosition();
            // Force the selection arrow to be visible and properly positioned
            this._selectionArrow.visible = true;
        }
    };

    Scene_Title.prototype.ensureCleanState = function() {
        if (this._customMenuButtons) {
            this._customMenuButtons.forEach((btn, index) => {
                if (btn) {
                    btn._isHovered = false;
                    btn._isPressed = false;
                    btn._isDragging = false;
                    btn._hoverProgress = 0;
                    btn._isAnimating = false;
                    
                    btn.x = btn._baseX;
                    btn.y = btn._baseY;
                    btn.scale.x = btn._baseScale.x;
                    btn.scale.y = btn._baseScale.y;
                    btn.alpha = btn._baseAlpha;
                    btn.tint = 0xffffff;
                    
                    btn.refresh();
                }
            });
        }
        
        if (this._selectionArrow && this._customMenuButtons && this._customMenuButtons.length > 0) {
            this._selectionArrow._currentButtonIndex = 0;
            this._selectionArrow.updatePosition();
            this._selectionArrow.visible = true;
        }
        
        this._needsFinalCleanup = true;
        this._cleanupFrameCount = 0;
    };

    Scene_Title.prototype.finalCleanup = function() {
        if (this._customMenuButtons) {
            this._customMenuButtons.forEach((btn, index) => {
                if (btn) {
                    if (btn._isHovered || btn._hoverProgress > 0) {
                        btn._isHovered = false;
                        btn._hoverProgress = 0;
                        btn._isAnimating = false;
                        btn.x = btn._baseX;
                        btn.y = btn._baseY;
                        btn.scale.x = btn._baseScale.x;
                        btn.scale.y = btn._baseScale.y;
                        btn.alpha = btn._baseAlpha;
                        btn.tint = 0xffffff;
                        btn.refresh();
                    }
                }
            });
        }
        
        if (this._selectionArrow && this._customMenuButtons && this._customMenuButtons.length > 0) {
            if (this._selectionArrow._currentButtonIndex !== 0) {
                this._selectionArrow._currentButtonIndex = 0;
                this._selectionArrow.updatePosition();
                this._selectionArrow.visible = true;
            }
        }
    };

    Scene_Title.prototype.createCustomMenuButtons = function() {
        this._customMenuButtons = [];
        this._draggedButton = null;
        this._dragOffset = { x: 0, y: 0 };
        this._isSetupPhase = true; // Flag to prevent hover effects during setup
        this._lastHoveredButton = null; // Track last hovered button for sound effects



        // Create grid visualization if enabled
        if (SHOW_GRID && ENABLE_ALIGNMENT) {
            this.createGridVisualization();
        }

        // Create logo if enabled
        if (LOGO_ENABLED) {
            this.createLogo();
        }

        // Create selection arrow if keyboard navigation is enabled
        if (ENABLE_KEYBOARD_NAVIGATION && SHOW_SELECTION_ARROW) {
            this.createSelectionArrow();
        }

        const saved = this.loadButtonPositions();
        const configs = CUSTOM_BUTTONS;

        configs.forEach((cfg, i) => {
            const pos = saved[cfg.name];
            const btn = new CustomMenuButton(cfg);
            const finalX = pos && pos.x !== undefined ? pos.x : cfg.x;
            const finalY = pos && pos.y !== undefined ? pos.y : cfg.y;
            btn.setBasePosition(finalX, finalY);
            // Reset hover effects immediately after setting position
            btn.resetHoverEffects();
            // Add to the window layer for proper interaction
            this._windowLayer.addChild(btn);
            this._customMenuButtons.push(btn);
        });

        // Create social media buttons
        const socialConfigs = SOCIAL_MEDIA_BUTTONS;
        socialConfigs.forEach((cfg, i) => {
            const pos = saved[cfg.name];
            const btn = new SocialMediaButton(cfg);
            const finalX = pos && pos.x !== undefined ? pos.x : cfg.x;
            const finalY = pos && pos.y !== undefined ? pos.y : cfg.y;
            btn.setBasePosition(finalX, finalY);
            // Reset hover effects immediately after setting position
            btn.resetHoverEffects();
            // Add to the window layer for proper interaction
            this._windowLayer.addChild(btn);
            this._customMenuButtons.push(btn);
        });

        if (this._commandWindow) this._commandWindow.visible = false;
        
        this._setupFrameCount = 0;
    };

    Scene_Title.prototype.createGridVisualization = function() {
        this._gridGraphics = new PIXI.Graphics();
        this._gridGraphics.alpha = 0.3;
        this._gridGraphics.lineStyle(1, 0x00ff00);
        
        // Draw vertical lines
        for (let x = 0; x <= Graphics.width; x += GRID_SIZE) {
            this._gridGraphics.moveTo(x, 0);
            this._gridGraphics.lineTo(x, Graphics.height);
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= Graphics.height; y += GRID_SIZE) {
            this._gridGraphics.moveTo(0, y);
            this._gridGraphics.lineTo(Graphics.width, y);
        }
        
        this._windowLayer.addChild(this._gridGraphics);
    };

    Scene_Title.prototype.createLogo = function() {
        const logoConfig = {
            enabled: LOGO_ENABLED,
            imageName: LOGO_IMAGE_NAME,
            x: LOGO_X,
            y: LOGO_Y,
            width: LOGO_WIDTH,
            height: LOGO_HEIGHT,
            draggable: LOGO_DRAGGABLE,
            savePosition: LOGO_SAVE_POSITION,
            enableHoverEffects: LOGO_ENABLE_HOVER_EFFECTS
        };

        this._logo = new Logo(logoConfig);
        const savedPosition = this._logo.loadPosition();
        this._logo.setBasePosition(savedPosition.x, savedPosition.y);
        this._windowLayer.addChild(this._logo);
    };

    Scene_Title.prototype.createSelectionArrow = function() {
        this._selectionArrow = new SelectionArrow();
        this._windowLayer.addChild(this._selectionArrow);
    };

    Scene_Title.prototype.handleKeyboardNavigation = function() {
        if (!ENABLE_KEYBOARD_NAVIGATION || !this._selectionArrow) return;

        // Set buttons for the selection arrow (only regular buttons, not social media)
        if (this._selectionArrow._buttons.length === 0) {
            const regularButtons = this._customMenuButtons.filter(btn => !btn._config.url);
            this._selectionArrow.setButtons(regularButtons);
        }

        // Handle keyboard input
        if (Input.isTriggered('up') || Input.isTriggered('w')) {
            this._selectionArrow.previousButton();
            playHoverSE(); // Play hover sound when arrow moves
        } else if (Input.isTriggered('down') || Input.isTriggered('s')) {
            this._selectionArrow.nextButton();
            playHoverSE(); // Play hover sound when arrow moves
        } else if (Input.isTriggered('left') || Input.isTriggered('a')) {
            this._selectionArrow.previousButton();
            playHoverSE(); // Play hover sound when arrow moves
        } else if (Input.isTriggered('right') || Input.isTriggered('d')) {
            this._selectionArrow.nextButton();
            playHoverSE(); // Play hover sound when arrow moves
        } else if (Input.isTriggered('ok') || Input.isTriggered('space')) {
            // Execute the currently selected button
            const currentButton = this._selectionArrow.getCurrentButton();
            if (currentButton) {
                playSelectionSE(); // Play selection sound when executing command
                currentButton.executeCommand();
            }
        }

        // Update selection arrow
        this._selectionArrow.update();
    };

    Scene_Title.prototype.checkHoverSound = function() {
        // Find which button is currently being hovered over
        let currentlyHoveredButton = null;
        const mouseX = TouchInput.x;
        const mouseY = TouchInput.y;
        
        for (let btn of this._customMenuButtons) {
            if (btn.containsPoint && btn.containsPoint(mouseX, mouseY)) {
                currentlyHoveredButton = btn;
                break;
            }
        }
        
        // If hovered button changed, play hover sound
        if (currentlyHoveredButton !== this._lastHoveredButton) {
            if (currentlyHoveredButton) {
                playHoverSE(); // Play when entering any button (from no button or different button)
            }
            this._lastHoveredButton = currentlyHoveredButton;
        }
    };
 
     Scene_Title.prototype.loadButtonPositions = function() {
         if (!SAVE_POSITIONS) return {};
         try {
             let positions = null;
             
             positions = loadPositionsFromFile();
             
             if (!positions) {
                 const saved = localStorage.getItem(STORAGE_KEY);
                 positions = saved ? JSON.parse(saved) : {};
             }
             
             if (typeof positions !== 'object' || positions === null) {
                 return {};
             }
             
             for (const key in positions) {
                 if (positions.hasOwnProperty(key)) {
                     const pos = positions[key];
                     if (typeof pos.x === 'number' && typeof pos.y === 'number') {
                         pos.x = Math.max(0, Math.min(Graphics.width - 50, pos.x));
                         pos.y = Math.max(0, Math.min(Graphics.height - 50, pos.y));
                     } else {
                         delete positions[key];
                     }
                 }
             }
             
             return positions;
         } catch (e) {
             console.error('loadButtonPositions error:', e);
             return {};
         }
     };
 
     Scene_Title.prototype.saveButtonPositions = function() {
         if (!SAVE_POSITIONS) return;
         
         const now = Date.now();
         if (this._lastSaveTime && now - this._lastSaveTime < 100) {
             this._pendingSave = true;
             return;
         }
         
         try {
             const positions = {};
             if (this._customMenuButtons) {
                 this._customMenuButtons.forEach(btn => {
                     if (btn && btn._config && btn._config.name) {
                         const x = typeof btn._baseX === 'number' ? btn._baseX : 0;
                         const y = typeof btn._baseY === 'number' ? btn._baseY : 0;
                         positions[btn._config.name] = { x: x, y: y };
                     }
                 });
             }
             
             localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
             
             if (ENABLE_DRAG_AND_DROP) {
                 savePositionsToFile(positions);
             }
             
             this._lastSaveTime = now;
             this._pendingSave = false;
         } catch (e) {
             console.error('saveButtonPositions error:', e);
             if (e.name === 'QuotaExceededError') {
                 console.warn('localStorage quota exceeded. Button positions not saved.');
             }
         }
     };

    const _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.call(this);
        
        if (this._setupFrameCount !== undefined && this._setupFrameCount < 30) {
            this._setupFrameCount++;
            if (this._setupFrameCount >= 30) {
                this._isSetupPhase = false;
            }
        }
        
        if (this._needsFinalCleanup) {
            this._cleanupFrameCount = this._cleanupFrameCount || 0;
            this._cleanupFrameCount++;
            if (this._cleanupFrameCount >= 6) {
                this.finalCleanup();
                this._needsFinalCleanup = false;
            }
        }
        
        if (this._pendingSave && this._lastSaveTime) {
            const now = Date.now();
            if (now - this._lastSaveTime >= 100) {
                this.saveButtonPositions();
            }
        }
        
        if (this._customMenuButtons) {
            this._customMenuButtons.forEach(btn => btn.update());
        }
        if (this._logo) {
            this._logo.update();
        }
        if (ENABLE_KEYBOARD_NAVIGATION) {
            this.handleKeyboardNavigation();
        }
        this.checkHoverSound();
    };

     class SocialMediaButton extends PIXI.Container {
         constructor(config) {
             super();
             this._config = config;

             // Make this container interactive!
             this.interactive = true;
             this.buttonMode = true;



             // state flags
             this._isHovered = false;
             this._isPressed = false;
             this._isDragging = false;
             this._dragOffset = { x: 0, y: 0 };

             // Hover effect properties
             this._baseX = 0;
             this._baseY = 0;
             this._baseScale = { x: 1, y: 1 };
             this._baseAlpha = 1;
             this._baseTone = [0, 0, 0, 0];
             this._hoverProgress = 0;
             this._isAnimating = false;

             // background (only used if no image)
             this._bg = new PIXI.Graphics();
             this.addChild(this._bg);

             // text label
             if (config.text && config.text.trim() !== '') {
                 this._label = new PIXI.Text(config.text, {
                     fontFamily: 'GameFont',
                     fontSize: 18,
                     fill: 0xffffff
                 });
                 this._label.anchor.set(0.5);
                 this.addChild(this._label);
             }

             // load your images the same way you already do,
             // calling this.refresh() after they arrive...
             this.createImageSprites();

             // initial draw
             this.refresh();
             

         }

         refresh() {
             // image vs hover-image
             if (this._imageSprite)      this._imageSprite.visible      = !this._isHovered;
             if (this._hoverImageSprite) this._hoverImageSprite.visible =  this._isHovered;

             // only draw a BG if you have *no* image set
             const usingImages = !!this._imageSprite || !!this._hoverImageSprite;
             this._bg.clear();
             if (!usingImages) {
                 const fill   = this._isPressed ? 0x666666 : (this._isHovered ? 0x4a90e2 : 0x333333);
                 const border = this._isPressed ? 0x444444 : (this._isHovered ? 0x357abd : 0x666666);
                 this._bg.beginFill(fill);
                 this._bg.lineStyle(2, border);
                 this._bg.drawRoundedRect(0, 0, this.width, this.height, 6);
                 this._bg.endFill();
             }

             // position text in center
             if (this._label) {
                 this._label.x = this.width / 2;
                 this._label.y = this.height / 2;
             }
         }

         update() {
             if (SceneManager._scene && SceneManager._scene._isSetupPhase) {
                 return;
             }
             
             const mouseX = TouchInput.x;
             const mouseY = TouchInput.y;
             const isOverButton = this.containsPoint(mouseX, mouseY);
             
             if (isOverButton && !this._isHovered) {
                 this._isHovered = true;
                 this.refresh();
             } else if (!isOverButton && this._isHovered) {
                 this._isHovered = false;
                 this._isPressed = false;
                 this.refresh();
             }

             if (isOverButton && TouchInput.isPressed() && !this._isPressed) {
                 this._isPressed = true;
                 if (ENABLE_DRAG_AND_DROP) {
                     this._dragOffset.x = mouseX - this.x;
                     this._dragOffset.y = mouseY - this.y;
                 }
                 this.refresh();
             } else if (this._isPressed && TouchInput.isPressed() && ENABLE_DRAG_AND_DROP) {
                 const dragDistance = Math.sqrt(
                     Math.pow(mouseX - (this.x + this._dragOffset.x), 2) + 
                     Math.pow(mouseY - (this.y + this._dragOffset.y), 2)
                 );
                 
                 if (dragDistance > 5) {
                     this._isDragging = true;
                     let newX = Math.max(0, Math.min(Graphics.width - this.width, mouseX - this._dragOffset.x));
                     let newY = Math.max(0, Math.min(Graphics.height - this.height, mouseY - this._dragOffset.y));
                     
                     if (ENABLE_ALIGNMENT) {
                         newX = snapToGrid(newX, GRID_SIZE);
                         newY = snapToGrid(newY, GRID_SIZE);
                         
                         if (SceneManager._scene && SceneManager._scene._customMenuButtons) {
                             const aligned = alignToOtherButtons(newX, newY, this, SceneManager._scene._customMenuButtons);
                             newX = aligned.x;
                             newY = aligned.y;
                         }
                     }
                     
                     this.setBasePosition(newX, newY);
                 }
             } else if (this._isPressed && TouchInput.isReleased()) {
                 if (this._isDragging && ENABLE_DRAG_AND_DROP) {
                     if (SceneManager._scene && SceneManager._scene.saveButtonPositions) {
                         SceneManager._scene.saveButtonPositions();
                     }
                 } else if (this._isPressed) {
                     this.openURL();
                 }
                 
                 this._isPressed = false;
                 this._isDragging = false;
                 this.refresh();
             }

             this.updateHoverEffects();
         }

         containsPoint(x, y) {
             return x >= this.x && x <= this.x + this.width &&
                    y >= this.y && y <= this.y + this.height;
         }

         updateHoverEffects() {
             const targetProgress = this._isHovered ? 1 : 0;
             
             if (this._hoverProgress !== targetProgress) {
                 this._isAnimating = true;
                 
                 if (targetProgress > this._hoverProgress) {
                     this._hoverProgress = Math.min(1, this._hoverProgress + SOCIAL_MEDIA_HOVER_ANIMATION_SPEED);
                 } else {
                     this._hoverProgress = Math.max(0, this._hoverProgress - SOCIAL_MEDIA_HOVER_ANIMATION_SPEED);
                 }
                 
                 if (this._hoverProgress === targetProgress) {
                     this._isAnimating = false;
                 }
             }

             this.applyHoverEffects();
         }

         applyHoverEffects() {
             // Slide effect - use offset instead of directly modifying position
             if (SOCIAL_MEDIA_HOVER_SLIDE_ENABLED) {
                 const slideX = SOCIAL_MEDIA_HOVER_SLIDE_X * this._hoverProgress;
                 const slideY = SOCIAL_MEDIA_HOVER_SLIDE_Y * this._hoverProgress;
                 this.x = this._baseX + slideX;
                 this.y = this._baseY + slideY;
             } else {
                 // Reset to base position when slide is disabled
                 this.x = this._baseX;
                 this.y = this._baseY;
             }

             // Pop-out effect
             if (SOCIAL_MEDIA_HOVER_POPOUT_ENABLED) {
                 const scale = 1 + ((SOCIAL_MEDIA_HOVER_POPOUT_SCALE - 1) * this._hoverProgress);
                 this.scale.x = this._baseScale.x * scale;
                 this.scale.y = this._baseScale.y * scale;
             } else {
                 // Reset to base scale when pop-out is disabled
                 this.scale.x = this._baseScale.x;
                 this.scale.y = this._baseScale.y;
             }

             // Opacity effect
             if (SOCIAL_MEDIA_HOVER_OPACITY_ENABLED) {
                 this.alpha = this._baseAlpha - ((this._baseAlpha - SOCIAL_MEDIA_HOVER_OPACITY_VALUE) * this._hoverProgress);
             } else {
                 // Reset to base alpha when opacity effect is disabled
                 this.alpha = this._baseAlpha;
             }

             // Tone effect
             if (SOCIAL_MEDIA_HOVER_TONE_ENABLED) {
                 const tone = [
                     SOCIAL_MEDIA_HOVER_TONE_RED * this._hoverProgress,
                     SOCIAL_MEDIA_HOVER_TONE_GREEN * this._hoverProgress,
                     SOCIAL_MEDIA_HOVER_TONE_BLUE * this._hoverProgress,
                     SOCIAL_MEDIA_HOVER_TONE_GRAY * this._hoverProgress
                 ];
                 this.tint = this.rgbToHex(tone);
             } else {
                 // Reset to white when tone effect is disabled
                 this.tint = 0xffffff;
             }
         }

         rgbToHex(tone) {
             const r = Math.max(0, Math.min(255, 255 + tone[0]));
             const g = Math.max(0, Math.min(255, 255 + tone[1]));
             const b = Math.max(0, Math.min(255, 255 + tone[2]));
             return (r << 16) | (g << 8) | b;
         }

         setBasePosition(x, y) {
             this._baseX = x;
             this._baseY = y;
             this.x = x;
             this.y = y;
         }

         resetHoverEffects() {
             this._isHovered = false;
             this._hoverProgress = 0;
             this._isAnimating = false;
             this.applyHoverEffects();
             this.refresh();
         }

         openURL() {
             if (this._config.url && this._config.url.trim() !== '') {
                 playSelectionSE();
                 try {
                     if (Utils.isNwjs()) {
                         const gui = require('nw.gui');
                         if (gui && gui.Shell) {
                             gui.Shell.openExternal(this._config.url);
                         }
                     } else {
                         window.open(this._config.url, '_blank', 'noopener,noreferrer');
                     }
                 } catch (e) {
                     console.error('Failed to open URL:', this._config.url, e);
                 }
             }
         }

         get width() { return this._config.width; }
         get height() { return this._config.height; }

         createImageSprites() {
             if (this._config.imageName && this._config.imageName.trim() !== '') {
                 const bitmap = ImageManager.loadPicture(this._config.imageName);
                 bitmap.addLoadListener(() => {
                     if (this._imageSprite) return;
                     try {
                         this._imageSprite = new PIXI.Sprite(PIXI.Texture.from(bitmap.canvas));
                         this._imageSprite.width = this.width;
                         this._imageSprite.height = this.height;
                         this._imageSprite.x = 0;
                         this._imageSprite.y = 0;
                         this.addChild(this._imageSprite);
                         this.setChildIndex(this._imageSprite, 1);
                         this.refresh();
                     } catch (e) {
                         console.error('Failed to load social media button image:', this._config.imageName, e);
                     }
                 });
             }

             if (this._config.hoverImageName && this._config.hoverImageName.trim() !== '') {
                 const bitmap = ImageManager.loadPicture(this._config.hoverImageName);
                 bitmap.addLoadListener(() => {
                     if (this._hoverImageSprite) return;
                     try {
                         this._hoverImageSprite = new PIXI.Sprite(PIXI.Texture.from(bitmap.canvas));
                         this._hoverImageSprite.width = this.width;
                         this._hoverImageSprite.height = this.height;
                         this._hoverImageSprite.x = 0;
                         this._hoverImageSprite.y = 0;
                         this.addChild(this._hoverImageSprite);
                         this.setChildIndex(this._hoverImageSprite, 2);
                         this.refresh();
                     } catch (e) {
                         console.error('Failed to load social media button hover image:', this._config.hoverImageName, e);
                     }
                 });
             }
         }
     }

     class CustomMenuButton extends PIXI.Container {
         constructor(config) {
             super();
             this._config = config;

             // — Make this container interactive!
             this.interactive = true;
             this.buttonMode = true;



             // state flags
             this._isHovered = false;
             this._isPressed = false;
             this._isDragging = false;
             this._dragOffset = { x: 0, y: 0 };

             // Hover effect properties
             this._baseX = 0;
             this._baseY = 0;
             this._baseScale = { x: 1, y: 1 };
             this._baseAlpha = 1;
             this._baseTone = [0, 0, 0, 0];
             this._hoverProgress = 0;
             this._isAnimating = false;

             // background (only used if no image)
             this._bg = new PIXI.Graphics();
             this.addChild(this._bg);

             // text label
             if (config.text && config.text.trim() !== '') {
                 this._label = new PIXI.Text(config.text, {
                     fontFamily: 'GameFont',
                     fontSize: 18,
                     fill: 0xffffff
                 });
                 this._label.anchor.set(0.5);
                 this.addChild(this._label);
             }

             // load your images the same way you already do,
             // calling this.refresh() after they arrive...
             this.createImageSprites();

             // initial draw
             this.refresh();
             

         }

         refresh() {
             // image vs hover-image
             if (this._imageSprite)      this._imageSprite.visible      = !this._isHovered;
             if (this._hoverImageSprite) this._hoverImageSprite.visible =  this._isHovered;

             // only draw a BG if you have *no* image set
             const usingImages = !!this._imageSprite || !!this._hoverImageSprite;
             this._bg.clear();
             if (!usingImages) {
                 const fill   = this._isPressed ? 0x666666 : (this._isHovered ? 0x4a90e2 : 0x333333);
                 const border = this._isPressed ? 0x444444 : (this._isHovered ? 0x357abd : 0x666666);
                 this._bg.beginFill(fill);
                 this._bg.lineStyle(2, border);
                 this._bg.drawRoundedRect(0, 0, this.width, this.height, 6);
                 this._bg.endFill();
             }

             // text
             if (this._label) {
                 this._label.x = this.width  / 2;
                 this._label.y = this.height / 2;
                 this._label.style.fill = this._isHovered ? 0xffffff : 0xcccccc;
             }

             // Ensure proper hit area and interaction
             this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
             this.interactive = true;
             this.buttonMode = true;
         }

         update() {
             if (SceneManager._scene && SceneManager._scene._isSetupPhase) {
                 return;
             }
             
             const mouseX = TouchInput.x;
             const mouseY = TouchInput.y;
             const isOverButton = this.containsPoint(mouseX, mouseY);
             
             const isKeyboardSelected = ENABLE_KEYBOARD_NAVIGATION && 
                 SceneManager._scene && SceneManager._scene._selectionArrow && 
                 SceneManager._scene._selectionArrow.getCurrentButton() === this;
             
             if ((isOverButton || isKeyboardSelected) && !this._isHovered) {
                 this._isHovered = true;
                 this.refresh();
                 
                 if (isOverButton && ENABLE_KEYBOARD_NAVIGATION && ARROW_FOLLOWS_MOUSE && 
                     SceneManager._scene && SceneManager._scene._selectionArrow && 
                     !SceneManager._scene._isSetupPhase) {
                     const buttonIndex = SceneManager._scene._selectionArrow._buttons.indexOf(this);
                     if (buttonIndex !== -1 && buttonIndex !== SceneManager._scene._selectionArrow._currentButtonIndex) {
                         SceneManager._scene._selectionArrow._currentButtonIndex = buttonIndex;
                         SceneManager._scene._selectionArrow.updatePosition();
                         SceneManager._scene._selectionArrow.triggerHoverEffect();
                     }
                 }
             } else if (!isOverButton && !isKeyboardSelected && this._isHovered) {
                 this._isHovered = false;
                 this._isPressed = false;
                 this.refresh();
             }
             
             if (isOverButton && TouchInput.isPressed() && !this._isPressed) {
                 this._isPressed = true;
                 if (ENABLE_DRAG_AND_DROP) {
                     this._dragOffset.x = mouseX - this.x;
                     this._dragOffset.y = mouseY - this.y;
                 }
                 this.refresh();
             } else if (this._isPressed && TouchInput.isPressed() && ENABLE_DRAG_AND_DROP) {
                 const dragDistance = Math.sqrt(
                     Math.pow(mouseX - (this.x + this._dragOffset.x), 2) + 
                     Math.pow(mouseY - (this.y + this._dragOffset.y), 2)
                 );
                 
                 if (dragDistance > 5) {
                     this._isDragging = true;
                     let newX = Math.max(0, Math.min(Graphics.width - this.width, mouseX - this._dragOffset.x));
                     let newY = Math.max(0, Math.min(Graphics.height - this.height, mouseY - this._dragOffset.y));
                     
                     if (ENABLE_ALIGNMENT) {
                         newX = snapToGrid(newX, GRID_SIZE);
                         newY = snapToGrid(newY, GRID_SIZE);
                         
                         if (SceneManager._scene && SceneManager._scene._customMenuButtons) {
                             const aligned = alignToOtherButtons(newX, newY, this, SceneManager._scene._customMenuButtons);
                             newX = aligned.x;
                             newY = aligned.y;
                         }
                     }
                     
                     this.setBasePosition(newX, newY);
                 }
             } else if (this._isPressed && TouchInput.isReleased()) {
                 if (this._isDragging && ENABLE_DRAG_AND_DROP) {
                     if (SceneManager._scene && SceneManager._scene.saveButtonPositions) {
                         SceneManager._scene.saveButtonPositions();
                     }
                 } else if (this._isPressed) {
                     this.executeCommand();
                 }
                 
                 this._isPressed = false;
                 this._isDragging = false;
                 this.refresh();
             }

             this.updateHoverEffects();
         }

         containsPoint(x, y) {
             return x >= this.x && x <= this.x + this.width &&
                    y >= this.y && y <= this.y + this.height;
         }

         updateHoverEffects() {
             const targetProgress = this._isHovered ? 1 : 0;
             
             if (this._hoverProgress !== targetProgress) {
                 this._isAnimating = true;
                 
                 if (targetProgress > this._hoverProgress) {
                     this._hoverProgress = Math.min(1, this._hoverProgress + HOVER_ANIMATION_SPEED);
                 } else {
                     this._hoverProgress = Math.max(0, this._hoverProgress - HOVER_ANIMATION_SPEED);
                 }
                 
                 if (this._hoverProgress === targetProgress) {
                     this._isAnimating = false;
                 }
             }

             this.applyHoverEffects();
         }

         applyHoverEffects() {
             // Slide effect - use offset instead of directly modifying position
             if (HOVER_SLIDE_ENABLED) {
                 const slideX = HOVER_SLIDE_X * this._hoverProgress;
                 const slideY = HOVER_SLIDE_Y * this._hoverProgress;
                 this.x = this._baseX + slideX;
                 this.y = this._baseY + slideY;
             } else {
                 // Reset to base position when slide is disabled
                 this.x = this._baseX;
                 this.y = this._baseY;
             }

             // Pop-out effect
             if (HOVER_POPOUT_ENABLED) {
                 const scale = 1 + ((HOVER_POPOUT_SCALE - 1) * this._hoverProgress);
                 this.scale.x = this._baseScale.x * scale;
                 this.scale.y = this._baseScale.y * scale;
             } else {
                 // Reset scale when pop-out is disabled
                 this.scale.x = this._baseScale.x;
                 this.scale.y = this._baseScale.y;
             }

             // Opacity effect
             if (HOVER_OPACITY_ENABLED) {
                 const alpha = this._baseAlpha + ((HOVER_OPACITY_VALUE - this._baseAlpha) * this._hoverProgress);
                 this.alpha = alpha;
             } else {
                 // Reset alpha when opacity effect is disabled
                 this.alpha = this._baseAlpha;
             }

             // Tone effect
             if (HOVER_TONE_ENABLED) {
                 const tone = [
                     this._baseTone[0] + (HOVER_TONE_RED * this._hoverProgress),
                     this._baseTone[1] + (HOVER_TONE_GREEN * this._hoverProgress),
                     this._baseTone[2] + (HOVER_TONE_BLUE * this._hoverProgress),
                     this._baseTone[3] + (HOVER_TONE_GRAY * this._hoverProgress)
                 ];
                 this.tint = this.rgbToHex(tone);
             } else {
                 // Reset tint when tone effect is disabled
                 this.tint = 0xffffff;
             }
         }

         rgbToHex(tone) {
             const r = Math.max(0, Math.min(255, 255 + tone[0]));
             const g = Math.max(0, Math.min(255, 255 + tone[1]));
             const b = Math.max(0, Math.min(255, 255 + tone[2]));
             return (r << 16) | (g << 8) | b;
         }

         setBasePosition(x, y) {
             this._baseX = x;
             this._baseY = y;
             this.x = x;
             this.y = y;
         }

         resetHoverEffects() {
             this._isHovered = false;
             this._hoverProgress = 0;
             this._isAnimating = false;
             this.applyHoverEffects();
             this.refresh();
         }

         executeCommand() {
             playSelectionSE(); // Play selection sound when button is executed
             switch (this._config.command) {
                 case 'newGame':
                     // Stop BGM when starting new game
                     AudioManager.stopBgm();
                     DataManager.setupNewGame();
                     SceneManager.goto(Scene_Map);
                     break;
                 case 'loadGame':
                     // Stop BGM when loading game
                     AudioManager.stopBgm();
                     SceneManager.push(Scene_Load);
                     break;
                 case 'options':
                     SceneManager.push(Scene_Options);
                     break;
                                   case 'commonEvent':
                      const id = Number(this._config.commonEventId);
                      if (id > 0) {
                          // Check if this is the credits common event and call credits directly
                          if (window.showCredits && typeof window.showCredits === 'function') {
                              console.log("Calling credits directly from menu button");
                              window.showCredits();
                          } else {
                              // Fallback to reserving common event
                              $gameTemp.reserveCommonEvent(id);
                          }
                      }
                      break;
                  case 'credits':
                      if (window.showCredits && typeof window.showCredits === 'function') {
                          console.log("Calling credits from menu button");
                          window.showCredits();
                      }
                      break;
             }
         }

         get width() { return this._config.width; }
         get height() { return this._config.height; }

         createImageSprites() {
             if (this._config.imageName && this._config.imageName.trim() !== '') {
                 const bitmap = ImageManager.loadPicture(this._config.imageName);
                 bitmap.addLoadListener(() => {
                     if (this._imageSprite) return;
                     try {
                         const texture = PIXI.Texture.from(bitmap.canvas);
                         this._imageSprite = new PIXI.Sprite(texture);
                         this._imageSprite.width = this.width;
                         this._imageSprite.height = this.height;
                         this._imageSprite.visible = true;
                         this._imageSprite.x = 0;
                         this._imageSprite.y = 0;
                         this.addChild(this._imageSprite);
                         this.setChildIndex(this._imageSprite, 1);
                         this.refresh();
                     } catch (e) {
                         console.error('Failed to load button image:', this._config.imageName, e);
                     }
                 });
             }

             if (this._config.hoverImageName && this._config.hoverImageName.trim() !== '') {
                 const bitmap = ImageManager.loadPicture(this._config.hoverImageName);
                 bitmap.addLoadListener(() => {
                     if (this._hoverImageSprite) return;
                     try {
                         const texture = PIXI.Texture.from(bitmap.canvas);
                         this._hoverImageSprite = new PIXI.Sprite(texture);
                         this._hoverImageSprite.width = this.width;
                         this._hoverImageSprite.height = this.height;
                         this._hoverImageSprite.visible = false;
                         this._hoverImageSprite.x = 0;
                         this._hoverImageSprite.y = 0;
                         this.addChild(this._hoverImageSprite);
                         this.setChildIndex(this._hoverImageSprite, 2);
                         this.refresh();
                     } catch (e) {
                         console.error('Failed to load button hover image:', this._config.hoverImageName, e);
                     }
                 });
             }
         }
     }
 
     const _Scene_Title_terminate = Scene_Title.prototype.terminate;
     Scene_Title.prototype.terminate = function() {
         if (SAVE_POSITIONS && this._customMenuButtons && (this._pendingSave || !this._lastSaveTime)) {
             try {
                 const positions = {};
                 this._customMenuButtons.forEach(btn => {
                     if (btn && btn._config && btn._config.name) {
                         const x = typeof btn._baseX === 'number' ? btn._baseX : 0;
                         const y = typeof btn._baseY === 'number' ? btn._baseY : 0;
                         positions[btn._config.name] = { x: x, y: y };
                     }
                 });
                 localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
                 
                 if (ENABLE_DRAG_AND_DROP) {
                     savePositionsToFile(positions);
                 }
             } catch (e) {
                 console.error('saveButtonPositions on terminate error:', e);
             }
         }
         _Scene_Title_terminate.call(this);
     };
 

    })();
    