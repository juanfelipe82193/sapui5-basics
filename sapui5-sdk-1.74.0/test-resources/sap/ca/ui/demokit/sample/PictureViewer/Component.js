jQuery.sap.declare("sap.ca.ui.sample.PictureViewer.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.PictureViewer.Component", {

    metadata : {
        rootView : "sap.ca.ui.sample.PictureViewer.PictureViewer",
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
                    "PictureViewer.view.xml",
                    "PictureViewer.controller.js",
                    "test-resources/sap/ui/documentation/sdk/images/large_HT-6100.jpg",
                    "test-resources/sap/ui/documentation/sdk/images/large_HT-1112.jpg",
                    "test-resources/sap/ui/documentation/sdk/images/large_HT-1063.jpg",
                    "test-resources/sap/ui/documentation/sdk/images/large_HT-1073.jpg",
                    "test-resources/sap/ui/documentation/sdk/images/large_HT-1114.jpg",
                    "test-resources/sap/ui/documentation/sdk/images/HT-1138.jpg"
                ]
            }
        }
    }
});