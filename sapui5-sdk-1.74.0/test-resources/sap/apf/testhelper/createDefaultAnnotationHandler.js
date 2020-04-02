jQuery.sap.declare("sap.apf.testhelper.createDefaultAnnotationHandler");
jQuery.sap.require("sap.apf.core.utils.annotationHandler");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.utils.fileExists");
(function() {
	'use strict';
	sap.apf.testhelper.createDefaultAnnotationHandler = function() {
		var injectAnnotationHandler = {
				functions : {
					getSapSystem : function() { return undefined; },
					getComponentNameFromManifest : sap.apf.utils.getComponentNameFromManifest,
					getODataPath : sap.apf.core.utils.uriGenerator.getODataPath,
					getBaseURLOfComponent : sap.apf.core.utils.uriGenerator.getBaseURLOfComponent,
					addRelativeToAbsoluteURL : sap.apf.core.utils.uriGenerator.addRelativeToAbsoluteURL
				},
				instances : {
					fileExists : new sap.apf.core.utils.FileExists()
				}
		};
		return new sap.apf.core.utils.AnnotationHandler(injectAnnotationHandler);
	};
}());