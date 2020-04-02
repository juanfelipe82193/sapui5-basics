sap.ui.define([
	"sap/ui/vbm/Cluster",
	"sap/ui/vbm/library"
], function(
	Cluster,
	library
) {
	"use strict";

	var cluster = new Cluster();

	QUnit.test("Cluster constructor", function(assert) {
		assert.strictEqual(cluster.getColor(), "", "Cluster control has empty string as default color.");
		assert.strictEqual(cluster.getIcon(), "", "Cluster control has empty string as default icon.");
		assert.strictEqual(cluster.getText(), "", "Cluster control has empty string as default text.");
		assert.strictEqual(cluster.getType(), sap.ui.vbm.SemanticType.None, "Default cluster type is 'None'.");
	});

	QUnit.test("Cluster.prototype.string2rgba", function(assert) {
		var rgb = "rgb(255, 100, 50)",
			rgbaFormat = cluster.string2rgba(rgb);
		console.log(rgbaFormat);

		//testing string2rgba
		assert.strictEqual(rgbaFormat[0], 255, "'R' component is 255.");
		assert.strictEqual(rgbaFormat[1], 100, "'G' component is 100.");
		assert.strictEqual(rgbaFormat[2], 50, "'B' component is 50.");
		assert.strictEqual(rgbaFormat[3], 1, "Alpha component is harcoded to 1.");
		assert.strictEqual(rgbaFormat[4], 0, "Last element from array is hardcoded to 0.");
	});
});
