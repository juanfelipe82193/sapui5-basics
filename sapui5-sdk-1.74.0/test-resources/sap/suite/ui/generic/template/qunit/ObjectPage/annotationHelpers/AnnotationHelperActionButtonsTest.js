/*
 * tests for the sap.suite.ui.generic.template.ObjectPage.annotationHelpers.AnnotationHelperActionButtons
 */

sap.ui.define([
	"sap/suite/ui/generic/template/ObjectPage/annotationHelpers/AnnotationHelperActionButtons"
], function(AnnotationHelperActionButtons) {
	"use strict";
	
	module("Tests for isEditButtonRequired", {
	    beforeEach : function () {
	        var oModel = {
	            getODataProperty: function (oType, vName, bAsPath) {
	                var oODataProperty = null;
	                if (oType.name === "STTA_C_MP_ProductType" && vName === "CanUpdate") {
	                    oODataProperty = { name: "CanUpdate", type: "Edm.Boolean" };
	                } else if (oType.name === "STTA_C_MP_ProductRestrictionType" && vName === "CanUpdate"){
	                    oODataProperty = { name: "CanUpdate", type: "Edm.Boolean" };
	                }
	                return oODataProperty;
	            },
	            getODataEntityType: function (sQualifiedName, bAsPath) {
	                var oODataEntityType = null;
	                if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductType" };
	                } else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductRestrictionType" };
	                }
	                return oODataEntityType;
	            },
	            getODataAssociationEnd: function (oEntityType, sName) {
	                var oODataAssociationEnd = null;
	                if (sName === "to_ProductText") {
	                    oODataAssociationEnd = { type: "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType", multiplicity: "0..*" };
	                }
	                return oODataAssociationEnd;
	            }
	        };
	        this.oInterface = {
	        	getInterface: function(i){
	        		return (i === 0) && {
	        			getModel: function(){
	        				return oModel;
	        			}
	        		};
	        	}
	        };
	        this.oEntitySet = {
	        	entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
	        };
	        this.mRestrictions = undefined;
	
	        var Log = sap.ui.require("sap/base/Log");
	        this.stubLogError = sinon.stub(Log, "error");
	    },
	    afterEach : function() {
	        this.stubLogError.restore();
	    }
	});
	
	QUnit.test("Function isEditButtonRequired is available", function() {
	    ok(AnnotationHelperActionButtons.isEditButtonRequired);
	});
	
	QUnit.test("isEditButtonRequired returns true WHEN no update restrictions are there", function() {
	    this.mRestrictions = undefined;
	
	    ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(!this.stubLogError.called, "Error log should not called");
	});
	
	QUnit.test("isEditButtonRequired returns true WHEN Updatable is not  annotated", function() {
	    this.mRestrictions = Object.create(null);
	
	    ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(!this.stubLogError.called, "Error log should not called");
	});
	
	QUnit.test("isEditButtonRequired returns false WHEN Updatable is empty", function() {
	    this.mRestrictions = {
	    	Updatable: Object.create(null)
	    };
	
	    ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(this.stubLogError.called, "Error log should be called once");
	});
	
	QUnit.test("isEditButtonRequired returns false WHEN both updatable and updatable-path are annotated", function() {
	    this.mRestrictions = {
	        "Updatable": {
	            "Bool": "true",
	            "Path": "CanUpdate"
	        }
	    };
	
	    ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(this.stubLogError.called, "Error log should be called once");
	});
	
	QUnit.test("isEditButtonRequired returns true WHEN Updatable is set to true", function() {
	    this.mRestrictions = {
	        "Updatable": {
	            "Bool": "true"
	        }
	    };
	
	    ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(!this.stubLogError.called, "Error log should not called");
	});
	
	QUnit.test("isEditButtonRequired returns false WHEN Updatable is set to false", function() {
	    this.mRestrictions = {
	        "Updatable": {
	            "Bool": "false"
	        }
	    };
	
	    ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(!this.stubLogError.called, "Error log should not called");
	});
	
	QUnit.test("isEditButtonRequired returns true WHEN updatable-path is set to a valid path", function() {
	    this.mRestrictions = {
	        "Updatable": {
	            "Path": "CanUpdate"
	        }
	    };
	
	    ok(AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(!this.stubLogError.called, "Error log should not called");
	});
	
	QUnit.test("isEditButtonRequired returns false WHEN updatable-path is set to a property that is not Edm.Boolean", function() {
	    this.mRestrictions = {
	        "Updatable": {
	            "Path": "CanUpdateBad"
	        }
	    };
	
	    ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(this.stubLogError.calledOnce, "Error log should be called once");
	});
	
	QUnit.test("isEditButtonRequired returns false WHEN updatable-path is set to a property that is not found", function() {
	    this.mRestrictions = {
	        "Updatable": {
	            "Path": "CanUpdateDoesNotExist"
	        }
	    };
	
	    ok(!AnnotationHelperActionButtons.isEditButtonRequired(this.oInterface, this.mRestrictions, this.oEntitySet, false, true, 1));
	    ok(this.stubLogError.calledOnce, "Error log should be called once");
	});
	
	
	module("Tests for getDeleteActionButtonVisibility", {
	    beforeEach : function () {
	        this.oInterface = {
	            getInterface: function (iPart, sPath) {
	                return {
	                    getModel: function() {
	                        return this.oModel;
	                    }.bind(this)
	                }
	            }.bind(this)
	        };
	        this.oModel = {
	            getODataProperty: function (oType, vName, bAsPath) {
	                var oODataProperty = null;
	                if (oType.name === "STTA_C_MP_ProductType" && vName === "CanDelete") {
	                    oODataProperty = { name: "CanDelete", type: "Edm.Boolean" };
	                } else if (oType.name === "STTA_C_MP_ProductRestrictionType" && vName === "CanDelete"){
	                    oODataProperty = { name: "CanDelete", type: "Edm.Boolean" };
	                }
	                return oODataProperty;
	            },
	            getODataEntityType: function (sQualifiedName, bAsPath) {
	                var oODataEntityType = null;
	                if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductType" };
	                } else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType") {
	                    oODataEntityType = { name: "STTA_C_MP_ProductRestrictionType" };
	                }
	                return oODataEntityType;
	            },
	            getODataAssociationEnd: function (oEntityType, sName) {
	                var oODataAssociationEnd = null;
	                if (sName === "to_ProductText") {
	                    oODataAssociationEnd = { type: "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType", multiplicity: "0..*" };
	                }
	                return oODataAssociationEnd;
	            }
	        };
	        this.oEntitySet = {
	        	entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
	        };
	        this.mRestrictions = undefined;

	        var Log = sap.ui.require("sap/base/Log");
	        this.stubLogError = sinon.stub(Log,"error");
	    },
	    afterEach : function() {
	        this.stubLogError.restore();
	    }
	});
	
	QUnit.test("Function getDeleteActionButtonVisibility is available", function() {
	    ok(AnnotationHelperActionButtons.getDeleteActionButtonVisibility);
	});
	
	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/editable}}' WHEN the restriction annotations are undefined (not maintained) for a Draft Application", function() {
	    var expected = "{= !${ui>/editable}}";
	    var bIsDraftEnabled = true;
	    this.mRestrictions = undefined;
	
	    equals(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, bIsDraftEnabled, 1), expected, "Returned expression is correct");
	});
	    
	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/createMode}}' WHEN the restriction annotations are undefined (not maintained) for a Non Draft Application", function() {
	    var expected = "{= !${ui>/createMode}}";
	    var bIsDraftEnabled = false;
	    this.mRestrictions = undefined;
	
		equals(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, bIsDraftEnabled, 1), expected, "Returned expression is correct");
	});
	
	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/editable}}' WHEN the restriction annotations is set to true for a Draft Application", function() {
	    var expected = "{= !${ui>/editable}}";
	    var bIsDraftEnabled = true;
	    this.mRestrictions = {
	        "Deletable": {
	            "Bool": "true"
	        }
	    };
	
	    equals(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, bIsDraftEnabled, 1), expected, "Returned expression is correct");
	});
	
	QUnit.test("Function getDeleteActionButtonVisibility returns '{= !${ui>/createMode}}' WHEN the restriction annotations is set to true for a Non Draft Application", function() {
	    var expected = "{= !${ui>/createMode}}";
	    var bIsDraftEnabled = false;
	    this.mRestrictions = {
	        "Deletable": {
	            "Bool": "true"
	        }
	    };
	
	    equals(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, bIsDraftEnabled, 1), expected, "Returned expression is correct");
	});
	
	QUnit.test("Function getDeleteActionButtonVisibility returns a complex binding WHEN the restriction annotations has a valid Path for a Draft Application", function() {
	    var expected = "{= !!${CanDelete} && !${ui>/editable}}";
	    var bIsDraftEnabled = true;
	    this.mRestrictions = {
	        "Deletable": {
	            "Path": "CanDelete"
	        }
	    };
	
	    equals(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, bIsDraftEnabled, 1), expected, "Returned expression is correct");
	});
	
	QUnit.test("Function getDeleteActionButtonVisibility returns a complex binding WHEN the restriction annotations has a valid Path for a Non Draft Application", function() {
	    var expected = "{= !!${CanDelete} && !${ui>/createMode}}";
	    var bIsDraftEnabled = false;
	    this.mRestrictions = {
	        "Deletable": {
	            "Path": "CanDelete"
	        }
	    };
	
	    equals(AnnotationHelperActionButtons.getDeleteActionButtonVisibility(this.oInterface, this.mRestrictions, this.oEntitySet, bIsDraftEnabled, 1), expected, "Returned expression is correct");
	});
	
	module("Tests for getActionControlBreakoutVisibility");
	
	QUnit.test("Function getActionControlBreakoutVisibility true if no applicablePath is available", function() {
		var sResult = AnnotationHelperActionButtons.getActionControlBreakoutVisibility();
		strictEqual(sResult, true);
	});
	
	QUnit.test("Function getActionControlBreakoutVisibility true if applicablePath is empty string", function() {
		var sResult = AnnotationHelperActionButtons.getActionControlBreakoutVisibility("");
		strictEqual(sResult, true);
	});
	
	QUnit.test("Function getActionControlBreakoutVisibility provides the correct binding string for an applicable path", function() {
		var sResult = AnnotationHelperActionButtons.getActionControlBreakoutVisibility("entity/field");
		strictEqual(sResult, "{path: 'entity/field'}");
	});
});
