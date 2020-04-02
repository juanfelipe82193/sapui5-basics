sap.ui.define(["./js/Customization/Main"], function(customizationImpl) {
    "use strict";

    var vizExtBundle = sap.bi.framework.declareBundle({
        "id" : "com.sap.viz.custom.infoColumn",
        "version" : "1.0.0.0",
        "components" : [{
            "id" : "com.sap.viz.custom.infoColumn",
            "provide" : "sap.viz.impls.customization",
            "instance" : customizationImpl,
            "customProperties" : {
                "name" : "InfoColumn Customization Sample",
                "description" : "CVOM Customization Sample: infoColumn",
                "requires" : [{
                    "id" : "sap.viz.common.core",
                    "version" : "5.7.0"
                }]
            }
        }]
    });
    // register bundle to support Lumira extension framework
    if (sap.bi.framework.getService("sap.viz.aio", "sap.viz.extapi")) {
        return sap.bi.framework.getService("sap.viz.aio", "sap.viz.extapi").core.registerBundle(vizExtBundle);
    } else {
        return vizExtBundle;
    }

});