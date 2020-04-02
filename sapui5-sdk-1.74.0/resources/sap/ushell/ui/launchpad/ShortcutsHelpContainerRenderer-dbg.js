/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */

sap.ui.define([], function () {
    "use strict";

    var ShortcutsHelpContainerRenderer = {};

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
    ShortcutsHelpContainerRenderer.render = function (oRm, oControl) {
        var aContent = oControl.getContent() || [];

        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addClass("sapUshelShortcutsHelpContainer");
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl, {role: "group"});
        oRm.write(">");
        aContent.forEach(function (oElement) {
            var sContentClass = oElement.isA("sap.m.Label") ? "sapUshelShortcutsHelpContainerLabel" : "sapUshelShortcutsHelpContainerText";
            oRm.write("<div");
            oRm.addClass(sContentClass);
            oRm.writeClasses();
            oRm.write(">");
            oRm.renderControl(oElement);
            oRm.write("</div>");
        });
        oRm.write("</div>");
    };

    return ShortcutsHelpContainerRenderer;
}, /* bExport= */ true);