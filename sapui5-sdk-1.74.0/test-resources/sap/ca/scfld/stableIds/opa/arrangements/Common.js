// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    return sap.ui.test.Opa5.extend("sap.ca.scfld.stableids.opa.arrangement.Common", {

            iStartMyApp : function (sURLParameters) {
                return this.iStartMyAppInAFrame("app/index.html?responderOn=true&sap-language=EN&"
                    + (sURLParameters || ""));
            }
        });
});