/*global QUnit*/
sap.ui.define([
		"sap/gantt/eventHandler/MouseWheelHandler",
		"sap/gantt/GanttChart"
	], function(MouseWheelHandler, GanttChart) {
	"use strict";

	var DummyGanttChart = GanttChart.extend("sap.gantt.DummyGanttChart", {
		renderer: function (oRm, oControl) {
			oRm.write("<svg id='" + oControl.getId() + "-svg'>");
			oRm.write("</svg>");
		}
	});

	DummyGanttChart.prototype.init = function () {
		this.oAxisTimeStrategy = {
			getZoomLevel: function () {
				return 1;
			},
			getZoomLevels: function () {
				return 10;
			},
			getMouseWheelZoomType: function () {
				return sap.gantt.MouseWheelZoomType.FineGranular;
			},
			getAxisTime: function () {
				return {
					viewToTime: function (value, bIgnoreOffset) { return 0; }
				};
			},
			updateVisibleHorizonOnMouseWheelZoom: function (oTimeAtZoomCenter, iScrollDelta) { }
		};
		this.oHsbDom = {
			scrollLeft: 10,
			scrollWidth: 100,
			clientWidth: 80
		};
		this.oVsbDom = {
			scrollTop: 10,
			scrollHeight: 100,
			clientHeight: 80
		};
		this.exit = function () {
			return;
		};

		this._oTimePeriodZoomHandler = {
			attachEvents: function () {
				return;
			},
			detachEvents: function () {
				return;
			}
		};
	};
	DummyGanttChart.prototype.getTTHsbDom = function () {
		return this.oHsbDom;
	};
	DummyGanttChart.prototype.getTTVsbDom = function () {
		return this.oVsbDom;
	};
	DummyGanttChart.prototype.getAxisTimeStrategy = function () {
		return this.oAxisTimeStrategy;
	};
	DummyGanttChart.prototype._destroyCursorLine = function () { };
	DummyGanttChart.prototype.getBaseRowHeight = function () { return 33; };

	var fnGetFakedEvent = function () {
		return {
			originalEvent: {
				shiftKey: false,
				ctrlKey: false,
				detail: 100,
				deltaX: 200,
				deltaY: 300,
				pageX: 450
			},
			preventDefault: function () { },
			stopPropagation: function () { }
		};
	};

	QUnit.module("Create MouseWheelHandler", {
		beforeEach: function () {
			this.oGanttChart = new DummyGanttChart();
			this.oMouseWheelHandler = new MouseWheelHandler(this.oGanttChart);

			this.oGanttChart.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oGanttChart.destroy();
			this.oMouseWheelHandler.destroy();
		}
	});

	QUnit.test("Test MouseWheelHandler -- handleEvent", function (assert) {
		//mock these inner calls to focus on testing the logic within 'handleEvent'
		this.stub(this.oMouseWheelHandler, "_getScrollDelta").returns(0);
		this.stub(this.oMouseWheelHandler, "_handleZoom").returns(true);
		var stubHscroll = this.stub(this.oMouseWheelHandler, "_handleHScroll");
		var stubVscroll = this.stub(this.oMouseWheelHandler, "_handleVScroll");

		//no shift key
		var oEvent = fnGetFakedEvent();
		var result = true;
		result = this.oMouseWheelHandler.handleEvent(oEvent);
		assert.ok(result == false && stubVscroll.called, "MouseWheelHandler.handleEvent successfully excuted with no SHIFT key.");

		// only shift key
		result = true;
		oEvent.originalEvent.shiftKey = true;
		result = this.oMouseWheelHandler.handleEvent(oEvent);
		assert.ok(result == false && stubHscroll.called, "MouseWheelHandler.handleEvent successfully excuted with only SHIFT key.");
		// shift + ctrl keys
		oEvent.originalEvent.shiftKey = true;
		oEvent.originalEvent.ctrlKey = true;
		result = false;
		result = this.oMouseWheelHandler.handleEvent(oEvent);
		assert.equal(result, true, "MouseWheelHandler.handleEvent successfully excuted with CRTL + SHIFT key.");
	});

	QUnit.test("Test MouseWheelHandler -- _getScrollDelta", function (assert) {
		var oEvent = fnGetFakedEvent();
		var stubDevice = this.stub(sap.ui.Device, "browser", { firefox: true });
		var result = this.oMouseWheelHandler._getScrollDelta(oEvent.originalEvent);
		assert.equal(result, oEvent.originalEvent.detail, "MouseWheelHandler._getScrollDelta successfully excuted for firefox browser.");
		stubDevice.restore();

		var stubDevice2 = this.stub(sap.ui.Device, "browser", { firefox: false });
		result = this.oMouseWheelHandler._getScrollDelta(oEvent.originalEvent);
		assert.equal(result, oEvent.originalEvent.deltaY, "MouseWheelHandler._getScrollDelta successfully excuted for non-firefox browser.");
		stubDevice2.restore();
	});

	QUnit.test("Test MouseWheelHandler --  _handleZoom", function (assert) {
		//mock the inner call to only test logic within 'handleZoom'
		this.stub(this.oMouseWheelHandler, "_updateVisibleHorizon");

		var oEvent = fnGetFakedEvent();
		var result = this.oMouseWheelHandler._handleZoom(oEvent, -100);
		assert.equal(result, true, "MouseWheelHandler._handleZoom successfully excuted for zooming in.");
		assert.equal(this.oMouseWheelHandler._iMouseWheelZoomTimer, undefined, "MouseWheelHandler._handleZoom successfully excuted without time out.");

		this.oMouseWheelHandler._lastCalledMouseWheelZoom = Date.now();
		result = this.oMouseWheelHandler._handleZoom(oEvent, -100);
		assert.ok(this.oMouseWheelHandler._iMouseWheelZoomTimer !== undefined, "MouseWheelHandler._handleZoom successfully excuted in a time out.");
	});

	QUnit.test("Test MouseWheelHandler --  _handleHScroll", function (assert) {
		var oEvent = fnGetFakedEvent();
		var nPreScrollLeft = this.oMouseWheelHandler._oSourceChart.getTTHsbDom().scrollLeft;
		this.oMouseWheelHandler._handleHScroll(oEvent, 100);
		assert.equal(this.oMouseWheelHandler._oSourceChart.getTTHsbDom().scrollLeft, nPreScrollLeft + 100, "MouseWheelHandler._handleHScroll successfully excuted for scroll right.");

		this.oMouseWheelHandler._handleHScroll(oEvent, -100);
		assert.equal(this.oMouseWheelHandler._oSourceChart.getTTHsbDom().scrollLeft, nPreScrollLeft, "MouseWheelHandler._handleHScroll successfully excuted for scroll left.");
	});

	QUnit.test("Test MouseWheelHandler --  _handleVScroll", function (assert) {
		var oEvent = fnGetFakedEvent();
		this.stub(this.oMouseWheelHandler, "_getScrollingPixelsForRow").returns(33);
		this.oMouseWheelHandler._handleVScroll(oEvent, 100);
		assert.equal(this.oMouseWheelHandler._oSourceChart.getTTVsbDom().scrollTop, 109, "MouseWheelHandler._handleVScroll successfully excuted for scroll down.");

		this.oMouseWheelHandler._handleVScroll(oEvent, -100);
		assert.equal(this.oMouseWheelHandler._oSourceChart.getTTVsbDom().scrollTop, 9, "MouseWheelHandler._handleVScroll successfully excuted for scroll up.");
	});

	QUnit.test("Test MouseWheelHandler --  _updateVisibleHorizon", function (assert) {
		assert.equal(this.oMouseWheelHandler._lastCalledMouseWheelZoom, 0, "MouseWheelHandler._lastCalledMouseWheelZoom flag is initialized.");
		var oEvent = fnGetFakedEvent();
		this.oMouseWheelHandler._updateVisibleHorizon(oEvent, 100);
		assert.ok(this.oMouseWheelHandler._lastCalledMouseWheelZoom !== 0, "MouseWheelHandler._lastCalledMouseWheelZoom is successfully excuted.");
	});
});
