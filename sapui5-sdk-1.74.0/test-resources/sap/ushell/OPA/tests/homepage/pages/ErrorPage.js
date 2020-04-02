// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/opa/tests/homepage/pages/i18n/resources"
], function (Opa5, resources) {
    "use strict";

    var sViewName = "ErrorPage";

    Opa5.createPageObjects({
        onTheErrorPage: {
            actions: {
                iGoBack: function () {
                    return this.waitFor({
                        success: function () {
                            Opa5.getWindow().history.back();
                        }
                    });
                }
            },
            assertions: {
                iShouldSeeErrorLink: function (sLinkText) {
                    return this.waitFor({
                        controlType: "sap.m.Link",
                        viewName: sViewName,
                        check: function (aControls) {
                            return aControls.length === 1 &&
                                   aControls[0].getText() === resources.i18n.getText("ErrorPage.Link");
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The error link should exist on the page.");
                        }
                    });
                },
                iShouldSeeErrorText: function () {
                    return this.waitFor({
                        controlType: "sap.m.MessagePage",
                        viewName: sViewName,
                        check: function (aControls) {
                            return aControls.length === 1 &&
                                   aControls[0].getText() === resources.i18n.getText("ErrorPage.Message");
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The error text should exist on the page.");
                        }
                    });
                }
            }
        }
    });
});
