sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/BindingMode"
], function (UIComponent, MockServer, ODataModel, BindingMode) {
	"use strict";

	return UIComponent.extend("test.sap.ui.comp.smartfield.Component", {
		metadata: {
			rootView: "test.sap.ui.comp.smartfield.SmartField",
			dependencies: {
				libs: [
					"sap.m",
					"sap.ui.comp"
				]
			},
			config: {
				sample: {
					files: [
						"SmartField.view.xml",
						"SmartField.controller.js",
						"mockserver/metadata.xml"
					]
				}
			}
		},

		init: function() {
			this.oMockServer = new MockServer({
				rootUri: "odata/"
			});

			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();
			this.oModel = new ODataModel("odata");
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		},

		exit: function() {

			if (this.oMockServer) {
				this.oMockServer.stop();
			}

			if (this.oModel) {
				this.oModel.destroy();
			}

			this.oMockServer = null;
			this.oModel = null;
		}
	});
});
