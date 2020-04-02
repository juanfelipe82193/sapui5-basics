sap.ui.define([
    "jquery.sap.global",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (jQuery, oMessageToast, oController) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.Settings", {
        onInit: function () {
            var that = this;
            var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");

            this.aOriginalInbounds = []; // To be determined
            this.fnOriginalEnsureInbounds = oClientSideTargetResolution._ensureInbounds;
            this.fnOriginalEnsureInbounds.call(oClientSideTargetResolution /*, aSegments */)
                .done(function (aInbounds) {
                    that.aOriginalInbounds = aInbounds;

                    that.oModel = new sap.ui.model.json.JSONModel({
                        inboundConfiguration: JSON.stringify(aInbounds, null, "   ")
                    });
                    that.getView().setModel(that.oModel);

                    that.oModel.bindTree("/").attachChange(that._onModelChanged);
                })
                .fail(function (sMsg) {
                    oMessageToast.show("Error while calling ClientSideTargetResolution#_ensureInbounds: " +
                        sMsg);
                });
        },
        onBtnLoadCurrentInboundsPress: function (oEvent) {
            var that = this.getView().getController();

            if (!that.oModel) {
                oMessageToast.show("Current model was never created when instantiating the Settings controller!")
                return;
            }

            // Update model with the original result from ensure inbounds
            that.oModel.setData({
                inboundConfiguration: JSON.stringify(that.aOriginalInbounds, null, "   ")
            });
        },
        _onModelChanged: function () {
            var that = this,
                sJson = that.oModel.getData().inboundConfiguration;

            try {
                var aInbounds = JSON.parse(sJson);

                // mock _ensureInbounds to return the specified inbounds
                var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
                oClientSideTargetResolution._ensureInbounds = function () {
                    return new jQuery.Deferred().resolve(aInbounds).promise();
                };
                oMessageToast.show("Inbounds updated");
            } catch (oError) {
                oMessageToast.show("Cannot update inbounds: " + oError);
            }

        },
        onExit: function () { }
    });
});
