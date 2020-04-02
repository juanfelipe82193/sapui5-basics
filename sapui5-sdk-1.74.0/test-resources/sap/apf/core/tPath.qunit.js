/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2016 SAP SE. All rights reserved
 */
/*global sap, jQuery, QUnit, sinon */
jQuery.sap.declare("test.sap.apf.core.tPath");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.coreApi");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.path");
(function() {
	'use strict';
	function StepWithoutCallback(sTestId) {
		this.stepId = sTestId;
		this.setFilter = function(oFilter) {
		};
		this.update = function(oFilter, fnCallback) {
		};
		this.serialize = function() {
			return {
				stepId : this.stepId
			};
		};
		this.deserialize = function(oSerializableStep) {
			QUnit.assert.equal(oSerializableStep.stepId, this.stepId, "Step received saved state");
		};
		this.destroy = function() {
			this.destroyWasCalled = true;
		};
	}
	QUnit.module('tPath', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances: {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.oStep0 = new StepWithoutCallback("step0");
		},
		oStep1 : new StepWithoutCallback("step1"),
		oStep2 : new StepWithoutCallback("step2"),
		oStep3 : new StepWithoutCallback("step3"),
		addThreeStepsToPath : function() {
			this.oPath.addStep(this.oStep1, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.addStep(this.oStep3, function() {
			});
		}
	});
	QUnit.test('Initialization', function(assert) {
		assert.ok(this.oPath, "Path initialized");
	});
	QUnit.test('Add step', function(assert) {
		var oStep1 = new StepWithoutCallback("step1");
		this.oPath.addStep(oStep1, function() {
		});
		assert.equal(this.oPath.getSteps().length, 1, 'One step expected');
	});
	QUnit.test('Add three steps', function(assert) {
		this.oPath.addStep(this.oStep1, function() {
		});
		this.oPath.addStep(this.oStep2, function() {
		});
		this.oPath.addStep(this.oStep3, function() {
		});
		assert.equal(this.oPath.getSteps().length, 3, 'Three steps expected');
	});
	QUnit.test('WHEN Destroy Path', function(assert) {
		this.oPath.addStep(this.oStep1, function() {
		});
		this.oPath.addStep(this.oStep2, function() {
		});
		this.oPath.addStep(this.oStep3, function() {
		});
		this.oPath.destroy();
		assert.ok(this.oStep1.destroyWasCalled && this.oStep2.destroyWasCalled && this.oStep3.destroyWasCalled, "THEN the destroy of the steps were called");
	});
	QUnit.test('getSteps() copies the array', function(assert) {
		this.addThreeStepsToPath();
		assert.notEqual(this.oPath.getSteps(), this.oPath.getSteps(), "array different");
		for( var inx in this.oPath.getSteps()) {
			assert.equal(this.oPath.getSteps()[inx], this.oPath.getSteps()[inx], "step " + inx + " is identical by reference");
		}
	});
	QUnit.test('Set step active', function(assert) {
		this.addThreeStepsToPath();
		assert.ok(this.oPath.getActiveSteps().length === 0, "Precondition: no step is active so far.");
		var oFirstActiveStep = this.oPath.getSteps()[1];
		this.oPath.makeStepActive(oFirstActiveStep);
		assert.equal(this.oPath.getActiveSteps()[0], oFirstActiveStep, "Activated step is active");
		this.oPath.makeStepActive(oFirstActiveStep);
		assert.ok(this.oPath.getActiveSteps().length === 1, "Adding the same step as active step again shall not do anything");
		var UnknownStep = function() {
			this.id = "unknown";
		};
		assert.throws(function() {
			this.oPath.makeStepActive(new UnknownStep());
		}, 'An unknown step cannot be an active step.');
		this.oPath.makeStepActive(this.oPath.getSteps()[2]);
		assert.ok(this.oPath.getActiveSteps().length === 2, "Adding further steps to the active steps shall be possible");
	});
	QUnit.test('Set step active with one step only', function(assert) {
		this.oPath.addStep(this.oStep0);
		assert.ok(this.oPath.getActiveSteps().length === 0, "Precondition: no step is active so far");
		this.oPath.makeStepActive(this.oStep0);
		assert.equal(this.oPath.getActiveSteps()[0], this.oStep0, "The first step is active");
	});
	QUnit.test('Set step active on empty path', function(assert) {
		assert.ok(this.oPath.getSteps().length === 0, "Precondition: the path is empty");
		assert.throws(function() {
			this.oPath.makeStepActive(this.oStep0);
		}, 'A step cannot be active on empty path.');
		assert.ok(this.oPath.getActiveSteps().length === 0, "No step shall be active");
	});
	QUnit.test('Set step Inactive', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.makeStepActive(this.oStep1);
		this.oPath.makeStepActive(this.oStep2);
		this.oPath.makeStepInactive(this.oStep1);
		assert.equal(this.oPath.getActiveSteps().length, 1, "Only one step remains active");
		assert.equal(this.oPath.getActiveSteps()[0], this.oStep2, "Remaining step is oStep2");
		assert.throws(function() {
			this.oPath.makeStepInactive({});
		}, 'Only an active step can be removed from the active steps.');
		assert.throws(function() {
			this.oPath.makeStepInactive(this.oStep1);
		}, 'Only an active step can be removed from the active steps.');
		assert.equal(this.oPath.getActiveSteps().length, 1, "There shall still remain only one step active");
		assert.equal(this.oPath.getActiveSteps()[0], this.oStep2, "Remaining step is oStep2");
	});
	QUnit.test('Step is active', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.makeStepActive(this.oStep1);
		assert.ok(this.oPath.stepIsActive(this.oStep1), "oStep1 is active");
		assert.ok(!this.oPath.stepIsActive(this.oStep2), "oStep2 is not active");
	});
	QUnit.test('Step is in path', function(assert) {
		this.addThreeStepsToPath();
		assert.ok(this.oPath.stepIsInPath(this.oStep1), "oStep1 is in the path");
		assert.ok(this.oPath.stepIsInPath(this.oStep2), "oStep2 is in the path");
		var oUnknownStep = {};
		assert.ok(!this.oPath.stepIsInPath(oUnknownStep), "An unknown step is not in the path");
	});
	QUnit.test('Last step is active and some other step removed', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.makeStepActive(this.oStep3);
		this.oPath.removeStep(this.oStep2);
		assert.ok(this.oStep2.destroyWasCalled, "THEN the destroy function of the step is called");
		assert.equal(this.oPath.getSteps().length, 2, 'Length 2 expected');
		assert.equal(this.oPath.getActiveSteps()[0], this.oStep3, 'active step remains active');
	});
	QUnit.test('Path and active step remain equal when removing an object not in path', function(assert) {
		var oNotIncludedInPathStep = {};
		this.addThreeStepsToPath();
		this.oPath.makeStepActive(this.oStep1);
		assert.equal(this.oPath.getSteps().length, 3, 'Test condition: path length 3');
		assert.throws(function() {
			this.oPath.removeStep(oNotIncludedInPathStep);
		}, Error, "Not in path existing step can't be moved at all");
		assert.equal(this.oPath.getActiveSteps()[0], this.oStep1, 'Step1 shall remain active step');
		assert.equal(this.oPath.getSteps().length, 3, 'path length unchanged');
	});
	QUnit.test('Remove step from path', function(assert) {
		this.addThreeStepsToPath();
		assert.equal(this.oPath.getSteps().length, 3, "test precondition ok");
		this.oPath.removeStep(this.oStep2);
		assert.ok(this.oStep2.destroyWasCalled, "THEN the destroy function of the step is called");
		assert.equal(this.oPath.getSteps().length, 2, "result path has length 2");
		assert.equal(this.oPath.getSteps()[0].testId, this.oStep1.testId, "identity step1 is untouched");
	});
	QUnit.test('Remove active step', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.makeStepActive(this.oStep2);
		assert.equal(this.oStep2, this.oPath.getActiveSteps()[0], 'Step2 should be active step');
		this.oPath.removeStep(this.oStep2);
		assert.equal(this.oPath.getActiveSteps().length, 0, 'After deletion of Step2, there shall be no active step');
	});
	QUnit.test('Remove step in path of length 1', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.removeStep(this.oStep2, function() {
		});
		this.oPath.removeStep(this.oStep3, function() {
		});
		this.oPath.makeStepActive(this.oStep1);
		this.oPath.removeStep(this.oStep1, function() {
		});
		assert.equal(this.oPath.getActiveSteps().length, 0, 'shall be empty array');
		assert.equal(this.oPath.getSteps().length, 0, 'effect shall be same as resetPath()');
	});
	QUnit.test('Remove step in path of length 0', function(assert) {
		assert.equal(this.oPath.getSteps().length, 0, 'precondition empty path');
		var oStep = {};
		assert.throws(function() {
			this.oPath.removeStep(oStep, function() {
			});
		}, Error, "Not in path existing step can't be moved at all, also not in initial path");
		assert.equal(this.oPath.getSteps().length, 0, 'no exception, path empty');
	});
	QUnit.test('Rremove the first one inactive step when the second one is active', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.makeStepActive(this.oStep2);
		this.oPath.removeStep(this.oStep1, function() {
		});
		assert.equal(this.oPath.getSteps().length, 2, 'Path has the correct lenght');
		assert.deepEqual(this.oPath.getSteps()[0], this.oStep2, 'The oStep2 shall be on the first position');
		assert.deepEqual(this.oPath.getActiveSteps()[0], this.oStep2, 'The new first step shall be active');
	});
	QUnit.test('Get steps', function(assert) {
		this.addThreeStepsToPath();
		var innerObject = {
			testAttr : "step is not empty"
		};
		var oStep = {
			innerObj : innerObject
		};
		this.oPath.addStep(oStep, function() {
		});
		var aSteps = this.oPath.getSteps();
		assert.equal(aSteps.length, 4, 'The returned array has the length 4');
		assert.equal("step is not empty", aSteps[3].innerObj.testAttr, "Test precondition: attr of last object is the same as last inserted object");
		assert.notEqual(aSteps[3], oStep, "Returned object is a copy and not a reference");
		assert.deepEqual(aSteps[3], oStep, "Returned object is correct");
	});
	QUnit.module('Path#4', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances: {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances: {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
		},
		oStep1 : new StepWithoutCallback("step1"),
		oStep2 : new StepWithoutCallback("step2"),
		oStep3 : new StepWithoutCallback("step3"),
		oStep4 : new StepWithoutCallback("step4"),
		addStepsToPath : function() {
			this.oPath.addStep(this.oStep1, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.addStep(this.oStep3, function() {
			});
			this.oPath.addStep(this.oStep4, function() {
			});
		}
	});
	QUnit.test('Move Step To Position', function(assert) {
		function moveFromTo(from, to, env) {
			var oStep = env.oPath.getSteps()[from];
			env.oPath.moveStepToPosition(oStep, to);
			assert.equal(env.oPath.getSteps()[to], oStep, " move " + from + " -> " + to);
		}
		this.addStepsToPath();
		this.oPath.makeStepActive(this.oStep1);
		assert.ok(!this.oPath.getSteps()[0].isInitial, "not initial");
		assert.ok(!this.oPath.getSteps()[1].isInitial, "not initial");
		assert.ok(!this.oPath.getSteps()[2].isInitial, "not initial");
		assert.ok(!this.oPath.getSteps()[3].isInitial, "not initial");
		moveFromTo(0, 0, this);
		moveFromTo(1, 0, this);
		moveFromTo(2, 0, this);
		moveFromTo(0, 1, this);
		moveFromTo(1, 1, this);
		moveFromTo(2, 1, this);
		moveFromTo(0, 2, this);
		moveFromTo(1, 2, this);
		moveFromTo(2, 2, this);
		moveFromTo(0, 3, this);
		moveFromTo(1, 3, this);
		moveFromTo(2, 3, this);
		moveFromTo(3, 3, this);
	});
	QUnit.module('Update empty path', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
		}
	});
	QUnit.test('Call update on empty path', function(assert) {
		var nStepUpdateCounter = 0;
		var fnCallback = function() {
			nStepUpdateCounter++;
		};
		this.oPath.update(fnCallback);
		assert.equal(nStepUpdateCounter, 0, "Empty path, thus no step was updated");
	});
	QUnit.module('Path-none initial--1', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
		},
		addStepsToPath : function() {
			var fnDoNothing = function() {
			};
			for(var inx = 0; inx < 4; ++inx) {
				this.oPath.addStep(new StepWithoutCallback("step" + inx), fnDoNothing);
			}
		},
		okIsNotInPath : function(assert, oStep) {
			assert.ok(jQuery.inArray(this.oPath.getSteps(), oStep) < 0, oStep.testId + " not in path");
		}
	});
	QUnit.test('remove the only active when the first one is active', function(assert) {
		this.addStepsToPath();
		var oFirstStep = this.oPath.getSteps()[0];
		this.oPath.makeStepActive(oFirstStep);
		assert.ok(this.oPath.stepIsActive(oFirstStep), oFirstStep.testId + " is active ");
		var oStep = this.oPath.getSteps()[2];
		this.oPath.removeStep(oStep);
		this.okIsNotInPath(assert, oStep);
		assert.ok(this.oPath.stepIsActive(oFirstStep), oFirstStep.testId + " is active ");
		assert.ok(!this.oPath.stepIsActive(oStep), " removed step not active ");
	});
	QUnit.module('Path-none initial--2', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
		},
		addStepsToPath : function() {
			var fnDoNothing = function() {
			};
			for(var inx = 0; inx < 4; ++inx) {
				this.oPath.addStep(new StepWithoutCallback("step" + inx), fnDoNothing);
			}
		},
		okIsNotInPath : function(assert, oStep) {
			assert.ok(jQuery.inArray(this.oPath.getSteps(), oStep) < 0, oStep.testId + " not in path");
		},
		okIsActive : function(assert, oStep) {
			assert.ok(this.oPath.stepIsActive(oStep), oStep.testId + " is active ");
		}
	});
	QUnit.test('remove the first one inactive when the second one is active', function(assert) {
		this.addStepsToPath();
		var oStep2 = this.oPath.getSteps()[1];
		this.oPath.makeStepActive(oStep2);
		this.okIsActive(assert, oStep2);
		var oFirstStep = this.oPath.getSteps()[0];
		this.oPath.removeStep(oFirstStep);
		this.okIsNotInPath(assert, oFirstStep);
		this.okIsActive(assert, oStep2);
		assert.ok(!this.oPath.stepIsActive(oFirstStep), " removed step not active ");
	});
	QUnit.module('Serialization and De-serialization', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			var thisSetup = this;
			this.fnSavedFilter = sap.apf.utils.Filter;
			sap.apf.utils.Filter = function() {
				this.serialize = function() {
					return {};
				};
				this.deserialize = function() {
					return {};
				};
				this.getInternalFilter = function() {
					return new sap.apf.core.utils.Filter(this.oMessageHandler);
				};
			};
			this.oStep0 = new StepWithoutCallback("step0");
			this.oCoreApi.createStep = function(sStepId, fnStepProcessedCallback, sRepresentationTypeId) {
				var oStep;
				oStep = new StepWithoutCallback(sStepId);
				thisSetup.oPath.addStep(oStep, fnStepProcessedCallback);
			};
		},
		afterEach : function(assert) {
			sap.apf.utils.Filter = this.fnSavedFilter;
		},
		oStep1 : new StepWithoutCallback("step1"),
		oStep2 : new StepWithoutCallback("step2"),
		oStep3 : new StepWithoutCallback("step3"),
		addOneStepToPath : function() {
			this.oPath.addStep(this.oStep1, function() {
			});
			var oStep1 = this.oPath.getSteps()[0];
			this.oPath.makeStepActive(oStep1);
		},
		addThreeStepsToPathSecondActive : function() {
			this.oPath.addStep(this.oStep1, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.addStep(this.oStep3, function() {
			});
			var oStep2 = this.oPath.getSteps()[1];
			this.oPath.makeStepActive(oStep2);
		},
		addFirstAndTwoActiveStepsToPath : function() {
			this.oPath.addStep(this.oStep0, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.addStep(this.oStep3, function() {
			});
			var oStep2 = this.oPath.getSteps()[1];
			var oStep3 = this.oPath.getSteps()[2];
			this.oPath.makeStepActive(oStep2);
			this.oPath.makeStepActive(oStep3);
		}
	});
	QUnit.test('Path with one step', function(assert) {
		var oExpectedSerializablePath = {
			path : {
				steps : [ {
					stepId : "step1"
				} ],
				indicesOfActiveSteps : [ 0 ]
			}
		};
		this.addOneStepToPath();
		var oSerializablePath = this.oPath.serialize();
		assert.deepEqual(oSerializablePath, oExpectedSerializablePath, "Correct serializable path expected");
		this.oPath = new sap.apf.core.Path({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			}
		});
		this.oPath.deserialize(oSerializablePath);
		assert.equal(this.oPath.getSteps().length, 1, "Path contains one step");
		assert.equal(this.oPath.getActiveSteps().length, 1, "Path has one active step");
		assert.equal(this.oPath.getActiveSteps()[0].stepId, "step1", "Path has correct active step");
		assert.deepEqual(this.oPath.serialize(), oSerializablePath, "New deserialized path creates same serializable path object");
	});
	QUnit.test('Path with three steps, second is active', function(assert) {
		var oExpectedSerializablePath = {
			path : {
				steps : [ {
					stepId : "step1"
				}, {
					stepId : "step2"
				}, {
					stepId : "step3"
				} ],
				indicesOfActiveSteps : [ 1 ]
			}
		};
		this.addThreeStepsToPathSecondActive();
		var oSerializablePath = this.oPath.serialize();
		assert.deepEqual(oSerializablePath, oExpectedSerializablePath, "Correct serializable path expected");
		this.oPath = new sap.apf.core.Path({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			}
		});
		this.oPath.deserialize(oSerializablePath);
		assert.equal(this.oPath.getSteps().length, 3, "Path contains three steps");
		assert.equal(this.oPath.getActiveSteps().length, 1, "Path has one active step");
		assert.equal(this.oPath.getActiveSteps()[0].stepId, "step2", "Path has correct active step");
		assert.deepEqual(this.oPath.serialize(), oSerializablePath, "New deserialized path creates same serializable path object");
	});
	QUnit.test('Serialization with three steps, second and third step is active', function(assert) {
		var oExpectedSerializablePath = {
			path : {
				steps : [ {
					stepId : "step0"
				}, {
					stepId : "step2"
				}, {
					stepId : "step3"
				} ],
				indicesOfActiveSteps : [ 1, 2 ]
			}
		};
		this.addFirstAndTwoActiveStepsToPath();
		var oSerializablePath = this.oPath.serialize();
		assert.equal(oSerializablePath.path.indicesOfActiveSteps.length, oExpectedSerializablePath.path.indicesOfActiveSteps.length, "active steps");
		assert.equal(oSerializablePath.path.indicesOfActiveSteps[0], oExpectedSerializablePath.path.indicesOfActiveSteps[0], "active steps");
		assert.equal(oSerializablePath.path.indicesOfActiveSteps[1], oExpectedSerializablePath.path.indicesOfActiveSteps[1], "active steps");
		assert.equal(oSerializablePath.path.steps.length, oExpectedSerializablePath.path.steps.length, "steps");
		assert.equal(oSerializablePath.path.steps[0].stepId, oExpectedSerializablePath.path.steps[0].stepId, "steps");
		assert.deepEqual(oSerializablePath, oExpectedSerializablePath, "Correct serializable path expected");
		this.oPath = new sap.apf.core.Path({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			}
		});
		this.oPath.deserialize(oSerializablePath);
		assert.equal(this.oPath.getSteps().length, 3, "Path contains three steps");
		assert.equal(this.oPath.getActiveSteps().length, 2, "Path has two active steps");
		assert.ok(this.oPath.getActiveSteps()[0].stepId === "step2" && this.oPath.getActiveSteps()[1].stepId === "step3", "Path has correct active steps");
		assert.deepEqual(this.oPath.serialize(), oSerializablePath, "New deserialized path creates same serializable path object");
	});
	QUnit.module('tPath sinon', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances: {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.oStep0 = new StepWithoutCallback("step0");
			this.oStep1 = new StepWithoutCallback("step1");
			this.oStep2 = new StepWithoutCallback("step2");
			this.oStep3 = new StepWithoutCallback("step3");
			this.oPath.addStep(this.oStep0, function() {
			});
			this.oPath.addStep(this.oStep1, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.addStep(this.oStep3, function() {
			});
		}
	});
	QUnit.test('GIVEN 4 steps, one is active WHEN move an active THEN it remains active and on right position', function(assert) {
		this.oPath.makeStepActive(this.oStep0);
		this.oPath.moveStepToPosition(this.oStep1, 2);
		assert.equal(this.oPath.getSteps()[2], this.oStep1, "Step1 shall be at the third position");
		assert.equal(this.oStep0, this.oPath.getActiveSteps()[0], "Step0 shall stay active");
		this.oPath.moveStepToPosition(this.oStep3, 0);
		assert.equal(this.oStep0, this.oPath.getSteps()[1], "Step0 shall stay at the second position");
		assert.equal(this.oStep3, this.oPath.getSteps()[0], "Step3 shall be at the first position");
	});
	QUnit.test('GIVEN 4 steps WHEN moving the active step THEN the active steps remains active', function(assert) {
		this.oPath.makeStepActive(this.oStep1);
		this.oPath.moveStepToPosition(this.oStep1, 2);
		assert.equal(this.oStep1, this.oPath.getActiveSteps()[0], "Step1 stays active after moving Step1 forward");
		this.oPath.moveStepToPosition(this.oStep2, 3);
		assert.equal(this.oStep1, this.oPath.getActiveSteps()[0], "Step1 stays active after moving Step2 forward");
		this.oPath.moveStepToPosition(this.oStep2, 1);
		assert.equal(this.oStep1, this.oPath.getActiveSteps()[0], "Step1 stays active after moving Step2 backwards");
		this.oPath.moveStepToPosition(this.oStep1, 0);
		assert.equal(this.oStep1, this.oPath.getActiveSteps()[0], "Step1 stays active after moving Step1 backwards");
	});
	QUnit.test('GIVEN 4 steps WHEN moving any to a invalid position THEN check is being called', function(assert) {
		assert.throws(function() {
			this.oPath.moveStepToPosition(this.oStep1, 5);
		}, Error, "wrong position path has only valid positions 0 .. 2  -> must throw error to pass");
		assert.equal(this.oStep1, this.oPath.getSteps()[1], "Nothing should change");
		assert.throws(function() {
			this.oPath.moveStepToPosition(this.oStep1, -5);
		}, Error, "wrong position path has only valid positions 0 .. 2  -> must throw error to pass");
		assert.equal(this.oStep1, this.oPath.getSteps()[1], "Nothing should change");
		assert.throws(function() {
			this.oPath.moveStepToPosition(this.oStep0, 5);
		}, Error, "The first step can't be moved to an invalid position");
		assert.equal(this.oStep1, this.oPath.getSteps()[1], "Nothing should change");
	});
	QUnit.test('GIVEN some path WHEN moveStepToPosition with invalid 2nd param THEN check is being called AND nothing changes', function(assert) {
		assert.throws(function() {
			this.oPath.moveStepToPosition(this.oStep1, "2");
		}, Error, "wrong 2nd argument type in moveStepToPosition");
		assert.equal(this.oStep1, this.oPath.getSteps()[1], "Nothing should change");
	});
	QUnit.test('GIVEN some path WHEN moveStepToPosition with invalid 1st param THEN check is being called with correct error code AND nothing changes', function(assert) {
		assert.throws(function() {
			this.oPath.moveStepToPosition("oStep1", 2);
		}, Error, "wrong argument for step - string instead of step  -> must throw error to pass");
		assert.equal(this.oStep1, this.oPath.getSteps()[1], "Nothing should change");
	});
	QUnit.module('Inject of exit oInject.path.beforeAddingToCumulatedFilter', {
		beforeEach : function(assert) {
			var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oMessageHandler = oMessageHandler;
			//Similar to StepWithoutCallback, but callbacks are called, so that path is fully updated
			function StepWithCallback(sTestId) {
				this.stepId = sTestId;
				this.sampleFilter = new sap.apf.core.utils.Filter(oMessageHandler);
				this.setFilter = function(oFilter) {};
				this.getFilter = function() {
					return this.sampleFilter;
				};
				this.update = function(oFilter, fnCallback) {
					fnCallback();
				};
				this.setData = function () {};
				this.determineFilter = function (oContextFilter, callbackFromStepFilterProcessing) {
					callbackFromStepFilterProcessing(this.sampleFilter);
				};
				this.getContextInfo = function () {
				    return {
                        entityType: "EntityType1",
                        service: "dummy.xsodata"
                    };
                };
			}
			this.oStep1 = new StepWithCallback("step1");
		}
	});
	function setupForExitInjection(context, beforeAddingToCumulatedFilter){
		var exits = {
			path: {
				beforeAddingToCumulatedFilter: beforeAddingToCumulatedFilter
			}
		};
		var oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances: {
				messageHandler : context.oMessageHandler
			}
		}).doubleCumulativeFilter();
		oCoreApi.storeApfState = function() {};
		context.oPath = new sap.apf.core.Path({
			instances: {
				messageHandler : context.oMessageHandler,
				coreApi : oCoreApi
			},
			exits: exits
		});
	}

	QUnit.test("WHEN not injected beforeAddingToCumulatedFilter", function (assert) {
		var done = assert.async();
		setupForExitInjection(this);
		this.oPath.addStep(this.oStep1, function(){});
		var SecondStep = function () {
			this.update = function(oFilter) {
				assert.ok(oFilter.isEmpty(), "AND the modified cumulative filter is passed to the next step.");
				done();
			};
		};
		this.oPath.addStep(new SecondStep(this), function(){});
	});
	QUnit.test("WHEN injected beforeAddingToCumulatedFilter then exit is called", function (assert) {
		var done = assert.async();
		var testFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "val1");
		this.testFilter = testFilter;
        var that = this;
		setupForExitInjection(this, function (cumulatedFilter, filter, oStepContextInfo) {
            that.oStepContextInfo = oStepContextInfo;
		    return testFilter;
		});
		this.oPath.addStep(this.oStep1, function(){});
		var SecondStep = function (context) {
			this.context = context;
			this.update = function(oFilter) {
				assert.ok(this.context.testFilter.isEqual(oFilter), "AND the modified cumulative filter is passed to the next step.");
                assert.equal(that.oStepContextInfo.entityType, "EntityType1", "AND the step context is passed to the exit");
				done();
			};
		};
		this.oPath.addStep(new SecondStep(this), function(){});
	});
	QUnit.module('checkAddStep', {
		beforeEach : function(assert) {
			this.oMessageHandler = {
				createMessageObject: function(oConfig){
					assert.ok(oConfig.enrichInfoInMessageObject, "CreateMessageObject called with enrichInfoInMessageObject parameter");
					return new sap.apf.core.MessageObject(oConfig);
				}
			};
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oCoreApi.getTextNotHtmlEncoded = function(key){
				assert.strictEqual(key, "titleKey", "Proper key given as parameter for text");
				return "stepTitle";
			};
			this.oCoreApi.getMetadata = function(){
				return jQuery.Deferred().resolve({
					getPropertyMetadata: function (entiySet, property){
						if(property === "hierarchyPropertyNodeId"){
							return {
								"hierarchy-node-for" : "hierarchyProperty"
							};
						} else if (property === "differentHierarchicalPropertyNodeId"){
							return {
								"hierarchy-node-for" : "differentHierarchyProperty"
							};
						}
						return {};
					}
				});
			};
			this.oCoreApi.getConfigurationObjectById = function(sId){
				switch(sId){
					case "step1":
						return {
							binding: "binding1",
							type: "step",
							request: "request1"
						};
					case "binding1":
						return {
							requiredFilters: ["normalProperty"]
						};
					case "request1":
						return {
							entityType: "entitySet",
							service: "service.xsodata"
						};
					case "hierarchicalStep1":
						return {
							hierarchyProperty: "hierarchyProperty",
							binding: "hierarchicalBinding1",
							type: "hierarchicalStep",
							request: "request1"
						};
					case "hierarchicalBinding1":
						return {
							requiredFilters: ["hierarchyPropertyNodeId"]
						};
					case "hierarchicalStep2":
						return {
							hierarchyProperty: "differentHierarchicalProperty",
							binding: "hierarchicalBinding2",
							type: "hierarchicalStep",
							request: "request1"
						};
					case "hierarchicalBinding2":
						return {
							requiredFilters: ["differentHierarchicalPropertyNodeId"]
						};
					case "hierarchicalStep3":
						return {
							hierarchyProperty: "hierarchyProperty",
							binding: "hierarchicalBinding3",
							type: "hierarchicalStep",
							request: "request1"
						};
					case "hierarchicalBinding3":
						return {
							requiredFilters: []
						};
					case "hierarchicalStep4":
						return {
							hierarchyProperty: "hierarchyProperty",
							binding: "hierarchicalBinding4",
							type: "hierarchicalStep",
							request: "request1"
						};
					case "hierarchicalBinding4":
						return {
							requiredFilters: ["hierarchyPropertyNodeId"]
						};
					case "hierarchicalStep5":
						return {
							hierarchyProperty: "hierarchyProperty",
							binding: "hierarchicalBinding5",
							type: "hierarchicalStep",
							request: "request1"
						};
					case "hierarchicalBinding5":
						return {
							requiredFilters: ["normalProperty"]
						};
                }
			};
			this.path = new sap.apf.core.Path({
				instances: {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.step = new Step("step1", "step", "normalProperty");
			this.hStep = new Step("hierarchicalStep1", "hierarchicalStep" ,"hierarchyPropertyNodeId");
			this.hStepWithNormalRequiredFilter = new Step("hierarchicalStep5", "hierarchicalStep", "normalProperty");
			function Step(stepId, type, requiredFilter){
				this.type = type;
				this.getBinding = function () {
					return {
						getRequiredFilters : function(){
							return [requiredFilter];
						}
					};
				};
				this.update = function(oFilter, callback){
				};
				this.getAdditionalConfigurationProperties = function(){
					return {
						id: stepId,
						title: {
							key: "titleKey"
						}
					};
				};
			}
		}
	});
	QUnit.test('If no step is added yet - add normal step', function(assert){
		this.path.checkAddStep("step1").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "If no step is in path, adding a step is always possible");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('If no step is added yet - add hierarchical step', function(assert){
		this.path.checkAddStep("hierarchicalStep1").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "If no step is in path, adding a step is always possible");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('Normal step already added - add normal step', function(assert){
		this.path.addStep(this.step);
		this.path.checkAddStep("step1").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "Normal step doesn't restrict adding a step to the path");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('Normal step already added - add hierarchical step', function(assert){
		this.path.addStep(this.step);
		this.path.checkAddStep("hierarchicalStep1").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "Normal step doesn't restrict adding a step to the path");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('Hierarchical step already added - add normal step', function(assert){
		this.path.addStep(this.hStep);
		this.path.checkAddStep("step1").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "Normal step can always be added");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('Hierarchical step already added - add same hierarchical step', function(assert){
		this.path.addStep(this.hStep);
		this.path.checkAddStep("hierarchicalStep1").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, false, "Hierarchical step cannot be added again");
			assert.strictEqual(messageObject.getCode(), 5234, "Message with correcct MessageCode created");
			assert.deepEqual(messageObject.getParameters(), ["hierarchyProperty", "stepTitle"], "Correct paramters handed over");
		});
	});
	QUnit.test('Hierarchical step already added - add hierarchical step with different requiredFilter', function(assert){
		this.path.addStep(this.hStep);
		this.path.checkAddStep("hierarchicalStep2").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "Different Hierarchical step can be added");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('Hierarchical step already added - add hierarchical step without requiredFilter', function(assert){
		this.path.addStep(this.hStep);
		this.path.checkAddStep("hierarchicalStep3").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "Hierarchical step without required filter can be added");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('Hierarchical step already added - add different hierarchical step with same requiredFilter', function(assert){
		this.path.addStep(this.hStep);
		this.path.checkAddStep("hierarchicalStep4").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, false, "Hierarchical step with same required filter cannot be added");
			assert.strictEqual(messageObject.getCode(), 5234, "Message with correcct MessageCode created");
			assert.deepEqual(messageObject.getParameters(), ["hierarchyProperty", "stepTitle"], "Correct paramters handed over");
		});
	});
	QUnit.test('Hierarchical step with normal select property already added - add hierarchical step with same requiredFilter', function(assert){
		this.path.addStep(this.hStepWithNormalRequiredFilter);
		this.path.checkAddStep("hierarchicalStep5").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "Hierarchical step normal required property can always be added");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.test('Hierarchical step with normal select property already added - add hierarchical step with hierarchy Property as required filter', function(assert){
		this.path.addStep(this.hStepWithNormalRequiredFilter);
		this.path.checkAddStep("hierarchicalStep1").done(function(bCanAddStep, messageObject){
			assert.strictEqual(bCanAddStep, true, "Hierarchical step normal required property can always be added");
			assert.strictEqual(messageObject, undefined, "No messageObject added");
		});
	});
	QUnit.module("Get path filter information", {
		beforeEach : function(assert) {
			var that = this;
			var Step = function(id) {
				var deferred = jQuery.Deferred();
				this.getFilterInformation = function(oActiveStep, index){
					assert.equal(index, id.charAt(4), "Correct index handed over to step"); //id's are numerated the same as the index
					assert.strictEqual(oActiveStep, that.activeStep, "Active step is handed over to step.getFilterInformation");
					return deferred;
				};
				this.resolvePromise = function(){
					deferred.resolve([{
						text : id
					},{
						text : "filterMapping" + id
					}]);
				};
				this.update = function() {};
			};
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances: {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.oStep0 = new Step("step0");
			this.oStep1 = new Step("step1");
			this.oStep2 = new Step("step2");
			this.oStep3 = new Step("step3");
			this.oPath.addStep(this.oStep0, function() {});
			this.oPath.addStep(this.oStep1, function() {});
			this.oPath.addStep(this.oStep2, function() {});
			this.oPath.addStep(this.oStep3, function() {});
		}
	});
	QUnit.test("First Step is active", function(assert){
		var done = assert.async();
		this.activeStep = this.oStep0;
		this.oPath.makeStepActive(this.oStep0);
		this.oPath.getFilterInformation().then(function(filterInformation){
			assert.deepEqual(filterInformation, [], "Empty Array returned");
			done();
		});
	});
	QUnit.test("Third Step is active", function(assert){
		var done = assert.async();
		this.activeStep = this.oStep2;
		this.oStep0.resolvePromise();
		this.oStep1.resolvePromise();
		this.oPath.makeStepActive(this.oStep2);
		this.oPath.getFilterInformation().then(function(filterInformation){
			assert.deepEqual(filterInformation, [{
				text : "step0"
			},{
				text : "filterMappingstep0"
			}, {
				text : "step1"
			}, {
				text : "filterMappingstep1"
			}], "Correct Array returned");
			done();
		});
	});
	QUnit.test("Third Step is active - async", function(assert){
		var done = assert.async();
		this.activeStep = this.oStep2;
		this.oPath.makeStepActive(this.oStep2);
		this.oPath.getFilterInformation().then(function(filterInformation){
			assert.deepEqual(filterInformation, [{
				text : "step0"
			},{
				text : "filterMappingstep0"
			}, {
				text : "step1"
			}, {
				text : "filterMappingstep1"
			}], "Correct Array returned");
			done();
		});
		this.oStep1.resolvePromise();
		this.oStep0.resolvePromise();
	});
}());