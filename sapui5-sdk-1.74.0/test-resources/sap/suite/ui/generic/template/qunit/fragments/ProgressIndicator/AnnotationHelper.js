sap.ui.define([
	"sap/suite/ui/generic/template/js/AnnotationHelper"
], function(AnnotationHelper) {
	"use strict";
 
	var SmartTemplatesAnnotationHelper = AnnotationHelper;
	SmartTemplatesAnnotationHelper.getNavigationPathWithExpand = function(oInterface, oContext, oEntitySetContext){
		return "{}";
	};
	
	return SmartTemplatesAnnotationHelper;
}, /* bExport= */ true);