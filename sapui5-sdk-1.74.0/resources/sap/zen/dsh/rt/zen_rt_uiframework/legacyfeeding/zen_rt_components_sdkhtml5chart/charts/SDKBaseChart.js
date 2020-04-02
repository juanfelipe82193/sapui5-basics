//$.sap.require("sap.ui.commons.layout.AbsoluteLayout");

define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart",
    [
        "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKGenericDataMapper",
        "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/utilities/SDKUtilsHelper",
        "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/helpers/SDKChartDataFeedingHelper",
        "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/ChartException"
    ],
    function(SDKGenericDataMapper,
             SDKUtilsHelper,
             SDKChartDataFeedingHelper,
            ChartException) {

sap.ui.core.Control.extend("sap.zen.SDKBaseChart",{
	// the control API:
	metadata : {
		properties : {
			"imageVisibility" : {
				type : "boolean",
				defaultValue : false
			},
			"cvomError" : {
				type : "string",
				defaultValue : null
			},
			"width" : {
				type : "sap.ui.core.CSSSize"
			},
			"height" : {
				type : "sap.ui.core.CSSSize"
			},
			"onSelect" : {
				type : "string"
			},
			"dataLabel" : {
				type : "boolean",
				defaultValue : false
			},
			"animation" : {
				type : "boolean",
				defaultValue : true
			},
			"chartValuesFull" : {
				type : "object",
				defaultValue : {
				visible : false,
				position : "inside"
				}
			},
			"background" : {
				type : "object",
				defaultValue : {
					selectedValidValues : ["Solid Fill", "No Fill"],
					selectedValue :"Solid Fill",
					colorValidValues : [null,"transparent"],
					colorValue : null
				}
			},
			"presentation" : {
				type : "object",
				defaultValue : {
					label: "When displaying dimension values use:",
					selectedValidValues :		["defaults"               , "text"    , "key"],
					selectedValidValuesText :	["Initial View Definitions", "Text", "Key"],
					selectedValue :"defaults"
				}
			},
			"axisScaling" : {
				type : "object",
				defaultValue : {
					axisSingle : {
					fixedRange: false,
					minValue:"",
					maxValue:""
					},
					axisDual : {
					fixedRange: false,
					minValue:"",
					maxValue:""}
				}

			}
		},
		aggregations: {
			"errorLayoutControl" : {type : "sap.zen.commons.layout.AbsoluteLayout", multiple : false},
			"imageControl" : {type : "sap.ui.core.Control", multiple : false}
		}
	},

	_onInitilized : null,
	_measureFormat : null,
	_tooltipFormat: null,
	_alreadySwapped : false,
	_utilsHelper :null,
	_formattingHelper :null,
	_colourHelper:null,

	_chartDataFeedingHelper : null,
	_chartAdditionalPropertiesHelper : null,

	_lastError : null,

	ADDITIONAL_PROPERTIES_SEPARATOR : ".",

	INTERNAL_ERROR : "Internal error",

	getChartDataFeedingHelper : function () {
		if (this._chartDataFeedingHelper == null)
			this._chartDataFeedingHelper =  new SDKChartDataFeedingHelper();
		return this._chartDataFeedingHelper;
	},

	setData : function(data) {
		this.data = data;
	},

	getAxesSwapped : function() {
		return this.axesSwapped;
	},


	getData : function() {
		return this.data;
	},

	getMessages : function(){
		return this.messages;
	},
	
	getDataMapper : function () {
		return new SDKGenericDataMapper();
	},

	registerHelper : function(helper){
		if (!this.helpers){
			this.helpers = {};
		}
		if (!this.helpers[helper]){
			this.helpers[helper] = helper;
		}
	},

	init : function() {

		this.data = null;
		this.locale = null;
		this.axisFormat = null;
		this.chartFormatType = null;
		this.chartThemes = null;
		this.createImage(this.getId());
		this.createErrorLayout(this.getId());

		this.initCvomChartType();
		this.bOnAfterRendering = true;
		this._updateCvomDataNeeded = false;
		this._oldProps = {};
	},

	initCvomChartType : function() {
	},

	createImage : function(){},

	createErrorLayout : function(controlId){
		var oMessageContainer = new sap.zen.commons.layout.AbsoluteLayout(this.getId() + "_error");
		var isM = sap.zen.Dispatcher.instance.isMainMode();
		var oMessage = (isM) ? new sap.m.TextArea(this.getId() + "_errormessage") : new sap.ui.commons.TextView(this.getId() + "_errormessage");
		oMessage.setTextAlign("Center");
		if (isM){
			oMessage.setValueState(sap.ui.core.ValueState.Error);
		}
		else{
			oMessage.setDesign("Bold");
			oMessage.setSemanticColor("Critical");
		}
		oMessageContainer.addContent(oMessage, {
			left: "5px",
			top: "5px",
			right: "5px"
		});

		if (jQuery.support.opacity) {
			oMessageContainer.addStyleClass("zenMessageWithOpacity");
		} else {
			oMessageContainer.addStyleClass("zenMessageWithFilter");
		}

		this.setErrorLayoutControl(oMessageContainer);
	},


	createDataMapper : function () {
		var dataMapper = this.getDataMapper();
		dataMapper.setMessages(this.getMessages());
		return dataMapper;
	},

	getDataDualFeeding : function(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){

		var _chartDataFeedingHelper = this.getChartDataFeedingHelper();
		var bindingColor = _chartDataFeedingHelper.getDataDualFeedingColor(keyfigureindex, rowDimensionCounter, colDimensionCounter);
		var bindingaxisLabels = [];

		bindingaxisLabels.push(_chartDataFeedingHelper.getAnalysisAxisIndex1());

		var dataFeeding = [{
			"feedId" : "primaryValues",
			"binding" : [{
				"type" : "measureValuesGroup",
				"index" : 1
			}
			]
		}, {
			"feedId" : "secondaryValues",
			"binding" : [{
				"type" : "measureValuesGroup",
				"index" : 2
			}
			]
		},{
			"feedId" : "regionColor",
			"binding" : bindingColor
		},
		{
			"feedId" : "axisLabels",
			"binding" : bindingaxisLabels
		}
		];

		return dataFeeding;
	},

	getDataFeeding : function(measuresAxis, measuresIndex, numberOfRowDimensions, numberOfColDimensions) {
		var _chartDataFeedingHelper = this.getChartDataFeedingHelper();
		var axisLabelsFeedBinding = _chartDataFeedingHelper.getDataFeedingAxis(measuresAxis, measuresIndex, numberOfColDimensions, numberOfRowDimensions);
		var getMeasuresAxisIndex = function(data) {
			var measuresDimension = _.chain(data && data.dimensions)
				.findWhere({"containsMeasures": true })
				.value();

			return measuresDimension && measuresDimension.axis_index;
		}
		var measuresAxisIndex = getMeasuresAxisIndex(this.data);
		if (measuresAxisIndex === undefined) {
			measuresAxisIndex = measuresIndex;
		}
		var regionColorFeedBinding = _chartDataFeedingHelper.getDataFeedingColor(measuresAxis, measuresAxisIndex, numberOfColDimensions, numberOfRowDimensions);

		var dataFeeding = [ {
			"feedId" : "axisLabels",
			"binding" : axisLabelsFeedBinding
		}, {
			"feedId" : "regionColor",
			"binding" : regionColorFeedBinding
		}, {
			"feedId" : "primaryValues",
			"binding" : [ {
				"type" : "measureValuesGroup",
				"index" : 1
			} ]
		} ];

		return dataFeeding;
	}
});

return sap.zen.SDKBaseChart;

});