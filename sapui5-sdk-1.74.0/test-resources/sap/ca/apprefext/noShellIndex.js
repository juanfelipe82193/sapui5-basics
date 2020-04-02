/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.define([
	"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";
	sap.ui.getCore().attachInitEvent(function () {
		new ComponentContainer({
			height : "100%",
			name:"i2d.qm.qualityissue.confirm.apprefExt"
		}).placeAt("content");
	});
});
