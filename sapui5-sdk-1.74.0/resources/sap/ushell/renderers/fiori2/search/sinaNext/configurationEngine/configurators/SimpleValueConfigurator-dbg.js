// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './Configurator'], function (core, Configurator) {
    "use strict";

    return Configurator.derive({

        initAsync: function () {
            if (core.isObject(this.configuration)) {
                this.value = this.configuration.value;
                this.force = this.configuration.force;
                return;
            }
            this.value = this.configuration;
            this.force = false;
        },

        isSuitable: function (options) {
            if (core.isString(options.type) && ['string', 'integer', 'object'].indexOf(options.type) >= 0) {
                return true;
            }
            return false;
        },

        configure: function (value, ctx) {
            if (this.isInitialOrForced(value)) {
                return this.value;
            }
            return value;
        }
    });

});
