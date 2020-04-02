// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/opa/localService/mockserver",
    "sap/ushell/EventHub"
], function (Opa5, mockserver, EventHub) {
    "use strict";

    function teardownDomForFLP () {
        if (sap.ushell.components.homepage && sap.ushell.components.homepage.getDashboardGroupsBox) {
            delete sap.ushell.components.homepage.getDashboardGroupsBox;
        }
        document.body.classList.remove("sapUiOpaFLP");
        var FLPScheduler = sap.ui.require("sap/ushell/bootstrap/_SchedulingAgent/FLPScheduler");
        FLPScheduler.oSchedule.aBlocksLoading = [];
    }

    return Opa5.extend("sap.ushell.opa.arrangements.Teardown", {
        iTeardownMyFLP: function () {
            var oPromise = this.iTeardownMyUIComponent();
            oPromise.then(teardownDomForFLP);
            oPromise.then(mockserver.destroyAll);
            oPromise.then(EventHub._reset);
            return oPromise;
        }
    });
});
