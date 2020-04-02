// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.applications.PageComposer.controller.BaseDialogController
 */

/* global QUnit */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/BaseDialog.controller"
], function (BaseDialogController) {
    "use strict";

    QUnit.start();
    QUnit.module("BaseDialog controller validate", {
        beforeEach: function () {
            this.oController = new BaseDialogController();
        }
    });

    QUnit.test("should return false if one value is false", function (assert) {
        var bResult = this.oController.validate({
            a: true,
            b: false
        });
        assert.strictEqual(false, bResult, "The result was false");
    });

    QUnit.test("should return true if all values are true", function (assert) {
        var bResult = this.oController.validate({
            a: true,
            b: true
        });
        assert.strictEqual(true, bResult, "The result was true");
    });
});