sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/comp/smartmultiedit/Field",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartmultiedit/Container",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/layout/form/ResponsiveGridLayout" // For some reason this import must stay, otherwise the tests start to fail
], function (JSONModel, MockServer, ODataModel, ResourceModel, Field, SmartForm, Group, GroupElement,
			 Container, NumberFormat, ResponsiveGridLayout) {
	"use strict";

	// taken from ControlFactoryBase
	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp"),
		oDateFormat = sap.ui.core.format.DateFormat.getDateInstance(),
		oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance(),
		TestUtils = {};

	TestUtils.FIELDS_POOL = {
		"Available": {
			labelText: "Available (i18n)",
			nullable: false,
			valueHelp: false,
			multiContextSelectKeys: ["true", "false"],
			singleContextSelectKeys: "true,false",
			singleContextDisplayText: oResourceBundle.getText("SMARTFIELD_CB_NO"),
			newItemIndex: 1,
			newItemKey: oResourceBundle.getText("SMARTFIELD_CB_YES"),
			useApplyToEmptyOnly: true
		},
		"AvailableNullable": {
			labelText: "Available & Nullable",
			nullable: true,
			valueHelp: false,
			multiContextSelectKeys: ["true", "false"],
			singleContextSelectKeys: "true,false",
			singleContextDisplayText: oResourceBundle.getText("SMARTFIELD_CB_YES"),
			newItemIndex: 3,
			newItemKey: oResourceBundle.getText("SMARTFIELD_CB_NO")
		},
		"Amount": {
			labelText: "Amount (Byte)",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: [32, 0],
			singleContextSelectKeys: "32",
			singleContextDisplayText: "32",
			newItemIndex: 3,
			newItemKey: "0",
			parseErrorValue: "byte",
			validationErrorValue: "333",
			useApplyToEmptyOnly: true
		},
		"Decimal": {
			labelText: "Decimal (7x3)",
			nullable: true,
			valueHelp: true,
			multiContextSelectKeys: ["3456789.87", "-10.01"],
			singleContextSelectKeys: "-10.01",
			singleContextDisplayText: "-10,01",
			newItemIndex: 3,
			newItemKey: NumberFormat.getFloatInstance().format(3456789.87),
			parseErrorValue: "decimal",
			validationErrorValue: "12345"
		},
		"Birthday": {
			labelText: "Birthday (i18n)",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: oDateFormat.format(new Date("Dec 4 2014 GMT")) + "," + oDateFormat.format(new Date("Jun 29 1974 GMT")),
			singleContextSelectKeys: oDateFormat.format(new Date("Jun 29 1974 GMT")),
			singleContextDisplayText: oDateFormat.format(new Date("Jun 29 1974 GMT")),
			newItemIndex: 2,
			newItemKey: new Date("Dec 4 2014 GMT"),
			parseErrorValue: "birthday"
		},
		"DeliveryTime": {
			labelText: "Delivery Time (DateTimeOffset)",
			nullable: true,
			valueHelp: true,
			multiContextSelectKeys: oDateTimeFormat.format(new Date("Aug 1 2014 2:00:00 GMT")) + "," + oDateTimeFormat.format(new Date("Feb 10 2012 2:19:11 PM GMT")),
			singleContextSelectKeys: oDateTimeFormat.format(new Date("Aug 1 2014 2:00:00 GMT")),
			singleContextDisplayText: oDateTimeFormat.format(new Date("Aug 1 2014 2:00:00 GMT")),
			newItemIndex: 4,
			newItemKey: new Date("Feb 10 2012 2:19:11 PM GMT"),
			parseErrorValue: "delivery"
		},
		"Department": {
			labelText: "Department (i18n)",
			nullable: true,
			valueHelp: true,
			multiContextSelectKeys: "Marketing,Purchasing",
			singleContextSelectKeys: "Purchasing",
			singleContextDisplayText: "Marketing",
			newItemIndex: 3,
			newItemKey: "Marketing"
		},
		"Distance": {
			labelText: "Distance",
			nullable: true,
			valueHelp: true,
			multiContextSelectKeys: "[654.321,\"mi\"],[21,\"m\"]",
			singleContextSelectKeys: "[654.321,\"mi\"]",
			singleContextDisplayText: "654.321 mi",
			newItemIndex: 4,
			newItemKey: "{\"Distance\":21,\"DistanceUnit\":\"m\"}"
		},
		"Email": {
			labelText: "Email",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: ["iron.maiden@bandcamp.com", "vicious.rumors@bandcamp.com"],
			singleContextSelectKeys: "vicious.rumors@bandcamp.com",
			singleContextDisplayText: "vicious.rumors@bandcamp.com",
			newItemIndex: 2,
			newItemKey: "iron.maiden@bandcamp.com"
		},
		"FirstName": {
			labelText: "First Name (String 10)",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: ["Iron", "Vicious"],
			singleContextSelectKeys: "Vicious",
			singleContextDisplayText: "Vicious",
			newItemIndex: 2,
			newItemKey: "Iron",
			validationErrorValue: "12345678901",
			useApplyToEmptyOnly: true
		},
		"Gender": {
			labelText: "Gender (fixed-values)",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: ["MN", "WMN"],
			singleContextSelectKeys: "WMN",
			singleContextDisplayText: "Woman",
			newItemIndex: 2,
			newItemKey: "MN"
		},
		"Guid": {
			labelText: "GUID",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: ["439fb884-e14e-4caa-b46f-d9214934cb7a", "bf55d008-3132-4bb7-bb19-e914d93d419a"],
			singleContextSelectKeys: "bf55d008-3132-4bb7-bb19-e914d93d419a",
			singleContextDisplayText: "439fb884-e14e-4caa-b46f-d9214934cb7a",
			newItemIndex: 2,
			newItemKey: "439fb884-e14e-4caa-b46f-d9214934cb7a",
			validationErrorValue: "guid"
		},
		"LastName": {
			labelText: "Last Name (String 30)",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: "",
			singleContextSelectKeys: "",
			singleContextDisplayText: "",
			newItemIndex: 1,
			newItemKey: "",
			useApplyToEmptyOnly: true
		},
		"Phone": {
			labelText: "Phone",
			nullable: true,
			valueHelp: true,
			multiContextSelectKeys: ["+420123456789", "+420666666666"],
			singleContextSelectKeys: "+420666666666",
			singleContextDisplayText: "+420123456789",
			newItemIndex: 3,
			newItemKey: "+420123456789"
		},
		"Salary": {
			labelText: "Salary",
			nullable: true,
			valueHelp: true,
			multiContextSelectKeys: "[1234567,\"JPY\"],[6543.21,\"USD\"]",
			singleContextSelectKeys: "[6543.21,\"USD\"]",
			singleContextDisplayText: "6 543,21 USD",
			newItemIndex: 3,
			newItemKey: "{\"Salary\":1234567,\"SalaryUnit\":\"JPY\"}"
		},
		"URL": {
			labelText: "URL",
			nullable: true,
			valueHelp: true,
			multiContextSelectKeys: ["http://www.vr.com", "https://www.ironmaiden.com"],
			singleContextSelectKeys: "https://www.ironmaiden.com",
			singleContextDisplayText: "http://www.vr.com",
			newItemIndex: 3,
			newItemKey: "http://www.vr.com"
		}
	};

	TestUtils.ADDITIONAL_FIELDS = {
		"GenderWithoutText": {
			labelText: "Gender (fixed-values)",
			nullable: false,
			valueHelp: true,
			multiContextSelectKeys: ["MN", "WMN"],
			singleContextSelectKeys: "WMN",
			singleContextDisplayText: "Woman",
			newItemIndex: 2,
			newItemKey: "MN"
		}
	};

	TestUtils.createMockServer = function (sMetadataPath) {
		sMetadataPath = sMetadataPath || "metadata.xml";
		var oUriParameters = jQuery.sap.getUriParameters();

		if (!this.oServer) {
			this.oServer = new MockServer({
				rootUri: "smartmultiedit.Employees/"
			});

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 10)
			});

			this.oServer.simulate(
				"test-resources/sap/ui/comp/qunit/smartmultiedit/mockserver/" + sMetadataPath,
				"test-resources/sap/ui/comp/qunit/smartmultiedit/mockserver/");

			this.oServer.start();
		}

		return this.oServer;
	};

	TestUtils.createDataModel = function () {
		var that = this;

		if (!this.oModel) {
			this.oModel = new ODataModel("smartmultiedit.Employees");
			this.oModel.setUseBatch(false); // So far parallelism doesn't work well enough for batches in qunit
			// oDataModel.setDefaultBindingMode("TwoWay");
			// oDataModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);

			// metadata and Employees entity set needs to be loaded for the tests to work
			return new Promise(function (resolve, reject) {
				that.oModel.metadataLoaded().then(function () {
					that.oModel.read("/Employees", {
						success: function () {
							resolve({
								oModel: that.oModel
							});
						},
						error: reject
					}); // Force reading of the whole dataset
				});
			});
		} else {
			return that.oModel.metadataLoaded().then(function () {
				return {
					oModel: that.oModel
				};
			});
		}
	};

	TestUtils.createI18nModel = function () {
		return new ResourceModel({
			bundleUrl: "test-resources/sap/ui/comp/qunit/smartmultiedit/mockserver/i18n.properties"
		});
	};

	TestUtils.createSmartForm = function () {
		var oElements = [],
			oFieldTestInfo,
			oField;
		for (var sFieldName in this.FIELDS_POOL) {
			oFieldTestInfo = TestUtils.FIELDS_POOL[sFieldName];
			oField = new Field({propertyName: sFieldName, useApplyToEmptyOnly: oFieldTestInfo.useApplyToEmptyOnly});
			oElements.push(
				new GroupElement({
					elements: [oField]
				})
			);
			this.FIELDS_POOL[sFieldName].fieldControl = oField;
		}

		return new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: oElements
				})
			]
		});
	};

	TestUtils.createSimpleSmartForm = function (aFields) {
		var oElements = [],
			oFieldTestInfo,
			oField;
		aFields.forEach(function (sFieldName) {
			oFieldTestInfo = TestUtils.FIELDS_POOL[sFieldName];
			if (!oFieldTestInfo) {
				oFieldTestInfo = TestUtils.ADDITIONAL_FIELDS[sFieldName];
			}
			oField = new Field({propertyName: sFieldName, useApplyToEmptyOnly: oFieldTestInfo.useApplyToEmptyOnly});
			oElements.push(
				new GroupElement({
					elements: [oField]
				})
			);
			oFieldTestInfo.fieldControl = oField;
		});

		return new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: oElements
				})
			]
		});
	};

	TestUtils.createContainer = function (aContexts, oDataModel, i18nModel, oForm) {
		// Two different contexts
		oForm = oForm || TestUtils.createSmartForm();
		var oContainer = new Container({
				id: "multiEditContainer",
				entitySet: "Employees",
				layout: oForm,
				contexts: aContexts
			});

		oContainer.setModel(oDataModel);
		oContainer.setModel(i18nModel, "@i18n").setModel(i18nModel, "i18n");

		return oContainer;
	};

	TestUtils.getFieldSelectItemsKeys = function (oField) {
		var sTexts = oField._oSelect.getItems().map(function (oItem) {
			return oItem.getKey();
		}).join();

		return sTexts;
	};

	return TestUtils;
}, true);
