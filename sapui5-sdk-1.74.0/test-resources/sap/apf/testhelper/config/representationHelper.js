/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.testhelper.config.representationHelper');
sap.apf.testhelper.config.representationHelper = function() {
};
sap.apf.testhelper.config.representationHelper.prototype = {
	/**
	* @memberOf sap.apf.testhelper.
	* @method representationDataWithDimension
	* @returns the structure required for Chart Representation (one dimension, one measure, no required filter)
	*          used for Following Charts:Bar,Line,Column,StackedColumn,StackedBar,PercentageStackedColumn,PercentageStackedBar
	*/
	representationDataDimension : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	representationDataDimensionContainsFilterProperty : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"name" : "CompanyCodeCountry"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	representationDataDimensionWithDuplicateName : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"fieldDesc" : {
					"type" : "label",
					"kind" : "text",
					"key" : "Year Month Custom Text"
				},
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
				"axisfeedItemId" : "categoryAxis"
			}, {
				"fieldName" : "YearMonth",
				"fieldDesc" : {
					"type" : "label",
					"kind" : "text",
					"key" : "Year Month Custom Text"
				},
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
				"axisfeedItemId" : "categoryAxis"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E",
				"name" : "RevenueAmountInDisplayCrcy_E",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
				"axisfeedItemId" : "valueAxis"
			} ],
			"requiredFilters" : [],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	representationDataWithDimension : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "YearMonth",
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
			} ],
			"measures" : [ {
				"fieldName" : "DaysSalesOutstanding",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			}, {
				"fieldName" : "Revenue",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			} ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			},
			"requiredFilters" : []
		};
		return parameter;
	},
	/**
	* @memberOf sap.apf.testhelper.
	* @method represenatationDataWithDimensionAndUnit
	* @returns the structure required for Chart Representation (one dimension, one measure, no required filter)
	*/
	representatationDataWithDimensionAndUnit : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "YearMonth",
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
			} ],
			"measures" : [ {
				"fieldName" : "DaysSalesOutstanding",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			}, {
				"fieldName" : "DaysSalesOutstanding_E",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			} ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			},
			"requiredFilters" : [],
			isAlternateRepresentation : false
		};
		return parameter;
	},
	/**
	* @memberOf sap.apf.testhelper.
	* @method selectableRepresentationDataWithDimension
	* @returns the parameters required for Chart Representation (one dimension, one measure, required filter)
	*/
	selectableRepresentationDataWithDimension : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "YearMonth",
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
			} ],
			"measures" : [ {
				"fieldName" : "DaysSalesOutstanding",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			} ],
			"requiredFilters" : [ "YearMonth" ],
			"requiredFilterOptions" : {
				"labelDiplsayOption" : "Text",
				"fieldDesc" : {
					"type" : "label",
					"kind" : "text",
					"key" : "Year Month Custom Text"
				}
			},
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			},
			isAlternateRepresentation : false
		};
		return parameter;
	},
	/**
	* @memberOf sap.apf.testhelper.
	* @method representatationDataWithReorderedDimensions
	* @returns the structure required for Chart Representation(two Dimensions,One measures,requiredfilter)
	*          used for Following Charts:LineChartWithTimeaxis
	*/
	representatationDataWithReorderedDimensions : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND
			}, {
				"fieldName" : "YearMonth",
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
			} ],
			"measures" : [ {
				"fieldName" : "DaysSalesOutstanding",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			} ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			},
			"requiredFilters" : []
		};
		return parameter;
	},
	representatationDataWithProperty : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "YearMonth"
			}, {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"orderby" : [ {
				"ascending" : false,
				"property" : "CompanyCodeCountry"
			} ],
			isAlternateRepresentation : false,
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	representatationDataForAlternateRep : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "YearMonth"
			}, {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"orderby" : [],
			isAlternateRepresentation : true
		};
		return parameter;
	},
	representatationDataForAlternateRepWithFilterDisplayOptions : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "YearMonth"
			}, {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"requiredFilterOptions" : {
				"labelDisplayOption" : "keyAndText"
			},
			"orderby" : [],
			isAlternateRepresentation : true
		};
		return parameter;
	},
	representatationWithAlternateRep : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "YearMonth"
			}, {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"orderby" : [ {
				"ascending" : false,
				"property" : "CompanyCodeCountry"
			} ],
			isAlternateRepresentation : true,
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	representatationDataWithNotAvailableOrderByAlternateRep : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			} ],
			"requiredFilters" : [],
			"orderby" : [ {
				"ascending" : false,
				"property" : "CompanyCodeCountry"
			} ],
			isAlternateRepresentation : true
		};
		return parameter;
	},
	representatationDataWithNotAvailableOrderBy : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			} ],
			"requiredFilters" : [],
			"orderby" : [ {
				"ascending" : false,
				"property" : "CompanyCodeCountry"
			} ],
			isAlternateRepresentation : false
		};
		return parameter;
	},
	representatationDataForTreeTableRep : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "Customer_NodeText",
				"kind" : "column"
			}, {
				"fieldName" : "Revenue",
				"kind" : "column"
			} ],
			"hierarchicalProperty" : [ {
				"fieldName" : "Customer",
				"kind" : "hierarchicalColumn",
				"labelDisplayOption" : "key"
			} ],
			isAlternateRepresentation : false,
			"requiredFilters" : []
		};
		return parameter;
	},
	representatationDataForTreeTableRepWithFilter : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "Customer_NodeText",
				"kind" : "column"
			}, {
				"fieldName" : "Revenue",
				"kind" : "column"
			} ],
			"hierarchicalProperty" : [ {
				"fieldName" : "Customer",
				"kind" : "hierarchicalColumn",
				"labelDisplayOption" : "text"
			} ],
			"requiredFilters" : [ "Customer_NodeID" ],
			isAlternateRepresentation : false
		};
		return parameter;
	},
	representatationDataForTreeTableRepWithFilterText : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "Customer_NodeText",
				"kind" : "column"
			}, {
				"fieldName" : "Revenue",
				"kind" : "column"
			} ],
			"hierarchicalProperty" : [ {
				"fieldName" : "Customer",
				"kind" : "hierarchicalColumn",
				"labelDisplayOption" : "text"
			} ],
			"requiredFilters" : [ "Customer_NodeID" ],
			"requiredFilterOptions" : {
				"labelDisplayOption" : "text"
			},
			isAlternateRepresentation : false
		};
		return parameter;
	},
	representatationDataForTreeTableRepWithFilterKeyText : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "Customer_NodeText",
				"kind" : "column"
			}, {
				"fieldName" : "Revenue",
				"kind" : "column"
			} ],
			"hierarchicalProperty" : [ {
				"fieldName" : "Customer",
				"kind" : "hierarchicalColumn",
				"labelDisplayOption" : "text"
			} ],
			"requiredFilters" : [ "Customer_NodeID" ],
			"requiredFilterOptions" : {
				"labelDisplayOption" : "keyAndText"
			},
			isAlternateRepresentation : false
		};
		return parameter;
	},
	representatationDataWithTopNRecords : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"orderby" : [ {
				"ascending" : false,
				"property" : "CompanyCodeCountry"
			} ],
			"top" : "10",
			isAlternateRepresentation : false
		};
		return parameter;
	},
	alternateRepresentation : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"orderby" : [ {
				"ascending" : false,
				"property" : "CompanyCodeCountry"
			} ]
		};
		return parameter;
	},
	tableRepresentation : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "YearMonth"
			} ],
			"measures" : [ {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "Revenue"
			} ],
			"requiredFilters" : []
		};
		return parameter;
	},
	/**
	* @memberOf sap.apf.testhelper.
	* @method represenatationDataWithTwoDimensionAndMeasures(Currency)
	* @returns the structure required for Chart Representation(Two Dimensions,one measure,requiredfilter)
	*          used for following chats:Bar,Line,Column,StackedColumn,StackedBar,PercentageStackedColumn,PercentageStackedBar
	*/
	representatationDataWithTwoDimensionAndMeasure : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
			}, {
				"fieldName" : "YearMonth",
				"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			} ],
			"orderby" : [ {
				"property" : "RevenueAmountInDisplayCrcy_E",
				"ascending" : false
			} ],
			"top" : "100",
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			},
			"requiredFilters" : []
		};
		return parameter;
	},
	/**
	* @memberOf sap.apf.testhelper.
	* @method getVizPropertiesJSONOnChart
	* @returns structure of vizProperties common for the charts(Bar)
	*/
	getVizPropertiesJSONOnChart : function() {
		var vizProp = {
			categoryAxis : {
				label : {
					visible : true
				},
				title : {
					visible : true
				},
				visible : true
			},
			general : {
				groupData : false
			},
			interaction : {
				selectability : {
					axisLabelSelection : false,
					legendSelection : false,
					plotLassoSelection : false,
					plotStdSelection : false
				},
				enableHover : false,
				noninteractiveMode : false,
				behaviorType : null
			},
			legend : {
				isScrollable : true,
				title : {
					visible : true
				},
				visible : true
			},
			plotArea : {
				dataLabel: {
					     hideWhenOverlap: true,
					     unitFormatType: "measureFormatter",
					     visible: false
					   },
				window : {
					start : null
				}
			},
			title : {
				text : "sample Title",
				visible : true
			},
			tooltip : {
				formatString : "measureFormatter",
				label : {
					visible : true
				},
				visible : true
			},
			valueAxis : {
				label : {
					formatString : "measureFormatter",
					visible : true
				},
				title : {
					visible : true
				},
				visible : true
			}
		};
		return vizProp;
	},
	/**
	* @memberOf sap.apf.testhelper.
	* @method getVizPropertiesJSONOnThumbnail
	* @returns structure of vizProperties common for the charts(Bar)
	*/
	getVizPropertiesJSONOnThumbnail : function() {
		var vizProp = {
			title : {
				visible : false
			},
			categoryAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			valueAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			legend : {
				visible : false,
				title : {
					visible : false
				}
			},
			tooltip : {
				visible : false
			},
			interaction : {
				selectability : {
					axisLabelSelection : false,
					legendSelection : false,
					plotLassoSelection : false,
					plotStdSelection : false
				},
				enableHover : false,
				noninteractiveMode : true
			},
			general : {
				layout : {
					padding : 0
				},
				groupData : false
			},
			plotArea : {
				background : {
					visible : false
				},
				window : {
					start : null
				},
				gridline : {
					visible : false
				},
				dataLabel : {
					visible : false
				},
				seriesStyle : {
					rules : [ {
						properties : {
							width : 1
						}
					} ]
				}
			}
		};
		return vizProp;
	},
	/**
	* @memberOf sap.apf.testhelper.
	* @method getPropertyMetadataStub
	* @returns metadata needed for fields of charts
	*/
	setPropertyMetadataStub : function() {
		var getPropertyMetadataStub = sinon.stub();
		getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"label" : "Company Code Country",
			"name" : "CompanyCodeCountry",
			"text" : "CompanyCodeCountryName"
		});
		getPropertyMetadataStub.withArgs("CompanyCodeCountryName").returns({
			"dataType" : {
				"maxLength" : "20",
				"type" : "Edm.String"
			},
			"label" : "Company Code Country",
			"name" : "CompanyCodeCountryName"
		});
		getPropertyMetadataStub.withArgs("CustomerCountry").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"label" : "Customer Country",
			"name" : "CustomerCountry"
		});
		getPropertyMetadataStub.withArgs("DaysSalesOutstanding").returns({
			"aggregation-role" : "measure",
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.Int32"
			},
			"label" : "Days Sales Outstanding",
			"name" : "DaysSalesOutstanding"
		});
		getPropertyMetadataStub.withArgs("Revenue").returns({
			"aggregation-role" : "measure",
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.Int32"
			},
			"label" : "Revenue",
			"name" : "Revenue",
			"unit" : "Currency"
		});
		getPropertyMetadataStub.withArgs("DaysSalesOutstanding_E").returns({
			"aggregation-role" : "measure",
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.Int32"
			},
			"label" : "Days Sales Outstanding_E",
			"name" : "DaysSalesOutstanding_E",
			"unit" : "CompanyCodeCountry"
		});
		getPropertyMetadataStub.withArgs("Currency").returns({
			"aggregation-role" : "measure",
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"label" : "Currency",
			"name" : "Currency",
			"unit" : "Currency"
		});
		getPropertyMetadataStub.withArgs("BestPossibleDaysSalesOutstndng").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.Int32"
			},
			"label" : "Best Possible Day Sales Outstanding",
			"name" : "BestPossibleDaysSalesOutstndng"
		});
		getPropertyMetadataStub.withArgs("YearMonth").returns({
			"dataType" : {
				"maxLength" : "8",
				"type" : "Edm.String"
			},
			"label" : "YearMonth",
			"name" : "YearMonth"
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E").returns({
			"ISOCurrency" : "DisplayCurrency",
			"label" : "Revenue in Display Currency",
			"name" : "RevenueAmountInDisplayCrcy_E",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			"dataType" : {
				"precision" : "34",
				"type" : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E.CURRENCY").returns({
			"name" : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			"semantics" : "currency-code",
			"dataType" : {
				"precision" : "5",
				"type" : "Edm.String"
			}
		});
		getPropertyMetadataStub.withArgs("OverdueDebitAmtInDisplayCrcy_E").returns({
			"ISOCurrency" : "DisplayCurrency",
			"label" : "Overdue Debit in Display Currency",
			"name" : "OverdueDebitAmtInDisplayCrcy_E",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "OverdueDebitAmtInDisplayCrcy_E.CURRENCY",
			"dataType" : {
				"precision" : "34",
				"type" : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("OverdueDebitAmtInDisplayCrcy_E.CURRENCY").returns({
			"name" : "OverdueDebitAmtInDisplayCrcy_E.CURRENCY",
			"semantics" : "currency-code",
			"dataType" : {
				"precision" : "5",
				"type" : "Edm.String"
			}
		});
		getPropertyMetadataStub.withArgs("DebitAmtInDisplayCrcy_E").returns({
			"ISOCurrency" : "DisplayCurrency",
			"label" : "Debit in Display Currency",
			"name" : "DebitAmtInDisplayCrcy_E",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "DebitAmtInDisplayCrcy_E.CURRENCY",
			"dataType" : {
				"precision" : "34",
				"type" : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("DebitAmtInDisplayCrcy_E.CURRENCY").returns({
			"name" : "DebitAmtInDisplayCrcy_E.CURRENCY",
			"semantics" : "currency-code",
			"dataType" : {
				"precision" : "5",
				"type" : "Edm.String"
			}
		});
		return getPropertyMetadataStub;
	}
};
