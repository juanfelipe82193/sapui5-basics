/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.Notes.
jQuery.sap.declare("sap.ca.ui.Notes");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.List");


/**
 * Constructor for a new Notes.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * This control is a List with the ability to render an additional control on top of it to add new
 * notes. The developer is responsible to give the correct template to use to display notes (recommended are either
 * the FeedListItem or the ExpansibleFeedListItem). The developer is also responsible to implement the code to send
 * the notes to the backend system, by responding to the addNote event.
 * @extends sap.m.List
 *
 * @constructor
 * @public
 * @deprecated Since version 1.22. 
 * This control has been made available in sap.m.
 * Please use sap.m.FeedInput with sap.m.FeedListItem instead!
 * This control will not be supported anymore.
 * @name sap.ca.ui.Notes
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.List.extend("sap.ca.ui.Notes", /** @lends sap.ca.ui.Notes.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * If set to true, this control will render an additional control to create new notes.
		 */
		showNoteInput : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * max text input length
		 */
		textMaxLength : {type : "int", group : "Misc", defaultValue : 1000},

		/**
		 * Placeholder text shown when no value available . Default value is "Add note".
		 */
		placeholder : {type : "string", group : "Misc", defaultValue : null}
	},
	events : {

		/**
		 * press event for button
		 * 
		 * (oControlEvent) Event is fired when the user clicks on the control.
		 * 
		 * fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction,
		 * oListenerObject]
		 */
		addNote : {}
	}
}});


/**
 * Clear the content of the inner text box
 *
 * @name sap.ca.ui.Notes#clear
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Calls clear() and reset growing metadata
 *
 * @name sap.ca.ui.Notes#reset
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

jQuery.sap.require("sap.m.MessageToast");

sap.ca.ui.Notes.prototype.init = function () {
    if (sap.m.List.prototype.init) {
        sap.m.List.prototype.init.apply(this);
    }

    this.textAreaDefaultHeight;
    this.sFourRowHeight;
    this.sThreeRowHeight;

    this._oTextArea = new sap.m.TextArea(this.getId()+"-textarea", {
        maxLength: this.getTextMaxLength(),
        placeholder: sap.ca.ui.utils.resourcebundle.getText("notes.addNotePlaceHolder")
    });

    this._oTextArea.setParent(this);
    this._oTextArea.sParentAggregationName = "fake"; // This is only to prevent errors when assigning the control to FlexBox


    if (jQuery.device.is.phone) {
        this._oTextArea.attachLiveChange(this._liveChangePhoneHeightHandler, this);
    } else {
        this._oTextArea.attachLiveChange(this._liveChangeHeightHandler, this);
    }

    this._oTextArea.attachLiveChange(this.liveChangeMonitor, this);

    // create button
    this._oButton = new sap.m.Button(this.getId()+"-add", {
        text: sap.ca.ui.utils.resourcebundle.getText("notes.addNoteButton"),
        type: sap.m.ButtonType.Emphasized,
        press: jQuery.proxy(function (event) {
            this.fireAddNote({
                value: this._oTextArea.getValue()
            });
            this._oTextArea.setValue('');
            this._oTextArea.setHeight('auto');
        }, this)
    });
    this._oButton.setParent(this);
    this._oButton.sParentAggregationName = "fake"; // This is only to prevent errors when assigning the control to FlexBox

};

sap.ca.ui.Notes.prototype.liveChangeMonitor = function (oEvent) {
    if (oEvent.mParameters.newValue.length === this.getTextMaxLength()) {
        var messageText = sap.ca.ui.utils.resourcebundle.getText(
            "TextOverlimit", [ this.getTextMaxLength() ]);

        sap.m.MessageToast.show(messageText);
    }
};

sap.ca.ui.Notes.prototype.exit = function () {
    if (sap.m.List.prototype.exit) {
        sap.m.List.prototype.exit.apply(this);
    }
    if( this._oFlexBox ){
        this._oFlexBox.destroy();
        this._oFlexBox = null;
    }
    this._oTextArea.destroy();
    this._oButton.destroy();
};

sap.ca.ui.Notes.prototype.setTextMaxLength = function (iTextMaxLength) {
    if (iTextMaxLength > 1000) {
        jQuery.sap.log.warn("Notes maximum length set to "
            + iTextMaxLength
            + ", which is greater than the maximum length allowed. TextMaxLength will be reset to 1000 characters");
        iTextMaxLength = 1000;
    }

    this._oTextArea.setProperty("maxLength", iTextMaxLength, true);
    this.setProperty("textMaxLength", iTextMaxLength);
};


/**
 *  Clear the textarea content
 */
