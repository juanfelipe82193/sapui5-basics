sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/model/odata/v2/ODataModel', 'sap/ui/model/resource/ResourceModel', 'sap/m/SearchField', 'sap/ui/core/util/MockServer'
], function(Controller, ODataModel, ResourceModel, SearchField, MockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.example2.SmartFilterBar", {

		_smartFilterBar: null,

		onInit: function() {
			// var oModel = new ODataModel("/MockDataService", true);

			this._smartFilterBar = this.getView().byId("smartFilterBar");

			var sResourceUrl;
			sResourceUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar/i18n");
			sResourceUrl = sResourceUrl + "/i18n.properties";
			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oResourceModel = new ResourceModel({
				bundleUrl: sResourceUrl,
				bundleLocale: sLocale
			});
			this.getView().setModel(oResourceModel, "i18n");

			// Start Mockserver
			this._oMockServer = new MockServer({
				rootUri: "/MockDataService/"
			});
			var sMockdataUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar/mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			this._oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"LineItemsSet", "VL_SH_H_T001"
				]
			});
			this._oMockServer.start();

			var oModel = new sap.ui.model.odata.v2.ODataModel("/MockDataService", {
				json: true
			// , annotationURI: jQuery.sap.getResourcePath("../mockserver") + "/annotations.xml"
			});

			var oComp = this.getOwnerComponent();
			oComp.setModel(oModel);

			if (this._smartFilterBar) {

				var oBasicSearchField = new SearchField();
				oBasicSearchField.attachLiveChange(function(oEvent) {
					var oFB = this.getView().byId("smartFilterBar");
					oFB.fireFilterChange(oEvent);
				}.bind(this));

				this._smartFilterBar.setBasicSearch(oBasicSearchField);

			}
		},

		onAssignedFiltersChanged: function(oEvent) {
			var oStatusText = this.getView().byId("statusText");
			if (oStatusText && this._smartFilterBar) {
				var sText = this._smartFilterBar.retrieveFiltersWithValuesAsText();

				oStatusText.setText(sText);
			}
		},

		toggleUpdateMode: function() {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}

			this._smartFilterBar.setLiveMode(!bLiveMode);
		},

		_setButtonText: function() {

			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}
		}
	});
});
