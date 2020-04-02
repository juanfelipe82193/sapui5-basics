sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/core/util/MockServer', 'sap/ui/model/odata/v2/ODataModel'
], function(Controller, MockServer, ODataModel) {
	"use strict";

	return Controller.extend("root.Example", {

		onInit: function() {
			var oMockServer = new MockServer({
				rootUri: "testsuite.personalization.example07/"
			});
			oMockServer.simulate("../../../../../../test-resources/sap/ui/comp/personalization/example07/mockserver/metadata.xml", "../../../../../../test-resources/sap/ui/comp/personalization/example07/mockserver/");
			oMockServer.start();

			this.getView().setModel(new ODataModel("testsuite.personalization.example07", true));
		}
	});

});
