// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core'], function (core) {
    "use strict";

    return core.defineClass({
        id: 'dummy',
        _initAsync: function (properties) {
            return Promise.resolve();
        }
    });
});
