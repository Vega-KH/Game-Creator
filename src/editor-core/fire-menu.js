function parseTemplate(a, b) {
    for (var c = a.length - 1; c >= 0; c--) {
        var d = a[c];
        if (d.visible !== !1) 
            if (d.message) {
                if (d.click) {
                    Fire.error("Not support to use click and message at the same time: " + d.label);
                    continue
                }
                var e = [d.message];
                if (d.params) {
                    if (!Array.isArray(d.params)) 
                        return void Fire.error("message parameters must be an array");
                    e = e.concat(d.params),
                    delete d.params
                }
                d.click = function (a) {
                    return b
                        ? function () {
                            b
                                .send
                                .apply(b, a)
                        }
                        : function () {
                            Editor
                                .sendToWindows
                                .apply(Editor, a),
                            setImmediate(function () {
                                Editor
                                    .sendToCore
                                    .apply(Editor, a)
                            })
                        }
                }(e),
                delete d.message
            } else 
                d.submenu && parseTemplate(d.submenu, b);
    else 
            a.splice(c, 1)
    }
}
var Ipc = require("ipc"),
    Menu = require("menu"),
    MenuItem = require("menu-item"),
    BrowserWindow = require("browser-window"),
    FireMenu = {};
FireMenu.buildFromTemplate = function (a, b) {
    return parseTemplate(a, b),
    Menu.buildFromTemplate(a)
},
FireMenu.setApplicationMenu = function (a) {
    Menu.setApplicationMenu(a)
},
FireMenu.reset = function () {},
FireMenu.find = function (a, b, c, d) {
    function e(a, b) {
        for (var c = 0; c < a.items.length; c++) {
            var d = a.items[c];
            if (d.label === b) 
                return d
        }
        return null
    }
    a = a.submenu || a,
    c = "undefined" != typeof c
        ? c
        : !1;
    for (var f = b.split("/"), g = null, h = 0; h < f.length; h++) {
        var i = h === f.length - 1,
            j = f[h];
        if (g = e(a, j)) {
            if (i) 
                return g;
            if (!g.submenu || "submenu" !== g.type) 
                return console.error("menu path already occupied: %s", b),
                null
        } else {
            if (!c) 
                return Fire.error("Can not find menu item by: " + b),
                null;
            if (g = new MenuItem({label: j, submenu: new Menu, type: "submenu"}), void 0 !== d
                ? a.insert(d, g)
                : a.append(g), i) 
                return g
        }
        a = g.submenu
    }
    return g
},
require("./fire-menu-ipc"),
module.exports = FireMenu;