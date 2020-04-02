/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.require("sap.apf.modeler.core.textHandler");
(function() {
	'use strict';
	QUnit.module("M: Instantiation of textHandler", {
		beforeEach : function(assert) {
			this.textHandler = new sap.apf.modeler.core.TextHandler();
		}
	});
	QUnit.test("Reading modeler specific text", function(assert) {
		var sText = this.textHandler.getText("11000");
		assert.notEqual(sText, "11000", "Expected Text found");
	});
	QUnit.test("Reading apfUi text", function(assert) {
		var sText = this.textHandler.getMessageText("5002", [ "InitialStep" ]);
		assert.equal(sText.search("5002"), -1, "Expected Text found");
	});
}());