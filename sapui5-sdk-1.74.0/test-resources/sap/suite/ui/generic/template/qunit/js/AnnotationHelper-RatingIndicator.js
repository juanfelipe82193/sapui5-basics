sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		module("Test Methods for Rating Indicator formatters", {

			setup: function () {
				this.oAnnotationHelper = AnnotationHelper;
				this.oControl = new sap.ui.core.Control();
				this.oControl.getModel = function () {
					var oResourceModel = new sap.ui.model.resource.ResourceModel({
						bundleName: "sap.suite.ui.generic.template.lib.i18n.i18n"
					});
					return oResourceModel;
				};
				this.oControl.getCustomData = function () {
					return [];
				};
			},

			teardown: function () {
				this.oAnnotationHelper = null;
				this.oControl = null;
//					sap.ui.model.odata.AnnotationHelper.format.restore();

			}
		});

		QUnit.test("check method formatRatingIndicatorFooterText", function () {
			var sExpectedFooterText = "", sActualFooterText = "", sI18nText = " out of ";
			sinon.stub(sap.m.Label.prototype, "getModel", function () {
				return {
					getResourceBundle: function () {
						return {
							getText: function (sKey, aText) {
								return aText[0] + sI18nText + aText[1];
							}
						}
					}
				}
			});

			var oLabel = new sap.m.Label();
			var oVBox = new sap.m.VBox({
				items: [new sap.m.RatingIndicator(), oLabel]
			});
			var aText = [
				{
					sValue: "2",
					sMaxValue: "5",
					customData: undefined
				},
				{
					sValue: "1",
					sMaxValue: undefined,
					customData: new sap.ui.core.CustomData({
						value: "3"
					})
				},
				{
					sValue: "5",
					sMaxValue: undefined,
					customData: undefined
				}
			].forEach(function (obj) {
				sExpectedFooterText = obj.sValue + sI18nText;
				if (obj.customData) {
					oLabel.addCustomData(obj.customData);
					sExpectedFooterText += oLabel.data("Footer");
				}
				else if (obj.sMaxValue) {
					sExpectedFooterText += obj.sMaxValue;
				}
				else {
					sExpectedFooterText += "5";
				}
				sActualFooterText = this.oAnnotationHelper.formatRatingIndicatorFooterText.apply(oLabel, [obj.sValue, obj.sMaxValue]);
				assert.equal(sActualFooterText, sExpectedFooterText, "'" + sActualFooterText + "' returned correctly from with custom data as '" + (obj.customData && obj.customData.getValue()) + "' and max value as '" + obj.sMaxValue + "'");

				oLabel.removeAllCustomData();

			}.bind(this));

			oVBox.destroy();
			sap.m.Label.prototype.getModel.restore();

		});


		[
			{
				description: "Verify formatRatingIndicatorAggregatedCount with value resolved from a navigation path",
				expected: "(100)",
				value: "100",
				customData: undefined
			},
			{
				description: "Verify formatRatingIndicatorAggregatedCount with value is a primitive type and navigation path resolves to undefined",
				expected: "(101)",
				value: undefined,
				customData: [new sap.ui.core.CustomData({
					value: "101",
					key: "AggregateCount"
				})]
			},
			{
				description: "Verify formatRatingIndicatorAggregatedCount with undefined value",
				expected: "",
				value: undefined,
				customData: undefined
			}

		].forEach(function (mTest) {
			QUnit.test(mTest.description, function () {

				if (mTest.customData) {
					this.oControl.getCustomData = function () {
						return mTest.customData;
					};

					this.oControl.addCustomData(mTest.customData[0]);
				}

				var sActualAggegatedCount = this.oAnnotationHelper.formatRatingIndicatorAggregateCount.apply(this.oControl, [mTest.value]);
				assert.equal(sActualAggegatedCount, mTest.expected, "The aggregated count " + mTest.expected + " is correct");

			});
		}.bind(this));
});
