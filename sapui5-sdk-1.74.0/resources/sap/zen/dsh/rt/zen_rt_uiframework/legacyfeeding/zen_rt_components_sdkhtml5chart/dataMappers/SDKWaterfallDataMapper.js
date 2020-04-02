
define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKWaterfallDataMapper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKPieDataMapper",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/ChartException"],
    function(SDKPieDataMapper, ChartException) {

function SDKWaterfallDataMapper () {
	"use strict";

	SDKPieDataMapper.apply(this, arguments);
	
	this.setAnalysisAxisValue = function ( values ){
		var analysisAxis = values.data().analysisAxis;
		for ( var key in analysisAxis) {
			if ( analysisAxis[key].index == 1){
				this.analysisAxisValue = analysisAxis[key].data[0].values;
			}			
		}
	};
	
	this.setEmptyDimension = function (index, keyfigureaxis, axisDimensions)
	{
		//if (index == 1 && keyfigureaxis == "COLUMNS" && this._getColDimensionCounter() == 0 && this.getMeasureAxis() == "ROWS")
		if (keyfigureaxis == "COLUMNS" && this._getColDimensionCounter() == 0)
		{
			var dimension = {};			
			dimension.name = "";
			dimension.type = "Dimension";
			dimension.values = [''];
			//axisDimensions.data.push(dimension);
		} else if(keyfigureaxis == "ROWS" && this._getRowDimensionCounter() == 0) {
			
			var dimension = {};			
			dimension.name = "";
			dimension.type = "Dimension";
			dimension.values = [''];
			//axisDimensions.data.push(dimension);
		}
	};
	
	this.createAnalysisAxis = function (data, rowCntMeasures, colCntMeasures, rowDimCounter, colDimCounter) {
		var analysisAxis = [];
		
		if (this.isMeasuresOnlyCheck(data)) { // measure values on the data axis
			if (this.getMeasureAxis() == "ROWS") {			
				this.setDimensionsOnAxis(1, data, analysisAxis, "ROWS", colDimCounter, data.axis_rows, true);	
			}
			else {
				this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", rowDimCounter, data.axis_columns, true);
			}
		}
		else
		{
			if (this.getMeasureAxis() == "ROWS") {			
				this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns);	
			}
			else {
				this.setDimensionsOnAxis(1, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows);
			}
		}

		this.iDimensionsOnCols = analysisAxis[0].data[0].values.length; 
		return analysisAxis;
	};
	
	this.isMeasuresOnlyCheck = function(data){
		
		if(data.dimensions.length==1){
			
			if(data.dimensions[0].containsMeasures==true){
				return true;
			}
		}
		return false;
	};
	
	
	this.getAnalysisAxisValue = function(){
		return this.analysisAxisValue;
	};
	
	this.validateData = function(){
		var colDimensionCounter = this._getColDimensionCounter();
		var rowDimensionCounter = this._getRowDimensionCounter();
		var measureCounter = this.getMeasureCounter();
		var measureAxis = this.getMeasureAxis();
		
		var shortMsg = this.getMessages().chart_mapping_error;
		var longMsg = null;
		
		if (measureCounter > 0 && rowDimensionCounter >= 1 && colDimensionCounter == 0 && measureAxis == "ROWS") {	// RMnD (not order sensitive)
			longMsg = this.getMessages().waterfall_datamapping_rmd;	
		} else if (measureCounter > 0 && rowDimensionCounter == 0 && colDimensionCounter >= 1 && measureAxis == "COLUMNS") {	// CMnD (not order sensitive)
			longMsg = this.getMessages().waterfall_datamapping_cmd;
		} else if (rowDimensionCounter > 1 && measureAxis == "COLUMNS") {	// RnD_CM or RnD_CMD
			longMsg = this.getMessages().waterfall_datamapping_rnd_cm;
		} else if (colDimensionCounter > 1 && measureAxis == "ROWS") {	// RM_CnD or RMD_CnD
			longMsg = this.getMessages().waterfall_datamapping_rm_cnd;
		}
		else
			return; // data mapping is valid
		
		throw new ChartException(shortMsg, longMsg);
	};
	
	this.createMeasureValues = function (data, members, measureAxis, measureIndex) {
		var measureValuesGroup = [];
		var mvg = {};
		mvg.index = 1;
		mvg.data = [];

		var member = members[0]; 
		var mvgData = {};
		mvgData.type = "Measure";
		if (data.dimensions.length === 1 && data.dimensions[0].containsMeasures) {
			mvgData.name = ""
		} else {
			mvgData.name = member.text;
		}
		mvgData.values = this.getValues(data.data, measureAxis, 0, true, this.iDimensionsOnCols, 1, false, true);
		mvg.data.push(mvgData);
		measureValuesGroup.push(mvg);
		
		return measureValuesGroup;
	};
};


return SDKWaterfallDataMapper;
});