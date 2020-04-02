/* globals QUnit */
QUnit.config.autostart = false;


sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"sap/ui/comp/smartfilterbar/SmartFilterBar",
		"sap/ui/core/util/MockServer",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/base/Log"
	], function (SmartFilterBar, MockServer, ODataModel, Log) {


		QUnit.module("sap.ui.comp.smartfilterbar.SmartFilterBar - setFilterData");

		QUnit.test("set Fields with setFilterData and validate the current state, TZ GMT+1", function (assert) {
			// Normalize the test environment...
			sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyDateFormat("1");

			var done = assert.async();
			// ...and check for correct circumstances
			if ((new Date()).getTimezoneOffset() != -60) {
				assert.expect(0);
				done();
			}

			// Setup Mockserver
			var oMockServer = new MockServer({
				rootUri: "/foo/"
			});
			this._oMockServer = oMockServer;
			var sBaseUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar_setFilterData");
			var sMetadataUrl = sBaseUrl + "/SmartFilterBar_setFilterData_metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sBaseUrl,
				aEntitySetsNames: [
					"ZEPM_C_SALESORDERITEMQUERYResults", "ZEPM_C_SALESORDERITEMQUERY"
				]
			});

			var fnCustom = function (oEvent) {

				// filter according to the parameter. simulate table binding
				var sCurrency = this._oFilterBar.getFilterData()["$Parameter.P_DisplayCurrency"];
				var aResults = [];
				oEvent.getParameter("oFilteredData").results.forEach(function (item) {
					if (item.DisplayCurrency === sCurrency) {
						aResults.push(item);
					}
				});

				oEvent.getParameter("oFilteredData").results = aResults;
			}.bind(this);
			oMockServer.attachAfter("GET", fnCustom, "ZEPM_C_SALESORDERITEMQUERY");
			oMockServer.start();

			var oModel = new ODataModel("/foo", true);

			var oXhr = new XMLHttpRequest();
			oXhr.open('GET', sBaseUrl + "/SmartFilterBar_setFilterData_Input.json", false);
			oXhr.send();
			var sFilterData = oXhr.response;

			var oFixture = {
				"DATE_SINGLE": {
					"control": "sap.m.DatePicker",
					"valueText": "04.12.2018"
				},
				"DATE_MULTIPLE": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12/4/18", "=12/5/18"]
				},
				"DATE_INTERVAL": {
					"control": "sap.m.DateRangeSelection",
					"valueText": "04.12.2018 - 05.12.2018"
				},
				"DATE_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12/4/18", "=12/5/18"]
				},
				"TIME_SINGLE": {
					"control": "sap.m.TimePicker",
					"valueText": "12:34:00 PM"
				},
				"TIME_MULTIPLE": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12:34 PM", "=12:35 PM"]
				},
				"TIME_INTERVAL": {
					"control": "sap.m.MultiInput",
					"valueText": ["12:34 PM...12:35 PM"]
				},
				"TIME_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12:34 PM", "=12:35 PM"]
				},
				"DTOFFSET_SINGLE": {
					"control": "sap.m.DateTimePicker",
					"valueText": "04.12.2018, 12:34 PM"
				},
				"DTOFFSET_MULTIPLE": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12/4/18, 12:34 PM", "=12/5/18, 12:35 PM"]
				},
				"DTOFFSET_INTERVAL": {
					"control": "sap.m.Input",
					"valueText": "12/4/18, 12:34 PM-12/5/18, 12:35 PM"
				},
				"DTOFFSET_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12/4/18, 12:34 PM", "=12/5/18, 12:35 PM"]
				},
				"DTR_INTERVAL": {
					"control": "sap.m.DateRangeSelection",
					"valueText": "-"
				},
				"DTR_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["Tue Dec 04 2018 00:00:00 GMT+0100 (Mitteleuropäische Normalzeit)...Wed Dec 05 2018 23:59:59 GMT+0100 (Mitteleuropäische Normalzeit)"]
				},
				"STRINGDATE_SINGLE": {
					"control": "sap.m.DatePicker",
					"valueText": "04.12.2018"
				},
				"STRINGDATE_MULTIPLE": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12/4/18", "=12/5/18"]
				},
				"STRINGDATE_INTERVAL": {
					"control": "sap.m.DateRangeSelection",
					"valueText": "04.12.2018 - 05.12.2018"
				},
				"STRINGDATE_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12/4/18", "=12/5/18"]
				},
				"STRING_SINGLE": {
					"control": "sap.m.Input",
					"valueText": "Best Christmas Wishes!"
				},
				"STRING_MULTIPLE": {
					"control": "",
					"valueText": ""
				},
				"STRING_INTERVAL": {
					"control": "sap.m.Input",
					"valueText": "A-Z"
				},
				"STRING_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["*A*", "*B*", "*C*"]
				},
				"DECIMAL_SINGLE": {
					"control": "sap.m.Input",
					"valueText": "12.13"
				},
				"DECIMAL_MULTIPLE": {
					"control": "",
					"valueText": ""
				},
				"DECIMAL_INTERVAL": {
					"control": "sap.m.Input",
					"valueText": "12.13-13.14"
				},
				"DECIMAL_AUTO": {
					"control": "sap.m.Input",
					"valueText": ["=12.13", "=13.14"]
				},
				"DOUBLE_SINGLE": {
					"control": "sap.m.Input",
					"valueText": "12.13"
				},
				"DOUBLE_MULTIPLE": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12.13", "=13.14"]
				},
				"DOUBLE_INTERVAL": {
					"control": "sap.m.Input",
					"valueText": "12.13-13.14"
				},
				"DOUBLE_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["=12.13", "=13.14"]
				},
				"BOOL_SINGLE": {
					"control": "sap.m.Select",
					"valueText": "Yes"
				},
				"BOOL_MULTIPLE": {
					"control": "sap.m.MultiInput",
					"valueText": ["=No", "=Yes"]
				},
				"BOOL_INTERVAL": {
					"control": "sap.m.Input",
					"valueText": "false-true"
				},
				"BOOL_AUTO": {
					"control": "sap.m.MultiInput",
					"valueText": ["=No", "=Yes"]
				}
			};

			var oSmartFilterBar = new SmartFilterBar("smartFilterBarInstance", {
				entitySet : "ZEPM_C_SALESORDERITEMQUERYResults",
				considerAnalyticalParameters: true
			});

			oSmartFilterBar.setModel(oModel);

			var fnCompare = function(vExpectedValue, oFilterField) {

				switch (oFilterField.getMetadata().getName()) {

					case "sap.m.MultiInput":
						for (var i = 0; i < oFilterField.getTokens().length; i++) {
							if (oFilterField.getTokens()[i].getText() != vExpectedValue[i]) {
								return false;
							}
						}
						return true;

					case "sap.m.DateRangeSelection":
						return (oFilterField.getValue() == vExpectedValue);

					case "sap.m.Select":
						return (oFilterField.getSelectedItem().getText() == vExpectedValue);

					default:
						return (vExpectedValue == oFilterField.getValue());
				}
			};

			oSmartFilterBar.attachInitialized(function(){

				oSmartFilterBar.setFilterDataAsString(sFilterData, true);

				// Check the values
				var aFilterGroupItems = oSmartFilterBar.getFilterGroupItems();
				var bEqual = false;
				for (var i = 0; i < aFilterGroupItems.length; i++) {

					if (oFixture[aFilterGroupItems[i].getName()] != undefined) {
						bEqual = fnCompare(oFixture[aFilterGroupItems[i].getName()]["valueText"], aFilterGroupItems[i].getControl());
					} else {
						Log.error("No match for given key " + aFilterGroupItems[i].getName() + " in Fixture!");
					}

					assert.ok(bEqual, "Value of field " + aFilterGroupItems[i].getName() + " matches the Fixture's value");
				}

				assert.ok(true);
				done();
			});
		});

		QUnit.start();
	});
});