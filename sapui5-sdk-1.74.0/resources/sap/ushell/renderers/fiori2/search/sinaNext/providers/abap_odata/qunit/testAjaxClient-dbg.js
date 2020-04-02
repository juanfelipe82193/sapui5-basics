// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, QUnit */
sinaDefine(['../../../core/ajax', '../ajaxTemplates'], function (ajax, ajaxTemplates) {
    "use strict";

    QUnit.test('AjaxClient-1', function (assert) {
        var done = assert.async();
        var client = new ajax.Client({
            csrf: true
        });
        client.getJson('/sap/es/ina/GetServerInfo').then(function (serverInfo) {
            client.postJson('/sap/es/ina/GetResponse', ajaxTemplates.loadDataSourcesRequest).then(function (response) {
                assert.ok(response.data.ItemLists[0].Items.length > 0);
                done();
            });
        });
    });

    QUnit.test('AjaxClient-2', function (assert) {
        var done = assert.async();
        var client = new ajax.Client({
            csrf: true,
            csrfFetchRequest: {
                method: 'GET',
                url: '/sap/es/ina/GetServerInfo',
                headers: ajax.Client.prototype.jsonHeaders
            }
        });
        client.postJson('/sap/es/ina/GetResponse', ajaxTemplates.loadDataSourcesRequest).then(function (response) {
            assert.ok(response.data.ItemLists[0].Items.length > 0);
            done();
        });

    });


});
