if (!sapzen) {
	var sapzen = {};
}

if (!sapzen.crosstab) {
	sapzen.crosstab = {};
}

if (!sapzen.crosstab.test) {
	sapzen.crosstab.test = {};
}

if (!sapzen.crosstab.test.jsonTestData) {
	sapzen.crosstab.test.jsonTestData = {};
}

sapzen.crosstab.test.jsonTestData.CsnQuery = {

	"control" : {
		"type" : "xtable",
		"id" : "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders" : 1,
		"fixedrowheaders" : 4,
		"totaldatarows" : 6,
		"totaldatacols" : 1,
		"sentdatarows" : 6,
		"sentdatacols" : 1,
		"tilerows" : 10000,
		"tilecols" : 10000,
		"changed" : true,
		"rows" : [
				{
					"row" : {
						"rowidx" : "1",
						"cells" : [
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_0_0",
										"colspan" : 2,
										"colidx" : 1,
										"style" : "TITLE",
										"sort" : "ASC",
										"sortalternativetext" : "Ascending",
										"sorttooltip" : "Sort in Descending Order",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "0BC_COUN"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_0_2",
										"colidx" : 3,
										"style" : "TITLE",
										"_v" : ""
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_0_3",
										"colidx" : 4,
										"style" : "TITLE"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_0_4",
										"colidx" : 5
									}
								} ]
					}
				}, {
					"row" : {
						"rowidx" : "2",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_1_0",
								"rowspan" : 2,
								"colidx" : 1,
								"key" : "AUS",
								"style" : "HEADER",
								"_v" : "AUS"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_1_1",
								"rowspan" : 2,
								"colidx" : 2,
								"key" : "AUS",
								"style" : "HEADER",
								"_v" : "Australia"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_1_2",
								"colidx" : 3,
								"key" : "AUS/4MKVY5TXRB74XCMWDZLJNORGF",
								"style" : "HEADER",
								"_v" : "0BC_AMT"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_1_3",
								"colidx" : 4,
								"style" : "HEADER",
								"_v" : "DM"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_1_4",
								"colidx" : 5,
								"_v" : "49,996.60"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "3",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_2_2",
								"colidx" : 3,
								"key" : "AUS/4MKVY61MA9SUFZ6CJTNVXQQ67",
								"style" : "HEADER",
								"_v" : "0BC_DATE"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_2_3",
								"colidx" : 4,
								"style" : "HEADER",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_2_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "17,831,900,637"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "4",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_0",
								"rowspan" : 2,
								"colidx" : 1,
								"key" : "DE",
								"style" : "HEADER",
								"_v" : "DE"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_1",
								"rowspan" : 2,
								"colidx" : 2,
								"key" : "DE",
								"style" : "HEADER",
								"_v" : "Germany"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_2",
								"colidx" : 3,
								"key" : "DE/4MKVY5TXRB74XCMWDZLJNORGF",
								"style" : "HEADER",
								"_v" : "0BC_AMT"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_3",
								"colidx" : 4,
								"style" : "HEADER",
								"_v" : "DM"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_4",
								"colidx" : 5,
								"_v" : "3,599,999.08"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "5",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_2",
								"colidx" : 3,
								"key" : "DE/4MKVY61MA9SUFZ6CJTNVXQQ67",
								"style" : "HEADER",
								"_v" : "0BC_DATE"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_3",
								"colidx" : 4,
								"style" : "HEADER",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "19,610,773,370"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "6",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_0",
								"rowspan" : 2,
								"colspan" : 2,
								"colidx" : 1,
								"key" : "SUMME",
								"style" : "TOTAL",
								"_v" : "Overall Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_2",
								"colidx" : 3,
								"key" : "SUMME/4MKVY5TXRB74XCMWDZLJNORGF",
								"style" : "TOTAL",
								"_v" : "0BC_AMT"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "DM"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "3,649,995.68"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "7",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_2",
								"colidx" : 3,
								"key" : "SUMME/4MKVY61MA9SUFZ6CJTNVXQQ67",
								"style" : "TOTAL",
								"_v" : "0BC_DATE"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "37,442,674,007"
							}
						} ]
					}
				} ]
	}
};