// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources"
], function (jQuery, resources) {
    "use strict";

    /**
     * @name AnchorNavigationBar renderer.
     * @static
     * @private
     */
    var AnchorNavigationBarRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     */
    AnchorNavigationBarRenderer.render = function (oRm, oControl) {
        oRm.write("<div");
        oRm.addClass("sapUshellAnchorNavigationBar");
        oRm.writeClasses();
        oRm.writeControlData(oControl);
        oRm.write(">");

        oRm.write("<div");
        oRm.addClass("sapUshellAnchorNavigationBarInner");
        oRm.writeClasses();
        oRm.write(">");

        if (oControl.getGroups().length > 0) {
            oControl._setRenderedCompletely(true);
            //left overflow arrow
            // overflow arrows are aria-hidden: the list items are available for the screen reader anyway
            oRm.write("<div");
            oRm.addClass("sapUshellAnchorLeftOverFlowButton");
            oRm.writeClasses();
            oRm.writeAccessibilityState(oControl._getOverflowLeftArrowButton(), { "hidden": true });
            oRm.write(">");
            oRm.renderControl(oControl._getOverflowLeftArrowButton());
            oRm.write("</div>");

            //anchor items
            oRm.write("<div");
            oRm.addClass("sapUshellAnchorNavigationBarItems");
            oRm.writeClasses();
            oRm.writeAccessibilityState(oControl, { role: "list" });
            oRm.write(">");

            oRm.write("<ul");
            oRm.addClass("sapUshellAnchorNavigationBarItemsScroll");
            oRm.writeClasses();
            oRm.writeAccessibilityState(oControl, {
                label: resources.i18n.getText("AnchorNavigationBar_AriaLabel"),
                role: "listbox"
            });
            oRm.write(">");
            this.renderAnchorNavigationItems(oRm, oControl);
            oRm.write("</ul>");

            oRm.write("</div>");

            //right overflow arrow
            oRm.write("<div");
            oRm.addClass("sapUshellAnchorRightOverFlowButton");
            oRm.writeClasses();
            oRm.writeAccessibilityState(oControl._getOverflowRightArrowButton(), { "hidden": true });
            oRm.write(">");
            oRm.renderControl(oControl._getOverflowRightArrowButton());
            oRm.write("</div>");

            //overflow popover button
            oRm.write("<div");
            oRm.addClass("sapUshellAnchorItemOverFlow");
            oRm.writeClasses();
            oRm.writeAccessibilityState(oControl._getOverflowButton(), { "hidden": true });
            oRm.write(">");
            oRm.renderControl(oControl._getOverflowButton());
            oRm.write("</div>");
        }

        oRm.write("</div>");

        oRm.write("</div>");
    };

    AnchorNavigationBarRenderer.renderAnchorNavigationItems = function (oRm, oControl) {
        var aGroups = oControl.getGroups();

        jQuery.each(aGroups, function () {
            oRm.renderControl(this);
        });
    };

    AnchorNavigationBarRenderer.shouldAddIBarContext = function () {
        return false;
    };

    return AnchorNavigationBarRenderer;
}, /* bExport= */ true);
