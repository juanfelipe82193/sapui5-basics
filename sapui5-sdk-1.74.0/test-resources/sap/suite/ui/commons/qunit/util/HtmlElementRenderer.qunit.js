sap.ui.define("sap.suite.ui.commons.qunit.util.HtmlElementRenderer", [
	"sap/suite/ui/commons/util/HtmlElement",
	"sap/m/Title",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (HtmlElement, Title) {
	var FakeRM = function() {
		this._buffer = "";
	};
	FakeRM.prototype.write = function() {
		this._buffer += jQuery.makeArray(arguments).join("");
	};
	FakeRM.prototype.writeEscaped = function(html) {
		this._buffer += jQuery.sap.escapeHTML(html);
	};
	FakeRM.prototype.renderControl = function(oControl) {
		this._buffer += "<COMPONENT>" + oControl.getId() + "</COMPONENT>";
	};
	FakeRM.prototype.getResult = function() {
		return this._buffer;
	};
	QUnit.module("HtmlElementRendererTest");

	QUnit.test("Simple element test.", function (assert) {
		var element = new HtmlElement("div");
		var oRM = new FakeRM();
		var expected = "<div/>";
		element.getRenderer().render(oRM);
		assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
	});

	QUnit.test("Element with text.", function (assert) {
		var element = new HtmlElement("div");
		element.addChild("something");
		var oRM = new FakeRM();
		var expected = "<div>something</div>";
		element.getRenderer().render(oRM);
		assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
	});

	QUnit.test("Element with attribute.", function (assert) {
		var element = new HtmlElement("div");
		element.setAttribute("custom-data", "custom");
		var oRM = new FakeRM();
		var expected = "<div custom-data=\"custom\"/>";
		element.getRenderer().render(oRM);
		assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
	});

	QUnit.test("Element with multiple attributes.", function (assert) {
		var element = new HtmlElement("div");
		element.setAttribute("custom-data", 1);
		element.setAttribute("custom-data2", true);
		element.setAttribute("style", "color:red");
		element.setAttribute("class", "sap-cl1 sap-cl2");
		var oRM = new FakeRM();
		var expected = "<div custom-data=\"1\" custom-data2=\"true\" style=\"color:red\" class=\"sap-cl1 sap-cl2\"/>";
		element.getRenderer().render(oRM);
		assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
	});

	QUnit.test("Element with classes.", function (assert) {
		var element = new HtmlElement("div");
		element.addClass("sap-cl1");
		element.addClass("sap-cl2");
		var oRM = new FakeRM();
		var expected = "<div class=\"sap-cl1 sap-cl2\"/>";
		element.getRenderer().render(oRM);
		assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
	});

	QUnit.test("Element with styles.", function (assert) {
		var element = new HtmlElement("div");
		element.addStyle("color", "red");
		element.addStyle("padding", "1px");
		var oRM = new FakeRM();
		var expected = "<div style=\"color:red;padding:1px\"/>";
		element.getRenderer().render(oRM);
		assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
	});

	QUnit.test("Element with inner element.", function (assert) {
		var element = new HtmlElement("div");
		var inner = new HtmlElement("a");
		inner.setAttribute("href", "http://www.sap.com");
		inner.addChild("Link");
		element.addChild(inner);
		var oRM = new FakeRM();
		var expected = "<div><a href=\"http://www.sap.com\">Link</a></div>";
		element.getRenderer().render(oRM);
		assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
	});

	QUnit.test("Element with inner component.", function (assert) {
		var title = new Title("customId");
		try {
			var element = new HtmlElement("div");
			element.addChild(title);
			var oRM = new FakeRM();
			var expected = "<div><COMPONENT>customId</COMPONENT></div>";
			element.getRenderer().render(oRM);
			assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
		} finally {
			title.destroy();
		}
	});

	QUnit.test("Element with mix children.", function (assert) {
		var title = new Title("customId");
		try {
			var element = new HtmlElement("div");
			element.addChild("string");
			element.addChild(new HtmlElement("div"));
			element.addChild(title);
			var oRM = new FakeRM();
			var expected = "<div>string<div/><COMPONENT>customId</COMPONENT></div>";
			element.getRenderer().render(oRM);
			assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
		} finally {
			title.destroy();
		}
	});

	QUnit.test("Complex test.", function (assert) {
		var title1 = new Title("customId");
		var title2 = new Title("customId2");
		var title3 = new Title("customId3");
		try {
			var element = new HtmlElement("div");
			element.addClass("sap-cl");
			element.addStyle("color", "red");
			element.setAttribute("data", 1);
			element.addChild(title1);
			var inner = new HtmlElement("div");
			inner.addChild(title2);
			var a = new HtmlElement("a");
			a.setAttribute("href", "www.sap.com");
			a.addChild("SAP");
			inner.addChild(a);
			element.addChild(inner);
			element.addChild(title3);
			var expected = "<div class=\"sap-cl\" style=\"color:red\" data=\"1\">" +
				"<COMPONENT>customId</COMPONENT>" +
				"<div>" +
				"<COMPONENT>customId2</COMPONENT>" +
				"<a href=\"www.sap.com\">SAP</a>" +
				"</div>" +
				"<COMPONENT>customId3</COMPONENT>" +
				"</div>";
			var oRM = new FakeRM();
			element.getRenderer().render(oRM);
			assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
		} finally {
			title1.destroy();
			title2.destroy();
			title3.destroy();
		}
	});

	QUnit.test("Render title.", function (assert) {
		var title = new Title("id");
		try {
			title.setText("My title");
			var element = new HtmlElement("h1");
			element.addControlData(title);
			element.addChild(title.getText());
			var expected = "<h1 id=\"id\" data-sap-ui=\"id\">My title</h1>";
			var oRM = new FakeRM();
			element.getRenderer().render(oRM);
			assert.equal(oRM.getResult(), expected, "Rendered component is incorrect.");
		} finally {
			title.destroy();
		}
	});
});
