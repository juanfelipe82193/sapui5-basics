// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['../../core/core','./Formatter','../../core/util'],function(c,F,u){"use strict";return F.derive({initAsync:function(){},format:function(r){return u.removePureAdvancedSearchFacets(r);},formatAsync:function(r){r=u.removePureAdvancedSearchFacets(r);return c.Promise.resolve(r);}});});
