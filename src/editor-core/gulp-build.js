var Path = require("path"),
    os = require("os"),
    fs = require("fire-fs"),
    del = require("del"),
    format = require("util").format,
    Gulp = require("gulp").Gulp,
    gutil = require("gulp-util"),
    es = require("event-stream"),
    Ipc = require("ipc"),
    compileGulp = require("./gulp-compile"),
    BUILD_ = "build-platform_";
exports.startWithArgs = function (a, b) {
    function c(a) {}
    function d(b, c) {
        return e
            .src(b)
            .pipe(es.through(function d(b) {
                if (".html" === Path.extname(b.path)) {
                    console.log("generating html from " + b.path);
                    var c = {
                        file: b,
                        project: a.projectName || Path.basename(f)
                    };
                    b.contents = new Buffer(gutil.template(b.contents, c))
                }
                this.emit("data", b)
            }))
            .pipe(e.dest(h))
            .on("end", c)
    }
    var e = new Gulp,
        f = a.project,
        g = a.platform,
        h = a.dest,
        i = a.debug;
    console.log("Building " + f),
    console.log("Destination " + h);
    var j = Path.resolve(Editor.cwd, "tools/build/platforms/"),
        k = {
            template_web_desktop: Path.join(j, i
                ? "web-desktop/template-dev/**/*"
                : "web-desktop/template/**/*"),
            template_web_mobile: Path.join(j, i
                ? "web-mobile/template-dev/**/*"
                : "web-mobile/template/**/*"),
            script: i
                ? "project.dev.js"
                : "project.js",
            deps: [Path.resolve(Editor.cwd, i
                    ? "ext/pixi/bin/pixi.dev.js"
                    : "ext/pixi/bin/pixi.js")],
            res: Path.join(h, "resource"),
            settings: Path.join(h, "settings.json")
        };
    e.task("copy-deps", function () {
        return e
            .src(k.deps)
            .pipe(e.dest(h))
    }),
    e.task("compile", function (a) {
        var b = {
            project: f,
            platform: g,
            dest: Path.join(h, k.script),
            debug: i
        };
        compileGulp.startWithArgs(b, function (b) {
            b
                ? e.isRunning
                    ? e.stop(b)
                    : Fire.error(b)
                : a()
        })
    }),
    e.task("build-resources", ["compile"], function (a) {
        Ipc
            .once("build-assets:reply", function () {
                a()
            }),
        Editor.sendToMainWindow("build-assets", f, k.res, i)
    }),
    e.task("build-settings", ["copy-deps"], function (b) {
        var d = {
                scenes: {},
                launchScene: ""
            },
            e = a.scenes;
        d.launchScene = e[0].name;
        for (var f = 0; f < e.length; f++) {
            var g = e[f];
            d.scenes[g.name] = g.uuid
        }
        c(d);
        var h = JSON.stringify(d, null, i
            ? 4
            : 0);
        fs.writeFile(k.settings, h, b)
    }),
    e.task(BUILD_ + "web-desktop", [
        "compile", "copy-deps", "build-resources", "build-settings"
    ], function (a) {
        d(k.template_web_desktop, a)
    }),
    e.task(BUILD_ + "web-mobile", [
        "compile", "copy-deps", "build-resources", "build-settings"
    ], function (a) {
        d(k.template_web_mobile, a)
    });
    var l = Path.join(os.tmpdir(), "fireball-game-builds");
    e.task("clean-built-target", function (a) {
        fs.existsSync(l)
            ? del(l + "/**/*", {
                force: !0
            }, a)
            : a()
    }),
    e.task("copy-built-target", ["clean-built-target"], function () {
        return console.log("built files copying to: " + l),
        e
            .src(h + "/**/*")
            .pipe(e.dest(l))
    });
    var m = BUILD_ + g;
    if (m in e.tasks) 
        e.start(m, function (a) {
            a
                ? b(a)
                : e.start("copy-built-target", b)
        });
    else {
        var n = [];
        for (var o in e.tasks) 
            0 === o.indexOf(BUILD_) && n.push(o.substring(BUILD_.length));
        b(format("Not support %s platform, available platform currently: %s", g, n))
    }
};