/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/BusinessCard",
	"sap/ui/commons/Link"
], function(QUnitUtils, createAndAppendDiv, BusinessCard, Link) {
	"use strict";
	createAndAppendDiv("uiArea1");


	var sBusinessCard = "BCard1";
	var bCard1 = new BusinessCard({
		id: sBusinessCard,
		firstTitle: new Link({id:"badge1-name-link",text:"White, Helen",tooltip:"White, Helen", href: "http://www.sap.com"}),
		iconPath: "demokit/images/people/female_IngallsB.jpg",
		secondTitle: "Sales Contact at Customer Side",
		imageTooltip: "White, Helen",
		width: "281px"
	});


	bCard1.placeAt("uiArea1");

	QUnit.test("Card is rendered", function(assert) {
		assert.notEqual(sBusinessCard ? window.document.getElementById(sBusinessCard) : null, null, "BusinessCard outer HTML Element is rendered.");
	});

	QUnit.test("First title is rendered", function(assert) {
		var sTitle = "White, Helen";
		assert.equal(bCard1.getFirstTitle().getText(), sTitle, "The title was successfully retrieved");
	});

	QUnit.test("Second title is rendered", function(assert) {
		var sTitle = "Sales Contact at Customer Side";
		assert.equal(bCard1.getSecondTitle(), sTitle, "The second title was successfully retrieved");
	});
});