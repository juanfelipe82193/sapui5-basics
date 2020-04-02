/*global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/type/TextArrangementGuid",
	"sap/ui/model/ValidateException"
], function(TextArrangementGuid, ValidateException) {
	"use strict";

	QUnit.module("");

	QUnit.test("it should return the name of the data type class", function(assert) {

		// assert
		assert.strictEqual(TextArrangementGuid.prototype.getName.call(), "sap.ui.comp.smartfield.type.TextArrangementGuid");
	});

	QUnit.test("it should return the name of the primary data type class", function(assert) {

		var oPrimaryType = TextArrangementGuid.prototype.getPrimaryType.call();

		// assert
		assert.strictEqual(oPrimaryType.prototype.getName(), "sap.ui.comp.smartfield.type.Guid");
	});

	QUnit.module("parse description only", {
		beforeEach: function(assert) {

			// arrange
			this.oFormatOptions = {
				textArrangement: "descriptionOnly"
			};

			var oSettings = {
				keyField: "ID",
				descriptionField: "Text"
			};

			// system under test
			this.oType = new TextArrangementGuid(this.oFormatOptions, null, oSettings);
		},
		afterEach: function(assert) {

			// cleanup
			this.oType.destroy();
			this.oType = null;
			this.oFormatOptions = null;
		}
	});

	QUnit.test("it should trim the value", function(assert) {

		// arrange
		var done = assert.async();
		var aCurrentValues = [ undefined, undefined ];
		var SOURCE_TYPE = "string";
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "Lo",
					Text: "Lorem"
				}];

				mSettings.success(aData);
			}
		};

		// system under test
		var oType = new TextArrangementGuid(this.oFormatOptions, null, oSettings);

		// act
		var oParseDescriptionOnlyPromise = oType.parseDescriptionOnly(" Lorem ", SOURCE_TYPE, aCurrentValues, this.oFormatOptions, oSettings);

		// assert
		oParseDescriptionOnlyPromise.then(function(aValues) {

			assert.strictEqual(oType.sDescription, "Lorem");

			// cleanup
			oType.destroy();
			done();
		});
	});

	QUnit.test("it should add separators to the GUID", function(assert) {

		// arrange
		var done = assert.async();
		var aCurrentValues = [ undefined, undefined ];
		var SOURCE_TYPE = "string";
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "005056B2-77A2-1ED7-8C9B-642CF7C92F22",
					Text: "Lorem GUID"
				}];

				mSettings.success(aData);
			}
		};
		var GUID = "005056B277A21ED78C9B642CF7C92F22";

		// system under test
		var oType = new TextArrangementGuid(this.oFormatOptions, null, oSettings);

		// act
		var oParseDescriptionOnlyPromise = oType.parseDescriptionOnly(GUID, SOURCE_TYPE, aCurrentValues, this.oFormatOptions, oSettings);

		// assert
		oParseDescriptionOnlyPromise.then(function(aValues) {
			var sParsedGuid = aValues[0];

			assert.strictEqual(sParsedGuid, "005056B2-77A2-1ED7-8C9B-642CF7C92F22");
			assert.strictEqual(aValues[1], undefined);
			assert.strictEqual(oType.sDescription, "Lorem GUID");

			// cleanup
			oType.destroy();
			done();
		});
	});

	/*QUnit.test("it should convert the GUID to uppercase", function(assert) {

		// arrange
		var done = assert.async();
		var aCurrentValues = [ undefined, undefined ];
		var SOURCE_TYPE = "string";
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "005056B2-77A2-1ED7-8C9B-642CF7C92F22",
					Text: "Lorem GUID"
				}];

				mSettings.success(aData);
			}
		};

		this.oType.oSettings = oSettings;
		var GUID = "005056b2-77a2-1ed7-8c9b-642cf7c92f22";

		// act
		var oParseDescriptionOnlyPromise = this.oType.parseDescriptionOnly(GUID, SOURCE_TYPE, aCurrentValues, this.oFormatOptions, oSettings);

		// assert
		oParseDescriptionOnlyPromise.then(function(aValues) {
			var sParsedGuid = aValues[0];

			assert.strictEqual(sParsedGuid, "005056B2-77A2-1ED7-8C9B-642CF7C92F22");
			assert.strictEqual(aValues[1], undefined);
			assert.strictEqual(this.oType.sDescription, "Lorem GUID");

			// cleanup
			done();
		}.bind(this));
	});*/

	QUnit.test("it should call the onBeforeValidateValue callback with the expected argument", function(assert) {

		// arrange
		var oOnBeforeValidateValueStub = this.stub(this.oType.oSettings, "onBeforeValidateValue");

		// act
		this.oType.onBeforeValidateValue("Lorem", {
			filterFields: this.oType.getFilterFields("Lorem")
		});
		var sFirstArg = oOnBeforeValidateValueStub.args[0][0];
		var aSecondArg = oOnBeforeValidateValueStub.args[0][1];

		// assert
		assert.strictEqual(oOnBeforeValidateValueStub.callCount, 1);
		assert.strictEqual(sFirstArg, "Lorem");
		assert.strictEqual(aSecondArg.filterFields.length, 1);
		assert.strictEqual(aSecondArg.filterFields[0], "descriptionField");
	});

	// BCP: 1870199823
	QUnit.test("it should not raise a validate exception if the GUID exists in the data model", function(assert) {

		// arrange
		var done = assert.async();
		var oSettings = {
			keyField: "EHSLocationUUID",
			descriptionField: "EHSLocationName",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					EHSLocationName: "Plant IP",
					EHSLocationUUID: "40a8f032-9551-1ed6-ac94-4cc80f698bff" // note: lower case
				}];

				mSettings.success(aData);
			}
		};

		this.oType.oSettings = oSettings;

		var GUID = "40A8F032-9551-1ED6-AC94-4CC80F698BFF", // note: upper case
			SOURCE_TYPE = "string",
			aCurrentValues = ["00000000-0000-0000-0000-000000000000", undefined];

		// act
		var oParseDescriptionOnlyPromise = this.oType.parseDescriptionOnly(GUID, SOURCE_TYPE, aCurrentValues, this.oFormatOptions, oSettings);

		// assert
		oParseDescriptionOnlyPromise.then(function(aValues) {
			assert.strictEqual(aValues[0], GUID);
			assert.strictEqual(aValues[1], undefined);
			assert.strictEqual(this.oType.sDescription, "Plant IP");
			done();
		}.bind(this));
	});

	QUnit.test("it should raise a validate exception if the GUID does not exists in the data model", function(assert) {

		// arrange
		var done = assert.async();
		var oSettings = {
			keyField: "EHSLocationUUID",
			descriptionField: "EHSLocationName",
			data: [],
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [];
				mSettings.success(aData);
			}
		};
		this.oType.oSettings = oSettings;
		var GUID = "00000000-0000-0000-0000-000000000000";
		var aCurrentValues = [GUID, undefined];
		var SOURCE_TYPE = "string";

		// act
		var oParseDescriptionOnlyPromise = this.oType.parseDescriptionOnly(GUID, SOURCE_TYPE, aCurrentValues, this.oFormatOptions, oSettings);

		// assert
		oParseDescriptionOnlyPromise.catch(function() {
			assert.ok(true);
			done();
		});
	});

	QUnit.start();
});
