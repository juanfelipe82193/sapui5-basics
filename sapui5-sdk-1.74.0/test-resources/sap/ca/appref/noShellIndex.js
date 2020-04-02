/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.define([
	"sap/ui/core/Component",
	"sap/ui/core/ComponentContainer"
], function (Component, ComponentContainer) {
	"use strict";

	// difference 2/2 with real app: path to the sap.ca.ui lib
	var vizDefine = window.define;
	window.define = function(qname, deps, factory){
		if (Object.prototype.toString.call(qname) === "[object Function]"){
			var obj = qname();
			window[obj.name] = obj;
		}
		vizDefine(arguments);
	};

	Component.activateCustomizing("i2d.qm.qualityissue.confirm.appref");

	sap.ui.getCore().attachInitEvent(function () {
		new ComponentContainer({
			height : "100%",
			name:"i2d.qm.qualityissue.confirm.appref"
		}).placeAt("content");
	});
});
