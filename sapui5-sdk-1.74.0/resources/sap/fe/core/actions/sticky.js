/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/actions/operations"],function(o){"use strict";function e(c){var m=c.getModel(),M=m.getMetaModel(),b=M.getMetaPath(c.getPath()),E=M.getObject(b+"@com.sap.vocabularies.Session.v1.StickySessionSupported/EditAction"),f;if(!E){throw new Error("Edit Action for Sticky Session not found for "+b);}f=m.bindContext(E+"(...)",c);return f.execute();}function a(c){var m=c.getModel(),M=m.getMetaModel(),b=M.getMetaPath(c.getPath()),S=M.getObject(b+"@com.sap.vocabularies.Session.v1.StickySessionSupported/SaveAction"),f;if(!S){throw new Error("Save Action for Sticky Session not found for "+b);}f=m.bindContext(S+"(...)",c);return f.execute();}function d(c){var m=c.getModel(),M=m.getMetaModel(),b=M.getMetaPath(c.getPath()),D=M.getObject(b+"@com.sap.vocabularies.Session.v1.StickySessionSupported/DiscardAction"),f;if(!D){throw new Error("Discard Action for Sticky Session not found for "+b);}f=m.bindContext("/"+D+"(...)");return f.execute().then(function(){return c;});}var s={editDocumentInStickySession:e,activateDocument:a,discardDocument:d};return s;});
