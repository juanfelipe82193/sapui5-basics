if (typeof define === "function" && define.amd) {
    window["@disable_define_for_sinon"] = window.define;
    window.define = null; 
}
