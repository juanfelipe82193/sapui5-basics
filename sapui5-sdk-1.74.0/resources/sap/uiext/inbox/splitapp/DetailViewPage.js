/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.splitapp.DetailViewPage");jQuery.sap.require("sap.m.MessageToast");jQuery.sap.require("sap.m.SelectDialog");jQuery.sap.require("sap.uiext.inbox.InboxConstants");jQuery.sap.require("sap.uiext.inbox.InboxUtils");sap.ui.base.Object.extend("sap.uiext.inbox.splitapp.DetailViewPage",{constructor:function(I){sap.ui.base.Object.apply(this);this.oCore=sap.ui.getCore();this.Id=I;this.constants=sap.uiext.inbox.InboxConstants;this._oBundle=this.oCore.getLibraryResourceBundle("sap.uiext.inbox");this.utils=sap.uiext.inbox.InboxUtils;this.useBatch=false;this.isCommentsSupported=false;this.bPhoneDevice=jQuery.device.is.phone;this.detailViewPage=this._create();}});
sap.uiext.inbox.splitapp.DetailViewPage.prototype._create=function(){var d=this.oCore.byId(this.Id+"-detailPage");if(!d){var t=this;var s=new Array();var c=new sap.m.Button(this.Id+"-claimBtn",{text:this._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM"),icon:"sap-icon://locked",enabled:"{SupportsClaim}"});c.attachPress(this,this._handleClaim);s.push(c);var r=new sap.m.Button(this.Id+"-releaseBtn",{text:this._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE"),icon:"sap-icon://unlocked",enabled:"{SupportsRelease}"});r.attachPress(this,this._handleRelease);s.push(r);var b=new sap.m.Bar(this.Id+"-actionsBar",{contentMiddle:s,});d=new sap.m.Page(this.Id+"-detailPage",{title:"{"+this.constants.PROPERTY_NAME_TASK_DEFINITION_NAME+"}",footer:b,showNavButton:jQuery.device.is.phone}).attachNavButtonPress(function(e){sap.ui.getCore().getEventBus().publish('sap.uiext.inbox',"detailPageNavButtonTapped");});var o=new sap.m.ObjectHeader(this.Id+"-objHeader",{title:"{"+this.constants.PROPERTY_NAME_TASK_TITLE+"}",attributes:[new sap.m.ObjectAttribute(this.Id+"-objDesc",{text:"{Description/Description}"}),new sap.m.ObjectAttribute().bindProperty("text",this.constants.PROPERTY_NAME_PRIORITY,function(_){if(_){var a=t._oBundle.getText(t.constants.prioTooltip[_]);a=(a=="")?_:a;a=t._oBundle.getText("INBOX_PRIORITY")+" : "+a;this.setTooltip(a);return a;}return"";}),new sap.m.ObjectAttribute().bindProperty("text","CompletionDeadLine",function(v){if(v!=null&&v!=""){var _=t._oBundle.getText("INBOX_DUE_DATE")+" : "+t.utils._dateFormat(v);this.setTooltip(_);return _;}})]}).setTitleActive(true);o.attachTitlePress(this,this._handleTaskTitlePress);d.addContent(o);var i=new sap.m.IconTabBar(this.Id+"-iconTabBar",{items:[new sap.m.IconTabFilter(this.Id+"-custAttrTab",{icon:"sap-icon://hint",iconColor:sap.ui.core.IconColor.Default,key:"customAttr"})]});i.attachSelect(this,this._handleSelectIconTabFilter);d.addContent(i);d.addDelegate({onAfterRendering:function(){}});}return d;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._setTcmServiceURL=function(v){this.tcmServiceURL=v;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._setTcmConfiguration=function(t){this.useBatch=t.useBatch?t.useBatch:false;this.isCommentsSupported=t.isCommentsSupported?t.isCommentsSupported:false;this._createCommentsView();};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCommentsView=function(){var i=this.oCore.byId(this.Id+'-iconTabBar');if(this.isCommentsSupported){i.addItem(new sap.m.IconTabFilter(this.Id+"-commentsTab",{icon:"sap-icon://collaborate",iconColor:sap.ui.core.IconColor.Default,key:"comments"}));}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getOModel=function(){if(!this.oTCMModel){this.oTCMModel=this.detailViewPage.getModel('inboxTCMModel');}return this.oTCMModel;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getPageModel=function(){if(!this.model){this.model=this.detailViewPage.getModel();}return this.model;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype.getPage=function(){return this.detailViewPage;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleClaim=function(e,t){t.executeActionOnTask('Claim');};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleRelease=function(e,t){t.executeActionOnTask('Release');};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleForward=function(e,t){t.executeActionOnTask('Forward');};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleTaskTitlePress=function(e,t){t.oCore.getEventBus().publish('sap.uiext.inbox',"detailPageTaskTitleSelected",{context:t.detailViewPage.getBindingContext()})};
sap.uiext.inbox.splitapp.DetailViewPage.prototype.executeActionOnTask=function(a,f){var i=(a==='Forward')?true:false;var f=i?f:'';var s=[],b=[],c=[],d=[];var e=[];var g="'",h="'",j="'";var k,l;var C=this.detailViewPage.getBindingContext();k=this._getPageModel().getProperty("InstanceID",C);l=this._getPageModel().getProperty("SAP__Origin",C);b.push(C);s.push(k);c.push(l);g=g+k+"'";h=h+l+"'";if(i){j="'"+f+"'";}if(s!=null||s.length>0){var I,r,m,n;if(a==="Complete"){a="Complete";}if(a==="Claim"){a="Claim";}if(a==="Release"){a="Release";}if(i){a="Forward";}this.defaultActionHandler(a,g,h,s,c,b,j);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype.defaultActionHandler=function(a,c,b,s,d,e,f){var I,r,g,h;var i=(a==='Forward')?true:false;var S=e;var t=this;var j=s.length;var T=t._getPageModel().getProperty("TaskTitle",e[0]);I='/'+a+"?InstanceID="+c+"&SAP__Origin="+b+"&$format=json";if(a==="Release"){a=t._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE");}else if(a==="Claim"){a=t._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM");}else if(a==="Forward"){a=t._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD");}var k=function(m){sap.m.MessageToast.show(t._oBundle.getText("INBOX_MSG_ACTION_FAILED",[a,T]));};if(i){I=I+"&ForwardTo="+f;}r=this.tcmServiceURL+I;var l=this._getOModel().oHeaders["x-csrf-token"];if(!l){this._getOModel().refreshSecurityToken(null,null,false);l=this._getOModel().oHeaders["x-csrf-token"];}g={async:true,requestUri:r,method:'POST',headers:{Accept:"application/json","x-csrf-token":l}};OData.request(g,function(m,n){t._handleActionCompleted(m);sap.m.MessageToast.show(t._oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[a,m.TaskTitle]));},k);};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderCustomActions=function(){var c=[];if(this.detailViewPage.getBindingContext()){var C=this.detailViewPage.getBindingContext();var i=this._getPageModel().getProperty("InstanceID",C);var s=this._getPageModel().getProperty("SAP__Origin",C);var t=this;this._getOModel().read(this.constants.decisionOptionsFunctionImport,null,["InstanceID='"+i+"'&SAP__Origin='"+s+"'",this.constants.formatJSONURLParam],true,function(d,r){c=d.results;t._createCustomActions(c);},function(e){var a=jQuery.parseJSON(e.response.body);sap.m.MessageToast.show(t._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ACTIONS"),{width:"55em",autoClose:false});});}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomActions=function(c){var t=this;var a=this.oCore.byId(this.Id+"-actionsBar");this._deleteCustomActions(c,a);var n=c.length;var b=3,r,C,s;if(this.bPhoneDevice){var d=0;}else{var d=7;}if(n>d){r=c.slice(0,d+1);C=c.slice(d,n);;n=d;s=true;}for(var i=0;i<n;i++){var e=c[i];var o=t._createCustomActionButton(e);a.insertContentMiddle(o,b);b++;}if(s){var f=this.oCore.byId(this.Id+'--'+'customActionMoreButton');if(!f){f=new sap.m.Button(this.Id+'--'+'customActionMoreButton',{icon:"sap-icon://open-command-field"}).data("type",this.constants.customAction).attachPress({"that":t,"aCustomActionsTobeRendered":C},t._openCustomActionSheet);}a.insertContentMiddle(f,b);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._openCustomActionSheet=function(e,I){var t=I.that;var c=I.aCustomActionsTobeRendered;var C=t.oCore.byId(t.Id+'--'+'customActionSheet');if(!C){C=new sap.m.ActionSheet(t.Id+'--'+'customActionSheet',{title:"Custom Action",showCancelButton:true,placement:sap.m.PlacementType.Top});}jQuery.each(c,function(i,a){var o=t._createCustomActionButton(a);o.data('source','actionSheet');C.addButton(t._createCustomActionButton(a));});C.openBy(e.getSource());};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomActionButton=function(a){var c=this.oCore.byId(this.Id+'--'+a.DecisionKey+'button');if(!c){var d=(a.DecisionText!==undefined&&a.DecisionText!=="")?a.DecisionText:a.DecisionKey;var c=new sap.m.Button(this.Id+'--'+a.DecisionKey+'button',{icon:"sap-icon://complete",text:d,tooltip:a.Description}).data("type",this.constants.customAction).data("key",a.DecisionKey).data("text",d);c.attachPress(this,this._handleCustomAction);}return c;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._deleteCustomActions=function(c,a){var t=this;var T=a.getContentMiddle();for(var i=0;i<T.length;i++){var o=T[i];if(o instanceof sap.m.Button&&o.data("type")===t.constants.customAction){a.removeContentMiddle(o);o.destroy();}}var C=t.oCore.byId(t.Id+'--'+'customActionSheet');if(C){C.destroy();}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getPropertyValue=function(p){var c=this.detailViewPage.getBindingContext();if(c){return this._getPageModel().getProperty(p,c);}return null;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleCustomAction=function(e,t){var c=e.getSource();var C=c.data('key');var o=t.oCore.byId(t.Id+'--'+C+'cAinPopUp');if(!o){o=new sap.m.Button(t.Id+'--'+C+'cAinPopUp',{text:c.data('text'),press:function(e){var s=t.oCore.byId(t.Id+'--'+'addCommentsInputBtn').getValue();t._executeCustomAction(s,C);t.oCore.byId(t.Id+'--'+'customActionWithComments').close();}}).data('key',C);}var a=t.oCore.byId(t.Id+'--'+'customActionWithComments');if(!a){a=new sap.m.ResponsivePopover(t.Id+'--'+'customActionWithComments',{placement:sap.m.PlacementType.Top,content:new sap.m.TextArea(t.Id+'--'+'addCommentsInputBtn',{placeholder:t._oBundle.getText("INBOX_LP_ADD_COMMENT"),maxLength:500,width:'100%'})});if(t.bPhoneDevice){a.setTitle(t._getPageModel().getProperty("TaskTitle",t.detailViewPage.getBindingContext()));a.setShowHeader(t.bPhoneDevice);}}a.setBeginButton(o);var b=t.oCore.byId(t.Id+'--'+'addCommentsInputBtn');if(b){b.setValue('');}if(c.data('source')==='actionSheet'){a.openBy(t.oCore.byId(t.Id+'--'+'customActionMoreButton'));}else{a.openBy(c);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._executeCustomAction=function(c,d){var s=[],a=[],b=[];var e=[];var f="'",g="'";var h=[];var i,j;var t=this;var C=this.detailViewPage.getBindingContext();var T=this._getPageModel().getProperty("TaskTitle",C);i=this._getPageModel().getProperty("InstanceID",C);j=this._getPageModel().getProperty("SAP__Origin",C);a.push(C);s.push(i);b.push(j);f=f+i+"'";g=g+j+"'";var I,r,k,l,m;m=s.length;I=this.constants.forwardSlash+this.constants.decisionExecutionFunctionImport+this.constants.query+"InstanceID="+f+this.constants.amperSand+"SAP__Origin="+g+this.constants.amperSand+"DecisionKey='"+d+"'"+this.constants.amperSand+this.constants.formatJSONURLParam;if(c)I=I+"&Comments='"+c+"'";r=this.tcmServiceURL+I;var S=this._getOModel().oHeaders["x-csrf-token"];if(!S){this._getOModel().refreshSecurityToken(null,null,false);S=this._getOModel().oHeaders["x-csrf-token"];}k={async:true,requestUri:r,method:'POST',headers:{Accept:this.constants.acceptHeaderforJSON,"x-csrf-token":S}};OData.request(k,function(n,o){t._handleActionCompleted(n);sap.m.MessageToast.show(t._oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[d,n.TaskTitle]));},function(n){sap.m.MessageToast.show(t._oBundle.getText("INBOX_MSG_ACTION_FAILED",[d,T]));});};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomAttributes=function(){if(this.detailViewPage.getBindingContext()){var s=this._getPropertyValue('TaskDefinitionID');var S=this._getPropertyValue('SAP__Origin');var a=this._getPropertyValue('InstanceID');this._getCustomAttributeMetaData(s,S,a);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getCustomAttributeMetaData=function(t,s,T){var a=this;var c=this.constants;var o=c.TaskDefinitionCollection;var C=c.oTaskDefinitionCustomAttributesMap[t];if(!C){var u=this._getRequestURLCustomAttributeMetaData(o,t,s);var r=this.tcmServiceURL+u;var R={async:true,requestUri:r,method:"GET",headers:{Accept:c.acceptHeaderforJSON}};OData.request(R,function(d,b){c.oTaskDefinitionCustomAttributesMap[t]=d.results;a.showHideIconTabFilters(T,s,d.results);},function(e){var b=jQuery.parseJSON(e.response.body);sap.m.MessageToast.show(a._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ATTR"),{width:"55em",autoClose:false});});}else{a.showHideIconTabFilters(T,s,C);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype.showHideIconTabFilters=function(t,s,c){var i=sap.ui.getCore().byId(this.Id+'-iconTabBar');var I=i.getItems();var S=i.getSelectedKey();if(c.length>0){I[0].setVisible(true);if(S==="customAttr"&&i.getExpanded()===true){this._addBusyIndicatorForTaskDetails(I[0]);this._getCustomAttributeData(t,s,c);}else if(S==="comments"&&i.getExpanded()===true){this._handleSelectComments(I[1]);}}else{I[0].setVisible(false);if(!(S==="comments")){i.setSelectedKey("comments");}if(i.getExpanded()===true){this._handleSelectComments(I[1]);}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getCustomAttributeData=function(t,s,c){var a=this;var b=this.constants;var T=b.TaskCollection;var C=b.oTaskInstanceCustomAttributeValuesMap;var o=C[t];var i=sap.ui.getCore().byId(a.Id+'-iconTabBar');if(!o){var u=this._getRequestURLCustomAttributeData(T,t,s);var r=this._getOModel().sServiceUrl+u;var R={async:true,requestUri:r,method:"GET",headers:{Accept:b.acceptHeaderforJSON}};OData.request(R,function(d,e){var f=a._transformCustomAttributeJsonToArray(d.results);b.oTaskInstanceCustomAttributeValuesMap[t]=f;i.getItems()[0].addContent(a._renderCustomAttributes(c,f));},function(e){sap.m.MessageToast.show(a._oBundle.getText("INBOX_MSG_FETCH_CUSTOM_ATTRIBUTES_FAILS"));});}else{i.getItems()[0].addContent(a._renderCustomAttributes(c,o));}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleSelectIconTabFilter=function(e,t){var i=t.oCore.byId(t.Id+'-iconTabBar');var I=i.getItems();if(i.getSelectedKey()==='customAttr'){t._createCustomAttributes();}else if(i.getSelectedKey()==='comments'&&i.getExpanded()===true){t._handleSelectComments(I[1]);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomAttributesLayout=function(c,C){var _=this.oCore.byId(this.Id+'-iconTabBar');var a=this.oCore.byId(this.Id+'-custAttrTab');a.removeAllContent();var n=c.length;if(n>0){var s=this.oCore.byId(this.Id+"-custAttrScrollCont");if(!s){s=new sap.m.ScrollContainer(this.Id+"-custAttrScrollCont",{vertical:true,width:"auto",}).addStyleClass('inbox_split_app_scrollContainer');}s.removeAllContent();var f=this.oCore.byId(this.Id+"-custAttForm");if(!f){f=new sap.ui.layout.form.SimpleForm(this.Id+"-custAttForm",{});}f.removeAllContent();for(var b=0;b<n;b++){f.addContent(new sap.m.Label({text:c[b].Label}));f.addContent(new sap.m.Text({text:C[c[b].Name]}));}s.addContent(f);return s;}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleActionCompleted=function(t){this.oCore.getEventBus().publish('sap.uiext.inbox',"taskActionCompleted",{taskData:t})};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._rerenderTaskDescription=function(d){var n=this._getPageModel().getProperty(this.detailViewPage.getBindingContext().getPath(),this.detailViewPage.getBindingContext());if(n.Description){n.Description.Description=d;}else{n.Description={"Description":d};}this._getPageModel().checkUpdate(false);};
sap.uiext.inbox.splitapp.DetailViewPage.prototype.renderDetailsPage=function(o){if(this.useBatch){this._renderDetailsPageBatchProcessing();}else{this._renderDetailsPageNonBatchProcessing(o);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderDetailsPageBatchProcessing=function(){var t=this;var c=this._addReadCustomAttributeMetaDatatoBatch();var a=this._addReadCustomAttributeDataToBatch();var b=this._addReadTaskDescriptiontoBatch();var d=this._addReadCustomActionstoBatch();if(d||c||a){this._getOModel().submitBatch(function(e,r){var C=t.detailViewPage.getBindingContext();var T=t._getPageModel().getProperty("TaskDefinitionID",C);var s=t._getPageModel().getProperty("InstanceID",C);var i=0;var f,g,h,j,k;if(c){h=t._processCustomAttributeDefinitionResponse(t,e.__batchResponses[i++],T);}if(a){j=t._processCustomAttributeResponse(t,e.__batchResponses[i++],T,s);}if(b){f=t._processTaskDescriptionResponse(t,e.__batchResponses[i++],s);}if(d){g=t._processCustomActionResponse(t,e.__batchResponses[i++],T);}if(f){k=f;}if(g){k=k?k+g:g;}if(h){k=k?k+h:h;}if(j){k=k?k+j:j;}if(k){sap.m.MessageToast.show(k,{width:"55em",autoClose:false});}},function(e){var f=jQuery.parseJSON(e.response.body);sap.m.MessageToast.show(t._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_LOADING_DETAIL_PAGE"),{width:"55em",autoClose:false});},true);}else{}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._processTaskDescriptionResponse=function(t,a,T){if(a&&a.statusCode&&a.statusCode==200){t.constants.taskDescriptionsMap[T]=a.data.Description;t._rerenderTaskDescription(a.data.Description);}else{if(a){var e;if(a.response){e=jQuery.parseJSON(a.response.body).error.message.value;}var b=t._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_TASK_DESC");return b;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._processCustomActionResponse=function(t,c,T){if(c&&c.statusCode&&c.statusCode==200){t.constants.taskDefinitionDecisionOptionsMap[T]=c.data.results;t._createCustomActions(c.data.results);}else{if(c){var e;if(c.response){e=jQuery.parseJSON(c.response.body).error.message.value;}var a=t._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ACTIONS");return a;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._processCustomAttributeDefinitionResponse=function(t,c,T){if(c&&c.statusCode&&c.statusCode==200){t.constants.oTaskDefinitionCustomAttributesMap[T]=c.data.results;}else{if(c&&!c.statusCode){var e;if(c.response){e=jQuery.parseJSON(c.response.body).errorBody.error.message.value;}var a=t._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ATTR");return a;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._processCustomAttributeResponse=function(t,c,T,s){if(c&&c.statusCode&&c.statusCode==200){var i=t.oCore.byId(t.Id+'-iconTabBar');if(i.getSelectedKey()==='customAttr'){var a=t._transformCustomAttributeJsonToArray(c.data.results);t.constants.oTaskInstanceCustomAttributeValuesMap[s]=a;i.getItems()[0].addContent(t._renderCustomAttributes(t.constants.oTaskDefinitionCustomAttributesMap[T],a));}}else{if(c&&!c.statusCode){var e;if(c.response){e=jQuery.parseJSON(c.response.body).errorBody.error.message.value;}var b=t._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ATTR");return b;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadTaskDescriptiontoBatch=function(){if(this.detailViewPage.getBindingContext()){var c=this.detailViewPage.getBindingContext();var i=this._getPageModel().getProperty("InstanceID",c);var s=this._getPageModel().getProperty("SAP__Origin",c);var a=this.constants;var t=a.TaskCollection;var b=a.taskDescriptionsMap[i];if(b){this._rerenderTaskDescription(b);return false;}else{var r=this._getRequestURLTaskDescription(t,i,s);var d=this._getOModel().createBatchOperation(r,"GET",null);this._getOModel().addBatchReadOperations([d]);return true;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getRequestURLTaskDescription=function(t,i,s){var c=this.constants;var r=c.forwardSlash+t.entityName+"("+t.properties.instanceID+"='"+i+"',"+c.sapOrigin+"='"+s+"')"+c.forwardSlash+t.navParam.taskDescription;return r;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadCustomActionstoBatch=function(){if(this.detailViewPage.getBindingContext()){var c=this.detailViewPage.getBindingContext();var i=this._getPageModel().getProperty("InstanceID",c);var s=this._getPageModel().getProperty("SAP__Origin",c);var t=this._getPageModel().getProperty("TaskDefinitionID",c);var a=this.constants;var C=a.taskDefinitionDecisionOptionsMap;var o=C[t];if(o){this._createCustomActions(o);return false;}else{var p=this.constants.decisionOptionsFunctionImport+this.constants.query+"InstanceID='"+i+"'&SAP__Origin='"+s+"'";var b=this._getOModel().createBatchOperation(p,"GET");this._getOModel().addBatchReadOperations([b]);return true;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadCustomAttributeMetaDatatoBatch=function(){if(this.detailViewPage.getBindingContext()){var c=this.detailViewPage.getBindingContext();var t=this._getPageModel().getProperty("TaskDefinitionID",c);var s=this._getPageModel().getProperty("SAP__Origin",c);var a=this.constants;var T=a.TaskDefinitionCollection;var C=a.oTaskDefinitionCustomAttributesMap;var b=C[t];if(!b){var r=this._getRequestURLCustomAttributeMetaData(T,t,s);var d=this._getOModel().createBatchOperation(r,"GET");this._getOModel().addBatchReadOperations([d]);return true;}else{return false;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getRequestURLCustomAttributeMetaData=function(t,T,s){var c=this.constants;var r=c.forwardSlash+t.entityName+"("+t.properties.taskDefnID+"='"+T+"',"+c.sapOrigin+"='"+s+"')"+c.forwardSlash+t.navParam.customAttrDefn;return r;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadCustomAttributeDataToBatch=function(){if(this.detailViewPage.getBindingContext()){var c=this.detailViewPage.getBindingContext();var t=this._getPageModel().getProperty("TaskDefinitionID",c);var T=this._getPageModel().getProperty("InstanceID",c);var s=this._getPageModel().getProperty("SAP__Origin",c);var a=this.constants;var o=a.TaskCollection;var C=a.oTaskInstanceCustomAttributeValuesMap;var b=C[T];if(b){var i=this.oCore.byId(this.Id+'-iconTabBar');if(i.getSelectedKey()==='customAttr'){var d=a.oTaskDefinitionCustomAttributesMap;var e=d[t];i.getItems()[0].addContent(this._renderCustomAttributes(e,b));}return false;}else{var r=this._getRequestURLCustomAttributeData(o,T,s);var f=this._getOModel().createBatchOperation(r,"GET");this._getOModel().addBatchReadOperations([f]);return true;}}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getRequestURLCustomAttributeData=function(t,T,s){var c=this.constants;var u=c.forwardSlash+t.entityName+"("+t.properties.instanceID+"='"+T+"',"+c.sapOrigin+"='"+s+"')"+c.forwardSlash+t.navParam.customAttrValues;return u;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderCustomAttributes=function(c,C){var _=this.oCore.byId(this.Id+'-iconTabBar');return this._createCustomAttributesLayout(c,C);};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._transformCustomAttributeJsonToArray=function(c){var C=this.detailViewPage.getBindingContext();var o=this.constants.oTaskInstanceCustomAttributeValuesMap;var t=this._getPageModel().getProperty("InstanceID",C);var a={};var a;for(var i=0;i<c.length;i++){a[c[i].Name]=c[i].Value;o[t]=a;}return a;};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderDetailsPageNonBatchProcessing=function(o){this._renderTaskDescription();this._renderCustomActions();this._createCustomAttributes();};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderTaskDescription=function(){var t=this;var c=this.constants;var T=c.TaskCollection;var C=this.detailViewPage.getBindingContext();var s=this._getPageModel().getProperty("InstanceID",C);var S=this._getPageModel().getProperty("SAP__Origin",C);var a=c.taskDescriptionsMap[s];if(a){this._rerenderTaskDescription(a);}else{var u=this._getRequestURLTaskDescription(T,s,S);var r=this.tcmServiceURL+u;var R={async:true,requestUri:r,method:"GET",headers:{Accept:c.acceptHeaderforJSON}};OData.request(R,function(d,b){c.taskDescriptionsMap[s]=d.Description;t._rerenderTaskDescription(d.Description);},function(e){var b=jQuery.parseJSON(e.response.body);sap.m.MessageToast.show(t._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_TASK_DESC"),{width:"55em",autoClose:false});});}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleSelectComments=function(i){i.removeAllContent();var c=this.oCore.byId(this.Id+"-commentsScrollCont");if(!c){c=new sap.m.ScrollContainer(this.Id+"-commentsScrollCont",{vertical:true,width:"100%",});}c.removeAllContent();var C=this.oCore.byId('commentsBI');if(!C){C=new sap.m.BusyIndicator('commentsBI',{text:this._oBundle.getText("INBOX_LP_LOADING")});}c.addContent(C);var a=this.oCore.byId('addCommentContainer');if(!a){a=new sap.m.FlexBox("addCommentContainer",{width:"100%",items:[new sap.m.TextArea('addCommentsInput',{type:sap.m.InputType.Text,placeholder:this._oBundle.getText("INBOX_LP_ADD_COMMENT"),maxLength:500,rows:3,}).addStyleClass('inbox_split_app_addCommentInput'),new sap.m.Button('addCommentsButton',{text:this._oBundle.getText("INBOX_LP_ADD_BUTTON_TEXT")}).attachPress(this,this._handleCommentAdded).addStyleClass('inbox_split_app_addCommentBtn')],fitContainer:true}).addStyleClass('inbox_split_app_addCommentContainer');}else{var t=a.getItems()[0];if(t){t.setValue("");}}c.addContent(a);i.addContent(c);this._getComments();};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._getComments=function(){if(this.detailViewPage.getBindingContext()){var c=this.detailViewPage.getBindingContext();var t=this._getPageModel().getProperty("InstanceID",c);var s=this._getPageModel().getProperty("SAP__Origin",c);var C=this._loadCommentsFromServer(t,s);return true;}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleCommentAdded=function(e,t){var c=jQuery.sap._sanitizeHTML(t.oCore.byId('addCommentsInput').getValue());if(t.detailViewPage.getBindingContext()&&c){var C=t.detailViewPage.getBindingContext();var T=t._getPageModel().getProperty("InstanceID",C);var s=t._getPageModel().getProperty("SAP__Origin",C);var m=t._getOModel();var r=t.tcmServiceURL+"/AddComment?InstanceID='"+T+"'&SAP__Origin='"+s+"'&Text='"+encodeURIComponent(c)+"'&$format=json";var S=m.oHeaders["x-csrf-token"];if(!S){t._getOModel().refreshSecurityToken(null,null,false);S=m.oHeaders["x-csrf-token"];}var a={async:false,requestUri:r,method:"POST",headers:{"Accept":t.constants.acceptHeaderforJSON,"x-csrf-token":S}};OData.request(a,function(d,b){var o=t.oCore.byId(t.Id+"--commentsList");t._loadCommentsFromServer(T,s);sap.m.MessageToast.show(t._oBundle.getText("INBOX_MSG_COMMENT_ADD_SUCCESS"));t.oCore.byId('addCommentsInput').setValue();},function(b){sap.m.MessageToast.show(t._oBundle.getText("INBOX_MSG_COMMENT_ADD_ERROR"));});}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._loadCommentsFromServer=function(t,s){var a=this;var c=this.constants;var T=c.TaskCollection;var u=c.forwardSlash+T.entityName+"("+T.properties.instanceID+"='"+t+"',"+c.sapOrigin+"='"+s+"')"+c.forwardSlash+T.navParam.comments;var r=this.tcmServiceURL+u;var C=[];var R={async:true,requestUri:r,method:"GET",headers:{Accept:c.acceptHeaderforJSON}};OData.request(R,function(d,b){a._displayComments(d.results);},function(e){sap.m.MessageToast.show(a._oBundle.getText("INBOX_MSG_FETCH_COMMENTS_FAILS"));});};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._displayComments=function(c){var t=this;var a=c&&c.length>0;var C=this.oCore.byId(this.Id+'-commentsScrollCont');var o=this.oCore.byId('commentsBI');if(a){var b=this.oCore.byId(this.Id+"--commentsList");var d;if(!b){var b=new sap.m.List(this.Id+"--"+"commentsList").addStyleClass('inbox_split_app_CommentsList');b.setShowSeparators(sap.m.ListSeparators.All);d=new sap.ui.model.json.JSONModel();b.setModel(d);}else{d=b.getModel();}d.setData(c);var e=new sap.m.FeedListItem({sender:"{CreatedByName}",text:"{Text}",});e.bindProperty("timestamp","CreatedAt",this.utils.dateTimeFormat);e.bindProperty("icon","CreatedBy",function(v){if(this.getBindingContext()){return t.utils.getUserMediaResourceURL(t.tcmServiceURL,this.getBindingContext().getProperty("SAP__Origin"),v);}else{return"sap-icon://person-placeholder";}});b.bindAggregation("items",{path:"/",template:e});C.removeContent(o);C.insertContent(b,0);}else{C.removeContent(o);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._displayCommentsIfCommentsSelectedinIconBar=function(){var i=this.oCore.byId(this.Id+'-iconTabBar');if(i.getSelectedKey()==='comments'&&i.getExpanded()===true){this._handleSelectComments(i.getItems()[1]);}};
sap.uiext.inbox.splitapp.DetailViewPage.prototype._addBusyIndicatorForTaskDetails=function(c){var C=this.oCore.byId(this.Id+"-custAttrScrollCont");if(!C){C=new sap.m.ScrollContainer(this.Id+"-custAttrScrollCont",{vertical:true,width:"auto",}).addStyleClass('inbox_split_app_scrollContainer');}C.removeAllContent();var o=this.oCore.byId('customAttrBI');if(!o){o=new sap.m.BusyIndicator('customAttrBI',{text:this._oBundle.getText("INBOX_LP_LOADING")});}C.addContent(o);c.addContent(C);};
sap.uiext.inbox.splitapp.DetailViewPage.prototype.updateTaskDataInModel=function(t){var T=t.Status=="COMPLETED"?true:false;var p=this.detailViewPage.getBindingContext().getPath();var P=p.split("/");if(T){this.detailViewPage.getModel().oData.TaskCollection.splice(P[2],1);}else{this.detailViewPage.getModel().oData.TaskCollection[P[2]]=t;}this.detailViewPage.getModel().checkUpdate(false);};
