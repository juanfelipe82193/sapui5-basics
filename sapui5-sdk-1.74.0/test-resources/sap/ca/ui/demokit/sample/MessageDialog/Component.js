jQuery.sap.declare("sap.ca.ui.sample.MessageDialog.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.MessageDialog.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.MessageDialog.MessageHandling",
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
                    "MessageHandling.view.xml",
                    "MessageHandling.controller.js"
                ]
            }
        }
    }
});