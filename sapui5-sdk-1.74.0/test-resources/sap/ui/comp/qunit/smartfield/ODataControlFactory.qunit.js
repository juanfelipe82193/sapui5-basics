/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/core/library",
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/comp/smartfield/ODataControlSelector",
	"sap/ui/comp/smartfield/TextInEditModeSource",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/m/Select",
	"sap/m/ComboBox",
	"sap/m/HBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataMetaModel",
	"test-resources/sap/ui/comp/qunit/smartfield/QUnitHelper",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/Input",
	"sap/m/InputType",
	"sap/m/CheckBox",
	"sap/m/Link",
	"sap/m/Text",
	"sap/ui/model/odata/type/String",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data",
	"test-resources/sap/ui/comp/qunit/smartfield/data/ValueHelpModel.data",
	"test-resources/sap/ui/comp/qunit/smartfield/data/ComplexTestModel.data",
	"sap/base/util/includes"

], function(coreLibrary,
	library,
	SmartField,
	ODataControlFactory,
	ODataControlSelector,
	TextInEditModeSource,
	SmartLink,
	Select,
	ComboBox,
	HBox,
	JSONModel,
	ODataMetaModel,
	QUnitHelper,
	ODataModel,
	Input,
	InputType,
	CheckBox,
	Link,
	Text,
	StringType,
	TestModelTestData,
	ValueHelpModelTestData,
	ComplexTestModelTestData,
	includes

) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	var oV4Helper = QUnitHelper;
	var fCreateSmartFieldStub = function(oModel) {
		return {
			getUrl: function() {
				return null;
			},
			getBindingContext: function() {
				return {
					sPath: "/Project(id1='71' id2='abcd')",
					getObject: function () {}
				};
			},
			getModel: function() {
				return oModel;
			},
			getBindingInfo: function(s) {
				if (s === "width") {
					return null;
				}
				if (s === "textAlign") {
					return null;
				}

				if (s === "url") {
					return null;
				}

				return {
					"parts": [
						{
							model: undefined,
							path: "ID"
						}
					]
				};
			},
			bindProperty: function() {

			},
			unbindProperty: function() {

			},
			isBound: function() {
				return true;
			},
			getEditable: function() {
				return false;
			},
			getContextEditable: function() {
				return false;
			},
			getUomEditable: function() {
				return false;
			},
			getWidth: function() {
				return "100%";
			},
			getTextAlign: function() {
				return null;
			},
			getPlaceholder: function() {
				return null;
			},
			getTooltip: function() {
				return null;
			},
			getName: function() {
				return null;
			},
			getFetchValueListReadOnly: function() {
				return true;
			},
			attachFormatError: function(fErr) {

			},
			attachParseError: function(fErr) {

			},
			attachValidationError: function(fErr) {

			},
			attachValidationSuccess: function(fSucc) {

			},
			fireValidationSuccess: function(oParam) {

			},
			fireFormatError: function(oParam) {

			},
			fireParseError: function(oParam) {

			},
			fireValidationError: function(oParam) {

			},
			data: function() {
				return null;
			},
			getObjectBinding: function() {
				return null;
			},
			getMaxLength: function() {
				return 0;
			},
			getShowValueHelp: function() {
				return true;
			},
			getShowSuggestion: function() {
				return true;
			},
			getValueState: function() {
				return null;
			},
			getValueStateText: function() {
				return null;
			},
			getCustomData: function() {
				return null;
			},
			getUomEnabled: function() {
				return false;
			},
			getUomVisible: function() {
				return false;
			},
			getTextLabel: function() {
				return null;
			},
			getComputedTextLabel: function() {
				return this.getTextLabel() || this._sAnnotationLabel;
			},
			getMandatory: function() {
				return false;
			},
			getEnabled: function() {
				return false;
			},
			getVisible: function() {
				return false;
			},
			fireInitialise: function() {

			},
			getConfiguration: function() {
				return null;
			},
			isContextTable: function() {
				return (this.getControlContext() === "responsiveTable" || this.getControlContext() === "table");
			},
			getProposedControl: function() {
				return null;
			},
			getUseSideEffects: function() {
				return false;
			},
			getControlProposal: function() {
				return null;
			},
			getControlContext: function() {
				return "form";
			},
			hasListeners: function() {
			},
			getId: function() {
				return "smartfield";
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
			getMode: function() {
				return "display";
			},
			getWrapping: function() {
				return true;
			},
			isPropertyInitial: function() {},
			getBindingMode: function(sPropertyName) {},
			getBindingPath: function(sPropertyName) {}
		};
	};

	var getObject1 = function(oModel, sArrayName, sQualifiedName, bAsPath) {
		var vResult = bAsPath ? undefined : null, iSeparatorPos, sNamespace, sName,oMetaData;

		sQualifiedName = sQualifiedName || "";
		iSeparatorPos = sQualifiedName.lastIndexOf(".");
		sNamespace = sQualifiedName.slice(0, iSeparatorPos);
		sName = sQualifiedName.slice(iSeparatorPos + 1);
		oMetaData = oModel.getServiceMetadata();

		jQuery.each(oMetaData.dataServices.schema || [], function(i, oSchema) {
			if (oSchema.namespace === sNamespace) {
				jQuery.each(oSchema[sArrayName] || [], function(j, oThing) {
					if (oThing.name === sName) {
						vResult = bAsPath ? oThing.$path : oThing;
						return false; // break
					}
				});
				return false; // break
			}
		});

		return vResult;
	};

	var findIndex = function(aArray, vExpectedPropertyValue, sPropertyName) {
		var iIndex = -1;

		sPropertyName = sPropertyName || "name";
		jQuery.each(aArray || [], function(i, oObject) {
			if (oObject[sPropertyName] === vExpectedPropertyValue) {
				iIndex = i;
				return false; // break
			}
		});

		return iIndex;
	};

	var findObject = function(aArray, vExpectedPropertyValue, sPropertyName) {
		var iIndex = findIndex(aArray, vExpectedPropertyValue, sPropertyName);

		return iIndex < 0 ? null : aArray[iIndex];
	};

	var createMetaModel = function(oData,oModel) {
		var oStub = sinon.createStubInstance(ODataMetaModel);
		oStub.oModel = new JSONModel(oData);
		oStub.oData = oData;
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

			jQuery.each(oData.dataServices.schema || [], function(i, oSchema) {
				var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

				if (j >= 0) {
					vResult = bAsPath ? "/dataServices/schema/" + i + "/entityContainer/" + j : oSchema.entityContainer[j];
					return false; //break
				}
			});

			return vResult;
		};
		oStub.getODataEntitySet = function(sName, bAsPath) {
			var k, oEntityContainer = this.getODataEntityContainer(), vResult = bAsPath ? undefined : null;

			if (oEntityContainer) {
				k = findIndex(oEntityContainer.entitySet, sName);
				if (k >= 0) {
					vResult = bAsPath ? oEntityContainer.$path + "/entitySet/" + k : oEntityContainer.entitySet[k];
				}
			}

			return vResult;
		};
		oStub.getODataEntityType = function(sQualifiedName, bAsPath) {
			return getObject1(oModel, "entityType", sQualifiedName, bAsPath);
		};
		oStub.getODataProperty = function(oType, vName, bAsPath) {
			var i, aParts = jQuery.isArray(vName) ? vName : [
				vName
			], oProperty = null, sPropertyPath;

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
		oStub.getProperty = function(sPath) {
			return this.getObject(sPath);
		};
		oStub.getODataComplexType = function(sQualifiedName, bAsPath) {
			return getObject1(oModel, "complexType", sQualifiedName, bAsPath);
		};
		oStub.getODataAssociationSetEnd = function(oEntityType, sName) {
			var oAssociationSet, oAssociationSetEnd = null, oEntityContainer = this.getODataEntityContainer(), oNavigationProperty = oEntityType ? findObject(oEntityType.navigationProperty, sName) : null;

			if (oEntityContainer && oNavigationProperty) {
				oAssociationSet = findObject(oEntityContainer.associationSet, oNavigationProperty.relationship, "association");
				oAssociationSetEnd = oAssociationSet ? findObject(oAssociationSet.end, oNavigationProperty.toRole, "role") : null;
			}

			return oAssociationSetEnd;
		};
		oStub.loaded = function() {
			return Promise.resolve();
		};
		return oStub;
	};

	var setUpModel = function(oData) {
		var oDataClone = JSON.parse(JSON.stringify(oData));
		var oModel = sinon.createStubInstance(ODataModel);

		oModel.oMetadata = {
			bLoaded: true
		};
		oModel.oAnnotations = {};
		oModel.getServiceMetadata = function() {
			return oDataClone;
		};
		var oMetaModel = createMetaModel(oDataClone, oModel);

		oV4Helper.liftSchema(oMetaModel.oData,oMetaModel);

		oModel.getMetaModel = function() { return oMetaModel; };

		return oModel;
	};


	QUnit.module("sap.ui.comp.smartfield.ODataControlFactory", {
		beforeEach: function() {
			this.oModel = setUpModel(TestModelTestData.TestModel);
			this.oVHModel = setUpModel(ValueHelpModelTestData);
			this.oComplexModel = setUpModel(ComplexTestModelTestData);
		},
		afterEach: function() {
			this.oModel.destroy();
			this.oVHModel.destroy();
			this.oComplexModel.destroy();
		}
	});

	QUnit.test("check auto Expand", function(assert) {
		var oFactory, oParent, bCalled, oBinding;
		oParent = fCreateSmartFieldStub(this.oModel);
		bCalled = false;

		oParent.bindElement = function(element) {
			oBinding = element;
		};

		var oObject = {};
		oObject.__metadata = {
			created: true
		};

		var oCtx = {};

		oCtx.getObject = function() {
			return oObject;
		};

		/* Check not called when property expandNavigationProperties is false */

		//spy if this is called during the init
		var getAutoExpandProperties = function(oMetadataProperty) {
			bCalled = true;
			return "to_Navi";
		};

		var oName = {
			entitySet: "Project",
			path: "Name"
		};

		oParent.getBindingContext = function() {
			return oCtx;
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, oName);
		oFactory._oHelper.getAutoExpandProperties = getAutoExpandProperties;
		oFactory._init(oFactory._oMeta);
		assert.strictEqual(bCalled, false, "For the default property value expandNavigationProperties = false of a smart field, the calculation of navigation properties is not performed");

		//clean
		oFactory.destroy();
		bCalled = false;

		/* Check not called when entity is not persited but property expandNavigationProperties is true */

		oParent.getExpandNavigationProperties = function() {
			return true;
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, oName);
		oFactory._oHelper.getAutoExpandProperties = getAutoExpandProperties;
		oFactory._init(oFactory._oMeta);
		assert.strictEqual(bCalled, false, "Even when allowing autoexpand this is not performed in case the curresponding object is just created and not persited yet");

		//clean
		oFactory.destroy();
		bCalled = false;

		/* Now let object be persisted and autoExpandProperties be true => Assumption autoExpanding will be called */

		oObject.__metadata.created = false;
		oParent.getBindingContext = function() {
			return oCtx;
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, oName);

		oFactory._oHelper.getAutoExpandProperties = getAutoExpandProperties;
		oFactory._init(oFactory._oMeta);
		assert.strictEqual(bCalled, true, "Only when auto expand is switchen on and the object is not new, then the auto expand feature is called");
		assert.ok(oBinding, "The element binding is applied");
		assert.strictEqual(oBinding.path, "", "It has been applied with an empty path");
		assert.strictEqual(oBinding.parameters.expand, "to_Navi", "It only expands what is determined from the helper");
		assert.strictEqual(oBinding.parameters.select, "to_Navi", "Also to save performance it only selects what is determined from the helper");

		oFactory.destroy();
	});

	QUnit.test("Shall be instantiable", function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// assert
		assert.ok(oFactory);
		var oMeta = oFactory.getMetaData();
		assert.ok(oMeta);

		// cleanup
		oFactory.destroy();
	});

	QUnit.test("Shall be instantiable with invalid property name", function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "DescriptionInvalid"
		});

		// act
		oFactory._init(oFactory._oMeta);

		// assert
		assert.ok(oFactory);

		// cleanup
		oFactory.destroy();
	});

	QUnit.test("Shall be instantiable without model", function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(null, oParent, {
			namespace: "Project",
			path: "Description",
			entitySetObject: {},
			entityType: {
				type: {},
				count: 0
			},
			property: {},
			annotations: {}
		});

		// act
		oFactory._init(oFactory._oMeta);

		// assert
		assert.ok(oFactory);

		// cleanup
		oFactory.destroy();
	});

	// BCP: 1880514853
	QUnit.test("it should create the inner controls synchronous if the meta model is loaded", function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// arrange
		this.oModel.bMetaModelLoaded = true; // to simulate metadata loaded
		var oSpyTriggerCreationOfControls = this.spy(oFactory, "triggerCreationOfControls");

		// act
		oFactory.bind();

		// assert
		assert.strictEqual(oSpyTriggerCreationOfControls.callCount, 1, "The .triggerCreationOfControls method was called");

		// cleanup
		oFactory.destroy();
	});

	// BCP: 1880534442
	QUnit.test('it should not raise an exception when the "bind" method is called and the "expandNavigationProperties"' +
		' property is set to "true"', function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// arrange
		this.stub(oParent, "getExpandNavigationProperties").returns(true);
		this.stub(oParent, "getBindingContext").returns(undefined);

		// act
		try {
			oFactory._init(oFactory._oMeta);
		} catch (oError) {

		// assert
			assert.ok(false);
			return;
		}

		assert.ok(true);

		// cleanup
		oFactory.destroy();
	});

	// BCP: 1880534442
	QUnit.test('it should not raise an exception when the "bind" method is called and the "expandNavigationProperties"' +
		' property is set to "true"', function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// arrange
		this.stub(oParent, "getExpandNavigationProperties").returns(true);
		this.stub(oParent.getBindingContext(), "getObject").returns(undefined);

		// act
		try {
			oFactory._init(oFactory._oMeta);
		} catch (oError) {

			// assert
			assert.ok(false);
			return;
		}

		assert.ok(true);

		// cleanup
		oFactory.destroy();
	});

	QUnit.test("it should not try to initialize the inner controls after the SmartField control is destroyed", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			textInEditModeSource: library.smartfield.TextInEditModeSource.None
		});
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Description"
		});

		// arrange
		var oSpyTriggerCreationOfControls = this.spy(oFactory, "triggerCreationOfControls");
		oFactory.bind().finally(function() {

			// assert
			assert.strictEqual(oSpyTriggerCreationOfControls.callCount, 0);
			done();
		});

		// act
		oSmartField.destroy();
		oFactory.destroy(); // simulate factory destruction
	});

	QUnit.test("createControl", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode = function() {
			return "edit";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory.rebindOnCreated();
			var oControl = oFactory.createControl();

			// assert
			assert.ok(oControl);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("createControl - optional onCreate", function(assert) {

		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		oFactory.onCreate = function() {};
		var oOnCreate = sinon.spy(oFactory, "onCreate");

		oFactory.bind().finally(function() {

			// act
			var oControl = oFactory.createControl();

			// assert
			assert.strictEqual(oControl.control.getMetadata().getName(), "sap.m.HBox");
			assert.strictEqual(oOnCreate.callCount, 0);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			oFactory.onCreate.restore();
			done();
		});
	});

	QUnit.test("Add annotation label to SmartField", function (assert) {
		var oParent = new SmartField();
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		var sTextLabel = "Label Text";
		this.stub(oFactory, "getDataProperty").returns({property: {}});
		this.stub(oFactory._oHelper.oAnnotation, "getLabel").returns(sTextLabel);
		oFactory._addLabelAndQuickInfo();
		assert.ok(oParent._sAnnotationLabel, "Smartfield has annotation label");
		assert.equal(oParent._sAnnotationLabel, sTextLabel, "Smartfield annotation label is the expected one");
	});

	QUnit.test("_addAriaLabelledBy", function(assert) {
		var oParent;
		oParent = {
			getBindingContext: function() {
				return {
					sPath: "/Project(id1='71' id2='abcd')"
				};
			},
			getModel: function() {
				return this.oModel;
			},
			getBindingInfo: function() {
				return {
					"parts": [
						{
							model: undefined,
							path: "AmountCurrency"
						}
					]
				};
			},
			data: function() {
				return {
					"configdata": {
						"isInnerControl": true,
						"isUOM": true
					}
				};
			},
			bindProperty: function() {

			},
			getObjectBinding: function() {
				return {
					sPath: "AmountCurrency"
				};
			},
			addDependent: function() {

			},
			getEditable: function() {
				return false;
			},
			getWidth: function() {
				return "100%";
			},
			getTextAlign: function() {
				return null;
			},
			getPlaceholder: function() {
				return null;
			},
			getName: function() {
				return null;
			},
			getAriaLabelledBy: function() {
				return [];
			},
			getControlContext: function() {
				return "form";
			},
			addAggregation: function() {
			},
			unbindProperty: function() {

			},
			getExpandNavigationProperties: function() {
				return false;
			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});
		oFactory._init({
			model: this.oModel,
			path: "AmountCurrency",
			entitySet: "Project"
		});
		var oControl = {
			control: new Input()
		};

		oFactory._addAriaLabelledBy(oControl);
		assert.equal(sap.ui.getCore().byId(oControl.control.getAriaLabelledBy()[0]).getText(), "Currency", "ARIA label taken from sap:label");

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_createEdmString with format-display='UpperCase'", function(assert) {

		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Name"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmString();

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.ok(oControl.control.hasListeners("change"));
			assert.equal(oControl.control.getType() === InputType.Password, false);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning sap.m.Select", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sValue;

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "selection";
			}

			return null;
		};
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "selection";
				}
			};
		};
		oParent.fireChange = function(oParam) {
			sValue = oParam.value;
		};
		oParent.getWidth = function() {
			return "";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmString();
			assert.equal(oControl.control instanceof Select, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-select");

			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						return "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// triggers an exception, that is "swallowed"
			// check whether test runs through
			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						throw "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning a combo box", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sValue;

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "dropDownList";
			}

			return null;
		};
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};
		oParent.fireChange = function(oParam) {
			sValue = oParam.value;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.property = {
				"sap:value-list": "standard"
			};

			var oControl = oFactory._createEdmString();
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			oControl.control.fireSelectionChange({
				selectedItem: {
					getKey: function() {
						return "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// triggers an exception, that is "swallowed"
			// check whether test runs through
			oControl.control.fireSelectionChange({
				selectedItem: {
					getKey: function() {
						throw "test";
					}
				}
			});

			assert.equal(sValue, "test");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning a multi-line-text", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			return null;
		};
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.property.property = JSON.parse(JSON.stringify(oFactory._oMetaData.property.property));
			oFactory._oMetaData.property.property["com.sap.vocabularies.UI.v1.MultiLineText"] = true;
			var oControl = oFactory._createEdmString();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.TextArea"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-textArea");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay returning a combo box", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "dropDownList";
			}

			return null;
		};
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmDisplay();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxDisp");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay with fetchValueListReadOnly=false", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "dropDownList";
			}

			return null;
		};
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};
		oParent.getFetchValueListReadOnly = function() {
			return false;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmDisplay();

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay with fetchValueListReadOnly=false (fallback)", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "dropDownList";
			}

			return null;
		};
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};
		oParent.getFetchValueListReadOnly = function() {
			return false;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oMetaData.annotations.valuelist = "foo";

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDisplay();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxDisp");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1980216671
	QUnit.test("_createEdmDisplay it should invoke the .formatValue() method of the DateTime class to format the value", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "C_PrmtHbRpldSupplierInvoice",
			path: "NetDueDate"
		});

		// arrange
		this.stub(oFactory, "getFormatSettings").callsFake(function() {
			return {
				UTC: true,
				style: "medium"
			};
		});

		var oEdmProperty = {
			name: "NetDueDate",
			type: "Edm.DateTime",
			precision: "0",
			extensions: [{
					name: "display-format",
					value: "Date",
					namespace: "http://www.sap.com/Protocols/SAPData"
				},
				{
					name: "text",
					value: "InvcNetDueDteInDaysText",
					namespace: "http://www.sap.com/Protocols/SAPData"
				},
				{
					name: "label",
					value: "Net Due Date",
					namespace: "http://www.sap.com/Protocols/SAPData"
				}
			],
			"sap:display-format": "Date",
			"sap:text": "InvcNetDueDteInDaysText",
			"com.sap.vocabularies.Common.v1.Text": {
				"Path": "InvcNetDueDteInDaysText",
				"com.sap.vocabularies.UI.v1.TextArrangement": {
					"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
				}
			},
			"sap:label": "Net Due Date",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Net Due Date"
			},
			"com.sap.vocabularies.UI.v1.HiddenFilter": {
				"Bool": "true"
			}
		};

		var oProperty = {
			property: oEdmProperty,
			typePath: "DueCalculationBaseDate",
			valueListAnnotation: null,
			valueListEntitySet: null,
			valueListEntityType: null,
			valueListKeyProperty: null
		};

		oFactory.bind().finally(function() {

			oFactory._oMetaData.property = oProperty;

			// arrange
			var oControlInfo = oFactory._createEdmDisplay(),
				oControl = oControlInfo.control,
				fnTextArrangementFormatter = oControl.getBindingInfo("text").formatter,
				oDateTimeType = oControlInfo.type.type,
				oDate = new Date(2019, 3, 3),
				oDateTimeFormatValueFunctionSpy = this.spy(oDateTimeType, "formatValue");

			// act
			fnTextArrangementFormatter.call(oControl, oDate, "35 Days passed");

			// assert
			assert.strictEqual(oDateTimeFormatValueFunctionSpy.callCount, 1);
			assert.ok(oDateTimeFormatValueFunctionSpy.calledWithExactly(oDate, "string"));

			// cleanup
			oControl.destroy();
			oFactory.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("_checkComboBox returning an input despite text annotation", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "input";
			}

			return null;
		};

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "input";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmString();

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkComboBox returning a combo box for value list with fixed values", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			return null;
		};

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return null;
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.annotations.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkComboBox returning a combo box for text annotation for configuration", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "dropDownList";
			}

			return null;
		};

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});

	});

	QUnit.test("check the display behaviour", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sDisplayBehaviour = "idAndDescription",
			sValue;

		oParent.getBindingContext = function() {
			return {
				getProperty: function(s) {
					return "SOME_ID";
				}
			};
		};

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				},
				getDisplayBehaviour: function() {
					return sDisplayBehaviour;
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDisplay();

			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			var oTextBinding = oControl.control.getBindingInfo("text");
			assert.ok(oTextBinding);
			assert.ok(oTextBinding.formatter);

			sDisplayBehaviour = "idAndDescription";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID (DESCRIPTION)");

			sDisplayBehaviour = "descriptionAndId";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "DESCRIPTION (SOME_ID)");

			sDisplayBehaviour = "descriptionOnly";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "DESCRIPTION");

			sDisplayBehaviour = "idOnly";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID");

			sDisplayBehaviour = "idAndDescription";
			sValue = oTextBinding.formatter("SOME_ID");
			assert.equal(sValue, "SOME_ID");

			sValue = oTextBinding.formatter("");
			assert.equal(sValue, "");

			oParent.getBindingContext = function() {
				return {
					getProperty: function(s) {
						return undefined;
					}
				};
			};

			sDisplayBehaviour = "idAndDescription";
			sValue = oTextBinding.formatter("");
			assert.equal(sValue, "");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});

	});

	//Fix for ID: 1970217313
	QUnit.test("check if additional handler that fetches once the id and description on model context change and working properly", function(assert) {
        var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

        oParent.getTextInEditModeSource = function() {
            return TextInEditModeSource.ValueList;
		};

        oParent.isTextInEditModeSourceNotNone = function() {
            return true;
		};

        var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
            path: "Category"
		});

		oFactory._oMetaData.annotations.valuelist = "ValidValue";
		var oLoadValueListAnnotationPromiseStub = sinon.stub(oFactory._oHelper, "loadValueListAnnotation").returns(Promise.resolve(true));
		var oInitValueListStub = sinon.stub(oFactory, "_initValueList");
		var oTriggerCreationOfControlsStub = sinon.stub(oFactory, "triggerCreationOfControls");
		var oCheckRequiredMetadataStub = sinon.stub(oFactory.oTextArrangementDelegate, "checkRequiredMetadata").returns(false);
		var oFetchIDAndDescriptionCollectionStub = sinon.stub(oFactory.oTextArrangementDelegate, "fetchIDAndDescriptionCollectionIfRequired");

		assert.equal(oFetchIDAndDescriptionCollectionStub.callCount, 0, "No fetching happened yet.");

        oFactory.bind().finally(function() {
			assert.equal(oFetchIDAndDescriptionCollectionStub.callCount, 1, "After .bind the id and description should be fetched once.");

			var oControl = oFactory._createEdmString();
            assert.ok(oControl.control.hasListeners("modelContextChange"), "Should have once listener attached to modelContextChange");

			oControl.control.fireModelContextChange();
			assert.notOk(oControl.control.hasListeners("modelContextChange"), "After firing modelContextChange once the listener should be detached");
			assert.equal(oFetchIDAndDescriptionCollectionStub.callCount, 2, "Fetching data one more time after the modelContextChange event is fired.");

			//Cleanup
			oLoadValueListAnnotationPromiseStub.restore();
			oInitValueListStub.restore();
			oTriggerCreationOfControlsStub.restore();
			oCheckRequiredMetadataStub.restore();
			oFetchIDAndDescriptionCollectionStub.restore();

			oControl.control.destroy();
			oFactory.destroy();
            done();
        });
    });

	QUnit.test("check the display behaviour with TextArrangement annotation", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingContext = function() {
			return {
				getProperty: function(s) {
					return "SOME_ID";
				}
			};
		};

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				},
				getDisplayBehaviour: function() {
					return null;
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {

			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
			};

			var oControl = oFactory._createEdmDisplay();

			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			var oTextBinding = oControl.control.getBindingInfo("text");
			assert.ok(oTextBinding);
			assert.ok(oTextBinding.formatter);

			var sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "DESCRIPTION (SOME_ID)");

			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			};
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID (DESCRIPTION)");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("check the display behaviour with TextArrangement annotation and Control configuration", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingContext = function() {
			return {
				getProperty: function(s) {
					return "SOME_ID";
				}
			};
		};

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				},
				getDisplayBehaviour: function() {
					return "idAndDescription";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
			};

			var oControl = oFactory._createEdmDisplay();

			assert.equal(oControl.control instanceof Text, true);

			var oTextBinding = oControl.control.getBindingInfo("text");
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.ok(oTextBinding);
			assert.ok(oTextBinding.formatter);

			var sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID (DESCRIPTION)");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay shall return sap.m.ObjectIdentifier", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getProposedControl = function() {
			return "ObjectIdentifier";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDisplay();
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectIdentifier"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objIdentifier");
			assert.equal(oControl.control.hasListeners("titlePressed"), false);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay shall return sap.m.ObjectIdentifier with titlePress event handler", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal = function() {
			return {
				"getControlType": function() {
					return "ObjectIdentifier";
				}
			};
		};

		oParent.hasListeners = function(sEventId) {
			if (sEventId === "press") {
				return true;
			}
		};

		oParent.attachPress = function() {

		};

		oParent.firePress = function() {

		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDisplay();
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectIdentifier"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objIdentifier");
			assert.equal(oControl.control.hasListeners("titlePress"), true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMObjectStatus shall return sap.m.ObjectStatus", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal = function() {
			return {
				getObjectStatus: function() {
					return {
						getCriticality: function() {
							return null;
						},
						getCriticalityRepresentationType: function() {
							return library.smartfield.CriticalityRepresentationType.WithIcon;
						},
						getBindingInfo: function() {
							return null;
						}
					};
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.uom = {
				"path": "dummy"
			};

			var oControl = oFactory._createEdmUOMObjectStatus();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createObjectStatus shall return sap.m.ObjectStatus", function(assert) {
		var oFactory, oControl, oParent;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getControlProposal = function() {
			return {
				getObjectStatus: function() {
					return {
						getCriticality: function() {
							return null;
						},
						getCriticalityRepresentationType: function() {
							return library.smartfield.CriticalityRepresentationType.WithIcon;
						},
						getBindingInfo: function() {
							return null;
						}
					};
				}
			};
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		oFactory.bind();

		oControl = oFactory._createObjectStatus();
		assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
		assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_createObjectStatus shall return sap.m.ObjectStatus with criticality bound to formatter", function(assert) {
		var oFactory, oControl, oParent, oInfo;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getControlProposal = function() {
			return {
				getObjectStatus: function() {
					return {
						getCriticality: function() {
							return 2;
						},
						getCriticalityRepresentationType: function() {
							return "WithIcon";
						},
						getBindingInfo: function() {
							return {
								formatter: function() {
									return 2;
								},
								parts: [
									"dummy"
								]
							};
						}
					};
				}
			};
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		oFactory.bind();

		oControl = oFactory._createObjectStatus();
		assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
		assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

		oInfo = oControl.control.getBindingInfo("state");
		assert.equal(oInfo.formatter(), "Warning");

		oInfo = oControl.control.getBindingInfo("icon");
		assert.equal(oInfo.formatter(), "sap-icon://status-critical");

		oControl.control.destroy();
		oFactory.destroy();
	});

	// BCP: 1770110922
	QUnit.test("the formatter of the icon should return the URI to the corresponding icon when the criticality value is 0", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = fCreateSmartFieldStub(this.oModel);

		// arrange
		oSmartField.getControlProposal = function() {
			return {
				getObjectStatus: function() {
					return {
						getCriticality: function() {
							return 0;
						},
						getCriticalityRepresentationType: function() {
							return "WithIcon";
						},
						getBindingInfo: function() {
							return {
								parts: [
									"dummy"
								]
							};
						}
					};
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {

			// act
			var oControl = oFactory._createObjectStatus();

			// assert
			var oIconBindingInfo = oControl.control.getBindingInfo("icon");
			assert.equal(oIconBindingInfo.formatter(0), "sap-icon://status-inactive");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createObjectStatus shall return sap.m.ObjectStatus with criticality bound to path", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal = function() {
			return {
				getObjectStatus: function() {
					return {
						getCriticality: function() {
							return 2;
						},
						getCriticalityRepresentationType: function() {
							return "WithIcon";
						},
						getBindingInfo: function() {
							return {
								parts: [
									"dummy"
								]
							};
						}
					};
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createObjectStatus();
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

			var oInfo = oControl.control.getBindingInfo("state");
			assert.equal(oInfo.formatter(2), "Warning");

			oInfo = oControl.control.getBindingInfo("icon");
			assert.equal(oInfo.formatter(2), "sap-icon://status-critical");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createObjectStatus shall return sap.m.ObjectStatus (2)", function(assert) {
		var oFactory, oControl, oParent;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getControlProposal = function() {
			return {
				getObjectStatus: function() {
					return {
						getCriticality: function() {
							return null;
						},
						getCriticalityRepresentationType: function() {
							return library.smartfield.CriticalityRepresentationType.WithIcon;
						},
						getBindingInfo: function() {
							return null;
						}
					};
				}
			};
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory.bind();

		oControl = oFactory._createObjectStatus();
		assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
		assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("ODataControlSelector._isObjectStatusProposed shall return true", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal = function() {
			return {
				getObjectStatus: function() {
					return {
						getCriticality: function() {
							return null;
						},
						getBindingInfo: function() {
							return null;
						}
					};
				},
				getControlType: function() {
					return null;
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind().finally(function() {
			assert.ok(oFactory._oSelector._isObjectStatusProposed());

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkComboBox returning a combo box for config", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "dropDownList";
			}

			return null;
		};
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oHelper.getTextProperty = function() {
				return null;
			};
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmString();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");
			assert.equal(oControl.params.getValue, "getSelectedKey");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkCheckBox", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "checkBox";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			assert.equal(oFactory._oSelector.checkCheckBox(), false);

			oFactory._oMetaData.property.property.maxLength = "1";
			assert.equal(oFactory._oSelector.checkCheckBox(), true);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString - CheckBox", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "checkBox";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.property.property.maxLength = "1";
			var oControl = oFactory._createEdmString();
			assert.ok(oControl.control instanceof CheckBox);
			assert.equal(oControl.control.getId(), oParent.getId() + "-cBox");
			oControl.control.setSelected(true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - CheckBox", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "checkBox";
				},
				getDisplayBehaviour: function() {
					return null;
				}
			};
		};
		oParent.data = function() {
			return null;
		};
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.property.property.maxLength = "1";
			var oControl = oFactory._createEdmDisplay();
			assert.ok(oControl.control instanceof Text);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			var oInfo = oControl.control.getBindingInfo("text");
			var sResult = oInfo.formatter("test");
			assert.ok(sResult);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - link", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "";
				}
			};
		};
		oParent.getBindingInfo = function() {
			return null;
		};

		oParent.getUrl = function() {
			return "www.sap.com";
		};

		oParent.getValue = function() {
			return "VALUE";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDisplay();
			assert.equal(oControl.control instanceof Link, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-link");
			assert.equal(oControl.control.getHref(), "www.sap.com");
			assert.equal(oControl.control.getText(), "VALUE");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - link with binding", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "";
				}
			};
		};
		oParent.getBindingInfo = function(sParam) {
			if (sParam === "url") {
				return {
					"path": "dummy"
				};
			}

			if (sParam === "value") {
				return {
					"path": "dummy"
				};
			}

			return null;
		};
		oParent.getUrl = function() {
			return "www.sap.com";
		};
		oParent.getValue = function() {
			return "VALUE";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDisplay();
			assert.equal(oControl.control instanceof Link, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-link");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit
		.test(
				"_createEdmDisplay - link with text annotation",
				function(assert) {
					var oFactory, oParent, oControl, oMeta =
																"{\"annotations\":{\"text\":{\"property\":{\"name\":\"SupplierName\",\"type\":\"Edm.String\",\"maxLength\":\"80\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name of Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name of Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Name of Supplier\"}},\"typePath\":\"SupplierName\"},\"uom\":null,\"lineitem\":{\"annotation\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"SupplierName\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Decimal\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ReleaseCode_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}],\"fields\":[\"PurchaseContract\",\"SupplierName\",\"PurchaseContractTargetAmount\",\"ReleaseCode_Text\"],\"labels\":{},\"importance\":{\"PurchaseContract\":\"High\",\"SupplierName\":\"High\",\"PurchaseContractTargetAmount\":\"High\",\"ReleaseCode_Text\":\"High\"}}},\"path\":\"Supplier\",\"namespace\":\"C_CONTRACT_FS_SRV\",\"entitySet\":{\"name\":\"C_ContractFs\",\"entityType\":\"C_CONTRACT_FS_SRV.C_ContractFsType\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:creatable\":\"false\",\"Org.OData.Capabilities.V1.InsertRestrictions\":{\"Insertable\":{\"Bool\":\"false\"}},\"sap:updatable\":\"false\",\"Org.OData.Capabilities.V1.UpdateRestrictions\":{\"Updatable\":{\"Bool\":\"false\"}},\"sap:deletable\":\"false\",\"Org.OData.Capabilities.V1.DeleteRestrictions\":{\"Deletable\":{\"Bool\":\"false\"}},\"sap:content-version\":\"1\",\"Org.OData.Capabilities.V1.SearchRestrictions\":{\"Searchable\":{\"Bool\":\"false\"}}},\"entityType\":{\"name\":\"C_ContractFsType\",\"key\":{\"propertyRef\":[{\"name\":\"PurchaseContract\"}]},\"property\":[{\"name\":\"AddressID\",\"type\":\"Edm.String\",\"maxLength\":\"200\",\"extensions\":[{\"name\":\"label\",\"value\":\"Address\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Address\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Address\"}},{\"name\":\"CashDiscount1Days\",\"type\":\"Edm.Decimal\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Days 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Days 1\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Days 1\"}},{\"name\":\"CashDiscount1Percent\",\"type\":\"Edm.Decimal\",\"precision\":\"5\",\"scale\":\"3\",\"extensions\":[{\"name\":\"label\",\"value\":\"Disc.percent 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Disc.percent 1\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Disc.percent 1\"}},{\"name\":\"CashDiscount2Days\",\"type\":\"Edm.Decimal\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Days 2\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Days 2\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Days 2\"}},{\"name\":\"CashDiscount2Percent\",\"type\":\"Edm.Decimal\",\"precision\":\"5\",\"scale\":\"3\",\"extensions\":[{\"name\":\"label\",\"value\":\"Disc.percent 2\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Disc.percent 2\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Disc.percent 2\"}},{\"name\":\"CityName\",\"type\":\"Edm.String\",\"maxLength\":\"40\",\"extensions\":[{\"name\":\"label\",\"value\":\"City\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"City\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"City\"}},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Company Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Company Code\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Company Code\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"CompanyCodeName\"}},{\"name\":\"CompanyCodeName\",\"type\":\"Edm.String\",\"maxLength\":\"25\",\"extensions\":[{\"name\":\"label\",\"value\":\"Company Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Company Name\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Company Name\"}},{\"name\":\"CreatedByUser\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"label\",\"value\":\"Created by\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Created by\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Created by\"}},{\"name\":\"CreationDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Document Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Document Date\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Document Date\"}},{\"name\":\"DocumentCurrency\",\"type\":\"Edm.String\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Currency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Currency\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Currency\"},\"sap:semantics\":\"currency-code\"},{\"name\":\"EmailAddress\",\"type\":\"Edm.String\",\"maxLength\":\"241\",\"extensions\":[{\"name\":\"label\",\"value\":\"E-Mail Address\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"E-Mail Address\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"E-Mail Address\"}},{\"name\":\"FaxNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Fax\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Fax\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Fax\"}},{\"name\":\"HouseNumber\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"House Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"House Number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"House Number\"}},{\"name\":\"IncotermsClassification\",\"type\":\"Edm.String\",\"maxLength\":\"3\",\"extensions\":[{\"name\":\"text\",\"value\":\"IncotermsClassification_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Incoterms\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"IncotermsClassification_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"IncotermsClassification_Text\"},\"sap:label\":\"Incoterms\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Incoterms\"}},{\"name\":\"IncotermsTransferLocation\",\"type\":\"Edm.String\",\"maxLength\":\"28\",\"extensions\":[{\"name\":\"label\",\"value\":\"Incoterms (Part 2)\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Incoterms (Part 2)\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Incoterms (Part 2)\"}},{\"name\":\"InternationalFaxNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Fax number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Fax number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Fax number\"}},{\"name\":\"InternationalMobilePhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone number\"}},{\"name\":\"InternationalPhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone number\"}},{\"name\":\"InvoicingParty\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Invoicing Party\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Invoicing Party\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Invoicing Party\"}},{\"name\":\"MobilePhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone\"}},{\"name\":\"NetPaymentDays\",\"type\":\"Edm.Decimal\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Days net\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Days net\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Days net\"}},{\"name\":\"PaymentTerms\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Payment terms\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Payment terms\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Payment terms\"}},{\"name\":\"PhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone\"}},{\"name\":\"PostalCode\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Postal Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Postal Code\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Postal Code\"}},{\"name\":\"PurchaseContract\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Pur. Contract\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Pur. Contract\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Pur. Contract\"},\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Immutable\":{\"Bool\":\"true\"}},{\"name\":\"PurchaseContractTargetAmount\",\"type\":\"Edm.Decimal\",\"precision\":\"15\",\"scale\":\"4\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DocumentCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Target Value\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:unit\":\"DocumentCurrency\",\"sap:label\":\"Target Value\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Target Value\"},\"Org.OData.Measures.V1.ISOCurrency\":{\"Path\":\"DocumentCurrency\"}},{\"name\":\"PurchaseContractType\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"text\",\"value\":\"PurchaseContractType_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Purchasing Doc. Type\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"PurchaseContractType_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchaseContractType_Text\"},\"sap:label\":\"Purchasing Doc. Type\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Doc. Type\"}},{\"name\":\"PurchasingDocumentCategory\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"text\",\"value\":\"PurchasingDocumentCategory_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Purch. Doc. Category\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"PurchasingDocumentCategory_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchasingDocumentCategory_Text\"},\"sap:label\":\"Purch. Doc. Category\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purch. Doc. Category\"}},{\"name\":\"PurchasingGroup\",\"type\":\"Edm.String\",\"maxLength\":\"3\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Group\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purchasing Group\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Group\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchasingGroupName\"}},{\"name\":\"PurchasingGroupName\",\"type\":\"Edm.String\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Grp Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purchasing Grp Name\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Grp Name\"}},{\"name\":\"PurchasingOrganization\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purch. organization\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purch. organization\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purch. organization\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchasingOrganizationName\"}},{\"name\":\"PurchasingOrganizationName\",\"type\":\"Edm.String\",\"maxLength\":\"20\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Org Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purchasing Org Name\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Org Name\"}},{\"name\":\"ReleaseCode\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"text\",\"value\":\"ReleaseCode_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Release indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"ReleaseCode_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"ReleaseCode_Text\"},\"sap:label\":\"Release indicator\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Release indicator\"}},{\"name\":\"StreetName\",\"type\":\"Edm.String\",\"maxLength\":\"60\",\"extensions\":[{\"name\":\"label\",\"value\":\"Street\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Street\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Street\"}},{\"name\":\"Supplier\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Supplier\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"SupplierName\"}},{\"name\":\"SupplierAddressID\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Address Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Address Number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Address Number\"}},{\"name\":\"SupplierName\",\"type\":\"Edm.String\",\"maxLength\":\"80\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name of Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name of Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Name of Supplier\"}},{\"name\":\"SupplyingSupplier\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Supplying Vendor\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Supplying Vendor\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Supplying Vendor\"}},{\"name\":\"IncotermsClassification_Text\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Description\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Description\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Description\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"PurchaseContractType_Text\",\"type\":\"Edm.String\",\"maxLength\":\"20\",\"extensions\":[{\"name\":\"label\",\"value\":\"Doc. Type Descript.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Doc. Type Descript.\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Doc. Type Descript.\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"PurchasingDocumentCategory_Text\",\"type\":\"Edm.String\",\"maxLength\":\"60\",\"extensions\":[{\"name\":\"label\",\"value\":\"Short Descript.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Short Descript.\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Short Descript.\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"ReleaseCode_Text\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Description\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Description\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Description\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"ValidityEndDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Validity End\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:display-format\":\"Date\",\"sap:label\":\"Validity End\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Validity End\"}},{\"name\":\"ValidityStartDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Validity Start\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:display-format\":\"Date\",\"sap:label\":\"Validity Start\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Validity Start\"}}],\"navigationProperty\":[{\"name\":\"to_ContactCard\",\"relationship\":\"C_CONTRACT_FS_SRV.assoc_8D0A07136813B893B73350D0535B26CD\",\"fromRole\":\"FromRole_assoc_8D0A07136813B893B73350D0535B26CD\",\"toRole\":\"ToRole_assoc_8D0A07136813B893B73350D0535B26CD\",\"extensions\":[{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:filterable\":\"false\"},{\"name\":\"to_PurchaseContractItem\",\"relationship\":\"C_CONTRACT_FS_SRV.assoc_5841FCA008A2F3C01A7552525EFD253A\",\"fromRole\":\"FromRole_assoc_5841FCA008A2F3C01A7552525EFD253A\",\"toRole\":\"ToRole_assoc_5841FCA008A2F3C01A7552525EFD253A\",\"extensions\":[{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:filterable\":\"false\"}],\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Contract consumption view for Factsheet\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"namespace\":\"C_CONTRACT_FS_SRV\",\"entityType\":\"C_CONTRACT_FS_SRV.C_ContractFsType\",\"sap:label\":\"Purchasing Contract consumption view for Factsheet\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Contract consumption view for Factsheet\"},\"sap:content-version\":\"1\",\"$path\":\"/dataServices/schema/0/entityType/0\",\"com.sap.vocabularies.UI.v1.DataPoint#DataPoint01\":{\"Title\":{\"String\":\"Target Value\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\",\"EdmType\":\"Edm.Decimal\"}},\"com.sap.vocabularies.UI.v1.DataPoint#DataPoint02\":{\"Title\":{\"String\":\"Status\"},\"Value\":{\"Path\":\"ReleaseCode_Text\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.DataPoint#DataPoint03\":{\"Title\":{\"String\":\"Supplier\"},\"Value\":{\"Path\":\"SupplierName\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.HeaderInfo\":{\"TypeName\":{\"String\":\"Purchase Contract\"},\"TypeNamePlural\":{\"String\":\"Purchase Contract\"},\"TypeImageUrl\":{\"String\":\"/sap/bc/ui5_ui5/sap/ssuite_objexps1/typeimages/contract.jpg\"},\"Title\":{\"Value\":{\"Path\":\"PurchaseContractType_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},\"Description\":{\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.Badge\":{\"HeadLine\":{\"Value\":{\"String\":\"Purchase Contract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\"},\"TypeImageUrl\":{\"String\":\"/sap/bc/ui5_ui5/sap/ssuite_objexps1/typeimages/contract.jpg\"},\"Title\":{\"Value\":{\"Path\":\"PurchaseContractType_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},\"MainInfo\":{\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.Identification\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Decimal\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchasingOrganization\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchasingGroup\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"CompanyCode\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ValidityStartDate\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Date\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ValidityEndDate\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Date\"}],\"com.sap.vocabularies.UI.v1.FieldGroup#Detail2\":{\"Label\":{\"String\":\"Delivery and Payment\"},\"Data\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"IncotermsClassification\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"IncotermsTransferLocation\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PaymentTerms\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}]},\"com.sap.vocabularies.UI.v1.FieldGroup#Detail3\":{\"Label\":{\"String\":\"Supplier\"},\"Data\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Url\":{\"Apply\":{\"Name\":\"odata.fillUriTemplate\",\"Parameters\":[{\"Type\":\"String\",\"Value\":\"#Supplier-displayFactSheet?Supplier={ID1}\"},{\"Type\":\"LabeledElement\",\"Value\":{\"Path\":\"Supplier\"},\"Name\":\"ID1\"}]}},\"Value\":{\"Path\":\"Supplier\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataFieldWithUrl\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"AddressID\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"com.sap.vocabularies.Communication.v1.IsEmailAddress\":{},\"Value\":{\"Path\":\"EmailAddress\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"com.sap.vocabularies.Communication.v1.IsPhoneNumber\":{},\"Value\":{\"Path\":\"InternationalPhoneNumber\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"com.sap.vocabularies.Communication.v1.IsPhoneNumber\":{},\"Value\":{\"Path\":\"InternationalMobilePhoneNumber\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}]},\"com.sap.vocabularies.UI.v1.LineItem\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"SupplierName\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Decimal\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ReleaseCode_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}],\"com.sap.vocabularies.UI.v1.Facets\":[{\"com.sap.vocabularies.UI.v1.IsSummary\":{},\"Label\":{\"String\":\"General Information\"},\"Facets\":[{\"Label\":{\"String\":\"Basic Data\"},\"Target\":{\"AnnotationPath\":\"@com.sap.vocabularies.UI.v1.Identification\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"},{\"Label\":{\"String\":\"Delivery and Payment\"},\"Target\":{\"AnnotationPath\":\"@com.sap.vocabularies.UI.v1.FieldGroup#Detail2\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"},{\"Label\":{\"String\":\"Supplier\"},\"Target\":{\"AnnotationPath\":\"@com.sap.vocabularies.UI.v1.FieldGroup#Detail3\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"}],\"RecordType\":\"com.sap.vocabularies.UI.v1.CollectionFacet\"},{\"Label\":{\"String\":\"Items\"},\"Target\":{\"AnnotationPath\":\"to_PurchaseContractItem/@com.sap.vocabularies.UI.v1.LineItem\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"}]},\"property\":{\"property\":{\"name\":\"Supplier\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Supplier\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"SupplierName\"}},\"typePath\":\"Supplier\"}}";

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "";
				}
			};
		};
		oParent.getBindingInfo = function(sParam) {
			if (sParam === "url") {
				return {
					"path": "dummy"
				};
			}

			if (sParam === "value") {
				return {
					"path": "dummy"
				};
			}

			return null;
		};
		oParent.getUrl = function() {
			return "www.sap.com";
		};
		/*
		 oParent.getValue = function() {
		 return "VALUE";
		 };
		 */
		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});
		//oFactory.bind();
		oFactory._oMetaData = JSON.parse(oMeta);
		oFactory._oMetaData.annotations.text.path = oFactory._oMetaData.annotations.text.typePath;

		oControl = oFactory._createEdmDisplay();
		assert.equal(oControl.control instanceof Link, true);
		assert.equal(oControl.control.getId(), oParent.getId() + "-link");

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_createEdmTime", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function() {
			return {
				parts: [
					{
						model: "json",
						path: "Services/results"
					}
				]
			};
		};

		oParent.data = function() {
			return {
				style: "short"
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartTime"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.TimePicker"));
			assert.strictEqual(oControl.control.getId(), oParent.getId() + "-timePicker");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1780442947
	QUnit.test("_createEdmTime it should set the default width of the TimePicker control to 100%", function(assert) {

		// arrange
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartTime"
		});

		oFactory.bind().finally(function() {
			var oGetWidthStub = sinon.stub(oParent, "getWidth").returns("");
			var oControl = oFactory._createEdmTime();

			// assert
			assert.strictEqual(oControl.control.getWidth(), "100%");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			oGetWidthStub.restore();
			done();
		});
	});

	QUnit.test("_createEdmDateTime with display-format = date", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function() {
			return {
				parts: [
					{
						model: "json",
						path: "Services/results"
					}
				]
			};
		};
		oParent.data = function() {
			return {
				style: "short"
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDate"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDateTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DatePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-datePicker");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTime with semantics = yearmonthday", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function() {
			return {
				parts: [
					{
						model: "json",
						path: "Services/results"
					}
				]
			};
		};
		oParent.data = function() {
			return {
				style: "short"
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateStr"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDateTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DatePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-datePicker");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTime without display-format", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "auto";
				}
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateWithout"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDateTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DateTimePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTimeOffset", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function() {
			return {
				UTC: true,
				style: "medium"
			};
		};

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [{
						model: undefined,
						path: "StartDateTime"
					}]
				};
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDateTimeOffset();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DateTimePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// BCP: 1770430441
			assert.strictEqual(oControl.params.type.type.oFormatOptions.UTC, false, "it should parse and format the date as local time zone");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmNumeric", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmNumeric();

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");
			assert.equal(oControl.onCreate, "_onCreate");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1870168882
	QUnit.test("_createEdmNumeric it should create a combo box control", function(assert) {

		// system under test
		var done = assert.async(),
			oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {

			// arrange
			var oMetadata = oFactory.getMetaData();
			oMetadata.annotations.valuelist = "foo";
			oMetadata.annotations.valuelistType = "fixed-values";

			// act
			var oControl = oFactory._createEdmNumeric();

			// assert
			assert.strictEqual(oControl.control.getMetadata().getName(), "sap.m.ComboBox");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmBoolean disabled", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "Released"
						}
					]
				};
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Released"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmBoolean();
			assert.ok(oControl.control instanceof Text);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.equal(oControl.onCreate, "_onCreate");

			var oInfo = oControl.control.getBindingInfo("text");
			var sResult = oInfo.formatter("test");
			assert.ok(sResult);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmBoolean enabled", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "Released"
						}
					]
				};
			}
		};

		oParent.getEditable = function() {
			return true;
		};

		oParent.getEnabled = function() {
			return true;
		};

		oParent.getContextEditable = function() {
			return true;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Released"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmBoolean();

			// assert
			assert.ok(oControl.control instanceof CheckBox);
			assert.equal(oControl.control.getId(), oParent.getId() + "-cBoxBool");
			assert.equal(oControl.onCreate, "_onCreate");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmBoolean returning a combo box", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data = function(sName) {
			if (sName === "hasValueHelpDialog") {
				return "false";
			}

			if (sName === "controlType") {
				return "dropDownList";
			}

			return null;
		};

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "dropDownList";
				}
			};
		};

		oParent.getWidth = function() {
			return "";
		};

		oParent.getBindingInfo = function() {
			return null;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.property = {
				"property": {
					"name": "Amount",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "11",
					"scale": "2",
					"sap:value-list": "fixed-values",
					"documentation": [
						{
							"text": null,
							"extensions": [
								{
									"name": "Summary",
									"value": "Preis fÃ¼r externe Verarbeitung.",
									"attributes": [],
									"children": [],
									"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
								}, {
									"name": "LongDescription",
									"value": null,
									"attributes": [],
									"children": [],
									"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
								}
							]
						}
					],
					"extensions": [
						{
							"name": "unit",
							"value": "AmountCurrency",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}, {
							"name": "label",
							"value": "Preis",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}, {
							"name": "sortable",
							"value": "false",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}, {
							"name": "filterable",
							"value": "false",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}
					]
				},
				"typePath": "Amount",
				"extensions": {
					"sap:filterable": {
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					"sap:sortable": {
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					"sap:label": {
						"name": "label",
						"value": "Preis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					"sap:text": {
						"name": "text",
						"value": "AmountCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}
				}
			};

			oFactory._oHelper.getTextAnnotationoFactory = function() {
				return {};
			};
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmBoolean();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxDisp");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1880033659
	QUnit.test("_createEdmBoolean should not instantiate a combo box control instance in display mode to fetch" +
			"the value list collection when the fetchValueListReadOnly property is set to false", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		// arrange
		oSmartFieldStub.getFetchValueListReadOnly = function() {
			return false;
		};
		oSmartFieldStub.getEditable = function() {
			return false;
		};
		oSmartFieldStub.getContextEditable = function() {
			return false;
		};

		var oFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oMetadata = oFactory.getMetaData();
			oMetadata.annotations.valuelist = "foo";
			oMetadata.annotations.valuelistType = "fixed-values";

			// act
			var oControl = oFactory._createEdmBoolean();

			// assert
			assert.strictEqual(oControl.control.getMetadata().getName(), "sap.m.Text");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOM", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			len = 2,
			bChange = false,
			bExc = false,
			bUnit;

		oParent.getMode = function() {
			return "edit";
		};

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};

		oParent.getObjectBinding = function() {
			return {
				sPath: "binding"
			};
		};

		oParent.fireChange = function() {
			bChange = true;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmUOM();
			var oMeasureField = oControl.control.getItems()[0];
			var oText = oControl.control.getItems()[1];
			assert.equal( includes(oMeasureField.getAriaLabelledBy(), oText.getId()), false, "The measure field " +
				"shuld not be labelled by the currency field");
			assert.equal(oText.getId(), oParent.getId() + "-sfEdit");
			assert.equal(oControl.control instanceof HBox, true);
			assert.equal(oControl.onCreate, "_onCreateUOM");

			var oConfig = oText.data("configdata");
			oConfig.configdata.onText(oControl.control);
			oConfig.configdata.onInput(oControl.control);

			var mParams = {
				getValue: "getValue",
				valuehelp: true
			};
			oFactory._onCreateUOM(oControl.control, mParams);

			while (len--) {
				oControl.control.getItems()[len].fireChange();
			}

			var oItem = oControl.control.getItems()[1];
			assert.equal(oItem.getId(), oParent.getId() + "-sfEdit");
			oItem.setValue("");

			assert.equal(bChange, true);
			assert.equal(mParams.getValue(), "");
			assert.equal(mParams.uom(), "");

			mParams.uomset("uom");
			assert.equal(mParams.uom(), "uom");

			//check exception handling
			oParent.fireChange = function(oParam) {
				bUnit = oParam.unitChanged;
				bExc = true;
				throw "exc";
			};
			try {
				oControl.control.getItems()[0].fireChange();
				oControl.control.getItems()[1].fireChange();
			} catch (ex) {
				//should not happen
				bExc = false;
			}

			assert.equal(bUnit, true);
			assert.equal(bExc, true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOM - unit suppressed", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.data = function() {
			return "true";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmUOM();

			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");
			assert.equal(oControl.onCreate, "_onCreate");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("it should propagate the value of the wrapping property to the to the currency field", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			wrapping: true
		});
		var oText = new Text({
			wrapping: true
		});

		// arrange
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oHBox = oFactory._createEdmUOM().control;
			var oSmartFieldCurrencyField = oHBox.getItems()[1];
			oSmartFieldCurrencyField.setContent(oText);
			oSmartField.setContent(oHBox);

			// act
			oSmartField.setWrapping(false);

			// assert
			assert.strictEqual(oText.getWrapping(), false);

			// cleanup
			oText.destroy();
			oHBox.destroy();
			oFactory.destroy();
			oSmartField.destroy();
			done();
		});
	});

	// BCP: 1870164318
	QUnit.test("calling the .getInnerControls() method should not raise an exception in RTL mode", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField();

		// arrange
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oGetRTLStub = sinon.stub(sap.ui.getCore().getConfiguration(), "getRTL").returns(true);
			var oHBox = oFactory._createEdmUOM().control;
			var oSmartFieldCurrencyField = oHBox.getItems()[1];
			var oText = new Text();
			oSmartFieldCurrencyField.setContent(oText);
			oSmartField.setContent(oHBox);

			// act
			var aInnerControls = oSmartField.getInnerControls();

			// assert
			assert.strictEqual(aInnerControls[0].getMetadata().getName(), "sap.m.Input");
			assert.strictEqual(aInnerControls[1].getMetadata().getName(), "sap.m.Text");

			// cleanup
			oText.destroy();
			oHBox.destroy();
			oFactory.destroy();
			oSmartField.destroy();
			oGetRTLStub.restore();
			done();
		});
	});

	QUnit.test("_createEdmUOM - unit suppressed, no currency", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.data = function() {
			return "true";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			delete oFactory._oMetaData.annotations.uom.property.property["sap:semantics"];
			delete oFactory._oMetaData.property.property["Org.OData.Measures.V1.ISOCurrency"];

			// act
			var oControl = oFactory._createEdmUOM();

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");
			assert.equal(oControl.onCreate, "_onCreate");
			assert.ok(oControl.params.type);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMAttributes for amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.uom.property.property["sap:semantics"] = "currency-code";

			var oSettings = {
				currency: true,
				edmProperty: oFactory._oMetaData.annotations.uom.property.property
			};

			var mParams = oFactory._createEdmUOMAttributes(oSettings);

			// assert
			assert.equal(mParams.value.parts.length, 2);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMAttributes for non-amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		oFactory.bind().finally(function() {

			var oSettings = {
				currency: false,
				edmProperty: {}
			};

			var mParams = oFactory._createEdmUOMAttributes(oSettings);

			// assert
			assert.equal(mParams.value.path, "StartDateTime");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOM for non-amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oConfig,
			len = 2,
			bChange = false,
			bExc = false,
			bUnit;

		oParent.getMode = function() {
			return "edit";
		};
		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.fireChange = function() {
			bChange = true;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			delete oFactory._oMetaData.annotations.uom.property.property["sap:semantics"];
			delete oFactory._oMetaData.property.property["Org.OData.Measures.V1.ISOCurrency"];

			// act
			var oControl = oFactory._createEdmUOM();
			var oText = oControl.control.getItems()[1];
			assert.equal(oControl.control instanceof HBox, true);
			assert.equal(oText.getId(), oParent.getId() + "-sfEdit");
			assert.equal(oControl.onCreate, "_onCreateUOM");

			oConfig = oText.data("configdata");
			oConfig.configdata.onText();
			oConfig.configdata.onInput();

			var mParams = {
				getValue: "getValue",
				valuehelp: true,
				type: oControl.params.type
			};
			oFactory._onCreateUOM(oControl.control, mParams);
			assert.ok(mParams.type.type.oFieldControl);

			while (len--) {
				oControl.control.getItems()[len].fireChange();
			}

			var oItem = oControl.control.getItems()[1];
			oItem.setValue("");

			assert.equal(bChange, true);
			assert.equal(mParams.getValue(), "");
			assert.equal(mParams.uom(), "");

			mParams.uomset("uom");
			assert.equal(mParams.uom(), "uom");

			//check exception handling
			oParent.fireChange = function(oParam) {
				bUnit = oParam.unitChanged;
				bExc = true;
				throw "exc";
			};

			try {
				oControl.control.getItems()[0].fireChange();
				oControl.control.getItems()[1].fireChange();
			} catch (ex) {
				//should not happen
				bExc = false;
			}

			assert.equal(bUnit, true);
			assert.equal(bExc, true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMDisplay", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.getUomVisible = function() {
			return true;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmUOMDisplay();
			assert.equal(oControl.control instanceof HBox, true);
			assert.equal(!oControl.onCreate, true);

			var oSmartField = oControl.control.getItems()[1];
			assert.equal(oSmartField.getId(), oParent.getId() + "-sfDisp");
			var oConfig = oSmartField.data("configdata");
			var oInner = {
				addStyleClass: function() {
				}
			};
			oConfig.configdata.onText(oInner);
			oConfig.configdata.onInput(oInner);
			assert.ok(!oConfig.configdata.getContextEditable());

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMDisplay - unit suppressed", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.data = function() {
			return "true";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmUOMDisplay();

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkSuppressUnit - unit suppressed by uomVisible", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}

			return null;
		};
		oParent.data = function() {
			return null;
		};
		oParent.getUomVisible = function() {
			return false;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmUOMDisplay();

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_setUOMEditState for amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			bEditState = false;

		oParent.getConfiguration = function() {
			return {
				getControlType: function() {
					return "objectIdentifier";
				}
			};
		};
		oParent.bindProperty = function(sName) {
			if (sName === "uomEditState") {
				bEditState = true;
			}
		};
		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.getProposedControl = function() {
			return "ObjectNumber";
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.uom.property["sap:semantics"] = "currency-code";
			oFactory._setUOMEditState();

			// assert
			assert.ok(bEditState);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMObjectNumber for amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.uom.property["sap:semantics"] = "currency-code";
			var oControl = oFactory._createEdmUOMObjectNumber();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectNumber"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objNumber");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMObjectNumber for non-amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmUOMObjectNumber();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectNumber"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objNumber");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmSemantic", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode = function() {
			return "edit";
		};
		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.getEditable = function() {
			return true;
		};
		oParent.getEnabled = function() {
			return true;
		};
		oParent.getContextEditable = function() {
			return true;
		};
		oParent.getAriaLabelledBy = function() {
			return [];
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind().finally(function() {
			oFactory._oMetaData.annotations.semantic = oFactory._oMetaData.annotations.uom;
			oFactory._oMetaData.annotations.uom = null;
			oFactory._oMetaData.annotations.lineitem = {
				labels: {
					"StartDateTime": "StartDateTime"
				}
			};

			var oControl = oFactory._createEdmSemantic();
			assert.equal(oControl.control instanceof SmartLink, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-sl");

			assert.equal(oControl.onCreate, "_onCreate");

			assert.equal(oControl.params.getValue, "getInnerControlValue");

			var fCallBack = oControl.control.getCreateControlCallback();
			oControl.control.destroy();

			oControl = fCallBack();
			assert.equal(oControl instanceof Input, true);
			assert.equal(oControl.getId(), oParent.getId() + "-input");
			oControl.destroy();

			oFactory.createControl = function() {
				return null;
			};
			oControl = fCallBack();
			assert.equal(!oControl, true);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay", function(assert) {
		var oFactory, oControl, oParent, bText = false;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.data = function() {
			return {
				configdata: {
					onText: function() {
						bText = true;
					}
				}
			};
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory.bind();
		oControl = oFactory._createEdmDisplay();
		assert.equal(oControl.control instanceof Text, true);
		assert.equal(oControl.control.getId(), oParent.getId() + "-text");
		assert.equal(bText, true);

		var oBindingInfo = oControl.control.getBindingInfo("text");
		assert.ok(oBindingInfo);
		assert.ok(oBindingInfo.formatter);

		assert.equal("***", oBindingInfo.formatter("XYZ"));
		assert.equal("", oBindingInfo.formatter(""));

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_getEdmDisplayPath", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {
			var sPath = oFactory._oHelper.getEdmDisplayPath(oFactory._oMetaData);
			assert.equal(sPath, "Description");
			oFactory._oMetaData.annotations.text = {
				property: {
					name: "TextforDescription"
				},
				path: "TextforDescription"
			};
			sPath = oFactory._oHelper.getEdmDisplayPath(oFactory._oMetaData);
			assert.equal(sPath, "TextforDescription");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_getEdmUOMTextAlignment", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind().finally(function() {

			oParent.getTextAlign = function() {
				return "dummyTextAlign";
			};

			assert.equal(oFactory._getEdmUOMTextAlignment(), "dummyTextAlign");

			oParent.getTextAlign = function() {
				return "Initial";
			};

			assert.equal(oFactory._getEdmUOMTextAlignment(), "Begin");

			oParent.getEditable = function() {
				return true;
			};

			oParent.getContextEditable = function() {
				return true;
			};

			assert.equal(oFactory._getEdmUOMTextAlignment(), "Begin");

			oParent.isContextTable = function() {
				return true;
			};

			assert.equal(oFactory._getEdmUOMTextAlignment(), "End");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - date picker", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo = function(s) {
			if (s === "url") {
				return null;
			}

			return {
				parts: [
					{
						model: "json",
						path: "Services/results"
					}
				]
			};
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDate"
		});

		oFactory.bind().finally(function() {
			var oControl = oFactory._createEdmDisplay();

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("it should not try to load the ValueList annotation if the annotation is not specified " +
	           "in the service metadata", function(assert) {
		// Note: in this test setup, by default the ValueList annotation is not specified in the metadata

		var done = assert.async();

		// system under test
		var oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		// arrange
		this.stub(oSmartFieldStub, "getTextInEditModeSource").returns(library.smartfield.TextInEditModeSource.NavigationProperty);
		this.stub(oSmartFieldStub, "isTextInEditModeSourceNotNone").returns(true);
		var oODataControlFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});
		var oLoadValueListAnnotationSpy = this.spy(oODataControlFactory._oHelper, "loadValueListAnnotation");
		var oInitSpy = this.spy(oODataControlFactory, "_init");

		// act
		oODataControlFactory.bind().finally(function() {

			// assert
			assert.ok(oLoadValueListAnnotationSpy.notCalled, "the .loadValueListAnnotation() method should not be invoked");
			assert.ok(oInitSpy.calledOnce, "it should initialize the metadata only once");

			// cleanup
			oODataControlFactory.destroy();
			done();
		});
	});

	QUnit.test("_getCreator", function(assert) {
		var oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return true;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			getConfiguration: function() {
				return null;
			},
			getControlContext: function() {
				return null;
			},
			getProposedControl: function() {
				return null;
			},
			getControlProposal: function() {
				return null;
			},
			data: function() {
				return null;
			},
			unbindProperty: function() {

			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Time"
			}
		};
		var sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmTime");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.String"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmString");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Int16"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.DateTime"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmDateTime");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.DateTimeOffset"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmDateTimeOffset");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Single"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Float"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Double"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Byte"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oFactory._oMetaData.annotations.uom = true;
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmUOM");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oParent.getEditable = function() {
			return false;
		};
		oFactory._oMetaData.annotations.semantic = true;
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmSemantic");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Boolean"
			}
		};
		oFactory._oMetaData.annotations = {};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmBoolean");

		oParent.getEditable = function() {
			return false;
		};
		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Boolean"
			}
		};
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmBoolean");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oFactory._oMetaData.annotations.uom = true;
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmUOMDisplay");

		oParent.getEditable = function() {
			return false;
		};
		oParent.data = function() {
			return {
				configdata: {
					isUOM: true,
					getContextEditable: function() {
						return false;
					}
				}
			};
		};

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oFactory._oMetaData.annotations.uom = true;
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmUOMDisplay");

		oParent.getEditable = function() {
			return true;
		};
		oParent.data = function() {
			return null;
		};
		oFactory._oMetaData.annotations.uom = false;
		oFactory._oMetaData.property = null;
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, null);

		oParent.getControlProposal = function() {
			return {
				getControlType: function() {
					return null;
				},
				getObjectStatus: function() {
					return {};
				}
			};
		};
		oParent.getEditable = function() {
			return false;
		};
		oFactory._oMetaData.annotations = true;
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createObjectStatus");

		oParent.getControlProposal = function() {
			return {
				getControlType: function() {
					return null;
				},
				getObjectStatus: function() {
					return {};
				}
			};
		};
		oParent.getEditable = function() {
			return false;
		};
		oParent.getUomEditable = function() {
			return false;
		};
		oFactory._oMetaData.annotations = {
			uom: true
		};

		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createEdmUOMObjectStatus");

		oFactory.destroy();
	});

	QUnit.test("ODataControlSelector.getCreator shall return _createEdmUOMObjectNumber", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return false;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return "objectIdentifier";
					}
				};
			},
			getControlContext: function() {
				return "responsiveTable";
			},
			getProposedControl: function() {
				return "ObjectNumber";
			},
			getControlProposal: function() {
				return null;
			}
		};

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.equal(oSelector.getCreator(), "_createEdmUOMObjectNumber");

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isUOMDisplay shall return true", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return false;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return "objectIdentifier";
					}
				};
			},
			getControlContext: function() {
				return "responsiveTable";
			},
			getProposedControl: function() {
				return "ObjectNumber";
			},
			getControlProposal: function() {
				return null;
			}
		};
		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isUOMDisplay());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isUOMDisplay shall return true for uomEditState = 0", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return true;
			},
			getProperty: function() {
				return 0;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return "objectIdentifier";
					}
				};
			},
			getControlContext: function() {
				return "responsiveTable";
			},
			getProposedControl: function() {
				return "ObjectNumber";
			},
			getControlProposal: function() {
				return null;
			}
		};
		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isUOMDisplay());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isUOMDisplay shall return false", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return true;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return null;
			},
			getControlContext: function() {
				return null;
			},
			getProposedControl: function() {
				return null;
			},
			getControlProposal: function() {
				return null;
			}
		};
		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(!oSelector._isUOMDisplay());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isUOMDisplayObjectStatus shall return true", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return false;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return null;
					}
				};
			},
			getControlContext: function() {
				return null;
			},
			getProposedControl: function() {
				return null;
			},
			getControlProposal: function() {
				return {
					getObjectStatus: function() {
						return {};
					}
				};
			}
		};

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isUOMDisplayObjectStatus());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isUOMDisplayObjectStatus shall return false", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return true;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return null;
					}
				};
			},
			getControlContext: function() {
				return null;
			},
			getProposedControl: function() {
				return null;
			},
			getControlProposal: function() {
				return {
					getObjectStatus: function() {
						return {};
					}
				};
			},
			getProperty: function() {
				return -1;
			}
		};

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(!oSelector._isUOMDisplayObjectStatus());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isObjectStatusProposed shall return true", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return false;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return null;
					}
				};
			},
			getControlContext: function() {
				return null;
			},
			getProposedControl: function() {
				return null;
			},
			getControlProposal: function() {
				return {
					getObjectStatus: function() {
						return {};
					}
				};
			}
		};

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isObjectStatusProposed());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isObjectStatusProposed shall return false", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = {
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return true;
			},
			data: function() {
				return null;
			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return null;
					}
				};
			},
			getControlContext: function() {
				return null;
			},
			getProposedControl: function() {
				return null;
			},
			getControlProposal: function() {
				return {
					getObjectStatus: function() {
						return null;
					}
				};
			},
			getUomEditState: function() {
				return -1;
			}
		};

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(!oSelector._isObjectStatusProposed());

		oSelector.destroy();
	});

	QUnit.test("bind", function(assert) {
		var done = assert.async(),
			iCount = 0;

		var oControl = {
			bindProperty: function(sName) {
				if (sName === "editable" || sName === "visible" || sName === "mandatory") {
					iCount++;
				} else {
					iCount--;
				}
			},
			unbindProperty: function() {

			},
			getBindingInfo: function() {
				return null;
			},
			getEditable: function() {
				return true;
			},
			getVisible: function() {
				return true;
			},
			getMandatory: function() {
				return true;
			},
			fireInitialise: function(oEvent) {
			},
			data: function() {
				return null;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			getConfiguration: function() {
				return null;
			},
			getControlContext: function() {
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
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {

			// assert
			assert.equal(iCount, 3);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("bind - asynchronous model loading", function(assert) {
		var done = assert.async(),
			iCount = 0;

		var oControl = {
			bindProperty: function(sName) {
				if (sName === "editable" || sName === "visible" || sName === "mandatory") {
					iCount++;
				} else {
					iCount--;
				}
			},
			unbindProperty: function() {

			},
			getBindingInfo: function() {
				return null;
			},
			getEditable: function() {
				return true;
			},
			getVisible: function() {
				return true;
			},
			getMandatory: function() {
				return true;
			},
			fireInitialise: function(oEvent) {
			},
			data: function() {
				return null;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			getConfiguration: function() {
				return null;
			},
			getControlContext: function() {
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
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: false
		};

		oFactory._oModel.getMetaModel = function() {
			return {
				loaded: function() {
					return Promise.resolve();
				},
				getProperty: function() {

				},
				getODataEntityType: function() {

				},
				getODataComplexType: function() {
				},
				getODataProperty: function() {
				}
			};
		};

		oFactory.bind().finally(function() {

			// assert
			assert.equal(iCount, 3);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("bind - throws an exception", function(assert) {
		var done = assert.async(),
			iCount = 0;

		var oControl = {
			bindProperty: function(sName) {
				if (sName === "enabled" || sName === "visible" || sName === "mandatory") {
					iCount++;
				} else {
					iCount--;
				}
			},
			unbindProperty: function() {

			},
			getBindingInfo: function() {
				return null;
			},
			getEnabled: function() {
				return true;
			},
			getVisible: function() {
				return true;
			},
			getMandatory: function() {
				return true;
			},
			fireInitialise: function(oEvent) {
			},
			data: function() {
				return {};
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			getControlContext: function() {
				return null;
			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			},
			isTextInEditModeSourceNotNone: function() {
				return false;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "ProjectInvalid",
			path: "Description"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {

			// assert
			assert.equal(iCount, 0);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_onCreate with sap:value-list", function(assert) {
		var done = assert.async(),
			iFormat = 0,
			iCount = 0;

		var oControl = {
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			unbindProperty: function() {

			},
			getBindingInfo: function() {
				//Consider using sinon.createStubInstance instead of this dummy object
			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			attachFormatError: function() {
				iFormat++;
			},
			attachParseError: function() {
				iFormat++;
			},
			attachValidationError: function() {
				iFormat++;
			},
			attachValidationSuccess: function() {
				iFormat++;
			},
			getValue: function() {
				return "testtest";
			},
			getEnabled: function() {
				return true;
			},
			getEditable: function() {
				return true;
			},
			getConfiguration: function() {
				return {
					getDisplayBehaviour: function() {
						return null;
					},
					getControlType: function() {
						return null;
					},
					getPreventInitialDataFetchInValueHelpDialog: function() {
						return true;
					}
				};
			},
			getComputedTextLabel: function() {
				return this.getTextLabel() || this._sAnnotationLabel;
			},
			getTextLabel: function() {
				return null;
			},
			data: function(sKey) {
				if (sKey === "dateFormatSettings") {
					return null;
				}
				return "descriptionAndId";
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			addStyleClass: function() {
			},
			fireInitialise: function() {
			},
			fireValueListChanged: function() {
				iCount++;
			},
			addEventDelegate: function() {

			},
			getMode: function() {
				return "edit";
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
			getMetadata: function() {
				return {
					getName: function() {
						return "Input";
					}
				};
			}
		};

		var oVHPStub = this.stub(sap.ui.comp.providers, "ValueHelpProvider");
		oVHPStub.returns(function() {
			return {
				destroy: function() {
					//iDestroy++;
				}
			};
		});

		var oVLPStub = this.stub(sap.ui.comp.providers, "ValueListProvider");
		oVLPStub.returns(function() {
			return {
				destroy: function() {
					//iDestroy++;
				}
			};
		});

		var oFactory = new ODataControlFactory(this.oVHModel, oControl, {
			entitySet: "Headers",
			path: "AccountingDocumentCategory"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			var oAnnotation = "foo";
			oFactory._oMetaData.property.property = {
				"sap:value-list": "standard"
			};

			var mParams = {
				getValue: "getValue",
				valuehelp: {
					annotation: oAnnotation
				}
			};
			oFactory._onCreate(oControl, mParams);

			// assert
			assert.equal(iFormat, 4);
			assert.equal(oFactory._aProviders.length, 2);

			for (var i = 0; i < 2; i++) {
				oFactory._aProviders[i].fireEvent("valueListChanged", {
					"changes": {}
				});
			}

			// assert
			assert.equal(iCount, 2);
			assert.equal(mParams.getValue(), "testtest");

			// cleanup
			oFactory._aProviders = [];
			oVHPStub.restore();
			oVLPStub.restore();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_onCreate with com.sap.vocabularies.Common.v1.ValueList", function(assert) {
		var done = assert.async();
		var iFormat = 0;
		var oControl = {
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			unbindProperty: function() {

			},
			getBindingInfo: function() {
				//Consider using sinon.createStubInstance instead of this dummy object
			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			attachFormatError: function() {
				iFormat++;
			},
			attachParseError: function() {
				iFormat++;
			},
			attachValidationError: function() {
				iFormat++;
			},
			attachValidationSuccess: function() {
				iFormat++;
			},
			getValue: function() {
				return "testtest";
			},
			getEnabled: function() {
				return true;
			},
			getEditable: function() {
				return true;
			},
			getConfiguration: function() {
				return {
					getDisplayBehaviour: function() {
						return null;
					},
					getControlType: function() {
						return null;
					},
					getPreventInitialDataFetchInValueHelpDialog: function() {
						return true;
					}
				};
			},
			getTextLabel: function() {
				return null;
			},
			getComputedTextLabel: function() {
				return this.getTextLabel() || this._sAnnotationLabel;
			},
			data: function(sKey) {
				if (sKey === "dateFormatSettings") {
					return null;
				}
				return "descriptionAndId";
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			addStyleClass: function() {
			},
			fireInitialise: function() {
			},
			addEventDelegate: function() {

			},
			getMode: function() {
				return "edit";
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
			getMetadata: function() {
				return {
					getName: function() {
						return "Input";
					}
				};
			}
		};

		var oVHPStub = this.stub(sap.ui.comp.providers, "ValueHelpProvider");
		oVHPStub.returns(function() {
			return {
				destroy: function() {
					//iDestroy++;
				}
			};
		});

		var oVLPStub = this.stub(sap.ui.comp.providers, "ValueListProvider");
		oVLPStub.returns(function() {
			return {
				destroy: function() {
					//iDestroy++;
				}
			};
		});

		var oFactory = new ODataControlFactory(this.oVHModel, oControl, {
			entitySet: "Headers",
			path: "AccountingDocumentCategory"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};
		oFactory.bind().finally(function() {
			var oAnnotation = "foo";
			oFactory._oMetaData.property.property = {
				"com.sap.vocabularies.Common.v1.ValueList": {}
			};

			var mParams = {
				getValue: "getValue",
				valuehelp: {
					annotation: oAnnotation
				}
			};
			oFactory._onCreate(oControl, mParams);
			assert.equal(iFormat, 4);
			assert.equal(oFactory._aProviders.length, 2);
			assert.equal(mParams.getValue(), "testtest");

			// cleanup
			oFactory._aProviders = [];
			oVHPStub.restore();
			oVLPStub.restore();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_onCreate - no value help and no validations added", function(assert) {
		var done = assert.async(),
			iFormat = 0;

		var oControl = {
			attachFormatError: function() {
				iFormat++;
			},
			attachParseError: function() {
				iFormat++;
			},
			attachValidationError: function() {
				iFormat++;
			},
			attachValidationSuccess: function() {
				iFormat++;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			bindProperty: function() {
			},
			unbindProperty: function() {

			},
			getVisible: function() {
			},
			getEnabled: function() {
			},
			getEditable: function() {
				return true;
			},
			getMandatory: function() {
			},
			getBindingInfo: function() {
			},
			data: function() {
			},
			addStyleClass: function() {
			},
			fireInitialise: function() {
			},
			getConfiguration: function() {
				return null;
			},
			getMode: function() {
				return "edit";
			},
			getExpandNavigationProperties: function() {
				return false;
			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			},
			isTextInEditModeSourceNotNone: function() {
				return false;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			oFactory._onCreate(oControl, {
				noValidation: true
			});

			// assert
			assert.equal(iFormat, 0);
			assert.equal(oFactory._aProviders.length, 0);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_getValueHelpDialogTitle", function(assert) {
		var done = assert.async();
		var oControl = {
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			unbindProperty: function() {

			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			attachFormatError: function() {

			},
			attachParseError: function() {

			},
			attachValidationError: function() {

			},
			attachValidationSuccess: function() {

			},
			getValue: function() {
				return "testtest";
			},
			getEditable: function() {
				return true;
			},
			getTextLabel: function() {
				return null;
			},
			getComputedTextLabel: function() {
				return this.getTextLabel() || this._sAnnotationLabel;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingContext: function() {
				return null;
			},
			getVisible: function() {
			},
			getEnabled: function() {
			},
			getMandatory: function() {
			},
			getBindingInfo: function() {
			},
			data: function() {
			},
			fireInitialise: function() {
			},
			getConfiguration: function() {
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
			}
		};

		var oFactory = new ODataControlFactory(this.oVHModel, oControl, {
			entitySet: "Headers",
			path: "AccountingDocumentCategory"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			oV4Helper.addSAPAnnotation(oFactory._oMetaData.property.property,"label","State of the Amount");
			oV4Helper.liftV4Annotations(oFactory._oMetaData);

			var mParams = {};
			oFactory._getValueHelpDialogTitle(mParams);
			assert.equal(mParams.dialogtitle, "State of the Amount");

			oV4Helper.removeSAPAnnotation(oFactory._oMetaData.property.property,"label");
			oV4Helper.liftV4Annotations(oFactory._oMetaData);
			oFactory._getValueHelpDialogTitle(mParams);
			assert.equal(mParams.dialogtitle, "AccountingDocumentCategory");

			oControl.getTextLabel = function() {
				return "textLabel";
			};
			oFactory._getValueHelpDialogTitle(mParams);
			assert.equal(mParams.dialogtitle, "textLabel");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("getDataProperty", function(assert) {
		var done = assert.async();
		var oParent = {
			getBindingContext: function() {
				return {
					sPath: "/Project(id1='71' id2='abcd')"
				};
			},
			getModel: function() {
				return this.oModel;
			},
			getBindingInfo: function(sProperty) {
				if (sProperty === "value") {
					return {
						parts: [
							{
								model: undefined,
								path: "StartDateTime"
							}
						]
					};
				}
			},
			getWidth: function() {
				return "100%";
			},
			getTextAlign: function() {
				return null;
			},
			getPlaceholder: function() {
				return null;
			},
			getName: function() {
				return null;
			},
			getObjectBinding: function() {
				return null;
			},
			bindProperty: function() {
			},
			unbindProperty: function() {

			},
			getVisible: function() {
			},
			getEnabled: function() {
			},
			getEditable: function() {
				return true;
			},
			getMandatory: function() {
			},
			data: function() {
			},
			fireInitialise: function() {
			},
			getConfiguration: function() {
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
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};
		oFactory.bind().finally(function() {

			// assert
			assert.equal(oFactory.getDataProperty().property.type, "Edm.DateTimeOffset");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("Create factory with binding to navigation property", function(assert) {
		var done = assert.async();
		var oControl = {
			bindProperty: function(sName) {

			},
			unbindProperty: function() {

			},
			getBindingInfo: function() {
				return null;
			},
			getEnabled: function() {
				return true;
			},
			getVisible: function() {
				return true;
			},
			getEditable: function() {
				return true;
			},
			getMandatory: function() {
				return true;
			},
			fireInitialise: function(oEvent) {
			},
			data: function() {
				return {};
			},
			getObjectBinding: function() {
				return {
					sPath: "Tasks"
				};
			},
			getBindingContext: function() {
				return null;
			},
			getConfiguration: function() {
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
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};
		oFactory.bind().finally(function() {

			// assert
			assert.equal(oFactory._oMetaData.entityType.name, "Task_Type");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_handleEventingForEdmString", function(assert) {
		var done = assert.async(),
			fChange,
			iChange = 0,
			oControl;

		oControl = {
			attachChange: function(fEvent) {
				fChange = fEvent;
				return this;
			}.bind(oControl),
			fireChange: function() {
				iChange++;
			},
			getValue: function() {
				return "";
			},
			getObjectBinding: function() {
				return {
					sPath: "Tasks"
				};
			},
			getBindingContext: function() {
				return null;
			},
			bindProperty: function() {
			},
			unbindProperty: function() {
			},
			getVisible: function() {
			},
			getEnabled: function() {
			},
			getEditable: function() {
				return true;
			},
			getMandatory: function() {
			},
			getBindingInfo: function() {
			},
			data: function() {
			},
			getConfiguration: function() {
				return null;
			},
			fireInitialise: function() {
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
			_oSuggestionPopup: {
				isOpen: function() {
					return true;
				}
			},
			_iPopupListSelectedIndex: 1,
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			oFactory._handleEventingForEdmString({ control: oControl, edmProperty: oFactory._oMetaData.property.property });
			fChange();
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				}
			});
			fChange({
				getParameters: function() {
					return {
						validated: false
					};
				}
			});
			oControl._iPopupListSelectedIndex = 0;
			oControl.fireChange = function() {
				iChange++;
				throw "error";
			};
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				}
			});

			assert.equal(iChange, 2);
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_handleEventingForEdmString - currency", function(assert) {
		var done = assert.async(),
			fChange,
			iChange = 0,
			oControl;

		oControl = {
			attachChange: function(fEvent) {
				fChange = fEvent;
				return this;
			}.bind(oControl),
			fireChange: function() {
				iChange++;
			},
			getValue: function() {
				return "";
			},
			getObjectBinding: function() {
				return {
					sPath: "Tasks"
				};
			},
			getBindingContext: function() {
				return null;
			},
			bindProperty: function() {
			},
			unbindProperty: function() {
			},
			getVisible: function() {
			},
			getEnabled: function() {
			},
			getEditable: function() {
				return true;
			},
			getMandatory: function() {
			},
			getBindingInfo: function() {
			},
			data: function() {
			},
			getConfiguration: function() {
				return null;
			},
			fireInitialise: function() {
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
			_toggleInnerControlIfRequired: function(){
			},
			_oSuggestionPopup: {
				isOpen: function() {
					return true;
				}
			},
			_iPopupListSelectedIndex: 1,
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.getCurrencyValidationSettings = function(){
			return {};
		};

		oFactory.updateModelPropertiesForCurrency  = function(){
		};

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			oFactory._handleEventingForEdmString({currency: {},  control: oControl, edmProperty: oFactory._oMetaData.property.property });
			fChange();
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				}
			});
			fChange({
				getParameters: function() {
					return {
						validated: false
					};
				}
			});
			oControl._iPopupListSelectedIndex = 0;
			oControl.fireChange = function() {
				iChange++;
				throw "error";
			};
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				}
			});

			assert.equal(iChange, 2);
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_handleEventingForEdmString - upper case ", function(assert) {
		var oFactory, oControl, fChange, iChange = 0, sSet = null;

		oControl = {
			attachChange: function(fEvent) {
				fChange = fEvent;
				return this;
			}.bind(oControl),
			fireChange: function() {
				iChange++;
			},
			getValue: function() {
				return "";
			},
			setValue: function(sValue) {
				sSet = sValue;
			},
			getObjectBinding: function() {
				return {
					sPath: "Tasks"
				};
			},
			getBindingContext: function() {
				return null;
			},
			bindProperty: function() {
			},
			unbindProperty: function() {
			},
			getVisible: function() {
			},
			getEnabled: function() {
			},
			getMandatory: function() {
			},
			getBindingInfo: function() {
			},
			data: function() {
			},
			fireInitialise: function() {
			},
			getConfiguration: function() {
				return null;
			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			},
			isTextInEditModeSourceNotNone: function() {
				return false;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};
		//oFactory.bind();

		oFactory._oMetaData = {
			property: {
				property: {
					"name": "TestUpperCase"
				}
			}
		};
		oV4Helper.addSAPAnnotation(oFactory._oMetaData.property.property,"display-format","UpperCase");
		oV4Helper.liftV4Annotations(oFactory._oMetaData);

		oFactory._handleEventingForEdmString({ control: oControl, edmProperty: oFactory._oMetaData.property.property });

		fChange();
		fChange({
			getParameters: function() {
				return {
					value: "test",
					validated: true
				};
			}
		});
		fChange({
			getParameters: function() {
				return {
					validated: false
				};
			}
		});
		assert.equal(iChange, 2);
		assert.equal(sSet, "test".toUpperCase());

		// check exception "swallowed"
		oControl.fireChange = function() {
			throw "exception";
		};

		oFactory.destroy();
	});

	QUnit.test("Shall be destructible", function(assert) {
		var oFactory, oParent, oProvider, bDestroy = false;

		oParent = {
			getBindingContext: function() {
				return {
					sPath: "/Project(id1='71' id2='abcd')"
				};
			},
			getModel: function() {
				return this.oModel;
			},
			unbindProperty: function() {

			},
			getBindingInfo: function(sProperty) {
				if (sProperty === "value") {
					return {
						parts: [
							{
								model: undefined,
								path: "StartDateTime"
							}
						]
					};
				}
			},
			getWidth: function() {
				return "100%";
			},
			getTextAlign: function() {
				return null;
			},
			getPlaceholder: function() {
				return null;
			},
			getName: function() {
				return null;
			},
			getObjectBinding: function() {
				return null;
			},
			getConfiguration: function() {
				return null;
			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			},
			isTextInEditModeSourceNotNone: function() {
				return false;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});
		oProvider = {
			destroy: function() {
				bDestroy = true;
			}
		};
		oFactory._aProviders.push(oProvider);
		oFactory.destroy();
		assert.ok(oFactory);
		assert.equal(oFactory._oParent, null);
		assert.equal(bDestroy, true);
	});

	QUnit.test("createControl with complex type", function(assert) {
		var oFactory, oSet, oType, oProperty, oControl, oParent, oComplexTypes;

		oParent = {
			getBindingContext: function() {
				return {
					sPath: "/FinsPostingPaymentHeaders(TmpId='3HLDC27520',TmpIdType='T')"
				};
			},
			getModel: function() {
				return this.oModel;
			},
			getBindingInfo: function() {
				return {
					"parts": [
						{
							model: undefined,
							path: "ID"
						}
					]
				};
			},
			bindProperty: function() {

			},
			unbindProperty: function() {

			},
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getContextEditable: function() {
				return true;
			},
			getWidth: function() {
				return "100%";
			},
			getTextAlign: function() {
				return null;
			},
			getPlaceholder: function() {
				return null;
			},
			getName: function() {
				return null;
			},
			attachFormatError: function(fErr) {

			},
			attachParseError: function(fErr) {

			},
			attachValidationError: function(fErr) {

			},
			attachValidationSuccess: function(fSucc) {

			},
			fireValidationSuccess: function(oParam) {

			},
			fireFormatError: function(oParam) {

			},
			fireParseError: function(oParam) {

			},
			fireValidationError: function(oParam) {

			},
			getConfiguration: function() {
				return {
					getControlType: function() {
						return "auto";
					}
				};
			},
			getObjectBinding: function() {
				return null;
			},
			getCustomData: function() {
				return 0;
			},
			data: function() {
				return null;
			},
			getControlContext: function() {
				return "form";
			},
			getAriaLabelledBy: function() {
				return [];
			},
			getId: function() {
				return "smartfield";
			},
			getMode: function() {
				return "edit";
			},
			getTextInEditModeSource: function() {
				return library.smartfield.TextInEditModeSource.None;
			},
			isTextInEditModeSourceNotNone: function() {
				return false;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oComplexTypes = JSON.parse("[{\"name\":\"AcctgDocSimTmpKey\",\"property\":[{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Beleg-ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocHdrPayment\",\"property\":[{\"name\":\"HouseBank\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcHouseBank\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hausbank\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"GLAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcGLAccount\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Sachkonto\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"GLAccountName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"20\",\"extensions\":[{\"name\":\"label\",\"value\":\"Kurztext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"HouseBankAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcHouseBankAccount\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Konto-Id\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInTransCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInTransCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"TransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Betrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Währung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInCoCodeCrcy\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInCoCodeCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"CoCodeCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hauswährungsbetrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CoCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"BusinessArea\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcBusinessArea\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"GeschBereich\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ProfitCenter\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcProfitCenter\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profitcenter\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentItemText\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcDocumentItemText\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Positionstext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AssignmentReference\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAssignmentReference\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Zuordnung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ValueDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcValueDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Valutadatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcHouseBank\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcGLAccount\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcHouseBankAccount\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInTransCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInCoCodeCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcBusinessArea\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcProfitCenter\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentItemText\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAssignmentReference\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcValueDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"namespace\":\"FAC_FINANCIALS_POSTING_SRV\"},{\"name\":\"AcctgDocHdrBankCharges\",\"property\":[{\"name\":\"AmountInTransCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInTransCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"TransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Betrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Währung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInCoCodeCrcy\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInCoCodeCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"CoCodeCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hauswährungsbetrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CoCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxCode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umsatzsteuer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxCode\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInCoCodeCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInTransCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"FunctionImportDummyReturn\",\"property\":[{\"name\":\"Dummy\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocTmpKey\",\"property\":[{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Beleg-ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocKey\",\"property\":[{\"name\":\"AccountingDocument\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"APARAccountKey\",\"property\":[{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"APARAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Konto\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]}]");
					oSet = JSON.parse("{\"name\":\"FinsPostingPaymentHeaders\",\"entityType\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostingPaymentHeader\",\"extensions\":[{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}");
					oType =
							JSON
								.parse("{\"name\":\"FinsPostingPaymentHeader\",\"key\":{\"propertyRef\":[{\"name\":\"TmpId\"},{\"name\":\"TmpIdType\"}]},\"property\":[{\"name\":\"BankCharges\",\"type\":\"FAC_FINANCIALS_POSTING_SRV.AcctgDocHdrBankCharges\",\"nullable\":\"false\"},{\"name\":\"Payment\",\"type\":\"FAC_FINANCIALS_POSTING_SRV.AcctgDocHdrPayment\",\"nullable\":\"false\"},{\"name\":\"AccountingDocument\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocument\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentCategory\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegstatus\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentHeaderText\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"25\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocumentHeaderText\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Kopftext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocumentType\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentTypeName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"40\",\"extensions\":[{\"name\":\"label\",\"value\":\"Langtext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcCompanyCode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCodeName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"54\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DisplayCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Anzeigewährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"field-control\",\"value\":\"UxFcDocumentDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentReferenceID\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"16\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcDocumentReferenceID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Referenz\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRate\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungskurs\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRateDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRateDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungsdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRateForTaxes\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRateForTaxes\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungskurs\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalPeriod\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcFiscalPeriod\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Periode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"HasInvoiceReference\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Rechn.bez. berücks.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"IntercompanyTransaction\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"16\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcIntercompanyTransaction\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"GesellschÜbergr. TA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"IsNetEntry\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcIsNetEntry\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Nettoerfassung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"LedgerGroup\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcLedgerGroup\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Ledger-Gruppe\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"NoteToPayee\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Verwendungszweck\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"PostingDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"field-control\",\"value\":\"UxFcPostingDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Buchungsdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ScreenVariant\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Variante\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxIsCalculatedAutomatically\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxIsCalculatedAutomatically\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Steuer rechnen\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxReportingDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxReportingDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Steuermeldedat.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temporäre ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Art der temporären ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalCreditAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Habensumme\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalDebitAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Sollsumme\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalNetAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Nettosumme der Posten\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Transaktionswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxAction\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"15\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocument\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocumentHeaderText\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocumentType\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcCompanyCode\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentReferenceID\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRateDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRateForTaxes\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcFiscalPeriod\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcIntercompanyTransaction\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcIsNetEntry\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcLedgerGroup\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcPostingDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxIsCalculatedAutomatically\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxReportingDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTransactionCurrency\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxProcessTaxAlways\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Flag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxStatus\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Datnerfassgsstats\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"navigationProperty\":[{\"name\":\"Attachments\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAttachment\",\"fromRole\":\"FromRole_FinsPostPaytHdrAttachment\",\"toRole\":\"ToRole_FinsPostPaytHdrAttachment\"},{\"name\":\"Notes\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrNote\",\"fromRole\":\"FromRole_FinsPostPaytHdrNote\",\"toRole\":\"ToRole_FinsPostPaytHdrNote\"},{\"name\":\"APARItemsToBeClrd\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAPARItemToBeClrd\",\"fromRole\":\"FromRole_FinsPostPaytHdrAPARItemToBeClrd\",\"toRole\":\"ToRole_FinsPostPaytHdrAPARItemToBeClrd\"},{\"name\":\"APARItems\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAPARItem\",\"fromRole\":\"FromRole_FinsPostPaytHdrAPARItem\",\"toRole\":\"ToRole_FinsPostPaytHdrAPARItem\"},{\"name\":\"Items\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrGLItm\",\"fromRole\":\"FromRole_FinsPostPaytHdrGLItm\",\"toRole\":\"ToRole_FinsPostPaytHdrGLItm\"}],\"extensions\":[{\"name\":\"service-schema-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"service-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"namespace\":\"FAC_FINANCIALS_POSTING_SRV\",\"entityType\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostingPaymentHeader\"}");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		this.oModel.getServiceMetadata().dataServices.schema[0].complexType = oComplexTypes;
		this.oModel.getServiceMetadata().dataServices.schema[0].namespace = "FAC_FINANCIALS_POSTING_SRV";

		oProperty = JSON.parse("{\"property\":{\"name\":\"ValueDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcValueDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Valutadatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:creatable\":{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Valutadatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:field-control\":{\"name\":\"field-control\",\"value\":\"UxFcValueDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"AcctgDocHdrPayment/ValueDate\",\"complex\":true}");
		oFactory._oMetaData.entitySet = oSet;
		oFactory._oMetaData.entityType = oType;
		oFactory._oMetaData.property = oProperty;
		oFactory._oMetaData.namespace = "ZMEY_SRV";
		oFactory._oMetaData.path = "Payment/ValueDate";

		oControl = oFactory.createControl();
		assert.ok(oControl);

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("createControl with complex type (Unit of Measure)", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oComplexModel);

		oParent.getBindingContext = function() {
			return {
				sPath: "/FinsPostingPaymentHeaders(TmpId='3HLDC27520',TmpIdType='T')"
			};
		};

		var oFactory = new ODataControlFactory(this.oComplexModel, oParent, {
			entitySet: "FinsPostingPaymentHeaders",
			path: "Payment/AmountInCoCodeCrcy"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			var oControl = oFactory.createControl();

			// assert
			assert.ok(oControl);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_getUOMPath", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oComplexModel);

		oParent.getBindingContext = function() {
			return {
				sPath: "/FinsPostingPaymentHeaders(TmpId='3HLDC27520',TmpIdType='T')"
			};
		};
		oParent.getBindingInfo = function() {
			return {
				"parts": [
					{
						model: undefined,
						path: "ID"
					}
				]
			};
		};

		var oFactory = new ODataControlFactory(this.oComplexModel, oParent, {
			entitySet: "FinsPostingPaymentHeaders",
			path: "Payment/AmountInCoCodeCrcy"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			var sPath = oFactory._oHelper.getUOMPath(oFactory._oMetaData);
			assert.equal(sPath, "Payment/CoCodeCurrency");

			sPath = oFactory._oHelper.getUOMPath({});
			assert.equal(!sPath, true);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkUOM", function(assert) {
		var done = assert.async();
		var oParent = {
			getBindingContext: function() {
				return {
					sPath: "/FinsPostingPaymentHeaders(TmpId='3HLDC27520',TmpIdType='T')"
				};
			},
			getModel: function() {
				return this.oComplexModel;
			},
			getBindingInfo: function() {
				return {
					"parts": [
						{
							model: undefined,
							path: "ID"
						}
					]
				};
			},
			bindProperty: function() {

			},
			unbindProperty: function() {

			},
			getEditable: function() {
				return true;
			},
			getEnabled: function() {
				return true;
			},
			getWidth: function() {
				return "100%";
			},
			getTextAlign: function() {
				return null;
			},
			getPlaceholder: function() {
				return null;
			},
			getName: function() {
				return null;
			},
			data: function() {
				return null;
			},
			getObjectBinding: function() {
				return null;
			},
			fireInitialise: function() {
			},
			getConfiguration: function() {
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
			}
		};

		var oFactory = new ODataControlFactory(this.oComplexModel, oParent, {
			entitySet: "FinsPostingPaymentHeaders",
			path: "Payment/AmountInCoCodeCrcy"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind().finally(function() {
			assert.ok(!oFactory._checkUOM());

			oParent.data = function() {
				return {
					configdata: {
						onText: true,
						onInput: false
					}
				};
			};

			assert.ok(oFactory._checkUOM());

			oParent.data = function() {
				return {
					configdata: {
						onText: false,
						onInput: true
					}
				};
			};

			assert.ok(oFactory._checkUOM());

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("it should return the binding data type of the provided control", function(assert) {

		// arrange
		var oExpectedStringType = new StringType();
		var oComboBox = new ComboBox({
			selectedKey: {
				path: "CategoryID",
				type: oExpectedStringType
			}
		});
		var oSmartField = new SmartField();
		oSmartField.setContent(oComboBox);

		// system under test
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "lorem",
			path: "loremPath"
		});

		// act
		var oStringType = oFactory.getDropdownItemKeyType(oComboBox);

		// assert
		assert.strictEqual(oStringType, oExpectedStringType);

		// cleanup
		oSmartField.destroy();
		oFactory.destroy();
	});

	QUnit.module("getBoundPropertiesMapInfoForControl");

	QUnit.test('it should return the correct mapping information for "sap.m.Input"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Input";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.TimePicker"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.TimePicker";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.DatePicker"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.DatePicker";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.DateTimePicker"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.DateTimePicker";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.TextArea"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.TextArea";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Text"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Text";
		var EXPECTED_PROPERTY_NAME = "text";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ObjectIdentifier"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ObjectIdentifier";
		var EXPECTED_PROPERTY_NAME = "text";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.ui.comp.navpopover.SmartLink"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.ui.comp.navpopover.SmartLink";
		var EXPECTED_PROPERTY_NAME = "text";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Link" (test case 1)', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Link";
		var mSETTINGS = {
			propertyName: "value"
		};
		var EXPECTED_PROPERTY_NAME1 = "text";
		var EXPECTED_PROPERTY_NAME2 = "href";

		// act
		var sProperty1 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var sProperty2 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[1];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty1, EXPECTED_PROPERTY_NAME1);
		assert.strictEqual(sProperty2, EXPECTED_PROPERTY_NAME2);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME1);
		assert.strictEqual(mMap.value[1], EXPECTED_PROPERTY_NAME2);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Link" (test case 2)', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Link";
		var mSETTINGS = {
			propertyName: "url"
		};
		var EXPECTED_PROPERTY_NAME = "href";

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.url[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ObjectStatus"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ObjectStatus";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty1 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var sProperty2 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[1];
		var sProperty3 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[2];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty1, "text");
		assert.strictEqual(sProperty2, "state");
		assert.strictEqual(sProperty3, "icon");

		assert.strictEqual(mMap.value[0], "text");
		assert.strictEqual(mMap.value[1], "state");
		assert.strictEqual(mMap.value[2], "icon");
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ObjectNumber"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ObjectNumber";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty1 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var sProperty2 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[1];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty1, "number");
		assert.strictEqual(sProperty2, "unit");

		assert.strictEqual(mMap.value[0], "number");
		assert.strictEqual(mMap.value[1], "unit");
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Select"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Select";
		var EXPECTED_PROPERTY_NAME = "selectedKey";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ComboBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ComboBox";
		var EXPECTED_PROPERTY_NAME = "selectedKey";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.ui.comp.smartfield.DisplayComboBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.ui.comp.smartfield.DisplayComboBox";
		var EXPECTED_PROPERTY_NAME = "selectedKey";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.CheckBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.CheckBox";
		var EXPECTED_PROPERTY_NAME = "selected";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test("calling the getBoundPropertiesMapInfoForControl method should not raise an exception", function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.FooBarControl";
		var mSETTINGS = {
			propertyName: "value"
		};
		var oExpectedReturnValue;

		try {
			oExpectedReturnValue = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS);
		} catch (oEvent) {
			assert.ok(false, "it should not raise an exception");
		}

		// assert
		assert.ok(oExpectedReturnValue === null, "it should return null");
	});

	QUnit.test('it should return the correct mapping information for "sap.ui.comp.smartfield.SmartField"', function(assert) {

		// arrange
		var oModel = setUpModel(TestModelTestData.TestModel);
		var oSmartField = new SmartField();
		var oMetaData = {};
		var oDataControlFactory = new ODataControlFactory(oModel, oSmartField, oMetaData);
		var CONTROL_NAME = "sap.ui.comp.smartfield.SmartField";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);

		// cleanup
		oModel.destroy();
		oSmartField.destroy();
		oDataControlFactory.destroy();
	});

	QUnit.module("RecommendationState annotation");

	QUnit.test("calling .getValueStateBindingInfoForRecommendationStateAnnotation() method should return the binding info", function(assert) {

		// arrange
		var oModel = {};
		var oEdmProperty = {
			"name": "Name",
			"type": "Edm.String",
			"com.sap.vocabularies.UI.v1.RecommendationState": {
				"Path": "Name_sr"
			}
		};
		var oRecommendationEdmProperty = {
			"name": "Name_sr",
			"type": "Edm.Byte"
		};

		var oMock = {
			_oMetaData: {
				entityType: {
					name: "Product"
				}
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.ui.comp.smartfield.ODataControlFactory";
					}
				};
			}
		};

		// act
		var oBindingInfo = ODataControlFactory.prototype.getValueStateBindingInfoForRecommendationStateAnnotation.call(oMock, oEdmProperty, oRecommendationEdmProperty, oModel);

		// assert
		assert.ok(oBindingInfo.model === oModel);
		assert.strictEqual(oBindingInfo.path, "Name_sr", 'it should return the path specified in the "HasRecommendation" annotation');
		assert.strictEqual(typeof oBindingInfo.formatter, "function");
	});

	QUnit.test("calling .getValueStateBindingInfoForRecommendationStateAnnotation() method should return null (test case 1)", function(assert) {

		// arrange
		var oEdmProperty = {
			"name": "Name",
			"type": "Edm.String"
		};

		// act
		var oBindingInfo = ODataControlFactory.prototype.getValueStateBindingInfoForRecommendationStateAnnotation(oEdmProperty);

		// assert
		assert.ok(oBindingInfo === null);
	});

	QUnit.test("calling .getValueStateBindingInfoForRecommendationStateAnnotation() method should return null (test case 2)", function(assert) {

		// arrange
		var oEdmProperty = {
			"name": "Name",
			"type": "Edm.String",
			"com.sap.vocabularies.UI.v1.HasRecommendation": {
				"Path": "Name_sr"
			}
		};
		var oRecommendationEdmProperty = {
			"name": "Name_sr",
			"type": "Edm.String" // not expected type
		};

		var oMock = {
			_oMetaData: {
				entityType: {
					name: "Product"
				}
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.ui.comp.smartfield.ODataControlFactory";
					}
				};
			}
		};

		// act
		var oBindingInfo = ODataControlFactory.prototype.getValueStateBindingInfoForRecommendationStateAnnotation.call(oMock, oEdmProperty, oRecommendationEdmProperty);

		// assert
		assert.ok(oBindingInfo === null);
	});

	QUnit.test("it should convert the value of the UI.RecommendationState annotation to valid arguments for the valueState property", function(assert) {

		// assert
		assert.strictEqual(ODataControlFactory.formatRecommendationState(0), ValueState.None);
		assert.strictEqual(ODataControlFactory.formatRecommendationState(1), ValueState.Information);
		assert.strictEqual(ODataControlFactory.formatRecommendationState(2), ValueState.Warning);
		assert.strictEqual(ODataControlFactory.formatRecommendationState("0"), ValueState.None, "Invalid recommended value type");
		assert.strictEqual(ODataControlFactory.formatRecommendationState(10), ValueState.None, "Invalid recommended value");
	});

	QUnit.start();
});
