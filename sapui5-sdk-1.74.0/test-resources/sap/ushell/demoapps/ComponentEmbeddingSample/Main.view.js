// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global */

    sap.ui.jsview("sap.ushell.demo.ComponentEmbeddingSample.Main", {

        createContent: function (oController) {

            return new sap.m.Panel("panel", {
                "height": "100%",
                "headerToolbar": new sap.m.Toolbar({
                    "content": [
                        // TODO: make sure to use local IDs
                        new sap.m.Input(this.createId("inputNavigationIntent"), {
                            "placeholder": "Enter a Navigation Intent ..."
                        }),
                        new sap.m.Button({
                            "text": "Go!",
                            "press": oController.handleLoadComponent.bind(oController)
                        }),
                        new sap.m.CheckBox(this.createId("checkBoxAsync"),{
                            "text": "Load Asynchronously"
                        })
                    ]
                }),
                "content": [
                    new sap.ui.core.ComponentContainer(this.createId("componentContainer"), {
                        "name": "sap.ushell.demo.AppPersSample",
                        "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample",
                        "width": "100%",
                        "height": "100%"
                    })
                ]
            });
        },


        /** Specifies the Controller belonging to this View.
         * In the case that it is not implemented, or that "null" is returned, this View does not
         * have a Controller.
         */
        getControllerName: function () {
            return "sap.ushell.demo.ComponentEmbeddingSample.Main";
        }
    });
}());
