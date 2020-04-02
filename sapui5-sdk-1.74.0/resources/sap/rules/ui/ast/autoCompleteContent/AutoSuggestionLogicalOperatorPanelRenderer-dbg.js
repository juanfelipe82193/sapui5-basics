/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global'],

    function (jQuery) {
        "use strict";

        /**
         * AutoSuggestionLogicalOperatorPanelRenderer
         *  @namespace
         */
        var AutoSuggestionLogicalOperatorPanelRenderer = {};

        /**
         * Renders the HTML for the given control, using the provided
         * {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} oRm
         *            the RenderManager that can be used for writing to
         *            the Render-Output-Buffer
         * @param {sap.ui.core.Control} oControl
         *            the control to be rendered
         */
        AutoSuggestionLogicalOperatorPanelRenderer.render = function (oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapAstLogicalOperatorPanel");
            oRm.writeClasses();
            oRm.write(">");
            var AutoSuggestionLogicalOperatorPanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(AutoSuggestionLogicalOperatorPanelRenderer);
            oRm.write("</div>");

        };

        return AutoSuggestionLogicalOperatorPanelRenderer;

    }, /* bExport= */ true);