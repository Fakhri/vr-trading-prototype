/**
 * multiSelectRow : enable multiselection rows in a table
 * @author mbu, fwe
 *
 * @requires jquery.js

 * @params
 *
 *    selectedClass: class used to show and define a selected row
 *    disableTextSelection: disable text selection of the browser to avoid text selection when perfoming a range selection
 * @Implementation
 *    Assign an id to each row in the table. Then use the plugin on the table. eg : $("#mytable").multiSelectRow();
 *
 *  @Methods
 *    getSelection: return an array with the selected row ids
 *
 *
 * @version 1.0.0	initial version
 */


(function($){
    $.fn.multiSelectRow = function(options) {

        var defaults = {
            selectedClass: "selected",
            disableTextSelection:true
        };

        var options = $.extend(defaults, options);

        var curSelection=new Array();
        return this.each(function() {
            obj = $(this);
            obj.find("tbody tr").bind("click", {parent: obj}, function(e) {
                obj = e.data.parent;
                if(e.ctrlKey) {
                    //add one item to the current selection
                    if (!$(this).hasClass(options.selectedClass)) {
                        $(this).addClass(options.selectedClass);
                        curSelection.push(this.id);
                    }

                } else if(e.shiftKey) {
                    //TODO possibility to select more than one range
                    //select a range of rows
                    if (curSelection.length==1) {
                        var prev = $("tr[id='"+curSelection[curSelection.length-1]+"']");
                        var next = $("tr[id='"+curSelection[curSelection.length-1]+"']");
                        if (prev.position().top < $(this).position().top) {
                            //select backward
                            if (!$(this).hasClass(options.selectedClass)) {
                                curSelection.push($(this).attr("id"));
                                $(this).addClass(options.selectedClass);
                            }
                            var nnext = next.next("tr");
                            while (!nnext.hasClass("selected")) {

                                curSelection.push(nnext.attr("id"));
                                nnext.addClass(options.selectedClass);

                                nnext = nnext.next("tr");
                                //ensure right termination
                                if (nnext==undefined) return;
                            }
                        }
                        else {
                            //select forward
                            if (!$(this).hasClass(options.selectedClass)) {
                                curSelection.push($(this).attr("id"));
                                $(this).addClass(options.selectedClass);
                            }
                            var nnext = prev.prev("tr");
                            while (!nnext.hasClass("selected")) {

                                curSelection.push(nnext.attr("id"));
                                nnext.addClass(options.selectedClass);

                                nnext = nnext.prev("tr");
                                //ensure right termination
                                if (nnext==undefined) return;
                            }
                        }
                    }
                } else {
                    //select one item
                    curSelection=new Array();
                    obj.find("tbody tr."+options.selectedClass).removeClass(options.selectedClass);
                    $(this).addClass(options.selectedClass);
                    curSelection.push(this.id);
                }

            });

            //return current selection
            $.fn.getSelection = function() {
                return curSelection;
            };

            $.fn.insertToSelection = function(item) {
               curSelection.push(item);
            };

            if (options.disableTextSelection) {
                //disable text selection
                this.onselectstart = function () { return false; } // ie
                this.onmousedown = function () { return false; } // mozilla
            }
        });
    }
})(jQuery);