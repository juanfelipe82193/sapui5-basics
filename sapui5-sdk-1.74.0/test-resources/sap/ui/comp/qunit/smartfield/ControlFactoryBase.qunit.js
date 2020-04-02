/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/core/library",
	"sap/ui/core/Control",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ControlFactoryBase",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/comp/smartfield/ODataHelper",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/InvisibleText",
	"sap/m/Input",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data",
	"test-resources/sap/ui/comp/qunit/smartfield/data/ValueHelpModel.data"

], function(
	coreLibrary,
	Control,
	SmartField,
	ControlFactoryBase,
	ODataControlFactory,
	ODataHelper,
	ODataModel,
	ODataMetaModel,
	JSONModel,
	InvisibleText,
	Input,
	TestModelTestData,
	ValueHelpModelTestData

) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfield.ControlFactoryBase", {
		beforeEach: function() {
			function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
				var iIndex = -1;

				sPropertyName = sPropertyName || "name";
				jQuery.each(aArray || [], function(i, oObject) {
					if (oObject[sPropertyName] === vExpectedPropertyValue) {
						iIndex = i;
						return false; // break
					}
				});

				return iIndex;
			}

			function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
				var vResult = bAsPath ? undefined : null, iSeparatorPos, sNamespace, sName;

				sQualifiedName = sQualifiedName || "";
				iSeparatorPos = sQualifiedName.lastIndexOf(".");
				sNamespace = sQualifiedName.slice(0, iSeparatorPos);
				sName = sQualifiedName.slice(iSeparatorPos + 1);
				jQuery.each(oModel.getObject("/dataServices/schema") || [], function(i, oSchema) {
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
			}

			this.oModel = sinon.createStubInstance(ODataModel);
			this.oModel.getServiceMetadata = function() {
				return TestModelTestData.TestModel;
			};
			this.oModel.getMetaModel = function() {
				var oStub = sinon.createStubInstance(ODataMetaModel);
				oStub.oModel = new JSONModel(TestModelTestData.TestModel);
				oStub.oData = TestModelTestData.TestModel;
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

					jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function(i, oSchema) {
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
					return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
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
				oStub.getODataComplexType = function(sQualifiedName, bAsPath) {
					return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
				};
				return oStub;
			};

			this.oVHModel = sinon.createStubInstance(ODataModel);
			this.oVHModel.getServiceMetadata = function() {
				return ValueHelpModelTestData;
			};
			this.oVHModel.getMetaModel = function() {
				var oStub = sinon.createStubInstance(ODataMetaModel);
				oStub.oModel = new JSONModel(ValueHelpModelTestData);
				oStub.oData = ValueHelpModelTestData;
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

					jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function(i, oSchema) {
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
					return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
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
				oStub.getODataComplexType = function(sQualifiedName, bAsPath) {
					return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
				};
				return oStub;
			};
		},
		afterEach: function() {

		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		var oFactory, oParent;
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
							path: "ID"
						}
					]
				};
			},
			bindProperty: function() {

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
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		assert.ok(oFactory);

		oFactory.destroy();
	});

	QUnit.test("Create Control", function(assert) {
		var oFactory, oParent, oControl, bOnCreate = false;

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
							path: "ID"
						}
					]
				};
			},
			bindProperty: function() {

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
			getControlContext: function () {
				return "form";
			},
			getAriaLabelledBy: function () {
				return [];
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._getCreator = function() {
			return "_create";
		};
		oFactory._create = function() {
			return {
				control: {},
				onCreate: "_onCreate"
			};
		};
		oFactory._onCreate = function() {
			bOnCreate = true;
		};

		oControl = oFactory.createControl();
		assert.ok(oControl.control);
		assert.equal(oControl.onCreate, "_onCreate");
		assert.ok(bOnCreate);

		oFactory.destroy();
	});

	QUnit.test("_addAriaLabelledBy", function(assert) {
		var oParent, oFactory, oControl;
		var oAriaLabel = new InvisibleText({
			id: "_addAriaLabelledBy_DescriptionLabel",
			text: "Project Description (ariaLabelledBy)"
		});
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
							path: "Description"
						}
					]
				};
			},
			bindProperty: function() {

			},
			getObjectBinding: function() {
				return {
					sPath: "Description"
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
				return [
					oAriaLabel
				];
			},
			getControlContext: function() {
				return "form";
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oControl = {
			control: new Input()
		};

		oFactory._addAriaLabelledBy(oControl);
		assert.equal(sap.ui.getCore().byId(oControl.control.getAriaLabelledBy()[0]).getText(), "Project Description (ariaLabelledBy)", "ARIA label taken over from SmartField");
	});

	QUnit.test("addValidations- checkMandatory - null", function(assert) {
		var bCallBack, oFactory, bShowValueState = true, iFormat = 0, iState = 0, iText = 0, oControl, oParent, fSuccess, fError, sMessage, fParentSucc, fParentError;

		oControl = {
			getShowValueStateMessage: function() {
				return bShowValueState;
			},
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			attachFormatError: function(fErr) {
				iFormat++;
				fError = fErr;
			},
			attachParseError: function() {
				iFormat++;
			},
			attachValidationError: function() {
				iFormat++;
			},
			attachValidationSuccess: function(fSucc) {
				iFormat++;
				fSuccess = fSucc;
			},
			fireValidationSuccess: function(oParam) {
				fSuccess(oParam);
			},
			fireFormatError: function(oParam) {
				fError(oParam);
			},
			fireParseError: function(oParam) {
				fError(oParam);
			},
			fireValidationError: function(oParam) {
				fError(oParam);
			},
			setValueStateText: function(sText) {
				if (sText === "SuccessMessage") {
					iText++;
				} else if (sText === "ErrorMessage") {
					iText++;
				}

				sMessage = sText;
			},
			getValueStateText: function() {
				return sMessage;
			},
			setValueState: function() {
				iState++;
			},
			updateMessages: function(sName, aMessages) {
				if (aMessages && aMessages.length > 0) {
					this.setValueState(aMessages[0].type);
					this.setValueStateText(aMessages[0].message);
				} else {
					this.setValueState(coreLibrary.ValueState.None);
				}
			},
			getParent: function() {
				return oParent;
			}
		};

		oParent = {
			getShowValueStateMessage: function() {
				return bShowValueState;
			},
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			attachFormatError: function(fErr) {
				fParentError = fErr;
			},
			attachParseError: function(fErr) {
				fParentError = fErr;
			},
			attachValidationError: function(fErr) {
				fParentError = fErr;
			},
			attachValidationSuccess: function(fSucc) {
				fParentSucc = fSucc;
			},
			fireValidationSuccess: function(oParam) {
				fParentSucc(oParam);
			},
			fireFormatError: function(oParam) {
				fParentError(oParam);
			},
			fireParseError: function(oParam) {
				fParentError(oParam);
			},
			fireValidationError: function(oParam) {
				fParentError(oParam);
			},
			setValueStateText: function(sText) {
				if (sText === "SuccessMessage") {
					iText++;
				} else if (sText === "ErrorMessage") {
					iText++;
				}

				sMessage = sText;
			},
			getValueStateText: function() {
				return sMessage;
			},
			setValueState: function() {
				iState++;
			},
			updateMessages: function(sName, aMessages) {
				if (aMessages && aMessages.length > 0) {
					this.setValueState(aMessages[0].type);
					this.setValueStateText(aMessages[0].message);
				} else {
					this.setValueState(coreLibrary.ValueState.None);
				}
			},
			testCallBack: function(bParam) {
				bCallBack = true;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory.checkMandatory = function() {
			return null;
		};

		oFactory.addValidations(oControl, "testCallBack");
		assert.equal(iFormat, 4);

		fSuccess({
			getParameter: function() {
				return {
					name: "SuccessMessage",
					message: "SuccessMessage"
				};
			},
			getSource: function() {
				return oControl;
			}
		});
		fError({
			getParameter: function() {
				return {
					name: "ErrorMessage",
					message: "ErrorMessage"
				};
			},
			getSource: function() {
				return oControl;
			}
		});
		assert.equal(iText, 2);
		assert.equal(iState, 2);
		assert.equal(bCallBack, true);

		bShowValueState = false;
		fSuccess({
			getParameter: function() {
				return {
					name: "SuccessMessage",
					message: "SuccessMessage"
				};
			},
			getSource: function() {
				return oControl;
			}
		});
		assert.equal(oControl.getValueStateText(), "SuccessMessage");
		oFactory.destroy();
	});

	QUnit.test("addValidations - checkMandatory - error", function(assert) {
		var oFactory, bShowValueState = true, iFormat = 0, iState = 0, iText = 0, oControl, oParent, fSuccess, fError, sMessage, fParentSucc, fParentError;

		oControl = {
			getShowValueStateMessage: function() {
				return bShowValueState;
			},
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			attachFormatError: function(fErr) {
				iFormat++;
				fError = fErr;
			},
			attachParseError: function() {
				iFormat++;
			},
			attachValidationError: function() {
				iFormat++;
			},
			attachValidationSuccess: function(fSucc) {
				iFormat++;
				fSuccess = fSucc;
			},
			fireValidationSuccess: function(oParam) {
				fSuccess(oParam);
			},
			fireFormatError: function(oParam) {
				fError(oParam);
			},
			fireParseError: function(oParam) {
				fError(oParam);
			},
			fireValidationError: function(oParam) {
				fError(oParam);
			},
			setValueStateText: function(sText) {
				if (sText === "SuccessMessage") {
					iText++;
				} else if (sText === "ErrorMessage") {
					iText++;
				}

				sMessage = sText;
			},
			getValueStateText: function() {
				return sMessage;
			},
			setValueState: function() {
				iState++;
			},
			updateMessages: function(sName, aMessages) {
				if (aMessages && aMessages.length > 0) {
					this.setValueState(aMessages[0].type);
					this.setValueStateText(aMessages[0].message);
				} else {
					this.setValueState(coreLibrary.ValueState.None);
				}
			}
		};

		oParent = {
			getShowValueStateMessage: function() {
				return bShowValueState;
			},
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			attachFormatError: function(fErr) {
				fParentError = fErr;
			},
			attachParseError: function(fErr) {
				fParentError = fErr;
			},
			attachValidationError: function(fErr) {
				fParentError = fErr;
			},
			attachValidationSuccess: function(fSucc) {
				fParentSucc = fSucc;
			},
			fireValidationSuccess: function(oParam) {
				fParentSucc(oParam);
			},
			fireFormatError: function(oParam) {
				fParentError(oParam);
			},
			fireParseError: function(oParam) {
				fParentError(oParam);
			},
			fireValidationError: function(oParam) {
				fParentError(oParam);
			},
			setValueStateText: function(sText) {
				if (sText === "SuccessMessage") {
					iText++;
				} else if (sText === "ErrorMessage") {
					iText++;
				}

				sMessage = sText;
			},
			getValueStateText: function() {
				return sMessage;
			},
			setValueState: function() {
				iState++;
			},
			updateMessages: function(sName, aMessages) {
				if (aMessages && aMessages.length > 0) {
					this.setValueState(aMessages[0].type);
					this.setValueStateText(aMessages[0].message);
				} else {
					this.setValueState(coreLibrary.ValueState.None);
				}
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory.checkMandatory = function() {
			return {
				getSource: function() {
					return oControl;
				},
				getParameter: function() {
					return {
						message: "checkMandatory"
					};
				}
			};
		};

		oFactory.addValidations(oControl);
		assert.equal(iFormat, 4);

		fSuccess({
			getParameter: function() {
				return {
					name: "SuccessMessage",
					message: "SuccessMessage"
				};
			},
			getSource: function() {
				return oControl;
			}
		});
		fError({
			getParameter: function() {
				return {
					name: "ErrorMessage",
					message: "ErrorMessage"
				};
			},
			getSource: function() {
				return oControl;
			}
		});
		assert.equal(iText, 2);
		assert.equal(iState, 2);

		bShowValueState = false;
		fSuccess({
			getParameter: function() {
				return {
					name: "SuccessMessage",
					message: "SuccessMessage"
				};
			},
			getSource: function() {
				return oControl;
			}
		});
		assert.equal(oControl.getValueStateText(), "SuccessMessage");
		oFactory.destroy();
	});

	QUnit.test("createValueHelp", function(assert) {
		var iCount = 0;

		var oControl = {
			bindProperty: function(sName) {

			},
			getBindingInfo: function() {

			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			},
			getConfiguration: function() {
				return {
					getDisplayBehaviour: function() {
						return null;
					},
					getPreventInitialDataFetchInValueHelpDialog: function() {
						return false;
					}
				};
			},
			data: function(sKey) {

				if (sKey === "dateFormatSettings") {
					return null;
				}

				return "descriptionAndId";
			},
			addEventDelegate: function() {

			}
		};

		var oVHPStub = this.stub(sap.ui.comp.providers, "ValueHelpProvider").returns(function() {
			return {
				destroy: function() {}
			};
		});

		var oVLPStub = this.stub(sap.ui.comp.providers, "ValueListProvider").returns(function() {
			return {
				destroy: function() {}
			};
		});

		var oFactory = new ControlFactoryBase(this.oVHModel, oControl);
		var oMetaData = new ODataHelper(this.oVHModel);
		var oEntitySet = oMetaData.oMeta.getODataEntitySet("Headers");
		var oType = oMetaData.oMeta.getODataEntityType(oEntitySet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oEntitySet,
			path: "AccountingDocumentCategory"
		};

		oMetaData.getProperty(oMeta);
		var oAnnotation = "NameSpace.Entity/SomeProperty";
		oMeta.property["sap:value-list"] = "standard";
		var fnOnValueListChange = function(oEvent) {
			iCount++;
		};

		oFactory.createValueHelp({
			control: oControl,
			edmProperty: oMeta.property,
			valueHelp: {
				annotation: oAnnotation
			},
			model: this.oVHModel,
			onValueListChange: fnOnValueListChange
		});

		assert.strictEqual(oFactory._aProviders.length, 2);

		for (var i = 0; i < 2; i++) {
			oFactory._aProviders[i].fireEvent("valueListChanged", {
				"changes": {}
			});
		}

		assert.strictEqual(iCount, 2);

		// cleanup
		oFactory._aProviders = [];
		oVHPStub.restore();
		oVLPStub.restore();
		oMetaData.destroy();
		oFactory.destroy();
	});

	QUnit.test("shouldCreateValueHelpForControl method should return true", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: true
		});
		var oControl = new Control();
		oSmartField.setContent(oControl);
		var oFactory = new ControlFactoryBase(this.oVHModel, oSmartField);

		// act
		var bShouldCreateValueHelp = oFactory.shouldCreateValueHelpForControl(oControl);

		// assert
		assert.ok(bShouldCreateValueHelp);

		// cleanup
		oSmartField.destroy();
		oControl.destroy();
	});

	QUnit.test("shouldCreateValueHelpForControl method should return true", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			contextEditable: true
		});
		var oControl = new Control();
		oSmartField.setContent(oControl);
		var oFactory = new ControlFactoryBase(this.oVHModel, oSmartField);

		// act
		var bShouldCreateValueHelp = oFactory.shouldCreateValueHelpForControl(oControl);

		// assert
		assert.ok(bShouldCreateValueHelp);

		// cleanup
		oSmartField.destroy();
		oControl.destroy();
	});

	QUnit.test("shouldCreateValueHelpForControl method should return true", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: false
		});
		var oFactory = new ODataControlFactory(this.oVHModel, oSmartField);
		var oDisplayComboBox = oFactory._createDisplayedComboBox();
		oSmartField.setContent(oDisplayComboBox);

		// act
		var bShouldCreateValueHelp = oFactory.shouldCreateValueHelpForControl(oDisplayComboBox);

		// assert
		assert.ok(bShouldCreateValueHelp);

		// cleanup
		oSmartField.destroy();
		oDisplayComboBox.destroy();
	});

	QUnit.test("shouldCreateValueHelpForControl method should return false", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: false
		});
		var oControl = new Control();
		oSmartField.setContent(oControl);
		var oFactory = new ControlFactoryBase(this.oVHModel, oSmartField);

		// act
		var bShouldCreateValueHelp = oFactory.shouldCreateValueHelpForControl(oControl);

		// assert
		assert.notOk(bShouldCreateValueHelp);

		// cleanup
		oSmartField.destroy();
		oControl.destroy();
	});

	QUnit.test("shouldCreateValueHelpForControl method should return false", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			contextEditable: false
		});
		var oControl = new Control();
		oSmartField.setContent(oControl);
		var oFactory = new ControlFactoryBase(this.oVHModel, oSmartField);

		// act
		var bShouldCreateValueHelp = oFactory.shouldCreateValueHelpForControl(oControl);

		// assert
		assert.notOk(bShouldCreateValueHelp);

		// cleanup
		oSmartField.destroy();
		oControl.destroy();
	});

	QUnit.test("shouldCreateValueHelpForControl method should return false", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			contextEditable: true
		});
		var oFactory = new ControlFactoryBase(this.oVHModel, oSmartField);

		// act
		var bShouldCreateValueHelp = oFactory.shouldCreateValueHelpForControl(null);

		// assert
		assert.notOk(bShouldCreateValueHelp);

		// cleanup
		oSmartField.destroy();
	});

	 QUnit.test("addValueHelp - preventInitialDataFetch", function(assert) {
			var oMeta, oMetaData, oSet, oType, oFactory, fOnValueListChange, oAnnotation, oControl = {
				bindProperty: function(sName) {
					//assert.equal(sName, "enabled");
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
				getConfiguration: function() {
					return {
						getDisplayBehaviour: function() {
							return null;
						},
						getPreventInitialDataFetchInValueHelpDialog: function() {
							return false;
						}
					};
				},
				data: function(sKey) {
					if (sKey === "dateFormatSettings") {
						return null;
					}
					return "descriptionAndId";
				},
				addEventDelegate: function() {

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

			oFactory = new ControlFactoryBase(this.oVHModel, oControl);

			oMetaData = new ODataHelper(this.oVHModel);
			oSet = oMetaData.oMeta.getODataEntitySet("Headers");
			oType = oMetaData.oMeta.getODataEntityType(oSet.entityType);
			oMeta = {
				entityType: oType,
				entitySet: oSet,
				path: "AccountingDocumentCategory"
			};

			oMetaData.getProperty(oMeta);
			oAnnotation = "NameSpace.Entity/SomeProperty";
			oMeta.property["sap:value-list"] = "standard";

			oFactory.createValueHelp({
				control: oControl,
				edmProperty: oMeta.property,
				valueHelp: {
					annotation: oAnnotation
				},
				model: this.oVHModel,
				onValueListChange: fOnValueListChange
			});

			assert.equal(oFactory._aProviders[0].preventInitialDataFetchInValueHelpDialog, false);

			oFactory._aProviders = [];

			oVHPStub.restore();
			oVLPStub.restore();
			oMetaData.destroy();
			oFactory.destroy();
		});

	QUnit.test("addValueHelp - nothing created", function(assert) {
		var oFactory, oAnnotation, oControl = {
			bindProperty: function(sName) {
				//assert.equal(sName, "enabled");
			},
			setFilterSuggests: function() {

			},
			setShowValueHelp: function() {

			},
			setShowSuggestion: function() {

			}
		};
		oAnnotation = "Project/foo";
		oFactory = new ControlFactoryBase(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.createValueHelp({
			control: oControl,
			edmProperty: {},
			valueHelp: {
				annotation: oAnnotation
			}
		});

		assert.equal(oFactory._aProviders.length, 0);

		oFactory.destroy();
	});

	QUnit.test("getAttribute", function(assert) {
		var oFactory, oParent, oResult;

		oParent = {
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
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new ControlFactoryBase(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		oResult = oFactory.getAttribute("value");
		assert.equal(oResult, "StartDateTime");

		oResult = oFactory.getAttribute("width");
		assert.equal(oResult, "100%");

		oResult = oFactory.getAttribute("textAlign");
		assert.equal(!oResult, true);

		oFactory.destroy();
	});

	QUnit.test("createAttributes", function(assert) {
		var oFactory, oParent, oResult, bSelected, bExc, mNames;

		oParent = {
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
			fireChange: function(oParam) {
				bSelected = oParam.newValue;
			},
			getObjectBinding: function() {
				return {
					sPath: "binding"
				};
			},
			getBindingMode: function(sPropertyName) {},
			data: function() {}
		};
		oFactory = new ControlFactoryBase(this.oModel, oParent);
		oFactory._oTypes = {
			getType: function() {
				return "test";
			}
		};
		oFactory._oMetaData = {
			model: "Project",
			path: "StartDateTime"
		};
		mNames = {
			width: true,
			textAlign: true,
			placeholder: true,
			name: true
		};
		oResult = oFactory.createAttributes("value", null, mNames, {
			event: "select",
			parameter: "selected"
		});
		oResult.select({
			getParameters: function() {
				return {
					selected: true
				};
			}
		});
		assert.equal(bSelected, true);
		assert.equal(oResult.value.path, "StartDateTime");
		assert.equal(oResult.value.model, "Project");
		assert.equal(oResult.width, "100%");

		//check exception handling
		oParent.fireChange = function() {
			bExc = true;
			throw "exc";
		};
		try {
			oResult.select({
				getParameters: function() {
					return {
						selected: true
					};
				}
			});
		} catch (ex) {
			//should not happen
			bExc = false;
		}
		assert.equal(bExc, true);

		oFactory.destroy();
	});

	QUnit.test("mapBindings", function(assert) {
		var oFactory, oParent, mNames, mAttributes = {};

		oParent = {
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
			fireChange: function(oParam) {},
			getObjectBinding: function() {
				return {
					sPath: "binding"
				};
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new ControlFactoryBase(this.oModel, oParent);
		mNames = {
			"value": "value1",
			"width": "width1"
		};

		oFactory.mapBindings(mAttributes, mNames);
		assert.equal(typeof (mAttributes.value1), "object");
		assert.equal(mAttributes.width1, "100%");

		oFactory.destroy();
	});

	QUnit.test("getFormatSettings", function(assert) {
		var oFactory, oParent, mAttributes;

		oParent = {
			data: function() {
				return '\{"style":"long"\}';
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent);
		mAttributes = oFactory.getFormatSettings("dateFormatSettings");
		mAttributes = assert.equal(mAttributes.style, "long");

		oFactory.destroy();
	});

	QUnit.test("getFormatSettingst - broken", function(assert) {
		var oFactory, oParent, mAttributes = {};

		oParent = {
			data: function() {
				return '\{"style":long"\}';
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent);
		mAttributes = oFactory.getFormatSettings(mAttributes);
		assert.equal(!mAttributes, true);

		oFactory.destroy();
	});

	QUnit.test("getFormatSettingst - from config", function(assert) {
		var oFactory, oParent, mAttributes = {};

		oParent = {
			data: function() {
				return null;
			},
			getCustomData: function() {
				return [
					{
						getKey: function() {
							return "dateFormatSettings";
						},
						getValue: function() {
							return '\{"style":"long"\}';
						}
					}
				];
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent);
		mAttributes = oFactory.getFormatSettings("dateFormatSettings");
		assert.equal(mAttributes.style, "long");

		oFactory.destroy();
	});

	QUnit.test("_formatDisplayBehaviour", function(assert) {
		var oFactory, oParent, sReturn;

		oParent = {
			data: function() {
				return "idAndDescription";
			},
			getCustomData: function() {
				return [
					{
						getKey: function() {
							return "dateFormatSettings";
						},
						getValue: function() {
							return '\{"style":"long"\}';
						}
					}
				];
			},
			getConfiguration: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new ControlFactoryBase(this.oModel, oParent);
		sReturn = oFactory._formatDisplayBehaviour("defaultInputFieldDisplayBehaviour", "id", "descr");
		assert.equal(sReturn, "id (descr)");

		sReturn = oFactory._formatDisplayBehaviour("defaultCheckBoxDisplayBehaviour", "id");
		assert.ok(sReturn);

		oParent.data = function() {
			return "OnOff";
		};
		sReturn = oFactory._formatDisplayBehaviour("defaultCheckBoxDisplayBehaviour", "OnOff");
		assert.ok(sReturn);

		oParent.data = function() {
			return "TrueFalse";
		};
		sReturn = oFactory._formatDisplayBehaviour("defaultCheckBoxDisplayBehaviour", "TrueFalse");
		assert.ok(sReturn);

		oFactory.destroy();
	});

	QUnit.test("Shall be destructible", function(assert) {

		// arrange
		var bDestroy = false;
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
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		var oFactory = new ControlFactoryBase(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		var oProvider = {
			destroy: function() {
				bDestroy = true;
			}
		};

		oFactory._aProviders.push(oProvider);

		// act
		oFactory.destroy();

		// assert
		assert.ok(oFactory);
		assert.equal(oFactory._oParent, null);
		assert.equal(bDestroy, true);
	});

	QUnit.start();

});
