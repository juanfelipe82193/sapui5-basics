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

sapzen.crosstab.test.jsonTestData.TESTDATA_CL_2_HIER_IN_COL_0_3 = {
	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 4,
		"fixedrowheaders": 1,
		"totaldatarows": 20,
		"totaldatacols": 96,
		"sentdatarows": 20,
		"sentdatacols": 6,
		"tilerows": 50,
		"tilecols": 30,
		"alwaysfill": true,
		"pixelscrolling": false,
		"onselectcommand": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
		"selectionenabled": false,
		"scrollaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','SUPPRESS_VALIDATION',0]]],['BI_COMMAND',null,1,[['INDEX','__X__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_1',0],['BIAV','CROSSTAB_1_ia_pt',0],['TYPE','h',0]]]]);",
		"h_pos": 91,
		"rows": [
				{
					"row": {
						"rowidx": "1",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_0",
								"colidx": 1,
								"style": "TITLE",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_1",
								"colspan": 6,
								"colidx": 2,
								"key": "0HOOEWOSHDW0SSP4Q98FGV0HC",
								"style": "HEADER",
								"_v": "0BC_ZHL"
							}
						} ]
					}
				},
				{
					"row": {
						"rowidx": "2",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_0",
										"colidx": 1,
										"style": "TITLE",
										"_v": "0BC_CUST"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_1",
										"colspan": 3,
										"colidx": 2,
										"level": 3,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','88',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BAYERN",
										"style": "HIERARCHY_LEVEL4",
										"_v": "BAYERN"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_4",
										"colspan": 3,
										"colidx": 5,
										"level": 3,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','89',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BADEN WUERTTEMBERG",
										"style": "HIERARCHY_LEVEL4",
										"_v": "BADEN WUERTTEMBERG"
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "3",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_0",
										"colidx": 1,
										"style": "TITLE",
										"_v": "0BC_TYPE"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_1",
										"colidx": 2,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','90',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BAYERN/GOOD",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','91',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "GOOD"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_2",
										"colidx": 3,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','92',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BAYERN/MEDIUM_1",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','93',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "MEDIUM_1"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_3",
										"colidx": 4,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','94',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BAYERN/BAD_1",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','95',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "BAD_1"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_4",
										"colidx": 5,
										"level": 0,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','96',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BADEN WUERTTEMBERG/SUMME",
										"isinnermember": true,
										"isresult": true,
										"style": "TOTAL",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','97',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Result"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_5",
										"colidx": 6,
										"level": 0,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','98',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BADEN WUERTTEMBERG/CATEGORY",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL1",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','99',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "CATEGORY"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_6",
										"colidx": 7,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','100',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "0HOOEWOSHDW0SSP4Q98FGV0HC/BADEN WUERTTEMBERG/MEDIUM_1",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','101',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "MEDIUM_1"
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "4",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_0",
										"colidx": 1,
										"style": "TITLE",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','102',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_FIELD"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_1",
										"colidx": 2,
										"style": "HEADER",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_2",
										"colidx": 3,
										"style": "HEADER",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_3",
										"colidx": 4,
										"style": "HEADER",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_5",
										"colidx": 6,
										"style": "HEADER",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_6",
										"colidx": 7,
										"style": "HEADER",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "5",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_0",
										"colidx": 1,
										"level": 0,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','103',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "SUMME",
										"isinnermember": true,
										"isresult": true,
										"style": "TOTAL",
										"_v": "Overall Result"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_1",
										"colidx": 2,
										"style": "TOTAL",
										"_v": "7.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_2",
										"colidx": 3,
										"style": "TOTAL",
										"_v": "18.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_3",
										"colidx": 4,
										"style": "TOTAL",
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_5",
										"colidx": 6,
										"style": "TOTAL",
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_6",
										"colidx": 7,
										"style": "TOTAL",
										"_v": "4.000"
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "6",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_0",
										"colidx": 1,
										"level": 0,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','104',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "DE BAY004",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL1",
										"_v": "DE/BAY/4"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "5.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "7",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','105',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "DE BAY004",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "DE/BAY/4"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_1",
										"colidx": 2,
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_2",
										"colidx": 3,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_5",
										"colidx": 6,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_6",
										"colidx": 7,
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "8",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','106',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "DE BAY005",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "DE/BAY/5"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "9",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','107',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "DE BAY006",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "DE/BAY/6"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_1",
										"colidx": 2,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_2",
										"colidx": 3,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_5",
										"colidx": 6,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_6",
										"colidx": 7,
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "10",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_0",
										"colidx": 1,
										"level": 0,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','108',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "DE BAW001",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL1",
										"_v": "DE/BAW/1"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "11",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','109',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "DE BAW001",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "DE/BAW/1"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_1",
										"colidx": 2,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_2",
										"colidx": 3,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_5",
										"colidx": 6,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_6",
										"colidx": 7,
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "12",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','110',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "DE BAW002",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "DE/BAW/2"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "13",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','111',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "DE BAW003",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "DE/BAW/3"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_1",
										"colidx": 2,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_2",
										"colidx": 3,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_5",
										"colidx": 6,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_6",
										"colidx": 7,
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "14",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_0",
										"colidx": 1,
										"level": 0,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','112',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "AUSNRD031",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL1",
										"_v": "AUS/NRD/31"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "18.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": "4.000"
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "15",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_14_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','113',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD031",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/31"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_14_1",
										"colidx": 2,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_14_2",
										"colidx": 3,
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_14_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_14_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_14_5",
										"colidx": 6,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_14_6",
										"colidx": 7,
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "16",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_15_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','114',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD032",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/32"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_15_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_15_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_15_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_15_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_15_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_15_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "17",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_16_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','115',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD033",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/33"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_16_1",
										"colidx": 2,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_16_2",
										"colidx": 3,
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_16_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_16_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_16_5",
										"colidx": 6,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_16_6",
										"colidx": 7,
										"_v": "1.000"
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "18",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_17_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','116',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD034",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/34"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_17_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_17_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_17_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_17_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_17_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_17_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "19",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_18_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','117',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD035",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/35"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_18_1",
										"colidx": 2,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_18_2",
										"colidx": 3,
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_18_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_18_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_18_5",
										"colidx": 6,
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_18_6",
										"colidx": 7,
										"_v": "2.000"
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "20",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_19_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','118',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD036",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/36"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_19_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_19_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "3.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_19_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_19_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_19_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_19_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "21",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_20_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','119',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD037",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/37"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_20_1",
										"colidx": 2,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_20_2",
										"colidx": 3,
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_20_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_20_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_20_5",
										"colidx": 6,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_20_6",
										"colidx": 7,
										"_v": "1.000"
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "22",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_21_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','120',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD038",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/38"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_21_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_21_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_21_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_21_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_21_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_21_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "23",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_22_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','121',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD039",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/39"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_22_1",
										"colidx": 2,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_22_2",
										"colidx": 3,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_22_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_22_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_22_5",
										"colidx": 6,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_22_6",
										"colidx": 7,
										"_v": ""
									}
								} ]
					}
				},
				{
					"row": {
						"rowidx": "24",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_23_0",
										"colidx": 1,
										"level": 1,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','122',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "AUSNRD040",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "AUS/NRD/40"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_23_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_23_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_23_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_23_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_23_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_23_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": ""
									}
								} ]
					}
				} ]
	}

};