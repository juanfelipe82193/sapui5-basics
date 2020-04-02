define("zen.rt.components.splitter/resources/js/splitter_handler", ["sap/zen/basehandler"], 
function(BaseHandler){

	/**************************************************************************************************************************************
	 * Splitter Handler
	 **************************************************************************************************************************************/
	var SplitterHandler = function() {
		"use strict";

		BaseHandler.apply(this, arguments);
		
		var dispatcher = BaseHandler.dispatcher;
		
		var that = this;

		/**
		 * Create the Control
		 */
		this.createAndAdd = function(oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, oArgForFunclet) {
			// create the UI5 Splitter Control via Proxy
			var loControl = this.createDefaultProxy(oControlProperties["id"]);			
			fAppendToParentFunclet(loControl, oArgForFunclet, oComponentProperties);		
			sap.zen.Dispatcher.instance.updateComponentProperties(loControl, oComponentProperties, fAppendToParentFunclet);
			
			// initialize the Splitter
			this.init(loControl, oControlProperties, oComponentProperties);
			
			// attach the "onAfterRendering" event
			loControl.mFnOrigOnAfterRendering = loControl.onAfterRendering;
			loControl.onAfterRendering = function() {
				that.onAfterRendering(loControl);
			};
			
			// attach OnResize
			loControl.attachResize(function(oEvent) {
				// we only want to capture the User Event
				if (loControl.mIsRendering) {
					return;
				}
				
				that.resize(loControl, oEvent.getParameter("newSizes"));
			});
			
			return loControl;
		};
		
		/**
		 * Update the Control
		 */
		this.update = function(oControl, oControlProperties, oComponentProperties) {			
			if (oControlProperties) {
				this.init(oControl, oControlProperties, oComponentProperties);
			}
			
			return oControl;
		};

		/**
		 * Initialize the Control (Create, Update)
		 */
		this.init = function(oControl, oControlProperties, oComponentProperties) {
			if (!oControlProperties) {
				return;
			}
			
			oControl.moControlProperties = oControlProperties;
			oControl.mIsRendering = true;
			
			// update the children
			var ltChildren = oControlProperties.content;		
			this.updateChildren(ltChildren, oControl, function(oContentArea, i) {
				if (oContentArea.getProperty("visible") === true) {
					oControl.addContentArea(oContentArea);
				} else {
					oControl.removeContentArea(oContentArea);
				}
			}, function(oContentAreaToDelete){
				oControl.removeContentArea(oContentAreaToDelete);
			});
			
			// update the control
			oControl.addStyleClass("zenborder");
			oControl.setOrientation(oControlProperties.orientation);
			
			// update the control content area sizes
			if (ltChildren.length === 1) {
				oControl.getContentAreas()[0].getLayoutData().setSize("100%");
			}
		};
		
		/**
		 * Handle OnAfterRendering Event
		 */
		this.onAfterRendering = function(oControl) {
			if (oControl.mFnOrigOnAfterRendering) {
				oControl.mFnOrigOnAfterRendering();
			}
			oControl.mIsRendering = false;
		}
		
		/**
		 * Resize the Control
		 */
		this.resize = function(oControl, tNewSizes) {
			// only process if event handler exists
			if (!oControl.moControlProperties.onResize) {
				return;
			}
			
			// if sap-keep-alive is set to true in the URL then the Control might be hidden -> in this case the event should not be processed
			var loDomRef = oControl.getDomRef();
			if (loDomRef) {
				if (loDomRef.offsetWidth === 0 && loDomRef.offsetHeight === 0) {
					return;
				}
			}
			
			/* try and only resize areas with fix size (px)
			 * - determine flexible and fix sizes from the control settings
			 * - try and only apply fix sizes to fix sizes of the control settings
			 * - collect and apply new sizes
			 */ 
			
			// determine fix and flexible sizes
			var ltAutoFit = [], ltFixFit = [];
			for (var i=0; i<tNewSizes.length; i++) {
				var lNewSize = tNewSizes[i];
				
				var lOldSize = oControl.getContentAreas()[i].moControlProperties.size;
				var lResult = lOldSize.search(/[auto|%](.)*/g);
				if (lResult >= 0) {
					ltAutoFit.push(i);
				} else {
					ltFixFit.push(i);
				}
			}
			
			// collect new sizes
			var ltNewSizes = [];
			for (var i=0; i<tNewSizes.length; i++) {
				var lNewSize = tNewSizes[i];
				
				if (i == 0 && ltFixFit.length <= 0) {
					ltNewSizes[i] = lNewSize + "px";
					continue;
				}
				
				if (ltAutoFit.indexOf(i) >= 0) {
					ltNewSizes[i] = oControl.getContentAreas()[i].moControlProperties.size;
				} else {
					ltNewSizes[i] = lNewSize + "px";
				}
			}
			
			// apply new sizes: dispatch event to control handler
			var loJson = {
					tNewSizes : ltNewSizes
			};
			
			var lCommand = that.prepareCommand(oControl.moControlProperties.onResize, "__VALUE__", JSON.stringify(loJson));
			eval(lCommand);
		};
		
		/**
		 * the UI5 Proxy Class for creating the UI5 Control
		 */
		this.getDefaultProxyClass = function(){
			return ["sap.ui.layout.Splitter"];
		};

		this.provideFunctionMapping = function(){
			return [];
		};

		this.getDecorator = function() {
			return "SplitterDecorator";
		};

		this.getType = function() {
			return "splitter";
		};

		this.applyForChildren = function(oControl, fFunclet) {
			var ltContentareas = oControl.getContentAreas();
			if (ltContentareas) {
				for (var lContentArea = 0; lContentArea < ltContentareas.length; lContentArea++) {
					var loContentArea = ltContentareas[lContentArea];
					fFunclet(loContentArea);
				}
			}
		};

	};
	
	return new SplitterHandler();
});

