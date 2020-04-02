// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config"],function(C){"use strict";function S(a,c,p,s){this.createTicket=function(o){return a.createTicket(o);};this.isEnabled=function(){return C.last("/core/extension/SupportTicket");};}S.hasNoAdapter=false;return S;},true);
