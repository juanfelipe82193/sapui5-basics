/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/ExpandModel",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/test/simple/SteppedTask",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function(ExpandModel, GanttRowSettings, SteppedTask, BaseRectangle, utils) {
	"use strict";

	QUnit.module("Basic ExpandModel", {
		beforeEach: function(){
			this.sut = new ExpandModel({
				baseRowHeight: 49
			});
		},
		afterEach: function() {
			this.sut.destroy();
		},

		mockExpaned: function() {

			this.sut.mExpanded = {
				"rowUid1": [
					{scheme: "main_scheme", metadata: {rowSpan: 1, main: true, rowSpanSum: 3}},
					{scheme: "expand_scheme", metadata: {rowSpan: 1, main:false, numberOfRows: 2}}
				]
			};
		}
	});

	QUnit.test("initial values", function(assert){
		assert.ok(this.sut.getBaseRowHeight() === 49, "baseRowHeight is set correctly");
		assert.ok(jQuery.isEmptyObject(this.sut.mExpanded), "initial mExpanded is empty object");
	});

	QUnit.test("expand model states", function(assert){
		var bExpanded = this.sut.hasExpandedRows();

		// Initial assertion
		assert.ok(!bExpanded, "no expand rows");
		assert.equal(this.sut.isRowExpanded("rowUid1"), false, "no row is expanded");
		assert.equal(this.sut.hasNoExpandRows(), true, "hasNoExpandRows is true");
		assert.equal(this.sut.hasExpandedRows(), false, "no row expanded at all");

		// Action: Set internal value
		this.mockExpaned();

		// new assertion
		assert.ok(this.sut.hasExpandedRows(), "row with uid rowUid1 is expanded");
		assert.ok(this.sut.isRowExpanded("rowUid1"), "rowUid1 is expanded");
		assert.equal(this.sut.isRowExpanded("rowUid2"), false, "rowUid2 is not expanded");

		assert.equal(this.sut.hasExpandScheme("rowUid1", "sap_overlap"), false, "no expand scheme sap_overlap");
	});

	QUnit.test("expand scheme", function(assert){
		var sMainRowScheme = this.sut.getMainRowScheme();
		assert.equal(sMainRowScheme, undefined, "there is no main row scheme defined yet");
		sMainRowScheme = this.sut.getMainRowScheme("rowUid1");
		assert.equal(sMainRowScheme, undefined, "there is no main row scheme for rowUid1");

		assert.deepEqual(this.sut.getExpandSchemeKeys("rowUid1"), [], "expand scheme key is empty array");

		this.mockExpaned();

		sMainRowScheme = this.sut.getMainRowScheme("rowUid1");
		assert.deepEqual(sMainRowScheme, {
			key: "main_scheme",
			value: {rowSpan: 1, main: true, rowSpanSum: 3}
		});

		assert.deepEqual(this.sut.getExpandSchemeKeys("rowUid1"), ["expand_scheme"], "expand scheme found");
	});

	QUnit.module("interactive expand chart", {
		beforeEach: function() {
			this.sut = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new SteppedTask({
						shapeId: "{Id}",
						expandable: true,
						task: new BaseRectangle({
							time: "{StartDate}",
							endTime: "{EndDate}",
							fill: "#008FD3",
							height: 20
						}),
						breaks: {
							path: "breaks",
							template: new BaseRectangle({
								scheme: "break",
								time: "{StartDate}",
								endTime: "{EndDate}",
								fill: "red",
								height: 20
							}),
							templateShareable: true
						}
					})
				]
			}), true/**bCreate expand data */);

			this.sut.addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "break",
				rowSpan: 1
			}));

			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getMainShape: function(iIndex) {
			var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
			return oRowSettings.getShapes1()[0];
		}
	});

	QUnit.test("expand & collapse single row", function (assert) {
		var iExpandIndex = 0;

		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					assert.ok(oMainShape != null, "the main shape can be found");
					assert.ok(oMainShape.getBreaks().length > 1, "there has lazy and expandable shapes");

					oMainShape.getBreaks().forEach(function (oBreak) {
						assert.notEqual(oBreak.getDomRef(), null, "each expand shape has DOM ref");
					});

					// assertion that the mExpanded
					var mExpanded = this.sut._oExpandModel.mExpanded;
					assert.notEqual(mExpanded, null, "mExpanded has values");
					assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");

					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);

					setTimeout(function () {
						this.getMainShape(iExpandIndex).getBreaks().forEach(function (oBreak) {
							assert.equal(oBreak.getDomRef(), null, "expand shape DOM refs are removed");
						});
						resolveFinal();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("expand & collapse multiple rows", function (assert) {
		var aExpandIndex = [0, 2];

		return utils.waitForGanttRendered(this.sut).then(function () {
			return new Promise(function (resolve1) {
				setTimeout(function () {
					this.sut.expand("break", aExpandIndex);
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolve2) {
					setTimeout(function () {

						aExpandIndex.forEach(function (iIndex) {
							var oMainShape = this.getMainShape(iIndex);
							oMainShape.getBreaks().forEach(function (oBreak) {
								assert.notEqual(oBreak.getDomRef(), null, "expand row: " + iIndex + " has DOM");
							});
						}.bind(this));

						resolve2();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this)).then(function () {
					this.sut.collapse("break", [2]);
					return new Promise(function (resolveFinal) {
						setTimeout(function () {
							var oFirstRowMainShape = this.getMainShape(0);
							oFirstRowMainShape.getBreaks().forEach(function (oBreak) {
								assert.notEqual(oBreak.getDomRef(), null, "expand row: " + oFirstRowMainShape.getId() + " has no DOM because of not collapsed");
							});

							var oThirdRowMainShape = this.getMainShape(2);
							oThirdRowMainShape.getBreaks().forEach(function (oBreak) {
								assert.equal(oBreak.getDomRef(), null, "expand row: " + oThirdRowMainShape.getId() + " has no DOM after collapse");
							});

							resolveFinal();
						}.bind(this), 400); // leave 400 ms to render completely
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
});
