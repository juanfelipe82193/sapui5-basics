/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides sap.ui.comp.config.condition.DateRangeType.
sap.ui.define([
	'sap/ui/comp/config/condition/DateRangeType'
],	function(DateRangeType) {
	"use strict";

	var MyAvailabilityRange = DateRangeType.extend("custom.MyAvailabilityRange", /** @lends sap.ui.comp.config.condition.MyAvailabilityRange.prototype */ {
		constructor: function(sFieldName, oFilterProvider, oFieldViewMetadata) {
			DateRangeType.apply(this, [
				sFieldName, oFilterProvider, oFieldViewMetadata
			]);
			this.setAsync(true);
		}
	});
	MyAvailabilityRange.Operations = {};

	MyAvailabilityRange.initializeOperations = function() {
		for (var i = 0; i < 4; i++) {
			MyAvailabilityRange.Operations["CATEGORYPERIOD" + i] = DateRangeType.getFixedRangeOperation(
				"CATEGORYPERIOD" + i,
				{
					key: "CATEGORYPERIOD" + i + "_TEXT_KEY",
					bundle: "sap.ui.comp"
				},
				"CATEGORY");
		}
	};

	MyAvailabilityRange.initializeOperations();

	MyAvailabilityRange.prototype.providerDataUpdated = function(aFieldNames, oData) {
		var sField = "Category";
		if (aFieldNames.indexOf(sField) > -1) {
			var aRanges = oData[sField] ? oData[sField].ranges : null;
			if (aRanges && aRanges.length === 1) {
				if (aRanges[0].operation === "EQ" && aRanges[0].value1 === "Projector") {
					this.setPending(true);
					setTimeout(this.updateCategoryPeriods.bind(this), 2000, [
						[new Date("2010-01-01T00:00:00.000Z"), new Date("2020-01-01T00:00:00.000Z"), "This decade (" + aRanges[0].value1 + ")"],
						[new Date("2000-01-01T00:00:00.000Z"), new Date("2010-01-01T00:00:00.000Z"), "Last decade (" + aRanges[0].value1 + ")"]
					]);
				} else if (aRanges[0].operation === "EQ"){
					this.setPending(true);
					setTimeout(this.updateCategoryPeriods.bind(this), 2000,[
						[new Date("2010-01-01T00:00:00.000Z"), new Date("2020-01-01T00:00:00.000Z"), "This decade (" + aRanges[0].value1 + ")"],
						[new Date("2000-01-01T00:00:00.000Z"), new Date("2010-01-01T00:00:00.000Z"), "Last decade (" + aRanges[0].value1 + ")"],
						[new Date("2011-01-01T00:00:00.000Z"), new Date("2016-01-01T00:00:00.000Z"), "Last 5 years (" + aRanges[0].value1 + ")"]
					]);
				}

			} else {
				this.updateCategoryPeriods();
			}
		}
	};

	MyAvailabilityRange.prototype.updateCategoryPeriods = function (aRanges) {
		for (var i = 0; i < 4; i++) {
			var oFiscalPeriodOperation = MyAvailabilityRange.Operations["CATEGORYPERIOD" + i];
			if (aRanges && aRanges[i]) {
				oFiscalPeriodOperation.languageText = aRanges[i][2];
				oFiscalPeriodOperation.defaultValues = [aRanges[i][0],aRanges[i][1]];
			} else {
				oFiscalPeriodOperation.defaultValues = null;
			}
		}
		this.updateOperations();
		this.setPending(false);
	};

	MyAvailabilityRange.prototype.getDefaultOperation = function() {
		return MyAvailabilityRange.Operations["CATEGORYPERIOD0"];
	};

	MyAvailabilityRange.prototype.getOperations = function() {
		var aOperations = DateRangeType.prototype.getOperations.apply(this,[]);
		for (var i = 0; i < 4; i++) {
			var oFiscalPeriodOperation = MyAvailabilityRange.Operations["CATEGORYPERIOD" + i];
			if (oFiscalPeriodOperation.defaultValues) {
				aOperations.push(oFiscalPeriodOperation);
			}
		}
		return aOperations;
	};

	return MyAvailabilityRange;
}, /* bExport= */true);

