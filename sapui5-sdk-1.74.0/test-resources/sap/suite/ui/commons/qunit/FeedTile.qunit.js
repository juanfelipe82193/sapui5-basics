/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/FeedItem",
	"sap/suite/ui/commons/FeedTile",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/jquery"
], function(QUnitUtils, createAndAppendDiv, FeedItem, FeedTile, JSONModel, jQuery) {
	"use strict";
	createAndAppendDiv("uiArea1");
	createAndAppendDiv("uiArea2");
	createAndAppendDiv("uiArea3");
	createAndAppendDiv("uiArea4");
	createAndAppendDiv("uiArea5");
	createAndAppendDiv("uiArea6");
	createAndAppendDiv("uiArea7");
	createAndAppendDiv("uiArea8");
	createAndAppendDiv("uiArea9");
	createAndAppendDiv("uiArea10");
	createAndAppendDiv("uiArea11").setAttribute("style", "width:400px;height:190px");


	var pressedItemId = null;
	var emptyFeedCtrlPressActivated = false;
	var cloudItemId = "cloudItem";
	var oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

	function handlePress(oEvent) {

		pressedItemId = oEvent.getParameter("itemId");
	}

	function handlePressForEmptyFeedControl(oEvent) {

		emptyFeedCtrlPressActivated = true;
	}

	var oItem1 = new FeedItem({
		id: cloudItemId,
		title: "SAP Delivers on Its One Cloud Strategy&<script>\"`' !@$%()=+\\{\\}[]",
		image: "../images/balloons.jpg",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=19910",
		source: "SAP News&<script>\"`' !@$%()=+\\{\\}[]",
		publicationDate: new Date()
	});

	var sId1 = "id1";
	var oFeedTile = new FeedTile({
		id: sId1,
		press: handlePress,
		items: [oItem1]
	});

	oFeedTile.placeAt("uiArea1");


	/************************************************************************************************/
	QUnit.module("Control Rendering Test");

	QUnit.test("TestRenderedOK", function(assert) {

		assert.notEqual(sId1 ? window.document.getElementById(sId1) : null, null, "FeedTile outer HTML Element should be rendered.");
		assert.notEqual(jQuery("#" + sId1 + " .sapSuiteUiCommonsFeedTileTitle"), null, "FeedTile Title should be rendered.");
		assert.notEqual(jQuery("#" + sId1 + " .sapSuiteUiCommonsFeedTileSource"), null, "FeedTile Source should be rendered.");
		assert.notEqual(jQuery("#" + sId1 + " .sapSuiteUiCommonsFeedTileAge"), null, "FeedTile Age should be rendered.");
	});

	QUnit.test("TestRenderedEncodingSourceOK", function(assert) {

		var sSourceId = sId1 + "-feedTileSource";
		var oSource = sSourceId ? window.document.getElementById(sSourceId) : null;

		assert.equal("SAP News&amp;&lt;script&gt;\"`' !@$%()=+{}[]", jQuery(oSource).html(), "Source should be rendered encoded.");

	});

	QUnit.test("TestRenderedEncodingTitleOK", function(assert) {

		var sTitleId = sId1 + "-feedTileTitle";
		var oTitle = sTitleId ? window.document.getElementById(sTitleId) : null; //SAP Delivers on Its One Cloud Strategy

		assert.equal("SAP Delivers on Its One Cloud Strategy&amp;&lt;script&gt;\"`' !@$%()=+{}[]", jQuery(oTitle).html(), "Title should be rendered encoded.");

	});

	/************************************************************************************************/

	QUnit.module("Test private API");

	var sId2 = "id2";

	var oCyclingFeedTile = new FeedTile({
		id: sId2,
		displayDuration: 15,
		defaultImages: ["../images/grass.jpg"] //define default image for tile
	});

	oItem1 = new FeedItem({

		title: "SAP Delivers on Its One Cloud Strategy",
		image: "../images/balloons.jpg",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=19910",
		source: "SAP News",
		publicationDate: new Date()
	});

	oCyclingFeedTile.addItem(oItem1);

	//did not define the image for news item to test default image of the tile
	var oItem2 = new FeedItem({
		title: "2013 SAP 5O5 World Championship Sets Sail in Barbados",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20769",
		source: "SAP News",
		publicationDate: new Date()
	});

	oCyclingFeedTile.addItem(oItem2);

	var oItem3 = new FeedItem({
		title: "2013 SAP Pinnacle Awards Recognize Top Partners",
		image: "../images/grass.jpg",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20676",
		source: "SAP News",
		publicationDate: new Date()
	});

	oCyclingFeedTile.addItem(oItem3);

	var oItem4 = new FeedItem({
		title: "SAP Brings Process Modeling to the Masses",
		image: "../images/grass.jpg",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=18853",
		source: "SAP News",
		publicationDate: new Date()
	});

	oCyclingFeedTile.addItem(oItem4);

	oCyclingFeedTile.placeAt("uiArea2");

	QUnit.test("TestGetItem", function(assert) {

		var currentItem = oCyclingFeedTile.getCurrentItem();
		assert.equal(currentItem.getTitle(), "SAP Delivers on Its One Cloud Strategy", "Current item is valid");

		var nextItem = oCyclingFeedTile.getNextItem();
		assert.equal(nextItem.getTitle(), "2013 SAP 5O5 World Championship Sets Sail in Barbados", "Next item is valid");

	});

	/************************************************************************************************/

	QUnit.module("Events");

	QUnit.test("TestPressEvent", function(assert) {

		qutils.triggerEvent("click", sId1);
		assert.equal(pressedItemId, cloudItemId, "The pressed event is fired and the cload article id is passed in the event.");
	});

	/************************************************************************************************/
	QUnit.module("Incomplete Feed Item Test");
	var sId3 = "id3";
	oFeedTile = new FeedTile({
		id: sId3
	});
	oFeedTile.placeAt("uiArea3");

	QUnit.test("TestRenderedWithNoItems", function(assert) {

		assert.notEqual(sId3 ? window.document.getElementById(sId3) : null, null, "FeedTile without any feeds - outer HTML Element should be rendered.");
	});

	var oEmptyFeedItem = new FeedItem();
	oFeedTile.addItem(oEmptyFeedItem);
	QUnit.test("TestRenderedWithEmptyItems", function(assert) {

		assert.notEqual(sId3 ? window.document.getElementById(sId3) : null, null, "FeedTile with empty feed - outer HTML Element should be rendered.");
	});

	/************************************************************************************************/
	QUnit.module("Default Values Test");

	var oGenericFeedTile = new FeedTile();

	QUnit.test("TestDefaultValues", function(assert) {

		assert.equal(oGenericFeedTile.getDisplayDuration(), 5, "FeedTile default displayDuration should be 5 seconds.");
	});

	QUnit.test("TestMinValueAfterSettingToLowerValue", function(assert) {

		oGenericFeedTile.setDisplayDuration(1);
		assert.equal(oGenericFeedTile.getDisplayDuration(), 3, "FeedTile displayDuration set to 3 secs since 1 sec is lower than min allowed.");
	});

	QUnit.test("TestValueAfterSettingToHigherValue", function(assert) {

		oGenericFeedTile.setDisplayDuration(100);
		assert.equal(oGenericFeedTile.getDisplayDuration(), 100, "FeedTile displayDuration set to 100 seconds.");
	});

	/************************************************************************************************/
	QUnit.module("Empty Source/Age in Feed Item Test");

	var sId4 = "id4";
	oFeedTile = new FeedTile({
		id: sId4
	});

	var oEmptySourceAgeFeedItem = new FeedItem({
		title: "SAP Brings Process Modeling to the Masses",
		image: "../images/grass.jpg",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=18853"
	});

	oFeedTile.addItem(oEmptySourceAgeFeedItem);
	oFeedTile.placeAt("uiArea4");

	QUnit.test("TestRenderedWithEmptySourceFeedItemForSourceDiv", function(assert) {

		assert.notEqual(sId4 + "-feedTileSource" ? window.document.getElementById(sId4 + "-feedTileSource") : null, null, "FeedTile with empty Source FeedItem - div for source should be rendered.");
	});

	QUnit.test("TestRenderedWithEmptySourceFeedItemForSourceDivTxt", function(assert) {

		var sSourceDivId = sId4 + "-feedTileSource";
		var oSourceDiv = sSourceDivId ? window.document.getElementById(sSourceDivId) : null;
		var sSourceTxt = oSourceDiv.innerHTML;
		assert.equal(sSourceTxt, "", "FeedTile with empty Source FeedItem - div for source contains empty string.");
	});

	QUnit.test("TestRenderedWithEmptyPubDateFeedItemForAgeDiv", function(assert) {

		assert.notEqual(sId4 + "-feedTileAge" ? window.document.getElementById(sId4 + "-feedTileAge") : null, null, "FeedTile with empty PubDate FeedItem - div for age should be rendered.");
	});

	QUnit.test("TestRenderedWithEmptyPubDateFeedItemForAgeDivTxt", function(assert) {

		var sAgeDivId = sId4 + "-feedTileAge";
		var oAgeDiv = sAgeDivId ? window.document.getElementById(sAgeDivId) : null;
		var sAgeTxt = oAgeDiv.innerHTML;
		assert.equal(sAgeTxt, "", "FeedTile with empty PubDate FeedItem - div for age contains empty string.");
	});

	/************************************************************************************************/

	QUnit.module("Test default image Rendered OK on tile");

	var sId5 = "id5";
	var oDefaultImageFeedTile = new FeedTile({
		id: sId5,
		defaultImages: ["../images/grass.jpg"] //define default image for tile
	});

	var oItemNoImage = new FeedItem({
		title: "Test default image Rendered OK",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=19910",
		source: "SAP News",
		publicationDate: new Date()
	});

	oDefaultImageFeedTile.addItem(oItemNoImage);

	oDefaultImageFeedTile.placeAt("uiArea5");

	QUnit.test("TestDefaultImageRenderedOK", function(assert) {

		assert.notEqual(sId5 ? window.document.getElementById(sId5) : null, null, "default image testing FeedTile should be rendered.");

		var sImageId = sId5 + "-feedTileImage";
		var oImageDiv = sImageId ? window.document.getElementById(sImageId) : null;

		var sDefaultImage = jQuery(oImageDiv).css("background-image");
		var sImageLink = "grass.jpg";
		var iImageIndex = sDefaultImage.indexOf(sImageLink);
		assert.notEqual(iImageIndex, -1, "FeedTile default image should be rendered.");

	});

	var oDefaultImagesWithOneInvalid = [
		"../images/NewsImage1.png",
		"../images/NewsImage2.png",
		"../images/NewsImage3.png",
		"I am invalid Image"
	];

	var oOneInvalidDefaultImageFeedTile = new FeedTile({
		defaultImages: oDefaultImagesWithOneInvalid
	});

	QUnit.test("TestNumberOfDefaultImagesSetOK", function(assert) {
		assert.equal(oOneInvalidDefaultImageFeedTile.getDefaultImages().length, 3, "Total number of valid default images is 3");
	});

	QUnit.test("TestCyclingOfDefaultImagesOK", function(assert) {
		assert.equal(oOneInvalidDefaultImageFeedTile._defaultImageIndex, -1, "Initial value of _defaultImageIndex is -1");
		var oDefaultImage = oOneInvalidDefaultImageFeedTile.getDefaultImage();
		var iIndex = oOneInvalidDefaultImageFeedTile._defaultImageIndex;
		assert.equal(oDefaultImage, oDefaultImagesWithOneInvalid[iIndex], "Default Image is randomly selected from the supplied list");

		for (var i = 0; i < 10; i++) {
			oDefaultImage = oOneInvalidDefaultImageFeedTile.getDefaultImage();
			iIndex = iIndex === 2 ? 0 : iIndex + 1;
			assert.equal(oDefaultImage, oDefaultImagesWithOneInvalid[iIndex], "Default Image is next cycled image from the supplied list");
		}

	});

	/***********************************************************************/

	QUnit.module("Test displayArticleImage set to true");

	var sId6 = "id6";
	var oDisplayArticleImageFeedTile = new FeedTile({
		id: sId6,
		defaultImages: ["../images/grass.jpg"], //define default image for tile
		displayArticleImage: true
	});

	var oItemHasDisplayImage = new FeedItem({
		title: "displayArticleImage is true: show grass",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=19910",
		source: "SAP News",
		image: "../images/grass.jpg",
		publicationDate: new Date()
	});

	oDisplayArticleImageFeedTile.addItem(oItemHasDisplayImage);

	oDisplayArticleImageFeedTile.placeAt("uiArea6");

	QUnit.test("News Image is grass.", function(assert) {

		assert.notEqual(sId6 ? window.document.getElementById(sId6) : null, null, "displayArticleImage testing FeedTile should be rendered.");

		var sImageId = sId6 + "-feedTileImage";
		var oImageDiv = sImageId ? window.document.getElementById(sImageId) : null;

		var sDefaultImage = jQuery(oImageDiv).css("background-image");
		var sImageLink = "grass.jpg";
		var iImageIndex = sDefaultImage.indexOf(sImageLink);
		assert.notEqual(iImageIndex, -1, "News article image should be rendered.");

	});

	/***********************************************************************/

	QUnit.module("Test displayArticleImage set to false");

	var sId7 = "id7";
	var oDisplayDefaultImageFeedTile = new FeedTile({
		id: sId7,
		defaultImages: ["../images/grass.jpg"], //define default image for tile
		displayArticleImage: false
	});

	var oItemDisplayImage = new FeedItem({
		title: "displayArticleImage is false: show fish",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=19910",
		source: "SAP News",
		image: "../images/grass.jpg",
		publicationDate: new Date()
	});

	oDisplayDefaultImageFeedTile.addItem(oItemDisplayImage);

	oDisplayDefaultImageFeedTile.placeAt("uiArea7");

	QUnit.test("Test displayArticleImage set to false", function(assert) {

		assert.notEqual(sId7 ? window.document.getElementById(sId7) : null, null, "displayArticleImage testing FeedTile should be rendered.");

		var sImageId = sId7 + "-feedTileImage";
		var oImageDiv = sImageId ? window.document.getElementById(sImageId) : null;

		var sDefaultImage = jQuery(oImageDiv).css("background-image");
		var sImageLink = "grass.jpg";
		var iImageIndex = sDefaultImage.indexOf(sImageLink);
		assert.notEqual(iImageIndex, -1, "Default image should be rendered.");

	});

	/***********************************************************************/

	QUnit.module("Test displayArticleImage set to false with no default image");

	var sId8 = "id8";
	var oDisplayNoImageFeedTile = new FeedTile({
		id: sId8,
		displayArticleImage: false
	});

	var oItemDisplayImage1 = new FeedItem({
		title: "displayArticleImage is false with no default image",
		link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=19910",
		source: "SAP News",
		image: "../images/grass.jpg",
		publicationDate: new Date()
	});

	oDisplayNoImageFeedTile.addItem(oItemDisplayImage1);

	oDisplayNoImageFeedTile.placeAt("uiArea8");

	QUnit.test("Test displayArticleImage set to false with no default image", function(assert) {

		assert.notEqual(sId8 ? window.document.getElementById(sId8) : null, null, "displayArticleImage testing FeedTile should be rendered.");

		var sImageId = sId8 + "-feedTileImage";
		var oImageDiv = sImageId ? window.document.getElementById(sImageId) : null;

		var sDefaultImage = jQuery(oImageDiv).css("background-image");
		var sImageLink = ".jpg";
		var iImageIndex = sDefaultImage ? sDefaultImage.indexOf(sImageLink) : -1;
		assert.equal(iImageIndex, -1, "Default image should not be rendered.");

	});

	QUnit.module("Test Invalid Urls. 'link, image, defaultImage' properties should not be set if url is invalid");

	var invalidLinkFeedItem1 = new FeedItem({
		title: "I am used to test Invalid Links",
		image: "I am a goofy URL with malicious script content",
		link: "I am a goofy URL with malicious script content",
		source: "SAP News",
		publicationDate: new Date()
	});

	var invalidLinkFeedItem2 = new FeedItem({
		title: "I am used to test Invalid Links",
		image: "../images/grass.jpg",
		link: "http://www.google.com",
		source: "SAP News",
		publicationDate: new Date()
	});

	var invalidLinkFeedTile = new FeedTile({
		defaultImages: ["I am a goofy URL with malicious script content"],
		items: [invalidLinkFeedItem1, invalidLinkFeedItem2]
	});

	invalidLinkFeedTile.placeAt("uiArea9");

	QUnit.test("Test invalid url", function(assert) {

		assert.equal(invalidLinkFeedTile.getDefaultImage(), "", "defaultImage should not be set");
		assert.equal(invalidLinkFeedTile.getItems()[0].getImage(), "", "image should not be set");
		assert.equal(invalidLinkFeedTile.getItems()[0].getLink(), "", "link should not be set");
		assert.equal(invalidLinkFeedTile.getItems()[1].getImage(), "../images/grass.jpg", "image should be '../images/grass.jpg'");
		assert.equal(invalidLinkFeedTile.getItems()[1].getLink(), "http://www.google.com", "link should be 'http://www.google.com'");
	});

	QUnit.module("Test Empty Feed: A default message - 'No articles to display' text should be displayed; default image appears as background; no press event fired");

	var sId10 = "id10";
	var emptyFeedTile = new FeedTile({
		id: sId10,
		defaultImages: ["../images/grass.jpg"], //define default image for tile
		press: handlePressForEmptyFeedControl
	});

	emptyFeedTile.placeAt("uiArea10");

	QUnit.test("Empty Feed", function(assert) {

		// Test 'No Articles to display' title text
		var sTitleId = sId10 + "-feedTileTitle";
		var oTitle = sTitleId ? window.document.getElementById(sTitleId) : null;
		assert.equal(jQuery(oTitle).html(), oResBundle.getText("FEEDTILE_NOARTICLE_TITLE"), "title should be 'No articles to display'");

		// Test 'Default Image display
		var sImageId = sId10 + "-feedTileImage";
		var oImageDiv = sImageId ? window.document.getElementById(sImageId) : null;
		var sDefaultImage = jQuery(oImageDiv).css("background-image");
		var sImageLink = "grass.jpg";
		var iImageIndex = sDefaultImage.indexOf(sImageLink);

		assert.notEqual(iImageIndex, -1, "FeedTile default image should be rendered.");

		// Test that the press event is not fired
		qutils.triggerEvent("click", sId10);
		assert.equal(emptyFeedCtrlPressActivated, true, "The variable 'emptyFeedCtrlPressActivated' should be set to true. If true, the press event was triggered");
	});

	/*************************************************************************************************/
	QUnit.module("Test stage model");

	var jsonModel = new JSONModel({
		items: [
			{
				title: "French Maker Of Military Rafts Gets An American Identity",
				image: "../images/balloons.jpg",
				link: "http://www.npr.org/blogs/parallels/2013/08/14/211962750/french-maker-of-military-rafts-gets-an-american-identity?ft=1&f=1001",
				source: "News",
				publicationDate: new Date()
			},
			{
				title: "How A Seed Saver Discovered One Of Our Favorite Tomatoes",
				image: "../images/balloons.jpg",
				link: "http://www.npr.org/blogs/thesalt/2013/08/12/211372152/how-a-seed-saver-discovered-one-of-our-favorite-tomatoes?ft=1&f=1001",
				source: "News",
				publicationDate: new Date()
			}
		]
	});

	var oFeedItemTemplate = new FeedItem({
		title: "{title}",
		image: "{image}",
		link: "{link}",
		source: "{source}",
		publicationDate: "{pubDate}"
	});

	var sStageModelTileId = "StageModelTile";
	var oStageModelTile = new FeedTile({
		id: sStageModelTileId,
		displayDuration: 600, // display duration doesn't affect the test
		items: {
			path: "/items",
			template: oFeedItemTemplate
		}
	});
	oStageModelTile.placeAt("uiArea11");
	oStageModelTile.setModel(jsonModel);

	jsonModel = new JSONModel({
		items: [
			{
				title: "French Maker Of Military Rafts Gets An American Identity 2",
				image: "../images/balloons.jpg",
				link: "http://www.npr.org/blogs/parallels/2013/08/14/211962750/french-maker-of-military-rafts-gets-an-american-identity?ft=1&f=1001",
				source: "News",
				publicationDate: new Date()
			},
			{
				title: "How A Seed Saver Discovered One Of Our Favorite Tomatoes 2",
				image: "../images/balloons.jpg",
				link: "http://www.npr.org/blogs/thesalt/2013/08/12/211372152/how-a-seed-saver-discovered-one-of-our-favorite-tomatoes?ft=1&f=1001",
				source: "News",
				publicationDate: new Date()
			}
		]
	});

	QUnit.test("Test cycle", function(assert) {
		var done = assert.async();
		assert.equal(jQuery(document.getElementById(sStageModelTileId + "-feedTileTitle")).text(), "French Maker Of Military Rafts Gets An American Identity", "Before cycle.");
		oStageModelTile.cycle();

		setTimeout(function() {
			assert.equal(jQuery(document.getElementById(sStageModelTileId + "-feedTileTitle")).text(), "How A Seed Saver Discovered One Of Our Favorite Tomatoes", "Next feed item is displayed");
			done();
		}, 3000);
	});

	QUnit.test("Test cycle no transition", function(assert) {
		var done = assert.async();
		assert.equal(jQuery(document.getElementById(sStageModelTileId + "-feedTileTitle")).text(), "How A Seed Saver Discovered One Of Our Favorite Tomatoes", "Before cycle with no transition starts.");
		// "Disable" CSS transitions in jQuery
		jQuery.support.cssTransitions = false;
		oStageModelTile.cycle();

		setTimeout(function() {
			assert.equal(jQuery(document.getElementById(sStageModelTileId + "-feedTileTitle")).text(), "French Maker Of Military Rafts Gets An American Identity", "Next feed item is displayed");
			done();
		}, 3000);
	});

	QUnit.test("Test stage model", function(assert) {
		var done = assert.async();
		assert.equal(jQuery(document.getElementById(sStageModelTileId + "-feedTileTitle")).text(), "French Maker Of Military Rafts Gets An American Identity", "Before stages model is applied.");
		oStageModelTile.stageModel(jsonModel);
		oStageModelTile.cycle();
		setTimeout(function() {
			assert.equal(jQuery(document.getElementById(sStageModelTileId + "-feedTileTitle")).text(), "French Maker Of Military Rafts Gets An American Identity 2", "First feed item is displayed");
			done();
		}, 3000);
	});
});