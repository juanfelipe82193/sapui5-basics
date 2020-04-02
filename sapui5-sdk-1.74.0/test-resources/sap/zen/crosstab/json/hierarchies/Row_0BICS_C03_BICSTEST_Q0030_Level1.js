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

sapzen.crosstab.test.jsonTestData.Row_0BICS_C03_BICSTEST_Q0030_Level1 = {
	"control" : {
		"type" : "xtable",
		"id" : "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders" : 2,
		"fixedrowheaders" : 1,
		"totaldatarows" : 4,
		"totaldatacols" : 2,
		"sentdatarows" : 4,
		"sentdatacols" : 2,
		"tilerows" : 50,
		"tilecols" : 30,
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
										"style" : "TITLE",
										"_v" : ""
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_0_1",
										"colidx" : 2,
										"key" : "4FLKI5VFZY9HG0NL73HYMKKT3",
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
										"id" : "CROSSTAB_1_ia_pt_0_2",
										"colidx" : 3,
										"key" : "4FLKI634IWV6YN71CXKAWMJIV",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "0BC_ZHL"
									}
								} ]
					}
				},
				{
					"row" : {
						"rowidx" : "2",
						"cells" : [
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_0",
										"colidx" : 1,
										"style" : "TITLE",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "0BC_TYPE"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_1",
										"colidx" : 2,
										"style" : "HEADER",
										"_v" : "DM"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_2",
										"colidx" : 3,
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
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "CATEGORY",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "CATEGORY"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_2_1",
								"colidx" : 2,
								"_v" : "57,168.50"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_2_2",
								"colidx" : 3,
								"_v" : "55.000"
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
								"level" : 1,
								"drillstate" : "C",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "GOOD",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "GOOD"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_1",
								"colidx" : 2,
								"style" : "ALTERNATING",
								"_v" : "55,487.00"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : "25.000"
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
								"level" : 1,
								"drillstate" : "C",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "MEDIUM_1",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "MEDIUM_1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_1",
								"colidx" : 2,
								"_v" : "1,457.30"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_2",
								"colidx" : 3,
								"_v" : "26.000"
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
								"colidx" : 1,
								"level" : 1,
								"drillstate" : "C",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "BAD_1",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "BAD_1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_1",
								"colidx" : 2,
								"style" : "ALTERNATING",
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : "5.000"
							}
						} ]
					}
				} ]
	}

};