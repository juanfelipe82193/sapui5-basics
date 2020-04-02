/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/NoteTaker",
	"sap/suite/ui/commons/NoteTakerCard",
	"sap/ui/base/Event",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(
	QUnitUtils,
	createAndAppendDiv,
	NoteTaker,
	NoteTakerCard,
	Event,
	JSONModel,
	Filter,
	FilterOperator
) {
	"use strict";
	createAndAppendDiv("qunit-fixture-1");
	createAndAppendDiv("qunit-fixture-2");
	createAndAppendDiv("qunit-fixture-3");
	createAndAppendDiv("qunit-fixture-4");
	createAndAppendDiv("qunit-fixture-5");


	// first NoteTaker to be rendered in first UI area
	var sNoteTakerId1 = "NT1";
	var noteTaker1 = new NoteTaker({
		id: sNoteTakerId1
	});
	noteTaker1.placeAt("qunit-fixture-1");

	// second NoteTaker to be rendered in second UI area
	var noteTaker2 = new NoteTaker({
		id: "NT2"
	});
	noteTaker2.placeAt("qunit-fixture-2");

	var noteTaker2Feeder = sap.ui.getCore().byId("NT2-feeder");
	noteTaker2Feeder.setBody("Text");


	QUnit.module("sap.suite.ui.commons.NoteTaker");

	QUnit.test("TestRenderedOK", function(assert) {
		var sNoteTakerId1 = "NT1";

		assert.notEqual(sNoteTakerId1 ? window.document.getElementById(sNoteTakerId1) : null, null, "NoteTaker outer HTML Element is rendered.");
	});

	QUnit.module("sap.suite.ui.commons.NoteTaker. Test Defaults");

	QUnit.test("Default config test", function(assert) {
		var noteTaker2 = sap.ui.getCore().byId("NT2");
		var card;

		card = new NoteTakerCard({
			id: "NT2_NTC1",
			header: "Card header 1",
			body: "Card text body 1"
		});
		noteTaker2.addCard(card);

		card = new NoteTakerCard({
			id: "NT2_NTC2",
			header: "Card header 2",
			body: "Card text body 2"
		});
		noteTaker2.addCard(card);

		card = new NoteTakerCard({
			id: "NT2_NTC3",
			header: "Card header 3",
			body: "Card text body 3"
		});
		noteTaker2.addCard(card);

		assert.equal(noteTaker2._carousel.getVisibleItems(), 2, "Default value for visible items is correct");
		assert.equal(noteTaker2._carousel.getContent().length, 4, "Carousel cards set correctly");
	});

	QUnit.module("sap.suite.ui.commons.NoteTaker. Add operations");

	QUnit.test("Check carousel is updated on Add button click", function(assert) {
		var noteTaker2 = sap.ui.getCore().byId("NT2");
		var noteTaker2Feeder = sap.ui.getCore().byId("NT2-feeder");

		noteTaker2Feeder._oAddButton.setEnabled(true);
		qutils.triggerEvent("click", "NT2-feeder-add-button");

		assert.equal(noteTaker2._carousel.getContent().length, 5, "New Note card is added to carousel by Add button click");
	});

	QUnit.test("Check if programatic add of Note card is working correctly in NoteTaker control", function(assert) {
		var noteTakerAddTest = new NoteTaker({
			id: "NT_ADD_TEST"
		});

		var addedcard = new NoteTakerCard({
			id: "NT_ADDED_NOTE",
			header: "Card header",
			body: "Card text body"
		});

		noteTakerAddTest.addCard(addedcard);
		noteTakerAddTest.placeAt("qunit-fixture-2");

		assert.equal(noteTakerAddTest._carousel.getContent().length, 2, "New note card is added to carousel control programmatically");
	});

	QUnit.module("sap.suite.ui.commons.NoteTaker. Test overriden methods for cards aggregation", {
		beforeEach: function() {
			var noteTakerAddTest = new NoteTaker({
				id: "NT_AGGR1"
			});
			noteTakerAddTest.placeAt("qunit-fixture-4");
		}, afterEach: function() {
			sap.ui.getCore().getControl("NT_AGGR1").destroy();
		}
	});

	QUnit.test("Check add method", function(assert) {

		var addedcard = new NoteTakerCard({
			header: "Added card title 1",
			body: "Added card body 1"
		});

		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");
		noteTakerAddTest.addCard(addedcard);

		assert.equal(noteTakerAddTest.getCards().length, 1, "New note card is added to cards aggregation");
	});

	QUnit.test("Check insert method", function(assert) {
		var addedcard = new NoteTakerCard({
			header: "Added card title 1",
			body: "Added card body 1"
		});

		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");
		noteTakerAddTest.addCard(addedcard);

		addedcard = new NoteTakerCard({
			header: "Added card title 2",
			body: "Added card body 2"
		});

		noteTakerAddTest.insertCard(addedcard, 0);

		assert.equal(noteTakerAddTest.getCards().length, 2, "New note card is inserted to cards aggregation");
	});

	QUnit.test("Check indexOf method", function(assert) {
		var addedcard = new NoteTakerCard({
			header: "Added card title 1",
			body: "Added card body 1"
		});

		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");
		noteTakerAddTest.addCard(addedcard);

		assert.equal(noteTakerAddTest.indexOfCard(addedcard), 0, "Index of card is correct");
	});

	QUnit.test("Check remove method", function(assert) {
		var addedcard = new NoteTakerCard({
			header: "Added card title 1",
			body: "Added card body 1"
		});

		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");
		noteTakerAddTest.addCard(addedcard);
		noteTakerAddTest.removeCard(addedcard);
		assert.equal(noteTakerAddTest.getCards().length, 0, "Card was removed");
	});

	QUnit.test("Check removeAll method", function(assert) {
		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");

		var addedcard = new NoteTakerCard({
			header: "Added card title 1",
			body: "Added card body 1"
		});
		noteTakerAddTest.addCard(addedcard);

		addedcard = new NoteTakerCard({
			header: "Added card title 2",
			body: "Added card body 2"
		});
		noteTakerAddTest.addCard(addedcard);

		noteTakerAddTest.removeAllCards();

		assert.equal(noteTakerAddTest.getCards().length, 0, "All cards was removed");
		assert.equal(noteTakerAddTest._carousel.getContent().length, 1, "Feeder is in place");
	});

	QUnit.test("Check manual sorting when addCard method called", function(assert) {
		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");

		var addedcard1 = new NoteTakerCard({
			header: "Added card title 1",
			body: "Added card body 1",
			timestamp: new Date(2011, 10, 15)
		});
		noteTakerAddTest.addCard(addedcard1);

		var addedcard2 = new NoteTakerCard({
			header: "Added card title 2",
			body: "Added card body 2",
			timestamp: new Date(2011, 11, 15)
		});
		noteTakerAddTest.addCard(addedcard2);

		assert.equal(noteTakerAddTest.indexOfCard(addedcard2), 0, "Cards sorted correctly");
	});

	QUnit.test("Check manual sorting when insertCard method is called", function(assert) {
		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");

		var addedcard1 = new NoteTakerCard({
			header: "Added card title 1",
			body: "Added card body 1",
			timestamp: new Date(2011, 10, 15)
		});
		noteTakerAddTest.insertCard(addedcard1, 0);

		var addedcard2 = new NoteTakerCard({
			header: "Added card title 2",
			body: "Added card body 2",
			timestamp: new Date(2011, 11, 15)
		});
		noteTakerAddTest.insertCard(addedcard2, 1);

		assert.equal(noteTakerAddTest.indexOfCard(addedcard2), 1, "Cards sorted correctly");
	});

	QUnit.test("Check note taker trigger value set into card", function(assert) {
		var noteTakerAddTest = sap.ui.getCore().getControl("NT_AGGR1");
		noteTakerAddTest.setCardViewAllTrigger(20);

		var eData = {};
		eData.title = "title";
		eData.body = "body";
		eData.timestamp = new Date();

		noteTakerAddTest._handleAddNote(new Event("addEvent", noteTakerAddTest._feeder, eData));

		var oCard = noteTakerAddTest.getCards()[0];

		assert.equal(oCard.getViewAllTrigger(), 20, "Trigger value set into card correctly");
	});

	QUnit.module("Tag processing with binding", {
		beforeEach: function() {
			this.nt = new NoteTaker();

			this.oJsonData = {
				visibleNotes: 2,
				cards: [
					{
						header: "Card title 1",
						body: "Card body 1",
						timestamp: new Date(2012, 1, 21, 15, 25, 30, 0),
						tags: ["PRM", "1on1"],
						isFiltered: false
					},
					{
						header: "Card title 2",
						body: "Card body 2",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0),
						tags: ["PRM", "360"]
					},
					{
						header: "Card title 3",
						body: "EVIL NO TAGS CARD",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0)
					},
					{
						header: "Card title 4",
						body: "the card INITIALLY HIDDEN by filter",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0),
						isFiltered: true
					}
				]
			};

			this.oNtcTemplate = new NoteTakerCard({
				header: "{header}",
				body: "{body}",
				timestamp: "{timestamp}",
				tags: "{tags}",
				isFiltered: "{isFiltered}"
			});
		}
	});

	QUnit.test("Test getAllTags() method", function(assert) {

		assert.deepEqual(this.nt.getAllTags(), [], "no tags for empty taker");

		this.nt.setModel(new JSONModel(this.oJsonData));
		this.nt.bindAggregation("cards", {
			path: "/cards",
			template: this.oNtcTemplate
		});
		assert.deepEqual(this.nt.getAllTags(), "PRM 1on1 360".split(" ").sort(), "bound tags returned from taker's cards");
	});

	QUnit.test("filtering: no binding filter applied", function(assert) {
		this.nt.setModel(new JSONModel(this.oJsonData));
		this.nt.bindAggregation("cards", {
			path: "/cards",
			template: this.oNtcTemplate
		});

		assert.equal(this.nt.getCards().length, 4, "4 cards shown");
	});

	QUnit.test("filtering: binding filter applied", function(assert) {
		this.nt.setModel(new JSONModel(this.oJsonData));
		this.nt.bindAggregation("cards", {
			path: "/cards",
			template: this.oNtcTemplate,
			filters: [new Filter("isFiltered", FilterOperator.EQ, false)]
		});

		//TODO: why default value for isFiltered is not applied?
		//assert.equal(this.nt.getCards().length, 3, "3 (false and unset) cards shown");
		assert.equal(this.nt.getCards().length, 1, "1(explicitly set) card shown");
	});

	QUnit.test("filtering: empty filter shows all cards", function(assert) {
		this.nt.setModel(new JSONModel(this.oJsonData));
		this.nt.bindAggregation("cards", {
			path: "/cards",
			template: this.oNtcTemplate
		});

		this.nt.setFilterCriteria(null);
		assert.equal(this.nt.getCards().length, 4, "all cards shown for NULL filter");
		this.nt.setFilterCriteria({});
		assert.equal(this.nt.getCards().length, 4, "all cards shown for empty filter");
		this.nt.setFilterCriteria({ tags: [] });
		assert.equal(this.nt.getCards().length, 4, "all cards shown if no tags in filter");
	});

	QUnit.test("filtering: 'PRM' filter shows two cards", function(assert) {
		this.nt.setModel(new JSONModel(this.oJsonData));
		this.nt.bindAggregation("cards", {
			path: "/cards",
			template: this.oNtcTemplate
		});

		this.nt.setFilterCriteria({ tags: ["PRM"] });
		assert.equal(this.nt.getCards().length, 2, "only 2 cards shown for PRM tag filter");
	});

	QUnit.module("Tag processing without binding", {
		beforeEach: function() {
			this.nt = new NoteTaker({
				cards: [
					new NoteTakerCard({
						header: "Card title 1",
						body: "Card body 1",
						timestamp: new Date(2012, 1, 21, 15, 25, 30, 0),
						tags: ["PRM", "1on1"],
						isFiltered: false
					}),
					new NoteTakerCard({
						header: "Card title 2",
						body: "Card body 2",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0),
						tags: ["PRM", "360"]
					}),
					new NoteTakerCard({
						header: "Card title 3",
						body: "EVIL NO TAGS CARD",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0)
					}),
					new NoteTakerCard({
						header: "Card title 4",
						body: "the card INITIALLY HIDDEN by filter",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0),
						isFiltered: true
					})
				]
			});
		},
		afterEach: function() {
			this.nt.destroy();
		}
	});

	QUnit.test("filtering: no filter applied", function(assert) {
		assert.equal(this.nt.getCards().length, 4, "4 cards shown");
	});

	QUnit.test("filtering: empty filter shows all cards", function(assert) {
		this.nt.setFilterCriteria(null);
		assert.equal(this.nt.getCards().length, 4, "all cards shown for NULL filter");
		this.nt.setFilterCriteria({});
		assert.equal(this.nt.getCards().length, 4, "all cards shown for empty filter");
		this.nt.setFilterCriteria({ tags: [] });
		assert.equal(this.nt.getCards().length, 4, "all cards shown if no tags in filter");
	});

	QUnit.test("filtering: PRM filter shows two cards", function(assert) {
		this.nt.setFilterCriteria({ tags: ["PRM"] });
		assert.equal(this.nt.getCards().length, 2, "only 2 cards shown for PRM tag filter");
	});

	QUnit.module("Process delete card. No data binding", {
		beforeEach: function() {
			var noteTakerAddTest = new NoteTaker({
				id: "NT1_DELETE_NO_BINDING"
			});

			var addedcard1 = new NoteTakerCard({
				header: "Added card title 1",
				body: "Added card body 1",
				timestamp: new Date(2012, 11, 15),
				tags: ["PRM", "1on1"]
			});
			noteTakerAddTest.addCard(addedcard1);
		},
		afterEach: function() {
			sap.ui.getCore().getControl("NT1_DELETE_NO_BINDING").destroy();
		}
	});
	QUnit.test("Delete card", function(assert) {
		var isCalled = false;
		var taker = sap.ui.getCore().getControl("NT1_DELETE_NO_BINDING");
		taker.attachDeleteCard(function(oEvent) {
			isCalled = true;

			var title = oEvent.getParameter("title");
			assert.equal(title, "Added card title 1", "Title of deleted card is correct");

			var body = oEvent.getParameter("body");
			assert.equal(body, "Added card body 1", "Body of deleted card is correct");
		});

		assert.deepEqual(taker.getAllTags(), "PRM 1on1".split(" ").sort(), "bound tags returned from taker's cards are correct");

		var card0 = taker.getCards()[0];
		card0._handleDeleteClick();
		assert.equal(taker.getCards().length, 0);
		assert.ok(isCalled, "delete card event was called");
		assert.deepEqual(taker.getAllTags(), [], "updated bound tags returned from taker's cards are correct");
	});

	QUnit.module("Process delete card. With Data binding", {
		beforeEach: function() {
			var noteTaker = new NoteTaker({ id: "NT1_DELETE_BINDING" });

			var oJsonData = {
				visibleNotes: 2,
				cards: [
					{
						id: "card1",
						header: "Card title 1",
						body: "Card body 1",
						timestamp: new Date(2012, 1, 21, 15, 25, 30, 0),
						tags: ["PRM", "1on1"]
					},
					{
						id: "card2",
						header: "Card title 2",
						body: "Card body 2",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0),
						tags: ["PRM", "360"]
					},
					{
						id: "card3",
						header: "Card title 3",
						body: "Card body 3",
						timestamp: new Date(2010, 1, 22, 15, 25, 30, 0),
						tags: ["CATS"]
					}
				]
			};
			noteTaker.setModel(new JSONModel(oJsonData));

			var oNoteTakerCardTemplate = new NoteTakerCard({
				uid: "{id}",
				header: "{header}",
				body: "{body}",
				timestamp: "{timestamp}",
				tags: "{tags}"
			});

			noteTaker.bindAggregation("cards", {
				path: "/cards",
				template: oNoteTakerCardTemplate
			});

		},
		afterEach: function() {
			sap.ui.getCore().getControl("NT1_DELETE_BINDING").destroy();
		}
	});

	QUnit.test("Delete card. With databinding", function(assert) {
		var isCalled = false;
		var taker = sap.ui.getCore().getControl("NT1_DELETE_BINDING");
		taker.attachDeleteCard(function(oEvent) {
			isCalled = true;
			//            var title =  oEvent.getParameter("title");
			//            var timestamp = oEvent.getParameter("timestamp");
			var uid = oEvent.getParameter("uid");
			assert.equal(uid, "card1", "id of deleted element is correct");
			var cardsJson = this.getModel().getData().cards;

			// this code is written for IE8 browser :)
			var pos = 0;
			var card2deletePos = 0;
			for (var entry in cardsJson) {
				if (cardsJson[entry].uid == uid) {
					card2deletePos = pos;
				}
				pos++;
			}

			cardsJson.splice(card2deletePos, 1);
			this.getModel().checkUpdate();

		});
		var card0 = taker.getCards()[0];
		card0._handleDeleteClick();
		assert.ok(isCalled, "delete card event was called");
		assert.equal(taker.getCards().length, 2);

		assert.deepEqual(taker.getAllTags(), "PRM 360 CATS".split(" ").sort(), "updated bound tags returned from taker's cards");
	});

	QUnit.module("Thumbs processing");

	QUnit.test("Thumbs filtering without binding.", function(assert) {
		var oNoteTaker = new NoteTaker({
			id: "NT_THUMBS",
			cards: [
				new NoteTakerCard({
					body: "Card body 1",
					tags: ["PRM", "1on1"],
					thumbUp: true,
					thumbDown: false
				}),
				new NoteTakerCard({
					body: "Card body 2",
					tags: ["PRM", "360"],
					thumbUp: false,
					thumbDown: true
				}),
				new NoteTakerCard({
					body: "EVIL NO TAGS CARD",
					thumbUp: true,
					thumbDown: false
				}),
				new NoteTakerCard({
					body: "Card body 3",
					thumbUp: false,
					thumbDown: false
				}),
				new NoteTakerCard({
					body: "no thumbs defined",
					isFiltered: true
				})
			]
		});

		oNoteTaker.setFilterCriteria({ thumbUp: true });
		assert.equal(oNoteTaker.getCards().length, 2, "thumb up filter shows two cards");

		oNoteTaker.setFilterCriteria({ thumbDown: true });
		assert.equal(oNoteTaker.getCards().length, 1, "thumb down filter shows one card");

		oNoteTaker.setFilterCriteria({ thumbUp: true, thumbDown: true });
		assert.equal(oNoteTaker.getCards().length, 3, "thumbs up and down filter shows three cards");

		oNoteTaker.setFilterCriteria({ thumbUp: false, thumbDown: false });
		assert.equal(oNoteTaker.getCards().length, 5, "negative filter shows all five cards");

		oNoteTaker.setFilterCriteria({ tags: ["PRM"], thumbUp: true, thumbDown: false });
		assert.equal(oNoteTaker.getCards().length, 1, "combined filter with tag and thumb up shows one card");
	});

	QUnit.test("Thumbs filtering with binding.", function(assert) {
		var oNoteTaker = new NoteTaker();

		var oJsonData = {
			visibleNotes: 2,
			cards: [
				{
					body: "Card body 1",
					tags: ["PRM", "1on1"],
					thumbUp: true,
					thumbDown: false,
					isFiltered: false
				},
				{
					body: "Card body 2",
					tags: ["PRM", "360"],
					thumbUp: false,
					thumbDown: true
				},
				{
					body: "EVIL NO TAGS CARD",
					thumbUp: true,
					thumbDown: false
				},
				{
					body: "Card body 3",
					thumbUp: false,
					thumbDown: false
				},
				{
					body: "no thumbs defined",
					isFiltered: true
				}
			]
		};

		var oNtcTemplate = new NoteTakerCard({
			header: "{header}",
			body: "{body}",
			timestamp: "{timestamp}",
			tags: "{tags}",
			thumbUp: "{thumbUp}",
			thumbDown: "{thumbDown}",
			isFiltered: "{isFiltered}"
		});

		oNoteTaker.setModel(new JSONModel(oJsonData));
		oNoteTaker.bindAggregation("cards", {
			path: "/cards",
			template: oNtcTemplate
		});

		oNoteTaker.setFilterCriteria({ thumbUp: true });
		assert.equal(oNoteTaker.getCards().length, 2, "thumb up filter shows two cards");

		oNoteTaker.setFilterCriteria({ thumbDown: true });
		assert.equal(oNoteTaker.getCards().length, 1, "thumb down filter shows one card");

		oNoteTaker.setFilterCriteria({ thumbUp: true, thumbDown: true });
		assert.equal(oNoteTaker.getCards().length, 3, "thumbs up and down filter shows three cards");

		oNoteTaker.setFilterCriteria({ thumbUp: false, thumbDown: false });
		assert.equal(oNoteTaker.getCards().length, 5, "negative filter shows all five cards");

		oNoteTaker.setFilterCriteria({ tags: ["PRM"], thumbUp: true, thumbDown: false });
		assert.equal(oNoteTaker.getCards().length, 1, "combined filter with tag and thumb up shows one card");

	});

	QUnit.module("Filtering buttons rendering", {
		beforeEach: function() {
		},
		afterEach: function() {
			var oNoteTaker = sap.ui.getCore().byId("NT1");
			oNoteTaker.setFilterCriteria(null);
		}
	});

	QUnit.test("Tag button rendering.", function(assert) {
		var oNoteTaker = sap.ui.getCore().byId("NT1");

		oNoteTaker.setFilterCriteria({ tags: ["PRM"] });
		oNoteTaker.rerender();

		assert.ok(oNoteTaker._oFilterTagButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Tag button changes style when filtering criteria has tags");

		oNoteTaker.setFilterCriteria({});
		oNoteTaker.rerender();
		assert.ok(!oNoteTaker._oFilterTagButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Tag button has initial style when filtering criteria is empty");
	});

	QUnit.test("Thumb Up button rendering.", function(assert) {
		var oNoteTaker = sap.ui.getCore().byId("NT1");

		oNoteTaker.setFilterCriteria({ thumbUp: true });
		oNoteTaker.rerender();

		assert.ok(oNoteTaker._oFilterThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterThumbUpButton"), "Color icon set on pressed Thumb Up button");
		assert.ok(oNoteTaker._oFilterThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Button color changes when filtering criteria applied");

		oNoteTaker.setFilterCriteria({ thumbUp: false });
		oNoteTaker.rerender();

		assert.ok(oNoteTaker._oFilterThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterThumbUpButton"), "Color icon set when filtering criteria cleared");
		assert.ok(!oNoteTaker._oFilterThumbUpButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Button has initial style when filtering criteria cleared");
	});

	QUnit.test("Thumb Down button rendering.", function(assert) {
		var oNoteTaker = sap.ui.getCore().byId("NT1");

		oNoteTaker.setFilterCriteria({ thumbDown: true });
		oNoteTaker.rerender();

		assert.ok(oNoteTaker._oFilterThumbDownButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterThumbDownButton"), "Color icon set on pressed Thumb Down button");
		assert.ok(oNoteTaker._oFilterThumbDownButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Button color changes when filtering criteria applied");

		oNoteTaker.setFilterCriteria({ thumbDown: false });
		oNoteTaker.rerender();

		assert.ok(oNoteTaker._oFilterThumbDownButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterThumbDownButton"), "Color icon set when filtering criteria cleared");
		assert.ok(!oNoteTaker._oFilterThumbDownButton.hasStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected"), "Button has initial style when filtering criteria cleared");
	});

	QUnit.module("Search");

	QUnit.test("Search without binding.", function(assert) {
		var oNoteTaker = new NoteTaker({
			id: "NT_SEARCH",
			cards: [
				new NoteTakerCard({
					header: "first card title",
					body: "Lorem ipsum dolor",
					tags: ["PRM", "1on1"],
					thumbUp: true,
					thumbDown: false
				}),
				new NoteTakerCard({
					header: "second card title",
					body: "dolor sit Amet",
					tags: ["PRM", "360"],
					thumbUp: false,
					thumbDown: true
				}),
				new NoteTakerCard({
					body: "no header card",
					thumbUp: true,
					thumbDown: false
				}),
				new NoteTakerCard({
					header: "lorem ipsum",
					body: "no tags defined",
					thumbUp: false,
					thumbDown: false
				}),
				new NoteTakerCard({
					body: "no thumbs defined",
					isFiltered: true
				})
			]
		});

		oNoteTaker.setFilterCriteria({ search: ["lorem", "amet"] });
		assert.equal(oNoteTaker.getCards().length, 3, "search by text ignores case and shows three cards");

		oNoteTaker.setFilterCriteria({ search: ["lorem", "amet"], tags: ["PRM"] });
		assert.equal(oNoteTaker.getCards().length, 2, "search by text and filter by tags shows two cards");

		oNoteTaker.setFilterCriteria({ search: ["lorem", "amet"], tags: ["PRM"], thumbUp: true });
		assert.equal(oNoteTaker.getCards().length, 1, "search by text and filter by tags and thumb up shows one card");

		oNoteTaker._handleResetFilters();
		assert.equal(oNoteTaker.getCards().length, 3, "resetting filters doesn't clear search so three cards are shown");

		oNoteTaker.setFilterCriteria({ search: [] });
		assert.equal(oNoteTaker.getCards().length, 5, "empty search shows all five cards");
	});

	QUnit.test("Search with binding.", function(assert) {
		var oNoteTaker = new NoteTaker();

		var oJsonData = {
			visibleNotes: 2,
			cards: [
				{
					header: "first card title",
					body: "Lorem ipsum dolor",
					tags: ["PRM", "1on1"],
					thumbUp: true,
					thumbDown: false
				},
				{
					header: "second card title",
					body: "dolor sit Amet",
					tags: ["PRM", "360"],
					thumbUp: false,
					thumbDown: true
				},
				{
					body: "no header card",
					thumbUp: true,
					thumbDown: false
				},
				{
					header: "lorem ipsum",
					body: "no tags defined",
					thumbUp: false,
					thumbDown: false
				},
				{
					body: "no thumbs defined",
					isFiltered: true
				}
			]
		};

		var oNtcTemplate = new NoteTakerCard({
			header: "{header}",
			body: "{body}",
			timestamp: "{timestamp}",
			tags: "{tags}",
			thumbUp: "{thumbUp}",
			thumbDown: "{thumbDown}",
			isFiltered: "{isFiltered}"
		});

		oNoteTaker.setModel(new JSONModel(oJsonData));
		oNoteTaker.bindAggregation("cards", {
			path: "/cards",
			template: oNtcTemplate
		});

		oNoteTaker.setFilterCriteria({ search: ["lorem", "amet"] });
		assert.equal(oNoteTaker.getCards().length, 3, "search by text ignores case and shows three cards");

		oNoteTaker.setFilterCriteria({ search: ["lorem", "amet"], tags: ["PRM"] });
		assert.equal(oNoteTaker.getCards().length, 2, "search by text and filter by tags shows two cards");

		oNoteTaker.setFilterCriteria({ search: ["lorem", "amet"], tags: ["PRM"], thumbUp: true });
		assert.equal(oNoteTaker.getCards().length, 1, "search by text and filter by tags and thumb up shows one card");

		oNoteTaker.setFilterCriteria({ search: [] });
		assert.equal(oNoteTaker.getCards().length, 5, "empty search shows all five cards");
	});

	QUnit.module("Test attachment upload");

	QUnit.test("Attachment select event", function(assert) {
		var noteTaker = new NoteTaker({
			attachmentSelect: function(oEvent) {
				assert.equal(oEvent.getParameter("filename"), "test.txt", "selected file goes into outside event");
			}
		});
		noteTaker._feeder._oFileUploader.fireChange({ newValue: "test.txt" });
	});

	QUnit.test("Attachment upload complete event", function(assert) {
		var noteTaker = new NoteTaker({
			attachmentUploadComplete: function(oEvent) {
				assert.equal(oEvent.getParameter("response"), "OK 200", "upload completed response goes into outside event");
			}
		});
		noteTaker._feeder._oFileUploader.fireUploadComplete({ response: "OK 200" });
	});
});