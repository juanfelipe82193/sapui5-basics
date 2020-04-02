sap.ui.define([
    "jquery.sap.global",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (jQuery, oMessageToast, oController) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.IntentResolution", {
        onInit: function () {
            this.oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
            this.oModel = new sap.ui.model.json.JSONModel({
                matchedInbounds: [],
                tookString: ""
            });
            this.getView().setModel(this.oModel);

            this.oModel.bindTree("/").attachChange(this._onModelChanged);
        },
        prepareModelData: function (oMatchingTarget, sFixedHashFragment) {
            var that = this;
            var oDeferred = new jQuery.Deferred();
            var oModelData = {
                rawMatchingTarget: JSON.stringify(oMatchingTarget, null, "   "),
                rawResolutionResult: "N/A",
                intent: "#" + oMatchingTarget.inbound.semanticObject + "-" + oMatchingTarget.inbound.action,
                priorityString: oMatchingTarget.priorityString,
                compactSignature: this.oClientSideTargetResolution._compactSignatureNotation(oMatchingTarget.inbound.signature),
                url: oMatchingTarget.inbound.resolutionResult
                    ? oMatchingTarget.inbound.resolutionResult.url
                    : "Inbound did not provide a resolution result",
                inbound: {}, // filled separately
                resolutionResult: oMatchingTarget.inbound.resolutionResult,
                parameters: [],
                additionalParameters: oMatchingTarget.inbound.signature.additionalParameters,
                resolvedResolutionResult: {
                    text: "N/A",
                    url: "N/A",
                    applicationType: "N/A",
                    additionalInformation: "N/A",
                    ui5ComponentName: "N/A",
                    applicationDependencies: "N/A"
                },
                resolvedIn: ""
            };

            // Make sure application dependencies comes formatted as a string
            var oResolutionResult = oModelData.resolutionResult;
            if (typeof oResolutionResult.applicationDependencies !== "string") {
                if (!jQuery.isPlainObject(oResolutionResult.applicationDependencies)) {
                    oResolutionResult.applicationDependencies = "Unknown type (should be object or string)";
                } else {
                    oResolutionResult.applicationDependencies = JSON.stringify(
                        oResolutionResult.applicationDependencies, null, "   ");
                }
            }

            // Fill inbound properties
            var oInbound = oMatchingTarget.inbound;
            oModelData.inbound.title = oInbound.title;
            oModelData.inbound.deviceTypes = Object.keys(oInbound.deviceTypes)
                .filter(function(sKey) { return !!oInbound.deviceTypes[sKey]; })
                .join("; ");

            // Fill parameters
            var aSeparatedParameters = [],
                oParameters = (oInbound.signature || {}).parameters || {};

            Object.keys(oParameters).forEach(function (sParamName) {
                var oParameter = oParameters[sParamName],
                    bRequired = !!oParameter.required || false;

                // Create filter parameter
                if (typeof oParameter.filter === "object") {
                    aSeparatedParameters.push({
                        typeIcon: "locked",
                        typeIconColor: bRequired ? "black" : "gray",
                        name: sParamName,
                        value: oParameter.filter.value || "<UNKNOWN VALUE>"
                    });
                }

                // Create default parameter
                if (typeof oParameter.defaultValue === "object") {
                    aSeparatedParameters.push({
                        typeIcon: "unlocked",
                        typeIconColor: bRequired ? "black" : "gray",
                        name: sParamName,
                        value: oParameter.defaultValue.value || "<UNKNOWN VALUE>"
                    });
                }

                // RenameTo Parameters
                if (typeof oParameter.renameTo === "string") {
                    aSeparatedParameters.push({
                        typeIcon: "redo",
                        typeIconColor: "black",
                        name: sParamName,
                        value: (oParameter || {}).renameTo
                    });
                }
            });
            oModelData.parameters = aSeparatedParameters;


            // Run resolve hash fragment to get the actual resolution result
            this._resolveHashFragment(sFixedHashFragment, oMatchingTarget)
                .done(function (oResolvedHashFragment, iTime) {
                    oModelData.resolvedResolutionResult = oResolvedHashFragment;
                    oModelData.rawResolutionResult = JSON.stringify(oResolvedHashFragment, null, "   ");
                    oModelData.resolvedIn = " - resolved in " + that.roundFloat(iTime) + "ms";
                })
                .always(function () {
                    oDeferred.resolve(oModelData);
                });

            return oDeferred.promise();
        },
        _resolveHashFragment: function (sFixedHashFragment, oForceMatchingTarget) {
            var oDeferred = new jQuery.Deferred();
            var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
            var fnOriginalEnsureInbounds = oClientSideTargetResolution._ensureInbounds;
            oClientSideTargetResolution._ensureInbounds = function () {
                return new jQuery.Deferred().resolve([oForceMatchingTarget.inbound]).promise();
            };

            var bHighResPerformance = !!window.performance;
            var iResolveHashFragmentTime = bHighResPerformance
                ? window.performance.now()
                : (new Date()).getTime();
            oClientSideTargetResolution.resolveHashFragment(sFixedHashFragment).done(function (oResolutionResult) {
                oClientSideTargetResolution._ensureInbounds = fnOriginalEnsureInbounds;
                oDeferred.resolve(
                    oResolutionResult,
                    (bHighResPerformance ? window.performance.now() : (new Date()).getTime()) - iResolveHashFragmentTime
                );
            })
            .fail(function (sMsg) {
                oClientSideTargetResolution._ensureInbounds = fnOriginalEnsureInbounds;
                oMessageToast.show("Failed to resolve " + sFixedHashFragment + ": " + sMsg);
                oDeferred.reject();
            });
            return oDeferred.promise();
        },
        onBtnResolveHashPress: function () {
            var that = this,
                sHashFragment = sap.ui.getCore().byId(this.createId("txtIntent")).getValue(),
                oUrlParsing = sap.ushell.Container.getService("URLParsing"),
                sFixedHashFragment = sHashFragment.indexOf("#") === 0 ? sHashFragment : "#" + sHashFragment;

            var oList = sap.ui.getCore().byId(this.createId("lstInbounds"));
            oList.setBusy(true);

            var oShellHash = oUrlParsing.parseShellHash(sFixedHashFragment);
            if (oShellHash === undefined) {
                oMessageToast.show("Shell hash cannot be parsed");
                oList.setBusy(false);
                return;
            }

            var bHighResPerformance = !!window.performance;

            var iEnsureInboundsTime = bHighResPerformance
                ? window.performance.now()
                : (new Date()).getTime();

            this.oClientSideTargetResolution._ensureInbounds().done(function (aInbounds) {
                iEnsureInboundsTime = bHighResPerformance
                    ? window.performance.now() - iEnsureInboundsTime
                    : (new Date()).getTime() - iEnsureInboundsTime;

                var iMatchingInboundsTime = bHighResPerformance
                    ? window.performance.now()
                    : (new Date()).getTime();

                that.oClientSideTargetResolution._getMatchingInbounds(oShellHash, aInbounds)
                    .fail(function (sErrorMessage) {
                        oMessageToast.show(sErrorMessage);
                    })
                    .done(function (aMatchingTargets) {
                        iMatchingInboundsTime = bHighResPerformance
                            ? window.performance.now() - iMatchingInboundsTime
                            : (new Date()).getTime() - iMatchingInboundsTime;

                        var oModel = that.getView().getModel(),
                            oModelData = {
                                matchedInbounds: [],
                                tookString: "took " +
                                    that.roundFloat(iEnsureInboundsTime) +
                                    "ms for _ensureInbounds() call, and " +
                                    that.roundFloat(iMatchingInboundsTime) +
                                    "ms for _getMatchingInbounds() call"
                            };

                        function processNextMatchingTarget(aRemainingMatchingTargets) {
                            if (aRemainingMatchingTargets.length === 0) {
                                oModel.setData(oModelData);
                                return;
                            }

                            that.prepareModelData(aRemainingMatchingTargets.shift(), sFixedHashFragment)
                                .done(function (oPreparedModelData) {
                                    oModelData.matchedInbounds.push(oPreparedModelData);
                                })
                                .then(function () {
                                    processNextMatchingTarget(aRemainingMatchingTargets);
                                });
                        }

                        processNextMatchingTarget(aMatchingTargets);

                    });
            }).fail(function (sErrorMessage) {
                oMessageToast.show(sErrorMessage);
            }).always(function () {
                oList.setBusy(false);
            });
        },
        roundFloat: function (iNum) {
            return Number(Math.round(iNum + 'e3') + 'e-3')
                .toFixed(3);
        },
        onInboundListItemSelected: function (oEvent) {
            var oSelectedInbound = oEvent.getSource().getBindingContext().getObject();

            this.oApplication.navigate("toView", "ShowResolvedTarget", oSelectedInbound);
        },
        _onModelChanged: function () {
            // read from the model and update internal state
        },
        onExit: function () {
        }

    });
});
