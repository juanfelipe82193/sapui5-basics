// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../core/util', './ajaxTemplates'], function (core, util, ajaxTemplates) {
    "use strict";

    return core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;
            this.eventLoggingActive = false;
            this.clickCounterActive = false;
            this.delayedConsumer = new util.DelayedConsumer({
                timeDelay: 2000,
                consumer: this.processEvents,
                consumerContext: this
            });
        },

        delayedInit: function () {
            this.eventLoggingActive = this.provider.supports('SearchInteractionLogging', 'SearchInteractionLogging');
            this.clickCounterActive = this.provider.supports('PersonalizedSearch');
        },

        logUserEvent: function (event) {

            event.timeStamp = util.generateTimestamp();

            // regular interaction logging
            if (this.eventLoggingActive && event.type !== 'ITEM_NAVIGATE') {
                this.delayedConsumer.add(event);
            }

            // special for navigation: additional ina request for incrementing the click counter
            if (this.clickCounterActive && event.type === 'ITEM_NAVIGATE' && event.sourceUrlArray.length !== 0) {
                this.incrementClickCounter(event.sourceUrlArray, event.targetUrl, event.systemAndClient);
            }
        },

        processEvents: function (events) {
            var request = {
                SearchInteractionLogging: {
                    SessionID: this.provider.sessionId,
                    EventList: []
                }
            };
            for (var i = 0; i < events.length; ++i) {
                var event = events[i];
                var inaEvent = {
                    Type: event.type,
                    Timestamp: event.timeStamp,
                    ParameterList: []
                };
                for (var name in event) {
                    if (name === 'type' || name === 'timeStamp') {
                        continue;
                    }
                    var value = event[name];
                    inaEvent.ParameterList.push({
                        Name: name,
                        Value: value
                    });
                }
                request.SearchInteractionLogging.EventList.push(inaEvent);
            }
            return this.provider.ajaxClient.postJson(this.provider.getResponseUrl, request);
        },

        incrementClickCounter: function (sourceUrlArray, targetUrl, systemAndClient) {

            if (!targetUrl) {
                return undefined;
            }
            if (targetUrl.indexOf("#") === -1) {
                return undefined;
            }
            if (!this.provider.supports("PersonalizedSearch", "SetUserStatus")) {
                return undefined;
            }

            var getSemanticObjectType = function (sHash) {
                return sHash.split("-")[0];
            };

            var getIntent = function (sHash) {
                return sHash.split("-")[1].split("&")[0];
            };

            var getParameterList = function (aParameter) {
                var parameterList = aParameter;
                var inaParameterList = [];
                for (var i = 0, len = parameterList.length; i < len; i++) {
                    var param = parameterList[i];
                    if (param.indexOf("sap-system") !== -1) {
                        continue;
                    }
                    var name = param.split("=")[0];
                    var value = param.split("=")[1];
                    inaParameterList.push({
                        Name: name,
                        Value: value
                    });
                }
                return inaParameterList;
            };


            var NavigationEventList = ajaxTemplates.incrementClickCounterRequest.SearchConfiguration.ClientEvent.NavigationEventList;

            // source application
            var hashAsArray = sourceUrlArray;
            var semanticObjectType = getSemanticObjectType(hashAsArray[0]);
            NavigationEventList[0].SourceApplication.SemanticObjectType = semanticObjectType;
            var intent = getIntent(hashAsArray[0]);
            NavigationEventList[0].SourceApplication.Intent = intent;
            var sourceParameterList = hashAsArray[1] !== undefined ? getParameterList(hashAsArray[1].split("&")) : [];
            NavigationEventList[0].SourceApplication.ParameterList = sourceParameterList;

            // target application
            hashAsArray = targetUrl.split("?");
            var targetSemanticObjectType = getSemanticObjectType(hashAsArray[0]).split("#")[1];
            NavigationEventList[1].TargetApplication.SemanticObjectType = targetSemanticObjectType;
            var targetIntent = getIntent(hashAsArray[0]);
            NavigationEventList[1].TargetApplication.Intent = targetIntent;
            var targetParameterList = hashAsArray[1] !== undefined ? getParameterList(hashAsArray[1].split("&")) : [];
            NavigationEventList[1].TargetApplication.ParameterList = targetParameterList;
            var oSystemAndClient = {
                "System": systemAndClient.systemId,
                "Client": systemAndClient.client
            };
            delete NavigationEventList[1].TargetApplication.System;
            delete NavigationEventList[1].TargetApplication.Client;
            NavigationEventList[1].TargetApplication = jQuery.extend(NavigationEventList[1].TargetApplication, oSystemAndClient);

            return this.provider.ajaxClient.postJson(this.provider.getResponseUrl, ajaxTemplates.incrementClickCounterRequest);
        }

    });

});
