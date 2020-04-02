sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/mdc/condition/Condition"
], function(Controller, Filter, FilterOperator, JSONModel, Condition) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.field.odataV4.Test", {

		onInit: function(oEvent) {
			var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
			oFormatSettings.setUnitMappings({
				"g": "mass-gram",
				"kg": "mass-kilogram",
				"mg": "mass-milligram",
				"t": "mass-metric-ton"
			});


			var oView = this.getView();
			oView.bindElement("/ProductCollection('1239102')");

			var oViewModel = new JSONModel({
				editMode: false,
				currencies: [
					{
						id: "EUR",
						unit: "EUR",
						text: "Euro"
					},
					{
						id: "USD",
						unit: "USD",
						text: "US-Dollar"
					},
					{
						id: "JPY",
						unit: "JPY",
						text: "Japan Yen"
					},
					{
						id: "SEK",
						unit: "SEK",
						text: "Swedish krona"
					}
				],
				weightUnits: [
					{
						id: "mass-gram",
						unit: "g",
						text: "gram"
					},
					{
						id: "mass-kilogram",
						unit: "kg",
						text: "kilogram"
					},
					{
						id: "mass-milligram",
						unit: "mg",
						text: "milligram"
					},
					{
						id: "mass-metric-ton",
						unit: "t",
						text: "ton"
					}
				]
			});
			this.getView().setModel(oViewModel, "view");
		},

		handleChange: function(oEvent) {
			var oField = oEvent.oSource;
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			var oText = this.byId("MyText");
			var oIcon = this.byId("MyIcon");
			oText.setText("Field: " + oField.getId() + " Change: value = " + sValue);

			if (bValid) {
				oIcon.setSrc("sap-icon://message-success");
				oIcon.setColor("Positive");
				oField.setValueState(sap.ui.core.ValueState.None);
				oField.setValueStateText("");
			} else {
				oIcon.setSrc("sap-icon://error");
				oIcon.setColor("Negative");
				oField.setValueState(sap.ui.core.ValueState.Error);
				if (oField.getDataType().search("Date") >= 0) {
					oField.setValueStateText("Enter valid date");
				} else if (oField.getDataType().search("Time") >= 0){
					oField.setValueStateText("Enter valid time");
				} else {
					oField.setValueStateText("Enter valid value");
				}
			}
		},

		handleLiveChange: function(oEvent) {
			var oField = oEvent.oSource;
			var sValue = oEvent.getParameter("value");
			var bEscPressed = oEvent.getParameter("escPressed");
			var oText = this.byId("MyTextRight");
			var oIcon = this.byId("MyIconRight");
			oText.setText("Field: " + oField.getId() + " liveChange: value = " + sValue);

			if (!bEscPressed) {
				oIcon.setSrc("sap-icon://message-success");
				oIcon.setColor("Positive");
			} else {
				oIcon.setSrc("sap-icon://sys-cancel");
				oIcon.setColor("Warning");
			}
		},

		handlePress: function(oEvent) {
			var oField = oEvent.oSource;
			var oText = this.byId("MyText");
			var oIcon = this.byId("MyIcon");
			oText.setText("Field: " + oField.getId() + " Press");
			oIcon.setSrc("sap-icon://message-success");
			oIcon.setColor("Positive");
		},

		toggleDisplay: function(oEvent) {
			var oField = this.byId("F11");
			var bPressed = oEvent.getParameter("pressed");
			if (bPressed) {
				oField.setEditMode(sap.ui.mdc.EditMode.Display);
			} else {
				oField.setEditMode(sap.ui.mdc.EditMode.Editable);
			}
		},

		handleButton: function(oEvent) {
			var oApp = this.byId("MyApp");
			var sKey = oEvent.getParameter("key");
			var oCurrentPage = oApp.getCurrentPage();
			var oNewPage = this.byId(sKey);
			var sPageId = oNewPage.getId();
			oApp.to(sPageId);
			oNewPage.setFooter(oCurrentPage.getFooter());
		},

		handleIconPress: function(oEvent) {
			var oButton = oEvent.oSource;
			var oFieldHelp = oButton.getParent().getParent();
			var vKey = oButton.getIcon().substr(11);
			oFieldHelp.fireSelectEvent(vKey, undefined, [Condition.createCondition("EQ", [vKey])]);
		},

		handleBeforeOpen: function(oEvent) {
			var oFieldHelp = oEvent.oSource;
			var aConditions = oFieldHelp.getConditions();
			var aButtons = oFieldHelp.getContent().getItems();
			var vKey;

			if (aConditions.length === 1) {
				vKey = aConditions[0].values[0];
			}
			for (var i = 0; i < aButtons.length; i++) {
				var oButton = aButtons[i];
				if (oButton.getIcon().substr(11) == vKey) {
					oButton.setType(sap.m.ButtonType.Emphasized);
				} else {
					oButton.setType(sap.m.ButtonType.Default);
				}
			}
		},

		handleTableItemSelect: function(oEvent) {
			var oFieldHelp = oEvent.oSource;
			var oItem = oEvent.getParameter("item");
			var aCells = oItem.getCells();
			var oKeyControl = aCells[1];
			var oValueControl = aCells[0];
			var sKey;
			var sValue;

			if (oKeyControl.getText) {
				sKey = oKeyControl.getText();
			}
			if (oValueControl.getText) {
				sValue = oValueControl.getText();
			}

			oFieldHelp.setProperty("selectedKey", sKey, true); // do not invalidate while FieldHelp
			oFieldHelp.fireSelect({value: sValue, key: sKey});
		},

		handleTableNavigate: function(oEvent) {
			var oFieldHelp = oEvent.oSource;
			var oTable = oFieldHelp.getTable();
			var iStep = oEvent.getParameter("step");
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var aItems = oTable.getItems();
			var iItems = aItems.length;
			var iSelectedIndex = 0;

			if (oSelectedItem) {
				iSelectedIndex = oTable.indexOfItem(oSelectedItem);
				iSelectedIndex = iSelectedIndex + iStep;
				if (iSelectedIndex < 0) {
					iSelectedIndex = 0;
				} else if (iSelectedIndex >= iItems - 1) {
					iSelectedIndex = iItems - 1;
				}
			} else if (iStep >= 0){
				iSelectedIndex = iStep - 1;
			} else {
				iSelectedIndex = iItems + iStep;
			}

			var oItem = aItems[iSelectedIndex];
			if (oItem) {
				var aCells = oItem.getCells();
				oItem.setSelected(true);
				oFieldHelp.setProperty("selectedKey", aCells[1].getText(), true); // do not invalidate while FieldHelp
				oFieldHelp.fireNavigate({value: aCells[0].getText(), key: aCells[1].getText()});
			}
		},

		handleFilterItems: function(oEvent) {
			var oFieldHelp = oEvent.oSource;
			var oTable = oFieldHelp.getTable();
			var oBinding = oTable.getBinding("items");
			if (oBinding) {
				var sFilterText = oEvent.getParameter("filterText");
				var oFilter = new Filter("Name", FilterOperator.StartsWith, sFilterText);

				oBinding.filter(oFilter);
			}
		},

		textForKey: function(sKey) {
			var oView = this.getView();
			var oModel = oView.getModel();
			var oProduct = oModel.getProperty("/ProductCollection('" + sKey + "')");
			if (oProduct) {
				return oProduct.Name;
			}

			return "";
		},

		keyForText: function(sText) {
			var oView = this.getView();
			var oFieldHelp = oView.byId("F2-5-H");
			var oTable = oFieldHelp.getTable();
			var aItems = oTable.getItems();

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];

				if (sText == this.textFromItem(oItem)) {
					var aCells = oItem.getCells();
					var oKeyControl = aCells[1];
					return oKeyControl.getText();
				}
			}
			return "";
		},

		keyFromItem: function(oItem) {
			var aCells = oItem.getCells();
			var oKeyControl = aCells[1];
			return oKeyControl.getText();
		},

		textFromItem: function(oItem) {
			var aCells = oItem.getCells();
			var oValueControl = aCells[0];
			return oValueControl.getText();
		}

	});
}, true);
