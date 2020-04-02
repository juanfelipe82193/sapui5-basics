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

sapzen.crosstab.test.jsonTestData.TESTDATA_MEASURES_IN_ROWS = {
	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 0,
		"fixedrowheaders": 2,
		"totaldatarows": 1,
		"totaldatacols": 1,
		"sentdatarows": 1,
		"sentdatacols": 1,
		"tilerows": 50,
		"tilecols": 30,
		"alwaysfill": true,
		"pixelscrolling": false,
		"onselectcommand": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
		"selectionenabled": false,
		"changed": true,
		"texts": {
			"rowtext": "Row",
			"coltext": "Column",
			"colwidthtext": "Double Click to adjust Column Width"
		},
		"rows": [ {
			"row": {
				"rowidx": "1",
				"cells": [ {
					"control": {
						"type": "xcell",
						"id": "CROSSTAB_1_ia_pt_0_0",
						"colidx": 1,
						"key": "4MMOIXHH46ZTTJNJ8EHK4FQ5U",
						"isinnermember": true,
						"style": "HEADER",
						"_v": "Net Sales"
					}
				}, {
					"control": {
						"type": "xcell",
						"id": "CROSSTAB_1_ia_pt_0_1",
						"colidx": 2,
						"style": "HEADER",
						"_v": "* 1,000 $"
					}
				}, {
					"control": {
						"type": "xcell",
						"id": "CROSSTAB_1_ia_pt_0_2",
						"colidx": 3,
						"_v": "9,017,677.56"
					}
				} ]
			}
		} ]
	}
};