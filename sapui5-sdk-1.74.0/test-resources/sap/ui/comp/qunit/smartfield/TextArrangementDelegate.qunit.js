/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/TextArrangementDelegate"
], function(
	compLibrary,
	TextArrangementDelegate
) {
	"use strict";

	QUnit.module("Text arrangement annotation utilities");

	QUnit.test("calling .getPaths() should return the corrects paths (test case 1)", function(assert) {

		// arrange
		var oMetadata = {
			annotations: {
				text: {
					entityType: {
						key: {
							propertyRef: [{
								name: "IDNavigationProperty"
							}]
						}
					},
					property: {
						typePath: "DescriptionNavigationProperty"
					},
					entitySet: {
						name: "Category"
					}
				}
			}
		};

		// act
		var mTextArrangementPaths = TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.NavigationProperty, oMetadata);

		// assert
		assert.strictEqual(mTextArrangementPaths.keyField, "IDNavigationProperty");
		assert.strictEqual(mTextArrangementPaths.descriptionField, "DescriptionNavigationProperty");
		assert.strictEqual(mTextArrangementPaths.entitySetName, "Category");
	});

	QUnit.test("calling .getPaths() method should return the corrects paths (test case 2)", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				valueListAnnotation: {
					keyField: "IDValueList",
					descriptionField: "DescriptionValueList"
				},
				valueListEntitySet: {
					name: "VL_Suppliers"
				}
			}
		};

		// act
		var mTextArrangementPaths = TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.ValueList, oMetadata);

		// assert
		assert.strictEqual(mTextArrangementPaths.keyField, "IDValueList");
		assert.strictEqual(mTextArrangementPaths.descriptionField, "DescriptionValueList");
		assert.strictEqual(mTextArrangementPaths.entitySetName, "VL_Suppliers");
	});

	QUnit.start();
});
