
/**
 * Telekurs iD Javascript Utils functions.
 * @author mbu
 *
 *
 */

/**
 *  getListingInfo : retrieve listing info from a passed event
 *  input:
 *      event : jQuery event containing id value in event.data
 *  output:
 *      JS Array containing id, owner and parent value
 */
var window_id=undefined;
function getListingInfos(event) {
    var data = event.data;
    var infos=data.id.split("__");
    var resArray = new Array();
    resArray["id"]=infos[2];
    resArray["owner"]=infos[0];
    resArray["parent"]="";
    if (infos[1]!="null" && infos[1]!="") resArray["parent"] = infos[1];
    if (infos.length>3) {
        //link information
        resArray["refid"] = infos[3];
        resArray["refowner"] = infos[4];
    }
    if (infos.length>5) {
        resArray["name"] = infos[5];
    }
    if (infos.length>6) {
        resArray["lc"] = infos[6];
    }
    return resArray;
}

function getListingInfosFromString(data) {
    var infos=data.split("__");
    var resArray = new Array();
    resArray["id"]=infos[2];
    resArray["owner"]=infos[0];
    resArray["parent"]="";
    if (infos[1]!="null" && infos[1]!="") resArray["parent"] = infos[1];
    if (infos.length>3) {
        //link information
        resArray["refid"] = infos[3];
        resArray["refowner"] = infos[4];
    }
    if (infos.length>5) {
        resArray["name"] = infos[5];
    }
    if (infos.length>6) {
        resArray["lc"] = infos[6];
    }
    return resArray;
}



function createListId(id)
{
    var key = "";
    for (i = 0; i < id.length; i++)
    {
        key = key + id.charCodeAt(i);
    }
    return key;
}

function showContextMenu(key,element,event) {
    var key = key.split(";")[0];
    if (e_m.length>0) {
        var screener = e_m[key][1];
        var hemscott = e_m[key][2];
        var infinancials = e_m[key][3];
        var name = e_m[key][4];
        if (name=="0") {
            if(typeof disableContextMenu == 'function') {
                disableContextMenu();
            }
        }
    }
    listingNr = key;
    contextMenu.trigger('open', new Array(new Array(element,event)));
}
function showSimpleContextMenu(key,element) {
    contextMenu.trigger('open',new Array(element));
}

