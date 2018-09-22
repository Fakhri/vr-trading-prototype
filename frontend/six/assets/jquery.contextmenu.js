/**
 * contextmenu displays a popup menu, is used with tree (right click to show the context menu
 * @author mbu
 *
 * @requires jquery.js

 * @param content The id of the content to show/hide.
 *
 *
 *
 * @version 1.0.0    initial version
 */

(function($) {
    $.fn.contextmenu = function(options) {

        var defaults = {
            elements: null,
            width: 100
        };

        var options = $.extend(defaults, options);
        var targetObject = undefined;
        var event = undefined;
        contextmenutimer = undefined;

        return this.each(function() {
            var obj = $(this);

            var fnArray = new Array();
            var link = document.createElement('div');
            obj.remove().appendTo("body");
            $(obj).addClass("contextMenu");

            $.fn.addElement = function(title, action, active) {
                var elem = document.createElement('div');
                $(elem).addClass("contextmenu_element");
                if (active == 0) $(elem).addClass("contextmenu_inactive");
                $(elem).html(title);
                $(link).append($(elem));
                fnArray.push(action);
            };

            $.fn.addSplitter = function() {
                var elem = document.createElement('div');
                $(elem).attr("class", "contextmenu_splitter");
                $(elem).html("<!-- -->");
                $(link).append($(elem));
            };

            $.fn.isVisible = function() {
                return obj.is(":visible");
            };

            function open(target) {
                if (target.length) {
                    targetObject = $(target[0]);
                    event = target[1];
                } else {
                    targetObject = $(target);
                }
                obj.html($(link).html());
                //add events
                var i = 0;
                $(".contextmenu_element", obj).each(function(index, item) {
                    if (!$(item).hasClass("contextmenu_inactive")) {
                        $(item).bind("click", {id:targetObject.parent().attr("id")}, fnArray[i]);
                        $(item).bind("mouseover", function() {
                            $(this).addClass("contextmenu_selected");
                        });
                        $(item).bind("mouseleave", function() {
                            $(this).removeClass("contextmenu_selected");
                        });
                    }
                    i++;
                });
                obj.css("width", options.width + 'px');
                positioning();
                obj.show();
                initCloseTimeout(obj);
                obj.bind("mouseleave", function() {
                    initCloseTimeout(obj);
                });
                obj.bind("mouseover", function() {
                    clearTimeout(window.contextmenutimer);
                });
            }

            function initCloseTimeout(obj) {
                window.contextmenutimer = setTimeout(function() {
                    obj.trigger("close");
                }, 3000);
            }

            function positioning() {
                var pos = targetObject.offset();
                var posX = pos.left;
                if (event) {
                    // positionning with mouse position
                    if (event.pageX) {
                        posX = event.pageX;
                    } else if (event.clientX) {
                        posX = event.clientX;
                    }
                    // show left
                    if (posX + obj.width() > $(window).width())
                        posX = posX - obj.width();
                }
                obj.css("left", posX);

                // positionning
                var postop = pos.top;
                var height = obj.height() + 15;
                if (($(window).height() - postop) < height && postop > height) {
                    // show top
                    obj.css("top", postop - 0 - obj.height());
                } else {
                    // show bottom
                    obj.css("top", postop + targetObject.height());
                }
            }

            function close() {
                obj.hide();
                obj.unbind("mouseleave");
                obj.unbind("mouseover");
            }

            function disableItem(itemName, permanentDisabled) {
                if (obj.is(":visible")) obj.trigger("close");
                var elem = document.createElement('div');
                $(link).find(".contextmenu_element").each(function(index, item) {
                    if ($(item).html().indexOf($(elem).html(itemName).html()) != -1) {
                        if (permanentDisabled!=undefined && permanentDisabled) $(item).addClass("contextmenu_inactive");
                        else $(item).addClass("contextmenu_inactive2");
                    }
                });
            }

            function enableItem(itemName, permanentEnabled) {
                var elem = document.createElement('div');
                $(link).find(".contextmenu_element").each(function(index, item) {
                    if ($(item).html().indexOf($(elem).html(itemName).html()) != -1) {
                        if (permanentEnabled!=undefined && permanentEnabled)  $(item).removeClass("contextmenu_inactive");
                        else $(item).removeClass("contextmenu_inactive2");
                    }
                });
            }

            obj.bind("open", function(event, target) {
                $('.contextMenu').trigger("close");
                open(target);
            });
            obj.bind("close", function() {
                close();
                clearTimeout(window.contextmenutimer);
                $(link).find(".contextmenu_inactive2").removeClass("contextmenu_inactive2");
            });
            obj.bind("disableItem", function(event, item, state) {
                disableItem(item,state);
            });
            obj.bind("enableItem", function(event, item, state) {
                enableItem(item,state);
            });
            document.onkeydown = function menu_key_event(e) {
                var event = e || window.event;
                if (event.keyCode == 27) {
                    $('.contextMenu').trigger("close");
                }
            };
        });
    }
})(jQuery);
