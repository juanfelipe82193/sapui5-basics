sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {

		module("Tests for isRelatedEntityCreatable", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				this.oInterface = {
					getInterface: function (iPart, sPath) {
						return {
							getModel: function () {
								return this.oModel;
							}.bind(this)
						}
					}.bind(this)
				};
				this.oSourceEntitySet = {
					name: "STTA_C_MP_Product",
					entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
					"Org.OData.Capabilities.V1.InsertRestrictions": {
						"NonInsertableNavigationProperties": [
							{
								"If": [
									{"Not": {Path: "CanInsertItems"}},
									{"NavigationPropertyPath": "to_ProductText"}
								]
							}
						]
					}
				};
				this.oRelatedEntitySet = {
					name: "STTA_C_MP_ProductText",
					entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
				};

				this.oModel = {
					getODataProperty: function (oType, vName, bAsPath) {
						var oODataProperty = null;
						if (oType.name === "STTA_C_MP_ProductType" && vName === "CanInsertItems") {
							oODataProperty = {name: "CanInsertItems", type: "Edm.Boolean"};
						} else if (oType.name === "STTA_C_MP_ProductInsertableType" && vName === "CanInsertItems") {
							oODataProperty = {name: "CanInsertItems", type: "Edm.Boolean"};
						}
						return oODataProperty;
					},
					getODataEntityType: function (sQualifiedName, bAsPath) {
						var oODataEntityType = null;
						if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
							oODataEntityType = {
								name: "STTA_C_MP_ProductType",
								entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
							};
						} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductInsertableType") {
							oODataEntityType = {
								name: "STTA_C_MP_ProductInsertableType",
								entityType: "STTA_PROD_MAN.STTA_C_MP_ProductInsertableType"
							};
						}
						return oODataEntityType;
					},
					getODataAssociationSetEnd: function (oEntityType, sName) {
						var oODataAssociationSetEnd = null;
						if (sName === "to_ProductText") {
							oODataAssociationSetEnd = {entitySet: "STTA_C_MP_ProductText"};
						} else if (sName === "to_ProductInsertable") {
							oODataAssociationSetEnd = {entitySet: "STTA_C_MP_ProductInsertable"};
						}
						return oODataAssociationSetEnd;
					},
					getODataAssociationEnd: function (oEntityType, sName) {
						var oODataAssociationEnd = null;
						if (sName === "to_ProductText") {
							oODataAssociationEnd = {
								type: "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
								multiplicity: "0..*"
							};
						} else if (sName === "to_ProductInsertable") {
							oODataAssociationEnd = {
								type: "STTA_PROD_MAN.STTA_C_MP_ProductInsertableType",
								multiplicity: "0..1"
							};
						}
						return oODataAssociationEnd;
					}
				};

				this.stubActionControlExpand = sinon.stub(AnnotationHelper, "_actionControlExpand");
				this.stubHasSubObjectPage = sinon.stub(AnnotationHelper, "hasSubObjectPage", function () {
					return true;
				});
			},
			afterEach: function () {
				this.oAnnotationHelper = null;
				this.oInterface = {};
				this.oSourceEntitySet = {};
				this.oRelatedEntitySet = {};
				this.stubActionControlExpand.restore();
				this.stubHasSubObjectPage.restore();
			}
		});

		QUnit.test("Function isRelatedEntityCreatable is available", function () {
			ok(this.oAnnotationHelper.isRelatedEntityCreatable);
		});

		QUnit.test("isRelatedEntityCreatable returns false WHEN there is no subpage", function () {
			var expected = false;

			this.stubHasSubObjectPage.restore();
			this.stubHasSubObjectPage = sinon.stub(AnnotationHelper, "hasSubObjectPage", function () {
				return false;
			});

			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expected, "Returns 'false' in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expected, "Returns 'false' in non-draft");
		});

		QUnit.test("isRelatedEntityCreatable returns expressions WHEN there is no InsertRestrictions", function () {
			var expectedInDraft = "{= ${ui>/editable}}";
			var expectedInNonDraft = "{= !${ui>/editable}}";

			this.oSourceEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = undefined;
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression '" + expectedInDraft + "' when 'Org.OData.Capabilities.V1.InsertRestrictions' is undefined in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression '" + expectedInNonDraft + " " + "' when 'Org.OData.Capabilities.V1.InsertRestrictions' is undefined in non-draft");

			this.oSourceEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = {};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression '" + expectedInDraft + "' when 'NonInsertableNavigationProperties' is undefined in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression '" + expectedInNonDraft + "' when 'NonInsertableNavigationProperties' is undefined in non-draft");

			this.oSourceEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = {
				"NonInsertableNavigationProperties": []
			};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression '" + expectedInDraft + "' when 'NonInsertableNavigationProperties' has 0 entries in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression '" + expectedInNonDraft + "' when 'NonInsertableNavigationProperties' has 0 entries in non-draft");


		});


		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions", function () {
			var expectedInDraft = "{= ${ui>/editable} ? ${CanInsertItems} : false}";
			var expectedInNonDraft = "{= !${ui>/editable} ? ${CanInsertItems} : false}";

			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");
		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions BUT the navigation path is undefined", function () {
			var expectedInDraft = "{= ${ui>/editable}}";
			var expectedInNonDraft = "{= !${ui>/editable}}";
			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": undefined}
							]
						}
					]
				}
			}
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"NavigationPropertyPath": undefined
						}
					]
				}
			}
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft);
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft);

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"Bad": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductSet"}
							]
						}
					]
				}
			}
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft);
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft);
		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions that is a navigation path", function () {
			var expectedInDraft = "{= ${ui>/editable} ? ${to_ProductInsertable/CanInsertItems} : false}";
			var expectedInNonDraft = "{= !${ui>/editable} ? ${to_ProductInsertable/CanInsertItems} : false}";
			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "to_ProductInsertable/CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			}
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns false WHEN there is 1 InsertRestrictions with no condition", function () {
			var expected = false;

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"NavigationPropertyPath": "to_ProductText"
						}
					]
				}
			};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expected, "Returns 'false' in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expected, "Returns 'false' in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions with only 1 IF condition", function () {
			var expectedInDraft = "{= ${ui>/editable} ? !${CanInsertItems} : false}";
			var expectedInNonDraft = "{= !${ui>/editable} ? !${CanInsertItems} : false}";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{Path: "CanInsertItems"},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions with a NavigationPropertyPath that does not exist", function () {
			var expectedInDraft = "{= ${ui>/editable}}";
			var expectedInNonDraft = "{= !${ui>/editable}}";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_NotARealNavigationPath"}
							]
						}
					]
				}
			};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns false WHEN there is 1 InsertRestrictions BUT the creatable-path does not exist", function () {
			var expected = false;

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "DoesNotExist"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expected, "Returns 'false' in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expected, "Returns 'false' in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 2 InsertRestrictions", function () {
			var expectedInDraft = "{= ${ui>/editable} ? ${CanInsertItems} : false}";
			var expectedInNonDraft = "{= !${ui>/editable} ? ${CanInsertItems} : false}";
			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 4 InsertRestrictions", function () {
			var expectedInDraft = "{= ${ui>/editable} ? ${CanInsertItems} : false}";
			var expectedInNonDraft = "{= !${ui>/editable} ? ${CanInsertItems} : false}";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath2"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath3"}
							]
						}
					]
				}
			};
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			equals(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});
});
