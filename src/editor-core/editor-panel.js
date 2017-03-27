var Ipc = require("ipc"),
    BrowserWindow = require("browser-window"),
    Panel = {},
    _panelIDToWindows = {},
    _panelIDToArgv = {};
Ipc.on("panel:page-ready", function (a, b) {
    var c = b.split("@");
    if (2 !== c.length) 
        return Fire.error("Invalid panelID " + b),
        void a({});
    var d = c[0],
        e = c[1],
        f = Editor
            .PackageManager
            .getPackageInfo(e);
    if (!f) 
        return Fire.error("Invalid package info " + e),
        void a({});
    if (!f.fireball) 
        return Fire.error("Invalid package info %s, can not find fireball property", e),
        void a({});
    if (!f.fireball.panels) 
        return Fire.error("Invalid package info %s, can not find panels property", e),
        void a({});
    if (!f.fireball.panels[d]) 
        return Fire.error("Invalid package info %s, can not find %s property", e, d),
        void a({});
    var g = f.fireball.panels[d],
        h = Editor
            .PackageManager
            .getPackagePath(e);
    for (var i in g.profiles) {
        var j = g.profiles[i];
        j = Editor.loadProfile(b, i, j),
        g.profiles[i] = j
    }
    a({"panel-info": g, "package-path": h})
}),
Ipc.on("panel:ready", function (a) {
    var b = _panelIDToArgv[a];
    Editor.sendToPanel(a, "panel:open", b)
}),
Ipc.on("panel:dock", function (a, b) {
    var c = BrowserWindow.fromWebContents(a.sender),
        d = Editor
            .Window
            .find(c);
    Panel.dock(b, d)
}),
Ipc.on("panel:undock", function (a, b) {
    var c = BrowserWindow.fromWebContents(a.sender),
        d = Editor
            .Window
            .find(c);
    Panel.undock(b, d)
}),
Ipc.on("panel:save-profile", function (a) {
    var b = a.id,
        c = a.type,
        d = a.profile,
        e = Editor.loadProfile(b, c);
    e && (e.clear(), Fire.JS.mixin(e, d), e.save())
}),
Panel.templateUrl = "editor://static/window.html",
Panel.open = function (a, b, c) {
    _panelIDToArgv[a] = c;
    var d = Panel.findWindow(a);
    if (d) 
        return Editor.sendToPanel(a, "panel:open", c),
        d.show(),
        void d.focus();
    var e = "editor-window-" + (new Date).getTime(),
        f = {
            "use-content-size": !0,
            width: parseInt(b.width),
            height: parseInt(b.height),
            "min-width": parseInt(b["min-width"]),
            "min-height": parseInt(b["min-height"]),
            "max-width": parseInt(b["max-width"]),
            "max-height": parseInt(b["max-height"])
        },
        g = Editor.loadProfile("layout", "local"),
        h = g.panels;
    if (g.panels && g.panels[a]) {
        var i = g.panels[a];
        if (e = i.window, d = Editor.Window.find(e)) 
            return;
        f.x = parseInt(i.x),
        f.y = parseInt(i.y),
        f.width = parseInt(i.width),
        f.height = parseInt(i.height)
    }
    var j = b.type || "dockable";
    switch (b.type) {
        case "dockable":
            f.resizable = !0,
            f["always-on-top"] = !1;
            break;
        case "float":
            f.resizable = !0,
            f["always-on-top"] = !0;
            break;
        case "fixed-size":
            f.resizable = !1,
            f["always-on-top"] = !0,
            f.width = parseInt(b.width),
            f.height = parseInt(b.height);
            break;
        case "quick":
            f.resizable = !0,
            f["always-on-top"] = !0,
            f["close-when-blur"] = !0
    }
    d = new Editor.Window(e, f),
    d
        .nativeWin
        .setContentSize(f.width, f.height),
    d
        .nativeWin
        .setMenuBarVisibility(!1),
    d.load(Panel.templateUrl, {panelID: a}),
    d.focus()
},
Panel.findWindow = function (a) {
    return _panelIDToWindows[a]
},
Panel.findWindows = function (a) {
    var b = [];
    for (var c in _panelIDToWindows) {
        var d = c.split("@");
        if (2 === d.length) {
            var e = d[1];
            if (e === a) {
                var f = _panelIDToWindows[c];
                -1 === b.indexOf(f) && b.push(f)
            }
        }
    }
    return b
},
Panel.findPanels = function (a) {
    var b = [];
    for (var c in _panelIDToWindows) {
        var d = c.split("@");
        if (2 === d.length) {
            var e = d[1];
            e === a && b.push(d[0])
        }
    }
    return b
},
Panel.dock = function (a, b) {
    _panelIDToWindows[a] = b
},
Panel.undock = function (a, b) {
    var c = _panelIDToWindows[a];
    return c === b
        ? delete _panelIDToWindows[a]
        : !1
},
Panel.closeAll = function (a) {
    Fire.warn("TODO: @Johnny please implement Panel.closeAll")
},
Panel._onWindowClosed = function (a) {
    for (var b in _panelIDToWindows) {
        var c = _panelIDToWindows[b];
        c === a && delete _panelIDToWindows[b]
    }
},
module.exports = Panel;