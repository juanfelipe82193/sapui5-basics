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

sapzen.crosstab.test.jsonTestData.mixedExceptions = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders": 3,
		"fixedrowheaders": 2,
		"totaldatarows": 18,
		"totaldatacols": 9,
		"sentdatarows": 18,
		"sentdatacols": 9,
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
								"key": "4U29UCFQFWUH0GA4XEAMRTC8H",
								"_v": "Billed Quantity"
							}
						}, {
							"control": {
								"colspan": 3,
								"colidx": 6,
								"key": "4U29XGO3HI1B5SGA6OI1OIKVL",
								"_v": "Net Sales"
							}
						}, {
							"control": {
								"colspan": 3,
								"colidx": 9,
								"key": "4U29XOCMG3QTSBWG0QUBQHANL",
								"_v": "Sales Plan"
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
										"key": "4U29UCFQFWUH0GA4XEAMRTC8H/DS30",
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
										"key": "4U29UCFQFWUH0GA4XEAMRTC8H/DS20",
										"isinnermember": true,
										"exceptionvisualizations": {
											"0": {
												"formattype": 8,
												"alertlevel": 1
											}
										},
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
										"key": "4U29UCFQFWUH0GA4XEAMRTC8H/SUMME",
										"isinnermember": true,
										"isresult": true,
										"exceptionvisualizations": {
											"0": {
												"formattype": 8,
												"alertlevel": 1
											}
										},
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
										"key": "4U29XGO3HI1B5SGA6OI1OIKVL/DS30",
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
										"key": "4U29XGO3HI1B5SGA6OI1OIKVL/DS20",
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
										"key": "4U29XGO3HI1B5SGA6OI1OIKVL/SUMME",
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
										"key": "4U29XOCMG3QTSBWG0QUBQHANL/DS30",
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
										"key": "4U29XOCMG3QTSBWG0QUBQHANL/DS20",
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
										"key": "4U29XOCMG3QTSBWG0QUBQHANL/SUMME",
										"isinnermember": true,
										"isresult": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
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
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Calendar Year/Month"
									}
								},
								{
									"control": {
										"colidx": 2,
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Product"
									}
								}, {
									"control": {
										"colidx": 3,
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"colidx": 4,
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"colidx": 5,
										"_v": "* 1,000 PC"
									}
								}, {
									"control": {
										"colidx": 6,
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"colidx": 7,
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"colidx": 8,
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"colidx": 9,
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"colidx": 10,
										"_v": "* 1,000 $"
									}
								}, {
									"control": {
										"colidx": 11,
										"_v": "* 1,000 $"
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
										"formattype": 8,
										"alertlevel": 1
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
									},
									"1": {
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "1,998"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									},
									"1": {
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "1,998"
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
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "18,333.33"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "18,333.33"
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
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "17,666"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "17,666"
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
										"alertlevel": 5
									}
								},
								"_v": "5,701"
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
								"_v": "5,701"
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
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "26,119.88"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "26,119.88"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": "24,874"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "24,874"
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
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "2,332"
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
										"alertlevel": 5
									}
								},
								"_v": "2,332"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,597.93"
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
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,597.93"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": "23,756"
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
								"_v": "23,756"
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
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "4,637"
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
										"alertlevel": 5
									}
								},
								"_v": "4,637"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "23,379.75"
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
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "23,379.75"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": "22,574"
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
								"_v": "22,574"
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
										"alertlevel": 1
									}
								},
								"_v": "16,612"
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
								"_v": "16,612"
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
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,927.47"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,927.47"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": "21,767"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "21,767"
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
										"alertlevel": 1
									}
								},
								"_v": "10,731"
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
								"_v": "10,731"
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
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,578.03"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,578.03"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": "23,966"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "23,966"
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
										"alertlevel": 1
									}
								},
								"_v": "14,717"
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
										"alertlevel": 1
									}
								},
								"_v": "14,717"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "20,312.50"
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
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "20,312.50"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "19,428"
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
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "19,428"
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
										"alertlevel": 5
									}
								},
								"_v": "9,709"
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
										"alertlevel": 5
									}
								},
								"_v": "9,709"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,237.81"
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
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,237.81"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": "21,337"
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
								"_v": "21,337"
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
										"alertlevel": 1
									}
								},
								"_v": "31,395"
							}
						}, {
							"control": {
								"colidx": 4,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									}
								},
								"_v": "35,041"
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
								"_v": "66,436"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "90,527.99"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "91,958.72"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "182,486.70"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"_v": "87,096"
							}
						}, {
							"control": {
								"colidx": 10,
								"isresult": true,
								"_v": "88,273"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "175,368"
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
										"formattype": 8,
										"alertlevel": 1
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
									},
									"1": {
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "1,974"
							}
						}, {
							"control": {
								"colidx": 5,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 9
									},
									"1": {
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "1,974"
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
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "18,113.89"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "18,113.89"
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
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "18,043"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "18,043"
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
										"alertlevel": 5
									}
								},
								"_v": "5,549"
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
								"_v": "5,549"
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
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "25,422.09"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "25,422.09"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": "24,997"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "24,997"
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
								"_v": "Flatscreen Vision I"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "2,277"
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
										"alertlevel": 5
									}
								},
								"_v": "2,277"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,018.39"
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
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,018.39"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": "23,704"
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
								"_v": "23,704"
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
								"_v": "Harddrive onTour"
							}
						}, {
							"control": {
								"colidx": 3,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 5
									}
								},
								"_v": "4,540"
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
										"alertlevel": 5
									}
								},
								"_v": "4,540"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,889.77"
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
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,889.77"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": "22,873"
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
								"_v": "22,873"
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
										"alertlevel": 1
									}
								},
								"_v": "16,193"
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
								"_v": "16,193"
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
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,348.61"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 16,
										"alertlevel": 1
									}
								},
								"_v": "22,348.61"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": "22,408"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "22,408"
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
										"alertlevel": 1
									}
								},
								"_v": "10,515"
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
								"_v": "10,515"
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
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,083.18"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 32,
										"alertlevel": 4
									}
								},
								"_v": "24,083.18"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 10,
								"_v": "23,885"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "23,885"
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
										"alertlevel": 1
									}
								},
								"_v": "14,277"
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
										"alertlevel": 1
									}
								},
								"_v": "14,277"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "19,703.84"
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
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "19,703.84"
							}
						}, {
							"control": {
								"colidx": 9,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "19,415"
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
										"alertlevel": 1
									},
									"1": {
										"formattype": 4,
										"alertlevel": 9
									}
								},
								"_v": "19,415"
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
										"alertlevel": 5
									}
								},
								"_v": "9,497"
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
										"alertlevel": 5
									}
								},
								"_v": "9,497"
							}
						}, {
							"control": {
								"colidx": 6,
								"exceptionvisualizations": {
									"0": {
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "21,752.22"
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
										"formattype": 8,
										"alertlevel": 1
									}
								},
								"_v": "21,752.22"
							}
						}, {
							"control": {
								"colidx": 9,
								"_v": "21,833"
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
								"_v": "21,833"
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
										"alertlevel": 1
									}
								},
								"_v": "30,590"
							}
						}, {
							"control": {
								"colidx": 4,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 2,
										"alertlevel": 1
									}
								},
								"_v": "34,231"
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
								"_v": "64,821"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "88,364.23"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "89,967.77"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"exceptionvisualizations": {
									"0": {
										"formattype": 64,
										"alertlevel": 5
									}
								},
								"_v": "178,332.00"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"_v": "87,825"
							}
						}, {
							"control": {
								"colidx": 10,
								"isresult": true,
								"_v": "89,333"
							}
						}, {
							"control": {
								"colidx": 11,
								"isresult": true,
								"_v": "177,158"
							}
						} ]
					}
				} ]
	}
};
