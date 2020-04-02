/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["./library","sap/ui/core/Element"],function(m,E){"use strict";var R=E.extend("sap.makit.Row",{metadata:{deprecated:true,library:"sap.makit",aggregations:{cells:{type:"sap.makit.Column",multiple:true,singularName:"cell"}}}});R.prototype.init=function(){this._datarow={};};R.prototype.addCell=function(c){E.prototype.addAggregation.call(this,"cells",c,false);var i=this.getId();if(!i.endsWith("dummyrows")){this._datarow[c.getName()]=c.getValue();c.attachEvent("_change",this.onCellChanged,this);}};R.prototype.onCellChanged=function(e){if(e.mParameters['name']==="name"){var o=e.mParameters['oldValue'];var n=e.mParameters['newValue'];this._datarow[n]=undefined;if(o&&o!==""){this._datarow[n]=this._datarow[o];this._datarow[o]=null;this._datarow[o]=undefined;delete this._datarow[o];}}else if(e.mParameters['name']==="value"){var c=e.oSource.getName();this._datarow[c]=e.mParameters['newValue'];}};return R;});
