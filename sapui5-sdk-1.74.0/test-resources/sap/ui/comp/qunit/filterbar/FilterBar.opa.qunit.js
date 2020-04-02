/* global QUnit */

sap.ui.require([
		"sap/ui/Device",
		"sap/ui/test/Opa5",
		"sap/ui/test/opaQunit",
		"sap/ui/test/actions/Press"
	], function (Device, Opa5, opaTest, Press) {
	"use strict";


	QUnit.config.testTimeout  = 90000;

	Opa5.extendConfig({
		viewNamespace: "view.",
		arrangements: new Opa5({
			iStartTheFormSample: function() {
				return this.iStartMyAppInAFrame("../../filterbar/filterBarTest.html");
			}
		}),
		actions: new Opa5({
			iWait: function(iMs){
				var bReady = false;
				return this.waitFor({
					check: function() {
						setTimeout(function(){
							bReady = true;
						}, iMs);
						return bReady;
					},
					success: function() {
						Opa5.assert.ok(true, 'waited');
					},
					errorMessage: 'waited'
				});
			},
			iPressTheFiltersButton: function() {

				return this.waitFor({
					id : "theFilterBar-btnFilters",
					controlType: "sap.m.Button",
					success: function(oFiltersButton) {
						oFiltersButton.$().trigger("tap");
					},
					errorMessage: "did not find the button 'Filters'"
				});
			},
			iPressTheMoreLink: function() {
				return this.waitFor({
					controlType: "sap.m.Link",
					success: function(aLink) {
						var sEventName = Device.support.touch ? "tap" : "click";
						aLink[0].$().trigger(sEventName);
					},
					errorMessage: "did not find the change filters link"
				});
			},

			iPressTheMoreLinkOnSpecificGroup: function (sId) {
				return this.waitFor({
					id: sId,
					actions: new Press(),
					errorMessage: "Did not find the change filters link"
				});
			},

			iPressCancelOnSelectFiltersDialog: function() {
				return this.iPressButtonOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("SELECT_FILTER_FIELDS");
				}, "FILTER_BAR_CANCEL", "Cancel-button on 'Select Filters' dialog not found");
			},

			iPressCancelOnFiltersDialog: function() {
				return this.iPressButtonOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FILTER_BAR_ADV_FILTERS_DIALOG");
				}, "FILTER_BAR_CANCEL", "Cancel-button on 'Select Filters' dialog not found");
			},

			iPressButtonOnDialog: function(fnMatcher, sButtonTextKey, sErrorMsg) {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Dialog",
					matchers: fnMatcher,
					success: function(aDialogs) {
						var oCancelButton = this.retrieveButton(aDialogs[0].getButtons(), getTextFromCompResourceBundle(sButtonTextKey));
						if (oCancelButton) {
							oCancelButton.$().trigger("tap");
						}
					},
					errorMessage: sErrorMsg
				});
			},

			iPressToSelectAllFilter: function () {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.List",
					matchers: function (oList) {
						if (oList.mProperties.mode === "MultiSelect" && oList.oParent.sId === "theFilterBar-set-filters-dialog" && oList.mAggregations.items.length === 4) {
							return oList;
						}
					},
					success: function (oList) {
						oList[0].selectAll(true);
					},
					errorMessage: "Did not find the List"
				});
			},

			iPressOkButtonOnSelectFiltersDialog: function () {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Button",
					matchers: function(oButton){
						return oButton.getText() === getTextFromCompResourceBundle("FILTER_BAR_OK");
					},
					actions: new Press(),
					errorMessage: "Not able to find Okay button in Select Filters dialog"
				});
			},

            retrieveButton: function (aButtons, sButtonText) {
				for (var i = 0; i < aButtons.length; i++) {
					if (aButtons[i].getText() === sButtonText) {
						return aButtons[i];
					}
				}
				return null;
			}

		}),
		assertions: new Opa5({
			theFiltersDialogShouldBeOpen: function() {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					success: function(aDialogs) {
						Opa5.assert.ok(aDialogs[0], 'Filters Dialog should be open');
						Opa5.assert.equal(aDialogs[0].getTitle(), getTextFromCompResourceBundle("FILTER_BAR_ADV_FILTERS_DIALOG"), "Filters Dialog title should match");
					},
					errorMessage: "did not find the filters dialog",
					timeout: 15
				});
			},
			theSelectFiltersDialogShouldBeOpen: function() {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					success: function(aDialogs) {
						Opa5.assert.ok(aDialogs[1], 'Select Filters Dialog should be open');
						Opa5.assert.equal(aDialogs[1].getTitle(), getTextFromCompResourceBundle("SELECT_FILTER_FIELDS"), "Selected Filters Dialog should have correct title");
					},
					errorMessage: "did not find the 'Select Filters' dialog",
					timeout: 15
				});
			},
			checkFilterBarExistence: function() {
				return this.waitFor({
					id: "theFilterBar",
					success: function(oFilterBar) {
						Opa5.assert.ok(oFilterBar, 'FilterBar should be visible');
					},
					errorMessage: "did not find the 'Select Filters' dialog",
					timeout: 15
				});
			},
			checkHideFilterBarButtonState: function() {
				return this.waitFor({
					controlType: "sap.m.Button",
					success: function(aButtons) {
						var oHideShowFilterBar = null;
						var sTextShow = getTextFromCompResourceBundle("FILTER_BAR_SHOW");
						var sTextHide = getTextFromCompResourceBundle("FILTER_BAR_HIDE");
						for (var i = 0; i < aButtons.length; i++) {
							if ((aButtons[i].getText() === sTextShow) || (aButtons[i].getText() === sTextHide)) {
								oHideShowFilterBar = aButtons[i];
								break;
							}
						}
						if (Device.system.phone) {
							Opa5.assert.ok(!oHideShowFilterBar, 'oHideShowFilterBar should not be displayed');
						} else if (Device.system.tablet && !Device.system.desktop) {
							Opa5.assert.ok(oHideShowFilterBar, 'oShowHideFilterBar should be displayed');
							Opa5.assert.equal(oHideShowFilterBar.getText(), sTextShow);
						} else {
							Opa5.assert.ok(oHideShowFilterBar, 'oHideShowFilterBar should be displayed');
							Opa5.assert.equal(oHideShowFilterBar.getText(), sTextHide);
						}
					},
					errorMessage: "did not find the button 'hide show filters'",
					timeout: 15
				});
			},

			theFiltersDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FILTER_BAR_ADV_FILTERS_DIALOG");
				}, 'Dialog is closed', 'Dialog should be closed');
			},
			theSelectDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("SELECT_FILTER_FIELDS");
				}, 'Dialog is closed', 'Dialog should be closed');
			},
			dialogShouldBeClosed: function(fnDialogCheck, sSuccessMsg, sErrorMsg) {
				return this.waitFor({
					check: function() {
						var frameJQuery = Opa5.getWindow().jQuery;
						var fnDialog = frameJQuery.sap.getObject('sap.m.Dialog');
						var dialogs = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
						return !dialogs.some(fnDialogCheck);
					},
					timeout: 2,
					success: function() {
						Opa5.assert.ok(true, sSuccessMsg);
					},
					errorMessage: sErrorMsg
				});
			},
			selectedFiltersFromSpecificGroupShoulBeAvaliableInFiltersDialog: function(filtersLabelGroupId, filtersLabelCount){
				return this.waitFor({
					controlType: "sap.m.Label",
					success: function(oLabel) {
						var avaliableLabels = oLabel.filter(function(label){
							return label.sId.includes(filtersLabelGroupId);
						});
							Opa5.assert.ok(avaliableLabels.length === filtersLabelCount, "Selected filters count is as expected: " + filtersLabelCount);
					},
					errorMessage: "Not able to find Grid",
					timeout: 15
				});
			}
		})
	});

	function getTextFromCompResourceBundle(sTextKey) {
		return getTextFromResourceBundle('sap.ui.comp', sTextKey);
	}

	function getTextFromResourceBundle(sLib, sTextKey) {
		var oCore = Opa5.getWindow().sap.ui.getCore();
		return oCore.getLibraryResourceBundle(sLib).getText(sTextKey);
	}

	opaTest("Initial Display", function(Given, When, Then) {
		Given.iStartTheFormSample();

		When.iWait(0);
		Then.checkFilterBarExistence();
		if (!Device.system.phone) {
			Then.checkHideFilterBarButtonState();
		}

	});

	opaTest("Open the Dialogs", function(Given, When, Then) {

		When.iPressTheFiltersButton();
		Then.theFiltersDialogShouldBeOpen();

		When.iPressTheMoreLink();
		Then.theSelectFiltersDialogShouldBeOpen();
	});

	opaTest("Closing the Select Filters Dialog", function(Given, When, Then) {

		When.iPressCancelOnSelectFiltersDialog();
		Then.theSelectDialogShouldBeClosed();
	});

	opaTest("Closing the Filters Dialog", function(Given, When, Then) {

		When.iPressCancelOnFiltersDialog();
		Then.theFiltersDialogShouldBeClosed();

	});

	opaTest("Open Filters and select with ctrl+A all filters in Group7 BCP:", function (Given, When, Then) {
		When.iPressTheFiltersButton();
		Then.theFiltersDialogShouldBeOpen();

		When.iPressTheMoreLinkOnSpecificGroup("theFilterBar-link-G7");
		Then.theSelectFiltersDialogShouldBeOpen();

		When.iPressToSelectAllFilter();
		When.iPressOkButtonOnSelectFiltersDialog();
		Then.theSelectDialogShouldBeClosed();
		Then.selectedFiltersFromSpecificGroupShoulBeAvaliableInFiltersDialog("theFilterBar-filterItem-G7-", 4);

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

});