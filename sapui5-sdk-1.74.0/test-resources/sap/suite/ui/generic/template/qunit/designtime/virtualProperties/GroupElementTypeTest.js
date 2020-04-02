/**
 * tests for the sap.suite.ui.generic.template.designtime.virtualProperties.GroupElementType.js
 */

sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/virtualProperties/GroupElementType",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils"
	],
	function(sinon, ChangeHandlerUtils, GroupElementType, DesigntimeUtils) {
		"use strict";

		var	DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			DATAFIELD = "com.sap.vocabularies.UI.v1.DataField",
			DATAFIELDWITHURL = "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
			INTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation",
			DATAFIELDWITHNAVPATH = "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
			IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification",
			CONTACT = "com.sap.vocabularies.Communication.v1.Contact",
			ADDRESS = "com.sap.vocabularies.Communication.v1.Address",
			GROUP_ELEMENT_TYPE_DATAFIELD = "Datafield",
			GROUP_ELEMENT_TYPE_CONTACT = "Contact",
			GROUP_ELEMENT_TYPE_ADDRESS = "Address",
			GROUP_ELEMENT_TYPE_INTENTBASEDNAV = "DataFieldWithIntentBasedNavigation",
			GROUP_ELEMENT_TYPE_DATAFIELDWITHURL = "DatafieldWithUrl",
			GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH = "DataFieldWithNavigationPath",
			LOW_IMPORTANCE = "com.sap.vocabularies.UI.v1.ImportanceType/Low",
			HIGH_IMPORTANCE = "com.sap.vocabularies.UI.v1.ImportanceType/High";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function createNewRecord");

		QUnit.test("createNewRecord", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord;

			// Act
			var oActualRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);

			// Assert
			var oExpectedRecord = {
				EdmType: "Edm.String",
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELD
			};
			assert.deepEqual(oActualRecord, oExpectedRecord, "returns DataField record, without properties");
		});

		QUnit.test("createNewRecord", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord = {
					Label: { String: "Field1" }
				};

			// Act
			var oActualRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);

			// Assert
			var oExpectedRecord = {
				EdmType: "Edm.String",
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Label: { String: "Field1" }
			};
			assert.deepEqual(oActualRecord, oExpectedRecord, "returns DataField record, Label taken over");
		});

		QUnit.test("createNewRecord", function() {
			// Arrange
			var sRecordType = DATAFIELDFORANNOTATION,
				oOldRecord = {
					Label: { String: "Field1" }
				};

			// Act
			var oActualRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);

			// Assert
			var oExpectedRecord = {
				EdmType: "Edm.String",
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Label: { String: "Field1" },
				Target: { AnnotationPath: "" }
			};
			assert.deepEqual(oActualRecord, oExpectedRecord, "returns DataField record, Label taken over");
		});

		QUnit.test("createNewRecord", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord = {
					Label: { String: "Field1" },
					Value: {Path: "myTarget"}
				};

			// Act
			var oActualRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);

			// Assert
			var oExpectedRecord = {
				EdmType: "Edm.String",
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Label: { String: "Field1" },
				Value: { Path: "myTarget" }
			};
			assert.deepEqual(oActualRecord, oExpectedRecord, "returns DataField record, Label and Value taken over");
		});

		QUnit.test("createNewRecord", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord = {
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: LOW_IMPORTANCE
					},
					RecordType: INTENTBASEDNAV,
					Action: {String: "myAction"},
					SemanticObject:{String: ""},
					Value:{Path:"myPath"}
				};

			// Act
			var oActualRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);

			// Assert
			var oExpectedRecord = {
				EdmType: "Edm.String",
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: LOW_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Value: { Path: "myPath" }
			};
			assert.deepEqual(oActualRecord, oExpectedRecord, "returns DataField record , Value and Importance taken over");
		});

		QUnit.test("createNewRecord", function() {
			// Arrange
			var sRecordType = DATAFIELDWITHNAVPATH,
				oOldRecord = {
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: LOW_IMPORTANCE
					},
					RecordType: INTENTBASEDNAV,
					Action: {String: "myAction"},
					SemanticObject:{String: "Semantic_Object"},
					Value:{Path:"myPath"}
				};

			// Act
			var oActualRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);

			// Assert
			var oExpectedRecord = {
				EdmType: "Edm.String",
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: LOW_IMPORTANCE
				},
				RecordType: DATAFIELDWITHNAVPATH,
				Value: { Path: "myPath" },
				Target: {NavigationPropertyPath: ""}
			};
			assert.deepEqual(oActualRecord, oExpectedRecord, "returns DataFieldWithNavigationPath record , Value and Importance taken over");
		});

		QUnit.test("createNewRecord", function() {
			// Arrange
			var sRecordType = INTENTBASEDNAV,
				oOldRecord = {
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: LOW_IMPORTANCE
					},
					RecordType: DATAFIELD,
					Value: { Path: "myPath" }
				};

			// Act
			var oActualRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);

			// Assert
			var oExpectedRecord = {
				EdmType: "Edm.String",
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: LOW_IMPORTANCE
				},
				RecordType: INTENTBASEDNAV,
				SemanticObject:{String: "Semantic_Object"},
				Value:{Path:"myPath"}
			};
			assert.deepEqual(oActualRecord, oExpectedRecord, "returns DataFieldWithIntentBasedNavigation record , Value and Importance taken over");
		});

		/***************************************************/
		QUnit.module("The function getGroupElementTypeValues");

		QUnit.test("getGroupElementTypeValues", function() {
			// Arrange
			var oExpectedValue = {
				Datafield: {
					displayName: "Data Field"
				},
				DatafieldWithUrl: {
					displayName: "Data Field with URL"
				},
				Contact: {
					displayName: "Contact"
				},
				Address: {
					displayName: "Address"
				},
				DataFieldWithIntentBasedNavigation: {
					displayName: "Intent Based Navigation"
				},
				DataFieldWithNavigationPath: {
					displayName: "DataField with Navigation Path"
				}
			};

			// Act
			var oActualValue = GroupElementType.getGroupElementTypeValues();

			// Assert
			assert.deepEqual(oActualValue, oExpectedValue , "returns expected values");
		});

		/***************************************************/
		QUnit.module("The function related to GroupElementType", {
			beforeEach: function() {
				var that = this;
				this.oEntityType = {
					"com.sap.vocabularies.UI.v1.Identification": [
						{
							Value: {Path: "Product"},
							RecordType: DATAFIELD,
							"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				};
				this.oElement = {
					getModel: function() {
						return {
							getMetaModel: function() {
								return {
									getODataEntityType: function() {
										return that.oEntityType;
									}
								};
							}
						};
					},
					data: function() {
						return {
							"sap.ui.dt": {
								"annotation": {
								}
							}
						};
					}
				};
				this.oTempInfo = {
					annotation: "com.sap.vocabularies.UI.v1.Identification",
					annotationContext: {
						EdmType: "Edm.String",
						RecordType: DATAFIELD,
						Value: {Path: "Product"},
						"com.sap.vocabularies.UI.v1.Importance": { EnumMember: HIGH_IMPORTANCE}
					},
					path: "/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.Identification/0",
					target: "STTA_PROD_MAN.STTA_C_MP_ProductType",
					value: "Product"
				};
				var that = this;
				this.oGetTempInfoStub = sinon.stub(ChangeHandlerUtils, "getTemplatingInfo").returns(that.oTempInfo);
				this.oChange = {};
			},
			afterEach: function() {
				this.oGetTempInfoStub.restore();
			}
		});

		QUnit.test("getGroupElementType Datafield", function() {
			//Arrange
			var sExpectedGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELD;

			//Act
			var sActualGroupElementType = GroupElementType.getGroupElementType(this.oElement);

			//Assert
			assert.equal(sActualGroupElementType, sExpectedGroupElementType, "Datafield is returned correctly");
		});

		QUnit.test("getGroupElementType DataFieldWithIntentBasedNavigation", function() {
			//Arrange
			var sExpectedGroupElementType = GROUP_ELEMENT_TYPE_INTENTBASEDNAV;
			this.oTempInfo.annotationContext = {
				RecordType: INTENTBASEDNAV
			};
			//Act
			var sActualGroupElementType = GroupElementType.getGroupElementType(this.oElement);
			//Assert
			assert.equal(sActualGroupElementType, sExpectedGroupElementType, "DatafieldForIBN is returned correctly");
		});

		QUnit.test("getGroupElementType DataFieldWithNavigationPath", function() {
			//Arrange
			var sExpectedGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH;
			this.oTempInfo.annotationContext = {
				RecordType: DATAFIELDWITHNAVPATH
			};

			//Act
			var sActualGroupElementType = GroupElementType.getGroupElementType(this.oElement);

			//Assert
			assert.equal(sActualGroupElementType, sExpectedGroupElementType, "DataFieldWithNavigationPath is returned correctly");
		});

		QUnit.test("getGroupElementType DataFieldWithUrl", function() {
			//Arrange
			var sExpectedGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELDWITHURL;
			this.oTempInfo.annotationContext = {
				RecordType: DATAFIELDWITHURL
			};

			//Act
			var sActualGroupElementType = GroupElementType.getGroupElementType(this.oElement);

			//Assert
			assert.equal(sActualGroupElementType, sExpectedGroupElementType, "DataFieldWithUrl is returned correctly");
		});

		QUnit.test("getGroupElementType Contact", function() {
			//Arrange
			var sExpectedGroupElementType = GROUP_ELEMENT_TYPE_CONTACT;
			this.oTempInfo.annotationContext = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {AnnotationPath: CONTACT}
			};

			//Act
			var sActualGroupElementType = GroupElementType.getGroupElementType(this.oElement);

			//Assert
			assert.equal(sActualGroupElementType, sExpectedGroupElementType, "Contact is returned correctly");
		});

		QUnit.test("getGroupElementType Address", function() {
			//Arrange
			var sExpectedGroupElementType = GROUP_ELEMENT_TYPE_ADDRESS;
			this.oTempInfo.annotationContext = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {AnnotationPath: "com.sap.vocabularies.Communication.v1.Address"}
			};

			//Act
			var sActualGroupElementType = GroupElementType.getGroupElementType(this.oElement);

			//Assert
			assert.equal(sActualGroupElementType, sExpectedGroupElementType, "Address is returned correctly");
		});

		QUnit.test("getGroupElementType when annotation context does not exist", function() {
			//Arrange
			var sExpectedGroupElementType = undefined;
			this.oTempInfo.annotationContext = {};
			//Act
			var sActualGroupElementType = GroupElementType.getGroupElementType(this.oElement);
			//Assert
			assert.equal(sActualGroupElementType, sExpectedGroupElementType, "Returns undefined");
		});

		/******************* setGroupElementType *********************************************************/

		QUnit.test("setGroupElementType DataField to Contact", function() {
			//Arrange
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_DATAFIELD);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_CONTACT;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var oExpectedChange = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.UI.v1.Identification": [
					{
						EdmType: "Edm.String",
						Label: {String: "New Contact"},
						RecordType: DATAFIELDFORANNOTATION,
						Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact"},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
					}
				]
				}
			};

			var oNewContact = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.Communication.v1.Contact": {
					RecordType: "com.sap.vocabularies.Communication.v1.ContactType"
					 }
				 }
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange[1].content.newValue, oExpectedChange, "returns correct new GroupElement after a switch from datafield to contact");
			assert.deepEqual(aActualChange[0].content.newValue, oNewContact, "returns correct new contact annotation term");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType DatafieldWithUrl to Address", function() {
			//Arrange
			this.oEntityType = {
							"com.sap.vocabularies.UI.v1.Identification": [
								{
									Value: {Path: "Product"},
									RecordType: DATAFIELDWITHURL,
									Url: {Path: "Url"},
									"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				};
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_DATAFIELDWITHURL);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_ADDRESS;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var oExpectedChange = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.UI.v1.Identification": [
					 {
						EdmType: "Edm.String",
						Label: {
						 String: "New Address"
						},
					RecordType: DATAFIELDFORANNOTATION,
					Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Address"},
					"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
					 }
				]
				}
			};
			this.oTempInfo.annotationContext = {
				Value: {Path: "Product"},
				Url: {Path: "Url"},
				RecordType: DATAFIELDWITHURL,
				"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
			};
			var oNewAddress = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.Communication.v1.Address": {
					RecordType: "com.sap.vocabularies.Communication.v1.AddressType"
					}
				}
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange[1].content.newValue, oExpectedChange, "returns correct new GroupElement after a switch from datafield to address");
			assert.deepEqual(aActualChange[0].content.newValue, oNewAddress, "returns correct new address annotation term");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType Contact to DataFieldWithUrl", function() {
			//Arrange
			this.oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
						{
						EdmType: "Edm.String",
						Label: {String: GROUP_ELEMENT_TYPE_CONTACT},
						RecordType: DATAFIELDFORANNOTATION,
						Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact"},
						 "com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				};
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_CONTACT);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELDWITHURL;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var oExpectedChange = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.UI.v1.Identification": [{
					EdmType: "Edm.String",
					RecordType: DATAFIELDWITHURL,
					Value: { Path: "" },
					"Url": {Path: ""},
					Label: {String: GROUP_ELEMENT_TYPE_CONTACT},
					"com.sap.vocabularies.UI.v1.Importance": { EnumMember: HIGH_IMPORTANCE}
					}
					]
				}
			};
			this.oTempInfo.annotationContext = {
				Label: {String: GROUP_ELEMENT_TYPE_CONTACT},
				RecordType: DATAFIELDFORANNOTATION,
				Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact"},
				"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange[0].content.newValue, oExpectedChange, "returns correct new GroupElement after a switch from contact to datafieldwithUrl. Label taken over");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType Address to DataFieldWithNavigationPath", function() {
			//Arrange
			this.oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
						{
						EdmType: "Edm.String",
						Label: {String: "Supplier"},
						RecordType: DATAFIELDFORANNOTATION,
						Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Address"},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				};
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_ADDRESS);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var oExpectedChange = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.UI.v1.Identification": [{
						EdmType: "Edm.String",
						RecordType: DATAFIELDWITHNAVPATH,
						Value: {Path: ""},
						Target: {NavigationPropertyPath: ""},
						Label: {String: "Supplier"},
						"com.sap.vocabularies.UI.v1.Importance": { EnumMember: HIGH_IMPORTANCE}
			 		  }
				]
				}
			};
			this.oTempInfo.annotationContext = {
				Label: {String: "Supplier"},
				RecordType: DATAFIELDFORANNOTATION,
				Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact"}
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange[0].content.newValue, oExpectedChange, "returns correct new GroupElement after a switch from address to datafield with navigation path. Label taken over.");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType Address to Contact", function() {
			//Arrange
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_ADDRESS);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_CONTACT;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			this.oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
						{
						EdmType: "Edm.String",
						Label: {String: "Supplier"},
						RecordType: DATAFIELDFORANNOTATION,
						Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Address"},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				};
			var oExpectedChange = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.UI.v1.Identification": [
						{
						EdmType: "Edm.String",
						Label: {String: "Supplier"},
						RecordType: DATAFIELDFORANNOTATION,
						Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact"},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				}
			};
			this.oTempInfo.annotationContext = {
				Label: {String: "Supplier"},
				RecordType: DATAFIELDFORANNOTATION,
				Target: {AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact"}
			};
			var oNewContact = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.Communication.v1.Contact": {
					RecordType: "com.sap.vocabularies.Communication.v1.ContactType"
					}
				}
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange[1].content.newValue, oExpectedChange, "returns correct new GroupElement after a switch from address to contact. Label taken over.");
			assert.deepEqual(aActualChange[0].content.newValue, oNewContact, "returns correct new contact annotation term");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType DataFieldWithIntentBasedNavigation to DataField", function() {
			//Arrange
			this.oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
					{
						EdmType: "Edm.String",
						Label: {String: "Product"},
						RecordType: INTENTBASEDNAV,
						SemanticObject: {String: "EPMProduct"},
						Action: {String: "manage"},
						Value: {Path: "ProductForEdit"},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				};
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_INTENTBASEDNAV);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELD;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var oExpectedChange = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.UI.v1.Identification": [{
						EdmType: "Edm.String",
						Label: {String: "Product"},
						RecordType: DATAFIELD,
						Value: {Path: "ProductForEdit"},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
						}
					]
				}
			};
			this.oTempInfo.annotationContext = {
				Label: {String: "Product"},
				RecordType: INTENTBASEDNAV,
				SemanticObject: {String: "EPMProduct"},
				Action: {String: "manage"},
				Value: {Path: "ProductForEdit"},
				"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange[0].content.newValue, oExpectedChange, "returns correct new GroupElement after a switch from datafield with intent based navigation to datafield. Label taken over.");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType DataFieldWithNavigationPath to DataFieldWithIntentBasedNavigation", function() {
			//Arrange
			this.oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
						{
						EdmType: "Edm.String",
						Label: {String: "Sales Order"},
						RecordType: DATAFIELDWITHNAVPATH,
						Value: {Path: "RefSalesOrderID"},
						Target: {NavigationPropertyPath: "to_SalesOrder"}
						}
					]
				};
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_INTENTBASEDNAV;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var oExpectedChange = {
				"STTA_PROD_MAN.STTA_C_MP_ProductType": {
					"com.sap.vocabularies.UI.v1.Identification": [
					{
						EdmType: "Edm.String",
						Label: { String: "Sales Order"},
						RecordType: INTENTBASEDNAV,
						SemanticObject: {String: "Semantic_Object_0"},
						Value: {Path: "RefSalesOrderID"},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: HIGH_IMPORTANCE}
					}
					]
				}
			};
			this.oTempInfo.annotationContext = {
				Label: {String: "Sales Order"},
				RecordType: DATAFIELDWITHNAVPATH,
				Value: {Path: "RefSalesOrderID"},
				Target: {NavigationPropertyPath: "to_SalesOrder"}
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange[0].content.newValue, oExpectedChange, "returns correct new GroupElement after a switch from datafield with navigation path to datafield with intent based navigation. Label taken over.");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType DataField to DataField", function() {
			//Arrange
			this.oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
						{
						EdmType: "Edm.String",
						RecordType: DATAFIELD,
						Value: {Path: "RefSalesOrderID"}
						}
					]
				};
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_DATAFIELD);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELD;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var aExpectedChange = undefined;
			this.oTempInfo.annotationContext = {
				RecordType: DATAFIELD,
				Value: {Path: "RefSalesOrderID"}
			};

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange, aExpectedChange, "returns undefined when no change in group element type");
			assert.notOk(this.oChange.refreshPropertiesPane, "no refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType when annotation index does not exist", function() {
			//Arrange
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_DATAFIELD);
			var sNewGroupElementType = GROUP_ELEMENT_TYPE_INTENTBASEDNAV;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(-1);
			var aExpectedChange = undefined;

			//Assert
			assert.throws(function() { GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange) },"invalid index for old group element");
			assert.notOk(this.oChange.refreshPropertiesPane, "no refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

		QUnit.test("setGroupElementType when new group element type does not exist", function() {
			//Arrange
			var oGetGroupElementTypeStub = sinon.stub(GroupElementType, "getGroupElementType").returns(GROUP_ELEMENT_TYPE_DATAFIELD);
			var sNewGroupElementType = undefined;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(1);
			var aExpectedChange = undefined;

			//Act
			var aActualChange = GroupElementType.setGroupElementType(this.oElement, sNewGroupElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange, aExpectedChange, "returns undefined when new group element type does not exist");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetGroupElementTypeStub.restore();
		});

	});
