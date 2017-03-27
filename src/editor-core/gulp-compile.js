function getScriptGlob(a) {
    return [
        Path.join(a, "**/*.js"),
        "!" + Path.join(a, "**/{Editor,editor}/**")
    ]
}
function addMetaData() {
    var a = "\nFire._RFpop();",
        b = "\n" + a;
    return es.map(function (c, d) {
        return c.isStream()
            ? void d(new gutil.PluginError("addMetaData", "Streaming not supported"))
            : c.isNull()
                ? void d()
                : void Fs.readFile(c.path + ".meta", function (e, f) {
                    var g = "";
                    if (e) 
                        Path.contains(paths.proj, c.path) && (console.error("Failed to read meta file."), d(e));
                    else {
                        try {
                            g = JSON
                                .parse(f)
                                .uuid
                        } catch (h) {}
                        if (!g) 
                            return void d(new gutil.PluginError("addMetaData", "Failed to read uuid from meta."));
                        g = Editor.compressUuid(g)
                    }
                    var i = c
                            .contents
                            .toString(),
                        j,
                        k = Path.basename(c.path, Path.extname(c.path));
                    j = g
                        ? Format("Fire._RFpush(module, '%s', '%s');\n// %s\n\n", g, k, c.relative)
                        : Format("Fire._RFpush(module, '%s');\n// %s\n\n", k, c.relative);
                    var l = "\n" === i[i.length - 1] || "\r" === i[i.length - 1];
                    c.contents = new Buffer(j + i + (l
                        ? a
                        : b)),
                    d(null, c)
                })
    })
}
function precompile(a, b) {
    function c(a, b) {
        return a === bundleInfos.project || a === bundleInfos.all_in_one
            ? b.relative
            : a === bundleInfos.builtin
                ? Format("[%s] %s", a.subDir, Path.relative(paths.builtinPluginDir, b.path))
                : a === bundleInfos.global
                    ? Format("[%s] %s", a.subDir, Path.relative(paths.globalPluginDir, b.path))
                    : void 0
    }
    var d = {
        cwd: paths.proj
    };
    a.scripts.length = 0;
    var e = Path.join(tempScriptDir, a.subDir),
        f = gulp
            .src(a.scriptGlobs, d)
            .pipe(addMetaData())
            .pipe(es.through(function g(b) {
                var d = Path.basenameNoExt(b.path),
                    e = allModules[d];
                if (e) {
                    var f = Format('Filename conflict, the module "%s" both defined in "%s" and "%s"', d, c(a, b), e);
                    return void(gulp.isRunning
                        ? gulp.stop(f)
                        : this.emit("error", f))
                }
                allModules[d] = c(a, b);
                var g = !0;
                return g
                    ? (a.scripts.push(Path.join(a.subDir, b.relative)), void this.emit("data", b))
                    : void this.emit("error", "Sorry, encoding must be utf-8 (BOM): " + b.relative)
            }))
            .pipe(gulp.dest(e));
    return f
}
function nicifyError(a) {
    function b(a, b, c) {
        return a.substring(0, b.length) === b && a.substring(a.length - c.length) === c
            ? a.substring(b.length, a.length - c.length)
            : ""
    }
    var c = a.message;
    if (c) {
        var d = b(c, "ENOENT, open '", ".js'"),
            e;
        return d
            ? (e = Path.basenameNoExt(d), Format("'require': Cannot find module '%s'.\nDetails: " + c, e))
            : (d = b(c, "ENOENT: no such file or directory, open '", ".js'"), d
                ? (e = Path.basenameNoExt(d), Format("'require': Cannot find module '%s'.\nDetails: " + c, e))
                : b(c, "Cannot find module '", "'")
                    ? "'require': " + c
                    : "Compile error: " + c)
    }
    return a
}
function browserifyTask(a, b, c) {
    for (var d = {
        debug: debug,
        basedir: tempScriptDir
    }, e = new browserify(d), f = 0; f < a.length; ++f) {
        var g = a[f],
            h = Path.basenameNoExt(g);
        e.add("./" + g),
        d.expose = h,
        e.require("./" + g, d)
    }
    var i = e
        .bundle()
        .on("error", function (a) {
            gulp.isRunning && gulp.stop(nicifyError(a)),
            j.emit("end")
        })
        .pipe(source(c));
    debug || (i = i.pipe(buffer()).pipe(sourcemaps.init({
        loadMaps: !0
    })).pipe(uglify()).pipe(sourcemaps.write("./")));
    var j = i.pipe(gulp.dest(b));
    return j
}
function createTask(a, b) {
    gulp
        .task("pre-compile-" + a, [
            "clean", "getScriptGlobs"
        ], function () {
            return precompile(b, tempScriptDir)
        }),
    gulp.task("browserify-" + a, ["pre-compile-" + a], function () {
        var a = Path.dirname(paths.dest),
            c = Path.basename(paths.dest);
        return b.suffix && (c = Path.basenameNoExt(c) + b.suffix + Path.extname(c)),
        browserifyTask(b.scripts, a, c)
    })
}
var Path = require("fire-path"),
    Fs = require("fs"),
    Readable = require("stream").Readable,
    Format = require("util").format,
    gulp = require("gulp");
