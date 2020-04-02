/* global QUnit */

QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/core/ValueState"
], function (
	Opa5,
	opaTest,
	Press,
	EnterText,
	PropertyStrictEquals,
	ValueState
) {
	"use strict";

	var oRB;

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_types",
		autoWait: true,
		arrangements: new Opa5({
			iStartMyApp: function (bNullableFields) {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html" + (bNullableFields ? "?nullableFalse=true" : "")
					)).then(function () {
						// Cache resource bundle URL
						oRB = Opa5.getWindow().sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
					});
			}
		}),
		actions: new Opa5({
			iPressTheFilterGoButton: function() {
				return this.waitFor({
					id: "smartFilterBar-btnGo",
					controlType: "sap.m.Button",
					actions: new Press(),
					errorMessage: "Did not find the button 'Go'"
				});
			},
			iPressTheShowAllFilterButton: function() {
				return this.waitFor({
					id: "showAllFilterFields",
					actions: new Press(),
					errorMessage: "Did not find the button 'Show All Filters'"
				});
            },
            iPressSearchFieldIconButton:function () {
                return this.waitFor({
                    id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-smartFilterBar-btnGo",
                    controlType: "sap.m.Button",
                    actions: new Press(),
                    searchOpenDialogs: true
                });
            },
			iPressValueHelpIcon: function(sFieldID) {
				return this.waitFor({
					id: sFieldID,
					controlType: "sap.ui.core.Icon",
					actions: new Press(),
					errorMessage: "Did not find the Value help with ID" + sFieldID
				});
			},
			iEnterStringInFiled: function (sFieldID, sString, sErrorMessage, bKeepFocus) {
				return this.waitFor({
					id: sFieldID,
					actions: new EnterText({
						text: sString,
						keepFocus: !!bKeepFocus
					}),
					errorMessage: sErrorMessage ? sErrorMessage : "Did not find the field"
				});
			},
			iNavigateToTheDefineConditionsTab: function () {
				return this.waitFor({
					controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
					success: function (aDialogs) {
						aDialogs[0]._updateView("DESKTOP_CONDITIONS_VIEW");
					}
				});
			},
			iExpandTheExcludeOperationsPanel: function () {
				return this.waitFor({
					controlType: "sap.m.Panel",
					searchOpenDialogs: true,
					matchers: new PropertyStrictEquals({
						name: "expanded",
						value: false
					}),
					success: function (aControls) {
						return aControls[0].setExpanded(true);
					}
				});
			},
			iSelectOperation: function (sOperation, bExclude) {
				return this.waitFor({
					controlType: "sap.m.Select",
					success: function (aControls) {
						// First control should be the include operations select and second the exclude
						aControls[bExclude ? 1 : 0].setSelectedKey(sOperation).fireEvent("change");
					},
					searchOpenDialogs: true
				});
			},
			iPressTheVHDOKButton: function () {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: function (oControl) {
						return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.getType() === sap.m.ButtonType.Emphasized;
					},
					actions: new Press(),
					searchOpenDialogs: true
				});
			},
			iOpenTheVHD: function (sControlID) {
				return this.waitFor({
					id: sControlID + "-vhi",
					controlType: "sap.ui.core.Icon",
					actions: new Press()
				});
			},
			iChangeTheCondition: function (sNewCondition, bExclude, iCondition) {
				var sLabel = bExclude ? "Exclude" : "Include";

				if (iCondition === undefined) {
					iCondition = 0;
				}

				return this.waitFor({
					controlType: "sap.m.Panel",
					searchOpenDialogs: true,
					matchers: function (oPanel) {
						// We try to match only the "Include/Exclude" part
						return oPanel.getHeaderText().substring(0, sLabel.length) === sLabel;
					},
					success: function (aPanels) {
						var oConditionPanel = aPanels[0].getContent()[0],
							aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
								return oControl.isA("sap.ui.layout.Grid");
							}),
							oSelect = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
								// Heuristics: the first sap.m.Select control in the condition panel is the operations select
								return oControl.isA("sap.m.Select");
							})[0];
						oSelect.open();
						oSelect.findItem("text", sNewCondition).$().trigger("tap");
					}
				});
			},
			iEnterTextInConditionField: function(bExclude, iCondition, sText1, sText2){
				var sLabel = bExclude ? "Exclude" : "Include";

				if (iCondition === undefined) {
					iCondition = 0;
				}

				return this.waitFor({
					controlType: "sap.m.Panel",
					searchOpenDialogs: true,
					matchers: function (oPanel) {
						// We try to match only the "Include/Exclude" part
						return oPanel.getHeaderText().substring(0, sLabel.length) === sLabel;
					},
					success: function (aPanels) {
						var oConditionPanel = aPanels[0].getContent()[0],
							aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
								return oControl.isA("sap.ui.layout.Grid");
							}),
							aInputs = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
								// Heuristics find input fields
								return oControl.isA("sap.m.Input");
							});

						new EnterText({
							text: sText1
						}).executeOn(aInputs[0]);

						if (aInputs[1]) {
							new EnterText({
								text: sText2
							}).executeOn(aInputs[1]);
						}
					}
				});
			},
			iPressTheFilterAddButton: function (bExclude) {
				return this.waitFor({
					controlType: "sap.m.Button",
					searchOpenDialogs: true,
					matchers: [
						new PropertyStrictEquals({
							name: "tooltip",
							value: "Add Condition"
						}),
						new PropertyStrictEquals({
							name: "icon",
							value: "sap-icon://add"
						})
					],
					success: function (aButtons) {
						new Press().executeOn(aButtons[bExclude ? 1 : 0]);
					}
				});
			}
		}),
		assertions: new Opa5({
			theRequestURLShouldMatch: function (sRequestURL, sErrorMessage) {
				return this.waitFor({
					id: "outputAreaUrl",
					success: function (oText) {
						Opa5.assert.strictEqual(
							oText.getText(),
							sRequestURL,
							sErrorMessage ? sErrorMessage : "Request URL should match"
						);
					}
				});
			},
			theFiltersShouldMatch: function (sFilters, sErrorMessage) {
				return this.waitFor({
					id: "outputAreaFilters",
					success: function (oText) {
						Opa5.assert.strictEqual(
							oText.getText(),
							sFilters,
							sErrorMessage ? sErrorMessage : "Filters should match"
						);
					}
				});
			},
			theErrorDialogIsOpen: function () {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					searchOpenDialogs: true,
					success: function (aDialogs) {
						var oDialog = aDialogs[0];

						Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Error Dialog should be open');
						// Opa5.assert.strictEqual(oDialog.getTitle(), oRB.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
						// 	"Error dialog title should match");
						Opa5.assert.strictEqual(
							oDialog.getContent()[0].getText(),
							oRB.getText("VALIDATION_ERROR_MESSAGE"), "Error message in dialog should match"
						);
					},
					errorMessage: "did not find the filters dialog",
					timeout: 15
				});
            },
            theWarningDialogIsOpen: function () {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					searchOpenDialogs: true,
					success: function (aDialogs) {
						var oDialog = aDialogs[1];

						Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Warning Dialog should be open');

						Opa5.assert.strictEqual(
							oDialog.getTitle(),
							oRB.getText("VALUEHELPDLG_SELECTIONFAILEDLOADTITLE"), "Warning message in dialog should match"
						);
					},
					errorMessage: "did not find the warning filters dialog",
					timeout: 15
				});
			},
			thereIsNoEmptyOperation: function (sControl, bExclude) {
				return this.waitFor({
					controlType: "sap.m.Select",
					searchOpenDialogs: true,
					success: function (aControls) {
						Opa5.assert.strictEqual(
							!!aControls[bExclude ? 1 : 0].findItem("key", "Empty"),
							false,
							"There is no Empty operation in " + (bExclude ? "include" : "exclude") + " operations select for " + sControl
						);
					}
				});
            },
            setCountableTypeToModule: function (sDefaultCountModelType) {
				return this.waitFor({
                    success: function () {
                        Opa5.getWindow().jQuery("#__xmlview0").control(0).getModel().setDefaultCountMode(sDefaultCountModelType);
                    },
                    errorMessage: "Did not find the view"
                });
            },
			iShouldSeeValueHelpDialog: function (sId, iBaseSearchFilters, iRows) {
				return this.waitFor({
					controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
					id: sId,
					success: function (oVHD) {
						var sBasicSearchText = oVHD.getBasicSearchText(),
							aContexts = oVHD.getTable().getBinding("rows").getCurrentContexts();
						Opa5.assert.equal(sBasicSearchText, iBaseSearchFilters, "The ValueHelpDialog " + sId + " contains the correct base search filter");
						Opa5.assert.equal(aContexts.length, iRows, "The ValueHelpDialog " + sId + " contains the correct number of Rows");
					}
				});
			}
		})
	});

	QUnit.module("Defaults");

	opaTest("Default settings", function(Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");

		// Act
		When.iPressTheShowAllFilterButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("");

		// Arrange
		var controlId = "multiComboBoxWithTooltip";

		//Overwrite Tooltip from view.xml BCP: 1970470346
		// Act

		// Assert
		Then.waitFor({
			id: controlId,
			success: function (oControl) {
				Opa5.assert.equal(oControl.getTooltip(), "Tooltip View overwrite",
					"Control with ID '" + controlId + "' is with expected tooltip 'Tooltip View overwrite'");
			},
			errorMessage: "Tooltip is not overwrite from the view.xml"
		});

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Input types", function(Given, When, Then) {
		var oExpectedFieldTypes = {
			"smartFilterBar-btnBasicSearch": "sap.m.SearchField",
			"smartFilterBar-filterItemControlA_-BOOL_SINGLE": "sap.m.Select",
			"smartFilterBar-filterItemControlA_-BOOL_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-BOOL_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-BOOL_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_OUT2": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DECIMAL_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DECIMAL_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-DECIMAL_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DECIMAL_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-FLOAT_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-FLOAT_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-FLOAT_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-FLOAT_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-NUMC_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-NUMC_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-NUMC_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-NUMC_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-STRING_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_IN1": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-STRING_INOUT": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-STRING_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_OUT1": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_Bukrs": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_DisplayCurrency": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_Int": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate": "sap.m.DatePicker",
			"smartFilterBar-filterItemControlA_-_Parameter.P_Time": "sap.m.TimePicker",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_SINGLE": "sap.m.DateTimePicker",
			"smartFilterBar-filterItemControlDate.Group-DATE_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL": "sap.m.DateRangeSelection",
			"smartFilterBar-filterItemControlDate.Group-DATE_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDate.Group-DATE_SINGLE": "sap.m.DatePicker",
			"smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO": "sap.m.Input",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_INTERVAL": "sap.m.DateRangeSelection",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_SINGLE": "sap.m.DatePicker",
			"smartFilterBar-filterItemControlTime.Group-TIME_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlTime.Group-TIME_INTERVAL": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlTime.Group-TIME_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlTime.Group-TIME_SINGLE": "sap.m.TimePicker"
		};

		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheShowAllFilterButton();

		// Assert
		Object.keys(oExpectedFieldTypes).forEach(function (sKey) {
			var sType = oExpectedFieldTypes[sKey];
			Then.waitFor({
				id: sKey,
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getMetadata().getName(), sType,
						"Control with ID '" + sKey + "' is of expected type '" + sType + "'");
				}
			});
		});

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Date fields");

	opaTest("Single date", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate","1/1/19");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2019-01-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");

		// Act - Open the Date Picker value help
		When.waitFor({
			id: "smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate-icon",
			controlType: "sap.ui.core.Icon",
			actions: new Press()
		});

		// Act - Select the date and trigger the filter generation
		When.waitFor({
			controlType: "sap.ui.unified.Calendar",
			searchOpenDialogs: true,
			success: function (aCalendars) {
				var $NextDate = aCalendars[0].$().find(".sapUiCalItemSel").next(); // Should be the "1/2/19";

				// Month picker/Calendar specific - you have to trigger both events instead of a click
				$NextDate.trigger("mousedown");
				$NextDate.trigger("mouseup");
			}
		});
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2019-01-02T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");

		// Act - enter invalid date in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate","13/1/19" /* Invalid date - no 13'th month */);

		// Assert - test the DatePicker value state
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate",
			controlType: "sap.m.DatePicker",
			success: function (oDatePicker) {
				Opa5.assert.strictEqual(oDatePicker.getValueState(), ValueState.Error,
					"DatePicker value state should be error");
			}
		});

		// Act - press the go button
		When.iPressTheFilterGoButton();

		// Assert - Dialog with the correct error message is open
		Then.theErrorDialogIsOpen();

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Date multiple", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheShowAllFilterButton();

		// Act - Open the Date Multiple VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_MULTIPLE");

		// Act - Press the + button 2 times to add two rows
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			actions: [new Press(), new Press()],
			matchers: function (oControl) {
				return oControl.hasStyleClass("conditionAddBtnFloatRight");
			}
		});

		// Act - Select/Enter dates
		When.waitFor({
			controlType: "sap.m.DatePicker",
			searchOpenDialogs: true,
			success: function (aDatePickers) {
				// Act - Enter a dates in both DatePicker controls
				var oEnterText = new EnterText({
					text: "1/1/19"
				});
				oEnterText.executeOn(aDatePickers[0]);
				oEnterText.executeOn(aDatePickers[1]);

				// Act - Enter invalid date in the third DatePicker
				oEnterText.setText("13/13/19");
				oEnterText.executeOn(aDatePickers[2]);
				aDatePickers[2].$().blur();

				// Act - Change the date on the first DatePicker
				aDatePickers[0].toggleOpen();
				When.waitFor({
					controlType: "sap.ui.unified.Calendar",
					searchOpenDialogs: true,
					success: function (aCalendars) {
						var $NextDate = aCalendars[0].$().find(".sapUiCalItemSel").next(); // Should be the "1/2/19";

						// Month picker/Calendar specific - you have to trigger both events instead of a click
						$NextDate.trigger("mousedown");
						$NextDate.trigger("mouseup");
					}
				});

				oEnterText.destroy();
			}
		});

		// Assert
		When.waitFor({
			controlType: "sap.m.DatePicker",
			searchOpenDialogs: true,
			success: function (aDatePickers) {
				// Assert
				Opa5.assert.strictEqual(
					aDatePickers[2].getValueState(),
					ValueState.Warning,
					"Value state should be 'warning'."
				);
			}
		});

		// Act - remove the last row
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			matchers: function (oControl) {
				return oControl.hasStyleClass("conditionAddBtnFloatRight");
			},
			success: function (aControls) {
				// Find remove button on the same row - by default it should be the first control in it's layout parent
				var oRemoveButton = aControls[0].getParent().getContent()[0],
					oPress = new Press();

				// Act
				oPress.executeOn(oRemoveButton);

				// Cleanup
				oPress.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("DATE_MULTIPLE eq datetime'2019-01-02T00:00:00' or DATE_MULTIPLE eq datetime'2019-01-01T00:00:00'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Date interval", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheShowAllFilterButton();

		// Act - enter valid date in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL","1/1/19 - 1/31/19");

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("(DATE_INTERVAL ge datetime'2019-01-01T00:00:00' and DATE_INTERVAL le datetime'2019-01-31T00:00:00')");

		// Act - enter invalid date in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL","1/1/19 - 31/31/19");

		Then.waitFor({
			id: "smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error, "Value state should be error");
			}
		});
		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Time fields");

	opaTest("Single", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - Set time
		When.waitFor({
			id: "smartFilterBar-filterItemControlA_-_Parameter.P_Time",
			success: function (oInput) {
				oInput.setValue("12:34 PM");
			}
		});
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M00S')/Results");

		// Act - Open the VH
		When.waitFor({
			id: "smartFilterBar-filterItemControlA_-_Parameter.P_Time-icon",
			controlType: "sap.ui.core.Icon",
			actions: new Press()
		});

		// Act - click on the down arrow
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			matchers: function (oButton) {
				return oButton.hasStyleClass("sapMTimePickerItemArrowDown");
			},
			actions: new Press()
		});

		// Act - click on the ok button
		When.iPressTheVHDOKButton();

		// Act - filter
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT13H34M00S')/Results");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Multiple", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheShowAllFilterButton();
		When.iOpenTheVHD("smartFilterBar-filterItemControlTime.Group-TIME_MULTIPLE");

		// Act - Press the + button 1 time to add one row
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			actions: new Press(),
			matchers: function (oControl) {
				return oControl.hasStyleClass("conditionAddBtnFloatRight");
			}
		});

		// Act - Select/Enter times
		When.waitFor({
			controlType: "sap.m.TimePicker",
			searchOpenDialogs: true,
			success: function (aTimePickers) {
				var oText = new EnterText();

				// Populate both TimePicker fields: note using short 1 and 2 due to TimePicker specifics involving
				// MaskInput control
				oText.setText("1");
				oText.executeOn(aTimePickers[0]); // Should be 01:00 AM

				oText.setText("2");
				oText.executeOn(aTimePickers[1]); // Should be 02:00 AM

				// Cleanup
				oText.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("TIME_MULTIPLE eq time'PT01H00M00S' or TIME_MULTIPLE eq time'PT02H00M00S'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Interval", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheShowAllFilterButton();
		When.iOpenTheVHD("smartFilterBar-filterItemControlTime.Group-TIME_INTERVAL");

		// Act - Select/Enter times
		When.waitFor({
			controlType: "sap.m.TimePicker",
			searchOpenDialogs: true,
			success: function (aTimePickers) {
				var oText = new EnterText();

				// Populate both TimePicker fields: note using short 1 and 2 due to TimePicker specifics involving
				// MaskInput control
				oText.setText("1");
				oText.executeOn(aTimePickers[0]); // Should be 01:00 AM

				oText.setText("2");
				oText.executeOn(aTimePickers[1]); // Should be 02:00 AM

				// Cleanup
				oText.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("(TIME_INTERVAL ge time'PT01H00M00S' and TIME_INTERVAL le time'PT02H00M00S')");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Strings");

	opaTest("Single", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "2");

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_SINGLE eq '2'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("MaxLength with value list BCP: 1970275439", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_VL_MAXLENGTH", "4334" /* >3 characters */);
		When.iPressTheFilterGoButton();

		// Assert - Dialog with the correct error message is open
		Then.waitFor({
			controlType: "sap.m.Dialog",
			searchOpenDialogs: true,
			success: function(aDialogs) {
				var oDialog = aDialogs[0];

				Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Error Dialog should be open');
				// Opa5.assert.strictEqual(oDialog.getTitle(), oRB.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
				// 	"Error dialog title should match");
				Opa5.assert.strictEqual(
					oDialog.getContent()[0].getText(),
					oRB.getText("VALIDATION_ERROR_MESSAGE"),
					"Error message in dialog should match"
				);
			},
			errorMessage: "did not find the filters dialog",
			timeout: 15
		});

		// Act - press the dialog go button
		When.waitFor({
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_VL_MAXLENGTH", "1" /* <3 characters */);

		// Act - press the go button
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_VL_MAXLENGTH eq '1'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("String auto - token creation", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid strings directly in the input
		When.iPressTheShowAllFilterButton();
        When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "0002");
        When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", ">0002");

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRING_AUTO gt '0002' or STRING_AUTO eq '0002') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'");

		// Act - enter invalid string in the input and press the "go" button
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "Some invalid strings");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theErrorDialogIsOpen();

		// Cleanup
		Then.iTeardownMyAppFrame();
    });

    opaTest("String auto - test with a lot of tokens", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();

		// Act - Press button to open String Auto dialog
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");

		// Assert - Dialog with the correct title is open
		Then.waitFor({
			controlType: "sap.m.Dialog",
			searchOpenDialogs: true,
			success: function(aDialogs) {
                var oDialog = aDialogs[0];
				Opa5.assert.strictEqual(oDialog.getTitle(), "String Auto", 'Dialog title should be "String Auto"');
			},
			errorMessage: "did not find the filters dialog"
		});

		// Act - press the dialog go button to trigger search
		When.iPressSearchFieldIconButton();

		//Act - click on table
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table",
			controlType: "sap.ui.table.Table",
            searchOpenDialogs: true,
			success: function (oTable) {
				// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
				// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
				Opa5.getWindow().jQuery("#__xmlview0--smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table-selall").click();
			}
		});

		//Assert warning dialog is open
		Then.theWarningDialogIsOpen();

		// Act - press the dialog cancel button
		When.waitFor({
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_CANCEL") && oControl.sId.includes("__mbox-btn-");
			},
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Act - click on table
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table",
			controlType: "sap.ui.table.Table",
			searchOpenDialogs: true,
			success: function () {

				// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
				// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
				Opa5.getWindow().jQuery("#__xmlview0--smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table-selall").click();
			}
		});

		//Assert warning dialog is open
		Then.theWarningDialogIsOpen();

		 // Act - press the dialog ok button
		 When.waitFor({
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.sId.includes("__mbox-btn-");
			},
			actions: new Press(),
			searchOpenDialogs: true
		});

		//Assert 1500 tokens are displayed in the panel
		Then.waitFor({
            id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-tokenPanel",
			controlType: "sap.m.Panel",
			searchOpenDialogs: true,
			success: function (oPanel) {

                // Assert panel header should say that 1500 items are selected
				Opa5.assert.strictEqual(oPanel.getHeaderText(),oRB.getText("VALUEHELPDLG_SELECTEDITEMS", 1500), "Panel header should be correct");
			}
		});

		// Act - press the dialog ok button to trigger search
		When.waitFor({
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.getType() === sap.m.ButtonType.Emphasized;
			},
			timeout: 300,
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Act - press the go button
		When.iPressTheFilterGoButton();

		// Assert string is equal
		Then.theFiltersShouldMatch(function () {
            var aQuery = [];
            for (var number = 1; number <= 1500; number++) {
                aQuery.push("STRING_AUTO eq '" + ("0000" + number).slice(-4) + "'");
            }
            aQuery = aQuery.join(" or ");
            return "(" + aQuery + ") and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'";
		}());
		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("String auto - test counting", function (Given, When, Then) {
			// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();

		// Act - Press button to open String Auto dialog
        When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");

        //Count should stop counting the items
		Then.setCountableTypeToModule("None");

		// Assert - Dialog with the correct title is open
		Then.waitFor({
			controlType: "sap.m.Dialog",
			searchOpenDialogs: true,
			success: function(aDialogs) {
				var oDialog = aDialogs[0];
				Opa5.assert.strictEqual(oDialog.getTitle(), "String Auto", 'Dialog title should be "String Auto"');
			},
			errorMessage: "did not find the filters dialog"
		});

		// Act - press the dialog go button to trigger search
		When.iPressSearchFieldIconButton();

		//Assert counter didn't change
		Then.waitFor({
			controlType: "sap.m.Label",
			searchOpenDialogs: true,
			success: function (oAllLabels) {
                var oLabel = oAllLabels.filter(function(label) {
                    return label.oParent.sId === "__xmlview0--smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table";
                });

                // Assert panel header should say that 1500 items are selected
				Opa5.assert.strictEqual(oLabel[0].getText(),oRB.getText("VALUEHELPDLG_TABLETITLENOCOUNT"), "Counter in Table header should be deactivated and show only 'Items' text ");
			}
        });

        //Count should start counting the items
        Then.setCountableTypeToModule("Request");

        // Act - press the dialog go button to trigger search
		When.iPressSearchFieldIconButton();

        //Assert counter should  change
		Then.waitFor({
			controlType: "sap.m.Label",
			searchOpenDialogs: true,
			success: function (oAllLabels) {
                var oLabel = oAllLabels.filter(function(label) {
                        return label.oParent.sId === "__xmlview0--smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table";
                });

                // Assert panel header should say that 1500 items are selected
				Opa5.assert.strictEqual(oLabel[0].getText(),oRB.getText("VALUEHELPDLG_TABLETITLE1", 1500), "Counter in Table header should be active and show only 'Items (1500)' text ");
			}
		});

        // Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("In/Out parameters");

	opaTest("basic", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_IN1", "foo");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_IN1 eq 'foo'");

		// Act - Open the String InOut VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT");

		// Assert - in Parameter should be present in the VH Dialog
		Then.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.MultiInput",
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-filterItemControlA_-IN1",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "=foo",
					"'in Param from STRING_SINGLE' field should equal the expected value");
			}
		});

		// Act - press the dialog go button
		When.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnGo",
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Assert - check filter is applied to table and select all rows
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table",
			controlType: "sap.ui.table.Table",
			searchOpenDialogs: true,
			success: function (oTable) {
				// Assert
				Opa5.assert.strictEqual(oTable.getBindingInfo("rows").filters.length, 1, "Filter is applied to table");

				// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
				// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
				Opa5.getWindow().jQuery("#__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-selall").click();

				// Assert
				Opa5.assert.deepEqual(oTable.getSelectedIndices(), [0, 1], "We should have 2 indices selected");
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Assert - the correct tokens are created in the "String InOut" field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens();

				Opa5.assert.strictEqual(aTokens.length, 2, "There should be 2 tokens available in the control");
				Opa5.assert.strictEqual(aTokens[0].getKey(), "1", "Key of the first token should match");
				Opa5.assert.strictEqual(aTokens[0].getText(), "Key 1 (1)", "Text of the first token should match");
				Opa5.assert.strictEqual(aTokens[1].getKey(), "2", "Key of the second token should match");
				Opa5.assert.strictEqual(aTokens[1].getText(), "Key 2 (2)", "Text of the second token should match");
			}
		});

		// Assert - correct token is created in "String Out" field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT1",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens(),
					oToken = aTokens[0],
					oCustomData = oToken.getCustomData()[0];

				Opa5.assert.strictEqual(aTokens.length, 1, "There should be one token created");
				Opa5.assert.strictEqual(oToken.getText(), "=outValue1", "Token with correct text is created");
				Opa5.assert.strictEqual(oCustomData.getKey(), "range", "Key of the custom data should be `range`");
				Opa5.assert.propEqual(
					oCustomData.getValue(),
					{
						exclude: false,
						keyField: "STRING_OUT1",
						operation: "EQ",
						tokenText: null,
						value1: "outValue1",
						value2: null
					},
					"Custom data should be as expected"
				);
			}
		});

		// Assert - Date out field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT2",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens(),
					oToken = aTokens[0],
					oCustomData = oToken.getCustomData()[0],
					oExcpectedDate = new Date(2014, 11, 5);

				Opa5.assert.strictEqual(aTokens.length, 1, "There should be one token created");
				Opa5.assert.strictEqual(oToken.getText(), "=12/5/14", "Token with correct text is created");
				Opa5.assert.strictEqual(oCustomData.getKey(), "range", "Key of the custom data should be `range`");
				Opa5.assert.propEqual(
					oCustomData.getValue(),
					{
						exclude: false,
						keyField: "STRING_OUT2",
						operation: "EQ",
						tokenText: null,
						value1: {},
						value2: null
					},
					"Custom data should be as expected"
				);
				Opa5.assert.strictEqual(
					oCustomData.getValue().value1.toString(),
					oExcpectedDate.toString(), // "Fri Dec 05 2014 00:00:00 GMT+0200 (Eastern European Standard Time)",
					"Date should match"
				);
			}
		});

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("STRING_IN1 eq 'foo' and (STRING_INOUT eq '1' or STRING_INOUT eq '2') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("multiple", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();


		// Act - clear the "String In" field
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_IN1","");

		// Act - Open the String InOut VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT");

		// Act - press the dialog go button
		When.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnGo",
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Act - select all rows
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table",
			controlType: "sap.ui.table.Table",
			searchOpenDialogs: true,
			success: function (oTable) {
				// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
				// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
				Opa5.getWindow().jQuery("#__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-selall").click();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Assert - Correct tokens are present in "String Out" field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT1",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens();

				Opa5.assert.strictEqual(aTokens.length, 3, "There should be three tokens created");
				Opa5.assert.strictEqual(aTokens[0].getText(), "=outValue3", "Token with correct text is created");
				Opa5.assert.strictEqual(aTokens[1].getText(), "=outValue2", "Token with correct text is created");
				Opa5.assert.strictEqual(aTokens[2].getText(), "=outValue1", "Token with correct text is created");
				Opa5.assert.ok(aTokens.every(function (oToken) {
					return oToken.getCustomData().length === 1;
				}), "All tokens have custom data assigned to them");
			}
		});

		// Assert - Date out field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT2",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens();

				Opa5.assert.strictEqual(aTokens.length, 2, "There should be two tokens created");
				Opa5.assert.strictEqual(aTokens[0].getText(), "=12/16/14", "Token with correct text is created");
				Opa5.assert.strictEqual(aTokens[1].getText(), "=12/5/14", "Token with correct text is created");
				Opa5.assert.ok(aTokens.every(function (oToken) {
					return oToken.getCustomData().length === 1;
				}), "All tokens have custom data assigned to them");
			}
		});

		// Act - open the "Date Out" field VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_OUT2");

		// Assert  - there should be 2 defined conditions
		Then.waitFor({
			controlType: "sap.m.P13nConditionPanel",
			searchOpenDialogs: true,
			success: function (aPanels) {
				var oIncludes = aPanels[0],
					aConditions = oIncludes.getConditions(),
					oExcpectedDate1 = new Date(2014, 11, 16, 13, 48, 20),
					oExcpectedDate2 = new Date(2014, 11, 5);

				Opa5.assert.strictEqual(aConditions.length, 2, "There should be 2 conditions");
				Opa5.assert.propEqual(
					aConditions[0],
					{
						exclude: false,
						key: "range_0",
						keyField: "STRING_OUT2",
						operation: "EQ",
						showIfGrouped: undefined,
						text: "=" + oExcpectedDate1.toString(), // Tue Dec 16 2014 13:48:20 GMT+0200 (Eastern European Standard Time)
						value1: {},
						value2: null
					},
					"Correct object is assigned"
				);
				Opa5.assert.propEqual(
					aConditions[1],
					{
						exclude: false,
						key: "range_1",
						keyField: "STRING_OUT2",
						operation: "EQ",
						showIfGrouped: undefined,
						text: "=" + oExcpectedDate2.toString(), // Fri Dec 05 2014 00:00:00 GMT+0200 (Eastern European Standard Time)
						value1: {},
						value2: null
					},
					"Correct object is assigned"
				);
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("(STRING_INOUT eq '1' or STRING_INOUT eq '2' or STRING_INOUT eq '3' or STRING_INOUT eq '4') and (STRING_OUT1 eq 'outValue3' or STRING_OUT1 eq 'outValue2' or STRING_OUT1 eq 'outValue1') and (STRING_OUT2 eq datetime'2014-12-16T00:00:00' or STRING_OUT2 eq datetime'2014-12-05T00:00:00')");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Validation");

	opaTest("Single input field with associated value list", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "not existing key");
		When.iPressTheFilterGoButton();

		// Assert - Dialog with the correct error message is open
		Then.theErrorDialogIsOpen();

		// Act - close the error dialog
		When.waitFor({
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Assert
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_SINGLE",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error, "Value state should be error");
			}
		});

		// Act - enter a valid string which exist as a key in the associated value list
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "1");
		When.iPressTheFilterGoButton();

		// Assert
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_SINGLE",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValueState(), ValueState.None, "Value state should be none");
			}
		});
		Then.theFiltersShouldMatch("STRING_SINGLE eq '1'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Empty for strings");

	opaTest("Empty operation for STRING_AUTO - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheShowAllFilterButton();
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "<empty>");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRING_AUTO eq '' or STRING_AUTO eq null)");

		// Act
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "!(<empty>)", "Field not found", true);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRING_AUTO eq '' or STRING_AUTO eq null) and (STRING_AUTO ne '' and STRING_AUTO ne null)");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Empty operation for STRING_AUTO with nullable=false - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp(true);

		// Act
		When.iPressTheShowAllFilterButton();
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "<empty>");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_AUTO eq ''");

		// Act
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "!(<empty>)", "Field not found", true);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_AUTO eq '' and STRING_AUTO ne ''");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Empty for dates");

	opaTest("Empty operation for STRINGDATE_AUTO - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp();

		// Act
		When.iPressTheShowAllFilterButton();
		When.iOpenTheVHD("smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_AUTO");

		When.iSelectOperation("Empty");
		When.iExpandTheExcludeOperationsPanel();
		When.iSelectOperation("Empty", true);

		When.iPressTheVHDOKButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRINGDATE_AUTO eq '' or STRINGDATE_AUTO eq null) and (STRINGDATE_AUTO ne '' and STRINGDATE_AUTO ne null)");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Empty operation for STRINGDATE_AUTO auto nullable=false - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp(true);

		// Act
		When.iPressTheShowAllFilterButton();
		When.iOpenTheVHD("smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_AUTO");

		When.iSelectOperation("Empty");
		When.iExpandTheExcludeOperationsPanel();
		When.iSelectOperation("Empty", true);

		When.iPressTheVHDOKButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRINGDATE_AUTO eq '' and STRINGDATE_AUTO ne ''");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	[
		{
			name: "DATE_AUTO",
			controlId: "smartFilterBar-filterItemControlDate.Group-DATE_AUTO",
			expected: "DATE_AUTO eq null and DATE_AUTO ne null"
		},
		{
			name: "DTOFFSET_AUTO",
			controlId: "smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO",
			expected: "DTOFFSET_AUTO eq null and DTOFFSET_AUTO ne null"
		},
		{
			name: "DATETIME_AUTO",
			controlId: "smartFilterBar-filterItemControlA_-DATETIME_AUTO",
			expected: "DATETIME_AUTO eq null and DATETIME_AUTO ne null"
		}
	].forEach(function (oField) {
		opaTest("Empty operation for " + oField.name + " - include and exclude", function (Given, When, Then) {
			// Arrange
			Given.iStartMyApp();

			// Act
			When.iPressTheShowAllFilterButton();

			When.iOpenTheVHD(oField.controlId);

			When.iSelectOperation("Empty");
			When.iExpandTheExcludeOperationsPanel();
			When.iSelectOperation("Empty", true);

			When.iPressTheVHDOKButton();
			When.iPressTheFilterGoButton();

			// Assert
			Then.theFiltersShouldMatch(oField.expected);

			// Cleanup
			Then.iTeardownMyAppFrame();
		});
	});

	opaTest("No empty operation for DATE_AUTO, DATETIME_AUTO and DTOFFSET_AUTO - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp(true);

		// Act
		When.iPressTheShowAllFilterButton();

		// Act - DATE_AUTO
		When.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_AUTO");
		When.iExpandTheExcludeOperationsPanel();

		// Assert
		Then.thereIsNoEmptyOperation("DATE_AUTO");
		Then.thereIsNoEmptyOperation("DATE_AUTO", true);

		// Arrange
		When.iPressTheVHDOKButton();

		// Act - DATETIME_AUTO
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-DATETIME_AUTO");
		When.iExpandTheExcludeOperationsPanel();

		// Assert
		Then.thereIsNoEmptyOperation("DATETIME_AUTO");
		Then.thereIsNoEmptyOperation("DATETIME_AUTO", true);

		// Arrange
		When.iPressTheVHDOKButton();

		// Act - DTOFFSET_AUTO
		When.iOpenTheVHD("smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO");
		When.iExpandTheExcludeOperationsPanel();

		// Assert
		Then.thereIsNoEmptyOperation("DTOFFSET_AUTO");
		Then.thereIsNoEmptyOperation("DTOFFSET_AUTO", true);

		// Arrange
		When.iPressTheVHDOKButton();

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Exclude operations");

	opaTest("String operations", function (Given, When, Then) {
		// Arrangements
		var aConditions = [
				{operation: "contains", input1: "A"},
				{operation: "equal to", input1: "B"},
				{operation: "between", input1: "C", input2: "D"},
				{operation: "starts with", input1: "E"},
				{operation: "ends with", input1: "F"},
				{operation: "less than", input1: "G"},
				{operation: "less than or equal to", input1: "H"},
				{operation: "greater than", input1: "I"},
				{operation: "greater than or equal to", input1: "J"}
			],
			iCondition = 0;

		// Arrange
		Given.iStartMyApp(true);

		// Act
		When.iPressTheShowAllFilterButton();
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");
		When.iNavigateToTheDefineConditionsTab();
		When.iExpandTheExcludeOperationsPanel();

		aConditions.forEach(function (oCondition) {
			When.iChangeTheCondition(oCondition.operation, true, iCondition)
				.and.iEnterTextInConditionField(
				true,
				iCondition,
				oCondition.input1,
				(oCondition.input2 ? oCondition.input2 : undefined)
			);

			When.iPressTheFilterAddButton(true);
			iCondition++;
		});

		When.iPressTheVHDOKButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("not substringof('A',STRING_AUTO) and STRING_AUTO ne 'B' and not (STRING_AUTO ge 'C' and STRING_AUTO le 'D') and not startswith(STRING_AUTO,'E') and not endswith(STRING_AUTO,'F') and STRING_AUTO ge 'G' and STRING_AUTO gt 'H' and STRING_AUTO le 'I' and STRING_AUTO lt 'J'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("String operations from tokens", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp(true);

		// Act
		When.iPressTheShowAllFilterButton();
		["!*AAA*", "!=BBB", "!CCC...DDD", "!EEE*", "!*FFF", "!<GGG", "!<=HHH", "!>III", "!>=JJJ"].forEach(function (sToken) {
			When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", sToken);
		});

		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("not substringof('AAA',STRING_AUTO) and STRING_AUTO ne 'BBB' and not (STRING_AUTO ge 'CCC' and STRING_AUTO le 'DDD') and not startswith(STRING_AUTO,'EEE') and not endswith(STRING_AUTO,'FFF') and STRING_AUTO ge 'GGG' and STRING_AUTO gt 'HHH' and STRING_AUTO le 'III' and STRING_AUTO lt 'JJJ'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("String operations from tokens - alternative input - copy & paste scenario", function (Given, When, Then) {
		// Arrange
		Given.iStartMyApp(true);

		// Act
		When.iPressTheShowAllFilterButton();
		["!(*AAA*)", "!(=BBB)", "!(CCC...DDD)", "!(EEE*)", "!(*FFF)", "!(<GGG)", "!(<=HHH)", "!(>III)", "!(>=JJJ)"].forEach(function (sToken) {
			When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", sToken);
		});

		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("not substringof('AAA',STRING_AUTO) and STRING_AUTO ne 'BBB' and not (STRING_AUTO ge 'CCC' and STRING_AUTO le 'DDD') and not startswith(STRING_AUTO,'EEE') and not endswith(STRING_AUTO,'FFF') and STRING_AUTO ge 'GGG' and STRING_AUTO gt 'HHH' and STRING_AUTO le 'III' and STRING_AUTO lt 'JJJ'");

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.module("Value help dialog");

	opaTest("When I use the ValueHelp dialog should take over a value into the basic search", function (Given, When, Then) {
		// Arrange
		var sControlName = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_SINGLE";
		Given.iStartMyApp();

		// Act - enter a valid date directly in the input
		When.iPressTheShowAllFilterButton();
		When.iEnterStringInFiled(sControlName, "1","",true);
		When.iPressValueHelpIcon(sControlName + "-vhi");

		// Assert
		Then.iShouldSeeValueHelpDialog(sControlName + "-valueHelpDialog", 1, 1);

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
