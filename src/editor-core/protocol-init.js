var Protocol = require("protocol"),
    Url = require("fire-url"),
    Path = require("fire-path");
Protocol.registerProtocol("fire", function (a) {
    var b = decodeURIComponent(a.url),
        c = Url.parse(b),
        d = c.hostname;
    c.pathname && (d = Path.join(d, c.pathname));
    var e = Path.join(Editor.cwd, d);
    return new Protocol.RequestFileJob(e)
}),
Protocol.registerProtocol("library", function (a) {
    var b = decodeURIComponent(a.url),
        c = Url.parse(b),
        d = c.hostname;
    c.pathname && (d = Path.join(d, c.pathname));
    var e = Path.join(Editor.AssetDB.getLibraryPath(), d),
        f = new Protocol.RequestFileJob(e);
    return f
}),
Protocol.registerProtocol("uuid", function (a) {
    var b = decodeURIComponent(a.url),
        c = Url.parse(b),
        d = c.hostname;
    c.pathname && (d = Path.join(d, c.pathname));
    var e = Editor
        .AssetDB
        .uuidToLibraryPath(d);
    if ("thumb" === c.query) {
        var f = Editor
            .AssetDB
            .uuidToFspath(d);
        e = e + ".thumb" + Path.extname(f)
    }
    return new Protocol.RequestFileJob(e)
});
var _protocol2fn = {};
Editor.url = function (a) {
    var b = Url.parse(a);
    if (!b.protocol) 
        return Editor.error("Invalid url %s.", a),
        null;
    var c = _protocol2fn[b.protocol];
    return c
        ? c(b)
        : (Editor.error("Failed to load url %s, please register the protocol for it.", a), null)
},
Editor.registerProtocol = function (a, b) {
    _protocol2fn[a + ":"] = b
},
Editor.registerProtocol("fire", function (a) {
    return a.pathname
        ? Path.join(Editor.cwd, a.host, a.pathname)
        : Path.join(Editor.cwd, a.host)
}),
Editor.registerProtocol("editor-core", function (a) {
    var b = "";
    return b = a.pathname
        ? Path.join(a.host, a.pathname)
        : Path.join(a.host),
    Path.join(Editor.cwd, "src/editor-core/", b)
}),
Editor.registerProtocol("assets", function (a) {
    return Editor
        .AssetDB
        .fspath(a.href)
});