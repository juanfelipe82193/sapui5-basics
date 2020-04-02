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

	return UIComponent.extend("TextInEditModeSource.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			//OData model contains the actual data for the smartfields, using the mockserver
			this.oMockServer = new MockServer({
				rootUri: "odata/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();
			this.oModel = new ODataModel("odata");
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);

			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function(){
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