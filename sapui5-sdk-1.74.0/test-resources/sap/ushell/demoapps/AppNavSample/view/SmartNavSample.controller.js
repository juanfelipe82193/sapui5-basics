sap.ui.define( [
    'sap/ui/core/mvc/Controller',
    "sap/ushell/services/SmartNavigation",
    "sap/ui/model/json/JSONModel"
], function ( Controller, SmartNavigation, JSONModel ) {
    "use strict";

    var oSmartNavService;

    return Controller.extend( "sap.ushell.demo.AppNavSample.view.SmartNavSample", {

        onInit: function() {
            oSmartNavService = sap.ushell.Container.getService("SmartNavigation");
        },

        onBeforeRendering: function () {
            var that = this;

            oSmartNavService.getLinks( { semanticObject: "Action" } )
                .then( function ( links ) {
                    that.getView().getModel("SOmodel").setProperty( "/links", links );
                }.bind( this ) );
        },

        onSemanticObjectSelected: function ( oEvent ) {
            var that = this;
            var sSemObject = oEvent.getParameter( "selectedItem" ).getText();

            oSmartNavService.getLinks( { semanticObject: sSemObject } )
                    .then( function ( links ) {
                        that.getView().getModel("SOmodel").setProperty( "/links", links );
                    }.bind( this ) );
        },

        onItemPressed: function ( oEvt ) {
            var intent = oEvt.getSource().getText();
            oSmartNavService.toExternal( { target: { shellHash: intent } } );
        }

    } );
} );