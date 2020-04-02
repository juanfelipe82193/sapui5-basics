/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/comp/designtime/smartform/Group.designtime","sap/base/util/merge"],function(G,m){"use strict";var a=m({},G);a.aggregations.formElements.actions.addODataProperty.changeType="addMultiEditField";return{aggregations:{layout:{ignore:false,propagateMetadata:function(i){if(i.getMetadata().getName()==="sap.ui.comp.smartform.Group"){return a;}}}}};});
