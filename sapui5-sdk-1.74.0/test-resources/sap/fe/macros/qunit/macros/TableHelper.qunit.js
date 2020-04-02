/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/ui/thirdparty/sinon", "sap/fe/macros/table/TableHelper", "sap/ui/thirdparty/sinon-qunit"], function(
	sinon,
	TableHelper
) {
	"use strict";
	QUnit.module("Unit Test for getRestrictionsPath");

	QUnit.test("Unit test to check getRestrictionsPath ", function(assert) {
		[
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						Deletable: {
							$Path: "HasDraftEntity"
						}
					}
				},
				bExpectedValue: ", $select: 'HasDraftEntity'",
				sMessage: "with DeleteRestrictions Path"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						Deletable: {
							Bool: "true"
						}
					}
				},
				bExpectedValue: "",
				sMessage: "with DeleteRestrictions Bool"
			},
			{
				oCollection: {},
				bExpectedValue: "",
				sMessage: "without DeleteRestrictions"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.getRestrictionsPath(oProperty.oCollection, "");
			assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check getRestrictionsPath " + oProperty.sMessage + ": ok");
		});
	});

	QUnit.test("Unit test to check getRestrictionsPath for table with OperationAvailable fields", function(assert) {
		[
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "",
				sMessage: "with no OperationAvailable fields",
				sExpectedValue: ""
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden",
				sMessage: "with one OperationAvailable field",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden,OverallSDProcessStatus",
				sMessage: "with two OperationAvailable fields",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden,OverallSDProcessStatus'"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.getRestrictionsPath(oProperty.oCollection, oProperty.sOperationAvailableFields);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check getRestrictionsPath to return string " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check addOperationAvailableFieldsToSelectQuery ", function(assert) {
		[
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return "_it/someProperty";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return { $Path: "_it/someProperty" };
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "EntitySet",
											$Type: "someNamespace.SomeEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with one path based OperationAvailable",
				sExpectedValue: "someProperty"
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath ===
										"/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return undefined;
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return undefined;
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "NavigationProperty",
											$Type: "someNamespace.SomeOtherEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/_SomeNavigationProperty/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with no path based OperationAvailable",
				sExpectedValue: ""
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.addOperationAvailableFieldsToSelectQuery(oProperty.aLineItemCollection, oProperty.oContext);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check addOperationAvailableFieldsToSelectQuery " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check getOperationAvailableMap ", function(assert) {
		[
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return "_it/someProperty";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return { $Path: "_it/someProperty" };
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "EntitySet",
											$Type: "someNamespace.SomeEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with one path based OperationAvailable",
				sExpectedValue: '{"someNamespace.someBoundAction":"someProperty"}'
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath ===
										"/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return undefined;
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return undefined;
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "NavigationProperty",
											$Type: "someNamespace.SomeOtherEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/_SomeNavigationProperty/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with no path based OperationAvailable",
				sExpectedValue: "{}"
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath ===
										"/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return undefined;
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return null;
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "NavigationProperty",
											$Type: "someNamespace.SomeOtherEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/_SomeNavigationProperty/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with OperationAvailable as static null",
				sExpectedValue: '{"someNamespace.someBoundAction":null}'
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.getOperationAvailableMap(oProperty.aLineItemCollection, oProperty.oContext);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check getOperationAvailableMap " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.module("Unit test to check Correct Margin class is Added");
	QUnit.test("Unit test to check if getMarginClass is returning correct margin in case of rating indicators", function(assert) {
		var oCollection = [
			{ "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_1" },
			{ "$Type": "UI.DataFieldForAnnotation", "Label": "Sold-​To Party", "Target": "_SoldToParty/@Communication.Contact" },
			{ "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_2" }
		];
		var oElements = [
			{
				"annotation": { "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_1" },
				"expectedValue": "sapUiNoMarginTop",
				"VisualizationValue": "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
			},
			{
				"annotation": {
					"$Type": "UI.DataFieldForAnnotation",
					"Label": "Sold-​To Party",
					"Target": "_SoldToParty/@Communication.Contact"
				},
				"expectedValue": "sapUiTinyMarginBottom",
				"VisualizationValue": ""
			},
			{
				"annotation": { "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_2" },
				"expectedValue": "sapUiNoMarginBottom sapUiNoMarginTop",
				"VisualizationValue": "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
			}
		];
		oElements.forEach(function(oElement, index) {
			assert.deepEqual(
				TableHelper.getMarginClass(oCollection, oElement.annotation, oElement.VisualizationValue),
				oElement.expectedValue,
				oElement.expectedValue + "is returned for " + index + " entry in array"
			);
		});
	});

	QUnit.test("Unit test to check if getMarginClass is returning correct margin in case of other controls", function(assert) {
		var oCollection = [
			{ "$Type": "UI.DataField", "Value": "datafield_1" },
			{ "$Type": "UI.DataFieldForAnnotation", "Label": "Sold-​To Party", "Target": "_SoldToParty/@Communication.Contact" },
			{ "$Type": "UI.DataField", "Value": "datafield_2" }
		];
		var oElements = [
			{
				"annotation": { "$Type": "UI.DataField", "Value": "datafield_1" },
				"expectedValue": "sapUiTinyMarginBottom",
				"VisualizationValue": ""
			},
			{
				"annotation": {
					"$Type": "UI.DataFieldForAnnotation",
					"Label": "Sold-​To Party",
					"Target": "_SoldToParty/@Communication.Contact"
				},
				"expectedValue": "sapUiTinyMarginBottom",
				"VisualizationValue": ""
			},
			{ "annotation": { "$Type": "UI.DataField", "Value": "datafield_2" }, "expectedValue": "", "VisualizationValue": "" }
		];
		oElements.forEach(function(oElement, index) {
			assert.deepEqual(
				TableHelper.getMarginClass(oCollection, oElement.annotation, oElement.VisualizationValue),
				oElement.expectedValue,
				oElement.expectedValue + "is returned for " + index + " entry in array"
			);
		});
	});

	QUnit.module("Unit test to check if sticky is supported");
	QUnit.test("Unit test to check isStickySessionSupported ", function(assert) {
		[
			{
				oCollection: {},
				oInterface: {
					context: {
						getModel: function() {
							return {
								getMetaPath: function() {
									return "/someParentPath";
								},
								getObject: function(sParam) {
									return {
										"@com.sap.vocabularies.Session.v1.StickySessionSupported": true
									};
								}
							};
						}
					}
				},
				bExpectedValue: true,
				sMessage: "presence of session.stickysession annotation at parent entity"
			},
			{
				oCollection: {},
				oInterface: {
					context: {
						getModel: function() {
							return {
								getMetaPath: function() {
									return "/someParentPath/_childEntity";
								},
								getObject: function(sParam) {
									return {
										"@com.sap.vocabularies.Session.v1.StickySessionSupported": true
									};
								}
							};
						}
					}
				},
				bExpectedValue: true,
				sMessage: "presence of session.stickysession annotation at child entity"
			},
			{
				oCollection: {},
				oInterface: {
					context: {
						getModel: function() {
							return {
								getMetaPath: function() {
									return "/someParentPath";
								},
								getObject: function(sParam) {
									return;
								}
							};
						}
					}
				},
				bExpectedValue: false,
				sMessage: "absence of session.stickysession annotation at parent entity"
			},
			{
				oCollection: {},
				oInterface: {
					context: {
						getModel: function() {
							return {
								getMetaPath: function() {
									return "/someParentPath/_childEntity";
								},
								getObject: function(sParam) {
									return;
								}
							};
						}
					}
				},
				bExpectedValue: false,
				sMessage: "absence of session.stickysession annotation at child entity"
			}
		].forEach(function(oInput) {
			var actualValue = TableHelper.isStickySessionSupported(oInput.oCollection, oInput.oInterface);
			assert.equal(actualValue, oInput.bExpectedValue, "Unit test to check isStickySessionSupported : " + oInput.sMessage + " : ok");
		});
	});
});
