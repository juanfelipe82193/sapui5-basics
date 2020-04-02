jQuery.sap.declare("sap.ca.ui.sample.ConfirmationDialog.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.ConfirmationDialog.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.ConfirmationDialog.Confirmation",
        dependencies : {
            libs : [
                "sap.m",
                "sap.ca.ui"
            ]
        },
        config : {
            sample : {
                stretch: true,
                files : [
                    "Confirmation.view.xml",
                    "Confirmation.controller.js"
                ]
            }
        }
    }
});