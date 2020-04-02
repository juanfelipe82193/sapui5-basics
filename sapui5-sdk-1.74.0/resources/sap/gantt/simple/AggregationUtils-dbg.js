/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

/**
 * AggregationUtils Utility Class
 *
 * @namespace
 * @name sap.gantt.simple
 * @private
 */

// Provides class sap.gantt.simple.AggregationUtils
sap.ui.define(["jquery.sap.global"],
	function(jQuery) {
	"use strict";

	/**
	 * Checks whether the given object is of the given type (given in AMD module syntax)
	 * without the need of loading the types module.
	 *
	 * @param {sap.ui.base.ManagedObject} oObject The object to check
	 * @param {string} sType The type given in AMD module syntax
	 * @return {boolean} true if given object is A instance of given type
	 * @private
	 */
	var isInstanceOf = function(oObject, sType) {
		if (!oObject || !sType) {
			return false;
		}
		return oObject.isA(sType);
	};

	/**
	 * @alias sap.gantt.simple.AggregationUtils
	 * @namespace
	 * @public
	 */
	var AggregationUtils = {

		isParentRowSetting: function(oShape) {
			return oShape.getParent().isA("sap.gantt.simple.GanttRowSettings");
		},

		/**
		 * get parent Control until reach sClassName
		 *
		 * @param {string} sClassName the class name to traverse up
		 * @param {sap.ui.core.Element} oElement shape instance
		 * @returns {object} parent control
		 * @private
		 */
		getParentControlOf : function(sClassName, oElement) {
			if (isInstanceOf(oElement, sClassName)) {
				return oElement;
			}

			var oParent = oElement.getParent(),
				oControl;
			while (oParent && isInstanceOf(oParent, sClassName) === false) {
				oParent = oParent.getParent();
			}
			oControl = oParent;
			return oControl;
		},

		isLazyAggregation: function(oElement) {
			var oParentShape = oElement.getParent();
			if (!oParentShape) { return false; }

			var oAggregation = oParentShape.getMetadata().getAggregation(oElement.sParentAggregationName);
			return this._hasLazyConfiguration(oAggregation);
		},

		/**
		 * Check if the aggregation name <code>sName</code> of element is lazy aggregation or not.
		 *
		 * Return true if sapGanttLazy is defined in the metadata
		 *
		 * @param {object} oElement an instance of <code>sap.gantt.simple.BaseShape</code>
		 * @param {string} sName aggregation Name
		 * @returns {boolean} true: lazy aggregation
		 */
		isLazy : function(oElement, sName) {
			return Object.keys(this.getLazyAggregations(oElement)).indexOf(sName) !== -1;
		},

		/**
		 * Get all lazy aggregations, lazy aggregation will only display when expand a shape in main row.
		 *
		 * @param {sap.gantt.simple.BaseShape} oElement a shape instance
		 * @returns {array} array a list of aggregations
		 */
		getLazyAggregations : function(oElement) {
			return this._filterAggregationBy(oElement, function(oAggregation) {
				return AggregationUtils._hasLazyConfiguration(oAggregation);
			});
		},

		/**
		 * Filter out the lazied child aggregation instances which has specified scheme name.
		 *
		 * @param {sap.gantt.simple.BaseShape} oElement an instance of BaseShape
		 * @param {string} sShapeScheme name of property scheme defined in the BaseShape
		 * @returns {sap.gantt.simple.BaseShape} an array of instances
		 */
		getLazyElementsByScheme: function(oElement, sShapeScheme) {
			var mAggregations = this.getLazyAggregations(oElement);
			var aChildElements = [];
			Object.keys(mAggregations).forEach(function(sName) {
				var aChild = oElement.getAggregation(sName);
				if (aChild && !jQuery.isArray(aChild)) {
					aChild = [aChild];
				}
				if (aChild && aChild.length > 0 && aChild[0].getScheme() === sShapeScheme) {
					aChildElements.push(aChild);
				}
			});
			return [].concat.apply([], aChildElements);
		},

		_hasLazyConfiguration: function(oAggregation) {
			return oAggregation.appData && oAggregation.appData.sapGanttLazy === true;
		},

		/**
		 * Get normal aggregations instaces out of the parent shape instance.
		 *
		 * @param {sap.gantt.simple.BaseShape} oElement a shape instance
		 * @returns {array} a list of non lazied aggregation instances
		 */
		getNonLazyAggregations : function(oElement) {
			return this._filterAggregationBy(oElement, function(oAggregation) {
				return oAggregation.appData === null || !oAggregation.appData.sapGanttLazy;
			});
		},

		_filterAggregationBy : function(oElement, fnCallback) {
			var oMetadata = oElement.getMetadata(),
				mAggregations = oMetadata.getAggregations();

			var mResult = {};
			for (var sName in mAggregations) {
				if (mAggregations.hasOwnProperty(sName)) {
					var oAggregation = mAggregations[sName];
					if (fnCallback(oAggregation)) {
						mResult[sName] = oAggregation;
					}
				}
			}
			return mResult;
		},

		eachNonLazyAggregation : function(oElement, fnCallback) {
			var mAggregations = this.getNonLazyAggregations(oElement);

			var aKeySorted = Object.keys(mAggregations).sort(function(a, b){
				var ordera = mAggregations[a].appData ? (mAggregations[a].appData.sapGanttOrder || 0) : 0;
				var orderb = mAggregations[b].appData ? (mAggregations[b].appData.sapGanttOrder || 0) : 0;
				return ordera - orderb;
			});

			aKeySorted.forEach(function(sName){
				var oAggregation = mAggregations[sName];
				var aChild = oElement[oAggregation._sGetter]();
				if (jQuery.isArray(aChild)) {
					aChild.forEach(function(oChild) {
						fnCallback(oChild);
					});
				} else if (aChild){
					fnCallback(aChild);
				}
			});
		}
	};

	return AggregationUtils;

}, /* bExport= */ true);
