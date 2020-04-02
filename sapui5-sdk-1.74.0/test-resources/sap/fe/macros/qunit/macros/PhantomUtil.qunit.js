/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/fe/macros/PhantomUtil"], function(PhantomUtil) {
	"use strict";

	function MyContext(oContext) {
		this.oContext = oContext;
	}

	MyContext.prototype = {
		// simple getObject mock
		getObject: function(sProp) {
			var oContext = this.oContext;

			if (sProp) {
				// _empty is special for testing
				if (oContext._empty && oContext.hasOwnProperty(oContext._empty)) {
					oContext = oContext[oContext._empty];
				}
				// for path navigate in object hierarchy
				sProp.split("/").forEach(function(sProp) {
					oContext = oContext[sProp];
				});
			} else if (oContext._empty) {
				// _empty is used to get context, if sProp is not specified
				oContext = oContext._empty;
			}
			return oContext;
		},
		getPath: function() {
			return "MyPath";
		}
	};

	function MyNode(oNode) {
		this.oNode = oNode;
	}

	MyNode.prototype = {
		hasAttribute: function(sKey) {
			return this.oNode.hasOwnProperty(sKey);
		},
		setAttribute: function(sKey, sValue) {
			this.oNode[sKey] = sValue;
		},
		testGetAttribute: function(sKey) {
			return this.oNode[sKey];
		}
	};

	function validateMacroSignature(oMetadata, oContexts, oNode) {
		var sError = "";

		try {
			PhantomUtil.register._validateMacroSignature("MyMacro", oMetadata, oContexts, oNode);
		} catch (e) {
			sError = String(e);
		}
		return sError;
	}

	QUnit.module("Unit Test for PhantomUtil", {
		beforeEach: function() {}
	});

	QUnit.test("Test without metadataContexts", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {}
			},
			oContexts = {
				entitySet: new MyContext({})
			},
			oContexts2 = {
				entitySet: new MyContext({
					$kind: "EntitySet"
				})
			};

		sError = validateMacroSignature(oMetadata, oContexts, null);
		assert.strictEqual(sError, "", "entitySet");

		sError = validateMacroSignature(oMetadata, oContexts2, null);
		assert.strictEqual(sError, "", "entitySet with $kind EntitySet");
	});

	QUnit.test("Test with metadataContext EntitySet as object", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {
					entitySet: {
						$kind: "EntitySet"
					}
				}
			},
			oContexts = {
				entitySet: new MyContext({
					$kind: "EntitySet"
				})
			},
			oContextsWithPath = {
				entitySet: new MyContext({
					$Path: {
						$kind: "EntitySet"
					}
				})
			};

		sError = validateMacroSignature(oMetadata, oContexts, null);
		assert.strictEqual(sError, "", "entitySet: $kind EntitySet");

		sError = validateMacroSignature(oMetadata, oContextsWithPath, null);
		assert.strictEqual(sError, "", "entitySet: $Path/$kind EntitySet");

		oMetadata.metadataContexts.entitySet.$kind = "NavigationProperty";
		sError = validateMacroSignature(oMetadata, oContexts, null);
		assert.strictEqual(
			sError,
			"Error: MyMacro: 'entitySet' must be '$kind' 'NavigationProperty' but is 'EntitySet': MyPath",
			"Test EntitySet with unexpected $kind NavigationProperty"
		);

		oMetadata.metadataContexts.entitySet.$kind = ["EntitySet", "NavigationProperty"];
		sError = validateMacroSignature(oMetadata, oContexts, null);
		assert.strictEqual(sError, "", "entitySet: $kind EntitySet or NavigationProperty");
	});

	QUnit.test("Test with metadataContext Property as string", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {
					property: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					}
				}
			},
			oContexts = {
				property: new MyContext({
					_empty: "SalesOrder",
					"SalesOrder": {
						$kind: "Property"
					}
				})
			},
			oContexts2 = {
				property: new MyContext({
					_empty: "Link2Map"
				})
			};

		sError = validateMacroSignature(oMetadata, oContexts, null);
		assert.strictEqual(sError, "", "entitySet: $kind Property via SalesOrder as string");

		sError = validateMacroSignature(oMetadata, oContexts2, null);
		assert.strictEqual(sError, "", "entitySet: No check for $kind Property as string: Link2Map");
	});

	QUnit.test("Test with metadataContext required property which is missing", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {
					property: {
						type: "sap.ui.model.Context",
						required: true
					}
				}
			},
			oContexts = {};

		sError = validateMacroSignature(oMetadata, oContexts, null);
		assert.strictEqual(
			sError,
			"Error: MyMacro: Required metadataContext 'property' is missing",
			"metadataContext: missing required property"
		);
	});

	QUnit.test("Test other properties", function(assert) {
		var sError,
			oMetadata = {
				properties: {
					property1: {}
				}
			},
			oNode = new MyNode({
				property1: "value1"
			}),
			oNode2 = new MyNode({});

		sError = validateMacroSignature(oMetadata, null, oNode);
		assert.strictEqual(sError, "", "ok");

		oMetadata.properties.property1.required = true;
		sError = validateMacroSignature(oMetadata, null, oNode2);
		assert.strictEqual(sError, "Error: MyMacro: Required property 'property1' is missing", "required property which is missing");
	});

	QUnit.test("Unit test with multiple contexts and properties", function(assert) {
		var sError,
			oContexts = {
				entitySet: new MyContext({
					$kind: "EntitySet",
					path: "/entitySet1"
				}),
				property: new MyContext({
					$kind: "Property",
					path: "/property1"
				}),
				requiredProperty: new MyContext({
					$kind: "Property",
					path: "/requiredProperty1",
					required: true
				}),
				propertyWithKindInPath: new MyContext({
					$Path: {
						$kind: "Property"
					},
					path: "/propertyWithKindInPath"
				})
			},
			oMetadata = {
				metadataContexts: {
					entitySet: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "EntitySet"
					},
					property: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					},
					requiredProperty: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					},
					propertyWithKindInPath: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					}
				},
				properties: {
					id: {
						type: "string"
					},
					idPrefix: {
						type: "string",
						defaultValue: "VH"
					},
					displayHeader: {
						type: "boolean",
						defaultValue: true
					},
					required1: {
						type: "string",
						required: true
					}
				}
			},
			oNode = new MyNode({
				displayHeader: false,
				required1: ""
			});

		sError = validateMacroSignature(oMetadata, oContexts, oNode);
		assert.strictEqual(sError, "", "Test: ok");
		assert.strictEqual(oNode.testGetAttribute("idPrefix"), "VH", "idPrefix: default value 'VH' is set");
		assert.strictEqual(oNode.testGetAttribute("displayHeader"), false, "displayHeader: value 'false' is kept");
	});
});
