// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview This file contains a sample Fiori sandbox application configuration.
 *
 * The Sandbox shell attempts to load three files in the following order:
 *   ./fioriSandboxConfig.js
 *   /ushell/staging/shells/sandbox/fioriSandboxConfig.json
 *   /appconfig/fioriSandboxConfig.json
 *
 * Entries in the latter ( lower ) files may be used to override settings from the first file
 */
this.sap = this.sap || {};
(function () {
    "use strict";

    // namespace "sap.ushell.fiorisandbox"

    sap.ushell = sap.ushell || {};
    sap.ushell.fiorisandbox = sap.ushell.fiorisandbox || {};

    // default configuration
    // can be extended or overridden by a local JSON configuration file which has to be exposed by the server on path /appconfig/fioriSandboxConfig.json
    sap.ushell.fiorisandbox.configuration = {
        applications: {
            // for your applications, better use absolute pathes to the url to test it! ( e.g. /ushell/ )

            // we use relative pathes to be able to run the application on a central server

            // map of applications keyed by URL fragment used for navigation

            // default application - empty URL hash
            "": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
            },

            // default application as explicit navigation target
            "Action-todefaultapp": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp",
                description: "Default App : shows statically registered apps (fioriSandboxConfig.js) "
            },

            /*
             * Demonstrates resource-based navigation inside a shell runtime with a simple inner-app routing sample using explicit event handlers
             * Run e.g. as:
             *   http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail
             *   http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1
             */
            "Action-toappnavsample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                // absolute would be: url:
                // "/ushell/test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                description: "Navigation Sample 1: demo for startup parameter passing and routing with event handlers"
            },

            "Action-toappnavsampleParam": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                // absolute would be: url:
                // "/ushell/test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                description: "Navigation Sample 1: demo for startup parameter passing and routing with event handlers"
            },

            /*
             * Demonstrates resource-based navigation inside a shell runtime with an advanced inner-app routing sample using framework-based view creation
             * Run e.g. as:
             *   http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/Detail
             *   http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/View1
             */
            "Action-toappnavsample2": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample2",
                description: "Navigation Sample 2: demo for declarative routing"
            },

            /*
             * Sample app for app context service
             */
            "Action-toappstatesample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppStateSample",
                description: "ApplicationState Sample: demo for AppState"
            },

            /*
             * Sample app for app context service
             */
            "Action-toappstateformsample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppStateFormSample",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppStateFormSample",
                description: "ApplicationState Sample: Application State (Form, Undo)"
            },

            /*
             * Sample app for personalization service
             */
            "Action-toappperssample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppPersSample",
                description: "Personalization Sample 1: demo for generic personalization service"
            },

            /*
             * Sample app for table personalization
             */
            "Action-toappperssample2": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample2",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppPersSample2",
                description: "Personalization Sample 2: demo for personalization of tables"
            },

            /*
             * Sample app for personalization with variants
             */
            "Action-toappperssample3": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample3",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppPersSample3",
                description: "Personalization Sample 3: demo for personalization with variants"
            },

            /*
             * Sample app for app context service
             */
            "Action-toappcontextsample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppContextSample",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppContextSample",
                description: "Personalization Sample 4: demo for AppContext (application state and cross app parameter passing)"
            },

            /*
             * Sample/support app for personalization service API test
             */
            "Action-toperssrvtest": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.PersSrvTest",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/PersSrvTest",
                description: "Personalization Service Test: create, load and save personalization containers"
            },

            /*
             * Sample/support app for personalization service API test
             */
            "Action-toperssrv2test": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.PersSrv2Test",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/PersSrv2Test",
                description: "Personalization Service Test: OData model create, load and save personalization containers"
            },

            "UI2Fiori2SampleApps-appscfltest": {
                additionalInformation: "SAPUI5.Component=AppScflTest",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppScflTest",
                description: "Scaffolding: demo app based on sap.ca scaffolding layer"
            },

            "Action-bookmark": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.bookmark",
                applicationType: "URL",
                url: "../../../../../test-resources/sap/ushell/demoapps/BookmarkSample",
                description: "Bookmark Sample"
            }
        }
    };

    function ConfigReader (oDefaultConfig) {
        this.oConfig = oDefaultConfig;
    }

    ConfigReader.prototype.read = function (sUrlPrefix) {
        // try with JSON - fallback to script, if not found
        if (this.readJSON(sUrlPrefix) === false) {
            this.readScript(sUrlPrefix);
        }
    };

    ConfigReader.prototype.readJSON = function (sUrlPrefix) {
        var sUrl = jQuery.sap.endsWithIgnoreCase(sUrlPrefix, ".json") ? sUrlPrefix : sUrlPrefix + ".json",
            oConfigJSON,
            oXHRResponse;

        jQuery.sap.log.info("Mixing/Overwriting sandbox configuration from " + sUrl + "; failed requests (status 404) can be ignored, default configuration is used then.");
        oXHRResponse = jQuery.sap.sjax({
            url: sUrl,
            dataType: "json"
        });
        if (oXHRResponse.success) {
            oConfigJSON = oXHRResponse.data;
            jQuery.sap.log.debug("Evaluating fiori launchpad sandbox config JSON: " + JSON.stringify(oConfigJSON));
            this.addConfig(oConfigJSON);

            return true;
        }
        // error case
        if (oXHRResponse.statusCode !== 404) {
            jQuery.sap.log.error("Failed to load Fiori Launchpad Sandbox configuration from " + sUrl + ": status: " + oXHRResponse.status + "; error: " + oXHRResponse.error);
        }
        return false;
    };

    ConfigReader.prototype.readScript = function (sUrlPrefix) {
        var sUrl = sUrlPrefix + ".js",
            sConfigScript,
            oXHRResponse;

        jQuery.sap.log.info("Mixing/Overwriting sandbox configuration from " + sUrl + "; failed requests (status 404) can be ignored, default configuration is used then.");
        oXHRResponse = jQuery.sap.sjax({
            url: sUrl,
            dataType: "script"
        });
        if (oXHRResponse.success) {
            sConfigScript = oXHRResponse.data;
            jQuery.sap.log.debug("Loaded fiori launchpad sandbox config script: " + sConfigScript);

            // script already executed by sjax call (using dataType script)
            // should have created new instance of sap.ushell.fiorisandbox.configuration
            if (sap.ushell.fiorisandbox.configuration) {
                jQuery.sap.log.warning(
                    "Fiori Launchpad configuration file '"
                    + sUrl
                    + "' is deprecated. Please use file '"
                    + sUrlPrefix
                    + ".json' with the following contents: \n"
                    + JSON.stringify(sap.ushell.fiorisandbox.configuration, null, 4)
                );
            }

            this.addConfig(sap.ushell.fiorisandbox.configuration);

            return true;
        }
        // error case
        if (oXHRResponse.statusCode !== 404) {
            jQuery.sap.log.error("Failed to load Fiori Launchpad Sandbox configuration from " + sUrl + ": status: " + oXHRResponse.status + "; error: " + oXHRResponse.error);
        }
        return false;
    };

    ConfigReader.prototype.addConfig = function (oNewConfig) {
        var application;
        for (application in oNewConfig.applications) {
            this.oConfig.applications[application] = oNewConfig.applications[application];
        }
    };

    ConfigReader.prototype.getMergedConfig = function () {
        // do we have to sort?
        return this.oConfig;
    };

    sap.ushell.fiorisandbox.readSandboxConfig = function () {
        if (!jQuery && !jQuery.sap) {
            // no UI5 bootstrap yet!
            if (window.console) {
                window.console.log("Function sap.ushell.fiorisandbox.readSandboxConfig() must be called after the SAPUI5 bootstrap!");
            }

            return;
        }

        var configReader = new ConfigReader(sap.ushell.fiorisandbox.configuration),
            aConfigFiles = jQuery.sap.getUriParameters().get("sap-ushell-sandbox-config", true),
            i;

        // if one or more configuration files are specified explicitly via URL parameter,
        // we just read these (JSON only); otherwise, we use the fixed path /appconfig/fioriSandboxConfig
        if (aConfigFiles && aConfigFiles.length > 0) {
            for (i = 0; i < aConfigFiles.length; i = i + 1) {
                configReader.readJSON(aConfigFiles[i]);
            }
        } else {
            // try to read from local appconfig (default convention)
            configReader.read("/appconfig/fioriSandboxConfig");
        }

        sap.ushell.fiorisandbox.configuration = configReader.getMergedConfig();
    };
}());
