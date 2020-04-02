/* global define, sap, $, com, _*/
define("zen.rt.components.infochart/js/info_ctrl", [
    "zen.rt.components.infochart/js/utils/info_error_handler",
    "zen.rt.components.infochart/js/utils/info_error_lookup",
    "zen.rt.components.infochart/js/utils/info_data_mapper",
    "zen.rt.components.infochart/js/info_vizframe",
    "zen.rt.components.infochart/js/utils/info_default_data",
    "zen.rt.components.infochart/js/utils/info_chart_exception",
    "zen.rt.components.infochart/js/utils/info_conditional_format_mapper",
    "zen.rt.components.infochart/js/utils/sdk_data",
    "zen.rt.components.infochart/js/utils/info_chart_locale",

    "zen.rt.components.infochart/js/utils/info_binding_service",
    "zen.rt.components.infochart/js/utils/info_legacy_binding_service",
    "zen.rt.components.infochart/js/utils/info_property_builder",
    "zen.rt.components.infochart/js/utils/info_dataseries_helper",
    "zen.rt.components.infochart/js/utils/info_id_utils",
    "zen.rt.components.infochart/js/utils/waterfall_data_factory",
    "zen.rt.components.infochart/js/utils/hichert_data_factory"
], function (ControlErrorHandler, ErrorLookup, InfoDataMapper, Vizframe, cannedData,
             InfoChartException, ConditionalFormatMapper, SdkData, InfoChartLocale,
             infoBindingService, InfoLegacyBindingService, InfoPropertyBuilder,
             InfoDataSeriesHelper, InfoIDUtils, WaterfallDataFactory, HichertDataFactory) {

    "use strict";

    var INFO_CHART_UPDATE_EVENT_ID = "infochartupdate",
        infoChartLocale = new InfoChartLocale(),
        infoIDUtils = new InfoIDUtils();

    sap.ui.core.Control.extend("com.sap.ip.bi.InfoChart", {

        // the control API:
        metadata: {
            properties: {
                "width": {
                    type: "sap.ui.core.CSSSize"
                },
                "height": {
                    type: "sap.ui.core.CSSSize"
                },
                "CHARTTYPE": {
                    type: "string"
                },
                "cvomdata": {
                    type: "object"
                },
                "cvombinding": {
                    type: "object"
                },
                "chartconfig": {
                    type: "object"
                },
                "data": {
                    type: "object"
                },
                "chartSelection": {
                    type: "object"
                },
                "showTotals": {
                    type: "boolean"
                },
                "showScaling": {
                    type: "boolean"
                },
                "enableConditionalFormatting": {
                    type: "boolean"
                },
                "plotAreaMeasureShapes": {
                    type: "object"
                },
                "enrichData": {
                    type: "object"
                },
                "useLegacyBindings": {
                    type: "boolean"
                }
            },
            events: {
            	chartError: {}
            }
        },

        setProperty: sap.ui.base.ManagedObject.prototype.setProperty,

        init: function (errorHandler, infoDataMapper, conditionalFormatMapper, initInfoBindingService) {
            var that = this;
            this._errorHandler = errorHandler || new ControlErrorHandler(this,
                new ErrorLookup(sap.zen.designmode, infoChartLocale), sap.zen.designmode);
            this._infoDataMapper = infoDataMapper || new InfoDataMapper();
            this._conditionalFormatMapper = conditionalFormatMapper || new ConditionalFormatMapper();
            this._infoBindingService = initInfoBindingService || infoBindingService;
            this._legacyBindingService = new InfoLegacyBindingService();
            sap.viz.api.env.Resource.path("sap.viz.api.env.Template.loadPaths", ["../libs/resources/chart/templates"]);
            this.attachEvent("EventHandlerChange", undefined, function(e) {
                handleListenerAttached(that, e);
            });
            this._dataSeriesHelper = new InfoDataSeriesHelper();
        },

        initDesignStudio: function () {
        },

        beforeDesignStudioUpdate: function () {
            this._errorHandler.clearError();
            this._oldChartType = this.getCHARTTYPE();
        },

        afterDesignStudioUpdate: function () {
        },

        onAfterRendering: function () {
            var chart = this;
            infoChartLocale.onLoad(function () {
                try {
                    chart._errorHandler.checkError();
                    updateChart(chart);
                } catch (err) {
                    chart._errorHandler.renderError(err);
                }
            });
        },
        renderer: function (oRm, oControl) {
            
            // during resize the content or control can be undefined
            if (oControl.oComponentProperties.content && oControl.oComponentProperties.content.control){
                var chartMode = oControl.oComponentProperties.content.control.chart_mode;
                if(chartMode) {
                   // TODO - check oldChartMode, waiting for cvom property getter fix
                   // var currentChartMode = sap.viz.api.env.globalSettings();
                    sap.viz.api.env.globalSettings({"treatAsMobile": chartMode.toLowerCase()});
                }
            }

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.addClass("sapzeninfochart");
            oRm.writeStyles();
            oRm.writeClasses();
            oRm.write("data-chart-identifier=\"CLIENT_SIDE_INFO_CHART\"");
            oRm.write(">");
            // TODO use a class rather than inline styles
            oRm.write("<div id='" + oControl.getId() + "_container' style='width: 100%; height: 100%; overflow:visible'></div>");
            oRm.write("</div>"); // end of the complete control
        },
        exit: function(){
            if (this._vizframe) {
                // this._vizframe.destroy() causes load of excptions on IE when switching tabs
                delete this._vizframe;
            }
        },

        getContextMenuAction: function ( /*sContextMenuComponentId, oDomClickedElement */) {
            window.alert("boo");
        },
        getControlDiv: function () {
            return $(document.getElementById(this.getId()));
        },

        /**
         * Gets the container into which the chart is rendered.
         * XXX Only really used in tests
         */
        getChartContainer: function () {
            return this.getControlDiv().children().first();
        },

        setEmptyBackground: function () {
            renderChart(this, {
                "type": "info/column",
                "data": cannedData.flatData(),
                "bindings": cannedData.bindings(),
                "template": "empty_ghost"
            });
        },

        setData: function (data) {
            // Clone the data so that setProperty is using a different reference for the old data
            var newData = data ? $.extend(true, {}, data) : null;
            try {
                // Needed to change the empty string to null as it throws a validation error otherwise
                this.setProperty("data", newData);
                if (!this.oControlProperties.DATA_SOURCE_ALIAS_REF) {
                    throw new InfoChartException("control.nodatasource");
                } else if (!data) {
                    throw new InfoChartException("mapper.nodata");
                }
            } catch (e) {
                this._errorHandler.setError(e);
            }
        },

        setCvombinding:  stringToJsonSetter("cvombinding"),

        setCvomdata: stringToJsonSetter("cvomdata"),

        setChartconfig: stringToJsonSetter("chartconfig"),

        setPlotAreaMeasureShapes: stringToJsonSetter("plotAreaMeasureShapes"),

        setEnrichData: stringToJsonSetter("enrichData"),

        setChartSelection: function (value) {
            if (value === "CLEAR") {
                this._vizframe.selection(value);
            } else if (value !== "") {
                this._chartSelection = JSON.parse(value);
            }
        },

        setCHARTTYPE: function(value){
            var chartId =  infoIDUtils.convertEnumToId(value);
            this.setProperty("CHARTTYPE", chartId);
        },

        // FIXME hack for hana
        setCharttype: function(value) {
            this.setCHARTTYPE(value);
        },
        
        setShowScaling: function(value) {
        	this.setProperty("showScaling", value);
        },

        /*
         * called via selectDeselect to get the data selected
         * see info_vizframe.js - selectDeselect() for more info
         * this._vizframe.selection() :
         *   [{"data":{"marital_status":"M","marital_status.d":"M","education":"Partial High School","education.d":"Partial High School","negative":-37558.18}},
         *    {"data":{"marital_status":"S","marital_status.d":"S","education":"Graduate Degree","education.d":"Graduate Degree","negative":-7585.96}},
         *    {"data":{"marital_status":"M","marital_status.d":"M","education":"Graduate Degree","education.d":"Graduate Degree","negative":-7427.88}}]
         * returns :
         *    {"(MEASURES_DIMENSION)":["negative"],"marital_status":["M","S"],"education":["Partial High School","Graduate Degree"]}
         */
        getDataSelected: function () {
            var dataSelection = new function () { // FIXME strange use of new
                var dataSelection = {};

                this.addSelection = function (dimensionKey, memberKey) {
                    dataSelection[dimensionKey] = _.union(dataSelection[dimensionKey] || [], [memberKey]);
                };

                this.getSelections = function () {
                    return dataSelection;
                };

            }();

            if (this._vizframe) {
                var selectionArray = this._vizframe.selection();
                var that = this;

                _.forEach(selectionArray, function (selection) {
                    // get dimensions in the selection
                    var dimensionsObj = _.omit(selection.data, function (value, key, obj) {
                        return !(obj.hasOwnProperty(key + ".d"));
                    });
                    var dimensions = _.pairs(dimensionsObj);

                    // add each dimensions to the dataSelection
                    _.forEach(dimensions, function (dim) {
                        var dimKey = dim[0];
                        var dimSelection = dim[1];
                        dataSelection.addSelection(dimKey, dimSelection);
                    });

                    // get the single measure
                    var measureObj = _.omit(selection.data, function (value, key, obj) {
                        if (obj.hasOwnProperty(key + ".d")) {
                            return true;
                        }
                        return key.slice(-2) === ".d";
                    });

                    var measure = _.pairs(measureObj);
                    var measureKey = measure[0][0]; // only ever one measure zero index in the key
                    var resultSet = that.getData();
                    var measuresDimensionKey = that._infoDataMapper.getMeasuresDimensionKey(resultSet.dimensions, resultSet.externalDimensions);
                    dataSelection.addSelection(measuresDimensionKey, measureKey);
                });
            }
            return JSON.stringify(dataSelection.getSelections());
        },

        /*
         * called via selectDeselect to get the chart selection
         * see info_vizframe.js - selectDeselect() for more info
         */
        getChartSelection: function () {
            return this._vizframe && this._vizframe.selection();
        },

    	/**
    	 * Export the current chart as SVG String
    	 * @param {Object} [options] {width: Number, height: Number}
    	 *
    	 * example usage,
    	 * 		var svgOptions = {};
    	 *      svgOptions.height = 500;
    	 *      svgOptions.width = 300;

    	 *		// get the chart JS object
    	 * 	    var chartCtrl = chartContainer.data("chartCtrl");
    	 * 		// cal export with the options
    	 * 	    var svgString = this._vizframe._vizframe.__internal_reference_VizFrame__._viz._vizInstance.app.exportToSVGString(options);
    	 **/
    	exportToSVGString : function (options) {

            var frame = this._vizframe._vizframe;
    		var oldSize = frame.size();
    		frame.size({auto: false, height: options.height, width: options.width});
            //TODO: Replace the call for the svgString
    		var svgString = this._vizframe._vizframe.__internal_reference_VizFrame__._viz._vizInstance.app.exportToSVGString(options);
            frame.size(oldSize);
    	    return svgString;
    	},

        getDataSourceName: function() {
            return this.oControlProperties.DATA_SOURCE_ALIAS_REF;
        }

    });

    /*
     * Creates a function that will set a property
     * with the given name on this (chart).
     * Setting takes a string that's parsed to json.
     */
    function stringToJsonSetter(name) {
        return function (value) {
            try {
                if (value) {
                    value = value.replace(/\\x/gi, "\\u00");
                }
                var json = value && JSON.parse(value);
                this.setProperty(name, json || {});
            } catch (err) {
                this._errorHandler.renderError(err);
            }
        };
    }

    function handleListenerAttached(chart, e) {
        var params = e.mParameters || {},
            type = params.type,
            eventId = params.EventId;
        infoChartLocale.onLoad(function () {
            if (type === "listenerAttached" && eventId === INFO_CHART_UPDATE_EVENT_ID) {
                try{
                    // Fire an initial update event for new listeners
                    chart.fireEvent(INFO_CHART_UPDATE_EVENT_ID, getChartMetadata(chart));
                } catch (err) {
                    chart._errorHandler.renderError(err);
                }
            }
        });
    }

    function updateChart(chart) {
        //We use this to avoid rerendering for a maximized infochart which is in a container
        var $controlDiv = chart.getControlDiv();
        var w = $controlDiv.width();
        var h = $controlDiv.height();

        $controlDiv.contextmenu(function(e){
            e.preventDefault(); // hide the default right click context menu
        });

        if ((w * h) === 0) {
            setTimeout(function () {
                updateChart(chart);
            }, 1);
            return;
        }
        //End of special case which avoids rerendering
        try {
            var metadata = getChartMetadata(chart);
            renderChart(chart, metadata);
            chart.fireEvent(INFO_CHART_UPDATE_EVENT_ID, metadata);
            chart._infoBindingService.validateBindings(metadata.type, metadata.bindings);
        } catch (e) {
            chart._errorHandler.renderError(e);
        }
    }

    function renderChart(chart, metadata) {
        try {
            var $parent = chart.getChartContainer();
            if (chart._vizframe) {
                chart._vizframe.destroy();
            }
            if (chart.oControlProperties.chartconfig)
                chart.oControlProperties.chartconfig = chart.oControlProperties.chartconfig.replace(/\\x/gi, "\\u00");

            $parent.empty(); // XXX Is this needed?
            chart._vizframe = new Vizframe();
            chart._vizframe.create($parent, metadata, chart);
            $parent.data("chartCtrl", chart);

        } catch (e) {
            chart._errorHandler.renderError(e);
        }
    }

    function getChartMetadata(chart) {
        // XXX: Is the name of this property likely to change.
        // TODO Add in unit test that will fail if the name changes.

        if (!chart.oControlProperties.DATA_SOURCE_ALIAS_REF) {
            throw new InfoChartException("control.nodatasource");
        }

        var type = chart.getCHARTTYPE();
        if (!sap.viz.api.metadata.Viz.get(type)) {
            throw new InfoChartException("control.invalidChartType");
        }

        var properties = (chart.getChartconfig() && chart.getChartconfig().properties) || {};
        var removeTotals = !chart.getShowTotals();
        var mappedData;
        var sdkData;
        var flatData;
        var bindingObj = {"binding": [], chartType: type};
        if (chart.oControlProperties.cvombinding && _.isString(chart.oControlProperties.cvombinding)) {
            bindingObj = JSON.parse(chart.oControlProperties.cvombinding);
            if (_.isArray(bindingObj)) {
                //Temporary check for array, so that people with old style binding set will know they
                // need to change their application
                throw new InfoChartException();
            }
        }

        if (chart.getCvomdata() && !_.isEmpty(chart.getCvomdata())) {
            mappedData = new sap.viz.api.data.FlatTableDataset(chart.getCvomdata());
        } else {
            sdkData = new SdkData(chart.getData());
            if (chart.oControlProperties.useLegacyBindings) {
                bindingObj.binding = chart._legacyBindingService.createBindings(type, chart.getData());
                // Remove unused dimensions from the data. This is required for pie charts
                sdkData.keepDimensions(_.flatten(_.pluck(bindingObj.binding, "source")));
                flatData = sdkData.toFlatData(removeTotals);
            } else {
                flatData = sdkData.toFlatData(removeTotals);
            }
            var propertyBuilder = new InfoPropertyBuilder(properties, type);
            if(HichertDataFactory.isNeeded(type) && chart.getEnrichData() && chart.getEnrichData().hichert_chart) {
            	flatData = HichertDataFactory.transformData(flatData, chart.getEnrichData().hichert_chart, chart);
            } else if(WaterfallDataFactory.isNeeded(type) && chart.getEnrichData() && chart.getEnrichData().info_waterfall) {
                flatData = WaterfallDataFactory.transformData(flatData, chart.getEnrichData().info_waterfall, chart);
            }
            if(chart.oControlProperties.showScaling) {
            	propertyBuilder.applyScalingFactor(sdkData, flatData);
            }
            if(chart.getUseLegacyBindings()) {
                bindingObj.binding = chart._legacyBindingService.createBindings(type, chart.getData());
            } else {
                bindingObj.binding = chart._infoBindingService.suggestBindings(type, flatData.metadata, bindingObj.binding, bindingObj.chartType);
            }
            
            //In the case of time series charts, we need to change the metadata bound to the timeAxis to have a "Date" datatype"
            mappedData = chart._infoDataMapper.map(flatData, removeTotals);
            if (chart.getEnableConditionalFormatting()) {
                propertyBuilder.setPropertyValue("plotArea.dataPointStyle",
                    chart._conditionalFormatMapper.createDataPointStyle(sdkData)
                );
            }

            propertyBuilder
                .setDefaultColorPalette()
                .mapFormatStrings(sdkData.getSDKFormatStrings());

            properties = propertyBuilder.getProperties();
           
            if (chart.oControlProperties.plotAreaMeasureShapes){
                var pams = JSON.parse(chart.oControlProperties.plotAreaMeasureShapes);
                var shapeProperties = chart._dataSeriesHelper.getProperties(pams, type, bindingObj.binding);
                if (shapeProperties[0].length !== 0){
                    properties.plotArea = properties.plotArea || {};
                    properties.plotArea.dataShape = properties.plotArea.dataShape || {};
                    properties.plotArea.dataShape.primaryAxis = shapeProperties[0];
                }
                if (shapeProperties[1].length !== 0){
                    properties.plotArea = properties.plotArea || {};
                    properties.plotArea.dataShape = properties.plotArea.dataShape || {};
                    properties.plotArea.dataShape.secondaryAxis = shapeProperties[1];
                }
            }
        }
        return {
            "type": type,
            "data": mappedData,
            "bindings": bindingObj.binding,
            "selection": chart._chartSelection,
            "properties": properties
        };
    }

    // XXX It might be nicer if sap.ui.core.Control.extend returned the constructor
    return com.sap.ip.bi.InfoChart;
});
