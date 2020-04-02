
define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKPieDataMapper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKChartDataMapper"],
    function(SDKChartDataMapper) {

function SDKPieDataMapper () { //SingleMeasureDM
	"use strict";

	SDKChartDataMapper.apply(this, arguments);

	this.measuresOnAxis = true;
	var measuresGrouped = true;
	var isMultiArray = false; 
	var isRowsOnly = false;
	var iDimensionsOnRows = 1;
	
	this.setEmptyDimension = function (index, keyfigureaxis, axisDimensions)
	{
		//Pie chart doesn't need empty dimensions
	};
		
	this.createAnalysisAxis = function (data, rowCntMeasures, colCntMeasures, rowDimCounter, colDimCounter) {
		var analysisAxis = [];
		this.iDimensionsOnRows = 1;
		var dataMapperHelper = this.getDataMapperHelper();
		
		if(this.getMeasureAxis() == "COLUMNS")
			colDimCounter++;
		else
			rowDimCounter++;
		
		
		if (this.isMeasuresOnlyCheck(data)) { // measure values on the data axis
			if (this.getMeasureAxis() != "ROWS") {			
				dataMapperHelper.setMeasuresOnAxis(1, data, analysisAxis);	
				this.iDimensionsOnCols = data.axis_columns.length;
			}
			else {
				dataMapperHelper.setMeasuresOnAxis(1, data, analysisAxis);
				this.iDimensionsOnRows = this.iDimensionsOnCols = data.axis_rows.length;
			}
		}
		else if (rowDimCounter >= 1 && colDimCounter == 0)
		{
			this.setDimensionsOnAxis(1, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, false);
			this.iDimensionsOnRows = this.iDimensionsOnCols = this.getIDimensionOnCols(data, analysisAxis, 0);
			this.measuresOnAxis = false;
		    this.isRowsOnly = true;
		}
		else if (rowDimCounter ==0 && colDimCounter >= 1)
		{
			this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, false);
			this.iDimensionsOnRows = this.iDimensionsOnCols = this.getIDimensionOnCols(data, analysisAxis, 0);
			this.measuresOnAxis = false;
		}
		else
		{
			if (this.getMeasureAxis() != "ROWS") {			
				//this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, true);	
				this.setDimensionsOnAxis(1, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, true);
			}
			else {
			//	this.setDimensionsOnAxis(1, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, true);
				this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, true);	
			}
			this.isMultiArray = true;
			this.iDimensionsOnCols = this.getIDimensionOnCols(data, analysisAxis, 0);
		}
		
        if (this.getMeasureAxis() == "COLUMNS" && data.dimensions[0].containsMeasures || (this.getMeasureAxis() == "ROWS" && data.dimensions[colDimCounter].containsMeasures))
        {
        	measuresGrouped = false;
        	this.isRowsOnly = false;
        }

		return analysisAxis;
	};
	
	this.setDimensionsOnAxis = function (index, axis, analysisAxis, keyfigureaxis, dimCounter, dataAxisValues, measuresOnAxis) {
		var axisDimensions = {};
		var dimensionValues = [];
		axisDimensions.index = index;
		axisDimensions.data = [];
		var noEmptyDimensionIndex = -1;
		var measurePos = 0;
		var indexMeasures = -1;
		var axisContainsMeasures = false;
		var _this = this;
		$.each(dataAxisValues, function (i, dataAxisValue) {
			if (indexMeasures == -1 || dataAxisValue[measurePos] == indexMeasures) { //Detect if there is a change in the measureInde
				$.each(dataAxisValue, function (j, value) {
					if (value != -1 && (!axis.dimensions[j].containsMeasures || measuresOnAxis))
					{
						if (indexMeasures != -1 && indexMeasures)
						if (noEmptyDimensionIndex == -1)
							noEmptyDimensionIndex = j;
						if (dimensionValues[j-noEmptyDimensionIndex] == undefined)
							dimensionValues[j-noEmptyDimensionIndex] = [];
						
						var dimLabel = _this.getDimensionLabel(axis.dimensions[j].members[value]);
						dimensionValues[j-noEmptyDimensionIndex].push(dimLabel);
					}
					else if (axis.dimensions[j].containsMeasures && indexMeasures == -1)
					{
						measurePos = j;
						indexMeasures = value;
					}
				});
			}

		});
		
		for (var r = 0; r < axis.dimensions.length; r++) {
			var dim = axis.dimensions[r];
			
			if ((dim.containsMeasures && !measuresOnAxis) || dim.axis != keyfigureaxis) {
				axisContainsMeasures = true;
				continue;
			}
			var dimension = {};			
			dimension.name = dim.text;
			dimension.type = "Dimension";
			dimension.values = dimensionValues[r-noEmptyDimensionIndex];
			
			axisDimensions.data.push(dimension);
		};
		
		this.setEmptyDimension(index, keyfigureaxis, axisDimensions);
		
		if(axisDimensions.data.length == 0){
			var emptyDim = this.getEmptyDimension();
			axisDimensions.data.push(emptyDim);
		}
		
		

		analysisAxis.push(axisDimensions);
	};
	
	this.getEmptyDimension = function ()
	{
			var dimension = {};			
			dimension.name = "";
			dimension.type = "Dimension";
			dimension.values = [''];
			return dimension;
		
	};
	
	this.getIDimensionOnCols = function (data, analysisAxis, type) {
		var iDimCols = 0;
		for(var i = 0; i<data.dimensions.length; i++){
			var dim = data.dimensions[i];

			if(dim.containsMeasures==true){

				iDimCols = analysisAxis[type].data[0].values.length;
			}
		}
		return iDimCols;
	};
	
	this.isMeasuresOnlyCheck = function(data){
		
		if(data.dimensions.length==1){
			
			if(data.dimensions[0].containsMeasures==true){
				return true;
			}
		}
		return false;
	};
	
	
	this.createMeasureValues = function (data, members, measureAxis, measureIndex) {
		var measureValuesGroup = [];
		var mvg = {};
		mvg.index = 1;
		mvg.data = [];

		var member = members[0]; 
		var mvgData = {};
		mvgData.type = "Measure";
		mvgData.key = member.key;
		if (data.dimensions.length === 1 && data.dimensions[0].containsMeasures) {
			mvgData.name = ""
		} else {
			mvgData.name = member.text;
		}
		mvgData.values = this.getValues(data.data, measureAxis, 0, this.measuresOnAxis, this.iDimensionsOnCols, this.iDimensionsOnRows, measuresGrouped, this.isMultiArray, this.isRowsOnly);
		mvg.data.push(mvgData);
		measureValuesGroup.push(mvg);
		
		return measureValuesGroup;
	};	
};
return SDKPieDataMapper;
});