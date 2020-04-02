sap.ui.define([
	"sap/ui/comp/providers/TokenParser",
	"sap/m/MultiInput",
	"sap/ui/thirdparty/qunit-2"
], function (TokenParser, MultiInput, QUnit) {
	"use strict";

	QUnit.module("Testing Public API", {
		beforeEach: function () {
			this.oTokenParser = new TokenParser();
		},
		afterEach: function () {
			this.oTokenParser.destroy();
			delete this.oTokenParser;
		}
	});

	QUnit.test("Test defaultOperation", function (assert) {
		assert.equal(this.oTokenParser.getDefaultOperation(), undefined, "defaultOperation should be undefined");
		this.oTokenParser.setDefaultOperation("EQ");
		assert.equal(this.oTokenParser.getDefaultOperation(), "EQ", "defaultOperation should be EQ");
	});

	QUnit.test("Test getOperation", function (assert) {
		assert.equal(this.oTokenParser.getOperation("foo"), undefined, "getOperation should return undefined");
		assert.notEqual(this.oTokenParser.getOperation("EQ"), undefined, "getOperation should return object");
	});

	QUnit.test("Test removeOperation", function (assert) {
		this.oTokenParser.removeOperation("EQ");
		assert.equal(this.oTokenParser.getOperation("EQ"), undefined, "getOperation should return undefined");
		this.oTokenParser.removeAllOperations();
		assert.equal(Object.keys(this.oTokenParser.getOperations()).length, 0, "getOperations should return empty list");
	});

	QUnit.test("Test getTranslatedText", function (assert) {
		assert.equal(this.oTokenParser.getTranslatedText("default", this.oTokenParser.getOperation("EQ")), "equal to", "getTranslatedText should return 'equal to'");
		assert.equal(this.oTokenParser.getTranslatedText("default", this.oTokenParser.getOperation("GT")), "greater than", "getTranslatedText should return 'greater than");
		assert.equal(this.oTokenParser.getTranslatedText("date", this.oTokenParser.getOperation("GT")), "after", "getTranslatedText should return 'after'");
	});

	QUnit.test("Test associateInput", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		assert.equal(oInput._tokenizer._aTokenValidators.length, 1, "1 validator must be attached");
	});

	QUnit.test("Test validate all operations for string type", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var fnTokenValidator = oInput._tokenizer._aTokenValidators[0];
		var oToken = fnTokenValidator({ text: "foo" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "key", type: "string", oType: new sap.ui.model.type.String()});

		var aTests = [
			{text: "foo", token: "=foo", exclude: false, keyField: "key", operation: "EQ", value1: "foo"},
			{text: ">=100", token: ">=100", exclude: false, keyField: "key", operation: "GE", value1: "100"},
			{text: ">100", token: ">100", exclude: false, keyField: "key", operation: "GT", value1: "100"},
			{text: "<=100", token: "<=100", exclude: false, keyField: "key", operation: "LE", value1: "100"},
			{text: "<100", token: "<100", exclude: false, keyField: "key", operation: "LT", value1: "100"},
			{text: "100...200", token: "100...200", exclude: false, keyField: "key", operation: "BT", value1: "100", value2: "200"},
			{text: "*foo*", token: "*foo*", exclude: false, keyField: "key", operation: "Contains", value1: "foo"},
			{text: "*foo", token: "*foo", exclude: false, keyField: "key", operation: "EndsWith", value1: "foo"},
			{text: "foo*", token: "foo*", exclude: false, keyField: "key", operation: "StartsWith", value1: "foo"},
			{text: "!=foo", token: "!(=foo)", exclude: true, keyField: "key", operation: "NE", value1: "foo"},
			{text: "!(=foo)", token: "!(=foo)", exclude: true, keyField: "key", operation: "NE", value1: "foo"},
			{text: "<empty>", token: "<empty>", exclude: false, keyField: "key", operation: "Empty", value1: undefined},
			{text: "!(<empty>)", token: "!(<empty>)", exclude: true, keyField: "key", operation: "Empty", value1: undefined},
			{text: "!>=100", token: "!(>=100)", exclude: true, keyField: "key", operation: "GE", value1: "100"},
			{text: "!(>=100)", token: "!(>=100)", exclude: true, keyField: "key", operation: "GE", value1: "100"},
			{text: "!>100", token: "!(>100)", exclude: true, keyField: "key", operation: "GT", value1: "100"},
			{text: "!(>100)", token: "!(>100)", exclude: true, keyField: "key", operation: "GT", value1: "100"},
			{text: "!<=100", token: "!(<=100)", exclude: true, keyField: "key", operation: "LE", value1: "100"},
			{text: "!(<=100)", token: "!(<=100)", exclude: true, keyField: "key", operation: "LE", value1: "100"},
			{text: "!<100", token: "!(<100)", exclude: true, keyField: "key", operation: "LT", value1: "100"},
			{text: "!(<100)", token: "!(<100)", exclude: true, keyField: "key", operation: "LT", value1: "100"},
			{text: "!100...200", token: "!(100...200)", exclude: true, keyField: "key", operation: "BT", value1: "100", value2: "200"},
			{text: "!(100...200)", token: "!(100...200)", exclude: true, keyField: "key", operation: "BT", value1: "100", value2: "200"},
			{text: "!*foo*", token: "!(*foo*)", exclude: true, keyField: "key", operation: "Contains", value1: "foo"},
			{text: "!(*foo*)", token: "!(*foo*)", exclude: true, keyField: "key", operation: "Contains", value1: "foo"},
			{text: "!*foo", token: "!(*foo)", exclude: true, keyField: "key", operation: "EndsWith", value1: "foo"},
			{text: "!(*foo)", token: "!(*foo)", exclude: true, keyField: "key", operation: "EndsWith", value1: "foo"},
			{text: "!foo*", token: "!(foo*)", exclude: true, keyField: "key", operation: "StartsWith", value1: "foo"},
			{text: "!(foo*)", token: "!(foo*)", exclude: true, keyField: "key", operation: "StartsWith", value1: "foo"}
		];

		this.oTokenParser.setDefaultOperation("EQ");
		aTests.forEach(function (oTest) {
			var oToken = fnTokenValidator({ text: oTest.text }),
				oRange = oToken.data().range;

			assert.strictEqual(oToken.getText(), oTest.token, "validator returns valid Token");
			assert.strictEqual(oRange.exclude , oTest.exclude, "returned range has exclude " + oTest.exclude);
			assert.strictEqual(oRange.keyField, oTest.keyField, "returned range has keyfield '" + oTest.keyField + "'");
			assert.strictEqual(oRange.operation, oTest.operation, "returned range has operation " + oTest.operation);
			assert.strictEqual(oRange.value1, oTest.value1, "returned range has value1 '" + oTest.value1 + "'");
			if (oTest.value2) {
				assert.strictEqual(oRange.value2, oTest.value2, "returned range has value1 '" + oTest.value2 + "'");
			}
		});

		this.oTokenParser.getKeyFields()[0].maxLength = 4;
		oToken = fnTokenValidator({ text: "*fooo*" });
		assert.equal(oToken.getText(), "*fooo*", "validator returns valid Token");
		oToken = fnTokenValidator({ text: "*foooooo*" });
		assert.equal(oToken, null, "validator returns null");

		this.oTokenParser.getKeyFields()[0].displayFormat = "UpperCase";
		oToken = fnTokenValidator({ text: "*fooo*" });
		assert.equal(oToken.getText(), "*FOOO*", "validator returns valid Token");
	});


	QUnit.test("Test validate other types", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var oToken = oInput._tokenizer._aTokenValidators[0]({ text: "foo" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "float", label: "float", oType: new sap.ui.model.type.Float()});
		this.oTokenParser.addKeyField({key: "int", label: "int", oType: new sap.ui.model.type.Integer()});
		this.oTokenParser.addKeyField({key: "date", label: "date", oType: new sap.ui.model.type.DateTime()});

		this.oTokenParser.setDefaultOperation("EQ");
		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "float: 100.11" });
		assert.equal(oToken.getText(), "float: =100.11", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "float", "returned range has keyfield 'key'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1, 100.11, "returned range has value1 100.11");

		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "int: >100" });
		assert.equal(oToken.getText(), "int: >100", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "int", "returned range has keyfield 'key'");
		assert.equal(oToken.data().range.operation, "GT", "returned range has operation GT");
		assert.equal(oToken.data().range.value1, 100, "returned range has value1 100");

		var oDateType = new sap.ui.model.type.DateTime();
		var oToday = new Date();
		var sValue = oDateType.formatValue(oToday, "string");
		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "date: =" + sValue });
		assert.equal(oToken.getText(), "date: =" + sValue, "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "date", "returned range has keyfield 'key'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1.toDateString(), oToday.toDateString(), "returned range has correct value1");
	});

	QUnit.test("Test validate with maxLength=1", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var oToken = oInput._tokenizer._aTokenValidators[0]({ text: "foo" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "string", label: "String ", maxLength: 1, oType: new sap.ui.model.type.String()});

		this.oTokenParser.setDefaultOperation("EQ");
		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "f" });
		assert.equal(oToken.getText(), "=f", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "string", "returned range has keyfield 'string'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1, "f", "returned range has value1 f");

		oToken = oInput._tokenizer._aTokenValidators[0]({ text: ">f" });
		assert.equal(oToken.getText(), ">f", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "string", "returned range has keyfield 'string'");
		assert.equal(oToken.data().range.operation, "GT", "returned range has operation GT");
		assert.equal(oToken.data().range.value1, "f", "returned range has value1 f");

		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "*f*" });
		assert.equal(oToken, null, "validator returns no Token");

		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "*f" });
		assert.equal(oToken, null, "validator returns no Token");

		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "f*" });
		assert.equal(oToken, null, "validator returns no Token");
	});

	QUnit.test("Test validate numc", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var oToken = oInput._tokenizer._aTokenValidators[0]({ text: "123" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "numc", maxLength: 5, type: "numc",
			oType: new sap.ui.model.odata.type.String({}, {
				isDigitSequence: true,
				maxLength: 5
			})
		});

		this.oTokenParser.setDefaultOperation("EQ");
		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "123" });
		assert.equal(oToken.getText(), "=123", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "numc", "returned range has keyfield 'numc'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1, "00123", "returned range has value1 00123");

		oToken = oInput._tokenizer._aTokenValidators[0]({ text: "*123*" });
		assert.equal(oToken.getText(), "*123*", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "numc", "returned range has keyfield 'numc'");
		assert.equal(oToken.data().range.operation, "Contains", "returned range has operation Contains");
		assert.equal(oToken.data().range.value1, "123", "returned range has value1 123");
	});

	QUnit.test("Type operations", function (assert) {
		// Arrange
		var oTP = new TokenParser();

		// Assert
		assert.strictEqual(
			JSON.stringify(oTP._mTypeOperations),
			'{"default":["EQ","BT","LT","LE","GT","GE","NE","NB","NOTLT","NOTLE","NOTGT","NOTGE"],' +
			'"string":["Empty","ExcludeEmpty","Contains","EQ","BT","StartsWith","EndsWith","LT","LE","GT","GE","NE","NotContains","NotStartsWith","NotEndsWith","NB","NOTLT","NOTLE","NOTGT","NOTGE"],' +
			'"date":["Empty","ExcludeEmpty","EQ","BT","LT","LE","GT","GE","NE","NB","NOTLT","NOTLE","NOTGT","NOTGE"],' +
			'"time":["EQ","BT","LT","LE","GT","GE","NE","NB","NOTLT","NOTLE","NOTGT","NOTGE"],' +
			'"numeric":["EQ","BT","LT","LE","GT","GE","NE","NB","NOTLT","NOTLE","NOTGT","NOTGE"],' +
			'"numc":["Contains","EQ","BT","EndsWith","LT","LE","GT","GE","NotContains","NE","NB","NotEndsWith","NOTLT","NOTLE","NOTGT","NOTGE"],' +
			'"boolean":["EQ"]}',
			"Type operations list should match"
		);

		// Cleanup
		oTP.destroy();
	});


	QUnit.start();

});
