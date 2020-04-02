// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.Ui5NativeServiceFactory
 */
sap.ui.require([
    "sap/ushell/Ui5NativeServiceFactory",
    "sap/ui/core/service/ServiceFactory",
    "sap/ui/core/service/Service"
], function (
    Ui5NativeServiceFactory,
    ServiceFactory,
    Service
) {
    "use strict";

    /*global QUnit sinon*/
    QUnit.module("createServiceFactory", {
    });

    QUnit.test("creates a registerable service factory", function (assert) {
        // Act
        var oServiceFactory = Ui5NativeServiceFactory.createServiceFactory("MY_SERVICE");
        // Assert
        assert.ok(oServiceFactory instanceof ServiceFactory, "The returned service factory is an instance of sap.ui.core.service.ServiceFactory");
    });

    QUnit.module("createInstance", {
    });
    QUnit.test("creates and returns a new service if the service is not created yet", function (assert) {
        var done = assert.async();

        // Arrange
        var fnRequire = function (aModules, fnFactory) {
            if (aModules[0] === "sap/ushell/ui5service/MockService") {
                fnFactory(Service);
            }
        };
        var oRequireStub = sinon.stub(sap.ui, "require").callsFake(fnRequire);
        var oServiceFactory = Ui5NativeServiceFactory.createServiceFactory("MockService");

        // Act
        oServiceFactory.createInstance().then(function (service) {

            // Assert
            assert.ok(service instanceof Service, "The correct service is created");
            oRequireStub.restore();
            done();
        });
    });

    QUnit.test("returns the existing service if there is one", function (assert) {
        var done = assert.async();

        // Arrange
        var oService = { "I am": "a service" };
        Ui5NativeServiceFactory._servicePromises = {
            xx: Promise.resolve(oService)
        };
        var oServiceFactory = Ui5NativeServiceFactory.createServiceFactory("xx");

        // Act
        oServiceFactory.createInstance().then(function (service) {

            // Assert
            assert.strictEqual(service, oService, "The correct service is returned");
            done();
        });
    });

    QUnit.test("reject for services that don't exist", function (assert) {
        var done = assert.async();

        // Arrange
        var oServiceFactory = Ui5NativeServiceFactory.createServiceFactory();

        // Act
        oServiceFactory.createInstance().catch(function () {

            // Assert
            assert.ok(true, "The service creation was rejected");
            done();
        });
    });

});