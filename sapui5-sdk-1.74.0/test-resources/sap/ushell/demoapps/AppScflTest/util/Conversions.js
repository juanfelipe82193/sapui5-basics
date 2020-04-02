jQuery.sap.declare("AppScflTest.util.Conversions");
jQuery.sap.require("AppScflTest.util.NumberFormatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

AppScflTest.util.Conversions = {};

var DOC_TYPE_INVOICE = 0;
var DOC_TYPE_GOODSRECEIPT = 1;
var DOC_TYPE_NONE = 2;

// Auxiliary funtions

// note: variable is global for the entire shell (for all application instances)
AppScflTest.util.Conversions.oResourceBundle = null;

AppScflTest.util.Conversions.getBundle = function() {
	if (AppScflTest.util.Conversions.oResourceBundle)
		return AppScflTest.util.Conversions.oResourceBundle;
	return  { getText: function(a,b) {return "ERROR";} };
};

// Amount formatter

AppScflTest.util.Conversions.lazyRoundNumber = function(sNumber) {
	if (sNumber && !isNaN(parseFloat(sNumber)) && isFinite(sNumber))
		if (Math.abs(sNumber) < 1e6)
			return sap.ui.core.format.NumberFormat.getFloatInstance().format(sNumber);
		else
			return AppScflTest.util.NumberFormatter.lazyRoundNumber(sNumber);
	return "";
};

AppScflTest.util.Conversions.formatNumber = function(sNumber) {
	if (sNumber && !isNaN(parseFloat(sNumber)) && isFinite(sNumber))
			return sap.ui.core.format.NumberFormat.getFloatInstance().format(sNumber);
	return "";
};

// Date formatter

AppScflTest.util.Conversions.formatDaysAgo = function(sDate) {
	if (sDate)
		return DateTimeFormatter.formatDaysAgo(sDate);
	return "";
};

// expect Date object and format date to local stringformat

AppScflTest.util.Conversions.dateFormat = function(dDate) {
	if (dDate) {
		var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
		var pattern = locale.getDatePattern("short");
		var formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern : pattern
		});
		if (!(dDate instanceof Date))
			throw "date object expected!";
		return formatter.format(dDate);
	}
	return "";
};

// expect string and format date to local stringformat

AppScflTest.util.Conversions.formatDate = function(sDate) {
	if (sDate && sDate != "" && sDate != "00000000") {
		var dDate = AppScflTest.util.Conversions.string2Date(sDate);
		return AppScflTest.util.Conversions.dateFormat(dDate);
	}
	return "";
};

AppScflTest.util.Conversions.formatCreatedOn = function(sDate) {
	if (sDate)
		if (sDate != "" && sDate != "00000000") {
			var dDate = AppScflTest.util.Conversions.string2Date(sDate);
			return AppScflTest.util.Conversions.getBundle().getText("XFLD_CreatedOn", [ AppScflTest.util.Conversions.dateFormat(dDate) ]);
	
		} else {
			return AppScflTest.util.Conversions.getBundle().getText("XFLD_CreatedOn", [ "" ]);
		}
	return "";
};

AppScflTest.util.Conversions.formatSentOn = function(sDate) {
	if (sDate && sDate != "" && sDate != "00000000") {
		var dDate = AppScflTest.util.Conversions.string2Date(sDate);
		return AppScflTest.util.Conversions.getBundle().getText("XFLD_SentOn", [ AppScflTest.util.Conversions.dateFormat(dDate) ]);

	}
	return "";
};

AppScflTest.util.Conversions.formatDeliveredOn = function(sDate) {
	if (sDate)
		if (sDate != "" && sDate != "00000000") {
			var dDate = AppScflTest.util.Conversions.string2Date(sDate);
			return AppScflTest.util.Conversions.getBundle().getText("XTIT_DeliveryOn", [ AppScflTest.util.Conversions.dateFormat(dDate) ]);
	
		} else {
			return AppScflTest.util.Conversions.getBundle().getText("XTIT_DeliveryOn", [ "" ]);
		}
	return "";
};

AppScflTest.util.Conversions.string2Date = function(sDate) {
	if (sDate)
		return new Date(sDate.substr(0, 4), parseInt(sDate.substr(4, 2), 10) - 1, sDate.substr(6, 2));
	return null;
};

AppScflTest.util.Conversions.formatDeliveryOverdue = function(sError, sDate) {
	if (sDate && sDate != "" && sDate != "00000000" && sError && sError != "") {
		var dDate = AppScflTest.util.Conversions.string2Date(sDate);
		var days = AppScflTest.util.Conversions.calDiffInDays(new Date(), dDate);
		if (days >= 0) {
			return AppScflTest.util.Conversions.getBundle().getText("XTIT_DeliveryOverdue", [ days ]);
		}
	}
	return "";
};

AppScflTest.util.Conversions.formatDeliveryOverdueIcon = function(sError) {
	if (sError && sError != "") {
		return "sap-icon://alert";
	}
	return "";
};

/* core.Icon Version of FollowUp */

