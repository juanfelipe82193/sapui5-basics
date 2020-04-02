jQuery.sap.declare("sap.ca.ui.sample.OverviewTile.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.OverviewTile.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.OverviewTile.OverviewTile",
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
                    "OverviewTile.view.xml",
                    "OverviewTile.controller.js"
                ]
            }
        }
    }
});