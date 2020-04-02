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

sapzen.crosstab.test.jsonTestData.escapeData = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"resultsetchanged": false,
		"dataproviderchanged": true,
		"changed": true,
		"texts": {
			"rowtext": "Row",
			"coltext": "Column",
			"colwidthtext": "Double click to adjust column width",
			"mobilemenuitemcolwidthtext": "Adjust column width"
		},
		"fixedcolheaders": 2,
		"fixedrowheaders": 1,
		"totaldatarows": 6,
		"totaldatacols": 4,
		"sentdatarows": 6,
		"sentdatacols": 4,
		"tilerows": 50,
		"tilecols": 30,
		"onselectcommand": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]],true);",
		"selectionenabled": false,
		"alwaysfill": false,
		"pixelscrolling": false,
		"displayexceptions": false,
		"enablecolresize": true,
		"usercolwidths": {
			"length": 0
		},
		"rows": [
				{
					"row": {
						"rowidx": "1",
						"cells": [
								{
									"control": {
										"colidx": 1,
										"_v": ""
									}
								},
								{
									"control": {
										"colidx": 2,
										"key": "4TQ9U6C5Y3J86O6WX2TEBNPYP",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_AMT"
									}
								},
								{
									"control": {
										"colidx": 3,
										"key": "4TQ9U6JUH24XPAQD2WVQLPOOH",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_DATE"
									}
								},
								{
									"control": {
										"colidx": 4,
										"key": "4TQ9U6RJ00QN7X9T8QY2VRNE9",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_MAX"
									}
								},
								{
									"control": {
										"colidx": 5,
										"key": "4TQ9U6Z7IZCCQJT9EL0F5TM41",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_MIN"
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
										"colidx": 1,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_CUST"
									}
								}, {
									"control": {
										"colidx": 2,
										"_v": "DM"
									}
								}, {
									"control": {
										"colidx": 3
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": ""
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": ""
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
										"colidx": 1,
										"level": 0,
										"drillstate": "L",
										"hierarchyaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"key": "SUMME",
										"isinnermember": true,
										"isresult": true,
										"_v": "&amp;&#x3a;&#x2f;B&#x20;&lt;&#x2f;&gt;&#xd;&#xa;BLA"
									}
								}, {
									"control": {
										"colidx": 2,
										"isresult": true,
										"_v": "3,649,995.68"
									}
								}, {
									"control": {
										"colidx": 3,
										"isresult": true,
										"_v": "NOT_EXIST"
									}
								}, {
									"control": {
										"colidx": 4,
										"isresult": true,
										"_v": "&#x2a;"
									}
								}, {
									"control": {
										"colidx": 5,
										"isresult": true,
										"_v": "&#x2a;"
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
										"colidx": 1,
										"level": 0,
										"drillstate": "O",
										"hierarchyaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "ROOT",
										"isinnermember": true,
										"_v": "ROOT"
									}
								}, {
									"control": {
										"colidx": 2,
										"_v": "66,631.03"
									}
								}, {
									"control": {
										"colidx": 3,
										"_v": "NOT_EXIST"
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": "&#x2a;"
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": "&#x2a;"
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
										"colidx": 1,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "000005",
										"isinnermember": true,
										"_v": "5"
									}
								}, {
									"control": {
										"colidx": 2,
										"_v": "2,331.58"
									}
								}, {
									"control": {
										"colidx": 3,
										"_v": "NOT_EXIST"
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": "&#x2a;"
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": "&#x2a;"
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
										"colidx": 1,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "US",
										"isinnermember": true,
										"_v": "United&#x20;States"
									}
								}, {
									"control": {
										"colidx": 2,
										"_v": "32,554.13"
									}
								}, {
									"control": {
										"colidx": 3,
										"_v": "NOT_EXIST"
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": "&#x2a;"
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": "&#x2a;"
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
										"colidx": 1,
										"level": 1,
										"drillstate": "C",
										"hierarchyaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "LANGER_KNOTENNAME_1 ____________",
										"isinnermember": true,
										"_v": "HANS&#x20;&amp;&#x20;FRANZ&#x20;&#x2f;&#x3a;BLA"
									}
								}, {
									"control": {
										"colidx": 2,
										"_v": "31,745.32"
									}
								}, {
									"control": {
										"colidx": 3,
										"_v": "NOT_EXIST"
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": "&#x2a;"
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": "&#x2a;"
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
										"colidx": 1,
										"level": 0,
										"drillstate": "C",
										"hierarchyaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"hierarchytooltip": "",
										"key": "REST_H",
										"isinnermember": true,
										"_v": "Not&#x20;Assigned&#x20;&#x20;&#x20;&#x28;s&#x29;"
									}
								}, {
									"control": {
										"colidx": 2,
										"_v": "3,583,364.65"
									}
								}, {
									"control": {
										"colidx": 3,
										"_v": "NOT_EXIST"
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": "&#x2a;"
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": "&#x2a;"
									}
								} ]
					}
				} ]
	}

};