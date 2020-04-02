define("zen.rt.uiframework/legacyfeeding/zen.rt.components.html5charts/charts/helpers/DualDataSeriesHelper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/utilities/SDKUtilsHelper"],
    function(SDKUtilsHelper) {


function DualDataSeriesHelper (){
	this.getPlotAreaDataSeriesByMeasure = function(){				
		var dataMapper = this.createDataMapper();
		var plotObjectType = $.extend(true, {}, this.getProperty("plotObjectType"));
		var dataSeriesObj = {};				
		if (!this.getData()){
			plotObjectType.dataByInitialView = {};
			plotObjectType.dataByInitialView.errorMessage = "There are no additional properties for the selected chart.";
			return plotObjectType;
		}

		var utilsHelper = new SDKUtilsHelper();
		measuresArr = utilsHelper.getMeasureKeyArr(this.getData());
		var dataValues = [];
		if (!measuresArr  || measuresArr.length == 0){
			dataSeriesObj.errorMessage = "Cannot display \"Measures\" properties.  In the \"Edit Initial View\" window of the data source, in the \"Columns\" area, you included measures. In this data structure, lines cannot appear. If you want to display lines, move the measures to the \"Rows\" area.";
		}
		else{			
			if (plotObjectType.data) {
				var allNewMeasures = true;
				var populatedAxes = { "axis1": false, "axis2": false };
				for (var dataIndex = 0; dataIndex < measuresArr.length; dataIndex ++)
				{
					var index = utilsHelper.plotObjectContainsMeasure(plotObjectType.data, measuresArr[dataIndex].key, true);
					if (index > -1) {
						allNewMeasures = false;
						dataValues.push(plotObjectType.data[index]);
					}
					else if (index === -2) { // backwards compatibility
						allNewMeasures = false;
						dataValues.push([plotObjectType.data[dataIndex][0], plotObjectType.data[dataIndex][1], measuresArr[dataIndex].key]);
					}
					else {
						//Add the new measure in axis2 as a line chart
						dataValues.push(["line", "axis2", measuresArr[dataIndex].key]);
					}
					populatedAxes[dataValues[dataValues.length - 1][1]] = true;
				}
				if (allNewMeasures || !populatedAxes.axis1 || !populatedAxes.axis2)
					dataValues = this.setDefaultValues(measuresArr, plotObjectType.defaultSingleValue);
				
				plotObjectType.data = dataValues;
			}
			
			else if (plotObjectType.changedData != undefined && plotObjectType.dataByInitialView != undefined && !this.allMeasuresInObject(measuresArr, plotObjectType.dataByInitialView)){
				dataValues = this.setDefaultValues(measuresArr, plotObjectType.defaultSingleValue);
				delete plotObjectType.changedData;		
			}
			else if (plotObjectType.changedData != undefined && plotObjectType.data != undefined)
				dataValues = plotObjectType.changedData;
			else if (plotObjectType.dataByInitialView != undefined && this.allMeasuresInObject(measuresArr, plotObjectType.dataByInitialView))
				dataValues = this.getByInitialView(measuresArr, plotObjectType.dataByInitialView);
			else{
				dataValues = this.setDefaultValues(measuresArr, plotObjectType.defaultSingleValue);
			}
			

			//Set defaultValues
			plotObjectType.defaultValues = this.setDefaultValues(measuresArr, plotObjectType.defaultSingleValue);
						
			dataSeriesObj.data = {};
			
			for ( var i = 0; i < measuresArr.length; i++) {
				dataSeriesObj.data[measuresArr[i].text + "#KEY#" + measuresArr[i].key] = dataValues[i];
			}
		}
		plotObjectType.dataByInitialView = dataSeriesObj;
		return plotObjectType;
	};
	
	this.getByInitialView = function (measuresArr, dataByInitialView)
	{
		var dataByInitialViewValues = [];
		for ( var i = 0; i < measuresArr.length; i++) {
			dataByInitialViewValues[i] = [];
			dataByInitialViewValues[i].push(dataByInitialView.data[measuresArr[i]][0]);
			dataByInitialViewValues[i].push(dataByInitialView.data[measuresArr[i]][1]);
		}
		return dataByInitialViewValues;
	};
	
	this.setDefaultValues = function(measuresArr, defaultSingleValue)
	{			
		var dataValues = [];
		for ( var i = 0; i < measuresArr.length; i++) {
			dataValues[i] = [];
			if	(i == 0)
			{
				dataValues[i].push("bar");				
			}
			else
			{
				dataValues[i].push(defaultSingleValue);
			}
			if(	i < Math.ceil(measuresArr.length/2))
				dataValues[i].push("axis1");						
			else
				dataValues[i].push("axis2");
			dataValues[i].push(measuresArr[i].key);
		}	
		return dataValues;
	};
	
	this.setPlotObjectType = function(newValue){			
		var plotObjectType = $.extend(true, {}, this.getProperty("plotObjectType"));
		
		if(newValue.changedData == undefined){
			if(plotObjectType.data)
				delete plotObjectType.data; 
			if(plotObjectType.dataByInitialView){
				delete plotObjectType.dataByInitialView;
			}
				
		}
		
		$.extend(true,plotObjectType, newValue);	
		
		this.setProperty("plotObjectType",plotObjectType);
	};
	
	this.getPlotObjectType = function() {
		var plotObjectType = this.getPlotAreaDataSeriesByMeasure();
		this.setProperty("plotObjectType", plotObjectType, true);
		return  plotObjectType;
	};
	
	this.allMeasuresInObject = function(measuresArr, obj) {
		for ( var i = 0; i < measuresArr.length; i++) {
			if (obj.data == undefined || obj.data[measuresArr[i].text] == undefined)
				return false;
		}
		
		for (var obj in obj.data)
		{
			if(obj){
				if (!this.containsMeasure(measuresArr, obj))
					return false;
			}
		}
		
	    return true;
	};
	
	this.containsMeasure = function(measuresArr, measurekey)
	{
		for ( var i = 0; i < measuresArr.length; i++) {
			if (measuresArr[i].key === measurekey)
				return true;
		}
		return false;
	};
	
};

DualDataSeriesHelper.prototype.updateCvomDataOnPropertyChangeHelper = function(){
	var plotObjectType = $.extend(true, {}, this.getProperty("plotObjectType"));
	if (plotObjectType.defaultValues)
		plotObjectType.data = $.parseJSON(JSON.stringify(plotObjectType.defaultValues));
	this.setProperty("plotObjectType" ,plotObjectType);		
};
return DualDataSeriesHelper;
});