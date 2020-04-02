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

sapzen.crosstab.test.jsonTestData.deltaInitNoDs = {
	"control" : {
		"type" : "grid",
		"id" : "ROOT_grid",
		"rows" : [ {
			"row" : {
				"height" : "1"
			}
		} ],
		"cols" : [ {
			"col" : {
				"width" : "1"
			}
		} ],
		"content" : [ {
			"component" : {
				"id" : "CROSSTAB_1",
				"type" : "CROSSTAB_COMPONENT",
				"width" : "500",
				"height" : "300",
				"leftmargin" : "auto",
				"rightmargin" : "auto",
				"topmargin" : "auto",
				"bottommargin" : "auto",
				"gridrow" : "1",
				"gridcol" : "1",
				"message" : {
					"type" : "warning",
					"_v" : "Assign a Data Source to the Component"
				},
				"content" : {}

			}
		} ]
	}
};