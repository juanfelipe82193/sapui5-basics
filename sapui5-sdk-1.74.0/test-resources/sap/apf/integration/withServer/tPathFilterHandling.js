/* This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. */
(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.integration.withServer.tPathFilterHandling");

	jQuery.sap.require('sap.apf.testhelper.authTestHelper');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.testhelper.config.configurationForIntegrationTesting');
	jQuery.sap.require('sap.apf.internal.server.userData');

	if (!sap.apf.integration.withServer.tPathFilterHandling) {
		sap.apf.integration.withServer.tPathFilterHandling = {};
		sap.apf.integration.withServer.commonSetupAsPromise = function(oContext) {
			var sUrl =  "/apf-test/test-resources/sap/apf/integration/withServer/integrationTestingApplicationConfiguration.json";
			return sap.apf.testhelper.createComponentAsPromise(oContext, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : sUrl});
		};
	}
	QUnit.module('Path with 3 steps', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.integration.withServer.commonSetupAsPromise(this).done(function(){

				this.oApi.resetPath();
				this.startFilter = this.oApi.createFilter();
				this.topAnd = this.startFilter.getTopAnd();
				this.defineFilterOperators();
				this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
					this.addFilterToPath('SAPClient', [ '777' ]);
					done();
				}.bind(this));
			}.bind(this));
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		},
		defineFilterOperators : function() {
			jQuery.extend(this, this.startFilter.getOperators());
		},
		addFilterToPath : function(propertyName, values) {
			var that = this;
			var filter = this.oApi.createFilter();
			var or;
			if (values.length === 1) {
				filter.getTopAnd().addExpression({
					name : propertyName,
					operator : this.EQ,
					value : values[0]
				});
			} else {
				values.forEach(function(singleValue) {
					if (!or) {
						or = filter.getTopAnd().addOr().addExpression({
							name : propertyName,
							operator : that.EQ,
							value : singleValue
						});
					} else {
						or.addExpression({
							name : propertyName,
							operator : that.EQ,
							value : singleValue
						});
					}
				});
			}
			this.oApi.addPathFilter(filter);
		},
		addDefaultStartFiltersToPath : function() {
			this.addFilterToPath('P_SAPClient', [ '777' ]);
			this.addFilterToPath('SAPClient', [ '777' ]);
			this.addFilterToPath('P_FromDate', [ "20130601" ]);
			this.addFilterToPath('P_ToDate', [ "20140630" ]);
			this.addFilterToPath('P_AgingGridMeasureInDays', [ 10 ]);
			this.addFilterToPath('P_DisplayCurrency', [ 'USD' ]);
			this.addFilterToPath('P_ExchangeRateType', [ 'M' ]);
			this.addFilterToPath('P_NetDueArrearsGridMeasureInDays', [ '10' ]);
			this.addFilterToPath('P_NetDueGridMeasureInDays', [ '10' ]);
			this.addFilterToPath('P_ExchangeRateDate', [ '00000000' ]);
		},
		addThreeStepsToPath : function(fnCallback) {
			function addStep3(oStep) {
				if (oStep === this.step2) {
					this.step3 = this.oApi.createStep("stepTemplate1", fnCallback.bind(this));
				}
			}
			function addStep2() {
				this.step2 = this.oApi.createStep("stepTemplate1", addStep3.bind(this));
			}
			this.step1 = this.oApi.createStep("stepTemplate1", addStep2.bind(this));
		},
		lengthComparison : function(oBeforeData, oAfterStep) {
			return ' (number of records before selection = ' + oBeforeData.length + ' and after selection = ' + oAfterStep.getSelectedRepresentation().aDataResponse.length + ')';
		},
		step1 : {},
		step2 : {},
		step3 : {}
	});
	QUnit.test("Single selection in 2nd step", function(assert) {
		var done = assert.async();
		this.addDefaultStartFiltersToPath();
		this.addThreeStepsToPath(startTest.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var callbackCounter = 0;
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			function callbackForUpdatePath(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "No change on the first step");
					break;
				case this.step2:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step2DataBeforeChange.length, "No change on the second step");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, "Changed filter on second step reduced data of last step");
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			}
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
			this.oApi.updatePath(callbackForUpdatePath.bind(this));
		}
	});
	QUnit.test("Filter mapping from country to customers without preserving country filter", function(assert) {
		/* special forward properties required for this filter mapping test:
		 *  - specialVS6RequestsForFilterMapping.pattern=^/tmp/wca/online_test_app/
		 *  - specialVS6RequestsForFilterMapping.target=<vs6>/tmp/wca/online_test_app/
		 */
		var done = assert.async();
		this.addDefaultStartFiltersToPath();
		addStepsToPath.call(this, startTest.bind(this));
		function addStepsToPath(fnStartTest) {
			function addStep3(oStep) {
				if (oStep === this.step2) {
					this.step3 = this.oApi.createStep("mappingResultForCustomer", fnStartTest.bind(this));
				}
			}
			function addStep2() {
				this.step2 = this.oApi.createStep("mappingResultForCustomer", addStep3.bind(this));
			}
			this.step1 = this.oApi.createStep("filterMapping", addStep2.bind(this));
		}
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var callbackCounter = 0;
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			function callbackForUpdatePath(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, 'No change on the first step' + this.lengthComparison(step1DataBeforeChange, oStep));
					break;
				case this.step2:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, 'Mapped filter on 1st step reduced data on 2nd step' + this.lengthComparison(step2DataBeforeChange, oStep));
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, 'Mapped filter on 1st step reduced data on 3rd step' + this.lengthComparison(step3DataBeforeChange, oStep));
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCountry);
			this.oApi.updatePath(callbackForUpdatePath.bind(this));
		}
	});
	QUnit.test("Filter mapping from country to customers. Country filter preserved", function(assert) {
		/* special forward properties required for this filter mapping test:
		 *  - specialVS6RequestsForFilterMapping.pattern=^/tmp/wca/online_test_app/
		 *  - specialVS6RequestsForFilterMapping.target=http://ld9408:8000/tmp/wca/online_test_app/
		 */
		var that = this;
		var done = assert.async();
		this.addDefaultStartFiltersToPath();
		addStepsToPath.call(that, startTest.bind(this));
		function addStepsToPath(fnStartTest) {
			function addStep3(oStep) {
				if (oStep === this.step2) {
					this.step3 = this.oApi.createStep("mappingResultForCountry", fnStartTest.bind(this));
				}
			}
			function addStep2() {
				this.step2 = this.oApi.createStep("mappingResultForCustomer", addStep3.bind(this));
			}
			this.step1 = this.oApi.createStep("filterMappingKeepSource", addStep2.bind(this));
		}
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var callbackCounter = 0;
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			function callbackForUpdatePath(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, 'No change on the first step' + this.lengthComparison(step1DataBeforeChange, oStep));
					break;
				case this.step2:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, 'Mapped filter on 1st step reduced data on 2nd step' + this.lengthComparison(step2DataBeforeChange, oStep));
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, 'Preserved filter from 1st step reduced data on 3rd step' + this.lengthComparison(step3DataBeforeChange, oStep));
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCountry);
			this.oApi.updatePath(callbackForUpdatePath.bind(this));
		}
	});
	QUnit.test("Selection on first step exists, selection for another step created", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "No change on the first step");
					break;
				case this.step2:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step2DataBeforeChange.length, "No change on the second step");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, "Changed filter on second step reduced data of last step");
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			};
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
			this.oApi.updatePath(callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.oApi.setActiveStep(this.step2);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
	QUnit.test("Path contains steps with selection, new selection on first step, ", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "No change on the first step");
					break;
				case this.step2:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, "Changed first step filter reduced data of second step");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, "Changed first step filter reduced data of third step");
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			};
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
			this.oApi.updatePath(callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.oApi.setActiveStep(this.step2);
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
	QUnit.test("No initial selection on 1st step - delete step in the middle of analysis path - change on data of last step", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter before deleted step has not changed");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Restrictions from second step have been removed and filter for steps after the deleted step has been changed");
					break;
				}
				if (callbackCounter === 2) {
					done();
				}
			};
			this.oApi.removeStep(this.step2, callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
			this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
	QUnit.test("Delete step in the middle of analysis path, that has initial selection - no effect on data of last step", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter before deleted step has not changed");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length === step3DataBeforeChange.length, "Filter after deleted step has not changed");
					break;
				}
				if (callbackCounter === 2) {
					done();
				}
			};
			this.oApi.removeStep(this.step2, callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
	QUnit.test("Delete step at the end of the path - no effect on data for prior steps", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "Filter for step one has not changed");
					break;
				case this.step2:
					assert.equal(oStep.getSelectedRepresentation().aDataResponse.length, step2DataBeforeChange.length, "Filter for step two has not changed");
					break;
				}
				if (callbackCounter === 2) {
					done();
				}
			};
			this.oApi.removeStep(this.step3, callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
			this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
	QUnit.test("Move last analysis step to position just before the first step (move up operation)", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step1DataBeforeChange.length, "First step has restrictions from third step");
					break;
				case this.step2:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, "Second step gets restrictions from first step");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Third step is now first step in path with no restrictions");
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			};
			this.oApi.moveStepToPosition(this.step3, 0, callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
			this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
	QUnit.test("First step - move last analysis step to position just before the first step", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter for first step has not changed");
					break;
				case this.step2:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length === step2DataBeforeChange.length, "Filter for second step has not changed");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Third step is now first step in path with no restrictions");
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			};
			this.oApi.moveStepToPosition(this.step3, 0, callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
	QUnit.test("Move analysis step from the middle to the last position in the path (move down operation) - data on 2nd and 3rd step changed", function(assert) {
		var done = assert.async();
		this.addThreeStepsToPath(startTestSetup.bind(this));
		function startTest(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
			var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
			var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
			var callbackCounter = 0;
			var callbackForUpdatePath = function(oStep) {
				callbackCounter++;
				switch (oStep) {
				case this.step1:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter for first step has not changed");
					break;
				case this.step2:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, "Filter for second step, which is now last step in path, has changed");
					break;
				case this.step3:
					assert.ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Filter for third step, which is now second step in path, has changed");
					break;
				}
				if (callbackCounter === 3) {
					done();
				}
			};
			this.oApi.moveStepToPosition(this.step2, 2, callbackForUpdatePath.bind(this));
		}
		function startTestSetup(oStep) {
			if (oStep !== this.step3) {
				return;
			}
			this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
			this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
			this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
			this.oApi.updatePath(startTest.bind(this));
		}
	});
}());