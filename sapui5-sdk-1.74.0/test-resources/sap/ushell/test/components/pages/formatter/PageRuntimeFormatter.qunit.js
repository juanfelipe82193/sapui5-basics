// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.formatter.PagesRuntimeFormatter
 */

/* global QUnit */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/components/pages/formatter/PageRuntimeFormatter",
    "sap/ui/Device"
], function (PageRuntimeFormatter, Device) {
    "use strict";

    QUnit.start();

    QUnit.module("The function _sectionVisibility", {
        beforeEach: function () {
            this.bOriginalDevicePhone = Device.system.phone;
            Device.system.phone = false;
        },
        afterEach: function () {
            Device.system.phone = this.bOriginalDevicePhone;
        }
    });

    QUnit.test("Returns true if visualizations are present", function (assert) {
        // Arrange
        var aVisualizations = [{
            vizId: "SOME_VIZ_ID",
            vizType: "sap.ushell.StaticAppLauncher",
            title: "My static app launcher tile",
            subTitle: "Opens an application",
            icon: "sap-icon://document",
            keywords: [],
            info: "",
            target: {}
        }];

        // Act
        var bSectionVisibility = PageRuntimeFormatter._sectionVisibility(aVisualizations);

        // Assert
        assert.strictEqual(bSectionVisibility, true, "The section visibility is true");
    });

    QUnit.test("Returns true if no visualizations are present in desktop mode", function (assert) {
        // Arrange
        var aVisualizations = [];

        // Act
        var bSectionVisibility = PageRuntimeFormatter._sectionVisibility(aVisualizations);

        // Assert
        assert.strictEqual(bSectionVisibility, true, "The section visibility is true");
    });

    QUnit.test("Returns false if no visualizations are present in phone mode", function (assert) {
        // Arrange
        var aVisualizations = [];
        Device.system.phone = true;

        // Act
        var bSectionVisibility = PageRuntimeFormatter._sectionVisibility(aVisualizations);

        // Assert
        assert.strictEqual(bSectionVisibility, false, "The section visibility is false");
    });

});