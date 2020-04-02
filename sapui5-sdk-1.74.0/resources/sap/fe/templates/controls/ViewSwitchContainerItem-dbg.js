/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	["sap/ui/core/Control"],
	function(Control) {
		"use strict";

		var ViewSwitchContainerItem = Control.extend("sap.fe.templates.controls.ViewSwitchContainerItem", {
			metadata: {
				properties: {
					iconurl: {
						type: "string"
					},
					toolbarId: {
						type: "string"
					},
					height: {
						type: "sap.ui.core.CSSSize"
					}
				},
				events: {},
				defaultAggregation: "content",
				aggregations: {
					content: {
						type: "sap.ui.core.Control",
						multiple: false,
						singularName: "content"
					}
				},
				publicMethods: []
			},
			renderer: {
				render: function(oRm, oControl) {
					var oContentControl = oControl.getContent();
					oRm.write("<div");
					oRm.writeControlData(oControl);
					oRm.write(' style="height: ' + oControl.getHeight() + '"');
					oRm.write(">");
					oRm.renderControl(oContentControl);
					oRm.write("</div>");
				}
			}
		});
		return ViewSwitchContainerItem;
	},
	/* bExport= */ true
);
