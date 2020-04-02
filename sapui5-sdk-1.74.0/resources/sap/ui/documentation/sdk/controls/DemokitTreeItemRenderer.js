/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/TreeItemBaseRenderer','sap/ui/core/Renderer'],function(T,R){"use strict";var D=R.extend(T);D.renderEntityType=function(r,c){var t=c.getEntityType(),s=t?t[0].toUpperCase():"";if(!t){return;}r.write('<span');r.addClass("sapUiDemoKitTreeItemIcon");r.addClass("sapUiDemoKitTreeItem"+s);r.writeClasses();r.write('>');r.write(s);r.write('</span>');};D.renderTooltip=function(r,c){var t=c.getEntityType(),s=c.getTarget();if(t&&s){r.writeAttributeEscaped("title",t+" "+s);}};D.renderLIContent=function(r,c){this.renderEntityType(r,c);r.write('<a');r.writeAttributeEscaped("href",c.getHref());r.write('>');r.write('<span');r.addClass("sapDemokitTreeItemTitle");r.addClass("sapUiTinyMarginEnd");r.writeClasses();r.write('>');r.writeEscaped(c.getTitle());r.write('</span>');r.write('</a>');if(c.getDeprecated()){r.write('<span');r.addClass("sapDemokitTreeItemLabel");r.writeClasses();r.write('>');r.write("Deprecated");r.write('</span>');}};return D;},true);
