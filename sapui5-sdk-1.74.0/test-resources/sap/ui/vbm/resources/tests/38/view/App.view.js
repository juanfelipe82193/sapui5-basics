sap.ui.jsview("vbm-regression.tests.38.view.App", {

    getControllerName: function () {
        return "vbm-regression.tests.38.controller.App";
    },

    createContent: function (oController) {

        sap.ui.getCore().loadLibrary("sap.ui.layout");
        sap.ui.getCore().loadLibrary("sap.ui.vbm");
        sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");

        jQuery.sap.require("sap.ui.vbm.SemanticType");
        jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChart");
        jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChartData");

        var fb = new sap.m.FlexBox(this.createId("my-flex-box"), {
            direction: "Row",
            width: "100%",
            height: "100%",
            items: [
                new sap.m.Panel({
                    width: "100%",
                    content: [
                        new sap.ui.layout.VerticalLayout({
                            width: "100%",
                            content: [
                                new sap.m.Label({
                                    text: "The aim: ",
                                    design: "Bold"
                                }),
                                new sap.m.Label({
                                    text: "To test the Visual Business GeoMap Control"
                                }),
                                new sap.m.Label({
                                    text: "To test: ",
                                    design: "Bold",
                                    class: "voffset-25"
                                }),
                                new sap.m.Text({
                                    text: "1. Check that the map loads and you can see various visual objects."
                                }),
                                new sap.m.Text({
                                    text: "2. Click 'Remove a chart(change model data) and check that a chart is removed by changing model data. Charts are removed one by one."
                                }),
                                new sap.m.Button({
                                    text: "Remove a chart (change model data)",
                                    press: [oController.onPressRemoveChartChangeModel, oController]
                                }),
                                new sap.m.Text({
                                    text: "3. Click on Remove charts (remove VO) and check that all charts are removed from the map."
                                }),
                                new sap.m.Button({
                                    text: "Remove charts (remove VO)",
                                    press: [oController.onPressRemoveChartVO, oController]
                                }),
                                new sap.m.Text({
                                    text: "4. Click on Remove spots (remove VO) and check that spots with keys 1, 2 and 3 are removed from the map."
                                }),
                                new sap.m.Button({
                                    text: "Remove spots (remove VO)",
                                    press: [oController.onPressRemoveSpotVO, oController]
                                }),
                                new sap.m.Text({
                                    text: "5. Click on Add spots (add VO) and check that 6 new spots are added to the map."
                                }),
                                new sap.m.Button({
                                    text: "Add spots (add VO)",
                                    press: [oController.onPressAddSpotVO, oController]
                                }),
                                new sap.m.Text({
                                    text: "6. Click on Hide Legend and verify that the legend is not visible any more."
                                }),
                                new sap.m.Button({
                                    id: this.createId("btnHide"),
                                    text: "Hide Legend",
                                    press: [oController.onLegendVisible, oController]
                                }),
                                new sap.m.Text({
                                    text: "7. Click on Destroy Legend and then click on Show Legend to verify that the legend does not appear back."
                                }),
                                new sap.m.Button({
                                    text: "Destroy Legend",
                                    press: [oController.onDestroyLegend, oController]
                                }),
                                new sap.m.Text({
                                    text: "Note: Destroying the legend without hiding it first, does not make it invisible but it does destroy it internally from the Geomap. This is a known problem."
                                })
                            ]
                        })
                    ]
                }),
                new sap.ui.vbm.GeoMap("jsviewtest_geoMap", {
                    width: "100%",
                    height: "100%",
                    mapConfiguration: GLOBAL_MAP_CONFIG,
                    layoutData: new sap.m.FlexItemData({
                        baseSize: "60%"
                    }),
                    legend: new sap.ui.vbm.Legend({
                        caption: "Geomap Legend",
                        items: {
                            path: "/legendItems",
                            template: new sap.ui.vbm.LegendItem({
                                text: "{text}",
                                color: '{color}'
                            })
                        }
                    }),
                    resources: [
                        new sap.ui.vbm.Resource({
                            name: "smiley",
                            src: "media/images/smiley.png"
                        })
                    ],
                    vos: [
                        new sap.ui.vbm.Containers("containers", {
                            items: {
                                path: "/Containers",
                                template: new sap.ui.vbm.Container({
                                    position: '{pos}',
                                    tooltip: '{tooltip}',
                                    item: new sap.suite.ui.microchart.ColumnMicroChart({
                                        size: "S",
                                        columns: {
                                            path: "ChartCols",
                                            template: new sap.suite.ui.microchart.ColumnMicroChartData({
                                                value: '{value}',
                                                color: '{color}'
                                            }),
                                            templateShareable: true
                                        },
                                        rightTopLabel: new sap.suite.ui.microchart.ColumnMicroChartLabel({
                                            label: '{i18n>/Label1}'
                                        })
                                    }).addStyleClass("chart-bg")
                                })
                            }
                        }),
                        new sap.ui.vbm.Spots("spots", {
                            items: {
                                path: "/Spots",
                                template: new sap.ui.vbm.Spot({
                                    text: '{key}',
                                    position: '{pos}',
                                    tooltip: '{tooltip}',
                                    type: '{type}',
                                    labelText: '{labeltext}'
                                })
                            }
                        }),
                        new sap.ui.vbm.Spots({
                            items: {
                                path: "/OtherSpots",
                                template: new sap.ui.vbm.Spot({
                                    type: sap.ui.vbm.SemanticType.Default,
                                    position: '{pos}',
                                    tooltip: '{tooltip}',
                                    labelText: '{labeltext}'
                                })
                            }
                        }),
                        new sap.ui.vbm.Circles({
                            items: {
                                path: "/Circles",
                                template: new sap.ui.vbm.Circle({
                                    position: '{pos}',
                                    tooltip: '{tooltip}',
                                    color: 'RGB(0,0,120)',
                                    colorBorder: 'RGB(0,0,255)'
                                })
                            }
                        }),
                        // single instance
                        new sap.ui.vbm.GeoCircles({
                            items: [
                                new sap.ui.vbm.GeoCircle({
                                    radius: "1000000",
                                    slices: "40",
                                    position: '-10;0;0',
                                    tooltip: 'This is a GeoCircle',
                                    color: 'RGB(100,0,120)',
                                    colorBorder: 'RGB(0,0,255)'
                                })
                            ]
                        }),
                        // single instance item
                        new sap.ui.vbm.Routes({
                            // explicitly specify 
                            items: [
                                new sap.ui.vbm.Route({
                                    position: '-30;0;0;-30;-20;0;0;-20;0',
                                    tooltip: 'This is a Route',
                                    end: "1",
                                    start: "0",
                                    color: 'RGB(0,10,255)'
                                })
                            ]
                        }),
                        // single instance item
                        new sap.ui.vbm.Areas({
                            items: [
                                new sap.ui.vbm.Area({
                                    position: '-30;50;0;-30;30;0;0;30;0',
                                    tooltip: 'This is an Area',
                                    color: 'RGB(0,10,255)'
                                })
                            ]
                        }),
                        // single instance item
                        new sap.ui.vbm.Boxes({
                            items: [
                                new sap.ui.vbm.Box({
                                    scale: '0.1;0.1;0.1',
                                    position: '-40;50;0',
                                    tooltip: 'This is a Box',
                                    color: 'RGB(0,255,0)'
                                })
                            ]
                        }),

                        new sap.ui.vbm.Spots({
                            items: [
                                new sap.ui.vbm.Spot({
                                    image: 'smiley',
                                    text: '',
                                    position: '-60;0;0',
                                    tooltip: '{i18n>/Label1}',
                                    labelText: 'Hello Smiley'
                                })
                            ]
                        }),


                        // single instance item
                        new sap.ui.vbm.Pies({
                            items: [
                                new sap.ui.vbm.Pie({
                                    scale: '1;1;1',
                                    position: '-40;-50;0',
                                    tooltip: 'This is a Pie',
                                    items: {
                                        path: "/PieSeries",
                                        template: new sap.ui.vbm.PieItem({
                                            value: '{value}',
                                            tooltip: '{tooltip}'
                                        })
                                    }
                                })
                            ]
                        })
                    ]
                })
            ]
        });

        return fb;
    }
});