sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/commons/util/RenderUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, RenderUtils, createAndAppendDiv) {

	QUnit.module("RenderingHelper", {
		beforeEach: function () {
			this.rm = sap.ui.getCore().createRenderManager();
			this.rh = new RenderUtils(this.rm);
			this.sBrowser = jQuery("html").attr("data-sap-ui-browser");
			createAndAppendDiv("content");
			this.domNode = window.document.getElementById("content");
		},
		afterEach: function () {
			this.rm.destroy();
		}
	});

	QUnit.test("helper created", function (assert) {
		var rh = this.rh;
		assert.ok(rh, "helper exists");
		assert.ok(rh._getRenderManager(), "render manager defined for " + this.sBrowser);
	});

	QUnit.test("rendering works", function (assert) {
		var rm = this.rm;
		var sTestHtml = "<span>text</span>";

		rm.write(sTestHtml);

		rm.flush(this.domNode);
		assert.equal(this.domNode.innerHTML.toLowerCase(), sTestHtml.toLowerCase());
	});

	QUnit.test("empty opening tag", function (assert) {
		this.rh.writeOpeningTag("div");

		this.rm.flush(this.domNode);
		//TODO: find out how to access render manager's aBuffer, to avoid auto-completion
		//equal(this.rm.aBuffer.join(""), "<div>");
		assert.equal(this.domNode.innerHTML.toLowerCase(), "<div></div>".toLowerCase());
	});

	QUnit.test("opening tag with classes", function (assert) {
		this.rh.writeOpeningTag("div", {
			classes: ["bigButton", "leftPanel"]
		});

		this.rm.flush(this.domNode);
		assert.equal(this.domNode.innerHTML.toLowerCase(), '<div class="bigButton leftPanel"></div>'.toLowerCase());
	});

	QUnit.test("opening tag with attributes", function (assert) {
		this.rh.writeOpeningTag("div", {
			attributes: {
				id: "testDiv",
				"data-id": "NTC1",
				"data-title": "Choose to edit"
			}
		});

		this.rm.flush(this.domNode);
		var testDiv = jQuery("#testDiv");
		assert.equal(testDiv.attr("data-id"), 'NTC1');
		assert.equal(testDiv.attr("data-title"), "Choose to edit");
	});

	QUnit.test("opening tag with XSS in not escaped attributes", function (assert) {
		this.rh.writeOpeningTag("div", {
			attributes: {
				id: "testDiv",
				width: "300px",
				idNotEsc: 'NTC1"><script id="malicious">jQuery("#testDiv").attr("width", "200px")<\/script><div id="inner'
			}
		});

		this.rm.flush(this.domNode);
		var testDiv = jQuery("#testDiv");
		assert.equal(testDiv.attr("idNotEsc"), 'NTC1', "attribute is cropped by malicious code");
		assert.equal(testDiv.attr("width"), "200px", "malicious code executed");
		assert.ok(jQuery("#inner").length, "fake tag detected");
	});

	QUnit.test("opening tag with XSS in escaped attributes", function (assert) {
		this.rh.writeOpeningTag("div", {
			attributes: {
				id: "testDiv",
				width: "300px"
			},
			escapedAttributes: {idEsc: 'NTC2"><script id="malicious">$("#testDiv").attr("width", "200px")<\/script><div id="inner'}
		});

		this.rm.flush(this.domNode);
		var testDiv = jQuery("#testDiv");
		assert.equal(testDiv.attr("idEsc"), 'NTC2"><script id="malicious">$("#testDiv").attr("width", "200px")<\/script><div id="inner', "full text in attribute");
		assert.equal(testDiv.attr("width"), "300px", "malicious code not executed");
		assert.equal(jQuery("#inner").length, 0, "fake tag not detected");
	});

	QUnit.test("no closing tag - nested order", function (assert) {
		this.rh.writeOpeningTag("div");
		this.rh.writeOpeningTag("p");

		this.rm.flush(this.domNode);
		assert.equal(this.domNode.innerHTML.toLowerCase().replace(/\s+/g, ""), '<div><p></p></div>'.toLowerCase());
	});

	QUnit.test("closing tag - sequential order", function (assert) {
		this.rh.writeOpeningTag("div");
		this.rh.writeClosingTag("div");
		this.rh.writeOpeningTag("p");
		this.rh.writeClosingTag("p");

		this.rm.flush(this.domNode);
		assert.equal(this.domNode.innerHTML.toLowerCase().replace(/\s+/g, ""), '<div></div><p></p>'.toLowerCase());
	});
});