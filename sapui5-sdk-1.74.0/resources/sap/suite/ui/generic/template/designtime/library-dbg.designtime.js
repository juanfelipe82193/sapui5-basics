/*!* SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 *
 * Initialization of designtime Code
 */
sap.ui.define(["sap/ui/model/resource/ResourceModel"], function(ResourceModel) {
	"use strict";

	// Create a resource bundle for language specific texts
	var oResourceModel = new ResourceModel({
		bundleName: "sap.suite.ui.generic.template.designtime.messagebundle"
	});
	// Assign the model object to the SAPUI5 core using the name "i18nDesigntime"
	sap.ui.getCore().setModel(oResourceModel, "i18nDesigntime");
	
	return {};
});
