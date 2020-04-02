/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/FeedItemHeader",
	"sap/ui/thirdparty/jquery"
], function(QUnitUtils, createAndAppendDiv, FeedItemHeader, jQuery) {
	"use strict";
	createAndAppendDiv("list");


	var oPressedLink = null;
	//var listItems = new Array();

	function handlePress(oEvent) {

		oPressedLink = oEvent.getParameter("link");
	}

	var sId1 = "id1";
	var oLink = "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20769";
	var oFeedItemHeader = new FeedItemHeader({
		id : sId1,
		title : "My Test FeedItemHeader",
		description : "This is a description of my feed item...",
		image : "../images/balloons.jpg",
		link : oLink,
		source : "SAP News",
		publicationDate : new Date(),
		press : handlePress
	});

	//listItems.push(oFeedItemHeader);
	oFeedItemHeader.placeAt("list");


	QUnit.module("Control Rendering Test");

	QUnit.test("TestRenderedOK", function(assert) {

		assert.notEqual(sId1 ? window.document.getElementById(sId1) : null, null,
				"FeedItemHeader outer HTML Element should be rendered.");
		assert.notEqual(sId1 + "-feedItemHeaderImage" ? window.document.getElementById(sId1 + "-feedItemHeaderImage") : null, null,
				"FeedItemHeader Image should be rendered.");
		assert.notEqual(sId1 + "-feedItemHeaderTitle" ? window.document.getElementById(sId1 + "-feedItemHeaderTitle") : null, null,
				"FeedItemHeader Title should be rendered.");
		assert.notEqual(sId1 + "-feedItemHeaderDescription" ? window.document.getElementById(sId1 + "-feedItemHeaderDescription") : null, null,
				"FeedItemHeader Description should be rendered.");
		assert.notEqual(sId1 + "-feedItemHeaderSource" ? window.document.getElementById(sId1 + "-feedItemHeaderSource") : null, null,
				"FeedItemHeader Source should be rendered.");
		assert.notEqual(sId1 + "-feedItemHeaderAge" ? window.document.getElementById(sId1 + "-feedItemHeaderAge") : null, null,
				"FeedItemHeader Age should be rendered.");
	});

	/************************************************************************************************/
	QUnit.module("Events");
	QUnit.test("TestPressEvent", function(assert) {
		qutils.triggerEvent("click", sId1);
		assert.equal(oPressedLink, oLink,
				"The pressed event is fired and the link is passed in the event.");
	});
	/************************************************************************************************/

	QUnit.module("Test Invalid URIs");

	var invalidLinkFeedItemHeader = new FeedItemHeader({
		title : "I am used to test Invalid Links",
		image : "I am a goofy URL with malicious script content",
		link : "I am a goofy URL with malicious script content",
		source : "SAP News",
		publicationDate : new Date()
	});

	//listItems.push(invalidLinkFeedItemHeader);
	invalidLinkFeedItemHeader.placeAt("list");

	QUnit.test("Test invalid uri", function(assert) {

		assert.equal(invalidLinkFeedItemHeader.getImage(), "",
				"image should not be set");
		assert.equal(invalidLinkFeedItemHeader.getLink(), "",
				"link should not be set");
	});

	/*************************************************************************************************/

	QUnit.module("Test Header Description Containing HTML");

	var headerWithHtmlDesc = new FeedItemHeader({
		id: "htmlDesc",
		title: "This FeedItemHeader has a description that contains HTML content.",
		image : "../images/grass.jpg",
		description: 'Link <a href="http://www.yahoo.com">Yahoo</a>',
		publicationDate : new Date(),
		source: "Malicious Source"
	});

	//listItems.push(headerWithHtmlDesc);
	headerWithHtmlDesc.placeAt("list");

	QUnit.test("Test HTML Content Present", function(assert){

		var $link = jQuery("#htmlDesc-feedItemHeaderDescription a");
		assert.equal($link[0].href, "http://www.yahoo.com/", "Description should contain link to Yahoo");
	});


	/*
	var oList = new sap.m.List({
		mode: sap.m.ListMode.SingleSelectMaster,
		items: listItems
	});
	oList.placeAt("list");
	*/
});
