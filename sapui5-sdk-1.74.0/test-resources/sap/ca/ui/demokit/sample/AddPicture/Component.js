jQuery.sap.declare("sap.ca.ui.sample.AddPicture.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.AddPicture.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.AddPicture.AddPicture",
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
                    "AddPicture.view.xml",
                    "AddPicture.controller.js",
                    "base64.js"
                ]
            }
        }
    }
});