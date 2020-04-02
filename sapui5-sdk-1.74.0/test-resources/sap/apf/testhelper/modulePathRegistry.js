/*global sap*/

(function(){
	"use strict";

	jQuery.sap.require("sap.apf.testhelper.pathMap");  // declaration only. Should already be loaded since modulePath is not yet set.
	var pathMap = new sap.apf.testhelper.PathMap("test/uilib/", "main/uilib/", "sap.apf");
    pathMap.requireUi5ThirdPartyJFiles(
            [
                "thirdparty/qunit",
                "thirdparty/sinon"
            ]
        );

    pathMap.registerModulePathForTestResource("sap.apf");
    pathMap.registerModulePathForTestResource("sap.apf.testhelper");
    pathMap.registerModulePathForProductiveResource("sap.apf.api");
    pathMap.registerModulePathForProductiveResource("sap.apf.Component");
    pathMap.registerModulePathForProductiveResource("sap.apf.core");
    pathMap.registerModulePathForProductiveResource("sap.apf.modeler");
    pathMap.registerModulePathForProductiveResource("sap.apf.ui");
    pathMap.registerModulePathForProductiveResource("sap.apf.utils");
}());
