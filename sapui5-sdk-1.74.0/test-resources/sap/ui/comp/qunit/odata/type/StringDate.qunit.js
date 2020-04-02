/*global QUnit*/
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		'sap/ui/comp/odata/type/StringDate'
	], function(StringDate) {

		QUnit.module("Formatting and Parsing", {
			beforeEach: function() {
				//Wed Nov 01 2017 00:00:00 GMT+0100 (W. Europe Standard Time)
				this.oReferenceDate = new Date(1509490800000);
				this.sReferenceDateString = "20171101";
			},
			afterEach: function() {

			}
		});

		QUnit.test("Formatting of the reference date and reference string are equal for no special format settings", function(assert) {
			var oStringDate = new StringDate({});

			var sFormatDate = oStringDate.formatValue(this.oReferenceDate, "string");
			var sFormatDateString = oStringDate.formatValue(this.sReferenceDateString, "string");

			assert.equal(sFormatDate, sFormatDateString, "The formatting of date and string are equal");
		});

		QUnit.test("UTC Settings are ignored on formatting", function(assert) {
			var oStringDate = new StringDate({
				UTC: false
			});

			var sFormatDate = oStringDate.formatValue(this.oReferenceDate, "string");
			var sFormatDateString = oStringDate.formatValue(this.sReferenceDateString, "string");

			assert.equal(sFormatDate, sFormatDateString, "The formatting of date and string are equal");

			oStringDate = new StringDate({
				UTC: true
			});

			var sFormatDateUTC = oStringDate.formatValue(this.oReferenceDate, "string");
			var sFormatDateStringUTC = oStringDate.formatValue(this.sReferenceDateString, "string");

			assert.equal(sFormatDateUTC, sFormatDateStringUTC, "The formatting of date and string are equal");

			assert.equal(sFormatDateString, sFormatDateStringUTC, "Independent of the UTC settings the type always gives the same output");
		});

		QUnit.test("Formatting of the reference date and reference string are equal for short style format settings", function(assert) {
			var oStringDate = new StringDate({
				style: "short"
			});

			var sFormatDate = oStringDate.formatValue(this.oReferenceDate, "string");
			var sFormatDateString = oStringDate.formatValue(this.sReferenceDateString, "string");

			assert.equal(sFormatDate, sFormatDateString, "The formatting of date and string are equal");
		});

		QUnit.test("Parsing a date give the expected result independent from UTC", function(assert) {
			var oStringDate = new StringDate({
				style: "short"
			});

			var sParseDate = oStringDate.parseValue(this.oReferenceDate,"object");
			var sParseDateString = oStringDate.parseValue(this.sReferenceDateString,"string");
			var sParseShortString = oStringDate.parseValue("11/1/17","string");

			assert.equal(sParseDate, this.sReferenceDateString, "From a date we get via parsing the reference string back");
			assert.equal(sParseDateString, this.sReferenceDateString, "Even if we parse the string its self everything works out");
			assert.equal(sParseShortString, this.sReferenceDateString, "Parsing with short type also works out");
		});

		QUnit.start();
	});

})();