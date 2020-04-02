sap.ui.define("sap.suite.ui.commons.qunit.util.HtmlElement", [
	"sap/suite/ui/commons/util/HtmlElement",
	"sap/m/Title",
	"sap/ui/core/CustomData",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (HtmlElement, Title, CustomData) {

	QUnit.module("HtmlElementTest");

	QUnit.test("Accepts valid ID", function (assert) {
		var element = new HtmlElement("div");
		var id = "myId";
		element.setId(id);
		assert.equal(element._mAttributes.id, id, "Id wasn't set.");
		assert.equal(typeof element._mAttributes["data-sap-ui"], "undefined", "data-sap-ui shouldn't be set.");
	});

	QUnit.test("ID with data-sap-ui", function (assert) {
		var element = new HtmlElement("div");
		var id = "myId";
		element.setId(id, true);
		assert.equal(element._mAttributes.id, id, "Id wasn't set.");
		assert.equal(element._mAttributes["data-sap-ui"], id, "data-sap-ui wasn't set.");
	});

	QUnit.test("String keys allowed for attributes", function (assert) {
		var element = new HtmlElement("div");
		var key = "key";
		var value = "value";
		element.setAttribute(key, value);
		assert.ok(typeof element._mAttributes[key] !== "undefined", "String key should be set as attribute.");
	});

	QUnit.test("Simple values allowed as values for an attribute", function (assert) {
		var element = new HtmlElement("div");
		var key = "key";
		element.setAttribute(key, "string");
		assert.equal(element._mAttributes[key], "string", "String attribute wasn't set correctly.");
		element = new HtmlElement("div");
		element.setAttribute(key, 10);
		assert.equal(element._mAttributes[key], "10", "Number attribute wasn't set correctly.");
		element = new HtmlElement("div");
		element.setAttribute(key, true);
		assert.equal(element._mAttributes[key], "true", "Boolean attribute wasn't set correctly.");
	});

	QUnit.test("Attribute value escaping.", function (assert) {
		var element = new HtmlElement("div");
		var escaped = "&quot;&gt;&lt;something&gt;";
		var plain = "\"><something>";
		element.setAttribute("plainToEscaped", plain, true);
		assert.equal(element._mAttributes.plainToEscaped, escaped, "Attribute escaping failed.");
		element.setAttribute("plainUnescaped", plain, false);
		assert.equal(element._mAttributes.plainUnescaped, plain, "Plain attribute broken.");
	});

	QUnit.test("Correct values accepted as classes.", function (assert) {
		var element = new HtmlElement("div");
		var classes = ["my-class-1", "my-class-2"];
		classes.forEach(function (cl) {
			element.addClass(cl);
		});
		assert.deepEqual(element._mAttributes.class, classes, "Classes set incorrectly.");
	});

	QUnit.test("String names accepted for styles.", function (assert) {
		var element = new HtmlElement("div");
		element.addStyle("name", "value");
		assert.notEqual(typeof element._mAttributes.style, "undefined", "Style should be set.");
	});

	QUnit.test("Only strings and numbers allowed as styles.", function (assert) {
		var element = new HtmlElement("div");
		var name = "color";
		var styles = ["color:red", "color:10"];
		element.addStyle(name, "red");
		element.addStyle(name, 10);
		assert.deepEqual(element._mAttributes.style, styles, "Styles set incorrectly.");
	});

	QUnit.test("Only valid children are accepted.", function (assert) {
		var elementChild = new Title("title");
		try {
			var element = new HtmlElement("div");
			var stringChild = "<h1>Something</h1>";
			var htmlChild = new HtmlElement("br");
			element.addChild(stringChild);
			element.addChild(htmlChild);
			element.addChild(elementChild);
			assert.equal(element._aChildren[0], stringChild, "String child wasn't set.");
			assert.ok(element._aChildren[1] === htmlChild, "HTML child wasn't set.");
			assert.ok(element._aChildren[2] === elementChild, "Element child wasn't set.");
		} finally {
			elementChild.destroy();
		}
	});

	QUnit.test("HtmlElement returns a valid renderer.", function (assert) {
		var element = new HtmlElement("div");
		var renderer = element.getRenderer();
		assert.equal(typeof renderer, "object", "Renderer should be an object.");
		assert.notEqual(renderer, null, "Renderer shouldn't be null.");
		assert.equal(typeof renderer.render, "function", "Renderer must have a render function.");
	});

	QUnit.test("addControlData test.", function (assert) {
		var title = new Title("titleId");
		try {
			title.addStyleClass("customClass");
			title.addCustomData(new CustomData({key: "key", value: "value", writeToDom: true}));
			var element = new HtmlElement("div");
			element.addControlData(title);
			assert.equal(element._mAttributes.id, "titleId", "Id not set.");
			assert.equal(element._mAttributes["data-sap-ui"], "titleId", "Id not set.");
			assert.equal(element._mAttributes["data-key"], "value", "Custom data not set.");
			assert.deepEqual(element._mAttributes.class, ["customClass"], "Custom style classes not set.");
		} finally {
			title.destroy();
		}
	});

	QUnit.test("Multiple custom style classes.", function (assert) {
		var title = new Title("titleId");
		try {
			title.addStyleClass("customClass1");
			title.addStyleClass("customClass2");
			var element = new HtmlElement("div");
			element.addControlData(title);
			assert.deepEqual(element._mAttributes.class, ["customClass1", "customClass2"], "Custom style classes not set.");
		} finally {
			title.destroy();
		}
	});

});
