function _precheck(a) {
	return EventStream.through(function (b) {
		var c = Path.extname(b.relative),
			d = Path.basename(b.relative, c);
		if (a.filterMeta && ".meta" === c) {
			var e = Path.join(Path.dirname(b.path), d);
			return void Fs.exists(e, function (a) {
				a || (Fire.warn("remove unused meta: " + b.relative), Fs.unlink(b.path))
			})
		}
		"." === c || b.stat.isDirectory() === !1 && "" === c || this.push(b)
	})
}

function _checkIfImport(a) {
	var b = Editor.AssetDB;
	return EventStream.map(function (c, d) {
		if (a = a || {}, a.force) return void d(null, c);
		var e = c.meta;
		if (!e) {
			if (e = Meta.load(c.path), !e) return void d(null, c);
			c.meta = e
		}
		if (c.meta instanceof Editor.FolderMeta) return void d();
		var f = b.uuidToLibraryPath(c.meta.uuid);
		Fs.exists(f, function (a) {
			if (!a) return void d(null, c);
			var e = b._uuidToMtime[c.meta.uuid];
			if (!e) return void d(null, c);
			var f = Fs.statSync(c.path);
			if (e.asset !== f.mtime.getTime()) return void d(null, c);
			var g = Fs.statSync(c.path + ".meta");
			return e.meta !== g.mtime.getTime() ? void d(null, c) : void d()
		})
	})
}

function _depthFirst() {
	var a = [];
	return EventStream.through(function (b) {
		a.push(b)
	}, function () {
		a.sort(function (a, b) {
			return b.relative.localeCompare(a.relative)
		});
		for (var b = 0; b < a.length; ++b) this.push(a[b]);
		this.emit("end")
	})
}

function _loadOrCreateMeta() {
	return EventStream.map(function (a, b) {
		var c = Path.extname(a.relative),
			d = Path.basename(a.relative, c),
			e = a.path;
		if (".meta" === c) return e = Path.join(Path.dirname(a.path), d), void Fs.exists(e, function (c) {
			c || (Fire.warn("remove unused meta: " + a.relative), Fs.unlink(a.path)), b()
		});
		if ("." === c || a.stat.isDirectory() === !1 && "" === c) return void b();
		a.rawfile = e;
		var f = Meta.load(e);
		if (f) return a.meta = f, void b(null, a);
		var g = Meta.loadUuid(e);
		return (f = Meta.create(e, g)) ? (a.meta = f, f.setDirty(), void b(null, a)) : void b()
	})
}

function _saveSubMeta(a, b) {
	var c = Editor.AssetDB;
	return EventStream.map(function (c, d) {
		if (a && (c.asset = a), b && (c.meta = b), c.meta) {
			var e = Path.dirname(c.path),
				f = Meta.load(e);
			for (var g in f.subRawData) {
				var h = f.subRawData[g],
					i = h.meta;
				if (i.uuid === c.meta.uuid) {
					c.asset && (h.asset = c.asset), c.meta && (h.meta = c.meta);
					break
				}
			}
			Meta.save(e, f, function (a) {
				return a ? (VinylFile.error(a.message), void d()) : void d(null, c)
			})
		}
		else d(null, c)
	})
}

function _saveMeta(a) {
	var b = Editor.AssetDB;
	return EventStream.map(function (c, d) {
		a && (c.meta = a, a.setDirty()), c.meta && c.meta.dirty ? Meta.save(c.path, c.meta, function (a) {
			return a ? (VinylFile.error(a.message), void d()) : (b._updateMtime(c.meta.uuid), void d(null, c))
		}) : d(null, c)
	})
}

function _importSubAsset() {
	var a = Editor.AssetDB;
	return EventStream.map(function (a, b) {
		var c = a.asset,
			d = a.meta;
		d.setDirty(), d && d["import"] ? d.startImport(a).on("end", function () {
			b(null, a)
		}).on("error", function (a) {
			Fire.error(a.message), b()
		}) : b(null, a)
	})
}

function _importSubAssetsFromParent() {
	var a = Editor.AssetDB;
	return EventStream.map(function (a, b) {
		var c = a.meta;
		if (c.subRawData && c.subRawData.length > 0)
			for (var d = 0, e = 0; e < c.subRawData.length; ++e) {
				var f = c.subRawData[e],
					g = f.meta,
					h = f.asset;
				if (g["import"]) {
					++d;
					var i = new VinylFile({
						cwd: a.cwd,
						base: a.baes,
						path: Path.join(a.path, h.name + Meta.getDefautExtname(g)),
						relative: Path.join(a.relative, h.name + Meta.getDefautExtname(g))
					});
					i.asset = h, i.meta = g, g.startImport(i).on("end", function () {
						--d, 0 === d && b(null, a)
					}).on("error", function (a) {
						Fire.error(a.message), b()
					})
				}
			}
		else b(null, a)
	})
}

function _importAsset() {
	var a = Editor.AssetDB;
	return EventStream.map(function (b, c) {
		var d = b.path,
			e = !1;
		b.stat && (e = b.stat.isDirectory());
		var f = b.meta;
		if (f || (f = Meta.load(d)), f) {
			var g = a.uuidToFspath(f.uuid);
			g && g !== d && (Fire.warn("uuid collision %s, %s ", d, g), f = null)
		}
		if (!f) {
			var h = Meta.loadUuid(d);
			f = Meta.create(d, h)
		}
		if (b.meta = f, f.setDirty(), e) c(null, b);
		else if (f["import"]) {
			var i = [],
				j = [];
			f.subRawData && (i = f.subRawData.slice()), f.startImport(b).on("end", function () {
				if (f.subRawData) {
					j = f.subRawData.slice();
					var a, d;
					for (a = 0; a < j.length; ++a)
						for (d = 0; i.length; ++d)
							if (j[a].meta.uuid === i[d].meta.uuid) {
								j.splice(a, 1), i.splice(d, 1), --a, --d;
								break
							}
				}
				b.oldSubRawData = i, b.newSubRawData = j, c(null, b)
			}).on("error", function (a) {
				Fire.error(a.message), c()
			})
		}
		else c(null, b)
	})
}

