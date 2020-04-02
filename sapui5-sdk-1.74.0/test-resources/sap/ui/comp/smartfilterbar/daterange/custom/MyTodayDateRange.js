/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides sap.ui.comp.config.condition.DateRangeType.
sap.ui.define([
		'sap/ui/comp/config/condition/DateRangeType'
	],
	function(DateRangeType) {
		"use strict";

		var MyTodayDateRange = DateRangeType.extend("custom.MyTodayDateRange");


		/**
		 * function to create a new operation for a dynamic int value with a single int value.
		 *
		 * @public
		 * @since 1.60.0
		 * @param {string} sKey unique key for the new operation
		 * @param {string} sTextKey text for the new operation
		 * @param {string} sSingularTextKey singular text for the new operation
		 * @param {string} sCategory category of the operation
		 * @param {int} iDefault the default int value for the operation
		 * @param {[string]]} aDescriptionTextKeys array of two descriptions text (multiple/singular text)
		 * @param {int} iOrder the order value of the new operation in the operations list
		 *
		 * @returns {object} object for the new created operation. The getDateRange on this object must be implemented.
		 */
		MyTodayDateRange.Operation = DateRangeType.createSingleIntRangeOperation(
			"TODAYPLUSMINUSX",
			"Today -/+ {0} days",
			"Today -/+ 1 day",
			"DAY", 3, ["day", "days"],
			0
		);

		/**
		 * function to determine the date values that are used in the filter request.
		 *
		 * Normally the returned values are based on the conditions value1 and value2.
		 *
		 * @public
		 * @since 1.60.0
		 * @param {object} oCondition current DateRange condition (operation, value1, value2)
		 * @param {string} oCondition.operation Name of the custom operation
		 * @param {any} oCondition.value1 value of a condition
		 * @param {any} oCondition.value2 second value of a condition (if exist)
		 *
		 * @returns {[] | null} object with operation and value1, value2 or null if value is not set.
		 */
		MyTodayDateRange.Operation.getDateRange = function(oCondition) {
			if (!oCondition.value1) {
				return null;
			}
			var Today = new Date();
			var fromDate = new Date();
			var toDate = new Date();
			fromDate.setDate(Today.getDate() - oCondition.value1);
			toDate.setDate(Today.getDate() + oCondition.value1);
			return { operation: "BT", value1: fromDate, value2: toDate };
		};

		MyTodayDateRange.prototype.getOperations = function() {
			var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
			aOperations.push(MyTodayDateRange.Operation);
			return aOperations;
		};

		return MyTodayDateRange;
	}, /* bExport= */ true);