/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/JSONControlFactory",
	"sap/ui/model/json/JSONModel",
	"sap/m/Input"
], function(
		JSONControlFactory,
		JSONModel,
		Input) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfield.JSONControlFactory", {
		beforeEach: function() {
			this.oModel = sinon.createStubInstance(JSONModel);
		},
		afterEach: function() {

		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		var oFactory, oParent;
		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
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
			getEditable : function() {
				return false;
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
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new JSONControlFactory(this.oModel, oParent);
		assert.ok(oFactory);

		oFactory.destroy();
	});

	QUnit.test("_getCreator", function(assert) {
		var oFactory, sMethod, oParent, sType;

		oParent = {
			getEditable : function() {
				return true;
			},
			getEnabled : function() {
				return true;
			},
			getJsontype : function() {
				return sType;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new JSONControlFactory(this.oModel, oParent, {});

		sType = "String";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createString");

		sType = "Integer";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createString");

		sType = "Float";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createString");

		sType = "Date";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createDate");

		sType = "DateTime";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createString");

		sType = "Boolean";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createBoolean");

		oFactory._oParent.getEditable = function() {
			return false;
		};

		sType = "DateTime";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createDisplay");

		sType = "Boolean";
		sMethod = oFactory._getCreator();
		assert.equal(sMethod, "_createBoolean");

		oFactory.destroy();
	});

	QUnit.test("_createString : String", function(assert) {
		var oFactory, oControl, oParent;

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return null;
			},
			data : function() {
				return null;
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
			getJsontype : function() {
				return "String";
			},
			getMaxLength: function() {
				return 0;
			},
			getShowValueHelp: function() {
				return false;
			},
			getShowSuggestion: function() {
				return true;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new JSONControlFactory(this.oModel, oParent, { path : "path", model : null });

		oControl = oFactory._createString();
		assert.equal(oControl.control instanceof Input, true);
		assert.equal(oControl.onCreate, "_onCreate");

		oFactory.destroy();
	});

	QUnit.test("_createString: Integer", function(assert) {
		var oFactory, oControl, oParent;

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return null;
			},
			data : function() {
				return null;
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
			getJsontype : function() {
				return "Integer";
			},
			getMaxLength: function() {
				return 0;
			},
			getShowValueHelp: function() {
				return false;
			},
			getShowSuggestion: function() {
				return true;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new JSONControlFactory(this.oModel, oParent, { path : "path", model : null });

		oControl = oFactory._createString();
		assert.equal(oControl.control instanceof Input, true);
		assert.equal(oControl.onCreate, "_onCreate");

		oFactory.destroy();
	});

	QUnit.test("_createString: Float", function(assert) {
		var oFactory, oControl, oParent;

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return null;
			},
			data : function() {
				return null;
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
			getJsontype : function() {
				return "Float";
			},
			getMaxLength: function() {
				return 0;
			},
			getShowValueHelp: function() {
				return false;
			},
			getShowSuggestion: function() {
				return true;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		oFactory = new JSONControlFactory(this.oModel, oParent, { path : "path", model : null });

		oControl = oFactory._createString();
		assert.equal(oControl.control instanceof Input, true);
		assert.equal(oControl.onCreate, "_onCreate");

		oFactory.destroy();
	});

	QUnit.test("_createString returning a combo box", function(assert) {
		var oFactory, oControl, oParent;

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return null;
			},
			data : function(sName) {
				if (sName === "hasValueHelpDialog") {
					return "false";
				}

				if (sName === "controlType") {
					return "dropDownList";
				}

				return null;
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
			getJsontype : function() {
				return "String";
			},
			getShowValueHelp: function() {
				return false;
			},
			getShowSuggestion: function() {
				return true;
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new JSONControlFactory(this.oModel, oParent, { path : "path", model : null });
		oControl = oFactory._createString();

		assert.ok(oControl.control && oControl.control.isA("sap.m.ComboBox"));

		oFactory.destroy();
	});

	QUnit.test("_createDate", function(assert) {
		var oFactory, oControl, oParent;

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return null;
			},
			data : function() {
				return null;
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
			getJsontype : function() {
				return "Date";
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new JSONControlFactory(this.oModel, oParent, { path : "path", model : null });

		oControl = oFactory._createDate();
		assert.ok(oControl.control && oControl.control.isA("sap.m.DatePicker"));
		assert.equal(oControl.onCreate, "_onCreate");

		oFactory.destroy();
	});

	QUnit.test("_createBoolean", function(assert) {
		var oFactory, oControl, oParent;

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return null;
			},
			data : function() {
				return null;
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
			getEditable : function() {
				return false;
			},
			getEnabled : function() {
				return false;
			},
			getJsontype : function() {
				return "Boolean";
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new JSONControlFactory(this.oModel, oParent, { path : "path", model : null });

		oControl = oFactory._createBoolean();
		assert.ok(oControl.control && oControl.control.isA("sap.m.CheckBox"));
		assert.equal(oControl.onCreate, "_onCreate");

		oFactory.destroy();
	});

	QUnit.test("_createDisplay", function(assert) {
		var oFactory, oControl, oParent;

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(id1='71' id2='abcd')"
				};
			},
			getModel : function() {
				return this.oModel;
			},
			getBindingInfo : function() {
				return null;
			},
			data : function() {
				return null;
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
			getJsontype : function() {
				return "String";
			},
			getObjectBinding: function() {
				return null;
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};
		oFactory = new JSONControlFactory(this.oModel, oParent, { path : "path", model : null });

		oControl = oFactory._createDisplay();
		assert.ok(oControl.control && oControl.control.isA("sap.m.Text"));
		assert.equal(!oControl.onCreate, true);

		oFactory.destroy();
	});

	QUnit.test("_onCreate", function(assert) {
		var oFactory, mParams, oControl = {
			bindProperty : function(sName) {

			},
			setFilterSuggests : function() {

			},
			setShowValueHelp : function() {

			},
			setShowSuggestion : function() {

			},
			attachFormatError : function() {

			},
			attachParseError : function() {

			},
			attachValidationError : function() {

			},
			attachValidationSuccess : function() {

			},
			getValue : function() {
				return "testValue";
			},
			getBindingMode: function(sPropertyName) {
				return sPropertyName;
			}
		};

		mParams = {
			getValue : "getValue"
		};
		oFactory = new JSONControlFactory(this.oModel, oControl, { path : "path", model : null });
		oFactory._onCreate(oControl, mParams);
		assert.equal(mParams.getValue(), "testValue");
		assert.equal(oFactory._aProviders.length, 0);

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
					}
				};
		oFactory = new JSONControlFactory(this.oModel, oParent);
		oProvider = {
			destroy : function() {
				bDestroy = true;
			}
		};
		oFactory._aProviders.push(oProvider);
		oFactory.destroy();
		assert.ok(oFactory);
		assert.equal(oFactory._oParent, null);
		assert.equal(bDestroy, true);
	});

	QUnit.start();

});
