jQuery.sap.declare("sap.ca.ui.sample.ForwardDialog.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.ForwardDialog.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.ForwardDialog.Forward",
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
                    "Forward.view.xml",
                    "Forward.controller.js"
                ]
            }
        }
    }
});