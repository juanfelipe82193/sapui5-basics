sap.ui.define([
    "jquery.sap.global",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (jQuery, oMessageToast, oController) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.InboundsBrowser", {
        onInit: function () {
            var that = this;
            var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
            oClientSideTargetResolution._ensureInbounds()
                .done(function (aInbounds) {
                    that.oModel = new sap.ui.model.json.JSONModel({
                        inbounds: [],
                        inboundsCount: 0
                    });

                    that.filterAndSetModel({
                        inbounds: aInbounds,
                        inboundsCount: aInbounds.length
                    });

                    that.getView().setModel(that.oModel);

                    that.oModel.bindTree("/").attachChange(that._onModelChanged);
                })
                .fail(function (sError) {
                    oMessageToast.show("An error occurred while retrieving the inbounds: " + sError);
                });
        },
        onBtnSearchPress: function (e) {
            e.preventDefault();
            var that = this,
                sQuery = (sap.ui.getCore().byId(this.createId("txtQuery")).getValue() || "").toLowerCase();

            if (this.sPreviousQuery === sQuery) {
                return;
            }

            this.sPreviousQuery = sQuery;

            var oList = sap.ui.getCore().byId(this.createId("lstInboundList"));
            oList.setBusy(true);

            try {

                sap.ushell.Container.getService("ClientSideTargetResolution")._ensureInbounds()
                    .done(function (aInbounds) {
                        var iTotalInbounds = aInbounds.length;

                        if (sQuery !== "") {
                            // Try to find semanticObject action matches exact matches first
                            var aDashSplitQuery = sQuery.toLowerCase().split("-");

                            // Likely to be a "#SemanticObject-action" query
                            if (aDashSplitQuery.length === 2) {
                                var sQuerySemanticObject = aDashSplitQuery[0].replace("#", "");
                                var sQuerySemanticAction = aDashSplitQuery[1] || "";
                                var aExactMatches = aInbounds.filter(function (oInbound) {
                                    return oInbound.semanticObject.toLowerCase() === sQuerySemanticObject &&
                                       oInbound.action.toLowerCase() === sQuerySemanticAction;
                                });
                                if (aExactMatches.length > 0) {
                                    // we are done
                                    that.filterAndSetModel({
                                        inboundsCount: iTotalInbounds,
                                        inbounds: aExactMatches
                                    });
                                    oList.setBusy(false);
                                    return;
                                }
                            }

                            // Use fuzzy matching
                            var oKeywordSet = {};
                            var aResults = [];

                            aInbounds.forEach(function (oInbound) {
                                var sApplicationDependencies = oInbound.resolutionResult.applicationDependencies;
                                if (jQuery.isPlainObject(sApplicationDependencies)) {
                                    sApplicationDependencies = JSON.stringify(sApplicationDependencies);
                                }

                                // split into keywords
                                var aKeywords = [
                                    oInbound.semanticObject,
                                    oInbound.action,
                                    (oInbound.id || "" ).split("~")[1] || "",
                                    sApplicationDependencies,
                                    oInbound.resolutionResult.additionalInformation,
                                    oInbound.resolutionResult.applicationType,
                                    oInbound.resolutionResult.ui5ComponentName,
                                    oInbound.resolutionResult.url,
                                    oInbound.resolutionResult.systemAlias,
                                    ""
                                ].filter(function (sKey) { return sKey !== undefined; });
                                if (oInbound.title === "string" && oInbound.title.length > 0) {
                                    Array.prototype.push.apply(
                                        aKeywords,
                                        oInbound.title.split(/\s*|[.]|/).map(function(sTitlePart) {
                                            return sTitlePart.toLowerCase();
                                        })
                                    );
                                }

                                // index keyword -> inbound(s)
                                aKeywords.forEach(function (sKeyword) {
                                    var sFixedKeyword = (sKeyword || "").toLowerCase();
                                    if (!oKeywordSet.hasOwnProperty(sFixedKeyword)) {
                                        oKeywordSet[sFixedKeyword] = [];
                                    }
                                    oKeywordSet[sFixedKeyword].push(oInbound);
                                });
                            });

                            // Try to match the whole query first
                            if (oKeywordSet.hasOwnProperty(sQuery)) {
                                Array.prototype.push.apply(aResults, oKeywordSet[sQuery]);
                            }

                            // Match sub-query keys
                            sQuery.split(/\s*/).forEach(function (sQueryKeyword){
                                if (oKeywordSet.hasOwnProperty(sQueryKeyword)) {
                                    Array.prototype.push.apply(aResults, oKeywordSet[sQuery]);
                                }
                            });

                            // Todo - sort result by significance
                        } else {
                            aResults = aInbounds;
                        }

                        that.filterAndSetModel({
                            inboundsCount: iTotalInbounds,
                            inbounds: aResults
                        });

                        oList.setBusy(false);
                    })
                    .fail(function (sMsg) {
                        oMessageToast.show("An error occurred while retrieving the inbounds: " + sMsg);
                        oList.setBusy(false);
                    });
            } catch (oError) {
                oMessageToast.show("An exception occurred while retrieving the inbounds: " + oError);
                oList.setBusy(false);
            }
        },
        filterAndSetModel: function (oViewData) {
            var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution"),
                that = this;

            oViewData.inbounds = oViewData.inbounds.map(function (oInbound) {
               oInbound.compactSignature = oClientSideTargetResolution._compactSignatureNotation(oInbound.signature);
               return oInbound;
            });
            that.oModel.setData(oViewData);
        },
        roundFloat: function (iNum) {
            return Number(Math.round(iNum + 'e3') + 'e-3')
                .toFixed(3);
        },
        onInboundListItemSelected: function (oEvent) {
            var oSelectedInbound = oEvent.getSource().getBindingContext().getObject();

            var oViewData = {
                intent: oSelectedInbound.semanticObject + "-" + oSelectedInbound.action,
                rawInbound: JSON.stringify(oSelectedInbound, null, "   ")
            };

            this.oApplication.navigate("toView", "ShowInbound", oViewData);
        },
        _onModelChanged: function () {
            // read from the model and update internal state
        },
        onExit: function () {
        }

    });
});
