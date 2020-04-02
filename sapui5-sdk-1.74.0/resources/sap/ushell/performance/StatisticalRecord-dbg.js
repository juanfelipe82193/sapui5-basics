// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Class for statistical record
 *               It should contain data like step, duration after a navigation in the shell, can have status open.
 *
 * @version 1.74.0
 */
sap.ui.define([], function () {
    "use strict";

    var STATUS = {
        OPEN: "OPEN",
        CLOSED: "CLOSED",
        ERROR: "ERROR"
    };

    /**
     * Constructor for statistical record
     * @returns oStatisticalRecord The constructed statistical record.
     * @returns oStatisticalRecord.status The status, can be open or closed or error
     * @returns oStatisticalRecord.targetHash The target hash of the navigation
     * @returns oStatisticalRecord.trigger The trigger, like mouse click that initiated th action
     * @returns oStatisticalRecord.timeStart The start time or to be more precise timestamps returned by performance.now()
     * @returns oStatisticalRecord.timeEnd The end time or to be more precise timestamps returned by performance.now()
     * @returns oStatisticalRecord.duration The duration in milliseconds. Difference of the two timestamps above
     * @returns oStatisticalRecord.sourceApplication The source application
     * @returns oStatisticalRecord.targetApplication The target application
     * @returns oStatisticalRecord.navigationMode The navigation mode, can be in place or ex place
     * @returns oStatisticalRecord.step The navigation step, e.g. "FLP@LOAD"
     */
    function StatisticalRecord () {
        this.status = STATUS.OPEN;
        this.targetHash = null;
        this.trigger = null;

        this.timeStart = null;
        this.timeEnd = null;
        this.duration = null;

        this.step = null;

        this.sourceApplication = undefined;
        this.targetApplication = undefined;
        this.navigationMode = null;
    }

    /**
     * calculates step out of source and target application
     * @returns {string} sStep The navigation step
     */
    StatisticalRecord.prototype._calculateStep = function () {
        // if source and target application are not the homepage it is an app to app navigation.
        // if homepage is started the source application is undefined
        if (this.sourceApplication && this.sourceApplication !== "FLP_HOME"
                && this.targetApplication !== "FLP_HOME") {
            return "A2A@" + this.sourceApplication;
        }
        // back button or home button of FLP is used to navigate to or load the homepage
        if (this.targetApplication === "FLP_HOME") {
            return "FLP@LOAD";
        }
        //  if the source application is undefined, an application is started from the homepage
        if ( this.sourceApplication === "FLP_HOME") {
            return "FLP@HOMEPAGE_TILE";
        }
        if (this.sourceApplication === undefined && this.targetApplication && this.targetApplication !== "FLP_HOME") {
            return "FLP@DEEP_LINK";
        }
        return "";
    };

    /**
     * Compares two statistical records
     * @param {object} otherRecord The other record
     * @returns {boolean} isTrue Is true if other record has the same start time as the current record
     */
    StatisticalRecord.prototype.isEqual = function (otherRecord) {
        return this.timeStart === otherRecord.timeStart;
    };

    /**
     * Closes the record, computes the duration and stores it
     */
    StatisticalRecord.prototype.closeRecord = function () {
        this.step = this._calculateStep();
        this.status = STATUS.CLOSED;
        this.timeEnd = performance.now();
        if (this.timeStart) {
            this.duration = this.timeEnd - this.timeStart;
        }
    };
    /**
     * Closes the Record with status error
     */
    StatisticalRecord.prototype.closeRecordWithError = function () {
        this.status = STATUS.ERROR;
        this.timeEnd = performance.now();
        this.duration = this.timeEnd - this.timeStart;
    };

    /**
     * checks if record is closed
     * @returns {boolean} isTrue Is true if record is closed
     *
     */
    StatisticalRecord.prototype.isClosed = function () {
        return this.status === STATUS.CLOSED;
    };

    /**
     * Getter for step
     */
    StatisticalRecord.prototype.getStep = function () {
        return this.step;
    };

    /**
     * Setter for trigger
     */
    StatisticalRecord.prototype.setTrigger = function (sTrigger) {
        this.trigger = sTrigger;
    };

    /**
     * Setter for target hash
     */
    StatisticalRecord.prototype.setTargetHash = function (sTargetHash) {
        this.targetHash = sTargetHash;
    };

    /**
     * Setter for start time
     */
    StatisticalRecord.prototype.setTimeStart = function (timeStart) {
        this.timeStart = timeStart;
    };

    /**
     * Getter for start time
     */
    StatisticalRecord.prototype.getTimeStart = function () {
        return this.timeStart;
    };

    /**
     * Getter for end time
     */
    StatisticalRecord.prototype.getTimeEnd = function () {
        return this.timeEnd;
    };

    /**
     * Setter for source application
     */
    StatisticalRecord.prototype.setSourceApplication = function (sSourceApplicationId) {
        this.sourceApplication = sSourceApplicationId;
    };

    /**
     * Setter for target application
     */
    StatisticalRecord.prototype.setTargetApplication = function (sTargetApplicationId) {
        this.targetApplication = sTargetApplicationId;
    };

    /**
     * Setter for navigation mode
     */
    StatisticalRecord.prototype.setNavigationMode = function (navigationMode) {
        this.navigationMode = navigationMode;
    };

    return StatisticalRecord;

}, /* bExport= */ false);