sap.ca.ui.Notes.prototype.clear = function() {
    this._oTextArea.setValue("");
};

/**
 *  Reset
 */
sap.ca.ui.Notes.prototype.reset = function() {
    this.clear();

    // reset growing metadata
    this._oGrowingDelegate && this._oGrowingDelegate.reset();
};

sap.ca.ui.Notes.prototype.setPlaceholder = function (sPlaceholder) {
    this._oTextArea.setProperty("placeholder", sPlaceholder, true);
    this.setProperty("placeholder", sPlaceholder);
};

sap.ca.ui.Notes.prototype._liveChangeHeightHandler = function (oEvent) {
    var $oTextArea = this.$().find("textarea");
    var oTextAreaDomRef = $oTextArea.get(0);

    oTextAreaDomRef.style.overflow = "hidden";
    // from SO, question #454202
    oTextAreaDomRef.style.height = "auto";
    oTextAreaDomRef.style.height = oTextAreaDomRef.scrollHeight + "px";
};

sap.ca.ui.Notes.prototype._liveChangePhoneHeightHandler = function (oEvent) {
    var $oTextArea = this.$().find("textarea");
    var oTextAreaDomRef = $oTextArea.get(0);

    if (!this.textAreaDefaultHeight) {
        this.textAreaDefaultHeight = oTextAreaDomRef.scrollHeight;
    }

    if (this.textAreaDefaultHeight == oTextAreaDomRef.scrollHeight) {
        $oTextArea.height(oTextAreaDomRef.scrollHeight);
        oTextAreaDomRef.style.overflow = "hidden";
    }

    if (this.textAreaDefaultHeight < oTextAreaDomRef.scrollHeight && !this.sThreeRowHeight) {
        this.sThreeRowHeight = oTextAreaDomRef.scrollHeight;
        $oTextArea.height(oTextAreaDomRef.scrollHeight);
        oTextAreaDomRef.style.overflow = "hidden";

    }
    if (this.sThreeRowHeight < oTextAreaDomRef.scrollHeight && !this.sFourRowHeight && this.sThreeRowHeight) {
        this.sFourRowHeight = oTextAreaDomRef.scrollHeight;
        $oTextArea.height(oTextAreaDomRef.scrollHeight);
        oTextAreaDomRef.style.overflow = "hidden";
    }

    if (this.sFourRowHeight < oTextAreaDomRef.scrollHeight && this.sFourRowHeight && this.sThreeRowHeight) {
        $oTextArea.height(this.sFourRowHeight);
        oTextAreaDomRef.style.overflow = "auto";
    }
};

sap.ca.ui.Notes.prototype._getFlexBox = function(){
    if(!this._oFlexBox){
        this._oTextArea.setLayoutData( new sap.m.FlexItemData({growFactor: 1}));
        try{
            this._oFlexBox = new sap.m.HBox({items:[this._oTextArea,this._oButton]});
        } catch(e){
            jQuery.sap.log.info("Error is catch because _oTextArea and _oButton are not part of any aggregation on this control, which is ok.");
        }
    }
    return this._oFlexBox;
};

sap.ca.ui.Notes.prototype.onAfterRendering = function() {
    if (sap.m.List.prototype.onAfterRendering) {
        sap.m.List.prototype.onAfterRendering.apply(this);
    }
    if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version == 9) {
        var textArea = this.$().find("textarea");
        var flexItem = textArea.parents('.sapMFlexItem').first();
        flexItem.css('height','auto');
    }
};
