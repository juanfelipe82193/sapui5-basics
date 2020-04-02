sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel',
	'personalization/Util',
	'sap/ui/model/BindingMode',
	'sap/base/util/merge'
], function(
	Controller,
	JSONModel,
	ODataModel,
	TestUtil,
	BindingMode,
	merge
) {
	"use strict";

	var oController = Controller.extend("view.Main", {

		// Define initial data in oDataInitial structure which is used only in this  example.
		oDataInitial: {
			// Static data
			Items: [],
			// Runtime data
			ColumnsItems: [],
			ShowResetEnabled: false
		},

		// Runtime model
		oJSONModel: null,

		oDataBeforeOpen: {},

		onInit: function() {
			var oModel = new ODataModel("mockserver");

			oModel.getMetaModel().loaded().then(function() {
				var oEntityType = oModel.getMetaModel().getODataEntityType(oModel.getMetaModel().getODataEntitySet("ProductCollection").entityType);

				// Fill static data of this.oDataInitial reading them from metadata.
				oEntityType.property.forEach(function(oProperty) {
					this.oDataInitial.Items.push({
						columnKey: oProperty.name,
						text: oProperty["sap:label"]
					});
				}, this);

				// Fill runtime data of this.oDataInitial adding first the visible and then the invisible items.
				var aColumnKeysVisible = TestUtil.getColumnKeysVisibleFromODataModel(oModel, "ProductCollection");
				aColumnKeysVisible.forEach(function(sColumnKey, iIndex) {
					this.oDataInitial.ColumnsItems.push({
						columnKey: sColumnKey,
						visible: true,
						index: iIndex
					});
				}, this);
				this.oDataInitial.Items.forEach(function(oItem) {
					if (aColumnKeysVisible.indexOf(oItem.columnKey) < 0) {
						this.oDataInitial.ColumnsItems.push({
							columnKey: oItem.columnKey,
							visible: false
						});
					}
				}.bind(this));

				this.oJSONModel = new JSONModel(merge({}, this.oDataInitial));
				this.oJSONModel.setDefaultBindingMode(BindingMode.TwoWay);
			}.bind(this));
		},

		onOK: function(oEvent) {
			this.oDataBeforeOpen = {};
			oEvent.getSource().close();
			oEvent.getSource().destroy();
		},

		onCancel: function(oEvent) {
			this.oJSONModel.setProperty("/", merge([], this.oDataBeforeOpen));

			this.oDataBeforeOpen = {};
			oEvent.getSource().close();
			oEvent.getSource().destroy();
		},

		onReset: function() {
			this.oJSONModel.setProperty("/", merge([], this.oDataInitial));
		},

		onPersonalizationDialogPress: function() {
			var oPersonalizationDialog = sap.ui.xmlfragment("view.PersonalizationDialog", this);
			this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedColumnsItems());
			oPersonalizationDialog.setModel(this.oJSONModel);

			this.getView().addDependent(oPersonalizationDialog);

			this.oDataBeforeOpen = merge({}, this.oJSONModel.getData());
			oPersonalizationDialog.open();
		},

		onChangeColumnsItems: function(oEvent) {
			this.oJSONModel.setProperty("/ColumnsItems", oEvent.getParameter("items"));
			this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedColumnsItems());
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
					return merge([], aDataBase);
				}
				var aUnion = merge([], aData);
				aDataBase.forEach(function(oMItemBase) {
					var oMItemUnion = fnGetArrayElementByKey("columnKey", oMItemBase.columnKey, aUnion);
					if (!oMItemUnion) {
						aUnion.push(oMItemBase);
						return;
					}
					if (oMItemUnion.visible === undefined && oMItemBase.visible !== undefined) {
						oMItemUnion.visible = oMItemBase.visible;
					}
					if (oMItemUnion.width === undefined && oMItemBase.width !== undefined) {
						oMItemUnion.width = oMItemBase.width;
					}
					if (oMItemUnion.total === undefined && oMItemBase.total !== undefined) {
						oMItemUnion.total = oMItemBase.total;
					}
					if (oMItemUnion.index === undefined && oMItemBase.index !== undefined) {
						oMItemUnion.index = oMItemBase.index;
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
				var fnSort = function(a, b) {
					if (a.columnKey < b.columnKey) {
						return -1;
					} else if (a.columnKey > b.columnKey) {
						return 1;
					} else {
						return 0;
					}
				};
				aDataBase.sort(fnSort);
				aData.sort(fnSort);
				var aItemsNotEqual = aDataBase.filter(function(oDataBase, iIndex) {
					return oDataBase.columnKey !== aData[iIndex].columnKey || oDataBase.visible !== aData[iIndex].visible || oDataBase.index !== aData[iIndex].index || oDataBase.width !== aData[iIndex].width || oDataBase.total !== aData[iIndex].total;
				});
				return aItemsNotEqual.length === 0;
			};

			var aDataRuntime = fnGetUnion(this.oDataInitial.ColumnsItems, this.oJSONModel.getProperty("/ColumnsItems"));
			return !fnIsEqual(aDataRuntime, this.oDataInitial.ColumnsItems);
		}
	});
	return oController;
});
