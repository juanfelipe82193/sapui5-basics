/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/InfoTile",
	"sap/m/Image",
	"sap/m/MessageToast"
], function(QUnitUtils, createAndAppendDiv, InfoTile, Image, MessageToast) {
	"use strict";
	createAndAppendDiv("content");


	var oInfoTile = new InfoTile({
		id : "id1",
		description : "Description 1",
		title : "Title 1",
		footer : "Footer 1",
		state: "Loaded",
		content: new Image({src: "../images/strawberry1.jpg"}),
		press: function (oEvent) {
			MessageToast.show("The tile is pressed.");
		},
		tooltip: "Tooltip 1"
	});
	oInfoTile.placeAt("content");

	QUnit.test("Tile is rendered", function(assert) {
		assert.notEqual(window.document.getElementById("id1"), null, "InfoTile is rendered.");
	});
});