/*global QUnit */
sap.ui.define([
	'sap/ui/base/DataType'
], function (DataType) {
	"use strict";

	QUnit.test("type registeration", function (assert) {
		var type = "sap.gantt.GenericArray";
		var typeObject = DataType.getType(type);
		assert.ok(typeObject, "Customized type '" + type + "' exists");
		assert.strictEqual(typeObject.getName(), type, "type should have the correct name");

	});

	QUnit.test("test for sap.gantt.GenericArray -- isValid", function (assert) {
		var _genericArray = DataType.getType("sap.gantt.GenericArray");
		assert.ok(!!_genericArray, "type 'sap.gantt.GenericArray' exists");

		assert.equal(_genericArray.isValid("order"), true, "accepted value 1");
		assert.equal(_genericArray.isValid("[order,activity]"), true, "accepted value 2");
		assert.equal(_genericArray.isValid('[{"name":"activity"}]'), true, "accepted value 3");
		assert.equal(_genericArray.isValid('[{"name":"order", "idName":"OrderNo"},{"name":"activity"}]'), true, "accepted value 4");

		assert.equal(_genericArray.isValid(["order", "activity"]), true, "accepted value 5");
		assert.equal(_genericArray.isValid([{ name: "order", idName: "OrderNo" }, { name: "activity" }]), true, "accepted value 6");
		assert.equal(_genericArray.isValid([{ name: "order", idName: "OrderNo" }, "activity"]), true, "accepted value 7");
		assert.equal(_genericArray.isValid([]), true, "accepted value 8");

		assert.equal(_genericArray.isValid([10]), false, "not accepted value 1");
		assert.equal(_genericArray.isValid([true, "order", "activity"]), false, "not accepted value 2");
	});

	QUnit.test("test for sap.gantt.GenericArray -- parseValue", function (assert) {
		var _genericArray = DataType.getType("sap.gantt.GenericArray");
		assert.ok(!!_genericArray, "type 'sap.gantt.GenericArray' exists");

		assert.deepEqual(_genericArray.parseValue("order"), ["order"], "'order' should be parsed as" + JSON.stringify(["order"]));
		assert.deepEqual(_genericArray.parseValue("order,activity"), ["order", "activity"], "'order','activity' should be parsed as" + JSON.stringify(["order", "activity"]));
		assert.deepEqual(_genericArray.parseValue("order, activity"), ["order", "activity"], "blank space in the string can be handled correctly");
		assert.deepEqual(_genericArray.parseValue("[order,activity]"), ["order", "activity"], "[order,activity] should be parsed as" + JSON.stringify(["order", "activity"]));
		assert.deepEqual(_genericArray.parseValue("[order, activity]"), ["order", "activity"], "blank space in the string can be handled correctly");
		assert.deepEqual(_genericArray.parseValue('[{"name":"activity"}]'), [{ name: "activity" }], '[{"name":"activity"}]' + "should be parsed as" + JSON.stringify([{ name: "activity" }]));
		assert.deepEqual(_genericArray.parseValue('[{"name":"order", "idName":"OrderNo"},{"name":"activity"}]'), [{ name: "order", idName: "OrderNo" }, { name: "activity" }], '[{"name":"order", "idName":"OrderNo"},{"name":"activity"}]' + "should be parsed as" + JSON.stringify([{ name: "order", idName: "OrderNo" }, { name: "activity" }]));
		assert.deepEqual(_genericArray.parseValue("[{'name':'order', 'idName':'OrderNo'},{'name':'activity'}]"), [{ name: "order", idName: "OrderNo" }, { name: "activity" }], "[{'name':'order', 'idName':'OrderNo'},{'name':'activity'}] should be parsed as" + JSON.stringify([{ name: "order", idName: "OrderNo" }, { name: "activity" }]));
		assert.deepEqual(_genericArray.parseValue(["order", "activity"]), ["order", "activity"], "parse an array of string correctly");
		assert.deepEqual(_genericArray.parseValue([{ name: "order", idName: "OrderNo" }, { name: "activity" }]), [{ name: "order", idName: "OrderNo" }, { name: "activity" }], "parse an array of object correctly");
		assert.deepEqual(_genericArray.parseValue([{ name: "order", idName: "OrderNo" }, "activity"]), [{ name: "order", idName: "OrderNo" }, "activity"], "parse an array of object and string correctly");

	});
});
