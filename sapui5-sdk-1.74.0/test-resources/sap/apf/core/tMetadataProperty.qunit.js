jQuery.sap.require("sap.apf.core.metadataProperty");

(function() {
	'use strict';

	QUnit.module('MetadataProperty', {
		beforeEach : function(assert) {
		}
	});

	QUnit.test('Simple initialization', function(assert) {
		var oAttributes = {
			"attrName1" : "attrVal1",
			"attrName2" : "attrVal2"
		};

		var oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributes);
		assert.equal(oMetadataProperty.attrName1, "attrVal1", "Attribute 'attrVal1' has correct value");
		assert.equal(oMetadataProperty.attrName2, "attrVal2", "Attribute 'attrVal2' has correct value");
	});

	QUnit.test('Get attribute', function(assert) {
		var oAttributes = {
			"attrName1" : "attrVal1",
			"attrName2" : "attrVal2"
		};
		var oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributes);
		assert.equal(oMetadataProperty.getAttribute("attrName1"), "attrVal1", "Attribute value successfully returned");
		assert.equal(oMetadataProperty.getAttribute("nonExistingAttribute"), undefined, "getAttribute() returns undefined for a non existing attribute");
	});

	QUnit.test('Check for key', function(assert) {
		var oMetadataProperty;
		var oAttributes = {
			"attrName1" : "attrVal1",
			"attrName2" : "attrVal2"
		};
		var oAttributesIsKey = {
			"attrName1" : "attrVal1",
			"isKey" : true
		};

		oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributes);
		assert.equal(oMetadataProperty.isKey(), false, "If property is no key, isKey() returns false");

		oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributesIsKey);
		assert.equal(oMetadataProperty.isKey(), true, "If property is key, isKey() returns true");
	});

	QUnit.test('Check for parameter key property', function(assert) {
		var oMetadataProperty;
		var oAttributes = {
			"attrName1" : "attrVal1",
			"attrName2" : "attrVal2"
		};
		var oAttributesisParameterEntitySetKeyProperty = {
			"attrName1" : "attrVal1",
			"isParameterEntitySetKeyProperty" : true
		};

		oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributes);
		assert.equal(oMetadataProperty.isParameterEntitySetKeyProperty(), false, "If property is no parameter key property, isParameterEntitySetKeyProperty() returns false");

		oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributesisParameterEntitySetKeyProperty);
		assert.equal(oMetadataProperty.isParameterEntitySetKeyProperty(), true, "If property is parameter key property, isParameterEntitySetKeyProperty() returns true");
	});

	QUnit.test('Check wrong usage and error behaviour', function(assert) {
		var oMetadataProperty;
		var oAttributesWrongKey = {
			"attrName1" : "attrVal1",
			"isKey" : "noBooleanTrue"
		};
		oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributesWrongKey);
		assert.equal(oMetadataProperty.isKey(), false, "If attribute name 'isKey' is not boolean true, then isKey() returns false");

		var oAttributesWrongParameterEntitySetKeyProperty = {
			"attrName1" : "attrVal1",
			"isParameterEntitySetKeyProperty" : "noBooleanTrue"
		};
		oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributesWrongParameterEntitySetKeyProperty);
		assert.equal(oMetadataProperty.isParameterEntitySetKeyProperty(), false, "If attribute name 'isParameterEntitySetKeyProperty' is not boolean true, then isParameterEntitySetKeyProperty() returns false");

		var oAttributesOverwriteFunction = {
			"attrName1" : "attrVal1",
			"getAttribute" : "overwriteFunction"
		};
		oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributesOverwriteFunction);
		assert.ok(typeof oMetadataProperty.getAttribute === "function", "If a metadata attribute has the name of a MetadataProperty method (e.g. getAttribute), it will not be overwritten");

		assert.equal(oMetadataProperty.getAttribute("isKey"), undefined, "If parameter for getAttribute() is a method of MetadataProperty (e.g. isKey), undefined is returend");

		var oNoAttributes = {};
		oMetadataProperty = new sap.apf.core.MetadataProperty(oNoAttributes);
		assert.equal(oMetadataProperty.isKey(), false, "MetadataProperty is robust if it is created using an empty object as parameter");

		oMetadataProperty = new sap.apf.core.MetadataProperty(undefined);
		assert.equal(oMetadataProperty.isKey(), false, "MetadataProperty is robust if it is created using 'undefined' as parameter");
	});
	QUnit.test('Clone', function(assert) {
		var oAttributes = {
			"attrName1" : "attrVal1",
			"attrName2" : "attrVal2",
			"isKey" : true,
			"isParameterEntitySetKeyProperty" : true,
			"dataType" : {
				"attrName3" : "attVal3",
				"attrName4" : "attVal4"
			}
		};

		var oMetadataProperty = new sap.apf.core.MetadataProperty(oAttributes);
		var clone = oMetadataProperty.clone();
		
		assert.equal(clone.isKey(), oMetadataProperty.isKey(), "Key function is ok");
		assert.equal(clone.isParameterEntitySetKeyProperty(), oMetadataProperty.isParameterEntitySetKeyProperty(), "isParameterEntitySetKeyProperty function is ok");
		var attribute;
		for (attribute in oMetadataProperty) {
			if (typeof oMetadataProperty[attribute] === 'function' ) {
				continue;
			}
			assert.equal(clone[attribute], oMetadataProperty[attribute], "THEN attribute " + attribute + "is equal");
		}
	});
}());