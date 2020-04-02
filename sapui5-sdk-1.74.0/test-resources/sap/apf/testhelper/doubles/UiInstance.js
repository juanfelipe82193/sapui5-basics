/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/apf/testhelper/interfaces/IfUiInstance',
	'sap/apf/utils/utils'
], function(IfUiInstance, utils){
	'use strict';

	/**
	 * @description Constructor. Creates as less as possible. The App may be an empty object when sap.m.App is undefined.
	 * @param oInject injected module references
	 */
	var UiInstance = function(oInject) {
		var app = (sap && sap.m && sap.m.App) ? new sap.m.App() : {};

		this.createApplicationLayout = function() {
			return new Promise(function(resolve) {
				resolve(app);
			});
		};

		this.handleStartup = function() {
			return utils.createPromise();
		};
	};

	UiInstance.prototype = new IfUiInstance();
	UiInstance.prototype.constructor = UiInstance;

	UiInstance.prototype.selectionChanged = function() {};

	return UiInstance;
}, true /* global_export*/);
