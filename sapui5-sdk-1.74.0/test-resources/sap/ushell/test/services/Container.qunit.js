// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Container
 */
sap.ui.require([
    "sap/ui/Device",
    "sap/ushell/utils",
    "sap/ushell/System",
    "sap/ushell/Ui5ServiceFactory",
    "sap/ushell/Ui5NativeServiceFactory",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ushell/test/utils",
    "sap/ui/thirdparty/datajs",
    "sap/ui/thirdparty/URI",
    "sap/ushell/Ui5NativeServiceFactory"
],
function (Device, utils, System, oUi5ServiceFactory, oUi5NativeServiceFactory, ServiceFactoryRegistry, testUtils, OData, URI, Ui5NativeServiceFactory) {
    "use strict";
    /*global asyncTest deepEqual module ok throws start strictEqual test acme notStrictEqual QUnit sinon expect*/

    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    // needed so that we can spy on the constructor
    jQuery.sap.require("sap.ushell.adapters.local.ContainerAdapter");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");

    var fnODataReadOriginal = OData.read,
        fnODataRequestOriginal = OData.request,
        sCachedConfig;

    /**
     * Stubs the function <code>getLocalStorage</code> to create a mock for the local storage. All
     * functions are spies and work on the given object. Also stubs
     * <code>utils.localStorageSetItem</code> to modify this mock.
     *
     * @param {object} [oItems]
     *    an object giving the initial state.
     * @returns {object}
     *    a mock for the localStorage
     */
    function mockLocalStorage (oItems) {
        var oLocalStorage;

        oItems = oItems || {};
        oLocalStorage = {
            length: Object.keys(oItems).length,
            getItem: sinon.spy(function (sKey) {
                return oItems[sKey];
            }),
            removeItem: sinon.spy(function (sKey) {
                delete oItems[sKey];
                this.length = Object.keys(oItems).length;
            }),
            setItem: sinon.spy(function (sKey, sValue) {
                //TODO ideally all callers would use utils.localStorageSetItem instead!
                oItems[sKey] = sValue;
                this.length = Object.keys(oItems).length;
            }),
            key: sinon.spy(function (i) {
                return Object.keys(oItems)[i];
            })
        };
        sinon.stub(sap.ushell.utils, "getLocalStorage").returns(oLocalStorage);
        utils.localStorageSetItem.restore(); // This was already stubbed in setup.
        sinon.stub(sap.ushell.utils, "localStorageSetItem", function (sKey, sValue) {
            oLocalStorage.setItem(sKey, sValue);
        });
        return oLocalStorage;
    }

    module("sap.ushell.services.Container", {
        setup: function () {
            // the config has to be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            // ensure that we do not modify localStorage
            sinon.stub(Storage.prototype, "removeItem", function () {
                ok(false, "localStorage.removeItem called");
            });
            sinon.stub(Storage.prototype, "setItem", function () {
                ok(false, "localStorage.setItem called");
            });
            sinon.stub(sap.ushell.utils, "localStorageSetItem");
            if (utils.reload &&
                    !utils.reload.restore) {
                sinon.stub(sap.ushell.utils, "reload");
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            OData.read = fnODataReadOriginal;
            OData.request = fnODataRequestOriginal;
            testUtils.restoreSpies(
                (sap.ushell.services || {}).Foo,
                Object.keys,
                ServiceFactoryRegistry.register,
                Storage.prototype.removeItem,
                Storage.prototype.setItem,
                jQuery.sap.require,
                oUi5ServiceFactory.createServiceFactory,
                sap.ui.base.EventProvider,
                sap.ui.component,
                sap.ui.getCore().getEventBus().subscribe,
                sap.ui.require,
                sap.ui.requireSync,
                sap.ushell.adapters.local.ContainerAdapter,
                sap.ushell.renderers.fiori2.Renderer.prototype.createContent,
                setTimeout,
                utils.getLocalStorage,
                utils.localStorageSetItem,
                utils.hasFLPReadyNotificationCapability
            );
            delete sap.ushell.Container;
            window["sap-ushell-config"] = JSON.parse(sCachedConfig);
            window.onhashchange = null;
        }
    });

    test("check that utils are available", function () {
        strictEqual(typeof utils.Error, "function");
        strictEqual(typeof utils.Map, "function");
    });

    [
        {
            sTestDescription: " hasFLPReadyNotificationCapability is false",
            bHasFLPReadyNotificationCapability: false,
            bExpectedDoEventFlpReadyCalled: false
        },
        {
            sTestDescription: " hasFLPReadyNotificationCapability is true",
            bHasFLPReadyNotificationCapability: true,
            bExpectedDoEventFlpReadyCalled: true
        }
    ].forEach(function (oFixture) {
        asyncTest("initialize Container", function () {
            if (Device.browser.internet_explorer) {
                expect(0);
                start();
                return;
            }

            var oSystem = new sap.ushell.System({}),
                oAdapter = new sap.ushell.adapters.local.ContainerAdapter(oSystem),
                oPromise;

            sinon.spy(jQuery.sap, "require");
            sinon.spy(oAdapter, "load");
            // stub the constructor and return our own object
            sinon.stub(sap.ushell.adapters.local, "ContainerAdapter").returns(oAdapter);

            sinon.stub(sap.ushell.utils, "hasFLPReadyNotificationCapability").returns(oFixture.bHasFLPReadyNotificationCapability);
            var bDoEventFlpReadyCalled = false;

            window.external.getPrivateEpcm = function () {
                return {
                    doEventFlpReady: function () {
                        bDoEventFlpReadyCalled = true;
                    }
                };
            };

            // initial tests
            strictEqual(sap.ushell.Container, undefined, "Container not defined initially");

            // Code under test
            oPromise = sap.ushell.bootstrap("local");

            // tests
            ok(typeof oPromise.done === "function", "initialize returned a jQuery promise");
            oPromise.fail(testUtils.onError).done(function () {
                throws(function () {
                    sap.ushell.bootstrap("local");
                }, /Unified shell container is already initialized - cannot initialize twice/, "parameter check");
                ok(sap.ushell.adapters.local.ContainerAdapter.calledOnce, "adapter created");
                ok(oAdapter.load.calledOnce, "adapter.load() called");
                ok(typeof sap.ushell.Container === "object", "Container created");
                setTimeout(function () {
                    strictEqual(bDoEventFlpReadyCalled, oFixture.bExpectedDoEventFlpReadyCalled, "doEventFlpReady was called/not called as expected when" + oFixture.sTestDescription);
                    start();
                }, 0);
            });
        });
    });

    test("test isDirty flag set/get", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            strictEqual(sap.ushell.Container.getDirtyFlag(), false, "isDirty default value is false");
            sap.ushell.Container.setDirtyFlag(true);
            strictEqual(sap.ushell.Container.getDirtyFlag(), true, "isDirty value was set to true");
            sap.ushell.Container.setDirtyFlag(false);
            strictEqual(sap.ushell.Container.getDirtyFlag(), false, "isDirty value was set to false");
            done();
        });
    });

    test("test register external dirty methods", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            strictEqual(sap.ushell.Container.getDirtyFlag(), false, "isDirty default value is false");
            var fnDirty = function () {
                return true;
            };
            sap.ushell.Container.registerDirtyStateProvider(fnDirty);
            strictEqual(sap.ushell.Container.getDirtyFlag(), true, "isDirty value was set to true");
            done();
        });
    });

    test("test deregister external dirty methods", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            strictEqual(sap.ushell.Container.getDirtyFlag(), false, "isDirty default value is false");
            var fnDirty = function () {
                return true;
            };
            sap.ushell.Container.registerDirtyStateProvider(fnDirty);
            sap.ushell.Container.deregisterDirtyStateProvider(fnDirty);
            strictEqual(sap.ushell.Container.getDirtyFlag(), false, "isDirty value was set to false");

            done();
        });
    });

    test("test deregister external dirty methods (in case a function was registered multiple times, only the last should be removed)", function (assert) {
        // Arrange
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            strictEqual(sap.ushell.Container.getDirtyFlag(), false, "isDirty default value is false");
            var oFunctions = {
                "fnDirty": function () {
                    return true;
                },
                "fnDirtyOther": function () {
                    return true;
                }
            },
            spyDirtyOther = sinon.spy(oFunctions, "fnDirtyOther");

            /**
             * Act:
             * register functions to produce aRegisteredDirtyMethods=[fnDirty, fnDirtyOther, fnDirty]
             * deregister fnDirty
             * calling getDirtyFlag will call the first function in aRegisteredDirtyMethods that returns true
             */
            sap.ushell.Container.registerDirtyStateProvider(oFunctions.fnDirty);
            sap.ushell.Container.registerDirtyStateProvider(oFunctions.fnDirtyOther);
            sap.ushell.Container.registerDirtyStateProvider(oFunctions.fnDirty);

            sap.ushell.Container.deregisterDirtyStateProvider(oFunctions.fnDirty);

            sap.ushell.Container.getDirtyFlag();

            /**
             * Assert:
             * fnDirtyOther was not called, since deregistering starts at the back,
             * reducing the register to aRegisteredDirtyMethods=[fnDirty, fnDirtyOther]
             */
            strictEqual(spyDirtyOther.callCount, 0, "Last registration of nDirty was deregistered");

            done();
        });
    });

    asyncTest("sap.ushell.bootstrap: adapter package map, configuration", function () {
        var oConfig = {bar: "baz"};

        window["sap-ushell-config"] = {
            services: {
                Container: {
                    adapter: {
                        config: oConfig,
                        foo: function () { /*NOP*/ }
                    }
                }
            }
        };

        // new path for local ContainerAdapter
        jQuery.sap.declare("sap.ushell_foo.adapters.foo.ContainerAdapter");
        sap.ushell_foo.adapters.foo.ContainerAdapter = sap.ushell.adapters.local.ContainerAdapter;
        sinon.spy(sap.ushell_foo.adapters.foo, "ContainerAdapter");

        sap.ushell.bootstrap("foo", {foo: "sap.ushell_foo.adapters.foo"})
            .fail(testUtils.onError)
            .done(function () {
                start();
                ok(sap.ushell_foo.adapters.foo.ContainerAdapter.called,
                    "foo.ContainerAdapter created");
                deepEqual(sap.ushell_foo.adapters.foo.ContainerAdapter.args[0][2],
                    {config: oConfig}, "foo.ContainerAdapter configured");
            });
    });

    asyncTest("change platform via configuration", function () {
        window["sap-ushell-config"] = {
            platform: "local"
        };
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();
            ok(sap.ushell.adapters.local.ContainerAdapter.called, "local.ContainerAdapter created");
        });
    });

    var checkServiceFactoryCall = function (testParams) {
        var aActualFactory = oUi5ServiceFactory.createServiceFactory.getCall(testParams.iCallNumber).args;
        var aExpectedFactory = [testParams.sServiceName, testParams.bExpectedCallProtection];

        deepEqual(aActualFactory, aExpectedFactory,
            "createServiceFactory for the " + testParams.sServiceName + " Service was called with correct arguments.");
    };

    var checkUi5NativeServiceFactoryCall = function (testParams) {
        var aActualFactory = Ui5NativeServiceFactory.createServiceFactory.getCall(testParams.iCallNumber).args;
        var aExpectedFactory = [testParams.sServiceName];

        deepEqual(aActualFactory, aExpectedFactory,
            "createServiceFactory for the " + testParams.sServiceName + " Service was called with correct arguments.");

    };

    var checkUi5ServiceRegistryCall = function (testParams) {
        var aActualRegistry = ServiceFactoryRegistry.register.getCall(testParams.iCallNumber).args;
        var aExpectedRegistry = [
            "sap.ushell.ui5service." + testParams.sServiceName,
            {
                fakeFactoryFor: testParams.sServiceName
            }
        ];

        deepEqual(aActualRegistry, aExpectedRegistry, "ServiceFactoryRegistry#register was called with the expected " +
        "arguments when registering factory for the " + testParams.sServiceName + " Service");
    };

    asyncTest("sap.ushell.bootstrap: creates and registers all factories of injectable services", function () {
        window["sap-ushell-config"] = { platform: "local" };

        sinon.stub(oUi5ServiceFactory, "createServiceFactory", function (sServiceName) {
            return {
                "fakeFactoryFor": sServiceName
            };
        });
        sinon.stub(Ui5NativeServiceFactory, "createServiceFactory", function (sServiceName) {
            return {
                "fakeFactoryFor": sServiceName
            };
        });
        sinon.stub(ServiceFactoryRegistry, "register");

        // Act
        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {

                // Assert
                var aExpectedInjectableServices = [
                    "Personalization",
                    "URLParsing",
                    "CrossApplicationNavigation",
                    "Configuration"
                ];
                var aExpectedCardServices = [
                    "CardNavigation",
                    "CardUserRecents",
                    "CardUserFrequents"
                ];

                var iExpectedInjectableServices = aExpectedInjectableServices.length,
                    iExpectedCardServices = aExpectedCardServices.length;

                strictEqual(oUi5ServiceFactory.createServiceFactory.callCount, iExpectedInjectableServices,
                    "UI5ServiceFactory.createServiceFactory was called the expected number of times");
                strictEqual(oUi5NativeServiceFactory.createServiceFactory.callCount, iExpectedCardServices,
                    "UI5NativeServiceFactory.createServiceFactory was called the expected number of times");
                strictEqual(ServiceFactoryRegistry.register.callCount, iExpectedInjectableServices + iExpectedCardServices,
                    "ServiceFactoryRegistry.register was called the expected number of times");

                checkServiceFactoryCall({iCallNumber: 0, sServiceName: "Personalization", bExpectedCallProtection: true});
                checkServiceFactoryCall({iCallNumber: 1, sServiceName: "URLParsing", bExpectedCallProtection: true});
                checkServiceFactoryCall({iCallNumber: 2, sServiceName: "CrossApplicationNavigation", bExpectedCallProtection: true});
                checkServiceFactoryCall({iCallNumber: 3, sServiceName: "Configuration", bExpectedCallProtection: false});

                checkUi5NativeServiceFactoryCall({iCallNumber: 0, sServiceName: "CardNavigation"});
                checkUi5NativeServiceFactoryCall({iCallNumber: 1, sServiceName: "CardUserRecents"});
                checkUi5NativeServiceFactoryCall({iCallNumber: 2, sServiceName: "CardUserFrequents"});

                checkUi5ServiceRegistryCall({iCallNumber: 0, sServiceName: "Personalization"});
                checkUi5ServiceRegistryCall({iCallNumber: 1, sServiceName: "URLParsing"});
                checkUi5ServiceRegistryCall({iCallNumber: 2, sServiceName: "CrossApplicationNavigation"});
                checkUi5ServiceRegistryCall({iCallNumber: 3, sServiceName: "Configuration"});
                checkUi5ServiceRegistryCall({iCallNumber: 4, sServiceName: "CardNavigation"});
                checkUi5ServiceRegistryCall({iCallNumber: 5, sServiceName: "CardUserRecents"});
                checkUi5ServiceRegistryCall({iCallNumber: 6, sServiceName: "CardUserFrequents"});
            })
            .always(start);
    });

    asyncTest("module paths", function () {
        window["sap-ushell-config"] = {
            modulePaths: {
                "module1": "path1",
                "module2": "path2"
            }
        };
        sinon.stub(jQuery.sap, "registerModulePath");
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();
            ok(jQuery.sap.registerModulePath.calledWithExactly("module1", "path1"));
            ok(jQuery.sap.registerModulePath.calledWithExactly("module2", "path2"));
            ok(jQuery.sap.registerModulePath
                .calledBefore(sap.ushell.adapters.local.ContainerAdapter));
        });
    });

    asyncTest("sap.ushell.bootstrap.callback", function () {
        window["sap.ushell.bootstrap.callback"] = function () { /*NOP*/ };

        sinon.spy(window, "setTimeout");

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            ok(setTimeout.calledWith(window["sap.ushell.bootstrap.callback"]));
        });
    });

    /**
     * @param {string} sConfigRenderer
     *    the renderer name to be placed into the config
     * @param {string} sParamRenderer
     *    the renderer name to be placed into the param
     * @returns {object}
     *    the bootstrap promise allowing further tests
     */
    function testCreateRenderer (sConfigRenderer, sParamRenderer, bAsync, done) {
        sinon.spy(jQuery.sap, "require");
        sinon.spy(sap.ui, "require"); // Async

        if (sConfigRenderer) {
            window["sap-ushell-config"] = {
                defaultRenderer: sConfigRenderer
            };
        }

        return sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oRenderer,
                bPromiseReturned;

            if (!bAsync) {
                start();
            }
            // make sure that renderer does not create real content etc.
            sinon.stub(sap.ushell.renderers.fiori2.Renderer.prototype, "createContent");

            oRenderer = sap.ushell.Container.createRenderer(sParamRenderer, bAsync);

            if (bAsync) {
                // check if the call returned a Promise
                bPromiseReturned = Promise.resolve(oRenderer) == oRenderer;

                ok(bPromiseReturned, "Promise returned");

                oRenderer.then(function (oRenderer) {
                    strictEqual(sap.ui.require.args[2][0][0], "sap/ushell/renderers/fiori2/Renderer");
                    ok(oRenderer instanceof sap.ui.core.Control);
                    // components are automatically wrapped into a control
                    ok(oRenderer instanceof sap.ui.core.ComponentContainer);
                    strictEqual(oRenderer.getHeight(), "100%");
                    strictEqual(oRenderer.getWidth(), "100%");
                    ok(oRenderer.getComponentInstance()
                            instanceof sap.ushell.renderers.fiori2.Renderer);

                    ok(oRenderer !== sap.ushell.Container.createRenderer(sParamRenderer));
                    done();
                });
            } else {
                ok(jQuery.sap.require.calledWithExactly("sap.ushell.renderers.fiori2.Renderer"));
                ok(oRenderer instanceof sap.ui.core.Control);
                // components are automatically wrapped into a control
                ok(oRenderer instanceof sap.ui.core.ComponentContainer);
                strictEqual(oRenderer.getHeight(), "100%");
                strictEqual(oRenderer.getWidth(), "100%");
                ok(oRenderer.getComponentInstance()
                        instanceof sap.ushell.renderers.fiori2.Renderer);

                ok(oRenderer !== sap.ushell.Container.createRenderer(sParamRenderer));
            }
        });
    }

    asyncTest("createRenderer: from param", function () {
        testCreateRenderer(undefined, "fiori2").fail(testUtils.onError).done(function () {
            throws(function () {
                sap.ushell.Container.createRenderer();
            }, /Missing renderer name/);
        });
    });

    test("createRenderer: from param - Async", function (assert) {
        var done = assert.async();
        testCreateRenderer(undefined, "fiori2", true, done).fail(testUtils.onError).done(function () {
            throws(function () {
                sap.ushell.Container.createRenderer();
            }, /Missing renderer name/);
        });
    });

    asyncTest("createRenderer: from config", function () {
        testCreateRenderer("fiori2", undefined);
    });

    test("createRenderer: from config - Async", function (assert) {
        var done = assert.async();
        testCreateRenderer("fiori2", undefined, true, done);
    });

    asyncTest("createRenderer: from config and param, conflicting", function () {
        testCreateRenderer("nonexisting", "fiori2");
    });

    test("createRenderer: from config and param, conflicting - Async", function (assert) {
        var done = assert.async();
        testCreateRenderer("nonexisting", "fiori2", true, done);
    });

    function testCreateRendererWithConfiguration (bAsync, done) {
                // a simple test component
                var aPromise = [];

                jQuery.sap.declare("acme.foo.bar.MyComponent");
                sap.ui.core.UIComponent.extend("acme.foo.bar.MyComponent", {
                    createContent: function () { return new sap.ui.core.Icon(); },
                    metadata: {}
                });

                function testRenderer (sName) {
                    var oRenderer = sap.ushell.Container.createRenderer(sName, bAsync),
                        bPromiseReturned;

                    if (bAsync) {
                        bPromiseReturned = Promise.resolve(oRenderer) == oRenderer;

                        ok(bPromiseReturned, "Promise returned");
                        oRenderer.then(function (oRenderer) {
                            strictEqual(sap.ui.require.args[0][0][0], "acme/foo/bar/MyComponent", "Correct call to sap.ui.require");
                            ok(oRenderer instanceof sap.ui.core.ComponentContainer, "Renderer returns a component container");
                            ok(oRenderer.getComponentInstance() instanceof acme.foo.bar.MyComponent, "Instance correct");
                            deepEqual(oRenderer.getComponentInstance().getComponentData(), {config: {foo: "bar"}}, "Config correct");
                        });
                        return oRenderer;

                    }
                        ok(jQuery.sap.require.calledWithExactly("acme.foo.bar.MyComponent"));
                        ok(oRenderer instanceof sap.ui.core.ComponentContainer);
                        ok(oRenderer.getComponentInstance() instanceof acme.foo.bar.MyComponent);
                        deepEqual(oRenderer.getComponentInstance().getComponentData(), {config: {foo: "bar"}});

                }

                window["sap-ushell-config"] = {
                    defaultRenderer: "fiori2",
                    renderers: {
                        fiori2: {
                            module: "acme.foo.bar.MyComponent",
                            componentData: {
                                config: {foo: "bar"},
                                other: "unused"
                            }
                        }
                    }
                };
                sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
                    if (!bAsync) {
                        start();
                        sinon.spy(jQuery.sap, "require");
                        testRenderer("fiori2");
                        jQuery.sap.require.reset();
                        testRenderer();
                    } else {
                        sinon.spy(sap.ui, "require");
                        aPromise.push(testRenderer("fiori2"));
                        sap.ui.require.reset();
                        aPromise.push(testRenderer());
                        Promise.all(aPromise).then(function () {
                            done();
                        });
                    }
                });
    }

    asyncTest("createRenderer w/ configuration", function () {
        testCreateRendererWithConfiguration();
    });

    test("createRenderer w/ configuration - Async", function (assert) {
        var done = assert.async();
       testCreateRendererWithConfiguration(true, done);
    });

    asyncTest("createRenderer custom control", function () {
        var oRenderer;

        sinon.spy(jQuery.sap, "require");
        jQuery.sap.declare("acme.foo.bar.MyControl");
        sap.ui.core.Control.extend("acme.foo.bar.MyControl");

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            oRenderer = sap.ushell.Container.createRenderer("acme.foo.bar.MyControl");
            ok(jQuery.sap.require.calledWithExactly("acme.foo.bar.MyControl"));
            ok(oRenderer instanceof sap.ui.core.Control);
            ok(oRenderer instanceof acme.foo.bar.MyControl);
            ok(oRenderer !== sap.ushell.Container.createRenderer("acme.foo.bar.MyControl"));
        });
    });

    test("createRenderer custom control - Async", function (assert) {
        var oRenderer,
            done = assert.async(),
            bPromiseReturned;

        sinon.spy(sap.ui, "require");
        jQuery.sap.declare("acme.foo.bar.MyControl");
        sap.ui.core.Control.extend("acme.foo.bar.MyControl");

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {

            oRenderer = sap.ushell.Container.createRenderer("acme.foo.bar.MyControl", true);
            bPromiseReturned = Promise.resolve(oRenderer) == oRenderer;
            ok(bPromiseReturned, "Promise returned");
            oRenderer.then(function (oRenderer) {
                strictEqual(sap.ui.require.args[2][0][0], "acme/foo/bar/MyControl");
                ok(oRenderer instanceof sap.ui.core.Control);
                ok(oRenderer instanceof acme.foo.bar.MyControl);
                ok(oRenderer !== sap.ushell.Container.createRenderer("acme.foo.bar.MyControl"));
                done();
            });
        });
    });

    asyncTest("createRenderer wrong type", function () {
        sinon.spy(jQuery.sap, "require");
        jQuery.sap.declare("acme.foo.bar.MyThingy");
        acme.foo.bar.MyThingy = sinon.spy();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            throws(function () {
                sap.ushell.Container.createRenderer("acme.foo.bar.MyThingy");
            }, /Unsupported renderer type for name acme\.foo\.bar\.MyThingy/);

            // object was required nevertheless, even created...
            ok(jQuery.sap.require.calledWithExactly("acme.foo.bar.MyThingy"));
            ok(acme.foo.bar.MyThingy.calledOnce);
        });
    });

    test("createRenderer wrong type - Async", function (assert) {
        var done = assert.async();
        sinon.spy(sap.ui, "require");
        jQuery.sap.declare("acme.foo.bar.MyThingy");
        acme.foo.bar.MyThingy = sinon.spy();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {

            sap.ushell.Container.createRenderer("acme.foo.bar.MyThingy", true).catch(function (error) {
                strictEqual("Unsupported renderer type for name acme.foo.bar.MyThingy", error.message);
                // object was required nevertheless, even created...
                strictEqual(sap.ui.require.args[2][0][0], "acme/foo/bar/MyThingy");
                ok(acme.foo.bar.MyThingy.calledOnce);
                done();
            });
        });
    });

    asyncTest("createRenderer fires an event via the event provider when called for a ui5 control", function () {
        // Mock a control to use as a container
        jQuery.sap.declare("acme.foo.bar.MyControl");
        sap.ui.core.Control.extend("acme.foo.bar.MyControl");

        // Spy event provider
        var EventProvider = sap.ui.require("sap/ui/base/EventProvider");
        var oFireEventSpy = sinon.spy(EventProvider.prototype, "fireEvent");

        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var oRenderer = sap.ushell.Container.createRenderer("acme.foo.bar.MyControl"),
                    iCallCount;

                strictEqual(iCallCount = oFireEventSpy.callCount, 1, "EventProvider fired 1 event");
                if (iCallCount === 1) {
                    strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                    deepEqual(oFireEventSpy.getCall(0).args[1], {
                        renderer: oRenderer
                    }, "fired event contains renderer instance");
                }

                oFireEventSpy.restore();
                start();
            });
    });

    test("createRenderer fires an event via the event provider when called for a ui5 control - Async", function (assert) {
        // Mock a control to use as a container
        jQuery.sap.declare("acme.foo.bar.MyControl");
        sap.ui.core.Control.extend("acme.foo.bar.MyControl");
        var bPromiseReturned,
            done = assert.async();

        // Spy event provider
        var EventProvider = sap.ui.require("sap/ui/base/EventProvider");
        var oFireEventSpy = sinon.spy(EventProvider.prototype, "fireEvent");

        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var oRenderer = sap.ushell.Container.createRenderer("acme.foo.bar.MyControl", true),
                    iCallCount;

                bPromiseReturned = Promise.resolve(oRenderer) == oRenderer;
                ok(bPromiseReturned, "Promise returned");
                oRenderer.then(function (oRenderer) {
                    strictEqual(iCallCount = oFireEventSpy.callCount, 1, "EventProvider fired 1 event");
                    if (iCallCount === 1) {
                        strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                        deepEqual(oFireEventSpy.getCall(0).args[1], {
                            renderer: oRenderer
                        }, "fired event contains renderer instance");
                    }

                    oFireEventSpy.restore();
                    done();
                });
            });
    });

    asyncTest("createRenderer fires an event via the event provider when called for a ui5 component", function () {

        // a simple test component
        jQuery.sap.declare("acme.foo.bar.MyComponent");
        sap.ui.core.UIComponent.extend("acme.foo.bar.MyComponent", {
            createContent: function () { return new sap.ui.core.Icon(); },
            metadata: {}
        });

        // Spy event provider
        var EventProvider = sap.ui.require("sap/ui/base/EventProvider");
        var oFireEventSpy = sinon.spy(EventProvider.prototype, "fireEvent");

        sap.ushell.bootstrap("local")
        .fail(testUtils.onError)
        .done(function () {
            var oRendererControl = sap.ushell.Container.createRenderer("acme.foo.bar.MyComponent"),
                oRendererComponent,
                iCallCount;

            ok(oRendererControl instanceof sap.ui.core.ComponentContainer, "createRenderer returns sap.ui.core.ComponentContainer instance");
            oRendererComponent = oRendererControl.getComponentInstance(); // event and getter always return the component instance, not the control
            strictEqual(iCallCount = oFireEventSpy.callCount, 1, "EventProvider fired 1 event");
            if (iCallCount === 1) {
                strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                deepEqual(oFireEventSpy.getCall(0).args[1], {
                    renderer: oRendererComponent
                }, "fired event contains renderer component instance");
            }

            oFireEventSpy.restore();
            start();
        });
    });

    test("createRenderer fires an event via the event provider when called for a ui5 component - Async", function (assert) {

        var done = assert.async(),
            bPromiseReturned;
        // a simple test component
        jQuery.sap.declare("acme.foo.bar.MyComponent");
        sap.ui.core.UIComponent.extend("acme.foo.bar.MyComponent", {
            createContent: function () { return new sap.ui.core.Icon(); },
            metadata: {}
        });

        // Spy event provider
        var EventProvider = sap.ui.require("sap/ui/base/EventProvider");
        var oFireEventSpy = sinon.spy(EventProvider.prototype, "fireEvent");

        sap.ushell.bootstrap("local")
        .fail(testUtils.onError)
        .done(function () {
            var oRendererControl = sap.ushell.Container.createRenderer("acme.foo.bar.MyComponent", true),
                oRendererComponent,
                iCallCount;

            bPromiseReturned = Promise.resolve(oRendererControl) == oRendererControl;
            ok(bPromiseReturned, "Promise returned");
            oRendererControl.then(function (oRendererControl) {
                ok(oRendererControl instanceof sap.ui.core.ComponentContainer, "createRenderer returns sap.ui.core.ComponentContainer instance");
                oRendererComponent = oRendererControl.getComponentInstance(); // event and getter always return the component instance, not the control
                strictEqual(iCallCount = oFireEventSpy.callCount, 1, "EventProvider fired 1 event");
                if (iCallCount === 1) {
                    strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                    deepEqual(oFireEventSpy.getCall(0).args[1], {
                        renderer: oRendererComponent
                    }, "fired event contains renderer component instance");
                }

                oFireEventSpy.restore();
                done();
            });
        });
    });

    asyncTest("attachRendererCreatedEvent attaches event correctly to the event provider", function () {
        // Mock a control to use as a container
        jQuery.sap.declare("acme.foo.bar.MyControl");
        sap.ui.core.Control.extend("acme.foo.bar.MyControl");

        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var iCallLength,
                    fnCallback = function () { /* reacts to rendererCreated event */ };

                // Spy event provider
                var EventProvider = sap.ui.require("sap/ui/base/EventProvider");
                var oAttachEventSpy = sinon.spy(EventProvider.prototype, "attachEvent");

                sap.ushell.Container.attachRendererCreatedEvent(fnCallback);
                strictEqual(iCallLength = oAttachEventSpy.callCount, 1, "attachEvent method of Event provider was called 1 time");
                if (iCallLength === 1) {
                    deepEqual(oAttachEventSpy.getCall(0).args, ["rendererCreated", fnCallback], "attachEvent method was called with the expected arguments");
                }

                oAttachEventSpy.restore();
                start();
            });
    });

    asyncTest("detachRendererCreatedEvent detaches event correctly to the event provider", function () {
        // Mock a control to use as a container
        jQuery.sap.declare("acme.foo.bar.MyControl");
        sap.ui.core.Control.extend("acme.foo.bar.MyControl");

        // Spy event provider
        var EventProvider = sap.ui.require("sap/ui/base/EventProvider");
        var oDetachEventSpy = sinon.spy(EventProvider.prototype, "detachEvent");

        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var iCallLength,
                    fnCallback = function () { /* reacts to rendererCreated event */ };

                sap.ushell.Container.detachRendererCreatedEvent(fnCallback);
                strictEqual(iCallLength = oDetachEventSpy.callCount, 1, "detachEvent method of Event provider was called 1 time");
                if (iCallLength === 1) {
                    deepEqual(oDetachEventSpy.getCall(0).args, ["rendererCreated", fnCallback], "detachEvent method was called with the expected arguments");
                }

                oDetachEventSpy.restore();
                start();
            });
    });

    asyncTest("getRenderer with name - fiori2 renderer created", function () {
        var oRendererControl,
            oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            // make sure that renderer does not create real content etc.
            sinon.stub(sap.ushell.renderers.fiori2.Renderer.prototype, "createContent");

            oRendererControl = sap.ushell.Container.createRenderer("fiori2");
            oActualRenderer = sap.ushell.Container.getRenderer("fiori2");
            strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
        });
    });

    asyncTest("getRenderer without name - fallback to default renderer", function () {
        var oRendererControl,
        oActualRenderer;

        window["sap-ushell-config"] = {
                defaultRenderer: "fiori2"
        };

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            // make sure that renderer does not create real content etc.
            sinon.stub(sap.ushell.renderers.fiori2.Renderer.prototype, "createContent");

            oRendererControl = sap.ushell.Container.createRenderer();
            oActualRenderer = sap.ushell.Container.getRenderer();
            strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
        });
    });

    asyncTest("getRenderer - returns control instance if plain control", function () {
        var oRendererControl,
        oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            jQuery.sap.declare("acme.foo.bar.MyControl");
            sap.ui.core.Control.extend("acme.foo.bar.MyControl");
            oRendererControl = sap.ushell.Container.createRenderer("acme.foo.bar.MyControl");

            oActualRenderer = sap.ushell.Container.getRenderer();
            strictEqual(oActualRenderer, oRendererControl);
        });
    });

    asyncTest("getRenderer without name - fallback to single instance", function () {
        var oRendererControl,
            oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            // make sure that renderer does not create real content etc.
            sinon.stub(sap.ushell.renderers.fiori2.Renderer.prototype, "createContent");

            oRendererControl = sap.ushell.Container.createRenderer("fiori2");
            oActualRenderer = sap.ushell.Container.getRenderer();
            strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
        });
    });

    asyncTest("getRenderer without name - no fallback if multiple instances", function () {
        var oActualRenderer,
            oLogMock = testUtils.createLogMock().warning(
                "getRenderer() - cannot determine renderer, because no default renderer is configured and multiple instances exist.",
                undefined,
                "sap.ushell.services.Container");


        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            // make sure that renderer does not create real content etc.
            sinon.stub(sap.ushell.renderers.fiori2.Renderer.prototype, "createContent");
            sap.ushell.Container.createRenderer("fiori2");

            jQuery.sap.declare("acme.foo.bar.MyControl");
            sap.ui.core.Control.extend("acme.foo.bar.MyControl");
            sap.ushell.Container.createRenderer("acme.foo.bar.MyControl");

            oActualRenderer = sap.ushell.Container.getRenderer();
            ok(oActualRenderer === undefined);
            oLogMock.verify();
        });
    });

    asyncTest("getRenderer with name - returns undefined if not yet created", function () {
        var oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            oActualRenderer = sap.ushell.Container.getRenderer("notYetCreated");
            ok(oActualRenderer === undefined);
        });
    });

    asyncTest("getRenderer with name - returns undefined if other renderer", function () {
        var oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            // make sure that renderer does not create real content etc.
            sinon.stub(sap.ushell.renderers.fiori2.Renderer.prototype, "createContent");

            sap.ushell.Container.createRenderer("fiori2");

            oActualRenderer = sap.ushell.Container.getRenderer("anotherRenderer");
            ok(oActualRenderer === undefined);
        });
    });

    asyncTest("Missing service name", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            throws(function () {
                sap.ushell.Container.getService();
            }, /Missing service name/, "getService complains when no service name given");
        });
    });

    function getServiceTest (assert, bAsync) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var bPromiseReturned,
                oRequireStub,
                oBarService;

            var oServiceConstructorStub = sinon.stub();
            oServiceConstructorStub.hasNoAdapter = false;
            if (bAsync) {
                oRequireStub = sinon.stub(sap.ui, "require", function (aLibs, fnHandler) {
                    fnHandler(oServiceConstructorStub);
                });
            } else {
                oRequireStub = sinon.stub(sap.ui, "requireSync").returns(
                oServiceConstructorStub
                );
            }

            // use virtual Bar service for testing service creation with adapter
            jQuery.sap.declare("sap.ushell.adapters.local.BarAdapter");
            sap.ushell.adapters.local.BarAdapter = function (oSystem, sParameter, oProperties) {
                //start();
                // simple check if the given system is the logon system
                strictEqual(oSystem.getPlatform(), "local");
                strictEqual(oSystem.getAlias(), "");
                strictEqual(sParameter, undefined);
                deepEqual(oProperties, {config: {}});
            };

            // code under test
            if (bAsync) {
                oBarService = sap.ushell.Container.getServiceAsync("Bar", undefined);

                bPromiseReturned = Promise.resolve(oBarService) == oBarService;
                ok(bPromiseReturned, "Promise returned");
            } else {
                oBarService = Promise.resolve(sap.ushell.Container.getService("Bar", undefined));
            }

            // assertions
            oBarService.then(function (oBarService) {
                if (bAsync) {
                    ok(oBarService instanceof oServiceConstructorStub,
                        "getServiceAsync returned the created service");

                    ok(oRequireStub.calledWith(["sap/ushell/services/Bar"]),
                        "required the Bar service");

                    ok(oRequireStub.calledWith(["sap/ushell/adapters/local/BarAdapter"]),
                        "required the Bar adapter for local platform");
                } else {
                    ok(oBarService instanceof oServiceConstructorStub,
                        "getService returned the created service");

                    ok(oRequireStub.calledWithExactly("sap/ushell/services/Bar"),
                        "required the Bar service");

                    ok(oRequireStub.calledWithExactly("sap/ushell/adapters/local/BarAdapter"),
                        "required the Bar adapter for local platform");
                }
                strictEqual(oRequireStub.callCount, 2, "require was called twice");


                strictEqual(sap.ushell.Container.getService("Bar"), oBarService,
                    "second call delivers the same instance");

                strictEqual(oRequireStub.callCount, 2, "require was not called again");

                var oServiceAdapter = oServiceConstructorStub.args[0][0];
                var oContainerInterface = oServiceConstructorStub.args[0][1];
                var sParameter = oServiceConstructorStub.args[0][2];
                var oProperties = oServiceConstructorStub.args[0][3];

                ok(oServiceAdapter instanceof sap.ushell.adapters.local.BarAdapter,
                    "Service constructor was called with an instance of the adapter as first parameter");
                strictEqual(typeof oContainerInterface.createAdapter, "function");
                strictEqual(sParameter, undefined);
                deepEqual(oProperties, {config: {}});
                done();
            });
        });

    }
    test("getService", function (assert) {
        getServiceTest(assert, false);
    });

    test("getServiceAsync", function (assert) {
        getServiceTest(assert, true);
    });

