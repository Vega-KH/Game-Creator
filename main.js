function _parseArgv(e) {
    Nomnom
        .script("fire")
        .option("project", {
            position: 0,
            help: "The fireball project file."
        })
        .option("version", {
            abbr: "v",
            flag: !0,
            help: "Print the version.",
            callback: function () {
                return App.getVersion()
            }
        })
        .option("help", {
            abbr: "h",
            flag: !0,
            help: "Print this usage message."
        })
        .option("dev", {
            abbr: "d",
            flag: !0,
            help: "Run in development mode."
        })
        .option("showDevtools", {
            abbr: "D",
            full: "show-devtools",
            flag: !0,
            help: "Open devtools automatically when main window loaded."
        })
        .option("debug", {
            full: "debug",
            flag: !0,
            help: "Open in browser context debug mode."
        })
        .option("debugBreak", {
            full: "debug-brk",
            flag: !0,
            help: "Open in browser context debug mode, and break at first."
        })
        .option("disableDirectWrite", {
            full: "disable-direct-write",
            flag: !0,
            help: "Disables the DirectWrite font rendering system on windows."
        });
    var r = Nomnom.parse(e);
    return r.dev && (r.project = r._.length < 2
        ? null
        : r._[r._.length - 1]),
    r
}
function _initFire() {
    Fire = require("./src/core/core"),
    Fire
        .JS
        .mixin(Fire, require("./src/editor-share/editor-share")),
    Fire
        .JS
        .mixin(Fire, {
            log: Editor.log,
            success: Editor.success,
            failed: Editor.failed,
            info: Editor.info,
            warn: Editor.warn,
            error: Editor.error,
            fatal: Editor.fatal
        }),
    Fire
        .JS
        .mixin(Editor, Fire.Editor)
}
var App = require("app"),
    Path = require("fire-path"),
    Fs = require("fire-fs"),
    Url = require("fire-url"),
    Nomnom = require("nomnom"),
    Chalk = require("chalk"),
    Winston = require("winston");
process.removeAllListeners("uncaughtException"),
process.on("uncaughtException", function (e) {
    Editor && Editor.sendToWindows && Editor.sendToWindows("console:error", {
        message: e.stack || e
    }),
    Winston.uncaught(e.stack || e)
}),
global.Editor = {},
global.Fire = {},
Editor.name = App.getName(),
Editor.cwd = __dirname,
Editor.dataPath = Path.join(App.getPath("home"), "." + Editor.name),
Editor.projectPath = "",
Fs.existsSync(Editor.dataPath) || Fs.makeTreeSync(Editor.dataPath);
var settingsPath = Path.join(Editor.dataPath, "settings");
Fs.existsSync(settingsPath) || Fs.mkdirSync(settingsPath);
var _logpath = "";
_logpath = "darwin" === process.platform
    ? Path.join(App.getPath("home"), "Library/Logs/" + Editor.name)
    : App.getPath("appData"),
Fs.existsSync(_logpath) || Fs.makeTreeSync(_logpath);
var _logfile = Path.join(_logpath, Editor.name + ".log");
Fs.existsSync(_logfile) && Fs.unlinkSync(_logfile);
var winstonLevels = {
    normal: 0,
    success: 1,
    failed: 2,
    info: 3,
    warn: 4,
    error: 5,
    fatal: 6,
    uncaught: 7
};
Winston.setLevels(winstonLevels),
Winston.remove(Winston.transports.Console),
Winston.add(Winston.transports.File, {
    level: "normal",
    filename: _logfile,
    json: !1
});
var chalk_id = Chalk.bgBlue,
    chalk_success = Chalk.green,
    chalk_warn = Chalk.yellow,
    chalk_error = Chalk.red,
    chalk_info = Chalk.cyan,
    levelToFormat = {
        normal: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + e
        },
        success: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + chalk_success(e)
        },
        failed: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + chalk_error(e)
        },
        info: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + chalk_info(e)
        },
        warn: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + chalk_warn
                .inverse
                .bold("Warning:") + " " + chalk_warn(e)
        },
        error: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + chalk_error
                .inverse
                .bold("Error:") + " " + chalk_error(e)
        },
        fatal: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + chalk_error
                .inverse
                .bold("Fatal Error:") + " " + chalk_error(e)
        },
        uncaught: function (e) {
            var r = chalk_id("[" + process.pid + "]") + " ";
            return r + chalk_error
                .inverse
                .bold("Uncaught Exception:") + " " + chalk_error(e)
        }
    };
Winston.add(Winston.transports.Console, {
    level: "normal",
    formatter: function (e) {
        var r = (chalk_id("[" + process.pid + "]") + " ", "");
        void 0 !== e.message && (r += e.message),
        e.meta && Object
            .keys(e.meta)
            .length && (r += " " + JSON.stringify(e.meta));
        var i = levelToFormat[e.level];
        return i
            ? i(r)
            : r
    }
});
var options = _parseArgv(process.argv.slice(1));
Editor.isDev = options.dev,
options.disableDirectWrite && App
    .commandLine
    .appendSwitch("disable-direct-write"),
App.on("window-all-closed", function () {
    App.quit()
}),
App.on("open-file", function () {}),
App.on("open-url", function () {}),
App.on("will-finish-launching", function () {
    if (!Editor.isDev) {
        var e = require("crash-reporter");
        e.start({
            productName: "Fireball",
            companyName: "FireBox",
            submitUrl: "https://fireball-x.com/crash-report",
            autoSubmit: !1
        })
    }
}),
App.on("ready", function () {
    Winston.normal("Initializing protocol"),
    require("./src/editor-core/protocol-init"),
    Winston.normal("Initializing editor"),
    require("./src/editor-core/editor-init"),
    require("./src/editor-core/ipc-init"),
    Winston.normal("Initializing fire"),
    _initFire(),
    Editor.registerProfilePath("global", Path.join(Editor.dataPath, "settings")),
    Editor.registerProfilePath("local", Path.join(Editor.dataPath, "settings")),
    Winston.success("Initial success!");
    try {
        if (Fire.info("Welcome to Fireball! The next-gen html5 game engine."), Editor.loadProfile("fireball", "global", {recentlyOpened: []}), options.project) {
            var e = require(Editor.url("editor-core://fireball"));
            e.open(options)
        } else {
            var r = require(Editor.url("editor-core://dashboard"));
            r.open()
        }
    } catch (i) {
        Winston.error(i.stack || i),
        App.terminate()
    }
});