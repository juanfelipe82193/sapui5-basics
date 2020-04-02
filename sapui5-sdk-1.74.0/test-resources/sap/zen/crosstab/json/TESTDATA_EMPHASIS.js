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

sapzen.crosstab.test.jsonTestData.emphasis = {
		"control" : {
			"type" : "xtable",
			"id" : "CROSSTAB_1_ia_pt_a",
			"resultsetchanged" : false,
			"dataproviderchanged" : true,
			"changed" : true,
			"texts" : {
				"rowtext" : "Row",
				"coltext" : "Column",
				"colwidthtext" : "Double click to adjust column width",
				"mobilemenuitemcolwidthtext" : "Adjust column width"
			},
			"fixedcolheaders" : 3,
			"fixedrowheaders" : 2,
			"totaldatarows" : 18,
			"totaldatacols" : 12,
			"sentdatarows" : 18,
			"sentdatacols" : 12,
			"tilerows" : 50,
			"tilecols" : 30,
			"onselectcommand" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['AXIS','__AXIS__',0],['ROW','__ROW__',0],['BI_COMMAND_TYPE','SELECTION_CHANGED',0],['COL','__COL__',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]],true);",
			"selectionenabled" : false,
			"alwaysfill" : false,
			"pixelscrolling" : false,
			"displayexceptions" : false,
			"enablecolresize" : true,
			"usercolwidths" : {
				"length" : 0
			},
			"rows" : [{
					"row" : {
						"rowidx" : "1",
						"cells" : [{
								"control" : {
									"rowspan" : 2,
									"colidx" : 1
								}
							}, {
								"control" : {
									"colidx" : 2,
									"_v" : ""
								}
							}, {
								"control" : {
									"colspan" : 3,
									"colidx" : 3,
									"key" : "4VN0ZJOZTAQ9IOHMZ95O1Q0J6",
									"_v" : "Billed&#x20;Quantity"
								}
							}, {
								"control" : {
									"colspan" : 3,
									"colidx" : 6,
									"key" : "4VN0ZJHBAC4K01Y6TF3BRO1TE",
									"_v" : "Formula&#x20;3"
								}
							}, {
								"control" : {
									"colspan" : 3,
									"colidx" : 9,
									"key" : "4VN0ZJWOC9BZ1B135380BRZ8Y",
									"_v" : "CALC"
								}
							}, {
								"control" : {
									"colspan" : 3,
									"colidx" : 12,
									"key" : "4VN0ZKC1E6JE2K3ZGRCOVVWOI",
									"_v" : "FORMULA"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "2",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"_v" : "Product&#x20;group"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"key" : "4VN0ZJOZTAQ9IOHMZ95O1Q0J6/DS30",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJOZTAQ9IOHMZ95O1Q0J6',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJOZTAQ9IOHMZ95O1Q0J6',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Hardware&#x20;software"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"key" : "4VN0ZJOZTAQ9IOHMZ95O1Q0J6/DS20",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJOZTAQ9IOHMZ95O1Q0J6',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJOZTAQ9IOHMZ95O1Q0J6',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Accessories&#x2b;space"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"key" : "4VN0ZJOZTAQ9IOHMZ95O1Q0J6/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJOZTAQ9IOHMZ95O1Q0J6',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJOZTAQ9IOHMZ95O1Q0J6',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Overall&#x20;Result"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"key" : "4VN0ZJHBAC4K01Y6TF3BRO1TE/DS30",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJHBAC4K01Y6TF3BRO1TE',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJHBAC4K01Y6TF3BRO1TE',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Hardware&#x20;software"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"key" : "4VN0ZJHBAC4K01Y6TF3BRO1TE/DS20",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJHBAC4K01Y6TF3BRO1TE',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJHBAC4K01Y6TF3BRO1TE',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Accessories&#x2b;space"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"key" : "4VN0ZJHBAC4K01Y6TF3BRO1TE/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJHBAC4K01Y6TF3BRO1TE',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJHBAC4K01Y6TF3BRO1TE',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Overall&#x20;Result"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"key" : "4VN0ZJWOC9BZ1B135380BRZ8Y/DS30",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJWOC9BZ1B135380BRZ8Y',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJWOC9BZ1B135380BRZ8Y',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Hardware&#x20;software"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"key" : "4VN0ZJWOC9BZ1B135380BRZ8Y/DS20",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJWOC9BZ1B135380BRZ8Y',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJWOC9BZ1B135380BRZ8Y',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Accessories&#x2b;space"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"key" : "4VN0ZJWOC9BZ1B135380BRZ8Y/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJWOC9BZ1B135380BRZ8Y',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZJWOC9BZ1B135380BRZ8Y',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Overall&#x20;Result"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"key" : "4VN0ZKC1E6JE2K3ZGRCOVVWOI/DS30",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZKC1E6JE2K3ZGRCOVVWOI',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZKC1E6JE2K3ZGRCOVVWOI',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Hardware&#x20;software"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"key" : "4VN0ZKC1E6JE2K3ZGRCOVVWOI/DS20",
									"isinnermember" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZKC1E6JE2K3ZGRCOVVWOI',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZKC1E6JE2K3ZGRCOVVWOI',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Accessories&#x2b;space"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"key" : "4VN0ZKC1E6JE2K3ZGRCOVVWOI/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"sort" : "NONE",
									"sortalternativetext" : "Unsorted. Select to sort ascending.",
									"sorttooltip" : "Unsorted. Select to sort ascending.",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZKC1E6JE2K3ZGRCOVVWOI',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_VALUE',0,[['SORT_BY_VALUE',null,0,[['DIRECTION','ASCENDING',0],['DATA_CELL',null,0,[['CHARACTERISTIC_MEMBER',null,1,[['CHARACTERISTIC','4VN0ZJ9MRDIUHFEQNL0ZHM33M',0],['MEMBER_NAME','4VN0ZKC1E6JE2K3ZGRCOVVWOI',0]]]]]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,2,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Overall&#x20;Result"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "3",
						"cells" : [{
								"control" : {
									"colidx" : 1,
									"sort" : "ASC",
									"sortalternativetext" : "Ascending",
									"sorttooltip" : "Sort in Descending Order",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0CALMONTH',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_CHARACTERISTIC_MEMBER',0,[['SORT_BY_CHARACTERISTIC_MEMBER',null,0,[['DIRECTION','DESCENDING',0],['PRESENTATION_AREA','RESULT_SET',0],['MEMBER_PRESENTATION','DISPLAY_KEY',0]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Calendar&#x20;Year&#x2f;Month"
								}
							}, {
								"control" : {
									"colidx" : 2,
									"sort" : "ASC",
									"sortalternativetext" : "Ascending",
									"sorttooltip" : "Sort in Descending Order",
									"sortaction" : "sap.zen.request.zenSendCommandArrayWoEventWZenPVT([['BI_COMMAND',null,0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['CHARACTERISTIC','0D_PH2',0],['TARGET_DATA_PROVIDER_REF_LIST','',0,[['TARGET_DATA_PROVIDER_REF','DS_1',0],['TARGET_DATA_PROVIDER_REF','DS_1',1]]],['SORTING_TYPE','SORT_BY_CHARACTERISTIC_MEMBER',0,[['SORT_BY_CHARACTERISTIC_MEMBER',null,0,[['DIRECTION','DESCENDING',0],['PRESENTATION_AREA','RESULT_SET',0],['MEMBER_PRESENTATION','TEXT',0]]]]],['BI_COMMAND_TYPE','SET_SORTING',0]]],['BI_COMMAND',null,1,[['BI_COMMAND_TYPE','RESULTSETCHANGED_ROOTCAUSE',0],['ROOTCAUSE','sorting',0],['TARGET_ITEM_REF','CROSSTAB_1',0]]]]);",
									"_v" : "Product"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"_v" : "&#x2a;&#x20;1,000&#x20;PC"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"_v" : "&#x2a;&#x20;1,000&#x20;PC"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"_v" : "&#x2a;&#x20;1,000&#x20;PC"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "PC"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "PC"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"_v" : "PC"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "&#x24;"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "&#x24;"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"_v" : "&#x24;"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "&#x24;"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "&#x24;"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"_v" : "&#x24;"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "4",
						"cells" : [{
								"control" : {
									"rowspan" : 9,
									"colidx" : 1,
									"key" : "200301",
									"_v" : "JAN&#x20;2003"
								}
							}, {
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS04",
									"isinnermember" : true,
									"_v" : "Automatic&#x20;umbrella"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "1,998"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "1,998"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "7,990,168"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "7,990,168"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "9,166,665.00"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "9,166,665.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "36,666,660.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "36,666,660.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "5",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS07",
									"isinnermember" : true,
									"_v" : "Camera&#x20;Connector"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "5,701"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "5,701"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "22,804,596"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "22,804,596"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "13,059,939.00"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "13,059,939.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "52,239,756.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "52,239,756.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "6",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS11",
									"isinnermember" : true,
									"_v" : "Flatscreen&#x20;Vision&#x20;I"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "2,332"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "2,332"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "9,328,344"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "9,328,344"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "12,298,966.50"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "12,298,966.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "49,195,866.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "49,195,866.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "7",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS09",
									"isinnermember" : true,
									"_v" : "Harddrive&#x20;onTour"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "4,637"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "4,637"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "18,547,200"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "18,547,200"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "11,689,873.50"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "11,689,873.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "46,759,494.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "46,759,494.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "8",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS05",
									"isinnermember" : true,
									"_v" : "iPhones&#x20;PX2&#x20;&#x20;updated"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "16,612"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "16,612"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "66,448,096"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "66,448,096"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "11,463,737.00"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "11,463,737.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "45,854,948.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "45,854,948.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "9",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS06",
									"isinnermember" : true,
									"_v" : "Stereo&#x20;Kit"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "10,731"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "10,731"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "42,922,432"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "42,922,432"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "12,289,016.50"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "12,289,016.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "49,156,066.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "49,156,066.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "10",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS10",
									"isinnermember" : true,
									"_v" : "USB&#x20;MegaStorage"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "14,717"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "14,717"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "58,869,636"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "58,869,636"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "10,156,249.50"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "10,156,249.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "40,624,998.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "40,624,998.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "11",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/PDS08",
									"isinnermember" : true,
									"_v" : "USB&#x20;Storage"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "9,709"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "9,709"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "38,835,420"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "38,835,420"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "11,118,903.00"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "11,118,903.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "44,475,612.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "44,475,612.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "12",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200301/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"_v" : "Result"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "31,395"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "35,041"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "66,436"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"isresult" : true,
									"_v" : "125,580,600"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"isresult" : true,
									"_v" : "140,165,292"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "265,745,892"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"isresult" : true,
									"_v" : "45,263,992.50"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"isresult" : true,
									"_v" : "45,979,357.50"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "91,243,350.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"isresult" : true,
									"_v" : "181,055,970.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"isresult" : true,
									"_v" : "183,917,430.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "364,973,400.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "13",
						"cells" : [{
								"control" : {
									"rowspan" : 9,
									"colidx" : 1,
									"key" : "200302",
									"_v" : "FEB&#x20;2003"
								}
							}, {
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS04",
									"isinnermember" : true,
									"_v" : "Automatic&#x20;umbrella"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "1,974"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "1,974"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "7,895,460"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "7,895,460"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "9,056,946.50"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "9,056,946.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "36,227,786.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "36,227,786.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "14",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS07",
									"isinnermember" : true,
									"_v" : "Camera&#x20;Connector"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "5,549"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "5,549"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "22,195,196"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "22,195,196"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "12,711,044.00"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "12,711,044.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "50,844,176.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "50,844,176.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "15",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS11",
									"isinnermember" : true,
									"_v" : "Flatscreen&#x20;Vision&#x20;I"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "2,277"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "2,277"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "9,106,788"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "9,106,788"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "12,009,196.50"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "12,009,196.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "48,036,786.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "48,036,786.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "16",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS09",
									"isinnermember" : true,
									"_v" : "Harddrive&#x20;onTour"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "4,540"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "4,540"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "18,158,520"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "18,158,520"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "11,444,887.00"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "11,444,887.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "45,779,548.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "45,779,548.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "17",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS05",
									"isinnermember" : true,
									"_v" : "iPhones&#x20;PX2&#x20;&#x20;updated"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "16,193"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "16,193"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "64,771,312"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "64,771,312"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "11,174,304.00"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "11,174,304.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "44,697,216.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "44,697,216.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "18",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS06",
									"isinnermember" : true,
									"_v" : "Stereo&#x20;Kit"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : "10,515"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "10,515"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : "42,060,088"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "42,060,088"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : "12,041,589.50"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "12,041,589.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : "48,166,358.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "48,166,358.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "19",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS10",
									"isinnermember" : true,
									"_v" : "USB&#x20;MegaStorage"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "14,277"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "14,277"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "57,106,176"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "57,106,176"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "9,851,919.50"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "9,851,919.50"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "39,407,678.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "39,407,678.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "20",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/PDS08",
									"isinnermember" : true,
									"_v" : "USB&#x20;Storage"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isemphasized" : true,
									"_v" : "9,497"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isemphasized" : true,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "9,497"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"_v" : "37,989,144"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "37,989,144"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"_v" : "10,876,111.00"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "10,876,111.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"_v" : "43,504,444.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"_v" : ""
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "43,504,444.00"
								}
							}
						]
					}
				}, {
					"row" : {
						"rowidx" : "21",
						"cells" : [{
								"control" : {
									"colidx" : 2,
									"key" : "200302/SUMME",
									"isinnermember" : true,
									"isresult" : true,
									"_v" : "Result"
								}
							}, {
								"control" : {
									"colidx" : 3,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "30,590"
								}
							}, {
								"control" : {
									"colidx" : 4,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "34,231"
								}
							}, {
								"control" : {
									"colidx" : 5,
									"isresult" : true,
									"isemphasized" : true,
									"_v" : "64,821"
								}
							}, {
								"control" : {
									"colidx" : 6,
									"isresult" : true,
									"_v" : "122,360,628"
								}
							}, {
								"control" : {
									"colidx" : 7,
									"isresult" : true,
									"_v" : "136,922,056"
								}
							}, {
								"control" : {
									"colidx" : 8,
									"isresult" : true,
									"_v" : "259,282,684"
								}
							}, {
								"control" : {
									"colidx" : 9,
									"isresult" : true,
									"_v" : "44,182,114.00"
								}
							}, {
								"control" : {
									"colidx" : 10,
									"isresult" : true,
									"_v" : "44,983,884.00"
								}
							}, {
								"control" : {
									"colidx" : 11,
									"isresult" : true,
									"_v" : "89,165,998.00"
								}
							}, {
								"control" : {
									"colidx" : 12,
									"isresult" : true,
									"_v" : "176,728,456.00"
								}
							}, {
								"control" : {
									"colidx" : 13,
									"isresult" : true,
									"_v" : "179,935,536.00"
								}
							}, {
								"control" : {
									"colidx" : 14,
									"isresult" : true,
									"_v" : "356,663,992.00"
								}
							}
						]
					}
				}
			]
		}

};
