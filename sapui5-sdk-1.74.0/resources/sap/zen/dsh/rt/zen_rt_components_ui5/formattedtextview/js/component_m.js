define("zen.rt.components.ui5/formattedtextview/js/component_m", ["css!../css/component.css"], function() {

sap.ui.core.HTML.extend("com.sap.ip.bi.FormattedTextView", {
		// the control API:
		metadata : {
			properties : {
				"height" : "sap.ui.core.CSSSize",
				"width"  : "sap.ui.core.CSSSize",
				"aStyleClasses" : "string[]"
			}
		},
	
		initDesignStudio: function() {
			/*
			 * these are the rules for the FormattedTextView
			 */
			this._ftv = { };
	
			// rules for the allowed attributes
			this._ftv.ATTRIBS = {
				'span::class' : 1,
				'div::class' : 1,
				'div::id' : 1,
				'span::id' : 1,
				'embed::data-index' : 1
			};
	
			// rules for the allowed tags
			this._ftv.ELEMENTS = {
				// Text Module Tags
				'abbr' : 1,
				'acronym' : 1,
				'address' : 1,
				'blockquote' : 1,
				'br' : 1,
				'cite' : 1,
				'code' : 1,
				'dfn' : 1,
				'div' : 1,
				'em' : 1,
				'h1' : 1,
				'h2' : 1,
				'h3' : 1,
				'h4' : 1,
				'h5' : 1,
				'h6' : 1,
				'kbd' : 1,
				'p' : 1,
				'pre' : 1,
				'q' : 1,
				'samp' : 1,
				'strong' : 1,
				'span' : 1,
				'var' : 1,
	
				// List Module Tags
				'dl' : 1,
				'dt' : 1,
				'dd' : 1,
				'ol' : 1,
				'ul' : 1,
				'li' : 1,
	
				// Special Tags
				// this is the placeholder for the controls
				'embed' : 1
		}	
			},
		fnSanitizeAttribs : function(tagName, attribs) {
			for ( var i = 0; i < attribs.length; i += 2) {
				// attribs[i] is the name of the tag's attribute.
				// attribs[i+1] is its corresponding value.
				// (i.e. <span class="foo"> -> attribs[i] = "class" | attribs[i+1] =
				// "foo")
	
				var sAttribKey = tagName + "::" + attribs[i];
	
				if (this._ftv.ATTRIBS[sAttribKey]) {
					// keep the value of this class
					if (tagName === "embed") {
						var intPattern = /^[0-9]*$/;
						if (!attribs[i + 1].match(intPattern)) {
							// attribs[i + 1] = null;
							return null;
						}
					}
				} else {
					var sWarning = '<' + tagName + '> with attribute [' + attribs[i] + '="' + attribs[i + 1] + '"] is not allowed and cut';
					jQuery.sap.log.warning(sWarning, this);
	
					// to remove this attribute by the sanitizer the value has to be
					// set to null
					attribs[i + 1] = null;
				}
	
			}
			return attribs;
		},
		fnPolicy : function(tagName, attribs) {
			if (this._ftv.ELEMENTS[tagName]) {
				var proxiedSanatizedAttribs = jQuery.proxy(this.fnSanitizeAttribs, this);
				return proxiedSanatizedAttribs(tagName, attribs);
			} else {
				var sWarning = '<' + tagName + '> is not allowed and cut (and its content)';
				jQuery.sap.log.warning(sWarning, this);
			}
		},
	
		renderer : {},
		setHtmlText :  function(sHTMLGiven){
			this.setContent("");
			
			var sHTML = "<div>"+ sHTMLGiven + "</div>";
			var sSanitizedText = "";
			
			// use a proxy for policy to access the control's private variables
			var fnProxiedPolicy = jQuery.proxy(this.fnPolicy, this);
	
			// using the sanitizer that is already set to the encoder
			try{
			sSanitizedText = jQuery.sap._sanitizeHTML(sHTML, {
				tagPolicy : fnProxiedPolicy
			});
			}catch(e){
				// ignore
			}
	
//			this.setProperty("htmlText", sSanitizedText);
			this.setContent(sSanitizedText);
		},
		getHtmlText : function(){
			//Remove the surrounding DIV
			var allContent = this.getContent();
			allContent = allContent.substr(5);
			allContent = allContent.substring(0,allContent.length-6)
			return allContent;
		}
		,
		addStyleClass : function(sClass){
			if(!this.getAStyleClasses()){
				this.setAStyleClasses([]);
			}
			
			var aClasses = this.getAStyleClasses();
			if(aClasses.indexOf(sClass) === -1){
				aClasses.push(sClass);
			}
			
			this.setAStyleClasses(aClasses);
		},
		removeStyleClass : function(sClass){
			if(!this.getAStyleClasses()){
				this.setAStyleClasses([]);
			}
			
			var aClasses = this.getAStyleClasses();
			if(aClasses.indexOf(sClass) !== -1){
				aClasses.splice(aClasses.indexOf(sClass),1);
			}
			
			this.setAStyleClasses(aClasses);
		}, 
		
		// an event handler:
		onAfterRendering : function(evt) { // is called when the Control's area is
											// clicked - no event registration
											// required
			sap.ui.core.HTML.prototype.onAfterRendering.apply(this, [ evt ]);
			
			this.$().addClass("sapUiFTV"); 
	
			var height = this.getHeight();
			var jqThis = this.$();
			if (height !== "auto") {
				// set height
				jqThis.height(height);			
			}
			
			var width = this.getWidth();
			if (width !== "auto") {
				// set height
				jqThis.width(width);			
			}
			
			if(this.getAStyleClasses() && this.getAStyleClasses().length > 0){
				for(var i = 0; i < this.getAStyleClasses().length; i++){
					jqThis.addClass(this.getAStyleClasses()[i]);
	
				}
			}
		}
	});
   return com.sap.ip.bi.FormattedTextView;
});