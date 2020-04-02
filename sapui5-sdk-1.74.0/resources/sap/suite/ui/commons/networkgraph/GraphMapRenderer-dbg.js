/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/Renderer','sap/ui/Device'],
	function (Renderer, Device) {
		"use strict";

		return {
			_appendHeightAndWidth: function (oNetworkGraphMap) {
				return "style=\"height:" + oNetworkGraphMap.getHeight() + ";width:" + oNetworkGraphMap.getWidth() + "\"";
			},
			render: function (oRM, oNetworkGraphMap) {
				oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphMap\"");
				oRM.write(this._appendHeightAndWidth(oNetworkGraphMap));
				oRM.writeControlData(oNetworkGraphMap);
				oRM.write(">");

				oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphMapTitle\">");

				oRM.write("<span class=\"sapSuiteUiCommonsNetworkGraphMapTitleText\">");
				oRM.writeEscaped(oNetworkGraphMap.getTitle());
				oRM.write("</span>");

				oRM.write("</div>");

				oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphMapContent\"");
				if (Device.browser.msie) {
					if (oNetworkGraphMap.getHeight()) {
						// IE is not recognizing the right: 0 offset applied to the absolutely-positioned flex container.
						// By row-reverse issue is fixed.
						oRM.write("style=\"flex-direction: row-reverse");
						// if user specifies height, fill content to its height (it would overflow otherwise)
						oRM.write(";height: 100%\"");
					} else {
						oRM.write("style=\"flex-direction: row-reverse\"");
					}
				} else {
					if (oNetworkGraphMap.getHeight()) {
						// if user specifies height, fill content to its height (it would overflow otherwise)
						oRM.write("style=\"height: 100%\"");
					}
				}
				oRM.write(">");
				oRM.write("</div>");

				oRM.write("</div>");
			}
		};
	}, true);
