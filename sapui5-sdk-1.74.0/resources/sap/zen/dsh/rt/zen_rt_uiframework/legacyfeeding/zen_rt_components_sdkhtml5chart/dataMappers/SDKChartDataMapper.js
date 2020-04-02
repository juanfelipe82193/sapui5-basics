define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKChartDataMapper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/utilities/SDKUtilsHelper",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/helpers/SDKChartTypeHelper",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/helpers/SDKDataMapperHelper",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/ChartException",
    "zen.rt.uiframework/legacyfeeding/sap_viz/CrossTableDataSet"],
    function(SDKUtilsHelper, SDKChartTypeHelper, SDKDataMapperHelper, ChartException, CrossTableDataSetTemp) {

function SDKChartDataMapper () {
    "use strict";

    var _this = this;
    var _measureAxis = null;
    var _measureIndex = null;
    var _measureCounter = null;
    var _rowDimensionCounter = null;
    var _colDimensionCounter = null;
    var _dataExist = null;
    var _dataMapperHelper = null;
    var _chartTypeHelper = null;
    var _measuresHelper = null;
    var emptyMeasureForNoData = {
        "key": "12345",
        "isFake": true,
        "text": "Key Figures",
        "axis": "ROWS",
        "axis_index": 0,
        "containsMeasures": true,
        "members": [
            {
                "key": "",
                "text": "",
                "scalingFactor": 0,
                "unitOfMeasure": "",
                "formatString": ""
            }
        ]
    };

    var _utilsHelper = null;

    this.getDataMapperHelper = function () {
        if (_dataMapperHelper == null)
            _dataMapperHelper = new SDKDataMapperHelper(this.getMeasureCounter());
        return _dataMapperHelper;
    };

    this.getChartTypeHelper = function () {
        if (_chartTypeHelper == null)
            _chartTypeHelper = new  SDKChartTypeHelper();
        return _chartTypeHelper;
    };

    this.getMessages = function () {
        return this.messgaes;
    };

    this.setMessages = function (messages) {
        this.messgaes = messages;
    };

    var setMeasureAxis = function (measureAxis) {
        _measureAxis = measureAxis;
    };

    this.getMeasureAxis = function () {
        return _measureAxis;
    };

    var setMeasureIndex = function (measureIndex) {
        _measureIndex = measureIndex;
    };

    this.getMeasureIndex = function () {
        return _measureIndex;
    };

    var setMeasureCounter = function (measureCounter) {
        _measureCounter = measureCounter;
    };

    this.getMeasureCounter = function () {
        return _measureCounter;
    };

    var setDataExist = function (dataExist) {
        _dataExist = dataExist;
    };

    this._getDataExist = function () {
        return _dataExist;
    };

    var setRowDimensionCounter = function (rowDimensionCounter) {
        _rowDimensionCounter = rowDimensionCounter;
    };

    this._getRowDimensionCounter = function () {
        return _rowDimensionCounter;
    };

    var setColDimensionCounter = function (colDimensionCounter) {
        _colDimensionCounter = colDimensionCounter;
    };

    this._getColDimensionCounter = function () {
        return _colDimensionCounter;
    };

    this.setDataFeeding = function (dataFeeding) {
        this.dataFeeding = dataFeeding;
    };

    this.getDataFeeding = function () {
        return this.dataFeeding;
    };

    this.setTotalMeasure = function (values) {

        var total = 0;
        var val;
        for (var index = 0; index < values.length; index++) {
            val = values[index][0] || 0;
            total = total + val;
        }
        ;
        _this.total = total;
    };

    this.getTotalMeasure = function (values) {
        return _this.total;
    };

    this.setNumberOfDimensions = function (data) {

        var dimensions = data.dimensions;
        var colDimensionCounter = 0;
        var rowDimensionCounter = 0;

        $.each(dimensions, function (index, dim) {
            if (dim.axis == "COLUMNS" && !dim.containsMeasures)
                colDimensionCounter++;
            else if (dim.axis == "ROWS" && !dim.containsMeasures)
                rowDimensionCounter++;
        });
        setRowDimensionCounter(rowDimensionCounter);
        setColDimensionCounter(colDimensionCounter);

    };

    this.setInfo = function (data, charttype) {
        var isEmpty = true;

        for (var index = 0; index < data.data.length; index++) {
            if (data.data[index] != null) {
                isEmpty = false;
                break;
            }
        }

        if (this._getColDimensionCounter() == 0) {
            emptyMeasureForNoData.axis = "COLUMNS";
        }

        if (isEmpty) {
            if (!this.getUtilsHelper().hasMeasures(data)) {
                data.dimensions.push(emptyMeasureForNoData);
            }
        }

        var measureCounter = 0;
        var measureAxis = "";
        var measureIndex = -1;

        for (var i = 0; i < data.dimensions.length; i++) {
            var dim = data.dimensions[i];
            if (dim.containsMeasures == true) {
                measureAxis = dim.axis;
                measureCounter = dim.members.length;
                measureIndex = i;
                break;
            }
        }

        if (measureCounter == 0) {
            data.dimensions.push(emptyMeasureForNoData);
            measureAxis = emptyMeasureForNoData.axis;
            measureCounter = emptyMeasureForNoData.members.length;
        }

        setMeasureAxis(measureAxis);
        setMeasureIndex(measureIndex);
        setMeasureCounter(measureCounter);
        this.setNumberOfDimensions(data);
        setDataExist(!isEmpty);

        validateInfo(data, charttype);
    };

    this.validateData = function () {
    };

    var validateInfo = function (data, charttype) {
        var chartTypeHelper = _this.getChartTypeHelper();

        if ((chartTypeHelper.isScatterBubbleChart(charttype)) || (chartTypeHelper.isRadarChart(charttype))) {
            _this.validateData(charttype);

        }
        else if (chartTypeHelper.isDualChart(charttype)) {
            if (data.dualAxis != undefined) {
                var measuresInAxis1 = 0;
                var measuresInAxis2 = 0;

                for (var i = 0; i < data.dualAxis.length; i++) {
                    if (data.dualAxis[i][1] == "axis1")
                        measuresInAxis1++;
                    else
                        measuresInAxis2++;
                }
                if (measuresInAxis1 == 0 && measuresInAxis2 == 0)
                    throw new ChartException(_this.getMessages().datasource_no_measures);
            }
            _this.validateData(data, charttype);
        }
        else {
            _this.validateData();
        }
    };

    this.setAnalysisAxisValue = function (values) {

    };

    this.getAnalysisAxisValue = function () {
        return null;
    };

    this.getxAxisValues = function (data) {
        this.setInfo(data);


        var analysisAxis = _this.createAnalysisAxisGroup(data);

        var measureValuesGroup = createMeasureValuesGroup(data, analysisAxis);
        this.setTotalMeasure(measureValuesGroup[0].data[0].values);

        for (var key in analysisAxis) {
            if (analysisAxis[key].index == 1) {
                return analysisAxis[key].data[0].values;
            }
        }
    };

    var createMeasureValuesGroup = function (data, analysisAxis) {
        var measureAxis = _this.getMeasureAxis();
        var measureIndex = _this.getMeasureIndex();

        var tuples = {};

        $.each(data.dimensions, function (index, dimension) {
            if (dimension.containsMeasures) {
                tuples = dimension.members;
            }
        });


        var measureValues;
        if (data.cvomType && data.cvomType === "viz/waterfall" || data.cvomType === "viz/horizontal_waterfall" || data.cvomType === "viz/stacked_waterfall" || data.cvomType.indexOf("pie") !== -1) {
            var measureAxis = _this.getMeasureAxis();
            var measureIndex = _this.getMeasureIndex();

            var tuples = {};

            $.each(data.dimensions, function (index, dimension) {
                if (dimension.containsMeasures) {
                    tuples = dimension.members;
                }
            });
            measureValues = _this.createMeasureValues(data, tuples, measureAxis, measureIndex);

        } else {
            measureValues = _this.createMeasureValues(data, analysisAxis)
        }


        return measureValues;
    };


    this.createDataSet = function (data) {

        var vizData = {};

        vizData.analysisAxis = _this.createAnalysisAxisGroup(data);
        vizData.measureValuesGroup = createMeasureValuesGroup(data, vizData.analysisAxis);

        var ds = new CrossTableDataSetTemp();
        ds.data(vizData);
        return ds;
    };

    this.findKeyFigureAxis = function (data) {
        for (var i = 0; i < data.dimensions.length; i++) {
            if (data.dimensions[i].containsMeasures) {
                return data.dimensions[i].axis;
            }
        }
    };

    this.setDimensionsOnAxis = function (index, axis, analysisAxis, keyfigureaxis, dimCounter, dataAxisValues, measuresOnAxis) {
        var axisDimensions = {};
        var dimensionValues = [];
        axisDimensions.index = index;
        axisDimensions.data = [];
        var noEmptyDimensionIndex = -1;
        var measurePos = 0;
        var indexMeasures = -1;
        var _this = this;
        $.each(dataAxisValues, function (i, dataAxisValue) {
            if (indexMeasures == -1 || dataAxisValue[measurePos] == indexMeasures) { //Detect if there is a change in the measureIndex
                $.each(dataAxisValue, function (j, value) {
                    if (value != -1 && (!axis.dimensions[j].containsMeasures || measuresOnAxis)) {
                        if (indexMeasures != -1 && indexMeasures)
                            if (noEmptyDimensionIndex == -1)
                                noEmptyDimensionIndex = j;
                        if (dimensionValues[j - noEmptyDimensionIndex] == undefined)
                            dimensionValues[j - noEmptyDimensionIndex] = [];


                        var dimLabel = _this.getDimensionLabel(axis.dimensions[j].members[value], axis.presentationValue);
                        dimensionValues[j - noEmptyDimensionIndex].push(dimLabel);
                    }
                    else if (axis.dimensions[j].containsMeasures && indexMeasures == -1) {
                        measurePos = j;
                        indexMeasures = value;
                    }
                });
            }

        });

        for (var r = 0; r < axis.dimensions.length; r++) {
            var dim = axis.dimensions[r];

            if ((dim.containsMeasures && !measuresOnAxis) || dim.axis != keyfigureaxis) {
                continue;
            }
            var dimension = {};
            dimension.name = dim.text;
            dimension.type = "Dimension";
            dimension.values = dimensionValues[r - noEmptyDimensionIndex];

            axisDimensions.data.push(dimension);
        }
        ;

        analysisAxis.push(axisDimensions);
    };

    this.createAnalysisAxis = function (data, rowCntMeasures, colCntMeasures, rowDimCounter, colDimCounter) {
        return null;
    };

    this.createAnalysisAxisGroup = function (data) {
        var measureAxis = this.getMeasureAxis();
        var measureCounter = this.getMeasureCounter();

        var colCntMeasures = 1;
        var rowCntMeasures = 1;
        if (measureAxis == "COLUMNS")
            colCntMeasures = measureCounter;
        else if (measureAxis == "ROWS")
            rowCntMeasures = measureCounter;

        return this.createAnalysisAxis(data, rowCntMeasures, colCntMeasures, this._getRowDimensionCounter(), this._getColDimensionCounter());
    };


    //   |      D1       |      D2       |      D3       |
    //   -------------------------------------------------
    //   |AAA|BBB|CCC|...|AAA|BBB|CCC|...|AAA|BBB|CCC|...|
    //----------------------------------------------------
    //aaa| 1 | 2 | 3 |...| 1 | 2 | 3 |...| 1 | 2 | 3 |...|
    //----------------------------------------------------
    //bbb| 4 | 5 | 6 |...| 4 | 5 | 6 |...| 4 | 5 | 6 |...|
    //----------------------------------------------------
    //ccc| 7 | 8 | 9 |...| 7 | 8 | 9 |...| 7 | 8 | 9 |...|
    //----------------------------------------------------
    //...|...|...|...|...|...|...|...|...|...|...|...|...|
    //----------------------------------------------------

    this.getValues = function (data, axis, index, oneMeasure, iDimensionsOnCols, iDimensionsOnRows, measuresGrouped, isMultiArray, isRowsOnly) {
        var values = [];
        var dataMapperHelper = this.getDataMapperHelper();
        if (axis == "ROWS") {
            if (isMultiArray) {
                values = dataMapperHelper.getAllRowValuesInArray(data, index, iDimensionsOnCols, oneMeasure, measuresGrouped);
            } else {
                values = dataMapperHelper.getAllRowValuesInOneArray(data, index, iDimensionsOnCols, iDimensionsOnRows, oneMeasure, measuresGrouped, isRowsOnly);
            }
        } else if (axis == "COLUMNS") {
            if (oneMeasure)
                values = dataMapperHelper.getFirstMeasureColValuesInArray(data, index, iDimensionsOnCols); //Used for PieChart
            else if (isMultiArray) {
                values = dataMapperHelper.getAllColValuesInArray(data, index, iDimensionsOnCols, measuresGrouped);
            }
            else if (isRowsOnly) {
                values = dataMapperHelper.getAllColValuesInOneArrayRows(data, index, iDimensionsOnCols, iDimensionsOnRows, measuresGrouped);
            }
            else {
                values = dataMapperHelper.getAllColValuesInOneArray(data, index, iDimensionsOnCols, iDimensionsOnRows, measuresGrouped);
            }
        }
        return values;
    };


    this.getIDimensionOnRows = function (data, analysisAxis, type) {
        var iDimRows = 0;

        if (analysisAxis[type].data[0] != undefined) {
            iDimRows = analysisAxis[type].data[0].values.length;
        }

        return iDimRows;
    };

    this.mergeValues = function (values, newValues, axis) {
        if (axis == "ROWS") {
            values.push(newValues[0]);
        } else if (axis == "COLUMNS") {
            $.each(newValues, function (index, value) {
                values[index].push(value[0]);
            });
        }
        ;
    };

    this.mapData = function (chart, data) {

        data.dualAxis = chart.dualAxis;
        this.setInfo(data, chart.cvomType);
        var cvomData = {};
        data.presentationValue = chart.mProperties.presentation.selectedValue;
        // This is still POC to deliver the full chart type properties
        data.newChartOptionsProperties = chart.newChartOptionsProperties;
        data.cvomType = chart.cvomType; //The feeding information is coming empty the first time

        cvomData.ds = this.createDataSet(data);
        cvomData.dataFeeding = this.getChartDataFeeding(chart);

        this.setAnalysisAxisValue(cvomData.ds);

        return cvomData;
    };

    this.getChartDataFeeding = function (chart) {
        var chartTypeHelper = this.getChartTypeHelper();
        var measureCounter = this.getMeasureCounter();
        var chartDataFeedingHelper = chart.getChartDataFeedingHelper();
        var measureAxisDimensionCnt = (this.getMeasureAxis() == "ROWS") ? this._getRowDimensionCounter() : this._getColDimensionCounter();

        if ((chart.isGenericViz) || ((chart.newChartOptionsProperties !== undefined) && (chart.newChartOptionsProperties.feeds !== undefined)))
            return chartDataFeedingHelper.genericDataFeeding(chart, this.getMeasureAxis(), this.getMeasureIndex(), _rowDimensionCounter, _colDimensionCounter);

        if (chartTypeHelper.isScatterChart(chart.cvomType)) {
            return chart.getDataFeeding(this.getMeasureAxis(), this.getMeasureIndex(), _rowDimensionCounter, _colDimensionCounter);
        }
        else if (chartTypeHelper.isBubbleChart(chart.cvomType)) {
            var bubbleHeight = false;
            if (measureCounter > 3)
                bubbleHeight = true;
            return chart.getDataFeeding(this.getMeasureAxis(), this.getMeasureIndex(), _rowDimensionCounter, _colDimensionCounter, bubbleHeight);
        }
        else if (chartTypeHelper.isRadarChart(chart.cvomType)) {
            return chart.getDataFeeding(this.getMeasureAxis(), this.getMeasureIndex(), _rowDimensionCounter, _colDimensionCounter, measureCounter);
        }
        else if (chartTypeHelper.isDualChart(chart.cvomType)) {
            return chart.getDataDualFeeding(this.getMeasureAxis(), this.getMeasureIndex(), _rowDimensionCounter, _colDimensionCounter);
        }
        else {
            return chart.getDataFeeding(this.getMeasureAxis(), this.getMeasureIndex(), _rowDimensionCounter, _colDimensionCounter, measureAxisDimensionCnt);
        }

    };

    this.getLegendValues = function (chart, keyAxis) {

        var data = chart.getData();
        var measuresHelper = this.getMeasuresHelper();
        var legendValues = [""];
        if (!(data))
            return null;

        this.setInfo(data, chart.cvomType);
        var cvomData = {};
        data.axesSwapped = chart.axesSwapped;
        data.presentationValue = chart.mProperties.presentation.selectedValue;
        data.cvomType = chart.cvomType;
        cvomData.ds = chart.getMappedData().ds;

        var measureIndex = this.getMeasureIndex();
        var measureAxis = this.getMeasureAxis();

        if (keyAxis && measureAxis != keyAxis)
            return null;

        var measureCounter = this.getMeasureCounter();
        var rowDimensionCounter = this._getRowDimensionCounter();
        var colDimensionCounter = this._getColDimensionCounter();

        if (keyAxis == "ROWS") {
            return measuresHelper.getMeasureTuplesCombination(data, measureIndex);
        }

        if (chart.getDataFeeding() == undefined) {
            var index = 0;
            // CSN 0000878217 - specific fix (TODO: consider implement by inheritance)
            if (chart.cvomType == "viz/multi_pie" || chart.cvomType == "viz/stacked_waterfall") {
                index = 1;
            }
            else if (chart.cvomType == "viz/waterfall" || chart.cvomType == "viz/horizontal_waterfall" || chart.cvomType == "viz/horizontal_waterfall")
                return measuresHelper.getMeasureTuples(cvomData.ds);

            return measuresHelper.getRowDimTuples(cvomData.ds, index);
        }
        if (chart.cvomType == "viz/multi_radar" || chart.cvomType == "viz/radar") {
            if (rowDimensionCounter == 0 && colDimensionCounter == 0 && measureAxis == "COLUMNS")
                return legendValues;
            else if (rowDimensionCounter == 0)
                return measuresHelper.getMeasureTuples(cvomData.ds); //CDM, CMD, RM_CD, RM
            else if (chart.cvomType == "viz/multi_radar")
                return measuresHelper.getRowDimTuples(cvomData.ds, 1); // CM_1DR, CM_2DR, CM_3DR, CM, RDM, RMD, CDM_RD, RDM_CD, RMD_CD
            //else
            //	return measuresHelper.getRowDimTuples(cvomData.ds , 0); // CM_1DR, CM_2DR, CM_3DR, CM, RDM, RMD, CDM_RD, RDM_CD, RMD_CD
        }
        if (measureCounter > 0 && rowDimensionCounter > 0 && measureAxis == "ROWS") {
            legendValues = measuresHelper.getMeasureAndRowDimTuples(cvomData.ds, measureIndex - colDimensionCounter);
        }
        if (measureAxis == "COLUMNS") {
            if (rowDimensionCounter == 0 && colDimensionCounter == 0) {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 0);
            }
            else if (rowDimensionCounter == 0 && colDimensionCounter > 1) {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 1); //TODO return just one
            }
            else if (rowDimensionCounter > 0 && colDimensionCounter == 0) {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 0);
            }
            else {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 1);
            }
        } else if (measureCounter > 0 && rowDimensionCounter == 0 && measureAxis == "ROWS") {
            legendValues = measuresHelper.getMeasureTuples(cvomData.ds);
        }

        return legendValues;
    };

    this.getLegendValuesFromData = function (data, axesSwapped, cvomType, presentationValue) {

        var measuresHelper = this.getMeasuresHelper();
        var legendValues = [""];
        if (!(data))
            return null;

        this.setInfo(data, cvomType);
        var cvomData = {};
        data.axesSwapped = axesSwapped;
        data.presentationValue = presentationValue;
        cvomData.ds = this.createDataSet(data);

        var measureIndex = this.getMeasureIndex();
        var measureAxis = this.getMeasureAxis();

        var measureCounter = this.getMeasureCounter();
        var rowDimensionCounter = this._getRowDimensionCounter();
        var colDimensionCounter = this._getColDimensionCounter();


        var index = 0;
        // CSN 0000878217 - specific fix (TODO: consider implement by inheritance)
        if (cvomType == "viz/multi_pie" || cvomType == "viz/stacked_waterfall" || cvomType == "viz/pie") {
            if (cvomType != "viz/pie")
                index = 1;
            return measuresHelper.getRowDimTuples(cvomData.ds, index);
        }
        else if (cvomType == "viz/waterfall" || cvomType == "viz/horizontal_waterfall" || cvomType == "viz/horizontal_waterfall")
            return measuresHelper.getMeasureTuples(cvomData.ds);

        else if (cvomType == "viz/multi_radar" || cvomType == "viz/radar") {
            if (rowDimensionCounter == 0 && colDimensionCounter == 0 && measureAxis == "COLUMNS")
                return legendValues;
            else if (rowDimensionCounter == 0)
                return measuresHelper.getMeasureTuples(cvomData.ds); //CDM, CMD, RM_CD, RM
            else if (cvomType == "viz/multi_radar")
                return measuresHelper.getRowDimTuples(cvomData.ds, 1); // CM_1DR, CM_2DR, CM_3DR, CM, RDM, RMD, CDM_RD, RDM_CD, RMD_CD
        }

        if (this.getChartTypeHelper().isScatterBubbleChart(data.cvomType) && rowDimensionCounter > 0) {
            for (var i = 0; i < data.dimensions.length; i++) {
                var currentDim = data.dimensions[i];
                if (currentDim.axis === "ROWS" && currentDim.axis_index === 0) {
                    legendValues = data.dimensions[i].members.map(function (currentMember) {
                        return currentMember.text;
                    });
                    break;
                }
            }
        } else if (measureAxis == "COLUMNS") {
            if (rowDimensionCounter == 0 && colDimensionCounter == 0) {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 0);
            }
            else if (rowDimensionCounter == 0 && colDimensionCounter > 1) {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 1); //TODO return just one
            }
            else if (rowDimensionCounter > 0 && colDimensionCounter == 0) {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 0);
            }
            else {
                legendValues = measuresHelper.getRowDimTuples(cvomData.ds, 1);
            }
        } else if (measureCounter > 0 && rowDimensionCounter > 0 && measureAxis == "ROWS") {
            legendValues = measuresHelper.getMeasureAndRowDimTuples(cvomData.ds, measureIndex - colDimensionCounter);
        } else if (measureCounter > 0 && rowDimensionCounter == 0 && measureAxis == "ROWS") {
            if (this.getChartTypeHelper().isDualChart(cvomType)) {
                legendValues = ["Axis 1", "Axis 2"];
            } else {
                legendValues = measuresHelper.getMeasureTuples(cvomData.ds);
            }

        }

        return legendValues;

    };

    this.setEmptyDimension = function (index, analysisAxis) {

        var axisDimensions = {};
        var dimension = {};

        axisDimensions.index = index;
        axisDimensions.data = [];

        dimension.name = "";
        dimension.type = "Dimension";
        dimension.values = [''];

        axisDimensions.data.push(dimension);
        analysisAxis.push(axisDimensions);
    };

    this.getDimensionLabel = function (dimension, presentationValue) {
        return dimension.text;
    };

    this.getUtilsHelper = function () {

        if (this._utilsHelper != null || this._utilsHelper != undefined) {
            return this._utilsHelper;
        }
        this._utilsHelper = new SDKUtilsHelper();
        return this._utilsHelper;
    };
};

return SDKChartDataMapper;
});

