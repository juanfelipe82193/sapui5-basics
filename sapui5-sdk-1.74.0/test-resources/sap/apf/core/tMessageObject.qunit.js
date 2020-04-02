jQuery.sap.require("sap.apf.core.messageObject");

(function() {
	'use strict';

	QUnit.module('Apf Message Object', {
		beforeEach : function(assert) {
			this.oMessageObject = new sap.apf.core.MessageObject({
				code : '201',
				aParameters : [ "Everything is fine - no error occurs" ]
			});
		}
	});

	QUnit.test('Check If all API Methods are available', function(assert) {
		assert.ok(this.oMessageObject.getParameters);
		assert.ok(this.oMessageObject.getStack);
		assert.ok(this.oMessageObject.getTimestamp);
		assert.ok(this.oMessageObject.getJQueryVersion);
		assert.ok(this.oMessageObject.getSapUi5Version);
		assert.ok(this.oMessageObject.getRawText);
	});

	QUnit.test('Was MessageCode correct set?', function(assert) {
		assert.equal(this.oMessageObject.getCode(), '201');
	});

	QUnit.test('Was Parameter correct set?', function(assert) {
		assert.deepEqual(this.oMessageObject.getParameters(), [ "Everything is fine - no error occurs" ]);
	});

	QUnit.test('Is Stack there', function(assert) {
		assert.ok(typeof this.oMessageObject.getStack() === "string");
	});

	QUnit.test('Is jQueryVersion there', function(assert) {

		var sVersion = this.oMessageObject.getJQueryVersion();
		assert.ok(sVersion && sVersion.length > 0, "jQuery version properly detected");
	});

	QUnit.test('Is SapUi5 version there', function(assert) {
		var sVersion = this.oMessageObject.getSapUi5Version();
		assert.ok(sVersion && sVersion.length > 0, "Sap UI5 version properly detected");
	});

	QUnit.test('Add previous message object', function(assert) {

		var oPreviousMessageObject = new sap.apf.core.MessageObject({
			code : '199',
			aParameters : [ "Previous" ]
		});

		this.oMessageObject.setPrevious(oPreviousMessageObject);
		var sCodeOfPrevious = this.oMessageObject.getPrevious().getCode();
		assert.equal(sCodeOfPrevious, '199', "Previous message object can be accessed");

	});

	QUnit.test('Previous message object - negative testing', function(assert) {

		var oPrevious = this.oMessageObject.getPrevious();

		assert.equal(oPrevious, undefined, "No previous message object exists");

	});
	QUnit.test('No Rawtext', function(assert) {

		assert.equal(this.oMessageObject.hasRawText(), false, "No rawtext");

	});
	QUnit.test('Rawtext', function(assert) {
		var sRawText = "a raw text";
		var oMessageObject = new sap.apf.core.MessageObject({
			code : '201',
			aParameters : [ "Everything is fine - no error occurs" ],
			rawText : sRawText
		});
		assert.equal(oMessageObject.hasRawText(), true, "Rawtext exists");
		assert.equal(oMessageObject.getRawText(), sRawText, "correct raw text");
	});

	QUnit.test('get Full DateTime Object', function(assert) {
		var oMessageObject = new sap.apf.core.MessageObject({
			code : '201',
			aParameters : [ "Everything is fine - no error occurs" ],
			rawText : ""
		});
		assert.ok(oMessageObject.getTimestampAsdateObject());
	});
}());