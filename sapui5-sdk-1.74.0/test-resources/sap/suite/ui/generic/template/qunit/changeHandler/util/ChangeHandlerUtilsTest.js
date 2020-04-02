/**
 * tests for the sap.suite.ui.generic.template.changeHandler.ChangeHandlerUtils
 */

sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/ui/commons/Button",
		"sap/suite/ui/generic/template/changeHandler/js/AnnotationHelperForDesignTime",
		"sap/suite/ui/generic/template/js/AnnotationHelper"
	],
	function (sinon, Utils, Button, AnnotationHelperForDesignTime, AnnotationHelper) {
		"use strict";

		var FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup";
		var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";
		var FACETS = "com.sap.vocabularies.UI.v1.Facets";

		QUnit.module("The function getComponent", {

			beforeEach: function () {
				var oMetaModel = {
					getODataEntitySet: function () {
						return {
							entityType: "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType"
						};
					},
					getODataEntityType: function () {
						return {
							"com.sap.vocabularies.UI.v1.LineItem": [{
								Value: {
									Path: "Column1Property"
								}
							}, {
								Value: {
									Path: "Column2Property"
								}
							}],
							property: [
								"newColumn"
							]
						};
					}
				};
				this.oGetMetaModelStub = sinon.stub(Utils, "getMetaModel").returns(oMetaModel);

				var oController = {
					getOwnerComponent: function () {
						return {
							getEntitySet: function () {
								return {
									entityType: "EntityType",
									name: "EntitySet"
								};
							}
						};
					}
				};
				this.oControllerStub = sinon.stub(Utils, "getController").returns(oController);

				this.oElementStub = {
					getId: function () {
						return "tableId";
					},
					getParent: function () {
						return {
							id: "myParent",
							getEntitySet: function () {
								return "SEPMRA_C_PD_Product";
							},
							getParent: function () {
								return;
							}
						};
					}
				};

			},
			afterEach: function () {
				this.oGetMetaModelStub.restore();
				this.oControllerStub.restore();
			}
		});

		QUnit.test("getComponent", function () {
			// Arrange
			var oButton = sinon.createStubInstance(Button);

			// Act
			var oComponent = Utils.getComponent(oButton);

			// Assert
			assert.equal(oComponent, undefined, "returns undefined if no component exists");
		});

		QUnit.test("getComponent", function () {
			// Arrange
			var oComponent = new sap.ui.core.UIComponent();

			// Act
			var oIsItMe = Utils.getComponent(oComponent);

			// Assert
			assert.equal(oIsItMe, oComponent, "returns own component if component gets passed");
		});

		QUnit.test("getComponent", function () {
			// Arrange
			var oElement = this.oElementStub;

			// Act
			var oComponent = Utils.getComponent(oElement);

			// Assert
			assert.equal(oComponent, undefined, "returns undefined if no component exists");
		});

		QUnit.module("The function getODataEntitySet");

		QUnit.test("getODataEntitySet", function () {
			// Arrange
			var oEntitySetStub = {
				name: "EntitySet",
				entityType: "EntityType"
			};
			var oComponent = {
				getModel: function () {
					return {
						getMetaModel: function () {
							return {
								getODataEntitySet: function () {
									return oEntitySetStub;
								}
							};
						}
					};
				},
				getEntitySet: function () {
					return "EntitySet";

				},
				getParent: function () {
					return;
				}
			};

			// Act
			var oEntitySet = Utils.getODataEntitySet(oComponent);

			// Assert
			assert.equal(oEntitySet, oEntitySetStub, "returns the entitySet as defined");

		});
		QUnit.test("getODataEntitySet", function () {
			// Arrange
			var oComponent = {
				getModel: function () {
					return {
						getMetaModel: function () {
							return {
								getODataEntitySet: function () {
									return;
								}
							};
						}
					};
				},
				getParent: function () {
					return;
				}
			};
			// Act
			var oEntitySet = Utils.getODataEntitySet(oComponent);

			// Assert
			assert.equal(oEntitySet, null, "returns null if no entitySet is defined");
		});

		QUnit.module("The function getEntityType");

		QUnit.test("getEntityType", function () {
			// Arrange
			var oComponent = {
				getEntitySet: function () {
					return "EntitySet";
				}
			};
			this.oComponentStub = sinon.stub(Utils, "getComponent").returns(oComponent);

			var oEntitySetStub = {
				name: "EntitySet",
				entityType: "EntityType"
			};
			var oElement = {
				getModel: function () {
					return {
						getMetaModel: function () {
							return {
								getODataEntitySet: function () {
									return oEntitySetStub;
								}
							};
						}
					};
				},
				getEntitySet: function () {
					return "EntitySet";

				}
			};

			// Act
			var sEntityType = Utils.getEntityType(oElement);

			// Assert
			assert.equal(sEntityType, "EntityType", "returns the EntityType as defined");

			this.oComponentStub.restore();
		});
		QUnit.test("getEntityType", function () {
			// Arrange
			var oComponent = {
				getEntitySet: function () {
					return "EntitySet";
				}
			};
			this.oComponentStub = sinon.stub(Utils, "getComponent").returns(oComponent);

			var oEntitySetStub = {
				name: "EntitySet",
				entityType: "ns.EntityType"
			};
			var oElement = {
				getModel: function () {
					return {
						getMetaModel: function () {
							return {
								getODataEntitySet: function () {
									return oEntitySetStub;
								}
							};
						}
					};
				}
			};

			// Act
			var sEntityType = Utils.getEntityType(oElement);

			// Assert
			assert.equal(sEntityType, "ns.EntityType", "returns the EntityType derived from the EntitySet, with namespace");

			this.oComponentStub.restore();
		});
		QUnit.test("getEntityType", function () {
			// Arrange
			var oComponent = {
				getEntitySet: function () {
					return "EntitySet";
				}
			};
			this.oComponentStub = sinon.stub(Utils, "getComponent").returns(oComponent);

			var oElement = {
				getModel: function () {
					return {
						getMetaModel: function () {
							return {
								getODataEntitySet: function () {
									return;
								}
							};
						}
					};
				},
				getParent: function () {
					return;
				}
			};
			// Act
			var oEntityType = Utils.getEntityType(oElement);

			// Assert
			assert.equal(oEntityType, null, "returns null if no EntitySet is defined");

			this.oComponentStub.restore();
		});

		QUnit.module("The function getODataEntityType", {
			beforeEach: function () {
				this.sEntitySet = "SEPMRA_C_PD_Product";
				this.sElementName = "sap.ui.comp.smarttable.SmartTable";
				this.sId = "tableId";
				this.oModelStub = {};
				this.sTableBindingPath = undefined;
				var that = this;
				this.oDataEntityTypeStub = {
					"com.sap.vocabularies.UI.v1.LineItem": [{
						Value: {
							Path: "Column1Property"
						}
					}, {
						Value: {
							Path: "Column2Property"
						}
					}],
					property: [
						"newColumn"
					]
				};
				this.oMetaModel = {
					getODataEntitySet: function () {
						return {
							entityType: "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType"
						};
					},
					getODataEntityType: function () {
						return that.oDataEntityTypeStub;
					}.bind(this)
				};
				this.oComponent = {
					getEntitySet: function () {
						return "EntitySet";
					}
				};
				this.oElementStub = {
					getId: function () {
						return that.sId;
					},
					getModel: function () {
						return that.oModelStub;
					},
					getParent: function () {
						return {
							id: "myParent",
							getEntitySet: function () {
								return that.sEntitySet;
							},
							getParent: function () {
								return;
							}
						};
					},
					getMetadata: function () {
						return {
							getElementName: function () {
								return that.sElementName;
							}
						}
					}
				};
				this.oSmartTable = {
					getTableBindingPath: function () {
						return that.sTableBindingPath;
					}
				};
			},
			afterEach: function () {}
		});

		QUnit.test("getODataEntityType", function () {
			// Arrange
			var that = this;
			this.oModelStub = {
				getMetaModel: function () {
					return that.oMetaModel;
				}
			};
			this.oGetModelStub = sinon.stub(Utils, "getModel").returns(this.oModelStub);

			this.oComponentStub = sinon.stub(Utils, "getComponent").returns(this.oComponent);

			// Act
			var oEntityType = Utils.getODataEntityType(this.oElementStub);

			// Assert
			assert.equal(oEntityType, this.oDataEntityTypeStub, "returns the ODataEntityType as defined");

			this.oGetModelStub.restore();
			this.oComponentStub.restore();
		});

		QUnit.test("getODataEntityType", function () {
			// Arrange
			this.sEntitySet = undefined;
			var oMetaModel = {
				getODataEntitySet: function () {
					return;
				},
				getODataEntityType: function () {
					return;
				}
			};
			this.oGetMetaModelStub = sinon.stub(Utils, "getMetaModel").returns(oMetaModel);

			this.oModelStub = {
				getMetaModel: function () {
					return oMetaModel;
				}
			};
			this.oGetModelStub = sinon.stub(Utils, "getModel").returns(this.oModelStub);

			// Act
			var oEntityType = Utils.getODataEntityType(this.oElementStub);

			// Assert
			assert.equal(oEntityType, null, "returns null if no entitySet is defined");

			this.oGetMetaModelStub.restore();
			this.oGetModelStub.restore();
		});

		QUnit.test("getODataEntityType", function () {
			// Arrange
			var that = this;
			this.sId = "sap.suite.ui.generic.template.ObjectPage.view.Details/tableId";

			this.oModelStub = {
				getMetaModel: function () {
					return that.oMetaModel;
				}
			};
			this.oGetModelStub = sinon.stub(Utils, "getModel").returns(this.oModelStub);

			this.oComponent = {
				getEntitySet: function () {
					return "EntitySet";
				}
			};
			this.oComponentStub = sinon.stub(Utils, "getComponent").returns(this.oComponent);

			this.oGetSmartTableControlStub = sinon.stub(AnnotationHelper, "getSmartTableControl").returns(this.oSmartTable);
			// Act
			var oEntityType = Utils.getODataEntityType(this.oElementStub);

			// Assert
			assert.equal(oEntityType, this.oDataEntityTypeStub,
				"returns the ODataEntityType as defined in Object Page when table does not have navigation path");

			this.oGetModelStub.restore();
			this.oComponentStub.restore();
			this.oGetSmartTableControlStub.restore();
		});

		QUnit.test("getODataEntityType", function () {
			// Arrange
			var that = this;
			var oEntityType = {
				entityType: this.oDataEntityTypeStub
			}
			this.sId = "sap.suite.ui.generic.template.ObjectPage.view.Details/tableId";
			this.sTableBindingPath = "to_ProductText";

			this.oModelStub = {
				getMetaModel: function () {
					return that.oMetaModel;
				}
			};
			this.oGetModelStub = sinon.stub(Utils, "getModel").returns(this.oModelStub);

			this.oComponent = {
				getEntitySet: function () {
					return "EntitySet";
				}
			};
			this.oComponentStub = sinon.stub(Utils, "getComponent").returns(this.oComponent);

			this.oGetSmartTableControlStub = sinon.stub(AnnotationHelper, "getSmartTableControl").returns(this.oSmartTable);
			this.oGetRelevantDataForAnnotationRecordStub = sinon.stub(AnnotationHelper, "getRelevantDataForAnnotationRecord").returns(oEntityType);
			// Act
			var oEntityType = Utils.getODataEntityType(this.oElementStub);

			// Assert
			assert.equal(oEntityType, this.oDataEntityTypeStub,
				"returns the ODataEntityType as defined in Object Page when table has navigation path");

			this.oGetModelStub.restore();
			this.oComponentStub.restore();
			this.oGetSmartTableControlStub.restore();
			this.oGetRelevantDataForAnnotationRecordStub.restore();
		});

		QUnit.test("getODataEntityType", function () {
			// Arrange
			var that = this;
			var oEntityType = {
				entityType: this.oDataEntityTypeStub
			};
			this.sId = "sap.suite.ui.generic.template.ObjectPage.view.Details/Id";
			this.sElementName = "GroupElement";

			this.oModelStub = {
				getMetaModel: function () {
					return that.oMetaModel;
				}
			};
			this.oGetModelStub = sinon.stub(Utils, "getModel").returns(this.oModelStub);

			this.oComponent = {
				getEntitySet: function () {
					return "EntitySet";
				}
			};
			this.oComponentStub = sinon.stub(Utils, "getComponent").returns(this.oComponent);

			this.oGetSmartTableControlStub = sinon.stub(AnnotationHelper, "getSmartTableControl").returns(this.oSmartTable);
			this.oGetRelevantDataForAnnotationRecordStub = sinon.stub(AnnotationHelper, "getRelevantDataForAnnotationRecord").returns(oEntityType);
			// Act
			var oEntityType = Utils.getODataEntityType(this.oElementStub);

			// Assert
			assert.equal(oEntityType, this.oDataEntityTypeStub, "returns undefined control is not of table type");

			this.oGetModelStub.restore();
			this.oComponentStub.restore();
			this.oGetSmartTableControlStub.restore();
			this.oGetRelevantDataForAnnotationRecordStub.restore();
		});

		QUnit.module("The function getODataEntityType for GroupElement", {
			beforeEach: function () {
				var that = this;
				this.sElementName = "sap.ui.comp.smartform.GroupElement";
				this.sDeepPath = "";
				this.entitySet = {
					entityType: "EntityType"
				};
				this.entityType = {
					associated: false
				};
			    this.associatedEntityType = {
					associated: true
				};
				this.oComponent = {
					getEntitySet: function(){
						return "EntitySet";
					}
				};
				this.metaModelStub = {
					getODataEntitySet: function(sEntitySet){
						return that.entitySet;
					},
					getODataEntityType: function(sEntityType){
						return that.entityType;
					},
					getODataAssociationEnd: function(oDataEntityType, sFormNavigationPath){
						if(sFormNavigationPath == "to_Supplier"){
							return {};
						}else{
							return null;
						}
					}
				};
				this.modelStub = {
					getMetaModel: function(){
						return that.metaModelStub;
					}
				};
				this.oManagedObject = {
					getModel: function(){
						return that.modelStub;
					},
					getId: function(){
						return "sap.suite.ui.generic.template.ObjectPage.view.Details-groupElementId";
					},
					getMetadata: function(){
						return {
							getElementName: function(){
								return that.sElementName;
							}
						}
					},
					getBindingContext: function(){
						return {
							sDeepPath: that.sDeepPath
						}
					}
				};
			},
			afterEach: function () {}
		});

		QUnit.test("getODataEntityType without associaton", function () {
			// Arrange
			this.sDeepPath = "/STTA_C_MP_Product(Product='EPM-000193',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)/to_Product";
			var ChangeHandlerUtils = Utils;
			this.oComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent").returns(this.oComponent);
			var expectedEntityType = this.entityType;
			// Act
			var oEntityType = Utils.getODataEntityType(this.oManagedObject);
			// Assert
			assert.deepEqual(oEntityType, expectedEntityType, "returns elements entity type");
			//clean
			this.oComponentStub.restore();
		});

		QUnit.test("getODataEntityType with association", function () {
			// Arrange
			this.sDeepPath = "/STTA_C_MP_Product(Product='EPM-000193',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)/to_Supplier";
			var ChangeHandlerUtils = Utils;
			this.oComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent").returns(this.oComponent);
			this.oGetRelevantDataForAnnotationRecordStub = sinon.stub(AnnotationHelper, "getRelevantDataForAnnotationRecord").returns({
				entityType: this.associatedEntityType
			});
			var expectedEntityType = this.associatedEntityType;
			// Act
			var oEntityType = Utils.getODataEntityType(this.oManagedObject);
			// Assert
			assert.deepEqual(oEntityType, expectedEntityType, "returns associated entity type");
			//clean
			this.oComponentStub.restore();
			this.oGetRelevantDataForAnnotationRecordStub.restore();
		});

		QUnit.module("The function getSmartFormGroupInfo");

		QUnit.test("getSmartFormGroupInfo", function () {
			// Arrange
			var oFacet = {
				Target: {
					AnnotationPath: [FIELDGROUP]
				},
				ID: {
					String: "HitMe"
				}
			};
			var aFacets = [oFacet];
			var oExpectedResult = {
				aForm: aFacets,
				oGroup: oFacet
			};

			// Act
			var oResult = Utils.getSmartFormGroupInfo("HitMe", aFacets);

			// Assert
			assert.deepEqual(oResult, oExpectedResult, "returns the right facet for a field group on first level");
		});

		QUnit.test("getSmartFormGroupInfo", function () {
			// Arrange
			var oFacet = {
				Target: {
					AnnotationPath: [IDENTIFICATION]
				},
				ID: {
					String: "HitMe"
				}
			};
			var aFacets = [oFacet];
			var oExpectedResult = {
				aForm: aFacets,
				oGroup: oFacet
			};

			// Act
			var oResult = Utils.getSmartFormGroupInfo("HitMe", aFacets);

			// Assert
			assert.deepEqual(oResult, oExpectedResult, "returns the right facet for an identification on first level");
		});

		QUnit.test("getSmartFormGroupInfo", function () {
			// Arrange
			var oFacet = {
				Target: {
					AnnotationPath: [IDENTIFICATION]
				},
				ID: {
					String: "HitMe"
				}
			};
			var aFacetsL2 = [{
				Facets: [oFacet]
			}];
			var oExpectedResult = {
				aForm: [oFacet],
				oGroup: oFacet
			};

			// Act
			var oResult = Utils.getSmartFormGroupInfo("HitMe", aFacetsL2);

			// Assert
			assert.deepEqual(oResult, oExpectedResult, "returns the right facet for an identification on second level");
		});

		QUnit.test("getSmartFormGroupInfo", function () {
			// Arrange
			var oFacet = {
				Target: {
					AnnotationPath: [IDENTIFICATION]
				},
				ID: {
					String: "HitMe"
				}
			};
			var aFacetsL3 = [{
				Facets: [{
					Facets: [oFacet]
				}]
			}];
			var oExpectedResult = {
				aForm: [oFacet],
				oGroup: oFacet
			};

			// Act
			var oResult = Utils.getSmartFormGroupInfo("HitMe", aFacetsL3);

			// Assert
			assert.deepEqual(oResult, oExpectedResult, "returns the right facet for an identification on third level");
		});

		QUnit.test("getSmartFormGroupInfo", function () {
			// Arrange
			var oFacet = {
				Target: {
					AnnotationPath: [IDENTIFICATION]
				},
				ID: {
					String: "HitMe"
				}
			};
			var aFacetsL3 = [{
				Facets: [{
					Facets: [oFacet]
				}]
			}];

			// Act
			var oResult = Utils.getSmartFormGroupInfo("NoHit", aFacetsL3);

			// Assert
			assert.equal(oResult, null, "returns null if the group cannot be found");
		});

		QUnit.module("The function getCollectionFacet");

		QUnit.test("getCollectionFacet", function () {
			// Arrange
			var oFacet = {
				ID: {
					String: "HitMe"
				}
			};
			var aFacets = [oFacet];

			// Act
			var oResult = Utils.getCollectionFacet("HitMe", aFacets);

			// Assert
			assert.deepEqual(oResult, oFacet, "returns the right facet on first level");
		});

		QUnit.test("getCollectionFacet", function () {
			// Arrange
			var oFacet = {
				ID: {
					String: "HitMe"
				}
			};
			var aFacetsL2 = [{
				Facets: [oFacet]
			}];

			// Act
			var oResult = Utils.getCollectionFacet("HitMe", aFacetsL2);

			// Assert
			assert.deepEqual(oResult, oFacet, "returns the right facet on second level");
		});

		QUnit.test("getCollectionFacet", function () {
			// Arrange
			var oFacet = {
				ID: {
					String: "HitMe"
				}
			};
			var aFacetsL2 = [{
				Facets: [oFacet]
			}];

			// Act
			var oResult = Utils.getCollectionFacet("NoHit", aFacetsL2);

			// Assert
			assert.equal(oResult, null, "returns null if the facet cannot be found");
		});

		QUnit.module("The function createNewFieldGroup");

		QUnit.test("createFieldGroup", function () {
			// Arrange
			var oOldLineItemRecord = {
				Label: "My_Label",
				Value: {
					Path: "ProductForEdit"
				}
			};
			var oExpectedValue = {
				"Data": [{
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"Value": {
						"Path": "ProductForEdit"
					}
				}],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			};
			// Act
			var oFieldGroup = Utils.createNewFieldGroup(oOldLineItemRecord);

			// Assert
			assert.deepEqual(oFieldGroup, oExpectedValue, "Returns the right Field group if item has value");
		});

		QUnit.test("createFieldGroup", function () {
			// Arrange
			var oOldLineItemRecord = {
				Label: "My_Label"
			};
			var oExpectedValue = {
				"Data": [{
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"Value": {
						"Path": ""
					}
				}],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			};

			// Act
			var oFieldGroup = Utils.createNewFieldGroup(oOldLineItemRecord);

			// Assert
			assert.deepEqual(oFieldGroup, oExpectedValue, "Returns the right Field group if item does not have a value");
		});

		QUnit.module("The function createFieldGroupTerm");

		QUnit.test("createFieldGroupTerm", function () {
			// Arrange
			var oEntityType = {};

			// Act
			var sTerm = Utils.createFieldGroupTerm(oEntityType);

			// Assert
			assert.equal(sTerm, "com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup0", "returns the right term if no field group exists yet");
		});

		QUnit.test("createFieldGroupTerm", function () {
			// Arrange
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.FieldGroup": {
					entry: "dummy"
				}
			};

			// Act
			var sTerm = Utils.createFieldGroupTerm(oEntityType);

			// Assert
			assert.equal(sTerm, "com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup0", "returns the right term if no RTA field group exists yet");
		});

		QUnit.test("createFieldGroupTerm", function () {
			// Arrange
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.FieldGroup": {
					entry: "dummy"
				},
				"com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup0": {
					entry: "dummy"
				}
			};

			// Act
			var sTerm = Utils.createFieldGroupTerm(oEntityType);

			// Assert
			assert.equal(sTerm, "com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup1", "returns the right term if no RTA group exists");
		});

		QUnit.test("createFieldGroupTerm", function () {
			// Arrange
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup2": {
					entry: "dummy"
				},
				"com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup0": {
					entry: "dummy"
				},
				"com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup3": {
					entry: "dummy"
				}
			};

			// Act
			var sTerm = Utils.createFieldGroupTerm(oEntityType);

			// Assert
			assert.equal(sTerm, "com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup4",
				"returns the right term if RTA groups are listed in wrong order");
		});

		QUnit.module("The function getSmartFilterBarControlConfiguration", {
			beforeEach: function () {
				this.config1 = {
					sId: "config1",
					getKey: function () {
						return "key1";
					}
				};
				this.config2 = {
					sId: "config1",
					getKey: function () {
						return "key2";
					}
				};

				var oControlConfiguration = [this.config1, this.config2];
				var oFilterBar = {
					getControlConfiguration: function () {
						return oControlConfiguration;
					}
				};
				this.oFindSmartFilterBarStub = sinon.stub(Utils, "findSmartFilterBar").returns(oFilterBar);

			},
			afterEach: function () {
				this.oFindSmartFilterBarStub.restore();
			}
		});

		QUnit.test("getSmartFilterBarControlConfiguration", function () {
			// Arrange
			var oVerticalLayout = {
				getContent: function () {
					return [{
						getId: function () {
							return "Positive-Test-key1";
						}
					}];
				}
			};

			// Act
			var oControlConfig = Utils.getSmartFilterBarControlConfiguration(oVerticalLayout);

			// Assert
			assert.deepEqual(oControlConfig, this.config1, "returns the right control configuration, first key is found");
		});

		QUnit.test("getSmartFilterBarControlConfiguration", function () {
			// Arrange
			var oVerticalLayout = {
				getContent: function () {
					return [{
						getId: function () {
							return "Positive-Test-key2";
						}
					}];
				}
			};

			// Act
			var oControlConfig = Utils.getSmartFilterBarControlConfiguration(oVerticalLayout);

			// Assert
			assert.deepEqual(oControlConfig, this.config2, "returns the right control configuration, second key is found");
		});

		QUnit.test("getSmartFilterBarControlConfiguration", function () {
			// Arrange
			var oVerticalLayout = {
				getContent: function () {
					return [{
						getId: function () {
							return "Negative-Test-key3";
						}
					}];
				}
			};

			// Act
			var oControlConfig = Utils.getSmartFilterBarControlConfiguration(oVerticalLayout);

			// Assert
			assert.equal(oControlConfig, null, "returns null if the key cannot be found");
		});

		QUnit.module("The function findSmartFilterBar", {
			beforeEach: function () {
				this.oFilterBarStub = {
					getMetadata: function () {
						return {
							getName: function () {
								return "sap.ui.comp.smartfilterbar.SmartFilterBar";
							}
						};
					}

				};
			}
		});

		QUnit.test("findSmartFilterBar", function () {
			// Arrange

			// Act
			var oSmartFilterBar = Utils.findSmartFilterBar(this.oFilterBarStub);

			// Assert
			assert.deepEqual(oSmartFilterBar, this.oFilterBarStub, "returns the current filter bar");
		});

		QUnit.test("findSmartFilterBar", function () {
			// Arrange
			var oElementStub = {
				getParent: function () {
					return this.oFilterBarStub;
				}.bind(this),
				getMetadata: function () {
					return {
						getName: function () {
							return "Hugo";
						}
					};
				}
			}

			// Act
			var oSmartFilterBar = Utils.findSmartFilterBar(oElementStub);

			// Assert
			assert.deepEqual(oSmartFilterBar, this.oFilterBarStub, "returns the filter bar as parent element");
		});

		QUnit.test("findSmartFilterBar", function () {
			// Arrange
			var oElementStub = {
				getParent: function () {
					return;
				},
				getMetadata: function () {
					return {
						getName: function () {
							return "Hugo";
						}
					};
				}
			}

			// Act
			var oSmartFilterBar = Utils.findSmartFilterBar(oElementStub);

			// Assert
			assert.equal(oSmartFilterBar, undefined, "returns null for invalid child element");
		});

		// Path is not defined.
		QUnit.test("getIndexFromInstanceMetadataPath could not return a valid index", function () {
			// Arrange
			var oTemplatingInfo = {
				path: undefined
			};
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(oTemplatingInfo);
			// Act
			var iRecordIndex = Utils.getIndexFromInstanceMetadataPath();
			// Assert
			assert.equal(iRecordIndex, -1, "Could not find valid index");
			this.oTemplatingInfoStub.restore();
		});

		// Path is defined.
		QUnit.test("getIndexFromInstanceMetadataPath returns a valid index", function () {
			// Arrange
			var oTemplatingInfo = {
				path: "/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.Facets/0/Facets/0"
			};
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(oTemplatingInfo);
			// Act
			var iRecordIndex = Utils.getIndexFromInstanceMetadataPath();
			// Assert
			assert.notEqual(iRecordIndex != -1, "Valid index found");
			this.oTemplatingInfoStub.restore();
		});

		QUnit.module("The function getCustomDataObject");

		QUnit.test("getCustomDataObject", function () {
			// Arrange
			var oElementStub = {
				getCustomData: function () {
					return [{
						getKey: function () {
							return "sap-ui-custom-settings";
						},
						getValue: function () {
							return {
								"sap.build": "#patternX"
							};
						}
					}, {
						getKey: function () {
							return "Type";
						},
						getValue: function () {
							return "com.sap.vocabularies.UI.v1.DataFieldForAction";
						}
					}, {
						getKey: function () {
							return "Action";
						},
						getValue: function () {
							return "EntitySet/Action";
						}
					}, {
						getKey: function () {
							return "Label";
						},
						getValue: function () {
							return "Activate";
						}
					}, {
						getKey: function () {
							return "InvocationGrouping";
						},
						getValue: function () {
							return "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet";
						}
					}];
				}
			};
			var oCustomDataExpected = {
				Action: "EntitySet/Action",
				InvocationGrouping: "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet",
				Label: "Activate",
				Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				"sap-ui-custom-settings": {
					"sap.build": "#patternX"
				}
			};

			// Act
			var oCustomData = Utils.getCustomDataObject(oElementStub);

			// Assert
			assert.deepEqual(oCustomData, oCustomDataExpected, "returns the custom data for a toolbar button");
		});

		QUnit.test("getCustomDataObject", function () {
			// Arrange
			var oP13nDataValueStub = {
				columnKey: "ProductCategory",
				displayBehaviour: "descriptionAndId",
				edmType: "Edm.String",
				filterProperty: "ProductCategory"
			}
			var oElementStub = {
				getCustomData: function () {
					return [{
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};
			var oCustomDataExpected = {
				p13nData: oP13nDataValueStub
			};

			// Act
			var oCustomData = Utils.getCustomDataObject(oElementStub);

			// Assert
			assert.deepEqual(oCustomData, oCustomDataExpected, "returns the custom data for a column");
		});

		QUnit.test("getCustomDataObject", function () {
			// Arrange
			var oCustomSettingsStub = {
				"sap.ui.dt": {
					designtime: "sap/suite/ui/generic/template/designtime/ListReport.designtime"
				},
				"sap.ui.fl": {
					flexibility: "sap/suite/ui/generic/template/ListReport/flexibility/ListReport.flexibility"
				}
			};
			var oElementStub = {
				getCustomData: function () {
					return [{
						getKey: function () {
							return "sap-ui-custom-settings";
						},
						getValue: function () {
							return oCustomSettingsStub;
						}
					}];
				}
			};
			var oCustomDataExpected = {
				"sap-ui-custom-settings": oCustomSettingsStub
			};

			// Act
			var oCustomData = Utils.getCustomDataObject(oElementStub);

			// Assert
			assert.deepEqual(oCustomData, oCustomDataExpected, "returns the custom data for the list report");
		});

		QUnit.test("getCustomDataObject", function () {
			// Arrange
			var oElementStub = {
				getCustomData: function () {
					return;
				}
			};

			// Act
			var oCustomData = Utils.getCustomDataObject(oElementStub);

			// Assert
			assert.equal(oCustomData, undefined, "returns undefined if no custom data exist");
		});

		QUnit.module("The function getLineItems", {
			beforeEach: function () {
				this.oLineItemStub = [{
					Value: {
						Path: "Column1Property"
					}
				}, {
					Value: {
						Path: "Column2Property"
					}
				}];
				this.oDataEntityTypeStub = {
					"com.sap.vocabularies.UI.v1.LineItem": this.oLineItemStub,
					property: [
						"newColumn"
					]
				};
			}
		});

		QUnit.test("getLineItems", function () {
			// Arrange
			var oElementStub = {
				getId: function () {
					return "tableId";
				}
			}; //dummy

			this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aLineItems = Utils.getLineItems(oElementStub);

			// Assert
			assert.deepEqual(aLineItems, this.oLineItemStub, "returns the line items for a column");

			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("getLineItems", function () {
			// Arrange
			var oElementStub = {
				getId: function () {
					return "tableId";
				}
			}; //dummy
			this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType");

			// Act
			var aLineItems = Utils.getLineItems(oElementStub);

			// Assert
			assert.equal(aLineItems, undefined, "returns no line items if no entity type is found");

			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("getLineItems", function () {
			// Arrange
			var oElementStub = {
				getId: function () {
					return "sap.suite.ui.generic.template.ObjectPage.view.Details/TableId";
				},
				getCustomData: function () {
					return;
				}
			}; //dummy
			this.oGetSmartTableControl = sinon.stub(AnnotationHelper, "getSmartTableControl").returns(oElementStub);
			this.oGetLineItemQualifier = sinon.stub(AnnotationHelper, "getLineItemQualifier");
			this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aLineItems = Utils.getLineItems(oElementStub);

			// Assert
			assert.equal(aLineItems, this.oLineItemStub, "returns the line items for a column in Object Page");

			this.oGetODataEntityTypeStub.restore();
			this.oGetSmartTableControl.restore();
			this.oGetLineItemQualifier.restore();
		});

		QUnit.test("getLineItems", function () {
			// Arrange
			var oElementStub = {
				getId: function () {
					return "sap.suite.ui.generic.template.ObjectPage.view.Details/TableId";
				},
				getCustomData: function () {
					return;
				}
			}; //dummy
			this.oDataEntityTypeStub = {
				"com.sap.vocabularies.UI.v1.LineItem#Qualifier": this.oLineItemStub,
				property: [
					"newColumn"
				]
			};
			this.oGetSmartTableControl = sinon.stub(AnnotationHelper, "getSmartTableControl").returns(oElementStub);
			this.oGetLineItemQualifier = sinon.stub(AnnotationHelper, "getLineItemQualifier").returns("Qualifier");
			this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aLineItems = Utils.getLineItems(oElementStub);

			// Assert
			assert.equal(aLineItems, this.oLineItemStub, "returns the line items for a column in Object Page with qualifier");

			this.oGetODataEntityTypeStub.restore();
			this.oGetSmartTableControl.restore();
			this.oGetLineItemQualifier.restore();
		});

		QUnit.module("The function getLineItemRecordIndex", {
			beforeEach: function () {
				this.aLineItemStub = [{
					Value: {
						Path: "Column1Property"
					}
				}, {
					Value: {
						Path: "Column2Property"
					}
				}];
				this.oDataEntityTypeStub = {
					"com.sap.vocabularies.UI.v1.LineItem": this.oLineItemStub,
					property: [
						"newColumn"
					]
				};
			}
		});

		QUnit.test("getLineItemRecordIndex", function () {
			// Arrange
			var oP13nDataValueStub = {
				columnKey: "Column1Key",
				leadingProperty: "Column1Property"
			};
			var oElementStub = {
				data: function () {
					return oP13nDataValueStub;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "any";
						},
						getValue: function () {
							return "other custom data";
						}
					}, {
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};

			// Act
			var sIndex = Utils.getLineItemRecordIndex(oElementStub, this.aLineItemStub);

			// Assert
			assert.equal(sIndex, 0, "returns the correct index for a data field at position 0");

		});

		QUnit.test("getLineItemRecordIndex", function () {
			// Arrange
			var oP13nDataValueStub = {
				columnKey: "Column2Key",
				leadingProperty: "Column2Property"
			};
			var oElementStub = {
				data: function () {
					return oP13nDataValueStub;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "any";
						},
						getValue: function () {
							return "other custom data";
						}
					}, {
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};

			// Act
			var sIndex = Utils.getLineItemRecordIndex(oElementStub, this.aLineItemStub);

			// Assert
			assert.equal(sIndex, 1, "returns the correct index for a data field at position 1");

		});

		QUnit.test("getLineItemRecordIndex", function () {
			// Arrange
			var oP13nDataValueStub = {
				additionalProperty: "to_ProductSalesPrice/PriceDay,to_ProductSalesPrice/AreaChartPrice",
				columnIndex: "11",
				column_key: "template::DataFieldForAnnotation::to_ProductSalesPrice/com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart",
				leadingProperty: "Column2Property"
			};
			var oElementStub = {
				data: function () {
					return oP13nDataValueStub;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};

			// Act
			var sIndex = Utils.getLineItemRecordIndex(oElementStub, this.aLineItemStub);

			// Assert
			assert.equal(sIndex, 1, "returns the correct index for a chart");

		});

		QUnit.test("getLineItemRecordIndex", function () {
			// Arrange
			var oP13nDataValueStub = {
				Action: "My Action",
				InvocationGrouping: "ChangeSet",
				Label: "Activate",
				Type: "com.sap.vocabularies.UI.v1.DataFieldForAction"
			};
			var oElementStub = {
				data: function () {
					return oP13nDataValueStub;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};

			// Act
			var sIndex = Utils.getLineItemRecordIndex(oElementStub, this.aLineItemStub);

			// Assert
			assert.equal(sIndex, -1, "returns -1 in case of a toolbar button");

		});

		QUnit.test("getLineItemRecordIndex", function () {
			// Arrange
			var oP13nDataValueStub = {
				columnKey: "Column1Property",
				displayBehaviour: "descriptionAndId",
				edmType: "Edm.String"
			}
			var oElementStub = {
				data: function () {
					return oP13nDataValueStub;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};

			// Act
			var sIndex = Utils.getLineItemRecordIndex(oElementStub, []);

			// Assert
			assert.equal(sIndex, -1, "returns -1 if no line items are passed");

		});

		QUnit.test("getLineItemRecordIndex", function () {
			// Arrange
			var oElementStub = {
				data: function () {
					return;
				},
				getCustomData: function () {
					return;
				}
			};

			// Act
			var sIndex = Utils.getLineItemRecordIndex(oElementStub, this.aLineItemStub);

			// Assert
			assert.equal(sIndex, -1, "returns -1 if no customData are found");

		});

		QUnit.test("getLineItemRecordIndex", function () {
			// Arrange
			var oP13nDataValueStub = {
				columnKey: "Test",
				columnIndex: "101"
			}
			var oElementStub = {
				data: function () {
					return oP13nDataValueStub;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};

			// Act
			var sIndex = Utils.getLineItemRecordIndex(oElementStub, this.aLineItemStub);

			// Assert
			assert.equal(sIndex, -1, "returns -1 for a break-out column");

		});

		QUnit.module("The function getLineItemRecordIndexForButton", {
			beforeEach: function () {
				this.oLineItemStub = [{
					Action: {
						String: "Action0"
					},
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
				}, {
					Action: {
						String: "Action1"
					},
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
				}, {
					Action: {
						String: "IBN"
					},
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: {
						String: "Product"
					}
				}, {
					Action: {
						String: "IBN"
					},
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: {
						String: "Supplier"
					}
				}];
			}
		});

		QUnit.test("getLineItemRecordIndexForButton", function () {
			// Arrange
			var oElementStub = {}; //dummy
			var oCustomDataObject = {
				Action: "Action1",
				InvocationGrouping: "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet",
				Label: "Activate",
				Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				"sap-ui-custom-settings": {
					"sap.build": "#patternX"
				}
			};
			this.oGetCustomDataObject = sinon.stub(Utils, "getCustomDataObject").returns(oCustomDataObject);

			// Act
			var sIndex = Utils.getLineItemRecordIndexForButton(oElementStub, this.oLineItemStub);

			// Assert
			assert.equal(sIndex, 1, "returns the right index 1 for an action button");

			this.oGetCustomDataObject.restore();
		});

		QUnit.test("getLineItemRecordIndexForButton", function () {
			// Arrange
			var oElementStub = {}; //dummy
			var oCustomDataObject = {
				Action: "IBN",
				Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				SemanticObject: "Product"
			};
			this.oGetCustomDataObject = sinon.stub(Utils, "getCustomDataObject").returns(oCustomDataObject);

			// Act
			var sIndex = Utils.getLineItemRecordIndexForButton(oElementStub, this.oLineItemStub);

			// Assert
			assert.equal(sIndex, 2, "returns the right index 2 for an IBN button");

			this.oGetCustomDataObject.restore();
		});

		QUnit.test("getLineItemRecordIndexForButton", function () {
			// Arrange
			var oElementStub = {}; //dummy
			var oCustomDataObject = {
				Action: "IBN",
				Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				SemanticObject: "Supplier"
			};
			this.oGetCustomDataObject = sinon.stub(Utils, "getCustomDataObject").returns(oCustomDataObject);

			// Act
			var sIndex = Utils.getLineItemRecordIndexForButton(oElementStub, this.oLineItemStub);

			// Assert
			assert.equal(sIndex, 3, "returns the right index 3 for an IBN button ith same action but different object");

			this.oGetCustomDataObject.restore();
		});

		QUnit.test("getLineItemRecordIndexForButton", function () {
			// Arrange
			var oElementStub = {}; //dummy
			var oCustomDataObject = {
				Action: "IBN",
				Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				SemanticObject: "None"
			};
			this.oGetCustomDataObject = sinon.stub(Utils, "getCustomDataObject").returns(oCustomDataObject);

			// Act
			var sIndex = Utils.getLineItemRecordIndexForButton(oElementStub, this.oLineItemStub);

			// Assert
			assert.equal(sIndex, -1, "returns -1 for IBN with semantic object name is not fitting");

			this.oGetCustomDataObject.restore();
		});

		QUnit.module("Test Module for Subsections");
		QUnit.test("remove Subsection works when index return is correct", function () {

			//Arrange;
			var oParentSubSectionStub = {
				Path: "SubSection"
			}
			var aAnnotations = [{
				Facets: ["SubSection1"]
			}, {
				Facets: ["SubSection2"]
			}]
			var oRemovedSubSectoinStub = {
				Path: "SubSection",
				getParent: function () {
					return oParentSubSectionStub;
				}
			}
			var oGetODataEntityTypeStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath", function (oControl) {
				return oControl.Path ? 1 : -1;
			})
			var fnGetParentSpy = sinon.spy(aAnnotations[1].Facets, "splice");
			//Act;
			Utils.fnRemoveSubSection(oRemovedSubSectoinStub, aAnnotations);
			//Assert;
			assert.ok(fnGetParentSpy.calledOnce, " annotation index for subsection was found ");
			oGetODataEntityTypeStub.restore();
			fnGetParentSpy.restore();
		});

		QUnit.test("remove Subsection works when index return is not correct", function () {
			//Arrange;
			var oParentSubSectionStub = {
				Path: "SubSection"
			}
			var aAnnotations = [{
				Facets: ["SubSection1"]
			}, {
				Facets: ["SubSection2"]
			}]
			var oRemovedSubSectoinStub = {
				getParent: function () {
					return oParentSubSectionStub;
				}
			}
			var oGetODataEntityTypeStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath", function (oControl) {
				return oControl.Path ? 1 : -1;
			})
			var fnRemoveElementSpy = sinon.spy(aAnnotations[1].Facets, "splice");
			//Act;
			Utils.fnRemoveSubSection(oRemovedSubSectoinStub, aAnnotations);
			//Assert;
			assert.ok(!fnRemoveElementSpy.calledOnce, "Element was removed");
			oGetODataEntityTypeStub.restore();
			fnRemoveElementSpy.restore();
		});

		QUnit.test("move Subsection from section containing subsection to section without having subsection", function () {
			//Arrange
			var aAnnotations = [{
				Facets: [{
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section1"
				}
			}, {
				Facets: [{
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}, {
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section2"
				}
			}];
			var oSourceSectionStub = {
				Path: "SourceSection",
			};
			var oTargetSectionStub = {
				Path: "TargetSection",
			};
			var oGetODataEntityTypeStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath", function (oControl) {
				return oControl.Path === "SourceSection" ? 1 : 0;
			});
			var oCreateCollectionFacetsSpy = sinon.spy(Utils, "createCollectionFacets");
			//Act
			Utils.fnMoveSubSection(oSourceSectionStub, oTargetSectionStub, 1, 0, aAnnotations);
			//Assert
			assert.ok(oCreateCollectionFacetsSpy.calledTwice,
				"Facet moved and normalized with collection facet to be rendered as subsection in ObjectPage");
			oGetODataEntityTypeStub.restore();
			oCreateCollectionFacetsSpy.restore();

		});

		QUnit.test("move Subsection from section having mulitple subsection to other section having multiple subsection", function () {
			//Arrange
			var aAnnotations = [{
				Facets: [{
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}, {
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section1"
				}
			}, {
				Facets: [{
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}, {
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section2"
				}
			}];
			var oSourceSectionStub = {
				Path: "SourceSection",
			};
			var oTargetSectionStub = {
				Path: "TargetSection",
			};

			var oGetODataEntityTypeStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath", function (oControl) {
				return oControl.Path === "SourceSection" ? 0 : 1;
			});
			var oCreateCollectionFacetsSpy = sinon.spy(Utils, "createCollectionFacets");
			//Act
			Utils.fnMoveSubSection(oSourceSectionStub, oTargetSectionStub, 1, 0, aAnnotations);
			//Assert
			assert.ok(!oCreateCollectionFacetsSpy.called,
				"Facet moved and normalized with collection facet to be rendered as subsection in ObjectPage");
			oGetODataEntityTypeStub.restore();
			oCreateCollectionFacetsSpy.restore();

		});

		QUnit.test("add Subsection to section containing only one subsection", function () {
			//Arrange
			var aAnnotations = [{
				Facets: [{
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section1"
				}
			}, {
				Facets: [{
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}, {
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section2"
				}
			}];
			var oParentSectionStub = {
				Path: "SingleSubsection",
			};
			var oGetODataEntityTypeStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath", function (oControl) {
				return oControl.Path === "SingleSubsection" ? 0 : 1;
			});
			var oCreateCollectionFacetsSpy = sinon.spy(Utils, "createCollectionFacets");
			//Act
			Utils.fnAddSubSection(oParentSectionStub, aAnnotations, 1);
			//Assert
			assert.ok(oCreateCollectionFacetsSpy.calledTwice, "Facet added to section");
			oGetODataEntityTypeStub.restore();
			oCreateCollectionFacetsSpy.restore();
		});

		QUnit.test("add Subsection to section containing more than one subsection", function () {
			//Arrange
			var aAnnotations = [{
				Facets: [{
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section1"
				}
			}, {
				Facets: [{
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}, {
					Facets: [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
					}],
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				}],
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Label: {
					String: "Section2"
				}
			}];

			var oParentSectionStub = {
				Path: "MultipleSubsection",
			};

			var oGetODataEntityTypeStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath", function (oControl) {
				return oControl.Path === "SingleSubsection" ? 0 : 1;
			});
			var oCreateCollectionFacetsSpy = sinon.spy(Utils, "createCollectionFacets");
			//Act
			Utils.fnAddSubSection(oParentSectionStub, aAnnotations, 1);
			//Assert
			assert.ok(oCreateCollectionFacetsSpy.calledOnce, "Facet added to section");
			oGetODataEntityTypeStub.restore();
			oCreateCollectionFacetsSpy.restore();
		});

		QUnit.module("The function getRecordIndexForSelectionField", {

			beforeEach: function () {
				this.oEntityType = {
					"com.sap.vocabularies.UI.v1.SelectionFields": [{
						PropertyPath: "Product"
					}, {
						PropertyPath: "ProductCategory"
					}, {
						PropertyPath: "Supplier"
					}]
				};

				this.oVerticalLayout = {
					getParent: function () {
						return {
							getParent: function () {
								return {
									getEntityType: function () {
										return "MyEntityType";
									}
								};
							}
						};
					},
					getModel: function () {
						return {
							getMetaModel: function () {
								return {
									getODataEntityType: function () {
										return this.oEntityType;
									}.bind(this)
								};
							}.bind(this)
						};
					}.bind(this)
				};
				this.oGetControlConfigStub = sinon.stub(Utils, "getSmartFilterBarControlConfiguration");
			},
			afterEach: function () {
				this.oGetControlConfigStub.restore();
			}
		});

		QUnit.test("getRecordIndexForSelectionField", function () {
			// Arrange
			this.oTemplatingInfo = {
				annotation: "com.sap.vocabularies.UI.v1.SelectionFields",
				target: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				value: "Product"
			};
			this.oGetTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(this.oTemplatingInfo);

			// Act
			var sIndex = Utils.getRecordIndexForSelectionField(this.oVerticalLayout);

			// Assert
			assert.equal(sIndex, 0, "returns 0 for first selection field");

			this.oGetTemplatingInfoStub.restore();
		});

		QUnit.test("getRecordIndexForSelectionField", function () {
			// Arrange
			this.oTemplatingInfo = {
				annotation: "com.sap.vocabularies.UI.v1.SelectionFields",
				target: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				value: "ProductCategory"
			};
			this.oGetTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(this.oTemplatingInfo);

			// Act
			var sIndex = Utils.getRecordIndexForSelectionField(this.oVerticalLayout);

			// Assert
			assert.equal(sIndex, 1, "returns 1 for second selection field");

			this.oGetTemplatingInfoStub.restore();
		});

		QUnit.test("getRecordIndexForSelectionField", function () {
			// Arrange
			this.oTemplatingInfo = {
				annotation: "com.sap.vocabularies.UI.v1.SelectionFields",
				target: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				value: "NoSelect"
			};
			this.oGetTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(this.oTemplatingInfo);

			// Act
			var sIndex = Utils.getRecordIndexForSelectionField(this.oVerticalLayout);

			// Assert
			assert.equal(sIndex, -1, "returns -1 for non-selection field");

			this.oGetTemplatingInfoStub.restore();
		});

		QUnit.module("The function getLineItemRecordForButton", {

			beforeEach: function () {
				this.oButton = {};
				this.aLineItemStub = [{
					Value: {
						Path: "Column1Property"
					}
				}, {
					Value: {
						Path: "Column2Property"
					}
				}];
				this.oGetLineItemsStub = sinon.stub(Utils, "getLineItems").returns(this.aLineItemStub);

			},
			afterEach: function () {
				this.oGetLineItemsStub.restore();
			}
		});

		QUnit.test("getLineItemRecordForButton", function () {
			// Arrange
			var oGetLineItemRecordIndexStub = sinon.stub(Utils, "getLineItemRecordIndexForButton").returns(0);

			// Act
			var oEntry = Utils.getLineItemRecordForButton(this.oButton);

			// Assert
			assert.deepEqual(oEntry, {
				Value: {
					Path: "Column1Property"
				}
			}, "returns the first button");

			oGetLineItemRecordIndexStub.restore();
		});

		QUnit.test("getLineItemRecordForButton", function () {
			// Arrange
			var oGetLineItemRecordIndexStub = sinon.stub(Utils, "getLineItemRecordIndexForButton").returns(1);

			// Act
			var oEntry = Utils.getLineItemRecordForButton(this.oButton);

			// Assert
			assert.deepEqual(oEntry, {
				Value: {
					Path: "Column2Property"
				}
			}, "returns the second button");

			oGetLineItemRecordIndexStub.restore();
		});

		QUnit.module("The function getLineItemRecordForColumn");

		QUnit.test("getLineItemRecordForColumn", function () {
			// Arrange
			var oButton = {};
			var aLineItemStub = [{
				Value: {
					Path: "Column1Property"
				}
			}, {
				Value: {
					Path: "Column2Property"
				}
			}];
			var oGetLineItemsStub = sinon.stub(Utils, "getLineItems").returns(aLineItemStub);
			var oGetLineItemRecordIndexStub = sinon.stub(Utils, "getLineItemRecordIndex").returns(0);

			// Act
			var oEntry = Utils.getLineItemRecordForColumn(oButton);

			// Assert
			assert.deepEqual(oEntry, {
				Value: {
					Path: "Column1Property"
				}
			}, "returns the first button");

			oGetLineItemRecordIndexStub.restore();
			oGetLineItemsStub.restore();
		});

		QUnit.test("getLineItemRecordForColumn", function () {
			// Arrange
			var oButton = {};
			var aLineItemStub = [{
				Value: {
					Path: "Column1Property"
				}
			}, {
				Value: {
					Path: "Column2Property"
				}
			}];
			var oGetLineItemsStub = sinon.stub(Utils, "getLineItems").returns(aLineItemStub);
			var oGetLineItemRecordIndexStub = sinon.stub(Utils, "getLineItemRecordIndex").returns(1);

			// Act
			var oEntry = Utils.getLineItemRecordForColumn(oButton);

			// Assert
			assert.deepEqual(oEntry, {
				Value: {
					Path: "Column2Property"
				}
			}, "returns the second button");

			oGetLineItemRecordIndexStub.restore();
			oGetLineItemsStub.restore();
		});

		QUnit.test("getLineItemRecordForColumn", function () {
			// Arrange
			var oButton = {};
			var aLineItemStub = [{
				Value: {
					Path: "Column1Property"
				}
			}, {
				Value: {
					Path: "Column2Property"
				}
			}];
			var oGetLineItemsStub = sinon.stub(Utils, "getLineItems").returns(aLineItemStub);
			var oGetLineItemRecordIndexStub = sinon.stub(Utils, "getLineItemRecordIndex").returns(-1);

			// Act
			var oEntry = Utils.getLineItemRecordForColumn(oButton);

			// Assert
			assert.deepEqual(oEntry, undefined, "reacts correctly on negative index (column not found)");

			oGetLineItemRecordIndexStub.restore();
			oGetLineItemsStub.restore();
		});

		QUnit.module("The function getTemplatingInfo");

		QUnit.test("getTemplatingInfo", function () {
			// Arrange
			var oElement;

			// Act
			var oTemplatingInfo = Utils.getTemplatingInfo(oElement);

			// Assert
			assert.equal(oTemplatingInfo, undefined, "returns undefined if no element is passed");
		});

		QUnit.test("getTemplatingInfo", function () {
			// Arrange
			var oElement = {
				data: function () {
					return {
						"sap.ui.dt": {
							annotation: "{\"bla\": \"bla\" }"
						}
					};
				}
			};

			// Act
			var oTemplatingInfo = Utils.getTemplatingInfo(oElement);

			// Assert
			assert.deepEqual(oTemplatingInfo, {
				bla: "bla"
			}, "returns the annotation information");
		});

		QUnit.test("getTemplatingInfo", function () {
			// Arrange
			var oElement = {
				data: function () {
					return {
						"any": {
							"bla": "bla"
						}
					};
				}
			};

			// Act
			var oTemplatingInfo = Utils.getTemplatingInfo(oElement);

			// Assert
			assert.equal(oTemplatingInfo, undefined, "returns undefined if no annotation information exists");
		});

		QUnit.module("The function getPropertyOfColumn");

		QUnit.test("getPropertyOfColumn", function () {
			// Arrange
			var oP13nDataValueStub = {
				additionalProperty: "to_ProductSalesPrice/PriceDay,to_ProductSalesPrice/AreaChartPrice",
				columnIndex: "11",
				column_key: "template::DataFieldForAnnotation::to_ProductSalesPrice/com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart",
				leadingProperty: "Column2Property"
			};
			var oElementStub = {
				data: function () {
					return oP13nDataValueStub;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "p13nData";
						},
						getValue: function () {
							return oP13nDataValueStub;
						}
					}];
				}
			};

			// Act
			var sProperty = Utils.getPropertyOfColumn(oElementStub);

			// Assert
			assert.equal(sProperty, "Column2Property", "returns the property of a column");
		});

		QUnit.test("getPropertyOfColumn", function () {
			// Arrange
			var oElementStub = {
				data: function () {
					return;
				},
				getCustomData: function () {
					return [{
						getKey: function () {
							return "any";
						},
						getValue: function () {
							return;
						}
					}];
				}
			};

			// Act
			var sProperty = Utils.getPropertyOfColumn(oElementStub);

			// Assert
			assert.equal(sProperty, undefined, "returns undefined if no p13nData exist");
		});

		QUnit.module("The function getODataPath", {
			beforeEach: function () {
				this.LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
				this.SELECTIONFIELDS = "com.sap.vocabularies.UI.v1.SelectionFields";

				this.oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType"
				};
				this.oGetEntityTypeStub = sinon.stub(Utils, "getEntityType").returns("MyEntityType");
				this.oGetEntitySetStub = sinon.stub(Utils, "getODataEntitySet").returns({
					namespace: "ns",
					name: "MyEntitySet"
				});
				this.oElementStub = {
					getComponent: function () {
						return;
					},
					getModel: function () {
						return {
							getMetaModel: function () {
								return {
									getODataEntityType: function () {
										return this.oDataEntityTypeStub;
									}.bind(this)
								};
							}.bind(this)
						};
					}.bind(this)
				};
			},
			afterEach: function () {
				this.oGetEntityTypeStub.restore();
				this.oGetEntitySetStub.restore();
			}
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									var oMetaModel = this.oElementStub.getModel().getMetaModel();
									var oEntityType = oMetaModel.getODataEntityType();
									var sTarget = oEntityType.namespace + "." + oEntityType.name + '/' + this.LINEITEM + '/3';
									return {
										target: sTarget,
										annotation: this.LINEITEM,
										qualifier: null
									};
								}.bind(this)
							};
						}.bind(this)
					};
				}.bind(this)
			};
			// Act
			var sODataPath = Utils.getODataPath(oOverlay);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.LineItem/3", "returns the right path for a column");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									var oMetaModel = this.oElementStub.getModel().getMetaModel();
									var oEntityType = oMetaModel.getODataEntityType();
									var sTarget = oEntityType.namespace + "." + oEntityType.name + '/' + this.SELECTIONFIELDS + '/3';
									return {
										target: sTarget,
										annotation: this.SELECTIONFIELDS,
										qualifier: null
									};
								}.bind(this)
							};
						}.bind(this)
					};
				}.bind(this)
			};
			// Act
			var sODataPath = Utils.getODataPath(oOverlay);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.SelectionFields/3",
				"returns the right path for a selection field");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									var oMetaModel = this.oElementStub.getModel().getMetaModel();
									var oEntityType = oMetaModel.getODataEntityType();
									var sTarget = oEntityType.namespace + "." + oEntityType.name + '/' + this.SELECTIONFIELDS + '/3';
									return {
										target: sTarget,
										annotation: this.SELECTIONFIELDS,
										qualifier: null
									};
								}.bind(this)
							};
						}.bind(this)
					};
				}.bind(this)
			};
			var oAnnotation = {
				namespace: "UI",
				annotation: "Importance",
				target: ["Record"]
			};

			// Act
			var sODataPath = Utils.getODataPath(oOverlay, oAnnotation);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.SelectionFields/3/UI.Importance",
				"returns the right path for a term with target");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									var oMetaModel = this.oElementStub.getModel().getMetaModel();
									var oEntityType = oMetaModel.getODataEntityType();
									var sTarget = oEntityType.namespace + "." + oEntityType.name + '/' + this.SELECTIONFIELDS + '/3';
									return {
										target: sTarget,
										annotation: this.SELECTIONFIELDS,
										qualifier: null
									};
								}.bind(this)
							};
						}.bind(this)
					};
				}.bind(this)
			};
			var oAnnotation = {
				namespace: "UI",
				annotation: "DataField"
			};

			// Act
			var sODataPath = Utils.getODataPath(oOverlay, oAnnotation);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.SelectionFields/3",
				"returns the right path for a complex type without target");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									var oMetaModel = this.oElementStub.getModel().getMetaModel();
									var oEntityType = oMetaModel.getODataEntityType();
									var sTarget = oEntityType.namespace + "." + oEntityType.name + '/' + this.LINEITEM + '/3';
									return {
										target: sTarget,
										annotation: this.LINEITEM,
										qualifier: null
									};
								}.bind(this)
							};
						}.bind(this)
					};
				}.bind(this)
			};
			// Act
			var sODataPath = Utils.getODataPath(oOverlay);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.LineItem/3", "returns the right path for a toolbar button");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return;
						}
					};
				}
			};
			var oAnnotation = {
				namespace: "UI",
				annotation: "DataPoint",
				target: ["EntityType"]
			};
			// Act
			var sODataPath = Utils.getODataPath(oOverlay, oAnnotation);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/UI.DataPoint", "returns the right path for target = EntityType but no common instance data");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oElementStub = {
				getComponent: function () {
					return; //UI.Component without getEntitySet
				},
				getModel: function () {
					return {
						getMetaModel: function () {
							return {};
						}
					};
				}
			};

			var oOverlay = {
				getElement: function () {
					return oElementStub;
				},
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return;
						}
					};
				}
			};
			var oAnnotation = {
				namespace: "UI",
				annotation: "DataPoint",
				target: ["EntityType"]
			};
			// Act
			var sODataPath = Utils.getODataPath(oOverlay, oAnnotation);

			// Assert
			assert.equal(sODataPath, undefined, "indicates that there is no ODataPath if for components without OData");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return;
						}
					};
				}
			};
			var oAnnotation = {
				namespace: "UI",
				annotation: "DataPoint",
				target: ["EntitySet"]
			};
			// Act
			var sODataPath = Utils.getODataPath(oOverlay, oAnnotation);

			// Assert
			assert.equal(sODataPath, "ns.MyEntitySet/UI.DataPoint", "returns the right path for target = EntitySet but no common instance data");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oTemplData = {
				annotation: "com.sap.vocabularies.UI.v1.Facets",
				path: "/dataServices/schema/0/entityType/9/com.sap.vocabularies.UI.v1.Facets/0",
				target: "ns.MyEntityType",
				value: undefined
			};

			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									if (oTemplData && oTemplData.path) {
										var sTarget = oTemplData.target + '/' + oTemplData.path.substr(oTemplData.path.indexOf(FACETS));
										return {
											target: sTarget,
											annotation: oTemplData.annotation,
											qualifier: null
										};
									}
								}
							};
						}
					};
				}
			};

			// Act
			var sODataPath = Utils.getODataPath(oOverlay);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.Facets/0", "returns the right path for a object page section");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oTemplData = {
				annotation: "com.sap.vocabularies.UI.v1.Facets",
				path: "/dataServices/schema/0/entityType/9/com.sap.vocabularies.UI.v1.Facets/0/Facets/0",
				target: "ns.MyEntityType",
				value: undefined
			};

			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									if (oTemplData && oTemplData.path) {
										var sTarget = oTemplData.target + '/' + oTemplData.path.substr(oTemplData.path.indexOf(FACETS));
										return {
											target: sTarget,
											annotation: oTemplData.annotation,
											qualifier: null
										};
									}
								}
							};
						}
					};
				}
			};

			// Act
			var sODataPath = Utils.getODataPath(oOverlay);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.Facets/0/Facets/0",
				"returns the right path for a object page sub-section");
		});

		QUnit.test("getODataPath", function () {
			// Arrange
			var oTemplData = {
				annotation: "com.sap.vocabularies.UI.v1.Facets",
				path: "/dataServices/schema/0/entityType/9/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Facets/1",
				target: "ns.MyEntityType",
				value: undefined
			};

			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return {
						getData: function () {
							return {
								getCommonInstanceData: function () {
									if (oTemplData && oTemplData.path) {
										var sTarget = oTemplData.target + '/' + oTemplData.path.substr(oTemplData.path.indexOf(FACETS));
										return {
											target: sTarget,
											annotation: oTemplData.annotation,
											qualifier: null
										};
									}
								}
							};
						}
					};
				}
			};

			// Act
			var sODataPath = Utils.getODataPath(oOverlay);

			// Assert
			assert.equal(sODataPath, "ns.MyEntityType/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Facets/1",
				"returns the right path for a object page field group");
		});
		/*
                QUnit.test("getODataPath", function() {
                    // Arrange

                    // Act
                    var sODataPath = Utils.getODataPath(oOverlay, oAnnotation);

                    // Assert
                    assert.equal(sODataPath, "Not yet", "returns the right path for a header facet");
                });
                */
		QUnit.test("getODataPath", function () {

			// Arrange
			var oOverlay = {
				getElement: function () {
					return this.oElementStub;
				}.bind(this),
				getDesignTimeMetadata: function () {
					return;
				}
			};

			// Act
			var sODataPath = Utils.getODataPath(oOverlay);

			// Assert
			assert.equal(sODataPath, undefined, "returns undefined if no designtime metadata exist");
		});

		QUnit.module("The function getEntityTypeFromAnnotationPath");

		QUnit.test("getEntityTypeFromAnnotationPath", function () {
			// Act
			var oResult = Utils.getEntityTypeFromAnnotationPath();

			// Assert
			assert.equal(oResult, undefined, "returns undefined if no parameters provided");
		});

		QUnit.test("getEntityTypeFromAnnotationPath", function () {
			// Arrange
			var oElement = {
				getModel: function () {
					return;
				}
			};
			// Act
			var oResult = Utils.getEntityTypeFromAnnotationPath(oElement, "someAnnotationPath");

			// Assert
			assert.equal(oResult, undefined, "returns undefined if no MetaModel exists");
		});

		QUnit.test("getEntityTypeFromAnnotationPath", function () {
			// Arrange
			var oElement = {
					getModel: function () {
						return {
							getMetaModel: function () {
								return {};
							}
						};
					}
				},
				oEntityTypeStub = {
					entityType: "MyEntityType"
				},
				oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType").returns(oEntityTypeStub);
			// Act
			var oResult = Utils.getEntityTypeFromAnnotationPath(oElement, "someAnnotationPath");

			// Assert
			assert.equal(oResult, oEntityTypeStub, "correct entity type returned");

			//Clean
			oGetODataEntityTypeStub.restore();
		});

		QUnit.test("getEntityTypeFromAnnotationPath", function () {
			// Arrange
			var oEntityTypeStub = {
					entityType: "OtherEntityType"
				},
				oElement = {
					getModel: function () {
						return {
							getMetaModel: function () {
								return {
									getODataEntityType: function () {
										return oEntityTypeStub;
									}
								};
							}
						};
					}
				},
				oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType"),
				oGetTargetEntitySetStub = sinon.stub(AnnotationHelper, "getRelevantDataForAnnotationRecord").returns(oEntityTypeStub);

			// Act
			var oResult = Utils.getEntityTypeFromAnnotationPath(oElement, "navigate_to/someAnnotationPath");

			// Assert
			assert.equal(oResult, oEntityTypeStub.entityType, "correct entity type returned");

			//Clean
			oGetODataEntityTypeStub.restore();
			oGetTargetEntitySetStub.restore();
		});

		// qunit for some other utility functions
		QUnit.module("Test for Utility function which create collection facets");
		QUnit.test("CreateCollectionFacet", function () {
			// Arrange
			var aFacet = ["Facet1", "Facet2"];
			var oNextIdSuffixStub = sinon.stub(AnnotationHelperForDesignTime, "getNextIdSuffix").returns("1235");
			//Act
			var oCollectionFacet = Utils.createCollectionFacets(aFacet);
			//Assert
			assert.deepEqual(aFacet, oCollectionFacet.Facets);
			oNextIdSuffixStub.restore();
		});

		QUnit.module("The function fnAdaptTableStructures");
		QUnit.test("Rebind the structure of table in all visible columns", function () {

			var aTableCells = ["Cell1", "Cell2", "Cell3"];
			var aTableColumns = ["Column1", "Column2", "Column3"];
			var aTableColumns = [{
				id: "Column1",
				getVisible: function () {
					return true;
				}
			}, {
				id: "Column2",
				getVisible: function () {
					return true;
				}
			}, {
				id: "Column3",
				getVisible: function () {
					return true;
				}
			}]
			var aFinalTableCells = [];
			var aFinalTableColumns = [];

			var oTable = {
				getBindingInfo: function () {
					return {
						template: {
							getCells: function () {
								return aTableCells;
							},
							addCell: function (sCells) {
								aFinalTableCells.push(sCells);
							},
							removeAllCells: Function.prototype
						}
					}
				},
				getColumns: function () {
					return aTableColumns;
				},
				indexOfColumn: function (sColumn) {
					return aTableColumns.indexOf(sColumn);
				},
				addColumn: function (sColumn) {
					aFinalTableColumns.push(sColumn);
				},
				unbindItems: Function.prototype,
				removeAllColumns: Function.prototype,
				bindItems: Function.prototype
			}
			var bCorrectTableStructure = true;
			Utils.fnAdaptTableStructures(oTable);
			for (var i = 0; i < aTableColumns.length; i++) {
				if (aTableColumns[i].id != aFinalTableColumns[i].id || aTableCells[i] != aFinalTableCells[i]) {
					bCorrectTableStructure = false;
					break
				}
			}
			assert.equal(bCorrectTableStructure, true, "Columns are in correct order")
		})

		QUnit.module("The function getHeaderFacetIndex", {

			beforeEach: function () {
				this.sElementName = "sap.m.VBox";
				this.sFirstHeaderFacetID =
					"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::BeforeReferenceExtension";
				this.sSecondHeaderFacetID =
					"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
				this.sFacetID =
					"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
				var that = this;
				this.aHeaderFacets = [{
					getId: function () {
						return that.sFirstHeaderFacetID;
					},
					getMetadata: function () {
						return {
							getElementName: function () {
								return "sap.m.VBox";
							}
						}
					}
				}, {
					getId: function () {
						return that.sSecondHeaderFacetID;
					},
					getMetadata: function () {
						return {
							getElementName: function () {
								return "sap.m.VBox";
							}
						}
					}
				}];
				this.oParent = {
					getMetadata: function () {
						return {
							getElementName: function () {
								return "sap.uxap.ObjectPageHeaderContent";
							}
						}
					},
					getContent: function () {
						return that.aHeaderFacets;
					}
				};

				this.aAnnotations = [{
					Label: "HeaderFacet1",
					Target: "DataPoint1"
				}, {
					Label: "HeaderFacet2",
					Target: "DataPoint2"
				}];

				this.oControl = {
					getId: function () {
						return that.sFacetID;
					},
					getMetadata: function () {
						return {
							getElementName: function () {
								return that.sElementName;
							}
						}
					},
					getParent: function () {
						return that.oParent;
					}
				};
			}
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sElementName = "sap.m.Image";
			//Act
			var oActualIndex = Utils.getHeaderFacetIndex(this.oControl);
			//Assert
			assert.equal(oActualIndex, -1, "getHeaderFacetIndex returns correct default value in case of image");
		});

		QUnit.test("getHeaderFacetIndex", function () {
			// Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			var oTemplatingInfo = {
				path: "/dataServices/schema/0/entityType/9/com.sap.vocabularies.UI.v1.HeaderFacets/2"
			};
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(oTemplatingInfo);
			this.oGetIndexFromInstanceMetadataPathStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath");
			//Act
			Utils.getHeaderFacetIndex(this.oControl);
			//Assert
			assert.equal(this.oGetIndexFromInstanceMetadataPathStub.calledWith(this.oControl), true,
				"The function getIndexFromInstanceMetadataPath called with the correct control if templating info exists");
			//Clean
			this.oTemplatingInfoStub.restore();
			this.oGetIndexFromInstanceMetadataPathStub.restore();
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::BeforeReferenceExtension";
			var sExpectedId =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo");
			this.oTemplatingInfoStub.withArgs(this.oControl).returns(undefined);
			this.oTemplatingInfoStub.withArgs(this.aHeaderFacets[1]).returns(true);
			this.oGetIndexFromInstanceMetadataPathStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath");
			//Act
			Utils.getHeaderFacetIndex(this.oControl);
			//Assert
			assert.equal(this.oGetIndexFromInstanceMetadataPathStub.lastCall.args[0].getId(), sExpectedId,
				"The function getIndexFromInstanceMetadataPath called with the correct control in case of before facet header extension in standard header"
			);
			//Clean
			this.oTemplatingInfoStub.restore();
			this.oGetIndexFromInstanceMetadataPathStub.restore();
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::BeforeReferenceExtension";
			var that = this;
			this.oParent = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.m.FlexBox";
						}
					}
				},
				getItems: function () {
					return that.aHeaderFacets;
				}
			};
			var sExpectedId =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo");
			this.oTemplatingInfoStub.withArgs(this.oControl).returns(undefined);
			this.oTemplatingInfoStub.withArgs(this.aHeaderFacets[1]).returns(true);
			this.oGetIndexFromInstanceMetadataPathStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath");
			//Act
			Utils.getHeaderFacetIndex(this.oControl);
			//Assert
			assert.equal(this.oGetIndexFromInstanceMetadataPathStub.lastCall.args[0].getId(), sExpectedId,
				"The function getIndexFromInstanceMetadataPath called with the correct control in case of before facet header extension in dynamic header"
			);
			//Clean
			this.oTemplatingInfoStub.restore();
			this.oGetIndexFromInstanceMetadataPathStub.restore();
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::AfterReferenceExtension";
			this.sFirstHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			this.sSecondHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::AfterReferenceExtension";

			var sExpectedId =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo");
			this.oTemplatingInfoStub.withArgs(this.oControl).returns(undefined);
			this.oTemplatingInfoStub.withArgs(this.aHeaderFacets[0]).returns(true);
			this.oGetIndexFromInstanceMetadataPathStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath");
			//Act
			Utils.getHeaderFacetIndex(this.oControl);
			//Assert
			assert.equal(this.oGetIndexFromInstanceMetadataPathStub.lastCall.args[0].getId(), sExpectedId,
				"The function getIndexFromInstanceMetadataPath called with the correct control in case of after facet header extension in standard header"
			);
			//Clean
			this.oTemplatingInfoStub.restore();
			this.oGetIndexFromInstanceMetadataPathStub.restore();
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::AfterReferenceExtension";
			this.sFirstHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			this.sSecondHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::AfterReferenceExtension";
			var that = this;
			this.oParent = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.m.FlexBox";
						}
					}
				},
				getItems: function () {
					return that.aHeaderFacets;
				}
			};
			var sExpectedId =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo");
			this.oTemplatingInfoStub.withArgs(this.oControl).returns(undefined);
			this.oTemplatingInfoStub.withArgs(this.aHeaderFacets[0]).returns(true);
			this.oGetIndexFromInstanceMetadataPathStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath");
			//Act
			Utils.getHeaderFacetIndex(this.oControl);
			//Assert
			assert.equal(this.oGetIndexFromInstanceMetadataPathStub.lastCall.args[0].getId(), sExpectedId,
				"The function getIndexFromInstanceMetadataPath called with the correct control in case of after facet header extension in dynamic header"
			);
			//Clean
			this.oTemplatingInfoStub.restore();
			this.oGetIndexFromInstanceMetadataPathStub.restore();
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--AfterImageExtensionFacet::objectImage";
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(undefined);
			//Act
			var iIndex = Utils.getHeaderFacetIndex(this.oControl);
			//Assert
			assert.equal(iIndex, 0,
				"The function getIndexFromInstanceMetadataPath called with the correct control in case of after image header extension");
			//Clean
			this.oTemplatingInfoStub.restore();
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::ReplaceReferenceExtension";
			this.sFirstHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::ReplaceReferenceExtension";
			this.sSecondHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";

			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo");
			this.oTemplatingInfoStub.withArgs(this.oControl).returns(undefined);
			this.oTemplatingInfoStub.withArgs(this.aHeaderFacets[1]).returns(true);
			this.oInstanceMetadataIndexStub = sinon.stub(Utils, "getIndexFromInstanceMetadataPath");
			this.oInstanceMetadataIndexStub.withArgs(this.aHeaderFacets[1]).returns(1);
			var iExpectedValue = 0;
			//Act
			var iIndex = Utils.getHeaderFacetIndex(this.oControl, this.aAnnotations);
			//Assert
			assert.equal(iIndex, iExpectedValue,
				"The function getIndexFromInstanceMetadataPath called with the correct control in case of replace facet header extension in standard header"
			);
			//Clean
			this.oTemplatingInfoStub.restore();
			this.oInstanceMetadataIndexStub.restore();
		});

		QUnit.test("getHeaderFacetIndex", function () {
			//Arrange
			this.sFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::ReplaceReferenceExtension";
			this.sFirstHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::DataPoint";
			this.sSecondHeaderFacetID =
				"TestProject::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::WeightUnit::ReplaceReferenceExtension";
			var that = this;
			this.oParent = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.m.FlexBox";
						}
					}
				},
				getItems: function () {
					return that.aHeaderFacets;
				}
			};
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo");
			this.oTemplatingInfoStub.withArgs(this.oControl).returns(undefined);
			this.oTemplatingInfoStub.withArgs(this.aHeaderFacets[0]).returns(true);
			var iExpectedValue = this.aAnnotations.length - 1;
			//Act
			var iIndex = Utils.getHeaderFacetIndex(this.oControl, this.aAnnotations);
			//Assert
			assert.equal(iIndex, iExpectedValue,
				"The function getIndexFromInstanceMetadataPath called with the correct control in case of replace facet header extension in dynamic header"
			);
			//Clean
			this.oTemplatingInfoStub.restore();
		});

		QUnit.test("getGroupElementRecordIndex", function () {
			//Arrange
			var aGroupElements = [{
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Action: {
					String: "edit"
				},
				SemanticObject: {
					String: "EPMProduct"
				},
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				},
				Value: {
					Path: "to_StockAvailability/Quantity"
				}
			}, {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Action: {
					Path: "edit"
				},
				SemanticObject: {
					Path: "EPMProduct"
				},
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				}
			}, {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				SemanticObject: {
					Path: "EPMProductxxx"
				},
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				}
			}];
			var oElement = {};
			var annotationContext1 = {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Action: {
					String: "ProductEdit"
				}
			};
			var annotationContext2 = {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Action: {
					String: "edit"
				},
				SemanticObject: {
					String: "EPMProduct"
				},
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				},
				Value: {
					Path: "to_StockAvailability/Quantity"
				}
			};
			var annotationContext3 = {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Action: {
					Path: "edit"
				},
				SemanticObject: {
					Path: "EPMProduct"
				},
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				}
			};
			var annotationContext4 = {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				SemanticObject: {
					Path: "EPMProductxxx"
				},
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				}
			};
			var iExpectedResult1 = -1;
			var iExpectedResult2 = 0;
			var iExpectedResult3 = 1;
			var iExpectedResult4 = 2;
			var iExpectedResult5 = null;
			var iExpectedResult6 = null;
			var ChangeHandlerUtils = Utils;
			var callbackCount = 0;
			var getTemplatingInfoStub = sinon.stub(ChangeHandlerUtils, "getTemplatingInfo", function () {
				callbackCount++;
				switch (callbackCount) {
				case 1:
					return {
						annotationContext: annotationContext1
					};
				case 2:
					return {
						annotationContext: annotationContext2
					};
				case 3:
					return {
						annotationContext: annotationContext3
					};
				case 4:
					return {
						annotationContext: annotationContext4
					};
				default:
					return null;
				}
			});
			//Act
			var iRecordIndex1 = Utils.getGroupElementRecordIndex(oElement, aGroupElements);
			var iRecordIndex2 = Utils.getGroupElementRecordIndex(oElement, aGroupElements);
			var iRecordIndex3 = Utils.getGroupElementRecordIndex(oElement, aGroupElements);
			var iRecordIndex4 = Utils.getGroupElementRecordIndex(oElement, aGroupElements);
			var iRecordIndex5 = Utils.getGroupElementRecordIndex(null, aGroupElements);
			var iRecordIndex6 = Utils.getGroupElementRecordIndex(oElement, null);
			//Assert
			assert.equal(iRecordIndex1, iExpectedResult1, "Expected index should match Result index: " + iExpectedResult1);
			assert.equal(iRecordIndex2, iExpectedResult2, "Expected index should match Result index: " + iExpectedResult2);
			assert.equal(iRecordIndex3, iExpectedResult3, "Expected index should match Result index: " + iExpectedResult3);
			assert.equal(iRecordIndex4, iExpectedResult4, "Expected index should match Result index: " + iExpectedResult4);
			assert.equal(iRecordIndex5, iExpectedResult5, "Expected index should be null");
			assert.equal(iRecordIndex6, iExpectedResult6, "Expected index should be null");
			//clean
			getTemplatingInfoStub.restore();
		});

		QUnit.test("getGroupElements", function () {
			//Arrange
			var oElement = {};
			var oTemplData = {
				annotation: "com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
			};
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation": [{
					RecordType: "com.sap.vocabularies.UI.v1.ChartDefinitionType"
				}],
				"com.sap.vocabularies.UI.v1.FieldGroup#TechnicalInformation": [{
					RecordType: "com.sap.vocabularies.UI.v1.FieldDefinitionType"
				}]
			};
			var ChangeHandlerUtils = Utils;
			var getODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(oEntityType);
			var oExpectedResult = oEntityType["com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"];
			//Act
			var oResult = Utils.getGroupElements(oElement, oTemplData);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "returns the right EntityType based on the element");
			//Clean
			getODataEntityTypeStub.restore();
		});

		QUnit.test("getGroupElements with data in annotation", function () {
			//Arrange
			var oElement = {};
			var oTemplData = {
				annotation: "com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
			};
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation": {
					Data: [{
						RecordType: "com.sap.vocabularies.UI.v1.ChartDefinitionType"
					}]
				},
				"com.sap.vocabularies.UI.v1.FieldGroup#TechnicalInformation": [{
					RecordType: "com.sap.vocabularies.UI.v1.FieldDefinitionType"
				}]
			};
			var ChangeHandlerUtils = Utils;
			var getODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(oEntityType);
			var oExpectedResult = oEntityType["com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"].Data;
			//Act
			var oResult = Utils.getGroupElements(oElement, oTemplData);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "returns the right EntityType based on the element");
			//Clean
			getODataEntityTypeStub.restore();
		});

		QUnit.module("The function getPropertiesForCustomPopUp");

		QUnit.test("getPropertiesForCustomPopUp", function () {
			//Arrange
			var oControl = {};
			var sType = 'filter';
			var oEntityType = {
				property: [{
					name: "Price",
					"sap:label": "Price per Unit"
				}, {
					name: "Product",
					"sap:label": "Product"
				}, {
					name: "Activation_ac",
					"sap:label": "Dyn. Action Control",
					"sap:filterable": "false"
				}, {
					"com.sap.vocabularies.UI.v1.Hidden": {
						Bool: "true"
					},
					name: "Copy_ac",
					"sap:label": "Dyn. Action Control"
				}]
			};
			var ChangeHandlerUtils = Utils;
			var getComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent").returns({});
			var getODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(oEntityType);
			var oExpectedResult = [{
				name: "Price",
				"sap:label": "Price per Unit"
			}, {
				name: "Product",
				"sap:label": "Product"
			}];
			//Act
			var oResult = Utils.getPropertiesForCustomPopUp(oControl, sType);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "returns the filtered EntityType based on the element");
			//Clean
			getComponentStub.restore();
			getODataEntityTypeStub.restore();
		});

		QUnit.test("getPropertiesForCustomPopUp for table", function () {
			//Arrange
			var aColumns = [{
				Value: "Price"
			}];

			var aVisualizations = [{
				Content: aColumns
			}];
			var oControl = {
				getParent: function () {
					return {
						getUiState: function () {
							return {
								getPresentationVariant: function () {
									return {
										Visualizations: aVisualizations
									}
								}
							}
						}
					}
				}
			};
			var sType = 'table';
			var oEntityType = {
				property: [{
					name: "Price",
					"sap:label": "Price per Unit"
				}, {
					name: "Product",
					"sap:label": "Product"
				}, {
					name: "Activation_ac",
					"sap:label": "Dyn. Action Control",
					"sap:filterable": "false"
				}, {
					"com.sap.vocabularies.UI.v1.Hidden": {
						Bool: "true"
					},
					name: "Copy_ac",
					"sap:label": "Dyn. Action Control"
				}],
			};
			var ChangeHandlerUtils = Utils;
			var getComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent").returns({});
			var getODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(oEntityType);
			var oExpectedResult = [{
				name: "Product",
				"sap:label": "Product"
			}, {
				name: "Activation_ac",
				"sap:label": "Dyn. Action Control",
				"sap:filterable": "false"
			}];
			//Act
			var oTableResult = Utils.getPropertiesForCustomPopUp(oControl, sType);
			//Assert
			assert.deepEqual(oTableResult, oExpectedResult, "returns the filtered properties of EntityType for table");
			//Clean
			getComponentStub.restore();
			getODataEntityTypeStub.restore();
		});

		QUnit.test("getPropertiesForCustomPopUp with oControl as null", function () {
			//Arrange
			var oControl = null;
			var oExpectedResult = [];
			//Act
			var oResult = Utils.getPropertiesForCustomPopUp(oControl, "filter");
			var oTableResult = Utils.getPropertiesForCustomPopUp(oControl, "table");
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "returns []");
			assert.deepEqual(oTableResult, oExpectedResult, "returns []")
			//Clean
		});

		QUnit.test("getPropertiesForCustomPopUp with sType as null", function () {
			//Arrange
			var oControl = {};
			var sType = null;
			var oExpectedResult = [];
			//Act
			var oResult = Utils.getPropertiesForCustomPopUp(oControl, sType);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "returns []");
			//Clean
		});

		QUnit.module("The function getRecordIndexForSelectionFieldFromAnnotation");

		QUnit.test("getRecordIndexForSelectionFieldFromAnnotation", function () {
			//Arrange
			var ChangeHandlerUtils = Utils;
			var oVerticalLayout = {
				sId: "elementId"
			};
			var aAnnotations = [{
				PropertyPath: "Product"
			}];
			var SELECTIONFIELDS = "com.sap.vocabularies.UI.v1.SelectionFields";
			var sapuiStub = sinon.stub(sap.ui, "getCore").returns({
				byId: function (id) {
					return {
						getContent: function () {
							return [{
								getHeader: function () {
									return {
										getContent: function () {
											return [{
												getContent: function () {
													return [{
														getContent: function () {
															return [{
																//oElement
															}];
														}
													}]
												}

											}]
										}
									}
								}
							}];
						}
					}
				}
			});
			var getSmartFilterBarControlConfigurationStub = sinon.stub(ChangeHandlerUtils, "getSmartFilterBarControlConfiguration").returns({});
			var getTemplatingInfoStub = sinon.stub(ChangeHandlerUtils, "getTemplatingInfo").returns({
				annotation: "com.sap.vocabularies.UI.v1.SelectionFields",
				value: "Product"
			});
			var oExpectedResult = 0;
			var oCallingObject = {
				index: 0,
				fnCalled: Utils.getRecordIndexForSelectionFieldFromAnnotation
			}
			//Act
			var oResult = oCallingObject.fnCalled(oVerticalLayout, aAnnotations);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "returns expected target index");
			//Clean
		});
	});
