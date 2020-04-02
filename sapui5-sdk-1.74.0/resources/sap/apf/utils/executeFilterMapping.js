/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/core/utils/filter","sap/apf/core/constants"],function(F,c){"use strict";var e=function(i,m,t,C,M){m.sendGetInBatch(i,a);function a(r){var f;if(r&&r.type&&r.type==="messageObject"){M.putMessage(r);C(undefined,r);}else{f=new F(M);r.data.forEach(function(d){var o=new F(M);t.forEach(function(T){o.addAnd(new F(M,T,c.FilterOperators.EQ,d[T]));});f.addOr(o);});C(f,undefined,r.data);}}};return e;},true);
