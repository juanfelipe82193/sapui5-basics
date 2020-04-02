jQuery.sap.declare("sap.ushell.sample.AddBookmarkButton.Component");

sap.ui.core.UIComponent.extend("sap.ushell.sample.AddBookmarkButton.Component", {

    metadata : {
        rootView : "sap.ushell.sample.AddBookmarkButton.AddBookmarkSample",
        includes : [],
        dependencies : {
            libs : [
                "sap.ushell"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "AddBookmarkSample.view.xml"
                ]
            }
        }
    }
});