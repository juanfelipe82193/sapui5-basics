// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './Formatter', '../../configurationEngine/configuratorFactory'], function (core, Formatter, configuratorFactory) {
    "use strict";

    return Formatter.derive({

        _init: function (type, configuration) {
            this.type = type;
            this.configuration = configuration;
        },

        initAsync: function () {
            return configuratorFactory.createConfiguratorAsync({
                type: this.type,
                configuration: this.configuration
            }).then(function (configurator) {
                this.configurator = configurator;
            }.bind(this));
        },

        formatAsync: function (obj) {
            return this.configurator.configureAsync(obj);
        },

        format: function (obj) {
            return this.configurator.configure(obj);
        }

    });

});
