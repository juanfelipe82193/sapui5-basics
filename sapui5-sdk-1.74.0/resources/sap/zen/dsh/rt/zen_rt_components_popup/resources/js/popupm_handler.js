define("zen.rt.components.popup/resources/js/popupm_handler", ["sap/zen/basehandler", "css!../css/component.css"], function(BaseHandler){	
	
	var PopupmHandler = function() {
		"use strict";

		var me = this;

		BaseHandler.apply(me, arguments);
		
		var dispatcher = BaseHandler.dispatcher;
				  
		function init(oPanel, oControlProperties) {
			var aChildren = oControlProperties.content;
			var oAbsLayout = oPanel.getContent()[0];
	
			if (aChildren) {
				me.updateChildren(aChildren, oPanel, function (oNewControl, iIndex) {
					dispatcher.insertIntoAbsoluteLayoutContainer(oAbsLayout, oNewControl, iIndex);
				}, function (oControlToDelete) {
					oAbsLayout.removeContent(oControlToDelete);
				});
	
			}
		}
		
		this.applyForChildren = function(oPanel, fFunclet) {
			var absLayout = oPanel.getContent()[0];
			var children = absLayout.getContent();
			for ( var i = 0; i < children.length; i++) {
				var oControl = children[i];
				if (oControl) {
					fFunclet(oControl);
				}
			}
		};		
		
		me.getDecorator = function() {
			return "PopupDecorator";
		};
		
		me.getType = function() {
			return "popupm";
		};
						
		me.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, iIndex) {
			jQuery.sap.require("sap.ui.core.Popup");			
			jQuery.sap.require('sap.m.Panel');
			
			var panel = new sap.m.Panel({
				content:[this.createAbsoluteLayout()]
			}).addStyleClass('zenmpopup');
			
			panel.custProp = {}; // for storing local properties

			setCommand(panel, 'CLOSE', oControlProperties.command);
			setOriginalPositions(panel, oComponentProperties);

			fAppendToParentFunclet(panel, iIndex);				
			sap.zen.Dispatcher.instance.updateComponentProperties(panel, oComponentProperties);
			
			init(panel, oControlProperties);
			
			me.updatePanelBg(panel, oControlProperties);

			if(sap.zen.designmode)
				panel.addStyleClass('zenborder');
			else {
				panel.addEventDelegate({
					onAfterRendering:function(ev){
						ev.srcControl.removeEventDelegate(this)
						panel.setVisible(false);
						$(panel.getParent().getDomRef()).addClass('zenmpopuphidden');
					}
				});
			}
			
			return panel;			
		};
		
		me.update = function(oControl, oControlProperties, oComponentProperties) {			
			oControlProperties = oControlProperties || {};

			init(oControl, oControlProperties);

			me.updatePanelBg(oControl, oControlProperties);
			
			var popup = oControl.custProp.popup;							

			if (!sap.zen.designmode) {
				if (oControlProperties.show===false)
					me.hide(oControl, oControlProperties);				
				else if (oControlProperties.show===true || (popup && popup.isOpen()))
					me.show(oControl, oControlProperties, oComponentProperties);
			}
			
			return oControl;
		};
				
		//////////////////////////////////
		//
		// local util functions
		//
		/////////////////////////////////
		
		me.updatePanelBg = function(oPanel, oControlProperties) {
			if (oPanel && oControlProperties.backgroundDesign) {
				jQuery.sap.require('sap.m.BackgroundDesign');
				if (oControlProperties.backgroundDesign === 'TRANSPARENT')
					oPanel.setBackgroundDesign(sap.m.BackgroundDesign.Transparent)
				else if (oControlProperties.backgroundDesign === 'SOLID')
					oPanel.setBackgroundDesign(sap.m.BackgroundDesign.Solid)
				else if (oControlProperties.backgroundDesign === 'TRANSLUCENT')
					oPanel.setBackgroundDesign(sap.m.BackgroundDesign.Translucent)
			}			
		};
				
		me.show = function(oControl, oControlProperties, oComponentProperties) {
			var popup = oControl.custProp.popup;
			var update = true;
			
			if(!popup) {
				update = false;
				popup = me.createPopup(oControl, oControlProperties);

				if (oControlProperties.openCentered) {
					me.repositionPopup(popup);
					popup.zenOpenCentered = true;
				}

				// UI5 by default sets the height and width of the popup to 100% respectively.  If the
				// popup has height and width set to auto, it'll be ignored because of height and width of 100%.
				// As a workaround, we preemtively set the height and width to auto before opening 
				// the popup if the height and width are set to auto.
				popup.getContent().toggleStyleClass('autoHeight',isAuto(oComponentProperties.height));
				popup.getContent().toggleStyleClass('autoWidth',isAuto(oComponentProperties.width));
				
				popup.open();
			}
						
			if (!oControlProperties.openCentered && !popup.zenOpenCentered) {
				var originalPositions = getOriginalPositions(oControl, oComponentProperties);

				var unit = 'px';
				var _top = isAuto(originalPositions.topmargin)?originalPositions.topmargin:originalPositions.topmargin+unit;
				var _right = isAuto(originalPositions.rightmargin)?originalPositions.rightmargin:originalPositions.rightmargin+unit;
				var _bottom = isAuto(originalPositions.bottommargin)?originalPositions.bottommargin:originalPositions.bottommargin+unit;
				var _left = isAuto(originalPositions.leftmargin)?originalPositions.leftmargin:originalPositions.leftmargin+unit;
				var _height = isAuto(oComponentProperties.height)?oComponentProperties.height:oComponentProperties.height+unit;
				var _width = isAuto(oComponentProperties.width)?oComponentProperties.width:oComponentProperties.width+unit;

				_width = dispatcher.calcWidthUseOrderOfPriority(_left, _right, _width);
				_height = dispatcher.calcWidthUseOrderOfPriority(_top, _bottom, _height);
								
				if (oControl.getDomRef()) {					
					var attrs = {};
					if (_top) 
						attrs.top = _top;
					if (_right) 
						attrs.right = _right;
					if (_bottom) 
						attrs.bottom = _bottom;
					if (_left) 
						attrs.left = _left;
					if (_height) 
						attrs.height = _height;
					if (_width) 
						attrs.width = _width;

					popup.getContent().toggleStyleClass('autoHeight',isAuto(oComponentProperties.height));
					popup.getContent().toggleStyleClass('autoWidth',isAuto(oComponentProperties.width));						

					$(oControl.getDomRef()).css(attrs);					
				}
			}
			else {
				if (update)
					setTimeout(function(){me.repositionPopup(popup)},10);
			}
		};
		
		me.popupOpened = function(ev) {
			var popupContent = ev.oSource.getContent();
			
			// ANG: It's crucial to maually add a tabindex to the first child of the popup
			// so that UI5 doesn't trigger a blur event when clicking inside the popup IF the
			// dimension of the popup is greater than its content.  This could happen if someone
			// manually sets a height and width for the popup (default for design studio) or adds
			// a layout control (doesn't have tabindex) as the first child of the popup
			 
			$(popupContent.getDomRef()).attr("tabindex", 0);
			if (ev.oSource.getAutoClose())
				$(popupContent.getDomRef()).focus();
		};
		
		me.resizeHandler = function() {		
			var popups = getOpenCenterPopups();
			for (var p in popups) {
				me.repositionPopup(popups[p]);
			}
		};
		
		me.repositionPopup = function(popup) {
			if (popup)
				popup.setPosition("center center", "center center", window, "0 0", "fit");			
		};
		
		me.hide = function(oControl) {
			var popup = oControl.custProp.popup;
			if (popup && popup.isOpen())
				popup.close();
		};
		
		
		me.createPopup = function(oControl, oControlProperties) {
			if(oControlProperties.modal)
				oControlProperties.autoclose = false;			
						
			oControl.setVisible(true);
			var popup = new sap.ui.core.Popup(oControl, 			// content
									!!oControlProperties.modal, 	// modality
									true, 							// shadow
									!!oControlProperties.autoclose	// autoclose
									);
			
			popup.attachClosed(function() {
				me.handlePopupClosed(oControl);
			});

			popup.attachOpened(me.popupOpened);

			if (oControlProperties.openCentered)
				addOpenCenterPopup(popup);
			
			oControl.custProp.popup = popup;
						
			return popup;
		};
		
		me.handlePopupClosed = function (oControl) {
			var commandStr = getCommand(oControl, 'CLOSE');
			if(commandStr) {
				var command = me.prepareCommand(commandStr,"__VALUE__", "false");
				eval(command);
			}
						
			var popup = oControl.custProp.popup;
			if(popup) {
				removeOpenCenterPopup(popup);
				popup.destroy();
				oControl.custProp.popup = null;
			}
		};
				
		//////////////////////////////////////////////
		// getters and setters for local properties
		//////////////////////////////////////////////
		
		function isAuto(sProperty) {
			return sProperty === undefined || sProperty === "auto";
		}				
		
		function setOriginalPositions(oControl, oComponentProperties) {
			if (oControl.custProp) {
				if (!oControl.custProp.positions)
					oControl.custProp.positions = {};
				oControl.custProp.positions.topmargin = oComponentProperties.topmargin;
				oControl.custProp.positions.leftmargin = oComponentProperties.leftmargin;
				oControl.custProp.positions.rightmargin = oComponentProperties.rightmargin;
				oControl.custProp.positions.bottommargin = oComponentProperties.bottommargin;
			}			
		}

		function getOriginalPositions(oControl, oComponentProperties) {
			var c;
			if (oControl.custProp && oControl.custProp.positions)
				c = oControl.custProp.positions;
			
			//////////////////////////////////////////////////////////////
			// overwrite original positions if updated ones are available
			/////////////////////////////////////////////////////////////		
			if (c) {
				if (oComponentProperties.leftmargin)
					c.leftmargin = oComponentProperties.leftmargin; 
				if (oComponentProperties.topmargin)
					c.topmargin = oComponentProperties.topmargin; 
				if (oComponentProperties.rightmargin)
					c.rightmargin = oComponentProperties.rightmargin; 
				if (oComponentProperties.bottommargin)
					c.bottommargin = oComponentProperties.bottommargin; 
			}
			
			return c;
		}
		
		function getCommand(oControl, type) {
			var c;
			if (oControl.custProp && oControl.custProp.commands)
				c = oControl.custProp.commands[type];
			return c;
		}
		
		function setCommand(oControl, type, command) {
			if (oControl.custProp) {
				if (!oControl.custProp.commands)
					oControl.custProp.commands = {};
				oControl.custProp.commands[type] = command;
			}			
		}
		
		
		function removeOpenCenterPopup(popup) {
			if (me.openCenterPopups && me.openCenterPopups[popup.getId()]) {
				delete me.openCenterPopups[popup.getId()];
				me.openCenterPopupsCount--;
				
				if (me.openCenterPopupsCount === 0) {
					$(window).off('resize', me.resizeHandler);
				}
			}
		}

		function addOpenCenterPopup(popup) {
			if (!me.openCenterPopups) {
				me.openCenterPopups = {};
				me.openCenterPopupsCount = 0;
			}
			me.openCenterPopups[popup.getId()] = popup;
			
			if (me.openCenterPopupsCount === 0)
				$(window).on('resize', me.resizeHandler);
			
			me.openCenterPopupsCount++;
		}
		
		function getOpenCenterPopups() {
			return me.openCenterPopups;
		}
	};
	
	var handler = new PopupmHandler();
	
	return handler;
	
});
