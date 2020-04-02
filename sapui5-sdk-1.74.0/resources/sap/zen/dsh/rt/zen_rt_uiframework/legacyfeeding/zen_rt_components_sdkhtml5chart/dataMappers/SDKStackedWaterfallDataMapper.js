define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKStackedWaterfallDataMapper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKChartDataMapper",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/ChartException"],
    function (SDKChartDataMapper, ChartException) {

    function SDKStackedWaterfallDataMapper () {
	"use strict";

	SDKChartDataMapper.apply(this, arguments);
	
	var measuresGrouped = true;
	var iDimensionsOnCols = 0;
	var isMultiArray = false;
	var isRowsOnly = false;
	
	this.getAnalysisAxisValue = function(){
		return this.analysisAxisValue;
	};

	
	this.createAnalysisAxis = function (data, rowCntMeasures, colCntMeasures, rowDimCounter, colDimCounter) {
		var analysisAxis = [];
		var dataMapperHelper = this.getDataMapperHelper();
		if(this.getMeasureAxis() == "COLUMNS")
			colDimCounter++;
		rowDimCounter++;
		
		
		
		if (this.isMeasuresOnlyCheck(data)) {
			if (this.getMeasureAxis() == "ROWS") {	// col measures are stacked	, other axis must be set to null
				
				dataMapperHelper.setMeasuresOnAxis(2, data, analysisAxis, true);	
				dataMapperHelper.setMeasuresOnAxis(1, data, analysisAxis, false);	
				iDimensionsOnCols = 1;
			}
			else { // row measures are stacked , other axis must be set to null
				dataMapperHelper.setMeasuresOnAxis(1, data, analysisAxis, false);	
				dataMapperHelper.setMeasuresOnAxis(2, data, analysisAxis, true);	
			
				iDimensionsOnCols = 1;
			}
		}else if(this.getMeasureAxis() == "ROWS" && rowDimCounter >0 && colDimCounter>0){
			
			this.setDimensionsOnAxis(2, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, true);	
			this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, true);
			iDimensionsOnCols = this.getIDimensionOnCols(data, analysisAxis, 1);
			isMultiArray = true;
		}
		else if(this.getMeasureAxis() == "COLUMNS" && rowDimCounter >0 && colDimCounter>0){
			
			this.setDimensionsOnAxis(1, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, true);	
			this.setDimensionsOnAxis(2, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, true);
		
			iDimensionsOnCols = this.getIDimensionOnCols(data, analysisAxis, 0);
			isMultiArray = true;
			
		}
		
		else {
		
				if (this.getMeasureAxis() == "ROWS") { // rows are stacked
					this.setDimensionsOnAxis(2, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, false);	
					this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, true);	
				}
				else { //cols are stacked
					this.setDimensionsOnAxis(1, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, true);	
					this.setDimensionsOnAxis(2, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, false);	
				}
			    isRowsOnly = true;
			}
		
		
		if (this.getMeasureAxis() == "COLUMNS" && data.dimensions[0].containsMeasures)
		{
			
			measuresGrouped = false;
			if (analysisAxis[0].data[0] != undefined)
				iDimensionsOnCols = analysisAxis[0].data[0].values.length;
			else
				iDimensionsOnCols = 1;
				
		}
		return analysisAxis;
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
		
	
	
	
	this.setDimensionsOnAxis = function (index, axis, analysisAxis, keyfigureaxis, dimCounter, dataAxisValues, measuresOnAxis) {
		var axisDimensions = {};
		var dimensionValues = [];
		axisDimensions.index = index;
		axisDimensions.data = [];
		var noEmptyDimensionIndex = -1;
		var measurePos = 0;
		var indexMeasures = -1;
		var axisContainsMeasures = false;
		$.each(dataAxisValues, function (i, dataAxisValue) {
			if (indexMeasures == -1 || dataAxisValue[measurePos] == indexMeasures) { //Detect if there is a change in the measureInde
				$.each(dataAxisValue, function (j, value) {
					if (value != -1 && (!axis.dimensions[j].containsMeasures && measuresOnAxis))
					{
						if (indexMeasures != -1 && indexMeasures)
						if (noEmptyDimensionIndex == -1)
							noEmptyDimensionIndex = j;
						if (dimensionValues[j-noEmptyDimensionIndex] == undefined)
							dimensionValues[j-noEmptyDimensionIndex] = [];
						dimensionValues[j-noEmptyDimensionIndex].push(axis.dimensions[j].members[value].text);
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
			
			if(!dim.containsMeasures){
				var dimension = {};			
				dimension.name = dim.text;
				dimension.type = "Dimension";
				dimension.values = dimensionValues[r-noEmptyDimensionIndex];
			
				axisDimensions.data.push(dimension);
			}
		};
		
		this.setEmptyDimension(index, keyfigureaxis, axisDimensions);

		analysisAxis.push(axisDimensions);
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
		var arrayofValues = [];
		var mvg = {};
		mvg.index = 1;
		mvg.data = [];

		var measureValuesMap = {};
		var nameValueMap = {};
		var _this = this;
		var index = 0;
		var values = [];
			
		values = this.getValues(data.data, measureAxis, index, false, iDimensionsOnCols, measuresGrouped, isMultiArray, measureIndex);
	
		measureValuesMap.type = "Measure";
		
		for(var i = 0; i < data.dimensions.length; i++){
			var dim = data.dimensions[i];
			if(dim.containsMeasures){
				if (data.dimensions.length === 1 && data.dimensions[0].containsMeasures) {
					measureValuesMap.name = ""
				} else {
					measureValuesMap.name = data.dimensions[i].members[0].text;
				}
			}
		}
		
		//measureValuesMap.name = data.dimensions[0].members[0].text;
		//arrayofValues.push(values);
		measureValuesMap.values = values;
		
		mvg.data.push(measureValuesMap);
			
		measureValuesGroup.push(mvg);
		
	//	console.log(JSON.stringify(measureValuesGroup));
		return measureValuesGroup;
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
			axisDimensions.data.push(dimension);
		} else if(keyfigureaxis == "ROWS" && this._getRowDimensionCounter() == 0) {
			
			var dimension = {};			
			dimension.name = "";
			dimension.type = "Dimension";
			dimension.values = [''];
			axisDimensions.data.push(dimension);
		}
	};
	
	this.getValues = function (data, axis, index, oneMeasure, iDimensionsOnCols, measuresGrouped, isMultiArray, measureIndex) {
		var values = [];
	
			if (axis == "ROWS") {
				
				if(isMultiArray){
					values = this.getAllRowValuesInArray(data, index, iDimensionsOnCols, oneMeasure, measuresGrouped, measureIndex); // arrayofarrays
				}
				else{
					values.push(data);
				}
			} else if (axis == "COLUMNS") {
				if (oneMeasure)
					values = this.getFirstMeasureColValuesInArray(data, index, iDimensionsOnCols); //one measureSupported
				else
					if(isMultiArray){
						values = this.getAllColValuesInArray(data, index, iDimensionsOnCols, oneMeasure, measuresGrouped, measureIndex); // arrayofarrays
					}
					else{
						values.push(data);
					
					}
			}

		return values;
	};
	
	this.getAllRowValuesInArray = function (data, index, iDimensionsOnCols, oneMeasure, measuresGrouped, measureIndex) {	// [1, 1, 1, ...]
		 // All values are in array
		var valuesInArray = [];
		var values = [];
		var startIndex = data.length/this.getMeasureCounter() * index;
		var endIndex = iDimensionsOnCols;
		var dataIndex = iDimensionsOnCols * index;
		if (!oneMeasure)
			endIndex = data.length;
		var dimensionsOnColsIndex = 0;
		if (!measuresGrouped)
		{
			for (var c = startIndex; c < endIndex; ++c) {
				dimensionsOnColsIndex ++;
				var val = data[c]+'';
				values.push(parseFloat(val.replace(/,/g, "")));
				if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols)
				{
					valuesInArray.push(values);
					dimensionsOnColsIndex = 0;
					values = [];
				}
			};
		}
		else
		{
			var measureCounter =  measureIndex > 1? this.getMeasureCounter():1;
			var colIncrement = 0;
			for (var c = startIndex; c < endIndex/this.getMeasureCounter(); ++c) {
				dimensionsOnColsIndex ++;
				var val = data[dataIndex + ((measureCounter * iDimensionsOnCols) * colIncrement)]+'';
				values.push(parseFloat(val.replace(/,/g, "")));
				if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols)
				{
					valuesInArray.push(values);
					dimensionsOnColsIndex = 0;
					values = [];
					//dataIndex = this.getMeasureCounter() * iDimensionsOnCols * valuesInArray.length + (iDimensionsOnCols * index);
					colIncrement++;
					dataIndex=0;
				}
				else
				{
					dataIndex++;
				}
			};
		}
		
		return valuesInArray;
	};
	
	this.getFirstMeasureColValuesInArray = function (data, index, iDimensionsOnCols) {	// [1, 4, 7, ...]
		 // All values are in array
		var valuesInArray = [];
		var values = [];
		var dimensionsOnColsIndex = 0;

		for (var r = 0; r < iDimensionsOnCols; ++r) {
			dimensionsOnColsIndex ++;
			var val = data[index]+'';
			values.push(parseFloat(val.replace(/,/g, "")));
			index += data.length/iDimensionsOnCols;
			if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols)
			{
				valuesInArray.push(values);
				dimensionsOnColsIndex = 0;
				values = [];
			}
		}	

		
		return valuesInArray;
	};
	
	this.getAllColValuesInArray = function (data, index, iDimensionsOnCols, measuresGrouped, measureIndex) {	// [1, 4, 7, ...]
		 // All values are in array
		var valuesInArray = [];
		var values = [];
		var dimensionsOnColsIndex = 0;
		var measureCounter = this.getMeasureCounter();
		
		
		if (measuresGrouped)
		{
			for (var r = 0; r < data.length/this.getMeasureCounter(); ++r) {
				dimensionsOnColsIndex ++;
				var val = data[index]+'';
				values.push(parseFloat(val.replace(/,/g, "")));
				index += this.getMeasureCounter();
				if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols)
				{
					valuesInArray.push(values);
					dimensionsOnColsIndex = 0;
					values = [];
				}
			}	
		}
		else
		{
			var measureCounter =  measureIndex == 1? this.getMeasureCounter():1;
			var startIndex = iDimensionsOnCols * index;
			var dimensionsOnRowsIndex = 0;
			for (var r = 0; r < data.length/this.getMeasureCounter(); ++r) {
				dimensionsOnColsIndex ++;
				var val = data[startIndex+(dimensionsOnRowsIndex*measureCounter)]+'';
				values.push(parseFloat(val.replace(/,/g, "")));
				if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols)
				{
					valuesInArray.push(values);
					dimensionsOnColsIndex = 0;
					values = [];
					dimensionsOnRowsIndex ++;
					startIndex = 0;
				}
				else
				{
					startIndex = startIndex + Math.round(data.length/iDimensionsOnCols);
				}
			}
		}
		
		return valuesInArray;
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
};

return SDKStackedWaterfallDataMapper;
});