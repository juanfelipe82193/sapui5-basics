// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core'], function (core) {
    "use strict";

    return core.defineClass({

        initAsync: function () {},
        format: function (obj) {
            return obj;
        },
        formatAsync: function (obj) {
            obj = this.format(obj);
            return core.Promise.resolve(obj);
        }

    });

});
