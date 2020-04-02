sap.ui.define(function() {
    "use strict";

    var InteractionCustomization = sap.viz.extapi.core.BaseCustomInteraction.extend();
    var ic = sap.viz.extapi.customization.constants;

    InteractionCustomization.id = "com.sap.viz.custom.interaction";
    InteractionCustomization.metadata = {
        propertyDefinition: {
            'custom.infoColumn.interaction': {
                defaultValue: null
            },
            'selectedPropertyZone': {
                defaultValue: null
            }
        },
        eventDefinition: []
    };

    InteractionCustomization.triggers = [
    {
        id: "custom.click.chart",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.CHART_BACKGROUND
        ],
        excludeTargets: [
            ic.CustomInteractionTargets.DATAPOINT,
            ic.CustomInteractionTargets.DATALABEL,
            ic.CustomInteractionTargets.LEGEND,
            ic.CustomInteractionTargets.LEGEND_ITEM,
            ic.CustomInteractionTargets.PLOT,
            ic.CustomInteractionTargets.CHART_TITLE,
            ic.CustomInteractionTargets.AXIS_TITLE,
            ic.CustomInteractionTargets.AXIS_LABEL_ITEM,
            ic.CustomInteractionTargets.VALUE_AXIS
        ],
        preventDefault: true
    }, {
        id: "custom.click.datapoint",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.DATAPOINT,
            ic.CustomInteractionTargets.DATALABEL,
            ic.CustomInteractionTargets.LEGEND_ITEM
        ],
        preventDefault: true
    }, {
        id: "custom.click.legendGroup",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.LEGEND
        ],
        excludeTargets: [
            ic.CustomInteractionTargets.LEGEND_ITEM
        ],
        preventDefault: true
    }, {
        id: "custom.click.plot",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.PLOT
        ],
        excludeTargets: [
            ic.CustomInteractionTargets.DATAPOINT,
            ic.CustomInteractionTargets.DATALABEL
        ],
        preventDefault: true
    }, {
        id: "custom.click.chartTitle",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.CHART_TITLE
        ],
        preventDefault: true
    }, {
        id: "custom.click.axisTitle",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.AXIS_TITLE
        ],
        preventDefault: true
    }, {
        id: "custom.click.categoryLabel",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.AXIS_LABEL_ITEM
        ],
        preventDefault: true
    }, {
        id: "custom.click.valueAxis",
        event: "click",
        targets: [
            ic.CustomInteractionTargets.VALUE_AXIS
        ],
        excludeTargets: [
            ic.CustomInteractionTargets.AXIS_TITLE
        ],
        preventDefault: true
    }, {
        id: "custom.afterChartRendered",
        event: "afterChartRendered",
        targets: [],
        excludeTargets: []
    }, {
        id: "custom.plotScroll",
        event: "plotScroll",
        targets: [],
        excludeTargets: []
    }];

    var actionHandlers = {
        "custom.afterChartRendered": function (id, event, vizModelInfo, vizRenderInfo) {
            if ( this._interactionLayer ) {
                this._interactionLayer.remove();
            }
            this._interactionLayer = _prepareSVGContainer(this.container(), this.vizInstanceInfo());

            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.plotScroll": function (id, event, vizModelInfo, vizRenderInfo) {
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.axisTitle": function (id, event, vizModelInfo, vizRenderInfo) {
            var typeValue = event.data.targets.name;
            if (!typeValue){
                typeValue = 'axisTitle';
            }
            this.selected = {
                type: typeValue
            };
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.legendGroup": function (id, event, vizModelInfo, vizRenderInfo) {
            this.selected = {
                type: "legendGroup"
            };
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.chart": function (id, event, vizModelInfo, vizRenderInfo) {
            this.selected = {
                type: "chart"
            };
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.plot": function (id, event, vizModelInfo, vizRenderInfo) {
            this.selected = {
                type: "plot"
            };
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.valueAxis": function (id, event, vizModelInfo, vizRenderInfo) {
            this.selected = {
                type: "valueAxis"
            };
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.chartTitle": function (id, event, vizModelInfo, vizRenderInfo) {
            this.selected = {
                type: "chartTitle"
            };
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.categoryLabel": function (id, event, vizModelInfo, vizRenderInfo) {
            this.selected = {
                type: "categoryLabel",
                cellsIndex: [ event.data.targets.index ]
            };
            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        },
        "custom.click.datapoint": function (id, event, vizModelInfo, vizRenderInfo) {
            this.selected = {
                type: "dataPoint",
                data: [ event.data.targets.context ]
            };
            this.properties("selectedPropertyZone", this.selected);

            clearInteractionLayer(this._interactionLayer);
            highlight(this.selected, vizRenderInfo, this._interactionLayer);
        }
    };

    function clearInteractionLayer (layer) {
        var l = layer.querySelectorAll(".select-indicator");
        for (var i = 0, len = l.length; i < len; i++) {
            l[i].remove();
        }
    }

    function highlight(selected, vizRenderInfo, layer) {
        if (!selected) {
            return;
        }
        switch ( selected.type ) {
        case "dataPoint":
            var dataPointRenderInfos = [];
            var seriesDataPoints;
            var contents = selected.data;

            seriesDataPoints = vizRenderInfo.plot().dataPoints();
            seriesDataPoints.forEach(function (ls) {
                ls.forEach(function (renderInfo) {
                    if ( renderInfo && contents.some(function (context) {
                            var fields = Object.keys(context);
                            return fields.every(function (key) {
                                return renderInfo.context[key] === context[key];
                            });
                        }) ) {
                        dataPointRenderInfos.push(renderInfo);
                    }
                });
            });
            dataPointRenderInfos.forEach(function (renderInfo) {
                _appendInteractionNode(renderInfo, layer);
            });
            break;

        case "categoryLabel":
            var categoryAxis = vizRenderInfo.categoryAxis();
            if ( !categoryAxis.labels ) { // all labels are hidden
                return;
            }
            var labels = categoryAxis.labels();
            selected.cellsIndex.forEach(function (index) {
                var r = labels[ index[0] ];
                if (r) { // r maybe not exist because the category label is hidden while space is not enough
                    r = r[ index[1] ];
                }
                if (r) {
                    _appendInteractionNode(r, layer);
                }
            });
            break;

        case "chartTitle":
            _appendInteractionNode(vizRenderInfo.title(), layer);
            break;
        case "valueAxis.title":
            _appendInteractionNode(vizRenderInfo.valueAxis().title, layer);
            break;
        case "categoryAxis.title":
            _appendInteractionNode(vizRenderInfo.categoryAxis().title, layer);
            break;
        case "plot":
            _appendInteractionNode(vizRenderInfo.plot(), layer);
            break;
        case "legendGroup":
            _appendInteractionNode(vizRenderInfo.legend(), layer);
            break;
        case "valueAxis":
            _appendInteractionNode(vizRenderInfo.valueAxis(), layer);
            break;
        case "chart":
            _appendInteractionNode(vizRenderInfo.background(), layer);
            break;
        }
    }

    InteractionCustomization.prototype.handle = function(id, event, vizModelInfo, vizRenderInfo) {
        console.log('InteractionCustomization.prototype.handler: ' + id); //eslint-disable-line no-console

        window.vizModelInfo = vizModelInfo;
        window.vizRenderInfo = vizRenderInfo;
        window.vizInstanceInfo = this.vizInstanceInfo();

        var handler = actionHandlers[id];
        if (handler) {
            handler.call(this, id, event, vizModelInfo, vizRenderInfo);
        }
    };


    InteractionCustomization.prototype.exportToSVGString = function(option) {
        // console.log('InteractionCustomization.prototype.exportToSVGString');
        var node = this.container().childNodes[0];
        var svgString = new XMLSerializer().serializeToString(node);
        return svgString;
    };

    /*=============================================
    *   draw utils
    **/
    /**
    *   make sure SVG root node aleady appended in the interaction container
    *
    */
    var _prepareSVGContainer = function(container, vizInstanceInfo){
        var foundSVG = false;
        var child = container.childNodes;
        if (child && child.length > 0){
            var first = child[0];
            if (first && first.tagName.toUpperCase() === 'SVG'){
                foundSVG = true;
            }
        }
        if (!foundSVG){
            var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
            svg.setAttribute("width",vizInstanceInfo.size().width);
            svg.setAttribute("height",vizInstanceInfo.size().height);
            svg.style.pointerEvents = 'none';
            container.appendChild(svg);
        }
        return container.childNodes[0];
    };

    /**
    *   draw the rect to append to the container.
    *   @info {Object} render info
    */
    var _drawRect = function(info, container){
        if (!info || info.visible === false){
            return null;
        }
        var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute("class", "select-indicator");
        rect.setAttribute("x",info.x);
        rect.setAttribute("y",info.y);
        rect.setAttribute("width",info.width);
        rect.setAttribute("height",info.height);
        // rect.setAttribute("fill",'red');
        rect.style.stroke = 'red';
        rect.style.strokeWidth = '2px';
        rect.style.fill = 'transparent';

        var rotationX = info.x + info.width / 2; // info.rotation.x
        var rotationY = info.y + info.width / 2; // info.rotation.y
        // rotation
        if (info.rotation && info.rotation.r){
            var rotationStr = 'rotate(' + info.rotation.r + "," + rotationX + ',' + rotationY + ')';
            rect.setAttribute('transform', rotationStr);
        }
        container.appendChild(rect);
        return rect;
    };

    /**
    *   create and append node to interaction container
    */
    var _appendInteractionNode = function(renderInfos, layer){
        // Currently only handle the single object, 1D, 2D array
        // NOT include 3D array(trellis)
        if (Array.isArray(renderInfos)){// Array
            if (renderInfos && renderInfos.length > 0){
                if (Array.isArray(renderInfos[0])){ // 2D array
                    for (var row in renderInfos){
                        if (renderInfos.hasOwnProperty(row)){
                            var  rowRenderInfos = renderInfos[row];
                            for (var col in rowRenderInfos){
                                if (rowRenderInfos.hasOwnProperty(col)){
                                    _drawRect(rowRenderInfos[col], layer);
                                }
                            }
                        }
                    }
                } else { // 1D array
                    for (var i in renderInfos){
                        if (renderInfos.hasOwnProperty(i)){
                            _drawRect(renderInfos[i], layer);
                        }
                    }
                }
            }
        } else { // {Object} singel renderInfos
            _drawRect(renderInfos, layer);
        }
    };

    return InteractionCustomization;

});
