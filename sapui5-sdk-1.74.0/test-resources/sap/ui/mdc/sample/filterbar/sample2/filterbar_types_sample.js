sap.ui.require(["sap/ui/core/ComponentContainer", "sap/ui/mdc/sample/filterbar/sample2/ViewFactory", "sap/ui/model/odata/v4/ODataModel", "sap/ui/model/odata/OperationMode"],
	function(ComponentContainer, ViewFactory, ODataModel, OperationMode) {
	"use strict";


	sap.ui.getCore().attachInit(function () {

		sap.ui.require([
			'sap/ui/mdc/sample/filterbar/sample2/mockserver/mockServer'
		], function(MockServer) {

			var mModelOptions = {
					serviceUrl: "/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/",
					groupId: "$direct",
					synchronizationMode: 'None',
					//autoExpandSelect: true,
					operationMode: OperationMode.Server
				}, oModel = new ODataModel(mModelOptions), oMetaModel = oModel.getMetaModel();

			var oMockServer = new MockServer();

			oMockServer.started.then(function() {

				new ComponentContainer("TestContainer", {
					name: "sap.ui.mdc.sample.filterbar.sample2",
					settings: {
						id: "sap.ui.mdc.sample.filterbar.sample2"
					},
					height: "100%",
					async: true,
					componentCreated: function(oEvt) {
						var oContainer = oEvt.getSource();
						var oComp = oEvt.getParameter("component");
						oComp.setModel(oModel);
						ViewFactory.create({
							id: "IDView",
							viewName: "sap.ui.mdc.sample.filterbar.sample2.Test",
							height: "100%",
							async: true,
							preprocessors: {
								xml: {
									models: {
										collection: oMetaModel
									}
								}
							}
						}, oModel, oComp).then(function(View) {
							oContainer.rerender(); // needed to ensure we see something due to all the hacks here to make async view loading work
						});
					}
				}).placeAt("contentFB");

			});
		});
	});

});