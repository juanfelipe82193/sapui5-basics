sap.ui.define([
    "jquery.sap.global",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (jQuery, oMessageToast, oController) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.GetEasyAccessSystems", {
        onInit: function () {
            this.oModel = new sap.ui.model.json.JSONModel({
                items: []  // text and title
            });
            this.getView().setModel(this.oModel);
        },
        onBtnExecutePress: function (e) {
            e.preventDefault();
            var that = this;

            try {
                sap.ushell.Container.getService("ClientSideTargetResolution").getEasyAccessSystems()
                    .done(function (oSystems) {
                        var aSystems = Object.keys(oSystems).map(function (sSystemId) {
                            return {
                                text: sSystemId,
                                title: oSystems[sSystemId].text,
                                raw: oSystems[sSystemId]
                            };
                        });
                        that.oModel.setData({ items: aSystems });
                        oMessageToast.show("Found " + aSystems.length + " systems");
                    })
                    .fail(function (sMsg) {
                        oMessageToast.show("An error occurred while retrieving the inbounds: " + sMsg);
                    });
            } catch (oError) {
                oMessageToast.show("Exception: " + oError);
            }
        },
        onSystemSelected: function (oEvent) {
            var oSelectedInbound = oEvent.getSource().getBindingContext().getObject();
            oMessageToast.show(JSON.stringify(oSelectedInbound.raw, null, "   "));
        },
        _onModelChanged: function () {
            // read from the model and update internal state
        },
        onExit: function () {
        }

    });
});
