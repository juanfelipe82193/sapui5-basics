sap.ui.define(["sap/ui/core/Control"], function (Control) {
	"use strict";
	/**
	* Temporary notepad control to enable UI5 flexibility in list report.
	*/
	var FlexEnabler = Control.extend("sap.suite.ui.generic.template.lib.FlexEnabler", {
		metadata: {
			library: "sap.suite.ui.generic.template",
			designtime: "sap/suite/ui/generic/template/designtime/FlexEnabler.designtime",
			aggregations: {
				"content": {
					singularName: "content",
					multiple: false
				}
			},
			defaultAggregation: "content",
			properties: {
				/**
				 * Specifies whether the SAPUI5 flexibility features should be switched on.
				 */
				flexEnabled: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				}
				/* columnType: {
						type: "string",
						default: "DataField",
						values: [{
							"DataField": {
								name: { singular: "Field" }
							},
							"DataFieldWithUrl": {
								name: { singular: "Field with Url" }
							},
							"DataFieldForAction": {
								name: { singular: "Inline action" }
							},
							"RatingIndicator": {
								name: { singular: "Rating indicator"}
							}
						}]
					}*/
			},
			designTime: true
		},
		renderer: function (oRm, oControl) {			
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.write(">");
			// only temporarily to easily see, that we are really running with local sources
			oRm.write("<div>FlexEnabler</div>");
			var oAggregation = oControl.getAggregation("content");
			oRm.renderControl(oAggregation);
			oRm.write("</div>");
		}
	});

	return FlexEnabler;

});
