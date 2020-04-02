/**
 * tests for the sap.suite.ui.generic.template.designtime.ObjectPage.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/ObjectPage.designtime",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/lib/testableHelper"
	],
	function(sinon, Utils, ObjectPage, DesigntimeUtils, testableHelper) {
		"use strict";

		QUnit.module("Testing property property function:", {
			beforeEach: function() {
				this.allProperties = {
					firstProperty: {ignore: true}
				};
				this.oIgnoreAllPropertiesStub = sinon.stub(DesigntimeUtils, "ignoreAllProperties").returns(this.allProperties);
			},
			afterEach: function() {
				this.oIgnoreAllPropertiesStub.restore();
			}
		});

		QUnit.test("getAvatarProperties", function() {
			// Arrange
			var oElement = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.f.Avatar";
						},
						getAllProperties: function () {
							return {};
						}
					};
				}
			};

			// Act
			var oProperties = ObjectPage.strict.aggregations.content.propagateMetadata(oElement).properties;

			// Assert
			var oExpected = {
				firstProperty: {ignore: true},
				displayShape: { ignore: false }
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});

		QUnit.test("getSmartTableProperties", function() {
			// Arrange
			var oElement = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.ui.comp.smarttable.SmartTable";
						},
						getAllProperties: function () {
							return {};
						}
					};
				}
			};

			// Act
			var oProperties =  ObjectPage.strict.aggregations.content.propagateMetadata(oElement).properties;

			// Assert
			var oExpected = {
				firstProperty: {ignore: true},
				editable: {ignore: false}
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});

		QUnit.test("getGridProperties", function() {
			// Arrange
			var oElement = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.ui.layout.GridData";
						},
						getAllProperties: function () {
							return {};
						}
					};
				}
			};

			// Act
			var oProperties =  ObjectPage.strict.aggregations.content.propagateMetadata(oElement).properties;

			// Assert
			var oExpected = {
				firstProperty: {ignore: true},
				span: {	ignore: false },
				spanS: { ignore: false },
				spanM: { ignore: false },
				spanL: { ignore: false },
				spanXL: { ignore: false }
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});

		QUnit.test("getParentControl", function(assert) {
			testableHelper.startTest();
			var oStubForPrivate = testableHelper.getStaticStub();
			//Arrange test case 1
			this.oElement = {
				getMetadata: function() {
					return {
						getElementName: function() {
							return "sap.ui.comp.smartform.SmartForm";
						}
					};
				},
				getParent: function() {
					return {
						getMetadata: function() {
							return {
								getElementName: function() {
									return "sap.uxap.ObjectPageSection";
								}
							};
						}
					};
				}
			};
			//Act
			var sExpectedParentControlName = "sap.uxap.ObjectPageSection";
			var oSection = oStubForPrivate.ObjectPageDesigntime_getParentControl(this.oElement, "sap.uxap.ObjectPageSection");
			var sActualParentControlName = oSection.getMetadata().getElementName();
			//Assert
			assert.deepEqual(sActualParentControlName, sExpectedParentControlName, "getParentControl returns correct parent control when required parent exists");

			//Arrange test case 2
			this.oElement = {
				getMetadata: function() {
					return {
						getElementName: function() {
							return "sap.ui.core.mvc.XMLView";
						}
					};
				},
				getParent: function() {
					return {
						getMetadata: function() {
							return {
								getElementName: function() {
									return "sap.uxap.ObjectPageHeaderContent";
								}
							};
						},
						getParent: function() {
							return {
								getMetadata: function() {
									return {
										getElementName: function() {
											return "sap.ui.core.mvc.XMLView";
										}
									};
								}
							}
						}
					};
				}
			};
			//Act
			var oActualParent = oStubForPrivate.ObjectPageDesigntime_getParentControl(this.oElement, "sap.uxap.ObjectPageSection");
			//Assert
			assert.deepEqual(oActualParent, undefined, "getParentControl returns undefined when required parent control does not exists");

			//Arrange test case 3
			this.oElement = {
				getMetadata: function() {
					return {
						getElementName: function() {
							return "sap.ui.comp.smartform.SmartForm";
						}
					};
				},
				getParent: function() {
					return undefined;
				}
			};
			//Act
			var oActualParent = oStubForPrivate.ObjectPageDesigntime_getParentControl(this.oElement, "sap.uxap.ObjectPageSection");
			//Assert
			assert.deepEqual(oActualParent, undefined, "getParentControl returns undefined when getParent function is not defined");
			testableHelper.endTest();
		});

		QUnit.test("getDeterminingActionProperties", function() {
			// Arrange
			var oElement = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.m.Button";
						},
						getAllProperties: function () {
							return {};
						}
					};
				},
				getId: function() {
					return "FooterActionButton::Determining"
				}
			};

			// Act
			var oProperties =  ObjectPage.strict.aggregations.content.propagateMetadata(oElement).properties;

			// Assert
			assert.deepEqual(oProperties.visible, {ignore: false}, "Property visible is active");
			assert.deepEqual(oProperties.determiningActionType.virtual, true, "Property determining action type is active");
		});

		QUnit.module("Testing designtime getter functions", {
		});

		QUnit.test("getButtonDesigntime, button Id doesn't contain 'Determining'", function() {
			// Arrange
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
			var oElement = {
					getId: function() {
						return "anyNameDifferentToDetermining"
					},
					getMetadata: function() {
						return {
							getElementName: function() {
								return "sap.m.Button";
							}
						}
					}
				},
				oGetTextStub = sinon.stub(oResourceBundle, "getText"),
				oGetPropertiesStub = sinon.stub(DesigntimeUtils, "getButtonProperties"),
				oExpected = {
					actions: null
				};

			// Act
			var oButtonData = ObjectPage.strict.aggregations.content.propagateMetadata(oElement);
			oButtonData.properties();
			oButtonData.name.singular();

			// Assert
			assert.deepEqual(oButtonData.actions, oExpected.actions, "Returns expected actions.");
			assert.ok(oGetPropertiesStub.calledOnce, "Function getButtonProperties was called once.");
			assert.ok(oGetPropertiesStub.calledWith(oElement), "Function getButtonProperties was called with correct parameter.");
			assert.ok(oGetTextStub.calledOnce, "Function getText was called once.");
			assert.ok(oGetTextStub.calledWith("FE_BUTTON"), "Function getText was called with correct parameter.");

			// Cleanup
			oGetPropertiesStub.restore();
		});
});