AppScflTest.util.Conversions.getIconURI = function(sDocTypeName) {
	var sDocType = AppScflTest.util.Conversions.getDocType(sDocTypeName);
	if (sDocType == DOC_TYPE_INVOICE) {
		return sap.ui.core.IconPool.getIconURI("sales-order-item");
	} else if (sDocType == DOC_TYPE_GOODSRECEIPT) {
		return sap.ui.core.IconPool.getIconURI("receipt");
	}
	return sap.ui.core.IconPool.getIconURI("document");
};

AppScflTest.util.Conversions.formatDocumentName = function(sDocTypeName, sDocId, sDocYear) {
	if (sDocTypeName && sDocId)
		return sDocTypeName + " (" + sDocId + ")";
	return "";
};

AppScflTest.util.Conversions.isNotGoodsReceipt = function(sDocTypeName) {
	var sDocType = AppScflTest.util.Conversions.getDocType(sDocTypeName);
	return (sDocType != DOC_TYPE_GOODSRECEIPT);
};

AppScflTest.util.Conversions.getDocType = function(sDocType) {
	// is this the correct DOCType (language independant) !!!
	if (sDocType == "2" || sDocType == "3" || sDocType == "P"
	// remove if odata service is updated
	|| sDocType == "Invoice Receipt" || sDocType == "InvoiceReceipt" || sDocType == "Rechnungseingang") {
		return DOC_TYPE_INVOICE;
	} else if (sDocType == "1"
	// remove if odata service is updated
	|| sDocType == "GoodsReceipt" || sDocType == "Goods Receipt" || sDocType == "Wareneingang") {
		return DOC_TYPE_GOODSRECEIPT;
	}
	return DOC_TYPE_NONE;
};

// get diff between two dates in days!

AppScflTest.util.Conversions.calDiffInDays = function(dDate1, dDate2) {
	if (!(dDate1 instanceof Date))
		throw "parameter1: date object expected!";
	if (!(dDate2 instanceof Date))
		throw "parameter2: date object expected!";
	dDate1.setSeconds(0);
	dDate1.setMinutes(0);
	dDate1.setHours(0);
	dDate2.setSeconds(0);
	dDate2.setMinutes(0);
	dDate2.setHours(0);
	var time1 = dDate1.getTime();
	time1 /= 1000 * 60 * 60 * 24;
	var time2 = dDate2.getTime();
	time2 /= 1000 * 60 * 60 * 24;
	return parseInt(time1 - time2);
};

// other formatters

AppScflTest.util.Conversions.errorIcon = function(sErr1, sErr2) {
	if (sErr1 || sErr2)
		return "sap-icon://alert";
	return "";
};

AppScflTest.util.Conversions.plantIcon = function(sPlant) {
	if (sPlant && sPlant != "")
		return "sap-icon://factory";
	return "";
};

AppScflTest.util.Conversions.incoTermsFormatter = function(sIncoterm, sIncotermLocation, sIncotermDescription) {
	if (!sIncoterm)
		sIncoterm = "";
	if (!sIncotermDescription)
		sIncotermDescription = "";
	if (!sIncotermLocation)
		sIncotermLocation = "";

	var sResult = (sIncotermDescription != "") ? sIncotermDescription : sIncoterm;

	if (sIncotermLocation != '') {
		sResult += ', ' + sIncotermLocation;
	}
	return sResult;
};

AppScflTest.util.Conversions.formatItemCount = function(sCount) {
	if (sCount)
		if (sCount > 1 || sCount == 0) {
			return AppScflTest.util.Conversions.getBundle().getText("XTIT_Items", [ sCount ]);
		} else {
			return AppScflTest.util.Conversions.getBundle().getText("XTIT_Item", [ sCount ]);
		}
	return "";
};

AppScflTest.util.Conversions.concatString = function(string1, string2) {
	if (string1 && string2)
		return AppScflTest.util.Conversions.getBundle().getText(string1, [ string2 ]);
	return "";
};

AppScflTest.util.Conversions.genPager = function(string1, string2, string3) {
	if (string1 && string2 && string3)
		return AppScflTest.util.Conversions.getBundle().getText(string1, [ string2, string3 ]);
	return "";
};

AppScflTest.util.Conversions.concatDate = function(string1, string2) {
	if (string1 && string2)
		return AppScflTest.util.Conversions.getBundle().getText(string1, [ DateTimeFormatter.formatLongDate(string2) ]);
	return "";
};

// Account assignment formatters

AppScflTest.util.Conversions.accountAssignmentFormatter = function(percentage) {
	if (percentage && percentage != "")
		return percentage + "%";
	return "";
};

AppScflTest.util.Conversions.deliveryErrorIndicator = function(field) {
	return (field && field != "") ? "Error" : "None" ;
};

AppScflTest.util.Conversions.itemStatusState = function(field) {
	return (field && field != "") ? "Error" : "Success" ;
};

AppScflTest.util.Conversions.isVisible = function(field) {
	return !!(field && field != ""); // enforce data type boolean 
};

AppScflTest.util.Conversions.isEmpty = function(date, field1, field2) {
	if (date && date != "" && date != "00000000")
		return (field1 ? (field1 + " ") : "") + (field2 ? field2 : "");
	return "";
};

AppScflTest.util.Conversions.isEmptyValue = function(date, field1, field2) {
	if (date && date != "" && date != "00000000")
		return (field1 ? (AppScflTest.util.Conversions.formatNumber(field1) + " ") : "") + (field2 ? field2 : "");
	return "";
};
