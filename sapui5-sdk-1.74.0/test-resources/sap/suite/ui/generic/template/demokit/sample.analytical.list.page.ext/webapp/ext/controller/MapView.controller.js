sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (Controller, AnalyticMap, JSONModel, Device) {
    "use strict";

    AnalyticMap.GeoJSONURL = "test-resources/sap/ui/vbm/demokit/media/analyticmap/L0.json";
    
    return Controller.extend("analytics4.ext.controller.MapView", {
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData(
                {
                    "regionProperties":
                        [
                            { "code": "EU", "legend": "Europe", "color": "rgba(184,225,245,1.0)", "tooltip": "Europe\r\n\r\nPopulation: 743 Mio" },
                            { "code": "NA", "legend": "North America", "color": "rgba(5,71,102,1.0)" },
                            { "code": "AS", "legend": "Asia", "color": "rgba(92,186,229,1.0)" }
                        ],
                    "Spots":
                        [
                            {
                                "pos": "10.3878024;52.2721095;0",
                                "tooltip": "Brunswick",
                                "type": "Error",
                                "text": "1"
                            },
                            {
                                "pos": "15.9850859;42.836823;0",
                                "tooltip": "Salzwedel",
                                "type": "Warning",
                                "text": "2"
                            },
                            {
                                "pos": "18.9584137;100.436009;0",
                                "tooltip": "City",
                                "type": "Success",
                                "text": "3"
                            },
                            {
                                "pos": "9.9849707;59.197504;0",
                                "tooltip": "Bad Kissingen",
                                "type": "Warning",
                                "text": "4"
                            },
                            {
                                "pos": "71.8763396;147.8065275;0",
                                "tooltip": "Freiburg",
                                "type": "Success",
                                "text": "5"
                            },
                            {
                                "pos": "110.7213569;80.3583142;0",
                                "tooltip": "Augsburg",
                                "type": "Success",
                                "text": "6"
                            },
                            {
                                "pos": "135.4727587;52.3904482;0",
                                "tooltip": "Berlin",
                                "type": "Success",
                                "text": "7"
                            },
                            {
                                "pos": "60.6476437;23.5582447;0",
                                "tooltip": "Hamburg",
                                "type": "Success",
                                "text": "8"
                            },
                            {
                                "pos": "69.8272389;50.9571612;0",
                                "tooltip": "Cologne",
                                "type": "Success",
                                "text": "9"
                            },
                            {
                                "pos": "8.4964808;50.1211277;0",
                                "tooltip": "Frankfurt",
                                "type": "Success",
                                "text": "10"
                            },
                            {
                                "pos": "77.9309475;49.436902;0",
                                "tooltip": "Nuremberg",
                                "type": "Success",
                                "text": "11"
                            },
                            {
                                "pos": "888.6983929;21.7275856;0",
                                "tooltip": "Paderborn",
                                "type": "Success",
                                "text": "12"
                            },
                            {
                                "pos": "71.5259484;38.5763289;0",
                                "tooltip": "Dingolfing",
                                "type": "Success",
                                "text": "13"
                            },
                            {
                                "pos": "121.1349801;51.4653922;0",
                                "tooltip": "Wiedemar",
                                "type": "Warning",
                                "text": "14"
                            },
                            {
                                "pos": "60.7639177;52.7744347;0",
                                "tooltip": "Neuekrug",
                                "type": "Inactive",
                                "text": "15"

                            },
                            {
                                "pos": "12.7639177;52.7744347;0",
                                "tooltip": "Moscow",
                                "type": "Inactive",
                                "text": "16"

                            },
                            {
                                "pos": "12.2535521;111.341699;0",
                                "tooltip": "Leipzig",
                                "type": "Success",
                                "text": "17"
                            },
                            {
                                "pos": "10.2194803;84.2122799;0",
                                "tooltip": "Ulm",
                                "type": "Success",
                                "text": "18"
                            },
                            {
                                "pos": "9.7380929;48.4609245;0",
                                "tooltip": "Berghülen",
                                "type": "Success",
                                "text": "19"
                            },
                            {
                                "pos": "-49.6219459;48.4841496;0",
                                "tooltip": "Laichingen",
                                "type": "Warning",
                                "text": "20"
                            },
                            {
                                "pos": "-59.6061491;48.3670617;0",
                                "tooltip": "Mehrstetten",
                                "type": "Inactive",
                                "text": "21"

                            },
                            {
                                "pos": "9.4603999;48.6702116;0",
                                "tooltip": "Stuttgart",
                                "type": "Inactive",
                                "text": "22"

                            },
                            {
                                "pos": "91.3463604;48.4849778;0",
                                "tooltip": "Bad Urach",
                                "type": "Success",
                                "text": "23"
                            },
                            {
                                "pos": "111.5159342;50.9224921;0",
                                "tooltip": "Jena",
                                "type": "Success",
                                "text": "24"
                            },
                            {
                                "pos": "-31.0695032;53.1728268;0",
                                "tooltip": "Sömmerda",
                                "type": "Success",
                                "text": "25"
                            }

                            ,
                            {
                                "pos": "14.3255409;50.0595854;0",
                                "tooltip": "Prague",
                                "type": "Success",
                                "text": "100"
                            },
                            {
                                "pos": "12.7942748;50.2168744;0",
                                "tooltip": "Karlovy Vary",
                                "type": "Success",
                                "text": "25"
                            },
                            {
                                "pos": "113.8196207;40.4378698;0",
                                "tooltip": "Madrid",
                                "type": "Warning",
                                "text": "25"
                            },
                            {
                                "pos": "-4.8195048;37.8915808;0",
                                "tooltip": "Cordoba",
                                "type": "Warning",
                                "text": "25"
                            },
                            {
                                "pos": "-2.4456029;36.8354709;0",
                                "tooltip": "Almeria",
                                "type": "Warning",
                                "text": "25"
                            },
                            {
                                "pos": "100.9300003;41.6516859;0",
                                "tooltip": "Zaragoza",
                                "type": "Warning",
                                "text": "25"
                            },
                            {
                                "pos": "37.622882;55.755202;0",
                                "tooltip": "Moscow",
                                "type": "Inactive",
                                "text": "A"

                            },
                            {
                                "pos": "77.1024902;28.7040592;0",
                                "tooltip": "Delhi",
                                "type": "Success",
                                "text": "B"
                            },
                            {
                                "pos": "-74.013327;40.705395;0",
                                "tooltip": "New York",
                                "type": "Error",
                                "text": "C"
                            },
                            {
                                "pos": "116.407072;39.906235;0",
                                "tooltip": "Beijing",
                                "type": "Warning",
                                "text": "D"
                            },
                            {
                                "pos": "18.641622;49.293696;0",
                                "tooltip": "Tip",
                                "type": "Warning",
                                "text": "E"
                            },
                            {
                                "pos": "8.641622;49.293696;0",
                                "tooltip": "Tip",
                                "type": "Warning",
                                "text": "F"
                            },
                            {
                                "pos": "34.49447,86.052329;0",
                                "tooltip": "China",
                                "type": "Warning",
                                "text": "G"
                            }

                            //Poland/@51.8335126,14.6480188
                            ,
                            {
                                "pos": "14.6480188;51.8335126;0",
                                "tooltip": "Poland",
                                "type": "Error",
                                "text": "H"
                            },
                            {
                                "pos": "57.9293326,47.6540759;0",
                                "tooltip": "Kazakhstan",
                                "type": "Warning",
                                "text": "I"
                            },
                            {
                                "pos": "86.052329,34.49447;0",
                                "tooltip": "J",
                                "type": "Success",
                                "text": "J"
                            },
                            {
                                "pos": "34.49447,86.052329;0",
                                "tooltip": "K",
                                "type": "Warning",
                                "text": "K"
                            },
                            {
                                "pos": "34.49447,86.052329;0",
                                "tooltip": "L",
                                "type": "Warning",
                                "text": "L"
                            },
                            {
                                "pos": "34.49447,86.052329;0",
                                "tooltip": "M",
                                "type": "Warning",
                                "text": "M"
                            },
                            {
                                "pos": "34.49447,86.052329;0",
                                "tooltip": "N",
                                "type": "Warning",
                                "text": "N"
                            },
                            {
                                "pos": "64.49447,46.052329;0",
                                "tooltip": "O",
                                "type": "Inactive",
                                "text": "O"
                            },
                            {
                                "pos": "44.49447,44.052329;0",
                                "tooltip": "P",
                                "type": "Warning",
                                "text": "P"
                            },
                            {
                                "pos": "32.49447,90.052329;0",
                                "tooltip": "Q",
                                "type": "Warning",
                                "text": "Q"
                            },
                            {
                                "pos": "24.49447,51.052329;0",
                                "tooltip": "R",
                                "type": "Warning",
                                "text": "R"
                            },
                            {
                                "pos": "14.49447,16.052329;0",
                                "tooltip": "S",
                                "type": "Warning",
                                "text": "S"
                            },
                            {
                                "pos": "18.49447,39.052329;0",
                                "tooltip": "T",
                                "type": "Success",
                                "text": "T"
                            },
                            {
                                "pos": "49.49447,66.052329;0",
                                "tooltip": "U",
                                "type": "Success",
                                "text": "U"
                            },
                            {
                                "pos": "52.49447,60.052329;0",
                                "tooltip": "V",
                                "type": "Warning",
                                "text": "V"
                            },
                            {
                                "pos": "44.49447,86.052329;0",
                                "tooltip": "China",
                                "type": "Warning",
                                "text": "G"
                            },
                            {
                                "pos": "34.49447,-56.052329;0",
                                "tooltip": "China",
                                "type": "Warning",
                                "text": "G"
                            },
                            {
                                "pos": "34.49447,86.052329;0",
                                "tooltip": "China",
                                "type": "Warning",
                                "text": "G"
                            },
                            {
                                "pos": "-34.49447,86.052329;0",
                                "tooltip": "China",
                                "type": "Warning",
                                "text": "G"
                            },
                            {
                                "pos": "84.49447,76.052329;0",
                                "tooltip": "X",
                                "type": "Warning",
                                "text": "X"
                            },
                            {
                                "pos": "41.49447,-68.052329;0",
                                "tooltip": "Y",
                                "type": "Success",
                                "text": "Y"
                            },
                            {
                                "pos": "-24.49447,-76.052329;0",
                                "tooltip": "Z",
                                "type": "Warning",
                                "text": "Z"
                            }
                        ]
                });

            this.getView().setModel(oModel);

            // set the device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.getView().setModel(oDeviceModel, "device");

        },

        onPressLegend: function () {
            if (this.byId("vbi").getLegendVisible() == true) {
                this.byId("vbi").setLegendVisible(false);
                this.byId("btnLegend").setTooltip("Show legend");
            } else {
                this.byId("vbi").setLegendVisible(true);
                this.byId("btnLegend").setTooltip("Hide legend");
            }
        },

        onPressResize: function () {
            if (this.byId("btnResize").getTooltip() == "Minimize") {
                if (sap.ui.Device.system.phone) {
                    this.byId("vbi").minimize(132, 56, 1320, 560);// Height: 3,5 rem; Width: 8,25 rem
                } else {
                    this.byId("vbi").minimize(168, 72, 1680, 720);// Height: 4,5 rem; Width: 10,5 rem
                }
                this.byId("btnResize").setTooltip("Maximize");
            } else {
                this.byId("vbi").maximize();
                this.byId("btnResize").setTooltip("Minimize");
            }
        },

        onRegionClick: function (e) {
            sap.m.MessageToast.show("onRegionClick " + e.getParameter("code"));
        },

        onRegionContextMenu: function (e) {
            sap.m.MessageToast.show("onRegionContextMenu " + e.getParameter("code"));
        },

        onClickItem: function (evt) {
            //alert("onClick");
        },

        onContextMenuItem: function (evt) {
            //alert("onContextMenu");
        },

        onClickSpot: function (evt) {
            //alert("onClickSpot " + evt.getSource().getBindingContext().getProperty("tooltip"));
        },

        onContextMenuSpot: function (evt) {
            //alert("onContextMenuSpot " + evt.getSource().getBindingContext().getProperty("tooltip"));
        },
        onAfterRendering: function (evt) {
        }
    });
}, true);