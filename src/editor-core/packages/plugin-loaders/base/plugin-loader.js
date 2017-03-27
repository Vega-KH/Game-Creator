function PluginLoader() {
    Editor
        ._PluginLoaderBase
        .apply(this, arguments),
    this.inited = !1
}
function addMenu(a) {
    if (a) {
        if (!Array.isArray(a)) 
            return void Fire.warn('The "fireball/menus" of package.json must be an Array of Objects');
        for (var b = 0; b < a.length; b++) {
            var c = a[b],
                d = c.path;
            if (d) {
                var e = c.message;
                e
                    ? Editor.sendToCore("main-menu:add-item", null, d, e, null, {type: "core-dynamic"})
                    : Fire.warn("Invalid message of menu item")
            } else 
                Fire.warn("Invalid path of menu item")
        }
    }
}
var Path = require("path"),
    Meta = require("../../../asset-db-meta.js");
Fire
    .JS
    .extend(PluginLoader, Editor._PluginLoaderBase),
PluginLoader.prototype._loadImpl = function (a) {
    if (a._mainPath) {
        var b;
        try {
            b = require(a._mainPath)
        } catch (c) {
            return void Fire.error('Failed to load the %s\'s "main" file from %s.\n%s', a.name, a._mainPath, c)
        }
        b && b.load && b.load(a)
    }
    addMenu.call(this, a.config.menus),
    PluginLoader.parseMeta(a, function (b) {
        function c(c) {
            if (b[c]) {
                var d = Path.resolve(a.path, b[c]),
                    e;
                try {
                    e = require(d)
                } catch (f) {
                    return Fire.error("Failed to load %s script from %s.\n%s", c, d, f),
                    null
                }
                return e
            }
        }
        function d(a) {
            var b = c(a);
            b && (meta.prototype[a] = b)
        }
        console.assert(b.meta),
        console.assert(b.pattern);
        var e = c("asset"),
            f = c("meta");
        if (f && (d("inspector"), e)) {
            if ("function" != typeof e) 
                return void Fire.error("Asset script should exports a constructor");
            if (!Fire.isChildClassOf(e, Fire.Asset)) 
                return void Fire.error("Asset script should exports a constructor which extends from Fire.Asset");
            f.assetType = e,
            Meta.register(b.pattern, meta, e)
        }
    })
},
PluginLoader.prototype._unloadImpl = function (a) {
    var b = require.cache;
    if (a._mainPath) {
        var c = b[a._mainPath];
        if (c) {
            var d = c && c.exports;
            d && d.unload && d.unload(a)
        }
        delete b[a._mainPath]
    }
    PluginLoader
        .parseMeta(a, function (c) {
            var d = ["meta", "inspector", "asset"];
            for (var e in d) {
                var f = d[e];
                if (c[f]) {
                    var g = Path.resolve(a.path, c[f]);
                    b[g] || Fire.warn("Failed to unload %s of plugin %s, module not loaded", g, a.name),
                    delete b[g]
                }
            }
        })
},
PluginLoader.prototype.onAfterUnload = function () {
    Editor.sendToCore("reload:core-plugins")
},
module.exports = PluginLoader;