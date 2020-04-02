/* global QUnit */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseDiamond"
], function (Core, BaseGroup, BaseRectangle, BaseDiamond) {
	"use strict";

	BaseRectangle.prototype.getXByTime = function(vTime) {
		return 0;
	};

	BaseRectangle.prototype.getWidth = function () {
		return 20;
	};

	QUnit.module("BaseGroup", {
		assertFalseDefaultValue: function(assert, oShape, sProp) {
			assert.equal(oShape.getProperty(sProp), false, "default value: " + sProp + " in BaseGroup is false");
		}
	});

	QUnit.test("Property - default values", function(assert) {
		var oGroup = new BaseGroup();
		assert.strictEqual(oGroup.getShapes().length, 0, "no default shapes in group shape");
	});

	QUnit.module("Rendering - BaseGroup", {
		beforeEach: function(){
			this.oDiamond = new BaseDiamond({shapeId: "diamond01", selectable: true, x:0});
			this.oDiamond2 = new BaseDiamond({shapeId: "diamond02", selectable: true, x:1});
			this.oDiamond3 = new BaseDiamond({shapeId: "diamond03", selectable: true, x:2});
			this.oRect = new BaseRectangle({shapeId: "rect01", selectable: true, x:0});
		},
		afterEach: function() {
			this.oDiamond = null;
			this.oDiamond2 = null;
			this.oDiamond3 = null;
			this.oRect = null;
		}
	});

	QUnit.test("Rendering - renderElement without shapes", function(assert){
		var oGroup = new BaseGroup({shapeId: "group01", selectable: true});
		var oRm = Core.createRenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();
		assert.ok(jQuery('#qunit-fixture').find("g").length === 1, "Render 'g' element when rendering empty base group");
		assert.ok(jQuery('#qunit-fixture').find("g").is(":empty"), "Empty in g' when rendering empty base group");
	});

	QUnit.test("Rendering - renderElement with a Diamond", function(assert){

		var oGroup = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond]
		});

		var oRm = Core.createRenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "BaseGroup with shapes has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 1, "BaseGroup with a BaseDiamond has one 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 1, "BaseGroup with a BaseDiamond only has one child");
	});

	QUnit.test("Rendering - renderElement with two Diamonds", function(assert){

		var oGroup = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond, this.oDiamond2]
		});

		var oRm = Core.createRenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		// oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "BaseGroup with shapes has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 2, "BaseGroup with two BaseDiamonds has two 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 2, "BaseGroup with two BaseDiamonds has two children");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").attr("data-sap-gantt-shape-id"), "group01", "Selectable BaseGroup has shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("path[data-sap-gantt-shape-id]").length, 0, "Child shapes within BaseGroup does not have shape ID");
	});

	QUnit.test("Rendering - renderElement with Diamond and Rectangle", function(assert){

		var oGroup = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond, this.oRect]
		});

		var oRm = Core.createRenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "BaseGroup with shapes has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g path").length, 1, "BaseGroup with Diamond and Rectangle has one 'path' tage");
		assert.strictEqual(jQuery('#qunit-fixture').find("g rect").length, 1, "BaseGroup with Diamond and Rectangle has one 'rect' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 2, "BaseGroup with two BaseDiamonds has two children");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").attr("data-sap-gantt-shape-id"), "group01", "Selectable BaseGroup has shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("path[data-sap-gantt-shape-id]").length, 0, "Child shapes within BaseGroup does not have shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("g path").next().is("rect"), true, "BaseGroup'children sorted by sapGanttOrder");
		assert.strictEqual(jQuery('#qunit-fixture').find("g rect").prev().is("path"), true, "BaseGroup'children sorted by sapGanttOrder");

	});

	QUnit.test("Rendering - renderElement with cascade groups", function(assert){

		var oGroup1 = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond]
		});

		var oGroup2 = new BaseGroup({
			shapeId: "group02",
			selectable: true,
			shapes: [this.oDiamond2, oGroup1]
		});

		var oGroup = new BaseGroup({
			shapeId: "group00",
			selectable: true,
			shapes: [this.oDiamond3, oGroup2]
		});

		var oRm = Core.createRenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 3, "Cascade groups with shapes has three 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 3, "Cascade groups with Diamond has three 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 5, "Cascade groups with Diamond has five children in total");
		assert.strictEqual(jQuery('#qunit-fixture').find("g:first").attr("data-sap-gantt-shape-id"), "group00", "Selectable BaseGroup has shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("g:last").attr("data-sap-gantt-shape-id"), undefined, "Child BaseGroups do not have shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("g[data-sap-gantt-shape-id]").length, 1, "Child shapes within BaseGroup does not have shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("path[data-sap-gantt-shape-id]").length, 0, "Child shapes within BaseGroup does not have shape ID");

	});

	QUnit.module("Extending - BaseGroup", {
		beforeEach: function(){
			this.oDiamond = new BaseDiamond({shapeId: "diamond01", selectable: true, x:0});
			this.oDiamond2 = new BaseDiamond({shapeId: "diamond02", selectable: true, x:1});
			this.oDiamond3 = new BaseDiamond({shapeId: "diamond03", selectable: true, x:2});
			this.oRect = new BaseRectangle({shapeId: "rect01", selectable: true, x:0});
		},
		afterEach: function() {
			this.oDiamond = null;
			this.oDiamond2 = null;
			this.oDiamond3 = null;
			this.oRect = null;
		}
	});

	var ExtGroup = BaseGroup.extend("sap.gantt.simple.test.SteppedTask", {
		metadata: {
			aggregations: {
				tasks: {
					type: "sap.gantt.simple.BaseRectangle",
					multiple: true,
					sapGanttOrder: 1
				},
				steps: {
					type: "sap.gantt.simple.BaseDiamond",
					multiple: true,
					sapGanttOrder: 2
				}
			}
		}
	});

	QUnit.test("Extending - renderChildElements within group", function(assert){
		var oGroup = new ExtGroup({
			tasks: [this.oRect],
			steps: [this.oDiamond, this.oDiamond2]
		});

		var oRm = Core.createRenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "Extended group with Diamond has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 2, "Extended group with Diamond has three 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 3, "Extended group with Diamond has 3 children in total");
		assert.ok(jQuery('#qunit-fixture').find("g rect").next().is("path"), "BaseGroup'children sorted by sapGanttOrder");

	});

	QUnit.test("Extending - render order in renderChildElements within group", function(assert){
		var oGroup = new ExtGroup({
			steps: [this.oDiamond, this.oDiamond2],
			tasks: [this.oRect]
		});

		var oRm = Core.createRenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();

		assert.ok(jQuery('#qunit-fixture').find("g rect").next().is("path"), "BaseGroup'children sorted by sapGanttOrder");
	});

});
