// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/integration/services/Data"
], function (Data) {
    "use strict";

    var oData = [
        {
            Name: "Service Mock",
            Description: "Application",
            url: "https://www.sap.com",
            appId: "#Action-toappnavsample",
            icon: "sap-icon://product",
            interactionType: "Navigation"
        }
    ];

    var UserFrequents = Data.extend();

    UserFrequents.prototype.getData = function () {
        return Promise.resolve(oData);
    };

    UserFrequents.prototype.enabled = function () {
        return Promise.resolve(true);
    };

    return UserFrequents;
}, false);
