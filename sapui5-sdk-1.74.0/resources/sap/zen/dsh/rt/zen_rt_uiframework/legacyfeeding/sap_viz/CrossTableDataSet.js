/*global define */
/*jshint strict:false */
define('_TypeUtils_copy', [],
    function Setup() {
        var class2type = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regexp',
            '[object Object]': 'object'
        };

        var type = function(obj) {
            return !obj ? String(obj) : class2type[Object.prototype.toString.call(obj)] || "object";
        };

        /**
         * Type Utilities for common variable type related tasks
         * 
         * @name sap.viz.base.utils.TypeUtils
         * @class
         */
        var typeUtils = {

            /**
             * Returns a boolean value indicating whether the parameter is of type
             * function
             * 
             * @param {object}
             * @returns {boolean}
             */
            // See test/unit/core.js for details concerning isFunction.
            // Since version 1.3, DOM methods and functions like alert
            // aren't supported. They return false on IE (#2968).
            isFunction: function(obj) {
                return type(obj) === "function";
            },

            /**
             * Returns a boolean value indicating whether the parameter is of type
             * array
             * 
             * @param {object}
             * @returns {boolean}
             */
            isArray: Array.isArray || function(obj) {
                return type(obj) === "array";
            },

            /**
             * Returns a boolean value indicating whether the parameter is undefined or null
             *
             * @param {object}
             * @returns {boolean}
             */
            isExist: function(o) {
                if ((typeof(o) === 'undefined') || (o === null)) {
                    return false;
                }
                return true;
            }
        };

        return typeUtils;
    });
define('_FunctionUtils_copy', ['_TypeUtils_copy'],
    function Setup(TypeUtils) {
        var ArraySlice = Array.prototype.slice;

        function createCallChain() {
            var callChain = [];

            function ChainedFunc() {
                for (var i = 0, len = callChain.length; i < len; i++) {
                    callChain[i].apply(this, arguments);
                }
            }

            function buildChain() {
                for (var i = 0, len = arguments.length; i < len; i++) {
                    if (TypeUtils.isFunction(arguments[i])) {
                        callChain.push(arguments[i]);
                    } else {
                        throw new Error('Could not create call chain for non-function object');
                    }
                }
            }
            ChainedFunc.chain = function() {
                return createCallChain.apply(null, [].concat(callChain, ArraySlice.call(arguments)));
            };
            buildChain.apply(null, arguments);
            return ChainedFunc;
        }

        var funcUtils = {
            createCallChain: createCallChain
        };

        return funcUtils;
    });

define('_ObjectUtils_copy', [],
    function Setup() {

        return {

            clone: function(obj) {
                if (typeof(obj) !== 'object')
                    return obj;
                if (obj === null)
                    return obj;
                var o = obj.constructor === Array ? [] : {};
                for (var i in obj) {
                    o[i] = typeof obj[i] === "object" ? arguments.callee.call(null, obj[i]) : obj[i];
                }
                return o;
            }
        };
    });

define('_Class_copy', ['_FunctionUtils_copy'],
    function Setup(FuncUtils) {
        // inspired by http://ejohn.org/blog/simple-javascript-inheritance/
        var fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;
        var callChain = FuncUtils.createCallChain;

        function zeroClass() {}

        function extend(ext) {
            var _super = zeroClass.prototype = this.prototype;
            var subclass = this.chain ? this.chain(ext.constructor) : callChain(this, ext.constructor);
            var proto = subclass.prototype = new zeroClass();
            proto.constructor = subclass;
            delete ext.constructor;
            var fn;
            for (var f in ext) {
                fn = ext[f];
                proto[f] = typeof fn === 'function' && typeof _super[f] === 'function' && fnTest.test(fn) ? (function(name,
                    func) {
                    return function() {
                        this._super = _super[name];
                        var ret = func.apply(this, arguments);
                        return ret;
                    };
                })(f, fn) : fn;
            }
            subclass.extend = extend;
            return subclass;
        }

        /**
         * Define a class, make it extensible. The parameter could be an existing
         * constructor or a Class config object.
         * 
         * <pre>
         * {
         *    constructor : function(){...},
         *    method1   : function(){...},
         *    method2   : function(){...},
         *    ...
         *    methodn   : function(){...}
         * }
         * </pre>
         * 
         * @param {Function|Object}
         *            clazz constructor or an Class config object
         * @returns {Function} the class
         */
        function define(clazz) {
            if (typeof clazz === 'function') {
                clazz.extend = extend;
                return clazz;
            } else {
                var constructor = clazz.constructor || function() {},
                    proto = constructor.prototype;
                for (var f in clazz) {
                    if (clazz.hasOwnProperty(f)) {
                        proto[f] = clazz[f];
                    }
                }
                constructor.extend = extend;
                return constructor;
            }
        }
        return {
            define: define,
            extend: extend
        };
    });
