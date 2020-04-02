/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['./ItemBaseFlex'],function(I){"use strict";var c=Object.assign({},I);c.beforeAddItem=function(D,d,C,p,o){return D.beforeAddItem(d,C,p,o.role);};c.afterRemoveItem=function(D,i,C,p){return D.afterRemoveItem(i,C,p);};c.findItem=function(m,i,n){return i.find(function(o){var k=m.getProperty(o,"key");return k===n;});};c.addItem=c.createAddChangeHandler();c.removeItem=c.createRemoveChangeHandler();c.moveItem=c.createMoveChangeHandler();return c;});
