/**
 * tests for the sap.suite.ui.generic.template.designtime.SmartTableToolbar.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/SmartTableToolbar.designtime",
		"sap/m/Column"
	],
	function(sinon, Utils, ToolbarDesigntime) {
		"use strict";
		var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";

		QUnit.module("The function getInstanceDataForButton", {
			beforeEach: function() {
				this.oElement =  {
					getMetadata: function() {
						return {
							getElementName: function() {
								return "sap.m.Button";
							},
							getAllProperties: function() {
								return {};
							}
						};
					},
					getId: function() {
						return "TestButton";
					},
					getModel: function() {
						return {
							getMetaModel: function() {
								return {
									getODataEntityType: function() {
										return;
									}
								};
							}
						};
					}
				};
				this.sut = ToolbarDesigntime.strict.aggregations.content.propagateMetadata(this.oElement);
			}
		});

		QUnit.test("getInstanceDataForButton", function() {
			// Arrange
			this.oGetIndexStub = sinon.stub(Utils, "getLineItemRecordIndexForButton").returns(1);
			this.oGetEntityTypeStub = sinon.stub(Utils, "getEntityType");

			// Act
			var oCommonInstanceData = this.sut.getCommonInstanceData(this.oElement);

			// Assert
			var oExpectedInstanceData = {
				annotation: LINEITEM,
				target: undefined,
				qualifier: null
			};
			assert.deepEqual(oCommonInstanceData, oExpectedInstanceData , "returns no target if no entity type can be determined");

			this.oGetIndexStub.restore();
			this.oGetEntityTypeStub.restore();
		});

		QUnit.test("getInstanceDataForButton", function() {
			// Arrange
			this.oGetIndexStub = sinon.stub(Utils, "getLineItemRecordIndexForButton").returns(-1);
			this.oGetEntityTypeStub = sinon.stub(Utils, "getEntityType");

			// Act
			var oCommonInstanceData = this.sut.getCommonInstanceData(this.oElement);

			// Assert
			var oExpectedInstanceData = {
				annotation: LINEITEM,
				target: undefined,
				qualifier: null
			};
			assert.deepEqual(oCommonInstanceData, oExpectedInstanceData , "returns no target if no record could be indentified");

			this.oGetIndexStub.restore();
			this.oGetEntityTypeStub.restore();
		});

		QUnit.test("getInstanceDataForButton", function() {
			// Arrange
			this.oGetIndexStub = sinon.stub(Utils, "getLineItemRecordIndexForButton").returns(1);
			this.oGetEntityTypeStub = sinon.stub(Utils, "getEntityType").returns("MyEntityType");

			var oElement =  {
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								getODataEntityType: function() {
									return {
										namespace: "ns",
										name: "MyEntityType"
									};
								}
							};
						}
					};
				}
			};

			// Act
			var oCommonInstanceData = this.sut.getCommonInstanceData(oElement);

			// Assert
			var oExpectedInstanceData = {
				annotation: LINEITEM,
				target: "ns.MyEntityType/" + LINEITEM + "/1" ,
				qualifier: null
			};
			assert.deepEqual(oCommonInstanceData, oExpectedInstanceData , "returns the right target for a record");

			this.oGetIndexStub.restore();
			this.oGetEntityTypeStub.restore();
		});
	});
