jQuery.sap.declare("sap.ca.ui.sample.FileUpload.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.FileUpload.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.FileUpload.FileUpload",
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
                    "FileUpload.view.xml",
                    "FileUpload.controller.js"
                ]
            }
        }
    }
});