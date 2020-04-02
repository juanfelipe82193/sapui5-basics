sap.ui.define([
	"sap/suite/ui/commons/TimelineItemRenderer",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (TimelineItemRenderer, TimelineItem, TestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineItemRendererTest");

	QUnit.test("_getFormatedDateTime test", function (assert) {
		var today = (new Date()).valueOf();

		var oControl = {
			dateTime: new Date(today),
			getDateTime: function () {
				return this.dateTime;
			},
			getDateTimeWithoutStringParse: function () {
				return this.dateTime;
			}
		};
		var oOptions = {
			dateFormat: {
				format: function () {
					return "<DATE_VALUE>";
				}
			},
			timeFormat: {
				format: function () {
					return "<TIME_VALUE>";
				}
			},
			resBundle: {
				getText: function (sStr) {
					return sStr;
				}
			}
		};
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_TODAY TIMELINE_AT <TIME_VALUE>", "Today formatting.");
		oControl.dateTime = new Date(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() - 1);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_YESTERDAY TIMELINE_AT <TIME_VALUE>", "Yeasterday formatting.");
		oControl.dateTime = new Date(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() - 2);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "<DATE_VALUE> TIMELINE_AT <TIME_VALUE>", "To days ago formatting.");
		oControl.dateTime = new Date(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() + 1);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "<DATE_VALUE> TIMELINE_AT <TIME_VALUE>", "Tomorrow formatting.");
		oControl.dateTime = new Date(today);
		oControl.dateTime.setHours(0, 0, 1, 0);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_TODAY TIMELINE_AT <TIME_VALUE>", "Today 1 sec after midnight.");
		oControl.dateTime = new Date(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() - 1);
		oControl.dateTime.setHours(23, 59, 59, 0);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_YESTERDAY TIMELINE_AT <TIME_VALUE>", "Yeasterday 1 sec before midnight.");
	});

	QUnit.test("TimelineItem with custom style class.", function (assert) {
		var item = new TimelineItem();
		item.addStyleClass("customClass");
		item.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.ok(item.$().hasClass("customClass"), "Custom style class wasn't rendered.");
		item.destroy();
	});

	QUnit.test("TimelineItem with custom message.", function (assert) {
		var customMessage = "Custom message";
		var item = new TimelineItem();
		item.setCustomMessage(customMessage);
		item.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(item.$("infoBar").text(), customMessage, "Custom message should be visible.");
		item.destroy();
	});

	QUnit.test("Correct single item invalidation", function (assert) {
		// test that after items' invalidation the whole recalculation is done
		var data = [
			{
				dateTime: new Date(2016, 0, 1)
			}, {
				dateTime: new Date(2016, 0, 2)
			}, {
				dateTime: new Date(2016, 0, 3)
			}, {
				dateTime: new Date(2016, 0, 4)
			}, {
				dateTime: new Date(2016, 0, 5)
			}
		];

		var timeline = TestUtils.buildTimeline(data, {
			enableDoubleSided: true
		}, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		timeline.getContent()[0].invalidate();
		timeline.getContent()[1].invalidate();
		timeline.getContent()[2].invalidate();
		sap.ui.getCore().applyChanges();

		var $oddItems = timeline.$().find(".sapSuiteUiCommonsTimelineItemOdd");
		var $evenItems = timeline.$().find(".sapSuiteUiCommonsTimelineItemEven");
		assert.equal($oddItems.size(), 3, "1 odd items must be rendered.");
		assert.equal($evenItems.size(), 2, "1 even items must be rendered.");

	});
});
