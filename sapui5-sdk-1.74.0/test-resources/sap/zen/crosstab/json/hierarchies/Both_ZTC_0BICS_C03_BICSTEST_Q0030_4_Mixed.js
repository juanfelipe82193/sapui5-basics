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

sapzen.crosstab.test.jsonTestData.Both_ZTC_0BICS_C03_BICSTEST_Q0030_4_Mixed = {
	"control" : {
		"type" : "xtable",
		"id" : "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders" : 3,
		"fixedrowheaders" : 2,
		"totaldatarows" : 114,
		"totaldatacols" : 10,
		"sentdatarows" : 50,
		"sentdatacols" : 10,
		"tilerows" : 50,
		"tilecols" : 30,
		"scrollaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','SUPPRESS_VALIDATION',0]]],['BI_COMMAND',null,1,[['INDEX','__Y__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_1',0],['BIAV','CROSSTAB_1_ia_pt',0],['TYPE','v',0]]]]);",
		"changed" : true,
		"rows" : [
				{
					"row" : {
						"rowidx" : "1",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_0",
								"rowspan" : 2,
								"colidx" : 1,
								"style" : "TITLE"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_1",
								"colidx" : 2,
								"style" : "TITLE",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_2",
								"colspan" : 5,
								"colidx" : 3,
								"key" : "EQ4OA2631Z8NQ6YINO0RB60Q8",
								"style" : "HEADER",
								"_v" : "0BC_AMT"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_7",
								"colspan" : 5,
								"colidx" : 8,
								"key" : "ES9EFE4OFCZBVD52VBQA5HNW0",
								"style" : "HEADER",
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
										"id" : "CROSSTAB_1_ia_pt_1_1",
										"colidx" : 2,
										"style" : "TITLE",
										"_v" : "0BC_TYPE"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_2",
										"colidx" : 3,
										"level" : 0,
										"drillstate" : "L",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "EQ4OA2631Z8NQ6YINO0RB60Q8/SUMME",
										"style" : "TOTAL",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Overall Result"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_3",
										"colidx" : 4,
										"level" : 0,
										"drillstate" : "O",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "EQ4OA2631Z8NQ6YINO0RB60Q8/CATEGORY",
										"style" : "HIERARCHY_LEVEL1",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "CATEGORY"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_4",
										"colidx" : 5,
										"level" : 1,
										"drillstate" : "C",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "EQ4OA2631Z8NQ6YINO0RB60Q8/GOOD",
										"style" : "HIERARCHY_LEVEL2",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "GOOD"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_5",
										"colidx" : 6,
										"level" : 1,
										"drillstate" : "C",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "EQ4OA2631Z8NQ6YINO0RB60Q8/MEDIUM_1",
										"style" : "HIERARCHY_LEVEL2",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "MEDIUM_1"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_6",
										"colidx" : 7,
										"level" : 1,
										"drillstate" : "C",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "EQ4OA2631Z8NQ6YINO0RB60Q8/BAD_1",
										"style" : "HIERARCHY_LEVEL2",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "BAD_1"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_7",
										"colidx" : 8,
										"level" : 0,
										"drillstate" : "L",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "ES9EFE4OFCZBVD52VBQA5HNW0/SUMME",
										"style" : "TOTAL",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Overall Result"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_8",
										"colidx" : 9,
										"level" : 0,
										"drillstate" : "O",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "ES9EFE4OFCZBVD52VBQA5HNW0/CATEGORY",
										"style" : "HIERARCHY_LEVEL1",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "CATEGORY"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_9",
										"colidx" : 10,
										"level" : 1,
										"drillstate" : "C",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "ES9EFE4OFCZBVD52VBQA5HNW0/GOOD",
										"style" : "HIERARCHY_LEVEL2",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "GOOD"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_10",
										"colidx" : 11,
										"level" : 1,
										"drillstate" : "C",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "ES9EFE4OFCZBVD52VBQA5HNW0/MEDIUM_1",
										"style" : "HIERARCHY_LEVEL2",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "MEDIUM_1"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_11",
										"colidx" : 12,
										"level" : 1,
										"drillstate" : "C",
										"hierarchyaction" : "xxxxxxxxxxxxxxx",
										"key" : "ES9EFE4OFCZBVD52VBQA5HNW0/BAD_1",
										"style" : "HIERARCHY_LEVEL2",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "BAD_1"
									}
								} ]
					}
				},
				{
					"row" : {
						"rowidx" : "3",
						"cells" : [
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_0",
										"colidx" : 1,
										"style" : "TITLE",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "0BC_CUST"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_1",
										"colidx" : 2,
										"style" : "TITLE",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "0BC_FIELD"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_2",
										"colidx" : 3,
										"style" : "TOTAL",
										"_v" : "DM"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_3",
										"colidx" : 4,
										"style" : "HEADER",
										"_v" : "DM"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_4",
										"colidx" : 5,
										"style" : "HEADER",
										"_v" : "DM"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_5",
										"colidx" : 6,
										"style" : "HEADER",
										"_v" : "DM"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_6",
										"colidx" : 7,
										"style" : "HEADER",
										"_v" : "DM"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_7",
										"colidx" : 8,
										"style" : "TOTAL",
										"_v" : ""
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_8",
										"colidx" : 9,
										"style" : "HEADER",
										"_v" : ""
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_9",
										"colidx" : 10,
										"style" : "HEADER",
										"_v" : ""
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_10",
										"colidx" : 11,
										"style" : "HEADER",
										"_v" : ""
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_11",
										"colidx" : 12,
										"style" : "HEADER",
										"_v" : ""
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
								"rowspan" : 20,
								"colidx" : 1,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "WEST EUROPA"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/SUMME",
								"style" : "TOTAL",
								"_v" : "Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "28,315.26"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "28,315.26"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "26,633.76"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "1,457.30"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "42.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_8",
								"colidx" : 9,
								"style" : "TOTAL",
								"_v" : "42.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_9",
								"colidx" : 10,
								"style" : "TOTAL",
								"_v" : "12.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_10",
								"colidx" : 11,
								"style" : "TOTAL",
								"_v" : "26.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_11",
								"colidx" : 12,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "5",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAY004",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAY/4"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "15,536.36"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "15,536.36"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "15,536.36"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "7.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "7.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "7.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "6",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAY004",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAY/4"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_3",
								"colidx" : 4,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_4",
								"colidx" : 5,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_8",
								"colidx" : 9,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_9",
								"colidx" : 10,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "7",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAY005",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAY/5"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "8",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAY006",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAY/6"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "6,658.44"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_3",
								"colidx" : 4,
								"_v" : "6,658.44"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_4",
								"colidx" : 5,
								"_v" : "6,658.44"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_8",
								"colidx" : 9,
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_9",
								"colidx" : 10,
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "9",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAW001",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "11,097.40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "11,097.40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "11,097.40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "10",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAW001",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_3",
								"colidx" : 4,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_4",
								"colidx" : 5,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_8",
								"colidx" : 9,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_9",
								"colidx" : 10,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "11",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAW002",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/2"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "12",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/DE BAW003",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/3"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_3",
								"colidx" : 4,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_4",
								"colidx" : 5,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_8",
								"colidx" : 9,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_9",
								"colidx" : 10,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "13",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD031",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "AUS/NRD/31"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "1,681.50"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "1,681.50"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "1,457.30"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "30.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "30.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "26.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : "5.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "14",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD031",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/31"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_3",
								"colidx" : 4,
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_5",
								"colidx" : 6,
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_8",
								"colidx" : 9,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_10",
								"colidx" : 11,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "15",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD032",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/32"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "16",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD033",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/33"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_3",
								"colidx" : 4,
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_5",
								"colidx" : 6,
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_8",
								"colidx" : 9,
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_10",
								"colidx" : 11,
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_15_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "17",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD034",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/34"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "224.20"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "224.20"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : "224.20"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "4.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "4.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_16_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : "4.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "18",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD035",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/35"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_3",
								"colidx" : 4,
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_5",
								"colidx" : 6,
								"_v" : "280.25"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_8",
								"colidx" : 9,
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_10",
								"colidx" : 11,
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_17_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "19",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD036",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/36"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_18_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "20",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD037",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/37"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "224.20"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_3",
								"colidx" : 4,
								"_v" : "224.20"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_5",
								"colidx" : 6,
								"_v" : "224.20"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "4.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_8",
								"colidx" : 9,
								"_v" : "4.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_10",
								"colidx" : 11,
								"_v" : "4.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_19_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "21",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD038",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/38"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_20_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "22",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD039",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/39"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_3",
								"colidx" : 4,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_5",
								"colidx" : 6,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_10",
								"colidx" : 11,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_21_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "23",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "WEST EUROPA/AUSNRD040",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_22_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "24",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_0",
								"rowspan" : 10,
								"colidx" : 1,
								"level" : 1,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "FRANKREICH"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/SUMME",
								"style" : "TOTAL",
								"_v" : "Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "11,433.70"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "11,433.70"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "11,097.40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "11.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_8",
								"colidx" : 9,
								"style" : "TOTAL",
								"_v" : "11.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_9",
								"colidx" : 10,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_10",
								"colidx" : 11,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_23_11",
								"colidx" : 12,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "25",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/DE BAY004",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAY/4"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_24_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "26",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/DE BAY006",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAY/6"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_3",
								"colidx" : 4,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_4",
								"colidx" : 5,
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_8",
								"colidx" : 9,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_9",
								"colidx" : 10,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_25_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "27",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/DE BAW001",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "6,658.44"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "6,658.44"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "6,658.44"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_26_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "28",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/DE BAW001",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_3",
								"colidx" : 4,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_4",
								"colidx" : 5,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_9",
								"colidx" : 10,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_27_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "29",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/DE BAW003",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/3"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_28_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "30",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/AUSNRD031",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "AUS/NRD/31"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "336.30"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_3",
								"colidx" : 4,
								"_v" : "336.30"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_5",
								"colidx" : 6,
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_6",
								"colidx" : 7,
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "6.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_8",
								"colidx" : 9,
								"_v" : "6.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_10",
								"colidx" : 11,
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_29_11",
								"colidx" : 12,
								"_v" : "3.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "31",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/AUSNRD034",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/34"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_30_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "32",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/AUSNRD035",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/35"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_3",
								"colidx" : 4,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_5",
								"colidx" : 6,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_10",
								"colidx" : 11,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_31_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "33",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "FRANKREICH/AUSNRD040",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_32_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "34",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_0",
								"rowspan" : 8,
								"colidx" : 1,
								"level" : 2,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324",
								"style" : "HIERARCHY_LEVEL3",
								"_v" : "324"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/SUMME",
								"style" : "TOTAL",
								"_v" : "Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,607.11"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "4,607.11"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_8",
								"colidx" : 9,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_9",
								"colidx" : 10,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_10",
								"colidx" : 11,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_33_11",
								"colidx" : 12,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "35",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/DE BAY004",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAY/4"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_34_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "36",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/DE BAY006",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAY/6"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_3",
								"colidx" : 4,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_4",
								"colidx" : 5,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_9",
								"colidx" : 10,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_35_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "37",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/DE BAW001",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_36_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "38",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/DE BAW003",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/3"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_3",
								"colidx" : 4,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_4",
								"colidx" : 5,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_9",
								"colidx" : 10,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_37_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "39",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/AUSNRD031",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "AUS/NRD/31"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_38_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "40",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/AUSNRD034",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/34"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_3",
								"colidx" : 4,
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_6",
								"colidx" : 7,
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_8",
								"colidx" : 9,
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_39_11",
								"colidx" : 12,
								"_v" : "2.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "41",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000324/AUSNRD040",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_40_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "42",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_0",
								"rowspan" : 9,
								"colidx" : 1,
								"level" : 2,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052",
								"style" : "HIERARCHY_LEVEL3",
								"_v" : "52"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/SUMME",
								"style" : "TOTAL",
								"_v" : "Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "4,607.11"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "4,607.11"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "4,438.96"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_8",
								"colidx" : 9,
								"style" : "TOTAL",
								"_v" : "5.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_9",
								"colidx" : 10,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_10",
								"colidx" : 11,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_41_11",
								"colidx" : 12,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "43",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/DE BAY004",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAY/4"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_42_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "44",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/DE BAY006",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAY/6"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_3",
								"colidx" : 4,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_4",
								"colidx" : 5,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_9",
								"colidx" : 10,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_43_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "45",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/DE BAW001",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_44_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "46",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/DE BAW003",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/3"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_3",
								"colidx" : 4,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_4",
								"colidx" : 5,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_9",
								"colidx" : 10,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_45_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "47",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/AUSNRD031",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "AUS/NRD/31"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "168.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "3.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "2.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_46_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "48",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/AUSNRD034",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/34"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_3",
								"colidx" : 4,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_6",
								"colidx" : 7,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_47_11",
								"colidx" : 12,
								"_v" : "1.000"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "49",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/AUSNRD035",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/35"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_48_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "50",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000052/AUSNRD040",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "AUS/NRD/40"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_3",
								"colidx" : 4,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_5",
								"colidx" : 6,
								"_v" : "56.05"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_9",
								"colidx" : 10,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_10",
								"colidx" : 11,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_49_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "51",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_0",
								"rowspan" : 2,
								"colidx" : 1,
								"level" : 2,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000157",
								"style" : "HIERARCHY_LEVEL3",
								"_v" : "157"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000157/DE BAW001",
								"style" : "HIERARCHY_LEVEL1",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_5",
								"colidx" : 6,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_6",
								"colidx" : 7,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_8",
								"colidx" : 9,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_9",
								"colidx" : 10,
								"style" : "ALTERNATING",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_10",
								"colidx" : 11,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_50_11",
								"colidx" : 12,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "52",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_1",
								"colidx" : 2,
								"level" : 1,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "000157/DE BAW001",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DE/BAW/1"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_3",
								"colidx" : 4,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_4",
								"colidx" : 5,
								"_v" : "2,219.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_5",
								"colidx" : 6,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_6",
								"colidx" : 7,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_8",
								"colidx" : 9,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_9",
								"colidx" : 10,
								"_v" : "1.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_10",
								"colidx" : 11,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_51_11",
								"colidx" : 12,
								"_v" : ""
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "53",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_0",
								"colidx" : 1,
								"level" : 1,
								"drillstate" : "O",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "DEUTSCHLAND",
								"style" : "HIERARCHY_LEVEL2",
								"_v" : "DEUTSCHLAND"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_1",
								"colidx" : 2,
								"level" : 0,
								"drillstate" : "L",
								"hierarchyaction" : "xxxxxxxxxxxxxxx",
								"key" : "DEUTSCHLAND/SUMME",
								"style" : "TOTAL",
								"_v" : "Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "16,881.56"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "16,881.56"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "15,536.36"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "1,289.15"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "112.10"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "31.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_8",
								"colidx" : 9,
								"style" : "TOTAL",
								"_v" : "31.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_9",
								"colidx" : 10,
								"style" : "TOTAL",
								"_v" : "7.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_10",
								"colidx" : 11,
								"style" : "TOTAL",
								"_v" : "23.000"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_52_11",
								"colidx" : 12,
								"style" : "TOTAL",
								"_v" : "2.000"
							}
						} ]
					}
				} ]
	}
}