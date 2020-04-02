// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './Configurator'], function (core, Configurator) {
    "use strict";

    return Configurator.derive({
        initAsync: function () {
            if (core.isObject(this.configuration)) {
                this.customFunction = this.configuration.func;
                this.force = this.configuration.force;
                return;
            }
            this.customFunction = this.configuration;
            this.force = false;
        },
        isSuitable: function (options) {
            if (core.isFunction(options.configuration)) {
                return true;
            }
            if (core.isObject(options.configuration) && options.configuration.hasOwnProperty('func')) {
                return true;
            }
        },
        configure: function (value, ctx) {
            if (this.isInitialOrForced(value)) {
                return this.customFunction(value, ctx);
            }
            return value;
        }
    });

});
