sap.ui.define(["sap/ui/thirdparty/jquery", "sap/ui/core/Control", "sap/ui/model/json/JSONModel", "sap/ovp/cards/charts/Utils", "sap/ovp/app/resources", "sap/base/util/each"],
    function (jQuery, Control, JSONModel, Utils, OvpResources, each) {
        "use strict";
        return Control.extend("sap.ovp.cards.charts.OVPVizDataHandler", {
            metadata: {
                aggregations: {
                    data: {
                        type: "sap.ui.core.Element"
                    },
                    aggregateData: {
                        type: "sap.ui.core.Element"
                    },
                    content: {
                        multiple: false
                    }
                },
                properties: {
                    chartType: {defaultValue: false},
                    dependentDataReceived: {defaultValue: false},
                    scale: {defaultValue: ""},
                    entitySet: {}
                }
            },
            renderer: function (renderer, control) {
                renderer.write("<div");
                renderer.writeElementData(control);
                renderer.write(">");
                if (control.getContent()) {
                    renderer.renderControl(control.getContent());
                }
                renderer.write("</div>");
            },

            mergeDatasets: function (binding, oDataClone, content) {
                var that = this;
                var model = this.getModel();
                var parameters = binding.mParameters;
                var bData = jQuery.extend(true, {}, this.dataSet);
                if (parameters){
                    var selectedProperties = parameters.select.split(",");
                }
                var entitySetPath = binding.getPath().substring(1);
                var pos = -1;

                if (entitySetPath) {
                    pos = entitySetPath.indexOf('Parameters');
                }
                if (pos >= 0) {
                    entitySetPath = entitySetPath.substr(0, entitySetPath.indexOf('Parameters'));
                }
                var metaModel = model.getMetaModel();
//			var entityset = this.getEntitySet();
                var entitySetName = this.getEntitySet();
                var entitySet = metaModel.getODataEntitySet(entitySetName);
                var entityType = metaModel.getODataEntityType(entitySet.entityType);
                var finalMeasures = [];
                var finalDimensions = [];
                for (var i = 0; i < entityType.property.length; i++) { //as part of supporting V4 annotation
                    if (entityType.property[i]["com.sap.vocabularies.Analytics.v1.Measure"] || (entityType.property[i].hasOwnProperty("sap:aggregation-role") && entityType.property[i]["sap:aggregation-role"] === "measure")) {
                        if (selectedProperties && selectedProperties.indexOf(entityType.property[i].name) !== -1) {
                            finalMeasures.push(entityType.property[i].name);
                        }
                    } else {
                        if (selectedProperties && selectedProperties.indexOf(entityType.property[i].name) !== -1) {
                            finalDimensions.push(entityType.property[i].name);
                        }
                    }
                }

                if (bData && bData.results) {
                    for (var i = 0; i < bData.results.length - 2; i++) {
                        for (var j = 0; j < finalMeasures.length; j++) {
                            bData.results[0][finalMeasures[j]] = Number(bData.results[0][finalMeasures[j]]) + Number(bData.results[i + 1][finalMeasures[j]]);
                        }
                    }
                    var count = bData.__count - bData.results.length;
                    var object = {};
                    object.results = [];
                    object.results[0] = bData.results[0];
                    var result;

                    if (bData.__count > bData.results.length) {
                        var aggregateObject = jQuery.extend(true, {}, this.aggregateSet);
                        if (aggregateObject && aggregateObject.results && bData.results.length < bData.__count) {
                            each(finalMeasures, function (i) {
                                aggregateObject.results[0][finalMeasures[i]] = String(Number(that.aggregateSet.results[0][finalMeasures[i]]) - Number(object.results[0][finalMeasures[i]]));
                            });
                            each(finalDimensions, function (i) {
                                aggregateObject.results[0][finalDimensions[i]] = OvpResources.getText("OTHERS_DONUT", [count + 1]);
                            });
                            aggregateObject.results[0].$isOthers = true;
                            result = aggregateObject.results[0];

                            if (result) {
                                oDataClone.results.splice(-1, 1);
                            }
                        }
                    }
                    if (result) {
                        oDataClone.results.push(result);
                    }
                    //Non-semantic coloring for donut charts, needs to be performed here, as the rules for coloring need to be updated every time
                    //new data is loaded for the chart. This is applicable for resizable layout scenarios
                    var oCardModel = content.getModel('ovpCardProperties');
                    var bEnableStableColors = oCardModel && oCardModel.getProperty("/bEnableStableColors");
                    var oColorPalette = oCardModel && oCardModel.getProperty("/colorPalette");
                    var oChartAnnotation = entityType[oCardModel && oCardModel.getProperty("/chartAnnotationPath")];
                    //Only one dimension allowed for non semantic coloring in donut chart, also adapt colorPalette to expect an Object, in addition to an Array
                    if (oChartAnnotation.DimensionAttributes.length === 1 && bEnableStableColors && content.getVizType() === "donut"
                        && oColorPalette && (oColorPalette instanceof Object) && Object.keys(oColorPalette).length <= 10){
                        var colorPaletteDimension = oChartAnnotation.DimensionAttributes[0].Dimension.PropertyPath;

                        if (oColorPalette instanceof Array){
                            var aColorValues = oColorPalette.map(function (value) {
                                return value.color;
                            });
                            var aDuplicateColorValues = aColorValues.slice();
                        } else {
                            var oDuplicateColorValues = JSON.parse(JSON.stringify(oColorPalette));
                        }
                        var oVizProps = content.getVizProperties();
                        if (!oVizProps){
                            var vizPropertiesObject = {
                                plotArea: {
                                    dataPointStyle: {
                                        rules: []
                                    }
                                }
                            };
                            oVizProps = vizPropertiesObject;
                        }

                        if (content && oVizProps && oVizProps.plotArea){
                            //Initialize the coloring rules, everytime new data is loaded, to prevent replication of existing rules
                            if (!oVizProps.plotArea.dataPointStyle){
                                oVizProps.plotArea.dataPointStyle = {
                                    rules : []
                                };
                            } else {
                                oVizProps.plotArea.dataPointStyle.rules = [];
                            }

                            var oDimension = metaModel.getODataProperty(entityType, colorPaletteDimension);
                            if (oDimension){
                                //Dimension property label is fetched as maintained in either metadata or annotations
                                var sDimensionLabel = oDimension["com.sap.vocabularies.Common.v1.Label"] ? oDimension["com.sap.vocabularies.Common.v1.Label"].String : colorPaletteDimension;
                                var sDisplayProperty;

                                if (oDimension["com.sap.vocabularies.Common.v1.Text"]){
                                    sDisplayProperty = oDimension["com.sap.vocabularies.Common.v1.Text"]["Path"];
                                }else if (oDimension["sap:text"]){
                                    sDisplayProperty = oDimension["sap:text"];
                                }else {
                                    sDisplayProperty = oDimension;
                                }

                                var getColorRule = function(i,k, colorObject, key){
                                    return {
                                            callback: function (oContext) {
                                                if (oContext && (oContext[sDimensionLabel] === colorObject.dimensionValue) ||
                                                    (colorObject.hasOwnProperty(oContext[sDimensionLabel]))) {
                                                    return true;
                                                }
                                            },
                                            properties: {
                                                color: (aColorValues && aColorValues[i]) || (colorObject && colorObject[key])
                                            },
                                            "displayName": oDataClone.results[k][sDisplayProperty]
                                    };
                                };

                                if (oColorPalette instanceof Array){
                                    each(oColorPalette, function(i, colorObject){
                                        for (var k = 0; k < oDataClone.results.length ; k++){
                                            if (oDataClone.results[k][colorPaletteDimension] === colorObject.dimensionValue){
                                                //Load the coloring rules
                                                var oRule = getColorRule(i,k, colorObject);
                                                oVizProps.plotArea.dataPointStyle['rules'].push(oRule);
                                                //As rules, for a particular color in the palette is loaded, remove it from the color array
                                                aDuplicateColorValues.splice(i,1);
                                            }
                                        }
                                    });
                                } else {
                                    for (var k = 0; k < oDataClone.results.length ; k++){
                                        if (oColorPalette.hasOwnProperty(oDataClone.results[k][colorPaletteDimension])){
                                            //Load the coloring rules
                                            var key = oDataClone.results[k][colorPaletteDimension];
                                            var colorObject = {};
                                            colorObject[key] = oColorPalette[key];
                                            var oRule = getColorRule(i,k, colorObject, key);
                                            oVizProps.plotArea.dataPointStyle['rules'].push(oRule);
                                            //As rules, for a particular color in the palette is loaded, remove it from the color map
                                            delete oDuplicateColorValues[key];
                                        }
                                    }
                                }


                                //Handle the 'Others' section
                                if (aggregateObject){
                                    oVizProps.plotArea.dataPointStyle['rules'].push({
                                        callback: function (oContext) {
                                            if (oContext && (oContext[sDimensionLabel].lastIndexOf('Others') != -1 )) {
                                                return true;
                                            }
                                        },
                                        properties: {
                                            //Provide a color that is from the remainder of the color array or color map
                                            color: aDuplicateColorValues && aDuplicateColorValues.length ? aColorValues[aColorValues.length - 1]
                                            : Object.keys(oDuplicateColorValues).length && oDuplicateColorValues[Object.keys(oDuplicateColorValues)[0]]
                                        },
                                        "displayName": aggregateObject.results[0][colorPaletteDimension]
                                    });
                                }
                            }
                        }
                        content.setVizProperties(oVizProps);
                    }
                }

                var oModel = new JSONModel();
                oModel.setData(oDataClone.results);
                content.setModel(oModel, "analyticalmodel");
            },

            updateBindingContext: function () {
                var binding = this.getBinding("data");
                var aggrDataBinding = this.getBinding("aggregateData");
                var that = this;
                if (this.chartBinding == binding) {
                    return;
                } else {
                    this.chartBinding = binding;
                    if (binding) {
                        var that = this;
                        binding.attachEvent("dataReceived", function (oEvent) {
                            that.dataSet = oEvent && oEvent.getParameter("data");
                            that.oDataClone = jQuery.extend(true, {}, that.dataSet);
                            if (that.getChartType() == "donut" && that.getBinding("aggregateData") !== undefined) {
                                if (that.getDependentDataReceived() === true || that.getDependentDataReceived() === "true") {

                                    that.mergeDatasets(binding, that.oDataClone, that.getContent());
                                    that.setDependentDataReceived(false);
                                } else {
                                    that.setDependentDataReceived(true);
                                    //store data local
                                }
                            } else {
                                var oModel = new JSONModel();
                                if (that.dataSet) {
                                    var entitySetName = that.getEntitySet();
                                    var oCardModel = binding.getModel();
                                    var oMetadataMap = Utils.cacheODataMetadata(oCardModel);

                                    var aTimeAxisProperties = [];
                                    var oTimeAxisPropertiesAndSemantics = {};
                                    var oEntitySet = oMetadataMap[entitySetName];
                                    if (oEntitySet){
                                        //Get all properties of the Entity set for the card
                                        var aEntitySetPropKeys = Object.keys(oEntitySet);
                                    }

                                    if (aEntitySetPropKeys && aEntitySetPropKeys.length){
                                        each(aEntitySetPropKeys, function(i, property){
                                            //Check if any property of the entity set is of type 'Edm.String' AND it EITHER contains sap:semantics OR V4 support via IsCalendarYearMonth etc. is provided
                                            if (oEntitySet[property]["type"] === "Edm.String"){
                                                if (oEntitySet[property]["sap:semantics"] === "yearmonth" || oEntitySet[property]["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"]) {
                                                    aTimeAxisProperties.push(property);
                                                    oTimeAxisPropertiesAndSemantics[property] = {"sap:semantics": "yearmonth" };
                                                } else if (oEntitySet[property]["sap:semantics"] === "yearquarter" || oEntitySet[property]["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"]) {
                                                    aTimeAxisProperties.push(property);
                                                    oTimeAxisPropertiesAndSemantics[property] = {"sap:semantics": "yearquarter" };
                                                } else if (oEntitySet[property]["sap:semantics"] === "yearweek" || oEntitySet[property]["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"]) {
                                                    aTimeAxisProperties.push(property);
                                                    oTimeAxisPropertiesAndSemantics[property] = {"sap:semantics": "yearweek" };
                                                }
                                            }
                                        });
                                    }

                                    //Check if entity set properties fit the above criteria
                                    if (aTimeAxisProperties && aTimeAxisProperties.length){
                                        if (that.dataSet.results && that.dataSet.results.length){
                                            each(that.dataSet.results, function(i, result){
                                                //If result has any of the properties in oTimeAxisPropertiesAndSemantics, convert that props' value to Date object
                                                each(aTimeAxisProperties, function(i, property){
                                                    if (result.hasOwnProperty(property)){
                                                        //It is known, at this point, that there exist properties relating to dates
                                                        var dateProperty = result[property];
                                                        var year, month, quarter, monthFromQuarter, monthIndex, week, startOfWeekDay;
                                                        //Do the following:
                                                        //1. Construct date objects based on the value of sap:semantics
                                                        //2. Replace the string in the data property, with the newly created date object
                                                        switch (oTimeAxisPropertiesAndSemantics[property]["sap:semantics"]){
                                                            case 'yearmonth':
                                                                year = parseInt(dateProperty.substr(0,4), 10);
                                                                month = dateProperty.substr(4);
                                                                //month attribute in Date constructor is 0-based
                                                                monthIndex = parseInt(month, 10) - 1;
                                                                result[property] = new Date(Date.UTC(year, monthIndex));
                                                                break;
                                                            case 'yearquarter':
                                                                year = parseInt(dateProperty.substr(0,4), 10);
                                                                quarter = dateProperty.substr(4);
                                                                monthFromQuarter = (parseInt(quarter, 10) * 3) - 2;
                                                                //month attribute in Date constructor is 0-based
                                                                monthIndex = monthFromQuarter - 1;
                                                                result[property] = new Date(Date.UTC(year, monthIndex));
                                                                break;
                                                            case 'yearweek':
                                                                year = parseInt(dateProperty.substr(0,4), 10);
                                                                week = dateProperty.substr(4);
                                                                var startOfWeekDay = (1 + (parseInt(week, 10) - 1) * 7); // 1st of January + 7 days for each week
                                                                result[property] = new Date(Date.UTC(year, 0, startOfWeekDay));
                                                                break;
                                                            default: break;
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    oModel.setData(that.dataSet.results);
                                    //Since the earlier commit was throwing multiple errors in qunit, adding this check to fix the errors in short term
                                    // TODO: To be removed once the qunits are fixed
                                    //have to remove once the qunits are fixed for data errors
                                    that.oDataClone = jQuery.extend(true, {}, that.dataSet);
                                }
                                that.getContent().setModel(oModel, "analyticalmodel");
                                that.mergeDatasets(binding, that.oDataClone, that.getContent());
                            }

                        });
                    }
                    Control.prototype.updateBindingContext.apply(this, arguments);
                }
                if (this.chartAggrBinding == aggrDataBinding) {
                    return;
                } else {
                    this.chartAggrBinding = aggrDataBinding;
                    if (aggrDataBinding) {
                        var that = this;
                        aggrDataBinding.attachEvent("dataReceived", function (oEvent) {
                            that.aggregateSet = oEvent && oEvent.getParameter("data");
                            if (that.getChartType() == "donut") {
                                if (that.getDependentDataReceived() === true || that.getDependentDataReceived() === "true") {
                                    that.oDataClone = jQuery.extend(true, {}, that.dataSet);
                                    that.mergeDatasets(binding, that.oDataClone, that.getContent());
                                    that.setDependentDataReceived(false);
                                } else {
                                    that.setDependentDataReceived(true);
                                    //store data local
                                }
                            } else {
                                var oModel = new JSONModel();
                                oModel.setData(that.aggregateSet.results);
                                that.getContent().setModel(oModel, "analyticalmodel");
                            }
                        });
                    }
                    Control.prototype.updateBindingContext.apply(this, arguments);
                }
            }
        });
    });
