// jQuery.sap.require('sap.apf.testhelper.helper');
// jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
// jQuery.sap.require("sap.apf.core.request");

sap.ui.define([
	'sap/apf/testhelper/createComponentAsPromise',
	'sap/apf/testhelper/doubles/sessionHandlerStubbedAjax',
	'sap/apf/testhelper/doubles/request',
	'sap/apf/testhelper/doubles/messageHandler',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/stub/textResourceHandlerStub',
	'sap/apf/testhelper/config/sampleConfiguration',
	'sap/apf/testhelper/ushellHelper',
	'sap/apf/core/utils/filter'
], function(createComponentAsPromise,
			SessionHandlerStubbedAjax,
			RequestDouble,
			MessageHandlerDouble,
			MetadataDouble,
			textResourceHandlerStub,
			sampleConfiguration,
			ushellHelper,
			coreFilter
) {
	'use strict';

	MetadataDouble = MetadataDouble || sap.apf.testhelper.doubles.Metadata;
	RequestDouble = RequestDouble || sap.apf.testhelper.doubles.Request;

	QUnit.module("tComponentWithStep -- APF API", {
		beforeEach : function() {
			ushellHelper.setup();
			var that = this;
			that.spy = {};
			function coreProbe(dependencies) {
				that.oCoreProbe = dependencies;
			}
			this.componentDouble = {
					startupParameters : {
						'sap-apf-step-id' : [ 'stepTemplate1' ],
						'sap-apf-representation-id' : [ 'representationId' ]
					}
			};
			function update(callback){
			}
			function _afterApiCreation(apiProbe){
				that.oCoreApi = apiProbe.coreApi;
				that.oPath = that.oCoreProbe.path;
				that.spy.createStep = sinon.spy(that.oCoreApi, "createStep");
				that.spy.addStep = sinon.spy(that.oPath, "addStep");
				that.spy.update = sinon.stub(that.oPath, "update", update); // this isolates from the UI
			}
			this.createComponentWithParamAndApiAsPromise = function(context, componentData, afterApiCreation, mInject) {
				afterApiCreation = afterApiCreation || _afterApiCreation;
				mInject = mInject || {};
				var inject = {
					constructors : {
						SessionHandler : SessionHandlerStubbedAjax,
						Request : RequestDouble,
						Metadata : MetadataDouble
					},
					exits: {
						afterApiCreation: afterApiCreation.bind(this)
					},
					coreProbe: coreProbe
				};
				if (mInject.MessageHandler){
					inject.constructors.MessageHandler = mInject.MessageHandler
				}

				return createComponentAsPromise(context, {
					stubAjaxForResourcePaths : true,
					componentId : "Comp1",
					inject : inject,
					componentData : componentData
				});
			};
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(name){
				that.spy[name].restore();
			});
			// this.stubSBHandler.restore();
			ushellHelper.teardown();
			this.oCompContainer.destroy();

		}
	});
	QUnit.test("When one step is added on app startUp Then active step is the added step", function(assert) {
		var done = assert.async();
		var that = this;
		// prepare
		var startParams = that.componentDouble.startupParameters;
		function createFirstStep(stepId, repId, callback){
		}
		function afterApiCreation(apiProbe){
			that.oCoreApi = apiProbe.coreApi;
			that.spy.createFirstStep = sinon.stub(that.oCoreApi, "createFirstStep", createFirstStep);
		}
		// act
		this.createComponentWithParamAndApiAsPromise(this, this.componentDouble, afterApiCreation).done(function(){
			// check
			assert.notStrictEqual(this.oCoreApi, undefined, "the core instance is created");
			assert.strictEqual(that.oCoreApi.createFirstStep.callCount, 1, "THEN call core.instance.createFirstStep");
			assert.strictEqual(that.oCoreApi.createFirstStep.getCall(0).args[0], startParams['sap-apf-step-id'][0],
				"THEN step ID from start parameter");
			assert.strictEqual(that.oCoreApi.createFirstStep.getCall(0).args[1], startParams['sap-apf-representation-id'][0],
				"THEN representation ID from start parameter");
			done();
		}.bind(this));
	});
	QUnit.test("When no representation type set Then default representation is used", function(assert) {
		var done = assert.async();
		var that = this;
		// act
		this.createComponentWithParamAndApiAsPromise(this, this.componentDouble).done(function(){
			// check
			var addedStep = that.oCoreApi.createStep.returnValues[0];
			assert.strictEqual(that.oCoreApi.createStep.callCount, 1, "THEN call core.instance.createStep");
			assert.strictEqual(that.oPath.addStep.callCount, 1, "Then add path was called");
			assert.strictEqual(that.oPath.update.callCount, 1, "Then update was called");
			var oRepTyp = addedStep.getSelectedRepresentationInfo();
			assert.strictEqual(oRepTyp.representationId, "representationId1", "is default representation id");
			assert.strictEqual(oRepTyp.label.key, "Text1", "check label.key");
			assert.deepEqual(addedStep.getRepresentationInfo()[0], addedStep.getSelectedRepresentationInfo(), "repID not provide, first representation used by default");
			done();
		}.bind(this));
	});
	QUnit.test("When representation type is incompatible with selected step Then default representation is used", function(assert) {
		var done = assert.async();
		var that = this;
		// prepare
		var customComponentDouble = {
			startupParameters : {
				'sap-apf-step-id' : [ 'stepTemplate2' ],
				'sap-apf-representation-id' : [ 'hugo' ]
			}
		};
		// act
		this.createComponentWithParamAndApiAsPromise(this, customComponentDouble).done(function(){
			// check
			var addedStep = that.oCoreApi.createStep.returnValues[0];
			assert.strictEqual(that.oCoreApi.createStep.callCount, 1, "THEN call core.instance.createStep");
			var oRepTyp = addedStep.getSelectedRepresentationInfo();
			assert.strictEqual(oRepTyp.representationId, "representationId1", "is default representation id");
			done();
		}.bind(this));
	});
	QUnit.test("When representation type selected is compatible with selected step Then selected representation is used", function(assert) {
		var customComponentDouble = {
				startupParameters : {
					'sap-apf-step-id' : [ 'stepTemplate1' ],
					'sap-apf-representation-id' : [ 'representationId2' ]
				}
		};
		var done = assert.async();
		this.createComponentWithParamAndApiAsPromise(this, customComponentDouble).done(function(){
			var steps = this.oApi.getSteps();
			var firstStep = steps[0];
			var oRepTyp = firstStep.getSelectedRepresentationInfo();
			assert.equal(oRepTyp.representationId, "representationId2", "check representation id");
			assert.equal(oRepTyp.label.key, "Text2", "check label.key");
			done();
		}.bind(this));
	});
	QUnit.test('Method getAdditionalConfigurationProperties()', function(assert) {
		// must be extended if additional properties are added to a steptemplate, e.g. extension, exit etc.
		var done = assert.async();
		this.createComponentWithParamAndApiAsPromise(this, this.componentDouble).done(function(){
			var steps = this.oApi.getSteps();
			var firstStep = steps[0];
			var oAdditionalConfigurationProperties = firstStep.getAdditionalConfigurationProperties();
			assert.deepEqual(oAdditionalConfigurationProperties, {
				  "id": "stepTemplate1",
				  "longTitle": {
				    "key": "longTitleTest",
				    "kind": "text",
				    "type": "label"
				  },
				  "thumbnail": {
				    "leftLower": {
				      "key": "localTextReferenceStepTemplate1LeftLower",
				      "kind": "text",
				      "type": "label"
				    },
				    "leftUpper": {
				      "key": "localTextReferenceStepTemplate1LeftUpper",
				      "kind": "text",
				      "type": "label"
				    },
				    "rightLower": {
				      "key": "localTextReferenceStepTemplate1RightLower",
				      "kind": "text",
				      "type": "label"
				    },
				    "rightUpper": {
				      "key": "localTextReferenceStepTemplate1RightUpper",
				      "kind": "text",
				      "type": "label"
				    },
				    "type": "thumbnail"
				  },
				  "title": {
				    "key": "localTextReference2",
				    "kind": "text",
				    "type": "label"
				  },
				  "type": "step"
				}, "StepTemplate1 has correct additional configuration properties");
			done();
		}.bind(this));
	});
	QUnit.test('Method getFilter() of representation double for first step', function(assert) {
		var done = assert.async();
		this.createComponentWithParamAndApiAsPromise(this, this.componentDouble).done(function(){
			var steps = this.oApi.getSteps();
			var firstStep = steps[0];
			var oMessageHandler = new MessageHandlerDouble();
			oMessageHandler.check = function() {
				return null;
			};
			var oInternalFilter = firstStep.getFilter();
			var oInternalFilterCompare = new coreFilter(oMessageHandler, 'SAPClient', this.EQ, '777');
			assert.equal(oInternalFilter.isEqual(oInternalFilterCompare), true, "Method returns expected filter");
			done();
		}.bind(this));
	});
	QUnit.test('Invalid step ID puts message object', function(assert) {
		var customComponentDouble = {
				startupParameters : {
					'sap-apf-step-id' : [ 'myInvalidStep' ],
					'sap-apf-representation-id' : [ 'representationId2' ]
				}
		};
		function MessageHandlerStub() {
			assert.expect(1);
			this.setLifeTimePhaseStartup = function() {
			};
			this.setLifeTimePhaseRunning = function() {
			};
			this.setLifeTimePhaseShutdown = function() {
			};
			this.putMessage = function(messageObject) {
			};
			this.check = function() {
			};
			this.setTextResourceHandler = function() {
			};
			this.activateOnErrorHandling = function() {
			};
			this.loadConfig = function() {
			};
			this.setMessageCallback = function(fnCallback) {
			};
			this.isOwnException = function(error) {
				return (error && error.message && error.message.search("1972") > -1);
			};
			this.createMessageObject = function(rawMessageObject) {
				if (rawMessageObject.code === '5036') {
					assert.equal(rawMessageObject.code, '5036', "Correct message code exptected");
				}
			};
		}
		var inject = {
			MessageHandler: MessageHandlerStub
		};
		var done = assert.async();
		this.createComponentWithParamAndApiAsPromise(this, customComponentDouble, undefined, inject).done(function(){
			done();
		});
	});
});

