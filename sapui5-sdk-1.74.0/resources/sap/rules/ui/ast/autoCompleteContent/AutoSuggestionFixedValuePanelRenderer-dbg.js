/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global'],

    function (jQuery) {
        "use strict";

        /**
         * AutoSuggestionFixedValuePanelRenderer
         *  @namespace
         */
        var AutoSuggestionFixedValuePanelRenderer = {};

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
        AutoSuggestionFixedValuePanelRenderer.render = function (oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapAstFixedValuePanel");
            oRm.writeClasses();
            oRm.write(">");
            var AutoSuggestionFixedValuePanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(AutoSuggestionFixedValuePanelRenderer);
            oRm.write("</div>");

        };

        return AutoSuggestionFixedValuePanelRenderer;

    }, /* bExport= */ true);