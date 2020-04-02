/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/base/DataType'],function(D){"use strict";var I={replace:function(n){var t=D.getType("sap.ui.core.ID");if(!t.isValid(n)){n=n.replace(/[^A-Za-z0-9_.:]+/g,"_");if(!t.isValid(n)){n="_"+n;}}return n;},getFilterFieldId:function(f,k){return f.getId()+"--filter--"+I.replace(k);},getPropertyKey:function(p){return p.path||p.name;},getView:function(c){var v=null;if(c){var o=c.getParent();while(o){if(o.isA("sap.ui.core.mvc.View")){v=o;break;}o=o.getParent();}}return v;}};return I;},true);
