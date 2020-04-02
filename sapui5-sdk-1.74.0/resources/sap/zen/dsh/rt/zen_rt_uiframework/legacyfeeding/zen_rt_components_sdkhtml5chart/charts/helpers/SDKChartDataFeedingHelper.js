define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/helpers/SDKChartDataFeedingHelper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/utilities/SDKUtilsHelper",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/ChartException"],
    function(SDKUtilsHelper, ChartException) {


SDKChartDataFeedingHelper = function(){

	var ANALYSIS_AXIS_INDEX_1 = {"type" : "analysisAxis", "index" : 1};
	var ANALYSIS_AXIS_INDEX_2 = {"type" : "analysisAxis", "index" : 2};
	var MEASURE_NAMES_DIMENSION = {"type" : "measureNamesDimension"};
    var MEASURE_VALUES_GROUP_1 = {"type" : "measureValuesGroup", "index" : 4};

    var getRowsAnalysisAxis = function(measuresAxis, numberOfColDimensions){
        if (measuresAxis === "COLUMNS" && numberOfColDimensions === 0)  {
            return  ANALYSIS_AXIS_INDEX_1;
        } else {
            return ANALYSIS_AXIS_INDEX_2;
        }
    };

    var getDataFeedingShape = function(rowDimensionCounter, colDimensionCounter){
        if (colDimensionCounter > 0) {
            if (rowDimensionCounter > 0) {
                return [ANALYSIS_AXIS_INDEX_2]
            } else {
                return [ANALYSIS_AXIS_INDEX_1]
            }
        }
        return [];

	};

    var getScatterFeedingColor = function (rowDimensionCounter, colDimensionCounter) {
		if (rowDimensionCounter > 0)
			return [ANALYSIS_AXIS_INDEX_1];
        return [];
    };
	
	this.getUtilsHelper = function () {
		
		if(this._utilsHelper != null || this._utilsHelper !=undefined){
			return this._utilsHelper;
		}
		this._utilsHelper = new SDKUtilsHelper();
		return this._utilsHelper;
    };

    this.getDataFeedingColor = function (measuresAxis, measuresIndex, numberOfColDimensions, numberOfRowDimensions) {
        var bindingColor = [];

        var rowsAnalysisAxis = getRowsAnalysisAxis(measuresAxis, numberOfColDimensions);

        if (measuresAxis === "ROWS"){
            bindingColor.push(MEASURE_NAMES_DIMENSION);
        }

        if (numberOfRowDimensions > 0){
             if (measuresIndex > 0) {
                bindingColor.unshift(rowsAnalysisAxis);
            } else {
                bindingColor.push(rowsAnalysisAxis);
            }
        }

        return bindingColor;
    };

    this.getDataFeedingAxis = function (keyfigureaxis, keyfigureindex, numberOfColDimensions, numberOfRowDimensions) {
        var bindingAxis = [];

        if (keyfigureaxis == "ROWS" && numberOfColDimensions == 0 && numberOfRowDimensions == 0) {//RM
            bindingAxis.push(ANALYSIS_AXIS_INDEX_1);
        }
        else if (keyfigureaxis == "COLUMNS" && numberOfColDimensions == 0 && numberOfRowDimensions == 0) {//CM
            bindingAxis.push(MEASURE_NAMES_DIMENSION);
        }
        else {
            if (keyfigureaxis == "COLUMNS") {
                if (numberOfColDimensions == 0)
                    bindingAxis.push(MEASURE_NAMES_DIMENSION);
                else {
                    if (keyfigureindex - numberOfColDimensions == 0) {
                        bindingAxis.push(ANALYSIS_AXIS_INDEX_1);
                        bindingAxis.push(MEASURE_NAMES_DIMENSION);
                    }
                    else {
                        bindingAxis.push(MEASURE_NAMES_DIMENSION);
                        bindingAxis.push(ANALYSIS_AXIS_INDEX_1);
                    }
                }
            }
            else {
                bindingAxis.push(ANALYSIS_AXIS_INDEX_1)
            }
        }

        return bindingAxis;
    };

	//**DualChart
	this.getDataDualFeedingColor = function(keyfigureindex, rowDimensionCounter, colDimensionCounter){
		var bindingColor = [];

		if(colDimensionCounter == 0 && rowDimensionCounter > 0 ){

			if(keyfigureindex - colDimensionCounter == 0){
				bindingColor.push(MEASURE_NAMES_DIMENSION);  
				bindingColor.push(ANALYSIS_AXIS_INDEX_2);
			}
			else	{
				bindingColor.push(ANALYSIS_AXIS_INDEX_2);	
				bindingColor.push(MEASURE_NAMES_DIMENSION);
			}
		}

		if(colDimensionCounter > 0 && rowDimensionCounter == 0 ){
				bindingColor.push(MEASURE_NAMES_DIMENSION);
		}

		if(colDimensionCounter > 0 && rowDimensionCounter > 0 ) {
			if(keyfigureindex - colDimensionCounter == 0){
				bindingColor.push(MEASURE_NAMES_DIMENSION);  
				bindingColor.push(ANALYSIS_AXIS_INDEX_2);  
			}
			else{
				bindingColor.push(ANALYSIS_AXIS_INDEX_2);	
				bindingColor.push(MEASURE_NAMES_DIMENSION);
			}
			
		}
		if (colDimensionCounter == 0 && rowDimensionCounter == 0 ){
			bindingColor.push(MEASURE_NAMES_DIMENSION);
		}
		
		return bindingColor;
	};
	
	//**Bubble
	this.getDataBubbleFeedingColor = function(rowDimensionCounter, colDimensionCounter)
	{
        return getScatterFeedingColor(rowDimensionCounter, colDimensionCounter);
	};
	
	this.getDataBubbleFeedingHeight = function(bubbleHeight)
	{
        var bindingHeight = [];

        if(bubbleHeight)
        	bindingHeight.push(MEASURE_VALUES_GROUP_1);
        return bindingHeight;
	   	 
	};
	
	this.getDataBubbleFeedingShape = function(rowDimensionCounter, colDimensionCounter)
	{
        return getDataFeedingShape(rowDimensionCounter, colDimensionCounter);
	};
	
	
  //**Multiradar
	
	this.getDataMultiRadarFeedingColor = function (keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){
		var bindingColor = [];	
		if(keyfigureaxis == "ROWS" && rowDimensionCounter == 0 && colDimensionCounter ==0){
			bindingColor.push(MEASURE_NAMES_DIMENSION);
		}
		else if (rowDimensionCounter !=0){
			bindingColor.push(ANALYSIS_AXIS_INDEX_2);
     	}
 		return bindingColor;
     	 
	};
	
	this.getDataRadarFeedingColor = function (keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){
		var bindingColor = [];	
		
		if (keyfigureaxis == "ROWS" && rowDimensionCounter == 0 && colDimensionCounter == 0) {
			bindingColor.push(MEASURE_NAMES_DIMENSION);
		}
		else if (rowDimensionCounter !=0){
			if (keyfigureaxis == "ROWS") {
				if (keyfigureindex - colDimensionCounter == 0) {
					bindingColor.push(MEASURE_NAMES_DIMENSION);
					bindingColor.push(ANALYSIS_AXIS_INDEX_2);
				} 
				else {
					bindingColor.push(ANALYSIS_AXIS_INDEX_2);
					bindingColor.push(MEASURE_NAMES_DIMENSION);
				}
			} 
			else if (colDimensionCounter == 0){
				bindingColor.push(ANALYSIS_AXIS_INDEX_1);
			}
			else{
				bindingColor.push(ANALYSIS_AXIS_INDEX_2);
			}
		} 
		else if (rowDimensionCounter == 0 && colDimensionCounter > 0) {
			bindingColor.push(MEASURE_NAMES_DIMENSION);
		} 
		return bindingColor;
    	 
	};
  
	this.getDataMultiRadarFeedingAxes = function(keyfigureaxis, rowDimensionCounter, colDimensionCounter){
        var bindingAxes = [];
		if (keyfigureaxis == "ROWS" && rowDimensionCounter == 0 && colDimensionCounter == 0) {
			bindingAxes.push(ANALYSIS_AXIS_INDEX_2);
		} 
		else if (keyfigureaxis == "COLUMNS" && rowDimensionCounter == 0 && colDimensionCounter == 0) {
			bindingAxes.push(MEASURE_NAMES_DIMENSION);
		}
		else if (colDimensionCounter == 0 && rowDimensionCounter > 0) {
			bindingAxes.push(MEASURE_NAMES_DIMENSION);

		}
		else if (rowDimensionCounter == 0 && colDimensionCounter > 0) {
			bindingAxes.push(ANALYSIS_AXIS_INDEX_2);

		}
		else if (rowDimensionCounter != 0 && colDimensionCounter != 0) {
			bindingAxes.push(ANALYSIS_AXIS_INDEX_1);
		}
		return bindingAxes;
	};
	
	this.getDataMultiRadarFeedingMultiplier = function(rowDimensionCounter, colDimensionCounter){
		var bindingMultiplier = [];
		if(rowDimensionCounter !=0 && colDimensionCounter !=0){
			bindingMultiplier.push(MEASURE_NAMES_DIMENSION);	 
		}
		else
		{
		    bindingMultiplier.push(ANALYSIS_AXIS_INDEX_1);
		}
		return bindingMultiplier;
	};
	
	//**Radar
	this.getDataRadarFeedingAxes = function(keyfigureaxis, colDimensionCounter){
        var bindingAxes = [];
    	
        if(keyfigureaxis == "COLUMNS" && colDimensionCounter ==0){
       	 	bindingAxes.push(MEASURE_NAMES_DIMENSION);
		}
        else {
        	bindingAxes.push(ANALYSIS_AXIS_INDEX_1);
        }

		return bindingAxes;
	};
	
	//**Scatter
	this.getDataScatterFeedingColor = function(measuresAxis, measuresIndex, rowDimensionCounter, colDimensionCounter){
        return getScatterFeedingColor(rowDimensionCounter, colDimensionCounter)
	};
	
	this.getDataScatterFeedingShape = function(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){
        return getDataFeedingShape(rowDimensionCounter, colDimensionCounter);
	}

	this.getAnalysisAxisIndex1 = function()
	{
		return ANALYSIS_AXIS_INDEX_1;
	};
	
	this.checkFeedDefValid = function(chart, axis, dimCount, feeds){
		if (dimCount != 0){
			return;
		}
		for (var kid in feeds){
			var value = feeds[kid];
			if (value.indexOf(axis) != -1){
				throw new ChartException(chart.data.messages.feedingerror, "\nDimensions are not in the expected Axis");
			}
		}
	};
	this.genericDataFeeding = function(chart, keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){
		var utilsHelper = this.getUtilsHelper();
		var newChartOptionsProperties = chart.newChartOptionsProperties;
		var allChartOptionsMeasures = utilsHelper.allChartOptionsMeasures(newChartOptionsProperties);
		var chartType = chart.cvomType;
		var feedMeasuresArray = this.getUtilsHelper().getMetadataFeedsArray(chartType, "Measure");
		var feedDimensionArray = this.getUtilsHelper().getMetadataFeedsArray(chartType, "Dimension");
		var dataFeeding = [];
		
		//check the feeding is still valid
		if (rowDimensionCounter == 0 || colDimensionCounter == 0){
	        var actualDimCount = (chart.getAxesSwapped()) ? colDimensionCounter : rowDimensionCounter;
	        this.checkFeedDefValid(chart, "ROWS", actualDimCount, newChartOptionsProperties.feeds);
	        actualDimCount = (chart.getAxesSwapped()) ? rowDimensionCounter : colDimensionCounter;
	        this.checkFeedDefValid(chart, "COLUMNS", actualDimCount, newChartOptionsProperties.feeds);
		}
		 
		var aaIndex1Empty = false;
		var mndUsed = false;
		for (var i = feedDimensionArray.length - 1; i > -1; i--){
			var feedDimension = feedDimensionArray[i];
			var dimension = {};
			var binding = [];
			if (newChartOptionsProperties != undefined)
			{
				var feedValue = newChartOptionsProperties.feeds[feedDimension.id.replace(/\./g, "_")];
				if (feedValue != null && feedValue !== "BLANK"){
					binding.push({
						"type" : "analysisAxis",
						"index" : aaIndex1Empty == true ? 1 : feedDimension.aaIndex
					});
				}
			}
			
			// no bindings defined because they are "BLANK" and first one can be MND
			if (binding.length == 0 && feedDimension.acceptMND >= 0)
			{
				if (!mndUsed){
					binding.push({
						"type" : "measureNamesDimension",
					});
					mndUsed = true;
				}
				
				if (feedDimension.aaIndex == 1)
					aaIndex1Empty = true;
				
			}
			dimension.feedId = feedDimension.id;
			dimension.binding = binding;
			dataFeeding.push(dimension);
		}
		
		for (var measureIndex = feedMeasuresArray.length - 1; measureIndex > -1 ; measureIndex--)
		{
			var measureName = feedMeasuresArray[measureIndex];
			if (newChartOptionsProperties != undefined)
			{
				var measureFeedValue = newChartOptionsProperties.feeds[measureName.id.replace(/\./g, "_")];
				if ((measureFeedValue != undefined) && (measureFeedValue !== "")){
					var measure = {};
					var binding = [];
					binding.push({
						"type" : "measureValuesGroup",
						"index" : measureName.mgIndex
					});
					measure.feedId = measureName.id;
					measure.binding = binding;
					dataFeeding.push(measure);
				}
			}
		}

		return dataFeeding;
	};
	
	this.updateMultiLayout = function(newChartOptionsProperties, chartOption){
		var multiplier = newChartOptionsProperties.feeds.multiplier;
		var separator =  multiplier.indexOf("#");
		var multiLayoutOpt = {
				"multiLayout" : {
					"numberOfDimensionsInColumn" : separator != -1 ? multiplier.substring(separator + 1, multiplier.length) : 0
				}
			};
		$.extend(chartOption, multiLayoutOpt);
	};
};

return SDKChartDataFeedingHelper;
});