// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/opa/flpSandbox/flpSandbox",
    "sap/ushell/opa/localService/mockserver",
    "sap/ushell/EventHub"
], function (Opa5, flpSandbox, mockserver, EventHub) {
    "use strict";

    function setupDomForFLP () {
        // This class is added to let the OPA page look nicer. Otherwise the launchpad would overlay the OPA page
        // it is removed in the tear down step. It should be called when the UI component is started.
        document.body.classList.add("sapUiOpaFLP");
    }

    var aLoadedSteps = [];

    function schedulerMockSetup () {
        // Currently, the only problem is initMessagePopover.
        // Caution: any step loaded with byEvent could potentially need a mock in here!

        var aStepsNeedingAnUpdate = [
            {
                eventName: "initMessagePopover",
                stepName: "MessagePopoverInit"
            }
        ];

        var oCurrentStep;
        for (var i = 0; i < aStepsNeedingAnUpdate.length; i++) {
            oCurrentStep = aStepsNeedingAnUpdate[i];

            if (aLoadedSteps.indexOf(oCurrentStep.stepName) !== -1) {
                EventHub.once(oCurrentStep.eventName).do(function () {
                    EventHub.emit("StepDone", oCurrentStep.stepName);
                });
            } else {
                aLoadedSteps.push(oCurrentStep.stepName);
            }
        }
    }

    return Opa5.extend("sap.ushell.opa.arrangements.Arrangement", {
        iStartMyFLP: function (sAdapter, oOptions, bOverrideDefault) {
            oOptions = oOptions || {};

            // We need to be sure that the Scheduling Agent works even if some parts of the FLP are already loaded
            // due to an earlier iteration of OPA

            this._mockSchedule();

            var oPromise = this.iStartMyUIComponent({
                componentConfig: {
                    name: "sap.ushell.opa.flpSandbox",
                    componentData: {
                        "ushellConfig": oOptions,
                        "adapter": sAdapter,
                        "overrideDefault": bOverrideDefault
                    }
                }
            });
            oPromise.then(setupDomForFLP);
            return oPromise;
        },

        iStartMyMockServer: function (sRootUri, vMockedRoutes) {
            return mockserver.init(sRootUri, vMockedRoutes);
        },

        iChangeMyFLPConfiguration: function (oConfiguration, bMixWithDefault) {
            this.iWaitForPromise(flpSandbox.applyConfiguration(oConfiguration, bMixWithDefault));
        },

        _mockSchedule: schedulerMockSetup
    });
});
