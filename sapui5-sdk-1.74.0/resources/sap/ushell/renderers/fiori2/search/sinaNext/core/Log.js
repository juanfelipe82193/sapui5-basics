// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['./core'],function(c){"use strict";var L=c.defineClass({ERROR:'error',WARNING:'warning',INFO:'info',_init:function(){this.messages=[];},getMessages:function(){return this.messages;},addMessage:function(s,t){this.messages.push({severity:s,text:t});}});return L;});
