sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/core/util/MockServer', 'sap/ui/model/odata/v2/ODataModel'
], function(Controller, MockServer, ODataModel) {
	"use strict";

	return Controller.extend("root.Example", {

		onInit: function() {
			var oMockServer = new MockServer({
				rootUri: "testsuite.personalization.example09/"
			});
			oMockServer.simulate("../../../../../../test-resources/sap/ui/comp/personalization/example09/mockserver/metadata.xml", "../../../../../../test-resources/sap/ui/comp/personalization/example09/mockserver/");
			oMockServer.start();

			this.getView().setModel(new ODataModel("testsuite.personalization.example09", true));
		},

		onBeforeRebindTable: function(oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			var oDataModel = oEvent.getSource().getModel();
			mBindingParams.sorter.forEach(function(oSorter) {
				if (oSorter.vGroup) {
					oSorter.fnGroup = function(oContext) {
						var oValue = oContext.getProperty(oSorter.sPath);
						var oData = oContext.getProperty(oContext.getPath());
						var sColumnLabel = oDataModel.getProperty('/#' + oData.__metadata.type + '/' + oSorter.sPath + '/@sap:label');
						return {
							key: (oSorter.sPath === "Date" ? oValue.toDateString() : oValue),
							text: sColumnLabel + ": " + (oSorter.sPath === "Date" ? oValue.toDateString() : oValue)
						};
					};
				}
			});
		},

		onExit: function() {
			this.oMockServer.stop();
		}
	});

});