/**************************************************************************************************************************************
 * ContentArea Handler
 **************************************************************************************************************************************/
sap.zen.ContentAreaHandler = function() {
	"use strict";
	
	sap.zen.BaseHandler.apply(this, arguments);
	
	var dispatcher = sap.zen.Dispatcher.instance;
	
	var that = this;


	/**
	 * Create the Control
	 */
	this.createAndAdd = function(oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, oArgForFunclet) {
		var loControl = this.createAbsoluteLayout(oControlProperties["id"]);
		fAppendToParentFunclet(loControl, oArgForFunclet);
		
		this.init(loControl, oControlProperties, oComponentProperties);
		
		return loControl;
	};


	/**
	 * Update the Control
	 */
	this.updateComponent = function(oControl, oControlProperties, oComponentProperties) {
		if (oControlProperties) {
			this.init(oControl, oControlProperties, oComponentProperties);
		}
		
		return oControl;
	};


	/**
	 * Initialize the Control (Create, Update)
	 */
	this.init = function(oControl, oControlProperties, oComponentProperties) {
		if (!oControlProperties) {
			return;
		}
		
		oControl.moControlProperties = oControlProperties;
		
		var ltChildren = oControlProperties.content;
		if (ltChildren) {
			this.updateChildren(ltChildren, oControl, function(oNewControl, iIndex) {
				dispatcher.insertIntoAbsoluteLayoutContainer(oControl, oNewControl, iIndex);
			}, function(oControlToDelete){
				oControl.removeContent(oControlToDelete);
			});
		}
		
		// set resizable
		oControl.getLayoutData().setResizable(oControlProperties.resizable);
		
		// set container size
		oControl.getLayoutData().setSize(oControlProperties.size);
		
		// set container minimum size (does not support "auto", does not have unit)
		var lMinSize = oControlProperties.minimumSize;
		if ("auto" === lMinSize) {
			lMinSize = 50;
		}
		else {
			lMinSize = parseInt(lMinSize);
		}
		oControl.getLayoutData().setMinSize(lMinSize);
	}

	this.applyForChildren = function(oContentArea, fFunclet) {
		var ltChildren = oContentArea.getContent();
		for (var lChild = 0; lChild < ltChildren.length; lChild++) {
			var loControl = ltChildren[lChild];
			if (loControl) {
				fFunclet(loControl);
			}
		}
	};

};

sap.zen.ContentAreaHandler.instance = new sap.zen.ContentAreaHandler();
// AbsLayoutDecorator
sap.zen.Dispatcher.instance.addHandlers("contentarea", sap.zen.ContentAreaHandler.instance, "ContentAreaDecorator");