/*globals QUnit*/
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Tokenizer",
	"sap/ui/layout/Grid",
	"sap/ui/comp/valuehelpdialog/ItemsCollection",
	"sap/ui/comp/smartfilterbar/ControlConfiguration",
	"sap/ui/comp/smartfilterbar/FilterProvider",
	"sap/ui/comp/smartfilterbar/DisplayBehaviour"
], function (Control, Tokenizer, Grid, ItemsCollection, ControlConfiguration, FilterProvider, DisplayBehaviour) {
	"use strict";
	QUnit.module("sap.ui.comp.valuehelpdialog.ItemsCollection", {
		beforeEach: function () {
		},
		afterEach: function () {
		}
	});

	QUnit.test("Shall be instantiable", function (qUnit) {
		var itemsCollection = new ItemsCollection();
		qUnit.ok(itemsCollection);
	});

	QUnit.test("Test add", function (qUnit) {
		var itemsCollection = new ItemsCollection();
		itemsCollection.add("1", {});
		itemsCollection.add("2", {});
		qUnit.equal(itemsCollection.getItems().length, 2, "length should be 2");
	});

	QUnit.test("Test remove", function (qUnit) {
		var itemsCollection = new ItemsCollection();
		itemsCollection.add("1", {});
		itemsCollection.add("2", {});
		itemsCollection.remove("1");
		qUnit.equal(itemsCollection.getItems().length, 1, "length should be 1");
	});

	QUnit.test("Test removeAll", function (qUnit) {
		var itemsCollection = new ItemsCollection();
		itemsCollection.add("1", {});
		itemsCollection.add("2", {});
		itemsCollection.removeAll();
		qUnit.equal(itemsCollection.getItems().length, 0, "length should be 0");
	});

	QUnit.test("Test getItem", function (qUnit) {
		var o1 = {};
		var o2 = {};
		var itemsCollection = new ItemsCollection();
		itemsCollection.add("1", o1);
		itemsCollection.add("2", o2);
		var o = itemsCollection.getItem("1");
		qUnit.equal(o, o1, "returned item should be o1");
	});

	QUnit.test("Test getSelectedItemsTokenArray", function (qUnit) {
		var o1 = { id: "1", name: "item1" };
		var o2 = { id: "2", name: "item2" };
		var o3 = { id: "3", name: "item3" };
		var o4 = "4";
		var itemsCollection = new ItemsCollection();
		itemsCollection.add("1", o1);
		itemsCollection.add("2", o2);
		itemsCollection.add("3", o3);
		itemsCollection.add("4", o4);
		var aTokens = itemsCollection.getSelectedItemsTokenArray("id", "name");
		qUnit.equal(aTokens.length, 4, "returned Tokens array should have length 4");

		aTokens = itemsCollection.getSelectedItemsTokenArray("id", "name", DisplayBehaviour.descriptionOnly);
		qUnit.equal(aTokens.length, 4, "returned Tokens array should have length 4");
	});

	QUnit.test("Test getModelData", function (qUnit) {
		var o1 = { id: "1", name: "item1" };
		var o2 = { id: "2", name: "item2" };
		var o3 = "3";
		var itemsCollection = new ItemsCollection();
		itemsCollection.add("1", o1);
		itemsCollection.add("2", o2);
		itemsCollection.add("3", o3);
		var aItems = itemsCollection.getModelData();
		qUnit.equal(aItems.length, 3, "returned Items array should have length 3");
	});

	QUnit.test("getSelectedItemsTokenArray does not throw exception if '{' is part of the key", function (assert) {
		var o1 = { id: "id{not{escaped", name: "item{not{escaped" };
		var oItemsCollection = new ItemsCollection();
		oItemsCollection.add("collection{item{key", o1);

		oItemsCollection.getSelectedItemsTokenArray("id" ,"name");

		assert.ok(true, "no exception is thrown");
	});

	QUnit.start();

});
