// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['../core/core','./ResultSet'],function(c,R){"use strict";return R.derive({toString:function(){var r=[];r.push('--Facet');r.push(R.prototype.toString.apply(this,arguments));return r.join('\n');}});});
