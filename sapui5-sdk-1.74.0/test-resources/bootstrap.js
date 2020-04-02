/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.define([
	"jQuery.sap.global",
	"sap/ui/core/ComponentContainer"
], function (jQuery, ComponentContainer) {
	"use strict";
	/*global sap */

	var appRoot = jQuery.sap.getUriParameters().get("app");
	if (appRoot) {
		appRoot = jQuery.sap.encodeJS(appRoot);
		jQuery.sap.registerModulePath(appRoot, "../");
		sap.ui.getCore().attachInitEvent(function() {
			new ComponentContainer({
				height : "100%",
				name : appRoot
			}).placeAt("content");
		});
	} else {
		alert("please provide your app root path!");
	}
});