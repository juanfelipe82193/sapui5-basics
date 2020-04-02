/* eslint-disable */
var oVBI1 = new sap.ui.vbm.VBI("vizBizMap", {
	width: "100%",
	height: "100%"
});

var ovizBizMapFacet = new sap.suite.ui.commons.FacetOverview("vizBiz-facet", {
	title: "Relevant Addresses",
	content: oVBI1,
	heightType: "L",
	press: function() {
		var oVBIDetail = new sap.ui.vbm.VBI("vizBizDetailMap", {
			width: "100%",
			height: "100%"
		});

		$.getJSON("UnifiedThingInspector/main2.json", function(dat) {
			oVBIDetail.load(dat);
		});

		var oMapPage = new sap.m.Page({
			title: "Article",
			enableScrolling: false,
			showNavButton: true,
			content: oVBIDetail
		});

		oUTI.navigateToPage(oMapPage, false);
	}
});

var dat = $.getJSON("UnifiedThingInspector/main.json", function(dat) {
	oVBI1.load(dat);
});
