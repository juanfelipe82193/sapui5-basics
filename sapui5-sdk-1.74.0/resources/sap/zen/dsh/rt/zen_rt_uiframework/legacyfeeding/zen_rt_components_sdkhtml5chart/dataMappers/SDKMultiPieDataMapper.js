define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKMultiPieDataMapper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKChartDataMapper"],
    function(SDKChartDataMapper) {
	"use strict";


    function SDKMultiPieDataMapper(){

	SDKChartDataMapper.apply(this, arguments);

	var measuresGrouped = true;
	var iDimensionsOnCols = 1;

	this.getAnalysisAxisValue = function(){
		return this.analysisAxisValue;
	};

	this.setEmptyDimension = function (index, keyfigureaxis, axisDimensions)
	{
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

	this.createAnalysisAxis = function (data, rowCntMeasures, colCntMeasures, rowDimCounter, colDimCounter) {
		var analysisAxis = [];
		if(this.getMeasureAxis() == "COLUMNS")
			colDimCounter++;
		rowDimCounter++;

		var measuresOnly = this.isMeasuresOnlyCheck(data);
		this.setDimensionsOnAxis(1, data, analysisAxis, "COLUMNS", colDimCounter, data.axis_columns, measuresOnly);
		if ((analysisAxis.length != 0 && analysisAxis[0].data[0] != undefined && analysisAxis[0].data[0].values.length > 1))
			iDimensionsOnCols = analysisAxis[0].data[0].values.length;
		this.setDimensionsOnAxis(2, data, analysisAxis, "ROWS", rowDimCounter, data.axis_rows, measuresOnly);

		if (this.getMeasureAxis() == "COLUMNS" && data.dimensions[0].containsMeasures || (this.getMeasureAxis() == "ROWS" && data.dimensions[colDimCounter].containsMeasures))
		{
			measuresGrouped = false;
			if (analysisAxis[0].data[0] != undefined)
				iDimensionsOnCols = analysisAxis[0].data[0].values.length;
			else
				iDimensionsOnCols = 1;

		}

		return analysisAxis;
	};

	this.createMeasureValues = function (data, members, measureAxis, measureIndex) {
		var measureValuesGroup = [];
		var mvg = {};
		mvg.index = 1;
		mvg.data = [];

		var measureValuesMap = {};
		var nameValueMap = {};
		var _this = this;

		$.each(members, function (index, member) {
			var measureName = member.key;
			nameValueMap[measureName] = member.text;
			var values = _this.getValues(data.data, measureAxis, index, false, iDimensionsOnCols, 1, measuresGrouped, true);
			if (!measureValuesMap[measureName]) {
				measureValuesMap[measureName] = values;
			} else {
				_this.mergeValues(measureValuesMap[measureName], values, measureAxis);
			}
		});

		$.each(measureValuesMap, function (measureName, values) {
			var mvgData = {};
			mvgData.type = "Measure";
			mvgData.name = nameValueMap[measureName];
			mvgData.values = values;
			mvg.data.push(mvgData);
		});
		measureValuesGroup.push(mvg);

		return measureValuesGroup;
	};

	this.getEmptyDimension = function ()
	{
			var dimension = {};
			dimension.name = "";
			dimension.type = "Dimension";
			dimension.values = [''];
			return dimension;

	};

	this.isMeasuresOnlyCheck = function(data){

			if(data.dimensions.length==1){

				if(data.dimensions[0].containsMeasures==true){
					return true;
				}
			}
			return false;
		};

	this.setDimensionsOnAxis = function (index, axis, analysisAxis, keyfigureaxis, dimCounter, dataAxisValues, measuresOnly, measuresOnAxis) {
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

};

return SDKMultiPieDataMapper;
});