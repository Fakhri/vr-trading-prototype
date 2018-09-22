/**
 * pull : update automatically fields in tables with changed values provided by an ajax page
 * @author mbu, fwe
 *
 * @requires jquery.js

 * @params
 *
 *    pullUrl: path to the ajax page that provides pull data
 *    multiColor: A boolean to indicate if we will highlight the cell with a different color depending on the value (positive/negative)
 *    highlightColorUp: A color in hexadecimal. if multiColor is set to true and field value higher than 0, highlight the cell with this color
 *    highlightColorDown: A color in hexadecimal. if multiColor is set to true and field value lower than 0, highlight the cell with this color
 *    highlightColorNeutral: A color in hexadecimal. if multiColor is set to false, highlight the cell with this color
 *    fieldPrefix: prefix for field classes which require pull
 *    refreshDelay: time between each pull
 *
 * @methods
 *    addRenderer: allow to apply a specific renderer on a field.
 *         @params
 *              fn(object, oldValue, newValue): function that takes as param the jquery object, the old value and the new one and give as result the rendered value
 *              if returned value is undefined, there will be no change for the field and no other renderers will be applied. Useful if you want to manipulate directly the object (eg : change an img)
 *
 *
 *
 * @version 1.0.0    initial version
 */

(function($) {
    $.fn.pull = function(options) {
        var defaults = {
            pullUrl: "/idhtml/pull_data1.jsp",
            multiColor: true,
            highlightColorUp:"#339900",
            highlightColorDown:"#CC0000",
            highlightColorNeutral:"#FFCC00",
            fieldPrefix:"n",
            heatmapPrefix:"ht",
            refreshDelay: 5000,
            statusField: $("#status")
        };

        var holdTheInterval;
        var lOptions = $.extend(defaults, options);
        var renderers = new Array();

        return this.each(function() {
            var obj = $(this);
            var cacheString = "";
            var hilightQueue = new Array();
            var cacheQueue = new Array();
            var alreadyUpdated = new Array();

            function init() {

                //cleanup
                cacheQueue = new Array();
                cacheString = "";
                if (holdTheInterval!=undefined) clearTimeout(holdTheInterval);

                //Search components for which we need to provide pull features
                var caches = $('span.cache');
                var splitter = "";
                caches.each(function() {
                    cacheString += splitter + $(this).text();
                    cacheQueue.push($(this).text());
                    splitter = ";";
                });
                if (cacheString != "") {
                    holdTheInterval = setTimeout(function() {
                        update(cacheString)
                    }, lOptions.refreshDelay);
                }
            }


            function parse(values) {
                //alert(values);
                var changes = new Array(2);
                var changedIds = new Array();
                var changedValues = new Array();
                if (values != "") {
                    var rows = values.split("/");
                    for (var i = 0; i < rows.length; i++) {
                        var listing_fields = rows[i].split("*");
                        var listing = listing_fields[0];
                        if (listing_fields[1] != null) {
                            var fields = listing_fields[1].split(";");
                            for (var j = 0; j < fields.length; j++) {
                                var pair = fields[j].split("=");
                                var cell_id = listing + pair[0];
                                //possible, if multiple caches are on a page
                                if (jQuery.inArray(cell_id, changedIds) == -1) {
                                    updateCell(cell_id, pair[1]);
                                }
                            }
                        }
                    }
                }
                return changes;
            }

            function clearHilight() {
                for (var i = 0; i < hilightQueue.length; i++) {
                    var elem = $(hilightQueue[i]);
                    //elem.effect("highlight", {color:options.highlightColorNeutral}, 2000);
                    elem.parent().removeClass("hilightMore hilightLess hilightSame");
                }
            }

            function update(cacheName) {
                var out_cache = encodeURI(cacheName);
                var path = lOptions.pullUrl;
                $.ajax({
                    url : path,
                    data: "cache=" + out_cache,
                    method: 'post',
                    dataType: 'text',
                    success: function(msg) {
                        updateListings($.trim(msg));
                        var status = lOptions.statusField;
                        //update stats label if exists
                        if (status != undefined) {
                            now = new Date();
                            if (now.getDate() < 10) {
                                date = "0" + now.getDate();
                            } else {
                                date = now.getDate();
                            }
                            if (now.getMonth() + 1 < 10) {
                                month = "0" + (now.getMonth() + 1);
                            } else {
                                month = now.getMonth() + 1;
                            }
                            if (now.getHours() < 10) {
                                hours = "0" + now.getHours();
                            } else {
                                hours = now.getHours();
                            }
                            if (now.getMinutes() < 10) {
                                minutes = "0" + now.getMinutes();
                            } else {
                                minutes = now.getMinutes();
                            }
                            if (now.getSeconds() < 10) {
                                seconds = "0" + now.getSeconds();
                            } else {
                                seconds = now.getSeconds();
                            }
                            $(status).html(date + "." + month + "." + now.getFullYear() + " " + hours + ":" + minutes + ":" + seconds);
                            $(status).addClass("hilightSame");
                        }

                        //remove hilight
                        var holdHilight = setTimeout(function() {
                            clearHilight();
                            lOptions.statusField.removeClass("hilightMore hilightLess hilightSame");
                            //empty hilight queue
                            hilightQueue = new Array();
                            alreadyUpdated = new Array();
                        }, 2000);

                        holdTheInterval = setTimeout(function() {
                            update(cacheString)
                        }, lOptions.refreshDelay);
                    }
                });
            }

            function transformToFloat(value) {
                if (value == undefined) return 0.0;
                value = value.replace("'", "");
                value = value.replace(",", ".");
                return value;
            }

            function updateCell(key, value) {
                for (var cq = 0; cq < cacheQueue.length; cq++) {
                    var searchPattern = '#' + cacheQueue[cq] + lOptions.fieldPrefix + key;
                    var newValue, oldValue, parentCell;
                    var cellNode = $(searchPattern);
                    if (cellNode != undefined) {
                        newValue = value;
                        oldValue = cellNode.text();
                        for (var k1 = 0; k1 < renderers.length; k1++) {
                            if (newValue != undefined)
                                newValue = renderers[k1](cellNode, oldValue, newValue);
                        }
                        if (newValue != undefined)
                            cellNode.html(newValue);
                        //highlight the cell
                        if (newValue != undefined) {
                            if (lOptions.multiColor) {
                                if (newValue.indexOf(":") <= 0 && newValue.indexOf(".") > 0) { //no highlight for time and volume, think of better criterium (put it in class for example)
                                    if (transformToFloat(newValue) > transformToFloat(oldValue)) {
                                        jCellNode.parent("td").effect("highlight", {color:lOptions.highlightColorUp}, 2000);
                                    } else {
                                        jCellNode.parent("td").effect("highlight", {color:lOptions.highlightColorDown}, 2000);
                                    }
                                }
                            } else {
                                var type = "hilightSame";
                                if ((oldValue != undefined) && (newValue.indexOf(":") <= 0) && (newValue.indexOf(".") > 0)) { //no highlight for time and volume, think of better criterium (put it in class for example)
                                    var a = transformToFloat(newValue);
                                    var b = transformToFloat(oldValue);
                                    if (a > b) {
                                        type = "hilightMore";
                                    } else if (a < b) {
                                        type = "hilightLess";
                                    }
                                }
                                //not enough fast
                                //$(cellNode).parent("td").effect("highlight", {color:options.highlightColorNeutral}, 2000);
                                //so...put in an array and hilight all in same time without effect
                                parentCell = cellNode.parent("td");
                                hilightQueue.push(searchPattern);
                                parentCell.addClass(type);
                            }
                        }
                    }
                    searchPattern = '#' + cacheQueue[cq] + lOptions.heatmapPrefix + key;
                    cellNode = $(searchPattern);
                    if (cellNode != undefined) {
                        newValue = value;
                        oldValue = cellNode.text();
                        for (var k2 = 0; k2 < renderers.length; k2++) {
                            if (newValue != undefined)
                                newValue = renderers[k2](cellNode, oldValue, newValue);
                        }
                        if (newValue != undefined)
                            cellNode.html(newValue);
                        //highlight the cell
                        if (newValue != undefined) {
                            var type = "hilightSame";
                            if ((oldValue != undefined) && (newValue.indexOf(":") <= 0) && (newValue.indexOf(".") > 0)) { //no highlight for time and volume, think of better criterium (put it in class for example)
                                var a = transformToFloat(newValue);
                                var b = transformToFloat(oldValue);
                                if (a > b) {
                                    type = "hilightMore";
                                } else if (a < b) {
                                    type = "hilightLess";
                                }
                            }
                            parentCell = cellNode.parent();
                            alreadyUpdated.push(parentCell.attr("id"));
                            parentCell.addClass(type);
                            hilightQueue.push(searchPattern);
                        }
                    }
                }
            }

            function updateListings(transport) {
                var changes = parse(transport);
            }

            //bind actions
            obj.bind("addRenderer", function(event, fn) {
                renderers.push(fn);
            });


            obj.bind("init", function() {
                init();
            });
        });
    }
})(jQuery);
