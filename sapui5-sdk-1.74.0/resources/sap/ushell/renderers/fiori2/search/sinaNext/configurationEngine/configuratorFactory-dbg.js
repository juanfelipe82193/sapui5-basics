// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
// start sina init
window.sinaRequire = window.sinaRequire || (window.sap && window.sap.ui && window.sap.ui.require) || window.require;
window.sinaDefine = window.sinaDefine || (window.sap && window.sap.ui && window.sap.ui.define) || window.define;
window.sinaLog = window.sinaLog || (window.jQuery && window.jQuery.sap && window.jQuery.sap.log) || window.console;
// end sina init

sinaDefine([
        '../core/core',
        './configurators/CustomFunctionConfigurator',
        './configurators/TemplateConfigurator',
        './configurators/TextResourceConfigurator',
        './configurators/SimpleValueConfigurator',
        './configurators/ListConfigurator',
        './configurators/ObjectConfigurator'
    ],
    function (
        core,
        CustomFunctionConfigurator,
        TemplateConfigurator,
        TextResourceConfigurator,
        SimpleValueConfigurator,
        ListConfigurator,
        ObjectConfigurator) {
        "use strict";

        var configuratorClasses = [
            CustomFunctionConfigurator,
            ListConfigurator,
            ObjectConfigurator,
            TemplateConfigurator,
            TextResourceConfigurator,
            SimpleValueConfigurator
        ];

        var module = {

            createConfiguratorAsync: function (options) {
                options.createConfiguratorAsync = module.createConfiguratorAsync.bind(module);
                for (var i = 0; i < configuratorClasses.length; ++i) {
                    var configuratorClass = configuratorClasses[i];
                    if (configuratorClass.prototype.isSuitable(options)) {
                        return module._createAsync(configuratorClass, options);
                    }
                }
            },

            _createAsync: function (configuratorClass, options) {
                var configurator = new configuratorClass(options); // eslint-disable-line new-cap
                return core.Promise.resolve().then(function () {
                    return configurator.initResourceBundleAsync();
                }).then(function () {
                    return configurator.initAsync();
                }).then(function () {
                    return configurator;
                });
            }
        };

        return module;

    });
