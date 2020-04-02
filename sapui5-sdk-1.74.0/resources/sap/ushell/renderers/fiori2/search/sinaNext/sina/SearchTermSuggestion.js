// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['../core/core','./Suggestion','./SuggestionType'],function(c,S,a){"use strict";return S.derive({type:a.SearchTerm,_meta:{properties:{searchTerm:{required:true},filter:{required:true},childSuggestions:{required:false,default:function(){return[];}}}}});});
