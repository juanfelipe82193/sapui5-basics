/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/dvl/GraphicsCoreApi"
], function(
	jQuery,
	ContentConnector,
	ContentResource,
	GraphicsCoreApi
) {
	"use strict";

	function generateTest(language, procedureName, stepName) {
		QUnit.test(language, function(assert) {
			var done = assert.async();
			sap.ui.getCore().getConfiguration().setLanguage(language);
			var contentConnector = new ContentConnector({
				contentResources: [
					new ContentResource({
						source: "test-resources/sap/ui/vk/qunit/media/localised.vds",
						sourceType: "vds",
						sourceId: "abc"
					})
				]
			});
			contentConnector.attachEventOnce("contentReplaced",
				function(event) {
					var scene = event.getParameter("newContent");
					var dvl = scene.getGraphicsCore().getApi(GraphicsCoreApi.LegacyDvl);
					var procedures = dvl.Scene.RetrieveProcedures(scene.getSceneRef());
					assert.equal(procedures.procedures[0].name, procedureName, "Procedure names are equal. Locale: " + language);
					assert.equal(procedures.procedures[0].steps[0].name, stepName, "Step names are equal. Locale: " + language);
					contentConnector.destroyContentResources();
					done();
				}
			);
		});
	}

	generateTest("en_US", "Procedure 1", "ABC");
	generateTest("ru_RU", "Процедура 1", "АБВ");

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});