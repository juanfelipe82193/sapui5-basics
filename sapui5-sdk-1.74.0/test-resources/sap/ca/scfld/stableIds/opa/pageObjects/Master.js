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
        onTheMaster : {
            baseClass : Common,
            actions: {
                click: function (sScfldControl, sText) {
                    return this._click(sScfldControl, sText,
                        "sap.ca.scfld.stableids.app.view.S2");
                }
            },
            assertions: {
                checkId: function (bIsGenerated, sScfldControl, sExpectedId, sText, sFixId) {
                    return this._checkId(bIsGenerated, sScfldControl, sExpectedId, sText,
                        sFixId, "test_S2--", "sap.ca.scfld.stableids.app.view.S2");
                },
                checkIdInOverflow: function (bIsGenerated, sScfldControl, sExpectedId, sText) {
                    return this._checkIdInOverflow(bIsGenerated, sScfldControl, sExpectedId,
                        sText, "test_S2--", "sap.ca.scfld.stableids.app.view.S2");
                }
            }
        }
    });
});