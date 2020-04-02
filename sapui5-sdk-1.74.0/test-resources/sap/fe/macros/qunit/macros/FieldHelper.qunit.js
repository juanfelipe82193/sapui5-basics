/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(
	[
		"sap/ui/thirdparty/sinon",
		"sap/fe/macros/field/FieldHelper",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/macros/CommonHelper",
		"sap/base/Log",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function(sinon, FieldHelper, AnnotationHelper, commonHelper, Log) {
		"use strict";
		var sandbox = sinon.sandbox.create();
		QUnit.module("Unit Test for isLineItem", {
			beforeEach: function() {}
		});
		QUnit.test("Unit test to check isLineItem ", function(assert) {
			[
				{
					oInterface: {
						context: {
							getPath: function() {
								return "@com.sap.vocabularies.UI.v1.LineItem";
							}
						}
					},
					bExpectedValue: true,
					sMessage: "with line item in path"
				},
				{
					oInterface: {
						context: {
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: false,
					sMessage: "without line item in path"
				}
			].forEach(function(oProperty) {
				var oValue = "";
				var actualValue = FieldHelper.isLineItem(oValue, oProperty.oInterface);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check isLineItem " + oProperty.sMessage + ": ok");
			});
		});

		QUnit.module("Unit Test for getRequiredForDataField");

		QUnit.test("Unit test to check requiredForDataField ", function(assert) {
			[
				{
					oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory",
					expectedValue: false,
					sMessage: "without editmode and with Field Control Enum Member"
				},
				{
					expectedValue: false,
					sMessage: "without Field Control and EditMode"
				},
				{
					oFieldControl: "{height}",
					expectedValue: false,
					sMessage: "with Field Control Path without EditMode"
				},
				{
					editMode: "{ui>/Editable}",
					expectedValue: false,
					sMessage: "without Field Control Path with EditMode"
				},
				{
					sEditMode: "{ui>/editable}",
					oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory",
					expectedValue: "{= %{ui>/editable} === 'Editable'}",
					sMessage: "with nullable true and Field Control Enum Member with EditMode"
				},
				{
					sEditMode: "{ui>/editable}",
					oFieldControl: "{height}",
					expectedValue: "{= %{height} === 7 && %{ui>/editable} === 'Editable'}",
					sMessage: "with Field Control Path and EditMode"
				},
				{
					sEditMode: "Editable",
					oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory",
					expectedValue: true,
					sMessage: "with nullable true and Field Control Enum Member with EditMode"
				},
				{
					sEditMode: "Display",
					expectedValue: false,
					sMessage: "with Edit Mode as Display"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.getRequiredForDataField(oProperty.oFieldControl, oProperty.sEditMode);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check requiredForDataField " + oProperty.sMessage + ": ok"
				);
			});
		});
		QUnit.module("Unit Test for buildExpressionForCriticalityIcon");

		QUnit.test("Unit test to check buildExpressionForCriticalityIcon ", function(assert) {
			[
				{
					sCriticalityProperty: "height",
					expectedValue:
						"{= (${height} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${height} === '1') || (${height} === 1) ? 'sap-icon://status-negative' : " +
						"(${height} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${height} === '2') || (${height} === 2) ? 'sap-icon://status-critical' : " +
						"(${height} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${height} === '3') || (${height} === 3) ? 'sap-icon://status-positive' : " +
						"'sap-icon://status-inactive' }",
					sMessage: "with Criticality Property"
				},
				{
					sMessage: "without Criticality Property"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.buildExpressionForCriticalityIcon(oProperty.sCriticalityProperty);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check buildExpressionForCriticalityIcon " + oProperty.sMessage + ": ok"
				);
			});
		});
		QUnit.module("Unit Test for buildExpressionForCriticalityColor");

		QUnit.test("Unit Test to check buildExpressionForCriticalityColor", function(assert) {
			[
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						}
					},
					sExpectedValue: "None",
					sMessage: "when Criticality is not provided"
				},
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						},
						Criticality: {
							$Path: "availability_code"
						}
					},
					sExpectedValue:
						"{= (${availability_code} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${availability_code} === '1') || (${availability_code} === 1) ? 'Error' : (${availability_code} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${availability_code} === '2') || (${availability_code} === 2) ? 'Warning' : (${availability_code} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${availability_code} === '3') || (${availability_code} === 3) ? 'Success' : 'None' }",
					sMessage: "when Criticality is provided"
				},
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						},
						Criticality: {
							$EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
						}
					},
					sExpectedValue:
						"{= ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '1') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 1) ? 'Error' : ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '2') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 2) ? 'Warning' : ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '3') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 3) ? 'Success' : 'None' }",
					sMessage: "when Criticality Enum Member is provided"
				},
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						},
						Criticality: {
							$Path: ""
						}
					},
					sExpectedValue: "None",
					sMessage: "hen Criticality is provided, but Path/EnumMember not provided"
				}
			].forEach(function(oProperty) {
				var sActualValue = FieldHelper.buildExpressionForCriticalityColor(oProperty.oDataPoint);
				assert.equal(
					sActualValue,
					oProperty.sExpectedValue,
					"buildExpressionForCriticality " + oProperty.sMessage + " is checked correctly"
				);
			});
		});

		QUnit.module("Unit Test for isSemanticKey");

		QUnit.test("Unit test to check isSemanticKey ", function(assert) {
			[
				{
					oValue: {
						$Path: "reviewer"
					},
					aSemanticKeys: undefined,
					expectedValue: false,
					sMessage: "with no semantic key - undefined"
				},
				{
					oValue: {
						$Path: "reviewer"
					},
					aSemanticKeys: [],
					expectedValue: false,
					sMessage: "with no semantic key - empty"
				},
				{
					oValue: undefined,
					aSemanticKeys: [
						{
							$PropertyPath: "id"
						}
					],
					expectedValue: false,
					sMessage: "with no property value"
				},
				{
					oValue: {
						$Path: "id"
					},
					aSemanticKeys: [
						{
							$PropertyPath: "id"
						}
					],
					expectedValue: true,
					sMessage: "with semantic key"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.isSemanticKey(oProperty.aSemanticKeys, oProperty.oValue);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check isSemanticKey " + oProperty.sMessage + ":  ok");
			});
		});
		QUnit.module("Unit Test for getStableIdPartFromDataField");

		QUnit.test("Unit test to check getStableIdPartFromDataField ", function(assert) {
			[
				{
					oDataField: {
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
						"Action": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP"
					},
					replaceSpecialCharsInIdStub: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
					expectedValue: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
					sMessage: "with DataField Type as DataFieldForAction"
				},
				{
					oDataField: {
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						"Action": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
						"SemanticObject": "Products"
					},
					semanticObjectStub: "Products",
					actionStub: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
					expectedValue: "Products::com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
					sMessage: "with DataField Type as DataFieldForIntentBasedNavigation"
				},
				{
					oDataField: {
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						"Action": {
							"$Path": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP"
						},
						"SemanticObject": {
							"$Path": "Products"
						}
					},
					semanticObjectPathStub: "Products",
					actionPathStub: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
					expectedValue: "Products::com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
					sMessage: "with DataField Type as DataFieldForIntentBasedNavigation"
				},
				{
					oDataField: {
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						"Target": {
							"$AnnotationPath": "_Publication/@UI.LineItem"
						}
					},
					targetAnnotationPathStub: "_Publication/@UI.LineItem",
					expectedValue: "_Publication/@UI.LineItem",
					sMessage: "with DataField Type as DataFieldForAnnotation"
				},
				{
					oDataField: {
						"Value": {
							"$Path": "Name"
						}
					},
					valuePathStub: "Name",
					expectedValue: "Name",
					sMessage: "with DataField Value as Path"
				},
				{
					oDataField: {
						"Value": {
							"$Apply": [
								{
									"$Path": "Artists"
								},
								{
									"$Path": "Publications"
								},
								{
									"$Path": "Contributors"
								}
							],
							"$Function": "odata.concat"
						}
					},
					valueApplyPathStub: ["Artists", "Publications", "Contributors"],
					expectedValue: "Artists::Publications::Contributors",
					sMessage: "with DataField Value as $Apply"
				},
				{
					oDataField: {},
					mParameter: {
						context: {
							getObject: function() {
								return "Name";
							}
						}
					},
					expectedValue: "Name",
					sMessage: "with mParameter Value"
				},
				{
					oDataField: {},
					mParameter: {},
					sMessage: "with no Datafield and mParameter"
				}
			].forEach(function(oProperty) {
				var oStub = sandbox.stub(commonHelper, "replaceSpecialCharsInId");
				oProperty.oDataField.$Type &&
					oStub.withArgs(oProperty.oDataField.$Type).returns("com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP");
				oProperty.oDataField.SemanticObject && oStub.withArgs(oProperty.oDataField.SemanticObject).returns("Products");
				oProperty.oDataField.Action &&
					oStub
						.withArgs(oProperty.oDataField.Action)
						.returns("com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP");
				oProperty.oDataField.Action &&
					oProperty.oDataField.Action.$Path &&
					oStub
						.withArgs(oProperty.oDataField.Action.$Path)
						.returns("com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP");
				oProperty.oDataField.SemanticObject &&
					oProperty.oDataField.SemanticObject.$Path &&
					oStub.withArgs(oProperty.oDataField.SemanticObject.$Path).returns("Products");
				oProperty.oDataField.Target &&
					oProperty.oDataField.Target.$AnnotationPath &&
					oStub.withArgs(oProperty.oDataField.Target.$AnnotationPath).returns("_Publication/@UI.LineItem");
				oProperty.oDataField.Value &&
					oProperty.oDataField.Value.$Path &&
					oStub.withArgs(oProperty.oDataField.Value.$Path).returns("Name");
				oProperty.oDataField.Value &&
					oProperty.oDataField.Value.$Apply &&
					oProperty.oDataField.Value.$Apply[0] &&
					oStub.withArgs(oProperty.oDataField.Value.$Apply[0].$Path).returns("Artists");
				oProperty.oDataField.Value &&
					oProperty.oDataField.Value.$Apply &&
					oProperty.oDataField.Value.$Apply[1] &&
					oStub.withArgs(oProperty.oDataField.Value.$Apply[1].$Path).returns("Publications");
				oProperty.oDataField.Value &&
					oProperty.oDataField.Value.$Apply &&
					oProperty.oDataField.Value.$Apply[2] &&
					oStub.withArgs(oProperty.oDataField.Value.$Apply[2].$Path).returns("Contributors");
				oProperty.mParameter &&
					oProperty.mParameter.context &&
					oStub.withArgs(oProperty.mParameter.context.getObject()).returns("Name");
				var actualValue = FieldHelper.getStableIdPartFromDataField(oProperty.oDataField, oProperty.mParameter);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check getStableIdPartFromDataField " + oProperty.sMessage + ":  ok"
				);
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test for isNotAlwaysHidden");

		QUnit.test("Unit test to check isNotAlwaysHidden ", function(assert) {
			[
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return true;
								}
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: false,
					sMessage: "with DataField Value as true"
				},
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return false;
								}
								return;
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: true,
					sMessage: "with DataField Value as false"
				},
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return {
										"$Path": "height"
									};
								}
								if (objName == "@com.sap.vocabularies.UI.v1.Hidden") {
									return true;
								}
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: false,
					sMessage: "with DataField Value as true and has $Path"
				},
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return {
										"$Path": "height"
									};
								}
								if (objName == "@com.sap.vocabularies.UI.v1.Hidden") {
									return false;
								}
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: true,
					sMessage: "with DataField Value as false and has $Path"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.isNotAlwaysHidden(oProperty.oDataField, oProperty.oDetails);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check isNotAlwaysHidden " + oProperty.sMessage + ":  ok");
				sandbox.restore();
			});
		});
		QUnit.module("Unit Test for buildExpressionForTextValue");

		QUnit.test("Unit test to check buildExpressionForTextValue ", function(assert) {
			[
				{
					oDataField: {
						context: {
							getModel: function() {
								return {
									getObject: function(objName) {
										return {
											"$Path": "CountryOfOrigin_Text"
										};
									}
								};
							},
							getPath: function() {
								return "/Artists/@com.sap.vocabularies.UI.v1.LineItem/2/Value/$Path";
							}
						}
					},
					valueStub: "{CountryOfOrigin_Text}",
					getNavigationPathStub: "Publications/CountryOfOrigin",
					sPropertyPath: "CountryOfOrigin",
					expectedValue: "{ path : 'Publications/CountryOfOrigin_Text', mode : 'OneWay'}",
					sMessage: "with Text annotation"
				},
				{
					oDataField: {
						context: {
							getModel: function() {
								return {
									getObject: function() {
										return "";
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					getNavigationPathStub: "CountryOfOrigin",
					sPropertyPath: "CountryOfOrigin",
					expectedValue: undefined,
					sMessage: "without Text annotation"
				}
			].forEach(function(oProperty) {
				sandbox.stub(AnnotationHelper, "value", function() {
					return oProperty.valueStub;
				});
				sandbox.stub(AnnotationHelper, "getNavigationPath", function() {
					return oProperty.getNavigationPathStub;
				});
				var actualValue = FieldHelper.buildExpressionForTextValue(oProperty.sPropertyPath, oProperty.oDataField);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check buildExpressionForTextValue " + oProperty.sMessage + ":  ok"
				);
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test for computed anntotation @@fieldControl for DataFields");

		QUnit.test("Unit test to check @@fieldControl", function(assert) {
			[
				{
					sPropertyPath: "BreakUpYear",
					oInterface: {
						context: {
							getPath: function(sPath) {
								return "/Artists/@com.sap.vocabularies.UI.v1.LineItem/2/Value/$Path";
							},
							getModel: function() {
								return {
									getObject: function(sPath) {
										return {
											"$Path": "__FieldControl/BreakUpYear"
										};
									}
								};
							}
						}
					},
					expectedValue: "{__FieldControl/BreakUpYear}",
					sMessage: "with Field Control as path (dynamic)"
				},
				{
					sPropertyPath: "Name",
					oInterface: {
						context: {
							getPath: function(sPath) {
								return "/Artists/@com.sap.vocabularies.UI.v1.LineItem/2/Value/$Path";
							},
							getModel: function() {
								return {
									getObject: function(sPath) {
										return {
											"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
										};
									}
								};
							}
						}
					},
					expectedValue: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly",
					sMessage: "with Field Control as EnumMember (static)"
				},
				{
					oInterface: {
						context: {
							getPath: function(sPath) {
								return;
							},
							getModel: function() {
								return;
							}
						}
					},
					sMessage: "without FieldControl"
				}
			].forEach(function(oProperty) {
				sandbox.stub(AnnotationHelper, "value", function() {
					return "{__FieldControl/BreakUpYear}";
				});
				var actualValue = FieldHelper.fieldControl(oProperty.sPropertyPath, oProperty.oInterface);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check @@fieldControl " + oProperty.sMessage + ":  ok");
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test for UI.Hidden Path for DataFields");

		QUnit.test("Unit test to check Hidden Path Expression", function(assert) {
			[
				{
					dataField: { $Path: "Name" },
					oDetails: {
						context: {
							getPath: function(sPath) {
								return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
							},
							getObject: function() {
								return {
									"$Path": "_ShipToParty/isHidden"
								};
							}
						}
					},
					expectedValue: "{= %{_ShipToParty/isHidden}=== true ? false : true }",
					sMessage: "with Hidden as path (dynamic) with navigation Entity"
				},
				{
					dataField: { $Path: "Name" },
					oDetails: {
						context: {
							getPath: function(sPath) {
								return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
							},
							getObject: function() {
								return {
									"$Path": "isHidden"
								};
							}
						}
					},
					expectedValue: "{= %{isHidden}=== true ? false : true }",
					sMessage: "with Hidden as path (dynamic) with navigation Entity"
				},
				{
					dataField: { $Path: "Name" },
					oDetails: {
						context: {
							getPath: function(sPath) {
								return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
							},
							getObject: function(sPath) {
								if (sPath == "/SalesOrderManage/_ShipToParty") {
									return false;
								} else {
									return {
										"$Path": "_ShipToParty/isHidden",
										"isCollection": true
									};
								}
							}
						}
					},
					expectedValue: true,
					sMessage: "with Hidden as path (dynamic) with navigation entity with collection"
				},
				{
					dataField: { $Path: "Name" },
					oDetails: {
						context: {
							getPath: function(sPath) {
								return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
							},
							getObject: function(sPath) {
								if (sPath == "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1@com.sap.vocabularies.UI.v1.Hidden") {
									return undefined;
								} else {
									return {
										"$Path": "_ShipToParty/isHidden"
									};
								}
							}
						}
					},
					expectedValue: "{= %{_ShipToParty/isHidden}=== true ? false : true }",
					sMessage: "with property having Hidden as path (dynamic) with navigation Entity"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.getHiddenPathExpression(oProperty.dataField, oProperty.oDetails);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check Hidden Path Expression " + oProperty.sMessage + ":  ok"
				);
			});
		});
		QUnit.module("Unit Test for computed anntotation @@displayMode", {
			beforeEach: function() {},
			afterEach: function() {
				sandbox.restore();
			}
		});

		QUnit.test("Unit test to check @@displayMode", function(assert) {
			[
				{
					propertyAnnotations: {},
					expectedValue: "Value",
					info: "No annotations"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text (w/o TextArrangement)"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "Description",
					info: "Common.Text with TextArrangement TextOnly"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
						}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text with TextArrangement TextFirst"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {}
					},
					expectedValue: "Value",
					info: "No Common.Text but TextArrangement (which would be a wrong annotation)"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate"
						}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text with TextArrangement TextSeparate"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					collectionAnnotations: {},
					expectedValue: "DescriptionValue",
					info: "Common.Text (w/o TextArrangement)"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "Description",
					info: "Common.Text with TextArrangement TextOnly"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
						}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text with TextArrangement TextFirst"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
						}
					},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "ValueDescription",
					info: "Common.Text with Text arrangement of property type and entity type"
				},
				{
					propertyAnnotations: {},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "Value",
					info: "No Common.Text but TextArrangement (which would be a wrong annotation)"
				}
			].forEach(function(oTest) {
				assert.equal(
					FieldHelper.displayMode(oTest.propertyAnnotations, oTest.collectionAnnotations),
					oTest.expectedValue,
					oTest.info + " correctly computed " + oTest.expectedValue
				);
			});
		});

		/* NEEDS TO BE REWORKED
		QUnit.module("Unit Test for computed anntotation @@value for DataFields", {
			beforeEach: function () {

			},
			afterEach: function () {
				sandbox.restore();
			}
		});
		QUnit.test("Unit test to check @@value", function (assert) {
			var done = assert.async(), aPromises = [];
			[{
				dataField: { $Path: "Name" },
				testnamePostfix: "",
				$kind: "Property", $Type: "Edm.String",
				annotations: {},
				expectedValue: "{path: 'Name',type: 'sap.ui.model.odata.type.String'}"
			},{
				dataField: { $Path: "UnitCode" },
				testnamePostfix: " with $MaxLength: 3",
				$kind: "Property", $Type: "Edm.String", $MaxLength: 3, $Nullable: false,
				annotations: {},
				expectedValue: "{path: 'UnitCode',type: 'sap.ui.model.odata.type.String',constraints: {nullable: false, maxLength: 3}}"
			},{
				dataField: { $Path: "SomeDate" },
				testnamePostfix: "",
				$kind: "Property", $Type: "Edm.Date", $Nullable: true,
				annotations: {},
				expectedValue: "{path: 'SomeDate',type: 'sap.ui.model.odata.type.Date',formatOptions : {style : 'medium'}}"
			},
			{
				dataField: { $Path: "ProcessingStartDateTime" },
				testnamePostfix: "",
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7,
				annotations: {},
				expectedValue: "{path: 'ProcessingStartDateTime',type: 'sap.ui.model.odata.type.DateTimeOffset',constraints: {precision: 7},formatOptions : {style : 'medium'}}"
			},{
				dataField: { $Path: "Price" },
				testnamePostfix: "that has a ISOCurrency",
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 10,
				"$Scale": 3,
				annotations: {
					"@Org.OData.Measures.V1.ISOCurrency": {
						$Path: "Currency"
					}
				},
				expectedValue: "{parts: ['Price','Currency'], type: 'sap.ui.model.type.Currency',constraints: {precision: 10, scale: 3},formatOptions : {parseAsString : true}}",
				exclude: "parameter"
			}].forEach(function(oProperty) {
				var oInterface = {
						context: {
							getPath: function () {
								return '/someType/' + oProperty.dataField.$Path;
							},
							getObject: function(sPath, oContext) {
								if (sPath === "@sapui.name") {
									return; //undefined
								} else if (sPath.indexOf("@") > -1) {
									return oProperty.annotations;
								} else if (!sPath) {
									return oProperty.dataField.$Path;
								} else {
									return oProperty;
								}
							},
							getModel: function () {
								return {
									getObject: function (sPath) {
										return sPath;
									},
									getProperty: function(sPath) {
										return sPath;
									},
									createBindingContext: function() {
										return oInterface.context;
									}
								};
							}
						}
					},
					oParam = Object.assign({}, oProperty);//Parameter clone
				oParam.testnamePostfix = "";
				oParam.$Name = oProperty.dataField.$Path;
				aPromises.push(Promise.all([
					FieldHelper.value(oProperty.dataField, oInterface).then(function(sResult) {
						assert.equal(sResult, oProperty.expectedValue, "[DataField]  " + oProperty.$Type + " " + oProperty.testnamePostfix + ": ok  ------> " + sResult );
					}),
					FieldHelper.value(oProperty, oInterface).then(function(sResult) {
						assert.equal(sResult, oProperty.expectedValue, "[Property]   " + oProperty.$Type + " " + oProperty.testnamePostfix + ": ok  ------> " + sResult );
					}),
					FieldHelper.value(oParam, oInterface).then(function(sResult) {
						if (oProperty.exclude && oProperty.exclude.indexOf("parameter") > -1) {
							assert.ok(true, "[Parameter]   " + oProperty.$Type + " " + oProperty.testnamePostfix + ": Not supported" );
						} else {
							assert.equal(sResult, oProperty.expectedValue, "[Parameter]   " + oProperty.$Type + " " + oProperty.testnamePostfix + ": ok  ------> " + sResult );
						}
					})
				]));
			});
			Promise.all(aPromises).then(function() {
				done();
			});
		});
		*/
		QUnit.module("Unit Test for getFieldGroupIds", {
			beforeEach: function() {},
			afterEach: function() {
				sandbox.restore();
			}
		});
		QUnit.test("Unit test to check getFieldGroupIds with/out SideEffects annotation", function(assert) {
			[
				{
					propertyPath: "property1",
					entityType: "namespace.EntityType1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType1"
							}
						},
						"namespace.EntityType1@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "property1"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property2"
									}
								]
							}
						},
						"namespace.EntityType2@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "navigationProperty/property1"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property1"
									}
								]
							}
						}
					},
					expectedValue: "namespace.EntityType1#Qualifier$$ImmediateRequest,namespace.EntityType2#Qualifier$$ImmediateRequest"
				},
				{
					propertyPath: "property1",
					entityType: "namespace.EntityType1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType1"
							}
						},
						"namespace.EntityType1@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "property1"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property2"
									}
								]
							}
						},
						"namespace.EntityType2@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceEntities: [
									{
										"$NavigationPropertyPath": "navigationProperty"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property1"
									}
								]
							}
						}
					},
					expectedValue: "namespace.EntityType2#Qualifier$$ImmediateRequest,namespace.EntityType1#Qualifier$$ImmediateRequest"
				},
				{
					propertyPath: "property1",
					entityType: "namespace.EntityType1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType1"
							}
						},
						"namespace.EntityType1@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "property1"
									},
									{
										"$PropertyPath": "property2"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property2"
									}
								]
							}
						},
						"namespace.EntityType2@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceEntities: [
									{
										"$NavigationPropertyPath": "navigationProperty"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property1"
									}
								]
							}
						}
					},
					expectedValue: "namespace.EntityType2#Qualifier$$ImmediateRequest,namespace.EntityType1#Qualifier"
				},
				{
					propertyPath: "property1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType2"
							}
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType1@": {},
						"namespace.EntityType2@": {}
					},
					expectedValue: undefined
				}
			].forEach(function(oProperty) {
				var oContext = {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										requestObject: function(sPath) {
											if (sPath === "/$") {
												return Promise.resolve(oProperty.container);
											}
											if (sPath.indexOf("navigationProperty") > -1) {
												var aPaths = sPath.split("/"),
													result = oProperty.container;
												aPaths = aPaths.splice(1, 2);
												aPaths.forEach(function(sSegment) {
													result = result[sSegment];
												});
												return Promise.resolve(result["$Type"]);
											}
											return Promise.resolve(oProperty.container[sPath.substr(1)]);
										}
									};
								},
								getSetting: function() {
									return {};
								}
							};
						}
					},
					done = assert.async();
				FieldHelper.getFieldGroupIds(oContext, oProperty.propertyPath, oProperty.entityType).then(function(sResult) {
					assert.equal(
						sResult,
						oProperty.expectedValue,
						"[FieldGroupIds]  " + oProperty.propertyPath + " --- " + oProperty.expectedValue
					);
					done();
				});
			});
		});

		QUnit.module("Unit Test for getNavigationEntity", {
			beforeEach: function() {}
		});
		QUnit.test("Unit test for getNavigationEntity when called without context i.e from template:with", function(assert) {
			[
				{
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers"
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage: "with semantic object pointing to naviagation entity without $ReferentialConstraint"
				},
				{
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage:
						"with semantic object pointing to naviagation entity without matching property name inside $ReferentialConstraint"
				},
				{
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier_ID": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "supplier_ID" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: "/Products/$Type/supplier",
					sMessage:
						"with semantic object pointing to naviagation entity with a matching property name inside $ReferentialConstraint"
				}
			].forEach(function(object) {
				var actualValue = FieldHelper.getNavigationEntity(object.oContext.context);
				assert.equal(actualValue, object.bExpectedValue, "Unit test " + object.sMessage + ": ok");
			});
		});
		QUnit.module("Unit Test for getNavigationEntity", {
			beforeEach: function() {}
		});
		QUnit.test("Unit test for getNavigationEntity when called with context from computed annotation", function(assert) {
			[
				{
					oProperty: {
						$Path: "supplier_ID"
					},
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers"
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage: "with semantic object pointing to naviagation entity without $ReferentialConstraint"
				},
				{
					oProperty: {
						$Path: "supplier_ID"
					},
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage:
						"with semantic object pointing to naviagation entity without matching property name inside $ReferentialConstraint"
				},
				{
					oProperty: {
						$Path: "supplier_ID"
					},
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier_ID": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "supplier_ID" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: "{supplier}",
					sMessage:
						"with semantic object pointing to naviagation entity with a matching property name inside $ReferentialConstraint"
				}
			].forEach(function(object) {
				var actualValue = FieldHelper.getNavigationEntity(object.oContext.context, object.oProperty);
				assert.equal(actualValue, object.bExpectedValue, "Unit test " + object.sMessage + ": ok");
			});
		});

		QUnit.module("Unit Test for valueHelpProperty", {
			beforeEach: function() {}
		});
		QUnit.test(
			"Unit test for valueHelpProperty to get the valuehelp property from the DataField or from selectionFields propertypath",
			function(assert) {
				[
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$Path@") > -1
									? {}
									: {
											"$Path": "Property"
									  };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						},
						bExpectedValue:
							"/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value/$Path",
						sMessage: "with field property at $Path"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$Path@") > -1
									? {
											"@Org.OData.Measures.V1.ISOCurrency": {
												"$Path": "PropertyCurrency"
											}
									  }
									: {
											"$Path": "Property"
									  };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						},
						bExpectedValue:
							"/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value/$Path@Org.OData.Measures.V1.ISOCurrency/$Path",
						sMessage: "with field property at $Path with ISOCurrency annotations"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$Path@") > -1
									? {
											"@Org.OData.Measures.V1.Unit": {
												"$Path": "PropertyUnit"
											}
									  }
									: {
											"$Path": "Property"
									  };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						},
						bExpectedValue:
							"/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value/$Path@Org.OData.Measures.V1.Unit/$Path",
						sMessage: "with field property at $Path with Unit annotations"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$PropertyPath@") > -1
									? {}
									: {
											"$PropertyPath": "Property"
									  };
							},
							getPath: function() {
								return "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath";
							}
						},
						bExpectedValue: "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath",
						sMessage: "with field property from selectionFields"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$PropertyPath@") > -1
									? {
											"@Org.OData.Measures.V1.ISOCurrency": {
												"$Path": "PropertyCurrency"
											}
									  }
									: {
											"$PropertyPath": "Property"
									  };
							},
							getPath: function() {
								return "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath";
							}
						},
						bExpectedValue:
							"/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath@Org.OData.Measures.V1.ISOCurrency/$Path",
						sMessage: "with field property from selectionFields with ISOCurrency annotations"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$PropertyPath@") > -1
									? {
											"@Org.OData.Measures.V1.Unit": {
												"$Path": "PropertyUnit"
											}
									  }
									: {
											"$PropertyPath": "Property"
									  };
							},
							getPath: function() {
								return "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath";
							}
						},
						bExpectedValue:
							"/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath@Org.OData.Measures.V1.Unit/$Path",
						sMessage: "with field property from selectionFields with Unit annotations"
					}
				].forEach(function(object) {
					var actualValue = FieldHelper.valueHelpProperty(object.oPropertyContext);
					assert.equal(actualValue, object.bExpectedValue, "Unit test for valueHelpProperty " + object.sMessage + ": ok");
				});
			}
		);

		QUnit.module("Unit Test for getConditionsBinding", {
			beforeEach: function() {},
			afterEach: function() {
				sandbox.restore();
			}
		});
		QUnit.test("Unit test to check getConditionsBinding for FilterFields", function(assert) {
			[
				{
					filterFieldPath: "property1",
					entitySet: "entitySet1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType1"
							}
						},
						"namespace.EntityType1@": {},
						"namespace.EntityType2@": {}
					},
					context: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										getObject: function(sPath) {
											return undefined;
										}
									};
								}
							};
						}
					},
					expectedValue: "{$filters>/conditions/property1}",
					sMessage: "without navigation"
				},
				{
					filterFieldPath: "navigationProperty/property1",
					entitySet: "entitySet1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType2",
								"$kind": "NavigationProperty"
							}
						},
						"namespace.EntityType2": {
							property1: "property1",
							property2: "property2"
						}
					},
					context: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										getObject: function(sPath) {
											return {
												$Type: "namespace.EntityType2",
												$kind: "NavigationProperty"
											};
										}
									};
								}
							};
						}
					},
					expectedValue: "{$filters>/conditions/navigationProperty/property1}",
					sMessage: "with navigation without collection"
				},
				{
					filterFieldPath: "navigationProperty/property1",
					entitySet: "entitySet1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							property1: "property1",
							property2: "property2"
						}
					},
					context: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										getObject: function(sPath) {
											return undefined;
										}
									};
								}
							};
						}
					},
					expectedValue: "{$filters>/conditions/navigationProperty/property1}",
					sMessage: "with without a navigation property"
				},
				{
					filterFieldPath: "navigationProperty/property1",
					entitySet: "entitySet1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType2",
								"$kind": "NavigationProperty",
								"$isCollection": true
							}
						},
						"namespace.EntityType2": {
							property1: "property1",
							property2: "property2"
						}
					},
					context: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										getObject: function(sPath) {
											return {
												$Type: "namespace.EntityType2",
												$isCollection: true,
												$kind: "NavigationProperty"
											};
										}
									};
								}
							};
						}
					},
					expectedValue: "{$filters>/conditions/navigationProperty*/property1}",
					sMessage: "with navigation with collection"
				},
				{
					filterFieldPath: {},
					entitySet: "entitySet1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType2",
								"$kind": "NavigationProperty",
								"$isCollection": true
							}
						},
						"namespace.EntityType2": {
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType1@": {},
						"namespace.EntityType2@": {}
					},
					context: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										getObject: function(sPath) {
											return {
												$Type: "namespace.EntityType2",
												$isCollection: true,
												$kind: "NavigationProperty"
											};
										},
										createBindingContext: function() {
											return {
												getObject: function(sPath) {
													return "property1";
												}
											};
										}
									};
								},
								getPath: function() {
									return "/entitySet1/$Type@com.sap.vocabularies.UI.v1.FieldGroup/Data/0/Value";
								}
							};
						}
					},
					expectedValue: "{$filters>/conditions/property1}",
					sMessage: "without property as string"
				}
			].forEach(function(oProperty) {
				assert.equal(
					FieldHelper.getConditionsBinding(oProperty.context, oProperty.filterFieldPath, oProperty.entitySet),
					oProperty.expectedValue,
					"ConditionsBinding for filterfield with filedPath '" +
						oProperty.filterFieldPath +
						"' " +
						oProperty.sMessage +
						" is '" +
						oProperty.expectedValue +
						"'."
				);
			});
		});
		QUnit.module("Unit test to check type constarint");
		QUnit.test("Unit test to check type constraint", function(assert) {
			[
				{
					property: { $Type: "Edm.String", $Nullable: false },
					annotations: {},
					expectedValue: "nullable: false",
					sMessage: "String, NOT nullable"
				},
				{
					property: { $Type: "Edm.Decimal", $Nullable: false },
					annotations: {},
					expectedValue: "nullable: false",
					sMessage: "Decimal, NOT nullable"
				},
				{
					property: { $Type: "Edm.DateTimeOffset", $Nullable: false },
					annotations: {},
					expectedValue: "nullable: false",
					sMessage: "DateTimeOffset, NOT nullable"
				},
				{
					property: { $Type: "Edm.DateTimeOffset", $Nullable: false, $Precision: 5 },
					annotations: {},
					expectedValue: "nullable: false, precision: 5",
					sMessage: "DateTimeOffset, NOT nullable with precision"
				},
				{
					property: { $Type: "Edm.DateTimeOffset", $Nullable: false, $Scale: "variable" },
					annotations: {},
					expectedValue: "nullable: false, scale: 'variable'",
					sMessage: "DateTimeOffset, NOT nullable with variable scale"
				},
				{
					property: { $Type: "Edm.DateTimeOffset", $Nullable: false, $Precision: 5, $Scale: 100 },
					annotations: {},
					expectedValue: "nullable: false, precision: 5, scale: 100",
					sMessage: "DateTimeOffset, NOT nullable with precision and scale"
				},
				{
					property: { $Type: "Edm.String", $MaxLength: 10 },
					annotations: {},
					expectedValue: "maxLength: 10",
					sMessage: "String with max length"
				},
				{
					property: { $Type: "Edm.String" },
					annotations: {},
					expectedValue: "",
					sMessage: "String"
				},
				{
					property: { $Type: "Edm.Decimal", $Nullable: true, $Scale: "variable", $Precision: 5 },
					annotations: {},
					expectedValue: "precision: 5, scale: 'variable'",
					sMessage: "Decimal, nullable, with precision and scale"
				}
			].forEach(function(oData) {
				var actualValue = FieldHelper.typeConstraints(oData.property, oData.annotations);
				assert.strictEqual(
					actualValue,
					oData.expectedValue,
					"Unit test to check typeConstraints for " + oData.sMessage + " = { " + oData.expectedValue + " }"
				);
			});
		});

		QUnit.module("Unit test to check edit mode of filter field within valuehelp");
		QUnit.test("Unit test to check edit mode of filter field within valuehelp", function(assert) {
			var aInputData = [
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterIn", ValueListProperty: "property1" }]
					},
					sPropertyPath: "property1",
					outputData: "ReadOnly",
					sMessage: "Field is display-only when it is an in parameter"
				},
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterIn", ValueListProperty: "property2" }]
					},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable for in parameter whose valuelist property not equal to field property"
				},
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterInOut", ValueListProperty: "property1" }]
					},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable for inout parameter"
				},
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterOut", ValueListProperty: "property1" }]
					},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable for out parameter "
				},
				{
					oValueList: {},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable when valuelist annotation is not avilable"
				}
			];
			aInputData.forEach(function(oElement, index) {
				assert.deepEqual(
					FieldHelper.getFieldEditModeInValueHelp(oElement.oValueList, oElement.sPropertyPath),
					oElement.outputData,
					oElement.sMessage
				);
			});
		});
		QUnit.module("Unit Test for maxConditions", {
			beforeEach: function() {}
		});
		QUnit.test("Value 1 for Edm.Boolean, SingleValue in Filter Restrictions", function(assert) {
			[
				{
					oValue: "BooleanField",
					oInterface: {
						context: {
							getModel: function() {
								return {
									getObject: function(param) {
										var returnObject;
										if (param && param === "@Org.OData.Capabilities.V1.FilterRestrictions") {
											returnObject = {
												FilterExpressionRestrictions: [
													{
														Property: { $PropertyPath: "BooleanField" },
														AllowedExpression: { $Path: "SingleRange" }
													}
												]
											};
										}
										if (param && param.slice(0, 1) === "/") {
											returnObject = { $Type: "Edm.Boolean" };
										}
										return returnObject;
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: 1,
					sMessage: " boolean type"
				},
				{
					oValue: "DateField",
					oInterface: {
						context: {
							getModel: function() {
								return {
									getObject: function(param) {
										var returnObject;
										if (param && param === "@Org.OData.Capabilities.V1.FilterRestrictions") {
											returnObject = {
												FilterExpressionRestrictions: [
													{
														Property: { $PropertyPath: "DateField" },
														AllowedExpression: "SingleValue"
													}
												]
											};
										}
										if (param && param.slice(0, 1) === "/") {
											returnObject = { $Type: "Edm.Date" };
										}
										return returnObject;
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: 1,
					sMessage: "Single Value in Allowed Expression"
				},
				{
					oValue: "DateField",
					oInterface: {
						context: {
							getModel: function() {
								return {
									getObject: function(param) {
										var returnObject;
										if (param && param === "@Org.OData.Capabilities.V1.FilterRestrictions") {
											returnObject = "";
										}
										if (param && param.slice(0, 1) === "/") {
											returnObject = { $Type: "Edm.Date" };
										}
										return returnObject;
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: -1,
					sMessage: " date and no filter restrictions"
				}
			].forEach(function(oProperty) {
				sandbox.stub(commonHelper, "_getEntitySetPath", function() {
					return "";
				});

				var actualValue = FieldHelper.maxConditions(oProperty.oValue, oProperty.oInterface);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check maxConditions for " + oProperty.sMessage + ": ok");
				sandbox.restore();
			});
		});
	}
);