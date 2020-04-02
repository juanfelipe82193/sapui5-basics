/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/ThingCollection",
	"sap/ui/ux3/ThingViewer",
	"sap/suite/ui/commons/ThreePanelThingViewer",
	"sap/ui/events/jquery/EventSimulation",
	"sap/ui/thirdparty/jquery"
], function(
	QUnitUtils,
	createAndAppendDiv,
	ThingCollection,
	ThingViewer,
	ThreePanelThingViewer,
	EventSimulation,
	jQuery
) {
	"use strict";
	createAndAppendDiv("uiArea1");


	QUnit.module("General Tests - sap.suite.ui.commons.ThingCollection", {
		beforeEach: function() {
			this.oThingCollection = new ThingCollection("TC");

			this.oTV1 = new ThingViewer("tv1", {
				title: "title 1"
			});

			this.oTV2 = new ThingViewer("tv2", {
				title: "title 2"
			});
		},

		afterEach: function() {
			this.oTV1.destroy();
			this.oTV2.destroy();
			this.oThingCollection.destroy();
		}
	});

	QUnit.test("ThingCollection initial set up", function(assert) {
		assert.ok(this.oThingCollection._oRemoveButton, "Remove button was created");
	});

	QUnit.test("_isShiftPrevForbidden", function(assert) {
		this.oThingCollection._bScrollDisabled = false;
		this.oThingCollection._iCenterNum = 1;
		assert.ok(!this.oThingCollection._isShiftPrevForbidden(), "The previous shift is allowed");

		this.oThingCollection._iCenterNum = 0;
		assert.ok(this.oThingCollection._isShiftPrevForbidden(), "The previous shift is not allowed");
	});

	QUnit.test("_isShiftNextForbidden", function(assert) {
		this.oThingCollection.addContent(new ThreePanelThingViewer());
		this.oThingCollection.addContent(new ThreePanelThingViewer());

		this.oThingCollection._bScrollDisabled = false;
		this.oThingCollection._iCenterNum = 0;
		assert.ok(!this.oThingCollection._isShiftNextForbidden(), "The next shift is allowed");

		this.oThingCollection._iCenterNum = 1;
		assert.ok(this.oThingCollection._isShiftNextForbidden(), "The next shift is not allowed");
	});

	QUnit.test("_initTouchEvents", function(assert) {
		jQuery.sap.touchEventMode = EventSimulation.touchEventMode;
		this.oThingCollection._initTouchEvents();

		assert.ok(this.oThingCollection.onswipeleft, "The previous shift handler was set");
		assert.ok(this.oThingCollection.onswiperight, "The next shift handler was set");
	});

	QUnit.test("addNextContent", function(assert) {

		this.oThingCollection.addNextContent(this.oTV1);

		assert.ok(this.oThingCollection.getContent()[0], "Content was added to possition 0 by addNextContent");
		assert.equal(this.oThingCollection.getContent().length, 1, "Content added by addNextContent");
		assert.equal(this.oThingCollection.getContent()[0].getId(), "tv1", "Id of added ThingViewer is correct");

		this.oThingCollection.addNextContent(this.oTV2);
		assert.ok(this.oThingCollection.getContent()[1], "Content was added to possition 1 by addNextContent");
		assert.equal(this.oThingCollection.getContent()[1].getId(), "tv2", "Id of added ThingViewer is correct");
		assert.equal(this.oThingCollection.getContent().length, 2, "Content added by addNextContent");

	});

	QUnit.module("Render Tests - sap.suite.ui.commons.ThingCollection", {
		beforeEach: function() {

			this.oThingCollection = new ThingCollection("TCR", {
				width: "500px",
				height: "300px"
			});

			this.oTV1 = new ThingViewer("tv1", {
				title: "title 1"
			});

			this.oTV2 = new ThingViewer("tv2", {
				title: "title 2"
			});

			this.oThingCollection.addContent(this.oTV1);
			this.oThingCollection.addContent(this.oTV2);
			this.oThingCollection.placeAt("uiArea1");
		},

		afterEach: function() {
			this.oTV1.destroy();
			this.oTV2.destroy();
			this.oThingCollection.destroy();
		}
	});

	QUnit.test("scroll test", function(assert) {
		var done = assert.async();
		var that = this;
		setTimeout(function() {
			that.oThingCollection.shiftNext();
			setTimeout(function() {
				assert.equal(jQuery("#TCR-container>div>div").attr("id"), "tv2", "The second item is shown");

				that.oThingCollection.shiftPrev();
				setTimeout(function() {
					assert.equal(jQuery("#TCR-container>div>div").attr("id"), "tv1", "The first item is shown");
					done();
				}, 1500);
			}, 1500);
		}, 500);
	});

	QUnit.test("_removeCenterContent", function(assert) {
		var done = assert.async();
		var that = this;
		setTimeout(function() {
			that.oThingCollection._removeCenterContent();
			setTimeout(function() {
				assert.equal(jQuery("#TCR-container>div>div").attr("id"), "tv2", "The first card was removed. The second item is shown");
				done();
			}, 2500);
		}, 500);
	});

	QUnit.test("_updateArrows", function(assert) {
		var done = assert.async();
		var that = this;
		setTimeout(function() {
			that.oThingCollection._updateArrows();

			var oNavPrev = jQuery(document.getElementById("TCR-nav-prev"));
			var oNavNext = jQuery(document.getElementById("TCR-nav-next"));

			assert.ok(!oNavPrev.hasClass("sapSuiteTcNavPrevtArrow"), "The previous navigation button is disabled");
			assert.ok(oNavNext.hasClass("sapSuiteTcNavNextArrow"), "The next navigation button is enabled");

			that.oThingCollection.shiftNext();
			setTimeout(function() {
				that.oThingCollection._updateArrows();

				assert.ok(oNavPrev.hasClass("sapSuiteTcNavPrevArrow"), "The previous navigation button is enabled");
				assert.ok(!oNavNext.hasClass("sapSuiteTcNavNextArrow"), "The next navigation button is disabled");
				done();
			}, 1500);
		}, 500);
	});
});