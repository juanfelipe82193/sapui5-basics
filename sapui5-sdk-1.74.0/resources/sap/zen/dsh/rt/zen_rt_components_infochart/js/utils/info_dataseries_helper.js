/*global define, sap */

define("zen.rt.components.infochart/js/utils/info_dataseries_helper", [
    "underscore"], function(_){
    "use strict";

	var InfoDataSeriesHelper = function(){

		this.getTemplateShapes = function(chartProperties, chartType){
			var defaultTxt = "Column";
			if (chartType.indexOf('horizontal') !== -1){
				defaultTxt = "Bar";
			}
			return {validValues : [{ text : defaultTxt, key: 'bar'}, {text : 'Line', key: 'line'}],
					defaultSingleValue : 'line',
					dataByInitialView : {} 
				}
		};

		this.setDefaultValues = function(measuresArr, defaultSingleValue){
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

				dataValues[i].push(measuresArr[i].key);
			}
			return dataValues;
		};

		this.getMeasureIndex = function(plotAreaMeasureShapes, measureKey){
			var index = -1;
			$.each(plotAreaMeasureShapes, function(idx, shapeValue){
				var shapeKey = shapeValue[1];
				if (measureKey === shapeKey){
					index = idx;
				}
			});
			return index;
		};
	};

    InfoDataSeriesHelper.prototype.getPlotAreaMeasureShapes = function (flatdata, plotAreaMeasureShapes, chartProperties, chartType) {
    	var measureShapes = this.getTemplateShapes(chartProperties, chartType);
    	if (plotAreaMeasureShapes){
    		measureShapes = $.extend(measureShapes, plotAreaMeasureShapes);
    	}
        var dataByInitialView = {};
        if (!flatdata) {
            measureShapes.dataByInitialView = {};
            measureShapes.dataByInitialView.errorMessage = "There are no additional properties for the selected chart.";
            return measureShapes;
        }

        var measuresArr = flatdata.getMeasuresArray();
		var dataValues = [];

        if (measureShapes.data) { //check the measures are still in the resulst set 
			for (var dataIndex = 0; dataIndex < measuresArr.length; dataIndex++) {
				var measureKey = measuresArr[dataIndex].key
				if (this.getMeasureIndex(measureShapes.data, measureKey) !== -1){
					dataValues.push(measureShapes.data[dataIndex]);
				}
				else {
					dataValues.push([measureShapes.defaultSingleValue, measuresArr[dataIndex].key]);
				}
			}
			measureShapes.data = dataValues;
		}
		else{
            dataValues = this.setDefaultValues(measuresArr, measureShapes.defaultSingleValue);
		}
		measureShapes.defaultValues = this.setDefaultValues(measuresArr, measureShapes.defaultSingleValue);
		//
		dataByInitialView.data = {};

        for (var i = 0; i < measuresArr.length; i++) {
            dataByInitialView.data[measuresArr[i].text + "#KEY#" + measuresArr[i].key] = dataValues[i];
        }
        measureShapes.dataByInitialView = dataByInitialView;

        return measureShapes;
    };

	InfoDataSeriesHelper.prototype.getProperties = function(plotAreaMeasureShapes, charttype,  bindings){
		var shapes = [[],[]];
		var shapeIndex = 0;

		// does chart support dataShapes, only combination charts do. 
		var properties = sap.viz.api.metadata.Viz.get(charttype) ? sap.viz.api.metadata.Viz.get(charttype).properties : {};
		if (!(properties.plotArea && properties.plotArea.children.dataShape)){
			return shapes;
		}

		var bindingsDefs = sap.viz.api.metadata.Viz.get(charttype) ? sap.viz.api.metadata.Viz.get(charttype).bindings : [];

		// get all the measure bindings
		var measureBinds = $.grep(bindingsDefs, function(value){ return value.type === 'Measure'; });
		
		var that = this;

        // for each measure binding get the binding that has been defined for it 
		_.forEach(measureBinds, function (measureBinding) {
			var name = measureBinding.id;

			var actualBinding = _.findWhere(bindings, {"feed": name });

			// loop over the measues on the binding and try find what shape it should have.
			_.forEach(actualBinding.source, function(measurekey){
				var index = that.getMeasureIndex(plotAreaMeasureShapes.data, measurekey);
				if (index !== -1){ // found the measure assign it's user defined shape
					var item = plotAreaMeasureShapes.data[index];
					var shape = item[0]
					shapes[shapeIndex].push(shape);
				}
				else{ // assign the measure a default shape
					var defaultShape = (shapes[shapeIndex].length === 0) ? "bar" : "line";
					shapes[shapeIndex].push(defaultShape);
				}
			});
			shapeIndex = shapeIndex + 1;
		});
		return shapes;
	};

	return InfoDataSeriesHelper;
});