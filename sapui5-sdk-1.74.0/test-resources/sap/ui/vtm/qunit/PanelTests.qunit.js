/* global QUnit*/

sap.ui.define([
    "sap/ui/vtm/Vtm"
], function(
    Vtm
) {
    "use strict";

    QUnit.test("panelTests", function (assert) {
        var panelId = "PanelTestId";
        var vtm = new Vtm();
        var panel = vtm.createPanel(panelId);
        vtm._addPanel(panel);

        assert.equal(null, vtm.getActivePanel());
        vtm.setActivePanel(panel);
        assert.equal(panel, vtm.getActivePanel());

        // panel id
        var expected = panelId;
        var actual = panel.getId();
        var message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        // title
        var title = "PanelTestTitle";
        panel.setTitle(title);
        expected = title;
        actual = panel.getTitle();
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        // title controls
        expected = [];
        actual = panel.getTitleControls();
        message = "\r\n" + expected.length + "\r\n" + actual.length + "\r\n";
        assert.equal(expected.length, actual.length, message);
        // set title controls
        var label = new sap.m.Label();
        panel.addTitleControl(label)
        actual = panel.getTitleControls();
        assert.ok(actual.length === 1 && actual[0] === label, message);


        // Vtm Id
        expected = vtm.getId();
        actual = panel.getVtm().getId();
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        // show/hide viewport
        // initial value
        expected = true;
        actual = panel.getShowViewport();
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);
        // setting same value
        panel.setShowViewport(true);
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);
        // setting different value
        panel.setShowViewport(false);
        expected = false;
        actual = panel.getShowViewport();
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);
        // set initial value back
        panel.setShowViewport(true);
        expected = true;
        actual = panel.getShowViewport();
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);


        // get Tree
        message = "\r\n" + "Fail to get sap.ui.vtm.Tree from Panel" + "\r\n";
        assert.ok(panel.getTree(), message);

        // get Viewport
        message = "\r\n" + "Fail to get sap.ui.vtm.Viewport from Panel" + "\r\n";
        assert.ok(panel.getViewport(), message);

        // getIsActive()
        var activePanel = vtm.getActivePanel();
        expected = activePanel === panel;
        actual = panel.getIsActive();
        assert.equal(expected, actual);

        vtm._setActivePanel(panel);
        expected = true;
        actual = panel.getIsActive();
        assert.equal(expected, actual);

        vtm._setActivePanel(null);
        expected = false;
        actual = panel.getIsActive();
        assert.equal(expected, actual);
    });

    QUnit.done(function() {
        jQuery("#qunit-fixture").hide();
    });
});
