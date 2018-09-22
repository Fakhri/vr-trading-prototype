function sleep(millis)
{
    var now = new Date();
    var exitTime = now.getTime() + millis;

    while (true)
    {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function formatPrice(inputField) {
    var el = document.getElementById(inputField);
    if (null != el)
    {
        el.value = el.value.replace(/[']/g, "");
    }
}
function NewsPopup(theURL, winName, features) {
    //	alert(theURL + " " + winName + " " + features);
    window.open(theURL, winName, features);
}
function getLayout(layout, listing, type) {
    document.location = "/idhtml/detail/overview.jsp?listing=" + listing + "&layout=" + layout + "&type=" + type;
}

function getSubLayout(layout, listing, type, sublayout) {
    document.location = "/idhtml/detail/overview.jsp?listing=" + listing + "&layout=" + layout + "&type=" + type + "&sublayout=" + sublayout;
}

//utility function used to hide or show chart in overview tab depending if
// we need more horizontally place or not
function toggleOverviewChart() {
    $("#overview_bottom_part2").hide();
    $("#overview_bottom_part3").hide();
    $("#overview_bottom_part1").attr("colspan","3") ;
}

function setFavorite(forward_path, data, type) {
    ypos = (screen.height - 150) / 2;
    xpos = (screen.width - 450) / 2;
    if (type == "favorite") {
        window_id = window.open("/idhtml/favorites/set.jsp?url=" + encodeURIComponent(data), "setFavorite", "width=450, height=150, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
    } else {
        window_id = window.open("/idhtml/ticker/set.jsp?url=" + forward_path + "&query=" + encodeURIComponent(data), "setFavorite", "width=450, height=150, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
    }
    //	window_id.moveTo(xpos, ypos);
}
function showVDB(query) {
    ypos = (screen.height - 450) / 2;
    xpos = (screen.width - 500) / 2;
    var pars = "width=729, height=550, status=no, toolbar=no, menubar=no, location=no, resizable=yes, scrollbars=yes, left=" + xpos + ", top=" + ypos;
    window_id = window.open("/idhtml/vdb/html.jsp?" + query, "vdb", pars);
    window_id.focus();
    //	window_id.moveTo(xpos, ypos);
}
function showPage(url) {
    document.location=url;
}
function showDetail(listing, red) {
    if (red) {
        detailPopup = window.open("/idhtml/detail/overview_red.jsp?listing=" + listing, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
    } else {
        detailPopup = window.open("/idhtml/detail/frameset.jsp?listing=" + listing, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
    }
    detailPopup.focus();
}

function openView(view, listing, layout, derivative_type, strike_base, rid, okey, cp, keytype)
{
    var listingNr = listing;
    if (listingNr == undefined || listingNr == "")
    {
        var listing_limit = getListings("")[getListings("").length - 1];
        if (listing_limit != undefined)
            listingNr = listing_limit.split(";")[0]
    }
    if (layout == undefined)
        layout = "singlequote-overview";
    if (derivative_type == undefined)
        derivative_type = "warrants";
    var url = "/idhtml/idscreen/" + view + ".jsp?listing=" + listingNr + "&layout=" + layout + "&derivative_type=" + derivative_type + "&strike_base=" + strike_base + "&rid=" + rid + "&okey=" + okey + "&cp=" + cp + "&keytype=" + keytype;
    document.location = url;
    /*
     var window_id = window.open(url, "iDscreen", "width=850, height=800, status=no, toolbar=no, menubar=no, location=no, resizable=yes, scrollbars=yes, left=10, top=10");
     window_id.focus();
     */
}

function closeChilds() {
    return false;
    detailPopup = window.open("", "detail", "width=100,height=100");
    detailPopup.close();
    detailNews = window.open("", "News", "width=100,height=100");
    detailNews.close();
    vdb = window.open("", "vdb", "width=100,height=100");
    vdb.close();
    addToUserpage = window.open("", "addToUserpage", "width=100,height=100");
    addToUserpage.close();
    addToPortfolio = window.open("", "addToPortfolio", "width=100,height=100");
    addToPortfolio.close();
    editPortfolio = window.open("", "editPortfolio", "width=100,height=100");
    editPortfolio.close();
    addLimit = window.open("", "addLimit", "width=100,height=100");
    addLimit.close();
    editLimit = window.open("", "editLimit", "width=100,height=100");
    editLimit.close();
}
function showHelp(file) {
    window_id = window.open(file, "help", "width=800, height=500, status=no, toolbar=no, menubar=no, location=no, resizable=yes, scrollbars=auto");
    window_id.focus();
}

function trim(text){
    return text.replace(/^\s*|\s*$/g,"");
}

//SET HEIGHT OF THE IFRAME TO HEIGHT OF THE TABLE TO AVOID SCROLLBARS
function set_iframe_height(id)
{
    var page_height;
    if (navigator.appName == "Microsoft Internet Explorer")
    {
        page_height = document.body.scrollHeight;
    }
    else
    {
        page_height = document.body.offsetHeight;
    }
    if (page_height <= 0)
    {
        if (id == "news_iframe")
        {
            page_height = 100;
        }
        else if (id.match(/tpl/))
        {
            page_height = 120;
        }
        else
        {
            page_height = 280;
        }
    }
    try
    {
        parent.document.getElementById(id).height = page_height;
    }
    catch (e)
    {
    }
}

function submitTimeserie(period, mode) {
    var time = document.getElementById("time").value;
    var len = document.getElementById("len").value;
    var order = "asc";
    var radio_time = "from";
    if (document.timeserie_form.radio_time[0].checked) {
        radio_time = "to";
        order = "desc";
    }
    var url;
    if (document.location.href.match("idscreen")) {
        var listing = document.getElementById("listing").value;
        url = "timesales.jsp?listing=" + listing + "&time=" + time + "&len=" + len + "&radio_time=" + radio_time + "&order=" + order;

    } else {
        var adjust;
        if (document.timeserie_form.adjust.name == "active")
            adjust = document.timeserie_form.adjust.checked ? "no" : "yes";
        else
            adjust = document.timeserie_form.adjust.value;
        var date = document.getElementById("date").value;
        url = "timesales_search_red.jsp?period_timeserie=" + period + "&time=" + time + "&len=" + len + "&radio_time=" + radio_time + "&date=" + date + "&mode=" + mode + "&order=" + order + "&adjust=" + adjust;
    }
    document.location.href = url;
}

function exportTimeserie(period, mode, listing) {
    var time = document.getElementById("time").value;
    var len = document.getElementById("len").value;
    var order = "asc";
    var radio_time = "from";
    if (document.timeserie_form.radio_time[0].checked) {
        radio_time = "to";
        order = "desc";
    }
    var adjust;
    if (document.timeserie_form.adjust.name == "active")
        adjust = document.timeserie_form.adjust.checked ? "no" : "yes";
    else
        adjust = document.timeserie_form.adjust.value;
    var date = document.getElementById("date").value;
    var url = "/idhtml/detail/export/timesales.jsp?"
            + "listing=" + listing
            + "&time_" + radio_time + "=" + time
            + "&radio_time=" + radio_time
            + "&len=" + len
            + "&date=" + date
            + "&order=" + order
            + "&mode=" + mode
            + "&date_" + radio_time + "=" + date
            + "&adjust=" + adjust
            + "&period_timeserie=" + period;
    document.location.href = url;
}

//Show Table
function st(tableId, lang) {
    parent.frames[3].location = "/idhtml/system/content_title.jsp?tableId=" + tableId;
    parent.frames[4].location = "/idhtml/system/content.jsp?tableId=" + tableId + "&lang=" + lang;
    parent.frames[5].location = "/idhtml/system/entry_title.jsp?entryId=none";
    parent.frames[6].location = "/idhtml/system/entry.jsp?entryId=none";
}

//Show table Entry
function se(entryId, lang, symbol) {
    parent.frames[5].location = "/idhtml/system/entry_title.jsp";
    parent.frames[6].location = "/idhtml/system/entry.jsp?entryId=" + entryId + "&lang=" + lang + "&symbol=" + symbol;
}


//Jump to Entry
function jte(id) {
    if (id != "" && id != "null" && id != "none" && document.getElementById(id)) {
        document.getElementById(id).scrollIntoView();
    }
}


//Close popup if opener doesn't exists
function checkForOpener() {
    try {
        if (window.opener.name) {
            throw "open";
        }
    }
    catch (e) {
        if (e != "open") {
            this.close();
        }
    }
}


function closeDetailWindow(){
    try {
        if (window.opener.name) {
            throw "open";
        }
    }
    catch (e) {
        if (e != "open") {
            this.close();
        }
    }
}

// Open news detail from e.g. analyse page
function openNews(listingNr) {
    document.location.href = "/idhtml/detail/news_red.jsp?listing=" + listingNr;
}
function openPDF(page) {
    window.open(page,"screenerPDF");
}
function getListings(type) {
    if (this.document.location.href.match("heatmap") == null) {
        var lists = document.getElementsByName("list");
        var rows = new Array();
        var listings = new Array();
        for (var i = 0; i < lists.length; i++) {
            rows = lists[i].childNodes[lists[i].childNodes.length - 1].childNodes;
            for (i2 = 1; i2 < rows.length; i2++) {
                if (rows[i2].className == "selected") {
                    if(document.location.href.match("limit")){
                        listings.push(rows[i2].id);
                    }
                    else {
                        listings.push(rows[i2].id.split(";")[0]);
                    }
                }
            }
        }
    }
    else {
        var tbodys = document.getElementById("heatmap").childNodes;
        var trs = tbodys[tbodys.length - 1].rows;
        var listings = new Array();
        var tds =  new Array();
        for (i = 0; i < trs.length; i++) {
            tds = trs[i].cells;
            for (i2 = 0; i2 < tds.length; i2++) {
                if (tds[i2].className == "selected") {
                    if(document.location.href.match("limit")){
                        listings.push(tds[i2].id.split(";")[0]);
                    }
                    else {
                        listings.push(tds[i2].id);
                    }
                }
            }
        }
    }
    if (type == "string") {
        return listings.join(";");
    } else {
        return listings;
    }
}
function getTableValues(col) {
    var symbols = new Array;
    var rows = document.getElementById("list").rows;
    for (i = 1; i < rows.length; i++) {
        if (rows[i].className == "selected" && rows[i].cells[col].childNodes.length > 0) {
            symbols.push(rows[i].cells[col].childNodes[0].nodeValue);
        }
    }
    return symbols.join(",");
}
function sendRequest(url) {
    /*
     var response;
     var xmlhttp = false;
     if (!xmlhttp && typeof XMLHttpRequest != "undefined") {
     try {
     xmlhttp = new XMLHttpRequest();
     }
     catch (e) {
     xmlhttp = false;
     }
     }
     if (!xmlhttp && window.ActiveXObject) {
     try {
     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
     }
     catch (e) {
     xmlhttp = false;
     }
     }
     xmlhttp.open("POST", url, true);
     xmlhttp.onreadystatechange = function () {
     response = xmlhttp.responseText;
     };
     xmlhttp.send(null);
     */
    document.location = url;
}
function removeListings() {
    var trs = getListings();
    var tr;
    for (i = 0; i < trs.length; i++) {
        tr = document.getElementById(trs[i]);
        tr.parentNode.removeChild(tr);
    }
}
function actionRenameList(url, newName) {
    var divs = opener.document.getElementsByTagName("div");
    var oldName;
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected") {
            oldName = divs[i].id;
            break;
        }
    }
    var actionPath = url + "?oldName=" + encodeURIComponent(oldName) + "&newName=" + encodeURIComponent(newName);
    sendRequest(actionPath);
    opener.selected_list = newName;
    opener.document.getElementById(oldName).firstChild.nodeValue = newName;
    opener.document.getElementById(oldName).id = newName;
    opener.parent.frames["content_frame"].document.getElementById("pageTitle").firstChild.nodeValue = newName;
    this.close();
}
