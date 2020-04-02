// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    var sUshellTestRootPath = jQuery.sap.getResourcePath('sap/ushell').replace('resources', 'test-resources');

    var applications = {
        "sap.ushell.demo.AppRuntimeRendererSample" : {
            ui5ComponentName: "sap.ushell.demo.AppRuntimeRendererSample",
            url: sUshellTestRootPath + "/demoapps/AppRuntimeRendererSample"
        },
        "sap.ushell.demo.FioriSandboxDefaultApp" : {
            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
            url: sUshellTestRootPath + "/demoapps/FioriSandboxDefaultApp"
        },
        "sap.ushell.demo.letterBoxing" : {
            ui5ComponentName: "sap.ushell.demo.letterBoxing",
            url: sUshellTestRootPath + "/demoapps/AppLetterBoxing"
        },
        "sap.ushell.demo.FioriToExtApp"  : {
            ui5ComponentName: "sap.ushell.demo.FioriToExtApp",
            url: sUshellTestRootPath + "/demoapps/FioriToExtApp"
        },
        "sap.ushell.demo.FioriToExtAppTarget"  : {
            ui5ComponentName: "sap.ushell.demo.FioriToExtAppTarget",
            url: sUshellTestRootPath + "/demoapps/FioriToExtAppTarget"
        },
        "sap.ushell.demo.AppContextSample"  : {
            ui5ComponentName: "sap.ushell.demo.AppContextSample",
            url: sUshellTestRootPath + "/demoapps/AppContextSample"
        },
        "sap.ushell.demo.AppLetterBoxing"  : {
            ui5ComponentName: "sap.ushell.demo.AppLetterBoxing",
            url: sUshellTestRootPath + "/demoapps/AppLetterBoxing"
        },
        "sap.ushell.demo.AppNavSample"  : {
            ui5ComponentName: "sap.ushell.demo.AppNavSample",
            url: sUshellTestRootPath + "/demoapps/AppNavSample"
        },
        "sap.ushell.demo.AppNavSample2"  : {
            ui5ComponentName: "sap.ushell.demo.AppNavSample2",
            url: sUshellTestRootPath + "/demoapps/AppNavSample2"
        },
        "sap.ushell.demo.AppPersSample"  : {
            ui5ComponentName: "sap.ushell.demo.AppPersSample",
            url: sUshellTestRootPath + "/demoapps/AppPersSample"
        },
        "sap.ushell.demo.AppPersSample2"  : {
            ui5ComponentName: "sap.ushell.demo.AppPersSample2",
            url: sUshellTestRootPath + "/demoapps/AppPersSample2"
        },
        "sap.ushell.demo.AppPersSample3"  : {
            ui5ComponentName: "sap.ushell.demo.AppPersSample3",
            url: sUshellTestRootPath + "/demoapps/AppPersSample3"
        },
        "sap.ushell.demo.AppScflTest"  : {
            ui5ComponentName: "sap.ushell.demo.AppScflTest",
            url: sUshellTestRootPath + "/demoapps/AppScflTest"
        },
        "sap.ushell.demo.AppShellUIRouter"  : {
            ui5ComponentName: "sap.ushell.demo.AppShellUIRouter",
            url: sUshellTestRootPath + "/demoapps/AppShellUIRouter"
        },
        "sap.ushell.demo.AppShellUIServiceSample"  : {
            ui5ComponentName: "sap.ushell.demo.AppShellUIServiceSample",
            url: sUshellTestRootPath + "/demoapps/AppShellUIServiceSample"
        },
        "sap.ushell.demo.AppStateFormSample"  : {
            ui5ComponentName: "sap.ushell.demo.AppStateFormSample",
            url: sUshellTestRootPath + "/demoapps/AppStateFormSample"
        },
        "sap.ushell.demo.AppStateSample"  : {
            ui5ComponentName: "sap.ushell.demo.AppStateSample",
            url: sUshellTestRootPath + "/demoapps/AppStateSample"
        },
        "sap.ushell.demo.bookmark"  : {
            ui5ComponentName: "sap.ushell.demo.bookmark",
            url: sUshellTestRootPath + "/demoapps/BookmarkSample"
        },
        "sap.ushell.demo.ClickjackingSample"  : {
            ui5ComponentName: "sap.ushell.demo.ClickjackingSample",
            url: sUshellTestRootPath + "/demoapps/ClickjackingSample"
        },
        "sap.ushell.demo.ComponentEmbeddingSample"  : {
            ui5ComponentName: "sap.ushell.demo.ComponentEmbeddingSample",
            url: sUshellTestRootPath + "/demoapps/ComponentEmbeddingSample"
        },
        "sap.ushell.demo.demoTiles"  : {
            ui5ComponentName: "sap.ushell.demo.demoTiles",
            url: sUshellTestRootPath + "/demoapps/demoTiles"
        },
        "sap.ushell.demo.Fiori2AdaptationSampleApp"  : {
            ui5ComponentName: "sap.ushell.demo.Fiori2AdaptationSampleApp",
            url: sUshellTestRootPath + "/demoapps/Fiori2AdaptationSampleApp"
        },
        "sap.ushell.demo.Fiori2AdaptationSampleApp2"  : {
            ui5ComponentName: "sap.ushell.demo.Fiori2AdaptationSampleApp2",
            url: sUshellTestRootPath + "/demoapps/Fiori2AdaptationSampleApp2"
        },
        "sap.ushell.demo.FioriIframeApp"  : {
            ui5ComponentName: "sap.ushell.demo.FioriIframeApp",
            url: sUshellTestRootPath + "/demoapps/FioriIframeApp"
        },
        "sap.ushell.demo.HeaderCommonButtons"  : {
            ui5ComponentName: "sap.ushell.demo.HeaderCommonButtons",
            url: sUshellTestRootPath + "/demoapps/HeaderCommonButtons"
        },
        "sap.ushell.demo.HelloWorldSampleApp"  : {
            ui5ComponentName: "sap.ushell.demo.HelloWorldSampleApp",
            url: sUshellTestRootPath + "/demoapps/HelloWorldSampleApp"
        },
        "sap.ushell.demo.LaunchpadConfigFileExamples"  : {
            ui5ComponentName: "sap.ushell.demo.LaunchpadConfigFileExamples",
            url: sUshellTestRootPath + "/demoapps/LaunchpadConfigFileExamples"
        },
        "sap.ushell.demo.LinkList"  : {
            ui5ComponentName: "sap.ushell.demo.LinkList",
            url: sUshellTestRootPath + "/demoapps/LinkList"
        },
        "sap.ushell.demo.NotificationSampleData"  : {
            ui5ComponentName: "sap.ushell.demo.NotificationSampleData",
            url: sUshellTestRootPath + "/demoapps/NotificationSampleData"
        },
        "sap.ushell.demo.PostMessageTestApp"  : {
            ui5ComponentName: "sap.ushell.demo.PostMessageTestApp",
            url: sUshellTestRootPath + "/demoapps/PostMessageTestApp"
        },
        "sap.ushell.demo.PersSrv2Test"  : {
            ui5ComponentName: "sap.ushell.demo.PersSrv2Test",
            url: sUshellTestRootPath + "/demoapps/PersSrv2Test"
        },
        "sap.ushell.demo.PersSrvTest"  : {
            ui5ComponentName: "sap.ushell.demo.PersSrvTest",
            url: sUshellTestRootPath + "/demoapps/PersSrvTest"
        },
        "sap.ushell.demo.RTATestApp"  : {
            ui5ComponentName: "sap.ushell.demo.RTATestApp",
            url: sUshellTestRootPath + "/demoapps/RTATestApp"
        },
        "sap.ushell.demo.TargetResolutionTool"  : {
            ui5ComponentName: "sap.ushell.demo.TargetResolutionTool",
            url: sUshellTestRootPath + "/demoapps/TargetResolutionTool"
        },
        "sap.ushell.demo.UserDefaults"  : {
            ui5ComponentName: "sap.ushell.demo.UserDefaults",
            url: sUshellTestRootPath + "/demoapps/UserDefaults"
        },
        "sap.ushell.demo.ValidateUrlMessagePopoverSample"  : {
            ui5ComponentName: "sap.ushell.demo.ValidateUrlMessagePopoverSample",
            url: sUshellTestRootPath + "/demoapps/ValidateUrlMessagePopoverSample"
        },
        "sap.ushell.demo.bookmarkstate"  : {
            ui5ComponentName: "sap.ushell.demo.bookmarkstate",
            url: sUshellTestRootPath + "/demoapps/BookmarkAndStateApp"
        },
        "sap.ushell.demo.EventDelegationDemoApp"  : {
            ui5ComponentName: "sap.ushell.demo.EventDelegationDemoApp",
            url: sUshellTestRootPath + "/demoapps/EventDelegationDemoApp"
        }
    };

    function appInfoAdapter () {

        this.getAppInfo = function (sAppId) {
            var oDeferred = new jQuery.Deferred();

            if (applications[sAppId] !== undefined) {
                oDeferred.resolve(applications[sAppId]);
            } else {
                oDeferred.reject("error - application not found");
            }
            return oDeferred.promise();
        };
    }

    return new appInfoAdapter();

}, false);
