// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ushell/opa/tests/homepage/pages/i18n/resources",
    "sap/ui/test/matchers/LabelFor",
    "sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, Press, EnterText, Properties, oResources, LabelFor, PropertyStrictEquals) {
    "use strict";

    var sAppView = "App";

    Opa5.createPageObjects({
        onADialog: {
            actions: {
                iPressTheCancelButton: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        id: /ancelButton$/, // the "c" here is missing on purpose to provide polymorphism
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iPressTheSelectButton: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        id: /SelectButton$/,
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iTypeIntoTheIdInputField: function (sText) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        id: /IdInput$/,
                        controlType: "sap.m.Input",
                        viewName: sAppView,
                        check: function (aInputs) {
                            return aInputs.length === 1;
                        },
                        actions: new EnterText({ text: sText })
                    });
                },
                iTypeIntoTheTitleInputField: function (sText) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        id: /TitleInput$/,
                        controlType: "sap.m.Input",
                        viewName: sAppView,
                        check: function (aInputs) {
                            return aInputs.length === 1;
                        },
                        actions: new EnterText({ text: sText })
                    });
                },
                iTypeIntoTheDescriptionInputField: function (sText) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        id: /DescriptionInput$/,
                        controlType: "sap.m.Input",
                        viewName: sAppView,
                        check: function (aInputs) {
                            return aInputs.length === 1;
                        },
                        actions: new EnterText({ text: sText })
                    });
                },
                iPressTheSectionDeleteButton: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.Button",
                        enabled: true,
                        matchers: [
                            new Properties({
                                text: oResources.i18n.getText("Button.Delete"),
                                type: "Default"
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iEnterTextIntoInputWithLabel: function (sText, sLabelText) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Input",
                        matchers: new LabelFor({ text: sLabelText }),
                        actions: new EnterText({ text: sText })
                    });
                },
                iEnterTextIntoTheSearchField: function (sText) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.SearchField",
                        actions: new EnterText({ text: sText })
                    });
                },
                iPressTheConfirmButton: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        id: /ConfirmButton$/,
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iPressTheClosePreviewButton: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        id: /previewCloseButton$/,
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iSelectRoleWithIndex: function (iIndex) {
                    return this.waitFor({
                        viewName: sAppView,
                        controlType: "sap.m.CheckBox",
                        id: new RegExp("contextSelectorList-" + iIndex + "-selectMulti"),
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iShouldSeeTheIdInputField: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        id: /IdInput$/,
                        controlType: "sap.m.Input",
                        viewName: sAppView,
                        check: function (aInputs) {
                            return aInputs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The ID input field should be shown.");
                        }
                    });
                },
                iShouldSeeTheTitleInputField: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        id: /TitleInput$/,
                        controlType: "sap.m.Input",
                        viewName: sAppView,
                        check: function (aInputs) {
                            return aInputs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The title input field should be shown.");
                        }
                    });
                },
                iShouldSeeTheDescriptionInputField: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        id: /DescriptionInput$/,
                        controlType: "sap.m.Input",
                        viewName: sAppView,
                        check: function (aInputs) {
                            return aInputs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The description input field should be shown.");
                        }
                    });
                },
                iShouldSeeTheCreateButton: function (bEnabled) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        id: /SaveButton$/,
                        controlType: "sap.m.Button",
                        enabled: bEnabled,
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The create button is shown in the dialog and it is in the correct state.");
                        }
                    });
                },
                iShouldSeeTheDeleteButton: function (bEnabled) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        id: /deleteButton$/,
                        controlType: "sap.m.Button",
                        enabled: bEnabled,
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The delete button is shown in the dialog and it is in the correct state.");
                        }
                    });
                },
                iShouldSeeTheSectionDeleteButton: function (bEnabled) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.Button",
                        enabled: bEnabled,
                        matchers: [
                            new Properties({
                                text: oResources.i18n.getText("Button.Delete"),
                                type: "Default"
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The section delete button is shown and it is in the correct state.");
                        }
                    });
                },
                iShouldSeeTheSelectButton: function (bEnabled) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.Button",
                        enabled: bEnabled,
                        id: /SelectButton$/,
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The select button is shown and it is in the correct state.");
                        }
                    });
                },
                iShouldSeeTheCancelButton: function (bEnabled) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.Button",
                        enabled: bEnabled,
                        id: /CancelButton$/,
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The cancel button is shown and it is in the correct state.");
                        }
                    });
                },
                iShouldSeeTheSearchField: function (bVisible) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.SearchField",
                        id: /contextSelectorSearchField$/,
                        visible: bVisible, // also include invisble an unrendered controls
                        matchers: new Properties({
                            visible: bVisible
                        }),
                        check: function (aSearchFields) {
                            return aSearchFields.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The SearchField in the ContextSelector has the visibility ", bVisible);
                        }
                    });
                },
                iShouldSeeTheRoleWithId: function (sRoleId) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.StandardListItem",
                        matchers: new Properties({
                            title: sRoleId
                        }),
                        check: function (aItems) {
                            return aItems.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Role with ID ", sRoleId, " was found.");
                        }
                    });
                },
                iShouldSeeTheRoleWithTitle: function (sRoleTitle) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.StandardListItem",
                        matchers: new Properties({
                            description: sRoleTitle
                        }),
                        check: function (aItems) {
                            return aItems.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Role with title ", sRoleTitle, " was found.");
                        }
                    });
                },
                iShouldNotSeeTheRoleWithId: function (sRoleId) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.StandardListItem",
                        check: function (aItems) {
                            aItems.forEach(function (item) {
                                if (item.getTitle() === sRoleId) {
                                    return false;
                                }
                            });
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Role with ID ", sRoleId, " was found.");
                        }
                    });
                },
                iShouldNotSeeTheRoleWithTitle: function (sRoleTitle) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.StandardListItem",
                        check: function (aItems) {
                            aItems.forEach(function (item) {
                                if (item.getDescription() === sRoleTitle) {
                                    return false;
                                }
                            });
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Role with title ", sRoleTitle, " was found.");
                        }
                    });
                },
                iShouldSeeTheContextSelectorInfoToolbar: function (bVisible) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        viewName: sAppView,
                        controlType: "sap.m.OverflowToolbar",
                        id: /contextSelectorInfoToolbar$/,
                        visible: bVisible, // also include invisble an unrendered controls
                        matchers: new PropertyStrictEquals({
                            name: "visible",
                            value: bVisible
                        }),
                        check: function (aToolbars) {
                            return aToolbars.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Toolbar in the ContextSelector has the visibility ", bVisible);
                        }
                    });
                }
            }
        }
    });
});
