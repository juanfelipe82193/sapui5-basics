/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/IconPool",
	"sap/suite/ui/commons/LaunchTile",
	"sap/ui/thirdparty/jquery"
], function(QUnitUtils, createAndAppendDiv, IconPool, LaunchTile, jQuery) {
	"use strict";
	createAndAppendDiv("uiArea1");

	var pressedTitle;
	var pressedLink;

	function handlePress(oEvent) {

		pressedTitle = oEvent.getParameter("title");
		pressedLink = oEvent.getParameter("link");
	}

	var sId1 = "id1";
	var sTitle = "Test Launch Tile";
	var oLink = "http://www.sap.com";
	var oLaunchTile = new LaunchTile({
		id : sId1,
		press : handlePress,
		title : sTitle,
		icon : IconPool.getIconURI("shortcut"),
		tooltip : "Test Launch Tile Tooltip",
		link : oLink
	});

	oLaunchTile.placeAt("uiArea1");


	QUnit.module("Control Rendering Test");

	QUnit.test("TestRenderedOK", function(assert) {

		var oDomNode = sId1 ? window.document.getElementById(sId1) : null;
		assert.notEqual(oDomNode, null, "LaunchTile outer HTML Element should be rendered.");
		assert.notEqual(oDomNode.getAttribute("title"), null, "LaunchTile Tooltip should be rendered.");
		assert.notEqual(jQuery("#" + sId1 + " -launchTileText"), null, "LaunchTile Title should be rendered.");
		assert.notEqual(jQuery("#" + sId1 + " -launchTileIcon"), null, "LaunchTile Icon should be rendered.");
	});

	/************************************************************************************************/
	QUnit.module("Events");
	QUnit.test("TestPressEvent", function(assert) {

		qutils.triggerEvent("click", sId1);
		assert.equal(pressedTitle, sTitle, "The pressed event is fired and the title is passed in the event.");
		assert.equal(pressedLink, oLink, "The pressed event is fired and the link is passed in the event.");
	});

	/************************************************************************************************/
});