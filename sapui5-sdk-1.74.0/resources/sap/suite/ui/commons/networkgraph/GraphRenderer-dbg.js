/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/commons/library",
	"sap/base/security/encodeXML"
], function (library, encodeXML) {
	"use strict";

	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

	var BackgroundColor = library.networkgraph.BackgroundColor;

	return {
		_appendHeightAndWidth: function (oNetworkGraph) {
			return "style=\"height:" + oNetworkGraph.getHeight() + ";width:" + oNetworkGraph.getWidth() + "\"";
		},
		render: function (oRM, oNetworkGraph) {
			var sLayeredClass = oNetworkGraph._isLayered() ? " sapSuiteUiCommonsNetworkGraphLayered " : " sapSuiteUiCommonsNetworkGraphNotLayered ",
				bSwimLaneClass = oNetworkGraph._isSwimLane() ? " sapSuiteUiCommonsNetworkGraphSwimLane " : "";

			oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraph" + bSwimLaneClass + sLayeredClass + " \" tabindex=\"0\"");
			oRM.writeControlData(oNetworkGraph);
			oRM.write(this._appendHeightAndWidth(oNetworkGraph));
			this._writeAriaTags(oRM, oNetworkGraph);
			oRM.write(">");

			// toolbar
			oRM.renderControl(oNetworkGraph._toolbar);

			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-wrapper\" class=\"sapSuiteUiCommonsNetworkGraphContentWrapper\" tabindex=\"0\" aria-live=\"assertive\" role=\"application\">");

			/**
			 * Theoretically at this point we should use either aria-hidden or InvisibleText. This is a workaround for Jaws bug
			 * which causes the text to be read twice.
			 */
			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-accessibility\" class=\"sapSuiteUiCommonsNetworkGraphContentWrapperAccessibility\">");
			oRM.write(encodeXML(oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_CONTENT")));
			oRM.write("</div>");

			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-scroller\" class=\"sapSuiteUiCommonsNetworkGraphScroller");
			oRM.write(oNetworkGraph.getBackgroundColor() === BackgroundColor.White ? " sapSuiteUiCommonsNetworkGraphBackgroundWhite" : " sapSuiteUiCommonsNetworkGraphBackgroundDefault");
			oRM.write("\">");

			if (oNetworkGraph.getNoData()) {
				this._renderNoData(oRM, oNetworkGraph);
				oRM.write("</div>");
				oRM.write("</div>");
				return;
			}

			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-innerscroller\" class=\"sapSuiteUiCommonsNetworkGraphInnerScroller");
			oRM.write("\"");

			if (oNetworkGraph._isTwoColumnsLayout()) {
				oRM.write("style=\"width: 100%;\"");
			}

			oRM.write(">");

			// line tooltip
			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-tooltiplayer\" class=\"sapSuiteUiCommonsNetworkGraphTooltips\">");
			oRM.write("<div style=\"display:none\" id=\"" + oNetworkGraph.getId() + "-divlinebuttons\" class=\"sapSuiteUiCommonsNetworkGraphLineButtons\">");
			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-linetooltip\" class=\"sapSuiteUiCommonsNetworkGraphLineTooltip\"></div>");
			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-linetooltipbuttons\" class=\"sapSuiteUiCommonsNetworkGraphLineActionButtons\"></div>");
			oRM.write("</div>");
			oRM.write("</div>");

			// groups
			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-divgroups\" class=\"sapSuiteUiCommonsNetworkGraphDivGroups\">");
			oRM.write("</div>");

			// nodes
			var sStyle = "style=\"opacity: 0\"";
			if (oNetworkGraph._isUseNodeHtml()) {
				oRM.write("<div id=\"" + oNetworkGraph.getId() + "-divnodes\" class=\"sapSuiteUiCommonsNetworkGraphDivNodes\" " + sStyle + ">");
				oRM.write("</div>");
			}

			oRM.write("</div>");

			oRM.write("</div>");
			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-ctrlalert\" class=\"sapSuiteUiCommonsNetworkAlertWrapper\">");
			oRM.write("<p class=\"sapSuiteUiCommonsNetworkAlertText\">" + encodeXML(oResourceBundle.getText("NETWORK_GRAPH_ZOOMCTRL")) + "</p>");
			oRM.write("</div>");

			oRM.write("<div id=\"" + oNetworkGraph.getId() + "-legend\" style=\"display:none\" class=\"sapSuiteUiCommonsNetworkGraphLegend\" >");
			if (oNetworkGraph.getLegend()) {
				oRM.renderControl(oNetworkGraph.getLegend());
			}

			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");
		},
		_writeAriaTags: function (oRM, oNetworkGraph) {
			var aAriaLabelledBy = oNetworkGraph.getAriaLabelledBy(),
				aAriaDescribedBy = oNetworkGraph.getAriaDescribedBy();
			if (aAriaLabelledBy.length > 0) {
				oRM.writeAttributeEscaped("aria-labelledby", aAriaLabelledBy.join(" "));
			} else {
				oRM.writeAttributeEscaped("aria-label", oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_LABEL"));
			}
			if (aAriaDescribedBy.length > 0) {
				oRM.writeAttributeEscaped("aria-describedby", aAriaDescribedBy.join(" "));
			}
		},
		_renderNoData: function (oRM, oNetworkGraph) {
			oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphNoDataWrapper\">");
			oRM.write(oNetworkGraph._renderHtmlIcon("sap-icon://document", "sapSuiteUiCommonsNetworkGraphNoDataIcon"));

			var sText = oNetworkGraph.getNoDataText(),
				sTextInline = sText ? sText : oResourceBundle.getText("NETWORK_GRAPH_NO_DATA");

			oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphNoDataLabel\">");
			oRM.writeEscaped(sTextInline);
			oRM.write("</div>");
			oRM.write("</div>");
		}
	};
}, true);
