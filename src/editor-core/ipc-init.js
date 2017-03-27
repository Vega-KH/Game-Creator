function getOptions(a) {
    var b = a[a.length - 1];
    return b && "object" == typeof b && b.__is_ipc_option__ && b
}
function _sendToCore(a, b) {
    "use strict";
    if (arguments.length > 2) {
        var c,
            d = getOptions(arguments);
        return d
            ? d["require-ipc-event"]
                ? (c = [].slice.call(arguments, 0, -1), c[0] = b, c[1] = a)
                : c = []
                    .slice
                    .call(arguments, 1, -1)
            : c = []
                .slice
                .call(arguments, 1),
        Ipc
            .emit
            .apply(Ipc, c)
    }
    return Ipc.emit(b)
}
function _sendToWindows(a, b) {
    "use strict";
    if (arguments.length > 2) {
        var c,
            d = getOptions(arguments);
        if (d) {
            if (c = [].slice.call(arguments, 1, -1), d["self-excluded"]) 
                return void Editor.sendToWindowsExclude(c, a.sender)
        } else 
            c = []
                .slice
                .call(arguments, 1);
        Editor
            .sendToWindows
            .apply(Editor, c)
    } else 
        Editor.sendToWindows(b)
}
var Ipc = require("ipc");
Ipc.on("editor:send2core", function (a, b) {
    "use strict";
    _sendToCore.apply(Ipc, arguments) || Editor.failed("editor:send2core@" + b + " failed.")
}),
Ipc.on("editor:send2wins", _sendToWindows),
Ipc.on("editor:send2mainwin", function (a, b) {
    "use strict";
    var c = Editor.mainWindow;
    if (c) 
        if (arguments.length > 2) {
            var d = []
                .slice
                .call(arguments, 1);
            c
                .sendToPage
                .apply(c, d)
        } else 
            c.sendToPage(b);
else 
        console.error('Failed to send "%s" because main page not initialized.', b)
}),
Ipc.on("editor:send2all", function () {
    _sendToCore.apply(Ipc, arguments),
    _sendToWindows.apply(Ipc, arguments)
}),
Ipc.on("editor:send2panel", function (a) {
    var b = []
        .slice
        .call(arguments, 1);
    Editor
        .sendToPanel
        .apply(Editor, b)
}),
Ipc.on("editor:sendreq2core", function (a, b, c, d) {
    function e() {
        f
            ? Editor.error('The callback which reply to "%s" can only be called once!', b)
            : (f = !0, a.sender.send("editor:sendreq2core:reply", [].slice.call(arguments), d))
    }
    var f = !1;
    c.unshift(b, e),
    Ipc
        .emit
        .apply(Ipc, c) || Editor.error('The listener of request "%s" is not yet registered!', b)
}),
Editor.sendToWindowsExclude = function (a, b) {
    for (var c = Editor.Window.windows.slice(), d = 0; d < c.length; ++d) {
        var e = c[d];
        e.nativeWin.webContents !== b && e
            .sendToPage
            .apply(e, a)
    }
},
Editor.sendToWindows = function () {
    for (var a = Editor.Window.windows.slice(), b = 0; b < a.length; ++b) {
        var c = a[b];
        c
            .sendToPage
            .apply(c, arguments)
    }
},
Editor.sendToCore = function () {
    Ipc
        .emit
        .apply(Ipc, arguments) === !1 && Editor.failed("sendToCore " + arguments[0] + " failed.")
},
Editor.sendToAll = function () {
    if (arguments.length > 1) {
        var a = !0,
            b = arguments,
            c = getOptions(arguments);
        c && (b = [].slice.call(arguments, 0, -1), c["self-excluded"] && (a = !1)),
        a && Ipc
            .emit
            .apply(Ipc, b),
        Editor
            .sendToWindows
            .apply(Editor, b)
    } else 
        Ipc.emit(arguments[0]),
        Editor.sendToWindows(arguments[0])
},
Editor.sendToPlugin = function (a, b) {
    for (var c = Editor.Panel.findPanels(a), d = [].slice.call(arguments, 1), e = 0; e < c.length; ++e) {
        var f = c[e] + "@" + a;
        Editor
            .sendToPanel
            .apply(Editor, [f].concat(d))
    }
},
Editor.sendToPanel = function (a, b) {
    var c = Editor
        .Panel
        .findWindow(a);
    if (!c) 
        return void Editor.warn("Failed to send %s to panel %s, can not find it.", b, a);
    var d = []
        .slice
        .call(arguments, 0);
    d.unshift("editor:send2panel"),
    c
        .sendToPage
        .apply(c, d)
},
Editor.sendToMainWindow = function () {
    var a = Editor.mainWindow;
    a
        ? a
            .sendToPage
            .apply(a, arguments)
        : console.error('Failed to send "%s" because main page not initialized.', arguments[0])
};