// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ushell/Config"],function(q,C){"use strict";function B(){var l=sap.ushell.Container.getService("LaunchPage");this._isMatchingRemoteCatalog=function(c,r){var o=l.getCatalogData(c);return o.remoteId===r.remoteId&&o.baseUrl.replace(/\/$/,"")===r.baseUrl.replace(/\/$/,"");};this.addBookmark=function(p,g){if(!C.last("/core/shell/enablePersonalization")){return new q.Deferred().resolve().promise();}var P=l.addBookmark(p,g);P.done(function(t){var d={tile:t,group:g};sap.ui.getCore().getEventBus().publish("sap.ushell.services.Bookmark","bookmarkTileAdded",d);});return P;};this.addBookmarkByGroupId=function(p,g){return l.getGroups().then(function(G){G=q.grep(G,function(e){return e.id===g;});var o=null;if(G.length>0){o=G[0];}return this.addBookmark(p,o);}.bind(this));};this.getShellGroupIDs=function(g){var d=new q.Deferred();l.getGroupsForBookmarks(g).done(function(G){G=G.map(function(a){var n={id:l.getGroupId(a.object),title:a.title};return n;});d.resolve(G);});return d;};this._doAddCatalogTileToGroup=function(d,c,o,g){var e,f=d.reject.bind(d);function i(c,b){var I=l.getCatalogTileId(b);if(I===undefined){return false;}return I.indexOf(c)===0;}function a(G){l.getCatalogTiles(o).fail(f).done(function(b){var g=l.getGroupId(G),t=b.some(function(h){if(i(c,h)){l.addTile(h,G).fail(f).done(function(){d.resolve();sap.ui.getCore().getEventBus().publish("sap.ushell.services.Bookmark","catalogTileAdded",g);});return true;}});if(!t){e="No tile '"+c+"' in catalog '"+l.getCatalogId(o)+"'";q.sap.log.error(e,null,"sap.ushell.services.Bookmark");f(e);}});}if(g){l.getGroups().fail(f).done(function(G){var b=G.some(function(h){if(l.getGroupId(h)===g){a(h);return true;}});if(!b){e="Group '"+g+"' is unknown";q.sap.log.error(e,null,"sap.ushell.services.Bookmark");f(e);}});}else{l.getDefaultGroup().fail(f).done(a);}return d.promise();};this.addCatalogTileToGroup=function(c,g,o){var d=new q.Deferred(),e,f=d.reject.bind(d),m,L="X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG",t=this;function i(a){return l.getCatalogId(a)===L;}m=o?this._isMatchingRemoteCatalog:i;o=o||{id:L};l.onCatalogTileAdded(c);l.getCatalogs().fail(f).done(function(a){var s;a.forEach(function(b){if(m(b,o)){if(!s){s=b;}else{q.sap.log.warning("More than one matching catalog: "+JSON.stringify(o),null,"sap.ushell.services.Bookmark");}}});if(s){t._doAddCatalogTileToGroup(d,c,s,g);}else{e="No matching catalog found: "+JSON.stringify(o);q.sap.log.error(e,null,"sap.ushell.services.Bookmark");d.reject(e);}});return d.promise();};this.countBookmarks=function(u){return l.countBookmarks(u);};this.deleteBookmarks=function(u){var p=l.deleteBookmarks(u);p.done(function(){sap.ui.getCore().getEventBus().publish("sap.ushell.services.Bookmark","bookmarkTileDeleted",u);});return p;};this.updateBookmarks=function(u,p){return l.updateBookmarks(u,p);};}B.hasNoAdapter=true;return B;},true);
