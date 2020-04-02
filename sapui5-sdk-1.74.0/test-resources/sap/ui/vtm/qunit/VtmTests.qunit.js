/* global QUnit*/

sap.ui.define([
    "sap/ui/vtm/library"
], function(
    lib
) {
    "use strict";

    QUnit.test("vtmTests", function (assert) {
        var vtm = new sap.ui.vtm.createVtm();
        var panelId = "VtmTestId";
        var message;
        var expected;
        var actual;
        var panels = vtm.getPanels();
        expected = 0;
        actual = panels.length;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);
        vtm._addPanel(vtm.createPanel(panelId))
        expected = panelId;
        actual = vtm.getPanel(panelId).getId();
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);
        var panels = vtm.getPanels();
        expected = 1;
        actual = panels.length;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);
        var extensions = vtm.getExtensionsByName("sap.ui.vtm.extensions.SelectionLinkingExtension");
        assert.equal(1, extensions.length);
        var extension = vtm.getExtensionByName("sap.ui.vtm.extensions.SelectionLinkingExtension");
        assert.equal(extension, extensions[0]);
        extensions = vtm.getExtensionsByInterface("sap.ui.vtm.interfaces.ISelectionLinkingExtension");
        assert.equal(1, extensions.length);
        extension = vtm.getExtensionByInterface("sap.ui.vtm.interfaces.ISelectionLinkingExtension");
        assert.equal(extension, extensions[0]);
    });

    QUnit.done(function() {
        jQuery("#qunit-fixture").hide();
    });
});
