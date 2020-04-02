sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		var aCustomData = [];
		var sValue;
		var sTarget;
		var sUoM;
		var sExpectedDisplayValue;
		var sDisplayValue;
		var sTargetValue = undefined;
		var sKeyValue = undefined;
		this.oAnnotationHelper = AnnotationHelper;
		var oAnnotationHelper = this.oAnnotationHelper;
		module("Test Methods for ProgressIndicator Display Value", {
			setup: function () {


				sinon.stub(sap.ui.model.odata.AnnotationHelper, "simplePath", function (oInterface, oProperty) {
					return "{State}";
				});

				AnnotationHelper.getModel = function () {
					var oResourceModel = new sap.ui.model.resource.ResourceModel({
						bundleName: "sap.suite.ui.generic.template.lib.i18n.i18n"
					});
					return oResourceModel;
				};

				AnnotationHelper.getCustomData = function () {
					return aCustomData;
				};

				aCustomData = [{
					getValue: function () {
						return sTargetValue;
					}, getKey: function () {
						return "Target";
					}
				}, {
					getValue: function () {
						return sKeyValue;
					}, getKey: function () {
						return "UoM";
					}
				}];


			},

			teardown: function () {
				aCustomData = [];
				sValue = "";
				sTarget = "";
				sUoM = "";
				sExpectedDisplayValue = "";
				sDisplayValue = "";
				sTargetValue = undefined;
				sKeyValue = undefined;
				this.oAnnotationHelper = null;
				sap.ui.model.odata.AnnotationHelper.simplePath.restore();
			},

			oInterface: {
				getModel: function () {
					return undefined;
				},
				getPath: function () {
					return "";
				},
				getSetting: function () {
					return "";
				}
			},

			oDataPoint: {
				Value: {
					EdmType: "Edm.Decimal",
					Path: "Progress"
				}
			}
		});

		test("Method buildExpressionForProgressIndicatorDisplayValue: UoM is '%'", function () {

			var oInterface = this.oInterface;
			var oDataPoint = this.oDataPoint;
			var sUoM = '%';

			var sExpectedExpression = "{ parts: [{path: 'Progress'}, {path: 'undefined'}, {path: 'Unsupported: '%''}], formatter: 'sap.suite.ui.generic.template.js.AnnotationHelper.formatDisplayValue' }";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorDisplayValue(oInterface, oDataPoint, sUoM);
			equals(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		test("Method formatDisplayValue: Value is numeric, uom is '%'", function () {
			sValue = "20";
			sUoM = "%";
			sExpectedDisplayValue = "20 %";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

			sUoM = undefined;
			sKeyValue = "%";
			sExpectedDisplayValue = "20 %";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);

		});

		test("Method formatDisplayValue: Value is numeric, uom is not '%'', target is provided)", function () {
			sValue = "20";
			sTarget = "100";
			sUoM = "GB";
			sExpectedDisplayValue = "20 of 100 GB";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

			sTarget = undefined;
			sUoM = undefined;
			sTargetValue = "40";
			sKeyValue = "CM";
			sExpectedDisplayValue = "20 of 40 CM";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);

		});

		test("Method formatDisplayValue: (value is numeric, target is undefined, uom is defined)", function () {
			sValue = "20";
			sUoM = "GB";
			sExpectedDisplayValue = "20 GB";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

			sUoM = undefined;
			sKeyValue = "CM";
			sExpectedDisplayValue = "20 CM";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);
		});

		test("Method formatDisplayValue: Value is numeric, target is defined, uom is undefined", function () {
			sValue = "20";
			sTarget = "100";
			sExpectedDisplayValue = "20 of 100";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

			sTarget = undefined;
			sTargetValue = 80;
			sExpectedDisplayValue = "20 of 80";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);

		});

		test("Method formatDisplayValue: Value is numeric, target is undefined, uom is undefined", function () {
			var sValue = "20";
			var sExpectedDisplayValue = sValue;
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Returned the expected display value: " + sExpectedDisplayValue);
		});

		test("Method formatDisplayValue: Value is 0, target is null, uom is 'PCS'", function () {
			sValue = 0;
			sTarget = null;
			sUoM = "PCS";
			sExpectedDisplayValue = "0 PCS";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Returned the expected display value: " + sExpectedDisplayValue);
		});

		test("Method formatDisplayValue: Negative Tests (value is undefined)", function () {
			sExpectedDisplayValue = "";
			sDisplayValue = oAnnotationHelper.formatDisplayValue(sValue, sTarget, sUoM);
			equals(sDisplayValue, sExpectedDisplayValue, "Returned the expected display value: " + sExpectedDisplayValue);
		});

		module("Test Methods for Progress Indicator Criticality", {
			setup: function () {
				this.oAnnotationHelper = AnnotationHelper;
				sinon.stub(sap.ui.model.odata.AnnotationHelper, "simplePath", function (oInterface, oProperty) {
					return "{State}";
				});
			},

			teardown: function () {
				this.oAnnotationHelper = null;
				sap.ui.model.odata.AnnotationHelper.simplePath.restore();
			},

			oInterface: {
				getModel: function () {
					return undefined;
				},
				getPath: function () {
					return "";
				},
				getSetting: function () {
					return "";
				}
			},

			oDataPoint: {
				Criticality: {
					EdmType: "Edm.String",
					Path: "State"
				}
			}
		});

		test("Method buildExpressionForProgressIndicatorCriticality: Criticality is EnumMember", function () {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					EnumMember: "UI.CriticalityType/Negative"
				}
			};

			var sExpectedExpression = "{= ('UI.CriticalityType/Negative' === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || ('UI.CriticalityType/Negative' === '1') || ('UI.CriticalityType/Negative' === 1) ? 'Error' : ('UI.CriticalityType/Negative' === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || ('UI.CriticalityType/Negative' === '2') || ('UI.CriticalityType/Negative' === 2) ? 'Warning' : ('UI.CriticalityType/Negative' === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || ('UI.CriticalityType/Negative' === '3') || ('UI.CriticalityType/Negative' === 3) ? 'Success' : 'None' }";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			equals(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		test("Method buildExpressionForProgressIndicatorCriticality: Criticality is path (EnumMember or Value)", function () {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					Path: "State"
				}
			};

			var sExpectedExpression = "{= (${State} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${State} === '1') || (${State} === 1) ? 'Error' : (${State} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${State} === '2') || (${State} === 2) ? 'Warning' : (${State} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${State} === '3') || (${State} === 3) ? 'Success' : 'None' }";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			equals(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is String", function () {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					String: "UI.CriticalityType/Negative"
				}
			};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			equals(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is Value", function () {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					Value: "2"
				}
			};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			equals(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is not EnumMember or Path", function () {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					Negative: "Test"
				}
			};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			equals(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is undefined", function () {
			var oInterface = this.oInterface;
			var oDataPoint = {};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			equals(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});
	});
