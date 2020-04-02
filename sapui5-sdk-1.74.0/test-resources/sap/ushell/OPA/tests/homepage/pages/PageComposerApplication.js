// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5"
], function (Opa5) {
    "use strict";

    Opa5.createPageObjects({
        onThePageComposerApplication: {
            actions: {},
            assertions: {
                iShouldSeeTheCreateDialog: function () {
                    return this.waitFor({
                        id: /--createPageDialog$/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        check: function (aDialogs) {
                            return aDialogs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The create page dialog is shown.");
                        }
                    });
                },
                iShouldSeeTheDeleteDialog: function () {
                    return this.waitFor({
                        id: /--deletePageDialog$/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        check: function (aDialogs) {
                            return aDialogs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The delete page dialog is shown.");
                        }
                    });
                },
                iShouldSeeTheCopyDialog: function () {
                    return this.waitFor({
                        id: /--copyPageDialog$/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        check: function (aDialogs) {
                            return aDialogs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The copy page dialog is shown.");
                        }
                    });
                },
                iShouldSeeTheConfirmChangesDialog: function () {
                    return this.waitFor({
                        id: /confirmChangesDialog$/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        check: function (aDialogs) {
                            return aDialogs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The confirm changes dialog is shown.");
                        }
                    });
                },
                iShouldSeeTheContextSelector: function () {
                    return this.waitFor({
                        id: /--contextSelector$/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        check: function (aDialogs) {
                            return aDialogs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The ContextSelector is shown.");
                        }
                    });
                },
                iShouldSeeThePagePreviewDialog: function () {
                    return this.waitFor({
                        id: /--pagePreviewDialog$/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        check: function (aDialogs) {
                            return aDialogs.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The page preview page dialog is shown.");
                        }
                    });
                },
                iShouldSeeScopedTilesInThePreviewDialog: function () {
                    return this.waitFor({
                        id: /--pagePreviewDialog$/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        check: function (aDialogs) {
                            if (aDialogs.length !== 1) {
                                return false;
                            }

                            var oPage = aDialogs[0].getContent()[0];
                            var oRolesModel = oPage.getModel("roles");
                            var aAvailableIds = oRolesModel && oRolesModel.getProperty("/availableVisualizations");
                            if (!aAvailableIds) {
                                return false;
                            }

                            var aSections = oPage.getSections();
                            var i, j, aVisualizations;
                            for (i = 0; i < aSections.length; i++) {
                                aVisualizations = aSections[i].getVisualizations();
                                for (j = 0; j < aVisualizations.length; j++) {
                                    if (aAvailableIds.indexOf(aVisualizations[j].getVisualizationId()) < 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The page preview page dialog is shown.");
                        }
                    });
                }
            }
        }
    });
});
