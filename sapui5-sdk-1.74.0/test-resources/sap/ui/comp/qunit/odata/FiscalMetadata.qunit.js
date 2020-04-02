/* global QUnit */
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/odata/FiscalMetadata"
	], function (FiscalMetadata) {
		QUnit.module("FiscalMetadata", {
			beforeEach: function () {
				this.aAnnotations = [
					"com.sap.vocabularies.Common.v1.IsFiscalYear",
					"com.sap.vocabularies.Common.v1.IsFiscalPeriod",
					"com.sap.vocabularies.Common.v1.IsFiscalYearPeriod",
					"com.sap.vocabularies.Common.v1.IsFiscalQuarter",
					"com.sap.vocabularies.Common.v1.IsFiscalYearQuarter",
					"com.sap.vocabularies.Common.v1.IsFiscalWeek",
					"com.sap.vocabularies.Common.v1.IsFiscalYearWeek",
					"com.sap.vocabularies.Common.v1.IsDayOfFiscalYear",
					"com.sap.vocabularies.Common.v1.IsFiscalYearVariant"
				];
			},
			afterEach: function () {
				this.aAnnotations = null;
			}
		});

		QUnit.test("Should check if the value is fiscal anotation type", function (assert) {
			for (var i = 0; i < this.aAnnotations.length; i++) {
				var oStettings = {}, element = this.aAnnotations[i];
				oStettings[element] = {
					Bool: true
				};
				assert.strictEqual(FiscalMetadata.isFiscalValue(oStettings), true);
			}
		});

		QUnit.test("Should get fiscal anotation type", function (assert) {
			for (var i = 0; i < this.aAnnotations.length; i++) {
				var oStettings = {}, element = this.aAnnotations[i];
				oStettings[element] = {
					Bool: true
				};
				assert.strictEqual(FiscalMetadata.getFiscalAnotationType(oStettings), element);
			}
		});

		QUnit.start();
	});

})();
