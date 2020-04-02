// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../core/util', './ajaxTemplates'], function (core, util, ajaxTemplates) {
    "use strict";

    return core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;

            this.delayedConsumer = new util.DelayedConsumer({
                timeDelay: 2000,
                consumer: this.processEvents,
                consumerContext: this
            });
        },

        logUserEvent: function (event) {
            event.timeStamp = new Date().getTime();
            if (event.type !== 'ITEM_NAVIGATE') {
                this.delayedConsumer.add(event);
            }
            if (event.type === 'ITEM_NAVIGATE' && event.sourceUrlArray.length !== 0) {
                this.incrementClickCounter(event.targetUrl, event.systemAndClient);
            }
        },

        processEvents: function (events) {
            var that = this;
            var request = {
                ID: 1,
                SessionID: this.provider.sessionId,
                Events: []
            };

            for (var i = 0; i < events.length; ++i) {
                var event = events[i];

                //                var year = event.timeStamp.substring(0, 4);
                //                var month = event.timeStamp.substring(4, 6);
                //                month = ("0" + (parseInt(month) - 1).toString()).slice(-2);
                //                // month minus 1, convert to 2-digit string leading with 0
                //                var day = event.timeStamp.substring(6, 8);
                //                var hours = event.timeStamp.substring(8, 10);
                //                var minutes = event.timeStamp.substring(10, 12);
                //                var seconds = event.timeStamp.substring(12, 14);
                //                var milliseconds = event.timeStamp.substring(14, 17);
                //                var oDataTimeStemp = Math.round(+new Date(year, month, day, hours, minutes, seconds, milliseconds))+i;
                var timeStampString = "\\/Date(" + event.timeStamp + ")\\/";

                var odataEvent = {
                    ID: i + 1,
                    Type: event.type,
                    Timestamp: timeStampString,
                    //frank
                    ExecutionID: event.executionId,
                    Parameters: []
                };
                for (var name in event) {
                    if (name === 'type' || name === 'timeStamp') {
                        continue;
                    }
                    var value = event[name];
                    if (typeof value === 'undefined') {
                        continue;
                    }
                    if (typeof value !== 'object') {
                        value = value.toString();
                    } else {
                        value = JSON.stringify(value);
                    }
                    odataEvent.Parameters.push({
                        Name: name,
                        Value: value
                    });
                }
                request.Events.push(odataEvent);
            }

            var requestUrl = that.provider.buildQueryUrl(that.provider.requestPrefix, "/InteractionEventLists");
            return that.provider.ajaxClient.postJson(requestUrl, request);
        },


        incrementClickCounter: function (targetUrl, systemAndClient) {

            //targetUrl: #EPMPurchaseOrder-displayFactSheet?PurchaseOrderInternalId=3440B5B014B21EE798DDB43D63E56068
            if (!targetUrl) {
                return undefined;
            }
            if (targetUrl.indexOf("#") === -1) {
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
                var eventParameters = [];
                for (var i = 0, len = parameterList.length; i < len; i++) {
                    var param = parameterList[i];
                    if (param.indexOf("sap-system") !== -1) {
                        continue;
                    }
                    var name = param.split("=")[0];
                    var value = param.split("=")[1];
                    eventParameters.push({
                        Name: name,
                        Value: value
                    });
                }
                return eventParameters;
            };


            var that = this;
            var hashAsArray = targetUrl.split("?");
            var targetSemanticObjectType = getSemanticObjectType(hashAsArray[0]).split("#")[1];
            var targetIntent = getIntent(hashAsArray[0]);
            var targetParameterList = hashAsArray[1] !== undefined ? getParameterList(hashAsArray[1].split("&")) : [];
            var requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.navigationEvent));

            requestTemplate.SemanticObjectType = targetSemanticObjectType;
            requestTemplate.Intent = targetIntent;
            //frank
            if (systemAndClient.systemId.length === 0 || systemAndClient.client.length === 0) {
                delete requestTemplate.System;
                delete requestTemplate.Client;
            } else {
                requestTemplate.System = systemAndClient.systemId;
                requestTemplate.Client = systemAndClient.client;
            }

            requestTemplate.Parameters = targetParameterList;

            var requestUrl = that.provider.buildQueryUrl(that.provider.requestPrefix, "/NavigationEvents");
            return that.provider.ajaxClient.postJson(requestUrl, requestTemplate);

        }

    });

});
