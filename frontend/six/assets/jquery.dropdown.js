/**
 * Styled Dropdown.
 * @author NOSE
 * @version 1.0.0	initial version
 */
jQuery.fn.dropdown = function(op) {
    // defaults
    var defaults =  {
        timeAnimateShow: 90,
        timeAnimateHide: 20,
        maxCharacters:23,
        easingAnimateShow:"easeOutSine",
        easingAnimateShow:"easeInSine"
    };
    jQuery.extend(defaults, op);

    // references
    var elSelect = jQuery(this);
    var elsSelectOption;
    elSelect.hide();
    var elDropdown;
    var elDropdownList;
    var selValue="";

    // prepare
    initMarkup();




    /*
     * Initializes the markup.
     */
    function initMarkup() {

        // select options
        elsSelectOption = jQuery("option",elSelect);
        var elOptionSelected = jQuery("option:selected",elSelect);
        selValue=elOptionSelected.attr("value");
        // markup
        var id = elSelect.attr("id") + "_dropdown";
        //iframe is a hack for ie6 to solve z-index prob -> render the div as a windowed component permitting to be over input controls
        var markup = "<div class='dropdown' id='"+id+"'><iframe id='dropdown_hack' style='visibility:hidden;position:absolute;display: block;width: 500; height: 500;z-index:-1;filter: mask();top: 0; left: 0;background-color: #ffffff;'></iframe><h3><a href='#'>&nbsp;</a></h3>";
        markup += "<ul>";
        for (var i = 0; i < elsSelectOption.length; i++) {
            var elOption = jQuery(elsSelectOption[i]);
            markup += "<li><a href='#' rel='option_"+i+"'>"+elOption.html()+"</a></li>";
        }
        markup += "</ul>";

        // append
        elSelect.after(markup);

        // text
        setSelectedText(elOptionSelected.html());

        // references
        elDropdown = jQuery("#"+id);
        elDropdownList = jQuery("ul",elDropdown);
        //elDropdownList.bgiframe();
        elDropdownList.hide();

        // events
        jQuery("h3",elDropdown).bind("click",showDropdown);
        jQuery("ul li a",elDropdown).bind("click",selectOption);

    }

    $.fn.getValue = function() {
        return selValue;
    };

    /*
     * Selects the option.
     */
    function selectOption() {
        // index
        var rel = jQuery(this).attr("rel");
        var ind = rel.substring(7,rel.length);
        var elOptionSelected = jQuery(elsSelectOption[ind]);

        // select
        selValue=elOptionSelected.attr("value");

        // text
        setSelectedText(elOptionSelected.html());

        // hide
        hideDropdown();
        elSelect.trigger("change");
        return false;
    }


    /*
     * Shows the dropdown.
     */
    function showDropdown(){
        // show
        jQuery(elDropdownList).slideDown(defaults.timeAnimateShow,function(){
            // event
            jQuery("html, body").bind("click",hideDropdown);
            jQuery("h3",elDropdown).bind("click",hideDropdown);
            $("#dropdown_hack").css("width",jQuery(elDropdownList).width()+2);
            $("#dropdown_hack").css("height",jQuery(elDropdownList).height()+24);
            //use the hack only with ie6
            if (document.all && !window.opera && !window.XMLHttpRequest) $("#dropdown_hack").css("visibility","visible");
        });
        return false;
    }


    /*
     * Hides the dropdown.
     */
    function hideDropdown(){
        jQuery(elDropdownList).slideUp(defaults.timeAnimateHide,defaults.easingAnimateHide);
        $("#dropdown_hack").css("visibility","hidden");
        // event
        jQuery("html, body").unbind("click",hideDropdown);
        jQuery("h3",elDropdown).unbind("click",hideDropdown);
    }

    /**
     * Extracts the text.
     */
    function setSelectedText(txt) {
        // title
        jQuery("h3 a",elDropdown).attr("title",txt);

        // content
        if (txt != null && txt.length > defaults.maxCharacters) {
            txt = txt.substring(0,defaults.maxCharacters) + "...";
        }
        jQuery("h3 a",elDropdown).html(txt);
    }



    // return
    return this;
};