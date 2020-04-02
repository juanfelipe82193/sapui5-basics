sap.ui.define([
	"sap/ui/core/sample/common/Component",
	"sap/ui/test/TestUtils",
	"sap/ui/model/odata/v4/ODataModel"
], function (BaseComponent, TestUtils, ODataModel) {
	"use strict";

	var Component = BaseComponent.extend("sap.ui.mdc.sample.field.odataV4.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 *
		 * @public
		 * @override
		 */
		init: function () {
			//Base component is prepared for sinon fake-server
			BaseComponent.prototype.init.apply(this);
			var sServiceUrl = "/fakev4/",
				sSourceBase = "sap/ui/mdc/sample/field/odataV4/mockservice",
				mFixture = {
					"$metadata": {source: "metadata.xml"},
					"ProductCollection('1239102')": {source: "FieldProduct.json"},
					"ProductCollection?$skip=0&$top=100": {source: "ProductCollection.json"},
					"StatusCollection?$skip=0&$top=100": {source: "StatusCollection.json"},
					"CountryCollection?$skip=0&$top=100": {source: "CountryCollection.json"},
					"RegionCollection?$skip=0&$top=100": {source: "RegionCollection.json"},
					"CityCollection?$skip=0&$top=100": {source: "CityCollection.json"}
				};

			TestUtils.setupODataV4Server(this.oSandbox, mFixture, sSourceBase, sServiceUrl);

			var oModel = new ODataModel({
				groupId: "$direct",
				operationMode: "Server",
				serviceUrl: TestUtils.proxy(sServiceUrl),
				synchronizationMode: "None"
			});

			this.setModel(oModel);
		},
		config: {
			sample: {
				stretch: true,
				files: [
					"Test.view.xml", "Test.controller.js"
				]
			}
		}
	});

	return Component;
});
