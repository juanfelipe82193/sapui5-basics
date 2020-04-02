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

sapzen.crosstab.test.jsonTestData.bigTable = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 3,
		"fixedrowheaders": 2,
		"totaldatarows": 156,
		"totaldatacols": 20,
		"sentdatarows": 156,
		"sentdatacols": 20,
		"tilerows": 10000,
		"tilecols": 10000,
		"changed": true,
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
								"colspan": 5,
								"colidx": 3,
								"key": "4MSMDE1S2BKV7QOCSAZ4ME1PU",
								"style": "HEADER",
								"_v": "Number of Lost Deals"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_7",
								"colspan": 5,
								"colidx": 8,
								"key": "4MSMBMGR3VVN15OKHFLHE4OC2",
								"style": "HEADER",
								"_v": "Net Sales"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_12",
								"colspan": 5,
								"colidx": 13,
								"key": "4MSMBMOFMUHCJS80N9NTO6N1U",
								"style": "HEADER",
								"_v": "Billed Quantity"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_0_17",
								"colspan": 5,
								"colidx": 18,
								"key": "4MSMDE9GLA6KQD7SY51GWG0FM",
								"style": "HEADER",
								"_v": "Billed Quantity Plan"
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
										"key": "4MSMDE1S2BKV7QOCSAZ4ME1PU/DS20",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_3",
										"colidx": 4,
										"key": "4MSMDE1S2BKV7QOCSAZ4ME1PU/DS10",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Computer,keybord"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_4",
										"colidx": 5,
										"key": "4MSMDE1S2BKV7QOCSAZ4ME1PU/DS30",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_5",
										"colidx": 6,
										"key": "4MSMDE1S2BKV7QOCSAZ4ME1PU/",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Not assigned"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_6",
										"colidx": 7,
										"key": "4MSMDE1S2BKV7QOCSAZ4ME1PU/SUMME",
										"style": "TOTAL",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_7",
										"colidx": 8,
										"key": "4MSMBMGR3VVN15OKHFLHE4OC2/DS20",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_8",
										"colidx": 9,
										"key": "4MSMBMGR3VVN15OKHFLHE4OC2/DS10",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Computer,keybord"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_9",
										"colidx": 10,
										"key": "4MSMBMGR3VVN15OKHFLHE4OC2/DS30",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_10",
										"colidx": 11,
										"key": "4MSMBMGR3VVN15OKHFLHE4OC2/",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Not assigned"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_11",
										"colidx": 12,
										"key": "4MSMBMGR3VVN15OKHFLHE4OC2/SUMME",
										"style": "TOTAL",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_12",
										"colidx": 13,
										"key": "4MSMBMOFMUHCJS80N9NTO6N1U/DS20",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_13",
										"colidx": 14,
										"key": "4MSMBMOFMUHCJS80N9NTO6N1U/DS10",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Computer,keybord"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_14",
										"colidx": 15,
										"key": "4MSMBMOFMUHCJS80N9NTO6N1U/DS30",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_15",
										"colidx": 16,
										"key": "4MSMBMOFMUHCJS80N9NTO6N1U/",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Not assigned"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_16",
										"colidx": 17,
										"key": "4MSMBMOFMUHCJS80N9NTO6N1U/SUMME",
										"style": "TOTAL",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','15',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_17",
										"colidx": 18,
										"key": "4MSMDE9GLA6KQD7SY51GWG0FM/DS20",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','16',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_18",
										"colidx": 19,
										"key": "4MSMDE9GLA6KQD7SY51GWG0FM/DS10",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','17',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Computer,keybord"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_19",
										"colidx": 20,
										"key": "4MSMDE9GLA6KQD7SY51GWG0FM/DS30",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','18',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_20",
										"colidx": 21,
										"key": "4MSMDE9GLA6KQD7SY51GWG0FM/",
										"style": "HEADER",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','19',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Not assigned"
									}
								},
								{
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_1_21",
										"colidx": 22,
										"key": "4MSMDE9GLA6KQD7SY51GWG0FM/SUMME",
										"style": "TOTAL",
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','20',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
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
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','21',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
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
										"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','22',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Product"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_2",
										"colidx": 3,
										"style": "HEADER"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_3",
										"colidx": 4,
										"style": "HEADER"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_4",
										"colidx": 5,
										"style": "HEADER"
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
										"style": "TOTAL",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_7",
										"colidx": 8,
										"style": "HEADER",
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_8",
										"colidx": 9,
										"style": "HEADER",
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_9",
										"colidx": 10,
										"style": "HEADER",
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_10",
										"colidx": 11,
										"style": "HEADER"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_11",
										"colidx": 12,
										"style": "TOTAL",
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_12",
										"colidx": 13,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_13",
										"colidx": 14,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_14",
										"colidx": 15,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_15",
										"colidx": 16,
										"style": "HEADER"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_16",
										"colidx": 17,
										"style": "TOTAL",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_17",
										"colidx": 18,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_18",
										"colidx": 19,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_19",
										"colidx": 20,
										"style": "HEADER",
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_20",
										"colidx": 21,
										"style": "HEADER"
									}
								}, {
									"control": {
										"type": "xcell",
										"id": "CROSSTAB_1_ia_pt_2_21",
										"colidx": 22,
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
								"rowspan": 13,
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
								"key": "200301/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
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
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_4",
								"colidx": 5,
								"_v": ""
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
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_8",
								"colidx": 9,
								"_v": "21,901"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,901"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_13",
								"colidx": 14,
								"_v": "1,767"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,767"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_18",
								"colidx": 19,
								"_v": "1,709"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_3_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,709"
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
								"key": "200301/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
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
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
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
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "18,333"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,333"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "1,998"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,998"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "1,925"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_4_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,925"
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
								"key": "200301/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_2",
								"colidx": 3,
								"_v": ""
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
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_7",
								"colidx": 8,
								"_v": "26,120"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "26,120"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_12",
								"colidx": 13,
								"_v": "5,701"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,701"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_17",
								"colidx": 18,
								"_v": "5,429"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_5_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,429"
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
								"key": "200301/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
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
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "24,598"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,598"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "2,332"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,332"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "2,252"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_6_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,252"
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
								"key": "200301/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
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
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_4",
								"colidx": 5,
								"_v": ""
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
								"style": "TOTAL",
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
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_9",
								"colidx": 10,
								"_v": "23,380"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,380"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_14",
								"colidx": 15,
								"_v": "4,637"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,637"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_19",
								"colidx": 20,
								"_v": "4,477"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_7_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,477"
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
								"key": "200301/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "22,927"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,927"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "16,612"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,612"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "15,771"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_8_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "15,771"
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
								"key": "200301/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_2",
								"colidx": 3,
								"_v": ""
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
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
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
								"_v": "24,139"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,139"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_13",
								"colidx": 14,
								"_v": "1,948"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,948"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_18",
								"colidx": 19,
								"_v": "1,899"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_9_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,899"
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
								"key": "200301/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
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
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
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
								"_v": "20,962"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,962"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "2,284"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,284"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "2,193"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_10_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,193"
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
								"key": "200301/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_7",
								"colidx": 8,
								"_v": "24,578"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,578"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_12",
								"colidx": 13,
								"_v": "10,731"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,731"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_17",
								"colidx": 18,
								"_v": "10,464"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_11_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,464"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "13",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_1",
								"colidx": 2,
								"key": "200301/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "20,312"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,312"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "14,717"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,717"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "14,077"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_12_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "14,077"
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
								"key": "200301/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
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
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_9",
								"colidx": 10,
								"_v": "22,238"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,238"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_14",
								"colidx": 15,
								"_v": "9,709"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,709"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_19",
								"colidx": 20,
								"_v": "9,316"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_13_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,316"
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
								"key": "200301/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": "20,049"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "20,049"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_14_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
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
								"key": "200301/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
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
								"style": "TOTAL",
								"_v": "20,049"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "20,049"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "91,959"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "67,002"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "90,528"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "249,488"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "35,041"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,999"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "31,395"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "72,435"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "33,589"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,801"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "30,122"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_15_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "69,511"
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
								"rowspan": 13,
								"colidx": 1,
								"key": "200302",
								"style": "HEADER",
								"_v": "FEB 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_1",
								"colidx": 2,
								"key": "200302/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "21,373"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,373"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,725"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,725"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,718"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_16_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,718"
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
								"key": "200302/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_7",
								"colidx": 8,
								"_v": "18,114"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,114"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_12",
								"colidx": 13,
								"_v": "1,974"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,974"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_17",
								"colidx": 18,
								"_v": "1,966"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_17_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,966"
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
								"key": "200302/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "25,422"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,422"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "5,549"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,549"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "5,456"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_18_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,456"
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
								"key": "200302/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_9",
								"colidx": 10,
								"_v": "24,018"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,018"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_14",
								"colidx": 15,
								"_v": "2,277"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,277"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_19",
								"colidx": 20,
								"_v": "2,247"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_19_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,247"
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
								"key": "200302/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "22,890"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,890"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "4,540"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,540"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "4,536"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_20_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,536"
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
								"key": "200302/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_7",
								"colidx": 8,
								"_v": "22,349"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,349"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_12",
								"colidx": 13,
								"_v": "16,193"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,193"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_17",
								"colidx": 18,
								"_v": "16,236"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_21_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "16,236"
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
								"key": "200302/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "23,543"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,543"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,900"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,900"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,887"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_22_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,887"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "24",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_1",
								"colidx": 2,
								"key": "200302/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_8",
								"colidx": 9,
								"_v": "20,490"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,490"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_13",
								"colidx": 14,
								"_v": "2,233"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,233"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_18",
								"colidx": 19,
								"_v": "2,235"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_23_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,235"
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
								"key": "200302/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "24,083"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,083"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "10,515"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,515"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "10,428"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_24_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,428"
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
								"key": "200302/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_9",
								"colidx": 10,
								"_v": "19,704"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "19,704"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_14",
								"colidx": 15,
								"_v": "14,277"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,277"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_19",
								"colidx": 20,
								"_v": "14,067"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_25_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "14,067"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "27",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_1",
								"colidx": 2,
								"key": "200302/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "21,752"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,752"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "9,497"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,497"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "9,533"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_26_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,533"
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
								"key": "200302/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_5",
								"colidx": 6,
								"_v": "22,660"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "22,660"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_27_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "29",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_1",
								"colidx": 2,
								"key": "200302/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "22,660"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "22,660"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "89,968"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "65,407"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "88,364"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "243,739"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "34,231"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,857"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,590"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "70,678"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "34,087"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,839"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "30,383"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_28_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "70,309"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "30",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200303",
								"style": "HEADER",
								"_v": "MAR 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_1",
								"colidx": 2,
								"key": "200303/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_8",
								"colidx": 9,
								"_v": "21,568"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,568"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_13",
								"colidx": 14,
								"_v": "1,740"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,740"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_18",
								"colidx": 19,
								"_v": "1,755"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_29_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,755"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "31",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_1",
								"colidx": 2,
								"key": "200303/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "18,264"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,264"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "1,990"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,990"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "1,985"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_30_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,985"
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
								"key": "200303/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_7",
								"colidx": 8,
								"_v": "25,677"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,677"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_12",
								"colidx": 13,
								"_v": "5,604"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,604"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_17",
								"colidx": 18,
								"_v": "5,628"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_31_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,628"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "33",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_1",
								"colidx": 2,
								"key": "200303/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "24,140"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,140"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "2,288"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,288"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "2,267"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_32_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,267"
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
								"key": "200303/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_9",
								"colidx": 10,
								"_v": "23,007"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,007"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_14",
								"colidx": 15,
								"_v": "4,563"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,563"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_19",
								"colidx": 20,
								"_v": "4,588"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_33_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,588"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "35",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_1",
								"colidx": 2,
								"key": "200303/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "22,520"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,520"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "16,317"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,317"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "16,138"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_34_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "16,138"
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
								"key": "200303/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_8",
								"colidx": 9,
								"_v": "23,768"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,768"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_13",
								"colidx": 14,
								"_v": "1,918"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,918"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_18",
								"colidx": 19,
								"_v": "1,952"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_35_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,952"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "37",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_1",
								"colidx": 2,
								"key": "200303/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "20,740"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,740"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "2,260"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,260"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "2,283"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_36_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,283"
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
								"key": "200303/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_7",
								"colidx": 8,
								"_v": "24,285"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,285"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_12",
								"colidx": 13,
								"_v": "10,602"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,602"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_17",
								"colidx": 18,
								"_v": "10,742"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_37_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,742"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "39",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_1",
								"colidx": 2,
								"key": "200303/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "20,044"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,044"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "14,523"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,523"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "14,475"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_38_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "14,475"
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
								"key": "200303/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_9",
								"colidx": 10,
								"_v": "22,006"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,006"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_14",
								"colidx": 15,
								"_v": "9,608"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,608"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_19",
								"colidx": 20,
								"_v": "9,662"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_39_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,662"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "41",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_1",
								"colidx": 2,
								"key": "200303/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": "17,647"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "17,647"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_40_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
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
								"key": "200303/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "17,647"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "17,647"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "90,745"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "66,076"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "89,197"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "246,018"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "34,514"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,918"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,981"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "71,413"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "34,494"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,989"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "30,992"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_41_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "71,475"
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
								"rowspan": 13,
								"colidx": 1,
								"key": "200304",
								"style": "HEADER",
								"_v": "APR 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_1",
								"colidx": 2,
								"key": "200304/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "21,635"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,635"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,746"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,746"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,692"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_42_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,692"
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
								"key": "200304/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_7",
								"colidx": 8,
								"_v": "18,271"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,271"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_12",
								"colidx": 13,
								"_v": "1,990"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,990"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_17",
								"colidx": 18,
								"_v": "1,926"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_43_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,926"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "45",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_1",
								"colidx": 2,
								"key": "200304/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "25,629"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,629"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "5,593"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,593"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "5,443"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_44_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,443"
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
								"key": "200304/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_9",
								"colidx": 10,
								"_v": "24,108"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,108"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_14",
								"colidx": 15,
								"_v": "2,285"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,285"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_19",
								"colidx": 20,
								"_v": "2,231"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_45_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,231"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "47",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_1",
								"colidx": 2,
								"key": "200304/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "22,890"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,890"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "4,540"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,540"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "4,391"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_46_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,391"
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
								"key": "200304/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_7",
								"colidx": 8,
								"_v": "22,376"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,376"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_12",
								"colidx": 13,
								"_v": "16,212"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,212"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_17",
								"colidx": 18,
								"_v": "15,536"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_47_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "15,536"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "49",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_1",
								"colidx": 2,
								"key": "200304/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "23,594"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,594"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,904"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,904"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,838"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_48_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,838"
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
								"key": "200304/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_8",
								"colidx": 9,
								"_v": "20,554"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,554"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_13",
								"colidx": 14,
								"_v": "2,239"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,239"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_18",
								"colidx": 19,
								"_v": "2,186"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_49_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,186"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "51",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_1",
								"colidx": 2,
								"key": "200304/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "24,313"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,313"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "10,615"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,615"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "10,365"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_50_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,365"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "52",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_1",
								"colidx": 2,
								"key": "200304/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_9",
								"colidx": 10,
								"_v": "20,029"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,029"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_14",
								"colidx": 15,
								"_v": "14,512"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,512"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_19",
								"colidx": 20,
								"_v": "14,142"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_51_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "14,142"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "53",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_1",
								"colidx": 2,
								"key": "200304/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "22,003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "9,606"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,606"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "9,180"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_52_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,180"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "54",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_1",
								"colidx": 2,
								"key": "200304/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_5",
								"colidx": 6,
								"_v": "21,080"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "21,080"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_53_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "55",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_1",
								"colidx": 2,
								"key": "200304/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "21,080"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "21,080"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "90,590"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "65,783"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "89,030"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "245,403"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "34,411"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,889"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,943"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "71,243"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "33,270"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,715"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "29,945"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_54_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "68,930"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "56",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200305",
								"style": "HEADER",
								"_v": "MAY 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_1",
								"colidx": 2,
								"key": "200305/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_8",
								"colidx": 9,
								"_v": "21,114"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,114"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_13",
								"colidx": 14,
								"_v": "1,704"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,704"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_18",
								"colidx": 19,
								"_v": "1,659"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_55_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,659"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "57",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_1",
								"colidx": 2,
								"key": "200305/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "17,886"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "17,886"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "1,949"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,949"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "1,893"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_56_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,893"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "58",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_1",
								"colidx": 2,
								"key": "200305/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_7",
								"colidx": 8,
								"_v": "25,128"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,128"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_12",
								"colidx": 13,
								"_v": "5,484"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,484"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_17",
								"colidx": 18,
								"_v": "5,260"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_57_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,260"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "59",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_1",
								"colidx": 2,
								"key": "200305/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "23,805"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,805"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "2,257"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,257"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "2,214"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_58_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,214"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "60",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_1",
								"colidx": 2,
								"key": "200305/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_9",
								"colidx": 10,
								"_v": "22,469"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,469"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_14",
								"colidx": 15,
								"_v": "4,456"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,456"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_19",
								"colidx": 20,
								"_v": "4,318"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_59_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,318"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "61",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_1",
								"colidx": 2,
								"key": "200305/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "22,117"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,117"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "16,025"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,025"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "15,543"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_60_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "15,543"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "62",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_1",
								"colidx": 2,
								"key": "200305/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_8",
								"colidx": 9,
								"_v": "23,134"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,134"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_13",
								"colidx": 14,
								"_v": "1,866"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,866"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_18",
								"colidx": 19,
								"_v": "1,817"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_61_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,817"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "63",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_1",
								"colidx": 2,
								"key": "200305/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "20,254"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,254"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "2,207"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,207"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "2,133"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_62_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,133"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "64",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_1",
								"colidx": 2,
								"key": "200305/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_7",
								"colidx": 8,
								"_v": "23,742"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,742"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_12",
								"colidx": 13,
								"_v": "10,366"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,366"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_17",
								"colidx": 18,
								"_v": "10,093"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_63_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,093"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "65",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_1",
								"colidx": 2,
								"key": "200305/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "19,566"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "19,566"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "14,176"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,176"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "13,803"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_64_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "13,803"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "66",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_1",
								"colidx": 2,
								"key": "200305/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_9",
								"colidx": 10,
								"_v": "21,399"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,399"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_14",
								"colidx": 15,
								"_v": "9,343"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,343"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_19",
								"colidx": 20,
								"_v": "9,081"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_65_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,081"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "67",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_1",
								"colidx": 2,
								"key": "200305/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": "22,236"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "22,236"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_66_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "68",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_1",
								"colidx": 2,
								"key": "200305/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "22,236"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "22,236"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "88,873"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "64,502"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "87,238"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "240,613"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "33,823"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,777"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,232"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "69,832"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "32,789"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,609"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "29,415"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_67_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "67,813"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "69",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200306",
								"style": "HEADER",
								"_v": "JUN 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_1",
								"colidx": 2,
								"key": "200306/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "21,404"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,404"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,726"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,726"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,729"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_68_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,729"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "70",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_1",
								"colidx": 2,
								"key": "200306/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_7",
								"colidx": 8,
								"_v": "18,101"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,101"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_12",
								"colidx": 13,
								"_v": "1,973"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,973"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_17",
								"colidx": 18,
								"_v": "1,977"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_69_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,977"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "71",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_1",
								"colidx": 2,
								"key": "200306/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "25,439"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,439"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "5,552"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,552"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "5,604"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_70_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,604"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "72",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_1",
								"colidx": 2,
								"key": "200306/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_9",
								"colidx": 10,
								"_v": "24,051"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,051"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_14",
								"colidx": 15,
								"_v": "2,279"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,279"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_19",
								"colidx": 20,
								"_v": "2,300"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_71_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,300"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "73",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_1",
								"colidx": 2,
								"key": "200306/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "22,861"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,861"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "4,534"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,534"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "4,527"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_72_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,527"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "74",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_1",
								"colidx": 2,
								"key": "200306/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_7",
								"colidx": 8,
								"_v": "22,267"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,267"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_12",
								"colidx": 13,
								"_v": "16,134"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,134"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_17",
								"colidx": 18,
								"_v": "16,242"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_73_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "16,242"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "75",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_1",
								"colidx": 2,
								"key": "200306/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "23,388"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,388"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,886"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,886"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,890"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_74_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,890"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "76",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_1",
								"colidx": 2,
								"key": "200306/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_8",
								"colidx": 9,
								"_v": "20,440"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,440"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_13",
								"colidx": 14,
								"_v": "2,227"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,227"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_18",
								"colidx": 19,
								"_v": "2,214"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_75_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,214"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "77",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_1",
								"colidx": 2,
								"key": "200306/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "24,031"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,031"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "10,492"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,492"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "10,575"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_76_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,575"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "78",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_1",
								"colidx": 2,
								"key": "200306/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_9",
								"colidx": 10,
								"_v": "19,783"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "19,783"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_14",
								"colidx": 15,
								"_v": "14,334"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,334"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_19",
								"colidx": 20,
								"_v": "14,245"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_77_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "14,245"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "79",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_1",
								"colidx": 2,
								"key": "200306/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "21,754"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,754"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "9,498"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,498"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "9,552"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_78_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,552"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "80",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_1",
								"colidx": 2,
								"key": "200306/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_5",
								"colidx": 6,
								"_v": "20,913"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "20,913"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_79_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "81",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_1",
								"colidx": 2,
								"key": "200306/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "20,913"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "20,913"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "89,838"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "65,232"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "88,449"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "243,519"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "34,151"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,840"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,645"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "70,636"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "34,399"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,833"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "30,624"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_80_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "70,855"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "82",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200307",
								"style": "HEADER",
								"_v": "JUL 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_1",
								"colidx": 2,
								"key": "200307/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_8",
								"colidx": 9,
								"_v": "21,583"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,583"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_13",
								"colidx": 14,
								"_v": "1,741"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,741"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_18",
								"colidx": 19,
								"_v": "1,749"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_81_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,749"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "83",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_1",
								"colidx": 2,
								"key": "200307/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "18,243"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,243"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "1,988"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,988"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "1,993"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_82_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,993"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "84",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_1",
								"colidx": 2,
								"key": "200307/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_7",
								"colidx": 8,
								"_v": "25,584"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,584"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_12",
								"colidx": 13,
								"_v": "5,583"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,583"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_17",
								"colidx": 18,
								"_v": "5,602"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_83_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,602"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "85",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_1",
								"colidx": 2,
								"key": "200307/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "24,148"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,148"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "2,288"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,288"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "2,325"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_84_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,325"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "86",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_1",
								"colidx": 2,
								"key": "200307/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_9",
								"colidx": 10,
								"_v": "22,866"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,866"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_14",
								"colidx": 15,
								"_v": "4,534"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,534"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_19",
								"colidx": 20,
								"_v": "4,572"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_85_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,572"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "87",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_1",
								"colidx": 2,
								"key": "200307/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "22,326"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,326"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "16,176"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,176"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "16,091"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_86_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "16,091"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "88",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_1",
								"colidx": 2,
								"key": "200307/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_8",
								"colidx": 9,
								"_v": "23,587"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,587"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_13",
								"colidx": 14,
								"_v": "1,903"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,903"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_18",
								"colidx": 19,
								"_v": "1,891"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_87_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,891"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "89",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_1",
								"colidx": 2,
								"key": "200307/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "20,632"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,632"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "2,248"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,248"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "2,214"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_88_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,214"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "90",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_1",
								"colidx": 2,
								"key": "200307/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_7",
								"colidx": 8,
								"_v": "24,217"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,217"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_12",
								"colidx": 13,
								"_v": "10,573"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,573"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_17",
								"colidx": 18,
								"_v": "10,506"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_89_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,506"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "91",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_1",
								"colidx": 2,
								"key": "200307/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "19,902"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "19,902"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "14,420"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,420"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "14,491"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_90_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "14,491"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "92",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_1",
								"colidx": 2,
								"key": "200307/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_9",
								"colidx": 10,
								"_v": "21,784"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,784"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_14",
								"colidx": 15,
								"_v": "9,510"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,510"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_19",
								"colidx": 20,
								"_v": "9,561"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_91_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,561"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "93",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_1",
								"colidx": 2,
								"key": "200307/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": "17,212"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "17,212"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_92_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "94",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_1",
								"colidx": 2,
								"key": "200307/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "17,212"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "17,212"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "90,370"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "65,801"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "88,699"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "244,870"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "34,320"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,892"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,753"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "70,965"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "34,192"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,854"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "30,949"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_93_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "70,995"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "95",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200308",
								"style": "HEADER",
								"_v": "AUG 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_1",
								"colidx": 2,
								"key": "200308/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "21,081"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,081"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,701"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,701"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,691"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_94_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,691"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "96",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_1",
								"colidx": 2,
								"key": "200308/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_7",
								"colidx": 8,
								"_v": "17,777"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "17,777"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_12",
								"colidx": 13,
								"_v": "1,937"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,937"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_17",
								"colidx": 18,
								"_v": "1,895"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_95_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,895"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "97",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_1",
								"colidx": 2,
								"key": "200308/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "25,079"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,079"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "5,474"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,474"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "5,392"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_96_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,392"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "98",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_1",
								"colidx": 2,
								"key": "200308/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_9",
								"colidx": 10,
								"_v": "23,557"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,557"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_14",
								"colidx": 15,
								"_v": "2,233"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,233"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_19",
								"colidx": 20,
								"_v": "2,163"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_97_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,163"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "99",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_1",
								"colidx": 2,
								"key": "200308/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "22,454"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,454"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "4,453"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,453"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "4,418"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_98_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,418"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "100",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_1",
								"colidx": 2,
								"key": "200308/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_7",
								"colidx": 8,
								"_v": "21,937"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,937"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_12",
								"colidx": 13,
								"_v": "15,894"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "15,894"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_17",
								"colidx": 18,
								"_v": "15,416"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_99_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "15,416"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "101",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_1",
								"colidx": 2,
								"key": "200308/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "23,047"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,047"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,860"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,860"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,823"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_100_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,823"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "102",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_1",
								"colidx": 2,
								"key": "200308/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_8",
								"colidx": 9,
								"_v": "20,096"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,096"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_13",
								"colidx": 14,
								"_v": "2,190"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,190"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_18",
								"colidx": 19,
								"_v": "2,157"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_101_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,157"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "103",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_1",
								"colidx": 2,
								"key": "200308/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "23,542"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,542"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "10,278"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,278"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "10,107"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_102_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,107"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "104",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_1",
								"colidx": 2,
								"key": "200308/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_9",
								"colidx": 10,
								"_v": "19,535"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "19,535"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_14",
								"colidx": 15,
								"_v": "14,153"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,153"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_19",
								"colidx": 20,
								"_v": "13,995"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_103_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "13,995"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "105",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_1",
								"colidx": 2,
								"key": "200308/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "21,449"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,449"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "9,365"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,365"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "9,100"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_104_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,100"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "106",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_1",
								"colidx": 2,
								"key": "200308/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_5",
								"colidx": 6,
								"_v": "18,280"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "18,280"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_105_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "107",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_1",
								"colidx": 2,
								"key": "200308/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "18,280"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "18,280"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "88,335"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "64,224"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "86,995"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "239,553"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "33,583"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,751"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,204"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "69,537"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "32,810"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,670"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "29,676"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_106_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "68,156"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "108",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200309",
								"style": "HEADER",
								"_v": "SEP 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_1",
								"colidx": 2,
								"key": "200309/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_8",
								"colidx": 9,
								"_v": "21,542"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,542"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_13",
								"colidx": 14,
								"_v": "1,738"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,738"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_18",
								"colidx": 19,
								"_v": "1,633"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_107_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,633"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "109",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_1",
								"colidx": 2,
								"key": "200309/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "18,252"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,252"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "1,989"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,989"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "1,879"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_108_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,879"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "110",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_1",
								"colidx": 2,
								"key": "200309/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_7",
								"colidx": 8,
								"_v": "25,746"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,746"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_12",
								"colidx": 13,
								"_v": "5,619"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,619"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_17",
								"colidx": 18,
								"_v": "5,233"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_109_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,233"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "111",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_1",
								"colidx": 2,
								"key": "200309/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "24,181"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,181"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "2,292"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,292"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "2,179"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_110_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,179"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "112",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_1",
								"colidx": 2,
								"key": "200309/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_9",
								"colidx": 10,
								"_v": "23,051"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,051"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_14",
								"colidx": 15,
								"_v": "4,572"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,572"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_19",
								"colidx": 20,
								"_v": "4,265"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_111_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,265"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "113",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_1",
								"colidx": 2,
								"key": "200309/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "22,576"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,576"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "16,358"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,358"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "15,357"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_112_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "15,357"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "114",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_1",
								"colidx": 2,
								"key": "200309/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_8",
								"colidx": 9,
								"_v": "23,698"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,698"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_13",
								"colidx": 14,
								"_v": "1,912"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,912"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_18",
								"colidx": 19,
								"_v": "1,804"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_113_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,804"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "115",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_1",
								"colidx": 2,
								"key": "200309/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "20,563"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,563"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "2,241"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,241"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "2,096"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_114_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,096"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "116",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_1",
								"colidx": 2,
								"key": "200309/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_7",
								"colidx": 8,
								"_v": "24,272"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,272"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_12",
								"colidx": 13,
								"_v": "10,597"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,597"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_17",
								"colidx": 18,
								"_v": "9,950"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_115_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,950"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "117",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_1",
								"colidx": 2,
								"key": "200309/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "20,106"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,106"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "14,568"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,568"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "13,635"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_116_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "13,635"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "118",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_1",
								"colidx": 2,
								"key": "200309/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_9",
								"colidx": 10,
								"_v": "21,968"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,968"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_14",
								"colidx": 15,
								"_v": "9,591"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,591"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_19",
								"colidx": 20,
								"_v": "8,886"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_117_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "8,886"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "119",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_1",
								"colidx": 2,
								"key": "200309/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": "17,369"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "17,369"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_118_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "120",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_1",
								"colidx": 2,
								"key": "200309/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "17,369"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "17,369"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "90,845"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "65,803"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "89,306"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "245,955"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "34,562"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,891"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "31,022"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "71,475"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "32,418"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,533"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "28,966"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_119_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "66,916"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "121",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200310",
								"style": "HEADER",
								"_v": "OCT 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_1",
								"colidx": 2,
								"key": "200310/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "21,188"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,188"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,710"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,710"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,630"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_120_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,630"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "122",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_1",
								"colidx": 2,
								"key": "200310/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_7",
								"colidx": 8,
								"_v": "17,788"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "17,788"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_12",
								"colidx": 13,
								"_v": "1,938"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,938"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_17",
								"colidx": 18,
								"_v": "1,876"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_121_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,876"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "123",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_1",
								"colidx": 2,
								"key": "200310/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "25,093"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,093"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "5,476"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,476"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "5,312"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_122_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,312"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "124",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_1",
								"colidx": 2,
								"key": "200310/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_9",
								"colidx": 10,
								"_v": "23,724"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,724"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_14",
								"colidx": 15,
								"_v": "2,249"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,249"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_19",
								"colidx": 20,
								"_v": "2,178"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_123_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,178"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "125",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_1",
								"colidx": 2,
								"key": "200310/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "22,658"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,658"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "4,493"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,493"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "4,358"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_124_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,358"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "126",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_1",
								"colidx": 2,
								"key": "200310/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_7",
								"colidx": 8,
								"_v": "22,039"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,039"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_12",
								"colidx": 13,
								"_v": "15,969"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "15,969"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_17",
								"colidx": 18,
								"_v": "15,479"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_125_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "15,479"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "127",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_1",
								"colidx": 2,
								"key": "200310/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "23,146"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,146"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,868"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,868"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,826"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_126_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,826"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "128",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_1",
								"colidx": 2,
								"key": "200310/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_8",
								"colidx": 9,
								"_v": "20,056"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,056"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_13",
								"colidx": 14,
								"_v": "2,185"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,185"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_18",
								"colidx": 19,
								"_v": "2,118"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_127_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,118"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "129",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_1",
								"colidx": 2,
								"key": "200310/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "23,604"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,604"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "10,305"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,305"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "10,097"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_128_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,097"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "130",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_1",
								"colidx": 2,
								"key": "200310/PDS10",
								"style": "HEADER",
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_9",
								"colidx": 10,
								"_v": "19,511"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "19,511"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_14",
								"colidx": 15,
								"_v": "14,137"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "14,137"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_19",
								"colidx": 20,
								"_v": "13,667"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_129_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "13,667"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "131",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_1",
								"colidx": 2,
								"key": "200310/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "21,445"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,445"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "9,362"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,362"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "9,025"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_130_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,025"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "132",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_1",
								"colidx": 2,
								"key": "200310/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_5",
								"colidx": 6,
								"_v": "22,027"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "22,027"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_131_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "133",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_1",
								"colidx": 2,
								"key": "200310/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "22,027"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "22,027"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "88,524"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "64,390"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "87,339"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "240,252"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "33,689"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "5,762"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "30,242"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "69,693"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "32,764"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "5,574"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "29,228"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_132_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "67,566"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "134",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200311",
								"style": "HEADER",
								"_v": "NOV 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_1",
								"colidx": 2,
								"key": "200311/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_8",
								"colidx": 9,
								"_v": "21,132"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,132"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_13",
								"colidx": 14,
								"_v": "1,705"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,705"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_18",
								"colidx": 19,
								"_v": "1,675"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_133_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,675"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "135",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_1",
								"colidx": 2,
								"key": "200311/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "17,776"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "17,776"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "1,937"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,937"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "1,910"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_134_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,910"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "136",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_1",
								"colidx": 2,
								"key": "200311/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_7",
								"colidx": 8,
								"_v": "25,104"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,104"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_12",
								"colidx": 13,
								"_v": "5,479"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,479"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_17",
								"colidx": 18,
								"_v": "5,357"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_135_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,357"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "137",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_1",
								"colidx": 2,
								"key": "200311/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "23,647"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,647"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "2,241"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,241"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "2,204"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_136_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,204"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "138",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_1",
								"colidx": 2,
								"key": "200311/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_9",
								"colidx": 10,
								"_v": "22,387"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,387"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_14",
								"colidx": 15,
								"_v": "4,440"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,440"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_19",
								"colidx": 20,
								"_v": "4,450"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_137_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,450"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "139",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_1",
								"colidx": 2,
								"key": "200311/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "21,928"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,928"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "15,888"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "15,888"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "15,544"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_138_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "15,544"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "140",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_1",
								"colidx": 2,
								"key": "200311/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_8",
								"colidx": 9,
								"_v": "23,136"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,136"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_13",
								"colidx": 14,
								"_v": "1,867"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,867"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_18",
								"colidx": 19,
								"_v": "1,830"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_139_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,830"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "141",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_1",
								"colidx": 2,
								"key": "200311/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "20,027"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "20,027"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "2,182"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,182"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "2,148"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_140_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,148"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "142",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_1",
								"colidx": 2,
								"key": "200311/PDS12",
								"style": "HEADER",
								"_v": "PC Thinktank Is"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_8",
								"colidx": 9,
								"_v": "25,437"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "25,437"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_13",
								"colidx": 14,
								"_v": "938"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "938"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_18",
								"colidx": 19,
								"_v": "921"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_141_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "921"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "143",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_1",
								"colidx": 2,
								"key": "200311/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "23,753"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,753"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "10,371"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,371"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "10,209"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_142_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "10,209"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "144",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_1",
								"colidx": 2,
								"key": "200311/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_9",
								"colidx": 10,
								"_v": "21,489"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,489"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_14",
								"colidx": 15,
								"_v": "9,382"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,382"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_19",
								"colidx": 20,
								"_v": "9,384"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_143_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,384"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "145",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_1",
								"colidx": 2,
								"key": "200311/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": "14,887"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "14,887"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_144_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "146",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_1",
								"colidx": 2,
								"key": "200311/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "14,887"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "14,887"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "88,561"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "89,733"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "67,523"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "245,817"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "33,674"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "6,692"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "16,063"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "56,429"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "33,020"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "6,574"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "16,038"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_145_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "55,632"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "147",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_0",
								"rowspan": 13,
								"colidx": 1,
								"key": "200312",
								"style": "HEADER",
								"_v": "DEC 2003"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_1",
								"colidx": 2,
								"key": "200312/PDS03",
								"style": "HEADER",
								"_v": "A4 Writing Case"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "22,139"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,139"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,786"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,786"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,806"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_146_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,806"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "148",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_1",
								"colidx": 2,
								"key": "200312/PDS04",
								"style": "HEADER",
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_7",
								"colidx": 8,
								"_v": "18,546"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "18,546"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_12",
								"colidx": 13,
								"_v": "2,021"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,021"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_17",
								"colidx": 18,
								"_v": "2,062"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_147_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,062"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "149",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_1",
								"colidx": 2,
								"key": "200312/PDS07",
								"style": "HEADER",
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": "26,325"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "26,325"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": "5,745"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "5,745"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": "5,902"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_148_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "5,902"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "150",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_1",
								"colidx": 2,
								"key": "200312/PDS11",
								"style": "HEADER",
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_9",
								"colidx": 10,
								"_v": "24,694"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,694"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_14",
								"colidx": 15,
								"_v": "2,340"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,340"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_19",
								"colidx": 20,
								"_v": "2,362"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_149_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,362"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "151",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_1",
								"colidx": 2,
								"key": "200312/PDS09",
								"style": "HEADER",
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "23,422"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "23,422"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "4,645"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "4,645"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "4,691"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_150_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "4,691"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "152",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_1",
								"colidx": 2,
								"key": "200312/PDS05",
								"style": "HEADER",
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_7",
								"colidx": 8,
								"_v": "22,952"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,952"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_12",
								"colidx": 13,
								"_v": "16,629"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "16,629"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_17",
								"colidx": 18,
								"_v": "17,046"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_151_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "17,046"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "153",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_1",
								"colidx": 2,
								"key": "200312/PDS01",
								"style": "HEADER",
								"_v": "Notebook S\u000ady \u000a testeste asdf a\u0009fas"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "24,159"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,159"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "1,949"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "1,949"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,985"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_152_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,985"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "154",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_1",
								"colidx": 2,
								"key": "200312/PDS02",
								"style": "HEADER",
								"_v": "Notebook Speedy II"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_8",
								"colidx": 9,
								"_v": "21,086"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "21,086"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_13",
								"colidx": 14,
								"_v": "2,298"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "2,298"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_18",
								"colidx": 19,
								"_v": "2,329"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_153_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "2,329"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "155",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_1",
								"colidx": 2,
								"key": "200312/PDS12",
								"style": "HEADER",
								"_v": "PC Thinktank Is"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": "26,70312345678901234567890"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "26,703"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": "985"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "985"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": "1,011"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_154_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "1,011"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "156",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_1",
								"colidx": 2,
								"key": "200312/PDS06",
								"style": "HEADER",
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_5",
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_7",
								"colidx": 8,
								"_v": "24,841.00000000000000000000000000000000000000"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "24,841"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_12",
								"colidx": 13,
								"_v": "10,845"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "10,845"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_17",
								"colidx": 18,
								"_v": "11,078"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_155_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "11,078"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "157",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_1",
								"colidx": 2,
								"key": "200312/PDS08",
								"style": "HEADER",
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_2",
								"colidx": 3,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_3",
								"colidx": 4,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_4",
								"colidx": 5,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_5",
								"colidx": 6,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_7",
								"colidx": 8,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_8",
								"colidx": 9,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_9",
								"colidx": 10,
								"style": "ALTERNATING",
								"_v": "22,388"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_10",
								"colidx": 11,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "22,388"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_12",
								"colidx": 13,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_13",
								"colidx": 14,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_14",
								"colidx": 15,
								"style": "ALTERNATING",
								"_v": "9,774"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_15",
								"colidx": 16,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "9,774"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_17",
								"colidx": 18,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_18",
								"colidx": 19,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_19",
								"colidx": 20,
								"style": "ALTERNATING",
								"_v": "9,944"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_20",
								"colidx": 21,
								"style": "ALTERNATING",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_156_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "9,944"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "158",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_1",
								"colidx": 2,
								"key": "200312/",
								"style": "HEADER",
								"_v": "#"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_2",
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_3",
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_4",
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_5",
								"colidx": 6,
								"_v": "15,126"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "15,126"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_7",
								"colidx": 8,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_8",
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_9",
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_10",
								"colidx": 11,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_12",
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_13",
								"colidx": 14,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_14",
								"colidx": 15,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_15",
								"colidx": 16,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_17",
								"colidx": 18,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_18",
								"colidx": 19,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_19",
								"colidx": 20,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_20",
								"colidx": 21,
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_157_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "159",
						"cells": [ {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_1",
								"colidx": 2,
								"key": "200312/SUMME",
								"style": "TOTAL",
								"_v": "Result"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_2",
								"colidx": 3,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_3",
								"colidx": 4,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_4",
								"colidx": 5,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_5",
								"colidx": 6,
								"style": "TOTAL",
								"_v": "15,126"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_6",
								"colidx": 7,
								"style": "TOTAL",
								"_v": "15,126"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_7",
								"colidx": 8,
								"style": "TOTAL",
								"_v": "92,664"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_8",
								"colidx": 9,
								"style": "TOTAL",
								"_v": "94,087"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_9",
								"colidx": 10,
								"style": "TOTAL",
								"_v": "70,504"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_10",
								"colidx": 11,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_11",
								"colidx": 12,
								"style": "TOTAL",
								"_v": "257,254"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_12",
								"colidx": 13,
								"style": "TOTAL",
								"_v": "35,241"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_13",
								"colidx": 14,
								"style": "TOTAL",
								"_v": "7,017"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_14",
								"colidx": 15,
								"style": "TOTAL",
								"_v": "16,760"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_15",
								"colidx": 16,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_16",
								"colidx": 17,
								"style": "TOTAL",
								"_v": "59,018"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_17",
								"colidx": 18,
								"style": "TOTAL",
								"_v": "36,088"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_18",
								"colidx": 19,
								"style": "TOTAL",
								"_v": "7,131"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_19",
								"colidx": 20,
								"style": "TOTAL",
								"_v": "16,996"
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_20",
								"colidx": 21,
								"style": "TOTAL",
								"_v": ""
							}
						}, {
							"control": {
								"type": "xcell",
								"id": "CROSSTAB_1_ia_pt_158_21",
								"colidx": 22,
								"style": "TOTAL",
								"_v": "60,215"
							}
						} ]
					}
				} ]
	}
};