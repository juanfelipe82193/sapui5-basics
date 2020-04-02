// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.require([
    "sap/ushell/ui/shell/FloatingContainer",
    "sap/ushell/library"
], function (
    FloatingContainer
    // library
) {
    "use strict";

    var oFloatingContainer,
        oFloatingContainerDomRef,
        fnGetCoreRTLStub;

    module("sap.ushell.ui.shell.FloatingContainer", {
        // This method is called before each test
        setup: function () { },
        // This method is called after each test. Add every restoration code here
        teardown: function () {
            if (oFloatingContainer) {
                oFloatingContainer.destroy();
            }
            if (fnGetCoreRTLStub) {
                sap.ui.getCore().getConfiguration().getRTL = fnGetCoreRTLStub;
            }
        }
    });

    test("Test floating container init", function (assert) {
        var done = assert.async();
        oFloatingContainer = new FloatingContainer();
        oFloatingContainer.placeAt("sapUshellFloatingContainerWrapper");
        setTimeout(function () {
            assert.ok(oFloatingContainer, "Floating Container was created");
            assert.ok(oFloatingContainer.$()[0], "Floating container was rendered");
            done();
        }, 100);
    });

    test("Test floating container getWindowHeight function", function () {
        var oWindowHeight = window.innerHeight;
        oFloatingContainer = new FloatingContainer();
        ok(oFloatingContainer._getWindowHeight() === oWindowHeight, "getHeight is correct");
    });

    test("Test floating container setContainerHeight function", function (assert) {
        var done = assert.async();
        oFloatingContainer = new FloatingContainer();
        oFloatingContainer.placeAt("sapUshellFloatingContainerWrapper");

        setTimeout(function () {
            oFloatingContainerDomRef = oFloatingContainer.$();
            oFloatingContainer._setContainerHeight(oFloatingContainerDomRef, 25);
            assert.ok(oFloatingContainerDomRef.css("max-height") === "25px", "Floating container max height was set");
            done();
        }, 100);
    });

    test("Test floating container position after screen resize with RTL", function (assert) {
        var done = assert.async();
        oFloatingContainer = new FloatingContainer();
        oFloatingContainer.placeAt("sapUshellFloatingContainerWrapper");
        var oEvent = { width: "800", height: "800" },
            oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer"),
            oWrapper = document.getElementById("sapUshellFloatingContainerWrapper");
        fnGetCoreRTLStub = sap.ui.getCore().getConfiguration().getRTL;
        sap.ui.getCore().getConfiguration().getRTL = function () {
            return true;
        };

        setTimeout(function () {
            var jqContainer = jQuery(oFloatingContainer.getDomRef());
            jqContainer.height("400px");

            oWrapper.style.top = "0%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / oEvent.width * 100)), "container left position is correct");
            ok(oWrapper.style.top === "0%", "container top position is correct");

            // left side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "-10%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / oEvent.width * 100)), "left side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "left side is outside the viewport - container top position is correct");

            // top side is outside the viewport
            oWrapper.style.top = "-10%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / oEvent.width * 100)), "top side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "top side is outside the viewport - container top position is correct");

            // right side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "110%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(oWrapper.style.left = "100%", "right side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "right side is outside the viewport - container top position is correct");

            // down side is outside the viewport
            oWrapper.style.top = "100%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / oEvent.width * 100)), "down side is outside the viewport - container left position is correct");
            done();
        }, 100);
    });

    test("Test floating container position after screen drop with RTL", function (assert) {
        var done = assert.async();
        oFloatingContainer = new FloatingContainer();
        oFloatingContainer.placeAt("sapUshellFloatingContainerWrapper");
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer"),
            oWrapper = document.getElementById("sapUshellFloatingContainerWrapper");
        jQuery(oFloatingContainer.getDomRef());
        fnGetCoreRTLStub = sap.ui.getCore().getConfiguration().getRTL;
        sap.ui.getCore().getConfiguration().getRTL = function () {
            return true;
        };

        setTimeout(function () {
            var jqContainer = jQuery(oFloatingContainer.getDomRef());
            jqContainer.height("400px");

            oWrapper.style.top = "0%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / jQuery(window).width() * 100)), "container left position is correct");
            ok(oWrapper.style.top === "0%", "container top position is correct");

            // left side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "-10%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / jQuery(window).width() * 100)), "left side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "left side is outside the viewport - container top position is correct");

            // top side is outside the viewport
            oWrapper.style.top = "-10%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / jQuery(window).width() * 100)), "top side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "top side is outside the viewport - container top position is correct");

            // right side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "110%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            // calc left position
            ok(oWrapper.style.left = "100%", "right side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "right side is outside the viewport - container top position is correct");

            // down side is outside the viewport
            oWrapper.style.top = "100%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            // calc top position
            var windowHeight = jQuery(window).height(),
                topPos = windowHeight - 400, //container height
                topPosInPercentage = (topPos / windowHeight) * 100,
                topPosFinal = Number(topPosInPercentage.toFixed(2)), //leave 2 numbers after the decimal dot
                oWrapperTop = Number(oWrapper.style.top.replace("%", "")),
                resultsDiff = topPosFinal - oWrapperTop; // in different browsers there might be a diff of 0.1% and this is ok
            ok(Math.round(parseFloat(oWrapper.style.left)) === Math.round(parseFloat(jqContainer.width() / jQuery(window).width() * 100)), "down side is outside the viewport - container left position is correct");
            ok(Math.abs(resultsDiff) <= 0.1, "down side is outside the viewport - container top position is correct");
            done();
        }, 100);
    });

    test("Test floating container position after screen resize", function (assert) {
        var done = assert.async();
        oFloatingContainer = new sap.ushell.ui.shell.FloatingContainer();
        oFloatingContainer.placeAt("sapUshellFloatingContainerWrapper");
        var oEvent = { width: "800", height: "800" },
            oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer"),
            oWrapper = document.getElementById("sapUshellFloatingContainerWrapper");

        setTimeout(function () {
            var jqContainer = jQuery(oFloatingContainer.getDomRef());
            jqContainer.height("400px");

            oWrapper.style.top = "0%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(oWrapper.style.left === "0%", "container left position is correct");
            ok(oWrapper.style.top === "0%", "container top position is correct");

            // left side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "-10%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(oWrapper.style.left === "0%", "left side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "left side is outside the viewport - container top position is correct");

            // top side is outside the viewport
            oWrapper.style.top = "-10%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            ok(oWrapper.style.left === "0%", "top side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "top side is outside the viewport - container top position is correct");

            // right side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "100%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            // 800 - 416 (container width) = 384 => 48%
            ok(oWrapper.style.left === "48%", "right side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "right side is outside the viewport - container top position is correct");

            // down side is outside the viewport
            oWrapper.style.top = "100%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer._handleResize(oEvent);
            // 800 - 400 (container height) = 400 => 50%
            ok(oWrapper.style.left === "0%", "down side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "50%", "down side is outside the viewport - container top position is correct");
            done();
        }, 100);
    });

    test("Test floating container position after screen drop", function (assert) {
        var done = assert.async();
        oFloatingContainer = new FloatingContainer();
        oFloatingContainer.placeAt("sapUshellFloatingContainerWrapper");
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer"),
            oWrapper = document.getElementById("sapUshellFloatingContainerWrapper");

        setTimeout(function () {
            var jqContainer = jQuery(oFloatingContainer.getDomRef());
            jqContainer.height("400px");

            oWrapper.style.top = "0%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            ok(oWrapper.style.left === "0%", "container left position is correct");
            ok(oWrapper.style.top === "0%", "container top position is correct");

            // left side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "-10%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            ok(oWrapper.style.left === "0%", "left side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "left side is outside the viewport - container top position is correct");

            // top side is outside the viewport
            oWrapper.style.top = "-10%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            ok(oWrapper.style.left === "0%", "top side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "top side is outside the viewport - container top position is correct");

            // right side is outside the viewport
            oWrapper.style.top = "0%";
            oWrapper.style.left = "100%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            // calc left position
            var windowWidth = jQuery(window).width(),
                leftPos = windowWidth - 416, //container width
                leftPosInPercentage = (leftPos / windowWidth) * 100,
                leftPosFinal = Number(leftPosInPercentage.toFixed(2)), //leave 2 numbers after the decimal dot
                oWrapperLeft = Number(oWrapper.style.left.replace("%", "")),
                resultsDiff = leftPosFinal - oWrapperLeft; // in different browsers there might be a diff of 0.1% and this is ok
            ok(Math.abs(resultsDiff) <= 0.1, "right side is outside the viewport - container left position is correct");
            ok(oWrapper.style.top === "0%", "right side is outside the viewport - container top position is correct");

            // down side is outside the viewport
            oWrapper.style.top = "100%";
            oWrapper.style.left = "0%";
            oStorage.put("floatingContainerStyle", oWrapper.getAttribute("style"));

            oFloatingContainer.handleDrop();
            // calc top position
            var windowHeight = jQuery(window).height(),
                topPos = windowHeight - 400, //container height
                topPosInPercentage = (topPos / windowHeight) * 100,
                topPosFinal = Number(topPosInPercentage.toFixed(2)), //leave 2 numbers after the decimal dot
                oWrapperTop = Number(oWrapper.style.top.replace("%", "")),
                resultsDiff = topPosFinal - oWrapperTop; // in different browsers there might be a diff of 0.1% and this is ok
            ok(oWrapper.style.left === "0%", "down side is outside the viewport - container left position is correct");
            ok(Math.abs(resultsDiff) <= 0.1, "down side is outside the viewport - container top position is correct");
            done();
        }, 100);
    });
});
