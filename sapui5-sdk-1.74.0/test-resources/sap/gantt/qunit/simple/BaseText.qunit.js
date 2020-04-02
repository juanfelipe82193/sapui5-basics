/*global QUnit, sinon*/
sap.ui.define([
	"sap/ui/core/Core", "sap/gantt/simple/BaseText", "sap/gantt/simple/BaseRectangle"
], function (Core, BaseText, BaseRectangle) {
	"use strict";

	QUnit.test("default values", function (assert) {
		var oShape = new BaseText();
		assert.strictEqual(oShape.getFontSize(), 13, "Default fontSize is 13");
		assert.strictEqual(oShape.getFontFamily(),"Arial", "Default fontFamily is Arial");
		assert.strictEqual(oShape.getTextAnchor(), "start", "Default textAnchor is start");
		assert.strictEqual(oShape.getTruncateWidth(), undefined, "Default truncateWidth is undefined");
		assert.strictEqual(oShape.getShowEllipsis(), true, "Default showEllipsis is true");
	});

	QUnit.module("Functions - BaseText", {
		beforeEach: function() {
			this.sText = "abcdefg1234567890";
			this.oShape = new BaseText({
				text: this.sText,
				truncateWidth: 50,
				rowYCenter: 20,
				time: new Date(Date.UTC(2018, 2, 22)),
				endTime: new Date(Date.UTC(2018, 2, 22, 0, 0, 51))
			});
			this.getXByTimeStub = sinon.stub(this.oShape, "getXByTime", function(time){return time / 1000;});
			this.textBox = new BaseRectangle({
				time: new Date(Date.UTC(2018, 2, 22)),
				endTime: new Date(Date.UTC(2018, 2, 22, 0, 0, 50))
			});
			this.getXByTimeStub2 = sinon.stub(this.textBox, "getXByTime", function(time){return time / 1000;});
		},
		afterEach: function() {
			this.sText = null;
			this.oShape = null;

			this.getXByTimeStub.restore();
			this.getXByTimeStub2.restore();
		}
	});

	QUnit.test("Functions - getTruncateWidth", function (assert) {
		// getTruncateWidth
		if (!sap.ui.Device.browser.phantomJS) {
			var getParentStub = sinon.stub(this.oShape, "getParent").returns(null);
			assert.strictEqual(this.oShape.getTruncateWidth(), 50, "BaseText without parent, truncateWidth is 50");
			getParentStub.restore();

			getParentStub = sinon.stub(this.oShape, "getParent").returns(this.textBox);

			var getWithStub = sinon.stub(this.textBox, "getWidth").returns(50);

			assert.strictEqual(this.oShape.getTruncateWidth(), 50, "BaseText with parent, truncateWidth is 50");
			this.textBox.setEndTime(new Date(Date.UTC(2018, 2, 22, 0, 0, 20)));
			getWithStub.restore();

			getWithStub = sinon.stub(this.textBox, "getWidth").returns(20);
			assert.strictEqual(this.oShape.getTruncateWidth(), 20, "BaseText with parent, truncateWidth is 20");
			getParentStub.restore();
			getWithStub.restore();
		} else {
			assert.expect(0);
		}
	});

	QUnit.test("Functions - getStyle", function (assert) {
		// getStyle
		assert.strictEqual(this.oShape.getStyle(), "stroke-width:0; pointer-events:none; font-size:13px; font-family:Arial; ");
	});

	QUnit.test("Functions - getX", function (assert) {
		var fnWarning = sinon.spy(jQuery.sap.log, "warning");
		// getX
		this.oShape.setProperty("x", 10);
		assert.strictEqual(this.oShape.getX(), 10, "BaseText.getX() is: 10");
		assert.equal(fnWarning.callCount, 0, "Warning was not logged so far");
		this.oShape.setProperty("x", null);
		assert.strictEqual(this.oShape.getX(), 1521676800, "BaseText.getX() is: 1521676800");
		assert.equal(fnWarning.callCount, 0, "Warning was not logged so far");

		this.oShape.setTime({test: "test"});
		assert.ok(isNaN(this.oShape.getX()), "BaseText.getX() is: NaN");
		assert.ok(fnWarning.calledOnce, "call getX gets assert warning");
		assert.equal(fnWarning.args[0][0], "couldn't convert timestamp to x with value: [object Object]", "Waring is: couldn't convert timestamp to x with value: [object Object]");
		Core.getConfiguration().setRTL(true);
		assert.strictEqual(this.oShape.getX(), 1521676851, "In RTL mode, BaseText.getX() is: 1521676851");
		Core.getConfiguration().setRTL(false);

		// getX from parent
		var getParentStub = sinon.stub(this.oShape, "getParent").returns(this.textBox);
		var getXStub = sinon.stub(this.textBox, "getX").returns(null);
		this.oShape.setTime(null);
		this.oShape.setEndTime(null);
		assert.strictEqual(this.oShape.getX(), 1521676800, "BaseText with parent, BaseText.getX() is: 1521676800");
		Core.getConfiguration().setRTL(true);
		assert.strictEqual(this.oShape.getX(), 1521676850, "BaseText with parent, in RTL mode, BaseText.getX() is: 1521676850");
		Core.getConfiguration().setRTL(false);
		this.textBox.setProperty("x", 12);
		assert.strictEqual(this.oShape.getX(), 12, "BaseText with parent, BaseText.getX() is: 12");
		getXStub.restore();
		getParentStub.restore();

	});

	QUnit.test("Functions - getY", function (assert) {
		assert.strictEqual(this.oShape.getY(), 26.5, "BaseText.getY() is: 26.5");
		this.oShape.setProperty("y", 10);
		assert.strictEqual(this.oShape.getY(), 10, "BaseText.getY() is: 10");
	});

	QUnit.test("Functions - _geNumberOfTruncatedCharacters", function (assert) {
		if (!sap.ui.Device.browser.phantomJS) {
			var nTotalWidth = this.oShape.measureTextWidth(this.sText);
			// _geNumberOfTruncatedCharacters
			assert.strictEqual(this.oShape._geNumberOfTruncatedCharacters(nTotalWidth, 50, this.sText), 7, "When target width is 50, number of truncated characters is 7");
			assert.strictEqual(this.oShape._geNumberOfTruncatedCharacters(nTotalWidth, 100, this.sText), 14, "When target width is 100, number of truncated characters is 14");
			assert.strictEqual(this.oShape._geNumberOfTruncatedCharacters(nTotalWidth, 120, this.sText), this.sText.length, "When target width bigger than total width, return source string's length");
		} else {
			assert.expect(0);
		}
	});

});
