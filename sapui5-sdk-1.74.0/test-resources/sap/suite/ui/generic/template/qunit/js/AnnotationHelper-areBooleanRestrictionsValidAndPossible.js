sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {

		module("Tests for areBooleanRestrictionsValidAndPossible", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				var oModel = {
					getODataProperty: function (oType, vName, bAsPath) {
						var oODataProperty = null;
						if (oType.name === "STTA_C_MP_ProductType" && vName === "CanDelete") {
							oODataProperty = {name: "CanDelete", type: "Edm.Boolean"};
						} else if (oType.name === "STTA_C_MP_ProductRestrictionType" && vName === "CanDelete") {
							oODataProperty = {name: "CanDelete", type: "Edm.Boolean"};
						}
						return oODataProperty;
					},
					getODataEntityType: function (sQualifiedName, bAsPath) {
						var oODataEntityType = null;
						if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
							oODataEntityType = {name: "STTA_C_MP_ProductType"};
						} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType") {
							oODataEntityType = {name: "STTA_C_MP_ProductRestrictionType"};
						}
						return oODataEntityType;
					},
					getODataAssociationEnd: function (oEntityType, sName) {
						var oODataAssociationEnd = null;
						if (sName === "to_ProductText") {
							oODataAssociationEnd = {
								type: "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType",
								multiplicity: "0..*"
							};
						}
						return oODataAssociationEnd;
					}
				};
				this.oInterface = {
					getInterface: function (i) {
						return (i === 0) && {
							getModel: function () {
								return oModel;
							}
						};
					}
				};
				this.sEntityTypeName = "STTA_PROD_MAN.STTA_C_MP_ProductType";
				this.mRestrictions = undefined;

				var Log = sap.ui.require("sap/base/Log");
				this.stubLogError = sinon.stub(Log, "error");
			},
			afterEach: function () {
				this.oAnnotationHelper = null;

				this.stubLogError.restore();
			}
		});

		QUnit.test("Function areBooleanRestrictionsValidAndPossible is available", function () {
			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible);
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN neither deletable nor deletable-path are annotated", function () {
			this.mRestrictions = undefined;

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN Deletable is set to true", function () {
			this.mRestrictions = {
				"Deletable": {
					"Bool": "true"
				}
			};

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN Deletable contains value and path", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDelete",
					"Bool": "false"
				}
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable"));
			ok(this.stubLogError.called, "Error log should be called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN Deletable is set to false", function () {
			this.mRestrictions = {
				"Deletable": {
					"Bool": "false"
				}
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN Deletable is set to false, but only validity should be checked", function () {
			this.mRestrictions = {
				"Deletable": {
					"Bool": "false"
				}
			};

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable", true));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN deletable-path is set to a valid path", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDelete"
				}
			};

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN deletable-path is set to a property that is not Edm.Boolean", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDeleteBad"
				}
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable"));
			ok(this.stubLogError.calledOnce, "Error log should be called once");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN deletable-path is set to a property that is not found", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDeleteDoesNotExist"
				}
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.sEntityTypeName, "Deletable"));
			ok(this.stubLogError.calledOnce, "Error log should be called once");
		});
});
