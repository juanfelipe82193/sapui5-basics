module("Tests for isNavigationPropertyInsertable", {
	beforeEach : function () {
		this.oAnnotationHelper = sap.suite.ui.generic.template.js.AnnotationHelper;

		this.oSourceEntitySet = {
			name: "STTA_C_MP_Product",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
			"Org.OData.Capabilities.V1.NavigationRestrictions": {
				"RestrictedProperties": [
					{
						"InsertRestrictions": {
							"Insertable": {
								"Bool": "true"
							}
						},
						"NavigationProperty": {
							"NavigationPropertyPath": "to_ProductText"
						}
					}
				]
			}
		};

		this.oRelatedEntitySet = {
			name: "STTA_C_MP_ProductText",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
			"Org.OData.Capabilities.V1.InsertRestrictions": {
				"Insertable": {
					"Bool": "true"
				}
			}
		};

		this.oContext = {
			metaModel:  {
				getODataEntityType: function (sQualifiedName, bAsPath) {
					var oODataEntityType = null;
					if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
						oODataEntityType = {
								name: "STTA_C_MP_ProductType",
								entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
						};
					}
					return oODataEntityType;
				},
				getODataAssociationSetEnd: function (oEntityType, sName) {
					var oODataAssociationSetEnd = null;
					if (sName === "to_ProductText") {
						oODataAssociationSetEnd = { entitySet: "STTA_C_MP_ProductText" };
					}
					return oODataAssociationSetEnd;
				}
			}
		};
	},

	afterEach : function() {
		this.oAnnotationHelper = null;
		this.oInterface = {};
		this.oSourceEntitySet = {};
		this.oRelatedEntitySet = {};
	}
});

QUnit.test("isNavigationPropertyInsertable returns true IF insertable = true via NavigationRestriction of root collection", function() {
	equals(this.oAnnotationHelper.isNavigationPropertyInsertable(this.oSourceEntitySet, this.oRelatedEntitySet, this.oContext), "true", "Navigation collection is insertable");
});

QUnit.test("isNavigationPropertyInsertable returns false IF insertable = false via NavigationRestriction of root collection", function() {
	this.oSourceEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
		"Org.OData.Capabilities.V1.NavigationRestrictions": {
			"RestrictedProperties": [
				{
					"InsertRestrictions": {
						"Insertable": {
							"Bool": "false"
						}
					},
					"NavigationProperty": {
						"NavigationPropertyPath": "to_ProductText"
					}
				}
			]
		}
	};

	equals(this.oAnnotationHelper.isNavigationPropertyInsertable(this.oSourceEntitySet, this.oRelatedEntitySet, this.oContext), "false", "Navigation collection is not insertable");
});

QUnit.test("WHEN insertable property is undefined for the NavigationRestrictions of the root collection, isNavigationPropertyInsertable returns true IF insertable = true via InsertRestriction of navigation collection", function() {
	this.oSourceEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
		"Org.OData.Capabilities.V1.NavigationRestrictions": {
			"RestrictedProperties": [
				{
					"NavigationProperty": {
						"NavigationPropertyPath": "to_ProductText"
					}
				}
			]
		}
	};

	equals(this.oAnnotationHelper.isNavigationPropertyInsertable(this.oSourceEntitySet, this.oRelatedEntitySet, this.oContext), "true", "Navigation collection is insertable");
});

QUnit.test("WHEN insertable property is undefined for the NavigationRestrictions of the root collection, isNavigationPropertyInsertable returns false IF insertable = false via InsertRestriction of navigation collection", function() {
	this.oSourceEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
		"Org.OData.Capabilities.V1.NavigationRestrictions": {
			"RestrictedProperties": [
				{
					"NavigationProperty": {
						"NavigationPropertyPath": "to_ProductText"
					}
				}
			]
		}
	};

	this.oRelatedEntitySet = {
		name: "STTA_C_MP_ProductText",
		entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
		"Org.OData.Capabilities.V1.InsertRestrictions": {
			"Insertable": {
				"Bool": "false"
			}
		}
	};

	equals(this.oAnnotationHelper.isNavigationPropertyInsertable(this.oSourceEntitySet, this.oRelatedEntitySet, this.oContext), "false", "Navigation collection is not insertable");
});

QUnit.test("WHEN insertable property is undefined for the NavigationRestrictions of the root collection and InsertRestriction of the navigation collection as well, isNavigationPropertyInsertable returns true", function() {
	this.oSourceEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
		"Org.OData.Capabilities.V1.NavigationRestrictions": {
			"RestrictedProperties": [
				{
					"NavigationProperty": {
						"NavigationPropertyPath": "to_ProductText"
					}
				}
			]
		}
	};

	this.oRelatedEntitySet = {
		name: "STTA_C_MP_ProductText",
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

	equals(this.oAnnotationHelper.isNavigationPropertyInsertable(this.oSourceEntitySet, this.oRelatedEntitySet, this.oContext), true, "Navigation collection is insertable");
});
