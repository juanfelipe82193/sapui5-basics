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

sapzen.crosstab.test.jsonTestData.SMOOTH_SCROLLING_RIGHT_CUTOFF = {
	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 3,
		"fixedrowheaders": 2,
		"totaldatarows": 18,
		"totaldatacols": 6,
		"sentdatarows": 18,
		"sentdatacols": 1,
		"tilerows": 70,
		"tilecols": 1,
		"displaymode": "DEFINED_SIZE",
		"pixelscrolling": true,
		"onselectcommand": "sap.zen.request.zenSendCommandSequenceArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
		"selectionenabled": false,
		"scrollaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','SUPPRESS_VALIDATION',0]]],['BI_COMMAND',null,1,[['INDEX','__X__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_1',0],['BIAV','CROSSTAB_1_ia_pt',0],['TYPE','h',0]]]]);",
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
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_0",
								"rowspan": 2,
								"colidx": 1,
								"style": "TITLE"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_1",
								"colidx": 2,
								"style": "TITLE",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_2",
								"colidx": 3,
								"key": "4MEWGNQTRPEHLRH3AWKSSLH69",
								"style": "HEADER",
								"_v": "Net Sales"
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
										"id": "CROSSTAB_1_ia_pt_1_1",
										"colidx": 2,
										"style": "TITLE",
										"_v": "Product group"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_2",
										"colidx": 3,
										"key": "4MEWGNQTRPEHLRH3AWKSSLH69/DS30",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','83',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
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
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','84',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Calendar Year/Month"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_1",
										"colidx": 2,
										"style": "TITLE",
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','85',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Product"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_2",
										"colidx": 3,
										"style": "HEADER",
										"_v": "* 1,000 $"
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
								"rowspan": 9,
								"colidx": 1,
								"key": "200301",
								"style": "HEADER",
								"_v": "JAN 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_1",
								"colidx": 2,
								"key": "200301/PDS04",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_2",
								"colidx": 3,
								"_v": ""
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
								"key": "200301/PDS07",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
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
								"key": "200301/PDS11",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_2",
								"colidx": 3,
								"_v": "24,598"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "7",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_1",
								"colidx": 2,
								"key": "200301/PDS09",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "23,380"
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
								"key": "200301/PDS05",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_2",
								"colidx": 3,
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "9",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_1",
								"colidx": 2,
								"key": "200301/PDS06",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
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
								"key": "200301/PDS10",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_2",
								"colidx": 3,
								"_v": "20,312"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "11",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_1",
								"colidx": 2,
								"key": "200301/PDS08",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "22,238"
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
								"key": "200301/SUMME",
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
								"_v": "90,528"
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
								"rowspan": 9,
								"colidx": 1,
								"key": "200302",
								"style": "HEADER",
								"_v": "FEB 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_1",
								"colidx": 2,
								"key": "200302/PDS04",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
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
								"key": "200302/PDS07",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_2",
								"colidx": 3,
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "15",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_1",
								"colidx": 2,
								"key": "200302/PDS11",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "24,018"
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
								"key": "200302/PDS09",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_2",
								"colidx": 3,
								"_v": "22,890"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "17",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_1",
								"colidx": 2,
								"key": "200302/PDS05",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
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
								"key": "200302/PDS06",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_2",
								"colidx": 3,
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "19",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_1",
								"colidx": 2,
								"key": "200302/PDS10",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": "19,704"
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
								"key": "200302/PDS08",
								"isinnermember": true,
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_2",
								"colidx": 3,
								"_v": "21,752"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "21",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_1",
								"colidx": 2,
								"key": "200302/SUMME",
								"isinnermember": true,
								"isresult": true,
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": "88,364"
							}
						} ]
					}
				} ]
	}

};