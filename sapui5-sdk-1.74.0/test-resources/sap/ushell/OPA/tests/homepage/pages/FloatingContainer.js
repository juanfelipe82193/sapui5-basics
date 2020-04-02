// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function(Opa5, Press) {
    "use strict";

    Opa5.createPageObjects({
        onTheFloatingContainer: {
            actions: {
                iPressOnTheCloseButton: function () {
                    return this.waitFor({
                        controlType : "sap.m.Button",
                        matchers : function(oNode) {
                            return oNode.$().hasClass("sapUshellCopilotCloseBtn");
                        },
                        actions: new Press(),
                        errorMessage: "Could not find the close button of closed Copilot"
                    });
                }
            }
        }
    });
});