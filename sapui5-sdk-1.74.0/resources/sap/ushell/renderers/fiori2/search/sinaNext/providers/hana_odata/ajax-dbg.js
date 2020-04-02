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
            return core.Promise.reject(new module.Exception({
                message: JSON.parse(error.responseText).error.details,
                description: 'Error by hana odata ajax call',
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

    module.createAjaxClient = function () {
        var client = new ajax.Client({
            csrf: false
            //csrfByPassCache: true
        });
        client.postJson = addErrorHandlingDecorator(client.postJson);
        client.getJson = addErrorHandlingDecorator(client.getJson);
        client.mergeJson = addErrorHandlingDecorator(client.mergeJson);
        return client;
    };

    return module;

});
