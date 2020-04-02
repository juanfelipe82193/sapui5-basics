jQuery.sap.declare("sap.ca.ui.sample.Hierarchy.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.Hierarchy.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.Hierarchy.Hierarchy",
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
                    "Hierarchy.view.xml",
                    "Hierarchy.controller.js"
                ]
            }
        }
    }
});