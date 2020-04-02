jQuery.sap.declare("sap.ca.ui.sample.HierarchicalSelectDialog.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.HierarchicalSelectDialog.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.HierarchicalSelectDialog.HierarchicalSelectDialog",
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
                    "HierarchicalSelectDialog.view.xml",
                    "HierarchicalSelectDialog.controller.js"
                ]
            }
        }
    }
});