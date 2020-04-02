// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */

sap.ui.define([], function () {
    "use strict";

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchFacetDialogHelper');
    var module = sap.ushell.renderers.fiori2.search.SearchFacetDialogHelper = {};

    jQuery.extend(module, {

        init: function (dialog) {

            var that = this;

            //the position index of elements in parent aggregation:
            //first masterPage: masterPages[0]->scrollContainer->content[]
            that.POS_FACET_LIST = 0;
            //every detailPage->subHeader->content[]
            that.POS_TOOLBAR_SEARCHFIELD = 0;
            that.POS_TOOLBAR_TOGGLEBUTTON = 1;
            //every detailPage->content[]
            //old layout (number, date facet)
            that.POS_SETTING_CONTAINER = 0;
            that.POS_ATTRIBUTE_LIST_CONTAINER = 1;
            //new layout (string, text facet)
            that.POS_ICONTABBAR = 0;
            //tabBar->items[]
            that.POS_TABBAR_LIST = 0;
            that.POS_TABBAR_CONDITION = 1;
            //settingContainer->content[]
            that.POS_SORTING_SELECT = 0;
            that.POS_SHOWONTOP_CHECKBOX = 1;
            //advancedCondition->content[]
            that.POS_ADVANCED_CHECKBOX = 0;
            that.POS_ADVANCED_INPUT_LAYOUT = 1;
            that.POS_ADVANCED_BUTTON = 2;
            that.bResetFilterIsActive = false;

            var oNumberFormatOptions = {
                "decimals": 2
            };
            //            that.oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oNumberFormatOptions, new sap.ui.core.Locale(sap.ushell.resources.i18n.sLocale));
            that.oFloatNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oNumberFormatOptions);
            that.oIntegernumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance();

            //format: 2015-07-14 00:00:00.0000000
            that.oDateFormatOptions = {
                "pattern": "yyyy/MM/dd",
                "UTC": false
            };
            that.oTimestampFormatOptions = {
                "pattern": "yyyy-MM-dd HH:mm:ss.SSSSSSS",
                "UTC": true
            };
            that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance(that.oDateFormatOptions);
            that.oTimestampFormat = sap.ui.core.format.DateFormat.getDateTimeInstance(that.oTimestampFormatOptions);

            that.dialog = dialog;
        },

        //get the facet list in masterPage
        getFacetList: function () {
            var that = this;
            return that.dialog.oSplitContainer.getMasterPages()[0].getContent()[that.POS_FACET_LIST];
        },

        //according masterPageListItem, send a single facet pespective call, update the detail page
        updateDetailPage: function (oListItem, sFilterTerm, bInitialFilters) {
            var that = this;

            //var oModel = oListItem.getBindingContext().oModel;
            var oModel = that.dialog.getModel();
            var oSearchModel = that.dialog.getModel('searchModel');
            var sBindingPath = oListItem.getBindingContext().sPath;
            var oSelectedListItem = oModel.getProperty(sBindingPath);
            var sDataType = oModel.getAttributeDataType(oSelectedListItem);

            var index = this.getFacetList().indexOfAggregation("items", oListItem);
            var oDetailPage = that.dialog.oSplitContainer.getDetailPages()[index];
            var oDetailPageAttributeListContainer, oDetailPageAttributeList, oAdvancedContainer, oSettings;
            if (sDataType === "string" || sDataType === "text") {
                oDetailPageAttributeListContainer = oDetailPage.getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_LIST].getContent()[0].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER];
                oDetailPageAttributeList = oDetailPage.getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_LIST].getContent()[0].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
                oAdvancedContainer = oDetailPage.getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_CONDITION].getContent()[0];
                oSettings = oDetailPage.getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_LIST].getContent()[0].getContent()[that.POS_SETTING_CONTAINER];
            } else {
                oDetailPageAttributeListContainer = oDetailPage.getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER];
                oDetailPageAttributeList = oDetailPage.getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
                oAdvancedContainer = oDetailPage.getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER]; //from index 1
                oSettings = oDetailPage.getContent()[that.POS_SETTING_CONTAINER];
            }
            var sNaviId = oDetailPage.getId();
            that.dialog.oSplitContainer.toDetail(sNaviId, "show");
            that.dialog.resetIcons(oModel, sBindingPath, that.dialog);

            oDetailPageAttributeListContainer.setBusy(true);

            var properties = {
                sAttribute: oSelectedListItem.dimension,
                sBindingPath: sBindingPath,
                sAttributeLimit: 1000,
                bInitialFilters: bInitialFilters
            };
            if (sDataType === "number") {
                properties.sAttributeLimit = 20;
            }

            if (!oModel.chartQuery) {
                oModel.chartQuery = oModel.sinaNext.createChartQuery({
                    filter: oModel.getProperty("/uiFilter").clone(),
                    dimension: oSelectedListItem.dimension,
                    top: 1000
                });
            }

            //apply the facet query filter, except itself
            that.applyChartQueryFilter(index);

            //add the filter term in search field
            if (sFilterTerm) {
                //                properties.bValueHelpMode = true;
                var filterCondition = oModel.sinaNext.createSimpleCondition({
                    attribute: oSelectedListItem.dimension,
                    operator: oModel.sinaNext.ComparisonOperator.Bw,
                    value: sFilterTerm
                });
                if (!that.bResetFilterIsActive) {
                    oModel.chartQuery.filter.autoInsertCondition(filterCondition);
                }
            } else {
                //                properties.bValueHelpMode = false;
                if (sFilterTerm === undefined && (sDataType === "string" || sDataType === "text")) { // eslint-disable-line no-lonely-if
                    oDetailPage.getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_LIST].getContent()[0].getSubHeader().getContent()[that.POS_TOOLBAR_SEARCHFIELD].setValue('');
                }
            }

            //            oModel.chartQuery.setSearchTerms(oSearchModel.getSearchBoxTerm());
            oModel.chartQuery.filter.searchTerm = oSearchModel.getSearchBoxTerm();

            //send the single call
            oModel.facetDialogSingleCall(properties).then(function () {
                var aItems = oModel.getProperty(oDetailPage.getBindingContext().sPath).items;
                //initiate advanced container
                if (oAdvancedContainer.data('initial')) {
                    that.initiateAdvancedConditions(oAdvancedContainer, aItems, oAdvancedContainer.data('dataType'));
                }

                //enable setting check box
                var oCheckbox = oSettings.getItems()[that.POS_SHOWONTOP_CHECKBOX];
                if (oDetailPageAttributeList.getSelectedContexts().length > 0) {
                    oCheckbox.setEnabled(true);
                }

                //update detail page list items select
                that.updateDetailPageListItemsSelected(oDetailPageAttributeList, oAdvancedContainer);

                //update possible charts avr
                that.dialog.updateDetailPageCharts(aItems, oModel);
            });

        },

        //collect all filters in dialog for single facet call
        applyChartQueryFilter: function (excludedIndex) {
            var that = this;

            that.dialog.getModel().resetChartQueryFilterConditions();

            var aDetailPages = that.dialog.oSplitContainer.getDetailPages();
            for (var i = 0; i < aDetailPages.length; i++) {
                if (i === excludedIndex || aDetailPages[i].getContent().length === 0) {
                    continue;
                }

                var oList;
                if (!aDetailPages[i].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER]) {
                    //new layout
                    oList = aDetailPages[i].getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_LIST].getContent()[0].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
                } else {
                    //old layout
                    oList = aDetailPages[i].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
                }
                for (var j = 0; j < oList.getItems().length; j++) {
                    var oListItem = oList.getItems()[j];
                    var oListItemBindingObject = oListItem.getBindingContext().getObject();
                    var filterCondition = oListItemBindingObject.filterCondition;
                    if (filterCondition.attribute || filterCondition.conditions) {
                        if (oListItem.getSelected() && !that.bResetFilterIsActive) {
                            that.dialog.getModel().chartQuery.filter.autoInsertCondition(filterCondition);
                        }
                    }
                }

                that.applyAdvancedCondition(aDetailPages[i], that.getFacetList().getItems()[i].getBindingContext().getObject(), that.dialog.getModel());
            }
        },

        //removes all filters in dialog for single facet call
        resetChartQueryFilters: function () {
            var that = this;

            that.dialog.getModel().resetChartQueryFilterConditions();

            var aDetailPages = that.dialog.oSplitContainer.getDetailPages();
            for (var i = 0; i < aDetailPages.length; i++) {
                if (aDetailPages[i].getContent().length === 0) {
                    continue;
                }

                var oList;
                if (!aDetailPages[i].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER]) {
                    //new layout
                    oList = aDetailPages[i].getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_LIST].getContent()[0].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
                } else {
                    //old layout
                    oList = aDetailPages[i].getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
                }
                for (var j = 0; j < oList.getItems().length; j++) {
                    var oListItem = oList.getItems()[j];
                    var oListItemBindingObject = oListItem.getBindingContext().getObject();
                    var filterCondition = oListItemBindingObject.filterCondition;
                    if (filterCondition.attribute || filterCondition.conditions) {
                        if (oListItem.getSelected()) {
                            oListItem.setSelected(false);
                            //that.dialog.getModel().removeFilterCondition(filterCondition, false);
                        }
                    }
                }

                //that.applyAdvancedCondition(aDetailPages[i], that.getFacetList().getItems()[i].getBindingContext().getObject(), that.dialog.getModel().chartQuery);
            }
        },

        //collect all advanced filter condition in a detail page
        applyAdvancedCondition: function (oDetailPage, oFacetItemBinding, oAppliedObject) {
            var that = this;

            var model = that.dialog.getModel();
            var sDataType, oAdvancedConditionList, k, oAdvancedCondition, oAdvancedCheckBox, fromCondition, toCondition, oConditionGroup;
            if (oDetailPage.getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER]) {
                //old layout, number and date layout
                var oListAndConditionContainer = oDetailPage.getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER];
                sDataType = oListAndConditionContainer.data('dataType');
                oAdvancedConditionList = oListAndConditionContainer.getContent(); //from index 1
                switch (sDataType) {
                case 'timestamp':
                case 'date': // eslint-disable-line no-fallthrough
                    that.oDateTimeFormat = (sDataType === 'timestamp') ? that.oTimestampFormat : that.oDateFormat;
                    for (k = 1; k < oAdvancedConditionList.length; k++) {
                        oAdvancedCondition = oAdvancedConditionList[k];
                        oAdvancedCheckBox = oAdvancedCondition.getContent()[that.POS_ADVANCED_CHECKBOX];
                        var oDateRangeSelection = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT];
                        if (oAdvancedCheckBox.getSelected() && oDateRangeSelection.getDateValue() && oDateRangeSelection.getSecondDateValue()) {
                            var secondDateObject = new Date(oDateRangeSelection.getSecondDateValue().getFullYear(), oDateRangeSelection.getSecondDateValue().getMonth(), oDateRangeSelection.getSecondDateValue().getDate(), 23, 59, 59);
                            var dateValue = that.oDateTimeFormat.format(oDateRangeSelection.getDateValue());
                            var secondDateValue = that.oDateTimeFormat.format(secondDateObject);
                            fromCondition = model.sinaNext.createSimpleCondition({
                                attribute: oFacetItemBinding.dimension,
                                attributeLabel: oFacetItemBinding.title,
                                operator: model.sinaNext.ComparisonOperator.Ge,
                                value: (sDataType === 'timestamp') ? oDateRangeSelection.getDateValue() : dateValue,
                                valueLabel: dateValue
                            });
                            toCondition = model.sinaNext.createSimpleCondition({
                                attribute: oFacetItemBinding.dimension,
                                attributeLabel: oFacetItemBinding.title,
                                operator: model.sinaNext.ComparisonOperator.Le,
                                value: (sDataType === 'timestamp') ? secondDateObject : secondDateValue,
                                valueLabel: secondDateValue
                            });
                            oConditionGroup = model.sinaNext.createComplexCondition({
                                valueLabel: oDateRangeSelection.getValue(),
                                operator: model.sinaNext.LogicalOperator.And,
                                conditions: [fromCondition, toCondition],
                                userDefined: true
                            });
                            if (!that.bResetFilterIsActive) {
                                oAppliedObject.addFilterCondition(oConditionGroup, false);
                            }
                        }
                    }
                    break;
                case 'integer':
                case 'number': // eslint-disable-line no-fallthrough
                    that.oNumberFormat = (sDataType === 'integer') ? that.oIntegernumberFormat : that.oFloatNumberFormat;
                    for (k = 1; k < oAdvancedConditionList.length; k++) {
                        oAdvancedCondition = oAdvancedConditionList[k];
                        oAdvancedCheckBox = oAdvancedCondition.getContent()[that.POS_ADVANCED_CHECKBOX];
                        var oAdvancedInputLeft = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[0];
                        var oAdvancedInputRight = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[2];
                        var oAdvancedLebel = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];

                        var oAdvancedInputLeftValue = that.oNumberFormat.parse(oAdvancedInputLeft.getValue());
                        var oAdvancedInputRightValue = that.oNumberFormat.parse(oAdvancedInputRight.getValue());
                        if (oAdvancedCheckBox.getSelected()) {
                            if (oAdvancedInputLeftValue !== NaN && oAdvancedInputRightValue !== NaN && oAdvancedInputRightValue >= oAdvancedInputLeftValue) {
                                fromCondition = model.sinaNext.createSimpleCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: model.sinaNext.ComparisonOperator.Ge,
                                    value: oAdvancedInputLeftValue,
                                    valueLabel: that.oNumberFormat.format(oAdvancedInputLeftValue),
                                    userDefined: true
                                });
                                toCondition = model.sinaNext.createSimpleCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: model.sinaNext.ComparisonOperator.Le,
                                    value: oAdvancedInputRightValue,
                                    valueLabel: that.oNumberFormat.format(oAdvancedInputRightValue),
                                    userDefined: true
                                });
                                oConditionGroup = model.sinaNext.createComplexCondition({
                                    valueLabel: that.oNumberFormat.format(oAdvancedInputLeftValue) + oAdvancedLebel.getText() + that.oNumberFormat.format(oAdvancedInputRightValue),
                                    operator: model.sinaNext.LogicalOperator.And,
                                    conditions: [fromCondition, toCondition],
                                    userDefined: true
                                });
                                if (!that.bResetFilterIsActive) {
                                    oAppliedObject.addFilterCondition(oConditionGroup, false);
                                }
                            } else {
                                that.dialog.getModel('searchModel').pushError({
                                    type: "error",
                                    title: sap.ushell.resources.i18n.getText('filterInputErrorTitle'),
                                    description: sap.ushell.resources.i18n.getText('filterInputError')
                                });
                                that.dialog.bConditionValidateError = true;
                            }
                        }
                    }
                    break;
                default:
                    break;
                }
            } else {
                //new layout, string and text facet
                var oAdvancedContainer = oDetailPage.getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_CONDITION].getContent()[0];
                sDataType = oAdvancedContainer.data('dataType');
                oAdvancedConditionList = oAdvancedContainer.getContent();
                var oAdvancedSelect, oAdvancedInput, sConditionTerm, oFilterCondition, sOperator;
                switch (sDataType) {
                case 'string':
                    for (k = 0; k < oAdvancedConditionList.length - 1; k++) {
                        oAdvancedCondition = oAdvancedConditionList[k];
                        oAdvancedSelect = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[0];
                        oAdvancedInput = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];
                        sConditionTerm = oAdvancedInput.getValue();
                        switch (oAdvancedSelect.getSelectedKey()) {
                        case 'eq':
                            //                            sConditionTerm = oAdvancedInput.getValue();
                            sOperator = model.sinaNext.ComparisonOperator.Eq;
                            break;
                        case 'ew':
                            //                            sConditionTerm = "*" + oAdvancedInput.getValue();
                            sOperator = model.sinaNext.ComparisonOperator.Ew;
                            break;
                        case 'bw':
                            //                            sConditionTerm = oAdvancedInput.getValue() + "*";
                            sOperator = model.sinaNext.ComparisonOperator.Bw;
                            break;
                        case 'co':
                            //                            sConditionTerm = "*" + oAdvancedInput.getValue() + "*";
                            sOperator = model.sinaNext.ComparisonOperator.Co;
                            break;
                        default:
                            sOperator = model.sinaNext.ComparisonOperator.Eq;
                            break;
                        }
                        if (oAdvancedInput.getValue()) {
                            oFilterCondition = model.sinaNext.createSimpleCondition({
                                attribute: oFacetItemBinding.dimension,
                                attributeLabel: oFacetItemBinding.title,
                                operator: sOperator,
                                value: sConditionTerm,
                                valueLabel: sConditionTerm,
                                userDefined: true
                            });
                            if (!that.bResetFilterIsActive) {
                                oAppliedObject.addFilterCondition(oFilterCondition, false);
                            }
                        }
                    }
                    break;
                case 'text':
                    for (k = 0; k < oAdvancedConditionList.length - 1; k++) {
                        oAdvancedCondition = oAdvancedConditionList[k];
                        oAdvancedSelect = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[0];
                        oAdvancedInput = oAdvancedCondition.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];
                        sConditionTerm = oAdvancedInput.getValue();
                        switch (oAdvancedSelect.getSelectedKey()) {
                        case 'co':
                            sOperator = model.sinaNext.ComparisonOperator.Co;
                            break;
                        default:
                            sOperator = model.sinaNext.ComparisonOperator.Eq;
                        }
                        if (oAdvancedInput.getValue()) {
                            oFilterCondition = model.sinaNext.createSimpleCondition({
                                attribute: oFacetItemBinding.dimension,
                                attributeLabel: oFacetItemBinding.title,
                                operator: sOperator,
                                value: sConditionTerm,
                                valueLabel: sConditionTerm,
                                userDefined: true
                            });
                            if (!that.bResetFilterIsActive) {
                                oAppliedObject.addFilterCondition(oFilterCondition, false);
                            }
                        }
                    }
                    break;
                default:
                    break;
                }
            }
        },

        //update advanced conditions after detail page factory
        initiateAdvancedConditions: function (oAdvancedContainer, aItems, type) {
            var that = this;
            var aConditions, oConditionLayout, oCheckBox, oInputLayout, operator;
            for (var i = aItems.length; i > 0; i--) {
                var item = aItems[i - 1];
                if (item.advanced) {

                    aConditions = oAdvancedContainer.getContent();
                    if (type === "string" || type === "text") {
                        oConditionLayout = aConditions[aConditions.length - 2];
                    } else {
                        oConditionLayout = aConditions[aConditions.length - 1];
                    }

                    oCheckBox = oConditionLayout.getContent()[that.POS_ADVANCED_CHECKBOX];
                    oCheckBox.setSelected(true);
                    oInputLayout = oConditionLayout.getContent()[that.POS_ADVANCED_INPUT_LAYOUT];
                    switch (type) {
                    case 'integer':
                    case 'number':
                        var oInputBoxLeft = oInputLayout.getContent()[0];
                        var oInputBoxRight = oInputLayout.getContent()[2];
                        if (item.filterCondition.conditions) {
                            for (var j = 0; j < item.filterCondition.conditions.length; j++) {
                                var condition = item.filterCondition.conditions[j];
                                if (condition.operator === "Ge") {
                                    oInputBoxLeft.setValue(condition.valueLabel || that.oNumberFormat.format(condition.value));
                                }
                                if (condition.operator === "Le") {
                                    oInputBoxRight.setValue(condition.valueLabel || that.oNumberFormat.format(condition.value));
                                }
                            }
                        }
                        break;
                    case 'string':
                        //                            var str = item.label;
                        operator = item.filterCondition.operator;
                        //                            if ((str.charAt(0) === "*") && (str.charAt(str.length - 1) === "*")) {
                        if (operator === "Co") {
                            oInputLayout.getContent()[0].setSelectedKey('co');
                            //                                str = str.substring(1, str.length - 1);
                            //                            } else if ((str.charAt(0) === "*")) {
                        } else if (operator === "Ew") {
                            oInputLayout.getContent()[0].setSelectedKey('ew');
                            //                                str = str.substring(1);
                            //                            } else if ((str.charAt(str.length - 1) === "*")) {
                        } else if (operator === "Bw") {
                            oInputLayout.getContent()[0].setSelectedKey('bw');
                            //                                str = str.substring(0, str.length - 1);
                        }
                        oInputLayout.getContent()[1].setValue(item.filterCondition.valueLabel);
                        break;
                    case 'text':
                        //                            var text = item.label;
                        operator = item.filterCondition.operator;
                        //                            if ((text.charAt(0) === "*") && (text.charAt(text.length - 1) === "*")) {
                        if (operator === "Co") {
                            oInputLayout.getContent()[0].setSelectedKey('co');
                            //                                text = text.substring(1, text.length - 1);
                        }
                        oInputLayout.getContent()[1].setValue(item.filterCondition.valueLabel);
                        break;
                    default:
                        oInputLayout.setValue(item.label);
                        break;
                    }
                    that.insertNewAdvancedCondition(oConditionLayout, type);
                    that.dialog.getModel().changeFilterAdvaced(item, true);
                }
            }
            oAdvancedContainer.data('initial', false);
        },

        //callback function, update selected property after model changed
        updateDetailPageListItemsSelected: function (oDetailPageAttributeList, oAdvancedContainer) {
            var that = this;
            var sDataType = oAdvancedContainer.data('dataType');

            // seems that selected bug for sapui5 list has been fixed, manuell set selected is commentted
            // for (var j = 0; j < oDetailPageAttributeList.getItems().length; j++) {
            //     var oListItem = oDetailPageAttributeList.getItems()[j];
            //     var oListItemBindingObject = oListItem.getBindingContext().getObject();
            //     if (oDetailPageAttributeList.getModel().hasFilter(oListItemBindingObject)) {
            //         oListItem.setSelected(true);
            //         oDetailPageAttributeList.getModel().changeFilterAdvaced(oListItemBindingObject, false);
            //         that.removeAdvancedCondition(oAdvancedContainer, oListItem, sDataType);
            //     } else {
            //         oListItem.setSelected(false);
            //     }
            //     //update model selected property
            //     var sSelectedBindingPath = oListItem.getBindingContext().sPath + "/selected";
            //     oListItem.getBindingContext().oModel.setProperty(sSelectedBindingPath, oListItem.getSelected());
            // }

            that.sortingAttributeList(oDetailPageAttributeList.getParent().getParent());
            oDetailPageAttributeList.getParent().setBusy(false);
            if (sDataType === "date" || sDataType === "timestamp" || sDataType === "number" || sDataType === "integer") {
                oDetailPageAttributeList.focus();
            }
        },

        //remove duplicate advanced condition
        removeAdvancedCondition: function (oAdvancedContainer, oListItem, type) {
            var that = this;
            var aConditions = oAdvancedContainer.getContent();
            var oConditionLayout, oInputBox, index;

            if (type === "string" || type === "text") {
                for (var i = 0; i < aConditions.length - 1; i++) {
                    oConditionLayout = aConditions[i];
                    oInputBox = oConditionLayout.getContent()[that.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];
                    if (oInputBox.getProperty('value')) {
                        var value = oInputBox.getValue();
                        var oListItemBindingObject = oListItem.getBindingContext().getObject();
                        if (value === oListItemBindingObject.filterCondition.value) {
                            index = i;
                            break;
                        }
                    }
                }
            }
            oAdvancedContainer.removeContent(index);
        },

        //sorting the attribute list
        sortingAttributeList: function (oDetailPage) {
            var that = this;
            var oSettings = oDetailPage.getContent()[that.POS_SETTING_CONTAINER];
            var oSelect = oSettings.getItems()[that.POS_SORTING_SELECT].getItems()[0];
            var oCheckBox = oSettings.getItems()[that.POS_SHOWONTOP_CHECKBOX];
            var oList = oDetailPage.getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
            var sDataType = oList.data('dataType');
            var oBinding = oList.getBinding("items");
            var aSorters = [];

            if (oCheckBox.getSelected()) {
                aSorters.push(new sap.ui.model.Sorter("selected", true, false));
            }

            switch (oSelect.getSelectedKey()) {
            case "sortName":
                aSorters.push(new sap.ui.model.Sorter("label", false, false));
                break;
            case "sortCount":
                aSorters.push(new sap.ui.model.Sorter("value", true, false));
                if (sDataType === "string" || sDataType === "text") {
                    aSorters.push(new sap.ui.model.Sorter("label", false, false));
                }
                break;
            default:
                break;
            }

            oBinding.sort(aSorters);
        },

        //insert new advanced condition
        insertNewAdvancedCondition: function (oAdvancedCondition, type) {
            var oAdvancedContainer = oAdvancedCondition.getParent();
            var oNewAdvancedCondition = new sap.ushell.renderers.fiori2.search.controls.SearchAdvancedCondition({
                type: type
            });
            if (type === "string" || type === "text") {
                var insertIndex = oAdvancedContainer.getAggregation("content").length - 1;
                oAdvancedContainer.insertAggregation("content", oNewAdvancedCondition, insertIndex);
            } else {
                var index = oAdvancedContainer.indexOfAggregation("content", oAdvancedCondition);
                if (index === (oAdvancedContainer.getAggregation("content").length - 1)) {
                    oAdvancedContainer.addContent(oNewAdvancedCondition);
                }
            }
        },

        //helper function
        deleteAdvancedCondition: function (oAdvancedCondition) {
            var that = this;
            var oAdvancedContainer = oAdvancedCondition.getParent();
            var oDetailPage = oAdvancedCondition.getParent().getParent().getParent().getParent().getParent();
            oAdvancedContainer.removeAggregation("content", oAdvancedCondition);
            that.updateCountInfo(oDetailPage);
        },

        //set count info in master page facet list
        updateCountInfo: function (oDetailPage) {
            var that = this;

            var oMasterPageList = that.getFacetList();
            var oMasterPageListItem = oMasterPageList.getSelectedItem();
            if (!oMasterPageListItem) {
                oMasterPageListItem = oMasterPageList.getItems()[0];
            }
            var oModel = oMasterPageListItem.getBindingContext().oModel;
            var sMasterBindingPath = oMasterPageListItem.getBindingContext().sPath;
            var sDimension = oModel.getProperty(sMasterBindingPath).dimension;
            var aFilters = that.dialog.getModel().aFilters;
            var countNormalCondition = 0;
            for (var j = 0; j < aFilters.length; j++) {
                if (!aFilters[j].advanced && aFilters[j].facetAttribute === sDimension) {
                    countNormalCondition++;
                }
            }

            var sDataType = oModel.getAttributeDataType(oModel.getProperty(sMasterBindingPath));
            var oAdvancedContainer, conditionLength, i, oConditionLayout, oCheckbox;
            var countAdvancedCondition = 0;
            if (sDataType === "string" || sDataType === "text") {
                oAdvancedContainer = oDetailPage.getContent()[that.POS_ICONTABBAR].getItems()[that.POS_TABBAR_CONDITION].getContent()[0];
                conditionLength = oAdvancedContainer.getContent().length - 1;
                for (i = 0; i < conditionLength; i++) {
                    oConditionLayout = oAdvancedContainer.getContent()[i];
                    oCheckbox = oConditionLayout.getContent()[0];
                    if (oCheckbox.getSelected()) {
                        countAdvancedCondition++;
                    }
                }
            } else {
                oAdvancedContainer = oDetailPage.getContent()[that.POS_ATTRIBUTE_LIST_CONTAINER];
                conditionLength = oAdvancedContainer.getContent().length;
                for (i = 1; i < conditionLength; i++) {
                    oConditionLayout = oAdvancedContainer.getContent()[i];
                    oCheckbox = oConditionLayout.getContent()[0];
                    if (oCheckbox.getSelected()) {
                        countAdvancedCondition++;
                    }
                }
            }

            var sFacetType = oModel.getProperty(sMasterBindingPath).facetType;
            if (sFacetType === "attribute") {
                //                var count = aContexts.length + countAdvancedCondition;
                var count = countNormalCondition + countAdvancedCondition;
                oModel.setProperty(sMasterBindingPath + "/count", count);
                that.dialog.resetEnabledForFilterResetButton();
            }
        }

    });

    return module;
});
