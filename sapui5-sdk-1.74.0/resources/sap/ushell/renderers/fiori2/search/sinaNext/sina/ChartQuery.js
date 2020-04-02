// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['../core/core','./FacetQuery'],function(c,F){"use strict";return F.derive({_meta:{properties:{top:{default:5},dimension:{required:true}}},_initClone:function(o){this.dimension=o.dimension;},_equals:function(o){return this.dimension===o.dimension;},_execute:function(q){return this.sina.provider.executeChartQuery(q);}});});
