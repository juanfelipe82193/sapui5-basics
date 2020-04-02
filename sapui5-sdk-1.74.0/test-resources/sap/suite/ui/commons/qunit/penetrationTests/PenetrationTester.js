/*global QUnit,sinon*/
/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/base/ManagedObjectMetadata"
], function (BaseObject, ManagedObjectMetadata) {
	var PenetrationTester = BaseObject.extend("test.sap.suite.ui.commons.qunit.penetrationTests.PenetrationTester", {
		constructor: function (sContentId) {
			this._sContentId = sContentId || "content";
		}
	});

	var PROPERTY_TEST_VECTORS = [
		"\"><script>window.penetrationPassed()</script><div id=\"something",
		"'><script>window.penetrationPassed()</script><div id='something",
		"\xfe\x22><script>window.penetrationPassed()</script><div id=\xfe\x22something",
		"\xfe\x27><script>window.penetrationPassed()</script><div id=\xfe\x27something"
	];
	var AGGREGATION_TEST_VECTORS = [
		"<script>window.penetrationPassed()</script>",
		"\xfe\x3cscript\x3ewindow.penetrationPassed()\xfe\x3c/script\x3e"
	];

	function defaultConstructor(oComponentClass, oElement, oString) {
		var oMetadata = {};
		oMetadata[oElement.name] = oString;
		return new oComponentClass(oMetadata);
	}

	PenetrationTester.prototype.getTestObjects = function (oMetadata) {
		var aTestObjects = [];
		var mProperties = oMetadata.getAllProperties();
		for (var sKey in mProperties) {
			if (mProperties[sKey].type === "string" || mProperties[sKey].type === "sap.ui.core.URI") {
				aTestObjects.push(mProperties[sKey]);
			}
		}
		var mAggregations = oMetadata.getAllAggregations();
		for (var sKey in mAggregations) {
			if (mAggregations[sKey].altTypes && mAggregations[sKey].altTypes.indexOf("string") >= 0) {
				aTestObjects.push(mAggregations[sKey]);
			}
		}
		return aTestObjects;
	};

	PenetrationTester.prototype.buildTest = function (oComponentClass, oTestObject, sValue, fnConstructor) {
		QUnit.test("Test " + oTestObject.name + " = " + sValue, function (assert) {
			var oObject;
			try {
				oObject = fnConstructor(oComponentClass, oTestObject, sValue);
			} catch (ex) {
				assert.ok("Penetration caught in setter.");
				return;
			}
			try {
				oObject.placeAt("content");
				sap.ui.getCore().applyChanges();
				assert.notOk(window.penetrationError, "Injection test for property " + oTestObject.name);
			} catch (ex) {
				assert.ok(false, "Rendering failed with: " + ex);
			}
			oObject.destroy();
		});
	};

	PenetrationTester.prototype.testComponent = function (oComponentClass, fnConstructor) {
		fnConstructor = fnConstructor || defaultConstructor;
		var oMetadata = oComponentClass.getMetadata();
		QUnit.module(oMetadata.getName(), {
			beforeEach: function () {
				window.penetrationError = false;
				window.penetrationPassed = function () {
					window.penetrationError = true;
				};
			},
			afterEach: function () {
				delete window.penetrationError;
				delete window.penetrationPassed;
			}
		});
		var aTestObjects = this.getTestObjects(oMetadata);
		aTestObjects.forEach(function (oTestObject) {
			var aVectors;
			if (oTestObject instanceof ManagedObjectMetadata.prototype.metaFactoryProperty) {
				aVectors = PROPERTY_TEST_VECTORS;
			} else {
				aVectors = AGGREGATION_TEST_VECTORS;
			}
			aVectors.forEach(function (sValue) {
				this.buildTest(oComponentClass, oTestObject, sValue, fnConstructor);
			}.bind(this));
		}.bind(this));
	};

	PenetrationTester.prototype.buildTestForObject = function (oTestObject) {
		QUnit.test(oTestObject.key , function (assert) {
			var oObject;

			oObject = oTestObject.object;

			try {
				oObject.placeAt("content");
				sap.ui.getCore().applyChanges();
				assert.notOk(window.penetrationError, "Injection test for property " + oTestObject.key);
			} catch (ex) {
				assert.ok(false, "Rendering failed with: " + ex);
			}

			oObject.destroy();
		});
	};

	PenetrationTester.prototype.testComponentRecursive = function(oComponentClass, mConstructors) {
		var oMetadata = oComponentClass.getMetadata();

		QUnit.module(oMetadata.getName(), {
			beforeEach: function () {
				window.penetrationError = false;
				window.penetrationPassed = function () {
					window.penetrationError = true;
				};
			},
			afterEach: function () {
				delete window.penetrationError;
				delete window.penetrationPassed;
			}
		});

		var aTestObjects = this.buildComponentRecursive(oComponentClass, mConstructors);

		aTestObjects.forEach(function(oTestObject) {
			this.buildTestForObject(oTestObject);
		}, this);

	};

	var SKIP_CLASSES = ["sap.ui.core.Control", "sap.ui.core.Element", "sap.ui.core.CustomData", "sap.ui.core.LayoutData"];

	PenetrationTester.prototype.buildComponentRecursive = function(oComponentClass, mConstructors, aFormerClasses, sName) {
		aFormerClasses = aFormerClasses || [];
		sName = sName || "";
		var oMetadata = oComponentClass.getMetadata();
		var sClassName = oMetadata.getName();
		var sNewName = sName ? sName + "->" : sName;
		var oObj;
		var aTestObjects = [];

		aFormerClasses.push(sClassName);

		var fnCreateInstance = function(oComponentClass, oObj, vValue) {
			return (Object.keys(mConstructors).indexOf(sClassName) >= 0) ? mConstructors[sClassName](oComponentClass, oObj, vValue) : defaultConstructor(oComponentClass, oObj, vValue);
		};

		var mProperties = oMetadata.getAllProperties();
		Object.keys(mProperties).forEach(function(sKey) {
			oObj = mProperties[sKey];

			if (oObj.type === "string" || oObj.type === "sap.ui.core.URI") {
				PROPERTY_TEST_VECTORS.forEach(function(sVector) {
					aTestObjects.push({
							object: fnCreateInstance(oComponentClass, oObj, sVector),
							key: sNewName + sKey + ": " + sVector
						}
					);
				});
			}
		}, this);

		var mAggregations = oMetadata.getAllAggregations();
		Object.keys(mAggregations).forEach(function(sKey) {
			oObj = mAggregations[sKey];

			if (oObj.altTypes && oObj.altTypes.indexOf("string") >= 0) {
				AGGREGATION_TEST_VECTORS.forEach(function(sVector) {
					aTestObjects.push({
							object: fnCreateInstance(oComponentClass, oObj, sVector),
							key: sNewName + sKey + ": " + sVector
						}
					);
				});
			} else {
				var sType = mAggregations[sKey].type;

				if (aFormerClasses.indexOf(sType) < 0 && SKIP_CLASSES.indexOf(sType) < 0) {
					jQuery.sap.require(sType.replace(/\./g,"/"));
					var oNewClass = eval(sType); // eslint-disable-line no-eval

					var aChildObjects = this.buildComponentRecursive(oNewClass, mConstructors, aFormerClasses, sNewName + sKey);
					aChildObjects.forEach(function(oChild) {
						var oCreatedObject = fnCreateInstance(oComponentClass, oObj, oChild.object);
						aTestObjects.push({
							object: oCreatedObject,
							key: oChild.key
						});
					});
				}
			}
		}, this);

		return aTestObjects;
	};

	return PenetrationTester;
});
