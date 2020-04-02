sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/List",
    "sap/ui/model/json/JSONModel",
    "sap/rules/ui/ast/constants/Constants"

], function (Control, List, JSONModel, Constants) {
    "use strict";

    var instance;
    var SelectFunctionDialog = function () {
        this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
        this.functionLabelDisplay = "";
        this.functionLabel = "";
        this._selectFunctionSelected = "";
        this._whereExpressionId = "";
        this.dataObjectId = "";
        this._count = 0;
        this.dataObjectLabel = "";
        this.dataObjectIdSelected = "";
        this.enableCountField = true;
        this.sortOrder = [ {
            name: Constants.NOSORT,
            label: this.oBundle.getText("no_sorting")
        },{
            name: Constants.SORTASC,
            label: this.oBundle.getText("sort_ascending")
        }, {
            name: Constants.SORTDESC,
            label: this.oBundle.getText("sort_descending")
        }];
        this.selectedData = [{
            attributeSelected: "",
            sortOrder: Constants.NOSORT,
            cancelButton: false,
            addButton: true
        }];

        this.enabledData = {
            enabled: false
        };
        this.dataObjectIdData = {
            dataObjectId: ""
        };
    };

    SelectFunctionDialog.prototype._filterSelectFunction = function (selectFunction) {
        var functionJson = [];
        if (selectFunction && selectFunction.selection) {
            for (var iterator = 0; iterator < selectFunction.selection.length; iterator++) {
                if (selectFunction.selection[iterator].name !== Constants.SORTASC && selectFunction.selection[iterator].name !== Constants.SORTDESC && selectFunction.selection[iterator].name !== Constants.BOTTOM) {
                    functionJson.push(selectFunction.selection[iterator]);
                }
            }
            return {
                selection: functionJson
            };
        }
    };
    SelectFunctionDialog.prototype._createFunctionSelectionDropDown = function (selectFunction) {
        var that = this;
        selectFunction = this._filterSelectFunction(selectFunction);
        var model = new sap.ui.model.json.JSONModel(selectFunction);

        this.functionSelect = new sap.m.Select({
            width: "200px",
            selectedKey: this._selectFunctionSelected,
            forceSelection: false,
            showSecondaryValues: true,
            layoutData: new sap.ui.layout.GridData({
                span: "L3 M3 S3"
            }),
            change: function (oEvent) {
                that._selectFunctionSelected = oEvent.getSource().getSelectedItem().getText();
                if (that._selectFunctionSelected === Constants.SELECT || that._selectFunctionSelected === Constants.FIRST) {
                    that._countField.setEnabled(false);
                    that._countField.setValue("");
                    that._count = "";
                } else {
                    that._countField.setEnabled(true);
                }
                if (that.dataObjectId && that._selectFunctionSelected && (that._count || that._selectFunctionSelected === Constants.SELECT || that._selectFunctionSelected === Constants.FIRST)) {
                    that.functionLabelDisplay = that._count ? that._selectFunctionSelected + '(' + that.dataObjectLabel + ',' + that._count + ')' :
                        that._selectFunctionSelected + '(' + that.dataObjectLabel + ')';
                    that.functionLabel = that._count ? that._selectFunctionSelected + '(' + that.dataObjectId + ',' + that._count + ')' :
                        that._selectFunctionSelected + '(' + that.dataObjectId + ')';
                    that.functionLabelField.setValue(that.functionLabelDisplay);
                    if ((that._selectFunctionSelected !== Constants.SELECT && that._count > 0) || (this.oModel.getData().selectionData[0].attributeSelected !==
                        "" &&
                        that._selectFunctionSelected ===
                        Constants.SELECT) || (that._selectFunctionSelected === Constants.FIRST && that.dataObjectId)) {
                        this.applyButton.setEnabled(true);
                    } else {
                        this.applyButton.setEnabled(false);
                    }
                    this.astExpressionBasicForWhere.setEditable(true);
                } else {
                    this.applyButton.setEnabled(false);
                    this.astExpressionBasicForWhere.setEditable(false);
                    this.astExpressionBasicForWhere.setValue("");
                    this.functionLabelField.setValue("");
                }
            }.bind(this)
        }).addStyleClass("sapAstExpressionDialogField");
        this.functionSelect.setModel(model);
        this.functionSelect.bindItems({
            path: "/selection",
            //sorter : new sap.ui.model.Sorter("lastName"),
            template: new sap.ui.core.ListItem({
                text: "{name}",
                key: "{name}",
                additionalText: "{label}"
            })
        });

        return this.functionSelect;
    };

    SelectFunctionDialog.prototype._getAttributeAstExpressionBasic = function (bindingContext) {
        var that = this;
        this.astExpressionBasicForAttribute = new sap.rules.ui.AstExpressionBasic({
            astExpressionLanguage: this._oAstExpressionLanguage,
            enableAggregateFunctionWhereClause: true,
            value: "{attributeSelected}",
            dataObjectInfo: "{/dataObjectIdData/dataObjectId}",
            isAttributeContext: true,
            editable: "{/enabledData/enabled}",
            change: function (oEvent) {
                var sequence = parseInt(oEvent.getSource().getBindingContext().sPath.split("/")[2]);
                that._AttributeExpressionId = oEvent.getParameter("newValue");
                var selectionData = that.oModel.getData().selectionData;
                if (this._attributeAlreadySelected(selectionData)) {
                    oEvent.oSource.setValueState("Error");
                    oEvent.oSource.setValueStateText(this.oBundle.getText("duplicateAttribute"));
                } else {
                    oEvent.oSource.setValueState("None");
                }
                if (that._AttributeExpressionId) {
                    selectionData[sequence].attributeSelected = that._AttributeExpressionId.trim();

                }
                var str = that._setDataObjectInfoForWhereConditionAutoSuggestion();
                that.astExpressionBasicForWhere.setDataObjectInfo(str);
                if ((that._selectFunctionSelected !== Constants.SELECT && that._count > 0) || (this.oModel.getData().selectionData[0].attributeSelected !==
                    "" &&
                    that._selectFunctionSelected ===
                    Constants.SELECT) || (that._selectFunctionSelected === Constants.FIRST && that.dataObjectId )) {
                    this.applyButton.setEnabled(true);
                } else {
                    this.applyButton.setEnabled(false);
                }
                this.astExpressionBasicForWhere.setValue("");
                this._whereExpressionId = "";

            }.bind(this)
        });
        this.astExpressionBasicForAttribute.addStyleClass("sapAstExpressionDialog");
        return this.astExpressionBasicForAttribute;
    };
    
    SelectFunctionDialog.prototype._attributeAlreadySelected = function (selectionData) {
        var iterator = 0;
        for (var entry in selectionData){
                if(selectionData[entry].attributeSelected.trim() === this._AttributeExpressionId.trim()){
                    iterator ++;
                }
        }
        if(iterator>1){
            return true;
        }
        return false;
    };

    SelectFunctionDialog.prototype._tableColumnsFactory = function (sId, oContext) {
        var that = this;
        var itemTemplate = new sap.m.ColumnListItem({
            cells: [that._getAttributeAstExpressionBasic(),
                new sap.m.Select({
                    enabled: "{/enabledData/enabled}",
                    items: {
                        path: "/sortOrder",
                        template: new sap.ui.core.ListItem({
                            key: '{name}',
                            text: '{label}'
                        })
                    },
                    change: function (oEvent) {
                        var sequence = parseInt(oEvent.getSource().getBindingContext().sPath.split("/")[2]);
                        that._sortOrder = oEvent.getSource().getSelectedItem().getKey();
                        that.oModel.getData().selectionData[sequence].sortOrder = that._sortOrder
                    }.bind(this),
                    selectedKey: "{sortOrder}",
                    width: '200px'
                }).addStyleClass("sapAstExpressionDialogField sapAstExpressionSortSelect"),
                new sap.ui.layout.HorizontalLayout({
                    content: [
                        new sap.m.Button({
                            type: sap.m.ButtonType.Transparent,
                            icon: sap.ui.core.IconPool.getIconURI("sys-cancel"),
                            visible: "{cancelButton}",
                            enabled: "{/enabledData/enabled}",
                            press: function (oEvent) {

                                /*   //Clear tableData since the columns will be build again
                                      this._internalModel.setProperty("/tableData", {}, true);*/
                                var sequence = oEvent.getSource().getParent().getParent().getBindingContextPath().split("/")[2];
                                //Remove coulmn from JSON model
                                this._removeColumnFromJsonModel(parseInt(sequence));

                            }.bind(this)
                        }),
                        new sap.m.Button({
                            type: sap.m.ButtonType.Transparent,
                            icon: sap.ui.core.IconPool.getIconURI("add"),
                            visible: "{addButton}",
                            enabled: "{/enabledData/enabled}",
                            press: function (oEvent) {
                                var sequence = oEvent.getSource().getParent().getParent().getBindingContextPath().split("/")[2];
                                //Add coulmn from JSON model
                                this._addColumnToJsonModel(parseInt(sequence));

                            }.bind(this)
                        })
                    ]
                })
            ]
        });

        return itemTemplate;
    };

    SelectFunctionDialog.prototype._addColumnToJsonModel = function (sequence) {
        var newjson = {
            attributeSelected: "",
            sortOrder: Constants.NOSORT,
            cancelButton: true,
            addButton: true,
        }

        this.selectedData.splice(sequence + 1, 0, newjson);
        if (this.selectedData.length > 1) {
            this.selectedData[0].cancelButton = true;
        }
        this.oModel.setData({
            sortOrder: this.sortOrder,
            selectionData: this.selectedData,
            enabledData: this.enabledData,
            dataObjectIdData: this.dataObjectIdData

        });

    };

    SelectFunctionDialog.prototype._removeColumnFromJsonModel = function (sequence) {
        this.selectedData.splice(sequence, 1);
        if (this.selectedData.length === 1) {
            this.selectedData[0].cancelButton = false;
        }
        this.oModel.setData({
            sortOrder: this.sortOrder,
            selectionData: this.selectedData,
            enabledData: this.enabledData,
            dataObjectIdData: this.dataObjectIdData
        });
        
        var str = this._setDataObjectInfoForWhereConditionAutoSuggestion();
        this.astExpressionBasicForWhere.setDataObjectInfo(str);
        this.astExpressionBasicForWhere.setValue("");
        this._whereExpressionId = "";

    };

    SelectFunctionDialog.prototype._getSuggestionsForTheGivenInput = function (inputText) {
        var tokens = this._oAstExpressionLanguage.getTokensForGivenStringInput(inputText);
        var uiModel = this._oAstExpressionLanguage.convertTokensToUiModelForAutoSuggestion(tokens);
        var suggestionContext = {};
        suggestionContext.AttributeContext = true;
        suggestionContext.OperationsContext = false;
        var suggestions = this._oAstExpressionLanguage.getSuggesstions(uiModel, suggestionContext);
        return suggestions;
    };

    SelectFunctionDialog.prototype._createDataObjectDropDown = function (sAriaValue) {
        var that = this;
        var autoSuggestion = this._getSuggestionsForTheGivenInput("");
        var aDataObject = autoSuggestion.autoComplete.categories;
        var model = new sap.ui.model.json.JSONModel(aDataObject);

        this.vocabularySelect = new sap.m.Select({
            width: "200px",
            selectedKey: this.dataObjectIdSelected,
            forceSelection: false,
            ariaLabelledBy: sAriaValue,
            layoutData: new sap.ui.layout.GridData({
                span: "L3 M3 S3"
            }),
            change: function (oEvent) {
                that.dataObjectIdSelected = oEvent.getSource().getSelectedItem().getKey();
                that.dataObjectId = "/" + oEvent.getSource().getSelectedItem().getKey();
                that.dataObjectLabel = oEvent.getSource().getSelectedItem().getText();
                if (that.dataObjectId) {
                    that.oModel.getData().dataObjectIdData.dataObjectId = that.dataObjectId;
                    that.oModel.getData().enabledData.enabled = true;
                }
                this.selectedData = [{
                    attributeSelected: "",
                    sortOrder: Constants.NOSORT,
                    cancelButton: false,
                    addButton: true
                }];
                that._bindAttributes();
                var str = that._setDataObjectInfoForWhereConditionAutoSuggestion();
                that.astExpressionBasicForWhere.setDataObjectInfo(str);
                if (that.dataObjectId && that._selectFunctionSelected && (that._count || that._selectFunctionSelected === Constants.SELECT || that._selectFunctionSelected === Constants.FIRST)) {
                    that.functionLabelDisplay = that._count ? that._selectFunctionSelected + '(' + that.dataObjectLabel + ',' + that._count + ')' :
                        that._selectFunctionSelected + '(' + that.dataObjectLabel + ')';
                    that.functionLabel = that._count ? that._selectFunctionSelected + '(' + that.dataObjectId + ',' + that._count + ')' :
                        that._selectFunctionSelected + '(' + that.dataObjectId + ')';
                    that.functionLabelField.setValue(that.functionLabelDisplay);
                    if ((that._selectFunctionSelected !== Constants.SELECT && that._count > 0) || (this.oModel.getData().selectionData[0].attributeSelected !==
                        "" &&
                        that._selectFunctionSelected ===
                        Constants.SELECT) || (that._selectFunctionSelected === Constants.FIRST && that.dataObjectId )) {
                        this.applyButton.setEnabled(true);
                    } else {
                        this.applyButton.setEnabled(false);
                    }
                    this.astExpressionBasicForWhere.setValue("");
                    this._whereExpressionId = "";
                    this.astExpressionBasicForWhere.setEditable(true);
                } else {
                    this.applyButton.setEnabled(false);
                    this.astExpressionBasicForWhere.setEditable(false);
                    this.astExpressionBasicForWhere.setValue("");
                    this.functionLabelField.setValue("");
                }
            }.bind(this)
        }).addStyleClass("sapAstExpressionDialogField");
        this.vocabularySelect.setModel(model);
        this.vocabularySelect.bindItems({
            path: "/terms",
            //sorter : new sap.ui.model.Sorter("lastName"),
            template: new sap.ui.core.ListItem({
                text: "{label}",
                key: "{id}"
            })
        });
        // Add Rules to the same path so that the dataobjects list contain rules as well
        var vocabularyRules = autoSuggestion.autoComplete.categories.vocabularyRules;
        for(var entry in vocabularyRules){
        	var item = new sap.ui.core.ListItem({
                text: vocabularyRules[entry].label,
                key: vocabularyRules[entry].id
            })
        	this.vocabularySelect.addItem(item);
        }
        

        return this.vocabularySelect;
    };

    SelectFunctionDialog.prototype._bindAttributes = function () {
        /*if (this.dataObjectId) {*/
        this.oModel = new sap.ui.model.json.JSONModel();
        this.oModel.setData({
            sortOrder: this.sortOrder,
            selectionData: this.selectedData,
            enabledData: this.enabledData,
            dataObjectIdData: this.dataObjectIdData
        });
        this.conditionsTable.setModel(this.oModel);
        /*} else {
            this.oModel = new sap.ui.model.json.JSONModel();
            this.oModel.setData({
                sortOrder: this.sortOrder,
                selectionData: this.selectedData,
                enabledData: this.enabledData,
                dataObjectIdData: this.dataObjectIdData
            });
            this.conditionsTable.setModel(this.oModel);
        }*/
    };
    SelectFunctionDialog.prototype._createWhereAstExpressionBasic = function () {
        var that = this;
        this.astExpressionBasicForWhere = new sap.rules.ui.AstExpressionBasic({
            astExpressionLanguage: this._oAstExpressionLanguage,
            enableAggregateFunctionWhereClause: true,
            value: this._whereExpressionId,
            editable: "{/value}",
            dataObjectInfo: this._setDataObjectInfoForWhereConditionAutoSuggestion(),
            change: function (oEvent) {
                that._whereExpressionId = oEvent.getParameter("newValue");
            }.bind(this)
        });
        this.astExpressionBasicForWhere.addStyleClass("sapAstExpressionDialog");
        return this.astExpressionBasicForWhere;
    };

    SelectFunctionDialog.prototype._setDataObjectInfoForWhereConditionAutoSuggestion = function () {
        if (this.dataObjectId) {
            var dataObjectId = this._returnDataObjectBasedOnCommonAssociationAndCardinality(this.dataObjectId, this._getSelectedAttributeJsons())
            return this._selectFunctionSelected + "(" + Constants.FILTER + "(" + dataObjectId + ",";

        }
    };
    SelectFunctionDialog.prototype._createFunctionLabel = function () {
        this.functionLabelField = new sap.m.TextArea({
            value: this.functionLabelDisplay,
            enabled: false,
            width: "100%"
        }).addStyleClass("sapAstExpressionDialogTextField");
        return this.functionLabelField;
    };

    SelectFunctionDialog.prototype._clearData = function () {
        this.functionLabelDisplay = "";
        this.functionLabel = "";
        this._selectFunctionSelected = "";
        this._whereExpressionId = "";
        this.dataObjectId = "";
        this._count = "";
        this.dataObjectLabel = "";
        this.dataObjectIdSelected = "";
        this.enableCountField = false;
        this.attributeJson = {};
        this.sortOrder = [ {
            name: Constants.NOSORT,
            label: this.oBundle.getText("no_sorting")
        },{
            name: Constants.SORTASC,
            label: this.oBundle.getText("sort_ascending")
        }, {
            name: Constants.SORTDESC,
            label: this.oBundle.getText("sort_descending")
        }];
        this.selectedData = [{
            attributeSelected: "",
            sortOrder: Constants.NOSORT,
            cancelButton: false,
            addButton: true
        }];

        this.enabledData = {
            enabled: false
        };
        this.dataObjectIdData = {
            dataObjectId: ""
        };
    }

    SelectFunctionDialog.prototype._createTable = function () {
        var that = this;
        this.conditionsTable = new sap.m.Table({
            backgroundDesign: sap.m.BackgroundDesign.Solid,
            showSeparators: sap.m.ListSeparators.None,
            layoutData: new sap.ui.layout.form.GridContainerData({
                halfGrid: false
            }),
            columns: [
                new sap.m.Column({
                    width: "50%"
                }).setStyleClass("sapAstAttributeColumn"),

                new sap.m.Column({
                    width: "25%"
                }).setStyleClass("sapAstSortColumn"),

                new sap.m.Column({
                    width: "20%"
                })
            ]
        }).addStyleClass("sapAstAttributeTable");

        this._bindAttributes();
        var itemTemplate = that._tableColumnsFactory();
        this.conditionsTable.bindItems("/selectionData", itemTemplate);

        return this.conditionsTable;
    };

    SelectFunctionDialog.prototype._createCountField = function (sAriaValue) {
        var that = this;
        this._countField = new sap.m.TextArea({
            value: that._count,
            enabled: this.enableCountField,
            ariaLabelledBy: sAriaValue,
            layoutData: new sap.ui.layout.GridData({
                span: "L1 M1 S1"
            }),
            change: function (oEvent) {
                that._count = oEvent.getSource().getValue();
                if (that.dataObjectId && that._selectFunctionSelected && (that._count || that._selectFunctionSelected === Constants.SELECT || that._selectFunctionSelected === Constants.FIRST)) {
                    that.functionLabelDisplay = that._count ? that._selectFunctionSelected + '(' + that.dataObjectLabel + ',' + that._count + ')' :
                        that._selectFunctionSelected + '(' + that.dataObjectLabel + ')';
                    that.functionLabel = that._count ? that._selectFunctionSelected + '(' + that.dataObjectId + ',' + that._count + ')' :
                        that._selectFunctionSelected + '(' + that.dataObjectId + ')';
                    that.functionLabelField.setValue(that.functionLabelDisplay);
                    if ((that._selectFunctionSelected !== Constants.SELECT && that._count > 0) || (this.oModel.getData().selectionData[0].attributeSelected !==
                        "" &&
                        that._selectFunctionSelected ===
                        Constants.SELECT) || (that._selectFunctionSelected === Constants.FIRST && that.dataObjectId )) {
                        this.applyButton.setEnabled(true);
                    } else {
                        this.applyButton.setEnabled(false);
                    }
                    this.astExpressionBasicForWhere.setEditable(true);
                } else {
                    this.applyButton.setEnabled(false);
                    this.astExpressionBasicForWhere.setEditable(false);
                    this.astExpressionBasicForWhere.setValue("");
                    this.functionLabelField.setValue("");
                }
            }.bind(this)
        }).addStyleClass("sapAstSelectCountField sapAstExpressionDialogTextField");
        return this._countField;
    };

    SelectFunctionDialog.prototype._convertFunctionLabelToText = function (dataObject, functionLabel) {
        this.termsProvider = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
        var objectFromReference = this.termsProvider.getTermNameFromASTNodeReference(dataObject);
        functionLabel = functionLabel.replace(dataObject, objectFromReference);
        return functionLabel
    };
    SelectFunctionDialog.prototype._createSelectFunctionDialog = function (data, callBack, AstExpressionLanguage, dialogOpenedCallbackReference, jsonData) {
        var that = this;
        var sequence = 0;
        this._clearData();
        this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
        this._oAstExpressionLanguage = AstExpressionLanguage;
        if (jsonData) {
            this._selectFunctionSelected = jsonData.function;
            this._whereExpressionId = jsonData.filter;
            this.dataObjectId = jsonData.dataObject;
            this.functionLabel = jsonData.functionLabel;
            this.dataObjectIdSelected = jsonData.dataObject.replace("/", "");
            this.attributeJson = jsonData.attributes;
            if (jsonData.count) {
                this._count = jsonData.count;
                this.enableCountField = true;
            }
            that.functionLabelDisplay = this._convertFunctionLabelToText(jsonData.dataObject, jsonData.functionLabel);;
            if (this.dataObjectId) {
                var dataObjectAssociationInfo = this._returnDataObjectBasedOnCommonAssociationSelection(jsonData.doVocabId, jsonData.attributes);
                this.attributeJson = this._addAssociationIdFromAttribute(jsonData.attributes, dataObjectAssociationInfo, this.dataObjectId);
                this.dataObjectIdData.dataObjectId = this.dataObjectId;
                this.enabledData.enabled = true;
                this.termsProvider = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
                this.dataObjectLabel = this.termsProvider.getTermNameFromASTNodeReference(this.dataObjectId);
            }
            if (!jQuery.isEmptyObject(this.attributeJson)) {
                this.selectedData = [];
                for (var key in this.attributeJson) {
                    var newjson = {
                        attributeSelected: "",
                        sortOrder: Constants.NOSORT,
                        cancelButton: true,
                        addButton: true,
                    }
                    newjson.attributeSelected = key;
                    newjson.sortOrder = this.attributeJson[key];
                    this.selectedData.push(newjson);
                    sequence++;
                }
                if (sequence === 1) {
                    this.selectedData[0].cancelButton = false;
                }
            }
            if (this._selectFunctionSelected === Constants.SELECT) {
                this.enableCountField = false;
            }

        }

        var functionSelect = that._createFunctionSelectionDropDown(data);
        var countText = new sap.m.Text({
            text: "Count",
            tooltip: "Count",
            textAlign: "End",
            layoutData: new sap.ui.layout.GridData({
                span: "L1 M1 S1"
            })
        });
        var oVocabularyText = new sap.m.Text({
            text: that.oBundle.getText("vocabulary"),
            tooltip: that.oBundle.getText("vocabulary"),
            textAlign: "End",
            layoutData: new sap.ui.layout.GridData({
                span: "L2 M2 S2"
            })
        });
        var attributeTable = that._createTable();
        var oWhereControl = that._createWhereAstExpressionBasic();
        var oFunctionLabelControl = that._createFunctionLabel();

        var verticalLayoutForSelectFunction = new sap.ui.layout.form.SimpleForm({
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            editable: true,
            content: [
                new sap.m.Label({
                    text: that.oBundle.getText("function"),
                    tooltip: that.oBundle.getText("function"),
                    labelFor: functionSelect.getId()
                }), functionSelect,
                countText,
                that._createCountField(countText.getId()),
                oVocabularyText,
                that._createDataObjectDropDown(oVocabularyText.getId()),

                new sap.m.Label({
                    text: that.oBundle.getText("attributes"),
                    tooltip: that.oBundle.getText("attributes"),
                    labelFor: attributeTable.getId()
                }).addStyleClass("sapAstAttributeLabel"),
                attributeTable,
                new sap.m.Label({
                    text: that.oBundle.getText("where"),
                    tooltip: that.oBundle.getText("where"),
                    labelFor: oWhereControl.getId()
                }),
                oWhereControl,
                new sap.m.Label({
                    text: that.oBundle.getText("function_label"),
                    tooltip: that.oBundle.getText("function_label"),
                    labelFor: oFunctionLabelControl.getId()
                }),
                oFunctionLabelControl
            ]
        });

        var selectFunctionsDialog = new sap.m.Dialog({
            title: this.oBundle.getText("selectFunctionTitle"),
            contentWidth: "800px",
            showHeader: true,
            draggable: true,
            beforeClose: function () {
					dialogOpenedCallbackReference(false);
				},
            content: [verticalLayoutForSelectFunction],
            buttons: [
                this.applyButton = new sap.m.Button({
                    text: this.oBundle.getText("apply"),
					tooltip: this.oBundle.getText("applyChangesBtnTooltip"),
                    press: function (event) {
                        var selectFunctionData = that._createJson()
                        event.getSource().mProperties = {
                            value: that.functionLabel,
                            jsonData: selectFunctionData
                        };
                        callBack(event);
						that._setModal(false);
                        selectFunctionsDialog.close();
                        selectFunctionsDialog.destroy();
                    }
                }),
                new sap.m.Button({
                    text: this.oBundle.getText("cancel"),
					tooltip: this.oBundle.getText("cancelBtnTooltip"),
                    press: function (event) {
						that._setModal(false);
                        selectFunctionsDialog.close();
                        selectFunctionsDialog.destroy();
                    }
                })
            ]
        }).addStyleClass("sapUiSizeCompact");;
        that._setModal(true);
        selectFunctionsDialog.open();
    };
	
	SelectFunctionDialog.prototype._setModal = function (value) {
        var pop = sap.ui.getCore().byId("popover");
        if (pop) {
            pop.setModal(value);
        }
    };

    SelectFunctionDialog.prototype._getSelectedAttributeJsons = function () {
        var key = "";
        var value = "";
        var json = {};
        for (var iterator = 0; iterator < this.oModel.getData().selectionData.length; iterator++) {
            if (this.oModel.getData().selectionData[iterator].attributeSelected !== "") {
                key = this.oModel.getData().selectionData[iterator].attributeSelected;
                value = this.oModel.getData().selectionData[iterator].sortOrder;
                json[key] = value;
            }
        }
        return json;
    };

    SelectFunctionDialog.prototype._returnDataObjectBasedOnCommonAssociationSelection = function (sDataObject, attributes) {
        var shortestKey = "";
        var str = "";
        if (sDataObject && Object.keys(attributes).length !== 0 && attributes.constructor === Object) {
            var firstKey = Object.keys(attributes)[0];
            shortestKey = sDataObject + firstKey.replace(".", "");
            if (Object.keys(attributes).length > 1) {
                for (var key in attributes) {
                    str = sDataObject + key.replace(".", "");
                    var shortestKeyArray = shortestKey.split("/");
                    var strArray = str.split("/");
                    if (shortestKeyArray.length > 2 && strArray.length > 2) {
                        shortestKey = "";
                        for (var iterator = 1; iterator < (shortestKeyArray < strArray ? shortestKeyArray.length : strArray.length); iterator++) {
                            if (shortestKeyArray[iterator] === strArray[iterator]) {
                                shortestKey += "/" + shortestKeyArray[iterator];
                            }
                        }
                    }
                }
            } else {
                var shortestKeyArray = shortestKey.split("/");
                shortestKey = "";
                for (var iterator = 1; iterator < shortestKeyArray.length - 1; iterator++) {
                    shortestKey += "/" + shortestKeyArray[iterator];
                }
            }
 
            if (this._hasAssociationId(shortestKey)) {
                return shortestKey;
            }
        }
        if (!this.includes(sDataObject,"/")) {
            sDataObject = "/" + sDataObject;
        }
        return sDataObject;
    };
 
    SelectFunctionDialog.prototype._returnDataObjectBasedOnCommonAssociationAndCardinality = function (sDataObject, attributes) {
        var shortestKey = "";
        var str = "";
        if (sDataObject && Object.keys(attributes).length !== 0 && attributes.constructor === Object) {
            var firstKey = Object.keys(attributes)[0];
            shortestKey = sDataObject + firstKey.replace(".", "");
            if (Object.keys(attributes).length > 1) {
                for (var key in attributes) {
                    str = sDataObject + key.replace(".", "");
                    var shortestKeyArray = shortestKey.split("/");
                    var strArray = str.split("/");
                    if (shortestKeyArray.length > 2 && strArray.length > 2) {
                        shortestKey = "";
                        for (var iterator = 1; iterator < (shortestKeyArray < strArray ? shortestKeyArray.length : strArray.length); iterator++) {
                            if (shortestKeyArray[iterator] === strArray[iterator]) {
                                shortestKey += "/" + shortestKeyArray[iterator];
                            }
                        }
                    }
                }
            } else {
                var shortestKeyArray = shortestKey.split("/");
                shortestKey = "";
                for (var iterator = 1; iterator < shortestKeyArray.length - 1; iterator++) {
                    shortestKey += "/" + shortestKeyArray[iterator];
                }
            }
            if (this._hasAssociationId(shortestKey)) {
                return this._returnDataObjectBasedOnCardinality(shortestKey);
            }
        }
        return sDataObject;
    };
 
    SelectFunctionDialog.prototype._returnDataObjectBasedOnCardinality = function (vocabId) {
        var vocabularyId = vocabId;
        if (vocabularyId) {
            var aSplitArray = vocabularyId.split("/");
            var str = aSplitArray[1];
            var index = 0;
            var term;
            var association = "";
            if (aSplitArray.length > 2) {
                for (var iterator = 2; iterator < aSplitArray.length; iterator++) {
                    str += "." + aSplitArray[iterator];
                    term = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(str);
                    if (term && term._dataObjectType === "AO" && term._cardinality === "1..n") {
                        index = iterator;
                    }
                }
                if (index > 0) {
                    for (var iterator = 1; iterator <= index; iterator++) {
                        association += "/" + aSplitArray[iterator];
                    }
                }
            }
            if (association) {
                return association;
            } else {
                return "/" + aSplitArray[1];
            }
        }
    };
 
    SelectFunctionDialog.prototype._hasAssociationId = function (vocabId) {
        var vocabularyId = vocabId;
        if (vocabularyId) {
            var splitArray = vocabularyId.split("/");
            var vocabulary = splitArray[1];
            if (splitArray.length > 2) {
                for (var iterator = 2; iterator < splitArray.length; iterator++) {
                    vocabulary += "." + splitArray[iterator];
                }
            }
            if (this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(vocabulary) && this._oAstExpressionLanguage
                ._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(vocabulary)._dataObjectType ===
                "AO") {
                return true;
            }
        }
        return false;
    };
 
    SelectFunctionDialog.prototype._returnAssociationForAttributesBasedOnCardinality = function (associationInfo) {
        if (associationInfo) {
            var aSplitArray = associationInfo.split("/");
            var str = aSplitArray[1];
            var index = 0;
            var term;
            var association = "";
            if (aSplitArray.length > 2) {
                for (var iterator = 2; iterator < aSplitArray.length; iterator++) {
                    str += "." + aSplitArray[iterator];
                    term = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(str);
                    if (term && term._dataObjectType === "AO" && term._cardinality === "1..n") {
                        index = iterator;
                    }
                }
                if (index > 0) {
                    for (var iterator = 2; iterator <= index; iterator++) {
                        association += "/" + aSplitArray[iterator];
                    }
                }
            }
            return association;
        }
    };
 
    SelectFunctionDialog.prototype._addAssociationIdToWhere = function (whereExpressionId, associationId) {
        var expressionID = "";
        var aId;
        if (whereExpressionId) {
            aId = whereExpressionId.split(" ");
            for (var iterator = 0; iterator < aId.length; iterator++) {
                if (aId[iterator].indexOf("./") !== -1) {
                    aId[iterator] = "." + aId[iterator].replace(/\./, associationId)
                }
                expressionID += aId[iterator] + " ";
            }
            return expressionID.trim();
        }
        return whereExpressionId;
    };
 
    SelectFunctionDialog.prototype._removeAssociationIdFromAttribute = function (attributeJson, dataObjectAssociationInfo, sDataObjectInfo) {
        var expressionID = "";
        var aId;
        var newattributeJson = {};
        var associationId = this._returnAssociationForAttributesBasedOnCardinality(dataObjectAssociationInfo);
        if (sDataObjectInfo && Object.keys(attributeJson).length !== 0 && attributeJson.constructor === Object && associationId) {
            var keys = Object.keys(attributeJson);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                var value = attributeJson[key];
                key = key.replace(associationId, "");
                newattributeJson[key] = value;
            }
            return newattributeJson;
        }
        return attributeJson
    };
 
    SelectFunctionDialog.prototype._removeAssociationIdToWhere = function (whereExpressionId) {
        var expressionID = "";
        var aId;
        if (whereExpressionId) {
            aId = whereExpressionId.split(" ");
            for (var iterator = 0; iterator < aId.length; iterator++) {
                if (aId[iterator].indexOf("./") !== -1) {
                    var aSplitArray = aId[iterator].split("/");
                    aId[iterator] = "./" + aSplitArray[aSplitArray.length - 1];
                }
                expressionID += aId[iterator] + " ";
            }
            return expressionID.trim();
        }
        return whereExpressionId;
    };
 
    SelectFunctionDialog.prototype._addAssociationIdFromAttribute = function (attributeJson, dataObjectAssociationInfo, sDataObjectInfo) {
        var expressionID = "";
        var aId;
        var newattributeJson = {};
        var associationId = this._returnAssociationForAttributesBasedOnCardinality(dataObjectAssociationInfo);
        if (sDataObjectInfo && Object.keys(attributeJson).length !== 0 && attributeJson.constructor === Object && associationId) {
            var keys = Object.keys(attributeJson);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                var value = attributeJson[key];
                key = "." + key.replace(/\./, associationId);
                newattributeJson[key] = value;
            }
            return newattributeJson;
        }
        return attributeJson
    };
    
    SelectFunctionDialog.prototype._createJson = function () {
        var attributeJson = this._getSelectedAttributeJsons();
        var whereExpressionId = this._whereExpressionId;
        var dataObjectAssociationInfo = this._returnDataObjectBasedOnCommonAssociationSelection(this.dataObjectId, attributeJson)
        var doVocaId = this._returnDataObjectBasedOnCommonAssociationAndCardinality(this.dataObjectId, attributeJson);
        attributeJson = this._removeAssociationIdFromAttribute(attributeJson, dataObjectAssociationInfo, this.dataObjectId);
        var json = {
            "function": this._selectFunctionSelected,
            "filter": whereExpressionId,
            "functionLabel": this.functionLabel,
            "dataObject": this.dataObjectId,
            "attributes": attributeJson,
            "doVocabId": doVocaId
        }

        if (this._count) {
            json["count"] = this._count;
        }

        return json;
    };
    
    SelectFunctionDialog.prototype.includes = function (parent, str) {
			var returnValue = false;
	
			if (parent.indexOf(str) !== -1) {
				returnValue = true;
			}
			
			return returnValue;
	};

    return {

        getInstance: function () {
            instance = new SelectFunctionDialog();
            return instance;
        }
    };
}, true);