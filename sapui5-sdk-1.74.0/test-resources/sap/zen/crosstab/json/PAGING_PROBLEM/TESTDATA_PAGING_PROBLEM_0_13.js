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

sapzen.crosstab.test.jsonTestData.PAGING_PROBLEM_0_4 = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 5,
		"fixedrowheaders": 5,
		"totaldatarows": 36,
		"totaldatacols": 14,
		"sentdatarows": 5,
		"sentdatacols": 2,
		"tilerows": 5,
		"tilecols": 3,
		"displaymode": "DEFINED_SIZE",
		"scrollaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','SUPPRESS_VALIDATION',0]]],['BI_COMMAND',null,1,[['INDEX','__X__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_1',0],['BIAV','CROSSTAB_1_ia_pt',0],['TYPE','h',0]]],['BI_COMMAND',null,2,[['INDEX','__Y__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_1',0],['BIAV','CROSSTAB_1_ia_pt',0],['TYPE','v',0]]]]);",
		"h_pos": 13,
		"rows": [
				{
					"row": {
						"rowidx": "1",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_0",
								"rowspan": 4,
								"colspan": 4,
								"colidx": 1,
								"style": "TITLE"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_4",
								"colidx": 5,
								"style": "TITLE",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_5",
								"colspan": 2,
								"colidx": 6,
								"key": "4MYLTMR1NTO2J02B475JMTIR5",
								"style": "HEADER",
								"_v": "Net Sales"
							}
						} ]
					}
				},
				{
					"row": {
						"rowidx": "2",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_1_4",
								"colidx": 5,
								"style": "TITLE",
								"_v": "Product group"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_1_5",
								"colidx": 6,
								"key": "4MYLTMR1NTO2J02B475JMTIR5/DS30",
								"style": "HEADER",
								"_v": "Hardware software"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_1_6",
								"rowspan": 3,
								"colidx": 7,
								"key": "4MYLTMR1NTO2J02B475JMTIR5/SUMME",
								"style": "TOTAL",
								"_v": "Overall Result"
							}
						} ]
					}
				},
				{
					"row": {
						"rowidx": "3",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_2_4",
								"colidx": 5,
								"style": "TITLE",
								"_v": "Area"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_2_5",
								"rowspan": 2,
								"colidx": 6,
								"key": "4MYLTMR1NTO2J02B475JMTIR5/DS30/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						} ]
					}
				},
				{
					"row": {
						"rowidx": "4",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_4",
								"colidx": 5,
								"style": "TITLE",
								"_v": "Region Code"
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
										"style": "TITLE",
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Calendar Year/Month"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_1",
										"colidx": 2,
										"style": "TITLE",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Product"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_2",
										"colidx": 3,
										"style": "TITLE",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Distribution Channel"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_3",
										"colidx": 4,
										"style": "TITLE",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Customer"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_4",
										"colidx": 5,
										"style": "TITLE"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_5",
										"colidx": 6,
										"style": "TOTAL",
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_4_6",
										"colidx": 7,
										"style": "TOTAL",
										"_v": "* 1,000 $"
									}
								} ]
					}
				}, {
					"row": {
						"rowidx": "6",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_0",
								"rowspan": 5,
								"colidx": 1,
								"key": "200301",
								"style": "HEADER",
								"_v": "JAN 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_1",
								"rowspan": 3,
								"colidx": 2,
								"key": "200301/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_2",
								"rowspan": 2,
								"colidx": 3,
								"key": "200301/PDS04/0",
								"style": "HEADER",
								"_v": "Internet"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_3",
								"colidx": 4,
								"key": "200301/PDS04/0/DS1102",
								"style": "HEADER",
								"_v": "DS1102"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_4",
								"colidx": 5,
								"key": "200301/PDS04/0/DS1102",
								"style": "HEADER",
								"_v": "Danilko & Wallace Hardware & Supply Ltd"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "10"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "7",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_3",
								"colspan": 2,
								"colidx": 4,
								"key": "200301/PDS04/0/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "10"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "8",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_2",
								"colspan": 3,
								"colidx": 3,
								"key": "200301/PDS04/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "10"
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
								"rowspan": 2,
								"colidx": 2,
								"key": "200301/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_2",
								"rowspan": 2,
								"colidx": 3,
								"key": "200301/PDS08/0",
								"style": "HEADER",
								"_v": "Internet"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_3",
								"colidx": 4,
								"key": "200301/PDS08/0/DS1102",
								"style": "HEADER",
								"_v": "DS1102"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_4",
								"colidx": 5,
								"key": "200301/PDS08/0/DS1102",
								"style": "HEADER",
								"_v": "Danilko & Wallace Hardware & Supply Ltd"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "4"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "4"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "10",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_3",
								"colspan": 2,
								"colidx": 4,
								"key": "200301/PDS08/0/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "4"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "4"
							}
						} ]
					}
				} ]
	}
}
