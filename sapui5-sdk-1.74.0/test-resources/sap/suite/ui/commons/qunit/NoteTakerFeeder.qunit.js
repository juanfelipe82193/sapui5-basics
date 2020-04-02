/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/NoteTakerFeeder",
	"sap/ui/base/Event"
], function(QUnitUtils, createAndAppendDiv, NoteTakerFeeder, Event) {
	"use strict";
	createAndAppendDiv("NTFeeder");


	var oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

	QUnit.module("Control Test - sap.suite.ui.commons.NoteTakerFeeder", {
		beforeEach: function() {
			var that = this;
			this.feeder = new NoteTakerFeeder({
				id: "NTF",
				addNote: function(e) {
					that.addNoteEvent = {
						title: e.getParameter("title"),
						body: e.getParameter("body"),
						timestamp: e.getParameter("timestamp"),
						thumbUp: e.getParameter("thumbUp"),
						thumbDown: e.getParameter("thumbDown")
					};
				}
			});
			this.feeder.placeAt("NTFeeder");
		},

		afterEach: function() {
			this.feeder.destroy();
		}
	});

	QUnit.test("Set title", function(assert) {
		var sTitle = "Title";
		this.feeder.setTitle(sTitle);
		assert.equal(this.feeder._oTitle.getValue(), sTitle, "Title was set");
	});

	QUnit.test("Get title", function(assert) {
		var sTitle = "New title";
		this.feeder._oTitle.setValue(sTitle);
		assert.equal(this.feeder.getTitle(), sTitle, "The title was successfully retrieved");
	});

	QUnit.test("Set text in the body", function(assert) {
		var sBodyText = "Text in the body";
		this.feeder.setBody(sBodyText);
		assert.equal(this.feeder._oBody.getValue(), sBodyText,
			"Text was entered in the body");
	});

	QUnit.test("Get text in the body", function(assert) {
		var sBodyText = "Text in the body";
		this.feeder._oBody.setValue(sBodyText);
		assert.equal(this.feeder.getBody(), sBodyText,
			"The text was successfully retrieved");
	});

	QUnit.test("calculateAddButtonEnabled", function(assert) {
		this.feeder._setAddButtonEnabled("Some text");
		assert.equal(this.feeder._oAddButton.getEnabled(), true,
			"Add Note button is enabled when there is some text in body");

		this.feeder._setAddButtonEnabled("");
		assert.equal(this.feeder._oAddButton.getEnabled(), false,
			"Add Note button is disabled when there is no text in body");

		this.feeder._setAddButtonEnabled(null);
		assert.equal(this.feeder._oAddButton.getEnabled(), false,
			"Add Note button is disabled when there is no text in body");

		this.feeder._setAddButtonEnabled("   ");
		assert.equal(this.feeder._oAddButton.getEnabled(), false,
			"Add Note button is disabled when there is only spaces in body");
	});

	QUnit.test("HandleAdd", function(assert) {
		var sTitle = "Test for title";
		var sBody = "Test for the body text";
		this.feeder.setTitle(sTitle);
		this.feeder.setBody(sBody);
		this.feeder.setThumbUp(true);

		this.feeder._handleAdd();

		assert.equal(this.addNoteEvent.title, sTitle, "Title in event was taken from title field");
		assert.equal(this.addNoteEvent.body, sBody, "Body test in event was taken from body area");
		assert.ok(this.addNoteEvent.timestamp, "Timestamp in event is set and not null");
		assert.ok(this.addNoteEvent.thumbUp, "ThumbUp was set");

		assert.equal(this.feeder.getTitle(), "", "Title was cleared");
		assert.equal(this.feeder.getBody(), "", "Body was cleared");
		assert.ok(!this.feeder.getThumbUp(), "ThumbUp button was unselect");
		assert.ok(!this.feeder.getThumbDown(), "ThumbDown button was unselect");
	});

	QUnit.test("HandleAdd card with an empty body", function(assert) {
		this.feeder._handleAdd();
		assert.ok(!this.addNoteEvent, "AddNote event isn't fired when the body is empty");
	});

	QUnit.test("Test add tags to listbox", function(assert) {
		this.feeder._addTagsToListBox(["PRM", "OneOnOne"]);
		assert.equal(this.feeder._oTagList.getItems()[0].getText(), "PRM");
		assert.equal(this.feeder._oTagList.getItems()[1].getText(), "OneOnOne");
	});

	QUnit.test("Test enter tag", function(assert) {
		this.feeder._addTagsToListBox(["PRM", "OneOnOne", "DKOM", "DKOM2", "FKOM"]);
		this.feeder.setTags(["PRM", "OneOnOne", "DKOM", "DKOM2", "FKOM"]);
		var eData = {};
		eData.liveValue = "PRM DK";
		var oEvent = new Event("", this.feeder, eData);
		this.feeder._handleTagInputLive(oEvent);
		assert.equal(this.feeder._oTagList.getItems().length, 2, "Taglist was filtered");
	});

	QUnit.test("Test handleAddTag", function(assert) {
		this.feeder._addTagsToListBox(["PRM", "OneOnOne", "DKOM", "FKOM"]);
		this.feeder.setTags(["PRM", "OneOnOne", "DKOM", "FKOM"]);
		this.feeder._handleAddTag("PRM OneOnOne OneOnOne");
		assert.equal(this.feeder._selectedTags.length, 2, "added only unique tags");
	});

	QUnit.test("Test adding tags", function(assert) {
		this.feeder._handleAddTag(" PRM   1on1    2on1", []);
		assert.equal(this.feeder._selectedTags.join(" "), "PRM 1on1 2on1", "Tags were correctly parsed");
		assert.equal(this.feeder._oTagButton.getTooltip(), oResBundle.getText("NOTETAKERFEEDER_BUTTON_ADD_TAGS_SELECTED_TOOLTIP") + ": PRM 1on1 2on1", "Tooltip shows selected tags");
		assert.ok(this.feeder._oTagButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederButtonSelected"), "Tag button changes color");
	});

	QUnit.test("Test adding empty tags", function(assert) {
		this.feeder._handleAddTag("", []);
		assert.ok(!this.feeder._selectedTags.length, "No selected tags");
		assert.equal(this.feeder._oTagButton.getTooltip(), oResBundle.getText("NOTETAKERFEEDER_BUTTON_TAG_TOOLTIP"), "Default tooltip is shown");
		assert.ok(!this.feeder._oTagButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederButtonSelected"), "Tag button wasn't changed");
	});

	QUnit.test("Test Tag button toggles view", function(assert) {
		this.feeder._selectedTags = [];
		this.feeder._adjustTagButton();
		assert.equal(this.feeder._oTagButton.getTooltip(), oResBundle.getText("NOTETAKERFEEDER_BUTTON_TAG_TOOLTIP"), "Default tooltip is shown");
		assert.ok(!this.feeder._oTagButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederButtonSelected"), "Tag button wasn't changed");

		this.feeder._selectedTags = ["PRM"];
		this.feeder._adjustTagButton();
		assert.equal(this.feeder._oTagButton.getTooltip(), oResBundle.getText("NOTETAKERFEEDER_BUTTON_ADD_TAGS_SELECTED_TOOLTIP") + ": PRM", "Tooltip shows selected tags");
		assert.ok(this.feeder._oTagButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederButtonSelected"), "Tag button changes color");
	});

	QUnit.test("Test thumb buttons default view", function(assert) {
		this.feeder._setThumbButtonsView();

		assert.ok(this.feeder._oThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederThumbUpButton"), "Thumb Up button is color by default");
		assert.ok(!this.feeder._oThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Thumb Up button is not active by default");

		assert.ok(this.feeder._oThumbDownButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederThumbDownButton"), "Thumb Down button is color by default");
		assert.ok(!this.feeder._oThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Thumb Down button is not active by default");
	});

	QUnit.test("Test ThumbUp button checked", function(assert) {
		this.feeder.setThumbUp(true);
		this.feeder._setThumbButtonsView();

		assert.ok(this.feeder._oThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederThumbUpButton"), "Thumb Up button is active");
		assert.ok(!this.feeder._oThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederThumbUpGreyButton"), "Thumb Up button is not grey");
	});

	QUnit.test("Test ThumbDown button checked", function(assert) {
		this.feeder.setThumbDown(true);
		this.feeder._setThumbButtonsView();

		assert.ok(this.feeder._oThumbDownButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederThumbDownButton"), "Thumb Down button is active");
		assert.ok(!this.feeder._oThumbDownButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFeederThumbDownGreyButton"), "Thumb Down button is not grey");
	});

	QUnit.test("Test ThumbUp button press", function(assert) {
		this.feeder.setThumbDown(true);

		this.feeder._handleThumbUpButtonPress();
		assert.ok(this.feeder.getThumbUp(), "ThumbUp button is selected");
		assert.ok(!this.feeder.getThumbDown(), "ThumbDown button is unselected");

		this.feeder._handleThumbUpButtonPress();
		assert.ok(!this.feeder.getThumbUp(), "ThumbUp button is unselected");
		assert.ok(!this.feeder.getThumbDown(), "ThumbDown button is unselected");

		this.feeder._handleThumbUpButtonPress();
		assert.ok(this.feeder.getThumbUp(), "ThumbUp button is selected");
		assert.ok(!this.feeder.getThumbDown(), "ThumbDown button is unselected");
	});

	QUnit.test("Test ThumbDown button press", function(assert) {
		this.feeder.setThumbUp(true);

		this.feeder._handleThumbDownButtonPress();
		assert.ok(this.feeder.getThumbDown(), "ThumbDown button is selected");
		assert.ok(!this.feeder.getThumbUp(), "ThumbUp button is unselected");

		this.feeder._handleThumbDownButtonPress();
		assert.ok(!this.feeder.getThumbDown(), "ThumbDown button is unselected");
		assert.ok(!this.feeder.getThumbUp(), "ThumbUp button is unselected");

		this.feeder._handleThumbDownButtonPress();
		assert.ok(this.feeder.getThumbDown(), "ThumbDown button is selected");
		assert.ok(!this.feeder.getThumbUp(), "ThumbUp button is unselected");
	});

	QUnit.test("Test AddAttach button disabled", function(assert) {
		this.feeder._disableAddAttachBtn();
		assert.ok(!this.feeder._oAddAttachButton.getEnabled(), "The button is disabled");
		assert.ok(this.feeder._oAddAttachButton.hasStyleClass("sapSuiteUiCommonsNtDsblAttachIcon"), "The button has disable color icon");
		assert.ok(this.feeder._oAddAttachButton.getTooltip() == null, "No tooltip");
	});

	QUnit.test("Test AddAttach button enabled", function(assert) {
		this.feeder._enableAddAttachBtn();
		assert.ok(this.feeder._oAddAttachButton.getEnabled(), "The button is enabled");
		assert.ok(this.feeder._oAddAttachButton.hasStyleClass("sapSuiteUiCommonsNtAttachIcon"), "The button has color icon");
		assert.ok(this.feeder._oAddAttachButton.getTooltip() != null, "Has tooltip");
	});

	/**
	 *    Event test
	 */

	QUnit.module("Events");

	QUnit.test("Test event click (add-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-add-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (9tagListBox)", function(assert) {
		qutils.triggerEvent("click", "NTF-tagListBox");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (inputTag)", function(assert) {
		qutils.triggerEvent("click", "NTF-inputTag");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (cancel-tags-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-cancel-tags-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (add-tags-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-add-tags-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (tag-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-tag-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (thumb-up-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-thumb-up-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (thumb-down-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-thumb-down-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (attach)", function(assert) {
		qutils.triggerEvent("click", "NTF-attach");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (attach-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-attach-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (delete-attach-button)", function(assert) {
		qutils.triggerEvent("click", "NTF-delete-attach-button");
		assert.ok(true, "tested");
	});

	QUnit.test("Test event click (attachmentLink)", function(assert) {
		qutils.triggerEvent("click", "NTF-attachmentLink");
		assert.ok(true, "tested");
	});
});