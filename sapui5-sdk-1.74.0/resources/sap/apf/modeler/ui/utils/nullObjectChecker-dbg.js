/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(function(){
	'use strict';
	/**
	 * @class nullObjectChecker
	 * @memberOf sap.apf.modeler.ui.utils
	 * @name nullObjectChecker
	 * @description helps checking for null undefined or blank objects and strings
	 */
	var nullObjectChecker = {};
	nullObjectChecker.checkIsNotUndefined = function(obj) {
		if (obj === undefined) {
			return false;
		}
		return true;
	};
	nullObjectChecker.checkIsNotNull = function(obj) {
		if (obj === null) {
			return false;
		}
		return true;
	};
	nullObjectChecker.checkIsNotBlank = function(obj) {
		if ((obj instanceof Array) && obj.length === 0) {
			return false;
		}
		if ((obj instanceof Object) && (Object.keys(obj).length === 0)) {
			return false;
		}
		if (obj === "") {
			return false;
		}
		return true;
	};
	nullObjectChecker.checkIsNotNullOrBlank = function(obj) {
		return (this.checkIsNotNull(obj) && this.checkIsNotBlank(obj));
	};
	nullObjectChecker.checkIsNotNullOrUndefined = function(obj) {
		return (this.checkIsNotNull(obj) && this.checkIsNotUndefined(obj));
	};
	nullObjectChecker.checkIsNotUndefinedOrBlank = function(obj) {
		return (this.checkIsNotUndefined(obj) && this.checkIsNotBlank(obj));
	};
	nullObjectChecker.checkIsNotNullOrUndefinedOrBlank = function(obj) {
		return (this.checkIsNotNull(obj) && this.checkIsNotUndefined(obj) && this.checkIsNotBlank(obj));
	};
	return nullObjectChecker;
}, true /* GLOBAL_EXPORT */);