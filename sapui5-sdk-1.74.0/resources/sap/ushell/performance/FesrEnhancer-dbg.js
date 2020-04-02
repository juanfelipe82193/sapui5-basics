// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The FESR Enhancer attaches to the Front End Sub-Records tracker by UI5. UI5 tracks rendering and request activities
 * and tries to detect what happens. The ushell FESR Enhancer has then the possibility to overwrite and enhance the result with
 * FLP specific information.
 *
 * @private
 * */

sap.ui.define([
    "sap/ui/performance/trace/FESR",
    "sap/ushell/EventHub",
    "sap/base/Log",
    "sap/ushell/performance/ShellAnalytics"
], function (FrontendSubRecords, EventHub, Ui5Log, ShellAnalytics) {
    "use strict";

    var SCENARIOS = {
            HOME_INITIAL: "FLP@LOAD",
            FINDER_INITIAL: "FLP@LOAD_FINDER",
            APP_INITIAL: "FLP@DEEP_LINK",
            NAVIGATION: "NAVIGATION"
        };

    var oFesrEnhancer = {
        _fnOriginalOnBeforeCreated: null,
        _lastTrackedRecord: null,

        /**
         * Initializes the enhancer. This includes attaching to sap/ui/performance/trace/FESR#onBeforeCreated and enable ShellAnalytics
         *
         * @private
         */
        init: function () {
            if (FrontendSubRecords.getActive()) {
                ShellAnalytics.enable();
                this._fnOriginalOnBeforeCreated = FrontendSubRecords.onBeforeCreated;
                FrontendSubRecords.onBeforeCreated = this._onBeforeCreatedHandler.bind(this);
            }
        },

        /**
         * Resets the enhancer and detaches form sap/ui/performance/trace/FESR and ushell specific events.
         *
         * @private
         */
        reset: function () {
            FrontendSubRecords.onBeforeCreated = this._fnOriginalOnBeforeCreated;
            ShellAnalytics.disable();
            this._setLastTrackedRecord(null);
        },

        /**
         * Gets performance entries for a given event
         * @param {string} sEventName The name of the event
         * @returns {array} aPerformanceEntries The array that contains the
         *                  performance entries
         */
        _getPerformanceEntries: function (sEventName) {
            return performance.getEntriesByName(sEventName);
        },
        /**
         * Gets the Id of the last tracked application
         * @returns {string} id ID of the application
         */
        _getLastTrackedApplicationId: function () {
            var oCurrentApplication = ShellAnalytics.getCurrentApplication();
            if (oCurrentApplication) {
                return oCurrentApplication.id;
            }
            return null;
        },

        /**
         * Gets the last tracked record
         * @returns {object} oLastTrackedRecord The last tracked record
         */
        _getLastTrackedRecord: function () {
            return this._lastTrackedRecord;
        },

        /**
         * Set the last tracked record
         * @param {object} oNewRecord New Statistical record which was tracked
         */
        _setLastTrackedRecord: function (oNewRecord) {
            this._lastTrackedRecord = oNewRecord;
        },

        /**
         * Hook for sap/ui/performance/trace/FESR#onBeforeCreated which enhances the oUi5FesrHandle with FLP-specific information.
         * The handler will try to detect selected scenarios like initial Homepage start or direct app start, all other scenarios are
         * ignored.
         *
         * @param {object} oUi5FesrHandle The header information that can be modified
         * @param {string} oUi5FesrHandle.stepName The step name with <Trigger>_<Event>
         * @param {string} oUi5FesrHandle.appNameLong The application name with max 70 chars
         * @param {string} oUi5FesrHandle.appNameShort The application name with max 20 chars
         * @param {integer} oUi5FesrHandle.timeToInteractive The detected end-to-end time of the step
         * @param {object} oUi5Interaction The corresponding interaction object, read-only
         *
         * @returns {object} Modified header information
         *
         * @private
         */
        _onBeforeCreatedHandler: function (oUi5FesrHandle, oUi5Interaction) {
            var oDetectedScenario = this._detectScenario(oUi5FesrHandle, oUi5Interaction),
                sApplicationId = this._getLastTrackedApplicationId();

            if (sApplicationId) {
                // Add the latest remembered Fiori ID to every record until a different Fiori ID is set. This is needed to
                // relate interactions tracked afterwards to the started app.
                // Limitiation:
                // The Fiori IDs are also added to not related interactions like FLP button clicks or shell plugin interactions.
                // Still this is considered by S/4 and UI5 to be more helpful then not adding it anywhere.
                oUi5FesrHandle.appNameShort = sApplicationId;
            }

            if (!oDetectedScenario.scenario) {
                // unknown scenarios cannot be enhanced
                return oUi5FesrHandle;
            }

            return this._enhanceRecord(oDetectedScenario.scenario, {
                stepName: oUi5FesrHandle.stepName,
                appNameLong: oUi5FesrHandle.appNameLong,
                appNameShort: oUi5FesrHandle.appNameShort,
                timeToInteractive: oUi5FesrHandle.timeToInteractive
            }, oDetectedScenario.relatedEvent);
        },

        /**
         * Tries to detect the current scenario based on the given information.
         *
         * @param {object} oUi5FesrHandle The FESR header information
         * @param {object} oUi5Interaction The corresponding interaction object
         *
         * @returns {object} Returns an object which has at least a scenario property. This property may be null if the scenario is unknown.
         *                   There may also be a relatedEvent property if an event was used in order to detect the scenario.
         *
         * @private
         */
        _detectScenario: function (oUi5FesrHandle, oUi5Interaction) {

            function createResultObject (sScenario, oEvent) {
                var oResult = {
                    scenario: sScenario
                };

                if (oEvent) {
                    oResult.relatedEvent = oEvent;
                }

                return oResult;
            }

            if (oUi5FesrHandle.stepName === "undetermined_startup") {
                this._setLastTrackedRecord(ShellAnalytics.getLastClosedRecord());
                switch (oUi5FesrHandle.appNameLong) {
                    case "sap.ushell.components.homepage":
                        return createResultObject(SCENARIOS.HOME_INITIAL);
                    case "sap.ushell.components.appfinder":
                        return createResultObject(SCENARIOS.FINDER_INITIAL);
                    default: break;
                }

                //Application direct start
                return createResultObject(SCENARIOS.APP_INITIAL);
            }

            var oLastTrackedRecord = this._getLastTrackedRecord(),
                aNavigationRecords = ShellAnalytics.getNextNavigationRecords(oLastTrackedRecord);
            if (aNavigationRecords.length === 1) {
                var oNavigationRecord = aNavigationRecords[0];
                //We consider that if there was navigation the saved navigation and new navigation has different time
                if ((oNavigationRecord && oLastTrackedRecord && !oNavigationRecord.isEqual(oLastTrackedRecord))
                    || (!oLastTrackedRecord && oNavigationRecord)) {
                    this._setLastTrackedRecord(oNavigationRecord);
                    return createResultObject(SCENARIOS.NAVIGATION, oNavigationRecord);
                }
            } else if (aNavigationRecords.length > 1) {
                this._setLastTrackedRecord(aNavigationRecords.pop());
                return createResultObject(SCENARIOS.NAVIGATION, aNavigationRecords[0]);
            }


            // no scenario detected
            return createResultObject(null);
        },

        /**
         * Takes the given FESR information oIntermediateResult and returns an enhanced version using the given information
         *
         * @param {string} sDetectedScenario The detected scenario which is the basis for the enhancement. See SCENARIOS
         * @param {object} oIntermediateResult The header information that can be modified
         * @param {string} oIntermediateResult.stepName The step name with <Trigger>_<Event>
         * @param {string} oIntermediateResult.appNameLong The application name with max 70 chars
         * @param {string} oIntermediateResult.appNameShort The application name with max 20 chars
         * @param {number} oIntermediateResult.timeToInteractive The detected end-to-end time of the step
         * @param {object} oRelatedEvent Event from _trackedEvents array which was used to detect the scenario.
         *
         * @returns {object} enhanced oIntermediateResult
         *
         * @private
         */
        _enhanceRecord: function (sDetectedScenario, oIntermediateResult, oRelatedEvent) {
            switch (sDetectedScenario) {
                case SCENARIOS.HOME_INITIAL:
                    return this._enhanceInitialStart(oIntermediateResult, sDetectedScenario, "FLP-TTI-Homepage");
                case SCENARIOS.FINDER_INITIAL:
                    return this._enhanceInitialStart(oIntermediateResult, sDetectedScenario, "FLP-TTI-AppFinder");
                case SCENARIOS.APP_INITIAL:
                    return this._enhanceInitialAppStart(oIntermediateResult, sDetectedScenario, /* no performance mark*/ null);
                case SCENARIOS.NAVIGATION:
                    return this._enhanceNavigationRecord(oIntermediateResult, oRelatedEvent);
                default:
                    break;
            }

            // unknown scenario
            Ui5Log.warning("Unknown scenario at the end of execution, unnecessary code executed",
                null, "sap.ushell.performance.FesrEnhancer");
            return oIntermediateResult;
        },

        /**
         * Takes the given FESR information oIntermediateResult and returns an enhanced version using the given information
         * for scenario initial start
         * @param {objec} oIntermediateResult Result that is enhanced
         * @param {string} sStepName Name of Step
         * @param {string} sPerformanceMarkName Name of performance mark
         */

        _enhanceInitialStart: function (oIntermediateResult, sStepName, sPerformanceMarkName) {
            var oMark,
                oEnhancedFesrHandle = { // without performance mark this is already very helpful for analysis
                    stepName: sStepName,
                    appNameLong: oIntermediateResult.appNameLong,
                    appNameShort: "",
                    timeToInteractive: oIntermediateResult.timeToInteractive
                };

            if (sPerformanceMarkName) {
                // if available also add the exact Time To Interactive
                oMark = this._getPerformanceEntries(sPerformanceMarkName)[0];
                if (oMark) {
                    // in case of initial start, the startTime is most accurate
                    oEnhancedFesrHandle.timeToInteractive = oMark.startTime;
                    return oEnhancedFesrHandle;
                }

                Ui5Log.warning("Scenario '" + sStepName + "' detected but expected performance mark '" +
                    sPerformanceMarkName + "' does not exist",
                    null, "sap.ushell.performance.FesrEnhancer"
                );
            }

            return oEnhancedFesrHandle;
        },

        /**
         * Takes the given FESR information oIntermediateResult and related record and returns an enhanced version
         * using the given information for scenario navigation
         * @param {object} oIntermediateResult Intermediate result
         * @param {object} oRelatedRecord Related record
         *
         * @returns {object} Adjusted FESR record
         */
        _enhanceNavigationRecord: function (oIntermediateResult, oRelatedRecord) {
            var oEnhancedFesrHandle = {
                    stepName: oRelatedRecord.step || oIntermediateResult.stepName,
                    appNameLong: oIntermediateResult.appNameLong,
                    appNameShort: oRelatedRecord.targetApplication || "",
                    timeToInteractive: oIntermediateResult.timeToInteractive
                };
            if (oEnhancedFesrHandle.stepName === "FLP@LOAD") {
                var oMark = this._getPerformanceEntries("FLP-TTI-Homepage")[0];
                if (oMark) {
                    if (oMark.startTime > oRelatedRecord.getTimeStart()) {
                        oEnhancedFesrHandle.timeToInteractive = oMark.startTime - oRelatedRecord.getTimeStart();
                    }
                }
            }
            return oEnhancedFesrHandle;
        },

        /**
         * Takes the given FESR information oIntermediateResult and returns an enhanced version using the given information
         * for scenario initial app start
         * @param {object} oIntermediateResult Intermediate result
         * @param {string} sStepName Name of the step
         * @param {string } sPerformanceMarkName Name of the performance mark
         *
         * @returns {object} Adjusted FESR record
         */
        _enhanceInitialAppStart: function (oIntermediateResult, sStepName, sPerformanceMarkName) {
            var oEnhancedFesrHandle = this._enhanceInitialStart(oIntermediateResult, sStepName, sPerformanceMarkName);
            oEnhancedFesrHandle.appNameShort = oIntermediateResult.appNameShort;

            return oEnhancedFesrHandle;
        }

    };

    return oFesrEnhancer;

}, /* bExport= */ true);

