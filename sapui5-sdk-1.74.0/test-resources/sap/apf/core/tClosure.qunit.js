(function() {
	'use strict';

	QUnit.module('Closure without recursion', {
		beforeEach : function(assert) {
			/**
			 * this now is a projected copy of the path object
			 */
			var nUpdateCounter = 0;
			var aStepInstances = [];
			for(var inx = 0; inx < 4; ++inx) {
				aStepInstances[inx] = {
					type : "oCurrentStep",
					id : inx
				};
			}
			this.getInstances = function() {
				return aStepInstances;
			};

			/**
			 * @description  copy of update function and callbackAfterRequest function
			 * @param fnStepProcessedCallback 
			 */
			this.update = function(fnStepProcessedCallback) {
				/** this is our closure object for callbackAfterRequest */
				var nCurrentUpdateCount;
				var oCurrentStep = aStepInstances[0];

				function callbackAfterRequest(oData) {
					var nIndexOfCurrentStep = aStepInstances.indexOf(oCurrentStep);
					if (nCurrentUpdateCount >= nUpdateCounter) { // race condition
						oCurrentStep.setData = "ok";
						oCurrentStep.nCurrentUpdateCount = nCurrentUpdateCount; // patch: pass out internal state!!
						oCurrentStep.instances = aStepInstances;
						fnStepProcessedCallback(oCurrentStep);
						oCurrentStep = aStepInstances[nIndexOfCurrentStep + 1];

						if (oCurrentStep) { // defined if index in array bounds
							oCurrentStep.recursionStart = "true";
						}
					}
				}
				/** nCurrentUpdateCount receives a unique value at the beginning of each ! update sequence */
				nCurrentUpdateCount = ++nUpdateCounter;
				callbackAfterRequest({
					type : "param of callbackAfterRequest"
				});
			};

		}
	});
	QUnit.test('Closure has correct state of update sequence', function(assert) {
		var fnStepProcessedCallback = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep, oStep.instances[0], "first obj of array");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 1, " correct path race condition value: " + oStep.nCurrentUpdateCount);
		};
		this.update(fnStepProcessedCallback);
		assert.equal(this.getInstances()[1].recursionStart, "true", " enters correct branch ");
	});

	//--------------------------------------------------------------------------------------
	QUnit.module('Closure recursive', {
		beforeEach : function(assert) {
			/**
			 * this now is a projected copy of the path object
			 */
			var nUpdateCounter = 0;
			var aStepInstances = [];
			for(var inx = 0; inx < 4; ++inx) {
				aStepInstances[inx] = {
					type : "oCurrentStep",
					id : inx,
					pathEnv : this
				};
			}
			this.getInstances = function() {
				return aStepInstances;
			};

			/**
			 * @description  copy of update function and callbackAfterRequest function
			 * @param fnStepProcessedCallback 
			 */
			this.update = function(fnStepProcessedCallback, sTurn) {
				/** this is our closure object for callbackAfterRequest */
				var nCurrentUpdateCount;
				var oCurrentStep = aStepInstances[0];

				function callbackAfterRequest(oData) {
					var nIndexOfCurrentStep = aStepInstances.indexOf(oCurrentStep);
					if (nCurrentUpdateCount >= nUpdateCounter) { // race condition
						oCurrentStep.setData = "ok";
						oCurrentStep.sTurn = sTurn;
						oCurrentStep.nCurrentUpdateCount = nCurrentUpdateCount; // patch: pass out internal state!!
						oCurrentStep.instances = aStepInstances;
						fnStepProcessedCallback(oCurrentStep);
						oCurrentStep = aStepInstances[nIndexOfCurrentStep + 1];

						if (oCurrentStep) {
							oCurrentStep.recursionStart = "true";
						}
					}
				}
				/** nCurrentUpdateCount receives once and for all a unique value at the beginning of each ! update sequence */
				nCurrentUpdateCount = ++nUpdateCounter;
				callbackAfterRequest({
					type : "param of callbackAfterRequest"
				});
			};

		}
	});
	QUnit.test('Closure has correct state of update sequence', function(assert) {
		var fnStepProcessedCallback = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 1, " correct path race condition value: " + oStep.nCurrentUpdateCount + " of step: " + oStep.id);
		};
		this.update(fnStepProcessedCallback, "turn1");
		assert.ok(true, "true");
	});

	QUnit.test('Each closure keeps state of its initial mUpdateCounter value', function(assert) {
		var fnStepProcessedCallback1 = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 1, oStep.sTurn + " correct path race condition value: " + oStep.nCurrentUpdateCount + " of step: " + oStep.id);
		};
		var fnStepProcessedCallback2 = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 2, oStep.sTurn + " correct path race condition value: " + oStep.nCurrentUpdateCount + " of step: " + oStep.id);
		};
		this.update(fnStepProcessedCallback1, "turn1");
		this.update(fnStepProcessedCallback2, "turn2");
	});

	QUnit.test('Interleave Semantics: trigger another update when processing step 2 during the first update', function(assert) {
		var fnStepProcessedCallback2 = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 2, oStep.sTurn + " : race condition value: " + oStep.nCurrentUpdateCount + " of step: " + oStep.id);
		};
		var fnStepProcessedCallback1 = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 1, oStep.sTurn + " : race condition value: " + oStep.nCurrentUpdateCount + " of step: " + oStep.id);

			if (oStep.id === 1) {
				oStep.pathEnv.update(fnStepProcessedCallback2, "turn2");
			}
		};
		this.update(fnStepProcessedCallback1, "turn1");
	});

	QUnit.test('Interleave Semantics: trigger another update when processing step 2 during the first update', function(assert) {
		var fnStepProcessedCallback2 = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 2, oStep.sTurn + " : race condition value: " + oStep.nCurrentUpdateCount + " of step: " + oStep.id);
		};
		var fnStepProcessedCallback1 = function(oStep) {
			assert.ok(oStep, "fnStepProcessedCallback param defined");
			assert.equal(oStep.setData, "ok", " oStep handled");
			assert.equal(oStep.nCurrentUpdateCount, 1, oStep.sTurn + " : race condition value: " + oStep.nCurrentUpdateCount + " of step: " + oStep.id);

			if (oStep.id === 1) {
				oStep.pathEnv.update(fnStepProcessedCallback2, "turn2");
			}
		};
		this.update(fnStepProcessedCallback1, "turn1");
	});
}());