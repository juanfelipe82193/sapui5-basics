sap.ui.define([
	"jquery.sap.global",
	"./TimelineTestUtils",
	"sap/suite/ui/commons/TimelineRenderManagerTimestamp",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (
	$,
	TestUtils,
	TimelineRenderManagerTimestamp,
	sinon,
	sinon_qunit,
	createAndAppendDiv
) {
	/* eslint max-statements: 0 */
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineRenderManagerTimestamp-integration");

	QUnit.test("Range type select contains timestamp option.", function (assert) {
		var select;
		var timeline = TestUtils.buildTimeline([], {});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		select = timeline._objects.getTimeFilterSelect();

		assert.ok(select.getAggregation("items").length === 5, "Use 5 diferent time ranges");
		assert.ok(select.getAggregation("items")[4].getText() === "Custom Range", "Timestamp is on the last positioni");

		timeline.destroy();
	});

	QUnit.test("Timestamp filter panel created.", function (assert) {
		//Invisible items broke Timeline rendering.
		var timeline = TestUtils.buildTimeline([], {});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.ok($.isFunction(timeline._objects.getTimestampFilterPicker));
		assert.equal(timeline._objects.getTimestampFilterPicker().getMetadata().getName(), "sap.suite.ui.commons.TimelineRenderManagerTimestamp");

		timeline.destroy();
	});

	QUnit.test("Defined _endDate property is dynamic.", function (assert) {
		//Invisible items broke Timeline rendering.
		var test = 1;
		var timeline = TestUtils.buildTimeline([], {});
		timeline.placeAt("content");

		timeline._endDate = new Date(0);
		assert.strictEqual(timeline._endDate.getTime(), 0);

		timeline._endDate = null;
		assert.strictEqual(timeline._endDate, null);

		timeline._endDate = function () {
			return test + 1;
		};
		assert.strictEqual(timeline._endDate, 2);

		timeline.destroy();
	});

	QUnit.module("TimelineRenderManager.toggleGroupTypeSelector");

	QUnit.test("Use grouping slider panel", function (assert) {
		var timeline = TestUtils.buildTimeline([], {});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		sinon.spy(timeline._objects.getTimestampFilterPicker(), "setVisible");
		sinon.spy(timeline._objects.getTimeRangeSlider(), "setVisible");

		timeline.toggleGroupTypeSelector("Day");

		assert.ok(timeline._objects.getTimestampFilterPicker().setVisible.calledWithExactly(false));
		assert.ok(timeline._objects.getTimeRangeSlider().setVisible.calledWithExactly(true));

		timeline.destroy();
	});

	QUnit.test("Use range selector panel", function (assert) {
		var timeline = TestUtils.buildTimeline([], {});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		sinon.spy(timeline._objects.getTimestampFilterPicker(), "setVisible");
		sinon.spy(timeline._objects.getTimeRangeSlider(), "setVisible");

		timeline.toggleGroupTypeSelector("None");

		assert.ok(timeline._objects.getTimestampFilterPicker().setVisible.calledWithExactly(true));
		assert.ok(timeline._objects.getTimeRangeSlider().setVisible.calledWithExactly(false));

		timeline.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp#constructor");

	QUnit.test("getText method created from resourceBundle", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": sinon.stub().returns("TEXT")
		};
		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		assert.equal(timelineRenderManagerTimestamp.getText(), "TEXT", "getText method created");
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("getID property created", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": sinon.stub().returns("TEXT")
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

		assert.equal(timelineRenderManagerTimestamp.getId(), "ID", "getId method returns passed ID");
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("Factory methods registered", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": sinon.stub().returns("TEXT")
		};

		sinon.spy(TimelineRenderManagerTimestamp.prototype._createTimestampPanelPicker, "bind");
		sinon.spy(TimelineRenderManagerTimestamp.prototype._createTimestampPanelRadio, "bind");

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

		assert.ok($.isFunction(timelineRenderManagerTimestamp.getTimestampPanelPicker));
		assert.ok($.isFunction(timelineRenderManagerTimestamp.getTimestampPanelRadio));

		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp._createTimestampPanelPicker");

	QUnit.test("Contains timepickers and labels", function (assert) {
		var timestampPanelPicker;
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		timestampPanelPicker = timelineRenderManagerTimestamp.getTimestampPanelPicker();
		assert.strictEqual(
			timestampPanelPicker.getContent().filter(function (ctl) {
				return ctl.getMetadata().getName() === "sap.m.Label" &&
					!ctl.hasStyleClass("sapSuiteUiCommonsTimelineRangeLabelNow");
			}).length,
			2,
			"Panel contains two labels "
		);
		assert.strictEqual(
			timestampPanelPicker.getContent().filter(function (ctl) {
				return ctl.getMetadata().getName() === "sap.m.Label" &&
					ctl.hasStyleClass("sapSuiteUiCommonsTimelineRangeLabelNow");
			}).length,
			2,
			"Panel contains two NOW labels "
		);
		assert.strictEqual(
			timestampPanelPicker.getContent().filter(function (ctl) {
				return ctl.getMetadata().getName() === "sap.m.DateTimePicker";
			}).length,
			2,
			"Panel contains two DateTimePickers"
		);
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("Classes applied to the panel controls", function (assert) {
		var timestampPanelPicker;
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		timestampPanelPicker = timelineRenderManagerTimestamp.getTimestampPanelPicker();
		assert.strictEqual(
			timestampPanelPicker.getContent().filter(function (ctl) {
				return ctl.getMetadata().getName() === "sap.m.DateTimePicker" &&
					ctl.hasStyleClass("sapSuiteUiCommonsTimelineRangeDatePicker");
			}).length,
			2
		);
		assert.ok(timestampPanelPicker.hasStyleClass("sapSuiteUiCommonsTimelineRangeFilterPanel"));
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp._createTimestampPanelRadio");

	QUnit.test("Contains three radio buttons", function (assert) {
		var timestampPanelRadio;
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		timestampPanelRadio = timelineRenderManagerTimestamp.getTimestampPanelRadio();
		assert.equal(timestampPanelRadio.getContent().length, 1);
		assert.equal(timestampPanelRadio.getContent()[0].getMetadata().getName(), "sap.m.RadioButtonGroup");
		assert.strictEqual(
			timestampPanelRadio.getContent()[0].getButtons().filter(function (ctl) {
				return ctl.getMetadata().getName() === "sap.m.RadioButton";
			}).length,
			3
		);
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("Generate different id for two instances", function (assert) {
		var timestampPanelRadio1;
		var timestampPanelRadio2;
		var timelineRenderManagerTimestamp1;
		var timelineRenderManagerTimestamp2;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp1 = new TimelineRenderManagerTimestamp("ID1", undefined, undefined, resourceBundle);
		timelineRenderManagerTimestamp2 = new TimelineRenderManagerTimestamp("ID2", undefined, undefined, resourceBundle);
		timestampPanelRadio1 = timelineRenderManagerTimestamp1.getTimestampPanelRadio();
		timestampPanelRadio2 = timelineRenderManagerTimestamp2.getTimestampPanelRadio();
		assert.notEqual(timestampPanelRadio1.getId(), timestampPanelRadio2.getId());
		timelineRenderManagerTimestamp1.destroy();
		timelineRenderManagerTimestamp2.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp.resizeDialog");

	QUnit.test("Resize the dialog", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};
		var objects = {
			"getFilterContent": sinon.stub().returns({
				"_getDialog": sinon.stub().returns({
					"setContentWidth": sinon.stub()
				})
			})
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		timelineRenderManagerTimestamp.resizeDialog(objects);

		assert.ok(objects.getFilterContent()._getDialog().setContentWidth.calledWithExactly("50em"));

		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp.setVisible");

	QUnit.test("Show range panel", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		timelineRenderManagerTimestamp.getTimestampPanelPicker();
		timelineRenderManagerTimestamp.getTimestampPanelRadio();

		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker(), "setVisible");
		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelRadio(), "setVisible");

		timelineRenderManagerTimestamp.setVisible(true);

		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelPicker().setVisible.calledWith(true));
		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelRadio().setVisible.calledWith(true));

		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("Hide range panel", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker(), "setVisible");
		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelRadio(), "setVisible");

		timelineRenderManagerTimestamp.setVisible(false);

		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelPicker().setVisible.calledWith(false));
		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelRadio().setVisible.calledWith(false));

		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp.setPickerView");

	QUnit.test("Show range view", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};
		var pickerPanel = {
			"getContent": sinon.stub().returns([
				null,
				{
					"setVisible": sinon.stub()
				},
				{
					"setVisible": sinon.stub()
				},
				null,
				{
					"setVisible": sinon.stub()
				},
				{
					"setVisible": sinon.stub()
				}
			])
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

		timelineRenderManagerTimestamp.setPickerView(0, pickerPanel);

		assert.ok(pickerPanel.getContent()[1].setVisible.calledWith(false));
		assert.ok(pickerPanel.getContent()[2].setVisible.calledWith(true));
		assert.ok(pickerPanel.getContent()[4].setVisible.calledWith(false));
		assert.ok(pickerPanel.getContent()[5].setVisible.calledWith(true));
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("Show starting date view", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};
		var pickerPanel = {
			"getContent": sinon.stub().returns([
				null,
				{
					"setVisible": sinon.stub()
				},
				{
					"setVisible": sinon.stub()
				},
				null,
				{
					"setVisible": sinon.stub()
				},
				{
					"setVisible": sinon.stub()
				}
			])
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		timelineRenderManagerTimestamp.setPickerView(1, pickerPanel);
		assert.ok(pickerPanel.getContent()[1].setVisible.calledWith(false));
		assert.ok(pickerPanel.getContent()[2].setVisible.calledWith(true));
		assert.ok(pickerPanel.getContent()[4].setVisible.calledWith(true));
		assert.ok(pickerPanel.getContent()[5].setVisible.calledWith(false));
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("Show ending date view", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};
		var pickerPanel = {
			"getContent": sinon.stub().returns([
				null,
				{
					"setVisible": sinon.stub()
				},
				{
					"setVisible": sinon.stub()
				},
				null,
				{
					"setVisible": sinon.stub()
				},
				{
					"setVisible": sinon.stub()
				}
			])
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

		timelineRenderManagerTimestamp.setPickerView(2, pickerPanel);
		assert.ok(pickerPanel.getContent()[1].setVisible.calledWith(true));
		assert.ok(pickerPanel.getContent()[2].setVisible.calledWith(false));
		assert.ok(pickerPanel.getContent()[4].setVisible.calledWith(false));
		assert.ok(pickerPanel.getContent()[5].setVisible.calledWith(true));

		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.test("Hide range panel", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker(), "setVisible");
		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelRadio(), "setVisible");

		timelineRenderManagerTimestamp.setVisible(false);

		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelPicker().setVisible.calledWith(false));
		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelRadio().setVisible.calledWith(false));

		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp.handlerSelectRadioButton");

	QUnit.test("Call setPickerView with index of button", function (assert) {
		var timelineRenderManagerTimestamp;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};
		var ev = {
			"getParameter": sinon.stub().returns("SELECTED_INDEX")
		};


		sinon.stub(TimelineRenderManagerTimestamp.prototype, "setPickerView");

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		sinon.stub(timelineRenderManagerTimestamp, "getTimestampPanelPicker").returns("PANEL_PICKER");

		timelineRenderManagerTimestamp.handlerSelectRadioButton(ev);

		assert.ok(timelineRenderManagerTimestamp.setPickerView.calledWithExactly("SELECTED_INDEX", "PANEL_PICKER"));

		TimelineRenderManagerTimestamp.prototype.setPickerView.restore();
		timelineRenderManagerTimestamp.getTimestampPanelPicker.restore();
		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp.getVisible");

	QUnit.test("Global visibility is depends on sub controls visibility", function (assert) {
		var timelineRenderManagerTimestamp;
		var callback;
		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);
		timelineRenderManagerTimestamp.getTimestampPanelPicker();
		timelineRenderManagerTimestamp.getTimestampPanelRadio();

		callback = sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker(), "getVisible");
		callback.onCall(0).returns(true);
		callback.onCall(1).returns(true);
		callback.onCall(2).returns(false);
		callback.onCall(3).returns(false);

		callback = sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelRadio(), "getVisible");
		callback.onCall(0).returns(true);
		callback.onCall(1).returns(false);
		callback.onCall(2).returns(true);
		callback.onCall(3).returns(false);


		timelineRenderManagerTimestamp.setVisible(true);

		assert.ok(timelineRenderManagerTimestamp.getVisible() === true);
		assert.ok(timelineRenderManagerTimestamp.getVisible() === false);
		assert.ok(timelineRenderManagerTimestamp.getVisible() === false);
		assert.ok(timelineRenderManagerTimestamp.getVisible() === false);

		timelineRenderManagerTimestamp.destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp.destroy");

	QUnit.test("Destroy sub controls", function (assert) {
		var timelineRenderManagerTimestamp;

		var resourceBundle = {
			"getText": function (message) {
				return message;
			}
		};

		timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker(), "destroy");
		sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelRadio(), "destroy");

		timelineRenderManagerTimestamp.destroy();

		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelPicker().destroy.called);
		assert.ok(timelineRenderManagerTimestamp.getTimestampPanelRadio().destroy.called);

		timelineRenderManagerTimestamp.destroy();


		timelineRenderManagerTimestamp.getTimestampPanelPicker().destroy.restore();
		timelineRenderManagerTimestamp.getTimestampPanelRadio().destroy.restore();
		timelineRenderManagerTimestamp.getTimestampPanelPicker().destroy();
		timelineRenderManagerTimestamp.getTimestampPanelRadio().destroy();
	});

	QUnit.module("TimelineRenderManagerTimestamp.getStartDate");

	[{
		"name": "getStartDate",
		"position": 2,
		"descriptions": [
			"Use first Datetime picker to get starting date",
			"Return dynamic datetime if starting picker is hidden"
		]
	}, {
		"name": "getEndDate",
		"position": 5,
		"descriptions": [
			"Use second Datetime picker to get ending date",
			"Return dynamic datetime if ending picker is hidden"
		]
	}].forEach(function (property) {
		QUnit.module("TimelineRenderManagerTimestamp." + property.name);

		QUnit.test(property.descriptions[0], function (assert) {
			var timelineRenderManagerTimestamp;

			var resourceBundle = {
				"getText": function (message) {
					return message;
				}
			};

			timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

			sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker().getContent()[property.position], "getDateValue");
			sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker().getContent()[property.position], "getVisible").returns(true);

			timelineRenderManagerTimestamp[property.name]();

			assert.ok(timelineRenderManagerTimestamp.getTimestampPanelPicker().getContent()[property.position].getDateValue.called);

			timelineRenderManagerTimestamp.destroy();
		});

		QUnit.test(property.descriptions[1], function (assert) {
			var timelineRenderManagerTimestamp;
			var value;
			var valueStatic;
			var done = assert.async();
			var resourceBundle = {
				"getText": function (message) {
					return message;
				}
			};

			timelineRenderManagerTimestamp = new TimelineRenderManagerTimestamp("ID", undefined, undefined, resourceBundle);

			sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker().getContent()[property.position], "getDateValue");
			sinon.stub(timelineRenderManagerTimestamp.getTimestampPanelPicker().getContent()[property.position], "getVisible").returns(false);

			value = timelineRenderManagerTimestamp[property.name]();
			valueStatic = value().getTime();

			assert.ok($.isFunction(value));
			assert.ok(value() instanceof Date);

			setTimeout(function () {
				assert.ok(valueStatic < value().getTime());
				done();
			}, 10);
			timelineRenderManagerTimestamp.destroy();
		});
	});
});
