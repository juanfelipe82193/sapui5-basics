// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/integration/services/Data"
], function (Data) {
    "use strict";

    var oData = [
        {
            Name: "Application Navigation Sample 2",
            Description: "Application",
            url: "https://www.sap.com",
            appId: "#Action-toappnavsample",
            icon: "sap-icon://product",
            interactionType: "Navigation"
        },
        {
            Name: "Navigate to a link hidden from getSemanticObjectLinks",
            Description: "URL",
            url: "#Action-tohiddenlink",
            appId: "#Action-tohiddenlink1",
            icon: "sap-icon://add",
            interactionType: "Navigation"
        },
        {
            Name: "Application Dependencies Sample",
            Description: "Application",
            url: "#Shell-home",
            appId: "#Shell-home",
            icon: "sap-icon://account",
            interactionType: "Navigation"
        },
        {
            Name: "Application Navigation Parameter display",
            Description: "Application",
            url: "#Action-toappnavsample?redirectIntent=%23Action-toshowparameters",
            appId: "#Action-toshowparameters",
            icon: "sap-icon://person-placeholder",
            interactionType: "Navigation"
        },
        {
            Name: "App Navigation Sample 1",
            Description: "URL",
            url: "#Action-toappnavsample?redirectIntent=%23Action-toshowparameters",
            appId: "#Action-toappnavsample?redirectIntent=%23Action-toshowparameters",
            icon: "sap-icon://attachment-zip-file",
            interactionType: "Navigation"
        },
        {
            Name: "Application Dependencies Sample",
            Description: "Application",
            url: "#Shell-home",
            appId: "#Action-toappdeptest2",
            interactionType: "Navigation"
        },
        {
            Name: "toWdaProductSearch",
            Description: "NWBC",
            url: "#Action-toWdaProductSearch",
            appId: "#Action-toWdaProductSearch",
            interactionType: "Navigation"
        }, {
            Name: "toWdaProductSearch",
            Description: "Application",
            url: "#null",
            appId: "#Action-toWdaProductSearch",
            interactionType: "Navigation"
        }
    ];

    var UserRecents = Data.extend();

    UserRecents.prototype.getData = function () {
        return Promise.resolve(oData);
    };

    UserRecents.prototype.enabled = function () {
        return Promise.resolve(true);
    };

    return UserRecents;
}, false);
