sap.ui.define([], function() {
	return function(prefix, viewName, viewNamespace) {
		return {
			theFilterIsFilled: function(sFilter, sValue) {
				return this.waitFor({
					id: prefix + "listReportFilter",
					success: function(oSFB) {
						QUnit.equal(oSFB.getFilters([sFilter])[0].aFilters[0].oValue1, sValue,
						"The SmartFilterBar is filled according to the parameter");
					}
				});
			}
		};
	};
});
