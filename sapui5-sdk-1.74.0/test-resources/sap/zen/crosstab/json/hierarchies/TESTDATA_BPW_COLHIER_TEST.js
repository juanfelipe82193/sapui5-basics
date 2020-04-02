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

sapzen.crosstab.test.jsonTestData.TESTDATA_BPW_COLHIER_TEST = {
		"control" : {
			"type" : "xtable",
			"id" : "CROSSTAB_1_ia_pt_a",
			"fixedcolheaders" : 4,
			"fixedrowheaders" : 3,
			"totaldatarows" : 5,
			"totaldatacols" : 27,
			"sentdatarows" : 5,
			"sentdatacols" : 27,
			"tilerows" : 50,
			"tilecols" : 30,
			"displaymode" : "DEFINED_SIZE",
			"pixelscrolling" : false,
			"onselectcommand" : "sap.zen.request.zenSendCommandSequenceArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
			"selectionenabled" : false,
			"changed" : true,
			"texts" : {
				"rowtext" : "Row",
				"coltext" : "Column",
				"colwidthtext" : "Double Click to adjust Column Width"
			},
			"rows" : [{
					"row" : {
						"rowidx" : "1",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_0_0",
									"rowspan" : 3,
									"colspan" : 2,
									"colidx" : 1,
									"style" : "TITLE"
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
									"colspan" : 27,
									"colidx" : 4,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240",
									"style" : "HEADER",
									"_v" : "Lost Deals"
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
									"id" : "CROSSTAB_1_ia_pt_1_2",
									"colidx" : 3,
									"style" : "TITLE",
									"_v" : "InfoProvider"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_3",
									"rowspan" : 2,
									"colidx" : 4,
									"level" : 0,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/SUMME",
									"isresult" : true,
									"style" : "TOTAL",
									"_v" : "Overall Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_4",
									"colspan" : 13,
									"colidx" : 5,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB",
									"style" : "HIERARCHY_LEVEL1",
									"_v" : "0D_SAP_DEMOCUB"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_17",
									"colspan" : 13,
									"colidx" : 18,
									"level" : 1,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL",
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "0D_DEMOEXMPL"
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
									"id" : "CROSSTAB_1_ia_pt_2_2",
									"colidx" : 3,
									"style" : "TITLE",
									"_v" : "Calendar Year/Month"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_4",
									"colidx" : 5,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200301",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "01/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_5",
									"colidx" : 6,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200302",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "02/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_6",
									"colidx" : 7,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200303",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "03/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_7",
									"colidx" : 8,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200304",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "04/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_8",
									"colidx" : 9,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200305",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "05/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_9",
									"colidx" : 10,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200306",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "06/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_10",
									"colidx" : 11,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200307",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "07/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_11",
									"colidx" : 12,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200308",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "08/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_12",
									"colidx" : 13,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200309",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "09/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_13",
									"colidx" : 14,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200310",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "10/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_14",
									"colidx" : 15,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200311",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "11/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_15",
									"colidx" : 16,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/200312",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','15',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "12/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_16",
									"colidx" : 17,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_SAP_DEMOCUB/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','16',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_17",
									"colidx" : 18,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200301",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','17',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "01/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_18",
									"colidx" : 19,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200302",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','18',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "02/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_19",
									"colidx" : 20,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200303",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','19',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "03/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_20",
									"colidx" : 21,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200304",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','20',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "04/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_21",
									"colidx" : 22,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200305",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','21',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "05/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_22",
									"colidx" : 23,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200306",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','22',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "06/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_23",
									"colidx" : 24,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200307",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','23',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "07/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_24",
									"colidx" : 25,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200308",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','24',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "08/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_25",
									"colidx" : 26,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200309",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','25',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "09/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_26",
									"colidx" : 27,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200310",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','26',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "10/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_27",
									"colidx" : 28,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200311",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','27',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "11/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_28",
									"colidx" : 29,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/200312",
									"isinnermember" : true,
									"style" : "HEADER",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','28',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "12/2003"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_29",
									"colidx" : 30,
									"key" : "2V5LIVXK80H9MGWQWLU4EE240/0D_DEMOEXMPL/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','29',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
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
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','30',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Product group"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_1",
									"colidx" : 2,
									"style" : "TITLE",
									"sort" : "ASC",
									"sortalternativetext" : "Ascending",
									"sorttooltip" : "Sort in Descending Order",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','31',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Currency"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_2",
									"colidx" : 3,
									"style" : "TITLE",
									"sort" : "ASC",
									"sortalternativetext" : "Ascending",
									"sorttooltip" : "Sort in Descending Order",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','32',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Reason - Lost Deals"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_3",
									"colidx" : 4,
									"style" : "TOTAL",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_4",
									"colidx" : 5,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_5",
									"colidx" : 6,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_6",
									"colidx" : 7,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_7",
									"colidx" : 8,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_8",
									"colidx" : 9,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_9",
									"colidx" : 10,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_10",
									"colidx" : 11,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_11",
									"colidx" : 12,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_12",
									"colidx" : 13,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_13",
									"colidx" : 14,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_14",
									"colidx" : 15,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_15",
									"colidx" : 16,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_16",
									"colidx" : 17,
									"style" : "TOTAL",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_17",
									"colidx" : 18,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_18",
									"colidx" : 19,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_19",
									"colidx" : 20,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_20",
									"colidx" : 21,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_21",
									"colidx" : 22,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_22",
									"colidx" : 23,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_23",
									"colidx" : 24,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_24",
									"colidx" : 25,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_25",
									"colidx" : 26,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_26",
									"colidx" : 27,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_27",
									"colidx" : 28,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_28",
									"colidx" : 29,
									"style" : "HEADER",
									"_v" : "* 1,000 $"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_29",
									"colidx" : 30,
									"style" : "TOTAL",
									"_v" : "* 1,000 $"
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
									"rowspan" : 5,
									"colidx" : 1,
									"level" : 0,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','33',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "REST_H",
									"style" : "HIERARCHY_LEVEL1",
									"_v" : "Not Assigned Product group (s)"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_1",
									"rowspan" : 4,
									"colidx" : 2,
									"key" : "REST_H/USD",
									"style" : "HEADER",
									"_v" : "US Dollar"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_2",
									"colidx" : 3,
									"key" : "REST_H/USD/3",
									"isinnermember" : true,
									"style" : "HEADER",
									"_v" : "Delivery Time"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_3",
									"colidx" : 4,
									"style" : "TOTAL",
									"_v" : "107,008"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_4",
									"colidx" : 5,
									"_v" : "11,366"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_5",
									"colidx" : 6,
									"_v" : "9,663"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_6",
									"colidx" : 7,
									"_v" : "6,813"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_7",
									"colidx" : 8,
									"_v" : "10,000"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_8",
									"colidx" : 9,
									"_v" : "17,642"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_9",
									"colidx" : 10,
									"_v" : "11,302"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_10",
									"colidx" : 11,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_11",
									"colidx" : 12,
									"_v" : "7,583"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_12",
									"colidx" : 13,
									"_v" : "8,049"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_13",
									"colidx" : 14,
									"_v" : "10,439"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_14",
									"colidx" : 15,
									"_v" : "6,508"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_15",
									"colidx" : 16,
									"_v" : "7,643"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_16",
									"colidx" : 17,
									"style" : "TOTAL",
									"_v" : "107,008"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_17",
									"colidx" : 18,
									"_v" : "11,366"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_18",
									"colidx" : 19,
									"_v" : "9,663"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_19",
									"colidx" : 20,
									"_v" : "6,813"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_20",
									"colidx" : 21,
									"_v" : "10,000"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_21",
									"colidx" : 22,
									"_v" : "17,642"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_22",
									"colidx" : 23,
									"_v" : "11,302"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_23",
									"colidx" : 24,
									"_v" : ""
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_24",
									"colidx" : 25,
									"_v" : "7,583"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_25",
									"colidx" : 26,
									"_v" : "8,049"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_26",
									"colidx" : 27,
									"_v" : "10,439"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_27",
									"colidx" : 28,
									"_v" : "6,508"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_28",
									"colidx" : 29,
									"_v" : "7,643"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_29",
									"colidx" : 30,
									"style" : "TOTAL",
									"_v" : "107,008"
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
									"id" : "CROSSTAB_1_ia_pt_5_2",
									"colidx" : 3,
									"key" : "REST_H/USD/1",
									"isinnermember" : true,
									"style" : "HEADER",
									"_v" : "Prices"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_3",
									"colidx" : 4,
									"style" : "TOTAL",
									"_v" : "285,792"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_4",
									"colidx" : 5,
									"style" : "ALTERNATING",
									"_v" : "42,986"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_5",
									"colidx" : 6,
									"style" : "ALTERNATING",
									"_v" : "45,089"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_6",
									"colidx" : 7,
									"style" : "ALTERNATING",
									"_v" : "26,869"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_7",
									"colidx" : 8,
									"style" : "ALTERNATING",
									"_v" : "24,628"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_8",
									"colidx" : 9,
									"style" : "ALTERNATING",
									"_v" : "22,732"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_9",
									"colidx" : 10,
									"style" : "ALTERNATING",
									"_v" : "24,746"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_10",
									"colidx" : 11,
									"style" : "ALTERNATING",
									"_v" : "16,867"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_11",
									"colidx" : 12,
									"style" : "ALTERNATING",
									"_v" : "20,158"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_12",
									"colidx" : 13,
									"style" : "ALTERNATING",
									"_v" : "16,595"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_13",
									"colidx" : 14,
									"style" : "ALTERNATING",
									"_v" : "27,872"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_14",
									"colidx" : 15,
									"style" : "ALTERNATING",
									"_v" : "10,790"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_15",
									"colidx" : 16,
									"style" : "ALTERNATING",
									"_v" : "6,462"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_16",
									"colidx" : 17,
									"style" : "TOTAL",
									"_v" : "285,792"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_17",
									"colidx" : 18,
									"style" : "ALTERNATING",
									"_v" : "42,986"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_18",
									"colidx" : 19,
									"style" : "ALTERNATING",
									"_v" : "45,089"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_19",
									"colidx" : 20,
									"style" : "ALTERNATING",
									"_v" : "26,869"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_20",
									"colidx" : 21,
									"style" : "ALTERNATING",
									"_v" : "24,628"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_21",
									"colidx" : 22,
									"style" : "ALTERNATING",
									"_v" : "22,732"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_22",
									"colidx" : 23,
									"style" : "ALTERNATING",
									"_v" : "24,746"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_23",
									"colidx" : 24,
									"style" : "ALTERNATING",
									"_v" : "16,867"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_24",
									"colidx" : 25,
									"style" : "ALTERNATING",
									"_v" : "20,158"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_25",
									"colidx" : 26,
									"style" : "ALTERNATING",
									"_v" : "16,595"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_26",
									"colidx" : 27,
									"style" : "ALTERNATING",
									"_v" : "27,872"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_27",
									"colidx" : 28,
									"style" : "ALTERNATING",
									"_v" : "10,790"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_28",
									"colidx" : 29,
									"style" : "ALTERNATING",
									"_v" : "6,462"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_29",
									"colidx" : 30,
									"style" : "TOTAL",
									"_v" : "285,792"
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
									"id" : "CROSSTAB_1_ia_pt_6_2",
									"colidx" : 3,
									"key" : "REST_H/USD/2",
									"isinnermember" : true,
									"style" : "HEADER",
									"_v" : "Service"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_3",
									"colidx" : 4,
									"style" : "TOTAL",
									"_v" : "472,972"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_4",
									"colidx" : 5,
									"_v" : "15,984"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_5",
									"colidx" : 6,
									"_v" : "31,146"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_6",
									"colidx" : 7,
									"_v" : "33,149"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_7",
									"colidx" : 8,
									"_v" : "45,560"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_8",
									"colidx" : 9,
									"_v" : "44,892"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_9",
									"colidx" : 10,
									"_v" : "42,865"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_10",
									"colidx" : 11,
									"_v" : "50,421"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_11",
									"colidx" : 12,
									"_v" : "40,127"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_12",
									"colidx" : 13,
									"_v" : "41,386"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_13",
									"colidx" : 14,
									"_v" : "44,521"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_14",
									"colidx" : 15,
									"_v" : "39,867"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_15",
									"colidx" : 16,
									"_v" : "43,052"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_16",
									"colidx" : 17,
									"style" : "TOTAL",
									"_v" : "472,972"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_17",
									"colidx" : 18,
									"_v" : "15,984"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_18",
									"colidx" : 19,
									"_v" : "31,146"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_19",
									"colidx" : 20,
									"_v" : "33,149"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_20",
									"colidx" : 21,
									"_v" : "45,560"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_21",
									"colidx" : 22,
									"_v" : "44,892"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_22",
									"colidx" : 23,
									"_v" : "42,865"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_23",
									"colidx" : 24,
									"_v" : "50,421"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_24",
									"colidx" : 25,
									"_v" : "40,127"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_25",
									"colidx" : 26,
									"_v" : "41,386"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_26",
									"colidx" : 27,
									"_v" : "44,521"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_27",
									"colidx" : 28,
									"_v" : "39,867"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_28",
									"colidx" : 29,
									"_v" : "43,052"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_29",
									"colidx" : 30,
									"style" : "TOTAL",
									"_v" : "472,972"
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
									"id" : "CROSSTAB_1_ia_pt_7_2",
									"colidx" : 3,
									"key" : "REST_H/USD/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"style" : "TOTAL",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_3",
									"colidx" : 4,
									"style" : "TOTAL",
									"_v" : "865,772"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_4",
									"colidx" : 5,
									"style" : "TOTAL",
									"_v" : "70,336"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_5",
									"colidx" : 6,
									"style" : "TOTAL",
									"_v" : "85,898"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_6",
									"colidx" : 7,
									"style" : "TOTAL",
									"_v" : "66,830"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "80,189"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_8",
									"colidx" : 9,
									"style" : "TOTAL",
									"_v" : "85,266"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_9",
									"colidx" : 10,
									"style" : "TOTAL",
									"_v" : "78,913"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_10",
									"colidx" : 11,
									"style" : "TOTAL",
									"_v" : "67,288"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_11",
									"colidx" : 12,
									"style" : "TOTAL",
									"_v" : "67,868"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "66,029"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_13",
									"colidx" : 14,
									"style" : "TOTAL",
									"_v" : "82,832"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_14",
									"colidx" : 15,
									"style" : "TOTAL",
									"_v" : "57,165"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_15",
									"colidx" : 16,
									"style" : "TOTAL",
									"_v" : "57,157"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_16",
									"colidx" : 17,
									"style" : "TOTAL",
									"_v" : "865,772"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "70,336"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_18",
									"colidx" : 19,
									"style" : "TOTAL",
									"_v" : "85,898"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_19",
									"colidx" : 20,
									"style" : "TOTAL",
									"_v" : "66,830"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_20",
									"colidx" : 21,
									"style" : "TOTAL",
									"_v" : "80,189"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_21",
									"colidx" : 22,
									"style" : "TOTAL",
									"_v" : "85,266"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : "78,913"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_23",
									"colidx" : 24,
									"style" : "TOTAL",
									"_v" : "67,288"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_24",
									"colidx" : 25,
									"style" : "TOTAL",
									"_v" : "67,868"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "66,029"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_26",
									"colidx" : 27,
									"style" : "TOTAL",
									"_v" : "82,832"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_27",
									"colidx" : 28,
									"style" : "TOTAL",
									"_v" : "57,165"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_28",
									"colidx" : 29,
									"style" : "TOTAL",
									"_v" : "57,157"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_29",
									"colidx" : 30,
									"style" : "TOTAL",
									"_v" : "865,772"
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
									"id" : "CROSSTAB_1_ia_pt_8_1",
									"colspan" : 2,
									"colidx" : 2,
									"key" : "REST_H/SUMME",
									"isresult" : true,
									"style" : "TOTAL",
									"_v" : "Result"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_3",
									"colidx" : 4,
									"style" : "TOTAL",
									"_v" : "865,772"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_4",
									"colidx" : 5,
									"style" : "TOTAL",
									"_v" : "70,336"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_5",
									"colidx" : 6,
									"style" : "TOTAL",
									"_v" : "85,898"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_6",
									"colidx" : 7,
									"style" : "TOTAL",
									"_v" : "66,830"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_7",
									"colidx" : 8,
									"style" : "TOTAL",
									"_v" : "80,189"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_8",
									"colidx" : 9,
									"style" : "TOTAL",
									"_v" : "85,266"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_9",
									"colidx" : 10,
									"style" : "TOTAL",
									"_v" : "78,913"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_10",
									"colidx" : 11,
									"style" : "TOTAL",
									"_v" : "67,288"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_11",
									"colidx" : 12,
									"style" : "TOTAL",
									"_v" : "67,868"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_12",
									"colidx" : 13,
									"style" : "TOTAL",
									"_v" : "66,029"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_13",
									"colidx" : 14,
									"style" : "TOTAL",
									"_v" : "82,832"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_14",
									"colidx" : 15,
									"style" : "TOTAL",
									"_v" : "57,165"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_15",
									"colidx" : 16,
									"style" : "TOTAL",
									"_v" : "57,157"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_16",
									"colidx" : 17,
									"style" : "TOTAL",
									"_v" : "865,772"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_17",
									"colidx" : 18,
									"style" : "TOTAL",
									"_v" : "70,336"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_18",
									"colidx" : 19,
									"style" : "TOTAL",
									"_v" : "85,898"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_19",
									"colidx" : 20,
									"style" : "TOTAL",
									"_v" : "66,830"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_20",
									"colidx" : 21,
									"style" : "TOTAL",
									"_v" : "80,189"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_21",
									"colidx" : 22,
									"style" : "TOTAL",
									"_v" : "85,266"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_22",
									"colidx" : 23,
									"style" : "TOTAL",
									"_v" : "78,913"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_23",
									"colidx" : 24,
									"style" : "TOTAL",
									"_v" : "67,288"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_24",
									"colidx" : 25,
									"style" : "TOTAL",
									"_v" : "67,868"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_25",
									"colidx" : 26,
									"style" : "TOTAL",
									"_v" : "66,029"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_26",
									"colidx" : 27,
									"style" : "TOTAL",
									"_v" : "82,832"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_27",
									"colidx" : 28,
									"style" : "TOTAL",
									"_v" : "57,165"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_28",
									"colidx" : 29,
									"style" : "TOTAL",
									"_v" : "57,157"
								}
							}, {
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_29",
									"colidx" : 30,
									"style" : "TOTAL",
									"_v" : "865,772"
								}
							}
						]
					}
				}
			]
		}
};