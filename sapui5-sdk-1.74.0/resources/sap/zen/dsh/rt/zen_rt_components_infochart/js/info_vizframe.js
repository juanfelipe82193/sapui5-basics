/* global sap, define, $,_ */

define('zen.rt.components.infochart/js/info_vizframe', [], function() {

    'use strict';

    function VizFrame() {}

    VizFrame.prototype.create = function(contain, metadata, info_ctrl) {
        this._oldData = {};
        this.info_ctrl = info_ctrl;
        try {

            this._vizframe = new sap.viz.vizframe.VizFrame({
                type: metadata.type,
                data: metadata.data,
                container: contain,
                bindings: metadata.bindings,
                properties: metadata.properties,
                template: metadata.template

            }, {
                controls: {
                    morpher: {
                        enabled: false
                    }
                }
            });

            contain.on('mousedown', function(e) {
                e.stopPropagation();
            }).on('touchstart', function(e) {
                e.stopPropagation();
            }).on('touchend', function(e) {
                e.stopPropagation();
            });

            var that = this;
            this._metadata = metadata;
            this._doSelectActions = true;

            if (this._metadata.selection) {
                this.selection(this._metadata.selection);
            }

            this._vizframe.on('selectData', function() {
                that.selectDeselect();
            });
            this._vizframe.on('deselectData', function() {
                that.selectDeselect();
            });

            this._vizframe.on('contextualData', function(e) {
                if (e.type === 'legend') { // do nothing if the legend is selected
                    return;
                }
                var chartId = that.info_ctrl.sId;
                var target = chartId.substring(0, chartId.lastIndexOf('_'));
                var characterInfo = that.getCharacteristic(e.data, e.type);

                var commandArgs = [
                    ['BI_COMMAND_TYPE', 'CREATE_CONTEXT_MENU', 0],
                    ['ID', 'CONTEXT_MENU', 0],
                    ['DOM_REF_ID', chartId, 0],
                    ['TARGET_ITEM_REF', target, 0],
                    ['CHARACTERISTIC_NAME', characterInfo.name, 0],
                    ['CHARACTERISTIC_MEMBER_NAME', characterInfo.memberName, 0]
                ];

                var sContextMenuCommand = sap.zen.request.zenSendCommandArrayWoEventWZenPVT(commandArgs);
                var fAction = new Function(sContextMenuCommand);
                fAction();
            });
        } catch (e) {
            //do nothing
        }
    };

    VizFrame.prototype.getCharacteristic = function(data, type) {
        var chartInfo = {
            name: '',
            memberName: '' // this is currently never set, it will be in the future
        };

        if ((data.length !== 0) && (type === 'axisLabel')) {
            var selectedDom = $('.v-axis-item').find('.v-hovershadow').parent();
            if (!selectedDom || !selectedDom.attr('class')) {
                return chartInfo;
            }
            var feedingIndex = selectedDom.attr('class').slice(-1);
            var memberText = selectedDom.text();

            // get the 'categoryAxis' binding to map back
            var allBindings = this._metadata.bindings;
            var categoryAxisBinding = _.findWhere(allBindings, {
                feed: 'categoryAxis'
            });

            if (categoryAxisBinding && _.isArray(categoryAxisBinding.source)) {
                var index = (categoryAxisBinding.source.length - 1) - feedingIndex;
                var dimName = categoryAxisBinding.source[index];
                chartInfo.name = dimName;

                //using this dim name get the key
                var dimData = _.find(data, function(selection) {
                    return selection.data[dimName + '.d'] === memberText;
                });
                if (!dimData) {
                    return chartInfo;
                }
                if (dimData.data[dimName].indexOf('HIERARCHY_NODE/') === 0) {
                    chartInfo.memberName = dimData.data[dimName];
                } else {
                    chartInfo.memberName = 'MEMBER/' + dimName + '/' + dimData.data[dimName];
                }
            }
        }

        return chartInfo;
    };
    /*
     * When the user changes selection on the chart we set values on the server and fire onSelect event
     * 1. chart selected - Selection blob from the vizframe used to re-select the chart values on load bookmarks 
     * 	 Got via : info_ctrl.getSelectedData() 
     *    stored in : chartSelection
     *    [{'data':{'0FISCPER3':'001','0FISCPER3.d':'1','0CALDAY':'20040118','0CALDAY.d':'18/01/2004','4KH5Y3XTF9HQVZ4SKI8FY1VJZ':349.53}}]
     *
     * 2. data selected - The dimension keys and values of the chart selection used in ztl to getMeasure & getMeasures
     *    Got via : info_ctrl.getChartSelection()
     *    Stored in : dataSelected
     *	 {'(MEASURES_DIMENSION)':['negative'],'marital_status':['M','S'],'education':['Partial High School','Graduate Degree']}
     */
    VizFrame.prototype.selectDeselect = function() {
        if (!this._doSelectActions) { // actions were turned off for this selection, just turn them on for the next
            this._doSelectActions = true;
            return;
        }
        var selections = this._vizframe.selection();

        if (!_.isEqual(this._oldData, selections)) {
            this.info_ctrl.fireDesignStudioPropertiesChangedAndEvent(['chartSelection', 'dataSelected'], 'onSelect');
            this._oldData = selections;
        }
    };

    VizFrame.prototype.update = function(metadata) {
        //if chart Type is changed call explicity
        this._vizframe.update({
            type: metadata.type,
            data: metadata.data,
            bindings: metadata.bindings,
            properties: metadata.properties
        });
        this._metadata = metadata;
    };

    VizFrame.prototype.destroy = function() {
        if (this._vizframe) {
            this._vizframe.destroy();
        }
    };
    VizFrame.prototype.selection = function(value) {
        if (value === undefined) {
            return this._vizframe && this._vizframe.selection();
        } else {
            this._doSelectActions = false; // turn off actions
            if (value === 'CLEAR') {
                this._vizframe.selection([], {
                    'clearSelection': true
                });
                this._oldData = {};
                this._doSelectActions = true;
            } else {
                var validSelection = this._vizframe.selection(value);
                if (!validSelection) {
                    this._doSelectActions = true;
                }
            }
        }
    };
    return VizFrame;
});
