function getMainMenuTemplate() {
    return [
        {
            label: "Fireball",
            submenu: [
                {
                    type: "separator"
                }, {
                    label: "Hide Fireball",
                    accelerator: "Command+H",
                    selector: "hide:"
                }, {
                    label: "Hide Others",
                    accelerator: "Command+Shift+H",
                    selector: "hideOtherApplications:"
                }, {
                    label: "Show All",
                    selector: "unhideAllApplications:"
                }, {
                    type: "separator"
                }, {
                    label: "Quit",
                    accelerator: "CmdOrCtrl+Q",
                    click: function () {
                        Editor
                            .Window
                            .saveLayout(),
                        Editor.quit()
                    }
                }
            ]
        }, {
            label: "File",
            submenu: [
                {
                    label: "New Scene",
                    accelerator: "CmdOrCtrl+N",
                    click: function () {
                        Editor.sendToWindows("scene:new")
                    }
                }, {
                    label: "Save Scene",
                    accelerator: "CmdOrCtrl+S",
                    click: function () {
                        Editor.sendToWindows("scene:save")
                    }
                }, {
                    type: "separator"
                }
            ]
        }, {
            label: "Edit",
            submenu: [
                {
                    label: "Undo",
                    accelerator: "Command+Z",
                    selector: "undo:"
                }, {
                    label: "Redo",
                    accelerator: "Shift+Command+Z",
                    selector: "redo:"
                }, {
                    type: "separator"
                }, {
                    label: "Cut",
                    accelerator: "Command+X",
                    selector: "cut:"
                }, {
                    label: "Copy",
                    accelerator: "Command+C",
                    selector: "copy:"
                }, {
                    label: "Paste",
                    accelerator: "Command+V",
                    selector: "paste:"
                }, {
                    label: "Select All",
                    accelerator: "Command+A",
                    selector: "selectAll:"
                }
            ]
        }, {
            label: "View",
            submenu: []
        }, {
            label: "Window",
            submenu: Fire.isDarwin
                ? [
                    {
                        label: "Minimize",
                        accelerator: "Command+M",
                        selector: "performMiniaturize:"
                    }, {
                        label: "Close",
                        accelerator: "Command+W",
                        selector: "performClose:"
                    }, {
                        type: "separator"
                    }, {
                        label: "Bring All to Front",
                        selector: "arrangeInFront:"
                    }
                ]
                : [
                    {
                        label: "Close",
                        accelerator: "Command+W",
                        click: function () {
                            Editor
                                .Window
                                .saveLayout(),
                            Editor.quit()
                        }
                    }
                ]
        }, {
            label: "Developer",
            submenu: [
                {
                    label: "Reload",
                    accelerator: "CmdOrCtrl+R",
                    click: function () {
                        BrowserWindow
                            .getFocusedWindow()
                            .reloadIgnoringCache()
                    }
                }, {
                    label: "Recompile",
                    accelerator: "F7",
                    click: function () {
                        Compiler.compileAndReload()
                    }
                }, {
                    type: "separator"
                }, {
                    label: "Developer Tools",
                    accelerator: "CmdOrCtrl+Alt+I",
                    click: function () {
                        BrowserWindow
                            .getFocusedWindow()
                            .openDevTools()
                    }
                }, {
                    label: "Show Selected Asset in Library",
                    click: function () {
                        var a = Editor.Selection.activeAssetUuid;
                        "" !== a && Shell.showItemInFolder(Editor.AssetDB.uuidToLibraryPath(a))
                    }
                }, {
                    type: "separator"
                }, {
                    label: "Test",
                    submenu: [
                        {
                            label: "Reload Window Scripts",
                            click: function () {
                                Editor.sendToWindows("reload:window-scripts", !0)
                            }
                        }, {
                            label: "Reload Core Plugins",
                            click: function () {
                                Editor.sendToCore("reload:core-plugins")
                            }
                        }, {
                            label: "Throw an Uncaught Exception",
                            click: function () {
                                throw new Error("Fireball Unknown Error")
                            }
                        }, {
                            label: "Ipc send2panel foo:bar@foobar@fire",
                            click: function () {
                                Editor.sendToPanel("foobar@fire", "foo:bar")
                            }
                        }
                    ]
                }
            ]
        }, {
            label: "Help",
            priority: 9999,
            submenu: [
                {
                    label: "Website",
                    click: function () {
                        Shell.openExternal("http://fireball-x.com")
                    }
                }, {
                    label: "Documentation",
                    click: function () {
                        Shell.openExternal("http://docs-zh.fireball-x.com")
                    }
                }, {
                    label: "Forum",
                    click: function () {
                        Shell.openExternal("http://forum.fireball-x.com")
                    }
                }, {
                    type: "separator"
                }, {
                    label: "Submit An Issue On Github",
                    click: function () {
                        Shell.openExternal("https://github.com/fireball-x/fireball/issues")
                    }
                }, {
                    label: "Subscribe To Newsletter",
                    click: function () {
                        Shell.openExternal("http://eepurl.com/bh5w3z")
                    }
                }
            ]
        }
    ]
}
var Path = require("path"),
    BrowserWindow = require("browser-window"),
    Ipc = require("ipc"),
    Url = require("fire-url"),
    Shell = require("shell"),
    Compiler = require("./compiler"),
    Builder = require("./builder"),
    mainMenu = null,
    addonMenuItems = {},
    exportModule = {
        init: function () {
            var a = getMainMenuTemplate();
            mainMenu = Editor
                .Menu
                .buildFromTemplate(a),
            Editor
                .Menu
                .setApplicationMenu(mainMenu)
        },
        add: function (a, b, c) {
            var d = c && c.target,
                e = c && c.type;
            if (e) {
                delete c.type;
                var f = addonMenuItems[e];
                f
                    ? void 0 !== c.index
                        ? f.splice(c.index, [a, b, c])
                        : f.push([a, b, c])
                    : addonMenuItems[e] = [
                        [a, b, c]
                    ]
            }
            Array.isArray(b) || (b = [b]);
            var g = Editor
                .Menu
                .buildFromTemplate(b, d);
            if (a) {
                var h = Editor
                    .Menu
                    .find(mainMenu, a, !0, c.index);
                if (!h) 
                    return;
                if ("submenu" !== h.type) 
                    return void Fire.error("MenuItem should be submenu type: " + a);
                if (h.submenu) 
                    for (var i = 0; i < g.items.length; i++) 
                        h.submenu.append(g.items[i]);
            else 
                    h.submenu = g
            } else 
                for (var j = 0; j < g.items.length; j++) 
                    mainMenu.append(g.items[j]);
        Editor
                .Menu
                .setApplicationMenu(mainMenu)
        },
        reset: function () {
            for (var a = 0; a < arguments.length; a++) {
                var b = arguments[a];
                addonMenuItems[b] && (addonMenuItems[b].length = 0)
            }
            this.init();
            for (var c in addonMenuItems) 
                for (var d in addonMenuItems[c]) {
                    var e = addonMenuItems[c][d];
                    this
                        .add
                        .apply(this, e)
                }
            }
    };
Ipc.on("window:reloaded", function (a) {
    a.isMainWindow && exportModule.reset("window-static", "window-dynamic")
}),
Ipc.on("main-menu:add-item", function (a, b, c, d, e) {
    e = e || {},
    e.target = a && a.sender;
    var f = Path.basename(b),
        g = Url.dirname(b);
    exportModule.add(g, {
        label: f,
        message: c,
        params: d,
        priority: e && e.priority
    }, e)
}),
Ipc.on("main-menu:add-template", function (a, b, c, d) {
    d = d || {},
    d.target = a.sender,
    exportModule.add(b, c, d)
}),
Ipc.on("main-menu:reset", function () {
    exportModule
        .reset
        .apply(exportModule, arguments)
}),
module.exports = exportModule;