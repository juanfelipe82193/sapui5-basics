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

sapzen.crosstab.test.jsonTestData.csvTable = {

	"control" : {
		"type" : "xtable",
		"id" : "CROSSTAB_1_ia_pt_a",
		"fixedcolheaders" : 2,
		"fixedrowheaders" : 0,
		"totaldatarows" : 1,
		"totaldatacols" : 2,
		"sentdatarows" : 1,
		"sentdatacols" : 2,
		"tilerows" : 10000,
		"tilecols" : 10000,
		"changed" : true,
		"rows" : [ {
			"row" : {
				"rowidx" : "1",
				"cells" : [ {
					"control" : {
						"type" : "xcell",
						"id" : "CROSSTAB_1_ia_pt_0_0",
						"colidx" : 1,
						"key" : "0D_NWI_NSAL",
						"style" : "HEADER",
						"_v" : "Net Sales"
					}
				}, {
					"control" : {
						"type" : "xcell",
						"id" : "CROSSTAB_1_ia_pt_0_1",
						"colidx" : 2,
						"key" : "0D_NWI_IQTY",
						"style" : "HEADER",
						"_v" : "Billed Quantity"
					}
				} ]
			}
		}, {
			"row" : {
				"rowidx" : "2",
				"cells" : [ {
					"control" : {
						"type" : "xcell",
						"id" : "CROSSTAB_1_ia_pt_1_0",
						"colidx" : 1,
						"style" : "HEADER",
						"_v" : "$"
					}
				}, {
					"control" : {
						"type" : "xcell",
						"id" : "CROSSTAB_1_ia_pt_1_1",
						"colidx" : 2,
						"style" : "HEADER",
						"_v" : "PCS"
					}
				} ]
			}
		}, {
			"row" : {
				"rowidx" : "3",
				"cells" : [ {
					"control" : {
						"type" : "xcell",
						"id" : "CROSSTAB_1_ia_pt_2_0",
						"colidx" : 1,
						"_v" : "417,036,419.00"
					}
				}, {
					"control" : {
						"type" : "xcell",
						"id" : "CROSSTAB_1_ia_pt_2_1",
						"colidx" : 2,
						"_v" : "10,479,351.00"
					}
				} ]
			}
		} ]
	}

};