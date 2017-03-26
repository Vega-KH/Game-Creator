function _saveTask(a, b, c) {
	Editor.AssetDB.task("save", function () {
		var d = b || null,
			e = c || null;
		Editor.AssetDB.saveAsset(a, d, e).on("end", function (a, b) {
			for (var c = 0; c < b.length; ++c) {
				var d = b[c];
				"create" === d.command ? Editor.sendToAll("asset:created", {
					url: d.url,
					uuid: d.uuid,
					"parent-uuid": d.parentUuid
				}) : "change" === d.command && Editor.sendToAll("asset:changed", {
					uuid: d.uuid
				}), Editor.sendToAll("asset:saved", {
					url: d.url,
					uuid: d.uuid
				})
			}
			Editor.AssetDB.taskDone()
		})
	})
}
var Shell = require("shell"),
	Path = require("fire-path"),
	Url = require("fire-url"),
	Fs = require("fire-fs"),
	Ipc = require("ipc");
Ipc.on("asset-db:explore", function (a) {
	var b = a.url,
		c = Editor.AssetDB.fspath(b);
	Shell.showItemInFolder(c)
}), Ipc.on("asset-db:explore-lib", function (a) {
	var b = a.url,
		c = Editor.AssetDB.urlToUuid(b);
	"" !== c && Shell.showItemInFolder(Editor.AssetDB.uuidToLibraryPath(c))
}), Ipc.on("asset-db:import", function (a) {
	var b = a["dest-url"],
		c = a.files;
	Editor.AssetDB.watchOFF(), Editor.AssetDB.task("import", function () {
		Editor.AssetDB.importTo(b, c).on("end", function (a) {
			Editor.sendToAll("assets:created", {
				results: Editor.AssetDB.results(b, a)
			}), Editor.AssetDB.taskDone(), Editor.mainWindow.isFocused || Editor.AssetDB.watchON()
		})
	})
}), Ipc.on("asset-db:reimport", function (a) {
	var b = a.url;
	Editor.AssetDB.task("reimport", function () {
		var a = Editor.AssetDB.isRoot(b),
			c = !0;
		a && (c = !1);
		var d = Editor.AssetDB.urlToUuid(b);
		Editor.AssetDB.clean(b, c).on("end", function (a) {
			return Editor.sendToAll("assets:deleted", {
				results: a
			}), Editor.AssetDB.exists(b) ? void Editor.AssetDB.precache(b, {
				includeSelf: c
			}).on("end", function () {
				Editor.AssetDB.refresh(b, {
					force: !0,
					includeSelf: c
				}).on("end", function (a) {
					Editor.sendToAll("assets:created", {
						results: Editor.AssetDB.results(b, a)
					}), Editor.AssetDB.taskDone()
				})
			}) : void Editor.AssetDB.taskDone()
		})
	})
}), Ipc.on("asset-db:delete", function (a) {
	var b = a.url;
	Editor.AssetDB.task("delete", function () {
		Editor.AssetDB.deleteAsset(b).on("end", function (a, b) {
			Editor.sendToAll("assets:deleted", {
				results: b
			}), Editor.AssetDB.taskDone()
		})
	})
}), Ipc.on("asset-db:move", function (a) {
	var b = a["src-url"],
		c = a["dest-url"];
	Editor.AssetDB.task("move", function () {
		Editor.AssetDB.moveAsset(b, c).on("end", function (a, b) {
			for (var c = 0; c < b.length; ++c) {
				var d = b[c];
				Editor.sendToAll("asset:moved", {
					uuid: d.uuid,
					"dest-url": d.destUrl,
					"dest-parent-uuid": d.destParentUuid
				})
			}
			Editor.AssetDB.taskDone()
		})
	})
}), Ipc.on("asset-db:save", function (a) {
	var b = a.url,
		c = a.json,
		d = a.buffer;
	_saveTask(b, c, d)
}), Ipc.on("asset-db:save-by-uuid", function (a) {
	var b = a.uuid,
		c = a.json,
		d = a.buffer,
		e = Editor.AssetDB.uuidToUrl(b);
	_saveTask(e, c, d)
}), Ipc.on("asset-db:new-folder", function (a) {
	Editor.AssetDB.makedirs(a.url)
}), Ipc.on("asset-db:new-script", function (a) {
	var b = a.url,
		c = a.template,
		d = Url.extname(b),
		e = Editor.url("fire://templates/" + c + d);
	Fs.readFile(e, function (a, c) {
		var d = new Fire.ScriptAsset;
		_saveTask(b, Editor.serialize(d), c)
	})
}), Ipc.on("asset-db:apply", function (a) {
	Editor.AssetDB.task("apply", function () {
		var b = a["meta-json"] || null,
			c = a["asset-json"] || null,
			d = a["asset-buffer"] || null,
			e = a["asset-dirty"] || !1;
		Editor.AssetDB.applyAsset(b, c, d, e).on("end", function (a, b) {
			for (var c = [], d = 0; d < b.length; ++d) {
				var e = b[d];
				"change" === e.command ? Editor.sendToAll("asset:changed", {
					uuid: e.uuid
				}) : "create" === e.command ? Editor.sendToAll("asset:created", {
					url: e.url,
					uuid: e.uuid,
					"parent-uuid": e.parentUuid
				}) : "delete" === e.command && c.push({
					url: e.url,
					uuid: e.uuid
				})
			}
			c.length > 0 && Editor.sendToAll("assets:deleted", {
				results: c
			}), Editor.AssetDB.taskDone()
		})
	})
}), Ipc.on("asset-db:query", function (a, b) {
	Editor.AssetDB.task("query", function () {
		var c = b.url,
			d = b["type-id"] || Fire.JS._getClassId(Fire.Asset);
		Editor.AssetDB.queryAssets(c, d).on("end", function (b) {
			a(b), Editor.AssetDB.taskDone()
		})
	})
}), Ipc.on("asset-db:deep-query", function (a, b) {
	var c = b.url;
	Editor.AssetDB.task("deep-query", function () {
		Editor.AssetDB.deepQuery(c).on("end", function (b) {
			var d = Editor.AssetDB.results(c, b);
			a(d), Editor.AssetDB.taskDone()
		})
	})
}), Ipc.on("asset-db:generate-unique-url", function (a, b) {
	var c = b.url,
		d = Url.dirname(c),
		e = Url.extname(c),
		f = Url.basename(c, e),
		g = " ";
	".js" === e && (g = "-");
	for (var h = 0, i = c; Editor.AssetDB.exists(i);) {
		++h;
		var j = Fire.padLeft(h, 3, "0");
		i = Url.join(d, f + g + j + e)
	}
	a(i)
});
