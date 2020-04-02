/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/BasePath",
	"sap/ui/core/Core"
], function(BasePath, Core) {
	"use strict";

	QUnit.test("Rendering - BasePath with d properties", function(assert) {
		var oPath = new BasePath({
			d: "M 0 22 m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z"
		});

		var oRm = Core.createRenderManager();

		var fnWriteClasses = sinon.spy(oRm, "writeClasses");

		oPath.renderElement(oRm, oPath);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));

		assert.strictEqual(jQuery('#qunit-fixture').find("path").attr("d"), "M 0 22 m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z", "Render BasePath with valid 'd' property");
		sinon.assert.calledOnce(fnWriteClasses);
		sinon.assert.calledWith(fnWriteClasses, oPath);
		fnWriteClasses.restore();

		oPath.setD("M 0 null m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z");
		oPath.renderElement(oRm, oPath);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("path").attr("d"), "M 0 null m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z", "Render BasePath with invalid 'd' property");
	});

});
