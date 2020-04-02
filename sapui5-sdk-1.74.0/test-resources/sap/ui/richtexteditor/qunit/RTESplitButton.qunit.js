/*global QUnit*/
sap.ui.define([
	"sap/m/Button", // Not actually used, but needed in order to ensure sap.m has been loaded
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/richtexteditor/RTESplitButton",
	"sap/ui/richtexteditor/library"

], function (Button, RichTextEditor, RTESplitButton, library) {
	"use strict";

	QUnit.config.testTimeout = 6000;

	QUnit.test("Methods testing", function (assert) {
		//arrange
		var done = assert.async(3),
			oRTESplitButton = new RTESplitButton();

		oRTESplitButton.placeAt("content");
		sap.ui.getCore().applyChanges();

		//assert
		assert.ok(oRTESplitButton.getIconColor() === 'rgb(0, 0, 0)' || oRTESplitButton.getIconColor() === 'black', "The default text color should be returned");
		done();
		assert.equal(oRTESplitButton._getIconSvgFill().getAttribute('class'), 'fill',
			"_getIconSvgFill function should return the fill of the svg icon");
		done();
		assert.equal(oRTESplitButton.setIconColor('rgb(255, 215, 0)').getIconColor(), 'rgb(255, 215, 0)', "The color is applied");

		//destroy
		oRTESplitButton.destroy();
		done();
	});
});
