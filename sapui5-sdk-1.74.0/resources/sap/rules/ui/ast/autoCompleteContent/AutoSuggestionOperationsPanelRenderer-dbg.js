/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global'],

    function(jQuery) {
        "use strict";

        /**
         * autoSuggestionOperationsRenderer renderer.
         *  @namespace
         */
        var autoSuggestionOperationsPanelRenderer = {};

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
        autoSuggestionOperationsPanelRenderer.render = function(oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapAstOperationsPanel");
            oRm.writeClasses();
            oRm.write(">");
            var autoSuggestionOperationsPanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(autoSuggestionOperationsPanelRenderer);
            oRm.write("</div>");

        };

        return autoSuggestionOperationsPanelRenderer;

    }, /* bExport= */ true);