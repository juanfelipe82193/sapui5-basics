// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains a sample Fiori sandbox application configuration.
 */

(function () {
    "use strict";
    /*global sap,jQuery, window */

    jQuery.sap.declare("sap.ushell.shells.demo.fioriDemoConfig");
    var sUshellTestRootPath = jQuery.sap.getResourcePath('sap/ushell').replace('resources', 'test-resources'),
        sIframeURL = jQuery.sap.getUriParameters().get("iframe-url");

    if (sIframeURL === null) {
        sIframeURL = sUshellTestRootPath + "/shells/demo/ui5appruntime.html";
    }

    sap.ushell.shells.demo.testContent = {
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
                        id: "tile_01",
                        title: "Test App",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "Test App",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'NON ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#AppNotIsolated-Action"
                        }
                    },
                    {
                        id: "tile_02",
                        title: "Test App",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_31",
                        properties : {
                            title: "Test App",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_03",
                        title: "Letter Box",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_34",
                        properties : {
                            title: "Letter Box",
                            numberValue : 100.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Action-toLetterBoxing"
                        }
                    },
                    {
                        id: "tile_04",
                        title: "Letter Box",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_35",
                        properties : {
                            title: "App Nav Sample",
                            numberValue : 44.00,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Action-toappnavsample"
                        }
                    },
                    {
                        id: "tile_08",
                        title: "Test ToExternal App",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "Test ToExternal App",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'NON ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#FioriToExtApp-Action"
                        }
                    },
                    {
                        id: "tile_09",
                        title: "Test ToExternal App Target",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "Test ToExternal App Target",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'NON ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#FioriToExtAppTarget-Action"
                        }
                    },
                    {
                        id: "tile_10",
                        title: "Test UI5 To External App Isolated",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "Test UI5 Isolated App",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#FioriToExtAppIsolated-Action"
                        }
                    },
                    {
                        id: "tile_11",
                        title: "Test UI5 To External App Isolated",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "Test UI5 Target Isolated App",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#FioriToExtAppTargetIsolated-Action"
                        }
                    },
                    {
                        id: "tile_12",
                        title: "Bookmarks Isolated",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_12",
                        properties : {
                            title: "Bookmarks Isolated",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#BookmarksIsolated-Action"
                        }
                    },
                    {
                        id: "tile_13",
                        title: "State Isolated",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_13",
                        properties : {
                            title: "State Isolated",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Action-toappcontextsample"
                        }
                    },
                    {
                        id: "tile_14",
                        title: "App Runtime Renderer API Sample",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "App Runtime Renderer API Sample",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#Renderer-Sample"
                        }
                    },
                    {
                        id: "tile_15",
                        title: "Bookmark With State",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "Bookmark With State",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'NON ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#BookmarkState-Sample"
                        }
                    },
                    {
                        id: "tile_15",
                        title: "Bookmark With State",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["profit", "profit margin", "sales"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "Bookmark With State",
                            numberValue : 24.80,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#BookmarkStateIso-Sample"
                        }
                    },
	                {
		                id: "tile_16",
		                title: "Event Delegation Demo",
		                size: "1x1",
		                tileType : "sap.ushell.ui.tile.DynamicTile",
		                keywords: ["delegation"],
		                formFactor: "Desktop",
		                chipId: "catalogTile_30",
		                properties : {
			                title: "Event Delegation Demo",
			                numberValue : 99.99,
			                info : '',
			                infoState: "Positive",
			                numberFactor: '%',
			                numberUnit : 'ISOLATED',
			                numberDigits : 1,
			                numberState : "Positive",
			                stateArrow : "Up",
			                targetURL: "#EventDelegationDemoApp-Action"
		                }
	                },
                    {
                        id: "tile_17",
                        title: "App For On Close",
                        size: "1x1",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        keywords: ["delegation"],
                        formFactor: "Desktop",
                        chipId: "catalogTile_30",
                        properties : {
                            title: "App For On Close",
                            numberValue : 24.42,
                            info : '',
                            infoState: "Positive",
                            numberFactor: '%',
                            numberUnit : 'ISOLATED',
                            numberDigits : 1,
                            numberState : "Positive",
                            stateArrow : "Up",
                            targetURL: "#AppBeforeCloseEvent-Action"
                        }
                    }
                ]
            }
        ],
        catalogs: [
            {
                id: "test_catalog_00",
                title: "General",
                tiles: [
                    {
                        id: "9a6eb46c-2d10-3a37-90d8-8f49f60cb111",
                        title: "MyTest",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLinkPersonalizationSupported: true,
                        formFactor: "Desktop,Tablet,Phone",
                        chipId: "catalogTile_1",
                        properties: {
                            title: "travel-expense-report",
                            subtitle: "",
                            infoState: "Neutral",
                            info: "",
                            icon: "sap-icon://travel-expense-report",
                            targetURL: "#FioriToExtAppTargetIsolated-Action"
                        }
                    },
                    {
                        chipId: "catalogTile_01",
                        title: "MyTest2",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLinkPersonalizationSupported: true,
                        keywords: ["risk", "neutral", "account"],
                        formFactor: "Desktop,Tablet,Phone",
                        tags: ["Liquidity", "Financial"],
                        properties: {
                            title: "Bank Risk",
                            subtitle: "Rating A- and below",
                            infoState: "Neutral",
                            info: "Today",
                            numberValue: 106.6,
                            numberDigits: 1,
                            numberState: "Neutral",
                            numberUnit: "M€",
                            targetURL: "#FioriToExtAppTargetIsolated-Action"
                        }
                    }
                ]
            }
        ],
        applications: {
	        "AppNotIsolated-Action": {
		        additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
		        applicationType: "URL",
		        url: sUshellTestRootPath + "/demoapps/FioriSandboxDefaultApp",
		        description: "Navigation App - Non Isolated"
	        },
	        "Action-todefaultapp": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.FioriSandboxDefaultApp#Action-todefaultapp",
		        description: "Navigation App - Isolated",
		        navigationMode: "embedded"
	        },
	        "Action-toLetterBoxing": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.letterBoxing#Action-toLetterBoxing",
		        description: "LetterBoxing demo app - Isolated",
		        navigationMode: "embedded"
	        },
	        "Action-toappnavsample": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.AppNavSample#Action-toappnavsample",
		        description: "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) ",
		        navigationMode: "embedded"
	        },
	        "FioriToExtApp-Action": {
		        additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriToExtApp",
		        url: sUshellTestRootPath + "/demoapps/FioriToExtApp",
		        applicationType: "URL",
		        description: "App Source"
	        },
	        "FioriToExtAppTarget-Action": {
		        additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriToExtAppTarget",
		        url: sUshellTestRootPath + "/demoapps/FioriToExtAppTarget",
		        applicationType: "URL",
		        description: "App Target"
	        },
	        "FioriToExtAppIsolated-Action": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.FioriToExtApp#FioriToExtApp-Action",
		        description: "App Source (Isolated)",
		        navigationMode: "embedded"
	        },
	        "FioriToExtAppTargetIsolated-Action": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.FioriToExtAppTarget#FioriToExtAppTarget-Action",
		        description: "App Target (Isolated)",
		        navigationMode: "embedded"
	        },
	        "BookmarksIsolated-Action": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.bookmark#BookmarkSample-Action",
		        description: "Bookmarks (Isolated)",
		        navigationMode: "embedded"
	        },
	        "Action-toappcontextsample": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.AppContextSample#Action-toappcontextsample",
		        description: "AppContext (Isolated)",
		        navigationMode: "embedded"
	        },
	        "Renderer-Sample": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.AppRuntimeRendererSample#Renderer-Sample",
		        description: "App Runtime Renderer Sample - Isolated",
		        navigationMode: "embedded"
	        },
	        "BookmarkState-Sample": {
		        additionalInformation: "SAPUI5.Component=sap.ushell.demo.bookmarkstate",
		        applicationType: "URL",
		        url: sUshellTestRootPath + "/demoapps/BookmarkAndStateApp",
		        description: ""
	        },
	        "BookmarkStateIso-Sample": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.bookmarkstate#BookmarkStateIso-Sample",
		        description: "",
		        navigationMode: "embedded"
	        },
	        "EventDelegationDemoApp-Action": {
		        applicationType: "URL",
		        url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.EventDelegationDemoApp#EventDelegationDemoApp-Action",
		        description: "Events Delegation Demo App",
		        navigationMode: "embedded"
	        },
            "AppBeforeCloseEvent-Action": {
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppBeforeCloseEvent/AppBeforeCloseEvent.html",
                navigationMode: "embedded"
            }
        },
        // data for the personalization service
        personalizationStorageType: "MEMORY",
        pathToLocalizedContentResources: sUshellTestRootPath + "/test/services/resources/resources.properties",
        personalizationData: {
            "sap.ushell.personalization#sap.ushell.services.UserRecents" : {
                "ITEM#RecentActivity": [],
                "ITEM#RecentApps": [],
                "ITEM#RecentSearches": []
            }
        },
        search: {
            searchResultPath: "./searchResults/record.json"
        }
    };

    function encode(uri) {
        return encodeURIComponent(uri).replace(/'/g,"%27").replace(/"/g,"%22");
    }
    function decode(uri) {
        return decodeURIComponent(uri.replace(/\+/g,  " "));
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

    writeToUshellConfig(sap.ushell.shells.demo.testContent);
    // TODO: temp work-around, "" should be removed from apps
    delete jQuery.sap.getObject("sap-ushell-config.services.NavTargetResolution.adapter.config", 0).applications[""];
}());
