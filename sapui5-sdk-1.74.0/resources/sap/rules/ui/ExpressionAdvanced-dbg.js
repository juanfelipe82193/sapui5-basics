/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides the sap.rules.ui.ExpressionAdvanced control
sap.ui.define([
	"sap/m/Dialog",
	"sap/ui/core/Control",
	"sap/m/Button",
	"sap/m/TextArea",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/ui/layout/HorizontalLayout",
	"sap/rules/ui/Utils",
	"sap/ui/core/Popup",
	"jquery.sap.global",
	"sap/rules/ui/ExpressionBase",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/rules/ui/providers/ValueHelpProvider",
	"sap/ui/core/LocaleData",
	"sap/rules/ui/Constants",
	"sap/rules/ui/codemirror/lib/codemirror",
	"sap/rules/ui/codemirror/addon/hint/show-hint",
	"sap/rules/ui/codemirror/mode/hdf/hdf",
	"sap/rules/ui/codemirror/addon/display/placeholder",
	"sap/rules/ui/codemirror/addon/mh/mark-selection",
	"sap/rules/ui/codemirror/addon/hint/hdf-hint",
	"sap/rules/ui/codemirror/addon/closeBrackets/closebrackets",
	"sap/rules/ui/codemirror/addon/search/search"
], function(Dialog, Control, Button, TextArea, Text, MessageBox, HorizontalLayout, Utils, Popup, jQ, ExpressionBase, MetadataAnalyser,
	ValueHelpProvider, LocaleData, Constants) {
	"use strict";
	/**
	 * Constructor for a new ExpressionAdvanced.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The <code>sap.rules.ui.ExpressionAdvanced</code> control provides the ability to define expressions for complex rules in a decision table.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.58.1
	 *
	 * @constructor
	 * @private
	 * @experimental Only for internal use.
	 *
	 * @alias sap.rules.ui.ExpressionAdvanced
	 * @ui5-metamodel This control also will be described in the UI5 (legacy) designtime metamodel
	 */

	var ExpressionAdvanced = ExpressionBase.extend("sap.rules.ui.ExpressionAdvanced", {

		metadata: {
			properties: {

				/**
				 * The business data type of the expression (e.g. String, Number, Boolean).
				 * The default value <code>sap.rules.ui.ExpressionType.All</code> means that all valid business data types are permitted.
				 */
				type: {
					type: "sap.rules.ui.ExpressionType",
					defaultValue: sap.rules.ui.ExpressionType.All,
					bindable: "bindable"
				},

				/**
				 * Defines weather the expression evaluates to a collection of values or to a single value.
				 */
				collection: {
					type: "boolean",
					defaultValue: false
				},

				/**
				 * Defines a short hint intended to aid the user with data entry when the control has no value.
				 */
				placeholder: {
					type: "string",
					defaultValue: null
				},

				/**
				 * Defines whether the focus is set to the control upon loading.
				 */
				focusOnLoad: {
					type: "boolean",
					defaultValue: false
				},

				attributeInfo: {
					type: "string",
					defaultValue: "",
					bindable: "bindable"
				}
			},
			aggregations: {

				// A hidden text area is provided for the codemirror rendering.
				_expressionArea: {
					type: "sap.m.TextArea",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {

				/**
				 * This event is fired when the text in the input field has changed and the focus leaves the input field or the enter key is pressed.
				 */
				"change": {},

				/**
				 * This event is fired when the value of the input is changed - e.g. at each keypress
				 */
				"liveChange": {},
				"valueHelpRequest": {
					parameters: {

						/**
						 * The event parameter is set to true, when the button at the end of the suggestion table is clicked, otherwise false. It can be used to determine whether the "value help" trigger or the "show all items" trigger has been pressed.
						 */
						fromSuggestions: {
							type: "boolean"
						}
					}
				}
			},
			publicMethosds: ["validate"]
		}
	});

	ExpressionAdvanced.prototype.init = function() {
		ExpressionBase.prototype.init.apply(this, arguments);
		var codeMirrorCSS = jQuery.sap.getModulePath("sap.rules.ui.codemirror.lib") + "/codemirror.css";
		var showHintCSS = jQuery.sap.getModulePath("sap.rules.ui.codemirror.addon.hint") + "/show-hint.css";
		jQuery.sap.includeStyleSheet(codeMirrorCSS);
		jQuery.sap.includeStyleSheet(showHintCSS);

		this.pop = new Popup(jQ('<span></span>')[0], false, false, false);
		this.errorWidgets = [];
		this.expressionTokens = [];
		this._liveValue = "";
		this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		this.dataModel = this.initControlDataModel();

		// Expression area
		this.oTextArea = new TextArea({
			width: "100%"
		});
		this.validationCompleteEvent = document.createEvent("Event");
		this.validationCompleteEvent.initEvent("validationCompleteEvent", true, false);
		//this.validationCompleteEvent = document.createEvent("validationCompleteEvent");
		this.setAggregation("_expressionArea", this.oTextArea, true);
		this.bFlagForEventListener = true;

		// Date instance which is used to convert the selected date from calendar control to short format
		var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
		var oLocaleData = LocaleData.getInstance(oLocale);

		this.oFormatDate = sap.ui.core.format.DateFormat.getInstance({
				pattern: oLocaleData.getDatePattern('short'),
				calendarType: sap.ui.core.CalendarType.Gregorian
			},
			oLocale
		);
		this._dateBusinessDataType = "Date";
		this._valueHelpSelectionText = "Select from value help...";
		this._hasValueSource = "HasValueSource";
		this._propertyValue = "Value";
		this._propertyDescription = "Description";
	};

	ExpressionAdvanced.prototype._processValidationResult = function(result) {
		if (result.status === sap.rules.ui.ValidationStatus.Error) {
			var msg = Utils.parseUTFToString(result.errorDetails /* || "unknown message"  */ );
			msg = msg.replace(/\r\n/g, " ").replace(/\r/g, " ").replace(/\n/g, " ");
			this.errorCursorPosition = result.cursorPosition;
			this.setValueStateText(msg);
			//this._showPopUp();
		} else {
			this.oTextArea.setValueState("None");
			this.oTextArea.setValueStateText("");
			this.setValueStateText("");
			jQuery(this.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner sapMInputBaseContentWrapper sapMInputBaseContentWrapperState sapMInputBaseContentWrapperError');
		}

	};

	ExpressionAdvanced.prototype.validateExpression = function(sInput) {
		for (var i = 0; i < this.errorWidgets.length; i++) {
			this.codeMirror.removeLineWidget(this.errorWidgets[i]);
		}
		this.errorWidgets = [];
		var expressionValue = this.codeMirror ? this.codeMirror.getValue() : this.getValue();
		var result = {};
		var incomingdata = {};
		var oEL = sap.ui.getCore().byId(this.getExpressionLanguage());
		if (oEL) {
			incomingdata = oEL.validateExpression(
				sInput || expressionValue,
				this.getProperty("type"),
				this.getCollection(),
				false
			);
			if (incomingdata && this.isActive()) {
				result = incomingdata;
				this._processValidationResult(result);
				if (result.deferredResult) {
					result.deferredResult.done(function(result) {
						this._processValidationResult(result);
						document.dispatchEvent(this.validationCompleteEvent);
					}.bind(this));
				}
			}
		}
		return incomingdata;
	};

	ExpressionAdvanced.prototype._showPopUp = function() {
		var errorState = "Error";
		var errorMessage = this.getProperty("valueStateText");
		var thisId = this.getId() + '-message';
		var pop = this.pop; //new Popup(jQ('<span></span>')[0], false, false, false);
		if (!this.pop) { //bug 4813
			return;
		}
		pop.attachClosed(function() {
			jQ.sap.byId(thisId).remove();
		});
		var dock = Popup.Dock;
		var cssClass = 'sapMInputBaseMessage' + errorState + ' sapMFocus';
		var T = 'sapMValueStateMessageError sapMText';
		var r = sap.ui.getCore().getLibraryResourceBundle('sap.m');

		if (errorState === sap.ui.core.ValueState.Success) {
			cssClass = 'sapUiInvisibleText';
			errorMessage = '';
		}
		var oContent = jQ('<div>', {
			'id': thisId,
			'class': cssClass,
			'role': 'tooltip',
			'aria-live': 'assertive'
		}).append(jQ('<span>', {
			'aria-hidden': true,
			'class': 'sapUiHidden',
			'text': r.getText('INPUTBASE_VALUE_STATE_' + errorState.toUpperCase())
		})).append(jQ('<span>', {
			'id': thisId + '-text',
			'class': T,
			'text': errorMessage
		}));
		pop.setContent(oContent[0]);
		pop.close(0);
		pop.open(0, dock.BeginTop, dock.BeginBottom, jQuery(this.codeMirror.getWrapperElement()), null, "none flip", true);
		var sPopUpWidth = this.pop.oContent.clientWidth;
		var oTextAreaHTMLElement = document.getElementById(this.getAggregation("_expressionArea"));
		if (!oTextAreaHTMLElement) {
			return;
		}
		var sExpressionAdvancedWidth = oTextAreaHTMLElement.sId.clientWidth;
		if (sPopUpWidth > sExpressionAdvancedWidth) {
			jQuery(".sapMText").css('width', sExpressionAdvancedWidth);
			jQuery(".sapMText").css('padding-left', '12px');
			jQuery(".sapMText").css('padding-right', '12px');
			jQuery(".sapMText").css('padding-top', '8px');
			jQuery(".sapMText").css('padding-bottom', '8px');
		}
	};

	ExpressionAdvanced.prototype._closePopUp = function() {
		if (this.pop) {
			this.pop.close(0);
		}
	};

	ExpressionAdvanced.prototype._showErrorMessage = function() {
		var errorMessage = this.getValueStateText();
		if (errorMessage && errorMessage !== "") {
			this._setExpressionErrorStyle();
		}
	};

	ExpressionAdvanced.prototype.initControlDataModel = function() {
		var oDataModel = new sap.ui.model.json.JSONModel();
		var data = {};
		oDataModel.setData(data);
		return oDataModel;
	};

	ExpressionAdvanced.prototype.setExpressionTokens = function(tokens) {
		var maxLineEnd = 0,
			newLineExist = false;
		this.expressionTokens = [];
		if (tokens instanceof Array) {
			for (var i = 0; i < tokens.length; i++) {
				var tokenMetaData = tokens[i];
				//minimize the number of cached tokens
				var newLineReg = /\n/;
				if (newLineReg.test(tokenMetaData.token)) {
					maxLineEnd = tokenMetaData.start + tokenMetaData.token.lastIndexOf('\n') + 1;
					newLineExist = true;
					continue;
				}
				if (newLineExist) {
					tokenMetaData.start = tokenMetaData.start - maxLineEnd;
					tokenMetaData.end = tokenMetaData.end - maxLineEnd + 1;
				} else {
					tokenMetaData.end = tokenMetaData.end + 1;
				}
				this.expressionTokens.push(tokenMetaData);
			}
		}
	};

	ExpressionAdvanced.prototype.getExpressionTokens = function() {
		return this.expressionTokens;
	};

	/** INTERFACE */

	ExpressionAdvanced.prototype.getValue = function() {
		if (this.codeMirror !== undefined) {
			return this.codeMirror.getValue();
		}
		return this.getProperty("value");
	};
	ExpressionAdvanced.prototype.setValue = function(value) {
		if (value === undefined || value === null) {
			value = "";
		}
		this._liveValue = value;
		this.oTextArea.setValue(value);
		if (this.getProperty("value") === value) {
			return;
		}
		this.setProperty("value", value, true);
		if (this.codeMirror !== undefined) {
			this.codeMirror.setValue(value);
		}
	};

	ExpressionAdvanced.prototype.setPlaceholder = function(value) {
		this.setProperty("placeholder", value);
		var modelValue = (this.getEditable()) ? value : "";
		this.dataModel.setProperty("/placeholder", modelValue);
	};

	ExpressionAdvanced.prototype.getPlaceholder = function() {
		return this.dataModel.getProperty("/placeholder");
	};

	ExpressionAdvanced.prototype.setValueStateText = function(message) {
		this.setProperty("valueStateText", message, true);
		if (message){
			this._showErrorMessage(message);
		} else {
			jQuery(this.codeMirror.getWrapperElement()).removeClass('CodeMirror-error');
			jQuery(this.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner sapMInputBaseContentWrapper sapMInputBaseContentWrapperState sapMInputBaseContentWrapperError');
		}
	};

	ExpressionAdvanced.prototype.setEditable = function(value) {
		this.setProperty("editable", value);
		this.getAggregation("_expressionArea").setProperty("editable", value);
		if (this.codeMirror) {
			jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-rules-Not-Editable');
		}
		// placeholder is relevant only for editable field
		var _placeholder = (value) ? this.getProperty("placeholder") : "";
		this.dataModel.setProperty("/placeholder", _placeholder);
		this.invalidate();
	};

	ExpressionAdvanced.prototype.setType = function(type) {
		if (type === Constants.DATE_BUSINESS_TYPE || type === Constants.TIMESTAMP_BUSINESS_TYPE || type === Constants.NUMBER || type ===
			Constants.STRING || type === Constants.BOOLEAN_BUSINESS_TYPE || type === Constants.BOOLEAN_ENHANCED_BUSINESS_TYPE) {
			this.setProperty("type", type);
		}
		
		if (this.codeMirror) {
			this.codeMirror.options.returnType = type;
		}
	};

	ExpressionAdvanced.prototype.setCollection = function(isCollection) {
		this.setProperty("collection", isCollection, true);
		if (this.codeMirror) {
			this.codeMirror.options.collection = isCollection;
		}
	};

	/* end INTERFACE section */

	/* Public methods section */

	/**
	 * validates the current value of the control.
	 * @internal
	 * @return {object}  [oResult] validation object.
	 */
	ExpressionAdvanced.prototype.validate = function() {
		return this.validateExpression();
	};

	ExpressionAdvanced.prototype.setFocusOnLoad = function(value) {
		this.dataModel.setProperty("/focus", value);
		this.setProperty("focusOnLoad", value, true);
	};

	ExpressionAdvanced.prototype.focus = function() {
		if (this.codeMirror) {
			var lastLine = this.codeMirror.getLine(this.codeMirror.lastLine());
			var cursorPos = lastLine.length;
			this.codeMirror.setCursor({
				line: this.codeMirror.lastLine(),
				ch: cursorPos
			});
			this.codeMirror.focus();
		}
	};

	ExpressionAdvanced.prototype.onAliasLinkPress = function(aliasName) {
		var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
		if (expressionLanguage) {
			expressionLanguage.onAliasLinkPress(aliasName);
			expressionLanguage.attachEvent("aliasDialogClosed", this.aliasClickCancel, this);
		}
	};

	ExpressionAdvanced.prototype.onCreateAliasLinkForText = function(text) {
		var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
		if (expressionLanguage) {
			expressionLanguage.attachEvent("aliasDialogClosed", this.replaceTextWithAlias, this);
			expressionLanguage.onCreateAliasLinkForText(text);
		}
	};

	ExpressionAdvanced.prototype.replaceTextWithAlias = function(oEvent) {
		if (oEvent.getParameter("isSave")) {
			this.codeMirror.replaceSelection(oEvent.getParameter("savedAliasName"));
		}
	};

	ExpressionAdvanced.prototype.aliasClickCancel = function(oEvent) {
		this.codeMirror.focus();
		this.codeMirror.execCommand("goLineEnd");
		this.fireDialog({
			dialogStatus: sap.rules.ui.ValueListDialogMode.Close
		});
	};

	ExpressionAdvanced.prototype.onAfterRendering = function() {

		this.timer = null;
		// needAutoComplete tells us whether an auto complete action is required.
		// we need it since we execute the popup opening in a delayed manner. sometimes it should not open (case 2):
		// case 1. press key -> ... -> delayed open of popup (need to open)
		// case 2. press key -> ... -> press Enter (to select form list) -> ... -> delayed open of popup (need not open)
		this.needAutoComplete = false;
		this.endCompletion = false;
		this._setCodeMirror();
		this._setEditorStyle();
		this._handleMousedown();
		this._handleChange();
		this._handleFocusLeave(); //blur
		this._handleEndCodeCompletion();
		this._handleKeyPress();
		this._handleEditableProperty();
		this._handleOnLoadValidation();
		this._refreshOnNavigationEnd();
		this._handleFocus();
		this._handleValueListSelect();
		this._handleCalendarChange();

		//bug RULES-4848\5031\5030 after choose value from auto complete - popover will not closed
		if (this.bFlagForEventListener) {
			this.bFlagForEventListener = false;
			this.fnMouseDownListsner = function(oEvent) {
				this.bFlagForChangeBeforeBlur = oEvent.target.className.indexOf("CodeMirror-hint") > -1;
			}.bind(this);

			this.fnBlurListsner = function(oEvent) {
				if (this.bFlagForChangeBeforeBlur) {
					this.bFlagForChangeBeforeBlur = false;
					oEvent.stopPropagation();
					this.codeMirror.focus();
				}
			}.bind(this);

			document.addEventListener("mousedown", this.fnMouseDownListsner, true);
			document.getElementById(this.getId()).addEventListener("blur", this.fnBlurListsner, true);
		}

	};

	// Event listerner for change date click event
	ExpressionAdvanced.prototype._handleCalendarChange = function() {
		var that = this;
		this.codeMirror.on('onChangeDate', function() {
			that._createCalendarDialog(that.codeMirror.getCursor());
		}.bind(this));
	};

	// Utility function to oprn calendate dialog
	ExpressionAdvanced.prototype._createCalendarDialog = function(curPos) {
		var bAddSpace = false;
		var that = this;

		var oCalendar = new sap.ui.unified.Calendar({
			width: "100%",
			select: this.handleCalendarSelect.bind(this)
		});

		this._oSelectNewDateDialog = new Dialog({
			title: this.oBundle.getText("calendarTitle"),
			content: [
				oCalendar
			],
			beginButton: new Button({
				text: this.oBundle.getText("okBtn"),
				enabled: false,
				press: function() {
					var date = this.updateText(oCalendar);
					that._updateModal(false);
					that.setTextOnCursor(date, curPos, false, this._dateBusinessDataType, bAddSpace, false);
					that._oSelectNewDateDialog.close();
					that.focus(that.codeMirror);
				}.bind(this)
			}),
			endButton: new Button({
				text: this.oBundle.getText("clsBtn"),
				press: function() {
					that._updateModal(false);
					that._oSelectNewDateDialog.close();
					that.focus(that.codeMirror);
				}.bind(this)
			})
		});

		this._oSelectNewDateDialog.open();

	};

	// Utility function to update Modal Property of modal
	ExpressionAdvanced.prototype._updateModal = function(modalValue) {
		var pop = sap.ui.getCore().byId("popover");
		if (pop) {
			pop.setModal(modalValue);
		}
	};

	// Utility function to set calendar enabled property
	ExpressionAdvanced.prototype.handleCalendarSelect = function(oEvent) {
		var oCalendar = oEvent.getSource(),
			oSelectedDate = oCalendar.getSelectedDates()[0].getStartDate();

		if (oSelectedDate) {
			this._oSelectNewDateDialog.getBeginButton().setEnabled(true);
		}
	};

	// Utility function to format date
	ExpressionAdvanced.prototype.updateText = function(oCalendar) {
		var aSelectedDates = oCalendar.getSelectedDates();
		var oDate;
		if (aSelectedDates.length > 0) {
			oDate = aSelectedDates[0].getStartDate();
			return this.oFormatDate.format(oDate);
		}
	};

	ExpressionAdvanced.prototype._raiseError = function(sError) {
		//handling a scenario when the callback or the model are invalid
		jQuery.sap.log.error(sError);
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		this.setValueStateText(oBundle.getText("valueHelpTechnicalError"));
		this._showPopUp();
	};

	/*
	 * Invoke this function once user select on 'Select value from list' suggestion
	 * This is listener to 'onValueListSelect' code mirror event/signal.
	 */
	ExpressionAdvanced.prototype._handleValueListSelect = function() {

		this.codeMirror.on('onValueListSelect', function() {
			var suggestions = this.codeMirror.currentHintData.data.listCompletion;
			var valueHelpInfo = [];
			for (var sugg = 0; sugg < suggestions.length; sugg++) {
				if (suggestions[sugg].text === this._valueHelpSelectionText) {
					valueHelpInfo = suggestions[sugg].info;
				}
			}
			var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
            valueHelpInfo.expressionLanguage = expressionLanguage;
			var callback = expressionLanguage.getValueHelpCallback();
			this.oTextArea.setValueState("None");
			this.oTextArea.setValueStateText("");
			this.setValueStateText("");
			jQuery(this.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner sapMInputBaseContentWrapper sapMInputBaseContentWrapperState sapMInputBaseContentWrapperError');
			if ((typeof callback) !== "function" && valueHelpInfo.metadata.hasOwnProperty(this._hasValueSource) && valueHelpInfo.metadata.HasValueSource ===
				true) {
				this._createCpValueHelp(valueHelpInfo, this.codeMirror.getCursor(), false);
			} else {
				if ((typeof callback) !== "function") {
					this._raiseError("value help callback is not set or is not a function");
				} else {
					// enrich the valueHelpInfo with the valueHelp model
					callback.call(this, valueHelpInfo);
					// create provider
					var oModel = valueHelpInfo[0].model;
					if (!(oModel instanceof sap.ui.model.odata.v2.ODataModel)) {
						this._raiseError("value help model is not an oData V2 model");
					} else if (oModel.isMetadataLoadingFailed()) {
						this._raiseError("model metadata loading has failed in the past");
					} else if (!(oModel.getMetaModel().oModel)) {
						oModel.attachMetadataLoaded(function() {
							this._createValueHelpProvider(valueHelpInfo[0]);
						}.bind(this));
						oModel.attachMetadataFailed(function() {
							this._raiseError("attached model metadata failed");
						}.bind(this));
					} else {
						this._createValueHelpProvider(valueHelpInfo[0]);
					}
				}
			}
		}.bind(this));
	};

	ExpressionAdvanced.prototype._createValueHelpProvider = function(valueHelpInfo, bReplaceWord) {

		var oModel = valueHelpInfo.model;
		this.oMetadataAnalyzer = new sap.ui.comp.odata.MetadataAnalyser(oModel);
		var sAnnotationPath = valueHelpInfo.metadata.propertyPath;
		var oValueListAnnotation = this.oMetadataAnalyzer.getValueListAnnotation(sAnnotationPath);
		if (!oValueListAnnotation.primaryValueListAnnotation) {
			this._raiseError("proprety path is wrong");
			return;
		}
		var tokens = this.getExpressionTokens();
		var bAddSpace = false;
		if (tokens.length > 0) {
			bAddSpace = (tokens[tokens.length - 1].tokenType !== "whitespace");
		}

		if (this.oValueHelpDialogProvider) {
			this.oValueHelpDialogProvider.destroy();
		}

		this.oValueHelpDialogProvider = new ValueHelpProvider({
			annotation: oValueListAnnotation.primaryValueListAnnotation,
			additionalAnnotations: oValueListAnnotation.additionalAnnotations,
			control: this,
			model: oModel,
			preventInitialDataFetchInValueHelpDialog: false,
			supportMultiSelect: false,
			supportRanges: false,
			takeOverInputValue: false,
			fieldName: oValueListAnnotation.primaryValueListAnnotation.valueListTitle,
			title: oValueListAnnotation.primaryValueListAnnotation.valueListTitle,
			cursorPosition: this.codeMirror.getCursor(),
			bReplaceWord: bReplaceWord,
			businessDataType: valueHelpInfo.metadata.businessDataType,
			bAddSpace: bAddSpace

		});

		// open dialog
		this.fireValueHelpRequest({
			fromSuggestions: false
		});

	};

	ExpressionAdvanced.prototype._createCpValueHelp = function(valueHelpInfo, curPos, bReplaceWord, bValuehelpLinkPress) {
        var businessDataType = valueHelpInfo.metadata.businessDataType;
        var tokens = this.getExpressionTokens();
        var bAddSpace = false;
        var pop = sap.ui.getCore().byId("popover");
        if (pop) {
            pop.setModal(true);
        }
        if (tokens.length > 0) {
            bAddSpace = (tokens[tokens.length - 1].tokenType !== "whitespace");
        }

        if (this.oDialog) {
            this.oDialog.destroy();
        }
        var basePath = sap.ui.getCore().byId(this.getExpressionLanguage()).getModel().sServiceUrl;
        this._createDialog(basePath, valueHelpInfo, curPos, businessDataType, bAddSpace, bReplaceWord, bValuehelpLinkPress);
    };

    /*
     * Creates the necessary control for the value Help Dialog.
     * 
     */
    ExpressionAdvanced.prototype._createDialog = function(basePath, valueHelpInfo, curPos, businessDataType, bAddSpace, bReplaceWord,
            bValuehelpLinkPress) {
        this._createValueHelpDialog(basePath, valueHelpInfo, curPos, businessDataType, bAddSpace, bReplaceWord, bValuehelpLinkPress);
        this._createSmartFilterBar(basePath, valueHelpInfo);
        this.oValueHelpDialog.setFilterBar(this.oFilterBar);
        this.oValueHelpDialog.open();
        this.oValueHelpDialog.getTable().setBusy(true);
    };
    
    /*
     * Creates the Value Help Dialog.
     */

    ExpressionAdvanced.prototype._createValueHelpDialog = function(basePath, valueHelpInfo, curPos, businessDataType, bAddSpace,
            bReplaceWord, bValuehelpLinkPress) {
        var that = this;
		var expressionData = valueHelpInfo.expressionLanguage.getModel();
		var attributePath = "Attributes(Id='"+ valueHelpInfo.metadata.attributeId + "',VocabularyId='" + valueHelpInfo.metadata.vocabularyId + "',DataObjectId='" + valueHelpInfo.metadata.dataObjectId + "')";
		if(attributePath.includes(":")) {
			attributePath = attributePath = attributePath.replace(":","%3A");
		}
        this.attributeName = expressionData.oData[attributePath].Name;
		sap.ui.core.BusyIndicator.show(0);
        this.oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            supportMultiselect : false,
            supportRanges : false,
            horizontalScrolling : false,
            title : that.attributeName,
            resizable : false,
            beforeOpen : function() {
                that._bindTable(basePath, valueHelpInfo);
            },
            ok : function(oEvt) {
                var oSelRow = oEvt.getParameter("tokens")[0].data("row");
                var value = oSelRow.Value;
                if (businessDataType === that._dateBusinessDataType) {
                    value = that._formatDate(value);
                }
                that.setTextOnCursor(value, curPos, bReplaceWord, businessDataType, bAddSpace, bValuehelpLinkPress);
                that._updateModal(false);
                that.oValueHelpDialog.close();
                that.focus(that.codeMirror);

            },
            cancel : function() {
                that._updateModal(false);
                that.oValueHelpDialog.close();
                that.focus(that.codeMirror);

            },
            afterClose : function() {
                that._updateModal(false);
                that.oValueHelpDialog.destroy();
                that.focus(that.codeMirror);
                that.oFilterBar.destroy();
                sap.ui.core.BusyIndicator.hide();
            }
        });
    };

    /*
     * Utility function to format Date.
     */
    ExpressionAdvanced.prototype._formatDate = function(value) {
        return this.oFormatDate.format(this.oFormatDate.parse(value));
    };

    /*
     * Creates the necessary control os SmartFilterBar for the ValueHelp Dialog.
     */
    ExpressionAdvanced.prototype._createSmartFilterBar = function(basePath, valueHelpInfo) {
        var that = this;
        this.oFilterBar = new sap.ui.comp.smartfilterbar.SmartFilterBar({
            entitySet : valueHelpInfo.metadata.entitySet,
            enableBasicSearch : true,
            advancedMode : true,
            filterBarExpanded: true,
            search : function() {
                that.onSearch(basePath, valueHelpInfo);

            },
            filterChange: function(oEvent) {
                that.setValueStateFilter(oEvent);
            },
            controlConfiguration : [ that._createControlConfiguration() ]
        });
        var oModel = new sap.ui.model.odata.v2.ODataModel(basePath);
        this.oFilterBar.setModel(oModel);
    };

    /*
     * Creating the Control Configuration for the smartFilter of the valueHelp Dialog.
     */
    ExpressionAdvanced.prototype._createControlConfiguration = function() {
        var aControlConfiguration = [ new sap.ui.comp.smartfilterbar.ControlConfiguration({
            hasValueHelpDialog : true,
            key : "Value",
            label : "Value",
            visibleInAdvancedArea : true,
            width : "100px",
            index : 1

        }), new sap.ui.comp.smartfilterbar.ControlConfiguration({
            hasValueHelpDialog : true,
            key : "Description",
            label : "Description",
            visibleInAdvancedArea : true,
            width : "100px",
            index : 2

        }), new sap.ui.comp.smartfilterbar.ControlConfiguration({
            hasValueHelpDialog : true,
            key : "VocabularyId",
            label : "VocabularyId",
            width : "100px",
            visible : false,
            index : 3

        }), new sap.ui.comp.smartfilterbar.ControlConfiguration({
            hasValueHelpDialog : true,
            key : "DataObjectId",
            label : "DataObjectId",
            visible : false,
            width : "100px",
            groupId : "abc",
            index : 4

        }), new sap.ui.comp.smartfilterbar.ControlConfiguration({
            hasValueHelpDialog : true,
            key : "AttributeId",
            label : "AttributeId",
            visible : false,
            width : "100px",
            index : 5

        }),
        new sap.ui.comp.smartfilterbar.ControlConfiguration({
            hasValueHelpDialog : true,
            key : "Version",
            label : "Version",
            visible : false,
            width : "100px",
            index : 6

        })];
        return aControlConfiguration;
    };

    /*
     * Called when the search is triggered in SmartFilter.
     */
    ExpressionAdvanced.prototype.onSearch = function(basePath, valueHelpInfo) {
        this.oValueHelpDialog.getTable().setBusy(true);
        this._unBindTable();
        this._bindTable(basePath, valueHelpInfo);
    };

    /*
     * Binds the table taking current filters parameters into account.
     */
    ExpressionAdvanced.prototype._bindTable = function(basePath, valueHelpInfo) {
        var serviceUrl = valueHelpInfo.metadata.serviceURL;
        var aFilterParams = this._fetchFilterParams(valueHelpInfo);
        var mEntities = {
            valueHelp : {
                collection : serviceUrl,
                properties : [ this._propertyValue, this._propertyDescription ]
            }
        };

        var oTable = this.oValueHelpDialog.getTable();
        oTable.setThreshold(10);

        for (var i = 0; i < mEntities.valueHelp.properties.length; i++) {
            this._addValueHelpColumn(mEntities.valueHelp.properties[i], oTable);
        }

        var oModel = new sap.ui.model.odata.v2.ODataModel(basePath);
        oTable.setModel(oModel);
        oTable.bindRows(mEntities.valueHelp.collection, null, aFilterParams);
        oTable.getBinding("rows").attachDataReceived(this._handleRowsDataReceived, this);
    };

    //handles the Busy State of the busy state for the data recieved. 
    ExpressionAdvanced.prototype._handleRowsDataReceived = function(oEvent) {
        var that = this;
        var data = oEvent.getParameter("data");
        if (jQuery.isEmptyObject(data) || (data && data.results && data.results.length === 0)) {
            this.oValueHelpDialog.getTable().setNoData(that.oBundle.getText("no_data"));
        } else {
            this.oValueHelpDialog.getTable().setNoData(that.oBundle.getText("searching"));
        }
        this.oValueHelpDialog.getTable().setBusy(false);
    };

    // Utility function to create columns for the table.
    ExpressionAdvanced.prototype._addValueHelpColumn = function(oColumName, oTable) {
        var oColumn = new sap.ui.table.Column().setLabel(new sap.m.Label({
            text : oColumName
        }));
        if (oColumName === this._propertyValue) {
            oColumn.setSortProperty(oColumName);
        }
        oTable.addColumn(oColumn.setTemplate(new sap.m.Text().bindProperty("text", oColumName)));
    };

    /*
     * unBind the table Rows.
     */
    ExpressionAdvanced.prototype._unBindTable = function() {
        var oTable = this.oValueHelpDialog.getTable();
        oTable.destroyColumns();
        oTable.unbindRows();

    };
    

    /*
     * fetch the latest filter parmas depending on the filter or the search param set.
     */
    ExpressionAdvanced.prototype._fetchFilterParams = function(valueHelpInfo) {
        var that = this;
        var aSearchParams = [];
        var aFilterParams = [ new sap.ui.model.Filter("AttributeId", sap.ui.model.FilterOperator.EQ, valueHelpInfo.metadata.attributeId),
                new sap.ui.model.Filter("DataObjectId", sap.ui.model.FilterOperator.EQ, valueHelpInfo.metadata.dataObjectId),
                new sap.ui.model.Filter("VocabularyId", sap.ui.model.FilterOperator.EQ, valueHelpInfo.metadata.vocabularyId) ];

        var aFilters = this.oFilterBar.getFilters();
        var searchParam = this.oFilterBar.getParameters();
        //When both search and filter is selected
        if (!jQuery.isEmptyObject(searchParam) && aFilters && aFilters.length > 0) {
            searchParam = this.oFilterBar.getParameters().custom.search;
            aSearchParams = this._getSearchFilters(searchParam);
            aFilters = that._formatFilterParams(aFilters);
            aFilterParams.push(new sap.ui.model.Filter({
                filters : [ new sap.ui.model.Filter(aFilters), new sap.ui.model.Filter(aSearchParams) ],
                and : true
            }));
        } else if (!jQuery.isEmptyObject(searchParam)) {
            //when only Search is selected.
            searchParam = this.oFilterBar.getParameters().custom.search;
            aSearchParams = this._getSearchFilters(searchParam);
            aFilterParams.push(aSearchParams);
        } else if (aFilters && aFilters.length > 0) {
            //When only filters is selected.
            aFilters = that._formatFilterParams(aFilters);
            aFilterParams.push(aFilters[0]);
        }
        return aFilterParams;
    };

    /*
     * format the filterParams to support Contains and Between.
     */
    ExpressionAdvanced.prototype._formatFilterParams = function(aFilters) {
        var that = this;
        if (aFilters[0] && aFilters.length === 1 && aFilters[0].aFilters[0] && aFilters[0].aFilters[0].sOperator) {
            aFilters = that._formatSingleFilter(aFilters);
        } else if (aFilters[0] && aFilters[0].aFilters[0] && aFilters[0].aFilters[0].aFilters[0] && aFilters[0].aFilters[0].aFilters[0].aFilters && aFilters[0].aFilters[1].aFilters[0].aFilters) {
            aFilters = that._formatMultiFilter(aFilters, 0, true);
            aFilters = that._formatMultiFilter(aFilters, 1, true);

        } else if (aFilters[0] && aFilters[0].aFilters[0] && aFilters[0].aFilters[1] && aFilters[0].aFilters[0].aFilters[0] && aFilters[0].aFilters[0].aFilters[0].aFilters && aFilters[0].aFilters[1].aFilters) {
            aFilters = that._formatMultiFilter(aFilters, 0, true);
            aFilters = that._formatMultiFilter(aFilters, 1, false);

        } else if (aFilters[0] && aFilters[0].aFilters[0] && aFilters[0].aFilters[1] && aFilters[0].aFilters[1].aFilters[0] && aFilters[0].aFilters[0].aFilters && aFilters[0].aFilters[1].aFilters[0].aFilters) {
            aFilters = that._formatMultiFilter(aFilters, 0, false);
            aFilters = that._formatMultiFilter(aFilters, 1, true);

        } else if (aFilters[0] && aFilters[0].aFilters[0] &&  aFilters[0].aFilters[1] && aFilters[0].aFilters[0].aFilters && aFilters[0].aFilters[1].aFilters) {
            aFilters = that._formatMultiFilter(aFilters, 0, false);
            aFilters = that._formatMultiFilter(aFilters, 1, false);

        }

        return aFilters;
    };

    ExpressionAdvanced.prototype._formatSingleFilter = function(aFilters) {
        var that = this;
        var _valueField = null;

        for (var iterator = 0; iterator < aFilters[0].aFilters.length; iterator++) {
            if (aFilters[0].aFilters[iterator].sOperator === "Contains") {
                aFilters[0].aFilters[iterator].sOperator = "EQ";
            } else if (aFilters[0].aFilters[iterator].sOperator === "BT") {

                var convertedFilterParam = that._manageParam(aFilters[0].aFilters[iterator].sPath,aFilters[0].aFilters[iterator].sOperator,
                        aFilters[0].aFilters[iterator].oValue1, aFilters[0].aFilters[iterator].oValue2);
                delete aFilters[0].aFilters[iterator];
                aFilters[0].aFilters[iterator] = convertedFilterParam;
            } else if (aFilters[0].aFilters[iterator].sOperator === "StartsWith") {
                _valueField = (aFilters[0].aFilters[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
                _valueField.setValueState("Error");
                _valueField.setValueStateText(aFilters[0].aFilters[iterator].sOperator + " operator not supported");
            } else if (aFilters[0].aFilters[iterator].sOperator === "EndsWith") {
                _valueField = (aFilters[0].aFilters[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
                _valueField.setValueState("Error");
                _valueField.setValueStateText(aFilters[0].aFilters[iterator].sOperator + " operator not supported");
            }

        }
        return aFilters;

    };
    ExpressionAdvanced.prototype._formatMultiFilter = function(aFilters, index, bMultifilter) {
        var that = this;
        var _valueField = null;
        var aComputeFilterParma = [];
        if (bMultifilter) {
            aComputeFilterParma = aFilters[0].aFilters[index].aFilters[0].aFilters;
        } else {
            aComputeFilterParma = aFilters[0].aFilters[index].aFilters;
        }
        for (var iterator = 0; iterator < aComputeFilterParma.length; iterator++) {
            if (aComputeFilterParma[iterator].sOperator === "Contains") {
                aComputeFilterParma[iterator].sOperator = "EQ";
            } else if (aComputeFilterParma[iterator].sOperator === "BT") {

                var convertedFilterParam = that._manageParam(aComputeFilterParma[iterator].sPath,aComputeFilterParma[iterator].sOperator,
                        aComputeFilterParma[iterator].oValue1, aComputeFilterParma[iterator].oValue2);
                delete aComputeFilterParma[iterator];
                aComputeFilterParma[iterator] = convertedFilterParam;

            } else if (aComputeFilterParma[iterator].sOperator === "StartsWith") {
                _valueField = (aComputeFilterParma[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
                _valueField.setValueState("Error");
                _valueField.setValueStateText(aComputeFilterParma[iterator].sOperator + " operator not supported");
            } else if (aComputeFilterParma[iterator].sOperator === "EndsWith") {
                _valueField = (aComputeFilterParma[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
                _valueField.setValueState("Error");
                _valueField.setValueStateText(aComputeFilterParma[iterator].sOperator + " operator not supported");
            }
        }
        return aFilters;
    };
    
    /*
     * Converts the Between Operator to Less than and Equal to Operator.
     */
    ExpressionAdvanced.prototype._manageParam = function(sPath, operator, value1, value2) {
        var filterParam = [];
        if (value1 && value2) {
            filterParam = new sap.ui.model.Filter({
                filters : [ new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.GT, value1),
                        new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.LT, value2) ],
                and : true
            });
        }
        return filterParam;
    };

    // Utility function to form the search filter params.
    ExpressionAdvanced.prototype._getSearchFilters = function(searchParam) {
        return new sap.ui.model.Filter({
            filters : [ new sap.ui.model.Filter(this._propertyValue, sap.ui.model.FilterOperator.EQ, searchParam),
                    new sap.ui.model.Filter(this._propertyDescription, sap.ui.model.FilterOperator.EQ, searchParam) ],
            and : false
        });
    };

    ExpressionAdvanced.prototype.setValueStateFilter = function(oEvent) {
        var sId = oEvent.getSource().sId; 
        this._valueFieldValue = sap.ui.getCore().byId(sId + "-filterItemControlA_-Value");
        if (this._valueFieldValue) {
            this._valueFieldValue.setValueState("None");
            this._valueFieldValue.setValueStateText("");
        }
        this._valueFieldDescription = sap.ui.getCore().byId(sId + "-filterItemControlA_-Description");
        if (this._valueFieldDescription) {
            this._valueFieldDescription.setValueState("None");
            this._valueFieldDescription.setValueStateText("");
        }
    };
    
	/*
     * Callback fucntion event which is fired once the user clicked on 'ValueHelp' token link. onValueHelpLinkPress : create code mirror
     * search cursor based on the 'ValueList' token which has been clicked. Create Select Dialog display all 'ValueList' suggestions. @param
     * valueHelpText : 'ValueHelp' token text value. @param valueHelpId : ValueHelp Id of the token.
     */
	ExpressionAdvanced.prototype.onValueHelpLinkPress = function(valueHelpText, valueHelpId) {
		if (!this.getEditable()) {
			return;
		}
		var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
		var callback = expressionLanguage.getValueHelpCallback();

		//build valueHelpInfo
		var tokens = this.getExpressionTokens();
		var i;
		var valueHelpInfo;
		var line = this.codeMirror.getCursor().line;
		var valueListPosition;
		for (i = 0; i < tokens.length; i++) {
			if (tokens[i].tokenType === 'valueList' && tokens[i].info && tokens[i].info.id === valueHelpId &&
				tokens[i].token === valueHelpText) {
				valueHelpInfo = [tokens[i].info];
				valueListPosition = tokens[i].end;
				break;
			}
		}
		var curPostion = {};
		curPostion.ch = valueListPosition;
		curPostion.line = line;

		if ((typeof callback) === "function") {

			callback.call(this, valueHelpInfo);
			var oModel = valueHelpInfo[0].model;
			if (!oModel.getMetaModel().oModel) {
				oModel.attachMetadataLoaded(function() {
					this._createValueHelpProvider(valueHelpInfo[0], true);
				}.bind(this));
			} else {
				this._createValueHelpProvider(valueHelpInfo[0], true);
			}
		} else if (valueHelpInfo && valueHelpInfo[0].metadata.hasOwnProperty(this._hasValueSource) && valueHelpInfo[0].metadata.HasValueSource ===
			true) {
			valueHelpInfo[0].expressionLanguage = expressionLanguage;
			this._createCpValueHelp(valueHelpInfo[0], curPostion, true, true);
		}
	};

	ExpressionAdvanced.prototype._createSearchCursor = function(valueHelpText) {
		var cm = this.codeMirror;
		cm.getCursor().ch = cm.getCursor().ch + valueHelpText.length;
		var cursor = cm.getSearchCursor(valueHelpText, cm.getCursor(), typeof valueHelpText == "string" && valueHelpText == valueHelpText.toLowerCase());
		return cursor;
	};

	ExpressionAdvanced.prototype.setTextOnCursor = function(sValue, cursorPosition, bReplaceWord, businessDataType, bAddSpace,
		bValuehelpLinkPress) {

		function getNextLine(currentLine, arrLines) {
			// this function skips empty lines
			var nextLine = currentLine + 1;
			for (var j = nextLine; j < arrLines.length; j++) {
				if (arrLines[j].length === 0) {
					nextLine++;
				} else {
					break;
				}
			}
			return nextLine;
		}

		var TYPE_STRING = "String",
			TYPE_DATE = "Date",
			TYPE_TIMESTAMP = "Timestamp",
			TYPE_TIME = "Time";

		// inserting a new selection
		var cursorPos;
		var sFormatedValue = ((businessDataType === TYPE_STRING) ||
			(businessDataType === TYPE_DATE) ||
			(businessDataType === TYPE_TIMESTAMP) ||
			(businessDataType === TYPE_TIME)) ? "'" + sValue + "'" : sValue;

		var tokens = this.getExpressionTokens();
		var lines = this.getValue().split("\n");
		var line = -1;
		var oToken = {
			start: {
				line: cursorPosition.line,
				ch: cursorPosition.ch
			},
			end: {
				line: cursorPosition.line,
				ch: cursorPosition.ch
			}
		};
		for (var i = 0; i < tokens.length; i++) {
			line = (tokens[i].start === 0) ? getNextLine(line, lines) : line;
			if (line === cursorPosition.line && (tokens[i].end > cursorPosition.ch) || (tokens[i].end >= cursorPosition.ch && bValuehelpLinkPress)) {
				oToken.start.ch = tokens[i].start;
				oToken.end.ch = tokens[i].end;
				bReplaceWord = true;
				break;
			}
		}
		if (bReplaceWord) {
			this.codeMirror.replaceRange(sFormatedValue, oToken.start, oToken.end); // replace the selection
			cursorPos = this.codeMirror.findPosH(oToken.start, sFormatedValue.length, "char", true);
			this.codeMirror.setCursor(cursorPos); // set the cursor at the end of the word
		} else {
			sFormatedValue = bAddSpace ? " " + sFormatedValue : sFormatedValue;
			this.codeMirror.replaceRange(sFormatedValue, cursorPosition); // insert the selection
			cursorPos = this.codeMirror.findPosH(cursorPosition, sFormatedValue.length, "char", true);
			this.codeMirror.setCursor(cursorPos); // set the cursor past the new selection
		}
		var oExpressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
		this.getFormattingTokens(oExpressionLanguage);
		this.ValueHelpRequested = false;
	};

	ExpressionAdvanced.prototype._setCodeMirror = function() {
		var editable = this.getEditable();
		var attributeInfo;
		if ("getAttributeInfo" in this && this.getAttributeInfo()) {
			attributeInfo = this.getAttributeInfo();
		}
		var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
		var valueListAttribute;
		if (attributeInfo) {
			valueListAttribute = expressionLanguage.getValueListAttribute(attributeInfo);
		}

		function autoComplete(cm, commandName, timeout) {
			var oAdvancedExpressionEditor = cm.options.expressionEditor;
			if ((oAdvancedExpressionEditor.getEditable() !== false) && sap.ui.getCore().byId(oAdvancedExpressionEditor.getExpressionLanguage())) {
				window.clearTimeout(oAdvancedExpressionEditor.timer);
				oAdvancedExpressionEditor.timer = window.setTimeout(function() {
					cm.execCommand(commandName);
				}, timeout);
				return window.CodeMirror.Pass; // tell CodeMirror we didn't handle the key
			}
			return null;
		}

		function ordinaryKeyCallback(cm) {
			var oAdvancedExpressionEditor = cm.options.expressionEditor;
			if (oAdvancedExpressionEditor.getEditable() !== false) {
				window.clearTimeout(oAdvancedExpressionEditor.timer);
				oAdvancedExpressionEditor.needAutoComplete = true;
				oAdvancedExpressionEditor.timer = window.setTimeout(function() {
					if (oAdvancedExpressionEditor.needAutoComplete && sap.ui.getCore().byId(oAdvancedExpressionEditor.getExpressionLanguage())) {
						cm.execCommand("autocomplete");
					}
				}, 500);
				return window.CodeMirror.Pass; // tell CodeMirror we didn't handle the key
			}
			return null;
		}

		function enterKeyCallback(cm) {
			return autoComplete(cm, "enterAutocomplete", 500);
		}

		function colonKeyCallback(cm) {
			return autoComplete(cm, "colonAutocomplete", 500);
		}

		function ctrlSpaceKeysCallback(cm) {
			autoComplete(cm, "autocomplete", 0);
		}

		/*
		 * SPACE is use for both opening the hints, and closing them if writing a non-existent expression.
		 * As such, it is separated from the common ordinaryKeyCallback() key handling.
		 * If not so, it alternately opens the hints every 2nd press. Example flow:
		 * press SPACE:
		 * 1. ordinaryKeyCallback() sets the timeout
		 * 2. ordinaryKeyCallback() delayed opening of hints
		 * press SPACE (not in one of the hints):
		 * 1. ordinaryKeyCallback() sets the timeout
		 * 2. _handleEndCodeCompletion sets needAutoComplete as false (event coming from CodeMirror hints)
		 * 3. ordinaryKeyCallback() delayed opening of hints - not opening the hints as needAutoComplete is false
		 * **/
		function spaceKeyCallback(cm) {
			return autoComplete(cm, "autocomplete", 500);
		}

		function valueHelpCallback(cm) {
			var oAdvancedExpressionEditor = cm.options.expressionEditor;
			var input = cm.getRange({
				line: 0,
				ch: 0
			}, cm.getCursor());
			if (cm.options.headerValue) {
				var prefix = cm.options.headerValue + " ";
				if (cm.options.fixedOperator) {
					prefix = prefix + cm.options.fixedOperator + " ";
				}
				input = prefix + input;
			}
			var autoSuggestions = cm.options.relDelegate.getSuggestions(
				input,
				cm.options.returnType,
				cm.options.collection);
			var suggestions;
			if (autoSuggestions && autoSuggestions.hasOwnProperty("suggs") && autoSuggestions.suggs.length > 0) {
				suggestions = autoSuggestions.suggs;
				for (var i = 0; i < suggestions.length; i++) {
					if (suggestions[i].tokenType === 'valueList' && suggestions[i].info.metadata.hasOwnProperty(oAdvancedExpressionEditor._hasValueSource)) {
						oAdvancedExpressionEditor._createCpValueHelp(suggestions[i].info, cm.getCursor(), false);
					}
				}
			}
		}

		this.keyMap = {
			"Tab": false,
			"Shift-Tab": false,
			"Ctrl-Space": ctrlSpaceKeysCallback,
			"Backspace": ordinaryKeyCallback,
			"Enter": enterKeyCallback,
			"':'": colonKeyCallback,
			"'+'": ordinaryKeyCallback,
			"'-'": ordinaryKeyCallback,
			"'*'": ordinaryKeyCallback,
			"'/'": ordinaryKeyCallback,
			"'_'": ordinaryKeyCallback,
			"'o'": ordinaryKeyCallback,
			"'q'": ordinaryKeyCallback,
			"'w'": ordinaryKeyCallback,
			"'e'": ordinaryKeyCallback,
			"'r'": ordinaryKeyCallback,
			"'t'": ordinaryKeyCallback,
			"'y'": ordinaryKeyCallback,
			"'u'": ordinaryKeyCallback,
			"'i'": ordinaryKeyCallback,
			"'p'": ordinaryKeyCallback,
			"'.'": ordinaryKeyCallback,
			"'a'": ordinaryKeyCallback,
			"'s'": ordinaryKeyCallback,
			"'d'": ordinaryKeyCallback,
			"'f'": ordinaryKeyCallback,
			"'g'": ordinaryKeyCallback,
			"'h'": ordinaryKeyCallback,
			"'j'": ordinaryKeyCallback,
			"'k'": ordinaryKeyCallback,
			"'l'": ordinaryKeyCallback,
			"'z'": ordinaryKeyCallback,
			"'x'": ordinaryKeyCallback,
			"'c'": ordinaryKeyCallback,
			"'v'": ordinaryKeyCallback,
			"'b'": ordinaryKeyCallback,
			"'n'": ordinaryKeyCallback,
			"'m'": ordinaryKeyCallback,
			"'O'": ordinaryKeyCallback,
			"'Q'": ordinaryKeyCallback,
			"'W'": ordinaryKeyCallback,
			"'E'": ordinaryKeyCallback,
			"'R'": ordinaryKeyCallback,
			"'T'": ordinaryKeyCallback,
			"'Y'": ordinaryKeyCallback,
			"'U'": ordinaryKeyCallback,
			"'I'": ordinaryKeyCallback,
			"'P'": ordinaryKeyCallback,
			"'A'": ordinaryKeyCallback,
			"'S'": ordinaryKeyCallback,
			"'D'": ordinaryKeyCallback,
			"'F'": ordinaryKeyCallback,
			"'G'": ordinaryKeyCallback,
			"'H'": ordinaryKeyCallback,
			"'J'": ordinaryKeyCallback,
			"'K'": ordinaryKeyCallback,
			"'L'": ordinaryKeyCallback,
			"'Z'": ordinaryKeyCallback,
			"'X'": ordinaryKeyCallback,
			"'C'": ordinaryKeyCallback,
			"'V'": ordinaryKeyCallback,
			"'B'": ordinaryKeyCallback,
			"'N'": ordinaryKeyCallback,
			"'M'": ordinaryKeyCallback,
			"'0'": false,
			"'1'": false,
			"'2'": false,
			"'3'": false,
			"'4'": false,
			"'5'": false,
			"'6'": false,
			"'7'": false,
			"'8'": false,
			"'9'": false,
			"' '": spaceKeyCallback,
			"F4": valueHelpCallback
		};

		function keyMapping(oAdvancedExpressionEditor) {
			return oAdvancedExpressionEditor.keyMap;
		}

		if (this.expressionTokens.length === 0) {
			var oEL = sap.ui.getCore().byId(this.getExpressionLanguage());
			if (oEL) {
				this.getFormattingTokens(oEL);
			}
		}
		var keyMap = keyMapping(this);
		var textAreaId = this.oTextArea.getId() + '-inner';
		var isMSIE = (Utils.msieversion() >= 0);
		if (isMSIE) {
			jQuery('#' + textAreaId).attr('placeholder', this.getProperty('placeholder'));
		}
		this.codeMirror = window.CodeMirror.fromTextArea(document.getElementById(textAreaId), {
			mode: "text/hdf",
			lineNumbers: false,
			lineWrapping: true,
			matchBrackets: editable === true ? true : false,
			highlightSelectionMatches: editable === true ? {
				showToken: /\w/
			} : {},
			relDelegate: expressionLanguage,
			returnType: this.getProperty("type"),
			collection: this.getProperty("collection"),
			valueListAttribute: valueListAttribute,
			expressionEditor: this,
			stillNeedShowHint: true,
			shouldValidate: true,
			styleSelectedText: true,
			smartIndent: true,
			autoCloseBrackets: true,
			indentUnit: 6
		});
		this.codeMirror.addKeyMap(keyMap, true);

		//	//In order to support aliases - we must reset the aliases after initialization of codeMirror object
		//	if (window.CodeMirror.mimeModes.hasOwnProperty('text/hdf'))
		//		window.CodeMirror.mimeModes['text/hdf'].aliases = me.getRelDelegate().vocabualryAliasesNames;
	};

	ExpressionAdvanced.prototype.getFormattingTokens = function(oExpressionLanguage) {
		this.tokens = [];
		this.valueListAttrInfo = oExpressionLanguage.getValueListAttribute(this.mProperties.attributeInfo);
		var exprssionMetadata = oExpressionLanguage.getExpressionMetadata(this._liveValue);
		if (exprssionMetadata) {
			this.tokens = exprssionMetadata.tokens;
		}
		if (oExpressionLanguage._hasValueSource && this.valueListAttrInfo) {
			this.newExpression = this.valueListAttrInfo.navPath + " " + Constants.IS_EQUAL_TO + " " + this._liveValue;
			exprssionMetadata = oExpressionLanguage.getExpressionMetadata(this.newExpression);
			if (exprssionMetadata) {
				var tokensWithPath = exprssionMetadata.tokens;
				for (var tokenPos = 0; tokenPos < tokensWithPath.length; tokenPos++) {
					for (var pos = 0; pos < this.tokens.length; pos++) {
						if (tokensWithPath[tokenPos].tokenType === "valueList" && tokensWithPath[tokenPos].token === this.tokens[pos].token) {
							this.tokens[pos].info = tokensWithPath[tokenPos].info;
							this.tokens[pos].tokenType = tokensWithPath[tokenPos].tokenType;
						}
					}

				}
			}
		}
		this.setExpressionTokens(this.tokens);
	};

	ExpressionAdvanced.prototype._setEditorStyle = function() {
		//We added to the codeMirror code (see codeMirror.js) styles class derived from SAPUI5
		//Set CSS style to the new added codemirror control - according to SAPUI5 textField CSS
		//sapUiTf sapUiTfBack sapUiTfBrd sapUiTfStd sapUiTxtA

		//We need to mimic the way input control is being used in sapui5 which means:
		//level 1: sapMInput sapMInputBase
		//level 2: sapMInputBaseInner
		if (this.getValueStateText() && this.getValueStateText() !== "") {
			jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-error');
			jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseStateInner sapMInputBaseErrorInner sapMInputBaseContentWrapper sapMInputBaseContentWrapperState sapMInputBaseContentWrapperError');
			jQuery('#' + this.oTextArea.getId()).addClass('sapMInputBaseError');
		}
		jQuery('#' + this.oTextArea.getId()).removeClass().addClass('sapMInput'); //sapMInputBase
		jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseInner CodeMirror-rules');
		if (!this.getEditable()) {
			jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-rules-Not-Editable');
		} else {
			jQuery(this.codeMirror.getWrapperElement()).removeClass('CodeMirror-rules-Not-Editable');
		}

		// bug fix - without it the height of codeMirror to big --> cause to wrong cursor positioning
		if (this.codeMirror) {
			this.codeMirror.refresh();
		}
	};

	ExpressionAdvanced.prototype._handleOnLoadValidation = function() {
		if (this.getValidateOnLoad()) {
			this.validateExpression();
			this.setValidateOnLoad(false);
		}
	};

	ExpressionAdvanced.prototype._handleEditableProperty = function() {
		if (this.getEditable() === false) {
			this.codeMirror.setOption("readOnly", "true");
			this.codeMirror.setOption("theme", "read-only");
		}
	};

	ExpressionAdvanced.prototype._handleFocus = function() {
		var oCodeMirror = this.codeMirror;
		if (this.getFocusOnLoad()) {
			this.focus();
		}
		this.codeMirror.on("focus", function(cm, change) {
			var errorMessage = cm.options.expressionEditor.getProperty("valueStateText");
			if (errorMessage && errorMessage !== "") {
				cm.options.expressionEditor._showPopUp();
			}
			cm.options.stillNeedShowHint = true;
			jQuery('#' + cm.options.expressionEditor.oTextArea.getId()).addClass('sapMInputFocused');
			jQuery(cm.getWrapperElement()).removeClass('CodeMirror-errorBackground');
		});

		if (this.dataModel.getProperty("/focus") === true) {
			window.setTimeout(function() {
				var lastLine = oCodeMirror.getLine(oCodeMirror.lastLine());
				var cursorPos = lastLine.length;
				oCodeMirror.setCursor({
					line: oCodeMirror.lastLine(),
					ch: cursorPos
				});
				//oCodeMirror.focus();
			}, 10);
		}
	};

	ExpressionAdvanced.prototype._refreshOnNavigationEnd = function() {
		jQuery(".sapMNav").on('webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd', jQuery.proxy(_refreshCodemirror, this));

		function _refreshCodemirror() {
			if (this.codeMirror) {
				this.codeMirror.refresh();
			}
		}

	};

	ExpressionAdvanced.prototype._handleKeyPress = function() {
		this.codeMirror.on("keyHandled", function(cm, key, event) {
			if (event.keyCode === 27 && this && this.endCompletion === true) {
				event.stopPropagation();
				this.endCompletion = false;
			}
			if (event.ctrlKey === true && key === "Ctrl-A") {
				event.stopPropagation();
			}
		});
	};

	ExpressionAdvanced.prototype._handleEndCodeCompletion = function() {
		this.codeMirror.on("endCompletion", function(cm) {
			cm.options.expressionEditor.needAutoComplete = false;
			cm.options.expressionEditor.endCompletion = !cm.options.expressionEditor.endCompletion;
		});
	};

	ExpressionAdvanced.prototype._handleMousedown = function() {
		this.codeMirror.on("mousedown", function(cm, event) {

			//Once user click on 'ValueList' token
			event.stopPropagation();

			var target = event.target || event.srcElement;

			if (target && event.button === 0) {
				var classList = target.className.split(/\s+/);

				for (var i = 0; i < classList.length; i++) {
					if (classList[i] === 'cm-valuehelp') {
						var valueHelpId = classList[++i].split('-valuehelpid-')[1];
						//vlaueHelpPopUp
						cm.options.expressionEditor.onValueHelpLinkPress(target.textContent, valueHelpId);
					}
				}
			}
		});
	};

	/*
	/!*
	* Get complete token string from tokens cached array
	* @param selectedValueList - selected html element outerHTML, contain only partaily token value
	* @param oControll expression editor instance
	* @returns complete token string
	*!/
	ExpressionAdvanced.prototype._getValueListToken = function (selectedValueList, oControll){
	var tokens = oControll.getExpressionTokens();
	var tokensLength = tokens.length;
	for (var index = 0; index < tokensLength; index++){
	if (tokens[index].token.indexOf(selectedValueList) > -1){
	return tokens[index].token;
	}
	}
	return null;
	};*/

	ExpressionAdvanced.prototype._handleChange = function() {
		this.codeMirror.on("change", function(cm, change) {
			var oAdvancedExpressionEditor = cm.options.expressionEditor;
			if (oAdvancedExpressionEditor.codeMirror.state.completionActive && oAdvancedExpressionEditor.keyMap["'" + change.text[0] + "'"] ===
				false) {
				oAdvancedExpressionEditor.codeMirror.state.completionActive.close();
			}

			jQuery(oAdvancedExpressionEditor.codeMirror.getWrapperElement()).removeClass('CodeMirror-error');
			jQuery(oAdvancedExpressionEditor.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner sapMInputBaseContentWrapper sapMInputBaseContentWrapperState sapMInputBaseContentWrapperError');
			oAdvancedExpressionEditor._liveValue = cm.getValue();

			var oEL = sap.ui.getCore().byId(oAdvancedExpressionEditor.getExpressionLanguage());
			if (oEL) {
				oAdvancedExpressionEditor.getFormattingTokens(oEL);
			}

			oAdvancedExpressionEditor.codeMirror.options.shouldValidate = true;
			oAdvancedExpressionEditor.fireLiveChange({
				newValue: cm.getValue()
			});
			// we dont indent on delete
			if (change.origin !== "+delete") {
				cm.operation(function() {
					for (var line = 0, end = cm.lineCount(); line < end; ++line) {
						cm.indentLine(line, "smart");
					}
				});
			}
		});
	};

	ExpressionAdvanced.prototype._handleFocusLeave = function() {
		this.codeMirror.on("blur", function(cm) {
			var oAdvancedExpressionEditor = cm.options.expressionEditor;
			oAdvancedExpressionEditor._closePopUp();
			oAdvancedExpressionEditor.codeMirror.options.stillNeedShowHint = false;

			// shouldValidate flag indicates:
			//	-	this is real focus leave, not because of click on Hint
			//	-	value was changed while the control was in focus
			//  -   oAdvancedExpressionEditor.bFlagForPreventBlurWhenPopOverOpen see bug 4810
			if (oAdvancedExpressionEditor.codeMirror.options.shouldValidate && !oAdvancedExpressionEditor.bFlagForPreventBlurWhenPopOverOpen) {
				oAdvancedExpressionEditor.setValue(oAdvancedExpressionEditor.codeMirror.getValue());
				//if (oAdvancedExpressionEditor.getProperty("automaticValidation")){
				if (!(oAdvancedExpressionEditor instanceof sap.rules.ui.DecisionTableCellExpressionAdvanced)) {
					oAdvancedExpressionEditor.validate();
				}
				oAdvancedExpressionEditor._closePopUp();
				//}
				oAdvancedExpressionEditor.fireChange({
					newValue: cm.getValue()
				});
				oAdvancedExpressionEditor.codeMirror.options.shouldValidate = false;
			}
			jQuery('#' + oAdvancedExpressionEditor.oTextArea.getId()).removeClass('sapMInputFocused');
			oAdvancedExpressionEditor.dataModel.setProperty("/focus", false);
		});
	};

	ExpressionAdvanced.prototype._setExpressionErrorStyle = function() {
		var errorMsg = this.getProperty("valueStateText");
		if (errorMsg !== "" && errorMsg !== undefined && this.codeMirror) {
			jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-error');
			jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseStateInner sapMInputBaseErrorInner sapMInputBaseContentWrapper sapMInputBaseContentWrapperState sapMInputBaseContentWrapperError');
			jQuery('#' + this.oTextArea.getId()).addClass('sapMInputBaseError');

			// Position the cursor within the control
			var cursorPos;
			if (this.errorCursorPosition < 0) {
				var lastLine = this.codeMirror.getLine(this.codeMirror.lastLine());
				cursorPos = lastLine.length;
				//this.codeMirror.setCursor({line: lastLine, ch: cursorPos});
				jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-errorBackground');
			} else {
				var idx = errorMsg.lastIndexOf("'");
				if (idx > 0) {
					var offendingText = errorMsg.substring(0, idx);
					idx = offendingText.lastIndexOf("'");
					if (idx > 0) {
						offendingText = offendingText.substring(idx + 1);
					}
					var found = false;
					for (var lineNum = this.codeMirror.lastLine(); !found && lineNum >= 0; lineNum--) {
						var exp = this.codeMirror.getLine(lineNum);
						cursorPos = exp.lastIndexOf(offendingText);
						if (cursorPos >= 0) {
							found = true;
							this.codeMirror.setSelection({
								line: lineNum,
								ch: cursorPos
							}, {
								line: lineNum,
								ch: cursorPos + offendingText.length
							});
						}
					}
				}
			}
		}
	};

	/*    ExpressionAdvanced.prototype.createAliasFromTextMenu = function (e){

	// build context menu
	this.oContextMenu = new sap.m.ActionSheet();

	//Create the items and add them to the menu
	var oMenuItemSaveAsAlias = new Button({
	text: this.oBundle.getText("SAVE_AS_ALIAS")
	});
	oMenuItemSaveAsAlias.attachPress(function (){
	// concat text of all elements
	var text = this.getSelectedText();
	this.onCreateAliasLinkForText(text);
	});
	this.oContextMenu.addButton(oMenuItemSaveAsAlias);
	};*/

	ExpressionAdvanced.prototype.getSelectedText = function() {
		return this.codeMirror.getSelection();
	};

	/*    ExpressionAdvanced.prototype.openAliasFromTextMenu = function (e){
	window.setTimeout(function (){
	if (this.codeMirror.getSelection() !== ""){
	if (!this.oContextMenu){
	this.createAliasFromTextMenu(e);
	}
	this.oContextMenu.openBy(jQuery('#' + this.getId() + " .CodeMirror .CodeMirror-selectedtext")[0]);
	} else if (this.oContextMenu && this.oContextMenu.isOpen()){
	this.oContextMenu.close();
	}

	}, 300);
	};*/
	ExpressionAdvanced.prototype.exit = function() {
		document.removeEventListener("mousedown", this.fnMouseDownListsner, true);
	};
	return ExpressionAdvanced;

}, /* bExport= */ true);
