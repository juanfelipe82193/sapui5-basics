/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global'],

    function (jQuery) {
        "use strict";

        /**
         * DecisionTableSettings renderer.
         *  @namespace
         */
        var AutoSuggestionSelectFunctionPanelRenderer = {};

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
        AutoSuggestionSelectFunctionPanelRenderer.render = function (oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapAstSelectFunctionPanel");
            oRm.writeClasses();
            oRm.write(">");
            var AutoSuggestionSelectFunctionPanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(AutoSuggestionSelectFunctionPanelRenderer);
            oRm.write("</div>");

        };

        return AutoSuggestionSelectFunctionPanelRenderer;

    }, /* bExport= */ true);