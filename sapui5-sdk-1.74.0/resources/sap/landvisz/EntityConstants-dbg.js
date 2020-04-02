/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/ui/base/Object"
], function(BaseObject) {
	"use strict";

	var EntityConstants = function(){
	};

	EntityConstants.prototype = Object.create(BaseObject.prototype || null);

	EntityConstants.internalEvent = false;

	return EntityConstants;

}, /* bExport = */ true);
