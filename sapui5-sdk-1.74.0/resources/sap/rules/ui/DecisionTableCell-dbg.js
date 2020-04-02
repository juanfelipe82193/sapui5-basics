/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.DecisionTableCell.
sap.ui.define([
        "jquery.sap.global",
        "./library",
        "sap/rules/ui/DecisionTableCellExpressionAdvanced",
        "sap/rules/ui/type/DecisionTableCell",
        "sap/rules/ui/DecisionTableCellExpressionBasic",
        "sap/m/Popover",
        "sap/rules/ui/Constants",
        "sap/rules/ui/ast/constants/Constants",
        "sap/rules/ui/services/AstExpressionLanguage",
        "sap/rules/ui/ast/util/AstUtil",
        "sap/ui/core/LocaleData"
    ],
    function (jQuery, library, DecisionTableCellExpressionAdvanced, DecisionTableCellFormatter, DecisionTableCellExpressionBasic, Popover,
        Constants, ConstantUtils, AstExpressionLanguage, AstUtil, LocaleData) {
        "use strict";

        /**
         * Constructor for a new DecisionTableCellExpressionAdvanced sap.rules.ui.DecisionTableCell.
         *
         * @param {string} [sId] id for the new control, generated automatically if no id is given
         * @param {object} [mSettings] initial settings for the new control
         *
         * @class
         * Some class description goes here.
         * @extends  sap.ui.core.Control
         *
         * @author SAP SE
         * @version 1.74.0
         *
         * @constructor
         * @public
         * @alias sap.rules.ui.DecisionTableCellExpressionAdvanced
         * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
         */
        var DecisionTableCell = sap.ui.core.Control.extend("sap.rules.ui.DecisionTableCell", {
            metadata: {
                library: "sap.rules.ui",
                properties: {
                    /**
                     * Defines the value of the control.
                     */
                    valuePath: {
                        type: "string",
                        defaultValue: "",
                        bindable: "bindable"
                    },
                    /**
                     * Defines the valueOnly of the control.
                     */
                    valueOnlyPath: {
                        type: "string",
                        defaultValue: "",
                        bindable: "bindable"
                    },
                    /**
                     * Defines the header value of the control.
                     */
                    headerValuePath: {
                        type: "string",
                        defaultValue: "",
                        bindable: "bindable"
                    },
                    /**
                     * Defines the fixed operator value of the control.
                     */
                    fixedOperatorPath: {
                        type: "string",
                        defaultValue: "",
                        bindable: "bindable"
                    },
                    /**
                     * The business data type of the expression (e.g. String, Number, Boolean).
                     * The default value <code>sap.rules.ui.ExpressionType.All</code> means that all valid business data types are permitted.
                     */
                    typePath: {
                        typePath: "string", // "sap.rules.ui.ExpressionType",
                        //defaultValue: sap.rules.ui.ExpressionType.All,
                        bindable: "bindable"
                    },
                    /**
                     * Defines the binding path to the value state of the cell such as Error.
                     */
                    valueStatePath: {
                        type: "string",
                        defaultValue: "null",
                        bindable: "bindable"
                    },
                    /**
                     * Defines the binding path to the text that appears in the value state message pop-up.
                     */
                    valueStateTextPath: {
                        type: "string",
                        defaultValue: "null",
                        bindable: "bindable"
                    },
                    /**
                     * Defines the name of the value model - which contains the cell value when focus-in (ODataModel)
                     */
                    valueModelName: {
                        type: "string",
                        defaultValue: "",
                        bindable: "bindable"
                    },
                    /**
                     * Defines the name of the display model - which contains the cell value when focus-out
                     */
                    displayModelName: {
                        type: "string",
                        defaultValue: "",
                        bindable: "bindable"
                    },
                    /**
                     * Defines whether the control can be modified by the user or not.
                     * <b>Note:<b> A user can tab to a non-editable control, highlight it, and copy the text from it.
                     */
                    editable: {
                        type: "boolean",
                        defaultValue: true
                    },
                    inFocus: {
                        type: "boolean",
                        defaultValue: false
                    },
                    /**
                     * Define the DecisionTableCell type/formatter.
                     */
                    decisionTableCellType: {
                        type: "sap.rules.ui.type.DecisionTableCell",
                        multiple: false
                    },
                    /**
                     * Defines the value of the RuleFormat.
                     */
                    ruleFormatPath: {
                        type: "string",
                        defaultValue: "null",
                        bindable: "bindable"
                    },
                    /**
                     * Defines the value of the DecisionTableFormat.
                     */
                    decisionTableFormat: {
                        type: "sap.rules.ui.DecisionTableFormat",
                        defaultValue: sap.rules.ui.DecisionTableFormat.CellFormat
                    },
                    /**
                     * Contains the key properties of cell : RowId,ColId,RuleId, Version needed for binding context
                     */
                    keyProperties: {
                        type: "object",
                        defaultValue: "{}"
                    },

                    /**
                     * Defines the value of the Header Attribute Info.
                     */
                    attributeInfoPath: {
                        type: "string",
                        defaultValue: null,
                        bindable: "bindable"
                    },
                    /**
                     * Defines the value of the Header Attribute Name.
                     */
                    attributeNamePath: {
                        type: "string",
                        defaultValue: null,
                        bindable: "bindable"
                    },
                    //Setting to object since any businessdatatype can be supported
                    headerInfo: {
                        type: "object",
                        defaultValue: {}
                    }
                },
                aggregations: {
                    // A hidden text area is provided for the codemirror rendering.
                    _displayedControl: {
                        type: "sap.ui.core.Control",
                        multiple: false,
                        visibility: "hidden"
                    }
                },
                associations: {
                    /**
                     * Association to the expression language element.
                     */
                    expressionLanguage: {
                        type: "sap.rules.ui.services.ExpressionLanguage",
                        multiple: false,
                        validateOnLoad: true,
                        singularName: "expressionLanguage"
                    },
                    astExpressionLanguage: {
                        type: "sap.rules.ui.services.AstExpressionLanguage",
                        multiple: false,
                        singularName: "astExpressionLanguage"
                    }
                }
            }
        });

        DecisionTableCell.prototype._addNodeObject = function (astNode) {
            var oNodeArray = [];
            var oAstExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
            var oAstUtil = oAstExpressionLanguage._astBunldeInstance.ASTUtil;

            var updatedAstNode = [];
            updatedAstNode.Root = astNode.Root;
            updatedAstNode.SequenceNumber = astNode.Sequence;
            updatedAstNode.ParentId = astNode.ParentId;
            updatedAstNode.Reference = astNode.Reference;
            updatedAstNode.Id = astNode.NodeId;
            updatedAstNode.Type = astNode.Type;
            updatedAstNode.Value = astNode.Value ? astNode.Value : "";
			if (astNode.Type === "I") {
                updatedAstNode.Value = astNode.IncompleteExpression;
            }
            if (astNode.Function) {
                updatedAstNode.Function = astNode.Function;
            }
            if (astNode.Type !== "P" && !astNode.Function) {
                var Output = [];
                Output.BusinessDataType = astNode.Output ? astNode.Output.BusinessDataType : astNode.BusinessDataType;
                Output.DataObjectType = astNode.Output ? astNode.Output.DataObjectType : astNode.DataObjectType;
                updatedAstNode.Output = Output;
            }
            oAstUtil.createNode(updatedAstNode);
        };

        DecisionTableCell.prototype._bindPopOverFragment = function (oExpressionEditor) {
            var that = this;
            var displayValuePath = (this.getExpressionLanguage() && this.getDisplayModelName()) ? this.getDisplayModelName() + ">" + this.getValuePath() :
                this.getValuePath();
            var valuePath = this.getValueModelName() ? this.getValueModelName() + ">" + this.getValuePath() : this.getValuePath();
            var displayHeaderPath = (this.getExpressionLanguage() && this.getDisplayModelName()) ? this.getDisplayModelName() + ">" + this.getHeaderValuePath() :
                this.getHeaderValuePath();
            var displayFixedOperatorPath = (this.getExpressionLanguage() && this.getDisplayModelName()) ? this.getDisplayModelName() + ">" + this.getFixedOperatorPath() :
                this.getFixedOperatorPath();
			var sFixedOperator = this.getModel().getProperty(this.getFixedOperatorPath());
            var oInputControl = this.getAggregation("_displayedControl");
            if (valuePath && valuePath !== "null") {
                if (!this.getTypePath()) {
                    if (this.getAstExpressionLanguage()) {
                        oExpressionEditor.setHeaderInfo(this.getHeaderInfo());
                        oExpressionEditor.markerString = this._getMarkerString().trim();
                        var displayValue = "";
                        sFixedOperator = this.astUtil._getCapitalOperatorName(sFixedOperator);
						if (oInputControl.relString) {
							if (this.includes(oInputControl.relString,oExpressionEditor.markerString)) {
								displayValue = oInputControl.relString.replace(oExpressionEditor.markerString, "");
							}  else {
								displayValue = oInputControl.relString;
							}
						}
						if (displayValue.startsWith(sFixedOperator + " ")) {
							displayValue = displayValue.split(sFixedOperator + " ")[1];
						}
                        var jsonData = oInputControl.JSON;
                        oExpressionEditor.setValue(displayValue);
                        oExpressionEditor.setJsonData(jsonData);
						oExpressionEditor.setValueState(oInputControl.getValueState());
                    } else {
                        oExpressionEditor.bindValue({
                            parts: [{
                                path: displayHeaderPath
                            }, {
                                path: displayFixedOperatorPath
                            }, {
                                path: valuePath
                            }, {
                                path: displayValuePath
                            }],
                            type: this.getDecisionTableCellType()
                        });
                    }

                } else {
                    if (this.getAstExpressionLanguage()) {
                        oExpressionEditor.setAttributeInfo(this.getAttributeInfoPath());
                        oExpressionEditor.setValue(oInputControl.relString);
                        oExpressionEditor.setJsonData(oInputControl.JSON);
						oExpressionEditor.setValueState(oInputControl.getValueState());
                    } else {
                        oExpressionEditor.bindValue({
                            parts: [{
                                path: valuePath
                            }, {
                                path: this.getTypePath()
                            }, {
                                path: displayValuePath
                            }],
                            type: this.getDecisionTableCellType()
                        });
						if (this.getTypePath()) {
							oExpressionEditor.bindType(this.getTypePath());
						}
                    }
                }
            }
            
            

            if (displayHeaderPath) {
                oExpressionEditor.bindHeaderValue(displayHeaderPath);
                if (displayFixedOperatorPath) {
                    oExpressionEditor.bindFixedOperator(displayFixedOperatorPath);
                }
            }

            if ("getAttributeInfo" in oExpressionEditor && this.getAttributeInfoPath() && this.getExpressionLanguage()) {
                oExpressionEditor.bindAttributeInfo(this.getAttributeInfoPath());
            }

            if ("getAttributeName" in oExpressionEditor && this.getAttributeNamePath()) {
                oExpressionEditor.bindAttributeName(this.getAttributeNamePath());
            }
        };

        DecisionTableCell.prototype._createStaticControl = function () {
            var that = this;
            var bEditable = this.getModel("dtModel").getProperty("/editable");
	        var sFixedOperator = this.getModel().getProperty(this.getFixedOperatorPath());
            var sOperator = this.getAstExpressionLanguage() ? this.astUtil._getCapitalOperatorName(sFixedOperator) : sFixedOperator;
            var oDisplayedControl = this.getAggregation("_displayedControl");
            if (oDisplayedControl) {
                oDisplayedControl.destroy();
            }
            oDisplayedControl = new sap.m.Input({
                editable: false,
                enabled: bEditable
            });

            oDisplayedControl.addDelegate({
                onclick: function (oEvent) {
                    if (bEditable) { //RB in edit mode
                        this.onFocusIn();
                    }
                }.bind(this),
                onkeyup: function (oEvent) {
                    if (oEvent.keyCode === 13 && bEditable) { //user press enter and RB in edit mode
                        this.onFocusIn();
                    } else {
                        return;
                    }
                }.bind(this)
            });

            var valuePath = this.getValuePath();
            var expression;
            var sPath = "/" + valuePath.split("/")[1];
            var oCellContext = new sap.ui.model.Context(this.getModel(), sPath);
            if (this.getExpressionLanguage()) {
                valuePath = this.getDisplayModelName() + ">" + valuePath;
            }
            if (valuePath && valuePath !== "null") {
                var bCondition = this.getTypePath() ? false : true;
                var fillerString = "";
                if (bCondition && this.getAstExpressionLanguage()) {
                  fillerString = this._getMarkerString();
                }
                oDisplayedControl.bindValue({
                    path: valuePath,
                    formatter: function (sValue) {
			if (that.getAstExpressionLanguage()) {
				var astExpression = that._getExpressionFromAstNodes(oCellContext, true);
				if (astExpression && bCondition) {
					if (fillerString !== "" && that.includes(astExpression,fillerString)) {
						return astExpression.split(fillerString)[1];
					} else if (astExpression.startsWith(sOperator + " ")) {
						return astExpression.split(sOperator + " ")[1];
					} else {
						return astExpression;
					}
				} else {
					return astExpression;
				}
			} else {
				return sValue;
			}
		    }
                });
                oDisplayedControl.bindProperty("tooltip", {
                    path: valuePath,
                    formatter: function (sValue) {
			if (that.getAstExpressionLanguage()) {
				var astExpression = that._getExpressionFromAstNodes(oCellContext, true);
				if (astExpression && bCondition) {
					if (fillerString !== "" && that.includes(astExpression,fillerString)) {
						return astExpression.split(fillerString)[1];
					} else if (astExpression.startsWith(sOperator + " ")) {
						return astExpression.split(sOperator + " ")[1];
					} else {
						return astExpression;
					}
				} else {
					return astExpression;
				}
			} else {
				return sValue;
			}
		    }
                });
            }

            var valueStatePath = this.getValueStatePath();
            if (valueStatePath && valueStatePath !== "null" && !this.getAstExpressionLanguage()) {
                oDisplayedControl.bindProperty("valueState", {
                    path: valueStatePath,
                    formatter: function (sValue) {
                        var valueState = sap.ui.core.ValueState.None;
                        if (sValue === sap.ui.core.ValueState.Error) {
                            valueState = sap.ui.core.ValueState.Error;
                        }
                        return valueState;
                    }.bind(this)
                });
            }

            return oDisplayedControl;
        };

        DecisionTableCell.prototype._getLocaleData = function () {
            var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
            return LocaleData.getInstance(oLocale);
        };

        DecisionTableCell.prototype._getDateFormatter = function () {
            var oLocaleData = this._getLocaleData();
            var datePattern = oLocaleData.getDatePattern('medium');
            var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: datePattern
            });
            return dateFormatter;
        };

        DecisionTableCell.prototype._getDateTimeFormatter = function () {
            var oLocaleData = this._getLocaleData();
            var datePattern = oLocaleData.getDatePattern('medium');
            var timePattern = oLocaleData.getTimePattern('medium');
            var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: datePattern + " " + timePattern
            });
            return dateTimeFormatter;
        };

        DecisionTableCell.prototype._getExpressionFromAstNodes = function (oContext, bInputField) {
            var that = this;
            var oAstExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
            var termsProvider = oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
            var displayExpression = "";
            var displayTermExpression = "";
            var oDisplayModel = this.getModel("displayModel");
            var oModel = oContext.getModel();
            var sPath = oContext.getPath();
            var oData = oModel.getObject(sPath);
            var len = 0;
            var jsonLength = 0;
            var astList = oData ? oData.DecisionTableRowCellASTs : [];
            var oAstUtil = oAstExpressionLanguage._astBunldeInstance.ASTUtil;
            var aFunction = [ConstantUtils.AVG, ConstantUtils.SUM, ConstantUtils.COUNT, ConstantUtils.COUNTDISTINCT, ConstantUtils.DISTINCT,
                ConstantUtils.MIN, ConstantUtils.MAX, ConstantUtils.FILTER, ConstantUtils.TOP, ConstantUtils.BOTTOM, ConstantUtils.FIRST, ConstantUtils.SELECT, ConstantUtils.SORTASC, ConstantUtils.SORTDESC];
            oAstUtil.clearNodes();
            if (astList && astList.__list && astList.__list.length > 0) {
                astList = astList.__list;
                for (var entry in astList) {
                    this._addNodeObject(oContext.getObject("/" + astList[entry]));
                }
                var astNodes = oAstUtil.getNodes();
                if (bInputField) {
                    var dateFormat = this._getDateFormatter();
                    var timeFormat = this._getDateTimeFormatter();
                    displayExpression = oAstUtil.toAstExpressionStringForDt(astNodes, dateFormat, timeFormat);
                } else {
                    displayExpression = oAstUtil.toAstExpressionString(astNodes);
                }
                jsonLength = displayExpression.JSON.length;
                if(displayExpression && displayExpression.relString) {
                    displayExpression.relString = displayExpression.relString.replace(/\\/g,"\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
                }
                
                this.getAggregation("_displayedControl").relString = displayExpression ? displayExpression.relString : "";
                this.getAggregation("_displayedControl").shortRELString = displayExpression ? displayExpression.shortRELString : "";
                this.getAggregation("_displayedControl").JSON = displayExpression ? displayExpression.JSON : [];
                that.getAggregation("_displayedControl").displayString = displayExpression ? displayExpression.displayString : "";
                
				if (astNodes && astNodes[0].Type === "I" && astNodes[0].Value != "") {
                    this.getAggregation("_displayedControl").setValueState("Error");
                } else {
                    this.getAggregation("_displayedControl").setValueState("None");
                }
				
				var termsArray = displayExpression.shortRELString ? displayExpression.shortRELString.split(" ") : [];
				termsArray = displayExpression.displayString ? displayExpression.displayString.split(" ") : [];
                for (var term in termsArray) {
                    var referenceExpression = "";
                    if (termsArray[term].startsWith("./") || termsArray[term].startsWith("/") && !that.includes(termsArray[term],Constants.MARKER_STRING)) {
                        referenceExpression = termsProvider.getTermNameFromASTNodeReference(termsArray[term]);
                    }
                    if (referenceExpression !== "") {
                        displayTermExpression = displayTermExpression + " " + referenceExpression;
                    } else {
						if (that.includes(termsArray[term],"/" + Constants.MARKER_STRING)) {
                            termsArray[term] = termsArray[term].replace("/" + Constants.MARKER_STRING, "");
                        }
						if (this.getAggregation("_displayedControl").getValueState() === "Error" && that.includes(termsArray[term],"====")) {
                                termsArray[term] = termsArray[term].replace("====" , "");
                        }
                        if (that.includes(termsArray[term],Constants.MARKER_STRING)) {
                            termsArray[term] = termsArray[term].replace(Constants.MARKER_STRING, "");
                        }
                        
                        var splitArray = termsArray[term].split("(");
                        if(that.includes(aFunction,splitArray[0]) && len < jsonLength){
                            termsArray[term] = termsArray[term].replace(displayExpression.JSON[len].dataObject,
                            termsProvider.getTermNameFromASTNodeReference(displayExpression.JSON[len].dataObject)); 
                            len++;
                        }
                        displayTermExpression = displayTermExpression + " " + termsArray[term];
                    }
                }
                if (displayTermExpression != "") {
                    displayExpression = displayTermExpression.trim();
                }

            }
            return (displayExpression instanceof Object ? displayExpression.shortRELString : displayExpression.trim());
        };
        
        DecisionTableCell.prototype._getMarkerString = function () {
		var markerString;
		var sHeaderInfo = this.getHeaderInfo().headerValue;
		if (sHeaderInfo === undefined || sHeaderInfo.trim() === "") {
			return "";
		}
		var sValue = sHeaderInfo.split(" ");
		var lastString = sValue[sValue.length - 1] !== "" ? sValue[sValue.length - 1] : sValue[sValue.length - 2];
		var oOperators = ["=", "!=", ">", ">=", "<", "<=", "IN", "NOTIN", "EXISTSIN", "NOTEXISTSIN", "MATCHES", "NOTMATCHES",
		    "CONTAINS", "NOTCONTAINS", "STARTSWITH", "NOTSTARTSWITH", "ENDSWITH", "NOTENDSWITH", "ISWITHIN", "ISNOTWITHIN", "+", "-", "/", "*"
		];
        var oLogicalOperators = ["AND", "OR"];
        if (oLogicalOperators.indexOf(lastString) > -1) {
            markerString = "";
        } else	if (oOperators.indexOf(lastString) > -1) {
			markerString = "/" + Constants.MARKER_STRING + " ==== ";
		} else {
			markerString = "/" + Constants.MARKER_STRING + " ";
		}
		return markerString;
        };

        DecisionTableCell.prototype._setDisplayedControl = function () {
            var oDisplayedControl = this._createStaticControl();
            this.setAggregation("_displayedControl", oDisplayedControl, true);
        };

        DecisionTableCell.prototype.init = function () {
            this.astUtil = new AstUtil();
	         this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
        };

        DecisionTableCell.prototype.onAfterRendering = function () {
			this.bColumnResized = false;
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("sap.ui.rules","_onColumnResized",this._setColumnResized,this);
		};

        DecisionTableCell.prototype.onBeforeRendering = function () {
            var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribeOnce("sap.ui.rules","_onColumnResized",this._setColumnResized,this);
			if (!this.bColumnResized) {
        		this._setDisplayedControl();
        	}
        };
        
        DecisionTableCell.prototype._setColumnResized = function (oEvent, oData) {
            this.bColumnResized = true;
        };

        DecisionTableCell.prototype.onFocusIn = function () {
            var fnAfterPopOverOpen = function (oEvent) {
                var oDecisionTableCellExpression = oEvent.getSource().getAggregation('content')[1];
                oDecisionTableCellExpression.setVisible(true);
                var oDisplayedControl = this.getAggregation("_displayedControl");
                oDisplayedControl.setEnabled(false);
            }.bind(this);
            var fnBeforePopOverClose = function (oEvent) {
                var oDisplayedControl = this.getAggregation("_displayedControl");
                oDisplayedControl.setEnabled(true);
            }.bind(this);
            var fnAfterPopOverClose = function (oEvent) {
                if (this._oPopover) {
                    var oDecisionTableCellExpression = this._oPopover.getAggregation('content')[1];
                    if (oDecisionTableCellExpression instanceof sap.rules.ui.ExpressionAdvanced) { //after choose hint popover close, we fix it with focus in DecisionTableCellExpressionAdvanced so we need to copy the value from the code mirror to the expression advanced value
                        if (oDecisionTableCellExpression.codeMirror) {
                            var sExpression = oDecisionTableCellExpression.codeMirror.getValue();
                            oDecisionTableCellExpression.setValue(sExpression);
                        }
                    } else if (oDecisionTableCellExpression instanceof sap.rules.ui.AstExpressionBasic) {
                        //While making changes in one cell and focusing into another cell, _fireChange is not called from
                        //AstExpressionBasic._handlePopupFocusOut
                        oDecisionTableCellExpression._fireChange(oDecisionTableCellExpression._input.text())
                    }
					
                    this._oPopover.destroy();
                    this._oPopover = null;
                    var oDisplayedControl = this.getAggregation("_displayedControl");
                    oDisplayedControl.focus(); //enable tab change between DT cells
                }
            }.bind(this);
            if (!this._oPopover) {
                var bValueOnly = this.getModel().getProperty(this.getValueOnlyPath());
                var sValueRuleFormat = this.getModel().getProperty(this.getRuleFormatPath());
                var sdecisionTableFormat = this.getDecisionTableFormat();
                //destroy if the popover is not destroyed during close of popover.
                if (sap.ui.getCore().byId("popover")) {
                    sap.ui.getCore().byId("popover").destroy();
                }
                // when the decisionTableFormat is set to type sap.rules.ui.DecisionTableFormat.RuleFormat then we Render the cells based on the
                // Rule Format
                if (this.getAstExpressionLanguage()) {
                    this._oPopover = sap.ui.xmlfragment("sap.rules.ui.fragments.DecisionTableCellAstExpressionBasic", this);
		    this._oPopover.setTooltip(this.oBundle.getText("ctrlSpaceCue"));
                    var oDecisionTableCellExpression = this._oPopover.getAggregation('content')[1];
                    oDecisionTableCellExpression.setAstExpressionLanguage(this.getAstExpressionLanguage());
                    oDecisionTableCellExpression.attachChange(sap.rules.ui.DecisionTableCellAstExpressionBasic.prototype._changeValue);
                } else {
                    if (sdecisionTableFormat === sap.rules.ui.DecisionTableFormat.RuleFormat) {
                        if (sValueRuleFormat.toUpperCase() === sap.rules.ui.RuleFormat.Advanced) {
                            this._oPopover = sap.ui.xmlfragment("sap.rules.ui.fragments.DecisionTableCellExpressionAdvanced", this);
                        } else {
                            this._oPopover = sap.ui.xmlfragment("sap.rules.ui.fragments.DecisionTableCellExpressionBasic", this);
                        }
                    } else if (bValueOnly) { // When the decisionTableFormat is set to the default value or pf type
                        // sap.rules.ui.DecisionTableFormat.RuleFormat then we render the cells based on ValueOnly
                        this._oPopover = sap.ui.xmlfragment("sap.rules.ui.fragments.DecisionTableCellExpressionBasic", this);
                    } else {
                        this._oPopover = sap.ui.xmlfragment("sap.rules.ui.fragments.DecisionTableCellExpressionAdvanced", this);
                    }
                    var oDecisionTableCellExpression = this._oPopover.getAggregation('content')[1];
                    oDecisionTableCellExpression.setExpressionLanguage(this.getExpressionLanguage());
                }

                this._oPopover.attachAfterOpen(fnAfterPopOverOpen);
                this._oPopover.attachBeforeClose(fnBeforePopOverClose);
                this._oPopover.attachAfterClose(fnAfterPopOverClose);
                this.addDependent(this._oPopover);

                var num = jQuery.sap.byId(this.getId()).closest('td').width() * 0.93;
                var sWidth = num + "px";
                var oScrollContainer = this._oPopover.getAggregation('content')[0];
                oScrollContainer.setWidth(sWidth);

                if (this.getModel("settingModel") && this.getModel("settingModel").oData) {
                    oDecisionTableCellExpression.resultDataObjectId = this.getModel("settingModel").oData.ResultDataObjectId;
                    oDecisionTableCellExpression.resultDataObjectName = this.getModel("settingModel").oData.ResultDataObjectName;
                }

                this._bindPopOverFragment(oDecisionTableCellExpression);
                var oInput = this.getAggregation("_displayedControl");
                this._oPopover.openBy(oInput);
            }
        };
        
		DecisionTableCell.prototype.includes = function (parent, str) {
			var returnValue = false;
	
			if (parent.indexOf(str) !== -1) {
				returnValue = true;
			}
			
			return returnValue;
		};        

        return DecisionTableCell;

    }, /* bExport= */ true);
