// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/AppType","sap/ushell/EventHub","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/Device","sap/ushell/utils"],function(c,E,q,L,D,u){"use strict";function R(m,f,C,l,s){var r=[],a=function(I,t){return r.some(function(o){var F;if(f(o.oItem,I)){o.oItem=I;o.iTimestamp=t;o.iCount=o.iCount+1;F=true;}else{F=false;}return F;});},i=function(I,t){var n={oItem:I,iTimestamp:t,iCount:1};if(r.length===m){r.sort(C);r.pop();}r.push(n);};this.clearAllActivities=function(){var o=new q.Deferred();s([]).done(function(b){o.resolve(b);}).fail(function(){o.reject();});return o.promise();};this.newItem=function(I){var o=new q.Deferred(),t=+new Date(),A;l().done(function(b){r=b||[];A=a(I,t);if(!A){i(I,t);}s(r).done(function(g){o.resolve(g);}).fail(function(){o.reject();});});return o.promise();};this.getRecentItems=function(){var o=new q.Deferred();l().done(function(b){b=b||[];b.sort(C);r=b.slice(0,m);o.resolve(q.map(r,function(g){return g.oItem;}));});return o.promise();};}function d(m,f,C,l,s){var M=30,r,g=function(I,t){return r.recentUsageArray.some(function(o){var F;if(f(o.oItem,I)){if((I.appType===o.oItem.appType)||(I.appType!==c.APP)){q.extend(o.oItem,I);o.iTimestamp=t;o.oItem.timestamp=t;o.mobile=undefined;o.tablet=undefined;o.desktop=undefined;if((I.appType===o.oItem.appType)||(I.appType!==c.APP&&o.oItem.appType!==c.APP)){o.aUsageArray[o.aUsageArray.length-1]+=1;o.iCount+=1;}r.recentUsageArray.sort(C);}F=true;}else{F=false;}return F;});},i=function(I,t,a){I.timestamp=t;if(a){I.icon=a;}var n={oItem:I,iTimestamp:t,aUsageArray:[1],iCount:1,mobile:undefined,tablet:undefined,desktop:undefined};if(r.recentUsageArray.length===m){r.recentUsageArray.pop();}r.recentUsageArray.unshift(n);};this.newItem=function(I){var o=new q.Deferred(),t=+new Date(),a=this.getActivityIcon(I.appType,I.icon),A,b=this,h=this.getDayFromDateObj(new Date());l().done(function(j){r=b.getRecentActivitiesFromLoadedData(j);if(h!=r.recentDay){b.addNewDay();r.recentDay=h;}A=g(I,t);if(!A){i(I,t,a);}s(r).done(function(k){E.emit("newUserRecentsItem",r);o.resolve(k);}).fail(function(){o.reject();});});return o.promise();};this.getActivityIcon=function(a,I){switch(a){case c.SEARCH:return I||"sap-icon://search";case c.COPILOT:return I||"sap-icon://co";case c.URL:return I||"sap-icon://internet-browser";default:return I||"sap-icon://product";}};this.clearAllActivities=function(){var o=new q.Deferred();s([]).done(function(a){E.emit("userRecentsCleared",Date.now());o.resolve(a);}).fail(function(){o.reject();});return o.promise();};this.getRecentItemsHelper=function(a){var t=this,o=new q.Deferred(),b,A,h,I=false,j=[],k=[],n=this.getDayFromDateObj(new Date()),p=function(v){var w=[],x=0,y;for(y=0;y<v.recentUsageArray.length&&(!a||x<a);y++){A=v.recentUsageArray[y];if(A[h]){w.push(A);x++;}}o.resolve(w);};if(D.system.desktop){h="desktop";}else if(D.system.tablet){h="tablet";}else{h="mobile";}l().done(function(v){r=t.getRecentActivitiesFromLoadedData(v);var w=false,x;if(n!=r.recentDay){t.addNewDay();r.recentDay=n;w=true;}for(b=0;b<r.recentUsageArray.length&&!I;b++){A=r.recentUsageArray[b];if(A[h]===undefined){if(!(A.oItem.url[0]==="#")){k.push(A.oItem.url);}else if(A.oItem.url.indexOf("?")>-1){x=A.oItem.url.substring(A.oItem.url.indexOf("?"));if(x.indexOf("&/")>-1){x=x.substring(0,x.indexOf("&/"));}j.push(A.oItem.appId+x);}else{j.push(A.oItem.appId);}}else{I=true;}}if(k.length>0){var y;for(b=0;b<r.recentUsageArray.length;b++){if(!(r.recentUsageArray[b].oItem.url[0]==="#")){y=r.recentUsageArray[b];y[h]=true;}}if(j.length<=0){s(r).done(function(z){o.resolve(p(r));}).fail(function(){o.reject();});}}if(j.length>0){sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported(j).done(function(z){I=false;for(b=0;b<r.recentUsageArray.length&&!I;b++){A=r.recentUsageArray[b];if(A[h]===undefined){x="";if(A.oItem.url.indexOf("?")>-1){x=A.oItem.url.substring(A.oItem.url.indexOf("?"));if(x.indexOf("&/")>-1){x=x.substring(0,x.indexOf("&/"));}}var B=z[A.oItem.appId+x];A[h]=!!(B&&B.supported);}else if(A.oItem.url[0]==="#"){I=true;}}s(r).done(function(){o.resolve(p(r));}).fail(function(){o.reject();});}).fail(function(z){o.reject(z);});}else if((j.length<=0)&&(k.length<=0)){if(w){s(r).done(function(){o.resolve(p(r));}).fail(function(){o.reject();});}else{o.resolve(p(r));}}}).fail(function(){o.reject();});return o.promise();};this.getRecentItems=function(){var o=new q.Deferred();this.getRecentItemsHelper(30).done(function(a){o.resolve(q.map(a,function(b){return b.oItem;}));}).fail(function(){o.reject();});return o.promise();};this.getFrequentItems=function(){var o=new q.Deferred();this.getRecentItemsHelper().done(function(h){var j,w=0,F=[],A,p=h[0]?new Date(h[0].iTimestamp):undefined,k;for(j=0;j<h.length&&w<30;j++){A=h[j];if(A.iCount>1){F.push(A);}k=new Date(A.iTimestamp);if(p.toDateString()!=k.toDateString()){w++;p=k;}}F.sort(function(a,b){return b.iCount-a.iCount;});F=F.slice(0,30);o.resolve(q.map(F,function(a){return a.oItem;}));}).fail(function(){o.reject();});return o.promise();};this.addNewDay=function(){var a,b;for(a=0;a<r.recentUsageArray.length;a++){if(r.recentUsageArray[a].aUsageArray){b=r.recentUsageArray[a].aUsageArray;}else{b=[];r.recentUsageArray[a].aUsageArray=b;r.recentUsageArray[a].iCount=0;}b[b.length]=0;if(b.length>M){r.recentUsageArray[a].iCount-=b[0];b.shift();}}};this.getDayFromDateObj=function(a){return(a.getUTCFullYear()+"/"+(a.getUTCMonth()+1)+"/"+a.getUTCDate());};this.getRecentActivitiesFromLoadedData=function(a){var b;if(Array.isArray(a)){b={recentDay:null,recentUsageArray:a};}else{b=a||{recentDay:null,recentUsageArray:[]};}b.recentUsageArray=(b.recentUsageArray||[]).filter(function(A){var I=A&&A.oItem&&A.oItem.url;if(!I){L.error("FLP Recent Activity",A,"is not valid. The activity is removed from the list.");}return I;});return b;};}function e(l,s){var a,t=this,m=30;this.init=function(){var t=this,p,b=this.getDayFromDateObj(this.getCurrentDate()),f=false;if(t._oInitDeferred===undefined){t._oInitDeferred=q.Deferred();}if(!f||b!==a.recentDay){f=true;p=l();p.done(function(g){a=g||{recentDay:null,recentAppsUsageMap:{}};t.calculateInitialUsage(b);t._oInitDeferred.resolve(a);});p.fail(function(){L.error("UShell-lib ; RecentAppsUsage ; Load data in Init failed");t._oInitDeferred.reject();});}return this._oInitDeferred.promise();};this.calculateInitialUsage=function(b){var t=this;if(b!=a.recentDay){this.addNewDay();a.recentDay=b;setTimeout(function(){t.cleanUnusedHashes();},3000);this.saveAppsUsage(a);}};this.addAppUsage=function(h){if(!u.validHash(h)){return q.Deferred().reject("Non valid hash").promise();}var p=this.init();p.done(function(){var A=a.recentAppsUsageMap[h]||[];if(A.length==0){A[0]=1;}else{A[A.length-1]+=1;}a.recentAppsUsageMap[h]=A;t.saveAppsUsage(a);});p.fail(function(){L.error("Ushell-lib ; addAppUsage ; Initialization falied!");});return p;};this.getAppsUsage=function(){var r,t=this,o=q.Deferred(),p=t.init();p.done(function(){r=t.summarizeUsage();o.resolve(r);});p.fail(function(){o.reject("Not initialized yet");});return o.promise();};this.summarizeUsage=function(){var b={},h,f,g,i=true;for(h in a.recentAppsUsageMap){b[h]=this.getHashUsageSum(h);if(i){f=g=b[h];i=false;}else if(b[h]<g){g=b[h];}else if(b[h]>f){f=b[h];}}return{usageMap:b,maxUsage:f,minUsage:g};};this.addNewDay=function(){var h,A;for(h in a.recentAppsUsageMap){A=a.recentAppsUsageMap[h];A[A.length]=0;if(A.length>m){A=A.shift();}}};this.cleanUnusedHashes=function(){var b,h;for(h in a.recentAppsUsageMap){b=t.getHashUsageSum(h);if(b==0){delete(a.recentAppsUsageMap[h]);}}};this.getHashUsageSum=function(h){var b=0,f,g=a.recentAppsUsageMap[h],i=g.length;for(f=0;f<i;f++){b+=g[f];}return b;};this.saveAppsUsage=function(o){var p=s(o);p.fail(function(){L.error("Ushell-lib ; saveAppsUsage ; Save action failed");});p.done(function(){});return p;};this.getCurrentDate=function(){return new Date();};this.getDayFromDateObj=function(b){return(b.getUTCFullYear()+"/"+(b.getUTCMonth()+1)+"/"+b.getUTCDate());};}function U(){var r,o,a,A,b,p,f,s,g,h,i,l,S,j="RecentApps",k="RecentActivity",m="AppsUsage",n="RecentSearches",t="RecentDataSources",P="sap.ushell.services.UserRecents";this.addActivity=function(w){return a.newItem(w);};this.clearRecentActivities=function(){var w=new q.Deferred();a.clearAllActivities().done(function(){w.resolve();});return w.promise();};this.getRecentActivity=function(){return a.getRecentItems();};this.getFrequentActivity=function(){return a.getFrequentItems();};this.noticeDataSource=function(w){if((w&&w.objectName&&w.objectName.value&&w.objectName.value.toLowerCase()==="$$all$$")||(w.objectName&&w.objectName.toLowerCase&&w.objectName.toLowerCase()==="$$all$$")){return;}b.newItem(w);return b.getRecentItems();};this.getRecentDataSources=function(){return b.getRecentItems();};this.noticeSearch=function(w){r.newItem(w);return r.getRecentItems();};this.getRecentSearches=function(){return r.getRecentItems();};this.noticeApp=function(w){o.newItem(w);return o.getRecentItems();};this.getRecentApps=function(){return o.getRecentItems();};this.initAppsUsage=function(){A.init(new Date());};this.addAppUsage=function(w){var x=u.getBasicHash(w);A.addAppUsage(x);};this.getAppsUsage=function(){return A.getAppsUsage();};p=sap.ushell.Container.getService("Personalization");try{f=p.getPersonalizer({container:P,item:j});g=p.getPersonalizer({container:P,item:k});s=p.getPersonalizer({container:P,item:n});h=p.getPersonalizer({container:P,item:t});i=p.getPersonalizer({container:P,item:m});}catch(v){L.error("Personalization service does not work:");L.error(v.name+": "+v.message);}l=function(w){var x,y;try{x=w.getPersData();}catch(v){L.error("Personalization service does not work:");L.error(v.name+": "+v.message);y=new q.Deferred();y.reject(v);x=y.promise();}return x;};S=function(w,x){var y;try{y=w.setPersData(x);}catch(v){L.error("Personalization service does not work:");L.error(v.name+": "+v.message);}return y;};r=new R(10,function(x,y){var w=false;if(x.oDataSource&&y.oDataSource){if(x.oDataSource.objectName&&y.oDataSource.objectName){w=((x.sTerm===y.sTerm)&&(x.oDataSource.objectName.value===y.oDataSource.objectName.value));}if(!x.oDataSource.objectName&&!y.oDataSource.objectName){w=(x.sTerm===y.sTerm);}}if(!x.oDataSource&&!y.oDataSource){w=(x.sTerm===y.sTerm);}return w;},function(x,y){return y.iTimestamp-x.iTimestamp;},l.bind(this,s),S.bind(this,s));b=new R(6,function(x,y){if(x.objectName&&y.objectName){return x.objectName.value===y.objectName.value;}return false;},function(x,y){return y.iTimestamp-x.iTimestamp;},l.bind(this,h),S.bind(this,h));o=new R(6,function(x,y){return x.semanticObject===y.semanticObject&&x.action===y.action;},function(x,y){return y.iTimestamp-x.iTimestamp;},l.bind(this,f),S.bind(this,f));a=new d(500,function(x,y){if(x.appType===y.appType){if(x.appType!==c.APP){return x.url===y.url;}return x.appId===y.appId;}else if(x.appType===c.APP||y.appType===c.APP){return(x.appId===y.appId)&&(x.url===y.url);}return false;},function(x,y){return y.iTimestamp-x.iTimestamp;},l.bind(this,g),S.bind(this,g));A=new e(l.bind(this,i),S.bind(this,i));}U.hasNoAdapter=true;return U;},true);
