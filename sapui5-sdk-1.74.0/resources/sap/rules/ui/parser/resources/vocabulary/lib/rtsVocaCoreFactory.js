jQuery.sap.declare("sap.rules.ui.parser.resources.vocabulary.lib.rtsVocaCoreFactory");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.rtsVocaContextBase");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.rtsVoca");sap.rules.ui.parser.resources.vocabulary.lib.rtsVocaCoreFactory=sap.rules.ui.parser.resources.vocabulary.lib.rtsVocaCoreFactory||{};sap.rules.ui.parser.resources.vocabulary.lib.rtsVocaCoreFactory.lib=(function(){var c=sap.rules.ui.parser.resources.vocabulary.lib.rtsVocaContextBase.lib;var r=sap.rules.ui.parser.resources.vocabulary.lib.rtsVoca.lib;function a(){}a.prototype.getVocabularyRuntimeServices=function(b){var d=this.getVocabularyRuntimeServices.prototype.rtsVocaInst;if(b instanceof c.rtsVocaContextBaseLib||(b&&b.hasOwnProperty("connection"))){d=new r.vocabularyRuntimeServices(b);this.getVocabularyRuntimeServices.prototype.rtsVocaInst=d;d.rtContext.loadAll(d.allVocaObjects);}else if(!this.getVocabularyRuntimeServices.prototype.hasOwnProperty('rtsVocaInst')){}return d;};return{rtsVocaCoreFactoryLib:a};}());
