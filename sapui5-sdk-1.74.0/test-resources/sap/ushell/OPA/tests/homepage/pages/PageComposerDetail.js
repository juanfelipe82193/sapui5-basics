// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties"
], function (Opa5, Press, Properties) {
    "use strict";

    var sViewName = "PageDetail";

    Opa5.createPageObjects({
        onThePageComposerDetailPage: {
            actions: {
                iExpandTheHeaderIfCollapsed: function () { // does nothing if the "sap.f.DynamicPage" header is already expanded
                    return this.waitFor({
                        viewName: sViewName,
                        id: "pageDetail",
                        actions: function (oDynamicPage) {
                            if (!oDynamicPage.getHeaderExpanded()) {
                                oDynamicPage.setHeaderExpanded(true);
                            }
                        }
                    });
                },
                iPressTheDeletePageButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonDelete",
                        actions: new Press()
                    });
                },
                iPressTheCopyPageButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonCopy",
                        actions: new Press()
                    });
                },
                iPressThePagePreviewButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonPreview",
                        actions: new Press()
                    });
                },
                iPressTheLayoutEditButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonEdit",
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iShouldSeeTheLayoutEditButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonEdit",
                        matchers: [
                            new Properties({
                                enabled: bEnabled
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "Layout edit button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeTheCopyPageButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonCopy",
                        matchers: [
                            new Properties({
                                enabled: bEnabled
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "The copy page button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeTheDeletePageButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonDelete",
                        matchers: [
                            new Properties({
                                enabled: bEnabled
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "The delete page button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeAPageDescription: function (sDescription) {
                    return this.waitFor({
                        controlType: "sap.m.ObjectAttribute",
                        matchers: function (oObjectAttribute) {
                            return oObjectAttribute.getText() === sDescription;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The page has correct description");
                        }
                    });
                },
                iShouldSeeThePageID: function (sId) {
                    return this.waitFor({
                        controlType: "sap.m.Title",
                        matchers: function (oTitle) {
                            return oTitle.getText() === sId;
                        },
                        check: function (aTitles) {
                            return aTitles.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The page has correct id");
                        }
                    });
                },
                iShouldSeeATextWithID: function (sId, sText, bFormatted) {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        viewName: sViewName,
                        id: sId,
                        check: function (oText) {
                            var fnGetText = bFormatted ? oText.getHtmlText.bind(oText) : oText.getText.bind(oText);
                            return fnGetText().indexOf(sText) > -1;
                        },
                        success: function () {
                            Opa5.assert.ok(true,
                                "Text element with id \"" + sId + "\" and text \"" + sText + "\" exists.");
                        }
                    });
                }
            }
        }
    });
});
