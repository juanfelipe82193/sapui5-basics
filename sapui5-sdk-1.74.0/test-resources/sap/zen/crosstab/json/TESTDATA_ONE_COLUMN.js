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

sapzen.crosstab.test.jsonTestData.TESTDATA_ONE_COLUMN = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 1,
		"fixedrowheaders": 2,
		"totaldatarows": 89,
		"totaldatacols": 1,
		"sentdatarows": 50,
		"sentdatacols": 1,
		"tilerows": 50,
		"tilecols": 30,
		"displaymode": "DEFINED_SIZE",
		"pixelscrolling": false,
		"onselectcommand": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
		"selectionenabled": false,
		"scrollaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','SUPPRESS_VALIDATION',0]]],['BI_COMMAND',null,1,[['INDEX','__Y__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_1',0],['BIAV','CROSSTAB_1_ia_pt',0],['TYPE','v',0]]]]);",
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
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_VEND1__0BC_HOME"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_0_1",
										"colidx": 2,
										"style": "TITLE",
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_VEND1__0BC_EVAL"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_0_2",
										"colidx": 3,
										"key": "4HRVUQVSHT7J5PSB229G93B3Z",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "0BC_COUNT"
									}
								} ]
					}
				}, {
					"row": {
						"rowidx": "2",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_1_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "ANSBACH",
								"style": "HEADER",
								"_v": "Ansbach"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_1_1",
								"colidx": 2,
								"key": "ANSBACH/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_1_2",
								"colidx": 3,
								"_v": "98"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "3",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_2_1",
								"colidx": 2,
								"key": "ANSBACH/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_2_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "98"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "4",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_0",
								"rowspan": 3,
								"colidx": 1,
								"key": "DACHAU",
								"style": "HEADER",
								"_v": "Dachau"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_1",
								"colidx": 2,
								"key": "DACHAU/1",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "1"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_2",
								"colidx": 3,
								"_v": "39"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "5",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_1",
								"colidx": 2,
								"key": "DACHAU/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "40"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "6",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_1",
								"colidx": 2,
								"key": "DACHAU/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "79"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "7",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "ESSLINGEN",
								"style": "HEADER",
								"_v": "Esslingen"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_1",
								"colidx": 2,
								"key": "ESSLINGEN/5",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "5"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "32"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "8",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_1",
								"colidx": 2,
								"key": "ESSLINGEN/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "32"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "9",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "FUERTH",
								"style": "HEADER",
								"_v": "Fuerth"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_1",
								"colidx": 2,
								"key": "FUERTH/4",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "4"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "45"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "10",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_1",
								"colidx": 2,
								"key": "FUERTH/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "45"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "11",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "GAEPPINGEN",
								"style": "HEADER",
								"_v": "GAEPPINGEN"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_1",
								"colidx": 2,
								"key": "GAEPPINGEN/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "40"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "12",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_1",
								"colidx": 2,
								"key": "GAEPPINGEN/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "40"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "13",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "GLUECKSBURG",
								"style": "HEADER",
								"_v": "Gluecksburg"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_1",
								"colidx": 2,
								"key": "GLUECKSBURG/6",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "6"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "47"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "14",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_1",
								"colidx": 2,
								"key": "GLUECKSBURG/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "47"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "15",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "GRAFING",
								"style": "HEADER",
								"_v": "Grafing"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_1",
								"colidx": 2,
								"key": "GRAFING/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "34"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "16",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_1",
								"colidx": 2,
								"key": "GRAFING/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "34"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "17",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "HALBERSTADT",
								"style": "HEADER",
								"_v": "Halberstadt"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_1",
								"colidx": 2,
								"key": "HALBERSTADT/4",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "4"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "40"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "18",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_1",
								"colidx": 2,
								"key": "HALBERSTADT/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "40"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "19",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "HALDENSLEBEN",
								"style": "HEADER",
								"_v": "Haldensleben"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_1",
								"colidx": 2,
								"key": "HALDENSLEBEN/4",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "4"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "43"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "20",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_1",
								"colidx": 2,
								"key": "HALDENSLEBEN/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "43"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "21",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_0",
								"rowspan": 3,
								"colidx": 1,
								"key": "HALLE",
								"style": "HEADER",
								"_v": "Halle"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_1",
								"colidx": 2,
								"key": "HALLE/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "38"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "22",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_1",
								"colidx": 2,
								"key": "HALLE/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_2",
								"colidx": 3,
								"_v": "41"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "23",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_1",
								"colidx": 2,
								"key": "HALLE/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "79"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "24",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_0",
								"rowspan": 3,
								"colidx": 1,
								"key": "HEILIGENSTADT",
								"style": "HEADER",
								"_v": "Heiligenstadt"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_1",
								"colidx": 2,
								"key": "HEILIGENSTADT/1",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "1"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_2",
								"colidx": 3,
								"_v": "38"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "25",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_1",
								"colidx": 2,
								"key": "HEILIGENSTADT/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "41"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "26",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_1",
								"colidx": 2,
								"key": "HEILIGENSTADT/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "79"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "27",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "INGOLSTADT",
								"style": "HEADER",
								"_v": "Ingolstadt"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_1",
								"colidx": 2,
								"key": "INGOLSTADT/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "48"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "28",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_1",
								"colidx": 2,
								"key": "INGOLSTADT/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "48"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "29",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "KAUFBEUREN",
								"style": "HEADER",
								"_v": "Kaufbeuren"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_1",
								"colidx": 2,
								"key": "KAUFBEUREN/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "53"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "30",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_1",
								"colidx": 2,
								"key": "KAUFBEUREN/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "53"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "31",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "KEHL",
								"style": "HEADER",
								"_v": "Kehl"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_1",
								"colidx": 2,
								"key": "KEHL/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "55"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "32",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_1",
								"colidx": 2,
								"key": "KEHL/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "55"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "33",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "KITZINGEN",
								"style": "HEADER",
								"_v": "Kitzingen"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_1",
								"colidx": 2,
								"key": "KITZINGEN/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "84"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "34",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_1",
								"colidx": 2,
								"key": "KITZINGEN/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "84"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "35",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "KOBLENZ",
								"style": "HEADER",
								"_v": "Koblenz"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_1",
								"colidx": 2,
								"key": "KOBLENZ/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "59"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "36",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_1",
								"colidx": 2,
								"key": "KOBLENZ/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "59"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "37",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "KONSTANZ",
								"style": "HEADER",
								"_v": "Konstanz"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_1",
								"colidx": 2,
								"key": "KONSTANZ/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "74"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "38",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_1",
								"colidx": 2,
								"key": "KONSTANZ/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "74"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "39",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "LINDAU",
								"style": "HEADER",
								"_v": "Lindau"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_1",
								"colidx": 2,
								"key": "LINDAU/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "35"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "40",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_1",
								"colidx": 2,
								"key": "LINDAU/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "35"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "41",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "MAYEN",
								"style": "HEADER",
								"_v": "Mayen"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_1",
								"colidx": 2,
								"key": "MAYEN/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "21"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "42",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_1",
								"colidx": 2,
								"key": "MAYEN/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "21"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "43",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "MEERSBURG",
								"style": "HEADER",
								"_v": "Meersburg"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_1",
								"colidx": 2,
								"key": "MEERSBURG/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "47"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "44",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_1",
								"colidx": 2,
								"key": "MEERSBURG/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "47"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "45",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "NEU ULM",
								"style": "HEADER",
								"_v": "Neu Ulm"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_1",
								"colidx": 2,
								"key": "NEU ULM/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "44"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "46",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_1",
								"colidx": 2,
								"key": "NEU ULM/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "44"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "47",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "NEUWIED",
								"style": "HEADER",
								"_v": "Neuwied"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_1",
								"colidx": 2,
								"key": "NEUWIED/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "46"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "48",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_1",
								"colidx": 2,
								"key": "NEUWIED/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "46"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "49",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_0",
								"rowspan": 2,
								"colidx": 1,
								"key": "NORDERSTEDT",
								"style": "HEADER",
								"_v": "Norderstedt"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_1",
								"colidx": 2,
								"key": "NORDERSTEDT/2",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "2"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "33"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "50",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_1",
								"colidx": 2,
								"key": "NORDERSTEDT/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "33"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "51",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_0",
								"colidx": 1,
								"key": "OBRIGHEIM",
								"style": "HEADER",
								"_v": "Obrigheim"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_1",
								"colidx": 2,
								"key": "OBRIGHEIM/3",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "3"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "47"
							}
						} ]
					}
				} ]
	}

};
