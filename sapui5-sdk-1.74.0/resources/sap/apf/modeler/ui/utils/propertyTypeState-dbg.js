/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/nullObjectChecker'
	],
	function(mNullObjectChecker) {
		'use strict';

		function constructor() {
			this.aProperties = [];
			this.aPropertyTypeViewIds = [];
		}
		constructor.prototype.constructor = constructor;
		constructor.prototype.addProperty = function(sProperty) {
			if (!mNullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sProperty)) {
				return;
			}
			this.aProperties.push(sProperty);
		};
		constructor.prototype.addPropertyAt = function(sProperty, nIndex) {
			if (!mNullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sProperty)) {
				return;
			}
			if (nIndex > this.aProperties.length && nIndex >= 0) {
				return;
			}
			this.aProperties.splice(nIndex, 0, sProperty);
		};
		constructor.prototype.updatePropertyAt = function(sNewProperty, nIndex) {
			if (!mNullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sNewProperty)) {
				return;
			}
			if (nIndex > this.aProperties.length && nIndex >= 0) {
				return;
			}
			this.aProperties[nIndex] = sNewProperty;
		};
		constructor.prototype.removePropertyAt = function(nIndex) {
			if (nIndex > this.aProperties.length && nIndex >= 0) {
				return;
			}
			this.aProperties.splice(nIndex, 1);
		};
		constructor.prototype.removeAllProperties = function() {
			this.aProperties.splice(0, this.aProperties.length);
		};
		constructor.prototype.isPropertyPresentExactlyOnce = function(sProperty) {
			var nIndex, nCounter = 0;
			for(nIndex = 0; nIndex < this.aProperties.length; nIndex++) {
				if (this.aProperties[nIndex] === sProperty) {
					nCounter++;
				}
			}
			if (nCounter === 1) {
				return true;
			}
			return false;
		};
		constructor.prototype.getPropertyValueState = function() {
			return this.aProperties;
		};
		constructor.prototype.addPropertyTypeViewId = function(sViewId) {
			if (!mNullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sViewId)) {
				return;
			}
			this.aPropertyTypeViewIds.push(sViewId);
		};
		constructor.prototype.addPropertyTypeViewIdAt = function(sViewId, nIndex) {
			if (!mNullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sViewId)) {
				return;
			}
			if (nIndex > this.aProperties.length && nIndex >= 0) {
				return;
			}
			this.aPropertyTypeViewIds.splice(nIndex, 0, sViewId);
		};
		constructor.prototype.removePropertyTypeViewIdAt = function(nIndex) {
			if (nIndex > this.aProperties.length && nIndex >= 0) {
				return;
			}
			this.aPropertyTypeViewIds.splice(nIndex, 1);
		};
		constructor.prototype.removeAllPropertyTypeViewIds = function() {
			this.aPropertyTypeViewIds.splice(0, this.aPropertyTypeViewIds.length);
		};
		constructor.prototype.indexOfPropertyTypeViewId = function(sViewId) {
			return this.aPropertyTypeViewIds.indexOf(sViewId);
		};
		constructor.prototype.getViewAt = function(nIndex) {
			if (!mNullObjectChecker.checkIsNotNullOrUndefinedOrBlank(nIndex)) {
				return;
			}
			return sap.ui.getCore().byId(this.aPropertyTypeViewIds[nIndex]);
		};

		return constructor;
	});