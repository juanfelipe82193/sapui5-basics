/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ovp/app/resources","sap/ovp/cards/CommonUtils","sap/ovp/app/OVPUtils"],function(O,C,a){"use strict";return{'default':{controllerExtensionTemplate:"sap/ovp/ui/OVPControllerExtensionTemplate",actions:{},aggregations:{DynamicPage:{propagateMetadata:function(e){var t=e.getMetadata().getName();var l=C._getLayer();if(t!=="sap.ovp.ui.EasyScanLayout"&&t!=="sap.ui.core.ComponentContainer"&&!((l&&(l===a.Layers.vendor||l===a.Layers.customer_base))&&t==="sap.ui.comp.smartfilterbar.SmartFilterBar")){return{actions:"not-adaptable"};}},propagateRelevantContainer:false}}},'strict':{actions:{},name:{singular:O&&O.getText("Card"),plural:O&&O.getText("Cards")}}};},false);
