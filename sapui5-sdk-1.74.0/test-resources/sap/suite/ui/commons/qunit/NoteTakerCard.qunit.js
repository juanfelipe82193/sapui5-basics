sap.ui.define([
	"sap/suite/ui/commons/NoteTakerCardRenderer",
	"sap/ui/commons/Button",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/NoteTakerCard",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/thirdparty/jquery"
], function(
	NoteTakerCardRenderer,
	Button,
	JSONModel,
	NoteTakerCard,
	createAndAppendDiv,
	QUnitUtils,
	jQuery
) {
	"use strict";

	createAndAppendDiv("contentArea");

	var cardRend = new NoteTakerCard("NTCR1");
	cardRend.placeAt("contentArea");

	QUnit.module("note taker card logic", {
		beforeEach: function() {

			// JSON data
			this.oJsonData = {
				header : "Card title",
				body : "Card body",
				timestamp: new Date(2013, 1, 21, 15, 25, 30, 0)
			};

			// JSON model
			this.oJsonModel = new JSONModel();
			this.oJsonModel.setData(this.oJsonData);

			// Create the control with binding
			this.card = new NoteTakerCard({
				id: "NTC",
				header: "{/header}",
				body: "{/body}",
				timestamp: "{/timestamp}"
			});

			this.card.setModel(this.oJsonModel);
		},

		afterEach: function() {
			this.card.destroy();
		}
	});

	QUnit.test("NTC control exists", function(assert) {
		assert.ok(this.card, "NTC found");
	});

	QUnit.test("card knows its header from the model", function(assert) {
		assert.equal(this.card.getHeader(), this.oJsonData.header,
			"header '" + this.oJsonData.header + "' comes from model");
	});

	QUnit.test("card knows its body text from the model", function(assert) {
		assert.equal(this.card.getBody(), this.oJsonData.body,
			"body text '" + this.oJsonData.body + "' comes from model");
	});

	QUnit.test("card formats timestamp", function(assert) {
		var sTimestamp = this.card.getFormattedTimestamp();
		assert.ok((sTimestamp.indexOf("Feb 21, 2013") != -1) && (sTimestamp.indexOf("3:25:30 PM") != -1), "timestamp property correctly formatted");
	});

	QUnit.test("tag formatter: returns 'No tags' when it has empty tag list", function(assert) {
		var msg = this.card._rb.getText("NOTETAKERCARD_LABEL_TAGS_EMPTY");
		assert.ok(this.card._getFormattedTags().indexOf(msg) != -1, msg + " returned");
	});

	QUnit.test("tag formatter: returns tag if the note has one, XSS checked", function(assert) {
		this.card.setTags(["<PRM>"]);
		var msg = this.card._rb.getText("NOTETAKERCARD_LABEL_TAGS_FULL") + ":";
		assert.ok(this.card._getFormattedTags().indexOf(msg + " <span title='&lt;PRM&gt;'>&lt;PRM&gt;</span>") != -1, "tags formatted, script escaped");
	});

	QUnit.test("tag formatter: returns sorted tag list if the note has several tags", function(assert) {
		this.card.setTags(["PRM", "1on1", "360"]);
		var msg = this.card._rb.getText("NOTETAKERCARD_LABEL_TAGS_FULL") + ":";
		assert.ok(this.card._getFormattedTags().indexOf(msg + " <span title='1on1&#x20;360&#x20;PRM'>1on1&#x20;360&#x20;PRM</span>") != -1, "tags sorted");
	});

	QUnit.test("attachment panel ids and classes", function(assert) {
		var oCardAttachment = this.card._prepareAttachmentPanel(false);
		assert.equal(oCardAttachment.getId(), "NTC-attachmentPanel", "card: layout id");
		assert.ok(oCardAttachment.hasStyleClass("suiteUiNtcAttachmentPanel"), "card: layout style class");
		assert.notEqual(oCardAttachment.getContent()[0].getContent().indexOf("suiteUiNtcAttachmentIcon"), -1, "card: icon style class");
		assert.equal(oCardAttachment.getContent()[1].getId(), "NTC-attachmentLink", "card: link id");

		var oOverlayAttachment = this.card._prepareAttachmentPanel(true);
		assert.equal(oOverlayAttachment.getId(), "NTC-overlay-attachmentPanel", "overlay: layout id");
		assert.ok(oOverlayAttachment.hasStyleClass("suiteUiNtcOverlayAttachmentPanel"), "overlay: layout style class");
		assert.notEqual(oOverlayAttachment.getContent()[0].getContent().indexOf("suiteUiNtcAttachmentIcon"), -1, "overlay: icon style class");
		assert.equal(oOverlayAttachment.getContent()[1].getId(), "NTC-overlay-attachmentLink", "overlay: link id");
	});

	QUnit.test("download event", function(assert) {
		var done = assert.async();
		assert.expect(3);
		var card = this.card;

		var btn = new Button();
		btn._ntc = card;

		card.setUid("uid1");
		card.setAttachmentUrl("url1");
		card.setAttachmentFilename("name1");

		card.attachAttachmentClick(function(oEvent) {

			assert.equal(oEvent.getParameter("uid"), "uid1");
			assert.equal(oEvent.getParameter("url"), "url1");
			assert.equal(oEvent.getParameter("filename"), "name1");
			done();
		});

		card._handleAttachmentDownload.apply(btn);
	});

	QUnit.test("full URL (incl. protocol) recognized", function(assert) {
		var card = this.card;
		assert.ok(card._isFullUrl("http://www.sap.com"), "http://www.sap.com is a full URL");
		assert.ok(!card._isFullUrl("www.sap.com"), "www.sap.com is not a full URL");
	});

	QUnit.test("short URL (w/o protocol) recognized", function(assert) {
		var card = this.card;
		assert.ok(!card._isShortUrl("http://www.sap.com"), "http://www.sap.com is not a short URL");
		assert.ok(card._isShortUrl("www.sap.com"), "www.sap.com is a short URL");
	});

	QUnit.test("email recognized", function(assert) {
		//valid email
		var card = this.card;
		var testToTest = "teddy.bear@sap.com";
		assert.ok(card._isEmail(testToTest), testToTest + " is an email address");
		//no @ sign
		testToTest = "tomcat_at_sap.com";
		assert.ok(!card._isEmail(testToTest), testToTest + " is an not an email address");
		//no domain suffix
		testToTest = "mickey.Mouse@noDomain";
		assert.ok(!card._isEmail(testToTest), testToTest + " is an not an email address");
		//domain suffix is longer than 5 characters
		testToTest = "dolly.sheep@long.domain";
		assert.ok(!card._isEmail(testToTest), testToTest + " is an not an email address");
		//illegal character used
		testToTest = "do$ald.duck@sap.com";
		assert.ok(!card._isEmail(testToTest), testToTest + " is an not an email address");
	});


	QUnit.module("note taker card rendering", {
		beforeEach: function(assert) {

			// JSON data
			this.oJsonData = {
				header : "Card title",
				body : "Card body"
			};

			// JSON model
			this.oJsonModel = new JSONModel();
			this.oJsonModel.setData(this.oJsonData);

			// Get the control and set binding
			this.card = sap.ui.getCore().byId("NTCR1");
			this.card.bindProperty("header", "/header");
			this.card.bindProperty("body", "/body");
			this.card.setModel(this.oJsonModel);

			this.superOnAfterRendering = this.card.onAfterRendering || function(){};

			this.eColors = {
				NEUTRAL:    {value : 1, codeHEX: "#999999", codeRGB: "rgb(153, 153, 153)"},
				GREEN:      {value : 2, codeHEX: "#007833", codeRGB: "rgb(0, 120, 51)"},
				RED:        {value : 3, codeHEX: "#cc1919", codeRGB: "rgb(204, 25, 25)"}
			};
			this.fnAssertColor = function(oJQueryObject, eColor, sMessage) {
				if (eColor) {
					var borderColor = oJQueryObject.css("border-top-color");
					assert.ok(borderColor == eColor.codeRGB || borderColor == eColor.codeHEX, sMessage);
				}
			};
		},

		afterEach: function() {
			this.card.onAfterRendering = this.superOnAfterRendering;

			this.card.setThumbUp(false);
			this.card.setThumbDown(false);
		}
	});

	QUnit.test("card is rendered", function(assert) {
		assert.ok(jQuery("#contentArea").html(), "content area is not empty");
	});

	QUnit.test("header is rendered", function(assert) {
		var done = assert.async();
		assert.expect(1);
		var sHeader = this.oJsonData.header;
		setTimeout( function() {
			assert.equal(jQuery("#contentArea").find("div.sapSuiteUiCommonsNoteTakerCardHeader label").text(),
				sHeader,
				"header '" + sHeader + "' rendered to the page");
			done();
		}, 10);
	});

	QUnit.test("body is rendered", function(assert) {
		var done = assert.async();
		assert.expect(1);
		var sBody = this.oJsonData.body;
		setTimeout( function() {
			assert.equal(jQuery("#contentArea").find("div.sapSuiteUiCommonsNoteTakerCardBody").text(),
				sBody,
				"body text '" + sBody + "' rendered to the page");
			done();
		}, 10);
	});

	QUnit.test("full link is rendered as link", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// JSON data with full URL
		var oJsonDataWithFullUrl = {
			header : "Card title",
			body : "http://www.sap.com"
		};
		this.oJsonModel.setData(oJsonDataWithFullUrl);

		setTimeout( function() {
			var iAnchors = jQuery("#contentArea").find("div.sapSuiteUiCommonsNoteTakerCardBody").find("a").length;
			assert.ok(iAnchors, "Anchor tag(s) found: " + iAnchors);
			done();
		}, 10);
	});

	QUnit.test("short link is rendered as link", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// JSON data with short URL
		var oJsonDataWithShortUrl = {
			header : "Card title",
			body : "www.sap.com"
		};
		this.oJsonModel.setData(oJsonDataWithShortUrl);

		setTimeout( function() {
			var iAnchors = jQuery("#contentArea").find("div.sapSuiteUiCommonsNoteTakerCardBody").find("a").length;
			assert.ok(iAnchors, "Anchor tag(s) found: " + iAnchors);
			done();
		}, 10);
	});

	QUnit.test("email is rendered as link", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// JSON data with email
		var oJsonDataWithEmail = {
			header : "Card title",
			body : "dummy.user@sap.com"
		};
		this.oJsonModel.setData(oJsonDataWithEmail);

		setTimeout( function() {
			var iAnchors = jQuery("#contentArea").find("div.sapSuiteUiCommonsNoteTakerCardBody").find("a").length;
			assert.ok(iAnchors, "Anchor tag(s) found: " + iAnchors);
			done();
		}, 10);
	});

	QUnit.test("truncated header calculation", function(assert) {
		var sLongHeader = "_a34567890_b34567890_c34567890_d34567890_e345";
		assert.equal(NoteTakerCardRenderer.getTruncatedHeader(sLongHeader), "_a34567890_b34567...");
	});

	QUnit.test("truncated header has tooltip", function(assert) {
		var done = assert.async();
		var sLongHeader = "_a34567890_b34567890_c34567890_d34567890_e345";

		// JSON data with long header
		var oJsonDataWithLongHeader = {
			header : sLongHeader,
			body : "Card body"
		};
		this.oJsonModel.setData(oJsonDataWithLongHeader);

		assert.expect(2);
		setTimeout( function() {
			var oHeaderLabel = jQuery("#contentArea").find("div.sapSuiteUiCommonsNoteTakerCardHeader").find("label");

			var sLabelTitle = oHeaderLabel.attr("title");
			assert.equal(sLabelTitle, sLongHeader, "tooltip is correct" );

			var sLabelText = oHeaderLabel.text();
			assert.equal(sLabelText, NoteTakerCardRenderer.getTruncatedHeader(sLongHeader),
				"header text is correct");
			done();
		}, 10);
	});

	QUnit.test("open overlay in view mode", function(assert) {
		var done = assert.async();
		var card = this.card;
		var fnAssert = function () {
			assert.ok(true, "Overlay was opened in view mode");
			card._closeOverlay();
		};
		var fnResume = function () {
			card._oOverlayCard._oPopup.detachOpened(fnAssert);
			card._oOverlayCard._oPopup.detachClosed(fnResume);
			done();
		};

		card._oOverlayCard._oPopup.attachOpened(fnAssert);
		card._oOverlayCard._oPopup.attachClosed(fnResume);

		card._openOverlay();
	});

	QUnit.test("open overlay in edit mode", function(assert) {
		var done = assert.async();
		var card = this.card;
		var fnAssert = function () {
			assert.ok(true, "Overlay was opened in view mode");
			card._closeOverlay();
		};
		var fnResume = function () {
			card._oOverlayCard._oPopup.detachOpened(fnAssert);
			card._oOverlayCard._oPopup.detachClosed(fnResume);
			done();
		};

		card._oOverlayCard._oPopup.attachOpened(fnAssert);
		card._oOverlayCard._oPopup.attachClosed(fnResume);

		card._openOverlay(true);
	});

	QUnit.test("save/edit functions switches overlay mode", function(assert) {
		var done = assert.async();
		assert.expect(3);
		var card = this.card;
		var fnAssert = function () {
			assert.strictEqual(card._oOverlayCard.bEditMode, false, "view mode");
			card._fnEdit();
			assert.strictEqual(card._oOverlayCard.bEditMode, true, "edit mode");
			card._fnSave();
			assert.strictEqual(card._oOverlayCard.bEditMode, false, "back to mode");
			card._closeOverlay();
		};
		var fnResume = function () {
			card._oOverlayCard._oPopup.detachOpened(fnAssert);
			card._oOverlayCard._oPopup.detachClosed(fnResume);
			done();
		};

		card._oOverlayCard._oPopup.attachOpened(fnAssert);
		card._oOverlayCard._oPopup.attachClosed(fnResume);

		card._openOverlay(); // view mode
	});

	QUnit.test("edit button exists", function(assert) {
		var buttonEdit = jQuery("#NTCR1-edit-button").get();
		assert.notDeepEqual(buttonEdit, [], "edit button found: " + buttonEdit );
	});

	QUnit.test("if body text doesn't exceed default value then view all link is absent", function(assert) {
		var done = assert.async();
		var aLongBody = new Array(this.card.getViewAllTrigger() + 1);	// +1 - exact trigger value

		this.card.setBody(aLongBody.join("a"));

		setTimeout( function() {
			assert.equal(jQuery("#NTCR1-viewAll").length, 0, "viewAll division not found");
			done();
		}, 10);
	});

	QUnit.test("if body text exceeds default value then view all link appears", function(assert) {
		var done = assert.async();
		var aLongBody = new Array(this.card.getViewAllTrigger() + 2);	// +2 - trigger value + 1

		this.card.setBody(aLongBody.join("a"));

		setTimeout( function() {
			assert.equal(jQuery("#NTCR1-viewAll-link").length, 1, "viewAll link found");
			done();
		}, 10);
	});

	QUnit.test("if body text doesn't exceed specified value then view all link is absent", function(assert) {
		var done = assert.async();
		this.card.setViewAllTrigger(20);

		var aLongBody = new Array(21);	// +1 - exact trigger value

		this.card.setBody(aLongBody.join("a"));

		setTimeout( function() {
			assert.equal(jQuery("#NTCR1-viewAll").length, 0, "viewAll division not found when body length 20");
			done();
		}, 10);
	});

	QUnit.test("if body text exceeds specified value then view all link appears", function(assert) {
		var done = assert.async();
		this.card.setViewAllTrigger(20);

		var aLongBody = new Array(22);	// +2 - trigger value + 1

		this.card.setBody(aLongBody.join("a"));

		setTimeout( function() {
			assert.equal(jQuery("#NTCR1-viewAll-link").length, 1, "viewAll link found when body length 21");
			done();
		}, 10);
	});

	QUnit.test("the card is marked 'No tags' when it has empty tag list", function(assert) {
		var msg = this.card._rb.getText("NOTETAKERCARD_LABEL_TAGS_EMPTY");
		assert.equal(jQuery("#NTCR1-tag-list").text(), msg, "The card without tags is marked: " + msg);
	});

	QUnit.test("the card shows tag if the note has one", function(assert) {
		var done = assert.async();
		this.card.setTags(["PRM"]);

		setTimeout( function() {
			assert.equal(jQuery("#NTCR1-tag-list").text(), "Tags: PRM", "The card shows its tags.");
			done();
		}, 10);
	});

	QUnit.test("the card shows tags sorted if the note has several", function(assert) {
		var done = assert.async();
		this.card.setTags(["PRM", "1on1", "360"]);

		setTimeout( function() {
			assert.equal(jQuery("#NTCR1-tag-list").text(), "Tags: 1on1 360 PRM", "The card shows its tags sorted.");
			done();
		}, 10);
	});

	QUnit.test("Test delete event", function(assert) {
		var isCalled = false;
		this.card.attachDeleteNote(function (oEvent) {
			var title =  oEvent.getParameter("title");
			assert.equal(title, "Card title", "Title of deleted card is correct");
			var body = oEvent.getParameter("body");
			assert.equal(body, "Card body", "Body of deleted card is correct");
			isCalled = true;
		});
		this.card._handleDeleteClick();
		assert.ok(isCalled, "Delete is event is called");
	});

	QUnit.test("Test wrapThumbToDiv", function (assert) {
		var sHtml;
		var sId = "thumb";

		this.card.setThumbUp(true);
		this.card.setThumbDown(false);
		sHtml = this.card._wrapThumbToDiv(sId);
		assert.equal(sHtml, "<div id='" + sId + "' class='sapSuiteUiCommonsNoteTakerCardThumbUp' title='" +
				this.card._rb.getText("NOTETAKERCARD_ICON_THUMB_UP_TOOLTIP") + "'></div>");

		this.card.setThumbUp(false);
		this.card.setThumbDown(true);
		sHtml = this.card._wrapThumbToDiv(sId);
		assert.equal(sHtml, "<div id='" + sId + "' class='sapSuiteUiCommonsNoteTakerCardThumbDown' title='" +
				this.card._rb.getText("NOTETAKERCARD_ICON_THUMB_DOWN_TOOLTIP") + "'></div>");

		this.card.setThumbUp(false);
		this.card.setThumbDown(false);
		sHtml = this.card._wrapThumbToDiv(sId);
		assert.equal(sHtml, "<div id='" + sId + "'></div>");
	});

	QUnit.test("color indication: basic flow #1, card", function(assert) {
		var done = assert.async();
		assert.expect(2);

		var card = this.card,
			colors =  this.eColors,
			fnAssertColor = this.fnAssertColor;
		var superOAR = this.superOnAfterRendering;

		card.onAfterRendering = function() {
			superOAR.call(card);
			var cardStyle = jQuery(".sapSuiteUiCommonsNoteTakerCard");
			var borderWidth = cardStyle.css("border-top-width");
			assert.equal(borderWidth, "4px", "4px border");
			fnAssertColor(cardStyle, colors.GREEN, "green card");
			done();
		};

		card.setThumbUp(true);
	});

	QUnit.test("color indication: basic flow #1, overlay", function(assert) {
		var done = assert.async();
		assert.expect(2);
		var card = this.card;
		var fnAssert = function () {
			var overlayStyle = jQuery(".sapUiUx3OCContent");
			var borderWidth = overlayStyle.css("border-top-width");
			assert.equal(borderWidth, "4px", "4px border");
			this.fnAssertColor( overlayStyle, this.eColors.GREEN, "green overlay");

			card._closeOverlay();
		}.bind(this);
		var fnResume = function () {
			card._oOverlayCard._oPopup.detachOpened(fnAssert);
			card._oOverlayCard._oPopup.detachClosed(fnResume);
			done();
		};

		card._oOverlayCard._oPopup.attachOpened(fnAssert);
		card._oOverlayCard._oPopup.attachClosed(fnResume);

		card.setThumbUp(true);
		card._openOverlay();
	});

	QUnit.test("color indication: alt flow #2, card", function(assert) {
		var done = assert.async();
		assert.expect(2);

		var card = this.card;
		var superOAR = this.superOnAfterRendering;

		card.onAfterRendering = function() {
			superOAR.call(card);
			var cardStyle = jQuery(".sapSuiteUiCommonsNoteTakerCard");
			var borderWidth = cardStyle.css("border-top-width");
			assert.equal(borderWidth, "4px", "4px border");
			this.fnAssertColor( cardStyle, this.eColors.RED, "red card");
			done();
		}.bind(this);

		card.setThumbDown(true);
	});

	QUnit.test("color indication: alt flow #2, overlay", function(assert) {
		var done = assert.async();
		assert.expect(3);
		var card = this.card,
			colors = this.eColors,
			fnAssertColor = this.fnAssertColor;

		function fnAssertRed() {
			// STEP 1. Assert red on 1st overlay opening
			fnAssertColor( jQuery(".sapUiUx3OCContent"), colors.RED, "red overlay");

			card.setThumbDown(false);
			card._closeOverlay();
		}
		card._oOverlayCard._oPopup.attachOpened(fnAssertRed);

		function fnResumeAfterRed() {
			// STEP 2. Assert grey on card after overlay 's closed
			fnAssertColor( jQuery(".sapSuiteUiCommonsNoteTakerCard"), colors.NEUTRAL, "grey card");

			card._oOverlayCard._oPopup.detachOpened(fnAssertRed);
			card._oOverlayCard._oPopup.detachClosed(fnResumeAfterRed);
			card._oOverlayCard._oPopup.attachOpened(fnAssertGrey);
			card._oOverlayCard._oPopup.attachClosed(fnResumeAfterGrey);
			card._openOverlay(true);
		}
		card._oOverlayCard._oPopup.attachClosed(fnResumeAfterRed);

		function fnAssertGrey() {
			// STEP 3. Assert grey on 2nd overlay opening
			fnAssertColor(jQuery(".sapUiUx3OCContent"), colors.NEUTRAL, "grey overlay");

			card._closeOverlay();
		}

		function fnResumeAfterGrey() {
			card._oOverlayCard._oPopup.detachOpened(fnAssertGrey);
			card._oOverlayCard._oPopup.detachClosed(fnResumeAfterGrey);
			done();
		}

		card.setThumbDown(true);
		card._openOverlay(true);
	});

	QUnit.test("color indication: alt flow #3, card", function(assert) {
		var cardStyle = jQuery(".sapSuiteUiCommonsNoteTakerCard");
		var borderWidth = cardStyle.css("border-top-width");
		assert.equal(borderWidth, "4px", "4px border");
		this.fnAssertColor( cardStyle, this.eColors.NEUTRAL, "grey card");
	});

	QUnit.test("color indication: alt flow #3, overlay", function(assert) {
		var done = assert.async();
		assert.expect(3);
		var card = this.card,
			colors = this.eColors,
			fnAssertColor = this.fnAssertColor;

		var fnAssertRed = function () {
			// STEP 1. Assert grey on 1st overlay opening
			fnAssertColor( jQuery(".sapUiUx3OCContent"), colors.NEUTRAL, "grey overlay");

			// Change Thumbs according to test plan
			card.setThumbDown(true);
			card.setThumbDown(false);
			card.setThumbUp(true);
			card._closeOverlay();
		};
		card._oOverlayCard._oPopup.attachOpened(fnAssertRed);

		function fnResumeAfterRed() {
			// STEP 2. Assert green on card after overlay 's closed
			fnAssertColor( jQuery(".sapSuiteUiCommonsNoteTakerCard"), colors.GREEN, "green card");

			card._oOverlayCard._oPopup.detachOpened(fnAssertRed);
			card._oOverlayCard._oPopup.detachClosed(fnResumeAfterRed);
			card._oOverlayCard._oPopup.attachOpened(fnAssertGrey);
			card._oOverlayCard._oPopup.attachClosed(fnResumeAfterGrey);
			card._openOverlay(true);
		}
		card._oOverlayCard._oPopup.attachClosed(fnResumeAfterRed);

		function fnAssertGrey() {
			// STEP 3. Assert green on 2nd overlay opening
			fnAssertColor( jQuery(".sapUiUx3OCContent"), colors.GREEN, "green overlay");

			card._closeOverlay();
		}

		function fnResumeAfterGrey() {
			card._oOverlayCard._oPopup.detachOpened(fnAssertGrey);
			card._oOverlayCard._oPopup.detachClosed(fnResumeAfterGrey);
			done();
		}

		card._openOverlay(true);
	});
}, /* bExport= */ true);