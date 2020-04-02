sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token"
], function (Controller, JSONModel, Token) {
    return Controller.extend("sap.ushell.demo.AppNavSample.view.SapTagSample", {
        
        onInit: function () {
            this.oModel = new JSONModel();
            this.getView().setModel(this.oModel, "tagModel");

            var oTagTokenizer = this.getView().byId("tagTokenizer");
            oTagTokenizer.addValidator( function(args) {
                var text = args.text;
                return new Token({key: text, text: text});
            });
        },

        onSemanticObjectSelected: function (oEvt) {
            var that = this,
                sSelectedSO = oEvt.getParameter( "selectedItem" ).getText();
            this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
                oCrossAppNavigator.getPrimaryIntent(sSelectedSO, {}).done( function (oResult) {
                    that.oModel.setProperty("/primaryIntent", oResult);
                });
            });

        },
        onSemanticObjectSelectedForTags: function (oEvt) {
            sSelectedSO = oEvt.getParameter( "selectedItem" ).getText();
            this.sSelectedSoTags = sSelectedSO;
            this.onTokenUpdated();
        },

        onTokenUpdated: function () {
            var that = this;
            var aTokens = this.getView().byId("tagTokenizer").getTokens().map( function(elem, index) {
                return elem.getKey();
            });

            this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
                var sSO = that.sSelectedSoTags || "Tagtesting";
                oCrossAppNavigator.getLinks({semanticObject: sSO, tags: aTokens}).done( function(oResult) {
                    that.oModel.setProperty("/taggedIntents", oResult);
                })

            })

        }
    });
});