// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['./core'], function (core) {
    "use strict";

    var Log = core.defineClass({

        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info',

        _init: function () {
            this.messages = [];
        },

        getMessages: function () {
            return this.messages;
        },

        addMessage: function (severity, text) {
            this.messages.push({
                severity: severity,
                text: text
            });
        }
    });

    return Log;

});
