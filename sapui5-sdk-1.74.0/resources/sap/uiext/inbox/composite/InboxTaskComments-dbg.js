/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.composite.InboxTaskComments.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxTaskComments");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxTaskComments.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxTaskComments
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskComments
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxTaskComments", /** @lends sap.uiext.inbox.composite.InboxTaskComments.prototype */ { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * Sender for the comment feeder
		 */
		feederSender : {type : "string", group : "Data", defaultValue : null},

		/**
		 * URL to the thumbnail image for the comment feeder.
		 */
		feederThumbnailSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

		/**
		 * Boolean value for visibilty of comment feeder
		 */
		showFeeder : {type : "boolean", group : "Data", defaultValue : true},

		/**
		 * Boolean value for visibility of header
		 */
		showHeader : {type : "boolean", group : "Misc", defaultValue : false}
	},
	aggregations : {

		/**
		 * URL to the thumbnail image.
		 */
		comments : {type : "sap.uiext.inbox.composite.InboxComment", multiple : true, singularName : "comment"}, 

		/**
		 * aggregation for busy indicator
		 */
		busyIndicator : {type : "sap.uiext.inbox.composite.InboxBusyIndicator", multiple : false, visibility : "hidden"}
	},
	events : {

		/**
		 * Event is raised when submit on the feeder is pressed.
		 */
		commentSubmit : {}
	}
}});

jQuery.sap.require("sap.ui.core.theming.Parameters");
jQuery.sap.require("sap.ui.ux3.Feeder");
jQuery.sap.require("sap.uiext.inbox.composite.InboxBusyIndicator");

/**
 * This file defines behavior for the control,
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.init = function(){
	this.maxComments = 2; // max. number of comments displayed initially
	this.allComments = false; // initially render only maxComments
	this.rb = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	this.initCommentFeeder();
};

sap.uiext.inbox.composite.InboxTaskComments.prototype.initCommentFeeder = function(){
	// create comment feeder if needed
	if (!this.oCommentFeeder) {
		this.oCommentFeeder = new sap.ui.ux3.Feeder( this.getId()+'-InboxTaskCommentFeeder', {
			type: sap.ui.ux3.FeederType.Comment, thumbnailSrc: this.getFeederThumbnailSrc()
		}).setParent(this);
		this.oCommentFeeder.attachEvent('submit', this.handleCommentFeederSubmit, this); // attach event this way to have the right this-reference in handler
		this.showCommentFeeder = true;
	}
};

sap.uiext.inbox.composite.InboxTaskComments.prototype.exit = function(){
	if (this.oCommentFeeder) {
		this.oCommentFeeder.destroy();
		delete this.oCommentFeeder;
	}
	this.rb = undefined;
	this.showCommentFeeder = undefined;
	this.oText = undefined;
};

/**
 * handler for click event
 *
 * @private
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.onclick = function(oEvent){
	var sTargetId = oEvent.target.getAttribute( 'ID' );

	if(sTargetId){
		switch ( sTargetId ){
		case ( this.getId() + '-all' ):
			// Click on sender
			this.showAllComments();
		break;
		}
	}
	oEvent.stopPropagation(); //to prevent comment chunks to propagate event to parentChunk
};

/**
 * After rendering, bind the keyupHandler to the input field of feeder
 * 
 *
 * @private
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.onAfterRendering = function () {
	
	jQuery.sap.byId(this.getId()+'-InboxTaskCommentFeeder'+"-input").bind("keyup",this, this.keyupHandler);
	
};


/**
 * handler for keyup
 *
 * Restrict the number of characters to 500 in a comment
 * @private
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.keyupHandler = function(oEvent){
	var that = oEvent.data;
	var sInputId = that.getId()+'-InboxTaskCommentFeeder'+"-input";
	var sInputText = jQuery.sap.byId(sInputId).text();
	var MAX_CHARACTER_LENGTH_FOR_COMMENTS=500;
	
	if(sInputText.length > MAX_CHARACTER_LENGTH_FOR_COMMENTS)
	{		
		jQuery.sap.byId(sInputId).text(sInputText.slice(0,MAX_CHARACTER_LENGTH_FOR_COMMENTS));		
		that.placeCaretAtEnd(document.getElementById(sInputId));
	}
		
}



	
sap.uiext.inbox.composite.InboxTaskComments.prototype.placeCaretAtEnd = function(commentTextElement) {   //Place cursor at end after the entered text is sliced 
	
	commentTextElement.focus();
	if (typeof window.getSelection != "undefined"
	&& typeof document.createRange != "undefined") 
	{
	var range = document.createRange();
	range.selectNodeContents(commentTextElement);
	range.collapse(false);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
	} 
	
	else if (typeof document.body.createTextRange != "undefined")
	{
	var textRange = document.body.createTextRange();
	textRange.moveToElementText(commentTextElement);
	textRange.collapse(false);
	textRange.select();
	} 
	
};


/**
 * show all comments
 * rerender comment section
 *
 * @private
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.showAllComments = function(){

	this.allComments = !this.allComments;

	var $commentSection = jQuery.sap.byId(this.getId() + " > section"); // use sap function instead of jQuery child selector because of escaping ID
	if ($commentSection.length > 0) {
		var rm = sap.ui.getCore().createRenderManager();
		this.getRenderer().renderComments(rm, this);
		rm.flush($commentSection[0]);
		rm.destroy();
	}

};

/**
 * Handler for Comment feeder submit event
 *
 * @private
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.handleCommentFeederSubmit = function(oEvent){
	var sSanitizedText = this._sanitizeText(oEvent.getParameter('text'));
	//this behavior is different from the actual Feedchunk, because we need to add the comment first before displaying the comment.
	this.fireCommentSubmit({text: sSanitizedText});
};

/*
 * Overwrite standard getter for feeder thumbnail source:
 * If not set and feedChunk is child of a Feed or FeedChunk use the thumbnailsource of the parent
 * So it must not be set manual for each sub-control and is always synchron
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.setFeederThumbnailSrc = function(value) {
	this.setProperty("feederThumbnailSrc", value);

	if (this.oCommentFeeder) {
		this.oCommentFeeder.setThumbnailSrc(value);
	}
};


/*
 * Overwrite generated function
 */
sap.uiext.inbox.composite.InboxTaskComments.prototype.insertComment = function(oComment, iIndex) {

	this.insertAggregation("comments", oComment, iIndex);
	this.initCommentFeeder();
	return this;

};

sap.uiext.inbox.composite.InboxTaskComments.prototype.addComment = function(oComment) {

	this.addAggregation("comments", oComment);
	this.initCommentFeeder();
	return this;

};

sap.uiext.inbox.composite.InboxTaskComments.prototype._sanitizeText = function(sText) {
	//sText = jQuery.trim(sText);
	
	var sSanitizedText = jQuery.sap._sanitizeHTML(sText);
	return sSanitizedText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
		
};

sap.uiext.inbox.composite.InboxTaskComments.prototype.showBusy = function(bShowBusy) {
	if(bShowBusy) {
		var oBusyIndicator =  new sap.uiext.inbox.composite.InboxBusyIndicator();
		oBusyIndicator.setBusy(true);
		this.setAggregation('busyIndicator',oBusyIndicator);
	} else {
		this.destroyAggregation('busyIndicator');
	}
};