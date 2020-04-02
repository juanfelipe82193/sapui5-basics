// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * FLP Performance Measurements
 * @private
 */
sap.ui.define(["sap/ui/thirdparty/jquery", "sap/base/util/now"], function (jQuery, now) {
    "use strict";

    var PerfM = function () {
        var perfActive = false,
            blocklist = {};

        function Measure (hash, name, start, info) {
            this.hash = hash;
            this.name = name;
            this.start = start;
            this.end = 0;
            this.duration = 0;
            this.info = info;
        }


        function Block (hash, name, start, scenario, sequence) {
            this.hash = hash;
            this.name = name;
            this.scenario = scenario;
            this.sequence = sequence;
            this.start = start;
            this.end = 0;
            this.percent = null;
            this.duration = 0;
            this.funcs = {};
        }

        this.start = function (scenario, block, sequence) {
            var timeStamp = now(),
                oBlock;

            if (!perfActive) {
                return;
            }

            if (blocklist[scenario] === undefined || blocklist[scenario] === null) {
                blocklist[scenario] = {};
            }

            if (blocklist[scenario][block] === undefined) {
                blocklist[scenario][block] = null;
            }

            if (blocklist[scenario][block] === null) {
                oBlock = new Block(this.hash(), block, timeStamp, scenario, sequence);
                blocklist[scenario][oBlock.name] = oBlock;
            }
        };

        this.startFunc = function (scenario, blockName, sequence, funcName, info) {
            if (!perfActive) {
                return;
            }
            var timeStamp = now();
            var block = null;

            if (blocklist[scenario] === undefined || blocklist[scenario] === null) {
                blocklist[scenario] = {};
            }

            if (blocklist[scenario][blockName] === undefined) {
                blocklist[scenario][blockName] = null;
            }

            if (blocklist[scenario][blockName] === null) {
                block = new Block(this.hash(), blockName, timeStamp, scenario, sequence);
                blocklist[scenario][blockName] = block;
            }

            var func = new Measure(this.hash(), funcName, timeStamp, info);
            blocklist[scenario][blockName].funcs[func.hash] = func;

            return func.hash;
        };

        this.end = function (scenario, block) {
            if (!perfActive) {
                return;
            }
            var timeStamp = now();

            if (blocklist[scenario][block] === undefined) {
                blocklist[scenario][block] = null;
            }

            if (blocklist[scenario][block] != null) {
                blocklist[scenario][block].end = timeStamp;
                blocklist[scenario][block].duration = Math.round(blocklist[scenario][block].end - blocklist[scenario][block].start);
            }
        };


        this.endFunc = function (scenario, block, fh) {
            if (!perfActive) {
                return;
            }
            var timeStamp = now();

            if (blocklist[scenario][block] === undefined) {
                blocklist[scenario][block] = null;
            }

            if (blocklist[scenario][block] != null) {
                blocklist[scenario][block].end = timeStamp;
                blocklist[scenario][block].duration = Math.round(blocklist[scenario][block].end - blocklist[scenario][block].start);
                blocklist[scenario][block].funcs[fh].end = timeStamp;
                blocklist[scenario][block].funcs[fh].duration = Math.round(blocklist[scenario][block].funcs[fh].end - blocklist[scenario][block].funcs[fh].start);
            }
        };

        this.calc = function () {
            if (!perfActive) {
                return;
            }

            return blocklist;
        };

        this.hash = function () {
            if (!perfActive) {
                return;
            }
            var val = (new Date()).valueOf().toString() + Math.random().toString();
            //var hash = 0;
            var hash = 5381;
            for (var i = 0; i < val.length; i++) {
                var char = val.charCodeAt(i);
                hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
            }

            return hash;
        };

        this.getActive = function () {
            return perfActive;
        };

        this.setActive = function (bOn, aCategories) {
            if (perfActive === bOn) {
                return;
            }
            perfActive = bOn;
            document.addEventListener("keyup", function (e) {
                if (e.shiftKey && e.ctrlKey && e.altKey && e.keyCode == 77) {
                    window.calc = JSON.stringify(jQuery.sap.flpmeasure.calc());
                    window.open(sap.ui.require.toUrl("sap/ushell/renderers/fiori2/stat") + ".html");
                }
            }, false);
            return perfActive;
        };

        var aMatch = location.href.match(/sap-flp-measure=([^&]*)/);
        if (aMatch && aMatch[1]) {
            if (aMatch[1] === "true" || aMatch[1] === "x" || aMatch[1] === "X") {
                this.setActive(true);
            } else {
                this.setActive(true, aMatch[1]);
            }
        }
    };

    // Activate FLP Performance Measurements
    jQuery.sap.flpmeasure = jQuery.sap.flpmeasure || new PerfM();
    return jQuery.sap.flpmeasure;
});