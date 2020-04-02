// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/matchers/Properties"], function (Opa5, Properties) {
    "use strict";
    var mControls = {
            "button": { type: "sap.m.Button", idPrefix: "__button"},
            "item": { type: "sap.ui.core.Item", idPrefix: "__item"},
            "search": { type: "sap.m.SearchField", idPrefix: "__field"},
            "select": { type: "sap.m.Select", idPrefix: "__select"},
            "title": { type: "sap.m.Title", idPrefix: "__title"}
        },
        mGenerics = {
            "add": { matcher: {icon: "sap-icon://add"}, defaultId: "scfld_ADD"},
            "addbookmark": { matcher: {icon: "sap-icon://add-favorite"},
                defaultId: "scfld_ADDBOOKMARK", bSearchOpenDialogs: true},
            "additionalShare": {bSearchOpenDialogs: true},
            "appButton": {},
            "back": { matcher: {icon: "sap-icon://nav-back"}, defaultId: "scfld_BACK"},
            "edit": { matcher: {icon: "sap-icon://multi-select"}, defaultId: "scfld_EDIT"},
            "editDetail": { matcher: {text: "Edit"}, defaultId: "scfld_EDIT"},
            "filter": { matcher: {icon: "sap-icon://filter"}, defaultId: "scfld_FILTER"},
            "filterSelect": { matcher: {icon: "sap-icon://filter"},
                defaultId: "scfld_FILTER_SELECT", control: mControls.select},
            "filterItem": { matcher: undefined, defaultId: "scfld_FILTER_ITEM",
                control: mControls.item, bSearchOpenDialogs: true},
            "group": { matcher: {icon: "sap-icon://group-2"}, defaultId: "scfld_GROUP"},
            "groupSelect": { matcher: {icon: "sap-icon://group-2"},
                defaultId: "scfld_GROUP_SELECT", control: mControls.select},
            "groupItem": { matcher: undefined, defaultId: "scfld_GROUP_ITEM",
                control: mControls.item, bSearchOpenDialogs: true},
            "jam_discuss": { matcher: {icon: "sap-icon://discussion-2"},
                defaultId: "scfld_JAMDISCUSS", bSearchOpenDialogs: true},
            "jam_share": { matcher: {icon: "sap-icon://share-2"}, defaultId: "scfld_JAMSHARE",
                bSearchOpenDialogs: true},
            "mail": { matcher: {icon: "sap-icon://email"}, defaultId: "scfld_MAIL",
                bSearchOpenDialogs: true},
            "negative": { matcher: {text: "Reject"}, defaultId: "scfld_NEGATIVE"},
            "overflow": { matcher: {icon: "sap-icon://overflow"}, defaultId: "scfld_OVERFLOW"},
            "positive": { matcher: {text: "Accept"}, defaultId: "scfld_POSITIVE"},
            "search": { matcher: undefined, defaultId: "scfld_SEARCH",
                control: mControls.search},
            "share": { matcher: {icon: "sap-icon://action"}, defaultId: "scfld_SHARE"},
            "sort": { matcher: {icon: "sap-icon://sort"}, defaultId: "scfld_SORT"},
            "sortSelect": { matcher: {icon: "sap-icon://sort"},
                defaultId: "scfld_SORT_SELECT", control: mControls.select},
            "sortItem": { matcher: undefined, defaultId: "scfld_SORT_ITEM",
                control: mControls.item, bSearchOpenDialogs: true},
            "title": { matcher: undefined, control: mControls.title}
        },
        Common = Opa5.extend("sap.ca.scfld.stableids.opa.pageObjects.Common", {
            _checkId: function (bIsGenerated, sScfldControl, sExpectedId, sText, sFixId,
                sViewId, sViewName) {
                return this.waitFor(this.getCheckIdConfiguration({
                    expectedId: sExpectedId,
                    fixId: sFixId,
                    isGenerated: bIsGenerated,
                    scfldControl: sScfldControl,
                    text: sText,
                    viewId: sViewId,
                    viewName: sViewName
                }));
            },
            _checkIdInOverflow: function (bIsGenerated, sScfldControl, sExpectedId, sText,
                sViewId, sViewName) {
                return this.waitFor(this.getCheckIdConfiguration({
                    expectedId: sExpectedId,
                    isGenerated: bIsGenerated,
                    scfldControl: sScfldControl,
                    bSearchOpenDialogs: true,
                    text: sText,
                    viewId: sViewId,
                    viewName: sViewName
                }));
            },
            _click: function (sScfldControl, sText, sViewName, bImmediateClick) {
                return this.waitFor(this.clickConfiguration({
                    immediateClick: bImmediateClick,
                    scfldControl: sScfldControl,
                    text: sText,
                    viewName: sViewName
                }));
            },

            /**
             * Checks if given generic button has the expected ID.
             * @param {object} oInput
             *   The input for the check containing the name of the generic button and information about
             *   the expected ID.
             * @param {string} [oInput.fixId]
             *   The expected fix ID of the control if it is set expectedId is ignored.
             * @param {boolean} oInput.isGenerated
             *   Indicates that the expected ID is generated. <code>oInput.expectedId<code> is ignored.
             * @param {string} oInput.scfldControl
             *   The name of the generic scaffolding control to be checked.
             * @param {string} [oInput.expectedId]
             *   The expected ID of the button (without the view prefix).
             * @param {string} [oInput.text]
             *   The expected text of control.
             * @param {string} [oInput.viewId]
             *   The id of the view in which the control is embedded.
             * @param {string} [oInput.viewName]
             *   The name of the view in which the control is embedded.
             * @returns {object}
             *   The configuration object that can be used in <code>OPA.waitFor</code>.
             */
            getCheckIdConfiguration: function (oInput) {
                var sExpectedId = oInput.viewId,
                    sIdPrefix,
                    oMatcherConfig,
                    sViewname = oInput.viewName,
                    oButtonConfig = mGenerics[oInput.scfldControl],
                    oControl = (oButtonConfig && oButtonConfig.control) || mControls.button,
                    bSearchOpenDialogs = oButtonConfig
                        && oButtonConfig.bSearchOpenDialogs === true;

                if (oInput.bSearchOpenDialogs !== undefined) {
                    bSearchOpenDialogs = oInput.bSearchOpenDialogs;
                }
                if (oButtonConfig) {
                    if (oInput.text) {
                        oMatcherConfig = {text: oInput.text};
                        sExpectedId = oInput.expectedId ? sExpectedId + oInput.expectedId
                            : undefined;
                    } else {
                        oMatcherConfig = oButtonConfig.matcher;
                        sExpectedId = sExpectedId +
                            (oInput.expectedId || oButtonConfig.defaultId);
                    }
                } else {
                    return undefined;
                }

                sIdPrefix = oControl.idPrefix;
                return {
                    controlType: oControl.type,
                    viewName: sViewname,
                    searchOpenDialogs: bSearchOpenDialogs,
                    matchers: oMatcherConfig
                        ? new Properties(oMatcherConfig) : undefined,
                    success: function (aControls) {
                        var sId;
                        Opa5.assert.strictEqual(aControls.length, 1,
                            "one Control - " + aControls[0].toString());
                        sId = aControls[0].getId();
                        // if fix ID is used it wins over generated and expected ID
                        if (!oInput.fixId && (oInput.isGenerated || !sExpectedId)) {
                            Opa5.assert.strictEqual(sId.slice(0, sIdPrefix.length), sIdPrefix,
                                "Generated id with prefix: " + sIdPrefix);
                        } else {
                            Opa5.assert.strictEqual(sId, oInput.fixId || sExpectedId,
                                oInput.scfldControl + " has expected id: "
                                    + (oInput.fixId || sExpectedId));
                        }
                    },
                    errorMessage: "Did not find " + oInput.scfldControl + ", expected: "
                        + (oInput.fixId || sExpectedId) // TODO handle both cases!
                };
            },

            /**
             * Trigger tab event on given control.
             * @param {object} oInput
             *   The input for the click.
             * @param {string} oInput.scfldControl
             *   The name of the generic scaffolding control to be checked.
             * @param {string} [oInput.text]
             *   The expected text of control.
             * @param {string} [oInput.viewName]
             *   The name of the view in which the control is embedded.
             * @returns {object}
             *   The configuration object that can be used in <code>OPA.waitFor</code>.
             */
            clickConfiguration: function (oInput) {
                var oMatcherConfig,
                    oButtonConfig = mGenerics[oInput.scfldControl],
                    oControl = (oButtonConfig && oButtonConfig.control) || mControls.button;

                if (oInput.scfldControl === "appButton" && oInput.text) {
                    oMatcherConfig = {text: oInput.text};
                } else if (oButtonConfig) {
                    oMatcherConfig = oButtonConfig.matcher;
                }
                return {
                    controlType : oControl.type,
                    viewName : oInput.viewName,
                    matchers : oMatcherConfig
                        ? new Properties(oMatcherConfig) : undefined,
                    success : function (aControls) {
                        if (oInput.immediateClick) {
                            aControls[0].$().trigger("tap");
                        } else {
                            setTimeout(function () {
                                aControls[0].$().trigger("tap");
                            }, 10);
                        }
                    },
                    errorMessage: "Did not find " + oInput.scfldControl
                };
            }
        });

    return Common;
});