define([], 
    function(controller) {
        return {
            createPage: function() {

                sap.ui.localResources("js");
                jQuery.sap.registerModulePath("util", "./js/util");
                jQuery.sap.require("util");
                jQuery.sap.registerModulePath("CONSTANT", "./js/constant");
                jQuery.sap.require("CONSTANT");
                
                var view = sap.ui.view({id:"framework", viewName:"js.framework", type:sap.ui.core.mvc.ViewType.JS});
                view.placeAt("content");
            }
        }
});
