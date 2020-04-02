/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ----------------------------------------------------------------------------------
// Provides base class sap.fe.AppComponent for all generic app components
// ----------------------------------------------------------------------------------
sap.ui.define(["sap/fe/core/AppComponent", "sap/base/Log"], function(CoreAppComponent, Log) {
	"use strict";

	/**
	 * @classname "sap.fe.AppComponent"
	 * @private
	 * @deprecated please use sap.fe.core.AppComponent instead
	 */
	return CoreAppComponent.extend("sap.fe.AppComponent", {
		init: function() {
			Log.error('This class of the AppComponent is deprecated, please use "sap.fe.core.AppComponent" instead');
			CoreAppComponent.prototype.init.apply(this, arguments);
		}
	});
});
