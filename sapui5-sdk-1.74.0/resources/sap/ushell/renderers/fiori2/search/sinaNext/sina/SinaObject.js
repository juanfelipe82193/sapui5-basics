// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['../core/core'],function(c){"use strict";return c.defineClass({_meta:{properties:{sina:{required:false,getter:true},_private:{required:false,default:function(){return{};}}}},_initClone:function(o){this.sina=o.sina;},_equals:function(o){return this.sina===o.sina;}});});