function getServiceWConfig (assert, bAsync) {
    window["sap-ushell-config"] = {
        services: {
            Bar: {
                module: "acme.foo.Bar",
                config: {foo: "bar"}
            }
        }
    };
    var done = assert.async();

    sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
        var oBarService,
            oRequireStub,
            bPromiseReturned;

        // check that config changes after bootstrap have no effect
        window["sap-ushell-config"] = {
            services: {
                Bar: {
                    module: "sap.ushell.services.Bar"
                }
            }
        };

        // use virtual Bar service for testing service creation with adapter
        jQuery.sap.declare("sap.ushell.adapters.local.BarAdapter");
        sap.ushell.adapters.local.BarAdapter = function (oSystem, sParameter) {
            // simple check if the given system is the logon system
            strictEqual(oSystem.getPlatform(), "local");
            strictEqual(oSystem.getAlias(), "");
            strictEqual(sParameter, undefined);
        };

        var oServiceConstructorStub = sinon.stub();
        oServiceConstructorStub.hasAdapter = false;

        if (bAsync) {
            oRequireStub = sinon.stub(sap.ui, "require", function (aLibs, fnHandler) {
                fnHandler(oServiceConstructorStub);
            });
        } else {
            oRequireStub = sinon.stub(sap.ui, "requireSync").returns(
                oServiceConstructorStub);
        }

        // code under test
        if (bAsync) {
            oBarService = sap.ushell.Container.getServiceAsync("Bar", undefined);

            bPromiseReturned = Promise.resolve(oBarService) == oBarService;
            ok(bPromiseReturned, "Promise returned");

        } else { // if not Async, convert object to Promise
            oBarService = Promise.resolve(sap.ushell.Container.getService("Bar", undefined));
        }
        // assertions
        oBarService.then(function (oBarService) {
            ok(oBarService instanceof oServiceConstructorStub, "getService returned the created service");

            strictEqual(oRequireStub.callCount, 2, (bAsync) ? "require was called twice": "requireSync was called twice");

            var oServiceAdapter = oServiceConstructorStub.args[0][0];
            var oContainerInterface = oServiceConstructorStub.args[0][1];
            var sParameter = oServiceConstructorStub.args[0][2];
            var oProperties = oServiceConstructorStub.args[0][3];

            ok(oServiceAdapter instanceof sap.ushell.adapters.local.BarAdapter);
            strictEqual(typeof oContainerInterface.createAdapter, "function");
            strictEqual(sParameter, undefined);
            deepEqual(oProperties, {config: {foo: "bar"}});
            done();
        });
    });
}

    test("getService w/ config", function (assert) {
        getServiceWConfig(assert, false);
    });

    test("getServiceAsync w/ config", function (assert) {
        getServiceWConfig(assert, true);
    });

    function getServiceWAdapterConfig (assert, bAsync) {
        var done = assert.async(),
            oRequireStub,
            bPromiseReturned,
            oBarService;

        window["sap-ushell-config"] = {
            services: {
                Bar: {
                    adapter: {
                        module: "sap.ushell.adapters.sandbox.BarAdapter",
                        config: {foo: "bar"}
                    }
                }
            }
        };
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {

            // use virtual Bar service for testing service creation with adapter
            jQuery.sap.declare("sap.ushell.adapters.sandbox.BarAdapter");
            sap.ushell.adapters.sandbox.BarAdapter = function (oSystem, sParameter, oProperties) {
                // simple check if the given system is the logon system
                strictEqual(oSystem.getPlatform(), "local");
                strictEqual(oSystem.getAlias(), "");
                strictEqual(sParameter, undefined);
                deepEqual(oProperties, {config: {foo: "bar"}});
            };

            var oServiceConstructorStub = sinon.stub();
            oServiceConstructorStub.hasAdapter = false;
            if (bAsync) {
                oRequireStub = sinon.stub(sap.ui, "require", function (aLibs, fnHandler) {
                    fnHandler(oServiceConstructorStub);
                });
            } else {
                oRequireStub = sinon.stub(sap.ui, "requireSync").returns(
                    oServiceConstructorStub);
            }

            // code under test
            if (bAsync) {
                oBarService = sap.ushell.Container.getServiceAsync("Bar", undefined);
                bPromiseReturned = Promise.resolve(oBarService) == oBarService;
                ok(bPromiseReturned, "Promise returned");
            } else { // if not Async, convert object to Promise
                oBarService = Promise.resolve(sap.ushell.Container.getService("Bar", undefined));
            }

            oBarService.then(function (oBarService) {
                strictEqual(oRequireStub.callCount, 2, (bAsync) ? "require was called twice" : "requireSync was called twice");

                var oServiceAdapter = oServiceConstructorStub.args[0][0];
                var oContainerInterface = oServiceConstructorStub.args[0][1];

                ok(oServiceAdapter instanceof sap.ushell.adapters.sandbox.BarAdapter);
                strictEqual(typeof oContainerInterface.createAdapter, "function");
                done();
            });
        });
    }

    test("getService w/ adapter config", function (assert) {
        getServiceWAdapterConfig(assert, false);
    });

    test("getServiceAsync w/ adapter config", function (assert) {
        getServiceWAdapterConfig(assert, true);
    });

    asyncTest("getService without adapter, but with parameter", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oFooService;

            start();
            sinon.spy(jQuery.sap, "require");

            var oServiceConstructorStub = sinon.stub();
            oServiceConstructorStub.hasNoAdapter = true;
            var oRequireSyncStub = sinon.stub(sap.ui, "requireSync").returns(
                oServiceConstructorStub
            );

            // code under test
            oFooService = sap.ushell.Container.getService("Foo", "bar");

            // assertions
            ok(oFooService instanceof oServiceConstructorStub,
                "getService returned the created service");

            ok(oRequireSyncStub.calledWithExactly("sap/ushell/services/Foo"),
                "required the Foo service");
            ok(jQuery.sap.require.neverCalledWith("sap.ushell.adapters.local.FooAdapter"),
                "did NOT require the Foo adapter for local platform");

            strictEqual(oRequireSyncStub.callCount, 1, "requireSync was called one time");

            var oContainerInterface = oServiceConstructorStub.args[0][0];
            var sParameter = oServiceConstructorStub.args[0][1];

            strictEqual(typeof oContainerInterface.createAdapter, "undefined");
            strictEqual(sParameter, "bar");
        });
    });

    test("getServiceAsync without adapter, but with parameter", function (assert) {
        var done = assert.async(),
            bPromiseReturned;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oFooService;

            var oServiceConstructorStub = sinon.stub();
            oServiceConstructorStub.hasNoAdapter = true;
            var oRequireStub = sinon.stub(sap.ui, "require", function (aLibs, fnHandler) {
                fnHandler(oServiceConstructorStub);
            });

            // code under test
            oFooService = sap.ushell.Container.getServiceAsync("Foo", "bar");

            bPromiseReturned = Promise.resolve(oFooService) == oFooService;
            ok(bPromiseReturned, "Promise returned");

            // assertions
            oFooService.then(function (oFooService) {
                ok(oFooService instanceof oServiceConstructorStub,
                    "getServiceAsync returned the created service");

                ok(oRequireStub.calledWith(["sap/ushell/services/Foo"]),
                    "required the Foo service");
                ok(sap.ui.require.neverCalledWith(["sap.ushell.adapters.local.FooAdapter"]),
                    "did NOT require the Foo adapter for local platform");

                strictEqual(oRequireStub.callCount, 1, "require was called one time");

                var oContainerInterface = oServiceConstructorStub.args[0][0];
                var sParameter = oServiceConstructorStub.args[0][1];

                strictEqual(typeof oContainerInterface.createAdapter, "undefined");
                strictEqual(sParameter, "bar");
                done();
            });
        });
    });

    function getServiceWitoutAdapterWithConfig (assert, bAsync) {
            window["sap-ushell-config"] = {
                services: {
                    Bar: {
                        module: "acme.foo.Bar",
                        config: {foo: "bar"}
                    }
                }
            };
            var done = assert.async(),
                oRequireStub,
                bPromiseReturned;

            sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
                var oBarService;

                var oServiceConstructorStub = sinon.stub();
                oServiceConstructorStub.hasNoAdapter = true;
                if (bAsync) {
                    oRequireStub = sinon.stub(sap.ui, "require", function (aLibs, fnHandler) {
                        fnHandler(oServiceConstructorStub);
                    });
                } else {
                    oRequireStub = sinon.stub(sap.ui, "requireSync").returns(
                        oServiceConstructorStub);
                }

                // code under test
                if (bAsync) {
                    oBarService = sap.ushell.Container.getServiceAsync("Bar");
                    bPromiseReturned = Promise.resolve(oBarService) == oBarService;
                    ok(bPromiseReturned, "Promise returned");
                } else { // if not Async, convert object to Promise
                    oBarService = Promise.resolve(sap.ushell.Container.getService("Bar"));
                }
                // assertions
                oBarService.then(function (oBarService) {
                    ok(oBarService instanceof oServiceConstructorStub, "getService returned the created service");

                    var sParameter = oServiceConstructorStub.args[0][1];
                    var oProperties = oServiceConstructorStub.args[0][2];

                    strictEqual(oRequireStub.callCount, 1, (bAsync) ? "requireSync was called one time" : "requireSync was called one time");
                    strictEqual(sParameter, undefined);
                    deepEqual(oProperties.config, {foo: "bar"});
                    done();
                });
            });
    }

    test("getService without adapter, but with config", function (assert) {

        getServiceWitoutAdapterWithConfig(assert, false);
    });

    test("getServiceAsync without adapter, but with config", function (assert) {

        getServiceWitoutAdapterWithConfig(assert, false);
    });

    asyncTest("getService with parameter", function () {

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oBarService;

            start();

            // use virtual Bar service for testing service creation with adapter
            jQuery.sap.declare("sap.ushell.adapters.local.BarAdapter");
            sap.ushell.adapters.local.BarAdapter = function (oSystem, sParameter) {
                // simple check if the given system is the logon system
                strictEqual(oSystem.getPlatform(), "local");
                strictEqual(oSystem.getAlias(), "");
                strictEqual(sParameter, "parameter");
            };

            // the service
            var oServiceConstructorStub = sinon.stub();
            oServiceConstructorStub.hasAdapter = false;
            var oRequireSyncStub = sinon.stub(sap.ui, "requireSync").returns(
                oServiceConstructorStub
            );

            // ***** code under test
            oBarService = sap.ushell.Container.getService("Bar", "parameter");

            // assertions
            ok(oBarService instanceof oServiceConstructorStub,
                "getService returned the created service");

            ok(oRequireSyncStub.calledWithExactly("sap/ushell/services/Bar"),
                "required the Bar service");
            ok(oRequireSyncStub.calledWithExactly("sap/ushell/adapters/local/BarAdapter"),
                "required the Bar adapter for local platform");

            strictEqual(oRequireSyncStub.getCalls().length, 2, "requireSync was called twice");

            // ***** create it again

            //// delete sap.ushell.services.Bar; // must not be called again
            strictEqual(sap.ushell.Container.getService("Bar", "parameter"), oBarService,
                "second call delivers the same instance");

            strictEqual(oRequireSyncStub.getCalls().length, 2, "requireSync was not called further");

            // ***** create another one
            sap.ushell.adapters.local.BarAdapter = function (oSystem, sParameter) {
                //start();
                // simple check if the given system is the logon system
                strictEqual(oSystem.getPlatform(), "local");
                strictEqual(oSystem.getAlias(), "");
                strictEqual(sParameter, undefined);
            };

            notStrictEqual(sap.ushell.Container.getService("Bar", undefined), oBarService,
                "new instance for different parameter");

            strictEqual(oRequireSyncStub.getCalls().length, 4, "requireSync was called four times");
        });
    });

    test("getServiceAsync with parameter", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oBarService,
                oBarServiceBackup,
                oRequireStub,
                bPromiseReturned;

            // use virtual Bar service for testing service creation with adapter
            jQuery.sap.declare("sap.ushell.adapters.local.BarAdapter");
            sap.ushell.adapters.local.BarAdapter = function (oSystem, sParameter) {
                // simple check if the given system is the logon system
                strictEqual(oSystem.getPlatform(), "local");
                strictEqual(oSystem.getAlias(), "");
                strictEqual(sParameter, "parameter");
            };

            // the service
            var oServiceConstructorStub = sinon.stub();
            oServiceConstructorStub.hasAdapter = false;
            oRequireStub = sinon.stub(sap.ui, "require", function (aLibs, fnHandler) {
                fnHandler(oServiceConstructorStub);
            });

            // ***** code under test
            oBarService = sap.ushell.Container.getServiceAsync("Bar", "parameter");

            // assertions
            bPromiseReturned = Promise.resolve(oBarService) === oBarService;
            ok(bPromiseReturned, "Promise returned");

            var oExpectedRequiredDependencies = {
                "sap/ushell/services/Bar": true,
                "sap/ushell/adapters/local/BarAdapter": true
            };

            oBarService.then(function (oBarService) {
                ok(oBarService instanceof oServiceConstructorStub,
                    "getService returned the created service");

                var iExpectedRequireCalls = getExpectedRequireCalls(oRequireStub, oExpectedRequiredDependencies);
                strictEqual(iExpectedRequireCalls, 2, "require was called on the desired dependencies");

                oBarServiceBackup = oBarService;
                // ***** create it again

                //// delete sap.ushell.services.Bar; // must not be called again
                return sap.ushell.Container.getServiceAsync("Bar", "parameter");
            })
            .then(function (oBarService2) {

                strictEqual(oBarService2, oBarServiceBackup, "second call delivers the same instance");

                var iExpectedRequireCalls = getExpectedRequireCalls(oRequireStub, oExpectedRequiredDependencies);
                strictEqual(iExpectedRequireCalls, 2, "require was not called further on the desired dependencies");

                // ***** create another one
                sap.ushell.adapters.local.BarAdapter = function (oSystem, sParameter) {
                    //start();
                    // simple check if the given system is the logon system
                    strictEqual(oSystem.getPlatform(), "local");
                    strictEqual(oSystem.getAlias(), "");
                    strictEqual(sParameter, undefined);
                };

                return sap.ushell.Container.getServiceAsync("Bar", undefined);
            })
            .then(function (oBarService3) {
                notStrictEqual(oBarService3, oBarServiceBackup,
                    "new instance for different parameter");

                var iExpectedRequireCalls = getExpectedRequireCalls(oRequireStub, oExpectedRequiredDependencies);
                strictEqual(iExpectedRequireCalls, 4, "require was called four times on the desired dependencies");
                done();
            });
        });

        function getExpectedRequireCalls (oRequireStub, oExpectedRequiredDependencies) {
            return oRequireStub.getCalls().filter(function (oCall) {
                var aRequiredDependencies = oCall.args[0];
                return aRequiredDependencies.every(function (sDependency) {
                    return oExpectedRequiredDependencies[sDependency];
                });
            }).length;
        }

    });

    asyncTest("getService with custom name", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();

            throws(function () {
                sap.ushell.Container.getService("acme.foo.bar.MyService");
            }, /Unsupported service name/);
        });
    });

    test("getService with custom name", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {

            throws(function () {
                sap.ushell.Container.getServiceAsync("acme.foo.bar.MyService");
            }, /Unsupported service name/);
            done();
        });
    });

    test("createAdapter (for remote system)", function () {
        stop(3);

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oFooSystem = new System({platform: "foo"});

            sinon.spy(jQuery.sap, "require");
            // use virtual Bar service for testing service creation with remote adapter
            jQuery.sap.declare("sap.ushell.adapters.local.BarAdapter");
            sap.ushell.adapters.local.BarAdapter = function (oSystem, sParameter) {
                start();
                // simple check if the given system is the logon system
                strictEqual(oSystem.getPlatform(), "local");
                strictEqual(oSystem.getAlias(), "");
                strictEqual(sParameter, "parameter");
            };

            jQuery.sap.declare("sap.ushell.adapters.foo.BarAdapter");
            sap.ushell.adapters.foo.BarAdapter = function (oSystem, sParameter) {
                start();
                strictEqual(oSystem, oFooSystem);
                strictEqual(sParameter, "parameter");
            };

            var fnService = function (oServiceAdapter, oContainerInterface, sParameter) {
                var oPromise;

                // code under test
                throws(function () {
                    oContainerInterface.createAdapter();
                }, /Missing system/);
                oPromise = oContainerInterface.createAdapter(oFooSystem);

                strictEqual(typeof oPromise.done, "function",
                    "createAdapter() returned a jQuery promise");
                strictEqual(oPromise.resolve, undefined,
                    "createAdapter() does not return the jQuery deferred object itself");

                oPromise.done(function (oAdapter) {
                    start();

                    ok(jQuery.sap.require.calledWithExactly("sap.ushell.adapters.foo.BarAdapter"),
                        "required the Bar adapter for foo platform");
                });
            };
            fnService.hasAdapter = false;

            sinon.stub(sap.ui, "requireSync").returns(
                fnService
            );

            sap.ushell.Container.getService("Bar", "parameter");
        });
    });

    test("getLogonSystem", function (assert) {
        var done = assert.async();
        var oSystem = new System({alias: "", platform: "local"}),
            oSystemAfterBootstrap;

        sap.ushell.bootstrap(oSystem.getPlatform()).done(function () {
            oSystemAfterBootstrap = sap.ushell.Container.getLogonSystem();
            ok(oSystemAfterBootstrap instanceof System);
            strictEqual(oSystem.getAlias(), oSystemAfterBootstrap.getAlias());
            strictEqual(oSystem.getBaseUrl(), oSystemAfterBootstrap.getBaseUrl());
            strictEqual(oSystem.getClient(), oSystemAfterBootstrap.getClient());
            strictEqual(oSystem.getName(), oSystemAfterBootstrap.getName());
            strictEqual(oSystem.getPlatform(), oSystemAfterBootstrap.getPlatform());
            done();
        });
    });

    test("getUser", function (assert) {
        var done = assert.async();
        var oSystem = new System({alias: "", platform: "local"}),
            oUser;

        sap.ushell.bootstrap(oSystem.getPlatform()).done(function () {
            oUser = sap.ushell.Container.getUser();
            ok(oUser instanceof sap.ushell.User);
            done();
        });
    });

    asyncTest("addRemoteSystem", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oSystem = new System({
                    alias: "test",
                    platform: "dummy",
                    baseUrl: "/baseUrl"
                }),
                oChangedSystem = new System({
                    alias: "test",
                    platform: "foo",
                    baseUrl: "/bar"
                }),
                oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.Container")
                    .debug("Added " + oSystem, null, "sap.ushell.Container")
                    .warning("Replacing " + oSystem + " by " + oChangedSystem, null,
                        "sap.ushell.Container");

            start();
            sap.ushell.Container.addRemoteSystem(oSystem);
            sap.ushell.Container.addRemoteSystem(oSystem);
            ok(utils.localStorageSetItem.calledOnce, "localStorageSetItem called once");
            ok(utils.localStorageSetItem.calledWithExactly(
                "sap.ushell.Container.local.remoteSystem.test",
                oSystem
            ), "localStorageSetItem called with right arguments");

            utils.localStorageSetItem.reset();
            sap.ushell.Container.addRemoteSystem(oChangedSystem);
            sap.ushell.Container.addRemoteSystem(oChangedSystem);
            ok(utils.localStorageSetItem.calledOnce, "localStorageSetItem called once");
            ok(utils.localStorageSetItem.calledWithExactly(
                "sap.ushell.Container.local.remoteSystem.test",
                oChangedSystem
            ), "localStorageSetItem called with right arguments");

            oLogMock.verify();
        });
    });

    asyncTest("addRemoteSystemForServiceUrl(sServiceUrl)", function () {
        /**
         * Perform some checks for a valid sample URL.
         *
         * @param {string} sAlias
         *   the expected system alias
         * @param {string} sPlatform
         *   the expected system platform
         * @param {string} sUrl
         *   the valid sample URL
         */
        function check (sAlias, sPlatform, sUrl) {
            var oSystemData = {
                alias: sAlias,
                baseUrl: ";o=",
                platform: sPlatform
            };
            sap.ushell.Container.addRemoteSystem.reset();

            // code under test
            sap.ushell.Container.addRemoteSystemForServiceUrl(sUrl);

            ok(sap.ushell.Container.addRemoteSystem.calledOnce, "valid URL: " + sUrl);
            deepEqual(JSON.parse(sap.ushell.Container.addRemoteSystem.args[0][0].toString()),
                oSystemData, "URL: " + sUrl); // test does not rely on order of properties
        }

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();
            sinon.stub(sap.ushell.Container, "addRemoteSystem");

            // Note: we assume that OData service URLs do not contain a fragment part!

            // unsupported URLs
            [
                undefined,
                "",
                "http://sap.com:1234/sap/hana",
                "//sap.com:1234/sap/hana",
                // missing ;o=
                "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages/$count",
                // segment parameter inside URL parameters
                "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages/$count?$format=json;o=FOO",
                // platform cannot be detected
                "/sap/foo/odata/UI2/PAGE_BUILDER_PERS;o=FOO/Pages/$count"
            ].forEach(function (sUrl) {
                sap.ushell.Container.addRemoteSystemForServiceUrl(sUrl);
                ok(!sap.ushell.Container.addRemoteSystem.called,
                    sap.ushell.Container.addRemoteSystem.printf("unsupported URL: %*%C", sUrl));
            });

            // valid ABAP sample URLs
            // Dynamic Tile from local catalog pointing to some remote system via its data URL
            check("FOO", "abap", "/sap/opu/odata/UI2/PAGE_BUILDER_PERS;o=FOO/Pages/$count");

            // valid HANA sample URLs
            [
                // mock Lumira Story List, maybe from a remote catalog
                "/sap/bi/launchpad/v3.xsodata;o=BAR/Items/$count",
                // any /sap/hana/... URL
                "/sap/hana/apps/foo;o=BAR/Items/$count",
                // segment parameter within "platform prefix"
                "/sap;o=BAR/hana/apps/foo/Items/$count",
                // segment parameter within "platform prefix"
                "/sap/hana;o=BAR/apps/foo/Items/$count",
                // segment parameter at the end
                "/sap/hana/apps/foo/Items/$count;o=BAR",
                // multiple segment parameters
                "/sap/hana/apps/foo;o=BAR;foo=bar/Items/$count",
                // segment parameter just before URL parameters
                "/sap/hana/apps/foo/Items/$count;o=BAR?$format=json",
                // mock KPI Tile, maybe from a remote catalog
                "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata;o=BAR/Catalogs/$count"
            ].forEach(check.bind(null, "BAR", "hana"));

            // legacy HANA support --> system alias "hana" as fallback
            [
                "/sap/bi/launchpad/v3.xsodata/Items/$count",
                "/sap/hana/apps/foo/Items/$count",
                "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/Catalogs/$count"
            ].forEach(check.bind(null, "hana", "hana"));
        });
    });
    //TODO do not overwrite existing system (i.e. do not overwrite "real" platform with a
    //     heuristically detected platform)?

    asyncTest("sap.ushell.Container#addRemoteSystemForServiceUrl", function () {
        var fnListener,
            sUrl = "/foo";

        sinon.stub(sap.ui.getCore().getEventBus(), "subscribe",
            function (sChannelId, sEventId, fnFunction, oListener) {
                strictEqual(sChannelId, "sap.ushell.Container");
                strictEqual(sEventId, "addRemoteSystemForServiceUrl");
                fnListener = fnFunction;
                strictEqual(oListener, undefined, "use Function.prototype.bind instead!");
            });

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();
            sinon.stub(sap.ushell.Container, "addRemoteSystemForServiceUrl");

            ok(sap.ui.getCore().getEventBus().subscribe.calledOnce,
                "Container subscribes to event bus immediately");

            // simulate published event
            fnListener("sap.ushell.Container", "addRemoteSystemForServiceUrl", sUrl);

            ok(sap.ushell.Container.addRemoteSystemForServiceUrl.calledWithExactly(sUrl));
        });
    });

    asyncTest("addRemoteSystem: don't add local system", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var sBaseUrl = new URI(window.location.href).origin(),
                sClient = sap.ushell.Container.getLogonSystem().getClient(),
                oSystem = new System({
                    alias: "LOCAL",
                    platform: "dummy",
                    baseUrl: "/baseUrl"
                }),
                oSystemwithLowCase = new System({
                    alias: "local",
                    platform: "dummy",
                    baseUrl: "/baseUrl"
                }),
                oSystemWithAbsoluteUrl = new System({
                    alias: sBaseUrl + "?sap-client=" + sClient,
                    baseUrl: sBaseUrl,
                    platform: "dummy",
                    client: sClient
                });

            start();
            sap.ushell.Container.addRemoteSystem(oSystem);
            sap.ushell.Container.addRemoteSystem(oSystemwithLowCase);
            sap.ushell.Container.addRemoteSystem(oSystemWithAbsoluteUrl);

            ok(!utils.localStorageSetItem.notCalled, "local system should not be added as remote system");
        });
    });

    asyncTest("_getRemoteSystems", function () {
        var oSystemData = {
                alias: "test",
                platform: "dummy",
                baseUrl: "/baseUrl"
            },
            oSystemData2 = {
                alias: "test2",
                platform: "dummy2",
                baseUrl: "/baseUrl2"
            },
            oLocalStorage = mockLocalStorage({
                foo: "bar",
                "sap.ushell.Container.local.remoteSystem.test": JSON.stringify(oSystemData),
                bar: "baz",
                "sap.ushell.Container.local.remoteSystem.test2": JSON.stringify(oSystemData2)
            });
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var mSystems;

            start();

            mSystems = sap.ushell.Container._getRemoteSystems();
            ok(oLocalStorage.getItem.calledWith("sap.ushell.Container.local.remoteSystem.test"),
                    "checked test in localStorage");
            ok(oLocalStorage.getItem.calledWith("sap.ushell.Container.local.remoteSystem.test2"),
                    "checked test2 in localStorage");
            ok(mSystems, "mSystems defined");
            ok(mSystems[oSystemData.alias], "contains key " + oSystemData.alias);
            strictEqual(mSystems[oSystemData.alias].getAlias(), oSystemData.alias, "same alias");
            strictEqual(mSystems[oSystemData.alias].getPlatform(), oSystemData.platform,
                    "same platform");
            strictEqual(mSystems[oSystemData.alias].getBaseUrl(), oSystemData.baseUrl,
                    "same baseUrl");
            ok(mSystems[oSystemData2.alias], "contains key " + oSystemData2.alias);
            strictEqual(mSystems[oSystemData2.alias].getAlias(), oSystemData2.alias, "same alias");
            strictEqual(mSystems[oSystemData2.alias].getPlatform(), oSystemData2.platform,
                    "same platform");
            strictEqual(mSystems[oSystemData2.alias].getBaseUrl(), oSystemData2.baseUrl,
                    "same baseUrl");
        });
    });

    asyncTest("logout(): simple case", function () {
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        mockLocalStorage();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oContainerAdapter = sap.ushell.adapters.local.ContainerAdapter.thisValues[0];

            sinon.spy(oContainerAdapter, "logout");
            sap.ushell.Container.logout().done(function () {
                start();
                ok(oContainerAdapter.logout.calledOnce);
                ok(oContainerAdapter.logout.calledWith(true));
            });
        });
    });

    asyncTest("test registerLogout", function (assert) {

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {

            var fnCustomLogout = sinon.spy(function () {
                return new jQuery.Deferred().resolve().promise();
            });

            var orgLogout = sap.ushell.Container.logout;

            sap.ushell.Container.registerLogout(fnCustomLogout);

            sap.ushell.Container.logout().done(function () {
                ok(fnCustomLogout.calledOnce);
                sap.ushell.Container.registerLogout(orgLogout);
                start();
            });
        });
    });

    asyncTest("logout(): simple federated case", function () {
        var oLocalStorage = mockLocalStorage();
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oContainerAdapter = sap.ushell.adapters.local.ContainerAdapter.thisValues[0],
                oFooAdapter1,
                oFooAdapter2,
                oSystemData = {
                    alias: "test",
                    platform: "foo",
                    baseUrl: "/baseUrl"
                },
                oSystemData2 = {
                    alias: "test2",
                    platform: "foo",
                    baseUrl: "/baseUrl2"
                };
            sap.ushell.adapters.foo = sap.ushell.adapters.foo || {};
            sap.ushell.adapters.foo.ContainerAdapter = function (oSystem, sParameter) {
                this.logout = sinon.spy(function () {
                    return new jQuery.Deferred().resolve().promise();
                });
            };
            jQuery.sap.declare("sap.ushell.adapters.foo.ContainerAdapter");
            sinon.spy(sap.ushell.adapters.foo, "ContainerAdapter");

            sinon.stub(sap.ushell.Container, "_getRemoteSystems", function () {
                var mRemoteSystems = {};
                mRemoteSystems[oSystemData.alias] = new System(oSystemData);
                mRemoteSystems[oSystemData2.alias] = new System(oSystemData2);
                return mRemoteSystems;
            });
            sinon.spy(oContainerAdapter, "logout");

            // code under test
            sap.ushell.Container.logout().done(function () {
                start();
                ok(sap.ushell.Container._getRemoteSystems.calledOnce);
                oFooAdapter1 = sap.ushell.adapters.foo.ContainerAdapter.thisValues[0];
                ok(oFooAdapter1.logout.calledWith(false),
                    "first foo adapter logged out as remote system");
                oFooAdapter2 = sap.ushell.adapters.foo.ContainerAdapter.thisValues[1];
                ok(oFooAdapter2.logout.calledWith(false),
                    "second foo adapter logged out as remote system");
                ok(oContainerAdapter.logout.calledOnce);
                ok(oContainerAdapter.logout.calledWith(true));
                ok(oContainerAdapter.logout.calledAfter(oFooAdapter1.logout));
                ok(oContainerAdapter.logout.calledAfter(oFooAdapter2.logout));
                ok(oLocalStorage.removeItem.calledWith(
                    "sap.ushell.Container.local.remoteSystem.test"
                ));
                ok(oLocalStorage.removeItem.calledWith(
                    "sap.ushell.Container.local.remoteSystem.test2"
                ));
                ok(oLocalStorage.setItem.calledWith(
                    "sap.ushell.Container.local.sessionTermination",
                    "pending"
                ));
                ok(oLocalStorage.removeItem.calledWith(
                    "sap.ushell.Container.local.sessionTermination"
                ));

            });
        });
    });

    asyncTest("logout(): federated case, addFurtherRemoteSystems success", function () {
        mockLocalStorage();
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oContainerAdapter = sap.ushell.adapters.local.ContainerAdapter.thisValues[0];

            oContainerAdapter.addFurtherRemoteSystems = sinon.spy(function () {
                return new jQuery.Deferred().resolve().promise();
            });
            sinon.stub(sap.ushell.Container, "_getRemoteSystems").returns({});
            sinon.spy(oContainerAdapter, "logout");

            // code under test
            sap.ushell.Container.logout().done(function () {
                start();
                ok(oContainerAdapter.addFurtherRemoteSystems.calledOnce);
                ok(oContainerAdapter.addFurtherRemoteSystems.calledBefore(oContainerAdapter.logout));
                ok(oContainerAdapter.addFurtherRemoteSystems
                    .calledBefore(sap.ushell.Container._getRemoteSystems));
                ok(oContainerAdapter.logout.calledOnce);
                ok(oContainerAdapter.logout.calledWith(true));
            });
        });
    });

    asyncTest("logout(): federated case, error in createAdapter", function () {
        mockLocalStorage();
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oContainerAdapter = sap.ushell.adapters.local.ContainerAdapter.thisValues[0],
                oSystem = new System({
                    alias: "test",
                    platform: "bar",
                    baseUrl: "/baseUrl"
                }),
                oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.Container")
                    .warning("Could not create adapter for " + oSystem.getAlias(),
                        /bar\/ContainerAdapter/, "sap.ushell.Container");

            sinon.stub(sap.ushell.Container, "_getRemoteSystems").returns({test: oSystem});
            sinon.spy(oContainerAdapter, "logout");

            // code under test
            sap.ushell.Container.logout().done(function () {
                start();
                ok(oContainerAdapter.logout.calledOnce);
                ok(oContainerAdapter.logout.calledWith(true));
                oLogMock.verify();
            });
        });
    });

    asyncTest("logout(): federated case, addFurtherRemoteSystems failure", function () {
        mockLocalStorage();
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oContainerAdapter = sap.ushell.adapters.local.ContainerAdapter.thisValues[0];

            oContainerAdapter.addFurtherRemoteSystems = sinon.spy(function () {
                return new jQuery.Deferred().reject("oops").promise();
            });

            sinon.stub(sap.ushell.Container, "_getRemoteSystems").returns({});
            sinon.spy(oContainerAdapter, "logout");

            // code under test
            sap.ushell.Container.logout().done(function () {
                start();
                ok(oContainerAdapter.addFurtherRemoteSystems.calledOnce);
                ok(oContainerAdapter.addFurtherRemoteSystems
                    .calledBefore(oContainerAdapter.logout));
                ok(oContainerAdapter.addFurtherRemoteSystems
                    .calledBefore(sap.ushell.Container._getRemoteSystems));
                ok(oContainerAdapter.logout.calledOnce);
                ok(oContainerAdapter.logout.calledWith(true));
            });
        });
    });

    function prepareODataSuspend (iSeconds) {
        var sUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_CUST/",
            oResult = {
                fnRead: sinon.spy(OData, "read"),
                fnRequest: sinon.spy(OData, "request"),
                fnError: sinon.spy(),
                oLogMock: testUtils.createLogMock()
                    .filterComponent("sap.ushell.Container")
                    .warning("OData.read('" + sUrl + "') disabled during logout processing",
                        null, "sap.ushell.Container")
                    .warning("OData.request('" + sUrl + "') disabled during logout processing",
                        null, "sap.ushell.Container"),
                oRead: {},
                oRequest: {},
                sUrl: sUrl
            },
            oSystemData = {
                alias: "test",
                platform: "foo",
                baseUrl: "/baseUrl"
            };

        sap.ushell.adapters.foo = sap.ushell.adapters.foo || {};
        sap.ushell.adapters.foo.ContainerAdapter = function () {
            this.logout = sinon.spy(function () {
                var oFederatedLogout = jQuery.Deferred();
                function nop () { return; }
                // OData requests issued here: AFTER OData is disabled,
                // BEFORE remote logout is resolved
                oResult.oRead = OData.read(sUrl, nop, oResult.fnError);
                oResult.oRequest = OData.request({
                    requestUri: sUrl,
                    method: "GET"
                }, nop, oResult.fnError);
                setTimeout(function () {
                    oFederatedLogout.resolve();
                }, iSeconds * 1000);
                oResult.clock.tick(iSeconds * 1000);
                return oFederatedLogout.promise();
            });
        };

        jQuery.sap.declare("sap.ushell.adapters.foo.ContainerAdapter");
        sinon.spy(sap.ushell.adapters.foo, "ContainerAdapter");

        sinon.stub(sap.ushell.Container, "_getRemoteSystems", function () {
            var mRemoteSystems = {};
            mRemoteSystems[oSystemData.alias] = new System(oSystemData);
            return mRemoteSystems;
        });
        oResult.clock = sinon.useFakeTimers();
        return oResult;
    }

    asyncTest("logout(): suspend OData.read() .request() + no error handler called", function () {
        mockLocalStorage();
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oVerify = prepareODataSuspend(1);
            // code under test
            sap.ushell.Container.logout().done(function () {
                oVerify.clock.restore(); // Note: do this BEFORE start()!
                start();
                ok(!oVerify.fnRead.called, "Original OData read not called");
                ok(!oVerify.fnRequest.called, "Original OData request not called");
                ok(oVerify.oRead &&
                    typeof oVerify.oRead.abort ===
                        "function", "OData.read() returns abort function");
                ok(oVerify.oRequest &&
                    typeof oVerify.oRequest.abort ===
                        "function", "OData.request() returns abort function");
                ok(!oVerify.fnError.called, "Error handler NOT called");
                oVerify.oLogMock.verify();
            });
        });
    });

    asyncTest("logout(): OData.read() .request() error handler called after delay", function () {
        mockLocalStorage();
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oVerify = prepareODataSuspend(6);
            // code under test
            sap.ushell.Container.logout().done(function () {
                oVerify.clock.restore(); // Note: do this BEFORE start()!
                start();
                ok(oVerify.fnError.calledWith("OData.read('" + oVerify.sUrl +
                        "') disabled during logout processing"));
                ok(oVerify.fnError.calledWith("OData.request('" + oVerify.sUrl +
                        "') disabled during logout processing"));
            });
        });
    });

    asyncTest("logout(): Event Notification: pending + redirect", function () {
        var Constructor = sap.ushell.adapters.local.ContainerAdapter,
            fnRedirect = sinon.stub();

        sap.ushell.adapters.local.ContainerAdapter = function (oSystem) {
            var oAdapter = new Constructor(oSystem);
            oAdapter.logoutRedirect = fnRedirect;
            return oAdapter;
        };
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oEvent = document.createEvent("StorageEvent"),
                sUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_CUST/",
                fnRead = sinon.spy(OData, "read"),
                fnRequest = sinon.spy(OData, "request"),
                fnError = sinon.spy(),
                bPreventDefault = false,
                fnListener = sinon.spy(function (oEvent0) {
                    if (bPreventDefault) {
                        oEvent0.preventDefault();
                    }
                });

            function nop () {
                return;
            }
            oEvent.initStorageEvent("storage", false, false,
                "sap.ushell.Container.local.sessionTermination", "", "pending", "", null);

            sinon.stub(sap.ushell.Container, "_closeWindow");
            sinon.stub(sap.ushell.Container, "_redirectWindow");

            // code under test
            sap.ushell.Container.attachLogoutEvent(fnListener);
            dispatchEvent(oEvent);
            OData.read(sUrl, nop, fnError);
            OData.request({
                requestUri: sUrl,
                method: "GET"
            }, nop, fnError);
            ok(!fnRead.called, "oData.Read not called");
            ok(!fnRequest.called, "oData.Request not called");
            ok(!fnError.called, "Error handler not called");
            ok(sap.ushell.Container._closeWindow.called,
                  "closeWindow called sync. because of missing preventDefault");

            fnListener.reset();
            sap.ushell.Container._closeWindow.reset();
            bPreventDefault = true;
            // code under test (with preventDefault)
            dispatchEvent(oEvent);
            window.setTimeout(function () {
                ok(fnListener.callCount === 1, "listener called once");
                ok(sap.ushell.Container._closeWindow.called, "closeWindow called deferred");
                ok(sap.ushell.Container._redirectWindow.called, "redirectWindow called");
                sap.ushell.adapters.local.ContainerAdapter = Constructor;
                sap.ushell.Container._closeWindow.restore();
                sap.ushell.Container._redirectWindow.restore();
                start();
            }, 2000);
        });
    });

    asyncTest("logout(): logout event registration", function () {
        mockLocalStorage();
        sinon.spy(sap.ushell.adapters.local, "ContainerAdapter");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var bPreventDefault = false,
            fnListener = sinon.spy(function (oEvent0) {
                if (bPreventDefault) {
                    oEvent0.preventDefault();
                }
            });

            // code under test (deregistration)
            sap.ushell.Container.attachLogoutEvent(fnListener);
            sap.ushell.Container.detachLogoutEvent(fnListener);
            sap.ushell.Container.logout().done(function () {
                ok(fnListener.callCount === 0, "listener not called");
                sap.ushell.Container.attachLogoutEvent(fnListener);
                // code under test (registration)
                sap.ushell.Container.logout().done(function () {
                    //TODO: use FakeTimers
                    //var clock = sinon.useFakeTimers();
                    //clock.tick(1000);
                    ok(fnListener.callCount === 1, "listener called once");
                    sap.ushell.Container.detachLogoutEvent(fnListener);
                    sap.ushell.Container.attachLogoutEvent(fnListener);
                    // code under test (listener called twice )
                    sap.ushell.Container.logout().done(function () {
                        ok(fnListener.callCount === 2, "listener called twice");
                        start();
                    });
                });
            });
        });
    });



    if (sap.ui.Device.browser.msie) { //TODO implement this feature for IE!
        return;
    }
    // No IE beyond this point! ###################################################################

    /**
     * Initialization for getGlobalDirty() testing, simulates that local storage contains the
     * given items.
     *
     * @param {object} oItems
     */
    function globalDirtyInitialize (oItems) {
        return mockLocalStorage(oItems || {
            "foo": "INITIAL",
            "sap.ushell.Container.dirtyState.id-1": "INITIAL",
            "bar": "INITIAL",
            "sap.ushell.Container.dirtyState.id-2": "INITIAL",
            "sap.ushell.Container.dirtyState.id-3": "INITIAL"
        });
    }

    asyncTest("getGlobalDirty() with no NWBC windows", function () {
        globalDirtyInitialize({});

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.Container")
                    .debug("getGlobalDirty() Resolving: CLEAN",
                            null,
                            "sap.ushell.Container"),
                oDeferred = sap.ushell.Container.getGlobalDirty();

            oDeferred.fail(testUtils.onError).done(function (oState) {
                start();
                strictEqual(oState, sap.ushell.Container.DirtyState.CLEAN, "CLEAN");
                oLogMock.verify();
                // try again
                sap.ushell.Container.getGlobalDirty();
            });

        });
    });

    function globalDirtyFireEvent (sKey, sValue) {
        var oEvent = document.createEvent("StorageEvent");

        oEvent.initStorageEvent("storage", false, false, sKey, "", sValue, "", null);
        dispatchEvent(oEvent);
    }

    asyncTest("getGlobalDirty() -> DIRTY", function () {
        globalDirtyInitialize();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var sMessageTraceRequesting = "getGlobalDirty() Requesting status for: " +
                      "sap.ushell.Container.dirtyState.id-",
                sMessageTraceReceiving = "getGlobalDirty() Receiving event key: " +
                      "sap.ushell.Container.dirtyState.id-",
                oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.Container")
                    .debug(sMessageTraceRequesting + "3",
                            null,
                            "sap.ushell.Container")
                    .debug(sMessageTraceRequesting + "2",
                            null,
                            "sap.ushell.Container")
                    .debug(sMessageTraceRequesting + "1",
                            null,
                            "sap.ushell.Container")
                    .debug(sMessageTraceReceiving + "1 value: CLEAN",
                            null,
                            "sap.ushell.Container")
                    .debug(sMessageTraceReceiving + "2 value: MAYBE_DIRTY",
                            null,
                            "sap.ushell.Container")
                    .debug(sMessageTraceReceiving + "3 value: DIRTY",
                            null,
                            "sap.ushell.Container")
                    .debug("getGlobalDirty() Resolving: DIRTY",
                            null,
                            "sap.ushell.Container"),
                oDeferred = sap.ushell.Container.getGlobalDirty();

            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "MAYBE_DIRTY");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-3", "DIRTY");

            oDeferred.fail(testUtils.onError).done(function (oState) {
                start();
                ok(utils.localStorageSetItem.calledWith("sap.ushell.Container.dirtyState.id-1",
                     "PENDING"));
                ok(utils.localStorageSetItem.calledWith("sap.ushell.Container.dirtyState.id-2",
                    "PENDING"));
                ok(utils.localStorageSetItem.calledWith("sap.ushell.Container.dirtyState.id-3",
                    "PENDING"));
                strictEqual(oState, sap.ushell.Container.DirtyState.DIRTY, "DIRTY");
                oLogMock.verify();
            });
        });
    });

    asyncTest("getGlobalDirty() -> MAYBE_DIRTY", function () {
        globalDirtyInitialize();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oDeferred = sap.ushell.Container.getGlobalDirty();

            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "MAYBE_DIRTY");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-3", "CLEAN");

            oDeferred.fail(testUtils.onError).done(function (oState) {
                start();
                strictEqual(oState, sap.ushell.Container.DirtyState.MAYBE_DIRTY, "MAYBE_DIRTY");
            });
        });
    });

    asyncTest("getGlobalDirty() -> CLEAN", function () {
        globalDirtyInitialize();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oDeferred = sap.ushell.Container.getGlobalDirty();

            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "CLEAN");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-3", "CLEAN");

            oDeferred.fail(testUtils.onError).done(function (oState) {
                start();
                strictEqual(oState, sap.ushell.Container.DirtyState.CLEAN, "CLEAN");
            });
        });
    });

    asyncTest("getGlobalDirty() -> timeout -> cleanup in 2nd call", function () {

        var oLocalStorage = globalDirtyInitialize();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oClock = sinon.useFakeTimers(),
                oDeferred = sap.ushell.Container.getGlobalDirty();

            oClock.tick(60000);
            oDeferred.fail(testUtils.onError).done(function (oState) {
                var sMessageTracePending = "getGlobalDirty() Cleanup of unresolved " +
                        "'PENDINGS':sap.ushell.Container.dirtyState.id-",
                    oLogMock = testUtils.createLogMock()
                        .filterComponent("sap.ushell.Container")
                        .debug(sMessageTracePending + "3",
                                null,
                                "sap.ushell.Container")
                        .debug(sMessageTracePending + "2",
                                null,
                                "sap.ushell.Container")
                        .debug(sMessageTracePending + "1",
                                null,
                                "sap.ushell.Container")
                        .debug("getGlobalDirty() Resolving: CLEAN",
                                null,
                                "sap.ushell.Container");

                strictEqual(oState, sap.ushell.Container.DirtyState.MAYBE_DIRTY, "MAYBE_DIRTY");
                oDeferred = sap.ushell.Container.getGlobalDirty();
                oClock.tick(60000);
                oDeferred.fail(testUtils.onError).done(function (oState1) {
                    strictEqual(oState1, sap.ushell.Container.DirtyState.CLEAN, "CLEAN");
                    ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.dirtyState.id-3"));
                    ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.dirtyState.id-2"));
                    ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.dirtyState.id-1"));
                    oLogMock.verify();
                    oClock.restore(); // Note: do this BEFORE start()!
                    start();
                });
            });
        });
    });

    asyncTest("getGlobalDirty() -> timeout -> MAYBE_DIRTY", function () {
        globalDirtyInitialize();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oClock = sinon.useFakeTimers(),
                oDeferred = sap.ushell.Container.getGlobalDirty();

            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "CLEAN");
            oClock.tick(60000);

            oDeferred.fail(testUtils.onError).done(function (oState) {
                strictEqual(oState, sap.ushell.Container.DirtyState.MAYBE_DIRTY, "MAYBE_DIRTY");
                oClock.restore(); // Note: do this BEFORE start()!
                start();
            });
        });
    });

    asyncTest("getGlobalDirty() -> timeout -> DIRTY", function () {
        globalDirtyInitialize();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oClock = sinon.useFakeTimers(),
                oDeferred = sap.ushell.Container.getGlobalDirty();

            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
            globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "DIRTY");
            oClock.tick(60000);

            oDeferred.fail(testUtils.onError).done(function (oState) {
                strictEqual(oState, sap.ushell.Container.DirtyState.DIRTY, "DIRTY");

                ok(utils.localStorageSetItem.calledWith(
                    "sap.ushell.Container.dirtyState.id-1",
                    "PENDING",
                    true
                ), "events are sent to local window!");

                oClock.restore(); // Note: do this BEFORE start()!
                start();
            });
        });
    });

    asyncTest("getGlobalDirty() called twice", function () {
        globalDirtyInitialize();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();
            // code under test
            sap.ushell.Container.getGlobalDirty();
            throws(function () { sap.ushell.Container.getGlobalDirty(); },
                 "getGlobalDirty already called!");
        });
    });

    test("getGlobalDirty() -> in Safari private browsing mode", function (assert) {
        var done = assert.async();
        var oLocalStorage = mockLocalStorage();

        oLocalStorage.setItem = sinon.stub().throws("QUOTA_EXCEEDED_ERR");
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            sap.ushell.Container.getGlobalDirty().done(function (sResult) {
                strictEqual(sResult, "MAYBE_DIRTY", "MAYBE_DIRTY");
                done();
            });
        });
    });

    [
        {
            testDescription: " frameLogonManager is not set before bootstrap",
            setFrameLogonManager: false
        },
        {
            testDescription: " frameLogonManager is set before bootstrap",
            setFrameLogonManager: true,
            sPath: "/some/path",
            iTimeout: 1000,
            expectedPath: "/some/path",
            expectedTimeout: 1000
        }
    ].forEach(function (oFixture) {
        QUnit.test("setXhrLogonTimeout when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async(),
                oFrameLogonManagerSpy = {
                    setTimeout: sinon.spy()
                };

            sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
                if (oFixture.setFrameLogonManager) {
                    sap.ushell.Container.oFrameLogonManager = oFrameLogonManagerSpy;
                } else {
                    assert.expect(0);
                }

                sap.ushell.Container.setXhrLogonTimeout(oFixture.sPath, oFixture.iTimeout);

                if (oFixture.expectedPath) {
                    assert.strictEqual(oFrameLogonManagerSpy.setTimeout.callCount, 1, "expected that setTimeout was called once");
                    assert.strictEqual(oFrameLogonManagerSpy.setTimeout.args[0][0], oFixture.expectedPath);
                }
                if (oFixture.expectedTimeout) {
                    assert.strictEqual(oFrameLogonManagerSpy.setTimeout.args[0][1], oFixture.expectedTimeout);
                }
                fnDone();
            });

        });
    });

    [
        {
            testDescription: " when no path, no HashFragment and no parameters are present",
            href: "https://www.some.mock.site.com",
            expectedResult: "https://www.some.mock.site.com"
        },
        {
            testDescription: " when a path but no HashFragment and no parameters are present",
            href: "https://www.some.mock.site.com/some/path",
            expectedResult: "https://www.some.mock.site.com/some/path"
        },
        {
            testDescription: " when a Hash Fragment but no path and no parameters are present",
            href: "https://www.some.mock.site.com#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com"
        },
        {
            testDescription: " when parameters but not Hash Fragment and no path are present",
            href: "https://www.some.mock.site.com?some-parameter=foo",
            expectedResult: "https://www.some.mock.site.com?some-parameter=foo"
        },
        {
            testDescription: " when parameters and a hash fragment but no path are present",
            href: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com?some-parameter=foo"
        },
        {
            testDescription: " when parameters, a path and a hash fragment are present",
            href: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com/some/path?some-parameter=foo"
        },
        {
            testDescription: " when no path, no HashFragment and no parameters are present",
            href: "https://www.some.mock.site.com",
            expectedResult: "https://www.some.mock.site.com",
            addHash: false
        },
        {
            testDescription: " when a path but no HashFragment and no parameters are present",
            href: "https://www.some.mock.site.com/some/path",
            expectedResult: "https://www.some.mock.site.com/some/path",
            addHash: false
        },
        {
            testDescription: " when a Hash Fragment but no path and no parameters are present",
            href: "https://www.some.mock.site.com#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com",
            addHash: false
        },
        {
            testDescription: " when parameters but not Hash Fragment and no path are present",
            href: "https://www.some.mock.site.com?some-parameter=foo",
            expectedResult: "https://www.some.mock.site.com?some-parameter=foo",
            addHash: false
        },
        {
            testDescription: " when parameters and a hash fragment but no path are present",
            href: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com?some-parameter=foo",
            addHash: false
        },
        {
            testDescription: " when parameters, a path and a hash fragment are present",
            href: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com/some/path?some-parameter=foo",
            addHash: false
        },
        {
            testDescription: " when no path, no HashFragment and no parameters are present",
            href: "https://www.some.mock.site.com",
            expectedResult: "https://www.some.mock.site.com",
            addHash: true
        },
        {
            testDescription: " when a path but no HashFragment and no parameters are present",
            href: "https://www.some.mock.site.com/some/path",
            expectedResult: "https://www.some.mock.site.com/some/path",
            addHash: true
        },
        {
            testDescription: " when a Hash Fragment but no path and no parameters are present",
            href: "https://www.some.mock.site.com#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com#Hash-Fragment",
            addHash: true
        },
        {
            testDescription: " when parameters but not Hash Fragment and no path are present",
            href: "https://www.some.mock.site.com?some-parameter=foo",
            expectedResult: "https://www.some.mock.site.com?some-parameter=foo",
            addHash: true
        },
        {
            testDescription: " when parameters and a hash fragment but no path are present",
            href: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
            addHash: true
        },
        {
            testDescription: " when parameters, a path and a hash fragment are present",
            href: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
            expectedResult: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
            addHash: true
        }

    ].forEach(function (oFixture) {
        test("getFLPUrl returns the proper URL with filtered Hash Fragment when " + oFixture.testDescription, function (assert) {
            // arrange
            var fnDone = assert.async(),
                getLocationHrefStub = sinon.stub(utils, "getLocationHref").returns(oFixture.href);

            sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
                var sResult;

                if (oFixture.addHash) {
                    sResult = sap.ushell.Container.getFLPUrl(oFixture.addHash);
                } else {
                    sResult = sap.ushell.Container.getFLPUrl();
                }

                ok(getLocationHrefStub.called);
                strictEqual(sResult, oFixture.expectedResult, "Result equals Expected Result");
                getLocationHrefStub.restore();
                fnDone();
            });
        });
    });

    [
        {
            testDescription: " Simple testing landscape no CDM",
            oExpConf: {}
        }
    ].forEach(function (oFixture) {
        test("getFLPConfig returns the FLPO configuration in the scope: " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
                oFixture.oExpConf.URL = sap.ushell.Container.getFLPUrl();
                sap.ushell.Container.getFLPConfig().then(function (oConfig) {
                    ok(oConfig = oFixture.oExpConf, "Result equals Expected Result");
                    fnDone();
                });

            });
        });
    });

    test("createAdapter - Async", function (assert) {
        // Parameters for createAdapter.
        var done = assert.async(),
            oFooSystem = new System({platform: "foo"}),
            oGetObjectStub,
            oResponse;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var sAdapterName = "bar",
                bPromiseReturned,
                oFunctionsToTest,
                sExpectedAdapterName = "sap.ushell.adapters.foo.barAdapter";

            // stubs
            oGetObjectStub = sinon.stub(jQuery.sap, "getObject", function (sAdapterName) {
                return function () { this.sAdapterName = "bar"; };
            });
            sinon.stub(sap.ui, "require", function (aLibs, fnHandler) {
                fnHandler();
            });

            // expose function to be tested
            oFunctionsToTest = sap.ushell.Container._getFunctionsForUnitTest();

            // call function
            oResponse = oFunctionsToTest.createAdapter(sAdapterName, oFooSystem, "", true);

            // check if promise returned
            bPromiseReturned = Promise.resolve(oResponse) == oResponse;
            ok(bPromiseReturned, "createAdapter returns a promise when asked to");

            if (bPromiseReturned) {
                oResponse.then(function () {
                    // Tests after promise is resolved
                    ok(oGetObjectStub.calledWith(sExpectedAdapterName), "createAdapter's promise resolved correctly");
                    strictEqual(sap.ui.require.args[0][0][0], sExpectedAdapterName.replace(/\./g, "/"), "correct module required");
                    oGetObjectStub.restore();
                    sap.ui.require.restore();
                    done();
                });
            } else {
                oGetObjectStub.restore();
                sap.ui.require.restore();
                done();
            }
        });
    });
});