gulp = new gulp.Gulp;
var gutil = require("gulp-util"),
    del = require("del"),
    es = require("event-stream"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    uglify = require("gulp-uglify"),
    sourcemaps = require("gulp-sourcemaps"),
    opts = null,
    proj,
    platform,
    dest,
    debug,
    isEditor,
    allModules = {},
    paths,
    tempScriptDir,
    bundleInfos = {
        all_in_one: {
            suffix: "",
            subDir: "",
            scriptGlobs: [],
            scripts: []
        },
        builtin: {
            suffix: ".builtin",
            subDir: "builtin",
            scriptGlobs: [],
            scripts: []
        },
        global: {
            suffix: ".global",
            subDir: "global",
            scriptGlobs: [],
            scripts: []
        },
        project: {
            suffix: ".project",
            subDir: "assets",
            scriptGlobs: [],
            scripts: []
        }
    };
gulp.startWithArgs = function (a, b) {
    if (opts = a, dest = opts.dest = opts.dest || "library/bundle.js", platform = opts.platform = opts.platform || "editor", debug = opts.debug = !!opts.debug, opts.compileGlobalPlugin = !1, proj = opts.project, isEditor = "editor" === platform, Fire.JS.clear(allModules), paths = {
        src: getScriptGlob("assets"),
        tmpdir: "temp",
        dest: opts.dest,
        proj: Path.resolve(opts.project)
    }, paths.tmpdir = Path.join(paths.proj, paths.tmpdir), paths.dest = Path.resolve(paths.proj, paths.dest), tempScriptDir = paths.tmpdir + "/scripts", paths.proj === process.cwd()) 
        return void b("Compile error: Invalid project path: " + opts.project);
    console.log("Compiling " + paths.proj),
    console.log("Output " + paths.dest),
    paths.globalPluginDir = Editor.dataPath,
    paths.builtinPluginDir = Path.resolve(Editor.cwd, "builtin");
    for (var c in bundleInfos) 
        bundleInfos[c].scriptGlobs = [],
        bundleInfos[c].scripts = [];
    isEditor
        ? opts.compileGlobalPlugin
            ? gulp.task("browserify", ["browserify-builtin", "browserify-global", "browserify-project"])
            : gulp.task("browserify", ["browserify-builtin", "browserify-project"])
        : gulp.task("browserify", ["browserify-all_in_one"]),
    gulp.start("browserify", b)
},
gulp.task("clean", function (a) {
    var b = tempScriptDir + "/**/*";
    del(b, {
        force: !0
    }, function (b) {
        if (b) 
            return void a(b);
        var c = Path.join(Path.dirname(paths.dest), Path.basenameNoExt(paths.dest)),
            d = Path.extname(paths.dest);
        for (var e in bundleInfos) {
            var f = bundleInfos[e];
            destFile = c + f.suffix + d,
            del(destFile, {
                force: !0
            })
        }
        a()
    })
}),
gulp.task("parseProjectPlugins", function () {
    return bundleInfos.project.scriptGlobs = [],
    gulp
        .src("assets/**/package.json.meta", {cwd: paths.proj})
        .pipe(es.through(function a(b) {
            var c = JSON.parse(b.contents);
            c.enable || bundleInfos
                .project
                .scriptGlobs
                .push("!assets/" + Path.dirname(b.relative) + "/**")
        }))
}),
gulp.task("getExternScripts", function (a) {
    function b(b) {
        function c(a, b) {
            var c = [];
            for (var d in a) {
                var e = a[d];
                if (e.enable) {
                    var f = Path.join(b, d);
                    c = c.concat(getScriptGlob(f))
                }
            }
            return c
        }
        bundleInfos.builtin.scriptGlobs = c(b.builtins, paths.builtinPluginDir),
        bundleInfos.global.scriptGlobs = c(b.globals, paths.globalPluginDir),
        opts.compileGlobalPlugin || (gulp.src(bundleInfos.global.scriptGlobs, {
            read: !1,
            nodir: !0
        }).on("data", function (a) {
            console.warn("Not allowed to include runtime script in global plugin:", a.path, "\nMove the plugin to assets please.")
        }), bundleInfos.global.scriptGlobs = []),
        a()
    }
    function c(a, b) {
        function c(a, b, c) {
            gulp
                .src("*/package.json", {
                    cwd: b,
                    read: !1,
                    nodir: !0
                })
                .on("data", function (b) {
                    var c = Path.dirname(b.path),
                        f = Path.basename(c);
                    f in a || (console.log("Generate plugin settings for", c), a[f] = d, e = !0)
                })
                .on("end", function () {
                    c()
                })
        }
        var d = {
                enable: !0
            },
            e = !1;
        a.builtins = a.builtins || {},
        a.globals = a.globals || {},
        c(a.builtins, paths.builtinPluginDir, function () {
            c(a.globals, paths.globalPluginDir, function () {
                b(a),
                e && a.save()
            })
        })
    }
    var d = Editor.loadProfile("plugin", "project");
    c(d, b)
}),
gulp.task("getScriptGlobs", [
    "parseProjectPlugins", "getExternScripts"
], function () {
    bundleInfos.project.scriptGlobs = paths
        .src
        .concat(bundleInfos.project.scriptGlobs);
    var a;
    a = opts.compileGlobalPlugin
        ? [].concat(bundleInfos.builtin.scriptGlobs, bundleInfos.global.scriptGlobs, bundleInfos.project.scriptGlobs)
        : [].concat(bundleInfos.builtin.scriptGlobs, bundleInfos.project.scriptGlobs),
    bundleInfos.all_in_one.scriptGlobs = a
});
for (var taskname in bundleInfos) {
    var info = bundleInfos[taskname];
    createTask(taskname, info)
}
module.exports = gulp;