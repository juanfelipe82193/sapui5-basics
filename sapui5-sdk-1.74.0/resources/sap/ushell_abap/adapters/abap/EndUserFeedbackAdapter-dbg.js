// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The end user feedback adapter for the ABAP platform.
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ui2/srvc/ODataWrapper",
    "sap/ui2/srvc/ODataService",
    "sap/ui/thirdparty/jquery"
], function (ODataWrapper, ODataService, jQuery) {
    "use strict";

    return function (oSystem) {
        var oDataWrapperSettings = {
            baseUrl: "/sap/opu/odata/UI2/INTEROP/",
            "sap-language": sap.ushell.Container.getUser().getLanguage(),
            "sap-client": sap.ushell.Container.getLogonSystem().getClient()
        };
        var oODataWrapper = sap.ui2.srvc.createODataWrapper(oDataWrapperSettings),
            bLegalTextAlreadyCalled = false,
            sLegalText = "";
        /**
         * Sends a end user feedback to the backend system
         *
         * @param {JSON} JSON object containing the input fields required for
         *      the end user feedback.
         *
         * @class The Unified Shell's end user feedback adapter for the ABAP platform.
         *
         * @since 1.25.1
         * @private
         */
        this.sendFeedback = function (oEndUserFeedbackData) {
            var oDeferred,
                sRelativeUrl = "FeedbackHeaders",
                oEndUserFeedbackDataODataCreateObject = {
                    isAnonymous: oEndUserFeedbackData.isAnonymous,
                    feedbackText: oEndUserFeedbackData.feedbackText,
                    applicationType: oEndUserFeedbackData.applicationType || "<undefined>",
                    additionalInformation: oEndUserFeedbackData.additionalInformation,
                    url: oEndUserFeedbackData.url,
                    navigationIntent: oEndUserFeedbackData.navigationIntent,
                    formFactor: oEndUserFeedbackData.formFactor,
                    eMail: oEndUserFeedbackData.eMail,
                    userId: oEndUserFeedbackData.userId,
                    Ratings: oEndUserFeedbackData.ratings
                };

            oDeferred = new jQuery.Deferred();
            sap.ui2.srvc.ODataService.call(this, oODataWrapper, function () {
                return false;
            });

            oODataWrapper.create(sRelativeUrl, oEndUserFeedbackDataODataCreateObject, function (response) {
                oDeferred.resolve(response.feedbackCount);
            }, function (sErrorMessage) {
                oDeferred.reject(sErrorMessage);
            });

            return oDeferred.promise();
        };

        /**
         * Receives the legal text for the feedback dialog box
         * @returns promise with the legal text
         *
         * @public
         * @since 1.25.1
         */
        this.getLegalText = function () {
            var oDeferred,
                sRelativeUrl = "FeedbackLegalTexts('1')";

            oDeferred = new jQuery.Deferred();
            if (bLegalTextAlreadyCalled) {
                sap.ui2.srvc.call(function (response) {
                    oDeferred.resolve(sLegalText);
                });
                return oDeferred.promise();
            }

            sap.ui2.srvc.ODataService.call(this, oODataWrapper, function () {
                return false;
            });

            oODataWrapper.read(sRelativeUrl, function (response) {
                sLegalText = response.legalText;
                bLegalTextAlreadyCalled = true;
                oDeferred.resolve(response.legalText);
            }, function (sErrorMessage) {
                oDeferred.reject(sErrorMessage);
            });

            return oDeferred.promise();
        };

        /**
         * Checks if the service is enabled.
         * <p>
         * The service is only enabled if getLegalText can be invoked and returns a valid response
         *
         * @return {object} promise,
         *
         * @public
         * @since 1.25.1
         */
        this.isEnabled = function () {
            var oDeferred = new jQuery.Deferred(),
                oLegalTextPromise = this.getLegalText();
            oLegalTextPromise.done(function (sLegalText) {
                if (sLegalText) {
                    oDeferred.resolve();
                } else {
                    oDeferred.reject();
                }
            });
            oLegalTextPromise.fail(function (sErrorText) {
                oDeferred.reject();
            });
            return oDeferred.promise();
        };
    };
}, true /* bExport */);