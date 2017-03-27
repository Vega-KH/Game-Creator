function _saveProfile(a, b) {
    var c = JSON.stringify(b, null, 2);
    Fs.writeFileSync(a, c, "utf8")
}
var Ipc = require("ipc"),
    Util = require("util"),
    Winston = require("winston"),
    Path = require("fire-path"),
    Fs = require("fire-fs"),
    Url = require("fire-url");
Editor.Window = require("./editor-window"),
Editor.Panel = require("./editor-panel"),
Editor.log = function () {
    var a = Util
        .format
        .apply(Util, arguments);
    Winston.normal(a),
    Editor.sendToWindows("console:log", {message: a})
},
Editor.success = function () {
    var a = Util
        .format
        .apply(Util, arguments);
    Winston.success(a),
    Editor.sendToWindows("console:success", {message: a})
},
Editor.failed = function () {
    var a = Util
        .format
        .apply(Util, arguments);
    Winston.failed(a),
    Editor.sendToWindows("console:failed", {message: a})
},
Editor.info = function () {
    var a = Util
        .format
        .apply(Util, arguments);
    Winston.info(a),
    Editor.sendToWindows("console:info", {message: a})
},
Editor.warn = function () {
    var a = Util
        .format
        .apply(Util, arguments);
    Winston.warn(a),
    console.trace(),
    Editor.sendToWindows("console:warn", {message: a})
},
Editor.error = function () {
    var a = Util
        .format
        .apply(Util, arguments);
    Winston.error(a),
    console.trace(),
    Editor.sendToWindows("console:error", {message: a})
},
Editor.fatal = function () {
    var a = Util
        .format
        .apply(Util, arguments);
    Winston.fatal(a),
    console.trace()
};
var _path2profiles = {};
Editor.loadProfile = function (a, b, c) {
    var d = _type2profilepath[b];
    if (!d) 
        return Editor.error("Failed to load profile by type %s, please register it first.", b),
        null;
    d = Path.join(d, a + ".json");
    var e = _path2profiles[d];
    if (e) 
        return e;
    var f = {
        save: function () {
            _saveProfile(d, this)
        },
        clear: function () {
            for (var a in this) 
                "save" !== a && "clear" !== a && delete this[a]
        }
    };
    if (e = c || {}, Fs.existsSync(d)) 
        try {
            e = JSON.parse(Fs.readFileSync(d))
        } catch (g) {
            g && (Editor.warn("Failed to load profile %s, error message: %s", a, g.message), e = {})
        } else 
            Fs.writeFileSync(d, JSON.stringify(e, null, 2));
return e = Fire
        .JS
        .mixin(e, f),
    _path2profiles[d] = e,
    e
},
Editor.quit = function () {
    for (var a = Editor.Window.windows, b = 0; b < a.length; ++b) 
        a[b].close()
};
var _type2profilepath = {};
Editor.registerProfilePath = function (a, b) {
    _type2profilepath[a] = b
},
Ipc.on("console:log", function (a) {
    Editor.log(a.message)
}),
Ipc.on("console:warn", function (a) {
    Editor.warn(a.message)
}),
Ipc.on("console:error", function (a) {
    Editor.error(a.message)
}),
Ipc.on("console:success", function (a) {
    Editor.success(a.message)
}),
Ipc.on("console:failed", function (a) {
    Editor.failed(a.message)
}),
Ipc.on("console:info", function (a) {
    Editor.info(a.message)
});