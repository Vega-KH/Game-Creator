!function () {
    var a = require("util"),
        b = require("ipc"),
        c = require("remote"),
        d = c.getGlobal("Editor");
    window.Editor = window.Editor || {};
    for (var e = decodeURIComponent(location.search.substr(1)), f = e.split("&"), g = {}, h = 0; h < f.length; ++h) {
        var i = f[h].split("=");
        2 === i.length && (g[i[0]] = i[1])
    }
    Editor.argv = g,
    Editor.url = function (a) {
        return d.url(a)
    },
    Fire.log = function (b) {
        "use strict";
        b = arguments.length <= 1
            ? "" + b
            : a
                .format
                .apply(a, arguments),
        console.log(b),
        Editor.sendToCore("console:log", {message: b})
    },
    Fire.warn = function (b) {
        "use strict";
        b = arguments.length <= 1
            ? "" + b
            : a
                .format
                .apply(a, arguments),
        console.warn(b),
        Editor.sendToCore("console:warn", {message: b})
    },
    Fire.error = function (b) {
        "use strict";
        b = arguments.length <= 1
            ? "" + b
            : a
                .format
                .apply(a, arguments),
        console.error(b),
        Editor.sendToCore("console:error", {message: b})
    },
    Fire.success = function (b) {
        "use strict";
        b = arguments.length <= 1
            ? "" + b
            : a
                .format
                .apply(a, arguments),
        console.log("%c" + b, "color: green"),
        Editor.sendToCore("console:success", {message: b})
    },
    Fire.failed = function (b) {
        "use strict";
        b = arguments.length <= 1
            ? "" + b
            : a
                .format
                .apply(a, arguments),
        console.log("%c" + b, "color: red"),
        Editor.sendToCore("console:failed", {message: b})
    },
    Fire.info = function (b) {
        "use strict";
        b = arguments.length <= 1
            ? "" + b
            : a
                .format
                .apply(a, arguments),
        console.info(b),
        Editor.sendToCore("console:info", {message: b})
    },
    Fire._throw = function (a) {
        console.error(a.stack);
        var c = Editor
            ._SourceMap
            .resolveStack(a.stack);
        b._events["console:error"]
            ? b.emit("console:error", {message: c})
            : Editor.sendToMainWindow("console:error", {message: c})
    },
    Editor.observe = function (a, b) {
        if (a.isValid && (a._observing = b, a instanceof Fire.Entity)) 
            for (var c = 0; c < a._components.length; ++c) {
                var d = a._components[c];
                d._observing = b
            }
        },
    Editor.hintObjectById = function (a, b) {
        Fire.isChildClassOf(a, Fire.Entity)
            ? Editor.sendToWindows("entity:hint", {"entity-id": b})
            : Fire.isChildClassOf(a, Fire.Component)
                ? Editor.sendToWindows("entity:hint", {"entity-id": b})
                : Fire.isChildClassOf(a, Fire.Asset) && Editor.sendToWindows("asset:hint", {uuid: b})
    },
    Editor.hintObject = function (a) {
        a instanceof Fire.Entity
            ? Editor.sendToWindows("entity:hint", {"entity-id": a.id})
            : a instanceof Fire.Component
                ? Editor.sendToWindows("entity:hint", {"entity-id": a.entity.id})
                : a instanceof Fire.Asset && Editor.sendToWindows("asset:hint", {uuid: a._uuid})
    },
    Editor.openObjectById = function (a, b) {
        Fire.isChildClassOf(a, Fire.Entity) || Fire.isChildClassOf(a, Fire.Component) || Fire.isChildClassOf(a, Fire.Asset) && Editor.sendToAll("asset:open", {
            uuid: b,
            url: Editor
                .AssetDB
                .uuidToUrl(b)
        })
    },
    Editor.openObject = function (a) {
        a instanceof Fire.Entity || a instanceof Fire.Component || a instanceof Fire.Asset && Editor.sendToAll("asset:open", {
            uuid: a._uuid,
            url: Editor
                .AssetDB
                .uuidToUrl(a._uuid)
        })
    };
    var j = !1;
    Editor.browseObject = function (a, b) {
        if (!j) {
            j = !0;
            var c = new Editor.IpcListener;
            if (Fire.isChildClassOf(a, Fire.Entity)) 
                Fire.warn("TODO: ask johnny how to do this."),
                j = !1;
            else if (Fire.isChildClassOf(a, Fire.Component)) 
                Fire.warn("TODO: ask johnny how to do this."),
                j = !1;
            else if (Fire.isChildClassOf(a, Fire.Asset)) {
                var d = Fire
                    .JS
                    ._getClassId(a);
                Editor.sendToCore("quick-view:open", {
                    "type-id": d,
                    id: b.value
                        ? b.value._uuid
                        : ""
                }),
                c.on("quick-view:selected", function (a) {
                    b.setAsset(a)
                }),
                c.on("quick-view:closed", function () {
                    j = !1,
                    c.clear()
                })
            }
        }
    },
    Editor.serializeMeta = function (a) {
        if (!a.subRawData) 
            return Editor.serialize(a);
        for (var b = a.subRawData.map(function (a) {
            var b = a.asset._uuid;
            return a.asset._uuid = null,
            b
        }), c = Editor.serialize(a), d = 0; d < a.subRawData.length; ++d) 
            a.subRawData[d].asset._uuid = b[d];
        return c
    },
    Editor.plugins = {},
    Editor.gizmos = {}
}(),
function () {
    var a = require("ipc");
    Editor.sendToCore = function (b) {
        "use strict";
        if ("string" == typeof b) {
            var c = []
                .slice
                .call(arguments);
            a
                .send
                .apply(a, ["editor:send2core"].concat(c))
        } else 
            Fire.error("The message must be provided")
    },
    Editor.sendToWindows = function (b) {
        "use strict";
        if ("string" == typeof b) {
            var c = []
                .slice
                .call(arguments);
            a
                .send
                .apply(a, ["editor:send2wins"].concat(c))
        } else 
            Fire.error("The message must be provided")
    },
    Editor.sendToMainWindow = function (b) {
        "use strict";
        if ("string" == typeof b) {
            var c = []
                .slice
                .call(arguments);
            a
                .send
                .apply(a, ["editor:send2mainwin"].concat(c))
        } else 
            Fire.error("The message must be provided")
    },
    Editor.sendToAll = function (b) {
        "use strict";
        if ("string" == typeof b) {
            var c = []
                .slice
                .call(arguments);
            a
                .send
                .apply(a, ["editor:send2all"].concat(c))
        } else 
            Fire.error("The message must be provided")
    },
    Editor.sendToPanel = function (b, c) {
        "use strict";
        if ("string" == typeof c) {
            var d = []
                .slice
                .call(arguments);
            a
                .send
                .apply(a, ["editor:send2panel"].concat(d))
        } else 
            Fire.error("The message must be provided")
    };
    var b = 0,
        c = {};
    Editor.sendRequestToCore = function (d) {
        "use strict";
        if ("string" == typeof d) {
            var e = []
                    .slice
                    .call(arguments, 1),
                f = e[e.length - 1];
            if ("function" == typeof f) {
                e.pop();
                var g = b++,
                    h = "" + g;
                c[h] = f,
                a.send("editor:sendreq2core", d, e, g)
            } else 
                Fire.error("The reply must be of type function")
        } else 
            Fire.error("The request must be of type string")
    },
    a.on("editor:sendreq2core:reply", function d(a, b) {
        "use strict";
        var d = "" + b,
            e = c[d];
        e
            ? (e.apply(null, a), delete c[d])
            : Fire.error("non-exists callback of session:", b)
    }),
    a.on("editor:send2panel", function () {
        Editor
            .Panel
            .dispatch
            .apply(Editor.Panel, arguments)
    })
}(),
function () {
    var a = Fire.BitmapFont;
    a.prototype.createEntity = function (a) {
        var b = new Fire.Entity(this.name),
            c = b.addComponent(Fire.BitmapText);
        c.bitmapFont = this,
        a && a(b)
    }
}(),
function () {
    var a = Fire.Sprite;
    a.prototype.createEntity = function (a) {
        var b = new Fire.Entity(this.name),
            c = b.addComponent(Fire.SpriteRenderer);
        c.sprite = this,
        c.width = this.width,
        c.height = this.height,
        a && a(b)
    }
}(),
function () {
    var a = Fire.Texture;
    a.prototype.createEntity = function (a) {
        var b = Editor
            .AssetDB
            .loadMetaJson(this._uuid);
        Fire
            .AssetLibrary
            .loadMeta(b, function (b, c) {
                if (c.subRawData && c.subRawData.length > 0) {
                    var d = c.subRawData[0];
                    d.asset.createEntity && (Fire.AssetLibrary.cacheAsset(d.asset), d.asset.createEntity(a))
                }
            }.bind(this))
    }
}(),
function () {
    Fire.ScriptAsset.prototype.createEntity = function (a) {
        var b = Editor.compressUuid(this._uuid),
            c = Fire
                .JS
                ._getClassById(b);
        if (c && Fire.isChildClassOf(c, Fire.Component)) {
            var d = new Fire.Entity(this.name);
            d.addComponent(c),
            a && a(d)
        }
    }
}(),
function () {
    Fire.AudioClip.prototype.createEntity = function (a) {
        var b = new Fire.Entity(this.name),
            c = b.addComponent(Fire.AudioSource);
        c.clip = this,
        a && a(b)
    }
}(),
function () {
    Fire.AssetLibrary.loadMeta = function (a, b) {
        function c(a) {
            for (var b = 0; b < a.length; b++) {
                var d = a[b];
                d.asset._uuid = d.meta.uuid,
                d.meta.subRawData && c(d.meta.subRawData)
            }
        }
        var d = JSON.parse(a);
        d.subRawData && (d.subRawData = d.subRawData.map(function (a) {
            return a.asset = {
                __uuid__: a.meta.uuid
            },
            a
        })),
        this.loadJson(d, function (a, d) {
            d && d.subRawData && c(d.subRawData),
            b(a, d)
        }, !0)
    },
    Fire.AssetLibrary.loadAssetInEditor = function (a, b) {
        this.loadAsset(a, b, !1, !1)
    },
    Fire.AssetLibrary.clearAllCache = function () {
        this._uuidToAsset = {}
    },
    Fire.AssetLibrary.getCachedAsset = function (a) {
        return this._uuidToAsset[a]
    },
    Fire.AssetLibrary.replaceAsset = function (a, b) {
        b = b || a._uuid,
        b
            ? this._uuidToAsset[b] = a
            : Fire.error("[AssetLibrary] Not supplied uuid of asset to replace")
    },
    Fire.AssetLibrary.assetListener = new Fire.CallbacksInvoker,
    Fire.AssetLibrary._onAssetChanged = function (a, b) {
        this
            .assetListener
            .invoke(a, b)
    },
    Fire.AssetLibrary.cacheAsset = function (a) {
        function b(a) {
            for (var d in a) 
                if (a.hasOwnProperty(d)) {
                    var e = a[d];
                    e instanceof Fire.Asset && e._uuid && !(e._uuid in c) && (c[e._uuid] = e, b(e))
                }
            }
        var c = this._uuidToAsset;
        a
            ? a._uuid
                ? c[a._uuid] || (c[a._uuid] = a, b(a))
                : Fire.error("[AssetLibrary] Not defined uuid of the asset to cache")
            : Fire.error("[AssetLibrary] The asset to cache must be non-nil")
    },
    Fire.AssetLibrary.onAssetReimported = function (a) {
        var b = this._uuidToAsset[a];
        b && (b instanceof Fire._Scene || this.loadAsset(a, function (c, d) {
            var e = a in this._uuidToAsset;
            d && e && (console.assert(d === b), this._onAssetChanged(a, d))
        }.bind(this), !1, !0, b))
    };
    var a = Fire
        .AssetLibrary
        .unloadAsset
        .bind(Fire.AssetLibrary);
    Fire.AssetLibrary.unloadAsset = function (b, c) {
        var d,
            e;
        "string" == typeof b
            ? d = b
            : (e = b, d = e && e._uuid),
        d
            ? (this._onAssetChanged(d, null), a(b, c))
            : e && (e.destroy(), FObject._deferredDestroy())
    }
}(),
function () {
    Editor._AssetsWatcher = function () {
        function a(a) {
            this.owner = a,
            this.watchingInfos = {}
        }
        function b(a, c) {
            if (a.hasOwnProperty(c)) {
                var d = Object.getOwnPropertyDescriptor(a, c);
                return d
                    ? d
                    : (console.error("unknown error"), null)
            }
            var e = Object.getPrototypeOf(a);
            return e
                ? b(e, c)
                : null
        }
        function c(a, c) {
            var d = b(a, c);
            if (d && "value" in d) 
                return void console.error("Internal Error: Cannot watch instance variable of %s.%s", a, c);
            if (!d) 
                return void console.error("Internal Error: Failed to get property descriptor of %s.%s", a, c);
            var e;
            e = a.hasOwnProperty(c)
                ? a
                : Object.getPrototypeOf(a);
            var g = Object.getOwnPropertyDescriptor(e, c);
            return g && g.configurable === !1
                ? void console.error("Internal Error: Failed to register notifier for %s.%s", a, c)
                : void Object.defineProperty(e, c, {
                    get: d.get,
                    set: function (a, b) {
                        this._observing && Object
                            .getNotifier(this)
                            .notify({type: "update", name: c, oldValue: this[c]}),
                        d
                            .set
                            .call(this, a, b),
                        this._watcherHandler && this._watcherHandler !== f && this
                            ._watcherHandler
                            .changeWatchAsset(c, a)
                    }
                })
        }
        function d(a) {
            for (var b = a.constructor, d = Fire.attr(b, "A$$ETprops", {
                parsed: !0,
                assetProps: null
            }), e = 0, f = b.__props__; e < f.length; e++) {
                var g = f[e],
                    h = Fire.attr(b, g);
                if (h.hasSetter && h.hasGetter) {
                    var i = a[g],
                        j = i instanceof Fire.Asset || Fire.isChildClassOf(h.ctor, Fire.Asset),
                        k = null === i || "undefined" == typeof i;
                    (j || k) && (c(a, g), d.assetProps
                        ? d.assetProps.push(g)
                        : d.assetProps = [g])
                }
            }
            return d
        }
        function e(a, b, c) {
            a[b] = c
        }
        var f = a;
        return a.initComponent = function (a) {
            a._watcherHandler = null
        },
        a.initHandler = function (b) {
            var c = Fire.attr(b.constructor, "A$$ETprops");
            c && c.parsed || (c = d(b)),
            b._watcherHandler = c.assetProps
                ? new a(b)
                : f
        },
        a.start = function (b) {
            b._watcherHandler || a.initHandler(b),
            b._watcherHandler !== f && b
                ._watcherHandler
                .start()
        },
        a.stop = function (a) {
            a._watcherHandler && a._watcherHandler !== f && a
                ._watcherHandler
                .stop()
        },
        a.prototype.start = function () {
            for (var a = this.owner, b = Fire.attr(a.constructor, "A$$ETprops", {}).assetProps, c = 0; c < b.length; c++) {
                var d = b[c],
                    f = a[d];
                if (f && f._uuid) {
                    var g = function (b) {
                        return function (c) {
                            e(a, b, c)
                        }
                    }(d);
                    Fire
                        .AssetLibrary
                        .assetListener
                        .add(f._uuid, g),
                    this.watchingInfos[d] = {
                        uuid: f._uuid,
                        callback: g
                    }
                }
            }
        },
        a.prototype.stop = function () {
            for (var a in this.watchingInfos) {
                var b = this.watchingInfos[a];
                b && Fire
                    .AssetLibrary
                    .assetListener
                    .remove(b.uuid, b.callback)
            }
            this.watchingInfos = {}
        },
        a.prototype.changeWatchAsset = function (a, b) {
            var c = this.watchingInfos[a];
            if (c) {
                if (b && c.uuid === b._uuid) 
                    return;
                this.watchingInfos[a] = null,
                Fire
                    .AssetLibrary
                    .assetListener
                    .remove(c.uuid, c.callback)
            }
            if (b) {
                var d = b._uuid;
                if (d) {
                    var f = this.owner,
                        g = function (b) {
                            e(f, a, b)
                        };
                    Fire
                        .AssetLibrary
                        .assetListener
                        .add(d, g),
                    this.watchingInfos[a] = {
                        uuid: d,
                        callback: g
                    }
                }
            }
        },
        a
    }()
}(),
function () {
    var a = function (a, b, c, d) {
        var e = b,
            f = c,
            g = 0,
            h = 0,
            i = 4 * b,
            j,
            k,
            l,
            m;
        for (k = 0; c > k; k++) 
            for (m = k * i + 3, j = 0; b > j; j++, m += 4) 
                if (a[m] >= d) {
                    f = k,
                    k = c;
                    break
                }
            for (k = c - 1; k >= f; k--) 
            for (m = k * i + 3, j = 0; b > j; j++, m += 4) 
                if (a[m] >= d) {
                    h = k - f + 1,
                    k = 0;
                    break
                }
            var n = i * f;
        for (j = 0; b > j; j++) 
            for (m = n + 4 * j + 3, l = 0; h > l; l++, m += i) 
                if (a[m] >= d) {
                    e = j,
                    j = b;
                    break
                }
            for (j = b - 1; j >= e; j--) 
            for (m = n + 4 * j + 3, l = 0; h > l; l++, m += i) 
                if (a[m] >= d) {
                    g = j - e + 1,
                    j = 0;
                    break
                }
            return new Fire.Rect(e, f, g, h)
    };
    Editor.getTrimRect = function (b, c) {
        var d,
            e;
        b instanceof Image || b instanceof HTMLImageElement
            ? (d = document.createElement("canvas"), d.width = b.width, d.height = b.height, e = d.getContext("2d"), e.drawImage(b, 0, 0, b.width, b.height))
            : (d = b, e = d.getContext("2d"));
        var f = e
            .getImageData(0, 0, d.width, d.height)
            .data;
        return a(f, b.width, b.height, c)
    };
    var b = function (a, d) {
            var e = function (e) {
                e.length && (c(e, d), b(a, d))
            };
            a.readEntries(e)
        },
        c = function (a, c) {
            for (var d = [], e = 0, f = function (a) {
                --e,
                d.push(a),
                0 === e && c(d)
            },
            g,
            h = 0; h < a.length; h++) 
                a[h].isDirectory
                    ? (g = a[h].createReader(), b(g, c))
                    : (++e, a[h].file(f))
            };
    Editor.getDraggingFiles = function (a, b) {
        var d = a.dataTransfer.items;
        if (!d) 
            return void b(a.dataTransfer.files);
        for (var e = [], f, g = 0; g < d.length; g++) 
            f = d[g].getAsEntry
                ? d[g].getAsEntry()
                : d[g].webkitGetAsEntry
                    ? d[g].webkitGetAsEntry()
                    : null,
            null !== f && f.isDirectory
                ? c([f], b)
                : e.push(a.dataTransfer.files[g]);
        e.length > 0 && b(e)
    };
    var d = function (a, b) {
        var c = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        c.href = a,
        c.download = b,
        c.click()
    };
    window.navigator.saveBlob = window.navigator.saveBlob || window.navigator.msSaveBlob,
    window.URL = window.URL || window.webkitURL,
    Editor.downloadBlob = function (a, b) {
        if (window.navigator.saveBlob) 
            window.navigator.saveBlob(a, b);
        else {
            var c = window
                .URL
                .createObjectURL(a);
            d(c, b),
            window
                .URL
                .revokeObjectURL(c)
        }
    },
    Editor.downloadCanvas = function (a, b) {
        if (a.toBlob = a.toBlob || a.msToBlob, a.toBlob && window.navigator.saveBlob) 
            window.navigator.saveBlob(a.toBlob(), b);
        else {
            var c = a.toDataURL("image/png");
            d(c, b)
        }
    },
    Fire.imgDataUrlToBase64 = function (a) {
        return a.replace(/^data:image\/\w+;base64,/, "")
    }
}(),
function () {
    Editor.buildPng = function (a, b, c, d, e) {
        function f(a) {
            return "undefined" != typeof libpng
                ? (a(libpng), !0)
                : requirejs
                    ? (requirejs(["libpng"], a), !0)
                    : !1
        }
        function g(b) {
            console.time("png");
            var f = b.createWriter(a.width, a.height);
            if (f.set_filter(b.FILTER_NONE), f.set_compression_level(3), f.write_imageData(c), f.write_end(), console.timeEnd("png"), d || Fire.isNode) 
                e({bin: f.data});
            else {
                var g = new Blob([new Uint8Array(f.data)], {type: "image/png"});
                e({blob: g})
            }
        }
        if (f(g) === !1) {
            if (!a) 
                throw new Error("no png encoder nor canvas");
            if (d || Fire.isNode) {
                var h = a.toDataURL("image/png"),
                    i = Fire.imgDataUrlToBase64(h);
                e({base64: i})
            } else 
                e({canvas: a})
        }
    },
    Editor.savePng = function (a, b, c, d) {
        var e = Object.keys(a)[0],
            f = a[e];
        return d
            ? void("bin" === e
                ? d.file(b, f)
                : "base64" === e
                    ? d.file(b, f, {
                        base64: !0
                    })
                    : Fire.error("unknown data type to zip"))
            : void(Fire.isNode
                ? "bin" === e
                    ? Fs.writeFileSync(c, new Buffer(f))
                    : "base64" === e
                        ? Fs.writeFileSync(c, f, {encoding: "base64"})
                        : Fire.warn("unknown node type: " + e)
                : "blob" === e
                    ? Editor.downloadBlob(f, b)
                    : "canvas" === e
                        ? Editor.downloadCanvas(f, b)
                        : Fire.warn("unknown browser type: " + e))
    },
    Editor.saveText = function (a, b, c) {
        if (Fire.isNode) 
            Fs.writeFileSync(c, a, {encoding: "ascii"});
        else {
            var d = new Blob([a], {type: "text/plain;charset=utf-8"});
            Editor.downloadBlob(d, b)
        }
    }
}(),
function () {
    var a = {};
    Editor._idToObject = a,
    Editor.getInstanceById = function (b) {
        return a[b]
    },
    Object.defineProperty(Fire, "$0", {
        get: function () {
            var a = Editor.Selection.entities[0];
            return a
                ? Editor.getInstanceById(a)
                : void 0
        }
    })
}(),
function () {
    var a = Fire.Component;
    Object.defineProperty(a.prototype, "id", {
        get: function () {
            var a = this._id;
            return a
                ? a
                : (a = this._id = "" + this.hashCode, Editor._idToObject[a] = this, a)
        }
    });
    var b = a.prototype._onPreDestroy;
    a.prototype._onPreDestroy = function () {
        b.call(this),
        delete Editor._idToObject[this._id]
    },
    a.prototype._cacheUuid = null;
    var c = Fire._doDefine;
    Fire._doDefine = function (a, b, d) {
        var e = c(a, b, d);
        if (e && Fire.isChildClassOf(b, Fire.Component)) {
            var f = Fire._RFget(),
                g = f.uuid;
            g && (Fire.addComponentMenu(e, "Scripts/" + Fire.JS.getClassName(e), -1), e.prototype._cacheUuid = Editor.decompressUuid(g))
        }
        return e
    };
    var d = {
        onEnabled: "onEnable",
        enable: "enabled",
        onDisabled: "onDisable",
        onDestroyed: "onDestroy",
        awake: "onLoad",
        onStart: "start"
    };
    for (var e in d) 
        !function (b) {
            var c = d[b];
            Object.defineProperty(a.prototype, b, {
                set: function (d) {
                    Fire.warn('Potential Typo: Please use "%s" instead of "%s" for Component "%s"', c, b, Fire.JS.getClassName(this)),
                    Object.defineProperty(a.prototype, b, {
                        value: d,
                        writable: !0
                    })
                },
                configurable: !0
            })
        }
    (e)
}(),
function () {
    var a = "Can not load the associated script. Please assign a valid script.",
        b = "Compilation fails, please fix errors and retry.",
        c = Fire._MissingScript;
    c.getset("_scriptUuid", function () {
        var a = this._$erialized.__type__;
        return Editor.isUuid(a)
            ? Editor.decompressUuid(a)
            : ""
    }, function (a) {
        if (!Editor._Sandbox.compiled) 
            return void Fire.error("Scripts not yet compiled, please fix script errors and compile first.");
        if (a && Editor.isUuid(a._uuid)) {
            var b = Editor.compressUuid(a);
            Fire
                .JS
                ._getClassById(b)
                ? (this._$erialized.__type__ = b, Editor.sendToWindows("reload:window-scripts", Editor._Sandbox.compiled))
                : Fire.error('Can not find a component in the script which uuid is "%s".', a)
        } else 
            Fire.error("invalid script")
    }),
    c.get("errorInfo", function () {
        return Editor._Sandbox.compiled
            ? a
            : b
    }, Fire.MultiText),
    c.prop("_$erialized", null, Fire.HideInInspector, Fire.EditorOnly),
    c.safeFindClass = function (a) {
        var b = Fire
            .JS
            ._getClassById(a);
        return b
            ? b
            : a
                ? c
                : null
    }
}(),
function () {
    var a = Fire.Entity;
    a.createWithFlags = function (b, c) {
        a._defaultFlags = c;
        var d = new a(b);
        return a._defaultFlags = 0,
        d
    },
    Object.defineProperty(a.prototype, "id", {
        get: function () {
            var a = this._id;
            return a
                ? a
                : (a = this._id = "" + this.hashCode, Editor._idToObject[a] = this, a)
        }
    });
    var b = a.prototype._onPreDestroy;
    a.prototype._onPreDestroy = function () {
        b.call(this),
        delete Editor._idToObject[this._id]
    },
    a.prototype._getIndices = function () {
        for (var a = [], b = this; b; b = b._parent) 
            a.push(b.getSiblingIndex());
        return a.reverse()
    }
}(),
function () {
    var a = Fire._Scene,
        b = Fire.Engine,
        c = Fire.Entity;
    a.prototype.addEntity = function (a, d) {
        var e = b._scene,
            f = b._scene === this;
        f === !1 && (b._canModifyCurrentScene = !1, b._scene = this);
        var g = c.createWithFlags(a, d);
        return f === !1 && (b._canModifyCurrentScene = !0, b._scene = e),
        g
    },
    a.prototype.findEntityWithFlag = function (a, b) {
        for (var c = a.split("/"), d = null, e = c[1], f = this.entities, g = 0; g < f.length; g++) 
            if (f[g].isValid && f[g]._name === e && (f[g]._objFlags & b) === b) {
                d = f[g];
                break
            }
        if (!d) 
            return null;
        var h = 2;
        for (h; h < c.length; h++) {
            e = c[h];
            var i = d._children;
            d = null;
            for (var j = 0, k = i.length; k > j; ++j) {
                var l = i[j];
                if (l.name === e && (l._objFlags & b) === b) {
                    d = l;
                    break
                }
            }
            if (!d) 
                return null
        }
        return d
    },
    a.prototype.findEntityByIndices = function (a) {
        for (var b, c = 0, d = this.entities; c < a.length; c++, d = b._children) {
            var e = a[c];
            if (!(e < d.length && (b = d[e], Fire.isValid(b)))) 
                return null
        }
        return b
    },
    a.prototype._instantiate = function () {
        var a = this._uuid,
            b = this.dirty,
            c = Fire._doInstantiate(this);
        return c._uuid = a,
        c.dirty = b,
        c
    }
}(),
function () {
    var a = Fire.Engine;
    a.createSceneView = function (a, b, c) {
        return Fire
            ._Runtime
            .RenderContext
            .createSceneRenderCtx(a, b, c, !0)
    },
    a.createInteractionContext = function () {
        return new Fire._InteractionContext
    }
}(),
function () {
    var a = Fire._Runtime.RenderContext,
        b = Fire.Engine;
    a.createSceneRenderCtx = function (c, d, e, f) {
        var g = new a(c, d, e, f),
            h = new PIXI.DisplayObjectContainer,
            i = new PIXI.DisplayObjectContainer,
            j = new PIXI.DisplayObjectContainer;
        return g
            .stage
            .addChild(j),
        g
            .stage
            .addChild(i),
        g
            .stage
            .addChild(h),
        g.root = i,
        g.isSceneView = !0,
        b._renderContext.sceneView = g,
        g
    },
    a.prototype.getDisplayObject = function (a) {
        var b = this.sceneView;
        return b
            ? a._renderObjInScene
            : a._renderObj
    },
    a.prototype.getForegroundNode = function () {
        return this.stage.children[this.stage.children.length - 1]
    },
    a.prototype.getBackgroundNode = function () {
        return this.stage.children[0]
    }
}(),
function () {
    function a(b) {
        return {
            name: b._name,
            objFlags: b._objFlags,
            id: b.id,
            children: b
                ._children
                .map(a)
        }
    }
    function b(b) {
        return {
            entities: b
                .entities
                .map(a)
        }
    }
    var c = Fire.Engine._editorCallback;
    c.onEnginePlayed = function (a) {
        window.dispatchEvent(new CustomEvent("engine-played", {
            detail: {
                continued: a
            },
            bubbles: !1,
            cancelable: !1
        })),
        Editor.sendToWindows("engine:played", a)
    },
    c.onEngineStopped = function () {
        window.dispatchEvent(new CustomEvent("engine-stopped", {
            bubbles: !1,
            cancelable: !1
        })),
        Editor.sendToWindows("engine:stopped")
    },
    c.onEnginePaused = function () {
        Editor.sendToWindows("engine:paused")
    };
    var d = require("events");
    c.onStartUnloadScene = function (a) {
        window.dispatchEvent(new CustomEvent("start-unload-scene", {
            detail: {
                scene: a
            },
            bubbles: !1,
            cancelable: !1
        }))
    },
    c.onSceneLaunched = function (a) {
        window.dispatchEvent(new CustomEvent("scene-launched", {
            detail: {
                scene: a
            },
            bubbles: !1,
            cancelable: !1
        })),
        Editor.sendToWindows("scene:launched", b(a)),
        Editor.sendToWindows("scene:dirty")
    },
    c.onEntityCreated = function (b) {
        Editor.sendToWindows("entity:created", a(b)),
        Editor.sendToWindows("scene:dirty")
    },
    c.onEntityRemoved = function (a) {
        Editor.sendToWindows("entity:removed", {"entity-id": a.id}),
        Editor.sendToWindows("scene:dirty");
        var b = Editor.Selection.entities;
        if (a.childCount > 0) {
            for (var c = [], d = 0; d < b.length; d++) {
                var e = b[d],
                    f = Editor.getInstanceById(e);
                f && f.isChildOf(a) && c.push(e)
            }
            c.length > 0 && (Editor.Selection.cancel(), Editor.Selection.unselectEntity(c))
        } else - 1 !== b.indexOf(a.id) && (Editor.Selection.cancel(), Editor.Selection.unselectEntity(a.id));
        if (Editor.Selection.hoveringEntityId) {
            var g = Editor.getInstanceById(Editor.Selection.hoveringEntityId);
            g && g.isChildOf(a) && Editor
                .Selection
                .hoverEntity("")
        }
    },
    c.onEntityParentChanged = function (a) {
        Editor.sendToWindows("entity:parent-changed", {
            "entity-id": a.id,
            "parent-id": a.parent
                ? a.parent.id
                : null
        }),
        Editor.sendToWindows("scene:dirty")
    },
    c.onEntityIndexChanged = function (a, b, c) {
        var d = null,
            e = c;
        do 
            ++e,
            d = a.getSibling(e);
        while (d && d._objFlags & Fire._ObjectFlags.HideInEditor);
        Editor.sendToWindows("entity:index-changed", {
            "entity-id": a.id,
            "next-sibliing-id": d
                ? d.id
                : null
        }),
        Editor.sendToWindows("scene:dirty")
    },
    c.onEntityRenamed = function (a) {
        Editor.sendToWindows("entity:renamed", {
            "entity-id": a.id,
            name: a._name
        })
    },
    c.onComponentEnabled = function (a) {
        Editor.sendToWindows("component:enabled", {"component-id": a.id})
    },
    c.onComponentDisabled = function (a) {
        Editor.sendToWindows("component:disabled", {"component-id": a.id})
    },
    c.onComponentAdded = function (a, b) {
        Editor.sendToWindows("component:added", {
            "entity-id": a.id,
            "component-id": b.id
        })
    },
    c.onComponentRemoved = function (a, b) {
        Editor.sendToWindows("component:removed", {
            "entity-id": a.id,
            "component-id": b.id
        })
    }
}(),
function () {
    if (Fire.isAtomShell) {
        var a = require("ipc"),
            b = require("fire-url"),
            c = Fire.Engine,
            d = Fire.Entity,
            e = Fire.FObject;
        a.on("engine:rename-entity", function (a) {
            var b = a.id,
                c = a.name,
                d = Editor.getInstanceById(b);
            d && (d.name = c)
        }),
        a.on("engine:delete-entities", function (a) {
            for (var b = a["entity-id-list"], d = 0; d < b.length; d++) {
                var f = b[d],
                    g = Editor.getInstanceById(f);
                g && g.destroy()
            }
            c.isPlaying || e._deferredDestroy()
        }),
        a.on("engine:create-entity", function (a) {
            var b;
            a && (b = a["parent-id"]);
            var c = new d;
            if (b) {
                var e = Editor.getInstanceById(b);
                e && (c.parent = e)
            }
        }),
        a.on("engine:move-entities", function (a) {
            for (var b = a["entity-id-list"], c = a["parent-id"], d = a["next-sibling-id"], e = c && Editor.getInstanceById(c), f = d
                ? Editor.getInstanceById(d)
                : null, g = f
                ? f.getSiblingIndex()
                : -1, h = 0; h < b.length; h++) {
                var i = b[h],
                    j = Editor.getInstanceById(i);
                if (j && (!e || !e.isChildOf(j))) 
                    if (j.parent !== e) {
                        var k = j.transform.worldPosition,
                            l = j.transform.worldRotation,
                            m = j.transform.worldScale;
                        j.parent = e,
                        j.transform.worldPosition = k,
                        j.transform.worldRotation = l,
                        j.transform.scale = e
                            ? m.divSelf(e.transform.worldScale)
                            : m,
                        f && (j.setSiblingIndex(g), ++g)
                    }
                else if (f) {
                    var n = j.getSiblingIndex(),
                        o = g;
                    o > n && --o,
                    o !== n && (j.setSiblingIndex(o), n > o
                        ? ++g
                        : --g)
                } else 
                    j.setAsLastSibling()
            }
        }),
        a.on("engine:duplicate-entities", function (a) {
            for (var b = a["entity-id-list"], c = 0; c < b.length; c++) {
                var d = b[c],
                    e = Editor.getInstanceById(d);
                if (e) {
                    var f = Fire.instantiate(e);
                    f.parent = e.parent
                }
            }
        }),
        a.on("engine:add-component", function (a) {
            var b = a["entity-id"],
                c = a["component-class-id"],
                d = Editor.getInstanceById(b);
            if (d) {
                var e = Fire
                    .JS
                    ._getClassById(c);
                e && d.addComponent(e)
            }
        }),
        a.on("engine:remove-component", function (a) {
            var b = a["component-id"],
                d = Editor.getInstanceById(b);
            d && d.destroy(),
            c.isPlaying || e._deferredDestroy()
        }),
        a.on("engine:open-scene", function (a) {
            var b = a.uuid;
            Fire.Engine.loadingScene || (Fire.AssetLibrary.clearAllCache(), Fire.Engine._loadSceneByUuid(b, null, function () {
                Fire
                    .Engine
                    .stop()
            }))
        }),
        a.on("asset:moved", function (a) {
            var c = a.uuid,
                d = a["dest-url"],
                e,
                f = Fire
                    .AssetLibrary
                    .getAssetByUuid(c);
            if (f && (e = b.basenameNoExt(d), f.name = e), ".fire" === b.extname(d)) 
                for (var g in Fire.Engine._sceneInfos) 
                    if (Fire.Engine._sceneInfos[g] === c) {
                        delete Fire.Engine._sceneInfos[g],
                        e = b.basenameNoExt(d),
                        Fire.Engine._sceneInfos[e] = c;
                        break
                    }
                }),
        a.on("assets:deleted", function (a) {
            for (var c = a.results, d = 0; d < c.length; ++d) {
                var e = Fire
                    .AssetLibrary
                    .getCachedAsset(c[d].uuid);
                if (e) 
                    if (e instanceof Fire._Scene) {
                        var f = b.basenameNoExt(c[d].url);
                        delete Fire.Engine._sceneInfos[f]
                    } else 
                        Fire
                            .AssetLibrary
                            .unloadAsset(e, !0)
                }
        }),
        a.on("asset:changed", function (a) {
            var b = a.uuid;
            Fire
                .AssetLibrary
                .onAssetReimported(b)
        }),
        a.on("asset:created", function (a) {
            var c = a.url,
                d = a.uuid;
            if (".fire" === b.extname(c)) {
                var e = b.basenameNoExt(c);
                Fire.Engine._sceneInfos[e] = d
            }
        }),
        a.on("assets:created", function (a) {
            for (var c = a.results, d = 0; d < c.length; ++d) {
                var e = c[d];
                if (".fire" === b.extname(e.url)) {
                    var f = b.basenameNoExt(e.url);
                    Fire.Engine._sceneInfos[f] = e.uuid
                }
            }
        })
    }
}(),
function () {
    function a(a, b, c) {
        a
            .on(b, function () {
                var a = {};
                arguments.length > 0 && (a = arguments[0]),
                c.fire(b, a)
            });
        var d = c[b];
        d && c.addEventListener(b, d.bind(c))
    }
    function b(a, b, c) {
        c.save = function () {
            Editor.sendToCore("panel:save-profile", {
                id: a,
                type: b,
                profile: c
            })
        }
    }
    var c = {},
        d = {};
    _getPanels = function (a) {
        for (var b = [], c = 0; c < a.childElementCount; ++c) {
            var d = a.children[c],
                e = d.getAttribute("id");
            b.push(e)
        }
        return b
    },
    _getDocks = function (a) {
        for (var b = [], c = 0; c < a.childElementCount; ++c) {
            var d = a.children[c];
            if (d instanceof FireDock) {
                var e = d.getBoundingClientRect(),
                    f = {
                        row: d.row,
                        width: e.width,
                        height: e.height
                    };
                d instanceof FirePanel
                    ? (f.type = "panel", f.panels = _getPanels(d))
                    : (f.type = "dock", f.docks = _getDocks(d)),
                b.push(f)
            }
        }
        return b
    },
    Editor.Panel = {
        "import": function (a, b) {
            var c = d[a];
            c && (c.remove(), delete d[a]),
            c = document.createElement("link"),
            c.rel = "import",
            c.href = a,
            c.onload = b,
            c.onerror = function (a) {
                Editor.error("Failed to import %s", c.href)
            },
            document
                .head
                .appendChild(c),
            d[a] = c
        },
        load: function (d, e, f, g) {
            Polymer["import"]([d], function () {
                var d = window[f.ctor];
                if (!d) 
                    return void Fire.error("Panel import faield. Can not find constructor %s", f.ctor);
                var h = new d;
                h.setAttribute("id", e),
                h.setAttribute("name", f.title),
                h.setAttribute("fit", ""),
                f.width && h.setAttribute("width", f.width),
                f.height && h.setAttribute("height", f.height),
                f["min-width"] && h.setAttribute("min-width", f["min-width"]),
                f["min-height"] && h.setAttribute("min-height", f["min-height"]),
                f["max-width"] && h.setAttribute("max-width", f["max-width"]),
                f["max-height"] && h.setAttribute("max-height", f["max-height"]);
                for (var i = new Editor.IpcListener, j = 0; j < f.messages.length; ++j) 
                    a(i, f.messages[j], h);
                c[e] = {
                    element: h,
                    messages: f.messages,
                    ipcListener: i
                },
                Editor.sendToCore("panel:dock", e, Editor.requireIpcEvent),
                h.profiles = f.profiles;
                for (var k in f.profiles) 
                    b(e, k, f.profiles[k]);
                g(null, h)
            })
        },
        closeAll: function () {
            for (var a in c) 
                Editor.Panel.close(a)
        },
        close: function (a) {
            var b = c[a];
            b && (b.ipcListener.clear(), delete c[a]),
            Editor.sendToCore("panel:undock", a, Editor.requireIpcEvent)
        },
        dispatch: function (a, b) {
            var d = c[a];
            if (!d) 
                return void Fire.warn("Failed to receive ipc %s, can not find panel %s", b, a);
            var e = d
                .messages
                .indexOf(b);
            if (-1 !== e) {
                var f = {};
                arguments.length > 2 && (f = arguments[2]),
                d
                    .element
                    .fire(b, f)
            }
        },
        getLayout: function () {
            var a = EditorUI.DockUtils.root;
            if (a instanceof FireDock) 
                return {
                    type: "dock",
                    row: a.row,
                    "no-collapse": !0,
                    docks: _getDocks(a)
                };
            var b = a.getAttribute("id"),
                c = a.getBoundingClientRect();
            return {type: "standalone", panel: b, width: c.width, height: c.height}
        }
    }
}(),
function () {
    function a() {
        Editor
            ._PluginLoaderBase
            .apply(this, arguments)
    }
    var b = require("path");
    Fire
        .JS
        .extend(a, Editor._PluginLoaderBase),
    a.prototype.onAfterUnload = function () {
        Editor
            ._Sandbox
            .reloadScripts(!0)
    },
    a.prototype._loadImpl = function (c) {
        a
            .parseMeta(c, function (a) {
                function d(d) {
                    if (a[d]) {
                        var e = b.resolve(c.path, a[d]),
                            f;
                        try {
                            f = require(e)
                        } catch (g) {
                            return Fire.error("Failed to load %s script from %s.\n%s", d, e, g),
                            null
                        }
                        return f
                    }
                }
                function e(a) {
                    var b = d(a);
                    b && (meta.prototype[a] = b)
                }
                console.assert(a.meta),
                console.assert(a.pattern),
                d("meta")
            })
    },
    a.prototype._unloadImpl = function (c) {
        var d = Editor._Sandbox.nodeJsRequire.cache;
        a.parseMeta(c, function (a) {
            var e = ["meta"];
            for (var f in e) {
                var g = e[f];
                if (a[g]) {
                    var h = b.resolve(c.path, a[g]);
                    delete d[h]
                }
            }
        })
    };
    var c = require("ipc"),
        d = "plugin:load",
        e = "plugin:unload";
    Editor._builtinPluginLoader = new a("editor-window builtin plugins"),
    Editor._globalPluginLoader = new a("editor-window global plugins"),
    Editor._projectPluginLoader = new a("editor-window project plugins");
    var f = {
        "builtin plugins": Editor._builtinPluginLoader,
        "global plugins": Editor._globalPluginLoader,
        "project plugins": Editor._projectPluginLoader
    };
    c.on(d, function (a, b, c) {
        var d = f[c];
        d
            ? d.load(a, b)
            : Fire.error("Unknown plugin type to load", c)
    }),
    c.on(e, function (a, b) {
        var c = f[b];
        c
            ? c.unload(a)
            : Fire.error("Unknown plugin type to unload", b)
    })
}(),
function () {
    function a(a) {
        var b = a.lastIndexOf("\n");
        if (-1 === b) 
            return a.trim();
        var c = a
            .substring(b)
            .trim();
        return c || (b = a.lastIndexOf("\n", b - 1), c = a.substring(b).trim()),
        c
    }
    function b(a) {
        return window.atob(a)
    }
    function c(a, b) {
        var c = a.sources;
        console.log("resolving: " + c);
        var d = require("remote"),
            f = d.getGlobal("Editor"),
            h = f.cwd;
        h = e.resolve(h, "../");
        for (var i = e.basename(h), j = 0; j < c.length; j++) {
            var k = c[j];
            k = k.replace(/\.\.\//g, ""),
            k = k.replace(/\.\.\\/g, ""),
            0 === k.indexOf(i) && (k = k.substring(i.length + 1));
            var l = 0;
            0 === k.indexOf("assets")
                ? (k = k.substring("assets".length + 1), l = g)
                : 0 === k.indexOf("builtin")
                    ? (k = "fire://builtin/*/" + k.substring("builtin".length + 1), l = g)
                    : 0 === k.indexOf("bin")
                        ? k = "fire://" + k.substring("bin".length + 1)
                        : 0 === k.indexOf("app") && (k = "fire://" + k.substring("app".length + 1)),
            c[j] = k,
            b[k] = {
                lineOffset: l
            }
        }
    }
    var d = require("fire-fs"),
        e = require("fire-path"),
        f = require("source-map").SourceMapConsumer,
        g = -3,
        h = "    ",
        i = "InTryCatch",
        j = {},
        k = {
            _srcMaps: j,
            loadFromSourceComment: function (c) {
                var d = "//# sourceMappingURL=data:application/json;base64,",
                    e = a(c);
                if (!e) 
                    throw "file is empty";
                if (e.substring(0, d.length) !== d) 
                    throw "unknown syntax";
                var f = e.substring(d.length),
                    g = b(f);
                if (!g) 
                    throw "can not decode from base64";
                return JSON.parse(g)
            },
            loadFromFileComment: function (a, b) {
                d
                    .readFile(a, function (a, c) {
                        if (a) 
                            return b();
                        var d = c.toString(),
                            e;
                        try {
                            e = k.loadFromSourceComment(d)
                        } catch (f) {
                            return b(f)
                        }
                        b(null, e)
                    })
            },
            loadSrcMap: function (a, b, d) {
                this
                    .loadFromFileComment(a, function (e, g) {
                        if (e) 
                            return d();
                        var h = g.sourcesContent;
                        g.sourcesContent = void 0;
                        var i = {};
                        c(g, i);
                        var k = null;
                        try {
                            k = new f(g)
                        } catch (l) {
                            return Fire.error("Failed to load source map from %s, %s", a, l),
                            d()
                        }
                        for (var m = 0; m < h.length; m++) {
                            var n = h[m],
                                o = n
                                    .split("\n")
                                    .map(function (a) {
                                        return a.trim()
                                    }),
                                p = g.sources[m];
                            i[p].lines = o
                        }
                        j[b] = {
                            smc: k,
                            sources: i
                        },
                        d()
                    })
            },
            resolveStack: function (a) {
                var b = "    at ",
                    c = ")".charCodeAt(0),
                    d = a.split("\n"),
                    e = !1,
                    f,
                    g;
                for (f = d.length - 1; f >= 0; f--) 
                    if (g = d[f], 0 === g.indexOf(b) && g.charCodeAt(g.length - 1) === c) {
                        var k = g.indexOf(" ", b.length),
                            l = k - i.length,
                            m = g.lastIndexOf(i, k - 1) === l;
                        if (m) {
                            d.length = f;
                            break
                        }
                    }
                for (f = 0; f < d.length; f++) 
                    if (g = d[f], 0 === g.indexOf(b) && g.charCodeAt(g.length - 1) === c) {
                        var n = g.lastIndexOf(" (");
                        if (-1 === n) 
                            continue;
                        var o = g.substring(n + 2, g.length - 1),
                            p = o.lastIndexOf(":");
                        if (-1 === p) 
                            continue;
                        var q = o.substring(p + 1),
                            r = parseInt(q);
                        if (isNaN(r)) 
                            continue;
                        if (p = o.lastIndexOf(":", p - 1), -1 === p) 
                            continue;
                        var s = o.substring(p + 1),
                            t = parseInt(s);
                        if (isNaN(t)) 
                            continue;
                        var u = o.lastIndexOf("?", p - 1);
                        p = -1 !== u
                            ? u
                            : p;
                        var v = o.substring(0, p),
                            w = j[v];
                        if (w) {
                            var x = w.smc,
                                y = x.originalPositionFor({line: t, column: r}),
                                z = y.source;
                            if (z) {
                                var A = w.sources[z],
                                    B;
                                if (e) 
                                    B = g.substring(0, n + 2);
                                else {
                                    var C = y.line - 1;
                                    B = g.substring(0, n) + ': "' + A.lines[C] + '" (',
                                    e = !0
                                }
                                var D = y.line + A.lineOffset;
                                d[f] = y.column
                                    ? h + B + z + ":" + D + ":" + y.column + ")"
                                    : h + B + z + ":" + D + ")";
                                continue
                            }
                        }
                        d[f] = h + d[f]
                    }
                return d.join("\n")
            }
        };
    Editor._SourceMap = k
}(),
function () {
    var a = require("fire-url"),
        b = require("async"),
        c = function () {
            function a(a) {
                this._snapshot = {};
                var c = b.concat(a);
                this.ignoreNames = c.reduce(function (a, b) {
                    return a[b] = !0,
                    a
                }, {})
            }
            var b = [
                    "webkitIndexedDB", "webkitStorageInfo", "mixpanel", "analytics"
                ],
                c = window;
            return a.prototype = {
                record: function () {
                    this._snapshot = {};
                    for (var a in c) 
                        c.hasOwnProperty(a) && !this.ignoreNames[a] && (this._snapshot[a] = c[a]);
                    return this
                },
                restore: function (a, b, d) {
                    console.assert(Object.keys(this._snapshot).length > 0, "Should recorded");
                    var e;
                    for (e in c) 
                        if (c.hasOwnProperty(e) && !this.ignoreNames[e]) {
                            var f = c[e];
                            if (e in this._snapshot) {
                                var g = this._snapshot[e],
                                    h = typeof g;
                                "object" !== h && "function" !== h || f === g || (e !== d
                                    ? (a && a("Modified global variable while %s: %s\nBefore: %s\nAfter: %s", b, e, g, c[e]), c[e] = g)
                                    : this._snapshot[e] = f)
                            } else if (e !== d) {
                                Fire.error("Introduced global variable while %s: %s", b, e);
                                var i = delete c[e];
                                i || (this._snapshot[e] = c[e] = void 0)
                            } else 
                                this._snapshot[e] = f
                        }
                    for (e in this._snapshot) 
                        e in c || (e !== d
                            ? (a && a("Deleted global variable while " + b + ": " + e), c[e] = this._snapshot[e])
                            : delete this._snapshot[e])
                    }
            },
            a
        }(),
        d = function () {
            function a(a) {
                return Fire.instantiate(a)
            }
            function b() {
                Fire
                    .FObject
                    ._deferredDestroy()
            }
            function c(a) {
                var b = Editor.serialize(a, {
                        stringify: !1
                    }),
                    c = new Fire._DeserializeInfo;
                Fire.Engine._canModifyCurrentScene = !1;
                var d = Fire.deserialize(b, c, {classFinder: Fire._MissingScript.safeFindClass});
                return Fire.Engine._canModifyCurrentScene = !0,
                e
                    .globalVarsChecker
                    .restore(Fire.log, "deserializing scene by new scripts"),
                d._uuid = a._uuid,
                d._uuid && Fire
                    .AssetLibrary
                    .replaceAsset(d),
                c.assignAssetsBy(Fire.AssetLibrary.getAssetByUuid) || Fire.error("Failed to assign asset to recreated scene, this can be caused by forgetting the " +
                        "call to AssetLibrary.cacheAsset"),
                d
            }
            var d = null,
                e = function () {};
            return e._purgeMemory = b,
            e.globalVarsChecker = null,
            e._launchScene = function (a, b) {
                var c = Editor.Selection.entities,
                    d = [],
                    e;
                for (e = 0; e < c.length; e++) {
                    var f = Editor.getInstanceById(c[e]);
                    f && d.push(f._getIndices())
                }
                for (Fire.Engine._launchScene(a, b), c.length = 0, e = 0; e < d.length; e++) {
                    var g = d[0],
                        h = Fire
                            .Engine
                            ._scene
                            .findEntityByIndices(g);
                    h && c.push(h.id)
                }
                Editor
                    .Selection
                    .selectEntity(c, !1, !0)
            },
            e.stashScene = function (c) {
                b(),
                e
                    .globalVarsChecker
                    .restore(Fire.log, "editing"),
                d = a(Fire.Engine._scene);
                var f = a(Fire.Engine._scene);
                this._launchScene(f, function () {
                    e
                        .globalVarsChecker
                        .restore(Fire.warn, "destroying editing scene"),
                    c && c()
                }),
                e
                    .globalVarsChecker
                    .restore(Fire.warn, "launching playing scene")
            },
            e.rewindScene = function (a) {
                b(),
                e
                    .globalVarsChecker
                    .restore(Fire.warn, "playing");
                for (var c = Fire.Engine._scene.entities, f = Fire._ObjectFlags.DontDestroy, g = 0, h = c.length; h > g; g++) 
                    c[g]._objFlags &=~ f;
                this
                    ._launchScene(d, function () {
                        e
                            .globalVarsChecker
                            .restore(Fire.warn, "destroying playing scene"),
                        a && a()
                    }),
                e
                    .globalVarsChecker
                    .restore(Fire.warn, "launching editing scene"),
                d = null
            },
            e.reloadScene = function () {
                if (d && (console.time("reload stashed scene"), d = c(d), console.time("reload stashed scene")), Fire.Engine._scene) {
                    console.time("reload scene");
                    var a = c(Fire.Engine._scene);
                    e._launchScene(a, function () {
                        e
                            .globalVarsChecker
                            .restore(Fire.log, "destroying last scene")
                    }),
                    e
                        .globalVarsChecker
                        .restore(Fire.warn, "launching scene by new scripts"),
                    console.timeEnd("reload scene")
                }
            },
            e.compiled = !1,
            e
        }(),
        e = function () {
            function b(b, c) {
                var d = document.createElement("script");
                d.onload = function () {
                    console.timeEnd("load " + b),
                    c()
                },
                d.onerror = function () {
                    console.timeEnd("load " + b),
                    n.length > 0 && o.unloadAll(),
                    Fire.error("Failed to load %s", b),
                    c("Failed to load " + b)
                },
                d.setAttribute("type", "text/javascript"),
                d.setAttribute("src", a.addRandomQuery(b)),
                console.time("load " + b),
                document
                    .head
                    .appendChild(d),
                n.push(d)
            }
            function c(a, c, e, f) {
                function g() {
                    console.time("load source map of " + a),
                    Editor
                        ._SourceMap
                        .loadSrcMap(c, a, function () {
                            console.timeEnd("load source map of " + a)
                        })
                }
                b(a, function (a) {
                    d
                        .globalVarsChecker
                        .restore(Fire.log, e, "require"),
                    f(a),
                    a || g()
                })
            }
            var e = "bundle.builtin.js",
                f = "bundle.project.js",
                g = "library://" + e,
                h = "library://" + f,
                i = require("remote"),
                j = require("path"),
                k = i
                    .getGlobal("Editor")
                    .projectPath,
                l = j.join(k, "library", e),
                m = j.join(k, "library", f),
                n = [],
                o = {
                    loadBuiltin: function (a) {
                        c(g, l, "loading builtin plugin runtime", a)
                    },
                    loadProject: function (a) {
                        c(h, m, "loading new scripts", a)
                    },
                    unloadAll: function () {
                        for (var a = 0; a < n.length; a++) {
                            var b = n[a];
                            b.remove()
                        }
                        n.length = 0
                    },
                    name: "common scripts"
                };
            return o
        }();
    d.reloadScripts = function () {
        function a() {
            l = !0,
            d.globalVarsChecker = (new c).record(),
            d.nodeJsRequire = require,
            h = Fire.JS._registeredClassIds,
            i = Fire.JS._registeredClassNames,
            j = Fire
                ._componentMenuItems
                .slice(),
            k = Fire
                ._customAssetMenuItems
                .slice()
        }
        function f() {
            d._purgeMemory(),
            Fire._componentMenuItems = j.slice(),
            Fire._customAssetMenuItems = k.slice(),
            Editor
                .MainMenu
                .reset(),
            Fire.JS._registeredClassIds = h,
            Fire.JS._registeredClassNames = i,
            Fire
                .LoadManager
                .reset(),
            require = d.nodeJsRequire,
            d
                .globalVarsChecker
                .restore(Fire.log, "purging", "require"),
            Fire._requiringStack = []
        }
        function g(c, g) {
            d.compiled = c;
            var h = l;
            if (l || a(), d.globalVarsChecker.restore(Fire.log, "editing"), h) {
                for (var i = [
                    e, Editor._builtinPluginLoader, Editor._globalPluginLoader, Editor._projectPluginLoader
                ], j = i.length - 1; j >= 0; j--) 
                    i[j].unloadAll(),
                    d.globalVarsChecker.restore(Fire.warn, "unloading " + i[j].name);
                f()
            }
            var k,
                m;
            b.parallel([
                function (a) {
                    function b() {
                        Editor
                            ._builtinPluginLoader
                            .loadAll(function (b) {
                                d
                                    .globalVarsChecker
                                    .restore(Fire.warn, "loading " + Editor._builtinPluginLoader.name),
                                a()
                            })
                    }
                    e
                        .loadBuiltin(function (c) {
                            c
                                ? a()
                                : (b(), k(), m())
                        })
                },
                function (a) {
                    k = function () {
                        Editor
                            ._globalPluginLoader
                            .loadAll(function (b) {
                                d
                                    .globalVarsChecker
                                    .restore(Fire.warn, "loading " + Editor._globalPluginLoader.name),
                                a()
                            })
                    }
                },
                function (a) {
                    m = function () {
                        b.series([
                            function (a) {
                                e
                                    .loadProject(function (b) {
                                        a(b),
                                        b || d.reloadScene()
                                    })
                            },
                            function (a) {
                                Editor
                                    ._projectPluginLoader
                                    .loadAll(function (b) {
                                        d
                                            .globalVarsChecker
                                            .restore(Fire.warn, "loading " + Editor._projectPluginLoader.name),
                                        a()
                                    })
                            }
                        ], a)
                    }
                }
            ], g)
        }
        var h,
            i,
            j,
            k,
            l = !1;
        return g
    }(),
    Editor._Sandbox = d
}(),
function () {
    var a = require("remote"),
        b = a.getGlobal("ASSET_DB");
    Editor.AssetDB = {
        get _libraryPath() {
            return b._libraryPath
        },
        _fspath: function (a) {
            return b._fspath(a)
        },
        isValidUuid: function (a) {
            return b.isValidUuid(a)
        },
        urlToUuid: function (a) {
            return b.urlToUuid(a)
        },
        loadMetaJson: function (a) {
            return b.loadMetaJson(a)
        },
        uuidToUrl: function (a) {
            return b.uuidToUrl(a)
        },
        explore: function (a) {
            Editor.sendToCore("asset-db:explore", {url: a})
        },
        exploreLib: function (a) {
            Editor.sendToCore("asset-db:explore-lib", {url: a})
        },
        "import": function (a, b) {
            Editor.sendToCore("asset-db:import", {
                "dest-url": a,
                files: b
            })
        },
        reimport: function (a) {
            Editor.sendToCore("asset-db:reimport", {url: a})
        },
        "delete": function (a) {
            Editor.sendToCore("asset-db:delete", {url: a})
        },
        move: function (a, b) {
            Editor.sendToCore("asset-db:move", {
                "src-url": a,
                "dest-url": b
            })
        },
        save: function (a, b, c) {
            Editor.sendToCore("asset-db:save", {
                url: a,
                json: b,
                buffer: c
            })
        },
        saveByUuid: function (a, b, c) {
            Editor.sendToCore("asset-db:save-by-uuid", {
                uuid: a,
                json: b,
                buffer: c
            })
        },
        newFolder: function (a) {
            Editor.sendToCore("asset-db:new-folder", {url: a})
        },
        newScript: function (a, b) {
            Editor.sendToCore("asset-db:new-script", {
                url: a,
                template: b
            })
        },
        apply: function (a) {
            Editor.sendToCore("asset-db:apply", a)
        },
        query: function (a, b, c) {
            b = Fire
                .JS
                .mixin(b || {}, {url: a}),
            Editor.sendRequestToCore("asset-db:query", b, c)
        },
        deepQuery: function (a, b) {
            Editor.sendRequestToCore("asset-db:deep-query", {
                url: a
            }, b)
        },
        generateUniqueUrl: function (a, b) {
            Editor.sendRequestToCore("asset-db:generate-unique-url", {
                url: a
            }, b)
        }
    }
}(),
function () {
    function a(b) {
        for (var c = 0; c < b.length; c++) {
            var d = b[0];
            if (d.click) 
                return Fire.error("Not support to use click in web-side menu declaration, it may caused dead lock d" +
                        "ue to ipc problem of atom-shell"),
                !1;
            if (d.submenu && !a(d.submenu)) 
                return !1
        }
        return !0
    }
    Editor.MainMenu = {},
    Editor.MainMenu.addItem = function (a, b, c, d) {
        Editor.sendToCore("main-menu:add-item", a, b, c, {
            priority: d,
            type: "window-dynamic"
        }, Editor.requireIpcEvent)
    },
    Editor.MainMenu.reset = function () {
        Editor.sendToCore("main-menu:reset", "window-dynamic")
    },
    Editor.MainMenu.addTemplate = function (b, c, d) {
        a(c) && (d = d || {}, d.type = d.type || "window-dynamic", Editor.sendToCore("main-menu:add-template", b, c, d, Editor.requireIpcEvent))
    },
    Editor.popupMenu = function (a, b, c) {
        Editor.sendToCore("menu:popup", a, b, c, Editor.requireIpcEvent)
    }
}(),
function () {
    function a(a) {
        return Math.floor(a)
    }
    function b(a) {
        return 1 === a
            ? 1
            : 1.001 * (1 - Math.pow(2, -10 * a))
    }
    function c() {
        this.view = {
            width: 0,
            height: 0
        }
    }
    c.prototype.setGraphics = function (a) {
        this.graphics = a
    },
    c.prototype.setCamera = function (a) {
        this.camera = a
    },
    c.prototype.resize = function (a, b) {
        this.view.width = a,
        this.view.height = b
    },
    c.prototype.update = function () {
        var c = 0,
            d = 100,
            e = 10,
            f = 50,
            g = 1,
            h = d,
            i = 1,
            j,
            k = {
                position: {
                    x: this.camera.transform.position.x,
                    y: this.camera.transform.position.y
                },
                scale: this.view.height / this.camera.size,
                screenToWorld: this
                    .camera
                    .screenToWorld
                    .bind(this.camera),
                worldToScreen: this
                    .camera
                    .worldToScreen
                    .bind(this.camera)
            };
        if (k.scale >= 1) {
            for (; f * g < d * k.scale;) 
                g *= e;
            h = d / g * e,
            i = d * k.scale / (f * g)
        } else if (k.scale < 1) {
            for (; f / g > d * k.scale;) 
                g *= e;
            h = d * g,
            i = d * k.scale / (f / g),
            i /= 10
        }
        i = (i - 1 / e) / (1 - 1 / e);
        var l = k.screenToWorld(new Fire.Vec2(0, 0)),
            m = k.screenToWorld(new Fire.Vec2(this.view.width, this.view.height)),
            n = Math.ceil(l.x / h) * h,
            o = m.x,
            p = Math.ceil(m.y / h) * h,
            q = l.y;
        this
            .graphics
            .clear(),
        this
            .graphics
            .beginFill(5592405);
        for (var r = Math.round(n / h), s = n; o > s; s += h) 
            r % e === 0
                ? this.graphics.lineStyle(1, 5592405, 1)
                : this.graphics.lineStyle(1, 5592405, b(i)),
            ++r,
            j = k.worldToScreen(new Fire.Vec2(s, 0)),
            this.graphics.moveTo(a(j.x), -1),
            this.graphics.lineTo(a(j.x), this.view.height);
        r = Math.round(p / h);
        for (var t = p; q > t; t += h) 
            r % e === 0
                ? this.graphics.lineStyle(1, 5592405, 1)
                : this.graphics.lineStyle(1, 5592405, b(i)),
            ++r,
            j = k.worldToScreen(new Fire.Vec2(0, t)),
            this.graphics.moveTo(0, a(j.y)),
            this.graphics.lineTo(this.view.width, a(j.y));
        this
            .graphics
            .endFill()
    },
    Editor.PixiGrids = c
}(),
function () {
    function a(a) {
        return 1 === a
            ? 1
            : 1.001 * (1 - Math.pow(2, -10 * a))
    }
    function b(a) {
        this.svg = SVG(a);
        var b = this
            .svg
            .group();
        b.addClass("x-axis"),
        this.xaxis = b;
        var c = this
            .svg
            .group();
        c.addClass("y-axis"),
        this.yaxis = c,
        this.xlines = [],
        this.ylines = [],
        this.view = {
            width: 0,
            height: 0
        }
    }
    b.prototype.setCamera = function (a) {
        this.camera = a
    },
    b.prototype.resize = function (a, b) {
        this
            .svg
            .size(a, b),
        this.view.width = a,
        this.view.height = b
    },
    b.prototype.update = function () {
        var b = 0,
            c = 0,
            d = null,
            e = this.xlines,
            f = this.ylines,
            g = this.xaxis,
            h = this.yaxis,
            i = 100,
            j = 10,
            k = 50,
            l = 1,
            m = i,
            n = 1,
            o,
            p = {
                position: {
                    x: this.camera.transform.position.x,
                    y: this.camera.transform.position.y
                },
                scale: this.view.height / this.camera.size,
                screenToWorld: this
                    .camera
                    .screenToWorld
                    .bind(this.camera),
                worldToScreen: this
                    .camera
                    .worldToScreen
                    .bind(this.camera)
            };
        if (p.scale >= 1) {
            for (; k * l < i * p.scale;) 
                l *= j;
            m = i / l * j,
            n = i * p.scale / (k * l)
        } else if (p.scale < 1) {
            for (; k / l > i * p.scale;) 
                l *= j;
            m = i * l,
            n = i * p.scale / (k / l),
            n /= 10
        }
        n = (n - 1 / j) / (1 - 1 / j);
        for (var q = p.screenToWorld(new Fire.Vec2(0, 0)), r = p.screenToWorld(new Fire.Vec2(this.view.width, this.view.height)), s = Math.ceil(q.x / m) * m, t = r.x, u = Math.ceil(r.y / m) * m, v = q.y, w = Math.round(s / m), x = s; t > x; x += m) 
            c < e.length
                ? d = e[c]
                : (d = this.svg.line(0, 0, 0, this.view.height), e.push(d), g.add(d)),
            ++c,
            d.opacity(w % j === 0
                ? 1
                : a(n)),
            ++w,
            o = p.worldToScreen(new Fire.Vec2(x, 0)),
            o.y = 0,
            d.plot(0, 0, 0, this.view.height).stroke("#555").transform(o);
        for (b = c; b < e.length; ++b) 
            e[b].remove();
        e.splice(c),
        c = 0,
        w = Math.round(u / m);
        for (var y = u; v > y; y += m) 
            c < f.length
                ? d = f[c]
                : (d = this.svg.line(0, 0, this.view.width, 0), f.push(d), h.add(d)),
            ++c,
            d.opacity(w % j === 0
                ? 1
                : a(n)),
            ++w,
            o = p.worldToScreen(new Fire.Vec2(0, y)),
            o.x = 0,
            d.plot(0, 0, this.view.width, 0).stroke("#555").transform(o);
        for (b = c; b < f.length; ++b) 
            f[b].remove();
        f.splice(c)
    },
    Editor.SvgGrids = b
}(),
function () {
    var a = {};
    a.snapPixel = function (a) {
        return Math.floor(a) + .5
    },
    a.getCenter = function (a) {
        for (var b = null, d = null, e = null, f = null, g = 0; g < a.length; ++g) {
            var h,
                i = a[g],
                j = !1;
            for (c = 0; c < i._components.length; ++c) {
                var k = i._components[c];
                if (k instanceof Fire.Renderer) {
                    for (var l = k.getWorldOrientedBounds(), m = 0; m < l.length; ++m) 
                        h = l[m],
                        (null === b || h.x < b) && (b = h.x),
                        (null === e || h.x > e) && (e = h.x),
                        (null === d || h.y < d) && (d = h.y),
                        (null === f || h.y > f) && (f = h.y);
                    j = !0;
                    break
                }
            }
            j || (h = i.transform.worldPosition, (!b || h.x < b) && (b = h.x), (!e || h.x > e) && (e = h.x), (!d || h.y < d) && (d = h.y), (!f || h.y > f) && (f = h.y))
        }
        var n = .5 * (b + e),
            o = .5 * (d + f);
        return new Fire.Vec2(n, o)
    },
    Editor.GizmosUtils = a
}(),
function () {
    function a(a, b) {
        var c,
            d,
            e = function (e) {
                var f = e.clientX - c,
                    g = e.clientY - d;
                b.update && b
                    .update
                    .call(a, f, g),
                e.stopPropagation()
            }.bind(a),
            f = function (c) {
                document.removeEventListener("mousemove", e),
                document.removeEventListener("mouseup", f),
                EditorUI.removeDragGhost(),
                b.end && b
                    .end
                    .call(a),
                c.stopPropagation()
            }.bind(a);
        a.on("mousedown", function (g) {
            1 === g.which && (c = g.clientX, d = g.clientY, EditorUI.addDragGhost("default"), document.addEventListener("mousemove", e), document.addEventListener("mouseup", f), b.start && b.start.call(a, g.offsetX, g.offsetY)),
            g.stopPropagation()
        })
    }
    function b(a) {
        this.svg = SVG(a),
        this.view = {
            width: 0,
            height: 0
        },
        this.gizmos = [],
        this.gizmosTable = {},
        this.scene = this
            .svg
            .group(),
        this.foreground = this
            .svg
            .group()
    }
    b.prototype.setCamera = function (a) {
        this.camera = a
    },
    b.prototype.resize = function (a, b) {
        this
            .svg
            .size(a, b),
        this.view = {
            width: a,
            height: b
        }
    },
    b.prototype.update = function () {
        for (var a = 0; a < this.gizmos.length; ++a) {
            var b = this.gizmos[a];
            b.update()
        }
    },
    b.prototype.add = function (a, b) {
        a && (this.gizmosTable[a] = b),
        this
            .gizmos
            .push(b)
    },
    b.prototype.remove = function (a, b) {
        a && delete this.gizmosTable[a];
        for (var c = this.gizmos.length - 1; c >= 0; --c) {
            var d = this.gizmos[c];
            if (d === b) {
                d.remove(),
                this
                    .gizmos
                    .splice(c, 1);
                break
            }
        }
    },
    b.prototype.hitTest = function (a, b, c, d) {
        var e = this
            .svg
            .node
            .createSVGRect();
        e.x = a,
        e.y = b,
        e.width = c,
        e.height = d;
        var f = this
                .svg
                .node
                .getIntersectionList(e, null),
            g = [];
        if (f.length > 0) 
            for (var h = 0; h < this.gizmos.length; ++h) {
                var i = this.gizmos[h];
                i.hitTest && i.contains(f) && g.push(i)
            }
        return g
    },
    b.prototype.updateSelection = function (a, b, c, d) {
        this.selectRect || (this.selectRect = this.foreground.rect()),
        this
            .selectRect
            .move(Editor.GizmosUtils.snapPixel(a), Editor.GizmosUtils.snapPixel(b))
            .size(c, d)
            .fill({color: "#09f", opacity: .4})
            .stroke({width: 1, color: "#09f", opacity: 1})
    },
    b.prototype.fadeoutSelection = function () {
        this.selectRect && (this.selectRect.animate(100, "-").opacity(0).after(function () {
            this.remove()
        }.bind(this.selectRect)), this.selectRect = null)
    },
    b.prototype.icon = function (a, b, c, d) {
        var e = this
            .scene
            .image(a)
            .move(.5 * -b, .5 * -c)
            .size(b, c);
        return e.on("mousemove", function (a) {
            a.stopPropagation()
        }),
        e.on("mouseover", function (a) {
            a.stopPropagation();
            var b = new CustomEvent("gizmoshover", {
                detail: {
                    entity: d
                }
            });
            this
                .node
                .dispatchEvent(b)
        }),
        e.on("mouseout", function (a) {
            a.stopPropagation()
        }),
        e
    },
    b.prototype.scaleSlider = function (b, c, d) {
        var e = this
                .scene
                .group(),
            f = e
                .line(0, 0, b, 0)
                .stroke({width: 1, color: c}),
            g = e.polygon([
                [
                    b, 5
                ],
                [
                    b, -5
                ],
                [
                    b + 10,
                    -5
                ],
                [
                    b + 10,
                    5
                ]
            ]).fill({color: c}),
            h = !1;
        return e.style("pointer-events", "bounding-box"),
        e.resize = function (a) {
            f.plot(0, 0, a, 0),
            g.plot([
                [
                    a, 5
                ],
                [
                    a, -5
                ],
                [
                    a + 10,
                    -5
                ],
                [
                    a + 10,
                    5
                ]
            ])
        },
        e.on("mousemove", function (a) {
            a.stopPropagation()
        }),
        e.on("mouseover", function (a) {
            var b = chroma(c)
                .brighter()
                .hex();
            f.stroke({color: b}),
            g.fill({color: b}),
            a.stopPropagation(),
            this
                .node
                .dispatchEvent(new CustomEvent("gizmoshover", {
                    detail: {
                        entity: null
                    }
                }))
        }),
        e.on("mouseout", function (a) {
            h || (f.stroke({color: c}), g.fill({color: c})),
            a.stopPropagation()
        }),
        a(e, {
            start: function () {
                h = !0,
                f.stroke({color: "#ff0"}),
                g.fill({color: "#ff0"}),
                d.start && d.start()
            },
            update: function (a, b) {
                d.update && d.update(a, b)
            },
            end: function () {
                h = !1,
                f.stroke({color: c}),
                g.fill({color: c}),
                d.end && d.end()
            }
        }),
        e
    },
    b.prototype.freemoveTool = function (b, c, d) {
        var e = !1,
            f = this
                .svg
                .circle(b, b)
                .move(.5 * -b, .5 * -b)
                .fill({color: c, opacity: .6})
                .stroke({width: 2, color: c});
        return f.on("mousemove", function (a) {
            a.stopPropagation()
        }),
        f.on("mouseover", function (a) {
            var b = chroma(c)
                .brighter()
                .hex();
            this
                .fill({color: b})
                .stroke({color: b}),
            a.stopPropagation(),
            this
                .node
                .dispatchEvent(new CustomEvent("gizmoshover", {
                    detail: {
                        entity: null
                    }
                }))
        }),
        f.on("mouseout", function (a) {
            e || this
                .fill({color: c})
                .stroke({color: c}),
            a.stopPropagation()
        }),
        a(f, {
            start: function (a, b) {
                e = !0,
                this
                    .fill({color: "#cc5"})
                    .stroke({color: "#cc5"}),
                d.start && d.start(a, b)
            },
            update: function (a, b) {
                d.update && d.update(a, b)
            },
            end: function () {
                e = !1,
                this
                    .fill({color: c})
                    .stroke({color: c}),
                d.end && d.end()
            }
        }),
        f
    },
    b.prototype.arrowTool = function (b, c, d) {
        var e = this
                .scene
                .group(),
            f = e
                .line(0, 0, b, 0)
                .stroke({width: 1, color: c}),
            g = e.polygon([
                [
                    b, 5
                ],
                [
                    b, -5
                ],
                [
                    b + 15,
                    0
                ]
            ]).fill({color: c}),
            h = !1;
        return e.style("pointer-events", "bounding-box"),
        e.on("mousemove", function (a) {
            a.stopPropagation()
        }),
        e.on("mouseover", function (a) {
            var b = chroma(c)
                .brighter()
                .hex();
            f.stroke({color: b}),
            g.fill({color: b}),
            a.stopPropagation(),
            this
                .node
                .dispatchEvent(new CustomEvent("gizmoshover", {
                    detail: {
                        entity: null
                    }
                }))
        }),
        e.on("mouseout", function (a) {
            h || (f.stroke({color: c}), g.fill({color: c})),
            a.stopPropagation()
        }),
        a(e, {
            start: function () {
                h = !0,
                f.stroke({color: "#ff0"}),
                g.fill({color: "#ff0"}),
                d.start && d.start()
            },
            update: function (a, b) {
                d.update && d.update(a, b)
            },
            end: function () {
                h = !1,
                f.stroke({color: c}),
                g.fill({color: c}),
                d.end && d.end()
            }
        }),
        e
    },
    b.prototype.positionTool = function (b) {
        var c = this
                .scene
                .group(),
            d,
            e,
            f;
        c.position = new Fire.Vec2(0, 0),
        c.rotation = 0,
        d = this.arrowTool(80, "#f00", {
            start: function () {
                b.start && b
                    .start
                    .call(c)
            },
            update: function (a, d) {
                var e = Math.deg2rad(c.rotation),
                    f = Math.cos(e),
                    g = Math.sin(e),
                    h = Math.sqrt(a * a + d * d),
                    i = Math.atan2(g, f) - Math.atan2(d, a);
                h *= Math.cos(i),
                b.update && b
                    .update
                    .call(c, f * h, g * h)
            },
            end: function () {
                b.end && b
                    .end
                    .call(c)
            }
        }),
        d.translate(20, 0),
        c.add(d),
        e = this.arrowTool(80, "#5c5", {
            start: function () {
                b.start && b
                    .start
                    .call(c)
            },
            update: function (a, d) {
                var e = Math.deg2rad(c.rotation + 90),
                    f = Math.cos(e),
                    g = Math.sin(e),
                    h = Math.sqrt(a * a + d * d),
                    i = Math.atan2(g, f) - Math.atan2(d, a);
                h *= Math.cos(i),
                b.update && b
                    .update
                    .call(c, f * h, g * h)
            },
            end: function () {
                b.end && b
                    .end
                    .call(c)
            }
        }),
        e.translate(20, 0),
        e.rotate(-90, 0, 0),
        c.add(e);
        var g = "#05f",
            h = !1;
        return f = c
            .rect(20, 20)
            .move(0, -20)
            .fill({color: g, opacity: .4})
            .stroke({width: 1, color: g}),
        f.on("mousemove", function (a) {
            a.stopPropagation()
        }),
        f.on("mouseover", function (a) {
            var b = chroma(g)
                .brighter()
                .hex();
            this
                .fill({color: b})
                .stroke({color: b}),
            a.stopPropagation(),
            this
                .node
                .dispatchEvent(new CustomEvent("gizmoshover", {
                    detail: {
                        entity: null
                    }
                }))
        }),
        f.on("mouseout", function (a) {
            h || this
                .fill({color: g})
                .stroke({color: g}),
            a.stopPropagation()
        }),
        a(f, {
            start: function () {
                h = !0,
                this
                    .fill({color: "#cc5"})
                    .stroke({color: "#cc5"}),
                b.start && b
                    .start
                    .call(c)
            },
            update: function (a, d) {
                b.update && b
                    .update
                    .call(c, a, d)
            },
            end: function () {
                h = !1,
                this
                    .fill({color: g})
                    .stroke({color: g}),
                b.end && b
                    .end
                    .call(c)
            }
        }),
        c
    },
    b.prototype.rotationTool = function (b) {
        var c = this
                .scene
                .group(),
            d,
            e,
            f,
            g,
            h,
            i = !1,
            j = "#f00";
        c.position = new Fire.Vec2(0, 0),
        c.rotation = 0,
        d = c
            .path("M50,-10 A50,50, 0 1,0 50,10")
            .fill("none")
            .stroke({width: 2, color: j}),
        g = c
            .path()
            .fill({color: j, opacity: .4})
            .stroke({width: 1, color: j}),
        g.hide();
        var k = 50;
        e = c
            .line(0, 0, k, 0)
            .stroke({width: 1, color: j}),
        f = c.polygon([
            [
                k, 5
            ],
            [
                k, -5
            ],
            [
                k + 15,
                0
            ]
        ]).fill({color: j}),
        h = c
            .text("0")
            .plain("")
            .fill({color: "white"})
            .font({anchor: "middle"})
            .hide()
            .translate(30, 0),
        c.style("pointer-events", "visibleFill"),
        c.on("mousemove", function (a) {
            a.stopPropagation()
        }),
        c.on("mouseover", function (a) {
            var b = chroma(j)
                .brighter()
                .hex();
            d.stroke({color: b}),
            e.stroke({color: b}),
            f.fill({color: b}),
            a.stopPropagation(),
            this
                .node
                .dispatchEvent(new CustomEvent("gizmoshover", {
                    detail: {
                        entity: null
                    }
                }))
        }),
        c.on("mouseout", function (a) {
            i || (d.stroke({color: j}), e.stroke({color: j}), f.fill({color: j})),
            a.stopPropagation()
        });
        var l,
            m;
        return a(c, {
            start: function (a, j) {
                i = !0,
                d.stroke({color: "#cc5"}),
                e.stroke({color: "#cc5"}),
                f.fill({color: "#cc5"}),
                g.show(),
                g.plot("M40,0 A40,40, 0 0,1 40,0 L0,0 Z"),
                h.plain("0°"),
                h.rotate(0, 0, 0),
                h.show(),
                l = a - c.position.x,
                m = j - c.position.y,
                b.start && b
                    .start
                    .call(c)
            },
            update: function (a, d) {
                var e = new Fire.Vec2(l, m),
                    f = new Fire.Vec2(l + a, m + d),
                    i = e.magSqr(),
                    j = f.magSqr();
                if (i > 0 && j > 0) {
                    var k = e.dot(f),
                        n = e.cross(f),
                        o = Math.sign(n) * Math.acos(k / Math.sqrt(i * j)),
                        p = Math.cos(o),
                        q = Math.sin(o),
                        r = Math.rad2deg(o);
                    h.rotate(r, 0, 0),
                    o > 0
                        ? (g.plot("M40,0 A40,40, 0 0,1 " + 40 * p + "," + 40 * q + " L0,0"), h.plain("+" + r.toFixed(0) + "°"))
                        : (g.plot("M40,0 A40,40, 0 0,0 " + 40 * p + "," + 40 * q + " L0,0"), h.plain(r.toFixed(0) + "°"))
                }
                var s = Math.atan2(e.y, e.x) - Math.atan2(f.y, f.x);
                b.update && b
                    .update
                    .call(c, Math.rad2deg(s))
            },
            end: function () {
                i = !1,
                d.stroke({color: j}),
                e.stroke({color: j}),
                f.fill({color: j}),
                g.hide(),
                h.hide(),
                b.end && b
                    .end
                    .call(c)
            }
        }),
        c
    },
    b.prototype.scaleTool = function (b) {
        var c = this
                .scene
                .group(),
            d,
            e,
            f;
        c.position = new Fire.Vec2(0, 0),
        c.rotation = 0,
        d = this.scaleSlider(100, "#f00", {
            start: function () {
                b.start && b
                    .start
                    .call(c)
            },
            update: function (a, e) {
                var f = c.rotation * Math.PI / 180,
                    g = Math.cos(f),
                    h = Math.sin(f),
                    i = Math.sqrt(a * a + e * e),
                    j = Math.atan2(h, g) - Math.atan2(e, a);
                i *= Math.cos(j),
                d.resize(i + 100),
                b.update && b
                    .update
                    .call(c, i / 100, 0)
            },
            end: function () {
                d.resize(100),
                b.end && b
                    .end
                    .call(c)
            }
        }),
        c.add(d),
        e = this.scaleSlider(100, "#5c5", {
            start: function () {
                b.start && b
                    .start
                    .call(c)
            },
            update: function (a, d) {
                var f = (c.rotation + 90) * Math.PI / 180,
                    g = Math.cos(f),
                    h = Math.sin(f),
                    i = Math.sqrt(a * a + d * d),
                    j = Math.atan2(h, g) - Math.atan2(d, a);
                i *= Math.cos(j),
                e.resize(-1 * i + 100),
                b.update && b
                    .update
                    .call(c, 0, i / 100)
            },
            end: function () {
                e.resize(100),
                b.end && b
                    .end
                    .call(c)
            }
        }),
        e.rotate(-90, 0, 0),
        c.add(e);
        var g = "#aaa",
            h = !1;
        return f = c
            .rect(20, 20)
            .move(-10, -10)
            .fill({color: g, opacity: .4})
            .stroke({width: 1, color: g}),
        f.on("mousemove", function (a) {
            a.stopPropagation()
        }),
        f.on("mouseover", function (a) {
            var b = chroma(g)
                .brighter()
                .hex();
            this
                .fill({color: b})
                .stroke({color: b}),
            a.stopPropagation(),
            this
                .node
                .dispatchEvent(new CustomEvent("gizmoshover", {
                    detail: {
                        entity: null
                    }
                }))
        }),
        f.on("mouseout", function (a) {
            h || this
                .fill({color: g})
                .stroke({color: g}),
            a.stopPropagation()
        }),
        a(f, {
            start: function () {
                h = !0,
                this
                    .fill({color: "#cc5"})
                    .stroke({color: "#cc5"}),
                b.start && b
                    .start
                    .call(c)
            },
            update: function (a, f) {
                var g = 1,
                    h = -1,
                    i = Math.sqrt(a * a + f * f),
                    j = Math.atan2(h, g) - Math.atan2(f, a);
                i *= Math.cos(j),
                d.resize(i + 100),
                e.resize(i + 100),
                b.update && b
                    .update
                    .call(c, g * i / 100, h * i / 100)
            },
            end: function () {
                h = !1,
                this
                    .fill({color: g})
                    .stroke({color: g}),
                d.resize(100),
                e.resize(100),
                b.end && b
                    .end
                    .call(c)
            }
        }),
        c
    },
    Editor.SvgGizmos = b
}(),
function () {
    var a = require("path"),
        b = require("ipc"),
        c = require("gulp");
    c = new c.Gulp;
    var d = require("event-stream");
    b.on("build-assets", function (b, e, f) {
        var g = a.join(b, "library/"),
            h = [
                g + "*/*.*",
                "!" + g + "*/*.thumb.*"
            ],
            i = [
                g + "*/*",
                "!" + g + "*/*.*"
            ],
            j = new Fire._DeserializeInfo,
            k = c
                .src(i, {base: b})
                .pipe(d.through(function (a) {
                    j.reset();
                    var b = Fire.deserialize(a.contents, j, {
                        isEditor: !1,
                        createAssetRefs: !0
                    });
                    a.contents = new Buffer(Editor.serialize(b, {
                        exporting: !0,
                        minify: !f
                    })),
                    this.emit("data", a)
                }))
                .pipe(c.dest(e)),
            l = c
                .src(h, {base: b})
                .pipe(c.dest(e));
        d
            .merge(k, l)
            .on("end", function () {
                Editor.sendToCore("build-assets:reply")
            })
    })
}(),
function () {
    var a = new Editor.IpcListener,
        b = {
            init: function () {
                a
                    .on("main-menu:create-entity", function () {
                        Editor.sendToMainWindow("engine:create-entity")
                    }),
                a.on("main-menu:create-child-entity", function () {
                    var a = Editor.Selection.activeEntityId;
                    Editor.sendToMainWindow("engine:create-entity", {"parent-id": a})
                }),
                Editor
                    .MainMenu
                    .addTemplate("Entity", this.getMenuTemplate("main-menu"), {
                        type: "window-static",
                        index: 3
                    })
            },
            destroy: function () {
                a.clear()
            },
            getMenuTemplate: function (a) {
                return [
                    {
                        label: "Create Empty",
                        message: a + ":create-entity"
                    }, {
                        label: "Create Empty Child",
                        message: a + ":create-child-entity"
                    }
                ]
            }
        };
    Editor.plugins.hierarchy = b
}(),
function () {
    function a(b, c) {
        for (var d = 0; d < b.children; ++d) {
            for (var e = b.children[d], f = 0; f < c.length; ++f) 
                if (e === c[f]) 
                    return !0;
        if (a(e, c)) 
                return !1
        }
        return !1
    }
    function b(a, b) {
        this.target = b,
        this.hovering = !1,
        this.selecting = !1,
        this.editing = !1,
        this.hitTest = !1,
        this.allowMultiTarget = !1,
        this._svg = a,
        this._root = null
    }
    Fire
        .JS
        .setClassName("Fire.Gizmo", b),
    Object.defineProperty(b.prototype, "entity", {
        get: function () {
            var a = this.target;
            return Array.isArray(a) && (a = a[0]),
            a instanceof Fire.Entity
                ? a
                : a instanceof Fire.Component
                    ? a.entity
                    : null
        }
    }),
    Object.defineProperty(b.prototype, "entities", {
        get: function () {
            var a = [],
                b = this.target;
            if (Array.isArray(b)) 
                for (var c = 0; c < b.length; ++c) {
                    var d = b[c];
                    d instanceof Fire.Entity
                        ? a.push(d)
                        : d instanceof Fire.Component && a.push(d.entity)
                } else 
                    b instanceof Fire.Entity
                        ? a.push(b)
                        : b instanceof Fire.Component && a.push(b.entity);
            return a
        }
    }),
    b.prototype.update = function () {},
    b.prototype.contains = function (b) {
        if (this._root) {
            for (var c = 0; c < b.length; ++c) 
                if (this._root.node === b[c]) 
                    return !0;
        return a(this._root.node, b)
        }
        return !1
    },
    b.prototype.remove = function () {
        this
            ._root
            .remove()
    },
    b.prototype.dirty = function () {
        var a = new CustomEvent("gizmosdirty");
        this
            ._root
            .node
            .dispatchEvent(a)
    },
    Editor.Gizmo = b
}(),
function () {
    var a = Fire.extend("Fire.PositionGizmo", Editor.Gizmo, function () {
        var a = arguments[0],
            b = arguments[1];
        this.allowMultiTarget = !0;
        var c = [],
            d = b,
            e = this;
        this._root = a.positionTool({
            start: function () {
                c.length = 0;
                for (var a = 0; a < d.length; ++a) 
                    c.push(d[a].transform.worldPosition)
            },
            update: function (b, f) {
                for (var g = a.view.height / a.camera.size, h = new Fire.Vec2(b / g, -f / g), i = 0; i < c.length; ++i) 
                    d[i].transform.worldPosition = c[i].add(h);
                e.dirty()
            }
        })
    });
    a.prototype.update = function () {
        var a = this.entity,
            b,
            c,
            d;
        if ("center" === this.pivot) 
            b = Editor.GizmosUtils.getCenter(this.target),
            c = this._svg.camera.worldToScreen(b),
            c.x = Editor.GizmosUtils.snapPixel(c.x),
            c.y = Editor.GizmosUtils.snapPixel(c.y),
            this._root.position = c,
            this._root.rotation = 0;
        else {
            var e = a
                .transform
                .getLocalToWorldMatrix();
            b = new Fire.Vec2(e.tx, e.ty),
            c = this
                ._svg
                .camera
                .worldToScreen(b),
            d = -a.transform.worldRotation,
            c.x = Editor
                .GizmosUtils
                .snapPixel(c.x),
            c.y = Editor
                .GizmosUtils
                .snapPixel(c.y),
            this._root.position = c,
            this._root.rotation = 0,
            "global" !== this.coordinate && (this._root.rotation = d)
        }
        this
            ._root
            .translate(this._root.position.x, this._root.position.y)
            .rotate(this._root.rotation, this._root.position.x, this._root.position.y)
    },
    Editor.PositionGizmo = a
}(),
function () {
    var a = Fire.extend("Fire.RotationGizmo", Editor.Gizmo, function () {
        var a = arguments[0],
            b = arguments[1],
            c = arguments[2];
        this.allowMultiTarget = !0,
        this.rotating = !1;
        var d = [],
            e = [],
            f = b,
            g = this,
            h;
        this._root = a.rotationTool({
            start: function () {
                g.rotating = !0,
                d.length = 0;
                for (var a = 0; a < f.length; ++a) 
                    d.push(f[a].transform.rotation);
                if ("center" === g.pivot) 
                    for (h = Editor.GizmosUtils.getCenter(f), e.length = 0, a = 0; a < f.length; ++a) 
                        e.push(f[a].transform.worldPosition.sub(h))
            },
            update: function (a) {
                var b,
                    c,
                    i;
                if (i = Math.floor(a), "center" === g.pivot) 
                    for (b = 0; b < d.length; ++b) {
                        c = Math.deg180(d[b] + i),
                        c = Math.floor(c);
                        var j = e[b].rotate(Math.deg2rad(i));
                        f[b].transform.worldPosition = h.add(j),
                        f[b].transform.rotation = c,
                        this.rotation = -a
                    } else 
                        for (b = 0; b < d.length; ++b) 
                            c = Math.deg180(d[b] + a),
                            c = Math.floor(c),
                            f[b].transform.rotation = c;
            g.dirty()
            },
            end: function () {
                if ("center" === g.pivot) {
                    var a = Editor
                            .GizmosUtils
                            .getCenter(f),
                        b = g
                            ._svg
                            .camera
                            .worldToScreen(a);
                    b.x = Editor
                        .GizmosUtils
                        .snapPixel(b.x),
                    b.y = Editor
                        .GizmosUtils
                        .snapPixel(b.y),
                    this.rotation = 0,
                    this.position = b,
                    this
                        .translate(this.position.x, this.position.y)
                        .rotate(this.rotation, this.position.x, this.position.y)
                }
                g.rotating = !1
            }
        })
    });
    a.prototype.update = function () {
        var a = this.entity,
            b,
            c,
            d;
        if ("center" === this.pivot) {
            if (this.rotating) 
                return void this._root.rotate(this._root.rotation, this._root.position.x, this._root.position.y);
            b = Editor
                .GizmosUtils
                .getCenter(this.target),
            c = this
                ._svg
                .camera
                .worldToScreen(b),
            c.x = Editor
                .GizmosUtils
                .snapPixel(c.x),
            c.y = Editor
                .GizmosUtils
                .snapPixel(c.y),
            this._root.position = c
        } else {
            var e = a
                .transform
                .getLocalToWorldMatrix();
            b = new Fire.Vec2(e.tx, e.ty),
            c = this
                ._svg
                .camera
                .worldToScreen(b),
            d = -a.transform.worldRotation,
            c.x = Editor
                .GizmosUtils
                .snapPixel(c.x),
            c.y = Editor
                .GizmosUtils
                .snapPixel(c.y),
            this._root.position = c,
            this._root.rotation = d
        }
        this
            ._root
            .translate(this._root.position.x, this._root.position.y)
            .rotate(this._root.rotation, this._root.position.x, this._root.position.y)
    },
    Editor.RotationGizmo = a
}(),
function () {
    var a = Fire.extend("Fire.ScaleGizmo", Editor.Gizmo, function () {
        var a = arguments[0],
            b = arguments[1],
            c = arguments[2];
        this.allowMultiTarget = !0;
        var d = [],
            e = [],
            f = b,
            g = this,
            h;
        this._root = a.scaleTool({
            start: function () {
                var a;
                for (d.length = 0, a = 0; a < f.length; ++a) 
                    d.push(f[a].transform.scale);
                if ("center" === g.pivot) 
                    for (h = Editor.GizmosUtils.getCenter(f), e.length = 0, a = 0; a < f.length; ++a) 
                        e.push(f[a].transform.worldPosition.sub(h))
            },
            update: function (a, b) {
                var c,
                    i;
                if (i = new Fire.Vec2(1 + a, 1 - b), "center" === g.pivot) 
                    for (c = 0; c < d.length; ++c) {
                        f[c].transform.scale = new Fire.Vec2(d[c].x * i.x, d[c].y * i.y);
                        var j = new Fire.Vec2(e[c].x * i.x, e[c].y * i.y);
                        f[c].transform.worldPosition = h.add(j)
                    } else 
                        for (c = 0; c < d.length; ++c) 
                            f[c].transform.scale = new Fire.Vec2(d[c].x * i.x, d[c].y * i.y);
            g.dirty()
            }
        })
    });
    a.prototype.update = function () {
        var a = this.entity,
            b,
            c,
            d;
        if ("center" === this.pivot) 
            b = Editor.GizmosUtils.getCenter(this.target),
            c = this._svg.camera.worldToScreen(b),
            d = 0,
            c.x = Editor.GizmosUtils.snapPixel(c.x),
            c.y = Editor.GizmosUtils.snapPixel(c.y),
            this._root.position = c,
            this._root.rotation = 0;
        else {
            var e = a
                .transform
                .getLocalToWorldMatrix();
            b = new Fire.Vec2(e.tx, e.ty),
            c = this
                ._svg
                .camera
                .worldToScreen(b),
            d = -a.transform.worldRotation,
            c.x = Editor
                .GizmosUtils
                .snapPixel(c.x),
            c.y = Editor
                .GizmosUtils
                .snapPixel(c.y),
            this._root.position = c,
            this._root.rotation = d
        }
        this
            ._root
            .translate(this._root.position.x, this._root.position.y)
            .rotate(this._root.rotation, this._root.position.x, this._root.position.y)
    },
    Editor.ScaleGizmo = a
}(),
function () {
    var a = Fire.extend("Fire.CameraGizmo", Editor.Gizmo, function () {
        var a = arguments[0],
            b = arguments[1];
        this.hitTest = !0,
        this._icon = a.icon("fire://static/img/gizmos-camera.png", 40, 40, b.entity);
        var c = a
                .scene
                .group(),
            d = "#ff0",
            e = c
                .rect()
                .fill("none")
                .stroke({width: 1, color: d}),
            f = c
                .line()
                .stroke({width: 1, color: d}),
            g = c
                .line()
                .stroke({width: 1, color: d}),
            h = c
                .line()
                .stroke({width: 1, color: d}),
            i = c
                .line()
                .stroke({width: 1, color: d});
        c.hide(),
        c.update = function (a, b) {
            e
                .size(a, b)
                .move(-.5 * a, -.5 * b);
            var c = 10;
            f.plot(0, -.5 * b, 0, -.5 * b + c),
            g.plot(0, .5 * b, 0, .5 * b - c),
            h.plot(-.5 * a, 0, -.5 * a + c, 0),
            i.plot(.5 * a, 0, .5 * a - c, 0)
        },
        this._selectTools = c
    });
    Editor.gizmos["Fire.Camera"] = a,
    a.prototype.remove = function () {
        this
            ._icon
            .remove(),
        this
            ._selectTools
            .remove()
    },
    a.prototype.contains = function (a) {
        for (var b = 0; b < a.length; ++b) 
            if (this._icon.node === a[b]) 
                return !0
    },
    a.prototype.update = function () {
        if (this.target.isValid) {
            var a = this._svg.view.height / this._svg.camera.size,
                b = this
                    .target
                    .entity
                    .transform
                    .getLocalToWorldMatrix(),
                c = new Fire.Vec2(b.tx, b.ty),
                d = this
                    ._svg
                    .camera
                    .worldToScreen(c);
            d.x = Editor
                .GizmosUtils
                .snapPixel(d.x),
            d.y = Editor
                .GizmosUtils
                .snapPixel(d.y);
            var e = -this.target.entity.transform.worldRotation,
                f = Math.max(a, .5);
            if (this._icon.scale(f, f), this._icon.translate(d.x, d.y).rotate(e, d.x, d.y), this.hovering || this.selecting) {
                var g = Fire.Screen.size,
                    h = this.target.size * a,
                    i = g.x / g.y * h;
                this
                    ._selectTools
                    .show(),
                this
                    ._selectTools
                    .update(i, h),
                this
                    ._selectTools
                    .translate(d.x, d.y)
                    .rotate(e, d.x, d.y)
            } else 
                this
                    ._selectTools
                    .hide()
            }
    },
    Editor.CameraGizmo = a
}(),
function () {
    var a = Fire.extend("Fire.SpriteRendererGizmo", Editor.Gizmo, function () {
        var a = arguments[0],
            b = arguments[1];
        this.hitTest = !1,
        this._root = a
            .scene
            .group(),
        this._selectTools = this
            ._root
            .polygon(),
        this
            ._selectTools
            .hide(),
        this._editTools = null
    });
    Editor.gizmos["Fire.SpriteRenderer"] = a,
    a.prototype.remove = function () {
        this
            ._root
            .remove(),
        this._editTools && this
            ._editTools
            .remove()
    },
    a.prototype.update = function () {
        if (this.target.isValid) {
            var a,
                b,
                c,
                d,
                e,
                f = 5;
            if (this.editing && this.target.customSize) {
                if (!this._editTools) {
                    var g = this,
                        h,
                        i = {},
                        j,
                        k,
                        l,
                        m,
                        n,
                        o = this.entity,
                        p = function (b, c) {
                            a = g
                                .target
                                .getWorldOrientedBounds(),
                            i["bottom-left"] = a[0],
                            i["top-left"] = a[1],
                            i["top-right"] = a[2],
                            i["bottom-right"] = a[3],
                            i["top-middle"] = a[1]
                                .add(a[2])
                                .mul(.5),
                            i["bottom-middle"] = a[0]
                                .add(a[3])
                                .mul(.5),
                            i["middle-left"] = a[1]
                                .add(a[0])
                                .mul(.5),
                            i["middle-right"] = a[2]
                                .add(a[3])
                                .mul(.5),
                            j = b,
                            k = c,
                            l = o.transform.worldPosition,
                            n = o.transform.worldScale;
                            var d = a[3].sub(a[1]),
                                e = d.mag();
                            d.normalizeSelf(),
                            h = a[1].add(d.mul(.5 * e))
                        },
                        q = function (a, b, c, d) {
                            return function (e, f) {
                                var m,
                                    p,
                                    q,
                                    r,
                                    s,
                                    t = j + e,
                                    u = k + f,
                                    v = g
                                        ._svg
                                        .camera
                                        .screenToWorld(new Fire.Vec2(t, u)),
                                    w = i[a],
                                    x = o.transform.right,
                                    y = o.transform.up;
                                0 === c
                                    ? (m = v.sub(w), p = m.mag(), q = y.angle(m), p *= Math.cos(q), v = w.add(y.mul(p)))
                                    : 0 === d && (m = v.sub(w), p = m.mag(), q = x.angle(m), p *= Math.cos(q), v = w.add(x.mul(p)));
                                var z = i[b];
                                m = z.sub(v),
                                p = m.mag(),
                                m.normalizeSelf(),
                                s = v.add(m.mul(.5 * p)),
                                q = x.signAngle(m),
                                0 !== c && (g.target.width = c * Math.cos(q) * p / n.x),
                                0 !== d && (g.target.height = d * Math.sin(q) * p / n.y),
                                o.transform.worldPosition = l.add(s.sub(h)),
                                g.dirty()
                            }
                        },
                        r = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("top-left", "bottom-right", 1, 1)
                            }),
                        s = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("top-middle", "bottom-middle", 0, 1)
                            }),
                        t = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("top-right", "bottom-left", -1, 1)
                            }),
                        u = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("middle-left", "middle-right", 1, 0)
                            }),
                        v = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("middle-right", "middle-left", -1, 0)
                            }),
                        w = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("bottom-left", "top-right", 1, -1)
                            }),
                        x = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("bottom-middle", "top-middle", 0, -1)
                            }),
                        y = this
                            ._svg
                            .freemoveTool(2 * f, "#09f", {
                                start: p,
                                update: q("bottom-right", "top-left", -1, -1)
                            });
                    this._editTools = this
                        ._svg
                        .scene
                        .group(),
                    this
                        ._editTools
                        .add(r),
                    this._editTools.tl = r,
                    this
                        ._editTools
                        .add(s),
                    this._editTools.tm = s,
                    this
                        ._editTools
                        .add(t),
                    this._editTools.tr = t,
                    this
                        ._editTools
                        .add(u),
                    this._editTools.ml = u,
                    this
                        ._editTools
                        .add(v),
                    this._editTools.mr = v,
                    this
                        ._editTools
                        .add(w),
                    this._editTools.bl = w,
                    this
                        ._editTools
                        .add(x),
                    this._editTools.bm = x,
                    this
                        ._editTools
                        .add(y),
                    this._editTools.br = y
                }
            } else 
                this._editTools && (this._editTools.remove(), this._editTools = null);
            if (this.editing) {
                var z = "#09f";
                if (this.target.customSize && (z = "#0f9"), a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(b.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(b.y)
                    ],
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(c.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(c.y)
                    ],
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(d.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(d.y)
                    ],
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(e.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(e.y)
                    ]
                ]).fill("none").stroke({color: z, width: 1}), this.target.customSize) {
                    b.x = b.x - f,
                    b.y = b.y - f,
                    c.x = c.x - f,
                    c.y = c.y - f,
                    d.x = d.x - f,
                    d.y = d.y - f,
                    e.x = e.x - f,
                    e.y = e.y - f;
                    var A = b.add(c.sub(b).mul(.5)),
                        B = c.add(d.sub(c).mul(.5)),
                        C = d.add(e.sub(d).mul(.5)),
                        D = e.add(b.sub(e).mul(.5));
                    this
                        ._editTools
                        .tl
                        .move(c.x, c.y),
                    this
                        ._editTools
                        .tm
                        .move(B.x, B.y),
                    this
                        ._editTools
                        .tr
                        .move(d.x, d.y),
                    this
                        ._editTools
                        .mr
                        .move(C.x, C.y),
                    this
                        ._editTools
                        .br
                        .move(e.x, e.y),
                    this
                        ._editTools
                        .bm
                        .move(D.x, D.y),
                    this
                        ._editTools
                        .bl
                        .move(b.x, b.y),
                    this
                        ._editTools
                        .ml
                        .move(A.x, A.y)
                }
            } else 
                this.selecting
                    ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(b.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(b.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(c.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(c.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(d.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(d.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(e.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(e.y)
                        ]
                    ]).fill("none").stroke({color: "#09f", width: 1}))
                    : this.hovering
                        ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(b.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(b.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(c.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(c.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(d.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(d.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(e.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(e.y)
                            ]
                        ]).fill("none").stroke({color: "#999", width: 1}))
                        : this
                            ._selectTools
                            .hide()
                    }
    },
    Editor.SpriteRendererGizmo = a
}(),
function () {
    var a = Fire.extend("Fire.BitmapTextGizmo", Editor.Gizmo, function () {
        var a = arguments[0],
            b = arguments[1];
        this.hitTest = !1,
        this._root = a
            .scene
            .group(),
        this._selectTools = this
            ._root
            .polygon(),
        this
            ._selectTools
            .hide()
    });
    Editor.gizmos["Fire.BitmapText"] = a,
    a.prototype.remove = function () {
        this
            ._selectTools
            .remove()
    },
    a.prototype.update = function () {
        if (this.target.isValid) {
            var a,
                b,
                c,
                d,
                e;
            this.editing
                ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(b.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(b.y)
                    ],
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(c.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(c.y)
                    ],
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(d.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(d.y)
                    ],
                    [
                        Editor
                            .GizmosUtils
                            .snapPixel(e.x),
                        Editor
                            .GizmosUtils
                            .snapPixel(e.y)
                    ]
                ]).fill("none").stroke({color: "#09f", width: 1}))
                : this.selecting
                    ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(b.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(b.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(c.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(c.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(d.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(d.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(e.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(e.y)
                        ]
                    ]).fill("none").stroke({color: "#09f", width: 1}))
                    : this.hovering
                        ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(b.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(b.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(c.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(c.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(d.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(d.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(e.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(e.y)
                            ]
                        ]).fill("none").stroke({color: "#999", width: 1}))
                        : this
                            ._selectTools
                            .hide()
        }
    },
    Editor.BitmapTextGizmo = a
}(),
function () {
    var a = Fire.extend("Fire.AudioSourceGizmo", Editor.Gizmo, function () {
        var b = arguments[0],
            c = arguments[1];
        a
            .$super
            .call(this, b, c),
        this.hitTest = !0,
        this._icon = b.icon("fire://static/img/gizmos-audio-source.png", 40, 40, c.entity)
    });
    Editor.gizmos["Fire.AudioSource"] = a,
    a.prototype.remove = function () {
        this
            ._icon
            .remove()
    },
    a.prototype.contains = function (a) {
        for (var b = 0; b < a.length; ++b) 
            if (this._icon.node === a[b]) 
                return !0
    },
    a.prototype.update = function () {
        if (this.target.isValid) {
            this.target.size = 40;
            var a = this._svg.view.height / this._svg.camera.size,
                b = this
                    .target
                    .entity
                    .transform
                    .getLocalToWorldMatrix(),
                c = new Fire.Vec2(b.tx, b.ty),
                d = this
                    ._svg
                    .camera
                    .worldToScreen(c);
            d.x = Editor
                .GizmosUtils
                .snapPixel(d.x),
            d.y = Editor
                .GizmosUtils
                .snapPixel(d.y);
            var e = -this.target.entity.transform.worldRotation,
                f = Math.max(a, .5);
            this
                ._icon
                .scale(f, f),
            this
                ._icon
                .translate(d.x, d.y)
                .rotate(e, d.x, d.y)
        }
    },
    Editor.AudioSourceGizmo = a
}(),
function () {
    var a = Fire.Class({
        name: "Fire.TextGizmo",
        "extends": Editor.Gizmo,
        constructor: function () {
            var a = arguments[0];
            this.target = arguments[1],
            this.hitTest = !1,
            this._root = a
                .scene
                .group(),
            this._selectTools = this
                ._root
                .polygon(),
            this
                ._selectTools
                .hide()
        },
        properties: {},
        remove: function () {
            this
                ._selectTools
                .remove()
        },
        update: function () {
            if (this.target.isValid) {
                var a,
                    b,
                    c,
                    d,
                    e;
                this.editing
                    ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(b.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(b.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(c.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(c.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(d.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(d.y)
                        ],
                        [
                            Editor
                                .GizmosUtils
                                .snapPixel(e.x),
                            Editor
                                .GizmosUtils
                                .snapPixel(e.y)
                        ]
                    ]).fill("none").stroke({color: "#09f", width: 1}))
                    : this.selecting
                        ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(b.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(b.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(c.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(c.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(d.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(d.y)
                            ],
                            [
                                Editor
                                    .GizmosUtils
                                    .snapPixel(e.x),
                                Editor
                                    .GizmosUtils
                                    .snapPixel(e.y)
                            ]
                        ]).fill("none").stroke({color: "#09f", width: 1}))
                        : this.hovering
                            ? (a = this.target.getWorldOrientedBounds(), b = this._svg.camera.worldToScreen(a[0]), c = this._svg.camera.worldToScreen(a[1]), d = this._svg.camera.worldToScreen(a[2]), e = this._svg.camera.worldToScreen(a[3]), this._selectTools.show(), this._selectTools.plot([
                                [
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(b.x),
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(b.y)
                                ],
                                [
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(c.x),
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(c.y)
                                ],
                                [
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(d.x),
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(d.y)
                                ],
                                [
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(e.x),
                                    Editor
                                        .GizmosUtils
                                        .snapPixel(e.y)
                                ]
                            ]).fill("none").stroke({color: "#999", width: 1}))
                            : this
                                ._selectTools
                                .hide()
            }
        }
    });
    Editor.gizmos["Fire.Text"] = a,
    Editor.TextGizmo = a
}();