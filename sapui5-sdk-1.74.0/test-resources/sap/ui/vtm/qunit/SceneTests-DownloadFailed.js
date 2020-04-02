/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

(function () {
    "use strict";

    var testName = "sceneTests-DownloadFailed";
    var testFunc = function (assert) {
        var vtm = new sap.ui.vtm.Vtm();
        var panel = vtm.getPanel("panel1");
        var scene = vtm.getScene();

        var viewableName = "Non Existant Viewable";
        var invalidViewable = new sap.ui.vtm.Viewable({
            source: "../models/nonexistantViewable.vds",
            name: viewableName
        });
        assert.ok(invalidViewable.getName() === viewableName);

        var viewableId = invalidViewable.getId();

        var done = assert.async();

        scene.attachDownloadCompleted(function (loadCompletedEvent) {
            var viewableLoadInfos = loadCompletedEvent.getParameter("viewableLoadInfos");
            assert.equal(1, viewableLoadInfos.length);

            var viewableLoadInfo = viewableLoadInfos[0];
            assert.equal(viewableId, viewableLoadInfo.getViewable().getId());
            assert.equal(sap.ui.vtm.ViewableLoadStatus.DownloadFailed, viewableLoadInfo.getStatus());
            assert.ok(viewableLoadInfo.getErrorCode() === "404");
            assert.ok(viewableLoadInfo.getErrorText());

            done();
        });

        scene.loadViewablesAsync([invalidViewable]);
    };

    if (QUnit.config.autostart !== false) {
        QUnit.config.autostart = false;
        QUnit.test(testName, testFunc);
        QUnit.start();
    } else {
        QUnit.test(testName, testFunc);
    }
})();