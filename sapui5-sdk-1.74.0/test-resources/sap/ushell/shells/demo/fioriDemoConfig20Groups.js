// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains a sample Fiori sandbox application configuration.
 */

(function () {
    "use strict";
    /*global sap,jQuery, window */

    jQuery.sap.declare("sap.ushell.shells.demo.fioriDemoConfig");
    var sUshellTestRootPath = jQuery.sap.getResourcePath('sap/ushell').replace('resources', 'test-resources');
    sap.ushell.shells.demo.testContent = {
        //Define groups for the dashboard
        groups: [
            {
                id: "group_0",
                title: "KPIs",
                isPreset: true,
                isVisible: true,
                isDefaultGroup: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_001",
                        title: "I am a short title!",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a long long long long long long long long long long long long link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_002",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_999",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_882",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link2!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_6767",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_767",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_711",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_727",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_787",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_777",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },

                    {
                        id: "tile_003",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_00",
                        title: "Sales Performance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["sales", "performance"],
                        formFactor: "Desktop,Tablet,Phone",
                        serviceRefreshInterval: 10,
                        actions: [{
                            text: "Go To Sample App",
                            icon: "sap-icon://action",
                            targetURL: "#Action-toappnavsample"
                        }, {
                            text: "Go to stackoverflow",
                            icon: "sap-icon://action",
                            targetURL: "http://stackoverflow.com/"
                        }, {
                            text: "Illigal URL",
                            icon: "sap-icon://action",
                            targetURL: "stackoverflow.com/"
                        }, {
                            text: "Callback action",
                            icon: "sap-icon://action-settings",
                            press: function(oEvent) {
                                alert("in action");
                            }
                        }],
                        chipId: "catalogTile_33",
                        properties: {
                            title: "Sales Performance",
                            numberValue: 3.75,
                            info: 'Change to Last Month in %',
                            numberFactor: '%',
                            numberDigits: 2,
                            numberState: "Positive",
                            stateArrow: "Up",
                            icon: "sap-icon://Fiori2/F0002",
                            targetURL: "#Action-toappnavsample"
                                // uncomment to enable odata requests for the tile
                                //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        id: "tile_101",
                        title: "WEB GUI",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet,Phone",
                        chipId: "catalogTile_34",
                        properties: {
                            title: "WEB GUI",
                            subtitle: "Opens WEB GUI",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#Action-WEBGUI"
                        }
                    },
                    {
                        id: "tile_shelluiservicesample",
                        title: "ShellUIService Sample App",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Sample App for ShellUIService",
                            subtitle: "",
                            infoState: "Neutral",
                            info: "#Action-toappshelluiservicesample",
                            icon: "sap-icon://syringe",
                            targetURL: "#Action-toappshelluiservicesample"
                        }
                    },
                    {
                        id: "tile_01",
                        title: "US Profit Margin is at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_35",
                        properties : {
                            title: "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Action-toappnavsample"
                        }
                    },
                    {
                        id: "tile_02",
                        title: "Gross Revenue under Target at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "revenue", "target"],
                        formFactor: "Phone",
                        chipId: "catalogTile_36",
                        properties : {
                            title: "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState: "Negative",
                            numberFactor: "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL: "#Action-approvepurchaseorders"
                            //targetURL: "#Action-approvepurchaseorders?responderOn=true",
                            //targetURL: "/ushell/test-resources/sap/ushell/shells/sandbox/FioriSandbox.html#Action-approvepurchaseorders",
                            //targetURL: "http://localhost:8080/ushell/test-resources/sap/ushell/demoapps/ApprovePurchaseOrders/index.html"
                        }
                    },
                    {
                        id: "tile_03",
                        title: "Net Order Value is at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "order", "sales"],
                        formFactor: "Desktop,Tablet,Phone",
                        chipId: "catalogTile_37",
                        properties : {
                            title: "Net Order Value is at",
                            numberValue : 85.851,
                            info : 'Absolute Deviation',
                            numberFactor: "M",
                            numberUnit : 'EUR',
                            numberDigits : 2,
                            numberState : "Negative",
                            stateArrow : "Up",
                            targetURL: "#UI2Fiori2SampleApps-AppScflTest"
                        }
                    },
                    {
                        id: "tile_04",
                        title: "I am a short title!",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    }
                ]
            },
            {
                id: "LayoutTest",
                title: "LayoutTest",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_30",
                        title: "Long Tile 1",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Long Tile 1",
                            subtitle: "Long Tile 1",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_31",
                        title: "Long Tile 2",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Long Tile 2",
                            subtitle: "Long Tile 2",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_36",
                        title: "Source Control",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId: "catalogTile_43",
                        properties: {
                            title: "Source Control",
                            subtitle: "Opens Gerrit ",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
                        }
                    },
                    {
                        id: "tile_32",
                        title: "Regular Tile 1",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 1",
                            subtitle: "Regular Tile 1",
                            infoState: "Neutral",
                            icon: "sap-icon://car-rental",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_33",
                        title: "Regular Tile 2",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 2",
                            subtitle: "Regular Tile 2",
                            infoState: "Neutral",
                            icon: "sap-icon://camera",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_37",
                        title: "Source Control2",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId: "catalogTile_43",
                        properties: {
                            title: "Source Control2",
                            subtitle: "Opens Gerrit ",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
                        }
                    },
                    {
                        id: "tile_35",
                        title: "Regular Tile 5",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 5",
                            subtitle: "Regular Tile 5",
                            infoState: "Neutral",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_135",
                        title: "Regular Tile 6",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 6",
                            subtitle: "Regular Tile 6",
                            infoState: "Neutral",
                            targetURL: "http://www.heise.de"
                        }
                    }
                ]
            },
            {
                id: "group_2",
                title: "TestEmpty",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: []
            },
            {
                id: "group_3",
                title: "TestGroup1",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_10",
                        title: "I am a short title!",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_111",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_12",
                        title: "Financial Close Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        formFactor: "Tablet",
                        chipId : "catalogTile_10",
                        properties: {
                            title: "Financial Close Tasks",
                            subtitle: "Tasks Overview",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            info: "currently inactive",
                            infoState: "Critical",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_113",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_114",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_15",
                        title: "Wikipedia",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet",
                        chipId : "catalogTile_39",
                        properties: {
                            title: "Wikipedia",
                            subtitle: "Opens Wikipedia",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-wikipedia"
                        }
                    },
                    {
                        id: "tile_116",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet",
                        properties: {
                            //pId : "catalogTile_40",
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    }
                ]
            },
            {
                id: "group_4",
                title: "TestGroup2",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_10",
                        title: "I am a short title!",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_12",
                        title: "Financial Close Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        formFactor: "Tablet,Desktop",
                        chipId : "catalogTile_10",
                        properties: {
                            title: "Financial Close Tasks",
                            subtitle: "Tasks Overview",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            info: "currently inactive",
                            infoState: "Critical",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_16",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet,Desktop",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    }
                ]
            },
            {
                id: "group_1",
                title: "Employee Self Service",
                isPreset: true,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_10",
                        title: "I am a short title!",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_11",
                        title: "Just another long long long long long title",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        chipId : "catalogTile_41",
                        serviceRefreshInterval: 0,
                        properties : {
                            title: "Just another long long long long long title",
                            subtitle: "This shows a DynamicTile",
                            numberValue: 20,
                            numberState: "Positive",
                            numberUnit: "days",
                            stateArrow: "Down",
                            infoState: "Positive",
                            info: "running without any crashes",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                            // uncomment to enable odata requests for the tile
                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        id: "tile_12",
                        title: "Financial Close Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        chipId : "catalogTile_10",
                        properties: {
                            title: "Financial Close Tasks",
                            subtitle: "Tasks Overview",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            info: "currently inactive",
                            infoState: "Critical",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_13",
                        title: "User maintenance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_42",
                        properties: {
                            title: "User maintenance",
                            subtitle: "Opens WebGUI",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://employee",
                            targetURL: "#UI2Fiori2SampleApps-webdynpro"
                        }
                    },
                    {
                        id: "tile_14",
                        title: "I am a tile!",
                        size: "1x1",
                        chipId : "catalogTile_60",
                        properties: {
                        }
                    },
                    {
                        id: "tile_15",
                        title: "Source Control",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_43",
                        properties: {
                            title: "Source Control",
                            subtitle: "Opens Gerrit ",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
                        }
                    },
                    {
                        id: "tile_16",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_17",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_18",
                        title: "XSS Example",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_44",
                        properties: {
                            title: "<script>alert('Hi');</script>XSS",
                            subtitle: "Opens Fiori 1 App<script>alert('Hi');</script>",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://<script>alert('Hi');</script>",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_19",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_20",
                        title: "Just_another_long_long_long_long_long_title",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        chipId : "catalogTile_41",
                        properties : {
                            title: "Just_another_long_long_long_long_long_title",
                            subtitle: "This shows a DynamicTile with very long name",
                            numberValue: 20,
                            numberState: "Positive",
                            numberUnit: "days",
                            stateArrow: "Down",
                            infoState: "Positive",
                            info: "running without any crashes",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id : "tile_21",
                        title : "Sales Performance",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["sales", "performance"],
                        serviceRefreshInterval: 10,
                        stateNumber : "Positive",
                        chipId: "catalogTile_33",
                        properties : {
                            title : "Sales Performance",
                            numberValue : 3.75,
                            info : 'Change to Last Month in %',
                            numberFactor : '%',
                            numberDigits : 2,
                            stateArrow : "Up",
                            icon: "sap-icon://Fiori2/F0002",
                            targetURL: "#Action-todefaultapp"
                            // uncomment to enable odata requests for the tile
                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        id: "tile_102",
                        title: "Test component tile",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        moduleName: "sap.ushell.demo.demoTiles",
                        moduleType: "UIComponent",
                        namespace: "sap.ushell.demo.demoTiles",
                        path: sUshellTestRootPath + "/demoapps/demoTiles/",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Test component tile",
                            subtitle: "A tile wrapped in a component",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_103",
                        title: "Test view tile",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        moduleName: "sap.ushell.demo.demoTiles.TestViewTile",
                        moduleType: "JS",
                        namespace: "sap.ushell.demo.demoTiles",
                        path: sUshellTestRootPath + "/demoapps/demoTiles/",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Test view tile",
                            subtitle: "A tile wrapped in a view",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            targetURL: "#Action-todefaultapp"
                        }
                    }
                ]
            },
            {
                id: "group_hidden",
                title: "Hidden Group",
                isPreset: false,
                isVisible: false,
                tiles: []
            },
            {
                id: "group_locked_Empty",
                title: "Locked Empty Group",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId: "catalogTile_00",
                        title: "Bank Risk",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["risk", "neutral", "account"],
                        formFactor: "Tablet,Phone",
                        tags: ["Liquidity", "Financial"],
                        properties: {
                            title: "Bank Risk",
                            subtitle: "Rating A- and below",
                            infoState: "Neutral",
                            info: "Today",
//                        icon: "sap-icon://flight",
                            numberValue: 106.6,
                            numberDigits: 1,
                            numberState: "Neutral",
                            numberUnit: "M€",
                            targetURL: "#Action-toappnavsample"
                        }
                    }
                ]
            },
            {
                id: "group_locked_A",
                title: "Locked Group A",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    },
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }
                ]
            },
            {
                id: "group_locked_B",
                title: "Locked Group B",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    }
                ]
            },
            {
                id: "group_locked_C",
                title: "Locked Group C",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    },
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    }
                ]
            },
            {
                id: "group_0_1",
                title: "KPIs",
                isPreset: true,
                isVisible: true,
                isDefaultGroup: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_001",
                        title: "I am a short title!",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a long long long long long long long long long long long long link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_002",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_999",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_882",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link2!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_6767",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_767",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_711",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_727",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_787",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_777",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },

                    {
                        id: "tile_003",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_00",
                        title: "Sales Performance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["sales", "performance"],
                        formFactor: "Desktop,Tablet,Phone",
                        serviceRefreshInterval: 10,
                        actions: [{
                            text: "Go To Sample App",
                            icon: "sap-icon://action",
                            targetURL: "#Action-toappnavsample"
                        }, {
                            text: "Go to stackoverflow",
                            icon: "sap-icon://action",
                            targetURL: "http://stackoverflow.com/"
                        }, {
                            text: "Illigal URL",
                            icon: "sap-icon://action",
                            targetURL: "stackoverflow.com/"
                        }, {
                            text: "Callback action",
                            icon: "sap-icon://action-settings",
                            press: function(oEvent) {
                                alert("in action");
                            }
                        }],
                        chipId: "catalogTile_33",
                        properties: {
                            title: "Sales Performance",
                            numberValue: 3.75,
                            info: 'Change to Last Month in %',
                            numberFactor: '%',
                            numberDigits: 2,
                            numberState: "Positive",
                            stateArrow: "Up",
                            icon: "sap-icon://Fiori2/F0002",
                            targetURL: "#Action-toappnavsample"
                            // uncomment to enable odata requests for the tile
                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        id: "tile_101",
                        title: "WEB GUI",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet,Phone",
                        chipId: "catalogTile_34",
                        properties: {
                            title: "WEB GUI",
                            subtitle: "Opens WEB GUI",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#Action-WEBGUI"
                        }
                    },
                    {
                        id: "tile_shelluiservicesample",
                        title: "ShellUIService Sample App",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Sample App for ShellUIService",
                            subtitle: "",
                            infoState: "Neutral",
                            info: "#Action-toappshelluiservicesample",
                            icon: "sap-icon://syringe",
                            targetURL: "#Action-toappshelluiservicesample"
                        }
                    },
                    {
                        id: "tile_01",
                        title: "US Profit Margin is at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_35",
                        properties : {
                            title: "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Action-toappnavsample"
                        }
                    },
                    {
                        id: "tile_02",
                        title: "Gross Revenue under Target at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "revenue", "target"],
                        formFactor: "Phone",
                        chipId: "catalogTile_36",
                        properties : {
                            title: "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState: "Negative",
                            numberFactor: "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL: "#Action-approvepurchaseorders"
                            //targetURL: "#Action-approvepurchaseorders?responderOn=true",
                            //targetURL: "/ushell/test-resources/sap/ushell/shells/sandbox/FioriSandbox.html#Action-approvepurchaseorders",
                            //targetURL: "http://localhost:8080/ushell/test-resources/sap/ushell/demoapps/ApprovePurchaseOrders/index.html"
                        }
                    },
                    {
                        id: "tile_03",
                        title: "Net Order Value is at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "order", "sales"],
                        formFactor: "Desktop,Tablet,Phone",
                        chipId: "catalogTile_37",
                        properties : {
                            title: "Net Order Value is at",
                            numberValue : 85.851,
                            info : 'Absolute Deviation',
                            numberFactor: "M",
                            numberUnit : 'EUR',
                            numberDigits : 2,
                            numberState : "Negative",
                            stateArrow : "Up",
                            targetURL: "#UI2Fiori2SampleApps-AppScflTest"
                        }
                    },
                    {
                        id: "tile_04",
                        title: "I am a short title!",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    }
                ]
            },
            {
                id: "LayoutTest_1",
                title: "LayoutTest",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_30",
                        title: "Long Tile 1",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Long Tile 1",
                            subtitle: "Long Tile 1",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_31",
                        title: "Long Tile 2",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Long Tile 2",
                            subtitle: "Long Tile 2",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_36",
                        title: "Source Control",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId: "catalogTile_43",
                        properties: {
                            title: "Source Control",
                            subtitle: "Opens Gerrit ",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
                        }
                    },
                    {
                        id: "tile_32",
                        title: "Regular Tile 1",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 1",
                            subtitle: "Regular Tile 1",
                            infoState: "Neutral",
                            icon: "sap-icon://car-rental",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_33",
                        title: "Regular Tile 2",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 2",
                            subtitle: "Regular Tile 2",
                            infoState: "Neutral",
                            icon: "sap-icon://camera",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_37",
                        title: "Source Control2",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId: "catalogTile_43",
                        properties: {
                            title: "Source Control2",
                            subtitle: "Opens Gerrit ",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
                        }
                    },
                    {
                        id: "tile_35",
                        title: "Regular Tile 5",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 5",
                            subtitle: "Regular Tile 5",
                            infoState: "Neutral",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_135",
                        title: "Regular Tile 6",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 6",
                            subtitle: "Regular Tile 6",
                            infoState: "Neutral",
                            targetURL: "http://www.heise.de"
                        }
                    }
                ]
            },
            {
                id: "group_2_1",
                title: "TestEmpty",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: []
            },
            {
                id: "group_3_1",
                title: "TestGroup1",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_10",
                        title: "I am a short title!",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_111",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_12",
                        title: "Financial Close Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        formFactor: "Tablet",
                        chipId : "catalogTile_10",
                        properties: {
                            title: "Financial Close Tasks",
                            subtitle: "Tasks Overview",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            info: "currently inactive",
                            infoState: "Critical",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_113",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_114",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_15",
                        title: "Wikipedia",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet",
                        chipId : "catalogTile_39",
                        properties: {
                            title: "Wikipedia",
                            subtitle: "Opens Wikipedia",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-wikipedia"
                        }
                    },
                    {
                        id: "tile_116",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet",
                        properties: {
                            //pId : "catalogTile_40",
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    }
                ]
            },
            {
                id: "group_4_1",
                title: "TestGroup2",
                isPreset: false,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_10",
                        title: "I am a short title!",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_12",
                        title: "Financial Close Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        formFactor: "Tablet,Desktop",
                        chipId : "catalogTile_10",
                        properties: {
                            title: "Financial Close Tasks",
                            subtitle: "Tasks Overview",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            info: "currently inactive",
                            infoState: "Critical",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_16",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        formFactor: "Tablet,Desktop",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    }
                ]
            },
            {
                id: "group_1_1",
                title: "Employee Self Service",
                isPreset: true,
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                    {
                        id: "tile_10",
                        title: "I am a short title!",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_11",
                        title: "Just another long long long long long title",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        chipId : "catalogTile_41",
                        serviceRefreshInterval: 0,
                        properties : {
                            title: "Just another long long long long long title",
                            subtitle: "This shows a DynamicTile",
                            numberValue: 20,
                            numberState: "Positive",
                            numberUnit: "days",
                            stateArrow: "Down",
                            infoState: "Positive",
                            info: "running without any crashes",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                            // uncomment to enable odata requests for the tile
                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        id: "tile_12",
                        title: "Financial Close Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        chipId : "catalogTile_10",
                        properties: {
                            title: "Financial Close Tasks",
                            subtitle: "Tasks Overview",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            info: "currently inactive",
                            infoState: "Critical",
                            targetURL: "http://www.heise.de"
                        }
                    },
                    {
                        id: "tile_13",
                        title: "User maintenance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_42",
                        properties: {
                            title: "User maintenance",
                            subtitle: "Opens WebGUI",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://employee",
                            targetURL: "#UI2Fiori2SampleApps-webdynpro"
                        }
                    },
                    {
                        id: "tile_14",
                        title: "I am a tile!",
                        size: "1x1",
                        chipId : "catalogTile_60",
                        properties: {
                        }
                    },
                    {
                        id: "tile_15",
                        title: "Source Control",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_43",
                        properties: {
                            title: "Source Control",
                            subtitle: "Opens Gerrit ",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
                        }
                    },
                    {
                        id: "tile_16",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_17",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_18",
                        title: "XSS Example",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_44",
                        properties: {
                            title: "<script>alert('Hi');</script>XSS",
                            subtitle: "Opens Fiori 1 App<script>alert('Hi');</script>",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://<script>alert('Hi');</script>",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_19",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        chipId : "catalogTile_40",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        id: "tile_20",
                        title: "Just_another_long_long_long_long_long_title",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        chipId : "catalogTile_41",
                        properties : {
                            title: "Just_another_long_long_long_long_long_title",
                            subtitle: "This shows a DynamicTile with very long name",
                            numberValue: 20,
                            numberState: "Positive",
                            numberUnit: "days",
                            stateArrow: "Down",
                            infoState: "Positive",
                            info: "running without any crashes",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id : "tile_21",
                        title : "Sales Performance",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["sales", "performance"],
                        serviceRefreshInterval: 10,
                        stateNumber : "Positive",
                        chipId: "catalogTile_33",
                        properties : {
                            title : "Sales Performance",
                            numberValue : 3.75,
                            info : 'Change to Last Month in %',
                            numberFactor : '%',
                            numberDigits : 2,
                            stateArrow : "Up",
                            icon: "sap-icon://Fiori2/F0002",
                            targetURL: "#Action-todefaultapp"
                            // uncomment to enable odata requests for the tile
                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        id: "tile_102",
                        title: "Test component tile",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        moduleName: "sap.ushell.demo.demoTiles",
                        moduleType: "UIComponent",
                        namespace: "sap.ushell.demo.demoTiles",
                        path: sUshellTestRootPath + "/demoapps/demoTiles/",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Test component tile",
                            subtitle: "A tile wrapped in a component",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_103",
                        title: "Test view tile",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        moduleName: "sap.ushell.demo.demoTiles.TestViewTile",
                        moduleType: "JS",
                        namespace: "sap.ushell.demo.demoTiles",
                        path: sUshellTestRootPath + "/demoapps/demoTiles/",
                        formFactor: "Desktop,Tablet",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Test view tile",
                            subtitle: "A tile wrapped in a view",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            targetURL: "#Action-todefaultapp"
                        }
                    }
                ]
            },
            {
                id: "group_hidden_1",
                title: "Hidden Group",
                isPreset: false,
                isVisible: false,
                tiles: []
            },
            {
                id: "group_locked_Empty_1",
                title: "Locked Empty Group",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId: "catalogTile_00",
                        title: "Bank Risk",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["risk", "neutral", "account"],
                        formFactor: "Tablet,Phone",
                        tags: ["Liquidity", "Financial"],
                        properties: {
                            title: "Bank Risk",
                            subtitle: "Rating A- and below",
                            infoState: "Neutral",
                            info: "Today",
//                        icon: "sap-icon://flight",
                            numberValue: 106.6,
                            numberDigits: 1,
                            numberState: "Neutral",
                            numberUnit: "M€",
                            targetURL: "#Action-toappnavsample"
                        }
                    }
                ]
            },
            {
                id: "group_locked_A_1",
                title: "Locked Group A",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    },
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }
                ]
            },
            {
                id: "group_locked_B_1",
                title: "Locked Group B",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    }
                ]
            },
            {
                id: "group_locked_C_1",
                title: "Locked Group C",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    },
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "profit margin", "sales" ],
                        properties : {
                            title : "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState : "Positive",
                            numberFactor : '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        size : "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords : [ "profit", "revenue", "target" ],
                        properties : {
                            title : "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState : "Negative",
                            numberFactor : "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    }
                ]
            }
        ],
        catalogs: [
            {
                id: "test_catalog_01",
                title: "Personal",
                tiles: [{
                    id: "9a6eb46c-2d10-3a37-90d8-8f49f60cb111",
                    title: "My Paystubs",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_1",
                    properties: {
                        title: "travel-expense-report",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://travel-expense-report",
                        targetURL: ""
                    }
                }]
            }, {
                id: "catalog_0",
                title: "Cash Management",
                tiles: [
                    {
                        chipId: "catalogTile_00",
                        title: "Bank Risk",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["risk", "neutral", "account"],
                        formFactor: "Desktop,Tablet,Phone",
                        tags: ["Liquidity", "Financial"],
                        properties: {
                            title: "Bank Risk",
                            subtitle: "Rating A- and below",
                            infoState: "Neutral",
                            info: "Today",
//                            icon: "sap-icon://flight",
                            numberValue: 106.6,
                            numberDigits: 1,
                            numberState: "Neutral",
                            numberUnit: "M€",
                            targetURL: "#Action-toappnavsample"
                        }
                    },
                    {
                        chipId: "catalogTile_01",
                        title: "Bank Statement Import",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["risk", "import", "account"],
                        formFactor: "Desktop,Tablet,Phone",
                        tags: ["Financial", "Flow"],
                        properties : {
                            title: "Bank Statement Import",
                            subtitle: "Accounts completed import",
                            numberValue: 16.7,
                            numberState: "Neutral",
                            numberUnit: "%",
                            stateArrow: "Down",
                            infoState: "Neutral",
                            info: "Today",
                            targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders"
                        }
                    },
                    {
                        chipId: "catalogTile_02",
                        title: "Liquidity Forecast",
                        size: "1x1",
                        // note: will be KPI Line chart
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        keywords: ["forecast", "cash", "flow"],
                        formFactor: "Desktop,Tablet,Phone",
                        tags: ["Liquidity", "Flow"],
                        properties: {
                            title: "Liquidity Forecast",
                            subtitle: "Forecast for 30 days",
                            imageSource: "img/Gross_Revenue_Chart_wNumbers.png",
                            targetURL: "#Action-toappperssample"
                        }
                    },
                    {
                        chipId: "catalogTile_03",
                        title: "Liquidity Structure",
                        size: "1x1",
                        // note: will be KPI Comparison chart
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        keywords: ["liquidity"],
                        formFactor: "Desktop",
                        tags: ["Financial", "Risk"],
                        properties: {
                            title: "Liquidity Structure",
                            subtitle: "Structure of current account, deposit, and debt",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            targetURL: "#Action-toappnavsample2"
                        }
                    },
                    {
                        chipId: "catalogTile_04",
                        title: "Current Accounts Balance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["account", "banking", "balance"],
                        formFactor: "Desktop,Phone,Tablet",
                        properties: {
                            title: "Current Accounts Balance",
                            subtitle: "Cumulated Balance",
                            infoState: "Neutral",
                            info: "Yesterday",
                            numberValue: 18.46,
                            numberDigits: 2,
                            numberState: "Negative",
                            numberUnit: "M€",
                            targetURL: "#Action-toappnavsample"
                        }
                    },
                    {
                        chipId: "catalogTile_05",
                        title: "Current Accounts Balance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["meh", "account"],
                        formFactor: "Tablet,Phone",
                        properties: {
                            title: "Current Accounts Balance",
                            subtitle: "Cumulated balance",
                            info : "Today",
                            infoState: "Neutral",
                            numberValue : 689.5,
                            numberUnit : "M€",
                            numberDigits : 2,
                            numberState: "Positive",
                            targetURL: "#UI2Fiori2SampleApps-config"
                        }
                    },
                    {
                        chipId: "catalogTile_06",
                        title: "Deficit in Bank Accounts",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["account", "minus"],
                        formFactor: "Desktop,Tablet,Phone",
                        properties: {
                            title: "Deficit in Bank Accounts",
                            subtitle: "Cumulated Balance",
                            icon: "sap-icon://soccor",
                            infoState: "Neutral",
                            info: "Today",
                            numberValue: -314,
                            numberDigits: 0,
                            numberState: "Negative",
                            numberUnit: "M€",
                            targetURL: "#Action-toappperssample2"
                        }
                    },
                    {
                        chipId: "catalogTile_07",
                        title: "Surplus in Current Accounts",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["account", "plus"],
                        formFactor: "Tablet",
                        properties: {
                            title: "Surplus in Current Accounts",
                            subtitle: "Surplus",
                            infoState: "Neutral",
                            info: "Today",
                            numberValue: 921.4,
                            numberDigits: 1,
                            numberState: "Positive",
                            numberUnit: "M€",
                            targetURL: "#Action-todefaultapp"
                        }
                    }
                ]
            },

            {
                id: "catalog_1",
                title: "Financial Close",
                tiles: [
                    {
                        chipId: "catalogTile_10",
                        title: "Financial Close Tasks",
                        size: "1x1",
                        // note: will be KPI Comparison chart
                        tileType: "sap.ushell.ui.tile.ImageTile",
                        keywords: ["task"],
                        formFactor: "Tablet,Phone",
                        properties: {
                            title: "Financial Close Tasks",
                            subtitle: "Tasks Overview",
                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
                            icon: "sap-icon://task",
                            targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders"
                        }
                    },
                    {
                        chipId: "catalogTile_11",
                        title: "Erroneous Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["task"],
                        formFactor: "Tablet,Phone",
                        properties : {
                            title: "Erroneous Tasks",
                            subtitle: "Tasks completed with error",
                            numberValue: 3,
                            numberState: "Negative",
                            numberUnit: "",
                            stateArrow: "None",
                            infoState: "Negative",
                            info: "tasks are erroneous",
                            icon: "sap-icon://error",
                            targetURL: "#UI2Fiori2SampleApps-NavigationWithoutMasterDetailPattern"
                        }
                    },
                    {
                        chipId: "catalogTile_12",
                        title: "Delayed Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["task"],
                        formFactor: "Tablet,Phone",
                        properties : {
                            title: "Delayed Tasks",
                            subtitle: "",
                            numberValue: 9,
                            numberState: "Negative",
                            numberUnit: "",
                            stateArrow: "None",
                            infoState: "Negative",
                            info: "tasks with delay",
                            icon: "sap-icon://task",
                            targetURL: "#UI2Fiori2SampleApps-NavigationWithoutRoutes"
                        }
                    },
                    {
                        chipId: "catalogTile_12",
                        title: "Completed Tasks",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["task"],
                        formFactor: "Tablet,Phone",
                        properties : {
                            title: "Completed Tasks",
                            subtitle: "Tasks Due Today",
                            numberValue: 90,
                            numberState: "Positive",
                            numberFactor: "%",
                            stateArrow: "None",
                            infoState: "Positive",
                            info: "Completed Due Today",
                            icon: "sap-icon://task",
                            targetURL: "#UI2Fiori2SampleApps-navigationwithroutes"
                        }
                    }
                ]
            }, {
                id: "test_catalog_02",
                title: "Personal",
                tiles: [{
                    id: "9a6eb46c-2d10-3a37-90d8-8f49f60cb222",
                    title: "My Orders",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_2",
                    properties: {
                        title: "family-care",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://family-care",
                        targetURL: ""
                    }
                }]
            }, {
                id: "test_catalog_03",
                title: "Personal",
                tiles: [{
                    id: "9a6eb46c-2d10-3a37-90d8-8f49f60cb333",
                    title: "My Cars",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_3",
                    properties: {
                        title: "world",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://world",
                        targetURL: "#a-b"
                    }
                }]
            }, {
                id: "catalog_2",
                title: "Project Execution",
                tiles: [
                    {
                        chipId: "catalogTile_20",
                        title: "WBS Cost Variance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["variance"],
                        tags: ["Financial", "Risk"],
                        properties: {
                            title: "WBS Cost Variance",
                            subtitle: "Variance",
                            numberValue : 34,
                            info : "Today",
                            unit : "",
                            numberDigits : 0,
                            numberState: "Negative",
                            targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders"
                        }
                    },
                    {
                        chipId: "catalogTile_21",
                        title: "Due Activities",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["task"],
                        tags: ["Financial", "Risk"],
                        properties: {
                            title: "Due Activities",
                            subtitle: "Activities due today",
                            numberValue : 12,
                            info : 'Today',
                            unit : '',
                            decimalDigits : 0,
                            numberState: "Neutral",
                            targetURL: "#Action-toappperssample2"
                        }
                    },
                    {
                        chipId: "catalogTile_22",
                        title: "Purchase Orders",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["task"],
                        properties: {
                            title: "Purchase Orders",
                            subtitle: "Overdue Purchase Order Items",
                            numberValue : 97,
                            info : 'Today',
                            unit : '',
                            numberDigits : 0,
                            numberState: "Negative",
                            targetURL: "#Action-toappperssample"
                        }
                    },
                    {
                        chipId: "catalogTile_23",
                        title: "Missing Parts",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["parts"],
                        properties: {
                            title: "Missing Parts",
                            subtitle: "",
                            numberValue : 7,
                            info : "Today",
                            unit : "",
                            numberDigits : 0,
                            numberState: "Negative",
                            targetURL: "#Action-toappnavsample2"
                        }
                    }
                ]
            },
            {
                id: "catalog_3",
                title: "Employee Self Service",
                tiles: [
                    {
                        chipId: "catalogTile_30",
                        title: "Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        keywords: ["leave request", "request", "personal"],
                        properties: {
                            title: "Request Leave",
                            subtitle: "",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://create-leave-request",
                            targetURL: "#Action-toappnavsample"
                        }
                    },
                    {
                        chipId: "catalogTile_31",
                        title: "My Benefits",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["benefits", "personal"],
                        properties : {
                            title: "My Benefits",
                            subtitle: "",
                            numberValue: 3,
                            numberState: "Neutral",
                            numberUnit: "",
                            info: "pending",
                            icon: "sap-icon://family-care",
                            targetURL: "#UI2Fiori2SampleApps-config"
                        }
                    },
                    {
                        chipId: "catalogTile_32",
                        title: "My Timesheets",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["time", "personal"],
                        properties : {
                            title: "My Timesheets",
                            subtitle: "",
                            numberValue: 30,
                            numberState: "Neutral",
                            numberUnit: "",
                            info: "days missing",
                            icon: "sap-icon://time-entry-request",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        chipId: "catalogTile_33",
                        title: "Sales Performance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["sales", "performance"],
                        serviceRefreshInterval: 10,
                        properties: {
                            title : "Sales Performance",
                            numberValue : 3.75,
                            info : 'Change to Last Month in %',
                            numberFactor : '%',
                            numberDigits : 2,
                            numberState : "Positive",
                            stateArrow : "Up",
                            icon: "sap-icon://Fiori2/F0002",
                            targetURL: "#Action-todefaultapp",
                            serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        chipId: "catalogTile_34",
                        title: "WEB GUI",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        properties: {
                            title: "WEB GUI",
                            subtitle: "Opens WEB GUI",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#Action-WEBGUI"
                        }
                    },
                    {
                        chipId: "catalogTile_35",
                        title: "US Profit Margin is at",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        properties : {
                            title: "US Profit Margin is at",
                            numberValue : 21.599,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'Relative Improvement',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Action-toappnavsample"
                        }
                    },
                    {
                        chipId: "catalogTile_36",
                        title: "Gross Revenue under Target at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "revenue", "target"],
                        properties : {
                            title: "Gross Revenue under Target at",
                            numberValue : 347.765,
                            info : 'Absolute Deviation',
                            infoState: "Negative",
                            numberFactor: "M",
                            numberUnit : 'EUR',
                            numberDigits : 0,
                            numberState : "Negative",
                            stateArrow : "Down",
                            targetURL: "#Action-approvepurchaseorders"
                        }
                    },
                    {
                        chipId: "catalogTile_37",
                        title: "Net Order Value is at",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "order", "sales"],
                        properties : {
                            title: "Net Order Value is at",
                            numberValue : 85.851,
                            info : 'Absolute Deviation',
                            numberFactor: "M",
                            numberUnit : 'EUR',
                            numberDigits : 2,
                            numberState : "Negative",
                            stateArrow : "Up",
                            targetURL: "#UI2Fiori2SampleApps-AppScflTest"
                        }
                    },
                    {
                        chipId: "catalogTile_38",
                        title: "I am a short title!",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        properties: {
                            title: "I am a short title!",
                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        chipId: "catalogTile_39",
                        title: "Wikipedia",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        properties: {
                            title: "Wikipedia",
                            subtitle: "Opens Wikipedia",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-wikipedia"
                        }
                    },
                    {
                        chipId: "catalogTile_40",
                        title: "My Leave Request",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        properties: {
                            title: "My Leave Request",
                            subtitle: "Opens Fiori 1 App",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    },
                    {
                        chipId: "catalogTile_41",
                        title: "Just another long long long long long title",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.DynamicTile",
                        serviceRefreshInterval: 0,
                        properties : {
                            title: "Just another long long long long long title",
                            subtitle: "This shows a DynamicTile",
                            numberValue: 20,
                            numberState: "Positive",
                            numberUnit: "days",
                            stateArrow: "Down",
                            infoState: "Positive",
                            info: "running without any crashes",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp",
                            serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js"
                        }
                    },
                    {
                        chipId: "catalogTile_42",
                        title: "User maintenance",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        properties: {
                            title: "User maintenance",
                            subtitle: "Opens WebGUI",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://employee",
                            targetURL: "#UI2Fiori2SampleApps-webdynpro"
                        }
                    },
                    {
                        chipId: "catalogTile_43",
                        title: "Source Control",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        properties: {
                            title: "Source Control",
                            subtitle: "Opens Gerrit ",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://world",
                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
                        }
                    },
                    {
                        chipId: "catalogTile_44",
                        title: "XSS Example",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        properties: {
                            title: "<script>alert('Hi');</script>XSS",
                            subtitle: "Opens Fiori 1 App<script>alert('Hi');</script>",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://<script>alert('Hi');</script>",
                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
                        }
                    }
                ]
            }
        ],
        applications: {
            "" : { //default application - empty URL hash
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/FioriSandboxDefaultApp"
            },
            "Action-WEBGUI" : {
                additionalInformation: "",
                applicationType: "NWBC",
                url: "http://walla.co.il",
                description : "web gui testing"
            },
            "Action-todefaultapp" : { //default application as explicit navigation target
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/FioriSandboxDefaultApp",
                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
            },
            "Action-toappshelluiservicesample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppShellUIServiceSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppShellUIServiceSample",
                description : "ShellUI Service demo app"
            },
            "UI2Fiori2SampleApps-defaultapp" : { //default application as explicit navigation target
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/FioriSandboxDefaultApp",
                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
            },

            "UI2Fiori2SampleApps-AppScflTest" : { //sample scaffolding application
                additionalInformation: "SAPUI5.Component=AppScflTest",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppScflTest"
            },

            "UI2Fiori2SampleApps-wikipedia" : {
                applicationType: "URL",
                url: "http://www.wikipedia.org",
                description : "Wikipedia"
            },

            "UI2Fiori2SampleApps-Gerrit" : {
                applicationType: "NWBC",
                url: "http://www.carsforum.co.il",
                description : "Gerrit"
            },


            "UI2Fiori2SampleApps-MyLeaveRequest" : {
                applicationType: "URL",
                url: "http://www.sap.com/index.html",
                description : "My Leave Request"
            },

            "UI2Fiori2SampleApps-config"  : {
                additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/FioriSandboxConfigApp",
                description : "Config App : Configure Test-local1 and Test-local2 apps"
            },
            "Action-toappfiori2adaptationsample"  : {
                additionalInformation: "SAPUI5.Component=sap.ui.demo.wt",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/Fiori2AdaptationSampleApp",
                description : "Sample application for Fiori UX 2 Adaptation"
            },
            "Action-toappfiori2adaptationsample2"  : {
                additionalInformation: "SAPUI5.Component=sap.ui.demo.wt",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/Fiori2AdaptationSampleApp2",
                description : "Second sample application for Fiori UX 2 Adaptation"
            },
            "Action-toappnavsample"  : {
                /*
                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
                 *
                 * Demonstrates resource-based navigation inside a shell runtime
                 *
                 * Run e.g. as :
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1
                 *
                 */

                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                description : "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) "
            },
            "EPMProduct-shop"  : {
                /*
                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
                 *
                 * Demonstrates resource-based navigation inside a shell runtime
                 *
                 * Run e.g. as :
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1
                 *
                 */

                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                description : "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) "
            },
            "LeaveRequest-display"  : {
                /*
                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
                 *
                 * Demonstrates resource-based navigation inside a shell runtime
                 *
                 * Run e.g. as :
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1
                 *
                 */

                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                description : "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) "
            }
            ,

            "UI2Fiori2SampleApps-appnavsample"  : {
                /*
                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
                 *
                 * Demonstrates resource-based navigation inside a shell runtime
                 *
                 * Run e.g. as :
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail
                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1
                 *
                 */

                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                description : "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) "
            },

            "Action-toappnavsample2" : {
                /*
                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
                 *
                 * Demonstrates resource-based navigation inside a shell runtime
                 *
                 * Run e.g. as :
                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/Detail
                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/View1
                 *
                 */
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample2",
                description : "AppNavSample2 Inner App Navigation: Do it your self (Early(component) navigator instantiation, simple route registration example, no model binding, explicit view changes within the app)"
            },
            "PurchaseOrder-display" : {
                /*
                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
                 *
                 * Demonstrates resource-based navigation inside a shell runtime
                 *
                 * Run e.g. as :
                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/Detail
                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/View1
                 *
                 */
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample2",
                description : "AppNavSample2 Inner App Navigation: Do it your self (Early(component) navigator instantiation, simple route registration example, no model binding, explicit view changes within the app)"
            },

            "Action-toappperssample" : {
                /*
                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample2
                 */
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppPersSample",
                description : "AppPersSample 1: NOT YET READY - Sample app for generic usage of personalization service"
            },

            "Action-toappperssample2" : {
                /*
                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample22
                 */
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample2",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppPersSample2",
                description : "AppPersSample 2: INTERMEDIATE VERSION - Sample app for personalization of tables (intermediate version until table personalization is directly supported by UI5 Mobile)"
            },

            "UI2Fiori2SampleApps-appnavsample2" : {
                /*
                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
                 *
                 * Demonstrates resource-based navigation inside a shell runtime
                 *
                 * Run e.g. as :
                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/Detail
                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/View1
                 *
                 */
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample2",
                description : "AppNavSample2 Inner App Navigation: Do it your self (Early(component) navigator instantiation, simple route registration example, no model binding, explicit view changes within the app)"
            },

            "UI2Fiori2SampleApps-appperssample" : {
                /*
                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample2
                 */
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppPersSample",
                description : "AppPersSample 1: NOT YET READY - Sample app for generic usage of personalization service"
            },

            "UI2Fiori2SampleApps-appperssample2" : {
                /*
                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample22
                 */
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample2",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppPersSample2",
                description : "AppPersSample 2: INTERMEDIATE VERSION - Sample app for personalization of tables (intermediate version until table personalization is directly supported by UI5 Mobile)"
            },

            "UI2Fiori2SampleApps-approvepurchaseorders" : {
                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\ApprovePurchaseOrders
                 *
                 */
                additionalInformation: "SAPUI5.Component=ApprovePurchaseOrders",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/ApprovePurchaseOrders",
                description : "ApprovePurchaseOrders:SAP UI5 Best practice App (Inner App Navigation): explicit mapping of routes to model bindings and views, automatic view changes by the Nav framework"
            },

            "UI2Fiori2SampleApps-navigationwithroutes" : {
                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\ApprovePurchaseOrders
                 *
                 */
                additionalInformation: "SAPUI5.Component=NavigationWithRoutes",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/NavigationWithRoutes",
                description : "NavgationWithRoutes:Shows how to navigate using routes without the context property"
            },

            "UI2Fiori2SampleApps-NavigationWithoutRoutes" : {
                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\ApprovePurchaseOrders
                 *
                 */
                additionalInformation: "SAPUI5.Component=NavigationWithoutRoutes",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/NavigationWithoutRoutes",
                description : "NavigationWithoutRoutes:Shows how to navigate without using routes(that means you cannot bookmark the resulting links)"
            },

            "UI2Fiori2SampleApps-NavigationWithoutMasterDetailPattern" : {
                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\NavigationWithoutMasterDetailPattern
                 *
                 */
                additionalInformation: "SAPUI5.Component=NavigationWithoutMasterDetailPattern",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/NavigationWithoutMasterDetailPattern",
                description : "Shows how to navigate without using routes without the master-detail pattern"
            },

            "UI2Fiori2SampleApps-webdynpro" : {
                applicationType: "NWBC",
                url: "http://www.sap.com/index.html",
                description : "Web Dynpro for ABAP Application Integration"
            },

            "UI2Fiori2SampleApps-webgui" : {
                applicationType: "NWBC",
                url: "http://www.sap.com/index.html",
                description : "WebGUI Application Integration"
            }

            /* Put your own application here
             "MySO-Action" : {
             additionalInformation: "SAPUI5.Component=<component-name>",
             applicationType: "URL",
             url: "/<path-to-component-root>"    // folder where Component.js is stored
             },
             */

            /*"UI5Sample-ApprovePurchaseOrdersOLD" : {
             additionalInformation: "SAPUI5=ApprovePurchaseOrders/view.App.view.js",
             applicationType: "URL",
             url: "/uilib-sample/blueprint/"
             }, */
        },
        // data for the personalization service
        personalizationStorageType: "MEMORY",
        pathToLocalizedContentResources: sUshellTestRootPath + "/test/services/resources/resources.properties",
        personalizationData: {
            "sap.ushell.personalization#sap.ushell.services.UserRecents" : {
                "ITEM#RecentActivity": [
                    { desktop: undefined, tablet: undefined, mobile: undefined, "iCount": 1, "iTimestamp": 1378478828152, "oItem": {"icon": "sap-icon://search","title": "Search application - just to test long text wrapping", "appType": "Search", "appId": "#Action-todefaultapp", url: "#Action-todefaultapp?a=12", "timestamp": 1378478828152}},
                    { desktop: undefined, tablet: undefined, mobile: undefined, "iCount": 1, "iTimestamp": 1378478828146, "oItem": {"title": "title on desktop 2", "appType": "Application", "appId": "#Action-toappnavsample", url: "#Action-toappnavsample?a=122", "timestamp": 1378478828152}},
                    { desktop: undefined, tablet: undefined, mobile: undefined, "iCount": 1, "iTimestamp": 1378478828148, "oItem": {"title": "title on desktop 2", "appType": "FactSheet", "appId": "#Action-toappnavsample", url: "#Action-toappnavsample&/View2", "timestamp": 1378478828152}},
                    { desktop: undefined, tablet: undefined, mobile: undefined, "iCount": 1, "iTimestamp": 1378478828146, "oItem": {"title": "title on desktop 2", "appType": "Application", "appId": "#PurchaseOrder-display", url: "#PurchaseOrder-display&/View1", "timestamp": 1378478828152}}

                ],
                "ITEM#RecentApps": [
                    {"iCount": 1, "iTimestamp": 1378479383874, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                    {"iCount": 2, "iTimestamp": 1378479383895, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 3", "url" : "#Action-toappnavsample"}},
                    {"iCount": 2, "iTimestamp": 1378479383896, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 2", "url" : "#Action-toappnavsample2"}},
                    {"iCount": 1, "iTimestamp": 1378479383899, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "MyLeaveRequest", "sTargetHash": "#UI2Fiori2SampleApps-MyLeaveRequest", "title" : "My Leave Request", "url" : "#UI2Fiori2SampleApps-MyLeaveRequest"}},
                    {"iCount": 2, "iTimestamp": 1378479383878, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 8", "url" : "#Action-toappnavsample"}},
                    {"iCount": 2, "iTimestamp": 1378479383897, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 1", "url" : "#Action-toappnavsample2"}},
                    {"iCount": 1, "iTimestamp": 1378479383898, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve first Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                    {"iCount": 2, "iTimestamp": 1378479383863, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 13", "url" : "#Action-toappnavsample"}},
                    {"iCount": 2, "iTimestamp": 1378479383862, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 12", "url" : "#Action-toappnavsample2"}},
                    {"iCount": 1, "iTimestamp": 1378479383879, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                    {"iCount": 2, "iTimestamp": 1378479383894, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 4", "url" : "#UI2Fiori2SampleApps-appnavsample"}},
                    {"iCount": 2, "iTimestamp": 1378479383893, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 5", "url" : "#UI2Fiori2SampleApps-appnavsample2"}}
                ],
                "ITEM#RecentSearches": [
                    {"iCount": 1, "iTimestamp": 1378478828152, "oItem": {"sTerm": "Test"}},
                    {"iCount": 1, "iTimestamp": 1378478828151, "oItem": {"sTerm": "Recent search 3"}},
                    {"iCount": 1, "iTimestamp": 1378478828149, "oItem": {"sTerm": "Recent search 4", "oObjectName": {"label": "Business Partners", "value": "Business Partners"}}},
                    {"iCount": 1, "iTimestamp": 1378478828153, "oItem": {"sTerm": "Sally", "oObjectName": {"label": "Employees", "value": "Employees"}}},
                    {"iCount": 1, "iTimestamp": 1378478828148, "oItem": {"sTerm": "Recent search 5"}},
                    {"iCount": 1, "iTimestamp": 1378478828147, "oItem": {"sTerm": "Recent search 6"}},
                    {"iCount": 1, "iTimestamp": 1378478828137, "oItem": {"sTerm": "Recent search 16"}},
                    {"iCount": 1, "iTimestamp": 1378478828136, "oItem": {"sTerm": "Recent search 17"}},
                    {"iCount": 1, "iTimestamp": 1378478828133, "oItem": {"sTerm": "Recent search 20"}},
                    {"iCount": 1, "iTimestamp": 1378478828132, "oItem": {"sTerm": "Recent search 21"}},
                    {"iCount": 1, "iTimestamp": 1378478828131, "oItem": {"sTerm": "Recent search 22"}},
                    {"iCount": 1, "iTimestamp": 1378478828146, "oItem": {"sTerm": "Recent search 7"}},
                    {"iCount": 1, "iTimestamp": 1378478828145, "oItem": {"sTerm": "Recent search 8"}},
                    {"iCount": 1, "iTimestamp": 1378478828144, "oItem": {"sTerm": "Recent search 9"}},
                    {"iCount": 1, "iTimestamp": 1378478828143, "oItem": {"sTerm": "Recent search 10"}},
                    {"iCount": 1, "iTimestamp": 1378478828135, "oItem": {"sTerm": "Recent search 18"}},
                    {"iCount": 1, "iTimestamp": 1378478828134, "oItem": {"sTerm": "Recent search 19"}},
                    {"iCount": 1, "iTimestamp": 1378478828142, "oItem": {"sTerm": "Recent search 11"}},
                    {"iCount": 1, "iTimestamp": 1378478828141, "oItem": {"sTerm": "Recent search 12"}},
                    {"iCount": 1, "iTimestamp": 1378478828140, "oItem": {"sTerm": "Recent search 13"}},
                    {"iCount": 1, "iTimestamp": 1378478828139, "oItem": {"sTerm": "Recent search 14"}},
                    {"iCount": 1, "iTimestamp": 1378478828138, "oItem": {"sTerm": "Recent search 15"}}
                ]
            }
        },
        search: {
            searchResultPath: "./searchResults/record.json"
        }
    };
    sap.ushell.shells.demo.demoContent = {
        groups: [{
            id: "83218ac3-4c18-34c2-a781-fe4bde918ee4",
            title: "Welcome",
            isPreset: true,
            isVisible: true,
            isGroupLocked: false,
            tiles: []
        }, {
            id: "66b726bf-2df6-3dc1-8bc0-31d2c094f4bd",
            title: "ERP Human Capital Management Apps",
            isPreset: true,
            isVisible: true,
            isGroupLocked: false,
            tiles: [{
                id: "9a6eb46c-2d10-3a37-90d8-8f49f60cbcf4",
                title: "My Paystubs",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_1",
                properties: {
                    //
                    title: "My Paystubs",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://travel-expense-report",
                    targetURL: ""
                }
            }, {
                id: "6f2d025d-710f-321c-a0de-8a144df9add2",
                title: "My Benefits",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_2",
                properties: {
                    title: "My Benefits",
                    subtitle: "",
                    numberValue : 1,
                    numberDigits : 1,
                    numberUnit : "Pending Plans",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://family-care",
                    targetURL: ""
                }
            }, {
                id: "358b41f8-48f6-3ed2-b4f0-d02ec7228e0b",
                title: "My Leave Requests",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_3",
                properties: {
                    title: "My Leave Requests",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://add",
                    targetURL: ""
                }
            }, {
                id: "358b41f8-48f6-3ed2-b4f0-d02ec7228e0b",
                title: "My Timesheet",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_4",
                properties: {
                    title: "My Timesheet",
                    subtitle: "",
                    numberValue : 27,
                    numberDigits : 2,
                    numberUnit : "Missing Days",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://time-entry-request",
                    targetURL: ""
                }
            }, {
                id: "e1d95e4f-e10d-394b-adfa-db8d14aaae0e",
                title: "Approve Leave Requests",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_5",
                properties: {
                    title: "Approve Leave Requests",
                    subtitle: "",
                    numberValue : 2,
                    numberDigits : 1,
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://card",
                    targetURL: ""
                }
            }, {
                id: "125c5565-eb04-33ba-920e-35616e2810e0",
                title: "Approve Timesheets",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_6",
                properties: {
                    //
                    title: "Approve Timesheets",
                    subtitle: "",
                    numberValue : 0,
                    // numberFactor: "M",
                    numberDigits : 1,
                    numberUnit : "Pending Entries",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://time-entry-request",
                    targetURL: ""
                }
            }]
        }, {
            id: "12022086-c149-3bd8-be95-636e13c6236c",
            title: "ERP Logistics (MM) Apps",
            isPreset: true,
            isVisible: true,
            isGroupLocked: false,
            tiles: [{
                id: "3ed613a5-0dab-3464-a2bb-456faf48e561",
                title: "Approve Requisitions",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_7",
                properties: {
                    //
                    title: "Approve Requisitions",
                    subtitle: "",
                    numberValue : 12,
                    numberDigits : 2,
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://bar-code",
                    targetURL: ""
                }
            }, {
                id: "3851e8d4-2f8e-3e3b-b214-64a8b644b669",
                title: "Order from Requisitions",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_8",
                properties: {
                    //
                    title: "Order from Requisitions",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://expense-report",
                    targetURL: ""
                }
            }, {
                id: "60bfb020-4232-3035-9c4f-0b0228e85eed",
                title: "Approve Purchase Orders",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_9",
                properties: {
                    //
                    title: "Approve Purchase Orders",
                    subtitle: "",
                    numberValue : 13,
                    numberDigits : 2,
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://sales-quote",
                    targetURL: "#PurchaseOrder-Approve"
                }
            }, {
                id: "7e5639df-8122-334a-adb0-f071264f47d6",
                title: "Approve Purchase Contracts",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_10",
                properties: {
                    //
                    title: "Approve Purchase Contracts",
                    subtitle: "",
                    numberValue : 12,
                    numberDigits : 2,
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://expense-report",
                    targetURL: ""
                }
            }]
        }, {
            id: "52fba177-88d5-35a9-aff1-707badbc3da1",
            title: "ERP Logistics (SD) Apps",
            isPreset: true,
            isVisible: true,
            isGroupLocked: false,
            tiles: [{
                id: "dc5ea64d-2bbb-3b1f-b886-143b6014a983",
                title: "Check Price and Availability",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_11",
                properties: {
                    title: "Check Price and Availability",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://check-availability",
                    targetURL: ""
                }
            }, {
                id: "85cdd6b2-80a8-3c2b-ba80-0a756d4e4105",
                title: "Create Sales Orders",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_12",
                properties: {
                    title: "Create Sales Orders",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://add",
                    targetURL: ""
                }
            }, {
                id: "f1a7e2b9-eac7-3303-8f33-203f16f2971e",
                title: "Change Shipping Address",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_13",
                properties: {
                    title: "Change Shipping Address",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://Fiori2/F0019",
                    targetURL: ""
                }
            }, {
                id: "0ff8d946-fea4-3945-87f6-82dd9629c852",
                title: "Track Sales Orders",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_14",
                properties: {
                    title: "Track Sales Orders",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://Fiori2/F0020",
                    targetURL: ""
                }
            }, {
                id: "6c2c86f7-5187-34c1-a515-c2bac312dc4e",
                title: "Customer Invoices",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_15",
                properties: {
                    title: "Customer Invoices",
                    subtitle: "",
                    numberValue : 5,
                    numberDigits : 1,
                    numberUnit : "Past Due",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://customer-financial-fact-sheet",
                    targetURL: ""
                }
            }]
        }, {
            id: "9a07d7fb-2e93-3228-a56a-7b35d727beaa",
            title: "ERP Accounting Apps",
            isPreset: true,
            isVisible: true,
            isGroupLocked: false,
            tiles: [{
                id: "f0b502c0-d9cc-3fbe-9bfb-63b17b75dbab",
                title: "Track Sales Orders",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.TileBase",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "catalogTile_16",
                properties: {
                    title: "My Spend",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "",
                    icon: "sap-icon://Chart-Tree-Map",
                    targetURL: ""
                }
            }]
        }],
        catalogs: [
            {
                id: "catalog_01",
                title: "Employee services",
                tiles: [{
                    id: "9a6eb46c-2d10-3a37-90d8-8f49f60cbcf4",
                    title: "My Paystubs",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_1",
                    properties: {
                        title: "My Paystubs",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://travel-expense-report",
                        targetURL: ""
                    }
                }, {
                    id: "6f2d025d-710f-321c-a0de-8a144df9add2",
                    title: "My Benefits",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_2",
                    properties: {
                        title: "My Benefits",
                        subtitle: "",
                        numberValue : 1,
                        numberDigits : 1,
                        numberUnit : "Pending Plans",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://family-care",
                        targetURL: ""
                    }
                }, {
                    id: "358b41f8-48f6-3ed2-b4f0-d02ec7228e0b",
                    title: "My Leave Requests",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_3",
                    properties: {
                        title: "My Leave Requests",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://add",
                        targetURL: ""
                    }
                }, {
                    id: "358b41f8-48f6-3ed2-b4f0-d02ec7228e0b",
                    title: "My Timesheet",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_4",
                    properties: {
                        title: "My Timesheet",
                        subtitle: "",
                        numberValue : 27,
                        numberDigits : 2,
                        numberUnit : "Missing Days",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://time-entry-request",
                        targetURL: ""
                    }
                }, {
                    id: "e1d95e4f-e10d-394b-adfa-db8d14aaae0e",
                    title: "Approve Leave Requests",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_5",
                    properties: {
                        title: "Approve Leave Requests",
                        subtitle: "",
                        numberValue : 2,
                        numberDigits : 1,
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://card",
                        targetURL: ""
                    }
                }, {
                    id: "125c5565-eb04-33ba-920e-35616e2810e0",
                    title: "Approve Timesheets",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_6",
                    properties: {
                        title: "Approve Timesheets",
                        subtitle: "",
                        numberValue : 0,
                        numberDigits : 1,
                        numberUnit : "Pending Entries",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://time-entry-request",
                        targetURL: ""
                    }
                }]
            }, {
                id: "catalog_01",
                title: "Purchasing",
                tiles: [{
                    id: "3ed613a5-0dab-3464-a2bb-456faf48e561",
                    title: "Approve Requisitions",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_7",
                    properties: {
                        title: "Approve Requisitions",
                        subtitle: "",
                        numberValue : 12,
                        numberDigits : 2,
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://bar-code",
                        targetURL: ""
                    }
                }, {
                    id: "3851e8d4-2f8e-3e3b-b214-64a8b644b669",
                    title: "Order from Requisitions",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_8",
                    properties: {
                        title: "Order from Requisitions",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://expense-report",
                        targetURL: ""
                    }
                }, {
                    id: "60bfb020-4232-3035-9c4f-0b0228e85eed",
                    title: "Approve Purchase Orders",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_9",
                    properties: {
                        title: "Approve Purchase Orders",
                        subtitle: "",
                        numberValue : 13,
                        // numberFactor: "M",
                        numberDigits : 2,
                        //numberUnit : "Pending Entries",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://sales-quote",
                        targetURL: "#PurchaseOrder-Approve"
                    }
                }, {
                    id: "7e5639df-8122-334a-adb0-f071264f47d6",
                    title: "Approve Purchase Contracts",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_10",
                    properties: {
                        title: "Approve Purchase Contracts",
                        subtitle: "",
                        numberValue : 12,
                        numberDigits : 2,
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://expense-report",
                        targetURL: ""
                    }
                }, {
                    id: "dc5ea64d-2bbb-3b1f-b886-143b6014a983",
                    title: "Check Price and Availability",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_11",
                    properties: {
                        title: "Check Price and Availability",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://check-availability",
                        targetURL: ""
                    }
                }, {
                    id: "85cdd6b2-80a8-3c2b-ba80-0a756d4e4105",
                    title: "Create Sales Orders",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_12",
                    properties: {
                        title: "Create Sales Orders",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://add",
                        targetURL: ""
                    }
                }, {
                    id: "f1a7e2b9-eac7-3303-8f33-203f16f2971e",
                    title: "Change Shipping Address",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_13",
                    properties: {
                        title: "Change Shipping Address",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://Fiori2/F0019",
                        targetURL: ""
                    }
                }, {
                    id: "0ff8d946-fea4-3945-87f6-82dd9629c852",
                    title: "Track Sales Orders",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_14",
                    properties: {
                        title: "Track Sales Orders",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://Fiori2/F0020",
                        targetURL: ""
                    }
                }, {
                    id: "6c2c86f7-5187-34c1-a515-c2bac312dc4e",
                    title: "Customer Invoices",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.DynamicTile",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_15",
                    properties: {
                        title: "Customer Invoices",
                        subtitle: "",
                        numberValue : 5,
                        numberDigits : 1,
                        numberUnit : "Past Due",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://customer-financial-fact-sheet",
                        targetURL: ""
                    }
                }, {
                    id: "f0b502c0-d9cc-3fbe-9bfb-63b17b75dbab",
                    title: "Track Sales Orders",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "catalogTile_16",
                    properties: {
                        title: "My Spend",
                        subtitle: "",
                        infoState: "Neutral",
                        info: "",
                        icon: "sap-icon://Chart-Tree-Map",
                        targetURL: ""
                    }
                }]
            }],
        applications: {
            "PurchaseOrder-Approve": {
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa",
                applicationType: "URL"
            }
        },
        personalizationData: {},
        search: {
            searchResultPath: "./searchResults/record.json"
        }
    };

    function getUrlParams() {
        var vars = {},
            parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = value;
            });
        return vars;
    }

    function writeToUshellConfig(oConfig) {
        jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config", 0).groups = oConfig.groups;
        jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config", 0).catalogs = oConfig.catalogs;
        jQuery.sap.getObject("sap-ushell-config.services.NavTargetResolution.adapter.config", 0).applications = oConfig.applications;
        jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config", 0).personalizationData = oConfig.personalizationData;
        jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config", 0).storageType = oConfig.personalizationStorageType;
        jQuery.sap.getObject("sap-ushell-config.services.Search.adapter.config", 0).searchResultPath = oConfig.search && oConfig.search.searchResultPath;
    }

    function mockDataForEasyAccess() {
        var oConfig = jQuery.sap.getObject("sap-ushell-config.renderers.fiori2.componentData.config.applications.Shell-home");
        if (oConfig) {
            oConfig.easyAccessNumbersOfLevels = 1;
        }

        jQuery.sap.require("sap.ushell.shells.demo.mockserver");
        var baseUrl = jQuery.sap.getModulePath("sap.ushell.shells.demo");
        sap.ushell.shells.demo.mockserver.loadMockServer(baseUrl + "/AppFinderData/EASY_ACCESS_MENU/", "/sap/opu/odata/UI2/EASY_ACCESS_MENU;o=LOCAL/");
        sap.ushell.shells.demo.mockserver.loadMockServer(baseUrl + "/AppFinderData/EASY_ACCESS_MENU/", "/sap/opu/odata/UI2/EASY_ACCESS_MENU;o=U1YCLNT120/");
        sap.ushell.shells.demo.mockserver.loadMockServer(baseUrl + "/AppFinderData/USER_MENU/LOCAL/", "/sap/opu/odata/UI2/USER_MENU;o=LOCAL/");
        sap.ushell.shells.demo.mockserver.loadMockServer(baseUrl + "/AppFinderData/USER_MENU/U1YCLNT120/", "/sap/opu/odata/UI2/USER_MENU;o=U1YCLNT120/");
    }

    var urlParams = getUrlParams();

    // check the value of the URL parameter "use-demo-content" in order to decide which content JSON should be returned (demoContent or testContent)
    if (urlParams["use-demo-content"] !== undefined && urlParams["use-demo-content"].toString() === "true") {
        writeToUshellConfig(sap.ushell.shells.demo.demoContent);
//        sap.ushell.shells.demo.fioriDemoConfig = sap.ushell.shells.demo.demoContent;
    } else {
        writeToUshellConfig(sap.ushell.shells.demo.testContent);
        // TODO: temp work-around, "" should be removed from apps
        delete jQuery.sap.getObject("sap-ushell-config.services.NavTargetResolution.adapter.config", 0).applications[""];
    }
    if (urlParams["easy-access-real-data"] === undefined ||  urlParams["easy-access-real-data"].toString() === "false") {
        mockDataForEasyAccess();
    }
}());
