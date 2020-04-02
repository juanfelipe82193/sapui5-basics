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
        var AutoCompleteSuggestionContentRenderer = {};

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
        AutoCompleteSuggestionContentRenderer.render = function (oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapAstAutoCompleteSuggestionContentRenderer");
            oRm.writeClasses();
            oRm.write(">");
            var AutoCompleteSuggestionContentRenderer = oControl.getAggregation("mainLayout");
            oRm.renderControl(AutoCompleteSuggestionContentRenderer);
            oRm.write("</div>");

        };

        return AutoCompleteSuggestionContentRenderer;

    }, /* bExport= */ true);