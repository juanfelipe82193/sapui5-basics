define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/helpers/SDKDataMapperHelper",
    [],
    function() {

         function SDKDataMapperHelper (measureCounter) {

            this.getMeasureCounter = function () {
                return measureCounter;
            };


            this.getAllRowValuesInOneArray = function (data, index, iDimensionsOnCols, iDimensionsOnRows, oneMeasure, measuresGrouped, isRowsOnly) {	// [1, 1, 1, ...]
                // All values are in array
                var valuesInArray = [];
                var values = [];
                var startIndex = data.length / this.getMeasureCounter() * index;
                var endIndex = iDimensionsOnRows;
                var dataIndex = iDimensionsOnCols * index;
                var dimensionsOnRows = isRowsOnly ? 1 : iDimensionsOnRows;
                if (!oneMeasure && data.length != 0)
                    endIndex = data.length / this.getMeasureCounter() * (index + 1);
                var dimensionsOnColsIndex = 0;
                if (!measuresGrouped) {
                    for (var c = startIndex; c < endIndex; ++c) {
                        dimensionsOnColsIndex++;
                        var val = data[c] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == dimensionsOnRows) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                        }
                    }
                    ;
                }
                else {
                    if (isRowsOnly == true) {
                        startIndex = 0;
                        dataIndex = index;
                        endIndex = iDimensionsOnRows;
                    }
                    for (var c = startIndex; c < endIndex; ++c) {
                        dimensionsOnColsIndex++;
                        var val = data[dataIndex] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                            dataIndex = this.getMeasureCounter() * iDimensionsOnCols * valuesInArray.length + (iDimensionsOnCols * index);
                        }
                        else {
                            if (isRowsOnly == true) {
                                dataIndex = dataIndex + this.getMeasureCounter();
                            }
                            else {
                                dataIndex++;
                            }
                        }
                    }
                    ;
                }

                return valuesInArray;
            };

            this.getAllColValuesInOneArrayRows = function (data, index, iDimensionsOnCols, measuresGrouped) {	// [1, 4, 7, ...]
                // All values are in array
                var valuesInArray = [];
                var values = [];
                var dimensionsOnColsIndex = 0;

                var startIndex = index;
                var dimensionsOnRowsIndex = 1;
                for (var r = 0; r < data.length / this.getMeasureCounter(); ++r) {
                    dimensionsOnColsIndex++;
                    var val = data[startIndex] + '';
                    values.push(parseFloat(val.replace(/,/g, "")));
                    if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols) {
                        valuesInArray.push(values);
                        dimensionsOnColsIndex = 0;
                        values = [];
                        startIndex = this.getMeasureCounter() * iDimensionsOnCols * valuesInArray.length + (iDimensionsOnCols * index);
                        dimensionsOnRowsIndex++;
                    }
                    else {
                        startIndex += this.getMeasureCounter();
                    }
                }

                return valuesInArray;
            };

            this.getAllColValuesInOneArray = function (data, index, iDimensionsOnCols, iDimensionsOnRows, measuresGrouped) {	// [1, 4, 7, ...]
                // All values are in array
                var valuesInArray = [];
                var values = [];
                var dimensionsOnColsIndex = 0;

                var startIndex = iDimensionsOnRows * index;
                var dimensionsOnRowsIndex = 1;

                if (!measuresGrouped) {
                    for (var r = 0; r < data.length / this.getMeasureCounter(); ++r) {
                        dimensionsOnColsIndex++;
                        var val = data[startIndex] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnRows) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                            startIndex++;
                            dimensionsOnRowsIndex++;
                        }
                        else {
                            startIndex++;
                        }
                    }
                }
                else {
                    startIndex = index;
                    for (var r = 0; r < data.length / this.getMeasureCounter(); ++r) {
                        dimensionsOnColsIndex++;
                        var val = data[startIndex] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnRows) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                            startIndex++;
                            dimensionsOnRowsIndex++;
                        }
                        else {
                            startIndex = startIndex + this.getMeasureCounter();
                        }
                    }

                }

                return valuesInArray;
            };

            this.getAllRowValuesInArray = function (data, index, iDimensionsOnCols, oneMeasure, measuresGrouped) {	// [1, 1, 1, ...]
                // All values are in array
                var valuesInArray = [];
                var values = [];
                var startIndex = data.length / this.getMeasureCounter() * index;
                var endIndex = iDimensionsOnCols;
                var dataIndex = iDimensionsOnCols * index;
                if (!oneMeasure)
                    endIndex = data.length / this.getMeasureCounter() * (index + 1);
                var dimensionsOnColsIndex = 0;
                if (!measuresGrouped) {
                    for (var c = startIndex; c < endIndex; ++c) {
                        dimensionsOnColsIndex++;
                        var val = data[c] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                        }
                    }
                    ;
                }
                else {
                    for (var c = startIndex; c < endIndex; ++c) {
                        dimensionsOnColsIndex++;
                        var val = data[dataIndex] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                            dataIndex = this.getMeasureCounter() * iDimensionsOnCols * valuesInArray.length + (iDimensionsOnCols * index);
                        }
                        else {
                            dataIndex++;
                        }
                    }
                    ;
                }

                return valuesInArray;
            };

            this.getAllColValuesInArray = function (data, index, iDimensionsOnCols, measuresGrouped) {	// [1, 4, 7, ...]
                // All values are in array
                var valuesInArray = [];
                var values = [];
                var dimensionsOnColsIndex = 0;
                if (measuresGrouped) {
                    for (var r = 0; r < data.length / this.getMeasureCounter(); ++r) {
                        dimensionsOnColsIndex++;
                        var val = data[index] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        index += this.getMeasureCounter();
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                        }
                    }
                }
                else {
                    var startIndex = iDimensionsOnCols * index;
                    var dimensionsOnRowsIndex = 1;
                    for (var r = 0; r < data.length / this.getMeasureCounter(); ++r) {
                        dimensionsOnColsIndex++;
                        var val = data[startIndex] + '';
                        values.push(parseFloat(val.replace(/,/g, "")));
                        if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols) {
                            valuesInArray.push(values);
                            dimensionsOnColsIndex = 0;
                            values = [];
                            startIndex = this.getMeasureCounter() * iDimensionsOnCols * valuesInArray.length + (iDimensionsOnCols * index);
                            dimensionsOnRowsIndex++;
                        }
                        else {
                            startIndex++;
                        }
                    }
                }

                return valuesInArray;
            };

            this.getFirstMeasureColValuesInArray = function (data, index, iDimensionsOnCols) {	// [1, 4, 7, ...]
                // All values are in array
                var valuesInArray = [];
                var values = [];
                var dimensionsOnColsIndex = 0;

                for (var r = 0; r < iDimensionsOnCols; ++r) {
                    dimensionsOnColsIndex++;
                    var val = data[index] + '';
                    values.push(parseFloat(val.replace(/,/g, "")));
                    index += data.length / iDimensionsOnCols;
                    if (iDimensionsOnCols == 0 || dimensionsOnColsIndex == iDimensionsOnCols) {
                        valuesInArray.push(values);
                        dimensionsOnColsIndex = 0;
                        values = [];
                    }
                }


                return valuesInArray;
            };

            this.setMeasuresOnAxis = function (index, axis, analysisAxis, setBlank) {

                var axisDimensions = {};
                axisDimensions.index = index;
                axisDimensions.data = [];
                var dimension;

                if (setBlank == true) {
                    dimension = {};
                    dimension.name = "";
                    dimension.type = "Dimension";
                    dimension.values = [''];
                    axisDimensions.data.push(dimension);
                }
                else {

                    for (var r = 0; r < axis.dimensions.length; r++) {
                        var dim = axis.dimensions[r];
                        dimension = {};
                        dimension.name = dim.text;
                        dimension.type = "Dimension";
                        dimension.values = [];
                        dimension.isMeasure = true;

                        for (var i = 0; i < dim.members.length; i++) {
                            dimension.values.push(dim.members[i].text);
                        }

                        axisDimensions.data.push(dimension);
                    }
                    ;
                }

                analysisAxis.push(axisDimensions);
            };
        }
        return SDKDataMapperHelper
    }
);