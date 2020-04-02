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

sapzen.crosstab.test.jsonTestData.qdExceptions = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 3,
		"fixedrowheaders": 2,
		"totaldatarows": 18,
		"totaldatacols": 12,
		"sentdatarows": 18,
		"sentdatacols": 12,
		"tilerows": 50,
		"tilecols": 30,
		"alwaysfill": false,
		"pixelscrolling": false,
		"onselectcommand": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
		"selectionenabled": false,
		"displayexceptions": true,
		"changed": true,
		"texts": {
			"rowtext": "Row",
			"coltext": "Column",
			"colwidthtext": "Double click to adjust column width"
		},
		"rows": [
				{
					"row": {
						"rowidx": "1",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 1
							}
						}, {
							"control": {
								"colidx": 2,
								"_v": ""
							}
						}, {
							"control": {
								"colspan": 3,
								"colidx": 3,
								"key": "4RLVABDUQSQ9Y9IE9P03B47JL",
								"_v": "Formula 3"
							}
						}, {
							"control": {
								"colspan": 3,
								"colidx": 6,
								"key": "4RL2E9KGZEYD6BF588H33WLYP",
								"_v": "CALC"
							}
						}, {
							"control": {
								"colspan": 3,
								"colidx": 9,
								"key": "4RL23Y3BZZ3BE8UJ1998UWPBL",
								"_v": "FORMULA"
							}
						}, {
							"control": {
								"colspan": 3,
								"colidx": 12,
								"key": "4MEWGNYIAO074E0JGQN52NFW1",
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
										"colidx": 2,
										"_v": "Product group"
									}
								},
								{
									"control": {
										"colidx": 3,
										"key": "4RLVABDUQSQ9Y9IE9P03B47JL/DS30",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"colidx": 4,
										"key": "4RLVABDUQSQ9Y9IE9P03B47JL/DS20",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"colidx": 5,
										"key": "4RLVABDUQSQ9Y9IE9P03B47JL/SUMME",
										"isinnermember": true,
										"isresult": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
									}
								},
								{
									"control": {
										"colidx": 6,
										"key": "4RL2E9KGZEYD6BF588H33WLYP/DS30",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"colidx": 7,
										"key": "4RL2E9KGZEYD6BF588H33WLYP/DS20",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"colidx": 8,
										"key": "4RL2E9KGZEYD6BF588H33WLYP/SUMME",
										"isinnermember": true,
										"isresult": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
									}
								},
								{
									"control": {
										"colidx": 9,
										"key": "4RL23Y3BZZ3BE8UJ1998UWPBL/DS30",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"colidx": 10,
										"key": "4RL23Y3BZZ3BE8UJ1998UWPBL/DS20",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"colidx": 11,
										"key": "4RL23Y3BZZ3BE8UJ1998UWPBL/SUMME",
										"isinnermember": true,
										"isresult": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall Result"
									}
								},
								{
									"control": {
										"colidx": 12,
										"key": "4MEWGNYIAO074E0JGQN52NFW1/DS30",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Hardware software"
									}
								},
								{
									"control": {
										"colidx": 13,
										"key": "4MEWGNYIAO074E0JGQN52NFW1/DS20",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Accessories+space"
									}
								},
								{
									"control": {
										"colidx": 14,
										"key": "4MEWGNYIAO074E0JGQN52NFW1/SUMME",
										"isinnermember": true,
										"isresult": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
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
										"colidx": 1,
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Calendar Year/Month"
									}
								},
								{
									"control": {
										"colidx": 2,
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Product"
									}
								}, {
									"control": {
										"colidx": 3,
										"_v": "PC"
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": "PC"
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": "PC"
									}
								}, {
									"control": {
										"colidx": 6,
										"_v": "$"
									}
								}, {
									"control": {
										"colidx": 7,
										"_v": "$"
									}
								}, {
									"control": {
										"colidx": 8,
										"_v": "$"
									}
								}, {
									"control": {
										"colidx": 9,
										"_v": "$"
									}
								}, {
									"control": {
										"colidx": 10,
										"_v": "$"
									}
								}, {
									"control": {
										"colidx": 11,
										"_v": "$"
									}
								}, {
									"control": {
										"colidx": 12,
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"colidx": 13,
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"colidx": 14,
										"_v": "* 1,000 PC"
									}
								} ]
					}
				}, {
					"row": {
						"rowidx": "4",
						"cells": [ {
							"control": {
								"rowspan": 9,
								"colidx": 1,
								"key": "200301",
								"_v": "JAN 2003"
							}
						}, {
							"control": {
								"colidx": 2,
								"key": "200301/PDS04",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "7,990,168"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "7,990,168"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,166,665.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,166,665.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "36,666,660.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "36,666,660.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "1,998"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "1,998"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "5",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/PDS07",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "22,804,596"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "22,804,596"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "13,059,939.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "13,059,939.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "52,239,756.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "52,239,756.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "5,701"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "5,701"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "6",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/PDS11",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,328,344"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,328,344"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,298,966.50"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,298,966.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "49,195,866.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "49,195,866.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "2,332"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "2,332"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "7",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/PDS09",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "18,547,200"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "18,547,200"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,689,873.50"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,689,873.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "46,759,494.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "46,759,494.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "4,637"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "4,637"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "8",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/PDS05",
								"isinnermember": true,
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "66,448,096"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "66,448,096"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,463,737.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,463,737.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "45,854,948.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "45,854,948.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "16,612"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "16,612"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "9",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/PDS06",
								"isinnermember": true,
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "42,922,432"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "42,922,432"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,289,016.50"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,289,016.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "49,156,066.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "49,156,066.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,731"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,731"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "10",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/PDS10",
								"isinnermember": true,
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "58,869,636"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "58,869,636"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,156,249.50"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,156,249.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "40,624,998.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "40,624,998.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "14,717"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "14,717"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "11",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/PDS08",
								"isinnermember": true,
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "38,835,420"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "38,835,420"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,118,903.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,118,903.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "44,475,612.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "44,475,612.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,709"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,709"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "12",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200301/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 3,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "125,580,600"
							}
						}, {
							"control": {
								"colidx": 4,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "140,165,292"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									}
								},
								"_v": "265,745,892"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "45,263,992.50"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "45,979,357.50"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 3
									}
								},
								"_v": "91,243,350.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "181,055,970.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "183,917,430.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									}
								},
								"_v": "364,973,400.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "31,395"
							}
						}, {
							"control": {
								"colidx": 13,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "35,041"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "66,436"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "13",
						"cells": [ {
							"control": {
								"rowspan": 9,
								"colidx": 1,
								"key": "200302",
								"_v": "FEB 2003"
							}
						}, {
							"control": {
								"colidx": 2,
								"key": "200302/PDS04",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Automatic umbrella"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "7,895,460"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "7,895,460"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,056,946.50"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,056,946.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "36,227,786.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "36,227,786.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "1,974"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "1,974"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "14",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/PDS07",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Camera Connector"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "22,195,196"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "22,195,196"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,711,044.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,711,044.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "50,844,176.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "50,844,176.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "5,549"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "5,549"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "15",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/PDS11",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,106,788"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,106,788"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,009,196.50"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,009,196.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "48,036,786.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "48,036,786.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "2,277"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "2,277"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "16",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/PDS09",
								"isinnermember": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "18,158,520"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "18,158,520"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,444,887.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,444,887.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "45,779,548.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "45,779,548.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "4,540"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "4,540"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "17",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/PDS05",
								"isinnermember": true,
								"_v": "iPhones PX2  updated"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "64,771,312"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "64,771,312"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,174,304.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "11,174,304.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "44,697,216.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "44,697,216.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "16,193"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "16,193"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "18",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/PDS06",
								"isinnermember": true,
								"_v": "Stereo Kit"
							}
						}, {
							"control": {
								"colidx": 3,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 4,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "42,060,088"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "42,060,088"
							}
						}, {
							"control": {
								"colidx": 6,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,041,589.50"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "12,041,589.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "48,166,358.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "48,166,358.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 13,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,515"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,515"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "19",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/PDS10",
								"isinnermember": true,
								"_v": "USB MegaStorage"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "57,106,176"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 6
									}
								},
								"_v": "57,106,176"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,851,919.50"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,851,919.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "39,407,678.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "39,407,678.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "14,277"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "14,277"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "20",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/PDS08",
								"isinnermember": true,
								"_v": "USB Storage"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "37,989,144"
							}
						}, {
							"control": {
								"colidx": 4,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "37,989,144"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,876,111.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "10,876,111.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "43,504,444.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "43,504,444.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,497"
							}
						}, {
							"control": {
								"colidx": 13,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									}
								},
								"_v": "9,497"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "21",
						"cells": [ {
							"control": {
								"colidx": 2,
								"key": "200302/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 3,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "122,360,628"
							}
						}, {
							"control": {
								"colidx": 4,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "136,922,056"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									}
								},
								"_v": "259,282,684"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "44,182,114.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 7
									}
								},
								"_v": "44,983,884.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 4
									}
								},
								"_v": "89,165,998.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "176,728,456.00"
							}
						}, {
							"control": {
								"colidx": 10,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 2
									}
								},
								"_v": "179,935,536.00"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									}
								},
								"_v": "356,663,992.00"
							}
						}, {
							"control": {
								"colidx": 12,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "30,590"
							}
						}, {
							"control": {
								"colidx": 13,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 8
									}
								},
								"_v": "34,231"
							}
						}, {
							"control": {
								"colidx": 14,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "64,821"
							}
						} ]
					}
				} ]
	}

};
