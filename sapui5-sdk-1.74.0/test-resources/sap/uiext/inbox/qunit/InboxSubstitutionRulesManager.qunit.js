/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"sap/ui/core/format/DateFormat",
	"sap/uiext/inbox/SubstitutionRulesManager"
], function(
	qutils,
	createAndAppendDiv,
	jQuery,
	InboxMockServerQUnit,
	DateFormat,
	SubstitutionRulesManager
) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	// setup mock server and inbox control
	InboxMockServerQUnit.setup();


	var INBOX_ID = "inbox";
	QUnit.module("Load");
	QUnit.test("InboxCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		var oInbox = jQuery.sap.byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});

	QUnit.test("width and height of window", function(assert) {
		var iWidth, iHeight;
		if ( typeof ( window.innerWidth ) == 'number' ) {
			iWidth = window.innerWidth;
			iHeight = window.innerHeight;
		  } else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			iWidth = document.documentElement.clientWidth;
			iHeight = document.documentElement.clientHeight;
		  }
		assert.ok(iWidth > 0 , "Width is okay " + iWidth);
		assert.ok(iHeight > 0, "Height is okay " + iHeight);
	});

	var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	var substitutionRules = new SubstitutionRulesManager("sub1");
	var utils = substitutionRules.getSubstitutionRulesManagerUtils();

	var oToday = new Date();
	var oTodayUTC = Date.UTC(oToday.getFullYear(), oToday.getMonth(), oToday.getDate(), 0, 0, 0, 0);
	var currentDate = new Date(oTodayUTC);

	var pastDate = new Date(currentDate.getTime() - 77777777777);
	var futureDate = new Date(currentDate.getTime() + 888888888);
	var futureDate2 = new Date(currentDate.getTime() + 9999999999);
	var dateFormatter = DateFormat.getDateInstance({style : "medium" });

	var SINCE_TXT = _oBundle.getText("SUBSTITUTION_RULE_SINCE_LABEL");
	var UNTIL_TXT = _oBundle.getText("SUBSTITUTION_RULE_UNTIL_LABEL");
	var ACTIVE_FOR = _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_FOR_LABEL") + " ";
	var ACTIVE_IN = _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_IN_LABEL") + " ";
	var FROM_TXT = _oBundle.getText("SUBSTITUTION_SUBSTITUTION_FROM_DATE_LABEL") + " : ";
	var DISABLED_TXT = _oBundle.getText("SUBSTITUTION_DISABLED_STATUS");
	var OUTDATED_TXT = _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE");
	var CURRENTLY_RECEIVING_TASKS_FROM = _oBundle.getText("SUBSTIUTION_RULE_CURRENTLY_RECEIVING_TASKS_FROM") + " ";
	var ACTIVATE_TO_RECEIVE_TASKS_FROM = _oBundle.getText("SUBSTIUTION_RULE_TURN_ON_TO_RECEIVE_TASKS_FROM") + " ";
	var FROM_LOWERCASE = _oBundle.getText("SUBSTITUTION_RULE_FROM_TXT");
	var RULES_IS_DISABLED_BY = _oBundle.getText("SUBSTIUTION_RULE_IS_CURRENTLY_DISABLED_BY");


	//Additional Tets based on Mock Server

	var RR_TEXT_VIEW_ID = "rowRepSubstNameTxtView";
	var RR_USER_FRDLY_TXT_ID = "rowRepUsrFriendlyTxt";
	var RR_SINCE_DATE_VIEW_ID = "rowRepSinceDateTxt";
	var RR_UNTIL_DATE_VIEW_ID = "rowRepUntilDateTxt";
	var RR_ACTIVE_TEXT_ID = "rowRepActiveTxt";
	var RR_DELETE_IMG = "rowRepDeleteImg";

	var MY_SUBS_ACTIVE_RULE_RR_SUBS_NAME = INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--" + RR_TEXT_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-";
	var MY_SUBS_ACTIVE_RULE_RR_SINCE_DATE = INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--" + RR_SINCE_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-";
	var MY_SUBS_ACTIVE_RULE_RR_UNTIL_DATE = INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--" + RR_UNTIL_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-";
	var MY_SUBS_ACTIVE_RULE_RR_STATUS_TXT = INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--" + RR_ACTIVE_TEXT_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-";
	var MY_SUBS_ACTIVE_RULE_RR_DELETE_IMG = INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--" + RR_DELETE_IMG + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-";

	var MY_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME = INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--" + RR_TEXT_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-";
	var MY_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE = INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--" + RR_SINCE_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-";
	var MY_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE = INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--" + RR_UNTIL_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-";
	var MY_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT = INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--" + RR_ACTIVE_TEXT_ID + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-";
	var MY_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG = INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--" + RR_DELETE_IMG + "-" + INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-";

	QUnit.module("Test For View My Substitution Rules - Active Rules");
	var iTotalNumberofRows = 4;
	var iTotalNumberOfPages, iTotalRowsDisplayedFirstPage, $aSubstitutesRowRepeater;
	var iPageNumber = 1, iRowNumberinPage = 0;
	var oSubstitutesRowRepeater, sRowId;


	QUnit.asyncTest("Test My Substitution Rules Displayed", function(assert) {
			qutils.triggerMouseEvent(INBOX_ID + "--settingsButton", "click");
			sap.ui.getCore().applyChanges();

			//Get the number of Rows Displayed in each Page

		setTimeout(function() {
			//find Row and Page details
			$aSubstitutesRowRepeater = jQuery.sap.byId(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater");
			assert.ok($aSubstitutesRowRepeater.get(0), "My Substitutes RowRepeater displayed in Stream View");

			iTotalRowsDisplayedFirstPage = $aSubstitutesRowRepeater.find('.sapUiRrRow').length;
			assert.ok(iTotalRowsDisplayedFirstPage > 0, "Number of Rows displayed" + iTotalRowsDisplayedFirstPage + ", Atleast One Row is displayed to continue with the tests");

			oSubstitutesRowRepeater = sap.ui.getCore().byId(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater");
			assert.ok(oSubstitutesRowRepeater.getRows().length, "Number of Rows displayed using API" + oSubstitutesRowRepeater.getRows().length + ", Atleast One Row is displayed to continue with the tests");

			iTotalNumberOfPages = Math.ceil(iTotalNumberofRows / iTotalRowsDisplayedFirstPage);

			 QUnit.start();
		}, 1000);
	});
	//test first Row
	QUnit.asyncTest("Test My Substitution Rules First Row", function(assert) {
			QUnit.start();
			sRowId = oSubstitutesRowRepeater.getRows()[0].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);
			iPageNumber = 1;
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Manjusha Anand", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");//Checking Substitute Name
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), SINCE_TXT + " : " + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");//Checking Since Date
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(futureDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");//Checking Until Date
			//using SubstitutionRuleManagerUtils method, hence TODO: make sure there is test written for _getNoOfDays() function
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), ACTIVE_FOR + utils._getNoOfDays(true, currentDate, futureDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");//Checking Status Text
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 1, "Page 1 Row 1 of My Substitution Active Rules");//Testing Delete Image
	});


	//test first Row
	QUnit.asyncTest("Test My Substitution Rules Second Row", function(assert) {

			iRowNumberinPage = "1";
			var iPageNumber = "1";

			/* sRowId = oSubstitutesRowRepeater.getRows()[1].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
			sap.ui.getCore().applyChanges();
		setTimeout(function() {
			QUnit.start();
			var aRows = $aSubstitutesRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Sharan Kumar Bojja", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), SINCE_TXT + " : " + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(futureDate2), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), ACTIVE_FOR + utils._getNoOfDays(true, pastDate, futureDate2), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
		}, 1000);
	});

	//test third Row
	QUnit.asyncTest("Test My Substitution Rules Third Row", function(assert) {
			/* sRowId = oSubstitutesRowRepeater.getRows()[2].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			iRowNumberinPage = "2";
			iPageNumber = "1";

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "3";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--3", "click");//Goto NextPage
			} else if (iTotalNumberOfPages == 2 && iTotalRowsDisplayedFirstPage < 3){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
				sap.ui.getCore().applyChanges();

			//qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage of Active Rules
		  setTimeout(function() {
			QUnit.start();
			var aRows = $aSubstitutesRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Madarapu Prashanth", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), SINCE_TXT + " : " + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(futureDate2), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), ACTIVE_FOR + utils._getNoOfDays(true, currentDate, futureDate2), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			}, 1000);
		});

	//test fourth Row
	QUnit.asyncTest("Test My Substitution Rules Fourth Row", function(assert) {
		iRowNumberinPage = 3;
		iPageNumber = "1";
		if (iTotalNumberOfPages == 4){
			iRowNumberinPage = 0;
			iPageNumber = "4";
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--4", "click");//Goto NextPage
		} else if (iTotalNumberOfPages == 2){
			var iPageNumber = "2";
			if (iTotalRowsDisplayedFirstPage == 2){
				iRowNumberinPage = 1;
			} else if (iTotalRowsDisplayedFirstPage == 3){
				iRowNumberinPage = 0;
			}
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
		}
		sap.ui.getCore().applyChanges();

			//test fourth Row //TODO - find a formula

		 setTimeout(function() {
			QUnit.start();
			var aRows = $aSubstitutesRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "James Bond", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 1, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution Active Rules");

			}, 1000);
		});

	QUnit.module("Test For View My Substitution Rules - Inactive Rules");
	var iTotalNumberofRows = 4;
	var iTotalNumberOfPages, iTotalRowsDisplayedFirstPage, $aSubstitutesRowRepeater;
	var iPageNumber = 1, iRowNumberinPage = 0;
	var oSubstitutesRowRepeater, sRowId;

	QUnit.asyncTest("Test My Substitution Rules - Inactive Displayed", function(assert) {
			qutils.triggerMouseEvent(INBOX_ID + "--settingsButton", "click");
			sap.ui.getCore().applyChanges();

			//Get the number of Rows Displayed in each Page
		setTimeout(function() {
			//find Row and Page details
			$aSubstitutesRowRepeater = jQuery.sap.byId(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater");
			assert.ok($aSubstitutesRowRepeater.get(0), "My Substitutes - Inactive RowRepeater displayed in Stream View");

			iTotalRowsDisplayedFirstPage = $aSubstitutesRowRepeater.find('.sapUiRrRow').length;
			assert.ok(iTotalRowsDisplayedFirstPage > 0, "Number of Rows displayed" + iTotalRowsDisplayedFirstPage + ", Atleast One Row is displayed to continue with the tests");

			oSubstitutesRowRepeater = sap.ui.getCore().byId(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater");
			assert.ok(oSubstitutesRowRepeater.getRows().length, "Number of Rows displayed using API" + oSubstitutesRowRepeater.getRows().length + ", Atleast One Row is displayed to continue with the tests");
			iTotalNumberOfPages = Math.ceil(iTotalNumberofRows / iTotalRowsDisplayedFirstPage);

			 QUnit.start();
		}, 1000);
	});
	//test first Row
	QUnit.asyncTest("Test My Substitution Rules - Inactive First Row", function(assert) {
			QUnit.start();
			sRowId = oSubstitutesRowRepeater.getRows()[0].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);
			iPageNumber = 1;
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Ranbir Kapoor","Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution InActive Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), FROM_TXT + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution InActive Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution InActive Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), OUTDATED_TXT, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution InActive Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution InActive Rules");
	});


	//test first Row
	QUnit.asyncTest("Test My Substitution Rules - Inactive Second Row", function(assert) {

			iRowNumberinPage = "1";
			var iPageNumber = "1";

			/* sRowId = oSubstitutesRowRepeater.getRows()[1].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
			sap.ui.getCore().applyChanges();
		setTimeout(function() {
			QUnit.start();
			var aRows = $aSubstitutesRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Karishma Kapoor","Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), "" , "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + "1").length, 1, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");

		}, 1000);
	});

	//test third Row
	QUnit.asyncTest("Test My Substitution Rules - Inactive Third Row", function(assert) {
			/* sRowId = oSubstitutesRowRepeater.getRows()[2].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			iRowNumberinPage = "2";
			iPageNumber = "1";

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "3";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-fp-a--3", "click");//Goto NextPage
			} else if (iTotalNumberOfPages == 2 && iTotalRowsDisplayedFirstPage < 3){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
				sap.ui.getCore().applyChanges();

			//qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage of Active Rules
		  setTimeout(function() {
			QUnit.start();
			var aRows = $aSubstitutesRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			//Testing Substitute Name
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Sonam Kapoor", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), FROM_TXT  + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), DISABLED_TXT , "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 1, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			}, 1000);
		});

	//test fourth Row
	QUnit.asyncTest("Test My Substitution Rules - Inactive Fourth Row", function(assert) {
		iRowNumberinPage = 3;
		iPageNumber = "1";
		if (iTotalNumberOfPages == 4){
			iRowNumberinPage = 0;
			iPageNumber = "4";
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-fp-a--4", "click");//Goto NextPage
		} else if (iTotalNumberOfPages == 2){
			var iPageNumber = "2";
			if (iTotalRowsDisplayedFirstPage == 2){
				iRowNumberinPage = 1;
			} else if (iTotalRowsDisplayedFirstPage == 3){
				iRowNumberinPage = 0;
			}
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
		}
		sap.ui.getCore().applyChanges();


		 setTimeout(function() {
			QUnit.start();
			var aRows = $aSubstitutesRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "James Kapoor", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), FROM_TXT  + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(futureDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), DISABLED_TXT , "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(MY_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of My Substitution In-Active Rules");

			}, 1000);
		});

	//TESTS FOR I AM SUSBSTITUTING

	var I_AM_SUBS_ACTIVE_RULE_RR_SUBS_NAME = INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--" + RR_TEXT_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-";
	var I_AM_SUBS_ACTIVE_RULE_RR_USR_FRDLY_TXT = INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--" + RR_USER_FRDLY_TXT_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-";
	var I_AM_SUBS_ACTIVE_RULE_RR_SINCE_DATE = INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--" + RR_SINCE_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-";
	var I_AM_SUBS_ACTIVE_RULE_RR_UNTIL_DATE = INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--" + RR_UNTIL_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-";
	var I_AM_SUBS_ACTIVE_RULE_RR_STATUS_TXT = INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--" + RR_ACTIVE_TEXT_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-";
	var I_AM_SUBS_ACTIVE_RULE_RR_DELETE_IMG = INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--" + RR_DELETE_IMG + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-";


	var I_AM_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME = INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--" + RR_TEXT_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-";
	var I_AM_SUBS_IN_ACTIVE_RULE_RR_USR_FRDLY_TXT = INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--" + RR_USER_FRDLY_TXT_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-";
	var I_AM_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE = INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--" + RR_SINCE_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-";
	var I_AM_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE = INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--" + RR_UNTIL_DATE_VIEW_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-";
	var I_AM_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT = INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--" + RR_ACTIVE_TEXT_ID + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-";
	var I_AM_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG = INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--" + RR_DELETE_IMG + "-" + INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-";


	QUnit.module("Test For View 'I am Substituting Rules - Active Rules");

	var iTotalNumberofRows = 4;
	var iTotalNumberOfPages, iTotalRowsDisplayedFirstPage, $aIamSubstitutingRowRepeater;
	var iPageNumber = 1, iRowNumberinPage = 0;
	var oIamSubstitutingRowRepeater, sRowId;

	QUnit.asyncTest("Test I am Substituting Rules Displayed", function(assert) {
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstituting", "click");
			sap.ui.getCore().applyChanges();

			//Get the number of Rows Displayed in each Page

		setTimeout(function() {
			//find Row and Page details
			$aIamSubstitutingRowRepeater = jQuery.sap.byId(INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater");
			assert.ok($aIamSubstitutingRowRepeater.get(0), "I am Substituting RowRepeater displayed in Stream View");

			iTotalRowsDisplayedFirstPage = $aIamSubstitutingRowRepeater.find('.sapUiRrRow').length;
			assert.ok(iTotalRowsDisplayedFirstPage > 0, "Number of Rows displayed" + iTotalRowsDisplayedFirstPage + ", Atleast One Row should be displayed to continue with the tests");

			oIamSubstitutingRowRepeater = sap.ui.getCore().byId(INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater");
			assert.ok(oIamSubstitutingRowRepeater.getRows().length, "Number of Rows displayed using API" + oIamSubstitutingRowRepeater.getRows().length + ", Atleast One Row is displayed to continue with the tests");
			iTotalNumberOfPages = Math.ceil(iTotalNumberofRows / iTotalRowsDisplayedFirstPage);

			 QUnit.start();
		}, 1000);
	});

	//test first Row
	QUnit.asyncTest("Test I am Substituting Rules First Row", function(assert) {
			QUnit.start();
			sRowId = oIamSubstitutingRowRepeater.getRows()[0].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);
			iPageNumber = 1;

			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Amir Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");//Checking Substitute Name
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), CURRENTLY_RECEIVING_TASKS_FROM + "Amir Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");//Checking User Friendly Text
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), SINCE_TXT + " : " + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");//Checking Since Date
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(futureDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");//Checking Until Date
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), ACTIVE_FOR + utils._getNoOfDays(true, pastDate, futureDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");//Checking Status Text
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");//Testing Delete Image
	});


	//test first Row
	QUnit.asyncTest("Test I am Substituting Rules Second Row", function(assert) {

			iRowNumberinPage = "1";
			var iPageNumber = "1";

			/* sRowId = oSubstitutesRowRepeater.getRows()[1].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
			sap.ui.getCore().applyChanges();
		setTimeout(function() {
			QUnit.start();
			var aRows = $aIamSubstitutingRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Salman Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), CURRENTLY_RECEIVING_TASKS_FROM + "Salman Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), SINCE_TXT + " : " + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), ACTIVE_FOR + utils._getNoOfDays(true, currentDate, currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
		}, 1000);
	});

	//test third Row
	QUnit.asyncTest("Test I am Substituting Rules Third Row", function(assert) {
			/* sRowId = oSubstitutesRowRepeater.getRows()[2].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			iRowNumberinPage = "2";
			iPageNumber = "1";

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "3";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-fp-a--3", "click");//Goto NextPage
			} else if (iTotalNumberOfPages == 2 && iTotalRowsDisplayedFirstPage < 3){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
				sap.ui.getCore().applyChanges();

			//qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage of Active Rules
		  setTimeout(function() {
			QUnit.start();
			var aRows = $aIamSubstitutingRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Shah Rukh Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), CURRENTLY_RECEIVING_TASKS_FROM + "Shah Rukh Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), SINCE_TXT + " : " + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(futureDate2), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), ACTIVE_FOR + utils._getNoOfDays(true, currentDate, futureDate2), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			}, 1000);
		});

	//test fourth Row
	QUnit.asyncTest("Test I am Substituting Fourth Row", function(assert) {
		iRowNumberinPage = 3;
		iPageNumber = "1";
		if (iTotalNumberOfPages == 4){
			iRowNumberinPage = 0;
			iPageNumber = "4";
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-fp-a--4", "click");//Goto NextPage
		} else if (iTotalNumberOfPages == 2){
			var iPageNumber = "2";
			if (iTotalRowsDisplayedFirstPage == 2){
				iRowNumberinPage = 1;
			} else if (iTotalRowsDisplayedFirstPage == 3){
				iRowNumberinPage = 0;
			}
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutingactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
		}
		sap.ui.getCore().applyChanges();

			//test fourth Row //TODO - find a formula

		 setTimeout(function() {
			QUnit.start();
			var aRows = $aIamSubstitutingRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "James Bond Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), CURRENTLY_RECEIVING_TASKS_FROM + "James Bond Khan", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");

			}, 1000);
		});

	QUnit.module("Test For View 'I am Substituting Rules - InActive Rules");

	var iTotalNumberofRows = 4;
	var iTotalNumberOfPages, iTotalRowsDisplayedFirstPage, $aIamSubstitutingInactiveRowRepeater;
	var iPageNumber = 1, iRowNumberinPage = 0;
	var oIamSubstitutingInactiveRowRepeater, sRowId;

	QUnit.asyncTest("Test I am Substituting Inactive Rules Displayed", function(assert) {
			//Get the number of Rows Displayed in each Page

		setTimeout(function() {
			//find Row and Page details
			$aIamSubstitutingInactiveRowRepeater = jQuery.sap.byId(INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater");
			assert.ok($aIamSubstitutingInactiveRowRepeater.get(0), "I am Substituting Inactive Rules RowRepeater displayed in Stream View");

			iTotalRowsDisplayedFirstPage = $aIamSubstitutingInactiveRowRepeater.find('.sapUiRrRow').length;
			assert.ok(iTotalRowsDisplayedFirstPage > 0, "Number of Rows displayed" + iTotalRowsDisplayedFirstPage + ", Atleast One Row is displayed to continue with the tests");

			oIamSubstitutingInactiveRowRepeater = sap.ui.getCore().byId(INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater");
			assert.ok(oIamSubstitutingInactiveRowRepeater.getRows().length, "Number of Rows displayed using API" + oIamSubstitutingInactiveRowRepeater.getRows().length + ", Atleast One Row is displayed to continue with the tests");
			iTotalNumberOfPages = Math.ceil(iTotalNumberofRows / iTotalRowsDisplayedFirstPage);

			 QUnit.start();
		}, 1000);
	});

	//test first Row
	QUnit.asyncTest("Test I am Substituting Inactive Rules First Row", function(assert) {
			QUnit.start();
			sRowId = oIamSubstitutingInactiveRowRepeater.getRows()[0].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);
			iPageNumber = 1;

			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Manjusha Roy", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), RULES_IS_DISABLED_BY + " Manjusha Roy", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), FROM_TXT  + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), DISABLED_TXT , "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
	});


	//test first Row
	QUnit.asyncTest("Test I am Substituting Inactive Rules Second Row", function(assert) {

			iRowNumberinPage = "1";
			var iPageNumber = "1";

			/* sRowId = oSubstitutesRowRepeater.getRows()[1].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
			sap.ui.getCore().applyChanges();
		setTimeout(function() {
			QUnit.start();
			var aRows = $aIamSubstitutingInactiveRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Sharan Roy", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), ACTIVATE_TO_RECEIVE_TASKS_FROM + "Sharan Roy", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), FROM_TXT  + dateFormatter.format(currentDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(futureDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), DISABLED_TXT , "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting Active Rules");
		}, 1000);
	});

	//test third Row
	QUnit.asyncTest("Test I am Substituting Inactive Rules Third Row", function(assert) {
			/* sRowId = oSubstitutesRowRepeater.getRows()[2].getId();
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1); */

			iRowNumberinPage = "2";
			iPageNumber = "1";

			if (iTotalNumberOfPages == 4){
				iRowNumberinPage = "0";
				iPageNumber = "3";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-fp-a--3", "click");//Goto NextPage
			} else if (iTotalNumberOfPages == 2 && iTotalRowsDisplayedFirstPage < 3){
				iRowNumberinPage = "0";
				iPageNumber = "2";
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
			}
				sap.ui.getCore().applyChanges();

			//qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage of Active Rules
		  setTimeout(function() {
			QUnit.start();
			var aRows = $aIamSubstitutingInactiveRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);

			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "Roy Prashanth", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), ACTIVATE_TO_RECEIVE_TASKS_FROM + "Roy Prashanth" , "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting  In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting  In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), "" , "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting  In-Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting  In-Active Rules");
			}, 1000);
		});

	//test fourth Row
	QUnit.asyncTest("Test I am Substituting Inactive Fourth Row", function(assert) {
		iRowNumberinPage = 3;
		iPageNumber = "1";
		if (iTotalNumberOfPages == 4){
			iRowNumberinPage = 0;
			iPageNumber = "4";
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-fp-a--4", "click");//Goto NextPage
		} else if (iTotalNumberOfPages == 2){
			var iPageNumber = "2";
			if (iTotalRowsDisplayedFirstPage == 2){
				iRowNumberinPage = 1;
			} else if (iTotalRowsDisplayedFirstPage == 3){
				iRowNumberinPage = 0;
			}
			qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--iamSubstitutinginactive--subsRowRepeater-fp-a--2", "click");//Goto NextPage
		}
		sap.ui.getCore().applyChanges();

			//test fourth Row //TODO - find a formula

		 setTimeout(function() {
			QUnit.start();
			var aRows = $aIamSubstitutingInactiveRowRepeater.find('.sapUiRrRow');
			var $row = aRows.get(iRowNumberinPage);
			sRowId = $row.getAttribute('id');
			iRowNumberinPage = sRowId.charAt(sRowId.length - 1);
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SUBS_NAME + iRowNumberinPage).text(), "James Roy", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_USR_FRDLY_TXT + iRowNumberinPage).text(), "", "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_SINCE_DATE + iRowNumberinPage).text(), FROM_TXT  + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_UNTIL_DATE + iRowNumberinPage).text(), UNTIL_TXT + " : " + dateFormatter.format(pastDate), "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_STATUS_TXT + iRowNumberinPage).text(), OUTDATED_TXT, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");
			//TODO: Check Enable/Disable Segmented Button State (ON/OFF)
			assert.equal(jQuery.sap.byId(I_AM_SUBS_IN_ACTIVE_RULE_RR_DELETE_IMG + iRowNumberinPage).length, 0, "Page" +  iPageNumber + "Row" + iRowNumberinPage + "of I am Substituting In-Active Rules");

			}, 1000);
		});


	//TODO: Fix these tests later

	/*	QUnit.module( "Tests For Enable/Disable/Delete  Substitution Rules", {
			setup: function() {
					qutils.triggerMouseEvent(INBOX_ID  +"--settingsButton", "click");
					qutils.triggerKeydown(INBOX_ID + "--inboxSettingsMenu", jQuery.sap.KeyCodes.ARROW_DOWN, false, false, false);
					qutils.triggerMouseEvent(INBOX_ID + "--manageSubstitutionMI", "click");
					sap.ui.getCore().applyChanges();
					assert.ok( true, "setup function successfully executed" );
			  }, teardown: function() {
					qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--substitutionOverlayContainer-close", "click");
					assert.ok( true, "teardown function successfully executed" );
			  }
			});

			var sMessageBarTextViewID = INBOX_ID + "--substitutionRulesManager--msbBarTextView"
			var SUBSTITUTION_RULE_UPDATED_SUCCESSFULLY = _oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_UPDATED_SUCCESSFULLY");
			var SUBSTITUTION_RULE_DELETED_SUCCESSFULLY = _oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_DELETED_SUCCESSFULLY");

			QUnit.asyncTest("Test For Enable Substitution Rules", function(assert) {

				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesinactive--rowRepOnSegBtn-"+INBOX_ID+"--substitutionRulesManager--mySubstitutesinactive--subsRowRepeater-0", "click");
				setTimeout(function() {
					QUnit.start();
					assert.equal(jQuery.sap.byId(sMessageBarTextViewID).text(), SUBSTITUTION_RULE_UPDATED_SUCCESSFULLY, "Testing Enable substitution Rule");
				}, 2000);
			});

			QUnit.asyncTest("Test For Disable Substitution Rules", function(assert) {
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--rowRepOffSegBtn-"+INBOX_ID+"--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-0", "click");
				setTimeout(function() {
				  QUnit.start();
				  assert.equal(jQuery.sap.byId(sMessageBarTextViewID).text(), SUBSTITUTION_RULE_UPDATED_SUCCESSFULLY, "Testing Disable substitution Rule");
				}, 2000);
			});

			QUnit.asyncTest("Test For Delete Substitution Rules", function(assert) {
				qutils.triggerMouseEvent(INBOX_ID + "--substitutionRulesManager--mySubstitutesactive--rowRepDeleteImg-"+INBOX_ID+"--substitutionRulesManager--mySubstitutesactive--subsRowRepeater-0", "click");
				setTimeout(function() {
				  QUnit.start();
				  assert.equal(jQuery.sap.byId(sMessageBarTextViewID).text(), SUBSTITUTION_RULE_DELETED_SUCCESSFULLY, "Testing Delete substitution Rule");
				}, 2000);
			});
	*/

	//Tests Starts
	//Testing Method:
	//sap.uiext.inbox.SubstitutionRulesManagerUtils._getText = function(value, isSubstitutedUserRules, isActiveSubstRule, bIsRecieveTasks, beginDate, endDate)
	//and
	//sap.uiext.inbox.SubstitutionRulesManagerUtils._getStatus = function(isSubstitutedUserRules, isActiveSubstRule, beginDate, endDate)
	QUnit.module("Test Substitution Utils");
	QUnit.test("GetTextAndGetStatusTestForMySubstitutes", function(assert) {
		var sActualStatus;
		var sActualText;

		var sMySubstituteUser_1 = "Dubbrow, Patrick"; //mapped to value
		var sMySubstituteUser_2 = "Breyer, Tobias"; //mapped to value
		var bIsSubstitutedUserRules = true; //true if its "My Substitution Rules"
		var bIsActiveSubstRule; //mapped to IsEnabled
		var bIsRecieveTasks; //mapped to SupportsEnableSubtitution
		var oDateRange;

		//Scenario  :  My Substitution Rules
		//IsEnabled = true
		//SupportsEnableSubtitution = true
		//Date Range = CURRENT
		bIsActiveSubstRule = true;
		bIsRecieveTasks = true;
		oDateRange = currentDate; // giving begin Date and end date as same. Thats means rule will be active for 1 day.
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus,  _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_FOR_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, sMySubstituteUser_1 + " " + _oBundle.getText("SUBSTIUTION_RULE_CURRENTLY_RECEIVING_TASKS"));

		//Scenario  :  My Substitution Rules
		//IsEnabled = true
		//SupportsEnableSubtitution = true
		//Date Range = IN FUTURE
		bIsActiveSubstRule = true;
		bIsRecieveTasks = true;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_IN_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, sMySubstituteUser_1 + " " + _oBundle.getText("SUBSTIUTION_RULE_WILL_RECEIVE_TASKS_FROM") + " " + utils._getFormattedDate(oDateRange));

		//Scenario  :  My Substitution Rules
		//IsEnabled = true
		//SupportsEnableSubtitution = true
		//Date Range = IN PAST
		bIsActiveSubstRule = true;
		bIsRecieveTasks = true;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");

		//Scenario  :  My Substitution Rules
		//IsEnabled = false
		//SupportsEnableSubtitution = true
		//Date Range = CURRENT
		bIsActiveSubstRule = false;
		bIsRecieveTasks = true;
		oDateRange = currentDate; // giving begin Date and end date as same. Thats means rule will be active for 1 day.
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus,  _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText,  _oBundle.getText("SUBSTITUTION_RULE_ENABLE_FOR") + " " + sMySubstituteUser_1 + " " + _oBundle.getText("SUBSTITUTION_RULE_TO_RECIEVE_TASKS"));

		//Scenario  :  My Substitution Rules
		//IsEnabled = false
		//SupportsEnableSubtitution = true
		//Date Range = IN FUTURE
		bIsActiveSubstRule = false;
		bIsRecieveTasks = true;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText,  _oBundle.getText("SUBSTITUTION_RULE_ENABLE_FOR") + " " + sMySubstituteUser_1 + " " +
							_oBundle.getText("SUBSTITUTION_RULE_TO_RECIEVE_TASKS") + " " + _oBundle.getText("SUBSTITUTION_RULE_FROM_TXT") + " " + utils._getFormattedDate(oDateRange));

		//Scenario  :  My Substitution Rules
		//IsEnabled = false
		//SupportsEnableSubtitution = true
		//Date Range = IN PAST
		bIsActiveSubstRule = false;
		bIsRecieveTasks = true;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");

		//Scenario  :  My Substitution Rules
		//IsEnabled = true
		//SupportsEnableSubtitution = false
		//Date Range = CURRENT
		bIsActiveSubstRule = true;
		bIsRecieveTasks = false;
		oDateRange = currentDate; // giving begin Date and end date as same. Thats means rule will be active for 1 day.
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus,  _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_FOR_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, sMySubstituteUser_1 + " " + _oBundle.getText("SUBSTIUTION_RULE_CURRENTLY_RECEIVING_TASKS"));

		//Scenario  :  My Substitution Rules
		//IsEnabled = true
		//SupportsEnableSubtitution = false
		//Date Range = IN FUTURE
		bIsActiveSubstRule = true;
		bIsRecieveTasks = false;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_IN_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, sMySubstituteUser_1 + " " + _oBundle.getText("SUBSTIUTION_RULE_WILL_RECEIVE_TASKS_FROM") + " " + utils._getFormattedDate(oDateRange));

		//Scenario  :  My Substitution Rules
		//IsEnabled = true
		//SupportsEnableSubtitution = false
		//Date Range = IN PAST
		bIsActiveSubstRule = true;
		bIsRecieveTasks = false;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");

		//Scenario  :  My Substitution Rules
		//IsEnabled = false
		//SupportsEnableSubtitution = false
		//Date Range = CURRENT
		bIsActiveSubstRule = false;
		bIsRecieveTasks = false;
		oDateRange = currentDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, sMySubstituteUser_1 + " " + _oBundle.getText("SUBSTIUTION_RULE_HAS_NOT_ACTIVATED_YOUR"));

		//Scenario  :  My Substitution Rules
		//IsEnabled = false
		//SupportsEnableSubtitution = false
		//Date Range = IN FUTURE
		bIsActiveSubstRule = false;
		bIsRecieveTasks = false;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, sMySubstituteUser_1 + " " + _oBundle.getText("SUBSTIUTION_RULE_HAS_NOT_ACTIVATED_YOUR"));

		//Scenario  :  My Substitution Rules
		//IsEnabled = false
		//SupportsEnableSubtitution = false
		//Date Range = IN PAST
		bIsActiveSubstRule = false;
		bIsRecieveTasks = false;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sMySubstituteUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");

	});

	//Testing Method:
	//sap.uiext.inbox.SubstitutionRulesManagerUtils._getText = function(value, isSubstitutedUserRules, isActiveSubstRule, enabled, mode, takenOver,beginDate, endDate)
	//and
	//sap.uiext.inbox.SubstitutionRulesManagerUtils._getStatus = function(value, isSubstitutedUserRules, isActiveSubstRule, enabled, mode, takenOver,beginDate, endDate)
	//isSubstitutedUserRules = false;
	QUnit.test("GetTextAndGetStatusTestForIamSubstituting", function(assert) {
		var sIamSubstitutingUser_1 = "Hoenig, Romy"; //mapped to value
		var sIamSubstitutingUser_2 = "Klinker, Boris"; //mapped to value
		var bIsSubstitutedUserRules = false; //false if its "I am Substituting"
		var bIsActiveSubstRule; //mapped to IsEnabled
		var bIsRecieveTasks; //mapped to SupportsEnableSubtitution
		var oDateRange;
		var sActualStatus;
		var sActualText;

		//Scenario  :  I am Substituting
		//IsEnabled = true
		//SupportsEnableSubtitution = true
		//Date Range = CURRENT
		bIsActiveSubstRule = true;
		bIsRecieveTasks = true;
		oDateRange = currentDate; // giving begin Date and end date as same. Thats means rule will be active for 1 day.
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus,  _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_FOR_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, _oBundle.getText("SUBSTIUTION_RULE_CURRENTLY_RECEIVING_TASKS_FROM") + " " + sIamSubstitutingUser_1);


		//Scenario  :  I am Substituting
		//IsEnabled = true
		//SupportsEnableSubtitution = true
		//Date Range = IN FUTURE
		bIsActiveSubstRule = true;
		bIsRecieveTasks = true;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_IN_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText,  _oBundle.getText("SUBSTIUTION_RULE_YOU_WILL_RECEIVE_TASKS_FROM") + " " + sIamSubstitutingUser_1 + " " + _oBundle.getText("SUBSTITUTION_RULE_FROM_TXT") + " " + utils._getFormattedDate(oDateRange));

		//Scenario  :  I am Substituting
		//IsEnabled = true
		//SupportsEnableSubtitution = true
		//Date Range = IN PAST
		bIsActiveSubstRule = true;
		bIsRecieveTasks = true;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");

		//Scenario  :  I am Substituting
		//IsEnabled = false
		//SupportsEnableSubtitution = true
		//Date Range = CURRENT
		bIsActiveSubstRule = false;
		bIsRecieveTasks = true;
		oDateRange = currentDate; // giving begin Date and end date as same. Thats means rule will be active for 1 day.
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus,  _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText,  _oBundle.getText("SUBSTIUTION_RULE_TURN_ON_TO_RECEIVE_TASKS_FROM") + " " + sIamSubstitutingUser_1);

		//Scenario  :  I am Substituting
		//IsEnabled = false
		//SupportsEnableSubtitution = true
		//Date Range = IN FUTURE
		bIsActiveSubstRule = false;
		bIsRecieveTasks = true;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText,  _oBundle.getText("SUBSTIUTION_RULE_TURN_ON_TO_RECEIVE_TASKS_FROM") + " " + sIamSubstitutingUser_1 + " " + _oBundle.getText("SUBSTITUTION_RULE_FROM_TXT") + " " + utils._getFormattedDate(oDateRange));

		//Scenario  :  I am Substituting
		//IsEnabled = false
		//SupportsEnableSubtitution = true
		//Date Range = IN PAST
		bIsActiveSubstRule = false;
		bIsRecieveTasks = true;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");

		//Scenario  :  I am Substituting
		//IsEnabled = true
		//SupportsEnableSubtitution = false
		//Date Range = CURRENT
		bIsActiveSubstRule = true;
		bIsRecieveTasks = false;
		oDateRange = currentDate; // giving begin Date and end date as same. Thats means rule will be active for 1 day.
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus,  _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_FOR_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, _oBundle.getText("SUBSTIUTION_RULE_CURRENTLY_RECEIVING_TASKS_FROM") + " " + sIamSubstitutingUser_1 );

		//Scenario  :  I am Substituting
		//IsEnabled = true
		//SupportsEnableSubtitution = false
		//Date Range = IN FUTURE
		bIsActiveSubstRule = true;
		bIsRecieveTasks = false;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_RULE_ACTIVE_IN_LABEL") + " " + utils._getNoOfDays(bIsActiveSubstRule, oDateRange, oDateRange));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText,  _oBundle.getText("SUBSTIUTION_RULE_YOU_WILL_RECEIVE_TASKS_FROM") + " " + sIamSubstitutingUser_1 + " " + _oBundle.getText("SUBSTITUTION_RULE_FROM_TXT") + " " + utils._getFormattedDate(oDateRange));

		//Scenario  :  I am Substituting
		//IsEnabled = true
		//SupportsEnableSubtitution = false
		//Date Range = IN PAST
		bIsActiveSubstRule = true;
		bIsRecieveTasks = false;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");

		//Scenario  :  I am Substituting
		//IsEnabled = false
		//SupportsEnableSubtitution = false
		//Date Range = CURRENT
		bIsActiveSubstRule = false;
		bIsRecieveTasks = false;
		oDateRange = currentDate; // giving begin Date and end date as same. Thats means rule will be active for 1 day.
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, _oBundle.getText("SUBSTIUTION_RULE_IS_CURRENTLY_DISABLED_BY") + " " +  sIamSubstitutingUser_1);

		//Scenario  :  I am Substituting
		//IsEnabled = false
		//SupportsEnableSubtitution = false
		//Date Range = IN FUTURE
		bIsActiveSubstRule = false;
		bIsRecieveTasks = false;
		oDateRange = futureDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_DISABLED_STATUS"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText,  _oBundle.getText("SUBSTIUTION_RULE_YOU_WILL_RECEIVE_TASKS_FROM") + " " + sIamSubstitutingUser_1 + " " + _oBundle.getText("SUBSTITUTION_RULE_FROM_TXT") + " " + utils._getFormattedDate(oDateRange));

		//Scenario  :  I am Substituting
		//IsEnabled = false
		//SupportsEnableSubtitution = false
		//Date Range = IN PAST
		bIsActiveSubstRule = false;
		bIsRecieveTasks = false;
		oDateRange = pastDate;
		sActualStatus = utils._getStatus(bIsSubstitutedUserRules, bIsActiveSubstRule, oDateRange, oDateRange);
		assert.equal(sActualStatus, _oBundle.getText("SUBSTITUTION_OUT_OF_DATE_RANGE"));
		sActualText = utils._getText(sIamSubstitutingUser_1, bIsSubstitutedUserRules, bIsActiveSubstRule, bIsRecieveTasks, oDateRange, oDateRange);
		assert.equal(sActualText, "");
		qutils.triggerMouseEvent("inbox" + "--substitutionRulesManager--substitutionOverlayContainer-close", "click");

	});


	//TODO: Test _getNoOfDays HIGH
	//TODO; Test _getTimeDiff
	//TODO: _getFormattedDate
	//TODO: _isOutDated

	QUnit.done(function() {
			qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
		});
});