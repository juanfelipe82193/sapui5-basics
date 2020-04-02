sap.ui.define([
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/ProcessFlow",
	"sap/suite/ui/commons/ProcessFlowLaneHeader",
	"sap/ui/Device",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/QUnitUtils"
], function (jQuery, JSONModel, ProcessFlow, ProcessFlowLaneHeader, Device, CreateAndAppendDiv, QUnitUtils) {
	"use strict";

	CreateAndAppendDiv("processflowdiv").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv599").setAttribute("style", "width: 599px;");
	CreateAndAppendDiv("processflowdiv1023").setAttribute("style", "width: 1023px;");
	CreateAndAppendDiv("processflowdiv1025").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv450").setAttribute("style", "width: 1025px; min-width: 450px; max-width: 450px;");

	QUnit.module("ProcessFlowChevrons - Basic Tests", {
		beforeEach: function () {
			jQuery("#processflowdiv450").width("450px");
			var oData = {
				// lane ID is better than position
				// no big difference between parent and/or children. Make decision in our team what is more suitable for us
				lanes: [
					{
						id: "id0",
						iconSrc: "sap-icon://order-status",
						text: "In Order",
						position: 0
					}, // first header element
					{
						id: "id1",
						iconSrc: "sap-icon://order-status",
						text: "In Delivery",
						position: 1
					}, // second header element
					{
						id: "id2",
						iconSrc: "sap-icon://order-status",
						text: "In Invoice",
						position: 2
					},
					{
						id: "id3",
						iconSrc: "sap-icon://order-status",
						text: "In Accounting",
						position: 3
					},
					{
						id: "id4",
						iconSrc: "sap-icon://order-status",
						text: "In Payment",
						position: 4
					},
					{
						id: "id5",
						iconSrc: "sap-icon://order-status",
						text: "Delivered",
						position: 5
					},
					{
						id: "id6",
						iconSrc: "sap-icon://order-status",
						text: "Artificial",
						position: 6
					}
				] // end of lane array
			};

			var oModel = new JSONModel(oData);
			this.oProcessFlow = new ProcessFlow("processFlowChevrons", {
				foldedCorners: true,
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						iconSrc: "{iconSrc}",
						text: "{text}",
						state: "{state}",
						position: "{position}"
					})
				}, // end of lane
				scrollable: false,
				wheelZoomable: false
			});
			// Because zoom level changes depending on rendering behavior, we focus on a fix zoom lvl "Two".
			// Override the function to make sure, that no re-rendering is influencing our Chevron calculation
			this.oProcessFlow._setScrollWidth = function () {
				this._scrollStep = 192;
			}.bind(this.oProcessFlow);
			this.oProcessFlow.setModel(oModel);
			this.oProcessFlow.placeAt("processflowdiv450");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.oProcessFlow) {
				this.oProcessFlow.destroy();
			}
		},
		scroll: function (sDirection, oTestContext, fnCallback) {
			oTestContext.fnOrginalAdjustAndShowArrow = oTestContext.fnOrginalAdjustAndShowArrow || oTestContext.oProcessFlow._adjustAndShowArrow;
			oTestContext.oProcessFlow._adjustAndShowArrow = function () {
				oTestContext.fnOrginalAdjustAndShowArrow.bind(oTestContext.oProcessFlow)();
				fnCallback.bind(oTestContext)();
			};
			oTestContext.oProcessFlow._onArrowClick({
				target: {
					id: oTestContext.oProcessFlow.getId() + "-arrowScroll" + sDirection
				},
				preventDefault: function () {
				}
			});
		}
	});

	QUnit.test("Chevrons and text exist", function (assert) {
		var $item = this.oProcessFlow.$("arrowScrollRight");
		assert.ok($item.length > 0, "Right Chevron Arrow exists.");
		assert.ok($item.css("visibility") !== "hidden", "Right Chevron exists and is visible.");
		$item = this.oProcessFlow.$("arrowScrollLeft");
		assert.ok($item.length > 0, "Left Chevron Arrow exists.");
		assert.ok($item.css("visibility") === "hidden", "Left Chevron exists but is not visible.");

		$item = this.oProcessFlow.$("counterRight");
		assert.ok($item.length > 0, "Right Chevron counter exists.");
		assert.ok($item.css("visibility") !== "hidden", "Right Chevron counter exists and is visible.");
		$item = this.oProcessFlow.$("counterLeft");
		assert.ok($item.length > 0, "Left Chevron Arrow exists.");
		assert.ok($item.css("visibility") === "hidden", "Left Chevron counter exists and is not visible.");
	});

	QUnit.test("Default numbers are displayed", function (assert) {
		assert.equal(this.oProcessFlow.$("counterRight").text(), "3", "Right Chevron displays '3'.");
		assert.equal(this.oProcessFlow.$("counterLeft").text(), "0", "Left Chevron displays '0'.");
	});

	QUnit.test("One scroll to the right - check counter values", function (assert) {
		if (Device.browser.mobile) {
			assert.expect(0);
			return;
		}
		var done = assert.async();
		this.scroll("Right", this, function () {
			assert.equal(this.oProcessFlow.$("counterRight").text(), "2", "Right Chevron displays '2'.");
			assert.equal(this.oProcessFlow.$("counterLeft").text(), "1", "Left Chevron displays '1'.");
			done();
		});
	});

	QUnit.test("Two scroll to the right - check counter values", function (assert) {
		if (Device.browser.mobile) {
			assert.expect(0);
			return;
		}
		var done = assert.async();
		this.scroll("Right", this, function () {
			this.scroll("Right", this, function () {
				assert.equal(this.oProcessFlow.$("counterRight").text(), "1", "Right Chevron displays '1'.");
				assert.equal(this.oProcessFlow.$("counterLeft").text(), "2", "Left Chevron displays '2'.");
				done();
			});
		});
	});

	/* eslint-disable */
	QUnit.test("Two scroll to the right and one back to the left - check counter values", function (assert) {
		if (Device.browser.mobile) {
			assert.expect(0);
			return;
		}
		var done = assert.async();
		this.scroll("Right", this, function () {
			this.scroll("Right", this, function () {
				this.scroll("Left", this, function () {
					assert.equal(this.oProcessFlow.$("counterRight").text(), "2", "Right Chevron displays '2'.");
					assert.equal(this.oProcessFlow.$("counterLeft").text(), "1", "Left Chevron displays '1'.");
					done();
				});
			});
		});
	});

	QUnit.test("Two scroll to the right and completly back to the left - check counter values", function (assert) {
		if (Device.browser.mobile) {
			assert.expect(0);
			return;
		}
		var done = assert.async();
		this.scroll("Right", this, function () {
			this.scroll("Right", this, function () {
				this.scroll("Left", this, function () {
					this.scroll("Left", this, function () {
						assert.equal(this.oProcessFlow.$("counterRight").text(), "3", "Right Chevron displays '3'.");
						assert.equal(this.oProcessFlow.$("counterLeft").text(), "0", "Left Chevron displays '0'.");
						assert.ok(this.oProcessFlow.$("counterLeft").css("visibility") === "hidden", "Left Chevron counter exists but is not visible.");
						assert.ok(this.oProcessFlow.$("arrowScrollLeft").css("visibility") === "hidden", "Left Chevron exists but is not visible.");
						done();
					});
				});
			});
		});
	});

	QUnit.test("Scroll completly to the right - check counter values", function (assert) {
		if (Device.browser.mobile) {
			assert.expect(0);
			return;
		}
		var done = assert.async();
		this.scroll("Right", this, function () {
			this.scroll("Right", this, function () {
				this.scroll("Right", this, function () {
					this.scroll("Right", this, function () {
						this.scroll("Right", this, function () {
							assert.equal(this.oProcessFlow.$("counterRight").text(), "0", "Right Chevron displays '0'.");
							assert.equal(this.oProcessFlow.$("counterLeft").text(), "3", "Left Chevron displays '3'.");
							assert.ok(this.oProcessFlow.$("counterRight").css("visibility") === "hidden", "Right Chevron counter exists but is not visible.");
							assert.ok(this.oProcessFlow.$("arrowScrollRight").css("visibility") === "hidden", "Right Chevron exists but is not visible.");
							done();
						});
					});
				});
			});
		});
	});
	/* eslint-disable */

}, /* bExport= */ true);
