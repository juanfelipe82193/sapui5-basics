/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library"],function(l){"use strict";var O=l.OptionType;var a={};a.render=function(r,c){if(!this.initializationDone){c.initControls();c.initializationDone=true;r.write("<div");r.writeControlData(c);r.addClass("sapLandviszOptionButton");r.writeClasses();if(c.left!=0)r.addStyle("left",c.left+"px");if(c.top!=0)r.addStyle("top",c.top+"px");if(c.optionOn==O.ENTITY)r.addStyle("position","absolute");if(c.getEnable()==false){r.addStyle("cursor","default");r.addStyle("color","#999999");}else{r.addStyle("cursor","pointer");r.addStyle("color","#00669c");}r.writeStyles();r.write(" >");c.optionBtn.addStyleClass("viewBtn");c.optionBtn.setText("");c.optionBtn.setTooltip(c.getOptionTextTooltip());c.optionBtn.setEnabled(c.getEnable());c.optionBtn.setSelected(c.getSelected());r.renderControl(c.optionBtn);c.optionTextView.addStyleClass("viewText");c.optionTextView.setText(c.getLabel());c.optionTextView.setTooltip(c.getOptionTextTooltip());c.optionTextView.setEnabled(c.getEnable());r.renderControl(c.optionTextView);r.write("</div>");}};return a;},true);
