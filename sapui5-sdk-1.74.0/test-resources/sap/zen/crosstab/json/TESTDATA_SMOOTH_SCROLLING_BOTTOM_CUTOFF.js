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

sapzen.crosstab.test.jsonTestData.SMOOTH_SCROLLING_BOTTOM_CUTOFF = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 3,
		"fixedrowheaders": 2,
		"totaldatarows": 18,
		"totaldatacols": 6,
		"sentdatarows": 5,
		"sentdatacols": 6,
		"tilerows": 5,
		"tilecols": 70,
		"displaymode": "DEFINED_SIZE",
		"pixelscrolling": true,
		"onselectcommand": "sap.zen.request.zenSendCommandSequenceArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
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
								"colspan": 3,
								"colidx": 3,
								"key": "4MEWGNQTRPEHLRH3AWKSSLH69",
								"style": "HEADER",
								"_v": "Net Sales"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_5",
								"colspan": 3,
								"colidx": 6,
								"key": "4MEWGNYIAO074E0JGQN52NFW1",
								"style": "HEADER",
								"_v": "Billed Quantity"
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
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','94',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_3",
										"colidx": 4,
										"key": "4MEWGNQTRPEHLRH3AWKSSLH69/DS20",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','95',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_4",
										"colidx": 5,
										"key": "4MEWGNQTRPEHLRH3AWKSSLH69/SUMME",
										"isinnermember": true,
										"isresult": true,
										"style": "TOTAL",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','96',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_5",
										"colidx": 6,
										"key": "4MEWGNYIAO074E0JGQN52NFW1/DS30",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','97',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_6",
										"colidx": 7,
										"key": "4MEWGNYIAO074E0JGQN52NFW1/DS20",
										"isinnermember": true,
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','98',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_7",
										"colidx": 8,
										"key": "4MEWGNYIAO074E0JGQN52NFW1/SUMME",
										"isinnermember": true,
										"isresult": true,
										"style": "TOTAL",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','99',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
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
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','100',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
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
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','101',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
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
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_3",
										"colidx": 4,
										"style": "HEADER",
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_4",
										"colidx": 5,
										"style": "TOTAL",
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_5",
										"colidx": 6,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_6",
										"colidx": 7,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_7",
										"colidx": 8,
										"style": "TOTAL",
										"_v": "* 1,000 PC"
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
								"rowspan": 5,
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
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_3",
								"colidx": 4,
								"_v": "18,333"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": "18,333"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_6",
								"colidx": 7,
								"_v": "1,998"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "1,998"
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
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": "26,120"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": "26,120"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_6",
								"colidx": 7,
								"style": "ALTERNATING",
								"_v": "5,701"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "5,701"
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
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": "24,598"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_5",
								"colidx": 6,
								"_v": "2,332"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_6",
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "2,332"
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
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": "23,380"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": "4,637"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_6",
								"colidx": 7,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "4,637"
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
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_3",
								"colidx": 4,
								"_v": "22,927"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": "22,927"
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
								"_v": "16,612"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "16,612"
							}
						} ]
					}
				} ]
	}

};