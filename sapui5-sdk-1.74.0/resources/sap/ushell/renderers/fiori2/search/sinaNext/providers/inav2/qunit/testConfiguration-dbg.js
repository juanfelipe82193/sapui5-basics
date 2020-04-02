// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, QUnit */
sinaDefine(['../../../sina/sinaFactory'], function (sinaFactory) {
    "use strict";

    QUnit.test('Configuration', function (assert) {
        var done = assert.async();

        sinaFactory.createAsync('../Provider').then(function (sina) {
            sina.getConfigurationAsync().then(function (configuration) {
                configuration.setPersonalizedSearch(false);
                configuration.saveAsync().then(function () {
                    configuration.resetPersonalizedSearchDataAsync().then(function () {
                        assert.equal(1, 1);
                        done();
                    });
                });
            });
        });
    });

});
