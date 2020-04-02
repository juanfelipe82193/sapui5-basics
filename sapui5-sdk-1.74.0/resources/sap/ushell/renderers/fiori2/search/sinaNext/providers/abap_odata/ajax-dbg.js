// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../core/ajax'], function (core, ajax) {
    "use strict";

    var module = {};

    module.Exception = core.Exception.derive({
        _init: function (properties) {
            core.Exception.prototype._init.apply(this, [properties]);
        }
    });

    var parseError = function (error) {
        try {

            var parsedError = JSON.parse(error.responseText);

            var message = [];
            if (parsedError && parsedError.error && parsedError.error.code) {
                message.push(parsedError.error.code);
            }
            if (parsedError && parsedError.error && parsedError.error.message && parsedError.error.message.value) {
                message.push(parsedError.error.message.value);
            }
            if (message.length === 0) {
                return core.Promise.reject(error);
            }

            return core.Promise.reject(new module.Exception({
                message: message.join('\n'),
                previous: error
            }));

        } catch (e) {
            return core.Promise.reject(error);
        }
    };

    var addErrorHandlingDecorator = function (originalFunction) {
        return function () {
            return originalFunction.apply(this, arguments).then(function (response) {
                return response; // just forward success response
            }, function (error) {
                if (!(error instanceof ajax.Exception)) {
                    return core.Promise.reject(error); // just forward error response
                }
                return parseError(error);
            });
        };
    };

    var _removeActAsQueryPart = function (node) {
        if (node.SubFilters !== undefined) { // not a leaf
            delete node.ActAsQueryPart;
            for (var i = 0; i < node.SubFilters.length; i++) {
                _removeActAsQueryPart(node.SubFilters[i]);
            }
        }
    };

    module.createAjaxClient = function () {
        var client = new ajax.Client({
            csrf: true,
            requestNormalization: function (payload) {
                if (payload === null) {
                    return {};
                }
                if (payload.Events !== undefined) {
                    return {
                        "NotToRecord": true
                    };
                }
                delete payload.SessionID;
                delete payload.SessionTimestamp;
                if (payload.d && payload.d.QueryOptions) {
                    delete payload.d.QueryOptions.ClientSessionID;
                    delete payload.d.QueryOptions.ClientCallTimestamp;
                    delete payload.d.QueryOptions.ClientServiceName;
                    delete payload.d.QueryOptions.ClientLastExecutionID;
                }
                if (payload.d) {
                    // insert "ExcludedDataSources" in payload
                    // properties' ordering is important in stringified payload
                    // "ExcludedDataSources" should follow "DataSources"
                    // find "DataSources":[...], and insert "ExcludedDataSources" after
                    var payloadString = JSON.stringify(payload); // object -> string
                    var headString = '"DataSources":[';
                    var endString = ']';
                    var headIndex = payloadString.indexOf(headString);
                    var endIndex = headIndex + payloadString.substring(headIndex).indexOf(endString) + endString.length;
                    var insertedString = ',"ExcludedDataSources":[]';
                    payloadString = [payloadString.slice(0, endIndex), insertedString, payloadString.slice(endIndex)].join('');
                    payload = JSON.parse(payloadString); // string -> object
                }
                if (payload.d.Filter) {
                    _removeActAsQueryPart(payload.d.Filter);
                }

                return payload;
            }
            //csrfByPassCache: true
        });
        client.postJson = addErrorHandlingDecorator(client.postJson);
        client.getJson = addErrorHandlingDecorator(client.getJson);
        client.mergeJson = addErrorHandlingDecorator(client.mergeJson);
        return client;
    };

    return module;

});
