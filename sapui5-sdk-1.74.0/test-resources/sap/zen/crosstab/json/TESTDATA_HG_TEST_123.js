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

sapzen.crosstab.test.jsonTestData.HG_TEST_123 = {

	"control" : {
		"type" : "xtable",
		"id" : "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders" : 2,
		"fixedrowheaders" : 0,
		"totaldatarows" : 3,
		"totaldatacols" : 2,
		"sentdatarows" : 3,
		"sentdatacols" : 2,
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
										"colidx" : 1,
										"key" : "4MKPJCSV8YIQU4S9RVKC18FZZ",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "0BC_AMT"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_0_1",
										"colidx" : 2,
										"key" : "4MKPJD0JRX4GCRBPXPMOBAEPR",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "0BC_DATE"
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
								"colidx" : 1,
								"style" : "HEADER",
								"_v" : "DM"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_1_1",
								"colidx" : 2,
								"style" : "HEADER",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "3",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_2_0",
								"colidx" : 1,
								"_v" : "49,996.60"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_2_1",
								"colidx" : 2,
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
								"colidx" : 1,
								"style" : "ALTERNATING",
								"_v" : "3,599,999.08"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_1",
								"colidx" : 2,
								"style" : "ALTERNATING",
								"_v" : "19,610,773,370"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "5",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_0",
								"colidx" : 1,
								"style" : "TOTAL",
								"_v" : "3,649,995.68"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_1",
								"colidx" : 2,
								"style" : "TOTAL",
								"_v" : "37,442,674,007"
							}
						} ]
					}
				} ]
	}
};