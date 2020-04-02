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

sapzen.crosstab.test.jsonTestData.deltaTable = {
	"control" : {
		"type" : "xtable",
		"id" : "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders" : 3,
		"fixedrowheaders" : 2,
		"totaldatarows" : 6,
		"totaldatacols" : 6,
		"sentdatarows" : 6,
		"sentdatacols" : 6,
		"tilerows" : 10000,
		"tilecols" : 10000,
		"changed" : true,
		"rows" : [
				{
					"row" : {
						"rowidx" : "1",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_0",
								"rowspan" : 2,
								"colidx" : 1,
								"style" : "TITLE"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_1",
								"colidx" : 2,
								"style" : "TITLE",
								"_v" : "Distribution Channel"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_2",
								"colspan" : 3,
								"colidx" : 3,
								"key" : "3",
								"style" : "HEADER",
								"_v" : "Phone"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_5",
								"colspan" : 3,
								"colidx" : 6,
								"key" : "SUMME",
								"style" : "TOTAL",
								"_v" : "Overall Result"
							}
						} ]
					}
				},
				{
					"row" : {
						"rowidx" : "2",
						"cells" : [
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_1",
										"colidx" : 2,
										"style" : "TITLE",
										"_v" : ""
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_2",
										"colidx" : 3,
										"key" : "3/4IMV3H53NPX2IFHRVTGR3HRUA",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Billed Quantity"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_3",
										"colidx" : 4,
										"key" : "3/4IMV3HCS6OIS12181NJ3DJQK2",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Net Sales"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_4",
										"colidx" : 5,
										"key" : "3/4IMV3HKGPN4HJOKO7HLFNLP9U",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Avg. Price"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_5",
										"colidx" : 6,
										"key" : "SUMME/4IMV3H53NPX2IFHRVTGR3HRUA",
										"style" : "TOTAL",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Billed Quantity"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_6",
										"colidx" : 7,
										"key" : "SUMME/4IMV3HCS6OIS12181NJ3DJQK2",
										"style" : "TOTAL",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Net Sales"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_7",
										"colidx" : 8,
										"key" : "SUMME/4IMV3HKGPN4HJOKO7HLFNLP9U",
										"style" : "TOTAL",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Avg. Price"
									}
								} ]
					}
				},
				{
					"row" : {
						"rowidx" : "3",
						"cells" : [
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_0",
										"colidx" : 1,
										"style" : "TITLE",
										"sort" : "ASC",
										"sortalternativetext" : "Ascending",
										"sorttooltip" : "Sort in Descending Order",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Product group"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_1",
										"colidx" : 2,
										"style" : "TITLE",
										"sort" : "ASC",
										"sortalternativetext" : "Ascending",
										"sorttooltip" : "Sort in Descending Order",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Product"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_2",
										"colidx" : 3,
										"style" : "HEADER",
										"_v" : "PC"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_3",
										"colidx" : 4,
										"style" : "HEADER",
										"_v" : "* 1,000 $"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_4",
										"colidx" : 5,
										"style" : "HEADER",
										"_v" : "$ / PC"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_5",
										"colidx" : 6,
										"style" : "TOTAL",
										"_v" : "PC"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_6",
										"colidx" : 7,
										"style" : "TOTAL",
										"_v" : "* 1,000 $"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_7",
										"colidx" : 8,
										"style" : "TOTAL",
										"_v" : "$ / PC"
									}
								} ]
					}
				}, {
					"row" : {
						"rowidx" : "4",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_0",
								"rowspan" : 5,
								"colidx" : 1,
								"key" : "DS20",
								"style" : "HEADER",
								"_v" : "Accessories+space"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_1",
								"colidx" : 2,
								"key" : "DS20/PDS04",
								"style" : "HEADER",
								"_v" : "Automatic umbrella"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_2",
								"colidx" : 3,
								"_v" : "56,358,735"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_3",
								"colidx" : 4,
								"_v" : "517,282.94"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_4",
								"colidx" : 5,
								"_v" : "9.18"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "56,358,735"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "517,282.94"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "9.18"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "5",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_1",
								"colidx" : 2,
								"key" : "DS20/PDS05",
								"style" : "HEADER",
								"_v" : "iPhones PX2  updated"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : "128,056,491"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "679,981.51"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "5.31"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "128,056,491"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "679,981.51"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "5.31"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "6",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_1",
								"colidx" : 2,
								"key" : "DS20/PDS06",
								"style" : "HEADER",
								"_v" : "Stereo Kit"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_2",
								"colidx" : 3,
								"_v" : "86,121,167"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_3",
								"colidx" : 4,
								"_v" : "768,058.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_4",
								"colidx" : 5,
								"_v" : "8.92"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "86,121,167"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "768,058.48"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "8.92"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "7",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_1",
								"colidx" : 2,
								"key" : "DS20/PDS07",
								"style" : "HEADER",
								"_v" : "Camera Connector"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : "45,494,716"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "812,120.33"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "17.85"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "45,494,716"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "812,120.33"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "17.85"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "8",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_1",
								"colidx" : 2,
								"key" : "DS20/SUMME",
								"style" : "TOTAL",
								"_v" : "Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "316,031,109"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "2,777,443.26"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "8.79"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "316,031,109"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "2,777,443.26"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "8.79"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "9",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_0",
								"colspan" : 2,
								"colidx" : 1,
								"key" : "SUMME",
								"style" : "TOTAL",
								"_v" : "Overall Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_2",
								"colidx" : 3,
								"style" : "TOTAL",
								"_v" : "316,031,109"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_3",
								"colidx" : 4,
								"style" : "TOTAL",
								"_v" : "2,777,443.26"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_4",
								"colidx" : 5,
								"style" : "TOTAL",
								"_v" : "8.79"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_5",
								"colidx" : 6,
								"style" : "TOTAL",
								"_v" : "316,031,109"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_6",
								"colidx" : 7,
								"style" : "TOTAL",
								"_v" : "2,777,443.26"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_7",
								"colidx" : 8,
								"style" : "TOTAL",
								"_v" : "8.79"
							}
						} ]
					}
				} ]
	}
};