sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/test/actions/EnterText',
	'sap/ui/test/actions/Press',
	'sap/base/util/deepEqual',
	'sap/ui/core/format/DateFormat'
], function (
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion,
	EnterText,
	Press,
	deepEqual,
	DateFormat
) {
	'use strict';

	var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html");
	var sCurrencyControlId = "__xmlview0--Currency";
	var sCurrencyCodeControlId = "__xmlview0--Currency-sfEdit";

	var fnMatchData = function (sProperty, vValue) {
		return function (oCodeEditor) {
			var sValue = oCodeEditor.getValue();
			var oDataValues = sValue ? JSON.parse(sValue) : {};
			var bIsMatching = true;

			if (!oDataValues.hasOwnProperty(sProperty) || !deepEqual(vValue, oDataValues[sProperty])) {
				bIsMatching = false;
			}

			return bIsMatching;
		};
	};

	var fnMatchTableLoaded = function () {
		return function (oVHD) {
			var oTable = oVHD.getTable();
			var oBinding = oTable && oTable.getBinding("rows");
			var aContexts = oBinding && oBinding.getCurrentContexts();
			var bIsMatching = aContexts && aContexts.length > 0;
			return bIsMatching;
		};
	};

	var fnGetDateTime = function (iYear, iMonth, iDate, iHour, iMinute, iSecond) {
		var oDate = new Date(iYear, iMonth, iDate, iHour, iMinute, iSecond);
		iMonth = iMonth + 1;
		var sMonth = iMonth < 10 ? "0" + iMonth : "" + iMonth;
		var sDate = oDate.getUTCDate() < 10 ? "0" + oDate.getUTCDate() : "" + oDate.getUTCDate();
		var sHours = oDate.getUTCHours() < 10 ? "0" + oDate.getUTCHours() : "" + oDate.getUTCHours();
		var sMinutes = oDate.getUTCMinutes() < 10 ? "0" + oDate.getUTCMinutes() : "" + oDate.getUTCMinutes();
		var sSeconds = oDate.getUTCSeconds() < 10 ? "0" + oDate.getUTCSeconds() : "" + oDate.getUTCSeconds();
		var sDtOffset = "" + oDate.getUTCFullYear() + "-" + sMonth + "-" + sDate + "T" +
			sHours + ":" + sMinutes + ":" + sSeconds + ".000Z";
		return sDtOffset;
	};

	var fnGetDateInTimeZone = function (iYear, iMonth, iDate) {
		var oDate = new Date(Date.UTC(iYear, (iMonth - 1), iDate, 0, 0, 0));
		var oFormat = DateFormat.getDateInstance({pattern: "yyyyMMdd"});
		return oFormat.format(oDate);
	};

	Opa5.extendConfig({
		arrangements: new Arrangement({}),
		actions: new Action({
			iEnterTextInSmartField: function (sId, sText, bKeepFocus) {
				return this.waitFor({
					id: sId,
					actions: new EnterText({
						text: sText,
						keepFocus: !!bKeepFocus
					})
				});
			},
			iPress: function (sId) {
				return this.waitFor({
					id: sId,
					actions: new Press()
				});
			},
			iDisableInputMaskForTest: function (sId) {
				return this.waitFor({
					id: sId,
					success: function (oControl) {
						var oTimePicker = oControl.getInnerControls()[0];
						oTimePicker.setMaskMode("Off");
					}
				});
			}
		}),
		assertions: new Assertion({
			iShouldSeeSmartFieldWithIdAndValue: function (sId, vValue) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartfield.SmartField",
//					viewName: "test-resources.sap.ui.comp.smartfield.SmartFieldTypes.SmartField_Types.SmartField",
					success: function (aSmartFields) {
						var oSmartField;
						for (var i = 0; i < aSmartFields.length; i++) {
							if (aSmartFields[i].getId() === sId) {
								oSmartField = aSmartFields[i];
								break;
							}

						}
						Opa5.assert.equal(oSmartField.getValue(), vValue, "The SmartField with the id " + sId + " contains the correct value!");
					}
				});
			},
			iShouldSeeSmartFieldWithIdAndBindingValue: function (sId, vValue) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartfield.SmartField",
					success: function (aSmartFields) {
						var oSmartField;
						for (var i = 0; i < aSmartFields.length; i++) {
							if (aSmartFields[i].getId() === sId) {
								oSmartField = aSmartFields[i];
								break;
							}

						}
						Opa5.assert.equal(oSmartField.getBinding("value").getValue(), vValue, "The Binding of the SmartField with the id " + sId + " contains the correct value!");
					}
				});
			},
			iShouldSeeSmartFieldWithIdAndDateTimeValue: function (sId, vValue) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartfield.SmartField",
					success: function (aSmartFields) {
						var oSmartField;
						for (var i = 0; i < aSmartFields.length; i++) {
							if (aSmartFields[i].getId() === sId) {
								oSmartField = aSmartFields[i];
								break;
							}

						}
						Opa5.assert.equal(oSmartField.getInnerControls()[0].getDateValue().toString(), vValue, "The SmartField with the id " + sId + " contains the correct value!");
					}
				});
			},
			iShouldSeeData: function (sProperty, vValue) {
				return this.waitFor({
					controlType: "sap.ui.codeeditor.CodeEditor",
					id: "__xmlview0--outputAreaChangedData",
					matchers: fnMatchData(sProperty, vValue),
					success: function (oCodeEditor) {
						Opa5.assert.ok(oCodeEditor.getValue(), "Data property " + sProperty + " has value " + vValue + "!"); // tested in matcher
					},
					errorMessage: "Data property " + sProperty + " has not value " + vValue + "!"
				});
			},
			iShouldSeeValueHelpDialog: function (sId, iFilters, iRows) {
				return this.waitFor({
					controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
					id: sId,
					matchers: fnMatchTableLoaded(),
					success: function (oVHD) {
						var oFilterBar = oVHD.getFilterBar();
						Opa5.assert.equal(oFilterBar.getFilterGroupItems().length, iFilters, "The ValueHelpDialog " + sId + " contains the correct number of FilterItems");

						var oTable = oVHD.getTable();
						var oBinding = oTable.getBinding("rows");
						var aContexts = oBinding.getCurrentContexts();
						Opa5.assert.equal(aContexts.length, iRows, "The ValueHelpDialog " + sId + " contains the correct number of Rows");
					}
				});
			},
			iShouldSeeFieldWithIdAndValue: function (sId, vValue) {
				return this.waitFor({
					id: sId,
					success: function (oField) {
						Opa5.assert.equal(oField.getValue(), vValue, "The Field with the id " + sId + " contains the correct value!");
					}
				});
			},
			iShouldSeeFieldWithErrorState: function (sId) {
				return this.waitFor({
					id: sId,
					success: function (oField) {
						Opa5.assert.equal(oField.getInnerControls()[0].getValueState(), "Error", "The Field with the id " + sId + " has correct value state 'Error'!");
					}
				});
			},
			iShouldSeeFieldWithNoneState: function (sId) {
				return this.waitFor({
					id: sId,
					success: function (oField) {
						Opa5.assert.equal(oField.getInnerControls()[0].getValueState(), "None", "The Field with the id " + sId + " has correct value state 'None'!");
					}
				});
			},
			iShouldSeeFieldWithErrorText: function (sId, vValue) {
				return this.waitFor({
					id: sId,
					success: function (oField) {
						Opa5.assert.equal(oField.getInnerControls()[0].getValueStateText(), vValue, "The Field with the id " + sId + " has correct value state text!");
					}
				});
			},
			iShouldSeeFieldWithIdAndTokenWithValue: function (sId, vValue, iToken) {
				iToken = iToken ? iToken : 0;
				return this.waitFor({
					id: sId,
					success: function (oField) {
						Opa5.assert.equal(oField.getTokens()[iToken].getText(), vValue,
							"The Field with the id " + sId + " contains the correct token!");
					}
				});
			}
		})
	});

	opaTest("When I start the 'SmartField_Types' app, the SmartFields should have the right values displayed", function (Given, When, Then) {

		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--date", "Oct 24, 2014");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--time", "11:33:55 AM");
		Then.iShouldSeeSmartFieldWithIdAndDateTimeValue("__xmlview0--dtOffset", new Date(1414149600000).toString());
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--stringDate", "Dec 15, 2000");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--string", "SB");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--decimal", "45,301.23");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--double", "127,890.134");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--int16", "35");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--byte", "122");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--bool", true);
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--inKey", "A");

	});

	opaTest("When I change value of SmartField the data should change", function (Given, When, Then) {

		//Arrangement

		//Action
		When.iEnterTextInSmartField("__xmlview0--date", "May 21, 2019");
		When.iDisableInputMaskForTest("__xmlview0--time"); // TODO: better solution
		When.iEnterTextInSmartField("__xmlview0--time", "101010PM"); // no : because of edit mask
		When.iEnterTextInSmartField("__xmlview0--dtOffset", "May 22, 2019, 7:01:30 AM");
		When.iEnterTextInSmartField("__xmlview0--stringDate", "May 22, 2019");
		When.iEnterTextInSmartField("__xmlview0--string", "Hi");
		When.iEnterTextInSmartField("__xmlview0--decimal", "1234.56");
		When.iEnterTextInSmartField("__xmlview0--double", "1234.56");
		When.iEnterTextInSmartField("__xmlview0--int16", "1234");
		When.iEnterTextInSmartField("__xmlview0--byte", "123");
		When.iPress("__xmlview0--bool");

		//for Test create Date string time zone independent:
		var sDtOffset = fnGetDateTime(2019, 4, 22, 7, 1, 30);
		var sDateOffset = fnGetDateInTimeZone(2019, 5, 22);

		//Assertion
		Then.iShouldSeeData("DATE", "2019-05-21T00:00:00.000Z");
		Then.iShouldSeeData("TIME", {ms: 79810000, __edmType: "Edm.Time"});
		Then.iShouldSeeData("DTOFFSET", sDtOffset);
		Then.iShouldSeeData("STRINGDATE", sDateOffset);
		Then.iShouldSeeData("STRING", "Hi");
		Then.iShouldSeeData("DECIMAL", "1234.56");
		Then.iShouldSeeData("DOUBLE", 1234.56);
		Then.iShouldSeeData("INT16", 1234);
		Then.iShouldSeeData("BYTE", 123);
		Then.iShouldSeeData("BOOL", false);

	});

	opaTest("When I use the value help the in-parameters are set as filter", function (Given, When, Then) {

		//Arrangement

		//Action
		When.iPress("__xmlview0--key-input-vhi"); // TODO: better way to open value help for SmartField?
		When.iPress("__xmlview0--key-input-valueHelpDialog-smartFilterBar-btnGo"); // TODO: better way to press the Go button

		//Assertion
		Then.iShouldSeeValueHelpDialog("__xmlview0--key-input-valueHelpDialog", 12, 2);
		Then.iShouldSeeFieldWithIdAndTokenWithValue("__xmlview0--key-input-valueHelpDialog-smartFilterBar-filterItemControlA_-InKey", "=A");

	});

	opaTest("When I select an entry out-parameters are set", function (Given, When, Then) {

		//Arrangement

		//Action
		When.iPress("__xmlview0--key-input-valueHelpDialog-table-0-control-__clone12"); // TODO: better way to select entry

		//Assertion

		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--key", "02");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDate", "Jan 1, 2019");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outTime", "1:01:01 AM");
		Then.iShouldSeeSmartFieldWithIdAndDateTimeValue("__xmlview0--outDateTime", new Date(1546300861000).toString());
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outStringDate", "Jan 1, 2019");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDecimal", "654.32");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDouble", "654.321");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outInt16", "21");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outByte", "321");
		Then.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outBool", false);
		Then.iShouldSeeData("Key", "02");
		Then.iShouldSeeData("OutDate", "2019-01-01T00:00:00.000Z");
		Then.iShouldSeeData("OutTime", {ms: 3661000, __edmType: "Edm.Time"});
		Then.iShouldSeeData("OutDateTime", "2019-01-01T00:01:01.000Z");
		Then.iShouldSeeData("OutStringDate", "20190101");
		Then.iShouldSeeData("OutDecimal", "654.321"); // TODO really? (Fits not to constraints)
		Then.iShouldSeeData("OutDouble", 654.321);
		Then.iShouldSeeData("OutInt16", 21);
		Then.iShouldSeeData("OutByte", 321);
		Then.iShouldSeeData("OutBool", false);

		Then.iTeardownMyAppFrame();

	});

	opaTest("When SmartFields value is not valid should has error state", function (Given, When, Then) {

		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField("__xmlview0--date", "May 32, 2019");
		When.iEnterTextInSmartField("__xmlview0--dtOffset", "May 32, 2019, 7:01:30 AM");
		When.iEnterTextInSmartField("__xmlview0--stringDate", "May May");
		When.iEnterTextInSmartField("__xmlview0--string", "Hello Hello Hello");
		When.iEnterTextInSmartField("__xmlview0--decimal", "1234.56a");
		When.iEnterTextInSmartField("__xmlview0--double", "1234.56a");
		When.iEnterTextInSmartField("__xmlview0--int16", "1234a");
		When.iEnterTextInSmartField("__xmlview0--byte", "123a");

		//Assertion
		Then.iShouldSeeFieldWithErrorState("__xmlview0--date");
		Then.iShouldSeeFieldWithErrorState("__xmlview0--dtOffset");
		Then.iShouldSeeFieldWithErrorState("__xmlview0--stringDate");
		Then.iShouldSeeFieldWithErrorState("__xmlview0--string");
		Then.iShouldSeeFieldWithErrorState("__xmlview0--decimal");
		Then.iShouldSeeFieldWithErrorState("__xmlview0--double");
		Then.iShouldSeeFieldWithErrorState("__xmlview0--int16");
		Then.iShouldSeeFieldWithErrorState("__xmlview0--byte");

		Then.iTeardownMyAppFrame();
	});

	opaTest("When SmartFields value is not valid should has error text", function (Given, When, Then) {

		var sCurrentYear = new Date().getFullYear();

		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField("__xmlview0--date", "May 32, 2019");
		When.iEnterTextInSmartField("__xmlview0--dtOffset", "May 32, 2019, 7:01:30 AM");
		When.iEnterTextInSmartField("__xmlview0--stringDate", "May May");
		When.iEnterTextInSmartField("__xmlview0--string", "Hello Hello Hello");
		When.iEnterTextInSmartField("__xmlview0--decimal", "1234.56a");
		When.iEnterTextInSmartField("__xmlview0--double", "1234.56a");
		When.iEnterTextInSmartField("__xmlview0--int16", "1234a");
		When.iEnterTextInSmartField("__xmlview0--byte", "123a");

		//Assertion
		Then.iShouldSeeFieldWithErrorText("__xmlview0--date", "Enter a valid date in the following format: Dec 31, " + sCurrentYear);
		Then.iShouldSeeFieldWithErrorText("__xmlview0--dtOffset", "Enter a valid date and a valid time in the following format: Dec 31, " + sCurrentYear + ", 11:59:58 PM");
		Then.iShouldSeeFieldWithErrorText("__xmlview0--stringDate", " is not a valid date");
		Then.iShouldSeeFieldWithErrorText("__xmlview0--string", "Enter a text with a maximum of 2 characters and spaces");
		Then.iShouldSeeFieldWithErrorText("__xmlview0--decimal", "Enter a number");
		Then.iShouldSeeFieldWithErrorText("__xmlview0--double", "Enter a number");
		Then.iShouldSeeFieldWithErrorText("__xmlview0--int16", "Enter a number with no decimal places");
		Then.iShouldSeeFieldWithErrorText("__xmlview0--byte", "Enter a number with no decimal places");

		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.00");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.5");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.50");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.50");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.500");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.500");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.50");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.5000");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5000");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10000000000");
		When.iEnterTextInSmartField(sCurrencyControlId, "100000000000");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100000000000");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10000000000.50");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.50");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10,000,000,000.50");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10000000000.50");
		When.iEnterTextInSmartField(sCurrencyControlId, "10000000000.500");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.50");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10000000000.500");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input an invalid currency type, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "10000000000.50");
		When.iEnterTextInSmartField(sCurrencyControlId, "foo");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.50");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "foo");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency value and an empty string for currency code, the amount should be formatted with scale of 2 with value state of NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "");
		When.iEnterTextInSmartField(sCurrencyControlId, "10");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.00");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "10");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.5");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.50");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.500");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.500");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.iEnterTextInSmartField(sCurrencyControlId, "10.5000");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5000");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "10000000000");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10,000,000,000");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "100000000000");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "100000000000");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100,000,000,000");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "1000000000000");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "1000000000000");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "1,000,000,000,000");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.iEnterTextInSmartField(sCurrencyControlId, "1000000000000");
		When.iEnterTextInSmartField(sCurrencyControlId, "10000000000000");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.iShouldSeeFieldWithNoneState(sCurrencyCodeControlId);

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "1000000000000");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10000000000000");
		Then.iShouldSeeFieldWithErrorState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.iEnterTextInSmartField(sCurrencyControlId, "");

		//Assertion
		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");

		Then.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, null);
		Then.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "");
		Then.iShouldSeeFieldWithNoneState(sCurrencyControlId);

		// Clean
		Then.iTeardownMyAppFrame();
	});


	opaTest("When I use the ValueHelp dialog in SmartFields should take over a value into the basic search", function (Given, When, Then) {
		//Arrangement
		Given.iStartMyAppInAFrame(appUrl);

		//Action
		When.iEnterTextInSmartField("__xmlview0--key-input", "0", true);
		When.iPress("__xmlview0--key-input-vhi");

		//Assertion
		Then.iShouldSeeValueHelpDialog("__xmlview0--key-input-valueHelpDialog", 12, 2);
		Then.iShouldSeeFieldWithIdAndValue("__xmlview0--key-input-valueHelpDialog-smartFilterBar-btnBasicSearch", "0");

		Then.iTeardownMyAppFrame();
	});
});
