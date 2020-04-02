sap.ui.define(
		['sap/ui/core/Control', 'sap/m/Input', 'sap/m/Button', 'sap/ui/layout/HorizontalLayout', 'sap/ui/model/base/ManagedObjectModel'],
		function (Control, Input, Button, HorizontalLayout, ManagedObjectModel) {
	"use strict";

	var oSearchField = Control.extend("test.control.SearchFieldPlain", { // call the new Control type "my.Square" and let it inherit from sap.ui.core.Control
		metadata : {
			properties: {
				placeholder: { type: "string", defaultValue: "Enter Search Term..." },
				buttonText: { type: "string", defaultValue: "Search" }
			},
			events: {
				search: {
					parameters: {
						value: {type: "string"}
					}
				}
			},
			aggregations: {
				_layout: {type: "sap.ui.layout.HorizontalLayout", multiple: false, visibility: "hidden"}
			}
		},

		init: function() {
			var oModel = new ManagedObjectModel(this);
			var oInput = new Input(this.getId() + "-innerInput", {placeholder: "{$this>/placeholder}"});
			var oButton = new Button({text: "{$this>/buttonText}"});
			var oLayout = new HorizontalLayout({content: [oInput, oButton]});
			oLayout.setModel(oModel, "$this");
			this.setAggregation("_layout", oLayout);
		},

		exit: function() {
			this.getAggregation("_layout") && this.getAggregation("_layout").destroy();
		},

		renderer : function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.write(">");
			oRm.renderControl(oControl.getAggregation("_layout"));
			oRm.write("</div>");
		}
	});

	return oSearchField;
}, /* bExport= */ true);