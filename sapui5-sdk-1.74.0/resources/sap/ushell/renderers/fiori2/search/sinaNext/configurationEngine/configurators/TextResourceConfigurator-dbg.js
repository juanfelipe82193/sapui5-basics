// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './Configurator'], function (core, Configurator) {
    "use strict";

    return Configurator.derive({

        initAsync: function () {
            this.resourceKey = this.configuration.resourceKey;
            this.force = this.configuration.force;
        },

        isSuitable: function (options) {
            if (core.isString(options.type) && ['string'].indexOf(options.type) >= 0 &&
                core.isObject(options.configuration) && options.configuration.resourceKey) {
                return true;
            }
            return false;
        },

        configure: function (value, ctx) {
            if (this.isInitialOrForced(value)) {
                var resourceBundle = this.resourceBundle || this.getResourceBundle(ctx);
                return resourceBundle.getText(this.resourceKey);
            }
            return value;
        }
    });

});