define('_DataContainer_copy', ['_Class_copy'],
    function Setup(Class) {
        var DataContainer = Class.define({
            constructor: function(uid) {
                this._uId = uid;
                this._isFake = false;
                this._infos = null;
            },
            getId: function() {
                return this._uId;
            },
            fake: function(_) {
                if (!arguments.length) {
                    return this._isFake;
                }
                this._isFake = _;
            },
            infos: function(_) {
                if (!arguments.length) {
                    return this._infos;
                }
                this._infos = _;
            }
        });
        return DataContainer;
    });

define('_MeasureValues_copy', ['_DataContainer_copy'],
    function Setup(DataContainer) {

        /**
         * @private
         * @name sap.viz.data.description.MeasureValues
         */
        var MeasureValues = DataContainer.extend({

            /** 
             * @constructor
             * @param uid    identifier of measure values, usually name
             * @param values 
             */
            constructor: function(uid, values) {
                this._values = values;
            },

            getValues: function() {
                return this._values;
            }

        });



        return MeasureValues;
    });

define('_MeasureValuesGroup_copy', ['_MeasureValues_copy'],
    function Setup(MeasureValues) {

        var MeasureValuesGroup = function(data) {
            this._measureValues = [];
            this.init(data);
        };

        MeasureValuesGroup.prototype.init = function(data) {

            for (var i = 0; i < data.length; i++) {
                this._measureValues[i] = new MeasureValues(data[i]["name"], data[i]["values"]);
                this._measureValues[i].fake(data[i]["isFake"] ? data[i]["isFake"] : false);
                this._measureValues[i].infos(data[i]["infos"] ? data[i]["infos"] : null);
            }
        };

        MeasureValuesGroup.prototype.getMeasureValues = function() {
            return this._measureValues;
        };

        MeasureValuesGroup.prototype.getType = function() {
            return "measureValuesGroup";
        };

        MeasureValuesGroup.prototype.validate = function(labels) {

            var measures, value, i, j;
            if (!arguments.length) {
                var label = [1, 1];
                measures = this.getMeasureValues();
                for (i = 0; i < measures.length; i++) {
                    value = measures[i].getValues();
                    if (i === 0) {
                        if (value.length !== label[1]) {
                            jQuery.sap.log.error("MeasureValues error");
                        }

                        label[0] = value[0].length;

                    } else {
                        if (value.length !== label[1]) {
                            jQuery.sap.log.error("MeasureValues error");
                        }

                        for (j = 0; j < value.length; j++) {
                            if (value[j].length !== label[0]) {
                                jQuery.sap.log.error("MeasureValues error");
                            }
                        }
                    }

                }

                return label;

            } else {
                measures = this.getMeasureValues();
                for (i = 0; i < measures.length; i++) {
                    value = measures[i].getValues();
                    if (value.length !== labels[1]) {
                        jQuery.sap.log.error("MeasureValues error");
                    }

                    for (j = 0; j < value.length; j++) {
                        if (value[j].length !== labels[0]) {
                            jQuery.sap.log.error("MeasureValues error");
                        }
                    }
                }
            }

        };

        MeasureValuesGroup.prototype.hasFakeData = function() {
            var measures = this.getMeasureValues();
            for (var i = 0; i < measures.length; i++) {
                if (measures[i].fake()) {
                    return true;
                }
            }

            return false;
        };

        return MeasureValuesGroup;
    });

define('_DimensionLabels_copy', [
    '_ObjectUtils_copy',
    '_DataContainer_copy'],
    
    function Setup(ObjUtils, DataContainer) {


        var DimensionLabels = DataContainer.extend({

            /**
             * @name sap.viz.data.description.DimensionLabels
             * @param   uid    identifier of dimension labels, usually name 
             */

            constructor: function(uid, type, values) {
                this._type = type;
                this._values = values;
            },

            getValues: function() {
                return this._values;
            },

            getType: function() {
                return this._type;
            }

        });


        return DimensionLabels;
    });

