/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/uiext/inbox/InboxLink"
], function(createAndAppendDiv, InboxLink) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1");
	createAndAppendDiv("uiArea2");


	var sText = "Task title unavailable",
	sTextOverdue = "Task title unavailable", //TODO: Qunit to be re-written
	sTooltip = "View the task details window",
	sHref = "http://www.sap.com",
	sOverdue = true;



	var oLink1 = new InboxLink("l1");
	oLink1.setTooltip(sTooltip);
	oLink1.setText(sText);
	oLink1.setHref(sHref);
	oLink1.setOverdue(sOverdue);

	var oLink2 = new InboxLink("l2");
	oLink2.setText(sText);
	oLink2.setTooltip(sTooltip);
	oLink2.setHref(sHref);
	oLink2.setOverdue(sOverdue);

	var l1 = sap.ui.getCore().byId("l1");
	l1.setVisible(true);

	var l2 = sap.ui.getCore().byId("l2");
	l2.setVisible(true);

	QUnit.module("Text");

	QUnit.test("TextOkForOverdue", function (assert) {										//Text displayed when Overdue is true
		assert.equal(l1.getText(), sTextOverdue, "l1.getText()");
		assert.equal(l2.getText(), sTextOverdue, "l2.getText()");
	});


	QUnit.test("TextOkForNoOverdue", function(assert) {									  //Text displayed when Overdue is false
		sOverdue = false;
		oLink1.setOverdue(sOverdue);
		oLink2.setOverdue(sOverdue);
		oLink1.setText(sText);
		oLink2.setText(sText);
		assert.equal(l1.getText(), sText, "l1.getText()");
		assert.equal(l2.getText(), sText, "l2.getText()");
	});

	QUnit.module("TestTooltip");
	QUnit.test("TooltipOk", function(assert) {
		oLink1.setTooltip();
		oLink2.setTooltip("ToolTip");
		assert.equal(l1.getTooltip(), "Task title unavailable", "Check tooltip: it should be Just 'Task title unavailable'");
		assert.equal(l2.getTooltip(), "ToolTip" + "\n" + "View the task details window", "Check tooltip: 'View the task details window' should be appended to new line");
	});

	QUnit.module("TestOverdue");
	QUnit.test("OverdueOk", function(assert) {
		assert.equal(l1.getOverdue(), sOverdue, "l1.getOverdue()");
		assert.equal(l2.getOverdue(), sOverdue, "l2.getOverdue()");
	});
});