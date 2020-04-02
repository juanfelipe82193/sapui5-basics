/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/FacetOverview",
	"sap/m/Label",
	"sap/ui/util/Mobile",
	"sap/ui/thirdparty/jquery"
], function(QUnitUtils, createAndAppendDiv, FacetOverview, Label, Mobile, jQuery) {
	"use strict";
	createAndAppendDiv("uiArea1");
	createAndAppendDiv("uiArea2");

	Mobile.init();

	var oFacetOverview = new FacetOverview("facet-overview", {
		width: "50%",
		height: "50%",
		title: "Testing Title",
		quantity: 5,
		content: new Label("facet-overview-label-content", {
			text: "Label content"
		}),
		press: function () {

		}
	});

	var oFacetOverviewNoPress = new FacetOverview("facet-overview-nopress", {
		width: "50%",
		height: "50%",
		title: "Testing Title",
		quantity: 5,
		content: new Label("facet-overview-nopress-label-content", {
			text: "Label content"
		})
	});

	oFacetOverview.placeAt("uiArea1","only");

	oFacetOverviewNoPress.placeAt("uiArea2", "only");

	QUnit.module("Rendering test - sap.suite.ui.commons.FacetOverview");

	QUnit.test("FacetOverview width set up.", function(assert) {
		assert.equal(window.document.getElementById("facet-overview").style.width, "50%", "Width was set successfully");
	});

	QUnit.test("FacetOverview height set up.", function(assert) {
		assert.equal(window.document.getElementById("facet-overview").style.height, "50%", "Height was set successfully");
	});

	QUnit.test("FacetOverview title set up.", function(assert) {
		assert.equal(jQuery(document.getElementById("facet-overview-title-text"))[0].innerHTML, "Testing Title", "Title was set successfully");
	});

	QUnit.test("FacetOverview quantity set up.", function(assert) {
		assert.equal(jQuery(document.getElementById("facet-overview-qty"))[0].innerHTML, "(5)", "Quantity was set successfully");
	});

	QUnit.test("Content check", function(assert) {
		assert.equal(oFacetOverview.getContent().getText(), "Label content", "Checking placed content.");
	});

	QUnit.module("Events test - sap.suite.ui.commons.FacetOverview");

	QUnit.test("saptouch event", function(assert) {
		assert.ok(jQuery(document.getElementById("facet-overview")).trigger(jQuery.Event("saptouchstart")).hasClass("sapSuiteFovSelected"), "Event saptouchstart should add sapSuiteFovSelected class");
		assert.ok(!jQuery(document.getElementById("facet-overview")).trigger(jQuery.Event("saptouchend")).hasClass("sapSuiteFovSelected"), "Event saptouchend should remove sapSuiteFovSelected class");
	});

	QUnit.test("saptouch event with no press event attached", function(assert) {
		assert.ok(!jQuery(document.getElementById("facet-overview-nopress")).trigger(jQuery.Event("saptouchstart")).hasClass("sapSuiteFovSelected"), "Event saptouchstart should not add sapSuiteFovSelected class when press event is not attached.");
	});

});