function _exportAsset(a, b) {
	var c = Editor.AssetDB;
	return EventStream.map(function (c, d) {
		var e = c.path,
			f = c.meta;
		if (f || (f = Meta.loadOrCreateNew(e)), c.meta = f, f.setDirty(), f["export"]) {
			var g = JSON.parse(a);
			Editor.serialize.setName(g, ""), a = JSON.stringify(g, null, 2), f.startExport(c, a, b).on("end", function () {
				Fs.stat(e, function (a, b) {
					return a ? (Fire.error(a.message), void d()) : (c.stat = b, void d(null, c))
				})
			}).on("error", function (a) {
				Fire.error(a.message), d()
			})
		}
		else d(null, c)
	})
}

function _deleteAsset() {
	var a = Editor.AssetDB;
	return EventStream.map(function (a, b) {
		Del(a.path, {
			force: !0
		}, function (c) {
			return c ? (Fire.error(c), void b()) : void Del(a.path + ".meta", {
				force: !0
			}, function (c) {
				c && Fire.error(c), b(null, a)
			})
		})
	})
}

function _deleteLibraryFile() {
	var a = Editor.AssetDB;
	return EventStream.map(function (b, c) {
		var d = a.fspathToUuid(b.path);
		a._deleteLibraryFile(d);
		var e = a.fspathToSubUuids(b.path);
		if (e)
			for (var f = 0; f < e.length; ++f) d = e[f], a._deleteLibraryFile(d);
		c(null, b)
	})
}

function _deleteOldSubLibraryFile() {
	var a = Editor.AssetDB;
	return EventStream.map(function (b, c) {
		if (c(null, b), b.oldSubRawData)
			for (var d = 0; d < b.oldSubRawData.length; ++d) {
				var e = b.oldSubRawData[d];
				a._deleteLibraryFile(e.meta.uuid)
			}
	})
}

function _renameSubAsset(a, b) {
	var c = Editor.AssetDB;
	return EventStream.map(function (d, e) {
		d.moves = [];
		var f = d.meta;
		f || (f = Meta.load(d.path)), d.meta = f, f.setDirty();
		var g = Path.basenameNoExt(a),
			h = Path.basenameNoExt(b);
		for (var i in f.subRawData) {
			var j = f.subRawData[i],
				k = j.asset,
				l = j.meta,
				m = Meta.getType(a);
			if (k.name === g && l instanceof m) {
				k.name = h, c.saveAssetToLibrary(l.uuid, k), d.moves.push({
					notify: !0,
					src: Path.join(d.path, g + Meta.getDefautExtname(l)),
					dest: Path.join(d.path, h + Meta.getDefautExtname(l))
				});
				break
			}
		}
		e(null, d)
	})
}

function _moveAsset(a, b) {
	var c = Editor.AssetDB;
	return EventStream.map(function (d, e) {
		if (d.moves = [], "" === d.relative) {
			if (d.moves.push({
					notify: !0,
					src: a,
					dest: b
				}), !d.stat.isDirectory()) {
				var f = d.meta;
				f || (f = Meta.load(d.path)), d.meta = f;
				var g = f.uuid,
					h = Path.join(c._libraryPath, g.substring(0, 2), g);
				if (Fs.existsSync(h)) {
					var i = JSON.parse(Fs.readFileSync(h));
					Editor.serialize.setName(i, Path.basenameNoExt(d.path)), Fs.writeFileSync(Path.join(c._libraryPath, g.substring(0, 2), g), JSON.stringify(i, null, 2))
				}
				if (f.subRawData && 1 === f.subRawData.length) {
					var j = f.subRawData[0],
						k = j.asset,
						l = j.meta,
						m = Path.basenameNoExt(a);
					if (k.name === m) {
						var n = Path.basenameNoExt(b);
						k.name = n, c.saveAssetToLibrary(l.uuid, k), d.moves.push({
							notify: !0,
							src: Path.join(b, m + Meta.getDefautExtname(l)),
							dest: Path.join(b, n + Meta.getDefautExtname(l))
						})
					}
				}
				f.setDirty()
			}
		}
		else d.moves.push({
			notify: !1,
			src: Path.join(a, d.relative),
			dest: Path.join(b, d.relative)
		});
		e(null, d)
	})
}

function _end(a) {
	var b = [];
	return EventStream.through(function (a) {
		b.push(a), this.emit("data", a)
	}, function () {
		this.emit("end", b, a)
	})
}

function AssetDB() {
	this._mounts = {}, this._libraryPath = "", this._uuidMappingsPath = "", this._uuidToMtime = {}, this._uuidToPath = {}, this._pathToUuid = {}, this._pathToSubUuids = {}, this._watchON = !1, this._watchState = WATCH_OFF, this._curWatcher = null, this._curTask = null, this._tasks = [], this.ready = !1
}
var Fs = require("fire-fs"),
	Path = require("fire-path"),
	Url = require("fire-url"),
	FsWatcher = require("fire-watch"),
	EventEmitter = require("events"),
	Async = require("async"),
	Del = require("del"),
	VinylFs = require("vinyl-fs"),
	VinylFile = require("vinyl"),
	VinylSource = require("vinyl-source-stream"),
	EventStream = require("event-stream"),
	Meta = require("./asset-db-meta"),
	WATCH_STARTING = "start-watching",
	WATCH_ON = "watch-on",
	WATCH_STOPPING = "stop-watching",
	WATCH_OFF = "watch-off";
