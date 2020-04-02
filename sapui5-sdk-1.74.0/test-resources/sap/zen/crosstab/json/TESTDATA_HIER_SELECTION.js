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

sapzen.crosstab.test.jsonTestData.hierSelection = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 3,
		"fixedrowheaders": 1,
		"totaldatarows": 11,
		"totaldatacols": 8,
		"sentdatarows": 11,
		"sentdatacols": 8,
		"tilerows": 50,
		"tilecols": 30,
		"displaymode": "DEFINED_SIZE",
		"pixelscrolling": false,
		"onselectcommand": "sap.zen.request.zenSendCommandSequenceArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
		"selectionenabled": true,
		"changed": true,
		"texts": {
			"rowtext": "Row",
			"coltext": "Column",
			"colwidthtext": "Double Click to adjust Column Width"
		},
		"rows": [
				{
					"row": {
						"rowidx": "1",
						"cells": [
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_0_0",
										"colidx": 1,
										"style": "TITLE",
										"_v": "0BC_TYPE"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_0_1",
										"colspan": 2,
										"colidx": 2,
										"level": 0,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "CATEGORY",
										"style": "HIERARCHY_LEVEL1",
										"_v": "CATEGORY"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_0_3",
										"colspan": 2,
										"colidx": 4,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "GOOD",
										"style": "HIERARCHY_LEVEL2",
										"_v": "GOOD"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_0_5",
										"colspan": 2,
										"colidx": 6,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "MEDIUM_1",
										"style": "HIERARCHY_LEVEL2",
										"_v": "MEDIUM_1"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_0_7",
										"colspan": 2,
										"colidx": 8,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "BAD_1",
										"style": "HIERARCHY_LEVEL2",
										"_v": "BAD_1"
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
										"_v": ""
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_1",
										"colidx": 2,
										"key": "CATEGORY/EB7AGB2FNFCYWPYEMC8BMXVLC",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_AMT"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_2",
										"colidx": 3,
										"key": "CATEGORY/EDC0LN110T3N1W4YTZXUH9IR4",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_ZHL"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_3",
										"colidx": 4,
										"key": "GOOD/EB7AGB2FNFCYWPYEMC8BMXVLC",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_AMT"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_4",
										"colidx": 5,
										"key": "GOOD/EDC0LN110T3N1W4YTZXUH9IR4",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_ZHL"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_5",
										"colidx": 6,
										"key": "MEDIUM_1/EB7AGB2FNFCYWPYEMC8BMXVLC",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_AMT"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_6",
										"colidx": 7,
										"key": "MEDIUM_1/EDC0LN110T3N1W4YTZXUH9IR4",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_ZHL"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_7",
										"colidx": 8,
										"key": "BAD_1/EB7AGB2FNFCYWPYEMC8BMXVLC",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_AMT"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_8",
										"colidx": 9,
										"key": "BAD_1/EDC0LN110T3N1W4YTZXUH9IR4",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_ZHL"
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
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_CUST"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_1",
										"colidx": 2,
										"style": "HEADER",
										"_v": "DM"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_2",
										"colidx": 3,
										"style": "HEADER",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_3",
										"colidx": 4,
										"style": "HEADER",
										"_v": "DM"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_4",
										"colidx": 5,
										"style": "HEADER",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_5",
										"colidx": 6,
										"style": "HEADER",
										"_v": "DM"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_6",
										"colidx": 7,
										"style": "HEADER",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_7",
										"colidx": 8,
										"style": "HEADER",
										"_v": "DM"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_8",
										"colidx": 9,
										"style": "HEADER",
										"_v": ""
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
										"level": 0,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "WEST EUROPA",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL1",
										"_v": "WEST EUROPA"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_1",
										"colidx": 2,
										"_v": "57,168.50"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_2",
										"colidx": 3,
										"_v": "55.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_3",
										"colidx": 4,
										"_v": "55,487.00"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_4",
										"colidx": 5,
										"_v": "25.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_5",
										"colidx": 6,
										"_v": "1,457.30"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_6",
										"colidx": 7,
										"_v": "26.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_7",
										"colidx": 8,
										"_v": "280.25"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_3_8",
										"colidx": 9,
										"_v": "5.000"
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
										"level": 1,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','15',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "FRANKREICH",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "FRANKREICH"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "29,189.54"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "19.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": "28,853.24"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_4",
										"colidx": 5,
										"style": "ALTERNATING",
										"_v": "13.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": "168.15"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": "3.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_7",
										"colidx": 8,
										"style": "ALTERNATING",
										"_v": "168.15"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_8",
										"colidx": 9,
										"style": "ALTERNATING",
										"_v": "3.000"
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
										"level": 2,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','16',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "000324",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL3",
										"_v": "324"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_1",
										"colidx": 2,
										"_v": "11,265.55"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_2",
										"colidx": 3,
										"_v": "8.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_3",
										"colidx": 4,
										"_v": "11,097.40"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_4",
										"colidx": 5,
										"_v": "5.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_5",
										"colidx": 6,
										"_v": "56.05"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_6",
										"colidx": 7,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_7",
										"colidx": 8,
										"_v": "112.10"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_5_8",
										"colidx": 9,
										"_v": "2.000"
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
										"level": 2,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','17',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "000052",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL3",
										"_v": "52"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "9,046.07"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "7.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": "8,877.92"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_4",
										"colidx": 5,
										"style": "ALTERNATING",
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": "112.10"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_7",
										"colidx": 8,
										"style": "ALTERNATING",
										"_v": "56.05"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_6_8",
										"colidx": 9,
										"style": "ALTERNATING",
										"_v": "1.000"
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
										"level": 2,
										"drillstate": "L",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','18',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "000157",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL3",
										"_v": "157"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_1",
										"colidx": 2,
										"_v": "8,877.92"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_2",
										"colidx": 3,
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_3",
										"colidx": 4,
										"_v": "8,877.92"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_4",
										"colidx": 5,
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_5",
										"colidx": 6,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_6",
										"colidx": 7,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_7",
										"colidx": 8,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_7_8",
										"colidx": 9,
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
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','19',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "DEUTSCHLAND",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL2",
										"_v": "DEUTSCHLAND"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "27,978.96"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "36.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": "26,633.76"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_4",
										"colidx": 5,
										"style": "ALTERNATING",
										"_v": "12.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": "1,289.15"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": "23.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_7",
										"colidx": 8,
										"style": "ALTERNATING",
										"_v": "112.10"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_8_8",
										"colidx": 9,
										"style": "ALTERNATING",
										"_v": "2.000"
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
										"level": 2,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','20',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "NORD DEUTSCHLAND",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL3",
										"_v": "NORD DEUTSCHLAND"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_1",
										"colidx": 2,
										"_v": "56.05"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_2",
										"colidx": 3,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_3",
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_4",
										"colidx": 5,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_5",
										"colidx": 6,
										"_v": "56.05"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_6",
										"colidx": 7,
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_7",
										"colidx": 8,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_9_8",
										"colidx": 9,
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
										"level": 3,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','21',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "HAMBURG",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL4",
										"_v": "HAMBURG"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "56.05"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_4",
										"colidx": 5,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": "56.05"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": "1.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_7",
										"colidx": 8,
										"style": "ALTERNATING",
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_10_8",
										"colidx": 9,
										"style": "ALTERNATING",
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
										"level": 2,
										"drillstate": "O",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','22',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "SUED DEUTSCHLAND",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL3",
										"_v": "SUED DEUTSCHLAND"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_1",
										"colidx": 2,
										"_v": "27,922.91"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_2",
										"colidx": 3,
										"_v": "35.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_3",
										"colidx": 4,
										"_v": "26,633.76"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_4",
										"colidx": 5,
										"_v": "12.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_5",
										"colidx": 6,
										"_v": "1,233.10"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_6",
										"colidx": 7,
										"_v": "22.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_7",
										"colidx": 8,
										"_v": "112.10"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_11_8",
										"colidx": 9,
										"_v": "2.000"
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
										"level": 3,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','23',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "BAYERN",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL4",
										"_v": "BAYERN"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_1",
										"colidx": 2,
										"style": "ALTERNATING",
										"_v": "23,259.75"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_2",
										"colidx": 3,
										"style": "ALTERNATING",
										"_v": "29.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_3",
										"colidx": 4,
										"style": "ALTERNATING",
										"_v": "22,194.80"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_4",
										"colidx": 5,
										"style": "ALTERNATING",
										"_v": "10.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_5",
										"colidx": 6,
										"style": "ALTERNATING",
										"_v": "1,008.90"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_6",
										"colidx": 7,
										"style": "ALTERNATING",
										"_v": "18.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_7",
										"colidx": 8,
										"style": "ALTERNATING",
										"_v": "112.10"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_12_8",
										"colidx": 9,
										"style": "ALTERNATING",
										"_v": "2.000"
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
										"level": 3,
										"drillstate": "C",
										"hierarchyaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','24',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "BADEN WUERTTEMBERG",
										"isinnermember": true,
										"style": "HIERARCHY_LEVEL4",
										"_v": "BADEN WUERTTEMBERG"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_1",
										"colidx": 2,
										"_v": "4,663.16"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_2",
										"colidx": 3,
										"_v": "6.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_3",
										"colidx": 4,
										"_v": "4,438.96"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_4",
										"colidx": 5,
										"_v": "2.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_5",
										"colidx": 6,
										"_v": "224.20"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_6",
										"colidx": 7,
										"_v": "4.000"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_7",
										"colidx": 8,
										"_v": ""
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_13_8",
										"colidx": 9,
										"_v": ""
									}
								} ]
					}
				} ]
	}

};
