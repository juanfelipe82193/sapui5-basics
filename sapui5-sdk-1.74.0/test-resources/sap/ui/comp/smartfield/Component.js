sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/BindingMode"
], function (
	UIComponent,
	MockServer,
	ODataModel,
	BindingMode
) {
	"use strict";

	return UIComponent.extend("test.sap.ui.comp.smartfield.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// call the init function of the parent

			this.oMockServer = new MockServer({
				rootUri: "odata/"
			});

			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();
			this.oModel = new ODataModel("odata", true);
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);
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
