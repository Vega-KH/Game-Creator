function EditorWindow(a, b) {
    this._loaded = !1,
    this.name = a,
    this.closeWhenBlur = b["close-when-blur"] || !1,
    this.nativeWin = new BrowserWindow(b),
    this.closeWhenBlur && this
        .nativeWin
        .setAlwaysOnTop(!0),
    this.handleEvents(),
    EditorWindow.addWindow(this)
}
var EventEmitter = require("events"),
    BrowserWindow = require("browser-window"),
    Screen = require("screen"),
    Url = require("fire-url"),
    Ipc = require("ipc"),
    Util = require("util");
Util.inherits(EditorWindow, EventEmitter),
Object.defineProperty(EditorWindow.prototype, "isMainWindow", {
    get: function () {
        return Editor.mainWindow === this
    }
}),
Object.defineProperty(EditorWindow.prototype, "isFocused", {
    get: function () {
        return this
            .nativeWin
            .isFocused()
    }
}),
Object.defineProperty(EditorWindow.prototype, "isMinimized", {
    get: function () {
        return this
            .nativeWin
            .isMinimized()
    }
}),
Object.defineProperty(EditorWindow.prototype, "isLoaded", {
    get: function () {
        return this._loaded
    }
}),
EditorWindow.prototype.handleEvents = function () {
    this
        .nativeWin
        .on("blur", function () {
            Editor.AssetDB && Editor.AssetDB.ready && setImmediate(function () {
                BrowserWindow.getFocusedWindow() || Editor
                    .AssetDB
                    .watchON()
            }.bind(this)),
            this.closeWhenBlur && this
                .nativeWin
                .close()
        }.bind(this)),
    this
        .nativeWin
        .on("focus", function (a) {
            Editor.AssetDB && Editor.AssetDB.ready && Editor
                .AssetDB
                .watchOFF()
        }.bind(this)),
    this
        .nativeWin
        .on("closed", function () {
            Editor
                .Panel
                ._onWindowClosed(this),
            this.isMainWindow
                ? (EditorWindow.saveLayout(), EditorWindow.removeWindow(this), Editor.mainWindow = null, Editor.quit())
                : EditorWindow.removeWindow(this)
        }.bind(this)),
    this
        .nativeWin
        .webContents
        .on("did-finish-load", function () {
            this._loaded = !0,
            this
                .nativeWin
                .isFocused() && Editor.AssetDB && Editor.AssetDB.ready && Editor
                .AssetDB
                .watchOFF(),
            Editor.sendToCore("window:reloaded", this)
        }.bind(this))
},
EditorWindow.prototype.sendToPage = function () {
    var a = this.nativeWin.webContents;
    return a
        ? void a
            .send
            .apply(a, arguments)
        : void console.error('Failed to send "%s" to %s because web contents not yet loaded', arguments[0], this.name)
},
EditorWindow.prototype.load = function (a, b) {
    this._loaded = !1;
    var c = Url.format({
        protocol: "file",
        pathname: Editor.url(a),
        slashes: !0,
        query: b
    });
    this
        .nativeWin
        .loadUrl(c)
},
EditorWindow.prototype.show = function () {
    this
        .nativeWin
        .show()
},
EditorWindow.prototype.close = function () {
    this._loaded = !1,
    this
        .nativeWin
        .close()
},
EditorWindow.prototype.focus = function () {
    this
        .nativeWin
        .focus()
},
EditorWindow.prototype.minimize = function () {
    this
        .nativeWin
        .minimize()
},
EditorWindow.prototype.restore = function () {
    this
        .nativeWin
        .restore()
},
EditorWindow.prototype.openDevTools = function () {
    this
        .nativeWin
        .openDevTools()
},
EditorWindow.prototype.adjust = function (a, b, c, d) {
    var e = !1;
    "number" != typeof a && (e = !0, a = 0),
    "number" != typeof b && (e = !0, b = 0),
    "number" != typeof c && (e = !0, c = 800),
    "number" != typeof d && (e = !0, d = 600);
    var f = Screen.getDisplayMatching({x: a, y: b, width: c, height: d});
    this
        .nativeWin
        .setSize(c, d),
    this
        .nativeWin
        .setPosition(f.workArea.x, f.workArea.y),
    e
        ? this
            .nativeWin
            .center()
        : this
            .nativeWin
            .setPosition(a, b)
},
EditorWindow.prototype.restorePositionAndSize = function () {
    var a = this
            .nativeWin
            .getSize(),
        b,
        c,
        d = a[0],
        e = a[1],
        f = Editor.loadProfile("layout", "local");
    if (f.windows && f.windows[this.name]) {
        var g = f.windows[this.name];
        b = g.x,
        c = g.y,
        d = g.width,
        e = g.height
    }
    this.adjust(b, c, d, e)
};
var _windows = [],
    _windowLayouts = {};
Object.defineProperty(EditorWindow, "windows", {
    get: function () {
        return _windows.slice()
    }
}),
EditorWindow.find = function (a) {
    var b,
        c;
    if ("string" == typeof a) {
        for (b = 0; b < _windows.length; ++b) 
            if (c = _windows[b], c.name === a) 
                return c;
    return null
    }
    if (a instanceof BrowserWindow) {
        for (b = 0; b < _windows.length; ++b) 
            if (c = _windows[b], c.nativeWin === a) 
                return c;
    return null
    }
    return null
},
EditorWindow.addWindow = function (a) {
    _windows.push(a)
},
EditorWindow.removeWindow = function (a) {
    var b = _windows.indexOf(a);
    return -1 === b
        ? void Fire.warn("Can not find window " + a.name)
        : void _windows.splice(b, 1)
},
EditorWindow.saveLayout = function () {
    if (Editor.mainWindow) {
        var a = Editor.loadProfile("layout", "local");
        a.windows = {};
        for (var b = 0; b < _windows.length; ++b) {
            var c = _windows[b];
            a.windows[c.name] = _windowLayouts[c.name]
        }
        a.save()
    }
},
Ipc.on("window:open", function (a, b, c) {
    var d = new Editor.Window(a, c);
    d
        .nativeWin
        .setMenuBarVisibility(!1),
    d.load(b, c.argv),
    d.show()
}),
Ipc.on("window:save-layout", function (a, b) {
    var c = BrowserWindow.fromWebContents(a.sender),
        d = Editor
            .Window
            .find(c);
    if (!d) 
        return void Fire.warn("Failed to save layout, can not find the window.");
    var e = c.getSize(),
        f = c.getPosition(),
        g = {
            x: f[0],
            y: f[1],
            width: e[0],
            height: e[1],
            layout: b
        },
        h = Editor.loadProfile("layout", "local");
    h.panels = h.panels || {};
    var i = [];
    b && ("standalone" === b.type
        ? i.push({name: b.panel, width: b.width, height: b.height})
        : _getPanels(b.docks, i));
    for (var j = 0; j < i.length; ++j) {
        var k = i[j];
        h.panels[k.name] = {
            window: d.name,
            x: f[0],
            y: f[1],
            width: k.width,
            height: k.height
        }
    }
    h.save(),
    _windowLayouts[d.name] = g,
    EditorWindow.saveLayout()
});
var _getPanels = function (a, b) {
    for (var c = 0; c < a.length; ++c) {
        var d = a[c];
        if ("dock" === d.type) 
            _getPanels(d.docks, b);
        else if ("panel" === d.type) 
            for (var e = 0; e < d.panels.length; ++e) {
                var f = d.panels[e];
                b.push({name: f, width: d.width, height: d.height})
            }
        }
};
module.exports = EditorWindow;