sap.ui.define([
	'sap/ui/core/mvc/Controller', "sap/ui/model/odata/OperationMode", "sap/ui/model/odata/v4/ODataModel", 'mock/mockserver/mockServer', 'sap/ui/mdc/condition/ConditionModel'
], function(Controller, OperationMode, ODataModel, MockServer, ConditionModel) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.filterbar.sample1.Test", {

		onInit: function() {

			var sResourceUrl;
			sResourceUrl = "i18n/i18n.properties";
			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: sResourceUrl,
				bundleLocale: sLocale
			});
			this.getView().setModel(oResourceModel, "@i18n");

			this.getView().setModel(new ConditionModel(), "cm");

			var oFB = this.getView().byId("testFilterBar");
			sap.ui.getCore().getMessageManager().registerObject(oFB, true);
		},

		onSearch: function(oEvent) {

			var oListBinding = this.getView().byId("idTable").getBinding("items");

			if (oListBinding) {

				var mConditions = oEvent.getParameter("conditions");

				if (oListBinding.changeParameters) {
					oListBinding.changeParameters({ $search: mConditions.$search && mConditions.$search[0].values[0] });
				}

				var oFilterBar = oEvent.getSource(),
					oFilters = oFilterBar.getFilters();

				oListBinding.filter(oFilters);
			}
		},

		onFiltersChanged: function(oEvent) {
			var oText = this.getView().byId("statusText");
			if (oText) {
				oText.setText(oEvent.getParameters().filtersText);
			}
		},

		onChangeReqProperty: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				oFB.getPropertyInfoSet().some(function(oProperty) {
					if (oProperty.getName() === "Category") {
						oProperty.setRequired(!oProperty.getRequired());
						return true;
					}

					return false;
				});
			}
		},

		onChangeVisProperty: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				oFB.getPropertyInfoSet().some(function(oProperty) {
					if (oProperty.getName() === "Category") {
						oProperty.setVisible(!oProperty.getVisible());
						return true;
					}

					return false;
				});
			}
		}
	});
}, true);
