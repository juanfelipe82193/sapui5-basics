// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global assert */

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/test/opaTests/rta/Common",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/AggregationFilled"
], function (
    Opa5,
    Common,
    Press,
    AggregationFilled
) {
    "use strict";

    var oRTAPluginBeforeReload;
    Opa5.createPageObjects({
        onTheProductListPage: {
            baseClass: Common,
            actions: {
                iSelecttheFirstObject: function () {
                    return this.waitFor({
                        controlType: "sap.m.Table",
                        matchers: new AggregationFilled({
                            name: "items"
                        }),
                        success: function (oTable) {
                            var oFirstItem = oTable[0].getItems()[0];
                            oFirstItem.$().trigger("tap");
                        },
                        errorMessage: "Items not loaded."
                    });
                }
            },
            assertions: {
                noReloadShouldHaveHappened: function () {
                    return this.waitFor({
                        controlType: "sap.m.Table",
                        success: function () {
                            var oOpa5Window = Opa5.getWindow();
                            var oUShell = oOpa5Window.sap.ushell;
                            assert.ok(oUShell._reloadChecker, "Reload did not happen (FLP instance is still the same)");
                            // Wait for BCP 1880474052 to be solved - then use check below and remove the _reloadChecker
                            // var oCrossApplicationNavigationService = oOpa5Window.sap.ushell.Container.getService("CrossApplicationNavigation");
                            // assert.notOk(oCrossApplicationNavigationService.isInitialNavigation(), "Reload did not happen (no initial navigation in FLP)");
                        }
                    });
                }
            }
        },
        onTheMasterPageWithRTA: {
            baseClass: Common,
            actions: {
                iGoToMeArea: function () {
                    return this.waitFor({
                        id: "meAreaHeaderButton",
                        errorMessage: "Did not find the Me-Area",
                        actions: new Press()
                    });
                },
                iPressOnAdaptUi: function (bPersonalize) {
                    var sButtonType = bPersonalize ? "PERSONALIZE" : "RTA";
                    var sId = sButtonType + "_Plugin_ActionButton";
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: function (oListItem) {
                            return oListItem.data().actionItemId === sId;
                        },
                        errorMessage: "Did not find the Adapt-Ui-Button",
                        actions: new Press()
                    });
                },
                iPressOnRemoveSection: function (sSectionId) {
                    return this.waitFor({
                        controlType: "sap.ui.dt.ElementOverlay",
                        matchers: function (oOverlay) {
                            return oOverlay.getElementInstance().getId() === sSectionId;
                        },
                        success: function (aOverlays) {
                            var oOverlay = aOverlays[0];
                            var sOverlayId = oOverlay.getId();
                            oOverlay.$().find("#" + sOverlayId + "-DeleteIcon").trigger("tap");
                        },
                        errorMessage: "Did not find the Remove Button on the section"
                    });
                },
                iPressOK: function () {
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
                iPressTheBackButton: function () {
                    return this.waitFor({
                        id: "backBtn",
                        errorMessage: "Did not find the back button",
                        success: function () {
                            assert.ok(true, "Pressed on the back button");
                        },
                        actions: new Press()
                    });
                },
                iPressTheForwardButton: function (sPageOrControlId) {
                    return this.waitFor({
                        id: sPageOrControlId,
                        actions: function () {
                            Opa5.getWindow().history.go(+1);
                        },
                        success: function () {
                            assert.ok(true, "Pressed on the forward button");
                        },
                        errorMessage: "Can not press the forward button"
                    });
                },
                iPressTheShellAppTitle: function () {
                    return this.waitFor({
                      controlType: "sap.ushell.ui.shell.ShellAppTitle",
                      matchers: function (oControl) {
                          return oControl.$().hasClass("sapUshellAppTitleClickable");
                      },
                      errorMessage: "Did not find the shell app title",
                      success: function (oControl) {
                          oControl[0].onclick();
                      }
                    });
                },
                iSelectANavigationMenuItem: function (iItem) {
                    return this.waitFor({
                      id: "sapUshellAppTitlePopover",
                      errorMessage: "Did not find the app title popover",
                      success: function (oControl) {
                          oControl.getContent()[0].oItemsList.getItems()[iItem].firePress();
                      }
                    });
                },
                iRightClickOnAnElementOverlay: function (sId) {
                    return this.waitFor({
                        controlType: "sap.ui.dt.ElementOverlay",
                        matchers: function (oOverlay) {
                            return oOverlay.getElementInstance().getId() === sId;
                        },
                        success: function (aOverlays) {
                            aOverlays[0].$().triggerHandler("contextmenu");
                        },
                        errorMessage: "Did not find the Element Overlay for the control"
                    });
                },
                iClickOnAContextMenuEntry: function (iIndex) {
                    return this.waitFor({
                        controlType: "sap.m.Popover",
                        matchers: function (oMenu) {
                            return oMenu.$().hasClass("sapUiDtContextMenu");
                        },
                        success: function (aPopover) {
                            aPopover[0].getContent()[0].getItems()[iIndex].firePress();
                        },
                        errorMessage: "Did not find the Context Menu"
                    });
                },
                iEnterANewName: function (sNewLabel) {
                    return this.waitFor({
                        controlType: "sap.ui.dt.ElementOverlay",
                        matchers: function (oOverlay) {
                            if (oOverlay.$().hasClass("sapUiDtOverlaySelected")) {
                                var $Overlay = oOverlay.$().find(".sapUiRtaEditableField");
                                var oEditableFieldDomNode = $Overlay.children()[0];
                                return oEditableFieldDomNode;
                            }
                            return false;
                        },
                        actions: function (oEditableFieldDomNode) {
                            oEditableFieldDomNode.innerHTML = sNewLabel;
                            var ev = document.createEvent("Event");
                            ev.initEvent("keypress", true, true);
                            ev.which = ev.keyCode = 13;
                            oEditableFieldDomNode.dispatchEvent(ev);
                            oEditableFieldDomNode.blur();
                        },
                        errorMessage: "Did not find the Selected Element Overlay"
                    });
                },
                iClickOnAnElementOverlay: function (sId) {
                    return this.waitFor({
                        controlType: "sap.ui.dt.ElementOverlay",
                        matchers: function (oOverlay) {
                            return oOverlay.getElementInstance().getId() === sId;
                        },
                        errorMessage: "Did not find the Element Overlay",
                        actions: new Press()
                    });
                },
                iExitRtaPersonalizationMode: function () {
                    var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: function (oButton) {
                            return oButton.getParent().$ && oButton.getParent().$().hasClass("sapUiRtaToolbar")
                                && oButton.getParent().$().hasClass("type_personalization")
                                && oButton.getProperty("text") === oResources.getText("BTN_DONE");
                        },
                        actions: new Press()
                    });
                },
                iExitRtaMode: function () {
                    var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: function (oButton) {
                            return oButton.$().closest(".sapUiRtaToolbar").length > 0 && oButton.getProperty("text") === oResources.getText("BTN_EXIT");
                        },
                        actions: new Press()
                    });
                },
                iClickOnTheVariantManagementControl: function () {
                    return this.waitFor({
                        id: "application-Worklist-display-component---object--variantManagementPage",
                        errorMessage: "Did not find the variant management control",
                        success: function () {
                            assert.ok(true, "Pressed on the variant management button");
                        },
                        actions: new Press()
                    });
                },
                iSwitchToView: function (iViewIndex) {
                    return this.waitFor({
                        id: "application-Worklist-display-component---object--variantManagementPage-list",
                        errorMessage: "Did not find the view",
                        success: function (oList) {
                            var oItem = oList.getItems()[iViewIndex];
                            oItem.$().trigger("tap");
                        }
                    });
                }
            },
            assertions: {
                iShouldSeeTheProductTitle: function () {
                    return this.waitFor({
                        id: "application-Worklist-display-component---object--ObjectPageHeaderTitle",
                        success: function () {
                            var oUShell = Opa5.getWindow().sap.ushell;
                            oUShell._reloadChecker = true;
                            assert.ok(true, "Product detail page was loaded.");
                        },
                        errorMessage: "Product detail page did not load"
                    });
                },
                iShouldSeeTheToolbar: function () {
                    return this.waitFor({
                        autoWait: false,
                        controlType: "sap.m.HBox",
                        matchers: function (oToolbar) {
                            return oToolbar.$().hasClass("sapUiRtaToolbar");
                        },
                        success: function (oToolbar) {
                            var oFioriToolbar = oToolbar[0];
                            assert.ok(oFioriToolbar.getVisible(), "The Toolbar is shown.");
                        },
                        errorMessage: "Did not find the Toolbar"
                    });
                },
                iShouldSeeTheToolbarAndTheLogo: function () {
                    return this.waitFor({
                        autoWait: false,
                        controlType: "sap.m.HBox",
                        matchers: function (oToolbar) {
                            return oToolbar.$().hasClass("sapUiRtaToolbar");
                        },
                        success: function (oToolbar) {
                            var oFioriToolbar = oToolbar[0];
                            assert.ok(oFioriToolbar.getVisible(), "The Toolbar is shown.");
                            assert.ok(oFioriToolbar.getControl("logo"), "The FLP Icon is part of the Toolbar");

                            return this.waitFor({
                                controlType: "sap.m.Image",
                                matchers: function (oImage) {
                                    return jQuery(oImage.getDomRef()).closest(".sapUiRtaToolbar").length > 0;
                                },
                                success: function (aLogo) {
                                    assert.ok(aLogo.length > 0, "the logo is found on the UI");
                                }
                            });
                        },
                        errorMessage: "Did not find the Toolbar"
                    });
                },
                iShouldSeeTheOverlayForTheApp: function (sId, sViewName) {
                    var oApp;
                    this.waitFor({
                        id: sId,
                        viewName: sViewName,
                        errorMessage: "The app is still busy..",
                        success: function (oAppControl) {
                            oApp = oAppControl;
                        }
                    });
                    return this.waitFor({
                        controlType: "sap.ui.dt.ElementOverlay",
                        matchers: function (oOverlay) {
                            return oOverlay.getElementInstance() === oApp;
                        },
                        success: function (oOverlay) {
                            var oOpa5Window = Opa5.getWindow();
                            assert.ok(oOverlay[0].getVisible(), "The Overlay is shown.");
                            oRTAPluginBeforeReload = oOpa5Window.sap.ushell.plugins.rta;
                        },
                        errorMessage: "Did not find the Element Overlay for the App Control"
                    });
                },
                iShouldNotSeeTheElement: function (sId) {
                    return this.waitFor({
                        visible: false,
                        id: sId,
                        success: function (oElement) {
                            assert.ok(!oElement.getDomRef(), "the element is not visible");
                        },
                        errorMessage: "Did not find the element or it is still visible"
                    });
                },
                iShouldSeeTheSectionAfterReload: function (sId) {
                    return this.waitFor({
                        controlType: "sap.ui.dt.ElementOverlay",
                        visible: false,
                        matchers: function (oOverlay) {
                            return oOverlay.getElementInstance().getId() === sId;
                        },
                        success: function (aOverlays) {
                            var oOpa5Window = Opa5.getWindow();
                            assert.ok(aOverlays[0].getElementInstance().getVisible(), "The section is not shown on the UI");
                            assert.ok(oRTAPluginBeforeReload === oOpa5Window.sap.ushell.plugins.rta, "The plugin was not loaded again - soft reload");
                        },
                        errorMessage: "Did not find the element or it is still visible"
                    });
                },
                iShouldSeeTheDuplicatedVariantName: function (sNewVariantTitle) {
                    return this.waitFor({
                        autoWait: false,
                        controlType: "sap.ui.fl.variants.VariantManagement",
                        matchers: function (oVariantManagement) {
                            return oVariantManagement.getTitle().getText() === sNewVariantTitle;
                        },
                        success: function () {
                            assert.ok(true, "The variant was duplicated.");
                        },
                        errorMessage: "The variant was not duplicated"
                    });
                },
                iShouldSeeThePopUp: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: function (oButton) {
                            return oButton.getId().indexOf("__mbox") > -1;
                        },
                        success: function (aButtons) {
                            assert.ok(aButtons[0].getVisible(), "The Dialog is shown.");
                        },
                        actions: new Press(),
                        errorMessage: "Did not find the Dialog"
                    });
                },
                iShouldSeeTheMaxLayerURLParameter: function () {
                    return this.waitFor({
                        autoWait: true,
                        check: function () {
                            var oOpa5Window = Opa5.getWindow();
                            var oHashChanger = new oOpa5Window.sap.ui.core.routing.HashChanger();
                            return oHashChanger.getHash().includes("sap-ui-fl-max-layer=CUSTOMER");
                        },
                        success: function () {
                            assert.ok(true, "The URL parameter for max layer is present");
                        },
                        errorMessage: "The URL parameter for max layer is not being added"
                    });
                },
                iShouldNotSeeTheMaxLayerURLParameter: function () {
                    return this.waitFor({
                        autoWait: true,
                        check: function () {
                            var oOpa5Window = Opa5.getWindow();
                            var oHashChanger = new oOpa5Window.sap.ui.core.routing.HashChanger();
                            return !oHashChanger.getHash().includes("sap-ui-fl-max-layer=CUSTOMER");
                        },
                        success: function () {
                            assert.ok(true, "The URL parameter for max layer is not present");
                        },
                        errorMessage: "The URL parameter for max layer is not being removed"
                    });
                },
                iShouldSeeTheVariantURLParameter: function () {
                    return this.waitFor({
                        autoWait: true,
                        check: function () {
                            var oOpa5Window = Opa5.getWindow();
                            var oHashChanger = new oOpa5Window.sap.ui.core.routing.HashChanger();
                            return oHashChanger.getHash().includes("sap-ui-fl-control-variant-id");
                        },
                        success: function () {
                            assert.ok(true, "The URL parameter for variant id is present");
                        },
                        errorMessage: "The URL parameter for variant id is not being added"
                    });
                },
                iShouldNotSeeTheVariantURLParameter: function () {
                    return this.waitFor({
                        autoWait: true,
                        check: function () {
                            var oOpa5Window = Opa5.getWindow();
                            var oHashChanger = new oOpa5Window.sap.ui.core.routing.HashChanger();
                            return !oHashChanger.getHash().includes("sap-ui-fl-control-variant-id");
                        },
                        success: function () {
                            assert.ok(true, "The URL parameter for variant id is present");
                        },
                        errorMessage: "The URL parameter for variant id is not being added"
                    });
                }
            }
        }
    });
});
