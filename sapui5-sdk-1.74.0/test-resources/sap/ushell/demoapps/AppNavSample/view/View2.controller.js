sap.ui.controller("sap.ushell.demo.AppNavSample.view.View2", {
    oApplication: null,
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to modify the View before it is
     * displayed, to bind event handlers and do other one-time initialization.
     * 
     * @memberOf view.Detail
     */
    onInit: function() {
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        var myComponent = sap.ui.component(sComponentId);
        if (myComponent.getComponentData().startupParameters) {
            jQuery.sap.log.debug("startup parameters of appnavsample are " + JSON.stringify(myComponent.getComponentData().startupParameters));
        }
    },

    handleBtnDP2Press: function() {
        "use strict";
        var oDP2 = this.oView.byId("DP2");
        var sDate = oDP2.getDateValue();

        var dialog = new sap.m.Dialog({
            title: 'Date',
            type: 'Message',
            content: new sap.m.Text({
                text: sDate
            }),
            beginButton: new sap.m.Button({
                text: 'OK',
                press: function() {
                    dialog.close();
                }
            }),
            afterClose: function() {
                dialog.destroy();
            }
        });

        dialog.open();
    },

    handleBtnDP3Press: function() {
        "use strict";
        var oDP3 = this.oView.byId("DP3");
        var sDate = oDP3.getDateValue();

        var dialog = new sap.m.Dialog({
            title: 'Date',
            type: 'Message',
            content: new sap.m.Text({
                text: sDate
            }),
            beginButton: new sap.m.Button({
                text: 'OK',
                press: function() {
                    dialog.close();
                }
            }),
            afterClose: function() {
                dialog.destroy();
            }
        });

        dialog.open();
    }
});
