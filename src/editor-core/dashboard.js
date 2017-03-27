var BrowserWindow = require("browser-window"),
    Ipc = require("ipc"),
    Url = require("fire-url"),
    Path = require("fire-path"),
    Fs = require("fire-fs"),
    Menu = require("menu"),
    isValidProject = function (a) {
        if (!Fs.existsSync(a) || !Fs.statSync(a).isDirectory()) 
            return console.log("project dir not eixsts"),
            !1;
        var b = Path.join(a, "assets");
        return Fs.existsSync(b) && Fs
            .statSync(b)
            .isDirectory()
            ? !0
            : (console.log("assets dir not eixsts"), !1)
    },
    registerBuiltinMessages = function () {
        var a = Editor.loadProfile("fireball", "global");
        Ipc.on("dashboard:request-recent-projects", function () {
            Editor.sendToWindows("dashboard:recent-projects", a.recentlyOpened)
        }),
        Ipc.on("dashboard:remove-project", function (b) {
            var c = a
                .recentlyOpened
                .indexOf(b);
            -1 !== c && (a.recentlyOpened.splice(c, 1), a.save(), Editor.sendToWindows("dashboard:project-removed", b))
        }),
        Ipc.on("dashboard:add-project", function (b, c) {
            if (isValidProject(b)) {
                var d = a
                    .recentlyOpened
                    .indexOf(b);
                -1 === d && (a.recentlyOpened.push(b), a.save(), Editor.sendToWindows("dashboard:project-added", b, c))
            }
        }),
        Ipc.on("dashboard:create-project", function (b) {
            var c = b.path,
                d = b.type;
            a
                .recentlyOpened
                .push(c),
            a.save(),
            Dashboard.close();
            var e = require("./fireball");
            e.open({
                showDevtools: !1,
                project: c,
                projectType: d
            })
        }),
        Ipc.on("dashboard:open-project", function (a) {
            if (isValidProject(a)) {
                Dashboard.close();
                var b = require("./fireball");
                b.open({
                    showDevtools: !1,
                    project: a
                })
            }
        })
    },
    _dashboardWin = null,
    Dashboard = {
        open: function () {
            registerBuiltinMessages(),
            _dashboardWin = new Editor.Window("dashboard", {
                title: "Fireball Dashboard",
                width: 1024,
                height: 576,
                show: !0,
                resizable: !1,
                frame: !0
            }),
            Editor.mainWindow = _dashboardWin,
            _dashboardWin.restorePositionAndSize(),
            _dashboardWin.load("fire://static/dashboard.html");
            var a = Menu.buildFromTemplate([
                {
                    label: "Developer",
                    submenu: [
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
                            label: "Reload",
                            accelerator: "CmdOrCtrl+R",
                            click: function () {
                                BrowserWindow
                                    .getFocusedWindow()
                                    .reloadIgnoringCache()
                            }
                        }, {
                            type: "separator"
                        }, {
                            label: "Developer Tools",
                            accelerator: "CmdOrCtrl+Shift+I",
                            click: function () {
                                BrowserWindow
                                    .getFocusedWindow()
                                    .openDevTools()
                            }
                        }
                    ]
                }
            ]);
            Menu.setApplicationMenu(a)
        },
        close: function () {
            _dashboardWin.close(),
            _dashboardWin = null
        }
    };
module.exports = Dashboard;