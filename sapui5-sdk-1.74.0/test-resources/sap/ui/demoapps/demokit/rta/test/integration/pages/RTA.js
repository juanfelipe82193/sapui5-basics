/* global QUnit assert */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/fiori-elements/test/integration/pages/Common",
	"sap/ui/test/actions/Press",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/fl/FakeLrepConnectorSessionStorage",
	"sap/ui/events/KeyCodes"
], function(
	Opa5,
	Common,
	Press,
	QUnitUtils,
	FakeLrepConnectorSessionStorage,
	KeyCodes
) {
	"use strict";

	Opa5.createPageObjects({
		onTheMasterPageWithRTA: {
			baseClass: Common,
			actions: {
				iUseTheStorageFromIFrame: function(sId, sViewName, bReset) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						success: function() {
							// reset both Storages because of synchronization bug in IE11/Edge
							if (bReset) {
								FakeLrepConnectorSessionStorage.forTesting.synchronous.clearAll();
							}
							FakeLrepConnectorSessionStorage.forTesting.setStorage(Opa5.getWindow().sessionStorage);
							if (bReset) {
								FakeLrepConnectorSessionStorage.forTesting.synchronous.clearAll();
							}
						}
					})
				},
				iGoToMeArea: function() {
					return this.waitFor({
						id: "meAreaHeaderButton",
						errorMessage: "Did not find the Me-Area",
						actions: new Press()
					});
				},
				iPressOnAdaptUi: function(bPersonalize) {
					var sButtonType = bPersonalize ? "PERSONALIZE" : "RTA";
					var sId = sButtonType + "_Plugin_ActionButton";
					return this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: function(oListItem) {
							return oListItem.data().actionItemId === sId;
						},
						errorMessage: "Did not find the Adapt-Ui-Button",
						actions: new Press()
					});
				},
				iWaitUntilTheBusyIndicatorIsGone: function(sId, sViewName) {
					return this.waitFor({
						autoWait: false,
						id: sId,
						viewName: sViewName,
						matchers: function(oRootView) {
							// we set the view busy, so we need to query the parent of the app
							return oRootView.getBusy() === false;
						},
						success: function() {
							assert.ok(true, "the App is not busy anymore");
						},
						errorMessage: "The app is still busy.."
					});
				},
				iWaitUntilTheCompactContextMenuAppears: function(sContextMenuButtonIcon, sContextMenuButtonTooltip) {
					return this.waitFor({
						autoWait: false,
						controlType: "sap.m.Button",
						matchers: function(oButton) {
							// we set the view busy, so we need to query the parent of the app
							return (oButton.getTooltip() === sContextMenuButtonTooltip &&
									oButton.getIcon() === sContextMenuButtonIcon &&
									oButton.isActive() === true);
						},
						success: function() {
							assert.ok(true, "the compact contextMenu is open now");
						},
						errorMessage: "The compact contextMenu is still closed"
					});
				},
				iRightClickOnAnElementOverlay: function(sId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						success: function(aOverlays) {
							aOverlays[0].$().trigger('contextmenu');
						},
						errorMessage: "Did not find the Element Overlay for the Object Page Section"
					});
				},
				iClickOnAnElementOverlay: function(sId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						errorMessage: "Did not find the Element Overlay",
						actions: new Press()
					});
				},
				iRightClickOnAnAggregationOverlay: function(sId, sAggregationName) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						success: function(oOverlay) {
							var oAggregationOverlay = oOverlay[0].getAggregationOverlay(sAggregationName);
							oAggregationOverlay.$().trigger('contextmenu');
						},
						errorMessage: "Did not find the Element Overlay"
					});
				},
				iClickOnAContextMenuEntry: function(iIndex) {
					return this.waitFor({
						controlType: "sap.m.Popover",
						matchers: function(oMenu) {
							return oMenu.$().hasClass("sapUiDtContextMenu");
						},
						success: function(aPopover) {
							aPopover[0].getContent()[0].getItems()[iIndex].firePress();
						},
						errorMessage: "Did not find the Context Menu"
					});
				},
				iEnterANewName: function(sNewLabel) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							if (oOverlay.$().hasClass("sapUiDtOverlaySelected")){
								var $Overlay = oOverlay.$().find(".sapUiRtaEditableField");
								var oEditableFieldDomNode = $Overlay.children()[0];
								return oEditableFieldDomNode;
							}
						},
						actions : function(oEditableFieldDomNode){
							oEditableFieldDomNode.innerHTML = sNewLabel;
							QUnitUtils.triggerEvent("keypress", oEditableFieldDomNode, {which: KeyCodes.ENTER, keyCode: KeyCodes.ENTER});
							oEditableFieldDomNode.blur();
						},
						errorMessage: "Did not find the Selected Element Overlay"
					});
				},
				iSelectAFieldByBindingPathInTheAddDialog: function(sBindingPath) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CustomListItem",
						matchers: function(oListItem) {
							var sBindingContextPath = oListItem.getBindingContextPath();
							var oBindingData = oListItem.getBindingContext().getModel().getProperty(sBindingContextPath);
							return oBindingData.bindingPath ? oBindingData.bindingPath === sBindingPath : oBindingData.bindingPaths[0] === sBindingPath;
						},
						actions: new Press(),
						errorMessage: "List Item with this label not found"
					});
				},
				iSelectAFieldByLabelInTheAddSectionDialog: function(sLabel) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CustomListItem",
						matchers: function(oListItem) {
							return oListItem.getContent()[0].getItems()[0].getText() === sLabel;
						},
						actions: new Press(),
						errorMessage: "List Item with this label not found"
					});
				},
				iPressOK: function() {
					var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: oResources.getText("BTN_FREP_OK")
						}),
						actions: new Press(),
						errorMessage: "OK Button not found"
					});
				},
				iPressReload: function() {
					var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: oResources.getText("BUTTON_RELOAD_NEEDED")
						}),
						actions: new Press(),
						errorMessage: "'Reload' Button not found"
					});
				},
				iExitRtaMode: function() {
					var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: function(oButton) {
							return oButton.$().closest(".sapUiRtaToolbar").length > 0 && oButton.getProperty("text") === oResources.getText("BTN_EXIT");
						},
						actions: new Press()
					});
				},
				iScrollDown: function(sId) {
					return this.waitFor({
						timeout: 50,
						controlType: "sap.uxap.ObjectPageLayout",
						success: function(oLayout) {
							oLayout[0].scrollToSection(sId);
						}
					});
				},
				iPressOnRemoveSection: function(sSectionId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sSectionId;
						},
						success: function(aOverlays){
							var oOverlay = aOverlays[0];
							var sOverlayId = oOverlay.getId();
							oOverlay.$().find("#" + sOverlayId + "-DeleteIcon").trigger("click");
						},
						errorMessage: "Did not find the Remove Button on the section"
					});
				},
				iPressOnAddSection: function(sSectionId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sSectionId;
						},
						success: function(aOverlays){
							var oOverlay = aOverlays[0];
							var sOverlayId = oOverlay.getId();
							oOverlay.$().find("#" + sOverlayId + "-AddButton").trigger("click");
						},
						errorMessage: "Did not find the Add Button on the section"
					});
				},
				iExitRtaPersonalizationMode: function() {
					var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: function(oButton) {
							return oButton.getParent().$ && oButton.getParent().$().hasClass("sapUiRtaToolbar")
								&& oButton.getParent().$().hasClass("type_personalization")
								&& oButton.getProperty("text") === oResources.getText("BTN_DONE");
						},
						actions: new Press()
					});
				},
			},

			assertions: {
				iShouldSeeTheToolbar: function() {
					return this.waitFor({
						autoWait: false,
						controlType: "sap.m.HBox",
						matchers: function(oToolbar) {
							return oToolbar.$().hasClass("sapUiRtaToolbar");
						},
						success: function(oToolbar) {
							assert.ok(oToolbar[0].getVisible(), "The Toolbar is shown.");
						},
						errorMessage: "Did not find the Toolbar"
					});
				},
				iShouldSeeTheFLPToolbarAndChangesInLRep: function(iCount, sReference) {
					return this.waitFor({
						id: "shell-header",
						success: function(oToolbar) {
							assert.ok(oToolbar.getVisible(), "the FLP Toolbar is shown");
							assert.equal(FakeLrepConnectorSessionStorage.forTesting.synchronous.getNumberOfChanges(sReference), iCount, "the number of changes is correct")
						},
						errorMessage: "the FLP-Toolbar was not found"
					});
				},
				iShouldSeeTheOverlayForTheApp: function(sId, sViewName) {
					var oApp;
					this.waitFor({
						id: sId,
						viewName: sViewName,
						errorMessage: "The app is still busy..",
						success: function(oAppControl) {
							oApp = oAppControl;
						}
					});

					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance() === oApp;
						},
						success: function(oOverlay) {
							assert.ok(oOverlay[0].getVisible(), "The Overlay is shown.");
						},
						errorMessage: "Did not find the Element Overlay for the App Control"
					});
				},
				iShouldSeeTheGroupElementByLabel: function(sLabel) {
					return this.waitFor({
						controlType: "sap.m.Label",
						matchers: function(oLabel) {
							return oLabel.getText() === sLabel;
						},
						success: function(oLabel) {
							assert.ok(oLabel[0].getVisible(), "The Label is shown on the UI");
						},
						errorMessage: "Did not find a Label with this text"
					});
				},
				iShouldSeeTheGroupByTitle: function(sTitle) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElement().getTitle &&
							oOverlay.getElement().getTitle() === sTitle;
						},
						success: function(aOverlays) {
							assert.ok(aOverlays[0].getElement().getVisible(), "The Group is shown on the UI");
						},
						errorMessage: "Did not find a Group with this title"
					});
				},
				theGroupElementHasTheCorrectIndex: function(sId, sId2, bBefore) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						success: function(aOverlays) {
							var oOverlay = aOverlays[0];
							var aGroupElements = oOverlay.getParentElementOverlay().getElementInstance().getGroupElements();
							var iIndex = aGroupElements.indexOf(oOverlay.getElementInstance());
							var iInsertedIndex = bBefore ? iIndex - 1 : iIndex + 1;
							assert.equal(aGroupElements[iInsertedIndex].getId(), sId2, "the Group Element has the correct Index");
						},
						errorMessage: "Did not find the Element Overlay"
					});
				},
				theGroupElementHasTheFirstIndex: function(sId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						success: function(aOverlays) {
							var oOverlay = aOverlays[0];
							var aGroupElements = oOverlay.getParentElementOverlay().getElementInstance().getGroupElements();
							assert.equal(aGroupElements[0].getId(), sId, "the Group Element has the correct Index");
						},
						errorMessage: "Did not find the Element Overlay"
					});
				},
				iShouldSeeGroupsInSmartForm: function(sId, iCount) {
					return this.waitFor({
						id: sId,
						success: function(oSmartForm) {
							assert.equal(oSmartForm.getGroups().length, iCount, "the number of groups in the smartform is correct");
						},
						errorMessage: "Did not find the SmartForm"
					});
				},
				iShouldSeeChangesInLRepWhenTheBusyIndicatorIsGone: function(sId, sViewName, iCount, sReference) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						success: function() {
							assert.equal(FakeLrepConnectorSessionStorage.forTesting.synchronous.getNumberOfChanges(sReference), iCount, "the number of changes is correct")
						},
						errorMessage: "The app is still busy.."
					});
				},
				theChangesToTheGroupShouldStillBeThere: function(sGroupId, sElementId1, sElementId2, iCount) {
					return this.waitFor({
						id: sGroupId,
						visible: false,
						success: function(oGroup) {
							var aFormElements = oGroup.getFormElements();
							var aFormElementIds = aFormElements.map(function(oElement) {
								return oElement.getId();
							});
							assert.equal(aFormElements[0].getId(), sElementId1, "then the last Element is correct");
							assert.ok(aFormElementIds.indexOf(sElementId2) > -1, "then the added field is still there");
							assert.equal(aFormElements.length, iCount, "then one field got added to the group");
						},
						errorMessage: "The Group was not found"
					});
				},
				iShouldNotSeeTheElement: function(sId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						visible: false,
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						success: function(aOverlays) {
							assert.notOk(aOverlays[0].getElementInstance().getVisible(), "The section is not shown on the UI");
						},
						errorMessage: "Did not find the element or it is still visible"
					});
				},
				iShouldSeeTheElement: function(sId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						visible: false,
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						success: function(aOverlays) {
							assert.ok(aOverlays[0].getElementInstance().getVisible(), "The section is again visible on the UI");
						},
						errorMessage: "Did not find the element or it is still invisible"
					});
				},
				theSectionShouldBeInTheFirstPosition: function(sId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElementInstance().getId() === sId;
						},
						success: function(aOverlays) {
							var oOverlay = aOverlays[0];
							var aSections = oOverlay.getParentElementOverlay().getElementInstance().getSections().filter(function(oSection) {return oSection.getVisible();});
							assert.equal(aSections[0].getId(), sId, "the Section has the correct Index");
						},
						errorMessage: "Did not find the Section or it is in the wrong position"
					});
				},
				iShouldSeeThePopUp: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: function(oButton) {
							return oButton.getId().indexOf("__mbox") > -1;
						},
						success: function(aButtons) {
							assert.ok(aButtons[0].getVisible(), "The Dialog is shown.");
						},
						errorMessage: "Did not find the Dialog"
					});
				},
				iShouldSeeTheSection: function(sId) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageSection",
						matchers: function(oSection) {
							return oSection.getId() === sId;
						},
						success: function(aSections) {
							assert.ok(aSections[0].getVisible(), "The section is visible on the UI");
						},
						errorMessage: "Did not find the section or it is invisible"
					});
				},
				iTeardownTheAppFrame: function(sId, sViewName, bVisible, bResetStorage) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						visible: bVisible,
						success: function() {
							if (bResetStorage) {
								FakeLrepConnectorSessionStorage.forTesting.setStorage(window.sessionStorage);
							}
							return this.iTeardownMyAppFrame();
						}
					})
				},
			}
		}
	});
});