function setFavorite(forward_path, data, type) {
    var ypos = (screen.height - 150) / 2;
    var xpos = (screen.width - 450) / 2;
    if (type == "favorite") {
        window_id = window.open("/idhtml/favorites/set.jsp?url=" + encodeURIComponent(data), "setFavorite", "width=450, height=150, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
    } else {
        window_id = window.open("/idhtml/ticker/set.jsp?url=" + forward_path + "&query=" + encodeURIComponent(data), "setFavorite", "width=450, height=150, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
    }
    //	window_id.moveTo(xpos, ypos);
}

var styles_window_id = "";
function openStyles(style, origin, list, list_owner){
    var ypos = (screen.height - 500) / 2;
    var xpos = (screen.width - 300) / 2;
    var url = "/idhtml/styles/styles.jsp?style=" + encodeURIComponent(style) + "&origin=" + origin;
    //	alert("list=" + list + " list_owner=" + list_owner);
    if (undefined != list)
        url += "&list=" + list;
    if (undefined != list_owner)
        url += "&list_owner=" + list_owner;
    //	alert(url);
    styles_window_id = window.open(url, "styles", "top=" + ypos + ", left=" + xpos + ", width=300, height=500, status=no, toolbar=no, menubar=no, location=no, resizable=yes, scrollbars=yes, dependent=yes");
    if (styles_window_id!=null) styles_window_id.focus();
}

function closeStyles() {
    if (undefined != styles_window_id && styles_window_id != "")
        styles_window_id.close();
}

function showTicker(data,element){
    var id = document.getElementById(selected_list);
    selected_list = element.id;
    ypos = (screen.height - 514) / 2;
    xpos = (screen.width -100) /2;
    data = unescape(data);
    if (data.search("type=quotes") > -1){
        window_id = window.open("/idhtml/ticker/ticker_quotes.jsp?" + data + "&ticker=" + element.id, "quotesTicker", "width=514, height=250, status=no, toolbar=no, menubar=no, location=no, resizable=yes");
    }
    if (data.search("type=news") > -1){
        window_id = window.open("/idhtml/ticker/ticker_news.jsp" + data + "&ticker_name=" + selected_list, "newsTicker", "width=700, height=300, status=no, toolbar=no, menubar=no, location=no, resizable=yes, scrollbars=yes");
    }
}


function toLimit() {
    ypos = (screen.height - 540) / 2;
    xpos = (screen.width - 500) / 2;
    window_id = window.open("/idhtml/limit/add.jsp?listing=" + listingNr, "addLimit", "width=500, height=540, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
    window_id.focus();
}

function toPortfolio() {
    ypos = (screen.height - 370) / 2;
    xpos = (screen.width - 460) / 2;
    var listings = new Array(listingNr);
    if ($(".multiselect").size()>0) listings = $(".multiselect").getSelection();
    if (listings.length > 1)
    {
        window_id = window.open("/idhtml/portfolio/add_to_portfolio_multiple.jsp?listing=" +  listings.join(";").replace(/n/g,"").replace(/_/g,","), "addToPortfolio", "width=460, height=150, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
    }
    else
    {
        window_id = window.open("/idhtml/portfolio/add_to_portfolio.jsp?listing=" + listingNr, "addToPortfolio", "width=460, height=370, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
    }
    window_id.focus();

}


function addListing() {
    var targetPos = document.getElementById($(".multiselect").getSelection()[0]).rowIndex;
    window_id = window.open("/idhtml/search/add_listing.jsp?targetPos=" + targetPos, "addListing", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes");
    window_id.focus();
}

function NewsPopup(theURL, winName, features) {
    //	alert(theURL + " " + winName + " " + features);
    window.open(theURL, winName, features);
}

function showHelp(file) {
    window_id = window.open(file, "help", "width=800, height=500, status=no, toolbar=no, menubar=no, location=no, resizable=yes, scrollbars=auto");
    window_id.focus();
}

function toUserpage(listing) {
    ypos = (screen.height - 200) / 2;
    xpos = (screen.width - 500) / 2;
    if (this.location.href.match("userpage") != null)
    {
        window_id = window.open("/idhtml/listing/add_to_userpage.jsp?listings=" + listing, "addToUserpage", "width=400, height=420, status=no, toolbar=no, menubar=no, location=no, scrollbars=yes, resizable=yes, left=" + xpos + ", top=" + ypos);
    }
    else
    {
        var listings = new Array(listingNr);
        if ($(".multiselect").size()>0) listings = $(".multiselect").getSelection();
        window_id = window.open("/idhtml/listing/add_to_userpage.jsp?listings=" + listings.join(";"), "addToUserpage", "width=400, height=420, status=no, toolbar=no, menubar=no, location=no, scrollbars=yes, resizable=yes, left=" + xpos + ", top=" + ypos);
    }
    window_id.focus();
}

function openPDF(page) {
    window.open(page,"screenerPDF");
}

function openNews(listingNr) {
    document.location = "/idhtml/detail/news.jsp?listing=" + listingNr;
}

function getMoveString() {
    var sourceRow;
    var listings = $(".multiselect").getSelection();
    var ris = "";
    for(i = 0; i < listings.length; i++){
        if (i > 0)
            ris += ";";
        sourceRow = document.getElementById(listings[i]);
        ris += sourceRow.rowIndex - 1;
    }
    return ris;
}

function addListingToPos(position) {
    var rows = opener.document.getElementById("list").rows;
    var targetRow;
    var pos;
    var listings = $(".multiselect").getSelection().join(";");
    for (i = 1; i < rows.length; i++) {
        if ($(rows[i]).hasClass("selected")) {
            listingNr = opener.document.getElementById(rows[i].id).id;
            targetRow = opener.document.getElementById(listingNr);
            break;
        }
    }
    if (position == "after")
        pos = targetRow.rowIndex;
    else
        pos = targetRow.rowIndex - 1;
    var url;
    var topen = opener;
    var ypos, xpos;
    if (topen.document.location.href.search("portfolio") > -1) {
        if ($(".multiselect").getSelection().length > 1) {
            url = "/idhtml/jspAction/addPortfolioListing/idhtml/close_top.jsp?list=" + encodeURIComponent(topen.portfolioName) + "&listing=" + listings + "&to=" + pos;
            document.location.href = url;
        } else {
            ypos = (screen.height - 370) / 2;
            xpos = (screen.width - 460) / 2;
            topen.window_id = topen.window.open("/idhtml/portfolio/add_to_portfolio.jsp?portfolioId=" + encodeURIComponent(topen.portfolioId) + "&listing=" + listings + "&pos=" + pos, "addToPortfolio", "width=460, height=370, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
            topen.window_id.focus();
            window.close();
        }
    }
    else if (topen.document.location.href.search("listing") > -1) {
        ypos = (screen.height - 370) / 2;
        xpos = (screen.width - 460) / 2;
        topen.window_id = topen.window.open("/idhtml/jspAction/addListingListListing/idhtml/close.jsp?refreshOpener=true&list=" + encodeURIComponent(topen.listName) + "&listing=" + listings + "&to=" + pos, "addToPortfolio", "width=460, height=370, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
        topen.window_id.focus();
        window.close();
    }
}

function saveStartPage() {
    if (start_path != undefined && start_url != undefined)
        document.location.href = start_path + encodeURIComponent(start_url);
}

function saveStartPortfolio(forward_path, data) {
    document.location.href = forward_path + '?startPortfolio=' + encodeURIComponent(data);
}

function formatPrice(inputField) {
    var el = document.getElementById(inputField);
    if (null != el)
    {
        el.value = el.value.replace(/[']/g, "");
    }
}

function showDetail(listing, red) {
    if (red) {
        detailPopup = window.open("/idhtml/detail/overview_red.jsp?listing=" + listing, "detail", "width=1030, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
    } else {
        detailPopup = window.open("/idhtml/detail/frameset.jsp?listing=" + listing, "detail", "width=1030, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
    }
    detailPopup.focus();
}

function saveStyleToList(forward_path, data)
{
    var url = forward_path + data;
    document.location.href = url;
}


function addslashes(str) {
    str=str.replace(/\\/g,'\\\\');
    str=str.replace(/\'/g,'\\\'');
    str=str.replace(/\"/g,'\\"');
    return str;
}

function getSearchSelectionFromTKFTable(tableId,field,selectOne) {
    var window_id;
    ypos = (screen.height - 450) / 2;
    xpos = (screen.width - 800) / 2;
    var url = "/idhtml/search/searchtable.jsp?id=" + tableId+"&field="+field+"&selectOne="+selectOne;
    window_id = window.open(url, "search_filter_table", "width=800, height=450, status=no, toolbar=no, menubar=no, location=no, resizable=yes, scrollbars=yes, left=" + xpos + ", top=" + ypos);
    window_id.focus();
}

function loadListingDisplay(list, _owner, mode, params) {
    var url = "/idhtml/listing/displayIframe.jsp?list=" + list + "&owner=" + _owner;
    if (params != 'undefined')
        url += params;
    frames['iframeListingList'].location.href = "/idhtml/listing/displayIframe.jsp?list=" + list + "&owner=" + _owner;
}

function loadListingDisplayIframe(list, owner, params) {
    document.location.href = "/idhtml/listing/displayIframe.jsp?list=" + list + "&owner=" + owner + params;
}

function sw(elem, color) {
    elem.style.backgroundColor = color;
}

function closeAllChilds() {
    return false;
}
