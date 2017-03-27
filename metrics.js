var startTime,
    Editor = Editor || {};
Editor.Metrics = {
    trackDashboardOpen: function () {
        analytics && analytics.track("Dashboard Open")
    },
    trackEditorOpen: function () {
        startTime = new Date,
        analytics && analytics.track("Editor Open")
    },
    trackEditorClose: function () {
        var a = 1e3 * (new Date - startTime) / 60;
        analytics && analytics.track("Editor Close", {"Duration In Minutes": a})
    },
    trackCreateNewScene: function () {
        analytics && analytics.track("Create New Scene")
    },
    trackOpenScene: function () {
        analytics && analytics.track("Open Scene")
    },
    trackPlayInEditor: function () {
        analytics && analytics.track("Play In Editor")
    },
    trackBuild: function (a) {
        analytics && analytics.track("Build", {"Target Platform": a})
    },
    trackOpenCodeEditor: function () {
        analytics && analytics.track("Open Code Editor")
    }
};