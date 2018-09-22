/**
 * Telekurs iD Javascript Stuff.
 * @author NOSE
 *
 * @version 1.0.0 initial version
 *
 */

var Telekurs = {

    pullObj : undefined,
    /**
     * Initialize on ready.
     */
    initOnReady: function() {
        // context
        var ctxContainer = jQuery("#container, #searchmain, #vdbcontainer");
        var ctxSidebar = jQuery("#sidebar");
        var ctxContent = jQuery("#content, #searchmain, #body_content");
        var ctxNavigation = jQuery("#navigation");

        // initialize
        //Telekurs.initNavigation(ctxNavigation);

        Telekurs.initTree(ctxSidebar);
        Telekurs.initToggler(ctxContainer);
        Telekurs.initTables(ctxContent);
        Telekurs.initPrintLinks(ctxContainer);
        Telekurs.initPull();
        Telekurs.initForms();
        Telekurs.initMultiSelect();
        Telekurs.setStartPageFunction();


        /* Trigger an event (idhtmlload) to indicate all idhtml js core is loaded
         You can surround your scripts that have dependency with this js file with this block :

         jQuery(window).bind("idhtmlload",function() {
         });

         */
        jQuery(window).trigger("idhtmlload");

    },
    /**
     * Initialize on load.
     */
    initOnLoad: function() {

    },

    /**
     * Initialize the tree navigation.
     */
    initMultiSelect: function() {
        if ($(".multiselect").size() > 0) $(".multiselect").multiSelectRow();
    },

    /**
     * Initialize the tree navigation.
     */
    initPull: function() {
        if (typeof(window["updateInterval"]) != undefined && $(document).pull != undefined) {
            Telekurs.pullObj = $(document).pull({
                refreshDelay: updateInterval * 1000,
                multiColor: false
            });

            var trend_renderer = function(cell, oldValue, newValue) {
                if (cell.children("img").size() > 0) {
                    if (cell.children("img").attr("src").match("Trend")) {
                        if (newValue > 0.00) {
                            cell.children("img").attr("src", "/idhtml/images/data/Trend1.png");
                        } else if (newValue < 0.00) {
                            cell.children("img").attr("src", "/idhtml/images/data/Trend-1.png");
                        } else {
                            cell.children("img").attr("src", "/idhtml/images/data/Trend0.png");
                        }
                        return undefined;
                    } else return newValue;
                } else return newValue;
            };

            var news_renderer = function(cell, oldValue, newValue) {
                if (cell.children("img").size() > 0) {
                    if (cell.children("img").attr("src").match("News")) {
                        //do nothing
                        return undefined;
                    } else return newValue;
                } else return newValue;

            };

            /*   todo : optimize
             not yet activated!!*/
            var cell_color_renderer = function(cell, oldValue, newValue) {
                if (cell.hasClass("more") || cell.hasClass("less") || cell.hasClass("same")) {
                    cell.removeClass("more less same");
                    var calc_value = parseFloat(newValue.replace(/\'/, ""));
                    if (calc_value > 0) cell.addClass("more");
                    if (calc_value < 0) cell.addClass("less");
                    if (calc_value == 0) cell.addClass("same");
                    return newValue;
                } else return newValue;

            };

            var pip_renderer = function(cell, oldValue, newValue) {
                var forex_select = document.getElementById("forex_style");
                if (forex_select != undefined) {
                    var forex_style = forex_select.selectedIndex;
                    if (cell.hasClass("pip") && (forex_style == 1 || forex_style == 4 )) {
                        var bid_cell = cell.prev();
                        var bid_value = bid_cell.html();
                        var ask_length = newValue.length;
                        var diff = "";
                        var notEqual = false;
                        for (var i = 0; i < ask_length; i++) {
                            if (bid_value.substr(i, 1) != newValue.substr(i, 1) || notEqual) {
                                diff += newValue.substr(i, 1);
                                notEqual = true;
                            }
                        }
                        return diff;

                    } else return newValue;
                } else return newValue;
            };
            Telekurs.pullObj.trigger("addRenderer", pip_renderer);
            Telekurs.pullObj.trigger("addRenderer", trend_renderer);
            Telekurs.pullObj.trigger("addRenderer", news_renderer);
            // pullObj.trigger("addRenderer",cell_color_renderer);
            Telekurs.pullObj.trigger("init");
        }
    },
    /**
     * Initialize the tree navigation.
     */
    initTree: function(ctx) {
        // listing tree
        var counter = 0;

        var treeNodeEvent = function() {
            // toggle node
            var mainNode = jQuery(this).parent();
            mainNode.toggleClass("open");
            if (jQuery(this).attr("src").match("ArrowUp_active")) {
                jQuery(this).attr("src", "/idhtml/images/menu/ArrowDown_normal.png");
            } else {
                jQuery(this).attr("src", "/idhtml/images/menu/ArrowUp_active.png");
                //mainNode.find("> ul > .node > img").live("click",treeNodeEvent);
                //mainNode.find("> ul > .leaf > span").hover(leafHoverEvent,leafOutEvent);
            }
            return false;
        };

        jQuery("ul.tree .node img").live("click", treeNodeEvent);

        var leafHoverEvent = function() {
            $(this).addClass("hover");
        };
        var leafOutEvent = function() {
            $(this).removeClass("hover");
        };

        jQuery("ul.tree .leaf span").hover(leafHoverEvent, leafOutEvent);


        var basicTreeNodeEvent = function() {
            // toggle node
            jQuery(this).parent().find("> ul > .node > a,> ul .node > span").bind("click", basicTreeNodeEvent);
            jQuery(this).parent().toggleClass("open");
            return false;
        };
        //standard tree
        jQuery("ul.basictree > .node > a,ul.basictree > .node > span").bind("click", basicTreeNodeEvent);


    },

    /**
     * Initialize the toggler.
     */
    initToggler: function(ctx) {

        // toggler
        jQuery(".toggler", ctx).each(function(ind, el) {
            // vars
            var id = jQuery(el).attr("id");
            var msgExpanded = null;
            var msgCollapsed = null;
            var expanded = false;
            var title = jQuery(this).attr("title");
            if (jQuery(el).hasClass("expanded")) {
                expanded = true;
            }
            if (title.indexOf("$") >= 0) {
                var msgs = title.split("$");
                msgCollapsed = msgs[0];
                msgExpanded = msgs[1];
            }

            // toggle
            jQuery(el).toggler("." + id, {expanded:expanded,msgCollapsed:msgCollapsed,msgExpanded:msgExpanded});

        });
    },

    /**
     * Initialize the forms.
     */
    initForms: function(ctx) {
        // datepicker
        if (jQuery(".date") != undefined) {
            jQuery(".date").datepicker({dateFormat: 'dd.mm.yy', changeYear:true, showOn: 'button', buttonText: '', buttonImage: '/idhtml/style/img/icon_calendar.gif', buttonImageOnly: true, constrainInput: false});
            jQuery(".date").change(function() {
                if ($(this).val() != "" && !$(this).val().match(/^(((0?[1-9]|[12]\d|3[01])\.(0[13578]|[13578]|1[02])\.((1[6-9]|[2-9]\d)\d{2}))|((0?[1-9]|[12]\d|30)\.(0[13456789]|[13456789]|1[012])\.((1[6-9]|[2-9]\d)\d{2}))|((0?[1-9]|1\d|2[0-8])\.0?2\.((1[6-9]|[2-9]\d)\d{2}))|(29\.0?2\.((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/)) {
                    $(this).css("background-color", "#FF6666");
                    $(this).addClass("val_err");
                } else {
                    $(this).css("background-color", "#FDFDFD");
                    $(this).removeClass("val_err");
                }
            });
        }
        if (jQuery(".date2") != undefined) {
            jQuery(".date2").datepicker({dateFormat: 'yymmdd', changeYear:true, showOn: 'button', buttonText: '', buttonImage: '/idhtml/style/img/icon_calendar.gif', buttonImageOnly: true, constrainInput: false});
            jQuery(".date2").change(function() {
                if ($(this).val() != "" && !$(this).val().match(/^((((1[6-9]|[2-9]\d)\d{2})(0[13578]|[13578]|1[02])(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(0[13456789]|[13456789]|1[012])(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})0?2(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))$/)) {
                    $(this).css("background-color", "#FF6666");
                    $(this).addClass("val_err");
                } else {
                    $(this).css("background-color", "#FDFDFD");
                    $(this).removeClass("val_err");
                }
            });
        }
        if (jQuery(".time") != undefined) {
            jQuery(".time").change(function() {
                var error = false;
                if ($(this).val() != "") {
                    var splittime = $(this).val().split(":");
                    if (!(splittime.length == 3 && (splittime[0] != "" && splittime[0] >= 0 && splittime[0] <= 23) && (splittime[1] != "" && splittime[1] >= 0 && splittime[1] <= 59) && (splittime[2] != "" && splittime[2] >= 0 && splittime[2] <= 59)))
                        error = true;
                }
                if (error) {
                    $(this).css("background-color", "#FF6666");
                    $(this).addClass("val_err");
                } else {
                    $(this).css("background-color", "#FDFDFD");
                    $(this).removeClass("val_err");
                }

            });
        }

        // set curser to search item
        if ("#search_term") {
            $("#search_term").select();
            $("#search_term").focus();
        }
    },

    /**
     * Initialize the tables.
     */
    initTables: function(ctx) {

        // hoverable
        jQuery("table.hoverable tbody tr", ctx).bind("mouseover", function(event) {
            //jQuery(this).addClass("hover");
            jQuery(this).css("background-color", "#44454e");
            jQuery(this).css("cursor", "pointer");
        });
        jQuery("table.hoverable tbody tr", ctx).bind("mouseout", function(event) {
            //jQuery(this).removeClass("hover");
            jQuery(this).css("background-color", "");
            jQuery(this).css("cursor", "pointer");
        });

        // zebra
        jQuery("table.zebra tr:nth-child(odd)", ctx).addClass("list_color1");
        jQuery("table.zebra tr:nth-child(even)", ctx).addClass("list_color2");

    },

    /**
     * Initialize the print links.
     */
    initPrintLinks: function(ctx) {
        jQuery(".print, #print", ctx).click(function() {
            window.open('/idhtml/print.jsp', 'print', 'left=30,top=30,width=1,height=1,toolbar=0,scrollbars=0,status=0');
        });
    },

    /**
     * Initialize the navigation menu
     */
    initNavigation: function(ctx) {
        // jQuery.ajaxSetup({dataType:'html', cache: false});
        jQuery(".item", ctx).each(function() {
            var item = $(this);
            var subnav = $("#subnavigation");
            item.bind("click", function() {

                jQuery(".item", ctx).each(function() {
                    $(this).parent().removeClass("selected");
                });
                item.parent().addClass("selected");
                //now load with ajax the new menu
                var id = item.parent().attr("id");

                subnav.load("/idhtml/navigation/nav_loader.jsp", {id:id}, function(responseText, textStatus, XMLHttpRequest) {
                    Telekurs.initTree(subnav);
                });
                return false;

            });
        });
        //activate initial menu
        jQuery(".selected .item", ctx).trigger("click");
    },

    registerACField: function(url, field, resultField) {
        var cache = {};
        $("#" + field).autocomplete({
            minLength: 2,
            deley: 500,
            source: function(request, response) {
                if (request.term in cache) {
                    response(cache[ request.term ]);
                    return;
                }
                $.ajax({
                    url: url + field,
                    dataType: "json",
                    data: request,
                    success: function(data) {
                        cache[ request.term ] = data;
                        response(data);
                    }
                });
            },
            select: function(event, ui) {
                if (ui.item) {
                    $("#" + resultField).attr("value", ui.item.id);
                    $("#" + field).attr("title", ui.item.value);
                }
            }
        });
    },

    fillField: function(url, field, fill) {
        if (fill) {
            $.get(url, function(data) {
                if (data != null && data != "null")
                    $("#" + field).val(data);
            });
        }
    },

    setTabTitle: function(title) {
        $("#tabTitle").html(title);
    },

    setTabTitleIframe: function(title) {
        $("#tabTitle", top.document).html(title);
    },

    /**
     * print filename and version of this file.
     */
    verison: function() {
        alert("telekurs.js - v1.0.0");
    },

    setStartPageFunction: function() {
        if ($("#saveLink").length > 0) {
            $("#saveLink").bind("click", function() {
                if (document.getElementById("iframeListingList") != undefined)
                    document.getElementById("iframeListingList").contentWindow.saveStartPage();
                else
                    saveStartPage();
            });
        }
    }

};
jQuery(document).ready(function() {
    Telekurs.initOnReady();
});
jQuery(window).bind("load", function() {
    Telekurs.initOnLoad();
});

