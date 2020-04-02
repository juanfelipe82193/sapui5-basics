// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/DeleteDialog.controller"
], function (DeleteDialogController) {
    "use strict";

    /* global QUnit */

    QUnit.module("DeleteDialog controller", {
        beforeEach: function () {
            this.oController = new DeleteDialogController();
        }
    });

    QUnit.test("external methods exist", function (assert) {
        assert.ok(this.oController.getModel, "The getModel method exists");
        assert.ok(this.oController.onCancel, "The onCancel method exists");
        assert.ok(this.oController.attachConfirm, "The attachConfirm method exists");
        assert.ok(this.oController.validate, "The validate method exists");
        assert.ok(this.oController.transportExtensionPoint, "The transportExtensionPoint method exists");
        assert.ok(this.oController.load, "The load method exists");
        assert.ok(this.oController.open, "The open method exists");
    });
});