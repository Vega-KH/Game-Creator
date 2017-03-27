function startPreviewServer() {
    var a = require("../../tools/build/preview-server");
    a.start()
}
var Fs = require("fire-fs"),
    Path = require("fire-path"),
    Ipc = require("ipc"),
    FireMenu = require("./fire-menu"),
    MainMenu = require("./main-menu"),
    AssetDB = require("./asset-db"),
    PackageManager = require("./packages/package-manager"),
    PackageReloader = require("./packages/reloader"),
    Compiler = require("./compiler"),
    _projectName = "",
    _projectPath = "",
    _projectType = "",
    _projectInited = !1;
Ipc.on("assets:deleted", function (a) {
    var b = a.results,
        c = b.map(function (a) {
            return a.uuid
        });
    Editor
        .Selection
        .unselectAsset(c),
    -1 !== c.indexOf(Editor.Selection.hoveringAssetUuid) && Editor
        .Selection
        .hoverAsset("")
});
var registerGlobal = function () {
        global.ASSET_DB = AssetDB.exportToGlobal()
    },
    checkProject = function (a) {
        Fs.existsSync(a) && Fs
            .statSync(a)
            .isDirectory() || Fs.makeTreeSync(a);
        var b = Path.join(a, "assets");
        Fs.existsSync(b) && Fs
            .statSync(b)
            .isDirectory() || Fs.mkdirSync(b);
        var c = Path.join(a, "settings");
        Fs.existsSync(c) && Fs
            .statSync(c)
            .isDirectory() || Fs.mkdirSync(c);
        var d = Path.join(a, "local");
        Fs.existsSync(d) && Fs
            .statSync(d)
            .isDirectory() || Fs.mkdirSync(d);
        var e = Path.join(a, "library");
        Fs.existsSync(e) && Fs
            .statSync(e)
            .isDirectory() || Fs.mkdirSync(e)
    },
    openProject = function (a, b) {
        Editor
            .AssetDB
            .init(a),
        Editor
            .AssetDB
            .refreshAll(b),
        _projectInited = !0
    },
    loadProjectSettings = function (a) {
        var b = Editor.loadProfile("project", "project", {type: _projectType});
        -1 === ["pixi", "cocos-js"].indexOf(b.type) && (b.type = "pixi", b.save()),
        Editor.projectType = b.type;
        var c = Editor.url("fire://templates/default-layout.json"),
            d = JSON.parse(Fs.readFileSync(c));
        Editor.loadProfile("layout", "local", {
            windows: {
                main: {
                    width: 1280,
                    height: 720,
                    layout: d
                }
            },
            panels: {}
        })
    },
    Fireball = {
        open: function (a) {
            Fire.info("Launch project: " + a.project),
            registerGlobal(),
            _projectName = Path.basenameNoExt(a.project),
            _projectPath = Path.resolve(a.project),
            _projectType = a.projectType,
            Editor.AssetDB = new AssetDB,
            Editor.Menu = FireMenu,
            Editor.PackageManager = PackageManager,
            Fire.log("Opening project: " + _projectName),
            checkProject(_projectPath),
            Editor.projectPath = _projectPath,
            Editor.registerProfilePath("project", Path.join(Editor.projectPath, "settings")),
            Editor.registerProfilePath("local", Path.join(Editor.projectPath, "local")),
            MainMenu.init(),
            loadProjectSettings(_projectPath),
            Editor.Panel.templateUrl = "fire://static/" + Editor.projectType + "/window.html";
            var b = new Editor.Window("main", {
                title: "Fireball",
                "min-width": 800,
                "min-height": 600,
                width: 1280,
                height: 720,
                show: !1,
                resizable: !0
            });
            Editor.mainWindow = b,
            b.restorePositionAndSize(),
            Ipc.on("project:init", function () {
                _projectInited
                    ? Editor.sendToWindows("project:ready")
                    : PackageReloader.loadExternalPlugins(function () {
                        openProject(_projectPath, function () {
                            a.showDevtools && b.openDevTools(),
                            Editor.AssetDB.ready = !0,
                            Editor.sendToAll("project:ready"),
                            b.focus()
                        })
                    })
            }),
            b.show(),
            b.load("fire://static/" + Editor.projectType + "/fireball.html"),
            startPreviewServer()
        }
    };
module.exports = Fireball;