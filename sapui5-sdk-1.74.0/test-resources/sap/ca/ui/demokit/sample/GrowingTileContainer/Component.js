jQuery.sap.declare("sap.ca.ui.sample.GrowingTileContainer.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.GrowingTileContainer.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.GrowingTileContainer.GrowingTileContainer",
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
                    "GrowingTileContainer.view.xml",
                    "GrowingTileContainer.controller.js",
                    "hierarchicalSelectDialogMetadata.xml"
                ]
            }
        }
    }
});