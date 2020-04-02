/*global QUnit,sinon*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiedit.Container", [
	"sap/ui/thirdparty/jquery",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/core/Title",
	"sap/ui/layout/form/FormLayout",
	"sap/ui/layout/form/FormContainer",
	"sap/ui/layout/form/FormElement",
	"sap/ui/comp/smartmultiedit/Field",
	"sap/m/Label",
	"sap/m/Input",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartmultiedit/Container",
	"sap/ui/model/Context"
], function (jQuery, SmartForm, Title, FormLayout, FormContainer, FormElement, Field, Label, Input,
			 Group, GroupElement, Container, Context) {
	"use strict";

	function createForm(createMultiFields) {
		return new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [createMultiFields ? new Field({propertyName: "test"}) : null]
						}),
						new GroupElement({
							elements: [createMultiFields ? new Field({propertyName: "test"}) : null]
						}),
						new GroupElement({
							elements: [createMultiFields ? new Input() : null]
						})
					]
				})
			]
		});
	}

	QUnit.module("Default Values", {
		beforeEach: function () {
			this.oContainer = new Container();
		},
		afterEach: function () {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Properties", function (assert) {
		assert.equal(this.oContainer.getEntitySet(), "", "Default value for property 'entitySet' is correct");
		assert.deepEqual(this.oContainer.getContexts(), [], "Default value for property 'contexts' is correct");
	});

	QUnit.test("Aggregation", function (assert) {
		assert.equal(this.oContainer.getLayout(), null, "Default value for aggregation 'layout' is correct");
	});

	QUnit.module("Overridden setter functions", {
		beforeEach: function () {
			this.oContainer = new Container({
				entitySet: "myType"
			});
			this.oBindingContext = new Context();
			this.aContext = [
				this.oBindingContext
			];
		},
		afterEach: function () {
			this.oContainer.destroy();
			this.oBindingContext.destroy();
		}
	});

	QUnit.test("Function 'setContext' returns instance", function (assert) {
		//Act
		var oResult = this.oContainer.setContexts();
		//Assert
		assert.deepEqual(this.oContainer, oResult, "Instance is returned");
	});

	QUnit.test("Function 'setContext' sets property correctly", function (assert) {
		//Act
		this.oContainer.setContexts(this.aContext);
		//Assert
		assert.deepEqual(this.oContainer.getContexts(), this.aContext, "Property value is set");
		assert.notOk(this.oContainer.isInvalidateSuppressed(), "No invalidation happens");
	});

	QUnit.test("Function 'setContext' does nothing in case no array is passed", function (assert) {
		//Act
		this.oContainer.setContexts("otto");
		//Assert
		assert.deepEqual(this.oContainer.getContexts(), [], "Property value is default");
	});

	QUnit.test("Function 'setContext' does nothing in case no sap.ui.model.Contexts are passed", function (assert) {
		//Act
		this.oContainer.setContexts([
			this.oContext, "otto"
		]);
		//Assert
		assert.deepEqual(this.oContainer.getContexts(), [], "Property value is default");
	});

	QUnit.test("Function 'setEntitySet' with null", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oContainer, "_initializeMetadata");
		//Act
		this.oContainer.setEntitySet("");
		//Assert
		assert.ok(oSpy.notCalled, "The method _initializeMetadata is not called when the entitySet is null");
	});

	QUnit.test("Function 'setEntitySet' with a new type", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oContainer, "_initializeMetadata");
		//Act
		var oContainer = this.oContainer.setEntitySet("newType");
		//Assert
		assert.deepEqual(oContainer, this.oContainer, "Instance is returned");
		assert.ok(oSpy.calledOnce, "The method _initializeMetadata is called when the entitySet is changed");
	});

	QUnit.test("Function 'setEntitySet' with the same type", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oContainer, "_initializeMetadata");
		//Act
		var oContainer = this.oContainer.setEntitySet("myType");
		//Assert
		assert.deepEqual(oContainer, this.oContainer, "Instance is returned");
		assert.ok(oSpy.notCalled, "The method _initializeMetadata is not called when the entitySet is not changed");
	});

	QUnit.module("Public method 'getAllUpdatedContexts'", {
		beforeEach: function () {
			this.oContainer = new Container();
		},
		afterEach: function () {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Returns a Promise when there are no contexts", function (assert) {
		var done = assert.async();
		this.oContainer.getAllUpdatedContexts().then(function (result) {
			assert.equal(result.length, 0, "An empty array is returned");
			done();
		});
	});

	QUnit.test("Returns a Promise for less than 10 contexts", function (assert) {
		//Arrange
		var aContexts = [new Context(), new Context()];
		sinon.stub(this.oContainer, "getContexts").returns(aContexts);
		sinon.stub(aContexts[0], "getObject").returns({});
		sinon.stub(aContexts[1], "getObject").returns({});
		sinon.stub(this.oContainer, "_getUpdatedDataObject").returns({"oDataProperty": "updatedValue"});
		//Act
		var done = assert.async();
		this.oContainer.getAllUpdatedContexts().then(function (result) {
			//Assert
			assert.equal(result.length, 2, "Result includes 2 contexts");
			assert.deepEqual(result[0].context, aContexts[0], "The context object is included in the first context");
			assert.deepEqual(result[1].context, aContexts[1], "The context object is included in the second context");
			assert.deepEqual(result[0].data, {"oDataProperty": "updatedValue"}, "The data object is included in the first context");
			assert.deepEqual(result[1].data, {"oDataProperty": "updatedValue"}, "The data object is included in the second context");
			done();
		});
		//Cleanup
		aContexts[0].destroy();
		aContexts[1].destroy();
	});

	QUnit.test("Returns a Promise for large number of contexts", function (assert) {
		//Arrange
		var aContexts = [];
		var obj = {
			getObject: function () {
			}
		};
		for (var i = 0; i < 30; i++) {
			aContexts.push(obj);
		}
		sinon.stub(this.oContainer, "getContexts").returns(aContexts);
		sinon.stub(this.oContainer, "_getUpdatedDataObject").returns({"oDataProperty": "updatedValue"});
		var fnOriginalDelayedCall = window.setTimeout;
		window.setTimeout = function (callback) {
			if (jQuery.isFunction(callback)) {
				callback.apply(this);
			}
		};
		var oSpy = sinon.spy(window, "setTimeout");
		//Act
		var done = assert.async();
		this.oContainer.getAllUpdatedContexts().then(function (result) {
			//Assert
			assert.equal(oSpy.callCount, 2, "Delayedcall is called twice in case of 30 context objects");
			assert.equal(result.length, 30, "30 context objects are resolved");
			done();
		});
		//Cleanup
		oSpy.restore();
		window.setTimeout  = fnOriginalDelayedCall;
	});

	QUnit.module("Private method '_getFields'", {
		beforeEach: function () {
			this.oForm = createForm(true);
			this.oContainer = new Container();
		},
		afterEach: function () {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Returns all fields inside an array", function (assert) {
		//Arrange
		this.oContainer.setLayout(this.oForm);
		//Assert
		assert.equal(this.oContainer._getFields().length, 2, "Two fields returned");
	});

	QUnit.test("Returns only smartmultiedit.Field instances", function (assert) {
		//Arrange
		this.oContainer.setLayout(this.oForm);
		//Act
		var aResult = this.oContainer._getFields();
		//Assert
		for (var i = 0; i < aResult.length; i++) {
			assert.equal(aResult[i].getMetadata().getName(), "sap.ui.comp.smartmultiedit.Field", "Field instance returned");
		}
	});

	QUnit.test("Returns empty array if no smartmultiedit.Fields included", function (assert) {
		//Arrange
		this.oForm.destroyGroups();
		this.oContainer.setLayout(this.oForm);
		//Assert
		assert.equal(this.oContainer._getFields().length, 0, "Empty array returned");
	});

	QUnit.test("The search for smartmultiedit.Field instances is not performed", function (assert) {
		//Arrange
		this.oContainer.setLayout(this.oForm);
		var oSpy = sinon.spy(this.oForm, "getGroups");
		//Act
		var aResult = this.oContainer._getFields();
		//Assert
		assert.deepEqual(this.oContainer._getFields(), aResult, "Same array is returned");
		assert.equal(oSpy.callCount, 0, "Groups are not traveled");
	});

	QUnit.test("Label and field association", function (assert) {
		//Arrange
		this.oContainer.setLayout(this.oForm);

		//Act
		var aGroupElements = this.oForm.getGroups()[0].getGroupElements();

		//Assert
		aGroupElements.forEach(function (oGroupElement) {
			var oField = oGroupElement.getFields()[0];
			if (oField instanceof Field) {
				assert.equal(oField.getLabel().getLabelFor(), oField.getSmartField().getId(),
					"Label has association with field");
			}
		});
	});

	QUnit.module("Private method _getUpdatedDataObject", {
		beforeEach: function () {
			this.oContainer = new Container();
		},
		afterEach: function () {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Copy of data object", function (assert) {
		//Arrange
		var oDataObject = {"key1": "value1", "key2": "value2"};
		sinon.stub(this.oContainer, "_getFields").returns([]);
		//Act
		var oCopiedObject = this.oContainer._getUpdatedDataObject(oDataObject);
		//Assert
		assert.notEqual(oCopiedObject, oDataObject, "The references do not point to the same object.");
	});

	QUnit.test("Update data object when merge is true", function (assert) {
		//Arrange
		var aFields = [
			new Field({
				propertyName: "key1"
			}),
			new Field({
				propertyName: "key2"
			})
		];
		sinon.stub(aFields[0], "getRawValue").returns({key1: "value3"});
		sinon.stub(aFields[1], "getRawValue").returns({key2: "value4"});
		sinon.stub(this.oContainer, "_getFields").returns(aFields);
		aFields[0]._oAnnotations = {uom: {path: "testpath"}};
		aFields[1]._oAnnotations = {uom: {path: "testpath"}};
		var oDataObject = {"key1": "value1", "key2": "value2"};
		//Act
		var oUpdatedObj = this.oContainer._getUpdatedDataObject(oDataObject, true);
		//Assert
		assert.equal(oUpdatedObj["key1"], "value3", "The value is updated");
		assert.equal(oUpdatedObj["key2"], "value4", "The value is updated");
		assert.equal(oDataObject["key1"], "value1", "The original obj is not modified");
		assert.equal(oDataObject["key2"], "value2", "The original obj is not modified");
		//Cleanup
		aFields[0].destroy();
		aFields[1].destroy();
	});

	QUnit.test("Update data object when merge is false", function (assert) {
		//Arrange
		var aFields = [
			new Field({
				propertyName: "myKey"
			})
		];
		sinon.stub(aFields[0], "getRawValue").returns({myKey: "newValue"});
		sinon.stub(this.oContainer, "_getFields").returns(aFields);
		aFields[0]._oAnnotations = {uom: {path: "testpath"}};
		var oDataObject = {"myKey": "myValue", "key1": "value1", "key2": "value2"};
		//Act
		var oUpdatedObj = this.oContainer._getUpdatedDataObject(oDataObject, false);
		//Assert
		assert.equal(oUpdatedObj["myKey"], "newValue", "The value is updated");
		assert.notOk(oUpdatedObj.hasOwnProperty("key1"), "Unmodified property is not included");
		assert.notOk(oUpdatedObj.hasOwnProperty("key2"), "Unmodified property is not included");
	});

	QUnit.module("Private method _initializeMetadata", {
		beforeEach: function () {
			var that = this;

			this.oContainer = new Container();
			var promise = {
				then: function () {
				}
			};
			this.oSpy = sinon.spy(promise, "then");
			this.oStub = sinon.stub(this.oContainer, "getModel").returns({
				getMetadata: function () {
					return {
						getName: function () {
							return "sap.ui.model.odata.v2.ODataModel";
						}
					};
				},
				getMetaModel: function () {
					return {
						loaded: function () {
							return promise;
						}
					};
				},
				createEntry: function() {
					return that.oContainer;
				},
				deleteCreatedEntry: function() {
					return true;
				},
				getBindingContext: function() {
					return that.oContainer;
				}
			});
		},
		afterEach: function () {
			this.oContainer.destroy();
			this.oContainer = null;
			this.oSpy.restore();
		}
	});

	QUnit.test("Metadata already initialized, entitySet is set", function (assert) {
		//Arrange
		this.oContainer._bIsInitialized = true;
		//Act
		this.oContainer.setEntitySet("myEntitySet");
		//Assert
		assert.ok(this.oSpy.notCalled, "Method _onMetadataInitialized is not called.");
	});

	QUnit.test("Metadata not yet initialized, entitySet is set", function (assert) {
		//Act
		this.oContainer.setEntitySet("myEntitySet");
		//Assert
		assert.ok(this.oSpy.calledTwice, "Method _onMetadataInitialized is called.");
	});

	QUnit.test("Metadata not yet initialized, entitySet is not set", function (assert) {
		//Act
		this.oContainer._initializeMetadata();
		//Assert
		assert.ok(this.oSpy.notCalled, "Method _onMetadataInitialized is not called.");
	});

	QUnit.test("Metadata not yet initialized, entitySet is set, no OData model available", function (assert) {
		//Arrange
		this.oStub.restore();
		sinon.stub(this.oContainer, "getModel").returns(null);
		var oSpy = sinon.spy(this.oContainer, "_onMetadataInitialized");
		//Act
		this.oContainer.setEntitySet("myEntitySet");
		//Assert
		assert.ok(oSpy.notCalled, "Method _onMetadataInitialized is not called.");
	});

	QUnit.module("Private method _onMetadataInitialized", {
		beforeEach: function () {
			this.oContainer = new Container({
				entitySet: "Meetups"
			}).placeAt("content");
		},
		afterEach: function () {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Container is not invalidated when already initialized", function (assert) {
		//Arrange
		var aFields = [new Field()];
		var oSpy = sinon.spy(aFields[0], "invalidate");
		sinon.stub(this.oContainer, "_getFields").returns(aFields);
		this.oContainer._bIsInitialized = true;
		//Act
		this.oContainer._onMetadataInitialized();
		//Assert
		assert.ok(oSpy.notCalled, "The container is not invalidated");
		//Cleanup
		aFields[0].destroy();
	});

	QUnit.module("Control init");

	QUnit.test("Attach to event 'modelContextChange'", function (assert) {
		//Arrange
		var oSpy = sinon.spy(Container.prototype, "attachEvent");
		//Act
		var oContainer = new Container();
		//Assert
		assert.ok(oSpy.calledWith("modelContextChange", Container.prototype._initializeMetadata, oContainer), "Event correctly attached");
		//Cleanup
		oSpy.restore();
		oContainer.destroy();
	});

	QUnit.module("Private method 'indexField'", {
		beforeEach: function () {
			this.oMultiEditField = new Field();
			this.oContainer = new Container();
			this.oContainer._aFields = [];
		},
		afterEach: function () {
			this.oMultiEditField.destroy();
			this.oContainer.destroy();
		}
	});

	QUnit.test("Index field of type 'sap.ui.comp.smartmultiedit.Field' at container", function (assert) {
		//Act
		this.oContainer.indexField(this.oMultiEditField);

		//Assert
		assert.equal(this.oContainer._aFields.length, 1, "Valid field was indexed");
	});

	QUnit.test("Do not index field of other types", function (assert) {
		// Arrange
		var oFakeField = {
			"id": "fakeField"
		};

		//Act
		this.oContainer.indexField(oFakeField);

		//Assert
		assert.equal(this.oContainer._aFields.length, 0, "Invalid field was not indexed");
	});

	QUnit.module("Private method '_refreshFields'", {
		beforeEach: function () {
			this.oMultiEditField = new Field();
			this.oContainer = new Container();
			this.oContainer._aFields = [{}, {}, {}];
		},
		afterEach: function () {
			this.oMultiEditField.destroy();
			this.oContainer.destroy();
		}
	});

	QUnit.test("Nullify internal fields and execute _getFields", function (assert) {
		// Arrange
		var oStub = sinon.stub(this.oContainer, "_getFields");

		// Act
		this.oContainer._refreshFields();

		// Assert
		assert.strictEqual(this.oContainer._aFields, null, "Internal fields should be reset to null.");
		assert.ok(oStub.calledOnce, "_getFields function should be called once from _refreshFields function.");
	});

});
