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

sapzen.crosstab.test.jsonTestData.smoothScrollingIssueTable = {
	"control" : {
			"type" : "xtable",
			"id" : "CROSSTAB_1_ia_pt_a",
			"fixedcolheaders" : 1,
			"fixedrowheaders" : 1,
			"totaldatarows" : 31,
			"totaldatacols" : 0,
			"sentdatarows" : 31,
			"sentdatacols" : 0,
			"tilerows" : 35,
			"tilecols" : 20,
			"alwaysfill" : false,
			"pixelscrolling" : true,
			"onselectcommand" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
			"selectionenabled" : false,
			"changed" : true,
			"texts" : {
				"rowtext" : "Row",
				"coltext" : "Column",
				"colwidthtext" : "Double click to adjust column width"
			},
			"rows" : [{
					"row" : {
						"rowidx" : "1",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_0_0",
									"colidx" : 1,
									"style" : "TITLE",
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v" : "Cons. business area"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "2",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_1_0",
									"colidx" : 1,
									"level" : 0,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01A0001",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL1",
									"_v" : "Group"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "3",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_2_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01B1100",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "Consumer, Health & Nutrition"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "4",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_3_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C2600",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Consumer Specialties"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "5",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_4_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C2700",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Health & Nutrition"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "6",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_5_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01B1200",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "Resource Efficiency"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "7",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_6_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','7',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C1700",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Inorganic Materials"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "8",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_7_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','8',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C3600",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Coatings & Additives"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "9",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_8_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','9',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01B1300",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "Specialty Materials"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "10",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_9_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','10',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C3700",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Performance Polymers"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "11",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_10_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','11',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C1600",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Advanced Intermediates"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "12",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_11_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','12',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01B1900",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "Services"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "13",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_12_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','13',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C9400",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Evonik Business Services"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "14",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_13_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','14',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C0900",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Site Services"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "15",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_14_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','15',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01D0820",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Site Services International"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "16",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_15_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','16',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01D0850",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Regions Chemicals"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "17",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_16_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','17',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01E1837",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Procurement"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "18",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_17_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','18',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01E1832",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Process Technology & Engineering"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "19",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_18_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','19',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01C1950",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "HR Management Deutschland"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "20",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_19_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','20',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01B5000",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "Real Estate"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "21",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_20_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','21',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C5000",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Real Estate"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "22",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_21_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "O",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','22',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01B9000",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "Others"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "23",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_22_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','23',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C9100",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Corporate"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "24",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_23_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','24',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01E1830",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Innovation Management"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "25",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_24_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','25',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01E1836",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Lithium-Ion Technology"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "26",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_25_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','26',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01E0811",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Other Management Functions"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "27",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_26_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','27',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01E0803",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Operational Excellence"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "28",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_27_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','28',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01E0804",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Marketing & Sales Excellence"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "29",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_28_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','29',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01D0860",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Miscellaneous Chemicals"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "30",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_29_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','30',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01E0812",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Properties & Pipelines"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "31",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_30_0",
									"colidx" : 1,
									"level" : 2,
									"drillstate" : "C",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','31',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"hierarchytooltip" : "",
									"key" : "01C9700",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL3",
									"_v" : "Other Activities"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "32",
						"cells" : [{
								"control" : {
									"type" : "xcell",
									"id" : "CROSSTAB_1_ia_pt_31_0",
									"colidx" : 1,
									"level" : 1,
									"drillstate" : "L",
									"hierarchyaction" : "sapbi_page.sendCommandArrayWoEventWoPVT([['BI_COMMAND',null,0,[['GUID','32',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"key" : "01B4000",
									"isinnermember" : true,
									"style" : "HIERARCHY_LEVEL2",
									"_v" : "Energy"
								}
							}
						]
					}
				}
			]
	}
};
