// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigation
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/ui5service/_ShellUIService/shelluiservice.class.factory",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/core/service/ServiceFactory",
    "sap/ui/core/service/Service",
    "sap/ushell/ui5service/ShellUIService"
],function (testUtils, fnDefineClass, ServiceFactoryRegistry, ServiceFactory, Service/*, ShellUIService*/) {
    "use strict";
    /* global sinon module ok test deepEqual strictEqual start */

    var A_PUBLIC_METHODS = [
        "getTitle",
        "getUxdVersion",
        "init",
        "setHierarchy",
        "setRelatedApps",
        "setTitle",
        "setBackNavigation",
        "isA"
    ];

    var A_PRIVATE_METHODS = [
        "_addCallAllowedCheck",
        "_amendPublicServiceInstance",
        "_attachBackNavigationChanged",
        "_attachHierarchyChanged",
        "_attachRelatedAppsChanged",
        "_attachTitleChanged",
        "_detachBackNavigationChanged",
        "_detachHierarchyChanged",
        "_detachRelatedAppsChanged",
        "_detachTitleChanged",
        "_enableAutoHierarchy",
        "_enableAutoTitle",
        "_ensureArrayOfObjectOfStrings",
        "_ensureFunction",
        "_ensureString",
        "_getActiveComponentId",
        "_getCurrentShellHashWithoutAppRoute",
        "_getEventProvider",
        "_getLastSetTitle",
        "_setActiveComponentId",
        "_shouldEnableAutoHierarchy",
        "_shouldEnableAutoTitle"
    ];

    function createShellUIServiceAndMockDependencies () {
        sinon.stub(sap.ui.core.service.ServiceFactoryRegistry, "register");
        sinon.stub(sap.ui.core.service, "ServiceFactory").returns({ fake: "service factory" });
        sinon.stub(sap.ui.core.service.Service.prototype, "getContext").returns({ fake: "context" });
        sinon.stub(sap.ui.core.service.Service.prototype, "getInterface").returns({ fake: "interface" });

        var ShellUIService = fnDefineClass({
            serviceRegistry: sap.ui.core.service.ServiceFactoryRegistry,
            serviceFactory: sap.ui.core.service.ServiceFactory,
            service: sap.ui.core.service.Service
        });

        sinon.stub(ShellUIService.prototype, "_amendPublicServiceInstance");

        return ShellUIService;
    }

    function restoreDependencies (ShellUIService) {
        testUtils.restoreSpies(
            sap.ui.core.service.ServiceFactoryRegistry.register,
            sap.ui.core.service.ServiceFactory,
            sap.ui.core.service.Service.prototype.getContext,
            sap.ui.core.service.Service.prototype.getInterface,
            ShellUIService.prototype._amendPublicServiceInstance
        );
    }

    module(
        "sap.ushell.ui5service.ShellUIService constructor",
        {
            setup : function () {

                this.ShellUIService = createShellUIServiceAndMockDependencies();

                this.oService = new this.ShellUIService({
                    scopeObject: { fake: "component" },
                    scopeType: "component"
                });
            },
            teardown : function () {
                restoreDependencies(this.ShellUIService);
            }
        }
    );

    test("Constructs the service as expected", function () {
        ok(this.oService instanceof sap.ushell.ui5service.ShellUIService, "Got instance of sap.ushell.ui5service.ShellUIService");
    });

    test("Methods follow conventions", function () {
        // UI5 hides all methods that start with "_" from the public interface.
        // Therefore we need to make sure this is done intentionally when
        // maintaining the code.

        var oCheckedMethods = {},
            that = this;

        A_PUBLIC_METHODS.forEach(function (sMethod) {
            strictEqual(typeof that.oService[sMethod], "function", sMethod + " public method was found in the service instance");
            ok(sMethod.charAt(0) !== "_", "Method '" + sMethod + "' does not start with '_'");
            oCheckedMethods[sMethod] = true;
        });

        A_PRIVATE_METHODS.forEach(function (sMethod) {
            strictEqual(typeof that.oService[sMethod], "function", sMethod + " private method was found in the service instance");
            strictEqual(sMethod.charAt(0), "_", "Method starts with '_'");
            oCheckedMethods[sMethod] = true;
        });

        for (var sMethod in this.oService) {
            if (typeof this.oService[sMethod] === "function" && !(sMethod in Service.prototype) && !oCheckedMethods[sMethod]) {
                ok(false, "Found new method '" + sMethod + "', please add it to A_PUBLIC_METHODS or A_PRIVATE_METHODS in this test");
            }
        }
    });

    test("Creates public interface as expected", function () {
        // during construction, the service should call its getInterface method
        // to obtain the public interface.
        strictEqual(this.oService.getInterface.getCalls().length, 1,
            "base public service was obtained via getInterface method");

        // then the public service is augmented with the init method, and
        // ServiceFactory is used to generate and register the public service
        strictEqual(sap.ui.core.service.ServiceFactory.getCalls().length, 1,
            "ServiceFatory constructor was called one time");

        var aServiceFactoryCallArgs = sap.ui.core.service.ServiceFactory.getCall(0).args;
        strictEqual(aServiceFactoryCallArgs.length, 1,
            "ServiceFactory was constructed with one argument");

        strictEqual(aServiceFactoryCallArgs[0].fake, "interface",
            "constructed with the public interface as argument");

        strictEqual(aServiceFactoryCallArgs[0].hasOwnProperty("init"), true,
            "init member was injected in public service");

        strictEqual(typeof aServiceFactoryCallArgs[0].init, "function",
            "init member is a function");
    });

    test("Public init method", function () {
        strictEqual(this.oService._amendPublicServiceInstance.getCalls().length, 0,
            "_amendPublicServiceInstance is not called when service is instantiated");

        var aServiceFactoryCallArgs = sap.ui.core.service.ServiceFactory.getCall(0).args;
        aServiceFactoryCallArgs[0].init();

        strictEqual(this.oService._amendPublicServiceInstance.getCalls().length, 1,
            "_amendPublicServiceInstance is called after init method is called on the public interface");
    });

    test("Registers public interface via ServiceFactoryRegistry as expected", function () {
        strictEqual(sap.ui.core.service.ServiceFactoryRegistry.register.getCalls().length, 1,
            "sap.ui.core.service.ServiceFactoryRegistry.register was called one time");

        deepEqual(
            sap.ui.core.service.ServiceFactoryRegistry.register.getCall(0).args,
            [
                "sap.ushell.ui5service.ShellUIService",
                { fake: "service factory" }
            ],
            "sap.ui.core.service.ServiceFactoryRegistry.register was called with the expected arguments"
        );

    });

    module(
        "sap.ushell.ui5service.ShellUIService pure method calls",
        {
            setup : function () {
                sinon.stub(jQuery.sap.log, "error");
                sinon.stub(jQuery.sap.log, "warning");
                sap.ushell.Container = {
                    getService: sinon.stub()
                };
                sinon.stub(window.hasher, "getHash");
            },
            teardown : function () {
                testUtils.restoreSpies(
                    jQuery.sap.log.error,
                    jQuery.sap.log.warning,
                    window.hasher.getHash
                );
                delete sap.ushell.Container;
            }
        }
    );


    [
        /*
         * This test simulates invocations of the public service interface.
         * When public service is accessed via getService, the init method is
         * injected by our ShellUIService instance into the public service
         * interface. The 'this' context of the _amendPublicServiceInstance
         * method is re-bound to the ShellUIService instance, whilst the first
         * argument of this method is bound to the instance of the public
         * service interface.
         */
        {
            testDescription: "context is a UI5 component (app instantiates the service)",
            oInitContext: {
                scopeType: "component",
                scopeObject: {
                    getId: sinon.stub().returns("__fake_component_id"),
                    getManifestEntry: sinon.stub()
                }
            },
            expectedActiveComponentIdSetCalled: true,
            expectedActiveComponentId: "__fake_component_id",
            expectedErrorLog: false,
            expectedCallCheckAttached: true
        },
        {
            testDescription: "context is a UI5 component with automatic setHierarchy setting",
            oInitContext: {
                scopeType: "component",
                scopeObject: {
                    getId: sinon.stub().returns("__fake_component_id"),
                   getManifestEntry: sinon.stub()
                }
            },
            testShouldEnableAutoHierarchy: true,  // note
            expectedEnableAutoHierarchyCalled: true,
            expectedEnableAutoTitleCalled: false,
            expectedActiveComponentIdSetCalled: true,
            expectedActiveComponentId: "__fake_component_id",
            expectedErrorLog: false,
            expectedCallCheckAttached: true
        },
        {
            testDescription: "context is a UI5 component with automatic setTitle setting",
            oInitContext: {
                scopeType: "component",
                scopeObject: {
                    getId: sinon.stub().returns("__fake_component_id"),
                   getManifestEntry: sinon.stub()
                }
            },
            testShouldEnableAutoTitle: true,  // note
            expectedEnableAutoHierarchyCalled: false,
            expectedEnableAutoTitleCalled: true,
            expectedActiveComponentIdSetCalled: true,
            expectedActiveComponentId: "__fake_component_id",
            expectedErrorLog: false,
            expectedCallCheckAttached: true
        },
        {
            testDescription: "context is a UI5 component (ServiceFactoryRegistry#get used to access the service)",
            oInitContext: undefined, // simulate access via ServiceFactoryRegistry#get
            expectedActiveComponentId: undefined,
            expectedErrorLog: false,
            expectedCallCheckAttached: false
        },
        {
            testDescription: "given context is not an object",
            oInitContext: 123,
            expectedActiveComponentIdSetCalled: false,
            expectedErrorLog: true,
            expectedErrorLogArgs: [
                "Invalid context for ShellUIService interface",
                "The context must be empty or an object like { scopeType: ..., scopeObject: ... }",
                "sap.ushell.ui5service.ShellUIService"
            ],
            expectedCallCheckAttached: true
        },
        {
            testDescription: "given context is not an object",
            oInitContext: 123,
            expectedActiveComponentIdSetCalled: false,
            expectedErrorLog: true,
            expectedErrorLogArgs: [
                "Invalid context for ShellUIService interface",
                "The context must be empty or an object like { scopeType: ..., scopeObject: ... }",
                "sap.ushell.ui5service.ShellUIService"
            ],
            expectedCallCheckAttached: true
        }
    ].forEach(function (oFixture) {
        test("_amendPublicServiceInstance: works as expected when " + oFixture.testDescription, function () {
            var oFakeService = {
                _addCallAllowedCheck: sinon.stub(),
                _setActiveComponentId: sinon.stub(),
                _shouldEnableAutoHierarchy: sinon.stub().returns(!!oFixture.testShouldEnableAutoHierarchy),
                _shouldEnableAutoTitle: sinon.stub().returns(!!oFixture.testShouldEnableAutoTitle),
                _enableAutoHierarchy: sinon.stub(),
                _enableAutoTitle: sinon.stub()
            };

            var oFakePublicService = {
                getContext: function () {
                    return oFixture.oInitContext;
                }
            };

            sap.ushell.ui5service.ShellUIService.prototype._amendPublicServiceInstance.call(oFakeService, oFakePublicService);

            if (oFixture.expectedCallCheckAttached) {
                var aAuthorizableMethods = ["setTitle", "setHierarchy", "setRelatedApps", "setBackNavigation"];
                strictEqual(oFakeService._addCallAllowedCheck.getCalls().length, aAuthorizableMethods.length, "_addCallAllowedCheck was called the expected number of times");

                aAuthorizableMethods.forEach(function (sMethod) {
                    ok(oFakeService._addCallAllowedCheck.calledWith(oFakePublicService, sMethod),
                        "_addCallAllowedCheck was called with the expected arguments for " + sMethod);
                });
            } else {
                strictEqual(oFakeService._addCallAllowedCheck.getCalls().length, 0, "_addCallAllowedCheck was called the expected number of times");
            }


            if (oFixture.expectedActiveComponentIdSetCalled) {
                strictEqual(oFakeService._setActiveComponentId.getCalls().length, 1,
                    "_setActiveComponentId was called once");
                deepEqual(oFakeService._setActiveComponentId.getCall(0).args,
                    ["__fake_component_id"], "_setActiveComponentId was called with the expected component id");
            } else {
                strictEqual(oFakeService._setActiveComponentId.getCalls().length, 0,
                    "_setActiveComponentId was not called");
            }

            if (oFixture.expectedErrorLog) {
                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                deepEqual(jQuery.sap.log.error.getCall(0).args, oFixture.expectedErrorLogArgs,
                    "jQuery.sap.log.error was called with the expected arguments");
            } else {
                strictEqual(jQuery.sap.log.error.getCalls().length, 0, "jQuery.sap.log.error was called 0 times");
            }

            if (oFixture.expectedEnableAutoHierarchyCalled) {
                strictEqual(oFakeService._enableAutoHierarchy.getCalls().length, 1, "_enableAutoHierarchy was called once");
            } else {
                strictEqual(oFakeService._enableAutoHierarchy.getCalls().length, 0, "_enableAutoHierarchy was not called");
            }

            if (oFixture.expectedEnableAutoTitleCalled) {
                strictEqual(oFakeService._enableAutoTitle.getCalls().length, 1, "_enableAutoTitle was called once");
            } else {
                strictEqual(oFakeService._enableAutoTitle.getCalls().length, 0, "_enableAutoTitle was not called");
            }
        });
    });

    [
        {
            testDescription: "app manifest has automatic setHierarchy automatic setTitle disabled",
            oFakeAppComponent: {
                getManifestEntry: (function () {
                    var oStub = sinon.stub();
                    oStub.withArgs("/sap.ui5/services/ShellUIService/settings/setHierarchy").returns("auto");
                    oStub.withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("manual");
                    oStub.throws("Unexpected path argument for getManifestEntry call in productive code");
                    return oStub;
                })()
            },
            expectedAutoHierarchy: true,
            expectedAutoTitle: false
        },
        {
            testDescription: "app manifest has both automatic setTitle and setHierarchy enabled",
            oFakeAppComponent: {
                getManifestEntry: (function () {
                    var oStub = sinon.stub();
                    oStub.withArgs("/sap.ui5/services/ShellUIService/settings/setHierarchy").returns("auto");
                    oStub.withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("auto");
                    oStub.throws("Unexpected path argument for getManifestEntry call in productive code");
                    return oStub;
                })()
            },
            expectedAutoHierarchy: true,
            expectedAutoTitle: true
        },
        {
            testDescription: "app component does not specify getManifest method",
            oFakeAppComponent: {},
            expectedAutoHierarchy: false,
            expectedAutoTitle: false
        },
        {
            testDescription: "app manifest has manual setHierarchy automatic and manual setTitle",
            oFakeAppComponent: {
                getManifestEntry: (function () {
                    var oStub = sinon.stub();
                    oStub.withArgs("/sap.ui5/services/ShellUIService/settings/setHierarchy").returns("manual");
                    oStub.withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("manual");
                    oStub.throws("Unexpected path argument for getManifestEntry call in productive code");
                    return oStub;
                })()

            },
            expectedAutoHierarchy: false,
            expectedAutoTitle: false
        }
    ].forEach(function (oFixture) {
        test("_shouldEnableAutoHierarchy: returns the expected result when " + oFixture.testDescription, function () {

            var bResult = sap.ushell.ui5service.ShellUIService.prototype._shouldEnableAutoHierarchy.call(
                null, oFixture.oFakeAppComponent
            );
            strictEqual(bResult, oFixture.expectedAutoHierarchy);
        });
        test("_shouldEnableAutoTitle: returns the expected result when " + oFixture.testDescription, function () {

            var bResult = sap.ushell.ui5service.ShellUIService.prototype._shouldEnableAutoTitle.call(
                null, oFixture.oFakeAppComponent
            );
            strictEqual(bResult, oFixture.expectedAutoTitle);
        });
    });

    [
        { method: "_attachHierarchyChanged", event: "hierarchyChanged" },
        { method: "_attachRelatedAppsChanged", event: "relatedAppsChanged" },
        { method: "_attachTitleChanged", event: "titleChanged" },
        { method: "_attachBackNavigationChanged", event: "backNavigationChanged" }
    ].forEach(function (oFixture) {
        var sAttachMethod = oFixture.method;

        test("_attach method '" + sAttachMethod + "' attaches on event provider", function () {
            var oAttachEventStub = sinon.stub(),
                oFakeService = {
                    _getEventProvider: sinon.stub().returns({
                        attachEvent: oAttachEventStub
                    })
                };

            sap.ushell.ui5service.ShellUIService.prototype[sAttachMethod].call(oFakeService, "function_arg");

            strictEqual(oAttachEventStub.getCalls().length, 1, "attachEvent was called once");
            deepEqual(oAttachEventStub.getCall(0).args, [oFixture.event, "function_arg"],
                "attachEvent method called with the expected arguments");
        });
    });

    [
        { method: "_detachHierarchyChanged", event: "hierarchyChanged" },
        { method: "_detachRelatedAppsChanged", event: "relatedAppsChanged" },
        { method: "_detachTitleChanged", event: "titleChanged" },
        { method: "_detachBackNavigationChanged", event: "backNavigationChanged" }
    ].forEach(function (oFixture) {
        var sDetachMethod = oFixture.method;

        test("_detach method '" + sDetachMethod + "' detaches on event provider", function () {
            var oDetachEventStub = sinon.stub(),
                oFakeService = {
                    _getEventProvider: sinon.stub().returns({
                        detachEvent: oDetachEventStub
                    })
                };

            sap.ushell.ui5service.ShellUIService.prototype[sDetachMethod].call(oFakeService, "function_arg");

            strictEqual(oDetachEventStub.getCalls().length, 1, "detachEvent was called once");
            deepEqual(oDetachEventStub.getCall(0).args, [oFixture.event, "function_arg"],
                "detachEvent method called with the expected arguments");
        });
    });

    function testFunction () {
        // Reference to this function is used in combination with strictEqual.
        //
        // strictEqual(testFunction, testFunction) correct
        // strictEqual(function () {}, function () {}) incorrect
    }

    [
        {
            testDescription: "call is authorized, validation succeeds",
            sPublicMethod: "setHierarchy",
            vMethodArg: ["level1", "level2"],
            bAuthorized: true,
            bValidationResult: true,
            expectedEventFired: true,
            expectedFireEventName: "hierarchyChanged",
            expectedFireEventData: [ "level1", "level2" ],
            expectedValidationMethodCalled: "_ensureArrayOfObjectOfStrings"
        },
        {
            testDescription: "call is not authorized, validation succeeds",
            sPublicMethod: "setHierarchy",
            vMethodArg: ["level1", "level2"],
            bAuthorized: false,
            bValidationResult: true,
            expectedEventFired: false,
            expectedValidationMethodCalled: null
        },
        {
            testDescription: "call is authorized, validation fails",
            sPublicMethod: "setHierarchy",
            vMethodArg: ["level1", "level2"],
            bAuthorized: true,
            bValidationResult: false,
            expectedEventFired: false,
            expectedValidationMethodCalled: "_ensureArrayOfObjectOfStrings"
        },
        {
            testDescription: "call is authorized, validation succeeds",
            sPublicMethod: "setRelatedApps",
            vMethodArg: ["app1", "app2"],
            bAuthorized: true,
            bValidationResult: true,
            expectedEventFired: true,
            expectedFireEventName: "relatedAppsChanged",
            expectedFireEventData: [ "app1", "app2" ],
            expectedValidationMethodCalled: "_ensureArrayOfObjectOfStrings"
        },
        {
            testDescription: "call is not authorized, validation succeeds",
            sPublicMethod: "setRelatedApps",
            vMethodArg: ["app1", "app2"],
            bAuthorized: false,
            bValidationResult: true,
            expectedEventFired: false,
            expectedValidationMethodCalled: null
        },
        {
            testDescription: "call is authorized, validation fails",
            sPublicMethod: "setRelatedApps",
            vMethodArg: ["app1", "app2"],
            bAuthorized: true,
            bValidationResult: false,
            expectedEventFired: false,
            expectedValidationMethodCalled: "_ensureArrayOfObjectOfStrings"
        },
        {
            testDescription: "call is authorized, validation succeeds",
            sPublicMethod: "setTitle",
            vMethodArg: "some title",
            bAuthorized: true,
            bValidationResult: true,
            expectedEventFired: true,
            expectedFireEventName: "titleChanged",
            expectedFireEventData: "some title",
            expectedValidationMethodCalled: "_ensureString"
        },
        {
            testDescription: "call is not authorized, validation succeeds",
            sPublicMethod: "setTitle",
            vMethodArg: "some title",
            bAuthorized: false,
            bValidationResult: true,
            expectedEventFired: false,
            expectedValidationMethodCalled: null
        },
        {
            testDescription: "call is authorized, validation fails",
            sPublicMethod: "setTitle",
            vMethodArg: "some title",
            bAuthorized: true,
            bValidationResult: false,
            expectedEventFired: false,
            expectedValidationMethodCalled: "_ensureString"
        },
        {
            testDescription: "call is authorized, validation succeeds",
            sPublicMethod: "setBackNavigation",
            vMethodArg: testFunction,
            bAuthorized: true,
            bValidationResult: true,
            expectedEventFired: true,
            expectedFireEventName: "backNavigationChanged",
            expectedFireEventData: testFunction,
            expectedValidationMethodCalled: "_ensureFunction"
        },
        {
            testDescription: "call is not authorized, validation succeeds",
            sPublicMethod: "setBackNavigation",
            vMethodArg: testFunction,
            bAuthorized: false,
            bValidationResult: true,
            expectedEventFired: false,
            expectedValidationMethodCalled: null
        },
        {
            testDescription: "call is authorized, validation fails",
            sPublicMethod: "setBackNavigation",
            vMethodArg: testFunction,
            bAuthorized: true,
            bValidationResult: false,
            expectedEventFired: false,
            expectedValidationMethodCalled: "_ensureFunction"
        }
    ].forEach(function (oFixture) {
        test(oFixture.sPublicMethod + ": works as expected when " + oFixture.testDescription, function () {
            var ShellUIService = createShellUIServiceAndMockDependencies();

            sinon.stub(ShellUIService.prototype, "_ensureFunction").returns(oFixture.bValidationResult);
            sinon.stub(ShellUIService.prototype, "_ensureString").returns(oFixture.bValidationResult);
            sinon.stub(ShellUIService.prototype, "_ensureArrayOfObjectOfStrings").returns(oFixture.bValidationResult);
            var oService = new ShellUIService({
                scopeObject: { fake: "component" },
                scopeType: "component"
            });

            var oEventProvider = oService._getEventProvider();
            sinon.stub(oEventProvider, "fireEvent");

            var sPublicServiceScopeId;
            if (!oFixture.bAuthorized) {
                sPublicServiceScopeId = "something different than undefined";
            }

            var oFakePublicServiceScopeObject = {
                getId: sinon.stub().returns( // note: active id is "undefined"
                    sPublicServiceScopeId
                )
            };

            var oFakePublicService = {
                getContext: sinon.stub().returns({
                    scopeObject: oFakePublicServiceScopeObject
                })
            };

            // add authorization check code
            oService._addCallAllowedCheck(oFakePublicService, oFixture.sPublicMethod);

            oFakePublicService[oFixture.sPublicMethod].call(oFakePublicService, oFixture.vMethodArg);

            if (oFixture.expectedEventFired) {
                strictEqual(oEventProvider.fireEvent.getCalls().length, 1, "EventProvider.fireEvent was called 1 time");

                var aCallArgs = oEventProvider.fireEvent.getCall(0).args;
                strictEqual(aCallArgs[0], oFixture.expectedFireEventName,
                    "EventProvider.fireEvent was called with the correct first argument");

                deepEqual(aCallArgs[1], {
                        component: oFakePublicServiceScopeObject,
                        data: oFixture.expectedFireEventData
                    }, "EventProvider.fireEvent was called with the expected second argument");


            } else {
                strictEqual(oEventProvider.fireEvent.getCalls().length, 0, "EventProvider.fireEvent was called 0 times");
            }

            if (oFixture.expectedValidationMethodCalled) {
                strictEqual(ShellUIService.prototype[oFixture.expectedValidationMethodCalled].getCalls().length, 1,
                oFixture.expectedValidationMethodCalled + " validation method was called");
            } else {
                strictEqual(ShellUIService.prototype._ensureArrayOfObjectOfStrings.getCalls().length, 0,
                "_ensureArrayOfObjectOfStrings validation method was not called");
                strictEqual(ShellUIService.prototype._ensureString.getCalls().length, 0,
                "_ensureString validation method was not called");
            }

            restoreDependencies(ShellUIService);
            sinon.restore(oEventProvider.fireEvent);
            sinon.restore(ShellUIService.prototype._ensureString);
            sinon.restore(ShellUIService.prototype._ensureArrayOfObjectOfStrings);
            sinon.restore(ShellUIService.prototype._ensureFunction);
        });
    });

    [
        {
            testDescription: "setHierarchy is called on the public service when automatic setHierarchy + setTitle are configured",
            sPublicServiceMethod: "setHierarchy",
            testManifestEnablesAutoSetTitle: true,
            testManifestEnablesAutoSetHierarchy: true,
            expectedWarning: true,
            expectedWarningArgs: [
                "Call to setHierarchy is not allowed",
                "The app defines that setHierarchy should be called automatically",
                "sap.ushell.ui5service.ShellUIService"
            ]
        },
        {
            testDescription: "setTitle is called on the public service when automatic setHierarchy + setTitle are configured",
            sPublicServiceMethod: "setTitle",
            testManifestEnablesAutoSetTitle: true,
            testManifestEnablesAutoSetHierarchy: true,
            expectedWarning: true,
            expectedWarningArgs: [
                "Call to setTitle is not allowed",
                "The app defines that setTitle should be called automatically",
                "sap.ushell.ui5service.ShellUIService"
            ]
        }
    ].forEach(function (oFixture) {
        test("_addCallAllowedCheck: fails as expected when " + oFixture.testDescription, function () {
            var oFakeComponentScope = {
                scopeObject: {
                    fake: "component",
                    getId: sinon.stub() // by returning undefined, this call
                                        // becomes legal,
                                        // because the current component id is
                                        // set to undefined.
                },
                scopeType: "component"
            };

            var oPublicServiceInstance = {
                getContext: sinon.stub().returns(oFakeComponentScope)
            };


            var oService = new sap.ushell.ui5service.ShellUIService(oFakeComponentScope);

            // sanity
            if (!A_PUBLIC_METHODS.indexOf(oFixture.sPublicServiceMethod)) {
                throw "The fixture specifies a non-public method: " + oFixture.sPublicServiceMethod;
            }

            sinon.stub(oService, oFixture.sPublicServiceMethod);

            sinon.stub(oService, "_shouldEnableAutoHierarchy").returns(oFixture.testManifestEnablesAutoSetHierarchy);
            sinon.stub(oService, "_shouldEnableAutoTitle").returns(oFixture.testManifestEnablesAutoSetTitle);

            // Act
            oService._addCallAllowedCheck(oPublicServiceInstance, oFixture.sPublicServiceMethod);
            strictEqual(
                oPublicServiceInstance.hasOwnProperty(oFixture.sPublicServiceMethod),
                true, "method was injected in public service instance"
            );

            // Act
            oPublicServiceInstance[oFixture.sPublicServiceMethod]();

            if (oFixture.expectedWarning) {
                strictEqual(jQuery.sap.log.warning.getCalls().length, 1, "jQuery.sap.log.warning was called once");
                deepEqual(jQuery.sap.log.warning.getCall(0).args, oFixture.expectedWarningArgs, "jQuery.sap.log.warning was called with the expected arguments");

                strictEqual(oService[oFixture.sPublicServiceMethod].getCalls().length, 0, "Public method was not called");
            } else {
                strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was not called");

                strictEqual(oService[oFixture.sPublicServiceMethod].getCalls().length, 1, "The private service is called once");
            }

        });
    });

    test("getTitle: works as expected", function () {
        var oFakeService = {
            _getLastSetTitle: sinon.stub().returns("the last set title")
        };

        var sTitle = sap.ushell.ui5service.ShellUIService.prototype.getTitle.call(oFakeService);

        strictEqual(sTitle, "the last set title", "got undefined title back");
    });

    [
        { sUi5Version: "1.37.0-SNAPSHOT" , expectedVersion: 2 },
        { sUi5Version: "2.0.0-SNAPSHOT"  , expectedVersion: 2 },
        { sUi5Version: "1"               , expectedVersion: 1 },
        { sUi5Version: "2"               , expectedVersion: 2 },
        { sUi5Version: "1.37"            , expectedVersion: 2 },
        { sUi5Version: "1.36.3"          , expectedVersion: 1 },
        { sUi5Version: "8.0.0-SNAPSHOT"  , expectedVersion: 2 }
    ].forEach(function (oFixture) {
        test("getUxdVersion: returns expected number when UI5 version is " + oFixture.sUi5Version, function () {
            var sOriginalVersion = sap.ui.version;
            sap.ui.version = oFixture.sUi5Version;

            var iVersion = sap.ushell.ui5service.ShellUIService.prototype.getUxdVersion();

            strictEqual(iVersion, oFixture.expectedVersion, "returned expected version");

            sap.ui.version = sOriginalVersion;
        });

    });

    [
        {
            testDescription: "a string is given",
            vValue: "something",
            sValueType: "string",
            expectedString: true
        }, {
            testDescription: "a number is given",
            vValue: 123,
            sValueType: "number",
            expectedString: false
        }, {
            testDescription: "an object is given",
            vValue: { some: "thing" },
            sValueType: "object",
            expectedString: false
        }, {
            testDescription: "a function is given",
            vValue: function () { return false; },
            sValueType: "function",
            expectedString: false
        }, {
            testDescription: "a boolean is given",
            vValue: true,
            sValueType: "boolean",
            expectedString: false
        }, {
            testDescription: "an array of one string is given",
            vValue: ["a_string"],
            sValueType: "object",
            expectedString: false
        }
    ].forEach(function (oFixture) {
        test("_ensureString: returns the expected result when " + oFixture.testDescription, function () {
            var bResult = sap.ushell.ui5service.ShellUIService.prototype._ensureString(oFixture.vValue, "method name");

            strictEqual(bResult, oFixture.expectedString, "returned expected result");
            if (!bResult) {
                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called 1 time");
                deepEqual(
                    jQuery.sap.log.error.getCall(0).args, [
                        "'method name' was called with invalid arguments",
                        "the parameter should be a string, got '" + oFixture.sValueType + "' instead",
                        "sap.ushell.ui5service.ShellUIService"
                    ],
                    "jQuery.sap.log.error was called with the expected arguments"
                );
            }

        });
    });

    [
        {
            testDescription: "a string is given",
            vValue: "something",
            sValueType: "string",
            expectedFunction: false
        }, {
            testDescription: "a number is given",
            vValue: 123,
            sValueType: "number",
            expectedFunction: false
        }, {
            testDescription: "an object is given",
            vValue: { some: "thing" },
            sValueType: "object",
            expectedFunction: false
        }, {
            testDescription: "a function is given",
            vValue: function () { return false; },
            sValueType: "function",
            expectedFunction: true
        }, {
            testDescription: "a boolean is given",
            vValue: true,
            sValueType: "boolean",
            expectedFunction: false
        }, {
            testDescription: "an array of one string is given",
            vValue: ["a_string"],
            sValueType: "object",
            expectedFunction: false
        }
    ].forEach(function (oFixture) {
        test("_ensureFunction: returns the expected result when " + oFixture.testDescription, function () {
            var bResult = sap.ushell.ui5service.ShellUIService.prototype._ensureFunction(oFixture.vValue, "method name");

            strictEqual(bResult, oFixture.expectedFunction, "returned expected result");
            if (!bResult) {
                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called 1 time");
                deepEqual(
                    jQuery.sap.log.error.getCall(0).args, [
                        "'method name' was called with invalid arguments",
                        "the parameter should be a function, got '" + oFixture.sValueType + "' instead",
                        "sap.ushell.ui5service.ShellUIService"
                    ],
                    "jQuery.sap.log.error was called with the expected arguments"
                );
            }

        });
    });

    [
        {
            testDescription: "a string is given",
            vArg: "something",
            expectedResult: false
        }, {
            testDescription: "a number is given",
            vArg: 123,
            expectedResult: false
        }, {
            testDescription: "an object of strings is given",
            vArg: { some: "thing" },
            expectedResult: false
        }, {
            testDescription: "a function is given",
            vArg: function () { return false; },
            expectedResult: false
        }, {
            testDescription: "a boolean is given",
            vArg: true,
            expectedResult: false
        }, {
            testDescription: "an array of non-objects is given",
            vArg: [ 1, 2, "3"],
            expectedResult: false
        }, {
            testDescription: "an array of empty objects is given",
            vArg: [ {}, {}, {} ],
            expectedResult: false
        }, {
            testDescription: "an array with some empty objects is given",
            vArg: [ {k: "1"}, {}, { k: "2"} ],
            expectedResult: false
        }, {
            testDescription: "an array with an object having a non string value is given",
            vArg: [ {k: "1"}, { v: null }, { k: "2"} ],
            expectedResult: false
        }, {
            testDescription: "an array with an object having both a non-string and a string value is given",
            vArg: [ {k: "1"}, { k1: "v1", k2: 2 }, { k: "2"} ],
            expectedResult: false
        }, {
            testDescription: "an array with an object having both all string values is given",
            vArg: [ {k: "1"}, { k1: "v1", k2: "v2" }, { k: "2"} ],
            expectedResult: true
        }
    ].forEach(function (oFixture) {
        test("_ensureArrayOfObjectOfStrings: works as expected when " + oFixture.testDescription, function () {
            var bResult = sap.ushell.ui5service.ShellUIService.prototype._ensureArrayOfObjectOfStrings(
                oFixture.vArg, "some method"
            );

            strictEqual(bResult, oFixture.expectedResult, "Obtained the expected result");
            if (bResult) {
                strictEqual(jQuery.sap.log.error.getCalls().length, 0, "0 calls made to jQuery.sap.log.error");
            } else {
                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "1 call made to jQuery.sap.log.error");
                deepEqual(
                    jQuery.sap.log.error.getCall(0).args, [
                        "'some method' was called with invalid parameters",
                        "An array of non-empty objects with string values is expected",
                        "sap.ushell.ui5service.ShellUIService"
                    ], "jQuery.sap.log.error was called with the expected arguments"
                );
            }
        });
    });

    [
        {
            testDescription: "simple intent with no parameters is provided",
            sURLHashWithAppRoute: "Object-action&/inner/app/route",
            sURLHashWithoutAppRoute: "Object-action",
            expectedHash: "#Object-action",
            expectedWarning: false,
            expectedError: false
            // expectedErrorArgs: []
        },
        {
            testDescription: "intent with single parameter is provided",
            sURLHashWithAppRoute: "Object-action?intentParam=VAL&/inner/app/route",
            sURLHashWithoutAppRoute: "Object-action?intentParam=VAL",
            expectedHash: "#Object-action?intentParam=VAL",
            expectedWarning: false,
            expectedError: false
        },
        {
            testDescription: "intent with multiple parameters is provided",
            sURLHashWithAppRoute: "Object-action?intentParam1=VAL1&intentParam2=VAL2&/inner/app/route",
            sURLHashWithoutAppRoute: "Object-action?intentParam1=VAL1&intentParam2=VAL2",
            expectedHash: "#Object-action?intentParam1=VAL1&intentParam2=VAL2",
            expectedWarning: false,
            expectedError: false
        },
        {
            testDescription: "undefined is returned by URLParsing#getHash",
            sURLHashWithAppRoute: "SomeInvalidUrl-thatUrlParsingDoesntLike",
            sURLHashWithoutAppRoute: undefined,
            expectedHash: "",
            expectedWarning: false,
            expectedError: true,
            expectedErrorArgs: [
                "Cannot get the current shell hash",
                "URLParsing service returned a falsy value for #SomeInvalidUrl-thatUrlParsingDoesntLike",
                "sap.ushell.ui5service.ShellUIService"
            ]
        }
    ].forEach(function (oFixture) {
        test("_getCurrentShellHashWithoutAppRoute: returns the expected hash when " + oFixture.testDescription, function () {

            var oFakeURLParsingService = {
                getShellHash: sinon.stub().returns(oFixture.sURLHashWithoutAppRoute)
            };

            var oGetServiceStub = sap.ushell.Container.getService; // stubbed in setup
            oGetServiceStub.withArgs("URLParsing").returns(oFakeURLParsingService);
            oGetServiceStub.throws("productive code requires an unexpected service that is not stubbed away in this test");

            var oHasherGetHashStub = window.hasher.getHash; // stubbed in setup
            oHasherGetHashStub.returns(oFixture.sURLHashWithAppRoute);

            // Act
            var sHash = sap.ushell.ui5service.ShellUIService.prototype._getCurrentShellHashWithoutAppRoute();

            // Assert
            strictEqual(oHasherGetHashStub.getCalls().length, 1, "hasher.getHash was called once");
            deepEqual(oHasherGetHashStub.getCall(0).args, [], "hasher.getHash was called with the expected arguments");

            strictEqual(oFakeURLParsingService.getShellHash.getCalls().length, 1, "URLParsing#getShellHash was called once");
            deepEqual(oFakeURLParsingService.getShellHash.getCall(0).args, ["#" + oFixture.sURLHashWithAppRoute], "URLParsing#getShellHash method was called with the full URL hash (including '#' prefix and inner app route)");

            strictEqual(sHash, oFixture.expectedHash, "returned the expected hash");

            if (oFixture.expectedError) {
                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                deepEqual(jQuery.sap.log.error.getCall(0).args, oFixture.expectedErrorArgs,
                    "jQuery.sap.log.error was called with the expected arguments");
            } else {
                strictEqual(jQuery.sap.log.error.getCalls().length, 0, "jQuery.sap.log.error was not called");
            }

            if (oFixture.expectedWarning) {
                strictEqual(jQuery.sap.log.warning.getCalls().length, 1, "jQuery.sap.log.warning was called once");
                deepEqual(jQuery.sap.log.warning.getCall(0).args, oFixture.expectedWarningArgs,
                    "jQuery.sap.log.warning was called with the expected arguments");
            } else {
                strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was not called");
            }

        });
    });

    [
        {
            testDescription: "no getRouter method is present in the app component",
            oAppComponent: {
                // note: no getRouter method
            }
        },
        {
            testDescription: "app component getRouter method returns undefined",
            oAppComponent: {
                getRouter: sinon.stub()
            }
        }
    ].forEach(function (oFixture) {
        test("_enableAutoHierarchy: logs an error when " + oFixture.testDescription, function () {
                sap.ushell.ui5service.ShellUIService.prototype._enableAutoHierarchy.call(null, oFixture.oAppComponent);

                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Could not enable automatic setHierarchy on the current app",
                    "Router could not be obtained on the app root component via getRouter",
                    "sap.ushell.ui5service.ShellUIService"
                ], "jQuery.sap.log.error was called with the expected arguments");
        });

        test("_enableAutoTitle: logs an error when " + oFixture.testDescription, function () {
                sap.ushell.ui5service.ShellUIService.prototype._enableAutoTitle.call(null, oFixture.oAppComponent);

                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Could not enable automatic setTitle on the current app",
                    "Router could not be obtained on the app root component via getRouter",
                    "sap.ushell.ui5service.ShellUIService"
                ], "jQuery.sap.log.error was called with the expected arguments");
        });
    });

	test("_enableAutoTitle calls setTitle with a timeout when UI5 router returns an initial title for the app", function () {
		var oFakeUI5Router = {
			attachTitleChanged: sinon.stub().returns([]),
			getTitleHistory: sinon.stub().returns([{
				title: "The Initial Title",
				hash: "some-hash"
			}])
		};
		var oFakeAppComponent = {
			getRouter: sinon.stub().returns(oFakeUI5Router)
		};

		var oFakeShellUIServiceInstance = {
			setHierarchy: sinon.stub(),
			setTitle: sinon.stub(),
			_getCurrentShellHashWithoutAppRoute: sinon.stub().returns("#Object-action") // the current hash
		};

		sap.ushell.ui5service.ShellUIService.prototype._enableAutoTitle.call(oFakeShellUIServiceInstance, oFakeAppComponent);
		strictEqual(oFakeShellUIServiceInstance.setTitle.callCount, 0, "setTitle was not called immediately");

        stop();
        setTimeout(function () {
            strictEqual(oFakeShellUIServiceInstance.setTitle.callCount, 1, "setTitle was called once after a 0 timeout");
            deepEqual(oFakeShellUIServiceInstance.setTitle.getCall(0).args, ["The Initial Title"],
                "setTitle was called with the expected argument");
            start();
        }, 0);
	});

    [ "Hierarchy", "Title" ].forEach(function (sFixture) {
        var sMethodUnderTest = "_enableAuto" + sFixture;
        var sSetMethod = "set" + sFixture;

        test(sMethodUnderTest + ": attaches on UI5 router from the app", function () {
            var oFakeUI5Router = {
                attachTitleChanged: sinon.stub(),
				getTitleHistory: sinon.stub().returns([])
            };
            var oFakeAppComponent = {
                getRouter: sinon.stub().returns(oFakeUI5Router)
            };

            sap.ushell.ui5service.ShellUIService.prototype[sMethodUnderTest].call(null, oFakeAppComponent);

            strictEqual(oFakeUI5Router.attachTitleChanged.getCalls().length, 1, "#attachTitleChanged method was called on the App UI5 router");
            strictEqual(oFakeUI5Router.attachTitleChanged.getCall(0).args.length, 1, "#attachTitleChanged method was called with one argument");
            strictEqual(typeof oFakeUI5Router.attachTitleChanged.getCall(0).args[0], "function", "#attachTitleChanged method was called with a function");
        });

        test(sMethodUnderTest + ": calls " + sSetMethod + " when the titleChanged event of the UI5 app router is triggered", function () {
            // The hierarchy returned by the UI5 component
            var aUI5Hierarchy = [
                { title: "title1", hash: "inner/app/1" },
                { title: "title2", hash: "inner/app/2" }
            ];
            var sUI5Title = "App title";

            var oFakeShellUIServiceInstance = {
                setHierarchy: sinon.stub(),
                setTitle: sinon.stub(),
                _getCurrentShellHashWithoutAppRoute: sinon.stub().returns("#Object-action") // the current hash
            };

            var fnTriggerTitleChangeEvent;
            var oFakeUI5Router = {
				getTitleHistory: sinon.stub().returns([]),
                attachTitleChanged: function (fnHandler) {
                    fnTriggerTitleChangeEvent = function () { // note: not triggered yet, just assigned

                        var oGetParameterStub = sinon.stub();
                        oGetParameterStub.withArgs("history").returns(aUI5Hierarchy);
                        oGetParameterStub.withArgs("title").returns(sUI5Title);
                        oGetParameterStub.throws("Productive code requests an unexpected parameter to the router event object");

                        // trigger
                        fnHandler({
                            getParameter: oGetParameterStub
                        });
                    };
                }
            };

            var oFakeAppComponent = {
                getRouter: sinon.stub().returns(oFakeUI5Router)
            };

            // Act
            sap.ushell.ui5service.ShellUIService.prototype[sMethodUnderTest].call(oFakeShellUIServiceInstance, oFakeAppComponent);
            fnTriggerTitleChangeEvent();

            // Assert
            strictEqual(oFakeShellUIServiceInstance[sSetMethod].getCalls().length, 1, sSetMethod + " method was called once");
            strictEqual(oFakeShellUIServiceInstance[sSetMethod].getCall(0).args.length, 1, sSetMethod + " method was called with one argument");

            if (sMethodUnderTest === "_enableAutoHierarchy") {
                deepEqual(oFakeShellUIServiceInstance.setHierarchy.getCall(0).args[0], [  // note: reverse order!
                    {
                        "intent": "#Object-action&/inner/app/2",
                        "title": "title2"
                    }, {
                        "intent": "#Object-action&/inner/app/1",
                        "title": "title1"
                    }
                ], "setHierarchy method was called with the expected argument");
            }

            if (sMethodUnderTest === "_enableAutoTitle") {
                deepEqual(
                    oFakeShellUIServiceInstance.setTitle.getCall(0).args[0],
                    sUI5Title,
                    "setTitle method was called with the expected argument"
                );
            }
        });
    });

});
