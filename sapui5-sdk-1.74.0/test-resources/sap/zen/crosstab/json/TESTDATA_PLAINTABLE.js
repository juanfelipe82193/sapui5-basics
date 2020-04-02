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

sapzen.crosstab.test.jsonTestData.plainTable = {
	"control" : {
		"type" : "xtable",
		"id" : "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders" : 3,
		"fixedrowheaders" : 2,
		"totaldatarows" : 12,
		"totaldatacols" : 4,
		"sentdatarows" : 12,
		"sentdatacols" : 4,
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
								"style" : "TITLE",
								"_v" : "DIMHEADER"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_1",
								"colidx" : 2,
								"style" : "TITLE",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_0_2",
								"colspan" : 4,
								"colidx" : 3,
								"key" : "4LVUCIXH4POZ2EA900TT71TF6",
								"style" : "HEADER",
								"_v" : "Net Sales"
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
										"_v" : "Product group"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_2",
										"colidx" : 3,
										"key" : "4LVUCIXH4POZ2EA900TT71TF6/DS10",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Computer,keybord"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_3",
										"colidx" : 4,
										"key" : "4LVUCIXH4POZ2EA900TT71TF6/DS20",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Accessories+space"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_4",
										"colidx" : 5,
										"key" : "4LVUCIXH4POZ2EA900TT71TF6/DS30",
										"style" : "HEADER",
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Hardware software"
									}
								},
								{
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_1_5",
										"colidx" : 6,
										"key" : "4LVUCIXH4POZ2EA900TT71TF6/SUMME",
										"isresult" : true,
										"sort" : "NONE",
										"sortalternativetext" : "Unsorted. Select to sort ascending.",
										"sorttooltip" : "Unsorted. Select to sort ascending.",
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Overall Result"
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
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Calendar Year/Month"
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
										"sortaction" : "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
										"_v" : "Product"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_2",
										"colidx" : 3,
										"style" : "HEADER",
										"_v" : "* 1,000 $"
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
										"_v" : "* 1,000 $"
									}
								}, {
									"control" : {
										"type" : "xcell",
										"id" : "CROSSTAB_1_ia_pt_2_5",
										"colidx" : 6,
										"isresult" : true,
										"_v" : "* 1,000 $"
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
								"rowspan" : 12,
								"colidx" : 1,
								"key" : "200301",
								"style" : "HEADER",
								"_v" : "JAN 2003"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_1",
								"colidx" : 2,
								"key" : "200301/PDS01",
								"style" : "HEADER",
								"_v" : "Notebook tfas"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_2",
								"colidx" : 3,
								"_v" : "24,139"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_3",
								"colidx" : 4,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_3_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "24,139"
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
								"key" : "200301/PDS02",
								"style" : "HEADER",
								"_v" : "Notebook Speedy II"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : "20,962"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_4_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "20,962"
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
								"key" : "200301/PDS03",
								"style" : "HEADER",
								"_v" : "A4 Writing Case"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_2",
								"colidx" : 3,
								"_v" : "21,901"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_3",
								"colidx" : 4,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_5_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "21,901"
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
								"key" : "200301/PDS04",
								"style" : "HEADER",
								"_v" : "Automatic umbrella"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "18,333"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_6_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "18,333"
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
								"key" : "200301/PDS05",
								"style" : "HEADER",
								"_v" : "iPhones PX2  updated"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_2",
								"colidx" : 3,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_3",
								"colidx" : 4,
								"_v" : "22,927"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_7_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "22,927"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "9",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_1",
								"colidx" : 2,
								"key" : "200301/PDS06",
								"style" : "HEADER",
								"_v" : "Stereo Kit"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : "24,578"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_8_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "24,578"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "10",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_1",
								"colidx" : 2,
								"key" : "200301/PDS07",
								"style" : "HEADER",
								"_v" : "Camera Connector"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_2",
								"colidx" : 3,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_3",
								"colidx" : 4,
								"_v" : "26,120"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_4",
								"colidx" : 5,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_9_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "26,120"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "11",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_1",
								"colidx" : 2,
								"key" : "200301/PDS08",
								"style" : "HEADER",
								"_v" : "USB Storage"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "22,238"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_10_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "22,238"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "12",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_1",
								"colidx" : 2,
								"key" : "200301/PDS09",
								"style" : "HEADER",
								"_v" : "Harddrive onTour"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_2",
								"colidx" : 3,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_3",
								"colidx" : 4,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_4",
								"colidx" : 5,
								"_v" : "23,380"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_11_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "23,380"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "13",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_1",
								"colidx" : 2,
								"key" : "200301/PDS10",
								"style" : "HEADER",
								"_v" : "USB MegaStorage"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_2",
								"colidx" : 3,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_3",
								"colidx" : 4,
								"style" : "ALTERNATING",
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_4",
								"colidx" : 5,
								"style" : "ALTERNATING",
								"_v" : "20,312"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_12_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "20,312"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "14",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_1",
								"colidx" : 2,
								"key" : "200301/PDS11",
								"style" : "HEADER",
								"_v" : "Flatscreen Vision I"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_2",
								"colidx" : 3,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_3",
								"colidx" : 4,
								"_v" : ""
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_4",
								"colidx" : 5,
								"_v" : "24,598"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_13_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "24,598"
							}
						} ]
					}
				}, {
					"row" : {
						"rowidx" : "15",
						"cells" : [ {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_1",
								"colidx" : 2,
								"key" : "200301/SUMME",
								"isresult" : true,
								"_v" : "Result"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_2",
								"colidx" : 3,
								"isresult" : true,
								"_v" : "67,002"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_3",
								"colidx" : 4,
								"isresult" : true,
								"_v" : "91,959"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_4",
								"colidx" : 5,
								"isresult" : true,
								"_v" : "90,528"
							}
						}, {
							"control" : {
								"type" : "xcell",
								"id" : "CROSSTAB_1_ia_pt_14_5",
								"colidx" : 6,
								"isresult" : true,
								"_v" : "249,488"
							}
						} ]
					}
				} ]
	}
};
