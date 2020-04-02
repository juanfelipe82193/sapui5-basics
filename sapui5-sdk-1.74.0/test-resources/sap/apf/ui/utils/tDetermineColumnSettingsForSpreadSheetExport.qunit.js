
jQuery.sap.require("sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport");

(function() {
	"use strict";

QUnit.module("Test Export Settings");

QUnit.test("WHEN no metadata is supplied", function(assert){
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("decimalProperty");
	assert.deepEqual(result, {}, "THEN no settings are given");
});
QUnit.test("WHEN property has type Edm.Int32", function(assert){
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				assert.equal(propertyName, "integerProperty");
				return {
					dataType : { type : "Edm.Int32" }
				};
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("integerProperty", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.Number, "THEN number type returned");
	assert.equal(result.scale, 0, "THEN scale is 0");
});
QUnit.test("WHEN property has type Edm.Decimal AND no sap:unit", function(assert){
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				assert.equal(propertyName, "decimalProperty");
				return {
					dataType : { type : "Edm.Decimal" },
					precision : "12",
					scale: "3"
				};
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("decimalProperty", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.Number, "THEN number type returned");
	assert.equal(result.scale, 3, "THEN scale as expected");
	assert.equal(result.precision, 12, "THEN precision as expected");
});
QUnit.test("WHEN property has type Edm.Decimal AND sap:unit", function(assert){
	assert.expect(5);
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				if (propertyName === "decimalProperty") {
					assert.ok(true, "metadata for decimalProperty has been requested");
					return {
						dataType : { type : "Edm.Decimal" },
						precision : "12",
						scale: "3",
						"sap:unit" : "Currency"
					};
				}
				if (propertyName === "Currency") {
					assert.ok(true, "metadata for Currency has been requested");

					return {
						dataType : { type : "Edm.String" },
						"sap:semantics" : "currency-code"
					};
				}
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("decimalProperty", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.Currency, "THEN currency type returned");
	assert.equal(result.scale, 3, "THEN scale as expected");
	assert.equal(result.precision, 12, "THEN precision as expected");
});
QUnit.test("WHEN property has type Edm.DateTime AND no display format as date", function(assert){
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				assert.equal(propertyName, "dateProperty");
				return {
					dataType : { type : "Edm.DateTime" }
				};
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("dateProperty", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.DateTime, "THEN date time type returned");
});
QUnit.test("WHEN property has type Edm.DateTimeOffset", function(assert){
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				assert.equal(propertyName, "dateProperty");
				return {
					dataType : { type : "Edm.DateTimeOffset" }
				};
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("dateProperty", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.DateTime, "THEN date time type returned");
});
QUnit.test("WHEN property has type Edm.DateTime AND display format as date", function(assert){
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				assert.equal(propertyName, "dateProperty");
				return {
					dataType : { type : "Edm.DateTime" },
					"sap:display-format" : "Date"
				};
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("dateProperty", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.Date, "THEN date type returned");
});
QUnit.test("WHEN curency code", function(assert){
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				assert.equal(propertyName, "currency");
				return {
					dataType : { type : "Edm.String" },
					"sap:semantics" : "currency-code",
					"MaxLength" : "5"
					
				};
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("currency", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.String, "THEN string type returned");
	assert.equal(result.width, 5, "THEN width as expected");
});
QUnit.test("WHEN Edm.String", function(assert){
	var metadata = {
			getPropertyMetadata : function(propertyName) {
				assert.equal(propertyName, "stringProperty");
				return {
					dataType : { type : "Edm.String" },
					"MaxLength" : "33"
				};
			}
	};
	var result = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport("stringProperty", metadata);
	assert.equal(result.type, sap.ui.export.EdmType.String, "THEN string type returned");
	assert.equal(result.width, 33, "THEN width as expected");
});
}());