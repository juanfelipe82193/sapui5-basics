sap.ui.define([
	'sap/ui/core/mvc/Controller', "sap/ui/model/odata/OperationMode", "sap/ui/model/odata/v4/ODataModel", 'sap/ui/mdc/condition/ConditionModel'
], function(Controller, OperationMode, ODataModel, ConditionModel) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.filterbar.sample2.Test", {

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
		},

		onGetExternalizedConditions: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				oFB.getExternalizedConditions().then(function(mExtConditions) {
					var oOutput = this.getView().byId("getExternalizedConditionsId");
					if (oOutput) {
						oOutput.setValue(JSON.stringify(mExtConditions));
					}
				}.bind(this));
			}
		},


		_setExternalizedConditions: function(bClearModel) {
			var oInputJSON = null, oFB = this.getView().byId("testFilterBar");
			if (oFB) {

				var oInputput = this.getView().byId("setExternalizedConditionsId");
				if (oInputput) {
					oInputJSON = JSON.parse(oInputput.getValue());
				}

				if (oInputJSON) {
					oFB.setExternalizedConditions(oInputJSON, bClearModel).then(function() {});
				}
			}
		},

		onSetExternalizedConditions: function(oEvent) {
			this._setExternalizedConditions(false);
		},

		onSetExternalizedConditionsClear: function(oEvent) {
			this._setExternalizedConditions(true);
		}
	});
}, true);
