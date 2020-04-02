// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap, window */

sap.ui.define(['sap/ushell/renderers/fiori2/search/eventlogging/EventLogger'], function (EventLogger) {
    "use strict";

    return sap.ui.base.Object.extend("sap.ushell.renderers.fiori2.search.SearchNavigationObject", {

        constructor: function (params) {
            this._model = sap.ushell.renderers.fiori2.search.getModelSingleton();
            if (params) {
                this.setHref(params.href);
                this.setText(params.text);
                this.setTarget(params.target);
                this.setLoggingType(params.loggingType);
                this.setPositionInList(params.positionInList);
            }

            // work around for eventlogger initialization later than search
            if (this._model.eventLogger === undefined) {
                this._model.eventLogger = EventLogger.newInstance({
                    sinaNext: this._model.sinaNext
                });
            }

            if (typeof this._loggingType === 'undefined') {
                this.setLoggingType(this._model.eventLogger.RESULT_LIST_ITEM_NAVIGATE);
            }

        },

        getPositionInList: function () {
            return this._positionInList;
        },

        setPositionInList: function (positionInList) {
            this._positionInList = positionInList;
        },

        getHref: function () {
            return this._href;
        },

        setHref: function (href) {
            this._href = href;
        },

        getText: function () {
            return this._text;
        },

        setText: function (text) {
            this._text = text;
        },

        getTarget: function () {
            return this._target;
        },

        setTarget: function (target) {
            this._target = target;
        },

        getLoggingType: function () {
            return this._loggingType;
        },

        setLoggingType: function (loggingType) {
            this._loggingType = loggingType;
        },

        performNavigation: function (properties) {
            this.trackNavigation(properties);
            if (!this._target) {
                window.open(this._href);
            } else {
                window.open(this._href, this._target);
            }
        },

        trackNavigation: function (properties) {
            this._model.eventLogger.logEvent({
                type: (properties && properties.loggingType) || this.getLoggingType(),
                targetUrl: this.getHref(),
                positionInList: this.getPositionInList(),
                executionId: this.getResultSetId()
            });
        },

        getResultSetId: function () {
            return '';
        },

        isEqualTo: function (otherNavigationObject) {
            if (!otherNavigationObject) {
                return false;
            }
            return this.getHref() == otherNavigationObject.getHref();
        }
    });
});
