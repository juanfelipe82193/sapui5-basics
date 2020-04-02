sap.ui.require([
    "sap/base/Log",
    "sap/ui/comp/library",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/comp/filterbar/FilterBar",
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/ui/comp/smartfilterbar/FilterProvider",
    "sap/ui/comp/odata/type/StringDate",
    "sap/ui/comp/providers/TokenParser",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/type/Double",
    "sap/ui/model/odata/type/String",
    "sap/ui/model/odata/type/Int16",
    "sap/ui/model/odata/type/Single",
    "sap/ui/model/odata/type/Decimal",
    "sap/ui/model/odata/type/Date",
    "sap/ui/model/odata/type/DateTimeOffset",
    "sap/ui/model/odata/type/Time",
    "sap/ui/model/odata/type/DateTime",
    "sap/ui/model/odata/type/Boolean",
    "sap/ui/model/type/Date",
    "sap/ui/model/type/Time",
    "sap/ui/model/type/Boolean",
    "sap/ui/core/Title",
    "sap/m/library",
    "sap/m/Token",
    "sap/m/Tokenizer",
    "sap/m/MultiInput",
    "sap/m/MessageToast",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/SearchField",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/ResponsivePopover",
    "sap/m/CheckBox",
    "sap/m/RadioButtonGroup",
    "sap/m/RadioButton",
    "sap/m/Page",
    "sap/m/App",
    "sap/m/VBox",
    "sap/m/ColumnListItem",
    "sap/ui/layout/form/SimpleForm"
], function(Log, library, ValueHelpDialog, FilterBar, FilterGroupItem, FilterProvider, StringDate, TokenParser,
		Device, JSONModel, typeDouble, typeString, typeInt16, typeSingle, typeDecimal, typeOdataDate, typeOdataDateTimeOffset, typeOdataTime, typeOdataDateTime,
		typeOdataBoolean, typeDate, typeTime, typeBoolean, Title, mLibrary, Token, Tokenizer, MultiInput, MessageToast, Label, Input,
		SearchField, List, StandardListItem, ResponsivePopover, CheckBox, RadioButtonGroup, RadioButton, Page, App, VBox, ColumnListItem, SimpleForm){
	"use strict";

	var ValueHelpRangeOperation = library.valuehelpdialog.ValueHelpRangeOperation;
	var ListMode = mLibrary.ListMode;
	var PlacementType = mLibrary.PlacementType;

	var aKeys = ["CompanyCode", "CompanyName"];

	var token1 = new Token({
		key: "0001",
		text: "SAP SE (0001)"
	});
	var token2 = new Token({
		key: "0002",
		text: "SAP Labs India (0002)"
	});
	var rangeToken1 = new Token({
		key: "i1",
		text: "ID: a...z"
	}).data("range", {
		"exclude": false,
		"operation": ValueHelpRangeOperation.BT,
		"keyField": "CompanyCode",
		"value1": "a",
		"value2": "z"
	});
	var rangeToken2 = new Token({
		key: "i2",
		text: "ID: =foo"
	}).data("range", {
		"exclude": false,
		"operation": ValueHelpRangeOperation.EQ,
		"keyField": "CompanyCode",
		"value1": "foo",
		"value2": ""
	});
	var rangeToken3 = new Token({
		key: "e1",
		text: "ID !(=foo)"
	}).data("range", {
		"exclude": true,
		"operation": ValueHelpRangeOperation.EQ,
		"keyField": "CompanyCode",
		"value1": "foo",
		"value2": ""
	});
	var aTokens = [token1, token2, rangeToken1, rangeToken2, rangeToken3];

	var aItems = [{
		"CompanyCode": "0001",
		"CompanyName": "SAP SE",
		"Email": "gatesfernandez@quintity.com",
		"Phone": "+1 (826) 451-3236",
		"Street": "River Street 835",
		"City": "Veguita",
		"Country": "Cocos (Keeling Islands)",
		"Price": "2,904.03",
		"CurrencyCode": "EUR",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0002",
		"CompanyName": "SAP Labs India",
		"Email": "gatesfernandez@zoarere.com",
		"Phone": "+1 (990) 516-2987",
		"Street": "Woodhull Street 740",
		"City": "Babb",
		"Country": "Western Sahara",
		"Price": "2,999.79",
		"CurrencyCode": "JPY",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0003",
		"CompanyName": "ANDRYX",
		"Email": "gatesfernandez@andryx.com",
		"Phone": "+1 (877) 584-3223",
		"Street": "Kingston Avenue 234",
		"City": "Tyhee",
		"Country": "Indonesia",
		"Price": "3,787.33",
		"CurrencyCode": "JPY",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0004",
		"CompanyName": "NAXDIS",
		"Email": "gatesfernandez@naxdis.com",
		"Phone": "+1 (844) 406-3829",
		"Street": "Kenmore Terrace 352",
		"City": "Weogufka",
		"Country": "Lebanon",
		"Price": "1,409.28",
		"CurrencyCode": "EUR",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0005",
		"CompanyName": "ZILODYNE",
		"Email": "gatesfernandez@zilodyne.com",
		"Phone": "+1 (963) 499-2190",
		"Street": "Conover Street 963",
		"City": "Graball",
		"Country": "Sudan",
		"Price": "3,684.14",
		"CurrencyCode": "JPY",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0006",
		"CompanyName": "OPTICON",
		"Email": "gatesfernandez@opticon.com",
		"Phone": "+1 (974) 428-2229",
		"Street": "Hicks Street 491",
		"City": "Wauhillau",
		"Country": "Macau",
		"Price": "1,636.51",
		"CurrencyCode": "USD",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0007",
		"CompanyName": "EXOPLODE",
		"Email": "gatesfernandez@exoplode.com",
		"Phone": "+1 (960) 526-2398",
		"Street": "Caton Avenue 854",
		"City": "Barstow",
		"Country": "Zambia",
		"Price": "1,000.76",
		"CurrencyCode": "EUR",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0008",
		"CompanyName": "SENSATE",
		"Email": "gatesfernandez@sensate.com",
		"Phone": "+1 (987) 524-2004",
		"Street": "Varick Avenue 832",
		"City": "Hatteras",
		"Country": "Tanzania",
		"Price": "3,281.51",
		"CurrencyCode": "USD",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0009",
		"CompanyName": "MICROLUXE",
		"Email": "gatesfernandez@microluxe.com",
		"Phone": "+1 (831) 497-3795",
		"Street": "Elizabeth Place 171",
		"City": "Nipinnawasee",
		"Country": "Dominican Republic",
		"Price": "3,707.49",
		"CurrencyCode": "JPY",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0010",
		"CompanyName": "FLUMBO",
		"Email": "gatesfernandez@flumbo.com",
		"Phone": "+1 (939) 428-2762",
		"Street": "Madison Place 334",
		"City": "Neahkahnie",
		"Country": "Cook Islands",
		"Price": "3,208.85",
		"CurrencyCode": "USD",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0011",
		"CompanyName": "ENQUILITY",
		"Email": "gatesfernandez@enquility.com",
		"Phone": "+1 (829) 588-2268",
		"Street": "Friel Place 821",
		"City": "Staples",
		"Country": "Christmas Island",
		"Price": "1,475.17",
		"CurrencyCode": "JPY",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0012",
		"CompanyName": "MAINELAND",
		"Email": "gatesfernandez@maineland.com",
		"Phone": "+1 (890) 563-3099",
		"Street": "Sutter Avenue 797",
		"City": "Jessie",
		"Country": "Seychelles",
		"Price": "3,143.76",
		"CurrencyCode": "USD",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0013",
		"CompanyName": "ZILLAR",
		"Email": "gatesfernandez@zillar.com",
		"Phone": "+1 (941) 548-2792",
		"Street": "Celeste Court 987",
		"City": "Bradenville",
		"Country": "US Minor Outlying Islands",
		"Price": "3,784.07",
		"CurrencyCode": "USD",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0014",
		"CompanyName": "ENTHAZE",
		"Email": "gatesfernandez@enthaze.com",
		"Phone": "+1 (801) 507-2306",
		"Street": "Front Street 156",
		"City": "Hamilton",
		"Country": "Togo",
		"Price": "2,638.79",
		"CurrencyCode": "JPY",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0015",
		"CompanyName": "MEDALERT",
		"Email": "gatesfernandez@medalert.com",
		"Phone": "+1 (932) 600-3996",
		"Street": "Jefferson Street 287",
		"City": "Brambleton",
		"Country": "Myanmar",
		"Price": "1,473.13",
		"CurrencyCode": "EUR",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0016",
		"CompanyName": "TERSANKI",
		"Email": "gatesfernandez@tersanki.com",
		"Phone": "+1 (965) 584-3121",
		"Street": "Rock Street 358",
		"City": "Herald",
		"Country": "Chad",
		"Price": "1,270.66",
		"CurrencyCode": "EUR",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0017",
		"CompanyName": "PORTICO",
		"Email": "gatesfernandez@portico.com",
		"Phone": "+1 (852) 535-3383",
		"Street": "Gerritsen Avenue 811",
		"City": "Robinson",
		"Country": "Zimbabwe",
		"Price": "2,862.41",
		"CurrencyCode": "USD",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0018",
		"CompanyName": "ZEROLOGY",
		"Email": "gatesfernandez@zerology.com",
		"Phone": "+1 (876) 527-3684",
		"Street": "Walker Court 275",
		"City": "Gloucester",
		"Country": "Saint Kitts and Nevis",
		"Price": "2,322.42",
		"CurrencyCode": "EUR",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0019",
		"CompanyName": "INSURITY",
		"Email": "gatesfernandez@insurity.com",
		"Phone": "+1 (957) 532-3324",
		"Street": "Union Street 897",
		"City": "Ballico",
		"Country": "Hong Kong",
		"Price": "3,974.90",
		"CurrencyCode": "USD",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0020",
		"CompanyName": "OVOLO",
		"Email": "gatesfernandez@ovolo.com",
		"Phone": "+1 (853) 420-3932",
		"Street": "Ocean Avenue 519",
		"City": "Waverly",
		"Country": "Greece",
		"Price": "1,110.43",
		"CurrencyCode": "JPY",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0021",
		"CompanyName": "IRACK",
		"Email": "gatesfernandez@irack.com",
		"Phone": "+1 (839) 506-2922",
		"Street": "Sullivan Place 864",
		"City": "Maybell",
		"Country": "Qatar",
		"Price": "3,038.98",
		"CurrencyCode": "EUR",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0022",
		"CompanyName": "CHILLIUM",
		"Email": "gatesfernandez@chillium.com",
		"Phone": "+1 (996) 497-2711",
		"Street": "Jay Street 244",
		"City": "Cochranville",
		"Country": "Saint Lucia",
		"Price": "3,158.95",
		"CurrencyCode": "EUR",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0023",
		"CompanyName": "VELOS",
		"Email": "gatesfernandez@velos.com",
		"Phone": "+1 (957) 460-3686",
		"Street": "Prospect Avenue 472",
		"City": "Grenelefe",
		"Country": "Kyrgyzstan",
		"Price": "3,415.25",
		"CurrencyCode": "EUR",
		"BoolCode": false,
		"Date": new Date()
	}, {
		"CompanyCode": "0024",
		"CompanyName": "NETBOOK",
		"Email": "gatesfernandez@netbook.com",
		"Phone": "+1 (930) 550-2120",
		"Street": "Vandervoort Place 404",
		"City": "Leyner",
		"Country": "Denmark",
		"Price": "3,283.04",
		"CurrencyCode": "JPY",
		"BoolCode": true,
		"Date": new Date()
	}, {
		"CompanyCode": "0025",
		"CompanyName": "ZENSUS",
		"Email": "gatesfernandez@zensus.com",
		"Phone": "+1 (935) 455-2399",
		"Street": "Dahlgreen Place 790",
		"City": "Jacksonburg",
		"Country": "Rwanda",
		"Price": "3,054.33",
		"CurrencyCode": "EUR",
		"BoolCode": true,
		"Date": new Date()
	}];

	var theCompactMode = new CheckBox({
		selected: Device.system.desktop,
		//text: "Compact Mode",
		select: function() {
			jQuery("body").toggleClass("sapUiSizeCompact");
		}
	});

	var multipleKeyFields = new CheckBox({
		selected: true,
		//text: "multipe KeyField Values",
		select: function() {}
	});

	var singleSelect = new CheckBox({
		selected: false,
		//text: "Single Select Table",
		select: function() {}
	});

	var showCollectiveSearch = new CheckBox({
		selected: true,
		//text: "show Collective Search",
		select: function() {}
	});


	var showBasicSearch = new CheckBox({
		selected: true,
		//text: "has Basic Search",
		select: function() {}
	});

	var useExternalTable = new CheckBox({
		selected: false,
		//text: "use External Table",
		select: function() {}
	});

	jQuery(document).ready(function() {
		if (theCompactMode.getSelected()) {
			jQuery("body").addClass("sapUiSizeCompact");
		}
	});

	var bIgnoreTokenChange = false;

	var theTokenInput = new MultiInput({
		enableMultiLineMode: Device.system.phone,
		showSuggestion: true,
		maxSuggestionWidth: "auto",
		tokenUpdate: function(oControlEvent) {
			var j;
			if (bIgnoreTokenChange) {
				return;
			}
			if (oControlEvent.getParameter("type") === Tokenizer.TokenChangeType.Removed) {
				var aRemovedTokens = oControlEvent.getParameter("removedTokens");
				for (j = 0; j < aRemovedTokens.length; j++) {
					var sKey = aRemovedTokens[j].getKey();

					for (var i in aTokens) {
						if (aTokens[i].getKey() === sKey) {
							aTokens.splice(i, 1);
							break;
						}
					}
				}
			}

			if (oControlEvent.getParameter("type") === Tokenizer.TokenChangeType.Added) {
				var aAddedTokens = oControlEvent.getParameter("addedTokens");
				for (j = 0; j < aAddedTokens.length; j++) {
					aTokens.push(aAddedTokens[j]);
				}
			}

		}
	});

	var oTokenParser = new TokenParser("EQ");
	oTokenParser.associateInput(theTokenInput);
	oTokenParser.addKeyField({ key: "name", label: "Name", type: "string", oType: new sap.ui.model.type.String() });

	theTokenInput.setTokens(aTokens);

	var bRangesOnly = false;
	var bSupportRanges = true;
	var bIntervalOnly = false;
	var bFilter = false;
	var oValueHelpDialog = null;

	theTokenInput.attachValueHelpRequest(function() {
		if (oValueHelpDialog) {
			//sometimes we get two ValueHelpRequests events, so we ignore the second when we have a
			return;
		}

		// begin table handling #################################################
		if (useExternalTable.getSelected()) {
			// use an extern table instance
			sap.ui.getCore().loadLibrary('sap.ui.table', {async: true}).then(function() {
				sap.ui.require([
//						"sap/ui/table/Table"
//						"sap/m/Table"
						"sap/ui/table/TreeTable"//,
//						"sap/ui/table/Column"
//						"sap/ui/table/AnalyticalTable"
//						"sap/ui/comp/smarttable/SmartTable"
				], function(fnTable, fnColumn) {
					var oTable = new fnTable("myTable", {
//						tableType: library.smarttable.TableType.Table //AnalyticalTable, ResponsiveTable, TreeTable
					});
					/*
						oTreeTable.addColumn( new fnColumn({label: "Company Code", template: "CompanyCode"}));
						oTreeTable.addColumn( new fnColumn({label: "Company Name", template: "CompanyName"}));
						oTreeTable.addColumn( new fnColumn({label: "City", template: "City"}));
						oTreeTable.addColumn( new fnColumn({label: "Currency Code", template: "CurrencyCode"}));
						oTreeTable.addColumn( new fnColumn({label: "Date", template: "Date"}));
						oTreeTable.addColumn( new fnColumn({label: "Boolean", template: "BoolCode"}));

						var oModel = new JSONModel();
						oModel.setData(oTreeItems);
						oTable.setModel(oModel);
						oTable.bindRows("/");
					 */
					openValueHelpDialog.call(this, oTable);
				}.bind(this));
			}.bind(this));
		} else {
			openValueHelpDialog.call(this);
		}
	});

	function openValueHelpDialog(oExtrenalTable) {
		var i = oRBGroup.getSelectedIndex();

		if (i === 0) {
			bRangesOnly = false;
			bSupportRanges = true;
			bIntervalOnly = false;
			bFilter = false;
		}
		if (i === 1) {
			bRangesOnly = false;
			bSupportRanges = false;
			bIntervalOnly = false;
			bFilter = false;
		}
		if (i === 2) {
			bRangesOnly = true;
			bSupportRanges = true;
			bIntervalOnly = false;
			bFilter = false;
		}
		if (i === 3) {
			bRangesOnly = true;
			bSupportRanges = true;
			bIntervalOnly = false;
			bFilter = true;
		}
		if (i === 4) {
			bRangesOnly = true;
			bSupportRanges = true;
			bIntervalOnly = true;
			bFilter = false;
		}
		var iMaxExcludeRanges;
		if (bIntervalOnly) {
			iMaxExcludeRanges = 0;
		} else if (bFilter) {
			iMaxExcludeRanges = 0;
		} else {
			iMaxExcludeRanges = -1;
		}
		oValueHelpDialog = new ValueHelpDialog("VHD", {
			basicSearchText: theTokenInput.getValue(),
			title: bFilter ? "Enter Some Filters" : "Company",
			supportMultiselect: !singleSelect.getSelected(),
			supportRanges: bSupportRanges,
			supportRangesOnly: bRangesOnly,
			filterMode: bFilter,
			maxIncludeRanges: bIntervalOnly ? 1 : -1,
			maxExcludeRanges: iMaxExcludeRanges,
			key: aKeys[0],
			//displayFormat: "UpperCase",
			descriptionKey: aKeys[1],

			ok: function(oControlEvent) {
				aTokens = oControlEvent.getParameter("tokens");

				var sTokens = "";
				for (i = 0; i < aTokens.length; i++) {
					var oToken = aTokens[i];
					sTokens += oToken.getText() + " " + JSON.stringify(oToken.data("range")) + "\n";
				}
//				MessageToast.show("Tokens= " + sTokens);
				oTextArea.setValue(sTokens);

				bIgnoreTokenChange = true;
				theTokenInput.setTokens(aTokens);
				bIgnoreTokenChange = false;

				oValueHelpDialog.close();
				oValueHelpDialog = null;
			},

			cancel: function(oControlEvent) {
				MessageToast.show("Cancel pressed!");
				oValueHelpDialog.close();
				oValueHelpDialog = null;
			},

			afterClose: function() {
				this.destroy();
				oValueHelpDialog = null;
				if (!Device.system.phone) {
					theTokenInput.focus();
				}
			},

			selectionChange: function(oControlEvent) {
				var oTable = oControlEvent.getParameter("table");

				if (oTable && oTable.isA("sap.ui.table.Table")) {
					var tableSelectionParams = oControlEvent.getParameter("tableSelectionParams");
					var rowIndex = tableSelectionParams.rowIndex;
					var rowIndices = tableSelectionParams.rowIndices;
					var bSelected = oTable.isIndexSelected(rowIndex);
					oControlEvent.mParameters.useDefault = true;
					var aUpdateTokens = oControlEvent.getParameter("updateTokens");

					if (rowIndex === -1) {
						return;
					}

					// select two rows of the table
					if (rowIndices.length === 1) {
						var j = rowIndices[0] + 1;
						rowIndices.push(j);
						if (bSelected) {
							oTable.addSelectionInterval(j, j);
						} else {
							oTable.removeSelectionInterval(j, j);
						}
					}

					for (var i = 0; i < rowIndices.length; i++) {
						var index = rowIndices[i];
						var oContext = oTable.getContextByIndex(index);
						var oRow = oContext ? oContext.getObject() : null;

						if (oRow) {
							var sKey = oRow[oValueHelpDialog.getKey()];
							aUpdateTokens.push({
								sKey: sKey,
								oRow: oRow,
								bSelected: oTable.isIndexSelected(index)
							});
						}
					}
				} else if (oTable && oTable.isA("sap.m.Table")) {
					var listItem = oControlEvent.getParameter("listItem");
					var listItems = oControlEvent.getParameter("listItems");
					var bSelected = oControlEvent.getParameter("selected");
					Log("ItemSelected " + bSelected + " " + listItem + " " + (listItems ? listItems.length : 0));
				}

				MessageToast.show("event ItemSelected fired.");
			},

			tokenRemove: function(oControlEvent) {
				if (!useExternalTable.getSelected()) {
					return;
				}

				var aTokenKeys = oControlEvent.getParameter("tokenKeys");
				MessageToast.show("event TokenRemoved fired.");

				var i, j;
				oValueHelpDialog.getTableAsync().then(function(oTable){
					if (oTable && oTable.isA("sap.ui.table.Table")) {
						var oRows = oTable.getBinding("rows");
						for (j = 0; j < aTokenKeys.length; j++) {
							var sTokenKey = aTokenKeys[j];
							for (i = 0; i < oRows.getLength(); i++) {
								var oContext;
								if (oRows.getContextByIndex) {
									oContext = oRows.getContextByIndex(i);
								} else {
									//oContext = oTable.getContextByIndex(oRows.aIndices[i]);
									oContext = oRows.getContexts()[i];
								}
								if (oContext) {
									var oRow = oContext.getObject();
									if (oRow[oValueHelpDialog.getKey()] === sTokenKey) {
										oTable.removeSelectionInterval(i, i);
										break;
									}
								}
							}
						}
					}
				});

			},

			updateSelection: function(oControlEvent) {
				if (!useExternalTable.getSelected()) {
					return;
				}
				var aTokenKeys = oControlEvent.getParameter("tokenKeys");
				MessageToast.show("event updateSelection fired.");

				var i, j;
				oValueHelpDialog.getTableAsync().then(function(oTable){
					if (oTable && oTable.isA("sap.ui.table.Table")) {
						var oRows = oTable.getBinding("rows");
						for (j = 0; j < aTokenKeys.length; j++) {
							var sTokenKey = aTokenKeys[j];
							for (i = 0; i < oRows.getLength(); i++) {
								var oContext;
								if (oRows.getContextByIndex) {
									oContext = oRows.getContextByIndex(i);
								} else {
									oContext = oRows.getContexts()[i];
								}
								if (oContext) {
									var oRow = oContext.getObject();
									if (oRow[oValueHelpDialog.getKey()] === sTokenKey) {
										oTable.addSelectionInterval(i, i);
										break;
									}
								}
							}
						}
					}
				});
			}

		});

		if (oExtrenalTable) {
			// assign an extern table instance
			oValueHelpDialog.setTable(oExtrenalTable);
		}

		var oTable = null; //oValueHelpDialog.getTable();
		//if (!(oTable.isA("sap.ui.table.TreeTable")) && !this.oSmartTable && (oValueHelpDialog._bTableCreatedInternal || oTable.isA("sap.m.Table") || oTable.clearSelection)) {
		if (!this.oSmartTable && (oValueHelpDialog._bTableCreatedInternal || !oTable || oTable.isA("sap.m.Table") || (oTable && oTable.clearSelection))) {
			var oColModel = new JSONModel();
			oColModel.setData({
				cols: [{
					label: "Company Code",
					template: "CompanyCode"
				}, {
					label: "Company Name",
					template: "CompanyName"
				}, {
					label: "City",
					template: "City",
					demandPopin: true
				}, {
					label: "Currency Code",
					template: "CurrencyCode",
					demandPopin: true
				}, {
					label: "Date",
					template: "Date",
					type: "date",
					oType: new typeDate(),
					demandPopin: true
				}, {
					label: "Boolean",
					template: "BoolCode",
					type: "boolean",
					demandPopin: true
				}]
			});
			if (Device.system.phone) {
				oColModel.getData().cols.pop();
				oColModel.getData().cols.pop();
			}

			var oRowsModel = new JSONModel();
			oRowsModel.setData(aItems);
			oValueHelpDialog.getTableAsync().then(function(oTable){
				oTable.setModel(oColModel, "columns");
				oTable.setModel(oRowsModel);
				if (oTable.bindRows) {
					oTable.bindRows("/");
				}
				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/", function(sId, oContext) {
						var aCols = oTable.getModel("columns").getData().cols;

						return new ColumnListItem({
							cells: aCols.map(function(column) {
								var colname = column.template;
								return new Label({
									text: "{" + colname + "}"
								});
							})
						});
					});
				}
				oValueHelpDialog.update();
			});


		}

		//oValueHelpDialog.setIncludeRangeOperations([ ValueHelpRangeOperation.BT ]);
		if (multipleKeyFields.getSelected()) {
			oValueHelpDialog.setRangeKeyFields([{
				key: "CompanyCode",
				label: "ID"
			}, {
				key: "CompanyName",
				label: "Name",
				type: "string",
				//maxLength: "10",
				typeInstance: new typeString({}, {
					maxLength: 10
				})
			}, {
				key: "Int16",
				label: "Int16 (oData)",
				type: "numeric",
				typeInstance: new typeInt16()
			}, {
				key: "numeric",
				label: "Numeric (without TypeInstance)",
				type: "numeric",
				precision: "24",
				scale: "3"
			}, {
				key: "Single",
				label: "Single (oData)",
				type: "numeric",
				/*	precision: "24",
					scale: "3",*/
				typeInstance: new typeSingle({
					maxIntegerDigits: 5,
					maxFractionDigits: 2
				})
			}, {
				key: "Double",
				label: "Double (oData)",
				type: "numeric",
				typeInstance: new typeDouble({
					maxIntegerDigits: 10,
					maxFractionDigits: 3
				})
			}, {
				key: "Decimal",
				label: "Decimal (oData)",
				type: "decimal",
				typeInstance: new typeDecimal({}, {
					precision: 24,
					scale: 3
				})
			}, {
				key: "Date",
				label: "Date",
				type: "date", //TODO type defines the operations
				ctrlType: "date", //TODO
				//formatSettings: {UTC: false, style: "long"}
				typeInstance: new typeDate({
					UTC: false,
					style: "long",
					strictParsing: true
				})
			}, {
				key: "Date1",
				label: "Date (without TypeInstance)",
				type: "date", //TODO type defines the operations
				ctrlType: "date", //TODO
				formatSettings: {
					UTC: false,
					style: "long"
				}
			}, {
				key: "odataDate",
				label: "Date (oData)",
				type: "date", //TODO type defines the operations
				ctrlType: "date", //TODO
				//formatSettings: {UTC: false, style: "long"}
				typeInstance: new typeOdataDate({
					UTC: false,
					style: "long",
					strictParsing: true
				})
			},  {
				key: "DateTimeOffset",
				label: "DateTimeOffset (oData)",
				type: "datetimeoffset",
				typeInstance: new typeOdataDateTimeOffset({
					UTC: false,
					style: "long",
					strictParsing: true
				})
			}, {
				key: "Time",
				label: "Time",
				type: "time",
				//formatSettings: {UTC: false, style: "short"}
				typeInstance: new typeTime({
					UTC: false,
					style: "short",
					strictParsing: true
				})
			}, {
				key: "odataTime",
				label: "Time (oData)",
				type: "time",
				//formatSettings: {UTC: false, style: "short"}
				typeInstance: new typeOdataTime({
					UTC: false,
					style: "short",
					strictParsing: true
				})
			}, {
				key: "DateTime",
				label: "DateTime (oData)",
				type: "datetime",
				//formatSettings: {UTC: false, style: "short"}
				typeInstance: new typeOdataDateTime({
					UTC: false,
					style: "long",
					strictParsing: true
				})
			}, {
				key: "Numc",
				label: "NUMC",
				type: "numc",
				/*                     formatSettings: {isDigitSequence: true, maxLength: 10},
				 */
				maxLength: "10",
				typeInstance: new typeString({}, {
					isDigitSequence: true,
					maxLength: 10
				})
			}, {
				key: "stringdate",
				label: "Stringdate",
				type: "stringdate",
				//formatSettings: {UTC: false, style: "long"}
				typeInstance: new StringDate({
					UTC: false,
					style: "long",
					strictParsing: true
				})
			}, {
				key: "Bool0",
				label: "Boolean (without TypeInstance)",
				type: "boolean"
			}, {
				key: "Bool",
				label: "Boolean",
				type: "boolean",
				typeInstance: new typeBoolean()
			}, {
				key: "odataBool",
				label: "Boolean (oData)",
				type: "boolean",
				typeInstance: new typeOdataBoolean()
			}]);
		} else {
			oValueHelpDialog.setRangeKeyFields([{
				key: "CompanyCode",
				label: "ID"
			}]);
		}
		oValueHelpDialog.setTokens(aTokens);

		oTokenParser._aKeyFields = []; // currently not possible to remove all keyfields
		oValueHelpDialog.getRangeKeyFields().forEach(function(element) {
			oTokenParser.addKeyField({ key: element.key, label: element.label, type: element.type, oType: element.typeInstance });
		});

		// Begin of Filterbar handling #########################################
		var oFilterBar = new FilterBar({
			advancedMode: true,
			filterBarExpanded: false, //Device.system.phone,
			//showGoOnFB: !Device.system.phone,
			filterGroupItems: [new FilterGroupItem({
				groupTitle: "More Fields",
				groupName: "gn1",
				name: "n1",
				label: "Company Code",
				control: new Input(),
				visibleInFilterBar: true
			}),
			new FilterGroupItem({
				groupTitle: "More Fields",
				groupName: "gn1",
				name: "n2",
				label: "Company Name",
				control: new Input(),
				visibleInFilterBar: true
			}),
			new FilterGroupItem({
				groupTitle: "More Fields",
				groupName: "gn1",
				name: "n3",
				label: "City",
				control: new Input(),
				visibleInFilterBar: true
			}),
			new FilterGroupItem({
				groupTitle: "More Fields",
				groupName: "gn1",
				name: "n4",
				label: "Currency Code",
				control: new Input(),
				visibleInFilterBar: true
			})
			],
			search: function(oEvent) {
				var aSearchItems = oEvent.mParameters.selectionSet;
				var sMsg;
				if (this.getBasicSearch()) {
					sMsg = sap.ui.getCore().byId(this.getBasicSearch()).getValue();
					for (var i = 0; i < aSearchItems.length; i++) {
						sMsg += "/" + aSearchItems[i].getValue();
					}
				}
				MessageToast.show("Search pressed '" + sMsg + "'");
			},
			clear: function(oEvent) {
				MessageToast.show("Clear pressed");
			}
		});

		if (oFilterBar.setBasicSearch && showBasicSearch.getSelected()) {
			oFilterBar.setBasicSearch(new SearchField({
				showSearchButton: false,
				placeholder: "Search"
				//search: function(event) {
					//	oValueHelpDialog.getFilterBar().search();
					//}
			}));
		}
		oValueHelpDialog.setFilterBar(oFilterBar);

		// Begin of CollectiveSearch handling ####################################
		oValueHelpDialog.oSelectionTitle.setText("Select Search Template");
		oValueHelpDialog.oSelectionTitle.setVisible(true);
		oValueHelpDialog.oSelectionButton.setVisible(showCollectiveSearch.getSelected());

		var i, oPopOver, oList, fOnSelect;

		fOnSelect = function(oEvt) {
			var oSource = oEvt.getParameter("listItem");
			oPopOver.close();
			if (oSource) {
				var oAnnotation = oSource.data("_annotation");
				if (oAnnotation) {
					oValueHelpDialog.oSelectionTitle.setText(oAnnotation);
					oValueHelpDialog.oSelectionTitle.setTooltip(oAnnotation);
				}
			}
		};

		oList = new List({
			mode: ListMode.SingleSelectMaster,
			selectionChange: fOnSelect
		});

		for (i = 0; i < 50; i++) {
			var sTitle = i === 10 ? "Search Template verrrrryyyyyyyy verrrrrrrrrrryyyyyyyyyy long " : "Search Template " + i;
			var oItem = new StandardListItem({
				title: sTitle
			});
			oItem.data("_annotation", sTitle);
			oList.addItem(oItem);
		}
		oList.setSelectedItem(oList.getItems()[0]);
		oValueHelpDialog.oSelectionTitle.setText(oList.getItems()[0].getTitle());
		oValueHelpDialog.oSelectionTitle.setTooltip(oList.getItems()[0].getTitle());
		// bPopoverOpen = false;

		oPopOver = new ResponsivePopover({
			placement: PlacementType.Bottom,
			showHeader: true,
			title: "Select Search Template",
			contentHeight: "30rem",
			content: [
			          oList
			          ],
			          afterClose: function() {
                        oValueHelpDialog._rotateSelectionButtonIcon(false);
                        // setTimeout(function() {
                        //     bPopoverOpen = false;
                        // }, 300);
			          }
		});

		oValueHelpDialog.oSelectionButton.attachPress(function() {
			if (!oPopOver.isOpen()) {
				//bPopoverOpen = true;
				oValueHelpDialog._rotateSelectionButtonIcon(true);
				oPopOver.openBy(this);
			} else {
				oPopOver.close();
			}
		});
		// End of CollectiveSearch handling ##############################

		if (theTokenInput.$() && theTokenInput.$().closest(".sapUiSizeCompact").length > 0) {
			// check if the Token field runs in Compact mode. We either find via closed a element with class sapUiSizeCompact or the body has such class
			oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		} else if (theTokenInput.$() && theTokenInput.$().closest(".sapUiSizeCozy").length > 0) {
			oValueHelpDialog.addStyleClass("sapUiSizeCozy");
		} else if (jQuery("body").hasClass("sapUiSizeCompact")) {
			oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		} else {
			oValueHelpDialog.addStyleClass("sapUiSizeCozy");
		}

		oValueHelpDialog.open();
	}


	// Simple RadioButtonGroup
	var oRBGroup = new RadioButtonGroup("RBG1");
	oRBGroup.setTooltip("Group 1");

	var oButton = new RadioButton("RB1-1");
	oButton.setText("Normal");
	oRBGroup.addButton(oButton);

	oButton = new RadioButton("RB1-2");
	oButton.setText("List only");
	oRBGroup.addButton(oButton);

	oButton = new RadioButton("RB1-3");
	oButton.setText("Conditions only");
	oRBGroup.addButton(oButton);

	oButton = new RadioButton("RB1-4");
	oButton.setText("multiple Conditions");
	oRBGroup.addButton(oButton);

	oButton = new RadioButton("RB1-5");
	oButton.setText("single Condition");
	oRBGroup.addButton(oButton);

	oRBGroup.setSelectedIndex(0);


	this.oSmartTable = null;

	var oSwitchLabel = new Label({ text : "Calendar type:"});
	var oSwitch = new sap.m.Switch({ customTextOn : "none Gregorian", customTextOff : "Gregorian", change: function(oEvent) {
		// id of the ABAP data format (one of '1','2','3','4','5','6','7','8','9','A','B','C')
		if (oEvent.getParameter("state") == true) {
			sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyDateFormat("A");
		} else {
			sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyDateFormat();
		}
	}});

	var editableSimpleForm = new SimpleForm({
		layout: "ColumnLayout",
		editable: true,
		content: [
			new Title({
				text: "MultiInput Field with Tokens"
			}),
			new Label({
				text: 'Company'
			}),
			theTokenInput,
			new Title({
				text: "Settings"
			}),
			new Label({
				text: 'Compact Mode'
			}),
			theCompactMode,
			new Label({
				text: 'multipe KeyField Values'
			}),
			multipleKeyFields,
			new Label({
				text: 'Single Select Table'
			}),
			singleSelect,
			new Label({
				text: 'show Collective Search'
			}),
			showCollectiveSearch,
			new Label({
				text: 'has Basic Search'
			}),
			showBasicSearch,
			new Label({
				text: 'use external Table'
			}),
			useExternalTable,
			//triggerBtn,

			new Label({
				text: 'Value Help Types'
			}),
			oRBGroup,
			oSwitchLabel, oSwitch
			]
	});


	var oTextArea = new sap.m.TextArea({rows: 20, cols: 150});

	var formPage = new Page("formPage", {
		title: "Test Page for sap.ui.comp.valuehelpdialog.ValueHelpDialog",
		content: [
			new VBox({
				width: "100%",
				items: [
					editableSimpleForm
					]
			}), oTextArea
			]
	}).addStyleClass("sapUiFioriObjectPage");


	if (this.oSmartTable) {
		formPage.getContent()[0].addItem(this.oSmartTable);
	}


	var app = new App("myApp", {
		initialPage: "formPage"
	});
	app.addPage(formPage).placeAt("content");
});
