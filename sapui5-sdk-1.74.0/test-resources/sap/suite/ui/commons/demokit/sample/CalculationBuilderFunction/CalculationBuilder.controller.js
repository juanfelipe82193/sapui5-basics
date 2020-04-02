sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem"
], function (Controller, JSONModel, MessagePopover, MessagePopoverItem) {
	"use strict";


	var oPageController = Controller.extend("sap.suite.ui.commons.sample.CalculationBuilderFunction.CalculationBuilder", {
		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.CalculationBuilderFunction", "/data.json"));
			this.getView().setModel(oModel);
			this._oBuilder = this.getView().byId("builder");

			this._oMessagePopover = new MessagePopover();
			this.getView().addDependent(this._oMessagePopover);

			// this is how you can disable functions you don't support
			this._oBuilder.allowFunction("abs", false);
		},
		validateFunction: function (oEvent) {
			var oFunction = oEvent.getParameter("definition");

			this._aErrors = [];
			this._oResult = oEvent.getParameter("result");

			this.validatePart(oFunction);
		},
		validatePart: function (oFunction) {
			var iFrom = 0,
				aItems = oFunction.items,
				nParameters = 1;
			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];

				if (oItem.item.getKey() === ",") {
					nParameters++;
					this._oResult.addErrors(this._oBuilder.validateParts({
						from: aItems[0].index,
						to: aItems[i].index
					}));

					iFrom = i + 1;
				}
			}

			if (nParameters !== 2) {
				this._oResult.addError({
					index: oFunction.index,
					title: "Custom Function supports only two parameters"
				});
			}

			if (iFrom !== i) {
				this._oResult.addErrors(this._oBuilder.validateParts({
					from: aItems[0].index,
					to: aItems[i - 1].index
				}));
			}
		},
		afterValidation: function (oEvent) {
			// here you can add your overall validation
			var aItems = this._oBuilder.getItems(),
				oFirstItem = aItems[0];

			if (!oFirstItem || oFirstItem.getKey() !== "+") {
				this._oBuilder.appendError({
					index: 0,
					title: "Example custom error - expression has to start with '+'"
				});
			}

			this._oMessagePopover.removeAllItems();
			var aErrors = this._oBuilder.getErrors();
			if (aErrors.length > 0) {
				aErrors.forEach(function (oError) {
					this._oMessagePopover.addItem(new MessagePopoverItem({
						type: "Error",
						title: oError.title
					}));
				}.bind(this));
			}

			this.getView().byId("messageButton").setText(aErrors.length);
		},
		handleMessagePopoverPress: function (oEvent) {
			this._oMessagePopover.toggle(oEvent.getSource());
		}
	});

	return oPageController;
});
