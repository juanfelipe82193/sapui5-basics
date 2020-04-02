/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/odata/MessageScope","sap/ui/model/odata/ODataUtils","sap/ui/core/library","sap/ui/thirdparty/URI","sap/ui/core/message/MessageParser","sap/ui/core/message/Message","sap/base/Log","sap/ui/thirdparty/jquery"],function(M,O,c,U,a,b,L,q){"use strict";var d=c.MessageType;var s={"error":d.Error,"warning":d.Warning,"success":d.Success,"info":d.Information};var e=a.extend("sap.ui.model.odata.ODataMessageParser",{metadata:{publicMethods:["parse","setProcessor","getHeaderField","setHeaderField"]},constructor:function(S,m){a.apply(this);this._serviceUrl=f(this._parseUrl(S).url);this._metadata=m;this._processor=null;this._headerField="sap-message";this._lastMessages=[];}});e.prototype.getHeaderField=function(){return this._headerField;};e.prototype.setHeaderField=function(F){this._headerField=F;return this;};e.prototype.parse=function(r,R,G,C,m){var i=[];var k={url:R?R.requestUri:r.requestUri,request:R,response:r};if(r.statusCode>=200&&r.statusCode<300){this._parseHeader(i,r,k);}else if(r.statusCode>=400&&r.statusCode<600){this._parseBody(i,r,k);}else{L.warning("No rule to parse OData response with status "+r.statusCode+" for messages");}if(this._processor){this._propagateMessages(i,k,G,C,!m);}else{this._outputMesages(i);}};e.prototype._isNavigationProperty=function(p,P){var E=this._metadata._getEntityTypeByPath(p);if(E){var n=this._metadata._getNavigationPropertyNames(E);return n.indexOf(P)>-1;}return false;};e.prototype._getAffectedTargets=function(m,r,G,C){var A=q.extend({"":true},G,C);if(r.request&&r.request.key&&r.request.created){A[r.request.key]=true;}var R=this._parseUrl(r.url).url;if(R.indexOf(this._serviceUrl)===0){R=R.substr(this._serviceUrl.length+1);}var E=this._metadata._getEntitySetByPath(R);if(E){A[E.name]=true;}for(var i=0;i<m.length;++i){var t=m[i].getTarget();if(t){var T=t.replace(/^\/+|\/$/g,"");A[T]=true;var S=T.lastIndexOf("/");if(S>0){var p=T.substr(0,S);var P=T.substr(S);var I=this._isNavigationProperty(p,P);if(!I){A[p]=true;}}}}return A;};e.prototype._propagateMessages=function(m,r,G,C,S){var A=this._getAffectedTargets(m,r,G,C),D=r.request.deepPath,k=[],p=D&&r.request.refresh&&r.request.headers&&r.request.headers["sap-message-scope"]===M.BusinessObject,R=[],i=r.response.statusCode,n=(i>=200&&i<300),t;function o(u,t){return A[t]||p&&u.fullTarget.startsWith(D);}this._lastMessages.forEach(function(u){t=u.getTarget().replace(/^\/+|\/$/g,"");var P=t.lastIndexOf(")/");if(P>0){t=t.substr(0,P+1);}if(n||S){if(!u.getPersistent()&&o(u,t)){R.push(u);}else{k.push(u);}}else if(!u.getPersistent()&&u.getTechnical()&&o(u,t)){R.push(u);}else{k.push(u);}});this.getProcessor().fireMessageChange({oldMessages:R,newMessages:m});this._lastMessages=k.concat(m);};e.prototype._createMessage=function(m,r,i){var t=m["@sap.severity"]?m["@sap.severity"]:m["severity"];t=s[t]?s[t]:t;var C=m.code?m.code:"";var T=typeof m["message"]==="object"&&m["message"]["value"]?m["message"]["value"]:m["message"];var D=m.longtext_url?m.longtext_url:"";var p=false;if(!m.target&&m.propertyref){m.target=m.propertyref;}if(typeof m.target==="undefined"){m.target="";}if(m.target.indexOf("/#TRANSIENT#")===0){p=true;m.target=m.target.substr(12);}else if(m.transient){p=true;}else if(m.transition){p=true;}this._createTarget(m,r);return new b({type:t,code:C,message:T,descriptionUrl:D,target:O._normalizeKey(m.canonicalTarget),processor:this._processor,technical:i,persistent:p,fullTarget:m.deepPath,technicalDetails:{statusCode:r.response.statusCode,headers:r.response.headers}});};e.prototype._getFunctionTarget=function(F,r,u){var t="";var i;if(r.response&&r.response.headers&&r.response.headers["location"]){t=r.response.headers["location"];var p=t.lastIndexOf(this._serviceUrl);if(p>-1){t=t.substr(p+this._serviceUrl.length);}}else{var A=null;if(F.extensions){for(i=0;i<F.extensions.length;++i){if(F.extensions[i].name==="action-for"){A=F.extensions[i].value;break;}}}var E;if(A){E=this._metadata._getEntityTypeByName(A);}else if(F.entitySet){E=this._metadata._getEntityTypeByPath(F.entitySet);}else if(F.returnType){E=this._metadata._getEntityTypeByName(F.returnType);}if(E){var m=this._metadata._getEntitySetByType(E);if(m&&E&&E.key&&E.key.propertyRef){var I="";var P;if(E.key.propertyRef.length===1){P=E.key.propertyRef[0].name;if(u.parameters[P]){I=u.parameters[P];}}else{var k=[];for(i=0;i<E.key.propertyRef.length;++i){P=E.key.propertyRef[i].name;if(u.parameters[P]){k.push(P+"="+u.parameters[P]);}}I=k.join(",");}t="/"+m.name+"("+I+")";}else if(!m){L.error("Could not determine path of EntitySet for function call: "+u.url);}else{L.error("Could not determine keys of EntityType for function call: "+u.url);}}}return t;};e.prototype._createTarget=function(m,r){var t=m.target;var D="";if(t.substr(0,1)!=="/"){var R="";var k=(r.request&&r.request.method)?r.request.method:"GET";var n=(k==="POST"&&r.response&&r.response.statusCode==201&&r.response.headers&&r.response.headers["location"]);var u;if(n){u=r.response.headers["location"];}else if(r.request&&r.request.key&&r.request.created&&r.response&&r.response.statusCode>=400){u=r.request.key;}else{u=r.url;}var o=this._parseUrl(u);var p=o.url;var P=p.lastIndexOf(this._serviceUrl);if(P>-1){R=p.substr(P+this._serviceUrl.length);}else{R="/"+p;}if(!n){var F=this._metadata._getFunctionImportMetadata(R,k);if(F){R=this._getFunctionTarget(F,r,o);D=R;}}var S=R.lastIndexOf("/");var v=S>-1?R.substr(S):R;if(!D&&r.request&&r.request.deepPath){D=r.request.deepPath;}if(v.indexOf("(")>-1){t=t?R+"/"+t:R;D=m.target?D+"/"+m.target:D;}else if(this._metadata._isCollection(R)){t=R+t;D=D+m.target;}else{t=t?R+"/"+t:R;D=m.target?D+"/"+m.target:D;}}m.canonicalTarget=t;if(this._processor){var C=this._processor.resolve(t,undefined,true);var N=t.split(")").length-1;for(var i=2;i<N;i++){C=this._processor.resolve(C,undefined,true);}m.canonicalTarget=C||t;m.deepPath=D||m.canonicalTarget;}};e.prototype._parseHeader=function(m,r,R){var F=this.getHeaderField();if(!r.headers){return;}for(var k in r.headers){if(k.toLowerCase()===F.toLowerCase()){F=k;}}if(!r.headers[F]){return;}var n=r.headers[F];var S=null;try{S=JSON.parse(n);m.push(this._createMessage(S,R));if(Array.isArray(S.details)){for(var i=0;i<S.details.length;++i){m.push(this._createMessage(S.details[i],R));}}}catch(o){L.error("The message string returned by the back-end could not be parsed: '"+o.message+"'");return;}};e.prototype._parseBody=function(m,r,R){var C=g(r);if(C&&C.indexOf("xml")>-1){this._parseBodyXML(m,r,R,C);}else{this._parseBodyJSON(m,r,R);}j(m);};e.prototype._parseBodyXML=function(k,r,R,C){try{var D=new DOMParser().parseFromString(r.body,C);var E=h(D,["error","errordetail"]);for(var i=0;i<E.length;++i){var N=E[i];var o={};o["severity"]=d.Error;for(var n=0;n<N.childNodes.length;++n){var p=N.childNodes[n];var t=p.nodeName;if(t==="errordetails"||t==="details"||t==="innererror"||t==="#text"){continue;}if(t==="message"&&p.hasChildNodes()&&p.firstChild.nodeType!==window.Node.TEXT_NODE){for(var m=0;m<p.childNodes.length;++m){if(p.childNodes[m].nodeName==="value"){o["message"]=p.childNodes[m].text||p.childNodes[m].textContent;}}}else{o[p.nodeName]=p.text||p.textContent;}}k.push(this._createMessage(o,R,true));}}catch(u){L.error("Error message returned by server could not be parsed");}};e.prototype._parseBodyJSON=function(m,r,R){try{var E=JSON.parse(r.body);var o;if(E["error"]){o=E["error"];}else{o=E["odata.error"];}if(!o){L.error("Error message returned by server did not contain error-field");return;}o["severity"]=d.Error;m.push(this._createMessage(o,R,true));var F=null;if(Array.isArray(o.details)){F=o.details;}else if(o.innererror&&Array.isArray(o.innererror.errordetails)){F=o.innererror.errordetails;}else{F=[];}for(var i=0;i<F.length;++i){m.push(this._createMessage(F[i],R,true));}}catch(k){L.error("Error message returned by server could not be parsed");}};e.prototype._parseUrl=function(u){var m={url:u,parameters:{},hash:""};var p=-1;p=u.indexOf("#");if(p>-1){m.hash=m.url.substr(p+1);m.url=m.url.substr(0,p);}p=u.indexOf("?");if(p>-1){var P=m.url.substr(p+1);m.parameters=U.parseQuery(P);m.url=m.url.substr(0,p);}return m;};e.prototype._outputMesages=function(m){for(var i=0;i<m.length;++i){var o=m[i];var k="[OData Message] "+o.getMessage()+" - "+o.getDescription()+" ("+o.getTarget()+")";switch(m[i].getType()){case d.Error:L.error(k);break;case d.Warning:L.warning(k);break;case d.Success:L.debug(k);break;case d.Information:case d.None:default:L.info(k);break;}}};function g(r){if(r&&r.headers){for(var H in r.headers){if(H.toLowerCase()==="content-type"){return r.headers[H].replace(/([^;]*);.*/,"$1");}}}return false;}var l=document.createElement("a");function f(u){l.href=u;return U.parse(l.href).path;}function h(D,E){var k=[];var m={};for(var i=0;i<E.length;++i){m[E[i]]=true;}var o=D;while(o){if(m[o.tagName]){k.push(o);}if(o.hasChildNodes()){o=o.firstChild;}else{while(!o.nextSibling){o=o.parentNode;if(!o||o===D){o=null;break;}}if(o){o=o.nextSibling;}}}return k;}function j(m){if(m.length>1){for(var i=1;i<m.length;i++){if(m[0].getCode()==m[i].getCode()&&m[0].getMessage()==m[i].getMessage()){m.shift();break;}}}}return e;});
