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

sapzen.crosstab.test.jsonTestData.PLANNING = {

	"control": {
		"type": "xtable",
		"id": "CROSSTAB_3_ia_pt_a",
		"resultsetchanged": true,
		"dataproviderchanged": true,
		"changed": true,
		"texts": {
			"rowtext": "Row",
			"coltext": "Column",
			"colwidthtext": "Double click to adjust column width",
			"mobilemenuitemcolwidthtext": "Adjust column width"
		},
		"fixedcolheaders": 3,
		"fixedrowheaders": 5,
		"totaldatarows": 11922,
		"totaldatacols": 4,
		"sentdatarows": 50,
		"sentdatacols": 4,
		"tilerows": 50,
		"tilecols": 30,
		"onselectcommand": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_3',0]]]],true);",
		"selectionenabled": false,
		"alwaysfill": false,
		"pixelscrolling": false,
		"displayexceptions": false,
		"enablecolresize": true,
		"scrollaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','SUPPRESS_VALIDATION',0]]],['BI_COMMAND',null,1,[['INDEX','__Y__',0],['BI_COMMAND_TYPE','NAVIGATE_BY_SCROLLING',0],['TARGET_ITEM_REF','CROSSTAB_3',0],['BIAV','CROSSTAB_3_ia_pt',0],['TYPE','v',0]]]]);",
		"usercolwidths": {
			"length": 0
		},
		"rows": [
				{
					"row": {
						"rowidx": "1",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colspan": 4,
								"colidx": 1
							}
						}, {
							"control": {
								"colidx": 5,
								"_v": ""
							}
						}, {
							"control": {
								"colspan": 2,
								"colidx": 6,
								"key": "4VXSEBPQUN9VWZCS9GM0C8NY4",
								"_v": "Amount"
							}
						}, {
							"control": {
								"colspan": 2,
								"colidx": 8,
								"key": "4VXSEBXFDLVLFLW8FAOCMAMNW",
								"_v": "Quantity"
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
										"colidx": 5,
										"_v": "Calendar&#x20;Year"
									}
								},
								{
									"control": {
										"colidx": 6,
										"key": "4VXSEBPQUN9VWZCS9GM0C8NY4/2013",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "2013"
									}
								},
								{
									"control": {
										"colidx": 7,
										"key": "4VXSEBPQUN9VWZCS9GM0C8NY4/SUMME",
										"isinnermember": true,
										"isresult": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall&#x20;Result"
									}
								},
								{
									"control": {
										"colidx": 8,
										"key": "4VXSEBXFDLVLFLW8FAOCMAMNW/2013",
										"isinnermember": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "2013"
									}
								},
								{
									"control": {
										"colidx": 9,
										"key": "4VXSEBXFDLVLFLW8FAOCMAMNW/SUMME",
										"isinnermember": true,
										"isresult": true,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Overall&#x20;Result"
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
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Calendar&#x20;month"
									}
								},
								{
									"control": {
										"colspan": 2,
										"colidx": 2,
										"sort": "ASC",
										"sortalternativetext": "Ascending",
										"sorttooltip": "Sort in Descending Order",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Customer"
									}
								},
								{
									"control": {
										"colidx": 4,
										"sort": "NONE",
										"sortalternativetext": "Unsorted. Select to sort ascending.",
										"sorttooltip": "Unsorted. Select to sort ascending.",
										"sortaction": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v": "Customer&#x20;Group"
									}
								}, {
									"control": {
										"colidx": 5
									}
								}, {
									"control": {
										"colidx": 6,
										"_v": "EUR"
									}
								}, {
									"control": {
										"colidx": 7,
										"_v": "EUR"
									}
								}, {
									"control": {
										"colidx": 8,
										"_v": "EA"
									}
								}, {
									"control": {
										"colidx": 9,
										"_v": "EA"
									}
								} ]
					}
				}, {
					"row": {
						"rowidx": "4",
						"cells": [ {
							"control": {
								"rowspan": 50,
								"colidx": 1,
								"key": "01",
								"_v": "1"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000000687",
								"_v": "687"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000000687",
								"_v": "687"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000000687/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000000687/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": "0.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": "0.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "12,000.000"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "12,000.000"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "5",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000000687/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": "0.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": "0.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "12,000.000"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "12,000.000"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "6",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001000",
								"_v": "1000"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001000",
								"_v": "1000"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001000/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001000/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": "33.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": "33.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "0.000"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "0.000"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "7",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001000/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": "33.00"
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": "33.00"
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "0.000"
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": "0.000"
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "8",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001001",
								"_v": "1001"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001001",
								"_v": "1001"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001001/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001001/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "9",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001001/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "10",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001013",
								"_v": "1013"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001013",
								"_v": "1013"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001013/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001013/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "11",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001013/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "12",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001014",
								"_v": "1014"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001014",
								"_v": "1014"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001014/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001014/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "13",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001014/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "14",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001015",
								"_v": "1015"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001015",
								"_v": "1015"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001015/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001015/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "15",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001015/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "16",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001016",
								"_v": "1016"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001016",
								"_v": "1016"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001016/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001016/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "17",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001016/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "18",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001017",
								"_v": "1017"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001017",
								"_v": "1017"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001017/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001017/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "19",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001017/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "20",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001018",
								"_v": "1018"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001018",
								"_v": "1018"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001018/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001018/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "21",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001018/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "22",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001032",
								"_v": "1032"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001032",
								"_v": "1032"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001032/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001032/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "23",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001032/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "24",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001050",
								"_v": "1050"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001050",
								"_v": "1050"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001050/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001050/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "25",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001050/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "26",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001111",
								"_v": "1111"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001111",
								"_v": "1111"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001111/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001111/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "27",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001111/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "28",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001170",
								"_v": "1170"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001170",
								"_v": "1170"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001170/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001170/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "29",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001170/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "30",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001171",
								"_v": "1171"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001171",
								"_v": "1171"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001171/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001171/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "31",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001171/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "32",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001191",
								"_v": "1191"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001191",
								"_v": "1191"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001191/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001191/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "33",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001191/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "34",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001193",
								"_v": "1193"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001193",
								"_v": "1193"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001193/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001193/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "35",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001193/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "36",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001194",
								"_v": "1194"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001194",
								"_v": "1194"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001194/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001194/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "37",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001194/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "38",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001195",
								"_v": "1195"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001195",
								"_v": "1195"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001195/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001195/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "39",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001195/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "40",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001280",
								"_v": "1280"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001280",
								"_v": "1280"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001280/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001280/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "41",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001280/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "42",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001300",
								"_v": "1300"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001300",
								"_v": "1300"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001300/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001300/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "43",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001300/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "44",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001322",
								"_v": "1322"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001322",
								"_v": "1322"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001322/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001322/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "45",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001322/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "46",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001323",
								"_v": "1323"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001323",
								"_v": "1323"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001323/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001323/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "47",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001323/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "48",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001370",
								"_v": "1370"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001370",
								"_v": "1370"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001370/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001370/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "49",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001370/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "50",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001390",
								"_v": "1390"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001390",
								"_v": "1390"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001390/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001390/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "51",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001390/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "52",
						"cells": [ {
							"control": {
								"rowspan": 2,
								"colidx": 2,
								"key": "01/0000001492",
								"_v": "1492"
							}
						}, {
							"control": {
								"rowspan": 2,
								"colidx": 3,
								"key": "01/0000001492",
								"_v": "1492"
							}
						}, {
							"control": {
								"colidx": 4,
								"key": "01/0000001492/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 5,
								"key": "01/0000001492/99",
								"isinnermember": true,
								"_v": "99"
							}
						}, {
							"control": {
								"colidx": 6,
								"isdataentryenabled": true,
								"unit": "EUR",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				}, {
					"row": {
						"rowidx": "53",
						"cells": [ {
							"control": {
								"colspan": 2,
								"colidx": 4,
								"key": "01/0000001492/SUMME",
								"isinnermember": true,
								"isresult": true,
								"_v": "Result"
							}
						}, {
							"control": {
								"colidx": 6,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 7,
								"isresult": true,
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 8,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						}, {
							"control": {
								"colidx": 9,
								"isresult": true,
								"isdataentryenabled": true,
								"unit": "EA",
								"_v": ""
							}
						} ]
					}
				} ],
		"transferdatacommand": "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['VALUE','__VALUE__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','TRANSFER_DATA_VALUE',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_3',0]]);"
	}
};