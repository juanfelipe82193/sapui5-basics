sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'
], function(UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("applicationUnderTestP13nColumnsPanel.Component", {

		metadata : {
			rootView: {
				viewName: "view.Main",
				type: "XML",
				async: true,
				id: "IDView"
			}
		},

		init : function() {

			this.oMockServer = new MockServer({
				rootUri: "mockserver/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();


			UIComponent.prototype.init.apply(this, arguments);
		}
	});
});