define('_AnalysisAxis_copy', [
    '_DimensionLabels_copy',
    '_FunctionUtils_copy',
    '_TypeUtils_copy'],
    function Setup(DimensionLabels, FunctionUtils, TypeUtils) {

        var AnalysisAxis = function(data) {
            this._dimensionLabels = [];
            this.init(data);

        };

        AnalysisAxis.prototype.init = function(data) {

            for (var i = 0; i < data.length; i++) {
                this._dimensionLabels[i] = new DimensionLabels(data[i]["name"], data[i]["type"] ? data[i]["type"] : "Dimension",
                    data[i]["values"]);

                this._dimensionLabels[i].fake(data[i]["isFake"] ? data[i]["isFake"] : false);
                this._dimensionLabels[i].infos(data[i]["infos"] ? data[i]["infos"] : null);
            }
        };

        AnalysisAxis.prototype.getDimensionLabels = function() {
            return this._dimensionLabels;
        };

        AnalysisAxis.prototype.getType = function() {
            return "analysisAxis";
        };

        AnalysisAxis.prototype.validate = function() {

            var labels = 1;
            var dimensions = this.getDimensionLabels();
            if (dimensions.length === 0) {
                FunctionUtils.error(langManager.getLogMessage('IDS_ERROR_DIMENSION_NOT_ZERO'));
            }
            for (var i = 0; i < dimensions.length; i++) {
                if (i === 0) {
                    labels = dimensions[i].getValues().length;
                    if (TypeUtils.isExist(dimensions[i].infos()) && labels !== dimensions[i].infos().length) {
                        FunctionUtils.error('IDS_ERROR_DIMENSION_WRONG_COUNT');
                    }
                } else {
                    if (labels !== dimensions[i].getValues().length) {
                        FunctionUtils.error('IDS_ERROR_DIMENSION_WRONG_LABELS_COUNT');
                    }

                    if (TypeUtils.isExist(dimensions[i].infos()) && labels !== dimensions[i].infos().length) {
                        FunctionUtils.error('IDS_ERROR_DIMENSION_WRONG_COUNT');
                    }
                }
            }

            return labels;

        };

        AnalysisAxis.prototype.hasFakeData = function() {
            var dimensions = this.getDimensionLabels();
            for (var i = 0; i < dimensions.length; i++) {
                if (dimensions[i].fake()) {
                    return true;
                }
            }

            return false;
        };

        return AnalysisAxis;
    });

