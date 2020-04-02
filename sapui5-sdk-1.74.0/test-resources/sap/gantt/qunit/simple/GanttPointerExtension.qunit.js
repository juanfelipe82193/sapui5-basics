/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/CoordinateUtils",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function(GanttRowSettings, CoordinateUtils, qutils, utils) {
	"use strict";

	QUnit.module("Interaction", {
		beforeEach: function(){
			this.sut = utils.createGantt(
				true,
				new GanttRowSettings({
					rowId: "{Id}",
					shapes1: [
						new sap.gantt.simple.BaseRectangle({
							shapeId: "{Id}",
							time: "{StartDate}",
							endTime: "{EndDate}",
							title: "{Name}",
							fill: "#008FD3",
							draggable: true,
							resizable: true,
							selectable: true
						})
					]
				})
			);
			this.sut.setDragOrientation("Free");

			// set the fixture to 300px to show vertical scroll bar
			jQuery.sap.byId("qunit-fixture").css("height", "300px");

			this.sut.placeAt("qunit-fixture");
		},

		afterEach: function(assert) {
			utils.destroyGantt();
			jQuery.sap.byId("qunit-fixture").css("height", "100%");
		},

		delayedAssert: function(fnAssertion, nDelayTime) {
			setTimeout(function(){
				fnAssertion();
			}, nDelayTime ? nDelayTime : 500);
		},

		getSvgCtn: function(){
			var oScrollExtension = this.sut._getScrollExtension();
			var $svgCtn = jQuery(oScrollExtension.getDomRefs().gantt);
			var $vsb = jQuery(this.sut.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
			return {
				hsb: jQuery.sap.byId(this.sut.getId() + "-hsb"),
				vsb: $vsb,
				height: $svgCtn.height(),
				left: $svgCtn.offset().left,
				right: $svgCtn.offset().left + $svgCtn.width(),
				top: $svgCtn.offset().top,
				bottom: $svgCtn.offset().top + jQuery(".sapGanttBackgroundTableContent").height(),
				shape: jQuery("rect[data-sap-gantt-shape-id=0]").get(0)
			};
		},

		createEventParam: function(x, y) {
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},

		drag: function(eShape, fromX, fromY, toX, toY){
			var oEventParams = this.createEventParam(fromX, fromY);
			qutils.triggerEvent("mousedown", eShape, oEventParams);
			oEventParams = this.createEventParam(toX, toY);
			qutils.triggerEvent("mousemove", eShape, oEventParams);
			qutils.triggerEvent("mousemove", eShape, oEventParams);
		},

		selectShape: function(oShape) {
			var oEventParams = {
				button: 0,
				pageX: 0,
				pageY: 0
			};
			qutils.triggerEvent("click", oShape, oEventParams);
		},

		mousedown: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},

		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		}
	});

	QUnit.test("Cursor positions", function (assert) {
		sap.ui.getCore().applyChanges();

		var mXy = CoordinateUtils.getLatestCursorPosition();
		assert.ok(jQuery.isEmptyObject(mXy), "no x y position");

		var oRect = this.sut.getDomRef().getBoundingClientRect();
		qutils.triggerEvent("mousemove", this.sut.getDomRef(), {
			pageX: oRect.left + 1,
			pageY: oRect.top + 1
		});

		mXy = CoordinateUtils.getLatestCursorPosition();
		assert.ok(!jQuery.isEmptyObject(mXy), "x y position is not empty");
		assert.ok(mXy.pageX != null, "pageX is set");
		assert.ok(mXy.pageY != null, "pageY is set");

		assert.ok(mXy.clientX == null, "clientX value is ignored");
	});

	QUnit.test("gantt single/double click, contextmenu", function (assert) {
		var done = assert.async();
		var that = this;
		utils.waitForGanttRendered(this.sut).then(function () {
			var oPointerExtension = that.sut._getPointerExtension();
			var onGanttSingleClickSpy = sinon.spy(oPointerExtension, "onGanttSingleClick");
			var onGanttDoubleClickSpy = sinon.spy(oPointerExtension, "onGanttDoubleClick");
			var fireShapeContextMenuSpy = sinon.spy(that.sut, "fireShapeContextMenu");
			var oDomRefs = oPointerExtension.getDomRefs();
			var $svgCtn = jQuery(oDomRefs.gantt);
			var eGanttSvg = jQuery("rect.sapGanttBackgroundSVGRow")[0];
			var oEventParams = {
				button: 0,
				pageX: $svgCtn.offset().left + 20,
				pageY: $svgCtn.offset().top + 100
			};
			oEventParams.clientX = oEventParams.pageX;
			oEventParams.clientY = oEventParams.pageY;
			qutils.triggerEvent("mousemove", document, oEventParams);

			that.sut.attachEventOnce("shapeDoubleClick", function () {
				assert.ok(true, "ShapeDoubleClick event is called");
			});
			that.sut.attachEventOnce("shapePress", function () {
				assert.ok(true, "ShapePress event is called");
			});
			// ShapePress event is called immediately when double click is disabled
			that.sut.setDisableShapeDoubleClickEvent(true);
			qutils.triggerEvent("click", eGanttSvg, oEventParams);
			that.sut.setDisableShapeDoubleClickEvent(false);
			qutils.triggerEvent("dblclick", eGanttSvg, oEventParams);
			qutils.triggerEvent("contextmenu", eGanttSvg, oEventParams);

			assert.ok(onGanttSingleClickSpy.calledOnce, "Called single click once");
			assert.ok(onGanttDoubleClickSpy.calledOnce, "Called double click once");
			assert.ok(fireShapeContextMenuSpy.calledOnce, "Called contextMenu once");

			that.sut.attachEventOnce("shapeDoubleClick", function () {
				assert.ok(true, "ShapeDoubleClick event is called");
			});
			that.sut.attachEventOnce("shapePress", function () {
				assert.ok(true, "ShapePress event is called");
			});

			that.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setSelectable(false);
			// ShapePress event is called immediately when double click is disabled
			that.sut.setDisableShapeDoubleClickEvent(true);
			qutils.triggerEvent("click", eGanttSvg, oEventParams);
			that.sut.setDisableShapeDoubleClickEvent(false);
			qutils.triggerEvent("dblclick", eGanttSvg, oEventParams);

			onGanttSingleClickSpy.restore();
			onGanttDoubleClickSpy.restore();
			done();
		});
	});

	QUnit.test("auto scroll right", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function () {
				var mSvgCtn = this.getSvgCtn();
				var iScrollLeftHistory = mSvgCtn.hsb.scrollLeft();

				this.mousedown(mSvgCtn.shape, 0, 0);
				this.selectShape(mSvgCtn.shape);

				this.delayedAssert(function () {
					var iMoveX = mSvgCtn.right - 5;
					var iMoveY = mSvgCtn.top + mSvgCtn.height / 2;
					this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);

					this.delayedAssert(function () {
						var mSvgCtn2 = this.getSvgCtn();
						assert.ok(iScrollLeftHistory < mSvgCtn2.hsb.scrollLeft(), "auto scroll to right correctly!");
						this.mouseup(document.body, iMoveX, iMoveY);
						done();
					}.bind(this));
				}.bind(this));
			}.bind(this), 100); // need to wait because Table updates its rows async (50ms)
		}.bind(this));
	});

	QUnit.test("auto scroll left", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function () {
				var mSvgCtn = this.getSvgCtn();
				var iScrollLeftHistory = mSvgCtn.hsb.scrollLeft();
				this.mousedown(mSvgCtn.shape, mSvgCtn.left + 20, mSvgCtn.top + 20);
				this.selectShape(mSvgCtn.shape);

				this.delayedAssert(function () {
					var iMoveX = mSvgCtn.left + 5;
					var iMoveY = mSvgCtn.top + mSvgCtn.height / 2;
					this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + 20, iMoveX, iMoveY);

					this.delayedAssert(function () {
						assert.ok(iScrollLeftHistory > this.getSvgCtn().hsb.scrollLeft(), "auto scroll to left correctly!");
						this.mouseup(document.body, iMoveX, iMoveY);
						done();
					}.bind(this));
				}.bind(this));
			}.bind(this), 100); // need to wait because Table updates its rows async (50ms)
		}.bind(this));
	});

	QUnit.test("auto scroll bottom", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function () {
				var mSvgCtn = this.getSvgCtn();
				var iScrollTopHistory = mSvgCtn.vsb.scrollTop();

				this.selectShape(mSvgCtn.shape);

				this.delayedAssert(function () {
					var iMoveX = mSvgCtn.left + 100;
					var iMoveY = mSvgCtn.bottom - 5;
					this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);

					this.delayedAssert(function () {
						this.mouseup(document.body, iMoveX, iMoveY);
						var mSvgCtn2 = this.getSvgCtn();
						assert.ok(iScrollTopHistory < mSvgCtn2.vsb.scrollTop(), "auto scroll to bottom correctly!");
						done();
					}.bind(this));
				}.bind(this));
			}.bind(this), 100); // need to wait because Table updates its rows async (50ms)
		}.bind(this));
	});

	QUnit.test("auto scroll top", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function () {
				var mSvgCtn = this.getSvgCtn();
				mSvgCtn.vsb.scrollTop(20);
				var iScrollTopHistory = mSvgCtn.vsb.scrollTop();

				this.delayedAssert(function () {
					mSvgCtn = this.getSvgCtn(); // get shape again because DOM element can be replaced
					this.selectShape(mSvgCtn.shape);

					this.delayedAssert(function () {
						var iMoveX = mSvgCtn.left + 100;
						var iMoveY = mSvgCtn.top + 5;
						this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);

							this.delayedAssert(function () {
								var mSvgCtn2 = this.getSvgCtn();
								assert.ok(iScrollTopHistory > mSvgCtn2.vsb.scrollTop(), "auto scroll to top correctly!");
								this.mouseup(document.body, iMoveX, iMoveY);
								done();
							}.bind(this), 2500);
					}.bind(this));
				}.bind(this));
			}.bind(this), 100); // need to wait because Table updates its rows async (50ms)
		}.bind(this));
	});

});
