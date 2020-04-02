sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/rules/ui/integration/pages/Common',
		"sap/ui/test/actions/Press"
	],
	function(Opa5, Common, Press) {
		"use strict";

		Opa5.createPageObjects({
			onValueHelpPopUpPage: {
				baseClass: Common,
				actions: {
					iCanSeeValueHelpPopUp: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog", // sap/m/StandardListItem
							//id: sButtonId,
							viewName: sViewName,
							matchers: function(oValueHelp) {
								var oDialogTable = oValueHelp.getTable();
								return !oDialogTable.getBusy();
							},
							success: function(oButton) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The ValuHelp popup is not found"
						});
					},
					iSelectValueHelpPopUp: function(successMessage, sValue, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog", // sap/m/StandardListItem
							//id: sButtonId,
							viewName: sViewName,
							matchers: function(oValueHelp) {
								var oDialogTable = oValueHelp.getTable();
								var oRows = oDialogTable.getRows();
								for (var i = 0; i < oRows.length; i++) {
									var oCols = oRows[i].getCells();
									for (var j = 0; j < oCols.length; j++) {
										if (oCols[j].getText() === sValue) {
											return oCols[j];
										}
									}
								}
							},
							success: function(oCell) {
								jQuery(oCell[0].getDomRef()).click();
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The ValuHelp popup is not found"
						});
					},
					iClickOnValuHelpLink: function(successMessage, iNumberOfRow, iNumberOfCell, sViewName) {
							return this.waitFor({
								controlType: "sap.ui.table.Table",
								viewName: sViewName,
								matchers: function(oTable) {
									return (oTable.getRows() && oTable.getRows()[iNumberOfRow] && (oTable.getRows()[iNumberOfRow].getCells().length > 1));
								},
								success: function(oTable) {
									var oDT = oTable[0];
									var oRow = oDT.getRows()[iNumberOfRow];
									var oCells = oRow.getCells();
									var displayedControl = oCells[iNumberOfCell].getAggregation("_displayedControl");
									jQuery(displayedControl.getDomRef()).click();
									Opa5.assert.ok(true, successMessage);
								},
								errorMessage: "Cannot Set Cell focus"
							});
						},
					iPressTheButton: function(successMessage, buttonText, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.m.Button",
							//id: sButtonId,
							viewName: sViewName,
							matchers: function(oButton) {
								return (oButton.getText() == buttonText);
							},
							actions: [new Press()],

							success: function(oButton) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The button "+ buttonText +" is not found"
						});
					}						
						
				},
				assertions: {
				}
			}
		});
	});