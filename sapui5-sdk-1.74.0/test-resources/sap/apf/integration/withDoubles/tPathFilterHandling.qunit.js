/*global sap, jQuery sinon OData */
(function() {
	'use strict';
	jQuery.sap.declare("sap.apf.integration.withDoubles.tPathFilterHandling");
	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.require('sap.apf.testhelper.odata.savedPaths');
	jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
	jQuery.sap.require('sap.apf.testhelper.doubles.request');
	jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');

	function commonSetup(oContext, assert) {
		var done = assert.async();
		var inject = {
				constructors : {
					SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
					Metadata : sap.apf.testhelper.doubles.Metadata,
					Request : sap.apf.testhelper.doubles.Request,
					ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
				}
		};
		sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
			this.oMessageHandler.loadConfig(this.getApfMessages(), true);
			this.oMessageHandler.loadConfig(this.getAppMessages());
			var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
		};
		sap.apf.testhelper.createComponentAsPromise(oContext, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : inject}).done(function(){

					oContext.oApi.resetPath();
					oContext.bUpdateHasBeenCalled = false;
					oContext.oStepFromUpdate = undefined;
					oContext.callbackForUpdatePath = function(oStep) {
						oContext.bUpdateHasBeenCalled = true;
						oContext.oStepFromUpdate = oStep;
					};
					done();
				});
	}

	QUnit.module('PFH Story 1 with request test double', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		createThreeSteps : function() {
			this.oStep1 = this.oApi.createStep("stepTemplate1", function() {
				return null;
			});
			this.oStep2 = this.oApi.createStep("stepTemplate3", function() {
				return null;
			});
			this.oStep3 = this.oApi.createStep("stepTemplate1", function() {
				return null;
			});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('Preparation test - step created with the second representation', function(assert) {
		this.oApi.createStep('stepTemplate1', function() {
			return null;
		}, "representationId2");
		var oStep = this.oApi.getSteps()[0];
		assert.equal(oStep.getSelectedRepresentationInfo().representationId, "representationId2", "The second representation is expected");
	});
	QUnit.test('Preparation test - one step with request double returning sample service data without any filter', function(assert) {
		var done = assert.async();
		assert.expect(2);
		this.oApi.resetPath();
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		var oOnlyStepInPath = this.oApi.getSteps()[0];
		var fnStepProcessedCallback = function(oStep) {
			assert.equal(oStep, oOnlyStepInPath, 'Returned step is the step in the path');
			assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, 11, 'Sample data array containing 10 entries expected');
			done();
		};
		this.oApi.updatePath(fnStepProcessedCallback);
	});
	// test with request and metadata double
	QUnit.test("Path with 3 steps without selection, change selection and test filter propagation", function(assert) {
		var updatePathCallback = this.callbackForUpdatePath;
		// build path with three steps
		this.oApi.resetPath();
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate3", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		// change selection on the second step
		var aSteps = this.oApi.getSteps();
		// remember data response of representation of first and last step
		var aDataOfFirstStepRepresentationBeforeSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		var aDataOfLastStepRepresentationBeforeSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		var oStepToChangeSelection = aSteps[1];
		var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		// set selection strategy of second step to "coCode1000Cust1001_1002"
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(this.bUpdateHasBeenCalled, true, "Update callback has returned");
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length < aDataOfLastStepRepresentationBeforeSelectionChange.length, true, "Additional filter reduced data of last step");
		// set selection strategy of second step to "coCode1000Cust1001"	
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange2 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange2.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "Also no change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange2 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange2.length < aDataOfLastStepRepresentationAfterSelectionChange.length, true, "Additional filter reduced data of last step after 2nd reduction");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange2.length, 1, "only one data record expected according to test data");
		// set selection strategy of second step to "coCode1000Cust1001_2_1004 = [1001 .. 1004]
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange3 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange3.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "Also no change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange3 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange3.length > aDataOfLastStepRepresentationAfterSelectionChange2.length, true, "Change of filter increased data of last step after 2nd reduction");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange3.length, 4, "Four data records expected according to test data");
	});
	QUnit.test("Callback for update indicates refresh", function(assert) {
		var that = this;
		assert.expect(6);
		this.oApi.resetPath();
		this.createThreeSteps();
		this.oStep1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		function assertStepsUpdated(oStep, bStepUpdated) {
			switch (oStep) {
			case that.oStep1:
				assert.ok(!bStepUpdated, 'Step 1 must not be updated');
				break;
			case that.oStep2:
				assert.ok(bStepUpdated, 'Step 2 must be updated');
				break;
			case that.oStep3:
				assert.ok(bStepUpdated, 'Step 3 must be updated');
				break;
			}
		}
		function assertStepsNotUpdated(oStep, bStepUpdated) {
			switch (oStep) {
			case that.oStep1:
				assert.ok(!bStepUpdated, 'Step 1 must not be updated');
				break;
			case that.oStep2:
				assert.ok(!bStepUpdated, 'Step 2 must not be updated');
				break;
			case that.oStep3:
				assert.ok(!bStepUpdated, 'Step 3 must not be updated');
				break;
			}
		}
		this.oApi.updatePath(assertStepsUpdated.bind(this));
		this.oApi.updatePath(assertStepsNotUpdated.bind(this));
	});
	QUnit.module('PFH Story 2 with request test double', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	//-----------------------------------------------------------------------
	//test with request and metadata double
	QUnit.test("Path with first step with selection and 2 further steps with initial 'all' selection, change selection and test filter update", function(assert) {
		this.oApi.resetPath();
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate3", function() {
			return null;
		});
		var aSteps = this.oApi.getSteps();
		var oFirstStep = aSteps[0];
		var oFirstStepRepresentation = oFirstStep.getSelectedRepresentation();
		var updatePathCallback = this.callbackForUpdatePath;
		var aDataOfFirstStepRepresentationBeforeSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		var aDataOfLastStepRepresentationBeforeSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		// set selection on the first step to customers [1001 .. 1004]
		oFirstStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange.length < aDataOfLastStepRepresentationBeforeSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 4, "4 data records expected according to test data set");
		// further change on path: change the selection on the second step: restrict on customer 1001 and 1002
		var oStepToChangeSelection = aSteps[1];
		var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange2 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange2.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange2 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange2.length < aDataOfLastStepRepresentationAfterSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange2.length, 2, "2 data records expected according to test data set");
		// further change on path: change the selection on the second step: restrict on customer 1001 
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange3 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange3.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange3 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange3.length < aDataOfLastStepRepresentationAfterSelectionChange2.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange3.length, 1, "1 data record expected according to test data set");
	});
	//-----------------------------------------------------------------------
	QUnit.module('PFH Story 3 with request test double', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	//-----------------------------------------------------------------------
	QUnit.test("Path with first step with selection and 2 further steps with a selection, change selection and test filter update", function(assert) {
		this.oApi.resetPath();
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate3", function() {
			return null;
		});
		var aSteps = this.oApi.getSteps();
		var oFirstStep = aSteps[0];
		var oFirstStepRepresentation = oFirstStep.getSelectedRepresentation();
		var updatePathCallback = this.callbackForUpdatePath;
		var aDataOfFirstStepRepresentationBeforeSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		var aDataOfLastStepRepresentationBeforeSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		// set selection on the first step to customers [1001 .. 1004]
		oFirstStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange.length < aDataOfLastStepRepresentationBeforeSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 4, "4 data records expected according to test data set");
		// further change on path: change the selection on the second step: restrict on customer 1001 and 1002
		var oStepToChangeSelection = aSteps[1];
		var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange2 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange2.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange2 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange2.length < aDataOfLastStepRepresentationAfterSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange2.length, 2, "2 data records expected according to test data set");
		// further change on path: change the selection on the first step: restrict on customer 1001 
		oFirstStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange3 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange3.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange3 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange3.length < aDataOfLastStepRepresentationAfterSelectionChange2.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange3.length, 1, "1 data record expected according to test data set");
		// create filter on last step and do update - should not matter at all
		oRepresentation = aSteps[2].getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfLastStepRepresentationAfterSelectionChange4 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange4.length, 1, "1 data record expected according to test data set");
	});
	QUnit.module('PFH Story 4 with request test double', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Path with first step with selection and 2 further steps with a selection, delete step in middle, which has a selection and test filter update", function(assert) {
		this.oApi.resetPath();
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate3", function() {
			return null;
		});
		var aSteps = this.oApi.getSteps();
		var oFirstStep = aSteps[0];
		var oFirstStepRepresentation = oFirstStep.getSelectedRepresentation();
		var updatePathCallback = this.callbackForUpdatePath;
		var aDataOfFirstStepRepresentationBeforeSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		var aDataOfLastStepRepresentationBeforeSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		// set selection on the first step to customers [1001 .. 1004]
		oFirstStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange.length < aDataOfLastStepRepresentationBeforeSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 4, "4 data records expected according to test data set");
		// further change on path: change the selection on the second step: restrict on customer 1001 and 1002
		var oStepToChangeSelection = aSteps[1];
		var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange2 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange2.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange2 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange2.length < aDataOfLastStepRepresentationAfterSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange2.length, 2, "2 data records expected according to test data set");
		// further change on path: delete second step: restriction on last step should be [1001 .. 1004] 
		this.oApi.removeStep(aSteps[1], updatePathCallback);
		aSteps = this.oApi.getSteps();
		var aDataOfFirstStepRepresentationAfterSelectionChange3 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange3.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange3 = aSteps[1].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange3.length, 4, "4 data record expected according to test data set");
	});
	QUnit.module('PFH Story 5 with request test double', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Path with first step with selection and 2 further steps with a selection, move step in middle to last position, which has a selection and test filter update", function(assert) {
		this.oApi.resetPath();
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate3", function() {
			return null;
		});
		var aSteps = this.oApi.getSteps();
		var oFirstStep = aSteps[0];
		var oFirstStepRepresentation = oFirstStep.getSelectedRepresentation();
		var updatePathCallback = this.callbackForUpdatePath;
		var aDataOfFirstStepRepresentationBeforeSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		var aDataOfLastStepRepresentationBeforeSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		// set selection on the first step to customers [1001 .. 1004]
		oFirstStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange.length < aDataOfLastStepRepresentationBeforeSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 4, "4 data records expected according to test data set");
		// further change on path: change the selection on the second step: restrict on customer 1001 and 1002
		var oStepToChangeSelection = aSteps[1];
		var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		// additionally change strategy on last step
		oStepToChangeSelection = aSteps[2];
		oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange2 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange2.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange2 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange2.length < aDataOfLastStepRepresentationAfterSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange2.length, 2, "2 data records expected according to test data set");
		// further change on path: move second step: restriction on last step should be [1001 .. 1004] 
		this.oApi.moveStepToPosition(aSteps[1], 2, updatePathCallback);
		aSteps = this.oApi.getSteps();
		var aDataOfFirstStepRepresentationAfterSelectionChange3 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange3.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		// step 2 is now on position 1 in path
		var aDataOfStep2RepresentationAfterSelectionChange3 = aSteps[1].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfStep2RepresentationAfterSelectionChange3.length, 4, "4 data record expected according to test data set");
		//  step 1 is now on position 2
		var aDataOfStep1RepresentationAfterSelectionChange3 = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfStep1RepresentationAfterSelectionChange3.length, 1, "1 data record expected according to test data set");
	});
	QUnit.test("Path with 4 steps - move last step to 2nd position", function(assert) {
		var updatePathCallback = this.callbackForUpdatePath;
		this.oApi.resetPath();
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate3", function() {
			return null;
		});
		this.oApi.createStep("stepTemplate1", function() {
			return null;
		});
		var aSteps = this.oApi.getSteps();
		var oFirstStep = aSteps[0];
		var oFirstStepRepresentation = oFirstStep.getSelectedRepresentation();
		var aDataOfFirstStepRepresentationBeforeSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		var aDataOfLastStepRepresentationBeforeSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		// set selection on the first step to customers [1001 .. 1004]
		oFirstStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange.length < aDataOfLastStepRepresentationBeforeSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 4, "4 data records expected according to test data set");
		// further change on path: change the selection on the second step: restrict on customer 1001 and 1002
		var oStepToChangeSelection = aSteps[1];
		var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		// additionally change strategy on last step
		oStepToChangeSelection = aSteps[2];
		oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001);
		this.oApi.updatePath(updatePathCallback);
		// further change on path: delete second step: restriction on last step should be [1001 .. 1004] 
		oRepresentation = aSteps[3].getSelectedRepresentation();
		var aDataOfThirdStepBeforeMove = aSteps[3].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfThirdStepBeforeMove.length, 1, "1 data  record, because filter of the left side steps");
		this.oApi.moveStepToPosition(aSteps[3], 1, updatePathCallback);
		aSteps = this.oApi.getSteps();
		var aDataOfFirstStepRepresentationAfterSelectionChange3 = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange3.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		// step 3 is now on position 1 in path
		var aDataOfStep3RepresentationAfterSelectionChange3 = aSteps[1].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfStep3RepresentationAfterSelectionChange3.length, 4, "4 data record expected according to test data set");
		//  step 1 is now on position 2
	});
	QUnit.module('PFH Story 6 with request test double', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Path with first step with selection and 2 further steps with a selection, delete step in middle, which has a selection and test filter update", function(assert) {
		this.oApi.createStep("stepTemplateComponent1", function() {
		});
		this.oApi.createStep("stepTemplateComponent2", function() {
		});
		this.oApi.createStep("stepTemplateComponent2", function() {
		});
		var aSteps = this.oApi.getSteps();
		var oFirstStep = aSteps[0];
		var oFirstStepRepresentation = oFirstStep.getSelectedRepresentation();
		var updatePathCallback = this.callbackForUpdatePath;
		var aDataOfFirstStepRepresentationBeforeSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		var aDataOfLastStepRepresentationBeforeSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		// set selection on the first step to co area 1000 and 2000
		oFirstStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coArea1000_2000);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfFirstStepRepresentationAfterSelectionChange = aSteps[0].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfFirstStepRepresentationAfterSelectionChange.length === aDataOfFirstStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.ok(aDataOfLastStepRepresentationAfterSelectionChange.length < aDataOfLastStepRepresentationBeforeSelectionChange.length, "Additional filter reduced data of last step");
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 2, "2 data records expected according to test data set");
		// set selection on the middle step 
		var oStep2 = aSteps[1];
		var oRepr2 = oStep2.getSelectedRepresentation();
		oRepr2.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coArea1000project1001_1002);
		this.oApi.updatePath(updatePathCallback);
		aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 2, "2 data records expected according to test data set");
		// test exact content of the response data of last step
		var aExpectedData = [ {
			'CoArea' : '1000'
		}, {
			'CoArea' : '1000'
		} ];
		var bContains = sap.apf.testhelper.isContainedInArray(aExpectedData, aDataOfLastStepRepresentationAfterSelectionChange);
		assert.ok(bContains, "data response exactly as expected");
		// delete step in middle, that holds a restriction
		this.oApi.removeStep(aSteps[1], updatePathCallback);
		aSteps = this.oApi.getSteps();
		aDataOfLastStepRepresentationAfterSelectionChange = aSteps[1].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 2, "2 data records expected according to test data set");
	});
	QUnit.module('PFH Representation change in combination with path update', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		createThreeSteps : function() {
			this.o1stStep = setRepresentationsAsProperties(this.oApi.createStep("stepTemplate1", function() {
			}));
			this.o2ndStep = setRepresentationsAsProperties(this.oApi.createStep("stepTemplate1", function() {
			}));
			this.o3rdStep = setRepresentationsAsProperties(this.oApi.createStep("stepTemplate1", function() {
			}));
			function setRepresentationsAsProperties(oStep) {
				var aRepresentationInfo = oStep.getRepresentationInfo();
				for(var i = 0; i < aRepresentationInfo.length; i++) {
					oStep.setSelectedRepresentation(aRepresentationInfo[i].representationId);
					oStep['representation' + (i + 1)] = oStep.getSelectedRepresentation();
				}
				oStep.setSelectedRepresentation(aRepresentationInfo[0].representationId);
				return oStep;
			}
		},
		setSelection : function(oStep, sStrategy) {
			var oSelectedRepresentation = oStep.getSelectedRepresentation();
			oSelectedRepresentation.emulateSelectionStrategy(sStrategy);
			//		oSelectedRepresentation.emulateUserSelectsData();
		},
		selectTwo : function(oStep) {
			this.setSelection(oStep, sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		},
		selectFour : function(oStep) {
			this.setSelection(oStep, sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		},
		selectNothing : function(oStep) {
			this.setSelection(oStep, sap.apf.testhelper.doubles.SelectionStrategy.nothing);
		},
		selectIndices : function(oStep) {
			var oSelectedRepresentation = oStep.getSelectedRepresentation();
			oSelectedRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.indicesOfSelectedData);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('Set data is called in binding  after update when switching representations', function(assert) {
		var updatePathCallback = this.callbackForUpdatePath;
		this.createThreeSteps();
		var aSteps = this.oApi.getSteps();
		var oSecondStep = aSteps[1];
		var oThirdStep = aSteps[2];
		// select 4 customers in second step
		var oReprOfSecondStep = oSecondStep.getSelectedRepresentation();
		oReprOfSecondStep.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		var o1stReprOfThirdStep = oThirdStep.getSelectedRepresentation();
		o1stReprOfThirdStep.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.oApi.updatePath(updatePathCallback);
		var aData = o1stReprOfThirdStep.aDataResponse;
		assert.equal(aData.length, 4, "4 records in first representation in third step expected");
		// switch repr in second step
		var oReprInfoOf3rdStep = oThirdStep.getRepresentationInfo()[1];
		oThirdStep.setSelectedRepresentation(oReprInfoOf3rdStep.representationId);
		var o2ndReprOf3rdStep = oThirdStep.getSelectedRepresentation();
		assert.equal(o2ndReprOf3rdStep.aDataResponse.length, 4, "4 records in second representation in third step expected");
		assert.notEqual(o2ndReprOf3rdStep, o1stReprOfThirdStep, "representations 1 and 2  in third step really differ");
		// switch back to first representation
		oThirdStep.setSelectedRepresentation(oThirdStep.getRepresentationInfo()[0].representationId);
		// change selection in second step - 
		oReprOfSecondStep.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.oApi.updatePath(updatePathCallback);
		aData = oThirdStep.getSelectedRepresentation().aDataResponse;
		assert.equal(aData.length, 2, "2 records in first representation of third step expected");
		// switch to second repr in third step - also 2 records expected
		oThirdStep.setSelectedRepresentation(oThirdStep.getRepresentationInfo()[1].representationId);
		aData = oThirdStep.getSelectedRepresentation().aDataResponse;
		assert.equal(aData.length, 2, "2 records in second representation of third step expected");
	});
	QUnit.test('Adopted selection remains active when changing filter in previous step', function(assert) {
		this.createThreeSteps();
		this.selectTwo(this.o1stStep);
		this.oApi.updatePath(function() {
		});
		this.selectFour(this.o2ndStep);
		this.oApi.updatePath(function() {
		});
		this.o2ndStep.setSelectedRepresentation(this.o2ndStep.getRepresentationInfo()[1].representationId);
		this.o2ndStep.getSelectedRepresentation().emulateSelectionAdoptionSuccessful();
		this.o2ndStep.setSelectedRepresentation(this.o2ndStep.getRepresentationInfo()[0].representationId);
		this.o2ndStep.setSelectedRepresentation(this.o2ndStep.getRepresentationInfo()[1].representationId);
		assert.equal(this.o2ndStep.getSelectedRepresentation().getSelectionAsArray().length, 2, 'Current representation adopted selection during');
		this.selectNothing(this.o1stStep);
		this.oApi.updatePath(function() {
		});
		assert.equal(this.o2ndStep.getSelectedRepresentation().getSelectionAsArray().length, 2, 'Adopted selection still active');
	});
	QUnit.module('PFH Story 6 with request test double', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Step in the middle changes to empty selection", function(assert) {
		this.oApi.createStep("stepTemplateComponent1", function() {
		});
		this.oApi.createStep("stepTemplateComponent2", function() {
		});
		this.oApi.createStep("stepTemplateComponent2", function() {
		});
		var aSteps = this.oApi.getSteps();
		var oSecondStep = aSteps[1];
		var oSecondStepRepresentation = oSecondStep.getSelectedRepresentation();
		var updatePathCallback = this.callbackForUpdatePath;
		var aDataOfSecondStepRepresentationBeforeSelectionChange = oSecondStep.getSelectedRepresentation().aDataResponse;
		// set selection on the second step to empty 
		oSecondStepRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.undefinedSelection);
		this.oApi.updatePath(updatePathCallback);
		var aDataOfSecondStepRepresentationAfterSelectionChange = oSecondStep.getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfSecondStepRepresentationAfterSelectionChange.length === aDataOfSecondStepRepresentationBeforeSelectionChange.length, true, "No change on the first step");
		var aDataOfLastStepRepresentationAfterSelectionChange = aSteps[2].getSelectedRepresentation().aDataResponse;
		assert.equal(aDataOfLastStepRepresentationAfterSelectionChange.length, 0, "The filter reduced data of last step to 0");
	});
	sap.apf.integration.withDoubles.bChangeBehaviour = false;
	QUnit.module('PFH Errorhandling', {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			var RequestDouble = function(oInject, oConfig) {
				sap.apf.integration.withDoubles.bChangeBehaviour = false;
				var oMessageHandler = oInject.instances.messageHandler;
				var oRequest = new sap.apf.testhelper.doubles.Request(oInject, oConfig);
				this.sendGetInBatch = function(oFilter, fnCallbackFunction) {
					if (sap.apf.integration.withDoubles.bChangeBehaviour) {
						var oResponse = oMessageHandler.createMessageObject({
							code : "5001",
							aParameters : [ "unknown", "unknown error", "unknown error" ]
						});
						fnCallbackFunction(oResponse, false);
					} else {
						return oRequest.sendGetInBatch(oFilter, fnCallbackFunction);
					}
				};
			};
			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {

				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
				this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
			var inject = {
					constructors : {
						Request : RequestDouble,
						SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
						ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler,
						Metadata : sap.apf.testhelper.doubles.Metadata
					}
			};
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, componentId : "CompId1", path : "pathOfNoInterest",  inject : inject, componentData : {}}).done(function(){

						this.oApi.resetPath();
						this.bUpdateHasBeenCalled = false;
						this.oStepFromUpdate = undefined;
						this.callbackForUpdatePath = function(oStep) {
							that.bUpdateHasBeenCalled = true;
							that.oStepFromUpdate = oStep;
						};
						done();
					}.bind(this));
		},
		createThreeSteps : function() {
			this.oStep1 = this.oApi.createStep("stepTemplate1", function() {
			});
			this.oStep2 = this.oApi.createStep("stepTemplate3", function() {
			});
			this.oStep3 = this.oApi.createStep("stepTemplate1", function() {
			});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Update fails on existing path", function(assert) {
		//var done = assert.async();
		var nUpdateCounter = 0;
		this.createThreeSteps();
		var aSteps = this.oApi.getSteps();
		var i;
		var aData;
		function assertUpdatePathWasCalled(oStep, bUpdated) {
			if (nUpdateCounter > 0) {
				assert.equal(bUpdated, true, "step has been updated");
			}
			nUpdateCounter++;
		}
		var assertCorrectErrorMessage = function(oMessageObject) {
			var sCode = oMessageObject.getCode();
			assert.equal(sCode, "5002", "Expected message code");
		};
		for(i = 1; i < 3; i++) {
			aData = aSteps[i].getSelectedRepresentation().aDataResponse;
			assert.notEqual(aData.length, 0, "Representations have data");
		}
		this.oComponent.getProbe().messageHandler.setMessageCallback(assertCorrectErrorMessage);
		sap.apf.integration.withDoubles.bChangeBehaviour = true;
		aSteps[0].getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004);
		this.oApi.updatePath(assertUpdatePathWasCalled);
		assert.equal(nUpdateCounter, 3, "All steps have been updated");
		for(i = 1; i < 3; i++) {
			aData = aSteps[i].getSelectedRepresentation().aDataResponse;
			assert.equal(aData.length, 0, "Update resulted in empty data");
		}
	});
	QUnit.module("Path with different steps", {
		beforeEach : function(assert) {
			var done = assert.async();
			var oContext = this;
			var Request = function(){
				this.sendGetInBatch = function(oFilter, callback){
					if(oFilter.toUrlParam().indexOf("Country") > -1){
						var data = [{
							Region : "Region1"
						}];
					}
					if(oFilter.toUrlParam().indexOf("City") > -1){
						var data = [{
							Town : "Town1"
						}];
					}
					callback({
						data : data
					});
				};
			};
			var StartFilterHandler = function(){
				this.serialize = function(){
					return jQuery.Deferred().resolve();
				};
				this.getCumulativeFilter = function(){
					return jQuery.Deferred().resolve(oContext.contextFilter || oContext.oApi.createFilter().getInternalFilter());
				};
			};
			var inject = {
				constructors : {
					StartFilterHandler : StartFilterHandler,
					SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
					Metadata : sap.apf.testhelper.doubles.Metadata,
					Request : Request,
					ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
				}
			};
			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration("twoFilterMappingSteps");
				this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
			sap.apf.testhelper.createComponentAsPromise(this, {
				stubAjaxForResourcePaths : true,
				doubleUiInstance : true,
				path : "pathOfNoInterest",
				inject : inject
			}).done(function(){
				oContext.oApi.resetPath();
				oContext.bUpdateHasBeenCalled = false;
				oContext.oStepFromUpdate = undefined;
				oContext.callbackForUpdatePath = function(oStep) {
					oContext.bUpdateHasBeenCalled = true;
					oContext.oStepFromUpdate = oStep;
				};
				oContext.coreApi = oContext.oComponent.getProbe().coreApi;
				done();
			});
		},
		addThreeSteps : function(){
			this.oStep1 = this.oApi.createStep("stepTemplate1", function() {
			});
			this.oStep2 = this.oApi.createStep("stepFilterMapping", function() {
			});
			this.oStep3 = this.oApi.createStep("stepFilterMappingKeepSource", function(oStep) {
			});
			this.oApi.setActiveStep(this.oStep3);
		},
		addSelectionsToSteps : function(){
			//Selections in the different steps
			//Step 1: Customer1
			//Step 2: Country1 mapped to Region1 with FilterMapping
			//Step 3: City1 mapped to Town1, both are kept
			var that = this;
			this.oStep1.getFilter = function(){
				var filter = that.oApi.createFilter().getInternalFilter();
				filter.addAnd("Customer", "eq", "Customer1");
				return filter;
			};
			this.oStep2.getFilter = function(){
				var filter = that.oApi.createFilter().getInternalFilter();
				filter.addAnd("Country", "eq", "Country1");
				return filter;
			};
			this.oStep3.getFilter = function(){
				var filter = that.oApi.createFilter().getInternalFilter();
				filter.addAnd("City", "eq", "City1");
				return filter;
			};
		}
	});
	QUnit.test("getCumulativeFilterUpToActiveStep with no steps", function(assert) {
		var done = assert.async();
		this.coreApi.getCumulativeFilterUpToActiveStep().then(function(oCumulativeFilter){
			assert.strictEqual(oCumulativeFilter.toUrlParam(), "", "Cumulative filter is empty");
			done();
		});
	});
	QUnit.test("getCumulativeFilterUpToActiveStep with no steps but startFilter", function(assert) {
		var done = assert.async();
		this.contextFilter = this.oApi.createFilter().getInternalFilter().addAnd("ContextProperty", "eq", "A");
		this.coreApi.getCumulativeFilterUpToActiveStep().then(function(oCumulativeFilter){
			assert.strictEqual(oCumulativeFilter.toUrlParam(), "(ContextProperty%20eq%20%27A%27)", "Cumulative filter contains startFilter");
			done();
		});
	});
	QUnit.test("getCumulativeFilterUpToActiveStep with Three steps", function(assert){
		var done = assert.async();
		this.addThreeSteps();
		this.addSelectionsToSteps();
		this.coreApi.getCumulativeFilterUpToActiveStep().then(function(oCumulativeFilter){
			assert.strictEqual(oCumulativeFilter.toUrlParam(), "((Customer%20eq%20%27Customer1%27)%20and%20(Region%20eq%20%27Region1%27)%20and%20((City%20eq%20%27City1%27)%20and%20(Town%20eq%20%27Town1%27)))", "Cumulative filter contains all filters from 3 steps");
			done();
		});
	});
	QUnit.test("getCumulativeFilterUpToActiveStep with Three steps and startFilter", function(assert){
		var done = assert.async();
		this.contextFilter = this.oApi.createFilter().getInternalFilter().addAnd("ContextProperty", "eq", "A");
		this.addThreeSteps();
		this.addSelectionsToSteps();
		this.coreApi.getCumulativeFilterUpToActiveStep().then(function(oCumulativeFilter){
			assert.strictEqual(oCumulativeFilter.toUrlParam(), "((ContextProperty%20eq%20%27A%27)%20and%20(Customer%20eq%20%27Customer1%27)%20and%20(Region%20eq%20%27Region1%27)%20and%20((City%20eq%20%27City1%27)%20and%20(Town%20eq%20%27Town1%27)))", "Cumulative filter contains filters from 3 steps and startFilter");
			done();
		});
	});
	QUnit.test("getCumulativeFilterUpToActiveStep with Three steps - second step is active", function(assert){
		var done = assert.async();
		this.addThreeSteps();
		this.addSelectionsToSteps();
		this.oApi.setActiveStep(this.oStep2);
		this.coreApi.getCumulativeFilterUpToActiveStep().then(function(oCumulativeFilter){
			assert.strictEqual(oCumulativeFilter.toUrlParam(), "((Customer%20eq%20%27Customer1%27)%20and%20(Region%20eq%20%27Region1%27))", "Cumulative filter contains only filters from first two steps");
			done();
		});
	});
}());
