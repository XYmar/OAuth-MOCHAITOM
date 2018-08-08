/*eslint-disable*/
import * as Log from '@/novnc/core/util/logging.js';
import _, { l10n } from '@/novnc/app/localization.js';
import { isTouchDevice } from '@/novnc/core/util/browsers.js';
import { setCapture, getPointerEvent } from '@/novnc/core/util/events.js';
import KeyTable from "@/novnc/core/input/keysym.js";
import keysyms from "@/novnc/core/input/keysymdef.js";
import Keyboard from "@/novnc/core/input/keyboard.js";
import RFB from "@/novnc/core/rfb.js";
// import Display from "/novnc/core/display.js";
import * as WebUtil from "@/novnc/app/webutil.js";

var UI = {
    connected: false,
    desktopName: "",

    resizeTimeout: null,
    statusTimeout: null,
    hideKeyboardTimeout: null,
    idleControlbarTimeout: null,
    closeControlbarTimeout: null,

    controlbarGrabbed: false,
    controlbarDrag: false,
    controlbarMouseDownClientY: 0,
    controlbarMouseDownOffsetY: 0,

    isSafari: false,
    lastKeyboardinput: null,
    defaultKeyboardinputLen: 100,

    inhibit_reconnect: true,
    reconnect_callback: null,
    reconnect_password: null,
    prime: function(callback) {
        if (document.readyState === "interactive" || document.readyState === "complete") {
            UI.load(callback);
        } else {
            document.addEventListener('DOMContentLoaded', UI.load.bind(UI, callback));
        }
    },

    // Setup rfb object, load settings from browser storage, then call
    // UI.init to setup the UI/menus
    load: function(callback) {
        WebUtil.initSettings(UI.start, callback);
    },

    // Render default UI and initialize settings menu
    start: function(callback) {

        // Setup global variables first
        UI.isSafari = (navigator.userAgent.indexOf('Safari') !== -1 &&
        navigator.userAgent.indexOf('Chrome') === -1);

        // UI.initSettings();
        // UI.initSetting('resize', 'scale');
        // Translate the DOM
        l10n.translateDOM();

        // Adapt the interface for touch screen devices
        if (isTouchDevice) {
            document.documentElement.classList.add("noVNC_touch");
            // Remove the address bar
            setTimeout(function() { window.scrollTo(0, 1); }, 100);
        }

        // Restore control bar position
        if (WebUtil.readSetting('controlbar_pos') === 'right') {
            UI.toggleControlbarSide();
        }

        // UI.initFullscreen();

        // Setup event handlers
        // UI.addResizeHandlers();
        // UI.addControlbarHandlers();
        // UI.addTouchSpecificHandlers();
        // UI.addExtraKeysHandlers();
        // UI.addMachineHandlers();
        // UI.addConnectionControlHandlers();
        // UI.addClipboardHandlers();
        // UI.addSettingsHandlers();
        // document.getElementById("noVNC_status")
        //     .addEventListener('click', UI.hideStatus);

        // Bootstrap fallback input handler
        // UI.keyboardinputReset();

        // UI.openControlbar();

        // UI.updateViewClip();

        // UI.updateVisualState('init');

        // document.documentElement.classList.remove("noVNC_loading");

        var autoconnect = WebUtil.getConfigVar('autoconnect', false);
        if (autoconnect === 'true' || autoconnect == '1') {
            autoconnect = true;
            UI.connect();
            UI.setPassword();
        } else {
            autoconnect = false;
            // Show the connect panel on first load unless autoconnecting
            UI.openConnectPanel();
        }

        if (typeof callback === "function") {
            callback(UI.rfb);
        }
    },
    connect: function (current_guac) {
//      console.log(current_guac)
        var host = current_guac.broker_host;
        var port = current_guac.broker_port;
        var password = 'undefined';
        if (typeof password === 'undefined') {
            password = WebUtil.getConfigVar('password');
            UI.reconnect_password = password;
        }

        if (password === null) {
            password = undefined;
        }
        password = current_guac.graphics_passwd;
        if (!host) {
            // Log.Error("Can't connect when host is: " + host);
            // UI.showStatus(_("Must set host"), 'error');
            return;
        }

        var url;

        url = UI.getSetting('encrypt') ? 'wss' : 'ws';

        url += '://' + host;
        if (port) {
            url += ':' + port;
        }
        url += '/' + 'websockify';

        UI.rfb = new RFB(document.getElementById('noVNC_canvas'), url,
            {
                shared: 0,
                repeaterID: UI.getSetting('repeaterID'),
                credentials: { password: password }
            });
        // UI.rfb.disconnect();
        //UI.rfb.sendCredentials({ password: password });
        UI.rfb.addEventListener("connect", UI.connectFinished);
        UI.rfb.addEventListener("disconnect", UI.disconnectFinished);
        // UI.rfb.addEventListener("credentialsrequired", UI.credentials);
        // UI.rfb.addEventListener("securityfailure", UI.securityFailed);
        // UI.rfb.addEventListener("capabilities", function () { UI.updatePowerButton(); UI.initialResize(); });
        // UI.rfb.addEventListener("clipboard", UI.clipboardReceive);
        // UI.rfb.addEventListener("bell", UI.bell);
        // UI.rfb.addEventListener("fbresize", UI.updateSessionSize);
        // UI.rfb.addEventListener("desktopname", UI.updateDesktopName);
    },
    disconnect: function () {
        console.log('disconnect')
        UI.rfb.disconnect();

        // UI.connected = false;
        //
        // // Disable automatic reconnecting
        // UI.inhibit_reconnect = true;

        // UI.updateVisualState('disconnecting');

        // Don't display the connection settings until we're actually disconnected
    },
    setPassword: function(current_guac) {
        var password = current_guac.graphics_passwd;
        // console.log(password);
        // Clear the input after reading the password
        UI.rfb.sendCredentials({ password: password });
        UI.reconnect_password = password;
    },
    // 设置
    getSetting: function(name) {
        var ctrl = document.getElementById('noVNC_setting_' + name);
        var val = WebUtil.readSetting(name);
        if (typeof val !== 'undefined' && val !== null && ctrl.type === 'checkbox') {
            if (val.toString().toLowerCase() in {'0':1, 'no':1, 'false':1}) {
                val = false;
            } else {
                val = true;
            }
        }
        return val;
    },
    // Initial page load read/initialization of settings

    // Re-calculate local scaling
    updateScaling: function() {
        if (!UI.rfb) return;
        var screen = UI.screenSize();
        // console.log(screen)
        UI.rfb.autoscale(screen.w, screen.h);
        UI.fixScrollbars();
    },

    // Gets the the size of the available viewport in the browser window
    screenSize: function() {
        var screen = document.getElementById('noVNC_screen');
        return {w: screen.offsetWidth, h: screen.offsetHeight};
    },
    fixScrollbars: function() {
        // This is a hack because Chrome screws up the calculation
        // for when scrollbars are needed. So to fix it we temporarily
        // toggle them off and on.
        var screen = document.getElementById('noVNC_screen');
        screen.style.overflow = 'hidden';
        // Force Chrome to recalculate the layout by asking for
        // an element's dimensions
        screen.getBoundingClientRect();
        screen.style.overflow = "";
    },
    cancelReconnect: function() {
        if (UI.reconnect_callback !== null) {
            clearTimeout(UI.reconnect_callback);
            UI.reconnect_callback = null;
        }
    },
    toggleFullscreen: function() {
        if (document.fullscreenElement || // alternative standard method
            document.mozFullScreenElement || // currently working methods
            document.webkitFullscreenElement ||
            document.msFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (document.body.msRequestFullscreen) {
                document.body.msRequestFullscreen();
            }
        }
        // UI.enableDisableViewClip();
        // UI.updateFullscreenButton();
    },
    connectFinished: function (e) {
        UI.connected = true;
        UI.inhibit_reconnect = false;
        UI.doneInitialResize = false;

        // 虚拟机界面缩放
        UI.updateScaling();
        window.addEventListener("resize", UI.updateScaling);
        // Do this last because it can only be used on rendered elements
        document.getElementById('noVNC_canvas').focus();
    },
    disconnectFinished: function (e) {
        UI.connected = false;

        if (!e.detail.clean) {
        } else if (UI.getSetting('reconnect', false) === true && !UI.inhibit_reconnect) {
            var delay = parseInt(UI.getSetting('reconnect_delay'));
            UI.reconnect_callback = setTimeout(UI.reconnect, delay);
            return;
        } else {
            // UI.updateVisualState('disconnected');
            // UI.showStatus(_("Disconnected"), 'normal');
        }

        // UI.openControlbar();
        UI.openConnectPanel();
    },
    sendCtrlAltDel: function() {
        // console.log('sendCtrlAltDel')
        UI.rfb.sendCtrlAltDel();
    },
    openConnectPanel: function () {
      // document.getElementById('noVNC_control_bar').classList.add("noVNC_open");
    },
};
// Set up translations
var LINGUAS = ["de", "el", "nl", "pl", "sv"];
l10n.setup(LINGUAS);
if (l10n.language !== "en" && l10n.dictionary === undefined) {
    WebUtil.fetchJSON('app/locale/' + l10n.language + '.json', function (translations) {
        l10n.dictionary = translations;

        // wait for translations to load before loading the UI
        UI.prime();
    }, function (err) {
        throw err;
    });
} else {
    UI.prime();
}
//console.log(UI)
export default UI;
