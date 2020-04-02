// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global QUnit */
sap.ui.require([
    "sap/ui/test/Opa5"
], function (Opa5) {

    "use strict";

    Opa5.createPageObjects({
        onTheMainPage: {
            actions: {

            },

            assertions: {

                CheckCozyCompactValues: function (nCozy, nCompact) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        success: function (ctrl) {
                            QUnit.ok(jQuery("iframe").contents().find(".sapUiSizeCompact").length === nCompact, "");
                            QUnit.ok(jQuery("iframe").contents().find(".sapUiSizeCozy").length === nCozy, "");
                        },
                        errorMessage: "CheckHeaderItems test failed"
                    });
                }
            }
        }
    });
});
