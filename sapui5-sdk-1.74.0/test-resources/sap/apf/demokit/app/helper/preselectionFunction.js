jQuery.sap.declare('sap.apf.demokit.app.helper.preselectionFunction');
sap.apf.demokit.app.helper.preselectionFunction = (function() {
	var fromDate;
	var toDate;
	var date = new Date();
	var preselectedFromDate = function() {
		var fromDateArr = [];
		var lastYear = (date.getFullYear() - 1).toString();
		var currentMonth = (date.getMonth() + 1).toString();
		if (currentMonth / 10 < 1) {
			fromDate = lastYear + "0" + currentMonth + "01";
		} else {
			fromDate = lastYear + currentMonth + "01";
		}
		fromDateArr.push(fromDate);
		return fromDateArr;
	};
	var preselectedToDate = function() {
		var toDateArr = [];
		var currentYear = date.getFullYear().toString();
		var month = date.getMonth();
		var day = (daysInMonth(month, currentYear)).toString();
		var currentMonth = (date.getMonth() + 1).toString();
		if (currentMonth / 10 < 1) {
			toDate = currentYear + "0" + currentMonth + day;
		} else {
			toDate = currentYear + currentMonth + day;
		}
		toDateArr.push(toDate);
		return toDateArr;
	};
	var daysInMonth = function(month, year) {
		var noOfDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
		if (month !== 1) {//All months except for february
			return noOfDays[month];
		} else if (year % 4 === 0 && (year % 400 === 0 || year % 100 !== 0)) { //leap year check
			return noOfDays[1] + 1;
		}
		return noOfDays[1];
	};
	return {
		preselectedFromDate : preselectedFromDate,
		preselectedToDate : preselectedToDate
	};
})();