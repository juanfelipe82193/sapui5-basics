sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/mdc/base/filterbar/AdaptFiltersDialog', 'sap/ui/mdc/base/filterbar/AdaptFiltersDialogItem', 'sap/ui/model/json/JSONModel', 'sap/base/Log'
], function(Controller, AdaptFiltersDialog, AdaptFiltersDialogItem, JSONModel, Log) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.filterbar.adaptFiltersDialog.Test", {

		// Define initial data in oDataInitial structure which is used only in this  example.
		// In productive code, probably any table will be used in order to get the initial column information.
		oDataInitial: {
			// Runtime data
			ColumnsItems: [
				{
					key: "bmw",
					text: "BMW",
					visible: false,
					subItems: [
						{
							dataType: "bmw",
							editMode: sap.ui.mdc.EditMode.Editable,
							required: true
						}
					]
				}, {
					key: "sap",
					text: "SAP",
					tooltip: "Transaction NA",
					visible: true,
					relativePosition: 0,
					required: true,
					subItems: [
						{
							dataType: "sap",
							editMode: sap.ui.mdc.EditMode.Editable,
							required: false
						}
					]
				}, {
					key: "productId",
					text: "Product ID",
					visible: false,
					subItems: [
						{
							dataType: "productId"
						}
					]
				}, {
					key: "supplierName",
					text: "Supplier Name",
					visible: true,
					relativePosition: 1,
					subItems: [
						{
							dataType: "supplierName"
						}
					]
				}, {
					key: "description",
					text: "Description",
					tooltip: "Transaction DESCR",
					visible: false,
					subItems: [
						{
							dataType: "description"
						}
					]
				}, {
					key: "weightMeasure",
					text: "Weight Measure",
					visible: false,
					subItems: [
						{
							dataType: "weightMeasure"
						}
					]
				}, {
					key: "weightUnit",
					text: "WeightUnit",
					visible: false,
					subItems: [
						{
							dataType: "weightUnit"
						}
					]
				}, {
					key: "price",
					text: "Price",
					visible: false,
					subItems: [
						{
							dataType: "price"
						}
					]
				}, {
					key: "currencyCode",
					text: "Currency Code",
					tooltip: "Transaction CURR",
					visible: false,
					subItems: [
						{
							dataType: "currencyCode"
						}
					]
				}, {
					key: "status",
					text: "Status",
					visible: false,
					subItems: [
						{
							dataType: "status"
						}
					]
				}, {
					key: "quantity",
					text: "Quantity",
					visible: false,
					subItems: [
						{
							dataType: "quantity"
						}
					]
				}, {
					key: "uom",
					text: "UoM",
					visible: false,
					subItems: [
						{
							dataType: "uom"
						}
					]
				}, {
					key: "width",
					text: "Width",
					visible: false,
					subItems: [
						{
							dataType: "width"
						}
					]
				}, {
					key: "depth",
					text: "Depth",
					visible: false,
					subItems: [
						{
							dataType: "depth"
						}
					]
				}, {
					key: "height",
					text: "Height",
					visible: false,
					subItems: [
						{
							dataType: "height"
						}
					]
				}, {
					key: "dimUnit",
					text: "DimUnit",
					visible: false,
					subItems: [
						{
							dataType: "dimUnit"
						}
					]
				}, {
					key: "productPicUrl",
					text: "ProductPicUrl",
					visible: false,
					subItems: [
						{
							dataType: "productPicUrl"
						}
					]
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

		onAdaptFiltersDialogPress: function() {
			var oAdaptFiltersDialog = new AdaptFiltersDialog({
				showReset: true,
				showResetEnabled: {
					path: '/ShowResetEnabled'
				},
				items: {
					path: '/ColumnsItems',
					templateShareable: false,
					template: new AdaptFiltersDialogItem({
						key: "{key}",
						text: "{text}",
						tooltip: "{tooltip}",
						required: "{required}",
						visible: "{visible}",
						relativePosition: "{relativePosition}"
					})
				},
				visibilityChanged: function(oEvent) {
					Log.info("----------------------------------------");
					Log.info(oEvent.getParameter("key") + " switched " + (oEvent.getParameter("visible") ? "on" : "off"));
					// this._print();
					this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedColumnsItems());
				}.bind(this),
				positionChanged: function(oEvent) {
					Log.info("----------------------------------------");
					Log.info(oEvent.getParameter("key") + " has the position " + oEvent.getParameter("relativePosition"));
					// this._print();
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
					oAdaptFiltersDialog.initialize();
				}.bind(this)
			});
			oAdaptFiltersDialog.setModel(this.oJSONModel);
			oAdaptFiltersDialog.getItems().forEach(function(oItem) {
				var sModelName = (oAdaptFiltersDialog.getBindingInfo("items") || {}).model;
				var oBindingObject = oItem.getBindingContext(sModelName).getObject();
				oItem.addControl(new sap.m.Input({
					value: oBindingObject.subItems[0].dataType,
					editable: oBindingObject.subItems[0].editMode === sap.ui.mdc.EditMode.Editable
				}));
			});

			this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedColumnsItems());
			this.getView().addDependent(oAdaptFiltersDialog);

			this.oDataBeforeOpen = jQuery.extend(true, {}, this.oJSONModel.getData());
			oAdaptFiltersDialog.open();
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
					var oMItemUnion = fnGetArrayElementByKey("key", oMItemBase.key, aUnion);
					if (!oMItemUnion) {
						aUnion.push(oMItemBase);
						return;
					}
					if (oMItemUnion.visible === undefined && oMItemBase.visible !== undefined) {
						oMItemUnion.visible = oMItemBase.visible;
					}
					if (oMItemUnion.relativePosition === undefined && oMItemBase.relativePosition !== undefined) {
						oMItemUnion.relativePosition = oMItemBase.relativePosition;
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
					return oDataBase.key !== aData[iIndex].key || oDataBase.visible !== aData[iIndex].visible || oDataBase.relativePosition !== aData[iIndex].relativePosition;
				});
				return aItemsNotEqual.length === 0;
			};

			var aDataRuntime = fnGetUnion(this.oDataInitial.ColumnsItems, this.oJSONModel.getProperty("/ColumnsItems"));
			return !fnIsEqual(aDataRuntime, this.oDataInitial.ColumnsItems);
		},
		_print: function() {
			Log.info("----------------------------------------");
			var aItems = jQuery.extend(true, [], this.oJSONModel.getProperty("/ColumnsItems"));
			aItems.sort(function(a, b) {
				return a.relativePosition - b.relativePosition;
			});
			aItems.forEach(function(oMItem) {
				Log.info(oMItem.relativePosition + " " + oMItem.visible + " " + oMItem.text);
			});
		}
	});
}, true);