Object.defineProperty(AssetDB.prototype, "watchState", {
	set: function (a) {
		this._watchState !== a && (this._watchState = a, Editor.sendToMainWindow("asset-db:watch-changed", {
			state: this._watchState
		}))
	},
	get: function () {
		return this._watchState
	}
}), AssetDB.prototype._url = function (a) {
	if (!a) return null;
	for (var b in this._mounts) {
		var c = this._mounts[b];
		if (Path.contains(c, a)) return Url.normalize(b + ":/" + a.slice(c.length))
	}
	return Url.normalize("file://" + a)
}, AssetDB.prototype._fspath = function (a) {
	if (!a) return null;
	var b = a.split(":");
	if (2 !== b.length) return Fire.warn("Invalid url " + a), null;
	var c = b[0],
		d = Path.normalize(b[1]);
	return this._mounts[c] ? Path.resolve(Path.join(this._mounts[c], d)) : (Fire.warn("Can not find the mounting " + c), null)
}, AssetDB.prototype._updateMtime = function (a) {
	var b = this.uuidToFspath(a);
	if (b) {
		var c = Fs.statSync(b).mtime.getTime(),
			d = Fs.statSync(b + ".meta").mtime.getTime();
		this._uuidToMtime[a] = {
			asset: c,
			meta: d
		}
	}
	else delete this._uuidToMtime[a];
	var e = JSON.stringify(this._uuidToMtime, null, 2);
	Fs.writeFile(this._uuidMappingsPath, e, "utf8", function (a) {
		return a ? void Fire.error(a) : void 0
	})
}, AssetDB.prototype._dbAdd = function (a, b) {
	this._uuidToPath[b] && Fire.warn("uuid collision, uuid = %s, collision = %s, path = %s", b, this._uuidToPath[b], a), this._pathToUuid[a] && Fire.warn("path collision, path = %s, collision = %s, uuid = ", a, this._pathToUuid[a], b), this._pathToUuid[a] = b, this._uuidToPath[b] = a
}, AssetDB.prototype._dbMove = function (a, b) {
	var c = this._pathToUuid[a];
	delete this._pathToUuid[a], this._pathToUuid[b] = c, this._uuidToPath[c] = b;
	var d = this._pathToSubUuids[a];
	if (d) {
		for (var e = 0; e < d.length; ++e) {
			var f = d[e],
				g = this._uuidToPath[f];
			delete this._pathToUuid[g];
			var h = Path.join(b, Path.basename(g));
			this._pathToUuid[h] = f, this._uuidToPath[f] = h
		}
		delete this._pathToSubUuids[a], this._pathToSubUuids[b] = d
	}
}, AssetDB.prototype._dbDelete = function (a, b) {
	var c = this._pathToUuid[a];
	if (delete this._pathToUuid[a], delete this._uuidToPath[c], b) {
		var d = this._pathToSubUuids[a];
		if (d) {
			for (var e = 0; e < d.length; ++e) {
				var f = d[e],
					g = this._uuidToPath[f];
				delete this._pathToUuid[g], delete this._uuidToPath[f]
			}
			delete this._pathToSubUuids[a]
		}
	}
}, AssetDB.prototype._dbAddChild = function (a, b) {
	var c = this._pathToSubUuids[a];
	c || (c = [], this._pathToSubUuids[a] = c), c.push(b)
}, AssetDB.prototype._dbDeleteChild = function (a, b) {
	var c = this._pathToSubUuids[a];
	if (c) {
		for (var d = 0; d < c.length; ++d)
			if (c[d] === b) {
				c.splice(d, 1);
				break
			}
		0 === c.length && delete this._pathToSubUuids[a]
	}
}, AssetDB.prototype._dbMoveChild = function (a, b, c) {
	var d = this._pathToUuid[b];
	delete this._pathToUuid[b], this._pathToUuid[c] = d, this._uuidToPath[d] = c;
	var e = this._pathToSubUuids[a];
	if (e)
		for (var f = 0; f < e.length; ++f) {
			var g = e[f],
				h = this._uuidToPath[g];
			if (h === b) {
				this._uuidToPath[g] = c;
				break
			}
		}
}, AssetDB.prototype._deleteLibraryFile = function (a, b) {
	var c = a.substring(0, 2),
		d = Path.join(this._libraryPath, c),
		e = Path.join(d, a);
	Del([e, e + ".*"], {
		force: !0
	}, function (a, c) {
		a && (Fire.error(a), b && b()), Fs.rmdir(d, function (a, b) {
			a && "ENOTEMPTY" !== a.code && "ENOENT" !== a.code && "EPERM" !== a.code && Fire.error(a)
		}), b && b()
	})
}, AssetDB.prototype.init = function (a) {
	Meta.init(), this._libraryPath = Path.join(a, "library");
	var b = Path.join(a, "assets");
	this.mount(b, "assets"), this._dbAdd(b, Editor.UUID.AssetsRoot), this._uuidMappingsPath = Path.join(this._libraryPath, "uuid-mappings.json");
	try {
		this._uuidToMtime = JSON.parse(Fs.readFileSync(this._uuidMappingsPath))
	}
	catch (c) {
		"ENOENT" === c.code && (this._uuidToMtime = {})
	}
}, AssetDB.prototype.loadMetaJson = function (a) {
	if (a === Editor.UUID.AssetsRoot) return null;
	var b = this.uuidToFspath(a);
	if (!b) return Fire.error("Failed to load meta by uuid, path not found. " + a), null;
	var c = Path.dirname(b),
		d = b + ".meta";
	if (this.fspathToSubUuids(c)) {
		for (var e = Meta.load(c), f = 0; f < e.subRawData.length; ++f) {
			var g = e.subRawData[f];
			if (g.meta.uuid === a) return Editor.serialize(g.meta)
		}
		return Fire.error("Failed to load meta by path " + d), null
	}
	return Fs.existsSync(d) ? Fs.readFileSync(d).toString() : (Fire.error("Failed to load meta by path " + d), null)
}, AssetDB.prototype.getLibraryPath = function () {
	return this._libraryPath
}, AssetDB.prototype.exists = function (a) {
	var b = this._fspath(a);
	return Fs.existsSync(b)
}, AssetDB.prototype.isRoot = function (a) {
	var b = a.indexOf("://");
	return a.indexOf("://") === a.length - 3
}, AssetDB.prototype.isFolder = function (a) {
	var b = this._fspath(a);
	return Fs.existsSync(b) ? Fs.statSync(b).isDirectory() : !1
}, AssetDB.prototype.isSubAsset = function (a) {
	return "" !== Url.extname(Url.dirname(a))
}, AssetDB.prototype.isValidUuid = function (a) {
	return void 0 !== this._uuidToPath[a]
}, AssetDB.prototype.fspath = function (a) {
	return this._fspath(a)
}, AssetDB.prototype.fspathToUuid = function (a) {
	return this._pathToUuid[a]
}, AssetDB.prototype.fspathToSubUuids = function (a) {
	return this._pathToSubUuids[a]
}, AssetDB.prototype.urlToUuid = function (a) {
	var b = this._fspath(a);
	return this.fspathToUuid(b)
}, AssetDB.prototype.uuidToFspath = function (a) {
	return this._uuidToPath[a]
}, AssetDB.prototype.uuidToUrl = function (a) {
	var b = this.uuidToFspath(a);
	return this._url(b)
}, AssetDB.prototype.uuidToLibraryPath = function (a) {
	return Path.join(this._libraryPath, a.substring(0, 2), a)
}, AssetDB.prototype.mountname = function (a) {
	var b = a.split(":");
	return 2 !== b.length ? (Fire.warn("Invalid url " + a), null) : b[0]
}, AssetDB.prototype.rootpath = function (a) {
	var b = this.mountname(a);
	if (!b) return null;
	var c = this._mounts[b];
	return c ? c : (Fire.warn("Can not find the mounting " + b), null)
}, AssetDB.prototype.makedirs = function (a) {
	var b = a.split(":");
	if (2 !== b.length) throw new Error("Invalid url " + a);
	var c = b[0],
		d = Path.normalize(b[1]),
		e = this._mounts[c];
	if (!e) throw new Error("Can not find the mount " + c);
	d[0] === Path.sep && (d = d.slice(1));
	for (var f = d.split(Path.sep), g = e, h, i = 0; i < f.length; ++i) {
		var j = f[i];
		if (g = Path.join(g, j), Fs.existsSync(g)) {
			var k = Fs.statSync(g);
			if (k.isDirectory() === !1) throw new Error("The path " + g + " is not a folder")
		}
		else {
			Fs.mkdirSync(g), h = Meta.create(g), Meta.saveSync(g, h), this._dbAdd(g, h.uuid);
			var l = this.fspathToUuid(Path.dirname(g));
			Editor.sendToWindows("folder:created", {
				url: this._url(g),
				uuid: h.uuid,
				parentUuid: l
			})
		}
	}
}, AssetDB.prototype.mount = function (a, b, c) {
	if (-1 !== ["http", "https", "files", "ftp"].indexOf(b)) return void Fire.warn("Can not use " + b + " for mounting");
	if (this._mounts[b]) {
		if (!c) return void Fire.warn("the mounting " + b + " already exists!");
		this.unmount(b)
	}
	this._mounts[b] = a, Fire.log("mount " + a + " as " + b)
}, AssetDB.prototype.unmount = function (a) {
	this._mounts[a] && (this._mounts[a] = null)
}, AssetDB.prototype.saveAsset = function (a, b, c) {
	if (this.isSubAsset(a)) return this.saveSubAsset(a, b, c);
	var d = this.rootpath(a);
	if (!d) throw new Error("Failed to save asset: " + a);
	var e = this._fspath(a);
	if (!e) throw new Error("Failed to save asset: " + a);
	var f = VinylSource(e);
	f.write(), setImmediate(function () {
		f.end()
	});
	var g = !Fs.existsSync(e),
		h = [],
		i = f.pipe(_exportAsset(b, c)).pipe(_saveMeta()).pipe(_importAsset()).on("data", function (a) {
			g ? (this._dbAdd(a.path, a.meta.uuid), h.push({
				command: "create",
				url: this._url(a.path),
				uuid: this.fspathToUuid(a.path),
				parentUuid: this.fspathToUuid(Path.dirname(a.path))
			})) : h.push({
				command: "change",
				url: this._url(a.path),
				uuid: this.fspathToUuid(a.path)
			})
		}.bind(this)).pipe(_importSubAssetsFromParent()).on("data", function (a) {
			if (g && a.meta.subRawData)
				for (var b = 0; b < a.meta.subRawData.length; ++b) {
					var c = a.meta.subRawData[b],
						d = c.asset,
						e = c.meta;
					this._dbAdd(Path.join(a.path, d.name + Meta.getDefautExtname(e)), e.uuid), this._dbAddChild(a.path, e.uuid), h.push({
						command: "create",
						url: this._url(Path.join(a.path, d.name + Meta.getDefautExtname(e))),
						uuid: e.uuid,
						parentUuid: this.fspathToUuid(a.path)
					})
				}
		}.bind(this)).pipe(_saveMeta()).pipe(_end(h));
	return i
}, AssetDB.prototype.saveSubAsset = function (a, b, c) {
	if (!this.isSubAsset(a)) throw new Error("This is not a sub-asset: " + a);
	var d = this._fspath(a);
	if (!d) throw new Error("Failed to save sub asset: " + a);
	var e = this.urlToUuid(a);
	if (!e) throw new Error("Failed to save sub asset: " + a);
	var f = VinylSource(d);
	f.write(""), setImmediate(function () {
		f.end()
	});
	var g = Fire.deserialize(b),
		h = Meta.loadByUuid(e),
		i = [],
		j = f;
	return j = j.pipe(_saveSubMeta(g, h)).pipe(_importSubAsset()).on("data", function (b) {
		i.push({
			command: "change",
			url: a,
			uuid: b.meta.uuid
		})
	}.bind(this)).pipe(_saveSubMeta()).pipe(_end(i))
}, AssetDB.prototype.applyAsset = function (a, b, c, d) {
	var e = Fire.deserialize(a),
		f = this.uuidToUrl(e.uuid);
	if (this.isSubAsset(f)) return this.applySubAsset(a, b);
	var g = this.rootpath(f);
	if (!g) throw new Error("Failed to apply asset: " + f);
	var h = this._fspath(f);
	if (!h) throw new Error("Failed to apply asset: " + f);
	var i = VinylFs.src(h, {
		cwd: h,
		base: g,
		nodir: !1,
		read: !1
	}).pipe(_saveMeta(e));
	if (d) {
		var j = Fire.deserialize(b);
		i = i.pipe(_exportAsset(Editor.serialize(j), c)).pipe(_saveMeta())
	}
	var k = [];
	return i = i.pipe(_importAsset()).on("data", function (a) {
		k.push({
			command: "change",
			url: f,
			uuid: a.meta.uuid
		})
	}.bind(this)).pipe(_importSubAssetsFromParent()).on("data", function (a) {
		var b, c, d, e, f;
		if (a.newSubRawData)
			for (b = 0; b < a.newSubRawData.length; ++b) c = a.newSubRawData[b], d = c.asset, e = c.meta, f = Path.join(a.path, d.name + Meta.getDefautExtname(e)), this._dbAdd(f, e.uuid), this._dbAddChild(a.path, e.uuid), k.push({
				command: "create",
				url: this._url(f),
				uuid: e.uuid,
				parentUuid: this.fspathToUuid(a.path)
			});
		if (a.oldSubRawData)
			for (b = 0; b < a.oldSubRawData.length; ++b) c = a.oldSubRawData[b], d = c.asset, e = c.meta, f = Path.join(a.path, d.name + Meta.getDefautExtname(e)), this._dbDelete(f, !1), this._dbDeleteChild(a.path, e.uuid), k.push({
				command: "delete",
				url: this._url(f),
				uuid: e.uuid
			})
	}.bind(this)).pipe(_deleteOldSubLibraryFile()).pipe(_saveMeta()).pipe(_end(k))
}, AssetDB.prototype.applySubAsset = function (a, b) {
	var c = Fire.deserialize(a),
		d = this.uuidToUrl(c.uuid);
	if (!this.isSubAsset(d)) throw new Error("This is not a sub-asset: " + d);
	var e = this._fspath(d);
	if (!e) throw new Error("Failed to apply asset: " + d);
	var f = Fire.deserialize(b),
		g = VinylSource(e);
	g.write(""), setImmediate(function () {
		g.end()
	});
	var h = [],
		i = g;
	return i = i.pipe(_saveSubMeta(f, c)).pipe(_importSubAsset()).on("data", function (a) {
		h.push({
			command: "change",
			url: d,
			uuid: a.meta.uuid
		})
	}.bind(this)).pipe(_saveSubMeta()).pipe(_end(h))
}, AssetDB.prototype.reimportExists = function (a) {
	var b = this.rootpath(a);
	if (!b) throw new Error("Failed to reimport-exists asset: " + a);
	var c = this._fspath(a);
	if (!c) throw new Error("Failed to reimport-exists asset: " + a);
	if (this.isFolder(a)) throw new Error("Failed to reimport-exists asset: " + a);
	if (!this.exists(a)) throw new Error("Failed to reimport-exists asset: " + a);
	var d = [],
		e = VinylFs.src(c, {
			cwd: c,
			base: b,
			nodir: !0,
			read: !1
		}).pipe(_importAsset()).on("data", function (a) {
			d.push({
				command: "change",
				url: this._url(a.path),
				uuid: a.meta.uuid
			})
		}.bind(this)).pipe(_importSubAssetsFromParent()).on("data", function (a) {
			var b, c, e, f, g;
			if (a.newSubRawData)
				for (b = 0; b < a.newSubRawData.length; ++b) c = a.newSubRawData[b], e = c.asset, f = c.meta, g = Path.join(a.path, e.name + Meta.getDefautExtname(f)), this._dbAdd(g, f.uuid), this._dbAddChild(a.path, f.uuid), d.push({
					command: "create",
					url: this._url(g),
					uuid: f.uuid,
					parentUuid: this.fspathToUuid(a.path)
				});
			if (a.oldSubRawData)
				for (b = 0; b < a.oldSubRawData.length; ++b) c = a.oldSubRawData[b], e = c.asset, f = c.meta, g = Path.join(a.path, e.name + Meta.getDefautExtname(f)), this._dbDelete(g, !1), this._dbDeleteChild(a.path, f.uuid), d.push({
					command: "delete",
					url: this._url(g),
					uuid: f.uuid
				})
		}.bind(this)).pipe(_deleteOldSubLibraryFile()).pipe(_saveMeta()).pipe(_end(d));
	return e
}, AssetDB.prototype.deepQuery = function (a, b) {
	var c = this.rootpath(a);
	if (!c) throw new Error("Failed to query assets: " + a);
	var d = this._fspath(a);
	if (!d) throw new Error("Failed to query assets: " + a);
	var e = ["**/!(*.meta)"],
		f = VinylFs.src(e, {
			cwd: d,
			base: c,
			nodir: !1,
			read: !1
		}).pipe(_end());
	return f
}, AssetDB.prototype.queryAssets = function (a, b) {
	var c = this.rootpath(a);
	if (!c) throw new Error("Failed to query assets: " + a);
	var d = this._fspath(a);
	if (!d) throw new Error("Failed to query assets: " + a);
	var e = null;
	b && (e = "Fire.Scene" === b ? ".fire" : Meta.getExtnames(Fire.JS._getClassById(b)));
	var f = [],
		g, h, i = new EventEmitter;
	return setImmediate(function () {
		for (var a in this._pathToUuid) {
			var b = Path.extname(a);
			"" !== b && Path.contains(d, a) && (h = this._pathToUuid[a], h && h !== Editor.UUID.AssetsRoot && e && -1 !== e.indexOf(b) && (g = {
				url: this._url(a),
				uuid: h
			}, f.push(g), i.emit("data", g)))
		}
		i.emit("end", f)
	}.bind(this)), i
}, AssetDB.prototype.deleteAsset = function (a) {
	var b = this.rootpath(a);
	if (!b) throw new Error("Failed to delete assets: " + a);
	var c = this._fspath(a);
	if (!c) throw new Error("Failed to delete assets: " + a);
	var d = [],
		e = [c, "**/!(*.meta)"],
		f = VinylFs.src(e, {
			cwd: c,
			base: b,
			nodir: !1,
			read: !1
		}).pipe(_depthFirst()).pipe(_deleteAsset()).pipe(_deleteLibraryFile()).on("data", function (a) {
			var b = this._url(a.path),
				c = this.fspathToUuid(a.path);
			d.push({
				url: b,
				uuid: c
			}), this._dbDelete(a.path, !0), this._updateMtime(c)
		}.bind(this)).pipe(_end(d));
	return f
}, AssetDB.prototype.moveSubAsset = function (a, b) {
	if (!this.isSubAsset(a)) throw new Error("This is not a sub-asset: " + a);
	if (Url.dirname(a) !== Url.dirname(b)) throw new Error("Only support move sub-asset under same main-asset: " + a);
	var c = Url.dirname(a),
		d = this._fspath(c);
	if (null === d) throw new Error("Failed to move sub-asset: " + a + ", main-asset not found!");
	var e = this._fspath(a);
	if (null === e) throw new Error("Failed to move asset: " + a);
	var f = this._fspath(b);
	if (null === f) throw new Error("Invalid dest url path: " + b);
	var g = [],
		h = VinylFs.src(d, {
			cwd: d,
			base: d,
			nodir: !1,
			read: !1
		}).pipe(_renameSubAsset(e, f)).on("data", function (a) {
			for (var b = 0; b < a.moves.length; ++b) {
				var c = a.moves[b];
				if (this._dbMoveChild(d, c.src, c.dest), c.notify) {
					var e = this._url(c.dest);
					g.push({
						uuid: Editor.AssetDB.urlToUuid(e),
						destUrl: e,
						destParentUuid: Editor.AssetDB.urlToUuid(Path.dirname(e))
					})
				}
			}
		}.bind(this)).pipe(_saveMeta()).pipe(_end(g));
	return h
}, AssetDB.prototype.moveAsset = function (a, b) {
	if (this.isSubAsset(a)) return this.moveSubAsset(a, b);
	var c = this._fspath(a);
	if (null === c) throw new Error("Failed to move asset: " + a);
	if (Fs.existsSync(c) === !1) throw new Error("Faield to move asset: " + a + ", the src url not exists.");
	var d = this._fspath(b);
	if (null === d) throw new Error("Invalid dest url path: " + b);
	if (Fs.existsSync(d) && a.toLowerCase() !== b.toLowerCase()) throw new Error("Faield to move asset to: " + b + ", the dest url already exists.");
	var e = this.rootpath(b);
	if (!e) throw new Error("Failed to move asset to: " + b);
	var f = Path.dirname(b);
	this.exists(f) === !1 && this.makedirs(f), Fs.renameSync(c, d), Fs.renameSync(c + ".meta", d + ".meta");
	var g = [],
		h = [d, Path.join(d, "**/!(*.meta)")],
		i = VinylFs.src(h, {
			cwd: d,
			base: d,
			nodir: !1,
			read: !1
		}).pipe(_moveAsset(c, d)).on("data", function (a) {
			for (var b = 0; b < a.moves.length; ++b) {
				var c = a.moves[b];
				if (this._dbMove(c.src, c.dest), c.notify) {
					var d = this._url(c.dest);
					g.push({
						uuid: Editor.AssetDB.urlToUuid(d),
						destUrl: d,
						destParentUuid: Editor.AssetDB.urlToUuid(Path.dirname(d))
					})
				}
			}
		}.bind(this)).pipe(_saveMeta()).pipe(_end(g));
	return i
}, AssetDB.prototype.clean = function (a, b) {
	var c = new EventEmitter;
	return setImmediate(function () {
		void 0 === b && (b = !0);
		var d = this._fspath(a),
			e = [],
			f, g;
		b && (g = this._pathToUuid[d], g && (this._dbDelete(d, !0), this._deleteLibraryFile(g), this._updateMtime(g), f = {
			url: this._url(d),
			uuid: g
		}, e.push(f), c.emit("data", f)));
		for (var h in this._pathToUuid) Path.contains(d, h) && (g = this._pathToUuid[h], g && g !== Editor.UUID.AssetsRoot && (this._dbDelete(h, !0), this._deleteLibraryFile(g), this._updateMtime(g), f = {
			url: this._url(h),
			uuid: g
		}, e.push(f), c.emit("data", f)));
		c.emit("end", e)
	}.bind(this)), c
}, AssetDB.prototype.refreshAll = function (a) {
	var b = Object.keys(this._mounts),
		c = this;
	Async.series([function (a) {
		Async.eachSeries(b, function (a, b) {
			var d = a + "://";
			c.loadPackageConfig(d).on("end", function () {
				b()
			})
		}, a)
	}, function (a) {
		Async.eachSeries(b, function (a, b) {
			var d = a + "://";
			c.precache(d).on("end", function () {
				b()
			})
		}, a)
	}, function (a) {
		Async.eachSeries(b, function (a, b) {
			var d = a + "://";
			Fire.log("Importing " + d), c.refresh(d, {
				force: !1
			}).on("end", function () {
				Fire.success(d + " imported!"), b()
			})
		}, a)
	}, function (a) {
		var b = [],
			d = Path.join(c._libraryPath, "**/*"),
			e = VinylFs.src(d, {
				cwd: c._libraryPath,
				base: c._libraryPath,
				nodir: !0,
				read: !1
			}).pipe(EventStream.through(function (a) {
				b.push(a), this.emit("data", a)
			}, function () {
				this.emit("end", b)
			})).on("end", function () {
				Async.each(b, function (a, b) {
					if ("" !== Path.extname(a.path)) return void b();
					var d = Path.basename(a.path);
					return c.isValidUuid(d) ? void b() : (Fire.log("remove unused uuid " + d), void c._deleteLibraryFile(d, function (a) {
						b()
					}))
				}, function (b) {
					a()
				})
			})
	}, function (a) {
		for (var b in c._uuidToMtime) {
			var d = Path.join(c._libraryPath, b.substring(0, 2), b);
			Fs.existsSync(d) || (delete c._uuidToMtime[b], Fire.log("remove unused mtime info: " + b))
		}
		var e = JSON.stringify(c._uuidToMtime, null, 2);
		Fs.writeFile(c._uuidMappingsPath, e, "utf8", function (b) {
			return b ? void Fire.error(b) : void a()
		})
	}], function (b) {
		if (b) throw b;
		a()
	})
}, AssetDB.prototype.loadPackageConfig = function (a) {
	var b = this.rootpath(a);
	if (!b) throw new Error("Failed to query assets from: " + a);
	var c = this._fspath(a);
	if (!c) throw new Error("Failed to query assets from: " + a);
	var d = [];
	d.push("**/package.json");
	var e = VinylFs.src(d, {
		cwd: c,
		base: b,
		nodir: !1,
		read: !1
	}).pipe(_loadOrCreateMeta()).on("data", function (a) {
		this._dbAdd(a.path, a.meta.uuid)
	}.bind(this)).pipe(_importAsset()).on("error", function (a) {
		this._dbDelete(a.path, !0)
	}.bind(this)).pipe(_saveMeta()).pipe(_end());
	return e
}, AssetDB.prototype.precache = function (a, b) {
	var c = this.rootpath(a);
	if (!c) throw new Error("Failed to query assets from: " + a);
	var d = this._fspath(a);
	if (!d) throw new Error("Failed to query assets from: " + a);
	var e = [];
	b = b || {}, b.includeSelf && e.push(d), e.push("**/*"), e.push("!**/package.json");
	var f = VinylFs.src(e, {
		cwd: d,
		base: c,
		nodir: !1,
		read: !1
	}).pipe(_loadOrCreateMeta()).on("data", function (a) {
		if (this._dbAdd(a.path, a.meta.uuid), a.meta.subRawData)
			for (var b = 0; b < a.meta.subRawData.length; ++b) {
				var c = a.meta.subRawData[b],
					d = c.asset,
					e = c.meta;
				this._dbAdd(Path.join(a.path, d.name + Meta.getDefautExtname(e)), e.uuid), this._dbAddChild(a.path, e.uuid)
			}
	}.bind(this)).pipe(_saveMeta()).pipe(_end());
	return f
}, AssetDB.prototype.refresh = function (a, b) {
	var c = this.rootpath(a);
	if (!c) throw new Error("Failed to query assets from: " + a);
	var d = this._fspath(a);
	if (!d) throw new Error("Failed to query assets from: " + a);
	var e = [];
	b = b || {}, b.includeSelf && e.push(d), e.push("**/*");
	var f = VinylFs.src(e, {
		cwd: d,
		base: c,
		nodir: !1,
		read: !1
	}).pipe(_precheck({
		filterMeta: !0
	})).pipe(_checkIfImport({
		force: b.force
	})).pipe(_importAsset()).on("error", function (a) {
		this._dbDelete(a.path, !0)
	}.bind(this)).pipe(_importSubAssetsFromParent()).on("data", function (a) {
		var b, c, d, e, f;
		if (a.newSubRawData)
			for (b = 0; b < a.newSubRawData.length; ++b) c = a.newSubRawData[b], d = c.asset, e = c.meta, f = Path.join(a.path, d.name + Meta.getDefautExtname(e)), this._dbAdd(f, e.uuid), this._dbAddChild(a.path, e.uuid);
		if (a.oldSubRawData)
			for (b = 0; b < a.oldSubRawData.length; ++b) c = a.oldSubRawData[b], d = c.asset, e = c.meta, f = Path.join(a.path, d.name + Meta.getDefautExtname(e)), this._dbDelete(f, !1), this._dbDeleteChild(a.path, e.uuid)
	}.bind(this)).pipe(_saveMeta()).pipe(_end());
	return f
}, AssetDB.prototype.importTo = function (a, b) {
	var c = this.rootpath(a);
	if (!c) throw new Error("Failed to query assets from: " + a);
	var d = this._fspath(a);
	if (!d) throw new Error("Failed to query assets from: " + a);
	for (var e = [], f = 0; f < b.length; ++f) {
		var g = b[f];
		Fs.copySync(g, d);
		var h = Path.basename(g);
		e.push(h), Fs.statSync(g).isDirectory() && e.push(Path.join(h, "**/*"))
	}
	var i = VinylFs.src(e, {
		cwd: d,
		base: c,
		nodir: !1,
		read: !1
	}).pipe(_precheck({
		filterMeta: !0
	})).pipe(_importAsset()).on("data", function (a) {
		this._dbAdd(a.path, a.meta.uuid)
	}.bind(this)).pipe(_importSubAssetsFromParent()).on("data", function (a) {
		if (a.meta.subRawData)
			for (var b = 0; b < a.meta.subRawData.length; ++b) {
				var c = a.meta.subRawData[b],
					d = c.asset,
					e = c.meta;
				this._dbAdd(Path.join(a.path, d.name + Meta.getDefautExtname(e)), e.uuid), this._dbAddChild(a.path, e.uuid)
			}
	}.bind(this)).pipe(_saveMeta()).pipe(_end());
	return i
}, AssetDB.prototype.mkdirForUuid = function (a) {
	if (!a || "" === a) return Fire.error("Invalid uuid!"), "";
	var b = a.substring(0, 2),
		c = Path.join(this._libraryPath, b);
	return Fs.existsSync(c) ? c : (Fs.mkdirSync(c), c)
}, AssetDB.prototype.saveJsonToLibrary = function (a, b, c) {
	var d = this.mkdirForUuid(a);
	if (d) try {
		var e = JSON.parse(Fs.readFileSync(b));
		b && Editor.serialize.setName(e, Path.basenameNoExt(b)), d = Path.join(d, a);
		var f = JSON.stringify(e, null, 2);
		Fs.writeFile(d, f, function (a) {
			c && c(a)
		})
	}
	catch (g) {
		return void(c && c(g))
	}
}, AssetDB.prototype.saveAssetToLibrary = function (a, b, c) {
	var d = this.mkdirForUuid(a);
	if (d) {
		d = Path.join(d, a);
		var e = Editor.serialize(b);
		Fs.writeFile(d, e, function (a) {
			c && c(a)
		})
	}
}, AssetDB.prototype.copyToLibrary = function (a, b, c, d) {
	var e = this.mkdirForUuid(a);
	e && (e = Path.join(e, a + b), Fs.copySync(c, e), d && d())
}, AssetDB.prototype._commitWatch = function () {
	return this._watchON && this.watchState === WATCH_OFF ? (this.watchState = WATCH_STARTING, void this.task("watch-on", function () {
		this._curWatcher = FsWatcher.start(this.fspath("assets://"), function () {
			this.watchState = WATCH_ON, this.taskDone(), this._commitWatch()
		}.bind(this)), this._curWatcher.on("changed", function (a) {
			0 !== a.length && this.task("sync-changes", function () {
				this.syncChanges(a, function () {
					this.taskDone()
				}.bind(this))
			})
		}.bind(this))
	})) : this._watchON === !1 && this.watchState === WATCH_ON ? (this.watchState = WATCH_STOPPING, void this.task("watch-off", function () {
		this._curWatcher.stop(function () {
			this._curWatcher = null, this.watchState = WATCH_OFF, this.taskDone(), this._commitWatch()
		}.bind(this))
	})) : void 0
}, AssetDB.prototype.watchON = function () {
	this._watchON = !0, this._commitWatch()
}, AssetDB.prototype.watchOFF = function () {
	this._watchON = !1, this._commitWatch()
}, AssetDB.prototype.syncChanges = function (a, b) {
	function c() {
		--h, 0 === h && b && b()
	}

	function d(a, b) {
		var c = Path.join(Path.dirname(a.path), Path.basenameNoExt(a.path));
		return "delete" === a.command ? void Fs.exists(c, function (a) {
			if (!a) return void b();
			var d = Meta.create(c, this.fspathToUuid(c));
			Meta.save(c, d, function () {
				Fire.warn("Restore meta %s (Currently meta can not 100% restore, this operation may cause data and subRawData lost)", c + ".meta"), b()
			})
		}.bind(this)) : "new" === a.command ? void Fs.exists(c, function (c) {
			return c ? void b() : void Fs.unlink(a.path, function () {
				Fire.warn("Delete unused meta file: %s", this._url(a.path)), b()
			})
		}.bind(this)) : "change" === a.command ? (Fire.warn("Meta edited %s (this operation is not safe)", Path.join(c, ".meta")), void b()) : void b()
	}

	function e(a, b) {
		var c = a.path + ".meta";
		Fs.existsSync(c) && (Fs.unlinkSync(c), Fire.warn("Delete unused meta file: %s", this._url(c))), this.clean(this._url(a.path)).on("end", function (a) {
			Editor.sendToAll("assets:deleted", {
				results: a
			}), b()
		})
	}

	function f(a, b) {
		var c = this._url(a.path),
			d = this;
		Async.series([function (a) {
			d.precache(c, {
				includeSelf: !0
			}).on("end", function () {
				a()
			})
		}, function (a) {
			d.refresh(c, {
				force: !0,
				includeSelf: !0
			}).on("end", function (b) {
				Editor.sendToAll("assets:created", {
					results: Editor.AssetDB.results(c, b)
				}), a()
			})
		}], function (a) {
			if (a) throw a;
			b()
		})
	}

	function g(a, b) {
		var c = this._url(a.path);
		this.reimportExists(c).on("end", function (a, c) {
			for (var d = [], e = 0; e < c.length; ++e) {
				var f = c[e];
				if ("change" === f.command) {
					Editor.sendToAll("asset:changed", {
						uuid: f.uuid,
						outside: !0
					});
					var g = this.fspathToSubUuids(this.fspath(f.url));
					if (g)
						for (var h = 0; h < g.length; ++h) Editor.sendToAll("asset:changed", {
							uuid: g[h],
							outside: !0
						})
				}
				else "create" === f.command ? Editor.sendToAll("asset:created", {
					url: f.url,
					uuid: f.uuid,
					"parent-uuid": f.parentUuid
				}) : "delete" === f.command && d.push({
					url: f.url,
					uuid: f.uuid
				})
			}
			d.length > 0 && Editor.sendToAll("assets:deleted", {
				results: d
			}), b()
		}.bind(this))
	}
	for (var h = 0, i = [], j = [], k = [], l = [], m = 0; m < a.length; ++m) {
		var n = a[m];
		".meta" !== Path.extname(n.path) ? "delete" !== n.command ? "new" !== n.command ? "change" !== n.command ? Fire.warn("Unknown changes %s, %s", n.command, n.path) : l.push(n) : k.push(n) : j.push(n) : i.push(n)
	}
	var o = this;
	Async.series([function (a) {
		Async.each(i, d.bind(o), a)
	}, function (a) {
		Async.each(j, e.bind(o), a)
	}, function (a) {
		Async.each(k, f.bind(o), a)
	}, function (a) {
		Async.each(l, g.bind(o), a)
	}], b)
}, AssetDB.prototype._commitTask = function () {
	if (!this._curTask) {
		if (0 === this._tasks.length) return void Editor.sendToAll("asset-db:synced");
		this._curTask = this._tasks.shift(), Editor.sendToAll("asset-db:syncing", {
			taskName: this._curTask.name
		});
		try {
			this._curTask.func.call(this)
		}
		catch (a) {
			Fire.error(a.message), this.taskDone()
		}
	}
}, AssetDB.prototype.task = function (a, b) {
	this._tasks.push({
		name: a,
		func: b
	}), this._commitTask()
}, AssetDB.prototype.taskDone = function () {
	this._curTask = null, this._commitTask()
}, AssetDB.prototype.results = function (a, b, c) {
	c = c || {
		parentInfo: !0
	};
	var d = [],
		e, f, g, h, i, j;
	b.sort(function (a, b) {
		return a.relative.localeCompare(b.relative)
	});
	for (var k = 0; k < b.length; ++k)
		if (e = b[k], f = Url.join(a, e.relative), g = this.fspathToUuid(e.path), g && (c.parentInfo && (h = Path.dirname(e.path), i = this.fspathToUuid(h), i || Fire.error("Can't find uuid for: " + h)), d.push({
				url: f,
				uuid: g,
				parentUuid: i,
				isDir: e.stat.isDirectory()
			}), j = this.fspathToSubUuids(e.path)))
			for (var l = 0; l < j.length; ++l) {
				var m = j[l];
				d.push({
					url: this.uuidToUrl(m),
					uuid: m,
					parentUuid: g,
					isDir: !1
				})
			}
	return d
}, require("./asset-db-ipc"), AssetDB.exportToGlobal = function () {
	return {
		get _libraryPath() {
			return Editor.AssetDB._libraryPath
		},
		_fspath: function (a) {
			return Editor.AssetDB.fspath(a)
		},
		isValidUuid: function (a) {
			return Editor.AssetDB.isValidUuid(a)
		},
		urlToUuid: function (a) {
			return Editor.AssetDB.urlToUuid(a)
		},
		loadMetaJson: function (a) {
			return Editor.AssetDB.loadMetaJson(a)
		},
		uuidToUrl: function (a) {
			return Editor.AssetDB.uuidToUrl(a)
		}
	}
}, module.exports = AssetDB;
