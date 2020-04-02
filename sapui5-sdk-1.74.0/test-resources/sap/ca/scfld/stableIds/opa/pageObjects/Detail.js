// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ca/scfld/stableids/opa/arrangements/Common",
    "sap/ca/scfld/stableids/opa/pageObjects/Common"
], function (Opa5, CommonArrangement, Common) {
    "use strict";

    Opa5.extendConfig({
        arrangements : new CommonArrangement(),
        viewName : "sap.ca.scfld.stableids.app.Main"
    });

    Opa5.createPageObjects({
        onTheDetail : {
            baseClass : Common,
            actions: {
                click: function (sScfldControl, sText, bImmediateClick) {
                    return this._click(sScfldControl, sText,
                        "sap.ca.scfld.stableids.app.view.S3", bImmediateClick);
                },
                goToFullscreen: function () {
                    return this._click("appButton", "Fullscreen subview",
                        "sap.ca.scfld.stableids.app.view.S3");
                },
                refreshList: function () {
                    return this._click("appButton", "Refresh List",
                        "sap.ca.scfld.stableids.app.view.S3");
                }
            },
            assertions: {
                checkId: function (bIsGenerated, sScfldControl, sExpectedId, sText, sFixId) {
                    return this._checkId(bIsGenerated, sScfldControl, sExpectedId, sText,
                        sFixId, "test_S3--", "sap.ca.scfld.stableids.app.view.S3");
                },
                checkIdInOverflow: function (bIsGenerated, sScfldControl, sExpectedId, sText) {
                    return this._checkIdInOverflow(bIsGenerated, sScfldControl, sExpectedId,
                        sText, "test_S3--", "sap.ca.scfld.stableids.app.view.S3");
                }
            }
        }
    });
});
