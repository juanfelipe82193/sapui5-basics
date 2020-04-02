// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
/**
 * @fileOverview Helper class to create scaffolding header footer options from URL parameters.
 */

(function () {
    "use strict";
    /*global jQuery, sap*/
    jQuery.sap.declare("sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator");

    var oUriParameters = jQuery.sap.getUriParameters();

    function showMessage(sMessage) {
        sap.m.MessageToast.show(sMessage);
        jQuery.sap.log.info(sMessage);
    }

    function getParameterValue(sCategory, sProperty, sDefaultValue, sList, iIndex) {
        var sName = sCategory + (sList ? "." + sList + "." + iIndex : "") + "." + sProperty,
            vParamValue = oUriParameters.mParams[sName];
        return vParamValue || sDefaultValue;
    }

    function getStringValue(sCategory, sProperty, sDefaultValue, sList, iIndex) {
        var vParamValue = getParameterValue(sCategory, sProperty, sDefaultValue, sList, iIndex);
        if (vParamValue && vParamValue instanceof Array) {
            vParamValue = vParamValue[0];
        }
        return vParamValue || sDefaultValue;
    }

    function hasParameter(sCategory, sProperty, sList, iIndex) {
        var sName = sCategory + (sList ? "." + sList + "." + iIndex : "") + "." + sProperty;
        return oUriParameters.mParams[sName] !== undefined;
    }

    sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator = {
        /**
         * Creates header footer options with buttons from URL parameters. URL parameters can be
         * defined for different "categories" of scaffolding view. The following URL parameters
         * are supported with the first segment in the parameter name being the category with one
         * of the values specified below
         * <ol>
         * <li> master.add
         *     Displays add button in master view
         * <li> master.add.id
         *     Custom ID of the add button.
         * <li> (master|detail|fullscreen).buttonlist: Number of buttons in button list
         * <li> (master|detail|fullscreen).buttonlist.<index>.text
         *     Text of button (instead of generic text)
         * <li> (master|detail|fullscreen).buttonlist.<index>.icon
         *     Icon of button
         * <li> (master|detail|fullscreen).buttonlist.<index>.id
         *     ID of button
         * <li> (detail|fullscreen).edit
         *     Displays edit button if set
         * <li> (master|detail|fullscreen).edit.id
         *     id of the edit button
         * <li> (detail|fullscreen).edit.text
         *    Text of edit button
         * <li> (detail|fullscreen).email
         *     Email share button
         * <li> (master|fullscreen).filter
         *     Displays filter button
         * <li> (master|fullscreen).filter.id
         *     id of the filter button
         * <li> (master|fullscreen).filter.items
         *     Comma separated list of filter items.
         *     Item ID can be provided by : e.g. item=A,b:IdB,C
         * <li> (master|fullscreen).group
         *     Displays group button
         * <li> (master|fullscreen).group.items
         *     Comma separated list of group items.
         *     Item ID can be provided by : e.g. item=A,b:IdB,C
         * <li> (detail|fullscreen).negative
         *     Displays negative button if set
         * <li> (master|fullscreen).negative.id
         *     id of the negative button
         * <li> (detail|fullscreen).negative.text
         *     Text of negative button
         * <li> (detail|fullscreen).positive
         *     Displays positive button if set
         * <li> (master|fullscreen).positive.id
         *     id of the positive button
         * <li> (detail|fullscreen).positive.text
         *     Text of positive button
         * <li> (detail|fullscreen).settingsbuttons: Number of additional settings buttons
         * <li> (detail|fullscreen).settingsbuttons.<index>.text:
         *     Text of additional settings button (instead of generic text)
         * <li> (detail|fullscreen).settingsbuttons.<index>.icon:
         *     Icon of additional settings button
         * <li> (detail|fullscreen).jamshare
         *     A JAM share button
         * <li> (detail|fullscreen).jamdiscuss
         *     A JAM discuss button
         * <li> (detail|fullscreen).sharebuttons: Number of additional share buttons
         * <li> (detail|fullscreen).sharebuttons.<index>.text:
         *     Text of additional share button (instead of generic text)
         * <li> (detail|fullscreen).sharebuttons.<index>.icon:
         *     Icon of additional share button
         * <li> (master|fullscreen).sort
         *     Displays sortbutton
         * <li> (master|fullscreen).sort.items
         *     Comma separated list of sort items.
         *     Item ID can be provided by : e.g. item=A,b:IdB,C
         * <li> (detail|fullscreen).suppressbookmark
         *     Suppresses "Save as tile" button
         * <li> (master|detail|fullscreen).title
         *     The title
         * </ol>
         *
         * Sample URL parameters: master.buttonlist=3&master.sort&master.filter&master.add&
         * detail.edit&detail.buttonlist=5&detail.sharebuttons=3
         *
         * @param sCategory one of "master", "detail", "fullscreen"
         */
        createHeaderFooterOptions: function (sCategory) {
            var iButtonListCnt = getParameterValue(sCategory, "buttonlist", "0"),
                oHFO,
                sBtnTxt,
                sId,
                aItems,
                i,
                s,
                aTexts;
            if (iButtonListCnt > 0) {
                oHFO = {};
                oHFO.buttonList = [];
                for (i = 0; i < iButtonListCnt; i += 1) {
                    sBtnTxt = getStringValue(sCategory, "text", "Button" + i, "buttonlist", i);
                    oHFO.buttonList[i] = {
                        //TODO sId has to be tested separately:
                        // static header footer options, that.setBtnEnabled(sId) in other button
                        sBtnTxt : sBtnTxt,
                        onBtnPressed : showMessage.bind(null, sCategory + ": " + sBtnTxt)
                    };
                    if (hasParameter(sCategory, "icon", "buttonlist", i)) {
                        oHFO.buttonList[i].sIcon = "sap-icon://" +
                            getStringValue(sCategory, "icon", "competitor", "buttonlist", i);
                    }
                    if (hasParameter(sCategory, "id", "buttonlist", i)) {
                        oHFO.buttonList[i].sId = getStringValue(sCategory, "id", undefined,
                            "buttonlist", i);
                    }
                }
            }
            iButtonListCnt = getParameterValue(sCategory, "sharebuttons", "0");
            if (iButtonListCnt > 0) {
                oHFO = oHFO || {};
                oHFO.additionalShareButtonList = [];
                for (i = 0; i < iButtonListCnt; i += 1) {
                    sBtnTxt = getStringValue(sCategory, "text", "Share " + i,
                        "sharebuttons", i);
                    oHFO.additionalShareButtonList[i] = {
                        sBtnTxt : sBtnTxt,
                        onBtnPressed : showMessage.bind(null, sCategory + ": Share " + sBtnTxt)
                    };
                    if (hasParameter(sCategory, "icon", "sharebuttons", i)) {
                        oHFO.additionalShareButtonList[i].sIcon = "sap-icon://" +
                            getStringValue(sCategory, "icon", "basket", "sharebuttons", i);
                    }
                    if (hasParameter(sCategory, "id", "sharebuttons", i)) {
                        oHFO.additionalShareButtonList[i].sId =
                            getStringValue(sCategory, "id", undefined, "sharebuttons", i);
                    }
                }
            }
            iButtonListCnt = getParameterValue(sCategory, "settingsbuttons", "0");
            if (iButtonListCnt > 0) {
                oHFO = oHFO || {};
                oHFO.aAdditionalSettingButtons = [];
                for (i = 0; i < iButtonListCnt; i += 1) {
                    sBtnTxt = getStringValue(sCategory, "text", "Settings " + i,
                        "settingsbuttons", i);
                    oHFO.aAdditionalSettingButtons[i] = {
                        sBtnTxt : sBtnTxt,
                        onBtnPressed : showMessage.bind(null, sCategory + ": Settings " + sBtnTxt)
                    };
                    if (hasParameter(sCategory, "icon", "settingsbuttons", i)) {
                        oHFO.aAdditionalSettingButtons[i].sIcon = "sap-icon://" +
                            getStringValue(sCategory, "icon", "basket", "settingsbuttons", i);
                    }
                }
            }

            if (hasParameter(sCategory, "positive")) {
                oHFO = oHFO || {};
                sBtnTxt = getStringValue(sCategory, "positive.text", "Accept");
                oHFO.oPositiveAction = {
                    sBtnTxt: sBtnTxt,
                    onBtnPressed : showMessage.bind(null, sCategory + ": Positive - " + sBtnTxt)
                };
                sId = getParameterValue(sCategory, "positive.id", "");
                if (sId) {
                    oHFO.oPositiveAction.sId = sId[0];
                }
            }
            if (hasParameter(sCategory, "negative")) {
                oHFO = oHFO || {};
                sBtnTxt = getStringValue(sCategory, "negative.text", "Reject");
                oHFO.oNegativeAction = {
                    sBtnTxt: sBtnTxt,
                    onBtnPressed : showMessage.bind(null, sCategory + ": Negative - " + sBtnTxt)
                };
                sId = getParameterValue(sCategory, "negative.id", "");
                if (sId) {
                    oHFO.oNegativeAction.sId = sId[0];
                }
            }
            if (hasParameter(sCategory, "edit")) {
                oHFO = oHFO || {};
                sBtnTxt = getStringValue(sCategory, "edit.text", undefined);
                sId = getStringValue(sCategory, "edit.id", undefined);
                if (sBtnTxt || sId || sCategory !== "master") {
                    oHFO.oEditBtn = {
                        sBtnTxt: sBtnTxt || "Edit",
                        sId : sId,
                        onBtnPressed : showMessage.bind(null, sCategory + ": Edit - " + sBtnTxt)
                    };
                } else {
                    oHFO.onEditPress = showMessage.bind(null, sCategory + ": Edit");
                }
            }
            if (hasParameter(sCategory, "filter")) {
                oHFO = oHFO || {};
                oHFO.oFilterOptions = {
                    onFilterPressed : showMessage.bind(null, sCategory + ": Filter Pressed")
                };
                aItems = getParameterValue(sCategory, "filter.items", "");
                if (aItems) {
                    aItems = aItems[0].split(','); // getParameterValue returns an array of values!
                }
                if (aItems.length > 0 && aItems[0]) {
                    oHFO.oFilterOptions.aFilterItems = [];
                    oHFO.oFilterOptions.onFilterSelected = showMessage.bind(null, sCategory
                        + ": Filter Selected");
                    for (i = 0; i < aItems.length; i += 1) {
                        aTexts = aItems[i].split(':');
                        oHFO.oFilterOptions.aFilterItems.push({text: aTexts[0],
                            id: aTexts[1], key: "key " + i});
                    }
                }
                sId = getParameterValue(sCategory, "filter.id", "");
                if (sId) {
                    oHFO.oFilterOptions.sId = sId[0];
                }
            }
            if (hasParameter(sCategory, "sort")) {
                oHFO = oHFO || {};
                oHFO.oSortOptions = {
                    onSortPressed : showMessage.bind(null, sCategory + ": Sort Pressed")
                };
                aItems = getParameterValue(sCategory, "sort.items", "");
                if (aItems) {
                    aItems = aItems[0].split(','); // getParameterValue returns an array of values!
                }
                if (aItems.length > 0 && aItems[0]) {
                    oHFO.oSortOptions.aSortItems = [];
                    oHFO.oSortOptions.onSortSelected = showMessage.bind(null, sCategory
                        + ": Sort Selected");
                    for (i = 0; i < aItems.length; i += 1) {
                        aTexts = aItems[i].split(':');
                        oHFO.oSortOptions.aSortItems.push({text: aTexts[0],
                            id: aTexts[1], key: "key " + i});
                    }
                }
                sId = getParameterValue(sCategory, "sort.id", "");
                if (sId) {
                    oHFO.oSortOptions.sId = sId[0];
                }
            }
            if (hasParameter(sCategory, "group")) {
                oHFO = oHFO || {};
                oHFO.oGroupOptions = {
                    onGroupPressed : showMessage.bind(null, sCategory + ": Group Pressed")
                };
                aItems = getParameterValue(sCategory, "group.items", "");
                if (aItems) {
                    aItems = aItems[0].split(','); // getParameterValue returns an array of values!
                }
                if (aItems.length > 0 && aItems[0]) {
                    oHFO.oGroupOptions.aGroupItems = [];
                    oHFO.oGroupOptions.onGroupSelected = showMessage.bind(null, sCategory
                        + ": Group Selected");
                    for (i = 0; i < aItems.length; i += 1) {
                        aTexts = aItems[i].split(':');
                        oHFO.oGroupOptions.aGroupItems.push({text: aTexts[0],
                            id: aTexts[1], key: "key " + i});
                    }
                }
                sId = getParameterValue(sCategory, "group.id", "");
                if (sId) {
                    oHFO.oGroupOptions.sId = sId[0];
                }
            }
            if (sCategory === "master" && hasParameter(sCategory, "add")) {
                oHFO = oHFO || {};
                oHFO.onAddPress = showMessage.bind(null, sCategory + ": Add");
                sId = getParameterValue(sCategory, "add.id", "");
                if (sId) {
                    oHFO.oAddOptions = {
                        sId: sId[0],
                        onBtnPressed: oHFO.onAddPress
                    };
                    delete oHFO.onAddPress;
                }
            }

            if (sCategory !== "master" && hasParameter(sCategory, "email")) {
                oHFO = oHFO || {};
                oHFO.oEmailSettings = {
                    sSubject : "Email Subject",
                    sRecepient : "do.not.reply@sap.com",
                    fGetMailBody : function () {
                        return "This is a very important mail for you";
                    }
                };
            }
            if (sCategory !== "master" && hasParameter(sCategory, "jamshare")) {
                oHFO = oHFO || {};
                oHFO.oJamOptions  = oHFO.oJamOptions || {};
                oHFO.oJamOptions.oShareSettings = {
                    foo : "bar"
                };
            }
            if (sCategory !== "master" && hasParameter(sCategory, "jamdiscuss")) {
                oHFO = oHFO || {};
                oHFO.oJamOptions  = oHFO.oJamOptions || {};
                oHFO.oJamOptions.oDiscussSettings = {
                    foo : "bar"
                };
            }
            if (hasParameter(sCategory, "suppressbookmark")) {
                oHFO = oHFO || {};
                oHFO.bSuppressBookmarkButton = true;
            }

            if (hasParameter(sCategory, "title")) {
                oHFO = oHFO || {};
                s = getParameterValue(sCategory, "title", "DEFAULT TITLE")[0];
                switch (sCategory) {
                case "detail":
                    oHFO.sDetailTitle = s;
                    break;
                case "fullscreen":
                    oHFO.sFullscreenTitle = s;
                    break;
                case "master":
                    oHFO.sI18NMasterTitle = s;
                    break;
                }
                
            }

            if (hasParameter(sCategory, "titleId")) {
                oHFO = oHFO || {};
                s = getParameterValue(sCategory, "titleId")[0];
                switch (sCategory) {
                case "detail":
                    oHFO.sDetailTitleId = s;
                    break;
                case "fullscreen":
                    oHFO.sFullscreenTitleId = s;
                    break;
                case "master":
                    oHFO.sMasterTitleId = s;
                    break;
                }
            }
            return oHFO;
        }
    };
}());