define('zen.rt.uiframework/legacyfeeding/sap_viz/CrossTableDataSet', [
    '_TypeUtils_copy',
    '_ObjectUtils_copy',
    '_AnalysisAxis_copy',
    '_MeasureValuesGroup_copy'],
    function Setup(TypeUtils, ObjectUtils, AnalysisAxis, MeasureValuesGroup) {

        "use strict";

        var ANALYSISAXIS = "analysisAxis";
        var MEASUREVALUESGROUP = "measureValuesGroup";

        /**
         * @name sap.viz.data.CrosstableDataset
         * @constructor
         */
        function crossTableDataSet() {
            this._analysisAxis = [];
            this._measureValuesGroup = [];
            this._dataSet = {};
            this._measures = [];
            this._dimensions = [];
            this._emptyDataset = false;
            this._infos = {};
        }

        /**
         * Get/set data
         * @deprecated This function is working in CVOM 4.0, but will not be supported since CVOM 5.0 in the future, please consider to use new version of this API instead. You can use sap.viz.api.data.CrosstableDataset.data  instead.
         * @name sap.viz.data.CrosstableDataset#data
         * @param data
         *        data with metaData and rawData
         * @returns {Object} {@link sap.viz.data.CrosstableDataset}
         */
         // XXX: Not sure this makes a difference to generating bindings
        crossTableDataSet.prototype.data = function(data) {
            if (!arguments.length) {
                var dataRe = ObjectUtils.clone(this._dataSet);
                if (this._emptyDataset) {
                    this.cleanDataset(dataRe);
                }
                return dataRe;
            }
            this._analysisAxis = [];
            this._measureValuesGroup = [];
            this._measures = [];
            this._dimensions = [];
            this._dataSet = ObjectUtils.clone(data);
            this.init(this._dataSet);
            this._measures = this.getMetaNames(data, MEASUREVALUESGROUP);
            this._dimensions = this.getMetaNames(data, ANALYSISAXIS);
            this._infos = {};
            return this;
        };

        //@deprecated
        crossTableDataSet.prototype.setData = function(in_data) {
            this.data(in_data);
        };
        /**
         * Get all dimension/ measure names from data
         * @ignore
         * @param data : data with metaData and rawData
         * @param range : ANALYSISAXIS/ MEASUREVALUESGROUP
         * @returns {[Object]}: array of names of all dimesions/ measures
         *            Object : {name:  "<dimension_name>"/  "<measure_name>", index: <number>, location: <number>}
         */
         // XXX: Not sure this makes a difference to generating bindings
        crossTableDataSet.prototype.getMetaNames = function(data, range) {
            if (data == undefined) {
                return;
            }
            var ret = [];
            var range = data[range];
            if (range === undefined || !TypeUtils.isArray(range)) {
                return ret;
            }
            for (var i = 0; i < range.length; i++) {
                var rangeData = range[i].data;
                if (rangeData === undefined || !TypeUtils.isArray(rangeData)) {
                    continue;
                }
                for (var j = 0; j < rangeData.length; j++) {
                    if (rangeData[j].name !== undefined) {
                        var obj = {
                            'name': rangeData[j].name,
                            'index': i,
                            'location': j
                        };
                        ret.push(obj);
                    }
                }
            }
            return ret;
        };

        crossTableDataSet.prototype.init = function(data) {
            // removed check for measureValuesGroup for tree map doesn't have it
            if (!data || (!data[ANALYSISAXIS] && !data[MEASUREVALUESGROUP])) {
                //FIX ME Remove when multihandler is available
                return;
            }
            var aaLabels = [1, 1];
            var isEmptyDataset = false;
            replaceNullData(data);

            var axes = data[ANALYSISAXIS];
            var i = 0;
            var mvgs, mvg, mv;
            if (axes) {
                if (axes.length > 2) {
                    jQuery.sap.log.error("Crosstable error");
                }

                for (; i < axes.length; i++) {
                    var axis = axes[i];
                    var axisIndex = axis["index"];
                    if (axisIndex !== 1 && axisIndex !== 2) {
                        jQuery.sap.log.error("Crosstable error");
                    }

                    if (this._analysisAxis[axisIndex - 1]) {
                        jQuery.sap.log.error("Crosstable error");
                    }

                    var aa = new AnalysisAxis(axis["data"]);
                    aaLabels[axisIndex - 1] = aa.validate();
                    this._analysisAxis[axisIndex - 1] = aa;

                }

                //TODO handle if only meta data exist in data set when layout
                if (aaLabels[0] === 0) {
                    aaLabels[1] = 0;
                    isEmptyDataset = true;
                }

                mvgs = data[MEASUREVALUESGROUP];
                // to handle tree chart without measurevaluegroup, but not know what chart is going to be filled, should we give a warning for the empty measurevaluegroup?
                if (mvgs) {
                    for (i = 0; i < mvgs.length; i++) {
                        mvg = mvgs[i];
                        var mvgIndex = mvg["index"];
                        if (this._measureValuesGroup[mvgIndex - 1]) {
                            jQuery.sap.log.error("Crosstable error");
                        }

                        mv = new MeasureValuesGroup(mvg["data"]);
                        mv.validate(aaLabels);
                        this._measureValuesGroup[mvgIndex - 1] = mv;
                    }
                }
            } else { // no axes case

                mvgs = data[MEASUREVALUESGROUP];
                for (i = 0; i < mvgs.length; i++) {
                    mvg = mvgs[i];
                    mv = new MeasureValuesGroup(mvg["data"]);
                    if (i === 0) {
                        aaLabels = mv.validate();
                    } else {
                        mv.validate(aaLabels);
                    }

                    this._measureValuesGroup[mvg["index"] - 1] = mv;
                }
            }

            this._emptyDataset = isEmptyDataset;
        };

        var replaceNullValues = function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].values == null) {
                    data[i].values = [];
                }
            }
        };

        var replaceNullData = function(data) {
            if (data[ANALYSISAXIS]) {
                var aa = data[ANALYSISAXIS];
                for (var i = 0; i < aa.length; i++) {
                    replaceNullValues(aa[i].data);
                }
            }
            if (data[MEASUREVALUESGROUP]) {
                var mg = data[MEASUREVALUESGROUP];
                for (var i = 0; i < mg.length; i++) {
                    replaceNullValues(mg[i].data);
                }
            }
        };

        return crossTableDataSet;

    });
