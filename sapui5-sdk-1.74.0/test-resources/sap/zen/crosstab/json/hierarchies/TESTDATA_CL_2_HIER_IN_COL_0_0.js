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


sapzen.crosstab.test.jsonTestData.TESTDATA_CL_2_HIER_IN_COL_0_0 = {
		"control" : {
			"type" : "xtable",
			"id" : "CROSSTAB_1_ia_pt_a",
			"fixedcolheaders" : 4,
			"fixedrowheaders" : 1,
			"totaldatarows" : 20,
			"totaldatacols" : 96,
			"sentdatarows" : 20,
			"sentdatacols" : 30,
			"tilerows" : 50,
			"tilecols" : 30,
			"alwaysfill" : true,
			"pixelscrolling" : false,
			"onselectcommand" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
			"selectionenabled" : false,
			"scrollaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','SUPPRESS_VALIDATION',0]]],['BI_COMMAND',null,1,[['INDEX','__X__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_1',0],['BIAV','CROSSTAB_1_ia_pt',0],['TYPE','h',0]]]]);",
			"changed" : true,
			"texts" : {
				"rowtext" : "Row",
				"coltext" : "Column",
				"colwidthtext" : "Double click to adjust column width"
			},
			"rows" : [{
					"row" : {
						"rowidx" : "1",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_0_0",
									"colidx" : 1,
									"style" : "TITLE",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_0_1",
									"colspan" : 30,
									"colidx" : 2,
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK",
									"style" : "HEADER",
									"_v" : "0BC_AMT"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "2",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_0",
									"colidx" : 1,
									"style" : "TITLE",
									"_v" : "0BC_CUST"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_1",
									"rowspan" : 2,
									"colidx" : 2,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/SUMME",
									"isresult" : true,
									"style" : "TOTAL",
									"_v" : "Overall Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_2",
									"colspan" : 5,
									"colidx" : 3,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/WEST EUROPA",
									"style" : "HIERARCHY_LEVEL1",
									"_v" : "WEST EUROPA"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_7",
									"colspan" : 5,
									"colidx" : 8,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/FRANKREICH",
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "FRANKREICH"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_12",
									"colspan" : 5,
									"colidx" : 13,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000324",
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "324"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_17",
									"colspan" : 5,
									"colidx" : 18,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000052",
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "52"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_22",
									"colspan" : 3,
									"colidx" : 23,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000157",
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "157"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_25",
									"colspan" : 5,
									"colidx" : 26,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/DEUTSCHLAND",
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "DEUTSCHLAND"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_30",
									"colidx" : 31,
									"level" : 2,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/NORD DEUTSCHLAND",
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "NORD DEUTSCHLAND"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "3",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_0",
									"colidx" : 1,
									"style" : "TITLE",
									"_v" : "0BC_TYPE"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_2",
									"colidx" : 3,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/WEST EUROPA/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_3",
									"colidx" : 4,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/WEST EUROPA/CATEGORY",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "CATEGORY"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_4",
									"colidx" : 5,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/WEST EUROPA/GOOD",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "GOOD"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_5",
									"colidx" : 6,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','15',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/WEST EUROPA/MEDIUM_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','16',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "MEDIUM_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_6",
									"colidx" : 7,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','17',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/WEST EUROPA/BAD_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','18',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "BAD_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_7",
									"colidx" : 8,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','19',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/FRANKREICH/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','20',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_8",
									"colidx" : 9,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','21',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/FRANKREICH/CATEGORY",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','22',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "CATEGORY"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_9",
									"colidx" : 10,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','23',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/FRANKREICH/GOOD",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','24',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "GOOD"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_10",
									"colidx" : 11,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','25',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/FRANKREICH/MEDIUM_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','26',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "MEDIUM_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_11",
									"colidx" : 12,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','27',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/FRANKREICH/BAD_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','28',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "BAD_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_12",
									"colidx" : 13,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','29',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000324/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','30',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_13",
									"colidx" : 14,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','31',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000324/CATEGORY",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','32',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "CATEGORY"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_14",
									"colidx" : 15,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','33',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000324/GOOD",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','34',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "GOOD"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_15",
									"colidx" : 16,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','35',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000324/MEDIUM_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','36',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "MEDIUM_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_16",
									"colidx" : 17,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','37',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000324/BAD_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','38',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "BAD_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_17",
									"colidx" : 18,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','39',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000052/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','40',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_18",
									"colidx" : 19,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','41',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000052/CATEGORY",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','42',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "CATEGORY"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_19",
									"colidx" : 20,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','43',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000052/GOOD",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','44',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "GOOD"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_20",
									"colidx" : 21,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','45',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000052/MEDIUM_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','46',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "MEDIUM_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_21",
									"colidx" : 22,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','47',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000052/BAD_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','48',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "BAD_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_22",
									"colidx" : 23,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','49',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000157/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','50',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_23",
									"colidx" : 24,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','51',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000157/CATEGORY",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','52',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "CATEGORY"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_24",
									"colidx" : 25,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','53',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/000157/GOOD",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','54',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "GOOD"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_25",
									"colidx" : 26,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','55',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/DEUTSCHLAND/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','56',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_26",
									"colidx" : 27,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','57',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/DEUTSCHLAND/CATEGORY",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','58',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "CATEGORY"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_27",
									"colidx" : 28,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','59',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/DEUTSCHLAND/GOOD",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','60',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "GOOD"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_28",
									"colidx" : 29,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','61',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/DEUTSCHLAND/MEDIUM_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','62',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "MEDIUM_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_29",
									"colidx" : 30,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','63',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/DEUTSCHLAND/BAD_1",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','64',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "BAD_1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_30",
									"colidx" : 31,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','65',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "0FJY9KQ7405CNMIKILIWMJDBK/NORD DEUTSCHLAND/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','66',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "4",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_0",
									"colidx" : 1,
									"style" : "TITLE",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','67',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "0BC_FIELD"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "DM"
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
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_5",
									"colidx" : 6,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_6",
									"colidx" : 7,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_8",
									"colidx" : 9,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_9",
									"colidx" : 10,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_10",
									"colidx" : 11,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_11",
									"colidx" : 12,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_13",
									"colidx" : 14,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_14",
									"colidx" : 15,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_15",
									"colidx" : 16,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_16",
									"colidx" : 17,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_18",
									"colidx" : 19,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_19",
									"colidx" : 20,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_20",
									"colidx" : 21,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_21",
									"colidx" : 22,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_23",
									"colidx" : 24,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_24",
									"colidx" : 25,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_26",
									"colidx" : 27,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_27",
									"colidx" : 28,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_28",
									"colidx" : 29,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_29",
									"colidx" : 30,
									"style" : "HEADER",
									"_v" : "DM"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : "DM"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "5",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_0",
									"colidx" : 1,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','68',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"_v" : "Overall Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "28,315.26"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "28,315.26"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_3",
									"colidx" : 4,
									"style" : "TOTAL",
									"_v" : "28,315.26"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_4",
									"colidx" : 5,
									"style" : "TOTAL",
									"_v" : "26,633.76"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_5",
									"colidx" : 6,
									"style" : "TOTAL",
									"_v" : "1,457.30"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_6",
									"colidx" : 7,
									"style" : "TOTAL",
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "11,433.70"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_8",
									"colidx" : 9,
									"style" : "TOTAL",
									"_v" : "11,433.70"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_9",
									"colidx" : 10,
									"style" : "TOTAL",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_10",
									"colidx" : 11,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_11",
									"colidx" : 12,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "4,607.11"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_13",
									"colidx" : 14,
									"style" : "TOTAL",
									"_v" : "4,607.11"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_14",
									"colidx" : 15,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_15",
									"colidx" : 16,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_16",
									"colidx" : 17,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "4,607.11"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_18",
									"colidx" : 19,
									"style" : "TOTAL",
									"_v" : "4,607.11"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_19",
									"colidx" : 20,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_20",
									"colidx" : 21,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_21",
									"colidx" : 22,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_23",
									"colidx" : 24,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_24",
									"colidx" : 25,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "16,881.56"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_26",
									"colidx" : 27,
									"style" : "TOTAL",
									"_v" : "16,881.56"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_27",
									"colidx" : 28,
									"style" : "TOTAL",
									"_v" : "15,536.36"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_28",
									"colidx" : 29,
									"style" : "TOTAL",
									"_v" : "1,289.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_29",
									"colidx" : 30,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "6",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_0",
									"colidx" : 1,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','69',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "DE BAY004",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"_v" : "DE/BAY/4"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "15,536.36"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "15,536.36"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "15,536.36"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : "15,536.36"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "7",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','70',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "DE BAY004",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "DE/BAY/4"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "4,438.96"
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
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_4",
									"colidx" : 5,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_5",
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_8",
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_9",
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_13",
									"colidx" : 14,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_14",
									"colidx" : 15,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_18",
									"colidx" : 19,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_19",
									"colidx" : 20,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_26",
									"colidx" : 27,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_27",
									"colidx" : 28,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_28",
									"colidx" : 29,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "8",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','71',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "DE BAY005",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "DE/BAY/5"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "9",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','72',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "DE BAY006",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "DE/BAY/6"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "6,658.44"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "6,658.44"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_3",
									"colidx" : 4,
									"_v" : "6,658.44"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_4",
									"colidx" : 5,
									"_v" : "6,658.44"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_5",
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_8",
									"colidx" : 9,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_9",
									"colidx" : 10,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_13",
									"colidx" : 14,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_14",
									"colidx" : 15,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_18",
									"colidx" : 19,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_19",
									"colidx" : 20,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_26",
									"colidx" : 27,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_27",
									"colidx" : 28,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_28",
									"colidx" : 29,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "10",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_0",
									"colidx" : 1,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','73',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "DE BAW001",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"_v" : "DE/BAW/1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : "11,097.40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "6,658.44"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : "6,658.44"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : "6,658.44"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "11",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','74',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "DE BAW001",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "DE/BAW/1"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_3",
									"colidx" : 4,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_4",
									"colidx" : 5,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_5",
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_8",
									"colidx" : 9,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_9",
									"colidx" : 10,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_13",
									"colidx" : 14,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_14",
									"colidx" : 15,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_18",
									"colidx" : 19,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_19",
									"colidx" : 20,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_23",
									"colidx" : 24,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_24",
									"colidx" : 25,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_26",
									"colidx" : 27,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_27",
									"colidx" : 28,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_28",
									"colidx" : 29,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "12",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','75',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "DE BAW002",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "DE/BAW/2"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "13",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','76',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "DE BAW003",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "DE/BAW/3"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_3",
									"colidx" : 4,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_4",
									"colidx" : 5,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_5",
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_8",
									"colidx" : 9,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_9",
									"colidx" : 10,
									"_v" : "4,438.96"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_13",
									"colidx" : 14,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_14",
									"colidx" : 15,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_18",
									"colidx" : 19,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_19",
									"colidx" : 20,
									"_v" : "2,219.48"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_26",
									"colidx" : 27,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_27",
									"colidx" : 28,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_28",
									"colidx" : 29,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "14",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_0",
									"colidx" : 1,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','77',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "AUSNRD031",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"_v" : "AUS/NRD/31"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "1,681.50"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "1,681.50"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "1,681.50"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : "1,457.30"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "336.30"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : "336.30"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "1,345.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "1,345.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : "1,289.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "15",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','78',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD031",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/31"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_3",
									"colidx" : 4,
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_4",
									"colidx" : 5,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_5",
									"colidx" : 6,
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_8",
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_9",
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_13",
									"colidx" : 14,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_14",
									"colidx" : 15,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_18",
									"colidx" : 19,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_19",
									"colidx" : 20,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_26",
									"colidx" : 27,
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_27",
									"colidx" : 28,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_28",
									"colidx" : 29,
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "16",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','79',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD032",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/32"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "17",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','80',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD033",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/33"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_3",
									"colidx" : 4,
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_4",
									"colidx" : 5,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_5",
									"colidx" : 6,
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_8",
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_9",
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_13",
									"colidx" : 14,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_14",
									"colidx" : 15,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_18",
									"colidx" : 19,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_19",
									"colidx" : 20,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_26",
									"colidx" : 27,
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_27",
									"colidx" : 28,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_28",
									"colidx" : 29,
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "18",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','81',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD034",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/34"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "19",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','82',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD035",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/35"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_3",
									"colidx" : 4,
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_4",
									"colidx" : 5,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_5",
									"colidx" : 6,
									"_v" : "280.25"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_8",
									"colidx" : 9,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_9",
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_10",
									"colidx" : 11,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_13",
									"colidx" : 14,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_14",
									"colidx" : 15,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_18",
									"colidx" : 19,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_19",
									"colidx" : 20,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_20",
									"colidx" : 21,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_26",
									"colidx" : 27,
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_27",
									"colidx" : 28,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_28",
									"colidx" : 29,
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "20",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','83',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD036",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/36"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "21",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','84',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD037",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/37"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_3",
									"colidx" : 4,
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_4",
									"colidx" : 5,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_5",
									"colidx" : 6,
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_8",
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_9",
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_13",
									"colidx" : 14,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_14",
									"colidx" : 15,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_18",
									"colidx" : 19,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_19",
									"colidx" : 20,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_26",
									"colidx" : 27,
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_27",
									"colidx" : 28,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_28",
									"colidx" : 29,
									"_v" : "224.20"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "22",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','85',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD038",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/38"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "23",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','86',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD039",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/39"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_3",
									"colidx" : 4,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_4",
									"colidx" : 5,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_5",
									"colidx" : 6,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_6",
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_8",
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_9",
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_11",
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_13",
									"colidx" : 14,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_14",
									"colidx" : 15,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_15",
									"colidx" : 16,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_16",
									"colidx" : 17,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_18",
									"colidx" : 19,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_19",
									"colidx" : 20,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_20",
									"colidx" : 21,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_21",
									"colidx" : 22,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_24",
									"colidx" : 25,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_26",
									"colidx" : 27,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_27",
									"colidx" : 28,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_28",
									"colidx" : 29,
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_29",
									"colidx" : 30,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "24",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','87',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "AUSNRD040",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "AUS/NRD/40"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_1",
									"colidx" : 2,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_2",
									"colidx" : 3,
									"style" : "TOTAL",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_3",
									"colidx" : 4,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : "168.15"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : "112.10"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_16",
									"colidx" : 17,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : "56.05"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_29",
									"colidx" : 30,
									"style" : "ALTERNATING",
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_30",
									"colidx" : 31,
									"style" : "TOTAL",
									"_v" : ""
								}
							}
						]
					}
				}
			]
		}

};