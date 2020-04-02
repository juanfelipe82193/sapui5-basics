// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.performance.ShellAnalytics
 */
sap.ui.require([
    "sap/ushell/EventHub",
    "sap/ushell/performance/ShellAnalytics",
    "sap/ushell/services/AppConfiguration"
], function (EventHub, ShellAnalytics, AppConfiguration) {
    "use strict";
    /*global QUnit sinon*/

    var oCurrentApplication = null;


    function fnEventHubInPromise (sEvent, value) {
        EventHub.emit(sEvent, value);
        return new Promise(function (fnResolve) {
            EventHub.once(sEvent).do(fnResolve);
        });
    }

    QUnit.module("Initialization of ShellAnalytics", {
        beforeEach: function () {
            var that = this;
            this.oDoableMock = {
                do: sinon.spy(),
                off: sinon.spy()
            };
            this.oEventHubOnStub = sinon.stub(EventHub, "on");
            this.oEventHubOnStub.returns({
                do: function () {
                    return that.oDoableMock;
                }
            });

            this.oEventHubOnceStub = sinon.stub(EventHub, "once");
            this.oEventHubOnceStub.returns({
                do: function () {
                    return that.oDoableMock;
                }
            });

            this.oEventBusMock = {
                subscribe: sinon.spy(),
                unsubscribe: sinon.spy()
            };
            this.oEventBusStub = sinon.stub(sap.ui.getCore(), "getEventBus");
            this.oEventBusStub.returns(this.oEventBusMock);

            this.hashChanger = {
                detachEvent: sinon.spy(),
                attachEvent: sinon.spy()
            };

            this.oShellNavigationPromise = Promise.resolve({
                hashChanger: that.hashChanger
            });
            sap.ushell.Container = {
                getServiceAsync: function (sName) {
                    return that.oShellNavigationPromise;
                }
            };
        },
        afterEach: function () {
            ShellAnalytics.disable();
            this.oEventHubOnStub.restore();
            this.oEventHubOnceStub.restore();
            this.oEventBusStub.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Subscribe to EventBus when ShellAnalytics is enabled", function (assert) {
        ShellAnalytics.enable();
        assert.equal(this.oEventBusMock.subscribe.callCount, 3, "ShellAnalytics subscribed to 3 EventBus event");
    });

    QUnit.test("Unsubscribe from EventBus when ShellAnalytics is disabled", function (assert) {
        ShellAnalytics.enable();
        ShellAnalytics.disable();
        assert.equal(this.oEventBusMock.subscribe.callCount,
            this.oEventBusMock.unsubscribe.callCount, "subscribe and unsubscribe calles should have the same number");
    });

    QUnit.test("Subscribe to EventHub when ShellAnalytics is enabled", function (assert) {
        ShellAnalytics.enable();
        assert.equal(this.oEventHubOnStub.callCount, 5, "ShellAnalytics listens 5 EventHub events");
        assert.equal(this.oEventHubOnceStub.callCount, 1, "ShellAnalytics listens once 1 EventHub event");
        assert.equal(this.oEventHubOnceStub.getCall(0).args, "ShellNavigationInitialized", "ShellAnalytics subscribe on ShellNavigationInitialized once");
    });

    QUnit.test("All EventHub events should be off when disable the analytics", function (assert) {
        ShellAnalytics.enable();
        ShellAnalytics.disable();
        assert.equal(this.oDoableMock.off.callCount, 6, "All EventHub events should be off");
    });

    QUnit.test("Enable sunscribe only once", function (assert) {
        ShellAnalytics.enable();
        assert.equal(this.oEventBusMock.subscribe.callCount, 3, "ShellAnalytics subscribed to 3 EventBus event");
        assert.equal(this.oEventHubOnStub.callCount, 5, "ShellAnalytics listens 5 EventHub events");
        assert.equal(this.oEventHubOnceStub.callCount, 1, "ShellAnalytics listens once 1 EventHub event");

        ShellAnalytics.enable();
        assert.equal(this.oEventBusMock.subscribe.callCount, 3, "ShellAnalytics should not subscribe to EventBus again");
        assert.equal(this.oEventHubOnStub.callCount, 5, "ShellAnalytics should not subscribe to EventHub again");
        assert.equal(this.oEventHubOnceStub.callCount, 1, "ShellAnalytics should not subscribe to EventHub again");
    });

    QUnit.test("All EventHub events should be off when disable the analytics", function (assert) {
        ShellAnalytics.enable();
        ShellAnalytics.disable();
        assert.equal(this.oDoableMock.off.callCount, 6, "All EventHub events should be off");
    });

    QUnit.test("_attachHashChangeListener is called when ShellNavigationInitialized", function (assert) {
        var fnDone = assert.async();
        var that = this;
        this.oEventHubOnceStub.restore();
        ShellAnalytics.enable();
        fnEventHubInPromise("ShellNavigationInitialized", true)
            .then(function () {
                setTimeout(function () {
                    assert.ok(that.hashChanger.attachEvent.calledTwice, "ShellAnalytics is attached to the hasher events");
                    EventHub.emit("ShellNavigationInitialized", undefined);
                    fnDone();
                }, 10);
            });
    });

    QUnit.test("_detachHashChangeListener is called when ShellAnalytics is disabled", function (assert) {
        var fnDone = assert.async();
        var that = this;
        this.oEventHubOnceStub.restore();
        ShellAnalytics.enable();
        fnEventHubInPromise("ShellNavigationInitialized", true)
            .then(function () {
                ShellAnalytics.disable();
                setTimeout(function () {
                    assert.equal(that.hashChanger.attachEvent.callCount,
                            that.hashChanger.detachEvent.callCount,
                             "attachEvent and detachEvent calls cound should be the same");
                    fnDone();
                }, 10);
            });
    });

    QUnit.module("Steps in ShellAnalytics", {
        beforeEach: function () {
            var oAppLifeCyclePromise,
                oShellNavigationPromise;
            oAppLifeCyclePromise = Promise.resolve({
                getCurrentApplication: function () {
                    return oCurrentApplication;
                }
            });

            oShellNavigationPromise = Promise.resolve({
                hashChanger: {
                    detachEvent: sinon.spy(),
                    attachEvent: sinon.spy()
                }
            });
            sap.ushell.Container = {
                getServiceAsync: function (sName) {
                    if (sName === "AppLifeCycle") {
                        return oAppLifeCyclePromise;
                    }
                    return oShellNavigationPromise;
                }
            };
            ShellAnalytics.enable();
        },
        afterEach: function () {
            ShellAnalytics.disable();

            EventHub._reset();
            oCurrentApplication = null;
            delete sap.ushell.Container;
        }
    });
    QUnit.test("Create a SR with status open", function (assert) {
        var fnDone = assert.async();
        EventHub.emit("trackHashChange", "#Shell-home");
        setTimeout(function () {
            var aRecs = ShellAnalytics.getAllRecords();
            assert.strictEqual(aRecs.length, 1, "shell analytics called");
            assert.strictEqual(aRecs[0].status, "OPEN", "SR has status open");
            assert.strictEqual(aRecs[0].targetHash, "#Shell-home", "SR has correct targetHash");
            assert.strictEqual(!!aRecs[0].timeStart, true, "SR has start time");
            fnDone();
        }, 10);

    });

    QUnit.test("Step FLP@LOAD", function (assert) {
        var fnDone = assert.async();
        oCurrentApplication = {
            homePage: true
        };

        fnEventHubInPromise("trackHashChange", "#Shell-home")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                return fnEventHubInPromise("trackHashChange", "#Action-toAppNavSample");
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 2, "shell analytics called for homepage and application");
                    assert.strictEqual(aRecs[0].targetHash, "#Shell-home", "SR has correct targetHash");
                    assert.strictEqual(!!aRecs[0].timeStart, true, "SR has start time");
                    assert.strictEqual(!!aRecs[0].timeEnd, true, "SR has end time");
                    assert.strictEqual(aRecs[0].step, "FLP@LOAD");
                    assert.strictEqual(aRecs[0].status, "CLOSED", "statistical Record with status closed created");
                    assert.strictEqual(aRecs[1].status, "OPEN", "statistical Record with status open created");
                    fnDone();
                }, 10);
            });

    });

    QUnit.test("Step A2A@xxx", function (assert) {
        var fnDone = assert.async();

        oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["F123"]);
            }
        };

        fnEventHubInPromise("trackHashChange", "#Action-toAppNavSample")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                return fnEventHubInPromise("trackHashChange", "#Action-toAppNavSample2");
            })
            .then(function () {
                oCurrentApplication = {
                    applicationType: "UI5",
                    getTechnicalParameter: function () {
                        return Promise.resolve(["F987"]);
                    }
                };
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 2, "shell analytics called for deeplink and application");

                    assert.strictEqual(aRecs[0].step, "FLP@DEEP_LINK", "SR has correct targetHash");

                    assert.strictEqual(aRecs[1].targetHash, "#Action-toAppNavSample2", "SR has correct targetHash");
                    assert.strictEqual(aRecs[1].step, "A2A@F123");
                    assert.strictEqual(aRecs[1].status, "CLOSED", "statistical Record with status close created");
                    assert.strictEqual(aRecs[1].sourceApplication, "F123", "SR has correct source application");
                    assert.strictEqual(aRecs[1].targetApplication, "F987", "SR has correct source application");
                    fnDone();
                }, 10);
            });
    });

    QUnit.test("Step FLP@DEEP_LINK", function (assert) {
        var fnDone = assert.async();

        oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["F123"]);
            }
        };

        fnEventHubInPromise("trackHashChange", "#Action-toApp")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                return fnEventHubInPromise("trackHashChange", "#Action-toAppNavSample");
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 2, "shell analytics called for homepage and application");
                    assert.strictEqual(aRecs[0].targetHash, "#Action-toApp", "SR has correct targetHash");
                    assert.strictEqual(!!aRecs[0].timeStart, true, "SR has start time");
                    assert.strictEqual(!!aRecs[0].timeEnd, true, "SR has end time");
                    assert.strictEqual(aRecs[0].step, "FLP@DEEP_LINK");
                    assert.strictEqual(aRecs[0].status, "CLOSED", "statistical Record with status closed created");
                    assert.strictEqual(aRecs[1].status, "OPEN", "statistical Record with status open created");
                    fnDone();
                }, 10);
            });
    });

    QUnit.module("Application type detection", {
        beforeEach: function () {
            var oAppLifeCyclePromise,
                oShellNavigationPromise;

            this.oCurrentApplicationStub = sinon.stub();
            oAppLifeCyclePromise = Promise.resolve({
                getCurrentApplication: this.oCurrentApplicationStub
            });

            oShellNavigationPromise = Promise.resolve({
                hashChanger: {
                    detachEvent: sinon.spy(),
                    attachEvent: sinon.spy()
                }
            });
            sap.ushell.Container = {
                getServiceAsync: function (sName) {
                    if (sName === "AppLifeCycle") {
                        return oAppLifeCyclePromise;
                    }
                    return oShellNavigationPromise;
                }
            };
            ShellAnalytics.enable();
        },
        afterEach: function () {
            ShellAnalytics.disable();

            EventHub._reset();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("targetApplication is not set, when getCurrentApplication return nothing", function (assert) {
        var fnDone = assert.async();

        this.oCurrentApplicationStub.returns(null);

        fnEventHubInPromise("trackHashChange", "#Action-toApp")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].targetApplication, undefined, "targetApplication was set correctly");
                    fnDone();
                }, 10);
            });
    });

    QUnit.test("targetApplication is set to FLP_HOME, when getCurrentApplication return homePage", function (assert) {
        var fnDone = assert.async();

        this.oCurrentApplicationStub.returns({
            homePage: true
        });

        fnEventHubInPromise("trackHashChange", "#Shell-home")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].targetApplication, "FLP_HOME", "targetApplication was set correctly");
                    fnDone();
                }, 10);
            });
    });

    QUnit.test("FioriId is set as targetApplication, when getCurrentApplication return UI5 application", function (assert) {
        var fnDone = assert.async();

        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: function (sParam) {
                if (sParam === "sap-fiori-id") {
                    return Promise.resolve(["F12345"]);
                }
                return Promise.resolve([]);
            }
        });

        fnEventHubInPromise("trackHashChange", "#Action-toApp")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].targetApplication, "F12345", "targetApplication was set correctly");
                    fnDone();
                }, 50);
            });
    });

    QUnit.test("Component id is set as targetApplication, when getTechnicalParameter return no id for UI5 application", function (assert) {
        var fnDone = assert.async();

        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: function (sParam) {
                return Promise.resolve([]);
            },
            componentInstance: {
                getManifest: function () {
                    return {
                        "sap.app": {
                            id: "some.test.application"
                        }
                    };
                }
            }
        });

        fnEventHubInPromise("trackHashChange", "#Action-toApp")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].targetApplication, "some.test.application", "targetApplication was set correctly");
                    fnDone();
                }, 10);
            });
    });

    QUnit.test("Set technicalName as targetApplication, when current application is not UI5 application", function (assert) {
        var fnDone = assert.async();

        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "GUI"
        });

        var oMetadataStub = sinon.stub(AppConfiguration, "getMetadata").returns({
            technicalName: "SU01"
        });

        fnEventHubInPromise("trackHashChange", "#Action-toApp")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].targetApplication, "SU01", "targetApplication was set correctly");
                    oMetadataStub.restore();
                    fnDone();
                }, 10);
            });
    });

    QUnit.module("Close statistical record", {
        beforeEach: function () {
            var oAppLifeCyclePromise,
                oShellNavigationPromise;

            this.oCurrentApplicationStub = sinon.stub();
            oAppLifeCyclePromise = Promise.resolve({
                getCurrentApplication: this.oCurrentApplicationStub
            });

            oShellNavigationPromise = Promise.resolve({
                hashChanger: {
                    detachEvent: sinon.spy(),
                    attachEvent: sinon.spy()
                }
            });
            sap.ushell.Container = {
                getServiceAsync: function (sName) {
                    if (sName === "AppLifeCycle") {
                        return oAppLifeCyclePromise;
                    }
                    return oShellNavigationPromise;
                }
            };
            ShellAnalytics.enable();
        },
        afterEach: function () {
            ShellAnalytics.disable();

            EventHub._reset();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Close inplace navigation", function (assert) {
        var fnDone = assert.async();

        this.oCurrentApplicationStub.returns({
            homePage: false,
            applicationType: "UI5",
            getTechnicalParameter: function (sParam) {
                return Promise.resolve(["F12345"]);
            }
        });

        fnEventHubInPromise("trackHashChange", "#Action-toApp")
            .then(function () {
                return fnEventHubInPromise("AppRendered", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].status, "CLOSED", "status was set correctly");
                    assert.strictEqual(aRecs[0].navigationMode, "INPLACE", "navigationMode was set correctly");
                    assert.strictEqual(aRecs[0].targetApplication, "F12345", "targetApplication was set correctly");
                    assert.deepEqual(ShellAnalytics.getCurrentApplication(), {type: "UI5", id: "F12345"}, "the application was set");
                    fnDone();
                }, 10);
            });
    });

    QUnit.test("Close explace navigation", function (assert) {
        var fnDone = assert.async();

        fnEventHubInPromise("trackHashChange", "#Action-toExplaceApp")
            .then(function () {
                return fnEventHubInPromise("openedAppInNewWindow", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].status, "CLOSED", "status was set correctly");
                    assert.strictEqual(aRecs[0].navigationMode, "EXPLACE", "navigationMode was set correctly");
                    assert.strictEqual(aRecs[0].targetApplication, null, "targetApplication was set correctly");
                    assert.notOk(ShellAnalytics.getCurrentApplication(), "the application was not set");
                    fnDone();
                }, 10);
            });
    });

    QUnit.test("Close navigation with error", function (assert) {
        var fnDone = assert.async();

        fnEventHubInPromise("trackHashChange", "#Action-toExplaceApp")
            .then(function () {
                return fnEventHubInPromise("doHashChangeError", Date.now());
            })
            .then(function () {
                setTimeout(function () {
                    var aRecs = ShellAnalytics.getAllRecords();
                    assert.strictEqual(aRecs.length, 1, "shell analytics called for one application");
                    assert.strictEqual(aRecs[0].status, "ERROR", "status was set correctly");
                    assert.notOk(ShellAnalytics.getCurrentApplication(), "the application was not set");
                    fnDone();
                }, 10);
            });
    });



});
