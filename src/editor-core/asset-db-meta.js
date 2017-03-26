var Path = require("path"),
	Fs = require("fs"),
	Uuid = require("node-uuid"),
	BuiltinMetas = [["package.json", Editor.PackageMeta], [".fire", Editor.SceneMeta], [".png .jpg", Editor.TextureMeta], [".sprite", Editor.SpriteMeta], [".atlas", Editor.AtlasMeta], [".json", Editor.JsonMeta], [".asset", Editor.CustomAssetMeta], [".fnt .bmf .bmfont", Editor.BitmapFontMeta], [".txt .plist", Editor.TextAssetMeta], [".js .ts .coffee", Editor.ScriptAssetMeta], [".mp3 .ogg .wav", Editor.AudioClipMeta]],
	Meta = {
		_basenameToCtor: {},
		_extnameToCtor: {},
		_metaTypeToExtnames: new Map,
		create: function (a, b) {
			var c = this.getType(a, "" === Path.extname(a));
			if (!c) throw new Error("Can not get metaType from " + a);
			b || (b = Uuid.v4());
			var d = new c;
			return d.uuid = b, d.setDirty(), d
		},
		init: function () {
			for (var a in BuiltinMetas) {
				var b = BuiltinMetas[a],
					c = b[0],
					d = b[1];
				this.register(c, d)
			}
		},
		load: function (a) {
			var b = a + ".meta",
				c = null;
			try {
				c = Fs.readFileSync(b)
			}
			catch (d) {
				return "ENOENT" !== d.code && Fire.warn("Failed to read meta file %s, message: %s", b, d.message), null
			}
			var e = null;
			try {
				e = Fire.deserialize(c)
			}
			catch (d) {
				return Fire.warn("Failed to deserialize meta %s, message: %s", b, d.message), null
			}
			var f = this.getType(a, "" === Path.extname(a));
			return e && e.constructor !== f ? (Fire.warn("Meta type not the same, loaded: %s, expect: %s. Automatically convert meta to expect type.", Fire.JS.getClassName(e.constructor), Fire.JS.getClassName(f)), null) : e
		},
		loadByUuid: function (a) {
			var b = Editor.AssetDB.uuidToUrl(a),
				c = Editor.AssetDB.fspath(b);
			if (!Editor.AssetDB.isSubAsset(b)) return this.load(c);
			var d = this.load(Path.dirname(c));
			if (d && d.subRawData && d.subRawData.length > 0)
				for (var e = 0; e < d.subRawData.length; ++e) {
					var f = d.subRawData[e];
					if (f.meta.uuid === a) return f.meta
				}
			return null
		},
		loadOrCreateNew: function (a) {
			var b = this.load(a);
			if (!b) {
				var c = this.loadUuid(a);
				b = this.create(a, c)
			}
			return b
		},
		loadUuid: function (a) {
			var b = a + ".meta",
				c = null;
			try {
				c = Fs.readFileSync(b)
			}
			catch (d) {
				return "ENOENT" !== d.code && Fire.warn("Failed to read meta file %s, message: %s", b, d.message), null
			}
			var e;
			try {
				e = JSON.parse(c)
			}
			catch (d) {
				return Fire.warn("Failed to parse meta file %s, message: %s", b, d.message), null
			}
			return e.uuid
		},
		save: function (a, b, c) {
			b.subRawData && 0 === b.subRawData.length && (b.subRawData = void 0);
			var d = Editor.serialize(b, {
				nicify: !0
			});
			Fs.writeFile(a + ".meta", d, function (a) {
				b.dirty = !1, c(a)
			})
		},
		saveSync: function (a, b) {
			b.subRawData && 0 === b.subRawData.length && (b.subRawData = void 0);
			var c = Editor.serialize(b, {
				nicify: !0
			});
			Fs.writeFileSync(a + ".meta", c), b.dirty = !1
		},
		getType: function (a, b, c) {
			if (b) return Editor.FolderMeta;
			var d = Path.basename(a),
				e = this._basenameToCtor[d];
			if (e) return e;
			var f = Path.extname(d).toLowerCase();
			return (e = this._extnameToCtor[f]) ? e : (c = "undefined" != typeof c ? c : !0, c && Editor.AssetMeta)
		},
		getDefautExtname: function (a) {
			var b;
			b = "function" == typeof a ? a : a.constructor;
			var c = this._metaTypeToExtnames.get(b);
			return c ? c[0] : (Fire.error("Unregistered file extname for " + Fire.JS.getClassName(b)), "")
		},
		getExtnames: function (a) {
			var b = [];
			return this._metaTypeToExtnames.forEach(function (c, d) {
				d.assetType === a && (b = b.concat(c))
			}), 0 === b.length && Fire.error("Unregistered file extnames for " + Fire.JS.getClassName(a)), b
		},
		register: function (a, b, c) {
			if (!Fire.isChildClassOf(b, Editor.AssetMeta)) return void Fire.warn("Failed to register pattern %s, The metaType is not extended from Editor.AssetMeta", a);
			Array.isArray(a) || (a = a.split(" "));
			for (var d = 0; d < a.length; ++d) {
				var e = a[d],
					f = this.getType(e, !1, !1);
				f && Fire.warn("The pattern %s have been registered for %s. For now override by %s.", e, Fire.JS.getClassName(f), Fire.JS.getClassName(b)), "." === e[0] && "" === Path.extname(e) ? this._extnameToCtor[e] = b : Path.basename(e) === e ? this._basenameToCtor[e] = b : Fire.error("Not yet supported pattern %s for %s", e, Fire.JS.getClassName(b))
			}
			var g = this._metaTypeToExtnames.get(b);
			g ? Fire.error('The meta "%s" has already been registered for "%s"', Fire.JS.getClassName(b), g) : this._metaTypeToExtnames.set(b, a)
		},
		reset: function () {
			this._basenameToCtor = {}, this._extnameToCtor = {}, this._metaTypeToExtnames.clear(), this.init()
		}
	};
module.exports = Meta;
