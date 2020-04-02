jQuery.sap.declare("sap.ca.ui.sample.OverflowContainer.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.OverflowContainer.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.OverflowContainer.OverflowContainer",
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
                    "OverflowContainer.view.xml",
                    "OverflowContainer.controller.js"
                ]
            }
        }
    }
});