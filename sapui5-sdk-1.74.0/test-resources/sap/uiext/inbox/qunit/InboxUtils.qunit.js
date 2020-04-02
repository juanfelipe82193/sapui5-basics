/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/uiext/inbox/Inbox",
	"sap/ui/core/format/DateFormat"
], function(createAndAppendDiv, Inbox, DateFormat) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");


	QUnit.module("Test for Date format For DateTime");
	QUnit.test("DateTimeFormat", function(assert) {
		var inx = new Inbox("inbox");
		sap.ui.getCore().applyChanges();
		var dateValue = "\/Date(1335439338973)\/";
		var date = new Date();
		date.setTime(dateValue.substring((dateValue.indexOf("(") + 1), dateValue.indexOf(")")));
		dateValue = date;

		if (dateValue != undefined && dateValue != "") {
		   var utc = Date.UTC(dateValue.getUTCFullYear(),dateValue.getUTCMonth(),dateValue.getUTCDate(),dateValue.getUTCHours(),dateValue.getUTCMinutes(),dateValue.getUTCSeconds(),dateValue.getUTCMilliseconds());
			var userTime =  utc + new Date().getTimezoneOffset() + (new Date().getTimezoneOffset() * 60 * 1000);
		  var ins = DateFormat.getDateInstance({
				style : "medium"
			});
			var ins2 = DateFormat.getTimeInstance({
				style : "short"
			});
			var expectedDateValue = ins.format(new Date(userTime)) + " " + ins2.format(new Date(userTime));
		}
		var ut = "\/Date(" + userTime + ")\/";
		assert.equal(inx.inboxUtils.dateTimeFormat(ut), expectedDateValue ,"Checking date format");
		});
});