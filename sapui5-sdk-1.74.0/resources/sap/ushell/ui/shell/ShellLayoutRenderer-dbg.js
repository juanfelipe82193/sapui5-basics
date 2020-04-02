// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources"
], function (oResources) {
    "use strict";

    /**
     * Shell Layout renderer.
     * @namespace
     */
    var ShellLayoutRenderer = {
        apiVersion: 2
    };

    /**
     * Renders the HTML for the given shellLayout, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} shellLayout ShellLayout to be rendered.
     */
    ShellLayoutRenderer.render = function (rm, shellLayout) {
        var id = shellLayout.getId(),
            oFooter = shellLayout.getFooter();

        rm.openStart("div", shellLayout);
        rm.class("sapUshellShell");
        if (!shellLayout.getHeaderVisible()) {
            rm.class("sapUshellShellNoHead");
        }
        rm.class("sapUshellShellHead" + (shellLayout._showHeader ? "Visible" : "Hidden"));
        if (oFooter) {
            rm.class("sapUshellShellFooterVisible");
        }
        rm.openEnd(); // div - tag

        // Background
        rm.openStart("div");
        rm.style("z-index", "-2");
        rm.class("sapUiShellBackgroundImage");
        rm.class("sapUiGlobalBackgroundImageForce");
        rm.class("sapUshellShellBG");
        rm.class("sapContrastPlus");
        rm.openEnd(); // div - tag
        rm.close("div");
        if (shellLayout.getEnableCanvasShapes()) {
            rm.openStart("canvas", id + "-shapes");
            rm.attr("height", (window.innerHeight > 0) ? window.innerHeight : screen.height);
            rm.attr("width", (window.innerWidth > 0) ? window.innerWidth : screen.width);
            rm.attr("role", "presentation");
            rm.style("position", "absolute");
            rm.style("z-index", "-1");
            rm.openEnd(); // canvas - tag
            rm.close("canvas");
        }

        if (shellLayout.getToolArea()) {
            rm.openStart("aside");
            rm.attr("aria-hidden", true);
            rm.attr("aria-label", oResources.i18n.getText("ToolArea_AriaLabel"));
            rm.openEnd(); // aside - tag
            rm.renderControl(shellLayout.getToolArea());
            rm.close("aside");
        }

        if (shellLayout.getRightFloatingContainer()) {
            rm.openStart("aside");
            rm.attr("aria-hidden", true);
            rm.attr("aria-label", oResources.i18n.getText("FloatingContainer_AriaLabel"));
            rm.openEnd(); // aside - tag
            rm.renderControl(shellLayout.getRightFloatingContainer());
            rm.close("aside");
        }

        rm.openStart("div", id + "-cntnt");
        rm.class("sapUshellShellCntnt");
        rm.class("sapUshellShellCanvas");
        rm.openEnd(); // div - tag
        rm.renderControl(shellLayout.getCanvasSplitContainer());
        rm.close("div");

        rm.openStart("span", id + "-main-focusDummyOut");
        rm.attr("tabindex", "-1");
        rm.openEnd(); // span - tag
        rm.close("span");

        rm.renderControl(shellLayout.getFloatingActionsContainer());

        // Render the footer
        if (oFooter) {
            rm.openStart("footer");
            rm.class("sapMPageFooter");
            rm.openEnd(); // footer - tag
            if (oFooter._applyContextClassFor) {
                oFooter._applyContextClassFor("footer");
            }
            rm.renderControl(oFooter);
            rm.close("footer");
        }

        rm.close("div");
    };

    return ShellLayoutRenderer;
}, /* bExport= */ true);
