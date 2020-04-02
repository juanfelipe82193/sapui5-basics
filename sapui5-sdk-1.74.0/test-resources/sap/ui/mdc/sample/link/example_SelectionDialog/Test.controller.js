sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/mdc/link/SelectionDialog', 'sap/ui/mdc/link/SelectionDialogItem', 'sap/ui/model/json/JSONModel', 'sap/base/Log'
], function(Controller, SelectionDialog, SelectionDialogItem, JSONModel, Log) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.link.example_SelectionDialog.Test", {

		// Define initial data in oDataInitial structure which is used only in this  example.
		// In productive code, probably any table will be used in order to get the initial column information.
		oDataInitial: {
			// Runtime data
			ColumnsItems: [
				{
					columnKey: "name",
					text: "SAP",
					description: "Transaction NA",
					selected: true,
					icon: "sap-icon://employee",
					href: "https://www.sap.com",
					target: "_self"
				}, {
					columnKey: "category",
					text: "BMW",
					selected: false,
					href: "https://www.bmw.de",
					target: "_blank"
				}, {
					columnKey: "productId",
					text: "Product ID",
					selected: false,
					icon: "sap-icon://product",
					href: "#product",
					target: "_blank"
				}, {
					columnKey: "supplierName",
					text: "Supplier Name",
					selected: true,
					icon: "sap-icon://supplier",
					href: "#supplierName",
					target: "_blank"
				}, {
					columnKey: "description",
					text: "Description",
					description: "Transaction DESCR",
					selected: false,
					href: "#description",
					target: "_blank"
				}, {
					columnKey: "weightMeasure",
					text: "Weight Measure",
					selected: false,
					icon: "sap-icon://compare-2",
					href: "",
					target: "_blank"
				}, {
					columnKey: "weightUnit",
					text: "WeightUnit",
					selected: false,
					href: "",
					target: "_blank"
				}, {
					columnKey: "price",
					text: "Price",
					selected: false,
					icon: "sap-icon://money-bills",
					href: "#price",
					target: "_blank"
				}, {
					columnKey: "currencyCode",
					text: "Currency Code",
					description: "Transaction CURR",
					selected: false,
					href: "#currencyCode",
					target: "_blank"
				}, {
					columnKey: "status",
					text: "Status",
					selected: false,
					icon: "sap-icon://order-status",
					href: "",
					target: "_blank"
				}, {
					columnKey: "quantity",
					text: "Quantity",
					selected: false,
					href: "",
					target: "_blank"
				}, {
					columnKey: "uom",
					text: "UoM",
					selected: false,
					href: "",
					target: "_blank"
				}, {
					columnKey: "width",
					text: "Width",
					selected: false,
					href: "",
					target: "_blank"
				}, {
					columnKey: "depth",
					text: "Depth",
					selected: false,
					href: "",
					target: "_blank"
				}, {
					columnKey: "height",
					text: "Height",
					selected: false,
					icon: "sap-icon://increase-line-height",
					href: "",
					target: "_blank"
				}, {
					columnKey: "dimUnit",
					text: "DimUnit",
					selected: false,
					href: "",
					target: "_blank"
				}, {
					columnKey: "productPicUrl",
					text: "ProductPicUrl",
					selected: false,
					icon: "sap-icon://picture",
					href: "",
					target: "_blank"
				}
			],
			ShowResetEnabled: false
		},

		// Runtime model
		oJSONModel: null,

		oDataBeforeOpen: {},

		onInit: function() {
			this.oJSONModel = new JSONModel(jQuery.extend(true, {}, this.oDataInitial));
			this.oJSONModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this.getView().setModel(this.oJSONModel);
		},

		onPersonalizationDialogPress: function() {
			var oPersonalizationDialog = new SelectionDialog({
				showItemAsLink: this.getView().byId("IdCheckBox").getSelected(),
				showReset: true,
				showResetEnabled: {
					path: '/ShowResetEnabled'
				},
				items: {
					path: '/ColumnsItems',
					template: new SelectionDialogItem({
						key: "{columnKey}",
						text: "{text}",
						description: "{description}",
						href: "{href}",
						target: "{target}",
						icon: "{icon}",
						visible: "{selected}"
					})
				},
				visibilityChanged: function(oEvent) {
					Log.info("----------------------------------------");
					Log.info(oEvent.getParameter("key") + " switched " + (oEvent.getParameter("visible") ? "on" : "off"));

					this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedColumnsItems());
				}.bind(this),
				ok: function(oEvent) {
					this.oDataBeforeOpen = {};
					oEvent.getSource().close();
					oEvent.getSource().destroy();
				}.bind(this),
				cancel: function(oEvent) {
					this.oJSONModel.setProperty("/", jQuery.extend(true, [], this.oDataBeforeOpen));

					this.oDataBeforeOpen = {};
					oEvent.getSource().close();
					oEvent.getSource().destroy();
				}.bind(this),
				reset: function() {
					this.oJSONModel.setProperty("/", jQuery.extend(true, [], this.oDataInitial));
				}.bind(this)
			});
			oPersonalizationDialog.setModel(this.oJSONModel);

			this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedColumnsItems());
			this.getView().addDependent(oPersonalizationDialog);

			this.oDataBeforeOpen = jQuery.extend(true, {}, this.oJSONModel.getData());
			oPersonalizationDialog.open();
		},

		_isChangedColumnsItems: function() {
			var fnGetArrayElementByKey = function(sKey, sValue, aArray) {
				var aElements = aArray.filter(function(oElement) {
					return oElement[sKey] !== undefined && oElement[sKey] === sValue;
				});
				return aElements.length ? aElements[0] : null;
			};
			var fnGetUnion = function(aDataBase, aData) {
				if (!aData) {
					return jQuery.extend(true, [], aDataBase);
				}
				var aUnion = jQuery.extend(true, [], aData);
				aDataBase.forEach(function(oMItemBase) {
					var oMItemUnion = fnGetArrayElementByKey("columnKey", oMItemBase.columnKey, aUnion);
					if (!oMItemUnion) {
						aUnion.push(oMItemBase);
						return;
					}
					if (oMItemUnion.selected === undefined && oMItemBase.selected !== undefined) {
						oMItemUnion.selected = oMItemBase.selected;
					}
				});
				return aUnion;
			};
			var fnIsEqual = function(aDataBase, aData) {
				if (!aData) {
					return true;
				}
				if (aDataBase.length !== aData.length) {
					return false;
				}
				var aItemsNotEqual = aDataBase.filter(function(oDataBase, iIndex) {
					return oDataBase.columnKey !== aData[iIndex].columnKey || oDataBase.selected !== aData[iIndex].selected;
				});
				return aItemsNotEqual.length === 0;
			};

			var aDataRuntime = fnGetUnion(this.oDataInitial.ColumnsItems, this.oJSONModel.getProperty("/ColumnsItems"));
			return !fnIsEqual(aDataRuntime, this.oDataInitial.ColumnsItems);
		}
	});
}, true);
