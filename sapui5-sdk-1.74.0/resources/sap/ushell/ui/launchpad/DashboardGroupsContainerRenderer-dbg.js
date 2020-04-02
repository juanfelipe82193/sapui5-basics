// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/utils"
], function (utils) {
    "use strict";

    /**
     * @name DashboardGroupsContainer renderer.
     * @static
     * @private
     */
    var DashboardGroupsContainerRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRm the RenderManager that can be used for writing to the render
     *            output buffer
     * @param {sap.ui.core.Control}
     *            oControl an object representation of the control that should be
     *            rendered
     */
    DashboardGroupsContainerRenderer.render = function (oRm, oControl) {
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addClass("sapUshellDashboardGroupsContainer");

        if (oControl.getProperty("_gridEnabled")) {
            oRm.addClass("sapUshellDashboardGroupsContainerGrid");
        }

        oRm.writeClasses();
        if (oControl.getAccessibilityLabel()) {
            oRm.writeAccessibilityState(oControl, {
                role: "navigation",
                label: oControl.getAccessibilityLabel()
            });
        }
        oRm.write(">");

        var aGroups = oControl.getGroups();
        var oGroup;
        for (var i = 0; i < aGroups.length; i++) {
            oGroup = aGroups[i];
            oRm.write("<div");
            oRm.addClass("sapUshellDashboardGroupsContainerItem");
            if (oGroup.getIsGroupLocked() || oGroup.getDefaultGroup()) {
                oRm.addClass("sapUshellDisableDragAndDrop");
            }
            oRm.writeClasses();
            oRm.write(">");

            oRm.renderControl(oGroup);

            oRm.write("</div>");
        }

        utils.setPerformanceMark("FLP -- dashboardgroupscontainer renderer");
    };


	return DashboardGroupsContainerRenderer;

}, /* bExport= */ true);
