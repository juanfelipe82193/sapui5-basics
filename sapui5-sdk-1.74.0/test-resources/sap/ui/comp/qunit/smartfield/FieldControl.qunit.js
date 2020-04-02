/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/model/ParseException",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/FieldControl",
	"sap/ui/comp/smartfield/ODataHelper",
	"test-resources/sap/ui/comp/qunit/smartfield/QUnitHelper",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data",
	"test-resources/sap/ui/comp/qunit/smartfield/data/ComplexTestModel.data"
], function(
	ParseException,
	ODataModel,
	ODataMetaModel,
	JSONModel,
	library,
	SmartField,
	FieldControl,
	ODataHelper,
	QUnitHelper,
	ODataControlFactory,
	TestModelDataSet,
	ComplexTestModelDataSet
) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfield.FieldControl", {
		beforeEach: function() {
			var oTestModelIntern = JSON.parse(JSON.stringify(TestModelDataSet.TestModel));
			var oParent = new SmartField({
				mandatory: true
			});
			sinon.stub(oParent, "getBindingContext").returns({
				getObject: function() {
					return {};
				}
			});

			function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
				var vResult = bAsPath ? undefined : null,
					iSeparatorPos,
					sNamespace,
					sName;

				sQualifiedName = sQualifiedName || "";
				iSeparatorPos = sQualifiedName.lastIndexOf(".");
				sNamespace = sQualifiedName.slice(0, iSeparatorPos);
				sName = sQualifiedName.slice(iSeparatorPos + 1);
				jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					if (oSchema.namespace === sNamespace) {
						jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {
							if (oThing.name === sName) {
								vResult = bAsPath ? oThing.$path : oThing;
								return false; // break
							}
						});
						return false; // break
					}
				});

				return vResult;
			}

			function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
				var iIndex = -1;

				sPropertyName = sPropertyName || "name";
				jQuery.each(aArray || [], function (i, oObject) {
					if (oObject[sPropertyName] === vExpectedPropertyValue) {
						iIndex = i;
						return false; // break
					}
				});

				return iIndex;
			}

			this.oModel = sinon.createStubInstance(ODataModel);

			this.oModel.getServiceMetadata = function() {
				return oTestModelIntern;
			};

			this.oModel.getMetaModel = function() {
				var oStub = sinon.createStubInstance(ODataMetaModel);
				oStub.oModel = new JSONModel(oTestModelIntern);
				oStub.oData = oTestModelIntern;

				oStub.getObject = function(sPath) {
					var oNode, aParts = sPath.split("/"), iIndex = 0;

					if (!aParts[0]) {
						// absolute path starting with slash
						oNode = this.oData;
						iIndex++;
					}

					while (oNode && aParts[iIndex]) {
						oNode = oNode[aParts[iIndex]];
						iIndex++;
					}

					return oNode;
				};

				oStub.getODataEntityContainer = function(bAsPath) {
					var vResult = bAsPath ? undefined : null;

					jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
						var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

						if (j >= 0) {
							vResult = bAsPath
								? "/dataServices/schema/" + i + "/entityContainer/" + j
								: oSchema.entityContainer[j];
							return false; //break
						}
					});

					return vResult;
				};

				oStub.getODataEntitySet = function(sName, bAsPath) {
					var k,
						oEntityContainer = this.getODataEntityContainer(),
						vResult = bAsPath ? undefined : null;

					if (oEntityContainer) {
						k = findIndex(oEntityContainer.entitySet, sName);

						if (k >= 0) {
							vResult = bAsPath
								? oEntityContainer.$path + "/entitySet/" + k
								: oEntityContainer.entitySet[k];
						}
					}

					return vResult;
				};

				oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
					return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
				};

				oStub.getODataProperty = function (oType, vName, bAsPath) {
					var i,
						aParts = jQuery.isArray(vName) ? vName : [vName],
						oProperty = null,
						sPropertyPath;

					while (oType && aParts.length) {
						i = findIndex(oType.property, aParts[0]);

						if (i < 0) {
							break;
						}

						aParts.shift();
						oProperty = oType.property[i];
						sPropertyPath = oType.$path + "/property/" + i;

						if (aParts.length) {
							// go to complex type in order to allow drill-down
							oType = this.getODataComplexType(oProperty.type);
						}
					}

					return bAsPath ? sPropertyPath : oProperty;
				};

				oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
					return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
				};

				return oStub;
			};

			this.oParent = oParent;
			this.oHelper = new ODataHelper(this.oModel);
			this.oMetaData = new FieldControl(oParent, this.oHelper);
			this.oV4Helper = QUnitHelper;
		},
		afterEach: function() {

			if (this.oParent) {
				this.oParent.destroy();
				this.oParent = null;
			}

			if (this.oMetaData) {
				this.oMetaData.destroy();
				this.oMetaData = null;
			}

			if (this.oHelper) {
				this.oHelper.destroy();
				this.oHelper = null;
			}

			this.oV4Helper = null;
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oMetaData);
	});

	QUnit.test("getControlFormatters", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "StartDateTime"
		};
		this.oHelper.getProperty(oMeta);
		oResult = this.oMetaData.getControlFormatters(oMeta, [ "editable" ]);

		assert.strictEqual(!oResult.editable, false);
	});

	QUnit.test("getControlAttributes - invalid input", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};
		this.oHelper.getProperty(oMeta);
		oResult = this.oMetaData.getControlFormatters(oMeta);

		assert.strictEqual(!oResult, false);
	});

	QUnit.test("getControlAttributes - invalid attribute", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};
		this.oHelper.getProperty(oMeta);
		oResult = this.oMetaData.getControlFormatters(oMeta, [ "invalid" ]);

		assert.strictEqual(!oResult, false);
	});

	QUnit.test("_getMandatory - no meta data", function(assert) {
		var oResult = this.oMetaData._getMandatory({});
		assert.strictEqual(oResult.path()[0], "");
		assert.strictEqual(oResult.formatter("fieldContent"), true);
	});

	QUnit.test("_getMandatory - static prop (default false)", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};

		this.oV4Helper.liftV4Annotations(oMeta);
		this.oHelper.getProperty(oMeta);
		this.oMetaData._oParent.getMandatory = function() {
			return false;
		};

		oResult = this.oMetaData._getMandatory(oMeta);
		assert.strictEqual(oResult.path()[0], "");
		assert.strictEqual(oResult.formatter('fieldContent'), false);
	});

	QUnit.test("_getMandatory - static mandatory FC", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};
		this.oV4Helper.liftV4Annotations(oMeta);
		this.oHelper.getProperty(oMeta);
		oMeta.property.property["com.sap.vocabularies.Common.v1.FieldControl"] = {
			"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
		};

		this.oMetaData._oParent.getMandatory = function() {
			return false;
		};

		oResult = this.oMetaData._getMandatory(oMeta);
		assert.strictEqual(oResult.path()[0], "");
		assert.strictEqual(oResult.formatter('fieldContent'), true);
	});

	QUnit.test("_getMandatory - field-control prop without binding info", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getMandatory(oMeta);
		assert.strictEqual(oResult.path()[0], "Description_FC");
		assert.strictEqual(oResult.formatter(7), true);
	});

	QUnit.test("_getMandatory - field-control prop with binding info", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");

		this.oV4Helper.addSAPAnnotation(oSet,"updatable","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Description"
				};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getMandatory(oMeta, {
			parts : [{
				model : "json",
				path : "/Description"
			}]
		});
		assert.strictEqual(oResult.path()[0], "Description_FC");
		assert.strictEqual(oResult.formatter('fieldContent', 7), true);
	});

	QUnit.test("_getMandatory - field-control prop with binding info and formatter", function(assert) {
		var oSet, oType, oResult, bFormat = false, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Description"
				};

		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getMandatory(oMeta, {
			parts : [{
				model : "json",
				path : "/Description"
			}],
			formatter : function() {
				bFormat = true;
				return true;
			}
		});

		assert.strictEqual(oResult.path()[0], "Description_FC");
		assert.strictEqual(oResult.formatter('fieldContent', 7), true);
		assert.ok(bFormat);
	});

	QUnit.test("_getMandatory - nullable false", function(assert) {
		var oProperty, oResult;

		oProperty = {
			"property": {
				"name": "Description",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "80",
				"extensions": [	{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			"typePath": "Description"
		};

		oResult = this.oMetaData._getMandatory({ property : oProperty });

		assert.strictEqual(oResult.formatter("fieldContent"), true);
		assert.strictEqual(oResult.path()[0], "");
	});

	QUnit.test("_getVisible - returns default, which is true", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Description"
				};

		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getVisible(oMeta);

		assert.strictEqual(oResult.path()[0], "Description_FC");
		assert.strictEqual(oResult.formatter("fieldContent"), true);
	});

	QUnit.test("_getVisible - no meta data", function(assert) {
		var oResult = this.oMetaData._getVisible({});

		assert.strictEqual(oResult.path()[0], "");
		assert.strictEqual(oResult.formatter.call(this.oParent, "fieldContent"), true);
	});

	QUnit.test("_getVisible - binding info with formatter", function(assert) {
		var oSet, oType, oResult, oBindingInfo, bFormat = false, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};

		this.oHelper.getProperty(oMeta);
		oBindingInfo = {
			formatter : function() {
				bFormat = true;
				return true;
			},
			parts : [ {
				path: "mockPath"
			} ]
		};

		oResult = this.oMetaData._getVisible(oMeta, oBindingInfo);

		assert.strictEqual(oResult.path()[0], "mockPath");
		assert.strictEqual(oResult.formatter("fieldContent"), true);
		assert.ok(bFormat);
	});

	QUnit.test("_getVisible - field-control prop", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Description"
				};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getVisible(oMeta);

		assert.strictEqual(oResult.path()[0], "Description_FC");
		assert.strictEqual(oResult.formatter("fieldContent"), true);
	});

	QUnit.test("_getVisible - returns static prop and visible from parent", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Released"
				};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"visible","false");
		this.oV4Helper.liftV4Annotations(oMeta);

		oResult = this.oMetaData._getVisible(oMeta);
		assert.strictEqual(oResult.path()[0], "");
		assert.strictEqual(oResult.formatter("fieldContent"), false);
	});

	QUnit.test("_getVisible - static true overwritten by smart field", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Released"
				};

		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"visible","true");
		this.oV4Helper.liftV4Annotations(oMeta);
		this.oMetaData._oParent.getVisible = function() {
			return false;
		};

		oResult = this.oMetaData._getVisible(oMeta);
		assert.strictEqual(oResult.path()[0], "");
		assert.strictEqual(oResult.formatter.call(this._oParent, "fieldContent"), false);
	});

	QUnit.test("_getVisible - static true overwritten by smart field", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Released"
				};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"visible","true");
		this.oV4Helper.liftV4Annotations(oMeta);
		this.oMetaData._oParent.getVisible = function() {
			return false;
		};

		oResult = this.oMetaData._getVisible(oMeta);
		assert.strictEqual(oResult.path()[0], "");
		assert.strictEqual(oResult.formatter.call(this._oParent, "fieldContent"), false);
	});

	QUnit.test("_getVisible - returns static prop and visible from binding", function(assert) {
		var oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Released"
				};

		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"visible","false");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getVisible(oMeta, {
			parts : [{
				model : "json",
				path : "/Description"
			}]
		});
		assert.strictEqual(oResult.path()[0], "json>/Description");
		assert.strictEqual(oResult.formatter("fieldContent"), false);
	});

	QUnit.test("_getEditable - without meta data", function(assert) {
		var oResult = this.oMetaData._getEditable({});

		// assert
		assert.strictEqual(oResult.path()[0] === "", true);
		assert.strictEqual(oResult.formatter.call(null, "fieldContent"), true);
	});

	// BCP: 1770393565
	QUnit.test("the formatter function of the editable property should return null (test case 1)", function(assert) {

		// arrange
		var oSmartField = new SmartField({
			editable: true // default
		});

		// notice that the binding context is undefined
		this.stub(oSmartField, "getBindingContext").withArgs().returns(undefined);
		this.stub(oSmartField, "getBinding").withArgs("editable").returns({
			isInitial: function() {
				return false;
			}
		});
		var oFieldControl = new FieldControl(oSmartField, this.oHelper);
		var oResult = oFieldControl._getEditable({}, undefined, undefined);

		// act
		var vEditable = oResult.formatter.call(oSmartField, null);

		// assert
		assert.strictEqual(vEditable, true);
	});

	QUnit.test("it should restore the value of the editable property to its default", function(assert) {

		// arrange
		var oSmartField = new SmartField({
			editable: false // default is true
		});

		// notice that the binding context is undefined
		this.stub(oSmartField, "getBindingContext").withArgs().returns(undefined);
		this.stub(oSmartField, "getBinding").withArgs("editable").returns({
			isInitial: function() {
				return false;
			}
		});
		var oFieldControl = new FieldControl(oSmartField, this.oHelper);
		var oResult = oFieldControl._getEditable({}, undefined, undefined);
		var vEditable = oResult.formatter.call(oSmartField, null);

		// act
		oSmartField.setEditable(vEditable);

		// assert
		assert.strictEqual(oSmartField.getEditable(), true);
	});

	QUnit.test("_getEditable - from /Project(id1='71' id2='abcd')/EntityUpdatable_FC", function(assert) {
		var oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "StartDateTime"
		};

		this.oHelper.getProperty(oMeta);
		var oMetaData = {
			entity : oType,
			entitySet : oSet,
			property : oMeta.property
		};

		this.oV4Helper.liftV4Annotations(oMetaData);

		var oResult = this.oMetaData._getEditable(oMetaData);

		// assert
		assert.strictEqual(oResult.path().length === 1, true);//exactly the EntityUpdatable_FC
		assert.strictEqual(oResult.formatter("fieldContent", true), true);
	});

	QUnit.test("_getEditable - static value from updatable attribute on property", function(assert) {
		var oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "EntityUpdatable_FC"
		};

		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property, "updatable", "false");
		this.oV4Helper.liftV4Annotations(oMeta);
		var oResult = this.oMetaData._getEditable(oMeta);

		// assert
		assert.strictEqual(oResult.path()[0], "EntityUpdatable_FC");
		assert.strictEqual(oResult.formatter.call(this.oParent, "fieldContent", 7, false), false);
	});

	QUnit.test("_getEditable - 'field-control' and 'updatable-path' attributes (without binding info)", function(assert) {
		var oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "Description"
		};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		var oResult = this.oMetaData._getEditable(oMeta);
		var aPaths = oResult.path();

		assert.strictEqual(oResult.formatter(1, true), false);
		assert.strictEqual(aPaths[0], "Description_FC");
		assert.strictEqual(aPaths[1], "EntityUpdatable_FC");
	});

	QUnit.test("_getEditable - 'field-control' and 'updatable-path' attributes (with binding info)", function(assert) {
		var oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "Description"
		};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		var oResult = this.oMetaData._getEditable(oMeta, {
			parts : [{
				model : "json",
				path : "/Description"
			}]
		});

		var aPaths = oResult.path();

		// assert
		assert.strictEqual(oResult.formatter(1, true, ""), false);
		assert.strictEqual(aPaths[0], "Description_FC");
		assert.strictEqual(aPaths[1], "EntityUpdatable_FC");
		assert.strictEqual(aPaths[2], "json>/Description");
	});

	QUnit.test("_getEditable - 'field-control', but no 'updatable-path' attributes (without binding info)", function(assert) {
		var aPaths, oSet, oType, oResult, oMeta;

		oSet = {
				"name": "Project",
				"entityType": "ZMEY_SRV.Project_Type",
				"extensions": [{
					"name": "pageable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "addressable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			};
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Description"
				};
		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getEditable(oMeta);
		aPaths = oResult.path();
		assert.strictEqual(oResult.formatter(), true);
		assert.strictEqual(aPaths[0], "Description_FC");
		assert.strictEqual(aPaths.length, 1);
	});

	QUnit.test("_getEditable - 'field-control', but no 'updatable-path' attributes (with binding info)", function(assert) {
		var aPaths, oSet, oType, oResult, oMeta;

		oSet = {
				"name": "Project",
				"entityType": "ZMEY_SRV.Project_Type",
				"extensions": [{
					"name": "pageable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "addressable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			};
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Description"
				};

		this.oHelper.getProperty(oMeta);
		this.oV4Helper.addSAPAnnotation(oMeta.property.property,"field-control","Description_FC");
		this.oV4Helper.liftV4Annotations(oMeta);
		oResult = this.oMetaData._getEditable(oMeta, {
			parts : [{
				model : "json",
				path : "/Description"
			}]
		});

		aPaths = oResult.path();
		assert.strictEqual(oResult.formatter(1, ""), false);
		assert.strictEqual(aPaths[0], "Description_FC");
		assert.strictEqual(aPaths[1], "json>/Description");
		assert.strictEqual(aPaths.length, 2);
	});

	QUnit.test("_getEditable - 'updatable-path' from entity set attribute", function(assert) {
		var aPaths, oSet, oType, oResult, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Amount"
				};
		this.oHelper.getProperty(oMeta);

		oResult = this.oMetaData._getEditable(oMeta);

		aPaths = oResult.path();
		assert.strictEqual(oResult.formatter(true), true);
		assert.strictEqual(aPaths[0], "EntityUpdatable_FC");
		assert.strictEqual(aPaths.length, 1);
	});

	QUnit.test("_getEditable - with/out additional binding expression", function(assert) {
		var oProperty;

		var oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "Amount"
		};
		this.oHelper.getProperty(oMeta);

		var oResult = this.oMetaData._getEditable(oMeta, {
			parts: [{
				model : "json",
				path : "/Description"
			}]
		});

		var aPaths = oResult.path();
		assert.strictEqual(oResult.formatter(7, false), false);
		assert.strictEqual(aPaths[0], "EntityUpdatable_FC");
		assert.strictEqual(aPaths[1], "json>/Description");
		assert.strictEqual(aPaths.length, 2);

		//same function without binding info
		oResult = this.oMetaData._getEditable({
			entitySet: oSet,
			property: oProperty
		});
		aPaths = oResult.path();
		assert.strictEqual(oResult.formatter.call(null, 7, false), true);
	});

	QUnit.test("_getEditable - static false from entity set", function(assert) {
		var oSet = {
			"name": "Project",
			"entityType": "ZMEY_SRV.Project_Type",
			"extensions": [{
				"name": "pageable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "addressable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "content-version",
				"value": "1",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}]
		};
		this.oV4Helper.addSAPAnnotation(oSet,"updatable","false");

		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "Amount"
		};

		this.oHelper.getProperty(oMeta);
		this.oV4Helper.liftV4Annotations(oMeta);
		var oResult = this.oMetaData._getEditable(oMeta, {
			parts : [{
				model : "json",
				path : "/Description"
			}]
		});

		var aPaths = oResult.path();

		// assert
		assert.strictEqual(oResult.formatter.call(this.oParent, 7, false), false);
		assert.strictEqual(aPaths[0], "json>/Description");
	});

	QUnit.test("_getEditable - false taken create property at entity set based on v2 notation", function(assert) {
		var oSet = {
			"name": "Project",
			"entityType": "ZMEY_SRV.Project_Type",
			"extensions": [
				{
					"name": "pageable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "addressable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}
			]
		};

		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "Amount"
		};
		this.oHelper.getProperty(oMeta);

		var oResult = this.oMetaData._getEditable(oMeta);

		this.oMetaData._oParent.getBindingContext = function() {
			return {
				getObject : function() {
					return { __metadata : {
						created: true
						}
					};
				}
			};
		};

		var aPaths = oResult.path();

		// assert
		assert.strictEqual(oResult.formatter.call(null), true);
		assert.strictEqual(aPaths[0], "");
	});

	QUnit.test("_getEditable - true taken from parent ", function(assert) {
		var aPaths, oSet, oType, oResult, oMeta;

		oSet = {
			"name": "Project",
			"entityType": "ZMEY_SRV.Project_Type",
			"extensions": [{
				"name": "pageable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "addressable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "content-version",
				"value": "1",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "true",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}]
		};
		this.oV4Helper.addSAPAnnotation(oSet,"updatable","true");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "Amount"
				};
		this.oV4Helper.liftV4Annotations(oMeta);
		this.oHelper.getProperty(oMeta);

		oResult = this.oMetaData._getEditable(oMeta);
		aPaths = oResult.path();
		assert.strictEqual(oResult.formatter.call(null, "fieldContent"), true);
		assert.strictEqual(aPaths.length, 1);
	});

	QUnit.test("_getEditable - only binding info", function(assert) {
		var oSet, oType, oResult, oMetaData, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};

		this.oHelper.getProperty(oMeta);
		oMetaData = {
			entity : oType,
			entitySet : oSet,
			property : oMeta.property
		};

		oResult = this.oMetaData._getEditable(oMetaData, {});
		oResult.path();
		assert.strictEqual(!oResult.formatter("fieldContent"), true);
	});

	QUnit.test("_getEditable - binding info with formatter", function(assert) {
		var oSet, oType, oResult, oMetaData, oBindingInfo, bFormat = false, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};
		this.oHelper.getProperty(oMeta);
		oMetaData = {
			entity : oType,
			entitySet : oSet,
			property : oMeta.property
		};
		oBindingInfo = {
			formatter : function() {
				bFormat = true;
				return true;
			}
		};

		oResult = this.oMetaData._getEditable(oMetaData, oBindingInfo);
		oResult.path();
		assert.strictEqual(!oResult.formatter(), true);
		assert.ok(bFormat);
	});

	QUnit.test("_getEditable - default return value is true", function(assert) {
		var oSet, oType, oResult, oMetaData, oMeta;

		oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		oMeta = {
					entitySet: oSet,
					entityType: oType,
					path: "StartDateTime"
				};
		this.oHelper.getProperty(oMeta);
		oMetaData = {
			entity : oType,
			entitySet : oSet,
			property : oMeta.property
		};

		oResult = this.oMetaData._getEditable(oMetaData);
		assert.strictEqual(oResult.formatter.call(null, "fieldContent"), true);
	});

	QUnit.test("field control with complex type (Unit of Measure)", function(assert) {
		var done = assert.async();

		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;
			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {
				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false; // break
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
				if (oSchema.namespace === sNamespace) {
					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {
						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false; // break
						}
					});
					return false; // break
				}
			});

			return vResult;
		}

		var oComplexTestModelIntern = JSON.parse(JSON.stringify(ComplexTestModelDataSet));
		var oParent = {
			getBindingContext : function() {
				return {
					sPath : "/FinsPostingPaymentHeaders(TmpId='3HLDC27520',TmpIdType='T')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return {
					"parts" : [{
						model : undefined,
						path : "ID"
					}]
				};
			},
			bindProperty : function() {

			},
			unbindProperty : function() {

			},
			getEditable : function() {
				return true;
			},
			getEnabled : function() {
				return true;
			},
			getVisible : function() {
				return true;
			},
			getMandatory : function() {
				return true;
			},
			getWidth : function() {
				return "100%";
			},
			getTextAlign : function() {
				return null;
			},
			getPlaceholder : function() {
				return null;
			},
			getName : function() {
				return null;
			},
			data : function() {
				return null;
			},
			getObjectBinding: function() {
				return null;
			},
			getExpandNavigationProperties: function() {
				return false;
			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			},
			isTextInEditModeSourceNotNone: function() {
				return false;
			},
			fireInitialise: function() {},
			attachEvent: function() {},
			detachEvent: function() {}
		};
		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getServiceMetadata = function() {
			return oComplexTestModelIntern;
		};
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oComplexTestModelIntern);
			oStub.oData = oComplexTestModelIntern;

			oStub.getObject = function(sPath) {
				var oNode, aParts = sPath.split("/"), iIndex = 0;

				if (!aParts[0]) {
					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var k,
				oEntityContainer = this.getODataEntityContainer(),
				vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					k = findIndex(oEntityContainer.entitySet, sName);
					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);
					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {
						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			oStub.loaded = function() {
				return Promise.resolve();
			};

			return oStub;
		};

		var oFactory = new ODataControlFactory(oModel, oParent, {
			entitySet : "FinsPostingPaymentHeaders",
			path: "Payment/AmountInCoCodeCrcy"
		});

		oFactory._oModel.oMetadata = {
			bLoaded : true
		};

		oFactory.bind().then(function() {
			this.oV4Helper.addSAPAnnotation(oFactory._oMetaData.property.property, "field-control","UxFcAmountInCoCodeCrcy");
			this.oV4Helper.liftV4Annotations(oFactory._oMetaData);
			var oFieldControl = oFactory._oFieldControl._getEditable(oFactory._oMetaData);
			var aPaths = oFieldControl.path();
			assert.strictEqual(aPaths[0], "Payment/UxFcAmountInCoCodeCrcy");

			oFieldControl = oFactory._oFieldControl._getMandatory(oFactory._oMetaData);
			aPaths = oFieldControl.path();
			assert.strictEqual(aPaths[0], "Payment/UxFcAmountInCoCodeCrcy");

			oFieldControl = oFactory._oFieldControl._getVisible(oFactory._oMetaData);
			aPaths = oFieldControl.path();
			assert.strictEqual(aPaths[0], "Payment/UxFcAmountInCoCodeCrcy");

			// cleanup
			oFactory.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("_toPath", function(assert) {
		var sPath, oMetaData =  {
			path: "Payment/AmountInCoCodeCrcy",
			property: {
				complex: true,
				property: {
					name: "AmountInCoCodeCrcy"
				 }
			}
		};

		sPath = this.oMetaData._toPath(oMetaData, "UxFcAmountInCoCodeCrcy");
		assert.strictEqual(sPath, "Payment/UxFcAmountInCoCodeCrcy");

		oMetaData.property.complex = false;
		sPath = this.oMetaData._toPath(oMetaData, "UxFcAmountInCoCodeCrcy");
		assert.strictEqual(sPath, "UxFcAmountInCoCodeCrcy");
	});

	QUnit.test("getMandatoryCheck - invalid input", function(assert) {
		var oResult;

		oResult = this.oMetaData.getMandatoryCheck();
		assert.strictEqual(!oResult, true);
	});


	QUnit.test("getMandatoryCheck - mandatory for Edm.String, client check", function(assert) {
		var oProp, oResult, bExc = false;
		oProp = JSON.parse("{\"property\":{\"name\":\"Description\",\"type\":\"Edm.String\",\"nullable\":" +
				"\"false\",\"maxLength\":\"80\",\"extensions\":[{\"name\":\"field-control\",\"value\":" +
				"\"Description_FC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":" +
				"\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"" +
				"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols" +
				"/SAPData\"}]},\"typePath\":\"Description\",\"extensions\":{\"sap:filterable\":\"false\"," +
				"\"sap:sortable\":\"false\",\"sap:field-control\":\"Description_FC\"}}");

		oResult = this.oMetaData.getMandatoryCheck(oProp);
		assert.strictEqual(!!oResult, true);

		try {
			oResult();
		} catch (ex) {
			bExc = true;
		}
		assert.strictEqual(bExc, true);
	});

	QUnit.test("getMandatoryCheck - static mandatory for Edm.String, client check", function(assert) {
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Description\",\"com.sap.vocabularies.Common.v1.FieldControl\"" +
				":{\"EnumMember\":\"com.sap.vocabularies.Common.v1.FieldControlType/Mandatory\"},\"type\":\"" +
				"Edm.String\",\"maxLength\":\"80\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"" +
				"Description_FC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"" +
				"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"" +
				"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/" +
				"SAPData\"}]},\"typePath\":\"Description\",\"extensions\":{\"sap:filterable\":\"false\",\"" +
				"sap:sortable\":\"false\",\"sap:field-control\":\"Description_FC\"}}");

		var fnMandatoryCheck = this.oMetaData.getMandatoryCheck(oProperty);

		try {
			fnMandatoryCheck();
		} catch (oException) {
			assert.ok(oException instanceof ParseException);
		}
	});

	QUnit.test("getMandatoryCheck - mandatory for Edm.String, server check", function(assert) {
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Description\",\"type\":\"Edm.String\",\"nullable\":\"" +
				"false\",\"maxLength\":\"80\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"" +
				"Description_FC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"" +
				"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"" +
				"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"" +
				"}]},\"typePath\":\"Description\",\"extensions\":{\"sap:filterable\":\"false\",\"sap:sortable\"" +
				":\"false\",\"sap:field-control\":\"Description_FC\"}}");

		sinon.stub(this.oMetaData._oParent, "getClientSideMandatoryCheck").returns(false);
		var fnMandatoryCheck = this.oMetaData.getMandatoryCheck(oProperty);

		try {
			fnMandatoryCheck();
		} catch (oException) {
			assert.ok(oException instanceof ParseException);
		}
	});

	QUnit.test("getMandatoryCheck - mandatory for Edm.Decimal, client side check", function(assert) {
		var oProp, oResult, bExc = false;
		oProp = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\"" +
				",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\"" +
				":[{\"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"" +
				"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"" +
				"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"" +
				"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"" +
				"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\"" +
				":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"" +
				"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"" +
				"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"" +
				"}]},\"typePath\":\"Amount\",\"extensions\":{\"sap:filterable\":\"false\",\"sap:sortable\":\"" +
				"false\",\"sap:label\":\"Preis\",\"sap:unit\":\"AmountCurrency\"}}");

		oResult = this.oMetaData.getMandatoryCheck(oProp);
		assert.strictEqual(!!oResult, true);
		try {
			oResult();
		} catch (ex) {
			bExc = true;
		}
		assert.strictEqual(bExc, true);
	});

	QUnit.test("getMandatoryCheck - mandatory for Edm.Decimal, server side check", function(assert) {
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\"" +
				",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"" +
				"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"" +
				"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"" +
				"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"" +
				"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"value\"" +
				":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\"" +
				",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"" +
				"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"" +
				"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"" +
				"}]},\"typePath\":\"Amount\",\"extensions\":{\"sap:filterable\":\"false\",\"sap:sortable\":\"" +
				"false\",\"sap:label\":\"Preis\",\"sap:unit\":\"AmountCurrency\"}}");

		sinon.stub(this.oMetaData._oParent, "getClientSideMandatoryCheck").returns(false);
		var fnMandatoryCheck = this.oMetaData.getMandatoryCheck(oProperty);

		try {
			fnMandatoryCheck();
		} catch (oException) {
			assert.ok(oException instanceof ParseException);
		}
	});

	QUnit.test("checkMandatory - mandatory for Edm.Boolean", function(assert) {
		var oProp, oResult;
		oProp = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\"" +
				",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"" +
				"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"children\"" +
				":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"LongDescription\"" +
				",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"" +
				"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"" +
				"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\"" +
				":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"" +
				"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"" +
				"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"" +
				"http://www.sap.com/Protocols/SAPData\"}]},\"typePath\":\"Amount\",\"extensions\":{\"" +
				"sap:filterable\":\"false\",\"sap:sortable\":\"false\",\"sap:label\":\"Preis\",\"sap:unit\"" +
				":\"AmountCurrency\"}}");

		oResult = this.oMetaData.getMandatoryCheck(oProp);
		assert.strictEqual(!oResult, true);
	});

	QUnit.test("getPropertyNames", function(assert) {
		var aResult;

		aResult = this.oMetaData.getPropertyNames();
		assert.strictEqual(aResult.length, 3);

		aResult = this.oMetaData.getPropertyNames(true);
		assert.strictEqual(aResult.length, 2);
	});

	QUnit.test("getUOMEditState", function(assert) {
		var oSet = this.oHelper.oMeta.getODataEntitySet("Project");
		this.oV4Helper.addSAPAnnotation(oSet,"updatable-path","EntityUpdatable_FC");
		var oType = this.oHelper.oMeta.getODataEntityType(oSet.entityType);
		var oMeta1 = {
			path: "Amount",
			entitySet : oSet,
			entityType: oType
		};

		this.oHelper.getProperty(oMeta1);
		var oUOM = this.oHelper.getUnitOfMeasure2(oMeta1);
		var oMeta = {
			path: "Amount",
			entitySet: oSet,
			entityType: oType,
			property: oMeta1.property,
			annotations: {
				uom: oUOM
			}
		};

		this.oV4Helper.liftV4Annotations(oMeta);
		var oResult = this.oMetaData.getUOMEditState(oMeta);
		var aPaths = oResult.path();

		// assert
		// respect duplicate paths => the same paths for each formatter
		assert.strictEqual(aPaths[0], "EntityUpdatable_FC");
		assert.strictEqual(aPaths[1], "EntityUpdatable_FC");
		assert.strictEqual(oResult.formatter(true, true), 1);
		assert.strictEqual(oResult.formatter(true, false), 1);
		assert.strictEqual(oResult.formatter(false, true), 1);
		assert.strictEqual(oResult.formatter(false, false), 0);
	});

	QUnit.test("hasUomEditState shall return true", function(assert) {
		var bResult;

		this.oMetaData._oParent.getProposedControl = function() {
			return "ObjectNumber";
		};

		bResult = this.oMetaData.hasUomEditState({
			annotations: {
				uom: true
			}
		});
		assert.ok(bResult);
	});

	QUnit.test("hasUomEditState shall return true", function(assert) {
		var bResult;

		this.oMetaData._oParent.getProposedControl = function() {
			return null;
		};
		this.oMetaData._oParent.getControlProposal = function() {
			return {
				getControlType: function() {
					return null;
				},
				getObjectStatus: function() {
					return {
						getObjectStatus: function() {
							return {};
						}
					};
				}
			};
		};

		bResult = this.oMetaData.hasUomEditState({
			annotations: {
				uom: true
			}
		});
		assert.ok(bResult);
	});

	QUnit.test("hasUomEditState shall return false", function(assert) {
		var bResult;

		this.oMetaData._oParent.getProposedControl = function() {
			return null;
		};

		bResult = this.oMetaData.hasUomEditState();
		assert.ok(!bResult);
	});

	QUnit.test("Shall be destructible", function(assert) {
		this.oMetaData.destroy();
		assert.ok(this.oMetaData);
		assert.equal(this.oMetaData._oModel, null);
	});

	QUnit.test("it should reset the editable, visible and mandatory properties when " +
				"the FieldControl instance is destroyed", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: true,
			visible: true,
			mandatory: true
		});

		var oFieldControl = new FieldControl(oSmartField, this.oHelper);

		// arrange
		oFieldControl._oStoredProperties = { // mimic internal data structure for testing
			editable: false,
			visible: false,
			mandatory: false
		};

		// act
		oFieldControl.destroy();

		// assert
		assert.strictEqual(oSmartField.getEditable(), false);
		assert.strictEqual(oSmartField.getVisible(), false);
		assert.strictEqual(oSmartField.getMandatory(), false);

		// cleanup
		oSmartField.destroy();
		oFieldControl.destroy();
	});

	QUnit.start();

});
