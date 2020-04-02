/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/XMLTemplateProcessor","sap/ui/model/json/JSONModel","sap/ui/core/util/XMLPreprocessor","sap/ui/core/Fragment","sap/m/MessageToast","sap/ui/mdc/field/InParameter","sap/ui/mdc/field/OutParameter","sap/base/Log"],function(q,X,J,a,F,M,I,O,L){"use strict";var w={};var V={getWaitForPromise:function(){return w;},getValueListCollectionEntitySet:function(v){var m=v.getObject();return m.$model.getMetaModel().createBindingContext("/"+m.CollectionPath);},getValueListProperty:function(p){var v=p.getModel();var m=v.getObject("/");return m.$model.getMetaModel().createBindingContext("/"+m.CollectionPath+"/"+p.getObject());},getValueListInfo:function(f,m,p,c){var k,d,s="",P=m.getObject(p+"@sapui.name"),b,i=[],o=[],e="";return m.requestValueListInfo(p,true).then(function(v){var g=f.getInParameters().length+f.getOutParameters().length===0;v=v[v[""]?"":Object.keys(v)[0]];v.Parameters.forEach(function(h){b="/"+v.CollectionPath+"/"+h.ValueListProperty;var j=v.$model.getMetaModel().getObject(b)||{},l=v.$model.getMetaModel().getObject(b+"@")||{};if(!k&&h.$Type.indexOf("Out")>48&&h.LocalDataProperty.$PropertyPath===P){e=b;k=h.ValueListProperty;d=l["@com.sap.vocabularies.Common.v1.Text"]&&l["@com.sap.vocabularies.Common.v1.Text"].$Path;}if(!s&&j.$Type==="Edm.String"&&!l["@com.sap.vocabularies.UI.v1.HiddenFilter"]&&!l["@com.sap.vocabularies.UI.v1.Hidden"]){s=s.length>0?s+","+h.ValueListProperty:h.ValueListProperty;}if(g&&h.$Type!=="com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"&&h.LocalDataProperty.$PropertyPath!==P){var n="";if(c&&c.length>0){n=c+">/conditions/";}n="{"+n+h.LocalDataProperty.$PropertyPath+"}";if(h.$Type.indexOf("Out")>48){o.push(new O({value:n,helpPath:h.ValueListProperty}));}if(h.$Type.indexOf("In")>48){i.push(new I({value:n,helpPath:h.ValueListProperty}));}}});return{keyValue:k,descriptionValue:d,fieldPropertyPath:e,filters:s,inParameters:i,outParameters:o,valueListInfo:v};}).catch(function(g){var h=g.status&&g.status===404?"Metadata not found ("+g.status+") for value help of property "+p:g.message;L.error(h);M.show(h);});},createValueHelpDialog:function(p,f,t,o,v,s){var b=f.getMetadata().getName(),W=f.getContent&&f.getContent(),c=W.getId(),d=v.filters,i=v.inParameters,e=v.outParameters;function g(){var C=v.valueListInfo.$model.getMetaModel().getObject("/"+v.valueListInfo.CollectionPath+"@"),S=C["@Org.OData.Capabilities.V1.SearchRestrictions"]&&C["@Org.OData.Capabilities.V1.SearchRestrictions"].Searchable;return S===undefined?true:S;}if(!t){if(b.indexOf("FieldValueHelp")>-1){f.setTitle(v.valueListInfo.Label);f.setKeyPath(v.keyValue);f.setDescriptionPath(v.descriptionValue);f.setFilterFields(g()?"$search":"");}}function h(j){var k=X.loadTemplate(j,"fragment"),m=v.valueListInfo,l=new J(m),n=m.$model.getMetaModel(),S=new J({id:f.getId()});return a.process(k,{name:j},{bindingContexts:{valueList:l.createBindingContext("/"),entitySet:n.createBindingContext("/"+m.CollectionPath),source:S.createBindingContext("/")},models:{valueList:l,entitySet:n,source:S}}).then(function(k){var r={path:p,fragmentName:j,fragment:k};if(L.getLevel()===L.Level.DEBUG){V.ALLFRAGMENTS=V.ALLFRAGMENTS||[];V.ALLFRAGMENTS.push(r);}if(V.logFragment){setTimeout(function(){V.logFragment(r);},0);}return F.load({definition:k});});}t=t||h("sap.fe.macros.ValueListTable");if(d.length){o=o||(!s&&h("sap.fe.macros.ValueListFilterBar"));}else{o=Promise.resolve();}return Promise.all([t,o]).then(function(C){var t=C[0],o=C[1];if(t){t.setModel(v.valueListInfo.$model);L.info("Value List XML content created ["+p+"]",t.getMetadata().getName(),"MDC Templating");}if(o){o.setModel(v.valueListInfo.$model);L.info("Value List XML content created ["+p+"]",o.getMetadata().getName(),"MDC Templating");}if(t!==W.getTable()){W.setTable(t);delete w[c];}var j=s?"416px":"Auto";t.setContextualWidth(j);if(o&&o!==f.getFilterBar()){f.setFilterBar(o);}e.forEach(function(k){f.addOutParameter(k);});i.forEach(function(k){f.addInParameter(k);});});},showValueListInfo:function(p,f,s,c){var m=f.getModel(),o=m.getMetaModel(),W=f.getContent&&f.getContent(),b=W.getId(),t=W&&W.getTable&&W.getTable(),d=f&&f.getFilterBar&&f.getFilterBar(),e=t&&d;if(w[b]||e){return;}else{if(!t){w[b]=true;}V.getValueListInfo(f,o,p,c).then(function(v){return V.createValueHelpDialog(p,f,t,d,v,s);}).catch(function(g){var h=g.status&&g.status===404?"Metadata not found ("+g.status+") for value help of property "+p:g.message;L.error(h);M.show(h);});}}};return V;},true);
