sap.ui.jsview("vbm-regression.tests.58.view.App", {

    getControllerName: function () {
        return "vbm-regression.tests.58.controller.App";
    },

    createContent: function (oController) {

        sap.ui.getCore().loadLibrary("sap.ui.layout");
        sap.ui.getCore().loadLibrary("sap.ui.vbm");

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
                                    text: "1. Check that the grey countries are inactive. They do not react on hover, except pointer and tooltip, and can not be selected. They only raise click events."
                                }),
                                new sap.m.Text({
                                    text: "2. Check that the colored countries are active. They react on hover and can be selected via click gestures."
                                }),
                                new sap.m.Text({
                                    text: "3. Click on a colored country and then click on a grey country and check that the colored country is deselected."
                                }),
                                new sap.m.Text({
                                    text: "4. Check that if any colored country is selected all other countries get a lighter color."
                                }),
                                new sap.m.Text({
                                    text: "5. Click on a colored country and check that the selected country gets a dark grey border around it (as opposed to white border)."
                                }),
                                new sap.m.Text({
                                    text: "6. There are click and contextMenu events assigned to the map, regions, and legend entries. Click on the different areas and check that you receive a Message Toast."
                                }),
                                new sap.m.Text({
                                    text: "7. Click Zoom Regions and check that the map zooms in on the regions."
                                }),
                                new sap.m.Button({
                                    text: "Zoom Regions",
                                    press: [oController.onZoomRegions, oController]
                                }),
                                new sap.m.Text({
                                    text: "8. Click on button Change Model and check that the color for country Italy changes from orange to red. Also, Spain and Portugal become inactive countries."
                                }), 
                                new sap.m.Button({
                                    text: "Change Model",
                                    press: [oController.onChangeModel, oController]
                                }),
                                new sap.m.Text({
                                    text: "9. Click Remove all Regions and check that all regions are removed from the map."
                                }), 
                                new sap.m.Button({
                                    text: "Remove all Regions",
                                    press: [oController.onPressRemoveRegions, oController]
                                })
                            ]
                        })
                    ]
                }),
                new sap.ui.vbm.AnalyticMap("jsviewtest_analyticMap", {
                    width: "100%",
                    height: "100%",
                    layoutData: new sap.m.FlexItemData({
                        baseSize: "60%"
                    }),
                    regions: {
                        path: "/data/regionProperties",
                        template: new sap.ui.vbm.Region({
                            code: "{code}",
                            color: '{color}',
                            tooltip: '{tooltip}',
                            click: [oController.onRegionClick, oController],
                            contextMenu: [oController.onRegionContextMenu, oController]
                        })
                    },
    
                    legend: new sap.ui.vbm.Legend({
                        caption: "Analytic Legend",
                        click: [oController.onLegendClick, oController],
                        items: {
                            path: "/data/regionProperties",
                            template: new sap.ui.vbm.LegendItem({
                                text: "{region}",
                                color: '{color}',
                                click: [oController.onLegendItemClick, oController],
                                tooltip: '{tooltip}'
                            })
                        }
                    }),
    
                    regionClick: [oController.onRegionClick, oController],
                    regionContextMenu: [oController.onRegionContextMenu, oController],
                    click: [oController.onMapClick, oController],
                    contextMenu: [oController.onMapContextMenu, oController]
                })
            ]
        });

        return fb;
    }
});