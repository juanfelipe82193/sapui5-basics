// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.configuration.AppMeta
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ushell/test/utils",
    'sap/ui/Device',
    "sap/ushell/services/Container",
    'sap/ushell/services/AppConfiguration',
    "sap/ushell/Config"
], function (AppLifeCycle, AppMeta, utils, Device, Container, AppConfiguration, Config) {
    "use strict";
    /* global equal deepEqual module ok stop test jQuery sap QUnit sinon asyncTest start */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");
    jQuery.sap.require("sap.ushell.EventHub");

    //jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");

    module("sap.ushell.components.applicationIntegration.configuration.AppMeta", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });

    QUnit.test("#history back navigation", function (assert) {
        [
            {
                meta: {
                    name: "metaDataObject",
                    favIcon: "testing1",
                    compactContentDensity: true,
                    cozyContentDensity: false
                },
                storeApp: [
                    {
                        appId: "testAppId1",
                        oContainer: {},
                        oTarget: undefined,
                        oShellHash: {},
                        oTargetTmp: {},
                        oHashTmp: {},
                        sFixedShellHash: "action-test1"
                    }
                ],
                contentDensityCallesCount: 1,
                isCompact: true,
                iconCheckDescription: "Test (1) icon validation",
                contentDensityDescription: "Test (1) content density"
            },
            {
                meta: {
                    name: "metaDataObject",
                    favIcon: "testing1",
                    compactContentDensity: false,
                    cozyContentDensity: true
                },
                storeApp: [
                    {
                        appId: "testAppId1",
                        oContainer: {},
                        oTarget: undefined,
                        oShellHash: {},
                        oTargetTmp: {},
                        oHashTmp: {},
                        sFixedShellHash: "action-test1"
                    }
                ],
                isCompact: false,
                contentDensityCallesCount: 1,
                iconCheckDescription: "Test (2) icon validation",
                contentDensityDescription: "Test (2) content density"
            }
        ].forEach(function (oFixture) {
            var oAppMetaInstance,
                metaDataStub = sinon.stub(AppConfiguration, "getMetadata").returns(oFixture.meta),
                contentDensityStub = sinon.stub(AppLifeCycle.getAppMeta(), "_applyContentDensityClass").returns({}),
                jquerySetIconStub = sinon.stub(AppLifeCycle.getAppMeta(), "setAppIcons").returns({}),
                orgCombivalue = Device.system.combi;

            Device.system.combi = false;
            AppLifeCycle.init("home", oFixture.oViewPortContainer, "Shell-home", false, {
                ownerComponent: "test"
            });

            AppLifeCycle.shellElements().model();

            oFixture.storeApp.forEach(function (oStApp) {
                AppLifeCycle.storeApp(oStApp.appId, oStApp.oContainer, oStApp.oTarget, oStApp.oShellHash, oStApp.oTargetTmp, oStApp.oHashTmp, oStApp.sFixedShellHash);
            });
            AppLifeCycle.restore("testAppId1");

            //oAppMetaInstance = AppLifeCycle.getAppMeta();

            assert.strictEqual(contentDensityStub.callCount, oFixture.contentDensityCallesCount, "# of calles: " + oFixture.contentDensityDescription);
            assert.strictEqual(contentDensityStub.args[0][0], oFixture.isCompact, "call value expected [" + oFixture.isCompact + "]:" + oFixture.contentDensityDescription);
            assert.strictEqual(jquerySetIconStub.args[0][0].favIcon, "testing1", oFixture.iconCheckDescription);
            Device.system.combi = orgCombivalue;

            jquerySetIconStub.restore();
            contentDensityStub.restore();
            metaDataStub.restore();
        });
    });
});
