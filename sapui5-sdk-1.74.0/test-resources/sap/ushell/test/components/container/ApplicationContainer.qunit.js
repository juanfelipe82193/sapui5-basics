// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for components/container/ApplicationContainer.js
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/ApplicationType",
    "sap/ushell/services/Container",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/library"
], function (
    BlueBoxHandler,
    Application,
    testUtils,
    utils,
    ApplicationType
    // Container
    // hasher
    // library
) {
    "use strict";
    var A_ALL_APPLICATION_TYPES = Object.keys(ApplicationType.enum).map(function (sKey) {
        return ApplicationType.enum[sKey];
    });
    var aEmbeddableApplicationTypes = A_ALL_APPLICATION_TYPES.filter(function (sApplicationType) {
        return utils.isApplicationTypeEmbeddedInIframe(sApplicationType);
    });

    var sPREFIX = "sap.ushell.components.container",
        sCONTAINER = sPREFIX + ".ApplicationContainer",
        sTESTURL = "http://www.sap.com/",
        oMessageTemplate = {
            data: {
                type: "request",
                service: "sap.ushell.services.CrossApplicationNavigation.unknownService",
                request_id: "generic_id",
                body: {}
            },
            origin: "http://our.origin:12345",
            source: { postMessage: "replace_me_with_a_spy" }
        },
        oFakeError = { message: "Post Message Fake Error" },
        oAppContainer,
        publishExternalEventStub;

    /**
     * Creates an object which can be used for the ApplicationContainer's application property.
     *
     * @param {string} [oProperties.text] the return value for getText().
     * @param {string} [oProperties.type] the return value for getType().
     * @param {string} [oProperties.url] the return value for getUrl().
     * @param {boolean} [oProperties.resolvable] the return value for isResolvable().
     *   If <code>true</code>, the object's function <code>resolve()</code> must be stubbed.
     * @returns the application object.
     */
    function getApplication(oProperties) {
        oProperties = oProperties || {};
        return {
            getText: function () { return oProperties.text; },
            getType: function () { return oProperties.type; },
            getUrl: function () { return oProperties.url; },
            isFolder: function () { return false; },
            isResolvable: function () { return oProperties.resolvable; },
            resolve: function () { throw new Error("resolve must be stubbed"); },
            getMenu: function () {
                return {
                    getDefaultErrorHandler: function () {
                        return oProperties.errorHandler;
                    }
                };
            }
        };
    }

    /**
     * Utility function to stub jQuery.sap.getObject method.
     *
     * @param {string} sKeyPath the path to the function of the config to stub.
     * @param {variant} vValue the value to assign to the given path.
     * @return {object} a Sinon stub for the jQuery.sap.getObject.
     *   The stub will be configured to return the given value if jQuery.sap.getObject is called with the given key.
     *   The stub is configured to throw, if the getObject call is made with an unconfigured path.
     */
    function stubGetObject(sKeyPath, vValue) {
        var oStub = sinon.stub(jQuery.sap, "getObject");
        jQuery.sap.getObject
            .withArgs(sKeyPath, 0)
            .returns(vValue);
        jQuery.sap.getObject.throws(
            "test expects jQuery.sap.getObject to be only called with unexpected call to be only called with " + sKeyPath
        );
        return oStub;
    }

    /**
     * Renders the container and expects that the internal render() is called with the given arguments.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {ApplicationType.enum} oApplicationType the expected applicationType.
     * @param {string} sUrl the expected URL.
     * @param {string} sAdditionalInformation the expected additional information.
     */
    function renderAndExpect(oContainer, oApplicationType, sUrl, sAdditionalInformation) {
        var oRenderManager = new sap.ui.core.RenderManager();

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_render");

        oRenderManager.render(oContainer, document.createElement("DIV"));

        ok(oContainer._render.calledWith(
            oRenderManager.getRendererInterface(),
            oContainer,
            oApplicationType,
            sUrl,
            sAdditionalInformation
        ));
    }

    /**
     * Mocks sap.ushell.Container.
     *
     * @param {object} oArgs An object like:
     *   {
     *     attachLogoutEvent: ...,
     *     detachLogoutEvent: ...,
     *     addRemoteSystem: ...,
     *     services: {
     *       serviceName: { ... mocked service here ... },
     *     }
     *   }
     *   Stubs and default values are used when one or more of the above are passed.
     * @return {object} A mocked sap.ushell.Container (to be assigned to the global).
     */
    function mockSapUshellContainer(oArgs) {
        oArgs = oArgs || {};
        var oSapUshellContainer = {
            DirtyState: {
                CLEAN: "CLEAN",
                DIRTY: "DIRTY",
                MAYBE_DIRTY: "MAYBE_DIRTY",
                PENDING: "PENDING",
                INITIAL: "INITIAL"
            },
            getUser: sinon.stub().returns({
                getTheme: sinon.stub().returns("SAP_TEST_THEME"),
                getAccessibilityMode: sinon.stub()
            }),
            attachLogoutEvent: oArgs.attachLogoutEvent ? oArgs.attachLogoutEvent : sinon.stub(),
            detachLogoutEvent: oArgs.detachLogoutEvent ? oArgs.detachLogoutEvent : sinon.stub(),
            addRemoteSystem: oArgs.addRemoteSystem ? oArgs.addRemoteSystem : sinon.stub(),
            _isLocalSystem: oArgs._isLocalSystem ? oArgs._isLocalSystem : sinon.stub(),
            getLogonSystem: oArgs.getLogonSystem ? oArgs.getLogonSystem : sinon.stub(),
            getService: function (sServiceName) {
                if (oArgs.services && oArgs.services[sServiceName]) {
                    return oArgs.services[sServiceName];
                }
                throw new Error("ERROR: service stub for " + sServiceName + " was not provided in the test. Please add /services/" + sServiceName + " to mockSapUshellContainer arguments.");
            },
            getFLPUrl: sinon.stub().returns(window.location.href)
        };
        return oSapUshellContainer;
    }

    /**
     * Renders an iframe via the _render method in the given container.
     *
     * @param {object} oContainer the container to call _render on.
     * @param {object} oPrepareEnv an environment useful for calling <code>#renderInternally</code>.
     *   It's an object containing instances like:
     *   {
     *     renderManager: <instance>,
     *     rendererInterface: <instance>
     *   }
     * @param {string} sUrl the url property of the container.
     * @param {string} sApplicationType the application type.
     * @return {object} a DIV node containing the rendered iFrame.
     */
    function renderInternally(oContainer, oPrepareEnv, sUrl, sApplicationType, bUpdateDOM) {
        // the div is not attached to the "real" DOM and therefore is standalone and not rendered
        var oTargetNode = document.createElement("DIV");
        if (bUpdateDOM === true) {
            document.body.appendChild(oTargetNode);
        }

        oContainer._render(oPrepareEnv.renderManager, oContainer, sApplicationType, sUrl, "additionalInfo");
        oPrepareEnv.renderManager.flush(oTargetNode);

        return oTargetNode;
    }

    /**
     * Prepares the environment for a call to renderInternally.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {string} sUrl the application URL.
     * @param {object} [oMockConfigOverrides] optional overrides for the mock configuration(see code).
     *   This is an object containing paths to override like:
     *   <pre>
     *   {
     *     "/appContainer/fnGetFrameSource" : function () { ... },
     *     "/other/override": 123",
     *     ...
     *   }
     *   </pre>
     * @return {object} An environment useful for calling <code>#renderInternally</code>.
     *   It's an object containing instances like:
     *   {
     *     renderManager: <instance>,
     *     rendererInterface: <instance>
     *   }
     */
    function prepareRenderInternally(oContainer, sUrl, oMockConfigOverrides) {
        var oRenderManager,
            oMockConfig = testUtils.overrideObject({
                appContainer: { fnGetFrameSource: sinon.stub().returns(sUrl) },
                utils: { bStubLocalStorageSetItem: true }
            }, oMockConfigOverrides || {});

        if (oMockConfig.utils.bStubLocalStorageSetItem) {
            sinon.stub(sap.ushell.utils, "localStorageSetItem");
        }

        // Arrange Renderer instance
        oRenderManager = new sap.ui.core.RenderManager();
        sinon.spy(oRenderManager, "writeAccessibilityState");

        oContainer.getFrameSource = oMockConfig.appContainer.fnGetFrameSource;
        oContainer.addStyleClass("myClass1");

        sinon.spy(oAppContainer.__proto__, "_adjustNwbcUrl");
        sinon.spy(oAppContainer.__proto__, "_filterURLParams");
        sinon.spy(oAppContainer.__proto__, "_generateRootElementForIFrame");
        sinon.spy(oAppContainer.__proto__, "_buildHTMLElements");


        return { renderManager: oRenderManager };
    }

    /**
     * Call the render() function and check that an IFrame is rendered for the given URL.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {ApplicationType.enum} sApplicationType the application type.
     * @param {string} sUrl the application URL.
     * @param {object} [oMockConfigOverrides] optional overrides for the mock configuration(see code).
     *   This is an object containing paths to override like:
     *   <pre>
     *   {
     *     "/appContainer/fnGetFrameSource" : function () { ... },
     *     "/other/override": 123",
     *     ...
     *   }
     *   </pre>
     * @param {boolean} [bIframeWithPost] the ifarme was rendered with post method and not get
     * @returns {object} the rendered iFrame if any or undefined.
     */
    function renderInternallyAndExpectIFrame(oContainer, sApplicationType, sUrl, oMockConfigOverrides, bIframeWithPost) {
        // Arrange
        var oPrepareEnv = prepareRenderInternally(oContainer, sUrl, oMockConfigOverrides);

        // Act
        var oTargetNode = renderInternally(oContainer, oPrepareEnv, sUrl, sApplicationType);

        // Assert
        testIFrameRendered(oTargetNode, oPrepareEnv, oContainer, sApplicationType, sUrl, bIframeWithPost);

        return oTargetNode;
    }

    /**
     * Tests that the iFrame was rendered after calling _render.
     *
     * @param {object} oTargetNode The target node.
     * @param {object} oPrepareEnv The prepare env.
     * @param {object} oContainer The container.
     * @param {string} sApplicationType The application type.
     * @param {string} sUrl The url.
     * @param {boolean} bIframeWithPost the ifarme was rendered with post method and not get
     */
    function testIFrameRendered(oTargetNode, oPrepareEnv, oContainer, sApplicationType, sUrl, bIframeWithPost) {
        var oIframe;

        if (bIframeWithPost === undefined) {
            bIframeWithPost = false;
        }
        if (!oTargetNode || !oTargetNode.childNodes || oTargetNode.childNodes.length !== 1) {
            ok(false, "target node was not rendered as expected");
            return;
        }

        strictEqual(oTargetNode.childNodes.length, 1);
        if (bIframeWithPost === true) {
            strictEqual(oTargetNode.childNodes[0].childNodes.length, 2);
        } else {
            strictEqual(oTargetNode.childNodes[0].childNodes.length, 0);
        }
        oIframe = oTargetNode.childNodes[0];

        if (utils.isApplicationTypeEmbeddedInIframe(sApplicationType)) {
            ok(oContainer._adjustNwbcUrl.calledWith(sUrl), "adjustNwbcUrl called with " + sUrl);
            if (bIframeWithPost !== true) {
                var sRealURL = oContainer._adjustNwbcUrl(sUrl);
                strictEqual(oIframe.src, sRealURL, "IFRAME source was set to url " + sRealURL);
            } else {
                strictEqual(oIframe.src, undefined);
            }
        } else {
            strictEqual(oIframe.src, sUrl, "IFRAME source was set to url " + sUrl);
        }

        oContainer._adjustNwbcUrl.restore();

        checkIFrameNode(oIframe, oContainer, bIframeWithPost);
        strictEqual(oIframe.getAttribute("data-sap-ui"), oContainer.getId(), "iframe data-sap-ui attribute is set to the container id");
        strictEqual(oIframe.id, oContainer.getId(), "iframe id is set correctly");
        if (bIframeWithPost !== true) {
            ok(oPrepareEnv.renderManager.writeAccessibilityState.calledOnce, "renderer manager 'writeAccessibilityState method was called once'");
        }
        ok(oContainer.getFrameSource.calledOnce, "container getFrameSource method was called once");
        ok(oContainer.getFrameSource.calledWith(sApplicationType, sUrl, "additionalInfo"),
            "container getFrameSource method was called with the expected arguments");
        ok(oContainer._filterURLParams.called === bIframeWithPost);
        ok(oContainer._generateRootElementForIFrame.called === bIframeWithPost);
        ok(oContainer._buildHTMLElements.called === bIframeWithPost);
        oContainer._filterURLParams.restore();
        oContainer._generateRootElementForIFrame.restore();
        oContainer._buildHTMLElements.restore();
    }

    function checkIFrameNode(oIframe, oContainer, bIframeWithPost) {
        if (bIframeWithPost === true) {
            strictEqual(oIframe.nodeName, "DIV", "got expected <div> dom node");
        } else {
            strictEqual(oIframe.nodeName, "IFRAME", "got expected <iframe> dom node");
        }
        ok(oIframe.classList.contains("myClass1"), "iFrame has the expected class myClass1");
        ok(oIframe.classList.contains("sapUShellApplicationContainer"), "iFrame has the expected class sapUShellApplicationContainer");
        strictEqual(oIframe.style.height, oContainer.getHeight(), "iframe height property was set correctly");
        strictEqual(oIframe.style.width, oContainer.getWidth(), "iframe width property was set correctly");
        if (bIframeWithPost === true) {
            strictEqual(oIframe.getAttribute("sap-iframe-app"), "true");
        } else {
            strictEqual(oIframe.getAttribute("sap-iframe-app"), null);
        }
    }

    /**
     * Tests that the iFrame was not rendered after calling _render.
     *
     * @param {object} oTargetNode The target Node possibly containing an iframe.
     */
    function testIFrameNotRendered(oContainer, oTargetNode) {
        if (!oTargetNode || !oTargetNode.childNodes || oTargetNode.childNodes.length !== 1) {
            ok(true, "target node was not rendered");
        } else {
            ok(false, "the IFrame was not rendered");
        }

        ok(!oContainer._filterURLParams.called);
        ok(!oContainer._generateRootElementForIFrame.called);
        ok(!oContainer._buildHTMLElements.called);
        oContainer._filterURLParams.restore();
        oContainer._generateRootElementForIFrame.restore();
        oContainer._buildHTMLElements.restore();
    }

    /**
     * Calls <code>sap.ushell.components.container.createUi5View</code> for the given container
     * and tests that it fails with the given technical error message.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {string} sMessage technical error message.
     */
    function testFailingCreateUi5View(oContainer, sMessage) {
        var fnCreateView = sinon.spy(sap.ui, "view"),
            oLogMock = testUtils.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sMessage, oContainer.getAdditionalInformation(), sCONTAINER);

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");

        oContainer._createUi5View(oContainer, oContainer.getUrl(),
            oContainer.getAdditionalInformation());

        ok(!fnCreateView.called);
        ok(oContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    }

    // a test component
    jQuery.sap.declare("some.random.path.Component");
    sap.ui.core.UIComponent.extend("some.random.path.Component", {
        createContent: function () { return new sap.ui.core.Icon(); },
        metadata: { config: { foo: "bar" } }
    });
    // a test component w/o configuration
    jQuery.sap.declare("some.random.path.no.config.Component");
    sap.ui.core.UIComponent.extend("some.random.path.no.config.Component", {
        createContent: function () { return new sap.ui.core.Icon(); },
        metadata: {}
    });

    /**
     * Helper function to construct a post message event.
     *
     * @param {object} [oProperties] parameter object.
     * @param {string} [oProperties.service] the name of the service that should be set in the message.
     * @param {string} [oProperties.body] the object that should be set in the message body.
     * @returns {object} message event object; the data property is always serialized.
     */
    function getServiceRequestMessage(oProperties) {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        if (oProperties && oProperties.service) {
            oMessage.data.service = oProperties.service;
        }
        if (oProperties && oProperties.body) {
            oMessage.data.body = oProperties.body;
        }

        // always serialize message event data
        oMessage.data = JSON.stringify(oMessage.data);
        oMessage.source.postMessage = sinon.spy();

        return oMessage;
    }

    // ---------------------------------------------------------------------------------------------

    // Documentation can be found at http://docs.jquery.com/QUnit
    module("components/container/ApplicationContainer.js", {
        setup: function () {
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!

            sinon.stub(Storage.prototype, "removeItem");
            sinon.stub(Storage.prototype, "setItem");
            sinon.stub(sap.ui, "getVersionInfo").returns({ version: undefined });

            BlueBoxHandler.init(undefined, {}, {});
            oAppContainer = Application.createApplicationContainer("testid", { sURL: "xxxxxxx" });

            // oAppContainer.assignCommunicationHandlers({
            //     "sap.ushell.services.CrossApplicationNavigation": {
            //         isTrustedPostMessageSourceFn: function () { return true; },
            //         oServiceCalls: {
            //             "hrefForExternal": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     return  new jQuery.Deferred().resolve(sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal(oServiceParams.oMessageData.body.oArgs)).promise();
            //                 }
            //             },
            //             "getSemanticObjectLinks": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     // beware sSemanticObject may also be an array of argument arrays
            //                     // {sSemanticObject, mParameters, bIgnoreFormFactors }
            //                     return sap.ushell.Container.getService("CrossApplicationNavigation").getSemanticObjectLinks(oServiceParams.oMessageData.body.sSemanticObject, oServiceParams.oMessageData.body.mParameters, oServiceParams.oMessageData.body.bIgnoreFormFactors, undefined, undefined, oServiceParams.oMessageData.body.bCompactIntents);
            //                 }
            //             },
            //             "isIntentSupported": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     return sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported(oServiceParams.oMessageData.body.aIntents);
            //                 }
            //             },
            //             "isNavigationSupported": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     return sap.ushell.Container.getService("CrossApplicationNavigation").isNavigationSupported(oServiceParams.oMessageData.body.aIntents);
            //                 }
            //             },
            //             "backToPreviousApp": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     sap.ushell.Container.getService("CrossApplicationNavigation").backToPreviousApp();
            //                     return new jQuery.Deferred().resolve().promise();
            //                 }
            //             },
            //             "historyBack": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     sap.ushell.Container.getService("CrossApplicationNavigation").historyBack(oServiceParams.oMessageData.body.iSteps);
            //                     return new jQuery.Deferred().resolve().promise();
            //                 }
            //             },
            //             "getAppStateData": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     // note: sAppStateKey may be an array of argument arrays
            //                     return sap.ushell.Container.getService("CrossApplicationNavigation").getAppStateData(oServiceParams.oMessageData.body.sAppStateKey);
            //                 }
            //             },
            //             "toExternal": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     var oArgs = utils.clone(oServiceParams.oMessageData.body.oArgs);
            //                     // special handling for embedded applications
            //                     var oParams = (oArgs || {}).params;
            //                     var bHasSapSystem = oParams && oParams.hasOwnProperty("sap-system");
            //                     if (bHasSapSystem) {
            //                         if (utils.isPlainObject(oParams["sap-system"])) {
            //                             var oSapSystemData = oParams["sap-system"];
            //                             var sSapSystemSrc = oParams["sap-system-src"];
            //                             var bHasSapSystemSrc = typeof sSapSystemSrc === "string";
            //                             if (!bHasSapSystemSrc) {
            //                                 oServiceParams.storeSapSystemData(oSapSystemData);
            //                             } else {
            //                                 oServiceParams.storeSapSystemData(oSapSystemData, sSapSystemSrc);
            //                                 oParams["sap-system-src"] = sSapSystemSrc;
            //                             }
            //                             oParams["sap-system"] = oSapSystemData.id;
            //                         } else if (oServiceParams.matchesLocalSid(oParams["sap-system"])) {
            //                             delete oParams["sap-system"];
            //                         }
            //                     }
            //                     return new jQuery.Deferred().resolve(sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oArgs)).promise();
            //                 }
            //             }
            //         }
            //     },
            //     "sap.ushell.CrossApplicationNavigation": {
            //         isTrustedPostMessageSourceFn: function () { return true; },
            //         oServiceCalls: {
            //             "backToPreviousApp": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     sap.ushell.Container.getService("CrossApplicationNavigation").backToPreviousApp();
            //                     return new jQuery.Deferred().resolve().promise();
            //                 }
            //             }
            //         }
            //     },
            //     "sap.ushell.ui5service.ShellUIService": {
            //         isTrustedPostMessageSourceFn: function () { return true; },
            //         oServiceCalls: {
            //             "setTitle": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     return new jQuery.Deferred().resolve(oServiceParams.oContainer.getShellUIService().setTitle(oServiceParams.oMessageData.body.sTitle)).promise();
            //                 }
            //             },
            //             "setBackNavigation": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     return oServiceParams.executeSetBackNavigationService(oServiceParams.oMessage, oServiceParams.oMessageData);
            //                 }
            //             }
            //         }
            //     },
            //     "sap.ushell.services.Container": {
            //         isTrustedPostMessageSourceFn: function () { return true; },
            //         oServiceCalls: {
            //             "setDirtyFlag": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     sap.ushell.Container.setDirtyFlag(oServiceParams.oMessageData.body.bIsDirty);
            //                     return new jQuery.Deferred().resolve().promise();
            //                 }
            //             },
            //             "getFLPUrl": {
            //                 executeServiceCallFn: function (oServiceParams) {
            //                     return new jQuery.Deferred().resolve(sap.ushell.Container.getFLPUrl()).promise();
            //                 }
            //             }
            //         }
            //     }
            // });
            // prevent deferred events unless explicitely enabled
            publishExternalEventStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_publishExternalEvent");
        },
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            testUtils.restoreSpies(
                sap.ui.getVersionInfo,
                jQuery.sap.assert,
                jQuery.sap.getObject,
                jQuery.sap.getUriParameters,
                jQuery.sap.log.warning,
                jQuery.sap.log.debug,
                jQuery.sap.registerModulePath,
                jQuery.sap.resources,
                jQuery.sap.uid,
                sap.ui.component,
                sap.ui.getCore,
                sap.ui.getVersionInfo,
                sap.ui.view,
                oAppContainer._adjustNwbcUrl,
                oAppContainer._createErrorControl,
                oAppContainer._createUi5Component,
                oAppContainer._publishExternalEvent,
                oAppContainer._createUi5View,
                oAppContainer._destroyChild,
                oAppContainer._getTranslatedText,
                oAppContainer._handleServiceMessageEvent,
                oAppContainer._isTrustedPostMessageSource,
                oAppContainer._logout,
                oAppContainer._render,
                oAppContainer._renderControlInDiv,
                utils.localStorageSetItem,
                utils.getLocalStorage,
                Storage.prototype.getItem,
                Storage.prototype.removeItem,
                Storage.prototype.setItem,
                window.addEventListener,
                window.removeEventListener,
                sap.ushell.utils.getParameterValueBoolean
            );
            publishExternalEventStub.restore();
            Application.destroy(oAppContainer);
            oAppContainer = undefined;
            delete sap.ushell.Container;
        }
    });

    [{
        description: "application is stateful",
        bIsStateful: true,
        expectedRerenderRemoved: true
    }, {
        description: "application is not stateful",
        bIsStateful: false,
        expectedRerenderRemoved: true
    }].forEach(function (oFixture) {
        QUnit.test("ApplicationContainer#onAfterRendering when " + oFixture.description, function (assert) {
            // Arrange
            var oAppContainer = {
                getIsStateful: sinon.stub().returns(oFixture.bIsStateful),
                rerender: function () { return "ABC"; }
            };

            var fnOnAfterRendering = sap.ushell.components.container
                .ApplicationContainer.prototype
                .onAfterRendering.bind(oAppContainer);

            // Act
            fnOnAfterRendering();

            // Assert
            // always renderer is overridden.
            assert.strictEqual(
                oAppContainer.rerender(),
                oFixture.expectedRerenderRemoved ? undefined : "ABC",
                "rerender method of app container returns the expected result after onAfterRendering is called"
            );
        });
    });

    [{
        description: "called for a supported application type, TR, returns a resolved promise",
        sApplicationType: "TR",
        expectedResolve: true
    }, {
        description: "called for a unsupported application type, XYZABC, returns a rejected promise",
        sApplicationType: "XYZABC",
        expectedResolve: false
    }].forEach(function (oFixture) {
        QUnit.test("ApplicationContainer#setNewApplicationContext when " + oFixture.description, function (assert) {
            // Arrange
            var fnDone = assert.async(),
                oFakeIFrame = {},
                oFakePostMessageRequest = {},
                oAppContainer = {
                    setNewTRApplicationContext: sinon.stub().returns(Promise.resolve(null)),
                    _getIFrame: sinon.stub().returns(oFakeIFrame),
                    postMessageToIframe: sinon.stub().returns(Promise.resolve()),
                    createPostMessageRequest: sinon.stub().returns(oFakePostMessageRequest)
                },
                setNewApplicationContext = sap.ushell.components.container
                    .ApplicationContainer.prototype
                    .setNewApplicationContext.bind(oAppContainer);

            // Act
            var sMaybeNot = oFixture.expectedResolve ? "" : "not";
            setNewApplicationContext(oFixture.sApplicationType, "scheme://host:port/resource")
                .then(function () {
                    // Assert
                    ok(oFixture.expectedResolve, "promise was " + sMaybeNot + " resolved");
                    assert.equal(
                        oAppContainer.setNewTRApplicationContext.calledOnce,
                        true,
                        "It calls ApplicationContainer#setNewTRApplicationContext"
                    );
                    assert.equal(
                        oAppContainer.setNewTRApplicationContext.args[0][0],
                        "scheme://host:port/resource",
                        "It calls ApplicationContainer#setNewTRApplicationContext with the URL it was passed with"
                    );
                    assert.equal(
                        oAppContainer._getIFrame.callCount,
                        1,
                        "_getIFrame was called once"
                    );
                    assert.equal(
                        oAppContainer.postMessageToIframe.callCount,
                        1,
                        "postMessageToIframe is called"
                    );
                }, function () {
                    // Assert
                    ok(!oFixture.expectedResolve, "promise was " + sMaybeNot + " resolved");
                    assert.equal(
                        true,
                        oAppContainer.setNewTRApplicationContext.notCalled,
                        "It does NOT call ApplicationContainer#setNewTRApplicationContext"
                    );
                })
                .then(fnDone, fnDone);
        });

        [{
            testDescription: "Navigation made to same application type in reusable contaner",
            sContainerApplicationType: "TR",
            sNextApplicationType: "TR",
            bIsStatefulContainer: true,
            expected: "postMessageNotSent"
        }, {
            testDescription: "Navigation made to different application type in reusable container",
            sContainerApplicationType: "TR",
            sNextApplicationType: "SAPUI5",
            bIsStatefulContainer: true,
            expected: "postMessageSent"
        }, {
            testDescription: "Navigation made to different application type in non-reusable container",
            sContainerApplicationType: "TR",
            sNextApplicationType: "SAPUI5",
            bIsStatefulContainer: false, // no post message if container is not reusable
            expected: "postMessageNotSent"
        }, {
            testDescription: "Navigation made to different application in non-reusable WDA container",
            sContainerApplicationType: "WDA",
            sNextApplicationType: "SAPUI5",
            bIsStatefulContainer: false, // no post message if container is not reusable
            expected: "postMessageNotSent"
        }].forEach(function (oFixture) {
            QUnit.test("ApplicationContainer#onApplicationOpened: " + oFixture.testDescription, function (assert) {
                // Arrange
                var iNow = Date.now(),
                    fnDone = assert.async(),
                    oClock = sinon.useFakeTimers(iNow),
                    oContentWindow = {
                        postMessage: sinon.spy(function (sData) {
                            var oData = JSON.parse(sData);

                            window.postMessage(JSON.stringify({
                                status: "success",
                                request_id: oData.request_id
                            }), "*");
                        })
                    };

                var oAppContainer = {
                    getId: sinon.stub().returns("CONTAINER_ID"),
                    getDomRef: sinon.stub().returns({
                        tagName: "IFRAME",
                        contentWindow: oContentWindow,
                        src: new URI()
                    }),
                    _getIFrame: sap.ushell.components.container.ApplicationContainer.prototype._getIFrame,
                    _getIFrameUrl: sap.ushell.components.container.ApplicationContainer.prototype._getIFrameUrl,
                    getIframeWithPost: sinon.stub().returns(false),
                    postMessageToIframe: sap.ushell.components.container.ApplicationContainer.prototype.postMessageToIframe,
                    createPostMessageRequest: sap.ushell.components.container.ApplicationContainer.prototype.createPostMessageRequest,
                    getApplicationType: sinon.stub().returns(oFixture.sContainerApplicationType),
                    getIsStateful: sinon.stub().returns(oFixture.bIsStatefulContainer)
                };

                var onApplicationOpened = sap.ushell.components.container
                    .ApplicationContainer.prototype
                    .onApplicationOpened.bind(oAppContainer);

                // Act
                onApplicationOpened(oFixture.sNextApplicationType)
                    .then(function (oPromiseResult) {
                        if (oFixture.expected === "postMessageNotSent") {
                            // Assert
                            assert.strictEqual(
                                oPromiseResult,
                                undefined,
                                "The promise was resolved with undefined"
                            );
                            assert.strictEqual(
                                oAppContainer.getDomRef.calledOnce,
                                false,
                                "A reference to the iframe that displays the application is not accessed"
                            );
                            assert.strictEqual(
                                oContentWindow.postMessage.calledOnce,
                                false,
                                "A message was not sent to the iframe that displays the application."
                            );
                        }
                        if (oFixture.expected === "postMessageSent") {
                            // Assert
                            assert.strictEqual(
                                oPromiseResult,
                                undefined, // undefined: post message sent without waiting for response
                                "The promise was resolved with undefined"
                            );
                            assert.strictEqual(
                                oAppContainer.getDomRef.calledOnce,
                                true,
                                "A reference to the iframe that displays the application is accessed"
                            );
                            assert.strictEqual(
                                oContentWindow.postMessage.calledOnce,
                                true,
                                "A message was sent to the iframe that displays the application."
                            );
                            assert.strictEqual(
                                new RegExp("\"service\":s*\"sap.gui.triggerCloseSession\"").test(oContentWindow.postMessage.args[0][0]),
                                true,
                                "The message sent to the iframe contains the mandatory `service` id 'sap.gui.triggerCloseSession' as expected"
                            );

                            throw new Error("Invalid value for 'expected' member in fixture: " + oFixture.expected);
                        }
                    })
                    .then(
                        function () { oClock.restore(); },
                        function () { oClock.restore(); }
                    )
                    .then(fnDone, fnDone);
            });
        });
    });

    QUnit.test("ApplicationContainer#setNewTRApplicationContext", function (assert) {
        // Arrange
        var iNow = Date.now(),
            fnDone = assert.async(),
            oClock = sinon.useFakeTimers(iNow),
            oContentWindow = {
                postMessage: sinon.spy(function (sData) {
                    var oData = JSON.parse(sData);
                    window.postMessage(JSON.stringify({
                        status: "success",
                        request_id: oData.request_id
                    }), "*");
                })
            };
        var oAppContainer = {
            getId: sinon.stub().returns("CONTAINER_ID"),
            getDomRef: sinon.stub().returns({
                tagName: "IFRAME",
                contentWindow: oContentWindow,
                src: new URI()
            }),
            _getIFrame: sap.ushell.components.container.ApplicationContainer.prototype._getIFrame,
            _getIFrameUrl: sap.ushell.components.container.ApplicationContainer.prototype._getIFrameUrl,
            getIframeWithPost: sinon.stub().returns(false),
            postMessageToIframe: sap.ushell.components.container.ApplicationContainer.prototype.postMessageToIframe,
            createPostMessageRequest: sap.ushell.components.container.ApplicationContainer.prototype.createPostMessageRequest
        };
        var setNewTRApplicationContext = sap.ushell.components.container
            .ApplicationContainer.prototype
            .setNewTRApplicationContext.bind(oAppContainer);
        var sInputUrl = "scheme://host:port/resource";

        // Act
        setNewTRApplicationContext(sInputUrl)
            .then(function () {
                // Assert
                assert.equal(
                    oAppContainer.getDomRef.calledOnce,
                    true,
                    "A reference to the iframe that displays the application is accessed."
                );
                assert.equal(
                    oContentWindow.postMessage.calledOnce,
                    true,
                    "A message was sent to the iframe that displays the application."
                );
                assert.equal(
                    new RegExp("\"request_id\":s*\"" + iNow + "\"").test(oContentWindow.postMessage.args[0][0]),
                    true,
                    "The message sent to the iframe contains a `request_id` as expected"
                );
                assert.equal(
                    new RegExp("\"service\":s*\"sap.its.startService\"").test(oContentWindow.postMessage.args[0][0]),
                    true,
                    "The message sent to the iframe contains the mandatory `service` id 'sap.its.startService' as expected"
                );
                assert.equal(
                    true,
                    new RegExp("\"url\":s*\"" + sInputUrl + "\"").test(oContentWindow.postMessage.args[0][0]),
                    "The message sent to the iframe contains a `url` as expected"
                );
            })
            .then(
                function () { oClock.restore(); },
                function () { oClock.restore(); }
            )
            .then(fnDone, fnDone);
    });

    test("test declared properties", function () {
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        var actualProps = Object.keys(oAppContainer.getMetadata().getProperties());
        [
            "additionalInformation", "application", "applicationConfiguration",
            "applicationType", "height", "navigationMode", "text", "url", "visible", "width"
        ].forEach(function (sStr) {
            ok(actualProps.indexOf(sStr) >= 0, " property " + sStr + " present");
        });
    });

    [{
        description: "accessibility was set to 'X'",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas", // NOTE: not the browser location URL!
        expectedUrlAddition: "sap-ie=edge&sap-accessibility=X",
        nwbcTheme: undefined,
        accessibility: "X",
        applicationType: "NWBC"
    }, {
        description: "sap-accessibility was set to 'X' in the browser location url",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        sapAccessibilityUrlBoolean: true,
        expectedUrlAddition: "sap-ie=edge&sap-accessibility=X",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-accessibility was set to false in the browser location url",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        sapAccessibilityUrlBoolean: false,
        expectedUrlAddition: "sap-ie=edge",
        nwbcTheme: undefined,
        accessibility: "X",
        applicationType: "NWBC"
    }, {
        description: "accessibility was set to undefined",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "accessibility was set to ''",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "theme from User object is undefined",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "theme from User object is a sap_ theme",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-theme=sap_hcb",
        nwbcTheme: "sap_hcb",
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "theme from User object is a custom theme",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-theme=custom_theme@https://frontendserver.company.com/the/theme/repository/path",
        nwbcTheme: "custom_theme@https://frontendserver.company.com/the/theme/repository/path",
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "the version is set (1.32.5.270343434) and applicationType = NWBC",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-shell=FLP1.32.5-NWBC",
        version: "1.32.5.270343434",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "the version is set (1.32.5.270343434) and no applicationType is set",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-shell=FLP1.32.5-NWBC",
        version: "1.32.5.270343434",
        nwbcTheme: undefined,
        accessibility: undefined
        // no application type
    }, {
        description: "the version is set (1.32.5.270343434) and applicationType = TR",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-shell=FLP1.32.5",
        version: "1.32.5.270343434",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "TR"
    }, {
        description: "the version is set (1.39.0-SNAPSHOT) and applicationType = TR",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-shell=FLP1.39.0",
        version: "1.39.0-SNAPSHOT",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "TR"
    }, {
        description: "sap.ui.getVersionInfo() fails and the version is retrieved from sap.ui.version (1.39.0-SNAPSHOT) and applicationType = TR",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-shell=FLP1.39.0",
        getVersionInfoError: new Error("sap.ui.getVersionInfo() failed"),
        version: "1.39.0-SNAPSHOT",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "TR"
    }, {
        description: "sap-statistics was set to true in UI5 configuration",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        sapStatisticsUI5ConfigBoolean: true,
        expectedUrlAddition: "sap-ie=edge&sap-statistics=true",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-statistics was set to false in UI5 configuration",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        sapStatisticsUI5ConfigBoolean: false,
        expectedUrlAddition: "sap-ie=edge",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-statistics was set to true in the UI5 configuration and the sap-statistics appears as a non-true and non-false intent parameter",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas?sap-statistics=something",
        sapStatisticsUI5ConfigBoolean: true,
        expectedUrlAddition: "sap-ie=edge",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-statistics was set to true in the UI5 configuration and the sap-statistics appears false intent parameter",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas?sap-statistics=false",
        sapStatisticsUI5ConfigBoolean: true,
        expectedUrlAddition: "sap-ie=edge",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "`bReuseSession` is true; the url has the query parameter `sap-keepclientsession=1`",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-keepclientsession=1",
        nwbcTheme: undefined,
        accessibility: undefined,
        bReuseSession: true
    }, {
        description: "flp URL contains sap-iapp-state parameter in the hash in 1 parameter",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-iapp-state=APPSTATEID",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/sap-iapp-state=APPSTATEID"; }
    }, {
        description: "flp URL contains sap-iapp-state parameter in the hash in 3 parameters",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-iapp-state=APPSTATEID",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/AAAAA=12345667/sap-iapp-state=APPSTATEID/BBBBB=987654"; }
    }, {
        description: "flp URL contains empty hash",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        applicationType: "NWBC",
        getHashFunc: function () { return ""; }
    }, {
        description: "flp URL contains undefined hash",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        applicationType: "NWBC",
        getHashFunc: function () { return undefined; }
    }, {
        description: "flp URL contains no sap-iapp-state parameter in the hash",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic"; }
    }, {
        description: "flp URL contains empty sap-iapp-state parameter in the hash with 3 parameters",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/AAAAA=12345667/sap-iapp-state=/BBBBB=987654"; }
    }, {
        description: "flp URL contains empty sap-iapp-state parameter in the hash with 1 parameter only",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/sap-iapp-state="; }
    }, {
        description: "URL for compact density",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-touch=0",
        applicationType: "NWBC",
        densityFunc: function () {
            jQuery("body")
                .toggleClass("sapUiSizeCompact", true)
                .toggleClass("sapUiSizeCozy", false);
        }
    }, {
        description: "URL for compact density",
        inputUrl: "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-touch=1",
        applicationType: "NWBC",
        densityFunc: function () {
            jQuery("body")
                .toggleClass("sapUiSizeCompact", false)
                .toggleClass("sapUiSizeCozy", true);
        }
    }].forEach(function (oFixture) {
        asyncTest("adjustNwbcUrl returns the correct URL when " + oFixture.description, 1, function () {
            // Arrange
            sap.ushell.bootstrap("local")
                .done(function () {
                    var sUrl,
                        sAdjustedUrl,
                        sCurrentUi5Version,
                        fHashStub;

                    sinon.stub(sap.ushell.utils, "getParameterValueBoolean", function (sParameter, sUrl) {
                        if (sParameter === "sap-accessibility" && sUrl === undefined) { return oFixture.sapAccessibilityUrlBoolean; }

                        throw "code is calling getParameterValueBoolean with unexpected arguments";
                    });

                    sinon.stub(sap.ui, "getCore").returns({
                        getConfiguration: sinon.stub().returns({
                            getStatistics: sinon.stub().returns(oFixture.sapStatisticsUI5ConfigBoolean)
                        })
                    });

                    if (oFixture.getVersionInfoError) {
                        testUtils.restoreSpies(sap.ui.getVersionInfo);
                        sinon.stub(sap.ui, "getVersionInfo").throws(oFixture.getVersionInfoError);
                        sCurrentUi5Version = sap.ui.version;
                        sap.ui.version = oFixture.version;
                    } else if (oFixture.version) {
                        testUtils.restoreSpies(sap.ui.getVersionInfo);
                        sinon.stub(sap.ui, "getVersionInfo").returns({ version: oFixture.version });
                    }
                    sinon.stub(sap.ushell.Container, "getUser").returns({
                        getTheme: function (sThemeValueType) {
                            if (sThemeValueType === sap.ushell.User.prototype.constants.themeFormat.NWBC) {
                                return oFixture.nwbcTheme;
                            }
                            return "noTheme";
                        },
                        getAccessibilityMode: function () {
                            return oFixture.accessibility;
                        }
                    });

                    if (oFixture.getHashFunc) {
                        fHashStub = sinon.stub(window.hasher, "getHash", oFixture.getHashFunc);
                    }

                    if (oFixture.densityFunc) {
                        oFixture.densityFunc();
                    }

                    sUrl = oFixture.inputUrl;
                    // Act
                    sAdjustedUrl = decodeURIComponent(oAppContainer._adjustNwbcUrl(sUrl, oFixture.applicationType, undefined, oFixture.bReuseSession));
                    // decode the URL for better readability in case of errors
                    // Assert
                    start();
                    var sSep = oFixture.inputUrl.indexOf("?") >= 0 ? "&" : "?";

                    strictEqual(sAdjustedUrl, oFixture.inputUrl + sSep + oFixture.expectedUrlAddition);

                    // restore
                    if (sCurrentUi5Version) {
                        sap.ui.version = sCurrentUi5Version;
                    }
                    if (oFixture.getHashFunc) {
                        fHashStub.restore();
                    }

                    jQuery("body")
                        .toggleClass("sapUiSizeCompact", false)
                        .toggleClass("sapUiSizeCozy", false);
                });
        });
    });

    [{
        sExpectedUrl: "http://www.google.de",
        sExpectedConfigId: 1,
        sExpectedValidation: true,
        sTitle: "allowed external url"
    }, {
        sExpectedUrl: "#Buch-lesen",
        sExpectedConfigId: 2,
        sExpectedValidation: false,
        sTitle: "not allowed url"
    }, {
        sExpectedUrl: "#Action-toappnavsample",
        sExpectedConfigId: 3,
        sExpectedValidation: true,
        sTitle: "allowed semantic object and action"
    }, {
        sExpectedUrl: "blaBlabla",
        sExpectedConfigId: 4,
        sExpectedValidation: false,
        sTitle: "not allowed url format"
    }, {
        sExpectedUrl: "http://www.spiegel",
        sExpectedConfigId: 5,
        sExpectedValidation: false,
        sTitle: "not allowed url format. Ending is missing"
    }, {
        sExpectedUrl: "http:/www.spiegel.de",
        sExpectedConfigId: 6,
        sExpectedValidation: false,
        sTitle: "not allowed url format. One slash after http:/ is missing"
    }, {
        sExpectedUrl: "",
        sExpectedConfigId: 7,
        sExpectedValidation: false,
        sTitle: "empty string as url"
    }, {
        sExpectedUrl: undefined,
        sExpectedConfigId: 8,
        sExpectedValidation: false,
        sTitle: "url is undefined"
    }].forEach(function (oFixture) {
        asyncTest("adaptIsUrlSupportedResultForMessagePopover: " + oFixture.sTitle, function () {
            var oDeferred,
                oES6PromisePassed = {}, // object containing the original resolve and reject functions gets passed to the unified shell
                oES6Promise = new Promise(function (resolve, reject) { // promise created by SAP UI5
                    oES6PromisePassed.resolve = resolve;
                    oES6PromisePassed.reject = reject;
                }),
                oCrossAppNavService = {
                    "isUrlSupported": function (sUrl) {
                        strictEqual(sUrl, oFixture.sExpectedUrl, "correct url was passed to the service");
                        oDeferred = new jQuery.Deferred();
                        return oDeferred.promise();
                    }
                };

            window.sap = window.sap || {};
            sap.ushell = sap.ushell || {};
            sap.ushell.Container = sap.ushell.Container || {
                getService: function (/*sService*/) { return oCrossAppNavService; }
            };

            oAppContainer._adaptIsUrlSupportedResultForMessagePopover({ "promise": oES6PromisePassed, "url": oFixture.sExpectedUrl, "id": oFixture.sExpectedConfigId });

            oES6Promise.then(function (oResult) {
                start();
                ok(true, "Promise was resolved and not rejected");
                strictEqual(oResult.allowed, oFixture.sExpectedValidation, "SAP UI5 promise was resolved correctly");
                strictEqual(oResult.id, oFixture.sExpectedConfigId, "Config ID was passed correctly and got resolved as expected");
            }).catch(function () {
                start();
                ok(false);
            });

            if (oFixture.sExpectedValidation) {
                oDeferred.resolve();
            } else {
                oDeferred.reject();
            }
        });
    });

    test("getTranslatedText", function () {
        var oResourceBundle = { getText: sinon.spy() };

        sinon.stub(jQuery.sap, "resources").returns(oResourceBundle);
        oAppContainer._getTranslatedText("an_error_has_occured");
        ok(jQuery.sap.resources.calledWith({
            url: jQuery.sap.getModulePath(sPREFIX) + "/resources/resources.properties",
            language: sap.ui.getCore().getConfiguration().getLanguage()
        }));
        ok(oResourceBundle.getText.calledWith("an_error_has_occured"));
        oAppContainer._getTranslatedText("loading", ["foo bar"]);
        ok(jQuery.sap.resources.calledOnce);
        ok(oResourceBundle.getText.calledWith("loading", ["foo bar"]));
    });

    [
         {
             sTitle: "All params need to be excluded",
             sUrlInput: "http://www.dummy.com/?sap-ach=true&sap-ui-debug=true&sap-ui-fl-control-variant-id=1234&sap-ui2-wd-conf-id=1",
             sExpectedUrlOutput: "http://www.dummy.com/"
         },
         {
             sTitle: "No param need to be excluded. URL remains the same",
             sUrlInput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-keepclientsession=true&sap-touch=0&sap-shell=FLP1.69.0-NWBC",
             sExpectedUrlOutput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-keepclientsession=true&sap-touch=0&sap-shell=FLP1.69.0-NWBC"
         },
         {
             sTitle: "One param in the middle need to be excluded",
             sUrlInput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-ui-debug=true&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-touch=0&sap-shell=FLP1.69.0-NWBC",
             sExpectedUrlOutput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-touch=0&sap-shell=FLP1.69.0-NWBC"
         },
         {
             sTitle: "One param at the begining and one at the end",
             sUrlInput: "http://www.dummy.com/sap/bc/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-ui-debug=true&sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-theme=sap_fiori_3&sap-accessibility=false&sap-touch=0&sap-shell=FLP1.69.0-NWBC&sap-ui-tech-hint=false",
             sExpectedUrlOutput: "http://www.dummy.com/sap/bc/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&sap-theme=sap_fiori_3&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-accessibility=false&sap-touch=0&sap-shell=FLP1.69.0-NWBC"
         }
    ].forEach(function (oFixture) {
        test("filterURLParams: " + oFixture.sTitle, function () {
            var urlAfterFiler = "";
            urlAfterFiler = oAppContainer._filterURLParams(oFixture.sUrlInput);
            strictEqual(urlAfterFiler, oFixture.sExpectedUrlOutput);
        });
    });

    test("renderControlInDiv w/o child", function () {
        var oDiv,
            oRenderManager = new sap.ui.core.RenderManager(),
            oTargetNode = document.createElement("DIV");

        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        oAppContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");

        oAppContainer._renderControlInDiv(
            oRenderManager,
            oAppContainer
        );

        oRenderManager.flush(oTargetNode);
        strictEqual(oTargetNode.childNodes.length, 1);
        oDiv = oTargetNode.childNodes[0];
        strictEqual(oDiv.nodeName, "DIV");
        ok(oDiv.classList.contains("myClass1"), "Div has the expected class myClass1");
        ok(oDiv.classList.contains("sapUShellApplicationContainer"), "Div has the expected class sapUShellApplicationContainer");
        strictEqual(oDiv.getAttribute("data-sap-ui"), oAppContainer.getId());
        strictEqual(oDiv.id, oAppContainer.getId());
        strictEqual(oDiv.style.height, oAppContainer.getHeight());
        strictEqual(oDiv.style.width, oAppContainer.getWidth());
        ok(oRenderManager.writeAccessibilityState.calledOnce);
    });

    test("renderControlInDiv w/ child", function () {
        var oChild = new sap.ui.core.Icon(),
            oDiv,
            oRenderManager = new sap.ui.core.RenderManager(),
            oTargetNode = document.createElement("DIV");

        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        oAppContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");
        sinon.spy(oRenderManager, "renderControl");

        oAppContainer._renderControlInDiv(
            oRenderManager,
            oAppContainer,
            oChild
        );

        oRenderManager.flush(oTargetNode);
        strictEqual(oTargetNode.childNodes.length, 1);
        oDiv = oTargetNode.childNodes[0];
        strictEqual(oDiv.nodeName, "DIV");
        ok(oDiv.classList.contains("myClass1"), "Div contains correct class");
        ok(oDiv.classList.contains("sapUShellApplicationContainer"), "Div contains correct class");
        strictEqual(oDiv.getAttribute("data-sap-ui"), oAppContainer.getId());
        strictEqual(oDiv.id, oAppContainer.getId());
        strictEqual(oDiv.style.height, oAppContainer.getHeight());
        strictEqual(oDiv.style.width, oAppContainer.getWidth());
        ok(oRenderManager.writeAccessibilityState.withArgs(oAppContainer).calledOnce);
        ok(oRenderManager.renderControl.calledOnce);
        ok(oRenderManager.renderControl.calledWith(oChild));
    });

    test("createErrorControl", function () {
        var oResult,
            oCurrAppContainer = new sap.ushell.components.container.ApplicationContainer();

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_getTranslatedText").returns("Error occurred");

        oResult = oCurrAppContainer._createErrorControl();

        ok(oResult instanceof sap.ui.core.Control, "public contract");
        ok(oResult instanceof sap.ui.core.Icon, "implementation details");
        strictEqual(oResult.getSize(), "2rem");
        strictEqual(oResult.getSrc(), "sap-icon://error");
        strictEqual(oResult.getTooltip(), "Error occurred");
        ok(oCurrAppContainer._getTranslatedText.calledWith("an_error_has_occured"));
    });

    test("ApplicationContainer control", function () {
        strictEqual(typeof sap.ushell.components.container.ApplicationContainer, "function");

        ok(oAppContainer instanceof sap.ui.core.Control);
        strictEqual(oAppContainer.getAdditionalInformation(), "",
            "default for 'additionalInformation' property");
        strictEqual(oAppContainer.getApplicationType(), "URL",
            "default for 'applicationType' property");
        strictEqual(oAppContainer.getHeight(), "100%", "default for 'height' property");
        strictEqual(oAppContainer.getUrl(), "", "default for 'url' property");
        strictEqual(oAppContainer.getVisible(), true, "default for 'visible' property");
        strictEqual(oAppContainer.getWidth(), "100%", "default for 'width' property");
        strictEqual(oAppContainer.getApplication(), undefined, "default for 'application' property");
        strictEqual(oAppContainer.getChild, undefined, "'child' hidden");

        asyncTest("ApplicationContainer defines all its private aggregations in the design time metadata definition", function () {
            var oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: ApplicationType.URL.type
            });

            var aAllPrivateAggregations = Object.keys(oCurAppContainer.getMetadata().getAllPrivateAggregations()),
                oMetadata = oCurAppContainer.getMetadata();

            oMetadata.loadDesignTime().then(function (oDesignTimeMetadata) {
                ok(true, "loadDesignTime promise was resolved");

                var oDesignTimeAggregations = oDesignTimeMetadata.aggregations;
                ok(oDesignTimeAggregations, "design time aggregations were defined on the ApplicationContainer");

                if (oDesignTimeAggregations) {
                    aAllPrivateAggregations.forEach(function (sAggregation) {
                        ok(oDesignTimeMetadata.aggregations.hasOwnProperty(sAggregation),
                            "The private aggregation '" + sAggregation + "' was defined among the design time metadata");
                    });
                }
                start();
            }, function (/*oError*/) {
                ok(false, "loadDesignTime promise was resolved");
                start();
            });
        });

        aEmbeddableApplicationTypes.forEach(function (sLegacyApplicationType) {
            var oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: ApplicationType.enum[sLegacyApplicationType]
            });
            strictEqual(oCurAppContainer.getApplicationType(),
                ApplicationType.enum[sLegacyApplicationType]);
        });


        throws(function () {
            new sap.ushell.components.container.ApplicationContainer({ applicationType: "foo" });
        });

        var oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({ url: sTESTURL });
        strictEqual(oCurAppContainer.getUrl(), sTESTURL);

        oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({ visible: false });
        strictEqual(oCurAppContainer.getVisible(), false);

        oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({ height: "200px" });
        strictEqual(oCurAppContainer.getHeight(), "200px");

        throws(function () {
            oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({ height: "200foo" });
        });

        oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({ width: "100px" });
        strictEqual(oCurAppContainer.getWidth(), "100px");

        throws(function () {
            oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({ width: "100foo" });
        });

        oCurAppContainer = new sap.ushell.components.container.ApplicationContainer({ additionalInformation: "SAPUI5=" });
        strictEqual(oCurAppContainer.getAdditionalInformation(), "SAPUI5=");
    });

    test("ApplicationContainer renderer exists", function () {
        var oRenderManager = new sap.ui.core.RenderManager(),
            oContainerRenderer = oRenderManager.getRenderer(oAppContainer);

        strictEqual(typeof oContainerRenderer, "object", oContainerRenderer);
    });

    test("sap.ushell.components.container.render URL", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        sap.ushell.Container = mockSapUshellContainer();
        renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.URL.type, sTESTURL);
    });

    test("sap.ushell.components.container.render WDA", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        sap.ushell.Container = mockSapUshellContainer();
        renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.WDA.type,
            "http://anyhost:1234/sap/bc/webdynpro/sap/test_navigation_parameter");
    });

    ["NWBC", "TR", "WDA"].forEach(function (sLegacyApplicationType) {
        asyncTest("sap.ushell.components.container.render " + sLegacyApplicationType, function () {
            Application.destroy(oAppContainer);
            oAppContainer = new sap.ushell.components.container.ApplicationContainer();

            sap.ushell.bootstrap("local").done(function () {
                oAppContainer.setWidth("10%");
                oAppContainer.setHeight("20%");

                start();

                sap.ushell.Container = mockSapUshellContainer();
                renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.enum[sLegacyApplicationType],
                    "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas");
            });
        });
    });

    test("getFrameSource", function () {
        strictEqual(oAppContainer.getFrameSource(ApplicationType.URL.type, sTESTURL, ""), sTESTURL);
    });

    test("getFrameSource invalid type", function () {
        throws(function () {
            oAppContainer.getFrameSource("FOO", sTESTURL, "");
        }, /Illegal application type: FOO/);
    });

    test("sap.ushell.components.container.render invalid type", function () {
        var oRenderManager = new sap.ui.core.RenderManager(),
            sType = "FOO",
            sTechnicalErrorMsg = "Illegal application type: " + sType,
            oLogMock = testUtils.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");

        oAppContainer._render(oRenderManager, oAppContainer, sType, sTESTURL, "");

        ok(oAppContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    });

    test("getFrameSource throw new Error", function () {
        var oRenderManager = new sap.ui.core.RenderManager(),
            sTechnicalErrorMsg = "Some error message",
            oLogMock = testUtils.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");

        oAppContainer.getFrameSource = function () { throw new Error(sTechnicalErrorMsg); };
        oAppContainer._render(oRenderManager, oAppContainer, "n/a", sTESTURL, "");

        ok(oAppContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    });

    test("sap.ushell.components.container.render invalid type w/ custom getFrameSource", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");

        var oMockConfigOverrides = {
            "/appContainer/fnGetFrameSource": sinon.spy(function (sApplicationType, sUrl/*, sAdditionalInformation*/) {
                // Note: no error thrown!
                return sUrl;
            })
        };

        sap.ushell.Container = mockSapUshellContainer();
        renderInternallyAndExpectIFrame(oAppContainer, "TRA", sTESTURL, oMockConfigOverrides);
    });

    test("sap.ushell.components.container.render UI5 (SAPUI5=)", function () {
        var oRenderManager = new sap.ui.core.RenderManager().getInterface(),
            oIcon = new sap.ui.core.Icon();

        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        // return a button instead of a view, so that we have a control with the necessary
        // properties, but don't have to supply another file for the view definition
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5View").returns(oIcon);
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5=some.random.path.Viewname.view.xml");
        ok(oAppContainer._createUi5View.calledOnce);
        ok(oAppContainer._createUi5View.calledWith(oAppContainer, sTESTURL, "SAPUI5=some.random.path.Viewname.view.xml"));
        ok(oAppContainer._renderControlInDiv.calledWith(oRenderManager, oAppContainer, oIcon));
    });

    test("ApplicationContainer invisible", function () {
        var oRenderManager = new sap.ui.core.RenderManager();

        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        oAppContainer.setVisible(false);
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_render");
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        ok(oAppContainer._render.notCalled, "_render function wasn't called on the application container");
        ok(oAppContainer._renderControlInDiv.calledWith(oRenderManager.getRendererInterface(), oAppContainer));
    });

    test("ApplicationContainer inactive", function () {
        var oRenderManager = new sap.ui.core.RenderManager();

        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        oAppContainer.setVisible(true);
        oAppContainer.setActive(false);
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_render");
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        ok(oAppContainer._render.called, "_render function was called on inactive but visible application container");
    });

    test("ApplicationContainer rendering (active container)", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        oAppContainer.setAdditionalInformation("SAPUI5=will.be.ignored.view.xml");
        oAppContainer.setActive(true); // NOTE

        renderAndExpect(oAppContainer, oAppContainer.getApplicationType(), oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());
    });

    test("createUi5View", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");

        var oView,
            oIcon = new sap.ui.core.Icon(),
            fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            // return a button instead of a view, so that we have a control with the necessary
            // properties, but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_destroyChild");

        oView = oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());

        strictEqual(oView, oIcon, "createView returns our button");
        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        strictEqual(fnRegisterModulePath.firstCall.args[0], "some.random.view.path");
        strictEqual(fnRegisterModulePath.firstCall.args[1],
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/view/path");
        ok(fnCreateView.calledOnce, "createView called");
        ok(oAppContainer._destroyChild.calledBefore(fnCreateView),
            "child destroyed before creating the view");
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "XML",
            viewData: {},
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        strictEqual(oIcon.getWidth(), "11%");
        strictEqual(oIcon.getHeight(), "180px");
        ok(oIcon.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oIcon.getParent(), oAppContainer, "view's parent is the container");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View view in subfolder", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.path/view.Viewname.view.js");

        var fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            fnCreateView = sinon.stub(sap.ui, "view").returns(new sap.ui.core.Icon()),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());

        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        strictEqual(fnRegisterModulePath.firstCall.args[0], "some.random.path");
        strictEqual(fnRegisterModulePath.firstCall.args[1], "http://anyhost:1234/some/random/path");
        ok(fnCreateView.calledOnce, "createView called");
        strictEqual(fnCreateView.firstCall.args[0].type, "JS");
        strictEqual(fnCreateView.firstCall.args[0].viewName, "some.random.path.view.Viewname");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View with configuration data", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");
        oAppContainer.setApplicationConfiguration({ "a": 1, "b": 2 });

        var oView,
            oIcon = new sap.ui.core.Icon(),
            // return a button instead of a view, so we have a control with the necessary properties,
            // but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        sinon.spy(jQuery.sap, "registerModulePath");
        oView = oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());

        strictEqual(oView, oIcon, "createView returns our button");

        ok(fnCreateView.calledOnce, "createView called");
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "XML",
            viewData: { "config": { "a": 1, "b": 2 } },
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View with view data", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&bar=baz");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");

        var oView,
            oIcon = new sap.ui.core.Icon(),
            fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            // return a button instead of a view, so that we have a control with the necessary
            // properties, but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        oView = oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());
        strictEqual(oView, oIcon, "createView returns our button");

        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        ok(fnRegisterModulePath.calledWith("some.random.view.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/view/path"),
            "registerModulePath args");
        ok(fnCreateView.calledOnce, "createView called");
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "XML",
            viewData: { foo: ["bar", "baz"], bar: ["baz"] },
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View: invalid view type", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        oAppContainer.setAdditionalInformation("SAPUI5=path.Viewname.view.foo");

        var fnCreateView = sinon.spy(sap.ui, "view");

        // TODO does this appear in log or on UI?
        throws(function () {
            oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());
        });
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "FOO",
            viewData: {},
            viewName: "path.Viewname"
        }), "createView args");
    });

    function createComponentViaSapui5(sQueryString, oExpectedComponentData) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test" + sQueryString);
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.path");
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");

        sinon.spy(jQuery.sap, "registerModulePath");
        sinon.spy(jQuery.sap, "assert");
        sinon.spy(sap.ui, "component");

        var oControl = oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());

        ok(jQuery.sap.registerModulePath.calledOnce, "registerModulePath called once");
        ok(jQuery.sap.registerModulePath.calledWithExactly("some.random.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/path"),
            "registered the component correctly");
        strictEqual(oControl.getId(), oAppContainer.getId() + "-content", "component container ID");
        ok(oControl.getComponentInstance() instanceof some.random.path.Component,
            "created the correct component");
        strictEqual(oControl.getComponentInstance().getId(), oAppContainer.getId() + "-component",
            "component ID");
        deepEqual(oControl.getComponentInstance().getComponentData(), oExpectedComponentData,
            "passed the component data correctly");
        strictEqual(oControl.getWidth(), "11%");
        strictEqual(oControl.getHeight(), "180px");
        ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oControl.getParent(), oAppContainer, "control's parent is the container");
    }

    test("createUi5View: component w/o componentData", function () {
        createComponentViaSapui5("", { startupParameters: {} });
    });

    test("createUi5View: component w/ componentData", function () {
        createComponentViaSapui5("?foo=bar&foo=baz&sap-xapp-state=12343&bar=baz", {
            startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
            "sap-xapp-state": ["12343"]
        });
    });

    test("createUi5View: missing namespace", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=Viewname.view.js");

        testFailingCreateUi5View(oAppContainer, "Missing namespace");
    });

    test("createUi5View: illegal namespace", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=foo/bar/view.Viewname.view.js");

        testFailingCreateUi5View(oAppContainer, "Invalid SAPUI5 URL");
    });

    test("createUi5View: missing view name", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=.view.js");

        testFailingCreateUi5View(oAppContainer, "Invalid SAPUI5 URL");
    });

    test("createUi5View: with application config and without view name", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5=.view.js");
        oAppContainer.setApplicationConfiguration({ "a": 1, "b": 2 });

        var oControl;

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) { } };

        testFailingCreateUi5View(oAppContainer, "Invalid SAPUI5 URL");

        oControl = oAppContainer._createUi5Component(oAppContainer,
            oAppContainer.getUrl(), "some.random.path");

        deepEqual(oControl.getComponentInstance().getComponentData(),
            {
                "sap-xapp-state": ["1234242"],
                startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                config: { "a": 1, "b": 2 }
            },
            "passed the component data correctly"
        );
    });

    test("destroyChild() w/o child", function () {
        sinon.spy(oAppContainer, "destroyAggregation");

        oAppContainer._destroyChild(oAppContainer);

        ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("destroyChild() w/ component", function () {
        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (/*sService*/) { } };

        oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), "some.random.path");

        sinon.spy(oAppContainer, "destroyAggregation");

        oAppContainer._destroyChild(oAppContainer);

        ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("exit: destroyChild called", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();
        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_destroyChild");

        oAppContainer.exit();

        ok(oAppContainer._destroyChild.calledWith(oAppContainer),
            "destroyChild called");
    });

    test("exit: messageEventListener removed", function () {
        var fnListenerDummy = function () { },
            oRemoveEventListenerSpy = sinon.spy(window, "removeEventListener");

        oAppContainer._messageEventListener = fnListenerDummy;

        oAppContainer.exit();

        ok(oRemoveEventListenerSpy.calledWith("message", fnListenerDummy));
    });

    test("exit: storageEventListener removed", function () {
        var fnListenerDummy = function () { },
            oRemoveEventListenerSpy = sinon.spy(window, "removeEventListener");

        oAppContainer._storageEventListener = fnListenerDummy;

        oAppContainer.exit();

        ok(oRemoveEventListenerSpy.calledWith("storage", fnListenerDummy));
    });

    test("exit: unloadEventListener removed", function () {
        var fnListenerDummy = function () { },
            oRemoveEventListenerSpy = sinon.spy(window, "removeEventListener");

        oAppContainer._unloadEventListener = fnListenerDummy;

        oAppContainer.exit();

        ok(oRemoveEventListenerSpy.calledWith("unload", fnListenerDummy));
    });

    test("sap.ushell.components.container.render UI5 (SAPUI5.component=)", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        var oControl = new sap.ui.core.Icon(), // any control with width and height is sufficient
            oRenderManager = new sap.ui.core.RenderManager().getRendererInterface(),
            oCreateUi5ComponentStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5Component")
                .returns(oControl),
            oRenderControlInDivStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

        ok(oCreateUi5ComponentStub.calledOnce);
        ok(oCreateUi5ComponentStub.calledWith(oAppContainer, sTESTURL, "some.random.path"));
        ok(oRenderControlInDivStub.calledWith(oRenderManager,
            oAppContainer, oControl
        ));
    });

    test("rerender without property change does not recreate component", function () {
        Application.destroy(oAppContainer);
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        var oControl = new sap.ui.core.Icon(), // any control with width and height is sufficient
            oRenderManager = new sap.ui.core.RenderManager(),
            oCreateUi5ComponentStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5Component").returns(oControl);

        // render the container twice (can happen due to async rerendering)
        oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

        var fnOriginalGetAggregation = oAppContainer.getAggregation;
        sinon.stub(oAppContainer, "getAggregation", function (sAggregationName) {
            if (sAggregationName === "dragDropConfig") {
                return fnOriginalGetAggregation.call(oAppContainer, sAggregationName);
            }
            if (sAggregationName === "customData") {
                return [];
            }
            return oControl;
        });

        oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

        // unless there is a change in the properties, the component should only be instantiated once
        ok(oCreateUi5ComponentStub.calledOnce);
    });

    [{
        sProperty: "URL",
        fnSetter: function (oContainer) { oContainer.setUrl("http://new/url"); }
    }, {
        sProperty: "additionalInformation",
        fnSetter: function (oContainer) { oContainer.setAdditionalInformation("SAPUI5.Component=new.component"); }
    }, {
        sProperty: "applicationType",
        fnSetter: function (oContainer) { oContainer.setApplicationType(ApplicationType.NWBC.type); }
    }].forEach(function (oFixture) {
        // TODO: handle setHeight, setWidth; setApplication still relevant at all?
        test("rerender with changed " + oFixture.sProperty + " does recreate component", function () {
            Application.destroy(oAppContainer);
            oAppContainer = new sap.ushell.components.container.ApplicationContainer();

            var oControl = new sap.ui.core.Icon(), // any control with width and height is sufficient
                oRenderManager = new sap.ui.core.RenderManager(),
                oCreateUi5ComponentStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5Component").returns(oControl);

            // render the container twice (can happen due to async rerendering)
            oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

            var fnOriginalGetAggregation = oAppContainer.getAggregation;
            sinon.stub(oAppContainer, "getAggregation", function (sAggregationName) {
                if (sAggregationName === "dragDropConfig") {
                    return fnOriginalGetAggregation.call(oAppContainer, sAggregationName);
                }
                if (sAggregationName === "customData") {
                    return [];
                }
                return oControl;
            });

            oFixture.fnSetter(oAppContainer);

            oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

            // since there was change in the properties, the component should be instantiated twice
            ok(oCreateUi5ComponentStub.calledTwice);
        });
    });

    // Documentation can be found at http://docs.jquery.com/QUnit
    module("components/container/ApplicationContainer.js", {
        setup: function () {
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!
            oAppContainer = new sap.ushell.components.container.ApplicationContainer();

            sinon.stub(Storage.prototype, "removeItem");
            sinon.stub(Storage.prototype, "setItem");
            sinon.stub(sap.ui, "getVersionInfo").returns({ version: undefined });

            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_publishExternalEvent");
        },
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            testUtils.restoreSpies(
                sap.ui.getVersionInfo,
                jQuery.sap.assert,
                jQuery.sap.getObject,
                jQuery.sap.getUriParameters,
                jQuery.sap.log.warning,
                jQuery.sap.log.debug,
                jQuery.sap.registerModulePath,
                jQuery.sap.resources,
                jQuery.sap.uid,
                sap.ui.component,
                sap.ui.getCore,
                sap.ui.getVersionInfo,
                sap.ui.view,
                oAppContainer._adjustNwbcUrl,
                oAppContainer._createErrorControl,
                oAppContainer._createUi5Component,
                oAppContainer._publishExternalEvent,
                oAppContainer._createUi5View,
                oAppContainer._destroyChild,
                oAppContainer._getTranslatedText,
                oAppContainer._handleServiceMessageEvent,
                oAppContainer._isTrustedPostMessageSource,
                oAppContainer._logout,
                oAppContainer._render,
                oAppContainer._renderControlInDiv,
                utils.localStorageSetItem,
                utils.getLocalStorage,
                Storage.prototype.getItem,
                Storage.prototype.removeItem,
                Storage.prototype.setItem,
                window.addEventListener,
                window.removeEventListener,
                sap.ushell.utils.getParameterValueBoolean
            );
            delete sap.ushell.Container;
        }
    });

    // TODO: Vadik please fix this
    // asyncTest("createUi5Component w.o. explicit startup data : defaulting of startupParameters", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});
    //
    //     var oControl,
    //         cnt = 0,
    //         fct;
    //
    //     window.sap = window.sap || {};
    //     sap.ushell = sap.ushell || {};
    //     sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};
    //
    //     fct = function (sChannelId, sEventId, oArgs) {
    //         start();
    //         equal(cnt, 1, "correct asynchronous event");
    //         ok(oControl.getComponentInstance() === oArgs.component, "correct component");
    //         sap.ui.getCore().getEventBus().unsubscribe("sap.ushell", "appComponentLoaded", fct);
    //     };
    //     // enable eventing!
    //     sinon.restore(oAppContainer._publishExternalEvent);
    //     sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", fct);
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     cnt = cnt + 1;
    //     equal(oControl.getComponentInstance().getComponentData().hasOwnProperty("sap-xapp-state"), false, "no sap-xapp-state");
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  startupParameters: {},
    //             config: {"a": 1, "b": 2}},
    //         "passed the component data correctly");
    // });


    // Vadik please fix this
    // asyncTest("createUi5Component with explicit startup data : defaulting of startupParameters", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?sap-xapp-state=ABC&c=3");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setApplicationConfiguration({"a": [1], "b": [2]});
    //
    //     var oControl,
    //         cnt = 0,
    //         fct;
    //
    //     window.sap = window.sap || {};
    //     sap.ushell = sap.ushell || {};
    //     sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};
    //
    //     fct = function (sChannelId, sEventId, oArgs) {
    //         start();
    //         equal(cnt, 1, "correct asynchronous event");
    //         ok(oControl.getComponentInstance() === oArgs.component, "correct component");
    //         sap.ui.getCore().getEventBus().unsubscribe("sap.ushell", "appComponentLoaded", fct);
    //     };
    //     // enable eventing!
    //     sinon.restore(oAppContainer._publishExternalEvent);
    //     sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", fct);
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     cnt = cnt + 1;
    //     equal(oControl.getComponentInstance().getComponentData().hasOwnProperty("sap-xapp-state"), true, "sap-xapp-state");
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  startupParameters: { "c" : ["3"]},
    //             "sap-xapp-state" : ["ABC"],
    //             config: {"a": [1], "b": [2]}},
    //         "passed the component data correctly");
    // });
    //

    // Vadik can you fix this
    // asyncTest("createUi5Component event sap.ushell.components.container.ApplicationContainer / componentCreacted fired", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});
    //
    //     var oControl,
    //         cnt = 0,
    //         fct;
    //
    //     window.sap = window.sap || {};
    //     sap.ushell = sap.ushell || {};
    //     sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};
    //
    //     fct = function (sChannelId, sEventId, oArgs) {
    //         start();
    //         equal(cnt, 1, "correct asynchronous event");
    //         ok(oControl.getComponentInstance() === oArgs.component, "correct component");
    //         sap.ui.getCore().getEventBus().unsubscribe("sap.ushell", "appComponentLoaded", fct);
    //     };
    //     // enable eventing!
    //     sinon.restore(oAppContainer._publishExternalEvent);
    //     sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", fct);
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     cnt = cnt + 1;
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  "sap-xapp-state" : [ "1234242" ],
    //             startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
    //             config: {"a": 1, "b": 2}},
    //         "passed the component data correctly");
    // });

    asyncTest("createUi5Component event sap.ushell.components.container.ApplicationContainer / _prior.newUI5ComponentInstantion fired before component instantiation", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ "a": 1, "b": 2 });

        var oControl,
            cnt = 0,
            fPrior = sap.ui.component,
            oStubComponent = sinon.stub(sap.ui, "component", function (a1, a2) {
                cnt = cnt + 1;
                return fPrior(a1, a2);
            }),
            fct = function (sChannelId, sEventId, oArgs) {
                start();
                equal(cnt, 0, "correct asynchronous event");
                deepEqual(oArgs.name, "some.random.path", "correct arguments");
                sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", fct);
            };

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (/*sService*/) { } };

        sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", fct);

        oControl = oAppContainer._createUi5Component(oAppContainer,
            oAppContainer.getUrl(), "some.random.path");

        cnt = cnt + 1;
        deepEqual(oControl.getComponentInstance().getComponentData(),
            {
                "sap-xapp-state": ["1234242"],
                startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                config: { "a": 1, "b": 2 }
            },
            "passed the component data correctly");
        oStubComponent.restore();
    });

    test("disable router : invoked stop if getRouter returns something present", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ "a": 1, "b": 2 });

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) { } };

        var oControl = oAppContainer._createUi5Component(oAppContainer,
            oAppContainer.getUrl(), "some.random.path");

        deepEqual(oControl.getComponentInstance().getComponentData(),
            {
                "sap-xapp-state": ["1234242"],
                startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                config: { "a": 1, "b": 2 }
            },
            "passed the component data correctly");
        var oFakeRouter = { stop: function () { } };
        oControl.getComponentInstance().getRouter = function () { return oFakeRouter; };
        var spyStop = sinon.spy(oControl.getComponentInstance().getRouter(), "stop");
        // simulate event
        oAppContainer._disableRouter(oControl.getComponentInstance());
        ok(spyStop.called, "stop was called");
    });

    test("disable router : there is an evenhandler registered which effectively disables the router when the event is fired", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ "a": 1, "b": 2 });

        var oControl,
            spySubscribe = sinon.spy(sap.ui.getCore().getEventBus(), "subscribe");

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (/*sService*/) { } };

        oControl = oAppContainer._createUi5Component(oAppContainer,
            oAppContainer.getUrl(), "some.random.path");
        deepEqual(oControl.getComponentInstance().getComponentData(),
            {
                "sap-xapp-state": ["1234242"],
                startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                config: { "a": 1, "b": 2 }
            },
            "passed the component data correctly");
        var oFakeRouter = { stop: function () { } };
        equal(typeof oAppContainer._disableRouterEventHandler, "function", " function stored");
        equal(spySubscribe.args[0][0], "sap.ushell.components.container.ApplicationContainer", "subscribe arg1");
        equal(spySubscribe.args[0][1], "_prior.newUI5ComponentInstantion", "subscribe arg1");
        equal(spySubscribe.args[0][2], oAppContainer._disableRouterEventHandler, " function registered");
        oControl.getComponentInstance().getRouter = function () { return oFakeRouter; };
        var spyStop = sinon.spy(oControl.getComponentInstance().getRouter(), "stop");
        // simulate event
        sap.ui.getCore().getEventBus().publish("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", {});
        ok(spyStop.called, "stop was called");
    });

    test("disable Router: exit unsubscribes Event", function () {
        sinon.spy(oAppContainer, "destroyAggregation");
        var spyUnSubscribe = sinon.spy(sap.ui.getCore().getEventBus(), "unsubscribe");
        oAppContainer._disableRouterEventHandler = function () { return "a"; };
        equal(typeof oAppContainer._disableRouterEventHandler, "function", " function stored");
        oAppContainer.exit();
        equal(spyUnSubscribe.args[0][0], "sap.ushell.components.container.ApplicationContainer", "subscribe arg1");
        equal(spyUnSubscribe.args[0][1], "_prior.newUI5ComponentInstantion", "subscribe arg1");
        equal(spyUnSubscribe.args[0][2], oAppContainer._disableRouterEventHandler, " function registered");

        if (this._disableRouterEventHandler) {
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", this._disableRouterEventHandler);
        }
        oAppContainer.exit();
        ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("createUi5Component with configuration data", function () {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ "a": 1, "b": 2 });

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (/*sService*/) { } };

        var oControl = oAppContainer._createUi5Component(oAppContainer,
            oAppContainer.getUrl(), "some.random.path");

        deepEqual(oControl.getComponentInstance().getComponentData(),
            {
                "sap-xapp-state": ["1234242"],
                startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                config: { "a": 1, "b": 2 }
            },
            "passed the component data correctly");
    });

    // TODO: vadik please fix this
    // test("createUi5Component", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setWidth("11%");
    //     oAppContainer.setHeight("180px");
    //     var oControl;
    //     sinon.spy(jQuery.sap, "registerModulePath");
    //     sinon.spy(jQuery.sap, "assert");
    //     sinon.spy(oAppContainer, "_destroyChild");
    //     sinon.spy(sap.ui, "component");
    //     window.sap = window.sap || {};
    //     sap.ushell = sap.ushell || {};
    //     sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     ok(oAppContainer._destroyChild.calledBefore(sap.ui.component),
    //         "child destroyed before creating the component");
    //     ok(jQuery.sap.registerModulePath.calledWithExactly("some.random.path",
    //         "http://anyhost:1234/sap/public/bc/ui2/staging/test/"),
    //         "registered the component correctly");
    //     ok(!jQuery.sap.registerModulePath.calledWith("sap.ca"), "did not register sap.ca");
    //     strictEqual(oControl.getId(), oAppContainer.getId() + "-content", "component container ID");
    //     ok(oControl.getComponentInstance() instanceof some.random.path.Component,
    //         "created the correct component");
    //     strictEqual(oControl.getComponentInstance().getId(), oAppContainer.getId() + "-component",
    //         "component ID");
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  "sap-xapp-state" : [ "1234242" ],
    //             startupParameters: {foo: ["bar", "baz"], bar: ["baz"]}},
    //         "passed the component data correctly");
    //     strictEqual(oControl.getWidth(), "11%");
    //     strictEqual(oControl.getHeight(), "180px");
    //     ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
    //         "style sapUShellApplicationContainer applied");
    //     strictEqual(oControl.getParent(), oAppContainer, "control's parent is the container");
    //     //ok(jQuery.sap.assert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    // });

    [
        { additionalInfo: "SAPUI5=some.random.path", configuration: { foo: "bar" } },
        { additionalInfo: "SAPUI5.Component=some.random.path", configuration: { foo: "bar" } },
        { additionalInfo: "SAPUI5=some.random.path.no.config", configuration: {} },
        { additionalInfo: "SAPUI5.Component=some.random.path.no.config", configuration: {} },
        { additionalInfo: "SAPUI5=some.random.path.SomeView.view.xml", configuration: undefined },
        { additionalInfo: undefined, configuration: undefined },
        { type: ApplicationType.WDA.type, additionalInfo: undefined, configuration: undefined },
        { type: "INVALID_TYPE: Event fired even on error" }
    ].forEach(function (oFixture) {
        asyncTest("application configuration: " + JSON.stringify(oFixture), function () {
            var oIcon = new sap.ui.core.Icon(),
                oRenderManager = new sap.ui.core.RenderManager();

            window.sap = window.sap || {};
            sap.ushell = sap.ushell || {};
            sap.ushell.Container = sap.ushell.Container || { getService: function (/*sService*/) { } };

            sinon.stub(sap.ui, "view").returns(oIcon);
            // no sinon spy as event handler:
            // SAPUI5 empties event object at end of EventProvider.prototype.fireEvent
            oAppContainer.attachApplicationConfiguration(function (oEvent) {
                start();
                ok(true, "event 'applicationConfiguration' sent");
                strictEqual(oEvent.getId(), "applicationConfiguration", "event name");
                deepEqual(oEvent.getParameter("configuration"), oFixture.configuration,
                    "event payload is component configuration");
            });
            oAppContainer._render(oRenderManager, oAppContainer, oFixture.type || ApplicationType.URL.type,
                "http://anyhost:1234/ushell/test-resources/sap/ushell/test/components/container", oFixture.additionalInfo);
        });
    });

    test("ApplicationContainer invisible with Application", function () {
        var oApplication = getApplication(),
            oRenderManager = new sap.ui.core.RenderManager();

        oAppContainer.setApplication(oApplication);
        oAppContainer.setVisible(false);

        sinon.stub(oAppContainer, "_render");
        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        ok(oAppContainer._render.notCalled);
    });

    test("ApplicationContainer Application rendering", function () {
        var oApplication = getApplication({
            type: ApplicationType.URL.type,
            url: sTESTURL
        });
        oAppContainer.setApplicationType(ApplicationType.WDA.type);
        oAppContainer.setApplication(oApplication);
        oAppContainer.setUrl("/should/not/be/used");
        oAppContainer.setAdditionalInformation("SAPUI5=should.not.be.used.view.xml");

        renderAndExpect(oAppContainer, oApplication.getType(), oApplication.getUrl(), "");
    });

    test("createSystemForUrl", function () {

        function check(sUrl, oExpectedSystem) {
            var oSystem = oAppContainer._createSystemForUrl(sUrl);
            strictEqual(oSystem.getAlias(), oExpectedSystem.alias, "alias for " + sUrl);
            strictEqual(oSystem.getBaseUrl(), oExpectedSystem.baseUrl, "baseUrl for " + sUrl);
            strictEqual(oSystem.getClient(), oExpectedSystem.client, "client for " + sUrl);
            strictEqual(oSystem.getPlatform(), "abap", "platform for " + sUrl);
        }

        check("http://anyhost:1234/sap/bc/ui2/wda/~canvas?foo=bar", {
            alias: "http://anyhost:1234",
            baseUrl: "http://anyhost:1234"
        });
        check("http://anyhost:1234/sap/bc/ui2/wda/~canvas?foo=bar&sap-client=120", {
            alias: "http://anyhost:1234?sap-client=120",
            baseUrl: "http://anyhost:1234",
            client: "120"
        });
    });

    asyncTest("ApplicationContainer logout de-/registration", function () {
        sap.ushell.bootstrap("local").done(function () {
            sap.ushell.Container = mockSapUshellContainer();
            var oMockOverrides = { "/utils/bStubLocalStorageSetItem": false };

            oAppContainer.setApplicationType(ApplicationType.WDA.type);

            var fnLogout;

            sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createSystemForUrl");

            renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.WDA.type,
                "http://anyhost:1234/sap/bc/ui2/wda/~canvas", oMockOverrides);
            ok(sap.ushell.Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined);

            renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.NWBC.type,
                "http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120", oMockOverrides);
            strictEqual(sap.ushell.Container.attachLogoutEvent.getCalls().length, 1, "logout registered: attachLogoutEvent was called once");
            fnLogout = sap.ushell.Container.attachLogoutEvent.args[0][0];
            strictEqual(typeof fnLogout, "function", "a logout function has been attached when attachLogoutEvent was called");
            strictEqual(oAppContainer._getLogoutHandler(oAppContainer), fnLogout, "can get the logout handler via _getLogoutHandler");

            ok(oAppContainer._createSystemForUrl
                .calledWith("http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120"),
                "created a system for the URL");

            ok(sap.ushell.Container.addRemoteSystem
                .calledWith(oAppContainer._createSystemForUrl.returnValues[0]),
                "the system was added to the controller");

            sap.ushell.Container.attachLogoutEvent.reset();
            sap.ushell.Container.detachLogoutEvent.reset();

            renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.WDA.type,
                "http://anyhost:1234/sap/bc/ui2/WDA/~canvas", oMockOverrides);
            ok(sap.ushell.Container.detachLogoutEvent.callCount === 1, "logout deregistered");
            strictEqual(sap.ushell.Container.detachLogoutEvent.args[0][0], fnLogout);
            ok(sap.ushell.Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined);

            sap.ushell.Container.attachLogoutEvent.reset();
            sap.ushell.Container.detachLogoutEvent.reset();

            ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
                renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.enum[sNwbcLikeApplicationType],
                    "http://anyhost:1234/sap/bc/ui2/" + sNwbcLikeApplicationType + "/~canvas", oMockOverrides);
                fnLogout = sap.ushell.Container.attachLogoutEvent.args[0][0];

                strictEqual(oAppContainer._getLogoutHandler(oAppContainer), fnLogout);
                oAppContainer.exit();
                strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined,
                    "logout deregistered after exit");
                ok(sap.ushell.Container.detachLogoutEvent.called, "logout deregistered on exit");

                sap.ushell.Container.attachLogoutEvent.reset();
                sap.ushell.Container.detachLogoutEvent.reset();
            });
            start();
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("ApplicationContainer " + sNwbcLikeApplicationType + " Logoff fired", function () {
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container = mockSapUshellContainer();
                oAppContainer.setApplicationType(ApplicationType.enum[sNwbcLikeApplicationType]);

                var fnPostMessage = sinon.spy(function (sMessage/*, sOrigin*/) {
                    strictEqual(JSON.parse(sMessage).action, "pro54_disableDirtyHandler",
                        "disable NWBC window.beforeUnload handlers");
                });
                var oEvent = new sap.ui.base.Event(),
                    fnGetAttribute = sinon.stub().returns("http://anyhost:1234/sap/bc/ui2/nwbc/~canvas"),
                    fnSetAttribute = sinon.spy(),
                    sTagName;
                start();
                sinon.spy(oEvent, "preventDefault");
                sinon.stub(oAppContainer, "getDomRef", function () {
                    return {
                        setAttribute: fnSetAttribute,
                        getAttribute: fnGetAttribute,
                        contentWindow: { postMessage: fnPostMessage },
                        tagName: sTagName
                    };
                });

                renderInternallyAndExpectIFrame(oAppContainer,
                    ApplicationType.enum[sNwbcLikeApplicationType],
                    "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas");

                // don't do anything if the tagName doesn't match "IFRAME"
                // sTagName is here undefined
                oAppContainer._logout(oAppContainer, oEvent);
                sTagName = "FOO";
                oAppContainer._logout(oAppContainer, oEvent);
                ok(oEvent.preventDefault.notCalled, "preventDefault not called");
                ok(fnSetAttribute.notCalled, "setAttribute not called");
                ok(fnPostMessage.notCalled, "postMessage not called");

                // logout via iFrame fired
                sTagName = "IFRAME";
                oAppContainer._logout(oAppContainer, oEvent);
                ok(oEvent.preventDefault.calledOnce, "preventDefault called");
                ok(fnPostMessage.calledOnce, "postMessage called");
            });
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("ApplicationContainer " + sNwbcLikeApplicationType + " Logoff 2 Instances", function () {
            // This test does not use the ApplicationContainer instance created as part of the setup function,
            // because here are two instances needed.
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container = mockSapUshellContainer();
                start();
                var oContainer1 = new sap.ushell.components.container.ApplicationContainer({
                    applicationType: ApplicationType.enum[sNwbcLikeApplicationType]
                });
                var oContainer2 = new sap.ushell.components.container.ApplicationContainer({
                    applicationType: ApplicationType.enum[sNwbcLikeApplicationType]
                });
                var oEvent = new sap.ui.base.Event(),
                    fnGetAttribute = sinon.spy(),
                    fnSetAttribute = sinon.spy(),
                    fnLogout1,
                    fnLogout2;

                sinon.spy(oEvent, "preventDefault");
                sinon.stub(oContainer1, "getDomRef", function () {
                    return {
                        setAttribute: fnSetAttribute,
                        getAttribute: fnGetAttribute,
                        tagName: "IFRAME"
                    };
                });
                sinon.stub(oContainer2, "getDomRef", function () {
                    return {
                        setAttribute: fnSetAttribute,
                        getAttribute: fnGetAttribute,
                        tagName: "IFRAME"
                    };
                });
                sinon.spy(oContainer1, "_logout");

                var oMockOverrides = { "/utils/bStubLocalStorageSetItem": false };

                // render first container
                renderInternallyAndExpectIFrame(oContainer1, ApplicationType.enum[sNwbcLikeApplicationType],
                    "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas", oMockOverrides);
                ok(sap.ushell.Container.attachLogoutEvent.callCount === 1, "logout registered 1st");
                fnLogout1 = sap.ushell.Container.attachLogoutEvent.args[0][0];

                // render second container
                renderInternallyAndExpectIFrame(oContainer2, ApplicationType.enum[sNwbcLikeApplicationType],
                    "http://anyhost:4321/sap/bc/ui2/nwbc/~canvas", oMockOverrides);
                ok(sap.ushell.Container.attachLogoutEvent.callCount === 2, "logout registered 2nd");
                fnLogout2 = sap.ushell.Container.attachLogoutEvent.args[1][0];
                ok(fnLogout1 !== fnLogout2, "first and second logout registration different");

                // test logout map entries
                strictEqual(oContainer1._getLogoutHandler(oContainer1), fnLogout1);
                strictEqual(oContainer2._getLogoutHandler(oContainer2), fnLogout2);
            });
        });
    });

    asyncTest("ApplicationContainer Application with resolve", function () {
        var oApplication = getApplication({
            text: "test application",
            url: "/should/not/be/used",
            resolvable: true
        });
        var oLaunchpadData = {
            applicationType: "URL",
            applicationData: "SAPUI5=some.random.view.xml",
            Absolute: { url: sTESTURL + "?" }
        };
        var oLogMock = testUtils.createLogMock()
            .filterComponent(sCONTAINER)
            .debug("Resolving " + oApplication.getUrl(), null, sCONTAINER)
            .debug("Resolved " + oApplication.getUrl(), JSON.stringify(oLaunchpadData), sCONTAINER),
            oRenderManager = new sap.ui.core.RenderManager(),
            oLoadingIndicator;

        oAppContainer.setApplication(oApplication);
        oAppContainer.setApplicationType(ApplicationType.WDA.type);
        oAppContainer.setUrl("/should/not/be/used/either");
        oAppContainer.setAdditionalInformation("SAPUI5=should.not.be.used.view.xml");

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_getTranslatedText").returns("foo");
        sinon.stub(oApplication, "resolve", function (fnSuccess, fnError) {
            // simulate the resolve: call success handler with (necessary) launchpad data
            sap.ushell.utils.call(function () {
                fnSuccess(oLaunchpadData);
                // verify
                start();
                ok(oAppContainer.getAggregation("child") === null,
                    "Loading indicator has been deleted again");

                // As a consequence of the invalidate UI5 would render again; simulate this
                renderAndExpect(oAppContainer, "URL", sTESTURL, "SAPUI5=some.random.view.xml");

                oLogMock.verify();
            }, fnError, true);
        });

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        oLoadingIndicator = oAppContainer.getAggregation("child");
        ok(oAppContainer._renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oAppContainer,
            oLoadingIndicator
        ));
        ok(oAppContainer._getTranslatedText.calledWith("loading",
            [oApplication.getText()]), "loading indicator text requested");
        strictEqual(oLoadingIndicator.getText(), "foo", "Loading indicator text ok");
    });

    [undefined, sinon.spy()].forEach(function (fnApplicationErrorHandler) {
        var sResolveFailed = "resolve failed";
        asyncTest("ApplicationContainer Application resolve error w/" + (fnApplicationErrorHandler ? "" : "o") + " error handler", function () {
            var oApplication = getApplication({
                resolvable: true,
                errorHandler: fnApplicationErrorHandler
            });
            var oDiv = document.createElement("DIV"),
                oRenderManager = new sap.ui.core.RenderManager();

            oAppContainer.setApplication(oApplication);

            sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");
            sinon.stub(oApplication, "resolve", function (fnSuccess, fnError) {
                sap.ushell.utils.call(function () {
                    // simulate the resolve: call error handler (asynchronously)
                    fnError(sResolveFailed);

                    // verify
                    ok(oAppContainer._createErrorControl.notCalled);
                    if (fnApplicationErrorHandler) {
                        ok(fnApplicationErrorHandler.calledOnce);
                        ok(fnApplicationErrorHandler.calledWith(sResolveFailed));
                    }

                    // simulate SAPUI5's automatic re-rendering
                    oRenderManager.render(oAppContainer, oDiv);

                    // verify
                    start();
                    ok(oAppContainer._createErrorControl.calledOnce);
                    ok(oAppContainer._renderControlInDiv.calledWith(
                        oRenderManager.getRendererInterface(),
                        oAppContainer,
                        oAppContainer._createErrorControl.returnValues[0]
                    ));
                }, testUtils.onError, true);
            });

            oRenderManager.render(oAppContainer, oDiv);
        });
    });

    test("ApplicationContainer init", function () {

        sinon.spy(window, "addEventListener");
        // ApplicationContainer needs to be reinitialized here, because of the uid() call
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        ok(oAppContainer.globalDirtyStorageKey.indexOf("sap.ushell.Container.dirtyState.") > -1, "id start with correct prefix");
        ok(window.addEventListener.calledWith("unload"), "unload registered");
        ok(window.addEventListener.calledWith("storage"), "storage registered");
        ok(window.addEventListener.calledWith("message"), "message registered");
    });

    // test("MessageConcept | ApplicationContainer is instanciated twice", function () {
    //     var oContainer = new sap.ushell.components.container.ApplicationContainer();
    //         setDefaultHandlersSpy = sinon.spy(sap.m.MessagePopover, "setDefaultHandlers");
    //     ok(setDefaultHandlersSpy.calledOnce,
    //         "Initializing the application container the first time, setDefaultHandlers is called once");
    //     // Instanciating the application container a second time to simulate
    //     // the use case that setDefaultHandlers is not called again, because the
    //     // validation logic was already attached to the SAP UI5 MessagePopover control before
    //     oContainer = new sap.ushell.components.container.ApplicationContainer();
    //     ok(!setDefaultHandlersSpy.calledTwice,
    //         "setDefaultHandlers is not called again");
    // });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("ApplicationContainer IDs in sync with localStorage when applicationType is " + sNwbcLikeApplicationType, function () {
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container = mockSapUshellContainer({
                    addRemoteSystem: sap.ushell.Container.addRemoteSystem,
                    attachLogoutEvent: sap.ushell.Container.attachLogoutEvent,
                    detachLogoutEvent: sap.ushell.Container.detachLogoutEvent,
                    getLogonSystem: sap.ushell.Container.getLogonSystem,
                    _isLocalSystem: sap.ushell.Container._isLocalSystem
                });

                var oMockOverrides = { "/utils/bStubLocalStorageSetItem": false };

                renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.enum[sNwbcLikeApplicationType],
                    "http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120", oMockOverrides);
                start();
                ok(Storage.prototype.removeItem.calledWith(oAppContainer.globalDirtyStorageKey),
                    "removeItem called");
                ok(Storage.prototype.setItem.calledWith(oAppContainer.globalDirtyStorageKey, "INITIAL"),
                    "calledWith right ID");

                // render second time
                Storage.prototype.removeItem.reset();
                Storage.prototype.setItem.reset();
                renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.enum[sNwbcLikeApplicationType],
                    "http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120", oMockOverrides);
                ok(Storage.prototype.removeItem.calledWith(oAppContainer.globalDirtyStorageKey),
                    "removeItem called");
                ok(Storage.prototype.setItem.calledWith(oAppContainer.globalDirtyStorageKey, "INITIAL"),
                    "calledWith right ID");
                Storage.prototype.removeItem.reset();
                oAppContainer.exit();
                ok(Storage.prototype.removeItem.calledOnce, "removeItem called after exit");
            });
        });
    });

    // test("handleMessageEvent for CrossApplicationNavigation with data as JSON object", function () {
    //     var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));
    //     // test preparation
    //     delete oMessage.data.type;
    //     sinon.stub(oAppContainer, "_handleMessageEvent");
    //     // function to be tested
    //     var oApplicationContainer = {
    //         getActive: sinon.stub().returns(true)
    //     };
    //     oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);
    //     ok(oAppContainer._handleServiceMessageEvent.calledOnce,
    //         "checks if handleServiceMessageEvent method gets called only once");
    //     ok(oAppContainer._handleServiceMessageEvent
    //         .calledWith(oApplicationContainer, oMessage, oMessage.data), "called with correct parameters");
    // });

    // test("handleMessageEvent for CrossApplicationNavigation with data as string", function () {
    //     var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));
    //     // test preparation
    //     delete oMessage.data.type;
    //     oMessage.data = JSON.stringify(oMessage.data);
    //     sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_handleServiceMessageEvent");
    //     // function to be tested
    //     var oApplicationContainer = {
    //         getActive: sinon.stub().returns(true)
    //     };
    //     oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);
    //     ok(oAppContainer._handleServiceMessageEvent.calledOnce,
    //         "checks if handleServiceMessageEvent method gets called only once");
    //     ok(oAppContainer._handleServiceMessageEvent
    //         .calledWith(oApplicationContainer, oMessage, JSON.parse(oMessage.data)), "called with correct parameters");
    // });

    // Documentation can be found at http://docs.jquery.com/QUnit
    module("components/container/ApplicationContainer.js", {
        setup: function () {
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!

            sinon.stub(Storage.prototype, "removeItem");
            sinon.stub(Storage.prototype, "setItem");
            sinon.stub(sap.ui, "getVersionInfo").returns({ version: undefined });

            BlueBoxHandler.init(undefined, {}, {});
            oAppContainer = Application.createApplicationContainer("testid", {
                sURL: "xxxxxxx"
            });

            // prevent deferred events unless explicitely enabled
            publishExternalEventStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_publishExternalEvent");
        },
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            testUtils.restoreSpies(
                sap.ui.getVersionInfo,
                jQuery.sap.assert,
                jQuery.sap.getObject,
                jQuery.sap.getUriParameters,
                jQuery.sap.log.warning,
                jQuery.sap.log.debug,
                jQuery.sap.registerModulePath,
                jQuery.sap.resources,
                sap.ui.component,
                sap.ui.getCore,
                sap.ui.getVersionInfo,
                sap.ui.view,
                oAppContainer._adjustNwbcUrl,
                oAppContainer._createErrorControl,
                oAppContainer._createUi5Component,
                oAppContainer._publishExternalEvent,
                oAppContainer._createUi5View,
                oAppContainer._destroyChild,
                oAppContainer._getTranslatedText,
                oAppContainer._handleServiceMessageEvent,
                oAppContainer._isTrustedPostMessageSource,
                oAppContainer._logout,
                oAppContainer._render,
                oAppContainer._renderControlInDiv,
                utils.localStorageSetItem,
                utils.getLocalStorage,
                Storage.prototype.getItem,
                Storage.prototype.removeItem,
                Storage.prototype.setItem,
                window.addEventListener,
                window.removeEventListener,
                sap.ushell.utils.getParameterValueBoolean
            );
            publishExternalEventStub.restore();
            Application.destroy(oAppContainer);
            oAppContainer = undefined;
            delete sap.ushell.Container;
        }
    });

    [{
        testDescription: "getUi5ComponentName is null",
        fnGetUi5ComponentName: null,
        bContainerIsActive: true,
        expectedMessageHandled: true
    }, {
        testDescription: "getUi5ComponentName is undefined",
        fnGetUi5ComponentName: undefined,
        bContainerIsActive: true,
        expectedMessageHandled: true
    }, {
        testDescription: "getUi5ComponentName returns a UI5 component name",
        fnGetUi5ComponentName: sinon.stub().returns("some.component.name"),
        bContainerIsActive: true,
        expectedMessageHandled: false,
        expectedLogCall: [
            "Skipping handling of postMessage 'message' event with data '{\"service\":\"sap.ushell.services.CrossApplicationNavigation.unknownService\",\"request_id\":\"generic_id\",\"body\":{}}' on container of UI5 application 'some.component.name'",
            "Only non UI5 application containers can handle 'message' postMessage event",
            "sap.ushell.components.container.ApplicationContainer"
        ]
    }, {
        testDescription: "getUi5ComponentName returns an empty string",
        fnGetUi5ComponentName: sinon.stub().returns(""),
        bContainerIsActive: true,
        expectedMessageHandled: false,
        expectedLogCall: [
            "Skipping handling of postMessage 'message' event with data '{\"service\":\"sap.ushell.services.CrossApplicationNavigation.unknownService\",\"request_id\":\"generic_id\",\"body\":{}}' on container of UI5 application ''",
            "Only non UI5 application containers can handle 'message' postMessage event",
            "sap.ushell.components.container.ApplicationContainer"
        ]
    }, {
        // Tests that when a postMessage is received on an inactive
        // container, this is not handled.
        testDescription: "container is not active and getUi5ComponentName is null",
        fnGetUi5ComponentName: sinon.stub().returns(null),
        bContainerIsActive: false,
        expectedMessageHandled: false,
        expectedLogCall: [
            "Skipping handling of postMessage 'message' event with data '{\"service\":\"sap.ushell.services.CrossApplicationNavigation.unknownService\",\"request_id\":\"generic_id\",\"body\":{}}' on inactive container 'SOME_CONTAINER_ID'",
            "Only active containers can handle 'message' postMessage event",
            "sap.ushell.components.container.ApplicationContainer"
        ]
    }].forEach(function (oFixture) {
        test("handleMessageEvent handling logic works as expected when " + oFixture.testDescription, function () {
            var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            delete oMessage.data.type;
            sinon.spy(Application, "handleServiceMessageEvent");

            sinon.stub(jQuery.sap.log, "debug");

            // function to be tested
            var oApplicationContainer = {
                getId: sinon.stub().returns("SOME_CONTAINER_ID"),
                getUi5ComponentName: oFixture.fnGetUi5ComponentName,
                getActive: sinon.stub().returns(oFixture.bContainerIsActive)
            };
            oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);

            strictEqual(
                Application.handleServiceMessageEvent.getCalls().length,
                oFixture.expectedMessageHandled ? 1 : 0,
                "_handleServiceMessageEvent method was called the expected number of times");

            if (oFixture.hasOwnProperty("expectedLogCall")) {
                strictEqual(
                    jQuery.sap.log.debug.getCalls().length,
                    oFixture.expectedLogCall ? 1 : 0,
                    "jQuery.sap.log.debug was called the expected number of times");

                deepEqual(
                    jQuery.sap.log.debug.getCalls()[0].args,
                    oFixture.expectedLogCall,
                    "jQuery.sap.log.debug was called with the expected arguments"
                );
            }

            Application.handleServiceMessageEvent.restore();
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("handleMessageEvent for pro54_setGlobalDirty when application type is " + sNwbcLikeApplicationType, function () {
            sap.ushell.bootstrap("local").done(function () {
                var oContentWindow = {},
                    oMessage = {
                        data: {
                            action: "pro54_setGlobalDirty",
                            parameters: { globalDirty: "DIRTY" }
                        },
                        source: oContentWindow
                    },
                    oLogMock = testUtils.createLogMock()
                        .filterComponent("sap.ushell.components.container.ApplicationContainer"),
                    sStorageKey;

                sinon.spy(sap.ushell.utils, "localStorageSetItem");
                sinon.stub(Storage.prototype, "getItem", function (sKey) {
                    return "PENDING";
                });
                oAppContainer.setApplicationType(ApplicationType.enum[sNwbcLikeApplicationType]);
                sinon.stub(oAppContainer, "getDomRef").returns({
                    tagName: "IFRAME",
                    contentWindow: oContentWindow,
                    src: new URI()
                });

                sStorageKey = oAppContainer.globalDirtyStorageKey;
                oLogMock.debug("getGlobalDirty() pro54_setGlobalDirty SetItem key:" +
                    sStorageKey + " value: " + oMessage.data.parameters.globalDirty,
                    null,
                    "sap.ushell.components.container.ApplicationContainer");
                oAppContainer._handleMessageEvent(oAppContainer, oMessage);

                ok(Storage.prototype.setItem.calledWith(sStorageKey, "DIRTY"),
                    "localStorage.setItem called");
                ok(sap.ushell.utils.localStorageSetItem.calledWith(sStorageKey,
                    "DIRTY", true),
                    "localStorageSetItem wrapper called with third paramaeter");
                oLogMock.verify();

                // second test: message from wrong window
                oMessage.source = {};
                sap.ushell.utils.localStorageSetItem.reset();

                oAppContainer._handleMessageEvent(oAppContainer, oMessage);
                ok(sap.ushell.utils.localStorageSetItem.notCalled);

                // third test: message when no DOM ref
                oAppContainer.getDomRef.returns(undefined);
                sap.ushell.utils.localStorageSetItem.reset();

                oAppContainer._handleMessageEvent(oAppContainer, oMessage);
                ok(sap.ushell.utils.localStorageSetItem.notCalled);

                // TODO test when not PENDING
                // TODO test with stringified oMessage.data (parseable/non-parseable)
                start();
            });
        });
    });

    // TODO: move this code to appLifeCycle
    // [{
    //     testDescription: "register kuki on CrossApplicationNavigation",
    //     fnGetUi5ComponentName: sinon.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.CrossApplicationNavigation.kuki",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.CrossApplicationNavigation",
    //         oServiceCalls: {
    //             "kuki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello kuki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.CrossApplicationNavigation.kuki",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello kuki" }
    //     }
    // }, {
    //     testDescription: "register kuki on NewService",
    //     fnGetUi5ComponentName: sinon.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.NewService.kuki",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.NewService",
    //         oServiceCalls: {
    //             "kuki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello kuki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.NewService.kuki",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello kuki" }
    //     }
    // }, {
    //     testDescription: "register two services ku & ki calling ku",
    //     fnGetUi5ComponentName: sinon.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.NewService.ku",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.NewService",
    //         oServiceCalls: {
    //             "ku": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ku").promise();
    //                 }
    //             },
    //             "ki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.NewService.ku",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello ku" }
    //     }
    // }, {
    //     testDescription: "register two services ku & ki calling ki",
    //     fnGetUi5ComponentName: sinon.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.NewService.ki",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.NewService",
    //         oServiceCalls: {
    //             "ku": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ku").promise();
    //                 }
    //             },
    //             "ki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.NewService.ki",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello ki" }
    //     }
    // }].forEach(function (oFixture) {
    //     test("handleMessageEvent Communication Handler Testing......" + oFixture.testDescription, function () {
    //         var oUri = URI(),
    //             oMessage = JSON.parse(JSON.stringify(oFixture.oMsg));
    //         oMessage.origin =  oUri.protocol() + "://" + oUri.host();
    //         // test preparation
    //         sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_handleServiceMessageEvent");
    //         oMessage.source.postMessage = sinon.stub();
    //         sinon.stub(jQuery.sap.log, "debug");
    //         // function to be tested
    //         var oApplicationContainer = {
    //             getApplicationType: sinon.stub().returns(ApplicationType.URL.type),
    //             getDomRef: sinon.stub().returns({ tagName: "IFRAME" }),
    //             getId: sinon.stub().returns("SOME_CONTAINER_ID"),
    //             getUi5ComponentName: oFixture.fnGetUi5ComponentName,
    //             getActive: sinon.stub().returns(true)
    //         };
    //         oAppContainer.assignCommunicationHandlers(oFixture.commHandler);
    //         oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);
    //         strictEqual(
    //             oAppContainer._handleServiceMessageEvent.getCalls().length,
    //             oFixture.expectedMessageHandled ? 1 : 0,
    //             "_handleServiceMessageEvent method was called the expected number of times");
    //         if (oFixture.hasOwnProperty("expectedLogCall")) {
    //             deepEqual(
    //                 oMessage.source.postMessage.getCalls()[0].args[0],
    //                 JSON.stringify(oFixture.expectedLogCall),
    //                 "jQuery.sap.log.debug was called with the expected arguments"
    //             );
    //         }
    //     });
    // });

    test("handleServiceMessageEvent logs on messages without source", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        delete oMessage.source;

        // Arrange + Assert
        stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
        sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

        oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Cannot send response message to origin ' " + oMessage.origin,
                "`source` member of request message is not an object",
                "sap.ushell.components.container.ApplicationContainer")
            .sloppy();

        // Act
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();

        oAppContainer.__proto__._isTrustedPostMessageSource.restore();
    });

    test("handleServiceMessageEvent sends nice error message back to the caller when caller attempted to call a non-existing service", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // Arrange + Assert

        // NOTE: service does not exist
        oMessage.data.service = "sap.ushell.services.CrossApplicationNavigation.unknownService";
        oMessage.source.postMessage = sinon.stub();

        stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
        sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

        // Act
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        strictEqual(oMessage.source.postMessage.callCount, 1, "postMessage was called once");
        deepEqual(oMessage.source.postMessage.getCall(0).args, [
            JSON.stringify({
                type: "response",
                service: "sap.ushell.services.CrossApplicationNavigation.unknownService",
                request_id: "generic_id",
                status: "error",
                body: { message: "Unknown service name: 'sap.ushell.services.CrossApplicationNavigation.unknownService'" }
            }),
            "http://our.origin:12345"
        ], "response postMessage was called with the expected arguments");
        oAppContainer.__proto__._isTrustedPostMessageSource.restore();
    });

    test("handleServiceMessageEvent with config on", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });

        sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(false);
        oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
        oAppContainer.__proto__._isTrustedPostMessageSource.restore();
    });

    test("handleServiceMessageEvent with config off", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: false });
        oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is " +
                "disabled. It can be enabled via launchpad configuration property " +
                "'services.PostMessage.config.enabled: true'",
                undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleServiceMessageEvent with no post message config", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        stubGetObject("sap-ushell-config.services.PostMessage.config", {});
        sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(false);
        oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleServiceMessageEvent service definition", function () {
        // Test if the handleServiceMessageEvent method doesn't return
        // when the service starts with sap.ushell.services.CrossApplicationNavigation.

        // test data
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: false });
        oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is disabled." +
                " It can be enabled via launchpad configuration property 'services.PostMessage.config.enabled: true'",
                undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();

        // Test the behaviour of the handleServiceMessageEvent method in the case it has a
        // service string defined which is not starting with sap.ushell.services.CrossApplicationNavigation.
        // The method then has to return and NOT log a warning (as defined in the next conditional block)

        // test data
        oMessage.data.service = "otherService";

        // test preparation
        sinon.spy(jQuery.sap.log, "warning");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        ok(!jQuery.sap.log.warning.called, "No warning logged");
    });

    test("handleServiceMessageEvent setDirtyFlag - success", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var bTestDirtyFlag = true,
                oMessage = getServiceRequestMessage({
                    service: "sap.ushell.services.Container.setDirtyFlag",
                    body: { "bIsDirty": bTestDirtyFlag }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "setDirtyFlag");

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            strictEqual(sap.ushell.Container.setDirtyFlag.callCount,
                1, "sap.ushell.Container.setDirtyFlag is called 1 time");
            deepEqual(sap.ushell.Container.setDirtyFlag.getCall(0).args, [
                bTestDirtyFlag], "sap.ushell.Container.setDirtyFlag was called with the expected arguments");

            strictEqual(oMessage.source.postMessage.callCount, 1, "postMessage was called one time");
            deepEqual(oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {}
            }), oMessage.origin], "postMessage was called with the expected arguments");
            done();
        });
    });

    test("handleServiceMessageEvent hrefForExternal - success", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
                body: {
                    "oArgs": {
                        "target": {
                            "semanticObject": "UnitTest",
                            "action": "someAction"
                        },
                        "params": { "A": "B" }
                    }
                }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({ hrefForExternal: sinon.stub().returns("result") });

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            sinon.assert.calledWith(sap.ushell.Container.getService().hrefForExternal, oMessageData.body.oArgs);
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: { result: "result" }
            }), oMessage.origin);
            done();
        });
    });

    test("handleServiceMessageEvent hrefForExternal - error", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            var oMessage = getServiceRequestMessage({ service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal" }),
                oMessageData = JSON.parse(oMessage.data);

            // adapt test data to throw exception
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({ hrefForExternal: sinon.stub().throws(oFakeError) });

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().hrefForExternal.calledOnce, "hrefForExternal was called once");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: oFakeError.message }
            }), oMessage.origin);
            done();
        });
    });

    test("handleServiceMessageEvent getSemanticObjectLinks - success", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                body: {
                    "sSemanticObject": "UnitTest",
                    "mParameters": { "A": "B" },
                    "bIgnoreFormFactors": false
                }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getSemanticObjectLinks: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledWith(oMessageData.body.sSemanticObject, oMessageData.body.mParameters, oMessageData.body.bIgnoreFormFactors), "I was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: { result: "result" }
            }), oMessage.origin), "postMessage called with proper args");
            done();
        });
    });

    test("handleServiceMessageEvent getSemanticObjectLinks - error", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getSemanticObjectLinks: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledOnce, "getSemanticObjectLinks was called");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: "rejected!" }
            }), oMessage.origin);

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().getSemanticObjectLinks.throws(oFakeError);

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledTwice, "getSemanticObjectLinks was called");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: oFakeError.message }
            }), oMessage.origin);
            done();
        });
    });

    test("handleServiceMessageEvent isIntentSupported - success", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                body: { "aIntents": ["#GenericWrapperTest-open", "#Action-showBookmark", "#Action-invalidAction"] }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isIntentSupported: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);
            // check result
            ok(sap.ushell.Container.getService().isIntentSupported.calledWith(oMessageData.body.aIntents), "Called with proper args");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: { result: "result" }
            }), oMessage.origin), "called with proper args");
            done();
        });
    });

    test("handleServiceMessageEvent isIntentSupported - error", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isIntentSupported: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isIntentSupported.calledOnce, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: "rejected!" }
            }), oMessage.origin), "called with proper args");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().isIntentSupported.throws(oFakeError);

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isIntentSupported.calledTwice, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: oFakeError.message }
            }), oMessage.origin), "called with proper args");
            done();
        });
    });

    test("handleServiceMessageEvent isNavigationSupported - success", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                body: {
                    "aIntents": [
                        { target: { semanticObjcet: "Action", action: "showBookmark" } },
                        { target: { semanticObject: "Action", action: "invalidAction" } }
                    ]
                }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isNavigationSupported: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            ok(sap.ushell.Container.getService().isNavigationSupported.calledWith(oMessageData.body.aIntents), "called with proper args");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: { result: "result" }
            }), oMessage.origin), "called with proper args");
            done();
        });
    });

    test("handleServiceMessageEvent isNavigationSupported - error", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isNavigationSupported: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isNavigationSupported.calledOnce, "isNavigationSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: "rejected!" }
            }), oMessage.origin), "called with proper args");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().isNavigationSupported.throws(oFakeError);

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isNavigationSupported.calledTwice, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: oFakeError.message }
            }), oMessage.origin), "called with proper args");
            done();
        });
    });

    test("handleServiceMessageEvent getAppStateData - success", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getAppStateData",
                body: { "sAppStateKey": "ABC" }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getAppStateData: sinon.stub().returns(new jQuery.Deferred().resolve("result1").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            deepEqual(sap.ushell.Container.getService().getAppStateData.args[0], [oMessageData.body.sAppStateKey], "proper arguments");
            deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: { result: "result1" }
            }), oMessage.origin], " proper args");
            done();
        });
    });

    test("handleServiceMessageEvent getAppStateData - error", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getAppStateData"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getAppStateData: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getAppStateData.calledOnce, "getAppStateData was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: "rejected!" }
            }), oMessage.origin), "called with proper args");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().getAppStateData.throws(oFakeError);

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getAppStateData.calledTwice, "getAppStateData was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: oFakeError.message }
            }), oMessage.origin), "called with proper args");
            done();
        });
    });

    [{
        testDescription: "simple call with parameter",
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: { A: "B" }
        },
        expectedLocalStorageContent: {}, // nothing stored: no expanded sap-system given
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter",
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    "id": "UI3",
                    "client": "000",
                    "language": "EN",
                    "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                    "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                    "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
                }
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data$UI3": JSON.stringify({ // data are stored
                "id": "UI3",
                "client": "000",
                "language": "EN",
                "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3" // the ID from the expanded data
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter and sap-system-src (not in sid notation)",
        testCurrentSystemInformation: {
            name: "UR5",
            client: "120"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    "id": "UI3",
                    "client": "000",
                    "language": "EN",
                    "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                    "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                    "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
                },
                "sap-system-src": "UR5CLNT120"
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data#UR5CLNT120:UI3": JSON.stringify({
                "id": "UI3",
                "client": "000",
                "language": "EN",
                "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3",
                "sap-system-src": "UR5CLNT120"
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter and sap-system-src (in sid notation, not matching the current system)",
        testCurrentSystemInformation: { // system where the FLP runs
            name: "UR5",
            client: "120"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    "id": "UI3",
                    "client": "000",
                    "language": "EN",
                    "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                    "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                    "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
                },
                "sap-system-src": "sid(UV3.120)" // this is supposed to be the unique id of the system that sent the expanded sap-system
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data#sid(UV3.120):UI3": JSON.stringify({
                "id": "UI3",
                "client": "000",
                "language": "EN",
                "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3",
                "sap-system-src": "sid(UV3.120)"
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter and sap-system-src (in sid notation, matching the current system)",
        testCurrentSystemInformation: {
            name: "UR5",
            client: "120"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    "id": "UI3",
                    "client": "000",
                    "language": "EN",
                    "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                    "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                    "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
                },
                "sap-system-src": "sid(UR5.120)" // this is provided, and it matches the local system...
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data#sid(UR5.120):UI3": JSON.stringify({ // note: empty string used for sap-system
                "id": "UI3",
                "client": "000",
                "language": "EN",
                "http": { "id": "UI3_HTTP", "host": "ldai1ui3.example.com", "port": 50032 },
                "https": { "id": "UI3_HTTPS", "host": "ldai1ui3.example.com", "port": 44332 },
                "rfc": { "id": "UI3", "systemId": "UI3", "host": "ldciui3.example.com", "service": 32, "loginGroup": "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3",
                "sap-system-src": "sid(UR5.120)"
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with sap-system in sid notation matching the local system",
        testCurrentSystemInformation: { // the system name and client are used to identify the local system instead
            name: "UI3",
            client: "000"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "sid(UI3.000)"
                // no sap-system-src provided
            }
        },
        expectedLocalStorageContent: {},
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: { "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET" } // sap-system is removed completely
        },
        expectedResponse: { status: "success" }
    }].forEach(function (oFixture) {
        test("handleServiceMessageEvent toExternal: " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").done(function () {
                // Arrange
                var oOriginalArgs = utils.clone(oFixture.oArgs),
                    oMessage = getServiceRequestMessage({
                        service: "sap.ushell.services.CrossApplicationNavigation.toExternal",
                        body: { "oArgs": oFixture.oArgs }
                    }),
                    oMessageData = JSON.parse(oMessage.data);

                stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
                sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

                var oGetLogonSystemStub;
                if (oFixture.testCurrentSystemInformation) {
                    oGetLogonSystemStub = sinon.stub().returns({
                        getName: sinon.stub().returns(oFixture.testCurrentSystemInformation.name),
                        getClient: sinon.stub().returns(oFixture.testCurrentSystemInformation.client)
                    });
                } else {
                    // make sure nothing is assumed about getLogonSystem
                    oGetLogonSystemStub = sinon.stub()
                        .throws("ERROR: getLogonSystem should not be called during this test, or API should be mocked accordingly");
                }

                var oFakeCrossApplicationNavigation = { toExternal: sinon.stub() };
                sap.ushell.Container = mockSapUshellContainer({
                    services: { CrossApplicationNavigation: oFakeCrossApplicationNavigation },
                    getLogonSystem: oGetLogonSystemStub
                });

                var oLocalStorageContent = {};
                sinon.stub(utils, "getLocalStorage").returns({
                    setItem: function (sKey, sValue) { oLocalStorageContent[sKey] = sValue; }
                });

                // Act
                Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

                // Assert
                var oToExternalStub = oFakeCrossApplicationNavigation.toExternal;

                strictEqual(oToExternalStub.callCount, 1, "CrossApplicationNavigation#toExternal was called once");
                if (oToExternalStub.callCount === 1) {
                    var oExpectedCallArgs = oFixture.expectedPublicApiCallArgs || oOriginalArgs;

                    deepEqual(oToExternalStub.getCall(0).args[0], oExpectedCallArgs,
                        "The public interface CrossApplicationNavigation#toExternal was called with the expected arguments");
                }

                ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: oFixture.expectedResponse.status || "success",
                    body: oFixture.expectedResponse.body || {}
                }), oMessage.origin), "called with proper args");

                if (oFixture.expectedLocalStorageContent) {
                    deepEqual(oLocalStorageContent, oFixture.expectedLocalStorageContent,
                        "expected content was stored in the local storage");
                } else {
                    strictEqual(oLocalStorageContent, {},
                        "no content was stored in the local storage");
                }
                done();
            });
        });
    });

    test("handleServiceMessageEvent toExternal - error", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.toExternal"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({ toExternal: sinon.stub().throws(oFakeError) });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error response
            ok(sap.ushell.Container.getService().toExternal.calledOnce, "toExternal was called once");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: { message: oFakeError.message }
            }), oMessage.origin), "called with proper args");
            done();
        });
    });

    test("handleServiceMessageEvent ShellUIService setTitle", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.ui5service.ShellUIService.setTitle",
                body: { sTitle: "Purchase Order" }
            });
            var oMessageData = JSON.parse(oMessage.data),
                oSetTitleStub = sinon.stub();

            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });

            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            sinon.stub(oAppContainer, "getShellUIService").returns({
                setTitle: oSetTitleStub
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            deepEqual(oSetTitleStub.args[0], [oMessageData.body.sTitle], "setTitle method of public service called with proper arguments");
            deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {}
            }), oMessage.origin], " proper args");
            done();
        });
    });

    test("handleServiceMessageEvent ShellUIService backToPreviousApp", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.backToPreviousApp",
                body: {}
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            var oBackToPreviousAppStub = sinon.stub(),
                oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
            oGetServiceStub
                .withArgs("CrossApplicationNavigation")
                .returns({ backToPreviousApp: oBackToPreviousAppStub });
            oGetServiceStub.throws("productive code should call getService with CrossApplicationNavigation argument");

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            strictEqual(oGetServiceStub.callCount, 1, "sap.ushell.Container.getService was called once");
            deepEqual(oGetServiceStub.getCall(0).args, ["CrossApplicationNavigation"], "sap.ushell.Container.getService was called with the expected argument");
            strictEqual(oBackToPreviousAppStub.callCount, 1, "backToPreviousApp method was called once");
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            deepEqual(
                oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: {}
                }), oMessage.origin],
                "postMessage was called with the expected arguments");
            done();
        });
    });

    test("handleServiceMessageEvent ShellUIService backToPreviousApp (via sap.ushell.services.CrossApplicationNavigation.backToPreviousApp)", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.backToPreviousApp",
                body: {}
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            var oBackToPreviousAppStub = sinon.stub(),
                oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
            oGetServiceStub
                .withArgs("CrossApplicationNavigation")
                .returns({ backToPreviousApp: oBackToPreviousAppStub });
            oGetServiceStub.throws("productive code should call getService with CrossApplicationNavigation argument");

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            strictEqual(oGetServiceStub.callCount, 1, "sap.ushell.Container.getService was called once");
            deepEqual(oGetServiceStub.getCall(0).args, ["CrossApplicationNavigation"], "sap.ushell.Container.getService was called with the expected argument");
            strictEqual(oBackToPreviousAppStub.callCount, 1, "backToPreviousApp method was called once");
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            deepEqual(
                oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: {}
                }), oMessage.origin],
                "postMessage was called with the expected arguments");
            done();
        });
    });

    [{
        testDescription: "called with steps argument",
        messageBody: { iSteps: 2 },
        expectedArgument: [2]
    }, {
        testDescription: "called without steps argument",
        messageBody: {},
        expectedArgument: [undefined]
    }].forEach(function (oFixture) {
        test("handleServiceMessageEvent historyBack (via sap.ushell.services.CrossApplicationNavigation.historyBack) when" + oFixture.testDescription, function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").done(function () {
                // test data
                var oMessage = getServiceRequestMessage({
                    service: "sap.ushell.services.CrossApplicationNavigation.historyBack",
                    body: oFixture.messageBody
                });
                var oMessageData = JSON.parse(oMessage.data);

                // test preparation
                stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
                sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

                var oHistoryBackStub = sinon.stub(),
                    oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
                oGetServiceStub
                    .withArgs("CrossApplicationNavigation")
                    .returns({ historyBack: oHistoryBackStub });
                oGetServiceStub.throws("productive code should call getService with CrossApplicationNavigation argument");

                // function to be tested
                Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

                // we expect a successful call
                strictEqual(oGetServiceStub.callCount, 1, "sap.ushell.Container.getService was called once");
                deepEqual(oGetServiceStub.getCall(0).args, ["CrossApplicationNavigation"], "sap.ushell.Container.getService was called with the expected argument");
                deepEqual(oHistoryBackStub.getCall(0).args, oFixture.expectedArgument, "CrossApplicationNavigation#historyBack was called with the expected argument: " + oFixture.expectedArgument);
                strictEqual(oHistoryBackStub.callCount, 1, "historyBack method was called once");
                ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
                deepEqual(
                    oMessage.source.postMessage.getCall(0).args,
                    [
                        JSON.stringify({
                            type: "response",
                            service: oMessageData.service,
                            request_id: oMessageData.request_id,
                            status: "success",
                            body: {}
                        }),
                        oMessage.origin
                    ],
                    "postMessage was called with the expected arguments"
                );
                done();
            });
        });
    });

    test("handleServiceMessageEvent getFLPUrl (via sap.ushell.services.Container.getFLPUrl", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").done(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.Container.getFLPUrl",
                body: {}
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });
            sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            var oGetFLPUrlStub = sinon.stub(sap.ushell.Container, "getFLPUrl").returns("result1");

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            strictEqual(oGetFLPUrlStub.callCount, 1, "sap.ushell.Container.getService was called once");
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            deepEqual(
                oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: { result: "result1" }
                }), oMessage.origin],
                "postMessage was called with the expected arguments");
            done();
        });
    });

    [{
        testDescription: "callbackMessage with service specified",
        oMessageBody: {
            "callbackMessage": {
                "service": "some.gui.service.id",
                "supportedProtocolVersions": ["1"]
            }
        },
        expectedSetBackNavigationArgumentType: "function"
    }, {
        testDescription: "empty callbackMessage specified",
        oMessageBody: { "callbackMessage": {} },
        expectedSetBackNavigationArgumentType: "undefined"
    }, {
        testDescription: "empty body specified",
        oMessageBody: {},
        expectedSetBackNavigationArgumentType: "undefined"
    }].forEach(function (oFixture) {
        test("handleServiceMessageEvent ShellUIService setBackNavigation when " + oFixture.testDescription, function (assert) {
            // Tests that the sap.ushell.ui5service.ShellUIService.setBackNavigation is handled correctly when made by the GUI.
            // To do this, the test simulates a setBackNavigation call made via postMessage by the GUI application.
            var done = assert.async();
            sap.ushell.bootstrap("local").done(function () {
                var oMessage = getServiceRequestMessage({
                    service: "sap.ushell.ui5service.ShellUIService.setBackNavigation",
                    body: oFixture.oMessageBody
                });
                var oMessageData = JSON.parse(oMessage.data),
                    oSetBackNavigationStub = sinon.stub();

                stubGetObject("sap-ushell-config.services.PostMessage.config", { enabled: true });

                sinon.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
                sinon.stub(oAppContainer, "getShellUIService").returns({ setBackNavigation: oSetBackNavigationStub });

                // simulate GUI triggering postMessage
                Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

                // check how the message was handled
                strictEqual(oSetBackNavigationStub.callCount, 1, "ShellUIService#setBackNavigation method was called with one argument");
                strictEqual(typeof oSetBackNavigationStub.getCall(0).args[0], oFixture.expectedSetBackNavigationArgumentType,
                    "ShellUIService#setBackNavigation method was called with first argument of type " + oFixture.expectedSetBackNavigationArgumentType);
                deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: {}
                }), oMessage.origin], "response to setBackNavigation contains the proper arguments");
                done();
            });
        });
    });

    test("backButtonPressedCallback works as expected", function () {
        var oPostMessageStub = sinon.stub(),
            oFakeSourceWindow = { postMessage: oPostMessageStub };

        // this callback is called when the back button is pressed
        oAppContainer._backButtonPressedCallback(oFakeSourceWindow, "some.service", "some.origin");

        strictEqual(oPostMessageStub.callCount, 1, "postMessage method was called once on the given window");
        strictEqual(oPostMessageStub.getCall(0).args.length, 2, "postMessage method was called with two arguments");
        try {
            var oJsonCallArg = JSON.parse(oPostMessageStub.getCall(0).args[0]);
            ok(true, "first argument is valid JSON");
            strictEqual(oJsonCallArg.type, "request", ".type member has the expected value");
            strictEqual(oJsonCallArg.service, "some.service", ".service member has the expected value");
            strictEqual(!!oJsonCallArg.request_id.match(/id[-]\d+[-]\d+/), true, ".request_id member matches the format id-#########-###");
            deepEqual(oJsonCallArg.body, {}, ".body member is empty");
        } catch (oError) {
            ok(false, "first argument is valid JSON. Error:" + oError);
        }

        strictEqual(oPostMessageStub.getCall(0).args[1], "some.origin", "obtained the expected second argument");
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        test("ApplicationContainer localStorage eventing", function (assert) {
            var done1 = assert.async(),
                done2 = assert.async();
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container = mockSapUshellContainer();

                var oMockOverrides = { "/utils/bStubLocalStorageSetItem": false },
                    oContentWindow = {
                        postMessage: sinon.spy(function (sMessage/*, sOrigin*/) {
                            done1();
                            strictEqual(JSON.parse(sMessage).action, "pro54_getGlobalDirty",
                                sNwbcLikeApplicationType + ".getGlobalDirty fired");
                        })
                    },
                    oLogMock = testUtils.createLogMock()
                        .filterComponent("sap.ushell.components.container.ApplicationContainer")
                        .debug("getGlobalDirty() send pro54_getGlobalDirty ",
                            null,
                            "sap.ushell.components.container.ApplicationContainer"),
                    sStorageKey,
                    oStorageEvent = document.createEvent("StorageEvent");

                oAppContainer.setApplicationType(ApplicationType.enum[sNwbcLikeApplicationType]);

                sStorageKey = oAppContainer.globalDirtyStorageKey;

                sinon.stub(oAppContainer, "getDomRef", function () {
                    return {
                        contentWindow: oContentWindow,
                        tagName: "IFRAME",
                        src: new URI()
                    };
                });

                renderInternallyAndExpectIFrame(oAppContainer, oAppContainer.getApplicationType(),
                    "http://anyhost:1234/sap/bc/ui2/" + sNwbcLikeApplicationType + "/~canvas?sap-client=120", oMockOverrides);

                oStorageEvent.initStorageEvent("storage", false, false, sStorageKey, "", "PENDING",
                    "", localStorage);

                sinon.spy(sap.ushell.utils, "localStorageSetItem");
                sinon.stub(Storage.prototype, "getItem").returns("PENDING");

                // code under test
                dispatchEvent(oStorageEvent);
                ok(oContentWindow.postMessage.calledOnce);
                oLogMock.verify();
                done2();
            });
        });
    });

    [false, true].forEach(function (bIsPostMethod) {
        test("ApplicationContainer rendering on inactive container", function () {
            // Arrange
            var sUrl = "http://anyhost:1234/sap/public/bc/ui2/staging/test";
            oAppContainer.setApplicationType(ApplicationType.TR.type);
            oAppContainer.setUrl(sUrl);
            oAppContainer.setAdditionalInformation("SAPUI5=will.be.ignored.view.xml");
            oAppContainer.setActive(false); // NOTE
            oAppContainer.setIframeWithPost(bIsPostMethod);

            sap.ushell.Container = mockSapUshellContainer();
            var oPrepareEnv = prepareRenderInternally(oAppContainer, sUrl);

            // Act
            var oTargetNode = renderInternally(oAppContainer, oPrepareEnv, sUrl, oAppContainer.getApplicationType());

            testIFrameNotRendered(oAppContainer, oTargetNode);
        });
    });

    [{
        testDescription: "trusted origin and original container",
        otherContentWindow: true,
        origin: new URI(),
        expectedResult: true
    }, {
        testDescription: "trusted origin and different container",
        otherContentWindow: false,
        origin: new URI(),
        expectedResult: true
    }, {
        testDescription: "not trusted origin and original container",
        otherContentWindow: true,
        origin: new URI("http://sap.com/"),
        expectedResult: false
    }, {
        testDescription: "not trusted origin and different container",
        otherContentWindow: false,
        origin: new URI("http://sap.com/"),
        expectedResult: true
    }].forEach(function (oFixture) {
        test("isTrustedPostMessageSource works as expected whith " + oFixture.testDescription, function () {
            var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            delete oMessage.data.type;
            oMessage.data = JSON.stringify(oMessage.data);
            sinon.spy(oAppContainer.__proto__, "_isTrustedPostMessageSource");

            var oContentWindow = { name: "oContentWindow" },
                otherContentWindow = { name: "otherContentWindow" };

            oMessage.source = oContentWindow;
            oMessage.origin = oFixture.origin.protocol() + "://" + oFixture.origin.host();

            var oApplicationContainer = {
                getIframeWithPost: sinon.stub().returns(false),
                getId: sinon.stub().returns("CONTAINER_ID"),
                getDomRef: sinon.stub().returns({
                    tagName: "IFRAME",
                    contentWindow: oFixture.otherContentWindow ? otherContentWindow : oContentWindow,
                    src: new URI()
                }),
                _getIFrame: sap.ushell.components.container.ApplicationContainer.prototype._getIFrame,
                _getIFrameUrl: sap.ushell.components.container.ApplicationContainer.prototype._getIFrameUrl,
                _isTrustedPostMessageSource: sap.ushell.components.container.ApplicationContainer.prototype._isTrustedPostMessageSource
            };

            var bTrusted = oAppContainer._isTrustedPostMessageSource(oApplicationContainer, oMessage);

            strictEqual(bTrusted, oFixture.expectedResult);
        });
    });

    [{
        id: "app-container-test-1",
        desc: "NWBC, simple case without app state",
        appType: "NWBC",
        URL: "http://anyhost:1234/sap/public/bc/ui2/staging/test",
        expectedParameters: {
            totalNumber: 1
        }
    }, {
        id: "app-container-test-2",
        desc: "TR, simple case without app state",
        appType: "TR",
        URL: "http://anyhost:1234/sap/public/bc/ui2/staging/test",
        expectedParameters: {
            totalNumber: 1
        }
    }, {
        id: "app-container-test-3",
        desc: "WCF, simple case without app state",
        appType: "WCF",
        URL: "http://anyhost:1234/sap/public/bc/ui2/staging/test",
        expectedParameters: {
            totalNumber: 1
        }
    }, {
        id: "app-container-test-4",
        desc: "NWBC, URL contains sap-intent-param",
        appType: "NWBC",
        URL: "http://anyhost:1234/sap/public/bc/ui2/staging/test?sap-intent-param=V1",
        appStateData: [
            ["sap-intent-param-data-1234"]
        ],
        expectedParameters: {
            totalNumber: 2,
            values: [
                {
                    name: "sap-intent-param-data",
                    value: "sap-intent-param-data-1234"
                }]
        }
    }, {
        id: "app-container-test-5",
        desc: "NWBC, URL contains sap-intent-param, sap-xapp-state and sap-iapp-state",
        appType: "NWBC",
        URL: "http://anyhost:1234/sap/public/bc/ui2/staging/test?sap-intent-param=V1&sap-xapp-state=V2&sap-iapp-state=V3",
        appStateData: [
            ["sap-intent-param-data-1234"],
            ["sap-xapp-state-data-5678"],
            ["sap-iapp-state-data-9012"]
        ],
        expectedParameters: {
            totalNumber: 4,
            values: [
                {
                    name: "sap-intent-param-data",
                    value: "sap-intent-param-data-1234"
                },{
                    name: "sap-xapp-state-data",
                    value: "sap-xapp-state-data-5678"
                },{
                    name: "sap-iapp-state-data",
                    value: "sap-iapp-state-data-9012"
                }]
        }
    }, {
        id: "app-container-test-6",
        desc: "NWBC, URL contains sap-intent-param and another simple params that should be ignored",
        appType: "NWBC",
        URL: "http://anyhost:1234/sap/public/bc/ui2/staging/test?param1=1&sap-intent-param=V1&param2=2",
        appStateData: [
            ["sap-intent-param-data-1234"]
        ],
        expectedParameters: {
            totalNumber: 2,
            values: [
                {
                    name: "sap-intent-param-data",
                    value: "sap-intent-param-data-1234"
                }]
        }
    }].forEach(function (oFixture) {
        asyncTest("ApplicationContainer rendering and IFrame with form post - " + oFixture.desc, function () {
            sap.ushell.bootstrap("local").done(function () {
                Application.destroy(oAppContainer);
                oAppContainer = Application.createApplicationContainer(oFixture.id, {
                    sURL: "aaaa"
                });
                oAppContainer.setIframeWithPost(true);
                oAppContainer.setApplicationType(oFixture.appType);
                oAppContainer.setUrl(oFixture.URL);

                var oFakeCrossApplicationNavigation = {
                    getAppStateData: function () {
                        var oDeferred = new jQuery.Deferred();
                        setTimeout(function() {
                            oDeferred.resolve(oFixture.appStateData)
                        }, 0);

                        return oDeferred.promise();
                    }};
                sap.ushell.Container = mockSapUshellContainer({
                    services: { CrossApplicationNavigation: oFakeCrossApplicationNavigation },
                });

                var oPrepareEnv = prepareRenderInternally(oAppContainer, oFixture.URL);
                var oTargetNode = renderInternally(oAppContainer, oPrepareEnv, oFixture.URL, oFixture.appType, true);

                oAppContainer.oDeferredRenderer.done(function() {
                    start();
                    testIFrameRendered(oTargetNode, oPrepareEnv, oAppContainer, oFixture.appType, oFixture.URL, true);
                    checkPostFormNode(oTargetNode, oAppContainer, oFixture);
                    checkPostIFrameNode(oTargetNode, oAppContainer);
                    if (oTargetNode.remove) {
                        oTargetNode.remove();
                    } else {
                        oTargetNode.parentNode.removeChild(oTargetNode);
                    }
                });
            });
        });
    });

    function checkPostFormNode(oTargetNode, oAppContainer, oFixture) {
        var oForm = jQuery(oTargetNode).children('div').children('form');
        strictEqual(oForm.length, 1, "only one form element should be generated inside the div");
        oForm = oForm[0];
        strictEqual(oForm.method, "post");
        strictEqual(oForm.id, oAppContainer.getId() + "-form");
        strictEqual(oForm.name, oAppContainer.getId() + "-form");
        strictEqual(oForm.target, oAppContainer.getId() + "-iframe");
        if (utils.isApplicationTypeEmbeddedInIframe(oFixture.appType)) {
            strictEqual(oForm.action, oAppContainer._adjustNwbcUrl(oFixture.URL));
        } else {
            strictEqual(oForm.action, oFixture.URL);
        }
        strictEqual(oForm.style.display, "none");
        strictEqual(oForm.classList.length, 0);

        strictEqual(oForm.childElementCount, oFixture.expectedParameters.totalNumber);
        var arrParameterValues = [{
                name: "sap-flp-url",
                value: window.location.href
            }];
        if (oFixture.expectedParameters.values) {
            arrParameterValues = arrParameterValues.concat(oFixture.expectedParameters.values);
        }
        arrParameterValues.forEach(function (element) {
            checkPostFormInputParameterNode(oForm, element);
        });
    }

    function checkPostFormInputParameterNode(oForm, element) {
        var oFormInput = jQuery(oForm).children("input[name='" + element.name + "']");
        strictEqual(oFormInput.length, 1);
        oFormInput = oFormInput[0];
        strictEqual(oFormInput.value, element.value);
        strictEqual(oFormInput.classList.length, 0);
        strictEqual(oFormInput.childElementCount, 0);
    }

    function checkPostIFrameNode(oTargetNode, oAppContainer) {
        var oIframe = jQuery(oTargetNode).children('div').children('iframe');
        strictEqual(oIframe.length, 1, "only one iframe element should be generated inside the div");
        oIframe = oIframe[0];
        strictEqual(oIframe.childElementCount, 0);
        checkIFrameNode(oIframe, oAppContainer, false);
        strictEqual(oIframe.id, oAppContainer.getId() + "-iframe");
        strictEqual(oIframe.src, "");
        strictEqual(oIframe.getAttribute("data-sap-ui"), oAppContainer.getId() + "-iframe");
    }

    test("ApplicationContainer rendering application type URL with form post enabled should not render form", function () {
        // Arrange
        var sUrl = "http://anyhost:1234/sap/public/bc/ui2/staging/test";
        oAppContainer.setIframeWithPost(true);
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(sUrl);

        sap.ushell.Container = mockSapUshellContainer();

        renderInternallyAndExpectIFrame(oAppContainer, ApplicationType.URL.type, sUrl, undefined, false);
    });

    // TODO add new HTML5 property seamless?!
});
